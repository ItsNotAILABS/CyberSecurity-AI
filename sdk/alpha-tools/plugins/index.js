///
/// @medina/alpha-tools/plugins — Production Plugin System
///
/// Extensible capability modules that self-bootstrap into the
/// NOVA sovereign infrastructure. Each plugin is alive on creation.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

'use strict';

import { AlphaPlugin, registry } from '../src/index.js';

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;
const PHI2 = PHI * PHI;

// ═══════════════════════════════════════════════════════════════════
// GEOMETRIC LOCK PLUGIN — φ-resonance authentication
// ═══════════════════════════════════════════════════════════════════

export class GeometricLockPlugin extends AlphaPlugin {
  constructor(config = {}) {
    super({
      name: 'GEOMETRIC-LOCK-PLUGIN',
      provides: ['authentication', 'identity', 'access-control'],
      priority: PHI2,
      ...config,
    });

    this.emergenceThreshold = PHI_INV; // 0.618
    this.keyDimensions = 7;
    this.goldenAngle = (2 * Math.PI) / PHI2;
  }

  async process(input, context) {
    const { callerId, phases } = input;

    if (!callerId || !phases) {
      throw new Error('GeometricLock requires callerId and phases');
    }

    // Calculate Kuramoto order parameter
    const R = this._kuramotoR(phases);

    return {
      authenticated: R >= this.emergenceThreshold,
      orderParameter: R,
      threshold: this.emergenceThreshold,
      callerId,
      dimensions: this.keyDimensions,
    };
  }

  _kuramotoR(phases) {
    const N = phases.length;
    if (N === 0) return 0;

    let sumCos = 0, sumSin = 0;
    for (const theta of phases) {
      sumCos += Math.cos(theta);
      sumSin += Math.sin(theta);
    }

    return Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
  }
}

// ═══════════════════════════════════════════════════════════════════
// ORACLE PREDICTION PLUGIN — φ-weighted temporal foresight
// ═══════════════════════════════════════════════════════════════════

export class OraclePredictionPlugin extends AlphaPlugin {
  constructor(config = {}) {
    super({
      name: 'ORACLE-PREDICTION-PLUGIN',
      provides: ['prediction', 'foresight', 'temporal-analysis'],
      priority: PHI,
      ...config,
    });

    this.temporalWindows = [1, PHI, PHI2, PHI * PHI2, PHI2 * PHI2]; // 1h, φh, φ²h, φ³h, φ⁴h
    this.prophesyThreshold = PHI2; // >φ² confidence
    this.history = [];
  }

  async process(input, context) {
    const { signals, horizon } = input;

    if (!signals || !Array.isArray(signals)) {
      throw new Error('Oracle requires signals array');
    }

    // FORESIGHT: Pattern recognition
    const patterns = this._detectPatterns(signals);

    // ANTICIPATE: Probability field analysis
    const probabilities = this._analyzeProbabilityField(patterns);

    // PROPHESY: High-confidence predictions
    const prophecies = probabilities.filter(p => p.confidence > this.prophesyThreshold);

    const result = {
      patterns: patterns.length,
      probabilities,
      prophecies,
      horizon: horizon || this.temporalWindows[2],
      phi_windows: this.temporalWindows,
    };

    this.history.push({ input, result, timestamp: Date.now() });
    return result;
  }

  _detectPatterns(signals) {
    const patterns = [];
    for (let i = 1; i < signals.length; i++) {
      const ratio = signals[i] / (signals[i - 1] || 1);
      if (Math.abs(ratio - PHI) < 0.1 || Math.abs(ratio - PHI_INV) < 0.1) {
        patterns.push({ index: i, type: 'golden', ratio });
      }
    }
    return patterns;
  }

  _analyzeProbabilityField(patterns) {
    return patterns.map(p => ({
      ...p,
      confidence: Math.abs(p.ratio - PHI) < 0.05 ? PHI2 : PHI_INV,
      probability: 1 / (1 + Math.exp(-p.ratio * PHI)),
    }));
  }
}

// ═══════════════════════════════════════════════════════════════════
// SCRIBE LOGGING PLUGIN — Sovereign audit trail
// ═══════════════════════════════════════════════════════════════════

export class ScribePlugin extends AlphaPlugin {
  constructor(config = {}) {
    super({
      name: 'SCRIBE-LOGGING-PLUGIN',
      provides: ['logging', 'audit', 'trace'],
      priority: 1.0,
      ...config,
    });

    this.logs = [];
    this.maxLogs = config.maxLogs || 10000;
    this.logLevel = config.logLevel || 'info';
    this.levels = { error: 0, warn: 1, info: 2, debug: 3, trace: 4 };
  }

