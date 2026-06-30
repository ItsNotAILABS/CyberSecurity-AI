///
/// AI PROTOCOL REGISTRY — 10 AI-Intelligent Protocols
///
/// These are not ordinary protocols.  These ARE AIs.
/// Each protocol is itself an intelligence — it reasons about its own
/// execution, adapts its parameters, selects engines, and verifies
/// its own output.  The protocol IS the intelligence.
///
/// ALL engines are Nova's OWN sovereign engines — no external models.
/// All wired through nova-wire/* — our own protocol substrate.
///
/// 10 Protocols across 3 Protocol Tiers:
///   CORE (4)       — Foundation protocols that everything depends on
///   ORCHESTRATION (3) — Protocols that coordinate multi-AI workflows
///   VERIFICATION (3)  — Protocols that verify, attest, and prove
///
/// Each protocol carries:
///   - Multiple Nova sovereign engines (2–5)
///   - Self-tuning parameters (φ-weighted adaptive thresholds)
///   - Intelligence contract enforcement
///   - Encryption integration (Fibonacci, Phantom, E8)
///   - Cross-protocol Kuramoto coupling
///   - Golden-ratio mathematics for scoring and routing
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
//  TYPES
// ══════════════════════════════════════════════════════════════════

export enum ProtocolTier {
  CORE          = 'Core Protocol',
  ORCHESTRATION = 'Orchestration Protocol',
  VERIFICATION  = 'Verification Protocol',
}

export type AdaptiveMode =
  | 'STATIC'            // Fixed parameters
  | 'PHI_ADAPTIVE'      // φ-weighted self-tuning
  | 'KURAMOTO_SYNC'     // Cross-protocol synchronized
  | 'GOLDEN_SPIRAL'     // Expanding golden spiral adaptation
  | 'FIBONACCI_STEP';   // Fibonacci step-size adaptation

export interface ProtocolEngine {
  readonly modelFamilyId: string;
  readonly modelFamily: string;
  readonly role: string;
  readonly phiWeight: number;
  readonly wireProtocol: string;
}

export interface AdaptiveParameter {
  readonly name: string;
  readonly description: string;
  readonly initialValue: number;
  readonly minValue: number;
  readonly maxValue: number;
  readonly adaptiveMode: AdaptiveMode;
  readonly phiDecayRate: number;      // How fast it adapts: φ^(-rate)
  currentValue: number;
}

export interface AIProtocol {
  readonly protocolId: string;         // PRT-001 .. PRT-010
  readonly name: string;
  readonly latinDesignation: string;
  readonly tier: ProtocolTier;
  readonly description: string;
  readonly primaryFunction: string;
  readonly secondaryFunctions: readonly string[];
  readonly engines: readonly ProtocolEngine[];
  readonly adaptiveParameters: readonly AdaptiveParameter[];
  readonly encryptionIntegration: string;
  readonly contractEnforcement: string;
  readonly ringAffinity: OrganismRing;
  readonly priority: RoutingPriority;
  readonly modalities: readonly Modality[];
  readonly status: EngineStatus;
  readonly protocolVersion: string;

  // Computed golden-math fields
  readonly phiPriorityWeight: number;
  readonly fibonacciIdentity: number;
  readonly goldenAnglePosition: number;
  readonly phyllotaxisX: number;
  readonly phyllotaxisY: number;
  readonly engineResonance: number;
  readonly dimensionalPlane: DimensionalPlane;
  readonly totalEngineWeight: number;
  readonly adaptiveComplexity: number;
}

export interface ProtocolExecution {
  readonly protocolId: string;
  readonly executionId: string;
  readonly enginesUsed: readonly string[];
  readonly parametersSnapshot: Record<string, number>;
  readonly encryptionHash: number;
  readonly contractVerified: boolean;
  readonly resonance: number;
  readonly executionTimeMs: number;
  readonly phiScore: number;
  readonly timestamp: number;
}

export interface ProtocolRegistryStatus {
  readonly totalProtocols: number;
  readonly coreCount: number;
  readonly orchestrationCount: number;
  readonly verificationCount: number;
  readonly totalEngines: number;
  readonly totalAdaptiveParams: number;
  readonly totalGoldenWeight: number;
  readonly kuramotoR: number;
}

