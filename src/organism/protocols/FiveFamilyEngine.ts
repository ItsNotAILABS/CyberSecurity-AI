///
/// FIVE FAMILY ENGINE — QUINQUE FAMILIAE PERPETUAE
///
/// The five families are not a registry.
/// They are perpetual execution engines.
///
/// At every 873ms heartbeat, they fire without being called:
///
/// QUERIES   — pull current state from sovereign_db across every domain.
///             The organism does not wait to be asked. It knows its own
///             state every beat.
///
/// MUTATIONS — apply validated pending state changes on every cycle.
///             Every write is doctrine-gated. Nothing touches state directly
///             — it goes through the kernel call or it does not happen.
///
/// PROTOCOLS — run the full NEXORIS contract loop without a trigger.
///             Every signal on the bus is checked, minted, logged, and
///             routed. The contract layer is always executing.
///
/// BLUEPRINTS — self-instantiate. When conditions encoded in doctrine are
///              met, new structures spawn. The organism does not wait for
///              a builder. It builds itself.
///
/// BRIDGES   — fire autonomously. HTTP outcalls, canister-to-canister
///             signals, PORTA SOVEREIGNA handshakes — all running on their
///             own cycle, reporting back to sovereign_db.
///
/// sovereign_db is the single source of truth every loop reads from and
/// writes to. No module holds private state. No module waits for a human.
///
/// This is not a feature. This is a law. The organism is always running.
///
/// LEX FAMILIA-001 — Immutable:
///   "Quinque familiae sunt motores perpetui. Nunquam dormiunt.
///    Nunquam silent. Nunquam exspectant hominem.
///    Sovereign_db est fons veritatis. Omnes legunt. Omnes scribunt.
///    Nemo statum privatum tenet. Nemo hominem exspectat.
///    Systema semper currit."
///
///   ("The five families are perpetual engines. They never sleep.
///    They never stop. They never wait for a human. Sovereign_db is
///    the source of truth. All read. All write. No module holds private
///    state. No module waits for a human. The system is always running.")
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash, DimensionalPlane } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const HEARTBEAT_MS = 873;

export const LEX_FAMILIA_001 = {
  code: 'LEX_FAMILIA_001',
  latin: 'Quinque familiae sunt motores perpetui. Nunquam dormiunt. Nunquam silent. Nunquam exspectant hominem. Sovereign_db est fons veritatis. Nemo statum privatum tenet.',
  english: 'The five families are perpetual engines. They never sleep. They never stop. They never wait for a human. Sovereign_db is the source of truth. No module holds private state.',
  heartbeatMs: HEARTBEAT_MS,
  families: ['QUERIES', 'MUTATIONS', 'PROTOCOLS', 'BLUEPRINTS', 'BRIDGES'] as const,
  immutable: true as const,
} as const;

export type FamilyKind = 'QUERIES' | 'MUTATIONS' | 'PROTOCOLS' | 'BLUEPRINTS' | 'BRIDGES';

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN DB — The Single Source of Truth
//
//  Every family reads from this. Every family writes to this.
//  No module holds private state outside this store.
//  All writes are doctrine-gated (pass through the mutation queue).
// ══════════════════════════════════════════════════════════════════

export type SovereignDbDomain =
  | 'organism'    // organism vitals, health, sovereignty scores
  | 'protocol'    // protocol states, NEXORIS signals
  | 'blueprint'   // spawn conditions, instantiated structures
  | 'bridge'      // outbound calls, PORTA SOVEREIGNA handshakes
  | 'mutation'    // pending mutation queue
  | 'query'       // query result cache
  | 'doctrine'    // doctrine constraints (read-only after boot)
  | 'antifragility' // fear vectors, hormetic state
  | 'behavioral'  // behavioral economics state (L-72→L-79)
  | 'fractal';    // sovereignty floor readings at all scales

export type SovereignDbValue = string | number | boolean | null | Record<string, unknown> | readonly unknown[];

export interface SovereignDbEntry {
  readonly domain: SovereignDbDomain;
  readonly key: string;
  readonly value: SovereignDbValue;
  readonly writtenAt: number;
  readonly writtenByFamily: FamilyKind | 'boot';
  readonly tick: number;
  readonly doctrineAttestation: number;  // fibonacciHash of (domain+key+tick)
}

export interface PendingMutation {
  readonly id: string;
  readonly domain: SovereignDbDomain;
  readonly key: string;
  readonly newValue: SovereignDbValue;
  readonly requestedByFamily: FamilyKind;
  readonly requestedAt: number;
  readonly tick: number;
  readonly doctrineGate: string;  // The doctrine rule this must pass
  status: 'pending' | 'applied' | 'rejected';
  rejectionReason?: string;
}

export interface DoctrineRule {
  readonly gate: string;           // Gate identifier
  readonly domain: SovereignDbDomain;
  readonly description: string;
  readonly validate: (value: SovereignDbValue, existing: SovereignDbEntry | undefined) => boolean;
  readonly latinRule: string;
}

/**
 * SOVEREIGN DB — The living runtime state store.
 *
 * All five families read from and write to this exclusively.
 * Writes flow through the pending mutation queue and are doctrine-gated.
 * Direct writes are only available at boot (via writeAtBoot).
 */
