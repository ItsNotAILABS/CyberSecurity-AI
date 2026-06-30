///
/// @medina/moe-democritus — MIXTURE OF EXPERTS: DEMOCRITUS
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║   DEMOCRITUS — ATOMIC WORLD MODEL via DISCRETE STATE LATTICE                ║
/// ║                                                                              ║
/// ║  Named for Democritus of Abdera — architect of atomic theory.               ║
/// ║                                                                              ║
/// ║  Architecture: World model with discrete, indivisible state-atoms arranged  ║
/// ║  on a φ-lattice. Each expert specializes in a class of atoms by shape,      ║
/// ║  arrangement, and position. World prediction = predicting atomic            ║
/// ║  rearrangements across void space.                                           ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Atomic state: atom = {shape: S, position: p, momentum: q}             ║
/// ║    • Void fraction: V = 1 − Σ|atom_k|/|space|                               ║
/// ║    • φ-Lattice spacing: Δx = λ₀·φⁿ — golden quantized coordinates          ║
/// ║    • Collision dynamics:                                                    ║
/// ║      p'₁ = p₁ − (2m₂/(m₁+m₂))·((v₁−v₂)·(x₁−x₂)/|x₁−x₂|²)·(x₁−x₂)          ║
/// ║    • Shape classes: convex hull vertices V_s from Pythagorean triangles     ║
/// ║    • Arrangement energy: E = −Σᵢⱼ J(sᵢ,sⱼ)·φ^(−|rᵢ−rⱼ|/Δx)                 ║
/// ║    • Clinamen (swerve): δp = ε·φ⁻ⁿ — spontaneous deviation enabling will    ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI * PHI;
export const EPSILON = 1e-9;
export const TAU = Math.PI * 2;
export const ATOM_SHAPES = Object.freeze(['sphere', 'hook', 'ring', 'blade', 'pyramid']);

const DEFAULT_DIMENSIONS = 3;
const DEFAULT_LATTICE_SPACING = PHI_INV;
const DEFAULT_COLLISION_RADIUS = PHI_INV;
const DEFAULT_SWERVE_SCALE = EPSILON * PHI;
const DEFAULT_BOUND_EXTENT = PHI_SQ * 8;
const DEFAULT_PREDICTION_DECAY = PHI_INV;
const DEFAULT_MAX_NEIGHBOR_RADIUS = PHI_SQ;
const SHAPE_FACTORS = Object.freeze({
  sphere: 1,
  hook: PHI_INV,
  ring: PHI,
  blade: Math.sqrt(PHI),
  pyramid: PHI_SQ / 2
});
const SHAPE_VERTEX_COUNTS = Object.freeze({
  sphere: 12,
  hook: 9,
  ring: 10,
  blade: 7,
  pyramid: 5
});
const SHAPE_COUPLINGS = Object.freeze({
  sphere: Object.freeze({ sphere: PHI, hook: PHI_INV, ring: PHI_INV, blade: 1, pyramid: PHI_SQ / 3 }),
  hook: Object.freeze({ sphere: PHI_INV, hook: PHI, ring: 1, blade: PHI_SQ / 3, pyramid: PHI_INV }),
  ring: Object.freeze({ sphere: PHI_INV, hook: 1, ring: PHI_SQ / 2, blade: PHI_INV, pyramid: PHI }),
  blade: Object.freeze({ sphere: 1, hook: PHI_SQ / 3, ring: PHI_INV, blade: PHI, pyramid: PHI_INV }),
  pyramid: Object.freeze({ sphere: PHI_SQ / 3, hook: PHI_INV, ring: PHI, blade: PHI_INV, pyramid: PHI_SQ / 2 })
});

const freeze = (value) => Object.freeze(value);
const isFiniteNumber = (value) => typeof value === 'number' && Number.isFinite(value);
const isPositiveNumber = (value) => isFiniteNumber(value) && value > 0;
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const sum = (values) => values.reduce((total, value) => total + value, 0);
const mean = (values) => values.length ? sum(values) / values.length : 0;
const round = (value, digits = 12) => Math.round(value * (10 ** digits)) / (10 ** digits);
const unique = (values) => [...new Set(values)];

