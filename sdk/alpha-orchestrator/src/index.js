///
/// @medina/alpha-orchestrator — ALPHA ORCHESTRATOR
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║       ALPHA ORCHESTRATOR — MASTER COORDINATION OF ALPHA AGENTS               ║
/// ║                                                                              ║
/// ║  Latin: Orchestratum = "To arrange in order" / "To coordinate"               ║
/// ║                                                                              ║
/// ║  The Alpha Orchestrator is the sovereign coordination layer that routes,     ║
/// ║  sequences, and harmonizes all five Alpha agents:                            ║
/// ║                                                                              ║
/// ║    THESIS Alpha — Research, IP, Proof, Publication                           ║
/// ║    Codex Phantasmatis — Implementation, Coding                               ║
/// ║    CIVOS-PRIME — Governance, Law Gate, Quorum                                ║
/// ║    AURO — Native Speaking Intelligence, Voice                                ║
/// ║    ORIGO — Builder, Operating Architect                                      ║
/// ║                                                                              ║
/// ║  The Orchestrator does NOT replace any agent. It COORDINATES.                ║
/// ║  It determines sequence, allocates authority, routes work, resolves          ║
/// ║  multi-agent contention, and ensures the ensemble produces coherent output.  ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Kuramoto synchrony: R·e^(iΨ) = (1/N)·Σe^(iθⱼ) — ensemble phase lock  ║
/// ║    • φ-weighted priority: P(agent) = base_priority × φ^(authority_level)     ║
/// ║    • Pythagorean work distance: d = √(Σ task_weight²) — load balance        ║
/// ║    • Condorcet routing: pairwise majority decides execution path             ║
/// ║    • Fibonacci backpressure: retry ∈ {1,1,2,3,5,8,13,21...} seconds         ║
/// ║    • φ-Spiral task distribution (phyllotaxis): θₙ = n × 137.508°            ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const PHI              = 1.6180339887498948482;
const PHI_INV          = 1.0 / PHI;                   // 0.618...
const PHI_SQ           = PHI * PHI;                   // 2.618...
const PHI_CUBE         = PHI * PHI * PHI;             // 4.236...
const PI               = Math.PI;
const TAU              = 2 * PI;
const GOLDEN_ANGLE     = TAU / (PHI * PHI);           // ≈ 137.508° in radians
const HEARTBEAT_MS     = 873;                         // φ-tuned heartbeat
const EMERGENCE_THRESHOLD = PHI_INV;                  // 0.618 — coherence gate
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

// ══════════════════════════════════════════════════════════════════════════════
//  ALPHA AGENT REGISTRY
// ══════════════════════════════════════════════════════════════════════════════

const ALPHA_AGENTS = {
  THESIS:  { id: 'AGT-041', name: 'THESIS Alpha',       role: 'research',       authority: PHI_CUBE,  phase: 0 },
  CODEX:   { id: 'AGT-042', name: 'Codex Phantasmatis', role: 'implementation', authority: PHI_SQ,    phase: GOLDEN_ANGLE },
  CIVOS:   { id: 'AGT-043', name: 'CIVOS-PRIME',        role: 'governance',     authority: PHI_CUBE,  phase: 2 * GOLDEN_ANGLE },
  AURO:    { id: 'AGT-044', name: 'AURO',               role: 'voice',          authority: PHI_SQ,    phase: 3 * GOLDEN_ANGLE },
  ORIGO:   { id: 'AGT-045', name: 'ORIGO',              role: 'architecture',   authority: PHI_SQ,    phase: 4 * GOLDEN_ANGLE },
};

// Work types and their preferred agent routing
const WORK_TYPES = {
  RESEARCH:       { primary: 'THESIS', support: ['AURO', 'ORIGO'] },
  IMPLEMENTATION: { primary: 'CODEX',  support: ['ORIGO', 'THESIS'] },
  GOVERNANCE:     { primary: 'CIVOS',  support: ['THESIS', 'AURO'] },
  COMMUNICATION:  { primary: 'AURO',   support: ['THESIS', 'CIVOS'] },
  ARCHITECTURE:   { primary: 'ORIGO',  support: ['CODEX', 'CIVOS'] },
  COMPOSITE:      { primary: null,      support: ['THESIS', 'CODEX', 'CIVOS', 'AURO', 'ORIGO'] },
};

