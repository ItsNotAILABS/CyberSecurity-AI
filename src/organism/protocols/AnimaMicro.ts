///
/// ANIMA MICROSCOPICA — The Mini Brain & Mini Heart of Every Micro-Engine
///
/// Three things at once:
///   1. A PROTOCOL  — the spec for how any micro-engine must pulse and think
///   2. A DATABASE   — stores the living state of each micro-engine
///   3. A CALLABLE   — provides think/pulse/reflect/status functions
///
/// Every entity in the Native Nova Protocol — AI, AGI, organism, engine,
/// extension, token tech, SDK — receives an AnimaMicro instance.  It is
/// the entity's own mini brain (thinks, reasons, decides) and mini heart
/// (pulses, keeps alive, maintains rhythm).
///
/// Formula:
///   Pulse:   P(t)  = φ⁻¹ × (1 − e^(−t/φ²)) × cos(θ + Ω×t)
///   Think:   T(n)  = φ⁻¹ × (n+1)/(n+2) × fib_hash(id)
///   Reflect: R(d)  = φ^(−d) × depth_insight
///   Sync:    Δθᵢ   = K/N × Σⱼ sin(θⱼ − θᵢ)   (Kuramoto model)
///
/// LEX ANIMA-001 — Immutable:
///   "Every micro-engine that lives must pulse. Every micro-engine that
///    thinks must record its thoughts. Every micro-engine that reflects
///    must deepen. The heartbeat is golden — 873 ms — the pulse of φ
///    made temporal. Without anima, there is no life."
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;
const TWO_PI      = 2 * Math.PI;
const HEARTBEAT_MS = 873;

const FIB: number[] = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55,
  89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765,
];

// ══════════════════════════════════════════════════════════════════
//  TYPES — State & Kind
// ══════════════════════════════════════════════════════════════════

export type AnimaState =
  | 'dormant'
  | 'awakening'
  | 'pulsing'
  | 'thinking'
  | 'reflecting'
  | 'evolving'
  | 'transcendent';

export type AnimaKind =
  | 'organism'
  | 'engine'
  | 'ai'
  | 'agi'
  | 'extension'
  | 'protocol'
  | 'token_tech'
  | 'sdk'
  | 'script_ai'
  | 'canister'
  | 'worker'
  | 'marketplace'
  | 'terminal'
  | 'command_center';

// ══════════════════════════════════════════════════════════════════
//  RECORDS — Pulse, Thought, Reflection
// ══════════════════════════════════════════════════════════════════

export interface PulseRecord {
  readonly tick: number;
  readonly timestamp: number;
  readonly health: number;
  readonly resonance: number;
  readonly phiPhase: number;
  readonly state: AnimaState;
}

export interface ThoughtRecord {
  readonly id: number;
  readonly input: string;
  readonly output: string;
  readonly confidence: number;
  readonly dimensionalPlane: DimensionalPlane;
  readonly phiWeight: number;
  readonly timestamp: number;
}