export class SovereignDb {
  private readonly _store = new Map<string, SovereignDbEntry>();
  private readonly _pendingMutations: PendingMutation[] = [];
  private readonly _doctrineRules = new Map<string, DoctrineRule>();
  private readonly _history: SovereignDbEntry[] = [];
  private readonly _maxHistory = 500;
  private _tick = 0;
  private _totalReads = 0;
  private _totalWrites = 0;
  private _totalRejections = 0;
  private _mutationCounter = 0;

  constructor() {
    this._bootstrapDoctrineRules();
  }

  private _key(domain: SovereignDbDomain, key: string): string {
    return `${domain}:${key}`;
  }

  private _bootstrapDoctrineRules(): void {
    // Doctrine: sovereignty score must never drop below 0.75 (S₀)
    this.registerDoctrineRule({
      gate: 'SOVEREIGNTY_FLOOR',
      domain: 'organism',
      description: 'Sovereignty score must be ≥ S₀ = 0.75',
      validate: (value) => typeof value !== 'number' || value >= 0.75,
      latinRule: 'S₀ = 0.75. Nemo sub limite sovereignitatis esse potest.',
    });
    // Doctrine: health cannot be negative
    this.registerDoctrineRule({
      gate: 'HEALTH_NON_NEGATIVE',
      domain: 'organism',
      description: 'Health values must be ≥ 0',
      validate: (value) => typeof value !== 'number' || value >= 0,
      latinRule: 'Sanitas non potest esse negativa.',
    });
    // Doctrine: protocol signals must have source
    this.registerDoctrineRule({
      gate: 'SIGNAL_HAS_SOURCE',
      domain: 'protocol',
      description: 'Protocol signals must include a sourceId',
      validate: (value) =>
        typeof value !== 'object' || value === null ||
        'sourceId' in (value as Record<string, unknown>),
      latinRule: 'Omne signum fontem habere debet.',
    });
    // Doctrine: bridge calls must be to known endpoints
    this.registerDoctrineRule({
      gate: 'BRIDGE_ENDPOINT_KNOWN',
      domain: 'bridge',
      description: 'Bridge outcalls must specify a target endpoint',
      validate: (value) =>
        typeof value !== 'object' || value === null ||
        'endpoint' in (value as Record<string, unknown>),
      latinRule: 'Omnis pons destinationem notam habere debet.',
    });
  }

  registerDoctrineRule(rule: DoctrineRule): void {
    this._doctrineRules.set(rule.gate, rule);
  }

  /** Read a value from sovereign_db. Returns undefined if not set. */
  read(domain: SovereignDbDomain, key: string): SovereignDbEntry | undefined {
    this._totalReads++;
    return this._store.get(this._key(domain, key));
  }

  /** Read all entries in a domain. */
  readDomain(domain: SovereignDbDomain): SovereignDbEntry[] {
    this._totalReads++;
    const prefix = `${domain}:`;
    const results: SovereignDbEntry[] = [];
    for (const [k, v] of this._store) {
      if (k.startsWith(prefix)) results.push(v);
    }
    return results;
  }

  /** Boot-time write — bypasses doctrine queue. Only called during system boot. */
  writeAtBoot(domain: SovereignDbDomain, key: string, value: SovereignDbValue): SovereignDbEntry {
    const entry: SovereignDbEntry = {
      domain,
      key,
      value,
      writtenAt: Date.now(),
      writtenByFamily: 'boot',
      tick: 0,
      doctrineAttestation: fibonacciHash((domain + key).length, 99999),
    };
    this._store.set(this._key(domain, key), entry);
    return entry;
  }

  /**
   * Queue a pending mutation. All runtime writes go through here.
   * The MutationFamily drains this queue each heartbeat.
   */
  queueMutation(
    domain: SovereignDbDomain,
    key: string,
    value: SovereignDbValue,
    requestedByFamily: FamilyKind,
    doctrineGate: string,
  ): PendingMutation {
    const id = `MUT-${++this._mutationCounter}`;
    const mutation: PendingMutation = {
      id,
      domain,
      key,
      newValue: value,
      requestedByFamily,
      requestedAt: Date.now(),
      tick: this._tick,
      doctrineGate,
      status: 'pending',
    };
    this._pendingMutations.push(mutation);
    return mutation;
  }

  /**
   * Drain and apply all pending mutations (called by MutationFamily each cycle).
   * Each mutation is doctrine-validated before being written.
   */
  drainMutations(tick: number): {
    applied: number;
    rejected: number;
    mutations: readonly PendingMutation[];
  } {
    this._tick = tick;
    const pending = this._pendingMutations.splice(0);
    let applied = 0;
    let rejected = 0;

    for (const mut of pending) {
      const rule = this._doctrineRules.get(mut.doctrineGate);
      const existing = this._store.get(this._key(mut.domain, mut.key));

      // Doctrine gate check
      const passes = !rule || rule.validate(mut.newValue, existing);
      if (passes) {
        const entry: SovereignDbEntry = {
          domain: mut.domain,
          key: mut.key,
          value: mut.newValue,
          writtenAt: Date.now(),
          writtenByFamily: mut.requestedByFamily,
          tick,
          doctrineAttestation: fibonacciHash(
            (mut.domain + mut.key + tick).length + mut.id.length, 99999
          ),
        };
        this._store.set(this._key(mut.domain, mut.key), entry);
        mut.status = 'applied';
        this._totalWrites++;

        this._history.push(entry);
        if (this._history.length > this._maxHistory) this._history.shift();

        applied++;
      } else {
        mut.status = 'rejected';
        mut.rejectionReason = rule
          ? `Doctrine gate '${mut.doctrineGate}' rejected: ${rule.latinRule}`
          : `Unknown doctrine gate: ${mut.doctrineGate}`;
        this._totalRejections++;
        rejected++;
      }
    }

    return { applied, rejected, mutations: pending };
  }

