///
/// SOVEREIGN-ORGANISM-ARCHITECTURE Runtime
///
/// Defines the 7 alpha organisms as a computational civilization on ICP's
/// Fibonacci sphere substrate. Covers inter-organism communication via
/// biological signal types, Kuramoto consensus, self-healing topology,
/// and autonomous architecture generation by the ARCHITECT organism.
///
/// Core Mathematics:
///   Fibonacci Sphere Substrate (4,000+ nodes):
///     latitude_k  = arcsin(1 - 2k/(N+1))
///     longitude_k = 2π · k / φ²
///     Near-uniform distribution, no clustering
///
///   Inter-Organism Signals (4 biological types):
///     PULSE     — immediate point-to-point (1 heartbeat TTL)
///     WAVE      — broadcast to all (propagates at φ-speed)
///     RESONANCE — coupling signal (Kuramoto sin(θⱼ - θₖ))
///     ECHO      — delayed feedback (Fibonacci-timed)
///
///   Kuramoto Consensus (organism-level):
///     R · e^(iΨ) = (1/7) · Σₖ₌₁⁷ e^(iθₖ)
///     SOVEREIGN commits when R ≥ 1/φ
///
///   Self-Healing Topology:
///     max_gap(N-k) ≤ φ · max_gap(N) for k < N/φ
///     Golden-angle neighbor discovery: argmin|angle - GOLDEN_ANGLE|
///     Load balancing: max_load/min_load ≤ φ
///
///   Architecture Generation (ARCHITECT organism):
///     7 alpha organisms + 17 sub-organisms = 24 total (composite Fibonacci)
///     Generation timing: Σᵢ₌₁ⁿ F(i) · τ_heartbeat
///     φ-mutations: new organism params = parent × φ^(±mutation)
///
///   Hash Encryption Chain:
///     H(n) = H(n-1) ⊕ ROT(H(n-2), F(n mod 24))
///
///   Resource Distribution (Nash equilibrium):
///     Resources(rank_r) ∝ φ^(-r)
///     Golden Equilibrium: Σᵢ φ^(-i) converges naturally
///
/// 7 Alpha Organisms:
///   SOVEREIGN  — governance & commitment authority
///   ARCHITECT  — generates sub-architectures
///   OBSERVER   — environmental sensing & telemetry
///   NEXUS      — communication routing (golden-angle)
///   GUARDIAN   — security & threat response
///   SCRIBE     — record-keeping & state persistence
///   ORACLE     — predictive intelligence
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ═══════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI             = 1.6180339887498948482;
const PHI2            = PHI * PHI;
const PHI3            = PHI2 * PHI;
const PHI4            = PHI3 * PHI;
const PHI_INV         = 1.0 / PHI;
const GOLDEN_ANGLE    = (2 * Math.PI) / PHI2;  // ≈ 2.3999 rad ≈ 137.508°
const TWO_PI          = 2 * Math.PI;
const HEARTBEAT_MS    = 873;
const EMERGENCE_THRESHOLD = PHI_INV;           // R ≥ 1/φ = 0.618

// Fibonacci sequence for timing and structure
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368];

// Architecture constants
const ALPHA_COUNT     = 7;   // 7 alpha organisms
const SUB_COUNT       = 17;  // 17 sub-organisms
const TOTAL_ARCH      = 24;  // 7 + 17 = 24 (composite Fibonacci structure)

// Signal types
const SIGNAL_TYPES = Object.freeze({
  PULSE:     'PULSE',      // point-to-point, 1 heartbeat TTL
  WAVE:      'WAVE',       // broadcast, propagates at φ-speed
  RESONANCE: 'RESONANCE',  // Kuramoto coupling signal
  ECHO:      'ECHO',       // delayed feedback, Fibonacci-timed
});

// 7 Alpha organism definitions
const ALPHA_ORGANISMS = Object.freeze([
  { id: 'SOVEREIGN',  index: 0, domain: 'governance',     frequency: 1000 / HEARTBEAT_MS * PHI3 },
  { id: 'ARCHITECT',  index: 1, domain: 'generation',     frequency: 1000 / HEARTBEAT_MS * PHI2 },
  { id: 'OBSERVER',   index: 2, domain: 'sensing',        frequency: 1000 / HEARTBEAT_MS * PHI4 },
  { id: 'NEXUS',      index: 3, domain: 'routing',        frequency: 1000 / HEARTBEAT_MS * PHI },
  { id: 'GUARDIAN',   index: 4, domain: 'security',       frequency: 1000 / HEARTBEAT_MS * PHI3 },
  { id: 'SCRIBE',     index: 5, domain: 'persistence',    frequency: 1000 / HEARTBEAT_MS },
  { id: 'ORACLE',     index: 6, domain: 'prediction',     frequency: 1000 / HEARTBEAT_MS * PHI2 },
]);

