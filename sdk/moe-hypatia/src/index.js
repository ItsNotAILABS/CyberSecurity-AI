///
/// @medina/moe-hypatia — MIXTURE OF EXPERTS: HYPATIA
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║      HYPATIA — ALGEBRAIC EXPERT FUSION via CONIC SECTION HARMONICS          ║
/// ║                                                                              ║
/// ║  Named for Hypatia of Alexandria — mathematician of conic sections.         ║
/// ║                                                                              ║
/// ║  Architecture: MoE where expert outputs are fused along conic section       ║
/// ║  curves (ellipse, parabola, hyperbola). The eccentricity of the fusion      ║
/// ║  conic determines blend sharpness. φ appears as the golden eccentricity.    ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Conic general form: Ax² + Bxy + Cy² + Dx + Ey + F = 0                 ║
/// ║    • Eccentricity: e = c/a — determines fusion curve type                   ║
/// ║      e < 1 (ellipse): smooth blending, e = 1 (parabola): focused,          ║
/// ║      e > 1 (hyperbola): sharp separation. Golden: e = 1/φ = 0.618          ║
/// ║    • Focal routing: experts at foci, input on curve, sum of distances = 2a  ║
/// ║    • Elliptic blend: w_k = (2a − d_k) / Σ(2a − d_j) — distance from focus ║
/// ║    • Astrolabe projection: maps high-dim expert space to 2D conic           ║
/// ║    • φ-Eccentricity ladder: layers use e = φ⁻¹, φ⁻², φ⁻³...              ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PI = Math.PI;
export const TAU = 2 * PI;
export const HALF_PI = PI / 2;
export const E = Math.E;
export const SQRT_2 = Math.SQRT2;
export const EPSILON = 1e-9;
export const PHI = (1 + Math.sqrt(5)) / 2;
export const INV_PHI = 1 / PHI;
export const GOLDEN_ECCENTRICITY = INV_PHI;
export const GOLDEN_ANGLE = TAU * (1 - INV_PHI);
export const CONIC_TYPES = Object.freeze({ ELLIPSE: 'ellipse', PARABOLA: 'parabola', HYPERBOLA: 'hyperbola' });
const DEFAULT_LAYER_COUNT = 3, DEFAULT_SEMI_MAJOR_AXIS = 1.618, DEFAULT_ROUTING_TEMPERATURE = 0.75, DEFAULT_BANDWIDTH = 1;
function assertFiniteNumber(name, value) {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be a finite number.`);
}
function assertVector(name, vector, expectedLength) {
  if (!Array.isArray(vector) || vector.length === 0) throw new TypeError(`${name} must be a non-empty array.`);
  if (expectedLength != null && vector.length !== expectedLength) {
    throw new RangeError(`${name} must have length ${expectedLength}.`);
  }
  vector.forEach((value, index) => assertFiniteNumber(`${name}[${index}]`, value));
}
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const sum = (values) => values.reduce((accumulator, value) => accumulator + value, 0);
const dot = (left, right) => left.reduce((accumulator, value, index) => accumulator + value * right[index], 0);
const norm = (vector) => Math.sqrt(Math.max(dot(vector, vector), 0));
const scale = (vector, scalar) => vector.map((value) => value * scalar);
const add = (left, right) => left.map((value, index) => value + right[index]);
const sub = (left, right) => left.map((value, index) => value - right[index]);
const distance2D = (left, right) => Math.hypot(left[0] - right[0], left[1] - right[1]);
const normalize = (vector) => {
  const magnitude = norm(vector);
  return magnitude <= EPSILON ? vector.map((_, index) => (index === 0 ? 1 : 0)) : vector.map((value) => value / magnitude);
};
function meanVector(vectors) {
  const total = new Array(vectors[0].length).fill(0);
  for (const vector of vectors) for (let index = 0; index < total.length; index += 1) total[index] += vector[index];
  return total.map((value) => value / vectors.length);
}
function covarianceMatrix(vectors, mean) {
  const dimension = mean.length;
  const matrix = Array.from({ length: dimension }, () => new Array(dimension).fill(0));
  for (const vector of vectors) {
    const centered = sub(vector, mean);
    for (let row = 0; row < dimension; row += 1) {
      for (let column = 0; column < dimension; column += 1) matrix[row][column] += centered[row] * centered[column];
    }
  }
  const denominator = Math.max(vectors.length - 1, 1);
  return matrix.map((row) => row.map((value) => value / denominator));
}
const multiplyMatrixVector = (matrix, vector) => matrix.map((row) => dot(row, vector));
const subtractMatrices = (left, right) => left.map((row, i) => row.map((value, j) => value - right[i][j]));
const outer = (vector, scalar = 1) => vector.map((rowValue) => vector.map((columnValue) => rowValue * columnValue * scalar));
const fallbackAxis = (dimension, seed) => new Array(dimension).fill(0).map((_, index) => (index === seed % dimension ? 1 : 0));
function powerIteration(matrix, iterations = 40, seedVector = null) {
  let vector = normalize(seedVector ?? fallbackAxis(matrix.length, 0));
  for (let index = 0; index < iterations; index += 1) {
    const candidate = multiplyMatrixVector(matrix, vector);
    const magnitude = norm(candidate);
    if (magnitude <= EPSILON) return { vector: fallbackAxis(matrix.length, index + 1), eigenvalue: 0 };
    vector = candidate.map((value) => value / magnitude);
  }
  const transformed = multiplyMatrixVector(matrix, vector);
  return { vector, eigenvalue: dot(vector, transformed) };
}
function principalAxes(matrix) {
  const first = powerIteration(matrix, 56, fallbackAxis(matrix.length, 0));
  const deflated = subtractMatrices(matrix, outer(first.vector, first.eigenvalue));
  const secondSeed = normalize(sub(fallbackAxis(matrix.length, 1), scale(first.vector, dot(fallbackAxis(matrix.length, 1), first.vector))));
  const second = powerIteration(deflated, 56, secondSeed);
  return { axisX: normalize(first.vector), axisY: normalize(second.vector), eigenvalues: [first.eigenvalue, second.eigenvalue] };
}
function rotate2D(point, angle) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [point[0] * cosine - point[1] * sine, point[0] * sine + point[1] * cosine];
}
const inverseRotate2D = (point, angle) => rotate2D(point, -angle);
function softmax(values, temperature = 1) {
  const safeTemperature = Math.max(temperature, EPSILON);
  const scaled = values.map((value) => value / safeTemperature);
  const maxValue = Math.max(...scaled);
  const exponents = scaled.map((value) => Math.exp(value - maxValue));
  const denominator = Math.max(sum(exponents), EPSILON);
  return exponents.map((value) => value / denominator);
}
function weightedAverage(vectors, weights) {
  const output = new Array(vectors[0].length).fill(0);
  for (let vectorIndex = 0; vectorIndex < vectors.length; vectorIndex += 1) {
    for (let dimensionIndex = 0; dimensionIndex < output.length; dimensionIndex += 1) {
      output[dimensionIndex] += vectors[vectorIndex][dimensionIndex] * weights[vectorIndex];
    }
  }
  return output;
}
const inferConicType = (eccentricity) => {
  if (Math.abs(eccentricity - 1) <= 1e-6) return CONIC_TYPES.PARABOLA;
  return eccentricity < 1 ? CONIC_TYPES.ELLIPSE : CONIC_TYPES.HYPERBOLA;
};
function deterministicMatrix(rows, columns, phase) {
  return Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => {
    const angle = (row + 1) * GOLDEN_ANGLE + (column + 1) * INV_PHI + phase;
    return Math.sin(angle) * 0.55 + Math.cos(angle * PHI) * 0.45;
  }));
}
export class ConicSection {
  constructor({
    type,
    eccentricity = GOLDEN_ECCENTRICITY,
    semiMajorAxis = DEFAULT_SEMI_MAJOR_AXIS,
    center = [0, 0],
    orientation = 0,
    focalParameter,
  } = {}) {
    assertFiniteNumber('eccentricity', eccentricity);
    assertFiniteNumber('semiMajorAxis', semiMajorAxis);
    assertVector('center', center, 2);
    this.type = type ?? inferConicType(eccentricity);
    this.eccentricity = this.type === CONIC_TYPES.PARABOLA ? 1 : eccentricity;
    this.semiMajorAxis = semiMajorAxis;
    this.center = [...center];
    this.orientation = orientation;
    this.focalParameter = focalParameter ?? semiMajorAxis / (1 + this.eccentricity);
    this.validate();
    this.semiMinorAxis = this.computeSemiMinorAxis();
    this.linearEccentricity = this.computeLinearEccentricity();
    this.foci = this.computeFoci();
    this.directrix = this.computeDirectrix();
  }
  validate() {
    if (this.type === CONIC_TYPES.ELLIPSE && !(this.eccentricity > 0 && this.eccentricity < 1)) {
      throw new RangeError('Ellipse eccentricity must satisfy 0 < e < 1.');
    }
    if (this.type === CONIC_TYPES.HYPERBOLA && !(this.eccentricity > 1)) {
      throw new RangeError('Hyperbola eccentricity must satisfy e > 1.');
    }
  }
  computeSemiMinorAxis() {
    if (this.type === CONIC_TYPES.ELLIPSE) return this.semiMajorAxis * Math.sqrt(1 - this.eccentricity ** 2);
    if (this.type === CONIC_TYPES.HYPERBOLA) return this.semiMajorAxis * Math.sqrt(this.eccentricity ** 2 - 1);
    return null;
  }
  computeLinearEccentricity() {
    return this.type === CONIC_TYPES.PARABOLA ? this.focalParameter : this.semiMajorAxis * this.eccentricity;
  }
  localToWorld(point) {
    assertVector('point', point, 2);
    const rotated = rotate2D(point, this.orientation);
    return [rotated[0] + this.center[0], rotated[1] + this.center[1]];
  }
  worldToLocal(point) {
    assertVector('point', point, 2);
    return inverseRotate2D([point[0] - this.center[0], point[1] - this.center[1]], this.orientation);
  }
  computeFoci() {
    if (this.type === CONIC_TYPES.PARABOLA) return [this.localToWorld([this.focalParameter, 0])];
    return [this.localToWorld([-this.linearEccentricity, 0]), this.localToWorld([this.linearEccentricity, 0])];
  }
  computeDirectrix() {
    const normal = rotate2D([1, 0], this.orientation);
    if (this.type === CONIC_TYPES.PARABOLA) {
      return { anchor: this.localToWorld([-this.focalParameter, 0]), normal, signedOffsets: [-this.focalParameter] };
    }
    const offset = this.semiMajorAxis / this.eccentricity;
    return { anchor: this.localToWorld([offset, 0]), normal, signedOffsets: [-offset, offset] };
  }
  pointAt(parameter) {
    assertFiniteNumber('parameter', parameter);
    if (this.type === CONIC_TYPES.ELLIPSE) {
      return this.localToWorld([this.semiMajorAxis * Math.cos(parameter), this.semiMinorAxis * Math.sin(parameter)]);
    }
    if (this.type === CONIC_TYPES.HYPERBOLA) {
      return this.localToWorld([this.semiMajorAxis * Math.cosh(parameter), this.semiMinorAxis * Math.sinh(parameter)]);
    }
    return this.localToWorld([this.focalParameter * parameter ** 2, 2 * this.focalParameter * parameter]);
  }
  focalDistances(point) {
    return this.foci.map((focus) => distance2D(point, focus));
  }
  directrixDistance(point) {
    const local = this.worldToLocal(point);
    return Math.min(...this.directrix.signedOffsets.map((offset) => Math.abs(local[0] - offset)));
  }
  eccentricityResidual(point) {
    const focalDistance = this.focalDistances(point)[0] ?? 0;
    const directrixDistance = Math.max(this.directrixDistance(point), EPSILON);
    return Math.abs(focalDistance / directrixDistance - this.eccentricity);
  }
  focusWeights(point, focusPositions = this.foci) {
    const target = this.type === CONIC_TYPES.ELLIPSE ? 2 * this.semiMajorAxis : this.semiMajorAxis * (1 + this.eccentricity);
    const raw = focusPositions.map((position) => Math.max(EPSILON, target - distance2D(point, position)));
    const denominator = Math.max(sum(raw), EPSILON);
    return raw.map((value) => value / denominator);
  }
  toJSON() {
    return { type: this.type, eccentricity: this.eccentricity, semiMajorAxis: this.semiMajorAxis, semiMinorAxis: this.semiMinorAxis, linearEccentricity: this.linearEccentricity, center: [...this.center], orientation: this.orientation, foci: this.foci.map((focus) => [...focus]), directrix: { anchor: [...this.directrix.anchor], normal: [...this.directrix.normal], signedOffsets: [...this.directrix.signedOffsets] } };
  }
}
export class AstrolabeProjection {
  constructor({ inputDimension, samples = [], center = null, basisVectors = null, scale: projectionScale = 1 } = {}) {
    this.inputDimension = inputDimension ?? samples[0]?.length ?? basisVectors?.[0]?.length ?? null;
    this.scale = projectionScale;
    this.center = center ? [...center] : null;
    this.basisVectors = basisVectors ? basisVectors.map((vector) => normalize(vector)) : null;
    this.eigenvalues = [1, 1];
    if (samples.length > 0) this.fit(samples);
  }
  fit(samples) {
    if (!Array.isArray(samples) || samples.length === 0) throw new TypeError('samples must be a non-empty array.');
    samples.forEach((sample, index) => assertVector(`samples[${index}]`, sample));
    this.inputDimension = samples[0].length;
    this.center = meanVector(samples);
    const covariance = covarianceMatrix(samples, this.center);
    const { axisX, axisY, eigenvalues } = principalAxes(covariance);
    this.basisVectors = [axisX, axisY];
    this.eigenvalues = eigenvalues;
    return this;
  }
  fitFromExperts(experts) {
    return this.fit(experts.map((expert) => expert.signature));
  }
  project(vector) {
    assertVector('vector', vector, this.inputDimension);
    if (!this.center || !this.basisVectors) {
      this.center = new Array(vector.length).fill(0);
      this.basisVectors = [fallbackAxis(vector.length, 0), fallbackAxis(vector.length, 1)];
    }
    const centered = sub(vector, this.center);
    return [dot(centered, this.basisVectors[0]) * this.scale, dot(centered, this.basisVectors[1]) * this.scale];
  }
  reconstruct(point) {
    assertVector('point', point, 2);
    const xComponent = scale(this.basisVectors[0], point[0] / this.scale);
    const yComponent = scale(this.basisVectors[1], point[1] / this.scale);
    return add(add(this.center, xComponent), yComponent);
  }
  diagnostics() {
    return { inputDimension: this.inputDimension, center: this.center ? [...this.center] : null, basisVectors: this.basisVectors ? this.basisVectors.map((vector) => [...vector]) : null, eigenvalues: [...this.eigenvalues], scale: this.scale };
  }
}
export class HypatiaExpert {
  constructor({
    id,
    position,
    focusIndex = 0,
    layerIndex = 0,
    inputDimension,
    outputDimension = inputDimension,
    gain = 1,
    bandwidth = DEFAULT_BANDWIDTH,
    phase = 0,
    prior = 1,
    bias = null,
    transformMatrix = null,
    signature = null,
  } = {}) {
    if (!id) throw new TypeError('HypatiaExpert requires an id.');
    assertVector('position', position, 2);
    assertFiniteNumber('inputDimension', inputDimension);
    assertFiniteNumber('outputDimension', outputDimension);
    this.id = id;
    this.position = [...position];
    this.focusIndex = focusIndex;
    this.layerIndex = layerIndex;
    this.inputDimension = inputDimension;
    this.outputDimension = outputDimension;
    this.gain = gain;
    this.bandwidth = bandwidth;
    this.phase = phase;
    this.prior = prior;
    this.bias = bias ? [...bias] : new Array(outputDimension).fill(0);
    this.transformMatrix = transformMatrix ?? deterministicMatrix(outputDimension, inputDimension, phase + focusIndex * INV_PHI);
    this.signature = signature ?? normalize(new Array(inputDimension).fill(0).map((_, index) =>
      Math.sin((index + 1) * GOLDEN_ANGLE + phase) + Math.cos((focusIndex + 1) * (index + 1) * INV_PHI + phase),
    ));
  }
  compute(inputVector, context = {}) {
    assertVector('inputVector', inputVector, this.inputDimension);
    const projectedPoint = context.projectedPoint ?? [0, 0];
    const routingScore = context.routingScore ?? 1;
    const layerIndex = context.layerIndex ?? this.layerIndex;
    const conic = context.conic;
    const linear = multiplyMatrixVector(this.transformMatrix, inputVector);
    const signatureAlignment = dot(normalize(inputVector), this.signature);
    const focusDistance = distance2D(projectedPoint, this.position);
    const gaussianEnvelope = Math.exp(-(focusDistance ** 2) / (2 * this.bandwidth ** 2));
    const conicAgreement = conic ? 1 / (1 + conic.eccentricityResidual(projectedPoint)) : 1;
    const harmonic = 1 + 0.35 * Math.sin((layerIndex + 1) * focusDistance + this.phase) + 0.15 * Math.cos((this.focusIndex + 1) * GOLDEN_ANGLE + this.phase);
    const output = linear.map((value, index) => {
      const nonlinear = Math.tanh(value * this.gain + signatureAlignment * this.signature[index % this.signature.length]);
      return (0.65 * value + 0.35 * nonlinear) * gaussianEnvelope * conicAgreement * routingScore * harmonic + this.bias[index];
    });
    return { expert: this, output, activation: gaussianEnvelope * conicAgreement * routingScore, distance: focusDistance, signatureAlignment };
  }
}
export class EllipticFusion {
  constructor({ conic = new ConicSection(), temperature = DEFAULT_ROUTING_TEMPERATURE, sharpness = 1, minimumWeight = 1e-6 } = {}) {
    this.conic = conic;
    this.temperature = temperature;
    this.sharpness = sharpness;
    this.minimumWeight = minimumWeight;
  }
  computeWeights(projectedPoint, experts, routingScores = []) {
    assertVector('projectedPoint', projectedPoint, 2);
    if (!Array.isArray(experts) || experts.length === 0) throw new TypeError('experts must be a non-empty array.');
    const span = this.conic.type === CONIC_TYPES.ELLIPSE ? 2 * this.conic.semiMajorAxis : this.conic.semiMajorAxis * (1 + this.conic.eccentricity);
    const exponent = 1 + this.sharpness * this.conic.eccentricity;
    const raw = experts.map((expert, index) => {
      const geometric = Math.max(this.minimumWeight, span - distance2D(projectedPoint, expert.position));
      const routed = routingScores[index] ?? 1;
      return Math.max(this.minimumWeight, geometric ** exponent * routed * (expert.prior ?? 1));
    });
    return softmax(raw.map((value) => Math.log(Math.max(value, this.minimumWeight))), this.temperature);
  }
  fuse(outputs, weights) {
    if (!Array.isArray(outputs) || outputs.length === 0) throw new TypeError('outputs must be a non-empty array.');
    outputs.forEach((output, index) => assertVector(`outputs[${index}]`, output, outputs[0].length));
    return weightedAverage(outputs, weights);
  }
  fuseExperts(projectedPoint, expertResults, routingScores = []) {
    const weights = this.computeWeights(projectedPoint, expertResults.map((result) => result.expert), routingScores);
    return {
      output: this.fuse(expertResults.map((result) => result.output), weights),
      weights,
      diagnostics: expertResults.map((result, index) => ({ expertId: result.expert.id, weight: weights[index], activation: result.activation, distance: result.distance })),
    };
  }
}
export class EccentricityLadder {
  constructor({ depth = DEFAULT_LAYER_COUNT, baseSemiMajorAxis = DEFAULT_SEMI_MAJOR_AXIS, center = [0, 0], orientation = 0, eccentricities = null } = {}) {
    this.depth = depth;
    this.eccentricities = eccentricities ?? Array.from({ length: depth }, (_, index) => PHI ** -(index + 1));
    this.layers = this.eccentricities.map((eccentricity, index) => new ConicSection({
      type: CONIC_TYPES.ELLIPSE,
      eccentricity,
      semiMajorAxis: baseSemiMajorAxis * (1 + index * 0.35),
      center,
      orientation,
    }));
  }
  getLayer(index) {
    return this.layers[index];
  }
  selectLayer(projectedPoint) {
    assertVector('projectedPoint', projectedPoint, 2);
    const residuals = this.layers.map((conic) => {
      const focalConstraint = Math.abs(sum(conic.focalDistances(projectedPoint)) - 2 * conic.semiMajorAxis);
      return focalConstraint + conic.eccentricityResidual(projectedPoint);
    });
    let bestIndex = 0;
    for (let index = 1; index < residuals.length; index += 1) if (residuals[index] < residuals[bestIndex]) bestIndex = index;
    return { index: bestIndex, conic: this.layers[bestIndex], residual: residuals[bestIndex], residuals };
  }
  toJSON() {
    return this.layers.map((layer, index) => ({ index, ...layer.toJSON() }));
  }
}
export class MoEHypatia {
  constructor({
    inputDimension,
    outputDimension = inputDimension,
    experts = null,
    expertCount,
    ladderDepth = DEFAULT_LAYER_COUNT,
    semiMajorAxis = DEFAULT_SEMI_MAJOR_AXIS,
    orientation = 0,
    projectionSamples = [],
    projectionOptions = {},
    fusionOptions = {},
    routingTemperature = DEFAULT_ROUTING_TEMPERATURE,
  } = {}) {
    assertFiniteNumber('inputDimension', inputDimension);
    assertFiniteNumber('outputDimension', outputDimension);
    this.inputDimension = inputDimension;
    this.outputDimension = outputDimension;
    this.routingTemperature = routingTemperature;
    this.ladder = new EccentricityLadder({ depth: ladderDepth, baseSemiMajorAxis: semiMajorAxis, orientation });
    this.experts = experts ? this.hydrateExperts(experts) : this.buildDefaultExperts(expertCount ?? ladderDepth * 2);
    this.projector = new AstrolabeProjection({ inputDimension, samples: projectionSamples, ...projectionOptions });
    if (!projectionSamples.length) this.projector.fitFromExperts(this.experts);
    this.fusion = new EllipticFusion({ conic: this.ladder.getLayer(0), temperature: routingTemperature, ...fusionOptions });
  }
  hydrateExperts(experts) {
    return experts.map((expert, index) => {
      if (expert instanceof HypatiaExpert) return expert;
      const layer = this.ladder.getLayer(expert.layerIndex ?? 0);
      const position = expert.position ?? layer.foci[expert.focusIndex ?? 0] ?? layer.pointAt((index + 1) * INV_PHI);
      return new HypatiaExpert({
        ...expert,
        id: expert.id ?? `hypatia-expert-${index}`,
        position,
        inputDimension: expert.inputDimension ?? this.inputDimension,
        outputDimension: expert.outputDimension ?? this.outputDimension,
      });
    });
  }
  buildDefaultExperts(expertCount) {
    const experts = [];
    for (let index = 0; index < expertCount; index += 1) {
      const layerIndex = index % this.ladder.depth;
      const layer = this.ladder.getLayer(layerIndex);
      const focusIndex = index % layer.foci.length;
      experts.push(new HypatiaExpert({ id: `hypatia-expert-${index}`, position: layer.foci[focusIndex], focusIndex, layerIndex, inputDimension: this.inputDimension, outputDimension: this.outputDimension, gain: 1 + layer.eccentricity * 0.5, bandwidth: 0.85 + layerIndex * 0.25, phase: index * INV_PHI, prior: 1 + (focusIndex === 0 ? INV_PHI : PHI - 1) }));
    }
    return experts;
  }
  routeToFoci(projectedPoint, conic, candidateExperts) {
    const focusWeights = conic.focusWeights(projectedPoint);
    const logits = candidateExperts.map((expert) => {
      const distancePenalty = distance2D(projectedPoint, expert.position) / Math.max(expert.bandwidth, EPSILON);
      const focalPrior = focusWeights[expert.focusIndex] ?? 1 / candidateExperts.length;
      return -distancePenalty + Math.log(Math.max(focalPrior * expert.prior, EPSILON));
    });
    const scores = softmax(logits, this.routingTemperature);
    return candidateExperts.map((expert, index) => ({ expert, score: scores[index], distance: distance2D(projectedPoint, expert.position) }));
  }
  infer(inputVector, { topK = null, layerIndex = null } = {}) {
    assertVector('inputVector', inputVector, this.inputDimension);
    const projectedPoint = this.projector.project(inputVector);
    const selectedLayer = layerIndex == null ? this.ladder.selectLayer(projectedPoint) : { index: layerIndex, conic: this.ladder.getLayer(layerIndex), residual: 0, residuals: [] };
    const layerExperts = this.experts.filter((expert) => expert.layerIndex === selectedLayer.index);
    const candidates = layerExperts.length > 0 ? layerExperts : this.experts;
    const routing = this.routeToFoci(projectedPoint, selectedLayer.conic, candidates).sort((left, right) => right.score - left.score);
    const activeCount = clamp(topK ?? Math.min(4, routing.length), 1, routing.length);
    const active = routing.slice(0, activeCount);
    const expertResults = active.map(({ expert, score }) => expert.compute(inputVector, { projectedPoint, routingScore: score, layerIndex: selectedLayer.index, conic: selectedLayer.conic }));
    this.fusion.conic = selectedLayer.conic;
    const fused = this.fusion.fuseExperts(projectedPoint, expertResults, active.map((entry) => entry.score));
    return { output: fused.output, projectedPoint, layerIndex: selectedLayer.index, conic: selectedLayer.conic.toJSON(), weights: fused.weights, routing: active.map((entry, index) => ({ expertId: entry.expert.id, score: entry.score, distance: entry.distance, fusionWeight: fused.weights[index] })), diagnostics: { layerResidual: selectedLayer.residual, projector: this.projector.diagnostics(), expertDiagnostics: fused.diagnostics } };
  }
  forward(inputVector, options) {
    return this.infer(inputVector, options);
  }
}
export default MoEHypatia;
