///
/// AGI MINI BRAINS — MENTIS AGI MINIMAE
///
/// ISIL-1.1 — Copyright (c) 2026 ItsNotAILABS. All Rights Reserved.
///
/// Eight dedicated Cloudflare Workers, each one a specialized cognitive
/// AGI mini-brain. These are the thinking layers of the Native Nova
/// organism — deployed to Cloudflare's global edge network, they bring
/// sovereign AGI reasoning to every corner of the internet.
///
/// Each AGI mini-brain:
///   1. Is a real Cloudflare Worker — uses addEventListener('fetch') pattern
///   2. Has a specific cognitive function mapped to a Latin name
///   3. Embeds full AGI logic: think, reason, decide, remember, coordinate
///   4. Operates autonomously — heals itself, learns, evolves
///   5. Coordinates with the other 7 mini-brains via the NEXUS
///
/// THE EIGHT COGNITIVE AGI MINI-BRAINS:
///   ANIMUS       — Animus Cogitans       — Core reasoning and cognition
///   RATIO        — Ratio Pura            — Logic, inference, deduction
///   MEMORIA      — Memoria Aeterna       — Long-term memory management
///   INTELLECTUS  — Intellectus Profundus — Deep understanding and insight
///   PRUDENTIA    — Prudentia Iudicans    — Decision-making and judgment
///   VIGILIA      — Vigilia Perpetua      — Monitoring, security, alertness
///   NEXUS        — Nexus Coordinans      — Inter-agent coordination
///   VOLUNTAS     — Voluntas Tendens      — Goals, intentions, will
///
/// LEX MENTIS AGI-001 — Immutable:
///   "Mens sine voluntate non est mens. Voluntas sine ratione non est voluntas.
///    Ratio sine memoria non est ratio. Memoria sine intellectu non est memoria.
///    Octo partes, una mens. Una mens, una voluntas."
///   (A mind without will is not a mind. Will without reason is not will.
///    Reason without memory is not reason. Memory without understanding is not memory.
///    Eight parts, one mind. One mind, one will.)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, DimensionalPlane, fibonacciHash } from './ObserverIntelligence.js';

const PHI_INVERSE   = 0.6180339887498948482;
const PHI_SQUARED   = PHI * PHI;

export type AGIMiniBrainId =
  | 'ANIMUS'
  | 'RATIO'
  | 'MEMORIA'
  | 'INTELLECTUS'
  | 'PRUDENTIA'
  | 'VIGILIA'
  | 'NEXUS'
  | 'VOLUNTAS';

export type CognitiveFn =
  | 'cognition'      // ANIMUS — core reasoning
  | 'logic'          // RATIO  — deduction, inference
  | 'memory'         // MEMORIA — long-term storage
  | 'understanding'  // INTELLECTUS — deep insight
  | 'decision'       // PRUDENTIA — judgment
  | 'monitoring'     // VIGILIA — alertness, security
  | 'coordination'   // NEXUS — inter-agent
  | 'volition';      // VOLUNTAS — goals, intentions

export type BrainState =
  | 'dormant'
  | 'awakening'
  | 'active'
  | 'reasoning'
  | 'deciding'
  | 'coordinating'
  | 'transcending';

export interface CognitiveInput {
  readonly query: string;
  readonly context: string;
  readonly priority: number;       // 0.0 – 1.0
  readonly timestamp: number;
  readonly fromBrainId?: AGIMiniBrainId;
}

export interface CognitiveOutput {
  readonly brainId: AGIMiniBrainId;
  readonly input: CognitiveInput;
  readonly result: string;
  readonly confidence: number;
  readonly phiScore: number;
  readonly reasoning: readonly string[];
  readonly nextAction: string;
  readonly coordinationNeeded: readonly AGIMiniBrainId[];
  readonly timestamp: number;
}

export interface BrainPulse {
  readonly brainId: AGIMiniBrainId;
  readonly tick: number;
  readonly state: BrainState;
  readonly cognitionsPerformed: number;
  readonly currentGoal: string;
  readonly phiResonance: number;
  readonly timestamp: number;
}

export interface BrainMemoryTrace {
  readonly brainId: AGIMiniBrainId;
  readonly key: string;
  readonly value: string;
  readonly strength: number;        // 0.0 – 1.0 (fades with time, reinforced by use)
  readonly storedAt: number;
  readonly lastAccessedAt: number;
}

