///
/// @medina/moe-thales — MIXTURE OF EXPERTS: THALES
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║     THALES — FIRST-PRINCIPLES EXPERT DECOMPOSITION via THALES' THEOREMS    ║
/// ║                                                                              ║
/// ║  Named for Thales of Miletus — father of deductive reasoning.               ║
/// ║                                                                              ║
/// ║  Architecture: Hierarchical MoE that decomposes inputs into first           ║
/// ║  principles, routes each principle to a specialist expert, then             ║
/// ║  recomposes via Thales' proportionality theorem.                            ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Thales' theorem: angle in semicircle = 90° → orthogonal decomposition  ║
/// ║    • Intercept theorem: parallel cuts give proportional segments             ║
/// ║      DE/BC = AD/AB = AE/AC — expert contribution proportionality           ║
/// ║    • Basic proportionality: if DE ∥ BC, then AD/DB = AE/EC                  ║
/// ║    • φ-decomposition: input = Σ φⁿ·principleₙ (golden series expansion)    ║
/// ║    • Orthogonal expert axes: experts lie on perpendicular decomposition     ║
/// ║    • Recomposition: output = Σ (proportion_k · expert_k(principle_k))       ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PI = Math.PI;
export const TAU = Math.PI * 2;
export const HALF_PI = Math.PI / 2;
export const PHI = (1 + Math.sqrt(5)) / 2;
export const INV_PHI = 1 / PHI;
export const PHI_SQUARED = PHI * PHI;
export const GOLDEN_ANGLE = TAU * (1 - INV_PHI);
export const EPSILON = 1e-9;
export const DEFAULT_FEATURE_DIMENSIONS = 12;
export const DEFAULT_MAX_PRINCIPLES = 5;

const PRINCIPLE_LABELS = ['magnitude', 'direction', 'symmetry', 'curvature', 'entropy', 'cadence', 'contrast', 'stability', 'resonance', 'dispersion', 'coupling', 'closure'];

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
const sum = values => values.reduce((total, value) => total + value, 0);
const mean = values => (values.length ? sum(values) / values.length : 0);
const zeroVector = length => Array.from({ length }, () => 0);
const isFiniteNumber = value => Number.isFinite(value) && !Number.isNaN(value);
const dot = (a, b) => a.reduce((total, value, index) => total + value * (b[index] || 0), 0);
const l2Norm = vector => Math.sqrt(dot(vector, vector));
const scaleVector = (vector, scalar) => vector.map(value => value * scalar);
const addVectors = (a, b) => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0));
const subtractVectors = (a, b) => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) - (b[i] || 0));
const variance = values => (values.length ? mean(values.map(value => (value - mean(values)) ** 2)) : 0);
const centerVector = vector => vector.map(value => value - mean(vector));
const normalize = vector => {
  const norm = l2Norm(vector);
  return norm <= EPSILON ? zeroVector(vector.length) : vector.map(value => value / norm);
};

function cosineSimilarity(a, b) {
  const denominator = l2Norm(a) * l2Norm(b);
  return denominator <= EPSILON ? 0 : dot(a, b) / denominator;
}

function angleBetween(a, b) {
  return Math.acos(clamp(cosineSimilarity(a, b), -1, 1));
}

function projectOnto(vector, axis) {
  const unitAxis = normalize(axis);
  return scaleVector(unitAxis, dot(vector, unitAxis));
}

function gramSchmidt(candidate, basis) {
  let orthogonal = candidate.slice();
  for (const axis of basis) orthogonal = subtractVectors(orthogonal, projectOnto(orthogonal, axis));
  return orthogonal;
}

function pairwiseOrthogonality(axes) {
  return axes.map((axis, row) => axes.map((other, column) => (row === column ? 1 : cosineSimilarity(axis, other))));
}

function localCurvature(vector) {
  if (vector.length < 3) return 0;
  let curvature = 0;
  for (let index = 1; index < vector.length - 1; index += 1) curvature += Math.abs(vector[index + 1] - 2 * vector[index] + vector[index - 1]);
  return curvature / (vector.length - 2);
}

