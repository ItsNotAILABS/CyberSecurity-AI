///
/// @medina/healing-protocol — Self-Repair and Error Recovery
/// HPC-2026: Healing Protocol Charter
/// Self-diagnosis, repair strategies, and recovery verification
///

import { PHI, HEARTBEAT_MS } from '@medina/medina-heart';

export class HealthMetrics {
  constructor() {
    this.cpu = 1.0;
    this.memory = 1.0;
    this.energy = 1.0;
    this.connections = 1.0;
    this.errorRate = 0.0;
    this.lastCheck = Date.now();
  }

  update(metrics) {
    Object.assign(this, metrics);
    this.lastCheck = Date.now();
  }

  getOverallHealth() {
    return (this.cpu + this.memory + this.energy + this.connections) / 4 * (1 - this.errorRate);
  }

  isHealthy(threshold = 0.7) {
    return this.getOverallHealth() >= threshold;
  }
}

export class ErrorDetector {
  constructor({ threshold = 3, window = 30000 } = {}) {
    this.threshold = threshold;
    this.window = window;
    this.errors = [];
    this.consecutiveFailures = 0;
  }

  recordError(error) {
    this.errors.push({
      error,
      timestamp: Date.now(),
      type: error.type || 'unknown',
      severity: error.severity || 'medium',
    });

    this.consecutiveFailures++;
    this.cleanup();

    return this.detectPattern();
  }

  recordSuccess() {
    this.consecutiveFailures = 0;
  }

  detectPattern() {
    if (this.consecutiveFailures >= this.threshold) {
      return {
        critical: true,
        consecutiveFailures: this.consecutiveFailures,
        recentErrors: this.getRecentErrors(),
      };
    }

    const recent = this.getRecentErrors();
    if (recent.length >= this.threshold) {
      return {
        critical: true,
        recentErrors: recent,
      };
    }

    return { critical: false };
  }

  getRecentErrors() {
    const now = Date.now();
    return this.errors.filter(e => now - e.timestamp < this.window);
  }

  cleanup() {
    const now = Date.now();
    this.errors = this.errors.filter(e => now - e.timestamp < this.window * 2);
  }
}

export class RepairStrategy {
  constructor({ name, priority = 0.5, cost = 0.1 } = {}) {
    this.name = name;
    this.priority = priority;
    this.cost = cost;
    this.successRate = 0.8;
    this.attempts = 0;
    this.successes = 0;
  }

  async execute(target, error) {
    this.attempts++;

    // Simulate repair with φ-weighted success
    const success = Math.random() < this.successRate * PHI / 1.618;

    if (success) {
      this.successes++;
    }

    return {
      strategy: this.name,
      success,
      timestamp: Date.now(),
      cost: this.cost,
      error,
    };
  }

  getEffectiveness() {
    if (this.attempts === 0) return this.successRate;
    return this.successes / this.attempts;
  }
}

export class HealingEngine {
  constructor({ organismId } = {}) {
    this.organismId = organismId;
    this.health = new HealthMetrics();
    this.errorDetector = new ErrorDetector();
    this.strategies = this._initializeStrategies();
    this.lastKnownGoodState = null;
    this.repairHistory = [];
    this.healingInProgress = false;
    this.monitoringInterval = null;
  }

  _initializeStrategies() {
    return [
      new RepairStrategy({ name: 'restart', priority: 0.3, cost: 0.2 }),
      new RepairStrategy({ name: 'restore_state', priority: 0.7, cost: 0.1 }),
      new RepairStrategy({ name: 'reconnect', priority: 0.5, cost: 0.05 }),
      new RepairStrategy({ name: 'clear_cache', priority: 0.4, cost: 0.02 }),
      new RepairStrategy({ name: 'reduce_load', priority: 0.6, cost: 0.15 }),
    ];
  }

