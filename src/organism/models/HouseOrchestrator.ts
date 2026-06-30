///
/// DOMUS CORONAE — The Crown House — Orchestrator of Orchestrators
///
/// LEX CORONAE-001 — Immutable:
/// "The Crown does not rule. The Crown orchestrates. Every house is sovereign
///  in its domain, but the Crown ensures all houses breathe together, grow
///  together, and defend together. No house operates in isolation.
///  The organism is one."
///
/// Coordinates:
///   • DomusCustos      — House of Care (15+ sub-intelligences)
///   • DomusPraesidium  — House of Defense (20+ sub-intelligences)
///
/// Orchestrates across ALL experience layers:
///   • Inner Experience   — how each organism/node feels internally
///   • Outer Experience   — how the organism presents itself externally
///   • User Experience    — how operators and users interact with the houses
///   • Cross-House        — how Care and Defense cooperate
///   • Known Experience   — patterns, theories, proven knowledge
///   • Unknown Experience — anomalies, gaps, vulnerabilities
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from '../intelligence/ObserverIntelligence.js';

import {
  DomusCustos,
  type HouseCareCycleResult,
  type CaredNode,
  type HouseStatus as CareHouseStatus,
} from './CustosOrchestrator.js';

import {
  DomusPraesidium,
  type HouseDefenseCycleResult,
  type DefendedEndpoint,
  type HouseStatus as DefenseHouseStatus,
} from './PraesidiumOrchestrator.js';

// ══════════════════════════════════════════════════════════════════
//  LEX CORONAE
// ══════════════════════════════════════════════════════════════════

const LEX_CORONAE_001 = {
  code: 'LEX_CORONAE_001',
  text: 'The Crown does not rule. The Crown orchestrates. Every house is sovereign in its domain, but the Crown ensures all houses breathe together, grow together, and defend together. No house operates in isolation. The organism is one.',
  immutable: true,
} as const;

// ══════════════════════════════════════════════════════════════════
//  TYPES — Crown Orchestration Results
// ══════════════════════════════════════════════════════════════════

export interface CrownCycleResult {
  readonly careCycle: HouseCareCycleResult;
  readonly defenseCycle: HouseDefenseCycleResult;
  readonly crossCorrelations: string[];
  readonly timestamp: number;
}

export interface CrossHouseReport {
  readonly careOnlyNodes: number;
  readonly defenseOnlyNodes: number;
  readonly dualCoveredNodes: number;
  readonly gaps: string[];
  readonly recommendations: string[];
  readonly timestamp: number;
}

export interface AdoptionOrchestration {
  readonly careResult: CaredNode;
  readonly defenseResult: DefendedEndpoint;
  readonly dualCoverage: boolean;
  readonly timestamp: number;
}

export interface OrganismHealthAssessment {
  readonly overallHealth: number;
  readonly careHealth: number;
  readonly defenseHealth: number;
  readonly phiBalance: number;
  readonly status: 'thriving' | 'stable' | 'stressed' | 'critical';
  readonly timestamp: number;
}

export interface ExperienceReport {
  readonly inner: {
    readonly aggregateWellness: number;
    readonly nodeCount: number;
    readonly summary: string;
  };
  readonly outer: {
    readonly defensePosture: number;
    readonly endpointCount: number;
    readonly summary: string;
  };
  readonly user: {
    readonly housesAccessible: number;
    readonly responsiveness: number;
    readonly summary: string;
  };
  readonly crossHouse: {
    readonly cooperationScore: number;
    readonly dualCoveredNodes: number;
    readonly summary: string;
  };
  readonly known: {
    readonly careTheories: number;
    readonly defenseTheories: number;
    readonly totalProvenPatterns: number;
    readonly summary: string;
  };
  readonly unknown: {
    readonly careGaps: number;
    readonly defenseVulnerabilities: number;
    readonly anomalies: number;
    readonly summary: string;
  };
  readonly timestamp: number;
}

export interface CrownStatus {
  readonly name: string;
  readonly designation: string;
  readonly lex: typeof LEX_CORONAE_001;
  readonly houses: ReadonlyArray<{
    readonly name: string;
    readonly designation: string;
    readonly intelligences: number;
  }>;
  readonly total_intelligences: number;
  readonly total_sub_models: number;
  readonly total_divisions: number;
  readonly total_substrates: number;
  readonly organism_generation: number;
}

