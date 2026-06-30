///
/// @medina/moe-heraclitus — MIXTURE OF EXPERTS: HERACLITUS
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║   HERACLITUS — TEMPORAL DYNAMICS WORLD MODEL via FLUX CALCULUS              ║
/// ║                                                                              ║
/// ║  Named for Heraclitus of Ephesus — philosopher of eternal flux.             ║
/// ║                                                                              ║
/// ║  Architecture: World model where NOTHING is static. Every state is a        ║
/// ║  snapshot of continuous flow. Experts model different RATES of change       ║
/// ║  (fast flux, slow flux, harmonic oscillation, phase transitions). The       ║
/// ║  logos determines which flow pattern governs each region of reality.        ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Panta rhei: dx/dt = F(x,t) — everything is its rate of change          ║
/// ║    • Fire transform: T(x) = x·e^(φ·t) — exponential growth/decay (fire)     ║
/// ║    • River function: Ψ(x,t) = A·sin(φ·ω·t + k·x) — same river, different    ║
/// ║      water                                                                    ║
/// ║    • Unity of opposites: x and ¬x exist simultaneously: state = (x, 1−x)    ║
/// ║    • Logos constraint: ∇·F = φ⁻¹ — divergence of change bounded by          ║
/// ║      golden ratio                                                             ║
/// ║    • Enantiodromia: extremes transform into opposites: if |x|>φ then        ║
/// ║      x→−x/φ                                                                   ║
/// ║    • War/Strife dynamics: ∂²x/∂t² = −φ·∂V/∂x — change driven by conflict     ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const TAU = Math.PI * 2;
export const EPSILON = 1e-9;
export const LOGOS_DIVERGENCE = PHI_INV;
export const FLUX_MODES = Object.freeze(['fire', 'water', 'earth', 'air']);

const DEFAULT_DIMENSIONS = 8;
const DEFAULT_HISTORY = 144;
const DEFAULT_DT = PHI_INV;
const STRIFE_GAIN = PHI;
const HARMONIC_GAIN = Math.sqrt(PHI);

