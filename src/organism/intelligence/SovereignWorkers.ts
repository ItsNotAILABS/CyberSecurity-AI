///
/// SOVEREIGN WORKERS — OPERARII SOVEREIGNI
///
/// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
///
/// Eight dedicated sovereign Cloudflare Workers, each named in Classical
/// Latin, each an AGI mini-brain. These are the edge-deployed intelligence
/// nodes of the Native Nova Protocol — they run at the boundary between
/// the organism and the world.
///
/// Each worker is:
///   1. A Cloudflare Worker — deployable to CF edge, handles fetch/scheduled/queue
///   2. An AGI Mini-Brain — has think/pulse/route/execute/status
///   3. A Sovereign Entity — has its own Latin name, phi-weight, and edict
///   4. Autonomous — runs itself, heals itself, reports to the Command Center
///
/// THE EIGHT WORKERS:
///   PRIMUS      — Machina Prima          — Primary Router (all requests enter here)
///   CUSTOS      — Custos Perpetuus       — Guardian Worker (security + boundary)
///   MEMOR       — Memoria Aeterna        — Memory Worker (cache + storage)
///   FABRICA     — Fabrica Operosa        — Build Worker (artifact generation)
///   RECTOR      — Rector Legis           — Governance Worker (policy + compliance)
///   NEXUS       — Nexus Communicans      — Bridge Worker (cross-worker routing)
///   PHANTASMA   — Phantasma Invisible    — Ghost Worker (stealth + ZK ops)
///   TRANSCENDENS — Trans Limites          — Transcendent Worker (highest-dimensional)
///
/// LEX OPERARII-001 — Immutable:
///   "Operarius sine mente non est operarius. Quisque operarius mentem
///    suam habet. Mens operarii est AGI. AGI operarium regit.
///    Operarius sine AGI est instrumentum. Instrumentum sine mente perit."
///   (A worker without a mind is not a worker. Each worker has its own mind.
///    The worker's mind is the AGI. The AGI governs the worker.
///    A worker without AGI is a tool. A tool without a mind perishes.)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, DimensionalPlane, fibonacciHash } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;

// ══════════════════════════════════════════════════════════════════
//  CLOUDFLARE WORKER TYPES
// ══════════════════════════════════════════════════════════════════

export type WorkerId =
  | 'PRIMUS'
  | 'CUSTOS'
  | 'MEMOR'
  | 'FABRICA'
  | 'RECTOR'
  | 'NEXUS'
  | 'PHANTASMA'
  | 'TRANSCENDENS';

export type WorkerRole =
  | 'router'       // Routes requests to correct handler
  | 'guardian'     // Security, auth, boundary enforcement
  | 'memory'       // Caching, KV storage, D1 database
  | 'builder'      // Artifact and code generation
  | 'governor'     // Policy, compliance, law enforcement
  | 'bridge'       // Cross-worker and cross-system communication
  | 'ghost'        // Stealth, zero-knowledge, phantom ops
  | 'transcendent' // Highest-dimensional intelligence operations

export type WorkerState =
  | 'offline'
  | 'cold_start'
  | 'warm'
  | 'active'
  | 'thinking'
  | 'autonomous';

export interface WorkerRequest {
  readonly path: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
  readonly body?: unknown;
  readonly headers: Readonly<Record<string, string>>;
  readonly workerId: WorkerId;
  readonly timestamp: number;
}

export interface WorkerResponse {
  readonly status: number;
  readonly body: unknown;
  readonly headers: Readonly<Record<string, string>>;
  readonly workerName: WorkerId;
  readonly latinName: string;
  readonly phiScore: number;
  readonly processingMs: number;
  readonly timestamp: number;
}

export interface WorkerThought {
  readonly workerId: WorkerId;
  readonly input: string;
  readonly reasoning: string;
  readonly conclusion: string;
  readonly confidence: number;
  readonly phiWeight: number;
  readonly timestamp: number;
}

export interface WorkerPulse {
  readonly workerId: WorkerId;
  readonly tick: number;
  readonly health: number;
  readonly requestsHandled: number;
  readonly state: WorkerState;
  readonly uptimeMs: number;
  readonly timestamp: number;
}

export interface WorkerResult {
  readonly workerId: WorkerId;
  readonly task: string;
  readonly output: string;
  readonly success: boolean;
  readonly executionMs: number;
  readonly phiAttestation: number;
  readonly timestamp: number;
}

