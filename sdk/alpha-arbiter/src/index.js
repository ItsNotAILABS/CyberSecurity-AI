///
/// @medina/alpha-arbiter — ALPHA ARBITER
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║          ALPHA ARBITER — CONFLICT RESOLUTION & CONSENSUS ENGINE              ║
/// ║                                                                              ║
/// ║  Latin: Arbiter = "Judge" / "Witness" / "One who decides"                    ║
/// ║                                                                              ║
/// ║  The Alpha Arbiter resolves conflicts between Alpha agents when their        ║
/// ║  outputs contradict, their resource claims collide, or their governance      ║
/// ║  decisions conflict. It is the supreme judicial engine of the ensemble.      ║
/// ║                                                                              ║
/// ║  Where the Orchestrator routes, the Conductor synchronizes, and the          ║
/// ║  Sentinel monitors — the Arbiter JUDGES, RESOLVES, and DECIDES.             ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Nash Equilibrium: No agent can improve outcome by unilateral change     ║
/// ║      — finds stable resolution where no agent wants to deviate               ║
/// ║    • Pareto Optimality: No agent can improve without another losing          ║
/// ║      — ensures resolutions don't waste potential                             ║
/// ║    • Condorcet Method: Pairwise majority comparison of alternatives          ║
/// ║      — democratic resolution when multiple solutions exist                   ║
/// ║    • Bayesian Inference: P(H|E) = P(E|H)·P(H) / P(E)                       ║
/// ║      — updates belief in resolution correctness given evidence               ║
/// ║    • Pythagorean Justice: d = √(Σ(impact_i)²) — magnitude of conflict       ║
/// ║      — measures conflict severity across orthogonal dimensions               ║
/// ║    • φ-weighted Authority: A(agent) = base × φ^(trust_level)                ║
/// ║      — golden ratio scaled influence based on agent track record             ║
/// ║    • Shapley Value: fair attribution of contribution to resolution           ║
/// ║      — ensures each agent gets credit proportional to their contribution     ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const PHI              = 1.6180339887498948482;
const PHI_INV          = 1.0 / PHI;                  // 0.618...
const PHI_SQ           = PHI * PHI;                  // 2.618...
const PHI_CUBE         = PHI * PHI * PHI;            // 4.236...
const PI               = Math.PI;
const TAU              = 2 * PI;
const GOLDEN_ANGLE     = TAU / (PHI * PHI);          // ≈ 137.508°
const HEARTBEAT_MS     = 873;                        // φ-tuned heartbeat
const EMERGENCE_THRESHOLD = PHI_INV;                 // 0.618 — coherence gate
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

// ══════════════════════════════════════════════════════════════════════════════
//  CONFLICT TYPES & RESOLUTION STRATEGIES
// ══════════════════════════════════════════════════════════════════════════════

const CONFLICT_TYPE = {
  OUTPUT_CONTRADICTION:   'OUTPUT_CONTRADICTION',    // agents produce conflicting outputs
  RESOURCE_CONTENTION:    'RESOURCE_CONTENTION',     // agents compete for same resource
  AUTHORITY_OVERLAP:      'AUTHORITY_OVERLAP',       // governance jurisdiction collision
  PRIORITY_DEADLOCK:      'PRIORITY_DEADLOCK',       // circular priority dependencies
  TEMPORAL_CONFLICT:      'TEMPORAL_CONFLICT',       // scheduling/sequencing disagreement
  SEMANTIC_DIVERGENCE:    'SEMANTIC_DIVERGENCE',     // agents interpret task differently
};

const RESOLUTION_STRATEGY = {
  NASH_EQUILIBRIUM:   'NASH_EQUILIBRIUM',    // find stable point no agent wants to leave
  PARETO_OPTIMAL:     'PARETO_OPTIMAL',      // find solution where no one can improve without cost
  CONDORCET_VOTE:     'CONDORCET_VOTE',      // pairwise majority decides
  BAYESIAN_UPDATE:    'BAYESIAN_UPDATE',      // evidence-weighted belief resolution
  AUTHORITY_CASCADE:  'AUTHORITY_CASCADE',    // highest authority decides (φ-weighted)
  SHAPLEY_SPLIT:      'SHAPLEY_SPLIT',       // fair division of contested resource
  PYTHAGOREAN_MERGE:  'PYTHAGOREAN_MERGE',   // orthogonal combination of all outputs
};

