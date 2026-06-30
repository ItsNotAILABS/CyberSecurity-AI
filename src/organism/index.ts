///
/// ORGANISM INDEX — The Living Civilization
///
/// This is the master export for the entire Native Nova Protocol
/// organism intelligence layer.  Every organism, every intelligence,
/// every model, every solver, every fracture — all wired together.
///
/// Backend: Motoko canisters (src/organisms/*/main.mo)
/// Frontend: TypeScript intelligence (src/organism/**/*.ts)
/// Together: One organism.  One civilization.
///
/// 9 Alpha Organisms.  35+ Sub-Intelligences.  100 Fracture Intelligences.
/// 100 Frontend Intelligence Models.  2 Phantom Blockchain Models.
/// 40 AI Foundation Model Families.  4 Fracture Models.
/// 20 AI Multi-Modal Extensions.  50 Alpha Protocols.  500 Protocol Calls.
/// 20 AGIs.  32 Alpha Terminals.  10 Command Center Modules.
/// 5 Ghost Code Engines.  5 Dimensional Planes.  9 Organism Rings.
///
/// 12 Houses in 4 Tiers:
///
///   CROWN TIER:
///     DOMUS CORONAE     — Crown House — Orchestrator of all 12 houses
///
///   CORE TIER:
///     DOMUS CUSTOS      — House of Care / Stewardship (15+ sub-intelligences)
///       └─ SALUS + CURATOR + DIAGNOSTICA + THEORICUS
///     DOMUS PRAESIDIUM  — House of Defense / Protection (20+ sub-intelligences)
///       └─ BELLATOR + EXPLORATOR + FABRICATOR + ANALYSTOR + THEORICUS
///
///   OPERATIONAL TIER:
///     DOMUS FABRICAE    — House of the Forge / Build (50 Language AI Workers)
///     DOMUS MERCATUS    — House of the Market / Commerce (100 Nova AIs)
///     DOMUS COGNITIO    — House of Knowledge (40 AI Foundation Models)
///     DOMUS LEGIS       — House of Law / Legal (30 legal AI engines)
///     DOMUS NEXUS       — House of Networks (5-tier network + 5-tier data)
///
///   CREATIVE TIER:
///     DOMUS CRYPTA      — House of Secrets / Encryption (6-tier + Phantom)
///     DOMUS IDENTITAS   — House of Identity (5-tier sovereign identity)
///     DOMUS SUBSTRATI   — House of Substrates (12 element canisters)
///     DOMUS GENESIS     — House of Creation (organism birth + evolution)
///
/// Command Center: CENTRUM IMPERIUM — The visionary watches, the system acts.
///   32 Alpha Terminals.  10 Modules.  5 Ghost Code Engines.
///   20 AGIs across 4 tiers (Supreme, Operational, Creative, Phantom).
///   50 Alpha Protocols across 5 tiers (Core, Orchestration, Verification, Sovereign, Phantom).
///   500+ callable actions — the nervous system of the organism.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════
//  INTELLIGENCES — The Seven Alpha Organisms
// ══════════════════════════════════════════════════════════════════

export { ObserverIntelligence } from './intelligence/ObserverIntelligence.js';
export { SovereignIntelligence } from './intelligence/SovereignIntelligence.js';
export { ChrysalisIntelligence } from './intelligence/ChrysalisIntelligence.js';
export { TerminalIntelligence } from './intelligence/TerminalIntelligence.js';
export { ScribeIntelligence } from './intelligence/ScribeIntelligence.js';
export { ArchitectIntelligence } from './intelligence/ArchitectIntelligence.js';
export { NexusIntelligence } from './intelligence/NexusIntelligence.js';
export { CustosIntelligence } from './intelligence/CustosIntelligence.js';
export { PraesidiumIntelligence } from './intelligence/PraesidiumIntelligence.js';
export { default as CloudEngineIntelligence } from './intelligence/CloudEngineIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  FRACTURE REGISTRY — 100 Technology Fracture Intelligences
// ══════════════════════════════════════════════════════════════════

export { FractureRegistry, FractureCategory } from './intelligence/FractureRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  OBSERVER MODELS — Server Models + Solvers
// ══════════════════════════════════════════════════════════════════

export { VigilModel, SpeculatorModel } from './models/ObserverModels.js';
export { SynthesistaPatternorum, TheoricusInterdimensionalis } from './models/ObserverSolverSynthesizers.js';

// ══════════════════════════════════════════════════════════════════
//  CUSTOS MODELS — House of Care Server Models + Solvers + Orchestrator
//  15+ sub-intelligences: SALUS (5) + CURATOR (5) + 2 solvers + core (5)
// ══════════════════════════════════════════════════════════════════

export { SalusModel, CuratorModel } from './models/CustosModels.js';
export { DiagnosticaHarmonica, TheoricusVitae } from './models/CustosSolverSynthesizers.js';
export { DomusCustos } from './models/CustosOrchestrator.js';

