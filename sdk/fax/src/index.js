///
/// @medina/fax — FAX (Factorum) — Manufacturing AI
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║             FAX — FACTORUM — MANUFACTURING INTELLIGENCE                      ║
/// ║                                                                              ║
/// ║  Latin: Factorum = "Of Making" / "Factory" / "Production"                    ║
/// ║                                                                              ║
/// ║  FAX manufactures and assembles complex outputs from raw inputs.             ║
/// ║  Born running. Industrial catalysis — accelerates production.                ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Assembly pipeline: Output = Π(Tᵢ(input))                               ║
/// ║    • Golden ratio batch sizing: batch = total × φ⁻¹                         ║
/// ║    • Pythagorean quality: Q = √(P² + R² + A²)                              ║
/// ║    • Fibonacci production scheduling                                         ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

const PHI = 1.6180339887498948482;
const PHI_INV = 0.6180339887498948482;
const PHI_SQ = PHI * PHI;
const PHI_CUBE = PHI * PHI * PHI;
const PI = Math.PI;
const HEARTBEAT_MS = 873;
const LOV = Math.exp(PHI * Math.log(PHI));
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

// Production quality dimensions (Pythagorean)
const QUALITY_DIMENSIONS = {
  precision: { weight: PHI, symbol: 'P' },
  reliability: { weight: 1.0, symbol: 'R' },
  accuracy: { weight: PHI_INV, symbol: 'A' },
};

// ══════════════════════════════════════════════════════════════════════════════
//  INDUSTRIAL CATALYST — Accelerates manufacturing processes
// ══════════════════════════════════════════════════════════════════════════════

class IndustrialCatalyst {
  constructor(name, config = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isActive = true;
    this.throughput = config.throughput || PHI;
    this.qualityFactor = config.quality || PHI_INV;
    this.reactionsProcessed = 0;
    this.neverDepletes = true;
    this.defectsDetected = 0;

    console.log(`🏭 IndustrialCatalyst "${this.name}" — Throughput: ×${this.throughput.toFixed(3)}`);
  }

  /**
   * Process raw materials through industrial catalysis
   * CATALYST NOT CONSUMED
   */
  process(rawMaterial, blueprint) {
    this.reactionsProcessed++;

    const quality = this._assessQuality(rawMaterial);
    const produced = this._manufacture(rawMaterial, blueprint, quality);

    if (quality.score < PHI_INV) {
      this.defectsDetected++;
    }

    return {
      input: rawMaterial,
      blueprint,
      output: produced,
      quality,
      throughput: this.throughput,
      catalyst: this.name,
      depleted: false,
    };
  }

  _assessQuality(material) {
    // Pythagorean quality: Q = √(P² + R² + A²) / √3
    const P = typeof material === 'object' ? 
      Math.min(1, Object.keys(material).length / 10) * QUALITY_DIMENSIONS.precision.weight : PHI_INV;
    const R = this.qualityFactor;
    const A = PHI_INV;

    const score = Math.sqrt(P * P + R * R + A * A) / Math.sqrt(3);

    return {
      precision: P,
      reliability: R,
      accuracy: A,
      score,
      acceptable: score >= PHI_INV,
    };
  }

  _manufacture(rawMaterial, blueprint, quality) {
    if (typeof rawMaterial === 'number') {
      return rawMaterial * this.throughput * quality.score;
    }
    if (typeof rawMaterial === 'string') {
      return {
        product: rawMaterial,
        enhanced: rawMaterial.toUpperCase(),
        quality: quality.score,
        throughput: this.throughput,
      };
    }
    if (Array.isArray(rawMaterial)) {
      return rawMaterial.map((item, i) => ({
        item,
        processed: true,
        batchIndex: i,
        quality: quality.score * Math.pow(PHI_INV, i % 5),
      }));
    }
    if (typeof rawMaterial === 'object' && rawMaterial !== null) {
      const product = {};
      for (const [key, value] of Object.entries(rawMaterial)) {
        product[key] = typeof value === 'number' ? value * this.throughput : value;
      }
      product._quality = quality.score;
      product._manufactured = true;
      return product;
    }
    return rawMaterial;
  }

