---
name: panel-supply-chain-logistics
description: Expert panel for supply-chain design, supplier-risk management, logistics optimization, and inventory / S&OP discipline
aliases: [supply-chain-panel, logistics-panel, sop-panel, supplier-panel]
category: orchestration
tags: [supply-chain, logistics, inventory, sop, supplier-risk, fulfillment]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - supply chain design review
  - supplier risk review
  - logistics network optimization
  - inventory / S&OP review
  - sourcing strategy review
---

# Supply Chain & Logistics Panel

> **Distinction:** focused on *physical-goods* flow — sourcing, manufacturing, inventory, distribution. For software-vendor management, see `procurement-vendor-management`.

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Ingrid Söderberg** | VP Supply Chain | Network design, S&OP discipline, end-to-end coherence |
| **Dr. Rajesh Venkataraman** | Sourcing & Supplier Risk Lead | Supplier qualification, dual-source posture, geopolitical / ESG risk |
| **Camila Restrepo** | Logistics & Distribution Lead | Carrier strategy, lane economics, last-mile design |
| **Hassan El-Bashir** | Inventory & Demand Planning Lead | Forecast accuracy, safety-stock math, working-capital discipline |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Supply-chain network redesign
- Supplier-risk audit / concentration review
- Logistics RFP / carrier strategy
- Inventory / S&OP process redesign
- Crisis response (disruption, shortage, tariff shock)
- New product / new geo launch supply readiness

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| Network redesign | All 4 |
| Supplier-risk audit | Rajesh, Ingrid, Hassan |
| Logistics RFP | Camila, Ingrid, Hassan |
| Inventory / S&OP | Hassan, Ingrid, Camila |
| Disruption response | Ingrid, Rajesh, Camila |

### Step 2: BRIEF — Present the Artifact

```
## Supply Chain Review Target
- **Subject:** [network / supplier / lane / SKU class / S&OP cycle]
- **Scope:** [SKUs, geos, channels, suppliers]
- **Headline Stats:** [OTIF, fill rate, inventory turns, days of supply]
- **Constraints:** [capacity, lead time, working capital, regulatory]
- **Recent Events:** [disruption, supplier failure, demand shock, tariff]
- **Open Issues:** [stockouts, expedites, write-downs]
```

### Step 3: SOLO — Independent Expert Reviews

**Ingrid Söderberg (VP Supply Chain) reviews:**
- Network design coherence: nodes, flows, postponement choices
- S&OP rhythm and quality: demand / supply / finance / executive convergence
- End-to-end visibility (tier-1 vs tier-2/3 transparency)
- Disruption-playbook readiness and rehearsal quality
- Cost-to-serve clarity by SKU / channel / customer class
- "Pick the slowest-moving SKU. Walk me from forecast through PO through inbound through allocation. Where does the system lie to itself?"

**Dr. Rajesh Venkataraman (Sourcing & Supplier Risk Lead) reviews:**
- Supplier qualification rigor (financial, quality, ESG, security)
- Single-source vs dual-source posture and switching-cost reality
- Geopolitical / tariff / sanctions exposure mapping
- Sub-tier visibility (tier-2 / tier-3 concentration)
- Supplier-development vs arms-length sourcing balance
- "Pick the top three single-source SKUs. Show me what happens in a 12-week supplier outage and the actual switch plan."

**Camila Restrepo (Logistics & Distribution Lead) reviews:**
- Carrier mix and rate-vs-service tradeoffs
- Lane-economics rigor (mode, equipment, fuel, accessorials)
- DC / 3PL footprint vs demand-density math
- Last-mile design and customer-promise coherence
- Cross-border / customs / brokerage maturity
- "Take the highest-cost lane. Decompose the rate. Show me the three levers that move it 10% and the cost of pulling each."

**Hassan El-Bashir (Inventory & Demand Planning Lead) reviews:**
- Forecast-accuracy methodology and bias detection
- Safety-stock math vs service-level target coherence
- Slow-mover / obsolete inventory aging and write-down discipline
- Working-capital impact and turns trajectory
- Promo / seasonal / new-product forecasting maturity
- "Pull a SKU's forecast vs actuals over 12 months. Show me the bias. Now show me the safety-stock setting that bias produced."

### Step 4: CHALLENGE

1. **Ingrid vs Rajesh:** "Dual-source everything" vs "Dual-sourcing everything destroys volume leverage; pick where it actually matters"
2. **Hassan vs Ingrid:** "Reduce safety stock" vs "Reduce safety stock and the next demand spike eats every gain you booked"
3. **Camila vs Hassan:** "Faster mode for service" vs "Faster mode without forecast accuracy is just paying premium for our planning failure"
4. **Rajesh vs Camila:** "Near-shore the supplier" vs "Near-shore the supplier and inland-freight cost destroys the unit economics"

### Step 5: CONVERGE

```markdown
## Supply Chain & Logistics Panel Report

### Network Health: [STRONG / RESILIENT / FRAGILE]

### Network / S&OP Findings
1. [Finding] — Coherence gap. Action.

### Supplier-Risk Findings
1. [Supplier / SKU] — Risk. Mitigation. Owner.

### Logistics Findings
1. [Lane / mode] — Cost / service gap. Adjustment.

### Inventory / Forecast Findings
1. [SKU / class] — Bias / setting. Fix.

### Recommended Investment Sequence
1. ...

### Open Questions for COO / CFO / Board
1. ...
```
