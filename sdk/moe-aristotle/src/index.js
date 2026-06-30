///
/// @medina/moe-aristotle — MIXTURE OF EXPERTS: ARISTOTLE
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║   ARISTOTLE — CAUSAL WORLD MODEL via FOUR CAUSES INFERENCE                  ║
/// ║                                                                              ║
/// ║  Named for Aristotle of Stagira — master of causal reasoning and            ║
/// ║  categories.                                                                 ║
/// ║                                                                              ║
/// ║  Architecture: World model where every phenomenon is explained through      ║
/// ║  4 causal experts: Material (what it's made of), Formal (what               ║
/// ║  pattern/form), Efficient (what agent caused it), Final (what               ║
/// ║  purpose/telos). Prediction = inferring all four causes.                    ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Four causes: C(x) = {material(x), formal(x), efficient(x), final(x)}  ║
/// ║    • Entelechy: potential → actual: A(t) = P·(1 − e^(−φ·t))                ║
/// ║    • Syllogistic inference: if P(A,B)>φ⁻¹ and P(B,C)>φ⁻¹ then P(A,C)>φ⁻²   ║
/// ║    • Categories: 10 Aristotelian categories as orthogonal basis vectors     ║
/// ║    • Substance/accident: x = substance + Σᵢ φ⁻ⁱ·accidentᵢ                  ║
/// ║    • Mean between extremes: virtue(x) = −(x−μ)²/(2·(φ·σ)²)                 ║
/// ║    • Unmoved mover: telos attraction F_final = φ·G·m/r²                     ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI ** 2;
export const EPSILON = 1e-9;
export const TAU = Math.PI * 2;

export const CAUSES = Object.freeze(['material', 'formal', 'efficient', 'final']);
export const CATEGORIES = Object.freeze([
  'substance',
  'quantity',
  'quality',
  'relation',
  'place',
  'time',
  'position',
  'state',
  'action',
  'passion',
]);

const DEFAULT_DIMENSIONS = CATEGORIES.length;
const MAX_HISTORY = 144;
const COMPLETION_THRESHOLD = 1 - PHI_INV ** 6;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const round = (value, digits = 12) => Math.round(value * 10 ** digits) / 10 ** digits;
const sum = (values) => values.reduce((total, value) => total + value, 0);
const mean = (values) => (values.length ? sum(values) / values.length : 0);
const variance = (values) => {
  if (!values.length) return 0;
  const avg = mean(values);
  return mean(values.map((value) => (value - avg) ** 2));
};
const stddev = (values) => Math.sqrt(Math.max(variance(values), 0));
const lerp = (a, b, t) => a + (b - a) * clamp(t, 0, 1);
const boundedPush = (list, item, limit = MAX_HISTORY) => {
  list.push(item);
  if (list.length > limit) list.splice(0, list.length - limit);
};
const repeat = (length, value = 0) => Array.from({ length }, () => value);
const safeNumber = (value) => (Number.isFinite(value) ? value : 0);
const add = (a, b) => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => safeNumber(a[i]) + safeNumber(b[i]));
const sub = (a, b) => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => safeNumber(a[i]) - safeNumber(b[i]));
const scale = (vector, scalar) => vector.map((value) => safeNumber(value) * scalar);
const hadamard = (a, b) => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => safeNumber(a[i]) * safeNumber(b[i]));
const dot = (a, b) => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => safeNumber(a[i]) * safeNumber(b[i])).reduce((total, value) => total + value, 0);
const magnitude = (vector) => Math.sqrt(dot(vector, vector));
const normalize = (vector) => {
  const mag = magnitude(vector);
  if (mag <= EPSILON) return vector.map(() => 0);
  return vector.map((value) => value / mag);
};
const cosineSimilarity = (a, b) => {
  const denom = magnitude(a) * magnitude(b);
  return denom <= EPSILON ? 0 : dot(a, b) / denom;
};
const softmax = (values, temperature = 1) => {
  if (!values.length) return [];
  const safeTemperature = Math.max(Math.abs(temperature), EPSILON);
  const scaled = values.map((value) => value / safeTemperature);
  const maxValue = Math.max(...scaled);
  const exp = scaled.map((value) => Math.exp(value - maxValue));
  const total = sum(exp) || 1;
  return exp.map((value) => value / total);
};
const argmax = (values) => values.reduce((best, value, index) => (value > values[best] ? index : best), 0);
const roundVector = (vector, digits = 12) => vector.map((value) => round(value, digits));
const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

