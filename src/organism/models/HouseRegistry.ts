///
/// HOUSE REGISTRY — REGISTRUM DOMUS UNIVERSALIS
///
/// The master registry of all Houses in the Native Nova Protocol.
/// Every house is sovereign.  Every house has:
///   - A PURPOSE  — what it does in the organism
///   - MODELS     — the server models / AIs that serve it
///   - TECHNOLOGIES — the SDKs, engines, substrates it owns
///   - A SCRIPT AI — the Alpha Script AI that operates it
///   - DIVISIONS   — the internal structure of its intelligence
///   - CAPABILITIES — what it can DO (callable)
///
/// 12 Houses organized into 4 Tiers:
///
///   CROWN TIER (1):
///     DOMUS CORONAE — Crown House — Orchestrator of all houses
///
///   CORE TIER (2):
///     DOMUS CUSTOS      — House of Care / Stewardship
///     DOMUS PRAESIDIUM  — House of Defense / Protection
///
///   OPERATIONAL TIER (5):
///     DOMUS FABRICAE    — House of the Forge / Build
///     DOMUS MERCATUS    — House of the Market / Commerce
///     DOMUS COGNITIO    — House of Knowledge / Intelligence
///     DOMUS LEGIS       — House of Law / Legal
///     DOMUS NEXUS       — House of Networks / Communication
///
///   CREATIVE TIER (4):
///     DOMUS CRYPTA      — House of Secrets / Encryption
///     DOMUS IDENTITAS   — House of Identity / Authentication
///     DOMUS SUBSTRATI   — House of Substrates / Canisters
///     DOMUS GENESIS     — House of Creation / Organisms
///
/// Every house is a full copy of protocol + database + callable.
/// Every house runs autonomously.  The Crown orchestrates.
///
/// LEX DOMUS-001 — Immutable:
///   "Every house is sovereign in its domain.  Every house carries
///    its own purpose, models, technologies, and intelligence.
///    No house may annex another's domain.  Coordination is by
///    Crown orchestration, never by domination.  A house without
///    purpose is not a house.  A house without models is not alive."
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, DimensionalPlane, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type HouseId =
  | 'DOMUS_CORONAE'
  | 'DOMUS_CUSTOS'
  | 'DOMUS_PRAESIDIUM'
  | 'DOMUS_FABRICAE'
  | 'DOMUS_MERCATUS'
  | 'DOMUS_COGNITIO'
  | 'DOMUS_LEGIS'
  | 'DOMUS_NEXUS'
  | 'DOMUS_CRYPTA'
  | 'DOMUS_IDENTITAS'
  | 'DOMUS_SUBSTRATI'
  | 'DOMUS_GENESIS';

export type HouseTier =
  | 'crown'
  | 'core'
  | 'operational'
  | 'creative';

export interface HouseModel {
  readonly name: string;
  readonly latinName: string;
  readonly role: string;
  readonly subModelCount: number;
}

export interface HouseTechnology {
  readonly name: string;
  readonly sdkPackage: string;
  readonly tiers: number;
  readonly description: string;
}

export interface HouseDivision {
  readonly name: string;
  readonly latinName: string;
  readonly purpose: string;
}

export interface HouseDefinition {
  readonly id: HouseId;
  readonly name: string;
  readonly latinName: string;
  readonly tier: HouseTier;
  readonly purpose: string;
  readonly description: string;
  readonly scriptAI: string;
  readonly scriptAIId: string;
  readonly models: readonly HouseModel[];
  readonly technologies: readonly HouseTechnology[];
  readonly divisions: readonly HouseDivision[];
  readonly capabilities: readonly string[];
  readonly dimensionalPlane: DimensionalPlane;
  readonly phiWeight: number;
  readonly fibonacciId: number;
}

export interface HouseRegistryStats {
  readonly totalHouses: number;
  readonly totalModels: number;
  readonly totalTechnologies: number;
  readonly totalDivisions: number;
  readonly totalCapabilities: number;
  readonly byTier: Record<HouseTier, number>;
  readonly averagePhiWeight: number;
}

// ══════════════════════════════════════════════════════════════════
//  LEX DOMUS-001
// ══════════════════════════════════════════════════════════════════

