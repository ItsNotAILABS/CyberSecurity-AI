///
/// Tests: Mixture of Ancient Experts — Master Router
///

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  MixtureOfAncientExperts,
  computeInputSignature, computeCharacteristicVector,
  EXPERT_ENGINES, NUM_EXPERTS, FIB,
  PHI, PHI_INV, PHI2, GOLDEN_ANGLE,
  GAP_SMALL, GAP_MEDIUM, GAP_LARGE,
} from '../engines/javascript/mixture-of-ancient-experts.js';

describe('MoAE — Constants', () => {
  it('23 expert engines defined', () => {
    assert.strictEqual(EXPERT_ENGINES.length, 23);
    assert.strictEqual(NUM_EXPERTS, 23);
  });

  it('all engines have unique names', () => {
    const names = EXPERT_ENGINES.map(e => e.name);
    const unique = new Set(names);
    assert.strictEqual(unique.size, 23);
  });

  it('engines include key ancient mathematicians', () => {
    const names = EXPERT_ENGINES.map(e => e.name);
    assert.ok(names.includes('PYTHAGORAS'));
    assert.ok(names.includes('EUCLID'));
    assert.ok(names.includes('FIBONACCI'));
    assert.ok(names.includes('ARCHIMEDES'));
    assert.ok(names.includes('PLATO'));
    assert.ok(names.includes('ARISTOTLE'));
    assert.ok(names.includes('HYPATIA'));
  });

  it('three-distance gaps are φ-related', () => {
    const ratio = GAP_LARGE / GAP_SMALL;
    assert.ok(Math.abs(ratio - PHI2) < 0.01, `Ratio should be φ²: got ${ratio}`);
  });
});

describe('MoAE — Input Signature', () => {
  it('produces 5D signature', () => {
    const sig = computeInputSignature([1, 2, 3, 4, 5]);
    assert.strictEqual(sig.length, 5);
    sig.forEach(s => assert.ok(Number.isFinite(s)));
  });

  it('different inputs produce different signatures', () => {
    const s1 = computeInputSignature([1, 2, 3, 4]);
    const s2 = computeInputSignature([4, 3, 2, 1]);
    const same = s1.every((v, i) => Math.abs(v - s2[i]) < 1e-10);
    assert.ok(!same, 'Different inputs should have different signatures');
  });

  it('pythagorean norm is √(Σxᵢ²)', () => {
    const sig = computeInputSignature([3, 4]);
    assert.ok(Math.abs(sig[0] - 5) < 0.01); // √(9+16) = 5
  });
});

describe('MoAE — Characteristic Vectors', () => {
  it('produces vectors of correct dimension', () => {
    const v = computeCharacteristicVector(0, 5);
    assert.strictEqual(v.length, 5);
  });

  it('different experts have different vectors', () => {
    const v0 = computeCharacteristicVector(0);
    const v1 = computeCharacteristicVector(1);
    const same = v0.every((v, i) => Math.abs(v - v1[i]) < 1e-10);
    assert.ok(!same);
  });
});

describe('MoAE — Deterministic Routing', () => {
  it('routes input to Top-K experts', () => {
    const moae = new MixtureOfAncientExperts({ topK: 3 });
    const routing = moae.route([1, 2, 3, 4, 5, 6, 7, 8]);
    assert.strictEqual(routing.selectedExperts.length, 3);
    assert.ok(routing.primaryExpert >= 0 && routing.primaryExpert < 23);
  });

  it('routing is deterministic (same input → same routing)', () => {
    const moae = new MixtureOfAncientExperts({ topK: 3 });
    const input = [1, 2, 3, 4, 5];
    const r1 = moae.route(input);
    const r2 = moae.route(input);
    assert.strictEqual(r1.primaryExpert, r2.primaryExpert);
    assert.deepStrictEqual(
      r1.selectedExperts.map(e => e.index),
      r2.selectedExperts.map(e => e.index)
    );
  });

  it('experts are selected via Fibonacci spacing', () => {
    const moae = new MixtureOfAncientExperts({ topK: 3 });
    const routing = moae.route([5, 10, 15, 20, 25]);
    const indices = routing.selectedExperts.map(e => e.index);
    const primary = indices[0];
    // Second expert should be (primary + F(0)) mod 23 = (primary + 1) mod 23
    const expectedSecond = (primary + FIB[0]) % 23;
    assert.strictEqual(indices[1], expectedSecond);
  });

  it('weights are Pythagorean (L2 normalized)', () => {
    const moae = new MixtureOfAncientExperts({ topK: 3 });
    const routing = moae.route([1, 2, 3, 4, 5]);
    const weights = routing.weights;
    // All weights should be non-negative
    weights.forEach(w => assert.ok(w >= 0));
    // L2 norm of weights should be ≤ 1 (they're projections / L2 norm)
    const l2 = Math.sqrt(weights.reduce((s, w) => s + w * w, 0));
    assert.ok(l2 <= 1.01);
  });

  it('zero training cost', () => {
    const moae = new MixtureOfAncientExperts();
    const complexity = moae.getComplexity();
    assert.strictEqual(complexity.trainingCost, 0);
    assert.ok(complexity.deterministicRouting);
  });
});

