# Security Policy

EVOKORE-MCP is a hobby / personal project. Security reports are taken
seriously and handled on a best-effort basis by a single maintainer.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.1.x   | :white_check_mark: |
| < 3.1   | :x:                |

Only the latest `3.1.x` release line receives security fixes. Earlier
versions, pre-release tags, and unreleased branches are not in scope.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Use GitHub's private vulnerability reporting:

> <https://github.com/mattmre/EVOKORE-MCP-PUBLIC/security/advisories/new>

When reporting, please include:

- A description of the vulnerability.
- Steps to reproduce (a minimal proof-of-concept is ideal).
- The affected file(s) and version / commit SHA.
- Your assessment of the impact (information disclosure, RCE, privilege
  escalation, etc.).
- Any suggested remediation, if you have one.

## Disclosure Timeline

- **Acknowledgement:** within **7 days** of receipt.
- **Triage and assessment:** within **14 days**.
- **Fix target:**
  - **Critical** (RCE, credential exposure, sandbox escape): within
    **30 days**.
  - **High:** within **60 days**.
  - **Medium / Low:** scheduled into the next minor release.
- **Public disclosure:** coordinated with the reporter; default is to publish
  the advisory after a fix is released.

These are targets, not contractual commitments. Best effort applies.

## Scope

### In scope

- The TypeScript source in `src/` and its compiled output in `dist/`.
- The hook entrypoints under `scripts/hooks/`.
- Configuration parsing (`mcp.config.json`, `damage-control-rules.yaml`,
  `permissions.yml`, `voices.json`).
- The HTTP transport (`HttpServer`, `SessionIsolation`, `OAuthProvider`,
  `WebhookManager`) when EVOKORE is run with `--http`.
- The plugin loader (`PluginManager`) and the skill execution sandbox
  (`execute_skill`).

### Out of scope

The following are **intentional design choices**, documented behaviors, or
known limitations — they are **not vulnerabilities**:

- **`dangerouslySkipPermissions: true` in `.claude/settings.json`.** This is
  an EVOKORE convention. The Claude Code permissions prompt is intentionally
  disabled at the Claude Code layer because EVOKORE provides its own
  permission and damage-control surface (`damage-control-rules.yaml`,
  HITL approval tokens, `RBAC` roles, the `purpose-gate` hook). Reports that
  amount to *"this flag is set and Claude Code does not prompt the user"* will
  be closed as not-a-vulnerability. See the project README for the rationale.
- **Vendored upstream submodules under `SKILLS/`** (Anthropic Cookbook,
  claude-skills-mcp, modelcontextprotocol/servers, mattpocock/skills).
  Report upstream vulnerabilities to the upstream project. We will track
  pinned-SHA updates but are not the upstream maintainer.
- **Third-party MCP child servers** configured in `mcp.config.json` (GitHub,
  Supabase, ElevenLabs, filesystem, etc.). Report these to their respective
  maintainers.
- **The voice sidecar** (`VoiceSidecar.ts`) when run on a non-loopback
  interface. It is documented to bind `ws://localhost:8888` by design;
  exposing it on a public interface is out of scope.
- **Self-XSS or social-engineering attacks** that require the operator to
  paste an attacker-controlled string into their own terminal or
  configuration file.
- **Denial-of-service** against an EVOKORE instance from a client that has
  already been granted tool-invocation access. The trust boundary is the
  client connection; an authenticated client can already invoke tools.

If you are unsure whether a finding is in scope, file the private advisory
anyway — it is easier to close it as out-of-scope than to miss a real issue.

## Safe Harbor

We will not pursue civil or criminal action against good-faith security
researchers who:

- Make a reasonable effort to avoid privacy violations, destruction of data,
  and service interruption.
- Give us a reasonable opportunity to fix the issue before public disclosure.
- Do not exfiltrate data beyond what is necessary to demonstrate the
  vulnerability.

Thank you for helping keep EVOKORE-MCP and its users safe.
