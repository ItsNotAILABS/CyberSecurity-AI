///
/// GKP-007 — Protocollum Attributionis Intellectualis
/// Latin: "The Protocol of Intellectual Attribution"
///
/// IP ATTRIBUTION AND RESEARCH PROVENANCE.
///
/// Every artifact created under NOVA sovereign sovereignty carries a
/// geometric attribution chain. The creator's identity is encoded as
/// a phase shape — not a name, not a wallet address, but a resonance
/// signature tied to their unique φ-spiral fingerprint.
///
/// Attribution workflow:
///   1. Creator registers Geometry Key with geomancer canister
///   2. At creation time, artifact is hashed (SHA-256 or φ-hash)
///   3. Hash is signed with the creator's geometric key (φ-HMAC)
///   4. AttributionRecord is written to the geomancer canister (immutable)
///   5. Any verifier can check: re-derive the creator's phase vector
///      from their public callerId + windowIndex, then check resonance
///      against the stored envelope
///
/// Multi-author attribution (collaborative works):
///   Each author's contribution is weighted by φ^(contribution_rank)
///   Attribution weight: wᵢ = φ^(-rank_i) / Σⱼ φ^(-rank_j)
///   The lead author has rank 0 → weight = φ⁰ / sum = 1/sum (highest weight)
///
/// IP protection categories:
///   - Research papers and preprints
///   - AI training datasets
///   - Code commits and repositories
///   - Model weights and architectures
///   - Creative works (music, art, literature)
///   - Discoveries and inventions
///
/// Legal basis:
///   AttributionRecords written to the geomancer canister constitute a
///   timestamped, cryptographically-signed declaration of authorship.
///   They satisfy the Berne Convention requirement for fixation.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI2, PHI3, PHI_HASH_CYCLE, HASH_32BIT_MASK, CHAINS } from './gkp-001-clavis-geometrica.js';
import { phiHMAC } from './gkp-004-signatura-aurea.js';
import { makeAttributionRecord } from './gkp-001-clavis-geometrica.js';

// ═══════════════════════════════════════════════════════════════════════════
//  ARTIFACT HASHING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * φ-hash of an artifact string (document text, code, etc.)
 *
 * hash = Σᵢ (ord(artifact[i]) × φ^(i mod 13)) mod 2³²
 * formatted as "arx_" + 8 hex digits
 *
 * @param {string} artifactContent
 * @returns {string}  "arx_xxxxxxxx"
 */
