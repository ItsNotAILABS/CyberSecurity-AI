///
/// @medina/replication-protocol — Self-Replication & Organism Spawning
/// RPC-2026: Replication Protocol Charter
/// Self-replicating AI organisms with genome transfer
///

import { PHI, LivingAI } from '@medina/medina-heart';

export class Genome {
  constructor({ genes = [], metadata = {} } = {}) {
    this.genes = genes;
    this.metadata = {
      created: Date.now(),
      generation: 0,
      lineage: [],
      ...metadata,
    };
    this.hash = this._computeHash();
  }

  _computeHash() {
    const data = JSON.stringify(this.genes);
    return `φ_${Math.floor(data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * PHI)}`;
  }

  clone() {
    return new Genome({
      genes: JSON.parse(JSON.stringify(this.genes)),
      metadata: {
        ...this.metadata,
        generation: this.metadata.generation + 1,
      },
    });
  }

  mutate(rate = 0.01) {
    const mutated = this.clone();
    for (let i = 0; i < mutated.genes.length; i++) {
      if (Math.random() < rate) {
        mutated.genes[i] = Math.random();
      }
    }
    mutated.hash = mutated._computeHash();
    return mutated;
  }

  toJSON() {
    return {
      genes: this.genes,
      metadata: this.metadata,
      hash: this.hash,
    };
  }

  static fromJSON(data) {
    return new Genome({
      genes: data.genes,
      metadata: data.metadata,
    });
  }
}

export class StateSnapshot {
  constructor({ organismId, state = {}, selective = true } = {}) {
    this.organismId = organismId;
    this.timestamp = Date.now();
    this.state = this._prepareState(state, selective);
    this.checksum = this._computeChecksum();
  }

  _prepareState(state, selective) {
    if (!selective) {
      return JSON.parse(JSON.stringify(state));
    }

    // Selective state transfer: only critical state
    return {
      memory: state.memory?.slice(-100) || [], // Last 100 memories
      energy: state.energy || 1.0,
      status: state.status || 'alive',
      connections: state.connections || [],
    };
  }

  _computeChecksum() {
    const data = JSON.stringify(this.state);
    return Math.floor(data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * PHI);
  }

  verify() {
    return this.checksum === this._computeChecksum();
  }

  toJSON() {
    return {
      organismId: this.organismId,
      timestamp: this.timestamp,
      state: this.state,
      checksum: this.checksum,
    };
  }

  static fromJSON(data) {
    const snapshot = new StateSnapshot({
      organismId: data.organismId,
      state: data.state,
    });
    snapshot.timestamp = data.timestamp;
    snapshot.checksum = data.checksum;
    return snapshot;
  }
}

export class OrganismIdentity {
  constructor({ parentId = null, generation = 0 } = {}) {
    this.timestamp = Date.now();
    this.parentId = parentId;
    this.generation = generation;
    this.id = this._generateId();
  }

  _generateId() {
    const phiHash = Math.floor((this.timestamp + this.generation) * PHI);
    const parentPart = this.parentId ? this.parentId.slice(-8) : '00000000';
    return `org_${this.timestamp}_${parentPart}_${phiHash}`;
  }

  getLineage() {
    const lineage = [this.id];
    if (this.parentId) {
      lineage.unshift(this.parentId);
    }
    return lineage;
  }
}

export class MemoryInheritance {
  constructor({ memories = [], inheritanceRate = 0.5 } = {}) {
    this.memories = memories;
    this.inheritanceRate = inheritanceRate;
  }

  inherit() {
    // Inherit most significant memories based on φ-weighting
    const sorted = [...this.memories].sort((a, b) => {
      const scoreA = (a.significance || 0.5) * PHI;
      const scoreB = (b.significance || 0.5) * PHI;
      return scoreB - scoreA;
    });

    const count = Math.ceil(sorted.length * this.inheritanceRate);
    return sorted.slice(0, count);
  }

  merge(otherMemories) {
    // Merge two memory sets, keeping unique and most significant
    const combined = [...this.memories, ...otherMemories];
    const unique = new Map();

    for (const memory of combined) {
      const key = JSON.stringify(memory.content || memory);
      if (!unique.has(key) || unique.get(key).significance < memory.significance) {
        unique.set(key, memory);
      }
    }

    return Array.from(unique.values());
  }
}

export class ReplicationEngine {
  constructor({ organismId } = {}) {
    this.organismId = organismId;
    this.genome = null;
    this.children = new Set();
    this.generation = 0;
    this.maxDepth = Infinity; // Unlimited replication depth
  }

  setGenome(genome) {
    this.genome = genome;
  }

  extractGenome(organism) {
    // Extract genome from living organism
    const genes = [];

    // Convert organism traits to genes
    if (organism.archetype) genes.push({ trait: 'archetype', value: organism.archetype });
    if (organism.energy) genes.push({ trait: 'energy', value: organism.energy });
    if (organism.status) genes.push({ trait: 'status', value: organism.status });

    return new Genome({
      genes,
      metadata: {
        sourceOrganism: organism.id,
        generation: this.generation,
        lineage: [this.organismId],
      },
    });
  }

  createSnapshot(state, selective = true) {
    return new StateSnapshot({
      organismId: this.organismId,
      state,
      selective,
    });
  }

  replicate({ state = {}, memories = [], selective = true, mutationRate = 0 } = {}) {
    if (!this.genome) {
      throw new Error('No genome set. Call setGenome() first.');
    }

    // Generate new identity
    const identity = new OrganismIdentity({
      parentId: this.organismId,
      generation: this.generation + 1,
    });

    // Clone and optionally mutate genome
    let childGenome = this.genome.clone();
    if (mutationRate > 0) {
      childGenome = childGenome.mutate(mutationRate);
    }

    // Inherit memories
    const inheritance = new MemoryInheritance({ memories, inheritanceRate: 0.5 });
    const inheritedMemories = inheritance.inherit();

    // Create state snapshot
    const snapshot = this.createSnapshot(state, selective);

    // Track child
    this.children.add(identity.id);

    return {
      id: identity.id,
      parentId: this.organismId,
      generation: identity.generation,
      genome: childGenome,
      state: snapshot.state,
      memories: inheritedMemories,
      lineage: identity.getLineage(),
      fidelity: mutationRate === 0 ? 1.0 : 1.0 - mutationRate,
    };
  }

  spawn(config = {}) {
    const replication = this.replicate(config);

    // Create new LivingAI organism from replication data
    const child = new LivingAI({
      id: replication.id,
      archetype: replication.genome.genes.find(g => g.trait === 'archetype')?.value || 'ORCHESTRATOR',
    });

    // Transfer state
    child.energy = replication.state.energy || 1.0;
    child.status = replication.state.status || 'alive';

    // Transfer memories
    if (child.memory && replication.memories.length > 0) {
      for (const mem of replication.memories) {
        child.memory.store(mem.content || mem, mem.significance || 0.5);
      }
    }

    return child;
  }

  getLineage() {
    return {
      organismId: this.organismId,
      generation: this.generation,
      children: Array.from(this.children),
      totalDescendants: this.children.size,
    };
  }

  getReplicationStats() {
    return {
      organismId: this.organismId,
      generation: this.generation,
      hasGenome: this.genome !== null,
      children: this.children.size,
      maxDepth: this.maxDepth,
    };
  }
}

export default { Genome, StateSnapshot, OrganismIdentity, MemoryInheritance, ReplicationEngine };
