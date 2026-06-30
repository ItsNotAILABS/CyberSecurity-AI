///
/// GLP-006 — Protocollum Sentinellae
/// Latin: "The Protocol of the Sentinel"
///
/// THE SENTINEL GUARDIAN.
///
/// The Sentinel is the lock's outer guardian — it receives escalations
/// from the offense and defense engines, aggregates threat signals,
/// decides on organism-level responses, and communicates with the
/// broader NOVA organism ecosystem.
///
/// Sentinel operates on three channels:
///   1. INTERNAL — receives events from GLP-004 (offense) and GLP-005 (defense)
///   2. EXTERNAL — alerts the Atlas Registry, GUARDIAN organism, and Scribe
///   3. AUTONOMOUS — runs its own heartbeat-driven patrol
///
/// Response levels (φ-ordered severity):
///   OBSERVE    (severity φ⁰ = 1.0) — log and monitor
///   ALERT      (severity φ¹ = 1.618) — alert guardian organism
///   QUARANTINE (severity φ² = 2.618) — quarantine offending caller
///   REVOKE     (severity φ³ = 4.236) — revoke the caller's key
///   SEAL       (severity φ⁴ = 6.854) — seal the affected endpoint
///   EMERGENCY  (severity φ⁵ ≈ 11.09) — emergency organism-wide shutdown
///
/// The Sentinel's 9-plane constitution (SMOF):
///   The organism operates across 9 planes of existence.
///   The Sentinel guards the boundary between the inner planes (1-4)
///   and the outer planes (5-9). No caller from the outer planes may
///   reach the inner planes without OCTAHEDRON (BUILD) tier or above.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI2, PHI3, PHI4, PHI_INV } from '../geometry-key/gkp-001-clavis-geometrica.js';

// ═══════════════════════════════════════════════════════════════════════════
//  RESPONSE LEVELS
// ═══════════════════════════════════════════════════════════════════════════

export const RESPONSE_LEVELS = {
  OBSERVE:    { id: 'OBSERVE',    severity: Math.pow(PHI, 0), color: '🟡' },
  ALERT:      { id: 'ALERT',      severity: Math.pow(PHI, 1), color: '🟠' },
  QUARANTINE: { id: 'QUARANTINE', severity: Math.pow(PHI, 2), color: '🔴' },
  REVOKE:     { id: 'REVOKE',     severity: Math.pow(PHI, 3), color: '⛔' },
  SEAL:       { id: 'SEAL',       severity: Math.pow(PHI, 4), color: '🔒' },
  EMERGENCY:  { id: 'EMERGENCY',  severity: Math.pow(PHI, 5), color: '🚨' },
};

// The 9 planes of the SMOF constitution
export const SMOF_PLANES = [
  { id: 1, latin: 'Planum Primum',   name: 'Foundational',   inner: true,  minTier: 'ARCHITECT'  },
  { id: 2, latin: 'Planum Secundum', name: 'Mathematical',    inner: true,  minTier: 'SOVEREIGN'  },
  { id: 3, latin: 'Planum Tertium',  name: 'Protocol',        inner: true,  minTier: 'FEDERATE'   },
  { id: 4, latin: 'Planum Quartum',  name: 'Organism',        inner: true,  minTier: 'BUILD'      },
  { id: 5, latin: 'Planum Quintum',  name: 'Integration',     inner: false, minTier: 'CALL'       },
  { id: 6, latin: 'Planum Sextum',   name: 'External AI',     inner: false, minTier: 'CALL'       },
  { id: 7, latin: 'Planum Septimum', name: 'Cross-Chain',     inner: false, minTier: 'READ'       },
  { id: 8, latin: 'Planum Octavum',  name: 'Public API',      inner: false, minTier: 'READ'       },
  { id: 9, latin: 'Planum Nonum',    name: 'Open Field',      inner: false, minTier: null         },
];

// ═══════════════════════════════════════════════════════════════════════════
//  SENTINEL
// ═══════════════════════════════════════════════════════════════════════════

export class Sentinel {
  /**
   * @param {object} opts
   * @param {string} [opts.sentinelId]
   * @param {object} [opts.defenseEngine]   — GLP-005 DefenseEngine
   * @param {Function} [opts.onAlert]       — callback for external alerts
   */
  constructor({ sentinelId = 'GLP-006', defenseEngine = null, onAlert = null } = {}) {
    this.sentinelId    = sentinelId;
    this.defenseEngine = defenseEngine;
    this.onAlert       = onAlert;
    this.birthTime     = Date.now();

    this._threatQueue  = [];   // incoming threats to process
    this._responses    = [];   // responses issued
    this._sealedEndpoints = new Set();
    this._emergency    = false;

    // Patrol heartbeat: runs every PHI² × 873ms ≈ 2287ms
    this._patrolInterval = setInterval(() => this._patrol(), Math.round(PHI2 * 873));

    console.log(`👁️  Sentinel born | id=${sentinelId} | patrol=${Math.round(PHI2 * 873)}ms`);
  }

  // ─── Threat Intake ────────────────────────────────────────────────────────

  /**
   * Receive a threat event from offense or defense engine.
   * Assess severity and decide on response.
   *
   * @param {object} threat
   * @returns {object}  response action taken
   */
  receive(threat) {
    this._threatQueue.push({ ...threat, receivedAt: Date.now() });
    return this._assess(threat);
  }

  /**
   * Assess a threat and decide response level.
   */
  _assess(threat) {
    const level = this._classifyThreat(threat);
    return this._respond(threat, level);
  }

