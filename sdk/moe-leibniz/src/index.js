///
/// @medina/moe-leibniz — MIXTURE OF EXPERTS: LEIBNIZ
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║   LEIBNIZ — POSSIBLE WORLDS MODEL via MONAD COMPOSITION                     ║
/// ║                                                                              ║
/// ║   Named for Gottfried Wilhelm Leibniz — philosopher of monads and harmony.  ║
/// ║                                                                              ║
/// ║   Architecture: World model where reality is composed of monads             ║
/// ║   (windowless, self-contained units of perception). Each expert is a        ║
/// ║   monad that mirrors the universe from its perspective.                     ║
/// ║   Pre-established harmony ensures they agree. The actual world = the one    ║
/// ║   maximizing perfection (φ-optimality).                                     ║
/// ║                                                                              ║
/// ║   Mathematics:                                                               ║
/// ║     • Monad perception: m_i(t) = f(m₁,...,m_N, t)                           ║
/// ║     • Pre-established harmony: ∀i,j: consistent(m_i, m_j)                  ║
/// ║     • Best possible world: argmax_w Σᵢ perfection(wᵢ) subject to            ║
/// ║       compossibility                                                         ║
/// ║     • Perfection metric: P(w) = variety(w)·order(w)·φ                       ║
/// ║     • Infinitesimal calculus: dx/dt = lim_{h→0} (x(t+h)−x(t))/h            ║
/// ║     • Principle of sufficient reason: ∀x ∃reason(x)                         ║
/// ║     • Binary cosmos: state = Σᵢ bᵢ·2ⁱ                                       ║
/// ║     • Compossibility: worlds_compatible(w1,w2) if ¬∃contradiction(w1∩w2)   ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI ** 2;
export const TAU = Math.PI * 2;
export const PI = Math.PI;
export const EPSILON = 1e-9;

const DEFAULT_DIMENSIONS = 8;
const DEFAULT_MONADS = 5;
const MAX_HISTORY = 256;
const HARMONY_THRESHOLD = 1 / (PHI_SQ * 10);

const clamp = (value, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, value));
const sum = (values) => values.reduce((total, value) => total + value, 0);
const mean = (values) => (values.length ? sum(values) / values.length : 0);
const variance = (values) => {
  if (!values.length) return 0;
  const avg = mean(values);
  return mean(values.map((value) => (value - avg) ** 2));
};
const stddev = (values) => Math.sqrt(Math.max(0, variance(values)));
const dot = (a, b) => {
  const length = Math.max(a.length, b.length);
  let total = 0;
  for (let i = 0; i < length; i += 1) total += (a[i] || 0) * (b[i] || 0);
  return total;
};
const add = (a, b) => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) + (b[i] || 0));
const sub = (a, b) => Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) - (b[i] || 0));
const scale = (vector, scalar) => vector.map((value) => value * scalar);
const blend = (a, b, ratio = 0.5) => {
  const left = clamp(ratio, 0, 1);
  const right = 1 - left;
  return Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) * left + (b[i] || 0) * right);
};
const magnitude = (vector) => Math.sqrt(Math.max(0, dot(vector, vector)));
const normalize = (vector) => {
  const length = magnitude(vector);
  return length <= EPSILON ? vector.map(() => 0) : vector.map((value) => value / length);
};
const cosine = (a, b) => {
  const denominator = magnitude(a) * magnitude(b);
  return denominator <= EPSILON ? 0 : dot(a, b) / denominator;
};
const distance = (a, b) => magnitude(sub(a, b));
const l1Distance = (a, b) => sum(Array.from({ length: Math.max(a.length, b.length) }, (_, i) => Math.abs((a[i] || 0) - (b[i] || 0))));
const sigmoid = (value) => 1 / (1 + Math.exp(-value));
const round = (value, digits = 12) => Math.round(value * 10 ** digits) / 10 ** digits;
const roundVector = (vector, digits = 12) => vector.map((value) => round(value, digits));
const boundedPush = (list, entry, limit = MAX_HISTORY) => {
  list.push(entry);
  if (list.length > limit) list.splice(0, list.length - limit);
};
const nextId = (prefix = 'leibniz') => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

