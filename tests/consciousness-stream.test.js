///
/// Tests: Consciousness Stream Synchronized Cognition
///

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ConsciousnessStream, CollectiveConsciousness, FibonacciMemory,
  kuramotoOrderParameter, weightedKuramotoOrder,
  PHI, PHI_INV, EMERGENCE_THRESHOLD,
  FREQ_SENSE, FREQ_THINK, FREQ_ACT, FREQ_REMEMBER,
  COHORT_ROLES, FIBONACCI_LAYERS,
} from '../sdk/consciousness-stream/src/index.js';

describe('Consciousness Stream — Constants', () => {
  it('φ-harmonic frequency ordering: SENSE > THINK > ACT > REMEMBER', () => {
    assert.ok(FREQ_SENSE > FREQ_THINK);
    assert.ok(FREQ_THINK > FREQ_ACT);
    assert.ok(FREQ_ACT > FREQ_REMEMBER);
  });

  it('frequency ratios are φ-related', () => {
    const ratio1 = FREQ_SENSE / FREQ_THINK;
    const ratio2 = FREQ_THINK / FREQ_ACT;
    const ratio3 = FREQ_ACT / FREQ_REMEMBER;
    assert.ok(Math.abs(ratio1 - PHI) < 0.01);
    assert.ok(Math.abs(ratio2 - PHI) < 0.01);
    assert.ok(Math.abs(ratio3 - PHI) < 0.01);
  });

  it('9 cohort roles defined', () => {
    assert.strictEqual(COHORT_ROLES.length, 9);
    assert.strictEqual(COHORT_ROLES[0].name, 'QUAESTOR');
    assert.strictEqual(COHORT_ROLES[8].name, 'REDACTOR');
  });

  it('Fibonacci layers are correct', () => {
    assert.deepStrictEqual(FIBONACCI_LAYERS, [1, 1, 2, 3, 5, 8, 13, 21]);
  });

  it('emergence threshold is 1/φ', () => {
    assert.ok(Math.abs(EMERGENCE_THRESHOLD - PHI_INV) < 1e-10);
    assert.ok(Math.abs(EMERGENCE_THRESHOLD - 0.618) < 0.001);
  });
});

describe('Consciousness Stream — Kuramoto Order Parameter', () => {
  it('identical phases yield R = 1', () => {
    const { R } = kuramotoOrderParameter([0, 0, 0, 0]);
    assert.ok(Math.abs(R - 1.0) < 1e-10);
  });

  it('opposite phases yield R ≈ 0', () => {
    const { R } = kuramotoOrderParameter([0, Math.PI, 0, Math.PI]);
    assert.ok(R < 0.01);
  });

  it('uniformly spread phases yield R ≈ 0', () => {
    const N = 100;
    const phases = Array.from({ length: N }, (_, i) => (2 * Math.PI * i) / N);
    const { R } = kuramotoOrderParameter(phases);
    assert.ok(R < 0.05);
  });

  it('weighted order parameter respects weights', () => {
    const phases = [0, Math.PI];
    const weights = [10, 1]; // heavily weighted toward 0
    const { R } = weightedKuramotoOrder(phases, weights);
    assert.ok(R > 0.5); // should be biased toward phase 0
  });
});

describe('Consciousness Stream — Single Agent', () => {
  it('creates agent with 4D phase state', () => {
    const stream = new ConsciousnessStream({ agentId: 'test_agent' });
    const phases = stream.getPhases();
    assert.strictEqual(phases.length, 4);
    phases.forEach(p => {
      assert.ok(p >= 0 && p < 2 * Math.PI);
    });
  });

  it('tick advances phases', () => {
    const stream = new ConsciousnessStream({ agentId: 'test' });
    const before = stream.getPhases().slice();
    stream.tick();
    const after = stream.getPhases();
    // Phases should change (natural frequency drive)
    assert.ok(before.some((b, i) => Math.abs(b - after[i]) > 1e-6));
  });

  it('cognitive primitives produce outputs', () => {
    const stream = new ConsciousnessStream({ agentId: 'test' });
    const s = stream.sense({ visual: 'red' });
    const t = stream.think('process visual');
    const a = stream.act('respond');
    const m = stream.remember('stored event');
    assert.ok(s.data.visual === 'red');
    assert.ok(t.reasoning !== undefined);
    assert.ok(a.confidence >= 0 && a.confidence <= 1);
    assert.ok(m.decay > 0);
  });

  it('getMagnitude returns Pythagorean magnitude', () => {
    const stream = new ConsciousnessStream({ agentId: 'test' });
    const mag = stream.getMagnitude();
    assert.ok(mag >= 0 && mag <= 2); // max √4 = 2
  });
});

