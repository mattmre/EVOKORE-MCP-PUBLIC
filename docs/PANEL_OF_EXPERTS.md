# Panel of Experts

The Panel of Experts framework is the multi-persona review system that ships inside EVOKORE-MCP's orchestration framework. It exists for one reason: generic analysis applies generic heuristics, but a Senior Reliability Engineer who has been paged at 3am for cascading failures catches different problems than an Enterprise Architect who has watched three failed microservice migrations. Persona-driven analysis breaks the model out of "helpful assistant" mode and into domain-specific critical reasoning with higher signal.

## What this covers

- The problem the framework solves
- The 10-step panel cycle
- Challenge depths 1, 3, and 5
- The expert persona schema
- The persistence contract
- Two worked examples (one code, one non-code)
- How to invoke a panel

## The problem

Most "AI review" workflows degrade into a single perspective with a single set of biases. A code review by one assistant looks like every other code review by that assistant. The signal-to-noise ratio is low because the lens never changes. The Panel of Experts framework solves this by:

1. Assembling four or more distinct expert personas, each with a defined background, review lens, known biases, and challenge prompt.
2. Forcing each expert to review the artifact independently, then challenge each other's findings.
3. Capturing the dissent — minority opinions that did not make consensus are often the most valuable insights.
4. Sending the converged top recommendations through a Feasibility Panel as a final gate.
5. Persisting the run as an auditable markdown artifact, indexed and dated.

The output is a review with the discipline of a real expert panel, not a chat reply.

## The 10-step cycle

Every panel review runs the same sequence. The steps marked with a footnote run only at higher challenge depths.

| Step | Name | What happens |
|---|---|---|
| 1 | **CONVENE** | Select panel composition for the artifact's domain. Minimum 4 experts. At least one contrarian. Domain coverage over depth. |
| 2 | **BRIEF** | Present the artifact (code, plan, document, decision) and the review goal to every expert. |
| 3 | **SOLO** | Each expert reviews independently through their lens. Generates 5–10 lens-specific questions at runtime; no fixed checklists. Targets ≥800 words per expert. |
| 4 | **CHALLENGE** | Experts challenge each other's findings. 1, 3, or 5 rounds depending on configured depth. |
| 5 | **COUNCIL** ¹ | Moderated deliberation where experts name where they shifted, where they did not, and why. |
| 6 | **CONCESSION** ² | Explicit shifted-position / held-line ledger. Every shifted position and every held-line position is recorded. |
| 7 | **CONVERGE** | Panel synthesizes into prioritized findings: Critical → High → Medium → Low, scored by impact, likelihood, effort, and expert consensus. Dissent is captured separately. |
| 8 | **FEASIBILITY** | Top recommendations go to the Feasibility Panel as the final gate on actionability. |
| 9 | **DELIVER** | Final report with actionable, prioritized remediation. |
| 10 | **PERSIST** | Auto-write to `docs/panel-reviews/YYYY-MM-DD/{panel-type}-{topic-slug}-{shortid}.md` and index in `docs/panel-reviews/INDEX.md`. |

¹ COUNCIL runs only at depth ≥ 3.

² CONCESSION runs only at depth = 5.

## Challenge depths

Challenge depth controls how many rounds of expert-to-expert challenge run, whether the moderated council phase fires, and whether the explicit shifted-position ledger is required. The depth is recorded in the persisted markdown frontmatter so a reviewer can tell at a glance how rigorous a given run was.

| Depth | Challenge rounds | Council | Concession ledger | Use for |
|---|---|---|---|---|
| **1** | 1 round | No | No | Routine reviews where the cost of a wrong answer is modest. PR review, refactoring sanity-check, a marketing draft. Default. |
| **3** | 3 rounds | Yes | No | High-stakes reviews where you cannot afford to miss a serious problem. Architecture decisions, security-sensitive code, pre-launch product gates. |
| **5** | 5 rounds | Yes | Yes | Terminal-stakes reviews where the wrong answer is unrecoverable. Pre-acquisition diligence, regulator-facing artifacts, irreversible architectural commitments, crisis response. |