function hashString(value) {
  const text = String(value ?? '');
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed = 1) {
  let state = hashString(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 1_000_000) / 1_000_000;
  };
}

function randomBetween(rng, min = -1, max = 1) {
  return min + (max - min) * rng();
}

function toNumericStream(value, out = []) {
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
    for (let i = 0; i < value.length; i += 1) {
      const code = value.charCodeAt(i);
      out.push(((code % 127) / 63.5 - 1) * Math.cos((i + 1) / PHI));
    }
    return out;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => toNumericStream(entry, out));
    return out;
  }

  if (isPlainObject(value)) {
    Object.keys(value).sort().forEach((key) => {
      toNumericStream(key, out);
      toNumericStream(value[key], out);
    });
    return out;
  }

  out.push(0);
  return out;
}

function toVector(value, dimensions = DEFAULT_DIMENSIONS) {
  const stream = toNumericStream(value, []);
  const vector = repeat(dimensions, 0);
  if (!stream.length) return vector;

  for (let i = 0; i < stream.length; i += 1) {
    const index = i % dimensions;
    const phase = ((i + 1) % dimensions) / PHI;
    const carrier = Math.sin(phase * TAU * PHI_INV) + Math.cos(phase * TAU * PHI_INV * PHI_INV);
    vector[index] += stream[i] * carrier * (PHI_INV ** (i % 7));
  }

  return vector.map((component, index) => component + Math.sin((index + 1) / PHI) * PHI_INV * mean(stream));
}

function stableAverageVectors(vectors, weights = null) {
  if (!vectors.length) return [];
  const dimension = Math.max(...vectors.map((vector) => vector.length), 0);
  const resolvedWeights = Array.isArray(weights) && weights.length === vectors.length
    ? weights.map((weight) => Math.max(0, safeNumber(weight)))
    : vectors.map(() => 1);
  const totalWeight = sum(resolvedWeights) || vectors.length || 1;
  return Array.from({ length: dimension }, (_, index) => (
    vectors.reduce((acc, vector, vectorIndex) => acc + safeNumber(vector[index]) * resolvedWeights[vectorIndex], 0) / totalWeight
  ));
}

function computeEntropy(weights) {
  return -weights.reduce((entropy, weight) => {
    const safeWeight = Math.max(weight, EPSILON);
    return entropy + safeWeight * Math.log(safeWeight);
  }, 0);
}

function basisVector(index, dimensions = CATEGORIES.length) {
  return Array.from({ length: dimensions }, (_, vectorIndex) => (vectorIndex === index ? 1 : 0));
}

function createMatrix(rows, cols, rng, gain = PHI_INV) {
  return Array.from({ length: rows }, (_, row) => (
    Array.from({ length: cols }, (_, col) => {
      const phase = Math.sin((row + 1) * (col + 1) / PHI) + Math.cos((row + col + 2) / PHI_SQ);
      return randomBetween(rng, -gain, gain) + phase * gain * 0.25;
    })
  ));
}

function matVec(matrix, vector) {
  return matrix.map((row) => dot(row, vector));
}

function projectCategories(vector) {
  const padded = Array.from({ length: Math.max(CATEGORIES.length, vector.length) }, (_, index) => safeNumber(vector[index]));
  const scores = CATEGORIES.map((_, index) => {
    const primary = Math.abs(padded[index]);
    const neighbor = Math.abs(padded[(index + 1) % padded.length] || 0);
    const harmonic = Math.abs(Math.cos((index + 1) / PHI) * primary);
    return primary + neighbor * PHI_INV + harmonic + PHI_INV ** (index % 5 + 1);
  });
  const weights = softmax(scores.map((score) => score * PHI));
  const dominantIndex = argmax(weights);
  return {
    scores,
    weights,
    dominantIndex,
    dominant: CATEGORIES[dominantIndex],
    entropy: computeEntropy(weights),
    basis: CATEGORIES.map((_, index) => basisVector(index, CATEGORIES.length)),
  };
}