  async process(input, context) {
    const entry = {
      level: context.level || 'info',
      message: typeof input === 'string' ? input : JSON.stringify(input),
      source: context.source || 'unknown',
      timestamp: Date.now(),
      phi_beat: Math.floor((Date.now() - this.birthTime) / (540 * PHI)),
    };

    if (this.levels[entry.level] <= this.levels[this.logLevel]) {
      this._record(entry);
    }

    return entry;
  }

  _record(entry) {
    if (this.logs.length >= this.maxLogs) {
      this.logs.shift();
    }
    this.logs.push(entry);
  }

  query(filter = {}) {
    let results = [...this.logs];

    if (filter.level) {
      results = results.filter(l => l.level === filter.level);
    }
    if (filter.source) {
      results = results.filter(l => l.source === filter.source);
    }
    if (filter.since) {
      results = results.filter(l => l.timestamp >= filter.since);
    }
    if (filter.limit) {
      results = results.slice(-filter.limit);
    }

    return results;
  }
}

// ═══════════════════════════════════════════════════════════════════
// GUARDIAN SECURITY PLUGIN — Sovereign protection
// ═══════════════════════════════════════════════════════════════════

export class GuardianPlugin extends AlphaPlugin {
  constructor(config = {}) {
    super({
      name: 'GUARDIAN-SECURITY-PLUGIN',
      provides: ['security', 'protection', 'enforcement'],
      priority: PHI * PHI * PHI, // Highest priority
      ...config,
    });

    this.rules = new Map();
    this.violations = [];
    this.allowList = new Set(config.allowList || []);
    this.denyList = new Set(config.denyList || []);
  }

  registerRule(name, ruleFn, severity = 'medium') {
    this.rules.set(name, { check: ruleFn, severity });
    return this;
  }

  async process(input, context) {
    const results = [];
    let blocked = false;

    // Check deny list
    if (context.source && this.denyList.has(context.source)) {
      blocked = true;
      results.push({ rule: 'deny-list', blocked: true, severity: 'critical' });
    }

    // Check allow list bypass
    if (context.source && this.allowList.has(context.source)) {
      return { allowed: true, bypass: 'allow-list' };
    }

    // Run all security rules
    for (const [name, rule] of this.rules) {
      try {
        const passed = await rule.check(input, context);
        if (!passed) {
          blocked = true;
          results.push({ rule: name, blocked: true, severity: rule.severity });
          this.violations.push({
            rule: name,
            severity: rule.severity,
            input: typeof input === 'string' ? input.slice(0, 100) : '[object]',
            timestamp: Date.now(),
          });
        }
      } catch (e) {
        results.push({ rule: name, error: e.message });
      }
    }

    return {
      allowed: !blocked,
      checks: results,
      totalRules: this.rules.size,
      violations: this.violations.length,
    };
  }

  getViolations(limit = 50) {
    return this.violations.slice(-limit);
  }
}

// ═══════════════════════════════════════════════════════════════════
// ENTANGLEMENT PLUGIN — Cross-system quantum-inspired sync
// ═══════════════════════════════════════════════════════════════════

export class EntanglementPlugin extends AlphaPlugin {
  constructor(config = {}) {
    super({
      name: 'ENTANGLEMENT-PLUGIN',
      provides: ['sync', 'entanglement', 'coherence'],
      priority: PHI2,
      ...config,
    });

    this.entanglements = new Map();
    this.coherenceThreshold = PHI_INV;
  }

  entangle(systemA, systemB) {
    const pair = `${systemA}<->${systemB}`;
    this.entanglements.set(pair, {
      systems: [systemA, systemB],
      phase: 0,
      coherence: 1.0,
      created: Date.now(),
    });
    return { entangled: true, pair };
  }

  async process(input, context) {
    const { source, target, state } = input;

    if (!source || !target) {
      throw new Error('Entanglement requires source and target');
    }

    const pair = `${source}<->${target}`;
    const entanglement = this.entanglements.get(pair);

    if (!entanglement) {
      // Auto-entangle on first sync
      this.entangle(source, target);
    }

    // Propagate state with φ-decay
    return {
      source,
      target,
      state,
      coherence: entanglement ? entanglement.coherence : 1.0,
      propagated: true,
      phiDecay: PHI_INV,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// PRE-BUILT PRODUCTION PLUGINS
// ═══════════════════════════════════════════════════════════════════

export const geometricLock = new GeometricLockPlugin();
export const oraclePrediction = new OraclePredictionPlugin();
export const scribe = new ScribePlugin();
export const guardian = new GuardianPlugin();
export const entanglement = new EntanglementPlugin();

// Register all in global registry
registry.registerTool(geometricLock);
registry.registerTool(oraclePrediction);
registry.registerTool(scribe);
registry.registerTool(guardian);
registry.registerTool(entanglement);

export default {
  GeometricLockPlugin,
  OraclePredictionPlugin,
  ScribePlugin,
  GuardianPlugin,
  EntanglementPlugin,
  geometricLock,
  oraclePrediction,
  scribe,
  guardian,
  entanglement,
};