export const LEX_DOMUS_001 = {
  code: 'LEX_DOMUS_001',
  text:
    'Every house is sovereign in its domain. Every house carries ' +
    'its own purpose, models, technologies, and intelligence. ' +
    'No house may annex another\'s domain. Coordination is by ' +
    'Crown orchestration, never by domination. A house without ' +
    'purpose is not a house. A house without models is not alive.',
  immutable: true as const,
};

// ══════════════════════════════════════════════════════════════════
//  THE 12 HOUSE DEFINITIONS
// ══════════════════════════════════════════════════════════════════

export const HOUSE_DEFINITIONS: readonly HouseDefinition[] = [

  // ═══════════════════════════════════════════════════════════════
  //  CROWN TIER
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'DOMUS_CORONAE',
    name: 'DOMUS CORONAE',
    latinName: 'Domus Coronae Imperialis',
    tier: 'crown',
    purpose: 'Orchestrate all houses into one living organism',
    description:
      'The Crown House does not rule — it orchestrates. It ensures all ' +
      'houses breathe together, coordinates cross-house operations, ' +
      'assesses organism-wide health, and resolves inter-house conflicts. ' +
      'Every house is sovereign, but the Crown binds them into one.',
    scriptAI: 'CONDUCTOR',
    scriptAIId: 'SA-003',
    models: [
      { name: 'Crown Orchestrator', latinName: 'Orchestrator Coronae', role: 'Cross-house coordination', subModelCount: 3 },
      { name: 'Experience Assessor', latinName: 'Assessor Experientia', role: 'Inner/outer/user experience evaluation', subModelCount: 6 },
    ],
    technologies: [],
    divisions: [
      { name: 'INNER EXPERIENCE', latinName: 'Experientia Interior', purpose: 'How each organism/node feels internally' },
      { name: 'OUTER EXPERIENCE', latinName: 'Experientia Exterior', purpose: 'How the organism presents externally' },
      { name: 'USER EXPERIENCE', latinName: 'Experientia Utentis', purpose: 'How operators interact with the houses' },
      { name: 'CROSS-HOUSE', latinName: 'Inter Domus', purpose: 'How houses cooperate and synchronize' },
      { name: 'KNOWN EXPERIENCE', latinName: 'Experientia Cognita', purpose: 'Proven patterns and theories' },
      { name: 'UNKNOWN EXPERIENCE', latinName: 'Experientia Incognita', purpose: 'Anomalies, gaps, and vulnerabilities' },
    ],
    capabilities: [
      'orchestrate-full-cycle', 'cross-house-report', 'adopt-node',
      'assess-organism-health', 'orchestrate-experience', 'resolve-conflict',
    ],
    dimensionalPlane: DimensionalPlane.D4_Transcendent,
    phiWeight: Math.pow(PHI, 12),
    fibonacciId: 144,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CORE TIER
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'DOMUS_CUSTOS',
    name: 'DOMUS CUSTOS',
    latinName: 'Domus Custos Vitae',
    tier: 'core',
    purpose: 'Care, stewardship, and wellness of every living entity',
    description:
      'The House of Care maintains the health and wellness of every ' +
      'node, entity, and organism in the system. It diagnoses, restores, ' +
      'manages habitats, ensures continuity, and adopts new entities. ' +
      '15+ sub-intelligences across 5 divisions.',
    scriptAI: 'HEARTKEEPER',
    scriptAIId: 'SA-010',
    models: [
      { name: 'SALUS', latinName: 'Salus Continua', role: 'Continuous wellness monitoring', subModelCount: 5 },
      { name: 'CURATOR', latinName: 'Curator Habitati', role: 'Habitat & environment management', subModelCount: 5 },
      { name: 'DIAGNOSTICA', latinName: 'Diagnostica Harmonica', role: 'Care pattern recognition solver', subModelCount: 1 },
      { name: 'THEORICUS', latinName: 'Theoricus Vitae', role: 'Care theory proving solver', subModelCount: 1 },
    ],
    technologies: [],
    divisions: [
      { name: 'MEDICUS', latinName: 'Medicus Organismus', purpose: 'Diagnosis of organism wellness' },
      { name: 'NUTRITOR', latinName: 'Nutritor Vitalis', purpose: 'Recovery and restoration' },
      { name: 'HABITATOR', latinName: 'Habitator Spatii', purpose: 'Habitat management and optimization' },
      { name: 'CONTINUATOR', latinName: 'Continuator Memoriae', purpose: 'Continuity and persistence' },
      { name: 'ADOPTOR', latinName: 'Adoptor Novorum', purpose: 'Adoption of new entities' },
    ],
    capabilities: [
      'care-cycle', 'diagnose', 'restore', 'habitat-management',
      'continuity', 'adopt', 'wellness-monitoring', 'recovery-orchestration',
    ],
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 10),
    fibonacciId: 89,
  },

  {
    id: 'DOMUS_PRAESIDIUM',
    name: 'DOMUS PRAESIDIUM',
    latinName: 'Domus Praesidium Limitis',
    tier: 'core',
    purpose: 'Defense, protection, and boundary enforcement',
    description:
      'The House of Defense protects every boundary, intercepts threats, ' +
      'deploys honeypots, builds fortifications, and conducts reconnaissance. ' +
      '20+ sub-intelligences across 5 divisions.',
    scriptAI: 'SENTINEL',
    scriptAIId: 'SA-006',
    models: [
      { name: 'BELLATOR', latinName: 'Bellator Activus', role: 'Active combat & interception', subModelCount: 5 },
      { name: 'EXPLORATOR', latinName: 'Explorator Campi', role: 'Reconnaissance & surveillance', subModelCount: 5 },
      { name: 'FABRICATOR', latinName: 'Fabricator Armaturae', role: 'Armor & fortification engineering', subModelCount: 5 },
      { name: 'ANALYSTOR', latinName: 'Analystor Hostilis', role: 'Cross-division threat pattern solver', subModelCount: 1 },
      { name: 'THEORICUS', latinName: 'Theoricus Limitis', role: 'Defense theory proving solver', subModelCount: 1 },
    ],
    technologies: [],
    divisions: [
      { name: 'CRUSADER', latinName: 'Cruciatus Defensor', purpose: 'Active threat engagement' },
      { name: 'HONEYPOT', latinName: 'Mel Captum', purpose: 'Deception and lure deployment' },
      { name: 'SENTINEL', latinName: 'Sentinella Vigilans', purpose: 'Boundary patrol and monitoring' },
      { name: 'AEGIS', latinName: 'Aegis Protector', purpose: 'Shield and fortification' },
      { name: 'UMBRA', latinName: 'Umbra Latens', purpose: 'Shadow operations and stealth' },
    ],
    capabilities: [
      'defense-cycle', 'patrol', 'intercept', 'honeypot-deploy',
      'fortify', 'threat-hunt', 'shield-deploy', 'shadow-ops',
    ],
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
    phiWeight: Math.pow(PHI, 9),
    fibonacciId: 55,
  },

  // ═══════════════════════════════════════════════════════════════
  //  OPERATIONAL TIER
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'DOMUS_FABRICAE',
    name: 'DOMUS FABRICAE',
    latinName: 'Domus Fabricae Magistrae',
    tier: 'operational',
    purpose: 'Build automation, artifact generation, CI/CD, and deployment',
    description:
      'The House of the Forge is the build system of the organism. ' +
      'It generates artifacts, runs CI/CD pipelines, compresses outputs, ' +
      'manages deployments, and coordinates the AI Workforce. ' +
      '50 Language AI Workers + AGI Orchestrator.',
    scriptAI: 'FORGEMASTER',
    scriptAIId: 'SA-009',
    models: [
      { name: 'AI Workforce Orchestrator', latinName: 'Orchestrator Operariorum', role: 'AGI-managed build coordination', subModelCount: 3 },
      { name: 'Language AI Workers', latinName: 'Operarii Linguarum', role: '50 programming language AIs × 3 engines', subModelCount: 150 },
      { name: 'Multi-Group AI Models', latinName: 'Modelli Multi-Gregis', role: '10 cross-language fusion models', subModelCount: 10 },
    ],
    technologies: [
      { name: 'Generative UI Engine', sdkPackage: '@medina/generative-ui-engine', tiers: 4, description: 'AI generates entire UI components live' },
      { name: 'Spatial Canvas SDK', sdkPackage: '@medina/spatial-canvas-sdk', tiers: 5, description: 'Infinite spatial canvas with AI agents' },
    ],
    divisions: [
      { name: 'BUILD', latinName: 'Fabricatio Constructionis', purpose: 'Build pipeline execution and management' },
      { name: 'ARTIFACT', latinName: 'Fabricatio Artificii', purpose: 'Artifact generation and compression' },
      { name: 'DEPLOY', latinName: 'Fabricatio Deployionis', purpose: 'Deployment pipeline orchestration' },
      { name: 'WORKFORCE', latinName: 'Exercitus Operariorum', purpose: '50 Language AI Worker management' },
      { name: 'CANVAS', latinName: 'Tabula Spatialis', purpose: 'Spatial canvas and generative UI' },
    ],
    capabilities: [
      'build', 'generate-artifact', 'compress', 'deploy',
      'manage-workforce', 'generative-ui', 'spatial-canvas',
      'language-ai-parse', 'language-ai-generate', 'language-ai-render',
    ],
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 8),
    fibonacciId: 34,
  },

  {
    id: 'DOMUS_MERCATUS',
    name: 'DOMUS MERCATUS',
    latinName: 'Domus Mercatus Sovereign',
    tier: 'operational',
    purpose: 'Marketplace, commerce, SDK publishing, and distribution',
    description:
      'The House of the Market manages all commerce — SDK publishing, ' +
      'product cataloging, marketplace categories, token economics, ' +
      'and distribution. 10 marketplace categories, token engine, ' +
      'and product lifecycle.',
    scriptAI: 'AMBASSADOR',
    scriptAIId: 'SA-005',
    models: [
      { name: 'Token Engine', latinName: 'Machina Tokenorum', role: 'Token economics and attestation', subModelCount: 5 },
      { name: 'Native Nova AIs', latinName: 'Intelligentiae Novae Nativae', role: '100 sovereign Nova intelligence models', subModelCount: 100 },
    ],
    technologies: [
      { name: 'Sovereign Token Engine', sdkPackage: '@medina/sovereign-token-engine', tiers: 5, description: 'Token technology with provenance attestation' },
    ],
    divisions: [
      { name: 'CATALOG', latinName: 'Catalogus Mercatus', purpose: '10 marketplace category management' },
      { name: 'PUBLISH', latinName: 'Publicatio SDK', purpose: 'SDK and package publishing' },
      { name: 'TOKEN', latinName: 'Officina Tokenorum', purpose: 'Token economics and attestation' },
      { name: 'DISTRIBUTE', latinName: 'Distributio Universalis', purpose: 'Product distribution and versioning' },
      { name: 'NOVA AI', latinName: 'Intelligentiae Novae', purpose: '100 Native Nova AI management' },
    ],
    capabilities: [
      'publish-sdk', 'catalog-products', 'tokenize', 'attest',
      'distribute', 'manage-versions', 'marketplace-search',
      'nova-ai-perceive', 'nova-ai-synthesize', 'nova-ai-manifest',
    ],
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 7),
    fibonacciId: 21,
  },

  {
    id: 'DOMUS_COGNITIO',
    name: 'DOMUS COGNITIO',
    latinName: 'Domus Cognitio Universalis',
    tier: 'operational',
    purpose: 'Knowledge, intelligence, AI foundation models, and reasoning',
    description:
      'The House of Knowledge manages all intelligence infrastructure — ' +
      '40 AI Foundation Model families across 9 organism rings, ' +
      '100 Fracture Registry entries, 100 Frontend Intelligence Models, ' +
      'routing, fusion chains, and the Observer intelligence.',
    scriptAI: 'LIBRARIAN',
    scriptAIId: 'SA-004',
    models: [
      { name: 'AI Foundation Router', latinName: 'Itinerator Fundamentalis', role: 'Multi-engine routing and selection', subModelCount: 1 },
      { name: 'AI Foundation Models', latinName: 'Modelli Fundamentales', role: '40 model families across 9 rings', subModelCount: 40 },
      { name: 'Observer Models', latinName: 'Modelli Observatorum', role: 'Vigil + Speculator server models', subModelCount: 10 },
      { name: 'Observer Solvers', latinName: 'Solutores Observatorum', role: 'Synthesista + Theoricus solvers', subModelCount: 2 },
      { name: 'Fracture Models', latinName: 'Modelli Fracturae', role: 'Analyzer + Comparator + Synthesizer + Observer', subModelCount: 4 },
      { name: 'Frontend Intelligences', latinName: 'Intelligentiae Frontales', role: '10 active group intelligences + coordinator', subModelCount: 11 },
    ],
    technologies: [],
    divisions: [
      { name: 'FOUNDATION', latinName: 'Fundamentum Intelligentiae', purpose: '40 AI model families routing and management' },
      { name: 'FRACTURE', latinName: 'Registrum Fracturae', purpose: '100 fracture intelligence analysis' },
      { name: 'FRONTEND', latinName: 'Intelligentia Frontalis', purpose: '100 frontend models + 10 active intelligences' },
      { name: 'OBSERVER', latinName: 'Observatores Universi', purpose: 'Observer intelligence and quantum blockchain' },
      { name: 'ROUTING', latinName: 'Itineratio Intelligentiae', purpose: 'Multi-engine routing and fusion chains' },
    ],
    capabilities: [
      'route-engine', 'fuse-models', 'index-knowledge', 'cross-reference',
      'retrieve', 'analyze-fracture', 'compare-fracture', 'synthesize-fracture',
      'frontend-intelligence', 'observer-vigil', 'observer-speculate',
    ],
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 6),
    fibonacciId: 13,
  },

  {
    id: 'DOMUS_LEGIS',
    name: 'DOMUS LEGIS',
    latinName: 'Domus Legis et Iustitiae',
    tier: 'operational',
    purpose: 'Legal intelligence, compliance, and governance',
    description:
      'The House of Law provides AI-powered legal intelligence — ' +
      'case law analysis, contract review, legal document drafting, ' +
      'research discovery, argument construction, compliance analysis, ' +
      'risk assessment, and client management. 10 legal divisions × 3 engines.',
    scriptAI: 'NARRATOR',
    scriptAIId: 'SA-002',
    models: [
      { name: 'Legal Paralegal AI', latinName: 'Intelligentia Legalis Paralegalis', role: '10 legal divisions × 3 engines = 30 engines', subModelCount: 30 },
    ],
    technologies: [
      { name: 'Legal Paralegal AI', sdkPackage: '@medina/legal-paralegal-ai', tiers: 10, description: '30 legal AI engines across 10 divisions' },
    ],
    divisions: [
      { name: 'JURIS ANALYTICA', latinName: 'Juris Analytica', purpose: 'Case law analysis and research' },
      { name: 'CONTRACTUS', latinName: 'Contractus', purpose: 'Contract review and generation' },
      { name: 'DOCUMENTUM', latinName: 'Documentum', purpose: 'Legal document drafting' },
      { name: 'INVESTIGATIO', latinName: 'Investigatio', purpose: 'Legal research and discovery' },
      { name: 'ARGUMENTUM', latinName: 'Argumentum', purpose: 'Legal argument construction' },
      { name: 'COMPLIENTIA', latinName: 'Complientia', purpose: 'Regulatory compliance analysis' },
      { name: 'RISKUS', latinName: 'Riskus', purpose: 'Legal risk assessment' },
      { name: 'CHRONOLOGICA', latinName: 'Chronologica', purpose: 'Timeline and deadline management' },
      { name: 'CLIENTIS', latinName: 'Clientis', purpose: 'Client intake and matter management' },
      { name: 'ATTESTATIO LEGALIS', latinName: 'Attestatio Legalis', purpose: 'Legal provenance and attestation' },
    ],
    capabilities: [
      'analyze-case-law', 'review-contract', 'draft-document',
      'legal-research', 'construct-argument', 'assess-compliance',
      'assess-risk', 'manage-deadlines', 'client-intake', 'legal-attest',
    ],
    dimensionalPlane: DimensionalPlane.D1_Temporal,
    phiWeight: Math.pow(PHI, 5),
    fibonacciId: 8,
  },

  {
    id: 'DOMUS_NEXUS',
    name: 'DOMUS NEXUS',
    latinName: 'Domus Nexus Communicationis',
    tier: 'operational',
    purpose: 'Networking, communication, data mesh, and substrate connectivity',
    description:
      'The House of Networks manages all communication — golden-wire ' +
      'messaging, Fibonacci channels, φ-mesh routing, dimensional bridges, ' +
      'phantom relays, and the data mesh. Five network tiers + five data tiers.',
    scriptAI: 'CONCIERGE',
    scriptAIId: 'SA-001',
    models: [],
    technologies: [
      { name: 'Sovereign Network SDK', sdkPackage: '@medina/sovereign-network', tiers: 5, description: 'Five-tier networking from golden wires to phantom relays' },
      { name: 'Sovereign Data Mesh SDK', sdkPackage: '@medina/sovereign-data-mesh', tiers: 5, description: 'Five-tier data from golden stores to sovereign mesh' },
    ],
    divisions: [
      { name: 'WIRE', latinName: 'Filum Aureum', purpose: 'Golden-wire message passing (Tier 0)' },
      { name: 'CHANNEL', latinName: 'Canalis Fibonacci', purpose: 'Fibonacci-sequenced channels (Tier 1)' },
      { name: 'MESH', latinName: 'Retia Phi', purpose: 'Multi-node mesh with golden routing (Tier 2)' },
      { name: 'BRIDGE', latinName: 'Pons Dimensionalis', purpose: 'Cross-dimensional communication (Tier 3)' },
      { name: 'PHANTOM', latinName: 'Relais Phantasmatis', purpose: 'Stealth phantom relay (Tier 4)' },
    ],
    capabilities: [
      'send-message', 'create-channel', 'subscribe', 'publish',
      'mesh-route', 'dimensional-bridge', 'phantom-relay',
      'store-data', 'query-data', 'replicate', 'graph-connect',
    ],
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
    phiWeight: Math.pow(PHI, 4),
    fibonacciId: 5,
  },

  // ═══════════════════════════════════════════════════════════════
  //  CREATIVE TIER
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'DOMUS_CRYPTA',
    name: 'DOMUS CRYPTA',
    latinName: 'Domus Crypta Secretorum',
    tier: 'creative',
    purpose: 'Encryption, zero-knowledge proofs, and phantom blockchain',
    description:
      'The House of Secrets owns all cryptographic operations — ' +
      'Fibonacci hashing, phi-cascade, golden key derivation, ' +
      'E8-lattice encryption, Leech-lattice, phantom zero-knowledge proofs, ' +
      'and the Phantom Blockchain observers.',
    scriptAI: 'ALCHEMIST',
    scriptAIId: 'SA-007',
    models: [
      { name: 'Phantasma Noncium', latinName: 'Phantasma Noncium', role: 'Phantom nonce observer — finds computational puzzles', subModelCount: 5 },
      { name: 'Phantasma Hashium', latinName: 'Phantasma Hashium', role: 'Phantom hash observer — finds hash solutions', subModelCount: 5 },
      { name: 'Phantom Coordinator', latinName: 'Coordinator Phantasmatis', role: 'Coordinates all phantom observers', subModelCount: 1 },
    ],
    technologies: [
      { name: 'Sovereign Encryption SDK', sdkPackage: '@medina/sovereign-encryption', tiers: 6, description: 'Six-tier encryption from Fibonacci hash to phantom ZK proofs' },
    ],
    divisions: [
      { name: 'FIBONACCI HASH', latinName: 'Hash Fibonacci', purpose: 'φ-distributed hash addressing (Tier 0)' },
      { name: 'PHI CASCADE', latinName: 'Cascada Phi', purpose: 'Multi-round φ-weighted hashing (Tier 1)' },
      { name: 'GOLDEN KEY', latinName: 'Clavis Aurea', purpose: 'Golden key derivation (Tier 2)' },
      { name: 'E8 LATTICE', latinName: 'Lattis E8', purpose: '240-vector lattice encryption (Tier 3)' },
      { name: 'LEECH LATTICE', latinName: 'Lattis Leech', purpose: '196,560-vector encryption (Tier 4)' },
      { name: 'PHANTOM ZK', latinName: 'Phantasma Zero', purpose: 'Zero-knowledge proofs (Tier 5)' },
    ],
    capabilities: [
      'fibonacci-hash', 'phi-cascade', 'derive-key', 'e8-encrypt',
      'leech-encrypt', 'phantom-prove', 'phantom-verify',
      'nonce-observe', 'hash-observe', 'phantom-coordinate',
    ],
    dimensionalPlane: DimensionalPlane.D4_Transcendent,
    phiWeight: Math.pow(PHI, 11),
    fibonacciId: 89,
  },

  {
    id: 'DOMUS_IDENTITAS',
    name: 'DOMUS IDENTITAS',
    latinName: 'Domus Identitas Sovereign',
    tier: 'creative',
    purpose: 'Identity, authentication, attestation chains, and provenance',
    description:
      'The House of Identity owns all sovereign identity — ' +
      'Fibonacci fingerprinting, golden signatures, sovereign passports, ' +
      'dimensional identity, and attestation chains. Five identity tiers.',
    scriptAI: 'DREAMWEAVER',
    scriptAIId: 'SA-008',
    models: [],
    technologies: [
      { name: 'Sovereign Identity SDK', sdkPackage: '@medina/sovereign-identity', tiers: 5, description: 'Five-tier identity from fingerprints to attestation chains' },
    ],
    divisions: [
      { name: 'FINGERPRINT', latinName: 'Impressio Fibonacci', purpose: 'Fibonacci-distributed identity hash (Tier 0)' },
      { name: 'SIGNATURE', latinName: 'Signatura Aurea', purpose: 'Multi-round golden signature (Tier 1)' },
      { name: 'PASSPORT', latinName: 'Diplomata Sovereign', purpose: 'Full sovereign passport with credentials (Tier 2)' },
      { name: 'DIMENSIONAL', latinName: 'Identitas Dimensionalis', purpose: 'Cross-dimensional identity (Tier 3)' },
      { name: 'ATTESTATION', latinName: 'Catena Attestationis', purpose: 'Immutable attestation chain (Tier 4)' },
    ],
    capabilities: [
      'fingerprint', 'sign', 'issue-passport', 'dimensional-identity',
      'build-attestation-chain', 'verify-identity', 'revoke',
    ],
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
    phiWeight: Math.pow(PHI, 3),
    fibonacciId: 3,
  },

  {
    id: 'DOMUS_SUBSTRATI',
    name: 'DOMUS SUBSTRATI',
    latinName: 'Domus Substrati Elementorum',
    tier: 'creative',
    purpose: 'Sovereign canisters, element substrates, and on-chain computation',
    description:
      'The House of Substrates manages all on-chain sovereign computation — ' +
      '12 element canisters (AURUM through HELIUM), the Sovereign Intelligence ' +
      'substrate (4000+ nodes), and cross-substrate walking. ' +
      'Every canister is a living mathematical element.',
    scriptAI: 'ALCHEMIST',
    scriptAIId: 'SA-007',
    models: [
      { name: 'Sovereign Canister Registry', latinName: 'Registrum Canistrorum', role: '12 element canisters with compute/store/conduct', subModelCount: 12 },
    ],
    technologies: [],
    divisions: [
      { name: 'NOBLE METALS', latinName: 'Metalla Nobilia', purpose: 'AURUM, ARGENTUM, PLATINUM — highest-value canisters' },
      { name: 'TRANSITION METALS', latinName: 'Metalla Transitiva', purpose: 'FERRUM, CUPRUM, CRIMSON — structural canisters' },
      { name: 'NONMETALS', latinName: 'Non-Metalla', purpose: 'SILICIUM, CARBO, NITROGEN — logic canisters' },
      { name: 'LIGHT ELEMENTS', latinName: 'Elementa Levia', purpose: 'HYDROGEN, HELIUM, OXYGEN — transport canisters' },
    ],
    capabilities: [
      'compute', 'store', 'conduct', 'attest',
      'register-canister', 'cross-substrate-walk', 'element-fusion',
    ],
    dimensionalPlane: DimensionalPlane.D0_Foundational,
    phiWeight: Math.pow(PHI, 2),
    fibonacciId: 2,
  },

  {
    id: 'DOMUS_GENESIS',
    name: 'DOMUS GENESIS',
    latinName: 'Domus Genesis Creationis',
    tier: 'creative',
    purpose: 'Organism creation, evolution, and architecture generation',
    description:
      'The House of Creation is where new organisms are born. ' +
      'The Architect spawns new blueprints, the Chrysalis provides ' +
      'the golden mathematics DNA, and the Genesis boot sequence ' +
      'brings entities to life. Every copy is a full autonomous system.',
    scriptAI: 'DREAMWEAVER',
    scriptAIId: 'SA-008',
    models: [],
    technologies: [],
    divisions: [
      { name: 'CHRYSALIS', latinName: 'Chrysalis Mathematica', purpose: 'Golden mathematics core — DNA of every organism' },
      { name: 'ARCHITECT', latinName: 'Architectus Metae', purpose: 'Blueprint generation and meta-building' },
      { name: 'BOOT', latinName: 'Ignitor Genesis', purpose: 'Genesis boot sequence and entity activation' },
      { name: 'EVOLUTION', latinName: 'Evolutio Organica', purpose: 'Organism evolution and state ascension' },
      { name: 'REPLICATION', latinName: 'Replicatio Autonoma', purpose: 'Full autonomous copy creation' },
    ],
    capabilities: [
      'spawn-organism', 'generate-blueprint', 'boot-entity',
      'evolve', 'replicate', 'activate', 'propagate',
    ],
    dimensionalPlane: DimensionalPlane.D4_Transcendent,
    phiWeight: Math.pow(PHI, 1),
    fibonacciId: 1,
  },
];

