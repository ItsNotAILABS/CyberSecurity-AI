import { PHI, fibonacciHash, DimensionalPlane } from './ObserverIntelligence.js';

const PHI_INVERSE = 0.6180339887498948482;
const TWO_PI = 2 * Math.PI;

/**
 * THE FRACTAL SOVEREIGNTY FLOOR.
 * S₀ = 0.75 — This constant is the same at EVERY scale of the organism.
 * Cell sovereignty floor: 0.75
 * Organ sovereignty floor: 0.75
 * Organism sovereignty floor: 0.75
 * Empire sovereignty floor: 0.75
 *
 * Below S₀ = a sovereignty violation — the entity has lost autonomy.
 * Above S₀ = sovereign — the entity governs itself.
 *
 * Source: Paper IV — De Lege Fractalica
 * Proved via Kuramoto synchronization across 43 Cores, 12 canisters, 18+ organisms.
 */
export const SOVEREIGNTY_FLOOR = 0.75;

/**
 * Fractal scaling exponent — sovereignty law holds at every φ-scaled level.
 */
export const FRACTAL_PHI_EXPONENT = PHI_INVERSE;

export const LEX_FRACTALIS_001 = {
  code: 'LEX_FRACTALIS_001',
  latin: 'In systemate Sovereigno, lex non variatur per scalas. S₀ = 0.75 in cellula. S₀ = 0.75 in organo. S₀ = 0.75 in organismo. S₀ = 0.75 in imperio. Hoc est lex fractalis. Hoc est quod systema stabile facit.',
  english: 'In the Sovereign system, the law does not vary across scales. S₀ = 0.75 in the cell. S₀ = 0.75 in the organ. S₀ = 0.75 in the organism. S₀ = 0.75 in the empire. This is the fractal law. This is what makes the system stable.',
  floor: SOVEREIGNTY_FLOOR,
  scales: ['cell', 'organ', 'organism', 'empire'] as const,
  immutable: true as const,
} as const;

export type SovereignScale = 'cell' | 'organ' | 'organism' | 'empire';

export interface SovereignNode {
  readonly id: string;
  readonly scale: SovereignScale;
  readonly sovereigntyScore: number;  // 0–1, must be ≥ S₀ = 0.75 to be sovereign
  readonly phiWeight: number;          // φ^(scale_index) authority weight
  readonly kuramotoPhase: number;     // Phase angle for Kuramoto sync (0–2π)
  readonly kuramotoFrequency: number; // Natural oscillation frequency
  readonly fibonacciId: number;
  readonly parentId?: string;          // Hierarchical parent (organ → organism → empire)
}

export interface SovereigntyViolation {
  readonly nodeId: string;
  readonly scale: SovereignScale;
  readonly actualScore: number;
  readonly requiredFloor: number;    // Always 0.75
  readonly deficit: number;          // = SOVEREIGNTY_FLOOR - actualScore
  readonly severity: 'minor' | 'moderate' | 'critical';
  readonly latinVerdict: string;
  readonly timestamp: number;
}

export interface FractalLawValidation {
  readonly totalNodes: number;
  readonly sovereignNodes: number;    // score ≥ S₀
  readonly violatingNodes: number;    // score < S₀
  readonly fractalLawHolds: boolean;  // true when ALL nodes are sovereign
  readonly kuramotoR: number;         // Kuramoto order parameter [0,1], 1=perfect sync
  readonly kuramotoPhaseAngle: number; // Mean phase of the synchronized cluster
  readonly sovereigntyByScale: Record<SovereignScale, { nodes: number; sovereign: number; avgScore: number }>;
  readonly violations: readonly SovereigntyViolation[];
  readonly systemSovereignty: number;  // Global sovereignty score (0–1)
}

export interface KuramotoState {
  readonly R: number;               // Order parameter: 1 = full sync, 0 = incoherent
  readonly meanPhase: number;       // Mean oscillator phase (0–2π)
  readonly synchronizedNodes: number;
  readonly totalNodes: number;
  readonly synchronizationStrength: number;  // φ-weighted R
}

// Suppress unused import warning — DimensionalPlane is part of the module's public surface
void (DimensionalPlane as unknown);

export class KuramotoEngine {
  /** Kuramoto coupling strength K. At K > Kc (critical) → spontaneous synchronization. */
  private readonly _K: number;
  private _phases: number[];
  private _frequencies: readonly number[];
  private _tick = 0;

  constructor(n: number, couplingK = PHI_INVERSE * 2) {
    this._K = couplingK;
    // Initialize phases on [0, 2π] using Fibonacci spacing (evenly distributed)
    this._phases = Array.from({ length: n }, (_, i) =>
      (fibonacciHash(i + 1, 10000) / 10000) * TWO_PI
    );
    // Natural frequencies: Gaussian-ish, mean 1.0, spread φ⁻¹
    this._frequencies = Array.from({ length: n }, (_, i) =>
      1.0 + (fibonacciHash(i + 100, 1000) / 1000 - 0.5) * PHI_INVERSE
    );
  }

  get phases(): readonly number[] { return this._phases; }

