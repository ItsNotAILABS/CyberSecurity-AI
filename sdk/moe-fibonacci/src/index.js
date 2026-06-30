///
/// @medina/moe-fibonacci — MIXTURE OF EXPERTS: FIBONACCI
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║     FIBONACCI — SPIRAL EXPERT GROWTH via RECURSIVE φ-PHYLLOTAXIS            ║
/// ║                                                                              ║
/// ║  Named for Leonardo Fibonacci — who brought golden mathematics to Europe.   ║
/// ║                                                                              ║
/// ║  Architecture: Self-growing MoE where experts spawn following the           ║
/// ║  Fibonacci sequence. New experts are placed at golden angle (137.508°)      ║
/// ║  from previous, forming a golden spiral. Expert count grows as F(n).        ║
/// ║  Routing follows the spiral — input angle determines active sector.         ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Fibonacci recurrence: F(n) = F(n-1) + F(n-2), F(0)=F(1)=1            ║
/// ║    • Golden spiral: r = a·φ^(θ/90°) — expert distance from origin          ║
/// ║    • Phyllotaxis placement: θₙ = n × 137.508° — optimal packing            ║
/// ║    • Binet's formula: F(n) = (φⁿ − ψⁿ)/√5, ψ = −1/φ                      ║
/// ║    • Zeckendorf representation: every input decomposes into F(n) experts    ║
/// ║    • φ-weighted routing: weight(n) = φ⁻ⁿ for n-th expert from center       ║
/// ║    • Growth trigger: spawn when load > F(current_count)/φ                   ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PSI = (1 - Math.sqrt(5)) / 2;
export const SQRT_5 = Math.sqrt(5);
export const TAU = Math.PI * 2;
export const GOLDEN_ANGLE_DEGREES = 137.508;
export const GOLDEN_ANGLE_RADIANS = GOLDEN_ANGLE_DEGREES * (Math.PI / 180);
export const RIGHT_ANGLE_RADIANS = Math.PI / 2;
export const DEFAULT_RADIAL_UNIT = 1;
export const DEFAULT_ROUTER_FANOUT = 5;
export const DEFAULT_MAX_STAGE = 16;
export const DEFAULT_DECAY = 1 / PHI;
export const EPSILON = 1e-9;

const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const sum = (values) => values.reduce((total, value) => total + value, 0);
const mean = (values) => (values.length ? sum(values) / values.length : 0);
const wrapAngle = (angle) => ((angle % TAU) + TAU) % TAU;
const fibonacciWeight = (index) => PHI ** -Math.max(0, index);
const magnitude = (values) => Math.sqrt(sum(values.map((value) => value * value)));

