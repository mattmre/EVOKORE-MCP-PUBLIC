import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';

const ROOT = path.resolve(__dirname, '../..');
const tilldonePath = path.join(ROOT, 'scripts', 'tilldone.js');

function makeTempHome(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'evokore-tilldone-nb-test-'));
}

async function rimraf(dir: string): Promise<void> {
  try { await fsp.rm(dir, { recursive: true, force: true }); } catch { /* ignore */ }
}

function clearRequireCache() {
  delete require.cache[require.resolve(tilldonePath)];
}

function tasksFilePath(home: string, sessionId: string): string {
  return path.join(home, '.evokore', 'sessions', `${sessionId}-tasks.json`);
}

function blocksFilePath(home: string, sessionId: string): string {
  return path.join(home, '.evokore', 'sessions', `${sessionId}-tilldone-blocks.json`);
}

function runCli(home: string, args: string[], extraEnv: Record<string, string> = {}) {
  const env = Object.assign({}, process.env, { HOME: home, USERPROFILE: home }, extraEnv);
  const r = spawnSync(process.execPath, [tilldonePath, ...args], {
    env,
    encoding: 'utf8',
    timeout: 10_000,
  });
  return { stdout: r.stdout || '', stderr: r.stderr || '', status: r.status };
}

function runHook(home: string, sessionId: string, extraEnv: Record<string, string> = {}) {
  const env = Object.assign({}, process.env, { HOME: home, USERPROFILE: home }, extraEnv);
  const r = spawnSync(process.execPath, [tilldonePath], {
    env,
    input: JSON.stringify({ session_id: sessionId }),
    encoding: 'utf8',
    timeout: 10_000,
  });
  return { stdout: r.stdout || '', stderr: r.stderr || '', status: r.status };
}

