// @AI:NAV[SEC:imports] imports
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
// @AI:NAV[END:imports]

// @AI:NAV[SEC:types] types
export type TrustTier = 'Trusted' | 'Standard' | 'Probation' | 'Untrusted';

export type TrustEvent = 'success' | 'failure' | 'gate_violation';

export interface AgentTrustEntry {
  agentId: string;
  score: number;         // 0.0–1.0, initial 0.5
  tier: TrustTier;
  lastUpdated: string;   // ISO timestamp
  events: number;        // total event count
}

export interface TrustLedgerState {
  sessionId: string;
  agents: Record<string, AgentTrustEntry>;
  updatedAt: string;
}

export interface TrustReport {
  agents: AgentTrustEntry[];
  summary: {
    trusted: number;
    standard: number;
    probation: number;
    untrusted: number;
  };
}

/**
 * Caller-identity descriptor for `TrustLedger.record()`.
 *
 * When the guard is enabled (see `EVOKORE_TRUST_LEDGER_GUARD`), only callers
 * whose `tier` is `'system'` or `'hr-manager'` are permitted to write trust
 * signals. The `source` field is a free-form identifier (e.g.,
 * `'hr-cadence-runner'`, `'session-trust-bootstrap'`) used for audit/log
 * attribution; it is not validated.
 *
 * Tier semantics:
 *   - `'system'`: internal runtime callers (e.g., orchestration runtime,
 *     bootstrap, audit pipelines).
 *   - `'hr-manager'`: the HR cadence runner that maintains archetype scores.
 *   - `'tool'`: any tenant tool surface. Tenant-tier callers are rejected
 *     when the guard is on. Always rejected even if `source` looks
 *     trustworthy — the tier is the privilege boundary, not the source string.
 */
export interface CallerIdentity {
  source: string;
  tier: 'system' | 'hr-manager' | 'tool';
}
// @AI:NAV[END:types]

// @AI:NAV[SEC:errors] errors
/**
 * Thrown by `TrustLedger.record()` when the caller-identity guard is
 * enabled and the caller is missing or insufficiently privileged.
 *
 * The guard exists to prevent tenant tools from forging trust signals
 * for themselves or other agents. Catch this error if you want to fall
 * back to non-trust-affecting behaviour; otherwise let it propagate so
 * the violation is visible.
 */
export class TrustLedgerWriteDenied extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TrustLedgerWriteDenied';
  }
}
// @AI:NAV[END:errors]

// @AI:NAV[SEC:constants] constants
const INITIAL_SCORE = 0.5;
const SCORE_DELTAS: Record<TrustEvent, number> = {
  success: 0.01,
  failure: -0.05,
  gate_violation: -0.10,
};
const IDLE_DECAY_PER_HOUR = -0.005;
const TIER_MULTIPLIERS: Record<TrustTier, number> = {
  Trusted: 2,
  Standard: 1,
  Probation: 0.5,
  Untrusted: 0.1,
};
// @AI:NAV[END:constants]

/**
 * TrustLedger — per-agent trust scoring with tiered throughput multipliers,
 * idle decay, and persistence under `~/.evokore/sessions/{sessionId}-trust.json`.
 *
 * Scores are clamped to [0.0, 1.0]. Tier thresholds:
 *   Trusted  ≥ 0.8
 *   Standard ≥ 0.5
 *   Probation ≥ 0.3
 *   Untrusted < 0.3
 *
 * Persistence writes fail silently (infra pattern). Reads fall back to a fresh
 * state on any parse/IO error.
 */
// @AI:NAV[SEC:class-trustledger] class TrustLedger
export class TrustLedger {
  private readonly sessionId: string;
  private readonly filePath: string;
  private state: TrustLedgerState;

  constructor(sessionId: string, baseDir?: string) {
    this.sessionId = sessionId;
    const dir = baseDir ?? path.join(os.homedir(), '.evokore', 'sessions');
    this.filePath = path.join(dir, `${sessionId}-trust.json`);
    this.state = this.load(dir);
  }

