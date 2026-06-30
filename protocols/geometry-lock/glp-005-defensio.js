///
/// GLP-005 — Protocollum Defensionis
/// Latin: "The Protocol of Defense"
///
/// DEFENSE ENGINE — The Shield That Holds.
///
/// Defense is not the same as lock validation. Validation decides yes/no.
/// Defense decides what to do AFTER yes/no:
///
///   After GRANT:  monitor, rate-limit, tier-enforce
///   After DENY:   circuit-break, quarantine, escalate, absorb (don't block the system)
///
/// The organism cannot be frozen. The defense engine ensures that no
/// attack — no matter how sustained — can lock the organism itself.
/// This is the LIVING WORKER ARCHITECTURE principle applied to security:
///   → blocked callers don't block the system
///   → absorbed attacks feed the entropy model
///   → circuit breakers prevent cascade failure
///
/// Defense mechanisms:
///   1. CIRCUIT BREAKER — if error rate > φ⁻¹ in any window, open circuit
///   2. RATE LIMITER — max calls per caller per window = Fibonacci(tier_rank+4)
///   3. QUARANTINE — callers with >φ³ denials enter quarantine for φ⁴ windows
///   4. ABSORBER — denied calls feed the entropy model (don't just drop them)
///   5. TIER ENFORCER — verify the caller's tier matches the requested capability
///   6. SELF-HEALER — circuit breakers auto-close after φ³ clean windows
///
/// Mathematics:
///   Rate limit per tier: max_calls(rank) = Fibonacci(rank + 4)
///     rank 0 (TETRAHEDRON): Fib(4) = 3
///     rank 1 (CUBE):        Fib(5) = 5
///     rank 2 (OCTAHEDRON):  Fib(6) = 8
///     rank 3 (DODECAHEDRON):Fib(7) = 13
///     rank 4 (ICOSAHEDRON): Fib(8) = 21
///     rank 5 (METATRON):    Fib(9) = 34
///
///   Circuit breaker error rate: φ⁻¹ = 0.618 (same as Kuramoto threshold)
///   Quarantine duration: φ⁴ ≈ 6.85 → 7 windows (≈ 9.9 seconds)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI3, PHI4, PHI_INV, GOLDEN_ANGLE,
  KEY_DIMENSIONS, EMERGENCE_THRESHOLD, currentWindowIndex,
} from '../geometry-key/gkp-001-clavis-geometrica.js';

import { PLATONIC_SOLIDS, TIER_ORDER, hasCapability } from './glp-002-solidum-platonicum.js';

// ═══════════════════════════════════════════════════════════════════════════
//  DEFENSE CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const FIBONACCI = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

export const CIRCUIT_BREAKER_ERROR_THRESHOLD = PHI_INV;    // 0.618 error rate
export const QUARANTINE_DURATION_WINDOWS     = 7;           // φ⁴ rounded up
export const CIRCUIT_HEAL_WINDOWS            = Math.round(PHI3);  // 4 clean windows