function flattenValue(value, output = []) {
  if (value == null) {
    output.push(0);
    return output;
  }
  if (typeof value === 'number') {
    output.push(Number.isFinite(value) ? value : 0);
    return output;
  }
  if (typeof value === 'bigint') {
    output.push(Number(value));
    return output;
  }
  if (typeof value === 'boolean') {
    output.push(value ? 1 : 0);
    return output;
  }
  if (typeof value === 'string') {
    for (let i = 0; i < value.length; i += 1) {
      output.push((value.charCodeAt(i) % 127) / 63.5 - 1);
    }
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => flattenValue(entry, output));
    return output;
  }
  if (typeof value === 'object') {
    Object.keys(value).sort().forEach((key) => {
      flattenValue(key, output);
      flattenValue(value[key], output);
    });
    return output;
  }
  output.push(0);
  return output;
}

function ensureDimensions(vector, dimensions = DEFAULT_DIMENSIONS) {
  const size = Math.max(1, dimensions || vector.length || DEFAULT_DIMENSIONS);
  const normalized = vector.slice(0, size).map((value) => (Number.isFinite(value) ? value : 0));
  while (normalized.length < size) normalized.push(0);
  return normalized;
}

function toVector(value, dimensions = DEFAULT_DIMENSIONS) {
  if (Array.isArray(value) && value.every((entry) => typeof entry === 'number')) {
    return ensureDimensions(value, dimensions || value.length || DEFAULT_DIMENSIONS);
  }
  const flattened = flattenValue(value);
  return ensureDimensions(flattened, dimensions || flattened.length || DEFAULT_DIMENSIONS);
}

function softmax(values, temperature = 1) {
  if (!values.length) return [];
  const safeTemperature = Math.max(Math.abs(temperature), EPSILON);
  const scaled = values.map((value) => value / safeTemperature);
  const peak = Math.max(...scaled);
  const exps = scaled.map((value) => Math.exp(value - peak));
  const total = sum(exps) || 1;
  return exps.map((value) => value / total);
}

function entropy(values) {
  const magnitudes = values.map((value) => Math.abs(value));
  const total = sum(magnitudes) || 1;
  return -magnitudes.reduce((acc, value) => {
    if (value <= EPSILON) return acc;
    const probability = value / total;
    return acc + probability * Math.log(probability + EPSILON);
  }, 0);
}

function phiBalance(varietyValue, orderValue) {
  const high = Math.max(Math.abs(varietyValue), Math.abs(orderValue), EPSILON);
  const low = Math.max(Math.min(Math.abs(varietyValue), Math.abs(orderValue)), EPSILON);
  const ratio = high / low;
  return 1 / (1 + Math.abs(ratio - PHI));
}

function vectorBalance(vector) {
  const positives = vector.filter((value) => value >= 0).length;
  const negatives = vector.length - positives;
  const ratio = (Math.max(positives, negatives) + 1) / (Math.min(positives, negatives) + 1);
  return 1 / (1 + Math.abs(ratio - PHI));
}

function pairwise(items) {
  const pairs = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) pairs.push([items[i], items[j]]);
  }
  return pairs;
}

function projectBinaryState(vector) {
  return vector.reduce((state, value, index) => {
    const bit = value >= 0 ? 1 : 0;
    return state + bit * (2 ** index);
  }, 0);
}

function hashString(input) {
  const text = String(input ?? '');
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function createRng(seed = 1) {
  let state = hashString(seed) || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return ((state >>> 0) % 0xffffffff) / 0xffffffff;
  };
}