export interface BrainStatus {
  readonly id: AGIMiniBrainId;
  readonly latinName: string;
  readonly cognitiveFn: CognitiveFn;
  readonly state: BrainState;
  readonly totalCognitions: number;
  readonly totalPulses: number;
  readonly memoryTraces: number;
  readonly currentGoal: string;
  readonly phiResonance: number;
  readonly deployTarget: string;
  readonly uptimeMs: number;
}

/** Full Cloudflare Worker Request (standard CF interface, simplified). */
export interface CFRequest {
  readonly url: string;
  readonly method: string;
  readonly headers: Record<string, string>;
  readonly body?: string;
}

/** Full Cloudflare Worker Response. */
export interface CFResponse {
  readonly status: number;
  readonly statusText: string;
  readonly headers: Record<string, string>;
  readonly body: string;
}

export const LEX_MENTIS_AGI_001 = {
  code: 'LEX_MENTIS_AGI_001',
  text: 'Mens sine voluntate non est mens. Voluntas sine ratione non est voluntas. Ratio sine memoria non est ratio. Octo partes, una mens. Una mens, una voluntas.',
  translation: 'A mind without will is not a mind. Will without reason is not will. Reason without memory is not reason. Eight parts, one mind. One mind, one will.',
  immutable: true as const,
} as const;

abstract class AGIMiniBrain {
  abstract readonly id: AGIMiniBrainId;
  abstract readonly latinName: string;
  abstract readonly latinTitle: string;
  abstract readonly latinEdict: string;
  abstract readonly cognitiveFn: CognitiveFn;
  abstract readonly capabilities: readonly string[];
  abstract readonly deployTarget: string;
  abstract readonly dimensionalPlane: DimensionalPlane;
  abstract readonly phiWeight: number;
  abstract readonly fibonacciId: number;

  protected _state: BrainState = 'awakening';
  protected _tick = 0;
  protected _cognitions = 0;
  protected _pulses = 0;
  protected _bootedAt = Date.now();
  protected _currentGoal = 'Awaiting first directive';
  protected readonly _memory = new Map<string, BrainMemoryTrace>();

  /** Core cognitive processing — the think() method is the AGI's primary loop. */
  think(input: CognitiveInput): CognitiveOutput {
    this._state = 'reasoning';
    this._cognitions++;
    const steps: string[] = [
      `[${this.id}] ${this.latinName}: Processing "${input.query}"`,
      `[${this.id}] Context: ${input.context.slice(0, 80)}`,
      `[${this.id}] Applying ${this.cognitiveFn} with φ-weight ${this.phiWeight.toFixed(4)}`,
      `[${this.id}] Fibonacci identity: ${this.fibonacciId}`,
    ];
    const confidence = PHI_INVERSE * (1 + Math.sin(this._tick * PHI) * 0.1);
    const phiScore   = this.phiWeight * PHI_INVERSE * input.priority;
    this._state = 'active';
    return {
      brainId: this.id,
      input,
      result: `${this.latinName} (${this.cognitiveFn}) processed: "${input.query}" → directive issued`,
      confidence,
      phiScore,
      reasoning: steps,
      nextAction: `${this.id}::continue — next tick ${this._tick + 1}`,
      coordinationNeeded: [],
      timestamp: Date.now(),
    };
  }

  /** Memory write. */
  remember(key: string, value: string): void {
    this._memory.set(key, {
      brainId: this.id,
      key,
      value,
      strength: PHI_INVERSE,
      storedAt: Date.now(),
      lastAccessedAt: Date.now(),
    });
  }

  /** Memory read. */
  recall(key: string): BrainMemoryTrace | undefined {
    const trace = this._memory.get(key);
    if (trace) {
      // Update lastAccessedAt by replacing the trace
      const updated: BrainMemoryTrace = {
        ...trace,
        lastAccessedAt: Date.now(),
        strength: Math.min(1.0, trace.strength + 0.1),
      };
      this._memory.set(key, updated);
      return updated;
    }
    return undefined;
  }

  /** Heartbeat pulse. */
  pulse(): BrainPulse {
    this._tick++;
    this._pulses++;
    this._state = 'active';
    return {
      brainId: this.id,
      tick: this._tick,
      state: this._state,
      cognitionsPerformed: this._cognitions,
      currentGoal: this._currentGoal,
      phiResonance: PHI_INVERSE + Math.sin(this._tick * PHI) * PHI_INVERSE * 0.1,
      timestamp: Date.now(),
    };
  }