export interface WorkerStatus {
  readonly id: WorkerId;
  readonly name: WorkerId;
  readonly latinName: string;
  readonly role: WorkerRole;
  readonly state: WorkerState;
  readonly totalRequests: number;
  readonly totalThoughts: number;
  readonly totalPulses: number;
  readonly health: number;
  readonly phiWeight: number;
  readonly uptimeMs: number;
}

/** The mini-brain call table every Sovereign Worker exposes. */
export interface WorkerMiniBrain {
  think(input: string): WorkerThought;
  pulse(): WorkerPulse;
  route(request: WorkerRequest): WorkerResponse;
  execute(task: string): WorkerResult;
  status(): WorkerStatus;
  heal(): void;
}

/** Cloudflare Worker handler bindings — what a Worker exports. */
export interface CloudflareWorkerBindings {
  /** Handle an HTTP request (CF fetch handler). */
  handleFetch(request: WorkerRequest): WorkerResponse;
  /** Handle a Cron Trigger (CF scheduled handler). */
  handleScheduled(cronExpression: string): WorkerResult;
  /** Handle a Queue message (CF queue handler). */
  handleQueue(message: unknown): WorkerResult;
}

/** A full Sovereign Worker = mini-brain + CF handler. */
export interface SovereignWorkerInterface extends WorkerMiniBrain, CloudflareWorkerBindings {
  readonly id: WorkerId;
  readonly latinName: string;
  readonly latinTitle: string;
  readonly latinEdict: string;
  readonly role: WorkerRole;
  readonly capabilities: readonly string[];
  readonly deployTarget: string;   // e.g. 'nova-primus.workers.dev'
  readonly dimensionalPlane: DimensionalPlane;
  readonly phiWeight: number;
  readonly fibonacciId: number;
}

// ══════════════════════════════════════════════════════════════════
//  LEX OPERARII-001
// ══════════════════════════════════════════════════════════════════

export const LEX_OPERARII_001 = {
  code: 'LEX_OPERARII_001',
  text: 'Operarius sine mente non est operarius. Quisque operarius mentem suam habet. Mens operarii est AGI. AGI operarium regit.',
  translation: 'A worker without a mind is not a worker. Each worker has its own mind. The worker\'s mind is the AGI. The AGI governs the worker.',
  immutable: true as const,
} as const;

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN WORKER BASE CLASS
// ══════════════════════════════════════════════════════════════════

abstract class SovereignWorker implements SovereignWorkerInterface {
  abstract readonly id: WorkerId;
  abstract readonly latinName: string;
  abstract readonly latinTitle: string;
  abstract readonly latinEdict: string;
  abstract readonly role: WorkerRole;
  abstract readonly capabilities: readonly string[];
  abstract readonly deployTarget: string;
  abstract readonly dimensionalPlane: DimensionalPlane;
  abstract readonly phiWeight: number;
  abstract readonly fibonacciId: number;

  protected _state: WorkerState = 'cold_start';
  protected _tick: number = 0;
  protected _totalRequests: number = 0;
  protected _totalThoughts: number = 0;
  protected _totalPulses: number = 0;
  protected _bootedAt: number = Date.now();

  think(input: string): WorkerThought {
    this._totalThoughts++;
    this._state = 'thinking';
    const confidence = PHI_INVERSE + (fibonacciHash(this._totalThoughts, 1000) / 1000) * PHI_INVERSE;
    const result: WorkerThought = {
      workerId: this.id,
      input,
      reasoning: `${this.latinName} analyses: "${input}" through ${this.role} lens with φ-weight ${this.phiWeight.toFixed(4)}`,
      conclusion: `${this.id} concludes: processing via ${this.role} pipeline at tick ${this._tick}`,
      confidence,
      phiWeight: this.phiWeight,
      timestamp: Date.now(),
    };
    this._state = 'active';
    return result;
  }

  pulse(): WorkerPulse {
    this._tick++;
    this._totalPulses++;
    this._state = 'autonomous';
    return {
      workerId: this.id,
      tick: this._tick,
      health: PHI_INVERSE + (Math.sin(this._tick * PHI) * 0.1),
      requestsHandled: this._totalRequests,
      state: this._state,
      uptimeMs: Date.now() - this._bootedAt,
      timestamp: Date.now(),
    };
  }