function inferReason(value) {
  if (value == null) return 'nullity resolved into a sufficient reason';
  if (typeof value === 'number') return `numeric actuality ${round(value, 6)} influenced perception`;
  if (typeof value === 'string') return `symbolic sequence of length ${value.length} informed the monadic state`;
  if (typeof value === 'boolean') return `binary proposition evaluated to ${value}`;
  if (Array.isArray(value)) return `aggregate of ${value.length} appearances supplied a sufficient reason`;
  if (typeof value === 'object') return `structured relation of ${Object.keys(value).length} properties explained the event`;
  return `event of kind ${typeof value} was assigned a sufficient reason`;
}

function monadSnapshot(monad) {
  return {
    id: monad.id,
    perceptions: [...monad.perceptions],
    clarity: monad.clarity(),
    distinctness: monad.distinctness(),
    derivative: [...monad.derivative],
    binaryState: monad.binaryState,
    reasons: [...monad.reasons],
  };
}

function cloneConstraint(constraint) {
  if (typeof constraint === 'function') return constraint;
  return JSON.parse(JSON.stringify(constraint));
}

function normalizeWeights(weights) {
  const total = sum(weights.map((value) => Math.max(0, value))) || 1;
  return weights.map((value) => Math.max(0, value) / total);
}

function goldenGradient(length, phase = 0) {
  return Array.from({ length }, (_, index) => Math.cos((index + 1 + phase) / PHI) * PHI_INV);
}

function compareNumbersDescending(a, b) {
  return b - a;
}

export class Monad {
  constructor({ id, perceptions = [], appetition = null } = {}) {
    this.id = id || nextId('monad');
    this.perceptions = toVector(perceptions, Array.isArray(perceptions) ? perceptions.length || DEFAULT_DIMENSIONS : DEFAULT_DIMENSIONS);
    this.appetition = appetition;
    this.history = [{ t: 0, state: [...this.perceptions] }];
    this.mirrorField = [...this.perceptions];
    this.derivative = this.perceptions.map(() => 0);
    this.reasons = [];
    this.binaryState = projectBinaryState(this.perceptions);
    this.lastUniverse = null;
    this.lastTimestamp = Date.now();
  }

  perceive(universe) {
    const vector = toVector(universe, this.perceptions.length || DEFAULT_DIMENSIONS);
    const novelty = sub(vector, this.perceptions);
    const retained = scale(this.perceptions, PHI_INV);
    const incoming = scale(vector, 1 - PHI_INV);
    this.perceptions = roundVector(add(retained, incoming));
    this.derivative = roundVector(scale(novelty, PHI_INV));
    this.binaryState = projectBinaryState(this.perceptions);
    this.lastUniverse = vector;
    this.lastTimestamp = Date.now();
    boundedPush(this.history, { t: this.lastTimestamp, state: [...this.perceptions], derivative: [...this.derivative] });
    boundedPush(this.reasons, inferReason(universe));
    return monadSnapshot(this);
  }

  mirror(otherMonads = []) {
    const peers = otherMonads.filter((other) => other && other.id !== this.id);
    if (!peers.length) {
      this.mirrorField = [...this.perceptions];
      return [...this.mirrorField];
    }

    const weights = normalizeWeights(peers.map((other) => other.clarity() + other.distinctness() + PHI_INV));
    const mirrored = peers.reduce((acc, other, index) => add(acc, scale(other.perceptions, weights[index])), this.perceptions.map(() => 0));
    this.mirrorField = roundVector(blend(mirrored, this.perceptions, PHI_INV));
    return [...this.mirrorField];
  }

  clarity() {
    const perceptionMagnitude = magnitude(this.perceptions);
    const uncertainty = entropy(this.perceptions) / Math.log(this.perceptions.length + 1);
    const stability = 1 / (1 + magnitude(this.derivative));
    const brightness = sigmoid(perceptionMagnitude * PHI_INV);
    return clamp((brightness + stability + (1 - uncertainty)) / 3, 0, 1);
  }

  distinctness() {
    const spread = stddev(this.perceptions);
    const contrast = mean(this.perceptions.map((value) => Math.abs(value)));
    const balance = vectorBalance(this.perceptions);
    return clamp((spread + contrast + balance) / PHI_SQ, 0, 1);
  }