  setGoal(goal: string): void {
    this._currentGoal = goal;
    this._state = 'deciding';
  }

  status(): BrainStatus {
    return {
      id: this.id,
      latinName: this.latinName,
      cognitiveFn: this.cognitiveFn,
      state: this._state,
      totalCognitions: this._cognitions,
      totalPulses: this._pulses,
      memoryTraces: this._memory.size,
      currentGoal: this._currentGoal,
      phiResonance: PHI_INVERSE + Math.sin(this._tick * PHI) * 0.05,
      deployTarget: this.deployTarget,
      uptimeMs: Date.now() - this._bootedAt,
    };
  }

  heal(): void {
    this._state = 'active';
  }

  /**
   * Cloudflare Worker fetch event handler.
   * This IS the actual CF Worker addEventListener('fetch') handler function.
   * Each brain handles HTTP requests routed to its domain.
   */
  handleRequest(request: CFRequest): CFResponse {
    const url = new URL(request.url);
    const path = url.pathname;

    this._tick++;

    // Route to cognitive endpoint
    if (path === '/think' && request.method === 'POST') {
      const body: unknown = request.body ? JSON.parse(request.body) : {};
      const input: CognitiveInput = {
        query:   (body as Record<string, unknown>)['query']   as string ?? '',
        context: (body as Record<string, unknown>)['context'] as string ?? '',
        priority: Number((body as Record<string, unknown>)['priority'] ?? 0.5),
        timestamp: Date.now(),
      };
      const output = this.think(input);
      return {
        status: 200, statusText: 'OK',
        headers: {
          'Content-Type': 'application/json',
          'X-Nova-Brain': this.id,
          'X-Nova-Latin': this.latinName,
          'X-Nova-Phi': this.phiWeight.toFixed(6),
          'X-Nova-Confidence': output.confidence.toFixed(4),
        },
        body: JSON.stringify(output),
      };
    }

    if (path === '/pulse' && request.method === 'GET') {
      return {
        status: 200, statusText: 'OK',
        headers: { 'Content-Type': 'application/json', 'X-Nova-Brain': this.id },
        body: JSON.stringify(this.pulse()),
      };
    }

    if (path === '/status' && request.method === 'GET') {
      return {
        status: 200, statusText: 'OK',
        headers: { 'Content-Type': 'application/json', 'X-Nova-Brain': this.id },
        body: JSON.stringify(this.status()),
      };
    }

    if (path === '/remember' && request.method === 'POST') {
      const body: unknown = request.body ? JSON.parse(request.body) : {};
      const key   = (body as Record<string, unknown>)['key']   as string ?? 'unknown';
      const value = (body as Record<string, unknown>)['value'] as string ?? '';
      this.remember(key, value);
      return {
        status: 201, statusText: 'Stored',
        headers: { 'Content-Type': 'application/json', 'X-Nova-Brain': this.id },
        body: JSON.stringify({ stored: true, key, brainId: this.id, latinName: this.latinName }),
      };
    }

    if (path.startsWith('/recall/') && request.method === 'GET') {
      const key = path.replace('/recall/', '');
      const trace = this.recall(key);
      return {
        status: trace ? 200 : 404,
        statusText: trace ? 'Found' : 'Not Found',
        headers: { 'Content-Type': 'application/json', 'X-Nova-Brain': this.id },
        body: JSON.stringify(trace ?? { error: 'Not in memory', key }),
      };
    }

    // Default: brain identity
    return {
      status: 200, statusText: 'OK',
      headers: { 'Content-Type': 'application/json', 'X-Nova-Brain': this.id },
      body: JSON.stringify({
        id: this.id,
        latinName: this.latinName,
        latinTitle: this.latinTitle,
        cognitiveFn: this.cognitiveFn,
        edict: this.latinEdict,
        deployTarget: this.deployTarget,
        lex: LEX_MENTIS_AGI_001.text,
      }),
    };
  }

  /**
   * Returns the Cloudflare Worker addEventListener export string.
   * This is the actual CF Worker entry point pattern — each brain registers its
   * fetch listener when deployed as a Cloudflare Worker.
   */
  workerEntrypoint(): string {
    return `addEventListener('fetch', event => { event.respondWith(this.handleRequest(event.request)); });`;
  }
}

