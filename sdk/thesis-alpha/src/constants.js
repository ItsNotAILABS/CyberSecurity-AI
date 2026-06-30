///
/// @medina/thesis-alpha — Mathematical Constants and Classification Tables
///
/// THESIS is the Medina Research, IP, Proof, Publication, Notarization,
/// and Deployment Translation Division Agent.
///
/// Auro speaks. Origo builds.
/// THESIS proves, protects, hashes, prints, notarizes, and prepares
/// Medina research for deployment.
///
/// Mathematical foundations drawn from:
///   • Pythagorean theorem: a² + b² = c²
///   • Golden ratio φ = (1+√5)/2
///   • Fibonacci sequence: F(n) = F(n-1) + F(n-2)
///   • Kuramoto order parameter: R·e^(iΨ) = (1/N)·Σe^(iθⱼ)
///   • Aristotelian rhetoric: Logos · Ethos · Pathos
///   • Shannon entropy: H = −Σ p(x) · log₂ p(x)
///   • Euler's identity: e^(iπ) + 1 = 0
///   • Merkle tree hashing: hash(left ∥ right)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ═══════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

export const PHI          = 1.6180339887498948482;   // (1 + √5) / 2  — golden ratio
export const PHI2         = PHI * PHI;                // φ²  ≈ 2.6180
export const PHI3         = PHI2 * PHI;               // φ³  ≈ 4.2360
export const PHI4         = PHI3 * PHI;               // φ⁴  ≈ 6.8541
export const PHI_INV      = 1.0 / PHI;               // 1/φ ≈ 0.6180  — emergence threshold
export const PHI_INV2     = PHI_INV * PHI_INV;       // 1/φ² ≈ 0.3820
export const GOLDEN_ANGLE = (2 * Math.PI) / PHI2;    // 2π/φ² ≈ 2.3999 rad ≈ 137.508°
export const TWO_PI       = 2 * Math.PI;

// φ-derived heartbeat: 540 × φ ≈ 873ms  (biological heart pulse)
export const PHI_HEARTBEAT_MS = 873;

// Emergence threshold — Kuramoto synchrony gate (same as 1/φ)
export const EMERGENCE_THRESHOLD = PHI_INV;          // 0.6180339887

// Fibonacci sequence (first 20 terms) — used for packet versioning and proof steps
export const FIBONACCI = [0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181];

// Pythagorean 3-4-5 triple — canonical right triangle used in coherence scoring
export const PYTHAGORAS_3_4_5 = { a: 3, b: 4, c: 5 };

// Aristotelian rhetoric weights (Logos, Ethos, Pathos)
// Used to score claim quality: Logos = logical proof weight, Ethos = authority weight,
// Pathos = consequence/impact weight
export const RHETORIC = {
  LOGOS:  PHI,      // logical proof — heaviest weight
  ETHOS:  1.0,      // authority and credibility — unit weight
  PATHOS: PHI_INV,  // impact and consequence — fractional weight
};

// Shannon entropy base
export const LN2 = Math.LN2;

// ═══════════════════════════════════════════════════════════════════════════
//  CLAIM CLASSES — C1 through C12
// ═══════════════════════════════════════════════════════════════════════════

export const CLAIM_CLASS = {
  C1:  'VERIFIED_IMPLEMENTATION',        // C1 — verified implementation claim
  C2:  'SUPPORTED_INTERNAL_RESULT',      // C2 — supported internal result
  C3:  'HYPOTHESIS',                     // C3 — hypothesis
  C4:  'STRATEGIC_THESIS',              // C4 — strategic thesis or framing
  C5:  'IP_BUSINESS',                   // C5 — IP or business claim
  C6:  'PRIVATE_INTERNAL',              // C6 — private internal-only claim
  C7:  'RUNTIME_LAW_CANDIDATE',         // C7 — runtime law candidate
  C8:  'PROTOCOL_CANDIDATE',            // C8 — protocol candidate
  C9:  'THEOREM_CANDIDATE',             // C9 — theorem candidate
  C10: 'PUBLIC_SAFE_EDUCATIONAL',       // C10 — public-safe educational claim
  C11: 'DEPLOYMENT',                    // C11 — deployment claim
  C12: 'NOTARIZATION_AUTHORSHIP',       // C12 — notarization / authorship continuity
};

// Release rules — what each claim class requires before public release
export const CLAIM_RELEASE_RULES = {
  C1:  'public only if proof is attached',
  C2:  'public only with environment boundary',
  C3:  'public only as hypothesis',
  C4:  'public as thesis or framing',
  C5:  'public only after IP or counsel review',
  C6:  'never public',
  C7:  'not public as law unless promoted',
  C8:  'public only as protocol proposal unless accepted',
  C9:  'public only with theorem/proof boundary',
  C10: 'public safe',
  C11: 'public only if deployment evidence exists',
  C12: 'public only if hash/notary receipt exists',
};

// Claims that may NEVER be released without explicit gate
export const CLAIM_PRIVATE_GATE = new Set(['C6']);

// Claims requiring proof attachment before public release
export const CLAIM_PROOF_REQUIRED = new Set(['C1', 'C11', 'C12']);

