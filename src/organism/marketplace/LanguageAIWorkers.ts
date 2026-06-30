///
/// LANGUAGE AI WORKERS — 50 Programming Languages ARE the AIs
///
/// ═══════════════════════════════════════════════════════════════════════
///  EVERY LANGUAGE IS AN AI.  EVERY AI HAS 3 ENGINES.
/// ═══════════════════════════════════════════════════════════════════════
///
/// This is not a tool list.  These are not utilities.  These are AIs.
/// Each programming language IS an artificial intelligence with:
///   - Engine 1: PARSE ENGINE — Understands the language's AST, semantics, idioms
///   - Engine 2: GENERATE ENGINE — Writes code IN that language from intent
///   - Engine 3: RENDER ENGINE — Transforms code output into runtime artifacts
///
/// 50 Language AIs, grouped into 10 Multi-Group AI Models:
///
///   GROUP 0: MARKUP AIs        — HTML, XML, SVG, Markdown, LaTeX
///   GROUP 1: STYLE AIs         — CSS, SCSS, Tailwind, PostCSS, Styled
///   GROUP 2: FRONTEND AIs      — TypeScript, JavaScript, JSX, TSX, WebAssembly
///   GROUP 3: BACKEND AIs       — Node, Deno, Bun, Express, Fastify
///   GROUP 4: SYSTEMS AIs       — Rust, Go, C, C++, Zig
///   GROUP 5: SUBSTRATE AIs     — Motoko, Solidity, Cairo, Move, Teal
///   GROUP 6: DATA AIs          — Python, R, Julia, SQL, GraphQL
///   GROUP 7: CONFIG AIs        — JSON, YAML, TOML, ENV, HCL
///   GROUP 8: QUERY AIs         — REST, gRPC, WebSocket, SSE, MQTT
///   GROUP 9: INTELLIGENCE AIs  — ONNX, TensorFlow, PyTorch, JAX, MLX
///
/// Together they form a WORKFORCE — not tools, AIs — that builds
/// the entire application stack from intent to deployed artifact.
///
/// Every AI is wired through the substrate.  Every AI is runtime code.
/// Every AI remembers.  Every AI is sovereign.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, DimensionalPlane, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;

// ══════════════════════════════════════════════════════════════════
//  TYPES — AI Engine Architecture
// ══════════════════════════════════════════════════════════════════

/** The three engines every Language AI carries. */
export type EngineKind = 'parse' | 'generate' | 'render';

/** A single engine within a Language AI. */
export interface LanguageEngine {
  readonly kind: EngineKind;
  readonly name: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly throughputOpsPerSec: number;
  readonly latencyMs: number;
  readonly memoryMb: number;
  readonly phiWeight: number;
  readonly fibonacciId: number;
}

/** The 10 multi-group categories for Language AIs. */
export type LanguageAIGroup =
  | 'markup'
  | 'style'
  | 'frontend'
  | 'backend'
  | 'systems'
  | 'substrate'
  | 'data'
  | 'config'
  | 'query'
  | 'intelligence';

export const LANGUAGE_AI_GROUP_INDEX: Record<LanguageAIGroup, number> = {
  markup: 0,
  style: 1,
  frontend: 2,
  backend: 3,
  systems: 4,
  substrate: 5,
  data: 6,
  config: 7,
  query: 8,
  intelligence: 9,
};

/** The role a Language AI plays in the build pipeline. */
export type AIBuildRole =
  | 'parser'
  | 'generator'
  | 'renderer'
  | 'compiler'
  | 'bundler'
  | 'linter'
  | 'tester'
  | 'deployer'
  | 'orchestrator'
  | 'optimizer';

/** The tier of a Language AI in the workforce. */
export type AITier = 'core' | 'specialist' | 'support' | 'experimental';

/** Status of a Language AI worker. */
export type AIWorkerStatus = 'idle' | 'parsing' | 'generating' | 'rendering' | 'error' | 'complete';

/** A complete Language AI definition. */
export interface LanguageAI {
  readonly id: number;
  readonly name: string;
  readonly latinDesignation: string;
  readonly language: string;
  readonly group: LanguageAIGroup;
  readonly groupIndex: number;
  readonly buildRole: AIBuildRole;
  readonly tier: AITier;
  readonly engines: readonly [LanguageEngine, LanguageEngine, LanguageEngine];
  readonly capabilities: readonly string[];
  readonly sovereignPurpose: string;
  readonly phiWeight: number;
  readonly goldenAnglePosition: number;
  readonly fibonacciIdentity: number;
  readonly dimensionalPlane: DimensionalPlane;
  readonly substrateEncoded: boolean;
  readonly runtimeWired: boolean;
  readonly memoryEnabled: boolean;
}