function createSeed(seed = 0) {
  if (typeof seed === 'number' && Number.isFinite(seed)) return seed >>> 0;
  const text = String(seed);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

class PhiRandom {
  constructor(seed = 0) {
    this.state = createSeed(seed) || 0x9e3779b9;
  }

  next() {
    this.state += 0x6D2B79F5;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  signed(scale = 1) {
    return (this.next() * 2 - 1) * scale;
  }

  int(maxExclusive) {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) throw new RangeError('maxExclusive must be a positive integer.');
    return Math.floor(this.next() * maxExclusive);
  }

  pick(values) {
    if (!Array.isArray(values) || values.length === 0) return undefined;
    return values[this.int(values.length)];
  }

  fork(offset = 1) {
    return new PhiRandom((this.state ^ createSeed(offset)) >>> 0);
  }
}

function ensureDimensions(dimensions = DEFAULT_DIMENSIONS) {
  if (!Number.isInteger(dimensions) || dimensions <= 0) throw new RangeError('dimensions must be a positive integer.');
  return dimensions;
}

function ensureShape(shape) {
  const normalized = String(shape ?? '').trim().toLowerCase();
  if (!ATOM_SHAPES.includes(normalized)) throw new TypeError(`Unsupported atom shape: ${shape}`);
  return normalized;
}

function ensureVector(vector, dimensions, fallback = 0) {
  if (Array.isArray(vector)) {
    return Array.from({ length: dimensions }, (_, index) => {
      const value = vector[index] ?? fallback;
      return isFiniteNumber(value) ? value : fallback;
    });
  }
  if (isFiniteNumber(vector)) return Array.from({ length: dimensions }, () => vector);
  return Array.from({ length: dimensions }, () => fallback);
}

function cloneVector(vector, dimensions = vector.length) {
  return ensureVector(vector, dimensions, 0);
}

function zeroVector(dimensions) {
  return Array.from({ length: dimensions }, () => 0);
}

function addVectors(left, right) {
  return left.map((value, index) => value + (right[index] ?? 0));
}

function subtractVectors(left, right) {
  return left.map((value, index) => value - (right[index] ?? 0));
}

function scaleVector(vector, scalar) {
  return vector.map((value) => value * scalar);
}

function dot(left, right) {
  return left.reduce((total, value, index) => total + value * (right[index] ?? 0), 0);
}

function magnitudeSquared(vector) {
  return dot(vector, vector);
}

function magnitude(vector) {
  return Math.sqrt(magnitudeSquared(vector));
}

function distance(left, right) {
  return magnitude(subtractVectors(left, right));
}

function normalize(vector) {
  const norm = magnitude(vector);
  return norm <= EPSILON ? zeroVector(vector.length) : scaleVector(vector, 1 / norm);
}

function midpoint(left, right) {
  return left.map((value, index) => (value + (right[index] ?? 0)) / 2);
}

function quantizeScalar(value, spacing) {
  return round(Math.round(value / spacing) * spacing, 12);
}

function quantizeVector(vector, spacing) {
  return vector.map((value) => quantizeScalar(value, spacing));
}

function clampVector(vector, bounds) {
  return vector.map((value, index) => {
    const [min, max] = bounds[index] ?? [-DEFAULT_BOUND_EXTENT, DEFAULT_BOUND_EXTENT];
    return clamp(value, min, max);
  });
}

function vectorSignature(vector, digits = 6) {
  return vector.map((value) => round(value, digits)).join('|');
}

function serializeAtomLike(atom, dimensions) {
  if (atom instanceof Atom) return atom.toJSON();
  if (isPlainObject(atom)) {
    return {
      id: atom.id,
      shape: ensureShape(atom.shape ?? 'sphere'),
      position: ensureVector(atom.position, dimensions),
      momentum: ensureVector(atom.momentum, dimensions),
      mass: isPositiveNumber(atom.mass) ? atom.mass : 1
    };
  }
  throw new TypeError('Atom-like value must be an Atom instance or plain object.');
}

function shapeCoupling(shapeA, shapeB) {
  return SHAPE_COUPLINGS[shapeA]?.[shapeB] ?? PHI_INV;
}

function pythagoreanVertices(shape) {
  const count = SHAPE_VERTEX_COUNTS[shape] ?? 3;
  return Array.from({ length: count }, (_, index) => {
    const a = index + 3;
    const b = index + 4;
    return Math.sqrt((a * a) + (b * b));
  });
}

function phiDecay(distanceValue, spacing = DEFAULT_LATTICE_SPACING) {
  return PHI ** (-Math.max(0, distanceValue) / Math.max(spacing, EPSILON));
}

function effectiveAtomVolume(shape, mass, dimensions) {
  const factor = SHAPE_FACTORS[shape] ?? 1;
  return Math.max(EPSILON, factor * Math.max(mass, EPSILON) * (PHI_INV ** Math.max(1, dimensions - 1)));
}

function collisionRadius(atom) {
  return DEFAULT_COLLISION_RADIUS * ((effectiveAtomVolume(atom.shape, atom.mass, atom.dimensions) / PHI_INV) ** (1 / atom.dimensions));
}

function pairKey(leftId, rightId) {
  return leftId < rightId ? `${leftId}::${rightId}` : `${rightId}::${leftId}`;
}

function stableId(prefix, rng) {
  const a = Math.floor(rng.next() * 36 ** 4).toString(36).padStart(4, '0');
  const b = Math.floor(rng.next() * 36 ** 4).toString(36).padStart(4, '0');
  return `${prefix}-${a}${b}`;
}

export class Atom {
  constructor({ id, shape = 'sphere', position = [0, 0, 0], momentum = [0, 0, 0], mass = 1 } = {}) {
    const inferredDimensions = Array.isArray(position)
      ? position.length
      : (Array.isArray(momentum) ? momentum.length : DEFAULT_DIMENSIONS);
    this.dimensions = ensureDimensions(inferredDimensions || DEFAULT_DIMENSIONS);
    this.id = String(id ?? `atom-${Math.random().toString(36).slice(2, 10)}`);
    this.shape = ensureShape(shape);
    this.position = ensureVector(position, this.dimensions);
    this.momentum = ensureVector(momentum, this.dimensions);
    this.mass = isPositiveNumber(mass) ? mass : 1;
  }

  velocity() {
    return scaleVector(this.momentum, 1 / Math.max(this.mass, EPSILON));
  }

  speed() {
    return magnitude(this.velocity());
  }

  kineticEnergy() {
    return magnitudeSquared(this.momentum) / (2 * Math.max(this.mass, EPSILON));
  }

  effectiveVolume() {
    return effectiveAtomVolume(this.shape, this.mass, this.dimensions);
  }

  clone(overrides = {}) {
    return new Atom({
      id: overrides.id ?? this.id,
      shape: overrides.shape ?? this.shape,
      position: overrides.position ?? cloneVector(this.position, this.dimensions),
      momentum: overrides.momentum ?? cloneVector(this.momentum, this.dimensions),
      mass: overrides.mass ?? this.mass
    });
  }

  translate(delta) {
    this.position = addVectors(this.position, ensureVector(delta, this.dimensions));
    return this;
  }

  swerve(magnitudeScale = 1) {
    const rank = Math.max(0, Math.round(Math.abs(magnitudeScale)));
    const amplitude = DEFAULT_SWERVE_SCALE * (PHI ** (-rank));
    const directionSeed = createSeed(`${this.id}:${this.shape}:${rank}`);
    const rng = new PhiRandom(directionSeed);
    const direction = normalize(Array.from({ length: this.dimensions }, () => rng.signed(1)));
    const deltaMomentum = scaleVector(direction, amplitude * Math.max(1, Math.abs(magnitudeScale)));
    this.momentum = addVectors(this.momentum, deltaMomentum);
    return {
      atomId: this.id,
      deltaMomentum: cloneVector(deltaMomentum, this.dimensions),
      magnitude: magnitude(deltaMomentum),
      rule: 'δp = ε·φ⁻ⁿ'
    };
  }

  interact(otherAtom) {
    if (!(otherAtom instanceof Atom)) throw new TypeError('otherAtom must be an Atom instance.');
    if (otherAtom.id === this.id) throw new RangeError('Atom cannot interact with itself.');
    if (otherAtom.dimensions !== this.dimensions) throw new RangeError('Atoms must inhabit the same dimensionality.');

    const x1 = cloneVector(this.position, this.dimensions);
    const x2 = cloneVector(otherAtom.position, this.dimensions);
    const p1 = cloneVector(this.momentum, this.dimensions);
    const p2 = cloneVector(otherAtom.momentum, this.dimensions);
    const m1 = Math.max(this.mass, EPSILON);
    const m2 = Math.max(otherAtom.mass, EPSILON);
    const v1 = scaleVector(p1, 1 / m1);
    const v2 = scaleVector(p2, 1 / m2);
    const dx12 = subtractVectors(x1, x2);
    const dx21 = scaleVector(dx12, -1);
    const rel12 = subtractVectors(v1, v2);
    const rel21 = subtractVectors(v2, v1);
    const separationSq = magnitudeSquared(dx12);

    if (separationSq <= EPSILON) {
      return {
        collided: false,
        reason: 'Atoms occupy indistinguishable lattice coordinates.',
        before: { left: p1, right: p2 },
        after: { left: p1, right: p2 }
      };
    }

    if (dot(rel12, dx12) >= 0) {
      return {
        collided: false,
        reason: 'Atoms are not approaching.',
        before: { left: p1, right: p2 },
        after: { left: p1, right: p2 }
      };
    }

    const factor1 = (2 * m2 / (m1 + m2)) * (dot(rel12, dx12) / separationSq);
    const factor2 = (2 * m1 / (m1 + m2)) * (dot(rel21, dx21) / separationSq);
    const v1Prime = subtractVectors(v1, scaleVector(dx12, factor1));
    const v2Prime = subtractVectors(v2, scaleVector(dx21, factor2));
    const p1Prime = scaleVector(v1Prime, m1);
    const p2Prime = scaleVector(v2Prime, m2);
    const energyBefore = this.kineticEnergy() + otherAtom.kineticEnergy();

    this.momentum = p1Prime;
    otherAtom.momentum = p2Prime;

    const energyAfter = this.kineticEnergy() + otherAtom.kineticEnergy();
    return {
      collided: true,
      left: this.id,
      right: otherAtom.id,
      before: { left: p1, right: p2 },
      after: { left: cloneVector(p1Prime, this.dimensions), right: cloneVector(p2Prime, this.dimensions) },
      energyBefore,
      energyAfter,
      conserved: Math.abs(energyBefore - energyAfter) <= Math.max(EPSILON, energyBefore * 1e-6)
    };
  }

  toJSON() {
    return {
      id: this.id,
      shape: this.shape,
      position: cloneVector(this.position, this.dimensions),
      momentum: cloneVector(this.momentum, this.dimensions),
      mass: this.mass,
      dimensions: this.dimensions,
      kineticEnergy: this.kineticEnergy(),
      effectiveVolume: this.effectiveVolume()
    };
  }
}

export class VoidLattice {
  constructor({ dimensions = DEFAULT_DIMENSIONS, spacing = DEFAULT_LATTICE_SPACING, bounds } = {}) {
    this.dimensions = ensureDimensions(dimensions);
    this.spacing = isPositiveNumber(spacing) ? spacing : DEFAULT_LATTICE_SPACING;
    this.bounds = Array.isArray(bounds)
      ? Array.from({ length: this.dimensions }, (_, index) => {
        const entry = bounds[index];
        if (Array.isArray(entry) && entry.length >= 2) return [Number(entry[0]), Number(entry[1])].sort((a, b) => a - b);
        return [-DEFAULT_BOUND_EXTENT, DEFAULT_BOUND_EXTENT];
      })
      : Array.from({ length: this.dimensions }, () => [-DEFAULT_BOUND_EXTENT, DEFAULT_BOUND_EXTENT]);
    this.atoms = new Map();
    this.cells = new Map();
  }

  cellKey(position) {
    return quantizeVector(position, this.spacing).join(':');
  }

  quantize(position) {
    return clampVector(quantizeVector(ensureVector(position, this.dimensions), this.spacing), this.bounds);
  }

  boundsVolume() {
    return this.bounds.reduce((volume, [min, max]) => volume * Math.max(EPSILON, max - min), 1);
  }

  inBounds(position) {
    return position.every((value, index) => {
      const [min, max] = this.bounds[index];
      return value >= min - EPSILON && value <= max + EPSILON;
    });
  }

  place(atom, position = atom?.position) {
    if (!(atom instanceof Atom)) throw new TypeError('VoidLattice.place expects an Atom instance.');
    if (atom.dimensions !== this.dimensions) throw new RangeError('Atom dimensions must match the lattice dimensions.');

    if (this.atoms.has(atom.id)) this.remove(atom.id);

    const quantizedPosition = this.quantize(position);
    if (!this.inBounds(quantizedPosition)) throw new RangeError('Position lies outside lattice bounds.');

    atom.position = quantizedPosition;
    this.atoms.set(atom.id, atom);

    const key = this.cellKey(quantizedPosition);
    const occupants = this.cells.get(key) ?? new Set();
    occupants.add(atom.id);
    this.cells.set(key, occupants);

    return atom;
  }

  remove(id) {
    const atom = this.atoms.get(id);
    if (!atom) return null;
    const key = this.cellKey(atom.position);
    const occupants = this.cells.get(key);
    if (occupants) {
      occupants.delete(id);
      if (occupants.size === 0) this.cells.delete(key);
    }
    this.atoms.delete(id);
    return atom;
  }

  get(id) {
    return this.atoms.get(id) ?? null;
  }

  neighbors(position, radius = this.spacing * DEFAULT_MAX_NEIGHBOR_RADIUS) {
    const center = this.quantize(position);
    const radiusValue = Math.max(this.spacing, radius);
    const stepRadius = Math.ceil(radiusValue / this.spacing);
    const indices = center.map((value) => Math.round(value / this.spacing));
    const results = new Map();
    const walk = (axis, prefix) => {
      if (axis >= this.dimensions) {
        const key = prefix.map((index) => round(index * this.spacing, 12)).join(':');
        const occupants = this.cells.get(key);
        if (!occupants) return;
        for (const atomId of occupants) {
          const atom = this.atoms.get(atomId);
          if (!atom) continue;
          if (distance(atom.position, center) <= radiusValue + EPSILON) results.set(atom.id, atom);
        }
        return;
      }
      for (let delta = -stepRadius; delta <= stepRadius; delta += 1) {
        walk(axis + 1, prefix.concat(indices[axis] + delta));
      }
    };
    walk(0, []);
    return [...results.values()].sort((left, right) => distance(left.position, center) - distance(right.position, center));
  }

  occupancy() {
    return this.cells.size;
  }

  voidFraction() {
    const occupied = sum([...this.atoms.values()].map((atom) => atom.effectiveVolume()));
    return clamp(1 - (occupied / Math.max(this.boundsVolume(), EPSILON)), 0, 1);
  }

  snapshot() {
    return {
      dimensions: this.dimensions,
      spacing: this.spacing,
      bounds: this.bounds.map(([min, max]) => [min, max]),
      occupancy: this.occupancy(),
      atoms: [...this.atoms.values()].map((atom) => atom.toJSON()),
      voidFraction: this.voidFraction()
    };
  }
}

export class AtomicExpert {
  constructor({ id, shapeClass, dimensions = DEFAULT_DIMENSIONS, seed = 0 } = {}) {
    this.id = String(id ?? `expert-${shapeClass ?? 'atom'}`);
    this.shapeClass = ensureShape(shapeClass ?? 'sphere');
    this.dimensions = ensureDimensions(dimensions);
    this.seed = createSeed(`${seed}:${this.id}:${this.shapeClass}`);
    this.rng = new PhiRandom(this.seed);
    this.prototypeVertices = freeze(pythagoreanVertices(this.shapeClass));
    this.resonance = SHAPE_FACTORS[this.shapeClass] ?? 1;
    this.forwardPasses = 0;
  }

  shapeAffinity(atom) {
    const shape = atom instanceof Atom ? atom.shape : ensureShape(atom?.shape ?? this.shapeClass);
    return shape === this.shapeClass ? PHI : shapeCoupling(shape, this.shapeClass);
  }

  forward(atomState) {
    const atom = atomState instanceof Atom ? atomState : new Atom(serializeAtomLike(atomState, this.dimensions));
    const latticeLevel = mean(atom.position.map((coordinate) => Math.log(Math.abs(coordinate) / DEFAULT_LATTICE_SPACING + 1) / Math.log(PHI)));
    const velocity = atom.velocity();
    const speed = magnitude(velocity);
    const direction = normalize(velocity);
    const affinity = this.shapeAffinity(atom);
    const massBias = Math.log(atom.mass + PHI);
    const positionBias = phiDecay(magnitude(atom.position), DEFAULT_LATTICE_SPACING);
    const momentumBias = phiDecay(magnitude(atom.momentum), atom.mass + DEFAULT_LATTICE_SPACING);
    const signature = freeze({
      expertId: this.id,
      shapeClass: this.shapeClass,
      affinity,
      latticeLevel,
      prototypeVertices: [...this.prototypeVertices],
      resonance: this.resonance
    });
    const predictedMomentum = scaleVector(atom.momentum, clamp(affinity * PHI_INV, PHI_INV ** 2, PHI));
    const predictedPosition = quantizeVector(
      addVectors(atom.position, scaleVector(direction, speed * DEFAULT_PREDICTION_DECAY * affinity)),
      DEFAULT_LATTICE_SPACING
    );

    this.forwardPasses += 1;
    return {
      atom: atom.toJSON(),
      signature,
      latent: [round(affinity, 6), round(massBias, 6), round(positionBias, 6), round(momentumBias, 6), round(speed, 6), round(latticeLevel, 6)],
      predictedPosition,
      predictedMomentum,
      score: affinity * (1 + positionBias + momentumBias) / PHI,
      rationale: `${this.id} specializes in ${this.shapeClass} atoms and projects φ-lattice motion.`
    };
  }

  predictCollision(atom1, atom2) {
    const left = atom1 instanceof Atom ? atom1.clone() : new Atom(serializeAtomLike(atom1, this.dimensions));
    const right = atom2 instanceof Atom ? atom2.clone() : new Atom(serializeAtomLike(atom2, this.dimensions));
    const separation = distance(left.position, right.position);
    const threshold = collisionRadius(left) + collisionRadius(right);
    const affinity = (this.shapeAffinity(left) + this.shapeAffinity(right)) / 2;
    const willCollide = separation <= threshold + this.resonance * PHI_INV;
    const simulated = willCollide ? left.interact(right) : {
      collided: false,
      reason: 'Predicted separation exceeds collision threshold.',
      before: { left: cloneVector(left.momentum, this.dimensions), right: cloneVector(right.momentum, this.dimensions) },
      after: { left: cloneVector(left.momentum, this.dimensions), right: cloneVector(right.momentum, this.dimensions) }
    };

    return {
      expertId: this.id,
      shapeClass: this.shapeClass,
      separation,
      threshold,
      affinity,
      willCollide,
      outcome: simulated,
      confidence: clamp((threshold / Math.max(separation, EPSILON)) * affinity * PHI_INV, 0, PHI)
    };
  }

  arrangementEnergy(atoms) {
    const list = Array.from(atoms ?? []).map((atom) => atom instanceof Atom ? atom : new Atom(serializeAtomLike(atom, this.dimensions)));
    let energy = 0;
    for (let i = 0; i < list.length; i += 1) {
      for (let j = i + 1; j < list.length; j += 1) {
        const left = list[i];
        const right = list[j];
        const coupling = shapeCoupling(left.shape, right.shape) * this.shapeAffinity(left) * this.shapeAffinity(right) * PHI_INV;
        const separation = distance(left.position, right.position);
        energy += -coupling * phiDecay(separation, DEFAULT_LATTICE_SPACING);
      }
    }
    return round(energy, 12);
  }

  summary() {
    return {
      id: this.id,
      shapeClass: this.shapeClass,
      dimensions: this.dimensions,
      forwardPasses: this.forwardPasses,
      resonance: this.resonance,
      prototypeVertices: [...this.prototypeVertices]
    };
  }
}

export class AtomicGating {
  constructor({ numExperts = ATOM_SHAPES.length, dimensions = DEFAULT_DIMENSIONS } = {}) {
    this.numExperts = Math.max(1, Math.floor(numExperts));
    this.dimensions = ensureDimensions(dimensions);
    this.shapeAssignments = Array.from({ length: this.numExperts }, (_, index) => ATOM_SHAPES[index % ATOM_SHAPES.length]);
  }

  classify(atom) {
    const state = atom instanceof Atom ? atom : new Atom(serializeAtomLike(atom, this.dimensions));
    const positionNorm = magnitude(state.position);
    const momentumNorm = magnitude(state.momentum);
    const candidates = this.shapeAssignments.map((shapeClass, index) => {
      const shapeMatch = state.shape === shapeClass ? PHI : shapeCoupling(state.shape, shapeClass);
      const positionalBias = phiDecay(positionNorm + index * PHI_INV, DEFAULT_LATTICE_SPACING * PHI);
      const momentumBias = phiDecay(momentumNorm * (index + 1), state.mass + DEFAULT_LATTICE_SPACING);
      const score = shapeMatch * (1 + positionalBias + momentumBias * PHI_INV);
      return {
        expertIndex: index,
        expertId: `atomic-expert-${index + 1}`,
        shapeClass,
        shapeMatch,
        score
      };
    }).sort((left, right) => right.score - left.score);

    const total = sum(candidates.map((candidate) => candidate.score)) || 1;
    const normalized = candidates.map((candidate) => ({
      ...candidate,
      weight: candidate.score / total
    }));
    const primary = normalized[0];

    return {
      atomId: state.id,
      shape: state.shape,
      expertIndex: primary.expertIndex,
      expertId: primary.expertId,
      shapeClass: primary.shapeClass,
      confidence: primary.weight,
      candidates: normalized,
      rationale: `Shape ${state.shape} routed to ${primary.shapeClass} expert with φ-weighted affinity.`
    };
  }

  route(observation) {
    const atoms = observation instanceof Atom
      ? [observation]
      : Array.isArray(observation)
        ? observation.map((entry) => entry instanceof Atom ? entry : new Atom(serializeAtomLike(entry, this.dimensions)))
        : Array.isArray(observation?.atoms)
          ? observation.atoms.map((entry) => entry instanceof Atom ? entry : new Atom(serializeAtomLike(entry, this.dimensions)))
          : [];
    const assignments = atoms.map((atom) => this.classify(atom));
    const expertLoad = assignments.reduce((map, assignment) => {
      map[assignment.expertId] = (map[assignment.expertId] || 0) + assignment.confidence;
      return map;
    }, {});
    const dominant = Object.entries(expertLoad).sort((left, right) => right[1] - left[1])[0] ?? null;

    return {
      count: atoms.length,
      assignments,
      expertLoad,
      dominantExpert: dominant ? { expertId: dominant[0], load: dominant[1] } : null,
      uniqueShapes: unique(assignments.map((assignment) => assignment.shape))
    };
  }
}

export class MoEDemocritus {
  constructor({ dimensions = DEFAULT_DIMENSIONS, numExperts = ATOM_SHAPES.length, latticeSpacing = DEFAULT_LATTICE_SPACING, seed = 0 } = {}) {
    this.dimensions = ensureDimensions(dimensions);
    this.numExperts = Math.max(1, Math.floor(numExperts));
    this.latticeSpacing = isPositiveNumber(latticeSpacing) ? latticeSpacing : DEFAULT_LATTICE_SPACING;
    this.seed = createSeed(seed);
    this.rng = new PhiRandom(this.seed);
    this.gating = new AtomicGating({ numExperts: this.numExperts, dimensions: this.dimensions });
    this.experts = this.gating.shapeAssignments.map((shapeClass, index) => new AtomicExpert({
      id: `atomic-expert-${index + 1}`,
      shapeClass,
      dimensions: this.dimensions,
      seed: `${this.seed}:${index}:${shapeClass}`
    }));
    this.lattice = new VoidLattice({
      dimensions: this.dimensions,
      spacing: this.latticeSpacing,
      bounds: Array.from({ length: this.dimensions }, () => [-DEFAULT_BOUND_EXTENT, DEFAULT_BOUND_EXTENT])
    });
    this.atoms = new Map();
    this.stepCount = 0;
    this.collisionCount = 0;
    this.swerveCount = 0;
    this.predictionCount = 0;
    this.lastArrangements = [];
    this.lastEnergy = 0;
    this.lastVoidFraction = 1;
    this.history = [];
  }

  getExpert(expertIdOrIndex) {
    if (typeof expertIdOrIndex === 'number') return this.experts[expertIdOrIndex] ?? null;
    return this.experts.find((expert) => expert.id === expertIdOrIndex) ?? null;
  }

  _recordHistory(event) {
    this.history.push({ step: this.stepCount, ...event });
    if (this.history.length > 256) this.history.shift();
  }

  _coerceAtom(atomLike) {
    const atom = atomLike instanceof Atom ? atomLike.clone() : new Atom(serializeAtomLike(atomLike, this.dimensions));
    atom.position = this.lattice.quantize(atom.position);
    return atom;
  }

  _shapeDistribution() {
    return [...this.atoms.values()].reduce((distribution, atom) => {
      distribution[atom.shape] = (distribution[atom.shape] || 0) + 1;
      return distribution;
    }, {});
  }

  _arrangementEnergy() {
    const atoms = [...this.atoms.values()];
    if (!atoms.length) return 0;
    const energies = this.experts.map((expert) => expert.arrangementEnergy(atoms));
    this.lastArrangements = energies;
    this.lastEnergy = mean(energies);
    return this.lastEnergy;
  }

  _collisionPairs() {
    const visited = new Set();
    const pairs = [];
    for (const atom of this.atoms.values()) {
      const nearby = this.lattice.neighbors(atom.position, this.latticeSpacing * PHI_SQ);
      for (const neighbor of nearby) {
        if (neighbor.id === atom.id) continue;
        const key = pairKey(atom.id, neighbor.id);
        if (visited.has(key)) continue;
        visited.add(key);
        pairs.push([atom, neighbor]);
      }
    }
    return pairs;
  }

  _resolveCollisions() {
    const collisions = [];
    for (const [left, right] of this._collisionPairs()) {
      const separation = distance(left.position, right.position);
      const threshold = collisionRadius(left) + collisionRadius(right);
      if (separation > threshold + this.latticeSpacing * PHI_INV) continue;
      const route = this.gating.classify(left);
      const expert = this.getExpert(route.expertId) ?? this.experts[0];
      const forecast = expert.predictCollision(left, right);
      if (!forecast.willCollide) continue;
      const outcome = left.interact(right);
      if (!outcome.collided) continue;
      const normal = normalize(subtractVectors(left.position, right.position));
      const separationCorrection = scaleVector(normal, (threshold - separation + this.latticeSpacing * PHI_INV) / 2);
      left.position = this.lattice.quantize(addVectors(left.position, separationCorrection));
      right.position = this.lattice.quantize(subtractVectors(right.position, separationCorrection));
      this.lattice.place(left, left.position);
      this.lattice.place(right, right.position);
      this.collisionCount += 1;
      collisions.push({ expertId: expert.id, forecast, outcome, midpoint: midpoint(left.position, right.position) });
    }
    return collisions;
  }

  _advanceAtoms(dt) {
    const updates = [];
    for (const atom of this.atoms.values()) {
      const shouldSwerve = this.rng.next() < PHI_INV ** 3;
      let swerve = null;
      if (shouldSwerve) {
        swerve = atom.swerve(Math.max(1, Math.round(dt * PHI_SQ)));
        this.swerveCount += 1;
      }
      const velocity = atom.velocity();
      const nextPosition = this.lattice.quantize(clampVector(addVectors(atom.position, scaleVector(velocity, dt)), this.lattice.bounds));
      this.lattice.place(atom, nextPosition);
      updates.push({ atomId: atom.id, position: cloneVector(nextPosition, this.dimensions), velocity, swerve });
    }
    return updates;
  }

  _expertObservations() {
    return [...this.atoms.values()].map((atom) => {
      const route = this.gating.classify(atom);
      const expert = this.getExpert(route.expertId) ?? this.experts[0];
      return {
        atomId: atom.id,
        route,
        projection: expert.forward(atom)
      };
    });
  }

  _snapshotConfig() {
    return {
      dimensions: this.dimensions,
      numExperts: this.numExperts,
      latticeSpacing: this.latticeSpacing,
      seed: this.seed
    };
  }

  addAtom(atomLike) {
    const atom = this._coerceAtom(atomLike);
    this.atoms.set(atom.id, atom);
    this.lattice.place(atom, atom.position);
    const route = this.gating.classify(atom);
    this.lastVoidFraction = this.lattice.voidFraction();
    this.lastEnergy = this._arrangementEnergy();
    this._recordHistory({ type: 'add', atomId: atom.id, shape: atom.shape, route });
    return {
      atom: atom.toJSON(),
      route,
      voidFraction: this.lastVoidFraction,
      arrangementEnergy: this.lastEnergy
    };
  }

  step(dt = 1) {
    if (!isPositiveNumber(dt)) throw new RangeError('dt must be a positive number.');
    this.stepCount += 1;

    const updates = this._advanceAtoms(dt);
    const observations = this._expertObservations();
    const collisions = this._resolveCollisions();
    const voidFraction = this.lattice.voidFraction();
    const arrangementEnergy = this._arrangementEnergy();

    this.lastVoidFraction = voidFraction;
    this._recordHistory({
      type: 'step',
      dt,
      updates: updates.length,
      collisions: collisions.length,
      arrangementEnergy,
      voidFraction
    });

    return {
      step: this.stepCount,
      dt,
      updates,
      observations,
      collisions,
      arrangementEnergy,
      voidFraction,
      atomCount: this.atoms.size
    };
  }

  predict(steps = 1) {
    const horizon = Math.max(1, Math.floor(steps));
    const shadow = new MoEDemocritus(this._snapshotConfig());
    for (const atom of this.atoms.values()) shadow.addAtom(atom.clone());

    const forecasts = [];
    for (let index = 0; index < horizon; index += 1) {
      const result = shadow.step(1);
      forecasts.push({
        horizon: index + 1,
        summary: {
          atomCount: result.atomCount,
          collisions: result.collisions.length,
          arrangementEnergy: result.arrangementEnergy,
          voidFraction: result.voidFraction
        },
        state: shadow.worldState()
      });
    }

    this.predictionCount += horizon;
    this._recordHistory({ type: 'predict', steps: horizon });
    return forecasts;
  }

  worldState() {
    const atoms = [...this.atoms.values()].sort((left, right) => left.id.localeCompare(right.id));
    return {
      model: 'DEMOCRITUS',
      dimensions: this.dimensions,
      stepCount: this.stepCount,
      lattice: this.lattice.snapshot(),
      atoms: atoms.map((atom) => atom.toJSON()),
      routes: this.gating.route(atoms),
      arrangementEnergy: this.lastEnergy,
      voidFraction: this.lastVoidFraction,
      shapeDistribution: this._shapeDistribution(),
      conservedKineticEnergy: round(sum(atoms.map((atom) => atom.kineticEnergy())), 12)
    };
  }

  metrics() {
    const atoms = [...this.atoms.values()];
    const kineticEnergies = atoms.map((atom) => atom.kineticEnergy());
    const expertLoads = this.gating.route(atoms).expertLoad;
    return {
      model: 'DEMOCRITUS',
      atoms: atoms.length,
      dimensions: this.dimensions,
      steps: this.stepCount,
      collisions: this.collisionCount,
      swerves: this.swerveCount,
      predictions: this.predictionCount,
      meanKineticEnergy: round(mean(kineticEnergies), 12),
      totalKineticEnergy: round(sum(kineticEnergies), 12),
      arrangementEnergy: round(this.lastEnergy, 12),
      voidFraction: round(this.lastVoidFraction, 12),
      occupancy: this.lattice.occupancy(),
      expertLoads,
      expertSummaries: this.experts.map((expert) => expert.summary()),
      shapeDistribution: this._shapeDistribution(),
      historyDepth: this.history.length
    };
  }

  toJSON() {
    return {
      config: this._snapshotConfig(),
      state: this.worldState(),
      metrics: this.metrics()
    };
  }
}

export default freeze({
  PHI,
  PHI_INV,
  PHI_SQ,
  EPSILON,
  TAU,
  ATOM_SHAPES,
  Atom,
  VoidLattice,
  AtomicExpert,
  AtomicGating,
  MoEDemocritus
});

/// Casa de Medina — Architectos de Architectura Inteligente
