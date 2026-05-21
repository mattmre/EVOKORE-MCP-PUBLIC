# EVOKORE-MCP — Technical Analysis

This is the engineer-facing companion to the [Executive Summary](./EXECUTIVE_SUMMARY.md). It is written for engineering leads who need to understand the runtime shape, decide whether to deploy EVOKORE-MCP, and predict how it will behave under real load. It assumes familiarity with the Model Context Protocol (MCP), JSON-RPC over stdio and HTTP, and the general shape of agentic tool use.

## What this covers

- Runtime architecture and module boundaries
- Tool surface and discovery model
- Continuity primitives (session manifests, evidence, replay)
- Security surfaces (RBAC, HITL approval, OAuth, webhook signing, sandbox)
- Deployment shapes (stdio vs HTTP, multi-tenant sessions)
- Validation and operational posture
- Known limitations and design choices

## Runtime architecture

EVOKORE-MCP is a TypeScript stdio MCP server built on `@modelcontextprotocol/sdk`. The server merges two tool populations into one catalog: native tools defined inside EVOKORE itself, and proxied tools fetched from configured child MCP servers. The merged catalog is then projected to the client based on the configured discovery mode.

Layer responsibilities:

| Layer | Module | Responsibility |
|---|---|---|
| MCP server | `src/index.ts` | stdio (or HTTP) transport, MCP request handlers, MCP resources/prompts, discovery-mode projection, session-scoped activation |
| Native tool layer | `src/SkillManager.ts` and 9 sibling managers | 37 native tools, skill retrieval, versioning, remote fetch, sandboxed execution, claims/fleet coordination, persistent memory, navigation anchors, telemetry, plugins |
| Proxy layer | `src/ProxyManager.ts` | Boots child servers (stdio + HTTP), prefixes tools, forwards calls, runs the token-bucket rate limiter, manages cooldown and error state, performs async boot |
| Security layer | `src/SecurityManager.ts` plus `permissions.yml` | Applies `allow`, `require_approval`, and `deny` policy with RBAC role support before proxied execution |
| Catalog / search | `src/ToolCatalogIndex.ts` | Merges native and proxied tools, indexes them for `discover_tools`, builds the projected tool list |
| Continuity / operator | `scripts/session-continuity.js`, `scripts/status-runtime.js`, `scripts/claude-memory.js`, `scripts/repo-state-audit.js` | Session manifests, status summaries, managed memory, repo-state preflight |
| Voice runtime | `src/VoiceSidecar.ts` | Standalone WebSocket voice server on `ws://127.0.0.1:8888`, separate from stdio routing |

## Tool populations

Native tools are always visible and never collide with proxied tools. The current breakdown across 10 managers:

| Manager | Tool count | Representative tools |
|---|---|---|
| `SkillManager` | 12 | `resolve_workflow`, `search_skills`, `discover_tools`, `execute_skill`, `fetch_skill`, `list_registry`, `refresh_skills`, `describe_tool` |
| `ClaimsManager` | 4 | `claim_acquire`, `claim_release`, `claim_list`, `claim_sweep` |
| `FleetManager` | 4 | `fleet_spawn`, `fleet_claim`, `fleet_release`, `fleet_status` |
| `MemoryManager` | 3 | `memory_store`, `memory_search`, `memory_list` |
| `OrchestrationRuntime` | 3 | `orchestration_start`, `orchestration_stop`, `orchestration_status` |
| `SessionAnalyticsManager` | 4 | `session_context_health`, `session_analyze_replay`, `session_work_ratio`, `session_trust_report` |
| `TelemetryManager` | 2 | `get_telemetry`, `reset_telemetry` |
| `WorkerManager` | 2 | `worker_dispatch`, `worker_context` |
| `NavigationAnchorManager` | 2 | `nav_get_map`, `nav_read_anchor` |
| `PluginManager` | 1 | `reload_plugins` |

Proxied tools are renamed to `${serverId}_${tool.name}` before exposure (for example `fs_read_file`, `github_create_issue`). Duplicate prefixed names are skipped with a logged warning; first registration wins.

