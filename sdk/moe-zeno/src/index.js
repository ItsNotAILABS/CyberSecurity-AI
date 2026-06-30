///
/// @medina/moe-zeno — MIXTURE OF EXPERTS: ZENO
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║     ZENO — PARADOX-RESOLVING EXPERT CONVERGENCE via INFINITE SERIES         ║
/// ║                                                                              ║
/// ║  Named for Zeno of Elea — philosopher of infinite divisibility.             ║
/// ║                                                                              ║
/// ║  Architecture: Iterative MoE where each expert refines the previous         ║
/// ║  expert's output by half (or φ⁻¹). Like Zeno's arrow, each expert          ║
/// ║  covers half the remaining "distance to truth." The series converges        ║
/// ║  because Σ(1/2ⁿ) = 1 (or Σφ⁻ⁿ = φ).                                      ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Geometric series: Σ_{n=0}^∞ rⁿ = 1/(1−r) for |r|<1                   ║
/// ║    • φ-convergence: Σ φ⁻ⁿ = φ (golden series sums to φ)                    ║
/// ║    • Dichotomy paradox: expert_n covers φ⁻ⁿ of remaining error             ║
/// ║    • Achilles refinement: faster expert chases slower's residual error      ║
/// ║    • Arrow instantaneity: each expert is complete in its time-slice         ║
/// ║    • Convergence criterion: |residual| < φ⁻ᴺ (N = num experts)             ║
/// ║    • Cauchy completion: series is Cauchy → converges in expert space        ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
export const SQRT_FIVE = Math.sqrt(5);
export const PHI = (1 + SQRT_FIVE) / 2;
export const INVERSE_PHI = 1 / PHI;
export const PHI_SQUARED = PHI * PHI;
export const PHI_SERIES_SUM = PHI;
export const DEFAULT_RATIO = INVERSE_PHI;
export const DEFAULT_TOLERANCE = 1e-9;
export const DEFAULT_MAX_EXPERTS = 24;
export const DEFAULT_STABILITY_WINDOW = 4;
export const MATH_CONSTANTS = Object.freeze({
  SQRT_FIVE,
  PHI,
  INVERSE_PHI,
  PHI_SQUARED,
  PHI_SERIES_SUM,
  DEFAULT_RATIO,
  DEFAULT_TOLERANCE,
  DEFAULT_MAX_EXPERTS,
  DEFAULT_STABILITY_WINDOW
});
function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}
function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function cloneValue(value) {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, cloneValue(nested)]));
  return value;
}
function zeroLike(value) {
  if (isFiniteNumber(value)) return 0;
  if (Array.isArray(value)) return value.map(zeroLike);
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, zeroLike(nested)]));
  return 0;
}
function addValues(left, right) {
  if (left === undefined || left === null) return cloneValue(right);
  if (right === undefined || right === null) return cloneValue(left);
  if (isFiniteNumber(left) && isFiniteNumber(right)) return left + right;
  if (Array.isArray(left) && Array.isArray(right)) {
    const size = Math.max(left.length, right.length);
    return Array.from({ length: size }, (_, index) => addValues(left[index] ?? 0, right[index] ?? 0));
  }
  if (isPlainObject(left) && isPlainObject(right)) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    return Object.fromEntries(Array.from(keys, (key) => [key, addValues(left[key] ?? 0, right[key] ?? 0)]));
  }
  throw new TypeError('ZENO can only add numbers, arrays, and plain objects of matching shape.');
}
function scaleValue(value, factor) {
  if (value === undefined || value === null) return 0;
  if (isFiniteNumber(value)) return value * factor;
  if (Array.isArray(value)) return value.map((item) => scaleValue(item, factor));
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, scaleValue(nested, factor)]));
  throw new TypeError('ZENO can only scale numbers, arrays, and plain objects.');
}
function subtractValues(left, right) {
  return addValues(left, scaleValue(right, -1));
}
function valueNorm(value) {
  if (value === undefined || value === null) return 0;
  if (isFiniteNumber(value)) return Math.abs(value);
  if (Array.isArray(value)) return Math.sqrt(value.reduce((sum, item) => sum + valueNorm(item) ** 2, 0));
  if (isPlainObject(value)) return Math.sqrt(Object.values(value).reduce((sum, item) => sum + valueNorm(item) ** 2, 0));
  return 0;
}
function structuralDistance(left, right) {
  return valueNorm(subtractValues(left, right));
}
function weightedBlend(entries, fallback) {
  if (!entries.length) return cloneValue(fallback);
  const totalWeight = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (!totalWeight) return cloneValue(fallback);
  return entries.reduce(
    (accumulator, entry) => addValues(accumulator, scaleValue(entry.value, entry.weight / totalWeight)),
    zeroLike(entries[0].value)
  );
}
function signOf(value) {
  if (!isFiniteNumber(value) || value === 0) return 0;
  return value > 0 ? 1 : -1;
}
export class GeometricSeriesEngine {
  constructor({ ratio = DEFAULT_RATIO, tolerance = DEFAULT_TOLERANCE, maxTerms = DEFAULT_MAX_EXPERTS } = {}) {
    if (!(ratio > 0 && ratio < 1)) throw new RangeError('GeometricSeriesEngine ratio must satisfy 0 < r < 1.');
    this.ratio = ratio;
    this.tolerance = tolerance;
    this.maxTerms = maxTerms;
  }
  term(depth, amplitude = 1) {
    if (!Number.isInteger(depth) || depth < 0) throw new RangeError('GeometricSeriesEngine depth must be a non-negative integer.');
    return amplitude * (this.ratio ** depth);
  }
  partialSum(terms, amplitude = 1) {
    if (!Number.isInteger(terms) || terms < 0) throw new RangeError('GeometricSeriesEngine terms must be a non-negative integer.');
    if (terms === 0) return 0;
    return amplitude * ((1 - this.ratio ** terms) / (1 - this.ratio));
  }
  limit(amplitude = 1) {
    return amplitude / (1 - this.ratio);
  }
  residualAfter(terms, amplitude = 1) {
    return this.limit(amplitude) - this.partialSum(terms, amplitude);
  }
  residualWeight(depth) {
    return this.term(depth + 1, 1);
  }
  normalizedWeights(count) {
    const weights = Array.from({ length: count }, (_, depth) => this.term(depth, 1));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    return weights.map((weight) => weight / total);
  }
  refineResidual(residual, depth) {
    return scaleValue(residual, this.term(depth, 1));
  }
  convergenceDepth(amplitude = 1) {
    let depth = 0;
    while (depth < this.maxTerms && this.residualAfter(depth + 1, amplitude) > this.tolerance) depth += 1;
    return depth + 1;
  }
  generateSequence(count, amplitude = 1) {
    return Array.from({ length: count }, (_, depth) => this.term(depth, amplitude));
  }
  profile(count) {
    const weights = this.normalizedWeights(count);
    return weights.map((weight, depth) => ({ depth, weight, residualWeight: this.residualWeight(depth) }));
  }
}
export class DichotomyExpert {
  constructor({ depth = 0, engine = new GeometricSeriesEngine(), bias = 1, name, transform } = {}) {
    if (!Number.isInteger(depth) || depth < 0) throw new RangeError('DichotomyExpert depth must be a non-negative integer.');
    this.depth = depth;
    this.engine = engine;
    this.bias = bias;
    this.transform = transform;
    this.name = name ?? `dichotomy-expert-${depth + 1}`;
  }
  coverage() {
    return this.engine.term(this.depth, this.bias);
  }
  evaluate({ residual, currentEstimate, input, target, context = {} } = {}) {
    const baselineCorrection = this.engine.refineResidual(residual, this.depth);
    const transformed = typeof this.transform === 'function'
      ? this.transform({ residual, currentEstimate, input, target, context, expert: this })
      : baselineCorrection;
    const correction = scaleValue(transformed, this.bias);
    return {
      expert: this.name,
      depth: this.depth,
      input,
      target,
      context,
      currentEstimate: cloneValue(currentEstimate),
      residualNorm: valueNorm(residual),
      coverage: this.coverage(),
      correction,
      confidence: Math.max(0, 1 - this.engine.residualWeight(this.depth)),
      rationale: `Expert ${this.name} covers φ⁻${this.depth} of the remaining error.`
    };
  }
}
export class AchillesRefinement {
  constructor({ engine = new GeometricSeriesEngine(), acceleration = PHI, damping = INVERSE_PHI, maxChases = 3 } = {}) {
    this.engine = engine;
    this.acceleration = acceleration;
    this.damping = damping;
    this.maxChases = maxChases;
  }
  chase({ residual, slowContribution, depth = 0 } = {}) {
    const steps = [];
    let aggregate = zeroLike(residual);
    let remaining = subtractValues(residual, slowContribution ?? zeroLike(residual));
    for (let index = 0; index < this.maxChases; index += 1) {
      const pace = this.engine.term(depth + index + 1, this.acceleration * (this.damping ** index));
      const step = scaleValue(remaining, Math.min(pace, 1));
      aggregate = addValues(aggregate, step);
      remaining = subtractValues(remaining, step);
      steps.push({ chase: index + 1, pace, capturedNorm: valueNorm(step), residualNorm: valueNorm(remaining) });
      if (valueNorm(remaining) <= this.engine.tolerance) break;
    }
    return {
      correction: aggregate,
      residualAfterChase: remaining,
      steps,
      acceleration: this.acceleration,
      achievedCatchUp: valueNorm(remaining) <= this.engine.tolerance
    };
  }
}
export class ConvergenceCriterion {
  constructor({
    tolerance = DEFAULT_TOLERANCE,
    ratio = DEFAULT_RATIO,
    maxIterations = DEFAULT_MAX_EXPERTS,
    stabilityWindow = DEFAULT_STABILITY_WINDOW
  } = {}) {
    this.tolerance = tolerance;
    this.ratio = ratio;
    this.maxIterations = maxIterations;
    this.stabilityWindow = stabilityWindow;
  }
  threshold(depth) {
    return Math.max(this.tolerance, this.ratio ** Math.max(depth, 0));
  }
  residualSatisfied(residual, depth) {
    return valueNorm(residual) <= this.threshold(depth + 1);
  }
  isCauchy(sequence) {
    if (sequence.length < this.stabilityWindow + 1) return false;
    const window = sequence.slice(-1 - this.stabilityWindow);
    for (let index = 1; index < window.length; index += 1) {
      if (structuralDistance(window[index], window[index - 1]) > this.tolerance * PHI) return false;
    }
    return true;
  }
  hasConverged({ residual, depth, estimates }) {
    const residualNorm = valueNorm(residual);
    const residualPass = this.residualSatisfied(residual, depth);
    const cauchyPass = this.isCauchy(estimates);
    const exhausted = depth + 1 >= this.maxIterations;
    return {
      converged: residualPass || cauchyPass || exhausted,
      reason: residualPass ? 'residual-threshold' : cauchyPass ? 'cauchy-completion' : exhausted ? 'iteration-cap' : 'continuing',
      residualNorm,
      threshold: this.threshold(depth + 1),
      cauchyPass,
      exhausted
    };
  }
  summarize(history, residual) {
    return {
      iterations: history.length,
      residualNorm: valueNorm(residual),
      lastStep: history[history.length - 1] ?? null,
      stable: this.isCauchy(history.map((entry) => entry.estimateAfter ?? 0))
    };
  }
}
export class ParadoxResolver {
  constructor({ disagreementTolerance = 0.25, smoothing = INVERSE_PHI } = {}) {
    this.disagreementTolerance = disagreementTolerance;
    this.smoothing = smoothing;
  }
  detect({ candidate, previousCandidate, residual, nextResidual } = {}) {
    const flags = [];
    const candidateNorm = valueNorm(candidate);
    const previousNorm = valueNorm(previousCandidate);
    const currentResidualNorm = valueNorm(residual);
    const nextResidualNorm = valueNorm(nextResidual);
    if (
      isFiniteNumber(candidate) &&
      isFiniteNumber(previousCandidate) &&
      signOf(candidate) !== 0 &&
      signOf(candidate) === -signOf(previousCandidate) &&
      Math.min(candidateNorm, previousNorm) / Math.max(candidateNorm, previousNorm || 1) >= 1 - this.disagreementTolerance
    ) flags.push('oscillation');
    if (nextResidualNorm > currentResidualNorm * (1 + this.disagreementTolerance)) flags.push('divergence');
    if (candidateNorm > currentResidualNorm * (1 + this.disagreementTolerance)) flags.push('overshoot');
    return flags;
  }
  resolve({ candidate, previousCandidate, residual, history = [] } = {}) {
    const naiveNextResidual = subtractValues(residual, candidate);
    const flags = this.detect({ candidate, previousCandidate, residual, nextResidual: naiveNextResidual });
    if (!flags.length) {
      return {
        resolvedCorrection: candidate,
        residualAfterResolution: naiveNextResidual,
        flags,
        paradoxResolved: false,
        consensusShift: 0
      };
    }
    const entries = [{ value: candidate, weight: 1 }, { value: residual, weight: this.smoothing }];
    if (previousCandidate !== undefined) entries.push({ value: previousCandidate, weight: this.smoothing ** 2 });
    const blendedCandidate = weightedBlend(entries, candidate);
    const resolvedCorrection = flags.includes('divergence')
      ? scaleValue(candidate, this.smoothing ** 2)
      : scaleValue(blendedCandidate, this.smoothing);
    return {
      resolvedCorrection,
      residualAfterResolution: subtractValues(residual, resolvedCorrection),
      flags,
      paradoxResolved: true,
      consensusShift: structuralDistance(candidate, resolvedCorrection),
      historyDepth: history.length
    };
  }
  resolveConsensus(outputs) {
    if (!Array.isArray(outputs) || !outputs.length) return null;
    return weightedBlend(outputs.map((output, index) => ({ value: output, weight: DEFAULT_RATIO ** index })), outputs[0]);
  }
}
export class MoEZeno {
  constructor({
    ratio = DEFAULT_RATIO,
    tolerance = DEFAULT_TOLERANCE,
    maxExperts = DEFAULT_MAX_EXPERTS,
    experts = [],
    engine,
    criterion,
    paradoxResolver,
    achilles
  } = {}) {
    this.engine = engine ?? new GeometricSeriesEngine({ ratio, tolerance, maxTerms: maxExperts });
    this.criterion = criterion ?? new ConvergenceCriterion({ tolerance, ratio, maxIterations: maxExperts });
    this.paradoxResolver = paradoxResolver ?? new ParadoxResolver();
    this.achilles = achilles ?? new AchillesRefinement({ engine: this.engine });
    this.maxExperts = maxExperts;
    this.experts = experts.map((expert, index) => this._materializeExpert(expert, index));
  }
  _materializeExpert(expert, depth) {
    if (expert instanceof DichotomyExpert) return expert;
    if (typeof expert === 'function') return { name: expert.name || `custom-expert-${depth + 1}`, depth, evaluate: expert };
    return new DichotomyExpert({ ...expert, depth, engine: this.engine });
  }
  addExpert(expert) {
    const materialized = this._materializeExpert(expert, this.experts.length);
    this.experts.push(materialized);
    return materialized;
  }
  getExpert(depth) {
    if (depth < this.experts.length) return this.experts[depth];
    const expert = new DichotomyExpert({ depth, engine: this.engine });
    this.experts.push(expert);
    return expert;
  }
  _normalizeExpertResult(result, expert, residual) {
    if (result && isPlainObject(result) && Object.prototype.hasOwnProperty.call(result, 'correction')) {
      return {
        expert: result.expert ?? expert.name,
        correction: result.correction,
        confidence: result.confidence ?? 0.5,
        rationale: result.rationale,
        coverage: result.coverage ?? this.engine.term(expert.depth ?? 0, 1)
      };
    }
    return {
      expert: expert.name,
      correction: result ?? zeroLike(residual),
      confidence: 0.5,
      coverage: this.engine.term(expert.depth ?? 0, 1),
      rationale: 'Custom expert returned a direct correction.'
    };
  }
  _selectTarget(target, input) {
    if (typeof target === 'function') return target(input);
    if (target !== undefined) return cloneValue(target);
    if (input !== undefined) return cloneValue(input);
    throw new TypeError('MoEZeno.solve requires either a target or an input to converge toward.');
  }
  solve({ input, target, initialGuess, context = {}, maxExperts = this.maxExperts, useAchilles = true } = {}) {
    const desired = this._selectTarget(target, input);
    let estimate = initialGuess !== undefined ? cloneValue(initialGuess) : zeroLike(desired);
    let residual = subtractValues(desired, estimate);
    let previousCorrection = zeroLike(desired);
    const history = [];
    const estimates = [cloneValue(estimate)];
    let finalStatus = null;
    for (let depth = 0; depth < maxExperts; depth += 1) {
      const expert = this.getExpert(depth);
      const rawResult = expert.evaluate({ input, target: desired, residual, currentEstimate: estimate, context, history: history.slice() });
      const normalized = this._normalizeExpertResult(rawResult, expert, residual);
      let correction = normalized.correction;
      let achillesTrace = null;
      if (useAchilles) {
        achillesTrace = this.achilles.chase({ residual, slowContribution: correction, depth });
        correction = addValues(correction, achillesTrace.correction);
      }
      const resolution = this.paradoxResolver.resolve({ candidate: correction, previousCandidate: previousCorrection, residual, history });
      const appliedCorrection = resolution.resolvedCorrection;
      estimate = addValues(estimate, appliedCorrection);
      residual = subtractValues(desired, estimate);
      estimates.push(cloneValue(estimate));
      const step = {
        iteration: depth + 1,
        expert: normalized.expert,
        coverage: normalized.coverage,
        confidence: normalized.confidence,
        rationale: normalized.rationale,
        proposedCorrection: correction,
        appliedCorrection,
        residualNorm: valueNorm(residual),
        paradoxFlags: resolution.flags,
        paradoxResolved: resolution.paradoxResolved,
        achilles: achillesTrace,
        estimateAfter: cloneValue(estimate)
      };
      history.push(step);
      previousCorrection = appliedCorrection;
      finalStatus = this.criterion.hasConverged({ residual, depth, estimates });
      if (finalStatus.converged) break;
    }
    if (!finalStatus) finalStatus = this.criterion.hasConverged({ residual, depth: maxExperts - 1, estimates });
    return {
      input,
      target: desired,
      value: estimate,
      residual,
      converged: finalStatus.converged,
      iterations: history.length,
      reason: finalStatus.reason,
      history,
      diagnostics: {
        residualNorm: valueNorm(residual),
        threshold: finalStatus.threshold,
        cauchyPass: finalStatus.cauchyPass,
        exhausted: finalStatus.exhausted,
        expertCount: this.experts.length,
        theoreticalDepth: this.engine.convergenceDepth(1),
        criterion: this.criterion.summarize(history, residual)
      }
    };
  }
  refine(options = {}) {
    return this.solve(options);
  }
  consensus(outputs) {
    return this.paradoxResolver.resolveConsensus(outputs);
  }
}
const zeno = {
  ...MATH_CONSTANTS,
  GeometricSeriesEngine,
  DichotomyExpert,
  AchillesRefinement,
  ConvergenceCriterion,
  ParadoxResolver,
  MoEZeno
};
export default zeno;