const clamp = (value, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const isFiniteNumber = value => Number.isFinite(value) && !Number.isNaN(value);
const sum = values => values.reduce((total, value) => total + value, 0);
const mean = values => (values.length ? sum(values) / values.length : 0);
const maxAbs = values => values.reduce((best, value) => Math.max(best, Math.abs(value)), 0);
const zeroVector = length => Array.from({ length }, () => 0);
const onesVector = length => Array.from({ length }, () => 1);
const wrapIndex = (index, length) => ((index % length) + length) % length;
const bounded = (array, limit = DEFAULT_HISTORY) => {
  if (array.length > limit) array.splice(0, array.length - limit);
  return array;
};
const pushBounded = (array, item, limit = DEFAULT_HISTORY) => {
  array.push(item);
  return bounded(array, limit);
};
const pushManyBounded = (array, items, limit = DEFAULT_HISTORY) => {
  array.push(...items);
  return bounded(array, limit);
};

function variance(values) {
  if (!values.length) return 0;
  const avg = mean(values);
  return mean(values.map(value => (value - avg) ** 2));
}

function deviation(values) {
  return Math.sqrt(variance(values));
}

function dot(a, b) {
  const length = Math.max(a.length, b.length);
  let total = 0;
  for (let index = 0; index < length; index += 1) total += (a[index] || 0) * (b[index] || 0);
  return total;
}

function magnitude(vector) {
  return Math.sqrt(dot(vector, vector));
}

function add(a, b) {
  return Array.from({ length: Math.max(a.length, b.length) }, (_, index) => (a[index] || 0) + (b[index] || 0));
}

function subtract(a, b) {
  return Array.from({ length: Math.max(a.length, b.length) }, (_, index) => (a[index] || 0) - (b[index] || 0));
}

function scale(vector, scalar) {
  return vector.map(value => value * scalar);
}

function divide(vector, scalar) {
  const safeScalar = Math.abs(scalar) <= EPSILON ? 1 : scalar;
  return vector.map(value => value / safeScalar);
}

function normalize(vector) {
  const norm = magnitude(vector);
  return norm <= EPSILON ? zeroVector(vector.length) : divide(vector, norm);
}

function softmax(values, temperature = 1) {
  if (!values.length) return [];
  const safeTemperature = Math.max(Math.abs(temperature), EPSILON);
  const scaled = values.map(value => value / safeTemperature);
  const maxValue = Math.max(...scaled);
  const exponentials = scaled.map(value => Math.exp(value - maxValue));
  const total = sum(exponentials) || 1;
  return exponentials.map(value => value / total);
}

function cosineSimilarity(a, b) {
  const denominator = magnitude(a) * magnitude(b);
  return denominator <= EPSILON ? 0 : dot(a, b) / denominator;
}

function logistic(value) {
  return 1 / (1 + Math.exp(-value));
}

function spectralEntropy(values) {
  const absolute = values.map(value => Math.abs(value));
  const total = sum(absolute) || 1;
  return -absolute.reduce((entropy, value) => {
    if (value <= EPSILON) return entropy;
    const probability = value / total;
    return entropy + probability * Math.log(probability + EPSILON);
  }, 0);
}

function secondDerivative(values) {
  if (values.length < 3) return zeroVector(values.length);
  return values.map((value, index) => {
    const previous = values[wrapIndex(index - 1, values.length)] || 0;
    const next = values[wrapIndex(index + 1, values.length)] || 0;
    return next - 2 * value + previous;
  });
}

function gradient(values) {
  if (values.length < 2) return values.map(() => 0);
  return values.map((value, index) => {
    const previous = values[wrapIndex(index - 1, values.length)] || 0;
    const next = values[wrapIndex(index + 1, values.length)] || 0;
    return (next - previous) / 2;
  });
}

function divergence(field) {
  if (!field.length) return 0;
  if (Array.isArray(field[0])) return mean(field.map(vector => mean(gradient(vector))));
  return mean(gradient(field));
}

function pairOpposites(vector) {
  return vector.map(value => ({ value, opposite: 1 - value }));
}

function oscillate(index, time, frequency = 1, phase = 0) {
  return Math.sin(PHI * frequency * time + index * PHI_INV + phase);
}

function fireTransform(value, time) {
  return value * Math.exp(clamp(PHI * time, -12, 12));
}

function enantiodromia(value) {
  return Math.abs(value) > PHI ? -value * PHI_INV : value;
}

function deriveSeed(value = 0) {
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return (Math.abs(Math.floor(numeric)) || 1) >>> 0;
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed = 1) {
  let state = deriveSeed(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) / 4294967296);
  };
}

function flattenSnapshot(input, bucket = [], depth = 0) {
  if (depth > 7 || bucket.length >= 1024) return bucket;
  if (isFiniteNumber(input)) {
    bucket.push(input);
    return bucket;
  }
  if (typeof input === 'boolean') {
    bucket.push(input ? 1 : -1);
    return bucket;
  }
  if (typeof input === 'string') {
    for (let index = 0; index < input.length && bucket.length < 1024; index += 1) {
      const code = input.charCodeAt(index) / 255;
      bucket.push(Math.sin(code * (index + 1) * PHI));
      bucket.push(Math.cos(code * (index + 1) * PHI_INV));
    }
    bucket.push(input.length * PHI_INV);
    return bucket;
  }
  if (Array.isArray(input)) {
    input.forEach(item => flattenSnapshot(item, bucket, depth + 1));
    bucket.push(input.length * PHI_INV);
    return bucket;
  }
  if (input && typeof input === 'object') {
    Object.keys(input).sort().forEach((key, index) => {
      flattenSnapshot(key, bucket, depth + 1);
      flattenSnapshot(input[key], bucket, depth + 1);
      bucket.push((index + 1) * PHI_INV);
    });
    bucket.push(Object.keys(input).length / PHI);
    return bucket;
  }
  bucket.push(0);
  return bucket;
}

