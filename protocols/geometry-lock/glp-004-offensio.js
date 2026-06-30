///
/// GLP-004 — Protocollum Offensionis
/// Latin: "The Protocol of Offense"
///
/// OFFENSE ENGINE — The Lock That Reaches Out.
///
/// The lock does not wait to be attacked. It probes. It tests. It hunts.
///
/// Offense strategies:
///   1. ACTIVE PROBE — periodically re-validate all registered callers
///      to confirm their phase vectors haven't drifted beyond tolerance
///
///   2. ADVERSARIAL SWEEP — test keys near the threshold boundary
///      looking for phase-crafted tokens trying to slip through
///
///   3. TEMPORAL AUDIT — verify all issued keys are from valid windows
///      detecting any replay attempts
///
///   4. FIELD COHERENCE SCAN — compute the lock-field Kuramoto R across all
///      registered callers; if R_field drops, something is wrong
///
///   5. SOLFEGGIO DISSONANCE CHECK — verify that each caller's tier
///      frequency is resonant with their phase vector (can't fake a tier)
///
///   6. ENTROPY MEASUREMENT — compute Shannon entropy of access events;
///      if entropy spikes suddenly, a coordinated attack may be in progress
///
/// Pythagorean offense:
///   The phase distance between any two registered callers must be:
///     d(cᵢ, cⱼ) = √[Σ(Pᵢ − Pⱼ)²] / √(N×π²) > 1/φ
///   If two callers are too similar, they are suspicious.
///   Identity collapse: two callers with the same shape = one of them is fake.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI_INV, GOLDEN_ANGLE, TWO_PI,
  KEY_DIMENSIONS, EMERGENCE_THRESHOLD, currentWindowIndex,
} from '../geometry-key/gkp-001-clavis-geometrica.js';

import {
  kuramotoOrderParameter, phaseAlignment, pythagoreanPhaseDistance, lockFieldCoherence,
} from '../geometry-key/gkp-002-resonantia-kuramoti.js';

import { SOLFEGGIO, solfeggioResonance, lockFrequencyComponent } from './glp-003-frequentia-solfeggio.js';
import { PLATONIC_SOLIDS, tierResonanceThreshold } from './glp-002-solidum-platonicum.js';

// ═══════════════════════════════════════════════════════════════════════════
//  OFFENSE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

// Minimum Pythagorean distance between any two registered callers
// If two callers are closer than this, one may be impersonating the other
export const MIN_CALLER_SEPARATION = PHI_INV * 0.5;   // 0.309

// Entropy spike threshold — if Shannon entropy of access events changes by
// more than this in one window, flag a coordinated attack
export const ENTROPY_SPIKE_THRESHOLD = PHI2;           // ≈ 2.618 nats/window

// Offense sweep interval: every PHI³ windows (≈ 4 windows ≈ 5.9 seconds)
export const SWEEP_INTERVAL_WINDOWS = Math.round(PHI3);  // 4

