///
/// @medina/moe-ptolemy — MIXTURE OF EXPERTS: PTOLEMY
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║      PTOLEMY — CELESTIAL EXPERT MAPPING via EPICYCLIC COMPOSITION           ║
/// ║                                                                              ║
/// ║  Named for Claudius Ptolemy — cartographer of the celestial spheres.        ║
/// ║                                                                              ║
/// ║  Architecture: MoE where experts orbit in epicycles. Main experts on        ║
/// ║  deferent (large circle), specialist sub-experts on epicycles. The          ║
/// ║  current "celestial position" of the input determines which experts         ║
/// ║  are overhead and active. Ptolemy's theorem gives cyclic blending.          ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Ptolemy's theorem: AC·BD = AB·CD + AD·BC (cyclic quadrilateral)        ║
/// ║      — relates distances between 4 experts on activation circle             ║
/// ║    • Epicycle: position(t) = R·e^(iωt) + r·e^(iω't) — composite orbits    ║
/// ║    • Deferent radius: R = φ·r (golden ratio between orbit levels)           ║
/// ║    • Equant: non-uniform expert speed, faster near input "perigee"          ║
/// ║    • Celestial sphere layers: n spheres, each with φⁿ radius               ║
/// ║    • Harmonic intervals: expert spacing at Pythagorean musical ratios       ║
/// ║    • Almagest blending: weighted by angular proximity on deferent           ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const INV_PHI = 1 / PHI;
export const TAU = Math.PI * 2;
export const HALF_PI = Math.PI / 2;
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
export const EPSILON = 1e-9;
export const DEFAULT_BASE_RADIUS = 1;
export const DEFAULT_SPHERES = 4;
export const DEFAULT_BLEND_LIMIT = 4;
export const DEFAULT_ACTIVATION_WINDOW = Math.PI / 5;
export const PYTHAGOREAN_INTERVALS = Object.freeze([1, 256 / 243, 9 / 8, 32 / 27, 81 / 64, 4 / 3, 3 / 2, 27 / 16, 16 / 9, 243 / 128, 2]);

const isFiniteNumber = value => Number.isFinite(value) && !Number.isNaN(value);
const isPlainObject = value => Object.prototype.toString.call(value) === '[object Object]';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const sum = values => values.reduce((total, value) => total + value, 0);
const mean = values => (values.length ? sum(values) / values.length : 0);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const normalizeAngle = angle => {
  if (!isFiniteNumber(angle)) return 0;
  let normalized = angle % TAU;
  if (normalized < 0) normalized += TAU;
  return normalized;
};
const angularDistance = (a, b) => {
  const delta = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return Math.min(delta, TAU - delta);
};
const cartesian = (radius, angle, origin = { x: 0, y: 0 }) => ({ x: origin.x + radius * Math.cos(angle), y: origin.y + radius * Math.sin(angle) });
const radial = point => Math.hypot(point?.x ?? 0, point?.y ?? 0);
const distance = (a, b) => Math.hypot((a?.x ?? 0) - (b?.x ?? 0), (a?.y ?? 0) - (b?.y ?? 0));

function toNumericSignal(input, depth = 0) {
  if (depth > 5 || input == null) return [];
  if (typeof input === 'number') return [input];
  if (typeof input === 'boolean') return [input ? 1 : -1];
  if (typeof input === 'string') return Array.from(input).map((char, index) => ((char.codePointAt(0) ?? 0) / 255) * (index % 2 === 0 ? 1 : -1));
  if (Array.isArray(input)) return input.flatMap(value => toNumericSignal(value, depth + 1));
  if (ArrayBuffer.isView(input)) return Array.from(input, value => Number(value));
  if (isPlainObject(input)) {
    return Object.keys(input).sort().flatMap(key => [...Array.from(key).map(char => (char.codePointAt(0) ?? 0) / 511), ...toNumericSignal(input[key], depth + 1)]);
  }
  return [String(input).length / 10];
}

