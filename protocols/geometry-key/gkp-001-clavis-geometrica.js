///
/// GKP-001 — Protocollum Clavis Geometricae
/// Latin: "The Geometric Key Protocol"
///
/// Root protocol — all other GKP protocols depend on these types and constants.
///
/// Mathematical Foundations:
///   φ = (1+√5)/2        Golden Ratio — the key material constant
///   α = 2π/φ²           Golden Angle — the phyllotaxis divergence angle
///   1/φ = φ−1           Emergence Threshold — the resonance gate
///   R·e^(iΨ)=(1/N)·Σe^(iθⱼ)   Kuramoto Order Parameter — the lock
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI               = 1.6180339887498948482;
export const PHI2              = PHI * PHI;
export const PHI3              = PHI2 * PHI;
export const PHI4              = PHI3 * PHI;
export const PHI_INV           = 1.0 / PHI;
export const GOLDEN_ANGLE      = (2 * Math.PI) / PHI2;   // 2π/φ² ≈ 2.3999 rad
export const TWO_PI            = 2 * Math.PI;
export const PHI_HEARTBEAT_MS  = 873;                     // 540×φ biological pulse
export const WINDOW_DURATION_MS = PHI_HEARTBEAT_MS * PHI; // ≈1413ms per key window
export const KEY_DIMENSIONS    = 7;                       // ≈φ⁴, 4th prime
export const PHI_MODULO_CYCLE  = 5;                       // phyllotaxis 5-fold symmetry
export const PHI_HASH_CYCLE    = 13;                      // 7th Fibonacci, prime
export const HASH_32BIT_MASK   = 0xFFFFFFFF;
export const HASH_24BIT_MASK   = 0xFFFFFF;
export const EMERGENCE_THRESHOLD = PHI_INV;               // 1/φ = 0.6180339887

/// Chain identifiers — substrates the key protocol operates across
export const CHAINS = {
  ICP:     'icp',
  EVM:     'evm',
  SOLANA:  'solana',
  PHANTOM: 'phantom',
  WEB:     'web',
  NOVA:    'nova',
};

/// Key status lifecycle
export const KEY_STATUS = {
  ACTIVE:   'active',
  EXPIRED:  'expired',
  REVOKED:  'revoked',
  PENDING:  'pending',
};

/// Denial reasons from the Kuramoto lock
export const DENIAL_REASON = {
  UNREGISTERED:          'unregistered',
  SIGNATURE_MISMATCH:    'signature_mismatch',
  EXPIRED_WINDOW:        'expired_window',
  BELOW_RESONANCE:       'below_resonance_threshold',
  UNKNOWN_ROUTE:         'unknown_route',
  CONTRACT_NOT_ACTIVATED:'contract_not_activated',
};

// ═══════════════════════════════════════════════════════════════════════════
//  CORE TYPE CONSTRUCTORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Construct a typed GeometricKey descriptor.
 * This is the "token" passed by a caller to the lock on every call.
 *
 * @param {string}   callerId
 * @param {number}   windowIndex
 * @param {number}   dimensions
 * @param {number[]} phases
 * @param {number}   selfCoherence
 * @param {number}   meanPhase
 * @param {string}   signature
 * @param {number}   issuedAt
 * @param {object[]} coordinates
 * @returns {GeometricKeyToken}
 */
export function makeGeometricKeyToken({
  callerId, windowIndex, dimensions, phases,
  selfCoherence, meanPhase, signature, issuedAt, coordinates = [],
}) {
  return {
    callerId,
    windowIndex,
    dimensions,
    phases:        phases.map(Number),
    selfCoherence: Number(selfCoherence),
    meanPhase:     Number(meanPhase),
    signature:     String(signature),
    issuedAt:      Number(issuedAt),
    coordinates,
    _type:        'GeometricKeyToken',
    _protocol:    'GKP-001',
  };
}

/**
 * Construct a ResonanceEnvelope — the registered shape against which tokens are validated.
 */
export function makeResonanceEnvelope({ callerId, phases, sharedSecretHash, registeredAt, chain = CHAINS.NOVA }) {
  return {
    callerId,
    phases:           phases.map(Number),
    sharedSecretHash: String(sharedSecretHash),
    registeredAt:     Number(registeredAt),
    chain,
    _type:           'ResonanceEnvelope',
    _protocol:       'GKP-001',
  };
}

/**
 * Construct a ValidationResult.
 */
export function makeValidationResult({ granted, R, psi, reason, callerId, windowDelta, threshold, protocol }) {
  return {
    granted:     Boolean(granted),
    R:           Number(R),
    psi:         Number(psi),
    reason:      reason || null,
    callerId:    String(callerId),
    windowDelta: Number(windowDelta),
    threshold:   Number(threshold),
    protocol:    String(protocol),
    ts:          Date.now(),
    _type:       'ValidationResult',
    _protocol:   'GKP-001',
  };
}

/**
 * Construct an AttributionRecord — immutable IP attribution entry.
 */
export function makeAttributionRecord({ artifactHash, creatorId, keySignature, phaseSnapshot, windowIndex, resonanceR, chain, canister }) {
  return {
    artifactHash:  String(artifactHash),
    creatorId:     String(creatorId),
    keySignature:  String(keySignature),
    phaseSnapshot: phaseSnapshot.map(Number),
    windowIndex:   Number(windowIndex),
    resonanceR:    Number(resonanceR),
    timestampMs:   Date.now(),
    chain:         String(chain),
    canister:      String(canister),
    _type:         'AttributionRecord',
    _protocol:     'GKP-001',
    _immutable:    true,
  };
}

/**
 * Current window index — floor(now / WINDOW_DURATION_MS)
 */
export function currentWindowIndex() {
  return Math.floor(Date.now() / WINDOW_DURATION_MS);
}

/**
 * Check whether a window index is fresh (within ±1 of current).
 */
export function isWindowFresh(windowIndex) {
  return Math.abs(windowIndex - currentWindowIndex()) <= 1;
}

export default {
  PHI, PHI2, PHI3, PHI4, PHI_INV,
  GOLDEN_ANGLE, TWO_PI, PHI_HEARTBEAT_MS, WINDOW_DURATION_MS,
  KEY_DIMENSIONS, PHI_MODULO_CYCLE, PHI_HASH_CYCLE,
  HASH_32BIT_MASK, HASH_24BIT_MASK, EMERGENCE_THRESHOLD,
  CHAINS, KEY_STATUS, DENIAL_REASON,
  makeGeometricKeyToken, makeResonanceEnvelope, makeValidationResult,
  makeAttributionRecord, currentWindowIndex, isWindowFresh,
};
