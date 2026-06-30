///
/// @medina/adaptive-learning — Cross-Organism Learning Protocols
/// Shared learning across all AIs with transfer learning
///

import { PHI } from '@medina/medina-heart';

export class LearningExperience {
  constructor({ input, output, success, context = {} } = {}) {
    this.id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.input = input;
    this.output = output;
    this.success = success;
    this.context = context;
    this.timestamp = Date.now();
    this.transferCount = 0;
  }

  transfer(targetOrganism) {
    this.transferCount++;
    return {
      ...this,
      transferredTo: targetOrganism,
      transferredAt: Date.now(),
    };
  }
}

export class KnowledgeGraph {
  constructor() {
    this.nodes = new Map(); // concept -> metadata
    this.edges = new Map(); // conceptA_conceptB -> weight
  }

  addConcept(concept, metadata = {}) {
    this.nodes.set(concept, { ...metadata, addedAt: Date.now() });
  }

  relateConcepts(concept1, concept2, weight = 0.5) {
    const edgeId = `${concept1}_${concept2}`;
    this.edges.set(edgeId, weight);
  }

  getRelated(concept, threshold = 0.3) {
    const related = [];
    for (const [edgeId, weight] of this.edges) {
      if (edgeId.startsWith(concept + '_') && weight >= threshold) {
        related.push({ concept: edgeId.split('_')[1], weight });
      }
    }
    return related.sort((a, b) => b.weight - a.weight);
  }
}

export class AdaptiveLearningSystem {
  constructor() {
    this.experiences = [];
    this.knowledgeGraph = new KnowledgeGraph();
    this.organisms = new Map();
  }

  recordExperience(organismId, experience) {
    this.experiences.push({ ...experience, organismId });

    if (!this.organisms.has(organismId)) {
      this.organisms.set(organismId, { experiences: 0, successRate: 0 });
    }

    const org = this.organisms.get(organismId);
    org.experiences++;
    org.successRate = ((org.successRate * (org.experiences - 1)) + (experience.success ? 1 : 0)) / org.experiences;
  }

  transferKnowledge(fromOrganism, toOrganism, filter = () => true) {
    const relevantExps = this.experiences
      .filter(e => e.organismId === fromOrganism && e.success && filter(e));

    const transferred = relevantExps.map(exp =>
      new LearningExperience(exp).transfer(toOrganism)
    );

    return { transferred: transferred.length, experiences: transferred };
  }

  getCollectiveLearning() {
    const successRate = this.experiences.filter(e => e.success).length / this.experiences.length;
    return {
      totalExperiences: this.experiences.length,
      successRate,
      organisms: this.organisms.size,
      knowledgeNodes: this.knowledgeGraph.nodes.size,
    };
  }
}

export default { LearningExperience, KnowledgeGraph, AdaptiveLearningSystem };
