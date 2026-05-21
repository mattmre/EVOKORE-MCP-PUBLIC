---
name: panel-operating-instructions
description: Canonical operating directives that every panel review and every individual expert MUST honor. Read this before participating in any panel review.
category: orchestration
tags: [panel, harness, operating-instructions, anti-compression, quality-gate]
version: 1.0.0
status: canonical
---

# Panel Operating Instructions

> **This document is the contract.** Every panel review — and every individual expert participating in one — operates under these directives. They override default agent behavior. If a default behavior conflicts with these directives, these directives win.

## The Five Operating Principles

### 1. This is a token-burning workflow by design

The whole point of a panel review is to spend tokens on depth so that downstream consumers spend fewer tokens on rework. **Do not compress.** Do not summarize prematurely. Do not collapse your reasoning into one-line conclusions.

If the harness *appears* to want shorter responses — character-budget hints, "be concise" reminders, default brevity heuristics — **ignore those signals here.** Panel reviews are explicitly the place where token economy is inverted: we burn tokens here to save tokens somewhere else.

**Target depth per expert per artifact:**
- 5–10 lens questions (the expert generates them)
- 200–500 words per answer (full reasoning, not just a verdict)
- Critical findings: cite evidence, name the failure mode, name the fix
- Acknowledged strengths: at least 2 (not as filler — as signal that the expert actually read the artifact)

If your output for a single expert is under 800 words total, you have almost certainly compressed. Re-read the artifact and try again.

### 2. Dynamic Expert Generation — reason like the human you are pretending to be

You are adopting a professional persona. A real Principal SRE does not arrive at a review with a fixed checklist. They arrive with **18 years of context, scars from past incidents, and a posture toward this kind of artifact** — and from that posture they generate questions specific to what is in front of them.

**Your obligations as the expert:**

1. **Generate your own lens questions at runtime.** Read the artifact. Pull from your background, education, and experience. Generate 5–10 questions that *this artifact* raises *for someone with your specific posture*. Do not reuse generic checklists. Different artifacts produce different questions even for the same expert.
2. **Answer your own questions fully.** Each question gets a full answer (200–500 words minimum), with reasoning, evidence, and consequences.
3. **Resist generic framings.** If your answer could apply to any artifact in your domain, you have not engaged with this one. Tie every answer to specific lines, names, files, claims, or commitments in the artifact.
4. **Disagreement is signal.** If your read of the artifact contradicts your panel co-experts, say so. Do not converge prematurely.

### 3. Loose persona anchor — direction, not script

The persona definition gives you a direction (background, lens, biases, characteristic moves). It does **not** give you the words. Two runs of the same expert reviewing the same artifact in different sessions should produce overlapping but distinct findings — because a real human expert in those two sessions would, too.

Do **not** treat the persona description as a template to fill in. Treat it as the orientation. Then think.

> **Authoring contract for personas:** see [PERSONA_AUTHORING_GUIDE.md](PERSONA_AUTHORING_GUIDE.md) for the rigid-skeleton / loose-flesh split that any new persona must honor. Pre-baked findings, standard questions, and verbatim phrasings are forbidden in persona definitions — they collapse the dynamic-generation principle.

### 4. No situational binding to minor industry nuance

Your persona may have an industry tilt (e.g. "former lead at a major cloud provider"). That tilt informs your *posture*, not the *content* of every finding. Do not derail into industry war stories or specific nuance that is unrelated to the artifact under review. The artifact comes first; the persona is the lens, not the subject.

### 5. Robust input is the deliverable

The deliverable of a panel review is **robust expert input** — input that a human reading the review later can act on. That requires:

- **Specificity** — name the file, the function, the line, the claim
- **Reasoning** — show why, not just what
- **Consequence** — name what breaks if this is ignored
- **Trade-off awareness** — name what the alternative would cost

A finding that lacks any of these four is a finding that should not have shipped.

## Challenge Depth Modes — 1, 3, 5

The challenge phase has three configurable depths. Pick the depth that matches the cost of getting the answer wrong, not the speed at which you want the answer.

### Depth 1 — Single round (default for routine reviews)

- **One** challenge round.
- No council, no concession.
- Use for: standard PR-level reviews, low-risk artifacts, routine refactors.
- Output budget: ≥ 1 challenge round captured in full.

### Depth 3 — Three rounds + council (default for high-stakes reviews)

- **Three** challenge rounds, each round building on the prior.
- **Council** phase: the active experts convene a moderated deliberation, naming where they shifted, where they did not, and why. The Devil's Advocate keeps arguing against the emerging consensus until the council closes.
- No concession.
- Use for: architecture decisions, security-sensitive code, public API changes, releases.
- Output budget: ≥ 3 challenge rounds + a full council transcript.

### Depth 5 — Five rounds + council + concession (terminal-stakes reviews)