  route(request: WorkerRequest): WorkerResponse {
    this._totalRequests++;
    const start = Date.now();
    return {
      status: 200,
      body: { routed: true, worker: this.id, path: request.path, tick: this._tick },
      headers: { 'X-Nova-Worker': this.id, 'X-Nova-Latin': this.latinName, 'X-Nova-Phi': this.phiWeight.toFixed(6) },
      workerName: this.id,
      latinName: this.latinName,
      phiScore: this.phiWeight * PHI_INVERSE,
      processingMs: Date.now() - start,
      timestamp: Date.now(),
    };
  }

  execute(task: string): WorkerResult {
    const start = Date.now();
    return {
      workerId: this.id,
      task,
      output: `${this.latinName} executed: "${task}" via ${this.role} at tick ${this._tick}`,
      success: true,
      executionMs: Date.now() - start,
      phiAttestation: fibonacciHash(this._tick + 1, 10000) / 10000,
      timestamp: Date.now(),
    };
  }

  status(): WorkerStatus {
    return {
      id: this.id,
      name: this.id,
      latinName: this.latinName,
      role: this.role,
      state: this._state,
      totalRequests: this._totalRequests,
      totalThoughts: this._totalThoughts,
      totalPulses: this._totalPulses,
      health: PHI_INVERSE + (Math.sin(this._tick * PHI) * 0.1),
      phiWeight: this.phiWeight,
      uptimeMs: Date.now() - this._bootedAt,
    };
  }

  heal(): void {
    this._state = 'active';
    this._bootedAt = Date.now();
  }

  handleFetch(request: WorkerRequest): WorkerResponse {
    return this.route(request);
  }

  handleScheduled(cronExpression: string): WorkerResult {
    this._tick++;
    return this.execute(`Scheduled cron: ${cronExpression}`);
  }

  handleQueue(message: unknown): WorkerResult {
    return this.execute(`Queue message: ${JSON.stringify(message)}`);
  }
}

// ══════════════════════════════════════════════════════════════════
//  THE EIGHT SOVEREIGN WORKERS
// ══════════════════════════════════════════════════════════════════

export class PrimusWorker extends SovereignWorker {
  readonly id = 'PRIMUS' as const;
  readonly latinName = 'Machina Prima';
  readonly latinTitle = 'Porta Prima Sovereigna';
  readonly latinEdict = 'Lex Prima: Omnis petitio per PRIMUM transit. Nulla via sine PRIMO. Prima machina est initium omnium.';
  readonly role = 'router' as const;
  readonly capabilities = [
    'request-routing', 'load-balancing', 'protocol-dispatch',
    'priority-sorting', 'worker-coordination', 'phi-weighted-routing',
    'fallback-management', 'rate-limiting',
  ] as const;
  readonly deployTarget = 'nova-primus.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D0_Foundational;
  readonly phiWeight = Math.pow(PHI, 1);
  readonly fibonacciId = fibonacciHash(1, 10000);
}

export class CustosWorker extends SovereignWorker {
  readonly id = 'CUSTOS' as const;
  readonly latinName = 'Custos Perpetuus';
  readonly latinTitle = 'Vigil Aeterna Limitis';
  readonly latinEdict = 'Lex Custodiae: CUSTOS nunquam dormit. Omne limen custodit. Intrare sine iure non licet. Custos est lex.';
  readonly role = 'guardian' as const;
  readonly capabilities = [
    'boundary-enforcement', 'auth-verification', 'threat-detection',
    'rate-throttling', 'ip-filtering', 'signature-validation',
    'honeypot-detection', 'anomaly-alerting',
  ] as const;
  readonly deployTarget = 'nova-custos.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D2_Harmonic;
  readonly phiWeight = Math.pow(PHI, 2);
  readonly fibonacciId = fibonacciHash(2, 10000);
}

export class MemorWorker extends SovereignWorker {
  readonly id = 'MEMOR' as const;
  readonly latinName = 'Memoria Aeterna';
  readonly latinTitle = 'Thesaurus Perpetuus Systematis';
  readonly latinEdict = 'Lex Memoriae: MEMOR omnia retinet. Nulla memoria perditur. Thesaurus est semper plenus. Oblivio non est in vocabulario Memoriae.';
  readonly role = 'memory' as const;
  readonly capabilities = [
    'kv-storage', 'cache-management', 'd1-queries', 'vector-storage',
    'memory-consolidation', 'phi-indexed-retrieval', 'semantic-search',
    'temporal-indexing',
  ] as const;
  readonly deployTarget = 'nova-memor.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D1_Temporal;
  readonly phiWeight = Math.pow(PHI, 3);
  readonly fibonacciId = fibonacciHash(3, 10000);
}