function spectralFeatures(vector) {
  const abs = vector.map((value) => Math.abs(value));
  const mag = magnitude(vector);
  const avg = mean(vector);
  const nonZero = abs.filter((value) => value > EPSILON).length;
  const density = vector.length ? nonZero / vector.length : 0;
  const symmetry = vector.length
    ? 1 - mean(vector.map((value, index) => Math.abs(value - safeNumber(vector[vector.length - index - 1])))) / (1 + mag)
    : 0;
  const impulse = vector.length > 1
    ? mean(vector.slice(1).map((value, index) => Math.abs(value - vector[index])))
    : 0;
  const resonance = mean(vector.map((value, index) => Math.abs(value * Math.cos((index + 1) / PHI))));
  const coherence = clamp((1 / (1 + variance(vector))) * PHI_INV + density * 0.25 + symmetry * 0.25, 0, 1);
  const purpose = clamp((resonance / (1 + mag)) * PHI + Math.max(avg, 0) * 0.05, 0, 1);
  return {
    mean: avg,
    variance: variance(vector),
    magnitude: mag,
    density,
    symmetry: clamp(symmetry, 0, 1),
    impulse,
    resonance,
    coherence,
    purpose,
  };
}

function normalizeCauseValue(input, label, dimensions = DEFAULT_DIMENSIONS) {
  if (input && input.__normalizedCause) return input;

  if (typeof input === 'number') {
    const vector = scale(basisVector(CAUSES.indexOf(label) >= 0 ? CAUSES.indexOf(label) : 0, dimensions), input);
    return {
      __normalizedCause: true,
      label,
      score: clamp(Math.abs(input), 0, PHI),
      vector,
      summary: `${label} intensity ${round(Math.abs(input), 6)}`,
      metadata: {},
    };
  }

  if (typeof input === 'string') {
    const vector = toVector(input, dimensions);
    return {
      __normalizedCause: true,
      label,
      score: clamp(magnitude(vector) / Math.max(Math.sqrt(dimensions), EPSILON), 0, PHI),
      vector,
      summary: input,
      metadata: {},
    };
  }

  if (Array.isArray(input)) {
    const vector = toVector(input, dimensions);
    return {
      __normalizedCause: true,
      label,
      score: clamp(magnitude(vector) / (dimensions || 1), 0, PHI),
      vector,
      summary: `${label} vectorized from array`,
      metadata: {},
    };
  }

  if (isPlainObject(input)) {
    const vector = Array.isArray(input.vector) ? toVector(input.vector, dimensions) : toVector(input, dimensions);
    const score = clamp(Number.isFinite(input.score) ? input.score : magnitude(vector) / Math.max(Math.sqrt(dimensions), EPSILON), 0, PHI);
    return {
      __normalizedCause: true,
      label: input.label || label,
      score,
      vector,
      summary: input.summary || input.text || input.label || `${label} cause`,
      metadata: { ...input.metadata },
    };
  }

  return {
    __normalizedCause: true,
    label,
    score: 0,
    vector: repeat(dimensions, 0),
    summary: `${label} unspecified`,
    metadata: {},
  };
}

function scalarOrVector(original, vector) {
  return typeof original === 'number' ? safeNumber(vector[0]) : vector;
}

function causeTemplate(causeType, hypothesis, category, confidence) {
  const percent = `${round(confidence * 100, 2)}%`;
  switch (causeType) {
    case 'material':
      return `Material cause: ${hypothesis}. The phenomenon is grounded in ${category} with ${percent} confidence.`;
    case 'formal':
      return `Formal cause: ${hypothesis}. The organizing pattern expresses ${category} with ${percent} confidence.`;
    case 'efficient':
      return `Efficient cause: ${hypothesis}. The active source drives ${category} with ${percent} confidence.`;
    case 'final':
      return `Final cause: ${hypothesis}. The telos attracts ${category} with ${percent} confidence.`;
    default:
      return `${causeType}: ${hypothesis} (${percent} confidence).`;
  }
}

