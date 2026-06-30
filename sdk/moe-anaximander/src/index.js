///
/// @medina/moe-anaximander — MIXTURE OF EXPERTS: ANAXIMANDER
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║     ANAXIMANDER — COSMOLOGICAL WORLD MODEL via APEIRON FIELD THEORY         ║
/// ║                                                                              ║
/// ║  Named for Anaximander of Miletus — first to model the cosmos               ║
/// ║  mathematically.                                                             ║
/// ║                                                                              ║
/// ║  Architecture: World model where reality regions emerge from an             ║
/// ║  infinite field (apeiron). Experts represent bounded world-states           ║
/// ║  that crystallize from the infinite via separation of opposites             ║
/// ║  (hot/cold, wet/dry). φ governs the emergence thresholds.                   ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Apeiron field: Ψ(x,t) = ∫ A(k)·e^(i(k·x−ωt)) dk — infinite             ║
/// ║      superposition                                                           ║
/// ║    • Emergence threshold: |∇Ψ| > φ → world-state crystallizes               ║
/// ║    • Separation of opposites: quality_pair = (Ψ + Ψ*)/2,                    ║
/// ║      (Ψ − Ψ*)/(2i)                                                           ║
/// ║    • Bounded region: R = {x : |Ψ(x)| > φ⁻¹} — finite world from infinite   ║
/// ║    • Cosmic justice (dikē): Σ regions must return to apeiron: ∮ Ψ·ds = 0   ║
/// ║    • φ-cylinder cosmology: world as cylinder r=φ, h=3φ                      ║
/// ║    • Centrifugal separation: ω² = φ·g/r — spin separates elements           ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI * PHI;
export const PI = Math.PI;
export const TAU = Math.PI * 2;
export const EPSILON = 1e-9;
export const WORLD_DIMENSIONS = 7;
export const COSMIC_CYLINDER = Object.freeze({ radius: PHI, height: 3 * PHI });

const DEFAULT_RESOLUTION = 64;
const DEFAULT_EXPERTS = 5;
const DEFAULT_SIMULATION_STEPS = 8;
const DEFAULT_OPPOSITES = Object.freeze([
  Object.freeze(['hot', 'cold']),
  Object.freeze(['wet', 'dry']),
  Object.freeze(['light', 'dark']),
  Object.freeze(['dense', 'rare']),
]);

const isFiniteNumber = (value) => Number.isFinite(value) && !Number.isNaN(value);
const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const lerp = (from, to, t) => from + (to - from) * t;
const fract = (value) => value - Math.floor(value);
const sum = (values) => values.reduce((total, value) => total + value, 0);
const mean = (values) => (values.length ? sum(values) / values.length : 0);
const variance = (values) => {
  if (!values.length) return 0;
  const center = mean(values);
  return mean(values.map((value) => (value - center) ** 2));
};
const round = (value, digits = 12) => Math.round(value * 10 ** digits) / 10 ** digits;
const zeroVector = (length) => Array.from({ length }, () => 0);
const filledVector = (length, value) => Array.from({ length }, () => value);
const copyVector = (vector) => vector.slice();
const addVectors = (left, right) => Array.from({ length: Math.max(left.length, right.length) }, (_, index) => (left[index] || 0) + (right[index] || 0));
const subtractVectors = (left, right) => Array.from({ length: Math.max(left.length, right.length) }, (_, index) => (left[index] || 0) - (right[index] || 0));
const scaleVector = (vector, scalar) => vector.map((value) => value * scalar);
const dot = (left, right) => left.reduce((total, value, index) => total + value * (right[index] || 0), 0);
const magnitude = (vector) => Math.sqrt(Math.max(dot(vector, vector), 0));
const distance = (left, right) => magnitude(subtractVectors(left, right));
const normalize = (vector) => {
  const length = magnitude(vector);
  return length <= EPSILON ? vector.map((_, index) => (index === 0 ? 1 : 0)) : vector.map((value) => value / length);
};
const normalizeWeights = (weights) => {
  const safe = weights.map((value) => (isFiniteNumber(value) && value > 0 ? value : 0));
  const total = sum(safe);
  return total <= EPSILON ? safe.map(() => (safe.length ? 1 / safe.length : 0)) : safe.map((value) => value / total);
};
const entropyOf = (weights) => normalizeWeights(weights).reduce((entropy, value) => (value <= EPSILON ? entropy : entropy - value * Math.log2(value)), 0);
const softmax = (scores, temperature = 1) => {
  const safeTemperature = Math.max(Math.abs(temperature), EPSILON);
  const maxScore = Math.max(...scores);
  const exponents = scores.map((score) => Math.exp((score - maxScore) / safeTemperature));
  return normalizeWeights(exponents);
};
const weightedAverage = (values, weights) => values.reduce((total, value, index) => total + value * (weights[index] || 0), 0);
const weightedVectorAverage = (vectors, weights) => {
  if (!vectors.length) return [];
  const width = Math.max(...vectors.map((vector) => vector.length));
  const output = zeroVector(width);
  for (let row = 0; row < vectors.length; row += 1) {
    for (let column = 0; column < width; column += 1) output[column] += (vectors[row][column] || 0) * (weights[row] || 0);
  }
  return output;
};
const sigmoid = (value) => 1 / (1 + Math.exp(-value));
const hashString = (value) => {
  const text = String(value ?? 'anaximander');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};