function canonicalBasis(length, offset) {
  return Array.from({ length }, (_, index) => (index === offset ? 1 : 0));
}

function principleLabel(index) {
  return PRINCIPLE_LABELS[index] || `principle_${index + 1}`;
}

function flattenNumericSignal(value, bucket = [], depth = 0) {
  if (depth > 6 || bucket.length >= 256) return bucket;
  if (isFiniteNumber(value)) {
    bucket.push(value);
    return bucket;
  }
  if (typeof value === 'string') {
    for (let index = 0; index < value.length && bucket.length < 256; index += 1) {
      const code = value.charCodeAt(index) / 127;
      bucket.push(code * Math.sin((index + 1) * INV_PHI));
      bucket.push(code * Math.cos((index + 1) / PHI));
    }
    bucket.push(value.length / PHI_SQUARED);
    return bucket;
  }
  if (typeof value === 'boolean') {
    bucket.push(value ? 1 : -1);
    return bucket;
  }
  if (Array.isArray(value)) {
    value.forEach(item => flattenNumericSignal(item, bucket, depth + 1));
    bucket.push(value.length * INV_PHI);
    return bucket;
  }
  if (value && typeof value === 'object') {
    Object.keys(value).sort().forEach((key, index) => {
      flattenNumericSignal(key, bucket, depth + 1);
      flattenNumericSignal(value[key], bucket, depth + 1);
      bucket.push((index + 1) * INV_PHI);
    });
    bucket.push(Object.keys(value).length / PHI);
    return bucket;
  }
  bucket.push(0);
  return bucket;
}

function encodeScalars(scalars, dimensions) {
  const usable = scalars.length ? scalars : [0];
  const vector = zeroVector(dimensions);
  for (let dimension = 0; dimension < dimensions; dimension += 1) {
    let accumulator = 0;
    for (let index = 0; index < usable.length; index += 1) {
      const scalar = usable[index];
      const angle = ((dimension + 1) * (index + 1) * GOLDEN_ANGLE) / (usable.length + 1);
      const harmonic = Math.sin(angle) + Math.cos(angle * INV_PHI);
      accumulator += scalar * harmonic / (1 + index * INV_PHI);
    }
    vector[dimension] = accumulator / usable.length;
  }
  const centered = centerVector(vector);
  const enriched = centered.map((value, index) => {
    const forward = centered[(index + 1) % centered.length] || 0;
    const backward = centered[(index - 1 + centered.length) % centered.length] || 0;
    return value + (forward - 2 * value + backward) * INV_PHI;
  });
  return normalize(enriched);
}

function stableSignalFromInput(input, dimensions = DEFAULT_FEATURE_DIMENSIONS) {
  return encodeScalars(flattenNumericSignal(input), dimensions);
}

function harmonicAxis(order, dimensions) {
  const axis = Array.from({ length: dimensions }, (_, index) => {
    const theta = ((index + 0.5) * PI) / dimensions;
    const primary = Math.sin((order + 1) * theta);
    const intercept = Math.cos((order + 0.5) * theta * INV_PHI);
    const golden = Math.sin((order + 1) * (index + 1) * GOLDEN_ANGLE / dimensions);
    return primary + intercept * INV_PHI + golden / PHI_SQUARED;
  });
  return normalize(axis);
}

export class PrincipleDecomposer {
  constructor({ featureDimensions = DEFAULT_FEATURE_DIMENSIONS, maxPrinciples = DEFAULT_MAX_PRINCIPLES, significanceThreshold = 0.01 } = {}) {
    this.featureDimensions = featureDimensions;
    this.maxPrinciples = maxPrinciples;
    this.significanceThreshold = significanceThreshold;
  }

  toFeatureVector(input) {
    return stableSignalFromInput(input, this.featureDimensions);
  }

  buildOrthogonalAxes(dimensions) {
    const basis = [];
    const candidates = [];
    for (let order = 0; order < Math.max(dimensions, this.maxPrinciples * 2); order += 1) candidates.push(harmonicAxis(order, dimensions));
    for (let index = 0; index < dimensions; index += 1) candidates.push(canonicalBasis(dimensions, index));
    for (const candidate of candidates) {
      const axis = normalize(gramSchmidt(candidate, basis));
      if (l2Norm(axis) <= EPSILON) continue;
      basis.push(axis);
      if (basis.length >= this.maxPrinciples) break;
    }
    return basis.length ? basis : [canonicalBasis(dimensions, 0)];
  }

