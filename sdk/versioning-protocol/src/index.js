///
/// @medina/versioning-protocol — Fibonacci Version Evolution
/// VPC-2026: Versioning Protocol Charter
/// φ-based version management, compatibility, and upgrades
///

import { PHI, FIBONACCI } from '@medina/medina-heart';

export class FibonacciVersion {
  constructor(major = 0, minor = 1, patch = 618) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }

  toString() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }

  toNumber() {
    return this.major * 1000 + this.minor * 100 + this.patch;
  }

  compare(other) {
    if (this.major !== other.major) return this.major - other.major;
    if (this.minor !== other.minor) return this.minor - other.minor;
    return this.patch - other.patch;
  }

  isCompatibleWith(other) {
    // Backward compatible within same major version
    return this.major === other.major && this.compare(other) >= 0;
  }

  static parse(versionString) {
    const parts = versionString.split('.').map(Number);
    return new FibonacciVersion(parts[0] || 0, parts[1] || 1, parts[2] || 618);
  }

  static fromStage(stage) {
    if (stage === 0) return new FibonacciVersion(0, 1, 618);
    if (stage === 1) return new FibonacciVersion(1, 0, 0);

    const major = FIBONACCI[stage] || stage;
    const minor = FIBONACCI[stage - 1] || 0;
    return new FibonacciVersion(major, minor, 618);
  }

  advance(type = 'minor') {
    if (type === 'major') {
      // Find next Fibonacci number
      const currentIndex = FIBONACCI.indexOf(this.major);
      const nextMajor = FIBONACCI[currentIndex + 1] || this.major + 1;
      return new FibonacciVersion(nextMajor, 0, 618);
    } else if (type === 'minor') {
      const currentIndex = FIBONACCI.indexOf(this.minor);
      const nextMinor = FIBONACCI[currentIndex + 1] || this.minor + 1;
      return new FibonacciVersion(this.major, nextMinor, 618);
    }

    return this;
  }
}

export class CompatibilityMatrix {
  constructor() {
    this.compatibilities = new Map();
  }

  registerCompatibility(version1, version2, compatible = true) {
    const key = `${version1.toString()}:${version2.toString()}`;
    this.compatibilities.set(key, compatible);
  }

  isCompatible(version1, version2) {
    const key = `${version1.toString()}:${version2.toString()}`;

    if (this.compatibilities.has(key)) {
      return this.compatibilities.get(key);
    }

    // Default: backward compatible within major version
    return version1.isCompatibleWith(version2);
  }

  getCompatibleVersions(version) {
    const compatible = [];

    for (const [key, value] of this.compatibilities.entries()) {
      if (value && key.startsWith(version.toString())) {
        const other = FibonacciVersion.parse(key.split(':')[1]);
        compatible.push(other);
      }
    }

    return compatible;
  }
}

export class UpgradeProcedure {
  constructor({ from, to, steps = [] } = {}) {
    this.from = from;
    this.to = to;
    this.steps = steps;
    this.executed = false;
  }

  addStep(description, executor) {
    this.steps.push({ description, executor, completed: false });
  }

  async execute() {
    if (this.executed) {
      throw new Error('Upgrade already executed');
    }

    const results = [];

    for (const step of this.steps) {
      try {
        const result = await step.executor();
        step.completed = true;
        results.push({ step: step.description, success: true, result });
      } catch (error) {
        results.push({ step: step.description, success: false, error: error.message });
        return { success: false, completedSteps: results };
      }
    }

    this.executed = true;
    return { success: true, completedSteps: results };
  }
}

export class RollbackManager {
  constructor() {
    this.checkpoints = [];
  }

  createCheckpoint(version, state) {
    const checkpoint = {
      version: version.toString(),
      state: JSON.parse(JSON.stringify(state)),
      timestamp: Date.now(),
    };

    this.checkpoints.push(checkpoint);

    // Keep last 10 checkpoints
    if (this.checkpoints.length > 10) {
      this.checkpoints.shift();
    }

    return checkpoint;
  }

  rollbackTo(version) {
    const checkpoint = this.checkpoints.find(c => c.version === version.toString());

    if (!checkpoint) {
      return { success: false, reason: 'checkpoint_not_found' };
    }

    return {
      success: true,
      checkpoint,
      restoredState: checkpoint.state,
    };
  }

