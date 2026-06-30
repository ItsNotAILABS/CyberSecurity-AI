///
/// @medina/moe-empedocles — MIXTURE OF EXPERTS: EMPEDOCLES
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║   EMPEDOCLES — ELEMENTAL INTERACTION WORLD MODEL via FOUR FORCES            ║
/// ║                                                                              ║
/// ║  Named for Empedocles of Acragas — philosopher of four roots and cosmic     ║
/// ║  forces.                                                                     ║
/// ║                                                                              ║
/// ║  Architecture: World model with 4 elemental expert-domains                  ║
/// ║  (earth/water/air/fire). Two meta-forces (Love/Strife) control mixing.     ║
/// ║  World state = proportion of elements + Love/Strife balance. Cosmic cycle   ║
/// ║  oscillates between Sphere (all mixed) and Separation (all apart).          ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Four roots: state = [earth, water, air, fire] where Σ = 1             ║
/// ║    • Love force: F_love = φ·Σᵢⱼ (eᵢ·eⱼ)/|rᵢ−rⱼ|² — attractive mixing       ║
/// ║    • Strife force: −φ⁻¹·Σᵢⱼ (eᵢ·eⱼ)/|rᵢ−rⱼ| — repulsive separation         ║
/// ║    • Cosmic cycle: Love(t)=cos²(φ·ω·t), Strife(t)=sin²(φ·ω·t)              ║
/// ║    • Sphere condition: Love=1 → [¼, ¼, ¼, ¼]                                ║
/// ║    • Separation condition: Strife=1 → one element dominates                 ║
/// ║    • Element interaction matrix: M_ij = φ^(−|i−j|)                         ║
/// ║    • Vortex separation: ω = √(Strife·φ/r) — centrifugal element sorting     ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI ** 2;
export const TAU = Math.PI * 2;
export const EPSILON = 1e-9;

export const ELEMENTS = Object.freeze(['earth', 'water', 'air', 'fire']);

export const ELEMENT_PROPERTIES = Object.freeze({
  earth: Object.freeze({ density: 0.95, temperature: 0.20, mobility: 0.15 }),
  water: Object.freeze({ density: 0.70, temperature: 0.35, mobility: 0.65 }),
  air: Object.freeze({ density: 0.25, temperature: 0.55, mobility: 0.95 }),
  fire: Object.freeze({ density: 0.15, temperature: 0.98, mobility: 0.88 }),
});

const ELEMENT_VECTORS = Object.freeze({
  earth: Object.freeze([0, -1]),
  water: Object.freeze([1, 0]),
  air: Object.freeze([0, 1]),
  fire: Object.freeze([-1, 0]),
});

const DEFAULT_DIMENSIONS = 8;
const DEFAULT_FREQUENCY = PHI_INV;
const HISTORY_LIMIT = 256;
const SPHERE_VECTOR = Object.freeze([0.25, 0.25, 0.25, 0.25]);

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const lerp = (a, b, t) => a + (b - a) * t;
const sum = (values) => values.reduce((total, value) => total + value, 0);
const mean = (values) => (values.length ? sum(values) / values.length : 0);
const round = (value, digits = 12) => Math.round(value * 10 ** digits) / 10 ** digits;
const square = (value) => value * value;
const magnitude = (vector) => Math.sqrt(sum(vector.map((value) => value * value)));
const distance = (a, b) => Math.sqrt(sum(a.map((value, index) => square(value - (b[index] || 0)))));
const dot = (a, b) => sum(a.map((value, index) => value * (b[index] || 0)));
const normalizeVector = (vector) => {
  const length = magnitude(vector);
  return length <= EPSILON ? vector.map(() => 0) : vector.map((value) => value / length);
};
const addVectors = (a, b) => a.map((value, index) => value + (b[index] || 0));
const scaleVector = (vector, scalar) => vector.map((value) => value * scalar);
const vectorMean = (vectors) => {
  if (!vectors.length) return [0, 0];
  return scaleVector(vectors.reduce((acc, vector) => addVectors(acc, vector), [0, 0]), 1 / vectors.length);
};
const sigmoid = (value) => 1 / (1 + Math.exp(-value));
const softmax = (values) => {
  if (!values.length) return [];
  const maxValue = Math.max(...values);
  const exps = values.map((value) => Math.exp(value - maxValue));
  const total = sum(exps) || 1;
  return exps.map((value) => value / total);
};
const boundedPush = (list, entry, limit = HISTORY_LIMIT) => {
  list.push(entry);
  if (list.length > limit) list.splice(0, list.length - limit);
};