  decompose(input, context = {}) {
    const sourceVector = this.toFeatureVector(input);
    const axes = this.buildOrthogonalAxes(sourceVector.length);
    const sourceEnergy = dot(sourceVector, sourceVector) || 1;
    const principles = axes.map((axis, index) => {
      const coefficient = dot(sourceVector, axis);
      const magnitude = Math.abs(coefficient);
      const phiWeight = Math.pow(INV_PHI, index);
      const projectionVector = scaleVector(axis, coefficient);
      const energy = dot(projectionVector, projectionVector);
      return {
        index,
        label: principleLabel(index),
        axis,
        coefficient,
        magnitude,
        phiWeight,
        weightedMagnitude: magnitude * phiWeight,
        projectionVector,
        sourceVector,
        energy,
        angle: angleBetween(sourceVector, axis),
        curvature: localCurvature(projectionVector),
      };
    }).filter(principle => principle.weightedMagnitude >= this.significanceThreshold);

    const activePrinciples = principles.length ? principles : [{
      index: 0,
      label: principleLabel(0),
      axis: normalize(sourceVector),
      coefficient: l2Norm(sourceVector),
      magnitude: l2Norm(sourceVector),
      phiWeight: 1,
      weightedMagnitude: l2Norm(sourceVector),
      projectionVector: sourceVector.slice(),
      sourceVector,
      energy: sourceEnergy,
      angle: 0,
      curvature: localCurvature(sourceVector),
    }];

    const totalWeightedEnergy = sum(activePrinciples.map(principle => principle.energy * principle.phiWeight)) || 1;
    activePrinciples.forEach(principle => {
      principle.proportion = (principle.energy * principle.phiWeight) / totalWeightedEnergy;
      principle.normalizedContribution = principle.energy / sourceEnergy;
      principle.metadata = { theorem: 'semicircle-orthogonality', context };
    });

    const explainedVector = activePrinciples.reduce((vector, principle) => addVectors(vector, principle.projectionVector), zeroVector(sourceVector.length));
    const residualVector = subtractVectors(sourceVector, explainedVector);
    const residualNorm = l2Norm(residualVector);

    return {
      input,
      sourceVector,
      signalNorm: l2Norm(sourceVector),
      sourceEnergy,
      principles: activePrinciples,
      explainedVector,
      residualVector,
      residualNorm,
      decompositionQuality: clamp(1 - residualNorm / (l2Norm(sourceVector) + EPSILON), 0, 1),
      orthogonalityMatrix: pairwiseOrthogonality(axes),
      theorem: 'thales-semicircle-decomposition',
    };
  }
}

export class ThalesExpert {
  constructor({ name, principleIndex = 0, specializationVector, gain = 1, bias = 0, readiness = 1, transform = null } = {}) {
    this.name = name || `thales_expert_${principleLabel(principleIndex)}`;
    this.principleIndex = principleIndex;
    this.specializationVector = specializationVector || [];
    this.gain = gain;
    this.bias = bias;
    this.readiness = readiness;
    this.transform = transform;
  }

  static specializationFor(principleIndex, dimensions) {
    const anchor = canonicalBasis(dimensions, principleIndex % dimensions);
    const harmonic = harmonicAxis(principleIndex, dimensions);
    return normalize(addVectors(scaleVector(harmonic, PHI), anchor));
  }

  fitToDimensions(dimensions) {
    if (this.specializationVector.length !== dimensions) this.specializationVector = ThalesExpert.specializationFor(this.principleIndex, dimensions);
  }

