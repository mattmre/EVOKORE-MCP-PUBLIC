import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const WORKFLOW_PATH = path.join(
  PROJECT_ROOT,
  'SKILLS',
  'ORCHESTRATION FRAMEWORK',
  'workflow-templates',
  'master-555.json',
);
const SKILL_PATH = path.join(
  PROJECT_ROOT,
  'SKILLS',
  'EVOKORE EXTENSIONS',
  'master-workflow-555',
  'SKILL.md',
);

interface Step {
  id: string;
  name: string;
  action: string;
  agent?: string;
  command?: string;
  depends_on?: string[];
  condition?: string;
  outputs?: Record<string, string>;
  timeout_seconds?: number;
  inputs?: Record<string, unknown>;
}

interface Workflow {
  name: string;
  version: string;
  description: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  steps: Step[];
  execution: { mode: string; parallel_limit: number; timeout_seconds: number };
  metadata: { author: string; created: string; tags: string[] };
}

function loadWorkflow(): Workflow {
  const raw = fs.readFileSync(WORKFLOW_PATH, 'utf8');
  return JSON.parse(raw);
}

describe('master-workflow-555: file presence', () => {
  it('workflow JSON file exists', () => {
    expect(fs.existsSync(WORKFLOW_PATH)).toBe(true);
  });

  it('SKILL.md exists', () => {
    expect(fs.existsSync(SKILL_PATH)).toBe(true);
  });

  it('SKILL.md has the expected frontmatter name', () => {
    const md = fs.readFileSync(SKILL_PATH, 'utf8');
    expect(md).toMatch(/^---[\s\S]*?\nname:\s*master-workflow-555\b/);
  });
});

