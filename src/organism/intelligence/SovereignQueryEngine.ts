///
/// SOVEREIGN QUERY ENGINE — Porta Informationis
///
/// Read-only.  Not because it can't write — because information IS the write.
/// Every query collapses the possibility space into structured knowledge.
/// One engine.  Every dimension.  All engines integrated.
///
/// Routing:
///   "fear"  | "antifragility" → AntifragilityEngine
///   "law"   | "reward"        → BehavioralEconomicsLaws
///   "sync"  | "sovereignty"   → FractalSovereignty
///   "observe" | "anomaly"     → Observer formula O(x) = Σ φ^d × R(x) × P(anomaly|x)
///   "token" | "phi"           → Chrysalis / golden math
///   "all"   | "*"             → all dimensions simultaneously
///
/// Returns a `QueryResult` with typed, signed, multi-dimensional output.
/// Nothing mutates.  Everything informs.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash } from './ObserverIntelligence.js';
import {
  FristonFreeEnergyEngine,
  LotkaVolterraEngine,
  HormeticCycleEngine,
} from './AntifragilityEngine.js';
import {
  L72_RewardSignal,
  L73_DataRewardEquivalence,
  L74_BehavioralAsymmetry,
  L75_VariableEmergence,
  L76_FlowState,
  L77_DriveCommitment,
  L78_HormeticStress,
  L79_TemporalDiscounting,
  LOSS_AVERSION_LAMBDA,
} from './BehavioralEconomicsLaws.js';
import {
  KuramotoEngine,
  SovereignScale,
  SOVEREIGNTY_FLOOR,
  KURAMOTO_K,
} from './FractalSovereignty.js';

// ══════════════════════════════════════════════════════════════════
//  QUERY TYPES
// ══════════════════════════════════════════════════════════════════

export type QueryDimension =
  | 'fear'
  | 'antifragility'
  | 'law'
  | 'reward'
  | 'flow'
  | 'sync'
  | 'sovereignty'
  | 'observe'
  | 'anomaly'
  | 'token'
  | 'phi'
  | 'time'
  | 'ecology'
  | 'all';

export interface SovereignQuery {
  /** Natural language question or structured key */
  readonly question: string;
  /** Target dimension(s) — defaults to 'all' */
  readonly dimensions?: QueryDimension[];
  /** Optional numeric payload for engine input */
  readonly payload?: Record<string, number>;
  /** Tick counter for variable-emergence law */
  readonly tick?: number;
}

export interface DimensionResult {
  readonly dimension: QueryDimension;
  readonly label: string;
  readonly value: number;
  readonly formula: string;
  readonly insight: string;
}

export interface QueryResult {
  readonly queryId: number;
  readonly question: string;
  readonly timestamp: number;
  readonly dimensions: readonly DimensionResult[];
  /** Fibonacci-attested result signature */
  readonly signature: number;
  /** Plain-language synthesis across all active dimensions */
  readonly synthesis: string;
  /** Whether all sovereignty floors are met */
  readonly sovereigntyHolds: boolean;
  /** Global order parameter from Kuramoto snapshot */
  readonly kuramotoR: number;
  /** Canonical antifragility score contribution for this query */
  readonly antifragilityDelta: number;
}

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN QUERY ENGINE
// ══════════════════════════════════════════════════════════════════

export class SovereignQueryEngine {
  readonly name = 'SOVEREIGN QUERY ENGINE';
  readonly designation = 'Porta Informationis — One engine. Every dimension. Read only.';

  // Stateless sub-engines used for snapshotting only
  private readonly friston  = new FristonFreeEnergyEngine(0.5);
  private readonly lv        = new LotkaVolterraEngine(1.0, 0.1);
  private readonly hormetic  = new HormeticCycleEngine(0.75);
  private readonly kuramoto  = new KuramotoEngine();

  private queryCount = 0;
  private readonly queryLog: QueryResult[] = [];

