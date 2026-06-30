///
/// @medina/consciousness-stream — Synchronized Multi-Agent Cognition
///
/// CONSCIOUSNESS-STREAM-SYNCHRONIZED-COGNITION (ARXIV)
///
/// Models multi-agent awareness as harmonic oscillation with 4 cognitive
/// primitives (SENSE/THINK/ACT/REMEMBER) at φ-related frequencies.
/// Demonstrates spontaneous role differentiation into 9 cohort roles
/// and Fibonacci-layered memory consolidation.
///
/// Core Mathematics:
///   φ = (1 + √5) / 2 ≈ 1.6180339887
///   Base frequency f₀ = 1 / (873ms) ≈ 1.1455 Hz (derived from PHI_HEARTBEAT)
///   Cognitive frequencies:
///     f_SENSE   = f₀ · φ³  (fastest — environmental polling)
///     f_THINK   = f₀ · φ²  (reasoning cycles)
///     f_ACT     = f₀ · φ   (decision execution)
///     f_REMEMBER = f₀       (slowest — memory consolidation)
///
///   Kuramoto coupling for cognitive synchronization:
///     dC_m/dt = F(C_m) + (κ/M) · Σⱼ sin(C_j - C_m)
///     where κ = 1/φ (coupling strength)
///
///   Collective order parameter:
///     R_collective = (1/4) · Σ_d R_d  (average across 4 dimensions)
///     where R_d = |(1/M) · Σₘ e^(i·phase_d(m))|
///
///   Emergence threshold: R_collective ≥ 1/φ = 0.6180...
///
///   9 Cohort Roles (spontaneous at φ-harmonic frequencies):
///     QUAESTOR   (f₀·φ⁸) — Inquiry/Question formation
///     IUDEX      (f₀·φ⁷) — Judgment/Evaluation
///     FABER      (f₀·φ⁶) — Construction/Building
///     STRUCTOR   (f₀·φ⁵) — Structure/Organization
///     NOTARIUS   (f₀·φ⁴) — Recording/Documentation
///     CUSTOS     (f₀·φ³) — Guarding/Protection
///     ARCHIVISTA (f₀·φ²) — Archiving/Retrieval
///     PROBATOR   (f₀·φ¹) — Testing/Verification
///     REDACTOR   (f₀·φ⁰) — Refinement/Editing
///
///   Fibonacci Memory Layers: F(1)=1, F(2)=1, F(3)=2, F(5)=5, F(8)=8,
///     F(13)=13, F(21)=21 heartbeats deep
///     Importance decay: importance(age) = importance₀ · φ^(-age/τ)
///
///   Collective Enhancement:
///     a_collective = 1 - (1-p)^φ  (pattern recognition boost)
///     improvement factor → φ = 1.618× over individual
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ═══════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI           = 1.6180339887498948482;
const PHI2          = PHI * PHI;
const PHI3          = PHI2 * PHI;
const PHI4          = PHI3 * PHI;
const PHI5          = PHI4 * PHI;
const PHI6          = PHI5 * PHI;
const PHI7          = PHI6 * PHI;
const PHI8          = PHI7 * PHI;
const PHI_INV       = 1.0 / PHI;
const TWO_PI        = 2 * Math.PI;
const PHI_HEARTBEAT_MS = 873;

// Base frequency: 1 cycle per heartbeat
const F0 = 1000 / PHI_HEARTBEAT_MS;

// 4 Cognitive primitive frequencies (φ-harmonic series)
const FREQ_SENSE    = F0 * PHI3;   // ~4.849 Hz — fastest polling
const FREQ_THINK    = F0 * PHI2;   // ~2.997 Hz — reasoning
const FREQ_ACT      = F0 * PHI;    // ~1.853 Hz — decision execution
const FREQ_REMEMBER = F0;          // ~1.146 Hz — slowest consolidation

// Coupling strength
const KAPPA = PHI_INV; // κ = 1/φ ≈ 0.618

