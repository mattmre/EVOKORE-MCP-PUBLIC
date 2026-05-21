# EVOKORE-MCP Skills Overview

EVOKORE-MCP indexes 266 `SKILL.md` files across 16 active categories, with the recursive `SkillManager` index seeing roughly 336 skill-related entries once supporting reference and asset files are included. This page gives the narrative shape of each category. Every category is tagged as **Code workflow**, **Non-code workflow**, or **Both** so a reader can match category to intent at a glance.

## What this covers

- Category inventory with skill counts
- Per-category narratives with code / non-code workflow tags
- How to find a skill from the assistant side
- Operator notes on indexing, search ranking, and adapter skills

## Category inventory

| Category | SKILL.md count |
|---|---|
| ANTHROPIC COOKBOOK | 4 |
| ARCHITECTURE | 1 |
| AUTOMATION AND PRODUCTIVITY | 7 |
| COMMUNICATION | 1 |
| CONTEXT | 1 |
| DEVELOPER TOOLS | 23 |
| EVOKORE EXTENSIONS | 9 |
| GENERAL CODING WORKFLOWS | 9 |
| HIVE FRAMEWORK | 8 |
| ORCHESTRATION FRAMEWORK | 41 |
| PLANNING | 2 |
| PROJECT MANAGEMENT | 1 |
| QA | 1 |
| RESEARCH AND CONTENT | 5 |
| Stitch Skills | 7 |
| wshobson Plugins | 146 |
| **Total** | **266** |

`AWESOME CLAUDE CODE RESOURCES`, `MCP WRAPPERS`, `OFFICIAL MCP SERVERS`, and `upstream/` contain reference material and submodule vendoring but no top-level `SKILL.md` files; they are not counted above.

## Category narratives

### ARCHITECTURE
**Code workflow.** A single deep-refactor skill (`improve-codebase-architecture`) anchored on the bounded contexts in ADR-0005. Use it when surfacing architectural friction inside one context and turning shallow modules into deep ones.

### AUTOMATION AND PRODUCTIVITY
**Non-code workflow.** Personal-productivity skills ported from the Anthropic skills cookbook: `brand-guidelines`, `file-organizer`, `image-enhancer`, `invoice-organizer`, `slack-gif-creator`, `tailored-resume-generator`, and the `theme-factory` family.

### ANTHROPIC COOKBOOK
**Non-code workflow.** Custom skills from the Anthropic Cookbook: `analyzing-financial-statements`, `applying-brand-guidelines`, `creating-financial-models`, and the `cookbook-audit` notebook reviewer. Reference material (notebook walkthroughs, contribution guides) ships alongside but is not surfaced as `SKILL.md`.

### COMMUNICATION
**Both.** The `zoom-out` adapter ported from `mattpocock/skills`. Use it when an agent needs to move up an abstraction layer and find the right seam for a change — equally applicable to a code refactor and to a non-code planning artifact.

### CONTEXT
**Code workflow.** The `ubiquitous-language` adapter, hard-coupled to the eight bounded contexts in ADR-0005. Crystallizes a per-context `GLOSSARY.md` from replay/evidence JSONL plus `src/` identifiers.

### DEVELOPER TOOLS
**Both.** The largest non-wshobson category. Includes Anthropic's `artifacts-builder`, `mcp-builder`, `skill-creator`, `webapp-testing`; the document-skills suite (`docx`, `pdf`, `pptx`, `xlsx`); the reverse-engineering lane (`ghidra-*`, `reverse-engineering-*`, `malware-triage-workflow`, `unknown-binary-onboarding`, `semantic-recovery-campaign`, `debugger-driven-analysis`); plus `frontend-design`, `setup-pre-commit`, `developer-growth-analysis`, `changelog-generator`, and `refly`. The document-skills suite is non-code; everything else is code-side.

### EVOKORE EXTENSIONS
**Code workflow.** Skills written for EVOKORE-specific runtime behavior: `hooks-automation`, `sparc-methodology`, `verification-quality` (truth scoring), `agentic-jujutsu` (concurrent claim-based writes), `browser`, `github-release-management` (canary rollouts), `v3-mcp-optimization`, `anti-slop` (tool-call review), and the `master-workflow-555` driver.

### GENERAL CODING WORKFLOWS
**Code workflow.** The day-to-day session workflows: `arch-aep-runner`, `implementation-session`, `session-wrap`, `pr-manager`, `docs-architect`, `repo-ingestor`, `planning-with-files`, `security-review`, and the `phase-spec-optimizer` retrospective tool.

### HIVE FRAMEWORK
**Code workflow.** Goal-driven agent design (`hive`, `hive-concepts`, `hive-create`, `hive-credentials`, `hive-debugger`, `hive-patterns`, `hive-test`) plus the legacy `triage-issue` skill. Use the meta-router `hive` when starting a new agent project.

