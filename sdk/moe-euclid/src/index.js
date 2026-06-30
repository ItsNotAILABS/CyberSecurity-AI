///
/// @medina/moe-euclid — MIXTURE OF EXPERTS: EUCLID
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║      EUCLID — GEOMETRIC EXPERT PARTITIONING via EUCLIDEAN TESSELLATION      ║
/// ║                                                                              ║
/// ║  Named for Euclid of Alexandria — architect of geometric axioms.            ║
/// ║                                                                              ║
/// ║  Architecture: MoE where expert domains are defined by Voronoi              ║
/// ║  tessellation of embedding space. Each expert owns a geometric region.       ║
/// ║  Boundaries are refined via golden-ratio bisection for optimal coverage.     ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Voronoi cell: V(k) = {x : ‖x−cₖ‖ ≤ ‖x−cⱼ‖ ∀j≠k}                   ║
/// ║    • Euclidean distance: d(x,c) = √(Σᵢ(xᵢ−cᵢ)²) — expert proximity      ║
/// ║    • Golden bisection: split at ratio φ:1 for optimal space division        ║
/// ║    • Delaunay dual: expert connectivity graph from Voronoi adjacency        ║
/// ║    • Boundary softening: w = exp(−d²/2σ²) — Gaussian boundary overlap      ║
/// ║    • φ-Lloyd's algorithm: iterative centroid update with φ-momentum         ║
/// ║    • Expert area: A_k = ∫∫_{V(k)} dx — balanced via golden constraints     ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = 1.6180339887498948482;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI * PHI;
export const SQRT_5 = Math.sqrt(5);
export const PI = Math.PI;
export const TAU = 2 * Math.PI;
export const EPSILON = 1e-9;
export const DEFAULT_SIGMA = PHI_INV;
export const MATH_CONSTANTS = Object.freeze({ PHI, PHI_INV, PHI_SQ, SQRT_5, PI, TAU, EPSILON, DEFAULT_SIGMA });

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const squaredNorm = (vector) => vector.reduce((sum, value) => sum + value * value, 0);
const stableSortByDistance = (items) => items.sort((a, b) => a.squaredDistance - b.squaredDistance || String(a.id).localeCompare(String(b.id)));

function validateVector(vector, name = 'vector') {
  assert(Array.isArray(vector), `${name} must be an array of finite numbers`);
  assert(vector.length > 0, `${name} must not be empty`);
  return vector.map((value, index) => {
    const numeric = Number(value);
    assert(Number.isFinite(numeric), `${name}[${index}] must be finite`);
    return numeric;
  });
}

function validateBounds(bounds, dimension) {
  assert(Array.isArray(bounds) && bounds.length === dimension, `bounds must have ${dimension} dimensions`);
  return bounds.map((pair, axis) => {
    assert(Array.isArray(pair) && pair.length === 2, `bounds[${axis}] must be [min, max]`);
    const min = Number(pair[0]);
    const max = Number(pair[1]);
    assert(Number.isFinite(min) && Number.isFinite(max) && min <= max, `bounds[${axis}] must be finite with min <= max`);
    return [min, max];
  });
}

function inferDimension(vectors) {
  const [first] = vectors;
  assert(first && first.length > 0, 'at least one non-empty vector is required');
  return first.length;
}

function dot(a, b) {
  assert(a.length === b.length, 'vector dimensions must match');
  let total = 0;
  for (let i = 0; i < a.length; i++) total += a[i] * b[i];
  return total;
}

function add(a, b) {
  assert(a.length === b.length, 'vector dimensions must match');
  return a.map((value, index) => value + b[index]);
}

function subtract(a, b) {
  assert(a.length === b.length, 'vector dimensions must match');
  return a.map((value, index) => value - b[index]);
}

function scale(vector, scalar) { return vector.map((value) => value * scalar); }
function midpoint(a, b) { return scale(add(a, b), 0.5); }

function squaredDistance(a, b) {
  assert(a.length === b.length, 'vector dimensions must match');
  let total = 0;
  for (let i = 0; i < a.length; i++) {
    const delta = a[i] - b[i];
    total += delta * delta;
  }
  return total;
}

function euclideanDistance(a, b) { return Math.sqrt(squaredDistance(a, b)); }

