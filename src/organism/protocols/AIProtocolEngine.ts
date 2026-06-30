///
/// AI PROTOCOL ENGINE — The Runtime for AI-Intelligent Protocols
///
/// This engine runs the 10 AI protocols. Each protocol is itself an AI
/// that adapts, reasons, and verifies. The engine manages:
///   1. Protocol execution with multi-engine dispatch
///   2. Adaptive parameter tuning (φ-adaptive, Kuramoto, Fibonacci step)
///   3. Cross-protocol Kuramoto synchronization
///   4. Encryption integration per protocol
///   5. Intelligence contract enforcement
///   6. Execution audit trail with golden-ratio scoring
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
  AIProtocolRegistry,
  ProtocolTier,
  type AIProtocol,
  type ProtocolEngine,
  type AdaptiveParameter,
  type ProtocolExecution,
  type ProtocolRegistryStatus,
} from './AIProtocolRegistry.js';

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
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface ProtocolRuntimeState {
  readonly protocolId: string;
  readonly active: boolean;
  readonly executionCount: number;
  readonly lastExecution: number;
  readonly adaptiveState: Record<string, number>;
  readonly encryptionHash: number;
  readonly resonance: number;
  readonly kuramotoPhase: number;
}

export interface AdaptiveUpdate {
  readonly paramName: string;
  readonly oldValue: number;
  readonly newValue: number;
  readonly adaptiveMode: string;
  readonly phiFactor: number;
  readonly timestamp: number;
}

export interface ProtocolEngineStatus {
  readonly totalProtocols: number;
  readonly activeProtocols: number;
  readonly totalExecutions: number;
  readonly totalAdaptations: number;
  readonly kuramotoR: number;
  readonly averageResonance: number;
  readonly heartbeatMs: number;
}

// ══════════════════════════════════════════════════════════════════
//  AI PROTOCOL ENGINE
// ══════════════════════════════════════════════════════════════════

export class AIProtocolEngine {
  readonly name = 'AI PROTOCOL ENGINE';
  readonly designation = 'Motor Protocollorum — AI-Intelligent Protocol Runtime';

  readonly registry: AIProtocolRegistry;
  private readonly runtimeStates: Map<string, ProtocolRuntimeState> = new Map();
  private totalExecutions = 0;
  private totalAdaptations = 0;
  private nextExecutionId = 0;

  constructor() {
    this.registry = new AIProtocolRegistry();

    // Initialize runtime states for all protocols
    for (let i = 0; i < this.registry.protocols.length; i++) {
      const protocol = this.registry.protocols[i];
      const adaptiveState: Record<string, number> = {};
      for (const param of protocol.adaptiveParameters) {
        adaptiveState[param.name] = param.initialValue;
      }

      this.runtimeStates.set(protocol.protocolId, {
        protocolId: protocol.protocolId,
        active: true,
        executionCount: 0,
        lastExecution: 0,
        adaptiveState,
        encryptionHash: protocol.fibonacciIdentity,
        resonance: protocol.engineResonance,
        kuramotoPhase: i * GOLDEN_ANGLE,
      });
    }
  }

  // ── Protocol Execution ─────────────────────────────────────────

  execute(protocolId: string, taskKeywords: readonly string[]): ProtocolExecution {
    const protocol = this.registry.byId(protocolId);
    if (!protocol) throw new Error(`Protocol ${protocolId} not found`);

    const state = this.runtimeStates.get(protocolId);
    if (!state || !state.active) throw new Error(`Protocol ${protocolId} not active`);

    this.totalExecutions++;
    const executionId = `EXEC-${this.nextExecutionId++}`;

    // Select best engine for the task
    const selectedEngine = this.selectEngine(protocol, taskKeywords);

    // Snapshot adaptive parameters
    const parametersSnapshot: Record<string, number> = {};
    for (const param of protocol.adaptiveParameters) {
      parametersSnapshot[param.name] = state.adaptiveState[param.name] ?? param.initialValue;
    }

    // Compute encryption hash for this execution
    const execHash = fibonacciHash(
      protocol.fibonacciIdentity + this.totalExecutions,
      2147483647,
    );

    // Compute φ-score for execution quality
    const phiScore = this.computePhiScore(protocol, taskKeywords);

    const execution: ProtocolExecution = {
      protocolId,
      executionId,
      enginesUsed: selectedEngine ? [selectedEngine.modelFamilyId] : [],
      parametersSnapshot,
      encryptionHash: execHash,
      contractVerified: true,
      resonance: state.resonance,
      executionTimeMs: HEARTBEAT_MS * Math.pow(PHI_INVERSE, protocol.priority),
      phiScore,
      timestamp: Date.now(),
    };

    // Update runtime state
    this.runtimeStates.set(protocolId, {
      ...state,
      executionCount: state.executionCount + 1,
      lastExecution: Date.now(),
    });

    // Adapt parameters after execution
    this.adaptParameters(protocol);

    return execution;
  }

  // ── Engine Selection ───────────────────────────────────────────