function normalizeWeights(weights) {
  const safeWeights = weights.map(weight => (isFiniteNumber(weight) && weight > 0 ? weight : 0));
  const total = sum(safeWeights);
  return total <= EPSILON ? (safeWeights.length ? safeWeights.map(() => 1 / safeWeights.length) : []) : safeWeights.map(weight => weight / total);
}

function pickDominant(values, weights) {
  let bestIndex = 0;
  let bestWeight = -Infinity;
  weights.forEach((weight, index) => { if (weight > bestWeight) { bestWeight = weight; bestIndex = index; } });
  return values[bestIndex];
}

function blendStructured(values, weights) {
  const pairs = values.map((value, index) => ({ value, weight: weights[index] ?? 0 })).filter(pair => pair.value !== undefined);
  if (!pairs.length) return undefined;
  const localValues = pairs.map(pair => pair.value);
  const localWeights = normalizeWeights(pairs.map(pair => pair.weight));
  if (localValues.every(value => typeof value === 'number' && isFiniteNumber(value))) {
    return localValues.reduce((total, value, index) => total + value * localWeights[index], 0);
  }
  if (localValues.every(value => Array.isArray(value))) {
    const length = Math.max(...localValues.map(value => value.length));
    return Array.from({ length }, (_, index) => blendStructured(localValues.map(value => value[index]), localWeights));
  }
  if (localValues.every(value => isPlainObject(value))) {
    const keys = [...new Set(localValues.flatMap(value => Object.keys(value)))].sort();
    return keys.reduce((result, key) => ({ ...result, [key]: blendStructured(localValues.map(value => value[key]), localWeights) }), {});
  }
  return pickDominant(localValues, localWeights);
}

export class Epicycle {
  constructor(options = {}) {
    this.deferentRadius = options.deferentRadius ?? DEFAULT_BASE_RADIUS;
    this.epicycleRadius = options.epicycleRadius ?? this.deferentRadius * INV_PHI;
    this.meanMotion = options.meanMotion ?? 1;
    this.epicycleMotion = options.epicycleMotion ?? PHI;
    this.phase = normalizeAngle(options.phase ?? 0);
    this.epicyclePhase = normalizeAngle(options.epicyclePhase ?? this.phase * INV_PHI);
    this.origin = { x: options.origin?.x ?? 0, y: options.origin?.y ?? 0 };
  }

  setDeferentRadius(radius) {
    assert(isFiniteNumber(radius) && radius > 0, 'Deferent radius must be a positive number');
    this.deferentRadius = radius;
    return this;
  }

  angleAt(time, equantEngine = null, inputAngle = 0) {
    return equantEngine ? equantEngine.angleAt(time, { phase: this.phase, inputAngle }) : normalizeAngle(this.phase + this.meanMotion * time);
  }

  secondaryAngleAt(time, equantEngine = null, inputAngle = 0) {
    return normalizeAngle(this.epicyclePhase + this.epicycleMotion * time + this.angleAt(time, equantEngine, inputAngle) * INV_PHI);
  }

  positionAt(time, equantEngine = null, inputAngle = 0) {
    const primaryAngle = this.angleAt(time, equantEngine, inputAngle);
    const secondaryAngle = this.secondaryAngleAt(time, equantEngine, inputAngle);
    return cartesian(this.epicycleRadius, secondaryAngle, cartesian(this.deferentRadius, primaryAngle, this.origin));
  }

  trace(samples = 32, duration = TAU, equantEngine = null, inputAngle = 0) {
    const count = Math.max(2, Math.floor(samples));
    return Array.from({ length: count }, (_, index) => this.positionAt((duration * index) / (count - 1), equantEngine, inputAngle));
  }

  clone(overrides = {}) {
    return new Epicycle({
      deferentRadius: overrides.deferentRadius ?? this.deferentRadius,
      epicycleRadius: overrides.epicycleRadius ?? this.epicycleRadius,
      meanMotion: overrides.meanMotion ?? this.meanMotion,
      epicycleMotion: overrides.epicycleMotion ?? this.epicycleMotion,
      phase: overrides.phase ?? this.phase,
      epicyclePhase: overrides.epicyclePhase ?? this.epicyclePhase,
      origin: overrides.origin ?? this.origin,
    });
  }
}