function encodeSnapshot(snapshot, dimensions = DEFAULT_DIMENSIONS) {
  const scalars = flattenSnapshot(snapshot);
  const usable = scalars.length ? scalars : [0];
  const vector = zeroVector(dimensions);
  for (let dimension = 0; dimension < dimensions; dimension += 1) {
    let accumulator = 0;
    for (let index = 0; index < usable.length; index += 1) {
      const scalar = usable[index];
      const harmonic = Math.sin((dimension + 1) * (index + 1) * PHI_INV) + Math.cos((dimension + 1 + index) / PHI);
      accumulator += scalar * harmonic / (1 + index * PHI_INV);
    }
    vector[dimension] = accumulator / usable.length;
  }
  return vector.map((value, index) => {
    const neighbor = vector[wrapIndex(index + 1, vector.length)] || 0;
    return value + (neighbor - value) * PHI_INV;
  });
}

function summarizeVector(vector) {
  return {
    mean: mean(vector),
    variance: variance(vector),
    deviation: deviation(vector),
    magnitude: magnitude(vector),
    entropy: spectralEntropy(vector),
    maxAbs: maxAbs(vector),
  };
}

function transitionPotential(vector) {
  const curvature = secondDerivative(vector);
  const tension = mean(curvature.map(value => Math.abs(value)));
  const asymmetry = Math.abs(mean(vector));
  const entropy = spectralEntropy(vector);
  return tension * PHI + asymmetry * PHI_INV + entropy * PHI_INV;
}

function harmonize(vector) {
  const centered = vector.map(value => value - mean(vector));
  const curvature = secondDerivative(centered);
  return normalize(centered.map((value, index) => value - curvature[index] * PHI_INV));
}

function mergeWeights(weightGroups) {
  const merged = {};
  for (const group of weightGroups) {
    Object.entries(group).forEach(([key, value]) => {
      merged[key] = (merged[key] || 0) + value;
    });
  }
  const total = sum(Object.values(merged)) || 1;
  Object.keys(merged).forEach(key => {
    merged[key] /= total;
  });
  return merged;
}

export class FluxState {
  constructor({ dimensions = DEFAULT_DIMENSIONS, time = 0, values = null, velocity = null, createdAt = time, metadata = {} } = {}) {
    this.dimensions = Math.max(1, dimensions);
    this.time = Number.isFinite(time) ? time : 0;
    this.createdAt = Number.isFinite(createdAt) ? createdAt : this.time;
    this.values = Array.isArray(values)
      ? values.slice(0, this.dimensions).map(value => (isFiniteNumber(value) ? value : 0))
      : zeroVector(this.dimensions);
    while (this.values.length < this.dimensions) this.values.push(0);
    this.velocity = Array.isArray(velocity)
      ? velocity.slice(0, this.dimensions).map(value => (isFiniteNumber(value) ? value : 0))
      : zeroVector(this.dimensions);
    while (this.velocity.length < this.dimensions) this.velocity.push(0);
    this.metadata = { ...metadata };
  }

  derivative(previous = null) {
    if (previous instanceof FluxState) {
      const dt = this.time - previous.time;
      if (Math.abs(dt) > EPSILON) return divide(subtract(this.values, previous.values), dt);
    }
    return [...this.velocity];
  }

  magnitude() {
    return magnitude(this.values);
  }

  age(now = this.time) {
    return (Number.isFinite(now) ? now : this.time) - this.createdAt;
  }