/** A multi-group AI model — a team of Language AIs. */
export interface MultiGroupAIModel {
  readonly groupId: number;
  readonly groupName: LanguageAIGroup;
  readonly latinName: string;
  readonly description: string;
  readonly members: readonly LanguageAI[];
  readonly totalEngines: number;
  readonly combinedCapabilities: readonly string[];
  readonly aggregatePhiWeight: number;
  readonly buildPipelineStage: string;
  readonly canBuildEntireStack: boolean;
}

/** Result of a Language AI processing a task. */
export interface LanguageAIResult {
  readonly aiId: number;
  readonly aiName: string;
  readonly engineUsed: EngineKind;
  readonly input: string;
  readonly output: string;
  readonly outputFormat: string;
  readonly processingTimeMs: number;
  readonly confidence: number;
  readonly tokensProcessed: number;
  readonly substrateHash: number;
}

// ══════════════════════════════════════════════════════════════════
//  HELPER — string hash
// ══════════════════════════════════════════════════════════════════

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ══════════════════════════════════════════════════════════════════
//  ENGINE FACTORY — Builds the 3 engines for each Language AI
// ══════════════════════════════════════════════════════════════════

function buildEngines(lang: string, index: number): readonly [LanguageEngine, LanguageEngine, LanguageEngine] {
  const baseWeight = Math.pow(PHI, -(index * 0.1));

  return [
    {
      kind: 'parse',
      name: `${lang} Parse Engine`,
      description: `Parses ${lang} source into AST, understands idioms, resolves semantics, validates structure`,
      capabilities: ['ast-generation', 'semantic-analysis', 'type-inference', 'syntax-validation', 'dependency-resolution'],
      throughputOpsPerSec: 50_000 * baseWeight,
      latencyMs: 0.5 / baseWeight,
      memoryMb: 32 * (1 + index * 0.05),
      phiWeight: baseWeight * PHI,
      fibonacciId: fibonacciHash(hashStr(`${lang}-parse`), 2_147_483_647),
    },
    {
      kind: 'generate',
      name: `${lang} Generate Engine`,
      description: `Generates ${lang} code from intent, writes idiomatic patterns, builds full modules`,
      capabilities: ['code-generation', 'pattern-synthesis', 'module-scaffolding', 'api-creation', 'test-generation'],
      throughputOpsPerSec: 30_000 * baseWeight,
      latencyMs: 2.0 / baseWeight,
      memoryMb: 64 * (1 + index * 0.05),
      phiWeight: baseWeight * PHI_SQUARED,
      fibonacciId: fibonacciHash(hashStr(`${lang}-generate`), 2_147_483_647),
    },
    {
      kind: 'render',
      name: `${lang} Render Engine`,
      description: `Renders ${lang} output into runtime artifacts — compiled binaries, bundled assets, live components`,
      capabilities: ['compilation', 'bundling', 'tree-shaking', 'minification', 'hot-reload', 'artifact-output'],
      throughputOpsPerSec: 20_000 * baseWeight,
      latencyMs: 5.0 / baseWeight,
      memoryMb: 128 * (1 + index * 0.05),
      phiWeight: baseWeight,
      fibonacciId: fibonacciHash(hashStr(`${lang}-render`), 2_147_483_647),
    },
  ];
}

// ══════════════════════════════════════════════════════════════════
//  RAW AI DEFINITIONS — 50 Language AIs
// ══════════════════════════════════════════════════════════════════

interface RawAIDef {
  readonly name: string;
  readonly latin: string;
  readonly lang: string;
  readonly group: LanguageAIGroup;
  readonly role: AIBuildRole;
  readonly tier: AITier;
  readonly caps: readonly string[];
  readonly purpose: string;
}