export class CelestialSphere {
  constructor(level, options = {}) {
    this.level = level;
    this.radius = options.radius ?? DEFAULT_BASE_RADIUS * PHI ** level;
    this.name = options.name ?? `Sphere-${level}`;
    this.activationMargin = options.activationMargin ?? DEFAULT_ACTIVATION_WINDOW * (1 + level * 0.125);
    this.harmonicRatios = options.harmonicRatios ?? PYTHAGOREAN_INTERVALS;
    this.experts = [];
  }

  addExpert(expert) {
    assert(expert instanceof PtolemyExpert, 'CelestialSphere can only contain PtolemyExpert instances');
    expert.attachToSphere(this);
    this.experts.push(expert);
    return expert;
  }

  removeExpert(expertId) {
    const index = this.experts.findIndex(expert => expert.id === expertId);
    if (index < 0) return null;
    const [expert] = this.experts.splice(index, 1);
    expert.attachToSphere(null);
    return expert;
  }

  expertStatesAt({ time, inputAngle, queryPoint }) {
    return this.experts.map((expert, index) => ({
      ...expert.stateAt({ time, inputAngle, queryPoint }),
      harmonic: this.harmonicRatios[index % this.harmonicRatios.length],
      harmonicWeight: 1 / this.harmonicRatios[index % this.harmonicRatios.length],
      sphere: this,
    }));
  }

  findOverheadExperts({ time, inputAngle, queryPoint, limit = DEFAULT_BLEND_LIMIT, activationFloor = 0.01 }) {
    return this.expertStatesAt({ time, inputAngle, queryPoint }).filter(state => state.activation >= activationFloor).sort((left, right) => right.score - left.score).slice(0, limit);
  }

  snapshot(time = 0, inputAngle = 0) {
    return {
      level: this.level,
      name: this.name,
      radius: this.radius,
      experts: this.experts.map(expert => ({ id: expert.id, angle: expert.epicycle.angleAt(time, expert.equantEngine, inputAngle), phase: expert.phase })),
    };
  }
}

export class PtolemyTheorem {
  static chordLength(radius, angleDelta) {
    return 2 * radius * Math.sin(angularDistance(0, angleDelta) / 2);
  }

  static verify(states) {
    if (states.length < 4) return { valid: false, lhs: 0, rhs: 0, ratio: 1, error: 0 };
    const [a, b, c, d] = states.slice(0, 4);
    const ab = distance(a.position, b.position);
    const bc = distance(b.position, c.position);
    const cd = distance(c.position, d.position);
    const ad = distance(a.position, d.position);
    const ac = distance(a.position, c.position);
    const bd = distance(b.position, d.position);
    const lhs = ac * bd;
    const rhs = ab * cd + ad * bc;
    return { valid: true, lhs, rhs, ratio: lhs > EPSILON ? rhs / lhs : 1, error: Math.abs(lhs - rhs) };
  }

  static blend(states, queryPoint, options = {}) {
    const orderedStates = [...states].sort((left, right) => left.angle - right.angle).slice(0, options.limit ?? DEFAULT_BLEND_LIMIT);
    if (!orderedStates.length) return { orderedStates: [], weights: [], theorem: this.verify([]) };
    const theorem = this.verify(orderedStates);
    const theoremAffinity = theorem.valid ? clamp(1 - theorem.error / Math.max(theorem.lhs, theorem.rhs, EPSILON), 0.2, 1) : 1;
    const rawWeights = orderedStates.map((state, index) => {
      const leftNeighbor = orderedStates[(index - 1 + orderedStates.length) % orderedStates.length];
      const rightNeighbor = orderedStates[(index + 1) % orderedStates.length];
      const localChord = distance(leftNeighbor.position, state.position) + distance(state.position, rightNeighbor.position);
      const queryProximity = 1 / Math.max(distance(state.position, queryPoint), EPSILON);
      return state.activation ** 2 * queryProximity * (state.harmonicWeight ?? 1) * theoremAffinity * Math.max(localChord, EPSILON);
    });
    return { orderedStates, weights: normalizeWeights(rawWeights), theorem };
  }
}

