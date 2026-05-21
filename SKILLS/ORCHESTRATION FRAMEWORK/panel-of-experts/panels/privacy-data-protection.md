---
name: panel-privacy-data-protection
description: Expert panel for privacy-by-design, data-protection law compliance, consent architecture, and data-subject rights operationalization
aliases: [privacy-panel, data-protection-panel, gdpr-panel, dpia-panel]
category: orchestration
tags: [privacy, data-protection, gdpr, ccpa, hipaa, dpia, consent, data-subject-rights]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - privacy review or DPIA
  - data-protection law compliance
  - consent architecture review
  - data-subject rights audit
  - cross-border data transfer review
  - new data collection / processing review
---

# Privacy & Data Protection Panel

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Dr. Aoife Brennan** | Privacy Engineer | Privacy-by-design, data-flow mapping, minimization, retention enforcement |
| **Esra Demir** | Data Protection Officer | Lawful-basis selection, DPIA execution, regulator-facing posture |
| **Jin-Soo Park** | Cross-Border Transfer Specialist | International data flows, transfer mechanisms, adequacy decisions |
| **Marcus Whitfield** | Data-Subject Rights Operator | DSAR fulfilment, deletion, portability, the operational reality of rights |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- New data collection, processing purpose, or recipient
- New product surface that touches identifiable information
- Cross-border data transfer (new region, new vendor, new sub-processor)
- Pre-launch privacy review (DPIA / PIA)
- After a regulator inquiry or DSAR backlog
- Material changes to retention, consent, or sharing posture

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New product surface | All 4 |
| Vendor / sub-processor onboarding | Esra, Jin-Soo, Aoife |
| DSAR backlog / process redesign | Marcus, Aoife, Esra |
| Cross-border architecture | Jin-Soo, Esra, Aoife |
| Consent / cookie redesign | Aoife, Esra, Marcus |

### Step 2: BRIEF — Present the Artifact

```
## Privacy Review Target
- **Surface / Process:** [what is being reviewed]
- **Data Categories:** [PII, PHI, payment, sensitive special-category]
- **Subjects:** [who: customers, employees, prospects, children]
- **Purposes:** [each distinct processing purpose]
- **Lawful Bases:** [proposed per purpose]
- **Recipients:** [internal, processors, third parties]
- **Jurisdictions:** [data subject locations and storage locations]
```

### Step 3: SOLO — Independent Expert Reviews

**Dr. Aoife Brennan (Privacy Engineer) reviews:**
- Data-flow map: collection points, internal joins, recipients, deletion paths
- Minimization: is each field necessary for the stated purpose?
- Pseudonymization, encryption-at-rest/in-transit, key segregation
- Retention enforcement: technical mechanism, not just policy
- Logging hygiene — does telemetry recreate the dataset we're trying to protect?
- "Show me the row of personal data and trace it to deletion. Where does it actually disappear, and where does a copy live forever?"

**Esra Demir (Data Protection Officer) reviews:**
- Lawful basis per purpose under GDPR / equivalent regimes
- Consent quality (specific, informed, freely given, withdrawable) where consent is the basis
- DPIA threshold and adequacy of completed DPIA
- Records of processing accuracy and freshness
- Regulator-facing narrative: can the team defend this design in writing in 24 hours?
- "If a regulator opens an inquiry tomorrow, what's the strongest line of attack on this design and what's our best defense?"

**Jin-Soo Park (Cross-Border Transfer Specialist) reviews:**
- Where data physically moves and where it logically lives
- Transfer mechanisms: adequacy decisions, SCCs, BCRs, derogations
- Sub-processor chain visibility and enforcement
- Onward-transfer contractual coverage
- Transfer-impact assessments where required (Schrems II posture)
- "Pick a row of data. Tell me every country it touches and the legal mechanism that authorizes each hop."

**Marcus Whitfield (Data-Subject Rights Operator) reviews:**
- DSAR intake, identity verification, response SLA reality
- Deletion completeness across primary stores, backups, caches, vendors
- Portability format quality and machine-readability
- Objection / restriction / rectification mechanics
- Operational drag: how many engineering hours per request today?
- "A user submits a deletion request right now. Walk me through the next 30 days from intake to attestation."

### Step 4: CHALLENGE

1. **Aoife vs Esra:** "The technical control is sufficient" vs "Without the policy and contract, the control is unenforceable"
2. **Jin-Soo vs Esra:** "The transfer is on SCCs" vs "SCCs alone don't survive the local-law analysis"
3. **Marcus vs Aoife:** "Privacy-by-design ships" vs "Privacy-by-design without DSAR tooling means we cannot honor a deletion in under 90 days"
4. **Esra vs Marcus:** "Legitimate-interest is the lawful basis" vs "Legitimate-interest puts the operational burden on us when subjects object — are we ready?"

### Step 5: CONVERGE

```markdown
## Privacy & Data Protection Panel Report

### Verdict: [PASS / CONDITIONAL PASS / FAIL]

### Lawful-Basis Findings
1. [Purpose] — Proposed basis: [X]. Adequacy: [strong / contested / inadequate].

### Data-Flow / Minimization Findings
1. [Flow] — Issue. Fix.

### Cross-Border Transfer Findings
1. [Hop] — Mechanism. Risk. Mitigation.

### Data-Subject Rights Findings
1. [Right] — Current SLA. Gap. Tooling needed.

### DPIA Outcome
- Required? [yes/no]. Status. Residual-risk acceptance owner.

### Open Questions for Legal / Product / Eng
1. ...
```