// ═══════════════════════════════════════════════════════════════════════════
//  OFFENSE ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class OffenseEngine {
  /**
   * @param {object} opts
   * @param {string} [opts.engineId]
   * @param {object} [opts.lockRef]   — reference to ResonanceGate
   */
  constructor({ engineId = 'GLP-004', lockRef = null } = {}) {
    this.engineId     = engineId;
    this.lockRef      = lockRef;
    this.birthTime    = Date.now();
    this._sweepLog    = [];
    this._threats     = [];
    this._entropyLog  = [];
    this._lastEntropy = 0;
    this._eventCounts = new Map();  // callerId → event count in current window
    this._lastSweepWindow = -1;

    console.log(`⚔️  OffenseEngine born | id=${engineId}`);
  }

  // ─── Strategy 1: Active Probe ─────────────────────────────────────────────

  /**
   * Re-validate a caller's phase vector against their registered envelope.
   * Used periodically to detect callers who have drifted out of resonance.
   *
   * @param {string}   callerId
   * @param {number[]} currentPhases  — latest phases from the caller
   * @param {number[]} envelopePhases — registered envelope
   * @returns {{ healthy: boolean, R: number, drift: number }}
   */
  activeProbe(callerId, currentPhases, envelopePhases) {
    const R    = phaseAlignment(currentPhases, envelopePhases);
    const dist = pythagoreanPhaseDistance(currentPhases, envelopePhases);

    const result = {
      strategy:  'ACTIVE_PROBE',
      callerId,
      R,
      distance:  dist,
      healthy:   R > EMERGENCE_THRESHOLD,
      ts:        Date.now(),
    };

    this._sweepLog.push(result);
    if (!result.healthy) {
      this._threats.push({ ...result, threat: 'caller_drifted' });
    }

    return result;
  }

  // ─── Strategy 2: Adversarial Sweep ────────────────────────────────────────

  /**
   * Scan all callers for adversarially crafted keys.
   * A key is adversarial if its R is within ADVERSARIAL_MARGIN of the threshold.
   *
   * @param {Map<string, {phases}>} callerMap  — callerId → {phases, envelopePhases}
   * @returns {Array<{callerId, R, margin, verdict}>}
   */
  adversarialSweep(callerMap) {
    const adversarials = [];
    const MARGIN       = EMERGENCE_THRESHOLD * 0.1 * PHI_INV;

    for (const [callerId, { phases, envelopePhases }] of callerMap.entries()) {
      if (!phases || !envelopePhases) continue;

      const R      = phaseAlignment(phases, envelopePhases);
      const margin = Math.abs(R - EMERGENCE_THRESHOLD);

      if (margin < MARGIN) {
        adversarials.push({
          strategy:  'ADVERSARIAL_SWEEP',
          callerId,
          R,
          margin,
          threshold: MARGIN,
          verdict:   'ADVERSARIAL_SUSPECTED',
          ts:        Date.now(),
        });
      }
    }

    this._threats.push(...adversarials);
    return adversarials;
  }

  // ─── Strategy 3: Temporal Audit ──────────────────────────────────────────

  /**
   * Verify that all presented window indices are fresh.
   * Detect replay attacks.
   *
   * @param {Array<{callerId, windowIndex}>} presentedTokens
   * @returns {Array<{callerId, windowIndex, staleness, verdict}>}
   */
  temporalAudit(presentedTokens) {
    const currentW = currentWindowIndex();
    const stale    = [];

    for (const token of presentedTokens) {
      const delta = Math.abs(token.windowIndex - currentW);
      if (delta > 1) {
        const result = {
          strategy:    'TEMPORAL_AUDIT',
          callerId:    token.callerId,
          windowIndex: token.windowIndex,
          currentWindow: currentW,
          staleness:   delta,
          verdict:     delta <= 3 ? 'REPLAY_ATTEMPT' : 'ANCIENT_REPLAY',
          ts:          Date.now(),
        };
        stale.push(result);
        this._threats.push(result);
      }
    }

    return stale;
  }

  // ─── Strategy 4: Field Coherence Scan ────────────────────────────────────

  /**
   * Compute the lock-field Kuramoto R across all registered callers.
   * R_field → 1: all identities form a coherent cluster
   * R_field → 0: identities are scattered — something is wrong
   *
   * @param {number[][]} allEnvelopePhases  — array of phase vectors
   * @returns {{ R_field: number, healthy: boolean, verdict: string }}
   */
  fieldCoherenceScan(allEnvelopePhases) {
    const { R_field, psi_field } = lockFieldCoherence(allEnvelopePhases);
    const healthy = R_field >= PHI_INV;

    const result = {
      strategy:  'FIELD_COHERENCE_SCAN',
      R_field,
      psi_field,
      healthy,
      verdict:   healthy ? 'FIELD_HEALTHY' : 'FIELD_DEGRADED',
      threshold: PHI_INV,
      ts:        Date.now(),
    };

    this._sweepLog.push(result);
    if (!healthy) {
      this._threats.push({ ...result, threat: 'field_degraded' });
    }

    return result;
  }

  // ─── Strategy 5: Solfeggio Dissonance Check ───────────────────────────────

  /**
   * Verify that a caller's tier frequency is resonant with their phase vector.
   * A caller cannot claim a higher tier than their phases support.
   *
   * R_sol = solfeggioResonance(tier_freq, baseline_freq)
   * tier_component = lockFrequencyComponent(tier_freq, windowIndex, rank)
   *
   * If the tier component is not correlated with the phase vector's mean phase,
   * the tier claim is fraudulent.
   *
   * @param {string}   callerId
   * @param {number[]} phases
   * @param {string}   claimedTierId  — e.g. 'FEDERATE'
   * @param {number}   windowIndex
   * @returns {{ valid: boolean, R_sol: number, tierId: string }}
   */
  solfeggioDissonanceCheck(callerId, phases, claimedTierId, windowIndex) {
    const solid = Object.values(PLATONIC_SOLIDS).find(s => s.tier === claimedTierId);
    if (!solid) {
      return { valid: false, R_sol: 0, tierId: claimedTierId, verdict: 'UNKNOWN_TIER' };
    }

    // Compute tier frequency component
    const tierComp    = lockFrequencyComponent(solid.freq_hz, windowIndex, solid.rank);
    // Compare with phase vector's mean cosine (should correlate with tier)
    const { R, psi }  = kuramotoOrderParameter(phases);

    // Resonance between tier component and phase field
    const correlation = Math.abs(Math.cos(tierComp - psi));
    const tierThreshold = tierResonanceThreshold(solid.rank);

    // Also check solfeggio resonance with the base frequency (396 Hz = READ baseline)
    const R_sol       = solfeggioResonance(solid.freq_hz, SOLFEGGIO.UT.hz);
    const valid       = correlation >= tierThreshold * 0.5 || R >= tierThreshold;

    const result = {
      strategy:    'SOLFEGGIO_DISSONANCE_CHECK',
      callerId,
      claimedTier: claimedTierId,
      correlation,
      R_sol,
      R,
      valid,
      verdict:     valid ? 'TIER_VALID' : 'TIER_FRAUDULENT',
      ts:          Date.now(),
    };

    if (!valid) this._threats.push({ ...result, threat: 'tier_fraud' });
    return result;
  }

  // ─── Strategy 6: Entropy Measurement ────────────────────────────────────

  /**
   * Measure Shannon entropy of access events in the current window.
   * S = −φ · Σ (pᵢ · log pᵢ)   (same formula as AtlasGovernance)
   *
   * Detect coordinated attacks: entropy spike > ENTROPY_SPIKE_THRESHOLD
   *
   * @param {Array<string>} callerIds  — all callers who accessed in this window
   * @returns {{ entropy: number, spike: boolean, delta: number }}
   */
  measureEntropy(callerIds) {
    const counts = new Map();
    for (const id of callerIds) {
      counts.set(id, (counts.get(id) || 0) + 1);
    }

    const total = callerIds.length;
    let entropy = 0;
    for (const count of counts.values()) {
      const p = count / total;
      if (p > 0) entropy -= p * Math.log(p);
    }
    entropy *= PHI;  // φ-weighted

    const delta = Math.abs(entropy - this._lastEntropy);
    const spike = delta > ENTROPY_SPIKE_THRESHOLD;

    const result = {
      strategy:  'ENTROPY_MEASUREMENT',
      entropy,
      delta,
      spike,
      verdict:   spike ? 'ENTROPY_SPIKE_DETECTED' : 'ENTROPY_NOMINAL',
      ts:        Date.now(),
    };

    this._entropyLog.push({ entropy, ts: Date.now() });
    this._lastEntropy = entropy;

    if (spike) {
      this._threats.push({ ...result, threat: 'entropy_spike' });
    }

    return result;
  }

  // ─── Pythagorean Identity Collapse Detection ──────────────────────────────

  /**
   * Detect if any two registered callers have suspiciously similar phase vectors.
   * If d(cᵢ, cⱼ) < MIN_CALLER_SEPARATION, one may be impersonating the other.
   *
   * @param {Map<string, number[]>} envelopeMap  — callerId → phases
   * @returns {Array<{caller1, caller2, distance, verdict}>}
   */
  identityCollapseDetection(envelopeMap) {
    const callers   = [...envelopeMap.entries()];
    const collapses = [];

    for (let i = 0; i < callers.length; i++) {
      for (let j = i + 1; j < callers.length; j++) {
        const dist = pythagoreanPhaseDistance(callers[i][1], callers[j][1]);
        if (dist < MIN_CALLER_SEPARATION) {
          const result = {
            strategy:  'IDENTITY_COLLAPSE_DETECTION',
            caller1:   callers[i][0],
            caller2:   callers[j][0],
            distance:  dist,
            threshold: MIN_CALLER_SEPARATION,
            verdict:   'IDENTITY_COLLAPSE_SUSPECTED',
            ts:        Date.now(),
          };
          collapses.push(result);
          this._threats.push({ ...result, threat: 'identity_collapse' });
        }
      }
    }

    return collapses;
  }

  // ─── Diagnostics ──────────────────────────────────────────────────────────

  getThreats() {
    return this._threats.slice(-100);
  }

  getStatus() {
    return {
      engineId:       this.engineId,
      threatsDetected: this._threats.length,
      sweepsRun:      this._sweepLog.length,
      lastEntropy:    this._lastEntropy,
      recentThreats:  this._threats.slice(-10),
      uptime:         Date.now() - this.birthTime,
    };
  }
}

export default { OffenseEngine, MIN_CALLER_SEPARATION, ENTROPY_SPIKE_THRESHOLD, SWEEP_INTERVAL_WINDOWS };