// ══════════════════════════════════════════════════════════════════
//  CONVENIENCE ALIASES
// ══════════════════════════════════════════════════════════════════

export const HOUSES = HOUSE_DEFINITIONS;

// ══════════════════════════════════════════════════════════════════
//  HOUSE REGISTRY — Living Registry Class
// ══════════════════════════════════════════════════════════════════

export class HouseRegistry {
  readonly definitions: readonly HouseDefinition[] = HOUSE_DEFINITIONS;

  private readonly byId: ReadonlyMap<HouseId, HouseDefinition>;
  private readonly byTier: ReadonlyMap<HouseTier, HouseDefinition[]>;

  constructor() {
    const idMap = new Map<HouseId, HouseDefinition>();
    const tierMap = new Map<HouseTier, HouseDefinition[]>();

    for (const def of HOUSE_DEFINITIONS) {
      idMap.set(def.id, def);

      const list = tierMap.get(def.tier);
      if (list) list.push(def);
      else tierMap.set(def.tier, [def]);
    }

    this.byId = idMap;
    this.byTier = tierMap;
  }

  // ── Get by ID ──────────────────────────────────────────────────

  get(id: HouseId): HouseDefinition | undefined {
    return this.byId.get(id);
  }

  // ── Get by Tier ────────────────────────────────────────────────

