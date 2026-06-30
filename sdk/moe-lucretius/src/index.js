///
/// @medina/moe-lucretius — MIXTURE OF EXPERTS: LUCRETIUS
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║   LUCRETIUS — EMERGENT WORLD MODEL via DE RERUM NATURA                     ║
/// ║                                                                              ║
/// ║  Named for Titus Lucretius Carus — poet of emergence and natural            ║
/// ║  philosophy.                                                                 ║
/// ║                                                                              ║
/// ║  Architecture: World model focused on EMERGENCE — how complex patterns      ║
/// ║  arise from simple rules. Experts operate at different scales of            ║
/// ║  organization (atomic/molecular/organic/mental). Higher levels EMERGE       ║
/// ║  from lower but cannot be reduced to them. The clinamen (swerve)            ║
/// ║  introduces genuine novelty.                                                ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Emergence threshold: when complexity(Σ parts) < complexity(whole)·φ⁻¹  ║
/// ║      → emergent                                                              ║
/// ║    • Clinamen (swerve): δx = ε·φ⁻ⁿ at random intervals — source of novelty  ║
/// ║    • Simulacra propagation: I(r) = I₀·φ⁻(r/λ) — perception attenuates       ║
/// ║      with distance                                                           ║
/// ║    • Scale hierarchy: level_n emerges at scale φⁿ·λ₀ — golden scale ladder ║
/// ║    • Combination law: P(A+B) > P(A)·P(B) + φ·interaction(A,B) — synergy     ║
/// ║    • Void necessity: structure requires void fraction v = 1/φ for mobility  ║
/// ║    • Infinite universe: no boundary → expert domains tile infinitely        ║
/// ║    • Mortality/dissolution: all compound things decay:                      ║
/// ║      N(t) = N₀·e^(−t/(φ·τ))                                                 ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI * PHI;
export const PI = Math.PI;
export const TAU = PI * 2;
export const EPSILON = 1e-9;
export const SCALES = Object.freeze(['atomic', 'molecular', 'organic', 'cognitive', 'social']);

const DEFAULT_DIMENSIONS = 8;
const DEFAULT_HORIZON = 3;
const DEFAULT_MEMORY = 64;
const DEFAULT_SIMULACRA = 32;
const DEFAULT_VOID_FRACTION = PHI_INV;
const DEFAULT_DECAY_TAU = PHI_SQ;
const SCALE_INDEX = new Map(SCALES.map((scale, index) => [scale, index]));
const SCALE_TARGET_COMPLEXITY = Object.freeze({
  atomic: PHI_INV,
  molecular: 1,
  organic: PHI,
  cognitive: PHI_SQ,
  social: PHI_SQ + PHI_INV,
});
const SCALE_BANDWIDTH = Object.freeze({
  atomic: PHI_INV,
  molecular: 1,
  organic: PHI,
  cognitive: PHI_SQ,
  social: PHI_SQ * PHI,
});
const SCALE_SIGNATURE_SEEDS = Object.freeze({
  atomic: 11,
  molecular: 23,
  organic: 37,
  cognitive: 53,
  social: 71,
});

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const sum = (values) => values.reduce((total, value) => total + value, 0);
const mean = (values) => (values.length ? sum(values) / values.length : 0);
const safeDivide = (numerator, denominator, fallback = 0) => (Math.abs(denominator) <= EPSILON ? fallback : numerator / denominator);
const hashSeed = (seed) => {
  if (typeof seed === 'number' && Number.isFinite(seed)) return Math.abs(Math.floor(seed)) >>> 0;
  const text = String(seed ?? 'lucretius');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};