// ══════════════════════════════════════════════════════════════════
//  PRAESIDIUM MODELS — House of Defense Server Models + Solvers + Orchestrator
//  20+ sub-intelligences: BELLATOR (5) + EXPLORATOR (5) + FABRICATOR (5) + 2 solvers + core (5)
// ══════════════════════════════════════════════════════════════════

export { BellatorModel, ExploratorModel, FabricatorModel } from './models/PraesidiumModels.js';
export { AnalystorHostilis, TheoricusLimitis } from './models/PraesidiumSolverSynthesizers.js';
export { DomusPraesidium } from './models/PraesidiumOrchestrator.js';

// ══════════════════════════════════════════════════════════════════
//  CROWN HOUSE — Orchestrator of Orchestrators
//  35+ total sub-intelligences across all houses
// ══════════════════════════════════════════════════════════════════

export { DomusCoronae } from './models/HouseOrchestrator.js';

// ══════════════════════════════════════════════════════════════════
//  HOUSE REGISTRY — All 12 Houses in 4 Tiers
// ══════════════════════════════════════════════════════════════════

export {
  HouseRegistry,
  HOUSES,
  HOUSE_DEFINITIONS,
  LEX_DOMUS_001,
  createHouseRegistry,
} from './models/HouseRegistry.js';

export type {
  HouseId,
  HouseTier,
  HouseModel,
  HouseTechnology,
  HouseDivision,
  HouseDefinition,
  HouseRegistryStats,
} from './models/HouseRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  FRACTURE MODELS — Active Intelligence for 100 Fractures
// ══════════════════════════════════════════════════════════════════

export {
  FractureAnalyzer,
  FractureComparator,
  FractureSynthesizer,
  FractureObserver,
} from './models/FractureModels.js';

// ══════════════════════════════════════════════════════════════════
//  FRONTEND INTELLIGENCE — 100 Frontend Intelligence Models
// ══════════════════════════════════════════════════════════════════

export { FrontendIntelligenceRegistry, FrontendGroup } from './models/FrontendIntelligenceModels.js';

// ══════════════════════════════════════════════════════════════════
//  PHANTOM BLOCKCHAIN — Quantum-Encrypted Phantom Observers
// ══════════════════════════════════════════════════════════════════

export {
  PhantasmaNoncium,
  PhantasmaHashium,
  PhantomCoordinator,
} from './models/PhantomBlockchainModels.js';

// ══════════════════════════════════════════════════════════════════
//  AI FOUNDATION MODELS — 40 AI Model Families (All AI)
// ══════════════════════════════════════════════════════════════════

export {
  AIFoundationRegistry,
  OrganismRing,
  RoutingPriority,
} from './models/AIFoundationModels.js';

export {
  AIFoundationRouter,
} from './models/AIFoundationRouter.js';

// ══════════════════════════════════════════════════════════════════
//  SHARED TYPES & CONSTANTS
// ══════════════════════════════════════════════════════════════════

export {
  PHI,
  PSI,
  SQRT5,
  GOLDEN_ANGLE,
  PI,
  TWO_PI,
  DimensionalPlane,
  LEX_OBSV_001,
  fibonacciHash,
} from './intelligence/ObserverIntelligence.js';

export type {
  SubIntelligence,
  Observation,
  CareAction,
  ObserverLex,
} from './intelligence/ObserverIntelligence.js';

export type {
  FractureIntelligence,
} from './intelligence/FractureRegistry.js';

export type {
  SovereignNode,
  SovereignCanister,
  SovereignBlock,
  ConsensusRound,
} from './intelligence/SovereignIntelligence.js';

export type {
  CommandResult,
  OrganismStatus,
  AuditEntry,
  DashboardView,
} from './intelligence/TerminalIntelligence.js';

export type {
  ClassifiedDocument,
  SynthesizedPaper,
  DocumentCategory,
} from './intelligence/ScribeIntelligence.js';

export type {
  OrganismBlueprint,
} from './intelligence/ArchitectIntelligence.js';

export type {
  SubstrateNode,
  Route,
  Footprint,
} from './intelligence/NexusIntelligence.js';

export type {
  WellnessLevel,
  CareDivision,
  CareSubstrate,
  NodeRecord,
  CareEvent,
  HabitatStatus,
  CustosLex,
} from './intelligence/CustosIntelligence.js';

export {
  LEX_CUSTOS_001,
} from './intelligence/CustosIntelligence.js';

export type {
  ThreatTier,
  DefenseDivision,
  DefenseSubstrate,
  EndpointRecord,
  DefenseEvent,
  HoneypotField,
  CrusaderUnit,
  PraesidiumLex,
} from './intelligence/PraesidiumIntelligence.js';

export {
  LEX_PRAESIDIUM_001,
} from './intelligence/PraesidiumIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN CANISTERS — Mathematical Element Intelligences
// ══════════════════════════════════════════════════════════════════

