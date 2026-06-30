///
/// @medina/thesis-alpha — SENSUS Engine
///
/// SENSUS is the perception and substrate classification engine.
/// It classifies the research substrate before THESIS acts.
///
/// THESIS cannot write final output until SENSUS classifies:
///   • substrate type
///   • authority class
///   • runtime layer
///   • claim risk
///   • private core detection
///   • public release boundary
///   • required routes
///   • blocked actions
///
/// Mathematical model:
///
///   Aristotelian Rhetoric Classification:
///     Logos score  = logical coherence of the substrate text   (φ-weighted)
///     Ethos score  = authority and credibility signals          (unit weight)
///     Pathos score = consequence / impact signals               (1/φ weight)
///
///     Composite substrate score:
///       S = √((Logos·φ)² + (Ethos·1)² + (Pathos·(1/φ))²)
///       ↑ Pythagorean combination of the three rhetorical vectors
///
///   Claim Risk Index (CRI):
///     CRI = 1 − (evidence_strength / 10)
///     CRI ∈ [0, 1] — 0 = fully supported, 1 = zero evidence (maximum risk)
///
///   Privacy Pressure (PP):
///     PP = Σ (private_term_matches × φ) / max_possible
///     PP > EMERGENCE_THRESHOLD → private core detected
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI_INV, EMERGENCE_THRESHOLD, RHETORIC,
  SUBSTRATE_TYPE, AUTHORITY_STATE, RUNTIME_LAYER,
  CLAIM_CLASS, EVIDENCE_CLASS, EVIDENCE_STRENGTH,
  CLAIM_MIN_EVIDENCE, CLAIM_PRIVATE_GATE,
  SURFACE,
} from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════
//  PRIVATE CORE TERMS — presence signals private core substrate
// ═══════════════════════════════════════════════════════════════════════════

const PRIVATE_CORE_TERMS = [
  'vault', 'private model', 'protected mechanism', 'unreleased runtime',
  'strategic IP', 'chain key', 'operator secret', 'private chain',
  'model internals', 'internal architecture', 'confidential',
  'private core', 'not for release', 'counsel only', 'do not distribute',
  'sensitive', 'restricted', 'privileged', 'classified',
];

// Substrate keyword signatures — maps keywords to substrate types
const SUBSTRATE_SIGNATURES = {
  [SUBSTRATE_TYPE.PAPER_DRAFT]:              ['abstract', 'introduction', 'conclusion', 'methodology', 'references'],
  [SUBSTRATE_TYPE.THEOREM_CANDIDATE]:        ['theorem', 'proof', 'lemma', 'corollary', 'QED', 'axiom', 'conjecture'],
  [SUBSTRATE_TYPE.PROTOCOL_CANDIDATE]:       ['protocol', 'spec', 'specification', 'message format', 'handshake', 'wire format'],
  [SUBSTRATE_TYPE.IP_CLAIM]:                 ['invention', 'novel', 'prior art', 'patent', 'proprietary', 'trade secret', 'IP'],
  [SUBSTRATE_TYPE.PROOF_RECORD]:             ['proof', 'verified', 'test passed', 'validated', 'evidence', 'log output'],
  [SUBSTRATE_TYPE.DEPLOYMENT_BLUEPRINT]:     ['deploy', 'deployment', 'canister', 'rollback', 'manifest', 'environment'],
  [SUBSTRATE_TYPE.CODE_APPENDIX]:            ['function', 'class', 'import', 'export', 'const', 'let', 'var', 'return'],
  [SUBSTRATE_TYPE.REPRODUCIBILITY_ARTIFACT]: ['reproduce', 'reproducibility', 'script', 'seed', 'deterministic', 'idempotent'],
  [SUBSTRATE_TYPE.PRIVATE_CORE]:             PRIVATE_CORE_TERMS,
  [SUBSTRATE_TYPE.RUNTIME_PAPER]:            ['runtime', 'canister', 'motoko', 'wasm', 'actor', 'heartbeat', 'organism'],
  [SUBSTRATE_TYPE.BLOCKCHAIN_NOTARY]:        ['hash', 'merkle', 'notary', 'IPFS', 'Arweave', 'blockchain', 'receipt', 'anchor'],
  [SUBSTRATE_TYPE.MEMORY_RECORD]:            ['lineage', 'append-only', 'memory', 'revision', 'ledger', 'archive'],
};

