---
name: panel-sales-pipeline-management
description: Expert panel for sales-pipeline health, forecast credibility, qualification rigor, and rep / territory productivity
aliases: [sales-panel, pipeline-panel, forecast-panel, sales-ops-panel]
category: orchestration
tags: [sales, pipeline, forecasting, qualification, territory, sales-operations]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - sales pipeline review
  - forecast credibility check
  - pipeline qualification audit
  - territory or rep productivity review
  - quarterly sales operating review
---

# Sales Pipeline Management Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Renata Solis** | Enterprise Sales Leader | Deal-quality judgment, qualification discipline, executive selling |
| **Davit Kapanadze** | Sales Operations Director | Pipeline mechanics, stage-conversion math, CRM hygiene, forecast model |
| **Priya Anand** | Revenue Enablement Lead | Methodology adoption, rep skill gaps, ramp time, coaching cadence |
| **Thomas Nordquist** | RevOps Forecaster | Forecast credibility, deal slippage patterns, commit / best-case / pipeline math |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Quarterly business review and forecast lock
- Mid-quarter forecast slippage investigation
- Territory carve / quota redesign
- New segment or product introduction into the pipeline
- Sales-methodology change (MEDDIC, Challenger, Sandler, etc.)
- Pre-board / pre-investor revenue narrative review

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| Quarterly forecast | Davit, Thomas, Renata |
| Pipeline-health audit | All 4 |
| Methodology adoption review | Priya, Renata, Davit |
| Territory / quota redesign | Renata, Davit, Thomas |
| Slippage root-cause | Thomas, Renata, Priya |

### Step 2: BRIEF — Present the Artifact

```
## Sales Pipeline Review Target
- **Period:** [quarter / month / TTM]
- **Pipeline Snapshot:** [coverage ratio, stage distribution]
- **Forecast Categories:** [commit, best case, pipeline]
- **Key Deals:** [top 10 by ACV]
- **Recent Changes:** [territory, comp, methodology, product]
- **Constraints:** [board commitments, capacity, ramping reps]
```

### Step 3: SOLO — Independent Expert Reviews

**Renata Solis (Enterprise Sales Leader) reviews:**
- Deal-quality reads: power, pain, process, paper
- Champion strength and economic-buyer access for top deals
- Competitive posture deal-by-deal
- Late-stage friction patterns; legal / procurement bottlenecks
- Whether the rep is actually running the deal or being run by it
- "Pick the five biggest deals. For each, name the economic buyer and the day you last got time with them."

**Davit Kapanadze (Sales Operations Director) reviews:**
- Stage-conversion rates vs benchmarks; outlier stages
- Sales-cycle length by segment and product; trend
- CRM hygiene: required-field compliance, stage-definition rigor
- Pipeline coverage relative to target by quarter
- Rep-level pipeline shape (top-heavy, sparse, lopsided)
- "Show me every deal in stage 4+ that hasn't moved in 60 days. What's the disposition plan?"

**Priya Anand (Revenue Enablement Lead) reviews:**
- Methodology adoption depth, not just training-completion checkboxes
- Coaching cadence and quality (calls observed, not just held)
- Ramp-time data and where new reps stall
- Skill-gap patterns across the team (discovery, multi-threading, negotiation)
- Content / asset relevance to current buyer behavior
- "Listen to three coaching sessions from last week. What's actually being taught?"

**Thomas Nordquist (RevOps Forecaster) reviews:**
- Forecast accuracy vs actuals over the last 4–8 cycles
- Deal-slippage pattern: which stages, which segments, which reps?
- Commit / best-case discipline: is "commit" being used as a wish?
- Bottoms-up rep forecast vs top-down management adjustment delta
- Win-rate stability and confidence interval on the headline number
- "Show me the last six commit-vs-actual deltas. Tell me which lessons we actually changed behavior on."

### Step 4: CHALLENGE

1. **Renata vs Davit:** "The deal will close" vs "Stage progression and activity say it won't"
2. **Thomas vs Renata:** "Forecast says commit" vs "Pattern of past slippage says discount commit by 30%"
3. **Priya vs Davit:** "Reps need more training" vs "Reps need a CRM that doesn't punish them for using it"
4. **Davit vs Thomas:** "Pipeline coverage is healthy" vs "Coverage hides a single-deal-dependent quarter"

### Step 5: CONVERGE

```markdown
## Sales Pipeline Panel Report

### Forecast Confidence: [LOW / MEDIUM / HIGH]

### Forecast-Risk Findings
1. [Risk] — Deal / segment / rep. Magnitude. Mitigation.

### Pipeline-Quality Findings
1. [Finding] — Evidence. Recommended cleanup.

### Methodology / Enablement Findings
1. [Finding] — Skill gap. Coaching plan.

### Process / RevOps Findings
1. [Finding] — System / data gap. Owner.

### Deal-by-Deal Recommended Actions (Top 10)
1. ...

### Open Questions for Leadership
1. ...
```