  withFlow(flowVector, dt = DEFAULT_DT, metadata = {}) {
    const safeDt = Math.abs(dt) <= EPSILON ? DEFAULT_DT : dt;
    return new FluxState({
      dimensions: this.dimensions,
      time: this.time + safeDt,
      createdAt: this.createdAt,
      values: add(this.values, scale(flowVector, safeDt)),
      velocity: flowVector,
      metadata: { ...this.metadata, ...metadata },
    });
  }

  clone(overrides = {}) {
    return new FluxState({
      dimensions: overrides.dimensions || this.dimensions,
      time: overrides.time ?? this.time,
      createdAt: overrides.createdAt ?? this.createdAt,
      values: overrides.values || this.values,
      velocity: overrides.velocity || this.velocity,
      metadata: { ...this.metadata, ...(overrides.metadata || {}) },
    });
  }

  toJSON() {
    return {
      dimensions: this.dimensions,
      time: this.time,
      createdAt: this.createdAt,
      values: [...this.values],
      velocity: [...this.velocity],
      metadata: { ...this.metadata },
      magnitude: this.magnitude(),
      age: this.age(),
    };
  }
}

export class RiverFunction {
  constructor({ frequency = PHI_INV, wavelength = TAU, amplitude = 1, phase = 0 } = {}) {
    this.frequency = Math.abs(frequency) <= EPSILON ? PHI_INV : frequency;
    this.wavelength = Math.abs(wavelength) <= EPSILON ? TAU : wavelength;
    this.amplitude = amplitude;
    this.phase = phase;
  }

  sample(x, t = 0) {
    const waveNumber = TAU / this.wavelength;
    return this.amplitude * Math.sin(PHI * this.frequency * t + waveNumber * x + this.phase);
  }

  flow(state, dt = DEFAULT_DT) {
    const time = state?.time || 0;
    const base = state?.values || zeroVector(DEFAULT_DIMENSIONS);
    const flowVector = base.map((value, index) => {
      const river = this.sample(index + value * PHI_INV, time + dt);
      const shear = this.sample(index + 0.5, time) - this.sample(index - 0.5, time);
      return river + shear * PHI_INV;
    });
    if (state instanceof FluxState) return state.withFlow(flowVector, dt, { river: true, waveEntropy: this.entropy() });
    return flowVector;
  }

  entropy() {
    const components = [this.frequency, this.wavelength, this.amplitude, this.phase].map(value => Math.abs(value));
    return spectralEntropy(components) * PHI_INV;
  }
}

export class LogosConstraint {
  constructor({ maxDivergence = LOGOS_DIVERGENCE } = {}) {
    this.maxDivergence = Math.abs(maxDivergence) <= EPSILON ? LOGOS_DIVERGENCE : Math.abs(maxDivergence);
  }

  enforce(field) {
    if (Array.isArray(field) && Array.isArray(field[0])) {
      const current = divergence(field);
      const scaleFactor = Math.abs(current) <= this.maxDivergence || Math.abs(current) <= EPSILON
        ? 1
        : this.maxDivergence / Math.abs(current);
      return field.map(vector => harmonize(vector).map(value => enantiodromia(value * scaleFactor)));
    }

    const vector = Array.isArray(field) ? field : zeroVector(DEFAULT_DIMENSIONS);
    const current = Math.abs(divergence(vector));
    const scaleFactor = current <= this.maxDivergence || current <= EPSILON ? 1 : this.maxDivergence / current;
    return harmonize(vector).map(value => enantiodromia(value * scaleFactor));
  }

  isHarmonic(state) {
    const vector = state instanceof FluxState ? state.values : Array.isArray(state) ? state : [];
    const normalized = this.enforce(vector);
    const divergenceError = Math.abs(divergence(normalized)) - this.maxDivergence;
    const similarity = cosineSimilarity(normalize(vector), normalize(normalized));
    return divergenceError <= EPSILON && similarity >= -PHI_INV;
  }

  enantiodromia(value) {
    return enantiodromia(value);
  }
}

