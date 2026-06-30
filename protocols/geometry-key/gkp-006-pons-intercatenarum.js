///
/// GKP-006 — Protocollum Pontis Intercatenarum
/// Latin: "The Protocol of the Bridge Between Chains"
///
/// CROSS-CHAIN BRIDGE.
///
/// Carries Geometry Keys across all substrate layers:
///   ICP     — native Motoko canister, certified variables, threshold ECDSA
///   EVM     — keccak256 phase hashing, Solidity storage patterns
///   Solana  — Ed25519 phase signing, account data layout
///   Web     — WebCrypto API, Service Worker caching, QR code encoding
///   Phantom — GKT-20 token bridge (see GKP-005)
///
/// Cross-chain proof format:
///   {
///     sourceChain:  "icp" | "evm" | "solana" | "phantom" | "web"
///     destChain:    same options
///     callerId:     "atlas://..." (sovereign URI)
///     phaseHash:    φ-HMAC or chain-native hash of phase vector
///     windowIndex:  uint64 — current φ-heartbeat window
///     bridgeNonce:  unique per-hop nonce to prevent replay
///     sig:          chain-native signature over (phaseHash + bridgeNonce)
///   }
///
/// Replay prevention:
///   bridgeNonce = φ-HMAC(phaseHash, windowIndex, sourceChain, destChain)
///   Nonces are consumed on-chain — second use is FORBIDDEN (LEX CLAVIS-006)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI2, PHI4, CHAINS, HASH_32BIT_MASK, PHI_HASH_CYCLE } from './gkp-001-clavis-geometrica.js';
import { phiHMAC, evmCompatibleHash } from './gkp-004-signatura-aurea.js';

// ═══════════════════════════════════════════════════════════════════════════
//  CROSS-CHAIN PROOF
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build a cross-chain proof for transporting a geometric key token.
 *
 * @param {object} geoToken       — GeometricKeyToken
 * @param {string} sourceChain    — CHAINS.*
 * @param {string} destChain      — CHAINS.*
 * @param {string} sharedSecret
 * @returns {object}  cross-chain proof envelope
 */
export function buildBridgeProof(geoToken, sourceChain, destChain, sharedSecret) {
  const phaseHash   = phiHMAC(geoToken.phases, geoToken.callerId, geoToken.windowIndex, sharedSecret);
  const bridgeNonce = phiHMAC(
    geoToken.phases,
    `${sourceChain}_${destChain}`,
    geoToken.windowIndex,
    phaseHash
  );

  // EVM-compatible hash for cross-chain settlement on Ethereum/Solana
  const evmHash = evmCompatibleHash(geoToken.phases, geoToken.callerId, geoToken.windowIndex);

  return {
    sourceChain,
    destChain,
    callerId:    geoToken.callerId,
    phaseHash,
    evmHash,
    windowIndex: geoToken.windowIndex,
    bridgeNonce,
    bridgeFee:   PHI4,  // φ⁴ NOVA tokens per hop
    hopAt:       Date.now(),
    _type:       'BridgeProof',
    _protocol:   'GKP-006',
    _immutable:  true,
  };
}

/**
 * Verify a cross-chain proof on the destination chain.
 *
 * Re-derives the bridgeNonce and confirms it matches.
 * Also checks that the phaseHash is consistent.
 *
 * @param {object} proof
 * @param {object} geoToken
 * @param {string} sharedSecret
 * @returns {{ valid: boolean, reason?: string }}
 */
export function verifyBridgeProof(proof, geoToken, sharedSecret) {
  // Re-derive the phase hash
  const expectedPhaseHash = phiHMAC(geoToken.phases, geoToken.callerId, geoToken.windowIndex, sharedSecret);
  if (proof.phaseHash !== expectedPhaseHash) {
    return { valid: false, reason: 'phase_hash_mismatch' };
  }

  // Re-derive the nonce
  const expectedNonce = phiHMAC(
    geoToken.phases,
    `${proof.sourceChain}_${proof.destChain}`,
    geoToken.windowIndex,
    expectedPhaseHash
  );
  if (proof.bridgeNonce !== expectedNonce) {
    return { valid: false, reason: 'nonce_mismatch' };
  }

  return { valid: true };
}

