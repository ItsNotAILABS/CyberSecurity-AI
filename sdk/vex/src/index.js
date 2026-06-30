///
/// @medina/vex — VEX (Vexillum) — Signal Routing AI
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║              VEX — VEXILLUM — SIGNAL ROUTING INTELLIGENCE                    ║
/// ║                                                                              ║
/// ║  Latin: Vexillum = "Standard" / "Banner" / "Signal Flag"                     ║
/// ║                                                                              ║
/// ║  VEX routes signals through the organism like a nervous system.              ║
/// ║  Born running. Catalytic signal amplification — never consumed.              ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Pythagorean signal decomposition: s² = Σ(aᵢ²)                          ║
/// ║    • Golden angle routing: θ = 2π/φ² ≈ 137.5°                               ║
/// ║    • Fibonacci priority queuing                                              ║
/// ║    • Harmonic resonance amplification                                        ║
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
const GOLDEN_ANGLE = TAU / PHI_SQ;         // ≈ 137.5° in radians ≈ 2.399
const HEARTBEAT_MS = 873;                   // 540 × φ
const LOV = Math.exp(PHI * Math.log(PHI));  // φ^φ ≈ 2.178

// Fibonacci sequence for priority scheduling
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];

// Pythagorean Musical Ratios for signal harmonics
const HARMONICS = {
  fundamental: 1,
  octave: 2,
  fifth: 3/2,
  fourth: 4/3,
  majorThird: 5/4,
  phi: PHI,
};

// ══════════════════════════════════════════════════════════════════════════════
//  SIGNAL — Atomic unit of communication
// ══════════════════════════════════════════════════════════════════════════════