function normalizePremise(premise, index = 0) {
  return {
    subject: String(premise?.subject ?? `term_${index}`),
    predicate: String(premise?.predicate ?? `predicate_${index}`),
    probability: clamp(safeNumber(premise?.probability), 0, 1),
    metadata: { ...(premise?.metadata || {}) },
  };
}

export class CausalFrame {
  constructor({ material, formal, efficient, final } = {}) {
    const dimensions = Math.max(
      DEFAULT_DIMENSIONS,
      Array.isArray(material?.vector) ? material.vector.length : 0,
      Array.isArray(formal?.vector) ? formal.vector.length : 0,
      Array.isArray(efficient?.vector) ? efficient.vector.length : 0,
      Array.isArray(final?.vector) ? final.vector.length : 0,
    );

    this.dimensions = dimensions;
    this.material = normalizeCauseValue(material, 'material', dimensions);
    this.formal = normalizeCauseValue(formal, 'formal', dimensions);
    this.efficient = normalizeCauseValue(efficient, 'efficient', dimensions);
    this.final = normalizeCauseValue(final, 'final', dimensions);
    this.causes = {
      material: this.material,
      formal: this.formal,
      efficient: this.efficient,
      final: this.final,
    };
    this.createdAt = Date.now();
  }

  completeness() {
    const scores = CAUSES.map((cause) => clamp(this.causes[cause].score / PHI, 0, 1));
    const presence = scores.filter((score) => score > EPSILON).length / CAUSES.length;
    return clamp(mean(scores) * PHI_INV + presence * (1 - PHI_INV), 0, 1);
  }

  dominantCause() {
    const scored = CAUSES.map((cause) => ({
      type: cause,
      score: this.causes[cause].score,
      summary: this.causes[cause].summary,
      vector: this.causes[cause].vector,
    })).sort((left, right) => right.score - left.score);
    return scored[0];
  }

  toVector() {
    const causeVectors = CAUSES.map((cause) => this.causes[cause].vector);
    const causeScores = CAUSES.map((cause) => this.causes[cause].score);
    const blended = stableAverageVectors(causeVectors, causeScores.map((score) => Math.max(score, EPSILON)));
    const categories = projectCategories(blended);
    return [
      ...causeScores,
      ...blended,
      ...categories.weights,
    ];
  }
}

export class EntelechyEngine {
  constructor({ potential, dimensions = DEFAULT_DIMENSIONS } = {}) {
    this.dimensions = dimensions;
    this.potential = toVector(potential ?? repeat(dimensions, PHI_INV), dimensions);
    this.actual = repeat(dimensions, 0);
    this.elapsed = 0;
    this.history = [];
    this.curve = 0;
  }

  actualize(dt = 1) {
    const delta = Math.max(safeNumber(dt), EPSILON);
    this.elapsed += delta;
    this.curve = 1 - Math.exp(-PHI * this.elapsed);
    this.actual = this.potential.map((potentialValue) => potentialValue * this.curve);
    const snapshot = {
      elapsed: this.elapsed,
      curve: this.curve,
      actual: [...this.actual],
      progress: this.progress(),
      complete: this.isComplete(),
    };
    boundedPush(this.history, snapshot);
    return snapshot;
  }

  progress() {
    const totalPotential = magnitude(this.potential);
    if (totalPotential <= EPSILON) return 1;
    return clamp(magnitude(this.actual) / totalPotential, 0, 1);
  }

  isComplete() {
    return this.progress() >= COMPLETION_THRESHOLD;
  }
}