function normalizeProportions(input) {
  const vector = Array.isArray(input)
    ? input.slice(0, ELEMENTS.length)
    : ELEMENTS.map((element) => Number(input?.[element] ?? 0));

  while (vector.length < ELEMENTS.length) vector.push(0);

  const positive = vector.map((value) => (Number.isFinite(value) ? Math.max(0, value) : 0));
  const total = sum(positive);
  if (total <= EPSILON) return [...SPHERE_VECTOR];
  return positive.map((value) => value / total);
}

function proportionsToObject(proportions) {
  return Object.fromEntries(ELEMENTS.map((element, index) => [element, proportions[index]]));
}

function stableHash(value) {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function seededSeries(seed, count, bias = 0) {
  let state = Math.floor((stableHash(seed) + bias) * 2147483647) || 1;
  const values = [];
  for (let index = 0; index < count; index += 1) {
    state = (state * 48271) % 2147483647;
    values.push(state / 2147483647);
  }
  return values;
}

function cosineSimilarity(a, b) {
  const denom = magnitude(a) * magnitude(b);
  return denom <= EPSILON ? 0 : dot(a, b) / denom;
}

function arrayEntropy(values) {
  return -values.reduce((entropy, value) => {
    if (value <= EPSILON) return entropy;
    return entropy + value * Math.log(value + EPSILON);
  }, 0);
}

function flattenObservation(value, output = []) {
  if (value == null) return output;
  if (typeof value === 'number') {
    output.push(Number.isFinite(value) ? value : 0);
    return output;
  }
  if (typeof value === 'boolean') {
    output.push(value ? 1 : 0);
    return output;
  }
  if (typeof value === 'string') {
    for (let index = 0; index < value.length; index += 1) {
      output.push((value.charCodeAt(index) % 127) / 126);
    }
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => flattenObservation(entry, output));
    return output;
  }
  if (typeof value === 'object') {
    Object.keys(value).sort().forEach((key) => {
      flattenObservation(key, output);
      flattenObservation(value[key], output);
    });
    return output;
  }
  return output;
}

function observationToProportions(world) {
  if (world instanceof ElementalState) return [...world.proportions];

  const direct = ELEMENTS.map((element) => Number(world?.[element] ?? world?.proportions?.[element] ?? NaN));
  if (direct.some((value) => Number.isFinite(value))) {
    return normalizeProportions(direct.map((value) => (Number.isFinite(value) ? value : 0)));
  }

  const tokens = flattenObservation(world);
  if (!tokens.length) return [...SPHERE_VECTOR];

  const tokenEnergy = tokens.map((value, index) => Math.abs(value) * (1 + Math.cos((index + 1) / PHI)));
  const spectrum = ELEMENTS.map((element, index) => {
    const property = ELEMENT_PROPERTIES[element];
    const harmonic = tokenEnergy.reduce((total, energy, tokenIndex) => {
      const resonance = Math.abs(Math.sin((tokenIndex + 1) * (index + 1) / PHI));
      return total + energy * resonance;
    }, 0);
    return harmonic * (property.density + property.mobility + property.temperature) / 3;
  });

  return normalizeProportions(spectrum);
}

function interactionMatrix() {
  return ELEMENTS.map((_, row) => ELEMENTS.map((__, column) => PHI ** (-Math.abs(row - column))));
}

const INTERACTION_MATRIX = interactionMatrix();

function elementPositions(center = [0, 0]) {
  return ELEMENTS.map((element) => addVectors(ELEMENT_VECTORS[element], center));
}

