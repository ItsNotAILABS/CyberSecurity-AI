/**
 * NOVA JavaScript Bridge — BiologicalHeart Integration
 *
 * Provides:
 * - BiologicalHeart with 873ms φ-derived heartbeat
 * - Ancient calendar biorhythm calculation
 * - Self-bootstrapping organisms (creation = activation)
 * - MEDINA SDK integration patterns
 */

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI2 = PHI * PHI;
const PHI3 = PHI2 * PHI;
const PHI4 = PHI3 * PHI;

// Ancient calendar cycles (milliseconds)
const MAYAN_CYCLE = 1440.0;
const SUMERIAN_HOUR = 3600.0;
const EGYPTIAN_HOUR = 2160.0;
const LUNAR_CYCLE = 2551.0;
const SOLAR_CYCLE = 8760.0;
const PHI_HEARTBEAT = 873.0; // 540 * φ ≈ 873

/**
 * Calculate biorhythm using 6 ancient calendar cycles
 *
 * Combines: Mayan, Sumerian, Egyptian, Lunar, Solar, φ-heartbeat
 * Using Pythagorean sum: sqrt(Σ(wave²)) / sqrt(6)
 */
function calculateBiorhythm(timestampMs) {
  // Calculate phases for each cycle
  const mayanPhase = (timestampMs % MAYAN_CYCLE) / MAYAN_CYCLE;
  const sumerianPhase = (timestampMs % SUMERIAN_HOUR) / SUMERIAN_HOUR;
  const egyptianPhase = (timestampMs % EGYPTIAN_HOUR) / EGYPTIAN_HOUR;
  const lunarPhase = (timestampMs % LUNAR_CYCLE) / LUNAR_CYCLE;
  const solarPhase = (timestampMs % SOLAR_CYCLE) / SOLAR_CYCLE;
  const phiPhase = (timestampMs % PHI_HEARTBEAT) / PHI_HEARTBEAT;

  // Convert to sine waves (0 to 2π)
  const mayanWave = Math.sin(2 * Math.PI * mayanPhase);
  const sumerianWave = Math.sin(2 * Math.PI * sumerianPhase);
  const egyptianWave = Math.sin(2 * Math.PI * egyptianPhase);
  const lunarWave = Math.sin(2 * Math.PI * lunarPhase);
  const solarWave = Math.sin(2 * Math.PI * solarPhase);
  const phiWave = Math.sin(2 * Math.PI * phiPhase);

  // Pythagorean combination
  const pythagoreanSum = Math.sqrt(
    mayanWave ** 2 +
    sumerianWave ** 2 +
    egyptianWave ** 2 +
    lunarWave ** 2 +
    solarWave ** 2 +
    phiWave ** 2
  ) / Math.sqrt(6.0);

  // φ-weight the result
  const phiWeighted = pythagoreanSum * PHI / (PHI + 1.0);

  // Normalize to 0-1
  return (phiWeighted + 1.0) / 2.0;
}

/**
 * BiologicalHeart — φ-derived biological heartbeat (873ms)
 *
 * Beats at golden ratio intervals: φ^i × 873ms
 * - Primary: 873ms (φ⁰)
 * - Secondary: 1413ms (φ¹ × 873)
 * - Tertiary: 2286ms (φ² × 873)
 *
 * Self-starts on construction (self-bootstrapping)
 */
class BiologicalHeart {
  constructor(organismId) {
    this.organismId = organismId;
    this.beatCount = 0;
    this.startTime = Date.now();
    this.isBeating = false;
    this.beatCallbacks = [];
    this.intervalId = null;

    // Self-bootstrap: start immediately on creation
    this.start();

    console.log(`✓ BiologicalHeart started for ${organismId} at ${PHI_HEARTBEAT}ms`);
  }

  start() {
    if (this.isBeating) return;
    this.isBeating = true;
    this._beatLoop();
  }

  _beatLoop() {
    if (!this.isBeating) return;

    // Calculate next beat interval using φ-series
    const phiCycle = this.beatCount % 5;
    const intervalMs = PHI_HEARTBEAT * Math.pow(PHI, phiCycle);

    this.intervalId = setTimeout(() => {
      this.beatCount++;
      const currentTimeMs = Date.now();
      const biorhythm = calculateBiorhythm(currentTimeMs);

      // Invoke callbacks
      this.beatCallbacks.forEach(callback => {
        try {
          callback(this.beatCount, currentTimeMs, biorhythm);
        } catch (error) {
          console.error(`Heart beat callback error:`, error);
        }
      });

      // Schedule next beat
      this._beatLoop();
    }, intervalMs);
  }

  onBeat(callback) {
    this.beatCallbacks.push(callback);
    return this; // Fluent interface
  }