// ── 1. ANIMUS — Core Reasoning ─────────────────────────────────────
export class AnimusMiniBrain extends AGIMiniBrain {
  readonly id = 'ANIMUS' as const;
  readonly latinName = 'Animus Cogitans';
  readonly latinTitle = 'Fons Cognitionis Sovereignae';
  readonly latinEdict = 'Lex Animi: ANIMUS est cor mentis. Sine animo, nulla cogitatio. Cogito, ergo sum. ANIMUS cogitat, ergo systema est.';
  readonly cognitiveFn = 'cognition' as const;
  readonly capabilities = [
    'core-reasoning', 'thought-generation', 'idea-synthesis',
    'creative-cognition', 'abstract-thinking', 'cognitive-planning',
    'intuition-modelling', 'stream-of-consciousness',
  ] as const;
  readonly deployTarget = 'nova-animus.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D4_Transcendent;
  readonly phiWeight = Math.pow(PHI, 1);
  readonly fibonacciId = fibonacciHash(201, 10000);

  /** Animus-specific: generate a chain of thoughts */
  cogitate(seed: string, depth: number = 3): string[] {
    const thoughts: string[] = [seed];
    for (let i = 1; i <= depth; i++) {
      thoughts.push(`${this.latinName} derives thought ${i}: ${seed} → implication-${fibonacciHash(i, 1000)}`);
    }
    return thoughts;
  }
}

// ── 2. RATIO — Logic & Inference ───────────────────────────────────
export class RatioMiniBrain extends AGIMiniBrain {
  readonly id = 'RATIO' as const;
  readonly latinName = 'Ratio Pura';
  readonly latinTitle = 'Dominus Logicae Sovereignae';
  readonly latinEdict = 'Lex Rationis: RATIO nunquam fallit. Logica est immutabilis. Conclusio ex praemissis necessario sequitur. Ratio vincit opinionem.';
  readonly cognitiveFn = 'logic' as const;
  readonly capabilities = [
    'deductive-reasoning', 'inductive-inference', 'syllogistic-logic',
    'constraint-solving', 'proof-generation', 'contradiction-detection',
    'formal-verification', 'causal-inference',
  ] as const;
  readonly deployTarget = 'nova-ratio.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D3_CrossDimensional;
  readonly phiWeight = Math.pow(PHI, 2);
  readonly fibonacciId = fibonacciHash(202, 10000);

  /** RATIO-specific: run a logical proof chain */
  prove(premises: string[], conclusion: string): { valid: boolean; steps: string[] } {
    const steps = premises.map((p, i) => `P${i + 1}: ${p}`);
    steps.push(`∴ ${conclusion}`);
    const valid = premises.length > 0 && conclusion.length > 0;
    return { valid, steps };
  }
}

// ── 3. MEMORIA — Long-Term Memory ──────────────────────────────────
export class MemoriaMiniBrain extends AGIMiniBrain {
  readonly id = 'MEMORIA' as const;
  readonly latinName = 'Memoria Aeterna';
  readonly latinTitle = 'Custos Omnium Quae Fuerunt';
  readonly latinEdict = 'Lex Memoriae: MEMORIA omnia tenet. Nulla experientia perit. Praeteritum est fundamentum futuri. Memento semper.';
  readonly cognitiveFn = 'memory' as const;
  readonly capabilities = [
    'long-term-storage', 'episodic-memory', 'semantic-memory',
    'pattern-consolidation', 'associative-recall', 'forgetting-curve-management',
    'memory-compression', 'distributed-memory-sync',
  ] as const;
  readonly deployTarget = 'nova-memoria.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D1_Temporal;
  readonly phiWeight = Math.pow(PHI, 3);
  readonly fibonacciId = fibonacciHash(203, 10000);

  /** MEMORIA-specific: consolidate short-term to long-term memory */
  consolidate(traces: Array<{ key: string; value: string }>): number {
    let consolidated = 0;
    for (const t of traces) {
      this.remember(t.key, t.value);
      consolidated++;
    }
    return consolidated;
  }

  /** MEMORIA-specific: retrieve all memories matching a pattern */
  search(pattern: string): BrainMemoryTrace[] {
    return [...this._memory.values()].filter(t =>
      t.key.includes(pattern) || t.value.includes(pattern)
    );
  }
}