// ═══════════════════════════════════════════════════════════════════════════
//  EVIDENCE CLASSES — E0 through E10
// ═══════════════════════════════════════════════════════════════════════════

export const EVIDENCE_CLASS = {
  E0:  'NO_EVIDENCE',           // E0 — no evidence attached
  E1:  'SOURCE_TEXT_DRAFT',     // E1 — source text / draft only
  E2:  'INTERNAL_REPORT',       // E2 — internal report
  E3:  'TEST_LOG_OUTPUT',       // E3 — test log / command output
  E4:  'CODE_IMPLEMENTATION',   // E4 — code implementation
  E5:  'REPRODUCIBLE_SCRIPT',   // E5 — reproducible script
  E6:  'BOT_PROOF_RECORD',      // E6 — BotProofRecord
  E7:  'SVA_CERTIFICATE',       // E7 — SVA certificate
  E8:  'HASH_MANIFEST',         // E8 — hash manifest
  E9:  'BLOCKCHAIN_NOTARY',     // E9 — blockchain / notary receipt
  E10: 'EXTERNAL_VALIDATION',   // E10 — external validation / peer review
};

// Ordinal strength of each evidence class (higher = stronger)
export const EVIDENCE_STRENGTH = {
  E0: 0, E1: 1, E2: 2, E3: 3, E4: 4,
  E5: 5, E6: 6, E7: 7, E8: 8, E9: 9, E10: 10,
};

// Minimum evidence class required for each claim class to be public-safe
// (claim strength must not exceed evidence class)
export const CLAIM_MIN_EVIDENCE = {
  C1:  'E4',   // verified implementation requires code or better
  C2:  'E2',   // supported internal result requires internal report or better
  C3:  'E1',   // hypothesis requires source text or better
  C4:  'E1',   // strategic thesis requires source text or better
  C5:  'E4',   // IP claim requires code implementation or better
  C6:  'E0',   // private — no floor, never public
  C7:  'E3',   // runtime law candidate requires test log or better
  C8:  'E3',   // protocol candidate requires test log or better
  C9:  'E3',   // theorem candidate requires test log or better
  C10: 'E1',   // educational claim requires source text
  C11: 'E5',   // deployment claim requires reproducible script or better
  C12: 'E8',   // notarization claim requires hash manifest or better
};

// ═══════════════════════════════════════════════════════════════════════════
//  OUTPUT AUTHORITY STATES
// ═══════════════════════════════════════════════════════════════════════════

export const AUTHORITY_STATE = {
  DRAFT:                'DRAFT',
  INTERNAL_RESEARCH:    'INTERNAL_RESEARCH',
  CLAIM_HARDENED:       'CLAIM_HARDENED',
  EVIDENCE_LINKED:      'EVIDENCE_LINKED',
  HASHED:               'HASHED',
  NOTARY_READY:         'NOTARY_READY',
  NOTARIZED:            'NOTARIZED',
  COUNSEL_READY:        'COUNSEL_READY',
  PUBLIC_SAFE:          'PUBLIC_SAFE',
  PRIVATE_VAULT:        'PRIVATE_VAULT',
  DEPLOYMENT_BLUEPRINT: 'DEPLOYMENT_BLUEPRINT',
  DEPLOYMENT_READY:     'DEPLOYMENT_READY',
};

// Valid forward transitions for authority state
export const AUTHORITY_TRANSITIONS = {
  DRAFT:                ['INTERNAL_RESEARCH', 'PRIVATE_VAULT'],
  INTERNAL_RESEARCH:    ['CLAIM_HARDENED', 'PRIVATE_VAULT'],
  CLAIM_HARDENED:       ['EVIDENCE_LINKED', 'PRIVATE_VAULT', 'COUNSEL_READY'],
  EVIDENCE_LINKED:      ['HASHED', 'COUNSEL_READY', 'DEPLOYMENT_BLUEPRINT'],
  HASHED:               ['NOTARY_READY', 'PUBLIC_SAFE', 'DEPLOYMENT_BLUEPRINT'],
  NOTARY_READY:         ['NOTARIZED'],
  NOTARIZED:            ['PUBLIC_SAFE', 'COUNSEL_READY'],
  COUNSEL_READY:        ['PUBLIC_SAFE', 'PRIVATE_VAULT'],
  PUBLIC_SAFE:          [],            // terminal: no further promotion
  PRIVATE_VAULT:        [],            // terminal: locked
  DEPLOYMENT_BLUEPRINT: ['DEPLOYMENT_READY', 'HASHED'],
  DEPLOYMENT_READY:     [],            // terminal: requires manifest + rollback + env boundary
};

// ═══════════════════════════════════════════════════════════════════════════
//  THESIS LIFECYCLE STATES
// ═══════════════════════════════════════════════════════════════════════════

