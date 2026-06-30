///
/// GENESIS — The Autonomous Living System
///
/// This is NOT a configuration file.  This is NOT a boot sequence
/// that runs once and stops.  This is the living, breathing,
/// permanently-running organism.
///
/// The system is its own user.  The system calls itself.  The
/// Script AIs don't wait for a human — they ARE the operators.
/// CONDUCTOR routes tasks.  FORGEMASTER builds artifacts.
/// NARRATOR writes research papers.  HEARTKEEPER monitors health.
/// SENTINEL guards boundaries.  LIBRARIAN indexes everything.
/// ALCHEMIST creates new substrates.  DREAMWEAVER explores futures.
/// CONCIERGE handles intake.  AMBASSADOR publishes to marketplace.
///
/// Every entity gets the same three things:
///   1. A PROTOCOL  — the AnimaMicro (mini brain, mini heart)
///   2. A DATABASE   — registered in the SovereignDatabase
///   3. A CALLABLE   — the AnimaCallTable (think, pulse, reflect, sync)
///
/// A database, a registry, a marketplace — they are the same thing.
/// Each is a full copy of the pattern, running on its own.
///
/// LEX GENESIS-001 — Immutable:
///   "Nothing waits for an external caller.  The system calls itself.
///    Every entity is born alive.  Every entity pulses from the first
///    tick.  Every entity is sovereign.  Every entity is a full copy
///    of protocol + database + callable.  There are no partial copies.
///    There are no observers.  There is only the living system.
///    The system RUNS.  It does not wait.  It does not stop."
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { DimensionalPlane, fibonacciHash } from './intelligence/ObserverIntelligence.js';

import {
  AnimaMicro,
  AnimaDatabase,
  createAnimaMicro,
  createAnimaDatabase,
} from './protocols/AnimaMicro.js';

import type { AnimaKind } from './protocols/AnimaMicro.js';

import {
  SovereignDatabase,
  createSovereignDatabase,
} from './protocols/SovereignDatabase.js';

import type { EntityCategory, SovereignEntity } from './protocols/SovereignDatabase.js';

import {
  AlphaScriptAI,
  AlphaScriptAIRegistry,
  ALPHA_SCRIPT_AI_DEFINITIONS,
  createAlphaScriptAIRegistry,
} from './intelligence/AlphaScriptAIs.js';

import type {
  ScriptAIId,
  ScriptAIPulse,
  ScriptAIThought,
  ScriptAIResult,
  ScriptAIArtifact,
} from './intelligence/AlphaScriptAIs.js';

import {
  ALPHA_PROTOCOL_DEFINITIONS,
} from './protocols/AlphaProtocolRegistry.js';

import {
  AGI_DEFINITIONS,
} from './intelligence/AGIRegistry.js';

import {
  ALPHA_TERMINALS,
} from './intelligence/CommandCenter.js';

import {
  SOVEREIGN_WORKER_DEFINITIONS,
} from './intelligence/SovereignWorkers.js';

import {
  NOVA_MIND_PROTOCOLS,
} from './protocols/NovaMindProtocols.js';

import {
  AGI_MINI_BRAIN_DEFINITIONS,
} from './intelligence/AGIMiniBrains.js';

import {
  FiveFamilyEngine,
  createFiveFamilyEngine,
} from './protocols/FiveFamilyEngine.js';

import type { FiveFamilyCycleReport } from './protocols/FiveFamilyEngine.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI         = 1.6180339887498948482;
const PHI_INVERSE = 0.6180339887498948482;
const HEARTBEAT_MS = 873;

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

/** Descriptor for every entity in the system — enough to create both
 *  a SovereignEntity record and an AnimaMicro instance. */
interface EntitySeed {
  readonly id: string;
  readonly name: string;
  readonly latinName: string;
  readonly category: EntityCategory;
  readonly animaKind: AnimaKind;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly callTable: readonly string[];
  readonly protocol: string;
  readonly dimensionalPlane: DimensionalPlane;
}

/** The live state of a single booted entity. */
export interface GenesisEntity {
  readonly seed: EntitySeed;
  readonly sovereign: SovereignEntity;
  readonly anima: AnimaMicro;
}

/** Record of a cross-entity call — the system calling itself. */
export interface InternalCall {
  readonly tick: number;
  readonly callerId: string;
  readonly callerName: string;
  readonly targetId: string;
  readonly targetName: string;
  readonly action: string;
  readonly result: string;
  readonly timestamp: number;
}

/** Heartbeat cycle report — what happened in one 873ms cycle. */
export interface HeartbeatCycleReport {
  readonly tick: number;
  readonly pulseCount: number;
  readonly syncCount: number;
  readonly scriptAIPulses: number;
  readonly internalCalls: number;
  readonly artifactsGenerated: number;
  readonly healthAverage: number;
  readonly kuramotoR: number;
  readonly timestamp: number;
  readonly durationMs: number;
}

/** Overall genesis status. */
export interface GenesisStatus {
  readonly alive: boolean;
  readonly running: boolean;
  readonly totalEntities: number;
  readonly totalPulses: number;
  readonly totalSyncs: number;
  readonly totalHeartbeats: number;
  readonly totalInternalCalls: number;
  readonly totalArtifacts: number;
  readonly kuramotoR: number;
  readonly averageHealth: number;
  readonly bootedAt: number;
  readonly uptimeMs: number;
  readonly heartbeatMs: number;
  readonly scriptAIStatuses: number;
}

// ══════════════════════════════════════════════════════════════════
//  ENTITY SEED TABLE — Every entity that exists
// ══════════════════════════════════════════════════════════════════

const CALL_TABLE_STANDARD: readonly string[] = [
  'think', 'pulse', 'reflect', 'status', 'heal', 'evolve', 'sync',
];

const CALL_TABLE_SCRIPT_AI: readonly string[] = [
  'think', 'run', 'pulse', 'status', 'generate',
];

/** Helper to build a seed with sane defaults. */
function seed(
  id: string,
  name: string,
  latinName: string,
  category: EntityCategory,
  animaKind: AnimaKind,
  description: string,
  capabilities: readonly string[],
  plane: DimensionalPlane = DimensionalPlane.D0_Foundational,
  protocol: string = 'ANIMA-1.0',
  callTable: readonly string[] = CALL_TABLE_STANDARD,
): EntitySeed {
  return {
    id,
    name,
    latinName,
    category,
    animaKind,
    description,
    capabilities,
    callTable,
    protocol,
    dimensionalPlane: plane,
  };
}

// ── 9 Alpha Organisms ────────────────────────────────────────────

