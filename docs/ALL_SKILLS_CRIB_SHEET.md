# EVOKORE-MCP: All Skills Crib Sheet

Fast-lookup table for every `SKILL.md` in the EVOKORE-MCP library. Each row links to the full wiki page generated under `docs/wiki/skills/`. The wiki is a build artifact and is not committed to the repository — run `npm run wiki:build` to generate it locally.

## What this covers

- Per-category inventory totals
- A flat alphabetical table of every skill grouped by category
- One-line trigger descriptions taken from each skill's frontmatter

For a higher-level narrative grouped by category, see [`SKILLS_OVERVIEW.md`](./SKILLS_OVERVIEW.md). For the rendered, browsable wiki index, generate the wiki locally and open `docs/wiki/skills-index.html`.

## Inventory

| Category | Count |
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
| WSHOBSON PLUGINS | 146 |
| **Total** | **266** |

Sorted by category then skill name. Descriptions are taken from the first-line `description:` field in each SKILL.md frontmatter and may be lightly truncated.

## ANTHROPIC COOKBOOK

| Skill | Description | Wiki |
|---|---|---|
| **analyzing-financial-statements** | This skill calculates key financial ratios and metrics from financial statement data for investment analysis. | [open](wiki/skills/anthropic-cookbook/analyzing-financial-statements.html) |
| **applying-brand-guidelines** | This skill applies consistent corporate branding and styling to all generated documents including colors, fonts, layouts, and messaging. | [open](wiki/skills/anthropic-cookbook/applying-brand-guidelines.html) |
| **cookbook-audit** | Audit an Anthropic Cookbook notebook based on a rubric. Use whenever a notebook review or audit is requested. | [open](wiki/skills/anthropic-cookbook/cookbook-audit.html) |
| **creating-financial-models** | This skill provides an advanced financial modeling suite with DCF analysis, sensitivity testing, Monte Carlo simulations, and scenario planning for investment decisions. | [open](wiki/skills/anthropic-cookbook/creating-financial-models.html) |

## ARCHITECTURE

| Skill | Description | Wiki |
|---|---|---|
| **improve-codebase-architecture** | Use when surfacing architectural friction inside a single EVOKORE bounded context and proposing deepening refactors (shallow modules, leaky seams, low locality) informed by ADR-0005. | [open](wiki/skills/architecture/improve-codebase-architecture.html) |

## AUTOMATION AND PRODUCTIVITY

| Skill | Description | Wiki |
|---|---|---|
| **brand-guidelines** | Applies Anthropic's official brand colors and typography to any artifact that may benefit from having Anthropic's look-and-feel. | [open](wiki/skills/automation-and-productivity/brand-guidelines.html) |
| **file-organizer** | Intelligently organizes your files and folders across your computer by understanding context, finding duplicates, and suggesting better structures. | [open](wiki/skills/automation-and-productivity/file-organizer.html) |
| **image-enhancer** | Improves the quality of images, especially screenshots, by enhancing resolution, sharpness, and clarity. | [open](wiki/skills/automation-and-productivity/image-enhancer.html) |
| **invoice-organizer** | Automatically organizes invoices and receipts for tax preparation by reading messy files, extracting key information, renaming them consistently, and sorting them into logical folders. | [open](wiki/skills/automation-and-productivity/invoice-organizer.html) |
| **slack-gif-creator** | Toolkit for creating animated GIFs optimized for Slack, with validators for size constraints and composable animation primitives. | [open](wiki/skills/automation-and-productivity/slack-gif-creator.html) |
| **tailored-resume-generator** | Analyzes job descriptions and generates tailored resumes that highlight relevant experience, skills, and achievements to maximize interview chances. | [open](wiki/skills/automation-and-productivity/tailored-resume-generator.html) |
| **theme-factory** | Toolkit for styling artifacts with a theme. 10 pre-set themes plus on-the-fly generation for slides, docs, reports, and HTML landing pages. | [open](wiki/skills/automation-and-productivity/theme-factory.html) |

## COMMUNICATION

| Skill | Description | Wiki |
|---|---|---|
| **zoom-out** | Use when an agent needs to go up a layer of abstraction — map calling modules, identify the seam at which a change should land, and check whether the bug or feature lives at the right altitude. | [open](wiki/skills/communication/zoom-out.html) |

## CONTEXT

| Skill | Description | Wiki |
|---|---|---|
| **ubiquitous-language** | Use when crystallizing a domain glossary for a single bounded context — extract canonical terms from replay JSONL, evidence JSONL, and `src/` identifiers, then write GLOSSARY.md scoped to that context only. | [open](wiki/skills/context/ubiquitous-language.html) |

## DEVELOPER TOOLS

| Skill | Description | Wiki |
|---|---|---|
| **artifacts-builder** | Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). | [open](wiki/skills/developer-tools/artifacts-builder.html) |
| **changelog-generator** | Automatically creates user-facing changelogs from git commits by analyzing commit history, categorizing changes, and transforming technical commits into clear customer-friendly release notes. | [open](wiki/skills/developer-tools/changelog-generator.html) |
| **debugger-driven-analysis** | Drive runtime analysis with debugger-first workflows for breakpoint planning, register and memory observation, and static-to-dynamic correlation. | [open](wiki/skills/developer-tools/debugger-driven-analysis.html) |
| **developer-growth-analysis** | Analyzes your recent Claude Code chat history to identify coding patterns, development gaps, and areas for improvement; curates learning resources and sends a personalized growth report. | [open](wiki/skills/developer-tools/developer-growth-analysis.html) |
| **docx** | Comprehensive document creation, editing, and analysis with support for tracked changes, comments, formatting preservation, and text extraction. | [open](wiki/skills/developer-tools/docx.html) |
| **frontend-design** | Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics. | [open](wiki/skills/developer-tools/frontend-design.html) |
| **ghidra-core-recon** | Perform first-pass binary reconnaissance using Ghidra-oriented workflows for functions, strings, imports, exports, and symbols. | [open](wiki/skills/developer-tools/ghidra-core-recon.html) |
| **ghidra-function-analysis** | Analyze a target function through decompilation, xrefs, callers/callees, and supporting evidence when a function has been identified as important. | [open](wiki/skills/developer-tools/ghidra-function-analysis.html) |
| **ghidra-rename-and-retype** | Turn raw analysis into a cleaner knowledge base by renaming functions, variables, and data while applying signatures, comments, and types. | [open](wiki/skills/developer-tools/ghidra-rename-and-retype.html) |
| **malware-triage-workflow** | Triage suspicious binaries by combining static indicators, control-flow hints, YARA or pattern matches, and debugger confirmation. | [open](wiki/skills/developer-tools/malware-triage-workflow.html) |
| **mcp-builder** | Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. | [open](wiki/skills/developer-tools/mcp-builder.html) |
| **pdf** | Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. | [open](wiki/skills/developer-tools/pdf.html) |
| **pptx** | Presentation creation, editing, and analysis for .pptx files including layouts, comments, and speaker notes. | [open](wiki/skills/developer-tools/pptx.html) |
| **refly** | Base skill for Refly ecosystem: creates, discovers, and runs domain-specific skills bound to workflows. | [open](wiki/skills/developer-tools/refly.html) |
| **reverse-engineering-company-system** | Run reverse engineering as a coordinated EVOKORE operating system with expert panels, additive workflows, and lightweight learning loops. | [open](wiki/skills/developer-tools/reverse-engineering-company-system.html) |
| **reverse-engineering-improvement-loop** | Convert completed reverse-engineering work into better future workflows, skills, and panel narratives. | [open](wiki/skills/developer-tools/reverse-engineering-improvement-loop.html) |
| **reverse-engineering-workbench** | Coordinate EVOKORE reverse-engineering work across Ghidra-style static analysis, semantic recovery, and debugger-guided triage. | [open](wiki/skills/developer-tools/reverse-engineering-workbench.html) |
| **semantic-recovery-campaign** | Recover subsystem meaning through disciplined decompilation, xref analysis, renaming, typing, and evidence tracking. | [open](wiki/skills/developer-tools/semantic-recovery-campaign.html) |
| **setup-pre-commit** | Use when bootstrapping or extending the pre-commit hook chain (Husky + lint-staged + Prettier + typecheck + integration tests) for an EVOKORE-style TypeScript repo. | [open](wiki/skills/developer-tools/setup-pre-commit.html) |
| **skill-creator** | Guide for creating effective skills. Use when creating or updating a skill that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations. | [open](wiki/skills/developer-tools/skill-creator.html) |
| **unknown-binary-onboarding** | Establish the first analysis charter for an unfamiliar binary, library, firmware image, or package. | [open](wiki/skills/developer-tools/unknown-binary-onboarding.html) |
| **webapp-testing** | Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing screenshots, and viewing browser logs. | [open](wiki/skills/developer-tools/webapp-testing.html) |
| **xlsx** | Comprehensive spreadsheet creation, editing, and analysis with support for formulas, formatting, data analysis, and visualization. | [open](wiki/skills/developer-tools/xlsx.html) |