export class EquantEngine {
  constructor(options = {}) {
    this.meanMotion = options.meanMotion ?? 1;
    this.eccentricity = clamp(options.eccentricity ?? 0.18, 0, 0.95);
    this.equantOffset = normalizeAngle(options.equantOffset ?? 0);
    this.speedFloor = clamp(options.speedFloor ?? 0.35, 0.05, 10);
    this.speedCeiling = Math.max(options.speedCeiling ?? 2.5, this.speedFloor);
    this.response = clamp(options.response ?? INV_PHI, 0.05, 3);
  }

  velocityAt(baseAngle, inputAngle = 0) {
    const perigee = normalizeAngle(inputAngle + this.equantOffset);
    const relation = normalizeAngle(baseAngle - perigee);
    return clamp(this.meanMotion * (1 + this.eccentricity * Math.cos(relation) * this.response), this.meanMotion * this.speedFloor, this.meanMotion * this.speedCeiling);
  }

  angleAt(time, options = {}) {
    const inputAngle = normalizeAngle(options.inputAngle ?? 0);
    const steps = Math.max(1, Math.min(48, Math.round(options.steps ?? 8)));
    const dt = time / steps;
    let angle = normalizeAngle(options.phase ?? 0);
    for (let index = 0; index < steps; index += 1) angle = normalizeAngle(angle + this.velocityAt(angle + this.meanMotion * dt * 0.5, inputAngle) * dt);
    return angle;
  }

  phaseFor(signal) {
    if (!signal.length) return 0;
    let x = 0;
    let y = 0;
    signal.forEach((value, index) => {
      const angle = PYTHAGOREAN_INTERVALS[index % PYTHAGOREAN_INTERVALS.length] * INV_PHI;
      const amplitude = Math.tanh(value);
      x += Math.cos(angle) * amplitude;
      y += Math.sin(angle) * amplitude;
    });
    return normalizeAngle(Math.atan2(y, x));
  }

  snapshot() {
    return { meanMotion: this.meanMotion, eccentricity: this.eccentricity, equantOffset: this.equantOffset, response: this.response };
  }
}

export class PtolemyExpert {
  constructor(options = {}) {
    assert(typeof options.id === 'string' && options.id.length > 0, 'PtolemyExpert requires a non-empty id');
    assert(typeof options.handler === 'function', `PtolemyExpert "${options.id}" requires a handler function`);
    this.id = options.id;
    this.handler = options.handler;
    this.phase = normalizeAngle(options.phase ?? 0);
    this.baseWeight = options.baseWeight ?? 1;
    this.activationWindow = options.activationWindow ?? DEFAULT_ACTIVATION_WINDOW;
    this.metadata = options.metadata ?? {};
    this.sphere = null;
    this.equantEngine = options.equantEngine instanceof EquantEngine ? options.equantEngine : new EquantEngine(options.equant ?? {});
    this.epicycle = options.epicycle instanceof Epicycle ? options.epicycle : new Epicycle({
      deferentRadius: options.deferentRadius,
      epicycleRadius: options.epicycleRadius,
      meanMotion: options.meanMotion,
      epicycleMotion: options.epicycleMotion,
      phase: this.phase,
      epicyclePhase: options.epicyclePhase,
    });
  }

  attachToSphere(sphere) {
    this.sphere = sphere;
    if (sphere) this.epicycle.setDeferentRadius(sphere.radius);
    return this;
  }

  activationFor(inputAngle, angle) {
    const normalized = clamp(1 - angularDistance(inputAngle, angle) / Math.max(this.activationWindow, EPSILON), 0, 1);
    return this.baseWeight * normalized ** 2;
  }