const VERDICT = {
  RESOLVED:       'RESOLVED',
  PARTIAL:        'PARTIAL',
  DEFERRED:       'DEFERRED',
  ESCALATED:      'ESCALATED',
  DEADLOCKED:     'DEADLOCKED',
};

// Agent authority levels (φ-weighted trust)
const AGENT_AUTHORITY = {
  THESIS:  { id: 'AGT-041', name: 'THESIS Alpha',       baseAuthority: PHI_CUBE, trustLevel: 3 },
  CODEX:   { id: 'AGT-042', name: 'Codex Phantasmatis', baseAuthority: PHI_SQ,   trustLevel: 2 },
  CIVOS:   { id: 'AGT-043', name: 'CIVOS-PRIME',        baseAuthority: PHI_CUBE, trustLevel: 3 },
  AURO:    { id: 'AGT-044', name: 'AURO',               baseAuthority: PHI_SQ,   trustLevel: 2 },
  ORIGO:   { id: 'AGT-045', name: 'ORIGO',              baseAuthority: PHI_SQ,   trustLevel: 2 },
};

// ══════════════════════════════════════════════════════════════════════════════
//  NASH EQUILIBRIUM SOLVER
// ══════════════════════════════════════════════════════════════════════════════

class NashEquilibriumSolver {
  constructor() {
    this.convergenceThreshold = 1e-6;
    this.maxIterations = FIB[10]; // 89
  }

  // Find Nash equilibrium via iterated best response
  // Each agent has a payoff matrix; equilibrium = no agent benefits from deviation
  solve(payoffMatrices, numStrategies) {
    const numAgents = payoffMatrices.length;

    // Initialize with uniform mixed strategies
    let strategies = Array.from({ length: numAgents }, () => {
      const s = new Array(numStrategies).fill(1.0 / numStrategies);
      return s;
    });

    // Iterated best response with φ-damping
    for (let iteration = 0; iteration < this.maxIterations; iteration++) {
      let maxChange = 0;

      for (let agent = 0; agent < numAgents; agent++) {
        const bestResponse = this._computeBestResponse(
          agent, strategies, payoffMatrices[agent], numStrategies
        );

        // φ-damped update: new = (1/φ)·best + (1 - 1/φ)·old
        const newStrategy = strategies[agent].map((old, i) =>
          PHI_INV * bestResponse[i] + (1 - PHI_INV) * old
        );

        // Normalize to probability distribution
        const sum = newStrategy.reduce((a, b) => a + b, 0);
        const normalized = newStrategy.map(v => v / sum);

        // Track convergence
        for (let i = 0; i < numStrategies; i++) {
          maxChange = Math.max(maxChange, Math.abs(normalized[i] - strategies[agent][i]));
        }

        strategies[agent] = normalized;
      }

      if (maxChange < this.convergenceThreshold) {
        return { converged: true, iteration, strategies };
      }
    }

    return { converged: false, iteration: this.maxIterations, strategies };
  }

  _computeBestResponse(agent, strategies, payoffMatrix, numStrategies) {
    // Expected payoff for each pure strategy
    const expectedPayoffs = new Array(numStrategies).fill(0);

    for (let myStrategy = 0; myStrategy < numStrategies; myStrategy++) {
      // Compute expected payoff against others' mixed strategies
      expectedPayoffs[myStrategy] = this._expectedPayoff(
        agent, myStrategy, strategies, payoffMatrix
      );
    }

    // Best response is argmax, but return softmax for mixed strategy
    const maxPayoff = Math.max(...expectedPayoffs);
    const expPayoffs = expectedPayoffs.map(p => Math.exp((p - maxPayoff) * PHI));
    const sumExp = expPayoffs.reduce((a, b) => a + b, 0);
    return expPayoffs.map(e => e / sumExp);
  }