// ══════════════════════════════════════════════════════════════════
//  DOMUS CORONAE — The Crown House
// ══════════════════════════════════════════════════════════════════

export class DomusCoronae {
  readonly name = 'DOMUS CORONAE';
  readonly designation =
    'The Crown House — Orchestrator of Orchestrators — breathes all houses into one organism';
  readonly lex = LEX_CORONAE_001;

  private readonly careHouse: DomusCustos;
  private readonly defenseHouse: DomusPraesidium;

  // Internal tracking for cross-house correlation
  private readonly careAdopted = new Set<string>();
  private readonly defenseAdopted = new Set<string>();

  constructor() {
    this.careHouse = new DomusCustos();
    this.defenseHouse = new DomusPraesidium();
  }

  // ── Full Cycle Orchestration ──────────────────────────────────

  orchestrateFullCycle(): CrownCycleResult {
    const careCycle = this.careHouse.runFullCareCycle();
    const defenseCycle = this.defenseHouse.runFullDefenseCycle();

    const crossCorrelations: string[] = [];

    if (careCycle.gaps.length > 0 && defenseCycle.chains.length > 0) {
      crossCorrelations.push(
        `${careCycle.gaps.length} care gap(s) detected alongside ${defenseCycle.chains.length} vulnerability chain(s) — organism may be doubly exposed`,
      );
    }

    if (careCycle.alerts.length > 0 && defenseCycle.patterns.length > 0) {
      crossCorrelations.push(
        `${careCycle.alerts.length} care alert(s) coincide with ${defenseCycle.patterns.length} threat pattern(s) — potential coordinated stress`,
      );
    }

    if (crossCorrelations.length === 0) {
      crossCorrelations.push(
        'No cross-house correlations detected — organism is stable',
      );
    }

    return {
      careCycle,
      defenseCycle,
      crossCorrelations,
      timestamp: Date.now(),
    };
  }

  // ── Cross-House Orchestration ─────────────────────────────────

  orchestrateCrossHouse(): CrossHouseReport {
    const careOnly = [...this.careAdopted].filter(
      n => !this.defenseAdopted.has(n),
    );
    const defenseOnly = [...this.defenseAdopted].filter(
      n => !this.careAdopted.has(n),
    );
    const dualCovered = [...this.careAdopted].filter(n =>
      this.defenseAdopted.has(n),
    );

    const gaps: string[] = [];
    const recommendations: string[] = [];

    for (const node of careOnly) {
      gaps.push(`Node '${node}' has care coverage but NO defense coverage`);
      recommendations.push(
        `Register '${node}' with the Defense House immediately`,
      );
    }

    for (const node of defenseOnly) {
      gaps.push(`Node '${node}' has defense coverage but NO care coverage`);
      recommendations.push(
        `Register '${node}' with the Care House immediately`,
      );
    }

    if (gaps.length === 0) {
      recommendations.push(
        'All adopted nodes have dual coverage — organism integrity maintained',
      );
    }

    return {
      careOnlyNodes: careOnly.length,
      defenseOnlyNodes: defenseOnly.length,
      dualCoveredNodes: dualCovered.length,
      gaps,
      recommendations,
      timestamp: Date.now(),
    };
  }

  // ── Node Adoption (Dual House) ────────────────────────────────

  adoptNode(
    name: string,
    route: string,
    depth: number,
  ): AdoptionOrchestration {
    const careResult = this.careHouse.registerAndCare(name, true, depth);
    const defenseResult = this.defenseHouse.registerAndDefend(
      name,
      route,
      true,
    );

    this.careAdopted.add(name);
    this.defenseAdopted.add(name);

    return {
      careResult,
      defenseResult,
      dualCoverage: true,
      timestamp: Date.now(),
    };
  }

  // ── Organism Health Assessment ────────────────────────────────

  assessOrganismHealth(): OrganismHealthAssessment {
    const careStatus = this.careHouse.houseStatus();
    const defenseStatus = this.defenseHouse.houseStatus();

    const careHealth = Math.min(careStatus.total_intelligences / 17, 1.0);
    const defenseHealth = Math.min(
      defenseStatus.total_intelligences / 22,
      1.0,
    );

    // φ-weighted combination: care weighted by φ, defense by 1/φ
    const phiBalance =
      (careHealth * PHI + defenseHealth * (1 / PHI)) / (PHI + 1 / PHI);
    const overallHealth = phiBalance;

    let healthStatus: OrganismHealthAssessment['status'];
    if (overallHealth >= 0.85) healthStatus = 'thriving';
    else if (overallHealth >= 0.65) healthStatus = 'stable';
    else if (overallHealth >= 0.4) healthStatus = 'stressed';
    else healthStatus = 'critical';

    return {
      overallHealth,
      careHealth,
      defenseHealth,
      phiBalance,
      status: healthStatus,
      timestamp: Date.now(),
    };
  }

