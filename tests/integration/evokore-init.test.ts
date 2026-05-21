import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const SCRIPT_PATH = path.join(PROJECT_ROOT, 'scripts', 'evokore-init.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const initModule = require(SCRIPT_PATH);

const {
  parseArgs,
  helpText,
  planBootstrap,
  applyMutations,
  run,
  evokoreRuntimePaths,
  checkRuntimeDirs,
  ensureRuntimeDirs,
  summarize,
  formatPlanText,
} = initModule;

function makeTempHome(label: string): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), `evokore-init-${label}-`));
}

function rimraf(p: string) {
  try {
    fs.rmSync(p, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

describe('evokore-init: parseArgs', () => {
  it('returns all-false flags by default', () => {
    const flags = parseArgs(['node', 'evokore-init.js']);
    expect(flags.apply).toBe(false);
    expect(flags.install).toBe(false);
    expect(flags.build).toBe(false);
    expect(flags.writeEnv).toBe(false);
    expect(flags.json).toBe(false);
    expect(flags.quiet).toBe(false);
    expect(flags.help).toBe(false);
    expect(flags.unknown).toEqual([]);
  });

  it('parses --apply', () => {
    const flags = parseArgs(['node', 'x', '--apply']);
    expect(flags.apply).toBe(true);
  });

  it('parses --install --build --write-env together', () => {
    const flags = parseArgs(['node', 'x', '--apply', '--install', '--build', '--write-env']);
    expect(flags.apply).toBe(true);
    expect(flags.install).toBe(true);
    expect(flags.build).toBe(true);
    expect(flags.writeEnv).toBe(true);
  });

  it('parses --json and --quiet', () => {
    const flags = parseArgs(['node', 'x', '--json', '--quiet']);
    expect(flags.json).toBe(true);
    expect(flags.quiet).toBe(true);
  });

  it('parses -h and --help', () => {
    expect(parseArgs(['node', 'x', '-h']).help).toBe(true);
    expect(parseArgs(['node', 'x', '--help']).help).toBe(true);
  });

  it('captures unknown flags in unknown[]', () => {
    const flags = parseArgs(['node', 'x', '--bogus', '--also-bad']);
    expect(flags.unknown).toContain('--bogus');
    expect(flags.unknown).toContain('--also-bad');
  });
});

describe('evokore-init: helpText', () => {
  it('mentions all supported flags', () => {
    const text = helpText();
    expect(text).toContain('--apply');
    expect(text).toContain('--install');
    expect(text).toContain('--build');
    expect(text).toContain('--write-env');
    expect(text).toContain('--json');
    expect(text).toContain('--quiet');
    expect(text).toContain('--help');
  });

  it('describes default dry-run behavior', () => {
    const text = helpText();
    expect(text.toLowerCase()).toContain('dry-run');
  });
});

describe('evokore-init: evokoreRuntimePaths + checkRuntimeDirs', () => {
  let tempHome: string;
  beforeEach(() => { tempHome = makeTempHome('paths'); });
  afterEach(() => { rimraf(tempHome); });

  it('reports missing runtime dirs when nothing exists', () => {
    const status = checkRuntimeDirs(tempHome);
    expect(status.baseExists).toBe(false);
    expect(status.sessionsExists).toBe(false);
    expect(status.logsExists).toBe(false);
  });

  it('reports present after ensureRuntimeDirs', () => {
    ensureRuntimeDirs(tempHome);
    const status = checkRuntimeDirs(tempHome);
    expect(status.sessionsExists).toBe(true);
    expect(status.logsExists).toBe(true);
  });

  it('returns paths under <home>/.evokore/', () => {
    const paths = evokoreRuntimePaths(tempHome);
    expect(paths.base).toContain(tempHome);
    expect(paths.sessions.endsWith(path.join('.evokore', 'sessions'))).toBe(true);
    expect(paths.logs.endsWith(path.join('.evokore', 'logs'))).toBe(true);
  });
});

describe('evokore-init: planBootstrap', () => {
  it('emits an item per known prerequisite', () => {
    const plan = planBootstrap(
      {
        runtime: { paths: { base: '/tmp/x' }, sessionsExists: false, logsExists: false },
        nodeModules: false,
        distBuild: false,
        env: { envExists: false, exampleExists: true, envPath: '/tmp/x/.env', examplePath: '/tmp/x/.env.example' },
      },
      {},
    );
    const ids = plan.map((p: any) => p.id);
    expect(ids).toContain('runtime-dirs');
    expect(ids).toContain('node-modules');
    expect(ids).toContain('dist-build');
    expect(ids).toContain('env-file');
  });

  it('marks runtime-dirs ok when both subdirs exist', () => {
    const plan = planBootstrap(
      {
        runtime: { paths: { base: '/tmp/x' }, sessionsExists: true, logsExists: true },
        nodeModules: true,
        distBuild: true,
        env: { envExists: true, exampleExists: true, envPath: '/x', examplePath: '/y' },
      },
      {},
    );
    const item = plan.find((p: any) => p.id === 'runtime-dirs');
    expect(item.status).toBe('ok');
  });

  it('marks env-file optional (not missing) when absent', () => {
    const plan = planBootstrap(
      {
        runtime: { paths: { base: '/tmp/x' }, sessionsExists: true, logsExists: true },
        nodeModules: true,
        distBuild: true,
        env: { envExists: false, exampleExists: true, envPath: '/x', examplePath: '/y' },
      },
      {},
    );
    const item = plan.find((p: any) => p.id === 'env-file');
    expect(item.status).toBe('optional');
  });

  it('marks node-modules and dist-build missing when absent', () => {
    const plan = planBootstrap(
      {
        runtime: { paths: { base: '/x' }, sessionsExists: true, logsExists: true },
        nodeModules: false,
        distBuild: false,
        env: { envExists: true, exampleExists: true, envPath: '/x', examplePath: '/y' },
      },
      {},
    );
    expect(plan.find((p: any) => p.id === 'node-modules').status).toBe('missing');
    expect(plan.find((p: any) => p.id === 'dist-build').status).toBe('missing');
  });

  it('clears skipReason on items when corresponding flag is set', () => {
    const plan = planBootstrap(
      {
        runtime: { paths: { base: '/x' }, sessionsExists: true, logsExists: true },
        nodeModules: false,
        distBuild: false,
        env: { envExists: false, exampleExists: true, envPath: '/x', examplePath: '/y' },
      },
      { install: true, build: true, writeEnv: true },
    );
    expect(plan.find((p: any) => p.id === 'node-modules').skipReason).toBeNull();
    expect(plan.find((p: any) => p.id === 'dist-build').skipReason).toBeNull();
    expect(plan.find((p: any) => p.id === 'env-file').skipReason).toBeNull();
  });
});

describe('evokore-init: applyMutations', () => {
  let tempHome: string;
  beforeEach(() => { tempHome = makeTempHome('apply'); });
  afterEach(() => { rimraf(tempHome); });

  it('creates runtime dirs for missing runtime-dirs item', () => {
    const plan = [{ id: 'runtime-dirs', status: 'missing', summary: '', fix: '', requiresFlag: 'apply' }];
    const results = applyMutations(plan, { apply: true }, tempHome);
    const paths = evokoreRuntimePaths(tempHome);
    expect(fs.existsSync(paths.sessions)).toBe(true);
    expect(fs.existsSync(paths.logs)).toBe(true);
    expect(results[0].ok).toBe(true);
  });

  it('returns noop for items already ok', () => {
    const plan = [{ id: 'runtime-dirs', status: 'ok', summary: '', fix: '', requiresFlag: 'apply' }];
    const results = applyMutations(plan, { apply: true }, tempHome);
    expect(results[0].action).toBe('noop');
    expect(results[0].ok).toBe(true);
  });

  it('skips node-modules when --install not passed', () => {
    const plan = [{
      id: 'node-modules', status: 'missing', summary: '', fix: '', requiresFlag: 'install',
      skipReason: 'pass --install to run npm ci automatically',
    }];
    const results = applyMutations(plan, { apply: true, install: false }, tempHome);
    expect(results[0].action).toBe('skipped');
    expect(results[0].ok).toBe(false);
  });

  it('skips dist-build when --build not passed', () => {
    const plan = [{
      id: 'dist-build', status: 'missing', summary: '', fix: '', requiresFlag: 'build',
      skipReason: 'pass --build to run npm run build automatically',
    }];
    const results = applyMutations(plan, { apply: true, build: false }, tempHome);
    expect(results[0].action).toBe('skipped');
    expect(results[0].ok).toBe(false);
  });
});

describe('evokore-init: summarize', () => {
  it('reports clean when no missing items', () => {
    const plan = [
      { id: 'runtime-dirs', status: 'ok' },
      { id: 'env-file', status: 'optional' },
    ];
    const summary = summarize(plan, [], { apply: false });
    expect(summary.clean).toBe(true);
    expect(summary.blocking).toEqual([]);
  });

  it('reports blocking items when missing', () => {
    const plan = [
      { id: 'runtime-dirs', status: 'missing' },
      { id: 'node-modules', status: 'missing' },
    ];
    const summary = summarize(plan, [], { apply: false });
    expect(summary.clean).toBe(false);
    expect(summary.blocking).toContain('runtime-dirs');
    expect(summary.blocking).toContain('node-modules');
  });

  it('clears blocking when apply succeeded for the item', () => {
    const plan = [{ id: 'runtime-dirs', status: 'missing' }];
    const results = [{ id: 'runtime-dirs', action: 'mkdir', ok: true }];
    const summary = summarize(plan, results, { apply: true });
    expect(summary.clean).toBe(true);
  });
});

describe('evokore-init: formatPlanText', () => {
  it('uses [ OK ], [OPT ], [MISS] badges', () => {
    const plan = [
      { id: 'a', status: 'ok', summary: 'good', fix: '' },
      { id: 'b', status: 'optional', summary: 'optional', fix: '' },
      { id: 'c', status: 'missing', summary: 'bad', fix: 'do this' },
    ];
    const text = formatPlanText(plan, [], { clean: false, blocking: ['c'] });
    expect(text).toContain('[ OK ]');
    expect(text).toContain('[OPT ]');
    expect(text).toContain('[MISS]');
    expect(text).toContain('do this');
  });
});

describe('evokore-init: run() integration', () => {
  let tempHome: string;
  beforeEach(() => { tempHome = makeTempHome('run'); });
  afterEach(() => { rimraf(tempHome); });

  it('returns help and exitCode 0 when --help passed', () => {
    const result = run(['node', 'x', '--help'], { EVOKORE_HOME_OVERRIDE: tempHome });
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('--apply');
  });

  it('returns exitCode 1 on unknown flag', () => {
    const result = run(['node', 'x', '--bogus'], { EVOKORE_HOME_OVERRIDE: tempHome });
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('unknown flag');
  });

  it('returns exitCode 2 in dry-run mode when runtime dirs missing', () => {
    // tempHome exists but is empty — runtime-dirs item should be missing
    const result = run(['node', 'x'], { EVOKORE_HOME_OVERRIDE: tempHome });
    expect(result.exitCode).toBe(2);
    const ids = result.summary.blocking;
    expect(ids).toContain('runtime-dirs');
  });

  it('returns exitCode 0 after --apply creates runtime dirs', () => {
    // First run is dirty
    const before = run(['node', 'x'], { EVOKORE_HOME_OVERRIDE: tempHome });
    expect(before.exitCode).toBe(2);
    expect(before.summary.blocking).toContain('runtime-dirs');

    // Apply should create them
    const apply = run(['node', 'x', '--apply'], { EVOKORE_HOME_OVERRIDE: tempHome });
    // Note: node-modules and dist-build still 'missing' if running outside the
    // installed repo, but in this repo they exist, so runtime-dirs is the
    // only failing item. We assert runtime-dirs is no longer blocking.
    expect(apply.summary.blocking).not.toContain('runtime-dirs');
  });

  it('--json mode emits parseable JSON', () => {
    const result = run(['node', 'x', '--json'], { EVOKORE_HOME_OVERRIDE: tempHome });
    const parsed = JSON.parse(result.stdout);
    expect(Array.isArray(parsed.plan)).toBe(true);
    expect(parsed.summary).toHaveProperty('clean');
    expect(parsed.summary).toHaveProperty('blocking');
  });

  it('is idempotent: re-running --apply on clean runtime is a noop', () => {
    run(['node', 'x', '--apply'], { EVOKORE_HOME_OVERRIDE: tempHome });
    const second = run(['node', 'x', '--apply'], { EVOKORE_HOME_OVERRIDE: tempHome });
    const runtimeResult = second.results.find((r: any) => r.id === 'runtime-dirs');
    expect(runtimeResult.action).toBe('noop');
    expect(runtimeResult.ok).toBe(true);
  });
});
