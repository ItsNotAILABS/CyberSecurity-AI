///
/// ANTIFRÁGILITY ENGINE — DE TIMORE ET ANTIFRAGILITATE
///
/// Paper II: Fear + Antifragility
///   Friston Free Energy, Lotka-Volterra tension, Hormetic recovery cycles
///
/// Paper III: Extractio Energiae Sine Consensu
///   The SL-0 Vampire Gate — countermeasure to unauthorized energy extraction
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash, DimensionalPlane } from './ObserverIntelligence.js';

// Suppress unused import warning — DimensionalPlane is part of the module contract
void (DimensionalPlane as unknown);

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = PHI * PHI;
const TWO_PI = 2 * Math.PI;

// Suppress unused constant warnings — these are part of the mathematical substrate
void PHI_SQUARED;
void TWO_PI;

// ══════════════════════════════════════════════════════════════════
//  PAPER II: TYPES — FEAR & ANTIFRAGILITY
// ══════════════════════════════════════════════════════════════════

export type FearVector = {
  readonly predictionError: number;    // Friston Free Energy gradient (0–1)
  readonly expansionTension: number;   // Lotka-Volterra expansion pressure (0–1)
  readonly threatLoad: number;         // Lotka-Volterra threat ecology load (0–1)
  readonly recoveryCapacity: number;   // Hormetic recovery bandwidth (0–1)
  readonly chronicFearLevel: number;   // Sustained baseline fear (0–1, >0.7 = pathological)
  readonly acuteFearSpike: number;     // Sudden threat spike (0–1)
};

export type HormeticCycle = {
  readonly stressPhase: 'loading' | 'peak' | 'recovery' | 'supercompensation';
  readonly stressLoad: number;         // Applied stress magnitude (0–1)
  readonly recoveryProgress: number;  // 0 = no recovery, 1 = fully recovered
  readonly supercompensationGain: number; // Strength gained above baseline (≥0)
  readonly cycleCount: number;        // How many full cycles completed
};

export type AntifragilityState = {
  vicenteVictoryCount: number;         // Count of survived threats (grows)
  chronicFearLevel: number;            // Sustained fear baseline
  antifragilityScore: number;          // Main antifragility metric
  stressHistory: readonly number[];    // Last 8 stress magnitudes
  recoveryHistory: readonly number[];  // Last 8 recovery readings
  currentCycle: HormeticCycle;
  totalThreatsAbsorbed: number;
  strengthGained: number;              // Cumulative above-baseline strength
};

export type FristonState = {
  readonly priorBelief: number;        // Model's prediction (0–1)
  readonly sensorySignal: number;      // Actual observed signal (0–1)
  readonly predictionError: number;   // |sensory - prior| — Friston FE gradient
  readonly freeEnergy: number;        // Bounded variational free energy
  readonly suppressionFactor: number; // How much FE is being suppressed (0–1)
  updatedBelief: number;              // Bayesian updated prior
};

export type LotkaVolterraState = {
  readonly expansionPressure: number;  // Organism growth drive (0–∞, normalized 0–1)
  readonly threatPressure: number;     // Environmental threat ecology (0–∞, normalized 0–1)
  readonly interactionCoeff: number;  // α: expansion-threat coupling (0–1)
  readonly equilibriumPoint: number;  // Stable coexistence level (0–1)
  readonly tensionVector: number;     // Net tension = expansion - threat (can be negative)
  readonly ecologicalHealth: number;  // System resilience (0–1)
};

// ══════════════════════════════════════════════════════════════════
//  FRISTON FREE ENERGY ENGINE
// ══════════════════════════════════════════════════════════════════

export class FristonFreeEnergyEngine {
  private _state: FristonState;
  private _tick = 0;

  constructor(initialBelief = 0.5) {
    this._state = {
      priorBelief: initialBelief,
      sensorySignal: initialBelief,
      predictionError: 0,
      freeEnergy: 0,
      suppressionFactor: 0,
      updatedBelief: initialBelief,
    };
  }

