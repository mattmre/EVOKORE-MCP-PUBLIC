---
name: panel-security-threat-modeling
description: Expert panel for proactive threat modeling of new architectures, trust boundaries, and adversarial scenarios — distinct from post-implementation security-audit
aliases: [threat-modeling-panel, threat-model-panel, stride-panel, adversary-panel]
category: orchestration
tags: [threat-modeling, security, stride, adversarial, attack-tree, risk-modeling]
version: 1.0.0
requires: [panel-of-experts]
resolutionHints:
  - threat modeling for new system or feature
  - trust boundary analysis
  - attack tree construction
  - adversarial scenario planning
  - pre-implementation security design review
---

# Security Threat Modeling Panel

> **Distinction from `security-audit`:** the audit panel reviews implemented code against known issues. This panel reasons proactively about *what could go wrong* in a design before code exists. Use them in sequence: this panel first, audit panel after implementation.

## Panel Composition

| Expert | Role | Primary Lens |
|---|---|---|
| **Dr. Imani Nyong'o** | Threat Modeling Lead | STRIDE, trust boundaries, attack-tree construction, mitigation prioritization |
| **Felix Ostrowski** | Adversary Emulator | "How would I attack this?" — motivated-attacker reasoning across capabilities |
| **Dr. Rohan Mehta** | Risk Quantifier | Likelihood × impact estimation, FAIR-style framing, residual-risk transparency |
| **Sasha Ignatieva** | Insider-Threat & Abuse Specialist | Authorized-but-malicious actors, social engineering, governance loopholes |

See [expert-roster.md](../expert-roster.md) for full persona definitions.

## When to Invoke

- New system, service, or major architectural change before implementation
- Significant trust-boundary changes (new external integration, multi-tenancy, federation)
- New data class introduction (PII, PHI, payment, secrets)
- Authentication / authorization redesign
- Privileged-access tooling, admin consoles, internal automations
- Pre-implementation gate for anything an adversarial post-mortem would later cite

## Review Protocol

### Step 1: CONVENE — Select Active Experts

| Artifact Type | Active Experts |
|---|---|
| New system / service design | All 4 |
| External integration | Imani, Felix, Sasha |
| Internal admin tooling | Imani, Sasha, Rohan |
| Authentication redesign | Imani, Felix, Sasha |
| New data class introduction | Imani, Rohan, Sasha |

### Step 2: BRIEF — Present the Artifact

```
## Threat Modeling Target
- **Design:** [link to architecture / RFC]
- **Trust Boundaries:** [enumerated]
- **Data In Scope:** [classes, sensitivity, retention]
- **Actors:** [users, admins, services, third parties]
- **Pre-Existing Controls:** [what we lean on today]
- **Constraints:** [latency, regulatory, compatibility]
```

### Step 3: SOLO — Independent Expert Reviews

**Dr. Imani Nyong'o (Threat Modeling Lead) reviews:**
- Trust-boundary diagram completeness — are all crossings labeled with what flows across them?
- STRIDE pass per boundary: spoofing, tampering, repudiation, info disclosure, DoS, elevation
- Mitigation coverage: which threats are mitigated, which are accepted, which are unaddressed
- Defense-in-depth gaps; single points of failure
- Documentation: does the model survive being read 6 months later by someone new?
- "Walk me to every place data crosses a trust boundary. Tell me what authenticates each crossing."

**Felix Ostrowski (Adversary Emulator) reviews:**
- Plausible attacker capabilities at each tier (script kiddie → nation-state)
- Attack tree from each high-value goal: credential theft, privilege escalation, data exfil
- Cheapest attack path; weakest link
- Detection / response posture; blind spots
- Chained exploits across components
- "Give me a $5,000 budget and one quarter. What's my most successful campaign against this design?"

**Dr. Rohan Mehta (Risk Quantifier) reviews:**
- Likelihood estimation per threat (frequency × accessibility × motivation)
- Impact estimation (data, financial, reputational, regulatory, operational)
- Residual risk after proposed controls; explicit acceptance vs implicit acceptance
- Risk concentration — where does a single failure cascade into many losses?
- Comparability across threats; consistent scoring rubric
- "Rank the top ten threats by expected annualized loss. Defend the ranking."

**Sasha Ignatieva (Insider-Threat & Abuse Specialist) reviews:**
- Authorized actors who could abuse access (employees, contractors, partners)
- Separation of duties, least privilege, just-in-time access posture
- Audit trail integrity against the people who could mute it
- Social engineering surfaces (helpdesk, password reset, account recovery)
- Policy / process gaps that make abuse plausibly deniable
- "If I am a disgruntled engineer with current valid access, what's the worst harm I can cause and how long until anyone notices?"

### Step 4: CHALLENGE

1. **Felix vs Imani:** "I have a working attack chain" vs "The threat model says this chain is acceptable"
2. **Rohan vs Felix:** "That attack is theoretical" vs "I have produced PoCs for theoretical attacks before"
3. **Sasha vs Imani:** "External-actor STRIDE is fine; the model ignores insiders" vs "Insider threat is out of scope"
4. **Imani vs Rohan:** "We must add this control" vs "The control's cost exceeds the modeled risk"

### Step 5: CONVERGE

```markdown
## Security Threat Modeling Panel Report

### Threat Model Maturity: [INSUFFICIENT / ADEQUATE / STRONG]

### Critical Threats (Must Mitigate Before Build)
1. [Threat] — Boundary: [where]. Adversary: [who]. Mitigation: [proposed].

### High-Risk Threats (Mitigate or Explicitly Accept)
1. [Threat] — Likelihood: [low/med/high]. Impact: [low/med/high/critical]. Decision: [mitigate / accept / monitor].

### Insider / Abuse Threats
1. [Threat] — Actor class: [who has this access]. Control: [proposal].

### Open Threats (Acknowledged, Unmitigated)
1. [Threat] — Reason for acceptance: [rationale]. Review trigger: [when to revisit].

### Recommended Implementation Sequencing
1. ...

### Inputs to Downstream Security-Audit Panel
1. ...
```