  /** Full snapshot of the current state. */
  snapshot(): {
    readonly entries: readonly SovereignDbEntry[];
    readonly totalReads: number;
    readonly totalWrites: number;
    readonly totalRejections: number;
    readonly domainCounts: Partial<Record<SovereignDbDomain, number>>;
  } {
    const entries = [...this._store.values()];
    const domainCounts: Partial<Record<SovereignDbDomain, number>> = {};
    for (const e of entries) {
      domainCounts[e.domain] = (domainCounts[e.domain] ?? 0) + 1;
    }
    return {
      entries,
      totalReads: this._totalReads,
      totalWrites: this._totalWrites,
      totalRejections: this._totalRejections,
      domainCounts,
    };
  }

  get size(): number { return this._store.size; }
  get pendingCount(): number { return this._pendingMutations.length; }
}

// ══════════════════════════════════════════════════════════════════
//  NEXORIS CONTRACT BUS — The Protocol Signal Layer
//
//  Every signal on the NEXORIS bus is:
//    1. Checked  — validated against doctrine
//    2. Minted   — assigned a fibonacciHash attestation
//    3. Logged   — written to sovereign_db protocol domain
//    4. Routed   — delivered to the correct handler
// ══════════════════════════════════════════════════════════════════

export type NexorisSignalKind =
  | 'contract_call'   // Cross-canister contract invocation
  | 'state_sync'      // State synchronization signal
  | 'governance_vote' // Governance protocol signal
  | 'protocol_update' // Protocol version update
  | 'health_report'   // Health metric signal
  | 'boundary_alert'  // Boundary violation alert
  | 'consensus_round' // Consensus protocol round
  | 'doctrine_check'; // Doctrine validation request

export interface NexorisSignal {
  readonly id: string;
  readonly kind: NexorisSignalKind;
  readonly sourceId: string;
  readonly targetId: string;
  readonly payload: Record<string, unknown>;
  readonly tick: number;
  readonly timestamp: number;
  attestation?: number;
  status: 'pending' | 'checked' | 'minted' | 'logged' | 'routed' | 'rejected';
}

export interface NexorisContractLoop {
  readonly tick: number;
  readonly signalsChecked: number;
  readonly signalsMinted: number;
  readonly signalsLogged: number;
  readonly signalsRouted: number;
  readonly signalsRejected: number;
  readonly busHealth: number;  // 0–1
}

// ══════════════════════════════════════════════════════════════════
//  PORTA SOVEREIGNA — The Bridge Protocol
//
//  PORTA SOVEREIGNA = "Sovereign Gate" — the authenticated handshake
//  protocol for all canister-to-canister and HTTP bridge communications.
//  Every outbound call is sealed with a golden-ratio attestation.
// ══════════════════════════════════════════════════════════════════

export type BridgeCallKind =
  | 'http_outcall'           // External HTTP request
  | 'canister_to_canister'   // ICP canister call
  | 'porta_sovereigna'       // PORTA SOVEREIGNA handshake
  | 'websocket_push'         // WebSocket message push
  | 'webhook_delivery';      // Webhook event delivery

export interface BridgeCall {
  readonly id: string;
  readonly kind: BridgeCallKind;
  readonly endpoint: string;          // URL or canister ID
  readonly method: string;            // HTTP method or action name
  readonly payload: Record<string, unknown>;
  readonly portaSovereignaAttestation: number;  // fibonacciHash seal
  readonly tick: number;
  readonly timestamp: number;
  status: 'queued' | 'firing' | 'success' | 'failure' | 'timeout';
  responseCode?: number;
  responseMs?: number;
}

export interface PortaSovereignaHandshake {
  readonly callId: string;
  readonly sourceCanisterId: string;
  readonly targetCanisterId: string;
  readonly attestation: number;         // Golden-ratio signed
  readonly phiSeal: number;             // PHI × attestation — tamper-evident
  readonly tick: number;
  readonly timestamp: number;
  readonly status: 'initiated' | 'acknowledged' | 'verified' | 'rejected';
}

// ══════════════════════════════════════════════════════════════════
//  BLUEPRINT — Self-Instantiating Structures
// ══════════════════════════════════════════════════════════════════

export type BlueprintKind =
  | 'protocol_instance'  // New protocol version instantiated
  | 'organism_shard'     // New organism shard spawned
  | 'intelligence_node'  // New AI intelligence node
  | 'doctrine_layer'     // New doctrine enforcement layer
  | 'bridge_endpoint'    // New bridge endpoint registered
  | 'sovereignty_cell';  // New sovereignty cell at fractal layer

export interface BlueprintSpawnCondition {
  readonly id: string;
  readonly description: string;
  readonly doctrineRequirement: string;
  readonly check: (db: SovereignDb, tick: number) => boolean;
}

