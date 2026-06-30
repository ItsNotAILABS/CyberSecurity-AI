///
/// @medina/moe-plato — MIXTURE OF EXPERTS: PLATO
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║       PLATO — IDEAL FORM EXPERT ABSTRACTION via PLATONIC TOPOLOGY           ║
/// ║                                                                              ║
/// ║  Named for Plato of Athens — philosopher of ideal forms and the cave.       ║
/// ║                                                                              ║
/// ║  Architecture: MoE structured as 5 Platonic solids, each representing       ║
/// ║  a domain of expertise. Inputs are classified by which solid's              ║
/// ║  "shadow" they most resemble (allegory of the cave). Experts live on        ║
/// ║  vertices; edges define inter-expert communication; faces are output        ║
/// ║  manifolds. The icosahedron and dodecahedron encode φ in their geometry.    ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • 5 Platonic solids: Tetra(4), Cube(6), Octa(8), Dodeca(12), Icosa(20)  ║
/// ║    • Icosahedron vertices: (0, ±1, ±φ) — φ appears in coordinates          ║
/// ║    • Dodecahedron: dual of icosahedron — face centers at φ-positions        ║
/// ║    • Euler characteristic: V − E + F = 2 — topological constraint           ║
/// ║    • Duality mapping: solid ↔ dual gives expert pair relationships          ║
/// ║    • Vertex activation: input projected to nearest vertex (expert)          ║
/// ║    • Face output: expert outputs define a face → convex combination         ║
/// ║    • φ-symmetry: icosahedral symmetry group has order 60                    ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
export const PHI = (1 + Math.sqrt(5)) / 2;
export const INV_PHI = 1 / PHI;
export const TAU = Math.PI * 2;
export const EPSILON = 1e-9;
export const EULER_CHARACTERISTIC = 2;
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const hashKey = (solid, index) => `${solid}:${index}`;
const round = (v, d = 12) => Math.round(v * 10 ** d) / 10 ** d;
const roundVector = (v, d = 12) => v.map((n) => round(n, d));
const add = (a, b) => a.map((v, i) => v + b[i]);
const sub = (a, b) => a.map((v, i) => v - b[i]);
const scale = (v, s) => v.map((n) => n * s);
const dot = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const magnitude = (v) => Math.sqrt(dot(v, v));
const normalize = (v) => {
  const length = magnitude(v);
  return length <= EPSILON ? v.map(() => 0) : v.map((n) => n / length);
};
const distance = (a, b) => magnitude(sub(a, b));
const average = (values) => (values.length ? values.reduce((sum, v) => sum + v, 0) / values.length : 0);
const centroid = (points) => points.length ? scale(points.reduce((sum, p) => add(sum, p), [0, 0, 0]), 1 / points.length) : [0, 0, 0];
const convexCombine = (vectors, weights) => vectors.reduce((sum, v, i) => add(sum, scale(v, weights[i] || 0)), [0, 0, 0]);
const softmax = (scores) => {
  const max = Math.max(...Object.values(scores));
  const exps = Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, Math.exp(v - max)]));
  const total = Object.values(exps).reduce((sum, v) => sum + v, 0) || 1;
  return Object.fromEntries(Object.entries(exps).map(([k, v]) => [k, v / total]));
};
function deriveEdgesFromFaces(faces) {
  const set = new Set();
  for (const face of faces) {
    for (let i = 0; i < face.length; i += 1) {
      const a = face[i];
      const b = face[(i + 1) % face.length];
      set.add(a < b ? `${a}:${b}` : `${b}:${a}`);
    }
  }
  return [...set].map((edge) => edge.split(':').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}
function orderedFace(faceIndices, vertices, axisHint) {
  const points = faceIndices.map((index) => vertices[index]);
  const center = centroid(points);
  const normal = normalize(axisHint || center);
  let tangent = cross(normal, [1, 0, 0]);
  if (magnitude(tangent) <= EPSILON) tangent = cross(normal, [0, 1, 0]);
  tangent = normalize(tangent);
  const bitangent = normalize(cross(normal, tangent));
  return [...faceIndices].sort((a, b) => {
    const da = sub(vertices[a], center);
    const db = sub(vertices[b], center);
    const aa = Math.atan2(dot(da, bitangent), dot(da, tangent));
    const ab = Math.atan2(dot(db, bitangent), dot(db, tangent));
    return aa - ab;
  });
}
function polygonNormal(face, vertices) {
  const points = face.map((index) => vertices[index]);
  const center = centroid(points);
  let normal = [0, 0, 0];
  for (let i = 0; i < points.length; i += 1) {
    normal = add(normal, cross(sub(points[i], center), sub(points[(i + 1) % points.length], center)));
  }
  return normalize(normal);
}
function flattenInput(value, out = []) {
  if (value == null) return out.concat(0);
  if (typeof value === 'number') return out.concat(Number.isFinite(value) ? value : 0);
  if (typeof value === 'bigint') return out.concat(Number(value));
  if (typeof value === 'boolean') return out.concat(value ? 1 : -1);
  if (typeof value === 'string') {
    for (let i = 0; i < value.length; i += 1) out.push((value.charCodeAt(i) % 127) / 63.5 - 1);
    return out;
  }
  if (Array.isArray(value)) return value.reduce((acc, entry) => flattenInput(entry, acc), out);
  if (typeof value === 'object') return Object.keys(value).sort().reduce((acc, key) => flattenInput(value[key], flattenInput(key, acc)), out);
  return out.concat(0);
}
function deriveDualSolid(source, name, dualName, symmetryOrder) {
  const vertices = source.faces.map((face) => centroid(face.map((index) => source.vertices[index])));
  const faces = source.vertices.map((vertex, vertexIndex) => {
    const adjacent = source.faces.map((face, faceIndex) => (face.includes(vertexIndex) ? faceIndex : -1)).filter((index) => index >= 0);
    return orderedFace(adjacent, vertices, vertex);
  });
  return new PlatonicSolid({
    name,
    dualName,
    symmetryOrder,
    vertices,
    faces,
    edges: deriveEdgesFromFaces(faces),
    sourceVertexToDualFace: source.vertices.map((_, index) => index),
    sourceFaceToDualVertex: source.faces.map((_, index) => index),
  });
}
export class PlatonicSolid {
  constructor({ name, dualName, vertices, faces, edges = deriveEdgesFromFaces(faces), symmetryOrder = 1, sourceVertexToDualFace = null, sourceFaceToDualVertex = null }) {
    this.name = name;
    this.dualName = dualName;
    this.vertices = vertices.map((vertex) => roundVector(vertex));
    this.faces = faces.map((face) => [...face]);
    this.edges = edges.map((edge) => [...edge]);
    this.symmetryOrder = symmetryOrder;
    this.sourceVertexToDualFace = sourceVertexToDualFace;
    this.sourceFaceToDualVertex = sourceFaceToDualVertex;
    this.adjacency = this.vertices.map(() => []);
    this.edges.forEach(([a, b]) => {
      this.adjacency[a].push(b);
      this.adjacency[b].push(a);
    });
    this.adjacency = this.adjacency.map((neighbors) => [...new Set(neighbors)].sort((a, b) => a - b));
    this.faceCenters = this.faces.map((face) => centroid(face.map((index) => this.vertices[index])));
    this.faceNormals = this.faces.map((face) => polygonNormal(face, this.vertices));
  }
  validateEuler() { return this.vertices.length - this.edges.length + this.faces.length === EULER_CHARACTERISTIC; }
  degree(vertexIndex) { return this.adjacency[vertexIndex]?.length || 0; }
  getVertex(vertexIndex) { return this.vertices[vertexIndex]; }
  getFace(faceIndex) { return this.faces[faceIndex]; }
  nearestVertex(point) {
    return this.vertices.map((vertex, index) => ({ index, vertex, distance: distance(point, vertex) })).sort((a, b) => a.distance - b.distance)[0];
  }
  nearestFace(point) {
    return this.faceCenters.map((center, index) => ({ index, center, face: this.faces[index], distance: distance(point, center) })).sort((a, b) => a.distance - b.distance)[0];
  }
  rankVerticesByAlignment(vector) {
    const direction = normalize(vector);
    return this.vertices.map((vertex, index) => ({
      index,
      vertex,
      alignment: dot(direction, normalize(vertex)),
      distance: distance(vector, vertex),
    })).sort((a, b) => b.alignment - a.alignment || a.distance - b.distance);
  }
  selectFaceForShadow(shadow) {
    const direction = normalize(shadow);
    return this.faceCenters.map((center, index) => ({
      index,
      center,
      face: this.faces[index],
      score: dot(direction, normalize(center)),
    })).sort((a, b) => b.score - a.score)[0];
  }
  signature() {
    return {
      name: this.name,
      dualName: this.dualName,
      vertices: this.vertices.length,
      edges: this.edges.length,
      faces: this.faces.length,
      symmetryOrder: this.symmetryOrder,
      euler: this.validateEuler(),
    };
  }
  static catalog() {
    if (this._catalog) return this._catalog;
    const tetrahedron = new PlatonicSolid({
      name: 'tetrahedron',
      dualName: 'tetrahedron',
      symmetryOrder: 12,
      vertices: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
      faces: [[1, 2, 3], [0, 3, 2], [0, 1, 3], [0, 2, 1]],
      sourceVertexToDualFace: [0, 1, 2, 3],
      sourceFaceToDualVertex: [0, 1, 2, 3],
    });
    const cube = new PlatonicSolid({
      name: 'cube',
      dualName: 'octahedron',
      symmetryOrder: 24,
      vertices: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]],
      faces: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 4, 5, 1], [1, 5, 6, 2], [2, 6, 7, 3], [3, 7, 4, 0]],
    });
    const icosahedron = new PlatonicSolid({
      name: 'icosahedron',
      dualName: 'dodecahedron',
      symmetryOrder: 60,
      vertices: [
        [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
        [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
        [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
      ],
      faces: [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
      ],
    });
    const octahedron = deriveDualSolid(cube, 'octahedron', 'cube', 24);
    const dodecahedron = deriveDualSolid(icosahedron, 'dodecahedron', 'icosahedron', 60);
    this._catalog = new Map([
      ['tetrahedron', tetrahedron],
      ['cube', cube],
      ['octahedron', octahedron],
      ['dodecahedron', dodecahedron],
      ['icosahedron', icosahedron],
    ]);
    return this._catalog;
  }
  static get(name) {
    const solid = this.catalog().get(String(name).toLowerCase());
    if (!solid) throw new Error(`Unknown Platonic solid: ${name}`);
    return solid;
  }
  static names() { return [...this.catalog().keys()]; }
}
export class CaveProjection {
  constructor({ dimensions = 3 } = {}) {
    this.dimensions = dimensions;
    this.signatures = {
      tetrahedron: [0.15, 0.30, 0.20, 0.10, 0.10],
      cube: [0.40, 0.80, 0.40, 0.20, 0.35],
      octahedron: [0.45, 0.95, 0.50, 0.15, 0.45],
      dodecahedron: [0.75, 0.60, 0.80, 0.95, 0.80],
      icosahedron: [0.95, 0.85, 0.95, 1.00, 0.95],
    };
  }
  vectorize(input) { return flattenInput(input).length ? flattenInput(input) : [0]; }
  profile(input) {
    const sequence = this.vectorize(input);
    const absolute = sequence.map((value) => Math.abs(value));
    const length = sequence.length;
    const mean = average(sequence);
    const energy = average(sequence.map((value) => value ** 2));
    const variance = average(sequence.map((value) => (value - mean) ** 2));
    const nonZero = absolute.filter((value) => value > EPSILON).length;
    const sparsity = 1 - nonZero / length;
    const balance = 1 - Math.abs(sequence.filter((value) => value >= 0).length / length - 0.5) * 2;
    const phiResonance = average(sequence.map((value, index) => Math.abs(value * Math.cos((index + 1) / PHI))));
    const totalAbs = absolute.reduce((sum, value) => sum + value, 0) || 1;
    const entropy = -absolute.reduce((sum, value) => {
      if (value <= EPSILON) return sum;
      const probability = value / totalAbs;
      return sum + probability * Math.log2(probability);
    }, 0) / Math.max(1, Math.log2(length));
    return { sequence, length, mean, energy, variance, sparsity, balance, phiResonance: clamp(phiResonance, 0, 1), entropy: clamp(entropy, 0, 1) };
  }
  project(input) {
    const { sequence } = this.profile(input);
    const lengthScale = 1 / Math.sqrt(sequence.length || 1);
    const projected = Array.from({ length: this.dimensions }, (_, axis) => {
      const sum = sequence.reduce((acc, value, index) => {
        const f = (index + 1) * (axis + 1);
        return acc + value * (Math.cos(f / PHI) + Math.sin((f * TAU) / 5));
      }, 0);
      return sum * lengthScale / (axis + 1);
    });
    return roundVector(projected);
  }
  classify(input) {
    const profile = this.profile(input);
    const complexity = clamp(Math.log2(profile.length + 1) / 6, 0, 1);
    const features = [complexity, profile.balance, profile.entropy, profile.phiResonance, clamp(profile.energy / (1 + profile.energy), 0, 1)];
    const rawScores = Object.fromEntries(Object.entries(this.signatures).map(([name, signature]) => {
      const radialDistance = Math.sqrt(signature.reduce((sum, target, index) => sum + (features[index] - target) ** 2, 0));
      return [name, PlatonicSolid.get(name).vertices.length / 20 - radialDistance];
    }));
    const probabilities = softmax(rawScores);
    const ranking = Object.entries(probabilities).map(([name, probability]) => ({ name, probability })).sort((a, b) => b.probability - a.probability);
    return { profile, featureVector: features, probabilities, ranking, solidName: ranking[0].name, confidence: ranking[0].probability };
  }
  analyze(input) {
    const classification = this.classify(input);
    return { shadow: this.project(classification.profile.sequence), profile: classification.profile, classification };
  }
}
export class VertexExpert {
  constructor({ solid, vertexIndex, handler = null } = {}) {
    this.solid = solid;
    this.vertexIndex = vertexIndex;
    this.position = solid.getVertex(vertexIndex);
    this.neighbors = solid.adjacency[vertexIndex] || [];
    this.handler = handler;
  }
  defaultInference({ input, shadow, profile, neighborVectors = [] }) {
    const axis = normalize(this.position);
    const alignment = dot(normalize(shadow), axis);
    const neighborhood = neighborVectors.length ? centroid(neighborVectors) : [0, 0, 0];
    const vector = normalize(add(scale(axis, 0.7 + alignment * 0.2), scale(neighborhood, 0.3)));
    const confidence = clamp(((alignment + 1) / 2) * 0.65 + (1 - profile.sparsity) * 0.2 + profile.phiResonance * 0.15, 0, 1);
    return {
      vector,
      scalar: round(dot(shadow, vector), 12),
      confidence,
      novelty: clamp(profile.variance / (1 + profile.variance), 0, 1),
      summary: `${this.solid.name}::v${this.vertexIndex}`,
      rawInput: input,
    };
  }
  evaluate(context) {
    const activation = clamp((dot(normalize(context.shadow), normalize(this.position)) + 1) / 2, 0, 1);
    const result = this.handler ? this.handler({ ...context, expert: this }) : this.defaultInference(context);
    return { solidName: this.solid.name, vertexIndex: this.vertexIndex, position: this.position, neighbors: this.neighbors, activation, ...(typeof result === 'object' && result !== null ? result : { value: result }) };
  }
}
export class FaceManifold {
  constructor({ solid, faceIndex } = {}) {
    this.solid = solid;
    this.faceIndex = faceIndex;
    this.face = solid.getFace(faceIndex);
    this.vertices = this.face.map((index) => solid.getVertex(index));
    this.center = centroid(this.vertices);
    this.normal = polygonNormal(this.face, solid.vertices);
  }
  convexWeights(expertOutputs) {
    const raw = expertOutputs.map((output) => Math.max(EPSILON, output.activation * (output.confidence ?? 1)));
    const total = raw.reduce((sum, value) => sum + value, 0) || 1;
    return raw.map((value) => value / total);
  }
  compose(expertOutputs) {
    const weights = this.convexWeights(expertOutputs);
    const vectors = expertOutputs.map((output) => normalize(output.vector || [0, 0, 0]));
    return {
      faceIndex: this.faceIndex,
      face: this.face,
      weights,
      center: this.center,
      normal: this.normal,
      manifoldPoint: normalize(convexCombine(vectors, weights)),
      scalar: expertOutputs.reduce((sum, output, index) => sum + (output.scalar || 0) * weights[index], 0),
      consensus: average(expertOutputs.map((output) => output.confidence ?? 0)),
      experts: expertOutputs,
    };
  }
}
export class DualityMapper {
  constructor(catalog = PlatonicSolid.catalog()) {
    this.catalog = catalog;
    this.pairings = new Map();
    for (const solid of this.catalog.values()) {
      const dual = this.catalog.get(solid.dualName);
      if (!dual) continue;
      this.pairings.set(solid.name, {
        dualName: dual.name,
        vertexToDualFace: solid.vertices.map((_, vertexIndex) => dual.faces[vertexIndex] ? { faceIndex: vertexIndex, face: dual.faces[vertexIndex] } : null),
        faceToDualVertex: solid.faces.map((_, faceIndex) => dual.vertices[faceIndex] ? { vertexIndex: faceIndex, vertex: dual.vertices[faceIndex] } : null),
      });
    }
  }
  dualOf(solidName) { return this.pairings.get(solidName)?.dualName || null; }
  mapVertex(solidName, vertexIndex) { return this.pairings.get(solidName)?.vertexToDualFace?.[vertexIndex] || null; }
  mapFace(solidName, faceIndex) { return this.pairings.get(solidName)?.faceToDualVertex?.[faceIndex] || null; }
  pairExpert(solidName, vertexIndex) {
    const mapped = this.mapVertex(solidName, vertexIndex);
    const dualName = this.dualOf(solidName);
    return mapped && dualName ? { solidName, vertexIndex, dualName, dualFaceIndex: mapped.faceIndex, dualFace: mapped.face } : null;
  }
}
export class MoEPlato {
  constructor({ projector = new CaveProjection(), customExperts = {} } = {}) {
    this.projector = projector;
    this.solids = PlatonicSolid.catalog();
    this.duality = new DualityMapper(this.solids);
    this.customExperts = new Map(Object.entries(customExperts));
    this.experts = new Map();
  }
  registerExpert(solidName, vertexIndex, handler) {
    this.customExperts.set(hashKey(solidName, vertexIndex), handler);
    this.experts.delete(hashKey(solidName, vertexIndex));
    return this;
  }
  getSolid(name) { return PlatonicSolid.get(name); }
  getExpert(solidName, vertexIndex) {
    const key = hashKey(solidName, vertexIndex);
    if (!this.experts.has(key)) {
      const solid = this.getSolid(solidName);
      this.experts.set(key, new VertexExpert({ solid, vertexIndex, handler: this.customExperts.get(key) || null }));
    }
    return this.experts.get(key);
  }
  activateExperts(solid, faceSelection, analysis) {
    const ranked = solid.rankVerticesByAlignment(analysis.shadow);
    const activeSet = new Set(faceSelection.face);
    const activeExperts = faceSelection.face.map((vertexIndex) => this.getExpert(solid.name, vertexIndex));
    const outputs = activeExperts.map((expert) => expert.evaluate({
      input: analysis.profile.sequence,
      shadow: analysis.shadow,
      profile: analysis.profile,
      ranked,
      neighborVectors: [centroid(expert.neighbors.filter((index) => activeSet.has(index)).map((index) => solid.getVertex(index)))],
    }));
    return { ranked, outputs };
  }
  route(input) {
    const analysis = this.projector.analyze(input);
    const solid = this.getSolid(analysis.classification.solidName);
    const faceSelection = solid.selectFaceForShadow(analysis.shadow);
    const { ranked, outputs } = this.activateExperts(solid, faceSelection, analysis);
    const composed = new FaceManifold({ solid, faceIndex: faceSelection.index }).compose(outputs);
    return {
      input,
      shadow: analysis.shadow,
      solid: solid.signature(),
      classification: analysis.classification,
      rankedVertices: ranked.slice(0, Math.max(3, faceSelection.face.length)),
      faceSelection,
      manifold: composed,
      dualFocus: this.duality.mapFace(solid.name, faceSelection.index),
      expertPairings: outputs.map((output) => this.duality.pairExpert(solid.name, output.vertexIndex)),
      output: { vector: composed.manifoldPoint, scalar: composed.scalar, confidence: composed.consensus },
    };
  }
  explainRoute(input) {
    const route = this.route(input);
    return {
      solid: route.solid.name,
      dual: route.solid.dualName,
      confidence: route.classification.confidence,
      face: route.faceSelection.face,
      experts: route.manifold.experts.map((expert) => ({ vertexIndex: expert.vertexIndex, activation: expert.activation, confidence: expert.confidence, summary: expert.summary })),
      output: route.output,
    };
  }
  static constants() { return { PHI, INV_PHI, TAU, EPSILON, EULER_CHARACTERISTIC }; }
  static solids() { return Object.fromEntries([...PlatonicSolid.catalog()].map(([name, solid]) => [name, solid.signature()])); }
}
export const SOLIDS = Object.freeze(Object.fromEntries([...PlatonicSolid.catalog()].map(([name, solid]) => [name, solid])));
export const MATH_CONSTANTS = Object.freeze({ PHI, INV_PHI, TAU, EPSILON, EULER_CHARACTERISTIC });
export const createMoEPlato = (options = {}) => new MoEPlato(options);
export const routeThroughPlatonicMoE = (input, options = {}) => new MoEPlato(options).route(input);
export default {
  PHI,
  INV_PHI,
  TAU,
  EPSILON,
  EULER_CHARACTERISTIC,
  MATH_CONSTANTS,
  SOLIDS,
  PlatonicSolid,
  CaveProjection,
  VertexExpert,
  FaceManifold,
  DualityMapper,
  MoEPlato,
  createMoEPlato,
  routeThroughPlatonicMoE,
};