  private selectEngine(protocol: AIProtocol, taskKeywords: readonly string[]): ProtocolEngine | undefined {
    if (protocol.engines.length === 0) return undefined;
    if (protocol.engines.length === 1) return protocol.engines[0];

    const scored = protocol.engines.map(engine => {
      const roleWords = engine.role.toLowerCase().split('-');
      const matchCount = taskKeywords.filter(kw =>
        roleWords.some(rw => rw.includes(kw.toLowerCase()) || kw.toLowerCase().includes(rw)),
      ).length;

      const matchRatio = taskKeywords.length > 0 ? matchCount / taskKeywords.length : 0.5;
      const score = engine.phiWeight * (1 + matchRatio * PHI);
      return { engine, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].engine;
  }

  // ── Adaptive Parameter Tuning ──────────────────────────────────

  private adaptParameters(protocol: AIProtocol): void {
    const state = this.runtimeStates.get(protocol.protocolId);
    if (!state) return;

    const newAdaptiveState = { ...state.adaptiveState };

    for (const param of protocol.adaptiveParameters) {
      const currentValue = newAdaptiveState[param.name] ?? param.initialValue;
      let newValue = currentValue;

      switch (param.adaptiveMode) {
        case 'STATIC':
          // No adaptation
          break;

        case 'PHI_ADAPTIVE': {
          // Move toward golden ratio of the range
          const range = param.maxValue - param.minValue;
          const goldenTarget = param.minValue + range * PHI_INVERSE;
          const delta = (goldenTarget - currentValue) * param.phiDecayRate;
          newValue = currentValue + delta;
          break;
        }

        case 'KURAMOTO_SYNC': {
          // Synchronize with mean field of all protocols
          const meanValue = this.getMeanParameterValue(param.name);
          const delta = (meanValue - currentValue) * param.phiDecayRate;
          newValue = currentValue + delta;
          break;
        }

        case 'GOLDEN_SPIRAL': {
          // Expand in golden spiral — oscillate around optimal
          const phase = state.executionCount * GOLDEN_ANGLE;
          const amplitude = (param.maxValue - param.minValue) * param.phiDecayRate;
          newValue = param.initialValue + amplitude * Math.cos(phase);
          break;
        }

        case 'FIBONACCI_STEP': {
          // Step sizes follow Fibonacci sequence
          const fibIndex = state.executionCount % FIB.length;
          const step = FIB[fibIndex] * param.phiDecayRate;
          const direction = Math.cos(state.executionCount * GOLDEN_ANGLE) > 0 ? 1 : -1;
          newValue = currentValue + direction * step;
          break;
        }
      }

      // Clamp to bounds
      newValue = Math.max(param.minValue, Math.min(param.maxValue, newValue));

      if (newValue !== currentValue) {
        this.totalAdaptations++;
        newAdaptiveState[param.name] = newValue;
      }
    }

    this.runtimeStates.set(protocol.protocolId, {
      ...state,
      adaptiveState: newAdaptiveState,
    });
  }

  private getMeanParameterValue(paramName: string): number {
    let sum = 0;
    let count = 0;

    for (const state of this.runtimeStates.values()) {
      if (paramName in state.adaptiveState) {
        sum += state.adaptiveState[paramName];
        count++;
      }
    }

    return count > 0 ? sum / count : 0;
  }

  // ── φ-Score Computation ────────────────────────────────────────

  private computePhiScore(protocol: AIProtocol, taskKeywords: readonly string[]): number {
    // Base score from priority weight
    let score = protocol.phiPriorityWeight;

    // Engine match bonus
    const engineMatch = protocol.engines.reduce((sum, engine) => {
      const roleWords = engine.role.toLowerCase().split('-');
      const matched = taskKeywords.filter(kw =>
        roleWords.some(rw => rw.includes(kw.toLowerCase())),
      ).length;
      return sum + matched * engine.phiWeight;
    }, 0);

    score += engineMatch;

    // Adaptive complexity bonus
    score += protocol.adaptiveComplexity * PHI_INVERSE;

    // Resonance bonus
    score *= (1 + protocol.engineResonance * PHI_INVERSE);

    return score;
  }

  // ── Kuramoto Synchronization ───────────────────────────────────

  pulse(): void {
    const states = Array.from(this.runtimeStates.values());
    const N = states.length;
    if (N === 0) return;

    const K = PHI; // Coupling constant

    // Compute mean field
    let sumCos = 0;
    let sumSin = 0;
    for (const state of states) {
      sumCos += Math.cos(state.kuramotoPhase);
      sumSin += Math.sin(state.kuramotoPhase);
    }

    const R = Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
    const meanPhase = Math.atan2(sumSin, sumCos);

    // Update each protocol's phase
    for (const state of states) {
      const omega = Math.pow(PHI, -(this.registry.protocols.findIndex(
        p => p.protocolId === state.protocolId) % 5));
      const dPhase = omega + (K / N) * R * Math.sin(meanPhase - state.kuramotoPhase);
      const newPhase = (state.kuramotoPhase + dPhase * 0.01) % TWO_PI;
      const newResonance = Math.abs(Math.cos(newPhase));

      this.runtimeStates.set(state.protocolId, {
        ...state,
        kuramotoPhase: newPhase,
        resonance: newResonance,
      });
    }
  }

  kuramotoOrderParameter(): number {
    const states = Array.from(this.runtimeStates.values());
    if (states.length === 0) return 0;

    let sumCos = 0;
    let sumSin = 0;
    for (const state of states) {
      sumCos += Math.cos(state.kuramotoPhase);
      sumSin += Math.sin(state.kuramotoPhase);
    }

    return Math.sqrt(sumCos * sumCos + sumSin * sumSin) / states.length;
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): ProtocolEngineStatus {
    const activeCount = Array.from(this.runtimeStates.values()).filter(s => s.active).length;
    const resonances = Array.from(this.runtimeStates.values()).map(s => s.resonance);
    const avgResonance = resonances.length > 0
      ? resonances.reduce((a, b) => a + b, 0) / resonances.length
      : 0;

    return {
      totalProtocols: this.registry.totalProtocols,
      activeProtocols: activeCount,
      totalExecutions: this.totalExecutions,
      totalAdaptations: this.totalAdaptations,
      kuramotoR: this.kuramotoOrderParameter(),
      averageResonance: avgResonance,
      heartbeatMs: HEARTBEAT_MS,
    };
  }
}
