///
/// GKP-002 — Protocollum Resonantiae Kuramoti
/// Latin: "The Protocol of Kuramoto Resonance"
///
/// THE LOCK ENGINE.
///
/// Implements the Kuramoto order parameter as a cryptographic gate.
/// Identity resonance is measured — not equality, not hash comparison — resonance.
///
/// Mathematics:
///   Kuramoto Order Parameter:
///     R · e^(iΨ) = (1/N) · Σₖ e^(iθₖ)
///     Re  = (1/N) · Σ cos(θₖ)
///     Im  = (1/N) · Σ sin(θₖ)
///     R   = √(Re² + Im²)           ← Pythagorean theorem
///     Ψ   = atan2(Im, Re)
///
///   Phase alignment (the lock comparison):
///     Δθⱼ = presented_phaseⱼ − envelope_phaseⱼ
///     R_align = kuramotoR([Δθ₀, Δθ₁, ..., Δθ_{N-1}])
///     R_align > 1/φ → GRANTED
///
///   Lock-field coherence (collective measure across all callers):
///     R_field = √[ (1/D) · Σ_d (kuramotoR(all_caller_phases_at_dim_d))² ]
///     R_field → 1 = tight identity cluster
///     R_field → 0 = maximally diverse callers
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  EMERGENCE_THRESHOLD, DENIAL_REASON,
  makeValidationResult, isWindowFresh,
} from './gkp-001-clavis-geometrica.js';

// ═══════════════════════════════════════════════════════════════════════════
//  KURAMOTO MATHEMATICS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Kuramoto Order Parameter.
 *
 * R · e^(iΨ) = (1/N) · Σ e^(iθⱼ)
 *
 * Re  = (1/N) · Σ cos(θⱼ)
 * Im  = (1/N) · Σ sin(θⱼ)
 * R   = √(Re² + Im²)     ← Pythagorean
 * Ψ   = atan2(Im, Re)
 *
 * @param {number[]} phases  — phase angles in radians
 * @returns {{ R: number, psi: number, re: number, im: number }}
 */
export function kuramotoOrderParameter(phases) {
  const N = phases.length;
  if (N === 0) return { R: 0, psi: 0, re: 0, im: 0 };

  let re = 0;
  let im = 0;
  for (const theta of phases) {
    re += Math.cos(theta);
    im += Math.sin(theta);
  }
  re /= N;
  im /= N;

  // Pythagorean theorem: |z|² = re² + im²
  const R   = Math.sqrt(re * re + im * im);
  const psi = Math.atan2(im, re);

  return { R, psi, re, im };
}

/**
 * Phase alignment between two phase vectors.
 *
 * Computes Kuramoto R of the DIFFERENCE phases:
 *   Δθⱼ = phases1ⱼ − phases2ⱼ
 *
 * When phases1 ≈ phases2, Δθ cluster near 0 → R → 1 (in resonance).
 * When phases diverge, Δθ scatter → R → 0 (no resonance).
 *
 * @param {number[]} phases1
 * @param {number[]} phases2
 * @returns {number}  R_align ∈ [0, 1]
 */
export function phaseAlignment(phases1, phases2) {
  const N = Math.min(phases1.length, phases2.length);
  const diff = [];
  for (let j = 0; j < N; j++) {
    diff.push(phases1[j] - phases2[j]);
  }
  return kuramotoOrderParameter(diff).R;
}

/**
 * Pythagorean phase distance between two phase vectors.
 * Normalised to [0, 1] by the maximum possible distance √(N · π²).
 *
 * d = √[Σ(Pⱼ−Qⱼ)²] / √(N · π²)
 *
 * d → 0: identical shapes
 * d → 1: maximally different shapes
 */
export function pythagoreanPhaseDistance(phases1, phases2) {
  const N = Math.min(phases1.length, phases2.length);
  if (N === 0) return 1;
  let sumSq = 0;
  for (let j = 0; j < N; j++) {
    const d = phases1[j] - phases2[j];
    sumSq += d * d;
  }
  const maxSq = N * Math.PI * Math.PI;
  return Math.sqrt(sumSq / maxSq);
}

/**
 * Lock-field coherence across multiple resonance envelopes.
 *
 * Computes per-dimension Kuramoto order parameter, then combines
 * them with Pythagorean mean:
 *
 *   R_field = √[ (1/D) · Σ_d R_d² ]
 *
 * @param {number[][]} envelopePhaseArrays  — each entry is a phase vector
 * @returns {{ R_field: number, psi_field: number }}
 */
