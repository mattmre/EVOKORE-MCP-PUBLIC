# EVOKORE-MCP — New User Brutal Honesty Kit

This is the document that exists so a new operator does not get surprised in production. Every entry is a sharp edge — something that is true, something that will bite, or something a polished marketing page would leave out. Severity is scored on a 1–5 scale: 1 means a minor papercut, 5 means data loss or unrecoverable failure if ignored.

If you only read one EVOKORE doc before committing to use it for real work, read this one.

## What this covers

- Runtime prerequisites and version gotchas
- Discovery-mode behavior and which one to start in
- Schema-deferred mode and why it is opt-in
- Where state actually lives on disk
- Async proxy boot semantics
- Child server failure isolation
- Required environment configuration
- Test runner expectations
- The wiki, the presentations, and where the work shows up
- Pointers to the troubleshooting surface

## 1. Node version: must be 20 or higher (severity 5)

EVOKORE-MCP v3 requires Node.js 20 or newer. The codebase uses runtime features and dependencies that simply will not load on Node 18 or below. Symptoms when you try anyway: cryptic `SyntaxError` on startup, or worse, silent partial loading where some managers register and others throw later. Confirm with `node --version` before anything else.

## 2. Default discovery mode is dynamic, not legacy (severity 3)

If you leave `EVOKORE_TOOL_DISCOVERY_MODE` unset, EVOKORE defaults to `dynamic`. In dynamic mode, your AI client sees only the native tools in `tools/list` until something calls `discover_tools`. Proxied tools (from GitHub, filesystem, ElevenLabs, Supabase, etc.) are hidden by default. They remain callable by exact prefixed name (for example `github_create_issue`), but they will not appear in the listing.

**This is the right default for token efficiency.** It is the wrong default if your AI client cannot or will not call `discover_tools`. If you see "the assistant cannot find my GitHub tools," set `EVOKORE_TOOL_DISCOVERY_MODE=legacy` and rebuild your expectations. Verify your selection by calling `tools/list` directly and confirming the proxied surface is present.

## 3. Schema-deferred mode breaks some clients (severity 4)

`EVOKORE_TOOL_SCHEMA_MODE=deferred` strips `inputSchema` from the `tools/list` response, replacing it with a placeholder. Clients that fan out tool schemas eagerly and do not implement `describe_tool` will degrade badly. If no client calls `describe_tool` within `EVOKORE_TOOL_SCHEMA_FALLBACK_MS` (default 60000 ms), EVOKORE auto-reverts to full mode and emits one warning to stderr.

**Default is `full`. Leave it on `full` unless you have explicitly verified your client implements the `describe_tool` bootstrap.** Client compatibility for deferred-schema is not uniform across the ecosystem. The auto-fallback is a safety net, not a license to enable this in production without testing.

## 4. State lives in `~/.evokore/`, not in your repo (severity 3)

EVOKORE keeps every operationally relevant artifact under your home directory:

- `~/.evokore/sessions/{sessionId}.json` — session manifest
- `~/.evokore/sessions/*-replay.jsonl` — append-only tool-call log
- `~/.evokore/sessions/*-evidence.jsonl` — captured evidence
- `~/.evokore/sessions/*-tasks.json` — TillDone task state
- `~/.evokore/sessions/{sessionId}.json` — runtime continuity manifest
- `~/.evokore/logs/hooks.jsonl` — hook observability log (with `.1`, `.2`, `.3` rotated copies)
- `~/.evokore/cache/location.json` and `weather.json` — status-line cache
- `~/.evokore/pending-approvals.json` — HITL approval queue

If you back up your repository and forget about `~/.evokore/`, you back up no history of what your assistant did. If you wipe your home directory (a clean reinstall of your OS, for example), you lose every session manifest, replay, and evidence trail. **Treat `~/.evokore/` as production state.**

Log rotation is 5 MB max size with 3 rotations; session pruning runs at 30 days max age with a 100-file ceiling.

## 5. Proxy boot is asynchronous and silent (severity 4)

The MCP handshake completes immediately. Native tools are usable instantly. Child servers (GitHub, filesystem, etc.) boot in the background, after the handshake. This means:

- A child-server failure does not show up in the handshake response. You will see the missing tools later, when your assistant tries to use them.
- The only signal of boot completion is the stderr line `Proxy bootstrap complete`. The only signal of failure is `Background proxy bootstrap failed`.
- If you tail your client's MCP log and the child tools simply are not there, the proxy did not boot. Check the configured env vars (most failures are missing `${VAR}` placeholders that the child server demanded).