  appetiteStep(dt = 1) {
    const deltaTime = Math.max(dt, EPSILON);
    const target = typeof this.appetition === 'function'
      ? toVector(this.appetition({ monad: this, dt: deltaTime }), this.perceptions.length)
      : Array.isArray(this.appetition)
        ? toVector(this.appetition, this.perceptions.length)
        : this.perceptions.map((value, index) => value + Math.sin((index + 1 + this.history.length) / PHI) * PHI_INV * (typeof this.appetition === 'number' ? this.appetition : 1));

    const tendency = sub(target, this.perceptions);
    const mirrored = sub(this.mirrorField, this.perceptions);
    const dxdt = add(scale(tendency, PHI_INV / deltaTime), scale(mirrored, (1 - PHI_INV) / deltaTime));
    const next = add(this.perceptions, scale(dxdt, deltaTime * PHI_INV));

    this.derivative = roundVector(dxdt);
    this.perceptions = roundVector(next);
    this.binaryState = projectBinaryState(this.perceptions);
    this.lastTimestamp = Date.now();
    boundedPush(this.history, { t: this.lastTimestamp, state: [...this.perceptions], derivative: [...this.derivative] });
    boundedPush(this.reasons, `appetition advanced ${this.id} by infinitesimal tendency over dt=${round(deltaTime, 6)}`);
    return monadSnapshot(this);
  }
}

export class PossibleWorld {
  constructor({ monads = [], constraints = [] } = {}) {
    this.monads = monads;
    this.constraints = constraints.map((constraint) => cloneConstraint(constraint));
    this.createdAt = Date.now();
    this.id = nextId('world');
  }

  variety() {
    if (!this.monads.length) return 0;
    const signatures = this.monads.map((monad) => monad.perceptions.map((value) => Math.sign(round(value, 3))).join(','));
    const uniqueRatio = new Set(signatures).size / this.monads.length;
    const claritySpread = stddev(this.monads.map((monad) => monad.clarity()));
    const binaryVariety = entropy(this.monads.map((monad) => monad.binaryState % 97));
    return clamp((uniqueRatio + claritySpread + binaryVariety / Math.log(this.monads.length + 2)) / PHI, 0, PHI_SQ);
  }

  order() {
    if (!this.monads.length) return 0;
    const divergences = pairwise(this.monads).map(([left, right]) => distance(left.perceptions, right.perceptions));
    const harmony = 1 / (1 + mean(divergences));
    const causalOrder = 1 / (1 + mean(this.monads.map((monad) => magnitude(monad.derivative))));
    const constraintOrder = this.constraints.length
      ? mean(this.constraints.map((constraint) => {
        if (typeof constraint === 'function') return constraint(this) ? 1 : 0;
        if (constraint && typeof constraint === 'object' && constraint.type === 'maxDivergence') return mean(divergences) <= (constraint.value ?? Infinity) ? 1 : 0;
        if (constraint && typeof constraint === 'object' && constraint.type === 'minClarity') return mean(this.monads.map((monad) => monad.clarity())) >= (constraint.value ?? 0) ? 1 : 0;
        return 1;
      }))
      : 1;
    return clamp((harmony + causalOrder + constraintOrder) / 3, 0, 1);
  }

  perfection() {
    const varietyValue = this.variety();
    const orderValue = this.order();
    const balance = phiBalance(varietyValue, orderValue);
    return varietyValue * orderValue * PHI * (1 + balance * PHI_INV);
  }

  isCompossible(otherWorld) {
    if (!(otherWorld instanceof PossibleWorld)) return false;
    const sharedIds = new Set(this.monads.map((monad) => monad.id).filter((id) => otherWorld.monads.some((other) => other.id === id)));
    for (const id of sharedIds) {
      const left = this.monads.find((monad) => monad.id === id);
      const right = otherWorld.monads.find((monad) => monad.id === id);
      if (distance(left.perceptions, right.perceptions) > PHI_SQ) return false;
    }

    const conflicts = [...this.constraints, ...otherWorld.constraints].filter((constraint) => constraint && typeof constraint === 'object' && constraint.type === 'forbidState');
    const mergedBinary = new Set([...this.monads, ...otherWorld.monads].map((monad) => monad.binaryState));
    return !conflicts.some((constraint) => mergedBinary.has(constraint.value));
  }

