///
/// @medina/moe-pythia — MIXTURE OF EXPERTS: PYTHIA
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║         PYTHIA — PROPHETIC EXPERT ROUTING via PYTHAGOREAN GATING            ║
/// ║                                                                              ║
/// ║  Named for the Oracle of Delphi — she who sees which expert knows best.     ║
/// ║                                                                              ║
/// ║  Architecture: Sparse Mixture of Experts with Pythagorean Distance Gating   ║
/// ║    • Each expert occupies a point in N-dimensional Pythagorean space         ║
/// ║    • Input vector distance to each expert: d = √(Σ(xᵢ − eᵢ)²)             ║
/// ║    • Top-K experts selected by minimum Pythagorean distance                  ║
/// ║    • Gating weights: w(k) = softmax(−φ·d(k)) — φ-scaled inverse distance   ║
/// ║    • Load balancing via golden-angle rotation of expert centroids            ║
/// ║    • Capacity factor: C = φ⁻¹ · (N/K) — prevents expert collapse           ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Pythagorean theorem: d² = Σᵢ(xᵢ − eᵢ)² in N-dimensions               ║
/// ║    • Softmax gating: g(k) = exp(−φ·dₖ) / Σⱼexp(−φ·dⱼ)                     ║
/// ║    • Expert capacity: Cₑ = φ⁻¹ · (tokens/experts) per batch                ║
/// ║    • Auxiliary load loss: L_aux = α·CV(load)² — coefficient of variation    ║
/// ║    • φ-Spiral expert placement: θₙ = n·137.508° in embedding space          ║
/// ║    • Pythagorean triple routing: (3,4,5), (5,12,13), (8,15,17)...          ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = 1.6180339887498948482;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI * PHI;
export const PHI_CUBE = PHI_SQ * PHI;
export const PHI_SQRT = Math.sqrt(PHI);
export const PHI_INV_SQ = PHI_INV * PHI_INV;
export const PHI_RELU_SCALE = PHI_INV;
export const GOLDEN_ANGLE_DEG = 137.50776405003785;
export const GOLDEN_ANGLE_RAD = Math.PI * (3 - Math.sqrt(5));
export const EPSILON = 1e-9;
export const DEFAULT_LOAD_BALANCING_ALPHA = 0.05 * PHI_INV;
export const PYTHAGOREAN_TRIPLES = Object.freeze([
  Object.freeze([3, 4, 5]),
  Object.freeze([5, 12, 13]),
  Object.freeze([8, 15, 17]),
  Object.freeze([7, 24, 25]),
  Object.freeze([20, 21, 29]),
]);