## Discovery model

EVOKORE exposes the merged catalog through two modes:

- **`legacy`** — `tools/list` returns every native and proxied tool. Maximum client compatibility, largest initial payload.
- **`dynamic`** — `tools/list` returns native tools plus only the proxied tools activated for the current session. A client (or the model) calls `discover_tools` to search and activate proxied tools by name, original name, keywords, or fuzzy match.

Named profiles are layered on top:

| Profile | Intent | Approximate token cost |
|---|---|---|
| `coding` | Focused on code workflows and the most common engineering tools | small |
| `research` | Tuned for research, content, and analysis workflows | smaller |
| `voice` | Voice and hook-driven workflows | smallest |
| `legacy-full` | The full pre-v3.1 tool surface (no activation gate) | largest |
| `legacy-dynamic` | The v3.0 default (dynamic mode without a profile preset) | small |

A safety pin (`EVOKORE_TOOL_DISCOVERY_MODE=legacy`) overrides any profile selection. The benchmark harness reports real `js-tiktoken cl100k_base` counts so token budgets are measured, not estimated. Schema-deferred `tools/list` mode is opt-in and includes a compatibility-probe fallback that auto-reverts to full schemas after a configurable timeout so clients that do not call `describe_tool` are not stranded. See [Tool Discovery Profiles](./TOOL_DISCOVERY_PROFILES.md) and [Tools and Discovery](./TOOLS_AND_DISCOVERY.md) for details and client-compatibility notes.

## Async proxy boot

The MCP handshake completes before any child server starts. EVOKORE then:

1. Loads `mcp.config.json` and resolves `${VAR}` placeholders against the environment.
2. Boots each child server (stdio or HTTP, via `StreamableHTTPClientTransport`) under a configurable timeout (`EVOKORE_CHILD_SERVER_BOOT_TIMEOUT_MS`, default 30000 ms).
3. Initializes rate limiters from any `rateLimit` blocks in config.
4. Fetches each child's tool list and registers the prefixed proxies.
5. Rebuilds the merged catalog and emits a `tools/list_changed` notification.
6. Logs `"Proxy bootstrap complete"` or `"Background proxy bootstrap failed"` to stderr.

The async boot has two operational consequences: native tools are usable immediately, and a failing child server does not block the rest of the catalog. Failures are isolated to the specific child server.

## Continuity primitives

EVOKORE makes long-running operator work restartable through four file-backed primitives, all under `~/.evokore/`:

| Path | Purpose |
|---|---|
| `~/.evokore/sessions/{sessionId}.json` | Session manifest: operator-stated purpose, lifecycle metadata, pointers to sibling artifacts, derived counters |
| `~/.evokore/sessions/*-replay.jsonl` | Append-only log of every tool call in the session |
| `~/.evokore/sessions/*-evidence.jsonl` | Captured evidence: test runs, file changes, git operations, verification-quality scores |
| `~/.evokore/sessions/*-tasks.json` | TillDone task state |

The manifest is the canonical surface. Hook scripts (`purpose-gate`, `session-replay`, `evidence-capture`, `tilldone`, `voice-stop`, `damage-control`, `repo-audit-hook`) all read or update it. A status helper reduces the manifest plus git state into a single line for human consumption. A separate sync helper materializes a Claude project memory directory from the manifest plus repo state so the assistant has durable context across sessions.

Observability writes a JSONL log to `~/.evokore/logs/hooks.jsonl` with 5 MB rotation and a retained history of three rotations. Stale sessions are pruned opportunistically; the in-memory dynamic-discovery activation set is bounded.

## Security surfaces

### Human-in-the-loop approval

JSON-RPC over stdio is stateless. EVOKORE cannot natively raise a UI prompt in the AI client's terminal, so it returns a structured error containing a one-time `_evokore_approval_token`. The AI surfaces the request to the operator; once the operator approves, the AI retries the call with the token injected. Tokens are bound to exact arguments and short-lived. The session dashboard at `127.0.0.1:8899/approvals` exposes a deny UI for pending tokens stored in `~/.evokore/pending-approvals.json`.