export const LIFECYCLE = [
  'RAW_INPUT',
  'SUBSTRATE_CLASSIFIED',
  'SOURCE_SURFACE_ACTIVE',
  'EDGE_EXPANDED',
  'FORGE_SURFACE_ACTIVE',
  'CLAIMS_EXTRACTED',
  'CLAIMS_CLASSIFIED',
  'EVIDENCE_MAPPED',
  'PRIVATE_PUBLIC_SPLIT',
  'PACKET_GENERATED',
  'DEPLOY_SURFACE_ACTIVE',
  'HASHED',
  'NOTARY_READY',
  'MEMORY_APPENDED',
  'NEXUS_REGISTRY_ACTIVE',
  'OPERATOR_REVIEW',
];

// Terminal lifecycle states
export const LIFECYCLE_TERMINALS = [
  'PUBLIC_SAFE',
  'PRIVATE_VAULT',
  'DEPLOYMENT_BLUEPRINT',
  'COUNSEL_READY',
];

// ═══════════════════════════════════════════════════════════════════════════
//  SUBSTRATE TYPES (SENSUS classification targets)
// ═══════════════════════════════════════════════════════════════════════════

export const SUBSTRATE_TYPE = {
  PAPER_DRAFT:              'paper_draft',
  DISSERTATION:             'dissertation',
  RUNTIME_PAPER:            'runtime_paper',
  THEOREM_CANDIDATE:        'theorem_candidate',
  PROTOCOL_CANDIDATE:       'protocol_candidate',
  IP_CLAIM:                 'ip_claim',
  PROOF_RECORD:             'proof_record',
  MEMORY_RECORD:            'memory_record',
  SIGNED_RIPPLE:            'signed_ripple',
  PUBLIC_CLAIM:             'public_claim',
  PRIVATE_CORE:             'private_core',
  BLOCKCHAIN_NOTARY:        'blockchain_notary_artifact',
  CODE_APPENDIX:            'code_appendix',
  REPRODUCIBILITY_ARTIFACT: 'reproducibility_artifact',
  DEPLOYMENT_BLUEPRINT:     'deployment_blueprint',
};

// ═══════════════════════════════════════════════════════════════════════════
//  SURFACE ROUTER SURFACES
// ═══════════════════════════════════════════════════════════════════════════

export const SURFACE = {
  SOURCE: 'SOURCE_SURFACE',   // doctrine, source truth, substrate classification
  FORGE:  'FORGE_SURFACE',    // packet generation, schemas, validators, artifacts
  DEPLOY: 'DEPLOY_SURFACE',   // release checks, deployment manifest, rollback
  NEXUS:  'NEXUS_REGISTRY',   // manifests, lineage objects, reusable contracts
};

// ═══════════════════════════════════════════════════════════════════════════
//  WORKING COHORT ROLES (Latin designations)
// ═══════════════════════════════════════════════════════════════════════════

export const COHORT_ROLE = {
  QUAESTOR:   'Quaestor',   // research seeker, source hunter, prior-art scout
  IUDEX:      'Iudex',      // critic, examiner, objection finder
  FABER:      'Faber',      // builder of code, scripts, packet tooling
  STRUCTOR:   'Structor',   // packet assembler, schema organizer
  NOTARIUS:   'Notarius',   // hash, manifest, notarization prep
  CUSTOS:     'Custos',     // public/private boundary guard
  ARCHIVISTA: 'Archivista', // lineage, memory continuity, archive integrity
  PROBATOR:   'Probator',   // experiment, validation, test-plan, proof-gap
  REDACTOR:   'Redactor',   // formal paper rendering, publication polish
};

// ═══════════════════════════════════════════════════════════════════════════
//  RUNTIME LAYERS
// ═══════════════════════════════════════════════════════════════════════════

export const RUNTIME_LAYER = {
  NOVA_ROOT:        'NOVA_ROOT',          // root lawful authority and law gate
  MEMORY_RUNTIME:   'MEMORY_RUNTIME',     // canonical append-only research memory
  ACTIVE_STATE:     'ACTIVE_STATE_RUNTIME', // live synthesis, planning, generation
  FOUNDATION_FLOOR: 'FOUNDATION_FLOOR',   // heavy compute, long synthesis, Monte Carlo
  SVA:              'SVA',                // claim validation, evidence classification
  AUTE:             'AUTE',               // experiment and test design
  BOT_FLEET:        'BOT_FLEET',          // repository evidence, workflow proof
};

export default {
  PHI, PHI2, PHI3, PHI4, PHI_INV, PHI_INV2,
  GOLDEN_ANGLE, TWO_PI, PHI_HEARTBEAT_MS,
  EMERGENCE_THRESHOLD, FIBONACCI, PYTHAGORAS_3_4_5, RHETORIC,
  LN2,
  CLAIM_CLASS, CLAIM_RELEASE_RULES, CLAIM_PRIVATE_GATE, CLAIM_PROOF_REQUIRED,
  EVIDENCE_CLASS, EVIDENCE_STRENGTH, CLAIM_MIN_EVIDENCE,
  AUTHORITY_STATE, AUTHORITY_TRANSITIONS,
  LIFECYCLE, LIFECYCLE_TERMINALS,
  SUBSTRATE_TYPE, SURFACE, COHORT_ROLE, RUNTIME_LAYER,
};