function pairwiseForceSums(state) {
  const positions = state.positions;
  let love = 0;
  let strife = 0;

  for (let i = 0; i < ELEMENTS.length; i += 1) {
    for (let j = i + 1; j < ELEMENTS.length; j += 1) {
      const distanceValue = Math.max(distance(positions[i], positions[j]), EPSILON);
      const energy = state.proportions[i] * state.proportions[j] * INTERACTION_MATRIX[i][j];
      love += energy / square(distanceValue);
      strife += energy / distanceValue;
    }
  }

  return {
    love: PHI * love,
    strife: -PHI_INV * strife,
  };
}

function dominantIndex(values) {
  let index = 0;
  for (let cursor = 1; cursor < values.length; cursor += 1) {
    if (values[cursor] > values[index]) index = cursor;
  }
  return index;
}

function separationVector(proportions) {
  const dominant = dominantIndex(proportions);
  return proportions.map((value, index) => {
    if (index === dominant) return value + (1 - value) / PHI;
    return value * PHI_INV * PHI_INV;
  });
}

function meanRadius(positions, center = [0, 0]) {
  return mean(positions.map((position) => distance(position, center)));
}

function phaseDescriptor(balance) {
  if (balance >= 0.8) return 'sphere';
  if (balance <= -0.8) return 'separation';
  if (balance >= 0.25) return 'mixing';
  if (balance <= -0.25) return 'sorting';
  return 'transition';
}

export class ElementalState {
  constructor({ proportions = SPHERE_VECTOR, position = [0, 0] } = {}) {
    this.proportions = normalizeProportions(proportions);
    this.position = Array.isArray(position) ? position.slice(0, 2) : [Number(position?.x || 0), Number(position?.y || 0)];
    while (this.position.length < 2) this.position.push(0);
    this.positions = elementPositions(this.position);
    this.vector = proportionsToObject(this.proportions);
  }

  dominant() {
    const index = dominantIndex(this.proportions);
    return { index, element: ELEMENTS[index], proportion: this.proportions[index] };
  }

  entropy() {
    const raw = arrayEntropy(this.proportions);
    const maxEntropy = Math.log(ELEMENTS.length);
    return {
      raw,
      normalized: maxEntropy <= EPSILON ? 0 : raw / maxEntropy,
    };
  }

  isSpherical(tolerance = 0.05) {
    const uniformity = this.proportions.every((value, index) => Math.abs(value - SPHERE_VECTOR[index]) <= tolerance);
    return uniformity && this.entropy().normalized >= 1 - tolerance;
  }

  asArray() {
    return [...this.proportions];
  }

  toJSON() {
    return {
      proportions: proportionsToObject(this.proportions),
      dominant: this.dominant(),
      entropy: this.entropy(),
      spherical: this.isSpherical(),
      position: [...this.position],
    };
  }
}

export class CosmicForce {
  constructor({ type = 'love', magnitude = 1 } = {}) {
    this.type = String(type).toLowerCase() === 'strife' ? 'strife' : 'love';
    this.magnitude = Math.max(0, Number(magnitude) || 0);
  }

  cycle(time = 0) {
    const angle = PHI * this.magnitude * time;
    return this.type === 'love' ? square(Math.cos(angle)) : square(Math.sin(angle));
  }

  balance() {
    return this.type === 'love' ? this.magnitude : -this.magnitude;
  }

  apply(state) {
    const source = state instanceof ElementalState ? state : new ElementalState(state);
    const strength = clamp(this.magnitude, 0, PHI);
    const { love, strife } = pairwiseForceSums(source);

    let target = source.proportions;
    if (this.type === 'love') {
      target = source.proportions.map((value, index) => lerp(value, SPHERE_VECTOR[index], clamp(strength / PHI, 0, 1)));
    } else {
      const separated = separationVector(source.proportions);
      target = source.proportions.map((value, index) => lerp(value, separated[index], clamp(strength / PHI, 0, 1)));
    }

    const centerBias = this.type === 'love' ? scaleVector(source.position, 1 - clamp(strength / PHI, 0, 1)) : scaleVector(source.position, 1 + strength * 0.05);
    const shifted = new ElementalState({ proportions: target, position: centerBias });
    shifted.force = {
      type: this.type,
      magnitude: this.magnitude,
      pairwiseLove: love,
      pairwiseStrife: strife,
      balance: this.balance(),
    };
    return shifted;
  }
}