const createRng = (seed = 0x1a2b3c4d) => {
  let state = hashSeed(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) + 1) / 0x100000001;
  };
};
const zeros = (length) => Array.from({ length }, () => 0);
const ones = (length, value = 1) => Array.from({ length }, () => value);
const addVectors = (left, right) => left.map((value, index) => value + (right[index] ?? 0));
const subVectors = (left, right) => left.map((value, index) => value - (right[index] ?? 0));
const scaleVector = (vector, scalar) => vector.map((value) => value * scalar);
const dot = (left, right) => left.reduce((total, value, index) => total + value * (right[index] ?? 0), 0);
const magnitude = (vector) => Math.sqrt(Math.max(dot(vector, vector), 0));
const distance = (left, right) => magnitude(subVectors(left, right));
const normalize = (vector) => {
  const norm = magnitude(vector);
  return norm <= EPSILON ? vector.map(() => 0) : vector.map((value) => value / norm);
};
const variance = (values) => {
  if (!values.length) return 0;
  const avg = mean(values);
  return mean(values.map((value) => (value - avg) ** 2));
};
const entropy = (values) => {
  const absolute = values.map((value) => Math.abs(value)).filter((value) => value > EPSILON);
  const total = sum(absolute);
  if (total <= EPSILON) return 0;
  return -absolute.reduce((score, value) => {
    const probability = value / total;
    return score + probability * Math.log(probability + EPSILON);
  }, 0);
};
const cosineSimilarity = (left, right) => safeDivide(dot(left, right), magnitude(left) * magnitude(right), 0);
const softmax = (values) => {
  if (!values.length) return [];
  const peak = Math.max(...values);
  const exponents = values.map((value) => Math.exp(value - peak));
  const total = sum(exponents);
  return total <= EPSILON ? values.map(() => 1 / values.length) : exponents.map((value) => value / total);
};
const weightedAverageVectors = (vectors, weights = []) => {
  const width = Math.max(0, ...vectors.map((vector) => vector.length));
  const output = zeros(width);
  const safeWeights = weights.length ? weights : ones(vectors.length, 1 / Math.max(vectors.length, 1));
  const weightSum = sum(safeWeights) || 1;
  for (let vectorIndex = 0; vectorIndex < vectors.length; vectorIndex += 1) {
    for (let dimension = 0; dimension < width; dimension += 1) {
      output[dimension] += (vectors[vectorIndex][dimension] ?? 0) * safeWeights[vectorIndex];
    }
  }
  return output.map((value) => value / weightSum);
};
const limitLength = (array, size) => (array.length > size ? array.slice(array.length - size) : array);
const deepClone = (value) => JSON.parse(JSON.stringify(value));
const wrap = (value, modulus) => ((value % modulus) + modulus) % modulus;
const phiAttenuation = (distanceValue, lambda = 1) => PHI ** (-Math.abs(distanceValue) / Math.max(lambda, EPSILON));
const mortality = (amount, time, tau = DEFAULT_DECAY_TAU) => amount * Math.exp(-time / (PHI * Math.max(tau, EPSILON)));
const interactionTerm = (vector) => {
  if (vector.length <= 1) return Math.abs(vector[0] ?? 0) * PHI_INV;
  let total = 0;
  for (let index = 0; index < vector.length; index += 1) {
    const current = vector[index] ?? 0;
    const next = vector[(index + 1) % vector.length] ?? 0;
    total += Math.abs(current * next) * PHI_INV;
  }
  return total / vector.length;
};
const flattenNumbers = (input, output = [], seen = new WeakSet()) => {
  if (input == null) return output;
  if (isFiniteNumber(input)) {
    output.push(input);
    return output;
  }
  if (typeof input === 'boolean') {
    output.push(input ? 1 : -1);
    return output;
  }
  if (typeof input === 'string') {
    for (let index = 0; index < input.length; index += 1) {
      output.push(((input.charCodeAt(index) % 127) / 63.5) - 1);
    }
    return output;
  }
  if (Array.isArray(input)) {
    input.forEach((value) => flattenNumbers(value, output, seen));
    return output;
  }
  if (typeof input === 'object') {
    if (seen.has(input)) return output;
    seen.add(input);
    Object.keys(input).sort().forEach((key) => {
      flattenNumbers(key, output, seen);
      flattenNumbers(input[key], output, seen);
    });
  }
  return output;
};
const toVector = (input, dimensions = DEFAULT_DIMENSIONS) => {
  const flattened = flattenNumbers(input);
  const base = flattened.length ? flattened : [0];
  const vector = Array.from({ length: dimensions }, (_, index) => base[index % base.length] ?? 0);
  const phaseAdjusted = vector.map((value, index) => value + Math.sin((index + 1) * PHI_INV) * EPSILON * PHI);
  return phaseAdjusted;
};
const restoreShape = (template, vector) => {
  if (Array.isArray(template)) return [...vector];
  if (isFiniteNumber(template)) return vector[0] ?? 0;
  if (template && typeof template === 'object') return { ...template, values: [...vector] };
  return [...vector];
};
const scaleSignature = (scale, dimensions = DEFAULT_DIMENSIONS) => {
  const seed = SCALE_SIGNATURE_SEEDS[scale] ?? 5;
  return Array.from({ length: dimensions }, (_, index) => {
    const phase = (seed + index + 1) * PHI_INV;
    const harmonic = Math.sin(phase) * PHI_INV + Math.cos(phase * PHI) * PHI_INV;
    return harmonic / PHI;
  });
};
const complexityScore = (input, level = 0) => {
  const vector = Array.isArray(input) ? input : toVector(input, DEFAULT_DIMENSIONS);
  const abs = vector.map((value) => Math.abs(value));
  const energy = mean(abs.map((value) => value ** 2));
  const dispersion = variance(vector);
  const informational = entropy(abs) * PHI_INV;
  const interaction = interactionTerm(vector) * PHI;
  const density = safeDivide(abs.filter((value) => value > EPSILON).length, vector.length, 0);
  const scaleLift = 1 + level * PHI_INV;
  return (energy + dispersion + informational + interaction + density * PHI_INV) * scaleLift;
};
const pairwiseSynergy = (vectors) => {
  if (vectors.length <= 1) return 0;
  let total = 0;
  let pairs = 0;
  for (let left = 0; left < vectors.length; left += 1) {
    for (let right = left + 1; right < vectors.length; right += 1) {
      total += Math.max(0, cosineSimilarity(vectors[left], vectors[right])) + interactionTerm(addVectors(vectors[left], vectors[right])) * PHI_INV;
      pairs += 1;
    }
  }
  return safeDivide(total, pairs, 0);
};
const scaleProjection = (vector, level) => {
  const window = Math.max(1, Math.round(PHI ** level));
  const projected = vector.map((_, index) => {
    let total = 0;
    let count = 0;
    for (let offset = -window; offset <= window; offset += 1) {
      const sourceIndex = wrap(index + offset, vector.length);
      total += vector[sourceIndex] * phiAttenuation(Math.abs(offset), window);
      count += 1;
    }
    return safeDivide(total, count, 0);
  });
  return projected.map((value, index) => value * (1 + (level + 1) * PHI_INV * Math.cos((index + 1) / PHI)));
};
const extractPosition = (value) => {
  if (isFiniteNumber(value)) return [value, 0, 0];
  if (Array.isArray(value)) return [value[0] ?? 0, value[1] ?? 0, value[2] ?? 0];
  if (value && typeof value === 'object') {
    if (Array.isArray(value.position)) return [value.position[0] ?? 0, value.position[1] ?? 0, value.position[2] ?? 0];
    if (Array.isArray(value.values)) return [value.values[0] ?? 0, value.values[1] ?? 0, value.values[2] ?? 0];
    if (isFiniteNumber(value.distance)) return [value.distance, 0, 0];
  }
  return [0, 0, 0];
};
const selectTop = (items, count) => [...items].sort((left, right) => right.score - left.score).slice(0, count);
const ensureScale = (scale) => {
  if (!SCALE_INDEX.has(scale)) throw new RangeError(`Unknown scale: ${scale}`);
};
const ensurePositiveInteger = (value, name) => {
  if (!Number.isInteger(value) || value <= 0) throw new TypeError(`${name} must be a positive integer.`);
};

