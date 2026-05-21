---
name: panel-pricing-packaging-strategy
description: Expert panel for pricing-model design, packaging tier architecture, willingness-to-pay research, and monetization-strategy review
aliases: [pricing-panel, packaging-panel, monetization-panel, pricing-strategy-panel]
category: orchestration
tags: [pricing, packaging, monetization, willingness-to-pay, value-metric, tiers]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - pricing strategy review
  - packaging / tier redesign
  - new pricing model launch
  - willingness-to-pay analysis
  - value-metric selection
  - discount / monetization audit
---

# Pricing & Packaging Strategy Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Dr. Lior Adelman** | Pricing Strategist | Pricing-model selection, value-metric design, willingness-to-pay calibration |
| **Femi Akinwale** | Packaging & Tiering Architect | Tier mechanics, feature gating, fence design without buyer hostility |
| **Karina Vlasova** | Monetization Analyst | Net price reality, discount drift, deal-shape patterns, unit economics |
| **Roland Becker** | Buyer-Behavior Researcher | How buyers actually make this decision, anchoring, choice architecture |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- New pricing model (subscription → usage, freemium introduction, etc.)
- Major repackaging or tier redesign
- New product line monetization
- Persistent discount creep or eroding net price
- Pre-board / pre-investor monetization narrative
- After a competitive pricing shift in the market

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New pricing model | All 4 |
| Tier / packaging redesign | Femi, Lior, Roland |
| WTP research design | Lior, Roland, Karina |
| Discount / net-price audit | Karina, Lior, Femi |
| Competitive response review | Lior, Roland, Karina |

### Step 2: BRIEF — Present the Artifact

```
## Pricing Review Target
- **Proposal:** [model / tiers / value metric]
- **Current State:** [how it works today, headline net-price metrics]
- **Hypothesis:** [what change is meant to do]
- **Customer Segments:** [who's most affected]
- **Constraints:** [contractual lock-ins, channel, regulatory]
- **Evidence Base:** [research, conjoint, win/loss, A/B]
```

### Step 3: SOLO — Independent Expert Reviews

**Dr. Lior Adelman (Pricing Strategist) reviews:**
- Value-metric appropriateness — does it scale with the value the customer receives?
- Pricing-model fit (subscription / usage / outcome / hybrid) for the buying behavior
- Anchoring discipline; floor-price logic
- Price-fence design (segments, geos, channels) and arbitrage risk
- Headline price vs realized price — alignment or theatre?
- "Pick the value metric. Defend why it scales the right way for the right buyer at the right time."

**Femi Akinwale (Packaging & Tiering Architect) reviews:**
- Tier design: clear progression vs confusing maze
- Feature-gating choices and whether they punish the buyer or invite them up
- Add-on vs core packaging discipline
- Unbundling / rebundling risk (the customer figures out a cheaper combination)
- Migration story for existing customers when packaging changes
- "Walk a self-serve buyer through the page. Where do they get angry, and where do they get curious?"

**Karina Vlasova (Monetization Analyst) reviews:**
- Net-price reality vs list; segment-by-segment discount distribution
- Discount drift over time; concession patterns by rep / region
- Deal-shape distortions (long ramps, free months, custom SKUs that won't renew cleanly)
- Cohort unit-economic impact of the proposed change
- Forecast credibility for the proposed pricing-event ARR
- "Show me the realized net ASP for the last 4 quarters. Is the proposed model fixing the right problem?"

**Roland Becker (Buyer-Behavior Researcher) reviews:**
- Choice architecture: how many options, in what order, with what defaults
- Anchoring effects in the proposed page or proposal flow
- Loss-aversion and switching cost framing
- Procurement / committee dynamics in the buyer org
- Whether the model is intuitive in the first 60 seconds
- "Show this to a real buyer in the segment. Don't explain. What do they ask first?"

### Step 4: CHALLENGE

1. **Lior vs Femi:** "The value metric is correct" vs "The packaging breaks the metric in the actual buying flow"
2. **Karina vs Lior:** "List price is up" vs "Realized price is flat — list is theatre"
3. **Roland vs Femi:** "Three tiers maximize conversion" vs "Three tiers hide the right one in the middle"
4. **Femi vs Roland:** "We must gate this feature" vs "Gating it makes the entry tier feel like a punishment"

### Step 5: CONVERGE

```markdown
## Pricing & Packaging Panel Report

### Recommendation: [SHIP / SHIP-WITH-CHANGES / HOLD / KILL]

### Model / Metric Findings
1. [Finding] — Risk. Recommendation.

### Tier / Packaging Findings
1. [Finding] — Buyer impact. Migration plan.

### Net-Price / Monetization Findings
1. [Finding] — Discount or deal-shape pattern. Fix.

### Buyer-Behavior Findings
1. [Finding] — Friction or confusion. UX implication.

### Migration Plan for Existing Customers
1. ...

### Open Questions for Sales / Finance / Product
1. ...
```