  compare(otherWorld) {
    const mine = this.perfection();
    const theirs = otherWorld instanceof PossibleWorld ? otherWorld.perfection() : -Infinity;
    const compossible = otherWorld instanceof PossibleWorld ? this.isCompossible(otherWorld) : false;
    return {
      world: mine >= theirs ? this : otherWorld,
      perfectionDelta: mine - theirs,
      compossible,
      relation: compossible ? 'compatible' : 'contradictory',
    };
  }
}

export class PreEstablishedHarmony {
  constructor({ monads = [] } = {}) {
    this.monads = monads;
    this.consensus = monads.length ? monads[0].perceptions.map(() => 0) : [];
    this.history = [];
  }

  synchronize() {
    if (!this.monads.length) {
      this.consensus = [];
      return { consensus: [], divergence: 0, harmonious: true };
    }

    this.monads.forEach((monad) => monad.mirror(this.monads));
    const weights = normalizeWeights(this.monads.map((monad) => monad.clarity() + PHI_INV));
    const consensus = this.monads.reduce((acc, monad, index) => add(acc, scale(monad.mirrorField, weights[index])), this.monads[0].perceptions.map(() => 0));

    this.monads.forEach((monad) => {
      monad.perceptions = roundVector(blend(consensus, monad.perceptions, PHI_INV));
      monad.binaryState = projectBinaryState(monad.perceptions);
      boundedPush(monad.reasons, `pre-established harmony aligned ${monad.id} toward universal consensus`);
    });

    this.consensus = roundVector(consensus);
    const report = {
      consensus: [...this.consensus],
      divergence: this.divergence(),
      harmonious: this.isHarmonious(),
      timestamp: Date.now(),
    };
    boundedPush(this.history, report);
    return report;
  }

  isHarmonious() {
    return this.divergence() <= HARMONY_THRESHOLD;
  }

  divergence() {
    if (this.monads.length < 2) return 0;
    const pairDistances = pairwise(this.monads).map(([left, right]) => distance(left.perceptions, right.perceptions));
    return mean(pairDistances);
  }

  reharmonize() {
    let report = this.synchronize();
    let passes = 1;
    while (!report.harmonious && passes < 5) {
      report = this.synchronize();
      passes += 1;
    }
    return { ...report, passes };
  }
}

export class MonadExpert {
  constructor({ id, monad, dimensions = DEFAULT_DIMENSIONS, seed = 1 } = {}) {
    if (!(monad instanceof Monad)) throw new Error('MonadExpert requires a Monad instance');
    this.id = id || `${monad.id}_expert`;
    this.monad = monad;
    this.dimensions = dimensions;
    this.rng = createRng(`${seed}:${this.id}`);
    this.kernel = Array.from({ length: dimensions }, (_, index) => Math.cos((index + 1) * PHI_INV) * (this.rng() * PHI));
    this.bias = Array.from({ length: dimensions }, (_, index) => Math.sin((index + 1) / PHI) * (this.rng() - 0.5));
    this.trace = [];
  }

  forward(perception) {
    const input = toVector(perception, this.dimensions);
    const monadic = ensureDimensions(this.monad.perceptions, this.dimensions);
    const mirrored = ensureDimensions(this.monad.mirrorField, this.dimensions);
    const fused = input.map((value, index) => {
      const kernelTerm = value * this.kernel[index];
      const monadTerm = monadic[index] * PHI_INV;
      const mirrorTerm = mirrored[index] * (1 - PHI_INV);
      return Math.tanh(kernelTerm + monadTerm + mirrorTerm + this.bias[index]);
    });
    const confidence = clamp((this.monad.clarity() + cosine(input, monadic) + vectorBalance(fused)) / 3, 0, 1);
    const activation = {
      expertId: this.id,
      vector: roundVector(fused),
      confidence,
      binaryState: projectBinaryState(fused),
      sufficientReason: inferReason(perception),
    };
    boundedPush(this.trace, activation);
    return activation;
  }