const normalizeSeed = (seed) => {
  if (typeof seed === 'number' && Number.isInteger(seed)) return seed >>> 0;
  if (typeof seed === 'bigint') return Number(seed & BigInt(0xffffffff));
  if (typeof seed === 'string') return hashString(seed);
  return hashString(JSON.stringify(seed ?? 'apeiron'));
};
const createPRNG = (seed) => {
  let state = normalizeSeed(seed) || 0x9e3779b9;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let result = state;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};
const scalarNoise = (seed, ...coordinates) => {
  let value = normalizeSeed(seed) || 1;
  coordinates.forEach((coordinate, index) => {
    const scaled = Math.round((coordinate + index * PHI) * 1e6);
    value ^= scaled + 0x9e3779b9 + (value << 6) + (value >> 2);
    value = Math.imul(value, 1664525) + 1013904223;
  });
  return ((value >>> 0) % 104729) / 104729;
};
const goldenAxis = (index, dimensions, phase = 0) => {
  const axis = Array.from({ length: dimensions }, (_, dimension) => {
    const angle = (index + 1) * (dimension + 1) * PHI_INV + phase;
    const primary = Math.sin(angle * TAU);
    const secondary = Math.cos(angle * PI * PHI);
    const golden = Math.sin((index + dimension + 1) * PHI_INV);
    return primary + secondary * PHI_INV + golden / PHI_SQ;
  });
  return normalize(axis);
};
const ensurePositiveInteger = (name, value, fallback) => {
  const numeric = value == null ? fallback : Number(value);
  if (!Number.isInteger(numeric) || numeric <= 0) throw new RangeError(`${name} must be a positive integer.`);
  return numeric;
};
const ensureFiniteNumber = (name, value, fallback = 0) => {
  const numeric = value == null ? fallback : Number(value);
  if (!isFiniteNumber(numeric)) throw new TypeError(`${name} must be a finite number.`);
  return numeric;
};
const ensureVector = (value, dimensions) => {
  if (Array.isArray(value)) {
    return Array.from({ length: dimensions }, (_, index) => (isFiniteNumber(value[index]) ? value[index] : 0));
  }
  if (ArrayBuffer.isView(value)) {
    return Array.from({ length: dimensions }, (_, index) => (isFiniteNumber(value[index]) ? Number(value[index]) : 0));
  }
  if (isPlainObject(value) && Array.isArray(value.vector)) return ensureVector(value.vector, dimensions);
  if (isFiniteNumber(value)) return Array.from({ length: dimensions }, (_, index) => (index === 0 ? Number(value) : 0));
  return zeroVector(dimensions);
};
function flattenNumericSignal(value, bucket = [], depth = 0) {
  if (depth > 6 || bucket.length >= 512) return bucket;
  if (value == null) {
    bucket.push(0);
    return bucket;
  }
  if (isFiniteNumber(value)) {
    bucket.push(Number(value));
    return bucket;
  }
  if (typeof value === 'bigint') {
    bucket.push(Number(value));
    return bucket;
  }
  if (typeof value === 'boolean') {
    bucket.push(value ? 1 : -1);
    return bucket;
  }
  if (typeof value === 'string') {
    for (let index = 0; index < value.length && bucket.length < 512; index += 1) {
      const code = (value.charCodeAt(index) || 0) / 255;
      bucket.push(Math.sin(code * (index + 1) * PHI));
      bucket.push(Math.cos(code * (index + 1) * PHI_INV));
    }
    bucket.push(value.length * PHI_INV);
    return bucket;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => {
      flattenNumericSignal(entry, bucket, depth + 1);
      bucket.push((index + 1) * PHI_INV);
    });
    bucket.push(value.length / PHI);
    return bucket;
  }
  if (ArrayBuffer.isView(value)) {
    Array.from(value).forEach((entry) => bucket.push(Number(entry) || 0));
    bucket.push(value.length * PHI_INV);
    return bucket;
  }
  if (isPlainObject(value)) {
    Object.keys(value).sort().forEach((key, index) => {
      flattenNumericSignal(key, bucket, depth + 1);
      flattenNumericSignal(value[key], bucket, depth + 1);
      bucket.push((index + 1) / PHI_SQ);
    });
    bucket.push(Object.keys(value).length * PHI_INV);
    return bucket;
  }
  bucket.push(String(value).length * PHI_INV);
  return bucket;
}
function encodeSignal(signal, dimensions, phase = 0) {
  const scalars = signal.length ? signal : [0];
  const output = zeroVector(dimensions);
  for (let dimension = 0; dimension < dimensions; dimension += 1) {
    let accumulator = 0;
    for (let index = 0; index < scalars.length; index += 1) {
      const scalar = scalars[index];
      const angle = (dimension + 1) * (index + 1) * PHI_INV + phase;
      accumulator += scalar * Math.sin(angle * TAU) / (1 + index * PHI_INV);
      accumulator += scalar * Math.cos(angle * PI) / (1 + dimension * PHI_INV);
    }
    output[dimension] = accumulator / scalars.length;
  }
  const center = mean(output);
  const shaped = output.map((value, index) => {
    const forward = output[(index + 1) % output.length] || 0;
    const backward = output[(index - 1 + output.length) % output.length] || 0;
    return value - center + (forward - 2 * value + backward) * PHI_INV;
  });
  return normalize(shaped);
}
const rotateOpposites = (pairs, offset = 0) => pairs.map((_, index) => pairs[(index + offset) % pairs.length]);
const stableId = (prefix, seed, index) => `${prefix}-${String(index + 1).padStart(2, '0')}-${normalizeSeed(seed + index).toString(16).slice(0, 6)}`;
const cloneQualityEntry = (entry) => ({
  axis: entry.axis,
  pair: [...entry.pair],
  coordinate: entry.coordinate,
  magnitude: entry.magnitude,
  dominant: entry.dominant,
});
const cloneRegion = (region) => ({
  ...region,
  center: copyVector(region.center),
  gradient: copyVector(region.gradient),
  qualities: region.qualities.map(cloneQualityEntry),
});
function sampleToQualities(sample, opposites = DEFAULT_OPPOSITES) {
  const qualityPair = [(sample.re + sample.re) / 2, (sample.im - (-sample.im)) / (2)];
  return opposites.map((pair, index) => {
    const phase = sample.phase + index * PHI_INV;
    const coordinate = clamp((qualityPair[0] * Math.cos(phase) + qualityPair[1] * Math.sin(phase)) / Math.max(sample.magnitude, 1), -PHI, PHI);
    return {
      axis: index,
      pair: [...pair],
      coordinate,
      magnitude: Math.abs(coordinate),
      dominant: coordinate >= 0 ? pair[0] : pair[1],
    };
  });
}
function mergeRegions(candidates, threshold) {
  const clusters = [];
  for (const candidate of candidates) {
    const cluster = clusters.find((entry) => distance(entry.center, candidate.center) <= threshold);
    if (!cluster) {
      clusters.push({ ...candidate, ids: [candidate.id], sampleCount: 1 });
      continue;
    }
    const nextCount = cluster.sampleCount + 1;
    cluster.center = scaleVector(addVectors(scaleVector(cluster.center, cluster.sampleCount), candidate.center), 1 / nextCount);
    cluster.gradient = scaleVector(addVectors(scaleVector(cluster.gradient, cluster.sampleCount), candidate.gradient), 1 / nextCount);
    cluster.fieldMagnitude = lerp(cluster.fieldMagnitude, candidate.fieldMagnitude, 1 / nextCount);
    cluster.gradientMagnitude = lerp(cluster.gradientMagnitude, candidate.gradientMagnitude, 1 / nextCount);
    cluster.radius = Math.max(cluster.radius, candidate.radius);
    cluster.sampleCount = nextCount;
    cluster.ids.push(candidate.id);
    cluster.qualities = cluster.qualities.map((quality, index) => {
      const merged = lerp(quality.coordinate, candidate.qualities[index].coordinate, 1 / nextCount);
      return {
        axis: quality.axis,
        pair: [...quality.pair],
        coordinate: merged,
        magnitude: Math.abs(merged),
        dominant: merged >= 0 ? quality.pair[0] : quality.pair[1],
      };
    });
  }
  return clusters.map((cluster, index) => ({
    id: `region-${index + 1}`,
    center: cluster.center.map((value) => round(value, 10)),
    gradient: cluster.gradient.map((value) => round(value, 10)),
    gradientMagnitude: round(cluster.gradientMagnitude, 10),
    fieldMagnitude: round(cluster.fieldMagnitude, 10),
    radius: round(cluster.radius, 10),
    qualities: cluster.qualities.map(cloneQualityEntry),
    sampleCount: cluster.sampleCount,
    boundary: { threshold: PHI_INV, justiceResidual: round(cluster.gradientMagnitude / (1 + cluster.sampleCount * PHI), 10) },
  }));
}
function aggregateQualities(states, weights, opposites = DEFAULT_OPPOSITES) {
  return opposites.map((pair, index) => {
    const coordinate = weightedAverage(states.map((state) => state.qualities[index]?.coordinate || 0), weights);
    return {
      axis: index,
      pair: [...pair],
      coordinate,
      magnitude: Math.abs(coordinate),
      dominant: coordinate >= 0 ? pair[0] : pair[1],
    };
  });
}

