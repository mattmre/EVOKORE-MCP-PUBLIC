#!/usr/bin/env node
'use strict';

/**
 * Anti-slop runtime (PostToolUse hook).
 *
 * Detects "slop" patterns in the rolling tool-call replay and emits a
 * one-line stderr advisory when one fires. WARNING-ONLY: this hook
 * always exits 0 and never blocks tool execution. The autonomous-loop
 * guarantee ("no new blocking surfaces") is preserved by construction.
 *
 * Disabled by default. Operators opt in by setting:
 *   EVOKORE_ANTISLOP_HOOK=true
 *
 * Or implicitly via a protection profile (Fix 2) that sets it. Per-knob
 * env always wins.
 *
 * Patterns detected (kept conservative on purpose):
 *
 *   A. Re-read after edit
 *      Trigger: Read on file F, where the most recent prior tool call
 *      that touched F was Edit/Write/MultiEdit, with no other Edit
 *      in between.
 *      Why: CLAUDE.md says "Do NOT re-read a file you just edited to
 *      verify — Edit/Write would have errored if the change failed".
 *
 *   B. Repeated reads of the same path
 *      Trigger: 3 or more consecutive Read calls on the same file
 *      summary, with no Edit/Write between them.
 *      Why: Re-reading the same range usually means the agent is
 *      looking for something they already saw. Use offset/limit to
 *      jump, or scroll context.
 *
 *   C. Bash echo/printf for plain communication
 *      Trigger: Bash command that is just `echo TEXT` / `printf TEXT`
 *      with no redirection / pipe / variable expansion that would
 *      make the call serve a real shell purpose.
 *      Why: CLAUDE.md says "Communication: Output text directly".
 *
 * Each pattern is rate-limited: at most one stderr warning per
 * pattern per session. Counters live at
 *   ~/.evokore/sessions/{sessionId}-antislop.json
 *
 * The runtime is also exported as a module so its detectors can be
 * unit tested without touching disk.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

let resolveProtectionEnv;
try {
  // eslint-disable-next-line global-require
  ({ resolveProtectionEnv } = require('./protection-profile'));
} catch {
  // Fail open — if the resolver isn't available (for example when this
  // branch lands before the protection-profile branch), fall through to
  // a direct env check that mirrors the resolver's call signature.
  resolveProtectionEnv = (name, env) => {
    const source = env || process.env;
    const v = source[name];
    return v !== undefined && String(v).length > 0 ? String(v) : undefined;
  };
}

const SESSIONS_DIR = path.join(os.homedir(), '.evokore', 'sessions');

const EDIT_TOOLS = new Set(['Edit', 'Write', 'MultiEdit']);
const READ_TOOLS = new Set(['Read']);

/**
 * Decide whether the hook should run at all.
 * Default: disabled. Operators opt in via env or profile.
 */
function isEnabled(env) {
  const source = env || process.env;
  let value;
  try {
    value = resolveProtectionEnv('EVOKORE_ANTISLOP_HOOK', source);
  } catch {
    value = source.EVOKORE_ANTISLOP_HOOK;
  }
  if (value === undefined) return false;
  const norm = String(value).trim().toLowerCase();
  return norm === 'true' || norm === '1' || norm === 'on' || norm === 'yes';
}

/**
 * Read the last N replay entries (most recent last) for a session.
 * Returns [] on any error — the hook must always be best-effort.
 */
function readRecentReplay(sessionId, limit) {
  const max = Math.max(1, Number(limit) || 20);
  const replayPath = path.join(SESSIONS_DIR, `${sessionId}-replay.jsonl`);
  try {
    if (!fs.existsSync(replayPath)) return [];
    const raw = fs.readFileSync(replayPath, 'utf8');
    if (!raw) return [];
    const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
    const slice = lines.slice(-max);
    const out = [];
    for (const line of slice) {
      try {
        out.push(JSON.parse(line));
      } catch {
        // skip malformed lines
      }
    }
    return out;
  } catch {
    return [];
  }
}

function counterPath(sessionId) {
  return path.join(SESSIONS_DIR, `${sessionId}-antislop.json`);
}