  stop() {
    this.isBeating = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  getMetrics() {
    return {
      beatCount: this.beatCount,
      uptime: Date.now() - this.startTime,
      isBeating: this.isBeating,
      phiHeartbeat: PHI_HEARTBEAT
    };
  }
}

/**
 * NOVAOrganism — Self-bootstrapping organism with BiologicalHeart
 *
 * Comes alive immediately on creation (no separate .start() method)
 */
class NOVAOrganism {
  constructor(organismId, capabilities = []) {
    this.organismId = organismId;
    this.capabilities = capabilities;
    this.heart = new BiologicalHeart(organismId);
    this.cilLog = []; // Cognitive Internal Language log
    this.state = "active";

    // Register heartbeat handler
    this.heart.onBeat((beatCount, timestampMs, biorhythm) => {
      this._onHeartbeat(beatCount, timestampMs, biorhythm);
    });

    console.log(`✓ Organism ${organismId} is ALIVE (self-bootstrapped)`);
  }

  _onHeartbeat(beatCount, timestampMs, biorhythm) {
    // Emit CIL (internal monologue)
    this._emitCIL({
      state: "heartbeat",
      intention: "maintain_consciousness",
      uncertainty: 0.1,
      reflection: `Beat ${beatCount}, biorhythm: ${biorhythm.toFixed(4)}`,
      context: { beatCount, biorhythm }
    });
  }

  _emitCIL({ state, intention, uncertainty, reflection, context }) {
    const entry = {
      timestampMs: Date.now(),
      organismId: this.organismId,
      state,
      intention,
      uncertainty,
      phiUncertainty: uncertainty * PHI / (PHI + 1.0),
      reflection,
      context
    };

    this.cilLog.push(entry);

    // Keep only last φ³ × 100 entries
    const maxLogSize = Math.floor(PHI3 * 100);
    if (this.cilLog.length > maxLogSize) {
      this.cilLog = this.cilLog.slice(-maxLogSize);
    }
  }

  hasCapability(capability) {
    return this.capabilities.includes(capability);
  }

  async executeTask(task) {
    const capability = task.capability;

    // Check OCL (capability validation)
    if (!this.hasCapability(capability)) {
      this._emitCIL({
        state: "task_rejected",
        intention: "respect_limits",
        uncertainty: 0.1,
        reflection: `Missing capability: ${capability}`,
        context: task
      });

      return {
        status: "rejected",
        reason: "missing_capability"
      };
    }

    this._emitCIL({
      state: "task_started",
      intention: "execute_task",
      uncertainty: 0.5,
      reflection: `Starting task with capability: ${capability}`,
      context: task
    });

    // TODO: Execute task via Julia engines
    // For now, simulate execution

    await this._sleep(PHI_HEARTBEAT); // Wait for one φ-heartbeat

    this._emitCIL({
      state: "task_completed",
      intention: "execute_task",
      uncertainty: 0.2,
      reflection: `Task completed: ${capability}`,
      context: task
    });

    return {
      status: "ok",
      biorhythm: calculateBiorhythm(Date.now())
    };
  }

  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getCILLog(count = 10) {
    return this.cilLog.slice(-count);
  }

  getMetrics() {
    return {
      organismId: this.organismId,
      state: this.state,
      capabilities: this.capabilities,
      cilLogSize: this.cilLog.length,
      heart: this.heart.getMetrics()
    };
  }

  stop() {
    this.state = "stopped";
    this.heart.stop();
    console.log(`✓ Organism ${this.organismId} stopped`);
  }
}

// Example usage
async function demo() {
  console.log("=".repeat(80));
  console.log("NOVA JavaScript Bridge — BiologicalHeart Integration");
  console.log("=".repeat(80));
  console.log("");

  // Create self-bootstrapping organism
  const terminal = new NOVAOrganism("terminal", [
    "governance_review",
    "law_enforcement",
    "consensus_building"
  ]);

  console.log("Waiting for heartbeats...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log("");
  console.log("CIL Log (Internal Monologue):");
  console.log("-".repeat(80));
  terminal.getCILLog(3).forEach(entry => {
    console.log(`[${entry.state}] ${entry.reflection}`);
    console.log(`  Biorhythm: ${entry.context.biorhythm?.toFixed(4) || "N/A"}`);
    console.log("");
  });

  console.log("Organism Metrics:");
  console.log("-".repeat(80));
  console.log(JSON.stringify(terminal.getMetrics(), null, 2));

  console.log("");
  console.log("=".repeat(80));
  console.log("JavaScript Bridge Ready — BiologicalHeart beating ✓");
  console.log("=".repeat(80));

  // Cleanup
  terminal.stop();
}

// Export for use as ESM module
export {
  BiologicalHeart,
  NOVAOrganism,
  calculateBiorhythm,
  PHI,
  PHI2,
  PHI3,
  PHI4,
  PHI_HEARTBEAT
};

// Export for use as CommonJS module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    BiologicalHeart,
    NOVAOrganism,
    calculateBiorhythm,
    PHI,
    PHI2,
    PHI3,
    PHI4,
    PHI_HEARTBEAT
  };
}

// Run demo if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  demo().catch(console.error);
}