  constructor() {
    // Seed the Kuramoto engine with one oscillator per scale
    const scales = Object.values(SovereignScale) as SovereignScale[];
    for (const scale of scales) {
      this.kuramoto.addOscillators(8, scale);
    }
    // Run a warm-up so the order parameter is meaningful from the first query
    this.kuramoto.run(50);
  }

  // ── PRIMARY QUERY ─────────────────────────────────────────────

  /**
   * Execute a sovereign query.  Read-only — returns information.
   * Every query is logged and signed with a Fibonacci attestation.
   */
  query(q: SovereignQuery): QueryResult {
    const id = this.queryCount++;
    const dims = q.dimensions ?? ['all'];
    const payload = q.payload ?? {};
    const tick = q.tick ?? id;

    const active: QueryDimension[] = dims.includes('all')
      ? [
          'fear', 'antifragility', 'law', 'reward', 'flow',
          'sync', 'sovereignty', 'observe', 'ecology', 'time',
        ]
      : dims;

    const results: DimensionResult[] = active.map(d =>
      this.computeDimension(d, payload, tick),
    );

    // Kuramoto snapshot
    const kr = this.kuramoto.computeOrderParameter();
    const sovereigntyHolds = kr.R >= SOVEREIGNTY_FLOOR;

    // Antifragility delta for this query
    const dominance = this.lv.dominanceRatio();
    const cf = this.hormetic.snapshot.chronicFear;
    const antifragilityDelta = dominance * PHI * (1 - cf);

    // Synthesis
    const synthesis = this.synthesize(q.question, results, kr.R, antifragilityDelta);

    // Fibonacci-attested signature
    const sigInput =
      id * 1000 +
      Math.round(kr.R * 1e4) +
      results.reduce((s, r) => s + Math.round(Math.abs(r.value) * 100), 0);
    const signature = fibonacciHash(sigInput, Number.MAX_SAFE_INTEGER);

    const result: QueryResult = {
      queryId: id,
      question: q.question,
      timestamp: Date.now(),
      dimensions: results,
      signature,
      synthesis,
      sovereigntyHolds,
      kuramotoR: kr.R,
      antifragilityDelta,
    };

    this.queryLog.push(result);
    return result;
  }

  // ── DIMENSION COMPUTERS ───────────────────────────────────────

