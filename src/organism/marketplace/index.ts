///
/// MARKETPLACE INDEX — AI-Centered Marketplace Releases
///
/// The NOVA Marketplace is not a component library.  It is not a tool set.
/// It is an AI WORKFORCE — 150 AIs with 450 engines, coordinated
/// by an AGI orchestrator, rendering through a generative UI engine backed
/// by an infinite spatial canvas.
///
/// Release #1: @medina/generative-ui-engine + Spatial Canvas
///   AI generates entire UI components in real-time from natural language.
///   Spatial canvas is wired IN — it IS the rendering substrate.
///   WebGPU + CSS Houdini + Web Components + Canvas 2D/WebGL + CRDT.
///
/// Release #2: @medina/ai-workforce (50 Language AIs + Orchestrator)
///   Every programming language IS an AI.  Each AI has 3 engines.
///   10 multi-group AI models.  AGI orchestrator manages the full build.
///   Data platform managed by AGIs.  AIs are internal workers.
///
/// Release #3: @medina/native-nova-ais (100 Native Nova AIs)
///   OUR AIs — sovereign, not wrappers.  10 per group × 10 groups.
///   Intelligence tiers: SingleModel, MultiModel, SuperIntelligent, AGI.
///   Each has 3 engines (Perceive, Synthesize, Manifest).
///   100 AIs, 300 engines, 10 AGIs, 30 self-improving.
///
/// Release #4: @medina/sovereign-encryption (Sovereign Encryption SDK)
///   Five-tier encryption from Fibonacci hashing to E8/Leech lattices and
///   Phantom zero-knowledge proofs.  Golden-ratio integrity on every
///   operation.  Pure mathematical encryption — no external dependencies.
///
/// Release #5: @medina/sovereign-token-engine (Sovereign Token Engine)
///   Tokenization, attestation, provenance tracking, golden-ratio token
///   economics, and 5 Token AI Models.  Every token carries a Fibonacci-
///   hash identity, φ-weighted importance, and sovereign verification.
///
/// Release #6: @medina/legal-paralegal-ai (Legal Paralegal AI)
///   AI-powered legal technology — 10 divisions, 30 engines.  Case law
///   analysis, contract review, document drafting, legal research,
///   argument construction, compliance, risk assessment, and attestation.
///   Built for lawyers and paralegals.  Sovereign.  Attested.
///
/// Release #7: @medina/sovereign-identity (Sovereign Identity SDK)
///   Five-tier identity from Fibonacci fingerprints to sovereign attestation
///   chains.  Cross-substrate, cross-dimensional identity verification.
///
/// Release #8: @medina/sovereign-data-mesh (Sovereign Data Mesh SDK)
///   Five-tier data infrastructure from golden stores to cross-substrate
///   self-healing data mesh.  φ-indexed, time-versioned, dimensional.
///
/// Release #9: @medina/sovereign-network (Sovereign Network SDK)
///   Five-tier networking from golden wires to phantom relays.
///   Cross-dimensional bridges, stealth communication, φ-routing.
///
/// Release #10: Marketplace Category System
///   10 sovereign categories organizing everything.  Every product,
///   SDK, AI, engine is categorized.  Database-ready.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════
//  @medina/generative-ui-engine (with Spatial Canvas wired in)
// ══════════════════════════════════════════════════════════════════

export {
  GenerativeUIEngine,
  createGenerativeUIEngine,
} from './GenerativeUIEngine.js';

export type {
  UIIntent,
  ComponentSpec,
  LayoutSpec,
  StyleRule,
  EventBinding,
  SlotDefinition,
  ASTNodeKind,
  ASTNode,
  GeneratedComponent,
  ShaderConfig,
  PaintWorklet,
  RenderPipeline,
  GenerativeUIConfig,
  DesignSystemConfig,
} from './GenerativeUIEngine.js';

// ══════════════════════════════════════════════════════════════════
//  Spatial Canvas (wired into generative-ui-engine as substrate)
// ══════════════════════════════════════════════════════════════════

export {
  SpatialCanvasSDK,
  createSpatialCanvasSDK,
} from './SpatialCanvasSDK.js';

export type {
  Point2D,
  BoundingBox,
  Transform2D,
  ViewportState,
  CanvasElementKind,
  CanvasStyle,
  CanvasElement,
  AgentKind,
  AgentAction,
  CanvasAgent,
  AgentGenerationResult,
  CRDTOperation,
  SyncState,
  SpatialCanvasConfig,
} from './SpatialCanvasSDK.js';

// ══════════════════════════════════════════════════════════════════
//  50 Language AI Workers — Every Language IS an AI
// ══════════════════════════════════════════════════════════════════

export {
  LANGUAGE_AIS,
  MULTI_GROUP_MODELS,
  LANGUAGE_AI_GROUP_INDEX,
  LanguageAIRegistry,
} from './LanguageAIWorkers.js';

export type {
  EngineKind,
  LanguageEngine,
  LanguageAIGroup,
  AIBuildRole,
  AITier,
  AIWorkerStatus,
  LanguageAI,
  MultiGroupAIModel,
  LanguageAIResult,
} from './LanguageAIWorkers.js';

// ══════════════════════════════════════════════════════════════════
//  AI Workforce Orchestrator — AGI Build Platform
// ══════════════════════════════════════════════════════════════════

