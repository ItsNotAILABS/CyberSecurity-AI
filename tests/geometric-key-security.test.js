///
/// Tests: Geometric Key Phase-Resonance Cryptography — Security Proofs
///

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  runSecurityProofs,
  bruteForceResistanceBits, quantumResistanceAnalysis,
  falseAcceptRate, falseRejectRate,
  verifyUniformCoverage,
  monteCarloAcceptance, monteCarloFRR,
  searchSpaceBits, acceptanceVolumeFraction,
  kuramotoOrderParameter, phaseAlignment,
  PHI, PHI_INV, GOLDEN_ANGLE,
  DEFAULT_DIMENSIONS, EMERGENCE_THRESHOLD,
} from '../engines/javascript/geometric-key-security-proofs.js';

describe('Security Proofs — Brute-Force Resistance', () => {
  it('search space exceeds 2^512 bits for N=64', () => {
    const bits = searchSpaceBits(64, 0.001);
    assert.ok(bits > 512, `Search space should exceed 512 bits: got ${bits}`);
  });

  it('resistance exceeds 2^512 for default parameters', () => {
    const result = bruteForceResistanceBits(64, 0.001);
    assert.ok(result.exceeds512, `Resistance should exceed 2^512: got ${result.resistanceBits} bits`);
    assert.ok(result.resistanceBits > 512);
  });

  it('resistance exceeds 2^256 for smaller N=32', () => {
    const result = bruteForceResistanceBits(32, 0.001);
    assert.ok(result.exceeds256, `Should exceed 256 bits for N=32: got ${result.resistanceBits}`);
  });

  it('acceptance volume is small for N=64', () => {
    const vol = acceptanceVolumeFraction(64);
    // The Rayleigh bound gives P(R≥1/φ) ≈ 5×10⁻⁶ per random trial
    assert.ok(vol.fraction < 0.001, `FAR per trial should be small: got ${vol.fraction}`);
    assert.ok(vol.log2Fraction < -10);
  });
});

describe('Security Proofs — Quantum Resistance', () => {
  it('Grover resistance exceeds 256 bits', () => {
    const result = quantumResistanceAnalysis(64, 0.001);
    assert.ok(result.groverResistanceBits > 256);
    assert.ok(result.groverExceeds256);
  });

  it('Shor algorithm is NOT applicable', () => {
    const result = quantumResistanceAnalysis(64, 0.001);
    assert.strictEqual(result.shorApplicable, false);
  });

  it('post-quantum secure (Grover > 128 bits)', () => {
    const result = quantumResistanceAnalysis(64, 0.001);
    assert.ok(result.postQuantumSecure);
    assert.ok(result.groverExceeds128);
  });

  it('provides comprehensive analysis', () => {
    const result = quantumResistanceAnalysis();
    assert.ok(result.analysis.length > 0);
    assert.ok(result.quantumAdvantage.includes('Quadratic'));
  });
});

describe('Security Proofs — False Accept Rate', () => {
  it('FAR is bounded for N=64', () => {
    const result = falseAcceptRate(64);
    // Per-trial FAR is small (Rayleigh concentration bound)
    assert.ok(result.FAR < 0.001, `FAR should be small: ${result.FAR}`);
    assert.ok(result.log2FAR < -10);
  });

  it('FAR decreases with more dimensions', () => {
    const far7 = falseAcceptRate(7);
    const far32 = falseAcceptRate(32);
    assert.ok(far32.FAR < far7.FAR);
  });
});