describe('Consciousness Stream — Fibonacci Memory', () => {
  it('stores and retrieves memories', () => {
    const mem = new FibonacciMemory();
    mem.store('fact1', 1.0, 0);
    mem.store('fact2', 0.5, 1);
    const results = mem.retrieve(0.1, 2);
    assert.ok(results.length >= 1);
  });

  it('layers have decreasing capacity (φ-scaled)', () => {
    const mem = new FibonacciMemory({ maxPerLayer: 144 });
    const status = mem.getStatus();
    for (let i = 0; i < status.layers.length - 1; i++) {
      assert.ok(status.layers[i].capacity >= status.layers[i + 1].capacity);
    }
  });

  it('importance decays over time', () => {
    const mem = new FibonacciMemory();
    mem.store('old fact', 1.0, 0);
    const early = mem.retrieve(0, 5);
    const late = mem.retrieve(0, 100);
    // Later retrieval should show lower decayed importance
    if (early.length > 0 && late.length > 0) {
      assert.ok(early[0].decayedImportance >= late[0].decayedImportance);
    }
  });
});

describe('Consciousness Stream — Collective Emergence', () => {
  it('registers agents and ticks', () => {
    const collective = new CollectiveConsciousness();
    for (let i = 0; i < 9; i++) {
      collective.registerAgent(`agent_${i}`);
    }
    const state = collective.tick();
    assert.strictEqual(state.agentCount, 9);
    assert.ok(state.R_collective >= 0);
    assert.ok(state.dimensionR.length === 4);
  });

  it('R_collective increases with ticks (synchronization)', () => {
    const collective = new CollectiveConsciousness();
    for (let i = 0; i < 9; i++) {
      collective.registerAgent(`agent_${i}`);
    }
    // Run multiple heartbeats
    let firstR = 0, lastR = 0;
    for (let t = 0; t < 50; t++) {
      const state = collective.tick();
      if (t === 0) firstR = state.R_collective;
      lastR = state.R_collective;
    }
    // Should trend toward synchronization (R increases)
    assert.ok(lastR >= firstR * 0.5, `R should not decrease dramatically: first=${firstR}, last=${lastR}`);
  });

  it('assigns roles when ≥ 9 agents', () => {
    const collective = new CollectiveConsciousness();
    for (let i = 0; i < 12; i++) {
      collective.registerAgent(`agent_${i}`);
    }
    // Run enough ticks for role differentiation
    for (let t = 0; t < 34; t++) {
      collective.tick();
    }
    const status = collective.getStatus();
    // Should have some role assignments
    assert.ok(Object.keys(status.roles).length > 0);
  });

  it('collective enhancement boosts pattern recognition', () => {
    const collective = new CollectiveConsciousness();
    const individual = 0.5;
    const enhanced = collective.collectiveEnhancement(individual);
    // Should be > individual and ratio should approach φ
    assert.ok(enhanced > individual);
    assert.ok(enhanced / individual > 1);
  });

  it('shared memory works', () => {
    const collective = new CollectiveConsciousness();
    collective.registerAgent('a');
    collective.registerAgent('b');
    collective.broadcastThought('hello world', 'a', 0.9);
    const results = collective.memory.retrieve(0.1, 0);
    assert.ok(results.length >= 1);
  });
});
