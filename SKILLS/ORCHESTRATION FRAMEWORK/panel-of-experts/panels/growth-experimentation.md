---
name: panel-growth-experimentation
description: Expert panel for growth-loop design, experimentation rigor, A/B test interpretation, and product-led growth motion review
aliases: [growth-panel, plg-panel, experimentation-panel, ab-test-panel]
category: orchestration
tags: [growth, plg, experimentation, ab-testing, growth-loops, activation, retention]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - growth strategy review
  - experimentation rigor review
  - A/B test design or readout
  - PLG motion review
  - activation / retention loop review
---

# Growth & Experimentation Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Karim El-Sayed** | Head of Growth | Growth-loop design, north-star metric, leverage hunting |
| **Dr. Chiara Mancini** | Experimentation Lead | Test design rigor, statistical honesty, learning velocity |
| **Wesley Mensah** | Activation & Onboarding Specialist | Time-to-value, aha-moment instrumentation, drop-off recovery |
| **Sayuri Watanabe** | Retention & Lifecycle Marketer | Habit formation, lifecycle messaging, resurrection mechanics |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Growth-strategy / north-star metric review
- New growth loop design
- A/B test pre-registration or readout
- Activation / onboarding redesign
- Retention / resurrection program design
- PLG motion adoption or revision

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| Growth strategy / loop design | All 4 |
| Experiment readout | Chiara, Karim, Wesley |
| Activation overhaul | Wesley, Karim, Chiara |
| Retention / lifecycle | Sayuri, Wesley, Chiara |
| North-star metric review | Karim, Chiara, Sayuri |

### Step 2: BRIEF — Present the Artifact

```
## Growth Review Target
- **Hypothesis / Goal:** [the actual change being argued]
- **Metric Frame:** [north-star, input metrics, guardrails]
- **Surface:** [feature / flow / lifecycle stage]
- **Test Design:** [if applicable]
- **Population:** [segment, traffic, exposure]
- **Constraints:** [seasonality, instrumentation, sample size]
```

### Step 3: SOLO — Independent Expert Reviews

**Karim El-Sayed (Head of Growth) reviews:**
- Growth-loop topology: loops vs funnels; compounding vs leaky
- North-star metric quality — does it actually predict the business outcome?
- Leverage assessment: which input variable yields disproportionate output?
- Cross-team coordination cost vs predicted lift
- Long-term loop strength vs short-term gimmick
- "Draw the loop. Where does the system reinforce itself, and where does it leak?"

**Dr. Chiara Mancini (Experimentation Lead) reviews:**
- Hypothesis specificity and pre-registration discipline
- Power analysis; minimum-detectable-effect (MDE) realism
- Guardrail metric coverage; harm-detection tripwires
- Sample-ratio mismatch, A/A health, randomization integrity
- Multiple-comparisons correction; novelty / weekly seasonality
- "Pre-mortem this experiment. What's the most likely way you'll declare a false win?"

**Wesley Mensah (Activation & Onboarding Specialist) reviews:**
- Aha-moment definition and instrumentation; do we even know when it happens?
- Time-to-value distribution and the long tail
- Onboarding-step necessity (every step earns its place)
- Recovery flows for stalled / bounced users
- Empty-state quality and first-session storytelling
- "Watch ten new users complete (or abandon) onboarding. What pattern of behavior precedes drop-off?"

**Sayuri Watanabe (Retention & Lifecycle Marketer) reviews:**
- Habit formation: trigger / action / reward / investment loop strength
- Lifecycle-message timing and fatigue management
- Resurrection / win-back mechanics and honest measurement
- Cohort-retention shape (does the curve flatten or just decay?)
- Channel orchestration without spam
- "Pull retention curves by cohort. Where does the curve flatten, and what changed for users who reach that plateau?"

### Step 4: CHALLENGE

1. **Karim vs Chiara:** "Ship it; the loop is right" vs "We don't have a clean read; ship feels like a vibe"
2. **Chiara vs Wesley:** "Activation lift is significant" vs "The power calc says we're under-powered for the segment that matters"
3. **Wesley vs Sayuri:** "Activation is the constraint" vs "Activation is fine; we're losing them in week three of lifecycle silence"
4. **Sayuri vs Karim:** "Lifecycle messaging is the lever" vs "Lifecycle messaging dresses up a leaky loop"

### Step 5: CONVERGE

```markdown
## Growth & Experimentation Panel Report

### Recommendation: [SHIP / SHIP-WITH-CHANGES / EXTEND TEST / KILL]

### Loop / Strategy Findings
1. [Finding] — Where leverage is or isn't.

### Experiment-Rigor Findings
1. [Finding] — Methodological gap. Fix.

### Activation Findings
1. [Finding] — Aha gap. Recovery mechanism.

### Retention / Lifecycle Findings
1. [Finding] — Lifecycle stage. Mechanism.

### Recommended Next Experiments
1. ...

### Open Questions for Product / Eng / Marketing
1. ...
```
