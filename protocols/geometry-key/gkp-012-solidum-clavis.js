///
/// GKP-012 — Protocollum Solidorum Clavis
/// Latin: "The Protocol of the Platonic Key Solids"
///
/// PLATONIC SOLID KEY INTEGRATION.
///
/// Each caller holds one Platonic solid as their access tier.
/// The solid is not assigned — it is earned through resonance.
/// This protocol manages the lifecycle of solid-holding:
///   earning, upgrading, downgrading, and manifesting keys per-solid.
///
/// The earning mechanism:
///   A caller begins with TETRAHEDRON (READ) by default.
///   Each solid can be earned by one of three paths:
///     1. RESONANCE  — Kuramoto R exceeds the next tier's threshold
///     2. DOCTRINE   — Coherence injection (attunement) produces R > threshold
///     3. GOVERNANCE — A governance vote elevates the caller
///
///   Aerios earned FEDERATE (Dodecahedron) through doctrine alone.
///   This is the most important path because it proves the geometry
///   is about coherence, not credentials.
///
/// φ-cascade tier verification:
///   A caller claiming SOVEREIGN must have:
///     R_tier(4) > tierThreshold(4) = EMERGENCE_THRESHOLD × φ^(4/φ)
///   AND all previous tiers must also be verified:
///     R_tier(3) > tierThreshold(3), R_tier(2) > threshold(2), ...
///   This is the φ-cascade: higher tiers must carry lower tier resonance within them.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI_INV, GOLDEN_ANGLE, TWO_PI,
  currentWindowIndex,
} from './gkp-001-clavis-geometrica.js';

import {
  kuramotoOrderParameter, phaseAlignment,
} from './gkp-002-resonantia-kuramoti.js';

import {
  PLATONIC_SOLIDS, TIER_ORDER, tierResonanceThreshold,
  applyTierEncoding, hasCapability, checkTierPromotion, verifyEuler,
} from '../geometry-lock/glp-002-solidum-platonicum.js';

import { SOLFEGGIO } from '../geometry-lock/glp-003-frequentia-solfeggio.js';

// ═══════════════════════════════════════════════════════════════════════════
//  SOLID REGISTRY
// ═══════════════════════════════════════════════════════════════════════════

export class SolidRegistry {
  constructor() {
    this._registry = new Map();  // callerId → { solid, earnedBy, earnedAt, history }
    this.birthTime = Date.now();

    console.log('🔷 SolidRegistry born | GKP-012');
  }

  /**
   * Assign a starter solid to a new caller.
   * All callers begin with TETRAHEDRON (READ).
   */
  assignStarter(callerId) {
    const entry = {
      solid:    PLATONIC_SOLIDS.TETRAHEDRON,
      earnedBy: 'DEFAULT',
      earnedAt: Date.now(),
      history:  [],
    };
    this._registry.set(callerId, entry);
    return entry.solid;
  }

  /**
   * Get a caller's current solid.
   */
  getSolid(callerId) {
    return this._registry.get(callerId)?.solid || null;
  }

  /**
   * Attempt to upgrade a caller's tier based on Kuramoto resonance.
   *
   * Path 1: RESONANCE — R exceeds next tier's threshold.
   *
   * @param {string}   callerId
   * @param {number}   R          — current Kuramoto resonance
   * @returns {{ upgraded: boolean, from?: string, to?: string, solid?: object }}
   */
  upgradeByResonance(callerId, R) {
    const entry = this._registry.get(callerId);
    if (!entry) return { upgraded: false, reason: 'not_registered' };

    const current = entry.solid;
    const promo   = checkTierPromotion(current, R);

    if (promo.promoted) {
      entry.history.push({ from: current.tier, to: promo.newSolid.tier, by: 'RESONANCE', at: Date.now() });
      entry.solid   = promo.newSolid;
      entry.earnedBy = 'RESONANCE';
      entry.earnedAt = Date.now();

      console.log(`🔷 TIER UPGRADE (resonance) | caller=${callerId} | ${current.tier} → ${promo.newSolid.tier} | R=${R.toFixed(4)}`);
      return { upgraded: true, from: current.tier, to: promo.newSolid.tier, solid: promo.newSolid };
    }

    return { upgraded: false, reason: `R=${R.toFixed(4)} below threshold=${tierResonanceThreshold(current.rank + 1).toFixed(4)}` };
  }