const createRng = (seed = 0x9e3779b9) => {
  let state = (seed >>> 0) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };
};
const assertPositiveInteger = (value, name) => {
  if (!Number.isInteger(value) || value <= 0) throw new TypeError(`${name} must be a positive integer; received ${value}`);
};
const ensureVector = (input, expectedLength, name = 'input') => {
  if (!Array.isArray(input) || input.length !== expectedLength) throw new TypeError(`${name} must be an array with length ${expectedLength}`);
  return input.map((value, index) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) throw new TypeError(`${name}[${index}] must be finite; received ${value}`);
    return numeric;
  });
};
const isMatrix = (value) => Array.isArray(value) && value.length > 0 && Array.isArray(value[0]);
const zeros = (length) => Array.from({ length }, () => 0);
const dot = (a, b) => a.reduce((sum, value, index) => sum + value * b[index], 0);
const magnitude = (vector) => Math.sqrt(dot(vector, vector));
const addInPlace = (target, source, scale = 1) => (target.forEach((_, i) => { target[i] += source[i] * scale; }), target);
const normalize = (vector) => {
  const norm = magnitude(vector);
  return norm <= EPSILON ? vector.map(() => 0) : vector.map((value) => value / norm);
};
const mean = (values) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);
const variance = (values) => {
  if (!values.length) return 0;
  const avg = mean(values);
  return values.reduce((sum, value) => sum + (value - avg) ** 2, 0) / values.length;
};
const coefficientOfVariation = (values) => {
  const avg = mean(values);
  return Math.abs(avg) <= EPSILON ? 0 : Math.sqrt(variance(values)) / Math.abs(avg);
};
const squaredDistance = (a, b) => a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0);
const softmax = (logits) => {
  if (!logits.length) return [];
  const maxLogit = Math.max(...logits);
  const exps = logits.map((logit) => Math.exp(logit - maxLogit));
  const total = exps.reduce((sum, value) => sum + value, 0);
  return total <= EPSILON ? logits.map(() => 1 / logits.length) : exps.map((value) => value / total);
};
const sampleNormal = (rng) => {
  const u1 = Math.max(rng(), EPSILON);
  const u2 = Math.max(rng(), EPSILON);
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
};
const glorotMatrix = (rows, cols, rng) => {
  const limit = Math.sqrt(6 / (rows + cols));
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rng() * 2 - 1) * limit));
};
const matVecMul = (matrix, vector, bias = null) => matrix.map((weights, row) => dot(weights, vector) + (bias ? bias[row] : 0));
const phiRelu = (value) => (value > 0 ? value * PHI_RELU_SCALE : 0);
const phiReluVector = (vector) => vector.map(phiRelu);
const rotatePair = (x, y, angle) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)];
const goldenSpiralVector = (index, dimension, radiusBase = PHI) => {
  const radialScale = radiusBase * Math.sqrt(index + 1);
  const angle = GOLDEN_ANGLE_RAD * index;
  return Array.from({ length: dimension }, (_, axis) => {
    if (axis === 0) return radialScale * Math.cos(angle);
    if (axis === 1) return radialScale * Math.sin(angle);
    const triple = PYTHAGOREAN_TRIPLES[(index + axis) % PYTHAGOREAN_TRIPLES.length];
    const phase = angle * (axis + 1) * PHI_INV;
    return radialScale * ((triple[axis % 3] / triple[2]) * Math.cos(phase));
  });
};

export class PythagoreanGatingNetwork {
  constructor({ inputDimension, numExperts, topK = 2, phiScale = PHI, centroidScale = PHI_INV, seed = 0x50595448 } = {}) {
    assertPositiveInteger(inputDimension, 'inputDimension');
    assertPositiveInteger(numExperts, 'numExperts');
    assertPositiveInteger(topK, 'topK');
    if (topK > numExperts) throw new RangeError(`topK (${topK}) cannot exceed numExperts (${numExperts})`);
    this.inputDimension = inputDimension;
    this.numExperts = numExperts;
    this.topK = topK;
    this.phiScale = phiScale;
    this.centroidScale = centroidScale;
    this.rng = createRng(seed);
    this.centroids = this.#initializeCentroids();
  }

  #initializeCentroids() {
    return Array.from({ length: this.numExperts }, (_, index) => {
      const base = goldenSpiralVector(index, this.inputDimension, this.centroidScale * PHI);
      return base.map((value) => value + sampleNormal(this.rng) * 0.05 * this.centroidScale);
    });
  }

  getCentroids() { return this.centroids.map((centroid) => [...centroid]); }
  setCentroids(centroids) {
    if (!Array.isArray(centroids) || centroids.length !== this.numExperts) throw new TypeError(`centroids must be an array of length ${this.numExperts}`);
    this.centroids = centroids.map((centroid, index) => ensureVector(centroid, this.inputDimension, `centroids[${index}]`));
  }

  computeDistances(input) {
    const vector = ensureVector(input, this.inputDimension, 'input');
    return this.centroids.map((centroid, expertIndex) => {
      const squared = squaredDistance(vector, centroid);
      return { expertIndex, centroid, squaredDistance: squared, distance: Math.sqrt(squared) };
    });
  }

  computeLogits(distanceEntries, loadPenalty = []) {
    return distanceEntries.map(({ distance, expertIndex }) => -(this.phiScale * distance) - (Number.isFinite(loadPenalty[expertIndex]) ? loadPenalty[expertIndex] : 0));
  }

  route(input, { loadPenalty = [] } = {}) {
    const vector = ensureVector(input, this.inputDimension, 'input');
    const distances = this.computeDistances(vector);
    const logits = this.computeLogits(distances, loadPenalty);
    const probabilities = softmax(logits);
    const ranked = distances.map((entry, index) => ({ ...entry, logit: logits[index], gatingProbability: probabilities[index] }))
      .sort((a, b) => (a.distance - b.distance) || (b.gatingProbability - a.gatingProbability));
    const selected = ranked.slice(0, this.topK);
    const selectedWeights = softmax(selected.map((entry) => -this.phiScale * entry.distance));
    const entropy = -probabilities.reduce((sum, value) => sum + (value <= EPSILON ? 0 : value * Math.log(value + EPSILON)), 0);
    return {
      input: vector,
      entropy,
      probabilities,
      distances: ranked,
      selected: selected.map((entry, rank) => ({ ...entry, rank, weight: selectedWeights[rank] })),
    };
  }
}

