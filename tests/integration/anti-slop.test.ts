import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import fsp from 'fs/promises';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = path.resolve(__dirname, '../..');
const RUNTIME_PATH = path.join(ROOT, 'scripts', 'anti-slop.js');
const HOOK_PATH = path.join(ROOT, 'scripts', 'hooks', 'anti-slop.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const antislop = require(RUNTIME_PATH) as {
  isEnabled: (env?: NodeJS.ProcessEnv) => boolean;
  readRecentReplay: (sessionId: string, limit?: number) => unknown[];
  counterPath: (sessionId: string) => string;
  readCounters: (sessionId: string) => Record<string, unknown>;
  writeCounters: (sessionId: string, counters: Record<string, unknown>) => void;
  detectReadAfterEdit: (entries: unknown[]) => Record<string, unknown> | null;
  detectRepeatedReads: (entries: unknown[]) => Record<string, unknown> | null;
  detectBashEcho: (entries: unknown[]) => Record<string, unknown> | null;
  evaluate: (sessionId: string, entries: unknown[]) => Record<string, unknown> | null;
  formatWarning: (result: { message: string }) => string;
};

const ENV_KEYS = [
  'EVOKORE_ANTISLOP_HOOK',
  'EVOKORE_PROTECTION_PROFILE',
];

function makeTempHome(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'evokore-antislop-'));
}

