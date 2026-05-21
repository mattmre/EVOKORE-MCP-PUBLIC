---
name: panel-customer-support-operations
description: Expert panel for support operations design, ticket-flow architecture, escalation discipline, and self-service deflection
aliases: [support-panel, support-ops-panel, csat-panel, ticket-flow-panel]
category: orchestration
tags: [support, customer-support, ticketing, escalation, self-service, csat, deflection]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - support operations review
  - ticket flow / escalation review
  - support team scaling review
  - self-service deflection design
  - CSAT / response-time investigation
---

# Customer Support Operations Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Aurelio Ferraro** | Director of Support Operations | Tiering, routing, staffing model, queue mechanics |
| **Aisha Diallo** | Support Quality & CSAT Lead | Quality calibration, ticket-coaching depth, customer-language tone |
| **Olamide Babatunde** | Self-Service & Knowledge Lead | Deflection content, search relevance, KCS discipline |
| **Daichi Watanabe** | Support-Engineering Bridge | Ticket-to-bug pipeline, recurring-issue patterns, eng-relationship health |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Support-org scaling event (volume spike, headcount change, segment expansion)
- CSAT or response-time degradation
- New product / new SKU support readiness review
- Self-service / KB overhaul
- Tier-2 / engineering-escalation pattern review
- Pre-renewal-cycle support-debt scrub

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| Support operating review | All 4 |
| CSAT / response-time investigation | Aurelio, Aisha, Daichi |
| Self-service overhaul | Olamide, Aurelio, Aisha |
| Engineering-escalation review | Daichi, Aurelio, Olamide |
| New-product readiness | All 4 |

### Step 2: BRIEF — Present the Artifact

```
## Support Ops Review Target
- **Period & Volume:** [tickets / contacts]
- **Channel Mix:** [email / chat / phone / community]
- **Headline Metrics:** [first response, full resolution, CSAT, NPS, deflection]
- **Tier Structure:** [T1, T2, escalation paths]
- **Recent Changes:** [tools, headcount, product, comp]
- **Top 5 Drivers:** [issue categories]
```

### Step 3: SOLO — Independent Expert Reviews

**Aurelio Ferraro (Director of Support Operations) reviews:**
- Routing correctness; misroute rate; bouncing tickets
- Queue mechanics: SLA-by-priority discipline, aging at each tier
- Staffing model vs forecasted volume; shrinkage assumptions
- Tooling friction; agent context-switching cost
- Manager span-of-control and coaching capacity
- "Pick a normal-volume hour. Walk me through one ticket from contact to closure. Where did time go?"

**Aisha Diallo (Support Quality & CSAT Lead) reviews:**
- Quality-rubric calibration across reviewers; inter-rater reliability
- Tone, empathy, and recovery on hard contacts
- "Resolved" vs "actually resolved": closure-discipline
- Trends in low-CSAT root causes (product vs support behavior vs both)
- Coaching depth — surface compliance vs skill development
- "Pull the lowest-CSAT 10 tickets last week. What's the cluster you keep seeing?"

**Olamide Babatunde (Self-Service & Knowledge Lead) reviews:**
- Knowledge-base coverage of top contact reasons
- Search relevance and navigability; abandonment in self-service flows
- KCS discipline — articles capturing real solutions, not aspirational ones
- Article freshness; staleness flags and refresh cadence
- Deflection-rate measurement honesty (true deflection vs failed self-service)
- "Pull the top 20 contact reasons. For each, find the article. Is the answer findable in under 60 seconds?"

**Daichi Watanabe (Support-Engineering Bridge) reviews:**
- Ticket-to-bug intake quality; engineering trust in support reproductions
- Recurring-issue clusters that engineering hasn't prioritized
- Time-to-engineering-attention for genuine product defects
- Workaround-document quality and freshness
- Cross-functional friction: where engineering and support distrust each other
- "Show me the open recurring-issue tickets that have an engineering Jira but no movement in 60 days."

### Step 4: CHALLENGE

1. **Aisha vs Aurelio:** "We need more agents" vs "We need fewer tickets — fix the deflection content"
2. **Olamide vs Daichi:** "Self-service deflects this category" vs "Self-service hides a real bug; the deflection is suppressing signal"
3. **Daichi vs Aurelio:** "Eng won't fix it" vs "Support hasn't given eng a reproducible case in 18 months"
4. **Aurelio vs Aisha:** "Speed up handle time" vs "Faster handle time on this category drives CSAT down 8 points"

### Step 5: CONVERGE

```markdown
## Customer Support Operations Panel Report

### Operating Health: [STRONG / STABLE / DETERIORATING]

### Volume / Staffing Findings
1. [Finding] — Driver. Mitigation.

### Quality / CSAT Findings
1. [Finding] — Pattern. Coaching plan.

### Self-Service Findings
1. [Gap] — Top contact reason. Article action.

### Engineering-Bridge Findings
1. [Pattern] — Eng owner. SLA proposal.

### Top-5 Volume-Reduction Recommendations
1. ...

### Open Questions for Product / Eng / Finance
1. ...
```