  reflect(allMonads = []) {
    const reflection = this.monad.mirror(allMonads);
    const resonance = cosine(reflection, this.monad.perceptions);
    const summary = {
      expertId: this.id,
      reflection: [...reflection],
      resonance,
      clarity: this.monad.clarity(),
    };
    boundedPush(this.trace, summary);
    return summary;
  }

  predict(dt = 1) {
    const preserved = {
      perceptions: [...this.monad.perceptions],
      mirrorField: [...this.monad.mirrorField],
      derivative: [...this.monad.derivative],
      binaryState: this.monad.binaryState,
      lastTimestamp: this.monad.lastTimestamp,
      historyLength: this.monad.history.length,
      reasonsLength: this.monad.reasons.length,
    };

    const snapshot = this.monad.appetiteStep(dt);
    const projection = this.forward(snapshot.perceptions);
    const perfectionBias = (this.monad.clarity() + this.monad.distinctness()) / 2;

    this.monad.perceptions = preserved.perceptions;
    this.monad.mirrorField = preserved.mirrorField;
    this.monad.derivative = preserved.derivative;
    this.monad.binaryState = preserved.binaryState;
    this.monad.lastTimestamp = preserved.lastTimestamp;
    this.monad.history.splice(preserved.historyLength);
    this.monad.reasons.splice(preserved.reasonsLength);

    return {
      expertId: this.id,
      dt,
      state: snapshot,
      projection,
      perfectionBias,
    };
  }
}

export class OptimalityGating {
  constructor({ numExperts = DEFAULT_MONADS, dimensions = DEFAULT_DIMENSIONS } = {}) {
    this.numExperts = numExperts;
    this.dimensions = dimensions;
    this.experts = [];
    this.lastRoute = null;
  }

  perfectionScore(expert) {
    if (!(expert instanceof MonadExpert)) return 0;
    const monad = expert.monad;
    const clarity = monad.clarity();
    const distinctness = monad.distinctness();
    const balance = phiBalance(clarity + EPSILON, distinctness + EPSILON);
    return clamp((clarity + distinctness + balance) / 3, 0, 1);
  }

  route(observation) {
    const input = toVector(observation, this.dimensions);
    const activations = this.experts.map((expert) => {
      const activation = expert.forward(input);
      const clarityBias = expert.monad.clarity();
      const alignment = cosine(input, expert.monad.perceptions);
      const perfection = this.perfectionScore(expert);
      const score = activation.confidence * 0.35 + clarityBias * 0.25 + alignment * 0.2 + perfection * 0.2;
      return { expert, activation, clarityBias, alignment, perfection, score };
    }).sort((left, right) => right.score - left.score);

    const weights = softmax(activations.map((entry) => entry.score * PHI));
    const ranked = activations.map((entry, index) => ({
      expertId: entry.expert.id,
      monadId: entry.expert.monad.id,
      score: entry.score,
      clarity: entry.clarityBias,
      perfection: entry.perfection,
      weight: weights[index] || 0,
      activation: entry.activation,
    }));

    const selected = ranked[0] || null;
    this.lastRoute = {
      selectedId: selected?.expertId || null,
      monadId: selected?.monadId || null,
      weights: Object.fromEntries(ranked.map((entry) => [entry.expertId, entry.weight])),
      ranked,
      observation: input,
    };
    return this.lastRoute;
  }
}