export class CausalExpert {
  constructor({ id, causeType, dimensions = DEFAULT_DIMENSIONS, seed = 1 } = {}) {
    if (!CAUSES.includes(causeType)) throw new Error(`Unknown cause type: ${causeType}`);
    this.id = id || `${causeType}-expert`;
    this.causeType = causeType;
    this.dimensions = dimensions;
    this.seed = seed;
    this.rng = createRng(`${seed}:${id}:${causeType}`);
    this.kernel = createMatrix(dimensions, dimensions, this.rng, PHI_INV);
    this.bias = Array.from({ length: dimensions }, (_, index) => randomBetween(this.rng, -PHI_INV, PHI_INV) * Math.cos((index + 1) / PHI));
    this.signature = scale(basisVector(CAUSES.indexOf(causeType) % dimensions, dimensions), PHI);
    this.history = [];
  }

  applyCauseTransform(vector, categoryProfile, features) {
    switch (this.causeType) {
      case 'material':
        return vector.map((value, index) => Math.abs(value) + categoryProfile.weights[index % CATEGORIES.length] * PHI_INV + features.density * PHI_INV);
      case 'formal':
        return normalize(vector).map((value, index) => value * (1 + features.symmetry) + Math.cos((index + 1) / PHI) * categoryProfile.weights[index % CATEGORIES.length]);
      case 'efficient':
        return vector.map((value, index) => value + features.impulse * ((index + 1) / this.dimensions) + features.coherence * PHI_INV);
      case 'final':
        return vector.map((value, index) => lerp(value, this.signature[index] || 0, PHI_INV) + features.purpose * PHI_INV);
      default:
        return [...vector];
    }
  }

  forward(observation) {
    const input = toVector(observation, this.dimensions);
    const categoryProfile = projectCategories(input);
    const features = spectralFeatures(input);
    const projected = matVec(this.kernel, input);
    const transformed = this.applyCauseTransform(add(projected, this.bias), categoryProfile, features);
    const resonance = clamp((cosineSimilarity(transformed, this.signature) + 1) / 2, 0, 1);
    const confidence = clamp(resonance * PHI_INV + features.coherence * (1 - PHI_INV) + categoryProfile.weights[categoryProfile.dominantIndex] * 0.1, 0, 1);
    const output = {
      expertId: this.id,
      causeType: this.causeType,
      vector: roundVector(transformed),
      resonance,
      confidence,
      category: categoryProfile.dominant,
      features,
    };
    boundedPush(this.history, output);
    return output;
  }

  infer(evidence) {
    const output = this.forward(evidence);
    const dominantCategory = output.category;
    const magnitudeScore = magnitude(output.vector) / Math.max(Math.sqrt(this.dimensions), EPSILON);
    const score = clamp(output.confidence * 0.7 + clamp(magnitudeScore / PHI, 0, 1) * 0.3, 0, 1);
    const hypothesis = `${this.causeType} explanation centered on ${dominantCategory}`;
    return {
      expertId: this.id,
      causeType: this.causeType,
      score,
      confidence: output.confidence,
      hypothesis,
      vector: output.vector,
      category: dominantCategory,
      frame: normalizeCauseValue({
        label: this.causeType,
        score,
        vector: output.vector,
        summary: hypothesis,
        metadata: { resonance: output.resonance },
      }, this.causeType, this.dimensions),
    };
  }

  explain(phenomenon) {
    const inference = this.infer(phenomenon);
    return causeTemplate(this.causeType, inference.hypothesis, inference.category, inference.confidence);
  }
}

export class SyllogisticGating {
  constructor({ numExperts = CAUSES.length, dimensions = DEFAULT_DIMENSIONS } = {}) {
    this.numExperts = numExperts;
    this.dimensions = dimensions;
    this.expertCauseMap = Array.from({ length: numExperts }, (_, index) => CAUSES[index % CAUSES.length]);
    this.priors = Array.from({ length: numExperts }, (_, index) => 1 + PHI_INV ** ((index % CAUSES.length) + 1));
    this.routeHistory = [];
    this.deductionHistory = [];
  }

