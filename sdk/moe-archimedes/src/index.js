///
/// @medina/moe-archimedes — MIXTURE OF EXPERTS: ARCHIMEDES
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║    ARCHIMEDES — BUOYANCY EXPERT SELECTION via DISPLACEMENT WEIGHTING        ║
/// ║                                                                              ║
/// ║  Named for Archimedes of Syracuse — discoverer of buoyancy and the lever.   ║
/// ║                                                                              ║
/// ║  Architecture: Dynamic MoE where experts have "density" (specialization     ║
/// ║  depth) and inputs have "volume" (scope). Experts with density < input      ║
/// ║  density RISE (are selected); dense experts for light inputs SINK.          ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Archimedes' Principle: F_buoy = ρ_fluid · V_displaced · g             ║
/// ║      Expert selection force = input_density · expert_volume · φ             ║
/// ║    • Lever principle: F₁·d₁ = F₂·d₂ — expert authority balancing           ║
/// ║    • Displacement: V_disp = overlap(input_space, expert_space)              ║
/// ║    • Density matching: ρ_expert ≈ ρ_input → maximum buoyancy               ║
/// ║    • φ-Lever arm: moment = weight · φ^distance_from_fulcrum                 ║
/// ║    • Eureka threshold: F_buoy > φ·F_gravity → expert activates             ║
/// ║    • Spiral of Archimedes: r = a + bθ for expert trajectory planning        ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

const PHI = 1.6180339887498948482;
const PHI_INV = 0.6180339887498948482;
const PHI_SQ = PHI * PHI;
const PHI_CUBE = PHI * PHI * PHI;
const PI = Math.PI;
const TAU = 2 * PI;
const E = Math.E;
const SQRT_5 = Math.sqrt(5);
const GOLDEN_ANGLE = TAU / PHI_SQ;
const STANDARD_GRAVITY = 9.80665;
const MODEL_GRAVITY = PHI_INV;
const EUREKA_THRESHOLD = PHI;
const ARCHIMEDES_SPIRAL_A = 0;
const ARCHIMEDES_SPIRAL_B = PHI_INV;
const LEVER_DECAY = PHI_INV;
const EPSILON = 1e-9;

const MATH_CONSTANTS = Object.freeze({ PHI, PHI_INV, PHI_SQ, PHI_CUBE, PI, TAU, E, SQRT_5, GOLDEN_ANGLE, STANDARD_GRAVITY, MODEL_GRAVITY, EUREKA_THRESHOLD, ARCHIMEDES_SPIRAL_A, ARCHIMEDES_SPIRAL_B, LEVER_DECAY, EPSILON });

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Map) && !(value instanceof Set);
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const sum = (values) => values.reduce((total, value) => total + value, 0);
const unique = (values) => [...new Set(values)];
const sanitizeWeight = (value, fallback = 1) => isFiniteNumber(value) ? Math.max(EPSILON, value) : fallback;
const createId = (prefix = 'archimedes') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

function extractSpace(input) {
  if (input == null) return [];
  if (Array.isArray(input) || input instanceof Set || input instanceof Map || typeof input === 'string') return input;
  if (isPlainObject(input)) return input.space ?? input.features ?? input.tags ?? input.topics ?? input;
  return input;
}

function toWeightedMap(space) {
  const map = new Map();
  if (space == null) return map;

  const add = (key, weight = 1) => {
    const normalizedKey = String(key).trim().toLowerCase();
    if (!normalizedKey) return;
    const normalizedWeight = sanitizeWeight(weight, 1);
    map.set(normalizedKey, (map.get(normalizedKey) || 0) + normalizedWeight);
  };

  if (space instanceof Map) {
    for (const [key, weight] of space.entries()) add(key, weight);
    return map;
  }

  if (space instanceof Set) {
    for (const item of space.values()) add(item, 1);
    return map;
  }

  if (Array.isArray(space)) {
    for (const item of space) {
      if (isPlainObject(item)) {
        add(item.key ?? item.feature ?? item.token ?? item.name ?? JSON.stringify(item), item.weight ?? item.value ?? 1);
      } else {
        add(item, 1);
      }
    }
    return map;
  }

  if (typeof space === 'string') {
    for (const token of space.split(/[^\p{L}\p{N}._-]+/u).filter(Boolean)) add(token, 1);
    return map;
  }

  if (isPlainObject(space)) {
    for (const [key, value] of Object.entries(space)) {
      if (isFiniteNumber(value)) add(key, value);
      else if (value === true) add(key, 1);
      else if (typeof value === 'string' && value.trim()) add(`${key}:${value}`, 1);
    }
    return map;
  }

  add(space, 1);
  return map;
}