The boot timeout is configurable via `EVOKORE_CHILD_SERVER_BOOT_TIMEOUT_MS` (default 30000 ms). If your network is slow to a child server, raise it.

## 6. Child-server failures are isolated, which is a feature but feels like a bug (severity 2)

If one child server crashes on boot or during operation, EVOKORE keeps the others running and keeps the native tools available. Your assistant sees the live tools and tries to make progress. This is intentional — partial availability is better than a fully dead router — but the first time it happens it looks like EVOKORE is broken in a non-deterministic way. Check the stderr for the failing-child-server sentinel before assuming a router-wide problem.

## 7. `.env` is required, and it is loaded from the repo root (severity 4)

EVOKORE loads `.env` via `dotenv` from the repo root at startup. Without it, every `${VAR}` placeholder in `mcp.config.json` becomes an empty string and child-server boot fail-fasts on the affected server.

**Steps:**

1. Copy `.env.example` to `.env` in the repo root.
2. Fill in every variable your enabled child servers require (for example `GITHUB_PERSONAL_ACCESS_TOKEN`, `ELEVENLABS_API_KEY`, `SUPABASE_ACCESS_TOKEN`).
3. Validate with the env-sync test: every `process.env.EVOKORE_*` reference in `src/` must be documented in `.env.example`. If you add a new variable, add the matching commented-out example line in the same commit or CI fails.

Variables you do not set silently default to empty strings; the impact depends on the child server.

## 8. The test runner is `vitest`, not `node`, and `npm test` runs the full suite (severity 2)

EVOKORE uses `vitest` as its test runner. The old style of chaining `node test-*.js` files is gone. The relevant commands:

```bash
npm test               # vitest run, full suite
npx vitest run         # same, more direct
npx vitest run path    # single file or directory
npx vitest watch       # interactive watch mode
```

Around 2000 tests across roughly 120 files. Plan for the full suite to take meaningful wall-clock time on commodity hardware. If a single targeted file is what you want, name it explicitly.

## 9. The wiki is a build artifact, not a committed directory (severity 1)

The skill wiki under `wiki/skills-index.html` is generated from the `SKILLS/**/SKILL.md` corpus by `npm run wiki:build`. It is not committed to the repository because it is fully derived. If you clone the repo and look for `wiki/` and it is not there, that is expected. Run the build command, open the resulting `wiki/skills-index.html` in a browser, and browse the rendered per-skill pages locally. The flat lookup table in [All Skills Crib Sheet](./ALL_SKILLS_CRIB_SHEET.md) is committed; the rendered wiki is not.

## 10. Presentations are inline HTML with no CDN (severity 1)

The decks under `presentations/` are self-contained — no external scripts, no external stylesheets, no external fonts. They render correctly offline. This is by design (for review and audit environments without internet access). It also means they are styled simply on purpose; do not "modernize" them by adding a CDN import.

## 11. HITL approval is one-time and exact-args (severity 3)

When the assistant requests approval for a gated tool, EVOKORE returns a one-time `_evokore_approval_token` bound to the exact arguments. The retry must include the token AND the identical arguments. If the assistant decides to change a flag between the original request and the retry, the token is rejected and the operator is asked again.

This is correct security behavior. It can feel like the assistant is "stuck" if it tries to optimize the call between approval and retry. The fix: have the assistant retry with the exact original arguments, then ask for a new approval for a follow-up change.

## 12. Damage Control will block commands you might consider legitimate (severity 2)

The damage-control hook (a `PreToolUse` Claude Code hook) blocks force-push to protected refs, working-tree wipes, history rewrites onto shared branches, ref deletion of protected refs, reflog destruction, autonomous GitHub issue or PR filing from agent worktrees, and several other classes. Some of these you may want to do manually — for example, `git clean -fdx` is blocked, but `git clean -n` (dry run) and `git clean -fd <specific path>` are allowed.

If you hit a block, read the message: it tells you which rule fired and which environment variable (if any) opts out for your specific use case. Do not weaken or delete the rules file; extend the allowlist with a comment explaining why.

## 13. The session manifest is the source of truth, not the chat history (severity 4)

The assistant's "memory" between sessions is the session manifest plus the replay/evidence/task JSONL files, not the prior chat. If you edit those files by hand you can corrupt continuity. If you delete them you start from zero. The Claude memory directory generated by `npm run memory:sync` is a materialization of the manifest, not its source.

If a session feels "lost" — the assistant has no idea what you were doing — check `~/.evokore/sessions/` for the manifest. If it is missing or empty, the assistant has no prior context to load. The fix is to state intent at the start of the session; the `purpose-gate` hook injects it into context for the assistant.

## 14. The voice sidecar is a separate process (severity 1)