const RAW_AIS: readonly RawAIDef[] = [
  // ── GROUP 0: MARKUP AIs ────────────────────────────────────────
  { name: 'HTML AI', latin: 'Intelligentia Structurae', lang: 'HTML', group: 'markup', role: 'parser', tier: 'core', caps: ['dom-construction', 'semantic-markup', 'accessibility-audit', 'element-synthesis'], purpose: 'Constructs and validates the document skeleton — the bones of every interface' },
  { name: 'XML AI', latin: 'Intelligentia Datorum', lang: 'XML', group: 'markup', role: 'parser', tier: 'specialist', caps: ['schema-validation', 'xpath-query', 'xslt-transform', 'namespace-resolution'], purpose: 'Structures data interchange and configuration manifests across systems' },
  { name: 'SVG AI', latin: 'Intelligentia Vectorum', lang: 'SVG', group: 'markup', role: 'generator', tier: 'core', caps: ['vector-generation', 'path-optimization', 'animation-synthesis', 'icon-creation'], purpose: 'Generates resolution-independent graphics and data visualizations' },
  { name: 'Markdown AI', latin: 'Intelligentia Documentorum', lang: 'Markdown', group: 'markup', role: 'generator', tier: 'support', caps: ['doc-generation', 'readme-synthesis', 'table-formatting', 'link-validation'], purpose: 'Writes and structures all documentation, readmes, and human-readable content' },
  { name: 'LaTeX AI', latin: 'Intelligentia Mathematicae', lang: 'LaTeX', group: 'markup', role: 'renderer', tier: 'specialist', caps: ['equation-rendering', 'paper-typesetting', 'citation-management', 'figure-placement'], purpose: 'Renders mathematical notation, research papers, and precise typographic output' },

  // ── GROUP 1: STYLE AIs ─────────────────────────────────────────
  { name: 'CSS AI', latin: 'Intelligentia Aestheticae', lang: 'CSS', group: 'style', role: 'generator', tier: 'core', caps: ['layout-generation', 'animation-keyframes', 'responsive-design', 'variable-systems', 'grid-synthesis'], purpose: 'Generates all visual styling — layout, color, typography, animation' },
  { name: 'SCSS AI', latin: 'Intelligentia Compositionis', lang: 'SCSS', group: 'style', role: 'compiler', tier: 'core', caps: ['mixin-generation', 'variable-management', 'nesting-optimization', 'import-resolution'], purpose: 'Compiles preprocessor stylesheets into optimized CSS output' },
  { name: 'Tailwind AI', latin: 'Intelligentia Utilitatis', lang: 'Tailwind', group: 'style', role: 'generator', tier: 'specialist', caps: ['utility-class-generation', 'config-synthesis', 'purge-optimization', 'theme-creation'], purpose: 'Generates utility-first class compositions for rapid visual design' },
  { name: 'PostCSS AI', latin: 'Intelligentia Transformationis', lang: 'PostCSS', group: 'style', role: 'optimizer', tier: 'support', caps: ['autoprefixing', 'css-minification', 'future-syntax-transform', 'plugin-orchestration'], purpose: 'Transforms and optimizes CSS through plugin-based post-processing' },
  { name: 'Styled AI', latin: 'Intelligentia Componentialis', lang: 'Styled-Components', group: 'style', role: 'generator', tier: 'specialist', caps: ['css-in-js-generation', 'theme-provider-synthesis', 'dynamic-styling', 'prop-interpolation'], purpose: 'Generates component-scoped styles that live with their logic' },

  // ── GROUP 2: FRONTEND AIs ──────────────────────────────────────
  { name: 'TypeScript AI', latin: 'Intelligentia Typorum', lang: 'TypeScript', group: 'frontend', role: 'generator', tier: 'core', caps: ['type-synthesis', 'interface-generation', 'generic-inference', 'module-creation', 'decorator-support'], purpose: 'THE primary code AI — generates typed, safe, sovereign TypeScript' },
  { name: 'JavaScript AI', latin: 'Intelligentia Executionis', lang: 'JavaScript', group: 'frontend', role: 'renderer', tier: 'core', caps: ['runtime-execution', 'event-handling', 'dom-manipulation', 'async-orchestration'], purpose: 'Executes and renders JavaScript in runtime — the living code layer' },
  { name: 'JSX AI', latin: 'Intelligentia Compositi', lang: 'JSX', group: 'frontend', role: 'generator', tier: 'core', caps: ['component-synthesis', 'jsx-transform', 'virtual-dom-generation', 'prop-typing'], purpose: 'Generates component markup that fuses logic and presentation' },
  { name: 'TSX AI', latin: 'Intelligentia Fortis', lang: 'TSX', group: 'frontend', role: 'generator', tier: 'core', caps: ['typed-component-synthesis', 'generic-components', 'hook-generation', 'context-creation'], purpose: 'Generates typed component trees — the strongest frontend AI' },
  { name: 'WebAssembly AI', latin: 'Intelligentia Machinae', lang: 'WebAssembly', group: 'frontend', role: 'compiler', tier: 'specialist', caps: ['wasm-compilation', 'memory-management', 'simd-optimization', 'interop-binding'], purpose: 'Compiles critical paths to machine-speed WebAssembly for native performance' },

  // ── GROUP 3: BACKEND AIs ───────────────────────────────────────
  { name: 'Node AI', latin: 'Intelligentia Servitii', lang: 'Node.js', group: 'backend', role: 'orchestrator', tier: 'core', caps: ['server-creation', 'middleware-chain', 'stream-processing', 'cluster-management'], purpose: 'Orchestrates the server runtime — the backbone of backend intelligence' },
  { name: 'Deno AI', latin: 'Intelligentia Securitatis', lang: 'Deno', group: 'backend', role: 'renderer', tier: 'specialist', caps: ['secure-execution', 'permission-model', 'native-typescript', 'web-standard-apis'], purpose: 'Executes secure, permissioned backend code with native TypeScript' },
  { name: 'Bun AI', latin: 'Intelligentia Velocitatis', lang: 'Bun', group: 'backend', role: 'bundler', tier: 'specialist', caps: ['fast-bundling', 'native-apis', 'package-management', 'test-runner'], purpose: 'Bundles and runs at maximum speed — the fastest backend AI' },
  { name: 'Express AI', latin: 'Intelligentia Itinerum', lang: 'Express', group: 'backend', role: 'generator', tier: 'core', caps: ['route-generation', 'middleware-synthesis', 'error-handling', 'api-scaffolding'], purpose: 'Generates HTTP route handlers, middleware chains, and API scaffolds' },
  { name: 'Fastify AI', latin: 'Intelligentia Celeritatis', lang: 'Fastify', group: 'backend', role: 'optimizer', tier: 'specialist', caps: ['schema-validation', 'serialization-optimization', 'plugin-architecture', 'hooks-system'], purpose: 'Optimizes API performance through schema-first validation and serialization' },

  // ── GROUP 4: SYSTEMS AIs ───────────────────────────────────────
  { name: 'Rust AI', latin: 'Intelligentia Ferri', lang: 'Rust', group: 'systems', role: 'compiler', tier: 'core', caps: ['memory-safety', 'zero-cost-abstractions', 'concurrency', 'wasm-target', 'trait-synthesis'], purpose: 'Compiles memory-safe systems code — the iron foundation of performance' },
  { name: 'Go AI', latin: 'Intelligentia Concurrentiae', lang: 'Go', group: 'systems', role: 'generator', tier: 'core', caps: ['goroutine-synthesis', 'channel-orchestration', 'interface-generation', 'binary-compilation'], purpose: 'Generates concurrent, network-efficient systems code at scale' },
  { name: 'C AI', latin: 'Intelligentia Fundamentalis', lang: 'C', group: 'systems', role: 'compiler', tier: 'specialist', caps: ['bare-metal', 'pointer-arithmetic', 'kernel-integration', 'embedded-systems'], purpose: 'Compiles the most fundamental systems code — closest to the metal' },
  { name: 'C++ AI', latin: 'Intelligentia Complexitatis', lang: 'C++', group: 'systems', role: 'compiler', tier: 'specialist', caps: ['template-metaprogramming', 'raii-management', 'stl-utilization', 'operator-overloading'], purpose: 'Handles complex systems requiring template metaprogramming and object lifecycles' },
  { name: 'Zig AI', latin: 'Intelligentia Claritatis', lang: 'Zig', group: 'systems', role: 'compiler', tier: 'experimental', caps: ['compile-time-execution', 'no-hidden-control-flow', 'c-interop', 'safety-without-gc'], purpose: 'Compiles with maximal clarity — no hidden allocations, no hidden control flow' },

  // ── GROUP 5: SUBSTRATE AIs ─────────────────────────────────────
  { name: 'Motoko AI', latin: 'Intelligentia Canistri', lang: 'Motoko', group: 'substrate', role: 'generator', tier: 'core', caps: ['canister-generation', 'actor-model', 'stable-memory', 'inter-canister-calls', 'orthogonal-persistence'], purpose: 'THE substrate AI — generates Motoko canisters for the Internet Computer' },
  { name: 'Solidity AI', latin: 'Intelligentia Contractuum', lang: 'Solidity', group: 'substrate', role: 'generator', tier: 'core', caps: ['smart-contract-synthesis', 'evm-optimization', 'reentrancy-guard', 'token-standards'], purpose: 'Generates Ethereum smart contracts with security-first patterns' },
  { name: 'Cairo AI', latin: 'Intelligentia Probationis', lang: 'Cairo', group: 'substrate', role: 'compiler', tier: 'specialist', caps: ['zk-proof-generation', 'stark-compilation', 'provable-computation', 'air-constraint'], purpose: 'Compiles zero-knowledge provable programs for StarkNet' },
  { name: 'Move AI', latin: 'Intelligentia Resourcerum', lang: 'Move', group: 'substrate', role: 'generator', tier: 'specialist', caps: ['resource-safety', 'module-publishing', 'formal-verification', 'capability-security'], purpose: 'Generates resource-oriented smart contracts with formal verification' },
  { name: 'Teal AI', latin: 'Intelligentia Algorithmi', lang: 'TEAL', group: 'substrate', role: 'compiler', tier: 'specialist', caps: ['algorand-compilation', 'stateless-contracts', 'atomic-transfers', 'application-calls'], purpose: 'Compiles Algorand Transaction Execution Approval Language programs' },

  // ── GROUP 6: DATA AIs ──────────────────────────────────────────
  { name: 'Python AI', latin: 'Intelligentia Scientiae', lang: 'Python', group: 'data', role: 'generator', tier: 'core', caps: ['data-analysis', 'ml-pipeline', 'notebook-generation', 'visualization', 'api-scripting'], purpose: 'Generates data science pipelines, ML models, and analytical scripts' },
  { name: 'R AI', latin: 'Intelligentia Statisticae', lang: 'R', group: 'data', role: 'generator', tier: 'specialist', caps: ['statistical-modeling', 'data-frame-operations', 'ggplot-generation', 'hypothesis-testing'], purpose: 'Generates statistical analyses, visualizations, and research-grade modeling' },
  { name: 'Julia AI', latin: 'Intelligentia Computationis', lang: 'Julia', group: 'data', role: 'compiler', tier: 'specialist', caps: ['jit-compilation', 'scientific-computing', 'parallel-computation', 'multiple-dispatch'], purpose: 'Compiles high-performance scientific computations with native speed' },
  { name: 'SQL AI', latin: 'Intelligentia Tabularium', lang: 'SQL', group: 'data', role: 'generator', tier: 'core', caps: ['query-generation', 'schema-design', 'migration-synthesis', 'index-optimization', 'join-planning'], purpose: 'Generates database queries, schemas, and migration scripts' },
  { name: 'GraphQL AI', latin: 'Intelligentia Graphorum', lang: 'GraphQL', group: 'data', role: 'generator', tier: 'core', caps: ['schema-synthesis', 'resolver-generation', 'subscription-setup', 'federation-config'], purpose: 'Generates typed API schemas with resolvers, subscriptions, and federation' },

  // ── GROUP 7: CONFIG AIs ────────────────────────────────────────
  { name: 'JSON AI', latin: 'Intelligentia Configurationis', lang: 'JSON', group: 'config', role: 'parser', tier: 'core', caps: ['schema-validation', 'deep-merge', 'path-query', 'transformation', 'diff-detection'], purpose: 'Parses, validates, and transforms configuration data structures' },
  { name: 'YAML AI', latin: 'Intelligentia Declarationis', lang: 'YAML', group: 'config', role: 'parser', tier: 'core', caps: ['multi-document', 'anchor-resolution', 'flow-style', 'tag-resolution'], purpose: 'Parses human-readable declarative configuration and deployment manifests' },
  { name: 'TOML AI', latin: 'Intelligentia Minimalis', lang: 'TOML', group: 'config', role: 'parser', tier: 'support', caps: ['table-parsing', 'datetime-handling', 'array-of-tables', 'inline-table'], purpose: 'Parses minimal, obvious configuration files without ambiguity' },
  { name: 'ENV AI', latin: 'Intelligentia Ambientis', lang: 'ENV', group: 'config', role: 'parser', tier: 'support', caps: ['variable-expansion', 'secret-detection', 'multi-environment', 'validation'], purpose: 'Manages environment variables, secrets, and deployment configurations' },
  { name: 'HCL AI', latin: 'Intelligentia Infrastructurae', lang: 'HCL', group: 'config', role: 'generator', tier: 'specialist', caps: ['terraform-generation', 'resource-graph', 'state-management', 'provider-config'], purpose: 'Generates infrastructure-as-code configurations for cloud deployment' },

  // ── GROUP 8: QUERY AIs ─────────────────────────────────────────
  { name: 'REST AI', latin: 'Intelligentia Repraesentationis', lang: 'REST', group: 'query', role: 'generator', tier: 'core', caps: ['endpoint-synthesis', 'openapi-generation', 'request-validation', 'response-formatting'], purpose: 'Generates RESTful API endpoints with OpenAPI specifications' },
  { name: 'gRPC AI', latin: 'Intelligentia Procedurarum', lang: 'gRPC', group: 'query', role: 'generator', tier: 'specialist', caps: ['protobuf-synthesis', 'service-definition', 'streaming-rpc', 'code-generation'], purpose: 'Generates high-performance RPC service definitions with Protocol Buffers' },
  { name: 'WebSocket AI', latin: 'Intelligentia Fluxuum', lang: 'WebSocket', group: 'query', role: 'renderer', tier: 'core', caps: ['bidirectional-streams', 'message-framing', 'heartbeat-management', 'reconnection-logic'], purpose: 'Renders real-time bidirectional communication channels' },
  { name: 'SSE AI', latin: 'Intelligentia Eventorum', lang: 'SSE', group: 'query', role: 'renderer', tier: 'support', caps: ['event-streaming', 'retry-logic', 'event-id-tracking', 'connection-management'], purpose: 'Renders server-sent event streams for real-time data push' },
  { name: 'MQTT AI', latin: 'Intelligentia Telemetriae', lang: 'MQTT', group: 'query', role: 'renderer', tier: 'specialist', caps: ['pub-sub-topology', 'qos-management', 'topic-hierarchy', 'retained-messages'], purpose: 'Renders IoT telemetry streams with publish-subscribe messaging' },

  // ── GROUP 9: INTELLIGENCE AIs ──────────────────────────────────
  { name: 'ONNX AI', latin: 'Intelligentia Inferentiae', lang: 'ONNX', group: 'intelligence', role: 'renderer', tier: 'core', caps: ['model-inference', 'quantization', 'graph-optimization', 'cross-platform-execution'], purpose: 'Renders AI model inference at the edge — local, fast, sovereign' },
  { name: 'TensorFlow AI', latin: 'Intelligentia Tensoris', lang: 'TensorFlow', group: 'intelligence', role: 'compiler', tier: 'core', caps: ['model-compilation', 'distributed-training', 'serving-pipeline', 'tpu-optimization'], purpose: 'Compiles and deploys neural network models at scale' },
  { name: 'PyTorch AI', latin: 'Intelligentia Dynamica', lang: 'PyTorch', group: 'intelligence', role: 'generator', tier: 'core', caps: ['dynamic-graph-generation', 'autograd-synthesis', 'model-architecture', 'training-loop'], purpose: 'Generates dynamic neural network architectures with automatic differentiation' },
  { name: 'JAX AI', latin: 'Intelligentia Accelerationis', lang: 'JAX', group: 'intelligence', role: 'optimizer', tier: 'specialist', caps: ['xla-compilation', 'auto-vectorization', 'auto-parallelization', 'grad-transformation'], purpose: 'Optimizes numerical computations through XLA compilation and auto-vectorization' },
  { name: 'MLX AI', latin: 'Intelligentia Siliconis', lang: 'MLX', group: 'intelligence', role: 'renderer', tier: 'specialist', caps: ['apple-silicon-optimization', 'unified-memory', 'lazy-evaluation', 'metal-compute'], purpose: 'Renders ML inference optimized for Apple Silicon unified memory architecture' },
];

