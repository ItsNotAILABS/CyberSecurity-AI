///
/// @medina/moe-laplace — MIXTURE OF EXPERTS: LAPLACE
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║   LAPLACE — PROBABILISTIC WORLD MODEL via BAYESIAN INFERENCE                ║
/// ║                                                                              ║
/// ║  Named for Pierre-Simon Laplace — architect of probabilistic determinism.   ║
/// ║                                                                              ║
/// ║  Architecture: World model where every state is a probability distribution.  ║
/// ║  Experts are Bayesian updaters specializing in different likelihood models.  ║
/// ║  Prediction = computing posterior distributions over future states.          ║
/// ║  Laplace's demon: given perfect information, predict everything.             ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Bayes' theorem: P(H|E) = P(E|H)·P(H)/P(E) — posterior from prior       ║
/// ║    • φ-Prior: P₀(x) = (φ/√(2π))·exp(−φ²·x²/2) — golden Gaussian prior      ║
/// ║    • Laplace transform: F(s) = ∫₀^∞ f(t)·e^(−st) dt — temporal→frequency    ║
/// ║    • Deterministic limit: as uncertainty→0, posterior→delta function        ║
/// ║    • Bayesian update: Pₙ₊₁ = Pₙ · L(evidence) / Z — iterative refinement    ║
/// ║    • Posterior entropy: H = −∫ P(x)·log(P(x)) dx — remaining uncertainty    ║
/// ║    • Laplace succession: P(next|data) = (k+φ)/(n+2φ) — smoothed prediction  ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI * PHI;
export const TAU = Math.PI * 2;
export const PI = Math.PI;
export const EPSILON = 1e-9;
export const LOG_PHI = Math.log(PHI);
const SQRT_TWO_PI = Math.sqrt(2 * PI);
const DEFAULT_RESOLUTION = 7;
const DEFAULT_HISTORY_LIMIT = 144;
const PRIOR_TYPES = Object.freeze(['gaussian', 'laplace', 'cauchy', 'succession', 'harmonic']);
function assertFiniteNumber(name, value) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
}
function assertPositiveInteger(name, value) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive integer.`);
  }
}
function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}
function sum(values) {
  return values.reduce((accumulator, value) => accumulator + value, 0);
}
function mean(values) {
  return values.length ? sum(values) / values.length : 0;
}
function dot(left, right) {
  return left.reduce((accumulator, value, index) => accumulator + value * right[index], 0);
}
function add(left, right) {
  return left.map((value, index) => value + right[index]);
}
function sub(left, right) {
  return left.map((value, index) => value - right[index]);
}
function scale(vector, scalar) {
  return vector.map((value) => value * scalar);
}
function magnitude(vector) {
  return Math.sqrt(Math.max(dot(vector, vector), 0));
}
function normalizeVector(vector) {
  const length = magnitude(vector);
  if (length <= EPSILON) {
    return vector.map((_, index) => (index === 0 ? 1 : 0));
  }
  return vector.map((value) => value / length);
}
function distance(left, right) {
  return magnitude(sub(left, right));
}
function varianceOf(values, average = mean(values)) {
  return mean(values.map((value) => (value - average) ** 2));
}
function zeros(length) {
  return new Array(length).fill(0);
}
function hashString(input) {
  const text = String(input);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
function createRng(seed = 0) {
  let state = (Math.abs(Math.trunc(seed)) + 1) >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}
function flattenEvidence(value, out = []) {
  if (value == null) {
    out.push(0);
    return out;
  }
  if (typeof value === 'number') {
    out.push(Number.isFinite(value) ? value : 0);
    return out;
  }
  if (typeof value === 'bigint') {
    out.push(Number(value));
    return out;
  }
  if (typeof value === 'boolean') {
    out.push(value ? 1 : -1);
    return out;
  }
  if (typeof value === 'string') {
    for (let index = 0; index < value.length; index += 1) {
      out.push((value.charCodeAt(index) / 127) * 2 - 1);
    }
    return out;
  }
  if (Array.isArray(value)) {
    for (const entry of value) {
      flattenEvidence(entry, out);
    }
    return out;
  }
  if (typeof value === 'object') {
    for (const key of Object.keys(value).sort()) {
      flattenEvidence(key, out);
      flattenEvidence(value[key], out);
    }
    return out;
  }
  out.push(0);
  return out;
}
function resizeVector(values, dimensions) {
  const source = [...values];
  if (!source.length) {
    return zeros(dimensions);
  }
  if (source.length >= dimensions) {
    return source.slice(0, dimensions);
  }
  const output = [...source];
  const average = mean(source);
  while (output.length < dimensions) {
    const index = output.length;
    const resonance = Math.sin((index + 1) * PHI_INV) * PHI_INV;
    output.push(average * PHI_INV + resonance);
  }
  return output;
}
function coerceVector(value, dimensions) {
  const vector = resizeVector(flattenEvidence(value), dimensions);
  vector.forEach((entry, index) => assertFiniteNumber(`vector[${index}]`, entry));
  return vector;
}
function softmax(values, temperature = 1) {
  const safeTemperature = Math.max(Math.abs(temperature), EPSILON);
  const scaled = values.map((value) => value / safeTemperature);
  const maxValue = Math.max(...scaled);
  const exponentials = scaled.map((value) => Math.exp(value - maxValue));
  const denominator = Math.max(sum(exponentials), EPSILON);
  return exponentials.map((value) => value / denominator);
}
function weightedAverage(vectors, weights) {
  if (!vectors.length) {
    return [];
  }
  const normalized = normalizeWeights(weights);
  const output = zeros(vectors[0].length);
  for (let vectorIndex = 0; vectorIndex < vectors.length; vectorIndex += 1) {
    for (let dimensionIndex = 0; dimensionIndex < output.length; dimensionIndex += 1) {
      output[dimensionIndex] += vectors[vectorIndex][dimensionIndex] * normalized[vectorIndex];
    }
  }
  return output;
}
function normalizeWeights(weights) {
  const total = Math.max(sum(weights), EPSILON);
  return weights.map((weight) => weight / total);
}
function computeEntropy(weights) {
  return -weights.reduce((entropy, weight) => {
    if (weight <= EPSILON) {
      return entropy;
    }
    return entropy + weight * Math.log(weight);
  }, 0);
}
function gaussianKernel(distanceSquared, precision) {
  return Math.exp(-0.5 * Math.max(precision, EPSILON) * distanceSquared);
}
function phiPriorDensity(vector) {
  const values = Array.isArray(vector) ? vector : [vector];
  return values.reduce((density, value) => {
    const scalar = (PHI / SQRT_TWO_PI) * Math.exp(-(PHI_SQ * value * value) / 2);
    return density * Math.max(scalar, EPSILON);
  }, 1);
}
function laplaceSuccession(successes, trials) {
  return (successes + PHI) / (trials + 2 * PHI);
}
function sequenceAxis(length, minimum = -PHI, maximum = PHI) {
  if (length === 1) {
    return [0];
  }
  return Array.from({ length }, (_, index) => minimum + ((maximum - minimum) * index) / (length - 1));
}
function extractVariance(candidate, dimensions) {
  if (candidate && Array.isArray(candidate.variance)) {
    return resizeVector(candidate.variance, dimensions).map((value) => Math.max(Math.abs(value), EPSILON));
  }
  if (candidate && typeof candidate.entropy === 'function') {
    return new Array(dimensions).fill(Math.max(candidate.entropy() * PHI_INV, EPSILON));
  }
  return new Array(dimensions).fill(PHI_INV);
}
export class ProbabilityField {
  constructor({ dimensions = 3, resolution = DEFAULT_RESOLUTION } = {}) {
    assertPositiveInteger('dimensions', dimensions);
    assertPositiveInteger('resolution', resolution);
    this.dimensions = dimensions;
    this.resolution = resolution;
    this.axes = sequenceAxis(resolution);
    this.cellCount = resolution ** dimensions;
    this.masses = new Float64Array(this.cellCount);
    this.lastSample = null;
    this.totalMass = 0;
    for (let index = 0; index < this.cellCount; index += 1) {
      const position = this.indexToPosition(index);
      this.masses[index] = phiPriorDensity(position);
    }
    this.normalize();
  }
  indexToCoordinates(index) {
    let cursor = index;
    const coordinates = new Array(this.dimensions).fill(0);
    for (let dimension = this.dimensions - 1; dimension >= 0; dimension -= 1) {
      coordinates[dimension] = cursor % this.resolution;
      cursor = Math.floor(cursor / this.resolution);
    }
    return coordinates;
  }
  coordinatesToIndex(coordinates) {
    let index = 0;
    for (let dimension = 0; dimension < this.dimensions; dimension += 1) {
      index *= this.resolution;
      index += clamp(Math.round(coordinates[dimension]), 0, this.resolution - 1);
    }
    return index;
  }
  indexToPosition(index) {
    const coordinates = this.indexToCoordinates(index);
    return coordinates.map((coordinate) => this.axes[coordinate]);
  }
  positionToCoordinates(position) {
    const vector = coerceVector(position, this.dimensions);
    return vector.map((value) => {
      const normalized = (value + PHI) / (2 * PHI);
      return clamp(Math.round(normalized * (this.resolution - 1)), 0, this.resolution - 1);
    });
  }
  positionToIndex(position) {
    return this.coordinatesToIndex(this.positionToCoordinates(position));
  }
  normalize() {
    const total = sum(Array.from(this.masses));
    const denominator = total <= EPSILON ? 1 : total;
    for (let index = 0; index < this.masses.length; index += 1) {
      this.masses[index] /= denominator;
    }
    this.totalMass = sum(Array.from(this.masses));
    this._refreshMoments();
    return this;
  }
  _refreshMoments() {
    this.meanVector = zeros(this.dimensions);
    for (let index = 0; index < this.cellCount; index += 1) {
      const probability = this.masses[index];
      const position = this.indexToPosition(index);
      for (let dimension = 0; dimension < this.dimensions; dimension += 1) {
        this.meanVector[dimension] += position[dimension] * probability;
      }
    }
    this.varianceVector = zeros(this.dimensions);
    for (let index = 0; index < this.cellCount; index += 1) {
      const probability = this.masses[index];
      const position = this.indexToPosition(index);
      for (let dimension = 0; dimension < this.dimensions; dimension += 1) {
        const residual = position[dimension] - this.meanVector[dimension];
        this.varianceVector[dimension] += residual * residual * probability;
      }
    }
  }
  mean() {
    return [...this.meanVector];
  }
  variance() {
    return [...this.varianceVector];
  }
  condition(likelihoodFn) {
    for (let index = 0; index < this.cellCount; index += 1) {
      const position = this.indexToPosition(index);
      const likelihood = Math.max(EPSILON, Number(likelihoodFn(position, this.masses[index], index)) || EPSILON);
      this.masses[index] *= likelihood;
    }
    return this.normalize();
  }
  sample(position) {
    const vector = coerceVector(position, this.dimensions);
    const index = this.positionToIndex(vector);
    const probability = this.masses[index];
    const sample = {
      index,
      position: this.indexToPosition(index),
      probability,
      density: this.density(vector),
    };
    this.lastSample = sample;
    return sample;
  }
  density(x) {
    const vector = coerceVector(x, this.dimensions);
    const variance = this.varianceVector.map((value) => Math.max(value, EPSILON));
    const residual = sub(vector, this.meanVector);
    const exponent = residual.reduce((accumulator, value, index) => accumulator + (value * value) / variance[index], 0);
    const scaleFactor = variance.reduce((accumulator, value) => accumulator * Math.sqrt(2 * PI * value), 1);
    return Math.exp(-0.5 * exponent) / Math.max(scaleFactor, EPSILON);
  }
  entropy() {
    return computeEntropy(Array.from(this.masses));
  }
  marginal(dimension) {
    if (!Number.isInteger(dimension) || dimension < 0 || dimension >= this.dimensions) {
      throw new RangeError(`dimension must be between 0 and ${this.dimensions - 1}.`);
    }
    const probabilities = new Array(this.resolution).fill(0);
    for (let index = 0; index < this.cellCount; index += 1) {
      const coordinates = this.indexToCoordinates(index);
      probabilities[coordinates[dimension]] += this.masses[index];
    }
    const axis = [...this.axes];
    const marginalMean = axis.reduce((accumulator, value, index) => accumulator + value * probabilities[index], 0);
    const marginalVariance = axis.reduce((accumulator, value, index) => accumulator + ((value - marginalMean) ** 2) * probabilities[index], 0);
    return {
      dimension,
      axis,
      probabilities,
      mean: marginalMean,
      variance: marginalVariance,
      entropy: computeEntropy(probabilities),
    };
  }
}
export class BayesianExpert {
  constructor({ id, priorType = 'gaussian', dimensions = 3, seed = 0 } = {}) {
    if (!id) {
      throw new TypeError('BayesianExpert requires an id.');
    }
    assertPositiveInteger('dimensions', dimensions);
    this.id = id;
    this.priorType = PRIOR_TYPES.includes(priorType) ? priorType : 'gaussian';
    this.dimensions = dimensions;
    this.seed = seed;
    this.rng = createRng(hashString(`${id}:${seed}:${this.priorType}`));
    this.field = new ProbabilityField({ dimensions, resolution: DEFAULT_RESOLUTION });
    this.priorMean = Array.from({ length: dimensions }, (_, index) => (this.rng() - 0.5) * PHI_INV * (index + 1) / dimensions);
    this.posteriorMean = [...this.priorMean];
    this.posteriorVariance = new Array(dimensions).fill(PHI_INV);
    this.precisionVector = this.posteriorVariance.map((value) => 1 / Math.max(value, EPSILON));
    this.observationCount = 0;
    this.evidenceHistory = [];
    this.field.condition((position) => phiPriorDensity(sub(position, this.priorMean)));
  }
  _vectorize(value) {
    return coerceVector(value, this.dimensions);
  }
  _predictiveMean() {
    return this.posteriorMean.map((value, index) => {
      const oscillation = Math.sin((this.observationCount + 1) * (index + 1) * PHI_INV) * Math.sqrt(this.posteriorVariance[index] + EPSILON) * PHI_INV;
      return value + oscillation;
    });
  }
  forward(observation) {
    const vector = this._vectorize(observation);
    const hypothesis = this._predictiveMean();
    const likelihood = this.likelihood(vector, hypothesis);
    const posterior = this.posterior();
    return {
      id: this.id,
      observation: vector,
      hypothesis,
      likelihood,
      posterior,
      confidence: clamp(likelihood * posterior.confidence * PHI, EPSILON, 1),
    };
  }
  update(evidence) {
    const vector = this._vectorize(evidence);
    this.observationCount += 1;
    this.field.condition((position) => {
      const prior = phiPriorDensity(sub(position, this.posteriorMean));
      const likelihood = this.likelihood(vector, position);
      return prior * likelihood;
    });
    this.posteriorMean = this.field.mean();
    this.posteriorVariance = this.field.variance().map((value) => Math.max(value, EPSILON));
    this.precisionVector = this.posteriorVariance.map((value) => 1 / Math.max(value, EPSILON));
    this.evidenceHistory.push({
      step: this.observationCount,
      evidence: vector,
      confidence: this.confidence(),
    });
    if (this.evidenceHistory.length > DEFAULT_HISTORY_LIMIT) {
      this.evidenceHistory.shift();
    }
    return this.posterior();
  }
  posterior() {
    return {
      id: this.id,
      priorType: this.priorType,
      mean: [...this.posteriorMean],
      variance: [...this.posteriorVariance],
      entropy: this.field.entropy(),
      observations: this.observationCount,
      confidence: this.confidence(),
    };
  }
  likelihood(data, hypothesis) {
    const observation = this._vectorize(data);
    const latent = this._vectorize(hypothesis);
    const delta = sub(observation, latent);
    const dist2 = dot(delta, delta);
    const l1 = sum(delta.map((value) => Math.abs(value)));
    const precision = mean(this.precisionVector);
    if (this.priorType === 'laplace') {
      return Math.exp(-Math.sqrt(precision + EPSILON) * l1 / PHI);
    }
    if (this.priorType === 'cauchy') {
      return 1 / (1 + precision * dist2 * PHI_INV);
    }
    if (this.priorType === 'succession') {
      const matches = delta.filter((value) => Math.abs(value) <= PHI_INV).length;
      return laplaceSuccession(matches, this.dimensions + this.observationCount);
    }
    if (this.priorType === 'harmonic') {
      const resonance = Math.abs(sum(delta.map((value, index) => value * Math.sin((index + 1) * PHI))));
      return Math.exp(-resonance / (PHI + l1 + EPSILON));
    }
    return gaussianKernel(dist2, precision / this.dimensions);
  }
  confidence() {
    const maxEntropy = Math.log(this.field.cellCount);
    const entropyScore = 1 - this.field.entropy() / Math.max(maxEntropy, EPSILON);
    const precisionScore = mean(this.precisionVector.map((value) => 1 - Math.exp(-value * PHI_INV)));
    const evidenceScore = laplaceSuccession(this.observationCount, this.observationCount + this.dimensions);
    return clamp(entropyScore * 0.5 + precisionScore * 0.3 + evidenceScore * 0.2, EPSILON, 1);
  }
}
export class LaplaceTransformer {
  constructor({ samplingRate = 32 } = {}) {
    assertFiniteNumber('samplingRate', samplingRate);
    if (samplingRate <= 0) {
      throw new RangeError('samplingRate must be positive.');
    }
    this.samplingRate = samplingRate;
    this.lastSignal = [];
    this.lastSpectrum = [];
    this.lastReconstruction = [];
  }
  transform(signal) {
    const samples = flattenEvidence(signal).filter((value) => Number.isFinite(value));
    const cleanSignal = samples.length ? samples : [0];
    const sampleCount = clamp(Math.ceil(Math.sqrt(cleanSignal.length) * PHI * 4), 8, 48);
    this.lastSignal = [...cleanSignal];
    this.lastSpectrum = Array.from({ length: sampleCount }, (_, index) => {
      const s = (index + 1) / (PHI + sampleCount * PHI_INV);
      const omega = (TAU * index) / Math.max(cleanSignal.length, 1);
      let re = 0;
      let im = 0;
      for (let sampleIndex = 0; sampleIndex < cleanSignal.length; sampleIndex += 1) {
        const t = sampleIndex / this.samplingRate;
        const decay = Math.exp(-s * t);
        const phase = -omega * t;
        re += cleanSignal[sampleIndex] * decay * Math.cos(phase);
        im += cleanSignal[sampleIndex] * decay * Math.sin(phase);
      }
      const magnitudeValue = Math.hypot(re, im);
      return {
        index,
        s,
        omega,
        re,
        im,
        magnitude: magnitudeValue,
        phase: Math.atan2(im, re),
      };
    });
    return this.lastSpectrum;
  }
  inverseTransform(spectrum = this.lastSpectrum) {
    const components = Array.isArray(spectrum) && spectrum.length ? spectrum : this.lastSpectrum;
    const outputLength = this.lastSignal.length || Math.max(components.length, 1);
    const residues = this.residues(components);
    this.lastReconstruction = Array.from({ length: outputLength }, (_, sampleIndex) => {
      const t = sampleIndex / this.samplingRate;
      const value = residues.reduce((accumulator, residue) => {
        const decay = Math.exp(-residue.s * t);
        return accumulator + decay * (residue.real * Math.cos(residue.omega * t) - residue.imag * Math.sin(residue.omega * t));
      }, 0);
      return value / Math.max(residues.length, 1);
    });
    return this.lastReconstruction;
  }
  poles() {
    const spectrum = this.lastSpectrum;
    if (!spectrum.length) {
      return [];
    }
    const poles = [];
    for (let index = 0; index < spectrum.length; index += 1) {
      const left = spectrum[index - 1]?.magnitude ?? -Infinity;
      const current = spectrum[index].magnitude;
      const right = spectrum[index + 1]?.magnitude ?? -Infinity;
      if (current >= left && current >= right) {
        poles.push({
          s: spectrum[index].s,
          omega: spectrum[index].omega,
          magnitude: current,
          stability: -spectrum[index].s,
        });
      }
    }
    return poles.sort((left, right) => right.magnitude - left.magnitude).slice(0, 8);
  }
  residues(spectrum = this.lastSpectrum) {
    const components = Array.isArray(spectrum) ? spectrum : this.lastSpectrum;
    return components.map((entry) => ({
      s: entry.s,
      omega: entry.omega,
      real: entry.re / (1 + entry.s * PHI),
      imag: entry.im / (1 + entry.s * PHI),
      magnitude: entry.magnitude / (1 + entry.s),
    }));
  }
}
export class PosteriorGating {
  constructor({ numExperts = 4, dimensions = 3 } = {}) {
    assertPositiveInteger('numExperts', numExperts);
    assertPositiveInteger('dimensions', dimensions);
    this.numExperts = numExperts;
    this.dimensions = dimensions;
    this.experts = [];
    this.lastRouting = null;
    this.anchors = Array.from({ length: numExperts }, (_, expertIndex) => {
      return Array.from({ length: dimensions }, (_, dimensionIndex) => {
        const angle = (expertIndex + 1) * (dimensionIndex + 1) * PHI_INV;
        return Math.sin(angle) * PHI_INV + Math.cos(angle * PHI) * 0.5;
      });
    });
  }
  setExperts(experts) {
    this.experts = [...experts];
    return this;
  }
  _scores(observation) {
    const vector = coerceVector(observation, this.dimensions);
    if (!this.experts.length) {
      return this.anchors.map((anchor, index) => ({
        index,
        expert: null,
        score: -distance(vector, anchor),
        confidence: phiPriorDensity(sub(vector, anchor)),
      }));
    }
    return this.experts.map((expert, index) => {
      const posterior = expert.posterior();
      const likelihood = expert.likelihood(vector, posterior.mean);
      const geometricPrior = Math.exp(-distance(vector, this.anchors[index % this.anchors.length]) * PHI_INV);
      const score = Math.log(likelihood + EPSILON) + Math.log(posterior.confidence + EPSILON) + Math.log(geometricPrior + EPSILON);
      return {
        index,
        expert,
        score,
        confidence: posterior.confidence,
        likelihood,
      };
    });
  }
  route(observation) {
    const vector = coerceVector(observation, this.dimensions);
    const candidates = this._scores(vector);
    const weights = softmax(candidates.map((candidate) => candidate.score), PHI_INV);
    const ranking = candidates.map((candidate, index) => ({
      ...candidate,
      posteriorWeight: weights[index],
    })).sort((left, right) => right.posteriorWeight - left.posteriorWeight);
    const best = ranking[0];
    this.lastRouting = {
      observation: vector,
      expertIndex: best.index,
      expertId: best.expert?.id ?? `anchor-${best.index}`,
      posteriorConfidence: best.posteriorWeight,
      weights,
      ranking: ranking.map(({ index, expert, posteriorWeight, score }) => ({
        index,
        expertId: expert?.id ?? `anchor-${index}`,
        posteriorWeight,
        score,
      })),
    };
    return {
      expert: best.expert ?? null,
      expertIndex: best.index,
      expertId: best.expert?.id ?? `anchor-${best.index}`,
      posteriorConfidence: best.posteriorWeight,
      weights,
      ranking: this.lastRouting.ranking,
    };
  }
  evidenceWeight(expert, data) {
    if (!expert) {
      return PHI_INV;
    }
    const vector = coerceVector(data, this.dimensions);
    const posterior = expert.posterior();
    const residual = distance(vector, posterior.mean);
    const affinity = expert.likelihood(vector, posterior.mean);
    const weight = (affinity * posterior.confidence * Math.exp(-residual / (PHI + 1))) ** PHI_INV;
    return clamp(weight, EPSILON, PHI);
  }
}
export class LaplaceDemon {
  constructor({ dimensions = 3, precision = PHI_SQ } = {}) {
    assertPositiveInteger('dimensions', dimensions);
    assertFiniteNumber('precision', precision);
    if (precision <= 0) {
      throw new RangeError('precision must be positive.');
    }
    this.dimensions = dimensions;
    this.precision = precision;
  }
  _stateVector(state) {
    if (Array.isArray(state)) {
      return coerceVector(state, this.dimensions);
    }
    if (state && typeof state === 'object') {
      if (Array.isArray(state.state)) {
        return coerceVector(state.state, this.dimensions);
      }
      if (Array.isArray(state.mean)) {
        return coerceVector(state.mean, this.dimensions);
      }
      if (Array.isArray(state.position)) {
        return coerceVector(state.position, this.dimensions);
      }
    }
    return coerceVector(state, this.dimensions);
  }
  predictAll(state, horizon = 8) {
    assertPositiveInteger('horizon', horizon);
    let current = this._stateVector(state);
    const baseUncertainty = this.uncertainty(state);
    const trajectory = [];
    for (let step = 1; step <= horizon; step += 1) {
      const t = step / this.precision;
      const annealing = Math.exp(-t / PHI);
      const posteriorWidth = Math.max(EPSILON, baseUncertainty * Math.exp(-step / (PHI + 1)));
      const next = current.map((value, index) => {
        const deterministicDrift = Math.sin((index + 1) * (t + PHI_INV)) * PHI_INV;
        const attractor = Math.cos((value + step) / (index + PHI)) * posteriorWidth * PHI_INV;
        return value * (1 - posteriorWidth * PHI_INV) + annealing * deterministicDrift + attractor;
      });
      trajectory.push({
        step,
        time: t,
        state: next,
        uncertainty: posteriorWidth,
        probability: phiPriorDensity(scale(next, 1 / (1 + posteriorWidth))),
      });
      current = next;
    }
    return trajectory;
  }
  uncertainty(state) {
    if (state instanceof ProbabilityField) {
      return clamp(state.entropy() / Math.max(Math.log(state.cellCount), EPSILON), EPSILON, 1);
    }
    if (state && Array.isArray(state.variance)) {
      const values = resizeVector(state.variance, this.dimensions).map((value) => Math.max(Math.abs(value), EPSILON));
      return clamp(mean(values), EPSILON, 1);
    }
    if (state && typeof state.entropy === 'number') {
      return clamp(state.entropy / (this.dimensions * PHI), EPSILON, 1);
    }
    const vector = this._stateVector(state);
    return clamp(varianceOf(vector) + PHI_INV * 0.1, EPSILON, 1);
  }
  informationGain(observation) {
    const vector = coerceVector(observation, this.dimensions);
    const absolute = vector.map((value) => Math.abs(value));
    const priorEntropy = Math.log(vector.length + PHI);
    const posteriorEntropy = computeEntropy(normalizeWeights(absolute.map((value) => value + EPSILON)));
    return Math.max(0, priorEntropy - posteriorEntropy / Math.max(LOG_PHI, EPSILON));
  }
}
export class MoELaplace {
  constructor({ dimensions = 3, numExperts = 5, seed = 0 } = {}) {
    assertPositiveInteger('dimensions', dimensions);
    assertPositiveInteger('numExperts', numExperts);
    this.dimensions = dimensions;
    this.numExperts = numExperts;
    this.seed = seed;
    this.worldField = new ProbabilityField({ dimensions, resolution: DEFAULT_RESOLUTION });
    this.experts = Array.from({ length: numExperts }, (_, index) => new BayesianExpert({
      id: `laplace-expert-${index + 1}`,
      priorType: PRIOR_TYPES[index % PRIOR_TYPES.length],
      dimensions,
      seed: seed + index * 97,
    }));
    this.gating = new PosteriorGating({ numExperts, dimensions }).setExperts(this.experts);
    this.transformer = new LaplaceTransformer({ samplingRate: Math.max(16, Math.round(numExperts * PHI * 6)) });
    this.demon = new LaplaceDemon({ dimensions, precision: PHI_SQ + numExperts * PHI_INV });
    this.currentState = zeros(dimensions);
    this.currentVariance = new Array(dimensions).fill(PHI_INV);
    this.time = 0;
    this.lastRoute = null;
    this.lastPrediction = [];
    this.lastSpectrum = [];
    this.observationHistory = [];
    this.signalTrace = [0];
  }
  _aggregatePosterior() {
    const posteriors = this.experts.map((expert) => expert.posterior());
    const weights = normalizeWeights(posteriors.map((posterior) => posterior.confidence + EPSILON));
    const meanVector = weightedAverage(posteriors.map((posterior) => posterior.mean), weights);
    const varianceVector = zeros(this.dimensions);
    for (let expertIndex = 0; expertIndex < posteriors.length; expertIndex += 1) {
      const posterior = posteriors[expertIndex];
      const meanResidual = sub(posterior.mean, meanVector);
      for (let dimension = 0; dimension < this.dimensions; dimension += 1) {
        varianceVector[dimension] += weights[expertIndex] * (posterior.variance[dimension] + meanResidual[dimension] ** 2);
      }
    }
    return {
      weights,
      mean: meanVector,
      variance: varianceVector.map((value) => Math.max(value, EPSILON)),
      posteriors,
    };
  }
  _updateWorldField(evidenceVector, aggregate, weights) {
    this.worldField.condition((position) => {
      let mixture = 0;
      for (let expertIndex = 0; expertIndex < this.experts.length; expertIndex += 1) {
        mixture += weights[expertIndex] * this.experts[expertIndex].likelihood(evidenceVector, position);
      }
      const prior = phiPriorDensity(sub(position, aggregate.mean));
      return mixture * (0.5 + 0.5 * prior);
    });
  }
  observe(evidence) {
    return this.updateBeliefs(evidence);
  }
  predict(horizon = 8) {
    const aggregate = this._aggregatePosterior();
    const trajectory = this.demon.predictAll({ state: aggregate.mean, variance: aggregate.variance, entropy: this.entropy() }, horizon);
    this.lastPrediction = trajectory.map((entry) => ({
      ...entry,
      worldProbability: this.worldProbability(entry.state),
    }));
    return {
      horizon: this.lastPrediction.length,
      trajectory: this.lastPrediction,
      deterministicLimit: clamp(1 - mean(aggregate.variance), 0, 1),
    };
  }
  updateBeliefs(evidence) {
    const evidenceVector = coerceVector(evidence, this.dimensions);
    const route = this.gating.route(evidenceVector);
    const routedIndex = route.expertIndex;
    const rawWeights = this.experts.map((expert, index) => {
      let weight = this.gating.evidenceWeight(expert, evidenceVector);
      if (index === routedIndex) {
        weight *= PHI;
      }
      return weight;
    });
    const normalizedWeights = normalizeWeights(rawWeights);
    const expertUpdates = this.experts.map((expert, index) => {
      const scaledEvidence = evidenceVector.map((value) => value * normalizedWeights[index]);
      return {
        id: expert.id,
        weight: normalizedWeights[index],
        posterior: expert.update(scaledEvidence),
      };
    });
    const aggregate = this._aggregatePosterior();
    this._updateWorldField(evidenceVector, aggregate, normalizedWeights);
    this.currentState = [...aggregate.mean];
    this.currentVariance = [...aggregate.variance];
    this.time += 1;
    this.lastRoute = route;
    this.observationHistory.push({
      time: this.time,
      evidence: evidenceVector,
      route: route.expertId,
      informationGain: this.demon.informationGain(evidenceVector),
    });
    if (this.observationHistory.length > DEFAULT_HISTORY_LIMIT) {
      this.observationHistory.shift();
    }
    this.signalTrace.push(magnitude(evidenceVector));
    if (this.signalTrace.length > DEFAULT_HISTORY_LIMIT) {
      this.signalTrace.shift();
    }
    this.lastSpectrum = this.transformer.transform(this.signalTrace);
    return {
      time: this.time,
      route,
      state: [...this.currentState],
      variance: [...this.currentVariance],
      entropy: this.entropy(),
      worldProbability: this.worldProbability(this.currentState),
      informationGain: this.demon.informationGain(evidenceVector),
      expertUpdates,
    };
  }
  worldProbability(state) {
    const vector = coerceVector(state, this.dimensions);
    const aggregate = this._aggregatePosterior();
    const expertWeights = aggregate.posteriors.map((posterior) => posterior.confidence + EPSILON);
    const weightedLikelihoods = this.experts.map((expert, index) => expert.likelihood(vector, aggregate.posteriors[index].mean) * expertWeights[index]);
    const likelihood = sum(weightedLikelihoods) / Math.max(sum(expertWeights), EPSILON);
    const fieldDensity = this.worldField.density(vector);
    return clamp((likelihood + fieldDensity) / 2, EPSILON, 1);
  }
  entropy() {
    const expertEntropy = mean(this.experts.map((expert) => expert.field.entropy()));
    return (this.worldField.entropy() + expertEntropy) / 2;
  }
  step(dt = 1) {
    assertFiniteNumber('dt', dt);
    if (dt <= 0) {
      throw new RangeError('dt must be positive.');
    }
    const microSteps = Math.max(1, Math.round(dt * PHI));
    const trajectory = this.demon.predictAll({ state: this.currentState, variance: this.currentVariance, entropy: this.entropy() }, microSteps);
    const next = trajectory[trajectory.length - 1];
    this.currentState = [...next.state];
    this.currentVariance = this.currentVariance.map((value, index) => {
      const forecastVariance = extractVariance(next, this.dimensions)[index];
      return Math.max(EPSILON, (value + forecastVariance) / 2 * Math.exp(-dt / (PHI + 1)));
    });
    this.time += dt;
    this.signalTrace.push(magnitude(this.currentState));
    if (this.signalTrace.length > DEFAULT_HISTORY_LIMIT) {
      this.signalTrace.shift();
    }
    this.lastSpectrum = this.transformer.transform(this.signalTrace);
    return {
      time: this.time,
      state: [...this.currentState],
      uncertainty: next.uncertainty,
      probability: this.worldProbability(this.currentState),
    };
  }
  metrics() {
    const aggregate = this._aggregatePosterior();
    return {
      model: 'LAPLACE',
      dimensions: this.dimensions,
      numExperts: this.numExperts,
      time: this.time,
      currentState: [...this.currentState],
      currentVariance: [...this.currentVariance],
      entropy: this.entropy(),
      uncertainty: this.demon.uncertainty({ variance: this.currentVariance, entropy: this.entropy() }),
      worldProbability: this.worldProbability(this.currentState),
      posteriorMean: [...aggregate.mean],
      posteriorVariance: [...aggregate.variance],
      lastRoute: this.lastRoute,
      poles: this.transformer.poles(),
      residues: this.transformer.residues().slice(0, 8),
      experts: aggregate.posteriors,
      observations: this.observationHistory.length,
    };
  }
}
export default MoELaplace;
// Casa de Medina — Architectos de Architectura Inteligente
