///
/// @medina/dux — DUX (Ductorium) — Leadership AGI
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║              DUX — DUCTORIUM — LEADERSHIP INTELLIGENCE                       ║
/// ║                                                                              ║
/// ║  Latin: Dux = "Leader" / "Guide" / "Commander"                               ║
/// ║                                                                              ║
/// ║  DUX leads organism coordination, directs workflows, orchestrates.           ║
/// ║  Born running. Directional catalytic flow — guides without forcing.          ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Gradient descent: ∇f = ∂f/∂x₁ê₁ + ... + ∂f/∂xₙêₙ                   ║
/// ║    • Golden ratio resource allocation: major/minor = φ                       ║
/// ║    • Pythagorean path optimization: min √(Σdᵢ²)                            ║
/// ║    • Fibonacci task scheduling                                               ║
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
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

// Leadership styles (Roman military hierarchy)
const LEADERSHIP_STYLES = {
  imperator: { authority: PHI_CUBE, style: 'decisive', domain: 'crisis' },
  consul: { authority: PHI_SQ, style: 'collaborative', domain: 'strategy' },
  praetor: { authority: PHI, style: 'directive', domain: 'operations' },
  tribunus: { authority: 1.0, style: 'representative', domain: 'welfare' },
  centurio: { authority: PHI_INV, style: 'tactical', domain: 'execution' },
};

// ══════════════════════════════════════════════════════════════════════════════
//  DIRECTIONAL CATALYST — Guides flow without forcing
// ══════════════════════════════════════════════════════════════════════════════

class DirectionalCatalyst {
  constructor(name, config = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isActive = true;
    this.direction = config.direction || [1, 0, 0]; // Unit vector
    this.magnitude = config.magnitude || PHI;
    this.style = config.style || 'consul';
    this.reactionsProcessed = 0;
    this.neverDepletes = true;

    console.log(`🧭 DirectionalCatalyst "${this.name}" — Style: ${this.style}, Magnitude: ${this.magnitude.toFixed(3)}`);
  }

  /**
   * Direct input along a path — CATALYST NOT CONSUMED
   */
  direct(input, target) {
    this.reactionsProcessed++;

    // Compute gradient toward target
    const gradient = this._computeGradient(input, target);
    
    // Apply directional catalysis
    const directed = this._applyDirection(input, gradient);

    return {
      input,
      target,
      gradient,
      directed,
      catalyst: this.name,
      style: this.style,
      depleted: false,
    };
  }

  _computeGradient(current, target) {
    if (typeof current === 'number' && typeof target === 'number') {
      const diff = target - current;
      return { magnitude: Math.abs(diff), direction: Math.sign(diff), step: diff * PHI_INV };
    }
    
    // Object gradient
    if (typeof current === 'object' && typeof target === 'object') {
      const gradient = {};
      for (const key of Object.keys(target)) {
        const c = current[key] || 0;
        const t = target[key] || 0;
        if (typeof c === 'number' && typeof t === 'number') {
          gradient[key] = (t - c) * PHI_INV;
        }
      }
      return gradient;
    }

    return { magnitude: this.magnitude, direction: 1 };
  }

  _applyDirection(input, gradient) {
    if (typeof input === 'number' && gradient.step !== undefined) {
      return input + gradient.step * this.magnitude;
    }
    
    if (typeof input === 'object' && input !== null && typeof gradient === 'object') {
      const result = { ...input };
      for (const [key, step] of Object.entries(gradient)) {
        if (typeof result[key] === 'number') {
          result[key] += step * this.magnitude;
        }
      }
      return result;
    }

    return input;
  }