function meanVector(vectors, weights = null) {
  assert(vectors.length > 0, 'meanVector requires at least one vector');
  const dimension = inferDimension(vectors);
  const accum = new Array(dimension).fill(0);
  let totalWeight = 0;
  vectors.forEach((vector, index) => {
    assert(vector.length === dimension, 'vector dimensions must match');
    const weight = weights ? Number(weights[index] ?? 0) : 1;
    assert(Number.isFinite(weight) && weight >= 0, 'weights must be finite and non-negative');
    totalWeight += weight;
    for (let axis = 0; axis < dimension; axis++) accum[axis] += vector[axis] * weight;
  });
  const divisor = totalWeight > EPSILON ? totalWeight : vectors.length;
  return accum.map((value) => value / divisor);
}

function widestAxis(bounds) {
  let axis = 0;
  let span = -Infinity;
  bounds.forEach(([min, max], index) => {
    const width = max - min;
    if (width > span) { span = width; axis = index; }
  });
  return axis;
}

function axisVariance(vectors, axis) {
  if (vectors.length === 0) return 0;
  const average = vectors.reduce((sum, vector) => sum + vector[axis], 0) / vectors.length;
  return vectors.reduce((sum, vector) => {
    const delta = vector[axis] - average;
    return sum + delta * delta;
  }, 0) / vectors.length;
}

function gaussian(distance, sigma = DEFAULT_SIGMA) {
  const safeSigma = Math.max(Math.abs(sigma), EPSILON);
  return Math.exp(-(distance * distance) / (2 * safeSigma * safeSigma));
}

function normalizeWeights(entries) {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  if (total <= EPSILON) {
    const weight = entries.length > 0 ? 1 / entries.length : 0;
    return entries.map((entry) => ({ ...entry, weight }));
  }
  return entries.map((entry) => ({ ...entry, weight: entry.weight / total }));
}

function blendValues(values, weights) {
  if (values.length === 0) return null;
  if (values.every((value) => typeof value === 'number')) return values.reduce((sum, value, index) => sum + value * weights[index], 0);
  if (values.every(Array.isArray) && values.every((value) => value.length === values[0].length)) {
    return values[0].map((_, axis) => blendValues(values.map((value) => value[axis]), weights));
  }
  if (values.every(isPlainObject)) {
    const keys = new Set(values.flatMap((value) => Object.keys(value)));
    const output = {};
    for (const key of keys) {
      const keyValues = [];
      const keyWeights = [];
      values.forEach((value, index) => {
        if (Object.hasOwn(value, key)) { keyValues.push(value[key]); keyWeights.push(weights[index]); }
      });
      output[key] = blendValues(keyValues, keyWeights);
    }
    return output;
  }
  const bestIndex = weights.reduce((best, weight, index) => weight > weights[best] ? index : best, 0);
  return values[bestIndex];
}

function buildHalfspace(origin, competitor, neighborId) {
  return {
    normal: subtract(competitor, origin),
    offset: (squaredNorm(competitor) - squaredNorm(origin)) / 2,
    neighborId,
    type: 'voronoi',
  };
}

function constraintMargin(point, constraint) { return constraint.offset - dot(point, constraint.normal); }
function boundsVolume(bounds) { return bounds.reduce((product, [min, max]) => product * (max - min), 1); }

export class VoronoiPartitioner {
  constructor({ centroids = [], expertIds = null, bounds = null, tolerance = EPSILON } = {}) {
    this.tolerance = tolerance;
    this.dimension = null;
    this.centroids = [];
    this.expertIds = [];
    this.bounds = null;
    this.cells = new Map();
    if (centroids.length > 0) this.setCentroids(centroids, expertIds, bounds);
  }

  setCentroids(centroids, expertIds = null, bounds = this.bounds) {
    const normalized = centroids.map((centroid, index) => validateVector(centroid, `centroid[${index}]`));
    const dimension = inferDimension(normalized);
    normalized.forEach((centroid) => assert(centroid.length === dimension, 'all centroids must share dimension'));
    const ids = expertIds ?? normalized.map((_, index) => `expert_${index}`);
    assert(ids.length === normalized.length, 'expertIds length must match centroids length');
    this.dimension = dimension;
    this.centroids = normalized;
    this.expertIds = [...ids];
    this.bounds = bounds ? validateBounds(bounds, dimension) : null;
    return this.computeCells();
  }