  defaultTransform(principle, affinity) {
    const density = principle.magnitude / (principle.axis.length || 1);
    const curvatureGain = principle.curvature * INV_PHI;
    const score = this.gain * (principle.coefficient * (0.5 + 0.5 * affinity) + principle.proportion * PHI + density + curvatureGain) + this.bias;
    const vector = scaleVector(addVectors(principle.projectionVector, scaleVector(this.specializationVector, principle.proportion)), this.gain * (0.5 + 0.5 * affinity));
    const confidence = clamp((0.4 + 0.6 * affinity) * this.readiness * (1 - principle.angle / HALF_PI), 0, 1);
    return { score, vector, confidence, metrics: { affinity, density, curvature: principle.curvature } };
  }

  evaluate(principle, context = {}) {
    this.fitToDimensions(principle.axis.length);
    const affinity = clamp((cosineSimilarity(principle.axis, this.specializationVector) + 1) / 2, 0, 1);
    const raw = this.transform ? this.transform({ principle, affinity, expert: this, context }) : this.defaultTransform(principle, affinity);
    return {
      expert: this.name,
      principle: principle.label,
      principleIndex: principle.index,
      score: isFiniteNumber(raw?.score) ? raw.score : 0,
      vector: Array.isArray(raw?.vector) ? raw.vector.slice(0, principle.axis.length) : zeroVector(principle.axis.length),
      confidence: clamp(raw?.confidence ?? affinity * this.readiness, 0, 1),
      affinity,
      readiness: this.readiness,
      metrics: raw?.metrics || {},
      theorem: 'expert-axis-specialization',
    };
  }
}

export class InterceptRouter {
  constructor({ experts = [], routesPerPrinciple = 2, minAffinity = 0.05 } = {}) {
    this.experts = experts;
    this.routesPerPrinciple = routesPerPrinciple;
    this.minAffinity = minAffinity;
  }

  registerExpert(expert) {
    this.experts.push(expert);
    return this;
  }

  interceptScore(principle, expert) {
    expert.fitToDimensions(principle.axis.length);
    const affinity = clamp((cosineSimilarity(principle.axis, expert.specializationVector) + 1) / 2, 0, 1);
    const distancePenalty = Math.pow(INV_PHI, Math.abs(principle.index - expert.principleIndex));
    const theoremRatio = principle.proportion * affinity * expert.readiness * distancePenalty;
    const interceptRatio = theoremRatio / (principle.magnitude + EPSILON);
    return { expert, affinity, distancePenalty, theoremRatio, interceptRatio };
  }

  route(decomposition, context = {}) {
    const assignments = decomposition.principles.map(principle => {
      const candidates = this.experts.map(expert => this.interceptScore(principle, expert)).filter(route => route.affinity >= this.minAffinity).sort((a, b) => b.theoremRatio - a.theoremRatio).slice(0, this.routesPerPrinciple);
      const fallback = candidates.length ? candidates : [this.interceptScore(principle, new ThalesExpert({ principleIndex: principle.index }))];
      const totalRatio = sum(fallback.map(route => route.theoremRatio)) || 1;
      const routes = fallback.map(route => ({ ...route, proportion: route.theoremRatio / totalRatio }));
      return { principle, routes, dominantExpert: routes[0]?.expert.name || null, theorem: 'intercept-proportional-routing', context };
    });

    const expertLoads = assignments.reduce((loads, assignment) => {
      assignment.routes.forEach(route => {
        loads[route.expert.name] = (loads[route.expert.name] || 0) + route.proportion * assignment.principle.proportion;
      });
      return loads;
    }, {});

    return { assignments, expertLoads, theorem: 'thales-intercept-router' };
  }
}

export class ProportionalRecomposer {
  constructor({ residualPenaltyFactor = 0.25 } = {}) {
    this.residualPenaltyFactor = residualPenaltyFactor;
  }