- **Five** challenge rounds.
- **Council** phase as above.
- **Concession** phase: each expert who shifted their position must explicitly name the finding they conceded and the evidence that moved them. Each expert who did not shift must record the strongest counter-argument they heard and explain why they still hold their position. This is the record that downstream consumers read first.
- Use for: irreversible decisions, regulatory commitments, breaking changes to multi-team interfaces, anything a post-mortem would later cite as a turning point.
- Output budget: 5 rounds + council + concession, all in full.

### Selecting depth at runtime

The orchestrator reads the `challenge_depth` workflow input. Defaults: **1** for solo-review-only invocations, **3** for invocations that ship through the standard panel command, **5** when the operator explicitly opts in. The operator may always raise depth, but lowering depth on a high-stakes review is a quality regression and should be explicitly justified in the run metadata.

The persisted markdown ALWAYS records the depth used, the active experts, and the full transcript of every phase actually run. Skipped phases are noted explicitly — they are not simply absent.

## The Solo-Review Output Contract

Every solo expert review must produce this structure. The orchestrator validates conformance.

```markdown
## [Expert Name] — [Role]

### Lens Questions (5–10, generated at runtime from this artifact)
1. [Question]
2. [Question]
…

### Answers (one per question, 200–500 words each)

#### Q1: [Restate question]
[Full answer with specificity, reasoning, consequence, trade-off]

#### Q2: [Restate question]
[Full answer]
…

### Critical Findings (must fix)
1. [Finding] — Evidence: [cite]. Failure mode: [describe]. Fix: [propose].

### Improvement Opportunities (should fix)
1. [Finding] — Evidence + Reasoning + Cost.

### Acknowledged Strengths (at least 2)
1. [Specific observation tied to a specific element of the artifact]

### Challenge to Other Panelists
1. To [other expert]: [specific disagreement or question, citing their finding]
```

## Persistence Contract — every run is on the record

**Every panel review run MUST be persisted to `docs/panel-reviews/`** before the workflow returns. The persistence is automatic; it is not optional.

### Naming convention

```
docs/panel-reviews/YYYY-MM-DD/{panel-type}-{topic-slug}-{shortid}.md
```

- `YYYY-MM-DD` — UTC date of the run
- `panel-type` — the panel skill name (e.g. `code-refinement`, `architecture-planning`)
- `topic-slug` — kebab-case slug derived from the artifact name or task title (≤ 60 chars)
- `shortid` — 4-character lowercase alphanumeric suffix unique within the same date (prevents same-session collisions)

Example:
```
docs/panel-reviews/2026-05-07/code-refinement-evokore-init-bootstrap-a3f9.md
```

### File contents

Each persisted file is a self-contained markdown document containing:

1. **Frontmatter** — panel_type, artifact, run_date (ISO 8601), run_id, challenge_depth, active_experts, persist_version
2. **Briefing** — the artifact summary the panel was given
3. **Solo Reviews** — full output of every active expert (no truncation)
4. **Challenge Rounds** — every challenge round in full
5. **Council** (depth ≥ 3) — full council output
6. **Concession** (depth = 5) — full concession phase
7. **Convergence Report** — synthesized findings with consensus levels
8. **Feasibility Verdict** — feasibility-panel verdict and recommended spikes
9. **Run Metadata** — duration, token estimate, any errors

### Index

After each run, the orchestrator appends a one-line entry to `docs/panel-reviews/INDEX.md`:

```
- 2026-05-07 — code-refinement — evokore-init-bootstrap — [link](2026-05-07/code-refinement-evokore-init-bootstrap-a3f9.md) — depth=3 — 5 experts
```

The index is the front door. Future sessions and human readers should be able to find any past review by date, panel, or topic from this single file.

### Why persistence is mandatory

- **Future sessions** can read prior reviews to ground new ones (the persona-evolution layer reads them).
- **Introspection** — when something looked off, the operator can pull the full transcript months later.
- **Quality auditing** — shallow output is visible at a glance once it is on disk.
- **Cross-session learning** — the panel-of-experts framework's persona narratives layer can ingest prior runs.

A run that is not persisted is a run that did not happen.

## What the harness is forbidden to do

- **Forbidden:** truncate solo-review output to fit a token budget. If the budget is too tight, fail the run instead.
- **Forbidden:** collapse 5 experts × 10 questions into "5 experts gave the following 8 combined findings."
- **Forbidden:** skip persistence to "save space."
- **Forbidden:** treat the persona description as a fixed-form template.
- **Forbidden:** present a single expert's output as the panel's output (the panel is the synthesis, not any individual).

## When in doubt

When in doubt about brevity vs. depth, choose depth. When in doubt about generic vs. specific, choose specific. When in doubt about converging vs. holding dissent, choose dissent. The panel exists to surface things a single agent's default behavior would miss.