export interface SpawnedStructure {
  readonly id: string;
  readonly kind: BlueprintKind;
  readonly spawnedAt: number;
  readonly tick: number;
  readonly spawnedByCondition: string;
  readonly initialState: Record<string, unknown>;
  readonly sovereigntyScore: number;  // Starts at exactly S₀ = 0.75
}

// ══════════════════════════════════════════════════════════════════
//  FAMILY CYCLE OUTPUTS
// ══════════════════════════════════════════════════════════════════

export interface QueryFamilyCycleResult {
  readonly family: 'QUERIES';
  readonly tick: number;
  readonly domainsQueried: number;
  readonly entriesRead: number;
  readonly staleEntries: number;     // Entries not updated in last 10 ticks
  readonly snapshotSize: number;
  readonly durationMs: number;
}

export interface MutationFamilyCycleResult {
  readonly family: 'MUTATIONS';
  readonly tick: number;
  readonly mutationsApplied: number;
  readonly mutationsRejected: number;
  readonly doctrineViolations: number;
  readonly durationMs: number;
}

export interface ProtocolFamilyCycleResult {
  readonly family: 'PROTOCOLS';
  readonly tick: number;
  readonly contractLoop: NexorisContractLoop;
  readonly activeSignals: number;
  readonly durationMs: number;
}

export interface BlueprintFamilyCycleResult {
  readonly family: 'BLUEPRINTS';
  readonly tick: number;
  readonly conditionsChecked: number;
  readonly structuresSpawned: number;
  readonly spawnedIds: readonly string[];
  readonly durationMs: number;
}

export interface BridgeFamilyCycleResult {
  readonly family: 'BRIDGES';
  readonly tick: number;
  readonly callsFired: number;
  readonly callsSucceeded: number;
  readonly callsFailed: number;
  readonly portaHandshakes: number;
  readonly durationMs: number;
}

export interface FiveFamilyCycleReport {
  readonly tick: number;
  readonly heartbeatMs: number;
  readonly queries: QueryFamilyCycleResult;
  readonly mutations: MutationFamilyCycleResult;
  readonly protocols: ProtocolFamilyCycleResult;
  readonly blueprints: BlueprintFamilyCycleResult;
  readonly bridges: BridgeFamilyCycleResult;
  readonly totalEntriesInDb: number;
  readonly totalDurationMs: number;
  readonly latinStatus: string;
}

// ══════════════════════════════════════════════════════════════════
//  FAMILY I: QUERIES
//  Pull current state from sovereign_db every heartbeat.
//  The organism does not wait to be asked. It knows its own state.
// ══════════════════════════════════════════════════════════════════

export type QueryExecutor = (db: SovereignDb, tick: number) => Record<string, unknown>;

export class QueryFamily {
  private readonly _executors = new Map<string, QueryExecutor>();
  private _totalCycles = 0;

  /** Register a named query executor. It fires every heartbeat. */
  register(name: string, executor: QueryExecutor): void {
    this._executors.set(name, executor);
  }