  recompose(executions, decomposition, context = {}) {
    const aggregateVector = zeroVector(decomposition.sourceVector.length);
    const contributions = [];
    let totalWeight = 0;
    let scalarAccumulator = 0;
    let confidenceAccumulator = 0;

    executions.forEach(execution => {
      execution.results.forEach(result => {
        const weight = execution.principle.proportion * result.route.proportion * result.output.confidence;
        totalWeight += weight;
        scalarAccumulator += result.output.score * weight;
        confidenceAccumulator += result.output.confidence * weight;
        for (let index = 0; index < aggregateVector.length; index += 1) aggregateVector[index] += (result.output.vector[index] || 0) * weight;
        contributions.push({ principle: execution.principle.label, expert: result.output.expert, weight, score: result.output.score, confidence: result.output.confidence });
      });
    });

    contributions.sort((a, b) => b.weight - a.weight);
    const normalizedWeight = totalWeight || 1;
    const residualPenalty = decomposition.residualNorm / (decomposition.signalNorm + EPSILON) * this.residualPenaltyFactor;
    const coherence = clamp(1 - residualPenalty, 0, 1);

    return {
      output: {
        score: scalarAccumulator / normalizedWeight,
        vector: aggregateVector.map(value => value / normalizedWeight),
        confidence: clamp((confidenceAccumulator / normalizedWeight) * coherence, 0, 1),
        dominantExpert: contributions[0]?.expert || null,
        dominantPrinciple: contributions[0]?.principle || null,
      },
      contributions,
      coherence,
      residualPenalty,
      theorem: 'basic-proportional-recomposition',
      context,
    };
  }
}

export class MoEThales {
  constructor({ featureDimensions = DEFAULT_FEATURE_DIMENSIONS, maxPrinciples = DEFAULT_MAX_PRINCIPLES, routesPerPrinciple = 2, experts = [], decomposer, router, recomposer } = {}) {
    this.featureDimensions = featureDimensions;
    this.maxPrinciples = maxPrinciples;
    this.decomposer = decomposer || new PrincipleDecomposer({ featureDimensions, maxPrinciples });
    this.router = router || new InterceptRouter({ experts, routesPerPrinciple });
    this.recomposer = recomposer || new ProportionalRecomposer();
    if (!this.router.experts.length) this.buildDefaultExperts(maxPrinciples);
  }

  buildDefaultExperts(count = this.maxPrinciples) {
    this.router.experts = Array.from({ length: count }, (_, index) => new ThalesExpert({ name: `thales_expert_${principleLabel(index)}`, principleIndex: index, readiness: clamp(1 - index * 0.05, 0.7, 1), gain: 1 + index * 0.08 }));
    return this.router.experts;
  }

  registerExpert(expert) {
    this.router.registerExpert(expert);
    return this;
  }

  executeExperts(routing, context = {}) {
    return routing.assignments.map(assignment => ({ principle: assignment.principle, dominantExpert: assignment.dominantExpert, results: assignment.routes.map(route => ({ route, output: route.expert.evaluate(assignment.principle, context) })) }));
  }

  process(input, context = {}) {
    const decomposition = this.decomposer.decompose(input, context);
    const highestIndex = Math.max(...decomposition.principles.map(principle => principle.index), 0);
    if (this.router.experts.length <= highestIndex) this.buildDefaultExperts(highestIndex + 1);
    const routing = this.router.route(decomposition, context);
    const executions = this.executeExperts(routing, context);
    const recomposition = this.recomposer.recompose(executions, decomposition, context);
    return { input, decomposition, routing, executions, recomposition, output: recomposition.output, theorem: 'thales-hierarchical-moe' };
  }

  solve(input, context = {}) {
    return this.process(input, context);
  }

  analyze(input, context = {}) {
    const result = this.process(input, context);
    return {
      output: result.output,
      principles: result.decomposition.principles.map(principle => ({ label: principle.label, proportion: principle.proportion, magnitude: principle.magnitude, curvature: principle.curvature })),
      expertLoads: result.routing.expertLoads,
      coherence: result.recomposition.coherence,
      decompositionQuality: result.decomposition.decompositionQuality,
    };
  }
}

export default {
  PI,
  TAU,
  HALF_PI,
  PHI,
  INV_PHI,
  PHI_SQUARED,
  GOLDEN_ANGLE,
  EPSILON,
  DEFAULT_FEATURE_DIMENSIONS,
  DEFAULT_MAX_PRINCIPLES,
  PrincipleDecomposer,
  InterceptRouter,
  ThalesExpert,
  ProportionalRecomposer,
  MoEThales,
};
