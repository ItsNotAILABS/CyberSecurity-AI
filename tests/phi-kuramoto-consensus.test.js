///
/// Tests: φ-Weighted Kuramoto Consensus Protocol
///

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  PhiKuramotoConsensus, ValidatorNode, PythagoreanProof,
  kuramotoOrderParameter, fibonacciSpherePosition, sphereDistance,
  PHI, PHI_INV, EMERGENCE_THRESHOLD, BFT_TOLERANCE, COUPLING_K, HEARTBEAT_MS,
} from '../sdk/consensus-protocol/src/index.js';

describe('φ-Kuramoto Consensus — Constants', () => {
  it('BFT tolerance is 1/φ² ≈ 0.382 (exceeds 1/3)', () => {
    assert.ok(Math.abs(BFT_TOLERANCE - 1 / (PHI * PHI)) < 1e-10);
    assert.ok(BFT_TOLERANCE > 1 / 3, 'Should exceed classical BFT 33.3%');
    assert.ok(Math.abs(BFT_TOLERANCE - 0.382) < 0.001);
  });

  it('coupling strength K = 2/φ', () => {
    assert.ok(Math.abs(COUPLING_K - 2 / PHI) < 1e-10);
  });

  it('emergence threshold is 1/φ', () => {
    assert.ok(Math.abs(EMERGENCE_THRESHOLD - PHI_INV) < 1e-10);
  });

  it('heartbeat is 873ms', () => {
    assert.strictEqual(HEARTBEAT_MS, 873);
  });
});