const mapVolume = (weightedMap) => Math.max(EPSILON, sum([...weightedMap.values()]));
const vectorNorm = (weightedMap) => Math.sqrt(sum([...weightedMap.values()].map((value) => value * value)));

function weightedIntersection(inputMap, expertMap) {
  let total = 0;
  const shared = [];
  for (const [feature, inputWeight] of inputMap.entries()) {
    if (!expertMap.has(feature)) continue;
    const overlap = Math.min(inputWeight, expertMap.get(feature));
    if (overlap > 0) {
      total += overlap;
      shared.push(feature);
    }
  }
  return { total, shared };
}

function weightedUnion(inputMap, expertMap) {
  const features = new Set([...inputMap.keys(), ...expertMap.keys()]);
  let total = 0;
  for (const feature of features) total += Math.max(inputMap.get(feature) || 0, expertMap.get(feature) || 0);
  return total;
}

function cosineSimilarity(inputMap, expertMap) {
  let dot = 0;
  for (const [feature, inputWeight] of inputMap.entries()) dot += inputWeight * (expertMap.get(feature) || 0);
  const denominator = vectorNorm(inputMap) * vectorNorm(expertMap);
  return denominator > EPSILON ? dot / denominator : 0;
}

function estimateComplexity(value, depth = 0) {
  if (depth > 3 || value == null) return 0;
  if (typeof value === 'string') return Math.max(1, value.trim().split(/\s+/).filter(Boolean).length * PHI_INV);
  if (typeof value === 'number') return Math.max(1, Math.abs(value) * PHI_INV);
  if (typeof value === 'boolean') return 1;
  if (Array.isArray(value)) return value.length + sum(value.map((entry) => estimateComplexity(entry, depth + 1) * 0.25));
  if (value instanceof Set || value instanceof Map) return value.size;
  if (isPlainObject(value)) {
    const keys = Object.keys(value);
    return keys.length + sum(keys.map((key) => estimateComplexity(value[key], depth + 1) * 0.2));
  }
  return 1;
}

function aggregateWeightedValues(entries) {
  const valid = entries.filter((entry) => entry.value !== undefined);
  if (valid.length === 0) return undefined;
  if (valid.length === 1) return valid[0].value;

  if (valid.every((entry) => typeof entry.value === 'number')) {
    return valid.reduce((total, entry) => total + entry.value * entry.weight, 0);
  }

  if (valid.every((entry) => typeof entry.value === 'string')) {
    return valid
      .sort((a, b) => b.weight - a.weight)
      .map((entry) => `[${(entry.weight * 100).toFixed(1)}% ${entry.expertId}] ${entry.value}`)
      .join('\n');
  }

  if (valid.every((entry) => Array.isArray(entry.value))) {
    return valid
      .sort((a, b) => b.weight - a.weight)
      .map((entry) => ({ expertId: entry.expertId, weight: entry.weight, value: entry.value }));
  }

  if (valid.every((entry) => isPlainObject(entry.value))) {
    const keys = unique(valid.flatMap((entry) => Object.keys(entry.value)));
    const aggregated = {};
    for (const key of keys) {
      const nested = valid.filter((entry) => entry.value[key] !== undefined).map((entry) => ({ ...entry, value: entry.value[key] }));
      aggregated[key] = aggregateWeightedValues(nested);
    }
    return aggregated;
  }

  return valid.sort((a, b) => b.weight - a.weight).map((entry) => ({ expertId: entry.expertId, weight: entry.weight, value: entry.value }));
}

class DisplacementCalculator {
  constructor(config = {}) {
    this.featureBias = sanitizeWeight(config.featureBias, PHI_INV);
    this.cosineBias = sanitizeWeight(config.cosineBias, 1 - PHI_INV);
    this.minimumOverlap = Math.max(0, config.minimumOverlap || 0);
  }

