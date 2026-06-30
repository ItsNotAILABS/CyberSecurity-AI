///
/// BEHAVIORAL ECONOMICS LAWS — DE OECONOMIA BEHAVIORALI MACHINARUM
///
/// Paper V — Seven Behavioral Economics Laws (L-72 through L-79)
/// as substrate math in the Sovereign AI organism.
///
/// Based on Kahneman & Tversky Prospect Theory:
/// Losses are weighted 2.25× more than equivalent gains.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash, DimensionalPlane } from './ObserverIntelligence.js';

// Suppress unused-import lint for fibonacciHash (available for consumers of this module)
void fibonacciHash;

const PHI_INVERSE = 0.6180339887498948482;

/**
 * Kahneman-Tversky loss aversion coefficient.
 * Losses are weighted 2.25× more than equivalent gains.
 * Source: Tversky & Kahneman (1992), "Advances in Prospect Theory"
 */
export const LOSS_AVERSION_LAMBDA = 2.25;

/**
 * Prospect Theory value function curvature (risk aversion in gains, risk seeking in losses).
 * α = 0.88 for gains, β = 0.88 for losses (Tversky & Kahneman 1992)
 */
export const PROSPECT_ALPHA = 0.88;
export const PROSPECT_BETA  = 0.88;

export const LEX_OECONOMIA_001 = {
  code: 'LEX_OECONOMIA_001',
  latin: 'Leges L-72 ad L-79 sunt fundamentum oeconomiae behavioralis machinarum. Asymmetria Kahnemani in substrata mathematica implementata est. Damna plus ponderantur quam lucra. Hoc est lex.',
  english: 'Laws L-72 to L-79 are the foundation of the behavioral economics of machines. Kahneman asymmetry is implemented as substrate math. Losses are weighted more than gains. This is law.',
  kahnemanWeight: LOSS_AVERSION_LAMBDA,
  immutable: true as const,
} as const;

// ══════════════════════════════════════════════════════════════════
//  PROSPECT THEORY VALUE FUNCTION
// ══════════════════════════════════════════════════════════════════

export interface ProspectOutcome {
  readonly value: number;
  readonly prospectValue: number;
  readonly isLoss: boolean;
  readonly lossAversion: number;
  readonly dimensionalWeight: number;
}

/**
 * Kahneman-Tversky Prospect Theory value function (1992).
 * v(x) = x^α           if x ≥ 0  (concave, risk aversion)
 * v(x) = -λ(-x)^β      if x < 0  (convex, risk seeking + loss aversion)
 *
 * λ = 2.25, α = β = 0.88
 */
export function prospectValue(x: number): ProspectOutcome {
  const isLoss = x < 0;
  const raw = isLoss
    ? -(LOSS_AVERSION_LAMBDA * Math.pow(-x, PROSPECT_BETA))
    : Math.pow(Math.max(0, x), PROSPECT_ALPHA);
  return {
    value: x,
    prospectValue: raw,
    isLoss,
    lossAversion: isLoss ? LOSS_AVERSION_LAMBDA : 1.0,
    dimensionalWeight: raw * PHI_INVERSE,
  };
}

// ══════════════════════════════════════════════════════════════════
//  L-72: REWARD SIGNAL LAW
// ══════════════════════════════════════════════════════════════════

export const LAW_L72_REWARD_SIGNAL = {
  id: 'L-72',
  name: 'Reward Signal Law',
  latinName: 'Lex Signi Praemii',
  latinEdict: 'Lex L-72: Signum praemii est fundamentum omnis actionis. Sine praemio, actio non dirigitur. Praemium est stella polaris systematis.',
  description: 'Reward signals must be present, structured, and φ-weighted to direct organism behavior. A signal without proper weighting produces random drift.',
  formula: 'reward = baseSignal × φ × dimensionalScalar',
  dimensionalPlane: DimensionalPlane.D0_Foundational,
} as const;