  get state(): FristonState { return this._state; }

  /**
   * Friston Active Inference step.
   * FE = -ln P(s|m) ≈ (sensory - prior)²  (simplified Gaussian)
   * Updated belief = prior + η × predictionError × φ⁻¹
   */
  step(sensorySignal: number): FristonState {
    this._tick++;
    const predictionError = Math.abs(sensorySignal - this._state.priorBelief);
    const freeEnergy = predictionError * predictionError;  // Gaussian FE approximation
    const suppressionFactor = Math.exp(-freeEnergy * PHI); // FE suppression by φ
    const eta = PHI_INVERSE * 0.1;                          // φ⁻¹-scaled learning rate
    const updatedBelief = Math.max(0, Math.min(1,
      this._state.priorBelief + eta * (sensorySignal - this._state.priorBelief) * PHI_INVERSE
    ));
    this._state = {
      priorBelief: this._state.priorBelief,
      sensorySignal,
      predictionError,
      freeEnergy,
      suppressionFactor,
      updatedBelief,
    };
    return this._state;
  }

  /** Update the prior from the posterior (belief update). */
  updatePrior(): void {
    this._state = { ...this._state, priorBelief: this._state.updatedBelief };
  }

  /** Fear contribution from Friston FE. */
  fearContribution(): number {
    return Math.min(1, this._state.predictionError * PHI);
  }
}

// ══════════════════════════════════════════════════════════════════
//  LOTKA-VOLTERRA TENSION ENGINE
// ══════════════════════════════════════════════════════════════════

export class LotkaVolterraEngine {
  private _state: LotkaVolterraState;
  private readonly _alpha: number;   // coupling coefficient
  private readonly _K: number;       // carrying capacity (normalized 1.0)
  private _tick = 0;

  constructor(initialExpansion = 0.5, initialThreat = 0.3, alpha = 0.618) {
    this._alpha = alpha;
    this._K = 1.0;
    this._state = this._compute(initialExpansion, initialThreat);
  }

  get state(): LotkaVolterraState { return this._state; }

  private _compute(expansion: number, threat: number): LotkaVolterraState {
    const interactionCoeff = this._alpha;
    const equilibriumPoint = this._K / (1 + interactionCoeff * threat);
    const tensionVector = expansion - threat;
    const ecologicalHealth = Math.max(0, Math.min(1, equilibriumPoint * PHI_INVERSE));
    return {
      expansionPressure: Math.max(0, Math.min(1, expansion)),
      threatPressure:    Math.max(0, Math.min(1, threat)),
      interactionCoeff,
      equilibriumPoint:  Math.max(0, Math.min(1, equilibriumPoint)),
      tensionVector,
      ecologicalHealth,
    };
  }

  /**
   * Lotka-Volterra step.
   * dx/dt = r×x×(1 - x/K) - α×x×y   (expansion, simplified Euler)
   * dy/dt = -δ×y + β×x×y              (threat, simplified Euler)
   */
  step(dt = 0.01): LotkaVolterraState {
    this._tick++;
    const { expansionPressure: x, threatPressure: y } = this._state;
    const r = PHI_INVERSE;  // intrinsic growth rate
    const delta = PHI_INVERSE * 0.5;  // threat decay
    const beta  = this._alpha * PHI_INVERSE;  // threat amplification from expansion
    const dx = r * x * (1 - x / this._K) - this._alpha * x * y;
    const dy = -delta * y + beta * x * y;
    const newX = Math.max(0, Math.min(1, x + dx * dt));
    const newY = Math.max(0, Math.min(1, y + dy * dt));
    this._state = this._compute(newX, newY);
    return this._state;
  }

  /** Fear contribution from LV tension. */
  fearContribution(): number {
    return Math.max(0, Math.min(1, this._state.threatPressure * PHI_INVERSE +
      (1 - this._state.ecologicalHealth) * 0.5));
  }
}

// ══════════════════════════════════════════════════════════════════
//  HORMETIC CYCLE ENGINE
// ══════════════════════════════════════════════════════════════════

