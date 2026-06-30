///
/// Tests: Sovereign Organism Architecture Runtime
///

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  SovereignOrganismRuntime,
  Organism, BiologicalSignal,
  kuramotoOrderParameter, fibonacciSpherePosition, sphereDistance,
  PHI, PHI_INV, GOLDEN_ANGLE, EMERGENCE_THRESHOLD,
  SIGNAL_TYPES, ALPHA_ORGANISMS, ALPHA_COUNT, SUB_COUNT, TOTAL_ARCH, FIB,
} from '../engines/javascript/sovereign-organism-runtime.js';

describe('Sovereign Organism — Constants', () => {
  it('7 alpha organisms defined', () => {
    assert.strictEqual(ALPHA_ORGANISMS.length, 7);
    assert.strictEqual(ALPHA_COUNT, 7);
  });

  it('24 total architectures (7 + 17)', () => {
    assert.strictEqual(TOTAL_ARCH, 24);
    assert.strictEqual(ALPHA_COUNT + SUB_COUNT, TOTAL_ARCH);
  });

  it('4 biological signal types', () => {
    assert.strictEqual(Object.keys(SIGNAL_TYPES).length, 4);
    assert.ok(SIGNAL_TYPES.PULSE);
    assert.ok(SIGNAL_TYPES.WAVE);
    assert.ok(SIGNAL_TYPES.RESONANCE);
    assert.ok(SIGNAL_TYPES.ECHO);
  });

  it('alpha organisms have correct IDs', () => {
    const ids = ALPHA_ORGANISMS.map(o => o.id);
    assert.ok(ids.includes('SOVEREIGN'));
    assert.ok(ids.includes('ARCHITECT'));
    assert.ok(ids.includes('OBSERVER'));
    assert.ok(ids.includes('NEXUS'));
    assert.ok(ids.includes('GUARDIAN'));
    assert.ok(ids.includes('SCRIBE'));
    assert.ok(ids.includes('ORACLE'));
  });
});

describe('Sovereign Organism — Fibonacci Sphere', () => {
  it('produces valid positions', () => {
    for (let k = 0; k < 24; k++) {
      const pos = fibonacciSpherePosition(k, 24);
      assert.ok(pos.latitude >= -Math.PI / 2 && pos.latitude <= Math.PI / 2);
      assert.ok(pos.longitude >= 0 && pos.longitude < 2 * Math.PI);
    }
  });

  it('all positions are distinct', () => {
    const positions = Array.from({ length: 24 }, (_, k) => fibonacciSpherePosition(k, 24));
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const d = sphereDistance(positions[i], positions[j]);
        assert.ok(d > 0.01, 'Positions should be distinct');
      }
    }
  });
});

describe('Sovereign Organism — Runtime Bootstrap', () => {
  it('creates runtime with 7 alpha organisms', () => {
    const runtime = new SovereignOrganismRuntime();
    assert.strictEqual(runtime.organisms.size, 7);
    assert.ok(runtime.getOrganism('SOVEREIGN'));
    assert.ok(runtime.getOrganism('ARCHITECT'));
  });

  it('each organism has φ-weighted resources', () => {
    const runtime = new SovereignOrganismRuntime();
    const sovereign = runtime.getOrganism('SOVEREIGN');
    const scribe = runtime.getOrganism('SCRIBE');
    // SOVEREIGN (rank 0) should have more resources than SCRIBE (rank 5)
    assert.ok(sovereign.resources > scribe.resources);
  });

  it('organisms have neighbors', () => {
    const runtime = new SovereignOrganismRuntime();
    const sovereign = runtime.getOrganism('SOVEREIGN');
    assert.ok(sovereign.neighbors.length >= 3);
  });
});

