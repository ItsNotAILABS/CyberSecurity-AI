///
/// @medina/moe-copernicus — MIXTURE OF EXPERTS: COPERNICUS
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║  COPERNICUS — REFERENCE FRAME WORLD MODEL via COORDINATE TRANSFORMATION     ║
/// ║                                                                              ║
/// ║  Named for Nicolaus Copernicus — revolutionary of cosmic perspective.        ║
/// ║                                                                              ║
/// ║  Architecture: World model where each expert operates in a different         ║
/// ║  reference frame. The heliocentric insight is that choosing the RIGHT        ║
/// ║  center (frame) makes prediction trivial. Experts compete to find the        ║
/// ║  simplest explanation from their frame. Frame selection = model selection.   ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Frame transformation: x' = R(θ)·x + t — rotation + translation         ║
/// ║    • φ-Rotation matrix: R(φ·θ) — golden-angle rotations between frames       ║
/// ║    • Simplicity criterion: complexity(frame) = Σ|Fourier coefficients|       ║
/// ║      — Occam via Fourier                                                     ║
/// ║    • Heliocentric advantage: C_helio < C_geo by factor φ (fewer epicycles)  ║
/// ║    • Retrograde resolution: apparent_motion = true_motion − observer_motion  ║
/// ║    • Copernican principle: no frame is privileged a priori                   ║
/// ║    • Parallax distance: d = baseline / (2·tan(α/2))                          ║
/// ║    • Orbital period: T² = φ·a³ (modified Kepler third law with φ)           ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI * PHI;
export const TAU = Math.PI * 2;
export const PI = Math.PI;
export const EPSILON = 1e-9;
export const FRAMES = Object.freeze(['heliocentric', 'geocentric', 'galactic', 'local', 'observer']);

const MAX_FLATTEN_DEPTH = 6;
const DEFAULT_HISTORY_LIMIT = 144;
const DEFAULT_BASELINES = Object.freeze([1, PHI, PHI_SQ]);
const DEFAULT_ROTATION_STEP = PI * PHI_INV;
const DEFAULT_TIME_STEP = 1;

const isFiniteNumber = value => Number.isFinite(value) && !Number.isNaN(value);
const isObject = value => Object.prototype.toString.call(value) === '[object Object]';
const sum = values => values.reduce((total, value) => total + value, 0);
const mean = values => (values.length ? sum(values) / values.length : 0);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const safeDivide = (value, divisor, fallback = 0) => Math.abs(divisor) <= EPSILON ? fallback : value / divisor;
const square = value => value * value;
const wrapAngle = angle => {
  if (!isFiniteNumber(angle)) return 0;
  let wrapped = angle % TAU;
  if (wrapped < -PI) wrapped += TAU;
  if (wrapped > PI) wrapped -= TAU;
  return wrapped;
};
const round = (value, digits = 12) => Math.round(value * 10 ** digits) / 10 ** digits;
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

