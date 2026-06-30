///
/// GKP-011 — Protocollum HMAC-FNV Octodimensionalis
/// Latin: "The Protocol of the 8-Dimensional HMAC-FNV"
///
/// 8-DIMENSIONAL PHASE VECTOR WITH HMAC-FNV SIGNING.
///
/// Extends GKP-001..004 from 7 dimensions to 8 dimensions.
/// The 8th dimension is derived from the Solfeggio tier frequency,
/// coupling the Platonic tier directly into the phase vector's geometry.
///
/// FNV-1a Hash (Fowler–Noll–Vo):
///   hash = FNV_OFFSET_BASIS
///   for each byte:
///     hash = hash XOR byte
///     hash = hash × FNV_PRIME  (mod 2^32)
///
///   FNV_PRIME_32       = 16777619         (0x01000193)
///   FNV_OFFSET_32      = 2166136261       (0x811c9dc5)
///
/// φ-FNV hybrid (HMAC-FNV-φ):
///   Instead of constant FNV_PRIME, we use φ-modulated primes:
///   prime_j = nearest_prime(FNV_PRIME × φ^(j mod 8))
///   This gives 8 different hash streams that are φ-spiral-related.
///
/// The 8th dimension:
///   θ₇ = (tier_freq_hz / 1000) × 2π × φ × W / φ   mod 2π
///   → ties the tier frequency to the key's temporal window
///   → cannot be faked without knowing both the tier AND the window
///
/// Key space expansion:
///   7D: (2π)^7 ≈ 2^19.6 radians
///   8D: (2π)^8 ≈ 2^22.5 radians  (+3 bits of key space)
///   Plus the tier coupling adds: 6 × W possible tier-window combinations
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI_INV, GOLDEN_ANGLE, TWO_PI,
  KEY_DIMENSIONS, PHI_HASH_CYCLE, HASH_32BIT_MASK,
  currentWindowIndex,
} from './gkp-001-clavis-geometrica.js';

import { PhiSpiralCoordinate, deriveSeed } from './gkp-003-phyllotaxis-aurea.js';
import { SOLFEGGIO } from '../geometry-lock/glp-003-frequentia-solfeggio.js';

// ═══════════════════════════════════════════════════════════════════════════
//  FNV CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const FNV_PRIME_32        = 16777619;    // 0x01000193
export const FNV_OFFSET_BASIS_32 = 2166136261;  // 0x811c9dc5

// 8 φ-modulated FNV primes (one per dimension)
// prime_j = nearest odd integer to FNV_PRIME × φ^(j mod 8)
export const PHI_FNV_PRIMES = (() => {
  const primes = [];
  for (let j = 0; j < 8; j++) {
    let candidate = Math.round(FNV_PRIME_32 * Math.pow(PHI, j) % HASH_32BIT_MASK);
    // Ensure odd (all primes > 2 are odd)
    if (candidate % 2 === 0) candidate++;
    primes.push(candidate);
  }
  return primes;
})();

// 8 dimensions = KEY_DIMENSIONS + 1 (the tier coupling dimension)
export const KEY_DIMENSIONS_8 = 8;

// ═══════════════════════════════════════════════════════════════════════════
//  φ-FNV-1a HASH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * φ-FNV-1a hash of a string.
 * Uses dimension-specific φ-modulated FNV prime.
 *
 * @param {string} message
 * @param {number} [dimension]  — which φ-FNV prime to use (0..7)
 * @returns {number}  32-bit hash
 */
export function phiFNV(message, dimension = 0) {
  const prime = PHI_FNV_PRIMES[dimension % 8];
  let hash    = FNV_OFFSET_BASIS_32;

  for (let i = 0; i < message.length; i++) {
    hash = ((hash ^ message.charCodeAt(i)) >>> 0);
    hash = Math.imul(hash, prime) >>> 0;
  }

  return hash >>> 0;
}

/**
 * φ-HMAC-FNV signature.
 * Applies φ-FNV to each of 8 message slices keyed by the shared secret.
 *
 * sig = concat of 8 × 4-bit FNV outputs, formatted as 32-char hex
 *
 * @param {number[]} phases
 * @param {string}   callerId
 * @param {number}   windowIndex
 * @param {string}   sharedSecret
 * @param {number}   tierFreqHz
 * @returns {string}  "fnv8_" + 8 hex bytes
 */