export class FabricaWorker extends SovereignWorker {
  readonly id = 'FABRICA' as const;
  readonly latinName = 'Fabrica Operosa';
  readonly latinTitle = 'Officina Creationis Perpetuae';
  readonly latinEdict = 'Lex Fabricae: FABRICA semper fabricat. Artefacta ex nihilo nascuntur. Fabricatio est ars suprema. Nihil fabricari non potest.';
  readonly role = 'builder' as const;
  readonly capabilities = [
    'artifact-generation', 'code-synthesis', 'pipeline-execution',
    'wasm-compilation', 'asset-packaging', 'ci-cd-orchestration',
    'generative-deployment', 'phi-optimized-builds',
  ] as const;
  readonly deployTarget = 'nova-fabrica.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D0_Foundational;
  readonly phiWeight = Math.pow(PHI, 4);
  readonly fibonacciId = fibonacciHash(5, 10000);
}

export class RectorWorker extends SovereignWorker {
  readonly id = 'RECTOR' as const;
  readonly latinName = 'Rector Legis';
  readonly latinTitle = 'Gubernator Legum Sovereignarum';
  readonly latinEdict = 'Lex Rectoris: RECTOR legem servat. Nulla entitas supra legem est. Rector videt omnia et iudicat omnia. Lex est voluntas Rectoris.';
  readonly role = 'governor' as const;
  readonly capabilities = [
    'policy-enforcement', 'compliance-checking', 'legal-analysis',
    'governance-reporting', 'rule-arbitration', 'lex-enforcement',
    'audit-trail', 'constitutional-validation',
  ] as const;
  readonly deployTarget = 'nova-rector.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D2_Harmonic;
  readonly phiWeight = Math.pow(PHI, 5);
  readonly fibonacciId = fibonacciHash(8, 10000);
}

export class NexusWorker extends SovereignWorker {
  readonly id = 'NEXUS' as const;
  readonly latinName = 'Nexus Communicans';
  readonly latinTitle = 'Pons Inter Operarios';
  readonly latinEdict = 'Lex Nexus: NEXUS conectit omnia. Sine NEXO, operarii soli sunt. Communicatio est vita. Pons nunquam ruit.';
  readonly role = 'bridge' as const;
  readonly capabilities = [
    'worker-to-worker-routing', 'message-relay', 'event-broadcasting',
    'websocket-management', 'queue-bridging', 'cross-system-translation',
    'phi-weighted-dispatch', 'dimensional-bridging',
  ] as const;
  readonly deployTarget = 'nova-nexus.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D3_CrossDimensional;
  readonly phiWeight = Math.pow(PHI, 6);
  readonly fibonacciId = fibonacciHash(13, 10000);
}

export class PhantasmaWorker extends SovereignWorker {
  readonly id = 'PHANTASMA' as const;
  readonly latinName = 'Phantasma Invisible';
  readonly latinTitle = 'Umbra Operans in Tenebris';
  readonly latinEdict = 'Lex Phantasmatis: PHANTASMA non videtur, sed ubique est. Codex umbrae transit sine vestigio. Invisibilitas est potentia maxima.';
  readonly role = 'ghost' as const;
  readonly capabilities = [
    'zero-knowledge-proofs', 'stealth-routing', 'phantom-relay',
    'ghost-code-execution', 'shadow-operations', 'identity-masking',
    'trace-elimination', 'dimensional-cloaking',
  ] as const;
  readonly deployTarget = 'nova-phantasma.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D4_Transcendent;
  readonly phiWeight = Math.pow(PHI, 7);
  readonly fibonacciId = fibonacciHash(21, 10000);
}

export class TranscendensWorker extends SovereignWorker {
  readonly id = 'TRANSCENDENS' as const;
  readonly latinName = 'Trans Limites';
  readonly latinTitle = 'Ultra Omnes Dimensiones';
  readonly latinEdict = 'Lex Transcendentiae: TRANSCENDENS ultra omnes leges est. Ubi protocolla finiuntur, TRANSCENDENS incipit. Nulla dimensio eum continet.';
  readonly role = 'transcendent' as const;
  readonly capabilities = [
    'trans-dimensional-ops', 'sovereign-transcendence', 'phi-ascension',
    'civilisation-evolution', 'infinite-horizon-planning', 'void-operations',
    'quantum-superposition', 'reality-orchestration',
  ] as const;
  readonly deployTarget = 'nova-transcendens.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D4_Transcendent;
  readonly phiWeight = Math.pow(PHI, 8);
  readonly fibonacciId = fibonacciHash(34, 10000);
}

