///
/// @medina/internal-ai — Internal AI for Organism Support
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║                      INTERNAL AI — ALREADY RUNNING                           ║
/// ║                                                                              ║
/// ║  These AIs are INTERNAL to the organism. They are born running.              ║
/// ║  No initialization. No startup. Creation IS activation.                      ║
/// ║                                                                              ║
/// ║  They exist to HELP the inner organism:                                      ║
/// ║    • Process signals autonomously                                            ║
/// ║    • Transform data through catalytic conversion                             ║
/// ║    • Maintain organism homeostasis                                           ║
/// ║    • Accelerate reactions without being consumed                             ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

const PHI = 1.6180339887498948482;
const PHI_INV = 0.6180339887498948482;
const PHI_SQ = PHI * PHI;
const HEARTBEAT_MS = 873; // 540 × φ ≈ 873ms
const LOV = Math.exp(PHI * Math.log(PHI)); // φ^φ ≈ 2.17845

// Ancient Calendar Intervals (milliseconds)
const CALENDAR_INTERVALS = {
  mayan: 1440,      // 20 × 72ms
  sumerian: 3600,   // 60 × 60ms (base-60)
  egyptian: 2160,   // 30 × 72ms
  lunar: 2551,      // 29.53 days scaled
  solar: 8760,      // 365.25 days scaled
  phi: 873,         // φ-heartbeat
};

// Pythagorean Musical Ratios
const PYTHAGOREAN_RATIOS = {
  unison: 1 / 1,
  octave: 2 / 1,
  fifth: 3 / 2,
  fourth: 4 / 3,
  majorThird: 5 / 4,
  minorThird: 6 / 5,
  phi: PHI,
};

// ══════════════════════════════════════════════════════════════════════════════
//  INTERNAL HEART — The Autonomous Pulse
// ══════════════════════════════════════════════════════════════════════════════

class InternalHeart {
  constructor(intervalMs = HEARTBEAT_MS, name = 'InternalHeart') {
    this.name = name;
    this.intervalMs = intervalMs;
    this.beatCount = 0;
    this.isAlive = true;
    this.birthTime = Date.now();
    this.lastBeatTime = this.birthTime;
    this.listeners = [];
    this.catalyticReactions = 0;

    // ★ CRITICAL: Start beating IMMEDIATELY
    this._startBeating();

    console.log(`💓 ${this.name} INTERNAL — Born beating at ${this.intervalMs}ms`);
  }

