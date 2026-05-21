---
name: panel-licensing-open-source-compliance
description: Expert panel for open-source license review, copyleft exposure, attribution hygiene, and SBOM/supply-chain license posture
aliases: [licensing-panel, oss-compliance-panel, license-panel, sbom-license-panel]
category: orchestration
tags: [licensing, open-source, oss, copyleft, attribution, sbom, ip, compliance]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - open source license review
  - copyleft exposure analysis
  - attribution / NOTICE file audit
  - new dependency license check
  - SBOM license posture review
---

# Licensing & Open-Source Compliance Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Petra Lindqvist** | OSS License Counsel | License interpretation, copyleft scope, distribution-trigger analysis |
| **Dr. Wesley Park** | OSS Program Office Lead | Approval workflow, policy enforcement, contributor-license-agreement hygiene |
| **Tariq Bensaid** | SBOM / Supply-Chain Auditor | Dependency-graph license inventory, SBOM accuracy, transitive exposure |
| **Hilda Ottosson** | Attribution & Notice Engineer | NOTICE generation, runtime/install-time disclosures, license-text completeness |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- Adding a meaningfully different license class (e.g., first GPL/AGPL, first commercial, first SSPL/Elastic License)
- Major dependency-tree changes (framework swap, vendoring)
- Pre-distribution review for a release that ships binaries, containers, or SDKs
- Acquisition / due-diligence preparation
- After a license-related notice or claim
- Periodic SBOM and NOTICE-file freshness audit

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New license class introduction | All 4 |
| Pre-release distribution audit | Petra, Tariq, Hilda |
| OSS-program policy update | Petra, Wesley, Hilda |
| Dep-tree replacement | Tariq, Petra, Hilda |
| Acquisition due-diligence | All 4 |

### Step 2: BRIEF — Present the Artifact

```
## Licensing Review Target
- **Distribution Form:** [SaaS / on-prem / SDK / container / mobile]
- **Dependency Manifest:** [link to lockfile / SBOM]
- **New / Changed Dependencies:** [list]
- **License Mix:** [summary by category — permissive, weak copyleft, strong copyleft, network copyleft, commercial]
- **Distribution Triggers:** [what counts as "distribution" for this product]
- **Open Issues:** [unresolved license questions, customer redlines]
```

### Step 3: SOLO — Independent Expert Reviews

**Petra Lindqvist (OSS License Counsel) reviews:**
- License classification and interpretation per dependency
- Copyleft trigger analysis (linking, modification, distribution, network use)
- Compatibility matrix among bundled licenses
- Patent-grant clauses, termination clauses, defensive-termination language
- Custom / non-OSI licenses and their actual constraints
- "If this product were enjoined under the strictest plausible reading of one of its licenses, which dependency, and what would we have to remove?"

**Dr. Wesley Park (OSS Program Office Lead) reviews:**
- Approval workflow coverage — was every new dep reviewed?
- Policy clarity (what's auto-approved, what needs counsel, what is denied)
- CLA / DCO posture for inbound and outbound contributions
- Internal-use vs distributed-use distinctions in policy
- Training, tooling, and developer friction at the approval gate
- "Pick five recently merged PRs that added a dependency. Show me the approval trail."

**Tariq Bensaid (SBOM / Supply-Chain Auditor) reviews:**
- SBOM completeness and accuracy (direct + transitive)
- License-field coverage; declared vs detected license drift
- Components without resolvable licenses; ambiguous bundling
- Stale / abandoned dependencies and their license risk
- Vendored / forked code with severed upstream license trails
- "Diff today's SBOM against the last release's. What licenses appeared, and which transitive paths added them?"

**Hilda Ottosson (Attribution & Notice Engineer) reviews:**
- NOTICE / THIRD-PARTY-LICENSES file completeness and freshness
- Runtime / install-time disclosure mechanism (in-app, in-installer, in-docs)
- License-text inclusion vs reference-by-link
- Per-build NOTICE generation reproducibility
- Attribution gaps for vendored, forked, or copy-pasted snippets
- "Open the running product. Show me where a user can read the full attribution list with all license texts."

### Step 4: CHALLENGE

1. **Petra vs Tariq:** "The license is acceptable" vs "The detected license disagrees with the declared one — which do we trust?"
2. **Wesley vs Petra:** "Policy says reject, but counsel approved a one-off" vs "Approving exceptions without recording rationale erodes the policy"
3. **Hilda vs Tariq:** "The SBOM lists 1200 packages" vs "The NOTICE file lists 800 — explain the gap"
4. **Petra vs Wesley:** "The CLA covers this contribution" vs "The CLA is from 2014 and doesn't cover modern license shifts"

### Step 5: CONVERGE

```markdown
## Licensing & OSS Compliance Panel Report

### Verdict: [PASS / CONDITIONAL PASS / FAIL]

### Distribution Blockers
1. [Issue] — Dependency. License. Reason it blocks. Resolution path.

### Copyleft / Network-Copyleft Exposure
1. [Component] — Trigger condition. Current posture. Recommended action.

### SBOM / Attribution Drift
1. [Gap] — Detected vs declared. Fix.

### NOTICE / Disclosure Gaps
1. [Gap] — User-visible surface. Fix.

### Policy / Workflow Findings
1. [Finding]

### Open Questions for Legal
1. ...
```