  _expectedPayoff(agent, strategy, allStrategies, payoffMatrix) {
    // Simplified: weighted average over opponent mixed strategies
    let expected = 0;
    const opponents = allStrategies.filter((_, i) => i !== agent);

    if (opponents.length === 0) return payoffMatrix[strategy] || 0;

    // For 2-player, direct computation
    if (opponents.length === 1) {
      const opp = opponents[0];
      for (let j = 0; j < opp.length; j++) {
        const payoff = payoffMatrix[strategy * opp.length + j] || 0;
        expected += opp[j] * payoff;
      }
    } else {
      // Multi-player: average over all opponents' probabilities
      for (const opp of opponents) {
        for (let j = 0; j < opp.length; j++) {
          const payoff = payoffMatrix[strategy * opp.length + j] || 0;
          expected += (opp[j] * payoff) / opponents.length;
        }
      }
    }

    return expected;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  PARETO OPTIMALITY ENGINE
// ══════════════════════════════════════════════════════════════════════════════

class ParetoEngine {
  // Find Pareto-optimal solutions from a set of alternatives
  // Each alternative is scored on multiple objectives (one per agent)
  findParetoFront(alternatives) {
    if (!alternatives || alternatives.length === 0) return [];

    const front = [];

    for (let i = 0; i < alternatives.length; i++) {
      let dominated = false;

      for (let j = 0; j < alternatives.length; j++) {
        if (i === j) continue;
        if (this._dominates(alternatives[j], alternatives[i])) {
          dominated = true;
          break;
        }
      }

      if (!dominated) {
        front.push({ index: i, scores: alternatives[i] });
      }
    }

    return front;
  }

  // a dominates b if a is at least as good in all dimensions and strictly better in one
  _dominates(a, b) {
    let strictlyBetter = false;
    for (let k = 0; k < a.scores.length; k++) {
      if (a.scores[k] < b.scores[k]) return false;
      if (a.scores[k] > b.scores[k]) strictlyBetter = true;
    }
    return strictlyBetter;
  }

  // Select from Pareto front using φ-weighted distance to ideal point
  selectBest(front, weights) {
    if (front.length === 0) return null;
    if (front.length === 1) return front[0];

    // Ideal point = max in each dimension
    const dims = front[0].scores.length;
    const ideal = new Array(dims).fill(0);
    for (const alt of front) {
      for (let d = 0; d < dims; d++) {
        ideal[d] = Math.max(ideal[d], alt.scores[d]);
      }
    }

    // φ-weighted Euclidean distance to ideal
    let bestDist = Infinity;
    let bestAlt = null;

    for (const alt of front) {
      let dist = 0;
      for (let d = 0; d < dims; d++) {
        const w = weights ? weights[d] : Math.pow(PHI, -(d));
        dist += w * Math.pow(ideal[d] - alt.scores[d], 2);
      }
      dist = Math.sqrt(dist);
      if (dist < bestDist) {
        bestDist = dist;
        bestAlt = alt;
      }
    }

    return bestAlt;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  CONDORCET VOTING ENGINE
// ══════════════════════════════════════════════════════════════════════════════

class CondorcetVotingEngine {
  // Determine Condorcet winner from pairwise preferences
  // preferences[voter][i][j] = true if voter prefers alternative i over j
  findWinner(preferences, numAlternatives) {
    // Build pairwise victory matrix
    const victories = Array.from(
      { length: numAlternatives },
      () => new Array(numAlternatives).fill(0)
    );

    for (const voterPrefs of preferences) {
      for (let i = 0; i < numAlternatives; i++) {
        for (let j = 0; j < numAlternatives; j++) {
          if (i === j) continue;
          if (voterPrefs[i][j]) {
            victories[i][j]++;
          }
        }
      }
    }

    // Condorcet winner beats every other alternative in pairwise comparison
    const numVoters = preferences.length;
    const majority = numVoters / 2;

    for (let candidate = 0; candidate < numAlternatives; candidate++) {
      let beatsAll = true;
      for (let opponent = 0; opponent < numAlternatives; opponent++) {
        if (candidate === opponent) continue;
        if (victories[candidate][opponent] <= majority) {
          beatsAll = false;
          break;
        }
      }
      if (beatsAll) {
        return { winner: candidate, method: 'CONDORCET_WINNER', victories };
      }
    }

    // No Condorcet winner — fall back to Copeland score (most pairwise wins)
    return this._copelandFallback(victories, numAlternatives, majority);
  }

  _copelandFallback(victories, numAlternatives, majority) {
    const scores = new Array(numAlternatives).fill(0);

    for (let i = 0; i < numAlternatives; i++) {
      for (let j = 0; j < numAlternatives; j++) {
        if (i === j) continue;
        if (victories[i][j] > majority) scores[i]++;
        else if (victories[i][j] === majority) scores[i] += 0.5;
      }
    }

    let bestScore = -1;
    let winner = 0;
    for (let i = 0; i < numAlternatives; i++) {
      if (scores[i] > bestScore) {
        bestScore = scores[i];
        winner = i;
      }
    }

    return { winner, method: 'COPELAND_FALLBACK', scores, victories };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  BAYESIAN BELIEF RESOLVER
// ══════════════════════════════════════════════════════════════════════════════

class BayesianBeliefResolver {
  constructor() {
    this.priors = new Map(); // hypothesis → prior probability
  }

  // Set prior beliefs about resolution hypotheses
  setPriors(hypotheses) {
    // If no priors given, use maximum entropy (uniform)
    const n = hypotheses.length;
    for (const h of hypotheses) {
      this.priors.set(h.id, h.prior || 1.0 / n);
    }
  }

  // P(H|E) = P(E|H) · P(H) / P(E)
  // Update beliefs given evidence
  update(evidence) {
    const posteriors = new Map();

    // P(E) = Σ P(E|Hᵢ) · P(Hᵢ)
    let marginalLikelihood = 0;
    for (const [hId, prior] of this.priors) {
      const likelihood = evidence.likelihoods.get(hId) || 0;
      marginalLikelihood += likelihood * prior;
    }

    if (marginalLikelihood < 1e-15) {
      // No evidence distinguishes — return priors unchanged
      return new Map(this.priors);
    }

    // Bayes' theorem for each hypothesis
    for (const [hId, prior] of this.priors) {
      const likelihood = evidence.likelihoods.get(hId) || 0;
      const posterior = (likelihood * prior) / marginalLikelihood;
      posteriors.set(hId, posterior);
    }

    // Update priors for sequential evidence
    this.priors = posteriors;
    return posteriors;
  }

  // Find maximum a posteriori (MAP) hypothesis
  getMAP() {
    let maxProb = 0;
    let mapHypothesis = null;

    for (const [hId, prob] of this.priors) {
      if (prob > maxProb) {
        maxProb = prob;
        mapHypothesis = hId;
      }
    }

    return { hypothesis: mapHypothesis, probability: maxProb };
  }

  // Get confidence that MAP hypothesis is correct
  getConfidence() {
    const map = this.getMAP();
    // Confidence = P(MAP) / (1 - P(MAP)) — odds ratio
    return map.probability / (1 - map.probability + 1e-15);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  SHAPLEY VALUE CALCULATOR
// ══════════════════════════════════════════════════════════════════════════════

class ShapleyValueCalculator {
  // Compute Shapley values for fair attribution
  // coalitionValue(subset) returns the value of a coalition of agents
  compute(agents, coalitionValue) {
    const n = agents.length;
    const shapleyValues = new Map();

    for (let i = 0; i < n; i++) {
      let value = 0;
      const otherAgents = agents.filter((_, idx) => idx !== i);

      // Iterate over all subsets of other agents
      const numSubsets = 1 << (n - 1);
      for (let mask = 0; mask < numSubsets; mask++) {
        const subset = [];
        for (let j = 0; j < n - 1; j++) {
          if (mask & (1 << j)) {
            subset.push(otherAgents[j]);
          }
        }

        const subsetWithI = [...subset, agents[i]];
        const marginalContribution = coalitionValue(subsetWithI) - coalitionValue(subset);

        // Weight: |S|!(n-|S|-1)!/n!
        const s = subset.length;
        const weight = this._factorial(s) * this._factorial(n - s - 1) / this._factorial(n);
        value += weight * marginalContribution;
      }

      shapleyValues.set(agents[i], value);
    }

    return shapleyValues;
  }

  _factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  CONFLICT RECORD
// ══════════════════════════════════════════════════════════════════════════════

class ConflictRecord {
  constructor(id, type, parties, details) {
    this.id = id;
    this.type = type;
    this.parties = parties;         // agent keys involved
    this.details = details;         // conflict-specific data
    this.timestamp = Date.now();
    this.status = 'PENDING';
    this.resolution = null;
    this.verdict = null;
    this.evidence = [];
    this.deliberationLog = [];

    // Pythagorean conflict magnitude: d = √(Σ impact²)
    this.magnitude = this._computeMagnitude(details);
  }

  _computeMagnitude(details) {
    if (!details || !details.impacts) return 1.0;
    const impacts = Object.values(details.impacts);
    const sumSquares = impacts.reduce((sum, imp) => sum + imp * imp, 0);
    return Math.sqrt(sumSquares);
  }

  addEvidence(evidence) {
    this.evidence.push({ ...evidence, timestamp: Date.now() });
  }

  addDeliberation(entry) {
    this.deliberationLog.push({ ...entry, timestamp: Date.now() });
  }

  resolve(resolution, verdict) {
    this.resolution = resolution;
    this.verdict = verdict;
    this.status = verdict;
    this.resolvedAt = Date.now();
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ALPHA ARBITER — MASTER CLASS
// ══════════════════════════════════════════════════════════════════════════════

class AlphaArbiter {
  constructor(config = {}) {
    this.id = 'AGT-049';
    this.name = 'Alpha Arbiter';
    this.version = '1.0.0';
    this.status = 'INITIALIZING';

    // Resolution engines
    this.nashSolver = new NashEquilibriumSolver();
    this.paretoEngine = new ParetoEngine();
    this.condorcetEngine = new CondorcetVotingEngine();
    this.bayesianResolver = new BayesianBeliefResolver();
    this.shapleyCalculator = new ShapleyValueCalculator();

    // State
    this.activeConflicts = new Map();
    this.resolvedConflicts = [];
    this.conflictCounter = 0;
    this.trustScores = new Map();

    // Initialize trust scores from base authority
    for (const [key, agent] of Object.entries(AGENT_AUTHORITY)) {
      this.trustScores.set(key, agent.baseAuthority);
    }

    // Configuration
    this.config = {
      maxActiveConflicts: config.maxActiveConflicts || FIB[7],  // 21
      escalationThreshold: config.escalationThreshold || PHI_SQ,
      confidenceRequired: config.confidenceRequired || EMERGENCE_THRESHOLD,
      maxResolutionHistory: config.maxResolutionHistory || FIB[10],
      ...config,
    };

    this.status = 'ACTIVE';
    this._log('ARBITER AWAKENED — Justice system operational');
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  // File a new conflict for resolution
  fileConflict(type, parties, details) {
    const id = `CONF-${++this.conflictCounter}-${Date.now().toString(36)}`;
    const conflict = new ConflictRecord(id, type, parties, details);

    this.activeConflicts.set(id, conflict);
    this._log(`Conflict filed: ${id} [${type}] between ${parties.join(' vs ')}`);

    // Auto-select resolution strategy based on conflict type
    const strategy = this._selectStrategy(type, conflict.magnitude, parties);
    conflict.addDeliberation({
      phase: 'STRATEGY_SELECTION',
      strategy,
      reason: `Type=${type}, Magnitude=${conflict.magnitude.toFixed(3)}`,
    });

    return { id, strategy };
  }

  // Resolve a conflict using the determined strategy
  resolve(conflictId, additionalEvidence) {
    const conflict = this.activeConflicts.get(conflictId);
    if (!conflict) return { error: 'Conflict not found' };

    if (additionalEvidence) {
      conflict.addEvidence(additionalEvidence);
    }

    const strategy = conflict.deliberationLog[0]?.strategy || RESOLUTION_STRATEGY.AUTHORITY_CASCADE;

    let resolution;
    switch (strategy) {
      case RESOLUTION_STRATEGY.NASH_EQUILIBRIUM:
        resolution = this._resolveNash(conflict);
        break;
      case RESOLUTION_STRATEGY.PARETO_OPTIMAL:
        resolution = this._resolvePareto(conflict);
        break;
      case RESOLUTION_STRATEGY.CONDORCET_VOTE:
        resolution = this._resolveCondorcet(conflict);
        break;
      case RESOLUTION_STRATEGY.BAYESIAN_UPDATE:
        resolution = this._resolveBayesian(conflict);
        break;
      case RESOLUTION_STRATEGY.AUTHORITY_CASCADE:
        resolution = this._resolveAuthority(conflict);
        break;
      case RESOLUTION_STRATEGY.SHAPLEY_SPLIT:
        resolution = this._resolveShapley(conflict);
        break;
      case RESOLUTION_STRATEGY.PYTHAGOREAN_MERGE:
        resolution = this._resolvePythagorean(conflict);
        break;
      default:
        resolution = this._resolveAuthority(conflict);
    }

    // Finalize
    conflict.resolve(resolution, resolution.verdict);
    this.activeConflicts.delete(conflictId);
    this.resolvedConflicts.push(conflict);

    // Trim history
    if (this.resolvedConflicts.length > this.config.maxResolutionHistory) {
      this.resolvedConflicts.shift();
    }

    // Update trust scores based on resolution
    this._updateTrust(conflict, resolution);

    this._log(`Conflict ${conflictId} resolved: ${resolution.verdict}`);
    return resolution;
  }

  // Get current arbiter status
  getStatus() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      activeConflicts: this.activeConflicts.size,
      totalResolved: this.resolvedConflicts.length,
      trustScores: Object.fromEntries(this.trustScores),
    };
  }

  // Get φ-weighted authority for a specific agent
  getAuthority(agentKey) {
    const base = AGENT_AUTHORITY[agentKey];
    if (!base) return 0;
    const trust = this.trustScores.get(agentKey) || 1;
    // A(agent) = base × φ^(trust_level)
    return base.baseAuthority * Math.pow(PHI, trust / base.baseAuthority);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  RESOLUTION METHODS
  // ────────────────────────────────────────────────────────────────────────────

  _resolveNash(conflict) {
    const parties = conflict.parties;
    const numStrategies = conflict.details.alternatives?.length || 3;

    // Build payoff matrices from conflict details
    const payoffMatrices = parties.map((party, pIdx) => {
      const matrix = [];
      for (let i = 0; i < numStrategies; i++) {
        for (let j = 0; j < numStrategies; j++) {
          // Payoff based on agent authority and strategy alignment
          const authority = this.getAuthority(party);
          const basePayoff = conflict.details.payoffs?.[pIdx]?.[i * numStrategies + j] || 0;
          matrix.push(basePayoff * (authority / PHI_CUBE));
        }
      }
      return matrix;
    });

    const result = this.nashSolver.solve(payoffMatrices, numStrategies);

    // The equilibrium strategy with highest probability wins
    const equilibriumStrategy = result.strategies[0] || [];
    const chosenAlternative = equilibriumStrategy.indexOf(Math.max(...equilibriumStrategy));

    return {
      verdict: result.converged ? VERDICT.RESOLVED : VERDICT.PARTIAL,
      strategy: RESOLUTION_STRATEGY.NASH_EQUILIBRIUM,
      winner: chosenAlternative,
      equilibrium: result.strategies,
      converged: result.converged,
      iterations: result.iteration,
    };
  }

  _resolvePareto(conflict) {
    const alternatives = conflict.details.alternatives || [];

    // Each alternative scored from each agent's perspective
    const scoredAlternatives = alternatives.map(alt => ({
      scores: conflict.parties.map(party => {
        const authority = this.getAuthority(party);
        return (alt.scores?.[party] || 0) * authority;
      }),
    }));

    const front = this.paretoEngine.findParetoFront(scoredAlternatives);

    // φ-weighted selection from Pareto front
    const weights = conflict.parties.map((party, i) =>
      Math.pow(PHI, -(i))
    );
    const best = this.paretoEngine.selectBest(front, weights);

    return {
      verdict: best ? VERDICT.RESOLVED : VERDICT.DEADLOCKED,
      strategy: RESOLUTION_STRATEGY.PARETO_OPTIMAL,
      winner: best?.index,
      paretoFront: front.map(f => f.index),
      paretoSize: front.length,
    };
  }

  _resolveCondorcet(conflict) {
    const numAlternatives = conflict.details.alternatives?.length || 2;

    // Each agent votes based on their preference ordering
    const preferences = conflict.parties.map(party => {
      const prefs = Array.from(
        { length: numAlternatives },
        () => new Array(numAlternatives).fill(false)
      );

      // Authority-weighted preference
      const agentPrefs = conflict.details.preferences?.[party] || [];
      for (let i = 0; i < numAlternatives; i++) {
        for (let j = 0; j < numAlternatives; j++) {
          if (i === j) continue;
          const prefI = agentPrefs[i] || 0;
          const prefJ = agentPrefs[j] || 0;
          prefs[i][j] = prefI > prefJ;
        }
      }
      return prefs;
    });

    const result = this.condorcetEngine.findWinner(preferences, numAlternatives);

    return {
      verdict: VERDICT.RESOLVED,
      strategy: RESOLUTION_STRATEGY.CONDORCET_VOTE,
      winner: result.winner,
      method: result.method,
      scores: result.scores,
    };
  }

  _resolveBayesian(conflict) {
    const hypotheses = conflict.details.hypotheses || conflict.details.alternatives || [];

    // Set priors based on agent authority
    this.bayesianResolver.setPriors(
      hypotheses.map((h, i) => ({
        id: h.id || `H${i}`,
        prior: h.prior || 1.0 / hypotheses.length,
      }))
    );

    // Process each piece of evidence
    for (const evidence of conflict.evidence) {
      if (evidence.likelihoods) {
        this.bayesianResolver.update(evidence);
      }
    }

    const map = this.bayesianResolver.getMAP();
    const confidence = this.bayesianResolver.getConfidence();

    const resolved = confidence >= this.config.confidenceRequired;

    return {
      verdict: resolved ? VERDICT.RESOLVED : VERDICT.PARTIAL,
      strategy: RESOLUTION_STRATEGY.BAYESIAN_UPDATE,
      winner: map.hypothesis,
      probability: map.probability,
      confidence,
      confidenceRequired: this.config.confidenceRequired,
    };
  }

  _resolveAuthority(conflict) {
    // Highest φ-weighted authority decides
    let maxAuthority = 0;
    let decidingAgent = null;

    for (const party of conflict.parties) {
      const authority = this.getAuthority(party);
      if (authority > maxAuthority) {
        maxAuthority = authority;
        decidingAgent = party;
      }
    }

    // The deciding agent's preferred alternative wins
    const preference = conflict.details.preferences?.[decidingAgent]?.[0] || 0;

    return {
      verdict: VERDICT.RESOLVED,
      strategy: RESOLUTION_STRATEGY.AUTHORITY_CASCADE,
      winner: preference,
      decidingAgent,
      authority: maxAuthority,
    };
  }

  _resolveShapley(conflict) {
    const parties = conflict.parties;
    const totalValue = conflict.details.contestedValue || 1.0;

    // Coalition value function
    const coalitionValue = (coalition) => {
      if (coalition.length === 0) return 0;
      // Value scales with combined authority
      let combinedAuthority = 0;
      for (const agent of coalition) {
        combinedAuthority += this.getAuthority(agent);
      }
      // Diminishing returns via φ
      return totalValue * (1 - Math.pow(PHI_INV, combinedAuthority / PHI_CUBE));
    };

    const shapleyValues = this.shapleyCalculator.compute(parties, coalitionValue);

    // Normalize to distribute total contested value
    const totalShapley = Array.from(shapleyValues.values()).reduce((a, b) => a + b, 0);
    const allocation = new Map();
    for (const [agent, value] of shapleyValues) {
      allocation.set(agent, totalShapley > 0 ? (value / totalShapley) * totalValue : totalValue / parties.length);
    }

    return {
      verdict: VERDICT.RESOLVED,
      strategy: RESOLUTION_STRATEGY.SHAPLEY_SPLIT,
      allocation: Object.fromEntries(allocation),
      shapleyValues: Object.fromEntries(shapleyValues),
    };
  }

  _resolvePythagorean(conflict) {
    // Merge all outputs orthogonally
    // Each agent's output treated as a dimension; result is the normalized vector sum
    const outputs = conflict.details.outputs || {};
    const parties = conflict.parties;

    // Pythagorean merge: result = √(Σ output²) per dimension
    const dimensions = conflict.details.dimensions || 1;
    const merged = new Array(dimensions).fill(0);

    for (const party of parties) {
      const output = outputs[party] || new Array(dimensions).fill(0);
      const weight = this.getAuthority(party) / PHI_CUBE; // normalize weight

      for (let d = 0; d < dimensions; d++) {
        merged[d] += weight * (output[d] || 0);
      }
    }

    // Normalize by Pythagorean magnitude
    const magnitude = Math.sqrt(merged.reduce((sum, v) => sum + v * v, 0));
    const normalized = magnitude > 0 ? merged.map(v => v / magnitude) : merged;

    return {
      verdict: VERDICT.RESOLVED,
      strategy: RESOLUTION_STRATEGY.PYTHAGOREAN_MERGE,
      merged: normalized,
      magnitude,
      contributions: parties.map(p => ({
        agent: p,
        weight: this.getAuthority(p) / PHI_CUBE,
      })),
    };
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  STRATEGY SELECTION
  // ────────────────────────────────────────────────────────────────────────────

  _selectStrategy(conflictType, magnitude, parties) {
    // Strategy selection based on conflict nature and severity
    switch (conflictType) {
      case CONFLICT_TYPE.OUTPUT_CONTRADICTION:
        return magnitude > PHI ? RESOLUTION_STRATEGY.BAYESIAN_UPDATE : RESOLUTION_STRATEGY.PYTHAGOREAN_MERGE;

      case CONFLICT_TYPE.RESOURCE_CONTENTION:
        return RESOLUTION_STRATEGY.SHAPLEY_SPLIT;

      case CONFLICT_TYPE.AUTHORITY_OVERLAP:
        return RESOLUTION_STRATEGY.AUTHORITY_CASCADE;

      case CONFLICT_TYPE.PRIORITY_DEADLOCK:
        return RESOLUTION_STRATEGY.NASH_EQUILIBRIUM;

      case CONFLICT_TYPE.TEMPORAL_CONFLICT:
        return RESOLUTION_STRATEGY.CONDORCET_VOTE;

      case CONFLICT_TYPE.SEMANTIC_DIVERGENCE:
        return parties.length > 2 ? RESOLUTION_STRATEGY.CONDORCET_VOTE : RESOLUTION_STRATEGY.PARETO_OPTIMAL;

      default:
        return RESOLUTION_STRATEGY.AUTHORITY_CASCADE;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  TRUST UPDATES
  // ────────────────────────────────────────────────────────────────────────────

  _updateTrust(conflict, resolution) {
    // Winning party gains trust, φ-scaled
    if (resolution.decidingAgent) {
      const current = this.trustScores.get(resolution.decidingAgent) || PHI;
      this.trustScores.set(resolution.decidingAgent, current * (1 + PHI_INV * 0.01));
    }

    // All parties get slight trust increase for participating in resolution
    for (const party of conflict.parties) {
      const current = this.trustScores.get(party) || PHI;
      this.trustScores.set(party, current * (1 + PHI_INV * 0.001));
    }
  }

  _log(message) {
    const timestamp = new Date().toISOString();
    console.log(`⚖️ [ARBITER ${timestamp}] ${message}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export {
  AlphaArbiter,
  NashEquilibriumSolver,
  ParetoEngine,
  CondorcetVotingEngine,
  BayesianBeliefResolver,
  ShapleyValueCalculator,
  ConflictRecord,
  CONFLICT_TYPE,
  RESOLUTION_STRATEGY,
  VERDICT,
  AGENT_AUTHORITY,
  PHI,
  PHI_INV,
  PHI_SQ,
  PHI_CUBE,
  GOLDEN_ANGLE,
  HEARTBEAT_MS,
  EMERGENCE_THRESHOLD,
  FIB,
};

export default AlphaArbiter;
