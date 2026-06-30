///
/// SDK INDEX — Nova Engine SDK Barrel Exports
///
/// This is the single import for the entire NOVA-OS SDK.
///
/// Quick start:
///   import { boot, chat, open, tokenize, engines } from './sdk/index.js';
///
///   boot();
///   console.log(chat('Hello!'));
///   console.log(tokenize('Hello world').tokens);
///   console.log(engines());
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// ── NOVA-OS SDK Runner (top-level API) ───────────────────────────
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
} from './NovaOSRunner.js';

// ── SDK Package Manifest ─────────────────────────────────────────
export { NOVA_SDK_MANIFEST, printSDKSummary } from './NovaSDKPackage.js';

// ── Tokenizer ────────────────────────────────────────────────────
export { NovaTokenizer, createTokenizer } from './NovaTokenizer.js';

// ── SDK entry point (class-based) ────────────────────────────────
export { NovaSDK, createNovaSDK } from './NovaEngineSDK.js';

// ── API Client (lower-level) ─────────────────────────────────────
export { NovaAPIClient } from './NovaAPIClient.js';

// ── Engine definitions & registry ────────────────────────────────
export {
  NovaEngineRegistry,
  NOVA_ENGINES,
} from './NovaEngineModels.js';

// ── Types: SDK Runner ────────────────────────────────────────────
export type { NovaOSSDKOptions } from './NovaOSRunner.js';

// ── Types: SDK Package ───────────────────────────────────────────
export type {
  NovaSDKManifest,
  SDKExport,
  PublicRepoIdea,
} from './NovaSDKPackage.js';

// ── Types: Tokenizer ─────────────────────────────────────────────
export type {
  NovaToken,
  NovaTokenizerResult,
  NovaTokenizerConfig,
} from './NovaTokenizer.js';

// ── Types: API Client ────────────────────────────────────────────
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
} from './NovaAPIClient.js';

// ── Types: Engine Models ─────────────────────────────────────────
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
} from './NovaEngineModels.js';

// ══════════════════════════════════════════════════════════════════
//  TOKEN TECHNOLOGIES — 10 Token Techs + 5 Token AI Models + Extensions
// ══════════════════════════════════════════════════════════════════

// ── 10 Token Technologies ────────────────────────────────────────
export {
  TOKEN_TECHNOLOGIES,
  TokenTechnologyRegistry,
} from './tokens/TokenTechnologies.js';

export type {
  TokenTechId,
  TokenTechnology,
  TokenAICore,
  TokenProcessResult,
  ProcessedToken,
} from './tokens/TokenTechnologies.js';

// ── 5 Token AI Models ────────────────────────────────────────────
export {
  TOKEN_AI_MODELS,
  TokenAIModelRegistry,
} from './tokens/TokenAIModels.js';

export type {
  TokenAIModelId,
  TokenAIModel,
  TokenAICapability,
  TokenAnalysisResult,
} from './tokens/TokenAIModels.js';

// ── Token Extensions & SDKs ─────────────────────────────────────
export {
  TOKEN_EXTENSIONS,
  TOKEN_SDKS,
  TokenExtensionRegistry,
} from './tokens/extensions/TokenExtensions.js';

export type {
  TokenExtensionId,
  TokenSDKId,
  TokenExtension,
  TokenSDKDefinition,
} from './tokens/extensions/TokenExtensions.js';
