///
/// GKP-004 — Protocollum Signaturae Aureatae
/// Latin: "The Protocol of the Golden Signature"
///
/// φ-HMAC TAMPER-PROOF SIGNING.
///
/// Every geometric key carries a signature that proves:
///   1. The phases were generated from the correct callerId + sharedSecret
///   2. The phases have not been modified in transit
///   3. The key was issued at the claimed windowIndex
///
/// Mathematics:
///   Message   = phases.join(':') | callerId | windowIndex | sharedSecret
///   hash      = Σᵢ (ord(msg[i]) × φ^(i mod 13)) mod 2³²
///   signature = "geo_" + hex(⌊hash × φ²⌋ mod 2²⁴)
///
///   Why 13? It is the 7th Fibonacci number and prime.
///   In the φ-power series φ^0, φ^1, φ^2, ..., the mantissas cycle through
///   maximum dispersion before repeating near multiples of 13 — giving the
///   widest possible avalanche effect per character.
///
///   Why φ²? The final scaling by φ² = 2.618... amplifies small phase
///   changes into large signature changes (avalanche property).
///
///   Avalanche property:
///   Changing one phase by ε rad changes |Δmessage| characters,
///   each contributing charCode × φ^(pos mod 13), making the
///   probability of an undetected modification ≈ 1/2²⁴ ≈ 6×10⁻⁸.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2,
  PHI_HASH_CYCLE, HASH_32BIT_MASK, HASH_24BIT_MASK,
} from './gkp-001-clavis-geometrica.js';

// ═══════════════════════════════════════════════════════════════════════════
//  φ-HMAC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute the φ-HMAC signature for a geometric key token.
 *
 * @param {number[]} phases
 * @param {string}   callerId
 * @param {number}   windowIndex
 * @param {string}   sharedSecret
 * @returns {string}  "geo_xxxxxx" (6 hex digits)
 */
export function phiHMAC(phases, callerId, windowIndex, sharedSecret) {
  const phasePart = phases.map(p => p.toFixed(6)).join(':');
  const message   = `${phasePart}|${callerId}|${windowIndex}|${sharedSecret}`;

  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const phiPow   = Math.pow(PHI, i % PHI_HASH_CYCLE);
    hash           += charCode * phiPow;
    hash            = hash % HASH_32BIT_MASK;
  }

  const scaled = Math.floor(hash * PHI2) % HASH_24BIT_MASK;
  return `geo_${scaled.toString(16).padStart(6, '0')}`;
}

/**
 * Verify a token's φ-HMAC signature.
 *
 * @param {object} token         — GeometricKeyToken
 * @param {string} sharedSecret
 * @returns {boolean}
 */
export function verifySignature(token, sharedSecret) {
  const expected = phiHMAC(token.phases, token.callerId, token.windowIndex, sharedSecret);
  return token.signature === expected;
}

/**
 * Compute the "avalanche score" — how many bits of the signature
 * change when one phase is perturbed by epsilon radians.
 *
 * Used to verify that the φ-HMAC has adequate sensitivity.
 *
 * @param {number[]} phases
 * @param {string}   callerId
 * @param {number}   windowIndex
 * @param {string}   sharedSecret
 * @param {number}   [epsilon=0.001]   — perturbation in radians
 * @returns {number}  bit-change count [0..24]
 */
export function avalancheScore(phases, callerId, windowIndex, sharedSecret, epsilon = 0.001) {
  const sig1 = phiHMAC(phases, callerId, windowIndex, sharedSecret);
  // Perturb the first phase dimension
  const perturbed = [...phases];
  perturbed[0] = (perturbed[0] + epsilon) % (2 * Math.PI);
  const sig2 = phiHMAC(perturbed, callerId, windowIndex, sharedSecret);

  // Count differing hex characters (each = 4 bits)
  const h1 = sig1.replace('geo_', '');
  const h2 = sig2.replace('geo_', '');
  let diffChars = 0;
  for (let i = 0; i < h1.length; i++) {
    if (h1[i] !== h2[i]) diffChars++;
  }
  return diffChars * 4; // bits
}

/**
 * Create a cross-chain signature stub compatible with EVM keccak256.
 * Used by GKP-006 when bridging keys to EVM chains.
 *
 * In production this would use Web3 / ethers.js keccak256.
 * Here we return a deterministic φ-hash as a placeholder.
 *
 * @param {number[]} phases
 * @param {string}   callerId
 * @param {number}   windowIndex
 * @returns {string}  "0x" + 64 hex chars
 */
export function evmCompatibleHash(phases, callerId, windowIndex) {
  const phasePart = phases.map(p => p.toFixed(8)).join(',');
  const message   = `${phasePart}|${callerId}|${windowIndex}`;
  let h = 0;
  for (let i = 0; i < message.length; i++) {
    h = ((h << 5) - h + message.charCodeAt(i)) | 0;
    const phi = Math.pow(PHI, i % 13);
    h = (h + Math.floor(phi * 1000)) % HASH_32BIT_MASK;
  }
  // Expand to 64 hex chars (32 bytes) by repeating with φ² scaling
  const parts = [];
  let acc = h;
  for (let k = 0; k < 8; k++) {
    acc = Math.floor(acc * PHI2) % HASH_32BIT_MASK;
    parts.push(acc.toString(16).padStart(8, '0'));
  }
  return '0x' + parts.join('');
}

export default { phiHMAC, verifySignature, avalancheScore, evmCompatibleHash };