  private computeDimension(
    dim: QueryDimension,
    p: Record<string, number>,
    tick: number,
  ): DimensionResult {
    switch (dim) {
      case 'fear': {
        const fe = this.friston.update(p['sensory'] ?? Math.random() * 0.2).freeEnergy;
        return {
          dimension: 'fear',
          label: 'Friston Free Energy (FE)',
          value: fe,
          formula: 'FE = (sensory − prior)²',
          insight: fe < 0.01
            ? 'Prediction errors near zero — belief is calibrated.'
            : fe > 0.1
            ? 'High prediction error — incoming data diverges from prior. Update beliefs.'
            : 'Moderate surprise — learning is active.',
        };
      }

      case 'antifragility': {
        const dominance = this.lv.dominanceRatio();
        const cf = this.hormetic.snapshot.chronicFear;
        const score = PHI * (1 - cf) * dominance;
        return {
          dimension: 'antifragility',
          label: 'Antifragility Score Δ',
          value: score,
          formula: 'Δ = φ × (1 − chronicFear) × dominance',
          insight: score > PHI * 0.6
            ? 'System gaining from disorder — antifragile zone.'
            : 'System under stress — apply hormetic cycle to recover advantage.',
        };
      }

      case 'ecology': {
        const lvState = this.lv.run(5);
        return {
          dimension: 'ecology',
          label: 'Lotka-Volterra Dominance',
          value: this.lv.dominanceRatio(),
          formula: 'dx/dt = r·x·(1−x/K) − α·x·y',
          insight: lvState.x > lvState.y
            ? `Expansion (x=${lvState.x.toFixed(3)}) outpaces threat (y=${lvState.y.toFixed(3)}).`
            : `Threat pressure elevated — dominance ratio ${this.lv.dominanceRatio().toFixed(3)}.`,
        };
      }

      case 'law': {
        const res = L74_BehavioralAsymmetry({
          lossSignal: p['loss'] ?? 1,
          gainSignal: p['gain'] ?? 1,
        });
        return {
          dimension: 'law',
          label: 'Behavioral Asymmetry (L-74)',
          value: res.output.lossResponse,
          formula: `lossResponse = lossSignal × λ(${LOSS_AVERSION_LAMBDA})`,
          insight: `A loss of ${(p['loss'] ?? 1).toFixed(2)} feels like ${res.output.lossResponse.toFixed(2)} — losses hurt ${LOSS_AVERSION_LAMBDA}× more than equivalent gains.`,
        };
      }

      case 'reward': {
        const res = L72_RewardSignal({
          baseSignal: p['base'] ?? 1,
          dimensionalScalar: p['scalar'] ?? 0.618,
        });
        return {
          dimension: 'reward',
          label: 'Reward Signal (L-72)',
          value: res.output.reward,
          formula: 'reward = baseSignal × φ × dimensionalScalar',
          insight: `Signal amplified to ${res.output.reward.toFixed(4)} via φ-scaling.`,
        };
      }

      case 'flow': {
        const res = L76_FlowState({
          skill: p['skill'] ?? 0.7,
          challenge: p['challenge'] ?? 0.7,
        });
        return {
          dimension: 'flow',
          label: 'Flow State (L-76)',
          value: res.output.flowScore,
          formula: 'flowScore = 1 − |skill − challenge| / max(skill, challenge)',
          insight: res.output.inFlow
            ? `Flow confirmed — score ${res.output.flowScore.toFixed(3)} ≥ φ⁻¹. Optimal execution state.`
            : `Flow disrupted — skill/challenge mismatch at score ${res.output.flowScore.toFixed(3)}.`,
        };
      }

      case 'sync':
      case 'sovereignty': {
        const kr = this.kuramoto.computeOrderParameter();
        return {
          dimension: dim,
          label: 'Kuramoto Order Parameter (R)',
          value: kr.R,
          formula: 'R = |Σ e^(iθ)| / N',
          insight: kr.sovereign
            ? `Synchrony R=${kr.R.toFixed(4)} ≥ SOVEREIGNTY_FLOOR(${SOVEREIGNTY_FLOOR}) — all nodes coherent.`
            : `Sovereignty breach: R=${kr.R.toFixed(4)} < ${SOVEREIGNTY_FLOOR}. Apply coupling K=${KURAMOTO_K.toFixed(4)}.`,
        };
      }

      case 'observe': {
        const phi2 = PHI * PHI;
        const r = p['r'] ?? 0.8;
        const prob = p['prob'] ?? 0.3;
        const score = phi2 * r * prob;
        return {
          dimension: 'observe',
          label: 'Observer Score O(x)',
          value: score,
          formula: 'O(x) = φ^d × R(x) × P(anomaly|x)',
          insight: score > 1
            ? `High-confidence anomaly signal at O(x)=${score.toFixed(4)}.`
            : `Normal observation range — O(x)=${score.toFixed(4)}.`,
        };
      }

      case 'anomaly': {
        const threshold = PHI / (PHI + 1);
        const prob = p['prob'] ?? 0.3;
        const isAnomaly = prob > threshold;
        return {
          dimension: 'anomaly',
          label: 'Anomaly Detection Threshold',
          value: threshold,
          formula: 'threshold = φ / (φ + 1) ≈ 0.618',
          insight: isAnomaly
            ? `ANOMALY DETECTED: P(anomaly)=${prob.toFixed(3)} > threshold ${threshold.toFixed(3)}.`
            : `Within normal bounds: P=${prob.toFixed(3)} ≤ ${threshold.toFixed(3)}.`,
        };
      }

      case 'token':
      case 'phi': {
        const n = Math.round(p['n'] ?? 10);
        let a = 0, b = 1;
        const seq: number[] = [];
        for (let i = 0; i < n; i++) { seq.push(a); [a, b] = [b, a + b]; }
        const convergence = seq.length >= 2 ? (seq[seq.length - 1]! / seq[seq.length - 2]!) : PHI;
        return {
          dimension: dim,
          label: `Fibonacci Convergence F(${n})`,
          value: convergence,
          formula: 'F(n+1)/F(n) → φ as n → ∞',
          insight: `After ${n} terms, ratio converges to ${convergence.toFixed(10)} (φ = ${PHI.toFixed(10)}).`,
        };
      }

      case 'time': {
        const res = L79_TemporalDiscounting({
          reward: p['reward'] ?? 100,
          delay: p['delay'] ?? 5,
          k: p['k'] ?? 0.1,
        });
        return {
          dimension: 'time',
          label: 'Temporal Discounting (L-79)',
          value: res.output.presentValue,
          formula: 'PV = reward / (1 + k × delay × φ⁻¹)',
          insight: `Future reward of ${(p['reward'] ?? 100).toFixed(2)} in ${(p['delay'] ?? 5)} units has present value ${res.output.presentValue.toFixed(4)} with φ⁻¹ patience correction.`,
        };
      }

      default: {
        return {
          dimension: dim,
          label: `Unknown dimension: ${dim}`,
          value: 0,
          formula: '—',
          insight: 'Dimension not recognised. Use: fear, antifragility, law, reward, flow, sync, sovereignty, observe, ecology, time, phi, all.',
        };
      }
    }
  }