export {
  SOVEREIGN_CANISTERS,
  SovereignCanisterRegistry,
} from './intelligence/canisters/SovereignCanisters.js';

export type {
  CanisterElementId,
  ElementProperties,
  SovereignCanister as SovereignElementCanister,
  CanisterIntelligence,
  CanisterComputeResult,
} from './intelligence/canisters/SovereignCanisters.js';

// ══════════════════════════════════════════════════════════════════
//  TOKEN TECHNOLOGIES — 10 Token Techs + 5 Token AI Models + Extensions
// ══════════════════════════════════════════════════════════════════

export {
  TOKEN_TECHNOLOGIES,
  TokenTechnologyRegistry,
  TOKEN_AI_MODELS,
  TokenAIModelRegistry,
  TOKEN_EXTENSIONS,
  TOKEN_SDKS,
  TokenExtensionRegistry,
  PhantomTokenTech,
  createPhantomTokenTech,
  SovereignTokenTech,
  createSovereignTokenTech,
} from './sdk/tokens/index.js';

export type {
  TokenTechId,
  TokenTechnology,
  TokenAICore,
  TokenProcessResult,
  ProcessedToken,
  TokenAIModelId,
  TokenAIModel,
  TokenAICapability,
  TokenAnalysisResult,
  TokenExtensionId,
  TokenSDKId,
  TokenExtension,
  TokenSDKDefinition,
  PhantomStealthLevel,
  PhantomToken,
  PhantomTokenResult,
  PhantomTokenConfig,
  TokenLifecycleState,
  SelfGoverningToken,
  TokenMergeResult,
  TokenSplitResult,
  TokenEvolutionResult,
  SovereignTokenResult,
  SovereignTokenTechConfig,
} from './sdk/tokens/index.js';

// ══════════════════════════════════════════════════════════════════
//  CHAT MINI-AIs — Embedded Intelligence Helpers
// ══════════════════════════════════════════════════════════════════

export {
  MiniAIEngine,
  createMiniAIEngine,
  MINI_AIS,
} from './desktop/NovaChatMiniAIs.js';

export type {
  MiniAIId,
  MiniAIDefinition,
  MiniAICommand,
  MiniAIResponse,
} from './desktop/NovaChatMiniAIs.js';

export type {
  ServerModel,
  ServerSubModel,
  Alert,
  AnalysisResult,
} from './models/ObserverModels.js';

export type {
  SolverResult,
  TheoryResult,
} from './models/ObserverSolverSynthesizers.js';

// ── Custos (Care House) types ────────────────────────────────────

export type {
  CareAlert,
  OverloadPrediction,
  RecoveryPattern,
  HabitatReport,
  EnvironmentOptimization,
  CapacityResult,
} from './models/CustosModels.js';

export type {
  WellnessPattern,
  CareGap,
  CareHypothesis,
  CareTheoryResult,
} from './models/CustosSolverSynthesizers.js';

export type {
  HouseCareCycleResult,
  CaredNode,
  RecoveryOrchestration,
  ManagedHabitat,
  HouseStatus as CareHouseStatus,
} from './models/CustosOrchestrator.js';

// ── Praesidium (Defense House) types ─────────────────────────────

export type {
  CombatResult,
  ShieldDeployment,
  ThreatHuntResult,
  EnvironmentScan,
  AttackTrace,
  DecoyField,
  Fortification,
  VulnerabilityAssessment,
  RepairResult,
} from './models/PraesidiumModels.js';

export type {
  ThreatPattern,
  VulnerabilityChain,
  DefenseHypothesis,
  DefenseTheoryResult,
} from './models/PraesidiumSolverSynthesizers.js';

export type {
  HouseDefenseCycleResult,
  DefendedEndpoint,
  InterceptionOrchestration,
  DeceptionOrchestration,
  FortificationOrchestration,
  HouseStatus as DefenseHouseStatus,
} from './models/PraesidiumOrchestrator.js';

// ── Crown House (Orchestrator of Orchestrators) types ────────────

export type {
  CrownCycleResult,
  CrossHouseReport,
  AdoptionOrchestration,
  OrganismHealthAssessment,
  ExperienceReport,
  CrownStatus,
} from './models/HouseOrchestrator.js';

export type {
  FractureAnalysis,
  FractureComparison,
  SovereignAlternative,
  FractureObservation,
} from './models/FractureModels.js';

export type {
  FrontendIntelligenceModel,
} from './models/FrontendIntelligenceModels.js';

export type {
  PhantomModelId,
  StealthLevel,
  EncryptionTier,
  HashAlgorithm,
  PuzzleType,
  PhantomState,
  HashDiscovery,
  BlockchainPuzzle,
  PhantomSubModel,
  CloakMetrics,
} from './models/PhantomBlockchainModels.js';