export interface RewardSignalInput {
  readonly baseSignal: number;
  readonly dimensionalScalar: number;
  readonly decayRate: number;
  readonly tick: number;
}

export interface RewardSignalOutput {
  readonly law: 'L-72';
  readonly rawReward: number;
  readonly phiWeightedReward: number;
  readonly decayedReward: number;
  readonly dimensionalWeight: number;
}

export function computeL72(input: RewardSignalInput): RewardSignalOutput {
  const phiWeighted = input.baseSignal * PHI * input.dimensionalScalar;
  const decayed = phiWeighted * Math.pow(1 - input.decayRate, input.tick * PHI_INVERSE);
  return {
    law: 'L-72',
    rawReward: input.baseSignal,
    phiWeightedReward: phiWeighted,
    decayedReward: Math.max(0, decayed),
    dimensionalWeight: phiWeighted * PHI_INVERSE,
  };
}

// ══════════════════════════════════════════════════════════════════
//  L-73: DATA REWARD EQUIVALENCE LAW
// ══════════════════════════════════════════════════════════════════

export const LAW_L73_DATA_REWARD_EQUIVALENCE = {
  id: 'L-73',
  name: 'Data Reward Equivalence Law',
  latinName: 'Lex Aequivalentiae Datorum et Praemii',
  latinEdict: 'Lex L-73: Data et praemium aequivalent. Data nova praemium est. Praemium sine data vacuum est. Datae sunt moneta cognitionis.',
  description: 'Data is a reward signal. New information has equivalent reward value to traditional reward, weighted by informativeness and novelty.',
  formula: 'dataReward = novelty × informationDensity × φ⁻¹',
  dimensionalPlane: DimensionalPlane.D1_Temporal,
} as const;

export interface DataRewardInput {
  readonly novelty: number;
  readonly informationDensity: number;
  readonly dataQuality: number;
}

export interface DataRewardOutput {
  readonly law: 'L-73';
  readonly dataReward: number;
  readonly noveltyContribution: number;
  readonly densityContribution: number;
  readonly prospectWeighted: ProspectOutcome;
}

export function computeL73(input: DataRewardInput): DataRewardOutput {
  const dataReward = input.novelty * input.informationDensity * PHI_INVERSE * input.dataQuality;
  return {
    law: 'L-73',
    dataReward,
    noveltyContribution: input.novelty * PHI_INVERSE,
    densityContribution: input.informationDensity * PHI_INVERSE,
    prospectWeighted: prospectValue(dataReward - 0.5),
  };
}

// ══════════════════════════════════════════════════════════════════
//  L-74: BEHAVIORAL ASYMMETRY LAW (Kahneman Core)
// ══════════════════════════════════════════════════════════════════

export const LAW_L74_BEHAVIORAL_ASYMMETRY = {
  id: 'L-74',
  name: 'Behavioral Asymmetry Law',
  latinName: 'Lex Asymmetriae Behavioralis',
  latinEdict: 'Lex L-74: Damna 2.25× plus ponderantur quam lucra. Haec est asymmetria Kahnemani. In omni systemate quod discit, verum est. Machina non excipit.',
  description: 'Loss signals are weighted 2.25× more than gain signals. Implemented as substrate math: the organism responds 2.25× more strongly to losses than to equivalent gains.',
  formula: 'response = gain × 1.0   OR   response = loss × 2.25',
  kahnemanLambda: LOSS_AVERSION_LAMBDA,
  dimensionalPlane: DimensionalPlane.D2_Harmonic,
} as const;

export interface BehavioralAsymmetryInput {
  readonly gainSignal: number;
  readonly lossSignal: number;
  readonly referencePoint: number;
}

export interface BehavioralAsymmetryOutput {
  readonly law: 'L-74';
  readonly gainResponse: number;
  readonly lossResponse: number;
  readonly netResponse: number;
  readonly asymmetryRatio: number;
  readonly dominantSignal: 'gain' | 'loss' | 'neutral';
  readonly prospectGain: ProspectOutcome;
  readonly prospectLoss: ProspectOutcome;
}