export class ElementExpert {
  constructor({ id, element, dimensions = DEFAULT_DIMENSIONS, seed = `${element}:0` } = {}) {
    if (!ELEMENTS.includes(element)) throw new Error(`Unknown element expert: ${element}`);
    this.id = id || `${element}-expert`;
    this.element = element;
    this.dimensions = Math.max(1, Number(dimensions) || DEFAULT_DIMENSIONS);
    this.seed = `${seed}:${element}`;
    this.index = ELEMENTS.indexOf(element);
    this.weights = seededSeries(this.seed, this.dimensions + ELEMENTS.length + 6, this.index);
    this.bias = this.weights[this.weights.length - 1] - 0.5;
  }

  interact(otherElement) {
    if (!ELEMENTS.includes(otherElement)) throw new Error(`Unknown interaction element: ${otherElement}`);
    const otherIndex = ELEMENTS.indexOf(otherElement);
    const affinity = INTERACTION_MATRIX[this.index][otherIndex];
    const properties = ELEMENT_PROPERTIES[this.element];
    const otherProperties = ELEMENT_PROPERTIES[otherElement];
    const thermalDelta = properties.temperature - otherProperties.temperature;
    const mobilityRatio = (properties.mobility + EPSILON) / (otherProperties.mobility + EPSILON);
    return {
      affinity,
      thermalDelta,
      mobilityRatio,
      attraction: affinity * PHI,
      repulsion: (1 - affinity) * PHI_INV,
    };
  }

  forward(state) {
    const source = state instanceof ElementalState ? state : new ElementalState(state);
    const proportions = source.proportions;
    const properties = ELEMENT_PROPERTIES[this.element];
    const dominant = source.dominant();
    const entropy = source.entropy().normalized;
    const featureSeed = [
      proportions[this.index],
      properties.density,
      properties.temperature,
      properties.mobility,
      entropy,
      dominant.index === this.index ? 1 : 0,
      cosineSimilarity(source.position, ELEMENT_VECTORS[this.element]),
      meanRadius(source.positions, source.position),
      ...proportions,
    ];

    const features = Array.from({ length: this.dimensions }, (_, index) => {
      const base = featureSeed[index % featureSeed.length] || 0;
      const harmonic = Math.sin((index + 1) * PHI * (this.weights[index] + 0.5));
      const resonance = Math.cos((index + 1) / PHI + properties.temperature * TAU);
      return Math.tanh(base + harmonic * PHI_INV + resonance * properties.mobility + this.bias);
    });

    const activation = mean(features.map((value) => Math.abs(value))) * (0.5 + proportions[this.index]);
    return {
      expertId: this.id,
      element: this.element,
      activation,
      features,
      signature: {
        density: properties.density,
        temperature: properties.temperature,
        mobility: properties.mobility,
      },
    };
  }

  transform(state, force) {
    const source = state instanceof ElementalState ? state : new ElementalState(state);
    const cosmicForce = force instanceof CosmicForce ? force : new CosmicForce(force);
    const forwardPass = this.forward(source);
    const proportions = [...source.proportions];
    const focus = this.index;
    const localBoost = forwardPass.activation * 0.06 * cosmicForce.magnitude;
    const balance = cosmicForce.type === 'love' ? -1 : 1;

    proportions[focus] += localBoost * balance;

    for (let index = 0; index < proportions.length; index += 1) {
      if (index === focus) continue;
      const affinity = INTERACTION_MATRIX[focus][index];
      const delta = localBoost * (cosmicForce.type === 'love' ? affinity : -affinity * PHI_INV);
      proportions[index] += delta / (proportions.length - 1);
    }

    const transformed = new ElementalState({ proportions, position: source.position });
    transformed.expert = {
      id: this.id,
      element: this.element,
      activation: forwardPass.activation,
      forceType: cosmicForce.type,
    };
    return transformed;
  }
}

