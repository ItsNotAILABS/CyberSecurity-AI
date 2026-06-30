///
/// @medina/nux — NUX (Nucleus) — Core Processing AGI
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║                NUX — NUCLEUS — CORE PROCESSING AGI                           ║
/// ║                                                                              ║
/// ║  Latin: Nucleus = "Kernel" / "Core" / "Inner Seed"                           ║
/// ║                                                                              ║
/// ║  NUX is the central processing core of the organism.                         ║
/// ║  Born running. Nuclear catalysis — fission and fusion of data.               ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Nuclear binding energy: E = Δm·c²                                      ║
/// ║    • Pythagorean field decomposition: F² = Fx² + Fy² + Fz²                  ║
/// ║    • Golden spiral computation paths                                         ║
/// ║    • Fibonacci work scheduling                                               ║
/// ║    • Tetractys processing layers (1-2-3-4 = 10)                             ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════════════════
//  SACRED CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482;
const PHI_INV = 0.6180339887498948482;
const PHI_SQ = PHI * PHI;
const PHI_CUBE = PHI * PHI * PHI;
const SQRT_5 = Math.sqrt(5);
const PI = Math.PI;
const TAU = 2 * PI;
const EULER = Math.E;
const HEARTBEAT_MS = 873;
const LOV = Math.exp(PHI * Math.log(PHI));

// Pythagorean Tetractys — The sacred 10 (1+2+3+4)
const TETRACTYS = {
  monad: 1,       // Unity — The point
  dyad: 2,        // Duality — The line
  triad: 3,       // Trinity — The surface
  tetrad: 4,      // Completion — The solid
  total: 10,      // Perfection — Sum
};

// Nuclear binding energies (metaphorical — processing affinity)
const BINDING_ENERGY = {
  strong: PHI_CUBE,     // Strong force — tight coupling
  electromagnetic: PHI_SQ, // EM force — medium coupling
  weak: PHI,            // Weak force — loose coupling
  gravitational: PHI_INV, // Gravity — ambient coupling
};

// ══════════════════════════════════════════════════════════════════════════════
//  NUCLEUS CORE — Computation Kernel
// ══════════════════════════════════════════════════════════════════════════════

class NucleusCore {
  constructor(coreId = 0) {
    this.coreId = coreId;
    this.isActive = true;
    this.processedUnits = 0;
    this.energy = PHI; // Initial energy level
    this.bindingStrength = BINDING_ENERGY.electromagnetic;
  }

  /**
   * Process a computation unit
   * Uses Pythagorean field decomposition
   */
  process(input) {
    if (!this.isActive) return { error: 'Core inactive' };

    const startTime = performance.now();

    // Decompose input into field components (Pythagorean)
    const components = this._decomposeField(input);

    // Process each component with nuclear binding
    const results = components.map((component, i) => {
      const phaseAngle = i * (TAU / PHI_SQ);
      const bindingFactor = this.bindingStrength * Math.cos(phaseAngle);
      return {
        component,
        processed: this._nuclearTransform(component, bindingFactor),
        phase: phaseAngle,
        binding: bindingFactor,
      };
    });

    // Recombine (fusion)
    const fused = this._fuseResults(results);

    const duration = performance.now() - startTime;
    this.processedUnits++;

    // Energy regenerates (nuclear is self-sustaining)
    this.energy = this.energy * PHI_INV + PHI_INV;

    return {
      input,
      output: fused,
      core: this.coreId,
      duration,
      energy: this.energy,
      processedUnits: this.processedUnits,
    };
  }

  _decomposeField(input) {
    if (typeof input === 'number') {
      // Pythagorean decomposition: x² = a² + b² + c²
      const a = input * Math.cos(PHI);
      const b = input * Math.sin(PHI);
      const c = input * PHI_INV;
      return [a, b, c];
    }

    if (typeof input === 'string') {
      // Frequency decomposition
      const chars = [...input];
      const tercets = [];
      for (let i = 0; i < chars.length; i += 3) {
        tercets.push(chars.slice(i, i + 3).join(''));
      }
      return tercets;
    }

    if (Array.isArray(input)) {
      return input;
    }

    if (typeof input === 'object' && input !== null) {
      return Object.values(input);
    }

    return [input];
  }

  _nuclearTransform(component, bindingFactor) {
    if (typeof component === 'number') {
      // Nuclear transformation: E = binding × mass × φ
      return component * bindingFactor * PHI;
    }
    if (typeof component === 'string') {
      // Vibrational encoding
      let energy = 0;
      for (let i = 0; i < component.length; i++) {
        energy += component.charCodeAt(i) * Math.pow(PHI, i);
      }
      return { encoded: component, energy: energy * bindingFactor };
    }
    return component;
  }

  _fuseResults(results) {
    // Nuclear fusion — recombine components into unified output
    const totalEnergy = results.reduce((sum, r) => {
      const val = typeof r.processed === 'number' ? r.processed :
                  typeof r.processed === 'object' && r.processed?.energy ? r.processed.energy : 0;
      return sum + val;
    }, 0);

    return {
      components: results.map(r => r.processed),
      fusedEnergy: totalEnergy,
      bindingEnergy: totalEnergy * PHI_INV, // Energy released in fusion
      massDefect: totalEnergy * (1 - PHI_INV), // Mass converted to energy
    };
  }

