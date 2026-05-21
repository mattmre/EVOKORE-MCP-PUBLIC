# Testing and Validation

EVOKORE has a broad validation surface covering runtime behavior, docs integrity, voice/hook paths, Windows command handling, release flow, and governance continuity. The suite runs under `vitest` (roughly 120 test files containing about 2,000 tests in the current build), and individual subsystems are organized as named files so you can run a narrow check for one area without invoking the broad regression gate.

## What this covers

- Validation philosophy and the main entrypoints
- Test surface organized by subsystem
- Targeted commands by task
- CI, release, and benchmark validations
- Live validation gates and the documentation-aware checks

## Validation philosophy

The repo uses targeted vitest files instead of a single hidden test harness. That makes it easier to run a narrow check for one subsystem while still keeping `npm test` as the broad regression gate. The same target files are also wired into CI shards so failures can be triaged file-by-file.

## Main entrypoints

| Command | Purpose |
|---|---|
| `npm run build` | compile TypeScript to `dist/` |
| `npm test` | broad regression pass across runtime, docs, hooks, discovery, release, and governance checks |
| `npx vitest run <file>` | run a single targeted validation file |
| `npm run docs:check` | targeted docs link and ops-doc validation |
| `npm run benchmark:tool-discovery` | benchmark discovery/listing contract |
| `npm run test:voice:live` | opt-in live ElevenLabs validation |

## Test surface by subsystem

### Router, proxying, and runtime contracts

Representative checks:

- `e2e-test.js`
- `test-hitl.js`
- `test-hitl-hardening.js`
- `test-proxy-cooldown.js`
- `test-proxy-server-errors.js`
- `test-tool-prefix-collision-validation.js`
- `test-env-sync-validation.js`
- `test-unresolved-env-placeholder-validation.js`
- `test-version-contract-consistency.js`
- `test-damage-control-validation.js`

What they cover:

- proxied tool routing
- HITL security behavior
- cooldown handling
- duplicate prefix safety
- env interpolation failures
- README/runtime/version contract consistency
- expanded shell/path safety coverage in `damage-control-rules.yaml`

### Skill and workflow surface

- `test-skill-manager.js`
- `test-regex-frontmatter-standardization.js`

What they cover:

- skill indexing
- frontmatter parsing robustness
- workflow retrieval assumptions

### Tool discovery and benchmark surface

- `test-tool-discovery-validation.js`
- `test-tool-discovery-benchmark-validation.js`
- `test-skill-indexing-validation.js`
- `test-skill-perf-monitoring.js`

What they cover:

- `legacy` vs `dynamic` listing behavior
- session activation expectations
- exact-name compatibility
- recursive skill indexing coverage
- performance telemetry and search envelope checks
- deterministic benchmark JSON output
- `--output` artifact parity
- optional `--live-timings` behavior

### Operator continuity and repo hygiene surface

- `test-session-continuity-validation.js`
- `test-auto-memory-validation.js`
- `test-status-line-validation.js`
- `test-repo-state-audit-validation.js`

What they cover:

- canonical session manifest behavior
- managed Claude memory sync
- continuity-backed status rendering
- repo-state audit parsing and report shape

### Voice and hook surface

- `hook-test-suite.js`
- `hook-e2e-validation.js`
- `test-hook-observability-hardening.js`
- `test-voice-e2e-validation.js`
- `test-voice-refinement-validation.js`
- `test-voice-sidecar-smoke-validation.js`
- `test-voice-sidecar-hotreload-validation.js`
- `test-voice-sidecar-live-validation.js`
- `test-voice-contract-validation.js`
- `test-voice-windows-docs-validation.js`

What they cover:

- hook observability JSONL behavior
- voice-hook forwarding expectations
- VoiceSidecar runtime startup/shutdown
- hot-reload behavior for `voices.json`
- live provider validation gate
- Windows voice documentation contract

### Docs, governance, and continuity surface

- `test-docs-canonical-links.js`
- `test-ops-docs-validation.js`
- `test-hitl-token-docs-validation.js`
- `test-tracker-consistency-validation.js`
- `test-pr-metadata-validation.js`
- `test-release-doc-freshness-validation.js`
- `test-submodule-doc-workflow.js`

What they cover:

- internal doc links
- required docs references
- HITL guidance wording
- tracker evidence integrity
- PR metadata expectations
- release doc freshness
- submodule workflow documentation

### Windows and platform-specific runtime checks

- `test-windows-exec-validation.js`
- `test-windows-command-runtime-validation.ts`

What they cover:

- `npx` -> `npx.cmd` remapping on Windows
- no automatic remap for `uv` / `uvx`
- runtime path-resolution expectations

## Targeted commands by task

| Task | Suggested command |
|---|---|
| Validate dynamic discovery | `npx vitest run test-tool-discovery-validation.js` |
| Validate benchmark contract | `npx vitest run test-tool-discovery-benchmark-validation.js` |
| Validate docs links and ops docs | `npm run docs:check` |
| Validate HITL doc wording | `npx vitest run test-hitl-token-docs-validation.js` |
| Validate hook observability | `npx vitest run hook-e2e-validation.js` |
| Validate VoiceSidecar smoke path | `npx vitest run test-voice-sidecar-smoke-validation.js` |
| Validate Windows command behavior | `npx vitest run test-windows-exec-validation.js` |
| Validate version/runtime/doc consistency | `npx vitest run test-version-contract-consistency.js` |
| Validate damage-control policy expansion | `npx vitest run test-damage-control-validation.js` |
| Validate PR metadata/runbook contract | `npx vitest run test-pr-metadata-validation.js` |
| Validate submodule cleanliness guardrails | `npx vitest run test-submodule-commit-order-guard-validation.js` |
| Audit live repo state before a session | `npm run repo:audit` |

## CI and release validations

### CI

The repository includes CI coverage for:

- regular build/test execution
- PR metadata validation
- submodule cleanliness validation
- Windows runtime checks

Governance hardening reflected in docs and validation includes:

- PR metadata validation
- tracker consistency validation
- docs link validation
- submodule cleanliness guardrails

### Release flow

Release-related checks include:

- `npm run release:check`
- `npm run release:preflight`

Current release expectations include:

- release workflow must remain aligned with docs
- manual release dispatch requires `chain_complete=true`
- release commit must be on `origin/main`
- publish requires `NPM_TOKEN`
- treat GitHub release publication and npm publication as separate gates

## Benchmark and artifact validations

For discovery benchmarking:

```bash
npm run benchmark:tool-discovery
node scripts/benchmark-tool-discovery.js --output artifacts/tool-discovery-benchmark.json
node scripts/benchmark-tool-discovery.js --live-timings
node scripts/benchmark-tool-discovery.js --all
```

Interpretation:

- default output is the durable artifact contract
- `--output` is for saving that same artifact
- `--live-timings` is for manual/local diagnostics, not stable artifact comparison
- `--all` measures every profile in `mcp.config.json`

## Live validation gates

Some checks are intentionally opt-in.

### Live voice provider validation

```bash
EVOKORE_RUN_LIVE_VOICE_TEST=1 ELEVENLABS_API_KEY=your_key_here npm run test:voice:live
```

Why gated:

- avoids requiring external credentials in default runs
- avoids unexpected local playback during normal regression passes
- keeps default CI/local runs deterministic

## Documentation-aware validation

Several tests assert wording or link presence, so doc changes should preserve required operator contracts.

Be especially careful with:

- `README.md` top-level heading
- HITL token guidance in `USAGE.md` and `TROUBLESHOOTING.md`
- VoiceMode Windows guidance
- docs portal references in `docs/README.md`

## Recommended maintainer flow

1. Make the change.
2. Run `npm run build`.
3. Run the smallest targeted validation for the touched subsystem.
4. If the change is broad, run `npm test`.
5. Update docs and continuity artifacts when behavior changes.

## See also

- [Architecture](./ARCHITECTURE.md) — runtime layers and request routing
- [Setup](./SETUP.md) — install, configure, validate
- [Tools and Discovery](./TOOLS_AND_DISCOVERY.md) — the discovery contract the validation surface protects
- [Voice and Hooks](./VOICE_AND_HOOKS.md) — voice sidecar and hook scripts
- [Troubleshooting](./TROUBLESHOOTING.md) — when a validation surfaces a real issue

Last verified: 2026-05-20