describe('Security Proofs — False Reject Rate', () => {
  it('FRR is negligible for σ=0.01', () => {
    const result = falseRejectRate(64, 0.01);
    assert.ok(result.expectedR > EMERGENCE_THRESHOLD);
    // With σ=0.01, expected R ≈ 0.99995 >> 0.618, so FRR → 0
    assert.ok(result.FRR < 0.01, `FRR should be near zero: ${result.FRR}`);
    assert.ok(result.zScore < -3, `z-score should be very negative: ${result.zScore}`);
  });

  it('correct key (no noise) always passes', () => {
    const result = falseRejectRate(64, 0.0);
    assert.ok(result.expectedR > 0.99);
  });

  it('large noise increases FRR', () => {
    const lowNoise = falseRejectRate(64, 0.01);
    const highNoise = falseRejectRate(64, 1.0);
    // High noise should have lower expected R and thus higher FRR
    assert.ok(highNoise.expectedR < lowNoise.expectedR);
    assert.ok(highNoise.zScore > lowNoise.zScore);
  });
});

describe('Security Proofs — Uniform Coverage', () => {
  it('three-distance property holds for golden-angle placement', () => {
    const result = verifyUniformCoverage(64);
    assert.ok(result.threeDistanceProperty, `Should have ≤ 3 distinct gaps: got ${result.distinctGapCount}`);
  });

  it('no clustering attack possible', () => {
    const result = verifyUniformCoverage(64);
    assert.ok(result.noClusteringAttack);
    assert.ok(result.uniform);
  });

  it('max concentration is bounded', () => {
    const result = verifyUniformCoverage(100);
    assert.ok(result.maxConcentration < 0.2); // Should be near 0.1 for k=10
  });

  it('gap ratio is bounded', () => {
    const result = verifyUniformCoverage(23);
    assert.ok(result.gapRatio < PHI * PHI * 2); // Bounded by φ² with margin
  });
});

describe('Security Proofs — Monte Carlo Verification', () => {
  it('random phases rarely achieve R ≥ 1/φ (FAR verification)', () => {
    const result = monteCarloAcceptance(5000, 7);
    // For N=7, empirical rate should be low
    assert.ok(result.empiricalRate < 0.1, `Empirical FAR too high: ${result.empiricalRate}`);
    assert.ok(result.consistentWithTheory);
  });

  it('correct key with small noise always passes (FRR verification)', () => {
    const result = monteCarloFRR(5000, 7, 0.01);
    assert.strictEqual(result.rejected, 0, 'No correct keys should be rejected');
    assert.ok(result.robust);
  });

  it('correct key with moderate noise still mostly passes', () => {
    const result = monteCarloFRR(1000, 7, 0.3);
    // With σ=0.3, most should still pass
    assert.ok(result.empiricalFRR < 0.5);
  });
});

describe('Security Proofs — Complete Suite', () => {
  it('full security proof suite returns all sections', () => {
    const proofs = runSecurityProofs({ dimensions: 32, resolution: 0.01, trials: 1000 });
    assert.ok(proofs.parameters);
    assert.ok(proofs.bruteForce);
    assert.ok(proofs.quantumResistance);
    assert.ok(proofs.falseAcceptRate);
    assert.ok(proofs.falseRejectRate);
    assert.ok(proofs.uniformCoverage);
    assert.ok(proofs.monteCarlo);
    assert.ok(proofs.summary);
  });

  it('summary confirms all security properties', () => {
    const proofs = runSecurityProofs({ dimensions: 64 });
    assert.ok(proofs.summary.bruteForceResistant);
    assert.ok(proofs.summary.quantumResistant);
    assert.ok(proofs.summary.uniformCoverage);
    assert.ok(proofs.summary.lowFAR);
    assert.ok(proofs.summary.lowFRR);
  });
});

describe('Security Proofs — Phase Alignment', () => {
  it('identical phases yield R = 1', () => {
    const envelope = [0, 1, 2, 3, 4];
    const { R } = phaseAlignment(envelope, envelope);
    assert.ok(Math.abs(R - 1.0) < 1e-10);
  });

  it('random phases yield low R', () => {
    const envelope = [0, 1, 2, 3, 4, 5, 6];
    const random = [3.1, 0.7, 5.2, 1.8, 4.4, 2.1, 6.0];
    const { R } = phaseAlignment(random, envelope);
    assert.ok(R < 0.8, `Random phases should not align well: R=${R}`);
  });
});