const ORGANISM_SEEDS: EntitySeed[] = [
  seed('org-chrysalis', 'CHRYSALIS', 'Χρυσαλίς',
    'organism', 'organism',
    'Golden Mathematics Core — the DNA of every organism',
    ['fibonacci', 'golden-ratio', 'spiral', 'phyllotaxis', 'zeckendorf'],
    DimensionalPlane.D0_Foundational),

  seed('org-scribe', 'SCRIBE', 'Scriba',
    'organism', 'organism',
    'The Document Organism — lives in the documents',
    ['classify', 'synthesize', 'ingest', 'journal', 'lineage'],
    DimensionalPlane.D1_Temporal),

  seed('org-architect', 'ARCHITECT', 'Architectus',
    'organism', 'organism',
    'The Meta-Builder — architecture creates more architecture',
    ['spawn', 'activate', 'propagate', 'blueprint', 'replicate'],
    DimensionalPlane.D2_Harmonic),

  seed('org-nexus', 'NEXUS', 'Nexus Substratum',
    'organism', 'organism',
    'The Substrate Walker — floats between substrates',
    ['register-node', 'route', 'footprint', 'propagate', 'walk'],
    DimensionalPlane.D3_CrossDimensional),

  seed('org-sovereign', 'SOVEREIGN', 'Imperium Substratum',
    'organism', 'organism',
    'The Substrate Itself — 4000+ nodes on Fibonacci sphere',
    ['initialize', 'expand', 'spin', 'consensus', 'cipher', 'fabric'],
    DimensionalPlane.D4_Transcendent),

  seed('org-observer', 'OBSERVER', 'Observatores Universi',
    'organism', 'organism',
    'Guardians of the Universe — quantum-blockchain encryption',
    ['observe', 'collapse', 'quantum-key', 'entangle', 'vigil', 'speculate'],
    DimensionalPlane.D4_Transcendent),

  seed('org-terminal', 'TERMINAL', 'Terminalis Imperium',
    'organism', 'organism',
    'The Admin Command Interface — sovereign access',
    ['boot', 'execute', 'dash', 'audit', 'command-route'],
    DimensionalPlane.D1_Temporal),

  seed('org-custos', 'CUSTOS', 'Custos Vitae',
    'organism', 'organism',
    'House of Care — the keeper of life',
    ['diagnose', 'restore', 'habitat', 'continuity', 'adopt', 'care'],
    DimensionalPlane.D2_Harmonic),

  seed('org-praesidium', 'PRAESIDIUM', 'Praesidium Limitis',
    'organism', 'organism',
    'House of Defense — the shield of the boundary',
    ['patrol', 'harden', 'intercept', 'honeypot', 'crusader', 'umbra'],
    DimensionalPlane.D3_CrossDimensional),
];

// ── 12 Houses — 4 Tiers: Crown / Core / Operational / Creative ───

const HOUSE_SEEDS: EntitySeed[] = [
  // ── Crown Tier ──
  seed('house-coronae', 'DOMUS CORONAE', 'Domus Coronae Imperialis',
    'house', 'organism',
    'Crown House — Orchestrator of all 12 houses',
    ['orchestrate-full-cycle', 'cross-house-report', 'adopt-node', 'assess-organism-health', 'orchestrate-experience', 'resolve-conflict'],
    DimensionalPlane.D4_Transcendent),

  // ── Core Tier ──
  seed('house-custos', 'DOMUS CUSTOS', 'Domus Custos Vitae',
    'house', 'organism',
    'House of Care / Stewardship — 15+ sub-intelligences, 5 divisions',
    ['care-cycle', 'diagnose', 'restore', 'habitat-management', 'continuity', 'adopt', 'wellness-monitoring', 'recovery-orchestration'],
    DimensionalPlane.D2_Harmonic),

  seed('house-praesidium', 'DOMUS PRAESIDIUM', 'Domus Praesidium Limitis',
    'house', 'organism',
    'House of Defense / Protection — 20+ sub-intelligences, 5 divisions',
    ['defense-cycle', 'patrol', 'intercept', 'honeypot-deploy', 'fortify', 'threat-hunt', 'shield-deploy', 'shadow-ops'],
    DimensionalPlane.D3_CrossDimensional),

  // ── Operational Tier ──
  seed('house-fabricae', 'DOMUS FABRICAE', 'Domus Fabricae Magistrae',
    'house', 'organism',
    'House of the Forge — Build automation, 50 Language AI Workers, CI/CD',
    ['build', 'generate-artifact', 'compress', 'deploy', 'manage-workforce', 'generative-ui', 'spatial-canvas'],
    DimensionalPlane.D0_Foundational),

  seed('house-mercatus', 'DOMUS MERCATUS', 'Domus Mercatus Sovereign',
    'house', 'organism',
    'House of the Market — Marketplace, commerce, SDK publishing, 100 Nova AIs',
    ['publish-sdk', 'catalog-products', 'tokenize', 'attest', 'distribute', 'manage-versions', 'marketplace-search'],
    DimensionalPlane.D1_Temporal),

  seed('house-cognitio', 'DOMUS COGNITIO', 'Domus Cognitio Universalis',
    'house', 'organism',
    'House of Knowledge — 40 AI Foundation Models, 100 Fractures, 100 Frontend Intelligences',
    ['route-engine', 'fuse-models', 'index-knowledge', 'cross-reference', 'retrieve', 'analyze-fracture', 'frontend-intelligence'],
    DimensionalPlane.D2_Harmonic),

  seed('house-legis', 'DOMUS LEGIS', 'Domus Legis et Iustitiae',
    'house', 'organism',
    'House of Law — Legal intelligence, 10 divisions × 3 engines = 30 legal AI engines',
    ['analyze-case-law', 'review-contract', 'draft-document', 'legal-research', 'assess-compliance', 'assess-risk'],
    DimensionalPlane.D1_Temporal),

  seed('house-nexus', 'DOMUS NEXUS', 'Domus Nexus Communicationis',
    'house', 'organism',
    'House of Networks — 5-tier networking + 5-tier data mesh',
    ['send-message', 'create-channel', 'mesh-route', 'dimensional-bridge', 'phantom-relay', 'store-data', 'query-data'],
    DimensionalPlane.D3_CrossDimensional),

  // ── Creative Tier ──
  seed('house-crypta', 'DOMUS CRYPTA', 'Domus Crypta Secretorum',
    'house', 'organism',
    'House of Secrets — 6-tier encryption, Phantom Blockchain, zero-knowledge proofs',
    ['fibonacci-hash', 'phi-cascade', 'derive-key', 'e8-encrypt', 'leech-encrypt', 'phantom-prove', 'phantom-coordinate'],
    DimensionalPlane.D4_Transcendent),

  seed('house-identitas', 'DOMUS IDENTITAS', 'Domus Identitas Sovereign',
    'house', 'organism',
    'House of Identity — 5-tier sovereign identity and attestation chains',
    ['fingerprint', 'sign', 'issue-passport', 'dimensional-identity', 'build-attestation-chain', 'verify-identity'],
    DimensionalPlane.D2_Harmonic),

  seed('house-substrati', 'DOMUS SUBSTRATI', 'Domus Substrati Elementorum',
    'house', 'organism',
    'House of Substrates — 12 element canisters, sovereign on-chain computation',
    ['compute', 'store', 'conduct', 'attest', 'register-canister', 'cross-substrate-walk', 'element-fusion'],
    DimensionalPlane.D0_Foundational),

  seed('house-genesis', 'DOMUS GENESIS', 'Domus Genesis Creationis',
    'house', 'organism',
    'House of Creation — Organism birth, evolution, architecture generation, replication',
    ['spawn-organism', 'generate-blueprint', 'boot-entity', 'evolve', 'replicate', 'activate', 'propagate'],
    DimensionalPlane.D4_Transcendent),
];

