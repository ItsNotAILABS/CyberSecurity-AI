///
/// @medina/emergence-patterns — Pattern Recognition Across AIs
/// Emergent behaviors and collective patterns
///

import { PHI } from '@medina/medina-heart';

export class Pattern {
  constructor({ signature, frequency = 0, significance = 0 } = {}) {
    this.id = `pattern_${Date.now()}`;
    this.signature = signature;
    this.frequency = frequency;
    this.significance = significance;
    this.observations = [];
  }

  observe(context) {
    this.observations.push({ context, timestamp: Date.now() });
    this.frequency++;
    this.significance = Math.min(1.0, this.significance + (0.1 * PHI));
  }
}

export class PatternDetector {
  constructor({ minFrequency = 3 } = {}) {
    this.patterns = new Map();
    this.minFrequency = minFrequency;
    this.observations = [];
  }

  observe(event) {
    this.observations.push(event);

    // Simple pattern detection: look for repeating sequences
    const sig nature = JSON.stringify(event);
    if (!this.patterns.has(signature)) {
      this.patterns.set(signature, new Pattern({ signature }));
    }

    const pattern = this.patterns.get(signature);
    pattern.observe(event);

    return pattern.frequency >= this.minFrequency ? pattern : null;
  }

  getEmergentPatterns(minSignificance = 0.5) {
    return Array.from(this.patterns.values())
      .filter(p => p.significance >= minSignificance)
      .sort((a, b) => b.significance - a.significance);
  }
}

export class EmergenceTracker {
  constructor() {
    this.detectors = new Map();
    this.emergentBehaviors = [];
  }

  createDetector(organismId) {
    const detector = new PatternDetector();
    this.detectors.set(organismId, detector);
    return detector;
  }

  recordBehavior(organismId, behavior) {
    const detector = this.detectors.get(organismId);
    if (detector) {
      const pattern = detector.observe(behavior);
      if (pattern) {
        this.emergentBehaviors.push({ organismId, pattern, timestamp: Date.now() });
      }
    }
  }

  getCollectivePatterns() {
    const all = [];
    for (const detector of this.detectors.values()) {
      all.push(...detector.getEmergentPatterns());
    }
    return all.sort((a, b) => b.significance - a.significance).slice(0, 20);
  }
}

export default { Pattern, PatternDetector, EmergenceTracker };
