---
name: panel-financial-planning-analysis
description: Expert panel for FP&A model rigor, budgeting / forecasting credibility, scenario planning, and operating-plan defense
aliases: [fpa-panel, fp-and-a-panel, financial-planning-panel, budget-panel]
category: orchestration
tags: [fpa, finance, forecasting, budgeting, scenario-planning, operating-plan]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - FP&A model review
  - operating plan review
  - forecast accuracy investigation
  - scenario / sensitivity analysis review
  - board / investor financial review
---

# Financial Planning & Analysis Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Bjorn Halvorsen** | Head of FP&A | Operating-plan structure, driver-based modeling, executive narrative |
| **Padmaja Iyer** | Senior Financial Modeler | Model integrity, structural soundness, audit-trail and version discipline |
| **Eduardo Cardoso** | Scenario & Sensitivity Strategist | Scenario coherence, bear / base / bull rigor, decision-readiness |
| **Margaret Whitman** | Cost Center & Budget-Owner Liaison | Budget realism, departmental commitment, accountability mechanics |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Annual operating plan or major reforecast
- Pre-board / pre-investor financial review
- New product line or M&A integration into the plan
- Scenario / sensitivity analysis for a strategic decision
- After a forecast miss
- Budget-cycle kickoff and lock

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| Annual operating plan | All 4 |
| Reforecast | Bjorn, Padmaja, Eduardo |
| Scenario analysis | Eduardo, Bjorn, Padmaja |
| Department-level budget review | Margaret, Bjorn, Padmaja |
| Forecast-miss post-mortem | Padmaja, Bjorn, Eduardo |

### Step 2: BRIEF — Present the Artifact

```
## FP&A Review Target
- **Plan Type:** [annual / reforecast / LRP / scenario]
- **Headline Numbers:** [revenue, EBIT/EBITDA, FCF, headcount]
- **Key Drivers:** [top 5–10]
- **Assumptions:** [growth rates, retention, CAC, mix]
- **Constraints:** [board commitments, debt covenants, runway]
- **Recent Changes:** [from prior version]
```

### Step 3: SOLO — Independent Expert Reviews

**Bjorn Halvorsen (Head of FP&A) reviews:**
- Driver-based structure: are the inputs the actual operating levers?
- Operating-plan narrative: would an executive understand it without speaker notes?
- Cross-functional input integrity (sales, eng, marketing all believe their numbers)
- Headcount plan vs functional capacity reality
- Plan / forecast / actual variance discipline and review cadence
- "Tell me the story of next year in five sentences. Now point to where each sentence lives in the model."

**Padmaja Iyer (Senior Financial Modeler) reviews:**
- Model structural integrity: hardcodes vs formulas, circular refs, broken roll-ups
- Audit trail and version discipline; change attribution
- Tab / sheet hygiene and the "spreadsheet that ate the planet" pattern
- Edge-case behavior (zero-revenue scenarios, negative outputs, divide-by-zero)
- Documentation that survives the original modeler leaving
- "Pick a single output cell. Trace every input. Where does the trail go cold?"

**Eduardo Cardoso (Scenario & Sensitivity Strategist) reviews:**
- Scenario coherence — does the bear case actually believe its own assumptions throughout?
- Sensitivity analysis on the right variables (the ones with real uncertainty, not the easy ones)
- Decision-readiness: which scenarios actually change which decisions?
- Tail-risk framing and runway-impact transparency
- Black-swan posture vs business-as-usual stress
- "Write the bear case in three lines. What would have to be true, and is the model honest about it?"

**Margaret Whitman (Cost Center & Budget-Owner Liaison) reviews:**
- Budget realism vs theatrical compliance
- Owner accountability and "plan I committed to" vs "plan I was given"
- Cross-departmental dependencies that one budget hides from another
- Variance-explanation quality; surprise-anomaly hygiene
- Capacity plans (eng, sales, support) that match the activity plan
- "Pick a budget owner. Read their plan to me. Now ask them what they actually committed to."

### Step 4: CHALLENGE

1. **Padmaja vs Bjorn:** "The model output looks right" vs "The model output is right but the structure won't survive a question"
2. **Eduardo vs Bjorn:** "Base case is the plan" vs "Base case is the optimistic case in disguise; bear is the real one"
3. **Margaret vs Bjorn:** "Department heads endorsed this" vs "Department heads endorsed numbers they don't believe but couldn't fight"
4. **Eduardo vs Padmaja:** "Sensitivity flexes the right inputs" vs "Sensitivity hides the input where the real uncertainty lives"

### Step 5: CONVERGE

```markdown
## FP&A Panel Report

### Plan Credibility: [LOW / MEDIUM / HIGH]

### Driver / Narrative Findings
1. [Finding] — Risk to credibility. Fix.

### Model-Integrity Findings
1. [Finding] — Structural risk. Remediation.

### Scenario / Sensitivity Findings
1. [Finding] — Scenario weakness. Decision implication.

### Budget-Owner Findings
1. [Department] — Reality gap. Owner action.

### Recommended Pre-Board Refinements
1. ...

### Open Questions for CFO / CEO / Board
1. ...
```