  stateAt({ time, inputAngle, queryPoint }) {
    const angle = this.epicycle.angleAt(time, this.equantEngine, inputAngle);
    const position = this.epicycle.positionAt(time, this.equantEngine, inputAngle);
    const activation = this.activationFor(inputAngle, angle);
    const distanceToQuery = distance(position, queryPoint);
    const radialDistance = Math.abs((this.sphere?.radius ?? this.epicycle.deferentRadius) - radial(queryPoint));
    return {
      expert: this,
      id: this.id,
      angle,
      position,
      activation,
      distanceToQuery,
      radialDistance,
      score: activation / (1 + distanceToQuery + radialDistance * INV_PHI),
      sphereIndex: this.sphere?.level ?? 0,
    };
  }

  async evaluate(input, context = {}) {
    return this.handler(input, { expertId: this.id, phase: this.phase, metadata: this.metadata, sphereIndex: this.sphere?.level ?? 0, ...context });
  }
}

export class MoEPtolemy {
  constructor(options = {}) {
    this.baseRadius = options.baseRadius ?? DEFAULT_BASE_RADIUS;
    this.sphereCount = Math.max(1, Math.floor(options.sphereCount ?? DEFAULT_SPHERES));
    this.blendLimit = Math.max(1, Math.floor(options.blendLimit ?? DEFAULT_BLEND_LIMIT));
    this.temporalDrift = options.temporalDrift ?? 0;
    this.clock = typeof options.clock === 'function' ? options.clock : () => Date.now() / 1000;
    this.outputReducer = typeof options.outputReducer === 'function' ? options.outputReducer : blendStructured;
    this.spheres = [];
    this.experts = new Map();
    for (let level = 0; level < this.sphereCount; level += 1) {
      this.spheres.push(new CelestialSphere(level, { radius: this.baseRadius * PHI ** level, activationMargin: DEFAULT_ACTIVATION_WINDOW * (1 + level * INV_PHI) }));
    }
  }

  registerSphere(level, options = {}) {
    assert(Number.isInteger(level) && level >= 0, 'Sphere level must be a non-negative integer');
    const sphere = new CelestialSphere(level, { radius: options.radius ?? this.baseRadius * PHI ** level, ...options });
    this.spheres[level] = sphere;
    return sphere;
  }

  registerExpert(config) {
    const expert = config instanceof PtolemyExpert ? config : new PtolemyExpert(config);
    assert(!this.experts.has(expert.id), `Expert "${expert.id}" is already registered`);
    const sphereIndex = config instanceof PtolemyExpert ? config.sphere?.level ?? 0 : Math.max(0, Math.floor(config.sphereIndex ?? 0));
    if (!this.spheres[sphereIndex]) this.registerSphere(sphereIndex);
    this.spheres[sphereIndex].addExpert(expert);
    this.experts.set(expert.id, expert);
    return expert;
  }

  registerExperts(configs = []) { return configs.map(config => this.registerExpert(config)); }

  unregisterExpert(expertId) {
    const expert = this.experts.get(expertId);
    if (!expert) return false;
    expert.sphere?.removeExpert(expertId);
    this.experts.delete(expertId);
    return true;
  }

  getExpert(expertId) { return this.experts.get(expertId) ?? null; }

  encodeInput(input) {
    const signal = toNumericSignal(input);
    const safeSignal = signal.length ? signal : [0];
    let x = 0;
    let y = 0;
    let energy = 0;
    safeSignal.forEach((value, index) => {
      const amplitude = Math.tanh(value);
      const angle = normalizeAngle((index + 1) * PYTHAGOREAN_INTERVALS[index % PYTHAGOREAN_INTERVALS.length] * INV_PHI);
      x += Math.cos(angle) * amplitude;
      y += Math.sin(angle) * amplitude;
      energy += amplitude ** 2;
    });
    const angle = normalizeAngle(Math.atan2(y || Math.sin(mean(safeSignal) || 0), x || Math.cos(energy || 0)));
    const magnitude = this.baseRadius * (0.75 + Math.sqrt(Math.max(energy, EPSILON)) * INV_PHI);
    const sphereRadiusCeiling = this.baseRadius * PHI ** Math.max(this.spheres.length - 1, 0);
    return {
      signal: safeSignal,
      angle,
      energy,
      radius: clamp(magnitude, this.baseRadius * 0.5, sphereRadiusCeiling * PHI),
      phaseSeed: normalizeAngle(angle + energy * INV_PHI),
    };
  }