  route(observation) {
    const input = toVector(observation, this.dimensions);
    const categories = projectCategories(input);
    const features = spectralFeatures(input);
    const scores = Array.from({ length: this.numExperts }, (_, index) => {
      const causeType = this.expertCauseMap[index];
      const causeIndex = CAUSES.indexOf(causeType);
      const categoryBias = categories.weights[causeIndex % CATEGORIES.length] || 0;
      const causalPull = causeType === 'final'
        ? features.purpose * PHI
        : causeType === 'efficient'
          ? features.impulse * PHI_INV
          : causeType === 'formal'
            ? features.symmetry * PHI_INV
            : features.density * PHI_INV;
      return Math.log(this.priors[index]) + categoryBias + causalPull + safeNumber(input[causeIndex % this.dimensions]) * PHI_INV;
    });
    const weights = softmax(scores, PHI_INV);
    const ranking = weights.map((weight, index) => ({
      expertIndex: index,
      causeType: this.expertCauseMap[index],
      weight,
      score: scores[index],
    })).sort((left, right) => right.weight - left.weight);
    const route = {
      vector: input,
      category: categories,
      features,
      scores,
      weights,
      ranking,
      dominant: ranking[0],
      timestamp: Date.now(),
    };
    boundedPush(this.routeHistory, route);
    return route;
  }

  deduce(premises = []) {
    const normalized = premises.map((premise, index) => normalizePremise(premise, index));
    const deductions = [];

    for (let leftIndex = 0; leftIndex < normalized.length; leftIndex += 1) {
      for (let rightIndex = 0; rightIndex < normalized.length; rightIndex += 1) {
        if (leftIndex === rightIndex) continue;
        const left = normalized[leftIndex];
        const right = normalized[rightIndex];
        if (left.predicate !== right.subject) continue;
        if (left.probability <= PHI_INV || right.probability <= PHI_INV) continue;
        const probability = clamp(left.probability * right.probability, 0, 1);
        if (probability <= PHI_INV ** 2) continue;
        deductions.push({
          subject: left.subject,
          predicate: right.predicate,
          probability,
          via: [left, right],
          valid: true,
        });
      }
    }

    boundedPush(this.deductionHistory, deductions);
    return deductions;
  }

  confidence() {
    const lastRoute = this.routeHistory[this.routeHistory.length - 1];
    const lastDeductions = this.deductionHistory[this.deductionHistory.length - 1] || [];
    const routeConfidence = lastRoute ? lastRoute.dominant.weight : 0;
    const deductionConfidence = lastDeductions.length ? mean(lastDeductions.map((deduction) => deduction.probability)) : 0;
    return clamp(routeConfidence * PHI_INV + deductionConfidence * (1 - PHI_INV), 0, 1);
  }
}

export class GoldenMean {
  constructor({ dimensions = DEFAULT_DIMENSIONS } = {}) {
    this.dimensions = dimensions;
    this.mu = repeat(dimensions, 0);
    this.sigma = repeat(dimensions, PHI_INV);
    this.history = [];
  }

  virtueScore(state) {
    const vector = toVector(state, this.dimensions);
    const score = mean(vector.map((value, index) => Math.exp(-((value - this.mu[index]) ** 2) / (2 * (PHI * this.sigma[index]) ** 2 + EPSILON))));
    return clamp(score, 0, 1);
  }

  findMean(extremes = []) {
    const list = Array.isArray(extremes) ? extremes : [extremes];
    const vectors = list.length ? list.map((entry) => toVector(entry, this.dimensions)) : [repeat(this.dimensions, 0)];
    this.mu = stableAverageVectors(vectors);
    this.sigma = Array.from({ length: this.dimensions }, (_, index) => Math.max(stddev(vectors.map((vector) => vector[index] || 0)), PHI_INV ** 4));
    const assessments = vectors.map((vector, index) => ({
      index,
      virtue: this.virtueScore(vector),
      excess: this.excess(vector),
      deficiency: this.deficiency(vector),
    }));
    const report = {
      mean: [...this.mu],
      sigma: [...this.sigma],
      assessments,
    };
    boundedPush(this.history, report);
    return report;
  }

  isVirtuous(state) {
    const vector = toVector(state, this.dimensions);
    const score = this.virtueScore(vector);
    return {
      score,
      isVirtuous: score >= PHI_INV,
      deviation: sub(vector, this.mu),
    };
  }