export class ApeironField {
  constructor({ dimensions = WORLD_DIMENSIONS, resolution = DEFAULT_RESOLUTION, seed = 0 } = {}) {
    this.dimensions = ensurePositiveInteger('dimensions', dimensions, WORLD_DIMENSIONS);
    this.resolution = ensurePositiveInteger('resolution', resolution, DEFAULT_RESOLUTION);
    this.seed = normalizeSeed(seed);
    this.random = createPRNG(this.seed);
    this.time = 0;
    this.gravity = 1;
    this.scanDensity = clamp(Math.round(this.resolution / PHI_INV), 24, 128);
    this.modeCount = clamp(Math.round(Math.sqrt(this.resolution) * PHI_SQ * 4), 16, 72);
    this.modes = Array.from({ length: this.modeCount }, (_, index) => this.#createMode(index));
    this.worldStates = [];
    this.totalEmergences = 0;
    this.#crystallize();
  }

  #createMode(index) {
    const radius = COSMIC_CYLINDER.radius + (index + 1) * PHI_INV / this.modeCount;
    const spin = Math.sqrt((PHI * this.gravity) / Math.max(radius, EPSILON));
    return {
      amplitude: 0.5 + PHI_INV / (1 + index * PHI_INV),
      omega: spin * (1 + scalarNoise(this.seed, index, PHI) * PHI_INV),
      phase: TAU * scalarNoise(this.seed, index, PI),
      waveVector: Array.from({ length: this.dimensions }, (_, axis) => {
        const harmonic = (index + 1) * (axis + 1) * PHI_INV;
        return Math.sin(harmonic * TAU) + Math.cos(harmonic * PI * PHI_INV);
      }),
    };
  }