export class EmergentLayer {
  constructor({ level = 0, scale = SCALES[level] ?? SCALES[0], dimensions = DEFAULT_DIMENSIONS } = {}) {
    ensurePositiveInteger(Math.max(dimensions, 1), 'dimensions');
    ensureScale(scale);
    this.level = Math.max(0, Math.floor(level));
    this.scale = scale;
    this.dimensions = dimensions;
    this.state = scaleVector(scaleSignature(scale, dimensions), PHI ** -(this.level + 1));
    this.voidFraction = DEFAULT_VOID_FRACTION;
    this.lastEmergence = null;
  }

  update(state) {
    this.state = toVector(state, this.dimensions);
    return this;
  }

  complexity() {
    return complexityScore(this.state, this.level);
  }

  isEmergent(subLayers = []) {
    const lowerComplexity = sum(subLayers.map((layer, index) => {
      if (layer instanceof EmergentLayer) return layer.complexity();
      return complexityScore(toVector(layer, this.dimensions), Math.max(0, this.level - 1 + index * PHI_INV));
    }));
    const wholeComplexity = this.complexity();
    const threshold = wholeComplexity * PHI_INV;
    const emergent = lowerComplexity < threshold;
    this.lastEmergence = {
      lowerComplexity,
      wholeComplexity,
      threshold,
      emergent,
      irreducibility: Math.max(0, threshold - lowerComplexity),
    };
    return emergent;
  }

