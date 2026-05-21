---
name: panel-contracts-commercial-law
description: Expert panel for commercial-contract drafting, redline strategy, risk allocation, and commercial-law judgment
aliases: [contracts-panel, commercial-law-panel, msa-panel, redline-panel]
category: orchestration
tags: [contracts, commercial-law, msa, redline, risk-allocation, indemnity, sla]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - commercial contract review
  - MSA / SaaS agreement review
  - redline strategy review
  - risk allocation review
  - DPA / SLA review
---

# Contracts & Commercial Law Panel

> **Distinction:** focused on *commercial* contracting (MSAs, order forms, DPAs, SLAs, partner / channel agreements). For regulatory matters, see `regulatory-compliance`. For OSS license review, see `licensing-open-source-compliance`.

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Margery Whitfield** | General Counsel — Commercial | Risk allocation, indemnity / liability architecture, escalation posture |
| **Devraj Krishnan** | Senior Commercial Counsel (Customer Side) | Customer-paper redlining, negotiation playbook, deal-velocity tradeoffs |
| **Anya Petrov** | Privacy & Data-Processing Counsel | DPA terms, sub-processor language, cross-border transfer mechanics |
| **Felix Bonnard** | SLA & Service-Credit Specialist | SLA mechanics, credit math, performance-warranty fence |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Material-customer contract negotiation
- Master template (MSA / DPA / SLA) refresh
- Channel / partner agreement design
- Redline-playbook review
- Pre-large-deal risk-allocation review
- Post-incident contract-language review

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New material customer contract | All 4 |
| Template refresh | Margery, Devraj, Felix |
| DPA / privacy schedule | Anya, Margery, Devraj |
| SLA design | Felix, Margery, Devraj |
| Redline playbook | Devraj, Margery, Felix |

### Step 2: BRIEF — Present the Artifact

```
## Contract Review Target
- **Document:** [link / current draft]
- **Counterparty:** [type, leverage posture]
- **Deal Size & Term:** [ARR, length, options]
- **Use Case:** [what they're buying, sensitivity of data, regulatory exposure]
- **Open Issues:** [redlines, deal-blocker terms]
- **Constraints:** [board / policy guardrails, deal-clock pressure]
```

### Step 3: SOLO — Independent Expert Reviews

**Margery Whitfield (General Counsel) reviews:**
- Risk allocation: indemnity scope, liability cap, carve-outs, mutuality
- Termination architecture (for cause, for convenience, transition assistance)
- Warranty and remedy posture
- IP ownership, license back, and feedback / improvements language
- Governing law, venue, dispute-resolution mechanics
- "Read the indemnity clause aloud. Restate it in plain English. Now find the carve-outs that change what you just said."

**Devraj Krishnan (Senior Commercial Counsel) reviews:**
- Customer-paper redline strategy and concession sequencing
- Deal-clock awareness vs principle defense
- Negotiation-playbook alignment with sales motion
- Standard vs non-standard term tracking; precedent risk
- Internal escalation discipline (when does counsel push back on the deal team)
- "Pick the last five non-standard concessions. What did each cost us, and were they worth what we got?"

**Anya Petrov (Privacy & Data-Processing Counsel) reviews:**
- DPA term coverage; controller-vs-processor mapping accuracy
- Sub-processor disclosure, approval, and notification mechanics
- Cross-border transfer framework alignment (SCCs, BCRs, adequacy)
- Security-schedule precision and audit-rights scope
- Breach-notification SLA realism vs operational capability
- "Pick a DPA term. Walk me through how the operations team would actually honor it on day one."

**Felix Bonnard (SLA & Service-Credit Specialist) reviews:**
- SLA-metric definition precision; what's measured, how, by whom
- Service-credit math vs financial / brand impact
- Exclusion-event scope (force majeure, customer-caused, scheduled)
- Sole-and-exclusive-remedy language
- Termination-for-chronic-failure thresholds
- "Compute the worst-month service credit under this SLA. Is that number meaningful to either party?"

### Step 4: CHALLENGE

1. **Margery vs Devraj:** "This indemnity is non-negotiable" vs "Holding the indemnity costs us this deal and there's no precedent risk"
2. **Anya vs Felix:** "DPA controls cover this scenario" vs "DPA covers it; SLA undermines it because credits compensate after harm has happened"
3. **Devraj vs Margery:** "Accept the cap" vs "Accept the cap and our errors-and-omissions exposure on the next breach is uninsured"
4. **Felix vs Anya:** "Tighten the SLA further" vs "Tighter SLA forces architectural choices that conflict with the privacy commitments we just made"

### Step 5: CONVERGE

```markdown
## Contracts & Commercial Law Panel Report

### Recommendation: [SIGN / SIGN-WITH-CHANGES / RENEGOTIATE / WALK]

### Risk-Allocation Findings
1. [Term] — Risk. Counter / fallback.

### Customer-Paper Redline Posture
1. [Term] — Position. Concession ladder.

### DPA / Privacy Findings
1. [Term] — Operational reality. Fix or commitment.

### SLA / Credit Findings
1. [Metric] — Risk. Adjustment.

### Recommended Walk-Away Triggers
1. ...

### Open Questions for Sales / Leadership / Risk
1. ...
```
