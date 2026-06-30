///
/// @medina/collective-wisdom — Knowledge Synthesis Across Organisms
/// Collective intelligence and wisdom from many minds
///

import { PHI } from '@medina/medina-heart';

export class WisdomFragment {
  constructor({ content, source, confidence = 0.5 } = {}) {
    this.id = `wisdom_${Date.now()}`;
    this.content = content;
    this.source = source;
    this.confidence = confidence;
    this.endorsements = 0;
    this.challenges = 0;
    this.timestamp = Date.now();
  }

  endorse() {
    this.endorsements++;
    this.confidence = Math.min(1.0, this.confidence + 0.05);
  }

  challenge() {
    this.challenges++;
    this.confidence = Math.max(0.0, this.confidence - 0.05);
  }

  getCredibility() {
    return (this.endorsements - this.challenges) * this.confidence;
  }
}

export class CollectiveWisdom {
  constructor() {
    this.fragments = new Map();
    this.contributors = new Set();
    this.synthesizedKnowledge = [];
  }

  contribute(organismId, content, confidence = 0.5) {
    const fragment = new WisdomFragment({ content, source: organismId, confidence });
    this.fragments.set(fragment.id, fragment);
    this.contributors.add(organismId);
    return fragment;
  }

  synthesize(threshold = 0.7) {
    const credible = Array.from(this.fragments.values())
      .filter(f => f.getCredibility() >= threshold)
      .sort((a, b) => b.getCredibility() - a.getCredibility());

    this.synthesizedKnowledge = credible.slice(0, 10);
    return this.synthesizedKnowledge;
  }

  getConsensus(topic) {
    const relevant = Array.from(this.fragments.values())
      .filter(f => JSON.stringify(f.content).includes(topic));

    if (relevant.length === 0) return null;

    const avgConfidence = relevant.reduce((sum, f) => sum + f.confidence, 0) / relevant.length;
    return {
      topic,
      fragments: relevant.length,
      consensus: avgConfidence,
      wisdom: relevant[0],
    };
  }

  getStatus() {
    return {
      fragments: this.fragments.size,
      contributors: this.contributors.size,
      synthesized: this.synthesizedKnowledge.length,
    };
  }
}

export default { WisdomFragment, CollectiveWisdom };
