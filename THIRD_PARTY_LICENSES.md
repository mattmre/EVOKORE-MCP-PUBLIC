# Third-Party Licenses

EVOKORE-MCP vendors code, prompts, and skill packs from several upstream projects. Each section below records the source repository, the commit pinned into this distribution (where applicable), the upstream license, the copyright holder as stated by the upstream, and the path inside this repository where the vendored material lives. We are grateful to the original authors.

The MIT License text reproduced once at the bottom of this file applies to every section marked "MIT". The Apache License, Version 2.0 governs every section marked "Apache-2.0"; its full text lives at <https://www.apache.org/licenses/LICENSE-2.0>. Sections that reference a license stored alongside the vendored material link to that file directly.

EVOKORE-MCP's own code is licensed under the MIT License — see [`LICENSE`](LICENSE).

---

## Table of contents

1. [anthropics/anthropic-cookbook](#anthropicsanthropic-cookbook)
2. [K-Dense-AI/claude-skills-mcp](#k-dense-aiclaude-skills-mcp)
3. [modelcontextprotocol/servers](#modelcontextprotocolservers)
4. [mattpocock/skills](#mattpocockskills)
5. [Anthropic Skills (Apache-2.0 cohort)](#anthropic-skills-apache-20-cohort)
6. [wshobson/agents (WSHOBSON PLUGINS)](#wshobsonagents-wshobson-plugins)
7. [aden-hive/hive (HIVE FRAMEWORK)](#aden-hivehive-hive-framework)
8. [Full MIT License text](#full-mit-license-text)
9. [Apache-2.0 and CC-BY-4.0](#apache-20-and-cc-by-40)
10. [EVOKORE-MCP's own code](#evokore-mcps-own-code)

---

## anthropics/anthropic-cookbook

- **Source:** <https://github.com/anthropics/anthropic-cookbook>
- **Pinned commit:** `88a73996fdc2cf4552c4f2f0fc2b1d90bc885cab`
- **License:** MIT — see [`SKILLS/ANTHROPIC COOKBOOK/LICENSE`](SKILLS/ANTHROPIC%20COOKBOOK/LICENSE)
- **Copyright:** Copyright (c) 2023 Anthropic
- **Path in this repo:** `SKILLS/ANTHROPIC COOKBOOK/`
- **Notes:** Vendored as plain files in this distribution (the internal repository tracks the same tree as a git submodule). Used as reference cookbook content alongside EVOKORE skills.

## K-Dense-AI/claude-skills-mcp

- **Source:** <https://github.com/K-Dense-AI/claude-skills-mcp>
- **Pinned commit:** `6238e705f9591b220d84661df4739707a7d7eb21` (tagged `v1.0.6-4-g6238e70` upstream)
- **License:** MIT — see [`SKILLS/MCP WRAPPERS/claude-skills-mcp/LICENSE`](SKILLS/MCP%20WRAPPERS/claude-skills-mcp/LICENSE)
- **Copyright:** Copyright (c) 2025 K-Dense Inc.
- **Path in this repo:** `SKILLS/MCP WRAPPERS/claude-skills-mcp/`
- **Notes:** Reference MCP wrapper for the broader Anthropic Skills surface. Vendored as plain files in this distribution.

## modelcontextprotocol/servers

- **Source:** <https://github.com/modelcontextprotocol/servers>
- **Pinned commit:** `0e0697902816a7bcc92a5577cedae3d1f5302f01`
- **License:** **Apache License, Version 2.0** (project default for new contributions) **with**:
  - **MIT License** for legacy contributions whose authors have not relicensed (Copyright (c) 2024-2025 Model Context Protocol a Series of LF Projects, LLC.), and
  - **Creative Commons Attribution 4.0 International (CC-BY-4.0)** for documentation that is not part of a specification.
  - See [`SKILLS/OFFICIAL MCP SERVERS/LICENSE`](SKILLS/OFFICIAL%20MCP%20SERVERS/LICENSE) for the authoritative tri-license preamble and full text.
- **Copyright:** Model Context Protocol a Series of LF Projects, LLC, and contributors.
- **Path in this repo:** `SKILLS/OFFICIAL MCP SERVERS/`
- **Notes:** Reference repository of officially curated MCP servers. Vendored as plain files in this distribution. The Apache-2.0 NOTICE and copyright headers of individual servers are preserved in the vendored tree.

## mattpocock/skills

- **Source:** <https://github.com/mattpocock/skills>
- **Pinned commit:** `90ea8eec03d4ae8f43427aaf6fe4722653561a42`
- **Fetched date:** 2026-04-27
- **License:** MIT — authoritative copy at `SKILLS/upstream/mattpocock-skills/LICENSE` in the original submodule
- **Copyright:** Copyright (c) 2026 Matt Pocock
- **Path in this repo:** `SKILLS/upstream/mattpocock-skills/` (submodule pointer; vendored content not bundled in this public distribution) and the adapter SKILL.md files that reference this upstream — see below
- **Adapter ports inside this repo (all carry `upstream:` / `upstream-sha:` / `upstream-path:` provenance frontmatter):**
  - [`SKILLS/COMMUNICATION/zoom-out/SKILL.md`](SKILLS/COMMUNICATION/zoom-out/SKILL.md)
  - [`SKILLS/CONTEXT/ubiquitous-language/SKILL.md`](SKILLS/CONTEXT/ubiquitous-language/SKILL.md)
  - [`SKILLS/ARCHITECTURE/improve-codebase-architecture/SKILL.md`](SKILLS/ARCHITECTURE/improve-codebase-architecture/SKILL.md)
  - [`SKILLS/PLANNING/to-prd/SKILL.md`](SKILLS/PLANNING/to-prd/SKILL.md)
  - [`SKILLS/PLANNING/to-issues/SKILL.md`](SKILLS/PLANNING/to-issues/SKILL.md)
  - [`SKILLS/QA/triage-bug/SKILL.md`](SKILLS/QA/triage-bug/SKILL.md)
  - [`SKILLS/PROJECT MANAGEMENT/github-triage/SKILL.md`](SKILLS/PROJECT%20MANAGEMENT/github-triage/SKILL.md)
  - [`SKILLS/DEVELOPER TOOLS/setup-pre-commit/SKILL.md`](SKILLS/DEVELOPER%20TOOLS/setup-pre-commit/SKILL.md)
  - [`SKILLS/ORCHESTRATION FRAMEWORK/panel-of-experts/panels/design-an-interface.md`](SKILLS/ORCHESTRATION%20FRAMEWORK/panel-of-experts/panels/design-an-interface.md)
  - The `tdd` and `git-guardrails` techniques are folded into EVOKORE workflows; their upstream attribution lives in each consuming SKILL.md.
- **Notes:** EVOKORE-MCP authored adapter SKILL.md shells in its own category directories rather than editing the upstream submodule. Adapter bodies substitute upstream user-loops for autonomous artifact reads (replay/evidence JSONL, `nav_get_map`). See the `## Adapted From Upstream` and `## EVOKORE-Specific Adaptations` sections in each adapter for the boundary between upstream content and EVOKORE additions, and the project root `NOTICE` for the authoritative upstream attribution block.

## Anthropic Skills (Apache-2.0 cohort)

Several skill directories in EVOKORE-MCP are adopted or adapted from Anthropic's open skill release. Each carries its own `LICENSE.txt` (Apache-2.0) inside the skill directory.

- **Source:** Anthropic's openly-licensed skill releases (Apache-2.0).
- **License:** Apache License, Version 2.0 — full text at <https://www.apache.org/licenses/LICENSE-2.0>. Each skill's `LICENSE.txt` is the authoritative copy for that skill.
- **Copyright:** Copyright (c) Anthropic, PBC.
- **Paths in this repo (each ships its own `LICENSE.txt`):**
  - [`SKILLS/DEVELOPER TOOLS/skill-creator/`](SKILLS/DEVELOPER%20TOOLS/skill-creator/) — `LICENSE.txt`
  - [`SKILLS/DEVELOPER TOOLS/artifacts-builder/`](SKILLS/DEVELOPER%20TOOLS/artifacts-builder/) — `LICENSE.txt`
  - [`SKILLS/DEVELOPER TOOLS/mcp-builder/`](SKILLS/DEVELOPER%20TOOLS/mcp-builder/) — `LICENSE.txt`
  - [`SKILLS/DEVELOPER TOOLS/frontend-design/`](SKILLS/DEVELOPER%20TOOLS/frontend-design/) — `LICENSE.txt`
  - [`SKILLS/DEVELOPER TOOLS/webapp-testing/`](SKILLS/DEVELOPER%20TOOLS/webapp-testing/) — `LICENSE.txt`
  - [`SKILLS/AUTOMATION AND PRODUCTIVITY/brand-guidelines/`](SKILLS/AUTOMATION%20AND%20PRODUCTIVITY/brand-guidelines/) — `LICENSE.txt`
  - [`SKILLS/AUTOMATION AND PRODUCTIVITY/theme-factory/`](SKILLS/AUTOMATION%20AND%20PRODUCTIVITY/theme-factory/) — `LICENSE.txt`
  - [`SKILLS/AUTOMATION AND PRODUCTIVITY/slack-gif-creator/`](SKILLS/AUTOMATION%20AND%20PRODUCTIVITY/slack-gif-creator/) — `LICENSE.txt`
- **Notes:** EVOKORE-MCP has modified some of these skills to integrate with the EVOKORE runtime (e.g., `skill-creator` enforces EVOKORE's "Adapter Skill Provenance Fields" contract and ships a `baseline-allowlist.txt` for grandfathered skills). Modifications preserve the upstream Apache-2.0 license and copyright; see the `## EVOKORE-Specific Adaptations` sections within each affected SKILL.md when present.

## wshobson/agents (WSHOBSON PLUGINS)

- **Source:** <https://github.com/wshobson/agents>
- **Pinned commit:** `4bb47e9e` (8-char prefix recorded at vendor time on 2026-05-21)
- **License:** **MIT License** — full upstream text vendored at [`SKILLS/WSHOBSON PLUGINS/LICENSE`](SKILLS/WSHOBSON%20PLUGINS/LICENSE).
- **Copyright:** Copyright (c) 2024 Seth Hobson
- **Path in this repo:** `SKILLS/WSHOBSON PLUGINS/` (146 `SKILL.md` files across 33 categories).
- **Notes:** The LICENSE file in `SKILLS/WSHOBSON PLUGINS/LICENSE` is the authoritative upstream MIT license for this vendored tree. Pinned commit was the upstream HEAD on 2026-05-21 (`4bb47e9e`). Per the MIT License, the copyright notice and permission notice must be retained in all copies or substantial portions of the Software.

## aden-hive/hive (HIVE FRAMEWORK)

- **Source:** <https://github.com/aden-hive/hive>
- **Pinned commit:** `b993d886` (8-char prefix recorded at vendor time on 2026-05-21)
- **License:** **Apache License, Version 2.0** — full upstream text vendored at [`SKILLS/HIVE FRAMEWORK/LICENSE`](SKILLS/HIVE%20FRAMEWORK/LICENSE).
- **Copyright:** Copyright 2024 Aden
- **Path in this repo:** `SKILLS/HIVE FRAMEWORK/` (8 SKILL directories: `hive`, `hive-concepts`, `hive-create`, `hive-credentials`, `hive-debugger`, `hive-patterns`, `hive-test`, `triage-issue`).
- **Notes:** Upstream is the `aden-hive` GitHub organization, not `adenhq` (a previous internal note had the wrong slug). The LICENSE file in `SKILLS/HIVE FRAMEWORK/LICENSE` is the authoritative upstream Apache-2.0 license for this vendored tree. Per Apache-2.0 §4, recipients of redistributed material must receive a copy of this license, modified files must carry change notices, and attribution notices in source files must be preserved.

---

## Full MIT License text

The following MIT License text applies to every section above marked "MIT":

```
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Each MIT-licensed upstream's copyright line is recorded in its section above. The MIT License must be reproduced with the upstream's copyright notice (substituted in place of the blank holder line) when redistributing substantial portions of that upstream.

---

## Apache-2.0 and CC-BY-4.0

- **Apache License, Version 2.0** — full text: <https://www.apache.org/licenses/LICENSE-2.0>. Authoritative on-disk copies live at:
  - `SKILLS/OFFICIAL MCP SERVERS/LICENSE` (for `modelcontextprotocol/servers`)
  - `SKILLS/HIVE FRAMEWORK/LICENSE` (for `aden-hive/hive`)
  - Each Anthropic Apache-2.0 skill's `LICENSE.txt` (see [Anthropic Skills (Apache-2.0 cohort)](#anthropic-skills-apache-20-cohort))
- **Creative Commons Attribution 4.0 International (CC-BY-4.0)** — full text: <https://creativecommons.org/licenses/by/4.0/legalcode>. Applies to non-specification documentation contributed to `modelcontextprotocol/servers`.

---

## EVOKORE-MCP's own code

This repository's own original code, documentation, and configuration are licensed under the MIT License — see [`LICENSE`](LICENSE) for the authoritative text and [`NOTICE`](NOTICE) for the high-level attribution summary.

---

## Removed from this distribution

The following vendored content was REMOVED from the public mirror prior to first publication. Each was either explicitly proprietary or had unverifiable licensing:

- **`SKILLS/DEVELOPER TOOLS/document-skills/{docx,pdf,pptx,xlsx}`** — Anthropic proprietary skills. The upstream `LICENSE.txt` files explicitly forbid extraction outside Anthropic services, copying outside authorized use, derivative works, and redistribution to third parties. Removed on 2026-05-21.
- **`SKILLS/Stitch Skills/`** — no upstream repository or license could be verified. Removed on 2026-05-21 pending provenance resolution.
- **`SKILLS/AWESOME CLAUDE CODE RESOURCES/`** — multi-upstream curated reference compilation where per-project licenses were not bundled. Removed on 2026-05-21 pending a manifest mapping each subdirectory to its upstream URL and license.

These directories remain available in the internal development repository for operator review.