export {
  AIWorkforceOrchestrator,
  createAIWorkforceOrchestrator,
} from './AIWorkforceOrchestrator.js';

export type {
  BuildIntent,
  AITask,
  PipelineStage,
  BuildPipeline,
  AIMemoryEntry,
  WorkforceStats,
} from './AIWorkforceOrchestrator.js';

// ══════════════════════════════════════════════════════════════════
//  100 Native Nova AIs — OUR Sovereign Intelligence Models
// ══════════════════════════════════════════════════════════════════

export {
  NATIVE_NOVA_AIS,
  NOVA_AI_GROUPS,
  NativeNovaAIRegistry,
} from './NativeNovaAIs.js';

export type {
  NovaEngineKind,
  NovaIntelligenceTier,
  NovaOperationalMode,
  NovaAIStatus,
  NovaEngine,
  NativeNovaAI,
  NovaAIGroup,
  NovaAIResult,
} from './NativeNovaAIs.js';

// ══════════════════════════════════════════════════════════════════
//  Sovereign Encryption SDK — Five-Tier Golden-Ratio Encryption
// ══════════════════════════════════════════════════════════════════

export {
  SovereignEncryptionSDK,
  createSovereignEncryptionSDK,
} from './SovereignEncryptionSDK.js';

export type {
  EncryptionTier,
  HashResult,
  DerivedKey,
  E8Vector,
  E8EncryptedPayload,
  PhantomProof,
  PhiCascadeResult,
  EncryptionConfig,
  IntegrityResult,
} from './SovereignEncryptionSDK.js';

// ══════════════════════════════════════════════════════════════════
//  Sovereign Token Engine — Attestation, Provenance, Economics
// ══════════════════════════════════════════════════════════════════

export {
  SovereignTokenEngine,
  createSovereignTokenEngine,
} from './SovereignTokenEngine.js';

export type {
  TokenKind,
  SovereignToken,
  ProvenanceRecord,
  AttestedTokenSequence,
  TokenAnalysis,
  TokenEconomics,
  TokenAIModel,
  TokenEngineConfig,
} from './SovereignTokenEngine.js';

// ══════════════════════════════════════════════════════════════════
//  Legal Paralegal AI — Sovereign Legal Intelligence Platform
// ══════════════════════════════════════════════════════════════════

export {
  LegalParalegalAI,
  createLegalParalegalAI,
} from './LegalParalegalAI.js';

export type {
  LegalDivision,
  LegalDocumentType,
  PracticeArea,
  ConfidenceLevel,
  RiskSeverity,
  LegalEngine,
  LegalDivisionSpec,
  CaseLawAnalysis,
  ContractClause,
  ContractReview,
  LegalDocument,
  LegalDocSection,
  LegalDocMetadata,
  LegalResearch,
  ResearchFinding,
  LegalArgument,
  RiskAssessment,
  RiskItem,
  ComplianceCheck,
  LegalDeadline,
  ClientMatter,
  LegalAIConfig,
} from './LegalParalegalAI.js';

// ══════════════════════════════════════════════════════════════════
//  Sovereign Identity SDK — Five-Tier Golden-Ratio Identity
// ══════════════════════════════════════════════════════════════════

export {
  SovereignIdentitySDK,
  createSovereignIdentitySDK,
} from './SovereignIdentitySDK.js';

export type {
  IdentityTier,
  FibonacciFingerprint,
  GoldenSignature,
  SovereignPassport,
  DimensionalIdentity,
  AttestationChainLink,
  AttestationChain,
  IdentityConfig,
} from './SovereignIdentitySDK.js';

// ══════════════════════════════════════════════════════════════════
//  Sovereign Data Mesh SDK — Five-Tier Golden-Ratio Data Infrastructure
// ══════════════════════════════════════════════════════════════════

export {
  SovereignDataMeshSDK,
  createSovereignDataMeshSDK,
} from './SovereignDataMeshSDK.js';

export type {
  DataMeshTier,
  GoldenStoreEntry,
  FibonacciTreeNode,
  PhiGraphNode,
  PhiGraphEdge,
  DimensionalVaultEntry,
  MeshNode,
  DataMeshStats,
  DataMeshConfig,
} from './SovereignDataMeshSDK.js';

// ══════════════════════════════════════════════════════════════════
//  Sovereign Network SDK — Five-Tier Golden-Ratio Network
// ══════════════════════════════════════════════════════════════════

export {
  SovereignNetworkSDK,
  createSovereignNetworkSDK,
} from './SovereignNetworkSDK.js';

export type {
  NetworkTier,
  WireMessage,
  FibonacciChannel,
  MeshRoute,
  DimensionalBridge,
  PhantomRelay,
  NetworkStats,
  NetworkConfig,
} from './SovereignNetworkSDK.js';

// ══════════════════════════════════════════════════════════════════
//  Marketplace Categories — Sovereign Product Organization
// ══════════════════════════════════════════════════════════════════

export {
  MarketplaceCategoryRegistry,
  createMarketplaceCategoryRegistry,
  MARKETPLACE_CATEGORIES,
} from './MarketplaceCategories.js';

export type {
  MarketplaceCategoryId,
  MarketplaceCategory,
  MarketplaceProduct,
  MarketplaceStats,
} from './MarketplaceCategories.js';