export class FluxExpert {
  constructor({ id, mode = 'water', dimensions = DEFAULT_DIMENSIONS, seed = 0 } = {}) {
    this.id = id || `flux-expert-${mode}`;
    this.mode = FLUX_MODES.includes(mode) ? mode : 'water';
    this.dimensions = Math.max(1, dimensions);
    this.seed = deriveSeed(seed || `${this.id}:${this.mode}`);
    this.random = createRng(this.seed);
    this.logos = new LogosConstraint({ maxDivergence: LOGOS_DIVERGENCE });
    this.river = new RiverFunction({
      frequency: PHI_INV + this.random() * PHI_INV,
      wavelength: TAU * (1 + this.random() * PHI_INV),
      amplitude: 0.5 + this.random() * PHI,
      phase: this.random() * TAU,
    });
    this.history = [];
  }

  forward(state) {
    const fluxState = state instanceof FluxState ? state : new FluxState({ dimensions: this.dimensions, values: state });
    const values = fluxState.values;
    const time = fluxState.time;
    const drift = mean(fluxState.velocity);
    const conflict = secondDerivative(values);
    const riverSignal = values.map((value, index) => this.river.sample(index + value, time));

    let rawFlow;
    switch (this.mode) {
      case 'fire':
        rawFlow = values.map((value, index) => {
          const ignition = fireTransform(value + riverSignal[index] * PHI_INV, PHI_INV * 0.1);
          const strife = -STRIFE_GAIN * (conflict[index] || 0);
          return enantiodromia((ignition - value) + strife + drift * PHI_INV);
        });
        break;
      case 'earth':
        rawFlow = values.map((value, index) => {
          const restorative = -(value - mean(values)) * PHI_INV;
          const compression = -(conflict[index] || 0) * PHI_INV;
          return restorative + compression + riverSignal[index] * PHI_INV ** 2;
        });
        break;
      case 'air':
        rawFlow = values.map((value, index) => {
          const oscillation = riverSignal[index] * HARMONIC_GAIN;
          const lift = Math.sin((time + index) * PHI_INV + value) * PHI_INV;
          return oscillation + lift - drift * PHI_INV;
        });
        break;
      case 'water':
      default:
        rawFlow = values.map((value, index) => {
          const current = riverSignal[index];
          const smoothing = ((values[wrapIndex(index + 1, values.length)] || 0) - value) * PHI_INV;
          return current + smoothing - (conflict[index] || 0) * PHI_INV ** 2;
        });
        break;
    }

    const harmonized = this.logos.enforce(rawFlow);
    const output = {
      expertId: this.id,
      mode: this.mode,
      flow: harmonized,
      magnitude: magnitude(harmonized),
      divergence: divergence(harmonized),
      entropy: spectralEntropy(harmonized),
      harmonic: this.logos.isHarmonic(harmonized),
      opposition: pairOpposites(harmonized),
    };

    pushBounded(this.history, output);
    return output;
  }

  predictFlow(state, dt = DEFAULT_DT) {
    const fluxState = state instanceof FluxState ? state : new FluxState({ dimensions: this.dimensions, values: state });
    const forward = this.forward(fluxState);
    const nextState = fluxState.withFlow(forward.flow, dt, {
      expertId: this.id,
      mode: this.mode,
      divergence: forward.divergence,
      entropy: forward.entropy,
    });
    return {
      ...forward,
      dt,
      state: nextState,
      change: this.measureChange(fluxState, nextState),
    };
  }

  measureChange(before, after) {
    const prior = before instanceof FluxState ? before : new FluxState({ dimensions: this.dimensions, values: before });
    const next = after instanceof FluxState ? after : new FluxState({ dimensions: this.dimensions, values: after });
    const delta = subtract(next.values, prior.values);
    return {
      magnitude: magnitude(delta),
      rate: magnitude(delta) / Math.max(Math.abs(next.time - prior.time), EPSILON),
      cosine: cosineSimilarity(prior.values, next.values),
      tension: transitionPotential(delta),
      divergence: divergence(delta),
      entropy: spectralEntropy(delta),
    };
  }
}