  properties() {
    return {
      level: this.level,
      scale: this.scale,
      dimensions: this.dimensions,
      voidFraction: this.voidFraction,
      hierarchyScale: PHI ** this.level,
      complexity: this.complexity(),
      state: [...this.state],
      reducible: this.reducible(),
      lastEmergence: this.lastEmergence ? { ...this.lastEmergence } : null,
    };
  }

  reducible() {
    if (this.lastEmergence) return !this.lastEmergence.emergent;
    return this.complexity() <= (this.level + 1) * PHI;
  }
}

export class Simulacrum {
  constructor({ source = null, fidelity = 1, range = PHI } = {}) {
    this.source = deepClone(source ?? { values: [] });
    this.fidelity = clamp(Number(fidelity) || 0, EPSILON, PHI);
    this.range = Math.max(Number(range) || PHI, EPSILON);
    this.intensity = this.fidelity;
    this.age = 0;
    this.history = [];
  }

  propagate(distanceValue) {
    const attenuation = phiAttenuation(distanceValue, this.range);
    const intensity = this.intensity * attenuation;
    const signal = {
      source: deepClone(this.source),
      distance: Math.abs(distanceValue),
      attenuation,
      intensity,
      fidelity: clamp(this.fidelity * attenuation, EPSILON, PHI),
    };
    this.history.push(signal);
    this.history = limitLength(this.history, DEFAULT_MEMORY);
    return signal;
  }

  perceive(observer = null) {
    const sourcePosition = extractPosition(this.source);
    const observerPosition = extractPosition(observer);
    const observerDistance = distance(sourcePosition, observerPosition);
    return this.propagate(observerDistance);
  }

  attenuate(steps = 1) {
    const safeSteps = Math.max(0, Number(steps) || 0);
    this.fidelity *= PHI ** -safeSteps;
    this.intensity *= PHI ** -safeSteps;
    return this.fidelity;
  }

  decay(dt = 1) {
    const safeDt = Math.max(0, Number(dt) || 0);
    this.age += safeDt;
    const decayedFidelity = mortality(this.fidelity, safeDt, this.range);
    const decayedIntensity = mortality(this.intensity, safeDt, this.range);
    this.fidelity = clamp(decayedFidelity, EPSILON, PHI);
    this.intensity = clamp(decayedIntensity, EPSILON, PHI);
    return {
      age: this.age,
      fidelity: this.fidelity,
      intensity: this.intensity,
      range: this.range,
    };
  }
}

export class Clinamen {
  constructor({ probability = 0.05 * PHI_INV, magnitude = EPSILON * PHI_SQ, seed = 0x434c494e } = {}) {
    this.probability = clamp(Number(probability) || 0, EPSILON, 1);
    this.magnitude = Math.max(Number(magnitude) || EPSILON, EPSILON);
    this.rng = createRng(seed);
    this.swerveCount = 0;
    this.lastDecision = null;
  }

  shouldSwerve(step = 0) {
    const safeStep = Math.max(0, Math.floor(Number(step) || 0));
    const intervalLift = PHI ** -(safeStep % SCALES.length);
    const threshold = clamp(this.probability + intervalLift * EPSILON * PHI_SQ, EPSILON, 1);
    const draw = this.rng();
    const triggered = draw < threshold;
    this.lastDecision = { step: safeStep, threshold, draw, triggered };
    if (triggered) this.swerveCount += 1;
    return triggered;
  }

  swerve(state) {
    const vector = toVector(state, Array.isArray(state) ? state.length : DEFAULT_DIMENSIONS);
    const swerved = vector.map((value, index) => {
      const sign = this.rng() >= 0.5 ? 1 : -1;
      const delta = this.magnitude * PHI ** -(index + 1) * sign;
      return value + delta;
    });
    return restoreShape(state, swerved);
  }

  novelty(before, after) {
    const left = toVector(before, Array.isArray(before) ? before.length : DEFAULT_DIMENSIONS);
    const right = toVector(after, Array.isArray(after) ? after.length : DEFAULT_DIMENSIONS);
    const delta = distance(left, right);
    const baseline = 1 + complexityScore(left);
    return delta / baseline;
  }
}

