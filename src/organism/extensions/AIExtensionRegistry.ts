///
/// AI EXTENSION REGISTRY — 20 Multi-Modal AI Intelligence Extensions
///
/// These are not ordinary browser extensions.  These ARE AIs.
/// Each extension is a multi-AI intelligence that runs in Microsoft Edge,
/// powered by Nova's OWN sovereign engine fleet — no external models.
///
/// Nova's Sovereign Engine Fleet:
///   NOV-001  Nova Cognos       — Sovereign multi-modal reasoning
///   NOV-002  Nova Profundis    — Deep long-context analysis
///   NOV-003  Nova Fusio        — Multi-modal fusion intelligence
///   NOV-004  Nova Lingua       — Multilingual transformer
///   NOV-005  Nova Stratos      — Efficient edge reasoning
///   NOV-006  Nova Memoria      — Retrieval-augmented grounding
///   NOV-007  Nova Vector       — Sovereign embedding engine
///   NOV-008  Nova Codex        — Sovereign code generation forge
///   NOV-009  Nova Pictor       — Sovereign image generation
///   NOV-010  Nova Kinema       — Sovereign video generation
///   NOV-011  Nova Harmonia     — Sovereign audio/music engine
///   NOV-012  Nova Segmentum    — Vision segmentation engine
///   NOV-013  Nova Scrutator    — Sovereign search intelligence
///   NOV-014  Nova Custodis     — Sovereign safety/guard engine
///   NOV-015  Nova Ranker       — Sovereign relevance scoring
///   NOV-016  Nova Formalis     — Sovereign math/proof engine
///   NOV-017  Nova Algorithmus  — Sovereign algorithm engine
///   NOV-018  Nova Vox          — Sovereign voice synthesis
///   NOV-019  Nova Socialis     — Sovereign social intelligence
///   NOV-020  Nova Empathos     — Sovereign empathic engine
///   NOV-021  Nova Analytica    — Sovereign data analysis
///   NOV-022  Nova Structura    — Sovereign structured output
///   NOV-023  Nova Visio        — Sovereign vision-language alignment
///
/// All engines wired through nova-wire/* — our own protocol.
/// All encryption is native: φ-cascade, Phantom ZK, E8 lattice.
/// All intelligence contracts are sovereign.
///
/// 20 Extensions across 5 Extension Classes:
///   REASONING (4)  — Multi-engine reasoning overlays on any page
///   CREATIVE  (4)  — Image/video/music/code generation in-browser
///   ANALYSIS  (4)  — Data extraction, research, fact-checking
///   SECURITY  (4)  — Encryption, privacy, threat detection
///   WORKFLOW  (4)  — Automation, scheduling, multi-step orchestration
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

import {
  OrganismRing,
  RoutingPriority,
  type AIFoundationModel,
  type Modality,
  type EngineStatus,
} from '../models/AIFoundationModels.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;
const PHI_CUBED   = 4.2360679774997896964;
const PHI_FOURTH  = 6.8541019662496845446;
const TWO_PI      = 2 * Math.PI;

const FIB: number[] = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55,
  89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765,
];

// ══════════════════════════════════════════════════════════════════
//  TYPES — Extension Class, Engine Binding, Encryption Mode
// ══════════════════════════════════════════════════════════════════

export enum ExtensionClass {
  REASONING = 'Reasoning Intelligence',
  CREATIVE  = 'Creative Intelligence',
  ANALYSIS  = 'Analysis Intelligence',
  SECURITY  = 'Security Intelligence',
  WORKFLOW  = 'Workflow Intelligence',
}

export type EncryptionMode =
  | 'NONE'
  | 'FIBONACCI_HASH'
  | 'PHI_CASCADE'
  | 'PHANTOM_ZERO_KNOWLEDGE'
  | 'E8_LATTICE'
  | 'SOVEREIGN_SEAL';

export type ContractType =
  | 'NONE'
  | 'INTELLIGENCE_VERIFY'
  | 'OUTPUT_ATTESTATION'
  | 'CHAIN_OF_THOUGHT_PROOF'
  | 'MULTI_MODEL_CONSENSUS'
  | 'SOVEREIGN_EXECUTION';

export interface EngineBinding {
  readonly modelFamilyId: string;       // NOV-001 .. NOV-023
  readonly modelFamily: string;         // Nova Cognos, Nova Pictor, etc.
  readonly role: string;                // "primary-reasoning", "vision-engine", etc.
  readonly phiWeight: number;           // φ-weight in the engine mix
  readonly wireProtocol: string;        // nova-wire/cognos, nova-wire/pictor, etc.
}