  /**
   * Classify a threat into a response level based on type and severity.
   */
  _classifyThreat(threat) {
    if (this._emergency) return RESPONSE_LEVELS.EMERGENCY;

    switch (threat.type || threat.threat) {
      case 'adversarial_proximity':
        return RESPONSE_LEVELS.QUARANTINE;
      case 'phase_manipulation':
        return RESPONSE_LEVELS.REVOKE;
      case 'caller_drifted':
        return RESPONSE_LEVELS.ALERT;
      case 'field_degraded':
        return RESPONSE_LEVELS.SEAL;
      case 'entropy_spike':
        return RESPONSE_LEVELS.ALERT;
      case 'identity_collapse':
        return RESPONSE_LEVELS.REVOKE;
      case 'tier_fraud':
        return RESPONSE_LEVELS.REVOKE;
      case 'unregistered':
      case 'expired_window':
        return RESPONSE_LEVELS.OBSERVE;
      case 'below_resonance_threshold':
        return RESPONSE_LEVELS.OBSERVE;
      default:
        return RESPONSE_LEVELS.OBSERVE;
    }
  }

  /**
   * Execute a response.
   */
  _respond(threat, level) {
    const response = {
      sentinelId:  this.sentinelId,
      threatType:  threat.type || threat.threat,
      callerId:    threat.callerId,
      level:       level.id,
      severity:    level.severity,
      ts:          Date.now(),
      action:      null,
    };

    switch (level.id) {
      case 'OBSERVE':
        response.action = 'logged';
        break;

      case 'ALERT':
        response.action = 'alerted_guardian';
        this._fireAlert({ level: 'ALERT', threat, ts: Date.now() });
        break;

      case 'QUARANTINE':
        response.action = 'quarantine_ordered';
        if (this.defenseEngine && threat.callerId) {
          this.defenseEngine.quarantine(threat.callerId, level.id);
        }
        this._fireAlert({ level: 'QUARANTINE', threat, ts: Date.now() });
        break;

      case 'REVOKE':
        response.action = 'revoke_ordered';
        this._fireAlert({ level: 'REVOKE', threat, ts: Date.now() });
        break;

      case 'SEAL':
        response.action = 'endpoint_sealed';
        if (threat.endpoint) this._sealedEndpoints.add(threat.endpoint);
        this._fireAlert({ level: 'SEAL', threat, ts: Date.now() });
        break;

      case 'EMERGENCY':
        response.action = 'emergency_declared';
        this._emergency = true;
        this._fireAlert({ level: 'EMERGENCY', threat, ts: Date.now() });
        break;
    }

    this._responses.push(response);
    console.log(`${level.color} SENTINEL ${level.id} | caller=${threat.callerId} | action=${response.action}`);
    return response;
  }

  /**
   * Fire an external alert callback.
   */
  _fireAlert(alertData) {
    if (typeof this.onAlert === 'function') {
      try { this.onAlert(alertData); } catch (e) { /* sentinel never throws */ }
    }
  }

  // ─── Patrol ───────────────────────────────────────────────────────────────

  /**
   * Autonomous patrol — runs on a φ²-heartbeat timer.
   * Checks for stale threats that haven't been processed.
   */
  _patrol() {
    const staleThreshold = PHI2 * 873 * 3;  // 3 patrol cycles old
    const now            = Date.now();

    for (const threat of this._threatQueue) {
      if (now - threat.receivedAt > staleThreshold) {
        this._assess(threat);
      }
    }

    // Clear old threats
    this._threatQueue = this._threatQueue.filter(t => now - t.receivedAt <= staleThreshold * 10);
  }

  // ─── SMOF Plane Access Check ──────────────────────────────────────────────

  /**
   * Check if a caller's tier allows access to a SMOF plane.
   *
   * @param {string} callerTier    — e.g. 'FEDERATE'
   * @param {number} planeId       — 1..9
   * @returns {{ allowed: boolean, plane: object }}
   */
  checkPlaneAccess(callerTier, planeId) {
    const plane = SMOF_PLANES.find(p => p.id === planeId);
    if (!plane) return { allowed: false, plane: null };
    if (!plane.minTier) return { allowed: true, plane };  // Open plane (9)

    const TIER_RANKS = { READ: 0, CALL: 1, BUILD: 2, FEDERATE: 3, SOVEREIGN: 4, ARCHITECT: 5 };
    const callerRank = TIER_RANKS[callerTier] ?? -1;
    const minRank    = TIER_RANKS[plane.minTier] ?? 99;

    return { allowed: callerRank >= minRank, plane };
  }

  /**
   * Check if an endpoint is sealed.
   */
  isEndpointSealed(endpoint) {
    return this._sealedEndpoints.has(endpoint);
  }

  /**
   * Unseal an endpoint (requires ARCHITECT tier caller).
   */
  unseal(endpoint, callerTier) {
    if (callerTier !== 'ARCHITECT') {
      return { done: false, reason: 'ARCHITECT tier required to unseal' };
    }
    this._sealedEndpoints.delete(endpoint);
    this._emergency = false;
    return { done: true };
  }

  stop() {
    clearInterval(this._patrolInterval);
    console.log(`👁️  Sentinel stopped | ${this._responses.length} responses issued`);
  }

  getStatus() {
    return {
      sentinelId:       this.sentinelId,
      emergency:        this._emergency,
      sealedEndpoints:  [...this._sealedEndpoints],
      responsesIssued:  this._responses.length,
      pendingThreats:   this._threatQueue.length,
      recentResponses:  this._responses.slice(-10),
      smofPlanes:       SMOF_PLANES.map(p => ({ id: p.id, name: p.name, inner: p.inner, minTier: p.minTier })),
      uptime:           Date.now() - this.birthTime,
    };
  }
}

export default { Sentinel, RESPONSE_LEVELS, SMOF_PLANES };