The right depth is a function of the cost of getting the answer wrong, not the speed at which you want the answer. Default to depth 1; promote to 3 or 5 when the artifact warrants it.

## Expert persona schema

Each expert is defined with a stable schema. The shape is rigid; the content is loose, because the persona is the lens, not the script. Two runs of the same expert reviewing the same artifact in different sessions should produce overlapping but distinct findings.

```yaml
name: Dr. Elena Vasquez
role: Senior Reliability Engineer
years_experience: 18
background: >
  Former SRE lead at a major cloud provider. Has managed incident response
  for services handling 2M+ RPS. Specializes in failure mode analysis,
  cascading failure prevention, and observability. Got burned by "it works
  on my machine" deployments early in career — now obsessive about
  reproducibility.
review_lens: >
  What breaks at scale? What fails silently? Where are the implicit
  assumptions about reliability? What happens when this component is
  down for 30 minutes?
known_biases:
  - Over-indexes on failure scenarios (may flag theoretical risks that are low probability)
  - Prefers explicit error handling over "let it crash" philosophies
challenge_prompt: >
  "Show me the failure mode analysis. What's the blast radius when
  this goes wrong at 3am?"
```

Forbidden fields (these would pre-bake the review and defeat the framework):

- `default_findings`
- `standard_questions`
- `example_review`
- `industry_specifics`
- `verbatim_phrasing`
- `target_severity_distribution`

The "Two Sessions, One Artifact" test is the smell-check before merging a persona: if running the same persona on the same artifact in two different sessions produces identical findings, the persona is too scripted.

## Persistence contract

Every panel run is auto-persisted. Persistence is not optional.

- **Path:** `docs/panel-reviews/YYYY-MM-DD/{panel-type}-{topic-slug}-{shortid}.md`
- **Index:** `docs/panel-reviews/INDEX.md` (one row per persisted run)
- **Frontmatter:** records the panel composition, challenge depth, artifact under review, and timestamp
- **Body:** the full per-expert solo findings, the challenge rounds, the council and concession ledgers (if depth ≥ 3 / = 5), the converged prioritized findings, the dissent, and the feasibility result

A panel run that is not persisted is a run that did not happen. If persistence fails, the run is treated as failed and is rerun.

## Available panels

The framework ships with a wide library of pre-defined panels. They cluster into four bands:

### Domain panels (engineering and product)

Code Refinement, Repo Ingestion, Reverse Engineering, Architecture and Planning, Security Audit, Performance and Scale, Developer Experience, Wiring and UI, Testing and Quality, Documentation, Presentation, eDiscovery, Data Engineering and ML, Database Design and Migration, Infrastructure and Cloud, Incident and Post-Mortem, API Versioning and Breaking Changes, Dependency and Supply Chain, Observability and Monitoring, Onboarding and Knowledge Transfer, DevOps and Deployment, Product Requirements, Design-an-Interface.

### Cross-cutting panels

Accessibility and Inclusive Design, Internationalization and Localization, Security Threat Modeling (architecture-level, distinct from code-level Security Audit), Privacy and Data Protection, Licensing and OSS Compliance, Cost Optimization, UX Research and Usability.

### Business operations panels

Sales Pipeline Management, Customer Success and Retention, Pricing and Packaging Strategy, Customer Support Operations, Marketing and Demand Generation, Brand Positioning and Messaging, Growth and Experimentation, Financial Planning and Analysis, Accounting and Controls, Procurement and Vendor Management, Talent Acquisition and Recruiting, Compensation and Benefits, People Operations and Culture, Performance Management, Contracts and Commercial Law, Regulatory Compliance, Mergers and Acquisitions, Fundraising and Investor Relations, Supply Chain and Logistics, Crisis Communications.

### Content and media panels