export type {
  AIFoundationModel,
  RoutingResult,
  WireState,
  Modality,
  EngineStatus,
} from './models/AIFoundationModels.js';

export type {
  RoutingRequest,
  FusionChain,
  RouterStatus,
} from './models/AIFoundationRouter.js';

// ══════════════════════════════════════════════════════════════════
//  AI EXTENSIONS — 20 Multi-AI Browser Extensions
// ══════════════════════════════════════════════════════════════════

export {
  AIExtensionRegistry,
  ExtensionClass,
} from './extensions/AIExtensionRegistry.js';

export {
  AIExtensionEngine,
} from './extensions/AIExtensionEngine.js';

export type {
  AIExtension,
  EngineBinding,
  EncryptionMode,
  ContractType,
  ExtensionActivation,
} from './extensions/AIExtensionRegistry.js';

export type {
  EncryptionState,
  ContractState,
  ExtensionEngineStatus,
  EdgeManifest,
} from './extensions/AIExtensionEngine.js';

// ══════════════════════════════════════════════════════════════════
//  AI PROTOCOLS — 10 AI-Intelligent Protocols
// ══════════════════════════════════════════════════════════════════

export {
  AIProtocolRegistry,
  ProtocolTier,
} from './protocols/AIProtocolRegistry.js';

export {
  AIProtocolEngine,
} from './protocols/AIProtocolEngine.js';

export type {
  AIProtocol,
  ProtocolEngine as AIProtocolEngineBinding,
  AdaptiveParameter,
  AdaptiveMode,
  ProtocolExecution,
  ProtocolRegistryStatus,
} from './protocols/AIProtocolRegistry.js';

export type {
  ProtocolRuntimeState,
  AdaptiveUpdate,
  ProtocolEngineStatus,
} from './protocols/AIProtocolEngine.js';

// ══════════════════════════════════════════════════════════════════
//  ALPHA PROTOCOLS — 50 Sovereign Alpha Protocols, 500 Calls
// ══════════════════════════════════════════════════════════════════

export {
  AlphaProtocolRegistry,
  ALPHA_PROTOCOL_DEFINITIONS,
  LEX_ALPHA_PROTOCOL_001,
  createAlphaProtocolRegistry,
} from './protocols/AlphaProtocolRegistry.js';

export type {
  AlphaProtocolTier,
  AlphaProtocolId,
  ProtocolCall,
  AlphaProtocolDefinition,
} from './protocols/AlphaProtocolRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  AGI REGISTRY — 20 Sovereign AGIs
// ══════════════════════════════════════════════════════════════════

export {
  AGIRegistry,
  AGI_DEFINITIONS,
  LEX_AGI_001,
  createAGIRegistry,
} from './intelligence/AGIRegistry.js';

export type {
  AGIId,
  AGITier,
  AGIState,
  AGICallTable,
  AGIDefinition,
} from './intelligence/AGIRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  COMMAND CENTER — CENTRUM IMPERIUM
//  32 Terminals, 10 Modules, 5 Ghost Code Engines
// ══════════════════════════════════════════════════════════════════

export {
  CommandCenter,
  ALPHA_TERMINALS,
  COMMAND_CENTER_MODULES,
  GHOST_CODE_ENGINES,
  LEX_CENTRUM_001,
  createCommandCenter,
} from './intelligence/CommandCenter.js';

export type {
  TerminalId,
  TerminalType,
  TerminalState,
  AlphaTerminal,
  CommandCenterModule,
  GhostCodeEngine,
  CommandCenterStatus,
} from './intelligence/CommandCenter.js';

// ══════════════════════════════════════════════════════════════════
//  LATIN PROTOCOL EDICTS — EDICTA PROTOCOLLI LATINI
//  Full Classical Latin text for all 50 Alpha Protocols
// ══════════════════════════════════════════════════════════════════

export {
  LatinProtocolRegistry,
  LATIN_PROTOCOL_EDICTS,
  LEX_LATINA_001,
  createLatinProtocolRegistry,
} from './protocols/LatinProtocolEdicts.js';

export type {
  LatinEdict,
} from './protocols/LatinProtocolEdicts.js';

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN WORKERS — OPERARII SOVEREIGNI
//  8 Cloudflare Worker AGI Mini-Brains, each named in Latin
// ══════════════════════════════════════════════════════════════════

export {
  PrimusWorker,
  CustosWorker,
  MemorWorker,
  FabricaWorker,
  RectorWorker,
  NexusWorker,
  PhantasmaWorker,
  TranscendensWorker,
  SovereignWorkerRegistry,
  SOVEREIGN_WORKER_DEFINITIONS,
  LEX_OPERARII_001,
  createSovereignWorkerRegistry,
} from './intelligence/SovereignWorkers.js';

export type {
  WorkerId,
  WorkerRole,
  WorkerState,
  WorkerRequest,
  WorkerResponse,
  WorkerThought,
  WorkerPulse,
  WorkerResult,
  WorkerStatus,
  WorkerMiniBrain,
  CloudflareWorkerBindings,
  SovereignWorkerInterface,
  SovereignWorkerDefinition,
} from './intelligence/SovereignWorkers.js';