export class MoELeibniz {
  constructor({ dimensions = DEFAULT_DIMENSIONS, numMonads = DEFAULT_MONADS, seed = 1 } = {}) {
    this.dimensions = dimensions;
    this.numMonads = numMonads;
    this.seed = seed;
    this.rng = createRng(seed);
    this.tick = 0;
    this.history = [];
    this.constraints = [
      { type: 'maxDivergence', value: PHI },
      { type: 'minClarity', value: PHI_INV / 2 },
    ];

    this.monads = Array.from({ length: numMonads }, (_, index) => {
      const phase = index / Math.max(1, numMonads);
      const initial = goldenGradient(dimensions, phase).map((value) => value + (this.rng() - 0.5) * PHI_INV);
      const appetition = ({ dt, monad }) => monad.perceptions.map((value, dim) => value + Math.sin((this.tick + dt + dim + index) / PHI) * PHI_INV);
      return new Monad({ id: `monad_${index + 1}`, perceptions: initial, appetition });
    });

    this.experts = this.monads.map((monad, index) => new MonadExpert({
      id: `expert_${index + 1}`,
      monad,
      dimensions,
      seed: `${seed}:${index}`,
    }));

    this.gating = new OptimalityGating({ numExperts: numMonads, dimensions });
    this.gating.experts = this.experts;
    this.harmonyEngine = new PreEstablishedHarmony({ monads: this.monads });
  }

  observe(reality) {
    const observation = toVector(reality, this.dimensions);
    const perceptions = this.monads.map((monad, index) => {
      const phaseVector = observation.map((value, dim) => value + Math.sin((index + 1) * (dim + 1) / PHI) * PHI_INV * 0.1);
      return monad.perceive(phaseVector);
    });
    const harmony = this.harmonyEngine.synchronize();
    const route = this.gating.route(observation);
    const aggregate = this._aggregateRoute(route.ranked);
    const world = new PossibleWorld({ monads: this.monads, constraints: this.constraints });
    const snapshot = {
      tick: this.tick,
      observation,
      perceptions,
      harmony,
      route,
      aggregate,
      world,
      perfection: world.perfection(),
      binaryState: projectBinaryState(aggregate),
      sufficientReason: inferReason(reality),
    };
    boundedPush(this.history, snapshot);
    return snapshot;
  }

  bestWorld(candidates = []) {
    const worlds = candidates.map((candidate) => {
      if (candidate instanceof PossibleWorld) return candidate;
      if (candidate && Array.isArray(candidate.monads)) return new PossibleWorld({ monads: candidate.monads, constraints: candidate.constraints || this.constraints });
      if (candidate && candidate.aggregate) {
        const virtualMonads = this.monads.map((monad, index) => new Monad({
          id: `${monad.id}_candidate_${index}`,
          perceptions: blend(candidate.aggregate, monad.perceptions, PHI_INV),
          appetition: monad.appetition,
        }));
        return new PossibleWorld({ monads: virtualMonads, constraints: this.constraints });
      }
      return new PossibleWorld({ monads: this.monads, constraints: this.constraints });
    });

    const current = new PossibleWorld({ monads: this.monads, constraints: this.constraints });
    worlds.push(current);
    const viable = worlds.filter((world) => world.isCompossible(current));
    const ranked = (viable.length ? viable : worlds).sort((left, right) => right.perfection() - left.perfection());
    return {
      world: ranked[0],
      score: ranked[0]?.perfection() || 0,
      candidates: ranked.map((world) => ({ id: world.id, perfection: world.perfection(), order: world.order(), variety: world.variety() })),
    };
  }

  predict(horizon = 1) {
    const steps = [];
    for (let stepIndex = 1; stepIndex <= Math.max(1, horizon); stepIndex += 1) {
      const dt = stepIndex / PHI;
      const forecasts = this.experts.map((expert) => expert.predict(dt));
      const ranked = forecasts.sort((left, right) => (right.projection.confidence + right.perfectionBias) - (left.projection.confidence + left.perfectionBias));
      const aggregate = this._aggregateVectors(ranked.map((forecast) => forecast.projection.vector), normalizeWeights(ranked.map((forecast) => forecast.projection.confidence + forecast.perfectionBias + EPSILON)));
      const futureWorld = new PossibleWorld({ monads: this.monads, constraints: this.constraints });
      steps.push({
        dt,
        leader: ranked[0]?.expertId || null,
        aggregate,
        binaryState: projectBinaryState(aggregate),
        perfection: futureWorld.perfection(),
        harmony: this.harmony(),
      });
    }
    return steps;
  }