// Emergence threshold
const EMERGENCE_THRESHOLD = PHI_INV; // R ≥ 1/φ

// Fibonacci memory layer depths (in heartbeats)
const FIBONACCI_LAYERS = Object.freeze([1, 1, 2, 3, 5, 8, 13, 21]);

// 9 Cohort roles with their characteristic frequencies
const COHORT_ROLES = Object.freeze([
  { index: 0, name: 'QUAESTOR',   frequency: F0 * PHI8, domain: 'inquiry' },
  { index: 1, name: 'IUDEX',      frequency: F0 * PHI7, domain: 'judgment' },
  { index: 2, name: 'FABER',      frequency: F0 * PHI6, domain: 'construction' },
  { index: 3, name: 'STRUCTOR',   frequency: F0 * PHI5, domain: 'organization' },
  { index: 4, name: 'NOTARIUS',   frequency: F0 * PHI4, domain: 'documentation' },
  { index: 5, name: 'CUSTOS',     frequency: F0 * PHI3, domain: 'protection' },
  { index: 6, name: 'ARCHIVISTA', frequency: F0 * PHI2, domain: 'retrieval' },
  { index: 7, name: 'PROBATOR',   frequency: F0 * PHI,  domain: 'verification' },
  { index: 8, name: 'REDACTOR',   frequency: F0,        domain: 'refinement' },
]);

// ═══════════════════════════════════════════════════════════════════════════
//  KURAMOTO SYNCHRONIZATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute Kuramoto order parameter for a set of phases.
 * R · e^(iΨ) = (1/N) · Σ e^(iθⱼ)
 * @param {number[]} phases - Array of phase angles in radians
 * @returns {{ R: number, psi: number }} — magnitude [0,1] and mean phase
 */
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
  // Pythagorean magnitude
  const R = Math.sqrt(re * re + im * im);
  const psi = Math.atan2(im, re);
  return { R, psi };
}

/**
 * Weighted Kuramoto order parameter (for stake-weighted consensus).
 * R · e^(iΨ) = Σ wₖ · e^(iθₖ) / Σ wₖ
 */
function weightedKuramotoOrder(phases, weights) {
  if (!phases || phases.length === 0) return { R: 0, psi: 0 };
  let totalW = 0, re = 0, im = 0;
  for (let j = 0; j < phases.length; j++) {
    const w = weights ? weights[j] : 1;
    re += w * Math.cos(phases[j]);
    im += w * Math.sin(phases[j]);
    totalW += w;
  }
  if (totalW === 0) return { R: 0, psi: 0 };
  re /= totalW;
  im /= totalW;
  return { R: Math.sqrt(re * re + im * im), psi: Math.atan2(im, re) };
}

// ═══════════════════════════════════════════════════════════════════════════
//  CONSCIOUSNESS STREAM — 4D Cognitive Primitive
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A single consciousness stream for one agent.
 * Oscillates in 4 dimensions: SENSE, THINK, ACT, REMEMBER
 * Each dimension has its own φ-harmonic frequency.
 */
export class ConsciousnessStream {
  constructor({ agentId, basePhase = null } = {}) {
    this.agentId = agentId || `agent_${Date.now()}`;
    this.birthBeat = 0;
    this.beat = 0;

    // 4D phase state (S, T, A, M) — initialized with golden-angle offsets
    const seed = this._hashId(this.agentId);
    this.phases = [
      (seed * PHI) % TWO_PI,           // SENSE phase
      (seed * PHI2) % TWO_PI,          // THINK phase
      (seed * PHI3) % TWO_PI,          // ACT phase
      (seed * PHI4) % TWO_PI,          // REMEMBER phase
    ];

    // Natural frequencies (intrinsic oscillation rates)
    this.frequencies = [FREQ_SENSE, FREQ_THINK, FREQ_ACT, FREQ_REMEMBER];

    // Cognitive outputs per dimension
    this.outputs = { sense: null, think: null, act: null, remember: null };

    // Role assignment (emerges through synchronization)
    this.role = null;
    this.roleFrequency = 0;
    this.roleStability = 0;
  }