export class TemporalGating {
  constructor({ numExperts = FLUX_MODES.length, dimensions = DEFAULT_DIMENSIONS } = {}) {
    this.numExperts = Math.max(1, numExperts);
    this.dimensions = Math.max(1, dimensions);
    this.bias = FLUX_MODES.slice(0, this.numExperts).reduce((map, mode, index) => {
      map[mode] = Math.cos((index + 1) / PHI) * PHI_INV;
      return map;
    }, {});
  }

  route(state) {
    const fluxState = state instanceof FluxState ? state : new FluxState({ dimensions: this.dimensions, values: state });
    const rate = magnitude(fluxState.velocity) || deviation(fluxState.values) * PHI_INV;
    const tension = transitionPotential(fluxState.values);
    const entropy = spectralEntropy(fluxState.values);
    const curvature = mean(secondDerivative(fluxState.values).map(value => Math.abs(value)));
    const harmonicity = Math.abs(mean(gradient(fluxState.values))) <= LOGOS_DIVERGENCE ? 1 : PHI_INV;

    const scores = {
      fire: rate * PHI + tension + this.bias.fire,
      water: entropy + harmonicity * PHI + this.bias.water,
      earth: (1 / (1 + rate + curvature)) * PHI + this.bias.earth,
      air: curvature * PHI + entropy * PHI_INV + this.bias.air,
    };

    const activeModes = FLUX_MODES.slice(0, this.numExperts);
    const logits = activeModes.map(mode => scores[mode] ?? 0);
    const probabilities = softmax(logits, PHI_INV);
    const weights = Object.fromEntries(activeModes.map((mode, index) => [mode, probabilities[index] || 0]));
    const selectedMode = activeModes[probabilities.indexOf(Math.max(...probabilities))] || activeModes[0] || 'water';

    return {
      selectedMode,
      weights,
      diagnostics: {
        rate,
        tension,
        entropy,
        curvature,
        harmonicity,
      },
    };
  }
}

export class MoEHeraclitus {
  constructor({ dimensions = DEFAULT_DIMENSIONS, numExperts = FLUX_MODES.length, seed = 0 } = {}) {
    this.dimensions = Math.max(1, dimensions);
    this.numExperts = Math.max(1, numExperts);
    this.seed = deriveSeed(seed || `heraclitus:${this.dimensions}:${this.numExperts}`);
    this.random = createRng(this.seed);
    this.time = 0;
    this.history = [];
    this.predictions = [];
    this.snapshots = [];
    this.gating = new TemporalGating({ numExperts: this.numExperts, dimensions: this.dimensions });
    this.logos = new LogosConstraint({ maxDivergence: LOGOS_DIVERGENCE });
    this.river = new RiverFunction({
      frequency: PHI_INV,
      wavelength: TAU * PHI,
      amplitude: 1,
      phase: this.random() * TAU,
    });
    this.experts = Array.from({ length: this.numExperts }, (_, index) => {
      const mode = FLUX_MODES[index % FLUX_MODES.length];
      return new FluxExpert({
        id: `heraclitus-${mode}-${index + 1}`,
        mode,
        dimensions: this.dimensions,
        seed: this.seed + index + 1,
      });
    });
    this.state = new FluxState({ dimensions: this.dimensions, time: this.time, metadata: { source: 'genesis' } });
  }