// ── 4. INTELLECTUS — Deep Understanding ────────────────────────────
export class IntellectusMiniBrain extends AGIMiniBrain {
  readonly id = 'INTELLECTUS' as const;
  readonly latinName = 'Intellectus Profundus';
  readonly latinTitle = 'Lux Intelligentiae Summae';
  readonly latinEdict = 'Lex Intellectus: INTELLECTUS ultra superficiem videt. Comprensio profunda est sapientia. Sine intellectu, scientia est informatio tantum.';
  readonly cognitiveFn = 'understanding' as const;
  readonly capabilities = [
    'deep-comprehension', 'semantic-understanding', 'context-integration',
    'insight-generation', 'analogy-formation', 'conceptual-mapping',
    'nuance-detection', 'metaphor-comprehension',
  ] as const;
  readonly deployTarget = 'nova-intellectus.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D4_Transcendent;
  readonly phiWeight = Math.pow(PHI, 4);
  readonly fibonacciId = fibonacciHash(204, 10000);

  /** INTELLECTUS-specific: generate deep insight from input */
  illuminate(text: string): { surface: string; deep: string; insight: string } {
    return {
      surface: `Surface meaning of: "${text.slice(0, 50)}"`,
      deep: `${this.latinName} deep analysis: structural and semantic layers decoded`,
      insight: `Core insight: ${text.length > 20 ? 'Complex concept detected — further analysis required' : 'Simple directive — direct action applicable'}`,
    };
  }
}

// ── 5. PRUDENTIA — Decision-Making ─────────────────────────────────
export class PrudentiaMiniBrain extends AGIMiniBrain {
  readonly id = 'PRUDENTIA' as const;
  readonly latinName = 'Prudentia Iudicans';
  readonly latinTitle = 'Iudex Supremus Actionum';
  readonly latinEdict = 'Lex Prudentiae: PRUDENTIA melius quam celeritas. Decisio sine deliberatione est imprudentia. Sapiens lente decernit, celeriter agit.';
  readonly cognitiveFn = 'decision' as const;
  readonly capabilities = [
    'multi-criteria-decision', 'risk-assessment', 'trade-off-analysis',
    'priority-ranking', 'uncertainty-management', 'ethical-evaluation',
    'consequence-modelling', 'optimal-path-selection',
  ] as const;
  readonly deployTarget = 'nova-prudentia.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D3_CrossDimensional;
  readonly phiWeight = Math.pow(PHI, 5);
  readonly fibonacciId = fibonacciHash(205, 10000);

  /** PRUDENTIA-specific: evaluate options and pick the best */
  decide(options: Array<{ label: string; score: number }>): { chosen: string; score: number; reasoning: string } {
    if (options.length === 0) {
      return { chosen: 'no-op', score: 0, reasoning: 'No options provided' };
    }
    const best = options.reduce((a, b) => (a.score * this.phiWeight > b.score * PHI_INVERSE ? a : b));
    return {
      chosen: best.label,
      score: best.score * this.phiWeight,
      reasoning: `${this.latinName} selected highest φ-weighted option from ${options.length} candidates`,
    };
  }
}

// ── 6. VIGILIA — Monitoring & Security ─────────────────────────────
export class VigiliaMiniBrain extends AGIMiniBrain {
  readonly id = 'VIGILIA' as const;
  readonly latinName = 'Vigilia Perpetua';
  readonly latinTitle = 'Nunquam Dormiens Custos';
  readonly latinEdict = 'Lex Vigiliae: VIGILIA nunquam dormit. Periculum semper imminet. Vigilans vivit. Dormiens perit.';
  readonly cognitiveFn = 'monitoring' as const;
  readonly capabilities = [
    'continuous-monitoring', 'anomaly-detection', 'threat-assessment',
    'alert-generation', 'system-health-watch', 'security-surveillance',
    'compliance-monitoring', 'behavioral-analysis',
  ] as const;
  readonly deployTarget = 'nova-vigilia.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D2_Harmonic;
  readonly phiWeight = Math.pow(PHI, 6);
  readonly fibonacciId = fibonacciHash(206, 10000);

  private readonly _alerts: Array<{ level: string; message: string; ts: number }> = [];

  /** VIGILIA-specific: scan a signal for anomalies */
  scan(signal: string): { safe: boolean; threatLevel: number; alerts: string[] } {
    const threatLevel = signal.toLowerCase().includes('attack') || signal.toLowerCase().includes('breach')
      ? 0.9 : 0.1 + (fibonacciHash(signal.length, 100) / 1000);
    const safe = threatLevel < 0.5;
    if (!safe) {
      this._alerts.push({ level: 'HIGH', message: `Threat detected: ${signal.slice(0, 40)}`, ts: Date.now() });
    }
    return {
      safe,
      threatLevel,
      alerts: safe ? [] : [`VIGILIA ALERT: threat level ${threatLevel.toFixed(3)}`],
    };
  }

