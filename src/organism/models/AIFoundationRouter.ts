///
/// AI FOUNDATION ROUTER — Intelligence Wire Routing Engine
///
/// This is the routing brain for the 40 AI Foundation models.
/// Given a task (required capabilities, preferred ring, modality),
/// the router scores every model using golden-ratio mathematics
/// and returns the best match with alternatives.
///
/// Scoring formula:
///   S(m) = φ^(4−p) × C(m) × R(m) × Ctx(m)
///
///   where:
///     φ^(4−p)  = priority weight (P0 → φ⁴, P3 → φ¹)
///     C(m)     = capability match ratio (matched / required) × φ
///     R(m)     = ring match bonus (φ if ring matches, 1.0 otherwise)
///     Ctx(m)   = context ratio bonus: min(1, log_φ(context/1000) / 10)
///
/// Wire dispatch:
///   Each model has a wire protocol (e.g., "intelligence-wire/openai").
///   The router establishes WireState connections with Kuramoto-coupled
///   resonance tracking per model.
///
/// Multi-model fusion:
///   When a task requires multiple modalities, the router can compose
///   a chain of models, scoring each by its specialty and weighting
///   the chain by φ-decay: model_0 × φ⁰ + model_1 × φ⁻¹ + ...
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

import {
  AIFoundationRegistry,
  OrganismRing,
  RoutingPriority,
  type AIFoundationModel,
  type RoutingResult,
  type WireState,
  type Modality,
} from './AIFoundationModels.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;
const TWO_PI      = 2 * Math.PI;
const HEARTBEAT_MS = 873;   // Organism heartbeat: 1000 / φ × √φ ≈ 873ms

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface RoutingRequest {
  readonly requiredCapabilities: readonly string[];
  readonly preferredRing?: OrganismRing;
  readonly preferredModality?: Modality;
  readonly minPriority?: RoutingPriority;
  readonly requireActive?: boolean;
}

export interface FusionChain {
  readonly chainId: string;
  readonly models: readonly AIFoundationModel[];
  readonly phiWeights: readonly number[];
  readonly totalScore: number;
  readonly modalities: readonly Modality[];
  readonly timestamp: number;
}

export interface RouterStatus {
  readonly totalModels: number;
  readonly activeWires: number;
  readonly totalRoutes: number;
  readonly totalFusions: number;
  readonly averageLatency: number;
  readonly kuramotoR: number;       // Order parameter — cross-model sync
  readonly goldenWeight: number;
}

// ══════════════════════════════════════════════════════════════════
//  AI FOUNDATION ROUTER — The Intelligence Wire
// ══════════════════════════════════════════════════════════════════

export class AIFoundationRouter {
  readonly name = 'AI FOUNDATION ROUTER';
  readonly designation = 'Router Intelligentiae — Golden-Ratio Model Selection Engine';

  readonly registry: AIFoundationRegistry;
  private readonly wires: Map<string, WireState> = new Map();
  private totalRoutes = 0;
  private totalFusions = 0;
  private nextChainId = 0;

  constructor() {
    this.registry = new AIFoundationRegistry();

    // Initialize wire states for all models — Kuramoto-coupled
    for (let i = 0; i < this.registry.models.length; i++) {
      const model = this.registry.models[i];
      this.wires.set(model.familyId, {
        modelId: model.familyId,
        wireProtocol: model.wireProtocol,
        connected: model.status === 'active',
        latencyMs: HEARTBEAT_MS * Math.pow(PHI_INVERSE, model.priority),
        throughput: Math.pow(PHI, 4 - model.priority),
        resonance: Math.cos(i * GOLDEN_ANGLE),  // Initial Kuramoto phase coupling
        lastPulse: Date.now(),
      });
    }
  }

  // ── Core Routing ───────────────────────────────────────────────

  /**
   * Route to the best model for a given request.
   *
   * S(m) = φ^(4−p) × C(m) × R(m) × Ctx(m)
   */
  route(request: RoutingRequest): RoutingResult {
    this.totalRoutes++;

    const candidates = this.registry.models.filter(m => {
      if (request.requireActive !== false && m.status !== 'active') return false;
      if (request.minPriority !== undefined && m.priority > request.minPriority) return false;
      return true;
    });

    const scored = candidates.map(model => ({
      model,
      score: this.scoreModel(model, request),
    }));

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    const selected = scored[0];
    const alternatives = scored.slice(1, 4).map(s => s.model);

    return {
      selectedModel: selected.model,
      score: selected.score,
      capabilityMatch: this.capabilityMatchRatio(
        selected.model.secondaryCapabilities,
        request.requiredCapabilities,
      ),
      priorityWeight: selected.model.phiPriorityWeight,
      ringMatch: request.preferredRing === undefined || selected.model.ring === request.preferredRing,
      alternatives,
      timestamp: Date.now(),
    };
  }

  /**
   * Score a single model against a routing request.
   *
   * S(m) = φ^(4−p) × C(m) × R(m) × Ctx(m)
   */
  scoreModel(model: AIFoundationModel, request: RoutingRequest): number {
    // Priority weight: φ^(4−p)
    const pw = model.phiPriorityWeight;

    // Capability match: (matched / required) × φ, min 1/φ for any active model
    const capMatch = Math.max(
      PHI_INVERSE,
      this.capabilityMatchRatio(model.secondaryCapabilities, request.requiredCapabilities) * PHI,
    );

    // Ring match: φ bonus if ring matches, 1.0 otherwise
    const ringBonus = (request.preferredRing === undefined || model.ring === request.preferredRing)
      ? PHI
      : 1.0;

    // Modality match: φ bonus if modality matches
    const modalityBonus = (request.preferredModality === undefined || model.modality === request.preferredModality)
      ? PHI
      : 1.0;

    // Context capacity: min(1, contextCapacityRatio / 10) as a gentle bonus
    const ctxBonus = Math.min(1.0, Math.max(0.1, model.contextCapacityRatio / 10));

    return pw * capMatch * ringBonus * modalityBonus * (1 + ctxBonus);
  }