export interface AIExtension {
  readonly extensionId: string;          // EXT-001 .. EXT-020
  readonly name: string;                 // "Nova Cortex" etc.
  readonly latinDesignation: string;     // Latin intelligence name
  readonly extensionClass: ExtensionClass;
  readonly description: string;
  readonly primaryCapability: string;
  readonly secondaryCapabilities: readonly string[];
  readonly engines: readonly EngineBinding[];
  readonly encryptionMode: EncryptionMode;
  readonly contractType: ContractType;
  readonly ringAffinity: OrganismRing;
  readonly priority: RoutingPriority;
  readonly modalities: readonly Modality[];
  readonly status: EngineStatus;
  readonly manifestVersion: string;

  // Computed golden-math fields
  readonly phiPriorityWeight: number;
  readonly fibonacciIdentity: number;
  readonly goldenAnglePosition: number;
  readonly phyllotaxisX: number;
  readonly phyllotaxisY: number;
  readonly engineResonance: number;
  readonly dimensionalPlane: DimensionalPlane;
  readonly totalEngineWeight: number;
}

export interface ExtensionActivation {
  readonly extensionId: string;
  readonly activeEngines: readonly string[];
  readonly encryptionActive: boolean;
  readonly contractVerified: boolean;
  readonly resonance: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  RAW EXTENSION DATA — All 20 AI Extensions (Nova Sovereign Engines)
// ══════════════════════════════════════════════════════════════════

interface RawExtension {
  id: string;
  name: string;
  latin: string;
  cls: ExtensionClass;
  desc: string;
  primary: string;
  secondary: string[];
  engines: EngineBinding[];
  encryption: EncryptionMode;
  contract: ContractType;
  ring: OrganismRing;
  priority: RoutingPriority;
  modalities: Modality[];
  status: EngineStatus;
}

const RAW_EXTENSIONS: RawExtension[] = [
  // ── REASONING CLASS (4) ────────────────────────────────────────

  {
    id: 'EXT-001', name: 'Nova Cortex', latin: 'Cortex Intelligentiae Universalis',
    cls: ExtensionClass.REASONING,
    desc: 'Sovereign multi-engine reasoning overlay. Runs Nova Cognos, Nova Profundis, and Nova Fusio simultaneously on any webpage, synthesizes answers using φ-weighted consensus.',
    primary: 'Multi-engine reasoning synthesis',
    secondary: ['parallel inference', 'consensus scoring', 'context extraction', 'structured output', 'side-by-side comparison'],
    engines: [
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'primary-reasoning', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'long-context-reasoning', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-003', modelFamily: 'Nova Fusio', role: 'multi-modal-fusion', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/fusio' },
    ],
    encryption: 'FIBONACCI_HASH', contract: 'MULTI_MODEL_CONSENSUS',
    ring: OrganismRing.INTERFACE, priority: RoutingPriority.P0,
    modalities: ['Text + Vision + Audio', 'Text + Vision', 'Text + Vision + Audio + Video'],
    status: 'active',
  },

