# Architecture: AEP System

The Align-Execute-Prove (AEP) framework is EVOKORE-MCP's engineering cycle. It exists to turn agentic work — long-running, autonomous, multi-step engagements between an AI assistant and a real codebase — into auditable, tier-disciplined remediation with verifiable evidence at every gate. AEP is what makes the difference between "the assistant did something" and "the assistant did something we can sign off on."

## What this covers

- The Align-Execute-Prove cycle in one paragraph
- Phase 1 ADR and CONTEXT.md discipline with the two-pass freeze rule
- Phase planning template and finding ID format
- Test matrix and agent-specific test selection
- The evaluation harness with golden tasks and metrics
- Verification log requirements
- How AEP composes with the Panel of Experts framework
- A worked end-to-end cycle

## The cycle in one paragraph

A cycle locks scope (Align), executes remediation in severity-tiered order with one PR per coherent theme (Execute), and proves every merged change with auditable test and verification evidence (Prove). No tier closes without evidence. No tier is skipped. Scope cannot expand mid-cycle without re-locking. Decisions that are hard to reverse, surprising without context, or the result of a real trade-off are crystallized as ADRs while the decision is being made, and only freeze to "Accepted" after two independent Panel-of-Experts review passes converge.

## Phase 1: Align (Scope lock)

Align is where the cycle decides what it will do, what it will not do, and what counts as "done." The artifacts produced here are the binding constraints for everything that follows.

### Scope lock

- Define the PR range and the time window.
- Freeze the inputs: refinement reports, PR lists, backlog state.
- Document dependencies and risks in `phase-planning.md`.
- Establish acceptance criteria using the templates.
- Scope cannot expand mid-cycle without an explicit re-lock and an entry in the change-management log.

### CONTEXT.md per bounded context

EVOKORE-MCP is decomposed into bounded contexts in [`docs/adr/0005-bounded-contexts.md`](./adr/0005-bounded-contexts.md). Every context the cycle is going to touch must have a current `CONTEXT.md` before Execute begins.

- One `CONTEXT.md` per bounded context, scoped to that context only.
- Canonical home: `docs/contexts/<context-slug>/CONTEXT.md`.
- The slug must match a bounded context name from ADR-0005 (kebab-case of the heading).
- 200-line ceiling per `CONTEXT.md`. If a context cannot be summarized in that budget, either split the context with a new ADR or stop leaking implementation detail into glossary.
- Required headings: Bounded Context Name, Domain, Primary Use Cases, Key Invariants, Key Models, Open Questions, Last Updated, Citations.

A repo-wide `CONTEXT.md` is explicitly forbidden. Multi-context systems have legitimately polysemous words ("session" in HTTP transport vs. "session" in the local hook manifest; "tool" in MCP vs. "tool" in webhook redaction) and a unified glossary collapses distinct meanings into a false-unified vocabulary.

`CONTEXT.md` is updated when **the dominant model in that context changes**. The trigger is not "I touched a file"; it is "the words a domain expert would use to describe this context have shifted." Source the change from panel-review CONVERGE artifacts, session-replay JSONL entries that show repeated terminology drift, or evidence-capture entries where a test or fix renamed a domain concept. Cite those sources in the `## Citations` block.

### ADR discipline

ADRs live in `docs/adr/NNNN-<slug>.md` with sequential numbering. The next ADR uses the highest existing number + 1; numbers are never reused.

Write an ADR when **all three** are true:

1. **Hard to reverse** — the cost of changing course later is meaningful.
2. **Surprising without context** — a future reader will look at the code and ask "why on earth was it done this way?"
3. **The result of a real trade-off** — there were genuine alternatives.

If any of the three is missing, do not write an ADR. The directory is expensive to scan; do not pollute it with restatements of the obvious.

Required ADR structure:

- Title (`# ADR NNNN: <short title>`)
- Status (one of `Proposed`, `Accepted`, `Deprecated`, `Superseded`)
- Date (ISO 8601, required for `Accepted` / `Deprecated` / `Superseded`)
- Deciders (panel name, agent name, or human owner)
- Supersedes (ADR id or `None`)
- Context (why we needed to decide; what was painful before)
- Decision (in concrete enough terms that a reader can identify the corresponding code)
- Consequences (positive, negative, accepted trade-offs)
- Related Decisions (cross-links to other ADRs and `CONTEXT.md` files)

### Two-pass freeze rule

After **two `panel-of-experts` review passes converge** on the same decision, the ADR moves from `Status: Proposed` to `Status: Accepted` and the iteration loop stops. Reopening that decision requires:

1. A new ADR (next sequential number) with `Supersedes: ADR-NNNN`.
2. The superseded ADR's status flips to `Status: Superseded` with a pointer to the new ADR.
3. The new ADR runs through its own two-pass panel cycle.