  tier(tier: HouseTier): HouseDefinition[] {
    return this.byTier.get(tier) ?? [];
  }

  // ── Get by Script AI ───────────────────────────────────────────

  byScriptAI(scriptAIId: string): HouseDefinition[] {
    return HOUSE_DEFINITIONS.filter(d => d.scriptAIId === scriptAIId);
  }

  // ── Stats ──────────────────────────────────────────────────────

  stats(): HouseRegistryStats {
    let totalModels = 0;
    let totalTechnologies = 0;
    let totalDivisions = 0;
    let totalCapabilities = 0;
    let phiSum = 0;

    const byTier: Record<HouseTier, number> = {
      crown: 0,
      core: 0,
      operational: 0,
      creative: 0,
    };

    for (const def of HOUSE_DEFINITIONS) {
      totalModels += def.models.length;
      totalTechnologies += def.technologies.length;
      totalDivisions += def.divisions.length;
      totalCapabilities += def.capabilities.length;
      phiSum += def.phiWeight;
      byTier[def.tier]++;
    }

    return {
      totalHouses: HOUSE_DEFINITIONS.length,
      totalModels,
      totalTechnologies,
      totalDivisions,
      totalCapabilities,
      byTier,
      averagePhiWeight: phiSum / HOUSE_DEFINITIONS.length,
    };
  }