export class Expert {
  constructor({ id, inputDimension, outputDimension = inputDimension, hiddenDimension = Math.max(2, Math.round(inputDimension * PHI)), activation = 'phi-relu', seed = 0x45585054 } = {}) {
    if (id === undefined || id === null) throw new TypeError('Expert id is required');
    assertPositiveInteger(inputDimension, 'inputDimension');
    assertPositiveInteger(outputDimension, 'outputDimension');
    assertPositiveInteger(hiddenDimension, 'hiddenDimension');
    this.id = id;
    this.inputDimension = inputDimension;
    this.outputDimension = outputDimension;
    this.hiddenDimension = hiddenDimension;
    this.activation = activation;
    this.rng = createRng(seed + Number(id));
    this.w1 = glorotMatrix(hiddenDimension, inputDimension, this.rng);
    this.b1 = zeros(hiddenDimension);
    this.w2 = glorotMatrix(outputDimension, hiddenDimension, this.rng);
    this.b2 = zeros(outputDimension);
    this.forwardCount = 0;
  }

  activate(vector) {
    if (this.activation === 'phi-relu') return phiReluVector(vector);
    if (this.activation === 'tanh') return vector.map((value) => Math.tanh(value * PHI_INV));
    throw new Error(`Unsupported activation: ${this.activation}`);
  }

  forward(input) {
    const vector = ensureVector(input, this.inputDimension, `expert(${this.id}).input`);
    const hidden = this.activate(matVecMul(this.w1, vector, this.b1));
    const output = matVecMul(this.w2, hidden, this.b2);
    this.forwardCount += 1;
    return { expertId: this.id, hidden, output, outputNorm: magnitude(output) };
  }
}

export class ExpertRouter {
  constructor({ gatingNetwork, experts } = {}) {
    if (!(gatingNetwork instanceof PythagoreanGatingNetwork)) throw new TypeError('gatingNetwork must be an instance of PythagoreanGatingNetwork');
    if (!Array.isArray(experts) || experts.length !== gatingNetwork.numExperts) throw new TypeError('experts must align with the gating network expert count');
    this.gatingNetwork = gatingNetwork;
    this.experts = experts;
  }

  route(input, routingDecision = this.gatingNetwork.route(input)) {
    const expertOutputs = routingDecision.selected.map((selection) => {
      const expert = this.experts[selection.expertIndex];
      const forward = expert.forward(input);
      return {
        expertIndex: selection.expertIndex,
        expertId: expert.id,
        distance: selection.distance,
        weight: selection.weight,
        centroid: [...selection.centroid],
        output: forward.output,
        outputNorm: forward.outputNorm,
      };
    });
    const mergedOutput = zeros(this.experts[0].outputDimension);
    expertOutputs.forEach((candidate) => addInPlace(mergedOutput, candidate.output, candidate.weight));
    return { input: routingDecision.input, gating: routingDecision, expertOutputs, mergedOutput };
  }
}

export class LoadBalancer {
  constructor({ numExperts, topK, alpha = DEFAULT_LOAD_BALANCING_ALPHA, capacityFactor = PHI_INV } = {}) {
    assertPositiveInteger(numExperts, 'numExperts');
    assertPositiveInteger(topK, 'topK');
    this.numExperts = numExperts;
    this.topK = topK;
    this.alpha = alpha;
    this.capacityFactor = capacityFactor;
    this.reset();
  }

