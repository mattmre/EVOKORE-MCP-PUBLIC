# Tool Discovery Profiles

EVOKORE ships a `ProfileResolver` runtime, five named presets, a tokenizer-backed benchmark, and a documented safety pin so operators can ship a focused tool surface that fits a connecting client's context budget.

## What this covers

- Why profiles exist and which one to choose
- How to opt in via env var or `mcp.config.json`
- Resolution precedence and the safety pin
- Mandatory injection-point skills
- Measured token counts for each shipped profile
- How to customize profiles and re-run the benchmark
- Schema-deferred `tools/list` (`describe_tool`, opt-in)
- The `nextSteps[]` skill composition graph

## Why profiles

EVOKORE-MCP aggregates dozens of native tools and proxies child MCP servers (GitHub, filesystem, ElevenLabs, Supabase, etc.). The combined `tools/list` payload was historically 12K-31K tokens, which dominates context windows on every connecting client.

The `ProfileResolver` lets operators ship a focused tool surface keyed to their workflow. Five presets are shipped in the canonical `mcp.config.json` so an operator can opt in without authoring profile JSON from scratch.

## Picking a profile

| Profile | When to pick it | Always-visible scope |
|---|---|---|
| `coding` | Day-to-day implementation work: editing files, running git, opening PRs, executing skills. | Native skill tools + memory/claims + filesystem MCP + GitHub MCP write/read tools |
| `research` | Read/search-heavy sessions: navigating the repo, querying memory, generating docs, working through `resolve_workflow`. | Native skill tools + memory + navigation + read-only filesystem + GitHub search/read |
| `voice` | Voice sidecar sessions where the only surface needed is ElevenLabs + minimum discovery. | Discovery / skill resolution + every `elevenlabs_*` proxy tool |
| `legacy-full` | Compatibility shim — every native + every proxy tool ships in `tools/list`. | All native + all proxy |
| `legacy-dynamic` | Native tools always visible, proxy tools dynamic (no tier filtering). | All native |
| `default` (built-in) | When no profile is selected. Identical to `legacy-dynamic`. | All native |

If you are unsure, start with `coding`. It has the broadest day-to-day surface and stays well under the 8K-token budget.

## Opting in

```bash
# Via env var (overrides discovery.activeProfile in mcp.config.json):
export EVOKORE_DISCOVERY_PROFILE=coding

# Or set it in mcp.config.json:
# {
#   "discovery": {
#     "activeProfile": "research",
#     "profiles": { ... }
#   }
# }
```

When no profile is selected, EVOKORE falls back to the built-in `default` profile, which is byte-identical to the legacy dynamic-mode behavior (all native tools always visible, proxies dynamic).

### Safety pin

`EVOKORE_TOOL_DISCOVERY_MODE=legacy` remains a hard safety pin. When set, EVOKORE ignores any selected profile and forces the built-in default. Use this if you need to roll back to a known-good state without editing `mcp.config.json`.

If `EVOKORE_TOOL_DISCOVERY_MODE` is unset or `=dynamic`, the profile resolution proceeds normally.

## Resolution precedence

1. `EVOKORE_TOOL_DISCOVERY_MODE=legacy` (safety pin) - built-in `default`
2. `EVOKORE_DISCOVERY_PROFILE=<name>` - named profile from `mcp.config.json`
3. `discovery.activeProfile` in `mcp.config.json` - named profile
4. Built-in `default` profile (legacy-equivalent)

## Compatibility note

`EVOKORE_TOOL_DISCOVERY_MODE` predates profiles and is not being removed. Treat it as a permanent escape hatch:

- it remains both a kill switch (`=legacy`) and a tier toggle (`=dynamic`)
- profiles are the newer sharper surface
- the mode-vs-profile interaction is documented inline in `.env.example`
- if a future release collapses the toggle, the safety-pin behavior will move under an equivalent env name (such as `EVOKORE_DISCOVERY_PROFILE=default`) with at least one release of overlap and deprecation warning

Until such a transition lands, treat `EVOKORE_TOOL_DISCOVERY_MODE=legacy` as a permanent escape hatch.

## Mandatory injection-point downstream skills

The panel-of-experts framework lists 7 skills that must remain reachable in every workflow because they participate in mandatory injection points (release gates, multi-perspective review, etc.):

1. `release-readiness`
2. `repo-ingestor`
3. `docs-architect`
4. `orch-review`
5. `orch-plan`
6. `tool-governance`
7. `orch-refactor`

Source: `SKILLS/ORCHESTRATION FRAMEWORK/panel-of-experts/SKILL.md`, section "Mandatory Injection Points (Always Run)".