  computeCells() {
    this.cells = new Map();
    if (this.centroids.length === 0) return this.cells;
    for (let i = 0; i < this.centroids.length; i++) {
      const centroid = this.centroids[i];
      const id = this.expertIds[i];
      const constraints = [];
      let radiusEstimate = Infinity;
      for (let j = 0; j < this.centroids.length; j++) {
        if (i === j) continue;
        const competitor = this.centroids[j];
        constraints.push(buildHalfspace(centroid, competitor, this.expertIds[j]));
        radiusEstimate = Math.min(radiusEstimate, euclideanDistance(centroid, competitor) / 2);
      }
      if (this.bounds) {
        for (let axis = 0; axis < this.dimension; axis++) {
          const lower = new Array(this.dimension).fill(0); lower[axis] = -1;
          const upper = new Array(this.dimension).fill(0); upper[axis] = 1;
          constraints.push({ normal: lower, offset: -this.bounds[axis][0], type: 'bounds' });
          constraints.push({ normal: upper, offset: this.bounds[axis][1], type: 'bounds' });
        }
      }
      this.cells.set(id, {
        id,
        centroid: [...centroid],
        constraints,
        neighbors: [],
        radiusEstimate: Number.isFinite(radiusEstimate) ? radiusEstimate : Infinity,
      });
    }
    for (let i = 0; i < this.centroids.length; i++) {
      for (let j = i + 1; j < this.centroids.length; j++) {
        if (this.#sharesBoundary(i, j)) {
          this.cells.get(this.expertIds[i]).neighbors.push(this.expertIds[j]);
          this.cells.get(this.expertIds[j]).neighbors.push(this.expertIds[i]);
        }
      }
    }
    return this.cells;
  }

  #sharesBoundary(i, j) {
    const probe = midpoint(this.centroids[i], this.centroids[j]);
    const reference = squaredDistance(probe, this.centroids[i]);
    for (let k = 0; k < this.centroids.length; k++) {
      if (k === i || k === j) continue;
      if (squaredDistance(probe, this.centroids[k]) < reference - this.tolerance) return false;
    }
    return !this.bounds || this.bounds.every(([min, max], axis) => probe[axis] >= min - this.tolerance && probe[axis] <= max + this.tolerance);
  }

  getCell(expertId) { return this.cells.get(expertId) ?? null; }

  getCells() {
    return Array.from(this.cells.values()).map((cell) => ({
      ...cell,
      centroid: [...cell.centroid],
      neighbors: [...cell.neighbors],
      constraints: cell.constraints.map((constraint) => ({ ...constraint, normal: [...constraint.normal] })),
    }));
  }

  rank(point) {
    const vector = validateVector(point, 'point');
    assert(vector.length === this.dimension, 'point dimension does not match partitioner');
    return stableSortByDistance(this.centroids.map((centroid, index) => ({
      id: this.expertIds[index],
      centroid: [...centroid],
      squaredDistance: squaredDistance(vector, centroid),
      distance: euclideanDistance(vector, centroid),
    })));
  }

  assign(point) {
    const ranked = this.rank(point);
    const winner = ranked[0];
    return { ...winner, ranked, cell: this.getCell(winner.id), membership: this.pointMembership(point, winner.id) };
  }

  assignBatch(points) { return points.map((point) => this.assign(point)); }

  pointMembership(point, expertId) {
    const vector = validateVector(point, 'point');
    const cell = this.getCell(expertId);
    assert(cell, `unknown expertId: ${expertId}`);
    const margins = cell.constraints.map((constraint) => constraintMargin(vector, constraint));
    const minMargin = margins.length > 0 ? Math.min(...margins) : Infinity;
    const meanMargin = margins.length > 0 ? margins.reduce((sum, margin) => sum + margin, 0) / margins.length : Infinity;
    return { inside: margins.every((margin) => margin >= -this.tolerance), minMargin, meanMargin, margins };
  }

  adjacencyGraph() { return Object.fromEntries(Array.from(this.cells.entries()).map(([id, cell]) => [id, [...cell.neighbors]])); }
}

export class GoldenBisector {
  constructor({ phi = PHI, minSpan = EPSILON } = {}) {
    this.phi = phi;
    this.ratio = 1 / phi;
    this.minSpan = minSpan;
  }