// ══════════════════════════════════════════════════════════════════
//  NOVA MIND PROTOCOLS — 29 protocols completing the 89-protocol suite
//  NMP-001 → NMP-029 across Governance, Operations, Integration, Delivery, Intelligence
// ══════════════════════════════════════════════════════════════════

export {
  NovaMindProtocolRegistry,
  NOVA_MIND_PROTOCOLS,
  LEX_MENTIS_001,
  createNovaMindProtocolRegistry,
} from './protocols/NovaMindProtocols.js';

export type {
  NovaMindProtocolId,
  NovaMindTier,
  NovaMindProtocol,
} from './protocols/NovaMindProtocols.js';

// ══════════════════════════════════════════════════════════════════
//  AGI MINI BRAINS — MENTIS AGI MINIMAE
//  8 cognitive Cloudflare Worker AGI mini-brains
//  ANIMUS · RATIO · MEMORIA · INTELLECTUS · PRUDENTIA · VIGILIA · NEXUS · VOLUNTAS
// ══════════════════════════════════════════════════════════════════

export {
  AnimusMiniBrain,
  RatioMiniBrain,
  MemoriaMiniBrain,
  IntellectusMiniBrain,
  PrudentiaMiniBrain,
  VigiliaMiniBrain,
  NexusMiniBrain,
  VoluntasMiniBrain,
  AGIMiniBrainRegistry,
  AGI_MINI_BRAIN_DEFINITIONS,
  LEX_MENTIS_AGI_001,
  createAGIMiniBrainRegistry,
} from './intelligence/AGIMiniBrains.js';

export type {
  AGIMiniBrainId,
  CognitiveFn,
  BrainState,
  CognitiveInput,
  CognitiveOutput,
  BrainPulse,
  BrainMemoryTrace,
  BrainStatus,
  CFRequest,
  CFResponse,
  AGIMiniBrainDefinition,
} from './intelligence/AGIMiniBrains.js';

// ══════════════════════════════════════════════════════════════════
//  NOVA ENGINE SDK — 23 Sovereign Engines as AI Calls
// ══════════════════════════════════════════════════════════════════

export {
  NovaSDK,
  createNovaSDK,
} from './sdk/NovaEngineSDK.js';

export {
  NovaAPIClient,
} from './sdk/NovaAPIClient.js';

export {
  NovaEngineRegistry,
  NOVA_ENGINES,
} from './sdk/NovaEngineModels.js';

// ── NOVA-OS SDK Runner (top-level functions) ─────────────────────

export {
  boot,
  chat,
  think,
  open,
  code,
  search,
  imagine,
  translate,
  solve,
  execute,
  tokenize,
  countTokens,
  encode,
  visualizeTokens,
  explainTokens,
  engines,
  compareEngines,
  status,
  identity,
  getAGI,
  getOS,
  reboot,
  runCLI,
} from './sdk/NovaOSRunner.js';

// ── Tokenizer ────────────────────────────────────────────────────

export { NovaTokenizer, createTokenizer } from './sdk/NovaTokenizer.js';

// ── SDK Package Manifest ─────────────────────────────────────────

export { NOVA_SDK_MANIFEST, printSDKSummary } from './sdk/NovaSDKPackage.js';

export type {
  NovaOSSDKOptions,
} from './sdk/NovaOSRunner.js';

export type {
  NovaSDKManifest,
  SDKExport,
  PublicRepoIdea,
} from './sdk/NovaSDKPackage.js';

export type {
  NovaToken,
  NovaTokenizerResult,
  NovaTokenizerConfig,
} from './sdk/NovaTokenizer.js';

export type {
  NovaAPIConfig,
  NovaWireRequest,
  NovaWireResponse,
  NovaCognosAPI,
  NovaProfundisAPI,
  NovaFusioAPI,
  NovaLinguaAPI,
  NovaStratosAPI,
  NovaMemoriaAPI,
  NovaVectorAPI,
  NovaCodexAPI,
  NovaPictorAPI,
  NovaKinemaAPI,
  NovaHarmoniaAPI,
  NovaSegmentumAPI,
  NovaScrutatorAPI,
  NovaCustodisAPI,
  NovaRankerAPI,
  NovaFormalisAPI,
  NovaAlgorithmusAPI,
  NovaVoxAPI,
  NovaSocialisAPI,
  NovaEmpathosAPI,
  NovaAnalyticaAPI,
  NovaStructuraAPI,
  NovaVisioAPI,
} from './sdk/NovaAPIClient.js';

