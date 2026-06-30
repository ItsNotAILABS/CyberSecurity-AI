///
/// TOKEN SECTION INDEX — Complete Token Technology Barrel Exports
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// ── 10 Token Technologies ────────────────────────────────────────
export {
  TOKEN_TECHNOLOGIES,
  TokenTechnologyRegistry,
} from './TokenTechnologies.js';

export type {
  TokenTechId,
  TokenTechnology,
  TokenAICore,
  TokenProcessResult,
  ProcessedToken,
} from './TokenTechnologies.js';

// ── 5 Token AI Models ────────────────────────────────────────────
export {
  TOKEN_AI_MODELS,
  TokenAIModelRegistry,
} from './TokenAIModels.js';

export type {
  TokenAIModelId,
  TokenAIModel,
  TokenAICapability,
  TokenAnalysisResult,
} from './TokenAIModels.js';

// ── Token Extensions & SDKs ─────────────────────────────────────
export {
  TOKEN_EXTENSIONS,
  TOKEN_SDKS,
  TokenExtensionRegistry,
} from './extensions/TokenExtensions.js';

export type {
  TokenExtensionId,
  TokenSDKId,
  TokenExtension,
  TokenSDKDefinition,
} from './extensions/TokenExtensions.js';

// ── Token Tech 11: PHANTOM — Stealth-Mode Tokens ────────────────
export {
  PhantomTokenTech,
  createPhantomTokenTech,
} from './PhantomTokenTech.js';

export type {
  StealthLevel as PhantomStealthLevel,
  PhantomToken,
  PhantomTokenResult,
  PhantomTokenConfig,
} from './PhantomTokenTech.js';

// ── Token Tech 12: SOVEREIGN — Self-Governing Tokens ────────────
export {
  SovereignTokenTech,
  createSovereignTokenTech,
} from './SovereignTokenTech.js';

export type {
  TokenLifecycleState,
  SelfGoverningToken,
  TokenMergeResult,
  TokenSplitResult,
  TokenEvolutionResult,
  SovereignTokenResult,
  SovereignTokenTechConfig,
} from './SovereignTokenTech.js';