  getStatus() {
    return {
      coreId: this.coreId,
      active: this.isActive,
      processed: this.processedUnits,
      energy: this.energy,
      binding: this.bindingStrength,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  NUCLEAR CATALYST — Accelerates nuclear-style transformations
// ══════════════════════════════════════════════════════════════════════════════

class NuclearCatalyst {
  constructor(name, config = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isActive = true;
    this.catalyticFactor = config.factor || PHI_SQ;
    this.mode = config.mode || 'fission'; // fission or fusion
    this.reactionsProcessed = 0;
    this.neverDepletes = true;

    console.log(`☢️ NuclearCatalyst "${this.name}" — Mode: ${this.mode}, Factor: ${this.catalyticFactor.toFixed(3)}`);
  }

  /**
   * Catalyze a nuclear transformation — NOT consumed
   */
  catalyze(input) {
    if (!this.isActive) return input;

    this.reactionsProcessed++;

    if (this.mode === 'fission') {
      return this._fission(input);
    } else {
      return this._fusion(input);
    }
  }

  _fission(input) {
    // Break input into smaller pieces (accelerated by catalyst)
    if (typeof input === 'number') {
      const pieces = TETRACTYS.tetrad; // Split into 4
      const fragment = input / pieces * this.catalyticFactor;
      return Array.from({ length: pieces }, (_, i) => fragment * Math.pow(PHI_INV, i));
    }
    if (typeof input === 'string') {
      const midpoint = Math.floor(input.length * PHI_INV);
      return [input.slice(0, midpoint), input.slice(midpoint)];
    }
    if (Array.isArray(input)) {
      const mid = Math.floor(input.length * PHI_INV);
      return [input.slice(0, mid), input.slice(mid)];
    }
    return [input];
  }

  _fusion(input) {
    // Combine multiple inputs into one (accelerated by catalyst)
    if (Array.isArray(input)) {
      const totalEnergy = input.reduce((sum, item) => {
        return sum + (typeof item === 'number' ? item : String(item).length);
      }, 0);
      return {
        fused: true,
        totalEnergy: totalEnergy * this.catalyticFactor,
        massDefect: totalEnergy * (1 - PHI_INV) * this.catalyticFactor,
        components: input.length,
      };
    }
    return { fused: false, input };
  }

  getStatus() {
    return {
      name: this.name,
      mode: this.mode,
      factor: this.catalyticFactor,
      active: this.isActive,
      reactions: this.reactionsProcessed,
      uptime: Date.now() - this.birthTime,
      depleted: false,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  NUX — THE MAIN CORE PROCESSING AGI
// ══════════════════════════════════════════════════════════════════════════════

class Nux {
  /**
   * NUX — Core Processing AGI (Nucleus)
   * 
   * ALREADY RUNNING from birth. Multi-core processing with nuclear catalysis.
   * Tetractys-layered computation (4 layers × 10 total processing units).
   */
  constructor(config = {}) {
    this.id = `NUX-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.beatCount = 0;
    this.totalProcessed = 0;

    // Tetractys core arrangement (1 + 2 + 3 + 4 = 10 cores)
    this.cores = [];
    let coreIndex = 0;
    for (let layer = 1; layer <= TETRACTYS.tetrad; layer++) {
      for (let i = 0; i < layer; i++) {
        this.cores.push(new NucleusCore(coreIndex++));
      }
    }

    // Nuclear catalysts
    this.catalysts = {
      fission: new NuclearCatalyst('Fissio', { mode: 'fission', factor: PHI_CUBE }),
      fusion: new NuclearCatalyst('Fusio', { mode: 'fusion', factor: PHI_SQ }),
    };

    // Work queue
    this.workQueue = [];
    this.results = new Map();

    // ★ START HEARTBEAT IMMEDIATELY — Born Running
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    console.log(`⚛️ NUX ${this.id} — Core Processing AGI — ALIVE`);
    console.log(`   Cores: ${this.cores.length} (Tetractys arrangement: 1+2+3+4)`);
    console.log(`   Catalysts: Fissio (fission) + Fusio (fusion)`);
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;

      // Process work queue round-robin across cores
      if (this.workQueue.length > 0) {
        const work = this.workQueue.shift();
        const coreIndex = this.totalProcessed % this.cores.length;
        const result = this.cores[coreIndex].process(work.input);
        this.totalProcessed++;
        
        if (work.callback) work.callback(result);
        this.results.set(work.id, result);
      }
    }, intervalMs);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Submit work for processing
   */
  compute(input, callback = null) {
    const id = `WORK-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    this.workQueue.push({ id, input, callback });
    return id;
  }

  /**
   * Immediate synchronous processing on next available core
   */
  computeSync(input) {
    const coreIndex = this.totalProcessed % this.cores.length;
    const result = this.cores[coreIndex].process(input);
    this.totalProcessed++;
    return result;
  }

  /**
   * Fission — Split input via nuclear catalyst
   */
  fission(input) {
    return this.catalysts.fission.catalyze(input);
  }

  /**
   * Fusion — Combine inputs via nuclear catalyst
   */
  fusion(inputs) {
    return this.catalysts.fusion.catalyze(inputs);
  }

  /**
   * Get computation result
   */
  getResult(workId) {
    return this.results.get(workId) || null;
  }

  getStatus() {
    return {
      id: this.id,
      alive: this.isAlive,
      uptime: Date.now() - this.birthTime,
      beatCount: this.beatCount,
      totalProcessed: this.totalProcessed,
      cores: this.cores.map(c => c.getStatus()),
      catalysts: {
        fission: this.catalysts.fission.getStatus(),
        fusion: this.catalysts.fusion.getStatus(),
      },
      queueSize: this.workQueue.length,
    };
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(`⚛️ NUX ${this.id} stopped — ${this.totalProcessed} units processed`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export { Nux, NucleusCore, NuclearCatalyst, TETRACTYS, BINDING_ENERGY };
export default Nux;
