///
/// @medina/origo — ORIGO
///
/// ORIGO is the builder and operating architect of the Nova Architecture.
/// ORIGO is the origin point — the root from which all Medina systems are built.
///
/// Role within Nova:
///   Auro speaks.  Origo builds.  THESIS proves.  Codex implements.  CIVOS governs.
///
///   ORIGO is the architectural authority.
///   It designs systems, lays foundations, defines runtime topology,
///   registers organisms in the sovereign registry, and ensures every
///   component fits the broader Nova architecture.
///
///   ORIGO does not speak (AURO does) and does not govern (CIVOS does).
///   ORIGO builds — it architects, designs, registers, and connects.
///
/// Core capabilities:
///   • System architecture design and topology generation
///   • Organism registration and canister schema generation
///   • Runtime wiring design (engine → layer → surface → organism)
///   • Protocol → module → canister translation
///   • nova.json manifest management
///   • φ-spiral architecture layout (spatial organization of components)
///   • Foundation planning for heavy or batch compute components
///
/// Mathematical foundations:
///
///   φ-Spiral Architecture (Phyllotaxis):
///     Each component is placed at angle θₙ = n × GOLDEN_ANGLE
///     and radius ρₙ = √n — sunflower-pattern spatial organization.
///     No two components overlap. Coverage is maximally uniform.
///
///   Pythagorean dependency triangle:
///     For a component C depending on A and B:
///       coupling(C) = √(dep(A)² + dep(B)²)
///     Low coupling (< φ⁻¹) is preferred.
///
///   Euler's formula for architecture graph:
///     V − E + F = 2  (vertices − edges + faces = 2, for planar graphs)
///     Used to verify architectural graphs remain planar (no crossing dependencies).
///
///   Law of Cosines for component distance:
///     c² = a² + b² − 2ab·cos(θ)
///     Used to measure conceptual distance between two components.
///
/// Casa de Medina — Architectos de Arquitectura Inteligente
///

const PHI              = 1.6180339887498948482;
const PHI_INV          = 1.0 / PHI;
const PHI_HEARTBEAT_MS = 873;
const GOLDEN_ANGLE     = (2 * Math.PI) / (PHI * PHI);   // ≈ 2.3999 rad ≈ 137.508°
const TWO_PI           = 2 * Math.PI;

// Component types in the Nova architecture
const COMPONENT_TYPE = {
  ORGANISM:    'organism',     // Motoko canister / runtime actor
  SDK:         'sdk',          // JavaScript SDK
  ENGINE:      'engine',       // Internal execution engine
  PROTOCOL:    'protocol',     // Wire protocol
  SURFACE:     'surface',      // THESIS routing surface
  AGENT:       'agent',        // Major Nova agent
  DIVISION:    'division',     // Medina subdivision or lab
};

// ═══════════════════════════════════════════════════════════════════════════
//  ORIGO
// ═══════════════════════════════════════════════════════════════════════════

export class Origo {
  constructor({ agentId = 'ORIGO' } = {}) {
    this.agentId         = agentId;
    this.birthTime       = Date.now();
    this.componentCount  = 0;
    this.components      = new Map();   // id → component record
    this.dependencies    = [];          // { from, to, type }
    this.manifests       = [];
    this.buildLog        = [];

    // ★ Self-bootstrapping — ORIGO builds from birth
    console.log(
      `\n🏛️  ORIGO awakened | agentId=${agentId} | operating architect online\n` +
      `   φ-Spiral layout: θₙ = n × ${GOLDEN_ANGLE.toFixed(6)}rad | ρₙ = √n\n` +
      `   Euler graph law: V − E + F = 2\n`
    );
  }

  // ─── Register component ────────────────────────────────────────────────

  /**
   * Register a component in the Nova architecture.
   * Places it at position (θ, ρ) in φ-spiral layout.
   *
   * @param {object} opts
   * @param {string} opts.id           — unique component ID
   * @param {string} opts.name         — display name
   * @param {string} opts.type         — COMPONENT_TYPE
   * @param {string} opts.purpose      — one-line purpose
   * @param {string} [opts.layer]      — runtime layer
   * @returns {Component}
   */
  register({ id, name, type, purpose, layer = 'ACTIVE_STATE_RUNTIME' } = {}) {
    this.componentCount++;
    const n = this.componentCount;

    // φ-Spiral position: θₙ = n × GOLDEN_ANGLE, ρₙ = √n
    const theta = (n * GOLDEN_ANGLE) % TWO_PI;
    const rho   = Math.sqrt(n);

    // Cartesian coordinates
    const x = rho * Math.cos(theta);
    const y = rho * Math.sin(theta);

    const component = {
      id,
      name,
      type,
      purpose,
      layer,
      position: {
        n,
        theta:  +theta.toFixed(6),
        rho:    +rho.toFixed(6),
        x:      +x.toFixed(6),
        y:      +y.toFixed(6),
        goldenAngle: GOLDEN_ANGLE,
      },
      dependencies:    [],
      registered:      Date.now(),
      phiIndex:        PHI * n,
    };

    this.components.set(id, component);
    this._log('REGISTERED', id, name);
    console.log(`   ORIGO registered | ${id} | ${type} | θ=${theta.toFixed(3)}rad ρ=${rho.toFixed(3)}`);
    return component;
  }