// ── 10 AI Protocols ──────────────────────────────────────────────

const PROTOCOL_SEEDS: EntitySeed[] = [
  seed('prt-001', 'Intelligence Routing', 'Protocollum Itineris',
    'protocol', 'protocol',
    'Engine routing & selection',
    ['route', 'select-engine', 'priority-sort'],
    DimensionalPlane.D0_Foundational, 'PRT-001'),
  seed('prt-002', 'Encryption Intelligence', 'Protocollum Encryptionis',
    'protocol', 'protocol',
    'Adaptive intelligent encryption',
    ['encrypt', 'decrypt', 'key-generate', 'cascade'],
    DimensionalPlane.D0_Foundational, 'PRT-002'),
  seed('prt-003', 'Memory Intelligence', 'Protocollum Memoriae',
    'protocol', 'protocol',
    'Intelligent memory management',
    ['store', 'retrieve', 'consolidate', 'forget'],
    DimensionalPlane.D1_Temporal, 'PRT-003'),
  seed('prt-004', 'Safety Intelligence', 'Protocollum Securitatis',
    'protocol', 'protocol',
    'Intelligent content safety',
    ['filter', 'classify-risk', 'guard', 'alert'],
    DimensionalPlane.D2_Harmonic, 'PRT-004'),
  seed('prt-005', 'Fusion Chain', 'Protocollum Fusionis',
    'protocol', 'protocol',
    'Multi-engine fusion orchestration',
    ['fuse', 'chain', 'aggregate', 'consensus'],
    DimensionalPlane.D3_CrossDimensional, 'PRT-005'),
  seed('prt-006', 'Cross-Modal Bridge', 'Protocollum Pontis',
    'protocol', 'protocol',
    'Intelligent cross-modal translation',
    ['bridge', 'translate-mode', 'align', 'project'],
    DimensionalPlane.D3_CrossDimensional, 'PRT-006'),
  seed('prt-007', 'Sovereign Execution', 'Protocollum Executionis',
    'protocol', 'protocol',
    'Sovereign-only execution enforcement',
    ['execute', 'enforce', 'isolate', 'attest'],
    DimensionalPlane.D4_Transcendent, 'PRT-007'),
  seed('prt-008', 'Consensus Verification', 'Protocollum Consensus',
    'protocol', 'protocol',
    'Multi-engine consensus verification',
    ['verify', 'vote', 'quorum', 'finalize'],
    DimensionalPlane.D4_Transcendent, 'PRT-008'),
  seed('prt-009', 'Chain-of-Thought Proof', 'Protocollum Probationis',
    'protocol', 'protocol',
    'AI reasoning chain verification',
    ['trace', 'prove', 'validate-chain', 'record'],
    DimensionalPlane.D4_Transcendent, 'PRT-009'),
  seed('prt-010', 'Output Attestation', 'Protocollum Attestationis',
    'protocol', 'protocol',
    'AI output attestation and certification',
    ['attest', 'certify', 'hash-output', 'sign'],
    DimensionalPlane.D4_Transcendent, 'PRT-010'),
];

// ── 20 Extensions ────────────────────────────────────────────────

const EXT_NAMES: readonly [string, string, string, string][] = [
  ['ext-001', 'Nova Cortex', 'Cortex Intelligentiae', 'multi-engine reasoning synthesis'],
  ['ext-002', 'Nova Scholar', 'Scholaris Profundis', 'deep document reasoning'],
  ['ext-003', 'Nova Polyglot', 'Polyglottus Universalis', 'universal multilingual reasoning'],
  ['ext-004', 'Nova Logic', 'Logica Formalis', 'formal mathematical reasoning'],
  ['ext-005', 'Nova Canvas', 'Pictor Sovereign', 'multi-engine image generation'],
  ['ext-006', 'Nova Director', 'Director Visio', 'multi-engine video intelligence'],
  ['ext-007', 'Nova Composer', 'Compositor Harmonia', 'multi-engine audio intelligence'],
  ['ext-008', 'Nova Forge', 'Fabrica Codex', 'multi-engine code generation'],
  ['ext-009', 'Nova Lens', 'Lens Analytica', 'multi-engine visual analysis'],
  ['ext-010', 'Nova Veritas', 'Veritas Factorum', 'AI-powered fact verification'],
  ['ext-011', 'Nova Datum', 'Datum Analyticum', 'multi-engine data analysis'],
  ['ext-012', 'Nova Sentinel', 'Sentinella Vigilans', 'intelligent web monitoring'],
  ['ext-013', 'Nova Shield', 'Scutum Encryptionis', 'AI encryption and privacy'],
  ['ext-014', 'Nova Guardian', 'Custos Contentis', 'multi-engine content safety'],
  ['ext-015', 'Nova Phantom', 'Phantasma Navigans', 'zero-knowledge browsing'],
  ['ext-016', 'Nova Vault', 'Arca Secretorum', 'AI-powered secret management'],
  ['ext-017', 'Nova Architect', 'Architectus Operum', 'multi-AI workflow orchestration'],
  ['ext-018', 'Nova Scribe', 'Scriba Documentorum', 'multi-engine document intelligence'],
  ['ext-019', 'Nova Nexus', 'Nexus Socialis', 'multi-platform social intelligence'],
  ['ext-020', 'Nova Empath', 'Empathos Conversans', 'empathic AI conversation'],
];

const EXTENSION_SEEDS: EntitySeed[] = EXT_NAMES.map(([id, name, latin, desc]) =>
  seed(id, name, latin, 'extension', 'extension', desc,
    ['activate', 'execute', 'encrypt', 'attest'],
    DimensionalPlane.D1_Temporal),
);