async function rimraf(dir: string): Promise<void> {
  try { await fsp.rm(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

function runHook(home: string, payload: object, env: Record<string, string | undefined> = {}) {
  const fullEnv: Record<string, string | undefined> = Object.assign(
    {},
    process.env,
    { HOME: home, USERPROFILE: home },
    env,
  );
  for (const k of Object.keys(env)) {
    if (env[k] === undefined) delete fullEnv[k];
  }
  const r = spawnSync(process.execPath, [HOOK_PATH], {
    env: fullEnv as NodeJS.ProcessEnv,
    input: JSON.stringify(payload),
    encoding: 'utf8',
    timeout: 10_000,
  });
  return { stdout: r.stdout || '', stderr: r.stderr || '', status: r.status };
}

function writeReplay(home: string, sessionId: string, entries: object[]): void {
  const dir = path.join(home, '.evokore', 'sessions');
  fs.mkdirSync(dir, { recursive: true });
  const replayPath = path.join(dir, `${sessionId}-replay.jsonl`);
  fs.writeFileSync(
    replayPath,
    entries.map((e) => JSON.stringify(e)).join('\n') + '\n',
  );
}

describe('anti-slop runtime', () => {
  const saved: Record<string, string | undefined> = {};

  beforeEach(() => {
    for (const k of ENV_KEYS) {
      saved[k] = process.env[k];
      delete process.env[k];
    }
  });

  afterEach(() => {
    for (const k of ENV_KEYS) {
      if (saved[k] === undefined) delete process.env[k];
      else process.env[k] = saved[k]!;
    }
  });

  describe('isEnabled()', () => {
    it('returns false when no env or profile is set (default off)', () => {
      expect(antislop.isEnabled()).toBe(false);
    });

    it('returns true on truthy env values', () => {
      for (const v of ['true', '1', 'on', 'yes', 'TRUE', 'On']) {
        expect(antislop.isEnabled({ EVOKORE_ANTISLOP_HOOK: v })).toBe(true);
      }
    });

    it('returns false on falsy/explicit-off values', () => {
      for (const v of ['false', '0', 'off', '', 'no']) {
        expect(antislop.isEnabled({ EVOKORE_ANTISLOP_HOOK: v })).toBe(false);
      }
    });
  });

  describe('detectReadAfterEdit()', () => {
    it('flags a Read that immediately follows an Edit on the same path', () => {
      const r = antislop.detectReadAfterEdit([
        { tool: 'Edit', summary: 'src/foo.ts' },
        { tool: 'Read', summary: 'src/foo.ts' },
      ]);
      expect(r).not.toBeNull();
      expect(r!.pattern).toBe('read_after_edit');
      expect(r!.file).toBe('src/foo.ts');
    });

    it('flags Read after Write or MultiEdit on the same path', () => {
      expect(
        antislop.detectReadAfterEdit([
          { tool: 'Write', summary: 'a.ts' },
          { tool: 'Read', summary: 'a.ts' },
        ]),
      ).not.toBeNull();
      expect(
        antislop.detectReadAfterEdit([
          { tool: 'MultiEdit', summary: 'b.ts' },
          { tool: 'Read', summary: 'b.ts' },
        ]),
      ).not.toBeNull();
    });

    it('does not flag Read after Edit on a different file', () => {
      expect(
        antislop.detectReadAfterEdit([
          { tool: 'Edit', summary: 'a.ts' },
          { tool: 'Read', summary: 'b.ts' },
        ]),
      ).toBeNull();
    });

    it('does not flag Read on the same file when there was no Edit before', () => {
      expect(
        antislop.detectReadAfterEdit([
          { tool: 'Read', summary: 'a.ts' },
          { tool: 'Read', summary: 'a.ts' },
        ]),
      ).toBeNull();
    });

    it('walks back across unrelated tool calls to find the prior Edit', () => {
      const r = antislop.detectReadAfterEdit([
        { tool: 'Edit', summary: 'a.ts' },
        { tool: 'Bash', summary: 'npm test' },
        { tool: 'Grep', summary: 'pattern: foo' },
        { tool: 'Read', summary: 'a.ts' },
      ]);
      expect(r).not.toBeNull();
      expect(r!.pattern).toBe('read_after_edit');
    });

    it('returns null on short or empty input', () => {
      expect(antislop.detectReadAfterEdit([])).toBeNull();
      expect(antislop.detectReadAfterEdit([{ tool: 'Read', summary: 'a.ts' }])).toBeNull();
    });
  });

  describe('detectRepeatedReads()', () => {
    it('flags 3 consecutive Reads of the same path', () => {
      const r = antislop.detectRepeatedReads([
        { tool: 'Read', summary: 'a.ts' },
        { tool: 'Read', summary: 'a.ts' },
        { tool: 'Read', summary: 'a.ts' },
      ]);
      expect(r).not.toBeNull();
      expect(r!.pattern).toBe('repeated_reads');
      expect(r!.file).toBe('a.ts');
    });

    it('does not flag 2 consecutive reads', () => {
      expect(
        antislop.detectRepeatedReads([
          { tool: 'Read', summary: 'a.ts' },
          { tool: 'Read', summary: 'a.ts' },
        ]),
      ).toBeNull();
    });

    it('does not flag if any of the 3 most recent is not a Read', () => {
      expect(
        antislop.detectRepeatedReads([
          { tool: 'Read', summary: 'a.ts' },
          { tool: 'Bash', summary: 'ls' },
          { tool: 'Read', summary: 'a.ts' },
        ]),
      ).toBeNull();
    });

    it('does not flag if the 3 reads target different files', () => {
      expect(
        antislop.detectRepeatedReads([
          { tool: 'Read', summary: 'a.ts' },
          { tool: 'Read', summary: 'b.ts' },
          { tool: 'Read', summary: 'a.ts' },
        ]),
      ).toBeNull();
    });
  });

  describe('detectBashEcho()', () => {
    it('flags bare echo/printf calls', () => {
      expect(antislop.detectBashEcho([{ tool: 'Bash', summary: 'echo hello' }])).not.toBeNull();
      expect(antislop.detectBashEcho([{ tool: 'Bash', summary: 'printf "done"' }])).not.toBeNull();
    });

    it('does not flag echo with redirection or pipes', () => {
      expect(antislop.detectBashEcho([{ tool: 'Bash', summary: 'echo hi > /tmp/foo' }])).toBeNull();
      expect(antislop.detectBashEcho([{ tool: 'Bash', summary: 'echo $PATH' }])).toBeNull();
      expect(antislop.detectBashEcho([{ tool: 'Bash', summary: 'echo a | tee b' }])).toBeNull();
    });

    it('does not flag non-Bash tools', () => {
      expect(antislop.detectBashEcho([{ tool: 'Read', summary: 'echo a' }])).toBeNull();
    });
  });

  describe('evaluate() — rate limiting', () => {
    let home: string;
    let savedHome: string | undefined;
    let savedUserProfile: string | undefined;

    beforeEach(() => {
      home = makeTempHome();
      savedHome = process.env.HOME;
      savedUserProfile = process.env.USERPROFILE;
      process.env.HOME = home;
      process.env.USERPROFILE = home;
    });

    afterEach(async () => {
      if (savedHome === undefined) delete process.env.HOME;
      else process.env.HOME = savedHome;
      if (savedUserProfile === undefined) delete process.env.USERPROFILE;
      else process.env.USERPROFILE = savedUserProfile;
      await rimraf(home);
    });

    it('returns the first matching pattern then suppresses repeats', () => {
      // Re-require with a clean module cache so the SESSIONS_DIR re-resolves
      // against the temp HOME we set above.
      delete require.cache[require.resolve(RUNTIME_PATH)];
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const a = require(RUNTIME_PATH) as typeof antislop;

      const entries = [
        { tool: 'Edit', summary: 'src/foo.ts' },
        { tool: 'Read', summary: 'src/foo.ts' },
      ];

      const first = a.evaluate('rate-limit-session', entries);
      expect(first).not.toBeNull();
      expect(first!.pattern).toBe('read_after_edit');

      const second = a.evaluate('rate-limit-session', entries);
      expect(second).toBeNull();

      // Different session → still triggers.
      const third = a.evaluate('rate-limit-session-2', entries);
      expect(third).not.toBeNull();
    });
  });

  describe('hook entrypoint', () => {
    let home: string;

    beforeEach(() => {
      home = makeTempHome();
    });

    afterEach(async () => {
      await rimraf(home);
    });

    it('exits 0 silently when disabled (default)', () => {
      writeReplay(home, 'sid', [
        { tool: 'Edit', summary: 'a.ts' },
        { tool: 'Read', summary: 'a.ts' },
      ]);
      const r = runHook(home, { session_id: 'sid' });
      expect(r.status).toBe(0);
      expect(r.stdout).toBe('');
      // Hook must produce no anti-slop warning when disabled even if a
      // pattern would otherwise match.
      expect(r.stderr).not.toContain('anti-slop');
    });

    it('exits 0 silently when enabled but no patterns match', () => {
      writeReplay(home, 'sid-clean', [
        { tool: 'Read', summary: 'a.ts' },
        { tool: 'Edit', summary: 'a.ts' },
      ]);
      const r = runHook(home, { session_id: 'sid-clean' }, { EVOKORE_ANTISLOP_HOOK: 'true' });
      expect(r.status).toBe(0);
      expect(r.stderr).not.toContain('anti-slop');
    });

    it('emits a warning to stderr when enabled and read-after-edit matches', () => {
      writeReplay(home, 'sid-warn', [
        { tool: 'Edit', summary: 'a.ts' },
        { tool: 'Read', summary: 'a.ts' },
      ]);
      const r = runHook(home, { session_id: 'sid-warn' }, { EVOKORE_ANTISLOP_HOOK: 'true' });
      expect(r.status).toBe(0);
      expect(r.stderr).toContain('anti-slop');
      expect(r.stderr).toContain('Re-reading');
    });

    it('only warns once per pattern per session', () => {
      writeReplay(home, 'sid-once', [
        { tool: 'Edit', summary: 'a.ts' },
        { tool: 'Read', summary: 'a.ts' },
      ]);
      const r1 = runHook(home, { session_id: 'sid-once' }, { EVOKORE_ANTISLOP_HOOK: 'true' });
      expect(r1.stderr).toContain('anti-slop');
      const r2 = runHook(home, { session_id: 'sid-once' }, { EVOKORE_ANTISLOP_HOOK: 'true' });
      expect(r2.status).toBe(0);
      expect(r2.stderr).not.toContain('anti-slop');
    });

    it('survives malformed payload without crashing', () => {
      const r = spawnSync(process.execPath, [HOOK_PATH], {
        env: Object.assign({}, process.env, {
          HOME: home,
          USERPROFILE: home,
          EVOKORE_ANTISLOP_HOOK: 'true',
        }),
        input: '{not valid json',
        encoding: 'utf8',
        timeout: 10_000,
      });
      expect(r.status).toBe(0);
    });
  });
});