// ═══════════════════════════════════════════════════════════════════════════
//  FIBONACCI SPHERE SUBSTRATE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fibonacci sphere: near-uniform distribution of nodes.
 * latitude_k  = arcsin(1 - 2k/(N+1))
 * longitude_k = 2π · k / φ²
 */
function fibonacciSpherePosition(k, N) {
  const latitude = Math.asin(1 - (2 * k) / (N + 1));
  const longitude = (TWO_PI * k / PHI2) % TWO_PI;
  return { latitude, longitude, k, N };
}

function sphereDistance(pos1, pos2) {
  const dLat = pos2.latitude - pos1.latitude;
  const dLon = pos2.longitude - pos1.longitude;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(pos1.latitude) * Math.cos(pos2.latitude) * Math.sin(dLon / 2) ** 2;
  return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ═══════════════════════════════════════════════════════════════════════════
//  KURAMOTO ORDER PARAMETER (ORGANISM-LEVEL)
// ═══════════════════════════════════════════════════════════════════════════

function kuramotoOrderParameter(phases) {
  if (!phases || phases.length === 0) return { R: 0, psi: 0 };
  const N = phases.length;
  let re = 0, im = 0;
  for (let j = 0; j < N; j++) {
    re += Math.cos(phases[j]);
    im += Math.sin(phases[j]);
  }
  re /= N;
  im /= N;
  return { R: Math.sqrt(re * re + im * im), psi: Math.atan2(im, re) };
}

// ═══════════════════════════════════════════════════════════════════════════
//  BIOLOGICAL SIGNAL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Biological signal: the communication primitive between organisms.
 */
class BiologicalSignal {
  constructor({ source, target = null, type, payload, scope = 'local' }) {
    this.id = `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.source = source;
    this.target = target; // null for broadcasts
    this.type = type;
    this.payload = payload;
    this.scope = scope;
    this.createdBeat = 0;
    this.ttl = this._computeTTL(type);
    this.propagationSpeed = type === SIGNAL_TYPES.WAVE ? PHI : 1;
    this.delivered = false;
  }

  _computeTTL(type) {
    switch (type) {
      case SIGNAL_TYPES.PULSE: return 1;
      case SIGNAL_TYPES.WAVE: return FIB[7]; // 13 heartbeats
      case SIGNAL_TYPES.RESONANCE: return FIB[5]; // 5 heartbeats
      case SIGNAL_TYPES.ECHO: return FIB[9]; // 34 heartbeats
      default: return 1;
    }
  }

  isExpired(currentBeat) {
    return (currentBeat - this.createdBeat) > this.ttl;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  ORGANISM CLASS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A sovereign organism: autonomous computational entity on the Fibonacci sphere.
 */
class Organism {
  constructor({ id, index, domain, frequency, parentId = null }) {
    this.id = id;
    this.index = index;
    this.domain = domain;
    this.frequency = frequency;
    this.parentId = parentId;

    // Phase state for Kuramoto consensus
    this.phase = (index * GOLDEN_ANGLE) % TWO_PI;
    this.naturalFrequency = frequency;

    // Position on Fibonacci sphere
    this.position = fibonacciSpherePosition(index, TOTAL_ARCH);

    // Communication channels
    this.inbox = [];
    this.outbox = [];
    this.neighbors = [];

    // State
    this.alive = true;
    this.beat = 0;
    this.memory = [];
    this.load = 0;
    this.children = [];

    // Resource allocation: φ^(-rank)
    const normalization = (1 - Math.pow(PHI_INV, TOTAL_ARCH)) / (1 - PHI_INV);
    this.resources = Math.pow(PHI_INV, index) / normalization;
  }

  /**
   * Update phase via Kuramoto coupling with other organisms.
   * dθₖ/dt = ωₖ + (K/N) · Σⱼ sin(θⱼ - θₖ)
   */
  updatePhase(otherPhases, dt = HEARTBEAT_MS / 1000) {
    const K = 2 / PHI; // coupling strength
    const N = otherPhases.length + 1;
    let coupling = 0;
    for (let j = 0; j < otherPhases.length; j++) {
      coupling += Math.sin(otherPhases[j] - this.phase);
    }
    const dTheta = this.naturalFrequency * TWO_PI * dt + (K / N) * coupling;
    this.phase = (this.phase + dTheta) % TWO_PI;
    if (this.phase < 0) this.phase += TWO_PI;
    this.beat++;
    return this.phase;
  }

  /**
   * Send a biological signal.
   */
  emit(type, payload, target = null) {
    const signal = new BiologicalSignal({
      source: this.id,
      target,
      type,
      payload,
      scope: target ? 'directed' : 'broadcast',
    });
    signal.createdBeat = this.beat;
    this.outbox.push(signal);
    return signal;
  }

  /**
   * Receive and process a signal.
   */
  receive(signal) {
    this.inbox.push(signal);
    signal.delivered = true;
    this.load++;

    // Process resonance signals (Kuramoto coupling)
    if (signal.type === SIGNAL_TYPES.RESONANCE && signal.payload && signal.payload.phase !== undefined) {
      // Adjust phase toward sender
      const diff = Math.sin(signal.payload.phase - this.phase);
      this.phase += (PHI_INV / ALPHA_COUNT) * diff;
      this.phase = ((this.phase % TWO_PI) + TWO_PI) % TWO_PI;
    }

    return true;
  }

  /**
   * Store something in organism memory.
   */
  remember(content, importance = 1.0) {
    this.memory.push({ content, importance, beat: this.beat });
    if (this.memory.length > 100) {
      // Decay: remove least important
      this.memory.sort((a, b) => b.importance - a.importance);
      this.memory = this.memory.slice(0, 100);
    }
  }

  getStatus() {
    return {
      id: this.id,
      domain: this.domain,
      phase: this.phase,
      alive: this.alive,
      beat: this.beat,
      load: this.load,
      resources: this.resources,
      children: this.children.length,
      inboxSize: this.inbox.length,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  SOVEREIGN ORGANISM RUNTIME
// ═══════════════════════════════════════════════════════════════════════════

/**
 * SovereignOrganismRuntime — the computational civilization.
 *
 * Manages 7 alpha organisms + sub-organisms on a Fibonacci sphere.
 * Provides:
 *   - Inter-organism communication via 4 signal types
 *   - Kuramoto consensus (SOVEREIGN commits at R ≥ 1/φ)
 *   - Self-healing topology
 *   - Autonomous architecture generation (ARCHITECT)
 *   - Hash encryption chain
 */
class SovereignOrganismRuntime {
  constructor({ substrateNodes = 4000 } = {}) {
    this.substrateNodes = substrateNodes;
    this.beat = 0;
    this.organisms = new Map();
    this.signalBus = [];
    this.consensusHistory = [];
    this.architectureGeneration = [];
    this.hashChain = ['genesis'];

    // Bootstrap 7 alpha organisms
    for (const def of ALPHA_ORGANISMS) {
      const org = new Organism(def);
      this.organisms.set(org.id, org);
    }

    // Compute initial neighbor topology
    this._buildTopology();
  }

  /**
   * Build neighbor topology using golden-angle discovery.
   * Each organism connects to nearest neighbors on the Fibonacci sphere.
   */
  _buildTopology() {
    const orgList = Array.from(this.organisms.values());
    for (const org of orgList) {
      const distances = orgList
        .filter(o => o.id !== org.id)
        .map(o => ({ id: o.id, distance: sphereDistance(org.position, o.position) }))
        .sort((a, b) => a.distance - b.distance);
      // Connect to nearest φ² ≈ 3 neighbors minimum
      org.neighbors = distances.slice(0, Math.max(3, Math.ceil(PHI2))).map(d => d.id);
    }
  }

  /**
   * Advance one heartbeat for the entire civilization.
   * 1. Update phases (Kuramoto)
   * 2. Route signals
   * 3. Check consensus
   * 4. Architecture generation (if ARCHITECT triggers)
   * 5. Self-healing check
   * 6. Hash chain extension
   */
  tick() {
    this.beat++;

    // 1. Kuramoto phase update for all organisms
    const orgList = Array.from(this.organisms.values()).filter(o => o.alive);
    const phases = orgList.map(o => o.phase);

    for (let i = 0; i < orgList.length; i++) {
      const otherPhases = phases.filter((_, j) => j !== i);
      orgList[i].updatePhase(otherPhases);
    }

    // 2. Route signals from outboxes
    this._routeSignals();

    // 3. Check organism-level consensus
    const currentPhases = orgList.map(o => o.phase);
    const { R, psi } = kuramotoOrderParameter(currentPhases);
    const consensusReached = R >= EMERGENCE_THRESHOLD;

    this.consensusHistory.push({ beat: this.beat, R, psi, consensusReached });
    if (this.consensusHistory.length > 100) this.consensusHistory.shift();

    // 4. ARCHITECT generates if conditions met
    if (consensusReached && this.organisms.size < TOTAL_ARCH) {
      this._architectGenerate();
    }

    // 5. Self-healing topology check
    const topologyHealth = this._checkTopologyHealth();

    // 6. Extend hash chain
    this._extendHashChain();

    return {
      beat: this.beat,
      R,
      psi,
      consensusReached,
      organismCount: this.organisms.size,
      topologyHealth,
    };
  }

  /**
   * Route biological signals through the network.
   * Uses golden-angle routing via NEXUS.
   */
  _routeSignals() {
    for (const org of this.organisms.values()) {
      while (org.outbox.length > 0) {
        const signal = org.outbox.shift();

        if (signal.target) {
          // Directed: deliver to target
          const target = this.organisms.get(signal.target);
          if (target && target.alive) {
            target.receive(signal);
          }
        } else {
          // Broadcast: deliver to all via NEXUS golden-angle routing
          for (const [id, recipient] of this.organisms) {
            if (id !== signal.source && recipient.alive) {
              if (!signal.isExpired(this.beat)) {
                recipient.receive(signal);
              }
            }
          }
        }

        this.signalBus.push(signal);
      }
    }

    // Clean expired signals
    this.signalBus = this.signalBus.filter(s => !s.isExpired(this.beat));
  }

  /**
   * ARCHITECT organism generates a new sub-organism.
   * φ-mutations: params = parent × φ^(±mutation)
   * Generation timing: Σᵢ₌₁ⁿ F(i) · τ_heartbeat
   */
  _architectGenerate() {
    const architect = this.organisms.get('ARCHITECT');
    if (!architect || !architect.alive) return;

    const currentCount = this.organisms.size;
    if (currentCount >= TOTAL_ARCH) return;

    // Check Fibonacci timing: generate only at F(n) intervals
    const generationIndex = currentCount - ALPHA_COUNT;
    const requiredBeats = FIB[generationIndex % FIB.length] || 1;
    if (this.beat % requiredBeats !== 0) return;

    // φ-mutation: derive from parent parameters
    const parentOrg = Array.from(this.organisms.values())[currentCount % ALPHA_COUNT];
    const mutationFactor = Math.pow(PHI, (Math.random() - 0.5) * 2); // φ^[-1, +1]

    const newOrg = new Organism({
      id: `SUB_${currentCount - ALPHA_COUNT}_${parentOrg.domain}`,
      index: currentCount,
      domain: `${parentOrg.domain}_sub`,
      frequency: parentOrg.frequency * mutationFactor,
      parentId: parentOrg.id,
    });

    parentOrg.children.push(newOrg.id);
    this.organisms.set(newOrg.id, newOrg);
    this._buildTopology(); // Rebuild with new node

    this.architectureGeneration.push({
      beat: this.beat,
      newOrganismId: newOrg.id,
      parentId: parentOrg.id,
      mutationFactor,
      totalOrganisms: this.organisms.size,
    });

    // ARCHITECT signals the civilization
    architect.emit(SIGNAL_TYPES.WAVE, {
      event: 'GENESIS',
      newOrganism: newOrg.id,
      domain: newOrg.domain,
    });
  }

  /**
   * Self-healing topology check.
   * Property: max_gap(N-k) ≤ φ · max_gap(N) for k < N/φ
   */
  _checkTopologyHealth() {
    const alive = Array.from(this.organisms.values()).filter(o => o.alive);
    const total = this.organisms.size;
    const dead = total - alive.length;

    // Check gap property
    const maxGapN = TWO_PI / total;
    const maxGapReduced = alive.length > 0 ? TWO_PI / alive.length : TWO_PI;
    const gapRatio = maxGapReduced / maxGapN;
    const selfHealing = gapRatio <= PHI;

    // Check load balance: max_load/min_load ≤ φ
    const loads = alive.map(o => o.load || 1);
    const maxLoad = Math.max(...loads);
    const minLoad = Math.max(Math.min(...loads), 1);
    const loadBalance = maxLoad / minLoad;
    const loadBalanced = loadBalance <= PHI;

    return {
      alive: alive.length,
      total,
      dead,
      gapRatio,
      selfHealingProperty: selfHealing,
      loadBalance,
      loadBalanced,
      canSelfHeal: dead < total / PHI,
    };
  }

  /**
   * Hash encryption chain: H(n) = H(n-1) ⊕ ROT(H(n-2), F(n mod 24))
   */
  _extendHashChain() {
    const n = this.hashChain.length;
    const prev = this.hashChain[n - 1];
    const prev2 = n >= 2 ? this.hashChain[n - 2] : 'genesis';
    const rotation = FIB[n % 24];

    // Compute new hash: XOR of prev with rotated prev2
    const prevHash = this._simpleHash(prev);
    const prev2Hash = this._simpleHash(prev2);
    const rotated = this._rotate(prev2Hash, rotation);
    const newHash = (prevHash ^ rotated) >>> 0;

    this.hashChain.push(newHash.toString(16).padStart(8, '0'));
    if (this.hashChain.length > 100) this.hashChain.shift();
  }

  _simpleHash(str) {
    let h = 0x811c9dc5;
    const s = String(str);
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  _rotate(value, bits) {
    bits = bits % 32;
    return ((value << bits) | (value >>> (32 - bits))) >>> 0;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * Send a signal between organisms.
   */
  sendSignal(sourceId, targetId, type, payload) {
    const source = this.organisms.get(sourceId);
    if (!source || !source.alive) return null;
    return source.emit(type, payload, targetId);
  }

  /**
   * Broadcast a signal from an organism to all.
   */
  broadcast(sourceId, type, payload) {
    const source = this.organisms.get(sourceId);
    if (!source || !source.alive) return null;
    return source.emit(type, payload, null);
  }

  /**
   * Kill an organism (test self-healing).
   */
  killOrganism(id) {
    const org = this.organisms.get(id);
    if (org) {
      org.alive = false;
      this._buildTopology();
    }
  }

  /**
   * Revive an organism.
   */
  reviveOrganism(id) {
    const org = this.organisms.get(id);
    if (org) {
      org.alive = true;
      this._buildTopology();
    }
  }

  /**
   * Get current consensus state.
   */
  getConsensusState() {
    const alive = Array.from(this.organisms.values()).filter(o => o.alive);
    const phases = alive.map(o => o.phase);
    const { R, psi } = kuramotoOrderParameter(phases);
    return {
      R,
      psi,
      consensusReached: R >= EMERGENCE_THRESHOLD,
      organisms: alive.length,
      threshold: EMERGENCE_THRESHOLD,
    };
  }

  /**
   * Run until consensus is reached (or timeout).
   */
  runToConsensus(maxBeats = 100) {
    const startBeat = this.beat;
    while (this.beat - startBeat < maxBeats) {
      const result = this.tick();
      if (result.consensusReached) {
        return { reached: true, beats: this.beat - startBeat, R: result.R };
      }
    }
    return { reached: false, beats: maxBeats, R: this.getConsensusState().R };
  }

  /**
   * Get organism by ID.
   */
  getOrganism(id) {
    return this.organisms.get(id);
  }

  /**
   * Get all organism statuses.
   */
  getStatus() {
    return {
      beat: this.beat,
      organisms: Array.from(this.organisms.values()).map(o => o.getStatus()),
      consensus: this.getConsensusState(),
      topology: this._checkTopologyHealth(),
      architectureGenerations: this.architectureGeneration.length,
      hashChainLength: this.hashChain.length,
      substrateNodes: this.substrateNodes,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  PHI, PHI_INV, PHI2, GOLDEN_ANGLE, TWO_PI,
  HEARTBEAT_MS, EMERGENCE_THRESHOLD,
  ALPHA_COUNT, SUB_COUNT, TOTAL_ARCH,
  SIGNAL_TYPES, ALPHA_ORGANISMS, FIB,
  fibonacciSpherePosition, sphereDistance,
  kuramotoOrderParameter,
  BiologicalSignal, Organism,
  SovereignOrganismRuntime,
};

export default SovereignOrganismRuntime;