### Role-based access

`permissions.yml` carries both flat per-tool rules (`allow`, `require_approval`, `deny`) and role definitions. `EVOKORE_ROLE` selects a role (`admin`, `developer`, `readonly` by default; custom roles supported). Resolution order: per-tool override in the role, then the role's `default_permission`, then the flat rules. When `EVOKORE_ROLE` is unset, behavior is backwards-compatible with the flat-permissions model.

### Rate limiting

Token-bucket rate limiting is configurable per server and per tool through `rateLimit` blocks in `mcp.config.json`. `maxTokens` defines burst capacity; `refillRate` and `refillIntervalMs` control sustained throughput. Rate limiting is independent of the error-triggered cooldown mechanism (which throttles a tool after repeated upstream failures).

### OAuth bearer-token authentication (HTTP transport only)

`src/auth/OAuthProvider.ts` validates Bearer tokens on HTTP transport requests. Issuer, audience, and JWKS URI are configured via `EVOKORE_OAUTH_ISSUER`, `EVOKORE_OAUTH_AUDIENCE`, and `EVOKORE_OAUTH_JWKS_URI`. JWKS-based key rotation is supported.

### Webhook signing

`WebhookManager` emits HMAC-SHA256-signed events to configured HTTP endpoints. Delivery is fire-and-forget with up to three retries and exponential backoff. Tool arguments are redacted for sensitive keys before emission. Signature verification uses `crypto.timingSafeEqual`. The full v1 envelope spec is in [Webhook Envelope v1](./WEBHOOK_ENVELOPE_V1.md).

### Skill execution sandbox

`execute_skill` extracts code blocks from a skill body and runs them with a 30-second timeout and a 1 MB output limit. Supported runtimes: bash, JavaScript, Python, TypeScript.

### Damage Control

A pre-tool-use hook evaluates every shell command and file path against a YAML rule set (`damage-control-rules.yaml`). The rule set blocks force-push to protected refs, working-tree wipes, history rewrites onto shared branches, ref deletion of protected refs, reflog destruction, autonomous GitHub issue or PR filing from agent worktrees, and other classes of high-risk operations. The hook fails open if the rules file is missing.

## Deployment shapes

### stdio (default)

The AI client spawns EVOKORE as a child process and communicates over stdin/stdout. The session lifecycle is bound to the client process; one stdio session uses a single default session key for dynamic-discovery activation. Recommended for local developer use.

### HTTP (StreamableHTTP)

Set `--http` (or `EVOKORE_HTTP_MODE=true`) to listen on a TCP port (default `127.0.0.1:3100`). The HTTP transport supports concurrent client connections with per-connection session isolation via `SessionIsolation`. Each connection gets independent tool activation state and session context, with a configurable TTL. Bearer-token authentication is available via the OAuth provider. A health endpoint at `/health` returns transport readiness. For deployment behind a reverse proxy and TLS termination, see [HTTP Deployment](./HTTP_DEPLOYMENT.md).

## MCP resources and prompts

`resources/list` returns:

- Each indexed skill as `skill://{category}/{name}`
- `evokore://server/status` — aggregated child-server status
- `evokore://server/config` — sanitized server configuration
- `evokore://skills/categories` — skill category taxonomy

`prompts/list` returns three prompts: `resolve-workflow`, `skill-help`, and `server-overview`. Prompts accept arguments and return structured message arrays.

## Plugins

`PluginManager` loads single-file JavaScript plugins from a configurable directory (`EVOKORE_PLUGINS_DIR`, default `plugins/`). Each plugin exports a manifest with `name`, optional `version`, and a `register(context)` function. Plugins register tools and resources alongside native and proxied tools. The `reload_plugins` tool hot-reloads the directory at runtime. Webhook events fire on plugin load, unload, and load errors.

## Skill ecosystem

