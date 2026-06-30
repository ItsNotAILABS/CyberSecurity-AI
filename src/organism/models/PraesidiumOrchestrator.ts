///
/// DOMUS PRAESIDIUM — The Living Defense House Orchestrator
///
/// Master orchestrator for the House of Defense / Protection (PRAESIDIUM LIMITIS, α₉).
/// Wires ALL defense intelligences together into one living, autonomous house.
///
/// Coordinates:
///   1. PraesidiumIntelligence  — Core intelligence (5 divisions: CRUSADER, HONEYPOT, SENTINEL, AEGIS, UMBRA)
///   2. BellatorModel           — Active combat & interception (5 sub-models)
///   3. ExploratorModel         — Reconnaissance & surveillance (5 sub-models)
///   4. FabricatorModel         — Armor & fortification engineering (5 sub-models)
///   5. AnalystorHostilis       — Cross-division threat pattern recognition solver
///   6. TheoricusLimitis        — Defense theory proving solver
///
/// Total: 1 core intelligence + 3 server models + 2 solver engines = 6 intelligence layers, 20+ active sub-intelligences
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from '../intelligence/ObserverIntelligence.js';

import {
  PraesidiumIntelligence,
  LEX_PRAESIDIUM_001,
  type EndpointRecord,
  type DefenseEvent,
  type HoneypotField,
  type ThreatTier,
  type PraesidiumLex,
  type DefenseDivision,
  type DefenseSubstrate,
} from '../intelligence/PraesidiumIntelligence.js';

import {
  BellatorModel,
  ExploratorModel,
  FabricatorModel,
  type CombatResult,
  type ShieldDeployment,
  type ThreatHuntResult,
  type EnvironmentScan,
  type AttackTrace,
  type DecoyField,
  type Fortification,
  type VulnerabilityAssessment,
  type ServerModel,
} from './PraesidiumModels.js';

import {
  AnalystorHostilis,
  TheoricusLimitis,
  type ThreatPattern,
  type VulnerabilityChain,
  type DefenseTheoryResult,
} from './PraesidiumSolverSynthesizers.js';

// ══════════════════════════════════════════════════════════════════
//  ORCHESTRATION TYPES
// ══════════════════════════════════════════════════════════════════

export interface HouseDefenseCycleResult {
  readonly scans: EnvironmentScan[];
  readonly hunts: ThreatHuntResult[];
  readonly vulnerabilities: VulnerabilityAssessment[];
  readonly patterns: ThreatPattern[];
  readonly chains: VulnerabilityChain[];
  readonly theories: DefenseTheoryResult[];
  readonly timestamp: number;
}

export interface DefendedEndpoint {
  readonly endpoint: EndpointRecord;
  readonly scan: EnvironmentScan | null;
  readonly fortification: Fortification | null;
}

export interface InterceptionOrchestration {
  readonly engaged: boolean;
  readonly combatResult: CombatResult | null;
  readonly trace: AttackTrace | null;
  readonly crusaderDeployed: string | null;
}

export interface DeceptionOrchestration {
  readonly honeypot: HoneypotField;
  readonly decoyField: DecoyField | null;
}

export interface FortificationOrchestration {
  readonly endpoint: EndpointRecord | null;
  readonly fortification: Fortification | null;
  readonly shield: ShieldDeployment | null;
}

export interface HouseStatus {
  readonly name: string;
  readonly designation: string;
  readonly lex: PraesidiumLex;
  readonly total_intelligences: number;
  readonly total_sub_models: number;
  readonly components: {
    readonly core: ReturnType<PraesidiumIntelligence['status']>;
    readonly bellator: ServerModel;
    readonly explorator: ServerModel;
    readonly fabricator: ServerModel;
    readonly analystor: { readonly name: string; readonly patterns: number };
    readonly theoricus: { readonly name: string; readonly theories: number };
  };
  readonly divisions: string[];
  readonly substrates: DefenseSubstrate[];
  readonly active_threats: number;
  readonly generation: number;
}

// ══════════════════════════════════════════════════════════════════
//  DOMUS PRAESIDIUM — The Living Defense House
// ══════════════════════════════════════════════════════════════════

export class DomusPraesidium {
  private readonly core: PraesidiumIntelligence;
  private readonly bellator: BellatorModel;
  private readonly explorator: ExploratorModel;
  private readonly fabricator: FabricatorModel;
  private readonly analystor: AnalystorHostilis;
  private readonly theoricus: TheoricusLimitis;

  constructor() {
    this.core = new PraesidiumIntelligence();
    this.bellator = new BellatorModel();
    this.explorator = new ExploratorModel();
    this.fabricator = new FabricatorModel();
    this.analystor = new AnalystorHostilis();
    this.theoricus = new TheoricusLimitis();
  }

  // ── Full Defense Cycle ──────────────────────────────────────────

  runFullDefenseCycle(): HouseDefenseCycleResult {
    const endpoints = this.core.endpoints;
    const events = this.core.defenseEvents;

    // 1. Scan all endpoint routes via EXPLORATOR
    const routes = endpoints.map(ep => ep.route);
    const scans = this.explorator.scanEnvironment(routes);

    // 2. Hunt threats across all endpoints via BELLATOR
    const hunts = this.bellator.huntThreats(endpoints);

    // 3. Measure vulnerability surface for each endpoint via FABRICATOR
    const vulnerabilities = endpoints.map(ep =>
      this.fabricator.measureVulnerability(ep),
    );

    // 4. Synthesize cross-division patterns via ANALYSTOR
    const patterns = this.analystor.synthesize(endpoints, events);

    // 5. Detect vulnerability chains via ANALYSTOR
    const chains = this.analystor.detectVulnerabilityChains(endpoints);

    // 6. Test all defense hypotheses via THEORICUS
    const theories = this.theoricus.testAllHypotheses(endpoints, events);

    return {
      scans,
      hunts,
      vulnerabilities,
      patterns,
      chains,
      theories,
      timestamp: Date.now(),
    };
  }

