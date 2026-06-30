///
/// @medina/geometry-lock — GeometryLockSDK
/// PROTO-226 callable surface for external and internal consumers.
///
/// Exposes four verbs:
///   generateKey(callerId, sharedSecret)        → token (present on every call)
///   validateKey(token)                         → { granted, R, psi, reason? }
///   registerCaller(callerId, sharedSecret)     → { envelope, windowIndex }
///   revokeKey(callerId)                        → { callerId, revoked }
///
/// The lock is a singleton per SDK instance — one GeometricKeyProtocol guards
/// all registered callers.  Multiple SDK instances can coexist for separate
/// call surfaces (civitas / organism / governance).
///
/// Mathematics (from protocols/geometric-key-protocol.js):
///   - φ-spiral key generation (golden-angle phyllotaxis)
///   - Kuramoto order parameter for resonance measurement
///   - Pythagorean phase distance (diff-phase vector)
///   - EMERGENCE_THRESHOLD = 1/φ = 0.6180... — the resonance gate
///   - φ-HMAC signing for tamper-proofing
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  GeometricKeyProtocol,
  GeometricKey,
  kuramotoOrderParameter,
  phaseAlignment,
  EMERGENCE_THRESHOLD,
  GOLDEN_ANGLE,
  PHI,
  PHI2,
  PHI_HEARTBEAT_MS,
  KEY_DIMENSIONS,
} from '../../../protocols/geometric-key-protocol.js';

// ═══════════════════════════════════════════════════════════════════════════
//  GEOMETRY LOCK SDK
// ═══════════════════════════════════════════════════════════════════════════

export class GeometryLockSDK {
  /**
   * @param {object} opts
   * @param {string} [opts.lockId]     — identifier for this lock surface
   * @param {number} [opts.dimensions] — phase vector dimensions
   * @param {boolean} [opts.strict]    — if true, deny on ANY audit anomaly
   */
  constructor({ lockId = 'geometry-lock', dimensions = KEY_DIMENSIONS, strict = false } = {}) {
    this.lockId     = lockId;
    this.strict     = strict;
    this.birthTime  = Date.now();

    // ★ Self-bootstrapping — protocol comes alive in constructor, no .start() needed
    this._protocol = new GeometricKeyProtocol({ protocolId: lockId, dimensions });

    console.log(`🔐 GeometryLockSDK born | lockId=${lockId} | EMERGENCE_THRESHOLD=${EMERGENCE_THRESHOLD.toFixed(6)}`);
  }

  // ─── Core API ─────────────────────────────────────────────────────────────

  /**
   * Register a new caller with the lock.
   *
   * Must be called BEFORE generateKey or validateKey for that caller.
   * Derives the caller's resonance envelope from their identity + shared secret.
   *
   * @param {string} callerId
   * @param {string} sharedSecret   — shared between lock and caller
   * @returns {{ callerId, envelope: number[], windowIndex: number, coordinates }}
   */
  registerCaller(callerId, sharedSecret) {
    return this._protocol.registerCaller(callerId, sharedSecret);
  }

  /**
   * Generate a geometric key token for a registered caller.
   *
   * The caller calls this at the start of each interaction window.
   * The token encodes the caller's phase shape at the current φ-heartbeat window.
   *
   * @param {string} callerId
   * @returns {object}  token — pass this to validateKey()
   * @throws if caller is not registered
   */
  generateKey(callerId) {
    return this._protocol.issueKey(callerId);
  }

  /**
   * Validate a presented key token.
   *
   * Runs the full 4-step validation pipeline:
   *   1. Registration check
   *   2. φ-HMAC structural integrity (tamper-proofing)
   *   3. Temporal window validity (φ-heartbeat expiry)
   *   4. Kuramoto resonance check: R_align > EMERGENCE_THRESHOLD (0.618)
   *
   * @param {object}  token  — from generateKey()
   * @returns {{
   *   granted: boolean,
   *   R: number,          Kuramoto synchrony magnitude [0,1]
   *   psi: number,        mean phase [−π,π]
   *   reason?: string,    denial reason if !granted
   *   callerId: string,
   *   windowDelta: number,
   *   threshold: number
   * }}
   */
  validateKey(token) {
    const result = this._protocol.validateKey(token);

    if (this.strict && !result.granted) {
      // In strict mode, surface the denial to a sentinel (caller can hook this)
      this._onStrictDenial(result);
    }

    return result;
  }

  /**
   * Revoke a caller's key — removes their registered envelope.
   * Future tokens from this caller will fail at the registration check.
   *
   * @param {string} callerId
   * @returns {{ callerId, revoked: boolean, ts: number }}
   */
  revokeKey(callerId) {
    return this._protocol.revokeKey(callerId);
  }

  // ─── Utility ──────────────────────────────────────────────────────────────