export type {
  NovaModality,
  NovaEngineId,
  NovaWireSlug,
  NovaEngineDefinition,
  NovaMessage,
  NovaFunctionDef,
  NovaChatRequest,
  NovaChatResponse,
  NovaChatStreamChunk,
  NovaEmbeddingRequest,
  NovaEmbeddingResponse,
  NovaImageRequest,
  NovaImageResponse,
  NovaVideoRequest,
  NovaVideoResponse,
  NovaAudioRequest,
  NovaAudioResponse,
  NovaCodeRequest,
  NovaCodeResponse,
  NovaSearchRequest,
  NovaSearchResponse,
  NovaSafetyRequest,
  NovaSafetyResponse,
  NovaRankRequest,
  NovaRankResponse,
} from './sdk/NovaEngineModels.js';

// ══════════════════════════════════════════════════════════════════
//  BROWSER EXTENSIONS — Cross-Browser Runtime + Manifest Generator
// ══════════════════════════════════════════════════════════════════

export {
  detectBrowser,
  createMessage,
  sendMessage,
  onMessage,
  sendToTab,
  loadConfig,
  saveConfig,
  setBadge,
  setExtensionIcon,
  openSidePanel,
  setSidePanelOptions,
} from './browser/NovaExtensionRuntime.js';

export { NovaManifestGenerator } from './browser/NovaExtensionManifestGenerator.js';
export { NovaContentScript } from './browser/NovaContentScript.js';
export { NovaBackgroundWorker } from './browser/NovaBackgroundWorker.js';
export { NovaPopupController } from './browser/NovaPopupController.js';

export type {
  BrowserType,
  NovaMessageType,
  NovaExtensionMessage,
  NovaStorageConfig,
} from './browser/NovaExtensionRuntime.js';

export type {
  ManifestV3,
} from './browser/NovaExtensionManifestGenerator.js';

export type {
  NovaSidebarConfig,
} from './browser/NovaContentScript.js';

export type {
  PopupTab,
  PopupState,
} from './browser/NovaPopupController.js';

// ══════════════════════════════════════════════════════════════════
//  NOVA-OS — Sovereign Desktop AGI Operating System
// ══════════════════════════════════════════════════════════════════

export {
  NovaOS,
  NOVA_OS_IDENTITY,
  createNovaOS,
} from './desktop/NovaOS.js';

export {
  NovaDesktopAGI,
  createDesktopAGI,
} from './desktop/NovaDesktopAGI.js';

export { NovaChatTerminal } from './desktop/NovaChatTerminal.js';
export { NovaAppController } from './desktop/NovaAppController.js';
export { NovaEngineComparison, EXTERNAL_MODELS } from './desktop/NovaEngineComparison.js';

export type {
  NovaOSState,
  NovaOSService,
} from './desktop/NovaOS.js';

export type {
  AGIIntent,
  AGIIntentResult,
  AGIResponse,
} from './desktop/NovaDesktopAGI.js';

export type {
  TerminalCommandType,
  ParsedCommand,
  TerminalMessage,
  TerminalSession,
  TerminalConfig,
} from './desktop/NovaChatTerminal.js';

export type {
  AppPlatform,
  AppLaunchRequest,
  AppLaunchResult,
  RunningProcess,
  ShellCommand,
  ShellResult,
  FileAction,
  FileActionResult,
  SystemAction,
  SystemActionResult,
  AppAuditEntry,
} from './desktop/NovaAppController.js';

export type {
  ExternalModelProfile,
  EngineComparison,
  EngineComparisonMatrix,
  FullComparisonReport,
  ComparisonSummary,
} from './desktop/NovaEngineComparison.js';

// ══════════════════════════════════════════════════════════════════
//  ANIMA MICRO — Protocol + Database + Callable (Mini Brain/Heart)
// ══════════════════════════════════════════════════════════════════

export {
  AnimaMicro,
  AnimaDatabase,
  ANIMA_PROTOCOL_SPEC,
  createAnimaMicro,
  createAnimaDatabase,
} from './protocols/AnimaMicro.js';

export type {
  AnimaState,
  AnimaKind,
  PulseRecord,
  ThoughtRecord,
  ReflectionRecord,
  AnimaCallTable,
  AnimaStatus,
  AnimaProtocolSpec,
  AnimaDatabaseEntry,
  AnimaDatabaseStats,
} from './protocols/AnimaMicro.js';

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN DATABASE — Unified Living Database (All Worlds)
// ══════════════════════════════════════════════════════════════════

export {
  SovereignDatabase,
  createSovereignDatabase,
} from './protocols/SovereignDatabase.js';

export type {
  EntityCategory,
  WorldView,
  SovereignEntity,
  WorldProjection,
  DatabaseStats as SovereignDatabaseStats,
  DatabaseQuery,
  DatabaseMigration,
  CategoryManifest,
} from './protocols/SovereignDatabase.js';

// ══════════════════════════════════════════════════════════════════
//  ALPHA SCRIPT AIs — 10 Autonomous Script Intelligences
// ══════════════════════════════════════════════════════════════════