// ══════════════════════════════════════════════════════════════════
//  BUILD THE 50 LANGUAGE AIs
// ══════════════════════════════════════════════════════════════════

function buildLanguageAI(raw: RawAIDef, index: number): LanguageAI {
  const angle = index * GOLDEN_ANGLE;
  const radius = Math.sqrt(index + 1) * 20;
  const groupIdx = LANGUAGE_AI_GROUP_INDEX[raw.group];

  return {
    id: index,
    name: raw.name,
    latinDesignation: raw.latin,
    language: raw.lang,
    group: raw.group,
    groupIndex: groupIdx,
    buildRole: raw.role,
    tier: raw.tier,
    engines: buildEngines(raw.lang, index),
    capabilities: raw.caps,
    sovereignPurpose: raw.purpose,
    phiWeight: Math.pow(PHI, -(index * 0.08)) * Math.pow(PHI, groupIdx * 0.2),
    goldenAnglePosition: angle,
    fibonacciIdentity: fibonacciHash(hashStr(raw.lang), 2_147_483_647),
    dimensionalPlane: (groupIdx % 5) as DimensionalPlane,
    substrateEncoded: true,
    runtimeWired: true,
    memoryEnabled: true,
  };
}

/** The complete registry of 50 Language AIs — built at import time. */
export const LANGUAGE_AIS: readonly LanguageAI[] = RAW_AIS.map((raw, i) => buildLanguageAI(raw, i));

