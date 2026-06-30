///
/// AGENTS INDEX — 40 Alpha Agents + Call Registry + Call Market
///
/// ═══════════════════════════════════════════════════════════════════════
///  THE ALWAYS-RUNNING WORKFORCE.  THE CALL MARKET ENGINE.
/// ═══════════════════════════════════════════════════════════════════════
///
/// This module exposes:
///   - 40 Alpha Agents across 8 divisions (5 per division)
///   - Call Registry Core — searchable, machine-readable callable tools
///   - Call Market — three parallel market surfaces:
///       1. Internal Call Market
///       2. Developer Call Market
///       3. AI-Native Call Market
///   - Enterprise Bundles — tiered call packages
///
/// Architecture:
///   ┌──────────────────────────────────────────────────────────────────┐
///   │                      CALL MARKET                                │
///   ├──────────────────┬──────────────────┬──────────────────────────┤
///   │  INTERNAL        │  DEVELOPER       │  AI-NATIVE              │
///   │  Organisms       │  Outside builders│  AI agents              │
///   │  Full access     │  SDK + API keys  │  Discovery + chaining   │
///   │  Virtual pricing │  Tiered pricing  │  Machine-readable       │
///   ├──────────────────┴──────────────────┴──────────────────────────┤
///   │                    CALL REGISTRY                               │
///   │  40 registered calls · search · chain · validate · invoke     │
///   ├───────────────────────────────────────────────────────────────┤
///   │                   40 ALPHA AGENTS                              │
///   │  8 divisions · 120 engines · always running · φ-weighted      │
///   ├─────────┬─────────┬──────────┬──────────┬─────────┬──────────┤
///   │ Exterior│ Web     │ Rendering│ Data Str │ Runtime │ Models   │
///   │ Orch.   │ Workers │ Workers  │ Workers  │ Workers │ Workers  │
///   ├─────────┼─────────┼──────────┼──────────┼─────────┼──────────┤
///   │ Market  │ Infra   │          │          │         │          │
///   │ Ctrl.   │ Orch.   │          │          │         │          │
///   └─────────┴─────────┴──────────┴──────────┴─────────┴──────────┘
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════
//  ALPHA AGENT REGISTRY — 40 Always-Running Alpha Agents
// ══════════════════════════════════════════════════════════════════

export {
  ALPHA_AGENTS,
  AGENT_DIVISIONS,
  AlphaAgentRegistry,
} from './AlphaAgentRegistry.js';

export type {
  AgentDivision,
  AgentTier,
  AgentStatus,
  CostClass,
  LatencyClass,
  SecurityTier,
  AgentEngineKind,
  AgentEngine,
  CallableMetadata,
  CallInput,
  AlphaAgent,
  AgentDivisionGroup,
  AgentCallResult,
} from './AlphaAgentRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  CALL REGISTRY — Searchable, Discoverable, Machine-Readable
// ══════════════════════════════════════════════════════════════════

export {
  REGISTERED_CALLS,
  CallRegistry,
} from './CallRegistry.js';

export type {
  CallCategory,
  RegisteredCall,
  CallSearchQuery,
  CallSearchResult,
  CallChain,
  CallChainStep,
} from './CallRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  CALL MARKET — Three Parallel Market Surfaces
// ══════════════════════════════════════════════════════════════════

export {
  ENTERPRISE_BUNDLES,
  InternalCallMarket,
  DeveloperCallMarket,
  AINativeCallMarket,
  CallMarket,
} from './CallMarket.js';

export type {
  MarketSurface,
  MarketPermission,
  MarketPrincipal,
  MarketInvocation,
  MarketInvocationResult,
  AIDiscoveryResult,
  DeveloperSDKConfig,
  EnterpriseBundle,
} from './CallMarket.js';