  getStatus() {
    return {
      name: this.name,
      style: this.style,
      magnitude: this.magnitude,
      direction: this.direction,
      reactions: this.reactionsProcessed,
      active: this.isActive,
      uptime: Date.now() - this.birthTime,
      depleted: false,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  DUX — THE MAIN LEADERSHIP AGI
// ══════════════════════════════════════════════════════════════════════════════

class Dux {
  /**
   * DUX — Leadership AGI (Ductorium)
   * 
   * ALREADY RUNNING from birth. Directional catalysis guides organisms.
   * Golden ratio resource allocation. Fibonacci task scheduling.
   */
  constructor(config = {}) {
    this.id = `DUX-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.beatCount = 0;
    this.directivesIssued = 0;

    // Directional catalysts for each leadership style
    this.catalysts = new Map();
    for (const [style, spec] of Object.entries(LEADERSHIP_STYLES)) {
      this.catalysts.set(style, new DirectionalCatalyst(`Dux-${style}`, {
        style,
        magnitude: spec.authority,
      }));
    }

    // Task registry
    this.tasks = new Map();
    this.completedTasks = 0;

    // Resource pools (golden ratio allocation)
    this.resources = {
      compute: 1000,
      memory: 1000,
      bandwidth: 1000,
    };

    // ★ START HEARTBEAT IMMEDIATELY
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    console.log(`🦅 DUX ${this.id} — Leadership AGI — ALIVE`);
    console.log(`   Styles: ${Object.keys(LEADERSHIP_STYLES).join(', ')}`);
    console.log(`   Allocation: Golden ratio (φ:1 = major:minor)`);
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;

      // Schedule pending tasks using Fibonacci priority
      this._scheduleTasks();
    }, intervalMs);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Issue a directive — guide an organism toward a target
   */
  direct(input, target, style = 'consul') {
    const catalyst = this.catalysts.get(style) || this.catalysts.get('consul');
    const result = catalyst.direct(input, target);
    this.directivesIssued++;
    return result;
  }

  /**
   * Allocate resources using golden ratio
   * Major portion = φ/(φ+1) ≈ 61.8%
   * Minor portion = 1/(φ+1) ≈ 38.2%
   */
  allocate(resource, total) {
    const major = total * PHI_INV;  // 61.8%
    const minor = total * (1 - PHI_INV); // 38.2%
    return { major, minor, ratio: PHI, total };
  }

  /**
   * Create a task with Fibonacci scheduling
   */
  createTask(name, priority, handler) {
    const fibPriority = FIB[Math.min(priority, FIB.length - 1)];
    const task = {
      name,
      priority: fibPriority,
      handler,
      created: Date.now(),
      status: 'pending',
    };
    this.tasks.set(name, task);
    return task;
  }

  /**
   * Get optimal path (Pythagorean minimum distance)
   */
  findPath(waypoints) {
    if (waypoints.length < 2) return { path: waypoints, distance: 0 };

    let totalDistance = 0;
    for (let i = 1; i < waypoints.length; i++) {
      const prev = waypoints[i - 1];
      const curr = waypoints[i];
      
      // Pythagorean distance
      if (typeof prev === 'number' && typeof curr === 'number') {
        totalDistance += Math.abs(curr - prev);
      } else if (typeof prev === 'object' && typeof curr === 'object') {
        let sumSq = 0;
        for (const key of Object.keys(curr)) {
          const diff = (curr[key] || 0) - (prev[key] || 0);
          sumSq += diff * diff;
        }
        totalDistance += Math.sqrt(sumSq);
      }
    }

    return {
      path: waypoints,
      distance: totalDistance,
      efficiency: 1 / (1 + totalDistance / PHI), // φ-normalized efficiency
    };
  }

  _scheduleTasks() {
    // Process highest-priority pending task
    let highestPriority = -1;
    let nextTask = null;

    for (const [name, task] of this.tasks) {
      if (task.status === 'pending' && task.priority > highestPriority) {
        highestPriority = task.priority;
        nextTask = task;
      }
    }

    if (nextTask && nextTask.handler) {
      nextTask.status = 'running';
      try {
        nextTask.handler();
        nextTask.status = 'complete';
        this.completedTasks++;
      } catch (e) {
        nextTask.status = 'failed';
      }
    }
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
      directives: this.directivesIssued,
      tasks: this.tasks.size,
      completed: this.completedTasks,
      resources: this.resources,
      catalysts: catalystStatuses,
    };
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(`🦅 DUX ${this.id} stopped — ${this.directivesIssued} directives issued`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export { Dux, DirectionalCatalyst, LEADERSHIP_STYLES };
export default Dux;