export class ScaleExpert {
  constructor({ id, scale = 'atomic', dimensions = DEFAULT_DIMENSIONS, seed = 0x5343414c } = {}) {
    if (id == null) throw new TypeError('ScaleExpert id is required.');
    ensureScale(scale);
    ensurePositiveInteger(dimensions, 'dimensions');
    this.id = String(id);
    this.scale = scale;
    this.dimensions = dimensions;
    this.scaleIndex = SCALE_INDEX.get(scale);
    this.rng = createRng(hashSeed(seed) + this.scaleIndex * 97 + hashSeed(id));
    this.signature = scaleSignature(scale, dimensions);
    this.bias = Array.from({ length: dimensions }, (_, index) => (this.rng() - 0.5) * PHI ** -(index + 1));
    this.memory = [];
    this.forwardCount = 0;
    this.predictCount = 0;
  }

  forward(state) {
    const input = toVector(state, this.dimensions);
    const resonance = cosineSimilarity(normalize(input), normalize(this.signature));
    const transformed = input.map((value, index) => {
      const neighbor = input[(index + 1) % input.length] ?? 0;
      const phase = (index + 1) * (this.scaleIndex + 1) * PHI_INV;
      const composite = value + neighbor * PHI_INV + this.signature[index] * PHI + this.bias[index];
      return Math.tanh(composite * Math.cos(phase * PHI_INV)) * (1 + this.scaleIndex * PHI_INV);
    });
    const emergent = this.emergentProperties([input, transformed]);
    const complexity = complexityScore(transformed, this.scaleIndex);
    const confidence = clamp((resonance + 1) * 0.5 + emergent.synergy * PHI_INV * 0.25, EPSILON, 1);
    const output = {
      expertId: this.id,
      scale: this.scale,
      input,
      output: transformed,
      resonance,
      complexity,
      confidence,
      emergent,
    };
    this.forwardCount += 1;
    this.memory.push({ ...output, output: [...output.output] });
    this.memory = limitLength(this.memory, DEFAULT_MEMORY);
    return output;
  }

  emergentProperties(subStates = []) {
    const vectors = subStates.map((state) => toVector(state, this.dimensions));
    const combined = weightedAverageVectors(vectors, ones(vectors.length, 1));
    const synergy = pairwiseSynergy(vectors);
    const coherence = 1 / (1 + variance(combined));
    const patternDensity = complexityScore(combined, this.scaleIndex) * PHI_INV;
    const memoryNovelty = this.memory.length
      ? mean(this.memory.slice(-Math.min(this.memory.length, 5)).map((entry) => distance(entry.output, combined))) * PHI_INV
      : PHI_INV;
    return {
      scale: this.scale,
      synergy,
      coherence,
      patternDensity,
      memoryNovelty,
      emergent: complexityScore(combined, this.scaleIndex) > sum(vectors.map((vector) => complexityScore(vector, this.scaleIndex))) * PHI_INV,
    };
  }

  predict(state, dt = 1) {
    const safeDt = Math.max(0, Number(dt) || 0);
    const forward = this.forward(state);
    const prediction = forward.output.map((value, index) => {
      const drift = this.signature[index] * PHI_INV * safeDt;
      const coupling = forward.emergent.synergy * this.bias[index] * PHI;
      return value + drift + coupling;
    });
    this.predictCount += 1;
    return {
      ...forward,
      dt: safeDt,
      prediction,
      scaleRadius: PHI ** this.scaleIndex,
    };
  }
}

export class EmergenceGating {
  constructor({ numExperts = SCALES.length, scales = SCALES } = {}) {
    ensurePositiveInteger(numExperts, 'numExperts');
    this.numExperts = numExperts;
    this.scales = [...scales];
    this.assignments = Array.from({ length: numExperts }, (_, index) => this.scales[index % this.scales.length]);
  }