  #positionVector(position) {
    return ensureVector(position, this.dimensions);
  }

  #sampleAt(position, time) {
    const vector = this.#positionVector(position);
    const radial = Math.hypot(vector[0] || 0, vector[1] || 0);
    const cylinderFalloff = Math.exp(-Math.abs(radial - COSMIC_CYLINDER.radius) * PHI_INV) * Math.exp(-Math.abs((vector[2] || 0) / COSMIC_CYLINDER.height));
    let re = 0;
    let im = 0;
    for (const mode of this.modes) {
      const phase = dot(mode.waveVector, vector) - mode.omega * time + mode.phase;
      re += mode.amplitude * Math.cos(phase);
      im += mode.amplitude * Math.sin(phase);
    }
    re *= 0.5 + cylinderFalloff * PHI_INV;
    im *= 0.5 + cylinderFalloff / PHI;
    const magnitudeValue = Math.hypot(re, im);
    return {
      position: vector,
      re,
      im,
      magnitude: magnitudeValue,
      phase: Math.atan2(im, re),
      cylinderFalloff,
      qualityPair: [(re + re) / 2, (im - (-im)) / 2],
    };
  }

  #gradientAt(position, time) {
    const vector = this.#positionVector(position);
    const step = PHI_INV / (this.resolution + 1);
    const center = this.#sampleAt(vector, time);
    const derivative = zeroVector(this.dimensions);
    for (let axis = 0; axis < this.dimensions; axis += 1) {
      const forward = copyVector(vector);
      const backward = copyVector(vector);
      forward[axis] += step;
      backward[axis] -= step;
      derivative[axis] = (this.#sampleAt(forward, time).magnitude - this.#sampleAt(backward, time).magnitude) / (2 * step);
    }
    return {
      position: vector,
      sample: center,
      vector: derivative,
      magnitude: magnitude(derivative),
    };
  }

  #scanPosition(index, total) {
    const ratio = (index + 0.5) / total;
    const angle = TAU * fract((index + 1) * PHI_INV + this.time * PHI_INV);
    const radial = COSMIC_CYLINDER.radius * Math.sqrt(fract((index + 1) * PHI_INV * PHI_INV));
    const height = COSMIC_CYLINDER.height * (ratio - 0.5);
    const position = zeroVector(this.dimensions);
    position[0] = radial * Math.cos(angle);
    position[1] = radial * Math.sin(angle);
    position[2] = height;
    for (let axis = 3; axis < this.dimensions; axis += 1) position[axis] = Math.sin((axis + 1) * angle * PHI_INV + this.time) * PHI_INV;
    return position;
  }

  #crystallize() {
    const candidates = [];
    for (let index = 0; index < this.scanDensity; index += 1) {
      const position = this.#scanPosition(index, this.scanDensity);
      const sample = this.#sampleAt(position, this.time);
      const gradient = this.#gradientAt(position, this.time);
      if (gradient.magnitude <= PHI || sample.magnitude <= PHI_INV) continue;
      candidates.push({
        id: `${this.seed}-${this.totalEmergences + index + 1}`,
        center: copyVector(position),
        gradient: copyVector(gradient.vector),
        gradientMagnitude: gradient.magnitude,
        fieldMagnitude: sample.magnitude,
        radius: clamp(sample.magnitude * PHI_INV, PHI_INV, PHI),
        qualities: sampleToQualities(sample),
      });
    }
    this.totalEmergences += candidates.length;
    this.worldStates = mergeRegions(candidates, PHI_INV);
    return this.worldStates;
  }

  sample(position) {
    const sample = this.#sampleAt(position, this.time);
    return {
      ...sample,
      position: copyVector(sample.position),
      qualityPair: [...sample.qualityPair],
    };
  }

  gradient(position) {
    const gradient = this.#gradientAt(position, this.time);
    return {
      ...gradient,
      position: copyVector(gradient.position),
      vector: copyVector(gradient.vector),
      sample: this.sample(gradient.sample.position),
    };
  }

  emergence(position) {
    return this.#gradientAt(position, this.time).magnitude > PHI;
  }

  evolve(dt = PHI_INV) {
    const delta = ensureFiniteNumber('dt', dt, PHI_INV);
    this.time += delta;
    const worldStates = this.#crystallize().map(cloneRegion);
    return { time: this.time, worldStates };
  }

  getWorldStates() {
    return this.worldStates.map(cloneRegion);
  }
}