Every shipped non-legacy profile (`coding`, `research`, `voice`) declares these 7 skill IDs in its `mandatoryInjectionSkills` array. The runtime exposes them through `resolve_workflow` / `execute_skill`, which are themselves in every default profile's `alwaysVisible` list, so the skills remain reachable even when their direct tool wrapper is not surfaced.

## Measured token counts

The values below come from `scripts/benchmark-tool-discovery.js --all`. The benchmark uses the real `js-tiktoken` `cl100k_base` encoding (the OpenAI tokenizer used by GPT-4-class models and a close proxy for Claude's tokenizer).

The synthetic catalog mirrors the real EVOKORE surface: 37 native tools and 81 proxy tools across `github`, `fs`, `elevenlabs`, and `supabase`. Tool descriptions in the synthetic catalog are intentionally short ("MCP: tool-name operation."), so the production token counts will be higher because real schemas carry richer descriptions and JSON schemas. Treat the numbers below as the lower bound of each profile's footprint and the relative shape between profiles.

| Profile | Visible tools | Payload bytes | Tokens (cl100k_base) | Budget | Status |
|---|---:|---:|---:|---:|---|
| `voice` | 20 | 3,737 | 823 | <= ~3K | within budget |
| `research` | 27 | 4,919 | 1,011 | <= ~5K | within budget |
| `default` | 37 | 6,388 | 1,318 | matches legacy dynamic | matches `legacy-dynamic` |
| `legacy-dynamic` | 37 | 6,388 | 1,318 | matches legacy dynamic | unchanged |
| `coding` | 45 | 7,982 | 1,644 | <= ~8K | within budget |
| `legacy-full` | 118 | 21,429 | 4,531 | matches legacy full surface | unchanged |

> **Approximate.** The synthetic catalog under-counts real tool schemas. Production deployments with full GitHub / ElevenLabs / Supabase tool schemas can be 3-5x larger than the synthetic counts above. Profile *ordering* is faithful (`voice` < `research` < `default` < `coding` < `legacy-full`) but absolute numbers should be re-measured against a live runtime when you tune budgets.

## Customizing or extending profiles

Profiles live under the `discovery.profiles` block in `mcp.config.json`. Each profile takes:

```jsonc
{
  "discovery": {
    "profiles": {
      "my-profile": {
        "description": "Free-form text that surfaces in benchmark output.",
        "alwaysVisible": ["fs_read_file", "github_get_file_contents"],
        "mandatoryInjectionSkills": [
          "release-readiness", "repo-ingestor", "docs-architect",
          "orch-review", "orch-plan", "tool-governance", "orch-refactor"
        ]
      }
    },
    "activeProfile": "my-profile"
  }
}
```

`alwaysVisible` accepts:

- `"all-native"` - every native tool, proxies dynamic.
- `"all"` - every native and every proxy tool.
- `string[]` - explicit allowlist of tool names.

The `mandatoryInjectionSkills` field is informational. The runtime does not currently filter skill access by profile; the field exists so tests, audits, and the benchmark can verify the 7 mandatory injection points remain documented per profile.

## Re-running the benchmark

```bash
# Build first so the benchmark sees the latest ProfileResolver shape:
npm run build

# Measure every profile (built-in default + everything in mcp.config.json):
node scripts/benchmark-tool-discovery.js --all

# Measure a single profile by name:
node scripts/benchmark-tool-discovery.js --profile coding
```

Both commands emit JSON to stdout. Pass `--output <path>` to also write the JSON to disk. Pass `--live-timings` to include hot-path measurements (excluded by default so the artifact is reproducible).

## Schema-deferred `tools/list` (`describe_tool`, opt-in)

Schema deferral adds a second axis to the `tools/list` token-budget knob: the operator can opt into **schema deferral**, which strips the `inputSchema` body from every tool in the listing and replaces it with a placeholder plus a `_meta: { schema_deferred: true }` marker. Clients fetch the real schemas just-in-time via the native tool `describe_tool`.

This complements the discovery-profile axis: profiles control *which* tools ship in the listing, schema deferral controls *how much per-tool detail* ships. Both can be combined.

### Configuration

| Env var | Default | Effect |
|---|---|---|
| `EVOKORE_TOOL_SCHEMA_MODE` | `full` | `full` keeps the historical contract (every tool ships its full `inputSchema`). `deferred` strips schema details from `tools/list`. |
| `EVOKORE_TOOL_SCHEMA_FALLBACK_MS` | `60000` | Compat-probe window. If no client invokes `describe_tool` within this many milliseconds after the first deferred `tools/list` response, the runtime reverts to `full` mode for the rest of the process and emits a one-time stderr warning. |

### Semantics

- **`full` mode (default).** Bit-identical to the historical contract. Every tool in `tools/list` carries its full `inputSchema`, `annotations`, and metadata. No client needs to know about `describe_tool`.
- **`deferred` mode.** Each tool in `tools/list` ships as `{ name, description, inputSchema: <empty placeholder>, annotations?, _meta: { schema_deferred: true } }`. The placeholder inputSchema is `{ type: "object", properties: {}, "x-evokore-schema-deferred": true }` rather than `undefined` because the official `@modelcontextprotocol/sdk` Zod `ToolSchema` lists `inputSchema` as a required field - clients built on the SDK would reject responses that omit it entirely.
- **`describe_tool` is always visible** regardless of the active discovery profile or discovery mode. It accepts `{ tools: string[] }` and returns `{ schemas: Tool[], unknown: string[] }` where `schemas` contains the full (non-deferred) tool definitions for known names and `unknown` lists any names that do not resolve. This is the bootstrap path operators rely on - without it, deferred mode would be a one-way trap.
- **Per-tool Zod fallback.** If a tool's full definition fails the SDK's `ToolSchema` Zod validation (unusual, but possible if a plugin or proxied tool's upstream definition is itself malformed), the deferred projection emits the full schema for that tool only and logs a one-time stderr warning naming the offending tool. This protects SDK-bound clients from receiving a placeholder for a tool they would have rejected anyway.

### Compat-probe + automatic fallback

Schema deferral is opt-in by default for a reason: most MCP clients in the wild today do not implement a schema-fetch path and silently drop tools they cannot fully parse. The compat-probe is the safety net.

1. The first `tools/list` response under `deferred` mode arms a `EVOKORE_TOOL_SCHEMA_FALLBACK_MS` timer.
2. If a client invokes `describe_tool` even once before the timer fires, the runtime stays in deferred mode for the rest of the process - the client has proven it understands the bootstrap path.
3. If the timer fires and no `describe_tool` call has been observed, the runtime flips effective mode to `full`, emits the warning `[EVOKORE] Schema-deferral fallback: client did not call describe_tool within 60s; reverting to full mode (offending client likely doesn't support deferred schemas).`, and broadcasts a `tools/list_changed` notification so the client re-fetches with full schemas.

Operators who deliberately want to force `deferred` mode without the safety net can crank `EVOKORE_TOOL_SCHEMA_FALLBACK_MS` very high (e.g. `86400000` for 24h), but the recommended posture remains opt-in only, default off.

### Client compatibility

Most MCP clients in the wild do not yet implement a schema-fetch path and may silently drop tools whose `inputSchema` does not match their expected shape. Two failure modes are common:

- **Strict SDK validation.** Some clients delegate parsing directly to the upstream MCP SDK Zod schema. A placeholder `inputSchema` that satisfies the `required` flag may still fail downstream property-shape checks, and without a client-side schema-fetch path there is no recovery.
- **Silent tool drop on unfamiliar shapes.** Other clients silently skip tools whose schema the local parser cannot fully resolve. The tool disappears from the client's tool catalog with no error surface, which makes deferral indistinguishable from a server bug.

Treat any client whose tool-parsing contract is not personally verified against deferred-mode placeholders as **unsafe** until proven otherwise.

### When to enable

A controlled probe environment with an MCP client confirmed to tolerate placeholder `inputSchema` and to actually invoke `describe_tool` before tool execution. That is the only case where deferred mode is currently safe. Watch for the compat-probe stderr warning - if it ever fires, the client is not safe and the operator should set `EVOKORE_TOOL_SCHEMA_MODE=full` until the upstream client ships proper support.

## Skill composition graph (`nextSteps[]`)

`scripts/derive-skill-composition.js` statically scans every `SKILLS/**/SKILL.md` body for invocation phrases (`invoke X skill`, `run X panel`, etc.) and parses the `## Injection Points` table out of `SKILLS/ORCHESTRATION FRAMEWORK/panel-of-experts/SKILL.md` to emit a `skill-graph.json` build artifact. `execute_skill` lazy-loads that graph and returns a `nextSteps: [{ skill, reason }]` field; `index.ts` auto-activates any matching tool entries and emits exactly one `tools/list_changed`. Cycles are detected (DFS) and transitive edges are restricted to a 7-skill allowlist (`release-readiness`, `repo-ingestor`, `docs-architect`, `orch-review`, `orch-plan`, `tool-governance`, `orch-refactor`) capped at depth 5. Run `npm run skill-graph` to regenerate.

## See also

- [Tools and Discovery](./TOOLS_AND_DISCOVERY.md) - discovery modes and dynamic activation
- [Architecture](./ARCHITECTURE.md) - runtime layout and module map
- [Usage](./USAGE.md) - day-to-day operator flows
- [Testing and Validation](./TESTING_AND_VALIDATION.md) - benchmark and discovery validation surface

Last verified: 2026-05-20
