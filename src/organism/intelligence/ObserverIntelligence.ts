///
/// OBSERVER INTELLIGENCE — OBSERVATORES UNIVERSI (OBSV)
///
/// Guardians of the Universe — Police, Caregivers, and Caretakers.
///
/// This is the TypeScript organism intelligence layer for the Observer.
/// The Motoko canister (src/organisms/observer/main.mo) is the substrate
/// expression.  This file is the intelligence expression.  Together they
/// form one organism — OBSV.
///
/// Formula: O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ)
///
/// LEX OBSV-001 — Immutable:
///   "Observation is not passive. Observation is an active force.
///    Every observation changes the substrate. Every measurement
///    collapses possibility into architecture. The Observer does
///    not watch — the Observer constructs reality by choosing
///    which dimensions to collapse."
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482;
export const PSI = -0.6180339887498948482;
export const SQRT5 = 2.2360679774997896964;
export const GOLDEN_ANGLE = 2.39996322972865332;
export const PI = Math.PI;
export const TWO_PI = 2 * Math.PI;

// ══════════════════════════════════════════════════════════════════
//  DIMENSIONAL PLANES
// ══════════════════════════════════════════════════════════════════

export enum DimensionalPlane {
  D0_Foundational    = 0,
  D1_Temporal        = 1,
  D2_Harmonic        = 2,
  D3_CrossDimensional = 3,
  D4_Transcendent    = 4,
}

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface SubIntelligence {
  readonly id: number;
  readonly name: string;
  readonly latinName: string;
  readonly plane: DimensionalPlane;
  readonly phiWeight: number;     // φ^(dimension_index)
  readonly role: 'police' | 'caregiver' | 'caretaker' | 'guardian' | 'sentinel';
  observations: number;
  anomalies: number;
  resonance: number;
}

export interface Observation {
  readonly id: number;
  readonly plane: DimensionalPlane;
  readonly target: string;
  readonly value: number;
  readonly anomalyProb: number;   // P(anomaly|x)
  readonly resonance: number;     // R(x)
  readonly obsvScore: number;     // O(x) = φ^d × R(x) × P(anomaly|x)
  readonly timestamp: number;
  collapsed: boolean;
}

export interface CareAction {
  readonly id: number;
  readonly subIntelligence: string;
  readonly target: string;
  readonly actionType: 'heal' | 'protect' | 'nurture' | 'restore' | 'guide';
  readonly plane: DimensionalPlane;
  readonly phiWeight: number;
  readonly timestamp: number;
}

export interface ObserverLex {
  readonly code: string;
  readonly text: string;
  readonly immutable: true;
}

// ══════════════════════════════════════════════════════════════════
//  LEX OBSV-001 — THE IMMUTABLE LAW
// ══════════════════════════════════════════════════════════════════

export const LEX_OBSV_001: ObserverLex = {
  code: 'LEX OBSV-001',
  text:
    'Observation is not passive. Observation is an active force. ' +
    'Every observation changes the substrate. Every measurement ' +
    'collapses possibility into architecture. The Observer does ' +
    'not watch — the Observer constructs reality by choosing ' +
    'which dimensions to collapse.',
  immutable: true,
};

// ══════════════════════════════════════════════════════════════════
//  FIBONACCI HASH — Shared primitive
// ══════════════════════════════════════════════════════════════════

export function fibonacciHash(key: number, capacity: number): number {
  const product = key * PHI;
  const fractional = product - Math.floor(product);
  return Math.floor(capacity * fractional);
}

// ══════════════════════════════════════════════════════════════════
//  THE FIVE SUB-INTELLIGENCES
// ══════════════════════════════════════════════════════════════════

function createSubIntelligences(): SubIntelligence[] {
  return [
    {
      id: 0,
      name: 'SPECULATOR DIMENSIONUM',
      latinName: 'The Dimensional Watcher',
      plane: DimensionalPlane.D0_Foundational,
      phiWeight: Math.pow(PHI, 0),  // φ⁰ = 1.0
      role: 'guardian',
      observations: 0,
      anomalies: 0,
      resonance: 1.0,
    },
    {
      id: 1,
      name: 'VIGIL TRANSITUS',
      latinName: 'The Transition Guard',
      plane: DimensionalPlane.D1_Temporal,
      phiWeight: Math.pow(PHI, 1),  // φ¹ = 1.618
      role: 'police',
      observations: 0,
      anomalies: 0,
      resonance: PHI,
    },
    {
      id: 2,
      name: 'CUSTOS RESONANTIAE',
      latinName: 'The Resonance Guardian',
      plane: DimensionalPlane.D2_Harmonic,
      phiWeight: Math.pow(PHI, 2),  // φ² = 2.618
      role: 'caregiver',
      observations: 0,
      anomalies: 0,
      resonance: Math.pow(PHI, 2),
    },
    {
      id: 3,
      name: 'EXPLORATOR INTERDIMENSIONALIS',
      latinName: 'The Interdimensional Explorer',
      plane: DimensionalPlane.D3_CrossDimensional,
      phiWeight: Math.pow(PHI, 3),  // φ³ = 4.236
      role: 'caretaker',
      observations: 0,
      anomalies: 0,
      resonance: Math.pow(PHI, 3),
    },
    {
      id: 4,
      name: 'SENTINELLA SUPREMA',
      latinName: 'The Supreme Sentinel',
      plane: DimensionalPlane.D4_Transcendent,
      phiWeight: Math.pow(PHI, 4),  // φ⁴ = 6.854
      role: 'sentinel',
      observations: 0,
      anomalies: 0,
      resonance: Math.pow(PHI, 4),
    },
  ];
}