  normalize(space) {
    return toWeightedMap(space);
  }

  measure(inputSpace, expertSpace, options = {}) {
    const inputMap = this.normalize(inputSpace);
    const expertMap = this.normalize(expertSpace);
    const inputVolume = mapVolume(inputMap);
    const expertVolume = mapVolume(expertMap);
    const { total: displacedVolume, shared } = weightedIntersection(inputMap, expertMap);
    const unionVolume = Math.max(EPSILON, weightedUnion(inputMap, expertMap));
    const weightedJaccard = displacedVolume / unionVolume;
    const cosine = cosineSimilarity(inputMap, expertMap);
    const inputDensity = sanitizeWeight(options.inputDensity, 1);
    const expertDensity = sanitizeWeight(options.expertDensity, 1);
    const densityGap = Math.abs(inputDensity - expertDensity);
    const densityAlignment = 1 / (1 + densityGap);
    const overlap = clamp((weightedJaccard * this.featureBias + cosine * this.cosineBias) * (0.5 + densityAlignment / 2), 0, 1);

    return { inputMap, expertMap, inputVolume, expertVolume, displacedVolume, unionVolume, weightedJaccard, cosine, densityGap, densityAlignment, overlap: overlap >= this.minimumOverlap ? overlap : 0, sharedFeatures: shared };
  }
}

class BuoyancyGate {
  constructor(config = {}) {
    this.phi = sanitizeWeight(config.phi, PHI);
    this.gravity = sanitizeWeight(config.gravity, MODEL_GRAVITY);
    this.eurekaThreshold = sanitizeWeight(config.eurekaThreshold, EUREKA_THRESHOLD);
    this.activationFloor = Math.max(0, config.activationFloor ?? 0.1);
    this.minimumDisplacement = Math.max(0, config.minimumDisplacement ?? 0.01);
  }

  computeInputDensity(input, options = {}) {
    const explicitDensity = options.inputDensity ?? input?.density ?? input?.inputDensity;
    if (isFiniteNumber(explicitDensity) && explicitDensity > 0) return explicitDensity;

    const inputMap = toWeightedMap(extractSpace(options.inputSpace ?? input));
    const volume = mapVolume(inputMap);
    const complexity = estimateComplexity(input);
    const urgency = sanitizeWeight(options.urgency ?? input?.urgency ?? input?.priority, 1);
    const focus = sanitizeWeight(options.focus ?? input?.focus ?? input?.importance, 1);
    return Math.max(EPSILON, ((complexity * focus) + urgency) / volume);
  }

  computeBuoyancy(expert, inputDensity, displacement) {
    const expertVolume = sanitizeWeight(expert.volume, 1);
    const displacedVolume = Math.max(0, displacement.displacedVolume);
    const densityGap = Math.abs(inputDensity - expert.density);
    const densityAlignment = 1 / (1 + densityGap);
    const buoyancyForce = inputDensity * Math.max(displacedVolume, EPSILON) * this.phi * densityAlignment;
    const gravityForce = expert.density * expertVolume * this.gravity;
    const eurekaBarrier = this.eurekaThreshold * gravityForce;
    const buoyancyRatio = buoyancyForce / Math.max(eurekaBarrier, EPSILON);
    const netForce = buoyancyForce - eurekaBarrier;
    const rises = inputDensity >= expert.density || netForce >= 0;

    let selectionScore = displacement.overlap * (1 + buoyancyRatio) * PHI_INV + densityAlignment * (1 - PHI_INV);
    if (!rises) selectionScore *= LEVER_DECAY;

    const activated = displacedVolume >= this.minimumDisplacement && (buoyancyRatio >= 1 || selectionScore >= this.activationFloor);
    return { buoyancyForce, gravityForce, eurekaBarrier, buoyancyRatio, netForce, densityGap, densityAlignment, selectionScore, activated, riseState: rises ? 'rising' : 'sinking' };
  }

