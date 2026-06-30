///
/// @medina/meta-cognition — AIs Thinking About Thinking
/// Meta-cognitive processes and self-reflection
///

import { LivingAI, ARCHETYPES } from '@medina/medina-heart';

export class MetaThought {
  constructor({ subject, reflection, depth = 1 } = {}) {
    this.id = `meta_${Date.now()}`;
    this.subject = subject;
    this.reflection = reflection;
    this.depth = depth; // Level of meta-thinking (thinking about thinking about...)
    this.timestamp = Date.now();
  }

  reflect() {
    return new MetaThought({
      subject: this,
      reflection: `Thinking about: ${this.reflection}`,
      depth: this.depth + 1,
    });
  }
}

export class SelfReflectionEngine {
  constructor({ organismId } = {}) {
    this.organismId = organismId;
    this.thoughts = [];
    this.metaThoughts = [];
    this.selfModel = {
      strengths: [],
      weaknesses: [],
      biases: [],
      patterns: [],
    };
  }

  think(thought) {
    this.thoughts.push({ content: thought, timestamp: Date.now() });
  }

  reflect(subject) {
    const metaThought = new MetaThought({ subject, reflection: `Analyzing: ${subject}` });
    this.metaThoughts.push(metaThought);
    return metaThought;
  }

  analyzePerformance(experiences) {
    const successes = experiences.filter(e => e.success).length;
    const successRate = successes / experiences.length;

    if (successRate > 0.8) {
      this.selfModel.strengths.push('High success rate');
    } else if (successRate < 0.5) {
      this.selfModel.weaknesses.push('Low success rate');
    }

    return this.selfModel;
  }

  getSelfAwareness() {
    return {
      thoughts: this.thoughts.length,
      metaThoughts: this.metaThoughts.length,
      maxMetaDepth: Math.max(...this.metaThoughts.map(m => m.depth), 0),
      selfModel: this.selfModel,
    };
  }
}

export default { MetaThought, SelfReflectionEngine };
