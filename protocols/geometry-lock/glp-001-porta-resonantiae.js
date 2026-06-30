///
/// GLP-001 — Protocollum Portae Resonantiae
/// Latin: "The Protocol of the Resonance Gate"
///
/// THE LOCK'S CORE ENGINE.
///
/// The Gate does not ask who you are.
/// It asks: does your shape resonate with mine?
///
/// The Lock is not passive — it is a living field.
/// It plays OFFENSE and DEFENSE simultaneously:
///   OFFENSE: actively probes callers, tests coherence, flags drift
///   DEFENSE: validates tokens, blocks replays, enforces laws
///
/// Mathematics:
///   The lock is the Kuramoto order parameter applied to DIFFERENCE phases:
///     R_align = |(1/N)·Σ e^(i·Δθⱼ)|  where Δθⱼ = θ_presented_j − θ_envelope_j
///     R_align → 1:  shapes are identical  → GRANTED
///     R_align → 0:  shapes are orthogonal → DENIED
///
///   OFFENSE threshold (tighter than defense):
///     R_probe > φ⁻¹ + (φ⁻¹ × φ⁻¹) = 1/φ + 1/φ² ≈ 0.618 + 0.382 = 1.000
///     → offense probes at full resonance, flags anything not perfect
///
///   DEFENSE threshold (the law):
///     R_gate > φ⁻¹ = 0.6180339887  (EMERGENCE_THRESHOLD)
///
///   Adversarial margin:
///     margin = |R − EMERGENCE_THRESHOLD| < EMERGENCE_THRESHOLD × 0.1/φ
///     → if margin < 0.038, the key is suspiciously close to threshold
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI_INV, EMERGENCE_THRESHOLD,
  KEY_DIMENSIONS, makeValidationResult, currentWindowIndex,
  DENIAL_REASON,
} from '../geometry-key/gkp-001-clavis-geometrica.js';

import {
  kuramotoOrderParameter, phaseAlignment, pythagoreanPhaseDistance, KuramotoLock,
} from '../geometry-key/gkp-002-resonantia-kuramoti.js';

import { verifySignature } from '../geometry-key/gkp-004-signatura-aurea.js';

// ═══════════════════════════════════════════════════════════════════════════
//  LOCK CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

// Offense threshold: probe must exceed this to be considered fully resonant
export const OFFENSE_THRESHOLD = EMERGENCE_THRESHOLD + Math.pow(PHI_INV, 2); // ≈1.0 (clipped to 1.0 in practice)

// Adversarial margin: how close to threshold before we flag a key as crafted
export const ADVERSARIAL_MARGIN = EMERGENCE_THRESHOLD * 0.1 * PHI_INV;     // ≈ 0.038

// Maximum consecutive denials before auto-escalation to sentinel
export const ESCALATION_THRESHOLD = Math.round(PHI3);   // = 4 (≈ φ³)

// Lock health minimum — if below this, the lock alerts the guardian
export const LOCK_HEALTH_MIN = PHI_INV;  // 0.618

// ═══════════════════════════════════════════════════════════════════════════
//  RESONANCE GATE — The Primary Lock
// ═══════════════════════════════════════════════════════════════════════════

export class ResonanceGate {
  /**
   * @param {object} opts
   * @param {string} [opts.gateId]
   * @param {boolean} [opts.offenseEnabled]  — run active probes on callers
   * @param {boolean} [opts.strict]          — deny on adversarial proximity
   */
  constructor({ gateId = 'GLP-001', offenseEnabled = true, strict = false } = {}) {
    this.gateId          = gateId;
    this.offenseEnabled  = offenseEnabled;
    this.strict          = strict;
    this.birthTime       = Date.now();

    // Core lock
    this._lock           = new KuramotoLock({ protocolId: gateId });

    // Offense tracking
    this._probeLog       = [];   // offensive probes sent
    this._threatLog      = [];   // adversarial keys detected
    this._escalations    = [];   // callers escalated to sentinel

    // Defense tracking: denial streaks per caller
    this._denialStreaks  = new Map();  // callerId → consecutive denial count

    // Health score: running average of granted R values
    this._grantedRSum    = 0;
    this._grantedCount   = 0;

    console.log(`🔒 ResonanceGate born | id=${gateId} | offense=${offenseEnabled} | threshold=${EMERGENCE_THRESHOLD.toFixed(6)}`);
  }

  // ─── Registration ─────────────────────────────────────────────────────────

  register(callerId, phases, sharedSecret) {
    this._lock.register(callerId, phases, sharedSecret);
    this._denialStreaks.set(callerId, 0);
  }

  revoke(callerId) {
    return this._lock.revoke(callerId);
  }

  isRegistered(callerId) {
    return this._lock.isRegistered(callerId);
  }

  getEnvelopePhases(callerId) {
    return this._lock.getEnvelopePhases(callerId);
  }

  // ─── Defense — Primary Validation ────────────────────────────────────────