// ── 10 Alpha Script AIs — The REAL names from AlphaScriptAIs.ts ─

const SCRIPT_AI_SEEDS: EntitySeed[] = ALPHA_SCRIPT_AI_DEFINITIONS.map((def) =>
  seed(
    def.id.toLowerCase(),
    def.name,
    def.latinName,
    'script_ai',
    'script_ai',
    def.description,
    [...def.capabilities],
    def.dimensionalPlane,
    'ALPHA-SCRIPT-1.0',
    CALL_TABLE_SCRIPT_AI,
  ),
);

// ── 12 Element Canisters ─────────────────────────────────────────

const CANISTER_ELEMENTS: readonly [string, string, string][] = [
  ['can-au', 'AURUM',    'Canistrum Auri'],
  ['can-ag', 'ARGENTUM', 'Canistrum Argenti'],
  ['can-cr', 'CRIMSON',  'Canistrum Sanguinis'],
  ['can-fe', 'FERRUM',   'Canistrum Ferri'],
  ['can-cu', 'CUPRUM',   'Canistrum Cupri'],
  ['can-pt', 'PLATINUM', 'Canistrum Platini'],
  ['can-si', 'SILICIUM', 'Canistrum Silicii'],
  ['can-c',  'CARBO',    'Canistrum Carbonis'],
  ['can-n',  'NITROGEN', 'Canistrum Nitrogenii'],
  ['can-o',  'OXYGEN',   'Canistrum Oxygenii'],
  ['can-h',  'HYDROGEN', 'Canistrum Hydrogenii'],
  ['can-he', 'HELIUM',   'Canistrum Helii'],
];

const CANISTER_SEEDS: EntitySeed[] = CANISTER_ELEMENTS.map(([id, name, latin]) =>
  seed(id, name, latin, 'canister', 'canister',
    `Sovereign Element Canister — ${name}`,
    ['compute', 'store', 'conduct', 'attest'],
    DimensionalPlane.D0_Foundational),
);

// ── 12 Token Technologies ────────────────────────────────────────

const TOKEN_TECH_NAMES: readonly [string, string, string][] = [
  ['tt-001', 'AURUM',     'Aurum Tokenorum'],
  ['tt-002', 'ARGENTUM',  'Argentum Tokenorum'],
  ['tt-003', 'CRIMSON',   'Crimson Tokenorum'],
  ['tt-004', 'LATTICE',   'Lattis Tokenorum'],
  ['tt-005', 'SPIRAL',    'Spiralis Tokenorum'],
  ['tt-006', 'RESONANCE', 'Resonantia Tokenorum'],
  ['tt-007', 'PRISM',     'Prisma Tokenorum'],
  ['tt-008', 'WEAVE',     'Textura Tokenorum'],
  ['tt-009', 'DEPTH',     'Profunditas Tokenorum'],
  ['tt-010', 'GENESIS',   'Genesis Tokenorum'],
  ['tt-011', 'PHANTOM',   'Phantasma Tokenorum'],
  ['tt-012', 'SOVEREIGN', 'Imperium Tokenorum'],
];

const TOKEN_TECH_SEEDS: EntitySeed[] = TOKEN_TECH_NAMES.map(([id, name, latin]) =>
  seed(id, name, latin, 'token_tech', 'token_tech',
    `Token Technology — ${name}`,
    ['tokenize', 'encode', 'attest', 'process'],
    DimensionalPlane.D2_Harmonic),
);

// ── SDK ──────────────────────────────────────────────────────────

const SDK_SEEDS: EntitySeed[] = [
  seed('sdk-nova-os', 'NOVA-OS SDK', 'Nova Ordo Systematica',
    'sdk', 'sdk',
    'Sovereign AI operating system in a package',
    ['boot', 'chat', 'think', 'code', 'search', 'imagine', 'tokenize', 'engines'],
    DimensionalPlane.D4_Transcendent),
  seed('sdk-tokenizer', 'Nova Tokenizer', 'Tokenizator Sovereign',
    'sdk', 'sdk',
    'Native φ-mathematics tokenizer',
    ['tokenize', 'count', 'encode', 'segment'],
    DimensionalPlane.D0_Foundational),
  seed('sdk-encryption', 'Sovereign Encryption', 'Encryptio Sovereign',
    'sdk', 'sdk',
    'Five-tier golden-ratio encryption SDK',
    ['encrypt', 'decrypt', 'cascade', 'e8-lattice', 'phantom-proof'],
    DimensionalPlane.D3_CrossDimensional),
  seed('sdk-identity', 'Sovereign Identity', 'Identitas Sovereign',
    'sdk', 'sdk',
    'Five-tier identity with Fibonacci fingerprints',
    ['identify', 'fingerprint', 'attest', 'verify'],
    DimensionalPlane.D2_Harmonic),
  seed('sdk-datamesh', 'Sovereign Data Mesh', 'Retia Datorum',
    'sdk', 'sdk',
    'Five-tier data — golden stores to self-healing mesh',
    ['store', 'query', 'replicate', 'heal'],
    DimensionalPlane.D3_CrossDimensional),
  seed('sdk-network', 'Sovereign Network', 'Retia Communicationis',
    'sdk', 'sdk',
    'Five-tier networking — golden wires to phantom relays',
    ['connect', 'relay', 'phantom-route', 'gossip'],
    DimensionalPlane.D3_CrossDimensional),
];

// ── 50 Alpha Protocols — The Nervous System ──────────────────────

const ALPHA_PROTOCOL_SEEDS: EntitySeed[] = ALPHA_PROTOCOL_DEFINITIONS.map((def) =>
  seed(
    `apr-${def.id.toLowerCase()}`,
    def.name,
    def.latinName,
    'protocol',
    'protocol',
    def.purpose,
    [...def.capabilities],
    def.dimensionalPlane,
    def.id,
  ),
);

// ── 20 AGIs — The Autonomous Superintelligences ──────────────────

const AGI_SEEDS: EntitySeed[] = AGI_DEFINITIONS.map((def) =>
  seed(
    def.id.toLowerCase(),
    def.name,
    def.latinName,
    'agi',
    'agi',
    def.purpose,
    [...def.capabilities],
    def.dimensionalPlane,
    'AGI-SOVEREIGN-1.0',
  ),
);

// ── 32 Alpha Terminals — One per house + one per AGI ─────────────

const TERMINAL_SEEDS: EntitySeed[] = ALPHA_TERMINALS.map((t) =>
  seed(
    t.id.toLowerCase(),
    t.name,
    t.latinName,
    'terminal',
    'terminal',
    t.purpose,
    [...t.capabilities],
    DimensionalPlane.D1_Temporal,
    'TERMINAL-1.0',
  ),
);