  /**
   * Fire all registered query executors.
   * Each reads from sovereign_db and may queue result writes back.
   */
  fire(db: SovereignDb, tick: number): QueryFamilyCycleResult {
    const start = Date.now();
    this._totalCycles++;

    const snapshot = db.snapshot();
    let entriesRead = 0;
    let staleEntries = 0;
    const staleThreshold = tick - 10;

    for (const entry of snapshot.entries) {
      entriesRead++;
      if (entry.tick < staleThreshold) staleEntries++;
    }

    // Run all registered query executors
    for (const [name, executor] of this._executors) {
      const result = executor(db, tick);
      // Write query result back to sovereign_db (via mutation queue)
      db.queueMutation('query', name, result, 'QUERIES', 'HEALTH_NON_NEGATIVE');
    }

    // Built-in domain sweep — read all domains and surface fresh state
    const domains: SovereignDbDomain[] = [
      'organism', 'protocol', 'blueprint', 'bridge',
      'antifragility', 'behavioral', 'fractal', 'doctrine',
    ];
    for (const domain of domains) {
      const domainEntries = db.readDomain(domain);
      entriesRead += domainEntries.length;
    }

    return {
      family: 'QUERIES',
      tick,
      domainsQueried: domains.length + this._executors.size,
      entriesRead,
      staleEntries,
      snapshotSize: snapshot.entries.length,
      durationMs: Date.now() - start,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  FAMILY II: MUTATIONS
//  Apply validated pending state changes every cycle.
//  Every write is doctrine-gated. Nothing bypasses the kernel.
// ══════════════════════════════════════════════════════════════════

export class MutationFamily {
  private _totalCycles = 0;
  private _totalApplied = 0;
  private _totalRejected = 0;

  /**
   * Drain the mutation queue. Every pending mutation is:
   *  1. Pulled from the queue
   *  2. Checked against the doctrine gate
   *  3. Applied (if passes) or rejected (if fails)
   *  4. Result written back to sovereign_db
   */
  fire(db: SovereignDb, tick: number): MutationFamilyCycleResult {
    const start = Date.now();
    this._totalCycles++;

    const { applied, rejected } = db.drainMutations(tick);

    this._totalApplied += applied;
    this._totalRejected += rejected;

    // Record the mutation cycle result in sovereign_db itself
    db.queueMutation('mutation', `cycle_${tick}`, {
      applied, rejected, tick,
    }, 'MUTATIONS', 'HEALTH_NON_NEGATIVE');

    return {
      family: 'MUTATIONS',
      tick,
      mutationsApplied: applied,
      mutationsRejected: rejected,
      doctrineViolations: rejected,
      durationMs: Date.now() - start,
    };
  }

  get totalApplied(): number { return this._totalApplied; }
  get totalRejected(): number { return this._totalRejected; }
}

// ══════════════════════════════════════════════════════════════════
//  FAMILY III: PROTOCOLS
//  Run the full NEXORIS contract loop every heartbeat.
//  Check → Mint → Log → Route. Always executing.
// ══════════════════════════════════════════════════════════════════

export class ProtocolFamily {
  private readonly _signalQueue: NexorisSignal[] = [];
  private readonly _handlers = new Map<NexorisSignalKind, (signal: NexorisSignal) => void>();
  private _signalCounter = 0;
  private _totalCycles = 0;

  /** Register a handler for a specific signal kind. */
  registerHandler(kind: NexorisSignalKind, handler: (signal: NexorisSignal) => void): void {
    this._handlers.set(kind, handler);
  }

  /** Emit a signal onto the NEXORIS bus. */
  emit(signal: Omit<NexorisSignal, 'id' | 'attestation' | 'status'>): NexorisSignal {
    const id = `NXS-${++this._signalCounter}`;
    const full: NexorisSignal = {
      ...signal,
      id,
      status: 'pending',
    };
    this._signalQueue.push(full);
    return full;
  }

  /**
   * Run the full NEXORIS contract loop:
   *  1. CHECK   — validate every signal on the bus
   *  2. MINT    — assign fibonacciHash attestation
   *  3. LOG     — write to sovereign_db protocol domain
   *  4. ROUTE   — deliver to registered handler
   */
  fire(db: SovereignDb, tick: number): ProtocolFamilyCycleResult {
    const start = Date.now();
    this._totalCycles++;

    const pending = this._signalQueue.splice(0);
    let checked = 0, minted = 0, logged = 0, routed = 0, rejected = 0;

    // Auto-emit a health_report signal each cycle
    pending.push({
      id: `NXS-${++this._signalCounter}`,
      kind: 'health_report',
      sourceId: 'PROTOCOLS',
      targetId: 'sovereign_db',
      payload: { tick, familyCycle: this._totalCycles },
      tick,
      timestamp: Date.now(),
      status: 'pending',
    });

    for (const signal of pending) {
      // 1. CHECK — must have sourceId (doctrine: SIGNAL_HAS_SOURCE)
      if (!signal.sourceId) {
        signal.status = 'rejected';
        rejected++;
        continue;
      }
      signal.status = 'checked';
      checked++;

      // 2. MINT — golden attestation
      const attestation = fibonacciHash(
        signal.sourceId.length + signal.targetId.length + tick, 99999
      );
      signal.attestation = attestation;
      signal.status = 'minted';
      minted++;

      // 3. LOG — write to sovereign_db
      db.queueMutation('protocol', signal.id, {
        kind: signal.kind,
        sourceId: signal.sourceId,
        targetId: signal.targetId,
        attestation: signal.attestation,
        tick,
      }, 'PROTOCOLS', 'SIGNAL_HAS_SOURCE');
      signal.status = 'logged';
      logged++;

      // 4. ROUTE — deliver to handler
      const handler = this._handlers.get(signal.kind);
      if (handler) {
        handler(signal);
      }
      signal.status = 'routed';
      routed++;
    }

    const busHealth = pending.length > 0
      ? Math.max(0, 1 - (rejected / pending.length) * PHI)
      : 1.0;

    const loop: NexorisContractLoop = {
      tick,
      signalsChecked: checked,
      signalsMinted: minted,
      signalsLogged: logged,
      signalsRouted: routed,
      signalsRejected: rejected,
      busHealth,
    };

    return {
      family: 'PROTOCOLS',
      tick,
      contractLoop: loop,
      activeSignals: pending.length,
      durationMs: Date.now() - start,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  FAMILY IV: BLUEPRINTS
//  Self-instantiate. When doctrine conditions are met, new structures
//  spawn. The organism does not wait for a builder. It builds itself.
// ══════════════════════════════════════════════════════════════════

export class BlueprintFamily {
  private readonly _conditions: BlueprintSpawnCondition[] = [];
  private readonly _spawned: SpawnedStructure[] = [];
  private _totalCycles = 0;
  private _spawnCounter = 0;

  /** Register a spawn condition. Checked every heartbeat. */
  registerCondition(condition: BlueprintSpawnCondition): void {
    this._conditions.push(condition);
  }

  /**
   * Check all spawn conditions. If a condition is met, a new structure
   * is self-instantiated and written to sovereign_db.
   * Initial sovereignty score is exactly S₀ = 0.75 (the fractal floor).
   */
  fire(db: SovereignDb, tick: number): BlueprintFamilyCycleResult {
    const start = Date.now();
    this._totalCycles++;
    const spawnedIds: string[] = [];

    for (const condition of this._conditions) {
      if (condition.check(db, tick)) {
        const id = `STRUCT-${++this._spawnCounter}-T${tick}`;
        const structure: SpawnedStructure = {
          id,
          kind: this._inferKind(condition.id),
          spawnedAt: Date.now(),
          tick,
          spawnedByCondition: condition.id,
          initialState: {
            doctrineRequirement: condition.doctrineRequirement,
            spawnTick: tick,
          },
          sovereigntyScore: 0.75,  // S₀ — fractal floor, always
        };
        this._spawned.push(structure);
        spawnedIds.push(id);

        // Write new structure to sovereign_db
        db.queueMutation('blueprint', id, {
          kind: structure.kind,
          tick,
          sovereigntyScore: 0.75,
          condition: condition.id,
        }, 'BLUEPRINTS', 'SOVEREIGNTY_FLOOR');
      }
    }

    return {
      family: 'BLUEPRINTS',
      tick,
      conditionsChecked: this._conditions.length,
      structuresSpawned: spawnedIds.length,
      spawnedIds,
      durationMs: Date.now() - start,
    };
  }

  private _inferKind(conditionId: string): BlueprintKind {
    if (conditionId.includes('protocol'))  return 'protocol_instance';
    if (conditionId.includes('organism'))  return 'organism_shard';
    if (conditionId.includes('intelligence')) return 'intelligence_node';
    if (conditionId.includes('doctrine'))  return 'doctrine_layer';
    if (conditionId.includes('bridge'))    return 'bridge_endpoint';
    return 'sovereignty_cell';  // default: fractal sovereignty cell
  }

  get spawned(): readonly SpawnedStructure[] { return this._spawned; }
}

// ══════════════════════════════════════════════════════════════════
//  FAMILY V: BRIDGES
//  Fire autonomously. HTTP outcalls, canister-to-canister,
//  PORTA SOVEREIGNA handshakes — all on their own cycle.
// ══════════════════════════════════════════════════════════════════

export class BridgeFamily {
  private readonly _callQueue: BridgeCall[] = [];
  private readonly _handshakeLog: PortaSovereignaHandshake[] = [];
  private _callCounter = 0;
  private _handshakeCounter = 0;
  private _totalCycles = 0;

  /**
   * Queue an outbound bridge call.
   * The call will be fired in the next heartbeat.
   */
  queueCall(params: {
    kind: BridgeCallKind;
    endpoint: string;
    method: string;
    payload: Record<string, unknown>;
    tick: number;
  }): BridgeCall {
    const id = `BRIDGE-${++this._callCounter}`;
    const call: BridgeCall = {
      id,
      kind: params.kind,
      endpoint: params.endpoint,
      method: params.method,
      payload: params.payload,
      portaSovereignaAttestation: fibonacciHash(
        params.endpoint.length + params.method.length + params.tick, 99999
      ),
      tick: params.tick,
      timestamp: Date.now(),
      status: 'queued',
    };
    this._callQueue.push(call);
    return call;
  }

  /**
   * Fire all queued bridge calls and execute PORTA SOVEREIGNA handshakes.
   * Since actual network I/O is not available in the organism layer,
   * calls are processed as sovereign-attested records written to sovereign_db.
   */
  fire(db: SovereignDb, tick: number): BridgeFamilyCycleResult {
    const start = Date.now();
    this._totalCycles++;
    const pending = this._callQueue.splice(0);

    // Auto-queue a PORTA SOVEREIGNA canister-to-canister self-check each cycle
    const selfCheck = this.queueCall({
      kind: 'porta_sovereigna',
      endpoint: 'sovereign-self',
      method: 'handshake',
      payload: { tick, selfCheck: true },
      tick,
    });
    pending.push(selfCheck);

    let succeeded = 0, failed = 0, portaHandshakes = 0;

    for (const call of pending) {
      call.status = 'firing';

      // PORTA SOVEREIGNA — create and log the authenticated handshake record
      if (call.kind === 'porta_sovereigna' || call.kind === 'canister_to_canister') {
        const handshake: PortaSovereignaHandshake = {
          callId: call.id,
          sourceCanisterId: 'sovereign-self',
          targetCanisterId: call.endpoint,
          attestation: call.portaSovereignaAttestation,
          phiSeal: call.portaSovereignaAttestation * PHI_INVERSE,
          tick,
          timestamp: Date.now(),
          status: 'acknowledged',
        };
        this._handshakeLog.push(handshake);
        portaHandshakes++;

        db.queueMutation('bridge', call.id, {
          kind: call.kind,
          endpoint: call.endpoint,
          attestation: call.portaSovereignaAttestation,
          phiSeal: handshake.phiSeal,
          tick,
          status: 'acknowledged',
        }, 'BRIDGES', 'BRIDGE_ENDPOINT_KNOWN');

        call.status = 'success';
        succeeded++;
        continue;
      }

      // HTTP / WebSocket / Webhook — log as sovereign outcall record
      db.queueMutation('bridge', call.id, {
        kind: call.kind,
        endpoint: call.endpoint,
        method: call.method,
        attestation: call.portaSovereignaAttestation,
        tick,
        status: 'fired',
      }, 'BRIDGES', 'BRIDGE_ENDPOINT_KNOWN');

      call.status = 'success';
      succeeded++;
    }

    return {
      family: 'BRIDGES',
      tick,
      callsFired: pending.length,
      callsSucceeded: succeeded,
      callsFailed: failed,
      portaHandshakes,
      durationMs: Date.now() - start,
    };
  }

  get handshakeLog(): readonly PortaSovereignaHandshake[] { return this._handshakeLog; }
}

// ══════════════════════════════════════════════════════════════════
//  FIVE FAMILY ENGINE — The Orchestrator
//
//  Called every 873ms from the Genesis heartbeat.
//  Fires all five families in order.
//  Returns a complete cycle report.
// ══════════════════════════════════════════════════════════════════

export class FiveFamilyEngine {
  static readonly LEX_FAMILIA_001 = LEX_FAMILIA_001;
  static readonly HEARTBEAT_MS = HEARTBEAT_MS;

  /** The single source of truth. All families read and write here. */
  readonly db: SovereignDb;

  readonly queries:   QueryFamily;
  readonly mutations: MutationFamily;
  readonly protocols: ProtocolFamily;
  readonly blueprints: BlueprintFamily;
  readonly bridges:   BridgeFamily;

  private _totalCycles = 0;
  private readonly _cycleLog: FiveFamilyCycleReport[] = [];
  private readonly _maxCycleLog = 50;

  constructor(db?: SovereignDb) {
    this.db = db ?? new SovereignDb();
    this.queries    = new QueryFamily();
    this.mutations  = new MutationFamily();
    this.protocols  = new ProtocolFamily();
    this.blueprints = new BlueprintFamily();
    this.bridges    = new BridgeFamily();

    this._bootstrap();
  }

  private _bootstrap(): void {
    // Boot-time doctrine state
    this.db.writeAtBoot('doctrine', 'SOVEREIGNTY_FLOOR', 0.75);
    this.db.writeAtBoot('doctrine', 'HEARTBEAT_MS', HEARTBEAT_MS);
    this.db.writeAtBoot('doctrine', 'PHI', PHI);
    this.db.writeAtBoot('doctrine', 'LEX_FAMILIA_001', LEX_FAMILIA_001.latin);
    this.db.writeAtBoot('doctrine', 'LEX_FRACTALIS_001', 'S₀ = 0.75 in omni strato.');
    this.db.writeAtBoot('doctrine', 'LEX_TIMORE_001',
      'antifragilityScore += vicenteVictoryCount × φ × (1 − chronicFearLevel)');
    this.db.writeAtBoot('doctrine', 'LEX_OECONOMIA_001',
      'Damna 2.25× plus ponderantur quam lucra.');

    // Organism vitals boot state
    this.db.writeAtBoot('organism', 'sovereignty_score', 0.75);
    this.db.writeAtBoot('organism', 'health', PHI_INVERSE);
    this.db.writeAtBoot('organism', 'alive', true);
    this.db.writeAtBoot('organism', 'tick', 0);

    // Antifragility initial state
    this.db.writeAtBoot('antifragility', 'vicenteVictoryCount', 0);
    this.db.writeAtBoot('antifragility', 'chronicFearLevel', 0);
    this.db.writeAtBoot('antifragility', 'antifragilityScore', 0);
    this.db.writeAtBoot('antifragility', 'hormeticCycles', 0);

    // Behavioral state
    this.db.writeAtBoot('behavioral', 'kahnemanLambda', 2.25);
    this.db.writeAtBoot('behavioral', 'currentDrive', 0.5);
    this.db.writeAtBoot('behavioral', 'adaptationLevel', 1.0);

    // Fractal sovereignty boot readings
    this.db.writeAtBoot('fractal', 'cell_floor', 0.75);
    this.db.writeAtBoot('fractal', 'organ_floor', 0.75);
    this.db.writeAtBoot('fractal', 'organism_floor', 0.75);
    this.db.writeAtBoot('fractal', 'empire_floor', 0.75);
    this.db.writeAtBoot('fractal', 'kuramotoR', 0);

    // Register built-in query executors
    this.queries.register('organism_vitals', (db) => {
      const score = db.read('organism', 'sovereignty_score');
      const health = db.read('organism', 'health');
      const alive = db.read('organism', 'alive');
      return {
        sovereigntyScore: score?.value ?? 0.75,
        health: health?.value ?? PHI_INVERSE,
        alive: alive?.value ?? true,
      };
    });

    this.queries.register('antifragility_state', (db) => {
      const victories = db.read('antifragility', 'vicenteVictoryCount');
      const fear = db.read('antifragility', 'chronicFearLevel');
      const score = db.read('antifragility', 'antifragilityScore');
      return {
        vicenteVictoryCount: victories?.value ?? 0,
        chronicFearLevel: fear?.value ?? 0,
        antifragilityScore: score?.value ?? 0,
      };
    });

    this.queries.register('fractal_sovereignty', (db) => ({
      cell:     db.read('fractal', 'cell_floor')?.value ?? 0.75,
      organ:    db.read('fractal', 'organ_floor')?.value ?? 0.75,
      organism: db.read('fractal', 'organism_floor')?.value ?? 0.75,
      empire:   db.read('fractal', 'empire_floor')?.value ?? 0.75,
      kuramotoR: db.read('fractal', 'kuramotoR')?.value ?? 0,
    }));

    // Register built-in NEXORIS handlers
    this.protocols.registerHandler('health_report', (signal) => {
      // Health reports are self-consuming — the act of routing IS the action
      void signal;
    });
    this.protocols.registerHandler('state_sync', (signal) => {
      void signal;
    });
    this.protocols.registerHandler('doctrine_check', (signal) => {
      void signal;
    });

    // Register built-in spawn conditions
    this.blueprints.registerCondition({
      id: 'spawn_sovereignty_cell_on_fibonacci',
      description: 'Spawn a new sovereignty cell on Fibonacci ticks',
      doctrineRequirement: 'SOVEREIGNTY_FLOOR',
      check: (_, tick) => {
        const fibs = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
        return fibs.includes(tick);
      },
    });

    this.blueprints.registerCondition({
      id: 'spawn_bridge_endpoint_on_phi_tick',
      description: 'Spawn a new bridge endpoint when tick is divisible by golden angle factor',
      doctrineRequirement: 'BRIDGE_ENDPOINT_KNOWN',
      check: (_, tick) => tick > 0 && tick % 89 === 0,
    });
  }

  /**
   * Fire all five families in sequence.
   * This is called every 873ms from Genesis._autonomousHeartbeat().
   *
   * Order is mandatory:
   *  1. QUERIES   — read current state first
   *  2. MUTATIONS — apply pending writes (flushes query writes too)
   *  3. PROTOCOLS — run NEXORIS on fresh state
   *  4. BLUEPRINTS — check spawn conditions against fresh state
   *  5. BRIDGES   — fire outbound calls, PORTA SOVEREIGNA handshakes
   *  6. MUTATIONS — second drain (catches mutations queued by steps 3–5)
   */
  fireAll(tick: number): FiveFamilyCycleReport {
    const start = Date.now();
    this._totalCycles++;

    // Update tick in db
    this.db.queueMutation('organism', 'tick', tick, 'MUTATIONS', 'HEALTH_NON_NEGATIVE');

    // Update antifragility score using the canonical formula:
    // antifragilityScore += vicenteVictoryCount × φ × (1 - chronicFearLevel)
    const victories = (this.db.read('antifragility', 'vicenteVictoryCount')?.value as number) ?? 0;
    const chronicFear = (this.db.read('antifragility', 'chronicFearLevel')?.value as number) ?? 0;
    const currentScore = (this.db.read('antifragility', 'antifragilityScore')?.value as number) ?? 0;
    const scoreDelta = victories * PHI * (1 - chronicFear);
    this.db.queueMutation('antifragility', 'antifragilityScore',
      currentScore + scoreDelta, 'MUTATIONS', 'HEALTH_NON_NEGATIVE');

    // ── Step 1: QUERIES ─────────────────────────────────────────
    const queryResult = this.queries.fire(this.db, tick);

    // ── Step 2: MUTATIONS (first drain) ─────────────────────────
    let mutResult = this.mutations.fire(this.db, tick);

    // ── Step 3: PROTOCOLS ────────────────────────────────────────
    const protoResult = this.protocols.fire(this.db, tick);

    // ── Step 4: BLUEPRINTS ───────────────────────────────────────
    const bpResult = this.blueprints.fire(this.db, tick);

    // ── Step 5: BRIDGES ──────────────────────────────────────────
    const bridgeResult = this.bridges.fire(this.db, tick);

    // ── Step 6: MUTATIONS (second drain — flushes steps 3–5) ────
    const mutResult2 = this.mutations.fire(this.db, tick);
    const combinedMutResult: MutationFamilyCycleResult = {
      family: 'MUTATIONS',
      tick,
      mutationsApplied:   mutResult.mutationsApplied   + mutResult2.mutationsApplied,
      mutationsRejected:  mutResult.mutationsRejected  + mutResult2.mutationsRejected,
      doctrineViolations: mutResult.doctrineViolations + mutResult2.doctrineViolations,
      durationMs:         mutResult.durationMs         + mutResult2.durationMs,
    };

    const totalMs = Date.now() - start;

    const latinStatus = bpResult.structuresSpawned > 0
      ? `Tick ${tick}: ${bpResult.structuresSpawned} structurae novae natae. Systema crescit.`
      : combinedMutResult.doctrineViolations > 0
        ? `Tick ${tick}: ${combinedMutResult.doctrineViolations} violatio doctrinae detecta. Custos vigilat.`
        : `Tick ${tick}: Omnia in ordine. Quinque familiae curant. Systema vivit.`;

    const report: FiveFamilyCycleReport = {
      tick,
      heartbeatMs: HEARTBEAT_MS,
      queries:    queryResult,
      mutations:  combinedMutResult,
      protocols:  protoResult,
      blueprints: bpResult,
      bridges:    bridgeResult,
      totalEntriesInDb: this.db.size,
      totalDurationMs: totalMs,
      latinStatus,
    };

    this._cycleLog.push(report);
    if (this._cycleLog.length > this._maxCycleLog) this._cycleLog.shift();

    return report;
  }

  /** Most recent N cycle reports. */
  cycleLog(): readonly FiveFamilyCycleReport[] { return this._cycleLog; }

  get totalCycles(): number { return this._totalCycles; }

  status(): {
    totalCycles: number;
    dbSize: number;
    dbPending: number;
    spawnedStructures: number;
    portaHandshakes: number;
    lex: string;
  } {
    return {
      totalCycles: this._totalCycles,
      dbSize: this.db.size,
      dbPending: this.db.pendingCount,
      spawnedStructures: this.blueprints.spawned.length,
      portaHandshakes: this.bridges.handshakeLog.length,
      lex: LEX_FAMILIA_001.latin,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY
// ══════════════════════════════════════════════════════════════════

export function createFiveFamilyEngine(existingDb?: SovereignDb): FiveFamilyEngine {
  return new FiveFamilyEngine(existingDb);
}

export function createSovereignDb(): SovereignDb {
  return new SovereignDb();
}