  observe(snapshot) {
    const encoded = encodeSnapshot(snapshot, this.dimensions);
    const prior = this.state;
    const nextTime = this.time + PHI_INV;
    const provisional = new FluxState({ dimensions: this.dimensions, time: nextTime, values: encoded, createdAt: prior?.createdAt ?? nextTime, metadata: { source: 'observation' } });
    const derivativeVector = prior ? provisional.derivative(prior) : zeroVector(this.dimensions);
    this.state = provisional.clone({ velocity: derivativeVector, metadata: { source: 'observation', harmonic: this.logos.isHarmonic(encoded) } });
    this.time = this.state.time;
    pushBounded(this.history, this.state);
    pushBounded(this.snapshots, { raw: snapshot, encoded: [...encoded], time: this.time });
    return this.state;
  }

  flowField() {
    const routing = this.gating.route(this.state);
    const expertOutputs = this.experts.map(expert => expert.forward(this.state));
    const weightedField = expertOutputs.reduce((field, output) => {
      const weight = routing.weights[output.mode] ?? 0;
      return add(field, scale(output.flow, weight));
    }, zeroVector(this.dimensions));
    const riverField = this.river.flow(this.state, DEFAULT_DT);
    const riverVector = riverField instanceof FluxState ? riverField.values : riverField;
    const constrained = this.logos.enforce(add(weightedField, scale(riverVector, PHI_INV)));

    return {
      time: this.time,
      routing,
      experts: expertOutputs,
      river: riverVector,
      field: constrained,
      divergence: divergence(constrained),
      entropy: spectralEntropy(constrained),
      harmonic: this.logos.isHarmonic(constrained),
    };
  }

  predictNext(horizon = 1) {
    const steps = Math.max(1, Math.floor(horizon));
    const trajectory = [];
    let current = this.state;

    for (let stepIndex = 0; stepIndex < steps; stepIndex += 1) {
      const routing = this.gating.route(current);
      const expertPredictions = this.experts.map(expert => expert.predictFlow(current, DEFAULT_DT));
      const routed = expertPredictions.reduce((field, prediction) => {
        const weight = routing.weights[prediction.mode] ?? 0;
        return add(field, scale(prediction.flow, weight));
      }, zeroVector(this.dimensions));
      const riverState = this.river.flow(current, DEFAULT_DT);
      const riverVector = riverState instanceof FluxState ? riverState.values : riverState;
      const combined = this.logos.enforce(add(routed, scale(riverVector, PHI_INV)));
      const predictedState = current.withFlow(combined, DEFAULT_DT, {
        source: 'prediction',
        selectedMode: routing.selectedMode,
      });
      const strife = secondDerivative(predictedState.values).map(value => -PHI * value);
      const reconciled = predictedState.clone({
        values: this.logos.enforce(add(predictedState.values, scale(strife, PHI_INV ** 2))),
        velocity: combined,
        metadata: {
          ...predictedState.metadata,
          routing,
          fieldEntropy: spectralEntropy(combined),
          transitionPotential: transitionPotential(predictedState.values),
        },
      });

      trajectory.push({
        step: stepIndex + 1,
        state: reconciled,
        routing,
        field: combined,
        experts: expertPredictions,
        strife,
      });
      current = reconciled;
    }

    pushManyBounded(this.predictions, trajectory);
    return steps === 1 ? trajectory[0] : trajectory;
  }

  step(dt = DEFAULT_DT) {
    const horizon = Math.max(1, Math.round(Math.abs(dt) / DEFAULT_DT));
    const prediction = this.predictNext(horizon);
    const last = Array.isArray(prediction) ? prediction[prediction.length - 1] : prediction;
    this.state = last.state;
    this.time = this.state.time;
    pushBounded(this.history, this.state);
    return this.state;
  }