describe('master-workflow-555: top-level shape', () => {
  it('parses as JSON', () => {
    expect(() => loadWorkflow()).not.toThrow();
  });

  it('has the canonical name and version', () => {
    const wf = loadWorkflow();
    expect(wf.name).toBe('master-workflow-555');
    expect(wf.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('declares the master + orchestration tags', () => {
    const wf = loadWorkflow();
    expect(wf.metadata.tags).toContain('master');
    expect(wf.metadata.tags).toContain('orchestration');
    expect(wf.metadata.tags).toContain('5-5-5');
  });

  it('declares required inputs task_title and task_brief', () => {
    const wf = loadWorkflow();
    expect(wf.inputs).toHaveProperty('task_title');
    expect(wf.inputs).toHaveProperty('task_brief');
    expect((wf.inputs.task_title as { required: boolean }).required).toBe(true);
    expect((wf.inputs.task_brief as { required: boolean }).required).toBe(true);
  });

  it('exposes a task_report output', () => {
    const wf = loadWorkflow();
    expect(wf.outputs).toHaveProperty('task_report');
  });
});

describe('master-workflow-555: 5/5/5 invariants', () => {
  it('has exactly 5 phase steps with ids phase-1 through phase-5', () => {
    const wf = loadWorkflow();
    const phases = wf.steps.filter((s) => /^phase-\d-/.test(s.id));
    expect(phases.length).toBe(5);
    const ids = phases.map((p) => p.id);
    expect(ids).toEqual([
      'phase-1-plan',
      'phase-2-explore',
      'phase-3-implement',
      'phase-4-verify',
      'phase-5-handoff',
    ]);
  });

  it('has exactly 5 panel steps with ids panel-1 through panel-5', () => {
    const wf = loadWorkflow();
    const panels = wf.steps.filter((s) => /^panel-\d-/.test(s.id));
    expect(panels.length).toBe(5);
    expect(panels.map((p) => p.id)).toEqual([
      'panel-1-architecture',
      'panel-2-feasibility',
      'panel-3-code-refinement',
      'panel-4-testing-quality',
      'panel-5-documentation-quality',
    ]);
  });

  it('has exactly 5 gate steps with ids gate-1 through gate-5', () => {
    const wf = loadWorkflow();
    const gates = wf.steps.filter((s) => /^gate-\d-/.test(s.id));
    expect(gates.length).toBe(5);
    expect(gates.map((g) => g.id)).toEqual([
      'gate-1-plan-approved',
      'gate-2-explore-complete',
      'gate-3-implementation-complete',
      'gate-4-tests-green',
      'gate-5-handoff-ready',
    ]);
  });

  it('all gates are conditional steps with a condition expression', () => {
    const wf = loadWorkflow();
    const gates = wf.steps.filter((s) => /^gate-\d-/.test(s.id));
    for (const g of gates) {
      expect(g.action).toBe('conditional');
      expect(typeof g.condition).toBe('string');
      expect((g.condition as string).length).toBeGreaterThan(0);
    }
  });

  it('every panel can be skipped via inputs.skip_panels', () => {
    const wf = loadWorkflow();
    const panels = wf.steps.filter((s) => /^panel-\d-/.test(s.id));
    for (const p of panels) {
      expect(p.condition).toMatch(/skip_panels/);
    }
  });

  it('has a single deliver step that aggregates all phases/panels/gates', () => {
    const wf = loadWorkflow();
    const deliver = wf.steps.find((s) => s.id === 'deliver');
    expect(deliver).toBeDefined();
    expect(deliver!.action).toBe('transform');
    const tmpl = JSON.stringify(deliver!.inputs);
    expect(tmpl).toContain('phases');
    expect(tmpl).toContain('panels');
    expect(tmpl).toContain('gates');
  });
});

describe('master-workflow-555: DAG dependencies', () => {
  it('every depends_on reference points to a real step id', () => {
    const wf = loadWorkflow();
    const ids = new Set(wf.steps.map((s) => s.id));
    for (const step of wf.steps) {
      for (const dep of step.depends_on || []) {
        expect(ids.has(dep)).toBe(true);
      }
    }
  });

  it('phases are linearly ordered through their gates', () => {
    const wf = loadWorkflow();
    const order = [
      ['phase-2-explore', 'gate-1-plan-approved'],
      ['phase-3-implement', 'gate-2-explore-complete'],
      ['phase-4-verify', 'gate-3-implementation-complete'],
      ['phase-5-handoff', 'gate-4-tests-green'],
    ];
    for (const [phase, gate] of order) {
      const p = wf.steps.find((s) => s.id === phase)!;
      expect(p.depends_on).toContain(gate);
    }
  });

  it('every panel depends on its matching phase', () => {
    const wf = loadWorkflow();
    const panelToPhase: Record<string, string> = {
      'panel-1-architecture': 'phase-1-plan',
      'panel-2-feasibility': 'phase-2-explore',
      'panel-3-code-refinement': 'phase-3-implement',
      'panel-4-testing-quality': 'phase-4-verify',
      'panel-5-documentation-quality': 'phase-5-handoff',
    };
    for (const [panel, phase] of Object.entries(panelToPhase)) {
      const p = wf.steps.find((s) => s.id === panel)!;
      expect(p.depends_on).toContain(phase);
    }
  });

  it('deliver depends on the final gate', () => {
    const wf = loadWorkflow();
    const deliver = wf.steps.find((s) => s.id === 'deliver')!;
    expect(deliver.depends_on).toContain('gate-5-handoff-ready');
  });
});

describe('master-workflow-555: SKILL.md content', () => {
  it('describes the 5/5/5 structure', () => {
    const md = fs.readFileSync(SKILL_PATH, 'utf8');
    expect(md).toMatch(/Plan/);
    expect(md).toMatch(/Explore/);
    expect(md).toMatch(/Implement/);
    expect(md).toMatch(/Verify/);
    expect(md).toMatch(/Handoff/);
  });

  it('lists all 5 panel IDs in the skip_panels documentation', () => {
    const md = fs.readFileSync(SKILL_PATH, 'utf8');
    expect(md).toMatch(/architecture/);
    expect(md).toMatch(/feasibility/);
    expect(md).toMatch(/code-refinement/);
    expect(md).toMatch(/testing-quality/);
    expect(md).toMatch(/documentation-quality/);
  });

  it('explicitly states the workflow does not commit/push/open PRs', () => {
    const md = fs.readFileSync(SKILL_PATH, 'utf8');
    expect(md.toLowerCase()).toMatch(/does not commit|does not push|does not.*open[s]? prs|does not.*pr/);
  });
});