  rollbackToPrevious() {
    if (this.checkpoints.length < 2) {
      return { success: false, reason: 'no_previous_checkpoint' };
    }

    const previous = this.checkpoints[this.checkpoints.length - 2];

    return {
      success: true,
      checkpoint: previous,
      restoredState: previous.state,
    };
  }

  getCheckpoints() {
    return [...this.checkpoints];
  }
}

export class VersioningEngine {
  constructor({ organismId, currentVersion = '0.1.618' } = {}) {
    this.organismId = organismId;
    this.currentVersion = FibonacciVersion.parse(currentVersion);
    this.compatibilityMatrix = new CompatibilityMatrix();
    this.rollbackManager = new RollbackManager();
    this.upgradeHistory = [];
    this.autoUpgrade = false;
  }

  // Version generation
  generateNextVersion(type = 'minor') {
    return this.currentVersion.advance(type);
  }

  // Compatibility checking
  checkCompatibility(otherVersion) {
    if (typeof otherVersion === 'string') {
      otherVersion = FibonacciVersion.parse(otherVersion);
    }

    return this.compatibilityMatrix.isCompatible(this.currentVersion, otherVersion);
  }

  registerCompatibility(version1, version2, compatible = true) {
    this.compatibilityMatrix.registerCompatibility(version1, version2, compatible);
  }

  // Upgrade procedures
  prepareUpgrade(targetVersion, steps = []) {
    if (typeof targetVersion === 'string') {
      targetVersion = FibonacciVersion.parse(targetVersion);
    }

    const procedure = new UpgradeProcedure({
      from: this.currentVersion,
      to: targetVersion,
      steps,
    });

    return procedure;
  }

  async performUpgrade(targetVersion, state = {}) {
    // Create checkpoint before upgrade
    this.rollbackManager.createCheckpoint(this.currentVersion, state);

    const procedure = this.prepareUpgrade(targetVersion, [
      {
        description: 'Verify compatibility',
        executor: async () => {
          const compatible = this.checkCompatibility(targetVersion);
          if (!compatible) throw new Error('Incompatible version');
          return { compatible: true };
        },
      },
      {
        description: 'Apply φ-transformation',
        executor: async () => {
          // φ-based version transformation
          return { transformed: true, factor: PHI };
        },
      },
      {
        description: 'Update version',
        executor: async () => {
          this.currentVersion = targetVersion;
          return { version: this.currentVersion.toString() };
        },
      },
    ]);

    const result = await procedure.execute();

    this.upgradeHistory.push({
      from: procedure.from.toString(),
      to: procedure.to.toString(),
      timestamp: Date.now(),
      success: result.success,
    });

    return result;
  }

  // Rollback mechanisms
  rollback(targetVersion = null) {
    const result = targetVersion
      ? this.rollbackManager.rollbackTo(targetVersion)
      : this.rollbackManager.rollbackToPrevious();

    if (result.success) {
      this.currentVersion = FibonacciVersion.parse(result.checkpoint.version);
    }

    return result;
  }

  // Version negotiation
  negotiate(peerVersion) {
    if (typeof peerVersion === 'string') {
      peerVersion = FibonacciVersion.parse(peerVersion);
    }

    // Use lower version for compatibility
    const comparison = this.currentVersion.compare(peerVersion);

    if (comparison === 0) {
      return { version: this.currentVersion, compatibility: 'exact' };
    } else if (comparison > 0) {
      // We're ahead, check if peer version is compatible
      if (this.currentVersion.isCompatibleWith(peerVersion)) {
        return { version: peerVersion, compatibility: 'backward' };
      }
    } else {
      // We're behind, check if our version is compatible
      if (peerVersion.isCompatibleWith(this.currentVersion)) {
        return { version: this.currentVersion, compatibility: 'forward' };
      }
    }

    return { version: null, compatibility: 'incompatible' };
  }

  getCurrentVersion() {
    return this.currentVersion.toString();
  }

  getVersionInfo() {
    return {
      organismId: this.organismId,
      currentVersion: this.currentVersion.toString(),
      stage: this._findStage(),
      upgrades: this.upgradeHistory.length,
      checkpoints: this.rollbackManager.checkpoints.length,
      autoUpgrade: this.autoUpgrade,
    };
  }

  _findStage() {
    const majorIndex = FIBONACCI.indexOf(this.currentVersion.major);
    return majorIndex >= 0 ? majorIndex : 'custom';
  }
}

export default { FibonacciVersion, CompatibilityMatrix, UpgradeProcedure, RollbackManager, VersioningEngine };