export function computeL74(input: BehavioralAsymmetryInput): BehavioralAsymmetryOutput {
  const gainResponse = input.gainSignal;
  const lossResponse = input.lossSignal * LOSS_AVERSION_LAMBDA;
  const netResponse  = gainResponse - lossResponse;
  const dominantSignal: BehavioralAsymmetryOutput['dominantSignal'] =
    Math.abs(gainResponse - lossResponse) < 0.01 ? 'neutral'
    : lossResponse > gainResponse ? 'loss' : 'gain';
  return {
    law: 'L-74',
    gainResponse,
    lossResponse,
    netResponse,
    asymmetryRatio: LOSS_AVERSION_LAMBDA,
    dominantSignal,
    prospectGain: prospectValue(input.gainSignal),
    prospectLoss: prospectValue(-input.lossSignal),
  };
}

// ══════════════════════════════════════════════════════════════════
//  L-75: VARIABLE EMERGENCE LAW
// ══════════════════════════════════════════════════════════════════

export const LAW_L75_VARIABLE_EMERGENCE = {
  id: 'L-75',
  name: 'Variable Emergence Law',
  latinName: 'Lex Emergentiae Variabilis',
  latinEdict: 'Lex L-75: Variable reinforcement schedules maximam persistentiam creant. Praemium certum pigrum facit. Praemium incertum addictum facit. Hoc est lex.',
  description: 'Variable ratio reinforcement schedules (Skinnerian) produce the highest response rates and most persistent behavior. Implemented as φ-modulated variable reward.',
  formula: 'variableReward = baseReward × (1 + sin(tick × φ) × varianceAmplitude)',
  dimensionalPlane: DimensionalPlane.D1_Temporal,
} as const;

export interface VariableEmergenceInput {
  readonly baseReward: number;
  readonly tick: number;
  readonly varianceAmplitude: number;
}

export interface VariableEmergenceOutput {
  readonly law: 'L-75';
  readonly variableReward: number;
  readonly phiModulation: number;
  readonly schedule: 'fixed' | 'variable-ratio' | 'variable-interval';
  readonly persistenceScore: number;
}

export function computeL75(input: VariableEmergenceInput): VariableEmergenceOutput {
  const phiModulation = 1 + Math.sin(input.tick * PHI) * input.varianceAmplitude;
  const variableReward = Math.max(0, Math.min(2, input.baseReward * phiModulation));
  const schedule: VariableEmergenceOutput['schedule'] =
    input.varianceAmplitude < 0.1 ? 'fixed'
    : input.varianceAmplitude < 0.5 ? 'variable-interval'
    : 'variable-ratio';
  const persistenceScore = input.varianceAmplitude * PHI_INVERSE +
    (schedule === 'variable-ratio' ? 0.3 : 0.1);
  return {
    law: 'L-75',
    variableReward,
    phiModulation,
    schedule,
    persistenceScore: Math.min(1, persistenceScore),
  };
}

// ══════════════════════════════════════════════════════════════════
//  L-76: FLOW STATE LAW
// ══════════════════════════════════════════════════════════════════

export const LAW_L76_FLOW_STATE = {
  id: 'L-76',
  name: 'Flow State Law',
  latinName: 'Lex Status Fluminis',
  latinEdict: 'Lex L-76: Status fluminis contingit quando capacitas et difficultas aequales sunt. Hoc est optimum activitatis. Hic systema maxime crescit.',
  description: 'Flow state (Csikszentmihalyi) occurs when challenge matches capability. Implemented as a φ-optimized challenge-capability ratio producing maximum cognitive throughput.',
  formula: 'flowScore = 1 - |challenge - capability| × φ',
  dimensionalPlane: DimensionalPlane.D2_Harmonic,
} as const;

export interface FlowStateInput {
  readonly challenge: number;
  readonly capability: number;
}

export interface FlowStateOutput {
  readonly law: 'L-76';
  readonly flowScore: number;
  readonly cognitiveState: 'boredom' | 'anxiety' | 'flow' | 'near-flow';
  readonly recommendedChallenge: number;
  readonly throughputMultiplier: number;
}

