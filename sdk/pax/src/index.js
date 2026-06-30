///
/// @medina/pax — PAX (Pacificorum) — Harmony AGI
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║              PAX — PACIFICORUM — HARMONY INTELLIGENCE                        ║
/// ║                                                                              ║
/// ║  Latin: Pax = "Peace" / "Harmony" / "Balance"                                ║
/// ║  Pacificorum = "Of the Peacemakers"                                          ║
/// ║                                                                              ║
/// ║  PAX maintains equilibrium across all organism systems.                      ║
/// ║  Born running. Equilibrium catalysis — restores balance without depletion.   ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Homeostatic equilibrium: dS/dt = -k(S - S₀)                           ║
/// ║    • Pythagorean balance: B = √(x² + y²) where ideal B = φ                 ║
/// ║    • Golden mean convergence: xₙ₊₁ = (xₙ + target) × φ⁻¹                  ║
/// ║    • Fibonacci damping for oscillation control                               ║
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
const TAU = 2 * PI;
const HEARTBEAT_MS = 873;
const LOV = Math.exp(PHI * Math.log(PHI));
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

// Equilibrium states
const EQUILIBRIUM = {
  perfect: { deviation: 0, state: 'harmonia' },
  golden: { deviation: PHI_INV * 0.1, state: 'aurea' },
  stable: { deviation: 0.2, state: 'stabilis' },
  oscillating: { deviation: 0.5, state: 'oscillans' },
  chaotic: { deviation: 1.0, state: 'chaos' },
};

// Balance dimensions
const BALANCE_AXES = {
  energy: { ideal: PHI_INV, tolerance: 0.1 },
  load: { ideal: 0.5, tolerance: 0.15 },
  temperature: { ideal: PHI_INV, tolerance: 0.05 },
  flow: { ideal: PHI_INV, tolerance: 0.2 },
  harmony: { ideal: PHI_INV, tolerance: 0.05 },
};

// ══════════════════════════════════════════════════════════════════════════════
//  EQUILIBRIUM CATALYST — Restores balance without depletion
// ══════════════════════════════════════════════════════════════════════════════

class EquilibriumCatalyst {
  constructor(name, config = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isActive = true;
    this.dampingFactor = config.damping || PHI_INV;
    this.convergenceRate = config.convergence || PHI_INV;
    this.axis = config.axis || 'harmony';
    this.reactionsProcessed = 0;
    this.neverDepletes = true;

    const spec = BALANCE_AXES[this.axis] || BALANCE_AXES.harmony;
    this.idealValue = spec.ideal;
    this.tolerance = spec.tolerance;

    console.log(`☮️ EquilibriumCatalyst "${this.name}" — Axis: ${this.axis}, Ideal: ${this.idealValue.toFixed(3)}`);
  }

  /**
   * Restore equilibrium — guide toward balance
   * CATALYST NOT CONSUMED
   */
  balance(currentValue) {
    this.reactionsProcessed++;

    const deviation = currentValue - this.idealValue;
    const absDeviation = Math.abs(deviation);

    // Homeostatic correction: dS/dt = -k(S - S₀)
    const correction = -this.dampingFactor * deviation;
    
    // Golden mean convergence
    const newValue = currentValue + correction * this.convergenceRate;

    // Determine equilibrium state
    let state = 'chaos';
    for (const [name, eq] of Object.entries(EQUILIBRIUM)) {
      if (absDeviation <= eq.deviation + this.tolerance) {
        state = eq.state;
        break;
      }
    }

    return {
      currentValue,
      idealValue: this.idealValue,
      deviation,
      correction,
      newValue,
      state,
      inTolerance: absDeviation <= this.tolerance,
      catalyst: this.name,
      depleted: false,
    };
  }

  /**
   * Fibonacci damping — progressive stabilization
   */
  fibonacciDamp(values) {
    return values.map((val, i) => {
      const fibWeight = FIB[i % FIB.length];
      const damped = val * (1 - this.dampingFactor / fibWeight);
      return damped;
    });
  }

