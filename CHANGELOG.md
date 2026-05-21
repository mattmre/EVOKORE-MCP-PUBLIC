# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v3.1.0

### New Features
- **TTS Provider Abstraction** -- Extracted TTSProvider interface and added OpenAI-compatible TTS provider for local text-to-speech.
- **FileSessionStore Persistence** -- Session state survives process restart via file-based session store.
- **Cross-CLI Config Sync** -- `npm run sync` merges the evokore-mcp entry into each CLI's config with canonical git root resolution.
- **Tool Discovery Tiering** -- Discovery profiles (`coding`, `research`, `voice`, `legacy-full`, `legacy-dynamic`), opt-in `tools/list` cursor pagination, and opt-in schema-deferred `tools/list` + `describe_tool` bootstrap path.

### Documentation
- Updated CLAUDE.md and developer docs with v3.1 conventions.

### Infrastructure
- Version bump from 3.0.0 to 3.1.0.

## v3.0.1

### New Features
- **Operator UX Hardening** -- Purpose gate, session replay, evidence capture, tilldone, and damage control hooks.
- **Voice & Continuity Follow-Through** -- VoiceSidecar standalone process and session continuity manifest.
- **StreamableHTTP Server Transport** -- HTTP server for MCP over HTTP with SSE streaming.
- **OAuth Bearer Token Auth** -- `OAuthProvider` with Bearer token validation and JWKS key rotation for HTTP transport.
- **Plugin System** -- `PluginManager` with hot-reload support for custom tool providers.
- **Webhook Event System** -- HMAC-SHA256 signed events with fire-and-forget delivery and security hardening.
- **Multi-Tenant Session Isolation** -- Per-session state isolation with configurable TTL.
- **Skill Ecosystem Validation** -- Sandbox security audit and skill ecosystem validation suite.

### Platform Wiring
- `SessionIsolation` into `HttpServer` with LRU eviction.
- `OAuthProvider` into `HttpServer` as authentication middleware.
- `WebhookManager` into `PluginManager` with plugin event hooks.
- Per-session RBAC into `HttpServer` for multi-tenant role isolation.
- Per-session rate limiting into `HttpServer` with token buckets.

### Bug Fixes
- Made proxy boot async so the MCP handshake completes immediately without waiting for child server boot.

### Documentation
- Updated documentation for v3.0 features.

### Infrastructure
- v3.0.0 release tag.
- npm package metadata.

### Testing
- Integration tests for v3.0 features.

## v3.0.0

### New Features
- **Test Runner Migration** -- Migrated tests from chained scripts to vitest with parallel execution, watch mode, and structured output.
- **MCP SDK Feature Adoption** -- Added tool annotations (`readOnlyHint`, `destructiveHint`, etc.), server instructions, and HTTP client transport support.
- **MCP Resources & Prompts** -- Implemented `resources/list` and `prompts/list` with real content including server status, config, and skill-backed prompts.
- **Skill Hot-Reload** -- Added `refresh_skills` tool and optional filesystem watcher for live skill index updates.
- **Rate Limiting** -- Configurable per-server and per-tool rate limits using token bucket algorithm.
- **Session Dashboard** -- Zero-dependency local web dashboard for session replay and evidence timeline viewing.
- **HITL Approval UI** -- Interactive web interface for viewing and managing pending HITL approval tokens.
- **Repo Audit Hook** -- Optional pre-session hook that warns about branch drift and stale worktrees.
- **Skill Versioning** -- Optional `version`, `requires`, and `conflicts` fields in skill frontmatter with dependency validation.
- **Remote Skill Registry** -- `fetch_skill` tool for installing skills from remote URLs and registry support.
- **Skill Execution Sandbox** -- `execute_skill` tool for running code blocks from skills with output capture and timeout.
- **Supabase Integration** -- Supabase MCP server as a proxied child with tiered permissions.
- **RBAC Permissions** -- Role-based permission model with `admin`, `developer`, and `readonly` roles.

### Infrastructure
- **Build Hygiene** -- Removed tracked compiled artifacts from `src/`, updated `.gitignore`.
- **CI Updates** -- Windows runtime tests run through vitest.

### Breaking Changes
- `npm test` now runs `vitest run` instead of chained `node` commands. CI workflows using the old command pattern need updating.
- Test files use vitest globals (`test()`, `describe()`). Running them directly with `node` no longer works.

### Migration Guide
- Update any CI scripts that run individual test files with `node test-*.js` to use `npx vitest run test-*.js`.
- Set `EVOKORE_ROLE` env var to activate RBAC (optional, flat permissions still work).
- Set `EVOKORE_SKILL_WATCHER=true` to enable auto-refresh (optional).
- Set `EVOKORE_REPO_AUDIT_HOOK=true` to enable pre-session repo audit (optional).
