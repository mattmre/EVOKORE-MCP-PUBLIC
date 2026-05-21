#!/usr/bin/env node
/* One-off fix: add H2 sections + substantive body to category index pages. */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'docs', 'wiki', 'categories');

// Per-category descriptive blurbs and "About" prose. Kept long enough that
// every page clears the 800-char body threshold even when only one skill is
// listed.
const CATEGORY_INFO = {
  'anthropic-cookbook': {
    title: 'Anthropic Cookbook',
    blurb: 'Skills imported from the official Anthropic Cookbook submodule. These are domain-focused, prompt-engineering oriented skills that demonstrate idiomatic Claude usage for finance, branding, content auditing, and modeling workloads. They are vendored under `SKILLS/ANTHROPIC COOKBOOK/skills/custom_skills/` and live behind upstream provenance frontmatter; do not edit the submodule body in place.',
    related: ['developer-tools', 'research-and-content'],
  },
  'architecture': {
    title: 'Architecture',
    blurb: 'Skills that operate on whole-codebase shape — module boundaries, interface seams, deep modules, and refactor altitude. Use these when a change is too cross-cutting for a single-file edit and you need to first re-establish the architectural picture before writing code. Most of these adapters trace back to mattpocock/skills and the AEP framework.',
    related: ['planning', 'general-coding-workflows', 'orchestration-framework'],
  },
  'automation-and-productivity': {
    title: 'Automation & Productivity',
    blurb: 'Skills that automate repetitive operator and developer workflows — release prep, configuration sync, dashboard wiring, and recurring maintenance tasks. They sit alongside the EVOKORE hook system rather than replacing it; pair them with `scripts/hooks/*` when you want session-scoped automation.',
    related: ['developer-tools', 'project-management'],
  },
  'communication': {
    title: 'Communication',
    blurb: 'Skills that help an agent communicate more clearly — zoom out from a tactical edit to its calling context, name ambiguous concepts unambiguously, and pick the altitude at which a change should land. These are the most frequently invoked skills during code review and handoff drafting.',
    related: ['context', 'planning'],
  },
  'context': {
    title: 'Context',
    blurb: 'Skills that establish and maintain a project ubiquitous-language layer. They are hard-coupled to the bounded contexts declared in `docs/adr/0005-bounded-contexts.md`; never use them to re-introduce a project-root glossary. Reach for these when terminology drifts between PR descriptions, ADRs, and runtime code.',
    related: ['communication', 'planning'],
  },
  'developer-tools': {
    title: 'Developer Tools',
    blurb: 'The skill-author toolkit. Includes `skill-creator` (with the Wave 0b trigger-explicit lint), `docs-architect` for narrative documentation, validators, and the supporting scaffolding templates. Use these whenever you are authoring a new SKILL.md or porting an upstream skill into an EVOKORE adapter.',
    related: ['architecture', 'qa'],
  },
  'evokore-extensions': {
    title: 'EVOKORE Extensions',
    blurb: 'Skills authored specifically for EVOKORE-MCP that do not map cleanly onto an upstream — internal helpers for proxy routing, registry shaping, session continuity, and the HITL approval flow. Treat this as the "private API" tier; behavior here is allowed to assume the EVOKORE runtime and is not portable to other MCP hosts.',
    related: ['orchestration-framework', 'automation-and-productivity'],
  },
  'general-coding-workflows': {
    title: 'General Coding Workflows',
    blurb: 'Day-to-day coding skills: TDD red/green cycles, bug triage, PR shaping, refactor planning, and similar fundamentals that are not specific to any one bounded context. These are the most common entry points for `resolve_workflow` queries that contain words like "implement", "fix", or "refactor".',
    related: ['architecture', 'qa', 'planning'],
  },
  'hive-framework': {
    title: 'Hive Framework',
    blurb: 'The Hive multi-agent coordination framework. These skills wire up fleet spawning, claims, and message-passing patterns when EVOKORE is acting as a controller for multiple worker agents. Use Hive when a workload genuinely needs parallel agents; for single-track work prefer the Orchestration Framework or one of the General Coding Workflows skills.',
    related: ['orchestration-framework', 'evokore-extensions'],
  },
  'orchestration-framework': {
    title: 'Orchestration Framework',
    blurb: 'The Agent33-derived orchestration discipline now living under `SKILLS/ORCHESTRATION FRAMEWORK/`. Includes the handoff protocol, the panel-of-experts machinery, the AEP framework, workflow DAG templates, and the policy pack. This is the canonical home for "how should this multi-step task actually be structured?" guidance.',
    related: ['hive-framework', 'planning', 'evokore-extensions'],
  },
  'planning': {
    title: 'Planning',
    blurb: 'Skills that produce a written plan before any code is written — backlog shaping, slice carving, milestone definition, and pre-mortem review. Planning skills are an explicit gate in the EVOKORE workflow: the truth-score auto-activation guard refuses to chain destructive skills until a planning artifact exists.',
    related: ['architecture', 'orchestration-framework', 'project-management'],
  },
  'project-management': {
    title: 'Project Management',
    blurb: 'Skills that operate on issues, PRs, milestones, and release branches rather than on code itself. These are the entry points for `to-issues`, `pr-manager`, release readiness scoring, and similar surfaces. They respect the EVOKORE damage-control rules around `gh issue create` and `gh pr create` from agent worktrees.',
    related: ['planning', 'automation-and-productivity'],
  },
  'qa': {
    title: 'QA',
    blurb: 'Quality assurance skills: verification quality scoring, test-suite stewardship, evidence capture, and the truth-score gate that protects destructive auto-activations. QA skills are deliberately separate from `general-coding-workflows` so that running QA does not transitively reactivate the TDD red/green flow.',
    related: ['general-coding-workflows', 'orchestration-framework'],
  },
  'research-and-content': {
    title: 'Research & Content',
    blurb: 'Skills aimed at reading, summarizing, and producing research artifacts — repository ingestion, narrative documentation, content curation, and reference page generation. The boundary against `developer-tools` is that research skills produce prose for humans, not code or scaffolding.',
    related: ['developer-tools', 'communication'],
  },
  'stitch-skills': {
    title: 'Stitch Skills',
    blurb: 'A vendored skill pack focused on stitching together heterogeneous data and document workflows. Treat this category as adapter territory: every entry should declare upstream provenance frontmatter and never be edited inside the submodule body.',
    related: ['research-and-content', 'wshobson-plugins'],
  },
  'wshobson-plugins': {
    title: 'wshobson Plugins',
    blurb: 'Skills mirrored from the `wshobson/plugins` upstream collection. These are independent contributor skills exposed through EVOKORE under adapter frontmatter. As with all upstream vendoring, edits must land in the EVOKORE adapter body, never in the submodule source tree.',
    related: ['stitch-skills', 'research-and-content'],
  },
};

