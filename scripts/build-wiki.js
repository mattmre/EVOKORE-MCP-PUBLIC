#!/usr/bin/env node
/**
 * build-wiki.js — static client-side wiki generator for EVOKORE-MCP.
 *
 * Walks SKILLS/, parses .env.example, copies a curated tools.seed.json
 * into wiki/data/, and emits a fully self-contained static site at
 * wiki/. No npm dependencies; only Node built-ins.
 *
 * Safe to re-run. Writes everything to a temp staging area first and
 * promotes by rename-or-overwrite on a per-file basis so a partial
 * crash never leaves the wiki in a broken state.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const url = require("url");

const REPO_ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(REPO_ROOT, "SKILLS");
const ENV_EXAMPLE = path.join(REPO_ROOT, ".env.example");
const WIKI_DIR = path.join(REPO_ROOT, "wiki");
const WIKI_DATA = path.join(WIKI_DIR, "data");
const WIKI_CATS = path.join(WIKI_DIR, "categories");
const TOOLS_SEED = path.join(WIKI_DATA, "tools.seed.json");
const TOOLS_OUT = path.join(WIKI_DATA, "tools.json");
const SKILLS_OUT = path.join(WIKI_DATA, "skills.json");
const ENV_OUT = path.join(WIKI_DATA, "env.json");

const BUILD_DATE = new Date();
const BUILD_ISO = BUILD_DATE.toISOString();
// Use the local-time day so the visible "Last built" matches the operator's
// wall clock. ISO would shift across the UTC midnight boundary for users
// near the edge of a timezone.
const BUILD_DAY =
  BUILD_DATE.getFullYear() +
  "-" +
  String(BUILD_DATE.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(BUILD_DATE.getDate()).padStart(2, "0");

// -----------------------------------------------------------------
// IO helpers
// -----------------------------------------------------------------

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFileAtomic(target, contents) {
  ensureDir(path.dirname(target));
  const tmp = target + ".tmp-" + process.pid;
  fs.writeFileSync(tmp, contents);
  fs.renameSync(tmp, target);
}

function readUtf8(p) {
  return fs.readFileSync(p, "utf8");
}

// -----------------------------------------------------------------
// frontmatter parser (small subset of YAML — flat key/value, simple
// arrays of strings, single-line nested keys)
// -----------------------------------------------------------------

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseFrontmatter(source) {
  const match = source.match(FRONTMATTER_RE);
  if (!match) {
    return { frontmatter: {}, body: source };
  }
  return {
    frontmatter: parseYaml(match[1]),
    body: match[2],
  };
}

function stripYamlString(v) {
  let s = String(v).trim();
  if (s.length >= 2) {
    if (s.startsWith('"') && s.endsWith('"')) {
      s = s.slice(1, -1).replace(/\\"/g, '"');
    } else if (s.startsWith("'") && s.endsWith("'")) {
      s = s.slice(1, -1).replace(/''/g, "'");
    }
  }
  return s;
}

function parseYamlInlineArray(v) {
  // "[a, b, 'c, d']" → ["a", "b", "c, d"]
  const inner = v.slice(1, -1).trim();
  if (!inner) return [];
  const out = [];
  let cur = "";
  let i = 0;
  let inSingle = false;
  let inDouble = false;
  while (i < inner.length) {
    const ch = inner[i];
    if (!inSingle && !inDouble && ch === ",") {
      out.push(stripYamlString(cur));
      cur = "";
    } else {
      if (ch === "'" && !inDouble) inSingle = !inSingle;
      else if (ch === '"' && !inSingle) inDouble = !inDouble;
      cur += ch;
    }
    i++;
  }
  if (cur.trim()) out.push(stripYamlString(cur));
  return out;
}

function parseYaml(text) {
  const lines = text.split(/\r?\n/);
  const out = {};
  let i = 0;

  while (i < lines.length) {
    let line = lines[i];
    if (!line || /^\s*#/.test(line) || /^\s*$/.test(line)) {
      i++;
      continue;
    }

    // Only support top-level keys at indent 0 — nested objects are
    // collapsed into raw text under their parent for safety. Indented
    // continuation lines are folded onto the previous scalar.
    const topMatch = line.match(/^([A-Za-z_][\w\-]*):\s*(.*)$/);
    if (!topMatch) {
      i++;
      continue;
    }
    const key = topMatch[1];
    let rest = topMatch[2] || "";

    // List form: "key:\n  - foo\n  - bar"
    if (rest === "") {
      const items = [];
      let j = i + 1;
      let collectedScalar = "";
      while (j < lines.length) {
        const next = lines[j];
        const nextMatch = next.match(/^(\s*)-\s+(.*)$/);
        const isBlank = /^\s*$/.test(next);
        if (nextMatch && nextMatch[1].length >= 2) {
          items.push(stripYamlString(nextMatch[2]));
          j++;
          continue;
        }
        // also support nested map values written on one line under the key
        if (!isBlank && /^\s+\S/.test(next) && !nextMatch) {
          collectedScalar += (collectedScalar ? "\n" : "") + next.replace(/^\s+/, "");
          j++;
          continue;
        }
        break;
      }
      if (items.length > 0) {
        out[key] = items;
      } else if (collectedScalar) {
        out[key] = collectedScalar;
      } else {
        out[key] = "";
      }
      i = j;
      continue;
    }

    // Inline array: "key: [a, b]"
    if (rest.startsWith("[") && rest.endsWith("]")) {
      out[key] = parseYamlInlineArray(rest);
      i++;
      continue;
    }

    // Multi-line scalar (folded): subsequent indented lines extend the value
    let scalar = stripYamlString(rest);
    let j = i + 1;
    while (j < lines.length) {
      const next = lines[j];
      if (/^\s*$/.test(next) || /^\s*#/.test(next)) break;
      if (/^[A-Za-z_][\w\-]*:/.test(next)) break;
      if (/^\s+\S/.test(next)) {
        scalar += " " + next.trim();
        j++;
        continue;
      }
      break;
    }
    out[key] = scalar;
    i = j;
  }
  return out;
}

// -----------------------------------------------------------------
// SKILL.md walker
// -----------------------------------------------------------------

function walkSkills(root) {
  const out = [];
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      return;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(full);
      } else if (ent.isFile() && ent.name === "SKILL.md") {
        out.push(full);
      }
    }
  }
  walk(root);
  return out;
}

function firstBodyParagraph(body) {
  if (!body) return "";
  const lines = body.split(/\r?\n/);
  let collecting = false;
  let buf = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!collecting) {
      if (!line.trim()) continue;
      if (line.startsWith("#")) continue;
      if (line.startsWith(">")) continue;
      if (line.startsWith("```")) {
        // skip a code block entirely
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith("```")) j++;
        i = j;
        continue;
      }
      collecting = true;
      buf.push(line.trim());
      continue;
    }
    if (!line.trim()) break;
    if (line.startsWith("#")) break;
    buf.push(line.trim());
  }
  let para = buf.join(" ").replace(/\s+/g, " ").trim();
  // Strip simple markdown emphasis/links: [text](url) → text
  para = para.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  para = para.replace(/`([^`]+)`/g, "$1");
  para = para.replace(/\*\*([^*]+)\*\*/g, "$1");
  para = para.replace(/__([^_]+)__/g, "$1");
  para = para.replace(/(^|[^\*])\*([^*]+)\*/g, "$1$2");
  if (para.length > 300) {
    para = para.slice(0, 297).trimEnd() + "...";
  }
  return para;
}