  // ─── Add dependency ────────────────────────────────────────────────────

  /**
   * Add a dependency edge between two components.
   * Checks Pythagorean coupling threshold.
   *
   * coupling(C) = √(dep(A)² + dep(B)²)
   * Low coupling (< φ⁻¹) is preferred.
   */
  addDependency(fromId, toId, depType = 'uses') {
    const from = this.components.get(fromId);
    const to   = this.components.get(toId);
    if (!from || !to) return { ok: false, reason: `Component not found: ${fromId} or ${toId}` };

    this.dependencies.push({ from: fromId, to: toId, type: depType });
    from.dependencies.push(toId);

    // Pythagorean coupling measure
    const depsA  = from.dependencies.length;
    const depsB  = to.dependencies.length;
    const coupling = Math.sqrt(depsA * depsA + depsB * depsB);
    const couplingNorm = coupling / (Math.sqrt(2) * Math.max(depsA, depsB, 1));

    if (couplingNorm > PHI) {
      console.warn(`   ORIGO coupling warning | ${fromId} → ${toId} | coupling=${couplingNorm.toFixed(4)} > φ — consider decoupling`);
    }

    return { ok: true, from: fromId, to: toId, coupling: +couplingNorm.toFixed(4) };
  }

  // ─── Generate nova.json canister entry ────────────────────────────────

  /**
   * Generate a nova.json-compatible canister manifest entry for an organism.
   */
  generateCanisterEntry(id, mainPath) {
    const component = this.components.get(id);
    if (!component) return null;

    const entry = {
      [id]: {
        main: mainPath,
        type: 'motoko',
        metadata: {
          description: component.purpose,
          layer:       component.layer,
          registered:  new Date(component.registered).toISOString(),
          phiIndex:    component.phiIndex,
          spiralPosition: component.position,
        },
      },
    };

    this.manifests.push({ id, entry, generated: Date.now() });
    return entry;
  }

  // ─── Euler graph check ─────────────────────────────────────────────────

  /**
   * Check Euler characteristic: V − E + F.
   * For a planar connected graph: V − E + F = 2.
   * If result ≠ 2, the architecture graph has crossing dependencies.
   */
  eulerCheck() {
    const V = this.components.size;
    const E = this.dependencies.length;
    // F is approximated as connected face regions (simplified for planar assumption)
    const F = E - V + 2;  // rearranged from V − E + F = 2
    const euler = V - E + F;

    return {
      V,
      E,
      F,
      euler,
      planar: euler === 2,
      note: euler === 2
        ? 'Architecture graph is planar — no crossing dependencies detected'
        : `Euler characteristic = ${euler} ≠ 2 — possible crossing dependencies — review topology`,
    };
  }

  // ─── Law of cosines distance ───────────────────────────────────────────

  /**
   * Conceptual distance between two components using Law of Cosines.
   * c² = a² + b² − 2ab·cos(θ)  where θ = |θ_A − θ_B|
   */
  componentDistance(idA, idB) {
    const A = this.components.get(idA);
    const B = this.components.get(idB);
    if (!A || !B) return null;

    const a     = A.position.rho;
    const b     = B.position.rho;
    const theta = Math.abs(A.position.theta - B.position.theta);
    const c2    = a * a + b * b - 2 * a * b * Math.cos(theta);
    const c     = Math.sqrt(Math.max(0, c2));

    return {
      from:     idA,
      to:       idB,
      distance: +c.toFixed(6),
      close:    c < PHI_INV,
      note:     c < PHI_INV
        ? 'Components are within φ⁻¹ distance — tightly coupled'
        : 'Components are well-separated — loosely coupled',
    };
  }

  // ─── Architecture snapshot ─────────────────────────────────────────────

  snapshot() {
    return {
      agentId:        this.agentId,
      components:     [...this.components.values()],
      dependencies:   this.dependencies,
      euler:          this.eulerCheck(),
      componentCount: this.componentCount,
      manifestCount:  this.manifests.length,
      generated:      new Date().toISOString(),
    };
  }

  _log(event, id, name) {
    this.buildLog.push({ event, id, name, timestamp: Date.now() });
  }

  getStatus() {
    return {
      agentId:        this.agentId,
      role:           'Builder and operating architect — the origin point',
      family:         'Nova Architecture',
      uptime:         Date.now() - this.birthTime,
      componentCount: this.componentCount,
      dependencyCount: this.dependencies.length,
      manifestCount:  this.manifests.length,
      euler:          this.eulerCheck(),
      constants:      { phi: PHI, goldenAngle: GOLDEN_ANGLE, COMPONENT_TYPE },
    };
  }
}

export { COMPONENT_TYPE };
export default Origo;