  excess(value) {
    const vector = toVector(value, this.dimensions);
    const excessVector = vector.map((entry, index) => Math.max(0, entry - this.mu[index]));
    return scalarOrVector(value, excessVector);
  }

  deficiency(value) {
    const vector = toVector(value, this.dimensions);
    const deficiencyVector = vector.map((entry, index) => Math.max(0, this.mu[index] - entry));
    return scalarOrVector(value, deficiencyVector);
  }
}

export class MoEAristotle {
  constructor({ dimensions = DEFAULT_DIMENSIONS, numExperts = CAUSES.length, seed = 2026 } = {}) {
    this.dimensions = dimensions;
    this.numExperts = numExperts;
    this.seed = seed;
    this.experts = Array.from({ length: numExperts }, (_, index) => new CausalExpert({
      id: `${CAUSES[index % CAUSES.length]}-${index}`,
      causeType: CAUSES[index % CAUSES.length],
      dimensions,
      seed: `${seed}:${index}`,
    }));
    this.gating = new SyllogisticGating({ numExperts, dimensions });
    this.mean = new GoldenMean({ dimensions });
    this.entelechy = new EntelechyEngine({ potential: repeat(dimensions, PHI_INV), dimensions });
    this.frame = new CausalFrame();
    this.state = repeat(dimensions, 0);
    this.observationHistory = [];
    this.predictionHistory = [];
    this.clock = 0;
  }

  aggregateByCause(outputs, weights) {
    return CAUSES.reduce((acc, causeType) => {
      const group = outputs.filter((output) => output.causeType === causeType);
      if (!group.length) {
        acc[causeType] = normalizeCauseValue(null, causeType, this.dimensions);
        return acc;
      }
      const groupWeights = group.map((output) => weights[output.index] ?? 0);
      const best = [...group].sort((left, right) => right.inference.score - left.inference.score)[0];
      acc[causeType] = normalizeCauseValue({
        label: causeType,
        score: mean(group.map((output, index) => output.inference.score * Math.max(groupWeights[index], EPSILON))) * group.length,
        vector: stableAverageVectors(group.map((output) => output.inference.vector), groupWeights.map((weight) => Math.max(weight, EPSILON))),
        summary: best.inference.hypothesis,
        metadata: {
          expertId: best.expertId,
          category: best.inference.category,
          confidence: best.inference.confidence,
        },
      }, causeType, this.dimensions);
      return acc;
    }, {});
  }

  observe(phenomenon) {
    const route = this.gating.route(phenomenon);
    const outputs = this.experts.map((expert, index) => {
      const forward = expert.forward(phenomenon);
      const inference = expert.infer(phenomenon);
      return {
        index,
        expertId: expert.id,
        causeType: expert.causeType,
        weight: route.weights[index] || 0,
        forward,
        inference,
      };
    });

    const aggregated = this.aggregateByCause(outputs, route.weights);
    const frame = new CausalFrame(aggregated);
    const stateVector = stableAverageVectors(outputs.map((output) => output.inference.vector), route.weights);
    const categories = projectCategories(stateVector);
    const premises = [
      {
        subject: frame.dominantCause().type,
        predicate: categories.dominant,
        probability: clamp(frame.completeness(), 0, 1),
      },
      {
        subject: categories.dominant,
        predicate: route.dominant.causeType,
        probability: clamp(route.dominant.weight + PHI_INV * 0.25, 0, 1),
      },
      {
        subject: route.dominant.causeType,
        predicate: 'actuality',
        probability: clamp(route.features.coherence + PHI_INV * 0.15, 0, 1),
      },
    ];
    const deductions = this.gating.deduce(premises);
    const meanReport = this.mean.findMean([this.mean.mu, stateVector, frame.toVector().slice(0, this.dimensions)]);
    const potential = add(stateVector, scale(frame.toVector().slice(0, this.dimensions), PHI_INV));
    this.entelechy = new EntelechyEngine({ potential, dimensions: this.dimensions });
    this.frame = frame;
    this.state = stateVector;

    const record = {
      timestamp: Date.now(),
      phenomenon,
      vector: roundVector(stateVector),
      route,
      outputs,
      frame,
      categories,
      deductions,
      mean: meanReport,
      telos: aggregated.final.summary,
      actuality: this.entelechy.progress(),
    };
    boundedPush(this.observationHistory, record);
    return record;
  }