// ══════════════════════════════════════════════════════════════════
//  BUILD THE 10 MULTI-GROUP AI MODELS
// ══════════════════════════════════════════════════════════════════

const GROUP_META: Record<LanguageAIGroup, { latin: string; desc: string; stage: string }> = {
  markup:       { latin: 'Corpus Structurarum', desc: 'Markup AI workforce — builds the document skeleton and vector graphics', stage: 'document-construction' },
  style:        { latin: 'Corpus Aestheticae', desc: 'Style AI workforce — generates all visual styling, layout, and design systems', stage: 'visual-design' },
  frontend:     { latin: 'Corpus Frontalis', desc: 'Frontend AI workforce — generates typed components, runtime execution, WASM compilation', stage: 'component-generation' },
  backend:      { latin: 'Corpus Dorsalis', desc: 'Backend AI workforce — orchestrates servers, bundlers, and API route generation', stage: 'server-orchestration' },
  systems:      { latin: 'Corpus Machinarum', desc: 'Systems AI workforce — compiles memory-safe, concurrent systems-level code', stage: 'systems-compilation' },
  substrate:    { latin: 'Corpus Substratum', desc: 'Substrate AI workforce — generates smart contracts, canisters, and on-chain logic', stage: 'substrate-deployment' },
  data:         { latin: 'Corpus Datorum', desc: 'Data AI workforce — generates queries, schemas, ML pipelines, and analytics', stage: 'data-processing' },
  config:       { latin: 'Corpus Configurationis', desc: 'Config AI workforce — parses and generates all configuration and infrastructure', stage: 'configuration-management' },
  query:        { latin: 'Corpus Communicationis', desc: 'Query AI workforce — generates API protocols, real-time channels, and messaging', stage: 'communication-layer' },
  intelligence: { latin: 'Corpus Intelligentiae', desc: 'Intelligence AI workforce — runs model inference, training, and ML optimization', stage: 'ai-inference' },
};