// ═══════════════════════════════════════════════════════════════════════════
//  CHAIN-SPECIFIC ADAPTERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * ICP adapter — prepares certified variable data for the geomancer canister.
 * The canister will store this as certified data (verifiable by any ICP subnet).
 *
 * @param {object} proof
 * @returns {object}  ICP certified variable payload
 */
export function icpAdapter(proof) {
  return {
    chain:        CHAINS.ICP,
    certifiedData: {
      phaseHash:   proof.phaseHash,
      callerId:    proof.callerId,
      windowIndex: proof.windowIndex,
      nonce:       proof.bridgeNonce,
    },
    canister:     'geomancer',
    method:       'certify_bridge_proof',
    _protocol:    'GKP-006',
  };
}

/**
 * EVM adapter — builds a Solidity calldata payload for the EVM GeometryLock contract.
 * Uses the EVM-compatible hash (keccak256-style) instead of φ-HMAC.
 *
 * @param {object} proof
 * @returns {object}  EVM calldata
 */
export function evmAdapter(proof) {
  return {
    chain:    CHAINS.EVM,
    contract: 'GeometryLock',
    method:   'bridgeVerify',
    calldata: {
      evmHash:     proof.evmHash,
      callerId:    proof.callerId,
      windowIndex: proof.windowIndex,
      nonce:       proof.bridgeNonce,
    },
    _protocol: 'GKP-006',
  };
}

/**
 * Solana adapter — builds an instruction for the geometry_lock Rust program.
 *
 * @param {object} proof
 * @returns {object}  Solana instruction data
 */
export function solanaAdapter(proof) {
  return {
    chain:       CHAINS.SOLANA,
    programId:   'geometry_lock',
    instruction: 'bridge_verify',
    accounts: {
      caller_pda:   `pda_${proof.callerId.replace(/[^a-zA-Z0-9]/g, '_')}`,
      nonce_account: `nonce_${proof.bridgeNonce}`,
    },
    data: {
      phase_hash:   proof.phaseHash,
      window_index: proof.windowIndex,
    },
    _protocol: 'GKP-006',
  };
}

/**
 * Web SDK adapter — builds a payload for browser WebCrypto verification.
 * Compatible with SubtleCrypto.verify() on any HTTPS origin.
 *
 * @param {object} proof
 * @param {number[]} phases
 * @returns {object}  WebCrypto verify request
 */
export function webAdapter(proof, phases) {
  return {
    chain:     CHAINS.WEB,
    algorithm: 'GKP-phi-hmac',
    payload: {
      phases:      phases,
      callerId:    proof.callerId,
      windowIndex: proof.windowIndex,
      phaseHash:   proof.phaseHash,
      nonce:       proof.bridgeNonce,
    },
    qrCode: {
      data:   `clavis://${proof.callerId}?w=${proof.windowIndex}&h=${proof.phaseHash}`,
      format: 'qr-code',
    },
    _protocol: 'GKP-006',
  };
}

/**
 * Compute the cross-chain fee for a given number of hops.
 *
 * Fee = φ⁴ × hop_count + φ² × (hop_count − 1)
 *     = φ⁴ × hops + φ² × (hops − 1)
 *
 * The first hop costs φ⁴ NOVA, each additional hop adds φ².
 *
 * @param {number} hopCount
 * @returns {number}  fee in NOVA tokens
 */
export function crossChainFee(hopCount) {
  if (hopCount <= 0) return 0;
  return PHI4 * hopCount + PHI2 * Math.max(0, hopCount - 1);
}

export default {
  buildBridgeProof,
  verifyBridgeProof,
  icpAdapter,
  evmAdapter,
  solanaAdapter,
  webAdapter,
  crossChainFee,
};