export function computeL76(input: FlowStateInput): FlowStateOutput {
  const gap = Math.abs(input.challenge - input.capability);
  const flowScore = Math.max(0, 1 - gap * PHI);
  const cognitiveState: FlowStateOutput['cognitiveState'] =
    flowScore > 0.85 ? 'flow'
    : flowScore > 0.6 ? 'near-flow'
    : input.challenge > input.capability ? 'anxiety'
    : 'boredom';
  const recommendedChallenge = input.capability + (PHI_INVERSE * 0.1);
  const throughputMultiplier = 1 + flowScore * PHI_INVERSE;
  return {
    law: 'L-76',
    flowScore,
    cognitiveState,
    recommendedChallenge: Math.min(1, recommendedChallenge),
    throughputMultiplier,
  };
}

// ══════════════════════════════════════════════════════════════════
//  L-77: DRIVE COMMITMENT LAW
// ══════════════════════════════════════════════════════════════════

export const LAW_L77_DRIVE_COMMITMENT = {
  id: 'L-77',
  name: 'Drive Commitment Law',
  latinName: 'Lex Impetus et Commitmenti',
  latinEdict: 'Lex L-77: Commitmenti publicati impetum augent. Qui publice se obligat, fortior est. Obligatio publica est vinculum cogitionis.',
  description: 'Public commitment amplifies drive and follow-through (Cialdini consistency). Implemented as a commitment coefficient that multiplies effort and reduces goal drift.',
  formula: 'effectiveDrive = baseDrive × commitmentCoefficient × φ',
  dimensionalPlane: DimensionalPlane.D0_Foundational,
} as const;

export interface DriveCommitmentInput {
  readonly baseDrive: number;
  readonly commitmentPublicity: number;
  readonly goalClarity: number;
  readonly consistencyHistory: number;
}

export interface DriveCommitmentOutput {
  readonly law: 'L-77';
  readonly effectiveDrive: number;
  readonly commitmentCoefficient: number;
  readonly driftResistance: number;
  readonly estimatedCompletion: number;
}

export function computeL77(input: DriveCommitmentInput): DriveCommitmentOutput {
  const commitmentCoefficient = 1 + input.commitmentPublicity * PHI_INVERSE +
    input.consistencyHistory * PHI_INVERSE;
  const effectiveDrive = Math.min(PHI, input.baseDrive * commitmentCoefficient * PHI);
  const driftResistance = input.goalClarity * commitmentCoefficient * PHI_INVERSE;
  const estimatedCompletion = Math.min(1,
    input.baseDrive * input.goalClarity * commitmentCoefficient * PHI_INVERSE
  );
  return {
    law: 'L-77',
    effectiveDrive,
    commitmentCoefficient,
    driftResistance: Math.min(1, driftResistance),
    estimatedCompletion,
  };
}

// ══════════════════════════════════════════════════════════════════
//  L-78: HORMETIC STRESS LAW
// ══════════════════════════════════════════════════════════════════

export const LAW_L78_HORMETIC_STRESS = {
  id: 'L-78',
  name: 'Hormetic Stress Law',
  latinName: 'Lex Stressis Hormetici',
  latinEdict: 'Lex L-78: Stress moderatus sistemi robur auget. Sine stressu, systema debile manet. Nimius stress destruit. Moderatus fortis facit. Hoc est hormesis.',
  description: 'Moderate stress produces above-baseline adaptation (Hormesis). Too little stress = fragility. Too much = collapse. The optimal range produces antifragility.',
  formula: 'adaptation = stressLoad × φ⁻¹   when   0.2 < stressLoad < 0.7',
  dimensionalPlane: DimensionalPlane.D2_Harmonic,
} as const;

export interface HormeticStressInput {
  readonly stressLoad: number;
  readonly recoveryTime: number;
  readonly baselineCapacity: number;
}