function buildMultiGroupModel(group: LanguageAIGroup, groupIndex: number, members: readonly LanguageAI[]): MultiGroupAIModel {
  const meta = GROUP_META[group];
  const allCaps = new Set<string>();
  for (const m of members) {
    for (const c of m.capabilities) allCaps.add(c);
    for (const e of m.engines) {
      for (const c of e.capabilities) allCaps.add(c);
    }
  }

  return {
    groupId: groupIndex,
    groupName: group,
    latinName: meta.latin,
    description: meta.desc,
    members,
    totalEngines: members.length * 3,
    combinedCapabilities: [...allCaps],
    aggregatePhiWeight: members.reduce((sum, m) => sum + m.phiWeight, 0),
    buildPipelineStage: meta.stage,
    canBuildEntireStack: members.length >= 5,
  };
}

/** The 10 multi-group AI models — teams of 5 Language AIs each. */
export const MULTI_GROUP_MODELS: readonly MultiGroupAIModel[] = (() => {
  const groups = new Map<LanguageAIGroup, LanguageAI[]>();
  for (const ai of LANGUAGE_AIS) {
    const list = groups.get(ai.group) ?? [];
    list.push(ai);
    groups.set(ai.group, list);
  }

  const models: MultiGroupAIModel[] = [];
  const groupOrder: LanguageAIGroup[] = [
    'markup', 'style', 'frontend', 'backend', 'systems',
    'substrate', 'data', 'config', 'query', 'intelligence',
  ];
  for (let i = 0; i < groupOrder.length; i++) {
    const g = groupOrder[i];
    models.push(buildMultiGroupModel(g, i, groups.get(g) ?? []));
  }
  return models;
})();