  getStatus() {
    return {
      name: this.name,
      throughput: this.throughput,
      quality: this.qualityFactor,
      reactions: this.reactionsProcessed,
      defects: this.defectsDetected,
      active: this.isActive,
      uptime: Date.now() - this.birthTime,
      depleted: false,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FAX — THE MAIN MANUFACTURING AI
// ══════════════════════════════════════════════════════════════════════════════

class Fax {
  /**
   * FAX — Manufacturing AI (Factorum)
   * 
   * ALREADY RUNNING from birth. Industrial catalysis for production.
   * Assembly pipelines. Quality control. Fibonacci batch scheduling.
   */
  constructor(config = {}) {
    this.id = `FAX-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.beatCount = 0;
    this.unitsProduced = 0;

    // Assembly line catalysts
    this.catalysts = {
      raw: new IndustrialCatalyst('Crudum', { throughput: PHI_INV, quality: 0.9 }),
      refined: new IndustrialCatalyst('Refinium', { throughput: PHI, quality: PHI_INV }),
      precision: new IndustrialCatalyst('Exactum', { throughput: 1.0, quality: PHI }),
      master: new IndustrialCatalyst('Magistrum', { throughput: PHI_SQ, quality: PHI_SQ }),
    };

    // Production queue
    this.productionQueue = [];
    this.inventory = [];

    // Blueprints registry
    this.blueprints = new Map();

    // ★ START HEARTBEAT IMMEDIATELY
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    console.log(`🔨 FAX ${this.id} — Manufacturing AI — ALIVE`);
    console.log(`   Catalysts: Crudum → Refinium → Exactum → Magistrum`);
    console.log(`   Quality: Pythagorean (√(P²+R²+A²)/√3)`);
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;

      // Process production queue
      if (this.productionQueue.length > 0) {
        const job = this.productionQueue.shift();
        const result = this.produce(job.input, job.blueprint, job.grade);
        this.inventory.push(result);
        if (job.callback) job.callback(result);
      }
    }, intervalMs);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Produce — manufacture output from input using catalysis
   */
  produce(input, blueprint = null, grade = 'refined') {
    const catalyst = this.catalysts[grade] || this.catalysts.refined;
    const result = catalyst.process(input, blueprint);
    this.unitsProduced++;
    return result;
  }

  /**
   * Assembly pipeline — cascade through multiple catalysts
   */
  assemble(input, stages = ['raw', 'refined', 'precision']) {
    let current = input;
    const pipeline = [];

    for (const stage of stages) {
      const catalyst = this.catalysts[stage];
      if (!catalyst) continue;
      
      const result = catalyst.process(current, null);
      pipeline.push({ stage, result });
      current = result.output;
    }

    this.unitsProduced++;
    return {
      input,
      output: current,
      pipeline,
      stages: stages.length,
    };
  }

  /**
   * Batch production with golden ratio sizing
   */
  batchProduce(inputs, grade = 'refined') {
    // Golden ratio batch: process 61.8% first, then 38.2%
    const batchSize = Math.ceil(inputs.length * PHI_INV);
    const majorBatch = inputs.slice(0, batchSize);
    const minorBatch = inputs.slice(batchSize);

    const majorResults = majorBatch.map(input => this.produce(input, null, grade));
    const minorResults = minorBatch.map(input => this.produce(input, null, grade));

    return {
      major: { items: majorResults, size: majorBatch.length },
      minor: { items: minorResults, size: minorBatch.length },
      total: inputs.length,
      ratio: PHI,
    };
  }

  /**
   * Register a blueprint
   */
  registerBlueprint(name, spec) {
    this.blueprints.set(name, { ...spec, registered: Date.now() });
  }

  /**
   * Queue production job
   */
  queueJob(input, blueprint = null, grade = 'refined', callback = null) {
    this.productionQueue.push({ input, blueprint, grade, callback });
  }

  getStatus() {
    return {
      id: this.id,
      alive: this.isAlive,
      uptime: Date.now() - this.birthTime,
      beatCount: this.beatCount,
      produced: this.unitsProduced,
      queueSize: this.productionQueue.length,
      inventorySize: this.inventory.length,
      blueprints: this.blueprints.size,
      catalysts: {
        raw: this.catalysts.raw.getStatus(),
        refined: this.catalysts.refined.getStatus(),
        precision: this.catalysts.precision.getStatus(),
        master: this.catalysts.master.getStatus(),
      },
    };
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(`🔨 FAX ${this.id} stopped — ${this.unitsProduced} units produced`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export { Fax, IndustrialCatalyst, QUALITY_DIMENSIONS };
export default Fax;