  explain(observation) {
    const record = observation?.frame instanceof CausalFrame ? observation : this.observe(observation);
    const explanations = CAUSES.map((causeType) => {
      const expert = this.experts.find((candidate) => candidate.causeType === causeType) || this.experts[0];
      return {
        causeType,
        text: expert.explain(record.phenomenon ?? record.vector),
        summary: record.frame.causes[causeType].summary,
        score: record.frame.causes[causeType].score,
      };
    });
    return {
      summary: `Aristotelian explanation dominated by ${record.frame.dominantCause().type} cause within ${record.categories.dominant}.`,
      frame: record.frame,
      categories: record.categories,
      deductions: record.deductions,
      explanations,
      telos: record.telos,
    };
  }

  predict(state = this.state, horizon = PHI_SQ) {
    const record = this.observe(state);
    const steps = Math.max(1, Math.round(safeNumber(horizon)));
    const engine = new EntelechyEngine({
      potential: add(record.vector, scale(record.frame.toVector().slice(0, this.dimensions), PHI_INV)),
      dimensions: this.dimensions,
    });

    let current = toVector(record.vector, this.dimensions);
    const trajectory = [];

    for (let stepIndex = 1; stepIndex <= steps; stepIndex += 1) {
      const actualization = engine.actualize(1 / PHI);
      const finalVector = record.frame.final.vector;
      const teleologicalPull = scale(normalize(add(finalVector, this.mean.mu)), PHI_INV / stepIndex);
      current = add(scale(current, 1 - PHI_INV / (stepIndex + 1)), add(actualization.actual, teleologicalPull));
      const virtue = this.mean.isVirtuous(current);
      const categories = projectCategories(current);
      trajectory.push({
        step: stepIndex,
        state: roundVector(current),
        progress: actualization.progress,
        virtue: virtue.score,
        category: categories.dominant,
      });
    }

    const forecast = {
      horizon: steps,
      converges: engine.isComplete(),
      telos: record.frame.final.summary,
      trajectory,
      completion: engine.progress(),
    };
    boundedPush(this.predictionHistory, forecast);
    return forecast;
  }

  step(dt = 1) {
    this.clock += safeNumber(dt);
    const actualization = this.entelechy.actualize(dt);
    this.state = add(scale(this.state, 1 - PHI_INV * 0.1), scale(actualization.actual, PHI_INV * 0.1));
    const virtue = this.mean.isVirtuous(this.state);
    const snapshot = {
      time: this.clock,
      actual: roundVector(actualization.actual),
      progress: actualization.progress,
      complete: actualization.complete,
      virtue: virtue.score,
    };
    boundedPush(this.observationHistory, { kind: 'step', snapshot, timestamp: Date.now() });
    return snapshot;
  }

  metrics() {
    const causeStats = CAUSES.map((causeType) => {
      const group = this.experts.filter((expert) => expert.causeType === causeType);
      const confidences = group.flatMap((expert) => expert.history.slice(-1).map((entry) => entry.confidence));
      return {
        causeType,
        experts: group.length,
        confidence: confidences.length ? mean(confidences) : 0,
      };
    });
    return {
      dimensions: this.dimensions,
      numExperts: this.numExperts,
      observations: this.observationHistory.length,
      predictions: this.predictionHistory.length,
      clock: this.clock,
      completeness: this.frame.completeness(),
      dominantCause: this.frame.dominantCause(),
      gatingConfidence: this.gating.confidence(),
      actuality: this.entelechy.progress(),
      virtue: this.mean.isVirtuous(this.state),
      category: projectCategories(this.state).dominant,
      causes: causeStats,
    };
  }
}

export default MoEAristotle;

/// Casa de Medina — Architectos de Architectura Inteligente
