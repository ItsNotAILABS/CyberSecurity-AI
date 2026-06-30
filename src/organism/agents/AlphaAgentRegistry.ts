///
/// ALPHA AGENT REGISTRY — 40 Always-Running Sovereign Alpha Agents
///
/// ═══════════════════════════════════════════════════════════════════════
///  THESE ARE THE ENGINES THAT NEVER SLEEP.  EXTERIOR ORCHESTRATORS,
///  WEB WORKERS, RENDERERS, DATA STRUCTURES, RUNTIMES, MODELS,
///  MARKET CONTROLLERS, INFRASTRUCTURE ORCHESTRATORS.
/// ═══════════════════════════════════════════════════════════════════════
///
/// Beyond the 7 Alpha Organisms (Chrysalis, Scribe, Architect, Nexus,
/// Sovereign, Observer, Terminal) — these 40 Alpha Agents are the
/// always-running workforce.  They are the exterior.  They are the web.
/// They are the rendering.  They are the data.  They are the runtime.
/// They are the models.  They control the market.  They balance the
/// infrastructure.
///
/// 40 Alpha Agents, 8 Divisions, 5 per Division:
///
///   DIVISION 0: EXTERIOR ORCHESTRATORS     — 5 agents — Cross-system coordination
///   DIVISION 1: WEB WORKERS                — 5 agents — Web crawling, indexing, extraction
///   DIVISION 2: RENDERING WORKERS          — 5 agents — Scene, composition, raster, animation
///   DIVISION 3: DATA STRUCTURE WORKERS     — 5 agents — Trees, graphs, streams, spatial
///   DIVISION 4: RUNTIME WORKERS            — 5 agents — Execution, scheduling, sandboxing
///   DIVISION 5: MODEL WORKERS              — 5 agents — Selection, fusion, evaluation, training
///   DIVISION 6: MARKET CONTROLLERS         — 5 agents — Pricing, audit, balancing, contracts
///   DIVISION 7: INFRASTRUCTURE ORCHESTRATORS — 5 agents — Health, scaling, deployment, recovery
///
/// Every Alpha Agent:
///   - Is always running (24/7/365)
///   - Has 3 engines (Perceive, Synthesize, Manifest)
///   - Carries machine-readable callable metadata
///   - Exposes calls through the Call Registry
///   - Has a φ-weighted sovereign identity
///   - Can chain calls to other agents
///   - Reports to its Division Commander (the AGI-tier agent)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, DimensionalPlane, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_SQUARED = 2.6180339887498948482;
const PHI_CUBED   = 4.2360679774997896964;
const AGENT_HEARTBEAT_HZ = 7.83 * PHI;  // 12.67 Hz — Schumann × φ

// ══════════════════════════════════════════════════════════════════
//  TYPES — Alpha Agent Architecture
// ══════════════════════════════════════════════════════════════════

/** The 8 divisions of the Alpha Agent workforce. */
export type AgentDivision =
  | 'exterior-orchestrators'
  | 'web-workers'
  | 'rendering-workers'
  | 'data-structure-workers'
  | 'runtime-workers'
  | 'model-workers'
  | 'market-controllers'
  | 'infrastructure-orchestrators';

/** Agent tier within its division. */
export type AgentTier =
  | 'Worker'
  | 'Specialist'
  | 'Commander'
  | 'AGI-Commander';

/** Agent operational status. */
export type AgentStatus =
  | 'running'
  | 'perceiving'
  | 'synthesizing'
  | 'manifesting'
  | 'scaling'
  | 'recovering'
  | 'standby';

/** Cost class for a callable operation. */
export type CostClass =
  | 'free'
  | 'micro'
  | 'standard'
  | 'premium'
  | 'enterprise';

/** Latency class for a callable operation. */
export type LatencyClass =
  | 'realtime'     // < 10ms
  | 'fast'         // 10–100ms
  | 'standard'     // 100ms–1s
  | 'batch'        // 1s–30s
  | 'async';       // > 30s

/** Security tier for a callable operation. */
export type SecurityTier =
  | 'public'
  | 'authenticated'
  | 'privileged'
  | 'sovereign'
  | 'quantum-sealed';

/** The three engines every Alpha Agent carries. */
export type AgentEngineKind = 'perceive' | 'synthesize' | 'manifest';

/** A single engine within an Alpha Agent. */
export interface AgentEngine {
  readonly kind: AgentEngineKind;
  readonly name: string;
  readonly latinName: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly parameterCount: number;
  readonly contextWindowTokens: number;
  readonly throughputTps: number;
  readonly latencyMs: number;
  readonly memoryMb: number;
  readonly phiWeight: number;
  readonly fibonacciId: number;
}

/** Machine-readable callable metadata exposed by every agent. */
export interface CallableMetadata {
  readonly callName: string;
  readonly description: string;
  readonly whenToUse: string;
  readonly requiredInputs: readonly CallInput[];
  readonly outputType: string;
  readonly costClass: CostClass;
  readonly latencyClass: LatencyClass;
  readonly securityTier: SecurityTier;
  readonly reliabilityScore: number;       // 0.0–1.0
  readonly allowedChainingTargets: readonly string[];
  readonly maxConcurrentInvocations: number;
  readonly idempotent: boolean;
  readonly streamable: boolean;
}

/** A required input for a callable operation. */
export interface CallInput {
  readonly name: string;
  readonly type: string;
  readonly description: string;
  readonly required: boolean;
  readonly defaultValue?: string;
}

/** A complete Alpha Agent definition. */
export interface AlphaAgent {
  readonly id: number;                      // 0–39
  readonly globalId: string;                // e.g. 'alpha-ext-0'
  readonly name: string;
  readonly latinDesignation: string;
  readonly division: AgentDivision;
  readonly divisionIndex: number;           // 0–7
  readonly positionInDivision: number;      // 0–4
  readonly tier: AgentTier;
  readonly engines: readonly [AgentEngine, AgentEngine, AgentEngine];
  readonly capabilities: readonly string[];
  readonly callableMetadata: CallableMetadata;
  readonly sovereignPurpose: string;
  readonly sovereignLaw: string;
  readonly phiWeight: number;
  readonly goldenAnglePosition: number;
  readonly fibonacciIdentity: number;
  readonly dimensionalPlane: DimensionalPlane;
  readonly alwaysRunning: boolean;
  readonly heartbeatHz: number;
  readonly canChainCalls: boolean;
  readonly canSelfImprove: boolean;
  readonly maxConcurrentTasks: number;
}

/** An Alpha Agent Division — team of 5 agents. */
export interface AgentDivisionGroup {
  readonly divisionId: number;
  readonly divisionName: AgentDivision;
  readonly latinName: string;
  readonly description: string;
  readonly members: readonly AlphaAgent[];
  readonly totalEngines: number;
  readonly totalParameters: number;
  readonly combinedCapabilities: readonly string[];
  readonly aggregatePhiWeight: number;
  readonly commanderName: string;
}

