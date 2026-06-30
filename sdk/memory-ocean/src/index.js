///
/// @medina/memory-ocean — Distributed Memory Ocean
///
/// Shared memory pool across all organisms with tidal patterns.
/// Memory flows like water between organisms based on relevance.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from '@medina/medina-heart';
import { AlphaQuery } from '@medina/alpha-sdk';

// Memory Droplet (unit of memory)
export class MemoryDroplet {
  constructor({ content, importance = 0.5, type = 'semantic' } = {}) {
    this.id = `droplet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.content = content;
    this.importance = importance;
    this.type = type; // semantic, episodic, procedural
    this.created = Date.now();
    this.accessed = Date.now();
    this.accessCount = 0;
    this.organisms = new Set(); // Which organisms have this memory

    console.log(`💧 MemoryDroplet created: ${type}`);
  }

  access(organismId) {
    this.accessed = Date.now();
    this.accessCount++;
    this.organisms.add(organismId);

    // Importance increases with access (memory consolidation)
    this.importance = Math.min(1.0, this.importance + 0.01);
  }

  // Memory decays over time (forgetting curve)
  decay() {
    const age = Date.now() - this.accessed;
    const hoursSinceAccess = age / (1000 * 60 * 60);

    // Exponential decay based on Ebbinghaus forgetting curve
    const decayRate = 0.1;
    this.importance *= Math.exp(-decayRate * hoursSinceAccess);

    return this.importance;
  }
}

// Memory Wave (collection moving together)
export class MemoryWave {
  constructor({ theme, droplets = [] } = {}) {
    this.id = `wave_${Date.now()}`;
    this.theme = theme;
    this.droplets = droplets;
    this.amplitude = droplets.length * PHI;
    this.frequency = PHI;
    this.phase = 0;

    console.log(`🌊 MemoryWave created: ${theme} (${droplets.length} droplets)`);
  }

  // Add droplet to wave
  addDroplet(droplet) {
    this.droplets.push(droplet);
    this.amplitude = this.droplets.length * PHI;
  }

  // Wave propagates to organisms
  propagate(targetOrganisms) {
    const propagated = [];

    for (const organismId of targetOrganisms) {
      for (const droplet of this.droplets) {
        droplet.access(organismId);
        propagated.push({ droplet: droplet.id, organism: organismId });
      }
    }

    this.phase += Math.PI / 4;
    return propagated;
  }

  // Get wave energy (total importance)
  getEnergy() {
    return this.droplets.reduce((sum, d) => sum + d.importance, 0);
  }
}

// Memory Tide (periodic pattern)
export class MemoryTide {
  constructor({ period = 3600000 } = {}) { // 1 hour default
    this.period = period;
    this.highTide = [];
    this.lowTide = [];
    this.currentPhase = 0;

    console.log(`🌕 MemoryTide created (period: ${period}ms)`);
  }

  // Add memory to tide
  add(droplet) {
    const phase = (Date.now() % this.period) / this.period;

    if (phase > 0.5) {
      this.highTide.push(droplet);
    } else {
      this.lowTide.push(droplet);
    }
  }

  // Get active memories based on current tide
  getActive() {
    const phase = (Date.now() % this.period) / this.period;
    this.currentPhase = phase;

    // Interpolate between high and low tide
    if (phase > 0.5) {
      return this.highTide;
    } else {
      return this.lowTide;
    }
  }

  getPhase() {
    return (Date.now() % this.period) / this.period;
  }
}

// Memory Ocean (main distributed memory system)
export class MemoryOcean {
  constructor({ name = 'MEMORY_OCEAN' } = {}) {
    this.name = name;

    this.droplets = new Map(); // dropletId -> MemoryDroplet
    this.waves = new Map(); // waveId -> MemoryWave
    this.tides = new Map(); // period -> MemoryTide
    this.organisms = new Map(); // organismId -> Set of droplet IDs

    this.stats = {
      totalDroplets: 0,
      totalWaves: 0,
      totalOrganisms: 0,
      oceanDepth: 0, // Average importance
    };

    console.log(`🌊🌊🌊 MemoryOcean "${name}" created`);
  }

  // Add memory droplet
  addDroplet(content, importance, type, organismId) {
    const droplet = new MemoryDroplet({ content, importance, type });
    this.droplets.set(droplet.id, droplet);

    if (organismId) {
      droplet.access(organismId);

      if (!this.organisms.has(organismId)) {
        this.organisms.set(organismId, new Set());
        this.stats.totalOrganisms++;
      }

      this.organisms.get(organismId).add(droplet.id);
    }

    this.stats.totalDroplets++;
    this._recalculateDepth();

    return droplet;
  }

  // Create memory wave
  createWave(theme, dropletIds) {
    const droplets = dropletIds
      .map(id => this.droplets.get(id))
      .filter(d => d !== undefined);

    const wave = new MemoryWave({ theme, droplets });
    this.waves.set(wave.id, wave);
    this.stats.totalWaves++;

    return wave;
  }

  // Query memories (distributed recall)
  query(query, organismId) {
    const results = [];

    for (const [id, droplet] of this.droplets) {
      // Simple relevance scoring (can be enhanced)
      const relevance = this._calculateRelevance(query, droplet);

      if (relevance > 0.3) {
        results.push({
          droplet: droplet,
          relevance,
        });

        // Access updates importance
        droplet.access(organismId);
      }
    }

    // Sort by relevance and importance
    results.sort((a, b) => {
      const scoreA = a.relevance * a.droplet.importance;
      const scoreB = b.relevance * b.droplet.importance;
      return scoreB - scoreA;
    });

    return results.slice(0, 10); // Top 10
  }

  _calculateRelevance(query, droplet) {
    // Simple string matching (can use embeddings in production)
    const queryLower = query.toLowerCase();
    const contentLower = JSON.stringify(droplet.content).toLowerCase();

    if (contentLower.includes(queryLower)) {
      return 1.0;
    }

    // Check word overlap
    const queryWords = queryLower.split(/\s+/);
    const contentWords = contentLower.split(/\s+/);
    const overlap = queryWords.filter(w => contentWords.includes(w)).length;

    return overlap / queryWords.length;
  }

  // Run tidal cleanup (forget old memories)
  tidally Cleanup() {
    let forgotten = 0;

    for (const [id, droplet] of this.droplets) {
      droplet.decay();

      // Remove if importance too low
      if (droplet.importance < 0.01) {
        this.droplets.delete(id);
        forgotten++;
      }
    }

    this.stats.totalDroplets -= forgotten;
    this._recalculateDepth();

    return { forgotten };
  }

  _recalculateDepth() {
    if (this.droplets.size === 0) {
      this.stats.oceanDepth = 0;
      return;
    }

    const totalImportance = Array.from(this.droplets.values())
      .reduce((sum, d) => sum + d.importance, 0);

    this.stats.oceanDepth = totalImportance / this.droplets.size;
  }

  getStatus() {
    return {
      name: this.name,
      stats: this.stats,
      droplets: this.droplets.size,
      waves: this.waves.size,
      organisms: this.organisms.size,
    };
  }
}

export default { MemoryDroplet, MemoryWave, MemoryTide, MemoryOcean };