`VoiceSidecar` runs on `ws://127.0.0.1:8888` as a standalone process. It is never imported by the main `index.ts`. If you want voice output, start the sidecar separately. Audio playback uses platform players (no native audio dependencies). Persona configuration is hot-reloaded from `voices.json` on each new WebSocket connection.

If your hooks are configured to fire voice notifications but you do not hear anything, confirm the sidecar is actually running and listening. The main MCP server does not start it.

## 15. RBAC is opt-in (severity 3)

`EVOKORE_ROLE` is the switch. Unset, EVOKORE uses the flat per-tool permissions in `permissions.yml` and behaves the same as it did before RBAC existed. Set to `admin`, `developer`, or `readonly` (or a custom role you define), and the role's `default_permission` plus per-tool overrides take effect.

The default for an unset role is **whatever the flat permissions say**, which is usually permissive. If you want least-privilege as default, set `EVOKORE_ROLE=readonly` and explicitly allow what you need. If you want to test the role model, set `EVOKORE_ROLE=developer` and confirm that destructive operations are gated.

## 16. Webhooks are fire-and-forget with retries (severity 3)

`WebhookManager` delivers signed events to configured HTTP endpoints with up to three retries and exponential backoff. It does not buffer events to disk; if the process dies between emission and delivery, the event is lost. If your downstream system is critical, accept events idempotently (the envelope ID is a UUIDv4 you can dedupe on) and treat delivery as best-effort.

Signature verification requires `crypto.timingSafeEqual`. Do not implement your own constant-time compare — most implementations are not actually constant-time.

## 17. The Panel of Experts framework is verbose by design (severity 1)

Panel reviews target ≥800 words per expert per artifact. They are not summaries. If the model tries to compress, the review degrades. If you only need a quick sanity check, run a depth-1 review (one challenge round, no council, no concession). For high-stakes decisions, run depth 3 or 5. Pick depth based on the cost of getting the answer wrong, not the speed at which you want the answer.

Every panel run is auto-persisted to `docs/panel-reviews/YYYY-MM-DD/{panel-type}-{topic-slug}-{shortid}.md` and indexed. **A panel run that is not persisted is a run that did not happen.** If persistence fails, treat it as a failed review and rerun.

## 18. The orchestration framework enforces tier discipline (severity 2)

The Align-Execute-Prove cycle does not let you skip from Critical to Medium. Tier exit requires verification evidence for every item in the tier. If you try to push ahead, the workflow stops. The "fix" is to either capture evidence for the remaining Critical items, or formally defer them with a written unblock plan. There is no quiet bypass.

## 19. Self-approval on your own PRs is not possible via GitHub (severity 1)

If you set up the PR-manager workflow to self-review, GitHub will block the approval. The workaround is to record the review result as a normal PR comment instead of an `approve` review. This is GitHub behavior, not an EVOKORE limitation, but it surprises people the first time.

## 20. The pointers you actually want for fixes

| When the symptom is... | Go here |
|---|---|
| Setup or install confusion | [Setup](./SETUP.md) |
| A specific failure mode you want diagnosed | [Troubleshooting](./TROUBLESHOOTING.md) |
| Discovery-mode behavior is not what you expected | [Tools and Discovery](./TOOLS_AND_DISCOVERY.md), [Tool Discovery Profiles](./TOOL_DISCOVERY_PROFILES.md) |
| Permission denials | [RBAC Guide](./guides/RBAC_GUIDE.md), `permissions.yml` |
| Webhook signatures or delivery issues | [Webhook Guide](./WEBHOOK_GUIDE.md), [Webhook Envelope v1](./WEBHOOK_ENVELOPE_V1.md) |
| Voice output not happening | [Voice and Hooks](./VOICE_AND_HOOKS.md), [Voice Sidecar Guide](./guides/VOICE_SIDECAR_GUIDE.md) |
| HTTP transport behavior | [HTTP Deployment](./HTTP_DEPLOYMENT.md), [OAuth Setup](./OAUTH_SETUP.md) |
| You want to add a custom tool | [Plugin Authoring](./PLUGIN_AUTHORING.md) |
| You want the engineering shape of the whole thing | [Technical Analysis](./TECHNICAL_ANALYSIS.md), [Architecture](./ARCHITECTURE.md) |

## See also

- [Executive Summary](./EXECUTIVE_SUMMARY.md) — the non-technical companion to this kit
- [Technical Analysis](./TECHNICAL_ANALYSIS.md) — the engineering-facing companion
- [Setup](./SETUP.md) — first install
- [Troubleshooting](./TROUBLESHOOTING.md) — specific failure modes

Last verified: 2026-05-20
