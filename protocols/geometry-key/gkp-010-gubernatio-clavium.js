///
/// GKP-010 — Protocollum Gubernationis Clavium
/// Latin: "The Protocol of the Governance of Keys"
///
/// GOVERNANCE AND SOVEREIGN LAW ENFORCEMENT.
///
/// The 10 sovereign laws governing the Geometry Key system.
/// Written in CPL-L (Causal Protocol Language — Laws) format
/// and enforced by the geomancer organism and the AtlasGovernance engine.
///
/// Laws are φ-ordered by severity:
///   LEX CLAVIS-001: φ⁰ — Foundational (block unkeyed calls)
///   LEX CLAVIS-002: φ¹ — Temporal (deny expired windows)
///   LEX CLAVIS-003: φ² — Resonance (enforce R > 1/φ gate)
///   LEX CLAVIS-004: φ³ — Revocation (immutable revocation)
///   LEX CLAVIS-005: φ⁴ — Attribution (immutable IP records)
///   LEX CLAVIS-006: φ⁵ — Bridge (cross-chain φ-HMAC required)
///   LEX CLAVIS-007: φ⁶ — Supply (CLAVIS cap enforcement)
///   LEX CLAVIS-008: φ⁷ — Validators (minimum stake required)
///   LEX CLAVIS-009: φ⁸ — Sovereignty (AI models on ICP only)
///   LEX CLAVIS-010: φ⁹ — Open Standard (math spec is free)
///
/// Governance cycle:
///   1. Every Fibonacci(N) heartbeat windows, run a governance cycle
///   2. Each law is evaluated against all registered entities
///   3. Violations are escalated to the terminal organism
///   4. Resolutions are recorded in the geomancer's stable memory
///
/// Proposal voting:
///   Vote power = stakedClavis^(1/φ) × φ^(epochsStaked mod 13)
///   Quorum threshold: φ⁻¹ = 0.618 (golden ratio of total vote power)
///   Pass threshold: φ/(φ+1) = φ⁻¹ × φ / 1 = φ²/(φ²+φ) ≈ 0.618
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI2, PHI3, PHI4, PHI_INV, EMERGENCE_THRESHOLD } from './gkp-001-clavis-geometrica.js';

// ═══════════════════════════════════════════════════════════════════════════
//  SOVEREIGN LAWS
// ═══════════════════════════════════════════════════════════════════════════