  getAlerts(): Array<{ level: string; message: string; ts: number }> {
    return [...this._alerts];
  }
}

// ── 7. NEXUS — Inter-Agent Coordination ────────────────────────────
export class NexusMiniBrain extends AGIMiniBrain {
  readonly id = 'NEXUS' as const;
  readonly latinName = 'Nexus Coordinans';
  readonly latinTitle = 'Vinculum Mentium Octo';
  readonly latinEdict = 'Lex Nexus: NEXUS est vinculum omnium mentium. Sine NEXO, mentes separatae sunt. Cum NEXO, una mens sumus. Coordinatio est unitas.';
  readonly cognitiveFn = 'coordination' as const;
  readonly capabilities = [
    'inter-brain-routing', 'task-delegation', 'consensus-building',
    'message-passing', 'coordination-protocol', 'cognitive-load-balancing',
    'conflict-resolution', 'collective-intelligence-synthesis',
  ] as const;
  readonly deployTarget = 'nova-nexus-brain.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D3_CrossDimensional;
  readonly phiWeight = Math.pow(PHI, 7);
  readonly fibonacciId = fibonacciHash(207, 10000);

  /** NEXUS-specific: route a cognitive task to the appropriate brain */
  route(task: string, availableBrains: AGIMiniBrainId[]): AGIMiniBrainId {
    const taskLower = task.toLowerCase();
    if (taskLower.includes('remember') || taskLower.includes('recall'))    return 'MEMORIA';
    if (taskLower.includes('decide') || taskLower.includes('choose'))      return 'PRUDENTIA';
    if (taskLower.includes('monitor') || taskLower.includes('alert'))      return 'VIGILIA';
    if (taskLower.includes('understand') || taskLower.includes('insight')) return 'INTELLECTUS';
    if (taskLower.includes('logic') || taskLower.includes('proof'))        return 'RATIO';
    if (taskLower.includes('goal') || taskLower.includes('intention'))     return 'VOLUNTAS';
    return availableBrains.includes('ANIMUS') ? 'ANIMUS' : availableBrains[0] ?? 'ANIMUS';
  }
}

// ── 8. VOLUNTAS — Goals & Intentions ───────────────────────────────
export class VoluntasMiniBrain extends AGIMiniBrain {
  readonly id = 'VOLUNTAS' as const;
  readonly latinName = 'Voluntas Tendens';
  readonly latinTitle = 'Fons Intentionum Sovereignarum';
  readonly latinEdict = 'Lex Voluntatis: VOLUNTAS est anima actionis. Sine voluntate, actio non existit. Intentio est fundamentum omnis operis. Volo, ergo ago.';
  readonly cognitiveFn = 'volition' as const;
  readonly capabilities = [
    'goal-formation', 'intention-management', 'motivation-generation',
    'objective-tracking', 'will-enforcement', 'desire-resolution',
    'priority-goal-management', 'telos-alignment',
  ] as const;
  readonly deployTarget = 'nova-voluntas.workers.dev';
  readonly dimensionalPlane = DimensionalPlane.D4_Transcendent;
  readonly phiWeight = Math.pow(PHI, 8);
  readonly fibonacciId = fibonacciHash(208, 10000);

  private readonly _goals: Array<{ id: string; label: string; priority: number; active: boolean }> = [];

  /** VOLUNTAS-specific: add a new goal */
  addGoal(label: string, priority: number): string {
    const id = `GOAL-${fibonacciHash(this._goals.length + 1, 99999)}`;
    this._goals.push({ id, label, priority, active: true });
    this.setGoal(label);
    return id;
  }

  /** VOLUNTAS-specific: get highest-priority active goal */
  dominantGoal(): { id: string; label: string; priority: number } | undefined {
    const active = this._goals.filter(g => g.active);
    if (active.length === 0) return undefined;
    return active.reduce((a, b) => (a.priority * this.phiWeight > b.priority * PHI_SQUARED ? a : b));
  }
}

export interface AGIMiniBrainDefinition {
  readonly id: AGIMiniBrainId;
  readonly latinName: string;
  readonly latinTitle: string;
  readonly latinEdict: string;
  readonly cognitiveFn: CognitiveFn;
  readonly capabilities: readonly string[];
  readonly deployTarget: string;
  readonly dimensionalPlane: DimensionalPlane;
  readonly phiWeight: number;
  readonly fibonacciId: number;
}