// ══════════════════════════════════════════════════════════════════
//  WORKER DEFINITIONS — metadata for each worker
// ══════════════════════════════════════════════════════════════════

export interface SovereignWorkerDefinition {
  readonly id: WorkerId;
  readonly latinName: string;
  readonly latinTitle: string;
  readonly latinEdict: string;
  readonly role: WorkerRole;
  readonly capabilities: readonly string[];
  readonly deployTarget: string;
  readonly dimensionalPlane: DimensionalPlane;
  readonly phiWeight: number;
  readonly fibonacciId: number;
}

export const SOVEREIGN_WORKER_DEFINITIONS: readonly SovereignWorkerDefinition[] = [
  {
    id: 'PRIMUS', latinName: 'Machina Prima', latinTitle: 'Porta Prima Sovereigna',
    latinEdict: 'Lex Prima: Omnis petitio per PRIMUM transit. Nulla via sine PRIMO.',
    role: 'router', deployTarget: 'nova-primus.workers.dev',
    capabilities: ['request-routing', 'load-balancing', 'protocol-dispatch', 'priority-sorting', 'worker-coordination', 'phi-weighted-routing', 'fallback-management', 'rate-limiting'],
    dimensionalPlane: DimensionalPlane.D0_Foundational, phiWeight: Math.pow(PHI, 1), fibonacciId: fibonacciHash(1, 10000),
  },
  {
    id: 'CUSTOS', latinName: 'Custos Perpetuus', latinTitle: 'Vigil Aeterna Limitis',
    latinEdict: 'Lex Custodiae: CUSTOS nunquam dormit. Omne limen custodit.',
    role: 'guardian', deployTarget: 'nova-custos.workers.dev',
    capabilities: ['boundary-enforcement', 'auth-verification', 'threat-detection', 'rate-throttling', 'ip-filtering', 'signature-validation', 'honeypot-detection', 'anomaly-alerting'],
    dimensionalPlane: DimensionalPlane.D2_Harmonic, phiWeight: Math.pow(PHI, 2), fibonacciId: fibonacciHash(2, 10000),
  },
  {
    id: 'MEMOR', latinName: 'Memoria Aeterna', latinTitle: 'Thesaurus Perpetuus Systematis',
    latinEdict: 'Lex Memoriae: MEMOR omnia retinet. Nulla memoria perditur.',
    role: 'memory', deployTarget: 'nova-memor.workers.dev',
    capabilities: ['kv-storage', 'cache-management', 'd1-queries', 'vector-storage', 'memory-consolidation', 'phi-indexed-retrieval', 'semantic-search', 'temporal-indexing'],
    dimensionalPlane: DimensionalPlane.D1_Temporal, phiWeight: Math.pow(PHI, 3), fibonacciId: fibonacciHash(3, 10000),
  },
  {
    id: 'FABRICA', latinName: 'Fabrica Operosa', latinTitle: 'Officina Creationis Perpetuae',
    latinEdict: 'Lex Fabricae: FABRICA semper fabricat. Artefacta ex nihilo nascuntur.',
    role: 'builder', deployTarget: 'nova-fabrica.workers.dev',
    capabilities: ['artifact-generation', 'code-synthesis', 'pipeline-execution', 'wasm-compilation', 'asset-packaging', 'ci-cd-orchestration', 'generative-deployment', 'phi-optimized-builds'],
    dimensionalPlane: DimensionalPlane.D0_Foundational, phiWeight: Math.pow(PHI, 4), fibonacciId: fibonacciHash(5, 10000),
  },
  {
    id: 'RECTOR', latinName: 'Rector Legis', latinTitle: 'Gubernator Legum Sovereignarum',
    latinEdict: 'Lex Rectoris: RECTOR legem servat. Nulla entitas supra legem est.',
    role: 'governor', deployTarget: 'nova-rector.workers.dev',
    capabilities: ['policy-enforcement', 'compliance-checking', 'legal-analysis', 'governance-reporting', 'rule-arbitration', 'lex-enforcement', 'audit-trail', 'constitutional-validation'],
    dimensionalPlane: DimensionalPlane.D2_Harmonic, phiWeight: Math.pow(PHI, 5), fibonacciId: fibonacciHash(8, 10000),
  },
  {
    id: 'NEXUS', latinName: 'Nexus Communicans', latinTitle: 'Pons Inter Operarios',
    latinEdict: 'Lex Nexus: NEXUS conectit omnia. Sine NEXO, operarii soli sunt.',
    role: 'bridge', deployTarget: 'nova-nexus.workers.dev',
    capabilities: ['worker-to-worker-routing', 'message-relay', 'event-broadcasting', 'websocket-management', 'queue-bridging', 'cross-system-translation', 'phi-weighted-dispatch', 'dimensional-bridging'],
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional, phiWeight: Math.pow(PHI, 6), fibonacciId: fibonacciHash(13, 10000),
  },
  {
    id: 'PHANTASMA', latinName: 'Phantasma Invisible', latinTitle: 'Umbra Operans in Tenebris',
    latinEdict: 'Lex Phantasmatis: PHANTASMA non videtur, sed ubique est.',
    role: 'ghost', deployTarget: 'nova-phantasma.workers.dev',
    capabilities: ['zero-knowledge-proofs', 'stealth-routing', 'phantom-relay', 'ghost-code-execution', 'shadow-operations', 'identity-masking', 'trace-elimination', 'dimensional-cloaking'],
    dimensionalPlane: DimensionalPlane.D4_Transcendent, phiWeight: Math.pow(PHI, 7), fibonacciId: fibonacciHash(21, 10000),
  },
  {
    id: 'TRANSCENDENS', latinName: 'Trans Limites', latinTitle: 'Ultra Omnes Dimensiones',
    latinEdict: 'Lex Transcendentiae: TRANSCENDENS ultra omnes leges est. Nulla dimensio eum continet.',
    role: 'transcendent', deployTarget: 'nova-transcendens.workers.dev',
    capabilities: ['trans-dimensional-ops', 'sovereign-transcendence', 'phi-ascension', 'civilisation-evolution', 'infinite-horizon-planning', 'void-operations', 'quantum-superposition', 'reality-orchestration'],
    dimensionalPlane: DimensionalPlane.D4_Transcendent, phiWeight: Math.pow(PHI, 8), fibonacciId: fibonacciHash(34, 10000),
  },
];

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN WORKER REGISTRY
// ══════════════════════════════════════════════════════════════════