  splitInterval(min, max) {
    const lower = Number(min);
    const upper = Number(max);
    assert(Number.isFinite(lower) && Number.isFinite(upper) && lower <= upper, 'interval bounds must be finite with min <= max');
    const span = upper - lower;
    if (span <= this.minSpan) {
      const pivot = lower + span / 2;
      return { pivot, left: [lower, pivot], right: [pivot, upper], golden: false };
    }
    const pivot = lower + span * this.ratio;
    return { pivot, left: [lower, pivot], right: [pivot, upper], golden: true };
  }

  splitBounds(bounds, axis = null) {
    assert(Array.isArray(bounds) && bounds.length > 0, 'bounds are required for bisection');
    const normalized = validateBounds(bounds, bounds.length);
    const chosenAxis = axis ?? widestAxis(normalized);
    const interval = this.splitInterval(normalized[chosenAxis][0], normalized[chosenAxis][1]);
    return {
      axis: chosenAxis,
      pivot: interval.pivot,
      ratio: this.ratio,
      golden: interval.golden,
      leftBounds: normalized.map(([min, max], index) => index === chosenAxis ? interval.left : [min, max]),
      rightBounds: normalized.map(([min, max], index) => index === chosenAxis ? interval.right : [min, max]),
    };
  }

  splitCentroids(centroids, axis = null) {
    const normalized = centroids.map((centroid, index) => validateVector(centroid, `centroid[${index}]`));
    assert(normalized.length >= 2, 'at least two centroids are required to split');
    const dimension = inferDimension(normalized);
    const chosenAxis = axis ?? Array.from({ length: dimension }, (_, currentAxis) => currentAxis)
      .reduce((bestAxis, currentAxis) => axisVariance(normalized, currentAxis) > axisVariance(normalized, bestAxis) ? currentAxis : bestAxis, 0);
    const ordered = normalized.map((centroid, index) => ({ centroid, index, value: centroid[chosenAxis] })).sort((a, b) => a.value - b.value);
    const splitIndex = clamp(Math.round((ordered.length - 1) * this.ratio), 1, ordered.length - 1);
    const left = ordered.slice(0, splitIndex);
    const right = ordered.slice(splitIndex);
    return {
      axis: chosenAxis,
      pivotValue: (left[left.length - 1].value + right[0].value) / 2,
      leftIndices: left.map((entry) => entry.index),
      rightIndices: right.map((entry) => entry.index),
      leftCentroids: left.map((entry) => [...entry.centroid]),
      rightCentroids: right.map((entry) => [...entry.centroid]),
    };
  }
}

export class EuclideanExpert {
  constructor({ id, centroid, region = null, processor = null, metadata = {} } = {}) {
    assert(id, 'EuclideanExpert requires an id');
    this.id = id;
    this.centroid = validateVector(centroid, `${id}.centroid`);
    this.region = region;
    this.processor = typeof processor === 'function' ? processor : null;
    this.metadata = { ...metadata };
    this.stats = { processed: 0, totalDistance: 0, lastDistance: null, lastActivation: null };
  }

  setRegion(region) { this.region = region; return this; }

  owns(point, partitioner = null) {
    const vector = validateVector(point, 'point');
    if (this.region?.constraints?.length) return this.region.constraints.every((constraint) => constraintMargin(vector, constraint) >= -EPSILON);
    return partitioner ? partitioner.assign(vector).id === this.id : false;
  }

  process(input, context = {}) {
    const point = context.point ? validateVector(context.point, 'context.point') : this.#extractPoint(input);
    const domain = this.#domainState(point);
    if (context.strictDomain && !domain.inside) throw new Error(`Point lies outside expert ${this.id} domain`);
    const output = this.processor ? this.processor(input, { expert: this, point, domain, context }) : this.#defaultProcess(input, point, domain);
    this.stats.processed += 1;
    this.stats.totalDistance += domain.distance;
    this.stats.lastDistance = domain.distance;
    this.stats.lastActivation = domain.activation;
    return { expertId: this.id, centroid: [...this.centroid], distance: domain.distance, confidence: domain.confidence, activation: domain.activation, domain, output };
  }

  getStatus() {
    return {
      id: this.id,
      centroid: [...this.centroid],
      processed: this.stats.processed,
      averageDistance: this.stats.processed > 0 ? this.stats.totalDistance / this.stats.processed : 0,
      lastDistance: this.stats.lastDistance,
      lastActivation: this.stats.lastActivation,
      metadata: { ...this.metadata },
    };
  }

