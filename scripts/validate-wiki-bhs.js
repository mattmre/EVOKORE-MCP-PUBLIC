#!/usr/bin/env node
/**
 * validate-wiki-bhs.js
 *
 * EVOKORE wiki BHS quality validator. Walks docs/wiki/**\/*.html
 * (excluding assets/) and scores each page on 5 dimensions, 20 points each:
 *
 *   B  Body substance       (>= 800 chars of meaningful rendered text, no placeholders)
 *   H  Headings              (exactly 1 H1, >=3 distinct H2 sections)
 *   S  Source integrity     (every internal relative href resolves on disk)
 *   C  Cross-links/compo    (skill pages: Composition heading; others: >=2 internal links)
 *   F  Frontmatter/HTML     (doctype/html/head/title/body + breadcrumb + footer w/ link)
 *
 * Score is strictly 0 or 20 per dimension. Writes docs/wiki/bhs-report.json.
 * Exits 0 if all pages score 100, else exits 1.
 *
 * Zero npm dependencies. Regex-based parsing (good enough for our emitted HTML).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const WIKI_ROOT = path.join(REPO_ROOT, 'docs', 'wiki');
const REPORT_PATH = path.join(WIKI_ROOT, 'bhs-report.json');

// Per the BHS spec, these literal placeholder strings are forbidden in body
// prose. The word "placeholder" itself is allowed — pages legitimately discuss
// "placeholder schema" / "env placeholders" as concepts.
const PLACEHOLDER_PATTERNS = [
  /\bTBD\b/,
  /\bTODO\b/,
  /\bFIXME\b/,
  /lorem ipsum/i,
];
// Lone ellipsis indicator (three dots or unicode) in body content is suspicious.
const ELLIPSIS_PATTERNS = [
  /\.{3,}/, // three or more dots
  /…/, // unicode horizontal ellipsis
];

function walkHtml(dir, out) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'assets') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkHtml(full, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

function stripScriptStyle(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '');
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, ' ');
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsaquo;/g, '>')
    .replace(/&lsaquo;/g, '<')
    .replace(/&mdash;/g, '-')
    .replace(/&middot;/g, ' ')
    .replace(/&larr;/g, '<-')
    .replace(/&rarr;/g, '->');
}

function extractBodyText(html) {
  // Pull <body>...</body> if present, else use full HTML.
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;
  // Strip footer (boilerplate) and header (boilerplate) for body-substance check.
  body = body.replace(/<footer[\s\S]*?<\/footer>/gi, ' ');
  body = body.replace(/<header[\s\S]*?<\/header>/gi, ' ');
  // Strip breadcrumb explicitly in case it isn't in a <header>.
  body = body.replace(/<[^>]+class="[^"]*breadcrumb[^"]*"[^>]*>[\s\S]*?<\/[a-z]+>/gi, ' ');
  const stripped = stripScriptStyle(body);
  const text = decodeEntities(stripTags(stripped)).replace(/\s+/g, ' ').trim();
  return text;
}

// Like extractBodyText, but also strips <code> and <pre> blocks so placeholder
// detection only fires on narrative prose, not on intentional `...` in code.
function extractProseText(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let body = bodyMatch ? bodyMatch[1] : html;
  body = body.replace(/<footer[\s\S]*?<\/footer>/gi, ' ');
  body = body.replace(/<header[\s\S]*?<\/header>/gi, ' ');
  body = body.replace(/<[^>]+class="[^"]*breadcrumb[^"]*"[^>]*>[\s\S]*?<\/[a-z]+>/gi, ' ');
  body = body.replace(/<pre[\s\S]*?<\/pre>/gi, ' ');
  body = body.replace(/<code\b[\s\S]*?<\/code>/gi, ' ');
  const stripped = stripScriptStyle(body);
  return decodeEntities(stripTags(stripped)).replace(/\s+/g, ' ').trim();
}

function countHeadings(html) {
  const body = stripScriptStyle(html);
  const h1 = (body.match(/<h1\b[^>]*>/gi) || []).length;
  const h2Matches = body.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  // distinct H2 texts
  const distinct = new Set();
  for (const raw of h2Matches) {
    const inner = raw.replace(/<h2\b[^>]*>/i, '').replace(/<\/h2>/i, '');
    const txt = decodeEntities(stripTags(inner)).replace(/\s+/g, ' ').trim().toLowerCase();
    if (txt) distinct.add(txt);
  }
  return { h1, h2Count: distinct.size };
}

function extractHrefs(html) {
  // Strip <script> and <style> first so we don't treat JavaScript string
  // literals like `href="' + it.path + '"` as real anchor targets.
  const cleaned = stripScriptStyle(html);
  const out = [];
  const re = /href\s*=\s*"([^"]+)"|href\s*=\s*'([^']+)'/gi;
  let m;
  while ((m = re.exec(cleaned)) !== null) {
    out.push(m[1] || m[2]);
  }
  return out;
}

function isExternal(href) {
  return /^(https?:|mailto:|tel:|ftp:|data:)/i.test(href);
}
function isAnchor(href) {
  return href.startsWith('#');
}

function checkSources(filePath, hrefs) {
  const dir = path.dirname(filePath);
  const broken = [];
  for (const href of hrefs) {
    if (!href || isExternal(href) || isAnchor(href)) continue;
    // Strip query/fragment.
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    const target = path.resolve(dir, clean);
    if (!fs.existsSync(target)) {
      broken.push(href);
    }
  }
  return broken;
}

function countInternalLinks(hrefs) {
  let count = 0;
  for (const href of hrefs) {
    if (!href) continue;
    if (isExternal(href) || isAnchor(href)) continue;
    count += 1;
  }
  return count;
}

function isSkillPage(filePath) {
  const rel = path.relative(WIKI_ROOT, filePath).replace(/\\/g, '/');
  // skills/<category>/<skill>.html (must have a category subdir)
  return /^skills\/[^/]+\/[^/]+\.html$/i.test(rel);
}

function hasCompositionSection(html) {
  // Look for a heading whose text equals or contains "Composition", then
  // confirm there is some real content (text or list/paragraph/div) within
  // the next ~1000 chars. Crucially, do NOT terminate at the next inner
  // heading: a Composition section that contains sub-headings like
  // "Invokes" / "Invoked by" is still a valid composition section.
  const headingRe = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let m;
  while ((m = headingRe.exec(html)) !== null) {
    const txt = decodeEntities(stripTags(m[1])).replace(/\s+/g, ' ').trim().toLowerCase();
    if (txt === 'composition' || /\bcomposition\b/.test(txt)) {
      const after = html.slice(m.index + m[0].length, m.index + m[0].length + 2000);
      // Find next sibling heading of the same level h2; if there is none in
      // the window, treat the whole window as the section.
      const stripped = stripScriptStyle(after);
      const sliceText = decodeEntities(stripTags(stripped)).replace(/\s+/g, ' ').trim();
      if (sliceText.length >= 10) return true;
    }
  }
  return false;
}

function hasBreadcrumb(html) {
  if (/class\s*=\s*"[^"]*\bbreadcrumb\b[^"]*"/i.test(html)) return true;
  if (/<nav\b[^>]*>[\s\S]*?<\/nav>/i.test(html)) return true; // header.site nav pattern
  return false;
}

function hasFooterWithLink(html) {
  const m = html.match(/<footer[\s\S]*?<\/footer>/i);
  if (!m) return false;
  return /<a\s[^>]*href=/i.test(m[0]);
}

function hasValidFrontmatter(html) {
  if (!/<!doctype\s+html/i.test(html)) return false;
  if (!/<html\b/i.test(html)) return false;
  if (!/<head\b[\s\S]*?<title\b[^>]*>[\s\S]*?<\/title>[\s\S]*?<\/head>/i.test(html)) return false;
  if (!/<body\b/i.test(html)) return false;
  return true;
}

function findPlaceholders(text) {
  const hits = [];
  for (const p of PLACEHOLDER_PATTERNS) {
    if (p.test(text)) hits.push(p.source);
  }
  for (const p of ELLIPSIS_PATTERNS) {
    if (p.test(text)) hits.push(p.source);
  }
  return hits;
}

function scorePage(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const failures = [];

  // F: frontmatter/HTML
  let fOK = hasValidFrontmatter(html);
  if (!fOK) failures.push('frontmatter: missing doctype/html/head/title/body');
  const breadcrumbOK = hasBreadcrumb(html);
  if (!breadcrumbOK) failures.push('frontmatter: missing breadcrumb element');
  const footerOK = hasFooterWithLink(html);
  if (!footerOK) failures.push('frontmatter: missing footer with link');
  const frontmatterPass = fOK && breadcrumbOK && footerOK;

  // H: headings
  const { h1, h2Count } = countHeadings(html);
  const headingsPass = (h1 === 1) && (h2Count >= 3);
  if (h1 !== 1) failures.push(`headings: expected 1 H1, found ${h1}`);
  if (h2Count < 3) failures.push(`headings: expected >=3 distinct H2, found ${h2Count}`);

  // B: body substance
  const bodyText = extractBodyText(html);
  const proseText = extractProseText(html);
  const placeholders = findPlaceholders(proseText);
  let bodyPass = bodyText.length >= 800 && placeholders.length === 0;
  if (bodyText.length < 800) failures.push(`body: only ${bodyText.length} chars of rendered text (need 800)`);
  if (placeholders.length > 0) failures.push(`body: placeholder hits in prose: ${placeholders.join(', ')}`);

  // S: sources
  const hrefs = extractHrefs(html);
  const broken = checkSources(filePath, hrefs);
  const sourcesPass = broken.length === 0;
  if (!sourcesPass) failures.push(`sources: broken hrefs: ${broken.slice(0, 5).join(', ')}${broken.length > 5 ? ' ...' : ''}`);

  // C: cross-links/composition
  let crossPass;
  if (isSkillPage(filePath)) {
    crossPass = hasCompositionSection(html);
    if (!crossPass) failures.push('crosslinks: skill page missing Composition section');
  } else {
    const internal = countInternalLinks(hrefs);
    crossPass = internal >= 2;
    if (!crossPass) failures.push(`crosslinks: only ${internal} internal links (need >=2)`);
  }

  const checks = {
    body: bodyPass ? 20 : 0,
    headings: headingsPass ? 20 : 0,
    sources: sourcesPass ? 20 : 0,
    crosslinks: crossPass ? 20 : 0,
    frontmatter: frontmatterPass ? 20 : 0,
  };
  const score = checks.body + checks.headings + checks.sources + checks.crosslinks + checks.frontmatter;

  return {
    path: path.relative(REPO_ROOT, filePath).replace(/\\/g, '/'),
    score,
    checks,
    failures,
  };
}

function main() {
  if (!fs.existsSync(WIKI_ROOT)) {
    console.error(`Wiki root not found: ${WIKI_ROOT}`);
    process.exit(2);
  }
  const files = walkHtml(WIKI_ROOT, []);
  files.sort();
  const results = files.map(scorePage);

  const total = results.length;
  const perfect = results.filter(r => r.score === 100).length;
  const distribution = {};
  for (const r of results) {
    distribution[r.score] = (distribution[r.score] || 0) + 1;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    wikiRoot: path.relative(REPO_ROOT, WIKI_ROOT).replace(/\\/g, '/'),
    totals: { pages: total, perfect, imperfect: total - perfect },
    distribution,
    pages: results,
  };
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  // Human-readable summary
  console.log(`EVOKORE wiki BHS report`);
  console.log(`-----------------------`);
  console.log(`Pages checked : ${total}`);
  console.log(`Perfect (100) : ${perfect}`);
  console.log(`Imperfect     : ${total - perfect}`);
  console.log(`Distribution  : ${JSON.stringify(distribution)}`);
  if (total - perfect > 0) {
    console.log(``);
    console.log(`Top failures (first 30):`);
    const imperfect = results.filter(r => r.score < 100).slice(0, 30);
    for (const r of imperfect) {
      console.log(`  [${r.score}] ${r.path}`);
      for (const f of r.failures) console.log(`        - ${f}`);
    }
  }
  console.log(``);
  console.log(`Report: ${path.relative(REPO_ROOT, REPORT_PATH).replace(/\\/g, '/')}`);
  process.exit(perfect === total ? 0 : 1);
}

main();