  /**
   * Probe — check resonance of a token WITHOUT recording to the audit log.
   * Use for diagnostics and pre-flight checks.
   */
  probe(token) {
    return this._protocol.probe(token);
  }

  /**
   * Return the current Kuramoto order parameter across ALL registered callers'
   * envelopes.  This measures the overall lock field coherence — how similar
   * all registered identities are to each other.
   *
   * R_field → 1: all callers have similar phase shapes (tight cluster)
   * R_field → 0: callers are spread across phase space (diverse collective)
   *
   * Uses the organism's biorhythm model: compute per-dimension mean phase
   * across all envelopes, then Pythagorean-combine the dimension coherences.
   *
   * @returns {{ R_field: number, psi_field: number, callerCount: number }}
   */
  fieldCoherence() {
    const envelopes = [];
    for (const callerId of this._protocol._callers.keys()) {
      const phases = this._protocol.getEnvelopePhases(callerId);
      if (phases) envelopes.push(phases);
    }

    if (envelopes.length === 0) return { R_field: 0, psi_field: 0, callerCount: 0 };
    if (envelopes.length === 1) return { R_field: 1, psi_field: 0, callerCount: 1 };

    // For each dimension, compute the order parameter across all caller envelopes
    const dimCount = envelopes[0].length;
    let sumR2 = 0;
    let psiSum = 0;

    for (let d = 0; d < dimCount; d++) {
      const dimPhases = envelopes.map(e => e[d] || 0);
      const { R, psi } = kuramotoOrderParameter(dimPhases);
      sumR2   += R * R;
      psiSum  += psi;
    }

    // Pythagorean combination across dimensions: sqrt(Σ(R_d²) / D)
    const R_field   = Math.sqrt(sumR2 / dimCount);
    const psi_field = psiSum / dimCount;

    return { R_field, psi_field, callerCount: envelopes.length };
  }

  /**
   * Verify that a token was issued for the current or immediately adjacent
   * φ-window — a lightweight temporal freshness check without full validation.
   */
  isFresh(token) {
    const delta = Math.abs((token.windowIndex || 0) - this._protocol.currentWindow());
    return delta <= 1;
  }

  /**
   * Compute the geometric distance between two tokens in phase space.
   * Uses Pythagorean theorem on the per-dimension phase differences,
   * then normalises by √(D × π²) to get a [0, 1] distance.
   *
   * Distance 0   → identical shapes
   * Distance 1   → maximally different shapes
   *
   * @param {object} tokenA
   * @param {object} tokenB
   * @returns {number}  d ∈ [0, 1]
   */
  phaseDistance(tokenA, tokenB) {
    const pA = tokenA.phases || [];
    const pB = tokenB.phases || [];
    const N  = Math.min(pA.length, pB.length);
    if (N === 0) return 1;

    // Pythagorean sum of phase differences
    let sumSq = 0;
    for (let j = 0; j < N; j++) {
      const d = pA[j] - pB[j];
      sumSq  += d * d;
    }

    // Normalise: max possible distance in each dim is π (half-turn)
    const maxSq = N * Math.PI * Math.PI;
    return Math.sqrt(sumSq / maxSq);
  }

  /**
   * Check whether callerId is registered with the lock.
   */
  isRegistered(callerId) {
    return this._protocol.isRegistered(callerId);
  }

  // ─── Hook for strict mode ─────────────────────────────────────────────────

  _onStrictDenial(result) {
    // Override in subclass or replace to wire into sentinel infrastructure
    console.warn(`🚨 PROTO-226 STRICT DENIAL | caller=${result.callerId} | reason=${result.reason} | R=${result.R?.toFixed(4)}`);
  }

  // ─── Status ───────────────────────────────────────────────────────────────

  stop() {
    this._protocol.stop();
  }

  getStatus() {
    return {
      lockId:    this.lockId,
      strict:    this.strict,
      uptime:    Date.now() - this.birthTime,
      protocol:  this._protocol.getStatus(),
      field:     this.fieldCoherence(),
      constants: {
        phi:               PHI,
        phi2:              PHI2,
        goldenAngle:       GOLDEN_ANGLE,
        goldenAngleDeg:    GOLDEN_ANGLE * 180 / Math.PI,
        emergenceThreshold: EMERGENCE_THRESHOLD,
        phiHeartbeatMs:    PHI_HEARTBEAT_MS,
        keyDimensions:     this._protocol.dimensions,
      },
    };
  }
}

// ─── Re-export protocol primitives for callers who need raw access ─────────

export {
  GeometricKey,
  kuramotoOrderParameter,
  phaseAlignment,
  EMERGENCE_THRESHOLD,
  GOLDEN_ANGLE,
  PHI,
  PHI2,
  PHI_HEARTBEAT_MS,
  KEY_DIMENSIONS,
};

export default GeometryLockSDK;
