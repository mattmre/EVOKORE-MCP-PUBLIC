# EVOKORE-MCP Documentation Portal

EVOKORE-MCP is a TypeScript-based MCP router and multi-server aggregator. It gives an AI client a single MCP endpoint that combines EVOKORE's native workflow tools with proxied child servers, while adding namespace isolation, dynamic tool discovery, role-based permissions, rate limiting, and human-in-the-loop approval. This portal is the entry point for everything documented about that system: setup, day-to-day usage, runtime architecture, the orchestration and review frameworks, and the cross-cutting reading paths for new users, engineers, and decision-makers.

## Quick start

- **New to EVOKORE?** Read [Executive Summary](./EXECUTIVE_SUMMARY.md) for a non-technical overview, then [Setup](./SETUP.md) for install and client registration.
- **Day-to-day operation:** [Usage](./USAGE.md) and [Use cases and walkthroughs](./USE_CASES_AND_WALKTHROUGHS.md).
- **Engineer / integrator:** [Technical Analysis](./TECHNICAL_ANALYSIS.md) and [Architecture](./ARCHITECTURE.md).
- **Bringing it into a real environment for the first time:** [New User Brutal Honesty Kit](./NEW_USER_BHK.md) — sharp-edges checklist before you commit to anything.

## Reference (alphabetical)

| Document | What it covers |
|---|---|
| [All Skills Crib Sheet](./ALL_SKILLS_CRIB_SHEET.md) | Flat lookup table of every skill in the library with one-line descriptions and wiki links. |
| [Architecture](./ARCHITECTURE.md) | Runtime shape, layers, tool populations, discovery modes, startup lifecycle, RBAC, rate limiting, session/manifest state. |
| [Architecture: AEP System](./ARCH_AEP_SYSTEM.md) | The Align-Execute-Prove engineering cycle: phase planning, ADR/CONTEXT.md discipline, test matrix, evaluation harness, verification log. |
| [CLI integration](./CLI_INTEGRATION.md) | Registering EVOKORE with Claude Code, Gemini CLI, Cursor, Copilot CLI, Codex CLI, and status-line surfaces. |
| [Executive summary](./EXECUTIVE_SUMMARY.md) | Plain-English overview of what EVOKORE is and who it is for. |
| [HTTP deployment](./HTTP_DEPLOYMENT.md) | Running EVOKORE over the MCP StreamableHTTP transport for remote and multi-client access. |
| [Migration v2 to v3](./MIGRATION_V2_TO_V3.md) | What changed between v2 and v3, breaking-change notes, and the upgrade procedure. |
| [New User BHK](./NEW_USER_BHK.md) | Brutal-honesty kit with severity-scored sharp edges and gotchas for new operators. |
| [OAuth setup](./OAUTH_SETUP.md) | Bearer-token / JWT authentication with JWKS rotation on the HTTP transport. |
| [Panel of Experts](./PANEL_OF_EXPERTS.md) | The multi-persona panel framework — 10-step cycle, challenge depths, persona schema, persistence, worked examples. |
| [Plugin authoring](./PLUGIN_AUTHORING.md) | Writing and shipping plugins that add custom tools and resources, including hot-reload. |
| [Setup](./SETUP.md) | Install, build, env variables, `mcp.config.json`, RBAC, rate limiting, validation. |
| [Skills overview](./SKILLS_OVERVIEW.md) | Narrative tour of all 16 active skill categories with code / non-code workflow tags. |
| [Technical analysis](./TECHNICAL_ANALYSIS.md) | Engineer-facing deep dive: runtime layers, discovery model, continuity, security, deployment shapes. |
| [Testing and validation](./TESTING_AND_VALIDATION.md) | Validation surface, test layout, regression commands, release gating. |
| [Tool discovery profiles](./TOOL_DISCOVERY_PROFILES.md) | Named profiles for shaping the visible tool surface and their measured token budgets. |
| [Tools and discovery](./TOOLS_AND_DISCOVERY.md) | Native vs proxied tools, prefixing, discovery modes, benchmark contract. |
| [Training and use cases](./TRAINING_AND_USE_CASES.md) | Pointer into the category-level training material. |
| [Troubleshooting](./TROUBLESHOOTING.md) | Common failure modes and their fixes. |
| [Usage](./USAGE.md) | Day-to-day operation: tools, sessions, hooks, voice, dashboard, governance. |
| [Use cases and walkthroughs](./USE_CASES_AND_WALKTHROUGHS.md) | Concrete walkthroughs of representative operator scenarios. |
| [Voice and hooks](./VOICE_AND_HOOKS.md) | The three voice surfaces (proxied ElevenLabs, VoiceMode, VoiceSidecar) and the hook pipeline. |
| [Webhook envelope v1](./WEBHOOK_ENVELOPE_V1.md) | Authoritative payload spec for the v1 webhook envelope. |
| [Webhook guide](./WEBHOOK_GUIDE.md) | End-to-end guide for configuring, signing, and consuming webhook events. |