function readCounters(sessionId) {
  try {
    const p = counterPath(sessionId);
    if (!fs.existsSync(p)) return {};
    const raw = fs.readFileSync(p, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writeCounters(sessionId, counters) {
  try {
    if (!fs.existsSync(SESSIONS_DIR)) {
      fs.mkdirSync(SESSIONS_DIR, { recursive: true });
    }
    fs.writeFileSync(
      counterPath(sessionId),
      JSON.stringify(counters, null, 2),
      'utf8',
    );
  } catch {
    // Best-effort.
  }
}

/**
 * Pattern A: Read on file F where the previous tool that touched F
 * was an Edit/Write. The current tool entry is the LAST element.
 */
function detectReadAfterEdit(replayEntries) {
  if (!Array.isArray(replayEntries) || replayEntries.length < 2) return null;
  const current = replayEntries[replayEntries.length - 1];
  if (!current || !READ_TOOLS.has(current.tool)) return null;
  const file = current.summary;
  if (!file) return null;
  // Walk backwards looking for the most recent prior call that names
  // this same file path.
  for (let i = replayEntries.length - 2; i >= 0; i -= 1) {
    const prev = replayEntries[i];
    if (!prev || prev.summary !== file) continue;
    if (EDIT_TOOLS.has(prev.tool)) {
      return {
        pattern: 'read_after_edit',
        file,
        message:
          'Re-reading a file you just edited. Edit/Write reliably reports failures — re-reading is wasteful context.',
      };
    }
    // If the previous touch on this file was already a Read, we keep
    // walking; pattern A is specifically about Edit→Read.
  }
  return null;
}

/**
 * Pattern B: 3+ consecutive Read entries with the same summary, with
 * no Edit/Write of that file between them.
 */
function detectRepeatedReads(replayEntries) {
  if (!Array.isArray(replayEntries) || replayEntries.length < 3) return null;
  const tail = replayEntries.slice(-3);
  for (const e of tail) {
    if (!e || !READ_TOOLS.has(e.tool)) return null;
  }
  const file = tail[0].summary;
  if (!file) return null;
  if (tail[1].summary !== file || tail[2].summary !== file) return null;
  return {
    pattern: 'repeated_reads',
    file,
    message:
      'Reading the same file 3+ times in a row without modification. Use offset/limit to seek, or scroll prior tool output instead.',
  };
}

/**
 * Pattern C: Bash command that is essentially just `echo TEXT` or
 * `printf TEXT` with nothing useful beyond it.
 */
function detectBashEcho(replayEntries) {
  if (!Array.isArray(replayEntries) || replayEntries.length < 1) return null;
  const current = replayEntries[replayEntries.length - 1];
  if (!current || current.tool !== 'Bash') return null;
  const cmd = String(current.summary || '').trim();
  if (!cmd) return null;
  // Bare echo / printf with no shell metacharacters that would make the
  // call serve a real purpose (redirect, pipe, command substitution,
  // variable expansion, multi-statement).
  const bareEcho = /^(echo|printf)\b\s+(?!.*[|<>`$;&])(?:["']?[^"']*["']?)\s*$/i;
  if (bareEcho.test(cmd)) {
    return {
      pattern: 'bash_echo_for_output',
      command: cmd.slice(0, 120),
      message:
        'Using bash echo/printf for plain communication. Output text directly in your message — no Bash needed.',
    };
  }
  return null;
}

const DETECTORS = [detectReadAfterEdit, detectRepeatedReads, detectBashEcho];

/**
 * Run all detectors against the recent replay. Returns the first match
 * whose pattern hasn't already been warned about for this session.
 */
function evaluate(sessionId, replayEntries) {
  const counters = readCounters(sessionId);
  for (const detector of DETECTORS) {
    let result;
    try {
      result = detector(replayEntries);
    } catch {
      result = null;
    }
    if (!result) continue;
    if (counters[result.pattern]) continue;
    counters[result.pattern] = {
      firstSeenAt: new Date().toISOString(),
      file: result.file || null,
      command: result.command || null,
    };
    writeCounters(sessionId, counters);
    return result;
  }
  return null;
}

function formatWarning(result) {
  return `[EVOKORE anti-slop] ${result.message}`;
}

module.exports = {
  isEnabled,
  readRecentReplay,
  counterPath,
  readCounters,
  writeCounters,
  detectReadAfterEdit,
  detectRepeatedReads,
  detectBashEcho,
  evaluate,
  formatWarning,
  // Exposed for tests; not part of the stable API.
  _SESSIONS_DIR: SESSIONS_DIR,
};

// --- Direct invocation (PostToolUse hook entrypoint) -----------------

const __mainFilename = (require.main && require.main.filename) || '';
const __mainBase = path.basename(__mainFilename);
const __isDirectInvocation =
  require.main === module ||
  (__mainBase === 'anti-slop.js' && path.basename(path.dirname(__mainFilename)) === 'hooks');

if (!__isDirectInvocation) {
  return;
}

let inputData = '';
process.stdin.on('data', (chunk) => { inputData += chunk; });
process.stdin.on('end', () => {
  try {
    if (!isEnabled()) {
      process.exit(0);
      return;
    }
    const payload = JSON.parse(inputData || '{}');
    const rawId = payload.session_id || '';
    const sessionId = String(rawId).replace(/[^a-zA-Z0-9_-]/g, '_');
    if (!sessionId) {
      process.exit(0);
      return;
    }
    // Pull the last 20 replay entries — enough for both consecutive-read
    // (3) and read-after-edit (~10 typical) detectors.
    const recent = readRecentReplay(sessionId, 20);
    if (recent.length === 0) {
      process.exit(0);
      return;
    }
    const result = evaluate(sessionId, recent);
    if (result) {
      process.stderr.write(formatWarning(result) + '\n');
    }
  } catch {
    // Never fail — always exit 0.
  }
  process.exit(0);
});