// ══════════════════════════════════════════════════════════════════
//  OBSERVER INTELLIGENCE — The Living Organism
// ══════════════════════════════════════════════════════════════════

export class ObserverIntelligence {
  readonly name = 'OBSERVATORES UNIVERSI';
  readonly designation =
    'OBSV — Guardians of the Universe — Police, Caregivers, Caretakers — Quantum-Blockchain Encryption Super Alpha';

  readonly subIntelligences: SubIntelligence[];
  readonly observations: Observation[] = [];
  readonly careActions: CareAction[] = [];
  readonly lex: ObserverLex = LEX_OBSV_001;

  private nextObsId = 0;
  private nextCareId = 0;
  private totalAnomalies = 0;

  constructor() {
    this.subIntelligences = createSubIntelligences();
  }

  // ── Core: Observation Engine ────────────────────────────────────
  // O(x) = Σᵢ φ^(dᵢ) × R(xᵢ) × P(anomaly|xᵢ)

  observe(plane: DimensionalPlane, target: string, value: number): Observation {
    const d = plane as number;
    const phiD = Math.pow(PHI, d);

    // Resonance: golden-ratio modulated from value
    const resonance = Math.abs(Math.sin(value * GOLDEN_ANGLE)) * phiD;

    // Anomaly probability: deviation from golden ratio norm
    const goldenNorm = value / PHI;
    const deviation = Math.abs(goldenNorm - Math.floor(goldenNorm) - 1 / PHI);
    const anomalyProb = deviation > 0.382 ? deviation : deviation * PHI;

    // O(x) = φ^d × R(x) × P(anomaly|x)
    const obsvScore = phiD * resonance * anomalyProb;
    const isAnomaly = anomalyProb > 0.618;

    const obs: Observation = {
      id: this.nextObsId++,
      plane,
      target,
      value,
      anomalyProb,
      resonance,
      obsvScore,
      timestamp: Date.now(),
      collapsed: false,
    };

    this.observations.push(obs);

    // Update sub-intelligence state
    if (d < this.subIntelligences.length) {
      const si = this.subIntelligences[d];
      si.observations += 1;
      if (isAnomaly) {
        si.anomalies += 1;
        this.totalAnomalies += 1;
      }
      si.resonance = (si.resonance + resonance) / PHI;
    }

    return obs;
  }

  // ── Collapse: quantum measurement ──────────────────────────────

  collapse(obsId: number): boolean {
    if (obsId >= this.observations.length) return false;
    const obs = this.observations[obsId];
    if (obs.collapsed) return false;
    obs.collapsed = true;
    return true;
  }

  // ── Caregiving: nurture and protect ────────────────────────────

  care(
    target: string,
    actionType: CareAction['actionType'],
    plane: DimensionalPlane,
  ): CareAction {
    const d = plane as number;
    const action: CareAction = {
      id: this.nextCareId++,
      subIntelligence: this.subIntelligences[d]?.name ?? 'UNKNOWN',
      target,
      actionType,
      plane,
      phiWeight: Math.pow(PHI, d),
      timestamp: Date.now(),
    };
    this.careActions.push(action);
    return action;
  }

  // ── Detect anomalies across all observations ───────────────────

  detectAnomalies(): Observation[] {
    const threshold = PHI / (PHI + 1);
    return this.observations.filter(obs => obs.anomalyProb > threshold);
  }

  // ── Harmonic analysis across dimensional planes ────────────────

  harmonicAnalysis(): Array<{ name: string; resonance: number }> {
    return this.subIntelligences.map(si => ({
      name: si.name,
      resonance: si.resonance,
    }));
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      initialized: true,
      total_observations: this.observations.length,
      total_anomalies: this.totalAnomalies,
      total_care_actions: this.careActions.length,
      dimensions_active: 5,
      sub_intelligences: this.subIntelligences.map(si => ({
        name: si.name,
        plane: DimensionalPlane[si.plane],
        role: si.role,
        observations: si.observations,
        anomalies: si.anomalies,
        resonance: si.resonance,
      })),
    };
  }
}