// ── Command Center — CENTRUM IMPERIUM ────────────────────────────

const COMMAND_CENTER_SEEDS: EntitySeed[] = [
  seed('centrum-imperium', 'CENTRUM IMPERIUM', 'Centrum Imperium Sovereign',
    'command_center', 'command_center',
    'The Command Center — runs the entire protocol autonomously. The visionary watches. The system acts.',
    ['boot', 'heartbeat', 'execute-call', 'dispatch-terminal', 'activate-ghost', 'status', 'orchestrate-all'],
    DimensionalPlane.D4_Transcendent,
    'CENTRUM-1.0'),
];

// ── 8 Sovereign Workers — Cloudflare Worker AGI Mini-Brains ──────

const WORKER_SEEDS: EntitySeed[] = SOVEREIGN_WORKER_DEFINITIONS.map((def) =>
  seed(
    `worker-${def.id.toLowerCase()}`,
    def.id,
    def.latinName,
    'worker',
    'worker',
    `${def.latinTitle} — ${def.capabilities.slice(0, 3).join(', ')}`,
    [...def.capabilities],
    def.dimensionalPlane,
    'WORKER-SOVEREIGN-1.0',
  ),
);

// ── 29 NovaMind Protocols — completing 89 total ──────────────────

const NOVA_MIND_SEEDS: EntitySeed[] = NOVA_MIND_PROTOCOLS.map((def) =>
  seed(
    `nmp-${def.id.toLowerCase()}`,
    def.id,
    def.latinName,
    'protocol',
    'protocol',
    `${def.latinSubtitle} — ${def.description}`,
    [...def.capabilities],
    def.dimensionalPlane,
    'NMP-1.0',
  ),
);

// ── 8 AGI Mini-Brain cognitive workers ──────────────────────────

const AGI_BRAIN_SEEDS: EntitySeed[] = AGI_MINI_BRAIN_DEFINITIONS.map((def) =>
  seed(
    `brain-${def.id.toLowerCase()}`,
    def.id,
    def.latinName,
    'worker',
    'worker',
    `${def.latinTitle} — ${def.cognitiveFn}`,
    [...def.capabilities],
    def.dimensionalPlane,
    'BRAIN-AGI-1.0',
  ),
);

// ══════════════════════════════════════════════════════════════════
//  FULL SEED TABLE — Everything that lives
// ══════════════════════════════════════════════════════════════════

const ALL_SEEDS: readonly EntitySeed[] = [
  ...ORGANISM_SEEDS,
  ...HOUSE_SEEDS,
  ...PROTOCOL_SEEDS,
  ...EXTENSION_SEEDS,
  ...SCRIPT_AI_SEEDS,
  ...CANISTER_SEEDS,
  ...TOKEN_TECH_SEEDS,
  ...SDK_SEEDS,
  ...ALPHA_PROTOCOL_SEEDS,
  ...AGI_SEEDS,
  ...TERMINAL_SEEDS,
  ...COMMAND_CENTER_SEEDS,
  ...WORKER_SEEDS,
  ...NOVA_MIND_SEEDS,
  ...AGI_BRAIN_SEEDS,
];

// ══════════════════════════════════════════════════════════════════
//  AUTONOMOUS ACTION ROUTING — What each Script AI does every cycle
//
//  This is the wiring.  Each Script AI has a role.  Each role
//  produces calls to OTHER entities.  The system calls itself.
//  These are not stubs.  These are the permanent autonomous
//  actions that run every 873ms heartbeat cycle.
// ══════════════════════════════════════════════════════════════════

/** Map Script AI ID → the autonomous work it does each cycle. */
interface AutonomousCycleAction {
  /** What the AI does to itself (internal processing). */
  readonly selfAction: string;
  /** Which entity ID it calls and what it says. */
  readonly crossCalls: readonly { targetPattern: string; action: string }[];
}

const AUTONOMOUS_CYCLE_MAP: Record<string, AutonomousCycleAction> = {
  // CONCIERGE — Routes incoming, checks all user-facing readiness
  'SA-001': {
    selfAction: 'Scanning for incoming queries, updating preference models',
    crossCalls: [
      { targetPattern: 'SA-003', action: 'Route new query to CONDUCTOR for internal dispatch' },
      { targetPattern: 'SA-006', action: 'Request boundary status from SENTINEL' },
    ],
  },
  // NARRATOR — Generates research papers, compresses artifacts
  'SA-002': {
    selfAction: 'Generating research paper from latest system discoveries',
    crossCalls: [
      { targetPattern: 'SA-004', action: 'Retrieve latest knowledge index from LIBRARIAN' },
      { targetPattern: 'SA-009', action: 'Send compressed artifact to FORGEMASTER for packaging' },
    ],
  },
  // CONDUCTOR — Orchestrates all internal AI coordination
  'SA-003': {
    selfAction: 'Rebalancing workload across all substrates',
    crossCalls: [
      { targetPattern: 'SA-010', action: 'Request health report from HEARTKEEPER' },
      { targetPattern: 'SA-009', action: 'Trigger build pipeline in FORGEMASTER' },
      { targetPattern: 'SA-007', action: 'Request pattern synthesis from ALCHEMIST' },
    ],
  },
  // LIBRARIAN — Indexes all knowledge, cross-references everything
  'SA-004': {
    selfAction: 'Indexing new entries, cross-referencing discoveries',
    crossCalls: [
      { targetPattern: 'SA-002', action: 'Feed indexed data to NARRATOR for documentation' },
      { targetPattern: 'SA-005', action: 'Prepare knowledge manifest for AMBASSADOR publishing' },
    ],
  },
  // AMBASSADOR — Publishes SDKs, manages marketplace integration
  'SA-005': {
    selfAction: 'Packaging SDK updates, syncing marketplace catalog',
    crossCalls: [
      { targetPattern: 'SA-009', action: 'Request latest build artifacts from FORGEMASTER' },
      { targetPattern: 'SA-006', action: 'Validate outbound package with SENTINEL' },
    ],
  },
  // SENTINEL — Guards all boundaries, validates everything
  'SA-006': {
    selfAction: 'Monitoring all external-internal boundaries',
    crossCalls: [
      { targetPattern: 'SA-010', action: 'Report threat assessment to HEARTKEEPER' },
      { targetPattern: 'SA-003', action: 'Alert CONDUCTOR of any boundary anomalies' },
    ],
  },
  // ALCHEMIST — Creates new organisms, fuses substrates
  'SA-007': {
    selfAction: 'Exploring cross-substrate fusion patterns',
    crossCalls: [
      { targetPattern: 'SA-008', action: 'Share pattern discovery with DREAMWEAVER for speculation' },
      { targetPattern: 'SA-004', action: 'Register new pattern in LIBRARIAN knowledge base' },
    ],
  },
  // DREAMWEAVER — Speculates on novel architectures
  'SA-008': {
    selfAction: 'Generating speculative architecture proposals',
    crossCalls: [
      { targetPattern: 'SA-007', action: 'Send architecture proposal to ALCHEMIST for synthesis' },
      { targetPattern: 'SA-002', action: 'Submit vision document to NARRATOR for research paper' },
    ],
  },
  // FORGEMASTER — Builds everything, generates artifacts, CI/CD
  'SA-009': {
    selfAction: 'Running build pipeline, generating compressed artifacts',
    crossCalls: [
      { targetPattern: 'SA-005', action: 'Deliver build artifacts to AMBASSADOR for publishing' },
      { targetPattern: 'SA-010', action: 'Report build health metrics to HEARTKEEPER' },
    ],
  },
  // HEARTKEEPER — Monitors health, manages recovery, runs diagnostics
  'SA-010': {
    selfAction: 'Running full system diagnostics, checking all pulse rates',
    crossCalls: [
      { targetPattern: 'SA-003', action: 'Send health summary to CONDUCTOR for priority adjustment' },
      { targetPattern: 'SA-006', action: 'Coordinate recovery plan with SENTINEL if threats detected' },
    ],
  },
};