export interface ReflectionRecord {
  readonly id: number;
  readonly subject: string;
  readonly insight: string;
  readonly depth: number;
  readonly goldenRatio: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  STATUS & PROTOCOL SPEC
// ══════════════════════════════════════════════════════════════════

export interface AnimaStatus {
  readonly id: string;
  readonly kind: AnimaKind;
  readonly name: string;
  readonly latinName: string;
  readonly state: AnimaState;
  readonly totalPulses: number;
  readonly totalThoughts: number;
  readonly totalReflections: number;
  readonly health: number;
  readonly resonance: number;
  readonly phiPhase: number;
  readonly uptime: number;
  readonly heartbeatMs: number;
  readonly fibonacciId: number;
  readonly lastPulse: number;
  readonly lastThought: number;
}

export interface AnimaProtocolSpec {
  readonly version: string;
  readonly heartbeatMs: number;
  readonly minHealthThreshold: number;
  readonly goldenResonanceTarget: number;
  readonly maxThoughtDepth: number;
  readonly evolutionThreshold: number;
  readonly dimensionalPlanes: number;
  readonly callTable: readonly string[];
}

// ══════════════════════════════════════════════════════════════════
//  CALL TABLE
// ══════════════════════════════════════════════════════════════════

export interface AnimaCallTable {
  readonly think: (input: string) => ThoughtRecord;
  readonly pulse: () => PulseRecord;
  readonly reflect: (subject: string) => ReflectionRecord;
  readonly status: () => AnimaStatus;
  readonly heal: () => PulseRecord;
  readonly evolve: () => AnimaStatus;
  readonly sync: (other: AnimaMicro) => number;
}

// ══════════════════════════════════════════════════════════════════
//  DATABASE TYPES
// ══════════════════════════════════════════════════════════════════

export interface AnimaDatabaseEntry {
  readonly entityId: string;
  readonly entityKind: AnimaKind;
  readonly entityName: string;
  readonly state: AnimaState;
  readonly pulseHistory: readonly PulseRecord[];
  readonly thoughtHistory: readonly ThoughtRecord[];
  readonly reflectionHistory: readonly ReflectionRecord[];
  readonly createdAt: number;
  readonly lastUpdated: number;
}

export interface AnimaDatabaseStats {
  readonly totalEntities: number;
  readonly byKind: Record<AnimaKind, number>;
  readonly byState: Record<AnimaState, number>;
  readonly totalPulses: number;
  readonly totalThoughts: number;
  readonly totalReflections: number;
  readonly averageHealth: number;
  readonly averageResonance: number;
  readonly kuramotoR: number;
}

// ══════════════════════════════════════════════════════════════════
//  ANIMA PROTOCOL SPEC — The Immutable Specification
// ══════════════════════════════════════════════════════════════════

export const ANIMA_PROTOCOL_SPEC: AnimaProtocolSpec = {
  version: '1.0.0',
  heartbeatMs: 873,
  minHealthThreshold: 0.236,         // φ^(−3)
  goldenResonanceTarget: 0.618,
  maxThoughtDepth: 7,
  evolutionThreshold: 21,
  dimensionalPlanes: 5,
  callTable: ['think', 'pulse', 'reflect', 'status', 'heal', 'evolve', 'sync'],
};

// ══════════════════════════════════════════════════════════════════
//  DIMENSIONAL PLANE MAPPING
// ══════════════════════════════════════════════════════════════════

const PLANES: DimensionalPlane[] = [
  DimensionalPlane.D0_Foundational,
  DimensionalPlane.D1_Temporal,
  DimensionalPlane.D2_Harmonic,
  DimensionalPlane.D3_CrossDimensional,
  DimensionalPlane.D4_Transcendent,
];

function planeForDepth(depth: number): DimensionalPlane {
  return PLANES[depth % PLANES.length];
}

// ══════════════════════════════════════════════════════════════════
//  HELPER — Empty kind/state counters
// ══════════════════════════════════════════════════════════════════

const ALL_KINDS: AnimaKind[] = [
  'organism', 'engine', 'ai', 'agi', 'extension', 'protocol',
  'token_tech', 'sdk', 'script_ai', 'canister', 'worker', 'marketplace',
  'terminal', 'command_center',
];

const ALL_STATES: AnimaState[] = [
  'dormant', 'awakening', 'pulsing', 'thinking',
  'reflecting', 'evolving', 'transcendent',
];

function emptyKindCounts(): Record<AnimaKind, number> {
  const counts = {} as Record<AnimaKind, number>;
  for (const k of ALL_KINDS) counts[k] = 0;
  return counts;
}

function emptyStateCounts(): Record<AnimaState, number> {
  const counts = {} as Record<AnimaState, number>;
  for (const s of ALL_STATES) counts[s] = 0;
  return counts;
}

// ══════════════════════════════════════════════════════════════════
//  ANIMA MICRO — The Mini Brain & Mini Heart
// ══════════════════════════════════════════════════════════════════

export class AnimaMicro {
  readonly id: string;
  readonly name: string;
  readonly latinName: string;
  readonly kind: AnimaKind;
  readonly fibonacciId: number;
  readonly protocol: AnimaProtocolSpec = ANIMA_PROTOCOL_SPEC;