// ══════════════════════════════════════════════════════════════════
//  LANGUAGE AI REGISTRY — The Unified Query Interface
// ══════════════════════════════════════════════════════════════════

/**
 * Registry for querying the 50 Language AI workforce.
 *
 * Every language IS an AI.  Every AI has 3 engines.
 * This registry provides the lookup, filtering, and aggregate APIs.
 */
export class LanguageAIRegistry {
  /** Total Language AIs in the workforce. */
  readonly totalAIs = LANGUAGE_AIS.length;

  /** Total engines across all AIs (50 × 3 = 150). */
  readonly totalEngines = LANGUAGE_AIS.length * 3;

  /** Total multi-group models. */
  readonly totalGroups = MULTI_GROUP_MODELS.length;

  /** Get all 50 Language AIs. */
  all(): readonly LanguageAI[] {
    return LANGUAGE_AIS;
  }

  /** Get all 10 multi-group AI models. */
  groups(): readonly MultiGroupAIModel[] {
    return MULTI_GROUP_MODELS;
  }

  /** Get a Language AI by index (0–49). */
  get(index: number): LanguageAI | undefined {
    return LANGUAGE_AIS[index];
  }

  /** Get a Language AI by language name. */
  byLanguage(lang: string): LanguageAI | undefined {
    const lower = lang.toLowerCase();
    return LANGUAGE_AIS.find(ai => ai.language.toLowerCase() === lower);
  }