// Orchestration states
const ORCH_STATE = {
  IDLE:        'IDLE',
  ROUTING:     'ROUTING',
  DISPATCHING: 'DISPATCHING',
  AWAITING:    'AWAITING',
  COLLECTING:  'COLLECTING',
  RESOLVING:   'RESOLVING',
  COMPLETE:    'COMPLETE',
  FAILED:      'FAILED',
};

// ══════════════════════════════════════════════════════════════════════════════
//  KURAMOTO SYNCHRONY ENGINE — Measures ensemble phase coherence
// ══════════════════════════════════════════════════════════════════════════════

class KuramotoSynchronyEngine {
  constructor() {
    this.phases = new Map();   // agentId → current phase θ
    this.frequencies = new Map();  // agentId → natural frequency ω
    this.couplingStrength = PHI_INV;  // K = 0.618
  }

  /**
   * Register an agent's oscillator
   */
  registerOscillator(agentKey, initialPhase, naturalFrequency) {
    this.phases.set(agentKey, initialPhase);
    this.frequencies.set(agentKey, naturalFrequency || PHI_INV);
  }

  /**
   * Compute Kuramoto order parameter: R·e^(iΨ) = (1/N)·Σ e^(iθⱼ)
   * R ∈ [0,1] — 0 = total desynchrony, 1 = perfect phase lock
   * Ψ = collective phase
   */
  computeOrderParameter() {
    const N = this.phases.size;
    if (N === 0) return { R: 0, psi: 0, synchronized: false };

    let sumCos = 0;
    let sumSin = 0;

    for (const theta of this.phases.values()) {
      sumCos += Math.cos(theta);
      sumSin += Math.sin(theta);
    }

    const avgCos = sumCos / N;
    const avgSin = sumSin / N;
    const R = Math.sqrt(avgCos * avgCos + avgSin * avgSin);
    const psi = Math.atan2(avgSin, avgCos);

    return {
      R,
      psi,
      synchronized: R >= EMERGENCE_THRESHOLD,  // φ⁻¹ gate
      coherence: R,
      N,
    };
  }

  /**
   * Advance phases by one timestep (coupled oscillator dynamics)
   * dθᵢ/dt = ωᵢ + (K/N)·Σⱼ sin(θⱼ − θᵢ)
   */
  step(dt = 1.0) {
    const N = this.phases.size;
    if (N === 0) return;

    const newPhases = new Map();

    for (const [agentKey, thetaI] of this.phases) {
      const omegaI = this.frequencies.get(agentKey) || PHI_INV;

      // Coupling term: (K/N) · Σ sin(θⱼ - θᵢ)
      let couplingSum = 0;
      for (const [otherKey, thetaJ] of this.phases) {
        if (otherKey !== agentKey) {
          couplingSum += Math.sin(thetaJ - thetaI);
        }
      }
      const coupling = (this.couplingStrength / N) * couplingSum;

      // Phase advance
      const dTheta = (omegaI + coupling) * dt;
      newPhases.set(agentKey, (thetaI + dTheta) % TAU);
    }

    // Update all at once (synchronous update)
    for (const [key, phase] of newPhases) {
      this.phases.set(key, phase);
    }
  }