export function phiHMACFNV8(phases, callerId, windowIndex, sharedSecret, tierFreqHz = 396) {
  const phasePart = phases.slice(0, 8).map(p => p.toFixed(6)).join(':');
  const baseMsg   = `${phasePart}|${callerId}|${windowIndex}|${sharedSecret}|${tierFreqHz}`;

  const parts = [];
  for (let d = 0; d < 8; d++) {
    const dimKey = `${sharedSecret}:dim${d}:${windowIndex}`;
    const dimMsg = `${dimKey}|${baseMsg}`;
    const h      = phiFNV(dimMsg, d);
    parts.push((h & 0xFF).toString(16).padStart(2, '0'));
  }

  return 'fnv8_' + parts.join('');
}

// ═══════════════════════════════════════════════════════════════════════════
//  8D PHASE VECTOR GENERATOR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate an 8-dimensional phase vector.
 * Dimensions 0..6: standard φ-spiral phyllotaxis (same as GKP-003)
 * Dimension 7: tier-coupling dimension = f(tierFreqHz, windowIndex)
 *
 * θ₇ = (tierFreqHz / 1000) × 2π × φ × W mod 2π
 *
 * @param {string} callerId
 * @param {string} sharedSecret
 * @param {number} [windowIndex]
 * @param {number} [tierFreqHz]  — Solfeggio frequency of the caller's tier
 * @returns {{ phases: number[], coordinates: object[], signature: string }}
 */
export function generatePhaseVector8D(callerId, sharedSecret, windowIndex = currentWindowIndex(), tierFreqHz = 396) {
  const seed = deriveSeed(callerId, sharedSecret);

  // Dimensions 0..6: φ-spiral phyllotaxis (from GKP-003)
  const coords = [];
  for (let j = 0; j < 7; j++) {
    coords.push(new PhiSpiralCoordinate(seed, windowIndex, j));
  }
  const phases7 = coords.map(c => c.phase);

  // Dimension 7: tier-coupling
  const tierPhase = ((tierFreqHz / 1000) * TWO_PI * PHI * windowIndex / PHI) % TWO_PI;
  const phases8   = [...phases7, tierPhase];

  // 8D φ-FNV-HMAC signature
  const signature = phiHMACFNV8(phases8, callerId, windowIndex, sharedSecret, tierFreqHz);

  // 8-dimensional coordinate descriptors
  const coord8 = {
    theta:     tierPhase,
    phi_coord: (tierPhase * GOLDEN_ANGLE) % TWO_PI,
    rho:       seed / HASH_32BIT_MASK,
    ring:      0,
    beat:      windowIndex,
    phase:     tierPhase,
    tier_freq: tierFreqHz,
    dimension: 7,
  };

  return {
    phases:     phases8,
    coordinates: [...coords.map(c => c.toJSON()), coord8],
    signature,
    dimensions: 8,
    tierFreqHz,
    windowIndex,
  };
}

/**
 * Verify an 8D φ-FNV-HMAC signature.
 *
 * @param {object} token8D   — { phases, callerId, windowIndex, signature, tierFreqHz }
 * @param {string} sharedSecret
 * @returns {boolean}
 */
export function verifySignature8D(token8D, sharedSecret) {
  const expected = phiHMACFNV8(
    token8D.phases,
    token8D.callerId,
    token8D.windowIndex,
    sharedSecret,
    token8D.tierFreqHz || 396
  );
  return token8D.signature === expected;
}

/**
 * Upgrade a 7D token to 8D by appending the tier coupling dimension.
 *
 * @param {object} token7D      — existing 7D GeometricKeyToken
 * @param {string} sharedSecret
 * @param {number} tierFreqHz
 * @returns {object}  upgraded 8D token
 */
export function upgrade7Dto8D(token7D, sharedSecret, tierFreqHz) {
  const tierPhase = ((tierFreqHz / 1000) * TWO_PI * PHI * token7D.windowIndex / PHI) % TWO_PI;
  const phases8   = [...token7D.phases, tierPhase];
  const sig8      = phiHMACFNV8(phases8, token7D.callerId, token7D.windowIndex, sharedSecret, tierFreqHz);

  return {
    ...token7D,
    phases:     phases8,
    dimensions: 8,
    signature:  sig8,
    tierFreqHz,
    _upgraded:  true,
  };
}

export default {
  FNV_PRIME_32,
  FNV_OFFSET_BASIS_32,
  PHI_FNV_PRIMES,
  KEY_DIMENSIONS_8,
  phiFNV,
  phiHMACFNV8,
  generatePhaseVector8D,
  verifySignature8D,
  upgrade7Dto8D,
};