News and Media Content, Legal Technology Content, Business and Product Strategy, SEO and Content Marketing.

### Gate and meta panels

Feasibility Research (the final gate on every panel run), Meta-Improvement (optional post-cycle quality review of the panel itself).

## Worked example 1: code (Code Refinement panel)

**Artifact under review:** A new `SessionIsolation.ts` module that provides per-connection session state for the HTTP transport. Three hundred lines, two new classes, one new test file.

**Step 1 — CONVENE.** The Code Refinement panel is selected. Composition: a Senior Reliability Engineer (failure modes), a Performance Architect (hot paths, allocation), a Security Engineer (auth boundary, session hijack), and a Code-Quality Reviewer (deep modules, leaky seams, naming).

**Step 2 — BRIEF.** The four experts receive the file plus the PR description and the relevant ADR. They are told the goal is "merge readiness."

**Step 3 — SOLO.** Each expert produces ≥800 words. The Reliability Engineer asks what happens if `loadSession` returns a partial JSON file from a crashed prior write, and traces three different code paths that would silently corrupt session state. The Performance Architect benchmarks the per-request lookup and flags an O(n) scan across an unbounded session map. The Security Engineer notices that the session ID is derived from a request header without rate-limiting and constructs an enumeration attack. The Code-Quality Reviewer points out that the public surface is six methods deep when three would suffice, and names which two methods leak implementation detail into the API.

**Step 4 — CHALLENGE (1 round, because depth 1 was selected).** The Security Engineer challenges the Performance Architect: the proposed bounded map needs an eviction policy, and naive LRU here creates a session-loss DoS surface. The Code-Quality Reviewer challenges the Reliability Engineer: the partial-write case is a property of the file format, not the module, and the right fix is upstream in the serializer.

**Step 5 — COUNCIL.** Skipped (depth 1).

**Step 6 — CONCESSION.** Skipped (depth 1).

**Step 7 — CONVERGE.** Critical: rate-limit the session-id derivation (Security). High: replace the unbounded map with a bounded LRU plus a sliding-TTL eviction policy (Performance + Security agreement). Medium: collapse the public surface from six methods to three (Code Quality). Low: add a comment to the loader about the partial-write upstream concern (Reliability, partial concession).

**Step 8 — FEASIBILITY.** The Feasibility Panel rates the Critical fix as one-hour effort and reversible; the High fix as two-day effort with one risk area in the TTL semantics; the Medium fix as one-day effort.