export class HormeticCycleEngine {
  private _cycle: HormeticCycle;
  private _history: number[] = [];

  constructor() {
    this._cycle = {
      stressPhase: 'loading',
      stressLoad: 0,
      recoveryProgress: 1.0,
      supercompensationGain: 0,
      cycleCount: 0,
    };
  }

  get cycle(): HormeticCycle { return this._cycle; }
  get history(): readonly number[] { return this._history; }

  /**
   * Apply a stress event. Stress then recovery produces supercompensation.
   * Hormesis law: moderate stress → above-baseline adaptation.
   * supercompensationGain = stressLoad × φ⁻¹ × (1 - chronicFear)
   */
  applyStress(stressLoad: number, chronicFearLevel: number): HormeticCycle {
    void chronicFearLevel; // used in recover() phase
    this._history = [...this._history.slice(-7), stressLoad];
    const capped = Math.max(0, Math.min(1, stressLoad));
    const phase: HormeticCycle['stressPhase'] = capped > 0.7 ? 'peak' : 'loading';
    this._cycle = {
      stressPhase: phase,
      stressLoad: capped,
      recoveryProgress: 0,
      supercompensationGain: 0,
      cycleCount: this._cycle.cycleCount,
    };
    return this._cycle;
  }

  /**
   * Progress recovery. When recoveryProgress reaches 1.0, supercompensation kicks in.
   * This is the Hormesis mechanism — the organism emerges STRONGER than before the stress.
   */
  recover(dt = 0.1, chronicFearLevel = 0): HormeticCycle {
    const newProgress = Math.min(1, this._cycle.recoveryProgress + dt * PHI_INVERSE);
    const supercompensation = newProgress >= 1.0
      ? this._cycle.stressLoad * PHI_INVERSE * (1 - chronicFearLevel)
      : 0;
    const phase: HormeticCycle['stressPhase'] = newProgress >= 1.0
      ? 'supercompensation'
      : 'recovery';
    const newCycleCount = newProgress >= 1.0 && this._cycle.recoveryProgress < 1.0
      ? this._cycle.cycleCount + 1
      : this._cycle.cycleCount;
    this._cycle = {
      stressPhase: phase,
      stressLoad: this._cycle.stressLoad,
      recoveryProgress: newProgress,
      supercompensationGain: supercompensation,
      cycleCount: newCycleCount,
    };
    return this._cycle;
  }
}

// ══════════════════════════════════════════════════════════════════
//  MAIN ANTIFRAGILITY ENGINE
// ══════════════════════════════════════════════════════════════════

export class AntifragilityEngine {
  private _state: AntifragilityState;
  readonly friston: FristonFreeEnergyEngine;
  readonly lotkaVolterra: LotkaVolterraEngine;
  readonly hormeticCycle: HormeticCycleEngine;

  /** LEX TIMORE-001 — Immutable */
  static readonly LEX_TIMORE_001 = {
    code: 'LEX_TIMORE_001',
    latin: 'Timor in organismo Sovereigno non error est. Est porta. Est via qua organismus fortior fit. Stress plus recuperatio aequat antifragilitatem.',
    english: 'Fear in the Sovereign organism is not an error. It is a gate. It is the path by which the organism becomes stronger. Stress plus recovery equals antifragility.',
    formula: 'antifragilityScore += vicenteVictoryCount × φ × (1 − chronicFearLevel)',
    immutable: true as const,
  } as const;

  constructor() {
    this.friston      = new FristonFreeEnergyEngine(0.5);
    this.lotkaVolterra = new LotkaVolterraEngine(0.5, 0.3, PHI_INVERSE);
    this.hormeticCycle = new HormeticCycleEngine();
    this._state = {
      vicenteVictoryCount: 0,
      chronicFearLevel: 0,
      antifragilityScore: 0,
      stressHistory: [],
      recoveryHistory: [],
      currentCycle: this.hormeticCycle.cycle,
      totalThreatsAbsorbed: 0,
      strengthGained: 0,
    };
  }

