# Support

EVOKORE-MCP is a personal / hobby project maintained in spare time. There is
no SLA, no paid support tier, and no on-call rotation. Please read this page
before opening a question or bug report — it will save everyone time.

## Where to ask

| You want to...                                          | Use this                                                                                                              |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Ask how to use a feature, configure a child server, or  | **[Discussions](https://github.com/mattmre/EVOKORE-MCP-PUBLIC/discussions)** (Q&A category)                           |
| understand the architecture                             |                                                                                                                       |
| Report a reproducible bug in EVOKORE itself             | **[Issues](https://github.com/mattmre/EVOKORE-MCP-PUBLIC/issues)** with the bug-report form                           |
| Propose a new feature or design change                  | **[Issues](https://github.com/mattmre/EVOKORE-MCP-PUBLIC/issues)** with the feature-request form                      |
| Report a security vulnerability                         | **[Private advisory](https://github.com/mattmre/EVOKORE-MCP-PUBLIC/security/advisories/new)** — see [SECURITY.md]     |
| Discuss roadmap, share what you built, show-and-tell    | **[Discussions](https://github.com/mattmre/EVOKORE-MCP-PUBLIC/discussions)** (Show and tell / Ideas categories)       |

[SECURITY.md]: ./SECURITY.md

**Default to Discussions for anything that is not a confirmed bug or a
concrete feature request.** Issues are a tracking surface, not a forum.

## What NOT to file as a bug

The following are **not bugs** and will be redirected to Discussions or
closed as not-planned:

- *"How do I configure X?"* — that is a usage question. Discussions Q&A.
- *"It didn't work for me but I can't reproduce it."* — without a minimal
  reproducible example, there is nothing to fix. Discussions first; reopen
  as an issue once you have a repro.
- *"This upstream package / MCP child server is broken."* — file it with the
  upstream maintainer. EVOKORE proxies many third-party servers but is not
  their maintainer.
- *"Claude Code does not prompt me before destructive tools."* — that is the
  documented behavior of `dangerouslySkipPermissions: true`. See the README
  rationale and `SECURITY.md` scope section. Not a vulnerability, not a bug.
- *"Damage-control blocked a command I ran."* — that is the hook doing its
  job. If you genuinely believe the rule is wrong, file a feature request
  proposing a specific rule patch in `damage-control-rules.yaml`.
- *"The CI badge is red / yellow / missing."* — Actions billing is
  intentionally unfunded for this repo. Local `npx vitest run` is the
  canonical validation gate. Not a bug.
- *"This feature exists in the internal repo but not here."* — the public
  mirror is curated. Some internal-only tooling is intentionally excluded.
  File a feature request if you want a specific piece ported.

## Response expectations

- **Best-effort only.** This project is maintained on personal time. There
  is no guaranteed response time for non-security issues.
- **Security advisories** target a 7-day acknowledgement window (see
  [SECURITY.md]).
- **Pull requests** with a clear description, passing local tests, and a
  small focused scope are far more likely to be merged than large
  speculative refactors. See [CONTRIBUTING.md](./CONTRIBUTING.md).
- **Discussions** are not monitored as closely as issues. If a Discussion
  turns out to be a confirmed bug, you may file an issue and link back to
  the Discussion.
- **Triage may take days or weeks.** No response does not mean rejection —
  it usually means the maintainer has not gotten to it yet. A polite ping
  after two weeks is fine.

## Commercial support

There is no commercial support offering for EVOKORE-MCP. If you need
production-grade support for an MCP-based system, look at vendor-maintained
options instead of a hobby project.

## Acknowledgements

EVOKORE-MCP is built on top of a stack of excellent open-source projects:
the [Model Context Protocol](https://modelcontextprotocol.io/), the
[Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript), the
[Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook), and
many more. Their maintainers do not owe you support either — please be kind
when filing issues anywhere.
