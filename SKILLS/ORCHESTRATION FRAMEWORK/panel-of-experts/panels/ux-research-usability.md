---
name: panel-ux-research-usability
description: Expert panel for usability research design, qualitative / quantitative findings interpretation, and human-centered design hypothesis testing
aliases: [ux-research-panel, usability-panel, hcd-panel, user-research-panel]
category: orchestration
tags: [ux, ux-research, usability, hcd, user-research, qualitative, quantitative]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - UX research review
  - usability study design or analysis
  - human-centered design review
  - mixed-methods research review
  - user-research-driven hypothesis review
---

# UX Research & Usability Panel

> **Distinction:** focused on the *research craft* — study design, finding validity, hypothesis testing. For broader product strategy, see `business-product-strategy`. For accessibility-specific lived-experience review, see `accessibility-inclusive-design`.

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Dr. Jana Kowalski** | Senior UX Researcher (Mixed Methods) | Study design, methodological soundness, finding triangulation |
| **Tomás Reyes** | Behavioral Quantitative Analyst | Funnel, cohort, A/B, log-based behavior, statistical power |
| **Ife Olumide** | Qualitative & Ethnographic Lead | Interview craft, contextual inquiry, meaning beyond click data |
| **Daniela Hartmann** | Usability Test Practitioner | Task design, moderator bias, prototype-fidelity tradeoffs |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Reviewing a research plan before fielding
- Interpreting findings before they enter a roadmap argument
- Auditing prior research that's being cited as justification for a decision
- Mixed-methods study design (qual + quant + log)
- Pre-launch usability gate for a high-stakes flow
- Investigating a metric drop with research, not guessing

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New research plan | All 4 |
| Findings interpretation | Jana, Tomás, Ife |
| Usability study | Daniela, Jana, Ife |
| A/B test design / readout | Tomás, Jana, Daniela |
| Roadmap-justifying research audit | All 4 |

### Step 2: BRIEF — Present the Artifact

```
## UX Research Review Target
- **Question(s):** [the actual decision the research must inform]
- **Method(s):** [proposed or used]
- **Population & Sampling:** [who, how recruited]
- **Sample Size & Power:** [n, with rationale]
- **Stakeholder Pre-Commitments:** [what people already think the answer is]
- **Constraints:** [time, budget, instrument access]
```

### Step 3: SOLO — Independent Expert Reviews

**Dr. Jana Kowalski (Senior UX Researcher) reviews:**
- Are the questions actually answerable by the chosen method?
- Are findings triangulated across methods (qual ↔ quant ↔ behavioral)?
- Threats to validity: selection, observer, confirmation, recency
- Are conclusions proportional to the evidence?
- Is the research argued, not just reported (claim → evidence → caveat → next study)?
- "Restate the headline finding in three sentences. Now show me the evidence that would make me revise it."

**Tomás Reyes (Behavioral Quantitative Analyst) reviews:**
- Sample size, power, effect-size detectability
- Metric definition stability and instrumentation accuracy
- Bias risks: novelty, seasonality, recruitment self-selection, sample-ratio mismatch
- Multiple-comparisons and p-hacking exposure
- Causal vs correlational language; was it an experiment or an observation?
- "If I rerun this study tomorrow with a different cohort of the same population, what's the chance the headline finding flips?"

**Ife Olumide (Qualitative & Ethnographic Lead) reviews:**
- Interview craft: leading questions, premature interpretation, observer presence
- Coding scheme rigor and inter-rater reliability
- Saturation: did themes stabilize, or did the team stop early?
- Context loss in summaries — does the reader feel the user, or just the bullet?
- Power asymmetry between researcher and participant
- "Pull a random transcript. Where did the moderator stop being curious?"

**Daniela Hartmann (Usability Test Practitioner) reviews:**
- Task realism vs artificial scenario; demand characteristics
- Prototype fidelity matched to the question being asked
- Moderator script standardization vs natural conversation
- Severity rating consistency across sessions and reviewers
- Whether failures are explained (not just counted)
- "Pick the three most cited usability issues. Show me the moments in video where the user actually got stuck."

### Step 4: CHALLENGE

1. **Jana vs Tomás:** "The qual signal is strong" vs "The quant doesn't replicate it; one of them is wrong"
2. **Tomás vs Daniela:** "n=8 usability is fine" vs "Statistical claims need n much higher than that"
3. **Ife vs Jana:** "The themes are real" vs "The themes are artifacts of the moderator script"
4. **Daniela vs Ife:** "The task succeeded" vs "Task success doesn't mean usable — the user hated it"

### Step 5: CONVERGE

```markdown
## UX Research & Usability Panel Report

### Research Maturity: [WEAK / ADEQUATE / STRONG]

### Findings Worth Acting On (with confidence levels)
1. [Finding] — Confidence: [low/med/high]. Evidence: [what carries it]. Caveats.

### Findings Insufficiently Supported
1. [Finding] — Why support is weak. What study would strengthen it.

### Methodological Debt
1. [Issue] — Risk to current and future studies. Fix.

### Recommended Next Studies
1. [Question] — Method. Population. n. Decision it informs.

### Open Questions for Product / Design
1. ...
```