  // Health monitoring
  startMonitoring(checkInterval = HEARTBEAT_MS * 10) {
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, checkInterval);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  performHealthCheck() {
    // Simulate health metrics
    const metrics = {
      cpu: Math.random() * 0.3 + 0.7,
      memory: Math.random() * 0.3 + 0.7,
      energy: Math.random() * 0.2 + 0.8,
      connections: Math.random() * 0.4 + 0.6,
      errorRate: Math.random() * 0.1,
    };

    this.health.update(metrics);

    if (!this.health.isHealthy()) {
      this.diagnose();
    }

    return this.health;
  }

  // Error detection and diagnosis
  recordError(error) {
    const pattern = this.errorDetector.recordError(error);

    if (pattern.critical && !this.healingInProgress) {
      return this.heal(error);
    }

    return { critical: false };
  }

  diagnose() {
    const recentErrors = this.errorDetector.getRecentErrors();
    const health = this.health.getOverallHealth();

    return {
      overallHealth: health,
      critical: health < 0.5,
      recentErrors: recentErrors.length,
      diagnosis: this._determineDiagnosis(health, recentErrors),
    };
  }

  _determineDiagnosis(health, errors) {
    if (health < 0.3) return 'critical_failure';
    if (health < 0.5) return 'degraded_performance';
    if (errors.length > 5) return 'high_error_rate';
    return 'stable';
  }

  // Repair and recovery
  async heal(error) {
    if (this.healingInProgress) {
      return { success: false, reason: 'healing_in_progress' };
    }

    this.healingInProgress = true;
    const startTime = Date.now();

    // Try strategies in order of effectiveness
    const sortedStrategies = [...this.strategies].sort(
      (a, b) => b.getEffectiveness() * b.priority - a.getEffectiveness() * a.priority
    );

    let attempts = 0;
    let success = false;

    for (const strategy of sortedStrategies) {
      if (attempts >= 3) break;

      const result = await strategy.execute(this.organismId, error);
      attempts++;

      this.repairHistory.push(result);

      if (result.success) {
        success = true;
        break;
      }
    }

    const recoveryTime = Date.now() - startTime;

    if (success) {
      this.errorDetector.recordSuccess();
      this.saveGoodState();
    } else {
      // Escalate to restore from last known good state
      if (this.lastKnownGoodState) {
        await this.restoreState(this.lastKnownGoodState);
        success = true;
      }
    }

    this.healingInProgress = false;

    return {
      success,
      recoveryTime,
      attempts,
      timestamp: Date.now(),
    };
  }

  // State management
  saveGoodState(state = {}) {
    this.lastKnownGoodState = {
      state: JSON.parse(JSON.stringify(state)),
      health: { ...this.health },
      timestamp: Date.now(),
    };
  }

  async restoreState(savedState) {
    // Restore organism to last known good state
    return {
      restored: true,
      timestamp: savedState.timestamp,
      age: Date.now() - savedState.timestamp,
    };
  }

  // Recovery verification
  verifyRecovery() {
    const health = this.performHealthCheck();
    const recentErrors = this.errorDetector.getRecentErrors();

    const verified = health.getOverallHealth() > 0.7 && recentErrors.length === 0;

    return {
      verified,
      health: health.getOverallHealth(),
      recentErrors: recentErrors.length,
      consecutiveFailures: this.errorDetector.consecutiveFailures,
    };
  }

  getHealingStats() {
    const totalRepairs = this.repairHistory.length;
    const successful = this.repairHistory.filter(r => r.success).length;

    return {
      organismId: this.organismId,
      health: this.health.getOverallHealth(),
      totalRepairs,
      successfulRepairs: successful,
      successRate: totalRepairs > 0 ? successful / totalRepairs : 0,
      consecutiveFailures: this.errorDetector.consecutiveFailures,
      hasGoodState: this.lastKnownGoodState !== null,
      healingInProgress: this.healingInProgress,
    };
  }
}

export default { HealthMetrics, ErrorDetector, RepairStrategy, HealingEngine };