function hashSeed(seed) {
  const text = String(seed ?? 'copernicus');
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed) {
  let state = hashSeed(seed) || 1;
  return () => {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function flattenNumeric(value, depth = 0) {
  if (depth > MAX_FLATTEN_DEPTH || value == null) return [0];
  if (typeof value === 'number') return [isFiniteNumber(value) ? value : 0];
  if (typeof value === 'bigint') return [Number(value)];
  if (typeof value === 'boolean') return [value ? 1 : -1];
  if (typeof value === 'string') {
    return Array.from(value).map((character, index) => (((character.codePointAt(0) ?? 0) % 256) / 128 - 1) * (index % 2 === 0 ? 1 : PHI_INV));
  }
  if (Array.isArray(value)) return value.flatMap(entry => flattenNumeric(entry, depth + 1));
  if (ArrayBuffer.isView(value)) return Array.from(value, entry => (isFiniteNumber(Number(entry)) ? Number(entry) : 0));
  if (isObject(value)) {
    return Object.keys(value).sort().flatMap(key => {
      const encodedKey = Array.from(key).map(character => ((character.codePointAt(0) ?? 0) % 97) / 48.5 - 1);
      return [...encodedKey, ...flattenNumeric(value[key], depth + 1)];
    });
  }
  return [String(value).length * PHI_INV];
}

function padVector(vector, dimensions, fill = 0) {
  const values = [...vector];
  while (values.length < dimensions) values.push(fill);
  return values.slice(0, dimensions);
}

function toVector(value, dimensions = 3) {
  const vector = padVector(flattenNumeric(value), dimensions, 0);
  return vector.map(component => (isFiniteNumber(component) ? component : 0));
}

function addVectors(a, b) {
  return a.map((value, index) => value + (b[index] ?? 0));
}

function subtractVectors(a, b) {
  return a.map((value, index) => value - (b[index] ?? 0));
}

function scaleVector(vector, scalar) {
  return vector.map(value => value * scalar);
}

function dot(a, b) {
  return a.reduce((total, value, index) => total + value * (b[index] ?? 0), 0);
}

function magnitudeSquared(vector) {
  return dot(vector, vector);
}

function magnitude(vector) {
  return Math.sqrt(magnitudeSquared(vector));
}

function normalizeVector(vector) {
  const length = magnitude(vector);
  return length <= EPSILON ? vector.map(() => 0) : vector.map(value => value / length);
}

function blendVectors(vectors, weights) {
  if (!vectors.length) return [];
  const dimensions = Math.max(...vectors.map(vector => vector.length));
  const result = Array.from({ length: dimensions }, () => 0);
  vectors.forEach((vector, index) => {
    const weight = weights[index] ?? 0;
    for (let axis = 0; axis < dimensions; axis += 1) result[axis] += (vector[axis] ?? 0) * weight;
  });
  return result;
}

function normalizeWeights(weights) {
  const safeWeights = weights.map(weight => (isFiniteNumber(weight) && weight > 0 ? weight : 0));
  const total = sum(safeWeights);
  return total <= EPSILON
    ? safeWeights.length ? safeWeights.map(() => 1 / safeWeights.length) : []
    : safeWeights.map(weight => weight / total);
}

function softmin(values, temperature = PHI) {
  if (!values.length) return [];
  const minValue = Math.min(...values);
  const exps = values.map(value => Math.exp(-(value - minValue) / Math.max(temperature, EPSILON)));
  return normalizeWeights(exps);
}

function projectToPlane(vector, axisA = 0, axisB = 1) {
  return [vector[axisA] ?? 0, vector[axisB] ?? 0];
}

function rotate2D(point, angle) {
  const x = point[0] ?? 0;
  const y = point[1] ?? 0;
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  return [x * cosine - y * sine, x * sine + y * cosine];
}

function rotateND(vector, angle) {
  const rotated = [...vector];
  if (rotated.length < 2) return rotated;
  for (let axis = 0; axis < rotated.length - 1; axis += 1) {
    const localAngle = angle * PHI ** (-axis * 0.5);
    const pair = rotate2D([rotated[axis], rotated[axis + 1]], localAngle);
    rotated[axis] = pair[0];
    rotated[axis + 1] = pair[1];
  }
  if (rotated.length > 2) {
    const edgePair = rotate2D([rotated[0], rotated[rotated.length - 1]], angle * PHI_INV * PHI_INV);
    rotated[0] = edgePair[0];
    rotated[rotated.length - 1] = edgePair[1];
  }
  return rotated;
}

function fourierCoefficients(signal) {
  const series = signal.length ? signal : [0];
  const coefficients = [];
  for (let frequency = 0; frequency < series.length; frequency += 1) {
    let real = 0;
    let imaginary = 0;
    for (let sample = 0; sample < series.length; sample += 1) {
      const angle = (TAU * frequency * sample) / series.length;
      real += series[sample] * Math.cos(angle);
      imaginary -= series[sample] * Math.sin(angle);
    }
    coefficients.push({
      frequency,
      real,
      imaginary,
      magnitude: Math.hypot(real, imaginary) / series.length,
    });
  }
  return coefficients;
}

function fourierComplexity(signal) {
  return sum(fourierCoefficients(signal).map(coefficient => Math.abs(coefficient.magnitude)));
}

function simpleOrbitPeriod(semiMajorAxis) {
  const axis = Math.max(Math.abs(semiMajorAxis), EPSILON);
  return Math.sqrt(PHI * axis ** 3);
}

function observationSignature(vector) {
  return {
    centroid: mean(vector),
    energy: magnitudeSquared(vector),
    norm: magnitude(vector),
    complexity: fourierComplexity(vector),
  };
}

function snapshotFrame(frame) {
  return {
    id: frame.id,
    origin: [...frame.origin],
    rotation: frame.rotation,
    velocity: [...frame.velocity],
    dimensions: frame.dimensions,
    complexity: frame.complexity(),
  };
}

function ensureFrameId(frame) {
  const id = typeof frame === 'string' ? frame : frame?.id;
  assert(id && FRAMES.includes(id), `Unknown reference frame: ${String(id)}`);
  return id;
}

function averageVectors(vectors) {
  if (!vectors.length) return [];
  return scaleVector(blendVectors(vectors, vectors.map(() => 1)), 1 / vectors.length);
}

function lineIntersection2D(aOrigin, aDirection, bOrigin, bDirection) {
  const determinant = aDirection[0] * bDirection[1] - aDirection[1] * bDirection[0];
  if (Math.abs(determinant) <= EPSILON) return null;
  const delta = [bOrigin[0] - aOrigin[0], bOrigin[1] - aOrigin[1]];
  const parameter = (delta[0] * bDirection[1] - delta[1] * bDirection[0]) / determinant;
  return [aOrigin[0] + aDirection[0] * parameter, aOrigin[1] + aDirection[1] * parameter];
}

export class ReferenceFrame {
  constructor({ id, origin = [0, 0, 0], rotation = 0, velocity = [0, 0, 0] } = {}) {
    assert(id, 'ReferenceFrame requires an id');
    this.id = id;
    this.dimensions = Math.max(origin.length || 0, velocity.length || 0, 2);
    this.origin = padVector(origin.map(value => Number(value) || 0), this.dimensions, 0);
    this.rotation = wrapAngle(rotation);
    this.velocity = padVector(velocity.map(value => Number(value) || 0), this.dimensions, 0);
  }

  transform(point) {
    const vector = toVector(point, this.dimensions);
    return addVectors(rotateND(vector, this.rotation * PHI), this.origin);
  }

  inverse(point) {
    const vector = toVector(point, this.dimensions);
    return rotateND(subtractVectors(vector, this.origin), -this.rotation * PHI);
  }

  complexity() {
    return fourierComplexity([...this.origin, this.rotation, ...this.velocity]);
  }

  relateTo(otherFrame) {
    assert(otherFrame instanceof ReferenceFrame, 'relateTo requires another ReferenceFrame');
    const translation = otherFrame.inverse(this.origin);
    const relativeRotation = wrapAngle(this.rotation - otherFrame.rotation);
    const relativeVelocity = otherFrame.inverse(addVectors(this.origin, this.velocity)).map((value, index) => value - translation[index]);
    return {
      from: this.id,
      to: otherFrame.id,
      rotation: relativeRotation,
      translation,
      velocity: relativeVelocity,
      transformPoint: point => otherFrame.inverse(this.transform(point)),
      inversePoint: point => this.inverse(otherFrame.transform(point)),
      simplicity: safeDivide(1, fourierComplexity([...translation, relativeRotation, ...relativeVelocity]) + EPSILON, 0),
    };
  }
}

export class FrameExpert {
  constructor({ id, frame, dimensions = 3, seed = 0 } = {}) {
    assert(frame instanceof ReferenceFrame, 'FrameExpert requires a ReferenceFrame');
    this.id = id ?? `${frame.id}-expert`;
    this.frame = frame;
    this.dimensions = Math.max(2, dimensions);
    this.seed = seed;
    const rng = createRng(`${seed}:${this.id}:${frame.id}`);
    this.bias = Array.from({ length: this.dimensions }, (_, index) => (rng() - 0.5) * PHI_INV * (index + 1));
    this.gain = Array.from({ length: this.dimensions }, (_, index) => 0.75 + rng() * PHI + index * 0.03);
    this.drift = Array.from({ length: this.dimensions }, () => (rng() - 0.5) * PHI_INV);
    this.phase = rng() * TAU;
  }

  forward(observation) {
    const worldVector = toVector(observation, this.dimensions);
    const localVector = this.frame.inverse(worldVector);
    const response = localVector.map((value, index) => {
      const harmonic = Math.cos(this.phase + index * PHI_INV) * PHI_INV;
      return Math.tanh(value * this.gain[index] + this.bias[index] + harmonic);
    });
    const reconstruction = response.map((value, index) => value + localVector[index] * PHI_INV + this.drift[index]);
    const error = mean(reconstruction.map((value, index) => Math.abs(value - localVector[index])));
    return {
      expertId: this.id,
      frame: this.frame.id,
      worldVector,
      localVector,
      response,
      reconstruction,
      error,
      complexity: fourierComplexity([...localVector, ...response, ...this.gain]),
      simplicity: this.simplicity(),
      score: safeDivide(this.simplicity(), 1 + error, 0),
    };
  }

  predictInFrame(state, dt = DEFAULT_TIME_STEP) {
    const worldVector = toVector(state, this.dimensions);
    const localVector = this.frame.inverse(worldVector);
    const evolved = localVector.map((value, index) => {
      const orbitalComponent = Math.sin(this.phase + dt * (index + 1) * PHI_INV) * PHI_INV;
      return value + this.drift[index] * dt + orbitalComponent;
    });
    const predictedWorld = this.frame.transform(evolved);
    return {
      expertId: this.id,
      frame: this.frame.id,
      dt,
      localState: localVector,
      predictedLocal: evolved,
      predictedWorld,
      orbitalPeriod: simpleOrbitPeriod(Math.max(Math.abs(mean(evolved)), PHI_INV)),
    };
  }

  simplicity() {
    return safeDivide(1, fourierComplexity([...this.bias, ...this.gain, ...this.drift, this.phase]) + EPSILON, 0);
  }
}

export class CoordinateTransformer {
  constructor({ dimensions = 3 } = {}) {
    this.dimensions = Math.max(2, dimensions);
  }

  rotate(vector, angle) {
    return rotateND(toVector(vector, this.dimensions), angle);
  }

  translate(vector, offset) {
    return addVectors(toVector(vector, this.dimensions), toVector(offset, this.dimensions));
  }

  compose(transforms = []) {
    const sequence = transforms.map(transform => ({
      rotation: wrapAngle(transform?.rotation ?? 0),
      translation: toVector(transform?.translation ?? transform?.origin ?? [], this.dimensions),
    }));
    const apply = input => sequence.reduce(
      (vector, transform) => this.translate(this.rotate(vector, transform.rotation * PHI), transform.translation),
      toVector(input, this.dimensions),
    );
    const translation = apply(Array.from({ length: this.dimensions }, () => 0));
    const rotation = wrapAngle(sum(sequence.map(transform => transform.rotation)));
    return {
      rotation,
      translation,
      sequence,
      apply,
    };
  }

  decompose(transform) {
    const normalized = {
      rotation: wrapAngle(transform?.rotation ?? 0),
      translation: toVector(transform?.translation ?? transform?.origin ?? [], this.dimensions),
    };
    const scale = magnitude(normalized.translation) + 1;
    return {
      ...normalized,
      shiftMagnitude: magnitude(normalized.translation),
      orbitPeriod: simpleOrbitPeriod(scale),
      axes: normalized.translation.map((value, index) => ({ axis: index, value })),
    };
  }
}

export class CopernicanGating {
  constructor({ numExperts = FRAMES.length, frames = FRAMES } = {}) {
    this.numExperts = Math.max(1, numExperts);
    this.frames = frames.map(frame => frame instanceof ReferenceFrame ? frame : new ReferenceFrame({ id: ensureFrameId(frame) }));
  }

  scoreFrame(observation, frame) {
    const vector = toVector(observation, frame.dimensions);
    const local = frame.inverse(vector);
    const localSignature = observationSignature(local);
    const centeringBonus = safeDivide(1, 1 + magnitude(local), 0);
    const motionPenalty = magnitude(frame.velocity) * PHI_INV;
    const rotationPenalty = Math.abs(frame.rotation) * PHI_INV;
    const rawComplexity = localSignature.complexity + frame.complexity() * PHI_INV + motionPenalty + rotationPenalty;
    const simplicity = safeDivide(1 + centeringBonus * PHI, rawComplexity + EPSILON, 0);
    return {
      frame,
      frameId: frame.id,
      local,
      complexity: rawComplexity,
      simplicity,
      signature: localSignature,
      heliocentricAdvantage: frame.id === 'heliocentric' ? PHI : 1,
      score: frame.id === 'heliocentric' ? simplicity * PHI : simplicity,
    };
  }

  selectBestFrame(observation) {
    const scored = this.frames.map(frame => this.scoreFrame(observation, frame));
    scored.sort((left, right) => right.score - left.score || left.complexity - right.complexity);
    return scored[0];
  }

  route(observation) {
    const scored = this.frames.map(frame => this.scoreFrame(observation, frame));
    const weights = softmin(scored.map(candidate => candidate.complexity), PHI);
    const ranked = scored.map((candidate, index) => ({ ...candidate, weight: weights[index] ?? 0 }))
      .sort((left, right) => right.weight - left.weight || right.score - left.score);
    const selected = ranked[0];
    return {
      selected,
      frame: selected.frame,
      frameId: selected.frameId,
      weights: Object.fromEntries(ranked.map(candidate => [candidate.frameId, candidate.weight])),
      ranked,
      rationale: `Frame ${selected.frameId} minimizes Fourier complexity while maximizing centering simplicity.`,
    };
  }
}

export class ParallaxResolver {
  constructor({ baselines = DEFAULT_BASELINES } = {}) {
    this.baselines = baselines.length ? [...baselines] : [...DEFAULT_BASELINES];
  }

  distance(angles) {
    const samples = Array.isArray(angles) ? angles : [angles];
    const distances = samples.map((sample, index) => {
      const angle = typeof sample === 'number' ? sample : sample?.angle;
      const baseline = typeof sample === 'number'
        ? this.baselines[index % this.baselines.length]
        : sample?.baseline ?? this.baselines[index % this.baselines.length];
      const safeAngle = Math.max(Math.abs(angle ?? 0), EPSILON);
      return baseline / (2 * Math.tan(safeAngle / 2));
    }).filter(value => isFiniteNumber(value));
    return distances.length ? mean(distances) : Infinity;
  }

  triangulate(observations = []) {
    if (!observations.length) return { position: [0, 0], distance: Infinity, intersections: [] };
    const normalized = observations.map((observation, index) => {
      const origin = padVector(observation?.origin ? toVector(observation.origin, 2) : [this.baselines[index % this.baselines.length] * index, 0], 2, 0);
      const angle = wrapAngle(observation?.angle ?? 0);
      const direction = [Math.cos(angle), Math.sin(angle)];
      return { origin, angle, direction, baseline: observation?.baseline ?? this.baselines[index % this.baselines.length] };
    });
    const intersections = [];
    for (let i = 0; i < normalized.length; i += 1) {
      for (let j = i + 1; j < normalized.length; j += 1) {
        const intersection = lineIntersection2D(normalized[i].origin, normalized[i].direction, normalized[j].origin, normalized[j].direction);
        if (intersection) intersections.push(intersection);
      }
    }
    const position = intersections.length
      ? averageVectors(intersections.map(point => padVector(point, 2, 0))).slice(0, 2)
      : normalized[0].origin;
    const angularSpread = normalized.length > 1
      ? mean(normalized.slice(1).map(entry => Math.abs(wrapAngle(entry.angle - normalized[0].angle))))
      : EPSILON;
    return {
      position,
      distance: this.distance(normalized.map((entry, index) => ({ angle: angularSpread || Math.abs(entry.angle), baseline: entry.baseline ?? this.baselines[index % this.baselines.length] }))),
      intersections,
      observations: normalized,
    };
  }

  resolveRetrograde(apparent, observerMotion) {
    const apparentVector = Array.isArray(apparent) ? apparent : toVector(apparent, 2);
    const observerVector = Array.isArray(observerMotion) ? observerMotion : toVector(observerMotion, apparentVector.length || 2);
    return subtractVectors(apparentVector, observerVector);
  }
}

export class MoECopernicus {
  constructor({ dimensions = 3, numExperts = FRAMES.length * 2, seed = 'copernicus' } = {}) {
    this.dimensions = Math.max(2, dimensions);
    this.numExperts = Math.max(FRAMES.length, numExperts);
    this.seed = seed;
    this.rng = createRng(seed);
    this.time = 0;
    this.transformer = new CoordinateTransformer({ dimensions: this.dimensions });
    this.parallax = new ParallaxResolver({ baselines: DEFAULT_BASELINES.map(value => value * (1 + this.rng() * PHI_INV)) });
    this.frames = new Map();
    this.history = [];
    this.lastObservation = null;

    this.#initializeFrames();
    this.experts = this.#initializeExperts();
    this.gating = new CopernicanGating({ numExperts: this.numExperts, frames: [...this.frames.values()] });
  }

  #initializeFrames() {
    const padded = values => padVector(values, this.dimensions, 0);
    const definitions = [
      { id: 'heliocentric', origin: padded([0, 0, 0]), rotation: 0, velocity: padded([0, 0, 0]) },
      { id: 'geocentric', origin: padded([PHI_INV, -PHI_INV, 0]), rotation: PI, velocity: padded([0, 1 / PHI_SQ, 0]) },
      { id: 'galactic', origin: padded([PHI_SQ, -PHI, PHI_INV]), rotation: PI * PHI_INV, velocity: padded([0.02, -0.01, PHI_INV * 0.01]) },
      { id: 'local', origin: padded([0.5, -0.25, PHI_INV * 0.25]), rotation: PI * PHI_INV * PHI_INV, velocity: padded([0.015, 0.01, -0.005]) },
      { id: 'observer', origin: padded([0.1, 0.05, -0.025]), rotation: -PI * PHI_INV * 0.5, velocity: padded([0.03, -0.015, 0.0025]) },
    ];
    definitions.forEach(definition => {
      this.frames.set(definition.id, new ReferenceFrame(definition));
    });
  }

  #initializeExperts() {
    const experts = [];
    const frameList = [...this.frames.values()];
    for (let index = 0; index < this.numExperts; index += 1) {
      const frame = frameList[index % frameList.length];
      experts.push(new FrameExpert({
        id: `${frame.id}-expert-${index}`,
        frame,
        dimensions: this.dimensions,
        seed: `${this.seed}:${index}`,
      }));
    }
    return experts;
  }

  #frame(frame) {
    const id = ensureFrameId(frame);
    const selected = this.frames.get(id);
    assert(selected, `Frame not registered: ${id}`);
    return selected;
  }

  #frameExperts(frameId) {
    return this.experts.filter(expert => expert.frame.id === frameId);
  }

  #record(entry) {
    this.history.push(entry);
    if (this.history.length > DEFAULT_HISTORY_LIMIT) this.history.shift();
    return entry;
  }

  observe(data, frame = 'observer') {
    const sourceFrame = this.#frame(frame);
    const sourceVector = toVector(data, this.dimensions);
    const heliocentricVector = this.transform(sourceVector, sourceFrame.id, 'heliocentric');
    const gating = this.gating.route(heliocentricVector);
    const expertCandidates = this.#frameExperts(gating.frameId).map(expert => expert.forward(heliocentricVector))
      .sort((left, right) => right.score - left.score || left.error - right.error);
    const topCandidates = expertCandidates.slice(0, Math.max(1, Math.ceil(PHI_SQ)));
    const candidateWeights = normalizeWeights(topCandidates.map(candidate => candidate.score));
    const blendedLocal = blendVectors(topCandidates.map(candidate => candidate.reconstruction), candidateWeights);
    const blendedWorld = gating.frame.transform(blendedLocal);
    const parallax = this.parallax.triangulate([
      { origin: [0, 0], angle: Math.atan2(heliocentricVector[1] ?? 0, heliocentricVector[0] ?? 0), baseline: DEFAULT_BASELINES[0] },
      { origin: [PHI, 0], angle: Math.atan2((heliocentricVector[1] ?? 0) + PHI_INV, (heliocentricVector[0] ?? 0) + PHI_INV), baseline: DEFAULT_BASELINES[1] },
    ]);
    const observation = this.#record({
      type: 'observation',
      time: this.time,
      sourceFrame: sourceFrame.id,
      heliocentricVector,
      selectedFrame: gating.frameId,
      blendedWorld,
      parallax,
    });
    this.lastObservation = observation;
    return {
      input: sourceVector,
      sourceFrame: sourceFrame.id,
      heliocentricVector,
      bestFrame: gating.frameId,
      routed: gating,
      experts: topCandidates,
      weights: candidateWeights,
      blendedLocal,
      blendedWorld,
      parallax,
      signature: observationSignature(heliocentricVector),
    };
  }

  predict(state, horizon = 1) {
    const steps = Math.max(1, Math.floor(horizon));
    const predictions = [];
    let current = toVector(state, this.dimensions);
    for (let index = 0; index < steps; index += 1) {
      const best = this.bestFrame(current);
      const experts = this.#frameExperts(best.frameId)
        .map(expert => expert.predictInFrame(current, index + 1))
        .sort((left, right) => magnitude(left.predictedLocal) - magnitude(right.predictedLocal));
      const topExperts = experts.slice(0, Math.max(1, Math.ceil(PHI)));
      const weights = normalizeWeights(topExperts.map((_, expertIndex) => 1 / (expertIndex + 1)));
      const blended = blendVectors(topExperts.map(expert => expert.predictedWorld), weights);
      const observerProjection = this.transform(blended, 'heliocentric', 'observer');
      const prediction = {
        step: index + 1,
        time: this.time + index + 1,
        frame: best.frameId,
        world: blended,
        observer: observerProjection,
        candidates: topExperts,
        weights,
      };
      predictions.push(prediction);
      current = blended;
    }
    this.#record({ type: 'prediction', time: this.time, horizon: steps, predictions });
    return predictions;
  }

  bestFrame(observation) {
    const vector = toVector(observation, this.dimensions);
    const best = this.gating.selectBestFrame(vector);
    return {
      frameId: best.frameId,
      frame: snapshotFrame(best.frame),
      local: best.local,
      score: best.score,
      simplicity: best.simplicity,
      complexity: best.complexity,
    };
  }

  transform(state, fromFrame, toFrame) {
    const source = this.#frame(fromFrame);
    const target = this.#frame(toFrame);
    const vector = toVector(state, this.dimensions);
    if (source.id === target.id) return [...vector];
    const world = source.transform(vector);
    return target.inverse(world);
  }

  step(dt = DEFAULT_TIME_STEP) {
    const delta = Math.max(Number(dt) || DEFAULT_TIME_STEP, EPSILON);
    this.time += delta;
    for (const frame of this.frames.values()) {
      frame.origin = addVectors(frame.origin, scaleVector(frame.velocity, delta));
      frame.rotation = wrapAngle(frame.rotation + magnitude(frame.velocity) * delta * PHI_INV);
    }
    const snapshot = {
      time: this.time,
      frames: [...this.frames.values()].map(snapshotFrame),
      orbitalPeriod: simpleOrbitPeriod(1 + this.time * PHI_INV),
    };
    this.#record({ type: 'step', ...snapshot });
    return snapshot;
  }

  metrics() {
    const frameMetrics = [...this.frames.values()].map(frame => ({
      id: frame.id,
      complexity: frame.complexity(),
      speed: magnitude(frame.velocity),
      rotation: frame.rotation,
    }));
    const bestObservationFrame = this.lastObservation?.selectedFrame ?? 'heliocentric';
    const expertMetrics = this.experts.map(expert => ({
      id: expert.id,
      frame: expert.frame.id,
      simplicity: expert.simplicity(),
    }));
    const dominantFrame = expertMetrics.reduce((accumulator, metric) => {
      accumulator[metric.frame] = (accumulator[metric.frame] ?? 0) + metric.simplicity;
      return accumulator;
    }, {});
    return {
      time: this.time,
      dimensions: this.dimensions,
      numExperts: this.experts.length,
      bestObservationFrame,
      frameMetrics,
      expertMetrics,
      dominantFrame,
      meanFrameComplexity: mean(frameMetrics.map(metric => metric.complexity)),
      meanExpertSimplicity: mean(expertMetrics.map(metric => metric.simplicity)),
      historySize: this.history.length,
      parallaxBaselines: [...this.parallax.baselines],
      heliocentricAdvantage: safeDivide(
        (frameMetrics.find(metric => metric.id === 'geocentric')?.complexity ?? PHI),
        (frameMetrics.find(metric => metric.id === 'heliocentric')?.complexity ?? 1),
        PHI,
      ),
    };
  }
}

export default {
  PHI,
  PHI_INV,
  PHI_SQ,
  TAU,
  PI,
  EPSILON,
  FRAMES,
  ReferenceFrame,
  FrameExpert,
  CoordinateTransformer,
  CopernicanGating,
  ParallaxResolver,
  MoECopernicus,
};

/// Casa de Medina — Architectos de Architectura Inteligente