export class WorldStateExpert {
  constructor({ id, dimensions = WORLD_DIMENSIONS, opposites = DEFAULT_OPPOSITES, seed = 0 } = {}) {
    this.id = id || stableId('expert', seed, 0);
    this.dimensions = ensurePositiveInteger('dimensions', dimensions, WORLD_DIMENSIONS);
    this.opposites = (opposites.length ? opposites : DEFAULT_OPPOSITES).map((pair, index) => {
      if (!Array.isArray(pair) || pair.length !== 2) throw new TypeError(`opposites[${index}] must be a pair.`);
      return [String(pair[0]), String(pair[1])];
    });
    this.seed = normalizeSeed(seed);
    this.phase = scalarNoise(this.seed, 'phase', this.id) * TAU;
    this.axes = this.opposites.map((_, index) => goldenAxis(index, this.dimensions, this.phase + index * PHI_INV));
    this.temporalAxis = goldenAxis(this.opposites.length, this.dimensions, this.phase + PHI);
    this.memoryAxis = goldenAxis(this.opposites.length + 1, this.dimensions, this.phase + PHI_SQ);
  }

  #stateVector(input) {
    if (input && Array.isArray(input.vector)) return ensureVector(input.vector, this.dimensions);
    return encodeSignal(flattenNumericSignal(input), this.dimensions, this.phase);
  }

  encode(observation) {
    const baseVector = this.#stateVector(observation);
    const temporalBias = scaleVector(this.temporalAxis, ((observation?.t ?? 0) % TAU) * PHI_INV * 0.1);
    const memoryBias = scaleVector(this.memoryAxis, sigmoid(mean(baseVector)) * PHI_INV * 0.25);
    const vector = normalize(addVectors(baseVector, addVectors(temporalBias, memoryBias)));
    const qualities = this.quality({ vector, t: observation?.t ?? 0 });
    return {
      expertId: this.id,
      vector,
      t: observation?.t ?? 0,
      amplitude: magnitude(vector),
      qualities,
      signature: {
        variance: variance(vector),
        curvature: mean(vector.map((value, index) => Math.abs((vector[index + 1] || value) - value))),
      },
    };
  }

  quality(state) {
    const vector = this.#stateVector(state);
    return this.opposites.map((pair, index) => {
      const coordinate = clamp(dot(vector, this.axes[index]) * PHI, -PHI, PHI);
      return {
        axis: index,
        pair: [...pair],
        coordinate,
        magnitude: Math.abs(coordinate),
        dominant: coordinate >= 0 ? pair[0] : pair[1],
      };
    });
  }

  predict(state, dt = PHI_INV) {
    const delta = ensureFiniteNumber('dt', dt, PHI_INV);
    const encoded = state?.vector ? { ...state, vector: ensureVector(state.vector, this.dimensions), qualities: state.qualities || this.quality(state) } : this.encode(state);
    const qualityDrift = this.quality(encoded).reduce((drift, entry, index) => addVectors(drift, scaleVector(this.axes[index], entry.coordinate * Math.pow(PHI_INV, index + 1))), zeroVector(this.dimensions));
    const temporalDrift = scaleVector(this.temporalAxis, delta * PHI_INV);
    const harmonicDrift = encoded.vector.map((value, index) => Math.sin(value * PHI + this.phase + delta * (index + 1)) * PHI_INV * 0.1 + Math.cos((index + 1) * delta * PHI_INV) * 0.05);
    const nextVector = normalize(addVectors(encoded.vector, addVectors(scaleVector(qualityDrift, delta / PHI_INV), addVectors(temporalDrift, harmonicDrift))));
    const stability = 1 / (1 + distance(nextVector, encoded.vector) * PHI);
    return {
      expertId: this.id,
      vector: nextVector,
      t: (encoded.t ?? 0) + delta,
      qualities: this.quality({ vector: nextVector }),
      drift: addVectors(qualityDrift, temporalDrift),
      stability,
    };
  }
}

