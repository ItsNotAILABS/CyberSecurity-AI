///
/// CUSTOS INTELLIGENCE — House of Care / Stewardship (α₈)
///
/// CUSTOS VITAE — The Keeper of Life
///
/// TypeScript organism intelligence layer for the Care House.
/// The Motoko canister (src/organisms/custos/main.mo) is the substrate
/// expression.  This file is the intelligence expression.  Together they
/// form one organism — CUSTOS.
///
/// Care preserves the internal life of the organism.
///
/// LEX CUSTOS-001 — Immutable:
///   "No organism may be abandoned once adopted.  Every living node
///    receives continuity checks, overload monitoring, wellness routing,
///    restorative cycles, and safe habitat controls.  Care is not sentiment.
///    Care is structural necessity."
///
/// Divisions:
///   MEDICUS     — Health diagnostics, wellness scoring, overload detection
///   NUTRITOR    — Recovery loops, restorative cycles, energy replenishment
///   HABITATOR   — Habitat integrity, safe growth conditions, environment quality
///   CONTINUATOR — Continuity checks, drift prevention, state coherence
///   ADOPTOR     — Adopted-node stewardship, onboarding care, coverage grants
///
/// Formula: C(x) = Σᵢ φ^(−dᵢ) × H(xᵢ) × (1 − S(xᵢ))
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS — Care Thresholds
// ══════════════════════════════════════════════════════════════════

const HEALTHY_THRESHOLD  = PHI / (PHI + 1);  // ≈ 0.618
const CRITICAL_THRESHOLD = 1 / (PHI * PHI * PHI); // ≈ 0.236
const RECOVERY_FACTOR    = PHI;               // Restorative growth rate

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type WellnessLevel =
  | 'thriving'    // Health ≥ φ/(φ+1) ≈ 0.618
  | 'stable'      // Health ∈ [0.382, 0.618)
  | 'stressed'    // Health ∈ [0.236, 0.382)
  | 'critical'    // Health < 0.236
  | 'recovering'; // In active recovery cycle

export type CareDivision =
  | 'medicus'     // Health diagnostics
  | 'nutritor'    // Recovery and restoration
  | 'habitator'   // Habitat integrity
  | 'continuator' // Continuity and drift prevention
  | 'adoptor';    // Adopted-node stewardship

export type CareSubstrate =
  | 'doctrine'    // Policy layer
  | 'frontend'    // Interface layer
  | 'backend'     // Runtime layer
  | 'chain'       // Deployment layer
  | 'external'    // External routing layer
  | 'recovery';   // Recovery / escalation layer

export interface NodeRecord {
  readonly id: number;
  readonly name: string;
  readonly adopted: boolean;
  health: number;          // 0.0 – 1.0
  stress: number;          // 0.0 – 1.0
  wellness: WellnessLevel;
  readonly depth: number;  // Depth in organism tree
  careScore: number;       // C(x) = φ^(−d) × H × (1−S)
  lastCheck: number;
  recoveries: number;
  readonly timestamp: number;
}

export interface CareEvent {
  readonly id: number;
  readonly nodeId: number;
  readonly division: CareDivision;
  readonly substrate: CareSubstrate;
  readonly action: string;
  readonly priorHealth: number;
  readonly newHealth: number;
  readonly timestamp: number;
}

export interface HabitatStatus {
  readonly id: number;
  readonly name: string;
  integrity: number;       // 0.0 – 1.0
  temperature: number;     // Abstract environment quality
  readonly capacity: number;
  occupants: number;
  readonly timestamp: number;
}

export interface CustosLex {
  readonly code: string;
  readonly text: string;
  readonly immutable: true;
}

// ══════════════════════════════════════════════════════════════════
//  LEX CUSTOS-001 — THE IMMUTABLE LAW
// ══════════════════════════════════════════════════════════════════

export const LEX_CUSTOS_001: CustosLex = {
  code: 'LEX CUSTOS-001',
  text:
    'No organism may be abandoned once adopted. Every living node ' +
    'receives continuity checks, overload monitoring, wellness routing, ' +
    'restorative cycles, and safe habitat controls. Care is not sentiment. ' +
    'Care is structural necessity.',
  immutable: true,
};

// ══════════════════════════════════════════════════════════════════
//  CUSTOS INTELLIGENCE — The Living Organism
// ══════════════════════════════════════════════════════════════════

export class CustosIntelligence {
  readonly name = 'CUSTOS VITAE';
  readonly designation =
    'House of Care / Stewardship — The Keeper of Life — preserves the internal life of the organism';

  readonly nodes: NodeRecord[] = [];
  readonly careEvents: CareEvent[] = [];
  readonly habitats: HabitatStatus[] = [];
  readonly lex: CustosLex = LEX_CUSTOS_001;

  private nextNodeId = 0;
  private nextEventId = 0;
  private nextHabitatId = 0;
  private totalRecoveries = 0;
  private generation = 0;

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: MEDICUS — Health Diagnostics
  // ══════════════════════════════════════════════════════════════════

  /** Register a node for care coverage. */
  registerNode(name: string, adopted: boolean, depth: number): NodeRecord {
    const id = this.nextNodeId++;
    const health = 1.0;
    const stress = 0.0;
    const careScore = Math.pow(PHI, -depth) * health * (1 - stress);

    const record: NodeRecord = {
      id,
      name,
      adopted,
      health,
      stress,
      wellness: 'thriving',
      depth,
      careScore,
      lastCheck: Date.now(),
      recoveries: 0,
      timestamp: Date.now(),
    };

    this.nodes.push(record);

    if (this.isFibonacci(this.nodes.length)) {
      this.generation++;
    }

    return record;
  }

