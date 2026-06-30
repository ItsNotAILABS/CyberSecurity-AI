///
/// DOMUS CUSTOS — The Living Care House Orchestrator
///
/// Master orchestrator for the House of Care / Stewardship (CUSTOS VITAE, α₈).
/// Wires ALL care intelligences together into one living, autonomous house.
///
/// Coordinates:
///   • CustosIntelligence  — Core intelligence with 5 divisions
///     (MEDICUS, NUTRITOR, HABITATOR, CONTINUATOR, ADOPTOR)
///   • SalusModel           — 5 sub-models: continuous wellness monitoring
///   • CuratorModel         — 5 sub-models: habitat & environment management
///   • DiagnosticaHarmonica — Care pattern recognition solver
///   • TheoricusVitae       — Care theory proving solver
///
/// Total: 1 core intelligence + 2 server models + 2 solver engines
///        = 5 intelligence layers, 15+ active sub-intelligences
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from '../intelligence/ObserverIntelligence.js';

import {
  CustosIntelligence,
  LEX_CUSTOS_001,
  type NodeRecord,
  type HabitatStatus,
  type CareDivision,
  type CareSubstrate,
} from '../intelligence/CustosIntelligence.js';

import {
  SalusModel,
  CuratorModel,
  type CareAlert,
  type OverloadPrediction,
  type RecoveryPattern,
  type HabitatReport,
  type EnvironmentOptimization,
} from './CustosModels.js';

import {
  DiagnosticaHarmonica,
  TheoricusVitae,
  type WellnessPattern,
  type CareGap,
  type CareTheoryResult,
} from './CustosSolverSynthesizers.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES — Orchestration Result Interfaces
// ══════════════════════════════════════════════════════════════════

export interface HouseCareCycleResult {
  readonly alerts: CareAlert[];
  readonly habitatReports: HabitatReport[];
  readonly patterns: WellnessPattern[];
  readonly gaps: CareGap[];
  readonly theories: CareTheoryResult[];
  readonly timestamp: number;
}

export interface CaredNode {
  readonly node: NodeRecord;
  readonly alerts: CareAlert[];
  readonly predictions: OverloadPrediction[];
}

export interface RecoveryOrchestration {
  readonly node: NodeRecord | null;
  readonly restored: boolean;
  readonly predictions: OverloadPrediction[];
  readonly patterns: RecoveryPattern[];
}

export interface ManagedHabitat {
  readonly habitat: HabitatStatus;
  readonly report: HabitatReport | null;
  readonly optimization: EnvironmentOptimization | null;
}

export interface HouseStatus {
  readonly name: string;
  readonly designation: string;
  readonly lex: string;
  readonly total_intelligences: number;
  readonly total_sub_models: number;
  readonly components: ReadonlyArray<{
    readonly name: string;
    readonly role: string;
    readonly active: boolean;
  }>;
  readonly divisions: readonly CareDivision[];
  readonly substrates: readonly CareSubstrate[];
  readonly generation: number;
}

// ══════════════════════════════════════════════════════════════════
//  DOMUS CUSTOS — The Living Care House Orchestrator
// ══════════════════════════════════════════════════════════════════

export class DomusCustos {
  private readonly core: CustosIntelligence;
  private readonly salus: SalusModel;
  private readonly curator: CuratorModel;
  private readonly diagnostica: DiagnosticaHarmonica;
  private readonly theoricus: TheoricusVitae;

  constructor() {
    this.core = new CustosIntelligence();
    this.salus = new SalusModel();
    this.curator = new CuratorModel();
    this.diagnostica = new DiagnosticaHarmonica();
    this.theoricus = new TheoricusVitae();
  }

  // ── Full Care Cycle ───────────────────────────────────────────

  /**
   * Run a full care cycle across ALL divisions and substrates.
   *
   * 1. SALUS scans all nodes for wellness alerts
   * 2. CURATOR inspects all habitats for integrity
   * 3. DIAGNOSTICA synthesizes cross-division wellness patterns
   * 4. DIAGNOSTICA detects care gaps across nodes and habitats
   * 5. THEORICUS tests all 5 golden hypotheses
   */
  runFullCareCycle(): HouseCareCycleResult {
    const alerts = this.salus.scan(this.core.nodes);
    const habitatReports = this.curator.inspectHabitats(this.core.habitats);
    const patterns = this.diagnostica.synthesize(
      this.core.nodes,
      this.core.careEvents,
    );
    const gaps = this.diagnostica.detectCareGaps(
      this.core.nodes,
      this.core.habitats,
    );
    const theories = this.theoricus.testAllHypotheses(
      this.core.nodes,
      this.core.careEvents,
    );

    return {
      alerts,
      habitatReports,
      patterns,
      gaps,
      theories,
      timestamp: Date.now(),
    };
  }