## EVOKORE EXTENSIONS

| Skill | Description | Wiki |
|---|---|---|
| **agentic-jujutsu** | Use when multiple agents need to write to the same repo concurrently without file-lock stalls — applies claim-before-write, parallel branch fan-out, and semantic 3-way merge. | [open](wiki/skills/evokore-extensions/agentic-jujutsu.html) |
| **anti-slop** | Use when reviewing your own tool-call sequence (or another agent's) for wasteful patterns — re-reading a file you just edited, repeated reads, bash echo for plain communication. | [open](wiki/skills/evokore-extensions/anti-slop.html) |
| **browser** | Use when automating browser interactions, web scraping, or E2E UI testing using AI-optimized abbreviated selectors and isolated multi-session contexts. | [open](wiki/skills/evokore-extensions/browser.html) |
| **github-release-management** | Use when cutting a GitHub release that needs progressive canary rollout (5%→25%→50%→100%) with automated health gates and auto-rollback on error-rate or latency regressions. | [open](wiki/skills/evokore-extensions/github-release-management.html) |
| **hooks-automation** | Use when implementing or debugging Claude Code hooks using the 3-phase memory sync pattern (STATUS→PROGRESS→COMPLETE) with JSON flow-control responses. | [open](wiki/skills/evokore-extensions/hooks-automation.html) |
| **master-workflow-555** | Use when orchestrating a non-trivial coding task end-to-end and you want disciplined phase/panel/gate structure. Drives the 5/5/5 master workflow (5 phases, 5 panels, 5 gates). | [open](wiki/skills/evokore-extensions/master-workflow-555.html) |
| **sparc-methodology** | Use when structuring complex development work using the 5-phase SPARC methodology (Specification, Pseudocode, Architecture, Refinement, Completion). | [open](wiki/skills/evokore-extensions/sparc-methodology.html) |
| **v3-mcp-optimization** | Use when ProxyManager throughput or cold-start latency is a bottleneck — catalogs six optimization patterns (O(1) lookup, 3-tier cache, batch compression, pool reuse, lazy deserialization, parallel boot). | [open](wiki/skills/evokore-extensions/v3-mcp-optimization.html) |
| **verification-quality** | Use when verifying work quality using truth scoring (0.0–1.0) with environment-tiered thresholds and machine-readable JSON CI gate output. | [open](wiki/skills/evokore-extensions/verification-quality.html) |

## GENERAL CODING WORKFLOWS

| Skill | Description | Wiki |
|---|---|---|
| **arch-aep-runner** | Manage the ARCH-AEP workflow review cycle. | [open](wiki/skills/general-coding-workflows/arch-aep-runner.html) |
| **docs-architect** | Execute a Gold Standard documentation overhaul or normalize cross-links across the existing docs suite. | [open](wiki/skills/general-coding-workflows/docs-architect.html) |
| **implementation-session** | Start an implementation cycle: review priorities, check stale branches, orchestrate agents for coding tasks, and wrap up the session. | [open](wiki/skills/general-coding-workflows/implementation-session.html) |
| **phase-spec-optimizer** | Analyzes a batch of completed phase specs against their actual session outcomes and produces an updated phase spec template with structural improvements. | [open](wiki/skills/general-coding-workflows/phase-spec-optimizer.html) |
| **planning-with-files** | Implements Manus-style file-based planning for complex tasks. Creates task_plan.md, findings.md, and progress.md. Use for tasks requiring >5 tool calls. | [open](wiki/skills/general-coding-workflows/planning-with-files.html) |
| **pr-manager** | Review, test, lint, and prepare smart merges for all open and closed PRs, verifying features and documenting technical debt. | [open](wiki/skills/general-coding-workflows/pr-manager.html) |
| **repo-ingestor** | Ingest external repositories, research papers, and benchmarks using 40-agent swarms to analyze, adapt features, and improve current workflows. | [open](wiki/skills/general-coding-workflows/repo-ingestor.html) |
| **security-review** | Comprehensive security review checklist covering input validation, authentication, secrets management, and vulnerability patterns. | [open](wiki/skills/general-coding-workflows/security-review.html) |
| **session-wrap** | Wrap up the current coding session by creating PRs, updating the session log, preparing the next session md, and updating CLAUDE.md with learnings. | [open](wiki/skills/general-coding-workflows/session-wrap.html) |

## HIVE FRAMEWORK

| Skill | Description | Wiki |
|---|---|---|
| **hive** | Complete workflow for building, implementing, and testing goal-driven agents. Orchestrates hive-* skills. | [open](wiki/skills/hive-framework/hive.html) |
| **hive-concepts** | Core concepts for goal-driven agents — architecture, node types (event_loop, function), tool discovery, and workflow overview. | [open](wiki/skills/hive-framework/hive-concepts.html) |
| **hive-create** | Step-by-step guide for building goal-driven agents. Qualifies use cases first, then creates package structure, defines goals, adds nodes, connects edges, and finalizes the agent class. | [open](wiki/skills/hive-framework/hive-create.html) |
| **hive-credentials** | Set up and install credentials for an agent. Detects missing credentials from agent config, collects them from the user, and stores them securely. | [open](wiki/skills/hive-framework/hive-credentials.html) |
| **hive-debugger** | Interactive debugging companion for Hive agents — identifies runtime issues and proposes solutions. | [open](wiki/skills/hive-framework/hive-debugger.html) |
| **hive-patterns** | Best practices, patterns, and examples for building goal-driven agents. Includes client-facing interaction, feedback edges, judge patterns, fan-out/fan-in, and anti-patterns. | [open](wiki/skills/hive-framework/hive-patterns.html) |
| **hive-test** | Iterative agent testing with session recovery. Execute, analyze, fix, resume from checkpoints. | [open](wiki/skills/hive-framework/hive-test.html) |
| **triage-issue-skill** | Specialized skill for triage issue skill workflows. | [open](wiki/skills/hive-framework/triage-issue-skill.html) |

## ORCHESTRATION FRAMEWORK

| Skill | Description | Wiki |
|---|---|---|
| **aep-framework** | Agile Engineering Process (Align-Execute-Prove) methodology with phase planning, test matrices, and evaluation harnesses. | [open](wiki/skills/orchestration-framework/aep-framework.html) |
| **agent-archetypes** | Reference agent definitions with capability taxonomy for multi-agent orchestration. | [open](wiki/skills/orchestration-framework/agent-archetypes.html) |
| **agent-spawn** | Use when you need to spawn a specialist sub-agent to handle a specific task domain without polluting the main session context. | [open](wiki/skills/orchestration-framework/agent-spawn.html) |
| **coding-reference** | Quick-reference coding standards and backend patterns for consistent development. | [open](wiki/skills/orchestration-framework/coding-reference.html) |
| **context-budget** | Use when you need to check the current session's context usage and get recommendations for compaction or continuation. | [open](wiki/skills/orchestration-framework/context-budget.html) |
| **cross-project-process-miner** | Aggregates session data from every project slug in ~/.claude/projects/ and surfaces systemic process patterns that appear in 3+ different projects. | [open](wiki/skills/orchestration-framework/cross-project-process-miner.html) |
| **fleet-status** | Use when you need to check the status of all running agents, workers, and claims in the current fleet. | [open](wiki/skills/orchestration-framework/fleet-status.html) |
| **handoff** | Use when ending a session and preparing for the next session — creates checkpoint, updates next-session.md, and ensures all PRs are tracked. | [open](wiki/skills/orchestration-framework/handoff.html) |
| **handoff-protocol** | Structured handoff protocol for multi-session agent orchestration with evidence capture. | [open](wiki/skills/orchestration-framework/handoff-protocol.html) |
| **improvement-cycles** | Structured improvement cycles with metrics review and retrospective templates. | [open](wiki/skills/orchestration-framework/improvement-cycles.html) |
| **narrative-quality-scorer** | Scores a phase spec, session prompt, or CLAUDE.md narrative against session efficiency patterns and returns a quality score with specific diff-style improvement suggestions. | [open](wiki/skills/orchestration-framework/narrative-quality-scorer.html) |
| **orch-build-fix** | Diagnose and fix build or test failures with minimal targeted changes. | [open](wiki/skills/orchestration-framework/orch-build-fix.html) |
| **orch-docs** | Synchronize documentation with code changes. | [open](wiki/skills/orchestration-framework/orch-docs.html) |
| **orch-e2e** | Generate and run end-to-end tests for critical flows. | [open](wiki/skills/orchestration-framework/orch-e2e.html) |
| **orch-handoff** | Generate a session wrap summary documenting state, decisions, and recommended next steps. | [open](wiki/skills/orchestration-framework/orch-handoff.html) |
| **orch-panel** | Invoke a Panel of Experts review on any artifact — code, architecture, plans, repos, or documentation. | [open](wiki/skills/orchestration-framework/orch-panel.html) |
| **orch-plan** | Create an approval-gated implementation plan with phased tasks and acceptance criteria. | [open](wiki/skills/orchestration-framework/orch-plan.html) |
| **orch-refactor** | Dead code cleanup and refactoring without behavior changes. | [open](wiki/skills/orchestration-framework/orch-refactor.html) |
| **orch-research** | Research top repos for a user-supplied topic with expert panel evaluation and presentation packaging. | [open](wiki/skills/orchestration-framework/orch-research.html) |
| **orch-review** | Trigger code review workflow with risk detection and reviewer routing. | [open](wiki/skills/orchestration-framework/orch-review.html) |
| **orch-status** | Review current operational state and surface blockers, constraints, or pending actions. | [open](wiki/skills/orchestration-framework/orch-status.html) |
| **orch-tasks** | List open tasks with priorities, status, and acceptance criteria. | [open](wiki/skills/orchestration-framework/orch-tasks.html) |
| **orch-tdd** | Use when implementing a feature via TDD — write a failing test first, get to green with the smallest correct change, then refactor. Enforces vertical slice shape and red-commit-hash evidence. | [open](wiki/skills/orchestration-framework/orch-tdd.html) |
| **orch-verify** | Capture verification evidence for the current task by running tests and logging results. | [open](wiki/skills/orchestration-framework/orch-verify.html) |
| **orchestration-commands** | Registry and index of all orchestration command skills. | [open](wiki/skills/orchestration-framework/orchestration-commands.html) |
| **orchestration-framework** | Core orchestration framework for model-agnostic multi-agent workflows with handoff protocol, policy governance, and configuration schemas. | [open](wiki/skills/orchestration-framework/orchestration-framework.html) |
| **orchestration-schemas** | JSON schemas for agent definitions, workflow configurations, and orchestrator settings. | [open](wiki/skills/orchestration-framework/orchestration-schemas.html) |
| **panel-of-experts** | Multi-persona expert panel framework for critical analysis, refinement, and creative insight. | [open](wiki/skills/orchestration-framework/panel-of-experts.html) |
| **pattern-learn** | Use when you want to run the ECC learning loop (eval-harness + pattern-extractor) over current session evidence to extract behavioral patterns and update MEMORY.md. | [open](wiki/skills/orchestration-framework/pattern-learn.html) |
| **policy-pack-v1** | Model-agnostic policy pack defining agent behavior, evidence requirements, and modular rules. | [open](wiki/skills/orchestration-framework/policy-pack-v1.html) |
| **quality-gate** | Use when you need to check if current work meets quality thresholds before proceeding to the next phase or merging. | [open](wiki/skills/orchestration-framework/quality-gate.html) |
| **scope-lock** | Use when you want to lock the session to a specific scope description, injecting it into purpose-gate context and optionally blocking out-of-scope tool calls. | [open](wiki/skills/orchestration-framework/scope-lock.html) |
| **session-checkpoint** | Use when you want to save a timestamped snapshot of current session state (tasks, evidence, purpose) to docs/session-logs/ for crash recovery or handoff. | [open](wiki/skills/orchestration-framework/session-checkpoint.html) |
| **session-retrospective-miner** | Automatically mines Claude session JSONL and EVOKORE session data to compute efficiency metrics and produce a structured retrospective report. | [open](wiki/skills/orchestration-framework/session-retrospective-miner.html) |
| **sparc-pipeline** | Use when running the full 5-phase SPARC methodology (Specification→Pseudocode→Architecture→Refinement→Completion) for a complex feature. Each phase has explicit done-criteria gates. | [open](wiki/skills/orchestration-framework/sparc-pipeline.html) |
| **sparc-spec** | Use when running SPARC Phase 1 (Specification) for a feature — produces phase_1_<slug>.md with Functional Requirements, Non-Functional Requirements, and Gherkin acceptance scenarios. | [open](wiki/skills/orchestration-framework/sparc-spec.html) |
| **tdd** | Use when implementing a feature using test-driven development — write failing tests first, then implement to make them pass. | [open](wiki/skills/orchestration-framework/tdd.html) |
| **tool-governance** | Tool governance framework with allowlists, progressive disclosure, and YAML-based tool definitions. | [open](wiki/skills/orchestration-framework/tool-governance.html) |
| **verify-quality** | Use when you need to run quality verification with truth scoring (0.0-1.0) and environment-tiered thresholds. Produces machine-readable JSON gate output for CI integration. | [open](wiki/skills/orchestration-framework/verify-quality.html) |
| **workflow-run** | Use when you need to execute a DAG-structured workflow template from SKILLS/ORCHESTRATION FRAMEWORK/workflow-templates/. | [open](wiki/skills/orchestration-framework/workflow-run.html) |
| **workflow-templates** | DAG-based workflow templates for incident response, release gating, code review, and more. | [open](wiki/skills/orchestration-framework/workflow-templates.html) |

## PLANNING

| Skill | Description | Wiki |
|---|---|---|
| **to-issues** | Use when decomposing an existing PRD at docs/prd/{slug}.md into independently-grabbable vertical-slice GitHub issues, with each slice tagged AFK (agent-ready) or HITL (needs-human) and routed through a panel-of-experts critique. | [open](wiki/skills/planning/to-issues.html) |
| **to-prd** | Use when synthesizing a Product Requirements Document (PRD) from prior session evidence (replay logs, ADRs, evidence captures, prior PRDs) and routing it through a panel-of-experts review. | [open](wiki/skills/planning/to-prd.html) |

## PROJECT MANAGEMENT

| Skill | Description | Wiki |
|---|---|---|
| **github-triage** | Use when transitioning open GitHub issues through a 7-state label-based triage state machine (triage:new through triage:done) by reading issue bodies and evidence rather than waiting for maintainer triggers. | [open](wiki/skills/project-management/github-triage.html) |

## QA

| Skill | Description | Wiki |
|---|---|---|
| **triage-bug** | Use when triaging a bug from session evidence (evidence-capture JSONL, replay JSONL, telemetry, repo-audit) instead of from a live user description, and producing a TDD fix plan plus a docs/bugs/{slug}.md triage artifact. | [open](wiki/skills/qa/triage-bug.html) |

## RESEARCH AND CONTENT

| Skill | Description | Wiki |
|---|---|---|
| **competitive-ads-extractor** | Extracts and analyzes competitors' ads from ad libraries (Facebook, LinkedIn, etc.) to understand what messaging, problems, and creative approaches are working. | [open](wiki/skills/research-and-content/competitive-ads-extractor.html) |
| **content-research-writer** | Assists in writing high-quality content by conducting research, adding citations, improving hooks, iterating on outlines, and providing real-time feedback on each section. | [open](wiki/skills/research-and-content/content-research-writer.html) |
| **lead-research-assistant** | Identifies high-quality leads for your product or service by analyzing your business, searching for target companies, and providing actionable contact strategies. | [open](wiki/skills/research-and-content/lead-research-assistant.html) |
| **meeting-insights-analyzer** | Analyzes meeting transcripts and recordings to uncover behavioral patterns, communication insights, and actionable feedback. | [open](wiki/skills/research-and-content/meeting-insights-analyzer.html) |
| **twitter-algorithm-optimizer** | Analyze and optimize tweets for maximum reach using Twitter's open-source algorithm insights. | [open](wiki/skills/research-and-content/twitter-algorithm-optimizer.html) |

## Stitch Skills

| Skill | Description | Wiki |
|---|---|---|
| **design-md** | Analyze Stitch projects and synthesize a semantic design system into DESIGN.md files. | [open](wiki/skills/stitch-skills/design-md.html) |
| **enhance-prompt** | Transforms vague UI ideas into polished, Stitch-optimized prompts. Enhances specificity, adds UI/UX keywords, injects design system context. | [open](wiki/skills/stitch-skills/enhance-prompt.html) |
| **react-components** | Converts Stitch designs into modular Vite and React components using system-level networking and AST-based validation. | [open](wiki/skills/stitch-skills/react-components.html) |
| **remotion** | Generate walkthrough videos from Stitch projects using Remotion with smooth transitions, zooming, and text overlays. | [open](wiki/skills/stitch-skills/remotion.html) |
| **shadcn-ui** | Expert guidance for integrating and building applications with shadcn/ui components, including component discovery, installation, customization, and best practices. | [open](wiki/skills/stitch-skills/shadcn-ui.html) |
| **stitch-design** | Unified entry point for Stitch design work. Handles prompt enhancement, design system synthesis (.stitch/DESIGN.md), and high-fidelity screen generation/editing. | [open](wiki/skills/stitch-skills/stitch-design.html) |
| **stitch-loop** | Teaches agents to iteratively build websites using Stitch with an autonomous baton-passing loop pattern. | [open](wiki/skills/stitch-skills/stitch-loop.html) |

## WSHOBSON PLUGINS

| Skill | Description | Wiki |
|---|---|---|
| **airflow-dag-patterns** | Build production Apache Airflow DAGs with best practices for task design, scheduling, and orchestration. | [open](wiki/skills/wshobson-plugins/airflow-dag-patterns.html) |
| **angular-migration** | Migrate from AngularJS to Angular using hybrid mode, incremental upgrades, and componentization strategies. | [open](wiki/skills/wshobson-plugins/angular-migration.html) |
| **anti-reversing-techniques** | Understand anti-reversing, obfuscation, and protection techniques used by hardened binaries. | [open](wiki/skills/wshobson-plugins/anti-reversing-techniques.html) |
| **api-design-principles** | Master REST and GraphQL API design principles to build intuitive, scalable, and maintainable APIs. | [open](wiki/skills/wshobson-plugins/api-design-principles.html) |
| **architecture-decision-records** | Write and maintain Architecture Decision Records (ADRs) following Michael Nygard's template and lightweight ADR practice. | [open](wiki/skills/wshobson-plugins/architecture-decision-records.html) |
| **architecture-patterns** | Implement proven backend architecture patterns including Clean Architecture, Hexagonal Architecture, and Domain-Driven Design. | [open](wiki/skills/wshobson-plugins/architecture-patterns.html) |
| **async-python-patterns** | Master Python asyncio, concurrent programming, and async/await patterns for I/O-bound workloads. | [open](wiki/skills/wshobson-plugins/async-python-patterns.html) |
| **attack-tree-construction** | Build comprehensive attack trees to visualize threat paths. | [open](wiki/skills/wshobson-plugins/attack-tree-construction.html) |
| **auth-implementation-patterns** | Master authentication and authorization patterns including JWT, OAuth2/OIDC, SAML, MFA, and session management. | [open](wiki/skills/wshobson-plugins/auth-implementation-patterns.html) |
| **backtesting-frameworks** | Build robust backtesting systems for trading strategies with proper handling of historical data, transaction costs, and slippage. | [open](wiki/skills/wshobson-plugins/backtesting-frameworks.html) |
| **bash-defensive-patterns** | Master defensive Bash programming techniques for production-grade scripts. | [open](wiki/skills/wshobson-plugins/bash-defensive-patterns.html) |
| **bats-testing-patterns** | Master Bash Automated Testing System (Bats) for comprehensive shell script testing. | [open](wiki/skills/wshobson-plugins/bats-testing-patterns.html) |
| **bazel-build-optimization** | Optimize Bazel builds for large-scale monorepos. | [open](wiki/skills/wshobson-plugins/bazel-build-optimization.html) |
| **billing-automation** | Build automated billing systems for recurring payments, invoicing, subscriptions, and revenue operations. | [open](wiki/skills/wshobson-plugins/billing-automation.html) |
| **binary-analysis-patterns** | Master binary analysis patterns including disassembly, decompilation, and structural recovery. | [open](wiki/skills/wshobson-plugins/binary-analysis-patterns.html) |
| **changelog-automation** | Automate changelog generation from commits, PRs, and releases following Keep a Changelog and Conventional Commits. | [open](wiki/skills/wshobson-plugins/changelog-automation.html) |
| **code-review-excellence** | Master effective code review practices to provide constructive feedback and catch issues before merge. | [open](wiki/skills/wshobson-plugins/code-review-excellence.html) |
| **competitive-landscape** | Analyze competitive landscape, market positioning, and differentiation strategies. | [open](wiki/skills/wshobson-plugins/competitive-landscape.html) |
| **context-driven-development** | Creates and maintains project context artifacts (product.md, structure.md, tech.md) for Conductor workflows. | [open](wiki/skills/wshobson-plugins/context-driven-development.html) |
| **cost-optimization** | Optimize cloud costs through resource rightsizing, tagging strategies, reserved instances, and spending analysis. | [open](wiki/skills/wshobson-plugins/cost-optimization.html) |
| **cqrs-implementation** | Implement Command Query Responsibility Segregation for scalable architectures with separate read and write models. | [open](wiki/skills/wshobson-plugins/cqrs-implementation.html) |
| **data-quality-frameworks** | Implement data quality validation with Great Expectations, dbt tests, and pipeline-level checks. | [open](wiki/skills/wshobson-plugins/data-quality-frameworks.html) |
| **data-storytelling** | Transform data into compelling narratives using visualization, context, and persuasive structure. | [open](wiki/skills/wshobson-plugins/data-storytelling.html) |
| **database-migration** | Execute database migrations across ORMs and platforms with zero-downtime strategies. | [open](wiki/skills/wshobson-plugins/database-migration.html) |
| **dbt-transformation-patterns** | Master dbt (data build tool) for analytics engineering with model design, testing, documentation, and incremental strategies. | [open](wiki/skills/wshobson-plugins/dbt-transformation-patterns.html) |
| **debugging-strategies** | Master systematic debugging techniques, profiling tools, and root cause analysis. | [open](wiki/skills/wshobson-plugins/debugging-strategies.html) |
| **defi-protocol-templates** | Implement DeFi protocols with production-ready templates for staking, AMMs, governance, and lending systems. | [open](wiki/skills/wshobson-plugins/defi-protocol-templates.html) |
| **dependency-upgrade** | Manage major dependency version upgrades with compatibility checks, codemods, and incremental rollouts. | [open](wiki/skills/wshobson-plugins/dependency-upgrade.html) |
| **deployment-pipeline-design** | Design multi-stage CI/CD pipelines with approval gates, security checks, and deployment orchestration. | [open](wiki/skills/wshobson-plugins/deployment-pipeline-design.html) |
| **design-system-patterns** | Build scalable design systems with design tokens, theming, and component composition. | [open](wiki/skills/wshobson-plugins/design-system-patterns.html) |
| **distributed-tracing** | Implement distributed tracing with Jaeger and Tempo to track requests across microservices. | [open](wiki/skills/wshobson-plugins/distributed-tracing.html) |
| **dotnet-backend-patterns** | Master C#/.NET backend development patterns for building robust, production-ready services. | [open](wiki/skills/wshobson-plugins/dotnet-backend-patterns.html) |
| **e2e-testing-patterns** | Master end-to-end testing with Playwright and Cypress to build comprehensive test suites. | [open](wiki/skills/wshobson-plugins/e2e-testing-patterns.html) |
| **embedding-strategies** | Select and optimize embedding models for semantic search and RAG applications. | [open](wiki/skills/wshobson-plugins/embedding-strategies.html) |
| **employment-contract-templates** | Create employment contracts, offer letters, and HR policy documents tailored by jurisdiction. | [open](wiki/skills/wshobson-plugins/employment-contract-templates.html) |
| **error-handling-patterns** | Master error handling patterns across languages including exceptions, Result/Either types, and panic recovery. | [open](wiki/skills/wshobson-plugins/error-handling-patterns.html) |
| **event-store-design** | Design and implement event stores for event-sourced systems. | [open](wiki/skills/wshobson-plugins/event-store-design.html) |
| **fastapi-templates** | Create production-ready FastAPI projects with async patterns, dependency injection, and comprehensive error handling. | [open](wiki/skills/wshobson-plugins/fastapi-templates.html) |
| **gdpr-data-handling** | Implement GDPR-compliant data handling with consent management, right-to-erasure, and data subject access requests. | [open](wiki/skills/wshobson-plugins/gdpr-data-handling.html) |
| **git-advanced-workflows** | Master advanced Git workflows including rebasing, cherry-picking, bisect, worktrees, and history rewriting. | [open](wiki/skills/wshobson-plugins/git-advanced-workflows.html) |
| **github-actions-templates** | Create production-ready GitHub Actions workflows for automated testing, building, and deploying applications. | [open](wiki/skills/wshobson-plugins/github-actions-templates.html) |
| **gitlab-ci-patterns** | Build GitLab CI/CD pipelines with multi-stage workflows, caching, and distributed runners. | [open](wiki/skills/wshobson-plugins/gitlab-ci-patterns.html) |
| **gitops-workflow** | Implement GitOps workflows with ArgoCD and Flux for automated, declarative deployments. | [open](wiki/skills/wshobson-plugins/gitops-workflow.html) |
| **go-concurrency-patterns** | Master Go concurrency with goroutines, channels, sync primitives, and context cancellation. | [open](wiki/skills/wshobson-plugins/go-concurrency-patterns.html) |
| **godot-gdscript-patterns** | Master Godot 4 GDScript patterns including signals, scenes, state machines, and game architecture. | [open](wiki/skills/wshobson-plugins/godot-gdscript-patterns.html) |
| **grafana-dashboards** | Create and manage production Grafana dashboards for real-time observability. | [open](wiki/skills/wshobson-plugins/grafana-dashboards.html) |
| **helm-chart-scaffolding** | Design, organize, and manage Helm charts for templating and deploying Kubernetes applications. | [open](wiki/skills/wshobson-plugins/helm-chart-scaffolding.html) |
| **hybrid-cloud-networking** | Configure secure, high-performance connectivity between on-premises infrastructure and cloud platforms. | [open](wiki/skills/wshobson-plugins/hybrid-cloud-networking.html) |
| **hybrid-search-implementation** | Combine vector and keyword search for improved retrieval. | [open](wiki/skills/wshobson-plugins/hybrid-search-implementation.html) |
| **incident-runbook-templates** | Create structured incident response runbooks with step-by-step procedures and escalation paths. | [open](wiki/skills/wshobson-plugins/incident-runbook-templates.html) |
| **interaction-design** | Design and implement microinteractions, motion design, transitions, and gestural interfaces. | [open](wiki/skills/wshobson-plugins/interaction-design.html) |
| **istio-traffic-management** | Configure Istio traffic management including routing, load balancing, circuit breakers, and canary deployments. | [open](wiki/skills/wshobson-plugins/istio-traffic-management.html) |
| **javascript-testing-patterns** | Implement comprehensive testing strategies using Jest, Vitest, and Testing Library. | [open](wiki/skills/wshobson-plugins/javascript-testing-patterns.html) |
| **k8s-manifest-generator** | Create production-ready Kubernetes manifests for Deployments, Services, Ingress, and supporting resources. | [open](wiki/skills/wshobson-plugins/k8s-manifest-generator.html) |
| **k8s-security-policies** | Implement Kubernetes security policies including NetworkPolicy, PodSecurityStandards, and RBAC. | [open](wiki/skills/wshobson-plugins/k8s-security-policies.html) |
| **kpi-dashboard-design** | Design effective KPI dashboards with metrics selection, visualization best practices, and real-time monitoring patterns. | [open](wiki/skills/wshobson-plugins/kpi-dashboard-design.html) |
| **langchain-architecture** | Design LLM applications using LangChain 1.x and LangGraph for complex agent workflows. | [open](wiki/skills/wshobson-plugins/langchain-architecture.html) |
| **linkerd-patterns** | Implement Linkerd service mesh patterns for lightweight, security-focused service mesh deployments. | [open](wiki/skills/wshobson-plugins/linkerd-patterns.html) |
| **llm-evaluation** | Implement comprehensive evaluation strategies for LLM applications including offline evals and production monitoring. | [open](wiki/skills/wshobson-plugins/llm-evaluation.html) |
| **market-sizing-analysis** | Calculate TAM, SAM, and SOM with rigorous methodologies. | [open](wiki/skills/wshobson-plugins/market-sizing-analysis.html) |
| **memory-forensics** | Master memory forensics techniques including memory acquisition, volatility analysis, and artifact recovery. | [open](wiki/skills/wshobson-plugins/memory-forensics.html) |
| **memory-safety-patterns** | Implement memory-safe programming with RAII, ownership, smart pointers, and lifetime management. | [open](wiki/skills/wshobson-plugins/memory-safety-patterns.html) |
| **microservices-patterns** | Design microservices architectures with service boundaries, event-driven communication, and resilience patterns. | [open](wiki/skills/wshobson-plugins/microservices-patterns.html) |
| **ml-pipeline-workflow** | Build end-to-end MLOps pipelines from data preparation through model deployment and monitoring. | [open](wiki/skills/wshobson-plugins/ml-pipeline-workflow.html) |
| **mobile-android-design** | Master Material Design 3 and Jetpack Compose patterns for building modern Android UIs. | [open](wiki/skills/wshobson-plugins/mobile-android-design.html) |
| **mobile-ios-design** | Master iOS Human Interface Guidelines and SwiftUI patterns for native iOS interfaces. | [open](wiki/skills/wshobson-plugins/mobile-ios-design.html) |
| **modern-javascript-patterns** | Master ES6+ features including async/await, destructuring, spread/rest, and module patterns. | [open](wiki/skills/wshobson-plugins/modern-javascript-patterns.html) |
| **monorepo-management** | Master monorepo management with Turborepo, Nx, and pnpm workspaces. | [open](wiki/skills/wshobson-plugins/monorepo-management.html) |
| **mtls-configuration** | Configure mutual TLS (mTLS) for zero-trust service-to-service communication. | [open](wiki/skills/wshobson-plugins/mtls-configuration.html) |
| **multi-cloud-architecture** | Design multi-cloud architectures using a decision framework to choose AWS, Azure, GCP, or hybrid deployments. | [open](wiki/skills/wshobson-plugins/multi-cloud-architecture.html) |
| **multi-reviewer-patterns** | Coordinate parallel code reviews across multiple quality dimensions with finding deduplication, severity calibration, and consolidated reporting. | [open](wiki/skills/wshobson-plugins/multi-reviewer-patterns.html) |
| **nextjs-app-router-patterns** | Master Next.js 14+ App Router with Server Components, streaming, parallel routes, and route handlers. | [open](wiki/skills/wshobson-plugins/nextjs-app-router-patterns.html) |
| **nft-standards** | Implement NFT standards (ERC-721, ERC-1155) with proper metadata handling, minting strategies, and marketplace integration. | [open](wiki/skills/wshobson-plugins/nft-standards.html) |
| **nodejs-backend-patterns** | Build production-ready Node.js backend services with Express, Fastify, NestJS, and modern async patterns. | [open](wiki/skills/wshobson-plugins/nodejs-backend-patterns.html) |
| **nx-workspace-patterns** | Configure and optimize Nx monorepo workspaces. | [open](wiki/skills/wshobson-plugins/nx-workspace-patterns.html) |
| **on-call-handoff-patterns** | Master on-call shift handoffs with context transfer, escalation procedures, and runbook references. | [open](wiki/skills/wshobson-plugins/on-call-handoff-patterns.html) |
| **openapi-spec-generation** | Generate and maintain OpenAPI 3.1 specifications from code, decorators, or annotations. | [open](wiki/skills/wshobson-plugins/openapi-spec-generation.html) |
| **parallel-debugging** | Debug complex issues using competing hypotheses with parallel investigation, evidence collection, and root cause arbitration. | [open](wiki/skills/wshobson-plugins/parallel-debugging.html) |
| **parallel-feature-development** | Coordinate parallel feature development with file ownership strategies, conflict avoidance rules, and integration patterns. | [open](wiki/skills/wshobson-plugins/parallel-feature-development.html) |
| **paypal-integration** | Integrate PayPal payment processing with support for express checkout, subscriptions, and webhooks. | [open](wiki/skills/wshobson-plugins/paypal-integration.html) |
| **pci-compliance** | Implement PCI DSS compliance requirements for secure handling of cardholder data. | [open](wiki/skills/wshobson-plugins/pci-compliance.html) |
| **postgresql-table-design** | Design a PostgreSQL-specific schema. Covers best-practices, data modeling, indexes, and query patterns. | [open](wiki/skills/wshobson-plugins/postgresql-table-design.html) |
| **postmortem-writing** | Write effective blameless postmortems with root cause analysis, timeline reconstruction, and action items. | [open](wiki/skills/wshobson-plugins/postmortem-writing.html) |
| **projection-patterns** | Build read models and projections from event streams. | [open](wiki/skills/wshobson-plugins/projection-patterns.html) |
| **prometheus-configuration** | Set up Prometheus for comprehensive metric collection, storage, and alerting. | [open](wiki/skills/wshobson-plugins/prometheus-configuration.html) |
| **prompt-engineering-patterns** | Master advanced prompt engineering techniques to maximize LLM output quality and consistency. | [open](wiki/skills/wshobson-plugins/prompt-engineering-patterns.html) |
| **protocol-reverse-engineering** | Master network protocol reverse engineering including packet capture, format inference, and replay. | [open](wiki/skills/wshobson-plugins/protocol-reverse-engineering.html) |
| **python-anti-patterns** | Common Python anti-patterns to avoid. Use as a checklist when reviewing or refactoring Python code. | [open](wiki/skills/wshobson-plugins/python-anti-patterns.html) |
| **python-background-jobs** | Python background job patterns including task queues, workers, and scheduled jobs with Celery, RQ, and Dramatiq. | [open](wiki/skills/wshobson-plugins/python-background-jobs.html) |
| **python-code-style** | Python code style, linting, formatting, naming conventions, and tooling (Ruff, Black, isort). | [open](wiki/skills/wshobson-plugins/python-code-style.html) |
| **python-configuration** | Python configuration management via environment variables and typed settings (Pydantic Settings, dynaconf). | [open](wiki/skills/wshobson-plugins/python-configuration.html) |
| **python-design-patterns** | Python design patterns including KISS, Separation of Concerns, and Pythonic idioms. | [open](wiki/skills/wshobson-plugins/python-design-patterns.html) |
| **python-error-handling** | Python error handling patterns including input validation, custom exceptions, and error boundaries. | [open](wiki/skills/wshobson-plugins/python-error-handling.html) |
| **python-observability** | Python observability patterns including structured logging, metrics, and distributed tracing. | [open](wiki/skills/wshobson-plugins/python-observability.html) |
| **python-packaging** | Create distributable Python packages with proper project structure, metadata, and publish workflows. | [open](wiki/skills/wshobson-plugins/python-packaging.html) |
| **python-performance-optimization** | Profile and optimize Python code using cProfile, memory profilers, and concurrency strategies. | [open](wiki/skills/wshobson-plugins/python-performance-optimization.html) |
| **python-project-structure** | Python project organization, module architecture, and public API design. | [open](wiki/skills/wshobson-plugins/python-project-structure.html) |
| **python-resilience** | Python resilience patterns including automatic retries, exponential backoff, and circuit breakers. | [open](wiki/skills/wshobson-plugins/python-resilience.html) |
| **python-resource-management** | Python resource management with context managers, cleanup patterns, and `with` statements. | [open](wiki/skills/wshobson-plugins/python-resource-management.html) |
| **python-testing-patterns** | Implement comprehensive testing strategies with pytest, fixtures, parametrization, and mocking. | [open](wiki/skills/wshobson-plugins/python-testing-patterns.html) |
| **python-type-safety** | Python type safety with type hints, generics, protocols, and strict mypy configuration. | [open](wiki/skills/wshobson-plugins/python-type-safety.html) |
| **rag-implementation** | Build Retrieval-Augmented Generation (RAG) systems for LLM applications with vector stores and rerankers. | [open](wiki/skills/wshobson-plugins/rag-implementation.html) |
| **react-modernization** | Upgrade React applications to latest versions, migrate from class components, and adopt modern hooks. | [open](wiki/skills/wshobson-plugins/react-modernization.html) |
| **react-native-architecture** | Build production React Native apps with Expo, navigation, native modules, and offline-first patterns. | [open](wiki/skills/wshobson-plugins/react-native-architecture.html) |
| **react-native-design** | Master React Native styling, navigation, and Reanimated animations for polished mobile UI. | [open](wiki/skills/wshobson-plugins/react-native-design.html) |
| **react-state-management** | Master modern React state management with Redux Toolkit, Zustand, TanStack Query, and Context. | [open](wiki/skills/wshobson-plugins/react-state-management.html) |
| **responsive-design** | Implement modern responsive layouts using container queries, fluid type scales, and grid/flex composition. | [open](wiki/skills/wshobson-plugins/responsive-design.html) |
| **risk-metrics-calculation** | Calculate portfolio risk metrics including VaR, CVaR, Sharpe ratio, and drawdown statistics. | [open](wiki/skills/wshobson-plugins/risk-metrics-calculation.html) |
| **rust-async-patterns** | Master Rust async programming with Tokio, async traits, error handling, and structured concurrency. | [open](wiki/skills/wshobson-plugins/rust-async-patterns.html) |
| **saga-orchestration** | Implement saga patterns for distributed transactions and cross-aggregate workflows. | [open](wiki/skills/wshobson-plugins/saga-orchestration.html) |
| **sast-configuration** | Configure Static Application Security Testing (SAST) tools for repeatable security scanning. | [open](wiki/skills/wshobson-plugins/sast-configuration.html) |
| **screen-reader-testing** | Test web applications with screen readers including VoiceOver, NVDA, and JAWS. | [open](wiki/skills/wshobson-plugins/screen-reader-testing.html) |
| **secrets-management** | Implement secure secrets management for CI/CD pipelines using Vault, AWS Secrets Manager, or native platform solutions. | [open](wiki/skills/wshobson-plugins/secrets-management.html) |
| **security-requirement-extraction** | Derive security requirements from threat models and business needs. | [open](wiki/skills/wshobson-plugins/security-requirement-extraction.html) |
| **service-mesh-observability** | Implement comprehensive observability for service meshes including metrics, traces, and logs. | [open](wiki/skills/wshobson-plugins/service-mesh-observability.html) |
| **shellcheck-configuration** | Master ShellCheck static analysis configuration and usage for shell scripts. | [open](wiki/skills/wshobson-plugins/shellcheck-configuration.html) |
| **similarity-search-patterns** | Implement efficient similarity search with vector databases. | [open](wiki/skills/wshobson-plugins/similarity-search-patterns.html) |
| **slo-implementation** | Define and implement Service Level Indicators (SLIs) and Service Level Objectives (SLOs) with error budgets. | [open](wiki/skills/wshobson-plugins/slo-implementation.html) |
| **solidity-security** | Master smart contract security best practices to prevent common vulnerabilities and implement secure Solidity patterns. | [open](wiki/skills/wshobson-plugins/solidity-security.html) |
| **spark-optimization** | Optimize Apache Spark jobs with partitioning, caching, shuffle minimization, and adaptive query execution. | [open](wiki/skills/wshobson-plugins/spark-optimization.html) |
| **sql-optimization-patterns** | Master SQL query optimization, indexing strategies, and EXPLAIN plan analysis. | [open](wiki/skills/wshobson-plugins/sql-optimization-patterns.html) |
| **startup-financial-modeling** | Create financial models including projections, scenario analysis, and unit economics. | [open](wiki/skills/wshobson-plugins/startup-financial-modeling.html) |
| **startup-metrics-framework** | Track and analyze startup metrics including MRR, CAC, LTV, churn, and engagement. | [open](wiki/skills/wshobson-plugins/startup-metrics-framework.html) |
| **stride-analysis-patterns** | Apply STRIDE methodology to systematically identify threats. | [open](wiki/skills/wshobson-plugins/stride-analysis-patterns.html) |
| **stripe-integration** | Implement Stripe payment processing for robust, PCI-compliant payments. | [open](wiki/skills/wshobson-plugins/stripe-integration.html) |
| **tailwind-design-system** | Build scalable design systems with Tailwind CSS v4, design tokens, and component composition. | [open](wiki/skills/wshobson-plugins/tailwind-design-system.html) |
| **task-coordination-strategies** | Decompose complex tasks, design dependency graphs, and coordinate multi-agent work with proper task descriptions and workload balancing. | [open](wiki/skills/wshobson-plugins/task-coordination-strategies.html) |
| **team-communication-protocols** | Structured messaging protocols for agent team communication including message type selection, plan approval, and shutdown procedures. | [open](wiki/skills/wshobson-plugins/team-communication-protocols.html) |
| **team-composition-analysis** | Plan team composition and skill mix for a given product or growth stage. | [open](wiki/skills/wshobson-plugins/team-composition-analysis.html) |
| **team-composition-patterns** | Design optimal agent team compositions with sizing heuristics, preset configurations, and agent type selection. | [open](wiki/skills/wshobson-plugins/team-composition-patterns.html) |
| **temporal-python-testing** | Test Temporal workflows with pytest, time-skipping, and mocking strategies. | [open](wiki/skills/wshobson-plugins/temporal-python-testing.html) |
| **terraform-module-library** | Build reusable Terraform modules for AWS, Azure, and GCP with proper variable, output, and version pinning conventions. | [open](wiki/skills/wshobson-plugins/terraform-module-library.html) |
| **threat-mitigation-mapping** | Map identified threats to appropriate security controls and mitigations. | [open](wiki/skills/wshobson-plugins/threat-mitigation-mapping.html) |
| **track-management** | Create, manage, and work with Conductor tracks for parallel workstreams. | [open](wiki/skills/wshobson-plugins/track-management.html) |
| **turborepo-caching** | Configure Turborepo for efficient monorepo builds with local and remote caching. | [open](wiki/skills/wshobson-plugins/turborepo-caching.html) |
| **typescript-advanced-types** | Master TypeScript's advanced type system including generics, conditional types, mapped types, and template literal types. | [open](wiki/skills/wshobson-plugins/typescript-advanced-types.html) |
| **unity-ecs-patterns** | Master Unity ECS (Entity Component System) with DOTS, Jobs, and Burst compiler patterns. | [open](wiki/skills/wshobson-plugins/unity-ecs-patterns.html) |
| **uv-package-manager** | Master the uv package manager for fast Python dependency management. | [open](wiki/skills/wshobson-plugins/uv-package-manager.html) |
| **vector-index-tuning** | Optimize vector index performance for latency, recall, and memory across HNSW, IVF, and DiskANN. | [open](wiki/skills/wshobson-plugins/vector-index-tuning.html) |
| **visual-design-foundations** | Apply typography, color theory, spacing systems, and iconography to build cohesive visual hierarchies. | [open](wiki/skills/wshobson-plugins/visual-design-foundations.html) |
| **wcag-audit-patterns** | Conduct WCAG 2.2 accessibility audits with automated testing, manual verification, and remediation guidance. | [open](wiki/skills/wshobson-plugins/wcag-audit-patterns.html) |
| **web-component-design** | Master React, Vue, and Svelte component patterns including composition, state, and styling strategies. | [open](wiki/skills/wshobson-plugins/web-component-design.html) |
| **web3-testing** | Test smart contracts comprehensively using Hardhat and Foundry with unit tests, integration tests, and mainnet forking. | [open](wiki/skills/wshobson-plugins/web3-testing.html) |
| **workflow-orchestration-patterns** | Design durable workflows with Temporal for distributed systems. | [open](wiki/skills/wshobson-plugins/workflow-orchestration-patterns.html) |
| **workflow-patterns** | Implementing tasks according to Conductor's TDD workflow patterns. | [open](wiki/skills/wshobson-plugins/workflow-patterns.html) |

### WSHOBSON PLUGINS — UI design subcategory

Already included in the alphabetical list above: `accessibility-compliance` (UI/WCAG flavor), `design-system-patterns`, `interaction-design`, `mobile-android-design`, `mobile-ios-design`, `react-native-design`, `responsive-design`, `visual-design-foundations`, `web-component-design`.

### WSHOBSON PLUGINS — also indexed

`accessibility-compliance` (under `ui-design/`) and the agent-teams set (`multi-reviewer-patterns`, `parallel-debugging`, `parallel-feature-development`, `task-coordination-strategies`, `team-communication-protocols`, `team-composition-patterns`) are rolled into the alphabetical list. The wiki regenerator emits canonical slugs per file path.

## Notes

- The wiki regenerator is the source of truth for skill slugs and per-page links. If a row's wiki link 404s, run `npm run wiki:build` to regenerate `docs/wiki/skills/**`.
- The HIVE FRAMEWORK row `triage-issue-skill` matches the frontmatter `name`; the directory is `triage-issue/`. The wiki link follows the frontmatter slug.
- Descriptions here are first-line snapshots from each `description:` field. The wiki pages render the full multi-line description plus body, examples, and composition data.

## See also

- [Skills Overview](./SKILLS_OVERVIEW.md) — narrative grouping with code / non-code tags
- [Training and Use Cases](./TRAINING_AND_USE_CASES.md) — category-level navigation index
- [Panel of Experts](./PANEL_OF_EXPERTS.md) — multi-persona review framework
- [Architecture: AEP System](./ARCH_AEP_SYSTEM.md) — engineering cycle behind the orchestration workflows

Last verified: 2026-05-20