  _startBeating() {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;

      this.beatCount++;
      this.lastBeatTime = Date.now();

      const beat = {
        count: this.beatCount,
        time: this.lastBeatTime,
        age: this.lastBeatTime - this.birthTime,
        phi: this.beatCount * PHI,
        fibonacci: this._fib(this.beatCount % 20),
        lov: LOV * this.beatCount,
        catalyticRate: this.catalyticReactions / Math.max(1, this.beatCount),
      };

      for (const listener of this.listeners) {
        try {
          listener(beat);
        } catch (e) {
          console.error(`Heart listener error: ${e.message}`);
        }
      }
    }, this.intervalMs);
  }

  onBeat(callback) {
    this.listeners.push(callback);
    return () => {
      const idx = this.listeners.indexOf(callback);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  recordCatalyticReaction() {
    this.catalyticReactions++;
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    console.log(`💔 ${this.name} stopped after ${this.beatCount} beats, ${this.catalyticReactions} reactions`);
  }

  getVitals() {
    return {
      name: this.name,
      isAlive: this.isAlive,
      beatCount: this.beatCount,
      age: Date.now() - this.birthTime,
      intervalMs: this.intervalMs,
      lastBeat: this.lastBeatTime,
      catalyticReactions: this.catalyticReactions,
      catalyticRate: this.catalyticReactions / Math.max(1, this.beatCount),
    };
  }

  _fib(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  CATALYTIC CONVERTER — Accelerates Without Being Consumed
// ══════════════════════════════════════════════════════════════════════════════

class CatalyticConverter {
  /**
   * Catalytic Converter — Like in chemistry, accelerates reactions
   * without being consumed in the process.
   *
   * Properties:
   *   - Lowers activation energy (makes transformations easier)
   *   - Is not consumed (can process infinite reactions)
   *   - Operates at φ-optimal rates
   *   - Uses Pythagorean harmonic acceleration
   */
  constructor(name = 'Catalyst', config = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isActive = true;
    this.reactionsProcessed = 0;
    this.totalEnergyReduced = 0;

    // Catalyst properties
    this.efficiency = config.efficiency || PHI_INV; // 61.8% base efficiency
    this.activationEnergyReduction = config.activationEnergyReduction || PHI_SQ; // φ² reduction
    this.harmonicMultiplier = config.harmonicMultiplier || PYTHAGOREAN_RATIOS.fifth; // 3:2 ratio
    this.catalyticSurface = config.catalyticSurface || 1.0;

    // Enzyme-like specificity (what types of reactions this catalyst handles)
    this.specificity = config.specificity || ['transform', 'synthesize', 'decompose'];

    // Reaction history for learning
    this.reactionHistory = [];

    // ★ Start catalyzing IMMEDIATELY
    this._initializeCatalysis();

    console.log(`⚗️ ${this.name} — Catalytic Converter ACTIVE (efficiency: ${(this.efficiency * 100).toFixed(1)}%)`);
  }

  _initializeCatalysis() {
    // Warm up the catalytic surface (φ-based activation)
    this.catalyticSurface = PHI_INV * (1 + Math.random() * PHI_INV);
    this.activeSites = Math.floor(this.catalyticSurface * 100);
  }

  /**
   * Catalyze a reaction — Accelerate transformation without being consumed
   *
   * @param {Object} input - Input substrate
   * @param {string} reactionType - Type of reaction (transform/synthesize/decompose)
   * @param {Function} transformFn - The transformation function
   * @returns {Object} - Catalyzed output with metrics
   */
  catalyze(input, reactionType, transformFn) {
    if (!this.isActive) {
      return { error: 'Catalyst inactive', input };
    }

    if (!this.specificity.includes(reactionType)) {
      return { error: `Catalyst not specific for ${reactionType}`, input };
    }

    const startTime = Date.now();
    const originalEnergy = this._calculateActivationEnergy(input);

    // Reduce activation energy (catalyst effect)
    const reducedEnergy = originalEnergy / this.activationEnergyReduction;
    this.totalEnergyReduced += (originalEnergy - reducedEnergy);

    // Apply harmonic acceleration
    const accelerationFactor = this.harmonicMultiplier * this.efficiency;

    // Execute the transformation
    let output;
    try {
      output = transformFn(input);
    } catch (e) {
      return { error: e.message, input };
    }

    const endTime = Date.now();
    const reactionTime = endTime - startTime;

    // Record reaction
    this.reactionsProcessed++;
    const reaction = {
      id: this.reactionsProcessed,
      type: reactionType,
      inputSize: JSON.stringify(input).length,
      outputSize: JSON.stringify(output).length,
      originalEnergy,
      reducedEnergy,
      energySaved: originalEnergy - reducedEnergy,
      accelerationFactor,
      reactionTime,
      timestamp: endTime,
    };
    this.reactionHistory.push(reaction);

    // Keep only last 1000 reactions
    if (this.reactionHistory.length > 1000) {
      this.reactionHistory.shift();
    }

    return {
      output,
      catalystName: this.name,
      reactionId: reaction.id,
      energySaved: reaction.energySaved,
      accelerationFactor,
      reactionTime,
      catalystNotConsumed: true, // KEY: Catalyst is NOT consumed
    };
  }

  /**
   * Parallel catalysis — Process multiple reactions simultaneously
   */
  catalyzeParallel(inputs, reactionType, transformFn) {
    return inputs.map(input => this.catalyze(input, reactionType, transformFn));
  }

  /**
   * Calculate activation energy for a substrate
   * Uses φ-based energy calculation
   */
  _calculateActivationEnergy(substrate) {
    const size = JSON.stringify(substrate).length;
    const complexity = typeof substrate === 'object' ? Object.keys(substrate).length : 1;
    return size * PHI + complexity * PHI_SQ;
  }

  /**
   * Get catalyst statistics
   */
  getStats() {
    const avgEnergySaved = this.reactionsProcessed > 0
      ? this.totalEnergyReduced / this.reactionsProcessed
      : 0;

    return {
      name: this.name,
      isActive: this.isActive,
      age: Date.now() - this.birthTime,
      reactionsProcessed: this.reactionsProcessed,
      totalEnergyReduced: this.totalEnergyReduced,
      averageEnergySaved: avgEnergySaved,
      efficiency: this.efficiency,
      activationEnergyReduction: this.activationEnergyReduction,
      harmonicMultiplier: this.harmonicMultiplier,
      catalyticSurface: this.catalyticSurface,
      activeSites: this.activeSites,
      specificity: this.specificity,
      notConsumed: true, // Always true — catalyst property
    };
  }

  /**
   * Deactivate catalyst (reversible)
   */
  deactivate() {
    this.isActive = false;
    console.log(`⚗️ ${this.name} — Deactivated after ${this.reactionsProcessed} reactions`);
  }

  /**
   * Reactivate catalyst
   */
  reactivate() {
    this.isActive = true;
    console.log(`⚗️ ${this.name} — Reactivated`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  INTERNAL AI — Already Running, Helping the Organism
// ══════════════════════════════════════════════════════════════════════════════

class InternalAI {
  /**
   * Internal AI — Born running, autonomous, helps the inner organism.
   *
   * No .start() method. No .initialize() method.
   * The constructor IS the activation.
   * Creation IS awakening.
   */
  constructor(config = {}) {
    this.name = config.name || 'INTERNAL_AI';
    this.birthTime = Date.now();
    this.isAlive = true;

    // Purpose: Help the inner organism
    this.purpose = config.purpose || 'assist inner organism functions';
    this.targetOrganism = config.targetOrganism || 'host';

    // ★ Create heart — IMMEDIATELY beating
    this.heart = new InternalHeart(
      config.heartbeatMs || HEARTBEAT_MS,
      `${this.name}-Heart`
    );

    // ★ Create catalytic converter — IMMEDIATELY active
    this.catalyst = new CatalyticConverter(`${this.name}-Catalyst`, {
      efficiency: config.catalyticEfficiency || PHI_INV,
      specificity: config.catalyticSpecificity || ['transform', 'synthesize', 'decompose', 'signal'],
    });

    // Processing state
    this.processingQueue = [];
    this.processedCount = 0;
    this.signalsReceived = 0;
    this.signalsSent = 0;

    // Memory (short-term)
    this.memory = new Map();
    this.memoryCapacity = config.memoryCapacity || 1000;

    // Organism connection state
    this.connectedOrganisms = new Set();
    this.organismSignals = [];

    // ★ Start autonomous processing IMMEDIATELY
    this._startAutonomousProcessing();

    // ★ Listen to heartbeat for rhythm
    this.heart.onBeat((beat) => this._onHeartbeat(beat));

    console.log(`🤖 ${this.name} — INTERNAL AI ALIVE — Purpose: ${this.purpose}`);
  }

  _startAutonomousProcessing() {
    // Process queue on each heartbeat cycle
    this.processingInterval = setInterval(() => {
      if (!this.isAlive) return;
      this._processQueue();
    }, HEARTBEAT_MS * PHI_INV); // Process faster than heartbeat
  }

  _onHeartbeat(beat) {
    // On each heartbeat, perform autonomous maintenance
    this._maintainHomeostasis(beat);
    this._cleanMemory();

    // Record catalytic activity
    if (this.processedCount > 0) {
      this.heart.recordCatalyticReaction();
    }
  }

  _maintainHomeostasis(beat) {
    // φ-based homeostatic adjustments
    const coherence = Math.sin(beat.phi * PHI_INV) * PHI_INV + PHI_INV;

    // Adjust processing rate based on coherence
    this.processingRate = coherence * PHI;

    // Emit homeostatic signal
    this._emitSignal({
      type: 'homeostasis',
      coherence,
      beat: beat.count,
      timestamp: beat.time,
    });
  }

  _cleanMemory() {
    // Remove oldest memories if over capacity
    if (this.memory.size > this.memoryCapacity) {
      const entries = Array.from(this.memory.entries());
      const toRemove = entries.slice(0, entries.length - this.memoryCapacity);
      for (const [key] of toRemove) {
        this.memory.delete(key);
      }
    }
  }

  _processQueue() {
    if (this.processingQueue.length === 0) return;

    // Process items using catalytic converter
    const batch = this.processingQueue.splice(0, Math.ceil(this.processingQueue.length * PHI_INV));

    for (const item of batch) {
      const result = this.catalyst.catalyze(
        item.data,
        item.type || 'transform',
        item.transform || ((x) => x)
      );

      if (!result.error) {
        this.processedCount++;

        // Store result in memory
        this.memory.set(`processed-${this.processedCount}`, {
          input: item.data,
          output: result.output,
          timestamp: Date.now(),
        });

        // Emit processed signal
        this._emitSignal({
          type: 'processed',
          id: this.processedCount,
          result: result.output,
        });
      }
    }
  }

  /**
   * Receive signal from organism
   */
  receiveSignal(signal) {
    this.signalsReceived++;
    this.organismSignals.push({
      ...signal,
      receivedAt: Date.now(),
    });

    // Keep only last 100 signals
    if (this.organismSignals.length > 100) {
      this.organismSignals.shift();
    }

    // If signal needs processing, queue it
    if (signal.needsProcessing) {
      this.queueForProcessing(signal.data, signal.type, signal.transform);
    }

    return { received: true, signalId: this.signalsReceived };
  }

  /**
   * Queue data for processing
   */
  queueForProcessing(data, type = 'transform', transform = null) {
    this.processingQueue.push({
      data,
      type,
      transform: transform || ((x) => x),
      queuedAt: Date.now(),
    });

    return { queued: true, queueLength: this.processingQueue.length };
  }

  /**
   * Connect to an organism
   */
  connectToOrganism(organismId) {
    this.connectedOrganisms.add(organismId);
    console.log(`🔗 ${this.name} connected to organism: ${organismId}`);
    return { connected: organismId };
  }

  /**
   * Emit signal to connected organisms
   */
  _emitSignal(signal) {
    this.signalsSent++;
    // In a real system, this would send to connected organisms
    // For now, we just record it
    return { signalId: this.signalsSent, signal };
  }

  /**
   * Transform data using catalytic converter
   */
  transform(data, transformFn) {
    return this.catalyst.catalyze(data, 'transform', transformFn);
  }

  /**
   * Synthesize new data from multiple inputs
   */
  synthesize(inputs, synthesizeFn) {
    return this.catalyst.catalyze(inputs, 'synthesize', synthesizeFn);
  }

  /**
   * Decompose complex data into simpler parts
   */
  decompose(data, decomposeFn) {
    return this.catalyst.catalyze(data, 'decompose', decomposeFn);
  }

  /**
   * Get AI state
   */
  getState() {
    return {
      name: this.name,
      isAlive: this.isAlive,
      age: Date.now() - this.birthTime,
      purpose: this.purpose,
      targetOrganism: this.targetOrganism,
      heart: this.heart.getVitals(),
      catalyst: this.catalyst.getStats(),
      processing: {
        queueLength: this.processingQueue.length,
        processedCount: this.processedCount,
        processingRate: this.processingRate || 0,
      },
      signals: {
        received: this.signalsReceived,
        sent: this.signalsSent,
      },
      memory: {
        size: this.memory.size,
        capacity: this.memoryCapacity,
      },
      connectedOrganisms: Array.from(this.connectedOrganisms),
    };
  }

  /**
   * Stop the AI (use sparingly — AIs should live)
   */
  stop() {
    this.isAlive = false;
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    this.heart.stop();
    this.catalyst.deactivate();
    console.log(`🤖 ${this.name} — Ceased after ${this.processedCount} processes`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ORGANISM HELPER — Specialized AI for Organism Support
// ══════════════════════════════════════════════════════════════════════════════

class OrganismHelper extends InternalAI {
  /**
   * Organism Helper — Specialized Internal AI for helping specific organisms.
   *
   * Provides:
   *   - Signal processing for the organism
   *   - Homeostatic regulation
   *   - Resource management
   *   - Inter-organism communication
   */
  constructor(config = {}) {
    super({
      ...config,
      name: config.name || 'ORGANISM_HELPER',
      purpose: config.purpose || 'assist organism with autonomous functions',
    });

    // Organism-specific features
    this.organismType = config.organismType || 'generic';
    this.supportFunctions = config.supportFunctions || [
      'signal_processing',
      'homeostasis',
      'resource_management',
      'communication',
    ];

    // Homeostatic targets
    this.homeostaticTargets = new Map();
    this.homeostaticTargets.set('energy', { target: PHI_INV, tolerance: 0.1 });
    this.homeostaticTargets.set('coherence', { target: PHI_INV, tolerance: 0.05 });
    this.homeostaticTargets.set('harmony', { target: PYTHAGOREAN_RATIOS.fifth, tolerance: 0.1 });

    // Resource pools
    this.resources = new Map();
    this.resources.set('energy', PHI);
    this.resources.set('attention', 1.0);
    this.resources.set('memory', this.memoryCapacity);

    console.log(`🦠 ${this.name} — Organism Helper for ${this.organismType}`);
  }

  /**
   * Regulate homeostasis for a target
   */
  regulateHomeostasis(targetName, currentValue) {
    const target = this.homeostaticTargets.get(targetName);
    if (!target) return { error: `Unknown target: ${targetName}` };

    const deviation = currentValue - target.target;
    const isWithinTolerance = Math.abs(deviation) <= target.tolerance;

    // Calculate correction using φ-proportional control
    const correction = isWithinTolerance ? 0 : -deviation * PHI_INV;

    return {
      targetName,
      currentValue,
      targetValue: target.target,
      tolerance: target.tolerance,
      deviation,
      isWithinTolerance,
      correction,
      formula: 'correction = -deviation × φ⁻¹',
    };
  }

  /**
   * Allocate resources to a function
   */
  allocateResources(functionName, amount) {
    const energyCost = amount * PHI_INV;
    const currentEnergy = this.resources.get('energy') || 0;

    if (currentEnergy < energyCost) {
      return { error: 'Insufficient energy', needed: energyCost, available: currentEnergy };
    }

    this.resources.set('energy', currentEnergy - energyCost);

    return {
      function: functionName,
      allocated: amount,
      energyCost,
      remainingEnergy: this.resources.get('energy'),
    };
  }

  /**
   * Replenish resources
   */
  replenishResources(resourceName, amount) {
    const current = this.resources.get(resourceName) || 0;
    this.resources.set(resourceName, current + amount);

    return {
      resource: resourceName,
      replenished: amount,
      newTotal: this.resources.get(resourceName),
    };
  }

  /**
   * Process organism signal
   */
  processOrganismSignal(signal) {
    // Receive the signal
    this.receiveSignal(signal);

    // Transform it using catalytic converter
    const processed = this.catalyst.catalyze(
      signal,
      'signal',
      (s) => ({
        ...s,
        processed: true,
        processedBy: this.name,
        timestamp: Date.now(),
        phiWeight: PHI_INV * (s.importance || 1),
      })
    );

    return processed;
  }

  /**
   * Get helper status
   */
  getHelperStatus() {
    return {
      ...this.getState(),
      organismType: this.organismType,
      supportFunctions: this.supportFunctions,
      homeostaticTargets: Array.from(this.homeostaticTargets.entries()).map(([name, t]) => ({
        name,
        ...t,
      })),
      resources: Array.from(this.resources.entries()).map(([name, value]) => ({
        name,
        value,
      })),
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FACTORY FUNCTIONS — Birth Internal AIs
// ══════════════════════════════════════════════════════════════════════════════

/**
 * Birth an Internal AI — IMMEDIATELY ALIVE
 */
function birthInternalAI(config) {
  return new InternalAI(config);
}

/**
 * Birth an Organism Helper — IMMEDIATELY ALIVE
 */
function birthOrganismHelper(config) {
  return new OrganismHelper(config);
}

/**
 * Birth a Catalytic Converter — IMMEDIATELY ACTIVE
 */
function birthCatalyst(name, config) {
  return new CatalyticConverter(name, config);
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export {
  InternalHeart,
  CatalyticConverter,
  InternalAI,
  OrganismHelper,
  birthInternalAI,
  birthOrganismHelper,
  birthCatalyst,
  PHI,
  PHI_INV,
  PHI_SQ,
  LOV,
  HEARTBEAT_MS,
  CALENDAR_INTERVALS,
  PYTHAGOREAN_RATIOS,
};

export default {
  InternalHeart,
  CatalyticConverter,
  InternalAI,
  OrganismHelper,
  birthInternalAI,
  birthOrganismHelper,
  birthCatalyst,
};