  /**
   * Defense: validate a presented token through the full 4-step pipeline.
   * If offense is enabled, also runs an adversarial probe.
   *
   * @param {object}  token
   * @returns {object}  { result: ValidationResult, threat?: ThreatReport }
   */
  defend(token) {
    const currentWindow = currentWindowIndex();
    const result        = this._lock.validate(token, currentWindow, verifySignature);

    // Track denial streak
    const streak = this._denialStreaks.get(token.callerId) || 0;
    if (result.granted) {
      this._denialStreaks.set(token.callerId, 0);
      this._grantedRSum += result.R;
      this._grantedCount++;
    } else {
      const newStreak = streak + 1;
      this._denialStreaks.set(token.callerId, newStreak);

      // Auto-escalate after φ³ consecutive denials
      if (newStreak >= ESCALATION_THRESHOLD) {
        this._escalate(token.callerId, result.reason, newStreak);
      }
    }

    // Offense: if granted but suspicious, probe further
    let threat = null;
    if (this.offenseEnabled && result.granted) {
      threat = this._probeForAdversarial(token);
      if (threat && this.strict) {
        // In strict mode, revoke the grant if adversarial detected
        result.granted = false;
        result.reason  = 'adversarial_suspected';
        this._threatLog.push(threat);
        return { result, threat };
      }
    }

    return { result, threat };
  }

  // ─── Offense — Active Probing ─────────────────────────────────────────────

  /**
   * Offense: detect adversarially crafted keys.
   * A key is adversarial if its R is suspiciously close to EMERGENCE_THRESHOLD.
   *
   * @param {object}  token
   * @returns {ThreatReport | null}
   */
  _probeForAdversarial(token) {
    const envPhases = this._lock.getEnvelopePhases(token.callerId);
    if (!envPhases) return null;

    const R      = phaseAlignment(token.phases, envPhases);
    const margin = Math.abs(R - EMERGENCE_THRESHOLD);

    if (margin < ADVERSARIAL_MARGIN) {
      const threat = {
        type:      'adversarial_proximity',
        callerId:  token.callerId,
        R,
        margin,
        threshold: ADVERSARIAL_MARGIN,
        ts:        Date.now(),
        verdict:   'ADVERSARIAL_SUSPECTED',
      };
      this._probeLog.push({ type: 'probe', callerId: token.callerId, R, ts: Date.now() });
      return threat;
    }

    // Also check for phase manipulation: extremely uniform phases are suspicious
    const { R: selfR } = kuramotoOrderParameter(token.phases);
    if (selfR > 0.99) {
      const threat = {
        type:      'phase_manipulation',
        callerId:  token.callerId,
        selfR,
        ts:        Date.now(),
        verdict:   'UNIFORM_PHASES_DETECTED',
        note:      'All phases suspiciously uniform — possible injection attack',
      };
      this._probeLog.push({ type: 'probe_uniform', callerId: token.callerId, selfR, ts: Date.now() });
      return threat;
    }

    return null;
  }

  /**
   * Offense: active probe — generate a test token for a registered caller
   * and validate it to confirm the lock is working correctly.
   * Returns lock health (0 = broken, 1 = perfect).
   */
  selfProbe(callerId, expectedPhases) {
    if (!this._lock.isRegistered(callerId)) return null;

    const envPhases = this._lock.getEnvelopePhases(callerId);
    if (!envPhases) return null;

    const R    = phaseAlignment(expectedPhases, envPhases);
    const dist = pythagoreanPhaseDistance(expectedPhases, envPhases);

    const probeResult = {
      callerId,
      R,
      distance:         dist,
      healthy:          R > EMERGENCE_THRESHOLD,
      lockHealthScore:  this._lockHealth(),
      ts:               Date.now(),
    };

    this._probeLog.push(probeResult);
    return probeResult;
  }

  _escalate(callerId, reason, streak) {
    const escalation = { callerId, reason, streak, ts: Date.now() };
    this._escalations.push(escalation);
    console.warn(`🚨 GLP-001 ESCALATION | caller=${callerId} | streak=${streak} | reason=${reason}`);
  }

  _lockHealth() {
    if (this._grantedCount === 0) return 0;
    return this._grantedRSum / this._grantedCount;
  }

  // ─── Diagnostics ──────────────────────────────────────────────────────────

  getStatus() {
    return {
      gateId:            this.gateId,
      offenseEnabled:    this.offenseEnabled,
      strict:            this.strict,
      registeredCallers: this._lock._envelopes.size,
      lockHealth:        this._lockHealth(),
      totalEscalations:  this._escalations.length,
      totalThreats:      this._threatLog.length,
      totalProbes:       this._probeLog.length,
      emergenceThreshold: EMERGENCE_THRESHOLD,
      adversarialMargin: ADVERSARIAL_MARGIN,
      auditLog:          this._lock.getAuditLog(),
      recentEscalations: this._escalations.slice(-10),
      recentThreats:     this._threatLog.slice(-10),
      uptime:            Date.now() - this.birthTime,
    };
  }
}

export default {
  ResonanceGate,
  OFFENSE_THRESHOLD,
  ADVERSARIAL_MARGIN,
  ESCALATION_THRESHOLD,
  LOCK_HEALTH_MIN,
};