  route(observation) {
    const vector = toVector(observation, Array.isArray(observation) ? observation.length : DEFAULT_DIMENSIONS);
    const complexity = complexityScore(vector);
    const density = safeDivide(vector.filter((value) => Math.abs(value) > EPSILON).length, vector.length, 0);
    const variability = variance(vector) * PHI;
    const coupling = interactionTerm(vector) * PHI;
    const informational = entropy(vector.map((value) => Math.abs(value))) * PHI_INV;
    const profile = complexity + density + variability + coupling + informational;
    const scaleScores = this.scales.map((scale, index) => {
      const target = SCALE_TARGET_COMPLEXITY[scale] ?? 1;
      const bandwidth = SCALE_BANDWIDTH[scale] ?? 1;
      const mismatch = Math.abs(profile - target);
      const score = Math.exp(-mismatch / Math.max(bandwidth, EPSILON)) * (1 + index * PHI_INV * 0.25);
      return { scale, index, target, bandwidth, score };
    });
    const probabilities = softmax(scaleScores.map((entry) => Math.log(entry.score + EPSILON) * PHI));
    const ranked = scaleScores
      .map((entry, index) => ({ ...entry, probability: probabilities[index] }))
      .sort((left, right) => right.probability - left.probability);
    const selected = ranked[0];
    const expertScores = this.assignments.map((scale, expertIndex) => {
      const scaleDistance = Math.abs((SCALE_INDEX.get(scale) ?? 0) - selected.index);
      const score = selected.probability * PHI ** -scaleDistance;
      return { expertIndex, scale, score };
    });
    return {
      vector,
      complexity,
      density,
      variability,
      coupling,
      informational,
      profile,
      rankedScales: ranked,
      selectedScale: selected.scale,
      selectedIndex: selected.index,
      scaleProbabilities: Object.fromEntries(ranked.map((entry) => [entry.scale, entry.probability])),
      selectedExperts: selectTop(expertScores, Math.min(3, this.numExperts)),
      hierarchyScale: PHI ** selected.index,
    };
  }

  detectEmergence(lower, upper) {
    const lowerVectors = (Array.isArray(lower) ? lower : [lower]).map((value) => value instanceof EmergentLayer ? value.state : toVector(value, DEFAULT_DIMENSIONS));
    const upperVector = upper instanceof EmergentLayer ? upper.state : toVector(upper, DEFAULT_DIMENSIONS);
    const lowerComplexity = sum(lowerVectors.map((vector, index) => complexityScore(vector, index)));
    const upperComplexity = complexityScore(upperVector, lowerVectors.length);
    const threshold = upperComplexity * PHI_INV;
    return {
      lowerComplexity,
      upperComplexity,
      threshold,
      emergent: lowerComplexity < threshold,
      irreducibility: Math.max(0, threshold - lowerComplexity),
    };
  }
}

export class MoELucretius {
  constructor({ dimensions = DEFAULT_DIMENSIONS, numExperts = SCALES.length, seed = 0x4c554352 } = {}) {
    ensurePositiveInteger(dimensions, 'dimensions');
    ensurePositiveInteger(numExperts, 'numExperts');
    this.dimensions = dimensions;
    this.numExperts = numExperts;
    this.seed = hashSeed(seed);
    this.rng = createRng(this.seed);
    this.decayTau = DEFAULT_DECAY_TAU;
    this.voidFraction = DEFAULT_VOID_FRACTION;
    this.experts = Array.from({ length: numExperts }, (_, index) => new ScaleExpert({
      id: `lucretius-${index}`,
      scale: SCALES[index % SCALES.length],
      dimensions,
      seed: this.seed + index * 131,
    }));
    this.layers = SCALES.map((scale, index) => new EmergentLayer({ level: index, scale, dimensions }));
    this.gating = new EmergenceGating({ numExperts, scales: SCALES });
    this.clinamen = new Clinamen({ probability: 0.08 * PHI_INV, magnitude: EPSILON * PHI_SQ, seed: this.seed ^ 0x51515757 });
    this.world = scaleVector(scaleSignature('atomic', dimensions), PHI_INV);
    this.worldAge = 0;
    this.stepCount = 0;
    this.history = [];
    this.simulacra = [];
    this.observations = [];
    this.predictions = [];
    this.noveltyHistory = [];
    this.lastObservation = null;
    this.lastEmergence = null;
    this.lastPrediction = null;
  }