export class CosmicBalancer {
  constructor({ numExperts = DEFAULT_EXPERTS, justiceWeight = PHI_INV } = {}) {
    this.numExperts = ensurePositiveInteger('numExperts', numExperts, DEFAULT_EXPERTS);
    this.justiceWeight = clamp(ensureFiniteNumber('justiceWeight', justiceWeight, PHI_INV), EPSILON, PHI);
    this.lastLoads = filledVector(this.numExperts, 1 / this.numExperts);
    this.lastBalanced = filledVector(this.numExperts, 1 / this.numExperts);
    this.lastJustice = 1;
  }

  #loadVector(loads) {
    if (Array.isArray(loads)) return normalizeWeights(Array.from({ length: this.numExperts }, (_, index) => Number(loads[index] || 0)));
    if (isPlainObject(loads)) {
      const values = Object.values(loads).map((value) => Number(value) || 0);
      return normalizeWeights(Array.from({ length: this.numExperts }, (_, index) => values[index] || 0));
    }
    return filledVector(this.numExperts, 1 / this.numExperts);
  }

  balance(loads) {
    const raw = this.#loadVector(loads);
    const uniform = filledVector(this.numExperts, 1 / this.numExperts);
    const entropy = entropyOf(raw) / Math.log2(Math.max(this.numExperts, 2));
    const corrected = raw.map((load, index) => {
      const deficit = uniform[index] - load;
      const antiDominance = load > PHI_INV ? (load - PHI_INV) * this.justiceWeight * PHI_INV : 0;
      return Math.max(EPSILON, load + deficit * this.justiceWeight * (1 + (1 - entropy) * PHI_INV) - antiDominance);
    });
    const balanced = normalizeWeights(corrected);
    this.lastLoads = raw;
    this.lastBalanced = balanced;
    this.lastJustice = 1 - mean(balanced.map((value, index) => Math.abs(value - uniform[index]))) * PHI;
    return {
      raw,
      balanced,
      dominance: Math.max(...balanced),
      justice: this.lastJustice,
      entropy: this.entropy(),
    };
  }

  entropy() {
    return entropyOf(this.lastBalanced);
  }
}

