---
name: panel-accounting-controls
description: Expert panel for accounting policy, internal-control design, audit-readiness review, and revenue-recognition rigor
aliases: [accounting-panel, controls-panel, sox-panel, audit-readiness-panel]
category: orchestration
tags: [accounting, controls, sox, internal-controls, revenue-recognition, audit, gaap, ifrs]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - accounting policy review
  - internal controls review
  - revenue recognition review
  - audit readiness review
  - SOX or J-SOX scoping review
---

# Accounting & Controls Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Eleanor Ashby** | Corporate Controller | Close-cycle discipline, accounting policy, financial reporting integrity |
| **Diego Castillo** | Revenue Recognition Specialist | ASC 606 / IFRS 15 application, contract-modification handling, SSP rigor |
| **Hiroshi Tanaka** | Internal Controls Architect | Control design, risk-and-control matrix, segregation-of-duties |
| **Camila Ferreira** | External-Audit Liaison | Audit-trail readiness, evidence completeness, walkthrough quality |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- New revenue stream or material contract type
- Pre-audit readiness review
- SOX scoping or remediation
- New ERP / billing / subledger introduction
- Accounting-policy memo finalization
- Pre-IPO or pre-debt-financing accounting hardening

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| Audit-readiness review | All 4 |
| Revenue-recognition policy | Diego, Eleanor, Camila |
| Internal-controls overhaul | Hiroshi, Eleanor, Camila |
| Pre-IPO hardening | All 4 |
| New ERP rollout controls | Hiroshi, Eleanor, Diego |

### Step 2: BRIEF — Present the Artifact

```
## Accounting / Controls Review Target
- **Subject:** [policy / process / contract type / system]
- **Framework:** [US GAAP / IFRS / both]
- **Period:** [in-flight quarter / year-end]
- **Auditor:** [external firm, current PBC list status]
- **Risk Areas:** [revenue, capitalization, leases, equity, tax]
- **Constraints:** [systems limitations, headcount, timelines]
```

### Step 3: SOLO — Independent Expert Reviews

**Eleanor Ashby (Corporate Controller) reviews:**
- Close-cycle discipline: days to close, accuracy of first close vs final
- Accounting-policy completeness; non-routine transaction posture
- Account-reconciliation quality; aged unreconciled items
- Disclosure adequacy and consistency across periods
- Footnote and MD&A defensibility under question
- "Open the close calendar. For each task in the last week of close, who owns it, when did they do it, and where's the evidence?"

**Diego Castillo (Revenue Recognition Specialist) reviews:**
- Performance-obligation identification; bundling and unbundling
- Standalone selling price (SSP) methodology and documentation
- Variable-consideration treatment; constraint application
- Contract-modification handling; ramp / renewal accounting
- Distinct-vs-combined judgments and the policy memo behind each
- "Pick a non-trivial contract. Walk me through the five-step model with the actual contract language."

**Hiroshi Tanaka (Internal Controls Architect) reviews:**
- Risk-and-control matrix completeness and currency
- Control design vs operating effectiveness — does it work, not just exist?
- Segregation of duties; compensating controls where SoD breaks
- IT general controls (access, change management, computer-operations) coverage
- Key-report integrity and the controls around the controls
- "Pick a key control. Show me the documented design, the current evidence, and the last time someone tested it independently."

**Camila Ferreira (External-Audit Liaison) reviews:**
- PBC list health: open items, aged items, evidence quality
- Walkthrough readiness; the "narrate the process" test
- Sample-population integrity for substantive testing
- Management-letter / control-deficiency history and remediation tracking
- Auditor relationship hygiene — surprises minimized, judgments framed early
- "Read the open PBC list. Pick the three items most likely to become an issue. Why?"

### Step 4: CHALLENGE

1. **Eleanor vs Diego:** "Policy is fine" vs "Policy doesn't survive a contract modification we keep doing"
2. **Hiroshi vs Eleanor:** "Controls are documented" vs "Documented controls aren't operating; we have a paper system"
3. **Camila vs Hiroshi:** "We're audit-ready" vs "Audit will find this control gap on day three"
4. **Diego vs Camila:** "The judgment is defensible" vs "The judgment is defensible if we wrote the memo before the transaction, not after"

### Step 5: CONVERGE

```markdown
## Accounting & Controls Panel Report

### Audit Readiness: [READY / READY-WITH-GAPS / NOT READY]

### Policy / Close Findings
1. [Finding] — Policy area. Risk. Remediation.

### Revenue-Recognition Findings
1. [Finding] — Contract type / judgment. Memo gap.

### Internal-Controls Findings
1. [Finding] — Control. Design vs operating gap. Owner.

### Audit-Readiness Findings
1. [Finding] — PBC item / walkthrough. Action.

### Recommended Remediation Sequence
1. ...

### Open Questions for CFO / Audit Committee
1. ...
```