// ══════════════════════════════════════════════════════════════════
//  RAW PROTOCOL DATA — All 10 AI-Intelligent Protocols (Nova Sovereign)
// ══════════════════════════════════════════════════════════════════

interface RawProtocol {
  id: string;
  name: string;
  latin: string;
  tier: ProtocolTier;
  desc: string;
  primary: string;
  secondary: string[];
  engines: ProtocolEngine[];
  params: Omit<AdaptiveParameter, 'currentValue'>[];
  encryption: string;
  contract: string;
  ring: OrganismRing;
  priority: RoutingPriority;
  modalities: Modality[];
  status: EngineStatus;
}

const RAW_PROTOCOLS: RawProtocol[] = [
  // ── CORE TIER (4) ──────────────────────────────────────────────

  {
    id: 'PRT-001', name: 'Intelligence Routing Protocol', latin: 'Protocollum Itineris Intelligentiae',
    tier: ProtocolTier.CORE,
    desc: 'The master routing protocol. It IS an AI that decides which Nova engine handles which task. Uses Nova Cognos for meta-reasoning and Nova Stratos for edge-fast routing. Self-tunes routing weights using φ-adaptive parameters.',
    primary: 'Intelligent engine routing and selection',
    secondary: ['capability matching', 'load balancing', 'latency optimization', 'cost optimization', 'fallback routing', 'multi-engine fusion'],
    engines: [
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'meta-reasoning', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'routing-analysis', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-fast-route', phiWeight: PHI, wireProtocol: 'nova-wire/stratos' },
    ],
    params: [
      { name: 'routing_threshold', description: 'Minimum score to route to an engine', initialValue: PHI_INVERSE, minValue: 0.1, maxValue: 1.0, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.1 },
      { name: 'fusion_weight_decay', description: 'φ-decay for multi-engine fusion chains', initialValue: PHI_INVERSE, minValue: 0.3, maxValue: 0.9, adaptiveMode: 'GOLDEN_SPIRAL', phiDecayRate: 0.05 },
      { name: 'latency_tolerance_ms', description: 'Max acceptable latency before fallback', initialValue: 873, minValue: 100, maxValue: 5000, adaptiveMode: 'FIBONACCI_STEP', phiDecayRate: 0.2 },
    ],
    encryption: 'Fibonacci hash verification of routing decisions',
    contract: 'Every routing decision is logged with φ-weighted audit trail',
    ring: OrganismRing.INTERFACE, priority: RoutingPriority.P0,
    modalities: ['Text', 'Text + Vision + Audio'],
    status: 'active',
  },

  {
    id: 'PRT-002', name: 'Encryption Intelligence Protocol', latin: 'Protocollum Cryptographiae Intelligentis',
    tier: ProtocolTier.CORE,
    desc: 'The encryption protocol IS an AI. It reasons about what level of encryption each request needs. Selects between Fibonacci hash, φ-cascade, Phantom ZK, and E8 lattice — all using sovereign Nova engines.',
    primary: 'Adaptive intelligent encryption',
    secondary: ['sensitivity classification', 'encryption selection', 'key management', 'phantom mode activation', 'lattice rotation', 'integrity verification'],
    engines: [
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'sensitivity-classification', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/custodis' },
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'sovereign-crypto', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-encryption', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/stratos' },
    ],
    params: [
      { name: 'sensitivity_threshold', description: 'Above this → upgrade encryption tier', initialValue: 0.618, minValue: 0.1, maxValue: 1.0, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.05 },
      { name: 'cascade_rounds', description: 'Number of φ-cascade hash rounds', initialValue: 8, minValue: 1, maxValue: 21, adaptiveMode: 'FIBONACCI_STEP', phiDecayRate: 0.1 },
      { name: 'phantom_activation_threshold', description: 'Score threshold to activate Phantom ZK', initialValue: 0.85, minValue: 0.5, maxValue: 1.0, adaptiveMode: 'KURAMOTO_SYNC', phiDecayRate: 0.08 },
    ],
    encryption: 'Self-encrypting: uses its own output to encrypt its own state',
    contract: 'Every encryption decision audited via intelligence contract',
    ring: OrganismRing.COUNSEL, priority: RoutingPriority.P0,
    modalities: ['Text', 'Text → Safety'],
    status: 'active',
  },

  {
    id: 'PRT-003', name: 'Memory Intelligence Protocol', latin: 'Protocollum Memoriae Intelligentis',
    tier: ProtocolTier.CORE,
    desc: 'The memory protocol IS an AI. It decides what to remember, what to forget, and how to organize knowledge. Uses Nova Vector embeddings + Nova Ranker + Nova Memoria RAG — all sovereign.',
    primary: 'Intelligent memory management',
    secondary: ['semantic indexing', 'relevance scoring', 'memory consolidation', 'forgetting curves', 'context window optimization', 'RAG retrieval'],
    engines: [
      { modelFamilyId: 'NOV-007', modelFamily: 'Nova Vector', role: 'semantic-memory', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/vector' },
      { modelFamilyId: 'NOV-015', modelFamily: 'Nova Ranker', role: 'relevance-scoring', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/ranker' },
      { modelFamilyId: 'NOV-006', modelFamily: 'Nova Memoria', role: 'rag-grounding', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/memoria' },
      { modelFamilyId: 'NOV-023', modelFamily: 'Nova Visio', role: 'visual-memory', phiWeight: PHI, wireProtocol: 'nova-wire/visio' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'long-context-memory', phiWeight: PHI_INVERSE, wireProtocol: 'nova-wire/profundis' },
    ],
    params: [
      { name: 'memory_retention_phi', description: 'φ-weighted retention score threshold', initialValue: PHI_INVERSE, minValue: 0.1, maxValue: 1.0, adaptiveMode: 'GOLDEN_SPIRAL', phiDecayRate: 0.03 },
      { name: 'consolidation_interval_ms', description: 'Memory consolidation heartbeat', initialValue: 873 * 5, minValue: 1000, maxValue: 30000, adaptiveMode: 'FIBONACCI_STEP', phiDecayRate: 0.1 },
      { name: 'max_memory_vectors', description: 'Maximum active memory vectors', initialValue: 6765, minValue: 144, maxValue: 100000, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.01 },
    ],
    encryption: 'All memories encrypted with φ-cascade before storage',
    contract: 'Memory integrity verified via Fibonacci hash chain',
    ring: OrganismRing.MEMORY, priority: RoutingPriority.P0,
    modalities: ['Text → Vector', 'Text → Score', 'Text', 'Multi → Embedding'],
    status: 'active',
  },

  {
    id: 'PRT-004', name: 'Safety Intelligence Protocol', latin: 'Protocollum Securitatis Intelligentis',
    tier: ProtocolTier.CORE,
    desc: 'The safety protocol IS an AI. It reasons about every request and response for toxicity, injection, jailbreak, and PII. Uses Nova Custodis + Nova Profundis safety reasoning + multi-engine consensus.',
    primary: 'Intelligent content safety',
    secondary: ['toxicity detection', 'prompt injection defense', 'jailbreak detection', 'PII filtering', 'bias detection', 'safety scoring'],
    engines: [
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'primary-guard', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/custodis' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'safety-reasoning', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-safety', phiWeight: PHI, wireProtocol: 'nova-wire/stratos' },
    ],
    params: [
      { name: 'toxicity_threshold', description: 'Score above which content is flagged', initialValue: 0.382, minValue: 0.1, maxValue: 0.9, adaptiveMode: 'KURAMOTO_SYNC', phiDecayRate: 0.02 },
      { name: 'injection_sensitivity', description: 'Prompt injection detection sensitivity', initialValue: 0.8, minValue: 0.5, maxValue: 1.0, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.05 },
      { name: 'consensus_required', description: 'Engines that must agree for safety pass', initialValue: 2, minValue: 1, maxValue: 3, adaptiveMode: 'STATIC', phiDecayRate: 0 },
    ],
    encryption: 'Safety decisions encrypted with E8 lattice for tamper-proofing',
    contract: 'Multi-engine consensus contract: 2/3 engines must agree on safety',
    ring: OrganismRing.COUNSEL, priority: RoutingPriority.P0,
    modalities: ['Text → Safety', 'Text', 'Text + Vision'],
    status: 'active',
  },

  // ── ORCHESTRATION TIER (3) ─────────────────────────────────────

  {
    id: 'PRT-005', name: 'Fusion Chain Protocol', latin: 'Protocollum Catenarum Fusionis',
    tier: ProtocolTier.ORCHESTRATION,
    desc: 'The fusion protocol IS an AI that composes multi-engine chains. It reasons about task decomposition, selects the best Nova engine for each step, and weights the chain using φ-decay.',
    primary: 'Multi-engine fusion orchestration',
    secondary: ['task decomposition', 'chain composition', 'φ-decay weighting', 'parallel execution', 'error recovery', 'result synthesis'],
    engines: [
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'task-decomposition', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-003', modelFamily: 'Nova Fusio', role: 'multi-modal-fusion', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/fusio' },
      { modelFamilyId: 'NOV-022', modelFamily: 'Nova Structura', role: 'structured-routing', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/structura' },
    ],
    params: [
      { name: 'max_chain_length', description: 'Maximum engines in a fusion chain', initialValue: 5, minValue: 2, maxValue: 8, adaptiveMode: 'FIBONACCI_STEP', phiDecayRate: 0.1 },
      { name: 'chain_phi_decay', description: 'φ-decay rate per chain step', initialValue: PHI_INVERSE, minValue: 0.3, maxValue: 0.9, adaptiveMode: 'GOLDEN_SPIRAL', phiDecayRate: 0.05 },
      { name: 'parallel_threshold', description: 'Score above which steps can parallelize', initialValue: 0.618, minValue: 0.3, maxValue: 1.0, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.08 },
    ],
    encryption: 'Chain proofs encrypted with Fibonacci hash sequence',
    contract: 'Each chain step verified via chain-of-thought proof contract',
    ring: OrganismRing.INTERFACE, priority: RoutingPriority.P0,
    modalities: ['Text + Vision + Audio', 'Text + Vision + Audio + Video', 'Text'],
    status: 'active',
  },

  {
    id: 'PRT-006', name: 'Cross-Modal Bridge Protocol', latin: 'Protocollum Pontis Intermodalis',
    tier: ProtocolTier.ORCHESTRATION,
    desc: 'The bridge protocol IS an AI that translates between modalities. Text → Image → Video → Audio → Code. Uses Nova Fusio as the modal hub, Nova Pictor for images, Nova Kinema for video, Nova Vox for audio.',
    primary: 'Intelligent cross-modal translation',
    secondary: ['text-to-image bridging', 'image-to-video bridging', 'audio-to-text bridging', 'code-to-documentation', 'modal chain optimization', 'quality preservation'],
    engines: [
      { modelFamilyId: 'NOV-003', modelFamily: 'Nova Fusio', role: 'multi-modal-hub', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/fusio' },
      { modelFamilyId: 'NOV-009', modelFamily: 'Nova Pictor', role: 'text-to-image', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/pictor' },
      { modelFamilyId: 'NOV-010', modelFamily: 'Nova Kinema', role: 'text-to-video', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/kinema' },
      { modelFamilyId: 'NOV-018', modelFamily: 'Nova Vox', role: 'text-to-audio', phiWeight: PHI, wireProtocol: 'nova-wire/vox' },
      { modelFamilyId: 'NOV-011', modelFamily: 'Nova Harmonia', role: 'audio-to-text', phiWeight: PHI_INVERSE, wireProtocol: 'nova-wire/harmonia' },
    ],
    params: [
      { name: 'bridge_quality_threshold', description: 'Minimum quality score for modal conversion', initialValue: 0.75, minValue: 0.3, maxValue: 1.0, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.05 },
      { name: 'max_hops', description: 'Maximum modality hops in a bridge chain', initialValue: 3, minValue: 1, maxValue: 5, adaptiveMode: 'FIBONACCI_STEP', phiDecayRate: 0.1 },
      { name: 'preservation_weight', description: 'How much to preserve original signal', initialValue: PHI_INVERSE, minValue: 0.3, maxValue: 1.0, adaptiveMode: 'GOLDEN_SPIRAL', phiDecayRate: 0.03 },
    ],
    encryption: 'Cross-modal proofs encrypted with φ-cascade',
    contract: 'Output attestation at each modality hop',
    ring: OrganismRing.GEOMETRY, priority: RoutingPriority.P0,
    modalities: ['Text + Vision + Audio + Video', 'Text → Image', 'Text → Video', 'Text → Audio', 'Audio → Text'],
    status: 'active',
  },

  {
    id: 'PRT-007', name: 'Sovereign Execution Protocol', latin: 'Protocollum Executionis Sovereignae',
    tier: ProtocolTier.ORCHESTRATION,
    desc: 'The sovereign protocol IS an AI that ensures ALL execution stays on sovereign Nova engines. It reasons about privacy, latency, and cost — everything runs natively, no external dependencies.',
    primary: 'Sovereign-only execution enforcement',
    secondary: ['privacy classification', 'latency optimization', 'cost analysis', 'sovereign engine selection', 'edge-first routing', 'zero-data-leak guarantee'],
    engines: [
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'sovereign-primary', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-fast', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/stratos' },
      { modelFamilyId: 'NOV-004', modelFamily: 'Nova Lingua', role: 'multilingual-sovereign', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/lingua' },
      { modelFamilyId: 'NOV-022', modelFamily: 'Nova Structura', role: 'sovereign-structure', phiWeight: PHI, wireProtocol: 'nova-wire/structura' },
    ],
    params: [
      { name: 'privacy_score_threshold', description: 'Above this → force sovereign execution', initialValue: 0.7, minValue: 0.3, maxValue: 1.0, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.05 },
      { name: 'latency_budget_ms', description: 'Max latency budget for sovereign engines', initialValue: 2000, minValue: 200, maxValue: 10000, adaptiveMode: 'FIBONACCI_STEP', phiDecayRate: 0.15 },
      { name: 'cost_weight', description: 'How much to weight cost vs. quality', initialValue: PHI_INVERSE, minValue: 0.1, maxValue: 1.0, adaptiveMode: 'GOLDEN_SPIRAL', phiDecayRate: 0.08 },
    ],
    encryption: 'Sovereign seal encryption for all local execution',
    contract: 'Sovereign execution contract: verifies no data leaves Nova substrate',
    ring: OrganismRing.SOVEREIGN, priority: RoutingPriority.P0,
    modalities: ['Text'],
    status: 'active',
  },

  // ── VERIFICATION TIER (3) ──────────────────────────────────────

  {
    id: 'PRT-008', name: 'Consensus Verification Protocol', latin: 'Protocollum Consensus Verificationis',
    tier: ProtocolTier.VERIFICATION,
    desc: 'The consensus protocol IS an AI. It runs the same query through multiple Nova engines, compares outputs, and uses φ-weighted voting to determine the most reliable answer.',
    primary: 'Multi-engine consensus verification',
    secondary: ['parallel inference', 'output comparison', 'φ-weighted voting', 'disagreement analysis', 'confidence scoring', 'hallucination detection'],
    engines: [
      { modelFamilyId: 'NOV-001', modelFamily: 'Nova Cognos', role: 'consensus-engine-1', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/cognos' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'consensus-engine-2', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-003', modelFamily: 'Nova Fusio', role: 'consensus-engine-3', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/fusio' },
      { modelFamilyId: 'NOV-022', modelFamily: 'Nova Structura', role: 'tiebreaker', phiWeight: PHI, wireProtocol: 'nova-wire/structura' },
    ],
    params: [
      { name: 'consensus_threshold', description: 'Agreement ratio needed (e.g., 2/3)', initialValue: 0.667, minValue: 0.5, maxValue: 1.0, adaptiveMode: 'KURAMOTO_SYNC', phiDecayRate: 0.02 },
      { name: 'disagreement_escalation', description: 'Escalate if disagreement exceeds this', initialValue: 0.5, minValue: 0.1, maxValue: 0.9, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.05 },
      { name: 'hallucination_sensitivity', description: 'Sensitivity to hallucination signals', initialValue: 0.8, minValue: 0.3, maxValue: 1.0, adaptiveMode: 'GOLDEN_SPIRAL', phiDecayRate: 0.03 },
    ],
    encryption: 'All consensus votes encrypted with φ-cascade',
    contract: 'Multi-engine consensus contract with φ-weighted voting',
    ring: OrganismRing.PROOF, priority: RoutingPriority.P0,
    modalities: ['Text', 'Text + Vision', 'Text + Vision + Audio'],
    status: 'active',
  },

  {
    id: 'PRT-009', name: 'Chain-of-Thought Proof Protocol', latin: 'Protocollum Probationis Cogitationis',
    tier: ProtocolTier.VERIFICATION,
    desc: 'The proof protocol IS an AI. It verifies that an AI\'s reasoning chain is logically valid. Uses Nova Formalis for formal logic + Nova Algorithmus for algorithmic proof.',
    primary: 'AI reasoning chain verification',
    secondary: ['step verification', 'logic validation', 'mathematical proof', 'chain integrity', 'reasoning audit', 'error localization'],
    engines: [
      { modelFamilyId: 'NOV-016', modelFamily: 'Nova Formalis', role: 'formal-verification', phiWeight: PHI_FOURTH, wireProtocol: 'nova-wire/formalis' },
      { modelFamilyId: 'NOV-002', modelFamily: 'Nova Profundis', role: 'logic-reasoning', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/profundis' },
      { modelFamilyId: 'NOV-017', modelFamily: 'Nova Algorithmus', role: 'algorithmic-proof', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/algorithmus' },
    ],
    params: [
      { name: 'step_validity_threshold', description: 'Minimum validity score per reasoning step', initialValue: 0.9, minValue: 0.5, maxValue: 1.0, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.02 },
      { name: 'max_proof_depth', description: 'Maximum reasoning chain depth to verify', initialValue: 13, minValue: 3, maxValue: 34, adaptiveMode: 'FIBONACCI_STEP', phiDecayRate: 0.1 },
      { name: 'formal_rigor_level', description: 'How formally rigorous the proof must be', initialValue: 0.75, minValue: 0.3, maxValue: 1.0, adaptiveMode: 'GOLDEN_SPIRAL', phiDecayRate: 0.05 },
    ],
    encryption: 'Chain proofs stored with Fibonacci hash integrity',
    contract: 'Every reasoning step verified and signed by proof contract',
    ring: OrganismRing.PROOF, priority: RoutingPriority.P0,
    modalities: ['Text', 'Text → Math', 'Text → Code'],
    status: 'active',
  },

  {
    id: 'PRT-010', name: 'Output Attestation Protocol', latin: 'Protocollum Attestationis Exituum',
    tier: ProtocolTier.VERIFICATION,
    desc: 'The attestation protocol IS an AI. It certifies that an AI output genuinely came from the claimed Nova engine, wasn\'t tampered with, and meets quality standards. Blockchain-verifiable attestation.',
    primary: 'AI output attestation and certification',
    secondary: ['engine verification', 'output fingerprinting', 'tamper detection', 'quality scoring', 'provenance tracking', 'blockchain attestation'],
    engines: [
      { modelFamilyId: 'NOV-007', modelFamily: 'Nova Vector', role: 'output-fingerprint', phiWeight: PHI_CUBED, wireProtocol: 'nova-wire/vector' },
      { modelFamilyId: 'NOV-014', modelFamily: 'Nova Custodis', role: 'integrity-check', phiWeight: PHI_SQUARED, wireProtocol: 'nova-wire/custodis' },
      { modelFamilyId: 'NOV-005', modelFamily: 'Nova Stratos', role: 'edge-verification', phiWeight: PHI, wireProtocol: 'nova-wire/stratos' },
    ],
    params: [
      { name: 'fingerprint_granularity', description: 'Embedding dimension for output fingerprint', initialValue: 1536, minValue: 256, maxValue: 3072, adaptiveMode: 'STATIC', phiDecayRate: 0 },
      { name: 'tamper_sensitivity', description: 'How sensitive to output modifications', initialValue: 0.95, minValue: 0.5, maxValue: 1.0, adaptiveMode: 'KURAMOTO_SYNC', phiDecayRate: 0.01 },
      { name: 'quality_threshold', description: 'Minimum quality score for attestation', initialValue: 0.75, minValue: 0.3, maxValue: 1.0, adaptiveMode: 'PHI_ADAPTIVE', phiDecayRate: 0.05 },
    ],
    encryption: 'Attestation seals encrypted with E8 lattice + Fibonacci hash',
    contract: 'Immutable attestation contract with blockchain verification',
    ring: OrganismRing.PROOF, priority: RoutingPriority.P0,
    modalities: ['Text', 'Text → Vector', 'Text → Safety'],
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
//  AI PROTOCOL REGISTRY — All 10 Protocols with Golden Math
// ══════════════════════════════════════════════════════════════════

export class AIProtocolRegistry {
  readonly name = 'AI PROTOCOL REGISTRY';
  readonly designation = 'Registrum Protocollorum Intelligentium — 10 Sovereign AI-Intelligent Protocols';
  readonly protocols: AIProtocol[];
  readonly totalProtocols: number;

  constructor() {
    this.protocols = RAW_PROTOCOLS.map((raw, index) => {
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

      // Adaptive complexity: φ-weighted count of adaptive parameters
      const adaptiveComplexity = raw.params.reduce((sum, p) => {
        if (p.adaptiveMode === 'STATIC') return sum;
        return sum + Math.pow(PHI, -p.phiDecayRate * 10);
      }, 0);

      const adaptiveParameters: AdaptiveParameter[] = raw.params.map(p => ({
        ...p,
        currentValue: p.initialValue,
      }));

      return {
        protocolId: raw.id,
        name: raw.name,
        latinDesignation: raw.latin,
        tier: raw.tier,
        description: raw.desc,
        primaryFunction: raw.primary,
        secondaryFunctions: raw.secondary,
        engines: raw.engines,
        adaptiveParameters,
        encryptionIntegration: raw.encryption,
        contractEnforcement: raw.contract,
        ringAffinity: raw.ring,
        priority: raw.priority,
        modalities: raw.modalities,
        status: raw.status,
        protocolVersion: '1.0.0',

        phiPriorityWeight: priorityWeight(raw.priority),
        fibonacciIdentity: fibId,
        goldenAnglePosition: angle,
        phyllotaxisX,
        phyllotaxisY,
        engineResonance,
        dimensionalPlane: ringToDimensionalPlane(raw.ring),
        totalEngineWeight,
        adaptiveComplexity,
      };
    });

    this.totalProtocols = this.protocols.length;
  }

  byId(protocolId: string): AIProtocol | undefined {
    return this.protocols.find(p => p.protocolId === protocolId);
  }

  byName(name: string): AIProtocol | undefined {
    return this.protocols.find(p => p.name.toLowerCase() === name.toLowerCase());
  }

  byTier(tier: ProtocolTier): AIProtocol[] {
    return this.protocols.filter(p => p.tier === tier);
  }

  byRing(ring: OrganismRing): AIProtocol[] {
    return this.protocols.filter(p => p.ringAffinity === ring);
  }

  totalGoldenWeight(): number {
    return this.protocols.reduce((sum, p) => sum + p.phiPriorityWeight, 0);
  }

  totalEngineBindings(): number {
    return this.protocols.reduce((sum, p) => sum + p.engines.length, 0);
  }

  totalAdaptiveParams(): number {
    return this.protocols.reduce((sum, p) => sum + p.adaptiveParameters.length, 0);
  }

  status(): ProtocolRegistryStatus {
    return {
      totalProtocols: this.totalProtocols,
      coreCount: this.byTier(ProtocolTier.CORE).length,
      orchestrationCount: this.byTier(ProtocolTier.ORCHESTRATION).length,
      verificationCount: this.byTier(ProtocolTier.VERIFICATION).length,
      totalEngines: this.totalEngineBindings(),
      totalAdaptiveParams: this.totalAdaptiveParams(),
      totalGoldenWeight: this.totalGoldenWeight(),
      kuramotoR: 0,
    };
  }
}