export class MoEAnaximander {
  constructor({ dimensions = WORLD_DIMENSIONS, numExperts = DEFAULT_EXPERTS, resolution = DEFAULT_RESOLUTION, seed = 0 } = {}) {
    this.dimensions = ensurePositiveInteger('dimensions', dimensions, WORLD_DIMENSIONS);
    this.numExperts = ensurePositiveInteger('numExperts', numExperts, DEFAULT_EXPERTS);
    this.resolution = ensurePositiveInteger('resolution', resolution, DEFAULT_RESOLUTION);
    this.seed = normalizeSeed(seed);
    this.time = 0;
    this.field = new ApeironField({ dimensions: this.dimensions, resolution: this.resolution, seed: this.seed ^ 0xa5a5a5a5 });
    this.experts = Array.from({ length: this.numExperts }, (_, index) => new WorldStateExpert({
      id: stableId('anaximander', this.seed, index),
      dimensions: this.dimensions,
      opposites: rotateOpposites(DEFAULT_OPPOSITES, index),
      seed: this.seed + index * 0x9e3779b9,
    }));
    this.balancer = new CosmicBalancer({ numExperts: this.numExperts, justiceWeight: PHI_INV });
    this.history = [];
    this.lastPerception = null;
    this.lastPrediction = null;
  }