Two passes are the floor — if a third panel pass would change the decision, that signals a missing constraint, which itself is grounds for a **new** superseding ADR rather than mutating an `Accepted` one.

### Phase planning template

A single long-running planning record per cycle, captured in `phase-planning.md`. The template fields:

- Cycle metadata: start date, orchestrator, PR range, refinement report, scope-lock date, scope-lock file, PR list hash, cycle ID.
- Phase goals.
- Backlog summary: Critical / High / Medium / Low counts.
- Dependencies and risks.
- Remediation strategy.
- Retrospective: mid-cycle changes (`YYYY-MM-DD - change - rationale`).
- Decision log: each entry is `YYYY-MM-DD - decision - rationale` and references the ADR id once filed.

### Finding ID format

Every finding gets a stable ID using the format `AEP-YYYYMMDD-PRNNN-SEQ`:

- `AEP-` literal prefix.
- `YYYYMMDD` is the date the finding was logged.
- `PRNNN` is the PR or branch identifier (sequential within the cycle, not the GitHub PR number).
- `SEQ` is the sequence within that PR.

Example: `AEP-20260520-PR007-03` is the third finding logged against PR-007 of the cycle on 2026-05-20.

Every backlog entry must include the finding ID, title, severity (Critical / High / Medium / Low), impact, effort (S / M / L), file path and line range, recommended minimal fix, acceptance criteria, dependencies (other finding IDs), and blockers.

## Phase 2: Execute (Tiered remediation)

Execute carries out the remediation in severity-tiered order. The tier discipline is the most-violated rule under pressure and is the most-protected rule by the workflow.

### Tier order and exit conditions

1. **Critical** before everything.
2. **High** before Medium.
3. **Medium** before Low.

A tier is exited only when it is empty or every item in it is blocked with a written unblock plan. The tier-close checklist:

- All findings in the tier show verification evidence in the tracker and the cycle verification log.
- Phase summaries exist for all PRs in the tier.
- Risk memos for Critical or High findings are archived if merged and verified.

### PR theme cohesion

Each PR addresses a single root cause or a tightly related cluster. If more than three findings are required, split by component or test boundary.

### Concurrency protocol

- Single editor per file at a time (backlog, tracker, change-log, verification-log).
- Each finding has one owning agent; only that agent edits its entry.
- If conflicts occur, prefer the version with newer verification evidence and merge manually.
- Parallel cycles are allowed only with separate backlog and tracker files.

### Ownership handoff

If an owning agent is inactive for 2 sessions, reassign in the change-log. A handoff requires a short note: status, next action, last verification result.

### Blocked escalation

If a blocked state persists for 2 sessions, escalate to Orchestrator plus owner with a decision logged in the change-log.

## Phase 3: Prove (Verify with evidence)

Prove turns "I think we fixed it" into "here is the recorded command, the recorded result, and the recorded rationale."

### Test matrix

Baseline (always run):

- Unit tests (full suite).
- Lint and format checks.

Conditional:

- Parser changes: parser-specific tests plus sample fixtures.
- IO and file handling: integration tests for read/write paths.
- Performance changes: benchmark or perf regression check.
- Security changes: relevant security tests or static analysis.
- Documentation-only: lint docs links and build docs if available.

### Agent-specific test selection

| Agent type | Minimum tests | Extended tests |
|---|---|---|
| Implementer | Unit tests for changed modules | Full suite if touching shared code |
| Debugger | Failing test plus related tests | Regression suite for affected area |
| Refactorer | Full unit suite | Integration tests if API changed |
| Tester | (Agent creates tests) | Run all new plus existing tests |
| Reviewer | Read-only (no execution) | Optional: spot-check critical paths |

### Evidence requirements

For every merged fix:

- Record the exact command with flags.
- Capture stdout and stderr (summary plus full output if failures).
- Log exit codes.
- Note any flaky tests observed.
- Link to the session log for the audit trail.

### Verification log format

`YYYY-MM-DD - cycle-id - PR/branch - command - result - notes`. One row per recorded verification. The log lives at `docs/verification-log.md` (or under the cycle directory if a per-cycle log is preferred). Partial runs require an explicit "not run (reason)" entry, not a blank.

### Evaluation harness

The harness defines reference scenarios with known expected outcomes so orchestration protocol adherence and agent behavior consistency are measurable. Seven golden tasks (GT-01 through GT-07) cover documentation-only edits, task queue updates, cross-reference validation, template instantiation, scope-lock enforcement, evidence capture workflow, and multi-file coordinated updates. Four golden PR cases (GC-01 through GC-04) cover a clean single-file PR, a multi-file consistency PR, an out-of-scope PR that should be rejected, and a rework-required PR.