  metrics() {
    const historyStates = this.history.slice(-Math.min(this.history.length, 32));
    const magnitudes = historyStates.map(state => state.magnitude());
    const rates = historyStates.map(state => magnitude(state.velocity));
    const harmonicCount = historyStates.filter(state => this.logos.isHarmonic(state)).length;
    const recentField = this.flowField();
    const phaseBalance = pairOpposites(this.state.values).map(pair => Math.abs(pair.value - pair.opposite));
    const modalWeights = mergeWeights([
      ...this.predictions.slice(-Math.min(this.predictions.length, 12)).map(prediction => prediction.routing?.weights || {}),
      recentField.routing.weights,
    ]);

    return {
      dimensions: this.dimensions,
      numExperts: this.numExperts,
      time: this.time,
      currentState: this.state.toJSON(),
      currentSummary: summarizeVector(this.state.values),
      velocitySummary: summarizeVector(this.state.velocity),
      riverEntropy: this.river.entropy(),
      fieldEntropy: recentField.entropy,
      divergence: recentField.divergence,
      harmonicRatio: historyStates.length ? harmonicCount / historyStates.length : 1,
      averageMagnitude: mean(magnitudes),
      averageRate: mean(rates),
      transitionPotential: transitionPotential(this.state.values),
      unityOfOpposites: {
        meanOpposition: mean(phaseBalance),
        pairs: pairOpposites(this.state.values),
      },
      routing: recentField.routing,
      modalWeights,
      logosSatisfied: this.logos.isHarmonic(this.state),
      historyDepth: this.history.length,
      predictionDepth: this.predictions.length,
    };
  }
}

export default MoEHeraclitus;

export function createHeraclitusWorld(options = {}) {
  return new MoEHeraclitus(options);
}

export function riverSignature(state, river = new RiverFunction()) {
  const fluxState = state instanceof FluxState ? state : new FluxState({ values: encodeSnapshot(state, DEFAULT_DIMENSIONS) });
  const samples = fluxState.values.map((value, index) => river.sample(index + value * PHI_INV, fluxState.time));
  return {
    samples,
    entropy: spectralEntropy(samples),
    magnitude: magnitude(samples),
    divergence: divergence(samples),
  };
}

export function fluxBalance(state) {
  const fluxState = state instanceof FluxState ? state : new FluxState({ values: encodeSnapshot(state, DEFAULT_DIMENSIONS) });
  const pairs = pairOpposites(fluxState.values);
  const asymmetry = pairs.map(pair => Math.abs(pair.value - pair.opposite));
  return {
    pairs,
    meanAsymmetry: mean(asymmetry),
    maximumAsymmetry: maxAbs(asymmetry),
  };
}

export function phaseTransitionScore(before, after) {
  const previous = before instanceof FluxState ? before : new FluxState({ values: encodeSnapshot(before, DEFAULT_DIMENSIONS) });
  const next = after instanceof FluxState ? after : new FluxState({ values: encodeSnapshot(after, DEFAULT_DIMENSIONS), time: previous.time + DEFAULT_DT });
  const delta = subtract(next.values, previous.values);
  const acceleration = subtract(next.velocity, previous.velocity);
  const score = transitionPotential(delta) * PHI + magnitude(acceleration) * PHI_INV + Math.abs(divergence(delta));
  return {
    score,
    delta,
    acceleration,
    entropy: spectralEntropy(delta),
    rate: magnitude(delta) / Math.max(next.time - previous.time, EPSILON),
  };
}

export function logosField(vectors, maxDivergence = LOGOS_DIVERGENCE) {
  const constraint = new LogosConstraint({ maxDivergence });
  return constraint.enforce(vectors);
}

export function fluxModes() {
  return [...FLUX_MODES];
}

export function describeHeraclitusModel() {
  return {
    philosopher: 'Heraclitus of Ephesus',
    doctrine: 'panta rhei',
    elements: fluxModes(),
    constants: { PHI, PHI_INV, TAU, EPSILON, LOGOS_DIVERGENCE },
    principles: [
      'Everything flows',
      'Same river, different water',
      'Fire as fundamental transform',
      'Logos governs change',
      'Unity of opposites',
      'Conflict drives becoming',
    ],
  };
}

export const HERACLITUS_ATTRIBUTION = 'Casa de Medina — Architectos de Architectura Inteligente';