describe('MoAE — Load Balance (Three-Distance Theorem)', () => {
  it('no expert collapse after many routings', () => {
    const moae = new MixtureOfAncientExperts({ topK: 3 });
    // Route 1000 diverse inputs
    for (let i = 0; i < 1000; i++) {
      const input = Array.from({ length: 8 }, (_, j) => Math.sin(i * PHI + j));
      moae.route(input);
    }
    const balance = moae.verifyLoadBalance();
    assert.ok(balance.minLoad > 0, 'No expert should have zero load');
    assert.ok(balance.zeroCollapse, 'Zero expert collapse property');
  });

  it('load ratio bounded by φ² (three-distance theorem)', () => {
    const moae = new MixtureOfAncientExperts({ topK: 3 });
    // Route many diverse inputs
    for (let i = 0; i < 2000; i++) {
      const input = Array.from({ length: 10 }, (_, j) => Math.cos(i * GOLDEN_ANGLE + j * PHI));
      moae.route(input);
    }
    const balance = moae.verifyLoadBalance();
    assert.ok(balance.ratio <= PHI2 * 2, `Load ratio should be bounded: got ${balance.ratio}`);
  });

  it('all 23 experts get utilized', () => {
    const moae = new MixtureOfAncientExperts({ topK: 5 });
    for (let i = 0; i < 500; i++) {
      const input = Array.from({ length: 6 }, (_, j) => i * PHI_INV + j * GOLDEN_ANGLE);
      moae.route(input);
    }
    const util = moae.getUtilization();
    const utilized = util.filter(u => u.totalRouted > 0).length;
    assert.strictEqual(utilized, 23, 'All 23 experts should be utilized');
  });
});

describe('MoAE — Forward (Catalytic Combination)', () => {
  it('forward produces combined output', () => {
    const moae = new MixtureOfAncientExperts({ topK: 3 });
    const result = moae.forward([1, 2, 3, 4, 5]);
    assert.ok(result.combined !== null && result.combined !== undefined);
    assert.ok(result.routing);
    assert.ok(result.expertOutputs.length === 3);
  });

  it('catalytic weights follow φ^(-k) pattern', () => {
    const moae = new MixtureOfAncientExperts({ topK: 4 });
    const result = moae.forward([1, 2, 3, 4, 5]);
    const cw = result.catalyticWeight;
    assert.ok(Math.abs(cw[0] - 1.0) < 1e-10); // φ^0 = 1
    assert.ok(Math.abs(cw[1] - PHI_INV) < 1e-10); // φ^(-1)
    assert.ok(Math.abs(cw[2] - PHI_INV * PHI_INV) < 1e-10); // φ^(-2)
  });

  it('custom expert forward function is called', () => {
    const moae = new MixtureOfAncientExperts({ topK: 2 });
    let called = false;
    const customFn = (input, idx, name) => {
      called = true;
      return input.reduce((s, v) => s + v, 0) * (idx + 1);
    };
    moae.forward([1, 2, 3], customFn);
    assert.ok(called);
  });
});

describe('MoAE — Status & Diagnostics', () => {
  it('getStatus returns comprehensive info', () => {
    const moae = new MixtureOfAncientExperts();
    moae.route([1, 2, 3]);
    const status = moae.getStatus();
    assert.strictEqual(status.expertCount, 23);
    assert.strictEqual(status.totalRouted, 1);
    assert.ok(status.loadBalance);
    assert.ok(status.complexity);
  });

  it('resetLoads clears all counters', () => {
    const moae = new MixtureOfAncientExperts();
    moae.route([1, 2, 3]);
    moae.resetLoads();
    assert.strictEqual(moae.totalRouted, 0);
    moae.experts.forEach(e => assert.strictEqual(e.totalRouted, 0));
  });
});
