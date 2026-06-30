///
/// GKP-005 — Protocollum Phantomatis Catenarum
/// Latin: "The Phantom of Chains"
///
/// PHANTOM BLOCKCHAIN BRIDGE.
///
/// Bridges Geometry Keys to:
///   - Phantom wallet (native mobile/browser wallet)
///   - Phantom Blockchain (Solana-based NFT ecosystem)
///   - GKT-20: The CLAVIS token standard
///
/// Token Standard: GKT-20 (Geometry Key Token, standard 20)
///   - Non-fungible: each CLAVIS token carries one unique geometric signature
///   - Transfer: delegating the resonance envelope to a new holder
///   - Burn: hard revocation of the key
///   - Metadata: { callerId_hash, windowIndex, selfCoherence, meanPhase, sig }
///
/// CLAVIS Token Economics (see GKP-008 for full economics):
///   - 1 CLAVIS minted per key registration
///   - 1 CLAVIS burned per key revocation
///   - Transfer fee: 1/φ NOVA tokens
///   - Staking APY: φ% per Fibonacci epoch
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI2, PHI3, PHI_INV, GOLDEN_ANGLE, CHAINS } from './gkp-001-clavis-geometrica.js';
import { phiHMAC } from './gkp-004-signatura-aurea.js';

// ═══════════════════════════════════════════════════════════════════════════
//  CLAVIS TOKEN STANDARD (GKT-20)
// ═══════════════════════════════════════════════════════════════════════════

export const GKT20 = {
  name:        'CLAVIS',
  symbol:      'CLAVIS',
  description: 'Geometric Key Token — identity as a shape, not a string',
  standard:    'GKT-20',
  // Total supply cap: 2^(φ⁴) ≈ 2^6.854 ≈ 57.8 → scaled to millions: 167M
  maxSupply:   Math.floor(Math.pow(2, Math.pow(PHI, 4)) * 1_000_000),
  decimals:    18,
  chain:       CHAINS.PHANTOM,
  mint_cost:   PHI2,   // φ² NOVA tokens to register (mint)
  burn_cost:   PHI3,   // φ³ NOVA tokens to revoke (burn)
  bridge_cost: Math.pow(PHI, 4), // φ⁴ NOVA tokens per bridge hop
};

/**
 * Mint a CLAVIS token from a geometric key token.
 *
 * @param {object} geoToken   — GeometricKeyToken
 * @param {string} ownerAddr  — Phantom wallet address
 * @returns {object}  CLAVIS NFT metadata
 */
export function mintClavisToken(geoToken, ownerAddr) {
  // Hash the callerId to avoid leaking the raw ID on-chain
  const callerIdHash = phiHMAC(
    geoToken.phases,
    geoToken.callerId,
    geoToken.windowIndex,
    'clavis_mint_context'
  );

  return {
    standard:     GKT20.standard,
    symbol:       GKT20.symbol,
    tokenId:      `CLAVIS_${callerIdHash}_${geoToken.windowIndex}`,
    owner:        ownerAddr,
    mintedAt:     Date.now(),
    metadata: {
      callerId_hash:  callerIdHash,
      windowIndex:    geoToken.windowIndex,
      selfCoherence:  geoToken.selfCoherence,
      meanPhase:      geoToken.meanPhase,
      signature:      geoToken.signature,
      dimensions:     geoToken.dimensions,
      chain:          CHAINS.PHANTOM,
    },
    // Visual properties for Phantom wallet UI
    visual: {
      type:        'phi-spiral',
      golden_angle: GOLDEN_ANGLE,
      arms:         geoToken.dimensions,
      coherence:    geoToken.selfCoherence,
      color_hue:    Math.floor((geoToken.meanPhase / (2 * Math.PI)) * 360),
    },
    _type:    'CLAVIS_NFT',
    _protocol: 'GKP-005',
  };
}

/**
 * Burn a CLAVIS token (key revocation).
 * Returns a burn receipt for on-chain recording.
 *
 * @param {string} tokenId   — CLAVIS token ID
 * @param {string} burnerAddr — wallet address initiating the burn
 * @returns {object}  burn receipt
 */
export function burnClavisToken(tokenId, burnerAddr) {
  return {
    action:     'BURN',
    tokenId,
    burner:     burnerAddr,
    burnedAt:   Date.now(),
    burnCost:   GKT20.burn_cost,
    reason:     'key_revocation',
    irreversible: true,
    _type:      'CLAVIS_BURN_RECEIPT',
    _protocol:  'GKP-005',
  };
}

/**
 * Transfer a CLAVIS token (key delegation).
 * The new holder inherits the resonance envelope.
 *
 * @param {string} tokenId
 * @param {string} fromAddr
 * @param {string} toAddr
 * @param {string} newCallerId  — the new caller whose identity will be enrolled
 * @returns {object}  transfer receipt
 */
export function transferClavisToken(tokenId, fromAddr, toAddr, newCallerId) {
  return {
    action:       'TRANSFER',
    tokenId,
    from:         fromAddr,
    to:           toAddr,
    newCallerId,
    transferredAt: Date.now(),
    transferFee:  PHI_INV,  // 1/φ NOVA tokens
    note:         'Resonance envelope delegates to new callerId',
    _type:        'CLAVIS_TRANSFER_RECEIPT',
    _protocol:    'GKP-005',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  PHANTOM WALLET BRIDGE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a Phantom wallet sign-request payload.
 * The wallet signs this to produce a CLAVIS token.
 *
 * @param {object} geoToken
 * @returns {object}  Phantom sign request
 */
export function buildPhantomSignRequest(geoToken) {
  return {
    method:   'signGeometricKey',
    params: {
      tokenType:   GKT20.symbol,
      callerId:    geoToken.callerId,
      windowIndex: geoToken.windowIndex,
      phases:      geoToken.phases,
      signature:   geoToken.signature,
      metadata: {
        selfCoherence: geoToken.selfCoherence,
        meanPhase:     geoToken.meanPhase,
      },
    },
    display: {
      title:    `CLAVIS Key — ${geoToken.callerId}`,
      subtitle: `Window ${geoToken.windowIndex} | Coherence ${geoToken.selfCoherence.toFixed(4)}`,
      visual:   'phi-spiral',
    },
    _protocol: 'GKP-005',
  };
}

/**
 * Parse a Phantom wallet sign-response and verify the φ-HMAC.
 *
 * @param {object} signResponse   — response from Phantom wallet
 * @param {object} originalToken  — original GeometricKeyToken
 * @param {string} sharedSecret
 * @returns {{ valid: boolean, reason?: string }}
 */
export function verifyPhantomSignResponse(signResponse, originalToken, sharedSecret) {
  if (!signResponse || !signResponse.signature) {
    return { valid: false, reason: 'no_signature_in_response' };
  }

  // Verify the φ-HMAC is intact
  const expected = phiHMAC(originalToken.phases, originalToken.callerId, originalToken.windowIndex, sharedSecret);
  if (originalToken.signature !== expected) {
    return { valid: false, reason: 'hmac_mismatch' };
  }

  return { valid: true };
}

export default {
  GKT20,
  mintClavisToken,
  burnClavisToken,
  transferClavisToken,
  buildPhantomSignRequest,
  verifyPhantomSignResponse,
};