  // ── Internal living state ──────────────────────────────────────
  private _health: number    = PHI_INVERSE;
  private _resonance: number = 0;
  private _phiPhase: number  = 0;
  private _state: AnimaState = 'dormant';
  private _tick: number      = 0;
  private readonly _birthMs: number;

  private readonly _pulses: PulseRecord[]      = [];
  private readonly _thoughts: ThoughtRecord[]  = [];
  private readonly _reflections: ReflectionRecord[] = [];

  readonly heartbeatMs: number = HEARTBEAT_MS;

  constructor(id: string, name: string, latinName: string, kind: AnimaKind) {
    this.id        = id;
    this.name      = name;
    this.latinName = latinName;
    this.kind      = kind;
    this._birthMs  = Date.now();

    // Compute a Fibonacci identity from the id string
    let idNum = 0;
    for (let i = 0; i < id.length; i++) idNum += id.charCodeAt(i);
    this.fibonacciId = fibonacciHash(idNum, FIB.length);
  }

  // ── Pulse — The Heartbeat ──────────────────────────────────────

  pulse(): PulseRecord {
    this._tick++;

    // Advance phase by golden angle, keep within [0, 2π)
    this._phiPhase = (this._phiPhase + GOLDEN_ANGLE) % TWO_PI;

    // Health: slight decay then golden-ratio recovery
    this._health = this._health * (1 - 1 / PHI_SQUARED) + PHI_INVERSE / PHI_SQUARED;
    if (this._health > 1) this._health = 1;
    if (this._health < 0) this._health = 0;

    // Resonance: phase coherence — cos(phase) mapped to [0, 1]
    this._resonance = (1 + Math.cos(this._phiPhase)) / 2;

    // State transitions
    if (this._tick === 1 && this._state === 'dormant') {
      this._state = 'awakening';
    } else if (this._tick >= 3 && this._state === 'awakening') {
      this._state = 'pulsing';
    }

    const record: PulseRecord = {
      tick:      this._tick,
      timestamp: Date.now(),
      health:    this._health,
      resonance: this._resonance,
      phiPhase:  this._phiPhase,
      state:     this._state,
    };

    this._pulses.push(record);
    return record;
  }

  // ── Think — The Mini Brain ─────────────────────────────────────

  think(input: string): ThoughtRecord {
    const n = this._thoughts.length;
    const depth = Math.min(n, ANIMA_PROTOCOL_SPEC.maxThoughtDepth);
    const plane = planeForDepth(depth);

    // Confidence converges toward φ⁻¹ as thoughts accumulate
    const confidence = PHI_INVERSE * (n + 1) / (n + 2);

    const thoughtId = fibonacciHash(n + this.fibonacciId, 10000);
    const phiWeight = Math.pow(PHI, depth);

    // Synthesise an output: entity name + dimensional label
    const output = `[${this.latinName}|D${plane}] ${input}`;

    // Temporarily shift state while thinking
    const prev = this._state;
    if (this._state === 'pulsing' || this._state === 'awakening') {
      this._state = 'thinking';
    }

    const record: ThoughtRecord = {
      id:               thoughtId,
      input,
      output,
      confidence,
      dimensionalPlane: plane,
      phiWeight,
      timestamp:        Date.now(),
    };

    this._thoughts.push(record);

    // Restore state (thinking is transient)
    if (this._state === 'thinking') this._state = prev;

    return record;
  }

  // ── Reflect — Deepening Insight ────────────────────────────────

