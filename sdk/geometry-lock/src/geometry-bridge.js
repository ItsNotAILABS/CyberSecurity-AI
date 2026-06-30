///
/// @medina/geometry-lock — GeometryBridge
/// PROTO-226 bridge adapter: connects the Geometry Lock to the Medina Calls
/// infrastructure as middleware.
///
/// Architecture:
///
///   External caller (Nova partner / Google AI)
///         ↓  presents geometric key token
///   GeometryBridge.bridgeCall(callerId, token, route, args)
///         ↓  GeometryLockSDK.validateKey(token) → R > 0.618 ?
///         ├── YES → forward call to medinaCallsRouter (medina-calls)
///         │         returns call result
///         └── NO  → deny + log + escalate to sentinel
///
/// EXCHANGE Contract (Intelligence Contract pattern, PROTO-223 inline):
///   "WHEN partner presents resonating key (R > EMERGENCE_THRESHOLD)
///    THEN unlock medina-calls forward"
///
/// The contract is expressed as a φ-weighted condition:
///   weight = R × φ / (φ + 1)    — same φ-weighting used throughout the organism
///   if weight > EMERGENCE_THRESHOLD × φ/(φ+1) → EXCHANGE fires → call forwarded
///
/// Supported call routes (mirrors sdk/medina-calls/ structure):
///   civitas     — civil/social organism calls
///   organism    — direct organism operations
///   governance  — governance and law operations
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { GeometryLockSDK, EMERGENCE_THRESHOLD, PHI } from './geometry-lock-sdk.js';

// ═══════════════════════════════════════════════════════════════════════════
//  EXCHANGE CONTRACT
//  Inline PROTO-223 intelligence contract governing key-to-call forwarding.
// ═══════════════════════════════════════════════════════════════════════════

class ExchangeContract {
  /**
   * The EXCHANGE contract:
   *   WHEN key.R > EMERGENCE_THRESHOLD
   *   THEN unlock medina-calls forward
   *
   * φ-weighted activation weight mirrors the organism's coherence formula:
   *   weight = R × φ / (φ + 1)
   * Same formula used in OrganismRuntime.jl for φ-weighted biorhythm.
   *
   * @param {number} R   — Kuramoto synchrony from validation
   * @returns {{ activated: boolean, weight: number }}
   */
  evaluate(R) {
    // φ-weighted activation: same formula as throughout the organism
    const weight = R * PHI / (PHI + 1.0);
    // Contract threshold mirrors the CPLPipelineEngine's success_factor (PHI-weighted)
    const contractThreshold = EMERGENCE_THRESHOLD * PHI / (PHI + 1.0);
    const activated = weight > contractThreshold;

    return { activated, weight, contractThreshold };
  }