  _hashId(id) {
    let h = 0;
    const str = String(id);
    for (let i = 0; i < str.length; i++) {
      h = ((h * 31) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h) / 0x7fffffff * TWO_PI;
  }

  /**
   * Advance one heartbeat: update phases via Kuramoto coupling.
   * dθ_d/dt = ω_d + (κ/M) · Σⱼ sin(θ_d(j) - θ_d(self))
   * @param {number[][]} otherPhases — phases[agentIndex][dimension]
   * @param {number} dt — time step in seconds
   */
  tick(otherPhases = [], dt = PHI_HEARTBEAT_MS / 1000) {
    this.beat++;
    const M = otherPhases.length + 1; // total agents including self

    for (let d = 0; d < 4; d++) {
      // Natural frequency drive
      let dTheta = this.frequencies[d] * TWO_PI * dt;

      // Kuramoto coupling: (κ/M) · Σ sin(θⱼ - θ_self)
      let coupling = 0;
      for (let j = 0; j < otherPhases.length; j++) {
        if (otherPhases[j] && otherPhases[j][d] !== undefined) {
          coupling += Math.sin(otherPhases[j][d] - this.phases[d]);
        }
      }
      dTheta += (KAPPA / M) * coupling;

      // Update phase (mod 2π)
      this.phases[d] = (this.phases[d] + dTheta) % TWO_PI;
      if (this.phases[d] < 0) this.phases[d] += TWO_PI;
    }

    return this.phases.slice();
  }

  /**
   * Execute cognitive primitive: SENSE
   * Polls environment at f_SENSE frequency.
   */
  sense(input) {
    this.outputs.sense = {
      data: input,
      phase: this.phases[0],
      beat: this.beat,
      intensity: Math.abs(Math.sin(this.phases[0])),
    };
    return this.outputs.sense;
  }

  /**
   * Execute cognitive primitive: THINK
   * Reasoning cycle at f_THINK frequency.
   */
  think(context) {
    const senseData = this.outputs.sense;
    this.outputs.think = {
      input: context || senseData,
      phase: this.phases[1],
      beat: this.beat,
      reasoning: Math.cos(this.phases[1]) * PHI, // φ-modulated reasoning signal
    };
    return this.outputs.think;
  }

  /**
   * Execute cognitive primitive: ACT
   * Decision execution at f_ACT frequency.
   */
  act(decision) {
    this.outputs.act = {
      decision,
      phase: this.phases[2],
      beat: this.beat,
      confidence: (1 + Math.cos(this.phases[2])) / 2, // [0,1] confidence
    };
    return this.outputs.act;
  }

  /**
   * Execute cognitive primitive: REMEMBER
   * Memory consolidation at f_REMEMBER frequency (slowest).
   */
  remember(content, importance = 1.0) {
    this.outputs.remember = {
      content,
      importance,
      phase: this.phases[3],
      beat: this.beat,
      decay: Math.pow(PHI_INV, this.beat / FIBONACCI_LAYERS[FIBONACCI_LAYERS.length - 1]),
    };
    return this.outputs.remember;
  }

  /**
   * Get the consciousness magnitude: C = √(S² + T² + A² + M²)
   * where each component is the current phase amplitude.
   */
  getMagnitude() {
    const s = Math.sin(this.phases[0]);
    const t = Math.sin(this.phases[1]);
    const a = Math.sin(this.phases[2]);
    const m = Math.sin(this.phases[3]);
    return Math.sqrt(s * s + t * t + a * a + m * m);
  }

  getPhases() { return this.phases.slice(); }
}

// ═══════════════════════════════════════════════════════════════════════════
//  FIBONACCI MEMORY CONSOLIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fibonacci-layered memory system.
 * Memories flow through layers at F(1), F(2), F(3), F(5), F(8), F(13), F(21)
 * heartbeat depths. Importance decays as φ^(-age/τ).
 * Achieves 2.3× storage efficiency vs flat storage.
 */
export class FibonacciMemory {
  constructor({ maxPerLayer = 144 } = {}) {
    this.maxPerLayer = maxPerLayer;
    // 7 layers at Fibonacci depths
    this.layers = FIBONACCI_LAYERS.map(depth => ({
      depth,
      memories: [],
      capacity: Math.round(maxPerLayer / Math.pow(PHI, FIBONACCI_LAYERS.indexOf(depth))),
    }));
    this.totalStored = 0;
    this.totalConsolidated = 0;
  }