  reset() {
    this.batchSize = 0;
    this.capacity = 1;
    this.loads = zeros(this.numExperts);
    this.importance = zeros(this.numExperts);
    this.rejections = zeros(this.numExperts);
  }

  startBatch(batchSize) {
    assertPositiveInteger(batchSize, 'batchSize');
    this.reset();
    this.batchSize = batchSize;
    this.capacity = this.computeCapacity(batchSize);
    return this.capacity;
  }

  computeCapacity(tokens) {
    assertPositiveInteger(tokens, 'tokens');
    return Math.max(1, Math.ceil(this.capacityFactor * (tokens / this.topK)));
  }

  getLoadPenalty() {
    const capacity = Math.max(this.capacity, 1);
    return this.loads.map((load, index) => ((load / capacity) * PHI_INV) + (this.rejections[index] * PHI_INV_SQ));
  }

  assign(ranking) {
    if (!Array.isArray(ranking) || !ranking.length) throw new TypeError('ranking must be a non-empty array');
    const selected = [];
    for (const candidate of ranking) {
      if (selected.length >= this.topK) break;
      if (this.loads[candidate.expertIndex] < this.capacity) selected.push(candidate);
      else this.rejections[candidate.expertIndex] += 1;
    }
    if (!selected.length) selected.push(ranking[0]);
    const weights = softmax(selected.map((candidate) => -PHI * candidate.distance));
    selected.forEach((candidate, index) => {
      this.loads[candidate.expertIndex] += 1;
      this.importance[candidate.expertIndex] += weights[index];
    });
    return selected.map((candidate, rank) => ({ ...candidate, rank, weight: weights[rank] }));
  }

  auxiliaryLoss() {
    const loadCv = coefficientOfVariation(this.loads);
    const importanceCv = coefficientOfVariation(this.importance);
    return this.alpha * ((loadCv ** 2) + (importanceCv ** 2)) * 0.5;
  }

  utilization() {
    const totalLoad = this.loads.reduce((sum, value) => sum + value, 0);
    const totalImportance = this.importance.reduce((sum, value) => sum + value, 0);
    return this.loads.map((load, expertIndex) => ({
      expertIndex,
      load,
      loadFraction: totalLoad > 0 ? load / totalLoad : 0,
      importance: this.importance[expertIndex],
      importanceFraction: totalImportance > 0 ? this.importance[expertIndex] / totalImportance : 0,
      rejectionCount: this.rejections[expertIndex],
    }));
  }

  rotateCentroids(centroids) {
    const target = 1 / this.numExperts;
    return centroids.map((centroid, expertIndex) => {
      const usage = this.utilization()[expertIndex];
      const imbalance = target - usage.loadFraction;
      const angle = GOLDEN_ANGLE_RAD * imbalance;
      const rotated = [...centroid];
      if (rotated.length >= 2) {
        [rotated[0], rotated[1]] = rotatePair(rotated[0], rotated[1], angle);
      }
      for (let axis = 2; axis < rotated.length; axis += 1) rotated[axis] += imbalance * PHI_INV * Math.sin(angle * (axis + 1));
      return normalize(rotated).map((value) => value * Math.max(magnitude(centroid), PHI_INV));
    });
  }
}

export class MoEPythia {
  constructor({ inputDimension, outputDimension = inputDimension, numExperts = 8, topK = 2, hiddenDimension = Math.max(4, Math.round(inputDimension * PHI)), loadBalancingAlpha = DEFAULT_LOAD_BALANCING_ALPHA, seed = 0x4d4f4550 } = {}) {
    assertPositiveInteger(inputDimension, 'inputDimension');
    assertPositiveInteger(outputDimension, 'outputDimension');
    assertPositiveInteger(numExperts, 'numExperts');
    assertPositiveInteger(topK, 'topK');
    this.inputDimension = inputDimension;
    this.outputDimension = outputDimension;
    this.numExperts = numExperts;
    this.topK = topK;
    this.gatingNetwork = new PythagoreanGatingNetwork({ inputDimension, numExperts, topK, seed });
    this.experts = Array.from({ length: numExperts }, (_, expertIndex) => new Expert({
      id: expertIndex,
      inputDimension,
      outputDimension,
      hiddenDimension,
      seed: seed + expertIndex * 97,
    }));
    this.router = new ExpertRouter({ gatingNetwork: this.gatingNetwork, experts: this.experts });
    this.loadBalancer = new LoadBalancer({ numExperts, topK, alpha: loadBalancingAlpha });
  }