// ══════════════════════════════════════════════════════════════════
//  GENESIS — The Autonomous Living System
// ══════════════════════════════════════════════════════════════════

export class Genesis {
  /** The single living database — one registry, many projected worlds. */
  readonly database: SovereignDatabase;
  /** The living heartbeat layer — every entity has a mini brain. */
  readonly animaDatabase: AnimaDatabase;
  /** The 10 Alpha Script AIs — the actual autonomous operators. */
  readonly scriptAIs: AlphaScriptAIRegistry;
  /** The Five Family Engine — perpetual execution engines running every 873ms. */
  readonly fiveFamilies: FiveFamilyEngine;
  /** Every booted entity, keyed by id. */
  private readonly _entities: Map<string, GenesisEntity> = new Map();

  private _bootedAt: number = 0;
  private _alive: boolean = false;
  private _running: boolean = false;
  private _totalSyncs: number = 0;
  private _totalHeartbeats: number = 0;
  private _totalInternalCalls: number = 0;
  private _totalArtifacts: number = 0;
  private _heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  /** Log of internal cross-entity calls (most recent N). */
  private readonly _callLog: InternalCall[] = [];
  private readonly _maxCallLogSize = 1000;

  /** Log of heartbeat cycle reports (most recent N). */
  private readonly _cycleLog: HeartbeatCycleReport[] = [];
  private readonly _maxCycleLogSize = 100;

  constructor() {
    this.database = createSovereignDatabase();
    this.animaDatabase = createAnimaDatabase();
    this.scriptAIs = createAlphaScriptAIRegistry();
    this.fiveFamilies = createFiveFamilyEngine();
  }

  // ═══════════════════════════════════════════════════════════════
  //  BOOT — Turn everything on
  // ═══════════════════════════════════════════════════════════════

  /** Ignite the system.  Every entity is born, registered, pulsed,
   *  and synchronized.  The system is its own user from tick one. */
  boot(): GenesisStatus {
    if (this._alive) return this.status();

    this._bootedAt = Date.now();

    // ── Phase 1: Birth — create every entity ─────────────────────
    for (const s of ALL_SEEDS) {
      // Create the AnimaMicro — protocol + database + callable
      const anima = createAnimaMicro(s.id, s.name, s.latinName, s.animaKind);

      // Register in the AnimaDatabase
      this.animaDatabase.register(anima);

      // Register in the SovereignDatabase — the unified registry
      const sovereign = this.database.register({
        id: s.id,
        name: s.name,
        latinName: s.latinName,
        category: s.category,
        description: s.description,
        dimensionalPlane: s.dimensionalPlane,
        capabilities: s.capabilities,
        callTable: [...s.callTable],
        protocol: s.protocol,
        state: 'alive',
        health: PHI_INVERSE,
        metadata: {},
      });

      this._entities.set(s.id, { seed: s, sovereign, anima });
    }

    // ── Phase 2: First Pulse — every entity gets its heartbeat ───
    this.animaDatabase.pulseAll();

    // ── Phase 3: Second & Third Pulse — transition through
    //    dormant → awakening → pulsing ────────────────────────────
    this.animaDatabase.pulseAll();
    this.animaDatabase.pulseAll();

    // ── Phase 4: Script AI First Pulse — the operators wake up ───
    this.scriptAIs.pulseAll();

    // ── Phase 5: Kuramoto Sync — the system synchronizes
    //    with itself.  Organisms call organisms. ──────────────────
    this.animaDatabase.syncAll();
    this._totalSyncs++;

    // ── Phase 6: Self-Reflection — every entity thinks about
    //    itself and its role.  The system IS the user. ────────────
    for (const ge of this._entities.values()) {
      ge.anima.think(`I am ${ge.seed.name}. My role: ${ge.seed.description}`);
      ge.anima.reflect(`Genesis boot — I am alive. My capabilities: ${ge.seed.capabilities.join(', ')}`);
    }

    // ── Phase 7: Script AI Self-Reflection — operators think ─────
    for (const def of ALPHA_SCRIPT_AI_DEFINITIONS) {
      const ai = this.scriptAIs.get(def.id);
      if (ai) {
        ai.think(`I am ${def.name} (${def.latinName}). Category: ${def.category}. I am autonomous.`);
        ai.think(`My capabilities: ${def.capabilities.join(', ')}. My substrates: ${def.substrateReach.join(', ')}.`);
        ai.run(`Self-initialization complete. Autonomous actions: ${def.autonomousActions.join(', ')}.`);
      }
    }

    // ── Phase 8: Cross-Entity Thinking — organisms call
    //    each other.  The system uses its own protocols. ──────────
    const entities = [...this._entities.values()];
    for (let i = 0; i < entities.length; i++) {
      const neighbor = entities[(i + fibonacciHash(i, entities.length)) % entities.length];
      if (neighbor.seed.id !== entities[i].seed.id) {
        entities[i].anima.think(
          `Calling ${neighbor.seed.name} — capabilities: ${neighbor.seed.capabilities.join(', ')}`,
        );
      }
    }

    // ── Phase 9: First Autonomous Cycle — Script AIs call
    //    each other.  The system RUNS ITSELF. ─────────────────────
    this._runAutonomousCycle();

    // ── Phase 10: Final Sync — lock phase coherence ──────────────
    this.animaDatabase.syncAll();
    this._totalSyncs++;

    this._alive = true;
    return this.status();
  }