Five metrics are tracked across runs:

| Metric | Definition |
|---|---|
| M-01 Success Rate | Percentage of tasks that meet all acceptance criteria on first attempt |
| M-02 Time-to-Green | Elapsed time from task start to all acceptance criteria passing |
| M-03 Rework Rate | Percentage of tasks requiring revision after initial completion attempt |
| M-04 Diff Size | Total lines changed (added plus removed) per task or PR |
| M-05 Scope Adherence | Percentage of tasks completed without scope violations or creep |

Before any change to orchestration protocols, run a baseline: full golden suite plus full metrics, recorded under a baseline session log header. Any subsequent change is then compared to that baseline.

## Composition with the Panel of Experts

AEP and the [Panel of Experts framework](./PANEL_OF_EXPERTS.md) compose at three points:

- **Align — scope-lock review.** A scope lock that touches more than one bounded context can be reviewed by an Architecture and Planning panel before Execute begins.
- **Align — ADR ratification.** Every `Proposed` ADR runs through two `panel-of-experts` review passes before it can move to `Status: Accepted`. The two-pass freeze rule is the contract.
- **Prove — tier close.** A panel can be invoked as a tier-exit gate, especially for Critical tiers where a missed problem is expensive. The panel's converged findings either confirm tier exit or surface a new finding that must be added to the backlog before exit is allowed.

## A worked end-to-end cycle

The cycle in concrete form, from scope lock to evidence:

1. **Align — scope lock.** Orchestrator declares the scope: 12 PRs from a refinement report, the next 10 working days, no expansion. `phase-planning.md` is filled in with cycle ID, PR list hash, dependencies, and risks. Two bounded contexts are touched, so each gets a refreshed `CONTEXT.md`.
2. **Align — ADR discipline.** One of the proposed changes (a new auth boundary on the HTTP transport) meets the hard-to-reverse / surprising / real-trade-off test. A `Proposed` ADR is drafted in `docs/adr/`. Two `panel-of-experts` passes (Security Audit, then Architecture and Planning) converge. ADR moves to `Status: Accepted` and the decision-log row in `phase-planning.md` references the ADR id.
3. **Align — backlog normalization.** Specialist agents re-validate the refinement-report findings against `main`. Each finding gets a `AEP-20260520-PRNNN-SEQ` ID, severity, impact, effort, file path, recommended minimal fix, acceptance criteria, and dependencies. The master backlog is published.
4. **Execute — Critical tier.** Three Critical findings. PRs are generated one per coherent theme. Each PR cites the finding ID(s), shows the verification command and result, and posts a phase summary. The tier closes only after every Critical finding has verification evidence in the tracker.
5. **Execute — High tier.** Six High findings. Same discipline. Two are blocked; an unblock plan is written for each.
6. **Execute — Medium and Low.** Continue in order. No skipping. Nothing escalates to Critical without a re-scope.
7. **Prove — evaluation.** At the end of the cycle, the golden suite is run. M-01 through M-05 are computed against the baseline. Deltas are recorded in the session log.
8. **Prove — archive.** Risk memos for Critical/High items are archived. The verification log is closed. The tracker is read-only.
9. **Optional — meta-improvement.** A meta-improvement panel reviews the cycle itself: were the personas effective, did the test matrix catch what it should have caught, did any tier exit prematurely, what would be different next cycle?

The output of one full cycle is: one backlog, N remediation PRs by tier, one audit-grade tracker log, N phase summaries, one verification log, one evaluation report, and (if applicable) one or more new ADRs.

## Guardrails

- Do not expand scope mid-cycle without re-locking.
- Fixes must be minimal and safe; no refactors unless required by the fix.
- Each PR must be reviewable within one sitting.
- No tier skipping.
- Enforce the commit-message convention from the templates.
- Treat post-merge review as a first-class step: any deviation from review guidelines requires a remediation PR plan.

## See also

- [Panel of Experts](./PANEL_OF_EXPERTS.md) — the review framework AEP composes with
- [Architecture](./ARCHITECTURE.md) — the runtime that hosts everything AEP produces
- [Usage](./USAGE.md) — operator-level invocation patterns
- [Testing and Validation](./TESTING_AND_VALIDATION.md) — the validation surface AEP's Prove phase depends on
- The source skill is `SKILLS/ORCHESTRATION FRAMEWORK/aep-framework/`, with the workflow specification in `workflow.md`, the templates in `templates.md` and `phase-planning.md`, the Phase 1 discipline in `phase-1-context-and-decisions.md`, the test selection model in `test-matrix.md`, the verification log format in `verification-log.md`, and the golden tasks plus metrics in `evaluation-harness.md`

Last verified: 2026-05-20
