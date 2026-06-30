///
/// GKP-003 — Protocollum Phyllotaxeos Aureae
/// Latin: "The Protocol of Golden Leaf-Arrangement"
///
/// KEY GENERATOR using golden-angle phyllotaxis.
///
/// Nature uses the golden angle (α = 2π/φ² ≈ 137.508°) to arrange seeds in
/// a sunflower, scales on a pine cone, petals on a rose — always maximally
/// packed, never two seeds landing on each other's rational approximation.
///
/// We use the same mathematics to generate cryptographic phase vectors
/// that are maximally dispersed in phase space.
///
/// Mathematics:
///   Golden angle: α = 2π/φ² = 2π(2−φ) ≈ 2.3999 rad ≈ 137.508°
///
///   5D Phi-Spiral Coordinate:
///     ρ         = seed^(1/φ) × φ^(j mod 5)      (logarithmic spiral radius)
///     θ         = (seed·φʲ·α + 2πW/φ) mod 2π    (angular position)
///     φ_coord   = (ρ·α) mod 2π                  (golden-ratio offset)
///     ring      = ⌊ρ/φ⌋                         (φ-ring index)
///     beat      = W                              (heartbeat window)
///     phase     = √(θ² + φ_coord²) mod 2π       (Pythagorean primary phase)
///
///   Seed derivation from callerId:
///     seed = Σᵢ (ord(callerId:sharedSecret)[i] × φ^(i mod 7)) mod 2³²
///
///   Key rotation:
///     Window W changes every WINDOW_DURATION_MS = 873×φ ≈ 1413ms
///     Per-window precession: Δθ_window = 2π/φ per dimension
///     Annual key space: 365×86400÷1.413 ≈ 22.3M distinct windows/year
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI_INV, GOLDEN_ANGLE, TWO_PI,
  KEY_DIMENSIONS, PHI_MODULO_CYCLE, HASH_32BIT_MASK,
  currentWindowIndex,
} from './gkp-001-clavis-geometrica.js';

// ═══════════════════════════════════════════════════════════════════════════
//  5D PHI-SPIRAL COORDINATE
// ═══════════════════════════════════════════════════════════════════════════

export class PhiSpiralCoordinate {
  /**
   * @param {number} seed       — numeric identity seed
   * @param {number} windowIdx  — current heartbeat window index
   * @param {number} dim        — dimension index (0..KEY_DIMENSIONS−1)
   */
  constructor(seed, windowIdx, dim) {
    // Radial distance: grows along the φ-spiral arm
    // ρ = seed^(1/φ) × φ^(dim mod 5)  — logarithmic spiral in phase space
    this.rho = Math.pow(Math.abs(seed) + 1, PHI_INV) * Math.pow(PHI, dim % PHI_MODULO_CYCLE);

    // Angular position: each dimension advanced by one GOLDEN_ANGLE step
    // θ = (seed × φ^dim × α + 2π × W / φ) mod 2π
    const windowOffset = (TWO_PI * windowIdx) / PHI;
    this.theta = ((seed * Math.pow(PHI, dim) * GOLDEN_ANGLE) + windowOffset) % TWO_PI;

    // φ_coord: golden-ratio phase offset at this radial position
    // = (ρ × α) mod 2π
    this.phi_coord = (this.rho * GOLDEN_ANGLE) % TWO_PI;

    // ring = ⌊ρ / φ⌋ — which φ-ring this coordinate lives on
    this.ring = Math.floor(this.rho / PHI);

    // beat = heartbeat window
    this.beat = windowIdx;
  }

  /**
   * Primary phase — Pythagorean combination of θ and φ_coord:
   *   phase = √(θ² + φ_coord²) mod 2π
   *
   * Makes the key sensitive to BOTH the spiral arm position AND the golden
   * offset — two independent geometric degrees of freedom.
   */
  get phase() {
    return Math.sqrt(this.theta * this.theta + this.phi_coord * this.phi_coord) % TWO_PI;
  }

  toJSON() {
    return {
      theta:     this.theta,
      phi_coord: this.phi_coord,
      rho:       this.rho,
      ring:      this.ring,
      beat:      this.beat,
      phase:     this.phase,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  SEED DERIVATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Derive a numeric seed from a callerId + sharedSecret string.
 *
 * seed = Σᵢ (ord(str[i]) × φ^(i mod 7)) mod 2³²
 *
 * Uses KEY_DIMENSIONS=7 as the cycle period (same as the number of
 * attention heads in GEOMETER, and the 4th prime).
 *
 * @param {string} callerId
 * @param {string} sharedSecret
 * @returns {number}  numeric seed
 */
export function deriveSeed(callerId, sharedSecret) {
  const str = `${callerId}:${sharedSecret}`;
  let seed = 0;
  for (let i = 0; i < str.length; i++) {
    seed += str.charCodeAt(i) * Math.pow(PHI, i % KEY_DIMENSIONS);
    seed  = seed % HASH_32BIT_MASK;
  }
  return seed;
}

// ═══════════════════════════════════════════════════════════════════════════
//  PHASE VECTOR GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a phase vector for a caller at a given window.
 *
 * Each dimension j produces a PhiSpiralCoordinate whose `.phase`
 * is the primary phase angle used in the Kuramoto lock.
 *
 * @param {string} callerId
 * @param {string} sharedSecret
 * @param {number} [windowIndex]   — defaults to currentWindowIndex()
 * @param {number} [dimensions]    — defaults to KEY_DIMENSIONS (7)
 * @returns {{ phases: number[], coordinates: object[], seed: number, windowIndex: number }}
 */
export function generatePhaseVector(callerId, sharedSecret, windowIndex = currentWindowIndex(), dimensions = KEY_DIMENSIONS) {
  const seed    = deriveSeed(callerId, sharedSecret);
  const coords  = [];

  for (let j = 0; j < dimensions; j++) {
    coords.push(new PhiSpiralCoordinate(seed, windowIndex, j));
  }

  const phases = coords.map(c => c.phase);

  return { phases, coordinates: coords.map(c => c.toJSON()), seed, windowIndex };
}

/**
 * How many distinct key windows will exist per year?
 * window_count = floor(365 × 24 × 3600 × 1000 / WINDOW_DURATION_MS)
 */
export function annualWindowCount() {
  const WINDOW_DURATION_MS = 873 * PHI;
  return Math.floor(365 * 24 * 3600 * 1000 / WINDOW_DURATION_MS);
}

export default {
  PhiSpiralCoordinate,
  deriveSeed,
  generatePhaseVector,
  annualWindowCount,
};