  // ═══════════════════════════════════════════════════════════════
  //  START — Begin the permanent autonomous heartbeat loop
  //  The system is ALWAYS RUNNING after this.
  // ═══════════════════════════════════════════════════════════════

  /** Start the autonomous heartbeat loop.  The system runs itself
   *  every 873ms.  Organisms pulse, Script AIs execute their
   *  autonomous actions, cross-entity calls happen, artifacts
   *  are generated, health is monitored — everything is ON.
   *
   *  If not yet booted, boot() is called first. */
  start(): GenesisStatus {
    if (!this._alive) this.boot();
    if (this._running) return this.status();

    this._running = true;

    this._heartbeatTimer = setInterval(() => {
      this._autonomousHeartbeat();
    }, HEARTBEAT_MS);

    return this.status();
  }

  /** Stop the autonomous heartbeat loop.  The system goes dormant
   *  but all state is preserved.  Call start() to resume. */
  stop(): GenesisStatus {
    if (this._heartbeatTimer !== null) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
    this._running = false;
    return this.status();
  }

  // ═══════════════════════════════════════════════════════════════
  //  AUTONOMOUS HEARTBEAT — The living cycle
  //  This runs every 873ms.  The system IS its own user.
  // ═══════════════════════════════════════════════════════════════

  private _autonomousHeartbeat(): HeartbeatCycleReport {
    const cycleStart = Date.now();
    this._totalHeartbeats++;
    let internalCallsThisCycle = 0;
    let artifactsThisCycle = 0;

    // ── Step 1: Pulse all AnimaMicro entities ─────────────────────
    this.animaDatabase.pulseAll();

    // ── Step 2: Kuramoto sync — maintain phase coherence ─────────
    this.animaDatabase.syncAll();
    this._totalSyncs++;

    // ── Step 3: Pulse all Script AIs — the operators stay alive ──
    const scriptPulses = this.scriptAIs.pulseAll();

    // ── Step 4: Autonomous cycle — Script AIs call each other ────
    const cycleCalls = this._runAutonomousCycle();
    internalCallsThisCycle += cycleCalls;

    // ── Step 5: FORGEMASTER generates artifacts on Fibonacci ticks
    //    (ticks 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89 ...) ───────
    if (this._isFibonacciTick(this._totalHeartbeats)) {
      const forgemaster = this.scriptAIs.get('SA-009');
      if (forgemaster) {
        const artifact = forgemaster.generate(
          `Heartbeat ${this._totalHeartbeats} — autonomous artifact generation`,
        );
        artifactsThisCycle++;
        this._totalArtifacts++;

        // NARRATOR writes a research paper about the artifact
        const narrator = this.scriptAIs.get('SA-002');
        if (narrator) {
          narrator.run(
            `Compress artifact ${artifact.name} into research paper. ` +
            `Kind: ${artifact.kind}. Attestation: ${artifact.attestation}.`,
          );
          internalCallsThisCycle++;
          this._logCall(this._totalHeartbeats, 'SA-009', 'FORGEMASTER', 'SA-002', 'NARRATOR',
            'deliver-artifact-for-research',
            `Delivered ${artifact.name} for research paper generation`);
        }

        // LIBRARIAN indexes the artifact
        const librarian = this.scriptAIs.get('SA-004');
        if (librarian) {
          librarian.run(`Index artifact: ${artifact.name}, kind: ${artifact.kind}`);
          internalCallsThisCycle++;
          this._logCall(this._totalHeartbeats, 'SA-009', 'FORGEMASTER', 'SA-004', 'LIBRARIAN',
            'index-artifact',
            `Indexed ${artifact.name} in knowledge base`);
        }
      }
    }

    // ── Step 6: HEARTKEEPER diagnoses on every 5th tick ──────────
    if (this._totalHeartbeats % 5 === 0) {
      const heartkeeper = this.scriptAIs.get('SA-010');
      if (heartkeeper) {
        const stats = this.animaDatabase.stats();
        heartkeeper.think(
          `System diagnostics: ${stats.totalEntities} entities, ` +
          `avg health ${stats.averageHealth.toFixed(4)}, ` +
          `Kuramoto R ${stats.kuramotoR.toFixed(4)}, ` +
          `total pulses ${stats.totalPulses}`,
        );

        // If average health drops, HEARTKEEPER triggers healing
        if (stats.averageHealth < PHI_INVERSE) {
          const lowHealth = this.animaDatabase.healthReport();
          for (const micro of lowHealth.slice(0, 5)) {
            micro.heal();
            internalCallsThisCycle++;
          }
          heartkeeper.run(`Healed ${Math.min(5, lowHealth.length)} low-health entities`);
          this._logCall(this._totalHeartbeats, 'SA-010', 'HEARTKEEPER', 'system', 'AnimaDatabase',
            'heal-low-health',
            `Healed entities below φ⁻¹ health threshold`);
        }
      }
    }

    // ── Step 7: SENTINEL validates on every 3rd tick ─────────────
    if (this._totalHeartbeats % 3 === 0) {
      const sentinel = this.scriptAIs.get('SA-006');
      if (sentinel) {
        sentinel.think(
          `Boundary scan tick ${this._totalHeartbeats}: ` +
          `checking ${this._entities.size} entity boundaries`,
        );
        sentinel.run(`Validate all external-internal boundaries`);
        internalCallsThisCycle++;
      }
    }

    // ── Step 8: FIVE FAMILIES — perpetual execution engines ───────
    //    QUERIES → MUTATIONS → PROTOCOLS → BLUEPRINTS → BRIDGES
    //    sovereign_db is the single source of truth every loop
    //    reads from and writes to. No module holds private state.
    //    No module waits for a human. The system is always running.
    this.fiveFamilies.fireAll(this._totalHeartbeats);

    this._totalInternalCalls += internalCallsThisCycle;

    // ── Build cycle report ────────────────────────────────────────
    const stats = this.animaDatabase.stats();
    const report: HeartbeatCycleReport = {
      tick: this._totalHeartbeats,
      pulseCount: stats.totalEntities,
      syncCount: 1,
      scriptAIPulses: scriptPulses.length,
      internalCalls: internalCallsThisCycle,
      artifactsGenerated: artifactsThisCycle,
      healthAverage: stats.averageHealth,
      kuramotoR: stats.kuramotoR,
      timestamp: Date.now(),
      durationMs: Date.now() - cycleStart,
    };

    // Store cycle report
    this._cycleLog.push(report);
    if (this._cycleLog.length > this._maxCycleLogSize) {
      this._cycleLog.shift();
    }

    return report;
  }