function deriveCategoryFromPath(absPath) {
  const rel = path.relative(SKILLS_DIR, absPath).split(path.sep);
  if (rel.length === 0) return "Uncategorized";
  return rel[0];
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function toRelativePath(absPath) {
  return path.relative(REPO_ROOT, absPath).split(path.sep).join("/");
}

function ensureArray(v) {
  if (v === null || v === undefined) return [];
  if (Array.isArray(v)) {
    return v.map(String).map(stripYamlString).filter(Boolean);
  }
  // comma-separated strings like "a, b, c"
  if (typeof v === "string") {
    return v.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

function buildSkillEntries(skillFiles) {
  const entries = [];
  for (const file of skillFiles) {
    let source;
    try {
      source = readUtf8(file);
    } catch (err) {
      process.stderr.write("skip " + file + ": " + err.message + "\n");
      continue;
    }
    const { frontmatter, body } = parseFrontmatter(source);
    const name =
      (frontmatter.name && stripYamlString(frontmatter.name)) ||
      path.basename(path.dirname(file)) ||
      path.basename(file, ".md");
    const description = frontmatter.description
      ? stripYamlString(frontmatter.description)
      : "";
    const categoryFromPath = deriveCategoryFromPath(file);
    const declaredCategory = frontmatter.category
      ? stripYamlString(frontmatter.category)
      : "";
    const category = categoryFromPath || declaredCategory || "Uncategorized";
    const aliases = ensureArray(frontmatter.aliases);
    const tags = ensureArray(frontmatter.tags);
    const version = frontmatter.version ? stripYamlString(frontmatter.version) : "";
    const upstream = frontmatter.upstream ? stripYamlString(frontmatter.upstream) : "";
    const upstreamSha = frontmatter["upstream-sha"]
      ? stripYamlString(frontmatter["upstream-sha"])
      : "";
    const upstreamPath = frontmatter["upstream-path"]
      ? stripYamlString(frontmatter["upstream-path"])
      : "";
    const license = frontmatter.license ? stripYamlString(frontmatter.license) : "";

    entries.push({
      name,
      category,
      declaredCategory,
      description,
      firstParagraph: firstBodyParagraph(body),
      aliases,
      tags,
      version,
      upstream,
      upstreamSha,
      upstreamPath,
      license,
      relativePath: toRelativePath(file),
      slug: slugify(name) || slugify(path.basename(path.dirname(file))),
    });
  }
  entries.sort((a, b) => {
    const ca = (a.category || "").toLowerCase();
    const cb = (b.category || "").toLowerCase();
    if (ca !== cb) return ca < cb ? -1 : 1;
    const na = (a.name || "").toLowerCase();
    const nb = (b.name || "").toLowerCase();
    return na < nb ? -1 : na > nb ? 1 : 0;
  });
  return entries;
}

// -----------------------------------------------------------------
// .env.example parser
// -----------------------------------------------------------------

function parseEnvExample(filePath) {
  const text = readUtf8(filePath);
  const lines = text.split(/\r?\n/);
  const vars = [];
  let commentBuf = [];

  function flushCommentInto(target) {
    if (commentBuf.length) {
      target.comment = commentBuf
        .map((l) => l.replace(/^#\s?/, "").trimEnd())
        .filter((l) => l.trim().length > 0 && !/^[-=]{3,}$/.test(l))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Order matters: check for commented EVOKORE_* var first, since the
    // generic "comment line" check would otherwise swallow it.
    const enabledMatch = line.match(/^\s*(EVOKORE_[A-Z0-9_]+|GITHUB_PERSONAL_ACCESS_TOKEN|ELEVENLABS_API_KEY|SUPABASE_ACCESS_TOKEN|STITCH_API_KEY|VOICE_SIDECAR_[A-Z0-9_]+)\s*=\s*(.*)$/);
    const commentedMatch = line.match(/^\s*#\s*(EVOKORE_[A-Z0-9_]+|VOICE_SIDECAR_[A-Z0-9_]+)\s*=\s*(.*)$/);

    if (!enabledMatch && !commentedMatch) {
      if (/^\s*#/.test(line)) {
        commentBuf.push(line);
        continue;
      }
      if (/^\s*$/.test(line)) {
        // blank line resets the comment block
        commentBuf = [];
        continue;
      }
      // unknown non-EVOKORE setting; ignore but reset state
      commentBuf = [];
      continue;
    }

    let isCommentedVar = false;
    let key = null;
    let value = "";
    if (enabledMatch) {
      key = enabledMatch[1];
      value = enabledMatch[2];
    } else {
      key = commentedMatch[1];
      value = commentedMatch[2];
      isCommentedVar = true;
    }

    const entry = {
      name: key,
      example: value.trim(),
      required: !isCommentedVar,
      group: isCommentedVar ? "optional" : "required",
    };
    flushCommentInto(entry);
    vars.push(entry);
    commentBuf = [];
  }
  // de-dupe (commented variants may shadow active ones; keep first)
  const seen = new Set();
  const out = [];
  for (const v of vars) {
    if (seen.has(v.name)) continue;
    seen.add(v.name);
    out.push(v);
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

// -----------------------------------------------------------------
// HTML generation helpers
// -----------------------------------------------------------------

function htmlEscape(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shellLayout(opts) {
  const navItems = [
    { href: "./index.html", label: "Home", id: "home" },
    { href: "./skills-index.html", label: "Skills", id: "skills" },
    { href: "./categories.html", label: "Categories", id: "categories" },
    { href: "./tools.html", label: "Tools", id: "tools" },
    { href: "./env-vars.html", label: "Env Vars", id: "env" },
  ];
  const nav = navItems
    .map((item) => {
      const cls = opts.activeNav === item.id ? "active" : "";
      const href = opts.relPrefix
        ? opts.relPrefix + item.href.replace(/^\.\//, "")
        : item.href;
      return (
        '<a href="' +
        htmlEscape(href) +
        '" class="' +
        cls +
        '">' +
        htmlEscape(item.label) +
        "</a>"
      );
    })
    .join("");

  const title = opts.title
    ? htmlEscape(opts.title) + " · EVOKORE-MCP Wiki"
    : "EVOKORE-MCP Wiki";

  const homeHref = opts.relPrefix ? opts.relPrefix + "index.html" : "./index.html";

  return [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "<title>" + title + "</title>",
    '<meta name="generator" content="EVOKORE-MCP wiki build">',
    '<meta name="description" content="' +
      htmlEscape(opts.lede || "Static reference wiki for EVOKORE-MCP skills, tools, and environment variables.") +
      '">',
    // Operators can edit this meta tag to point at a public source mirror
    // (for example, a GitHub repo URL). The wiki.js code reads it and adds
    // "View source" links to each skill card when set. Leave blank to
    // disable source linking. No GitHub URL is hardcoded.
    '<meta name="evokore-source-base" content="">',
    '<link rel="stylesheet" href="' +
      (opts.relPrefix ? opts.relPrefix + "assets/wiki.css" : "./assets/wiki.css") +
      '">',
    "</head>",
    "<body>",
    '<header class="site-header"><div class="container">',
    '<h1><a href="' + htmlEscape(homeHref) + '">EVOKORE-MCP Wiki</a></h1>',
    '<nav class="primary">' + nav + "</nav>",
    "</div></header>",
    "<main>",
    opts.bodyHtml,
    "</main>",
    '<footer class="site-footer"><div class="container">',
    "<span>EVOKORE-MCP · Static wiki. Last built: " +
      htmlEscape(BUILD_DAY) +
      ".</span>",
    "<span>" +
      'Source: <a href="' +
      htmlEscape(opts.relPrefix ? opts.relPrefix + "README.md" : "../README.md") +
      '">README</a>' +
      "</span>",
    "</div></footer>",
    '<script src="' +
      (opts.relPrefix ? opts.relPrefix + "assets/wiki.js" : "./assets/wiki.js") +
      '"></script>',
    "</body>",
    "</html>",
  ].join("\n");
}

// -----------------------------------------------------------------
// page builders
// -----------------------------------------------------------------

function buildIndexHtml(stats) {
  const body =
    "<!-- last built: " +
    BUILD_ISO +
    " -->\n" +
    '<h1 class="page-title">EVOKORE-MCP Wiki</h1>' +
    '<p class="page-lede">Deep reference for the EVOKORE-MCP project: every skill, native tool, and environment variable, indexed for offline browsing.</p>' +
    '<section class="overview-grid">' +
    overviewCard({
      title: "Skills",
      body: "Searchable index of every SKILL.md across the SKILLS/ tree, with category badges and adapter provenance.",
      href: "./skills-index.html",
      count: stats.skillCount + " skills",
    }) +
    overviewCard({
      title: "Categories",
      body: "Browse skills by their top-level SKILLS/ directory. Each category has its own page.",
      href: "./categories.html",
      count: stats.categoryCount + " categories",
    }) +
    overviewCard({
      title: "Native tools",
      body: "The MCP tools EVOKORE exposes natively, grouped by manager class.",
      href: "./tools.html",
      count: stats.toolCount + " tools",
    }) +
    overviewCard({
      title: "Environment variables",
      body: "Operator knobs for runtime behavior, parsed from .env.example.",
      href: "./env-vars.html",
      count: stats.envCount + " variables",
    }) +
    "</section>" +
    '<section class="bhk-panel">' +
    "<h2>Tips for first-time users</h2>" +
    "<ul>" +
    "<li>This wiki is generated. Re-run <code>npm run wiki:build</code> after pulling new skills or editing <code>.env.example</code>.</li>" +
    '<li>The skills index does not fetch live from <code>mcp.config.json</code> — it reflects the <code>SKILL.md</code> set at build time.</li>' +
    "<li>Some <code>SKILL.md</code> files are adapters of upstream submodules. They cite <code>upstream</code>, <code>upstream-sha</code>, and <code>upstream-path</code> in their frontmatter.</li>" +
    "<li>If your browser blocks <code>file://</code> fetches, run <code>python -m http.server</code> in <code>wiki/</code> and open <code>http://localhost:8000</code>.</li>" +
    "<li>Look at the <code>presentations/</code> directory (if present in your checkout) for visual walkthroughs; this wiki is the deep reference.</li>" +
    "</ul>" +
    "</section>" +
    '<section>' +
    "<h2>What is EVOKORE-MCP?</h2>" +
    "<p>EVOKORE-MCP is a multi-server MCP (Model Context Protocol) aggregator. It proxies child MCP servers, layers skill discovery on top, and adds session continuity, fleet orchestration, role-based access, and human-in-the-loop approval. See the project <code>README.md</code> for full setup.</p>" +
    "</section>";
  return shellLayout({ activeNav: "home", title: "Home", bodyHtml: body });
}

function overviewCard(c) {
  return (
    '<a class="overview-card" href="' +
    htmlEscape(c.href) +
    '">' +
    "<h3>" +
    htmlEscape(c.title) +
    "</h3>" +
    "<p>" +
    htmlEscape(c.body) +
    "</p>" +
    '<span class="count">' +
    htmlEscape(c.count) +
    "</span>" +
    "</a>"
  );
}

function buildSkillsIndexHtml() {
  const body =
    '<h1 class="page-title">Skills</h1>' +
    '<p class="page-lede">Searchable index of every SKILL.md in the repo. Filter by category or tag. Live filtering as you type.</p>' +
    '<div data-wiki-skills data-source="./data/skills.json">' +
    '<div class="search-row">' +
    '<input type="search" class="search-input" placeholder="Search by name, alias, tag, description, category" aria-label="Search skills">' +
    '<select class="filter-select" data-filter="category" aria-label="Filter by category"><option value="">All categories</option></select>' +
    '<select class="filter-select" data-filter="tag" aria-label="Filter by tag"><option value="">All tags</option></select>' +
    '<span class="result-count">loading...</span>' +
    "</div>" +
    '<div class="empty-state hidden">No skills match your filter.</div>' +
    '<div class="card-list"></div>' +
    "</div>";
  return shellLayout({ activeNav: "skills", title: "Skills", bodyHtml: body });
}

function buildToolsHtml() {
  const body =
    '<h1 class="page-title">Native tools</h1>' +
    '<p class="page-lede">All tools EVOKORE-MCP exposes natively, grouped by the manager class that owns them. Hand-curated; re-derive by reading <code>src/*Manager.ts</code>.</p>' +
    '<div data-wiki-tools data-source="./data/tools.json">' +
    '<div class="search-row">' +
    '<input type="search" class="search-input" placeholder="Search tools by name, manager, purpose" aria-label="Search tools">' +
    '<select class="filter-select" data-filter="manager" aria-label="Filter by manager"><option value="">All managers</option></select>' +
    '<span class="result-count">loading...</span>' +
    "</div>" +
    '<div class="empty-state hidden">No tools match your filter.</div>' +
    '<div class="card-list two-col"></div>' +
    "</div>";
  return shellLayout({ activeNav: "tools", title: "Native tools", bodyHtml: body });
}

function buildEnvHtml() {
  const body =
    '<h1 class="page-title">Environment variables</h1>' +
    '<p class="page-lede">All EVOKORE_* environment variables parsed from <code>.env.example</code>. Required values are listed at the top; commented-out optional knobs follow with their default examples.</p>' +
    '<div data-wiki-env data-source="./data/env.json">' +
    '<div class="search-row">' +
    '<input type="search" class="search-input" placeholder="Search by name or description" aria-label="Search environment variables">' +
    '<select class="filter-select" data-filter="group" aria-label="Filter by required/optional">' +
    '<option value="">All variables</option>' +
    '<option value="required">Required only</option>' +
    '<option value="optional">Optional only</option>' +
    "</select>" +
    '<span class="result-count">loading...</span>' +
    "</div>" +
    '<div class="empty-state hidden">No variables match your filter.</div>' +
    '<div class="card-list"></div>' +
    "</div>";
  return shellLayout({ activeNav: "env", title: "Environment variables", bodyHtml: body });
}

function buildCategoriesIndexHtml(categories) {
  const items = categories
    .map((c) => {
      return (
        '<a class="overview-card" href="./categories/' +
        htmlEscape(c.slug) +
        '.html">' +
        "<h3>" +
        htmlEscape(c.name) +
        "</h3>" +
        "<p>" +
        htmlEscape(c.summary || "Skills under " + c.name + ".") +
        "</p>" +
        '<span class="count">' +
        c.count +
        " skill" +
        (c.count === 1 ? "" : "s") +
        "</span>" +
        "</a>"
      );
    })
    .join("");

  const body =
    '<h1 class="page-title">Skill categories</h1>' +
    '<p class="page-lede">Each card opens a server-rendered page listing every skill in that SKILLS/ subdirectory. Works with JavaScript disabled.</p>' +
    '<section class="overview-grid">' + items + "</section>";

  return shellLayout({ activeNav: "categories", title: "Categories", bodyHtml: body });
}

function buildCategoryPageHtml(category, skills) {
  const cards = skills
    .map((s) => {
      const tagsHtml = s.tags && s.tags.length
        ? '<div class="meta">' +
          s.tags.map((t) => '<span class="chip">' + htmlEscape(t) + "</span>").join("") +
          "</div>"
        : "";
      const upstream = s.upstream
        ? '<div class="upstream-note">Adapter of ' +
          htmlEscape(s.upstream) +
          (s.upstreamPath ? " · " + htmlEscape(s.upstreamPath) : "") +
          (s.upstreamSha ? " · sha " + htmlEscape(String(s.upstreamSha).slice(0, 12)) : "") +
          "</div>"
        : "";
      return (
        '<article class="card">' +
        '<div class="card-row">' +
        '<div class="name">' + htmlEscape(s.name) + "</div>" +
        '<span class="badge muted">' + htmlEscape(s.category) + "</span>" +
        "</div>" +
        (s.description
          ? '<p class="description full">' + htmlEscape(s.description) + "</p>"
          : "") +
        (s.firstParagraph && s.firstParagraph !== s.description
          ? '<p class="description full muted">' + htmlEscape(s.firstParagraph) + "</p>"
          : "") +
        tagsHtml +
        '<div class="path">' + htmlEscape(s.relativePath) + "</div>" +
        upstream +
        "</article>"
      );
    })
    .join("");

  const body =
    '<p><a href="../categories.html">← All categories</a></p>' +
    '<h1 class="page-title">' + htmlEscape(category) + "</h1>" +
    '<p class="page-lede">' + skills.length + " " + (skills.length === 1 ? "skill" : "skills") + " in this category.</p>" +
    '<div class="card-list">' + cards + "</div>";
  return shellLayout({
    activeNav: "categories",
    title: category,
    relPrefix: "../",
    bodyHtml: body,
  });
}

// -----------------------------------------------------------------
// orchestration
// -----------------------------------------------------------------

function ensureToolsSeed() {
  if (!fs.existsSync(TOOLS_SEED)) {
    throw new Error(
      "Missing " +
        toRelativePath(TOOLS_SEED) +
        ". This file is hand-curated and must be present before building the wiki."
    );
  }
  const text = readUtf8(TOOLS_SEED);
  const parsed = JSON.parse(text);
  if (!parsed || !Array.isArray(parsed.tools)) {
    throw new Error(toRelativePath(TOOLS_SEED) + " is missing a 'tools' array.");
  }
  return parsed;
}

function buildReadmeForWiki() {
  return [
    "# EVOKORE-MCP Wiki",
    "",
    "Static, client-side searchable wiki for EVOKORE-MCP. Generated by",
    "`scripts/build-wiki.js` (run via `npm run wiki:build`).",
    "",
    "## Open the wiki",
    "",
    "Two options:",
    "",
    "1. **Direct from disk.** Double-click `wiki/index.html`. Most modern",
    "   browsers will load it, but some block `fetch('./data/*.json')` from",
    "   `file://` URLs.",
    "",
    "2. **Tiny local server (recommended).** From inside the `wiki/`",
    "   directory:",
    "",
    "   ```",
    "   python -m http.server 8000",
    "   ```",
    "",
    "   then open <http://localhost:8000>.",
    "",
    "Any plain static server works (`npx http-server`, `caddy file-server`,",
    "etc.). No build step at view time; everything is plain HTML + CSS + JS.",
    "",
    "## Rebuild",
    "",
    "```",
    "npm run wiki:build",
    "```",
    "",
    "Re-runs the generator. The script is idempotent; running it twice with",
    "no changes produces an identical site (apart from the `Last built` ",
    "timestamp).",
    "",
    "## What gets generated",
    "",
    "- `index.html`, `skills-index.html`, `categories.html`, `tools.html`,",
    "  `env-vars.html` — top-level pages.",
    "- `categories/<slug>.html` — one page per top-level `SKILLS/`",
    "  subdirectory, server-rendered so it works with JavaScript disabled.",
    "- `data/skills.json`, `data/tools.json`, `data/env.json` — the data the",
    "  client-side filter reads.",
    "- `assets/wiki.css`, `assets/wiki.js` — shared style and vanilla-JS",
    "  search/filter.",
    "",
    "## Hand-curated input",
    "",
    "- `wiki/data/tools.seed.json` is the source of truth for the native",
    "  tool list. The build script copies it into `data/tools.json` with a",
    "  build timestamp. Edit the seed file when tool names or descriptions",
    "  change; the runtime in `src/*Manager.ts` is the canonical source.",
    "",
    "## Linking to source",
    "",
    "Each generated page contains `<meta name=\"evokore-source-base\" ",
    "content=\"\">`. Set the `content` attribute to a base URL (for example,",
    "a public source mirror you maintain) and the JS will append per-skill",
    "`View source` links. No URL is hardcoded; the default is blank and the",
    "links are simply hidden.",
    "",
  ].join("\n");
}

function summarize(category, skills) {
  // Pick the most common single-line theme from the descriptions.
  if (!skills || skills.length === 0) return "";
  const sample = skills.slice(0, 3).map((s) => s.name).filter(Boolean);
  return sample.length
    ? "Includes " + sample.join(", ") + (skills.length > sample.length ? ", and more." : ".")
    : "";
}

function groupByCategory(skillEntries) {
  const map = new Map();
  for (const skill of skillEntries) {
    const cat = skill.category || "Uncategorized";
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat).push(skill);
  }
  const out = [];
  for (const [name, list] of map.entries()) {
    list.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    out.push({
      name,
      slug: slugify(name),
      count: list.length,
      skills: list,
      summary: summarize(name, list),
    });
  }
  out.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  return out;
}

function main() {
  ensureDir(WIKI_DIR);
  ensureDir(WIKI_DATA);
  ensureDir(WIKI_CATS);
  ensureDir(path.join(WIKI_DIR, "assets"));

  // 1. skills
  const skillFiles = walkSkills(SKILLS_DIR);
  const skillEntries = buildSkillEntries(skillFiles);
  writeFileAtomic(
    SKILLS_OUT,
    JSON.stringify({ generatedAt: BUILD_ISO, skills: skillEntries }, null, 2) + "\n"
  );

  // 2. env vars
  const envEntries = parseEnvExample(ENV_EXAMPLE);
  writeFileAtomic(
    ENV_OUT,
    JSON.stringify({ generatedAt: BUILD_ISO, vars: envEntries }, null, 2) + "\n"
  );

  // 3. tools (copy seed + stamp)
  const toolsPayload = ensureToolsSeed();
  toolsPayload.generatedAt = BUILD_ISO;
  writeFileAtomic(TOOLS_OUT, JSON.stringify(toolsPayload, null, 2) + "\n");

  // 4. category index data
  const categoryGroups = groupByCategory(skillEntries);

  // 5. HTML pages
  writeFileAtomic(
    path.join(WIKI_DIR, "index.html"),
    buildIndexHtml({
      skillCount: skillEntries.length,
      toolCount: toolsPayload.tools.length,
      envCount: envEntries.length,
      categoryCount: categoryGroups.length,
    })
  );
  writeFileAtomic(path.join(WIKI_DIR, "skills-index.html"), buildSkillsIndexHtml());
  writeFileAtomic(path.join(WIKI_DIR, "tools.html"), buildToolsHtml());
  writeFileAtomic(path.join(WIKI_DIR, "env-vars.html"), buildEnvHtml());
  writeFileAtomic(
    path.join(WIKI_DIR, "categories.html"),
    buildCategoriesIndexHtml(categoryGroups)
  );

  for (const group of categoryGroups) {
    writeFileAtomic(
      path.join(WIKI_CATS, group.slug + ".html"),
      buildCategoryPageHtml(group.name, group.skills)
    );
  }

  // 6. wiki README — only write if missing or if content differs, to keep
  // diffs minimal.
  const readmePath = path.join(WIKI_DIR, "README.md");
  const readmeContent = buildReadmeForWiki();
  let existing = null;
  try { existing = fs.readFileSync(readmePath, "utf8"); } catch (_) {}
  if (existing !== readmeContent) {
    writeFileAtomic(readmePath, readmeContent);
  }

  // 7. summary line — required by the build contract
  process.stdout.write(
    "wiki build: " +
      skillEntries.length +
      " skills, " +
      toolsPayload.tools.length +
      " tools, " +
      envEntries.length +
      " env vars\n"
  );
}

try {
  main();
  process.exit(0);
} catch (err) {
  process.stderr.write("wiki build failed: " + (err && err.message ? err.message : String(err)) + "\n");
  if (err && err.stack) process.stderr.write(err.stack + "\n");
  process.exit(1);
}