// ═══════════════════════════════════════════════════════════════════════════
//  SENSUS ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class SensusEngine {
  constructor({ agentId = 'THESIS-ALPHA' } = {}) {
    this.agentId    = agentId;
    this.birthTime  = Date.now();
    this.runCount   = 0;
    this.classifications = [];

    console.log(`👁️  SENSUS born | agentId=${agentId} | perception gate ready`);
  }

  // ─── Primary classification ────────────────────────────────────────────

  /**
   * Classify a raw research substrate.
   *
   * @param {string|object} input — raw text, JSON object, or structured packet
   * @param {object} [hints]      — optional operator hints
   * @returns {SensusClassification}
   */
  classify(input, hints = {}) {
    this.runCount++;

    const text         = this._toText(input);
    const substrateType = hints.substrateType || this._detectSubstrate(text);
    const rhetoricScore = this._scoreRhetoric(text);
    const claimRisk    = this._computeClaimRisk(text, hints.evidenceClass);
    const privacyPress = this._computePrivacyPressure(text);
    const privateCore  = privacyPress > EMERGENCE_THRESHOLD;
    const authorityClass = this._assignAuthority(substrateType, privateCore, claimRisk);
    const runtimeLayer = this._assignRuntimeLayer(substrateType, claimRisk);
    const routes       = this._requiredRoutes(substrateType, privateCore);
    const blockedActions = this._blockedActions(privateCore, claimRisk);
    const releaseAllowed = !privateCore && claimRisk < EMERGENCE_THRESHOLD;

    const classification = {
      classificationId: `SENSUS-${this.runCount}-${Date.now()}`,
      timestamp:        Date.now(),
      substrateType,
      authorityClass,
      runtimeLayer,
      claimRisk:         +claimRisk.toFixed(4),
      privacyPressure:   +privacyPress.toFixed(4),
      privateCore,
      publicReleaseAllowed: releaseAllowed,
      requiredRoutes:    routes,
      blockedActions,
      rhetoricScore,
      initialAuthorityState: this._initialAuthority(privateCore),
    };

    this.classifications.push(classification);
    console.log(`   SENSUS classified | substrate=${substrateType} | privateCore=${privateCore} | risk=${classification.claimRisk}`);
    return classification;
  }

  // ─── Substrate detection ───────────────────────────────────────────────

  _detectSubstrate(text) {
    const lower = text.toLowerCase();
    const scores = {};

    for (const [type, keywords] of Object.entries(SUBSTRATE_SIGNATURES)) {
      // Count keyword hits — Pythagorean aggregation across keyword vectors
      let sumSq = 0;
      for (const kw of keywords) {
        const count = (lower.match(new RegExp(kw.toLowerCase(), 'g')) || []).length;
        sumSq += count * count;  // a² + b² + ... (Pythagorean accumulation)
      }
      scores[type] = Math.sqrt(sumSq);  // c = √(Σkᵢ²)
    }

    // Return highest-scoring substrate type
    let best = SUBSTRATE_TYPE.PAPER_DRAFT;
    let bestScore = -1;
    for (const [type, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        best = type;
      }
    }
    return best;
  }

  // ─── Aristotelian rhetoric scoring ────────────────────────────────────

  /**
   * Score substrate on Logos (logical), Ethos (authority), Pathos (impact).
   * Composite: S = √((Logos·φ)² + (Ethos·1)² + (Pathos·(1/φ))²)
   */
  _scoreRhetoric(text) {
    const lower = text.toLowerCase();

    // Logos — logical proof signals
    const logosTerms = ['therefore', 'proof', 'theorem', 'because', 'evidence',
                        'verified', 'thus', 'demonstrated', 'result', 'follows'];
    const logosHits = logosTerms.reduce((n, t) =>
      n + (lower.match(new RegExp(t, 'g')) || []).length, 0);
    const logos = Math.min(1, logosHits / 20);

    // Ethos — authority/credibility signals
    const ethosTerms = ['medina', 'nova', 'protocol', 'standard', 'certified',
                        'authenticated', 'sovereign', 'validated', 'peer review'];
    const ethosHits = ethosTerms.reduce((n, t) =>
      n + (lower.match(new RegExp(t, 'g')) || []).length, 0);
    const ethos = Math.min(1, ethosHits / 10);

    // Pathos — consequence/impact signals
    const pathosTerms = ['critical', 'urgent', 'important', 'significant',
                         'must', 'required', 'necessary', 'essential', 'deploy'];
    const pathosHits = pathosTerms.reduce((n, t) =>
      n + (lower.match(new RegExp(t, 'g')) || []).length, 0);
    const pathos = Math.min(1, pathosHits / 15);

    // Pythagorean composite with φ-weighted vectors
    const lVec = logos  * RHETORIC.LOGOS;   // Logos  × φ
    const eVec = ethos  * RHETORIC.ETHOS;   // Ethos  × 1
    const pVec = pathos * RHETORIC.PATHOS;  // Pathos × 1/φ

    const composite = Math.sqrt(lVec * lVec + eVec * eVec + pVec * pVec);

    return {
      logos:     +logos.toFixed(4),
      ethos:     +ethos.toFixed(4),
      pathos:    +pathos.toFixed(4),
      composite: +composite.toFixed(4),
    };
  }

  // ─── Claim risk ────────────────────────────────────────────────────────

  /**
   * CRI = 1 − (evidence_strength / 10)
   * Low evidence strength → high claim risk.
   */
  _computeClaimRisk(text, evidenceClass) {
    const eClass = evidenceClass || this._inferEvidenceClass(text);
    const strength = EVIDENCE_STRENGTH[eClass] ?? 0;
    return 1.0 - (strength / 10.0);
  }

  _inferEvidenceClass(text) {
    const lower = text.toLowerCase();
    if (lower.includes('blockchain') || lower.includes('notary receipt')) return 'E9';
    if (lower.includes('hash manifest') || lower.includes('merkle'))       return 'E8';
    if (lower.includes('sva certificate'))                                  return 'E7';
    if (lower.includes('bot proof record'))                                 return 'E6';
    if (lower.includes('script') && lower.includes('reproducible'))        return 'E5';
    if (lower.includes('implementation') || lower.includes('function '))   return 'E4';
    if (lower.includes('test') && lower.includes('log'))                   return 'E3';
    if (lower.includes('report') || lower.includes('internal'))            return 'E2';
    if (lower.length > 100)                                                 return 'E1';
    return 'E0';
  }

  // ─── Privacy pressure ─────────────────────────────────────────────────

  /**
   * PP = Σ (private_term_matches × φ) / max_possible
   * PP > EMERGENCE_THRESHOLD → private core detected
   */
  _computePrivacyPressure(text) {
    const lower = text.toLowerCase();
    let totalHits = 0;
    for (const term of PRIVATE_CORE_TERMS) {
      totalHits += (lower.match(new RegExp(term.toLowerCase(), 'g')) || []).length;
    }
    const maxPossible = PRIVATE_CORE_TERMS.length * PHI;
    return Math.min(1, (totalHits * PHI) / maxPossible);
  }

  // ─── Authority and layer assignment ───────────────────────────────────

  _assignAuthority(substrateType, privateCore, claimRisk) {
    if (privateCore) return 'PRIVATE_VAULT_AUTHORITY';
    if (claimRisk > 0.7) return 'DRAFT_AUTHORITY';
    if (substrateType === SUBSTRATE_TYPE.THEOREM_CANDIDATE) return 'THEOREM_AUTHORITY';
    if (substrateType === SUBSTRATE_TYPE.IP_CLAIM) return 'COUNSEL_AUTHORITY';
    if (substrateType === SUBSTRATE_TYPE.DEPLOYMENT_BLUEPRINT) return 'DEPLOYMENT_AUTHORITY';
    if (substrateType === SUBSTRATE_TYPE.BLOCKCHAIN_NOTARY) return 'NOTARY_AUTHORITY';
    return 'RESEARCH_AUTHORITY';
  }

  _assignRuntimeLayer(substrateType, claimRisk) {
    if (claimRisk < 0.3) return RUNTIME_LAYER.ACTIVE_STATE;
    if (substrateType === SUBSTRATE_TYPE.BLOCKCHAIN_NOTARY) return RUNTIME_LAYER.NOVA_ROOT;
    if (substrateType === SUBSTRATE_TYPE.MEMORY_RECORD) return RUNTIME_LAYER.MEMORY_RUNTIME;
    if (claimRisk > 0.7) return RUNTIME_LAYER.FOUNDATION_FLOOR;
    return RUNTIME_LAYER.ACTIVE_STATE;
  }

  _requiredRoutes(substrateType, privateCore) {
    const routes = [SURFACE.SOURCE, SURFACE.FORGE];
    if (privateCore) routes.push(SURFACE.NEXUS);
    if ([SUBSTRATE_TYPE.DEPLOYMENT_BLUEPRINT, SUBSTRATE_TYPE.RUNTIME_PAPER].includes(substrateType)) {
      routes.push(SURFACE.DEPLOY);
    }
    if ([SUBSTRATE_TYPE.BLOCKCHAIN_NOTARY, SUBSTRATE_TYPE.IP_CLAIM].includes(substrateType)) {
      routes.push(SURFACE.NEXUS);
    }
    return [...new Set(routes)];
  }

  _blockedActions(privateCore, claimRisk) {
    const blocked = [];
    if (privateCore) {
      blocked.push('public_release', 'external_publication', 'marketing_safe_render');
    }
    if (claimRisk > 0.8) {
      blocked.push('claim_promotion', 'notarization', 'deployment_claim');
    }
    if (claimRisk > 0.5) {
      blocked.push('public_safe_promotion');
    }
    return blocked;
  }

  _initialAuthority(privateCore) {
    return privateCore ? AUTHORITY_STATE.PRIVATE_VAULT : AUTHORITY_STATE.DRAFT;
  }

  // ─── Utility ───────────────────────────────────────────────────────────

  _toText(input) {
    if (typeof input === 'string') return input;
    if (typeof input === 'object' && input !== null) return JSON.stringify(input);
    return String(input);
  }

  getStatus() {
    return {
      agentId:         this.agentId,
      uptime:          Date.now() - this.birthTime,
      runCount:        this.runCount,
      lastClassification: this.classifications.at(-1) || null,
    };
  }
}

export default SensusEngine;