export {
  AlphaScriptAI,
  AlphaScriptAIRegistry,
  ALPHA_SCRIPT_AIS,
  ALPHA_SCRIPT_AI_DEFINITIONS,
  createAlphaScriptAIRegistry,
} from './intelligence/AlphaScriptAIs.js';

export type {
  ScriptAIId,
  ScriptAICategory,
  ScriptAIState,
  ScriptAICallTable,
  ScriptAIThought,
  ScriptAIResult,
  ScriptAIPulse,
  ScriptAIArtifact,
  ScriptAIStatus,
  ScriptAIDefinition,
} from './intelligence/AlphaScriptAIs.js';

// ══════════════════════════════════════════════════════════════════
//  MARKETPLACE — AI Workforce + Generative Frontend + Spatial Canvas
// ══════════════════════════════════════════════════════════════════

export {
  GenerativeUIEngine,
  createGenerativeUIEngine,
  SpatialCanvasSDK,
  createSpatialCanvasSDK,
  LANGUAGE_AIS,
  MULTI_GROUP_MODELS,
  LANGUAGE_AI_GROUP_INDEX,
  LanguageAIRegistry,
  AIWorkforceOrchestrator,
  createAIWorkforceOrchestrator,
  NATIVE_NOVA_AIS,
  NOVA_AI_GROUPS,
  NativeNovaAIRegistry,
  SovereignEncryptionSDK,
  createSovereignEncryptionSDK,
  SovereignTokenEngine,
  createSovereignTokenEngine,
  LegalParalegalAI,
  createLegalParalegalAI,
  SovereignIdentitySDK,
  createSovereignIdentitySDK,
  SovereignDataMeshSDK,
  createSovereignDataMeshSDK,
  SovereignNetworkSDK,
  createSovereignNetworkSDK,
  MarketplaceCategoryRegistry,
  createMarketplaceCategoryRegistry,
  MARKETPLACE_CATEGORIES,
} from './marketplace/index.js';

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
  EngineKind,
  LanguageEngine,
  LanguageAIGroup,
  AIBuildRole,
  AITier,
  AIWorkerStatus,
  LanguageAI,
  MultiGroupAIModel,
  LanguageAIResult,
  BuildIntent,
  AITask,
  PipelineStage,
  BuildPipeline,
  AIMemoryEntry,
  WorkforceStats,
  NovaEngineKind,
  NovaIntelligenceTier,
  NovaOperationalMode,
  NovaAIStatus,
  NovaEngine,
  NativeNovaAI,
  NovaAIGroup,
  NovaAIResult,
  HashResult,
  DerivedKey,
  E8Vector,
  E8EncryptedPayload,
  PhantomProof,
  PhiCascadeResult,
  EncryptionConfig,
  IntegrityResult,
  EncryptionTier as SovereignEncryptionTier,
  TokenKind,
  SovereignToken,
  ProvenanceRecord,
  AttestedTokenSequence,
  TokenAnalysis,
  TokenEconomics,
  TokenAIModel as SovereignTokenAIModel,
  TokenEngineConfig,
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
  IdentityTier,
  FibonacciFingerprint,
  GoldenSignature,
  SovereignPassport,
  DimensionalIdentity,
  AttestationChainLink,
  AttestationChain,
  IdentityConfig,
  DataMeshTier,
  GoldenStoreEntry,
  FibonacciTreeNode,
  PhiGraphNode,
  PhiGraphEdge,
  DimensionalVaultEntry,
  MeshNode,
  DataMeshStats,
  DataMeshConfig,
  NetworkTier,
  WireMessage,
  FibonacciChannel,
  MeshRoute,
  DimensionalBridge,
  PhantomRelay as MarketplacePhantomRelay,
  NetworkStats,
  NetworkConfig,
  MarketplaceCategoryId,
  MarketplaceCategory,
  MarketplaceProduct,
  MarketplaceStats,
} from './marketplace/index.js';

// ══════════════════════════════════════════════════════════════════
//  GENESIS — The Sovereign Boot Sequence
//  Every entity is born alive.  The system is its own user.
//  A database, a registry, a marketplace — each is a full copy
//  of protocol + database + callable, running on its own.
// ══════════════════════════════════════════════════════════════════

export {
  Genesis,
  genesis,
  createGenesis,
  ignite,
  startGenesis,
  stopGenesis,
} from './Genesis.js';

export type {
  GenesisEntity,
  GenesisStatus,
  InternalCall,
  HeartbeatCycleReport,
} from './Genesis.js';
// ══════════════════════════════════════════════════════════════════
//  ANTIFRAGILITY ENGINE — Paper II & III
//  Friston Free Energy + Lotka-Volterra + Hormetic cycles
//  antifragilityScore += vicenteVictoryCount × φ × (1 − chronicFearLevel)
//  SL-0 Vampire Gate: unauthorized energy extraction countermeasure
// ══════════════════════════════════════════════════════════════════