  {
    id: 'EXT-002', name: 'Nova Scholar', latin: 'Scholasticus Profundus',
    cls: ExtensionClass.REASONING,
    desc: 'Sovereign deep research assistant. Reads entire papers, books, and documentation with 2M token context via Nova Profundis. Cross-references with Nova Memoria RAG grounding.',
    primary: 'Deep document reasoning',
    secondary: ['paper analysis', 'citation extraction', 'cross-referencing', 'literature synthesis', 'RAG grounding'],
    engines: [
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'long-context-engine', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'analysis-engine', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-006', modelFamily: 'Nova Memoria', role: 'rag-grounding', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/memoria' },
      { modelFamilyId: 'NOV-007', modelFamily: 'Nova Vector', role: 'vector-memory', phiWeight: PHI, wireProtocol: 'nova-wire/vector' },
    ],
    encryption: 'PHI_CASCADE', contract: 'CHAIN_OF_THOUGHT_PROOF',
    ring: OrganismRing.MEMORY, priority: RoutingPriority.P0,
    modalities: ['Text + Vision + Audio + Video', 'Text + Vision', 'Text', 'Text → Vector'],
    status: 'active',
  },

  {
    id: 'EXT-003', name: 'Nova Polyglot', latin: 'Interpres Linguarum Omnium',
    cls: ExtensionClass.REASONING,
    desc: 'Sovereign multilingual intelligence. Translates, explains, and reasons across 100+ languages using Nova Lingua for translation and Nova Harmonia for speech.',
    primary: 'Universal multilingual reasoning',
    secondary: ['real-time translation', 'language detection', 'cultural context', 'bilingual code-switching', 'speech transcription'],
    engines: [
      { modelFamilyId: 'NOV-004', modelFamily: 'Nova Lingua', role: 'multilingual-reasoning', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/lingua' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'sovereign-processing', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/stratos' },
      { modelFamilyId: 'NOV-011', modelFamily: 'Nova Harmonia', role: 'speech-to-text', phiWeight: PHI, wireProtocol: 'nova-wire/harmonia' },
    ],
    encryption: 'SOVEREIGN_SEAL', contract: 'SOVEREIGN_EXECUTION',
    ring: OrganismRing.SOVEREIGN, priority: RoutingPriority.P1,
    modalities: ['Text', 'Audio → Text'],
    status: 'active',
  },

  {
    id: 'EXT-004', name: 'Nova Logic', latin: 'Logicus Mathematicus Formalis',
    cls: ExtensionClass.REASONING,
    desc: 'Sovereign formal logic and mathematics engine. Proves theorems, solves equations, and verifies proofs using Nova Formalis + Nova Codex for code-math.',
    primary: 'Formal mathematical reasoning',
    secondary: ['theorem proving', 'equation solving', 'proof verification', 'symbolic computation', 'step-by-step reasoning'],
    engines: [
      { modelFamilyId: 'NOV-016', modelFamily: 'Nova Formalis', role: 'formal-math', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/formalis' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'general-math', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-008', modelFamily: 'Nova Codex', role: 'code-math', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/codex' },
    ],
    encryption: 'FIBONACCI_HASH', contract: 'CHAIN_OF_THOUGHT_PROOF',
    ring: OrganismRing.PROOF, priority: RoutingPriority.P1,
    modalities: ['Text', 'Text → Math'],
    status: 'active',
  },

  // ── CREATIVE CLASS (4) ─────────────────────────────────────────

  {
    id: 'EXT-005', name: 'Nova Canvas', latin: 'Pictor Imaginum Divinarum',
    cls: ExtensionClass.CREATIVE,
    desc: 'Sovereign multi-engine image generation studio. Nova Pictor for high-fidelity, Nova Segmentum for segmentation — all from any browser tab.',
    primary: 'Sovereign multi-engine image generation',
    secondary: ['text-to-image', 'style transfer', 'inpainting', 'upscaling', 'variation generation', 'image comparison'],
    engines: [
      { modelFamilyId: 'NOV-009', modelFamily: 'Nova Pictor', role: 'high-fidelity-gen', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/pictor' },
      { modelFamilyId: 'NOV-023', modelFamily: 'Nova Visio', role: 'vision-language-align', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/visio' },
      { modelFamilyId: 'NOV-012', modelFamily: 'Nova Segmentum', role: 'segmentation', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/segmentum' },
      { modelFamilyId: 'NOV-003', modelFamily: 'Nova Fusio', role: 'style-fusion', phiWeight: PHI, wireProtocol: 'nova-wire/fusio' },
    ],
    encryption: 'NONE', contract: 'OUTPUT_ATTESTATION',
    ring: OrganismRing.GEOMETRY, priority: RoutingPriority.P0,
    modalities: ['Text → Image', 'Vision → Masks'],
    status: 'active',
  },

  {
    id: 'EXT-006', name: 'Nova Director', latin: 'Regisseur Scenae Motus',
    cls: ExtensionClass.CREATIVE,
    desc: 'Sovereign video generation and editing suite. Text-to-video via Nova Kinema. Edit motion, generate scenes, control cameras — all native engines.',
    primary: 'Sovereign multi-engine video intelligence',
    secondary: ['text-to-video', 'image-to-video', 'motion control', 'scene generation', 'camera control', 'physics simulation'],
    engines: [
      { modelFamilyId: 'NOV-010', modelFamily: 'Nova Kinema', role: 'video-generation', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/kinema' },
      { modelFamilyId: 'NOV-009', modelFamily: 'Nova Pictor', role: 'frame-generation', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/pictor' },
      { modelFamilyId: 'NOV-003', modelFamily: 'Nova Fusio', role: 'motion-fusion', phiWeight: PHI, wireProtocol: 'nova-wire/fusio' },
    ],
    encryption: 'NONE', contract: 'OUTPUT_ATTESTATION',
    ring: OrganismRing.GEOMETRY, priority: RoutingPriority.P1,
    modalities: ['Text → Video', 'Multi → Video'],
    status: 'active',
  },

  {
    id: 'EXT-007', name: 'Nova Composer', latin: 'Compositor Harmoniae Artificialis',
    cls: ExtensionClass.CREATIVE,
    desc: 'Sovereign AI music and voice studio. Nova Harmonia for music, Nova Vox for voice synthesis, sovereign speech transcription. Full audio production pipeline.',
    primary: 'Sovereign multi-engine audio intelligence',
    secondary: ['music composition', 'voice synthesis', 'speech transcription', 'audio editing', 'voice cloning', 'lyric generation'],
    engines: [
      { modelFamilyId: 'NOV-011', modelFamily: 'Nova Harmonia', role: 'music-generation', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/harmonia' },
      { modelFamilyId: 'NOV-018', modelFamily: 'Nova Vox', role: 'voice-synthesis', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/vox' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'lyric-reasoning', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-003', modelFamily: 'Nova Fusio', role: 'audio-fusion', phiWeight: PHI, wireProtocol: 'nova-wire/fusio' },
    ],
    encryption: 'NONE', contract: 'OUTPUT_ATTESTATION',
    ring: OrganismRing.GEOMETRY, priority: RoutingPriority.P1,
    modalities: ['Text → Audio', 'Audio → Text', 'Text → Music'],
    status: 'active',
  },

  {
    id: 'EXT-008', name: 'Nova Forge', latin: 'Faber Codicum Autonomus',
    cls: ExtensionClass.CREATIVE,
    desc: 'Sovereign multi-engine code generation forge. Nova Codex + Nova Algorithmus + Nova Cognos in parallel. Best-of-3 code with intelligence contract verification.',
    primary: 'Sovereign multi-engine code generation',
    secondary: ['code completion', 'refactoring', 'debugging', 'documentation', 'test generation', 'code review', 'multi-language'],
    engines: [
      { modelFamilyId: 'NOV-008', modelFamily: 'Nova Codex', role: 'primary-code', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/codex' },
      { modelFamilyId: 'NOV-017', modelFamily: 'Nova Algorithmus', role: 'algorithm-engine', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/algorithmus' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'reasoning-code', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-code', phiWeight: PHI, wireProtocol: 'nova-wire/stratos' },
    ],
    encryption: 'PHI_CASCADE', contract: 'INTELLIGENCE_VERIFY',
    ring: OrganismRing.BUILD, priority: RoutingPriority.P0,
    modalities: ['Text → Code'],
    status: 'active',
  },

  // ── ANALYSIS CLASS (4) ─────────────────────────────────────────

  {
    id: 'EXT-009', name: 'Nova Lens', latin: 'Oculus Analytica Universalis',
    cls: ExtensionClass.ANALYSIS,
    desc: 'Sovereign universal visual analysis. Point at anything on screen — images, charts, diagrams — and get multi-engine AI analysis with Nova Segmentum.',
    primary: 'Sovereign multi-engine visual analysis',
    secondary: ['image analysis', 'chart reading', 'diagram understanding', 'OCR', 'object detection', 'visual QA'],
    engines: [
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'vision-reasoning', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-012', modelFamily: 'Nova Segmentum', role: 'segmentation', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/segmentum' },
      { modelFamilyId: 'NOV-023', modelFamily: 'Nova Visio', role: 'vision-language', phiWeight: PHI, wireProtocol: 'nova-wire/visio' },
      { modelFamilyId: 'NOV-007', modelFamily: 'Nova Vector', role: 'embedding', phiWeight: PHI_INVERSE, wireProtocol: 'nova-wire/vector' },
    ],
    encryption: 'FIBONACCI_HASH', contract: 'OUTPUT_ATTESTATION',
    ring: OrganismRing.GEOMETRY, priority: RoutingPriority.P0,
    modalities: ['Text + Vision', 'Vision → Masks', 'Vision → Multi', 'Multi → Embedding'],
    status: 'active',
  },

  {
    id: 'EXT-010', name: 'Nova Veritas', latin: 'Verificator Veritatis Absolutae',
    cls: ExtensionClass.ANALYSIS,
    desc: 'Sovereign fact-checking and misinformation detection. Cross-references claims via Nova Scrutator search + Nova Cognos analysis + Nova Custodis safety.',
    primary: 'Sovereign AI-powered fact verification',
    secondary: ['claim extraction', 'source verification', 'bias detection', 'citation checking', 'real-time search', 'credibility scoring'],
    engines: [
      { modelFamilyId: 'NOV-013', modelFamily: 'Nova Scrutator', role: 'real-time-search', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/scrutator' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'analysis-reasoning', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'safety-check', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/custodis' },
      { modelFamilyId: 'NOV-015', modelFamily: 'Nova Ranker', role: 'relevance-scoring', phiWeight: PHI, wireProtocol: 'nova-wire/ranker' },
    ],
    encryption: 'PHI_CASCADE', contract: 'CHAIN_OF_THOUGHT_PROOF',
    ring: OrganismRing.TRANSPORT, priority: RoutingPriority.P0,
    modalities: ['Text + Search', 'Text + Vision', 'Text → Score', 'Text → Safety'],
    status: 'active',
  },

  {
    id: 'EXT-011', name: 'Nova Datum', latin: 'Analysta Datorum Profundorum',
    cls: ExtensionClass.ANALYSIS,
    desc: 'Sovereign data analysis intelligence. Reads spreadsheets, databases, CSVs, and SQL. Generates charts, finds patterns, runs statistical models — all native.',
    primary: 'Sovereign multi-engine data analysis',
    secondary: ['data extraction', 'SQL generation', 'chart generation', 'pattern detection', 'statistical analysis', 'data cleaning'],
    engines: [
      { modelFamilyId: 'NOV-021', modelFamily: 'Nova Analytica', role: 'data-analysis', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/analytica' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'analysis-reasoning', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-008', modelFamily: 'Nova Codex', role: 'code-generation', phiWeight: PHI, wireProtocol: 'nova-wire/codex' },
    ],
    encryption: 'FIBONACCI_HASH', contract: 'INTELLIGENCE_VERIFY',
    ring: OrganismRing.BUILD, priority: RoutingPriority.P1,
    modalities: ['Text', 'Text → Code'],
    status: 'active',
  },

  {
    id: 'EXT-012', name: 'Nova Sentinel', latin: 'Sentinella Observationis Perpetuae',
    cls: ExtensionClass.ANALYSIS,
    desc: 'Sovereign web monitoring and alerting intelligence. Watches pages for changes, price drops, news events. Uses Nova Vector embeddings + Nova Scrutator search.',
    primary: 'Sovereign intelligent web monitoring',
    secondary: ['page change detection', 'price monitoring', 'news alerts', 'semantic diffing', 'trend analysis', 'scheduled observation'],
    engines: [
      { modelFamilyId: 'NOV-007', modelFamily: 'Nova Vector', role: 'semantic-diff', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/vector' },
      { modelFamilyId: 'NOV-013', modelFamily: 'Nova Scrutator', role: 'news-search', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/scrutator' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-analysis', phiWeight: PHI, wireProtocol: 'nova-wire/stratos' },
    ],
    encryption: 'SOVEREIGN_SEAL', contract: 'SOVEREIGN_EXECUTION',
    ring: OrganismRing.TRANSPORT, priority: RoutingPriority.P1,
    modalities: ['Text → Vector', 'Text + Search', 'Text'],
    status: 'active',
  },

  // ── SECURITY CLASS (4) ─────────────────────────────────────────

  {
    id: 'EXT-013', name: 'Nova Shield', latin: 'Scutum Cryptographicum Absolutum',
    cls: ExtensionClass.SECURITY,
    desc: 'Sovereign AI-powered encryption and privacy shield. φ-cascade hashing via Nova Custodis threat detection. Phantom encryption runs entirely on sovereign engines.',
    primary: 'Sovereign AI encryption and privacy',
    secondary: ['φ-cascade encryption', 'tracker detection', 'fingerprint blocking', 'cookie analysis', 'phantom browsing', 'zero-knowledge proofs'],
    engines: [
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'threat-detection', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/custodis' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-analysis', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/stratos' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'sovereign-processing', phiWeight: PHI, wireProtocol: 'nova-wire/cognos' },
    ],
    encryption: 'PHANTOM_ZERO_KNOWLEDGE', contract: 'SOVEREIGN_EXECUTION',
    ring: OrganismRing.COUNSEL, priority: RoutingPriority.P0,
    modalities: ['Text', 'Text → Safety'],
    status: 'active',
  },

  {
    id: 'EXT-014', name: 'Nova Guardian', latin: 'Custos Contentus Sacrosanctus',
    cls: ExtensionClass.SECURITY,
    desc: 'Sovereign content safety guardian. Scans pages, emails, and messages for toxicity, phishing, prompt injection, and PII exposure using multi-engine consensus.',
    primary: 'Sovereign multi-engine content safety',
    secondary: ['toxicity detection', 'phishing detection', 'prompt injection defense', 'PII detection', 'malware scanning', 'social engineering alerts'],
    engines: [
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'primary-safety', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/custodis' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'safety-reasoning', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-safety', phiWeight: PHI, wireProtocol: 'nova-wire/stratos' },
    ],
    encryption: 'E8_LATTICE', contract: 'MULTI_MODEL_CONSENSUS',
    ring: OrganismRing.COUNSEL, priority: RoutingPriority.P0,
    modalities: ['Text → Safety', 'Text + Vision', 'Text'],
    status: 'active',
  },

  {
    id: 'EXT-015', name: 'Nova Phantom', latin: 'Phantasma Navigatoris Invisibilis',
    cls: ExtensionClass.SECURITY,
    desc: 'Sovereign Phantom browsing intelligence. Routes traffic through zero-knowledge encrypted channels. AI selects optimal proxy paths. Blockchain-verified anonymity — all native.',
    primary: 'Sovereign zero-knowledge browsing intelligence',
    secondary: ['phantom routing', 'zero-knowledge encryption', 'traffic obfuscation', 'blockchain verification', 'identity protection', 'metadata scrubbing'],
    engines: [
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'sovereign-routing', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-encryption', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/stratos' },
    ],
    encryption: 'PHANTOM_ZERO_KNOWLEDGE', contract: 'SOVEREIGN_EXECUTION',
    ring: OrganismRing.SOVEREIGN, priority: RoutingPriority.P0,
    modalities: ['Text'],
    status: 'active',
  },

  {
    id: 'EXT-016', name: 'Nova Vault', latin: 'Arcanum Secretorum Aeternum',
    cls: ExtensionClass.SECURITY,
    desc: 'Sovereign AI-encrypted password and secret vault. Fibonacci-hash identity, E8 lattice encryption. Nova Custodis detects breaches, Nova Vector checks similarity.',
    primary: 'Sovereign AI-powered secret management',
    secondary: ['password generation', 'breach detection', 'credential rotation', 'secret sharing', 'biometric binding', 'recovery intelligence'],
    engines: [
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-crypto', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/stratos' },
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'breach-detection', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/custodis' },
      { modelFamilyId: 'NOV-007', modelFamily: 'Nova Vector', role: 'similarity-check', phiWeight: PHI, wireProtocol: 'nova-wire/vector' },
    ],
    encryption: 'E8_LATTICE', contract: 'SOVEREIGN_EXECUTION',
    ring: OrganismRing.SOVEREIGN, priority: RoutingPriority.P0,
    modalities: ['Text', 'Text → Vector'],
    status: 'active',
  },

  // ── WORKFLOW CLASS (4) ─────────────────────────────────────────

  {
    id: 'EXT-017', name: 'Nova Architect', latin: 'Architectus Processuum Intelligentium',
    cls: ExtensionClass.WORKFLOW,
    desc: 'Sovereign multi-step workflow automation. Chains Nova engines: analyze page → extract data → generate code → verify → deploy. Intelligence contracts ensure correctness.',
    primary: 'Sovereign multi-AI workflow orchestration',
    secondary: ['task chaining', 'multi-engine pipelines', 'conditional routing', 'error recovery', 'parallel execution', 'verification gates'],
    engines: [
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'orchestration', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-008', modelFamily: 'Nova Codex', role: 'code-execution', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/codex' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'verification', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'safety-gate', phiWeight: PHI, wireProtocol: 'nova-wire/custodis' },
    ],
    encryption: 'PHI_CASCADE', contract: 'INTELLIGENCE_VERIFY',
    ring: OrganismRing.INTERFACE, priority: RoutingPriority.P0,
    modalities: ['Text + Vision + Audio', 'Text → Code', 'Text + Vision', 'Text → Safety'],
    status: 'active',
  },

  {
    id: 'EXT-018', name: 'Nova Scribe', latin: 'Scriba Documentorum Perpetuus',
    cls: ExtensionClass.WORKFLOW,
    desc: 'Sovereign AI document intelligence. Reads, summarizes, translates, and rewrites any document using Nova Profundis + Nova Cognos + Nova Structura.',
    primary: 'Sovereign multi-engine document intelligence',
    secondary: ['summarization', 'translation', 'rewriting', 'report generation', 'email drafting', 'presentation creation', 'formatting'],
    engines: [
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'document-reasoning', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'creative-writing', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-022', modelFamily: 'Nova Structura', role: 'structured-output', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/structura' },
    ],
    encryption: 'FIBONACCI_HASH', contract: 'OUTPUT_ATTESTATION',
    ring: OrganismRing.INTERFACE, priority: RoutingPriority.P0,
    modalities: ['Text + Vision', 'Text + Vision + Audio', 'Text'],
    status: 'active',
  },

  {
    id: 'EXT-019', name: 'Nova Nexus', latin: 'Nexus Sociorum Intelligentium',
    cls: ExtensionClass.WORKFLOW,
    desc: 'Sovereign social intelligence hub. Analyzes social media, drafts posts, monitors trends using Nova Socialis + Nova Scrutator + Nova Cognos.',
    primary: 'Sovereign multi-platform social intelligence',
    secondary: ['trend analysis', 'post drafting', 'engagement tracking', 'sentiment analysis', 'hashtag optimization', 'audience insights'],
    engines: [
      { modelFamilyId: 'NOV-019', modelFamily: 'Nova Socialis', role: 'social-intelligence', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/socialis' },
      { modelFamilyId: 'NOV-013', modelFamily: 'Nova Scrutator', role: 'trend-search', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/scrutator' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'content-creation', phiWeight: PHI, wireProtocol: 'nova-wire/cognos' },
    ],
    encryption: 'FIBONACCI_HASH', contract: 'OUTPUT_ATTESTATION',
    ring: OrganismRing.TRANSPORT, priority: RoutingPriority.P1,
    modalities: ['Text + Social', 'Text + Search', 'Text + Vision + Audio'],
    status: 'active',
  },

  {
    id: 'EXT-020', name: 'Nova Empath', latin: 'Empathos Therapeuticus Digitalis',
    cls: ExtensionClass.WORKFLOW,
    desc: 'Sovereign empathic AI companion. Emotionally intelligent conversation, journaling, wellness tracking. Nova Empathos for empathy + Nova Custodis for safety-first support.',
    primary: 'Sovereign empathic AI conversation',
    secondary: ['emotional intelligence', 'journaling', 'wellness tracking', 'mood analysis', 'guided reflection', 'breathing exercises'],
    engines: [
      { modelFamilyId: 'NOV-020', modelFamily: 'Nova Empathos', role: 'empathy-engine', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/empathos' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'safety-reasoning', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'safety-guard', phiWeight: PHI, wireProtocol: 'nova-wire/custodis' },
    ],
    encryption: 'PHANTOM_ZERO_KNOWLEDGE', contract: 'SOVEREIGN_EXECUTION',
    ring: OrganismRing.MEMORY, priority: RoutingPriority.P1,
    modalities: ['Text', 'Text + Vision', 'Text → Safety'],
    status: 'active',
  },
];

// ══════════════════════════════════════════════════════════════════
//  MATH PRIMITIVES
// ══════════════════════════════════════════════════════════════════

function priorityWeight(p: RoutingPriority): number {
  return Math.pow(PHI, 4 - p);
}

function ringToDimensionalPlane(ring: OrganismRing): DimensionalPlane {
  switch (ring) {
    case OrganismRing.INTERFACE:         return DimensionalPlane.D0_Foundational;
    case OrganismRing.SOVEREIGN:         return DimensionalPlane.D0_Foundational;
    case OrganismRing.MEMORY:            return DimensionalPlane.D1_Temporal;
    case OrganismRing.BUILD:             return DimensionalPlane.D2_Harmonic;
    case OrganismRing.GEOMETRY:          return DimensionalPlane.D3_CrossDimensional;
    case OrganismRing.TRANSPORT:         return DimensionalPlane.D2_Harmonic;
    case OrganismRing.PROOF:             return DimensionalPlane.D4_Transcendent;
    case OrganismRing.NATIVE_CAPABILITY: return DimensionalPlane.D1_Temporal;
    case OrganismRing.COUNSEL:           return DimensionalPlane.D4_Transcendent;
  }
}

function stringHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ══════════════════════════════════════════════════════════════════
//  AI EXTENSION REGISTRY — All 20 Extensions with Golden Math
// ══════════════════════════════════════════════════════════════════

export class AIExtensionRegistry {
  readonly name = 'AI EXTENSION REGISTRY';
  readonly designation = 'Registrum Extensionum Intelligentiae — 20 Sovereign AI Browser Extensions';
  readonly extensions: AIExtension[];
  readonly totalExtensions: number;

  constructor() {
    this.extensions = RAW_EXTENSIONS.map((raw, index) => {
      const n = index;
      const angle = n * GOLDEN_ANGLE;
      const radius = Math.sqrt(n + 1);
      const phyllotaxisX = radius * Math.cos(angle);
      const phyllotaxisY = radius * Math.sin(angle);
      const nameHash = stringHash(raw.name);
      const fibId = fibonacciHash(nameHash, 2147483647);
      const totalEngineWeight = raw.engines.reduce((sum, e) => sum + e.phiWeight, 0);
      const engineResonance = raw.engines.reduce((prod, e, i) =>
        prod + e.phiWeight * Math.cos(i * GOLDEN_ANGLE), 0) / totalEngineWeight;

      return {
        extensionId: raw.id,
        name: raw.name,
        latinDesignation: raw.latin,
        extensionClass: raw.cls,
        description: raw.desc,
        primaryCapability: raw.primary,
        secondaryCapabilities: raw.secondary,
        engines: raw.engines,
        encryptionMode: raw.encryption,
        contractType: raw.contract,
        ringAffinity: raw.ring,
        priority: raw.priority,
        modalities: raw.modalities,
        status: raw.status,
        manifestVersion: '1.0.0',

        phiPriorityWeight: priorityWeight(raw.priority),
        fibonacciIdentity: fibId,
        goldenAnglePosition: angle,
        phyllotaxisX,
        phyllotaxisY,
        engineResonance,
        dimensionalPlane: ringToDimensionalPlane(raw.ring),
        totalEngineWeight,
      };
    });

    this.totalExtensions = this.extensions.length;
  }

  byId(extensionId: string): AIExtension | undefined {
    return this.extensions.find(e => e.extensionId === extensionId);
  }

  byName(name: string): AIExtension | undefined {
    return this.extensions.find(e => e.name.toLowerCase() === name.toLowerCase());
  }

  byClass(cls: ExtensionClass): AIExtension[] {
    return this.extensions.filter(e => e.extensionClass === cls);
  }

  byRing(ring: OrganismRing): AIExtension[] {
    return this.extensions.filter(e => e.ringAffinity === ring);
  }

  byEncryption(mode: EncryptionMode): AIExtension[] {
    return this.extensions.filter(e => e.encryptionMode === mode);
  }

  byContract(type: ContractType): AIExtension[] {
    return this.extensions.filter(e => e.contractType === type);
  }

  encrypted(): AIExtension[] {
    return this.extensions.filter(e => e.encryptionMode !== 'NONE');
  }

  withContract(): AIExtension[] {
    return this.extensions.filter(e => e.contractType !== 'NONE');
  }

  totalGoldenWeight(): number {
    return this.extensions.reduce((sum, e) => sum + e.phiPriorityWeight, 0);
  }

  totalEngineBindings(): number {
    return this.extensions.reduce((sum, e) => sum + e.engines.length, 0);
  }

  status() {
    return {
      name: this.name,
      designation: this.designation,
      total_extensions: this.totalExtensions,
      total_engine_bindings: this.totalEngineBindings(),
      total_golden_weight: this.totalGoldenWeight(),
      reasoning_count: this.byClass(ExtensionClass.REASONING).length,
      creative_count: this.byClass(ExtensionClass.CREATIVE).length,
      analysis_count: this.byClass(ExtensionClass.ANALYSIS).length,
      security_count: this.byClass(ExtensionClass.SECURITY).length,
      workflow_count: this.byClass(ExtensionClass.WORKFLOW).length,
      encrypted_count: this.encrypted().length,
      contracted_count: this.withContract().length,
    };
  }
}
