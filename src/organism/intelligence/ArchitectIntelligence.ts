///
/// ARCHITECT INTELLIGENCE — The Meta-Builder
///
/// TypeScript organism intelligence for ARCHITECT.
/// Mirrors the Motoko canister (src/organisms/architect/main.mo).
/// Architecture creates more architecture.
///
/// Sub-model: REPLICATOR
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface OrganismBlueprint {
  readonly id: number;
  readonly name: string;
  readonly designation: string;
  readonly position: [number, number]; // Phyllotaxis position
  readonly scale: number;              // φ^generation
  readonly generation: number;
  readonly capabilities: string[];
  readonly substrate: string;
  readonly lineage: number[];
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  ARCHITECT INTELLIGENCE
// ══════════════════════════════════════════════════════════════════

export class ArchitectIntelligence {
  readonly name = 'ARCHITECT';
  readonly designation = 'The Meta-Builder — Architecture creates more architecture';

  private blueprints: OrganismBlueprint[] = [];
  private nextId = 0;
  private generation = 0;

  // ── SUB-MODEL: REPLICATOR ──────────────────────────────────────

  spawn(
    name: string,
    designation: string,
    capabilities: string[],
    substrate: string,
    parentId?: number,
  ): OrganismBlueprint {
    const id = this.nextId++;

    // Phyllotaxis position — golden-angle distribution
    const angle = id * GOLDEN_ANGLE;
    const radius = Math.sqrt(id + 1);
    const px = radius * Math.cos(angle);
    const py = radius * Math.sin(angle);

    const scale = Math.pow(PHI, this.generation);

    const lineage = parentId !== undefined ? [parentId, id] : [id];

    const blueprint: OrganismBlueprint = {
      id,
      name,
      designation,
      position: [px, py],
      scale,
      generation: this.generation,
      capabilities,
      substrate,
      lineage,
      timestamp: Date.now(),
    };

    this.blueprints.push(blueprint);

    // Advance generation at Fibonacci thresholds
    if (this.isFibonacci(this.blueprints.length)) {
      this.generation++;
    }

    return blueprint;
  }

  getBlueprints(): OrganismBlueprint[] {
    return [...this.blueprints];
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      total_blueprints: this.blueprints.length,
      generation: this.generation,
      sub_models: ['REPLICATOR'],
    };
  }

  // ── Helpers ────────────────────────────────────────────────────

  private isFibonacci(n: number): boolean {
    if (n === 0) return true;
    const n2 = n * n;
    const a = 5 * n2 + 4;
    const b = 5 * n2 - 4;
    const sqA = Math.round(Math.sqrt(a));
    const sqB = Math.round(Math.sqrt(b));
    return sqA * sqA === a || sqB * sqB === b;
  }
}