  #extractPoint(input) {
    if (Array.isArray(input)) return validateVector(input, 'input');
    if (ArrayBuffer.isView(input)) return validateVector(Array.from(input), 'input');
    if (isPlainObject(input)) {
      if (Array.isArray(input.embedding)) return validateVector(input.embedding, 'input.embedding');
      if (Array.isArray(input.vector)) return validateVector(input.vector, 'input.vector');
      if (Array.isArray(input.point)) return validateVector(input.point, 'input.point');
    }
    throw new Error('EuclideanExpert could not extract a vector from input');
  }

  #domainState(point) {
    const distance = euclideanDistance(point, this.centroid);
    const margins = this.region?.constraints?.map((constraint) => constraintMargin(point, constraint)) ?? [];
    const minMargin = margins.length > 0 ? Math.min(...margins) : Infinity;
    const inside = margins.length === 0 ? true : margins.every((margin) => margin >= -EPSILON);
    const sigma = Math.max(this.region?.radiusEstimate ?? DEFAULT_SIGMA, DEFAULT_SIGMA);
    const confidence = gaussian(distance, sigma);
    return { inside, distance, minMargin, confidence, activation: inside ? confidence : confidence * 0.5 };
  }

  #defaultProcess(input, point, domain) {
    if (typeof input === 'number') return input * domain.activation;
    if (Array.isArray(input) || ArrayBuffer.isView(input)) return point.map((value, axis) => (value - this.centroid[axis]) * domain.activation);
    if (isPlainObject(input)) {
      const transformed = {};
      for (const [key, value] of Object.entries(input)) transformed[key] = typeof value === 'number' ? value * domain.activation : value;
      transformed.__euclid = { expertId: this.id, distance: domain.distance, confidence: domain.confidence };
      return transformed;
    }
    return { value: input, expertId: this.id, activation: domain.activation, confidence: domain.confidence };
  }
}

export class BoundarySoftener {
  constructor({ sigma = DEFAULT_SIGMA, topK = 2, marginThreshold = PHI_INV / 2, temperature = 1 } = {}) {
    this.sigma = sigma;
    this.topK = topK;
    this.marginThreshold = marginThreshold;
    this.temperature = temperature;
  }

  computeWeights(point, experts, partitioner = null) {
    const vector = validateVector(point, 'point');
    const ranked = experts.map((expert) => ({
      expert,
      expertId: expert.id,
      centroid: [...expert.centroid],
      squaredDistance: squaredDistance(vector, expert.centroid),
      distance: euclideanDistance(vector, expert.centroid),
    })).sort((a, b) => a.squaredDistance - b.squaredDistance);
    if (ranked.length === 0) return [];
    if (ranked.length === 1) return [{ ...ranked[0], weight: 1, boundary: false, overlap: 0 }];
    const winner = ranked[0];
    const runnerUp = ranked[1];
    const margin = runnerUp.distance - winner.distance;
    if (margin > this.marginThreshold) return [{ ...winner, weight: 1, boundary: false, overlap: 0 }];
    const softened = normalizeWeights(ranked.slice(0, Math.min(this.topK, ranked.length)).map((entry) => {
      const domainMargin = partitioner ? Math.max(partitioner.pointMembership(vector, entry.expertId).minMargin, 0) : 0;
      const weight = gaussian(entry.distance, this.sigma / this.temperature) * (1 + domainMargin);
      return { ...entry, weight, boundary: true };
    }));
    const overlap = -softened.reduce((sum, entry) => entry.weight <= EPSILON ? sum : sum + entry.weight * Math.log(entry.weight), 0);
    return softened.map((entry) => ({ ...entry, overlap }));
  }

  blend(point, experts, partitioner, compute) {
    const weights = this.computeWeights(point, experts, partitioner);
    const results = weights.map((entry) => ({ ...entry, result: compute(entry.expert) }));
    return {
      point: [...point],
      boundary: results.length > 1,
      winnerId: results[0]?.expertId ?? null,
      weights: results.map(({ expertId, weight, distance, overlap }) => ({ expertId, weight, distance, overlap })),
      experts: results.map(({ expertId, result }) => ({ expertId, result })),
      output: blendValues(results.map((entry) => entry.result.output), results.map((entry) => entry.weight)),
    };
  }
}