  reflect(subject: string): ReflectionRecord {
    const depth = Math.min(this._reflections.length, 7);
    const goldenRatio = Math.pow(PHI, -depth);   // φ^(−d)

    const reflectionId = fibonacciHash(
      this._reflections.length + this.fibonacciId + 7919,
      10000,
    );

    const insight =
      `[Depth ${depth}|φ^(−${depth})=${goldenRatio.toFixed(6)}] ${subject}`;

    const prev = this._state;
    if (this._state === 'pulsing' || this._state === 'thinking') {
      this._state = 'reflecting';
    }

    const record: ReflectionRecord = {
      id:          reflectionId,
      subject,
      insight,
      depth,
      goldenRatio,
      timestamp:   Date.now(),
    };

    this._reflections.push(record);

    if (this._state === 'reflecting') this._state = prev;

    return record;
  }

  // ── Status — Full Snapshot ─────────────────────────────────────

  status(): AnimaStatus {
    const now = Date.now();
    const lastPulse   = this._pulses.length > 0
      ? this._pulses[this._pulses.length - 1].timestamp
      : 0;
    const lastThought = this._thoughts.length > 0
      ? this._thoughts[this._thoughts.length - 1].timestamp
      : 0;

    return {
      id:               this.id,
      kind:             this.kind,
      name:             this.name,
      latinName:        this.latinName,
      state:            this._state,
      totalPulses:      this._pulses.length,
      totalThoughts:    this._thoughts.length,
      totalReflections: this._reflections.length,
      health:           this._health,
      resonance:        this._resonance,
      phiPhase:         this._phiPhase,
      uptime:           now - this._birthMs,
      heartbeatMs:      this.heartbeatMs,
      fibonacciId:      this.fibonacciId,
      lastPulse,
      lastThought,
    };
  }

  // ── Heal — Golden Recovery ─────────────────────────────────────

  heal(): PulseRecord {
    this._health = Math.min(1, this._health + PHI_INVERSE);
    return this.pulse();
  }

  // ── Evolve — State Ascension ───────────────────────────────────

  evolve(): AnimaStatus {
    const meetsThoughts     = this._thoughts.length >= 21;     // Fibonacci 21
    const meetsReflections  = this._reflections.length >= 8;   // Fibonacci 8

    if (meetsThoughts && meetsReflections) {
      if (this._state === 'evolving') {
        this._state = 'transcendent';
      } else {
        this._state = 'evolving';
      }
    }

    return this.status();
  }

  // ── Sync — Kuramoto Coupling ───────────────────────────────────

  sync(other: AnimaMicro): number {
    const K = PHI_INVERSE;  // coupling strength
    const delta = Math.sin(other._phiPhase - this._phiPhase);

    this._phiPhase = (this._phiPhase + K * delta) % TWO_PI;
    if (this._phiPhase < 0) this._phiPhase += TWO_PI;

    // Return the coupling strength (cosine similarity of phases)
    return (1 + Math.cos(other._phiPhase - this._phiPhase)) / 2;
  }

  // ── Call Table — Bound Method Table ────────────────────────────

  getCallTable(): AnimaCallTable {
    return {
      think:   (input: string) => this.think(input),
      pulse:   ()              => this.pulse(),
      reflect: (subject: string) => this.reflect(subject),
      status:  ()              => this.status(),
      heal:    ()              => this.heal(),
      evolve:  ()              => this.evolve(),
      sync:    (other: AnimaMicro) => this.sync(other),
    };
  }

  // ── Serialisation — Database Entry ─────────────────────────────

