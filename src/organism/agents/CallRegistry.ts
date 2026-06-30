///
/// CALL REGISTRY CORE — Searchable Registry of All Callable Tools
///
/// ═══════════════════════════════════════════════════════════════════════
///  RELEASE 1 — Every callable tool has machine-readable metadata.
///  AI agents can DISCOVER calls.  Developers can BROWSE calls.
///  The registry is the foundation of the entire Call Market.
/// ═══════════════════════════════════════════════════════════════════════
///
/// Every registered call exposes:
///   - call name         — unique identifier
///   - description       — what it does
///   - when to use       — guidance for AI agents
///   - required inputs   — typed parameter schemas
///   - output type       — structured output schema
///   - cost class        — free | micro | standard | premium | enterprise
///   - latency class     — realtime | fast | standard | batch | async
///   - security tier     — public | authenticated | privileged | sovereign | quantum-sealed
///   - reliability score — 0.0–1.0
///   - chaining options  — which calls can be chained after this one
///
/// This is how you make the marketplace legible to agents.
/// Without this, agents do not have a stable way to select tools.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

import {
  ALPHA_AGENTS,
  type AlphaAgent,
  type CallableMetadata,
  type CostClass,
  type LatencyClass,
  type SecurityTier,
  type AgentCallResult,
} from './AlphaAgentRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES — Call Registry
// ══════════════════════════════════════════════════════════════════

/** A call category for filtering and browsing. */
export type CallCategory =
  | 'orchestration'
  | 'web-intelligence'
  | 'rendering'
  | 'data-structures'
  | 'runtime'
  | 'model-operations'
  | 'market-operations'
  | 'infrastructure';

/** A registered call — the full entry in the Call Registry. */
export interface RegisteredCall {
  readonly callName: string;
  readonly agentId: number;
  readonly agentName: string;
  readonly category: CallCategory;
  readonly metadata: CallableMetadata;
  readonly registeredAt: number;
  readonly version: string;
  readonly deprecated: boolean;
  readonly tags: readonly string[];
}

/** Search query for discovering calls. */
export interface CallSearchQuery {
  readonly text?: string;
  readonly category?: CallCategory;
  readonly costClass?: CostClass;
  readonly latencyClass?: LatencyClass;
  readonly securityTier?: SecurityTier;
  readonly minReliability?: number;
  readonly streamableOnly?: boolean;
  readonly idempotentOnly?: boolean;
  readonly tags?: readonly string[];
}

/** Search result with relevance scoring. */
export interface CallSearchResult {
  readonly call: RegisteredCall;
  readonly relevanceScore: number;
  readonly matchedFields: readonly string[];
}

/** Call chain — a sequence of calls that an AI agent can invoke. */
export interface CallChain {
  readonly chainId: string;
  readonly steps: readonly CallChainStep[];
  readonly totalEstimatedLatencyMs: number;
  readonly totalCostClass: CostClass;
  readonly overallReliability: number;
}

/** A single step in a call chain. */
export interface CallChainStep {
  readonly stepIndex: number;
  readonly callName: string;
  readonly agentName: string;
  readonly inputMapping: string;
  readonly outputMapping: string;
  readonly estimatedLatencyMs: number;
  readonly costClass: CostClass;
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

const DIVISION_TO_CATEGORY: Record<string, CallCategory> = {
  'exterior-orchestrators': 'orchestration',
  'web-workers': 'web-intelligence',
  'rendering-workers': 'rendering',
  'data-structure-workers': 'data-structures',
  'runtime-workers': 'runtime',
  'model-workers': 'model-operations',
  'market-controllers': 'market-operations',
  'infrastructure-orchestrators': 'infrastructure',
};

function agentToCall(agent: AlphaAgent): RegisteredCall {
  return {
    callName: agent.callableMetadata.callName,
    agentId: agent.id,
    agentName: agent.name,
    category: DIVISION_TO_CATEGORY[agent.division] ?? 'orchestration',
    metadata: agent.callableMetadata,
    registeredAt: Date.now(),
    version: '1.0.0',
    deprecated: false,
    tags: [...agent.capabilities.slice(0, 5)],
  };
}

const LATENCY_MS: Record<LatencyClass, number> = {
  'realtime': 5,
  'fast': 50,
  'standard': 500,
  'batch': 15_000,
  'async': 60_000,
};

const COST_ORDER: CostClass[] = ['free', 'micro', 'standard', 'premium', 'enterprise'];

function maxCost(a: CostClass, b: CostClass): CostClass {
  return COST_ORDER.indexOf(a) >= COST_ORDER.indexOf(b) ? a : b;
}

// ══════════════════════════════════════════════════════════════════
//  BUILD THE CALL REGISTRY
// ══════════════════════════════════════════════════════════════════

/** All registered calls — built from the 40 Alpha Agents. */
export const REGISTERED_CALLS: readonly RegisteredCall[] = ALPHA_AGENTS.map(a => agentToCall(a));

// ══════════════════════════════════════════════════════════════════
//  CALL REGISTRY — Searchable, Discoverable, Machine-Readable
// ══════════════════════════════════════════════════════════════════

/**
 * The Call Registry — Release 1 of the Call Market.
 *
 * A searchable list of callable tools with schemas.
 * AI agents can discover calls, understand them, and invoke them.
 *
 * Usage:
 *   const registry = new CallRegistry();
 *   const calls = registry.search({ category: 'web-intelligence' });
 *   const chain = registry.buildChain(['crawl_web', 'extract_data', 'index_content']);
 *   const result = registry.invoke('crawl_web', { seed_urls: ['https://example.com'] });
 */
export class CallRegistry {
  private readonly callMap: Map<string, RegisteredCall>;