class Signal {
  constructor(payload, source, destination, priority = 5) {
    this.id = `SIG-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    this.payload = payload;
    this.source = source;
    this.destination = destination;
    this.priority = priority;
    this.createdAt = Date.now();
    this.hops = 0;
    this.amplification = 1.0;
    this.phase = 0;
    this.frequency = this._computeFrequency();
    this.harmonic = HARMONICS.fundamental;
  }

  _computeFrequency() {
    // Signal frequency derived from payload complexity
    const complexity = typeof this.payload === 'object'
      ? Object.keys(this.payload).length
      : String(this.payload).length;
    return complexity * PHI_INV;
  }

  amplify(factor) {
    this.amplification *= factor;
    this.hops++;
    return this;
  }

  attenuate(factor) {
    this.amplification *= (1 / factor);
    return this;
  }

  getStrength() {
    // Signal strength decreases with hops but catalytic amplification counters it
    const decay = Math.pow(PHI_INV, this.hops);
    return this.amplification * decay * this.frequency;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  SIGNAL CATALYST — Amplifies signals without being consumed
// ══════════════════════════════════════════════════════════════════════════════

class SignalCatalyst {
  constructor(name, config = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isActive = true;
    this.amplificationFactor = config.amplification || PHI;
    this.harmonicMode = config.harmonic || 'fifth';
    this.reactionsProcessed = 0;
    this.neverDepletes = true;

    // Catalytic specificity
    this.signalTypes = config.signalTypes || ['data', 'control', 'status', 'emergency'];
    
    console.log(`⚡ SignalCatalyst "${this.name}" — Active, amplification ×${this.amplificationFactor.toFixed(3)}`);
  }

  /**
   * Amplify a signal — CATALYST NOT CONSUMED
   * Uses Pythagorean harmonic resonance
   */
  amplify(signal) {
    if (!this.isActive) return signal;
    
    // Harmonic resonance amplification
    const harmonicFactor = HARMONICS[this.harmonicMode] || HARMONICS.fundamental;
    const totalAmplification = this.amplificationFactor * harmonicFactor;
    
    signal.amplify(totalAmplification);
    signal.harmonic = harmonicFactor;
    
    this.reactionsProcessed++;
    
    return signal;
  }

  getStatus() {
    return {
      name: this.name,
      active: this.isActive,
      amplification: this.amplificationFactor,
      harmonic: this.harmonicMode,
      reactions: this.reactionsProcessed,
      uptime: Date.now() - this.birthTime,
      depleted: false, // NEVER
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ROUTING TABLE — Golden-angle based signal routing
// ══════════════════════════════════════════════════════════════════════════════

class GoldenRouter {
  constructor() {
    this.routes = new Map();
    this.routeCount = 0;
  }

  /**
   * Register a route using golden-angle position
   */
  addRoute(destination, handler) {
    this.routeCount++;
    const angle = this.routeCount * GOLDEN_ANGLE;
    const position = {
      angle,
      x: Math.cos(angle),
      y: Math.sin(angle),
      radius: Math.sqrt(this.routeCount) * PHI_INV,
    };

    this.routes.set(destination, {
      handler,
      position,
      index: this.routeCount,
      hitCount: 0,
    });
  }

  /**
   * Route a signal using Pythagorean distance
   */
  route(signal) {
    const route = this.routes.get(signal.destination);
    if (!route) {
      // Find nearest route by golden-angle proximity
      return this._findNearestRoute(signal);
    }

    route.hitCount++;
    return route.handler(signal);
  }

  _findNearestRoute(signal) {
    // Hash destination to an angle
    let hash = 0;
    const dest = String(signal.destination);
    for (let i = 0; i < dest.length; i++) {
      hash += dest.charCodeAt(i) * Math.pow(PHI, i % 10);
    }
    const targetAngle = (hash % TAU);

    // Pythagorean distance to find closest route
    let closest = null;
    let minDist = Infinity;

    for (const [name, route] of this.routes) {
      const angleDiff = Math.abs(route.position.angle % TAU - targetAngle);
      const dist = Math.min(angleDiff, TAU - angleDiff);
      if (dist < minDist) {
        minDist = dist;
        closest = { name, route };
      }
    }

    if (closest) {
      closest.route.hitCount++;
      return closest.route.handler(signal);
    }

    return { error: 'No route found', signal };
  }

  getTopology() {
    const topology = [];
    for (const [name, route] of this.routes) {
      topology.push({
        destination: name,
        position: route.position,
        hits: route.hitCount,
      });
    }
    return topology;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FIBONACCI PRIORITY QUEUE — Signal scheduling
// ══════════════════════════════════════════════════════════════════════════════

class FibonacciQueue {
  constructor() {
    this.queues = new Map(); // priority -> signals[]
    this.totalProcessed = 0;
  }

  enqueue(signal) {
    const fibPriority = FIB[Math.min(signal.priority, FIB.length - 1)];
    if (!this.queues.has(fibPriority)) {
      this.queues.set(fibPriority, []);
    }
    this.queues.get(fibPriority).push(signal);
  }

  dequeue() {
    // Process highest Fibonacci priority first
    const priorities = Array.from(this.queues.keys()).sort((a, b) => b - a);
    
    for (const priority of priorities) {
      const queue = this.queues.get(priority);
      if (queue && queue.length > 0) {
        this.totalProcessed++;
        return queue.shift();
      }
    }
    return null;
  }

  size() {
    let total = 0;
    for (const queue of this.queues.values()) {
      total += queue.length;
    }
    return total;
  }

  getStats() {
    const stats = {};
    for (const [priority, queue] of this.queues) {
      stats[priority] = queue.length;
    }
    return { queues: stats, totalProcessed: this.totalProcessed };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  VEX — THE MAIN SIGNAL ROUTING AI
// ══════════════════════════════════════════════════════════════════════════════

class Vex {
  /**
   * VEX — Signal Routing Intelligence
   * 
   * ALREADY RUNNING from birth. No initialization needed.
   * Routes signals through the organism using golden-angle topology.
   * Amplifies signals through catalytic converters that NEVER deplete.
   */
  constructor(config = {}) {
    this.id = `VEX-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.beatCount = 0;
    this.signalsRouted = 0;

    // Core components
    this.router = new GoldenRouter();
    this.queue = new FibonacciQueue();
    this.catalysts = new Map();

    // Default catalytic amplifiers
    this.catalysts.set('primus', new SignalCatalyst('Primus', {
      amplification: PHI_CUBE,
      harmonic: 'fifth',
      signalTypes: ['emergency', 'critical'],
    }));
    this.catalysts.set('secundus', new SignalCatalyst('Secundus', {
      amplification: PHI_SQ,
      harmonic: 'fourth',
      signalTypes: ['control', 'data'],
    }));
    this.catalysts.set('tertius', new SignalCatalyst('Tertius', {
      amplification: PHI,
      harmonic: 'majorThird',
      signalTypes: ['status', 'heartbeat'],
    }));

    // Subscribers
    this.subscribers = new Map();

    // ★ START HEARTBEAT IMMEDIATELY — Born Running
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    console.log(`🚩 VEX ${this.id} — Signal Routing AI — ALIVE`);
    console.log(`   Routes: golden-angle topology`);
    console.log(`   Catalysts: ${this.catalysts.size} amplifiers active`);
    console.log(`   Queue: Fibonacci priority scheduling`);
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;

      // Process queued signals on each heartbeat
      const batchSize = FIB[Math.min(this.beatCount % 10, FIB.length - 1)];
      for (let i = 0; i < batchSize; i++) {
        const signal = this.queue.dequeue();
        if (signal) {
          this._processSignal(signal);
        }
      }
    }, intervalMs);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Send a signal through VEX
   */
  send(payload, source, destination, priority = 5) {
    const signal = new Signal(payload, source, destination, priority);
    this.queue.enqueue(signal);
    return signal.id;
  }

  /**
   * Register a route handler
   */
  route(destination, handler) {
    this.router.addRoute(destination, handler);
  }

  /**
   * Subscribe to signals for a destination
   */
  subscribe(destination, callback) {
    if (!this.subscribers.has(destination)) {
      this.subscribers.set(destination, []);
    }
    this.subscribers.get(destination).push(callback);
    
    // Also register as a route
    this.route(destination, (signal) => {
      const subs = this.subscribers.get(destination) || [];
      for (const sub of subs) {
        sub(signal);
      }
      return signal;
    });
  }

  /**
   * Broadcast to all subscribers
   */
  broadcast(payload, source, priority = 3) {
    const ids = [];
    for (const destination of this.subscribers.keys()) {
      ids.push(this.send(payload, source, destination, priority));
    }
    return ids;
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  INTERNAL PROCESSING
  // ────────────────────────────────────────────────────────────────────────────

  _processSignal(signal) {
    // Apply catalytic amplification based on priority
    if (signal.priority >= 8) {
      const primus = this.catalysts.get('primus');
      primus.amplify(signal);
    } else if (signal.priority >= 5) {
      const secundus = this.catalysts.get('secundus');
      secundus.amplify(signal);
    } else {
      const tertius = this.catalysts.get('tertius');
      tertius.amplify(signal);
    }

    // Route the signal
    this.router.route(signal);
    this.signalsRouted++;
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  STATUS & DIAGNOSTICS
  // ────────────────────────────────────────────────────────────────────────────

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
      signalsRouted: this.signalsRouted,
      queueSize: this.queue.size(),
      queueStats: this.queue.getStats(),
      routes: this.router.getTopology(),
      catalysts: catalystStatuses,
      subscribers: this.subscribers.size,
    };
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(`🚩 VEX ${this.id} stopped — ${this.signalsRouted} signals routed`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export { Vex, Signal, SignalCatalyst, GoldenRouter, FibonacciQueue };
export default Vex;