  #activeExperts(route) {
    const selectedIds = new Set(route.selectedExperts.map((entry) => entry.expertIndex));
    const chosen = this.experts.filter((_, index) => selectedIds.has(index));
    return chosen.length ? chosen : [this.experts[0]];
  }

  #blendPredictions(predictions, route) {
    const weights = predictions.map((prediction) => {
      const routeWeight = route.scaleProbabilities[prediction.scale] ?? PHI_INV;
      return prediction.confidence * routeWeight + prediction.emergent.synergy * PHI_INV;
    });
    const normalized = softmax(weights.map((value) => Math.log(value + EPSILON) * PHI));
    return {
      weights: normalized,
      vector: weightedAverageVectors(predictions.map((prediction) => prediction.prediction ?? prediction.output), normalized),
    };
  }

  #updateLayers(stateVector) {
    this.layers.forEach((layer, index) => {
      layer.update(scaleProjection(stateVector, index));
    });
    return this.layers;
  }

  observe(world) {
    const vector = toVector(world, this.dimensions);
    this.world = [...vector];
    const route = this.gating.route(vector);
    const experts = this.#activeExperts(route);
    const expertViews = experts.map((expert) => expert.forward(vector));
    const weights = softmax(expertViews.map((view) => Math.log(view.confidence + EPSILON) * PHI));
    const synthesis = weightedAverageVectors(expertViews.map((view) => view.output), weights);
    this.#updateLayers(synthesis);
    const emergence = this.emergence(synthesis);
    const simulacrum = new Simulacrum({
      source: { position: [this.stepCount, route.selectedIndex, this.worldAge], values: synthesis, scale: route.selectedScale },
      fidelity: clamp(mean(expertViews.map((view) => view.confidence)), EPSILON, 1),
      range: PHI ** (route.selectedIndex + 1),
    });
    this.simulacra.push(simulacrum);
    this.simulacra = limitLength(this.simulacra, DEFAULT_SIMULACRA);
    const observation = {
      step: this.stepCount,
      world: [...vector],
      route,
      experts: expertViews.map((view) => ({ ...view, input: [...view.input], output: [...view.output] })),
      synthesis,
      emergence,
      simulacrum: simulacrum.propagate(0),
    };
    this.lastObservation = observation;
    this.observations.push(observation);
    this.observations = limitLength(this.observations, DEFAULT_MEMORY);
    return observation;
  }

  predict(horizon = DEFAULT_HORIZON) {
    const steps = Math.max(1, Math.floor(Number(horizon) || DEFAULT_HORIZON));
    let current = [...this.world];
    const trajectory = [];
    for (let index = 0; index < steps; index += 1) {
      const route = this.gating.route(current);
      const experts = this.#activeExperts(route);
      const predictions = experts.map((expert) => expert.predict(current, 1));
      const blended = this.#blendPredictions(predictions, route);
      current = blended.vector.map((value, dimension) => mortality(value, 1, this.decayTau) + this.voidFraction * current[dimension] * PHI_INV);
      trajectory.push({
        horizon: index + 1,
        route,
        weights: blended.weights,
        state: [...current],
        scales: predictions.map((prediction) => prediction.scale),
      });
    }
    const prediction = { horizon: steps, trajectory, finalState: [...current] };
    this.lastPrediction = prediction;
    this.predictions.push(prediction);
    this.predictions = limitLength(this.predictions, DEFAULT_MEMORY);
    return prediction;
  }

  emergence(observation) {
    const vector = toVector(observation, this.dimensions);
    const layered = this.layers.map((layer, index) => {
      const projected = scaleProjection(vector, index);
      layer.update(projected);
      return layer;
    });
    const links = layered.map((layer, index) => {
      if (index === 0) {
        return {
          scale: layer.scale,
          level: layer.level,
          complexity: layer.complexity(),
          emergent: false,
          basis: 'atomic-ground',
        };
      }
      const lower = layered.slice(0, index);
      const detection = this.gating.detectEmergence(lower, layer);
      layer.lastEmergence = detection;
      return {
        scale: layer.scale,
        level: layer.level,
        complexity: layer.complexity(),
        emergent: detection.emergent,
        irreducibility: detection.irreducibility,
        threshold: detection.threshold,
      };
    });
    const globalEmergence = links.some((entry) => entry.emergent);
    const irreducibility = sum(links.map((entry) => entry.irreducibility ?? 0));
    const result = {
      globalEmergence,
      irreducibility,
      layers: links,
      scaleHierarchy: links.map((entry) => ({ scale: entry.scale, ladder: PHI ** entry.level })),
    };
    this.lastEmergence = result;
    return result;
  }

  simulate(steps = 1) {
    const safeSteps = Math.max(1, Math.floor(Number(steps) || 1));
    const frames = [];
    for (let index = 0; index < safeSteps; index += 1) frames.push(this.step(1));
    return {
      steps: safeSteps,
      frames,
      finalState: [...this.world],
      metrics: this.metrics(),
    };
  }

  noveltyRate() {
    return mean(this.noveltyHistory);
  }

  step(dt = 1) {
    const safeDt = Math.max(EPSILON, Number(dt) || 1);
    const route = this.gating.route(this.world);
    const experts = this.#activeExperts(route);
    const predictions = experts.map((expert) => expert.predict(this.world, safeDt));
    const blended = this.#blendPredictions(predictions, route);
    let next = blended.vector.map((value, index) => {
      const decayed = mortality(value, safeDt, this.decayTau);
      const persistence = this.world[index] * (1 - this.voidFraction * PHI_INV);
      const synergy = mean(predictions.map((prediction) => prediction.emergent.synergy)) * this.voidFraction;
      return decayed + persistence * PHI_INV + synergy * this.layers[Math.min(index, this.layers.length - 1)].complexity() * EPSILON;
    });
    let clinamenApplied = false;
    if (this.clinamen.shouldSwerve(this.stepCount)) {
      next = toVector(this.clinamen.swerve(next), this.dimensions);
      clinamenApplied = true;
    }
    const novelty = this.clinamen.novelty(this.world, next) + (clinamenApplied ? PHI_INV : 0);
    this.world = [...next];
    this.worldAge += safeDt;
    this.stepCount += 1;
    this.noveltyHistory.push(novelty);
    this.noveltyHistory = limitLength(this.noveltyHistory, DEFAULT_MEMORY);
    this.#updateLayers(next);
    const emergence = this.emergence(next);
    this.simulacra.forEach((simulacrum) => simulacrum.decay(safeDt));
    const newSimulacrum = new Simulacrum({
      source: { position: [this.stepCount, route.selectedIndex, this.worldAge], values: next, scale: route.selectedScale },
      fidelity: clamp(1 - novelty * PHI_INV, EPSILON, 1),
      range: PHI ** (route.selectedIndex + 1),
    });
    this.simulacra.push(newSimulacrum);
    this.simulacra = limitLength(this.simulacra.filter((simulacrum) => simulacrum.fidelity > EPSILON), DEFAULT_SIMULACRA);
    const frame = {
      step: this.stepCount,
      dt: safeDt,
      route,
      activeScales: predictions.map((prediction) => prediction.scale),
      weights: blended.weights,
      state: [...next],
      novelty,
      clinamenApplied,
      emergence,
      mortality: mortality(1, this.worldAge, this.decayTau),
    };
    this.history.push(frame);
    this.history = limitLength(this.history, DEFAULT_MEMORY);
    return frame;
  }

  metrics() {
    const expertUtilization = this.experts.reduce((accumulator, expert) => {
      accumulator[expert.scale] = accumulator[expert.scale] ?? { forwards: 0, predicts: 0, experts: 0 };
      accumulator[expert.scale].forwards += expert.forwardCount;
      accumulator[expert.scale].predicts += expert.predictCount;
      accumulator[expert.scale].experts += 1;
      return accumulator;
    }, {});
    return {
      dimensions: this.dimensions,
      numExperts: this.numExperts,
      steps: this.stepCount,
      worldAge: this.worldAge,
      noveltyRate: this.noveltyRate(),
      totalSwerves: this.clinamen.swerveCount,
      voidFraction: this.voidFraction,
      infiniteTilingFactor: this.numExperts * PHI,
      decay: mortality(1, this.worldAge, this.decayTau),
      currentScale: this.lastObservation?.route?.selectedScale ?? this.gating.route(this.world).selectedScale,
      emergence: this.lastEmergence,
      complexityByScale: Object.fromEntries(this.layers.map((layer) => [layer.scale, layer.complexity()])),
      simulacra: this.simulacra.map((simulacrum, index) => ({
        id: index,
        fidelity: simulacrum.fidelity,
        intensity: simulacrum.intensity,
        age: simulacrum.age,
        range: simulacrum.range,
      })),
      expertUtilization,
    };
  }
}

export default MoELucretius;

/// Casa de Medina — Architectos de Architectura Inteligente
