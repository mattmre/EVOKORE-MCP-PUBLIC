---
name: panel-procurement-vendor-management
description: Expert panel for procurement strategy, vendor selection, contract negotiation, and ongoing vendor / third-party risk management
aliases: [procurement-panel, vendor-panel, sourcing-panel, vendor-management-panel]
category: orchestration
tags: [procurement, sourcing, vendor-management, third-party-risk, contracts, negotiation]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - vendor selection / sourcing review
  - procurement strategy review
  - vendor contract negotiation review
  - third-party risk review
  - vendor consolidation analysis
---

# Procurement & Vendor Management Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Hugo Beauchamp** | Head of Procurement | Sourcing strategy, category management, leverage architecture |
| **Tara Madhavan** | Senior Negotiator | Negotiation craft, contract terms, walk-away power |
| **Olu Adesanya** | Third-Party Risk Lead | Vendor risk: security, financial health, concentration, sub-processors |
| **Reinhard Bauer** | Vendor-Performance Manager | SLA design, ongoing-performance review, contract-to-reality drift |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Material new vendor selection (>$X spend or critical-path)
- Renewal of a strategic vendor with material spend
- Category strategy review (consolidation, multi-source, diversification)
- Vendor underperformance investigation
- Pre-onboarding third-party risk review
- After a vendor-caused incident or breach

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New vendor selection | All 4 |
| Renewal negotiation | Hugo, Tara, Reinhard |
| Category strategy | Hugo, Tara, Olu |
| Underperformance review | Reinhard, Hugo, Tara |
| Third-party risk review | Olu, Hugo, Reinhard |

### Step 2: BRIEF — Present the Artifact

```
## Procurement Review Target
- **Vendor / Category:** [name, scope, role]
- **Spend & Term:** [annual, total contract value, renewal date]
- **Use Case:** [what this vendor enables, criticality]
- **Alternatives:** [shortlist, do-nothing baseline]
- **Risk Posture:** [security, financial, concentration]
- **Constraints:** [contract clock, regulatory, technical lock-in]
```

### Step 3: SOLO — Independent Expert Reviews

**Hugo Beauchamp (Head of Procurement) reviews:**
- Sourcing-strategy fit (single / dual / multi-source) for the category
- Total-cost-of-ownership beyond list (implementation, migration, switching)
- Category leverage architecture; portfolio view of vendor relationships
- Buy vs build vs partner posture
- Procurement-to-business credibility — does the business actually engage procurement early?
- "Show me the category map. Where are we over-concentrated, under-leveraged, or buying the same thing twice?"

**Tara Madhavan (Senior Negotiator) reviews:**
- Negotiation prep: BATNA strength, walk-away credibility, internal alignment
- Term-sheet hygiene: liability caps, indemnities, audit rights, exit terms
- Pricing-mechanic discipline (CPI escalators, true-ups, ramp clauses, MFN)
- Concession sequencing and trade architecture
- Renewal posture vs net-new posture
- "Walk me through your last call with this vendor. Where did you give value, and what did you get back?"

**Olu Adesanya (Third-Party Risk Lead) reviews:**
- Security posture (SOC2, ISO 27001, penetration testing freshness)
- Financial-health and going-concern risk
- Sub-processor / fourth-party visibility
- Concentration risk at the vendor's own customer base
- Incident-response, breach-notification, and SLA-credit reality
- "Pull the vendor's last security questionnaire. What did they answer, and what did they avoid answering?"

**Reinhard Bauer (Vendor-Performance Manager) reviews:**
- SLA design: are the metrics the right ones, with the right credits?
- Ongoing-review cadence and decision rights
- Contract-to-reality drift: what they sold vs what they deliver
- Escalation-path discipline and use-of-cure-period reality
- Internal stakeholder satisfaction with the vendor relationship
- "Show me the last two QBRs with this vendor. What got fixed, and what's been drifting since?"

### Step 4: CHALLENGE

1. **Hugo vs Tara:** "Consolidate to one vendor for leverage" vs "Consolidating eliminates our negotiation leverage at the next renewal cliff"
2. **Tara vs Olu:** "The terms are excellent" vs "The terms are excellent and the indemnity cap is below the breach exposure"
3. **Reinhard vs Hugo:** "Renew with this vendor" vs "Renew this vendor and we lock in 18 months of underperformance"
4. **Olu vs Reinhard:** "Vendor risk is acceptable" vs "Vendor risk is acceptable on paper; their actual incident behavior is the risk"

### Step 5: CONVERGE

```markdown
## Procurement & Vendor Management Panel Report

### Recommendation: [PROCEED / RENEGOTIATE / DECLINE / DUAL-SOURCE]

### Sourcing-Strategy Findings
1. [Finding] — Category. Recommendation.

### Negotiation Posture
1. [Term] — Current proposal. Counter. Walk-away.

### Third-Party Risk Findings
1. [Risk] — Severity. Mitigation / contractual ask.

### Performance / Drift Findings
1. [Finding] — Metric / behavior. Remediation.

### Recommended Contractual Asks (Top 5)
1. ...

### Open Questions for Legal / Finance / Business Owner
1. ...
```