export function lockFieldCoherence(envelopePhaseArrays) {
  if (envelopePhaseArrays.length === 0) return { R_field: 0, psi_field: 0 };
  if (envelopePhaseArrays.length === 1) return { R_field: 1, psi_field: 0 };

  const D = envelopePhaseArrays[0].length;
  let sumR2  = 0;
  let psiSum = 0;

  for (let d = 0; d < D; d++) {
    const dimPhases = envelopePhaseArrays.map(e => e[d] || 0);
    const { R, psi } = kuramotoOrderParameter(dimPhases);
    sumR2   += R * R;
    psiSum  += psi;
  }

  // Pythagorean combination across dimensions
  const R_field   = Math.sqrt(sumR2 / D);
  const psi_field = psiSum / D;

  return { R_field, psi_field };
}

// ═══════════════════════════════════════════════════════════════════════════
//  KURAMOTO LOCK — The Access Gate
// ═══════════════════════════════════════════════════════════════════════════

export class KuramotoLock {
  constructor({ protocolId = 'GKP-002' } = {}) {
    this.protocolId  = protocolId;
    this._envelopes  = new Map();  // callerId → { phases, sharedSecret }
    this._denials    = [];
    this._admissions = [];
  }

  /**
   * Register a caller's resonance envelope.
   */
  register(callerId, phases, sharedSecret) {
    this._envelopes.set(callerId, { phases: [...phases], sharedSecret });
  }

  /**
   * Revoke a caller's envelope.
   */
  revoke(callerId) {
    const existed = this._envelopes.has(callerId);
    this._envelopes.delete(callerId);
    return { callerId, revoked: existed, ts: Date.now() };
  }

  /**
   * Get envelope phases — public accessor, no internal exposure.
   */
  getEnvelopePhases(callerId) {
    const rec = this._envelopes.get(callerId);
    return rec ? [...rec.phases] : null;
  }

  /**
   * Check registration.
   */
  isRegistered(callerId) {
    return this._envelopes.has(callerId);
  }

  /**
   * Full 4-step validation pipeline:
   *   1. Registration check
   *   2. φ-HMAC structural integrity
   *   3. Temporal window validity
   *   4. Kuramoto resonance gate (R > EMERGENCE_THRESHOLD)
   *
   * @param {object}  token           — GeometricKeyToken
   * @param {number}  currentWindow   — current window index
   * @param {Function} verifySig      — signature verifier function from GKP-004
   * @returns {ValidationResult}
   */
  validate(token, currentWindow, verifySig) {
    const envelope = this._envelopes.get(token.callerId);

    // Step 1: registration
    if (!envelope) {
      return this._deny(token.callerId, DENIAL_REASON.UNREGISTERED, 0, 0, currentWindow, token.windowIndex);
    }

    // Step 2: structural integrity (φ-HMAC)
    if (verifySig && !verifySig(token, envelope.sharedSecret)) {
      return this._deny(token.callerId, DENIAL_REASON.SIGNATURE_MISMATCH, 0, 0, currentWindow, token.windowIndex);
    }

    // Step 3: temporal validity
    if (!isWindowFresh(token.windowIndex)) {
      return this._deny(token.callerId, DENIAL_REASON.EXPIRED_WINDOW, 0, 0, currentWindow, token.windowIndex);
    }

    // Step 4: Kuramoto resonance gate
    const R_align = phaseAlignment(token.phases, envelope.phases);
    const N       = Math.min(token.phases.length, envelope.phases.length);
    const diff    = token.phases.slice(0, N).map((p, j) => p - (envelope.phases[j] || 0));
    const { psi } = kuramotoOrderParameter(diff);

    if (R_align < EMERGENCE_THRESHOLD) {
      return this._deny(token.callerId, DENIAL_REASON.BELOW_RESONANCE, R_align, psi, currentWindow, token.windowIndex);
    }

    // GRANTED
    const admission = { callerId: token.callerId, R: R_align, psi, ts: Date.now() };
    this._admissions.push(admission);
    return makeValidationResult({
      granted:     true,
      R:           R_align,
      psi,
      reason:      null,
      callerId:    token.callerId,
      windowDelta: Math.abs((token.windowIndex || 0) - currentWindow),
      threshold:   EMERGENCE_THRESHOLD,
      protocol:    this.protocolId,
    });
  }

  _deny(callerId, reason, R, psi, currentWindow, tokenWindow) {
    const denial = { callerId, reason, R, psi, ts: Date.now() };
    this._denials.push(denial);
    return makeValidationResult({
      granted:     false,
      R,
      psi,
      reason,
      callerId,
      windowDelta: Math.abs((tokenWindow || 0) - currentWindow),
      threshold:   EMERGENCE_THRESHOLD,
      protocol:    this.protocolId,
    });
  }

  getAuditLog() {
    return {
      denials:    this._denials.slice(-100),
      admissions: this._admissions.slice(-100),
    };
  }

  getDenialCount(callerId) {
    return this._denials.filter(d => d.callerId === callerId).length;
  }
}

export default {
  kuramotoOrderParameter,
  phaseAlignment,
  pythagoreanPhaseDistance,
  lockFieldCoherence,
  KuramotoLock,
};