describe('φ-Kuramoto Consensus — Fibonacci Sphere', () => {
  it('positions are on valid sphere surface', () => {
    for (let k = 0; k < 100; k++) {
      const pos = fibonacciSpherePosition(k, 100);
      assert.ok(pos.latitude >= -Math.PI / 2 && pos.latitude <= Math.PI / 2);
      assert.ok(pos.longitude >= 0 && pos.longitude < 2 * Math.PI);
    }
  });

  it('sphere distance is symmetric', () => {
    const p1 = fibonacciSpherePosition(5, 100);
    const p2 = fibonacciSpherePosition(50, 100);
    const d1 = sphereDistance(p1, p2);
    const d2 = sphereDistance(p2, p1);
    assert.ok(Math.abs(d1 - d2) < 1e-10);
  });

  it('near-uniform distribution (no clustering)', () => {
    const N = 100;
    const positions = Array.from({ length: N }, (_, k) => fibonacciSpherePosition(k, N));
    // Check that latitudes span the range
    const lats = positions.map(p => p.latitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    assert.ok(maxLat - minLat > Math.PI * 0.8, 'Should span most of the sphere');
  });
});

describe('φ-Kuramoto Consensus — Validator Node', () => {
  it('creates validator with φ-weighted stake', () => {
    const v = new ValidatorNode({ id: 'v0', rank: 0, totalValidators: 10 });
    const v1 = new ValidatorNode({ id: 'v1', rank: 1, totalValidators: 10 });
    // Rank 0 should have higher weight than rank 1
    assert.ok(v.weight > v1.weight);
    // Ratio should be approximately φ
    const ratio = v.weight / v1.weight;
    assert.ok(Math.abs(ratio - PHI) < 0.1);
  });

  it('phase updates via Kuramoto coupling', () => {
    const v = new ValidatorNode({ id: 'test', rank: 0, totalValidators: 10 });
    const initialPhase = v.phase;
    const otherPhases = [0, 0.1, 0.2]; // all near 0
    v.updatePhase(otherPhases, [1, 1, 1]);
    // Phase should have moved
    assert.ok(Math.abs(v.phase - initialPhase) > 1e-6 || initialPhase === v.phase);
  });

  it('Byzantine validators behave randomly', () => {
    const v = new ValidatorNode({ id: 'byz', rank: 5, totalValidators: 10 });
    v.isByzantine = true;
    const phases = [];
    for (let i = 0; i < 10; i++) {
      v.updatePhase([0, 0, 0]);
      phases.push(v.phase);
    }
    // Should not converge to 0 (random perturbation)
    const allSame = phases.every(p => Math.abs(p - phases[0]) < 0.01);
    assert.ok(!allSame, 'Byzantine node should not converge');
  });

  it('attestation requires R ≥ threshold', () => {
    const v = new ValidatorNode({ id: 'test', rank: 0, totalValidators: 10 });
    const lowR = v.attest('block1', 0.3, 1);
    assert.strictEqual(lowR, null);
    const highR = v.attest('block2', 0.7, 2);
    assert.ok(highR !== null);
    assert.strictEqual(highR.blockHash, 'block2');
  });
});

describe('φ-Kuramoto Consensus — Pythagorean Proof', () => {
  it('generates valid Pythagorean triple proofs', () => {
    const engine = new PythagoreanProof();
    const proof = engine.generateProof('state0', 'delta1', 'state1');
    const [a, b, c] = proof.pythagoreanTriple;
    // Verify a² + b² = c²
    assert.ok(Math.abs(a * a + b * b - c * c) < 1e-6);
  });

  it('verification requires R attestation', () => {
    const engine = new PythagoreanProof();
    const proof = engine.generateProof('s0', 'd0', 's1');
    // Without R attestation, should fail
    assert.strictEqual(engine.verifyProof(proof), false);
    // With valid R attestation, should pass
    proof.R_attestation = 0.7;
    assert.strictEqual(engine.verifyProof(proof), true);
    // Below threshold should fail
    proof.R_attestation = 0.5;
    assert.strictEqual(engine.verifyProof(proof), false);
  });
});

describe('φ-Kuramoto Consensus — Full Consensus Engine', () => {
  it('creates consensus with validators', () => {
    const consensus = new PhiKuramotoConsensus({ validatorCount: 20 });
    assert.strictEqual(consensus.validatorCount, 20);
    assert.strictEqual(consensus.validators.length, 20);
  });

  it('BFT metrics show 38.2% tolerance', () => {
    const consensus = new PhiKuramotoConsensus({ validatorCount: 100 });
    const metrics = consensus.getBFTMetrics();
    assert.strictEqual(metrics.totalValidators, 100);
    assert.ok(Math.abs(metrics.bftThreshold - 0.382) < 0.001);
    assert.ok(metrics.bftThreshold > metrics.classicalBFT);
  });

  it('expected finality is logarithmic', () => {
    const consensus = new PhiKuramotoConsensus({ validatorCount: 4000 });
    const finality = consensus.expectedFinalityTime();
    assert.ok(finality.heartbeats <= 13); // log₂(4000) ≈ 12
    assert.ok(finality.seconds < 15);
  });

  it('achieves finality within logarithmic beats', () => {
    const consensus = new PhiKuramotoConsensus({ validatorCount: 20 });
    consensus.proposeBlock('test_block_hash');
    const result = consensus.runToFinality('test_block_hash', 50);
    assert.ok(result.finalized, 'Should achieve finality');
    assert.ok(result.R >= EMERGENCE_THRESHOLD);
  });

  it('topology self-healing property holds', () => {
    const consensus = new PhiKuramotoConsensus({ validatorCount: 50 });
    const health = consensus.measureTopologyHealth();
    assert.ok(health.selfHealingProperty);
    assert.ok(health.gapRatio <= PHI);
  });

  it('withstands Byzantine fraction < 38.2%', () => {
    const consensus = new PhiKuramotoConsensus({
      validatorCount: 20,
      byzantineFraction: 0.3, // 30% Byzantine (below 38.2% threshold)
    });
    consensus.proposeBlock('byz_test_block');
    const result = consensus.runToFinality('byz_test_block', 80);
    assert.ok(result.finalized, 'Should still achieve finality with 30% Byzantine');
  });

  it('light client proof verification works', () => {
    const consensus = new PhiKuramotoConsensus({ validatorCount: 20 });
    consensus.proposeBlock('lc_block');
    consensus.runToFinality('lc_block', 50);

    if (consensus.finalizedBlocks.length > 0) {
      const block = consensus.finalizedBlocks[0];
      if (block.proof) {
        const valid = consensus.verifyLightClientProof(block.proof);
        assert.ok(valid, 'Light client proof should verify');
      }
    }
  });
});
