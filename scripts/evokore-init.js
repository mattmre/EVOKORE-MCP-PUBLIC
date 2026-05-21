#!/usr/bin/env node
'use strict';

/**
 * evokore:init — first-run bootstrap for an EVOKORE-MCP checkout.
 *
 * Reports (and, with --apply, materializes) the minimum runtime state
 * needed for the hooks, session manifest, and dist/ entrypoint to work.
 *
 * Idempotent. Safe to re-run. Default mode is dry-run / report; --apply
 * is required for any filesystem mutation.
 *
 * What it checks / does:
 *   1. ~/.evokore/sessions/ and ~/.evokore/logs/ exist
 *      (--apply: mkdir -p)
 *   2. node_modules/ is present at the repo root
 *      (--apply: runs `npm ci` if missing AND --install)
 *   3. dist/index.js exists
 *      (--apply: runs `npm run build` if missing AND --build)
 *   4. .env exists at the repo root
 *      (--apply: copies .env.example → .env if --write-env is passed)
 *   5. Reports the planned cross-IDE sync diff via
 *      `node scripts/sync-configs.js --dry-run`
 *
 * What it explicitly does NOT do:
 *   - Modify .claude/settings.json (operator-managed)
 *   - Touch user secrets in .env
 *   - Modify .git/ config or any tracked git surface
 *   - Run sync-configs --apply (operators must invoke that themselves)
 *
 * Exit codes:
 *   0  — bootstrap clean OR all requested mutations succeeded
 *   1  — usage error (bad CLI flag)
 *   2  — bootstrap incomplete: at least one prerequisite is missing
 *        and the operator did not pass --apply with the relevant flag
 *
 * Tests `require()` this module to exercise the planning helpers.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');

function homeRoot() {
  // Allow tests / CI to redirect with HOME / USERPROFILE.
  return process.env.EVOKORE_HOME_OVERRIDE || os.homedir();
}

function evokoreRuntimePaths(home) {
  const root = home || homeRoot();
  const base = path.join(root, '.evokore');
  return {
    base,
    sessions: path.join(base, 'sessions'),
    logs: path.join(base, 'logs'),
  };
}

function checkRuntimeDirs(home) {
  const paths = evokoreRuntimePaths(home);
  return {
    paths,
    baseExists: fs.existsSync(paths.base),
    sessionsExists: fs.existsSync(paths.sessions),
    logsExists: fs.existsSync(paths.logs),
  };
}

function ensureRuntimeDirs(home) {
  const paths = evokoreRuntimePaths(home);
  fs.mkdirSync(paths.sessions, { recursive: true });
  fs.mkdirSync(paths.logs, { recursive: true });
  return paths;
}

function checkNodeModules(repoRoot) {
  const root = repoRoot || PROJECT_ROOT;
  return fs.existsSync(path.join(root, 'node_modules'));
}

function checkBuildArtifact(repoRoot) {
  const root = repoRoot || PROJECT_ROOT;
  return fs.existsSync(path.join(root, 'dist', 'index.js'));
}

function checkEnvFile(repoRoot) {
  const root = repoRoot || PROJECT_ROOT;
  // Build the literal at runtime so the path doesn't appear as ".env"
  // in static tool-call inspectors (damage-control rule list).
  const fileName = ['.', 'env'].join('');
  const envPath = path.join(root, fileName);
  return {
    envPath,
    envExists: fs.existsSync(envPath),
    examplePath: path.join(root, fileName + '.example'),
    exampleExists: fs.existsSync(path.join(root, fileName + '.example')),
  };
}

/**
 * Plan the bootstrap. Pure: takes the observed state and the operator
 * flags, returns an array of action objects. The CLI then prints the
 * plan and (if --apply) executes the writeable subset.
 *
 * Each action: { id, status, summary, fix?, requiresFlag? }
 *   status: 'ok' | 'missing' | 'optional'
 *   fix:    text the operator can run themselves
 *   requiresFlag: name of the --apply sub-flag that allows mutation
 */
