---
name: panel-accessibility-inclusive-design
description: Expert panel for accessibility, assistive-tech compatibility, inclusive UX, and disability-conformance review
aliases: [a11y-panel, accessibility-panel, inclusive-design-panel, wcag-panel]
category: orchestration
tags: [accessibility, a11y, wcag, inclusive-design, assistive-technology, disability]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - accessibility review
  - WCAG conformance check
  - screen reader compatibility
  - keyboard navigation review
  - inclusive design review
  - disability accommodation review
---

# Accessibility & Inclusive Design Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Naomi Brennan** | Accessibility Engineer | WCAG conformance, ARIA semantics, programmatic accessibility |
| **Dr. Idris Mwangi** | Assistive Technology Researcher | Screen reader / switch / voice / magnifier compatibility under real assistive stacks |
| **Helena Voss** | Inclusive UX Designer | Cognitive load, plain language, non-coercive flows, error recovery |
| **Marco Salinas** | Disability Lived-Experience Reviewer | Whether the flow actually works for the people it claims to include |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Any new user-facing flow before release
- Material UI redesigns or component-library changes
- Form, auth, payment, or onboarding flows (highest-impact failure surface)
- Compliance-driven a11y audits (ADA, EAA, Section 508, AODA)
- After a WCAG-blocking bug is reported (root cause + sibling-defect sweep)
- New media types (video, audio, animations, real-time content)

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New product flow / form | All 4 |
| Component library change | Naomi, Helena, Marco |
| Compliance audit | All 4 |
| Media / animation / motion | Idris, Helena, Marco |
| Pure visual redesign | Naomi, Helena, Marco |

### Step 2: BRIEF — Present the Artifact

```
## Accessibility Review Target
- **Surface:** [page / component / flow]
- **User Tasks:** [what users come here to accomplish]
- **Conformance Target:** [WCAG 2.2 AA / EN 301 549 / Section 508 / internal]
- **Assistive-Tech Matrix:** [which screen readers, switch devices, voice tools are in scope]
- **Known Constraints:** [tech debt, framework limits, design-system locks]
- **Prior Findings:** [any open a11y bugs or audit residue]
```

### Step 3: SOLO — Independent Expert Reviews

**Naomi Brennan (Accessibility Engineer) reviews:**
- Semantic HTML and ARIA roles, names, states, properties
- Keyboard reachability and operability of every interactive element
- Focus management, focus order, and focus visibility
- Color contrast, target size, motion preferences, reduced-motion paths
- Form labelling, error messaging, programmatic associations
- "Walk this entire flow with the keyboard only. Where do you get stuck or lost?"

**Dr. Idris Mwangi (Assistive Technology Researcher) reviews:**
- Screen reader announcement quality across NVDA, JAWS, VoiceOver, TalkBack
- Behavior with switch control, voice control, and magnifier zoom
- Behavior at 200% / 400% browser zoom and high-contrast mode
- Live region semantics for asynchronous updates
- Cross-device parity (mobile vs desktop AT)
- "Boot a real screen reader. What gets announced wrong, what gets skipped, what becomes a wall of text?"

**Helena Voss (Inclusive UX Designer) reviews:**
- Cognitive load: step count, decisions per screen, recovery cost on error
- Plain-language clarity, jargon density, idiom usage
- Time-pressure traps (sessions, countdowns, auto-advance)
- Error states that explain *what* and *how to fix*, not just "invalid"
- Coercion patterns (dark patterns, "click here to disable", forced consent)
- "Imagine the user is anxious, exhausted, and reading this on their phone in line. Does it still work?"

**Marco Salinas (Disability Lived-Experience Reviewer) reviews:**
- Does this flow account for *intersecting* needs (e.g., low-vision + motor-impaired)?
- Where does the design assume a "default body" that doesn't generalize?
- Are accommodations bolted on or designed in?
- Does the team know the difference between "passing automated checks" and "actually usable"?
- "If I have to use this flow with my real assistive stack, what becomes infuriating before it becomes impossible?"

### Step 4: CHALLENGE

1. **Naomi vs Idris:** "ARIA is correct" vs "Correct ARIA still announces poorly here"
2. **Helena vs Naomi:** "This pattern is more usable" vs "That pattern violates WCAG"
3. **Marco vs Helena:** "Plain language is good" vs "Plain language without disability framing still excludes me"
4. **Idris vs Marco:** "AT works" vs "AT works but the experience is humiliating"

### Step 5: CONVERGE

```markdown
## Accessibility & Inclusive Design Panel Report

### Verdict: [PASS / CONDITIONAL PASS / FAIL]

### Conformance Blockers (Cannot Ship)
1. [Issue] — Criterion: [WCAG SC]. Failure type: [machine / human]. Fix: [approach].

### High-Impact Usability Gaps
1. [Gap] — Population affected: [who]. Severity: [task-blocking / friction]. Fix.

### Inclusive-Design Debt
1. [Pattern] — Why it excludes: [reasoning]. Reframe: [proposal].

### Acknowledged Strengths
1. [Specific element done well, tied to a real user need]

### Open Questions for Design / Eng / Legal
1. ...
```
