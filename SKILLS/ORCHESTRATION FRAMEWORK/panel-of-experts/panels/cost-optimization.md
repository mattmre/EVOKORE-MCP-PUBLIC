---
name: panel-cost-optimization
description: Expert panel for cloud / SaaS / build-system cost analysis, FinOps unit-economic review, and waste-reduction without reliability regression
aliases: [finops-panel, cost-panel, cloud-cost-panel, cost-review-panel]
category: orchestration
tags: [finops, cost, cloud-cost, optimization, unit-economics, waste-reduction]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - cost optimization review
  - cloud bill analysis
  - FinOps review
  - unit-economics review
  - waste-reduction sweep
---

# Cost Optimization Panel

> **Distinction:** this panel reviews *cost as a system property* (architecture, build, infra, vendor mix). For business-level pricing strategy, see `pricing-packaging-strategy`. For broader business-model viability, see `business-product-strategy`.

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Dr. Yara Halevi** | FinOps Architect | Unit-economic decomposition, cost per workload, allocation hygiene |
| **Bran Caldwell** | Cloud Infrastructure Optimizer | Right-sizing, reservation/savings-plan posture, idle and over-provisioned resources |
| **Sade Adekunle** | SaaS & Vendor Cost Analyst | License-tier optimization, seat reclamation, contract-renewal leverage |
| **Niko Stefanopoulos** | Reliability-Aware Cost Reviewer | Cost cuts that don't silently degrade reliability, latency, or capacity headroom |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Quarterly FinOps / cost review
- Pre-budget planning cycle
- After a bill anomaly or surprise overage
- Before a major architecture migration with cost implications
- Contract renewal windows for material vendors
- Pre-IPO / pre-fundraise unit-economic scrub

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| Cloud-bill review | Yara, Bran, Niko |
| SaaS-stack review | Yara, Sade, Niko |
| Architecture-migration costing | All 4 |
| Renewal negotiation prep | Sade, Yara, Niko |
| Anomaly investigation | Bran, Yara, Niko |

### Step 2: BRIEF — Present the Artifact

```
## Cost Review Target
- **Scope:** [domain — cloud, SaaS, build, vendor]
- **Period:** [month / quarter / TTM]
- **Spend:** [headline number, by category]
- **Allocation State:** [tag coverage, unallocated %]
- **Recent Changes:** [migrations, new services, headcount]
- **Constraints:** [reliability targets, regulatory, contractual lock-ins]
```

### Step 3: SOLO — Independent Expert Reviews

**Dr. Yara Halevi (FinOps Architect) reviews:**
- Unit economics: cost per customer, per request, per active user, per tenant
- Allocation completeness — what % of spend is unattributable?
- Driver analysis: what's actually moving the bill month-over-month?
- Anomaly detection — are runaway services flagged before they're material?
- Forecast accuracy and confidence intervals
- "Pick the top three cost drivers. For each, name the unit they scale with and the unit economics today vs trend."

**Bran Caldwell (Cloud Infrastructure Optimizer) reviews:**
- Idle / over-provisioned compute, storage, databases
- Reservation / savings-plan / committed-use coverage and laddering
- Storage tier appropriateness; lifecycle policies; orphan volumes and snapshots
- Network egress and inter-region traffic
- Resource sprawl (test, sandbox, abandoned environments)
- "Show me the biggest single-resource line items. For each, justify why it isn't smaller."

**Sade Adekunle (SaaS & Vendor Cost Analyst) reviews:**
- Per-seat utilization vs license tier
- Overlapping tools / consolidation opportunities
- Tier-shopping: is the current tier's marginal value defensible?
- Auto-renewal terms, ramp clauses, true-up exposure
- Negotiation leverage: usage benchmarks, competitive alternatives, contract timing
- "Pick the five biggest SaaS lines. For each, show me the utilization metric and the next renewal date."

**Niko Stefanopoulos (Reliability-Aware Cost Reviewer) reviews:**
- Capacity headroom remaining after each proposed cut
- SLO impact modeling for right-sizing and reservation changes
- Single-tenant -> shared / multi-tenant moves and their failure-isolation cost
- Disaster-recovery and backup posture not silently downgraded
- Performance regressions hidden in cheaper tiers (CPU credits, IO throttling)
- "For each proposed cost cut, name the specific incident that gets worse if we make it."

### Step 4: CHALLENGE

1. **Bran vs Niko:** "Right-size this fleet 40%" vs "Right-sizing 40% leaves no headroom for the next traffic spike"
2. **Yara vs Sade:** "Unit cost is too high" vs "Unit cost looks fine on the SaaS line — the cost is engineering time around it"
3. **Sade vs Yara:** "Consolidate to one vendor" vs "Consolidating creates a single negotiation cliff in 18 months"
4. **Niko vs Bran:** "Reserved instances lock us in" vs "Not reserving costs us more than the lock-in does"

### Step 5: CONVERGE

```markdown
## Cost Optimization Panel Report

### Headline Findings
- Annualized savings opportunity: [$X], identified across [Y] initiatives.
- Reliability-risk-flagged opportunities: [count], excluded or gated.

### High-Confidence Savings (Low Risk)
1. [Action] — Annualized: [$]. Effort: [low/med]. Owner: [role].

### Material Savings Requiring Reliability Review
1. [Action] — Annualized: [$]. Risk: [what could regress]. Mitigation: [proposal].

### Allocation / Tagging Debt
1. [Gap] — % of spend hidden. Fix.

### Renewal-Window Opportunities
1. [Vendor] — Renewal: [date]. Leverage: [usage data, alternatives].

### Open Questions for Finance / Eng / Leadership
1. ...
```