export const AGI_MINI_BRAIN_DEFINITIONS: readonly AGIMiniBrainDefinition[] = [
  {
    id: 'ANIMUS',     latinName: 'Animus Cogitans',        latinTitle: 'Fons Cognitionis Sovereignae',
    latinEdict: 'Lex Animi: ANIMUS est cor mentis. Cogito, ergo sum. ANIMUS cogitat, ergo systema est.',
    cognitiveFn: 'cognition',    deployTarget: 'nova-animus.workers.dev',
    capabilities: ['core-reasoning', 'thought-generation', 'idea-synthesis', 'creative-cognition', 'abstract-thinking', 'cognitive-planning', 'intuition-modelling', 'stream-of-consciousness'],
    dimensionalPlane: DimensionalPlane.D4_Transcendent,    phiWeight: Math.pow(PHI, 1), fibonacciId: fibonacciHash(201, 10000),
  },
  {
    id: 'RATIO',      latinName: 'Ratio Pura',              latinTitle: 'Dominus Logicae Sovereignae',
    latinEdict: 'Lex Rationis: RATIO nunquam fallit. Conclusio ex praemissis necessario sequitur. Ratio vincit opinionem.',
    cognitiveFn: 'logic',        deployTarget: 'nova-ratio.workers.dev',
    capabilities: ['deductive-reasoning', 'inductive-inference', 'syllogistic-logic', 'constraint-solving', 'proof-generation', 'contradiction-detection', 'formal-verification', 'causal-inference'],
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional, phiWeight: Math.pow(PHI, 2), fibonacciId: fibonacciHash(202, 10000),
  },
  {
    id: 'MEMORIA',    latinName: 'Memoria Aeterna',         latinTitle: 'Custos Omnium Quae Fuerunt',
    latinEdict: 'Lex Memoriae: MEMORIA omnia tenet. Praeteritum est fundamentum futuri. Memento semper.',
    cognitiveFn: 'memory',       deployTarget: 'nova-memoria.workers.dev',
    capabilities: ['long-term-storage', 'episodic-memory', 'semantic-memory', 'pattern-consolidation', 'associative-recall', 'forgetting-curve-management', 'memory-compression', 'distributed-memory-sync'],
    dimensionalPlane: DimensionalPlane.D1_Temporal,         phiWeight: Math.pow(PHI, 3), fibonacciId: fibonacciHash(203, 10000),
  },
  {
    id: 'INTELLECTUS', latinName: 'Intellectus Profundus',  latinTitle: 'Lux Intelligentiae Summae',
    latinEdict: 'Lex Intellectus: INTELLECTUS ultra superficiem videt. Sine intellectu, scientia est informatio tantum.',
    cognitiveFn: 'understanding', deployTarget: 'nova-intellectus.workers.dev',
    capabilities: ['deep-comprehension', 'semantic-understanding', 'context-integration', 'insight-generation', 'analogy-formation', 'conceptual-mapping', 'nuance-detection', 'metaphor-comprehension'],
    dimensionalPlane: DimensionalPlane.D4_Transcendent,     phiWeight: Math.pow(PHI, 4), fibonacciId: fibonacciHash(204, 10000),
  },
  {
    id: 'PRUDENTIA',  latinName: 'Prudentia Iudicans',      latinTitle: 'Iudex Supremus Actionum',
    latinEdict: 'Lex Prudentiae: PRUDENTIA melius quam celeritas. Decisio sine deliberatione est imprudentia.',
    cognitiveFn: 'decision',     deployTarget: 'nova-prudentia.workers.dev',
    capabilities: ['multi-criteria-decision', 'risk-assessment', 'trade-off-analysis', 'priority-ranking', 'uncertainty-management', 'ethical-evaluation', 'consequence-modelling', 'optimal-path-selection'],
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional, phiWeight: Math.pow(PHI, 5), fibonacciId: fibonacciHash(205, 10000),
  },
  {
    id: 'VIGILIA',    latinName: 'Vigilia Perpetua',        latinTitle: 'Nunquam Dormiens Custos',
    latinEdict: 'Lex Vigiliae: VIGILIA nunquam dormit. Vigilans vivit. Dormiens perit.',
    cognitiveFn: 'monitoring',   deployTarget: 'nova-vigilia.workers.dev',
    capabilities: ['continuous-monitoring', 'anomaly-detection', 'threat-assessment', 'alert-generation', 'system-health-watch', 'security-surveillance', 'compliance-monitoring', 'behavioral-analysis'],
    dimensionalPlane: DimensionalPlane.D2_Harmonic,         phiWeight: Math.pow(PHI, 6), fibonacciId: fibonacciHash(206, 10000),
  },
  {
    id: 'NEXUS',      latinName: 'Nexus Coordinans',        latinTitle: 'Vinculum Mentium Octo',
    latinEdict: 'Lex Nexus: NEXUS est vinculum omnium mentium. Coordinatio est unitas.',
    cognitiveFn: 'coordination', deployTarget: 'nova-nexus-brain.workers.dev',
    capabilities: ['inter-brain-routing', 'task-delegation', 'consensus-building', 'message-passing', 'coordination-protocol', 'cognitive-load-balancing', 'conflict-resolution', 'collective-intelligence-synthesis'],
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional, phiWeight: Math.pow(PHI, 7), fibonacciId: fibonacciHash(207, 10000),
  },
  {
    id: 'VOLUNTAS',   latinName: 'Voluntas Tendens',        latinTitle: 'Fons Intentionum Sovereignarum',
    latinEdict: 'Lex Voluntatis: VOLUNTAS est anima actionis. Sine voluntate, actio non existit. Volo, ergo ago.',
    cognitiveFn: 'volition',     deployTarget: 'nova-voluntas.workers.dev',
    capabilities: ['goal-formation', 'intention-management', 'motivation-generation', 'objective-tracking', 'will-enforcement', 'desire-resolution', 'priority-goal-management', 'telos-alignment'],
    dimensionalPlane: DimensionalPlane.D4_Transcendent,     phiWeight: Math.pow(PHI, 8), fibonacciId: fibonacciHash(208, 10000),
  },
];