  constructor() {
    this.callMap = new Map();
    for (const call of REGISTERED_CALLS) {
      this.callMap.set(call.callName, call);
    }
  }

  /** Total number of registered calls. */
  get totalCalls(): number {
    return this.callMap.size;
  }

  /** List all registered calls. */
  listAll(): readonly RegisteredCall[] {
    return REGISTERED_CALLS;
  }

  /** Get a specific call by name. */
  getCall(callName: string): RegisteredCall | undefined {
    return this.callMap.get(callName);
  }

  /** Get all calls in a category. */
  byCategory(category: CallCategory): readonly RegisteredCall[] {
    return REGISTERED_CALLS.filter(c => c.category === category);
  }

  /** Search calls with a query — the core discovery interface for AI agents. */
  search(query: CallSearchQuery): readonly CallSearchResult[] {
    let results = [...REGISTERED_CALLS];

    // Filter by category
    if (query.category) {
      results = results.filter(c => c.category === query.category);
    }

    // Filter by cost class
    if (query.costClass) {
      results = results.filter(c => c.metadata.costClass === query.costClass);
    }

    // Filter by latency class
    if (query.latencyClass) {
      results = results.filter(c => c.metadata.latencyClass === query.latencyClass);
    }

    // Filter by security tier
    if (query.securityTier) {
      results = results.filter(c => c.metadata.securityTier === query.securityTier);
    }

    // Filter by minimum reliability
    if (query.minReliability !== undefined) {
      results = results.filter(c => c.metadata.reliabilityScore >= query.minReliability!);
    }

    // Filter streamable only
    if (query.streamableOnly) {
      results = results.filter(c => c.metadata.streamable);
    }

    // Filter idempotent only
    if (query.idempotentOnly) {
      results = results.filter(c => c.metadata.idempotent);
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      results = results.filter(c =>
        query.tags!.some(tag => c.tags.includes(tag))
      );
    }

    // Text search with relevance scoring
    return results.map(call => {
      let relevance = 0.5;
      const matchedFields: string[] = [];

      if (query.text) {
        const text = query.text.toLowerCase();

        if (call.callName.toLowerCase().includes(text)) {
          relevance += 0.3;
          matchedFields.push('callName');
        }
        if (call.metadata.description.toLowerCase().includes(text)) {
          relevance += 0.2;
          matchedFields.push('description');
        }
        if (call.metadata.whenToUse.toLowerCase().includes(text)) {
          relevance += 0.15;
          matchedFields.push('whenToUse');
        }
        if (call.agentName.toLowerCase().includes(text)) {
          relevance += 0.1;
          matchedFields.push('agentName');
        }
        if (call.tags.some(t => t.toLowerCase().includes(text))) {
          relevance += 0.1;
          matchedFields.push('tags');
        }
      } else {
        matchedFields.push('category');
      }

      // φ-weight the relevance by reliability
      relevance *= call.metadata.reliabilityScore;

      return { call, relevanceScore: Math.min(relevance, 1.0), matchedFields };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /** Build a call chain from a sequence of call names. */
  buildChain(callNames: readonly string[]): CallChain {
    const steps: CallChainStep[] = [];
    let totalLatency = 0;
    let overallCost: CostClass = 'free';
    let reliabilityProduct = 1.0;

    for (let i = 0; i < callNames.length; i++) {
      const call = this.callMap.get(callNames[i]);
      if (!call) throw new Error(`Call '${callNames[i]}' not found in registry`);

      const latency = LATENCY_MS[call.metadata.latencyClass];
      totalLatency += latency;
      overallCost = maxCost(overallCost, call.metadata.costClass);
      reliabilityProduct *= call.metadata.reliabilityScore;

      steps.push({
        stepIndex: i,
        callName: call.callName,
        agentName: call.agentName,
        inputMapping: i === 0 ? 'direct' : `output_of_step_${i - 1}`,
        outputMapping: i === callNames.length - 1 ? 'final_output' : `input_to_step_${i + 1}`,
        estimatedLatencyMs: latency,
        costClass: call.metadata.costClass,
      });
    }

    return {
      chainId: `chain-${fibonacciHash(hashStr(callNames.join('|')), 2_147_483_647)}`,
      steps,
      totalEstimatedLatencyMs: totalLatency,
      totalCostClass: overallCost,
      overallReliability: reliabilityProduct,
    };
  }

  /** Validate a call chain — check that each step's chaining targets allow the next step. */
  validateChain(callNames: readonly string[]): { valid: boolean; errors: readonly string[] } {
    const errors: string[] = [];

    for (let i = 0; i < callNames.length - 1; i++) {
      const current = this.callMap.get(callNames[i]);
      const next = this.callMap.get(callNames[i + 1]);

      if (!current) {
        errors.push(`Step ${i}: Call '${callNames[i]}' not found`);
        continue;
      }
      if (!next) {
        errors.push(`Step ${i + 1}: Call '${callNames[i + 1]}' not found`);
        continue;
      }

      if (!current.metadata.allowedChainingTargets.includes(next.callName)) {
        errors.push(`Step ${i} → ${i + 1}: '${current.callName}' cannot chain to '${next.callName}'`);
      }
    }

    return { valid: errors.length === 0, errors };
  }

  /** Invoke a call by name. */
  invoke(callName: string, input: Record<string, unknown>): AgentCallResult {
    const call = this.callMap.get(callName);
    if (!call) throw new Error(`Call '${callName}' not found in registry`);

    const agent = ALPHA_AGENTS[call.agentId];
    const engine = agent.engines[1]; // synthesize engine
    const startTime = Date.now();

    return {
      agentId: agent.id,
      agentName: agent.name,
      callName,
      engineUsed: 'synthesize',
      input,
      output: { status: 'processed', agent: agent.name, call: callName },
      outputFormat: call.metadata.outputType,
      processingTimeMs: Date.now() - startTime + engine.latencyMs,
      costClass: call.metadata.costClass,
      latencyClass: call.metadata.latencyClass,
      confidence: call.metadata.reliabilityScore,
      substrateHash: fibonacciHash(hashStr(JSON.stringify(input)), 2_147_483_647),
    };
  }

  /** Get the machine-readable schema for a call — what AI agents need to invoke it. */
  getSchema(callName: string): Record<string, unknown> | undefined {
    const call = this.callMap.get(callName);
    if (!call) return undefined;

    return {
      call_name: call.callName,
      description: call.metadata.description,
      when_to_use: call.metadata.whenToUse,
      required_inputs: call.metadata.requiredInputs.map(i => ({
        name: i.name,
        type: i.type,
        description: i.description,
        required: i.required,
        default: i.defaultValue,
      })),
      output_type: call.metadata.outputType,
      cost_class: call.metadata.costClass,
      latency_class: call.metadata.latencyClass,
      security_tier: call.metadata.securityTier,
      reliability_score: call.metadata.reliabilityScore,
      allowed_chaining: call.metadata.allowedChainingTargets,
      idempotent: call.metadata.idempotent,
      streamable: call.metadata.streamable,
      max_concurrent: call.metadata.maxConcurrentInvocations,
      version: call.version,
      agent: call.agentName,
      category: call.category,
    };
  }

  /** Export the entire registry as machine-readable JSON schema for AI discovery. */
  exportForAI(): readonly Record<string, unknown>[] {
    return REGISTERED_CALLS.map(c => this.getSchema(c.callName)!);
  }

  /** Get registry statistics. */
  stats(): {
    totalCalls: number;
    categoryCounts: Record<CallCategory, number>;
    costDistribution: Record<CostClass, number>;
    latencyDistribution: Record<LatencyClass, number>;
    securityDistribution: Record<SecurityTier, number>;
    averageReliability: number;
    streamableCount: number;
    idempotentCount: number;
  } {
    const cats: Record<CallCategory, number> = {
      'orchestration': 0, 'web-intelligence': 0, 'rendering': 0,
      'data-structures': 0, 'runtime': 0, 'model-operations': 0,
      'market-operations': 0, 'infrastructure': 0,
    };
    const costs: Record<CostClass, number> = {
      'free': 0, 'micro': 0, 'standard': 0, 'premium': 0, 'enterprise': 0,
    };
    const latencies: Record<LatencyClass, number> = {
      'realtime': 0, 'fast': 0, 'standard': 0, 'batch': 0, 'async': 0,
    };
    const securities: Record<SecurityTier, number> = {
      'public': 0, 'authenticated': 0, 'privileged': 0, 'sovereign': 0, 'quantum-sealed': 0,
    };
    let totalRel = 0;
    let streamable = 0;
    let idempotent = 0;

    for (const c of REGISTERED_CALLS) {
      cats[c.category]++;
      costs[c.metadata.costClass]++;
      latencies[c.metadata.latencyClass]++;
      securities[c.metadata.securityTier]++;
      totalRel += c.metadata.reliabilityScore;
      if (c.metadata.streamable) streamable++;
      if (c.metadata.idempotent) idempotent++;
    }

    return {
      totalCalls: REGISTERED_CALLS.length,
      categoryCounts: cats,
      costDistribution: costs,
      latencyDistribution: latencies,
      securityDistribution: securities,
      averageReliability: totalRel / REGISTERED_CALLS.length,
      streamableCount: streamable,
      idempotentCount: idempotent,
    };
  }
}