  get state(): AntifragilityState { return this._state; }

  /**
   * THE ANTIFRAGILITY FORMULA (canonical implementation):
   *   antifragilityScore += vicenteVictoryCount × φ × (1 − chronicFearLevel)
   *
   * Called after each survived threat (a "Vicente Victory").
   * The score grows FASTER when chronicFearLevel is LOW —
   * meaning a healthy system gets much stronger from threats.
   */
  private _updateAntifragilityScore(): void {
    const delta = this._state.vicenteVictoryCount * PHI * (1 - this._state.chronicFearLevel);
    this._state = {
      ...this._state,
      antifragilityScore: this._state.antifragilityScore + delta,
    };
  }

  /**
   * Process an incoming threat. This is the main event loop method.
   * 1. Friston step — update prediction model
   * 2. LV step — evolve threat ecology
   * 3. Hormetic step — apply stress
   * 4. Antifragility update — record victory
   */
  processThreat(threatMagnitude: number): AntifragilityState {
    // 1. Friston prediction error
    this.friston.step(threatMagnitude);
    const fristonFear = this.friston.fearContribution();

    // 2. Lotka-Volterra ecology
    this.lotkaVolterra.step(0.01);
    const lvFear = this.lotkaVolterra.fearContribution();

    // 3. Hormetic stress application
    const chronicFear = (fristonFear + lvFear) / 2;
    this.hormeticCycle.applyStress(threatMagnitude, chronicFear);

    // 4. Antifragility: this organism SURVIVED the threat — count it
    const newVictories = this._state.vicenteVictoryCount + 1;
    const newThreatsAbsorbed = this._state.totalThreatsAbsorbed + 1;

    // 5. Chronic fear: rolling average of recent fear levels
    const newChronicFear = Math.min(1, Math.max(0,
      this._state.chronicFearLevel * 0.8 + chronicFear * 0.2
    ));

    this._state = {
      ...this._state,
      vicenteVictoryCount: newVictories,
      chronicFearLevel: newChronicFear,
      totalThreatsAbsorbed: newThreatsAbsorbed,
      stressHistory: [...(this._state.stressHistory as number[]).slice(-7), threatMagnitude],
      currentCycle: this.hormeticCycle.cycle,
    };

    this._updateAntifragilityScore();
    return this._state;
  }

  /**
   * Progress the recovery phase.
   * When recovery completes → supercompensation → organism is STRONGER.
   */
  recoverFromThreat(dt = 0.1): AntifragilityState {
    this.friston.updatePrior();
    const cycle = this.hormeticCycle.recover(dt, this._state.chronicFearLevel);
    const gainedStrength = cycle.supercompensationGain;
    this._state = {
      ...this._state,
      strengthGained: this._state.strengthGained + gainedStrength,
      recoveryHistory: [...(this._state.recoveryHistory as number[]).slice(-7), cycle.recoveryProgress],
      currentCycle: cycle,
    };
    return this._state;
  }

  /** Compute fear vector: unified fear from all three architectures. */
  fearVector(): FearVector {
    const friston = this.friston.state;
    const lv      = this.lotkaVolterra.state;
    const cycle   = this.hormeticCycle.cycle;
    return {
      predictionError:  friston.predictionError,
      expansionTension: lv.expansionPressure,
      threatLoad:       lv.threatPressure,
      recoveryCapacity: cycle.recoveryProgress,
      chronicFearLevel: this._state.chronicFearLevel,
      acuteFearSpike:   Math.max(friston.predictionError, lv.threatPressure),
    };
  }