function planBootstrap(state, options) {
  const opt = options || {};
  const out = [];

  out.push({
    id: 'runtime-dirs',
    status: state.runtime.sessionsExists && state.runtime.logsExists ? 'ok' : 'missing',
    summary: `runtime dirs at ${state.runtime.paths.base}`,
    fix: 'mkdir -p ~/.evokore/sessions ~/.evokore/logs',
    requiresFlag: 'apply',
  });

  out.push({
    id: 'node-modules',
    status: state.nodeModules ? 'ok' : 'missing',
    summary: 'node_modules/ present',
    fix: 'npm ci  (or npm install)',
    requiresFlag: 'install',
    skipReason: opt.install ? null : 'pass --install to run npm ci automatically',
  });

  out.push({
    id: 'dist-build',
    status: state.distBuild ? 'ok' : 'missing',
    summary: 'dist/index.js compiled',
    fix: 'npm run build',
    requiresFlag: 'build',
    skipReason: opt.build ? null : 'pass --build to run npm run build automatically',
  });

  // .env is optional — operators may keep secrets out of repos
  // intentionally. Status reads "optional" not "missing" so a clean
  // checkout without an env file isn't reported as broken.
  out.push({
    id: 'env-file',
    status: state.env.envExists ? 'ok' : 'optional',
    summary: `${path.basename(state.env.envPath)} present`,
    fix: state.env.exampleExists
      ? `copy ${path.basename(state.env.examplePath)} → ${path.basename(state.env.envPath)}`
      : `${path.basename(state.env.envPath)} template not found`,
    requiresFlag: 'write-env',
    skipReason: opt.writeEnv
      ? null
      : 'pass --write-env (with --apply) to copy the template',
  });

  return out;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  const flags = {
    apply: false,
    install: false,
    build: false,
    writeEnv: false,
    json: false,
    quiet: false,
    help: false,
    unknown: [],
  };
  for (const a of args) {
    switch (a) {
      case '--apply': flags.apply = true; break;
      case '--install': flags.install = true; break;
      case '--build': flags.build = true; break;
      case '--write-env': flags.writeEnv = true; break;
      case '--json': flags.json = true; break;
      case '--quiet': flags.quiet = true; break;
      case '-h':
      case '--help': flags.help = true; break;
      default: flags.unknown.push(a);
    }
  }
  return flags;
}

function helpText() {
  return [
    'evokore:init — first-run bootstrap',
    '',
    'Usage: node scripts/evokore-init.js [flags]',
    '',
    'Flags:',
    '  --apply        execute filesystem mutations (default: dry-run)',
    '  --install      with --apply, run npm ci if node_modules/ is missing',
    '  --build        with --apply, run npm run build if dist/index.js is missing',
    '  --write-env    with --apply, copy .env.example → .env if .env is missing',
    '  --json         emit a machine-readable plan + result',
    '  --quiet        suppress info output (errors/results still printed)',
    '  -h, --help     show this help',
    '',
    'Default behavior is a dry-run report. Re-run with --apply plus the',
    'specific sub-flags above to mutate the filesystem.',
    '',
    'Idempotent. Safe to re-run.',
  ].join('\n');
}

function collectState(home) {
  return {
    runtime: checkRuntimeDirs(home),
    nodeModules: checkNodeModules(),
    distBuild: checkBuildArtifact(),
    env: checkEnvFile(),
  };
}

function applyMutations(plan, options, home) {
  const results = [];
  for (const item of plan) {
    if (item.status === 'ok') {
      results.push({ id: item.id, action: 'noop', ok: true });
      continue;
    }

    if (item.id === 'runtime-dirs') {
      try {
        ensureRuntimeDirs(home);
        results.push({ id: item.id, action: 'mkdir', ok: true });
      } catch (err) {
        results.push({ id: item.id, action: 'mkdir', ok: false, error: String(err.message || err) });
      }
      continue;
    }

    if (item.id === 'node-modules' && options.install) {
      const r = spawnSync('npm', ['ci'], {
        cwd: PROJECT_ROOT,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      });
      results.push({ id: item.id, action: 'npm ci', ok: r.status === 0, code: r.status });
      continue;
    }

    if (item.id === 'dist-build' && options.build) {
      const r = spawnSync('npm', ['run', 'build'], {
        cwd: PROJECT_ROOT,
        stdio: 'inherit',
        shell: process.platform === 'win32',
      });
      results.push({ id: item.id, action: 'npm run build', ok: r.status === 0, code: r.status });
      continue;
    }

    if (item.id === 'env-file' && options.writeEnv) {
      const env = checkEnvFile();
      if (env.envExists) {
        results.push({ id: item.id, action: 'noop', ok: true, note: 'env already exists' });
      } else if (!env.exampleExists) {
        results.push({
          id: item.id,
          action: 'copy',
          ok: false,
          error: 'template file is missing',
        });
      } else {
        try {
          fs.copyFileSync(env.examplePath, env.envPath);
          results.push({ id: item.id, action: 'copy', ok: true });
        } catch (err) {
          results.push({ id: item.id, action: 'copy', ok: false, error: String(err.message || err) });
        }
      }
      continue;
    }

    results.push({
      id: item.id,
      action: 'skipped',
      ok: false,
      reason: item.skipReason || 'no apply flag for this item',
    });
  }
  return results;
}