  harmony() {
    return {
      divergence: this.harmonyEngine.divergence(),
      harmonious: this.harmonyEngine.isHarmonious(),
      consensus: [...this.harmonyEngine.consensus],
      clarityMean: mean(this.monads.map((monad) => monad.clarity())),
      distinctnessMean: mean(this.monads.map((monad) => monad.distinctness())),
    };
  }

  step(dt = 1) {
    const evolved = this.monads.map((monad) => monad.appetiteStep(dt));
    const harmony = this.harmonyEngine.reharmonize();
    const world = new PossibleWorld({ monads: this.monads, constraints: this.constraints });
    this.tick += 1;
    const state = {
      tick: this.tick,
      dt,
      evolved,
      harmony,
      perfection: world.perfection(),
      binaryCosmos: this.monads.reduce((total, monad, index) => total + monad.binaryState * (2 ** index), 0),
    };
    boundedPush(this.history, state);
    return state;
  }

  metrics() {
    const world = new PossibleWorld({ monads: this.monads, constraints: this.constraints });
    const route = this.gating.lastRoute || { selectedId: null, weights: {}, ranked: [] };
    const reasons = this.monads.flatMap((monad) => monad.reasons);
    const clarityValues = this.monads.map((monad) => monad.clarity());
    const distinctnessValues = this.monads.map((monad) => monad.distinctness());
    return {
      dimensions: this.dimensions,
      numMonads: this.numMonads,
      tick: this.tick,
      perfection: world.perfection(),
      variety: world.variety(),
      order: world.order(),
      harmony: this.harmony(),
      route: {
        selectedId: route.selectedId,
        weights: route.weights,
        scores: Object.fromEntries((route.ranked || []).map((entry) => [entry.expertId, entry.score])),
      },
      clarity: {
        mean: mean(clarityValues),
        max: clarityValues.slice().sort(compareNumbersDescending)[0] || 0,
        min: clarityValues.slice().sort((a, b) => a - b)[0] || 0,
      },
      distinctness: {
        mean: mean(distinctnessValues),
        max: distinctnessValues.slice().sort(compareNumbersDescending)[0] || 0,
        min: distinctnessValues.slice().sort((a, b) => a - b)[0] || 0,
      },
      binaryCosmos: this.monads.reduce((total, monad, index) => total + monad.binaryState * (2 ** index), 0),
      sufficientReasons: reasons.length,
      recentReasons: reasons.slice(-Math.ceil(PHI_SQ * 3)),
      historyDepth: this.history.length,
      phiResonance: phiBalance(world.variety() + EPSILON, world.order() + EPSILON),
    };
  }

  _aggregateRoute(ranked = []) {
    if (!ranked.length) return Array.from({ length: this.dimensions }, () => 0);
    const vectors = ranked.map((entry) => entry.activation.vector);
    const weights = normalizeWeights(ranked.map((entry) => entry.weight + EPSILON));
    return this._aggregateVectors(vectors, weights);
  }

  _aggregateVectors(vectors, weights) {
    if (!vectors.length) return Array.from({ length: this.dimensions }, () => 0);
    const base = Array.from({ length: this.dimensions }, () => 0);
    const aggregate = vectors.reduce((acc, vector, index) => add(acc, scale(ensureDimensions(vector, this.dimensions), weights[index] || 0)), base);
    return roundVector(aggregate);
  }
}

export default {
  PHI,
  PHI_INV,
  PHI_SQ,
  TAU,
  PI,
  EPSILON,
  Monad,
  PossibleWorld,
  PreEstablishedHarmony,
  MonadExpert,
  OptimalityGating,
  MoELeibniz,
};

/// Casa de Medina — Architectos de Architectura Inteligente