  #vectorToPosition(vector) {
    const position = zeroVector(this.dimensions);
    const normalized = normalize(ensureVector(vector, this.dimensions));
    position[0] = normalized[0] * COSMIC_CYLINDER.radius;
    position[1] = normalized[1] * COSMIC_CYLINDER.radius;
    position[2] = normalized[2] * COSMIC_CYLINDER.height * 0.5;
    for (let axis = 3; axis < this.dimensions; axis += 1) position[axis] = normalized[axis] * PHI_INV;
    return position;
  }

  #route(vector, states) {
    const position = this.#vectorToPosition(vector);
    const fieldGradient = this.field.gradient(position).magnitude;
    const rawScores = states.map((state, index) => {
      const qualityEnergy = mean(state.qualities.map((entry) => entry.magnitude));
      const polarity = Math.abs(dot(state.vector, this.experts[index].temporalAxis));
      return qualityEnergy + polarity * PHI_INV + fieldGradient * Math.pow(PHI_INV, index + 1);
    });
    const thermal = softmax(rawScores, PHI_INV);
    const balance = this.balancer.balance(thermal);
    return {
      position,
      rawScores,
      thermal,
      weights: balance.balanced,
      justice: balance.justice,
      entropy: balance.entropy,
    };
  }

  #record(event) {
    this.history.push(event);
    if (this.history.length > 96) this.history.shift();
  }

  perceive(observation) {
    const observationSignal = flattenNumericSignal(observation);
    const seedVector = encodeSignal(observationSignal, this.dimensions, this.time * PHI_INV);
    const position = this.#vectorToPosition(seedVector);
    const fieldSample = this.field.sample(position);
    const worldVector = normalize(addVectors(seedVector, scaleVector(position, fieldSample.magnitude * PHI_INV)));
    const expertEncodings = this.experts.map((expert) => expert.encode({ vector: worldVector, t: this.time, source: observation }));
    const route = this.#route(worldVector, expertEncodings);
    const fusedVector = normalize(weightedVectorAverage(expertEncodings.map((state) => state.vector), route.weights));
    const qualities = aggregateQualities(expertEncodings, route.weights);
    const perception = {
      observation,
      vector: fusedVector,
      position,
      field: fieldSample,
      gradient: this.field.gradient(position),
      emergent: this.field.emergence(position),
      route,
      expertEncodings,
      qualities,
      worldStates: this.field.getWorldStates(),
      t: this.time,
    };
    this.lastPerception = perception;
    this.#record({ type: 'perceive', t: this.time, entropy: route.entropy, emergent: perception.emergent });
    return perception;
  }

  predict(state, horizon = PHI) {
    const source = state?.vector ? state : this.perceive(state);
    const numericHorizon = ensureFiniteNumber('horizon', horizon, PHI);
    const steps = Math.max(1, Math.round(Math.abs(numericHorizon) * PHI));
    const dt = Math.abs(numericHorizon) / steps;
    const trajectory = [];
    let current = {
      vector: ensureVector(source.vector, this.dimensions),
      qualities: source.qualities || aggregateQualities(this.experts.map((expert) => expert.encode(source)), filledVector(this.numExperts, 1 / this.numExperts)),
      t: source.t ?? this.time,
    };
    for (let step = 0; step < steps; step += 1) {
      const predictions = this.experts.map((expert) => expert.predict(current, dt));
      const route = this.#route(current.vector, predictions);
      const fusedVector = normalize(weightedVectorAverage(predictions.map((prediction) => prediction.vector), route.weights));
      const position = this.#vectorToPosition(fusedVector);
      const fieldTime = this.field.time + (step + 1) * dt;
      const field = this.field.sample(position);
      field.re = this.field.sample(position).re * Math.cos(fieldTime * PHI_INV);
      field.im = this.field.sample(position).im * Math.sin(fieldTime * PHI_INV + PI / 4);
      field.magnitude = Math.hypot(field.re, field.im);
      field.phase = Math.atan2(field.im, field.re);
      field.qualityPair = [(field.re + field.re) / 2, (field.im - (-field.im)) / 2];
      const qualities = aggregateQualities(predictions, route.weights);
      current = {
        vector: normalize(addVectors(fusedVector, scaleVector(position, field.magnitude * PHI_INV * 0.1))),
        position,
        field,
        route,
        qualities,
        emergent: magnitude(route.weights) > PHI_INV && this.field.gradient(position).magnitude > PHI,
        t: current.t + dt,
      };
      trajectory.push(current);
    }
    const prediction = {
      horizon: numericHorizon,
      steps,
      dt,
      trajectory,
      finalState: current,
      entropy: this.balancer.entropy(),
      worldStates: this.field.getWorldStates(),
    };
    this.lastPrediction = prediction;
    this.#record({ type: 'predict', t: current.t, entropy: prediction.entropy, steps });
    return prediction;
  }

  simulate(steps = DEFAULT_SIMULATION_STEPS) {
    const count = ensurePositiveInteger('steps', steps, DEFAULT_SIMULATION_STEPS);
    const trajectory = [];
    let current = this.lastPerception ?? this.perceive({ time: this.time, seed: this.seed, world: 'apeiron' });
    for (let index = 0; index < count; index += 1) {
      const prediction = this.predict(current, 1);
      const next = prediction.finalState;
      this.field.evolve(PHI_INV);
      this.time += 1;
      current = {
        ...next,
        worldStates: this.field.getWorldStates(),
        t: this.time,
      };
      this.lastPerception = current;
      trajectory.push(current);
      this.#record({ type: 'simulate', t: this.time, regions: current.worldStates.length });
    }
    return {
      steps: count,
      trajectory,
      finalState: current,
      metrics: this.getMetrics(),
    };
  }

  getMetrics() {
    const worldStates = this.field.getWorldStates();
    const load = this.balancer.lastBalanced.slice();
    const dominantIndex = load.reduce((best, value, index, array) => (value > array[best] ? index : best), 0);
    return {
      dimensions: this.dimensions,
      numExperts: this.numExperts,
      resolution: this.resolution,
      time: this.time,
      cylinder: { ...COSMIC_CYLINDER },
      phi: { value: PHI, inverse: PHI_INV, squared: PHI_SQ },
      entropy: this.balancer.entropy(),
      justice: this.balancer.lastJustice,
      expertLoad: load,
      dominantExpert: this.experts[dominantIndex]?.id ?? null,
      activeRegions: worldStates.length,
      emergenceCount: this.field.totalEmergences,
      meanRegionRadius: mean(worldStates.map((region) => region.radius)),
      historyDepth: this.history.length,
    };
  }
}

export default MoEAnaximander;

/// Casa de Medina — Architectos de Architectura Inteligente