export class LloydOptimizer {
  constructor({ iterations = 12, phiMomentum = PHI_INV, tolerance = 1e-4, jitter = 1e-6 } = {}) {
    this.iterations = iterations;
    this.phiMomentum = phiMomentum;
    this.tolerance = tolerance;
    this.jitter = jitter;
  }

  optimize({ centroids, samples, sampleWeights = null } = {}) {
    const current = centroids.map((centroid, index) => validateVector(centroid, `centroid[${index}]`));
    const points = samples.map((sample, index) => validateVector(sample, `sample[${index}]`));
    assert(current.length > 0, 'LloydOptimizer requires centroids');
    assert(points.length > 0, 'LloydOptimizer requires samples');
    const dimension = inferDimension(current);
    current.forEach((centroid) => assert(centroid.length === dimension, 'centroid dimensions must match'));
    points.forEach((point) => assert(point.length === dimension, 'sample dimensions must match centroid dimensions'));
    let centroidsState = current.map((centroid) => [...centroid]);
    let velocity = centroidsState.map(() => new Array(dimension).fill(0));
    const history = [];
    for (let iteration = 0; iteration < this.iterations; iteration++) {
      const buckets = centroidsState.map(() => []);
      const bucketWeights = centroidsState.map(() => []);
      points.forEach((point, sampleIndex) => {
        let bestIndex = 0;
        let bestDistance = Infinity;
        centroidsState.forEach((centroid, centroidIndex) => {
          const distance = squaredDistance(point, centroid);
          if (distance < bestDistance) { bestDistance = distance; bestIndex = centroidIndex; }
        });
        buckets[bestIndex].push(point);
        bucketWeights[bestIndex].push(sampleWeights ? Number(sampleWeights[sampleIndex] ?? 0) : 1);
      });
      const next = centroidsState.map((centroid, centroidIndex) => {
        const target = buckets[centroidIndex].length > 0 ? meanVector(buckets[centroidIndex], bucketWeights[centroidIndex]) : this.#reseedCentroid(centroidsState, points, centroidIndex);
        const displacement = subtract(target, centroid);
        velocity[centroidIndex] = add(scale(velocity[centroidIndex], this.phiMomentum), displacement);
        return centroid.map((value, axis) => value + velocity[centroidIndex][axis] + this.jitter * Math.sin((iteration + 1) * (axis + 1) * PHI));
      });
      const maxShift = next.reduce((max, centroid, index) => Math.max(max, euclideanDistance(centroid, centroidsState[index])), 0);
      history.push({ iteration, maxShift, centroids: next.map((centroid) => [...centroid]) });
      centroidsState = next;
      if (maxShift <= this.tolerance) break;
    }
    return { centroids: centroidsState, iterations: history.length, converged: history.at(-1)?.maxShift <= this.tolerance, history };
  }

  #reseedCentroid(centroids, points, centroidIndex) {
    let farthestPoint = points[0];
    let farthestDistance = -Infinity;
    points.forEach((point) => {
      const nearestDistance = centroids.reduce((best, centroid, index) => index === centroidIndex ? best : Math.min(best, squaredDistance(point, centroid)), Infinity);
      if (nearestDistance > farthestDistance) { farthestDistance = nearestDistance; farthestPoint = point; }
    });
    return [...farthestPoint];
  }
}

export class MoEEuclid {
  constructor({ experts = [], sigma = DEFAULT_SIGMA, boundaryTopK = 2, bounds = null, lloydIterations = 8, phiMomentum = PHI_INV } = {}) {
    this.bounds = bounds;
    this.experts = [];
    this.expertMap = new Map();
    this.bisector = new GoldenBisector();
    this.softener = new BoundarySoftener({ sigma, topK: boundaryTopK });
    this.optimizer = new LloydOptimizer({ iterations: lloydIterations, phiMomentum });
    this.partitioner = new VoronoiPartitioner();
    if (experts.length > 0) this.addExperts(experts);
  }

  static fromCentroids(centroids, processors = [], options = {}) {
    return new MoEEuclid({
      ...options,
      experts: centroids.map((centroid, index) => ({ id: `expert_${index}`, centroid, processor: processors[index] ?? null })),
    });
  }

  addExpert(expertConfig) {
    const expert = expertConfig instanceof EuclideanExpert ? expertConfig : new EuclideanExpert(expertConfig);
    this.experts.push(expert);
    this.expertMap.set(expert.id, expert);
    this.partition(this.bounds);
    return expert;
  }