  // ── Register & Immediate Care ─────────────────────────────────

  /**
   * Register a node and immediately scan it for wellness.
   * Inner experience: how the node feels upon entering the house.
   */
  registerAndCare(name: string, adopted: boolean, depth: number): CaredNode {
    const node = this.core.registerNode(name, adopted, depth);
    const alerts = this.salus.scan([node]);
    const predictions = this.salus.predictOverload([node]);

    return { node, alerts, predictions };
  }

  // ── Recovery Orchestration ────────────────────────────────────

  /**
   * Full recovery orchestration for a single node.
   * Diagnoses current state, restores via NUTRITOR, predicts future
   * overload, and assesses recovery patterns from history.
   */
  orchestrateRecovery(nodeId: number): RecoveryOrchestration {
    const existing = this.core.nodes.find(n => n.id === nodeId);
    if (!existing) {
      return {
        node: null,
        restored: false,
        predictions: [],
        patterns: [],
      };
    }

    // Diagnose current state via MEDICUS
    this.core.diagnose(nodeId, existing.health, existing.stress);

    // Restore via NUTRITOR — health × φ, stress / φ
    const restored = this.core.restore(nodeId);

    // Predict future overload via SALUS PRAEMONITOR
    const predictions = restored
      ? this.salus.predictOverload([restored])
      : [];

    // Assess recovery history via SALUS CHRONISTA
    const patterns = this.salus.assessRecoveryPattern(this.core.careEvents);

    return {
      node: restored,
      restored: restored !== null,
      predictions,
      patterns,
    };
  }

  // ── Habitat Building ──────────────────────────────────────────

  /**
   * Register a habitat, inspect it, and optimize it.
   * Outer experience: how the house presents wellness to its inhabitants.
   */
  buildHabitat(name: string, capacity: number): ManagedHabitat {
    const habitat = this.core.registerHabitat(name, capacity);

    // Inspect via CURATOR INSPECTOR_AMBITUS
    const reports = this.curator.inspectHabitats([habitat]);
    const report = reports.length > 0 ? reports[0] : null;

    // Optimize via CURATOR AEDIFICATOR + TEMPERATOR + NUTRITOR_SOLI
    const optimization = this.curator.optimizeEnvironment(habitat.id);

    return { habitat, report, optimization };
  }

  // ── House Status ──────────────────────────────────────────────

  /**
   * Comprehensive house status.
   * Cross-house communication readiness: everything the house knows
   * about itself, ready to share with other organism houses.
   */
  houseStatus(): HouseStatus {
    const coreStatus = this.core.status();
    const salusStatus = this.salus.status();
    const curatorStatus = this.curator.status();

    // 5 core divisions + 5 SALUS sub-models + 5 CURATOR sub-models = 15+
    const coreDivisionCount = 5;
    const salusSubModelCount = salusStatus.subModels.length;
    const curatorSubModelCount = curatorStatus.subModels.length;
    const solverCount = 2; // DiagnosticaHarmonica + TheoricusVitae
    const totalSubModels =
      coreDivisionCount + salusSubModelCount + curatorSubModelCount;
    const totalIntelligences = totalSubModels + solverCount;

    return {
      name: 'DOMUS CUSTOS',
      designation: coreStatus.designation,
      lex: LEX_CUSTOS_001.code,
      total_intelligences: totalIntelligences,
      total_sub_models: totalSubModels,
      components: [
        {
          name: coreStatus.name,
          role: 'Core intelligence — 5 care divisions',
          active: coreStatus.initialized,
        },
        {
          name: salusStatus.name,
          role: salusStatus.latinName,
          active: salusStatus.active,
        },
        {
          name: curatorStatus.name,
          role: curatorStatus.latinName,
          active: curatorStatus.active,
        },
        {
          name: this.diagnostica.name,
          role: this.diagnostica.latinName,
          active: true,
        },
        {
          name: this.theoricus.name,
          role: this.theoricus.latinName,
          active: true,
        },
      ],
      divisions: ['medicus', 'nutritor', 'habitator', 'continuator', 'adoptor'],
      substrates: [
        'doctrine',
        'frontend',
        'backend',
        'chain',
        'external',
        'recovery',
      ],
      generation: coreStatus.generation,
    };
  }
}
