# EVOKORE-MCP — Executive Summary

EVOKORE-MCP is a single endpoint that an AI assistant can connect to and immediately get access to a curated, governed catalog of tools, skills, and review frameworks. The goal is simple: turn an AI assistant into a reliable operator for real work — code, content, research, design, business operations — rather than a brittle chat session that forgets what it just did. This page is written for non-technical readers who want to understand what EVOKORE is, why it exists, and what changes once it is in place.

## What this covers

- What EVOKORE-MCP is, in one paragraph
- The three problems it solves
- What an AI assistant can actually do once it is connected
- Where the work shows up
- Who EVOKORE-MCP is for

## What it is

EVOKORE-MCP is an open-source server that sits between an AI assistant and the rest of the digital toolchain. Whatever the assistant needs — a code repository, a filesystem, a database, a voice synthesizer, a project tracker, a webhook, an internal tool — EVOKORE presents it as a single, consistent surface. It also ships with a large built-in library of "skills" (well-described workflow recipes) and review frameworks that let the assistant operate with the discipline of a small team rather than a single chat window.

## The three problems it solves

1. **Too many disconnected endpoints.** An AI assistant typically has to be wired up to many separate services, each with its own connection, its own permissions, and its own quirks. EVOKORE collapses all of that into one endpoint and one configuration file.
2. **Too much noise in the tool list.** When an assistant can see hundreds of available tools, it gets distracted, slow, and expensive. EVOKORE supports both a full-visibility mode for compatibility and a focused mode where only the tools relevant to the current task are activated.
3. **Too little governance.** Sensitive actions need a human in the loop. EVOKORE has a built-in approval gate, role-based access (admin, developer, read-only), rate limiting, and signed webhook events, so a real organization can deploy it without holding its breath.

## What the assistant can actually do once it is connected

- **Use your tools.** EVOKORE proxies a configurable set of MCP child servers — for example, a GitHub server for repository operations, a filesystem server for local edits, optionally an ElevenLabs server for voice output, and any other MCP server you bring. The assistant calls them the same way it calls anything else.
- **Run skills.** The skill library covers code workflows (architecture refactoring, security review, test-driven development, repository ingestion, release management) and non-code workflows (research, content writing, business strategy, brand guidelines, document creation, presentations, design pipelines, customer success, sales, finance, legal review).
- **Convene expert panels.** The Panel of Experts framework lets the assistant assemble a virtual panel — four or more domain specialists with distinct biases and review lenses — to critique a piece of code, an architecture decision, a marketing plan, or any other artifact. The output is a persisted, audit-grade review, not a chat reply.
- **Stay coherent across long sessions.** EVOKORE keeps a session manifest with the operator's stated purpose, evidence of work completed, and a record of every tool call. That manifest survives across restarts, so the assistant does not start from zero every time a new chat begins.
- **Stay on the rails.** The Align-Execute-Prove engineering cycle ships as a workflow framework. It enforces scope-lock, tiered remediation (critical before high before medium), and verification evidence for every merged change. For organizations that need an auditable trail, this is built in.

## Where the work shows up

- **In your repository.** Code changes happen as normal pull requests with normal commit messages.
- **In your decision history.** Architectural decisions are recorded as ADRs (architecture decision records) in `docs/adr/`, freezing only after two independent review passes converge.
- **In a session dashboard.** A small local web dashboard at `127.0.0.1:8899` shows the timeline of tool calls, the evidence captured, and any pending approval requests.
- **In webhook events.** If you configure them, EVOKORE emits signed events for tool calls, errors, session starts and ends, and approval flow. You can consume those events in your own systems for monitoring, audit, or automation.
- **In persisted panel reviews.** Every panel run lands as a dated, indexed markdown artifact in `docs/panel-reviews/`. A panel review that is not persisted is a review that did not happen.

## Who it is for

- **Engineering teams** that want their AI assistant to operate against real codebases under real review discipline, not just answer questions.
- **Founders and operators** who want one assistant to credibly help across code, content, research, and business operations without manually stitching together a dozen integrations.
- **Reviewers and auditors** who need a verifiable record of what the assistant did, why, and on whose authority.
- **Builders** who want a stable platform on which to ship their own custom tools (via the plugin system) and their own workflow skills.

## What success looks like

A session starts with the operator stating intent. The assistant proposes a plan, executes against the relevant tools and skills, surfaces approval gates for any destructive operation, captures evidence as it goes, and ends with a verifiable record of what was done. The next session resumes from the manifest without losing the thread. Across many sessions, the body of decisions, reviews, and evidence accumulates as searchable, auditable history.

EVOKORE-MCP makes that loop feasible on commodity hardware, without external services, and without sending sensitive context out to anything you have not explicitly configured.

## See also

- [New User Brutal Honesty Kit](./NEW_USER_BHK.md) — sharp edges, severity-scored
- [Technical Analysis](./TECHNICAL_ANALYSIS.md) — the engineering-facing version of this overview
- [Setup](./SETUP.md) — first install and client registration
- [Skills Overview](./SKILLS_OVERVIEW.md) — what the built-in skill library can do

Last verified: 2026-05-20