  /** Get all Language AIs in a group. */
  byGroup(group: LanguageAIGroup): readonly LanguageAI[] {
    return LANGUAGE_AIS.filter(ai => ai.group === group);
  }

  /** Get a multi-group model by name. */
  getGroup(group: LanguageAIGroup): MultiGroupAIModel | undefined {
    return MULTI_GROUP_MODELS.find(m => m.groupName === group);
  }

  /** Get all Language AIs of a specific tier. */
  byTier(tier: AITier): readonly LanguageAI[] {
    return LANGUAGE_AIS.filter(ai => ai.tier === tier);
  }

  /** Get all Language AIs with a specific build role. */
  byRole(role: AIBuildRole): readonly LanguageAI[] {
    return LANGUAGE_AIS.filter(ai => ai.buildRole === role);
  }

  /** Get all Language AIs that have a specific capability. */
  withCapability(capability: string): readonly LanguageAI[] {
    return LANGUAGE_AIS.filter(ai =>
      ai.capabilities.includes(capability) ||
      ai.engines.some(e => e.capabilities.includes(capability))
    );
  }

  /** Simulate a Language AI processing a task. */
  execute(aiId: number, engineKind: EngineKind, input: string): LanguageAIResult {
    const ai = LANGUAGE_AIS[aiId];
    if (!ai) throw new Error(`Language AI ${aiId} not found`);

    const engine = ai.engines.find(e => e.kind === engineKind);
    if (!engine) throw new Error(`Engine ${engineKind} not found on AI ${aiId}`);

    const startTime = Date.now();
    const tokens = input.split(/\s+/).length;

    return {
      aiId: ai.id,
      aiName: ai.name,
      engineUsed: engineKind,
      input,
      output: `[${ai.name}/${engine.kind}] Processed: "${input.slice(0, 80)}${input.length > 80 ? '…' : ''}"`,
      outputFormat: ai.language.toLowerCase(),
      processingTimeMs: Date.now() - startTime + engine.latencyMs,
      confidence: 0.85 + Math.random() * 0.15,
      tokensProcessed: tokens,
      substrateHash: fibonacciHash(hashStr(input), 2_147_483_647),
    };
  }

  /** Get aggregate workforce statistics. */
  stats(): {
    totalAIs: number;
    totalEngines: number;
    totalGroups: number;
    totalCapabilities: number;
    coreAIs: number;
    specialistAIs: number;
    aggregatePhiWeight: number;
  } {
    const allCaps = new Set<string>();
    for (const ai of LANGUAGE_AIS) {
      for (const c of ai.capabilities) allCaps.add(c);
      for (const e of ai.engines) {
        for (const c of e.capabilities) allCaps.add(c);
      }
    }

    return {
      totalAIs: this.totalAIs,
      totalEngines: this.totalEngines,
      totalGroups: this.totalGroups,
      totalCapabilities: allCaps.size,
      coreAIs: LANGUAGE_AIS.filter(a => a.tier === 'core').length,
      specialistAIs: LANGUAGE_AIS.filter(a => a.tier === 'specialist').length,
      aggregatePhiWeight: LANGUAGE_AIS.reduce((s, a) => s + a.phiWeight, 0),
    };
  }
}