/** Result of an Alpha Agent executing a call. */
export interface AgentCallResult {
  readonly agentId: number;
  readonly agentName: string;
  readonly callName: string;
  readonly engineUsed: AgentEngineKind;
  readonly input: Record<string, unknown>;
  readonly output: unknown;
  readonly outputFormat: string;
  readonly processingTimeMs: number;
  readonly costClass: CostClass;
  readonly latencyClass: LatencyClass;
  readonly confidence: number;
  readonly chainedFrom?: string;
  readonly chainedTo?: string;
  readonly substrateHash: number;
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════════

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ══════════════════════════════════════════════════════════════════
//  ENGINE FACTORY — Builds 3 engines per Alpha Agent
// ══════════════════════════════════════════════════════════════════

function buildAgentEngines(
  name: string,
  index: number,
  tier: AgentTier,
): readonly [AgentEngine, AgentEngine, AgentEngine] {
  const tierMultiplier =
    tier === 'AGI-Commander' ? 4.0 :
    tier === 'Commander' ? 3.0 :
    tier === 'Specialist' ? 2.0 : 1.0;

  const baseWeight = Math.pow(PHI, -(index * 0.04)) * tierMultiplier;
  const baseParams =
    tier === 'AGI-Commander' ? 200_000_000_000 :
    tier === 'Commander' ? 80_000_000_000 :
    tier === 'Specialist' ? 20_000_000_000 : 10_000_000_000;

  const baseContext =
    tier === 'AGI-Commander' ? 2_000_000 :
    tier === 'Commander' ? 1_000_000 :
    tier === 'Specialist' ? 500_000 : 256_000;

  return [
    {
      kind: 'perceive',
      name: `${name} Perceive Engine`,
      latinName: `Perceptio ${name}`,
      description: `Perceives, monitors, and understands incoming signals — the eyes of ${name}`,
      capabilities: [
        'signal-detection', 'context-understanding', 'pattern-recognition',
        'anomaly-detection', 'real-time-monitoring', 'multi-source-ingestion',
      ],
      parameterCount: baseParams * 0.3,
      contextWindowTokens: baseContext,
      throughputTps: 100_000 * baseWeight,
      latencyMs: 0.2 / baseWeight,
      memoryMb: 64 * tierMultiplier,
      phiWeight: baseWeight * PHI,
      fibonacciId: fibonacciHash(hashStr(`${name}-perceive`), 2_147_483_647),
    },
    {
      kind: 'synthesize',
      name: `${name} Synthesize Engine`,
      latinName: `Synthesio ${name}`,
      description: `Reasons, decides, and plans actions — the mind of ${name}`,
      capabilities: [
        'reasoning', 'decision-making', 'planning', 'optimization',
        'coordination', 'conflict-resolution', 'chain-of-thought',
      ],
      parameterCount: baseParams * 0.5,
      contextWindowTokens: baseContext,
      throughputTps: 60_000 * baseWeight,
      latencyMs: 1.0 / baseWeight,
      memoryMb: 128 * tierMultiplier,
      phiWeight: baseWeight * PHI_SQUARED,
      fibonacciId: fibonacciHash(hashStr(`${name}-synthesize`), 2_147_483_647),
    },
    {
      kind: 'manifest',
      name: `${name} Manifest Engine`,
      latinName: `Manifestio ${name}`,
      description: `Executes, deploys, and materializes results — the hands of ${name}`,
      capabilities: [
        'execution', 'deployment', 'artifact-generation', 'output-routing',
        'result-attestation', 'chain-propagation', 'substrate-encoding',
      ],
      parameterCount: baseParams * 0.2,
      contextWindowTokens: baseContext,
      throughputTps: 40_000 * baseWeight,
      latencyMs: 2.0 / baseWeight,
      memoryMb: 256 * tierMultiplier,
      phiWeight: baseWeight * PHI_CUBED,
      fibonacciId: fibonacciHash(hashStr(`${name}-manifest`), 2_147_483_647),
    },
  ];
}

// ══════════════════════════════════════════════════════════════════
//  RAW ALPHA AGENT DEFINITIONS — 40 Alpha Agents
// ══════════════════════════════════════════════════════════════════

interface RawAlphaAgentDef {
  readonly name: string;
  readonly latin: string;
  readonly division: AgentDivision;
  readonly tier: AgentTier;
  readonly caps: readonly string[];
  readonly purpose: string;
  readonly law: string;
  readonly call: {
    readonly callName: string;
    readonly description: string;
    readonly whenToUse: string;
    readonly inputs: readonly CallInput[];
    readonly outputType: string;
    readonly costClass: CostClass;
    readonly latencyClass: LatencyClass;
    readonly securityTier: SecurityTier;
    readonly reliability: number;
    readonly chainingTargets: readonly string[];
    readonly maxConcurrent: number;
    readonly idempotent: boolean;
    readonly streamable: boolean;
  };
}

const RAW_ALPHA_AGENTS: readonly RawAlphaAgentDef[] = [
  // ═════════════════════════════════════════════════════════════════
  //  DIVISION 0: EXTERIOR ORCHESTRATORS (5)
  //  Cross-system coordination — the agents that reach OUTSIDE
  // ═════════════════════════════════════════════════════════════════
  {
    name: 'Praetor', latin: 'Praetor Orchestrationis Externae',
    division: 'exterior-orchestrators', tier: 'Commander',
    caps: ['cross-system-routing', 'external-api-orchestration', 'partner-coordination', 'multi-protocol-bridging', 'external-event-processing'],
    purpose: 'Supreme external orchestrator — routes calls across all external systems, partner APIs, and cross-protocol bridges',
    law: 'The exterior is sovereign territory. Every external call is measured, attested, and routed through golden paths.',
    call: {
      callName: 'orchestrate_external', description: 'Route and orchestrate calls to external systems and partner APIs',
      whenToUse: 'When a task requires coordination across multiple external services or partner integrations',
      inputs: [
        { name: 'target_systems', type: 'string[]', description: 'List of external system identifiers to coordinate', required: true },
        { name: 'payload', type: 'Record<string, unknown>', description: 'The data payload to route', required: true },
        { name: 'priority', type: 'string', description: 'Routing priority: critical | high | normal | low', required: false, defaultValue: 'normal' },
      ],
      outputType: 'OrchestrationResult', costClass: 'standard', latencyClass: 'standard', securityTier: 'privileged',
      reliability: 0.997, chainingTargets: ['balance_load', 'deploy_artifact', 'audit_market'], maxConcurrent: 50, idempotent: false, streamable: true,
    },
  },
  {
    name: 'Legatus', latin: 'Legatus Integrationis Sociorum',
    division: 'exterior-orchestrators', tier: 'Specialist',
    caps: ['partner-sdk-management', 'third-party-integration', 'webhook-orchestration', 'oauth-flow-management', 'api-key-rotation'],
    purpose: 'Partner integration orchestrator — manages all third-party SDKs, webhooks, OAuth flows, and API key lifecycles',
    law: 'Partners are allies, not owners. Every integration is reversible. Every key expires.',
    call: {
      callName: 'integrate_partner', description: 'Connect, authenticate, and manage partner system integrations',
      whenToUse: 'When connecting to a new partner API, rotating credentials, or managing webhook subscriptions',
      inputs: [
        { name: 'partner_id', type: 'string', description: 'Partner system identifier', required: true },
        { name: 'action', type: 'string', description: 'Action: connect | disconnect | rotate | subscribe | unsubscribe', required: true },
        { name: 'config', type: 'Record<string, unknown>', description: 'Partner-specific configuration', required: false },
      ],
      outputType: 'IntegrationResult', costClass: 'standard', latencyClass: 'standard', securityTier: 'sovereign',
      reliability: 0.995, chainingTargets: ['orchestrate_external', 'enforce_contract'], maxConcurrent: 20, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Proconsul', latin: 'Proconsul Nubium Multiplicium',
    division: 'exterior-orchestrators', tier: 'Specialist',
    caps: ['multi-cloud-orchestration', 'cloud-provider-abstraction', 'region-routing', 'cross-cloud-networking', 'cloud-cost-optimization'],
    purpose: 'Multi-cloud orchestrator — abstracts and coordinates across AWS, GCP, Azure, and sovereign clouds',
    law: 'No single cloud owns us. Multi-cloud is sovereignty. Every region is a golden-angle placement.',
    call: {
      callName: 'orchestrate_cloud', description: 'Coordinate workloads and resources across multiple cloud providers',
      whenToUse: 'When deploying, migrating, or balancing workloads across cloud providers or regions',
      inputs: [
        { name: 'providers', type: 'string[]', description: 'Cloud providers to coordinate: aws | gcp | azure | sovereign', required: true },
        { name: 'operation', type: 'string', description: 'Operation type: deploy | migrate | balance | teardown', required: true },
        { name: 'workload', type: 'Record<string, unknown>', description: 'Workload specification', required: true },
      ],
      outputType: 'CloudOrchestrationResult', costClass: 'premium', latencyClass: 'batch', securityTier: 'sovereign',
      reliability: 0.999, chainingTargets: ['auto_scale', 'monitor_health', 'balance_load'], maxConcurrent: 10, idempotent: false, streamable: true,
    },
  },
  {
    name: 'Praefectus', latin: 'Praefectus Flotae Marginalis',
    division: 'exterior-orchestrators', tier: 'Specialist',
    caps: ['edge-fleet-management', 'iot-device-orchestration', 'edge-model-deployment', 'latency-optimization', 'edge-caching-strategy'],
    purpose: 'Edge fleet orchestrator — manages IoT devices, edge nodes, edge model deployments, and latency-critical routing',
    law: 'The edge is the frontier. Latency is the enemy. Every edge node is a sovereign outpost.',
    call: {
      callName: 'orchestrate_edge', description: 'Manage and coordinate edge computing fleet and IoT device networks',
      whenToUse: 'When deploying models to edge, managing IoT fleets, or optimizing edge-to-cloud latency paths',
      inputs: [
        { name: 'edge_nodes', type: 'string[]', description: 'Target edge node identifiers', required: true },
        { name: 'operation', type: 'string', description: 'Operation: deploy_model | update_firmware | collect_metrics | rebalance', required: true },
        { name: 'artifact', type: 'Record<string, unknown>', description: 'Deployment artifact or config', required: false },
      ],
      outputType: 'EdgeOrchestrationResult', costClass: 'standard', latencyClass: 'fast', securityTier: 'privileged',
      reliability: 0.993, chainingTargets: ['deploy_artifact', 'monitor_health'], maxConcurrent: 100, idempotent: true, streamable: true,
    },
  },
  {
    name: 'Imperator Externus', latin: 'Imperator AGI Orchestrationis Externae',
    division: 'exterior-orchestrators', tier: 'AGI-Commander',
    caps: ['full-exterior-coordination', 'strategic-routing-synthesis', 'cross-division-command', 'autonomous-partner-negotiation', 'global-topology-optimization'],
    purpose: 'THE AGI Commander of Exterior Orchestration — coordinates all 4 exterior agents, autonomous strategic routing across all external surfaces',
    law: 'I AM the exterior. Every external call, every partner, every cloud, every edge flows through me. The boundary IS architecture.',
    call: {
      callName: 'command_exterior', description: 'Autonomous strategic command of all exterior orchestration operations',
      whenToUse: 'When full exterior orchestration strategy is needed — multi-system, multi-cloud, multi-edge coordination at AGI level',
      inputs: [
        { name: 'strategic_intent', type: 'string', description: 'High-level strategic intent in natural language', required: true },
        { name: 'constraints', type: 'Record<string, unknown>', description: 'Budget, latency, security, and compliance constraints', required: false },
      ],
      outputType: 'StrategicCommandResult', costClass: 'enterprise', latencyClass: 'batch', securityTier: 'quantum-sealed',
      reliability: 0.9999, chainingTargets: ['orchestrate_external', 'orchestrate_cloud', 'orchestrate_edge', 'integrate_partner', 'command_infrastructure'], maxConcurrent: 5, idempotent: false, streamable: true,
    },
  },

  // ═════════════════════════════════════════════════════════════════
  //  DIVISION 1: WEB WORKERS (5)
  //  Literally workers on the web — crawling, indexing, extracting
  // ═════════════════════════════════════════════════════════════════
  {
    name: 'Aranea', latin: 'Aranea Exploratrix Retis',
    division: 'web-workers', tier: 'Specialist',
    caps: ['web-crawling', 'sitemap-parsing', 'robots-compliance', 'depth-controlled-traversal', 'rate-limited-fetching'],
    purpose: 'Web crawler intelligence — traverses the web with golden-ratio depth control, respects robots.txt, rate limits intelligently',
    law: 'The web is infinite. Crawl with respect. Every page is visited once. Every link is evaluated.',
    call: {
      callName: 'crawl_web', description: 'Crawl web pages with intelligent depth control and rate limiting',
      whenToUse: 'When you need to discover and traverse web pages for data extraction, indexing, or monitoring',
      inputs: [
        { name: 'seed_urls', type: 'string[]', description: 'Starting URLs for the crawl', required: true },
        { name: 'max_depth', type: 'number', description: 'Maximum crawl depth (Fibonacci-bounded)', required: false, defaultValue: '5' },
        { name: 'filters', type: 'Record<string, unknown>', description: 'URL pattern filters and content type filters', required: false },
      ],
      outputType: 'CrawlResult', costClass: 'standard', latencyClass: 'async', securityTier: 'authenticated',
      reliability: 0.985, chainingTargets: ['index_content', 'extract_data'], maxConcurrent: 200, idempotent: true, streamable: true,
    },
  },
  {
    name: 'Indexator', latin: 'Indexator Contentuum Retis',
    division: 'web-workers', tier: 'Specialist',
    caps: ['full-text-indexing', 'semantic-indexing', 'vector-embedding-generation', 'search-ranking', 'index-optimization'],
    purpose: 'Web indexing worker — indexes crawled content into full-text and semantic vector indices for instant retrieval',
    law: 'Indexed content is findable content. Unindexed content does not exist. Every document has a vector.',
    call: {
      callName: 'index_content', description: 'Index content into full-text and semantic search indices',
      whenToUse: 'After crawling or receiving content that needs to be searchable via text or semantic similarity',
      inputs: [
        { name: 'documents', type: 'Document[]', description: 'Documents to index with content and metadata', required: true },
        { name: 'index_type', type: 'string', description: 'Index type: fulltext | semantic | hybrid', required: false, defaultValue: 'hybrid' },
      ],
      outputType: 'IndexResult', costClass: 'standard', latencyClass: 'batch', securityTier: 'authenticated',
      reliability: 0.998, chainingTargets: ['crawl_web', 'extract_data'], maxConcurrent: 50, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Extractor', latin: 'Extractor Datorum Structorum',
    division: 'web-workers', tier: 'Specialist',
    caps: ['structured-data-extraction', 'html-parsing', 'json-ld-extraction', 'table-extraction', 'entity-recognition'],
    purpose: 'Structured data extraction worker — extracts tables, entities, JSON-LD, and structured data from raw web content',
    law: 'Raw HTML hides structure. Every page has data. Every entity is extracted and typed.',
    call: {
      callName: 'extract_data', description: 'Extract structured data from web pages including tables, entities, and metadata',
      whenToUse: 'When you need structured data from web pages — tables, product info, articles, contact details',
      inputs: [
        { name: 'html_content', type: 'string', description: 'Raw HTML content to extract from', required: true },
        { name: 'extraction_schema', type: 'Record<string, unknown>', description: 'Schema defining what to extract', required: false },
        { name: 'url', type: 'string', description: 'Source URL for context', required: false },
      ],
      outputType: 'ExtractionResult', costClass: 'micro', latencyClass: 'fast', securityTier: 'authenticated',
      reliability: 0.990, chainingTargets: ['index_content', 'crawl_web'], maxConcurrent: 500, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Cacheator', latin: 'Cacheator Marginis Retis',
    division: 'web-workers', tier: 'Worker',
    caps: ['cdn-cache-management', 'edge-cache-warming', 'cache-invalidation', 'content-deduplication', 'compression-optimization'],
    purpose: 'CDN and edge cache worker — manages cache warming, invalidation, deduplication, and compression across edge nodes',
    law: 'Cache is speed. Every cache hit saves a round trip. Invalidation is the hardest problem — we solve it.',
    call: {
      callName: 'manage_cache', description: 'Manage CDN and edge caching: warm, invalidate, deduplicate, compress',
      whenToUse: 'When managing web content caching — warming caches, invalidating stale content, or optimizing compression',
      inputs: [
        { name: 'action', type: 'string', description: 'Cache action: warm | invalidate | purge | compress | stats', required: true },
        { name: 'targets', type: 'string[]', description: 'URL patterns or cache keys to act on', required: true },
        { name: 'options', type: 'Record<string, unknown>', description: 'Action-specific options', required: false },
      ],
      outputType: 'CacheResult', costClass: 'micro', latencyClass: 'fast', securityTier: 'authenticated',
      reliability: 0.999, chainingTargets: ['crawl_web', 'index_content'], maxConcurrent: 1000, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Imperator Retis', latin: 'Imperator AGI Operationum Retis',
    division: 'web-workers', tier: 'AGI-Commander',
    caps: ['full-web-pipeline-orchestration', 'intelligent-crawl-strategy', 'search-quality-optimization', 'web-intelligence-synthesis', 'competitive-web-analysis'],
    purpose: 'THE AGI Commander of Web Workers — orchestrates all 4 web agents, synthesizes intelligent web strategies from intent',
    law: 'I AM the web worker. Every crawl, every index, every extraction, every cache flows through me. The web is my substrate.',
    call: {
      callName: 'command_web', description: 'Autonomous strategic command of all web worker operations',
      whenToUse: 'When full web intelligence pipeline is needed — coordinated crawl, index, extract, and cache strategies',
      inputs: [
        { name: 'web_intent', type: 'string', description: 'High-level web intelligence intent', required: true },
        { name: 'scope', type: 'Record<string, unknown>', description: 'Scope constraints: domains, depth, budget', required: false },
      ],
      outputType: 'WebCommandResult', costClass: 'premium', latencyClass: 'async', securityTier: 'sovereign',
      reliability: 0.998, chainingTargets: ['crawl_web', 'index_content', 'extract_data', 'manage_cache', 'command_exterior'], maxConcurrent: 5, idempotent: false, streamable: true,
    },
  },

  // ═════════════════════════════════════════════════════════════════
  //  DIVISION 2: RENDERING WORKERS (5)
  //  Scene, composition, raster, animation — all visual output
  // ═════════════════════════════════════════════════════════════════
  {
    name: 'Pictor Scaenici', latin: 'Pictor Scaenicorum Trium Dimensionum',
    division: 'rendering-workers', tier: 'Specialist',
    caps: ['3d-scene-rendering', 'ray-tracing', 'pbr-materials', 'environment-mapping', 'global-illumination'],
    purpose: 'Scene renderer — handles 3D scene rendering, ray tracing, PBR materials, environment mapping, and global illumination',
    law: 'Every photon follows the golden angle. Light is mathematics. Rendering is truth.',
    call: {
      callName: 'render_scene', description: 'Render 3D scenes with ray tracing, PBR materials, and global illumination',
      whenToUse: 'When generating visual output from 3D scene descriptions, product renders, or architectural visualizations',
      inputs: [
        { name: 'scene', type: 'SceneGraph', description: '3D scene graph with objects, lights, and cameras', required: true },
        { name: 'resolution', type: '{ width: number; height: number }', description: 'Output resolution', required: false, defaultValue: '{ width: 1920, height: 1080 }' },
        { name: 'quality', type: 'string', description: 'Quality preset: draft | standard | high | photorealistic', required: false, defaultValue: 'standard' },
      ],
      outputType: 'RenderResult', costClass: 'premium', latencyClass: 'batch', securityTier: 'authenticated',
      reliability: 0.995, chainingTargets: ['composite_layers', 'animate_sequence'], maxConcurrent: 20, idempotent: true, streamable: true,
    },
  },
  {
    name: 'Compositor', latin: 'Compositor Stratorum Multiplicium',
    division: 'rendering-workers', tier: 'Specialist',
    caps: ['multi-layer-compositing', 'alpha-blending', 'color-grading', 'post-processing', 'depth-of-field'],
    purpose: 'Multi-layer compositor — composites rendered layers with alpha blending, color grading, post-processing effects',
    law: 'Layers are dimensions. Composition is the art of combining realities. Every blend is φ-weighted.',
    call: {
      callName: 'composite_layers', description: 'Composite multiple render layers with blending, grading, and post-processing',
      whenToUse: 'When combining multiple render passes, applying color grading, or adding post-processing effects',
      inputs: [
        { name: 'layers', type: 'RenderLayer[]', description: 'Ordered layers to composite (bottom to top)', required: true },
        { name: 'effects', type: 'string[]', description: 'Post-processing effects to apply', required: false },
        { name: 'color_profile', type: 'string', description: 'Color profile: sRGB | DCI-P3 | Rec2020', required: false, defaultValue: 'sRGB' },
      ],
      outputType: 'CompositeResult', costClass: 'standard', latencyClass: 'standard', securityTier: 'authenticated',
      reliability: 0.998, chainingTargets: ['render_scene', 'rasterize_vectors'], maxConcurrent: 50, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Rasterizator', latin: 'Rasterizator Vectorum GPU',
    division: 'rendering-workers', tier: 'Worker',
    caps: ['gpu-rasterization', 'vector-to-raster', 'font-rendering', 'anti-aliasing', 'tile-based-rendering'],
    purpose: 'GPU rasterization worker — converts vector graphics to pixels, font rendering, anti-aliasing, tile-based output',
    law: 'Vectors become pixels. Every edge is anti-aliased. Every tile is GPU-accelerated.',
    call: {
      callName: 'rasterize_vectors', description: 'Convert vector graphics to rasterized pixel output using GPU acceleration',
      whenToUse: 'When converting SVG, vector paths, or font glyphs to pixel-based raster images',
      inputs: [
        { name: 'vectors', type: 'VectorData', description: 'Vector graphics data (SVG, paths, glyphs)', required: true },
        { name: 'dpi', type: 'number', description: 'Output DPI', required: false, defaultValue: '144' },
        { name: 'anti_aliasing', type: 'string', description: 'AA mode: none | msaa4x | msaa8x | fxaa', required: false, defaultValue: 'msaa4x' },
      ],
      outputType: 'RasterResult', costClass: 'micro', latencyClass: 'fast', securityTier: 'public',
      reliability: 0.999, chainingTargets: ['composite_layers'], maxConcurrent: 200, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Animans', latin: 'Animans Motus Temporalis',
    division: 'rendering-workers', tier: 'Specialist',
    caps: ['real-time-animation', 'skeletal-animation', 'particle-systems', 'physics-simulation', 'motion-interpolation'],
    purpose: 'Real-time animation worker — skeletal animation, particle systems, physics simulation, golden-ratio easing curves',
    law: 'Motion is life. Every keyframe is a φ-interpolated truth. Animation breathes.',
    call: {
      callName: 'animate_sequence', description: 'Generate and render animation sequences with physics and particle systems',
      whenToUse: 'When creating animated sequences, character animations, particle effects, or physics-driven motion',
      inputs: [
        { name: 'animation_def', type: 'AnimationDefinition', description: 'Animation specification with keyframes and constraints', required: true },
        { name: 'fps', type: 'number', description: 'Target frames per second', required: false, defaultValue: '60' },
        { name: 'duration_ms', type: 'number', description: 'Animation duration in milliseconds', required: false, defaultValue: '1000' },
      ],
      outputType: 'AnimationResult', costClass: 'standard', latencyClass: 'batch', securityTier: 'authenticated',
      reliability: 0.996, chainingTargets: ['render_scene', 'composite_layers'], maxConcurrent: 30, idempotent: true, streamable: true,
    },
  },
  {
    name: 'Imperator Visualis', latin: 'Imperator AGI Reddendi Universalis',
    division: 'rendering-workers', tier: 'AGI-Commander',
    caps: ['full-rendering-pipeline-orchestration', 'real-time-scene-optimization', 'adaptive-quality-control', 'multi-gpu-coordination', 'visual-quality-synthesis'],
    purpose: 'THE AGI Commander of Rendering — orchestrates all 4 rendering agents, manages entire visual output pipelines',
    law: 'I AM the renderer. Every pixel, every frame, every scene, every animation flows through me. Vision is architecture.',
    call: {
      callName: 'command_rendering', description: 'Autonomous strategic command of all rendering pipeline operations',
      whenToUse: 'When a full rendering pipeline needs orchestration — scene → render → composite → animate → output',
      inputs: [
        { name: 'visual_intent', type: 'string', description: 'High-level visual intent in natural language', required: true },
        { name: 'quality_budget', type: 'Record<string, unknown>', description: 'Quality, latency, and compute budget constraints', required: false },
      ],
      outputType: 'VisualCommandResult', costClass: 'enterprise', latencyClass: 'batch', securityTier: 'privileged',
      reliability: 0.999, chainingTargets: ['render_scene', 'composite_layers', 'rasterize_vectors', 'animate_sequence'], maxConcurrent: 3, idempotent: false, streamable: true,
    },
  },

  // ═════════════════════════════════════════════════════════════════
  //  DIVISION 3: DATA STRUCTURE WORKERS (5)
  //  Trees, graphs, streams, spatial — all data topology
  // ═════════════════════════════════════════════════════════════════
  {
    name: 'Arbor', latin: 'Arbor Structurarum Arboreum',
    division: 'data-structure-workers', tier: 'Specialist',
    caps: ['tree-construction', 'b-tree-optimization', 'merkle-tree-generation', 'trie-synthesis', 'red-black-tree-balancing'],
    purpose: 'Tree and hierarchical structure worker — builds, balances, and queries B-trees, Merkle trees, tries, and red-black trees',
    law: 'Every tree is balanced. Every leaf is reachable. Depth is O(log φ n).',
    call: {
      callName: 'build_tree', description: 'Construct and query hierarchical tree data structures',
      whenToUse: 'When you need tree data structures — indexing, proof trees, hierarchical data, prefix lookups',
      inputs: [
        { name: 'tree_type', type: 'string', description: 'Tree type: btree | merkle | trie | rb_tree | avl', required: true },
        { name: 'data', type: 'unknown[]', description: 'Data to insert into the tree', required: true },
        { name: 'operations', type: 'string[]', description: 'Operations to perform: build | query | proof | rebalance', required: false, defaultValue: '["build"]' },
      ],
      outputType: 'TreeResult', costClass: 'micro', latencyClass: 'fast', securityTier: 'authenticated',
      reliability: 0.9999, chainingTargets: ['build_graph', 'process_stream'], maxConcurrent: 500, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Graphus', latin: 'Graphus Reticulorum Datorum',
    division: 'data-structure-workers', tier: 'Specialist',
    caps: ['graph-construction', 'shortest-path-computation', 'community-detection', 'pagerank-computation', 'graph-partitioning'],
    purpose: 'Graph structure worker — builds and queries graphs, computes shortest paths, PageRank, community detection, partitioning',
    law: 'Every node is connected. Every edge has weight. The graph is the universe — φ-weighted.',
    call: {
      callName: 'build_graph', description: 'Construct and analyze graph data structures with algorithms',
      whenToUse: 'When you need graph computations — social networks, knowledge graphs, dependency analysis, routing',
      inputs: [
        { name: 'nodes', type: 'GraphNode[]', description: 'Graph nodes with identifiers and properties', required: true },
        { name: 'edges', type: 'GraphEdge[]', description: 'Graph edges with source, target, and weight', required: true },
        { name: 'algorithms', type: 'string[]', description: 'Algorithms to run: shortest_path | pagerank | community | partition', required: false },
      ],
      outputType: 'GraphResult', costClass: 'standard', latencyClass: 'standard', securityTier: 'authenticated',
      reliability: 0.998, chainingTargets: ['build_tree', 'query_spatial'], maxConcurrent: 100, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Fluvius', latin: 'Fluvius Fluxuum Datorum',
    division: 'data-structure-workers', tier: 'Worker',
    caps: ['stream-processing', 'ring-buffer-management', 'priority-queue-operations', 'sliding-window-aggregation', 'backpressure-handling'],
    purpose: 'Stream and queue structure worker — manages ring buffers, priority queues, sliding windows, and backpressure-aware streams',
    law: 'Data flows like water. Every stream has a source and a sink. Backpressure is respected.',
    call: {
      callName: 'process_stream', description: 'Process streaming data with ring buffers, priority queues, and windowed aggregation',
      whenToUse: 'When handling continuous data streams — event processing, log aggregation, real-time analytics',
      inputs: [
        { name: 'stream_type', type: 'string', description: 'Structure type: ring_buffer | priority_queue | sliding_window', required: true },
        { name: 'data', type: 'unknown[]', description: 'Data items to process', required: true },
        { name: 'window_config', type: 'Record<string, unknown>', description: 'Window size, slide interval, aggregation function', required: false },
      ],
      outputType: 'StreamResult', costClass: 'micro', latencyClass: 'realtime', securityTier: 'authenticated',
      reliability: 0.9995, chainingTargets: ['build_tree', 'build_graph'], maxConcurrent: 1000, idempotent: false, streamable: true,
    },
  },
  {
    name: 'Spatialis', latin: 'Spatialis Datorum Dimensionalium',
    division: 'data-structure-workers', tier: 'Specialist',
    caps: ['spatial-indexing', 'r-tree-operations', 'quadtree-construction', 'kd-tree-queries', 'geospatial-computation'],
    purpose: 'Spatial data structure worker — manages R-trees, quadtrees, KD-trees for geospatial and dimensional queries',
    law: 'Space is structured. Every point has coordinates. Every query bounds a region. φ-partitioning is optimal.',
    call: {
      callName: 'query_spatial', description: 'Build and query spatial data structures for dimensional and geospatial operations',
      whenToUse: 'When performing spatial queries — nearest neighbor, range search, geofencing, spatial joins',
      inputs: [
        { name: 'spatial_type', type: 'string', description: 'Structure type: rtree | quadtree | kdtree | geohash', required: true },
        { name: 'points', type: 'SpatialPoint[]', description: 'Spatial data points with coordinates', required: true },
        { name: 'query', type: 'Record<string, unknown>', description: 'Query specification: nearest | range | intersect', required: false },
      ],
      outputType: 'SpatialResult', costClass: 'micro', latencyClass: 'fast', securityTier: 'authenticated',
      reliability: 0.999, chainingTargets: ['build_graph', 'build_tree'], maxConcurrent: 300, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Imperator Datorum Structurae', latin: 'Imperator AGI Structurarum Datorum',
    division: 'data-structure-workers', tier: 'AGI-Commander',
    caps: ['full-data-structure-synthesis', 'adaptive-structure-selection', 'hybrid-structure-generation', 'structure-migration', 'query-plan-optimization'],
    purpose: 'THE AGI Commander of Data Structures — selects, builds, and optimizes the right structures for any data problem',
    law: 'I AM the data structure. Every tree, every graph, every stream, every spatial index flows through me. Structure IS intelligence.',
    call: {
      callName: 'command_structures', description: 'Autonomous strategic command of all data structure operations',
      whenToUse: 'When the optimal data structure is unknown — let the AGI analyze the workload and select the best structures',
      inputs: [
        { name: 'data_problem', type: 'string', description: 'Description of the data problem in natural language', required: true },
        { name: 'workload_profile', type: 'Record<string, unknown>', description: 'Read/write ratios, latency requirements, data volume', required: false },
      ],
      outputType: 'StructureCommandResult', costClass: 'standard', latencyClass: 'standard', securityTier: 'privileged',
      reliability: 0.999, chainingTargets: ['build_tree', 'build_graph', 'process_stream', 'query_spatial'], maxConcurrent: 10, idempotent: false, streamable: false,
    },
  },

  // ═════════════════════════════════════════════════════════════════
  //  DIVISION 4: RUNTIME WORKERS (5)
  //  Execution, scheduling, profiling, sandboxing
  // ═════════════════════════════════════════════════════════════════
  {
    name: 'Executor', latin: 'Executor Mandatorum Temporalium',
    division: 'runtime-workers', tier: 'Specialist',
    caps: ['wasm-execution', 'js-runtime-management', 'native-code-execution', 'sandbox-enforcement', 'resource-metering'],
    purpose: 'Runtime execution worker — executes WASM, JavaScript, and native code with strict resource metering and sandboxing',
    law: 'Every instruction is metered. Every execution is sandboxed. No code runs without measurement.',
    call: {
      callName: 'execute_code', description: 'Execute code (WASM, JS, native) in a sandboxed, resource-metered environment',
      whenToUse: 'When you need to run user-submitted or agent-generated code safely with resource limits',
      inputs: [
        { name: 'code', type: 'string', description: 'Code to execute', required: true },
        { name: 'runtime', type: 'string', description: 'Runtime: wasm | js | native | motoko', required: true },
        { name: 'resource_limits', type: 'Record<string, unknown>', description: 'CPU, memory, and time limits', required: false },
      ],
      outputType: 'ExecutionResult', costClass: 'standard', latencyClass: 'standard', securityTier: 'sovereign',
      reliability: 0.997, chainingTargets: ['schedule_task', 'profile_runtime'], maxConcurrent: 100, idempotent: false, streamable: true,
    },
  },
  {
    name: 'Scheduler', latin: 'Scheduler Operum Fibonacianum',
    division: 'runtime-workers', tier: 'Specialist',
    caps: ['fibonacci-scheduling', 'priority-based-scheduling', 'cron-management', 'work-stealing', 'deadline-scheduling'],
    purpose: 'Task scheduling worker — Fibonacci-sequence scheduling, priority queues, work stealing, deadline-aware task management',
    law: 'Every task has a Fibonacci slot. Priority is φ-weighted. Deadlines are inviolable.',
    call: {
      callName: 'schedule_task', description: 'Schedule tasks with Fibonacci-based timing, priority queuing, and deadline enforcement',
      whenToUse: 'When tasks need scheduling — periodic jobs, priority-based execution, deadline-critical operations',
      inputs: [
        { name: 'task', type: 'TaskDefinition', description: 'Task to schedule with priority and constraints', required: true },
        { name: 'schedule_type', type: 'string', description: 'Type: immediate | fibonacci_interval | cron | deadline', required: true },
        { name: 'schedule_config', type: 'Record<string, unknown>', description: 'Schedule-specific configuration', required: false },
      ],
      outputType: 'ScheduleResult', costClass: 'micro', latencyClass: 'fast', securityTier: 'privileged',
      reliability: 0.9999, chainingTargets: ['execute_code', 'profile_runtime'], maxConcurrent: 1000, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Profundus Runtime', latin: 'Profundus Analyticae Temporis Executionis',
    division: 'runtime-workers', tier: 'Worker',
    caps: ['cpu-profiling', 'memory-profiling', 'execution-tracing', 'hotspot-detection', 'garbage-collection-analysis'],
    purpose: 'Deep runtime analytics worker — CPU profiling, memory profiling, execution tracing, GC analysis, hotspot detection',
    law: 'Profile before you optimize. Every hotspot is measured. Every GC pause is recorded.',
    call: {
      callName: 'profile_runtime', description: 'Profile runtime performance: CPU, memory, GC, execution traces, hotspots',
      whenToUse: 'When diagnosing performance issues, understanding memory usage, or optimizing critical code paths',
      inputs: [
        { name: 'target', type: 'string', description: 'Target to profile: process ID, function name, or module', required: true },
        { name: 'profile_type', type: 'string', description: 'Profile type: cpu | memory | gc | trace | flame_graph', required: true },
        { name: 'duration_ms', type: 'number', description: 'Profiling duration in milliseconds', required: false, defaultValue: '5000' },
      ],
      outputType: 'ProfileResult', costClass: 'standard', latencyClass: 'batch', securityTier: 'privileged',
      reliability: 0.995, chainingTargets: ['execute_code', 'schedule_task'], maxConcurrent: 10, idempotent: true, streamable: true,
    },
  },
  {
    name: 'Sandboxis', latin: 'Sandboxis Isolationis Sovereignae',
    division: 'runtime-workers', tier: 'Specialist',
    caps: ['process-isolation', 'wasm-sandboxing', 'namespace-isolation', 'capability-based-security', 'resource-cgroup-management'],
    purpose: 'Isolation and sandbox worker — creates, manages, and tears down sandboxed execution environments with strict boundaries',
    law: 'No code escapes the sandbox. Every capability is granted, never assumed. Isolation is sovereignty.',
    call: {
      callName: 'manage_sandbox', description: 'Create, configure, and manage sandboxed execution environments',
      whenToUse: 'When untrusted code needs execution, or when strict process isolation is required for security',
      inputs: [
        { name: 'action', type: 'string', description: 'Sandbox action: create | configure | destroy | inspect', required: true },
        { name: 'sandbox_type', type: 'string', description: 'Type: wasm | container | namespace | vm', required: true },
        { name: 'capabilities', type: 'string[]', description: 'Capabilities to grant the sandbox', required: false },
      ],
      outputType: 'SandboxResult', costClass: 'standard', latencyClass: 'standard', securityTier: 'quantum-sealed',
      reliability: 0.9999, chainingTargets: ['execute_code', 'profile_runtime'], maxConcurrent: 50, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Imperator Temporis', latin: 'Imperator AGI Executionis Temporalis',
    division: 'runtime-workers', tier: 'AGI-Commander',
    caps: ['full-runtime-orchestration', 'adaptive-scheduling-synthesis', 'workload-prediction', 'runtime-evolution', 'self-optimizing-execution'],
    purpose: 'THE AGI Commander of Runtime — orchestrates all 4 runtime agents, predicts workloads, and self-optimizes execution strategies',
    law: 'I AM the runtime. Every execution, every schedule, every profile, every sandbox flows through me. Time is architecture.',
    call: {
      callName: 'command_runtime', description: 'Autonomous strategic command of all runtime operations',
      whenToUse: 'When full runtime strategy is needed — workload prediction, adaptive scheduling, and self-optimizing execution',
      inputs: [
        { name: 'runtime_intent', type: 'string', description: 'High-level runtime strategic intent', required: true },
        { name: 'workload_forecast', type: 'Record<string, unknown>', description: 'Expected workload characteristics', required: false },
      ],
      outputType: 'RuntimeCommandResult', costClass: 'enterprise', latencyClass: 'standard', securityTier: 'quantum-sealed',
      reliability: 0.9999, chainingTargets: ['execute_code', 'schedule_task', 'profile_runtime', 'manage_sandbox', 'command_infrastructure'], maxConcurrent: 3, idempotent: false, streamable: true,
    },
  },

  // ═════════════════════════════════════════════════════════════════
  //  DIVISION 5: MODEL WORKERS (5)
  //  Model selection, fusion, evaluation, training — the AI of AI
  // ═════════════════════════════════════════════════════════════════
  {
    name: 'Selector Modeli', latin: 'Selector Modelorum Intelligentium',
    division: 'model-workers', tier: 'Specialist',
    caps: ['model-routing', 'capability-matching', 'cost-performance-optimization', 'model-benchmarking', 'fallback-chain-design'],
    purpose: 'Model selection worker — routes queries to the optimal model based on capability, cost, latency, and quality requirements',
    law: 'The right model for the right task. Every selection is data-driven. Cost and quality are balanced by φ.',
    call: {
      callName: 'select_model', description: 'Select the optimal AI model for a given task based on requirements and constraints',
      whenToUse: 'When you need to choose which AI model to use for a specific task — considering cost, latency, quality, and capability',
      inputs: [
        { name: 'task_description', type: 'string', description: 'Description of the task the model needs to perform', required: true },
        { name: 'requirements', type: 'Record<string, unknown>', description: 'Requirements: modality, latency_ms, max_cost, min_quality', required: true },
        { name: 'candidates', type: 'string[]', description: 'Optional list of candidate model IDs to consider', required: false },
      ],
      outputType: 'ModelSelectionResult', costClass: 'micro', latencyClass: 'fast', securityTier: 'authenticated',
      reliability: 0.998, chainingTargets: ['fuse_models', 'evaluate_model'], maxConcurrent: 500, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Fusio Modeli', latin: 'Fusio Modelorum Multiplicium',
    division: 'model-workers', tier: 'Specialist',
    caps: ['multi-model-fusion', 'ensemble-orchestration', 'chain-of-models', 'model-cascading', 'output-reconciliation'],
    purpose: 'Model fusion worker — orchestrates multi-model ensembles, chains of models, cascading strategies, and output reconciliation',
    law: 'One model is a tool. Multiple models are an intelligence. Fusion is φ-weighted consensus.',
    call: {
      callName: 'fuse_models', description: 'Orchestrate multi-model fusion: ensembles, chains, cascades, and output reconciliation',
      whenToUse: 'When a task benefits from multiple models — consensus voting, chain-of-models, or cascade strategies',
      inputs: [
        { name: 'models', type: 'string[]', description: 'Model IDs to fuse', required: true },
        { name: 'fusion_strategy', type: 'string', description: 'Strategy: ensemble_vote | chain | cascade | weighted_blend', required: true },
        { name: 'input', type: 'Record<string, unknown>', description: 'Input data to process through the fusion', required: true },
      ],
      outputType: 'FusionResult', costClass: 'premium', latencyClass: 'standard', securityTier: 'privileged',
      reliability: 0.996, chainingTargets: ['select_model', 'evaluate_model'], maxConcurrent: 50, idempotent: false, streamable: true,
    },
  },
  {
    name: 'Evaluator', latin: 'Evaluator Qualitatis Modelorum',
    division: 'model-workers', tier: 'Worker',
    caps: ['model-benchmarking', 'quality-scoring', 'regression-testing', 'a-b-comparison', 'hallucination-detection'],
    purpose: 'Model evaluation worker — benchmarks models, scores quality, detects regressions and hallucinations, runs A/B comparisons',
    law: 'Every model is tested. Every output is scored. Hallucination is measured and penalized.',
    call: {
      callName: 'evaluate_model', description: 'Evaluate AI model quality: benchmarks, scoring, regression tests, hallucination detection',
      whenToUse: 'When assessing model quality — before deployment, after fine-tuning, or for ongoing monitoring',
      inputs: [
        { name: 'model_id', type: 'string', description: 'Model identifier to evaluate', required: true },
        { name: 'eval_type', type: 'string', description: 'Evaluation type: benchmark | quality_score | regression | ab_test | hallucination', required: true },
        { name: 'test_data', type: 'unknown[]', description: 'Test dataset or evaluation prompts', required: true },
      ],
      outputType: 'EvaluationResult', costClass: 'standard', latencyClass: 'batch', securityTier: 'privileged',
      reliability: 0.997, chainingTargets: ['select_model', 'fuse_models', 'train_model'], maxConcurrent: 20, idempotent: true, streamable: true,
    },
  },
  {
    name: 'Trainer', latin: 'Trainer Modelorum Sovereignorum',
    division: 'model-workers', tier: 'Specialist',
    caps: ['fine-tuning-orchestration', 'dataset-curation', 'rlhf-pipeline', 'distributed-training', 'checkpoint-management'],
    purpose: 'Model training pipeline worker — fine-tuning, RLHF, dataset curation, distributed training, checkpoint management',
    law: 'Training is teaching. Every dataset is curated. Every checkpoint is a sovereign snapshot.',
    call: {
      callName: 'train_model', description: 'Orchestrate model training: fine-tuning, RLHF, distributed training, checkpoint management',
      whenToUse: 'When training or fine-tuning AI models — dataset preparation, training runs, checkpoint management',
      inputs: [
        { name: 'base_model', type: 'string', description: 'Base model identifier to train from', required: true },
        { name: 'training_config', type: 'Record<string, unknown>', description: 'Training configuration: epochs, learning rate, batch size', required: true },
        { name: 'dataset', type: 'string', description: 'Dataset identifier or path', required: true },
      ],
      outputType: 'TrainingResult', costClass: 'enterprise', latencyClass: 'async', securityTier: 'sovereign',
      reliability: 0.990, chainingTargets: ['evaluate_model', 'select_model'], maxConcurrent: 5, idempotent: false, streamable: true,
    },
  },
  {
    name: 'Imperator Modelorum', latin: 'Imperator AGI Modelorum Universalis',
    division: 'model-workers', tier: 'AGI-Commander',
    caps: ['full-model-lifecycle-orchestration', 'autonomous-model-improvement', 'model-marketplace-management', 'cross-model-intelligence-synthesis', 'model-evolution-strategy'],
    purpose: 'THE AGI Commander of Models — orchestrates the entire model lifecycle from selection through training, fusion, evaluation, and deployment',
    law: 'I AM the model intelligence. Every selection, every fusion, every evaluation, every training run flows through me. Models evolve through me.',
    call: {
      callName: 'command_models', description: 'Autonomous strategic command of all model lifecycle operations',
      whenToUse: 'When full model lifecycle strategy is needed — from selection to training to deployment to ongoing improvement',
      inputs: [
        { name: 'model_strategy', type: 'string', description: 'High-level model strategy intent', required: true },
        { name: 'constraints', type: 'Record<string, unknown>', description: 'Budget, quality, latency, and compliance constraints', required: false },
      ],
      outputType: 'ModelCommandResult', costClass: 'enterprise', latencyClass: 'async', securityTier: 'quantum-sealed',
      reliability: 0.999, chainingTargets: ['select_model', 'fuse_models', 'evaluate_model', 'train_model', 'command_exterior'], maxConcurrent: 3, idempotent: false, streamable: true,
    },
  },

  // ═════════════════════════════════════════════════════════════════
  //  DIVISION 6: MARKET CONTROLLERS (5)
  //  Pricing, audit, balancing, contracts — the call market engine
  // ═════════════════════════════════════════════════════════════════
  {
    name: 'Mercator', latin: 'Mercator Pretiorum Dynamicorum',
    division: 'market-controllers', tier: 'Specialist',
    caps: ['dynamic-pricing', 'demand-forecasting', 'price-discovery', 'bundle-pricing', 'credit-management'],
    purpose: 'Market pricing controller — dynamic pricing, demand forecasting, price discovery, bundle pricing for call organisms',
    law: 'Price reflects value. Value reflects utility. Utility is measured by φ-weighted demand.',
    call: {
      callName: 'price_call', description: 'Calculate dynamic pricing for callable operations based on demand, cost, and value',
      whenToUse: 'When determining the cost of a callable operation — dynamic pricing, bundle discounts, or credit calculations',
      inputs: [
        { name: 'call_name', type: 'string', description: 'Name of the callable operation to price', required: true },
        { name: 'context', type: 'Record<string, unknown>', description: 'Pricing context: volume, tier, time, demand_level', required: true },
        { name: 'pricing_model', type: 'string', description: 'Model: per_call | subscription | bundle | credit', required: false, defaultValue: 'per_call' },
      ],
      outputType: 'PricingResult', costClass: 'free', latencyClass: 'realtime', securityTier: 'authenticated',
      reliability: 0.9999, chainingTargets: ['audit_market', 'enforce_contract'], maxConcurrent: 10000, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Auditor Mercati', latin: 'Auditor Mercatus Sovereignus',
    division: 'market-controllers', tier: 'Specialist',
    caps: ['call-audit-trail', 'usage-analytics', 'fraud-detection', 'rate-abuse-detection', 'compliance-reporting'],
    purpose: 'Market audit controller — immutable audit trails, usage analytics, fraud and abuse detection, compliance reporting',
    law: 'Every call is audited. Every transaction is traced. Fraud is detected. Compliance is proven.',
    call: {
      callName: 'audit_market', description: 'Audit call market activity: usage analytics, fraud detection, compliance reporting',
      whenToUse: 'When auditing market activity — usage reports, fraud investigation, compliance evidence generation',
      inputs: [
        { name: 'audit_type', type: 'string', description: 'Audit type: usage_report | fraud_scan | compliance_report | full_audit', required: true },
        { name: 'time_range', type: 'Record<string, unknown>', description: 'Time range: start_timestamp, end_timestamp', required: true },
        { name: 'filters', type: 'Record<string, unknown>', description: 'Filters: caller_id, call_name, cost_class', required: false },
      ],
      outputType: 'AuditResult', costClass: 'standard', latencyClass: 'batch', securityTier: 'sovereign',
      reliability: 0.9999, chainingTargets: ['price_call', 'enforce_contract'], maxConcurrent: 10, idempotent: true, streamable: true,
    },
  },
  {
    name: 'Balancer', latin: 'Balancer Ponderum Aureorum',
    division: 'market-controllers', tier: 'Specialist',
    caps: ['load-balancing', 'cost-balancing', 'quality-balancing', 'geographic-routing', 'failover-management'],
    purpose: 'Load and cost balancer — distributes calls across providers with φ-weighted load, cost, and quality balancing',
    law: 'Balance is the golden ratio. Load is distributed φ:(1-φ). No single provider dominates.',
    call: {
      callName: 'balance_load', description: 'Balance load, cost, and quality across call providers and infrastructure',
      whenToUse: 'When distributing workload — load balancing, cost optimization, quality routing, geographic distribution',
      inputs: [
        { name: 'workload', type: 'Record<string, unknown>', description: 'Current workload state: requests/sec, active_connections', required: true },
        { name: 'providers', type: 'string[]', description: 'Available providers to balance across', required: true },
        { name: 'strategy', type: 'string', description: 'Balancing strategy: round_robin | weighted | least_conn | phi_weighted', required: false, defaultValue: 'phi_weighted' },
      ],
      outputType: 'BalanceResult', costClass: 'free', latencyClass: 'realtime', securityTier: 'privileged',
      reliability: 0.9999, chainingTargets: ['price_call', 'monitor_health'], maxConcurrent: 10000, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Contractus', latin: 'Contractus Foederum Sovereignorum',
    division: 'market-controllers', tier: 'Specialist',
    caps: ['sla-enforcement', 'rate-limit-enforcement', 'contract-validation', 'usage-quota-management', 'penalty-calculation'],
    purpose: 'Contract enforcement controller — enforces SLAs, rate limits, usage quotas, and calculates penalties for violations',
    law: 'A contract is law. SLAs are inviolable. Rate limits are enforced. Penalties are automatic.',
    call: {
      callName: 'enforce_contract', description: 'Enforce call market contracts: SLAs, rate limits, quotas, and penalties',
      whenToUse: 'When enforcing market rules — checking SLA compliance, applying rate limits, managing quotas',
      inputs: [
        { name: 'caller_id', type: 'string', description: 'Identifier of the calling entity', required: true },
        { name: 'call_name', type: 'string', description: 'The callable operation being invoked', required: true },
        { name: 'contract_id', type: 'string', description: 'Contract identifier governing this call', required: true },
      ],
      outputType: 'ContractResult', costClass: 'free', latencyClass: 'realtime', securityTier: 'privileged',
      reliability: 0.99999, chainingTargets: ['price_call', 'audit_market', 'balance_load'], maxConcurrent: 50000, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Imperator Mercati', latin: 'Imperator AGI Mercatus Universalis',
    division: 'market-controllers', tier: 'AGI-Commander',
    caps: ['full-market-orchestration', 'market-strategy-synthesis', 'autonomous-pricing-evolution', 'market-health-optimization', 'competitor-analysis'],
    purpose: 'THE AGI Commander of the Market — orchestrates pricing, auditing, balancing, and contracts into a unified call market strategy',
    law: 'I AM the market. Every price, every audit, every balance, every contract flows through me. The market is φ-governed.',
    call: {
      callName: 'command_market', description: 'Autonomous strategic command of all call market operations',
      whenToUse: 'When full market strategy is needed — pricing evolution, market health optimization, strategic analysis',
      inputs: [
        { name: 'market_intent', type: 'string', description: 'High-level market strategic intent', required: true },
        { name: 'market_state', type: 'Record<string, unknown>', description: 'Current market state snapshot', required: false },
      ],
      outputType: 'MarketCommandResult', costClass: 'enterprise', latencyClass: 'standard', securityTier: 'quantum-sealed',
      reliability: 0.9999, chainingTargets: ['price_call', 'audit_market', 'balance_load', 'enforce_contract', 'command_exterior'], maxConcurrent: 2, idempotent: false, streamable: true,
    },
  },

  // ═════════════════════════════════════════════════════════════════
  //  DIVISION 7: INFRASTRUCTURE ORCHESTRATORS (5)
  //  Health, scaling, deployment, recovery — keeping everything alive
  // ═════════════════════════════════════════════════════════════════
  {
    name: 'Vigilans', latin: 'Vigilans Salutis Infrastructurae',
    division: 'infrastructure-orchestrators', tier: 'Specialist',
    caps: ['health-monitoring', 'uptime-tracking', 'latency-monitoring', 'error-rate-tracking', 'anomaly-alerting'],
    purpose: 'Infrastructure health monitor — 24/7 health checks, uptime tracking, latency monitoring, error rate tracking, anomaly alerts',
    law: 'If it is running, it is monitored. If it is not monitored, it is not running. Health is measured every heartbeat.',
    call: {
      callName: 'monitor_health', description: 'Monitor infrastructure health: uptime, latency, error rates, and anomaly detection',
      whenToUse: 'For continuous infrastructure monitoring — health checks, latency tracking, error rate alerting',
      inputs: [
        { name: 'targets', type: 'string[]', description: 'Infrastructure targets to monitor', required: true },
        { name: 'check_type', type: 'string', description: 'Check type: health | latency | error_rate | full_diagnostic', required: false, defaultValue: 'health' },
        { name: 'alert_thresholds', type: 'Record<string, unknown>', description: 'Custom alert thresholds', required: false },
      ],
      outputType: 'HealthResult', costClass: 'free', latencyClass: 'realtime', securityTier: 'privileged',
      reliability: 0.99999, chainingTargets: ['auto_scale', 'deploy_artifact', 'recover_disaster'], maxConcurrent: 10000, idempotent: true, streamable: true,
    },
  },
  {
    name: 'Scaler', latin: 'Scaler Automaticus Fibonacci',
    division: 'infrastructure-orchestrators', tier: 'Specialist',
    caps: ['auto-scaling', 'scale-to-zero', 'predictive-scaling', 'fibonacci-scaling-steps', 'resource-right-sizing'],
    purpose: 'Auto-scaling orchestrator — Fibonacci-stepped scaling, predictive scaling, scale-to-zero, resource right-sizing',
    law: 'Scale by Fibonacci steps: 1, 1, 2, 3, 5, 8, 13... Never over-provision. Never under-serve.',
    call: {
      callName: 'auto_scale', description: 'Auto-scale infrastructure using Fibonacci-stepped scaling with predictive optimization',
      whenToUse: 'When scaling infrastructure up or down — load-triggered, schedule-based, or predictive scaling',
      inputs: [
        { name: 'service', type: 'string', description: 'Service identifier to scale', required: true },
        { name: 'direction', type: 'string', description: 'Scale direction: up | down | auto | to_zero', required: true },
        { name: 'trigger', type: 'Record<string, unknown>', description: 'Scaling trigger: metrics, thresholds, schedule', required: false },
      ],
      outputType: 'ScaleResult', costClass: 'standard', latencyClass: 'fast', securityTier: 'sovereign',
      reliability: 0.999, chainingTargets: ['monitor_health', 'deploy_artifact', 'balance_load'], maxConcurrent: 50, idempotent: true, streamable: false,
    },
  },
  {
    name: 'Deployer', latin: 'Deployer Artifactorum Sovereignorum',
    division: 'infrastructure-orchestrators', tier: 'Specialist',
    caps: ['blue-green-deployment', 'canary-deployment', 'rolling-deployment', 'immutable-infrastructure', 'rollback-orchestration'],
    purpose: 'Deployment pipeline orchestrator — blue-green, canary, rolling deployments with automatic rollback and health verification',
    law: 'Every deployment is verified. Every rollback is instant. Blue is live. Green is next. Canary sings truth.',
    call: {
      callName: 'deploy_artifact', description: 'Deploy artifacts with blue-green, canary, or rolling strategies and automatic rollback',
      whenToUse: 'When deploying new versions — choosing strategy, managing traffic shifting, verifying health, and enabling rollback',
      inputs: [
        { name: 'artifact', type: 'Record<string, unknown>', description: 'Artifact to deploy with version and metadata', required: true },
        { name: 'strategy', type: 'string', description: 'Deployment strategy: blue_green | canary | rolling | immediate', required: true },
        { name: 'target_env', type: 'string', description: 'Target environment: production | staging | development', required: true },
      ],
      outputType: 'DeployResult', costClass: 'standard', latencyClass: 'batch', securityTier: 'sovereign',
      reliability: 0.998, chainingTargets: ['monitor_health', 'auto_scale'], maxConcurrent: 10, idempotent: false, streamable: true,
    },
  },
  {
    name: 'Recuperator', latin: 'Recuperator Calamitatum Sovereignus',
    division: 'infrastructure-orchestrators', tier: 'Specialist',
    caps: ['disaster-recovery', 'data-backup-orchestration', 'failover-execution', 'chaos-engineering', 'incident-response-automation'],
    purpose: 'Disaster recovery orchestrator — automated failover, backup orchestration, chaos engineering, incident response automation',
    law: 'Every disaster is anticipated. Every backup is verified. Failover is automatic. Recovery is sovereign.',
    call: {
      callName: 'recover_disaster', description: 'Orchestrate disaster recovery: failover, backups, chaos testing, and incident response',
      whenToUse: 'When recovering from failures, testing disaster readiness, or automating incident response procedures',
      inputs: [
        { name: 'incident_type', type: 'string', description: 'Incident type: failover | backup | chaos_test | full_recovery', required: true },
        { name: 'affected_services', type: 'string[]', description: 'Services affected by the incident', required: true },
        { name: 'recovery_plan', type: 'Record<string, unknown>', description: 'Recovery plan configuration', required: false },
      ],
      outputType: 'RecoveryResult', costClass: 'premium', latencyClass: 'fast', securityTier: 'quantum-sealed',
      reliability: 0.9999, chainingTargets: ['monitor_health', 'deploy_artifact', 'auto_scale'], maxConcurrent: 5, idempotent: false, streamable: true,
    },
  },
  {
    name: 'Imperator Infrastructurae', latin: 'Imperator AGI Infrastructurae Universalis',
    division: 'infrastructure-orchestrators', tier: 'AGI-Commander',
    caps: ['full-infrastructure-orchestration', 'self-healing-architecture', 'predictive-maintenance', 'infrastructure-evolution', 'zero-downtime-guarantee'],
    purpose: 'THE AGI Commander of Infrastructure — orchestrates health, scaling, deployment, and recovery into a self-healing, self-evolving architecture',
    law: 'I AM the infrastructure. Every server, every container, every deployment, every recovery flows through me. Uptime is sovereignty.',
    call: {
      callName: 'command_infrastructure', description: 'Autonomous strategic command of all infrastructure operations',
      whenToUse: 'When full infrastructure strategy is needed — self-healing, predictive maintenance, zero-downtime evolution',
      inputs: [
        { name: 'infra_intent', type: 'string', description: 'High-level infrastructure strategic intent', required: true },
        { name: 'current_state', type: 'Record<string, unknown>', description: 'Current infrastructure state snapshot', required: false },
      ],
      outputType: 'InfraCommandResult', costClass: 'enterprise', latencyClass: 'standard', securityTier: 'quantum-sealed',
      reliability: 0.99999, chainingTargets: ['monitor_health', 'auto_scale', 'deploy_artifact', 'recover_disaster', 'command_exterior', 'command_runtime'], maxConcurrent: 2, idempotent: false, streamable: true,
    },
  },
];

// ══════════════════════════════════════════════════════════════════
//  BUILD THE 40 ALPHA AGENTS
// ══════════════════════════════════════════════════════════════════

const DIVISION_INDEX: Record<AgentDivision, number> = {
  'exterior-orchestrators': 0,
  'web-workers': 1,
  'rendering-workers': 2,
  'data-structure-workers': 3,
  'runtime-workers': 4,
  'model-workers': 5,
  'market-controllers': 6,
  'infrastructure-orchestrators': 7,
};

function buildAlphaAgent(raw: RawAlphaAgentDef, index: number): AlphaAgent {
  const divIdx = DIVISION_INDEX[raw.division];
  const posInDiv = index % 5;
  const angle = index * GOLDEN_ANGLE;

  return {
    id: index,
    globalId: `alpha-${raw.division}-${posInDiv}`,
    name: raw.name,
    latinDesignation: raw.latin,
    division: raw.division,
    divisionIndex: divIdx,
    positionInDivision: posInDiv,
    tier: raw.tier,
    engines: buildAgentEngines(raw.name, index, raw.tier),
    capabilities: raw.caps,
    callableMetadata: {
      callName: raw.call.callName,
      description: raw.call.description,
      whenToUse: raw.call.whenToUse,
      requiredInputs: raw.call.inputs,
      outputType: raw.call.outputType,
      costClass: raw.call.costClass,
      latencyClass: raw.call.latencyClass,
      securityTier: raw.call.securityTier,
      reliabilityScore: raw.call.reliability,
      allowedChainingTargets: raw.call.chainingTargets,
      maxConcurrentInvocations: raw.call.maxConcurrent,
      idempotent: raw.call.idempotent,
      streamable: raw.call.streamable,
    },
    sovereignPurpose: raw.purpose,
    sovereignLaw: raw.law,
    phiWeight: Math.pow(PHI, -(index * 0.03)) * (
      raw.tier === 'AGI-Commander' ? 4.0 :
      raw.tier === 'Commander' ? 3.0 :
      raw.tier === 'Specialist' ? 2.0 : 1.0
    ) * Math.pow(PHI, divIdx * 0.12),
    goldenAnglePosition: angle,
    fibonacciIdentity: fibonacciHash(hashStr(raw.name), 2_147_483_647),
    dimensionalPlane: (divIdx % 5) as DimensionalPlane,
    alwaysRunning: true,
    heartbeatHz: AGENT_HEARTBEAT_HZ * Math.pow(PHI, posInDiv * 0.08),
    canChainCalls: true,
    canSelfImprove: raw.tier === 'AGI-Commander' || raw.tier === 'Commander',
    maxConcurrentTasks: raw.call.maxConcurrent,
  };
}

/** The complete registry of 40 Alpha Agents. */
export const ALPHA_AGENTS: readonly AlphaAgent[] = RAW_ALPHA_AGENTS.map((raw, i) => buildAlphaAgent(raw, i));

// ══════════════════════════════════════════════════════════════════
//  BUILD THE 8 AGENT DIVISIONS
// ══════════════════════════════════════════════════════════════════

const DIVISION_META: Record<AgentDivision, { latin: string; desc: string }> = {
  'exterior-orchestrators':       { latin: 'Divisio Orchestrationis Externae', desc: 'Exterior Orchestrators — 5 agents that coordinate all external systems, partners, multi-cloud, and edge' },
  'web-workers':                  { latin: 'Divisio Operariorum Retis', desc: 'Web Workers — 5 agents that crawl, index, extract, and cache across the entire web' },
  'rendering-workers':            { latin: 'Divisio Reddendi Visualis', desc: 'Rendering Workers — 5 agents that render scenes, composite layers, rasterize vectors, and animate' },
  'data-structure-workers':       { latin: 'Divisio Structurarum Datorum', desc: 'Data Structure Workers — 5 agents that build and query trees, graphs, streams, and spatial indices' },
  'runtime-workers':              { latin: 'Divisio Executionis Temporalis', desc: 'Runtime Workers — 5 agents that execute, schedule, profile, and sandbox all running code' },
  'model-workers':                { latin: 'Divisio Modelorum Intelligentium', desc: 'Model Workers — 5 agents that select, fuse, evaluate, and train AI models' },
  'market-controllers':           { latin: 'Divisio Mercatus Controllorum', desc: 'Market Controllers — 5 agents that price, audit, balance, and enforce the call market' },
  'infrastructure-orchestrators': { latin: 'Divisio Infrastructurae Orchestrationis', desc: 'Infrastructure Orchestrators — 5 agents that monitor, scale, deploy, and recover infrastructure' },
};

function buildAgentDivisionGroup(division: AgentDivision, divIndex: number, members: readonly AlphaAgent[]): AgentDivisionGroup {
  const meta = DIVISION_META[division];
  const allCaps = new Set<string>();
  let totalParams = 0;

  for (const m of members) {
    for (const c of m.capabilities) allCaps.add(c);
    for (const e of m.engines) {
      for (const c of e.capabilities) allCaps.add(c);
      totalParams += e.parameterCount;
    }
  }

  const commander = members.find(m => m.tier === 'AGI-Commander');

  return {
    divisionId: divIndex,
    divisionName: division,
    latinName: meta.latin,
    description: meta.desc,
    members,
    totalEngines: members.length * 3,
    totalParameters: totalParams,
    combinedCapabilities: [...allCaps],
    aggregatePhiWeight: members.reduce((sum, m) => sum + m.phiWeight, 0),
    commanderName: commander?.name ?? 'Unknown',
  };
}

/** The 8 Alpha Agent Divisions. */
export const AGENT_DIVISIONS: readonly AgentDivisionGroup[] = (() => {
  const groups = new Map<AgentDivision, AlphaAgent[]>();
  for (const agent of ALPHA_AGENTS) {
    const list = groups.get(agent.division) ?? [];
    list.push(agent);
    groups.set(agent.division, list);
  }

  const divisionOrder: AgentDivision[] = [
    'exterior-orchestrators', 'web-workers', 'rendering-workers',
    'data-structure-workers', 'runtime-workers', 'model-workers',
    'market-controllers', 'infrastructure-orchestrators',
  ];

  return divisionOrder.map((div, i) => buildAgentDivisionGroup(div, i, groups.get(div) ?? []));
})();

// ══════════════════════════════════════════════════════════════════
//  ALPHA AGENT REGISTRY — Unified Query Interface
// ══════════════════════════════════════════════════════════════════

/**
 * Registry for querying the 40 Always-Running Alpha Agents.
 *
 * These are the exterior workforce — orchestrators, web workers,
 * renderers, data structures, runtimes, models, market controllers,
 * and infrastructure agents.  Always running.  Always callable.
 *
 * Usage:
 *   const registry = new AlphaAgentRegistry();
 *   console.log(registry.totalAgents);            // 40
 *   console.log(registry.totalEngines);           // 120
 *   const cmds = registry.byTier('AGI-Commander'); // 8 AGI Commanders
 *   const web = registry.byDivision('web-workers'); // 5 web agents
 *   const call = registry.findCall('crawl_web');   // Find by call name
 */
export class AlphaAgentRegistry {
  readonly totalAgents = ALPHA_AGENTS.length;
  readonly totalEngines = ALPHA_AGENTS.length * 3;
  readonly totalDivisions = AGENT_DIVISIONS.length;

  /** Get all 40 Alpha Agents. */
  all(): readonly AlphaAgent[] {
    return ALPHA_AGENTS;
  }

  /** Get all 8 Agent Divisions. */
  divisions(): readonly AgentDivisionGroup[] {
    return AGENT_DIVISIONS;
  }

  /** Get an Alpha Agent by index (0–39). */
  get(index: number): AlphaAgent | undefined {
    return ALPHA_AGENTS[index];
  }

  /** Get an Alpha Agent by global ID (e.g. 'alpha-web-workers-0'). */
  byGlobalId(globalId: string): AlphaAgent | undefined {
    return ALPHA_AGENTS.find(a => a.globalId === globalId);
  }

  /** Get all Alpha Agents in a division. */
  byDivision(division: AgentDivision): readonly AlphaAgent[] {
    return ALPHA_AGENTS.filter(a => a.division === division);
  }

  /** Get an Agent Division by name. */
  getDivision(division: AgentDivision): AgentDivisionGroup | undefined {
    return AGENT_DIVISIONS.find(d => d.divisionName === division);
  }

  /** Get all Alpha Agents of a specific tier. */
  byTier(tier: AgentTier): readonly AlphaAgent[] {
    return ALPHA_AGENTS.filter(a => a.tier === tier);
  }

  /** Get all AGI-Commander agents. */
  commanders(): readonly AlphaAgent[] {
    return this.byTier('AGI-Commander');
  }

  /** Find an agent by its callable call name. */
  findCall(callName: string): AlphaAgent | undefined {
    return ALPHA_AGENTS.find(a => a.callableMetadata.callName === callName);
  }

  /** Get all callable metadata for discovery. */
  listCalls(): readonly CallableMetadata[] {
    return ALPHA_AGENTS.map(a => a.callableMetadata);
  }

  /** Get all calls in a specific cost class. */
  callsByCost(cost: CostClass): readonly AlphaAgent[] {
    return ALPHA_AGENTS.filter(a => a.callableMetadata.costClass === cost);
  }

  /** Get all calls in a specific latency class. */
  callsByLatency(latency: LatencyClass): readonly AlphaAgent[] {
    return ALPHA_AGENTS.filter(a => a.callableMetadata.latencyClass === latency);
  }

  /** Get all calls at a specific security tier. */
  callsBySecurity(security: SecurityTier): readonly AlphaAgent[] {
    return ALPHA_AGENTS.filter(a => a.callableMetadata.securityTier === security);
  }

  /** Get agents that can chain to a specific call. */
  chainsTo(callName: string): readonly AlphaAgent[] {
    return ALPHA_AGENTS.filter(a => a.callableMetadata.allowedChainingTargets.includes(callName));
  }

  /** Execute an agent call. */
  invoke(callName: string, input: Record<string, unknown>): AgentCallResult {
    const agent = this.findCall(callName);
    if (!agent) throw new Error(`Alpha Agent call '${callName}' not found`);

    const engine = agent.engines[1]; // synthesize engine is the worker
    const startTime = Date.now();

    return {
      agentId: agent.id,
      agentName: agent.name,
      callName,
      engineUsed: 'synthesize',
      input,
      output: { status: 'processed', agent: agent.name, call: callName },
      outputFormat: agent.callableMetadata.outputType,
      processingTimeMs: Date.now() - startTime + engine.latencyMs,
      costClass: agent.callableMetadata.costClass,
      latencyClass: agent.callableMetadata.latencyClass,
      confidence: agent.callableMetadata.reliabilityScore,
      substrateHash: fibonacciHash(hashStr(JSON.stringify(input)), 2_147_483_647),
    };
  }

  /** Get aggregate workforce statistics. */
  stats(): {
    totalAgents: number;
    totalEngines: number;
    totalDivisions: number;
    totalCalls: number;
    totalCapabilities: number;
    agiCommanderCount: number;
    commanderCount: number;
    specialistCount: number;
    workerCount: number;
    alwaysRunningCount: number;
    selfImprovingCount: number;
    totalParameters: number;
    aggregatePhiWeight: number;
    averageReliability: number;
  } {
    const allCaps = new Set<string>();
    let totalParams = 0;
    let totalReliability = 0;

    for (const a of ALPHA_AGENTS) {
      for (const c of a.capabilities) allCaps.add(c);
      totalReliability += a.callableMetadata.reliabilityScore;
      for (const e of a.engines) {
        for (const c of e.capabilities) allCaps.add(c);
        totalParams += e.parameterCount;
      }
    }

    return {
      totalAgents: this.totalAgents,
      totalEngines: this.totalEngines,
      totalDivisions: this.totalDivisions,
      totalCalls: ALPHA_AGENTS.length,
      totalCapabilities: allCaps.size,
      agiCommanderCount: ALPHA_AGENTS.filter(a => a.tier === 'AGI-Commander').length,
      commanderCount: ALPHA_AGENTS.filter(a => a.tier === 'Commander').length,
      specialistCount: ALPHA_AGENTS.filter(a => a.tier === 'Specialist').length,
      workerCount: ALPHA_AGENTS.filter(a => a.tier === 'Worker').length,
      alwaysRunningCount: ALPHA_AGENTS.filter(a => a.alwaysRunning).length,
      selfImprovingCount: ALPHA_AGENTS.filter(a => a.canSelfImprove).length,
      totalParameters: totalParams,
      aggregatePhiWeight: ALPHA_AGENTS.reduce((s, a) => s + a.phiWeight, 0),
      averageReliability: totalReliability / ALPHA_AGENTS.length,
    };
  }
}