  // @AI:NAV[SEC:load] load
  private load(dir: string): TrustLedgerState {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.agents) {
          return {
            sessionId: typeof parsed.sessionId === 'string' ? parsed.sessionId : this.sessionId,
            agents: parsed.agents,
            updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fall through to fresh state.
    }
    // Ensure the persistence directory exists so later writes succeed.
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // Fail silently — persistence is best-effort.
    }
    return {
      sessionId: this.sessionId,
      agents: {},
      updatedAt: new Date().toISOString(),
    };
  }
  // @AI:NAV[END:load]

  // @AI:NAV[SEC:record] record
  /**
   * Record a trust event for an agent.
   *
   * When the caller-identity guard is enabled (env var
   * `EVOKORE_TRUST_LEDGER_GUARD` is `'true'` or `'1'`), the optional
   * `caller` parameter becomes mandatory and must have a `tier` of
   * `'system'` or `'hr-manager'`. Tenant-tier callers (`tier: 'tool'`)
   * and missing identities are rejected with `TrustLedgerWriteDenied`.
   *
   * When the guard is disabled (default), the `caller` parameter is
   * accepted but ignored, preserving backward compatibility with all
   * existing callers and tests.
   *
   * The env var is read on every call so operators can flip the guard
   * on or off without restarting the runtime.
   */
  record(agentId: string, event: TrustEvent, caller?: CallerIdentity): AgentTrustEntry {
    if (TrustLedger.isGuardEnabled()) {
      if (!caller || (caller.tier !== 'system' && caller.tier !== 'hr-manager')) {
        const callerDesc = caller
          ? `tier='${caller.tier}', source='${caller.source}'`
          : 'no caller identity provided';
        throw new TrustLedgerWriteDenied(
          `TrustLedger.record() rejected: ${callerDesc}. ` +
            `When EVOKORE_TRUST_LEDGER_GUARD is enabled, only callers with ` +
            `tier 'system' or 'hr-manager' may write trust signals.`,
        );
      }
    }
    const entry = this.getOrCreate(agentId);
    this.applyIdleDecay(entry);
    const delta = SCORE_DELTAS[event] ?? 0;
    entry.score = this.clamp(entry.score + delta);
    entry.tier = this.computeTier(entry.score);
    entry.lastUpdated = new Date().toISOString();
    entry.events += 1;
    this.state.agents[agentId] = entry;
    this.state.updatedAt = entry.lastUpdated;
    this.persist();
    return entry;
  }

  /**
   * Returns true when the caller-identity guard is enabled via the
   * `EVOKORE_TRUST_LEDGER_GUARD` env var. Reads the env var at call time
   * so operators can toggle the guard without restarting the runtime.
   */
  static isGuardEnabled(): boolean {
    const value = process.env.EVOKORE_TRUST_LEDGER_GUARD;
    return value === 'true' || value === '1';
  }
  // @AI:NAV[END:record]

  // @AI:NAV[SEC:accessors] accessors
  getEntry(agentId: string): AgentTrustEntry | undefined {
    const entry = this.state.agents[agentId];
    return entry ? { ...entry } : undefined;
  }

  getMultiplier(agentId: string): number {
    const entry = this.state.agents[agentId];
    const tier = entry ? entry.tier : 'Standard';
    return TIER_MULTIPLIERS[tier];
  }

  getAll(): AgentTrustEntry[] {
    return Object.values(this.state.agents).map((e) => ({ ...e }));
  }

  requiresApproval(agentId: string): boolean {
    const entry = this.state.agents[agentId];
    if (!entry) return false;
    return entry.tier === 'Untrusted';
  }

  getTrustReport(): TrustReport {
    const agents = this.getAll();
    const summary = { trusted: 0, standard: 0, probation: 0, untrusted: 0 };
    for (const a of agents) {
      if (a.tier === 'Trusted') summary.trusted += 1;
      else if (a.tier === 'Standard') summary.standard += 1;
      else if (a.tier === 'Probation') summary.probation += 1;
      else summary.untrusted += 1;
    }
    return { agents, summary };
  }
  // @AI:NAV[END:accessors]

  // @AI:NAV[SEC:internals] internals
  private getOrCreate(agentId: string): AgentTrustEntry {
    const existing = this.state.agents[agentId];
    if (existing) return { ...existing };
    const now = new Date().toISOString();
    return {
      agentId,
      score: INITIAL_SCORE,
      tier: this.computeTier(INITIAL_SCORE),
      lastUpdated: now,
      events: 0,
    };
  }

  private computeTier(score: number): TrustTier {
    if (score >= 0.8) return 'Trusted';
    if (score >= 0.5) return 'Standard';
    if (score >= 0.3) return 'Probation';
    return 'Untrusted';
  }

  private applyIdleDecay(entry: AgentTrustEntry): void {
    const last = Date.parse(entry.lastUpdated);
    if (!Number.isFinite(last)) return;
    const hours = (Date.now() - last) / (1000 * 60 * 60);
    if (hours <= 0) return;
    entry.score = this.clamp(entry.score + IDLE_DECAY_PER_HOUR * hours);
    entry.tier = this.computeTier(entry.score);
  }

  private clamp(score: number): number {
    if (!Number.isFinite(score)) return 0;
    if (score < 0) return 0;
    if (score > 1) return 1;
    return score;
  }

  private persist(): void {
    try {
      fs.mkdirSync(path.dirname(this.filePath), { recursive: true });
      fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2), 'utf8');
    } catch {
      // Fail silently — persistence is best-effort.
    }
  }
  // @AI:NAV[END:internals]
}
// @AI:NAV[END:class-trustledger]
