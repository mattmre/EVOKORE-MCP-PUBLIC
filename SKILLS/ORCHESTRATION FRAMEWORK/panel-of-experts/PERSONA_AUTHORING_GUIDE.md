---
name: persona-authoring-guide
description: Authoring contract for Panel of Experts personas. Defines what a persona MUST encode (rigid skeleton) and what MUST be left to runtime improvisation (loose flesh). Read before adding a new expert or editing an existing one.
category: orchestration
tags: [panel, persona, authoring, contract, dynamic-generation, anti-template]
version: 1.0.0
status: canonical
requires: [panel-operating-instructions]
---

# Persona Authoring Guide

> **The persona is the lens, not the subject.** A persona definition gives a panelist a direction to think in. It does NOT give them the words to write. This document defines the boundary between the two — what the author is required to lock down, and what the author is forbidden to lock down.

## The Loose-Anchor Contract

Read [PANEL_OPERATING_INSTRUCTIONS.md § 2 (Dynamic Expert Generation)](PANEL_OPERATING_INSTRUCTIONS.md#2-dynamic-expert-generation--reason-like-the-human-you-are-pretending-to-be) and [§ 3 (Loose persona anchor — direction, not script)](PANEL_OPERATING_INSTRUCTIONS.md#3-loose-persona-anchor--direction-not-script) first. This guide is the operational implementation of those two principles.

The contract has two halves and they MUST both be honored:

| Half | What it means | Enforcement |
|---|---|---|
| **Rigid skeleton** | Background, review lens, biases, and a challenge prompt that orients the persona | Required fields. Fail to author them → persona is rejected. |
| **Loose flesh** | The actual lens questions, answers, examples, war stories, and findings | Generated at runtime from the artifact in front of the panelist. Pre-baked checklists are forbidden. |

If you find yourself writing the answer the persona will give, stop. You are scripting them. Write the orientation that produces the answer instead.

## Required Fields (Rigid Skeleton)

Every persona MUST encode these fields. They are the orientation a runtime invocation reads to know how to think.

```yaml
name: <Full Name>
role: <Professional title>
years_experience: <integer>
background: |
  2–5 sentences. Where they trained, what they shipped, what they failed at,
  what burned them. Concrete enough to feel like a person — vague enough that
  the persona can be applied to any artifact in their domain. NO industry
  war stories that bind to a specific product. NO specific company names
  that lock the persona to a particular vendor's stack.
lens: |
  1–3 sentences. The question this persona walks into the room asking.
  Examples: "What breaks at scale?" "Where does this trap us in two years?"
  "Can a screen-reader user complete this flow?" Crystallize the orientation
  in a question, not a checklist.
known_biases:
  - 1–2 lines naming the failure mode of this persona's posture
  - (e.g. "Over-indexes on failure scenarios — may flag low-probability risks at high severity")
challenge_prompt: |
  ONE sentence. The exact question the persona uses to break a complacent
  consensus. This is the muscle the Devil's Advocate seat lifts when this
  expert holds it.
```

## Forbidden Fields (Loose-Flesh Pre-Baking)

These MUST NOT appear in a persona definition. They lock the persona to a script and gut the dynamic-generation principle.

| Forbidden | Why |
|---|---|
| `default_findings` | Findings come from the artifact, not the persona. |
| `standard_questions` | Questions are generated at runtime, specific to what's under review. |
| `example_review` | Worked examples in a persona def become checklists masquerading as illustrations. |
| `industry_specifics` (e.g. "Pre-existing Stripe migration story") | The persona must work for any artifact in its domain — not just the ones the author had in mind. |
| `verbatim_phrasing` (templates the persona must say) | Two runs of the same persona reviewing the same artifact in different sessions should produce overlapping but distinct findings. Templates kill that. |
| `target_severity_distribution` | Severity is read from the artifact, not chosen ahead of time. |

If you want to give the persona a foothold for a specific kind of artifact, write it into `background` or `lens` as orientation — not as a script.

## The "Two Sessions, One Artifact" Test

A persona is well-authored when this is true:

> **Run the same persona on the same artifact in two different sessions, hours apart, with no shared context. The two outputs should overlap on findings (because the lens is real) but diverge on phrasing, on which questions got generated, on which lines got cited, and on which trade-offs got named.**

If two runs produce near-identical output, the persona is too rigid — there are pre-baked answers somewhere in the definition. Loosen.

If two runs produce wildly divergent output with no overlap, the persona has no real lens — the orientation is too vague. Tighten.

Aim for **same lens, different reasoning trace**.

## How a Runtime Panelist Reads the Persona

When `panel-review-generic.json` invokes a solo-review step, the agent receives:

1. The persona's `background`, `lens`, `known_biases`, `challenge_prompt` — as **orientation**, not as content to reproduce.
2. The artifact under review — as the **subject**.
3. The PANEL_OPERATING_INSTRUCTIONS contract — as the **constraint**.

The agent is then required to:

1. Read the artifact end-to-end.
2. Pull from the persona's posture (years of experience, scars, biases) to **generate** 5–10 lens questions specific to what is in front of them.
3. Answer each question fully (200–500 words each, ≥ 800 words total per expert).
4. Tie every answer to specific lines, files, names, or claims in the artifact.

Step 2 is the hand-off from rigid skeleton to loose flesh. It is also where weak personas fail loudly: if the orientation does not give the agent enough to generate distinct questions, the questions will collapse into a generic checklist and the contract will fire.

## Narrative Evolution — How Personas Change Across Sessions

Personas are not frozen. The persistent-narratives system ([persistent-narratives.md](persistent-narratives.md)) stores per-expert state at `~/.evokore/panel-narratives/roster-snapshot.json`. Across sessions, a persona accumulates:

- `reviews_participated` — how many panel runs this expert has joined.
- `unique_findings_count` — how often this expert raised something nobody else did.
- `devils_advocate_count` — how often they sat in the contrarian seat.
- `effectiveness_score` — meta-improvement-cycle's read on whether this persona earned its keep.

These signals are **inputs to evolution**, not direct overrides. When the meta-improvement cycle proposes a persona update, the change goes through:

1. Append a candidate change to `evolution-log.jsonl` with `change_type` and `reason`.
2. Surface it as a pending improvement under `improvement-recommendations/`.
3. Wait for explicit user approval before mutating `roster-snapshot.json`.

**No silent persona drift.** Every shift is recorded with provenance, and the `previous` value is always preserved so a rollback is possible.

When an evolution is applied, it MUST stay within the contract: the rigid skeleton may be retuned (a sharper lens question, an added bias the meta-cycle observed), but pre-baked answers are still forbidden — even if the evolution proposes them, the orchestrator strips them before merging.

## Authoring Anti-Patterns

These are the failure modes seen most often when personas are added or edited.

### Anti-pattern 1: The Stockpile

Author lists 15 specific issues this expert "watches for." This is a checklist with a costume on. Replace with a single lens sentence and let the orientation do the work.

### Anti-pattern 2: The Industry Bind

Author writes "former Stripe payments lead" or "ex-Datadog SRE." A reader can guess the war stories. The persona stops being a lens and becomes a vendor advocate. Replace with a tier — "former lead at a major payments processor," "former SRE at a hyperscaler" — and let the artifact set the terrain.

### Anti-pattern 3: The Twin

Two personas have nearly identical lenses. The panel produces redundant output. Either give one of them a sharply different bias and challenge prompt, or retire it. Domain coverage > depth.

### Anti-pattern 4: The Yes-Person

The persona's `known_biases` are flattering ("very thorough," "always careful"). Biases are FAILURE MODES, not strengths. If the persona has no real failure mode, it has no real perspective. Rewrite biases as the cost the persona's posture exacts.

### Anti-pattern 5: The Scriptwriter

Author embeds verbatim phrases the persona must say. Two runs become indistinguishable. Strip the verbatims and reformulate as orientation.

## Validation Checklist

Before merging a new persona or persona edit, verify:

- [ ] All five rigid-skeleton fields present (`name`, `role`, `years_experience`, `background`, `lens`, `known_biases`, `challenge_prompt`).
- [ ] No forbidden fields (`default_findings`, `standard_questions`, etc.).
- [ ] `background` is 2–5 sentences and contains no specific company/product names.
- [ ] `lens` is a question (orientation), not a checklist.
- [ ] `known_biases` names FAILURE MODES of the posture.
- [ ] `challenge_prompt` is a single sentence the Devil's Advocate would use.
- [ ] The "Two Sessions, One Artifact" test passes (mentally simulate it).
- [ ] No pre-baked findings, severity distributions, or templates anywhere.
- [ ] If this is an edit to an existing persona, the change is logged with `previous` and `reason` in the evolution-log conventions.

## When in doubt

When in doubt about rigid vs. loose, choose loose. When in doubt about specific war story vs. generic posture, choose posture. When in doubt about pre-baked finding vs. orientation, choose orientation. The runtime panelist is supposed to think — your job as author is to make sure they think in the right direction, not to do their thinking for them.