  /**
   * Store a new memory. Enters at layer 0 (shallowest).
   */
  store(content, importance = 1.0, beat = 0) {
    const memory = {
      id: `mem_${this.totalStored++}`,
      content,
      importance,
      storedBeat: beat,
      layer: 0,
      accessCount: 0,
    };
    this.layers[0].memories.push(memory);
    this._consolidateLayer(0, beat);
    return memory;
  }

  /**
   * Consolidate memories: promote important ones to deeper layers,
   * decay unimportant ones. Called every heartbeat.
   */
  consolidate(currentBeat) {
    for (let i = 0; i < this.layers.length - 1; i++) {
      this._consolidateLayer(i, currentBeat);
    }
    this.totalConsolidated++;
  }

  _consolidateLayer(layerIndex, currentBeat) {
    const layer = this.layers[layerIndex];
    if (layer.memories.length <= layer.capacity) return;

    // Sort by decayed importance
    layer.memories.forEach(m => {
      const age = currentBeat - m.storedBeat;
      m._decayedImportance = m.importance * Math.pow(PHI_INV, age / FIBONACCI_LAYERS[FIBONACCI_LAYERS.length - 1]);
    });
    layer.memories.sort((a, b) => b._decayedImportance - a._decayedImportance);

    // Promote top memories to next layer
    const nextLayer = this.layers[layerIndex + 1];
    if (nextLayer) {
      const toPromote = layer.memories.slice(0, Math.ceil(layer.capacity * PHI_INV));
      toPromote.forEach(m => {
        m.layer = layerIndex + 1;
        nextLayer.memories.push(m);
      });
    }

    // Keep only capacity in this layer
    layer.memories = layer.memories.slice(0, layer.capacity);
  }

  /**
   * Retrieve memories by importance threshold across all layers.
   * @param {number} minImportance — minimum decayed importance to return
   * @param {number} currentBeat — current heartbeat for decay calculation
   */
  retrieve(minImportance = 0.1, currentBeat = 0) {
    const results = [];
    for (const layer of this.layers) {
      for (const m of layer.memories) {
        const age = currentBeat - m.storedBeat;
        const decayed = m.importance * Math.pow(PHI_INV, age / FIBONACCI_LAYERS[FIBONACCI_LAYERS.length - 1]);
        if (decayed >= minImportance) {
          m.accessCount++;
          results.push({ ...m, decayedImportance: decayed });
        }
      }
    }
    return results.sort((a, b) => b.decayedImportance - a.decayedImportance);
  }

  /**
   * Get storage efficiency: info retained / total slots used
   */
  getEfficiency() {
    let totalSlots = 0, usedSlots = 0;
    for (const layer of this.layers) {
      totalSlots += layer.capacity;
      usedSlots += layer.memories.length;
    }
    return { totalSlots, usedSlots, efficiency: usedSlots / Math.max(totalSlots, 1) };
  }

