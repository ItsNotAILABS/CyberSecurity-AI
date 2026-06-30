///
/// tests/consensus-protocol.test.js
///
/// Test coverage for sdk/consensus-protocol/src/index.js
/// Updated for φ-Weighted Kuramoto Consensus implementation.
///
/// Covers:
///   - PhiKuramotoConsensus: propose, tick, finality
///   - ValidatorNode: phase updates, attestations
///   - PythagoreanProof: state transition proofs
///   - Fibonacci sphere topology
///   - BFT metrics
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  PhiKuramotoConsensus,
  ValidatorNode,
  PythagoreanProof,
  kuramotoOrderParameter,
  fibonacciSpherePosition,
  PHI,
  PHI_INV,
  EMERGENCE_THRESHOLD,
  BFT_TOLERANCE,
  COUPLING_K,
  HEARTBEAT_MS,
} from '../sdk/consensus-protocol/src/index.js';

// ─── Constants ─────────────────────────────────────────────────────────────

describe('Consensus Constants', () => {
  test('PHI is golden ratio', () => {
    assert.ok(Math.abs(PHI - 1.618033988) < 0.000001);
  });

  test('EMERGENCE_THRESHOLD is 1/φ', () => {
    assert.ok(Math.abs(EMERGENCE_THRESHOLD - PHI_INV) < 1e-10);
  });

  test('BFT_TOLERANCE exceeds classical 1/3', () => {
    assert.ok(BFT_TOLERANCE > 1/3);
  });

  test('COUPLING_K is 2/φ', () => {
    assert.ok(Math.abs(COUPLING_K - 2/PHI) < 1e-10);
  });

  test('HEARTBEAT_MS is 873', () => {
    assert.strictEqual(HEARTBEAT_MS, 873);
  });
});

// ─── Kuramoto Order Parameter ──────────────────────────────────────────────

describe('kuramotoOrderParameter', () => {
  test('identical phases give R=1', () => {
    const { R } = kuramotoOrderParameter([1.0, 1.0, 1.0, 1.0]);
    assert.ok(Math.abs(R - 1) < 1e-10);
  });

  test('empty phases give R=0', () => {
    const { R } = kuramotoOrderParameter([]);
    assert.strictEqual(R, 0);
  });

  test('evenly spread phases give R≈0', () => {
    const N = 50;
    const phases = Array.from({ length: N }, (_, i) => (2 * Math.PI * i) / N);
    const { R } = kuramotoOrderParameter(phases);
    assert.ok(R < 0.05);
  });
});

// ─── ValidatorNode ─────────────────────────────────────────────────────────

describe('ValidatorNode', () => {
  test('constructs with id and rank', () => {
    const v = new ValidatorNode({ id: 'v_0', rank: 0, totalValidators: 10 });
    assert.strictEqual(v.id, 'v_0');
    assert.strictEqual(v.rank, 0);
    assert.ok(v.weight > 0);
  });

  test('higher rank gets lower weight', () => {
    const v0 = new ValidatorNode({ id: 'v0', rank: 0, totalValidators: 10 });
    const v5 = new ValidatorNode({ id: 'v5', rank: 5, totalValidators: 10 });
    assert.ok(v0.weight > v5.weight);
  });

  test('phase is in [0, 2π)', () => {
    const v = new ValidatorNode({ id: 'test', rank: 3, totalValidators: 10 });
    assert.ok(v.phase >= 0 && v.phase < 2 * Math.PI);
  });

  test('attest returns null below threshold', () => {
    const v = new ValidatorNode({ id: 'test', rank: 0, totalValidators: 10 });
    assert.strictEqual(v.attest('block', 0.3, 1), null);
  });

  test('attest returns attestation at threshold', () => {
    const v = new ValidatorNode({ id: 'test', rank: 0, totalValidators: 10 });
    const a = v.attest('block', 0.7, 1);
    assert.ok(a !== null);
    assert.strictEqual(a.blockHash, 'block');
  });
});

// ─── PythagoreanProof ──────────────────────────────────────────────────────

describe('PythagoreanProof', () => {
  test('generates proof with valid Pythagorean triple', () => {
    const engine = new PythagoreanProof();
    const p = engine.generateProof('state_a', 'delta_x', 'state_b');
    const [a, b, c] = p.pythagoreanTriple;
    assert.ok(Math.abs(a*a + b*b - c*c) < 1);
  });

  test('verify fails without R attestation', () => {
    const engine = new PythagoreanProof();
    const p = engine.generateProof('s0', 'd0', 's1');
    assert.strictEqual(engine.verifyProof(p), false);
  });

  test('verify passes with valid R attestation', () => {
    const engine = new PythagoreanProof();
    const p = engine.generateProof('s0', 'd0', 's1');
    p.R_attestation = 0.65;
    assert.strictEqual(engine.verifyProof(p), true);
  });
});

// ─── PhiKuramotoConsensus ──────────────────────────────────────────────────

describe('PhiKuramotoConsensus', () => {
  test('constructs with default validator count', () => {
    const c = new PhiKuramotoConsensus({ validatorCount: 10 });
    assert.strictEqual(c.validatorCount, 10);
    assert.strictEqual(c.validators.length, 10);
  });

  test('proposeBlock assigns target phase', () => {
    const c = new PhiKuramotoConsensus({ validatorCount: 10 });
    const result = c.proposeBlock('test_hash');
    assert.ok(result.targetPhase >= 0 && result.targetPhase < 2 * Math.PI);
    assert.strictEqual(result.blockHash, 'test_hash');
  });

  test('tick advances beat', () => {
    const c = new PhiKuramotoConsensus({ validatorCount: 10 });
    assert.strictEqual(c.beat, 0);
    c.tick();
    assert.strictEqual(c.beat, 1);
  });

  test('achieves finality', () => {
    const c = new PhiKuramotoConsensus({ validatorCount: 10 });
    c.proposeBlock('finality_test');
    const result = c.runToFinality('finality_test', 50);
    assert.ok(result.finalized);
  });

  test('getBFTMetrics returns correct values', () => {
    const c = new PhiKuramotoConsensus({ validatorCount: 100 });
    const m = c.getBFTMetrics();
    assert.strictEqual(m.totalValidators, 100);
    assert.ok(m.bftThreshold > 0.38);
    assert.ok(m.safe);
  });

  test('expectedFinalityTime is logarithmic', () => {
    const c = new PhiKuramotoConsensus({ validatorCount: 1000 });
    const t = c.expectedFinalityTime();
    assert.ok(t.heartbeats <= 10); // log₂(1000) ≈ 10
  });

  test('getStatus is comprehensive', () => {
    const c = new PhiKuramotoConsensus({ validatorCount: 10 });
    c.tick();
    const s = c.getStatus();
    assert.ok(s.beat > 0);
    assert.ok(s.bft);
    assert.ok(s.topology);
    assert.ok(s.expectedFinality);
  });
});

// ─── Fibonacci Sphere ──────────────────────────────────────────────────────

describe('fibonacciSpherePosition', () => {
  test('returns valid latitude/longitude', () => {
    const pos = fibonacciSpherePosition(5, 100);
    assert.ok(pos.latitude >= -Math.PI/2 && pos.latitude <= Math.PI/2);
    assert.ok(pos.longitude >= 0 && pos.longitude < 2 * Math.PI);
  });
});