  // ── SYNTHESIS ─────────────────────────────────────────────────

  private synthesize(
    question: string,
    dims: DimensionResult[],
    R: number,
    antifragilityDelta: number,
  ): string {
    const topInsights = dims
      .slice(0, 4)
      .map(d => `[${d.label}] ${d.insight}`)
      .join(' | ');

    const sovereigntyStatus = R >= SOVEREIGNTY_FLOOR
      ? `Sovereignty intact (R=${R.toFixed(3)}).`
      : `Sovereignty risk (R=${R.toFixed(3)} < ${SOVEREIGNTY_FLOOR}).`;

    const antifragilityStatus = antifragilityDelta > 0.5
      ? `System antifragile — Δ=${antifragilityDelta.toFixed(4)}.`
      : `Fragility exposure — apply stress cycles to build advantage.`;

    return `Query: "${question}" → ${topInsights} | ${sovereigntyStatus} | ${antifragilityStatus}`;
  }

  // ── CONVENIENCE SHORTCUTS ─────────────────────────────────────

  /** Fear dimension only */
  queryFear(sensory?: number): QueryResult {
    return this.query({ question: 'fear state', dimensions: ['fear'], payload: sensory !== undefined ? { sensory } : {} });
  }

  /** Sovereignty synchrony check */
  querySovereignty(): QueryResult {
    return this.query({ question: 'sovereignty check', dimensions: ['sovereignty', 'sync'] });
  }

  /** Reward signal for a given base and scalar */
  queryReward(baseSignal: number, dimensionalScalar = 1): QueryResult {
    return this.query({
      question: 'reward signal',
      dimensions: ['reward'],
      payload: { base: baseSignal, scalar: dimensionalScalar },
    });
  }

  /** Flow state check */
  queryFlow(skill: number, challenge: number): QueryResult {
    return this.query({
      question: 'flow state',
      dimensions: ['flow'],
      payload: { skill, challenge },
    });
  }

  /** Full multi-dimensional sweep */
  queryAll(payload?: Record<string, number>): QueryResult {
    return this.query({ question: 'full dimensional sweep', dimensions: ['all'], payload });
  }

  // ── LOG & STATUS ──────────────────────────────────────────────

  recentQueries(n = 10): readonly QueryResult[] {
    return this.queryLog.slice(-n);
  }

  status() {
    return {
      name: this.name,
      totalQueries: this.queryCount,
      sovereigntyFloor: SOVEREIGNTY_FLOOR,
      kuramotoR: this.kuramoto.computeOrderParameter().R,
      oscillatorCount: this.kuramoto.oscillatorCount,
      phiConstant: PHI,
      lossAversionLambda: LOSS_AVERSION_LAMBDA,
      kuramotoK: KURAMOTO_K,
    };
  }
}