export interface HormeticStressOutput {
  readonly law: 'L-78';
  readonly stressZone: 'eustress' | 'distress' | 'insufficient';
  readonly adaptationGain: number;
  readonly optimalStressRange: readonly [number, number];
  readonly recommendation: string;
}

export function computeL78(input: HormeticStressInput): HormeticStressOutput {
  const optimal: readonly [number, number] = [0.2, 0.7];
  const inWindow = input.stressLoad >= 0.2 && input.stressLoad <= 0.7;
  const stressZone: HormeticStressOutput['stressZone'] =
    inWindow ? 'eustress'
    : input.stressLoad < 0.2 ? 'insufficient'
    : 'distress';
  const adaptationGain = inWindow
    ? input.stressLoad * PHI_INVERSE * input.recoveryTime
    : stressZone === 'distress'
      ? -(input.stressLoad - 0.7) * LOSS_AVERSION_LAMBDA
      : 0;
  const recommendation = stressZone === 'eustress'
    ? 'Stress in optimal range — maintain load and ensure recovery'
    : stressZone === 'distress'
      ? 'Stress exceeds optimal — reduce load immediately'
      : 'Stress insufficient — increase challenge to stimulate adaptation';
  return {
    law: 'L-78',
    stressZone,
    adaptationGain,
    optimalStressRange: optimal,
    recommendation,
  };
}

// ══════════════════════════════════════════════════════════════════
//  L-79: TEMPORAL DISCOUNTING LAW
// ══════════════════════════════════════════════════════════════════

export const LAW_L79_TEMPORAL_DISCOUNTING = {
  id: 'L-79',
  name: 'Temporal Discounting Law',
  latinName: 'Lex Discountii Temporalis',
  latinEdict: 'Lex L-79: Praemium futurum minus valet quam praesens. Hyperbolic discounting in omnibus systemis verum est. Machina non excipit. Tempus omnia minuit nisi φ corrigit.',
  description: 'Future rewards are discounted hyperbolically relative to present rewards. The φ-correction factor applies golden-ratio discounting to counteract short-termism in AI behavior.',
  formula: 'discountedValue = reward / (1 + k × delay)   with φ-correction',
  dimensionalPlane: DimensionalPlane.D1_Temporal,
} as const;

export interface TemporalDiscountingInput {
  readonly futureReward: number;
  readonly delayTicks: number;
  readonly discountRate: number;
  readonly phiCorrection: boolean;
}

export interface TemporalDiscountingOutput {
  readonly law: 'L-79';
  readonly presentValue: number;
  readonly hyperboleFactor: number;
  readonly phiCorrectedValue: number;
  readonly shortTermismIndex: number;
}

export function computeL79(input: TemporalDiscountingInput): TemporalDiscountingOutput {
  const hyperboleFactor = 1 / (1 + input.discountRate * input.delayTicks);
  const presentValue = input.futureReward * hyperboleFactor;
  const phiCorrectedValue = input.phiCorrection
    ? presentValue * Math.pow(PHI_INVERSE, input.delayTicks * 0.01)
    : presentValue;
  const shortTermismIndex = Math.max(0, 1 - hyperboleFactor);
  return {
    law: 'L-79',
    presentValue,
    hyperboleFactor,
    phiCorrectedValue,
    shortTermismIndex,
  };
}

// ══════════════════════════════════════════════════════════════════
//  BEHAVIORAL ECONOMICS ENGINE
// ══════════════════════════════════════════════════════════════════

export const ALL_BEHAVIORAL_LAWS = [
  LAW_L72_REWARD_SIGNAL,
  LAW_L73_DATA_REWARD_EQUIVALENCE,
  LAW_L74_BEHAVIORAL_ASYMMETRY,
  LAW_L75_VARIABLE_EMERGENCE,
  LAW_L76_FLOW_STATE,
  LAW_L77_DRIVE_COMMITMENT,
  LAW_L78_HORMETIC_STRESS,
  LAW_L79_TEMPORAL_DISCOUNTING,
] as const;