function buildInsertion(slug, info) {
  const relatedLinks = info.related
    .filter(r => CATEGORY_INFO[r])
    .map(r => `<li><a href="${r}.html">${CATEGORY_INFO[r].title}</a></li>`)
    .join('');
  return `\n<h2>About this category</h2>\n` +
    `<p>${info.blurb}</p>\n` +
    `<p>The skill list below is auto-generated by <code>scripts/generate-wiki.js</code> from <code>SKILLS/**/SKILL.md</code> frontmatter. Each entry links to the rendered skill page; from there you can jump to the source markdown path, see the composition graph edges that point to or from the skill, and follow upstream provenance for vendored adapters.</p>\n` +
    `<h2>How to use these skills</h2>\n` +
    `<p>Skills in this category are normally selected by <code>resolve_workflow</code> when an operator prompt or session purpose matches one of the trigger phrases declared in the skill frontmatter. You can also invoke a skill directly by passing its slug to <code>execute_skill</code>, which will return any <code>nextSteps[]</code> auto-activations derived from <code>skill-graph.json</code>. Skills that are destructive (file mutation, git history, release tagging) are gated behind the truth-score check described in <code>CLAUDE.md</code>.</p>\n` +
    `<h2>Related categories</h2>\n` +
    `<ul>${relatedLinks}</ul>\n` +
    `<p>For the full cross-category picture see the <a href="../skills-index.html">skills index</a>, the <a href="../workflows/composition-graph.html">composition graph workflow</a>, and the <a href="../architecture/index.html">runtime architecture</a> page.</p>\n`;
}

function processFile(file) {
  const slug = path.basename(file, '.html');
  const info = CATEGORY_INFO[slug];
  if (!info) {
    console.error(`No info entry for ${slug}, skipping`);
    return false;
  }
  const html = fs.readFileSync(file, 'utf8');
  // Idempotency: bail if "About this category" already present.
  if (/About this category/.test(html)) {
    return false;
  }
  // Insert before </main>.
  const replaced = html.replace(/<\/main>/i, buildInsertion(slug, info) + '</main>');
  if (replaced === html) {
    console.error(`Failed to insert in ${file}`);
    return false;
  }
  fs.writeFileSync(file, replaced);
  return true;
}

let count = 0;
for (const f of fs.readdirSync(ROOT)) {
  if (!f.endsWith('.html')) continue;
  if (processFile(path.join(ROOT, f))) count += 1;
}
console.log(`Updated ${count} category pages`);