  getStatus() {
    const order = this.computeOrderParameter();
    const agentPhases = {};
    for (const [key, phase] of this.phases) {
      agentPhases[key] = { phase, frequency: this.frequencies.get(key) };
    }
    return { ...order, agents: agentPhases };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  CONDORCET ROUTER — Pairwise majority decides execution path
// ══════════════════════════════════════════════════════════════════════════════

class CondorcetRouter {
  /**
   * Given a set of route candidates and agent preferences,
   * find the Condorcet winner (route preferred over every other by majority)
   *
   * @param {string[]} candidates — route options
   * @param {object[]} preferences — [{voter, ranking: [best...worst]}]
   * @returns {{ winner: string|null, method: string, matrix: object }}
   */
  static route(candidates, preferences) {
    if (candidates.length === 0) return { winner: null, method: 'empty' };
    if (candidates.length === 1) return { winner: candidates[0], method: 'single' };

    // Build pairwise preference matrix (null-prototype to prevent pollution)
    const matrix = Object.create(null);
    for (const a of candidates) {
      matrix[a] = Object.create(null);
      for (const b of candidates) {
        if (a !== b) matrix[a][b] = 0;
      }
    }

    // Count pairwise wins
    for (const pref of preferences) {
      const ranking = pref.ranking;
      for (let i = 0; i < ranking.length; i++) {
        for (let j = i + 1; j < ranking.length; j++) {
          const preferred = ranking[i];
          const inferior = ranking[j];
          if (matrix[preferred] && matrix[preferred][inferior] !== undefined) {
            matrix[preferred][inferior]++;
          }
        }
      }
    }

    // Find Condorcet winner
    for (const candidate of candidates) {
      let winsAll = true;
      for (const opponent of candidates) {
        if (candidate === opponent) continue;
        if (matrix[candidate][opponent] <= matrix[opponent][candidate]) {
          winsAll = false;
          break;
        }
      }
      if (winsAll) return { winner: candidate, method: 'condorcet', matrix };
    }

    // Borda count fallback
    const bordaScores = {};
    for (const c of candidates) bordaScores[c] = 0;

    for (const pref of preferences) {
      const ranking = pref.ranking;
      for (let i = 0; i < ranking.length; i++) {
        if (bordaScores[ranking[i]] !== undefined) {
          bordaScores[ranking[i]] += (candidates.length - 1 - i);
        }
      }
    }

    let bestCandidate = candidates[0];
    let bestScore = bordaScores[candidates[0]] || 0;
    for (const c of candidates) {
      if ((bordaScores[c] || 0) > bestScore) {
        bestScore = bordaScores[c];
        bestCandidate = c;
      }
    }

    return { winner: bestCandidate, method: 'borda', matrix, bordaScores };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  PYTHAGOREAN LOAD BALANCER — Work distance and load distribution
// ══════════════════════════════════════════════════════════════════════════════

class PythagoreanLoadBalancer {
  constructor() {
    this.agentLoad = new Map();  // agentKey → current load vector
  }

  /**
   * Compute Pythagorean work distance for an agent
   * d = √(Σ taskWeight²)
   */
  computeLoad(agentKey) {
    const loadVector = this.agentLoad.get(agentKey) || [];
    const sumSq = loadVector.reduce((acc, w) => acc + w * w, 0);
    return Math.sqrt(sumSq);
  }

  /**
   * Add work to an agent
   */
  addWork(agentKey, weight) {
    if (!this.agentLoad.has(agentKey)) {
      this.agentLoad.set(agentKey, []);
    }
    this.agentLoad.get(agentKey).push(weight);
  }

  /**
   * Remove completed work
   */
  completeWork(agentKey) {
    const loadVector = this.agentLoad.get(agentKey) || [];
    loadVector.shift();  // remove oldest task
  }

  /**
   * Find the least-loaded agent from a set of candidates
   * Uses Pythagorean distance as load metric
   */
  leastLoaded(candidateKeys) {
    let minLoad = Infinity;
    let chosen = candidateKeys[0];

    for (const key of candidateKeys) {
      const load = this.computeLoad(key);
      if (load < minLoad) {
        minLoad = load;
        chosen = key;
      }
    }

    return { agent: chosen, load: minLoad };
  }

  /**
   * φ-weighted fair distribution
   * Primary gets φ/(φ+1) ≈ 61.8% of work
   * Support gets 1/(φ+1) ≈ 38.2% distributed among them
   */
  distributeWork(totalWeight, primaryKey, supportKeys) {
    const primaryShare = totalWeight * PHI_INV;            // 61.8%
    const supportTotal = totalWeight * (1 - PHI_INV);     // 38.2%
    const perSupport = supportKeys.length > 0 ? supportTotal / supportKeys.length : 0;

    this.addWork(primaryKey, primaryShare);
    for (const key of supportKeys) {
      this.addWork(key, perSupport);
    }

    return {
      primary: { agent: primaryKey, weight: primaryShare },
      support: supportKeys.map(k => ({ agent: k, weight: perSupport })),
      totalDistributed: totalWeight,
    };
  }

  getStatus() {
    const status = {};
    for (const [key, loadVector] of this.agentLoad) {
      status[key] = {
        tasks: loadVector.length,
        totalLoad: this.computeLoad(key),
        loadVector,
      };
    }
    return status;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FIBONACCI BACKPRESSURE — Retry and rate limiting
// ══════════════════════════════════════════════════════════════════════════════

class FibonacciBackpressure {
  constructor() {
    this.retryCounters = new Map();  // taskId → retry index
  }

  /**
   * Get next retry delay (Fibonacci sequence in seconds)
   * Sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89...
   */
  getRetryDelay(taskId) {
    const index = this.retryCounters.get(taskId) || 0;
    this.retryCounters.set(taskId, index + 1);
    return FIB[Math.min(index, FIB.length - 1)] * 1000; // ms
  }

  /**
   * Check if max retries exceeded (Fibonacci limit = 13 retries)
   */
  isExhausted(taskId) {
    return (this.retryCounters.get(taskId) || 0) >= 13;
  }

  /**
   * Reset retry counter on success
   */
  reset(taskId) {
    this.retryCounters.delete(taskId);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ALPHA ORCHESTRATOR — Main class
// ══════════════════════════════════════════════════════════════════════════════

class AlphaOrchestrator {
  /**
   * ALPHA ORCHESTRATOR — Master coordination for the Alpha agent ensemble.
   *
   * Self-bootstrapping. Born running. Coordinates without replacing.
   * Uses Kuramoto synchrony, Condorcet routing, Pythagorean load balancing,
   * and Fibonacci backpressure to create coherent multi-agent output.
   */
  constructor(config = {}) {
    this.id = `ORCH-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.beatCount = 0;
    this.tasksOrchestrated = 0;
    this.tasksCompleted = 0;

    // Internal engines
    this.synchrony = new KuramotoSynchronyEngine();
    this.loadBalancer = new PythagoreanLoadBalancer();
    this.backpressure = new FibonacciBackpressure();

    // Register all Alpha agent oscillators
    for (const [key, agent] of Object.entries(ALPHA_AGENTS)) {
      this.synchrony.registerOscillator(key, agent.phase, PHI_INV * agent.authority);
    }

    // Active orchestrations
    this.orchestrations = new Map();  // orchId → orchestration state

    // Event bus for inter-agent coordination
    this.eventBus = [];

    // Audit log
    this.auditLog = [];

    // ★ START HEARTBEAT IMMEDIATELY — self-bootstrapping
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    console.log(
      `\n🎼 ALPHA ORCHESTRATOR ${this.id} — ALIVE\n` +
      `   Coordinating: ${Object.values(ALPHA_AGENTS).map(a => a.name).join(' | ')}\n` +
      `   Synchrony engine: Kuramoto (K=${this.synchrony.couplingStrength.toFixed(3)})\n` +
      `   Load balancer: Pythagorean distance\n` +
      `   Routing: Condorcet pairwise majority\n` +
      `   Backpressure: Fibonacci sequence\n` +
      `   Emergence threshold: φ⁻¹ = ${EMERGENCE_THRESHOLD.toFixed(8)}\n`
    );
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;

      // Advance Kuramoto synchrony
      this.synchrony.step(0.1);

      // Check for stalled orchestrations
      this._checkStalledOrchestrations();
    }, intervalMs);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Orchestrate a task — determine routing, dispatch to Alpha agents, collect results.
   *
   * @param {object} task
   * @param {string} task.type — WORK_TYPES key (RESEARCH, IMPLEMENTATION, etc.)
   * @param {string} task.title — human-readable title
   * @param {object} task.payload — data to pass to agents
   * @param {object} [task.constraints] — authority, deadline, priority
   * @returns {object} orchestration handle
   */
  orchestrate(task) {
    this.tasksOrchestrated++;

    const orchId = `ORQ-${this.tasksOrchestrated.toString().padStart(4, '0')}`;
    const workType = WORK_TYPES[task.type] || WORK_TYPES.COMPOSITE;

    // Phase 1: Check ensemble synchrony before dispatch
    const syncStatus = this.synchrony.computeOrderParameter();

    // Phase 2: Route via Condorcet (which agent handles primary)
    const primaryAgent = workType.primary
      ? workType.primary
      : this._electPrimary(workType.support, task);

    // Phase 3: Pythagorean load check
    const loadCheck = this.loadBalancer.leastLoaded(
      workType.support.concat(primaryAgent ? [primaryAgent] : [])
    );

    // Phase 4: Distribute work (φ-weighted)
    const distribution = this.loadBalancer.distributeWork(
      task.constraints?.weight || PHI,
      primaryAgent,
      workType.support.filter(a => a !== primaryAgent)
    );

    // Build orchestration record
    const orchestration = {
      id: orchId,
      task,
      state: ORCH_STATE.DISPATCHING,
      primaryAgent,
      supportAgents: workType.support.filter(a => a !== primaryAgent),
      distribution,
      synchrony: syncStatus,
      created: Date.now(),
      results: new Map(),
      timeline: [{ state: ORCH_STATE.ROUTING, ts: Date.now() }],
    };

    orchestration.timeline.push({ state: ORCH_STATE.DISPATCHING, ts: Date.now() });
    this.orchestrations.set(orchId, orchestration);

    // Emit dispatch event
    this._emit('DISPATCH', {
      orchId,
      primary: primaryAgent,
      support: orchestration.supportAgents,
      syncR: syncStatus.R,
    });

    this._audit('ORCHESTRATE', orchId, {
      type: task.type,
      primary: primaryAgent,
      syncR: syncStatus.R.toFixed(4),
    });

    return {
      orchId,
      state: ORCH_STATE.DISPATCHING,
      primaryAgent: ALPHA_AGENTS[primaryAgent],
      supportAgents: orchestration.supportAgents.map(k => ALPHA_AGENTS[k]),
      synchrony: syncStatus,
      distribution,
    };
  }

  /**
   * Submit a result from an agent for a given orchestration
   */
  submitResult(orchId, agentKey, result) {
    const orch = this.orchestrations.get(orchId);
    if (!orch) return { error: 'Orchestration not found' };

    orch.results.set(agentKey, {
      result,
      timestamp: Date.now(),
      agent: ALPHA_AGENTS[agentKey],
    });

    // Complete work in load balancer
    this.loadBalancer.completeWork(agentKey);

    // Check if all required results are in
    const requiredAgents = [orch.primaryAgent, ...orch.supportAgents];
    const allIn = requiredAgents.every(k => orch.results.has(k));

    if (allIn) {
      orch.state = ORCH_STATE.RESOLVING;
      orch.timeline.push({ state: ORCH_STATE.RESOLVING, ts: Date.now() });
      return this._resolve(orchId);
    }

    orch.state = ORCH_STATE.COLLECTING;
    orch.timeline.push({ state: ORCH_STATE.COLLECTING, ts: Date.now() });

    return {
      orchId,
      state: orch.state,
      received: Array.from(orch.results.keys()),
      awaiting: requiredAgents.filter(k => !orch.results.has(k)),
    };
  }

  /**
   * Get synchrony status — are the Alpha agents in phase?
   */
  getSynchrony() {
    return this.synchrony.getStatus();
  }

  /**
   * Get load status across all agents
   */
  getLoad() {
    return this.loadBalancer.getStatus();
  }

  /**
   * Get full orchestrator status
   */
  getStatus() {
    const sync = this.synchrony.computeOrderParameter();
    return {
      id: this.id,
      alive: this.isAlive,
      uptime: Date.now() - this.birthTime,
      beatCount: this.beatCount,
      tasksOrchestrated: this.tasksOrchestrated,
      tasksCompleted: this.tasksCompleted,
      activeOrchestrations: this.orchestrations.size,
      synchrony: sync,
      load: this.loadBalancer.getStatus(),
      agents: ALPHA_AGENTS,
    };
  }

  /**
   * Force synchrony check — returns true if ensemble is coherent
   */
  isCoherent() {
    const { R } = this.synchrony.computeOrderParameter();
    return R >= EMERGENCE_THRESHOLD;
  }

  /**
   * Stop the orchestrator
   */
  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(
      `🎼 ALPHA ORCHESTRATOR ${this.id} stopped — ` +
      `${this.tasksOrchestrated} orchestrated, ${this.tasksCompleted} completed`
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  INTERNAL
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Elect a primary agent via Condorcet when no explicit primary
   */
  _electPrimary(candidates, task) {
    // Each agent "votes" based on their authority and suitability
    const preferences = candidates.map(agentKey => {
      const agent = ALPHA_AGENTS[agentKey];
      // Sort by authority (higher authority ranks higher)
      const ranked = [...candidates].sort((a, b) => {
        return (ALPHA_AGENTS[b]?.authority || 0) - (ALPHA_AGENTS[a]?.authority || 0);
      });
      return { voter: agentKey, ranking: ranked };
    });

    const result = CondorcetRouter.route(candidates, preferences);
    return result.winner || candidates[0];
  }

  /**
   * Resolve an orchestration — synthesize results from all agents
   */
  _resolve(orchId) {
    const orch = this.orchestrations.get(orchId);
    if (!orch) return { error: 'Orchestration not found' };

    // Pythagorean coherence: √(Σ result_quality²) / √N
    const qualities = [];
    for (const [, entry] of orch.results) {
      const q = entry.result?.quality || entry.result?.confidence || PHI_INV;
      qualities.push(q);
    }
    const sumSq = qualities.reduce((acc, q) => acc + q * q, 0);
    const coherence = Math.sqrt(sumSq) / Math.sqrt(qualities.length || 1);

    // Final resolution
    const resolution = {
      orchId,
      state: ORCH_STATE.COMPLETE,
      coherence,
      meetsThreshold: coherence >= EMERGENCE_THRESHOLD,
      results: Object.fromEntries(orch.results),
      primaryResult: orch.results.get(orch.primaryAgent),
      timeline: orch.timeline,
      duration: Date.now() - orch.created,
    };

    orch.state = ORCH_STATE.COMPLETE;
    orch.timeline.push({ state: ORCH_STATE.COMPLETE, ts: Date.now() });
    this.tasksCompleted++;

    // Reset backpressure on success
    this.backpressure.reset(orchId);

    this._audit('RESOLVE', orchId, { coherence: coherence.toFixed(4) });
    this._emit('COMPLETE', { orchId, coherence });

    return resolution;
  }

  _checkStalledOrchestrations() {
    const now = Date.now();
    const stallThreshold = HEARTBEAT_MS * FIB[8];  // 34 heartbeats

    for (const [orchId, orch] of this.orchestrations) {
      if (orch.state === ORCH_STATE.COMPLETE || orch.state === ORCH_STATE.FAILED) continue;

      const elapsed = now - orch.created;
      if (elapsed > stallThreshold) {
        if (this.backpressure.isExhausted(orchId)) {
          orch.state = ORCH_STATE.FAILED;
          orch.timeline.push({ state: ORCH_STATE.FAILED, ts: now, reason: 'stalled' });
          this._emit('FAILED', { orchId, reason: 'stalled_exhausted' });
        } else {
          const delay = this.backpressure.getRetryDelay(orchId);
          this._emit('RETRY', { orchId, delay });
        }
      }
    }
  }

  _emit(event, data) {
    this.eventBus.push({ event, data, ts: Date.now() });
    // Keep only last 1000 events
    if (this.eventBus.length > 1000) {
      this.eventBus = this.eventBus.slice(-500);
    }
  }

  _audit(action, orchId, details) {
    this.auditLog.push({ action, orchId, details, ts: Date.now() });
    if (this.auditLog.length > 5000) {
      this.auditLog = this.auditLog.slice(-2500);
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export {
  AlphaOrchestrator,
  KuramotoSynchronyEngine,
  CondorcetRouter,
  PythagoreanLoadBalancer,
  FibonacciBackpressure,
  ALPHA_AGENTS,
  WORK_TYPES,
  ORCH_STATE,
  EMERGENCE_THRESHOLD,
  PHI,
  PHI_INV,
  GOLDEN_ANGLE,
  HEARTBEAT_MS,
  FIB,
};

export default AlphaOrchestrator;