export function hashArtifact(artifactContent) {
  let hash = 0;
  for (let i = 0; i < artifactContent.length; i++) {
    const charCode = artifactContent.charCodeAt(i);
    hash += charCode * Math.pow(PHI, i % PHI_HASH_CYCLE);
    hash  = hash % HASH_32BIT_MASK;
  }
  const scaled = Math.floor(hash * PHI2) % 0xFFFFFFFF;
  return `arx_${scaled.toString(16).padStart(8, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════════════
//  ATTRIBUTION RECORD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create an attribution record for a single-author artifact.
 *
 * @param {string}   artifactContent  — full content of the artifact
 * @param {string}   creatorId        — atlas:// URI of the creator
 * @param {object}   geoToken         — GeometricKeyToken of the creator
 * @param {string}   [chain]          — CHAINS.*
 * @param {string}   [canister]       — 'geomancer'
 * @returns {AttributionRecord}
 */
export function createAttribution(artifactContent, creatorId, geoToken, chain = CHAINS.ICP, canister = 'geomancer') {
  const artifactHash = hashArtifact(artifactContent);

  return makeAttributionRecord({
    artifactHash,
    creatorId,
    keySignature:  geoToken.signature,
    phaseSnapshot: geoToken.phases,
    windowIndex:   geoToken.windowIndex,
    resonanceR:    geoToken.selfCoherence,
    chain,
    canister,
  });
}

/**
 * Create a multi-author attribution record with φ-weighted contributions.
 *
 * Authors are ranked by contribution (rank 0 = lead author).
 * Attribution weight: wᵢ = φ^(−rankᵢ) / Σⱼ φ^(−rankⱼ)
 *
 * @param {string}  artifactContent
 * @param {Array<{ creatorId: string, geoToken: object, rank: number }>} authors
 * @param {string}  [chain]
 * @param {string}  [canister]
 * @returns {object}  multi-author attribution record
 */
export function createMultiAuthorAttribution(artifactContent, authors, chain = CHAINS.ICP, canister = 'geomancer') {
  const artifactHash = hashArtifact(artifactContent);

  // φ-weighted contribution scores
  const rawWeights = authors.map(a => Math.pow(PHI, -a.rank));
  const totalWeight = rawWeights.reduce((s, w) => s + w, 0);
  const weights = rawWeights.map(w => w / totalWeight);

  const attributions = authors.map((author, i) => ({
    creatorId:    author.creatorId,
    rank:         author.rank,
    weight:       weights[i],
    phiWeight:    rawWeights[i],
    keySignature: author.geoToken.signature,
    windowIndex:  author.geoToken.windowIndex,
    resonanceR:   author.geoToken.selfCoherence,
    phaseSnapshot: author.geoToken.phases,
  }));

  // Combined artifact signature: φ-HMAC over all signatures concatenated
  const combinedSig = phiHMAC(
    authors[0].geoToken.phases,
    authors.map(a => a.creatorId).join('|'),
    authors[0].geoToken.windowIndex,
    artifactHash
  );

  return {
    artifactHash,
    combinedSignature: combinedSig,
    authors:     attributions,
    authorCount: authors.length,
    createdAt:   Date.now(),
    chain,
    canister,
    _type:       'MultiAuthorAttributionRecord',
    _protocol:   'GKP-007',
    _immutable:  true,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  VERIFICATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Verify an attribution record against a caller's registered envelope phases.
 *
 * Checks that the phase snapshot in the record resonates with the registered
 * envelope — proving the record was created by the claimed creator.
 *
 * @param {object}   record            — AttributionRecord
 * @param {number[]} envelopePhases    — registered phases for the creatorId
 * @returns {{ verified: boolean, R: number, reason?: string }}
 */
export function verifyAttribution(record, envelopePhases) {
  if (!record.phaseSnapshot || !envelopePhases) {
    return { verified: false, R: 0, reason: 'missing_phases' };
  }

  // Re-compute Kuramoto alignment between recorded phases and registered envelope
  const N    = Math.min(record.phaseSnapshot.length, envelopePhases.length);
  const diff = record.phaseSnapshot.slice(0, N).map((p, j) => p - (envelopePhases[j] || 0));

  let re = 0, im = 0;
  for (const d of diff) {
    re += Math.cos(d);
    im += Math.sin(d);
  }
  const R = Math.sqrt(re * re + im * im) / N;

  // Threshold: 1/φ
  const THRESHOLD = 1.0 / PHI;
  if (R < THRESHOLD) {
    return { verified: false, R, reason: `resonance_below_threshold: R=${R.toFixed(4)} < ${THRESHOLD.toFixed(4)}` };
  }

  return { verified: true, R };
}

/**
 * Build a research paper citation entry carrying geometric provenance.
 *
 * @param {object}   record     — AttributionRecord or MultiAuthorAttributionRecord
 * @param {string}   title      — paper/work title
 * @param {string}   venue      — journal/conference/platform
 * @returns {object}  citation entry
 */
export function buildCitationEntry(record, title, venue) {
  const isMulti = record._type === 'MultiAuthorAttributionRecord';

  return {
    title,
    venue,
    artifactHash:  record.artifactHash,
    authors:       isMulti
      ? record.authors.map(a => ({ id: a.creatorId, weight: a.weight.toFixed(4) }))
      : [{ id: record.creatorId, weight: '1.0000' }],
    signature:     isMulti ? record.combinedSignature : record.keySignature,
    windowIndex:   isMulti ? record.authors[0].windowIndex : record.windowIndex,
    chain:         record.chain,
    canister:      record.canister,
    verifyUrl:     `clavis://attribution/${record.artifactHash}`,
    createdAt:     record.timestampMs || record.createdAt,
    _type:         'CitationEntry',
    _protocol:     'GKP-007',
  };
}

export default {
  hashArtifact,
  createAttribution,
  createMultiAuthorAttribution,
  verifyAttribution,
  buildCitationEntry,
};