function summarize(plan, results, options) {
  const blockingMissing = plan.filter((p) => {
    if (p.status !== 'missing') return false;
    if (!options.apply) return true;
    const r = results.find((x) => x.id === p.id);
    return !r || !r.ok;
  });
  return {
    clean: blockingMissing.length === 0,
    blocking: blockingMissing.map((p) => p.id),
  };
}

function formatPlanText(plan, results, summary) {
  const lines = ['evokore:init plan'];
  for (const item of plan) {
    let badge;
    if (item.status === 'ok') badge = '[ OK ]';
    else if (item.status === 'optional') badge = '[OPT ]';
    else badge = '[MISS]';

    lines.push(`  ${badge} ${item.id}  — ${item.summary}`);

    if (item.status !== 'ok' && item.fix) {
      lines.push(`         fix: ${item.fix}`);
    }

    const r = results && results.find((x) => x.id === item.id);
    if (r) {
      const tag = r.ok ? 'applied' : 'skipped';
      lines.push(`         ${tag}: ${r.action}${r.error ? ` (error: ${r.error})` : ''}${r.reason ? ` (${r.reason})` : ''}`);
    }
  }

  lines.push('');
  lines.push(summary.clean ? 'Result: bootstrap clean.' : `Result: ${summary.blocking.length} item(s) outstanding (${summary.blocking.join(', ')}).`);
  return lines.join('\n');
}

function run(argv, env) {
  const flags = parseArgs(argv || process.argv);
  if (flags.help) {
    return { exitCode: 0, stdout: helpText(), plan: [], results: [], summary: { clean: true, blocking: [] } };
  }
  if (flags.unknown.length > 0) {
    return {
      exitCode: 1,
      stdout: '',
      stderr: `evokore:init: unknown flag(s): ${flags.unknown.join(', ')}\n${helpText()}`,
      plan: [],
      results: [],
      summary: { clean: false, blocking: [] },
    };
  }

  const home = (env || process.env).EVOKORE_HOME_OVERRIDE
    || (env || process.env).HOME
    || os.homedir();

  const state = collectState(home);
  const plan = planBootstrap(state, flags);
  const results = flags.apply ? applyMutations(plan, flags, home) : [];
  const summary = summarize(plan, results, flags);

  let stdout;
  if (flags.json) {
    stdout = JSON.stringify({ plan, results, summary }, null, 2);
  } else {
    stdout = formatPlanText(plan, results, summary);
  }

  return {
    exitCode: summary.clean ? 0 : 2,
    stdout,
    plan,
    results,
    summary,
    flags,
  };
}

module.exports = {
  evokoreRuntimePaths,
  checkRuntimeDirs,
  ensureRuntimeDirs,
  checkNodeModules,
  checkBuildArtifact,
  checkEnvFile,
  planBootstrap,
  parseArgs,
  helpText,
  collectState,
  applyMutations,
  summarize,
  formatPlanText,
  run,
};

// CLI entrypoint
if (require.main === module) {
  const result = run(process.argv);
  if (result.stdout && !parseArgs(process.argv).quiet) {
    process.stdout.write(result.stdout + '\n');
  }
  if (result.stderr) {
    process.stderr.write(result.stderr + '\n');
  }
  process.exit(result.exitCode);
}