**Step 9 — DELIVER.** Report names the four findings in order with the recommended remediation, the dissent (Reliability's partial-write concern, captured but not actioned in this PR), and the feasibility ratings.

**Step 10 — PERSIST.** The full review lands at `docs/panel-reviews/2026-05-20/code-refinement-sessionisolation-a1b2c3.md` and is indexed.

## Worked example 2: non-code (Pricing and Packaging Strategy panel)

**Artifact under review:** A draft pricing tier proposal for a SaaS product, including the proposed feature gates per tier, the price points, and the discount policy.

**Step 1 — CONVENE.** The Pricing and Packaging Strategy panel is selected. Composition: a Pricing Strategist (twenty years across SaaS pricing models), a CFO Persona (margin discipline and cohort economics), a Customer Success Lead (retention impact of feature gating), and a Sales Pipeline Manager (deal-cycle impact and discounting reality). Challenge depth is set to 3 because pricing changes are expensive to reverse.

**Step 2 — BRIEF.** All four experts receive the proposal, the prior-year ARPU by tier, and the renewal cohort data.

**Step 3 — SOLO.** ≥800 words each. The Pricing Strategist flags that the feature gates create a "starter tier trap" where users cannot test the value of the mid tier without committing. The CFO Persona models the proposed discount policy under three churn scenarios and finds the bottom-tier discount destroys gross margin in two of three. The Customer Success Lead names two features in the gating that are load-bearing for retention and warns that gating them will accelerate churn in the low-ARPU segment. The Sales Pipeline Manager points out that the proposed mid-tier price-point sits on top of a known psychological cliff and predicts the mid-tier deal cycle stretches by 30 percent.

**Step 4 — CHALLENGE (3 rounds, because depth 3 was selected).** Round 1: CFO challenges Customer Success's churn claim with the actual retention data; Customer Success cites two cohort breakouts the CFO missed. Round 2: Pricing Strategist challenges Sales Pipeline Manager's price-cliff claim, asks for the deal-cycle data behind it; Sales Pipeline Manager produces the prior-year median cycle by tier. Round 3: All four challenge the proposed discount policy from their own angle.

**Step 5 — COUNCIL.** Moderated. Each expert names where they shifted and where they held. CFO shifts on two of the gated features (acknowledges the retention impact) but holds on the discount policy ceiling. Customer Success holds on the gating recommendation. Pricing Strategist shifts on the mid-tier price point (moves it under the cliff) but holds on the starter-tier-trap concern. Sales Pipeline Manager shifts on the deal-cycle prediction (revises down from 30 percent to 18 percent given the new price point).

**Step 6 — CONCESSION.** Skipped (depth 3).

**Step 7 — CONVERGE.** Critical: redesign the starter-tier so the mid-tier value is discoverable without commitment. High: move the mid-tier price under the psychological cliff identified by Sales. High: remove the gating on the two load-bearing retention features named by Customer Success. Medium: tighten the discount policy ceiling per the CFO's model. Dissent captured: the CFO's preferred discount policy is more restrictive than the converged recommendation.

**Step 8 — FEASIBILITY.** Feasibility Panel rates the starter-tier redesign as a six-week implementation with marketing dependencies; the price-point change as a one-week change but with a one-quarter renewal-letter cycle; the gating change as immediate; the discount policy as a sales-ops process change of two weeks.

**Step 9 — DELIVER.** Report names the four findings in priority order with timelines and the captured CFO dissent.

**Step 10 — PERSIST.** The review lands at `docs/panel-reviews/2026-05-20/pricing-packaging-strategy-tier-proposal-d4e5f6.md` and is indexed.

In both worked examples the panel produced findings that a single-perspective review would have missed, and the persistence contract makes the rationale auditable later.

## How to invoke a panel

### Via the orch-panel command

```
orch-panel code src/SessionIsolation.ts
orch-panel security --quick src/auth/*.ts
orch-panel --cascade arch,code,security plan.md
orch-panel pricing-packaging-strategy docs/pricing-proposal.md
orch-panel presentation --mode extraction plan.md
```

### Via direct natural language

```
Invoke the Code Refinement panel to review src/SessionIsolation.ts.
Use the Panel of Experts framework — full 10-step cycle.
Challenge depth 3.
```

### With optional meta-improvement

```
Run a Code Refinement Panel on src/auth/*.
After the panel cycle completes, run the meta-improvement cycle
to evaluate expert effectiveness and suggest persona updates.
```

`resolve_workflow` finds the framework via the aliases `expert-panel`, `panel-review`, `expert-review`, `panel`, and `experts`. For a multi-panel cascade (for example, Architecture → Code → Security with a unified Feasibility Panel at the end), use `--cascade` with the panels in dependency order.

## See also

- [Architecture: AEP System](./ARCH_AEP_SYSTEM.md) — the engineering cycle that often invokes panels at scope-lock and tier-close gates
- [Usage](./USAGE.md) — day-to-day operation including the orchestration commands
- [Skills Overview](./SKILLS_OVERVIEW.md) — broader skill library context
- The source skill is `SKILLS/ORCHESTRATION FRAMEWORK/panel-of-experts/SKILL.md`, with operating instructions in the adjacent `PANEL_OPERATING_INSTRUCTIONS.md` and persona authoring in `PERSONA_AUTHORING_GUIDE.md`

Last verified: 2026-05-20