Skills live under `SKILLS/` as `SKILL.md` files with YAML frontmatter. `SkillManager` indexes them recursively. The current corpus is 266 SKILL.md files across 16 active categories (with reference leaves the recursive index sees roughly 336 entries). Frontmatter supports `version`, `requires`, `conflicts` for dependency validation; `aliases`, `resolutionHints`, and `tags` for `resolve_workflow` ranking; and `upstream`, `upstream-sha`, `upstream-path` for adapter skills that port a vendored upstream.

A static composition graph (`skill-graph.json`, regenerated via `npm run skill-graph`) scans skill bodies for invocation phrases and emits `nextSteps[]` edges. `execute_skill` returns those next steps; the runtime auto-activates matching tool entries and emits a single `tools/list_changed` notification. Cycles are rejected at insert time. A truth-score gate blocks auto-activation of destructive next steps until a passing verification-quality evidence row appears in the session's evidence JSONL.

## Validation surface

The project uses `vitest` for the full regression. Around 2000 tests across roughly 120 files cover the manager surface, hook behavior, security policy, webhook signing, plugin lifecycle, session continuity, and docs guardrails. Operator-facing primary commands:

```bash
npm run build       # tsc compile
npm test            # vitest run, full suite
npm run repo:audit  # preflight: branch divergence, worktree pressure, stale branches, open PR heads, control-plane drift
```

Targeted validation guards exist for env-sync (every `EVOKORE_*` env reference in `src/` must have a matching `.env.example` line), docs-canonical-links, voice transport, hook observability, tool-prefix collisions, Windows command resolution, and the PR metadata format.

## Operational posture

- **Failure isolation.** A failing child server does not block the catalog; native tools and other child servers stay usable.
- **Backwards compatibility.** Default discovery mode falls back to dynamic; legacy is a one-line opt-back. Default schema mode is full; deferred-schema is opt-in. RBAC is opt-in via `EVOKORE_ROLE`; flat permissions remain valid when unset.
- **No external dependencies at runtime.** The dashboard is a zero-dependency HTTP server; presentations are inline HTML; the voice sidecar plays through platform players, not native bindings.
- **Cross-platform.** Windows command resolution remaps only `npx` to `npx.cmd`; `uv` and `uvx` must resolve directly on PATH.

## Known limitations

- **Single stdio session key.** In stdio runtime, dynamic-discovery activation uses one default session key; isolation becomes meaningful only when an HTTP transport supplies distinct `sessionId` values.
- **Permission model granularity.** Permissions are per-tool, not per-argument; argument-aware policy would require a deeper rewrite.
- **No built-in distributed coordination.** Claims and fleet coordination are local to a single EVOKORE instance; multi-instance coordination is out of scope.
- **Skill graph is static.** Composition edges come from static text scanning, not runtime tracing; a skill that invokes another via runtime data flow is not represented.

## See also

- [Architecture](./ARCHITECTURE.md) — module-level deep dive with diagrams
- [Tools and Discovery](./TOOLS_AND_DISCOVERY.md) — the discovery lifecycle and benchmark contract
- [Tool Discovery Profiles](./TOOL_DISCOVERY_PROFILES.md) — named profiles and token budgets
- [HTTP Deployment](./HTTP_DEPLOYMENT.md) — running over StreamableHTTP
- [OAuth Setup](./OAUTH_SETUP.md) — Bearer-token authentication and JWKS
- [Webhook Guide](./WEBHOOK_GUIDE.md) and [Webhook Envelope v1](./WEBHOOK_ENVELOPE_V1.md) — event delivery and signing
- [Plugin Authoring](./PLUGIN_AUTHORING.md) — adding custom tools
- [Testing and Validation](./TESTING_AND_VALIDATION.md) — validation surface
- [Architecture: AEP System](./ARCH_AEP_SYSTEM.md) — Align-Execute-Prove engineering cycle
- [Panel of Experts](./PANEL_OF_EXPERTS.md) — multi-persona review framework

Last verified: 2026-05-20