  // ── Register & Defend ───────────────────────────────────────────

  registerAndDefend(
    name: string,
    route: string,
    adopted: boolean,
  ): DefendedEndpoint {
    // Register endpoint via core SENTINEL division
    const endpoint = this.core.registerEndpoint(name, route, adopted);

    // Initial patrol to establish baseline
    this.core.patrol(endpoint.id, 0.0, 0.0);

    // Scan the route via EXPLORATOR
    const scans = this.explorator.scanEnvironment([route]);
    const scan = scans.length > 0 ? scans[0] : null;

    // Build fortification via FABRICATOR
    const fortification = this.fabricator.buildFortification(endpoint.id);

    return { endpoint, scan, fortification };
  }

  // ── Orchestrate Interception ────────────────────────────────────

  orchestrateInterception(
    endpointId: number,
    tier: ThreatTier,
  ): InterceptionOrchestration {
    let crusaderDeployed: string | null = null;

    // Deploy a crusader unit for elevated threats (T2+)
    const tierIdx = this.tierToIndex(tier);
    if (tierIdx >= 2) {
      const unit = this.core.deployCrusader(
        `CRUSADER-${tier}-${Date.now()}`,
        'crusader',
      );
      crusaderDeployed = unit.name;
      this.core.intercept(unit.id, endpointId);
    }

    // Engage threat via BELLATOR combat systems
    const combatResult = this.bellator.engageThreat(endpointId, tier);

    // Trace attack origin via EXPLORATOR
    const trace = this.explorator.traceAttack(endpointId);

    return {
      engaged: combatResult.engaged,
      combatResult,
      trace,
      crusaderDeployed,
    };
  }

  // ── Deploy Deception Field ──────────────────────────────────────

  deployDeceptionField(
    route: string,
    lures: number,
  ): DeceptionOrchestration {
    // Deploy honeypot via core HONEYPOT division
    const honeypot = this.core.deployHoneypot(
      `HONEYPOT-${route}-${Date.now()}`,
      route,
      lures,
    );

    // Deploy decoy field via EXPLORATOR DECEPTOR sub-model
    const decoyField = this.explorator.deployDecoys(route, lures);

    return { honeypot, decoyField };
  }

  // ── Harden & Fortify ────────────────────────────────────────────

  hardenAndFortify(endpointId: number): FortificationOrchestration {
    // Harden via core AEGIS division
    const endpoint = this.core.harden(endpointId);

    // Build deep fortification via FABRICATOR
    const fortification = endpoint
      ? this.fabricator.buildFortification(endpointId)
      : null;

    // Deploy shield layers via BELLATOR
    const shield = endpoint
      ? this.bellator.deployShield(endpointId, endpoint.armorLevel)
      : null;

    return { endpoint, fortification, shield };
  }

  // ── House Status ────────────────────────────────────────────────

  houseStatus(): HouseStatus {
    const coreStatus = this.core.status();
    const bellatorStatus = this.bellator.status();
    const exploratorStatus = this.explorator.status();
    const fabricatorStatus = this.fabricator.status();

    // Count all sub-intelligences:
    // Core: 5 divisions (CRUSADER, HONEYPOT, SENTINEL, AEGIS, UMBRA)
    // Bellator: 5 sub-models
    // Explorator: 5 sub-models
    // Fabricator: 5 sub-models
    // Analystor: 1 solver engine
    // Theoricus: 1 solver engine
    const totalSubModels =
      bellatorStatus.subModels.length +
      exploratorStatus.subModels.length +
      fabricatorStatus.subModels.length;

    // 6 intelligence layers, 5 core divisions + 15 server sub-models + 2 solvers = 22
    const totalIntelligences = 5 + totalSubModels + 2;

    // Count active threats (endpoints with tier >= T1)
    const activeThreats = this.core.endpoints.filter(
      ep => ep.tier !== 'T0_None',
    ).length;

    return {
      name: 'DOMUS PRAESIDIUM',
      designation: this.core.designation,
      lex: LEX_PRAESIDIUM_001,
      total_intelligences: totalIntelligences,
      total_sub_models: totalSubModels,
      components: {
        core: coreStatus,
        bellator: bellatorStatus,
        explorator: exploratorStatus,
        fabricator: fabricatorStatus,
        analystor: {
          name: this.analystor.name,
          patterns: this.analystor.getResults().length,
        },
        theoricus: {
          name: this.theoricus.name,
          theories: this.theoricus.getTheories().length,
        },
      },
      divisions: coreStatus.divisions,
      substrates: coreStatus.substrates as unknown as DefenseSubstrate[],
      active_threats: activeThreats,
      generation: coreStatus.generation,
    };
  }

  // ── Helpers ─────────────────────────────────────────────────────

  private tierToIndex(tier: ThreatTier): number {
    const map: Record<ThreatTier, number> = {
      'T0_None': 0,
      'T1_Probe': 1,
      'T2_Intrusion': 2,
      'T3_Corruption': 3,
      'T4_Hijack': 4,
      'T5_Swarm': 5,
      'T6_AntiOrganism': 6,
      'T7_Existential': 7,
    };
    return map[tier];
  }
}