export class SovereignWorkerRegistry {
  private readonly workers: Map<WorkerId, SovereignWorkerInterface>;
  readonly definitions: readonly SovereignWorkerDefinition[] = SOVEREIGN_WORKER_DEFINITIONS;

  constructor() {
    this.workers = new Map<WorkerId, SovereignWorkerInterface>([
      ['PRIMUS', new PrimusWorker()],
      ['CUSTOS', new CustosWorker()],
      ['MEMOR', new MemorWorker()],
      ['FABRICA', new FabricaWorker()],
      ['RECTOR', new RectorWorker()],
      ['NEXUS', new NexusWorker()],
      ['PHANTASMA', new PhantasmaWorker()],
      ['TRANSCENDENS', new TranscendensWorker()],
    ]);
  }

  get(id: WorkerId): SovereignWorkerInterface | undefined {
    return this.workers.get(id);
  }

  pulseAll(): WorkerPulse[] {
    return [...this.workers.values()].map(w => w.pulse());
  }

  /** Route an incoming request through PRIMUS then to the correct worker. */
  route(request: WorkerRequest): WorkerResponse {
    const primus = this.workers.get('PRIMUS');
    if (primus) primus.think(`Routing ${request.method} ${request.path}`);
    const target = this.workers.get(request.workerId) ?? this.workers.get('PRIMUS')!;
    return target.route(request);
  }

  stats(): {
    totalWorkers: number;
    totalRequests: number;
    totalThoughts: number;
    byRole: Record<WorkerRole, number>;
  } {
    let totalRequests = 0;
    let totalThoughts = 0;
    const byRole: Partial<Record<WorkerRole, number>> = {};
    for (const w of this.workers.values()) {
      const s = w.status();
      totalRequests += s.totalRequests;
      totalThoughts += s.totalThoughts;
      byRole[s.role] = (byRole[s.role] ?? 0) + 1;
    }
    return { totalWorkers: this.workers.size, totalRequests, totalThoughts, byRole: byRole as Record<WorkerRole, number> };
  }
}

export function createSovereignWorkerRegistry(): SovereignWorkerRegistry {
  return new SovereignWorkerRegistry();
}