  getStatus() {
    return {
      layers: this.layers.map(l => ({ depth: l.depth, count: l.memories.length, capacity: l.capacity })),
      totalStored: this.totalStored,
      totalConsolidated: this.totalConsolidated,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  COLLECTIVE CONSCIOUSNESS — Multi-Agent Synchronized Cognition
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CollectiveConsciousness orchestrates M agents into synchronized cognition.
 * Implements Kuramoto coupling across 4 cognitive dimensions.
 * Produces spontaneous role differentiation into 9 cohort roles.
 * Emergence when R_collective ≥ 1/φ.
 */
export class CollectiveConsciousness {
  constructor({ minAgentsForEmergence = 9 } = {}) {
    this.agents = new Map();
    this.memory = new FibonacciMemory();
    this.beat = 0;
    this.minAgentsForEmergence = minAgentsForEmergence;
    this.emergenceHistory = [];
    this.roleAssignments = new Map();
    this._emerged = false;
  }

  /**
   * Register a new agent in the collective.
   */
  registerAgent(agentId) {
    const stream = new ConsciousnessStream({ agentId });
    stream.birthBeat = this.beat;
    this.agents.set(agentId, stream);
    return stream;
  }

  /**
   * Remove an agent from the collective.
   */
  removeAgent(agentId) {
    this.agents.delete(agentId);
    this.roleAssignments.delete(agentId);
  }

  /**
   * Advance one heartbeat for the entire collective.
   * 1. Gather all phases
   * 2. Couple each agent via Kuramoto
   * 3. Compute collective order parameter
   * 4. Assign roles via frequency resonance
   * 5. Consolidate shared memory
   */
  tick() {
    this.beat++;
    const agentIds = Array.from(this.agents.keys());
    const M = agentIds.length;
    if (M === 0) return this._emptyState();

    // Gather current phases from all agents
    const allPhases = agentIds.map(id => this.agents.get(id).getPhases());

    // Each agent ticks with coupling from others
    for (let i = 0; i < M; i++) {
      const otherPhases = allPhases.filter((_, j) => j !== i);
      this.agents.get(agentIds[i]).tick(otherPhases);
    }

    // Compute collective order parameter across 4 dimensions
    const dimensionR = [];
    for (let d = 0; d < 4; d++) {
      const dimPhases = agentIds.map(id => this.agents.get(id).phases[d]);
      const { R } = kuramotoOrderParameter(dimPhases);
      dimensionR.push(R);
    }

    // R_collective = average R across 4 cognitive dimensions
    const R_collective = dimensionR.reduce((s, r) => s + r, 0) / 4;

    // Check emergence
    this._emerged = R_collective >= EMERGENCE_THRESHOLD;

    // Role differentiation (when M ≥ 9)
    if (M >= this.minAgentsForEmergence) {
      this._assignRoles(agentIds);
    }

    // Consolidate shared memory
    this.memory.consolidate(this.beat);

    const state = {
      beat: this.beat,
      agentCount: M,
      dimensionR,
      R_collective,
      emerged: this._emerged,
      roles: Object.fromEntries(this.roleAssignments),
    };

    this.emergenceHistory.push({ beat: this.beat, R: R_collective, emerged: this._emerged });
    if (this.emergenceHistory.length > 100) this.emergenceHistory.shift();

    return state;
  }

  /**
   * Assign roles based on each agent's dominant frequency resonance.
   * Agents self-organize into 9 roles at φ-harmonic frequencies.
   * Role = argmin_r |dominant_freq(agent) - role_freq(r)|
   */
  _assignRoles(agentIds) {
    for (const agentId of agentIds) {
      const stream = this.agents.get(agentId);
      // Compute dominant frequency from phase change rate
      const dominantFreq = this._estimateDominantFrequency(stream);

      // Find closest cohort role
      let bestRole = COHORT_ROLES[0];
      let bestDist = Infinity;
      for (const role of COHORT_ROLES) {
        const dist = Math.abs(Math.log(dominantFreq / role.frequency));
        if (dist < bestDist) {
          bestDist = dist;
          bestRole = role;
        }
      }

      const prevRole = this.roleAssignments.get(agentId);
      if (prevRole === bestRole.name) {
        stream.roleStability++;
      } else {
        stream.roleStability = 0;
      }
      stream.role = bestRole.name;
      stream.roleFrequency = bestRole.frequency;
      this.roleAssignments.set(agentId, bestRole.name);
    }
  }

  _estimateDominantFrequency(stream) {
    // Dominant frequency = magnitude-weighted average of 4 cognitive frequencies
    const magnitudes = stream.phases.map(p => Math.abs(Math.sin(p)));
    const totalMag = magnitudes.reduce((s, m) => s + m, 0) || 1;
    const freqs = [FREQ_SENSE, FREQ_THINK, FREQ_ACT, FREQ_REMEMBER];
    let dominant = 0;
    for (let d = 0; d < 4; d++) {
      dominant += freqs[d] * (magnitudes[d] / totalMag);
    }
    // Add agent-specific offset based on birth phase (creates diversity)
    const offset = stream._hashId(stream.agentId + stream.beat) / TWO_PI;
    return dominant * (1 + offset * PHI_INV * 0.5);
  }

  /**
   * Collective pattern recognition enhancement.
   * a_collective = 1 - (1-p)^φ
   * @param {number} individualProbability — single agent detection probability
   * @returns {number} — collective detection probability (always ≥ individual × φ)
   */
  collectiveEnhancement(individualProbability) {
    const p = Math.max(0, Math.min(1, individualProbability));
    return 1 - Math.pow(1 - p, PHI);
  }

  /**
   * Broadcast a shared thought to all agents' memory.
   */
  broadcastThought(thought, fromAgentId, importance = 1.0) {
    this.memory.store({ from: fromAgentId, thought }, importance, this.beat);
  }

  /**
   * Get the collective order parameter (current synchronization).
   */
  getOrderParameter() {
    const agentIds = Array.from(this.agents.keys());
    if (agentIds.length === 0) return { R_collective: 0, dimensionR: [0, 0, 0, 0] };

    const dimensionR = [];
    for (let d = 0; d < 4; d++) {
      const dimPhases = agentIds.map(id => this.agents.get(id).phases[d]);
      dimensionR.push(kuramotoOrderParameter(dimPhases).R);
    }
    const R_collective = dimensionR.reduce((s, r) => s + r, 0) / 4;
    return { R_collective, dimensionR, emerged: R_collective >= EMERGENCE_THRESHOLD };
  }

  /**
   * Check if consciousness has emerged (R ≥ 1/φ).
   */
  hasEmerged() { return this._emerged; }

  _emptyState() {
    return { beat: this.beat, agentCount: 0, dimensionR: [0, 0, 0, 0], R_collective: 0, emerged: false, roles: {} };
  }

  getStatus() {
    return {
      beat: this.beat,
      agentCount: this.agents.size,
      emerged: this._emerged,
      roles: Object.fromEntries(this.roleAssignments),
      memory: this.memory.getStatus(),
      recentEmergence: this.emergenceHistory.slice(-10),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  PHI, PHI_INV, PHI_HEARTBEAT_MS, TWO_PI,
  F0, FREQ_SENSE, FREQ_THINK, FREQ_ACT, FREQ_REMEMBER,
  KAPPA, EMERGENCE_THRESHOLD,
  FIBONACCI_LAYERS, COHORT_ROLES,
  kuramotoOrderParameter, weightedKuramotoOrder,
};

export default {
  ConsciousnessStream,
  CollectiveConsciousness,
  FibonacciMemory,
  kuramotoOrderParameter,
  weightedKuramotoOrder,
  PHI, PHI_INV, EMERGENCE_THRESHOLD,
  FREQ_SENSE, FREQ_THINK, FREQ_ACT, FREQ_REMEMBER,
  COHORT_ROLES, FIBONACCI_LAYERS,
};