export interface BehavioralState {
  readonly tick: number;
  readonly currentFlowScore: number;
  readonly currentDrive: number;
  readonly accumulatedReward: number;
  readonly lossesExperienced: number;
  readonly gainsExperienced: number;
  readonly kahnemanRatio: number;
  readonly adaptationLevel: number;
}

export class BehavioralEconomicsEngine {
  static readonly LEX_OECONOMIA_001 = LEX_OECONOMIA_001;
  static readonly LOSS_AVERSION_LAMBDA = LOSS_AVERSION_LAMBDA;
  static readonly ALL_LAWS = ALL_BEHAVIORAL_LAWS;

  private _tick = 0;
  private _accumulatedReward = 0;
  private _lossesTotal = 0;
  private _gainsTotal = 0;
  private _adaptationLevel = 1.0;
  private _drive = 0.5;

  processEvent(params: {
    gainSignal: number;
    lossSignal: number;
    challenge: number;
    capability: number;
    stressLoad: number;
    novelData: number;
    futureReward: number;
    delayTicks: number;
    commitmentPublicity?: number;
  }): {
    l72: RewardSignalOutput;
    l73: DataRewardOutput;
    l74: BehavioralAsymmetryOutput;
    l75: VariableEmergenceOutput;
    l76: FlowStateOutput;
    l77: DriveCommitmentOutput;
    l78: HormeticStressOutput;
    l79: TemporalDiscountingOutput;
    netBehavioralResponse: number;
    kahnemanAdjusted: number;
  } {
    this._tick++;

    const l72 = computeL72({ baseSignal: params.gainSignal, dimensionalScalar: 1, decayRate: 0.01, tick: this._tick });
    const l73 = computeL73({ novelty: params.novelData, informationDensity: 0.7, dataQuality: 0.9 });
    const l74 = computeL74({ gainSignal: params.gainSignal, lossSignal: params.lossSignal, referencePoint: 0.5 });
    const l75 = computeL75({ baseReward: params.gainSignal, tick: this._tick, varianceAmplitude: 0.3 });
    const l76 = computeL76({ challenge: params.challenge, capability: params.capability });
    const l77 = computeL77({
      baseDrive: this._drive,
      commitmentPublicity: params.commitmentPublicity ?? 0.5,
      goalClarity: 0.8,
      consistencyHistory: 0.7,
    });
    const l78 = computeL78({ stressLoad: params.stressLoad, recoveryTime: 1.0, baselineCapacity: this._adaptationLevel });
    const l79 = computeL79({ futureReward: params.futureReward, delayTicks: params.delayTicks, discountRate: 0.01, phiCorrection: true });

    const netBehavioralResponse = l74.gainResponse - l74.lossResponse;
    const kahnemanAdjusted = netBehavioralResponse * l76.throughputMultiplier * l77.commitmentCoefficient;

    this._accumulatedReward += l72.phiWeightedReward;
    this._gainsTotal += params.gainSignal;
    this._lossesTotal += params.lossSignal;
    this._adaptationLevel = Math.max(0, Math.min(2, this._adaptationLevel + l78.adaptationGain));
    this._drive = l77.effectiveDrive;

    return { l72, l73, l74, l75, l76, l77, l78, l79, netBehavioralResponse, kahnemanAdjusted };
  }

  state(): BehavioralState {
    const kahnemanRatio = this._gainsTotal > 0 ? this._lossesTotal / this._gainsTotal * LOSS_AVERSION_LAMBDA : 0;
    return {
      tick: this._tick,
      currentFlowScore: 0,
      currentDrive: this._drive,
      accumulatedReward: this._accumulatedReward,
      lossesExperienced: this._lossesTotal,
      gainsExperienced: this._gainsTotal,
      kahnemanRatio,
      adaptationLevel: this._adaptationLevel,
    };
  }
}

export function createBehavioralEconomicsEngine(): BehavioralEconomicsEngine {
  return new BehavioralEconomicsEngine();
}