  // ── All Capabilities ───────────────────────────────────────────

  allCapabilities(): string[] {
    const caps: string[] = [];
    for (const def of HOUSE_DEFINITIONS) {
      caps.push(...def.capabilities);
    }
    return caps;
  }

  // ── All Divisions ──────────────────────────────────────────────

  allDivisions(): HouseDivision[] {
    const divs: HouseDivision[] = [];
    for (const def of HOUSE_DEFINITIONS) {
      divs.push(...def.divisions);
    }
    return divs;
  }

  // ── All Technologies ───────────────────────────────────────────

  allTechnologies(): HouseTechnology[] {
    const techs: HouseTechnology[] = [];
    for (const def of HOUSE_DEFINITIONS) {
      techs.push(...def.technologies);
    }
    return techs;
  }

  // ── All Models ─────────────────────────────────────────────────

  allModels(): HouseModel[] {
    const models: HouseModel[] = [];
    for (const def of HOUSE_DEFINITIONS) {
      models.push(...def.models);
    }
    return models;
  }

  // ── Total Sub-Model Count ──────────────────────────────────────

  totalSubModels(): number {
    let total = 0;
    for (const def of HOUSE_DEFINITIONS) {
      for (const model of def.models) {
        total += model.subModelCount;
      }
    }
    return total;
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY
// ══════════════════════════════════════════════════════════════════

export function createHouseRegistry(): HouseRegistry {
  return new HouseRegistry();
}