export class LoveStrifeGating {
  constructor({ numExperts = ELEMENTS.length } = {}) {
    this.numExperts = Math.max(1, Number(numExperts) || ELEMENTS.length);
    this.lastRoute = null;
  }

  phaseBalance() {
    if (!this.lastRoute) return { love: 0.5, strife: 0.5, balance: 0 };
    return this.lastRoute.phase;
  }

  route(observation, cosmicPhase = { love: 0.5, strife: 0.5, balance: 0 }) {
    const proportions = observation instanceof ElementalState ? observation.proportions : observationToProportions(observation);
    const scores = ELEMENTS.map((element, index) => {
      const props = ELEMENT_PROPERTIES[element];
      const base = proportions[index] * PHI_SQ;
      const densityBias = props.density * cosmicPhase.strife;
      const mobilityBias = props.mobility * cosmicPhase.love;
      const thermalBias = props.temperature * (0.5 + cosmicPhase.balance / 2);
      return base + densityBias + mobilityBias + thermalBias + INTERACTION_MATRIX[index][index] * PHI_INV;
    });

    const probabilities = softmax(scores);
    const experts = ELEMENTS.slice(0, this.numExperts).map((element, index) => ({
      id: `${element}-expert`,
      element,
      weight: probabilities[index] || 0,
      score: scores[index] || 0,
    })).sort((left, right) => right.weight - left.weight);

    this.lastRoute = {
      experts,
      phase: {
        love: cosmicPhase.love,
        strife: cosmicPhase.strife,
        balance: cosmicPhase.balance,
      },
    };

    return this.lastRoute;
  }
}

export class CosmicCycle {
  constructor({ frequency = DEFAULT_FREQUENCY, phase = 0 } = {}) {
    this.frequency = Math.max(EPSILON, Number(frequency) || DEFAULT_FREQUENCY);
    this.phase = Number(phase) || 0;
  }

  loveStrength(t = 0) {
    return square(Math.cos(PHI * this.frequency * t + this.phase));
  }

  strifeStrength(t = 0) {
    return square(Math.sin(PHI * this.frequency * t + this.phase));
  }

  currentPhase(t = 0) {
    const love = this.loveStrength(t);
    const strife = this.strifeStrength(t);
    const balance = love - strife;
    const radius = 1 + Math.abs(balance) / PHI;
    const vortex = Math.sqrt(Math.max(EPSILON, strife * PHI / radius));
    return {
      time: t,
      love,
      strife,
      balance,
      descriptor: phaseDescriptor(balance),
      sphere: love >= 1 - 1e-6,
      separation: strife >= 1 - 1e-6,
      vortex,
    };
  }
}

export class MoEEmpedocles {
  constructor({ dimensions = DEFAULT_DIMENSIONS, seed = 'empedocles' } = {}) {
    this.dimensions = Math.max(1, Number(dimensions) || DEFAULT_DIMENSIONS);
    this.seed = seed;
    this.time = 0;
    this.cycle = new CosmicCycle({ frequency: DEFAULT_FREQUENCY, phase: stableHash(seed) * PHI_INV });
    this.gating = new LoveStrifeGating({ numExperts: ELEMENTS.length });
    this.experts = ELEMENTS.map((element, index) => new ElementExpert({
      id: `expert:${element}`,
      element,
      dimensions: this.dimensions,
      seed: `${seed}:${index}`,
    }));
    this.state = new ElementalState({ proportions: SPHERE_VECTOR, position: [0, 0] });
    this.history = [];
    this.lastObservation = null;
    this.lastPrediction = [];
  }

  cosmicPhase() {
    return this.cycle.currentPhase(this.time);
  }

  worldState() {
    const phase = this.cosmicPhase();
    const pairwise = pairwiseForceSums(this.state);
    const radius = meanRadius(this.state.positions, this.state.position);
    return {
      time: this.time,
      proportions: proportionsToObject(this.state.proportions),
      dominant: this.state.dominant(),
      entropy: this.state.entropy(),
      spherical: this.state.isSpherical(),
      phase,
      pairwise,
      interactionMatrix: INTERACTION_MATRIX.map((row) => [...row]),
      radius,
      vortex: Math.sqrt(Math.max(EPSILON, phase.strife * PHI / Math.max(radius, EPSILON))),
    };
  }