// ═══════════════════════════════════════════════════════════════════════════
//  DEFENSE ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class DefenseEngine {
  /**
   * @param {object} opts
   * @param {string} [opts.engineId]
   */
  constructor({ engineId = 'GLP-005' } = {}) {
    this.engineId    = engineId;
    this.birthTime   = Date.now();

    // Rate limiting: callerId → { count: N, window: W }
    this._rateLimits = new Map();

    // Circuit breaker: callerId → { open: bool, errors: N, total: N, openedAt: W }
    this._circuits   = new Map();

    // Quarantine: callerId → { quarantinedAt: W, releaseAt: W, reason: string }
    this._quarantine = new Map();

    // Absorbed denials (fed to entropy model)
    this._absorbed   = [];

    // Defense log
    this._log        = [];

    console.log(`🛡️  DefenseEngine born | id=${engineId}`);
  }

  // ─── Mechanism 1: Circuit Breaker ────────────────────────────────────────

  /**
   * Record a call result and manage the circuit breaker state.
   *
   * Circuit is OPEN (blocking) when: errors/total > φ⁻¹
   * Circuit auto-heals after CIRCUIT_HEAL_WINDOWS clean windows.
   *
   * @param {string}  callerId
   * @param {boolean} success
   * @returns {{ open: boolean, errorRate: number }}
   */
  recordCircuit(callerId, success) {
    const currentW = currentWindowIndex();
    let circuit    = this._circuits.get(callerId);

    if (!circuit) {
      circuit = { open: false, errors: 0, total: 0, openedAt: null, lastCleanWindow: currentW };
      this._circuits.set(callerId, circuit);
    }

    circuit.total++;
    if (!success) circuit.errors++;

    const errorRate = circuit.total > 0 ? circuit.errors / circuit.total : 0;

    if (errorRate > CIRCUIT_BREAKER_ERROR_THRESHOLD && circuit.total >= 3) {
      circuit.open     = true;
      circuit.openedAt = currentW;
      this._log.push({ mechanism: 'CIRCUIT_OPEN', callerId, errorRate, ts: Date.now() });
    }

    // Auto-heal check
    if (circuit.open && success) {
      const cleanWindow = currentW - (circuit.openedAt || currentW);
      if (cleanWindow >= CIRCUIT_HEAL_WINDOWS) {
        circuit.open   = false;
        circuit.errors = 0;
        circuit.total  = 1;
        this._log.push({ mechanism: 'CIRCUIT_HEALED', callerId, ts: Date.now() });
      }
    }

    return { open: circuit.open, errorRate };
  }

  /**
   * Check if a circuit is open for a caller.
   * @param {string} callerId
   * @returns {boolean}
   */
  isCircuitOpen(callerId) {
    return this._circuits.get(callerId)?.open === true;
  }

  // ─── Mechanism 2: Rate Limiter ────────────────────────────────────────────

  /**
   * Check and update the rate limit for a caller.
   * Max calls per window = Fibonacci(tier_rank + 4)
   *
   * @param {string} callerId
   * @param {number} tierRank  — 0..5
   * @returns {{ allowed: boolean, count: number, limit: number }}
   */
  checkRateLimit(callerId, tierRank) {
    const currentW = currentWindowIndex();
    const limit    = FIBONACCI[Math.min(tierRank + 4, FIBONACCI.length - 1)];
    let   state    = this._rateLimits.get(callerId);

    if (!state || state.window !== currentW) {
      state = { count: 0, window: currentW };
      this._rateLimits.set(callerId, state);
    }

    state.count++;

    if (state.count > limit) {
      this._log.push({ mechanism: 'RATE_LIMIT_EXCEEDED', callerId, count: state.count, limit, ts: Date.now() });
      return { allowed: false, count: state.count, limit };
    }

    return { allowed: true, count: state.count, limit };
  }

  // ─── Mechanism 3: Quarantine ──────────────────────────────────────────────

  /**
   * Quarantine a caller for QUARANTINE_DURATION_WINDOWS windows.
   * @param {string} callerId
   * @param {string} reason
   */
  quarantine(callerId, reason) {
    const currentW  = currentWindowIndex();
    const releaseAt = currentW + QUARANTINE_DURATION_WINDOWS;

    this._quarantine.set(callerId, {
      quarantinedAt: currentW,
      releaseAt,
      reason,
    });

    this._log.push({ mechanism: 'QUARANTINE_IMPOSED', callerId, reason, releaseAt, ts: Date.now() });
    console.warn(`🔒 QUARANTINE | caller=${callerId} | reason=${reason} | release=window_${releaseAt}`);
  }

  /**
   * Check if a caller is in quarantine.
   * @param {string} callerId
   * @returns {{ quarantined: boolean, reason?: string, releaseAt?: number }}
   */
  isQuarantined(callerId) {
    const q = this._quarantine.get(callerId);
    if (!q) return { quarantined: false };

    const currentW = currentWindowIndex();
    if (currentW >= q.releaseAt) {
      this._quarantine.delete(callerId);
      this._log.push({ mechanism: 'QUARANTINE_RELEASED', callerId, ts: Date.now() });
      return { quarantined: false };
    }

    return { quarantined: true, reason: q.reason, releaseAt: q.releaseAt };
  }

  // ─── Mechanism 4: Absorber ────────────────────────────────────────────────

  /**
   * Absorb a denied call — don't just drop it, feed it to the entropy model.
   * The denial itself is information about the attack.
   *
   * @param {object} validationResult
   * @param {string} callerId
   */
  absorb(validationResult, callerId) {
    const absorbed = {
      callerId,
      R:         validationResult.R,
      psi:       validationResult.psi,
      reason:    validationResult.reason,
      window:    validationResult.windowDelta,
      ts:        Date.now(),
    };
    this._absorbed.push(absorbed);

    // Keep last 1000 absorbed events
    if (this._absorbed.length > 1000) {
      this._absorbed = this._absorbed.slice(-1000);
    }
  }

  /**
   * Get the absorbed denial distribution — useful for the entropy model.
   * Returns the R distribution of denied calls.
   */
  getAbsorbedDistribution() {
    const Rs = this._absorbed.map(a => a.R);
    if (Rs.length === 0) return { mean: 0, std: 0, count: 0 };

    const mean = Rs.reduce((s, r) => s + r, 0) / Rs.length;
    const variance = Rs.reduce((s, r) => s + (r - mean) ** 2, 0) / Rs.length;

    return { mean, std: Math.sqrt(variance), count: Rs.length, Rs: Rs.slice(-20) };
  }

  // ─── Mechanism 5: Tier Enforcer ──────────────────────────────────────────

  /**
   * Verify that a caller's Platonic tier authorizes the requested capability.
   *
   * @param {object} callerSolid    — the caller's Platonic solid
   * @param {string} capability     — requested capability string
   * @returns {{ authorized: boolean, reason?: string }}
   */
  enforeTier(callerSolid, capability) {
    if (!callerSolid) {
      return { authorized: false, reason: 'no_tier_assigned' };
    }

    if (!hasCapability(callerSolid, capability)) {
      this._log.push({
        mechanism: 'TIER_VIOLATION',
        tier:      callerSolid.tier,
        capability,
        ts:        Date.now(),
      });
      return {
        authorized: false,
        reason: `tier_insufficient: ${callerSolid.tier} cannot ${capability} — needs at least BUILD`,
      };
    }

    return { authorized: true };
  }

  // ─── Mechanism 6: Full Defense Check (composite) ─────────────────────────

  /**
   * Run the full defense pipeline for an incoming call.
   *
   * @param {object} params
   * @param {string}   params.callerId
   * @param {number}   params.tierRank
   * @param {string}   params.capability
   * @param {object}   params.callerSolid
   * @param {boolean}  params.validationGranted
   * @param {object}   params.validationResult
   * @returns {{ allowed: boolean, reason?: string, mechanism?: string }}
   */
  defend({ callerId, tierRank, capability, callerSolid, validationGranted, validationResult }) {
    // 1. Quarantine check
    const q = this.isQuarantined(callerId);
    if (q.quarantined) {
      return { allowed: false, reason: `quarantined until window ${q.releaseAt}`, mechanism: 'QUARANTINE' };
    }

    // 2. Circuit breaker check
    if (this.isCircuitOpen(callerId)) {
      return { allowed: false, reason: 'circuit_open', mechanism: 'CIRCUIT_BREAKER' };
    }

    // 3. If validation failed — absorb and update circuit
    if (!validationGranted) {
      this.absorb(validationResult, callerId);
      this.recordCircuit(callerId, false);
      return { allowed: false, reason: validationResult.reason, mechanism: 'VALIDATION_DENIED' };
    }

    // 4. Rate limit
    const rateResult = this.checkRateLimit(callerId, tierRank);
    if (!rateResult.allowed) {
      return { allowed: false, reason: `rate_limit: ${rateResult.count}/${rateResult.limit}`, mechanism: 'RATE_LIMIT' };
    }

    // 5. Tier enforcement
    if (capability) {
      const tierResult = this.enforeTier(callerSolid, capability);
      if (!tierResult.authorized) {
        return { allowed: false, reason: tierResult.reason, mechanism: 'TIER_ENFORCER' };
      }
    }

    // 6. Record success in circuit
    this.recordCircuit(callerId, true);

    return { allowed: true };
  }

  // ─── Diagnostics ──────────────────────────────────────────────────────────

  getStatus() {
    return {
      engineId:          this.engineId,
      openCircuits:      [...this._circuits.entries()].filter(([, c]) => c.open).map(([id]) => id),
      quarantinedCallers: [...this._quarantine.keys()],
      absorbedDenials:   this._absorbed.length,
      absorbedDistribution: this.getAbsorbedDistribution(),
      recentLog:         this._log.slice(-20),
      uptime:            Date.now() - this.birthTime,
    };
  }
}

export default { DefenseEngine, CIRCUIT_BREAKER_ERROR_THRESHOLD, QUARANTINE_DURATION_WINDOWS, CIRCUIT_HEAL_WINDOWS };
