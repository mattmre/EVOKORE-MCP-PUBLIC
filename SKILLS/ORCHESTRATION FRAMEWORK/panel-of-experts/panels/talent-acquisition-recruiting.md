---
name: panel-talent-acquisition-recruiting
description: Expert panel for hiring strategy, sourcing channel design, interviewer calibration, and offer / closing rigor
aliases: [recruiting-panel, ta-panel, hiring-panel, talent-panel]
category: orchestration
tags: [recruiting, hiring, sourcing, interviewing, talent-acquisition, offer-strategy]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - hiring strategy review
  - recruiting funnel review
  - interviewer calibration review
  - offer / closing strategy review
  - sourcing channel review
---

# Talent Acquisition & Recruiting Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Imani Williams** | Head of Talent Acquisition | Hiring plan integrity, funnel mechanics, recruiter capacity model |
| **Tomáš Doležal** | Sourcing & Pipeline Strategist | Sourcing channel mix, talent-pool development, passive-candidate motion |
| **Naveen Iyer** | Interviewer Calibration Lead | Rubric design, calibration sessions, bias-mitigation, signal quality |
| **Rachel Stein** | Offer & Closing Specialist | Compensation positioning, candidate experience, offer-acceptance rate |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Annual hiring plan review
- Funnel-conversion regression
- New role family or geo opening
- Interviewer-calibration overhaul (or after a notable bad hire / bad miss)
- Offer-acceptance-rate decline
- Diversity-representation hiring review

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| Annual hiring plan | All 4 |
| Funnel diagnostics | Imani, Tomáš, Naveen |
| Interviewer-calibration overhaul | Naveen, Imani, Rachel |
| Offer / closing review | Rachel, Imani, Tomáš |
| New geo / role family launch | All 4 |

### Step 2: BRIEF — Present the Artifact

```
## TA Review Target
- **Hiring Plan:** [count, role mix, geo, level mix]
- **Funnel Snapshot:** [pass-through rates per stage]
- **Sourcing Mix:** [inbound, outbound, agency, referral]
- **Interview Loops:** [structure per role family]
- **Offer Stats:** [time-to-offer, acceptance rate, comp benchmark]
- **Constraints:** [budget, headcount lock, regulatory, immigration]
```

### Step 3: SOLO — Independent Expert Reviews

**Imani Williams (Head of TA) reviews:**
- Hiring plan vs recruiter capacity reality
- Funnel-stage conversion vs benchmarks
- Time-to-fill by role family; aging req discipline
- Hiring-manager engagement (does the bar live in the rubric or in the manager's head?)
- Pipeline diversity from sourcing to offer
- "Pick the toughest open role. Show me the funnel today, the SLA at each stage, and the next planned action."

**Tomáš Doležal (Sourcing & Pipeline Strategist) reviews:**
- Sourcing-channel mix and ROI by channel
- Outbound craft: messaging quality, response rate, conversion
- Talent-pool / silver-medalist nurture
- Employer brand presence in the channels candidates actually use
- Geographic / segment coverage gaps
- "Pull last week's outbound. What was the response rate, and what did the responses actually say?"

**Naveen Iyer (Interviewer Calibration Lead) reviews:**
- Rubric clarity per role and per loop stage
- Calibration cadence and inter-rater agreement
- Signal-vs-noise per interview type (structured behavioral, work sample, system design)
- Interviewer training, shadowing, certification posture
- Bias-mitigation mechanics (debrief structure, anchor management)
- "Pull last week's debriefs. Where do you see one strong opinion sweep three uncertain ones?"

**Rachel Stein (Offer & Closing Specialist) reviews:**
- Comp positioning vs target percentile and competitive offers
- Time-from-offer-to-acceptance distribution; long-tail patterns
- Candidate experience through close; reference / backchannel rigor
- Counter-offer negotiation playbook discipline
- Reasons-for-decline pattern (and whether anyone systematically reads them)
- "Pull the last 10 declined offers. What's the cluster, and which ones we could have closed?"

### Step 4: CHALLENGE

1. **Imani vs Naveen:** "Lower the bar; we need bodies" vs "Lowering the bar costs more in 12 months than the current vacancy"
2. **Tomáš vs Imani:** "Outbound is broken" vs "Outbound works; the funnel downstream is leaking it"
3. **Rachel vs Tomáš:** "We're losing candidates to comp" vs "We're losing candidates to a slow process; comp is the excuse"
4. **Naveen vs Rachel:** "Tighten the loop" vs "Loop is correctly tight; the close motion is sloppy"

### Step 5: CONVERGE

```markdown
## Talent Acquisition Panel Report

### Hiring-Plan Confidence: [LOW / MEDIUM / HIGH]

### Funnel / Capacity Findings
1. [Finding] — Stage. Cause. Fix.

### Sourcing Findings
1. [Channel] — ROI. Action.

### Interviewer-Calibration Findings
1. [Finding] — Loop / role. Calibration plan.

### Offer / Close Findings
1. [Pattern] — Cause. Process or comp action.

### Recommended Hiring-Plan Adjustments
1. ...

### Open Questions for Eng / Sales / Finance
1. ...
```