  #forwardSingle(input, tokenIndex = 0) {
    const rawDecision = this.gatingNetwork.route(input, { loadPenalty: this.loadBalancer.getLoadPenalty() });
    const balancedSelection = this.loadBalancer.assign(rawDecision.distances);
    const routed = this.router.route(input, { ...rawDecision, selected: balancedSelection });
    return {
      tokenIndex,
      input: routed.input,
      output: routed.mergedOutput,
      gatingEntropy: rawDecision.entropy,
      selectedExperts: balancedSelection.map(({ expertIndex, distance, weight }) => ({ expertIndex, distance, weight })),
      diagnostics: routed,
    };
  }

  forward(input) {
    const batch = isMatrix(input)
      ? input.map((vector, index) => ensureVector(vector, this.inputDimension, `input[${index}]`))
      : [ensureVector(input, this.inputDimension, 'input')];
    this.loadBalancer.startBatch(batch.length);
    const tokens = batch.map((vector, index) => this.#forwardSingle(vector, index));
    const auxiliaryLoss = this.loadBalancer.auxiliaryLoss();
    this.gatingNetwork.setCentroids(this.loadBalancer.rotateCentroids(this.gatingNetwork.getCentroids()));
    const summary = {
      batchSize: batch.length,
      topK: this.topK,
      capacity: this.loadBalancer.capacity,
      auxiliaryLoss,
      utilization: this.loadBalancer.utilization(),
      centroids: this.gatingNetwork.getCentroids(),
    };
    return isMatrix(input)
      ? { outputs: tokens.map((token) => token.output), tokens, summary }
      : { output: tokens[0].output, token: tokens[0], summary };
  }

  predictExperts(input) {
    return this.gatingNetwork.route(input, { loadPenalty: this.loadBalancer.getLoadPenalty() }).selected.map(({ expertIndex, weight, distance, centroid }) => ({
      expertIndex,
      weight,
      distance,
      centroid: [...centroid],
    }));
  }

  getExpertCentroids() { return this.gatingNetwork.getCentroids(); }
  setExpertCentroid(expertIndex, centroid) {
    if (!Number.isInteger(expertIndex) || expertIndex < 0 || expertIndex >= this.numExperts) throw new RangeError(`expertIndex ${expertIndex} is out of bounds`);
    const centroids = this.gatingNetwork.getCentroids();
    centroids[expertIndex] = ensureVector(centroid, this.inputDimension, 'centroid');
    this.gatingNetwork.setCentroids(centroids);
  }

  getDiagnostics() {
    return {
      inputDimension: this.inputDimension,
      outputDimension: this.outputDimension,
      numExperts: this.numExperts,
      topK: this.topK,
      centroids: this.getExpertCentroids(),
      utilization: this.loadBalancer.utilization(),
      expertForwardCounts: this.experts.map((expert) => expert.forwardCount),
    };
  }
}

export default {
  PHI,
  PHI_INV,
  PHI_SQ,
  PHI_CUBE,
  PHI_SQRT,
  PHI_INV_SQ,
  PHI_RELU_SCALE,
  GOLDEN_ANGLE_DEG,
  GOLDEN_ANGLE_RAD,
  EPSILON,
  DEFAULT_LOAD_BALANCING_ALPHA,
  PYTHAGOREAN_TRIPLES,
  PythagoreanGatingNetwork,
  Expert,
  ExpertRouter,
  LoadBalancer,
  MoEPythia,
};