function hashString(value) {
  const text = String(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function toNumericSequence(input) {
  if (Array.isArray(input)) return input.flat(Infinity).map(Number).filter(Number.isFinite);
  if (isFiniteNumber(input)) return [input];
  if (typeof input === 'string') {
    return Array.from(input, (character, index) => ((character.charCodeAt(0) % 128) / 127) * (index % 2 === 0 ? 1 : -1));
  }
  if (input && typeof input === 'object') {
    const values = [];
    const visit = (value) => {
      if (Array.isArray(value)) return value.forEach(visit);
      if (isFiniteNumber(value)) return values.push(value);
      if (typeof value === 'string') values.push(...toNumericSequence(value));
    };
    Object.values(input).forEach(visit);
    if (values.length) return values;
  }
  return [0];
}

function normalizeVector(input, length = 8) {
  const source = toNumericSequence(input);
  const vector = Array.from({ length }, (_, index) => source[index] ?? 0);
  const scale = magnitude(vector) || 1;
  return vector.map((value) => value / scale);
}

function signalFromInput(input) {
  if (isFiniteNumber(input)) return Math.max(1, Math.round(Math.abs(input)));
  if (typeof input === 'string') return Math.max(1, hashString(input) % 1597);
  const sequence = toNumericSequence(input);
  const weighted = Math.round(sum(sequence.map((value, index) => Math.abs(value) * (index + 1))));
  return Math.max(1, weighted || hashString(JSON.stringify(input ?? null)) % 1597);
}

function weightedAverage(values, weights) {
  const totalWeight = sum(weights);
  return totalWeight <= EPSILON ? 0 : sum(values.map((value, index) => value * weights[index])) / totalWeight;
}

function weightedVectorAverage(vectors, weights) {
  const width = Math.max(0, ...vectors.map((vector) => vector.length));
  return Array.from({ length: width }, (_, index) => weightedAverage(vectors.map((vector) => vector[index] ?? 0), weights));
}

function angleDistance(left, right) {
  const delta = Math.abs(wrapAngle(left) - wrapAngle(right));
  return Math.min(delta, TAU - delta);
}

function createFibonacciSequence(maxStage = DEFAULT_MAX_STAGE) {
  const sequence = [1, 1];
  while (sequence.length <= maxStage) sequence.push(sequence.at(-1) + sequence.at(-2));
  return sequence;
}

function uniqueZeckendorfSequence(maxValue) {
  const sequence = [1, 2];
  while (sequence.at(-1) < maxValue) sequence.push(sequence.at(-1) + sequence.at(-2));
  return sequence;
}

export class PhyllotaxisPlacement {
  constructor({ radialUnit = DEFAULT_RADIAL_UNIT, origin = [0, 0], angleDegrees = GOLDEN_ANGLE_DEGREES, spiralBlend = 0.35, verticalLift = 1 / PHI } = {}) {
    this.radialUnit = radialUnit;
    this.origin = [origin[0] ?? 0, origin[1] ?? 0];
    this.angleDegrees = angleDegrees;
    this.angleRadians = angleDegrees * (Math.PI / 180);
    this.spiralBlend = spiralBlend;
    this.verticalLift = verticalLift;
  }

  angleForIndex(index) { return wrapAngle(index * this.angleRadians); }
  packingRadiusForIndex(index) { return this.radialUnit * Math.sqrt(index + 1); }
  spiralRadiusForIndex(index) { return this.radialUnit * this.spiralBlend * (PHI ** (this.angleForIndex(index) / RIGHT_ANGLE_RADIANS)); }
  radiusForIndex(index) { return this.packingRadiusForIndex(index) + this.spiralRadiusForIndex(index); }

  positionForIndex(index) {
    const theta = this.angleForIndex(index);
    const radius = this.radiusForIndex(index);
    return {
      index,
      theta,
      thetaDegrees: theta * (180 / Math.PI),
      radius,
      packingRadius: this.packingRadiusForIndex(index),
      spiralRadius: this.spiralRadiusForIndex(index),
      x: this.origin[0] + radius * Math.cos(theta),
      y: this.origin[1] + radius * Math.sin(theta),
      z: Math.log1p(index + 1) * this.verticalLift,
    };
  }

  positionsForCount(count) { return Array.from({ length: Math.max(0, count) }, (_, index) => this.positionForIndex(index)); }
}

export class FibonacciGrowthEngine {
  constructor({ initialStage = 4, maxStage = DEFAULT_MAX_STAGE, placement = new PhyllotaxisPlacement() } = {}) {
    this.maxStage = Math.max(2, maxStage);
    this.sequence = createFibonacciSequence(this.maxStage + 2);
    this.stage = clamp(initialStage, 2, this.maxStage);
    this.placement = placement;
  }

  fibonacci(stage = this.stage) { return this.sequence[stage] ?? this.sequence.at(-1); }
  binet(stage = this.stage) { return stage <= 1 ? 1 : Math.round((PHI ** stage - PSI ** stage) / SQRT_5); }
  targetCount(stage = this.stage) { return this.fibonacci(stage); }
  nextTargetCount(stage = this.stage) { return this.fibonacci(Math.min(stage + 1, this.maxStage + 1)); }

  stageForCount(count) {
    const safeCount = Math.max(1, count);
    for (let stage = 0; stage < this.sequence.length; stage += 1) if (this.sequence[stage] >= safeCount) return stage;
    return this.maxStage;
  }

  growthThreshold(currentCount) { return this.fibonacci(this.stageForCount(currentCount)) / PHI; }
  shouldGrow(totalLoad, currentCount) { return totalLoad > this.growthThreshold(currentCount) && this.stage < this.maxStage; }
  nextStage() { return clamp(this.stage + 1, 2, this.maxStage); }

  planForStage(stage, currentCount) {
    const targetCount = this.targetCount(stage);
    return Array.from({ length: Math.max(0, targetCount - currentCount) }, (_, offset) => {
      const index = currentCount + offset;
      const position = this.placement.positionForIndex(index);
      return { index, stage, angleDegrees: position.thetaDegrees, growthWeight: fibonacciWeight(index), position };
    });
  }

  growIfNeeded(totalLoad, currentCount) {
    if (!this.shouldGrow(totalLoad, currentCount)) return [];
    this.stage = this.nextStage();
    return this.planForStage(this.stage, currentCount);
  }
}

export class GoldenSpiralRouter {
  constructor({ fanout = DEFAULT_ROUTER_FANOUT, radialWeight = 0.35 } = {}) {
    this.fanout = fanout;
    this.radialWeight = radialWeight;
  }

  vectorize(input) { return normalizeVector(input, 8); }

  angleFromInput(input) {
    const vector = this.vectorize(input);
    const x = vector[0] + vector[2] * DEFAULT_DECAY - vector[4] * DEFAULT_DECAY;
    const y = vector[1] + vector[3] * DEFAULT_DECAY - vector[5] * DEFAULT_DECAY;
    if (Math.abs(x) <= EPSILON && Math.abs(y) <= EPSILON) {
      return wrapAngle((hashString(JSON.stringify(input ?? null)) % 360) * (Math.PI / 180));
    }
    return wrapAngle(Math.atan2(y, x));
  }

  radialSignal(input) {
    const sequence = toNumericSequence(input).slice(0, 8);
    return magnitude(sequence) + (signalFromInput(input) % 21) / 13;
  }

  route(input, experts, { fanout = this.fanout } = {}) {
    const angle = this.angleFromInput(input);
    const targetRadius = this.radialSignal(input);
    const sectorWidth = experts.length ? TAU / experts.length : TAU;
    const sector = experts.length ? Math.floor(angle / sectorWidth) % experts.length : 0;
    const ranked = experts.map((expert) => {
      const angleGap = angleDistance(angle, expert.position.theta);
      const radiusGap = Math.abs(targetRadius - expert.position.radius);
      const loadPenalty = 1 + expert.utilization();
      return { expert, score: 1 / (loadPenalty + angleGap + radiusGap * this.radialWeight), angleGap, radiusGap };
    }).sort((left, right) => right.score - left.score).slice(0, Math.max(1, fanout));

    return { angle, angleDegrees: angle * (180 / Math.PI), targetRadius, sector, ranked };
  }
}

export class ZeckendorfDecomposer {
  constructor({ maxValue = 4096 } = {}) {
    this.sequence = uniqueZeckendorfSequence(maxValue);
  }

  normalize(input) { return signalFromInput(input); }

  decompose(input) {
    const original = this.normalize(input);
    let remaining = original;
    const terms = [];

    for (let index = this.sequence.length - 1; index >= 0 && remaining > 0; index -= 1) {
      const value = this.sequence[index];
      if (value > remaining) continue;
      terms.push({ stage: index + 1, value, weight: fibonacciWeight(index + 1) });
      remaining -= value;
      index -= 1;
    }

    return { original, remainder: remaining, terms };
  }

  activationPlan(input, expertCount) {
    const decomposition = this.decompose(input);
    const activations = new Map();

    decomposition.terms.forEach((term, position) => {
      if (!expertCount) return;
      const primary = term.stage % expertCount;
      const secondary = (primary + position) % expertCount;
      [primary, secondary].forEach((index) => activations.set(index, (activations.get(index) ?? 0) + term.weight));
    });

    return { ...decomposition, indices: Array.from(activations.entries()).map(([index, weight]) => ({ index, weight })) };
  }
}

export class FibonacciExpert {
  constructor({ id, index, placement, growthEngine, capacity = PHI } = {}) {
    if (!placement || !growthEngine) throw new Error('FibonacciExpert requires placement and growthEngine');
    this.id = id ?? `fib-expert-${index}`;
    this.index = index ?? 0;
    this.placement = placement;
    this.growthEngine = growthEngine;
    this.position = placement.positionForIndex(this.index);
    this.capacity = Math.max(1, capacity);
    this.weight = fibonacciWeight(this.index);
    this.load = 0;
    this.invocations = 0;
    this.spawnCount = 0;
    this.state = {
      bias: Math.sin(this.position.theta) * DEFAULT_DECAY,
      resonance: Math.cos(this.position.theta) * PHI,
      memory: this.weight,
    };
  }

  utilization() { return this.load / this.capacity; }
  growthTrigger() { return this.growthEngine.growthThreshold(this.index + 1); }
  shouldSpawn() { return this.load > this.growthTrigger(); }

  spawnSignal() {
    this.spawnCount += 1;
    return {
      fromExpertId: this.id,
      suggestedIndex: this.index + 1,
      angleDegrees: this.position.thetaDegrees + GOLDEN_ANGLE_DEGREES,
      spawnCount: this.spawnCount,
    };
  }

  project(input) {
    const vector = normalizeVector(input, 8);
    return vector.map((value, dimension) => {
      const harmonic = Math.sin(this.position.theta + dimension * DEFAULT_DECAY) * this.state.resonance;
      const orbital = Math.cos((dimension + 1) * this.position.theta) * this.weight;
      return value * (1 + this.weight) + harmonic * 0.1 + orbital * 0.05 + this.state.bias;
    });
  }

  compute(input, { routeWeight = 0, zeckendorfWeight = 0 } = {}) {
    const activation = clamp(routeWeight * 0.7 + zeckendorfWeight * 0.3 + EPSILON, EPSILON, PHI);
    const vector = this.project(input).map((value) => value * activation);
    const scalar = mean(vector);
    const confidence = clamp((1 / (1 + this.utilization())) * activation, 0, 1);
    this.load += activation;
    this.invocations += 1;
    this.state.memory = this.state.memory * DEFAULT_DECAY + scalar * (1 - DEFAULT_DECAY);

    return {
      expertId: this.id,
      expertIndex: this.index,
      activation,
      confidence,
      scalar,
      vector,
      position: this.position,
      state: { ...this.state },
      shouldSpawn: this.shouldSpawn(),
      spawnSignal: this.shouldSpawn() ? this.spawnSignal() : null,
    };
  }

  decay(rate = DEFAULT_DECAY) { this.load *= clamp(rate, 0, 1); }

  snapshot() {
    return {
      id: this.id,
      index: this.index,
      weight: this.weight,
      load: this.load,
      invocations: this.invocations,
      position: this.position,
      state: { ...this.state },
    };
  }
}

export class MoEFibonacci {
  constructor({ initialStage = 4, maxStage = DEFAULT_MAX_STAGE, routerFanout = DEFAULT_ROUTER_FANOUT, radialUnit = DEFAULT_RADIAL_UNIT, expertCapacity = PHI } = {}) {
    this.placement = new PhyllotaxisPlacement({ radialUnit });
    this.growthEngine = new FibonacciGrowthEngine({ initialStage, maxStage, placement: this.placement });
    this.router = new GoldenSpiralRouter({ fanout: routerFanout });
    this.decomposer = new ZeckendorfDecomposer({ maxValue: this.growthEngine.nextTargetCount(maxStage) * 8 });
    this.expertCapacity = expertCapacity;
    this.experts = [];
    this.history = [];
    this.ensureExpertCount(this.growthEngine.targetCount());
  }

  createExpert(index) {
    return new FibonacciExpert({
      id: `fib-expert-${index}`,
      index,
      placement: this.placement,
      growthEngine: this.growthEngine,
      capacity: this.expertCapacity + index * DEFAULT_DECAY,
    });
  }

  ensureExpertCount(targetCount) {
    while (this.experts.length < targetCount) this.experts.push(this.createExpert(this.experts.length));
    return this.experts;
  }

  spawnExperts(plan) {
    return plan.map((descriptor) => {
      const expert = this.createExpert(descriptor.index);
      this.experts.push(expert);
      return {
        id: expert.id,
        index: expert.index,
        angleDegrees: descriptor.angleDegrees,
        growthWeight: descriptor.growthWeight,
        position: descriptor.position,
      };
    });
  }

  buildActivationMap(routeMeta, zeckendorfPlan) {
    const activations = new Map();
    routeMeta.ranked.forEach(({ expert, score }) => activations.set(expert.index, { expert, routeWeight: score, zeckendorfWeight: 0 }));

    zeckendorfPlan.indices.forEach(({ index, weight }) => {
      const expert = this.experts[index];
      if (!expert) return;
      const current = activations.get(index) ?? { expert, routeWeight: 0, zeckendorfWeight: 0 };
      current.zeckendorfWeight += weight;
      activations.set(index, current);
    });

    return Array.from(activations.values()).sort((left, right) => (right.routeWeight + right.zeckendorfWeight) - (left.routeWeight + left.zeckendorfWeight));
  }

  merge(outputs) {
    const weights = outputs.map((output, index) => output.activation * output.confidence * fibonacciWeight(index));
    return {
      scalar: weightedAverage(outputs.map((output) => output.scalar), weights),
      vector: weightedVectorAverage(outputs.map((output) => output.vector), weights),
      center: {
        x: weightedAverage(outputs.map((output) => output.position.x), weights),
        y: weightedAverage(outputs.map((output) => output.position.y), weights),
        z: weightedAverage(outputs.map((output) => output.position.z), weights),
      },
      energy: sum(weights),
      experts: outputs.map(({ expertId, expertIndex, activation, confidence }) => ({ expertId, expertIndex, activation, confidence })),
    };
  }

  rebalance() {
    this.experts.forEach((expert, index) => expert.decay(clamp(DEFAULT_DECAY + index * 0.0025, 0.4, 0.98)));
  }

  grow(outputs) {
    const totalLoad = sum(this.experts.map((expert) => expert.load));
    const proactiveBoost = outputs.some((output) => output.shouldSpawn) ? 1 : 0;
    const planned = this.growthEngine.growIfNeeded(totalLoad + proactiveBoost, this.experts.length);
    return planned.length ? this.spawnExperts(planned) : [];
  }

  process(input, options = {}) {
    const routeMeta = this.router.route(input, this.experts, options);
    const zeckendorfPlan = this.decomposer.activationPlan(input, this.experts.length);
    const activationMap = this.buildActivationMap(routeMeta, zeckendorfPlan);
    const outputs = activationMap.map(({ expert, routeWeight, zeckendorfWeight }) => expert.compute(input, { routeWeight, zeckendorfWeight }));
    const merged = this.merge(outputs);
    const spawned = this.grow(outputs);
    this.rebalance();

    const result = {
      inputSignal: this.decomposer.normalize(input),
      routedAngle: routeMeta.angleDegrees,
      sector: routeMeta.sector,
      zeckendorf: zeckendorfPlan.terms,
      activations: activationMap.map(({ expert, routeWeight, zeckendorfWeight }) => ({ expertId: expert.id, expertIndex: expert.index, routeWeight, zeckendorfWeight })),
      merged,
      spawned,
      expertCount: this.experts.length,
    };

    this.history.push(result);
    if (this.history.length > 144) this.history.shift();
    return result;
  }

  infer(input, options = {}) { return this.process(input, options); }

  getTopology() {
    return { stage: this.growthEngine.stage, targetCount: this.growthEngine.targetCount(), nextTargetCount: this.growthEngine.nextTargetCount(), expertCount: this.experts.length, experts: this.experts.map((expert) => expert.snapshot()) };
  }

  describe() {
    return { name: 'FIBONACCI', architecture: 'GoldenSpiral + Phyllotaxis + Zeckendorf + RecursiveGrowth', phi: PHI, goldenAngleDegrees: GOLDEN_ANGLE_DEGREES, ...this.getTopology() };
  }
}

export function createMoEFibonacci(options = {}) { return new MoEFibonacci(options); }

export const MATH_CONSTANTS = { PHI, PSI, SQRT_5, TAU, GOLDEN_ANGLE_DEGREES, GOLDEN_ANGLE_RADIANS, RIGHT_ANGLE_RADIANS, DEFAULT_RADIAL_UNIT, DEFAULT_ROUTER_FANOUT, DEFAULT_MAX_STAGE, DEFAULT_DECAY, EPSILON };

export default { PHI, PSI, SQRT_5, TAU, GOLDEN_ANGLE_DEGREES, GOLDEN_ANGLE_RADIANS, FibonacciGrowthEngine, GoldenSpiralRouter, PhyllotaxisPlacement, ZeckendorfDecomposer, FibonacciExpert, MoEFibonacci, MATH_CONSTANTS, createMoEFibonacci };