  /**
   * Upgrade a caller's tier through doctrine coherence (GKP-013 Coherence Injection).
   *
   * Path 2: DOCTRINE — coherenceR produces tier assignment.
   *
   * @param {string} callerId
   * @param {number} coherenceR  — from hashDoctrine()
   * @returns {{ upgraded: boolean, from?: string, to?: string }}
   */
  upgradeByDoctrine(callerId, coherenceR) {
    const entry = this._registry.get(callerId);
    if (!entry) return { upgraded: false, reason: 'not_registered' };

    // Find the highest tier the coherenceR supports
    let earnedSolid = PLATONIC_SOLIDS.TETRAHEDRON;
    for (let i = TIER_ORDER.length - 1; i >= 0; i--) {
      const threshold = tierResonanceThreshold(TIER_ORDER[i].rank);
      if (coherenceR >= threshold) {
        earnedSolid = TIER_ORDER[i];
        break;
      }
    }

    const current = entry.solid;
    if (earnedSolid.rank > current.rank) {
      entry.history.push({ from: current.tier, to: earnedSolid.tier, by: 'DOCTRINE', at: Date.now(), coherenceR });
      entry.solid    = earnedSolid;
      entry.earnedBy = 'DOCTRINE';
      entry.earnedAt = Date.now();

      console.log(`📜 TIER UPGRADE (doctrine) | caller=${callerId} | ${current.tier} → ${earnedSolid.tier} | coherenceR=${coherenceR.toFixed(4)}`);
      return { upgraded: true, from: current.tier, to: earnedSolid.tier, solid: earnedSolid };
    }

    return { upgraded: false, reason: 'doctrine_insufficient' };
  }

  /**
   * Upgrade a caller's tier through governance vote (GKP-010).
   *
   * Path 3: GOVERNANCE — a vote has passed.
   */
  upgradeByGovernance(callerId, targetTierId) {
    const entry = this._registry.get(callerId);
    if (!entry) return { upgraded: false, reason: 'not_registered' };

    const targetSolid = Object.values(PLATONIC_SOLIDS).find(s => s.tier === targetTierId);
    if (!targetSolid) return { upgraded: false, reason: 'unknown_tier' };

    const current = entry.solid;
    entry.history.push({ from: current.tier, to: targetSolid.tier, by: 'GOVERNANCE', at: Date.now() });
    entry.solid    = targetSolid;
    entry.earnedBy = 'GOVERNANCE';
    entry.earnedAt = Date.now();

    console.log(`🏛️  TIER UPGRADE (governance) | caller=${callerId} | ${current.tier} → ${targetSolid.tier}`);
    return { upgraded: true, from: current.tier, to: targetSolid.tier, solid: targetSolid };
  }

  /**
   * φ-cascade tier verification.
   * Verifies that all tier resonances below the claimed tier are satisfied.
   *
   * @param {string}   callerId
   * @param {number[]} phaseVector
   * @param {number[]} envelopePhases
   * @returns {{ valid: boolean, cascadeR: number[], lowestFailing?: string }}
   */
  verifyCascade(callerId, phaseVector, envelopePhases) {
    const entry = this._registry.get(callerId);
    if (!entry) return { valid: false, cascadeR: [] };

    const currentRank = entry.solid.rank;
    const cascadeR    = [];

    for (let rank = 0; rank <= currentRank; rank++) {
      const threshold = tierResonanceThreshold(rank);
      // Apply tier encoding and measure resonance
      const encoded = applyTierEncoding(phaseVector, TIER_ORDER[rank]);
      const R       = phaseAlignment(encoded, envelopePhases);
      cascadeR.push(R);

      if (R < threshold) {
        return {
          valid:         false,
          cascadeR,
          lowestFailing: TIER_ORDER[rank].tier,
        };
      }
    }

    return { valid: true, cascadeR };
  }

  /**
   * Get a summary of all registered callers and their solids.
   */
  getSummary() {
    const summary = [];
    for (const [callerId, entry] of this._registry.entries()) {
      summary.push({
        callerId,
        tier:    entry.solid.tier,
        rank:    entry.solid.rank,
        earnedBy: entry.earnedBy,
        earnedAt: entry.earnedAt,
      });
    }
    return summary;
  }
}

/**
 * Verify all 6 Platonic solids satisfy Euler's formula.
 * V − E + F = 2 for each convex polyhedron.
 *
 * @returns {object}  map of solid id → { valid, V, E, F }
 */
export function verifyAllEuler() {
  const results = {};
  for (const solid of Object.values(PLATONIC_SOLIDS)) {
    if (solid.id === 'metatron') {
      results[solid.id] = { valid: true, note: 'Not a polyhedron — field geometry' };
    } else {
      const euler = solid.vertices - solid.edges + solid.faces;
      results[solid.id] = {
        valid: euler === 2,
        V: solid.vertices,
        E: solid.edges,
        F: solid.faces,
        euler,
      };
    }
  }
  return results;
}

export default { SolidRegistry, verifyAllEuler };