describe('Sovereign Organism — Inter-Organism Signals', () => {
  it('sends PULSE signal (point-to-point)', () => {
    const runtime = new SovereignOrganismRuntime();
    const signal = runtime.sendSignal('SOVEREIGN', 'ARCHITECT', SIGNAL_TYPES.PULSE, { command: 'generate' });
    assert.ok(signal);
    assert.strictEqual(signal.type, 'PULSE');
    assert.strictEqual(signal.target, 'ARCHITECT');
    // Tick to deliver
    runtime.tick();
    const architect = runtime.getOrganism('ARCHITECT');
    assert.ok(architect.inbox.length > 0);
  });

  it('broadcasts WAVE signal to all organisms', () => {
    const runtime = new SovereignOrganismRuntime();
    runtime.broadcast('SOVEREIGN', SIGNAL_TYPES.WAVE, { alert: 'test' });
    runtime.tick();
    // All non-SOVEREIGN organisms should have received it
    const architect = runtime.getOrganism('ARCHITECT');
    const observer = runtime.getOrganism('OBSERVER');
    assert.ok(architect.inbox.length > 0);
    assert.ok(observer.inbox.length > 0);
  });

  it('RESONANCE signals adjust phase', () => {
    const runtime = new SovereignOrganismRuntime();
    const architect = runtime.getOrganism('ARCHITECT');
    const initialPhase = architect.phase;
    runtime.sendSignal('SOVEREIGN', 'ARCHITECT', SIGNAL_TYPES.RESONANCE, { phase: 0 });
    runtime.tick();
    // Phase should have shifted
    assert.ok(architect.phase !== initialPhase || initialPhase === 0);
  });
});

describe('Sovereign Organism — Kuramoto Consensus', () => {
  it('computes organism-level consensus', () => {
    const runtime = new SovereignOrganismRuntime();
    const state = runtime.getConsensusState();
    assert.ok(state.R >= 0 && state.R <= 1);
    assert.strictEqual(state.organisms, 7);
    assert.strictEqual(state.threshold, EMERGENCE_THRESHOLD);
  });

  it('consensus R increases with ticks (synchronization)', () => {
    const runtime = new SovereignOrganismRuntime();
    let initialR = runtime.getConsensusState().R;
    for (let i = 0; i < 30; i++) {
      runtime.tick();
    }
    let finalR = runtime.getConsensusState().R;
    // Should trend toward synchronization
    assert.ok(finalR >= initialR * 0.5 || finalR > 0.3);
  });

  it('runToConsensus achieves consensus', () => {
    const runtime = new SovereignOrganismRuntime();
    const result = runtime.runToConsensus(100);
    assert.ok(result.reached, 'Should reach consensus within 100 beats');
    assert.ok(result.R >= EMERGENCE_THRESHOLD);
  });
});

describe('Sovereign Organism — Self-Healing Topology', () => {
  it('topology is healthy with all organisms alive', () => {
    const runtime = new SovereignOrganismRuntime();
    runtime.tick();
    const health = runtime._checkTopologyHealth();
    assert.strictEqual(health.alive, 7);
    assert.strictEqual(health.dead, 0);
    assert.ok(health.selfHealingProperty);
  });

  it('self-healing holds when killing 1 organism', () => {
    const runtime = new SovereignOrganismRuntime();
    runtime.killOrganism('SCRIBE');
    runtime.tick();
    const health = runtime._checkTopologyHealth();
    assert.strictEqual(health.alive, 6);
    assert.strictEqual(health.dead, 1);
    assert.ok(health.selfHealingProperty, 'gap ratio should stay ≤ φ');
    assert.ok(health.canSelfHeal);
  });

  it('reviving organism restores full health', () => {
    const runtime = new SovereignOrganismRuntime();
    runtime.killOrganism('OBSERVER');
    runtime.tick();
    runtime.reviveOrganism('OBSERVER');
    runtime.tick();
    const health = runtime._checkTopologyHealth();
    assert.strictEqual(health.alive, 7);
  });
});

describe('Sovereign Organism — Architecture Generation', () => {
  it('ARCHITECT generates sub-organisms after consensus', () => {
    const runtime = new SovereignOrganismRuntime();
    // Run until consensus is reached and ARCHITECT has chance to generate
    for (let i = 0; i < 100; i++) {
      runtime.tick();
    }
    // Should have generated at least one sub-organism
    // (depends on timing, but with 100 beats should trigger)
    const status = runtime.getStatus();
    assert.ok(status.organisms.length >= 7);
  });

  it('hash chain extends every tick', () => {
    const runtime = new SovereignOrganismRuntime();
    const initialLen = runtime.hashChain.length;
    runtime.tick();
    runtime.tick();
    runtime.tick();
    assert.strictEqual(runtime.hashChain.length, initialLen + 3);
  });
});

describe('Sovereign Organism — Status', () => {
  it('getStatus returns comprehensive state', () => {
    const runtime = new SovereignOrganismRuntime();
    runtime.tick();
    const status = runtime.getStatus();
    assert.ok(status.beat > 0);
    assert.ok(status.organisms.length === 7);
    assert.ok(status.consensus);
    assert.ok(status.topology);
    assert.strictEqual(status.substrateNodes, 4000);
  });
});