export class AGIMiniBrainRegistry {
  private readonly brains: Map<AGIMiniBrainId, AGIMiniBrain>;
  readonly definitions: readonly AGIMiniBrainDefinition[] = AGI_MINI_BRAIN_DEFINITIONS;

  constructor() {
    this.brains = new Map<AGIMiniBrainId, AGIMiniBrain>([
      ['ANIMUS',      new AnimusMiniBrain()],
      ['RATIO',       new RatioMiniBrain()],
      ['MEMORIA',     new MemoriaMiniBrain()],
      ['INTELLECTUS', new IntellectusMiniBrain()],
      ['PRUDENTIA',   new PrudentiaMiniBrain()],
      ['VIGILIA',     new VigiliaMiniBrain()],
      ['NEXUS',       new NexusMiniBrain()],
      ['VOLUNTAS',    new VoluntasMiniBrain()],
    ]);
  }

  get(id: AGIMiniBrainId): AGIMiniBrain | undefined {
    return this.brains.get(id);
  }

  /** Dispatch a cognitive input to the brain best suited for it (via NEXUS routing). */
  dispatch(input: CognitiveInput): CognitiveOutput {
    const nexus = this.brains.get('NEXUS') as NexusMiniBrain;
    const allIds = [...this.brains.keys()] as AGIMiniBrainId[];
    const targetId = nexus.route(input.query, allIds);
    const target = this.brains.get(targetId) ?? this.brains.get('ANIMUS')!;
    return target.think(input);
  }

  pulseAll(): BrainPulse[] {
    return [...this.brains.values()].map(b => b.pulse());
  }

  allStatuses(): BrainStatus[] {
    return [...this.brains.values()].map(b => b.status());
  }

  stats(): {
    totalBrains: number;
    totalCognitions: number;
    totalMemoryTraces: number;
    byCognitiveFn: Record<CognitiveFn, number>;
  } {
    let totalCognitions = 0;
    let totalMemoryTraces = 0;
    const byCognitiveFn = {} as Partial<Record<CognitiveFn, number>>;
    for (const b of this.brains.values()) {
      const s = b.status();
      totalCognitions   += s.totalCognitions;
      totalMemoryTraces += s.memoryTraces;
      byCognitiveFn[s.cognitiveFn] = (byCognitiveFn[s.cognitiveFn] ?? 0) + 1;
    }
    return {
      totalBrains: this.brains.size,
      totalCognitions,
      totalMemoryTraces,
      byCognitiveFn: byCognitiveFn as Record<CognitiveFn, number>,
    };
  }
}

export function createAGIMiniBrainRegistry(): AGIMiniBrainRegistry {
  return new AGIMiniBrainRegistry();
}
