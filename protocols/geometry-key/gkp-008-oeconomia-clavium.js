///
/// GKP-008 — Protocollum Oeconomiae Clavium
/// Latin: "The Protocol of the Economy of Keys"
///
/// TOKEN ECONOMICS — The CLAVIS Token Market.
///
/// CLAVIS is a dual-nature token:
///   - Utility: pays for key operations (register, validate, revoke, bridge)
///   - NFT: each key is a unique non-fungible token carrying geometric metadata
///
/// Supply model (φ-bounded):
///   Total supply cap = 2^(φ⁴) × 1_000_000 ≈ 167_000_000 CLAVIS
///   Issuance: 1 CLAVIS per key registration (mint)
///   Deflation: 1 CLAVIS per key revocation (burn)
///   At equilibrium: supply tracks active registered identities
///
/// Fee schedule (all fees in NOVA tokens):
///   Registration:  φ² ≈ 2.618 NOVA
///   Validation:    φ⁻¹ ≈ 0.618 NOVA   (validation cheaper than registration)
///   Revocation:    φ³ ≈ 4.236 NOVA    (expensive to deter spam revocations)
///   Bridge (1 hop): φ⁴ ≈ 6.854 NOVA
///
/// Staking:
///   APY = φ% per Fibonacci epoch × φ^(stake_rank/φ)
///   Minimum validator stake: Fibonacci(13) = 233 CLAVIS
///   Slash condition: invalid validation → lose φ³ CLAVIS
///
/// Revenue model (at scale):
///   R(t) = registrations(t)×φ² + validations(t)×φ⁻¹ + revocations(t)×φ³ + bridges(t)×φ⁴
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI2, PHI3, PHI4, PHI_INV } from './gkp-001-clavis-geometrica.js';

// ═══════════════════════════════════════════════════════════════════════════
//  SUPPLY CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

// 2^(φ⁴) × 1M ≈ 167M CLAVIS max supply
export const MAX_SUPPLY_CLAVIS = Math.floor(Math.pow(2, PHI4) * 1_000_000);

// Fibonacci validator minimum stake: Fib(13) = 233
export const VALIDATOR_MIN_STAKE = 233;

// Fibonacci epochs (governance cycles): [1,1,2,3,5,8,13,21,34,55,89,144,233]
export const FIBONACCI_EPOCHS = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

// ═══════════════════════════════════════════════════════════════════════════
//  FEE SCHEDULE
// ═══════════════════════════════════════════════════════════════════════════

export const FEE_SCHEDULE = {
  REGISTRATION:  PHI2,   // φ² ≈ 2.618 NOVA tokens
  VALIDATION:    PHI_INV, // 1/φ ≈ 0.618 NOVA tokens
  REVOCATION:    PHI3,   // φ³ ≈ 4.236 NOVA tokens
  BRIDGE_HOP:    PHI4,   // φ⁴ ≈ 6.854 NOVA tokens per chain hop
  TRANSFER:      PHI_INV, // 1/φ NOVA tokens per CLAVIS transfer
  ATTESTATION:   PHI2,   // φ² NOVA tokens per attribution record
};

/**
 * Compute the fee for a given operation.
 *
 * @param {'REGISTRATION'|'VALIDATION'|'REVOCATION'|'BRIDGE_HOP'|'TRANSFER'|'ATTESTATION'} operation
 * @param {number} [multiplier=1]  — e.g. number of hops for BRIDGE_HOP
 * @returns {number}  fee in NOVA tokens
 */
export function computeFee(operation, multiplier = 1) {
  const base = FEE_SCHEDULE[operation];
  if (!base) throw new Error(`Unknown operation: ${operation}`);
  return base * multiplier;
}

// ═══════════════════════════════════════════════════════════════════════════
//  STAKING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute staking APY for a validator at a given stake rank.
 *
 * APY = φ% × φ^(stake_rank / φ)
 * (φ% = 1.618% per Fibonacci epoch)
 *
 * rank 0 (lowest) → APY = φ% × 1 = 1.618%
 * rank 5           → APY = φ% × φ^(5/φ) ≈ 1.618% × 4.236 ≈ 6.85%
 * rank 13          → APY = φ% × φ^(13/φ) ≈ 1.618% × 145 ≈ 234%
 *
 * @param {number} stakeRank  — validator's rank (0 = new validator)
 * @returns {number}  APY as a decimal (0.01618 = 1.618%)
 */
export function stakingAPY(stakeRank) {
  return (PHI / 100) * Math.pow(PHI, stakeRank / PHI);
}

/**
 * Check whether a validator's stake meets the minimum requirement.
 *
 * @param {number} stakedClavis
 * @returns {boolean}
 */
export function meetsValidatorMinStake(stakedClavis) {
  return stakedClavis >= VALIDATOR_MIN_STAKE;
}

/**
 * Slash amount for an invalid validation.
 * Loss = φ³ CLAVIS
 *
 * @returns {number}
 */
export function slashAmount() {
  return PHI3;
}

// ═══════════════════════════════════════════════════════════════════════════
//  REVENUE MODEL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute daily revenue given operation counts.
 *
 * R(t) = registrations×φ² + validations×φ⁻¹ + revocations×φ³ + bridges×φ⁴
 *
 * @param {{ registrations, validations, revocations, bridges }} counts
 * @param {number} [novaTokenPriceUsd=1]  — USD price per NOVA token
 * @returns {{ novaTokens: number, usd: number }}
 */
export function dailyRevenue({ registrations = 0, validations = 0, revocations = 0, bridges = 0 }, novaTokenPriceUsd = 1) {
  const novaTokens =
    registrations  * FEE_SCHEDULE.REGISTRATION +
    validations    * FEE_SCHEDULE.VALIDATION +
    revocations    * FEE_SCHEDULE.REVOCATION +
    bridges        * FEE_SCHEDULE.BRIDGE_HOP;

  return { novaTokens, usd: novaTokens * novaTokenPriceUsd };
}

/**
 * Estimate the CLAVIS circulating supply after T days of operation.
 *
 * Supply(T) = initial + Σ(daily_registrations − daily_revocations) × T
 * Capped at MAX_SUPPLY_CLAVIS.
 *
 * @param {number} dailyRegistrations
 * @param {number} dailyRevocations
 * @param {number} daysElapsed
 * @returns {number}  estimated circulating supply
 */
export function estimateCirculatingSupply(dailyRegistrations, dailyRevocations, daysElapsed) {
  const netDaily = dailyRegistrations - dailyRevocations;
  return Math.min(MAX_SUPPLY_CLAVIS, Math.max(0, netDaily * daysElapsed));
}

/**
 * φ-weighted governance vote power for a staker.
 *
 * vote_power = staked_clavis^(1/φ) × φ^(epochs_staked mod 13)
 *
 * Long-term stakers get more vote power (φ-amplified).
 *
 * @param {number} stakedClavis
 * @param {number} epochsStaked  — number of Fibonacci epochs staked
 * @returns {number}  vote power
 */
export function votePower(stakedClavis, epochsStaked) {
  return Math.pow(stakedClavis, PHI_INV) * Math.pow(PHI, epochsStaked % 13);
}

export default {
  MAX_SUPPLY_CLAVIS,
  VALIDATOR_MIN_STAKE,
  FIBONACCI_EPOCHS,
  FEE_SCHEDULE,
  computeFee,
  stakingAPY,
  meetsValidatorMinStake,
  slashAmount,
  dailyRevenue,
  estimateCirculatingSupply,
  votePower,
};