  celestialPosition(input, options = {}) {
    const time = options.time ?? this.clock();
    const encoded = this.encodeInput(input);
    return {
      time,
      angle: normalizeAngle(encoded.angle + time * this.temporalDrift),
      radius: encoded.radius,
      point: cartesian(encoded.radius, normalizeAngle(encoded.angle + time * this.temporalDrift)),
      signal: encoded.signal,
      energy: encoded.energy,
      phaseSeed: encoded.phaseSeed,
    };
  }

  findOverheadExperts(position, options = {}) {
    const activationFloor = options.activationFloor ?? 0.01;
    const perSphereLimit = options.perSphereLimit ?? this.blendLimit;
    const limit = options.limit ?? this.blendLimit;
    return this.spheres.filter(Boolean).flatMap(sphere => sphere.findOverheadExperts({
      time: position.time,
      inputAngle: position.angle,
      queryPoint: position.point,
      limit: perSphereLimit,
      activationFloor,
    })).sort((left, right) => right.score - left.score).slice(0, limit);
  }

  async infer(input, options = {}) {
    assert(this.experts.size > 0, 'MoEPtolemy requires at least one registered expert');
    const position = this.celestialPosition(input, options);
    const candidates = this.findOverheadExperts(position, options);
    assert(candidates.length > 0, 'No PTOLEMY experts intersect the current celestial activation window');
    const evaluations = await Promise.all(candidates.map(state => state.expert.evaluate(input, {
      celestialPosition: position,
      activation: state.activation,
      orbitalState: state,
      theoremSeed: position.phaseSeed,
    })));
    const theoremBlend = PtolemyTheorem.blend(candidates, position.point, { limit: options.limit ?? this.blendLimit });
    const outputById = new Map(evaluations.map((output, index) => [candidates[index].id, output]));
    const orderedOutputs = theoremBlend.orderedStates.map(state => outputById.get(state.id));
    return {
      output: this.outputReducer(orderedOutputs, theoremBlend.weights, { candidates: theoremBlend.orderedStates, celestialPosition: position, theorem: theoremBlend.theorem }),
      celestialPosition: position,
      theorem: theoremBlend.theorem,
      experts: theoremBlend.orderedStates.map((state, index) => ({
        id: state.id,
        weight: theoremBlend.weights[index],
        activation: state.activation,
        angle: state.angle,
        sphereIndex: state.sphereIndex,
        metadata: state.expert.metadata,
      })),
      outputs: orderedOutputs,
    };
  }

  async route(input, options = {}) { return this.infer(input, options); }
  async predict(input, options = {}) { return this.infer(input, options); }

  explain(input, options = {}) {
    const position = this.celestialPosition(input, options);
    const theorem = PtolemyTheorem.blend(this.findOverheadExperts(position, options), position.point, { limit: options.limit ?? this.blendLimit });
    return {
      celestialPosition: position,
      theorem: theorem.theorem,
      candidates: theorem.orderedStates.map((state, index) => ({
        id: state.id,
        weight: theorem.weights[index],
        activation: state.activation,
        angle: state.angle,
        distanceToQuery: state.distanceToQuery,
        sphereIndex: state.sphereIndex,
      })),
    };
  }

  snapshot() {
    return {
      sphereCount: this.spheres.filter(Boolean).length,
      expertCount: this.experts.size,
      spheres: this.spheres.filter(Boolean).map(sphere => sphere.snapshot(0, 0)),
    };
  }
}

export default MoEPtolemy;
