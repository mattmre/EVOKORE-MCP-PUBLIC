import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import os from 'os';

const ROOT = path.resolve(__dirname, '../..');
const trustLedgerJsPath = path.join(ROOT, 'dist', 'TrustLedger.js');

function makeTempDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'evokore-trust-ledger-guard-test-'));
}

async function rimraf(dir: string): Promise<void> {
  try {
    await fsp.rm(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

describe('TrustLedger caller-identity guard', () => {
  let tmpDir: string;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { TrustLedger, TrustLedgerWriteDenied } = require(trustLedgerJsPath);
  const originalGuardEnv = process.env.EVOKORE_TRUST_LEDGER_GUARD;

  beforeEach(() => {
    tmpDir = makeTempDir();
    delete process.env.EVOKORE_TRUST_LEDGER_GUARD;
  });

  afterEach(async () => {
    if (originalGuardEnv === undefined) {
      delete process.env.EVOKORE_TRUST_LEDGER_GUARD;
    } else {
      process.env.EVOKORE_TRUST_LEDGER_GUARD = originalGuardEnv;
    }
    await rimraf(tmpDir);
  });

  describe('guard disabled (default)', () => {
    it('allows record() without caller identity', () => {
      const ledger = new TrustLedger('sess-guard-off-no-caller', tmpDir);
      const entry = ledger.record('agent-a', 'success');
      expect(entry.score).toBeCloseTo(0.51, 5);
    });

    it('allows record() with tenant-tier caller', () => {
      const ledger = new TrustLedger('sess-guard-off-tenant', tmpDir);
      const entry = ledger.record('agent-a', 'success', { source: 'random-tool', tier: 'tool' });
      expect(entry.score).toBeCloseTo(0.51, 5);
    });

    it('isGuardEnabled() reports false', () => {
      expect(TrustLedger.isGuardEnabled()).toBe(false);
    });
  });

  describe('guard enabled', () => {
    beforeEach(() => {
      process.env.EVOKORE_TRUST_LEDGER_GUARD = 'true';
    });

    it('isGuardEnabled() reports true for value="true"', () => {
      expect(TrustLedger.isGuardEnabled()).toBe(true);
    });

    it('isGuardEnabled() reports true for value="1"', () => {
      process.env.EVOKORE_TRUST_LEDGER_GUARD = '1';
      expect(TrustLedger.isGuardEnabled()).toBe(true);
    });

    it('isGuardEnabled() reports false for value="false"', () => {
      process.env.EVOKORE_TRUST_LEDGER_GUARD = 'false';
      expect(TrustLedger.isGuardEnabled()).toBe(false);
    });

    it('isGuardEnabled() reports false for value="0"', () => {
      process.env.EVOKORE_TRUST_LEDGER_GUARD = '0';
      expect(TrustLedger.isGuardEnabled()).toBe(false);
    });

    it('rejects record() with no caller identity', () => {
      const ledger = new TrustLedger('sess-guard-no-caller', tmpDir);
      expect(() => ledger.record('agent-a', 'success')).toThrow(TrustLedgerWriteDenied);
    });

    it('rejects record() with tenant-tier caller', () => {
      const ledger = new TrustLedger('sess-guard-tenant', tmpDir);
      expect(() =>
        ledger.record('agent-a', 'success', { source: 'malicious-tool', tier: 'tool' }),
      ).toThrow(TrustLedgerWriteDenied);
    });

    it('rejects record() with malformed tier', () => {
      const ledger = new TrustLedger('sess-guard-bad-tier', tmpDir);
      expect(() =>
        ledger.record('agent-a', 'success', { source: 'spoof', tier: 'admin' as any }),
      ).toThrow(TrustLedgerWriteDenied);
    });

    it('accepts record() with system-tier caller', () => {
      const ledger = new TrustLedger('sess-guard-system', tmpDir);
      const entry = ledger.record('agent-a', 'success', {
        source: 'orchestration-runtime',
        tier: 'system',
      });
      expect(entry.score).toBeCloseTo(0.51, 5);
    });

    it('accepts record() with hr-manager-tier caller', () => {
      const ledger = new TrustLedger('sess-guard-hr', tmpDir);
      const entry = ledger.record('agent-a', 'failure', {
        source: 'hr-cadence-runner',
        tier: 'hr-manager',
      });
      expect(entry.score).toBeCloseTo(0.45, 5);
    });

    it('does not persist a rejected write', () => {
      const ledger = new TrustLedger('sess-guard-no-persist', tmpDir);
      try {
        ledger.record('agent-a', 'gate_violation', { source: 'tool', tier: 'tool' });
      } catch {
        /* expected */
      }
      // Reload — agent should not exist on disk because the write was rejected
      const ledger2 = new TrustLedger('sess-guard-no-persist', tmpDir);
      expect(ledger2.getEntry('agent-a')).toBeUndefined();
    });

    it('error message includes caller info for diagnostics', () => {
      const ledger = new TrustLedger('sess-guard-msg', tmpDir);
      let caught: Error | undefined;
      try {
        ledger.record('agent-a', 'success', { source: 'tenant-x', tier: 'tool' });
      } catch (e) {
        caught = e as Error;
      }
      expect(caught).toBeDefined();
      expect(caught!.message).toContain("tier='tool'");
      expect(caught!.message).toContain("source='tenant-x'");
      expect(caught!.message).toContain('EVOKORE_TRUST_LEDGER_GUARD');
    });

    it('error message reflects missing caller', () => {
      const ledger = new TrustLedger('sess-guard-missing', tmpDir);
      let caught: Error | undefined;
      try {
        ledger.record('agent-a', 'success');
      } catch (e) {
        caught = e as Error;
      }
      expect(caught).toBeDefined();
      expect(caught!.message).toContain('no caller identity provided');
    });
  });

  describe('runtime toggling', () => {
    it('reads env var on every call (no startup caching)', () => {
      const ledger = new TrustLedger('sess-toggle', tmpDir);

      // Off by default — should succeed
      delete process.env.EVOKORE_TRUST_LEDGER_GUARD;
      expect(() => ledger.record('agent-a', 'success')).not.toThrow();

      // Toggle on — same instance, should now reject
      process.env.EVOKORE_TRUST_LEDGER_GUARD = 'true';
      expect(() => ledger.record('agent-a', 'success')).toThrow(TrustLedgerWriteDenied);

      // Toggle off again — should succeed
      delete process.env.EVOKORE_TRUST_LEDGER_GUARD;
      expect(() => ledger.record('agent-a', 'success')).not.toThrow();
    });
  });

  describe('TrustLedgerWriteDenied error class', () => {
    it('exports TrustLedgerWriteDenied', () => {
      expect(TrustLedgerWriteDenied).toBeDefined();
      expect(typeof TrustLedgerWriteDenied).toBe('function');
    });

    it('extends Error', () => {
      const err = new TrustLedgerWriteDenied('test');
      expect(err).toBeInstanceOf(Error);
    });

    it('has correct name property', () => {
      const err = new TrustLedgerWriteDenied('test');
      expect(err.name).toBe('TrustLedgerWriteDenied');
    });
  });
});