  addExperts(experts) { experts.forEach((expert) => this.addExpert(expert)); return this; }

  partition(bounds = this.bounds) {
    this.bounds = bounds;
    if (this.experts.length === 0) return this.partitioner;
    this.partitioner = new VoronoiPartitioner({
      centroids: this.experts.map((expert) => expert.centroid),
      expertIds: this.experts.map((expert) => expert.id),
      bounds: this.bounds,
    });
    this.experts.forEach((expert) => expert.setRegion(this.partitioner.getCell(expert.id)));
    return this.partitioner;
  }

  seedDomains(bounds = this.bounds) {
    assert(bounds, 'bounds are required to seed domains');
    let regions = [{ bounds: validateBounds(bounds, bounds.length), depth: 0 }];
    while (regions.length < this.experts.length) {
      regions = regions.sort((a, b) => boundsVolume(b.bounds) - boundsVolume(a.bounds));
      const region = regions.shift();
      const split = this.bisector.splitBounds(region.bounds);
      regions.push({ bounds: split.leftBounds, depth: region.depth + 1 });
      regions.push({ bounds: split.rightBounds, depth: region.depth + 1 });
    }
    regions.slice(0, this.experts.length).forEach((region, index) => {
      this.experts[index].centroid = region.bounds.map(([min, max]) => (min + max) / 2);
    });
    this.partition(bounds);
    return regions.slice(0, this.experts.length);
  }

  assign(point, { soft = false } = {}) {
    const vector = validateVector(point, 'point');
    this.partition(this.bounds);
    return soft ? this.softener.computeWeights(vector, this.experts, this.partitioner) : this.partitioner.assign(vector);
  }

  process(input, { soften = true, context = {}, vector = null } = {}) {
    const point = vector ? validateVector(vector, 'vector') : this.#extractPoint(input);
    this.partition(this.bounds);
    if (!soften) {
      const assignment = this.partitioner.assign(point);
      const expert = this.expertMap.get(assignment.id);
      const result = expert.process(input, { ...context, point });
      return { point, mode: 'hard', assignment, expertId: expert.id, output: result.output, result };
    }
    const blended = this.softener.blend(point, this.experts, this.partitioner, (expert) => expert.process(input, { ...context, point }));
    return { point, mode: 'soft', assignment: this.partitioner.assign(point), ...blended };
  }

  refine(samples, { sampleWeights = null, iterations = this.optimizer.iterations } = {}) {
    const tunedOptimizer = new LloydOptimizer({
      iterations,
      phiMomentum: this.optimizer.phiMomentum,
      tolerance: this.optimizer.tolerance,
      jitter: this.optimizer.jitter,
    });
    const optimized = tunedOptimizer.optimize({ centroids: this.experts.map((expert) => expert.centroid), samples, sampleWeights });
    optimized.centroids.forEach((centroid, index) => { this.experts[index].centroid = centroid; });
    this.partition(this.bounds);
    return optimized;
  }

  summary() {
    this.partition(this.bounds);
    return {
      expertCount: this.experts.length,
      dimension: this.experts[0]?.centroid.length ?? 0,
      adjacency: this.partitioner.adjacencyGraph(),
      experts: this.experts.map((expert) => expert.getStatus()),
      constants: MATH_CONSTANTS,
    };
  }

  #extractPoint(input) {
    if (Array.isArray(input)) return validateVector(input, 'input');
    if (ArrayBuffer.isView(input)) return validateVector(Array.from(input), 'input');
    if (isPlainObject(input)) {
      if (Array.isArray(input.embedding)) return validateVector(input.embedding, 'input.embedding');
      if (Array.isArray(input.vector)) return validateVector(input.vector, 'input.vector');
      if (Array.isArray(input.point)) return validateVector(input.point, 'input.point');
    }
    throw new Error('MoEEuclid requires an input vector, embedding, or point array');
  }
}

export default {
  MATH_CONSTANTS,
  PHI,
  PHI_INV,
  PHI_SQ,
  SQRT_5,
  PI,
  TAU,
  EPSILON,
  DEFAULT_SIGMA,
  VoronoiPartitioner,
  GoldenBisector,
  EuclideanExpert,
  BoundarySoftener,
  LloydOptimizer,
  MoEEuclid,
};