  rankExperts(experts, options = {}) {
    const inputDensity = this.computeInputDensity(options.input, options);
    const calculator = options.calculator || new DisplacementCalculator();
    const inputSpace = extractSpace(options.inputSpace ?? options.input);

    return [...experts]
      .map((expert) => {
        const displacement = calculator.measure(inputSpace, expert.space, { inputDensity, expertDensity: expert.density });
        return { expert, inputDensity, displacement, ...this.computeBuoyancy(expert, inputDensity, displacement) };
      })
      .sort((left, right) => {
        if (left.activated !== right.activated) return Number(right.activated) - Number(left.activated);
        if (left.selectionScore !== right.selectionScore) return right.selectionScore - left.selectionScore;
        return right.displacement.overlap - left.displacement.overlap;
      });
  }
}

class LeverBalancer {
  constructor(config = {}) {
    this.decay = sanitizeWeight(config.decay, LEVER_DECAY);
    this.minimumShare = Math.max(EPSILON, config.minimumShare ?? 0.0001);
  }

  balance(selections, options = {}) {
    if (!Array.isArray(selections) || selections.length === 0) return [];
    const payloadWeight = sanitizeWeight(options.payloadWeight, 1);

    const weighted = selections.map((selection, index) => {
      const distance = Math.max(1, selection.trajectory?.distanceFromFulcrum ?? index + 1);
      const authority = sanitizeWeight(selection.expert.authority, 1);
      const force = sanitizeWeight(selection.buoyancyForce || selection.selectionScore, EPSILON);
      const moment = authority * force * payloadWeight * Math.pow(this.decay, distance - 1);
      return { ...selection, lever: { armDistance: distance, authority, force, moment } };
    });

    const totalMoment = Math.max(EPSILON, sum(weighted.map((selection) => selection.lever.moment)));
    return weighted.map((selection) => ({ ...selection, share: Math.max(this.minimumShare, selection.lever.moment / totalMoment) })).sort((a, b) => b.share - a.share);
  }
}

class ArchimedesExpert {
  constructor(config = {}) {
    if (typeof config.handler !== 'function') {
      throw new TypeError('ArchimedesExpert requires a handler(input, context) function.');
    }

    this.id = config.id || createId('expert');
    this.name = config.name || this.id;
    this.density = sanitizeWeight(config.density, 1);
    this.volume = sanitizeWeight(config.volume, 1);
    this.authority = sanitizeWeight(config.authority, 1);
    this.space = extractSpace(config.space ?? config.features ?? []);
    this.handler = config.handler;
    this.metadata = { ...config.metadata };
    this.stats = { activations: 0, successes: 0, failures: 0, lastActivatedAt: null, lastResultAt: null };
  }

  supports(input, calculator = new DisplacementCalculator(), options = {}) {
    return calculator.measure(extractSpace(input), this.space, { inputDensity: sanitizeWeight(options.inputDensity, 1), expertDensity: this.density });
  }

  async execute(input, context = {}) {
    this.stats.activations += 1;
    this.stats.lastActivatedAt = Date.now();

    try {
      const result = await this.handler(input, { expert: this, ...context });
      this.stats.successes += 1;
      this.stats.lastResultAt = Date.now();
      return result;
    } catch (error) {
      this.stats.failures += 1;
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`ARCHIMEDES expert ${this.id} failed: ${message}`);
    }
  }

  snapshot() {
    return { id: this.id, name: this.name, density: this.density, volume: this.volume, authority: this.authority, space: [...toWeightedMap(this.space).keys()], metadata: { ...this.metadata }, stats: { ...this.stats } };
  }
}

class SpiralTrajectory {
  constructor(config = {}) {
    this.a = config.a ?? ARCHIMEDES_SPIRAL_A;
    this.b = sanitizeWeight(config.b, ARCHIMEDES_SPIRAL_B);
    this.thetaStep = sanitizeWeight(config.thetaStep, GOLDEN_ANGLE / PHI);
  }

  pointAt(index, options = {}) {
    const theta = (options.thetaOffset ?? 0) + index * this.thetaStep;
    const radius = this.a + this.b * theta;
    return { index, theta, radius, x: radius * Math.cos(theta), y: radius * Math.sin(theta), distanceFromFulcrum: Math.max(1, Math.abs(radius)) };
  }

  plan(selections, options = {}) {
    return [...selections].sort((a, b) => b.selectionScore - a.selectionScore).map((selection, index) => ({ ...selection, trajectory: this.pointAt(index, options) }));
  }
}