describe('tilldone non-blocking options (Fix 1)', () => {
  let home: string;
  // Drop env vars that might leak in from the parent shell so each test
  // observes a clean default-block baseline.
  const ENV_KEYS = [
    'EVOKORE_TILLDONE_MODE',
    'EVOKORE_TILLDONE_MAX_BLOCKS',
    'EVOKORE_TILLDONE_IDLE_TIMEOUT_MS',
  ];
  const savedEnv: Record<string, string | undefined> = {};

  beforeEach(() => {
    home = makeTempHome();
    clearRequireCache();
    for (const k of ENV_KEYS) {
      savedEnv[k] = process.env[k];
      delete process.env[k];
    }
  });

  afterEach(async () => {
    for (const k of ENV_KEYS) {
      if (savedEnv[k] === undefined) delete process.env[k];
      else process.env[k] = savedEnv[k]!;
    }
    await rimraf(home);
  });

  describe('helper exports', () => {
    it('exports the new helpers for non-blocking mode', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const tilldone = require(tilldonePath);
      expect(typeof tilldone.getTillDoneMode).toBe('function');
      expect(typeof tilldone.getMaxBlocks).toBe('function');
      expect(typeof tilldone.getIdleTimeoutMs).toBe('function');
      expect(typeof tilldone.blocksCounterPath).toBe('function');
      expect(typeof tilldone.readBlocksCounter).toBe('function');
      expect(typeof tilldone.writeBlocksCounter).toBe('function');
      expect(typeof tilldone.resetIfTasksUpdated).toBe('function');
      expect(typeof tilldone.getTasksIdleMs).toBe('function');
    });
  });

  describe('getTillDoneMode()', () => {
    it('returns "block" by default', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getTillDoneMode } = require(tilldonePath);
      expect(getTillDoneMode()).toBe('block');
    });

    it('returns "warn" / "off" / "block" for valid values, case-insensitive', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getTillDoneMode } = require(tilldonePath);
      process.env.EVOKORE_TILLDONE_MODE = 'warn';
      expect(getTillDoneMode()).toBe('warn');
      process.env.EVOKORE_TILLDONE_MODE = 'OFF';
      expect(getTillDoneMode()).toBe('off');
      process.env.EVOKORE_TILLDONE_MODE = 'Block';
      expect(getTillDoneMode()).toBe('block');
    });

    it('falls back to "block" on unknown values', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getTillDoneMode } = require(tilldonePath);
      process.env.EVOKORE_TILLDONE_MODE = 'nonsense';
      expect(getTillDoneMode()).toBe('block');
    });
  });

  describe('getMaxBlocks() / getIdleTimeoutMs()', () => {
    it('returns null when unset, empty, zero, negative, or non-numeric', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getMaxBlocks, getIdleTimeoutMs } = require(tilldonePath);
      expect(getMaxBlocks()).toBeNull();
      expect(getIdleTimeoutMs()).toBeNull();
      for (const bad of ['', '0', '-1', 'abc']) {
        process.env.EVOKORE_TILLDONE_MAX_BLOCKS = bad;
        process.env.EVOKORE_TILLDONE_IDLE_TIMEOUT_MS = bad;
        expect(getMaxBlocks()).toBeNull();
        expect(getIdleTimeoutMs()).toBeNull();
      }
    });

    it('parses positive integers', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getMaxBlocks, getIdleTimeoutMs } = require(tilldonePath);
      process.env.EVOKORE_TILLDONE_MAX_BLOCKS = '3';
      process.env.EVOKORE_TILLDONE_IDLE_TIMEOUT_MS = '600000';
      expect(getMaxBlocks()).toBe(3);
      expect(getIdleTimeoutMs()).toBe(600000);
    });
  });

  describe('hook mode: block (default behaviour)', () => {
    it('blocks with exit 2 when incomplete tasks remain', () => {
      const sid = 'block-default';
      runCli(home, ['--add', 'unfinished work', '--session', sid]);
      const r = runHook(home, sid);
      expect(r.status).toBe(2);
      expect(r.stderr).toContain('TillDone');
      expect(r.stderr).toContain('incomplete task');
    });

    it('allows with exit 0 when all tasks are complete', () => {
      const sid = 'block-clean';
      runCli(home, ['--add', 'work', '--session', sid]);
      runCli(home, ['--done', '1', '--session', sid]);
      const r = runHook(home, sid);
      expect(r.status).toBe(0);
    });
  });

  describe('hook mode: warn', () => {
    it('allows stop with exit 0 but prints the warning', () => {
      const sid = 'warn-mode';
      runCli(home, ['--add', 'leftover work', '--session', sid]);
      const r = runHook(home, sid, { EVOKORE_TILLDONE_MODE: 'warn' });
      expect(r.status).toBe(0);
      expect(r.stderr).toContain('TillDone');
      expect(r.stderr).toContain('1 incomplete');
      // Should surface the explanation that warn-mode allowed the stop.
      expect(r.stderr).toContain('warn');
    });

    it('still allows when no incomplete tasks (no surface noise required)', () => {
      const sid = 'warn-clean';
      const r = runHook(home, sid, { EVOKORE_TILLDONE_MODE: 'warn' });
      expect(r.status).toBe(0);
    });
  });

  describe('hook mode: off', () => {
    it('allows stop with exit 0 and skips the incomplete check entirely', () => {
      const sid = 'off-mode';
      runCli(home, ['--add', 'leftover work', '--session', sid]);
      const r = runHook(home, sid, { EVOKORE_TILLDONE_MODE: 'off' });
      expect(r.status).toBe(0);
      // off-mode is silent: should NOT print the incomplete-tasks warning.
      expect(r.stderr).not.toContain('incomplete task');
    });
  });

  describe('hook mode: block + EVOKORE_TILLDONE_MAX_BLOCKS', () => {
    it('blocks N-1 times then releases on the Nth Stop', () => {
      const sid = 'max-blocks';
      runCli(home, ['--add', 'persistent work', '--session', sid]);

      // Three blocks expected (max_blocks=3): two real blocks, third releases.
      const env = { EVOKORE_TILLDONE_MAX_BLOCKS: '3' };

      const r1 = runHook(home, sid, env);
      expect(r1.status).toBe(2);
      const r2 = runHook(home, sid, env);
      expect(r2.status).toBe(2);
      const r3 = runHook(home, sid, env);
      expect(r3.status).toBe(0);
      expect(r3.stderr).toContain('max_blocks');

      // Counter should be reset on the release boundary.
      const counter = JSON.parse(fs.readFileSync(blocksFilePath(home, sid), 'utf8'));
      expect(counter.count).toBe(0);
    });

    it('resets the counter when the tasks file is modified', async () => {
      const sid = 'max-blocks-reset';
      runCli(home, ['--add', 'task A', '--session', sid]);

      const env = { EVOKORE_TILLDONE_MAX_BLOCKS: '3' };

      // Two blocks accumulate.
      runHook(home, sid, env);
      runHook(home, sid, env);
      const beforeReset = JSON.parse(fs.readFileSync(blocksFilePath(home, sid), 'utf8'));
      expect(beforeReset.count).toBe(2);

      // Force the tasks file mtime to be newer than the counter file mtime
      // by waiting and then touching it via --add. Wait long enough that
      // mtime resolution (which can be coarse on Windows) sees a change.
      await new Promise((resolve) => setTimeout(resolve, 50));
      runCli(home, ['--add', 'task B', '--session', sid]);

      // The tasks file has just been updated. The next block should reset
      // the counter and increment it from zero, so we observe count=1.
      const r = runHook(home, sid, env);
      expect(r.status).toBe(2);
      const afterReset = JSON.parse(fs.readFileSync(blocksFilePath(home, sid), 'utf8'));
      expect(afterReset.count).toBe(1);
    });

    it('does not create a counter file when MAX_BLOCKS is unset', () => {
      const sid = 'no-counter';
      runCli(home, ['--add', 'work', '--session', sid]);
      const r = runHook(home, sid);
      expect(r.status).toBe(2);
      expect(fs.existsSync(blocksFilePath(home, sid))).toBe(false);
    });
  });

  describe('hook mode: block + EVOKORE_TILLDONE_IDLE_TIMEOUT_MS', () => {
    it('allows stop when the tasks file has been idle longer than the timeout', () => {
      const sid = 'idle-timeout';
      runCli(home, ['--add', 'stalled work', '--session', sid]);

      // Force the tasks file to look ancient by rewinding its mtime.
      const tp = tasksFilePath(home, sid);
      const ancient = new Date(Date.now() - 60_000);
      fs.utimesSync(tp, ancient, ancient);

      // 1s idle threshold, file is 60s idle → should release.
      const r = runHook(home, sid, { EVOKORE_TILLDONE_IDLE_TIMEOUT_MS: '1000' });
      expect(r.status).toBe(0);
      expect(r.stderr).toContain('idle_timeout');
    });

    it('still blocks when the tasks file is fresh', () => {
      const sid = 'idle-fresh';
      runCli(home, ['--add', 'fresh work', '--session', sid]);
      // 1h idle threshold; the file was just created → should block.
      const r = runHook(home, sid, { EVOKORE_TILLDONE_IDLE_TIMEOUT_MS: '3600000' });
      expect(r.status).toBe(2);
    });
  });

  describe('mtime-based reset edge cases', () => {
    it('resetIfTasksUpdated leaves counter unchanged when both files are missing', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { resetIfTasksUpdated } = require(tilldonePath);
      const counter = { count: 7, lastBlockedAt: 'whenever' };
      // No tasks file or counter file exists for this fake session id.
      const result = resetIfTasksUpdated('nonexistent-session', counter);
      expect(result).toEqual(counter);
    });
  });
});