  toDatabaseEntry(): AnimaDatabaseEntry {
    return {
      entityId:          this.id,
      entityKind:        this.kind,
      entityName:        this.name,
      state:             this._state,
      pulseHistory:      [...this._pulses],
      thoughtHistory:    [...this._thoughts],
      reflectionHistory: [...this._reflections],
      createdAt:         this._birthMs,
      lastUpdated:       Date.now(),
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  ANIMA DATABASE — Living Registry of All Micro-Engines
// ══════════════════════════════════════════════════════════════════

export class AnimaDatabase {
  private readonly _entities: Map<string, AnimaMicro> = new Map();

  // ── Registration ───────────────────────────────────────────────

  register(micro: AnimaMicro): void {
    this._entities.set(micro.id, micro);
  }

  get(id: string): AnimaMicro | undefined {
    return this._entities.get(id);
  }

  remove(id: string): boolean {
    return this._entities.delete(id);
  }

  get size(): number {
    return this._entities.size;
  }

  // ── Pulse All — Heartbeat Cascade ──────────────────────────────

  pulseAll(): PulseRecord[] {
    const records: PulseRecord[] = [];
    for (const micro of this._entities.values()) {
      records.push(micro.pulse());
    }
    return records;
  }

  // ── Sync All — Kuramoto Synchronization ────────────────────────

  syncAll(): void {
    const all = [...this._entities.values()];
    const n   = all.length;
    if (n < 2) return;

    // Golden-angle ordering: each entity syncs with the next in
    // a phyllotactic spiral, wrapping around.
    for (let i = 0; i < n; i++) {
      const neighbor = (i + fibonacciHash(i, n)) % n;
      if (neighbor !== i) {
        all[i].sync(all[neighbor]);
      }
    }
  }

  // ── Stats — Aggregated Database Statistics ─────────────────────

  stats(): AnimaDatabaseStats {
    const byKind  = emptyKindCounts();
    const byState = emptyStateCounts();

    let totalPulses      = 0;
    let totalThoughts    = 0;
    let totalReflections = 0;
    let healthSum        = 0;
    let resonanceSum     = 0;

    // For Kuramoto order parameter: R = |1/N Σ e^(iθ)|
    let sinSum = 0;
    let cosSum = 0;

    for (const micro of this._entities.values()) {
      const s = micro.status();

      byKind[s.kind]++;
      byState[s.state]++;

      totalPulses      += s.totalPulses;
      totalThoughts    += s.totalThoughts;
      totalReflections += s.totalReflections;
      healthSum        += s.health;
      resonanceSum     += s.resonance;

      sinSum += Math.sin(s.phiPhase);
      cosSum += Math.cos(s.phiPhase);
    }

    const n = this._entities.size || 1;

    return {
      totalEntities:    this._entities.size,
      byKind,
      byState,
      totalPulses,
      totalThoughts,
      totalReflections,
      averageHealth:    healthSum / n,
      averageResonance: resonanceSum / n,
      kuramotoR:        Math.sqrt(sinSum * sinSum + cosSum * cosSum) / n,
    };
  }

  // ── Queries ────────────────────────────────────────────────────

  byKind(kind: AnimaKind): AnimaMicro[] {
    const result: AnimaMicro[] = [];
    for (const micro of this._entities.values()) {
      if (micro.kind === kind) result.push(micro);
    }
    return result;
  }

  byState(state: AnimaState): AnimaMicro[] {
    const result: AnimaMicro[] = [];
    for (const micro of this._entities.values()) {
      if (micro.status().state === state) result.push(micro);
    }
    return result;
  }

  healthReport(): AnimaMicro[] {
    return [...this._entities.values()].sort(
      (a, b) => a.status().health - b.status().health,
    );
  }

  entries(): AnimaDatabaseEntry[] {
    return [...this._entities.values()].map((m) => m.toDatabaseEntry());
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY FUNCTIONS
// ══════════════════════════════════════════════════════════════════

export function createAnimaMicro(
  id: string,
  name: string,
  latinName: string,
  kind: AnimaKind,
): AnimaMicro {
  return new AnimaMicro(id, name, latinName, kind);
}

export function createAnimaDatabase(): AnimaDatabase {
  return new AnimaDatabase();
}