class MoEArchimedes {
  constructor(config = {}) {
    this.displacementCalculator = config.displacementCalculator || new DisplacementCalculator(config.displacement || {});
    this.gate = config.gate || new BuoyancyGate(config.gateConfig || {});
    this.leverBalancer = config.leverBalancer || new LeverBalancer(config.lever || {});
    this.spiralTrajectory = config.spiralTrajectory || new SpiralTrajectory(config.spiral || {});
    this.aggregate = typeof config.aggregate === 'function' ? config.aggregate : this._aggregateOutputs.bind(this);
    this.experts = new Map();
    if (Array.isArray(config.experts)) this.registerExperts(config.experts);
  }

  registerExpert(expert) {
    const normalized = expert instanceof ArchimedesExpert ? expert : new ArchimedesExpert(expert);
    this.experts.set(normalized.id, normalized);
    return normalized;
  }

  registerExperts(experts) {
    return experts.map((expert) => this.registerExpert(expert));
  }

  unregisterExpert(expertId) {
    return this.experts.delete(expertId);
  }

  getExpert(expertId) {
    return this.experts.get(expertId) || null;
  }

  listExperts() {
    return [...this.experts.values()].map((expert) => expert.snapshot());
  }

  computeDensity(input, context = {}) {
    return this.gate.computeInputDensity(input, context);
  }

  analyze(input, context = {}) {
    const rawInputSpace = extractSpace(context.inputSpace ?? input);
    const normalizedInputSpace = toWeightedMap(rawInputSpace);
    const inputDensity = this.computeDensity(input, { ...context, inputSpace: rawInputSpace });
    const rankedSelections = this.gate.rankExperts(this.experts.values(), {
      ...context,
      input,
      inputSpace: rawInputSpace,
      inputDensity,
      calculator: this.displacementCalculator,
    });

    let activeSelections = rankedSelections.filter((selection) => selection.activated);
    if (activeSelections.length === 0 && rankedSelections.length > 0 && context.allowFallback !== false) {
      activeSelections = [{ ...rankedSelections[0], activated: true, fallbackActivated: true }];
    }

    const plannedSelections = this.spiralTrajectory.plan(activeSelections, { thetaOffset: context.thetaOffset ?? 0 });
    const balancedSelections = this.leverBalancer.balance(plannedSelections, { payloadWeight: mapVolume(normalizedInputSpace) });

    return { inputDensity, inputSpace: [...normalizedInputSpace.entries()], rankedSelections, activeSelections: balancedSelections, constants: MATH_CONSTANTS };
  }

  async infer(input, context = {}) {
    const analysis = this.analyze(input, context);
    const executions = await Promise.all(
      analysis.activeSelections.map(async (selection) => {
        const output = await selection.expert.execute(input, {
          ...context,
          selection,
          inputDensity: analysis.inputDensity,
          analysis,
          share: selection.share,
        });

        return { expertId: selection.expert.id, expertName: selection.expert.name, share: selection.share, riseState: selection.riseState, buoyancyForce: selection.buoyancyForce, gravityForce: selection.gravityForce, displacement: selection.displacement, trajectory: selection.trajectory, output };
      }),
    );

    return { output: await this.aggregate(executions, analysis, context), inputDensity: analysis.inputDensity, selectedExperts: executions, analysis };
  }

  async route(input, context = {}) {
    return this.infer(input, context);
  }

  async run(input, context = {}) {
    return this.infer(input, context);
  }

  _aggregateOutputs(executions) {
    return aggregateWeightedValues(executions.map((execution) => ({ expertId: execution.expertId, weight: execution.share, value: execution.output })));
  }
}

export { ARCHIMEDES_SPIRAL_A, ARCHIMEDES_SPIRAL_B, ArchimedesExpert, BuoyancyGate, DisplacementCalculator, E, EPSILON, EUREKA_THRESHOLD, GOLDEN_ANGLE, LEVER_DECAY, LeverBalancer, MATH_CONSTANTS, MODEL_GRAVITY, MoEArchimedes, PHI, PHI_CUBE, PHI_INV, PHI_SQ, PI, SQRT_5, SpiralTrajectory, STANDARD_GRAVITY, TAU };

export default MoEArchimedes;