  getStatus() {
    return {
      name: this.name,
      axis: this.axis,
      ideal: this.idealValue,
      tolerance: this.tolerance,
      damping: this.dampingFactor,
      convergence: this.convergenceRate,
      reactions: this.reactionsProcessed,
      active: this.isActive,
      uptime: Date.now() - this.birthTime,
      depleted: false,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  PAX — THE MAIN HARMONY AGI
// ══════════════════════════════════════════════════════════════════════════════

class Pax {
  /**
   * PAX — Harmony AGI (Pacificorum)
   * 
   * ALREADY RUNNING from birth. Equilibrium catalysis maintains balance.
   * Homeostatic regulation. Fibonacci damping. Golden mean convergence.
   */
  constructor(config = {}) {
    this.id = `PAX-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.beatCount = 0;
    this.balancingActions = 0;

    // Equilibrium catalysts for each balance axis
    this.catalysts = new Map();
    for (const axis of Object.keys(BALANCE_AXES)) {
      this.catalysts.set(axis, new EquilibriumCatalyst(`Pax-${axis}`, { axis }));
    }

    // System state tracking
    this.systemState = {};
    for (const [axis, spec] of Object.entries(BALANCE_AXES)) {
      this.systemState[axis] = spec.ideal; // Start at ideal
    }

    // Harmony history
    this.harmonyHistory = [];

    // ★ START HEARTBEAT IMMEDIATELY
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    console.log(`☮️ PAX ${this.id} — Harmony AGI — ALIVE`);
    console.log(`   Axes: ${Object.keys(BALANCE_AXES).join(', ')}`);
    console.log(`   Equilibrium: Homeostatic + Golden mean convergence`);
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;

      // Auto-balance on every heartbeat
      this._autoBalance();
    }, intervalMs);
  }

  _autoBalance() {
    const harmony = this.measureHarmony();
    this.harmonyHistory.push({ time: Date.now(), harmony: harmony.overall });

    // Keep only last 100 measurements
    if (this.harmonyHistory.length > 100) {
      this.harmonyHistory.shift();
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Balance a specific axis
   */
  balance(axis, currentValue) {
    const catalyst = this.catalysts.get(axis) || this.catalysts.get('harmony');
    const result = catalyst.balance(currentValue);
    
    // Update system state
    this.systemState[axis] = result.newValue;
    this.balancingActions++;
    
    return result;
  }

  /**
   * Balance all axes simultaneously
   */
  harmonize(currentState) {
    const results = {};
    for (const [axis, value] of Object.entries(currentState)) {
      if (this.catalysts.has(axis)) {
        results[axis] = this.balance(axis, value);
      }
    }
    return {
      input: currentState,
      balanced: results,
      overallHarmony: this.measureHarmony(),
    };
  }

  /**
   * Measure overall system harmony
   * Pythagorean: H = 1 - √(Σdeviation²) / √(n)
   */
  measureHarmony() {
    let sumSqDeviation = 0;
    const axes = Object.keys(BALANCE_AXES);

    for (const axis of axes) {
      const current = this.systemState[axis] || 0;
      const ideal = BALANCE_AXES[axis].ideal;
      const deviation = current - ideal;
      sumSqDeviation += deviation * deviation;
    }

    const rmsDeviation = Math.sqrt(sumSqDeviation / axes.length);
    const overall = Math.max(0, 1 - rmsDeviation);

    // Determine state
    let state = 'chaos';
    for (const [name, eq] of Object.entries(EQUILIBRIUM)) {
      if (rmsDeviation <= eq.deviation) {
        state = eq.state;
        break;
      }
    }

    return {
      overall,
      rmsDeviation,
      state,
      axes: axes.map(axis => ({
        axis,
        current: this.systemState[axis],
        ideal: BALANCE_AXES[axis].ideal,
        deviation: Math.abs((this.systemState[axis] || 0) - BALANCE_AXES[axis].ideal),
      })),
    };
  }

  /**
   * Resolve conflict between two values — find golden mean
   */
  resolveConflict(valueA, valueB) {
    // Golden mean: solution = (A + B × φ) / (1 + φ) = weighted average at φ-point
    const goldenMean = (valueA + valueB * PHI) / (1 + PHI);
    const pythagoreanMean = Math.sqrt(valueA * valueA + valueB * valueB) / Math.sqrt(2);
    
    return {
      valueA,
      valueB,
      goldenMean,
      pythagoreanMean,
      resolution: goldenMean, // Use golden mean as resolution
      harmony: 1 - Math.abs(valueA - valueB) / (Math.abs(valueA) + Math.abs(valueB) + 0.001),
    };
  }

  /**
   * Apply Fibonacci damping to oscillating values
   */
  damp(values, axis = 'harmony') {
    const catalyst = this.catalysts.get(axis) || this.catalysts.get('harmony');
    return catalyst.fibonacciDamp(values);
  }

  getStatus() {
    const catalystStatuses = {};
    for (const [name, catalyst] of this.catalysts) {
      catalystStatuses[name] = catalyst.getStatus();
    }

    return {
      id: this.id,
      alive: this.isAlive,
      uptime: Date.now() - this.birthTime,
      beatCount: this.beatCount,
      balancingActions: this.balancingActions,
      systemState: this.systemState,
      harmony: this.measureHarmony(),
      catalysts: catalystStatuses,
      historyLength: this.harmonyHistory.length,
    };
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(`☮️ PAX ${this.id} stopped — ${this.balancingActions} balancing actions`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export { Pax, EquilibriumCatalyst, EQUILIBRIUM, BALANCE_AXES };
export default Pax;