### ORCHESTRATION FRAMEWORK
**Both.** The densest category. Top-level skills (`handoff-protocol`, `policy-pack-v1`, `agent-archetypes`, `tool-governance`, `workflow-templates`, `schemas`, `coding-reference`, `improvement-cycles`, `aep-framework`, `panel-of-experts`) plus the `commands/` directory of `orch-*`, `sparc-*`, `tdd`, `quality-gate`, `scope-lock`, `handoff`, `session-checkpoint`, `pattern-learn`, `context-budget`, `fleet-status`, `agent-spawn`, `verify-quality`, `workflow-run`, and the analytics miners (`session-retrospective-miner`, `cross-project-process-miner`, `narrative-quality-scorer`). Panel of Experts and AEP cover both code and non-code artifacts; many `orch-*` commands are code-side.

### PLANNING
**Code workflow.** Two evidence-driven planning skills: `to-prd` (synthesize a PRD from prior session evidence and panel-review it) and `to-issues` (decompose a PRD into AFK/HITL-tagged vertical-slice issues).

### PROJECT MANAGEMENT
**Code workflow.** `github-triage` — a 7-state label-based GitHub issue state machine that reads issue bodies and evidence rather than waiting for maintainer triggers.

### QA
**Code workflow.** `triage-bug` — triages bugs from session evidence (evidence-capture JSONL, replay JSONL, telemetry, repo-audit) and produces a TDD fix plan plus a `docs/bugs/{slug}.md` artifact.

### RESEARCH AND CONTENT
**Non-code workflow.** Research and content workflows: `competitive-ads-extractor`, `content-research-writer`, `lead-research-assistant`, `meeting-insights-analyzer`, `twitter-algorithm-optimizer`.

### Stitch Skills
**Non-code workflow.** The Stitch design pipeline: `enhance-prompt`, `design-md`, `stitch-design`, `stitch-loop`, `shadcn-ui`, `react-components`, `remotion`. Use `stitch-loop` for autonomous baton-passing website builds. The "non-code" tag reflects that the deliverable is a designed artifact even though the pipeline emits front-end code.

### wshobson Plugins
**Both.** The deepest reference library. 146 `SKILL.md` files spanning backend (CQRS, sagas, microservices, event stores, Temporal), frontend and mobile (React state, Next.js App Router, Tailwind, iOS/Android design), cloud infrastructure (Terraform, Istio, Linkerd, multi-cloud, mTLS), CI/CD, Kubernetes (manifests, Helm, GitOps, security), security scanning (SAST, STRIDE, attack trees, threat mitigation), data engineering (Spark, dbt, Airflow), LLM application development (RAG, LangChain, embedding strategies, prompt patterns), Python development (a full Python style, testing, and packaging set), JavaScript and TypeScript, Rust and Go systems, blockchain and Web3, observability (Prometheus, Grafana, SLOs, distributed tracing), accessibility, payment processing, reverse engineering, conductor TDD workflows, agent-teams coordination, startup business analysis, framework migration, documentation generation, game development (Godot, Unity ECS), HR and legal compliance, shell scripting, and incident response. Mostly code-side; the startup business analysis, HR and legal compliance, and documentation-generation skills are non-code.

## Finding a skill

Ask the assistant to invoke `search_skills`:

> "Do you have a skill for PostgreSQL database design?"

For broader natural-language intents, use `resolve_workflow`:

> "I need to wrap up this session and leave a clean handoff."

EVOKORE will semantically rank the best workflow matches, explain why they matched with `Why matched:` lines, and inject the top skills directly into the response.

## Operator notes

- Skill indexing is recursive; the runtime no longer relies on the old shallow two-level walk.
- Search quality uses aliases, tags, frontmatter metadata, and semantic hints. `resolve_workflow` reranks to prefer actionable top-level skills over deep reference leaves.
- The composition graph (`skill-graph.json`) records `nextSteps[]` edges and is regenerated via `npm run skill-graph`.
- Adapter skills (vendored from upstream submodules) carry `upstream`, `upstream-sha`, `upstream-path` frontmatter. See `SKILLS/DEVELOPER TOOLS/skill-creator/SKILL.md` for the contract and `SKILLS/COMMUNICATION/zoom-out/SKILL.md` plus `SKILLS/CONTEXT/ubiquitous-language/SKILL.md` for canonical examples.

## See also

- [All Skills Crib Sheet](./ALL_SKILLS_CRIB_SHEET.md) — flat lookup table with one-line descriptions
- [Panel of Experts](./PANEL_OF_EXPERTS.md) — the multi-persona review framework many skills compose with
- [Architecture: AEP System](./ARCH_AEP_SYSTEM.md) — the engineering cycle that drives the orchestration workflows
- [Usage](./USAGE.md) — day-to-day invocation patterns

Last verified: 2026-05-20
