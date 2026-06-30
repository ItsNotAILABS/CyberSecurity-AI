///
/// GKP-014 — Protocollum Memoriae Geometricae
/// Latin: "The Protocol of Geometric Memory"
///
/// φ-ENCODED MEMORY — MEMORY THAT IS GEOMETRY, NOT STORAGE.
///
/// Standard memory stores content at an address.
/// φ-encoded memory stores content at a POSITION ON A GEOMETRIC SURFACE.
/// The Clifford torus means memory has position, not just content.
///
/// Memory topology:
///   All memories live on the Clifford torus S¹ × S¹ ⊂ R⁴.
///   The torus has a flat metric — distance is Euclidean in phase space.
///   Memories cluster geometrically when they are conceptually related
///   (because related content produces correlated phase hashes).
///
/// Memory retrieval by resonance:
///   To retrieve memories, present a query phase vector.
///   Memories closest on the torus surface are most relevant.
///   This is vector search in φ-encoded phase space.
///
/// 5D memory palace (from the geomancer organism):
///   (θ, φ_coord, ρ, ring, beat)
///   θ         = angular position in current heartbeat window
///   φ_coord   = golden ratio phase offset
///   ρ         = radial distance (importance/strength)
///   ring      = which φ-ring (temporal epoch)
///   beat      = heartbeat window index
///
/// Memory consolidation:
///   Old memories decay by φ⁻¹ per window (golden ratio decay).
///   Memories accessed frequently gain ρ (radial strength).
///   Memories never disappear — they fade into the outer rings.
///
/// MetaField Theory integration:
///   The 823 metamodels across 45 families are organized as memory palaces
///   on this same geometric surface. The field is complete — nothing is
///   missing from the map.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI3, PHI_INV, GOLDEN_ANGLE, TWO_PI,
  currentWindowIndex,
} from './gkp-001-clavis-geometrica.js';

import { cliffordDistance, encodeCliffordMemory } from './gkp-013-coherentia-iniectionis.js';

// ═══════════════════════════════════════════════════════════════════════════
//  MEMORY CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const MEMORY_DECAY_RATE    = PHI_INV;     // per window: strength × φ⁻¹
export const MEMORY_MIN_STRENGTH  = 0.01;        // below this, memory is archived
export const MEMORY_MAX_RINGS     = 13;          // 13 φ-rings (Fibonacci)
export const CLIFFORD_RADIUS      = 1 / Math.sqrt(2);  // = 1/√2 (Clifford torus radius)

// ═══════════════════════════════════════════════════════════════════════════
//  5D MEMORY PALACE POINT
// ═══════════════════════════════════════════════════════════════════════════

export class MemoryPalacePoint {
  /**
   * @param {string}   content     — the memory content
   * @param {number}   [strength]  — initial radial strength (ρ)
   * @param {number}   [windowIndex]
   */
  constructor(content, strength = 1.0, windowIndex = currentWindowIndex()) {
    this.content     = content;
    this.windowIndex = windowIndex;
    this.birthWindow = windowIndex;

    const encoded    = encodeCliffordMemory(content, windowIndex);
    this.clifford    = encoded;

    // 5D coordinates
    const [theta, phi_coord] = encoded.phases;
    const rho  = strength;
    const ring = Math.floor(rho / PHI) % MEMORY_MAX_RINGS;
    const beat = windowIndex;

    this.coords = { theta, phi_coord, rho, ring, beat };
    this.strength = strength;
    this.accessCount = 0;
    this.id   = encoded.contentHash;
  }

  /**
   * Decay the memory's radial strength by one window.
   * strength(t+1) = strength(t) × φ⁻¹
   */
  decay(windowsPassed = 1) {
    this.strength *= Math.pow(MEMORY_DECAY_RATE, windowsPassed);
    this.coords.rho    = this.strength;
    this.coords.ring   = Math.floor(this.strength / PHI) % MEMORY_MAX_RINGS;
    return this.strength;
  }

  /**
   * Reinforce the memory by accessing it.
   * strength += φ⁻¹ × accessCount^(-1/φ)
   */
  access() {
    this.accessCount++;
    const boost     = PHI_INV * Math.pow(this.accessCount, -PHI_INV);
    this.strength   = Math.min(1.0, this.strength + boost);
    this.coords.rho = this.strength;
    return this.strength;
  }

  isAlive() {
    return this.strength >= MEMORY_MIN_STRENGTH;
  }