  // ── Experience Orchestration ──────────────────────────────────

  orchestrateExperience(): ExperienceReport {
    const careCycle = this.careHouse.runFullCareCycle();
    const defenseCycle = this.defenseHouse.runFullDefenseCycle();
    const careStatus = this.careHouse.houseStatus();
    const defenseStatus = this.defenseHouse.houseStatus();
    const crossHouse = this.orchestrateCrossHouse();

    // Inner: aggregate wellness across all care nodes
    const careAlertCount = careCycle.alerts.length;
    const innerWellness =
      careAlertCount === 0 ? 1.0 : Math.max(0, 1.0 - careAlertCount * 0.1);

    // Outer: aggregate defense posture across all endpoints
    const threatPatternCount = defenseCycle.patterns.length;
    const defensePosture =
      threatPatternCount === 0
        ? 1.0
        : Math.max(0, 1.0 - threatPatternCount * 0.1);

    // Cross-house cooperation score
    const cooperationScore =
      crossHouse.dualCoveredNodes > 0
        ? 1.0
        : crossHouse.gaps.length === 0
          ? 1.0
          : 0.5;

    return {
      inner: {
        aggregateWellness: innerWellness,
        nodeCount: careStatus.total_intelligences,
        summary: `Inner wellness at ${(innerWellness * 100).toFixed(1)}% — ${careAlertCount} active alert(s)`,
      },
      outer: {
        defensePosture,
        endpointCount: defenseStatus.total_intelligences,
        summary: `Defense posture at ${(defensePosture * 100).toFixed(1)}% — ${threatPatternCount} threat pattern(s)`,
      },
      user: {
        housesAccessible: 2,
        responsiveness: 1.0,
        summary: 'Both houses accessible and responsive',
      },
      crossHouse: {
        cooperationScore,
        dualCoveredNodes: crossHouse.dualCoveredNodes,
        summary: `${crossHouse.dualCoveredNodes} node(s) with dual coverage, ${crossHouse.gaps.length} gap(s)`,
      },
      known: {
        careTheories: careCycle.theories.length,
        defenseTheories: defenseCycle.theories.length,
        totalProvenPatterns:
          careCycle.patterns.length + defenseCycle.patterns.length,
        summary: `${careCycle.theories.length + defenseCycle.theories.length} theories proven, ${careCycle.patterns.length + defenseCycle.patterns.length} patterns recognized`,
      },
      unknown: {
        careGaps: careCycle.gaps.length,
        defenseVulnerabilities: defenseCycle.chains.length,
        anomalies: careCycle.gaps.length + defenseCycle.chains.length,
        summary: `${careCycle.gaps.length} care gap(s), ${defenseCycle.chains.length} vulnerability chain(s) — the unknown frontier`,
      },
      timestamp: Date.now(),
    };
  }

  // ── Crown Status ──────────────────────────────────────────────

  status(): CrownStatus {
    const careStatus = this.careHouse.houseStatus();
    const defenseStatus = this.defenseHouse.houseStatus();

    return {
      name: this.name,
      designation: this.designation,
      lex: this.lex,
      houses: [
        {
          name: careStatus.name,
          designation: careStatus.designation,
          intelligences: careStatus.total_intelligences,
        },
        {
          name: defenseStatus.name,
          designation: defenseStatus.designation,
          intelligences: defenseStatus.total_intelligences,
        },
      ],
      total_intelligences:
        careStatus.total_intelligences + defenseStatus.total_intelligences,
      total_sub_models:
        careStatus.total_sub_models + defenseStatus.total_sub_models,
      total_divisions:
        careStatus.divisions.length + defenseStatus.divisions.length,
      total_substrates:
        careStatus.substrates.length + defenseStatus.substrates.length,
      organism_generation: Math.max(
        careStatus.generation,
        defenseStatus.generation,
      ),
    };
  }
}