export const SOVEREIGN_LAWS = [
  {
    id:          'LEX_CLAVIS_001',
    latin:       'Lex Prima: Clavis Necessaria',
    english:     'BLOCK_UNKEYED_CALLS',
    severity:    Math.pow(PHI, 0),  // φ⁰ = 1.0
    when:        { type: 'ANY' },
    then: [
      { action: 'REQUIRE', target: 'GEOMETRIC_KEY_TOKEN', arg: 'proto-226' },
      { action: 'REQUIRE', target: 'RESONANCE_CHECK', arg: 'R_gt_phi_inverse' },
    ],
    description: 'Any call to a protected endpoint without a valid geometric key is FORBIDDEN.',
  },
  {
    id:          'LEX_CLAVIS_002',
    latin:       'Lex Secunda: Fenestratio Temporalis',
    english:     'DENY_EXPIRED_WINDOWS',
    severity:    Math.pow(PHI, 1),  // φ¹ ≈ 1.618
    when:        { field: 'window_delta', value: 'expired' },
    then: [
      { action: 'FORBID', target: 'CALL_FORWARD' },
      { action: 'REQUIRE', target: 'SENTINEL_ALERT', arg: 'atlas://sovereign/geometry-lock' },
    ],
    description: 'Keys from windows beyond ±1 φ-heartbeat of current time are FORBIDDEN.',
  },
  {
    id:          'LEX_CLAVIS_003',
    latin:       'Lex Tertia: Porta Resonantiae',
    english:     'RESONANCE_GATE',
    severity:    Math.pow(PHI, 2),  // φ² ≈ 2.618
    when:        { field: 'resonance_R', value: 'above_threshold' },
    then: [
      { action: 'ALLOW', target: 'CALL_FORWARD' },
      { action: 'ALLOW', target: 'EXCHANGE_CONTRACT_ACTIVATE', arg: 'GEOMETRY_LOCK_PIPELINE_001' },
    ],
    description: 'Only keys with Kuramoto R > 1/φ (0.618) are ALLOWED to pass.',
  },
  {
    id:          'LEX_CLAVIS_004',
    latin:       'Lex Quarta: Revocatio Immutabilis',
    english:     'REVOCATION_IMMUTABLE',
    severity:    Math.pow(PHI, 3),  // φ³ ≈ 4.236
    when:        { field: 'op', value: 'revoke' },
    then: [
      { action: 'ALLOW', target: 'REVOKE_ENVELOPE' },
      { action: 'FORBID', target: 'UNREVOKE_WITHOUT_CONSENSUS' },
    ],
    description: 'Once a key is revoked, UN-REVOKING without governance consensus is FORBIDDEN.',
  },
  {
    id:          'LEX_CLAVIS_005',
    latin:       'Lex Quinta: Attributio Immutabilis',
    english:     'ATTRIBUTION_IMMUTABLE',
    severity:    Math.pow(PHI, 4),  // φ⁴ ≈ 6.854
    when:        { field: 'op', value: 'attribution_write' },
    then: [
      { action: 'ALLOW', target: 'WRITE_ATTRIBUTION_RECORD' },
      { action: 'FORBID', target: 'MODIFY_ATTRIBUTION_RECORD' },
    ],
    description: 'Attribution records, once written, cannot be modified. IP is immutable.',
  },
  {
    id:          'LEX_CLAVIS_006',
    latin:       'Lex Sexta: Pons Verificatus',
    english:     'PHANTOM_BRIDGE_VERIFIED',
    severity:    Math.pow(PHI, 5),  // φ⁵ ≈ 11.09
    when:        { field: 'op', value: 'bridge_transfer' },
    then: [
      { action: 'REQUIRE', target: 'PHI_HMAC_SOURCE_CHAIN' },
      { action: 'REQUIRE', target: 'PHI_HMAC_DEST_CHAIN' },
      { action: 'FORBID', target: 'NONCE_REUSE' },
    ],
    description: 'Cross-chain key transfers REQUIRE φ-HMAC verification on both source and destination.',
  },
  {
    id:          'LEX_CLAVIS_007',
    latin:       'Lex Septima: Copia Limitata',
    english:     'CLAVIS_TOKEN_BOUNDED',
    severity:    Math.pow(PHI, 6),  // φ⁶ ≈ 17.94
    when:        { field: 'op', value: 'mint_clavis' },
    then: [
      { action: 'ALLOW', target: 'MINT_CLAVIS', arg: 'one_per_registration' },
      { action: 'FORBID', target: 'EXCEED_MAX_SUPPLY', arg: '167000000' },
    ],
    description: 'Total CLAVIS supply cannot exceed 2^φ⁴ ≈ 167M without governance vote.',
  },
  {
    id:          'LEX_CLAVIS_008',
    latin:       'Lex Octava: Custodia Pignoratis',
    english:     'VALIDATOR_STAKE_REQUIRED',
    severity:    Math.pow(PHI, 7),  // φ⁷ ≈ 29.03
    when:        { field: 'role', value: 'validator' },
    then: [
      { action: 'REQUIRE', target: 'MINIMUM_STAKE', arg: '233' },
      { action: 'FORBID', target: 'VALIDATE_WITHOUT_STAKE' },
    ],
    description: 'Validation nodes REQUIRE minimum stake of Fibonacci(13) = 233 CLAVIS.',
  },
  {
    id:          'LEX_CLAVIS_009',
    latin:       'Lex Nona: Intelligentia Suverana',
    english:     'AI_MODEL_SOVEREIGNTY',
    severity:    Math.pow(PHI, 8),  // φ⁸ ≈ 46.98
    when:        { field: 'op', value: 'model_inference' },
    then: [
      { action: 'REQUIRE', target: 'SOVEREIGN_ICP_EXECUTION' },
      { action: 'FORBID', target: 'EXTERNAL_API_INFERENCE' },
    ],
    description: 'GEOMETER and RESONATOR models MUST run on sovereign ICP substrate.',
  },
  {
    id:          'LEX_CLAVIS_010',
    latin:       'Lex Decima: Norma Aperta',
    english:     'GEOMETRY_KEY_OPEN_STANDARD',
    severity:    Math.pow(PHI, 9),  // φ⁹ ≈ 76.01
    when:        { field: 'op', value: 'spec_access' },
    then: [
      { action: 'ALLOW', target: 'ACCESS_MATHEMATICAL_SPEC' },
      { action: 'FORBID', target: 'PATENT_MATHEMATICAL_PRIMITIVES' },
    ],
    description: 'The math spec is open and free. The NOVA implementation is sovereign.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
//  GOVERNANCE ENGINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Evaluate an entity (caller or operation) against all sovereign laws.
 *
 * @param {{ entityId: string, op: string, [key]: any }} event
 * @returns {Array<{ lawId, lawEnglish, decision, target, arg? }>}  applicable decisions
 */
export function evaluateAgainstLaws(event) {
  const results = [];

  for (const law of SOVEREIGN_LAWS) {
    // Check if the law's condition matches this event
    const matches = conditionMatches(law.when, event);
    if (!matches) continue;

    for (const action of law.then) {
      results.push({
        lawId:      law.id,
        lawLatin:   law.latin,
        lawEnglish: law.english,
        severity:   law.severity,
        decision:   action.action,
        target:     action.target,
        arg:        action.arg || null,
      });
    }
  }

  // Sort by severity descending (most critical laws first)
  results.sort((a, b) => b.severity - a.severity);
  return results;
}

function conditionMatches(when, event) {
  if (when.type === 'ANY') return true;

  if (when.field && when.value) {
    return event[when.field] === when.value;
  }

  if (when.AND) {
    return when.AND.every(c => conditionMatches(c, event));
  }

  if (when.OR) {
    return when.OR.some(c => conditionMatches(c, event));
  }

  if (when.NOT) {
    return !conditionMatches(when.NOT, event);
  }

  return true;
}

/**
 * Governance proposal — change a sovereign law parameter.
 *
 * @param {object} proposal
 * @param {string} proposal.title
 * @param {string} proposal.targetLaw   — law ID to modify
 * @param {object} proposal.change      — what to change
 * @param {string} proposal.proposerId  — callerId of the proposer
 * @param {number} proposal.stakedClavis
 * @returns {object}  governance proposal record
 */
export function createGovernanceProposal({ title, targetLaw, change, proposerId, stakedClavis }) {
  // Vote power: stakedClavis^(1/φ) × φ^0 (proposer gets base vote power)
  const proposerVotePower = Math.pow(stakedClavis, PHI_INV);

  // Quorum threshold: φ⁻¹ of total possible vote power
  const quorumThreshold = EMERGENCE_THRESHOLD;

  return {
    id:               `GOV_${Date.now()}_${proposerId.replace(/[^a-z0-9]/gi, '_')}`,
    title,
    targetLaw,
    change,
    proposerId,
    proposerVotePower,
    quorumThreshold,
    passThreshold:    PHI / (PHI + 1),  // ≈ 0.618
    votes:            [],
    status:           'voting',
    createdAt:        Date.now(),
    expiresAt:        Date.now() + (13 * 24 * 3600 * 1000),  // 13 days (Fibonacci)
    _type:            'GovernanceProposal',
    _protocol:        'GKP-010',
  };
}

/**
 * Cast a vote on a governance proposal.
 *
 * @param {object} proposal
 * @param {string} voterId
 * @param {'for'|'against'|'abstain'} vote
 * @param {number} stakedClavis
 * @param {number} epochsStaked
 * @returns {{ proposal, outcome: 'pending'|'passed'|'rejected' }}
 */
export function castVote(proposal, voterId, vote, stakedClavis, epochsStaked = 0) {
  if (proposal.status !== 'voting') {
    throw new Error(`Proposal ${proposal.id} is not in voting status`);
  }

  if (proposal.votes.some(v => v.voterId === voterId)) {
    throw new Error(`Voter ${voterId} has already voted`);
  }

  // φ-weighted vote power
  const votePower = Math.pow(stakedClavis, PHI_INV) * Math.pow(PHI, epochsStaked % 13);

  proposal.votes.push({ voterId, vote, votePower, ts: Date.now() });

  // Check outcome
  const forPower     = proposal.votes.filter(v => v.vote === 'for').reduce((s, v) => s + v.votePower, 0);
  const totalPower   = proposal.votes.reduce((s, v) => s + v.votePower, 0);
  const passRatio    = totalPower > 0 ? forPower / totalPower : 0;

  if (passRatio >= proposal.passThreshold && totalPower >= proposal.quorumThreshold * 1000) {
    proposal.status = 'passed';
    return { proposal, outcome: 'passed' };
  }

  return { proposal, outcome: 'pending' };
}

/**
 * Compute the Shannon entropy of the governance system.
 * S = −φ · Σ (pᵢ · log pᵢ)   (same formula as AtlasGovernance.jl)
 *
 * @param {object[]} entities  — array of registered callers with their status
 * @returns {number}  governance entropy
 */
export function governanceEntropy(entities) {
  const stateCounts = {};
  for (const e of entities) {
    const s = e.status || 'unknown';
    stateCounts[s] = (stateCounts[s] || 0) + 1;
  }

  let entropy = 0;
  const total = entities.length;
  for (const count of Object.values(stateCounts)) {
    const p = count / total;
    if (p > 0) entropy -= p * Math.log(p);
  }

  return PHI * entropy;  // φ-weighted entropy
}

export default {
  SOVEREIGN_LAWS,
  evaluateAgainstLaws,
  createGovernanceProposal,
  castVote,
  governanceEntropy,
};