## Guides

Step-by-step operator guides live under [`guides/`](./guides/):

- [Rate Limiting Guide](./guides/RATE_LIMITING_GUIDE.md) — token-bucket configuration, per-server and per-tool limits.
- [RBAC Guide](./guides/RBAC_GUIDE.md) — `admin`, `developer`, and `readonly` roles, per-tool overrides, and the resolution order.
- [Repo Audit Hook Guide](./guides/REPO_AUDIT_HOOK_GUIDE.md) — pre-session checks for branch drift, worktree pressure, and control-plane drift.
- [Voice Sidecar Guide](./guides/VOICE_SIDECAR_GUIDE.md) — running the WebSocket voice runtime, persona hot-reload, hook wiring.

## Category narratives

Per-category narrative tours of the skill library live under [`categories/`](./categories/):

- [Anthropic Cookbook](./categories/ANTHROPIC_COOKBOOK.md)
- [Automation and Productivity](./categories/AUTOMATION_AND_PRODUCTIVITY.md)
- [Awesome Claude Code Resources](./categories/AWESOME_CLAUDE_CODE_RESOURCES.md)
- [Developer Tools](./categories/DEVELOPER_TOOLS.md)
- [General Coding Workflows](./categories/GENERAL_CODING_WORKFLOWS.md)
- [Hive Framework](./categories/HIVE_FRAMEWORK.md)
- [MCP Wrappers](./categories/MCP_WRAPPERS.md)
- [Official MCP Servers](./categories/OFFICIAL_MCP_SERVERS.md)
- [Research and Content](./categories/RESEARCH_AND_CONTENT.md)
- [wshobson Plugins](./categories/WSHOBSON_PLUGINS.md)

For a higher-level narrative across all 16 active categories, see [Skills Overview](./SKILLS_OVERVIEW.md). For a flat lookup table of every `SKILL.md`, see [All Skills Crib Sheet](./ALL_SKILLS_CRIB_SHEET.md).

## Wiki

A rendered, browsable per-skill wiki is generated as a build artifact. To produce or refresh it, run `npm run wiki:build` from the repo root. The output appears at `wiki/skills-index.html` and is intended to be opened locally in a browser. The wiki is not committed to the repository because it is fully derived from the `SKILLS/**/SKILL.md` corpus.

## Presentations

A small set of standalone, self-contained presentation pages ships under [`presentations/`](../presentations/). Open [`presentations/index.html`](../presentations/index.html) in a browser for the executive summary and the technical analysis as slide decks. The presentations are inline HTML with no external CDN dependencies, so they work fully offline.

## Reading paths

### Non-technical reviewer

1. [Executive summary](./EXECUTIVE_SUMMARY.md)
2. [Skills overview](./SKILLS_OVERVIEW.md)
3. [Use cases and walkthroughs](./USE_CASES_AND_WALKTHROUGHS.md)

### New operator

1. [Setup](./SETUP.md)
2. [Usage](./USAGE.md)
3. [New User BHK](./NEW_USER_BHK.md)
4. [Troubleshooting](./TROUBLESHOOTING.md)

### Engineer or integrator

1. [Technical analysis](./TECHNICAL_ANALYSIS.md)
2. [Architecture](./ARCHITECTURE.md)
3. [Tools and discovery](./TOOLS_AND_DISCOVERY.md)
4. [Testing and validation](./TESTING_AND_VALIDATION.md)

### Orchestration and review

1. [Panel of Experts](./PANEL_OF_EXPERTS.md)
2. [Architecture: AEP System](./ARCH_AEP_SYSTEM.md)
3. [Usage](./USAGE.md) (orchestration sections)

### Platform integrator

1. [HTTP deployment](./HTTP_DEPLOYMENT.md)
2. [OAuth setup](./OAUTH_SETUP.md)
3. [Webhook guide](./WEBHOOK_GUIDE.md) + [Webhook envelope v1](./WEBHOOK_ENVELOPE_V1.md)
4. [Plugin authoring](./PLUGIN_AUTHORING.md)

Last verified: 2026-05-20