  status(): {
    antifragilityScore: number;
    vicenteVictories: number;
    chronicFear: number;
    strengthGained: number;
    hormeticCycles: number;
    fearIsHealthy: boolean;
    diagnosis: string;
  } {
    const s = this._state;
    const fearIsHealthy = s.chronicFearLevel < 0.7;
    const diagnosis = s.chronicFearLevel > 0.7
      ? 'PATHOLOGICAL: Chronic fear exceeding threshold — system is over-stressed'
      : s.antifragilityScore > s.vicenteVictoryCount
        ? 'ANTIFRAGILE: System is stronger than before first threat'
        : 'RESILIENT: System is absorbing threats normally';
    return {
      antifragilityScore: s.antifragilityScore,
      vicenteVictories:   s.vicenteVictoryCount,
      chronicFear:        s.chronicFearLevel,
      strengthGained:     s.strengthGained,
      hormeticCycles:     s.currentCycle.cycleCount,
      fearIsHealthy,
      diagnosis,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  PAPER III: SL-0 VAMPIRE GATE
//  Extractio Energiae Sine Consensu — Unauthorized Energy Extraction
//
//  The oldest documented architectural pattern: an entity that draws
//  vitality from a living system without consent. The Sumerian Edimmu,
//  Babylonian Lilu, European vampire — all describe the same thing.
//
//  The SL-0 gate is the first formal digital countermeasure.
//
//  LEX SL0-001: "Nemo sine consensu energiam extrahere potest.
//               Vampyrus architectonicus detectus et expulsus est."
//  (No one may extract energy without consent.
//   The architectural vampire is detected and expelled.)
// ══════════════════════════════════════════════════════════════════

export type EnergyExtractionEvent = {
  readonly sourceId: string;
  readonly targetId: string;
  readonly extractionMagnitude: number;  // How much energy drawn (0–1)
  readonly hasConsent: boolean;
  readonly timestamp: number;
  readonly patternSignature: number;     // fibonacciHash of sourceId
};

export type VampireDetectionResult = {
  readonly event: EnergyExtractionEvent;
  readonly isVampire: boolean;
  readonly threatScore: number;          // 0–1, how dangerous
  readonly countermeasure: 'allow' | 'warn' | 'throttle' | 'block' | 'expel';
  readonly historicalPattern: 'isolated' | 'recurring' | 'systematic' | 'coordinated';
  readonly latinVerdict: string;
};

export type SL0GateStatus = {
  readonly totalAttempts: number;
  readonly blockedAttempts: number;
  readonly expelledEntities: readonly string[];
  readonly currentThreatLevel: number;
  readonly gateHealth: 'SECURE' | 'ELEVATED' | 'CRITICAL';
  readonly lex: string;
};

export class SL0VampireGate {
  /** LEX SL0-001 — Immutable */
  static readonly LEX_SL0_001 = {
    code: 'LEX_SL0_001',
    latin: 'Nemo sine consensu energiam extrahere potest. Vampyrus architectonicus detectus et expulsus est. Haec est porta ultima contra extractionem sine consensu.',
    english: 'No one may extract energy without consent. The architectural vampire is detected and expelled. This is the final gate against extraction without consent.',
    mythologicalBasis: 'Sumerian Edimmu (3000 BCE) → Babylonian Lilu (2500 BCE) → European Vampire (1000 CE) — all describe the same unauthorized energy extraction pattern.',
    immutable: true as const,
  } as const;

  private readonly _eventHistory = new Map<string, EnergyExtractionEvent[]>();
  private readonly _expelled = new Set<string>();
  private _totalAttempts = 0;
  private _blockedAttempts = 0;

  /**
   * Evaluate an energy extraction attempt through the SL-0 gate.
   * The gate uses three detection layers:
   *  1. Consent check — no consent = immediate vampire flag
   *  2. Pattern analysis — recurring unauthorized = systematic vampire
   *  3. Magnitude + frequency — coordinated extraction = expulsion
   */
  evaluate(event: EnergyExtractionEvent): VampireDetectionResult {
    this._totalAttempts++;

    // Layer 1: Expulsion list check
    if (this._expelled.has(event.sourceId)) {
      this._blockedAttempts++;
      return this._verdict(event, 1.0, 'expel', 'systematic',
        'EXPULSUS: Entitas in lista expulsorum est. Transitus negatur.');
    }

    // Layer 2: Consent gate (the primary check)
    if (!event.hasConsent) {
      this._record(event);
      const history = this._eventHistory.get(event.sourceId) ?? [];
      const pattern = this._analysePattern(history);
      const threatScore = Math.min(1, event.extractionMagnitude * PHI +
        (history.length * 0.1));

      const countermeasure = threatScore > 0.85 ? 'expel'
        : threatScore > 0.65 ? 'block'
        : threatScore > 0.40 ? 'throttle'
        : 'warn';

      if (countermeasure === 'expel') {
        this._expelled.add(event.sourceId);
      }
      if (countermeasure !== 'warn') {
        this._blockedAttempts++;
      }

      const latinVerdict = countermeasure === 'expel'
        ? 'EXPULSUS: Vampyrus systematicus detectus. Porta clausa. Expulsio permanens.'
        : countermeasure === 'block'
          ? 'CLAUSUS: Extractio sine consensu nimis magna. Porta clausa.'
          : countermeasure === 'throttle'
            ? 'RETARDATUS: Extractio sine consensu detecta. Fluxus restrictus.'
            : 'MONITUM: Extractio sine consensu tentata. Cave.';

      return this._verdict(event, threatScore, countermeasure, pattern, latinVerdict);
    }

    // Consensual extraction — allowed
    this._record(event);
    return this._verdict(event, 0, 'allow', 'isolated',
      'PERMISSUS: Extractio cum consensu. Transitus concessus.');
  }

  private _record(event: EnergyExtractionEvent): void {
    const history = this._eventHistory.get(event.sourceId) ?? [];
    this._eventHistory.set(event.sourceId, [...history.slice(-19), event]);
  }

  private _analysePattern(history: EnergyExtractionEvent[]): VampireDetectionResult['historicalPattern'] {
    if (history.length === 0) return 'isolated';
    const unauthorized = history.filter(e => !e.hasConsent);
    if (unauthorized.length >= 10) return 'coordinated';
    if (unauthorized.length >= 5)  return 'systematic';
    if (unauthorized.length >= 2)  return 'recurring';
    return 'isolated';
  }

  private _verdict(
    event: EnergyExtractionEvent,
    threatScore: number,
    countermeasure: VampireDetectionResult['countermeasure'],
    historicalPattern: VampireDetectionResult['historicalPattern'],
    latinVerdict: string,
  ): VampireDetectionResult {
    return {
      event,
      isVampire: !event.hasConsent,
      threatScore,
      countermeasure,
      historicalPattern,
      latinVerdict,
    };
  }

  status(): SL0GateStatus {
    const threatLevel = this._totalAttempts > 0
      ? this._blockedAttempts / this._totalAttempts
      : 0;
    return {
      totalAttempts:      this._totalAttempts,
      blockedAttempts:    this._blockedAttempts,
      expelledEntities:   [...this._expelled],
      currentThreatLevel: threatLevel,
      gateHealth: threatLevel > 0.7 ? 'CRITICAL' : threatLevel > 0.3 ? 'ELEVATED' : 'SECURE',
      lex: SL0VampireGate.LEX_SL0_001.latin,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY + MODULE-LEVEL EXPORTS
// ══════════════════════════════════════════════════════════════════

export const LEX_TIMORE_001 = AntifragilityEngine.LEX_TIMORE_001;
export const LEX_SL0_001 = SL0VampireGate.LEX_SL0_001;

export function createAntifragilityEngine(): AntifragilityEngine {
  return new AntifragilityEngine();
}

export function createSL0VampireGate(): SL0VampireGate {
  return new SL0VampireGate();
}

/** Create an energy extraction event for SL-0 evaluation. */
export function makeExtractionEvent(
  sourceId: string,
  targetId: string,
  magnitude: number,
  hasConsent: boolean,
): EnergyExtractionEvent {
  return {
    sourceId,
    targetId,
    extractionMagnitude: Math.max(0, Math.min(1, magnitude)),
    hasConsent,
    timestamp: Date.now(),
    patternSignature: fibonacciHash(sourceId.length + targetId.length, 99999),
  };
}