  /**
   * Capability match ratio: how many required capabilities this model has.
   * Returns 0..1 where 1 = perfect match.
   */
  capabilityMatchRatio(
    modelCapabilities: readonly string[],
    required: readonly string[],
  ): number {
    if (required.length === 0) return 1.0;

    const modelSet = new Set(modelCapabilities.map(c => c.toLowerCase()));
    let matched = 0;

    for (const req of required) {
      const reqLower = req.toLowerCase();
      // Check for exact match or substring containment
      for (const cap of modelSet) {
        if (cap.includes(reqLower) || reqLower.includes(cap)) {
          matched++;
          break;
        }
      }
    }

    return matched / required.length;
  }

  // ── Multi-Model Fusion ─────────────────────────────────────────

  /**
   * Compose a chain of models for multi-modal tasks.
   * Each model in the chain gets φ^(−position) weight.
   * Total score = Σ φ^(−i) × model_score
   */
  fuse(requests: readonly RoutingRequest[]): FusionChain {
    this.totalFusions++;

    const models: AIFoundationModel[] = [];
    const phiWeights: number[] = [];
    let totalScore = 0;

    for (let i = 0; i < requests.length; i++) {
      const result = this.route(requests[i]);
      const weight = Math.pow(PHI, -i);

      models.push(result.selectedModel);
      phiWeights.push(weight);
      totalScore += weight * result.score;
    }

    return {
      chainId: `CHAIN-${this.nextChainId++}`,
      models,
      phiWeights,
      totalScore,
      modalities: models.map(m => m.modality),
      timestamp: Date.now(),
    };
  }

  // ── Wire Management ────────────────────────────────────────────

  /** Get wire state for a model */
  getWire(modelId: string): WireState | undefined {
    return this.wires.get(modelId);
  }

  /** Get all active wires */
  activeWires(): WireState[] {
    return Array.from(this.wires.values()).filter(w => w.connected);
  }

  /** Pulse all wires — advance Kuramoto coupling by one heartbeat */
  pulse(): void {
    const now = Date.now();
    const N = this.wires.size;
    const K = PHI;  // Coupling constant = φ

    // Compute mean field (Kuramoto order parameter)
    let sumCos = 0;
    let sumSin = 0;
    for (const wire of this.wires.values()) {
      sumCos += Math.cos(wire.resonance * TWO_PI);
      sumSin += Math.sin(wire.resonance * TWO_PI);
    }

    const R = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
    const meanPhase = Math.atan2(sumSin, sumCos);

    // Update each wire's resonance toward mean field
    for (const [id, wire] of this.wires.entries()) {
      const omega = Math.pow(PHI, -(Array.from(this.wires.keys()).indexOf(id) % 5));
      const phase = wire.resonance * TWO_PI;
      const dPhase = omega + (K / N) * R * Math.sin(meanPhase - phase);
      const newResonance = ((phase + dPhase * 0.01) % TWO_PI) / TWO_PI;

      this.wires.set(id, {
        ...wire,
        resonance: Math.abs(newResonance),
        lastPulse: now,
      });
    }
  }

  /** Compute Kuramoto order parameter R across all wires */
  kuramotoOrderParameter(): number {
    const N = this.wires.size;
    let sumCos = 0;
    let sumSin = 0;

    for (const wire of this.wires.values()) {
      sumCos += Math.cos(wire.resonance * TWO_PI);
      sumSin += Math.sin(wire.resonance * TWO_PI);
    }

    return Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
  }

  /** Average latency across all active wires */
  averageLatency(): number {
    const active = this.activeWires();
    if (active.length === 0) return 0;
    return active.reduce((sum, w) => sum + w.latencyMs, 0) / active.length;
  }

  // ── Ring Intelligence Queries ──────────────────────────────────

  /** Get the strongest model in a ring (highest φ-priority) */
  ringAlpha(ring: OrganismRing): AIFoundationModel | undefined {
    const ringModels = this.registry.byRing(ring);
    if (ringModels.length === 0) return undefined;
    return ringModels.reduce((best, m) =>
      m.phiPriorityWeight > best.phiPriorityWeight ? m : best,
    );
  }

  /** Get all P0 (primary alpha) models — the golden core */
  goldenCore(): AIFoundationModel[] {
    return this.registry.byPriority(RoutingPriority.P0);
  }

  /** Route by natural language: match capabilities against request text */
  routeByText(text: string): RoutingResult {
    // Tokenize text into capability keywords
    const words = text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);

    return this.route({
      requiredCapabilities: words,
    });
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): RouterStatus {
    return {
      totalModels: this.registry.totalModels,
      activeWires: this.activeWires().length,
      totalRoutes: this.totalRoutes,
      totalFusions: this.totalFusions,
      averageLatency: this.averageLatency(),
      kuramotoR: this.kuramotoOrderParameter(),
      goldenWeight: this.registry.totalGoldenWeight(),
    };
  }
}