  describe() {
    return {
      type:      'EXCHANGE',
      condition: `key.R > ${EMERGENCE_THRESHOLD.toFixed(6)} (Kuramoto synchrony > 1/φ)`,
      action:    'unlock medina-calls forward',
      formula:   'weight = R × φ / (φ + 1)',
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  CALL ROUTES
//  Stubs representing the sdk/medina-calls/ surfaces.
//  Replace with real medina-calls imports when that SDK is present.
// ═══════════════════════════════════════════════════════════════════════════

const CALL_ROUTES = {
  civitas: {
    description: 'Civil/social organism calls',
    handle: async (args, context) => ({
      route:   'civitas',
      args,
      context,
      status:  'forwarded',
      ts:      Date.now(),
    }),
  },
  organism: {
    description: 'Direct organism operation calls',
    handle: async (args, context) => ({
      route:   'organism',
      args,
      context,
      status:  'forwarded',
      ts:      Date.now(),
    }),
  },
  governance: {
    description: 'Governance and law operation calls',
    handle: async (args, context) => ({
      route:   'governance',
      args,
      context,
      status:  'forwarded',
      ts:      Date.now(),
    }),
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  GEOMETRY BRIDGE
// ═══════════════════════════════════════════════════════════════════════════

export class GeometryBridge {
  /**
   * @param {object}           opts
   * @param {GeometryLockSDK}  opts.lock       — the geometry lock to use as gate
   * @param {string}           [opts.bridgeId] — identifier for this bridge
   * @param {boolean}          [opts.strict]   — hard-deny on any anomaly
   * @param {Function}         [opts.sentinel] — called on denied attempts
   *                                             sentinel(denial) → void
   */
  constructor({
    lock,
    bridgeId = 'geometry-bridge',
    strict   = false,
    sentinel = null,
  } = {}) {
    if (!lock) {
      throw new Error('GeometryBridge: a GeometryLockSDK instance is required');
    }

    this.bridgeId  = bridgeId;
    this.strict    = strict;
    this.birthTime = Date.now();
    this._lock     = lock;
    this._sentinel = sentinel;
    this._contract = new ExchangeContract();

    // Bridge call audit log
    this._calls    = [];     // forwarded calls
    this._blocked  = [];     // blocked attempts

    console.log(`🌉 GeometryBridge born | bridgeId=${bridgeId}`);
    console.log(`   Contract: ${this._contract.describe().condition}`);
  }

  // ─── Primary bridge call ─────────────────────────────────────────────────

  /**
   * Route an external call through the geometry lock.
   *
   * @param {string} callerId   — who is making the call
   * @param {object} token      — geometric key token from generateKey()
   * @param {string} route      — target call surface: 'civitas'|'organism'|'governance'
   * @param {object} [args]     — arguments to forward to the call route
   * @returns {Promise<{
   *   granted: boolean,
   *   result?: object,
   *   denial?: object,
   *   R: number,
   *   weight: number,
   *   ts: number
   * }>}
   */
  async bridgeCall(callerId, token, route, args = {}) {
    const ts = Date.now();

    // ── Step 1: Validate the geometric key ─────────────────────────────────
    const validation = this._lock.validateKey(token);
    const { R, psi, granted, reason } = validation;

    // ── Step 2: Evaluate EXCHANGE contract ─────────────────────────────────
    const contract = this._contract.evaluate(R);

    if (!granted || !contract.activated) {
      // BLOCKED — log + sentinel alert
      const denial = {
        callerId,
        route,
        reason:    reason || 'contract_not_activated',
        R,
        psi,
        weight:    contract.weight,
        threshold: EMERGENCE_THRESHOLD,
        ts,
      };

      this._blocked.push(denial);

      if (this._sentinel) {
        this._sentinel(denial);
      }

      if (this.strict) {
        console.warn(`🚨 BRIDGE BLOCKED | caller=${callerId} | route=${route} | R=${R.toFixed(4)} | reason=${denial.reason}`);
      }

      return { granted: false, denial, R, weight: contract.weight, ts };
    }

    // ── Step 3: GRANTED — forward to call route ─────────────────────────────
    const callRoute = CALL_ROUTES[route];
    if (!callRoute) {
      const denial = { callerId, route, reason: 'unknown_route', R, ts };
      this._blocked.push(denial);
      return { granted: false, denial, R, weight: contract.weight, ts };
    }

    const context = {
      callerId,
      R,
      psi,
      weight:      contract.weight,
      windowIndex: token.windowIndex,
      protocol:    'PROTO-226',
      bridgeId:    this.bridgeId,
      ts,
    };

    const result = await callRoute.handle(args, context);

    const record = { callerId, route, R, weight: contract.weight, ts };
    this._calls.push(record);

    return { granted: true, result, R, weight: contract.weight, ts };
  }

  // ─── Caller management (delegates to lock) ───────────────────────────────

  /**
   * Register a new caller — must be done before they can present keys.
   */
  registerCaller(callerId, sharedSecret) {
    return this._lock.registerCaller(callerId, sharedSecret);
  }

  /**
   * Generate a key for a registered caller — give this to the caller to present.
   */
  generateKey(callerId) {
    return this._lock.generateKey(callerId);
  }

  /**
   * Revoke a caller — hard block, all future tokens denied at registration check.
   */
  revokeKey(callerId) {
    return this._lock.revokeKey(callerId);
  }

  // ─── Diagnostics ──────────────────────────────────────────────────────────

  /**
   * How many times has callerId been blocked?
   */
  blockCount(callerId) {
    return this._blocked.filter(b => b.callerId === callerId).length;
  }

  /**
   * Is callerId currently registered with the lock?
   */
  isRegistered(callerId) {
    return this._lock.isRegistered(callerId);
  }

  stop() {
    this._lock.stop();
  }

  getStatus() {
    return {
      bridgeId:       this.bridgeId,
      strict:         this.strict,
      uptime:         Date.now() - this.birthTime,
      totalCalls:     this._calls.length,
      totalBlocked:   this._blocked.length,
      routes:         Object.keys(CALL_ROUTES),
      contract:       this._contract.describe(),
      lock:           this._lock.getStatus(),
      recentBlocked:  this._blocked.slice(-10),
    };
  }
}

export default GeometryBridge;