  toJSON() {
    return {
      id:           this.id,
      content:      this.content.slice(0, 100),  // truncate for display
      strength:     this.strength,
      coords:       this.coords,
      windowIndex:  this.windowIndex,
      accessCount:  this.accessCount,
      alive:        this.isAlive(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  MEMORY PALACE
// ═══════════════════════════════════════════════════════════════════════════

export class MemoryPalace {
  /**
   * @param {object} opts
   * @param {string} [opts.palaceId]
   * @param {number} [opts.maxMemories]  — max active memories (default: Fibonacci(13)=233)
   */
  constructor({ palaceId = 'GKP-014', maxMemories = 233 } = {}) {
    this.palaceId   = palaceId;
    this.maxMemories = maxMemories;
    this.birthTime  = Date.now();
    this._memories  = new Map();   // id → MemoryPalacePoint
    this._archived  = [];          // weak memories archived here

    console.log(`🏛️  MemoryPalace born | id=${palaceId} | max=${maxMemories} | GKP-014`);
  }

  // ─── Write ────────────────────────────────────────────────────────────────

  /**
   * Write a new memory to the palace.
   * If over capacity, evict the weakest memory.
   *
   * @param {string} content
   * @param {number} [strength=1.0]
   * @returns {MemoryPalacePoint}
   */
  write(content, strength = 1.0) {
    const point = new MemoryPalacePoint(content, strength);

    // Evict weakest if over capacity
    if (this._memories.size >= this.maxMemories) {
      this._evictWeakest();
    }

    this._memories.set(point.id, point);
    return point;
  }

  // ─── Query by Resonance ───────────────────────────────────────────────────

  /**
   * Retrieve memories by geometric resonance (Clifford torus proximity).
   * Returns the K nearest memories to the query.
   *
   * @param {string} queryContent  — query text
   * @param {number} [k=5]         — number of results
   * @returns {Array<{memory, distance, strength}>}
   */
  query(queryContent, k = 5) {
    const queryPoint = encodeCliffordMemory(queryContent);
    const results    = [];

    for (const [id, memory] of this._memories.entries()) {
      const dist = cliffordDistance(queryPoint, memory.clifford);
      results.push({ memory, distance: dist, strength: memory.strength });
      memory.access();  // reinforce accessed memories
    }

    // Sort by distance × (1/strength) — closer AND stronger memories rank higher
    results.sort((a, b) => (a.distance / a.strength) - (b.distance / b.strength));

    return results.slice(0, k).map(r => ({
      id:       r.memory.id,
      content:  r.memory.content,
      distance: r.distance,
      strength: r.strength,
      coords:   r.memory.coords,
    }));
  }

  // ─── Temporal Decay ───────────────────────────────────────────────────────

  /**
   * Apply decay to all memories based on elapsed windows.
   * Called on each heartbeat cycle.
   */
  tick() {
    const currentW = currentWindowIndex();
    const toArchive = [];

    for (const [id, memory] of this._memories.entries()) {
      const windowsPassed = Math.max(0, currentW - memory.windowIndex);
      if (windowsPassed > 0) {
        memory.decay(windowsPassed);
        memory.windowIndex = currentW;
      }

      if (!memory.isAlive()) {
        toArchive.push(id);
      }
    }

    // Archive dead memories
    for (const id of toArchive) {
      const m = this._memories.get(id);
      this._archived.push(m.toJSON());
      this._memories.delete(id);
    }

    return { decayed: toArchive.length, active: this._memories.size };
  }

  _evictWeakest() {
    let weakest = null;
    let minStrength = Infinity;

    for (const [id, m] of this._memories.entries()) {
      if (m.strength < minStrength) {
        minStrength = m.strength;
        weakest     = id;
      }
    }

    if (weakest) {
      this._archived.push(this._memories.get(weakest).toJSON());
      this._memories.delete(weakest);
    }
  }

  getStatus() {
    return {
      palaceId:        this.palaceId,
      activeMemories:  this._memories.size,
      archivedMemories: this._archived.length,
      maxMemories:     this.maxMemories,
      decayRate:       MEMORY_DECAY_RATE,
      allMemories:     [...this._memories.values()].map(m => m.toJSON()),
      uptime:          Date.now() - this.birthTime,
    };
  }
}

/**
 * Compute the MetaField coherence — how well all memories are organized
 * across the Clifford torus surface.
 *
 * A well-organized field has memories evenly distributed (high entropy)
 * but with semantic clusters (adjacent memories are related).
 *
 * @param {MemoryPalacePoint[]} memories
 * @returns {{ coherence: number, coverage: number }}
 */
export function computeMetaFieldCoherence(memories) {
  if (memories.length < 2) return { coherence: 0, coverage: 0 };

  // Coverage: fraction of the torus surface "covered" by memories
  // Approximate as the average pairwise distance (larger = more coverage)
  let totalDist = 0;
  let pairCount = 0;

  for (let i = 0; i < memories.length; i++) {
    for (let j = i + 1; j < memories.length; j++) {
      totalDist += cliffordDistance(memories[i].clifford, memories[j].clifford);
      pairCount++;
    }
  }

  const avgDist   = pairCount > 0 ? totalDist / pairCount : 0;
  const maxDist   = Math.sqrt(2) * Math.PI;  // max torus distance
  const coverage  = avgDist / maxDist;

  // Coherence: Kuramoto R of all memory theta phases
  let re = 0, im = 0;
  for (const m of memories) {
    re += Math.cos(m.coords.theta);
    im += Math.sin(m.coords.theta);
  }
  const N   = memories.length;
  const coherence = Math.sqrt((re/N)**2 + (im/N)**2);

  return { coherence, coverage, avgDist, maxDist };
}

export default { MemoryPalacePoint, MemoryPalace, computeMetaFieldCoherence };