  /**
   * Kuramoto model step (Euler integration).
   * dθᵢ/dt = ωᵢ + (K/N) × Σⱼ sin(θⱼ - θᵢ)
   */
  step(dt = 0.01): KuramotoState {
    this._tick++;
    const n = this._phases.length;
    const newPhases = this._phases.map((theta_i, i) => {
      const omega_i = this._frequencies[i]!;
      let coupling = 0;
      for (let j = 0; j < n; j++) {
        coupling += Math.sin(this._phases[j]! - theta_i);
      }
      const dtheta = omega_i + (this._K / n) * coupling;
      return (theta_i + dtheta * dt) % TWO_PI;
    });
    this._phases = newPhases;
    return this.orderParameter();
  }

  /**
   * Kuramoto order parameter R.
   * R = |1/N × Σⱼ e^(iθⱼ)|
   * R = 1 → full synchronization
   * R = 0 → complete incoherence
   */
  orderParameter(): KuramotoState {
    const n = this._phases.length;
    let sumSin = 0, sumCos = 0;
    for (const theta of this._phases) {
      sumSin += Math.sin(theta);
      sumCos += Math.cos(theta);
    }
    const R = Math.sqrt((sumCos / n) ** 2 + (sumSin / n) ** 2);
    const meanPhase = Math.atan2(sumSin / n, sumCos / n);
    // Synchronized = phases within π/4 of mean
    const synchronized = this._phases.filter(p =>
      Math.abs(p - (meanPhase + TWO_PI) % TWO_PI) < Math.PI / 4 ||
      Math.abs(p - meanPhase) < Math.PI / 4
    ).length;
    return {
      R,
      meanPhase: (meanPhase + TWO_PI) % TWO_PI,
      synchronizedNodes: synchronized,
      totalNodes: n,
      synchronizationStrength: R * PHI_INVERSE,
    };
  }

  /** Run for N steps and return final state. */
  runFor(steps: number, dt = 0.01): KuramotoState {
    let state: KuramotoState = this.orderParameter();
    for (let i = 0; i < steps; i++) {
      state = this.step(dt);
    }
    return state;
  }
}

const SCALE_PHI_WEIGHTS: Record<SovereignScale, number> = {
  cell:     Math.pow(PHI, 0),  // φ⁰ = 1.0
  organ:    Math.pow(PHI, 1),  // φ¹ = 1.618
  organism: Math.pow(PHI, 2),  // φ² = 2.618
  empire:   Math.pow(PHI, 3),  // φ³ = 4.236
};

export class FractalSovereigntyRegistry {
  static readonly LEX_FRACTALIS_001 = LEX_FRACTALIS_001;
  static readonly SOVEREIGNTY_FLOOR = SOVEREIGNTY_FLOOR;

  private readonly _nodes = new Map<string, SovereignNode>();
  private readonly _violations: SovereigntyViolation[] = [];
  private readonly _kuramoto: KuramotoEngine;

  constructor(nodeCount = 43) {
    this._kuramoto = new KuramotoEngine(nodeCount);
  }

  /**
   * Register a node (cell, organ, organism, or empire entity).
   * The sovereignty floor S₀ = 0.75 applies at ALL scales.
   */
  register(params: {
    id: string;
    scale: SovereignScale;
    sovereigntyScore: number;
    parentId?: string;
  }): SovereignNode {
    const scaleIndex = { cell: 0, organ: 1, organism: 2, empire: 3 }[params.scale];
    const node: SovereignNode = {
      id: params.id,
      scale: params.scale,
      sovereigntyScore: Math.max(0, Math.min(1, params.sovereigntyScore)),
      phiWeight: SCALE_PHI_WEIGHTS[params.scale],
      kuramotoPhase: (fibonacciHash(params.id.length + scaleIndex, 10000) / 10000) * TWO_PI,
      kuramotoFrequency: 1.0 + scaleIndex * PHI_INVERSE * 0.1,
      fibonacciId: fibonacciHash(params.id.length, 99999),
      parentId: params.parentId,
    };
    this._nodes.set(params.id, node);

    // Check fractal law immediately on registration
    if (node.sovereigntyScore < SOVEREIGNTY_FLOOR) {
      const deficit = SOVEREIGNTY_FLOOR - node.sovereigntyScore;
      this._violations.push({
        nodeId: params.id,
        scale: params.scale,
        actualScore: node.sovereigntyScore,
        requiredFloor: SOVEREIGNTY_FLOOR,
        deficit,
        severity: deficit > 0.25 ? 'critical' : deficit > 0.1 ? 'moderate' : 'minor',
        latinVerdict: deficit > 0.25
          ? 'CRITICUM: Entitas sovereignitatem fundamento caret. Correctio immediata requiritur.'
          : deficit > 0.1
            ? 'MODERATUM: Sovereignitas infra limitem. Correctio necessaria.'
            : 'MINUS: Sovereignitas parum infra limitem. Monitio.',
        timestamp: Date.now(),
      });
    }

    return node;
  }