  observe(world) {
    const proportions = observationToProportions(world);
    const position = Array.isArray(world?.position)
      ? world.position.slice(0, 2)
      : [Number(world?.x || 0), Number(world?.y || 0)];

    const observed = new ElementalState({ proportions, position });
    const phase = this.cosmicPhase();
    const route = this.gating.route(observed, phase);
    const expertViews = route.experts.map((entry) => {
      const expert = this.experts.find((candidate) => candidate.element === entry.element);
      return {
        ...entry,
        forward: expert.forward(observed),
      };
    });

    this.state = observed;
    this.lastObservation = {
      state: observed,
      route,
      expertViews,
      phase,
    };

    boundedPush(this.history, {
      type: 'observe',
      time: this.time,
      state: observed.toJSON(),
      phase,
    });

    return this.lastObservation;
  }

  step(dt = 1) {
    const delta = Math.max(EPSILON, Number(dt) || 1);
    this.time += delta;
    const phase = this.cosmicPhase();
    const loveForce = new CosmicForce({ type: 'love', magnitude: phase.love });
    const strifeForce = new CosmicForce({ type: 'strife', magnitude: phase.strife });

    let nextState = loveForce.apply(this.state);
    nextState = strifeForce.apply(nextState);

    const route = this.gating.route(nextState, phase);
    route.experts.forEach((entry) => {
      const expert = this.experts.find((candidate) => candidate.element === entry.element);
      const expertForce = new CosmicForce({
        type: phase.balance >= 0 ? 'love' : 'strife',
        magnitude: clamp(entry.weight * (1 + Math.abs(phase.balance)), 0, PHI),
      });
      nextState = expert.transform(nextState, expertForce);
    });

    this.state = new ElementalState({ proportions: nextState.proportions, position: nextState.position });
    const snapshot = this.worldState();
    snapshot.route = route;

    boundedPush(this.history, {
      type: 'step',
      time: this.time,
      snapshot,
    });

    return snapshot;
  }

  predict(horizon = 1) {
    const steps = Math.max(1, Math.floor(Number(horizon) || 1));
    const originalState = new ElementalState({ proportions: this.state.proportions, position: this.state.position });
    const originalTime = this.time;
    const originalHistory = this.history.slice();
    const originalObservation = this.lastObservation;
    const originalRoute = this.gating.lastRoute;
    const predictions = [];

    for (let index = 0; index < steps; index += 1) {
      predictions.push(this.step(1));
    }

    this.lastPrediction = predictions.map((entry) => ({
      time: entry.time,
      dominant: entry.dominant,
      phase: entry.phase,
      proportions: entry.proportions,
    }));

    this.state = originalState;
    this.time = originalTime;
    this.history = originalHistory;
    this.lastObservation = originalObservation;
    this.gating.lastRoute = originalRoute;
    return this.lastPrediction;
  }

  metrics() {
    const phase = this.cosmicPhase();
    const pairwise = pairwiseForceSums(this.state);
    const entropy = this.state.entropy();
    const route = this.gating.lastRoute || this.gating.route(this.state, phase);
    const expertActivations = Object.fromEntries(this.experts.map((expert) => {
      const forward = expert.forward(this.state);
      return [expert.element, round(forward.activation)];
    }));
    const dominantWeight = route.experts[0]?.weight || 0;
    const routingEntropy = arrayEntropy(route.experts.map((entry) => entry.weight || 0));

    return {
      time: this.time,
      balance: phase.balance,
      love: phase.love,
      strife: phase.strife,
      sphereDistance: mean(this.state.proportions.map((value, index) => Math.abs(value - SPHERE_VECTOR[index]))),
      separationIndex: this.state.dominant().proportion,
      entropy,
      pairwise,
      routingEntropy,
      dominantRoutingWeight: dominantWeight,
      expertActivations,
      historySize: this.history.length,
      lastDescriptor: phase.descriptor,
    };
  }
}

export default MoEEmpedocles;

/// Casa de Medina — Architectos de Architectura Inteligente
