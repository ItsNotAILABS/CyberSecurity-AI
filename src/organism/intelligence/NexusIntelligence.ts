///
/// NEXUS INTELLIGENCE — The Substrate Walker
///
/// TypeScript organism intelligence for NEXUS.
/// Mirrors the Motoko canister (src/organisms/nexus/main.mo).
/// We float between substrates, we leave it everywhere.
///
/// Sub-model: PROPAGATOR
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface SubstrateNode {
  readonly id: number;
  readonly substrate: string;
  readonly weight: number;   // Golden-decay: φ^(−index)
  readonly timestamp: number;
}

export interface Route {
  readonly id: number;
  readonly from: number;   // Node ID
  readonly to: number;     // Node ID
  readonly cost: number;   // Golden weight difference
  readonly timestamp: number;
}

export interface Footprint {
  readonly id: number;
  readonly substrate: string;
  readonly proof: string;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  NEXUS INTELLIGENCE
// ══════════════════════════════════════════════════════════════════

export class NexusIntelligence {
  readonly name = 'NEXUS';
  readonly designation = 'The Substrate Walker — We float between them, we leave it everywhere';

  private nodes: SubstrateNode[] = [];
  private routes: Route[] = [];
  private footprints: Footprint[] = [];
  private nextNodeId = 0;
  private nextRouteId = 0;
  private nextFootprintId = 0;
  private generation = 0;

  // ── SUB-MODEL: PROPAGATOR ──────────────────────────────────────

  registerNode(substrate: string): SubstrateNode {
    const id = this.nextNodeId++;
    const weight = Math.pow(PHI, -id);

    const node: SubstrateNode = {
      id,
      substrate,
      weight,
      timestamp: Date.now(),
    };

    this.nodes.push(node);

    // Leave a footprint
    this.footprints.push({
      id: this.nextFootprintId++,
      substrate,
      proof: `Node #${id} registered on ${substrate} — permanent proof of architectural presence`,
      timestamp: Date.now(),
    });

    // Advance generation at Fibonacci thresholds
    if (this.isFibonacci(this.nodes.length)) {
      this.generation++;
    }

    return node;
  }

  createRoute(fromId: number, toId: number): Route | null {
    const fromNode = this.nodes.find(n => n.id === fromId);
    const toNode = this.nodes.find(n => n.id === toId);
    if (!fromNode || !toNode) return null;

    const cost = Math.abs(fromNode.weight - toNode.weight);

    const route: Route = {
      id: this.nextRouteId++,
      from: fromId,
      to: toId,
      cost,
      timestamp: Date.now(),
    };

    this.routes.push(route);
    return route;
  }

  getFootprints(): Footprint[] {
    return [...this.footprints];
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      total_nodes: this.nodes.length,
      total_routes: this.routes.length,
      total_footprints: this.footprints.length,
      generation: this.generation,
      sub_models: ['PROPAGATOR'],
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