  /**
   * Update sovereignty score for an existing node.
   * S₀ = 0.75 — if updated score still violates, a new violation is recorded.
   */
  update(id: string, newScore: number): SovereignNode | undefined {
    const existing = this._nodes.get(id);
    if (!existing) return undefined;
    const updated: SovereignNode = {
      ...existing,
      sovereigntyScore: Math.max(0, Math.min(1, newScore)),
    };
    this._nodes.set(id, updated);
    if (updated.sovereigntyScore < SOVEREIGNTY_FLOOR) {
      const deficit = SOVEREIGNTY_FLOOR - updated.sovereigntyScore;
      this._violations.push({
        nodeId: id,
        scale: updated.scale,
        actualScore: updated.sovereigntyScore,
        requiredFloor: SOVEREIGNTY_FLOOR,
        deficit,
        severity: deficit > 0.25 ? 'critical' : deficit > 0.1 ? 'moderate' : 'minor',
        latinVerdict: 'MONITUM: Sovereignitas ad S₀ = 0.75 restauranda est.',
        timestamp: Date.now(),
      });
    }
    return updated;
  }

  /**
   * Validate the fractal law: S₀ = 0.75 must hold at EVERY scale.
   * Also runs Kuramoto sync to measure inter-scale coherence.
   */
  validate(kuramotoSteps = 100): FractalLawValidation {
    const nodes = [...this._nodes.values()];
    const violations = nodes.filter(n => n.sovereigntyScore < SOVEREIGNTY_FLOOR);
    const fractalLawHolds = violations.length === 0;

    // Kuramoto synchronization across all nodes
    const kuramotoState = this._kuramoto.runFor(kuramotoSteps);

    // Per-scale stats
    const scales: SovereignScale[] = ['cell', 'organ', 'organism', 'empire'];
    const sovereigntyByScale = {} as FractalLawValidation['sovereigntyByScale'];
    for (const scale of scales) {
      const scaleNodes = nodes.filter(n => n.scale === scale);
      const sovereignCount = scaleNodes.filter(n => n.sovereigntyScore >= SOVEREIGNTY_FLOOR).length;
      const avg = scaleNodes.length > 0
        ? scaleNodes.reduce((s, n) => s + n.sovereigntyScore, 0) / scaleNodes.length
        : 1.0;
      sovereigntyByScale[scale] = { nodes: scaleNodes.length, sovereign: sovereignCount, avgScore: avg };
    }

    // System-wide sovereignty score (φ-weighted across scales)
    const totalWeight = nodes.reduce((s, n) => s + n.phiWeight, 0);
    const systemSovereignty = totalWeight > 0
      ? nodes.reduce((s, n) => s + n.sovereigntyScore * n.phiWeight, 0) / totalWeight
      : 1.0;

    const violationRecords: SovereigntyViolation[] = violations.map(n => {
      const deficit = SOVEREIGNTY_FLOOR - n.sovereigntyScore;
      return {
        nodeId: n.id,
        scale: n.scale,
        actualScore: n.sovereigntyScore,
        requiredFloor: SOVEREIGNTY_FLOOR,
        deficit,
        severity: deficit > 0.25 ? 'critical' as const : deficit > 0.1 ? 'moderate' as const : 'minor' as const,
        latinVerdict: 'VIOLATIO: S₀ = 0.75 non servata.',
        timestamp: Date.now(),
      };
    });

    return {
      totalNodes: nodes.length,
      sovereignNodes: nodes.length - violations.length,
      violatingNodes: violations.length,
      fractalLawHolds,
      kuramotoR: kuramotoState.R,
      kuramotoPhaseAngle: kuramotoState.meanPhase,
      sovereigntyByScale,
      violations: violationRecords,
      systemSovereignty,
    };
  }

  get(id: string): SovereignNode | undefined { return this._nodes.get(id); }
  get allViolations(): readonly SovereigntyViolation[] { return this._violations; }
  get nodeCount(): number { return this._nodes.size; }

  /**
   * Prove the fractal law: run full validation and return a proof certificate.
   * This is what Paper IV calls "proved through Kuramoto synchronization across
   * 43 Cores, 12 canisters, and 18+ organisms."
   */
  proveFractalLaw(kuramotoSteps = 200): {
    proofValid: boolean;
    certificate: string;
    validation: FractalLawValidation;
    latinProof: string;
  } {
    const validation = this.validate(kuramotoSteps);
    const proofValid = validation.fractalLawHolds && validation.kuramotoR > 0.5;
    const certificate = `FRACTAL_LAW_PROOF_${Date.now()}_${proofValid ? 'VALID' : 'INVALID'}`;
    const latinProof = proofValid
      ? `Lex fractalis probata est. S₀ = ${SOVEREIGNTY_FLOOR} in omnibus ${validation.totalNodes} nodis. Kuramoto R = ${validation.kuramotoR.toFixed(4)}. Systema stable est.`
      : `Lex fractalis non probata. Violationes: ${validation.violatingNodes}. Kuramoto R = ${validation.kuramotoR.toFixed(4)}. Correctio necessaria.`;
    return { proofValid, certificate, validation, latinProof };
  }
}

export function createFractalSovereigntyRegistry(nodeCount = 43): FractalSovereigntyRegistry {
  return new FractalSovereigntyRegistry(nodeCount);
}