export {
  FristonFreeEnergyEngine,
  LotkaVolterraEngine,
  HormeticCycleEngine,
  AntifragilityEngine,
  SL0VampireGate,
  LEX_TIMORE_001,
  LEX_SL0_001,
  createAntifragilityEngine,
  createSL0VampireGate,
  makeExtractionEvent,
} from './intelligence/AntifragilityEngine.js';

export type {
  FearVector,
  HormeticCycle,
  AntifragilityState,
  FristonState,
  LotkaVolterraState,
  EnergyExtractionEvent,
  VampireDetectionResult,
  SL0GateStatus,
} from './intelligence/AntifragilityEngine.js';

// ══════════════════════════════════════════════════════════════════
//  BEHAVIORAL ECONOMICS LAWS — Paper V
//  Laws L-72 through L-79 as substrate math
//  Kahneman-Tversky Prospect Theory: losses weighted 2.25× more than gains
// ══════════════════════════════════════════════════════════════════

export {
  LOSS_AVERSION_LAMBDA,
  PROSPECT_ALPHA,
  PROSPECT_BETA,
  LEX_OECONOMIA_001,
  ALL_BEHAVIORAL_LAWS,
  LAW_L72_REWARD_SIGNAL,
  LAW_L73_DATA_REWARD_EQUIVALENCE,
  LAW_L74_BEHAVIORAL_ASYMMETRY,
  LAW_L75_VARIABLE_EMERGENCE,
  LAW_L76_FLOW_STATE,
  LAW_L77_DRIVE_COMMITMENT,
  LAW_L78_HORMETIC_STRESS,
  LAW_L79_TEMPORAL_DISCOUNTING,
  BehavioralEconomicsEngine,
  prospectValue,
  computeL72,
  computeL73,
  computeL74,
  computeL75,
  computeL76,
  computeL77,
  computeL78,
  computeL79,
  createBehavioralEconomicsEngine,
} from './intelligence/BehavioralEconomicsLaws.js';

export type {
  ProspectOutcome,
  RewardSignalInput,
  RewardSignalOutput,
  DataRewardInput,
  DataRewardOutput,
  BehavioralAsymmetryInput,
  BehavioralAsymmetryOutput,
  VariableEmergenceInput,
  VariableEmergenceOutput,
  FlowStateInput,
  FlowStateOutput,
  DriveCommitmentInput,
  DriveCommitmentOutput,
  HormeticStressInput,
  HormeticStressOutput,
  TemporalDiscountingInput,
  TemporalDiscountingOutput,
  BehavioralState,
} from './intelligence/BehavioralEconomicsLaws.js';

// ══════════════════════════════════════════════════════════════════
//  FRACTAL SOVEREIGNTY — Paper IV
//  S₀ = 0.75 at every scale: cell → organ → organism → empire
//  Kuramoto synchronization proves the fractal law holds system-wide
// ══════════════════════════════════════════════════════════════════

export {
  SOVEREIGNTY_FLOOR,
  FRACTAL_PHI_EXPONENT,
  LEX_FRACTALIS_001,
  KuramotoEngine,
  FractalSovereigntyRegistry,
  createFractalSovereigntyRegistry,
} from './intelligence/FractalSovereignty.js';

export type {
  SovereignScale,
  SovereigntyViolation,
  FractalLawValidation,
  KuramotoState,
} from './intelligence/FractalSovereignty.js';

// ══════════════════════════════════════════════════════════════════
//  FIVE FAMILY ENGINE — Perpetual Execution Engines
//  QUERIES → MUTATIONS → PROTOCOLS → BLUEPRINTS → BRIDGES
//  sovereign_db is the single source of truth every loop reads
//  from and writes to. The organism is always running.
//  LEX FAMILIA-001: "The five families are perpetual engines."
// ══════════════════════════════════════════════════════════════════

export {
  LEX_FAMILIA_001,
  SovereignDb,
  QueryFamily,
  MutationFamily,
  ProtocolFamily,
  BlueprintFamily,
  BridgeFamily,
  FiveFamilyEngine,
  createFiveFamilyEngine,
  createSovereignDb,
} from './protocols/FiveFamilyEngine.js';

export type {
  FamilyKind,
  SovereignDbDomain,
  SovereignDbValue,
  SovereignDbEntry,
  PendingMutation,
  DoctrineRule,
  NexorisSignalKind,
  NexorisSignal,
  NexorisContractLoop,
  BridgeCallKind,
  BridgeCall,
  PortaSovereignaHandshake,
  BlueprintKind,
  BlueprintSpawnCondition,
  SpawnedStructure,
  QueryFamilyCycleResult,
  MutationFamilyCycleResult,
  ProtocolFamilyCycleResult,
  BlueprintFamilyCycleResult,
  BridgeFamilyCycleResult,
  FiveFamilyCycleReport,
} from './protocols/FiveFamilyEngine.js';