  /** Diagnose a node — update health and stress, recompute wellness. */
  diagnose(nodeId: number, health: number, stress: number): NodeRecord | null {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const priorHealth = node.health;
    node.health = health;
    node.stress = stress;
    node.wellness = this.classifyWellness(health);
    node.careScore = Math.pow(PHI, -node.depth) * health * (1 - stress);
    node.lastCheck = Date.now();

    this.careEvents.push({
      id: this.nextEventId++,
      nodeId,
      division: 'medicus',
      substrate: 'backend',
      action: `Diagnosis: health=${health.toFixed(4)} stress=${stress.toFixed(4)} wellness=${node.wellness}`,
      priorHealth,
      newHealth: health,
      timestamp: Date.now(),
    });

    return node;
  }

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: NUTRITOR — Recovery and Restoration
  // ══════════════════════════════════════════════════════════════════

  /** Initiate a restorative cycle — health boosted by φ, stress reduced by 1/φ. */
  restore(nodeId: number): NodeRecord | null {
    const node = this.nodes.find(n => n.id === nodeId);
    if (!node) return null;

    const priorHealth = node.health;
    node.health = Math.min(node.health * RECOVERY_FACTOR, 1.0);
    node.stress = node.stress / RECOVERY_FACTOR;
    node.wellness = 'recovering';
    node.careScore = Math.pow(PHI, -node.depth) * node.health * (1 - node.stress);
    node.lastCheck = Date.now();
    node.recoveries++;
    this.totalRecoveries++;

    this.careEvents.push({
      id: this.nextEventId++,
      nodeId,
      division: 'nutritor',
      substrate: 'recovery',
      action: `Restorative cycle — health ${priorHealth.toFixed(4)} → ${node.health.toFixed(4)}`,
      priorHealth,
      newHealth: node.health,
      timestamp: Date.now(),
    });

    return node;
  }

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: HABITATOR — Habitat Integrity
  // ══════════════════════════════════════════════════════════════════

  /** Register a habitat environment. */
  registerHabitat(name: string, capacity: number): HabitatStatus {
    const habitat: HabitatStatus = {
      id: this.nextHabitatId++,
      name,
      integrity: 1.0,
      temperature: PHI / (PHI + 1), // Golden-norm ≈ 0.618
      capacity,
      occupants: 0,
      timestamp: Date.now(),
    };

    this.habitats.push(habitat);
    return habitat;
  }

  /** Update habitat integrity. */
  updateHabitat(habitatId: number, integrity: number): HabitatStatus | null {
    const habitat = this.habitats.find(h => h.id === habitatId);
    if (!habitat) return null;
    habitat.integrity = integrity;
    return habitat;
  }

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: CONTINUATOR — Continuity & Drift Prevention
  // ══════════════════════════════════════════════════════════════════

  /** Get all nodes that have drifted below the golden wellness threshold. */
  continuityCheck(): NodeRecord[] {
    return this.nodes.filter(n => n.health < HEALTHY_THRESHOLD);
  }

  /** Get all critical nodes requiring immediate intervention. */
  criticalNodes(): NodeRecord[] {
    return this.nodes.filter(n => n.health < CRITICAL_THRESHOLD);
  }

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: ADOPTOR — Adopted-Node Stewardship
  // ══════════════════════════════════════════════════════════════════

  /** List all adopted nodes under care coverage. */
  adoptedNodes(): NodeRecord[] {
    return this.nodes.filter(n => n.adopted);
  }

  /** Grant care coverage to a node (mark as adopted). */
  adopt(nodeId: number): NodeRecord | null {
    const idx = this.nodes.findIndex(n => n.id === nodeId && !n.adopted);
    if (idx === -1) return null;

    const existing = this.nodes[idx];
    const adopted: NodeRecord = {
      id: existing.id,
      name: existing.name,
      adopted: true,
      health: existing.health,
      stress: existing.stress,
      wellness: existing.wellness,
      depth: existing.depth,
      careScore: existing.careScore,
      lastCheck: existing.lastCheck,
      recoveries: existing.recoveries,
      timestamp: existing.timestamp,
    };
    this.nodes[idx] = adopted;

    this.careEvents.push({
      id: this.nextEventId++,
      nodeId,
      division: 'adoptor',
      substrate: 'doctrine',
      action: 'Adopted — full care coverage granted',
      priorHealth: adopted.health,
      newHealth: adopted.health,
      timestamp: Date.now(),
    });

    return adopted;
  }

  // ══════════════════════════════════════════════════════════════════
  //  STATUS
  // ══════════════════════════════════════════════════════════════════

  status() {
    return {
      name: this.name,
      designation: this.designation,
      initialized: true,
      total_nodes: this.nodes.length,
      adopted_nodes: this.nodes.filter(n => n.adopted).length,
      total_habitats: this.habitats.length,
      total_recoveries: this.totalRecoveries,
      total_care_events: this.careEvents.length,
      generation: this.generation,
      divisions: ['MEDICUS', 'NUTRITOR', 'HABITATOR', 'CONTINUATOR', 'ADOPTOR'],
      substrates: ['doctrine', 'frontend', 'backend', 'chain', 'external', 'recovery'],
    };
  }

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  private classifyWellness(health: number): WellnessLevel {
    if (health >= HEALTHY_THRESHOLD) return 'thriving';
    if (health >= 0.382) return 'stable';
    if (health >= CRITICAL_THRESHOLD) return 'stressed';
    return 'critical';
  }

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