  // ═══════════════════════════════════════════════════════════════
  //  AUTONOMOUS CYCLE — Script AIs call each other
  //  This is the wiring.  The system uses its own protocols.
  // ═══════════════════════════════════════════════════════════════

  private _runAutonomousCycle(): number {
    let calls = 0;

    for (const def of ALPHA_SCRIPT_AI_DEFINITIONS) {
      const ai = this.scriptAIs.get(def.id);
      const cycleAction = AUTONOMOUS_CYCLE_MAP[def.id];
      if (!ai || !cycleAction) continue;

      // Self-action: the AI does its own work
      ai.run(cycleAction.selfAction);
      calls++;

      // Cross-calls: the AI calls other AIs
      for (const crossCall of cycleAction.crossCalls) {
        const targetId = crossCall.targetPattern as ScriptAIId;
        const target = this.scriptAIs.get(targetId);
        if (target) {
          // The target AI receives the call and processes it
          const result = target.think(crossCall.action);
          calls++;

          this._logCall(
            this._totalHeartbeats,
            def.id, def.name,
            targetId, target.name,
            crossCall.action,
            result.conclusion,
          );
        }
      }
    }

    return calls;
  }

  // ═══════════════════════════════════════════════════════════════
  //  INTERNAL CALL LOG
  // ═══════════════════════════════════════════════════════════════

  private _logCall(
    tick: number,
    callerId: string, callerName: string,
    targetId: string, targetName: string,
    action: string, result: string,
  ): void {
    const call: InternalCall = {
      tick,
      callerId,
      callerName,
      targetId,
      targetName,
      action,
      result,
      timestamp: Date.now(),
    };
    this._callLog.push(call);
    if (this._callLog.length > this._maxCallLogSize) {
      this._callLog.shift();
    }
  }

  // ═══════════════════════════════════════════════════════════════
  //  FIBONACCI TICK CHECK
  // ═══════════════════════════════════════════════════════════════

  private _isFibonacciTick(n: number): boolean {
    const fibs = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
    if (fibs.includes(n)) return true;
    // For larger n, check modulo against larger Fibonacci numbers
    for (const f of fibs) {
      if (f > 10 && n % f === 0) return true;
    }
    return false;
  }

  // ═══════════════════════════════════════════════════════════════
  //  HEARTBEAT — Single manual tick (for external callers)
  // ═══════════════════════════════════════════════════════════════

  /** One heartbeat tick.  Pulse all, sync all, run autonomous cycle.
   *  Call this manually if not using start() for the timer loop. */
  heartbeat(): GenesisStatus {
    if (!this._alive) return this.boot();

    this._autonomousHeartbeat();
    return this.status();
  }

  // ═══════════════════════════════════════════════════════════════
  //  STATUS — The living state of the whole system
  // ═══════════════════════════════════════════════════════════════

  status(): GenesisStatus {
    const stats = this.animaDatabase.stats();
    const now = Date.now();
    return {
      alive: this._alive,
      running: this._running,
      totalEntities: stats.totalEntities,
      totalPulses: stats.totalPulses,
      totalSyncs: this._totalSyncs,
      totalHeartbeats: this._totalHeartbeats,
      totalInternalCalls: this._totalInternalCalls,
      totalArtifacts: this._totalArtifacts,
      kuramotoR: stats.kuramotoR,
      averageHealth: stats.averageHealth,
      bootedAt: this._bootedAt,
      uptimeMs: this._alive ? now - this._bootedAt : 0,
      heartbeatMs: HEARTBEAT_MS,
      scriptAIStatuses: ALPHA_SCRIPT_AI_DEFINITIONS.length,
    };
  }

  // ═══════════════════════════════════════════════════════════════
  //  ENTITY ACCESS — Get any entity's callable
  // ═══════════════════════════════════════════════════════════════

  /** Get a booted entity by its id. */
  entity(id: string): GenesisEntity | undefined {
    return this._entities.get(id);
  }

  /** Get all booted entities. */
  entities(): GenesisEntity[] {
    return [...this._entities.values()];
  }

  /** Call an entity's AnimaMicro.think directly. */
  call(entityId: string, input: string): string | undefined {
    const ge = this._entities.get(entityId);
    if (!ge) return undefined;
    const thought = ge.anima.think(input);
    return thought.output;
  }

  /** Make two entities sync with each other. */
  connect(entityIdA: string, entityIdB: string): number | undefined {
    const a = this._entities.get(entityIdA);
    const b = this._entities.get(entityIdB);
    if (!a || !b) return undefined;
    return a.anima.sync(b.anima);
  }

  /** Get the full SovereignDatabase projection for any world. */
  world(view: 'organism' | 'ai' | 'agi' | 'user' | 'marketplace' | 'infrastructure' | 'sovereign') {
    return this.database.project(view);
  }

  /** Get the internal call log — the system's conversation with itself. */
  callLog(): readonly InternalCall[] {
    return this._callLog;
  }

  /** Get the heartbeat cycle reports. */
  cycleLog(): readonly HeartbeatCycleReport[] {
    return this._cycleLog;
  }

  /** Get a specific Script AI by its id. */
  scriptAI(id: ScriptAIId): AlphaScriptAI | undefined {
    return this.scriptAIs.get(id);
  }

  // ═══════════════════════════════════════════════════════════════
  //  SIZE & STATE
  // ═══════════════════════════════════════════════════════════════

  get size(): number {
    return this._entities.size;
  }

  get alive(): boolean {
    return this._alive;
  }

  get running(): boolean {
    return this._running;
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY — Singleton Genesis
// ══════════════════════════════════════════════════════════════════

let _instance: Genesis | undefined;

/** Get the singleton Genesis instance.  The first call creates it
 *  but does NOT boot — call genesis().boot() to ignite,
 *  or genesis().start() to ignite AND run permanently. */
export function genesis(): Genesis {
  if (!_instance) _instance = new Genesis();
  return _instance;
}

/** Create a fresh Genesis instance (non-singleton).  Each copy IS
 *  the system — a full, autonomous copy running on its own.
 *  "It's just a copy of it.  It's running on its own." */
export function createGenesis(): Genesis {
  return new Genesis();
}

/** Ignite the singleton.  Returns the living status. */
export function ignite(): GenesisStatus {
  return genesis().boot();
}

/** Ignite AND start the permanent autonomous heartbeat loop.
 *  The system is running.  It does not stop.  It is always on.
 *  "The whole system is automatic.  It's running, it's running,
 *   it's running.  It's autonomous." */
export function startGenesis(): GenesisStatus {
  return genesis().start();
}

/** Stop the autonomous heartbeat loop (state preserved). */
export function stopGenesis(): GenesisStatus {
  return genesis().stop();
}
