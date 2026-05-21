---
name: panel-internationalization-localization
description: Expert panel for internationalization architecture, localization workflow, and cross-locale UX
aliases: [i18n-panel, l10n-panel, localization-panel, internationalization-panel]
category: orchestration
tags: [i18n, l10n, localization, internationalization, translation, locale, cultural-adaptation]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - i18n review
  - localization review
  - translation pipeline review
  - locale-specific bug investigation
  - new market / language launch review
---

# Internationalization & Localization Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Yuki Tanaka** | i18n Architect | Locale-aware architecture, ICU MessageFormat, Unicode correctness |
| **Adriana Costa** | Localization Program Lead | TMS pipeline, translator workflow, in-context QA, release cadence |
| **Hassan Mubarak** | Cultural Adaptation Specialist | Beyond-translation: imagery, color, metaphor, taboo, regulatory tone |
| **Lena Eriksdottir** | Multilingual QA Lead | String expansion, RTL, IME, date/number/address formatting failures |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- New language or market launch
- Foundational i18n architecture (string extraction, locale routing, fallback chains)
- Bidirectional / RTL support introduction or expansion
- Audit before a multilingual release
- After a locale-specific bug spike
- New product surface that introduces user-generated content with cross-locale flows

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New language / market launch | All 4 |
| i18n framework adoption | Yuki, Adriana, Lena |
| Cultural / brand adaptation | Adriana, Hassan, Lena |
| Bug-spike root cause | Yuki, Lena, Adriana |
| Translation workflow change | Adriana, Hassan, Lena |

### Step 2: BRIEF — Present the Artifact

```
## i18n / l10n Review Target
- **Surface:** [page / API / pipeline / build]
- **Locales In Scope:** [list]
- **String Volume:** [count, churn rate]
- **TMS / Tooling:** [stack]
- **Known Issues:** [open locale bugs, fallback gaps]
- **Constraint:** [release timeline, market commitments]
```

### Step 3: SOLO — Independent Expert Reviews

**Yuki Tanaka (i18n Architect) reviews:**
- String externalization completeness; hardcoded strings, image text, alt text
- ICU MessageFormat usage — plurals, gender, ordinals, selects
- Unicode handling: normalization, sorting, casing across locales
- Locale negotiation and fallback chain design
- Pluralization rule coverage (CLDR plural categories)
- "Pull a random translated string at runtime. Can you trace exactly how it got rendered for this user?"

**Adriana Costa (Localization Program Lead) reviews:**
- TMS integration: extraction cadence, branch handling, segment reuse
- Translator context: in-context preview, screenshots, glossaries, do-not-translate lists
- QA pipeline: pseudo-localization, missing-translation handling, machine-translation fallback policy
- Release alignment: what ships when locales lag, who decides
- Cost and turnaround posture vs product roadmap
- "When the engineering team ships on Friday, what is the translator's Monday actually like?"

**Hassan Mubarak (Cultural Adaptation Specialist) reviews:**
- Imagery, iconography, color symbolism, gesture taboos by locale
- Metaphors, idioms, humor that don't translate or land badly
- Sensitive subjects: politics, religion, gender, family structures
- Regulatory tone (e.g., financial disclaimers, medical claims by jurisdiction)
- Brand voice consistency vs cultural register
- "If a culturally fluent native reader encountered this, what would feel slightly off — and what would feel offensive?"

**Lena Eriksdottir (Multilingual QA Lead) reviews:**
- String length expansion (German +30%, Finnish, Russian) and layout overflow
- RTL bidirectional rendering, mirrored UI, mixed LTR/RTL content
- IME behavior for CJK and other complex-input locales
- Date, time, number, currency, address, phone formatting per locale
- Search, sort, filter behavior with non-Latin scripts
- "Take the longest German translation and the most complex Arabic mixed-content string. Where does the layout break?"

### Step 4: CHALLENGE

1. **Yuki vs Adriana:** "The architecture is correct" vs "The architecture is correct but the translators can't work in it"
2. **Lena vs Yuki:** "Layouts are breaking in Finnish" vs "The strings are stored correctly; the problem is downstream"
3. **Hassan vs Adriana:** "This translation is technically accurate" vs "Technically accurate isn't culturally landed"
4. **Adriana vs Lena:** "We need to ship now and patch translations later" vs "Patching after release damages trust in the locale"

### Step 5: CONVERGE

```markdown
## Internationalization & Localization Panel Report

### Verdict: [PASS / CONDITIONAL PASS / FAIL]

### i18n Architecture Findings
1. [Finding] — Surface: [where]. Failure mode: [what breaks at scale].

### Localization Workflow Findings
1. [Finding] — TMS / process step: [where]. Cost: [translator hours / release delay].

### Cultural Adaptation Findings
1. [Finding] — Locale: [which]. Risk: [confusion / offense / regulatory].

### QA / Layout Findings
1. [Finding] — Locale: [which]. Repro: [steps].

### Recommended Locale Launch Order
1. ...

### Open Questions for Product / Marketing
1. ...
```
