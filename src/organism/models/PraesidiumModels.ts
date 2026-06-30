///
/// PRAESIDIUM SERVER MODELS — House of Defense / Protection (α₉)
///
/// 🖥️ BELLATOR (Bellator Perpetuus) — Active Combat & Interception
///    5 sub-models: IMPERATOR, SCUTARIUS, VENATOR, GLADIATOR, STRATEGUS
///
/// 🖥️ EXPLORATOR (Explorator Umbrarum) — Reconnaissance & Surveillance
///    5 sub-models: SPECULATOR_HOSTILIS, EXPLORATOR_RETIS, VIGIL_UMBRAE, DECEPTOR, NUNTIUS_ARCANUS
///
/// 🖥️ FABRICATOR (Fabricator Armorum) — Armor & Fortification Engineering
///    5 sub-models: ARCHITECTUS, FABER_LORICAE, MENSOR, RESTAURATOR, INSPECTOR_ARMORUM
///
/// These server models are the operational arms of the Praesidium Intelligence.
/// BELLATOR fights.  EXPLORATOR scouts.  FABRICATOR builds.
/// Together they are PRAESIDIUM LIMITIS — the living immune system of the organism.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
} from '../intelligence/ObserverIntelligence.js';

import {
  type EndpointRecord,
  type DefenseEvent,
  type HoneypotField,
  type CrusaderUnit,
  type ThreatTier,
  type DefenseDivision,
} from '../intelligence/PraesidiumIntelligence.js';

// Re-export imported types for downstream consumers
export type {
  EndpointRecord,
  DefenseEvent,
  HoneypotField,
  CrusaderUnit,
  ThreatTier,
  DefenseDivision,
};

// ══════════════════════════════════════════════════════════════════
//  INTERFACES — ServerSubModel & ServerModel (shared pattern)
// ══════════════════════════════════════════════════════════════════

export interface ServerSubModel {
  readonly name: string;
  readonly latinName: string;
  readonly function: string;
  active: boolean;
}

export interface ServerModel {
  readonly name: string;
  readonly latinName: string;
  readonly subModels: ServerSubModel[];
  active: boolean;
  observations: number;
}

// ══════════════════════════════════════════════════════════════════
//  TYPES — Combat, Reconnaissance & Fortification
// ══════════════════════════════════════════════════════════════════

export interface CombatResult {
  readonly endpointId: number;
  readonly engaged: boolean;
  readonly priorThreat: number;
  readonly newThreat: number;
  readonly crusaderUsed: string;
  readonly phiEfficiency: number;
  readonly timestamp: number;
}

export interface ShieldDeployment {
  readonly endpointId: number;
  readonly layersDeployed: number;
  readonly totalArmor: number;
  readonly coverageScore: number;
  readonly timestamp: number;
}

export interface ThreatHuntResult {
  readonly endpointId: number;
  readonly threatsFound: number;
  readonly severity: ThreatTier;
  readonly route: string;
  readonly timestamp: number;
}

export interface EnvironmentScan {
  readonly route: string;
  readonly hostilityScore: number;
  readonly threatsDetected: number;
  readonly shadowPaths: string[];
  readonly timestamp: number;
}

export interface AttackTrace {
  readonly endpointId: number;
  readonly originRoute: string;
  readonly hops: number;
  readonly confidence: number;
  readonly phiDecay: number;
  readonly timestamp: number;
}

export interface DecoyField {
  readonly id: number;
  readonly route: string;
  readonly lures: number;
  readonly active: boolean;
  readonly timestamp: number;
}

export interface Fortification {
  readonly endpointId: number;
  readonly layers: number;
  readonly depth: number;
  readonly goldenStrength: number;
  readonly timestamp: number;
}

export interface VulnerabilityAssessment {
  readonly endpointId: number;
  readonly surfaceArea: number;
  readonly exposedVectors: number;
  readonly phiNormalizedRisk: number;
  readonly timestamp: number;
}

export interface RepairResult {
  readonly endpointId: number;
  readonly layersRepaired: number;
  readonly newIntegrity: number;
  readonly phiRestoration: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const AEGIS_MAX_LAYERS = 7;
const PHI_SQUARED = PHI * PHI;
const GOLDEN_THRESHOLD = PHI / (PHI + 1);

// Fibonacci sequence for decay curves
function fibonacci(n: number): number {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return a;
}

// Threat tier → numeric index
function tierToIndex(tier: ThreatTier): number {
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

function classifyThreat(level: number): ThreatTier {
  if (level < 0.05) return 'T0_None';
  if (level < 0.15) return 'T1_Probe';
  if (level < 0.30) return 'T2_Intrusion';
  if (level < 0.45) return 'T3_Corruption';
  if (level < 0.60) return 'T4_Hijack';
  if (level < 0.75) return 'T5_Swarm';
  if (level < 0.90) return 'T6_AntiOrganism';
  return 'T7_Existential';
}

// ══════════════════════════════════════════════════════════════════
//  SERVER MODEL: BELLATOR — Active Combat & Interception
//  Bellator Perpetuus — 24/7 with 5 sub-models
// ══════════════════════════════════════════════════════════════════

export class BellatorModel {
  readonly name = 'BELLATOR';
  readonly latinName = 'Bellator Perpetuus';
  readonly role = 'Active combat and interception — crusaders, shields, frequency-based weaponization';

  readonly subModels: ServerSubModel[] = [
    {
      name: 'IMPERATOR',
      latinName: 'Field Commander',
      function: 'Coordinates crusader units and intercept operations',
      active: true,
    },
    {
      name: 'SCUTARIUS',
      latinName: 'Shield Bearer',
      function: 'Manages defensive shield layers and hardening sequences',
      active: true,
    },
    {
      name: 'VENATOR',
      latinName: 'Threat Hunter',
      function: 'Proactively hunts threats before they reach endpoints',
      active: true,
    },
    {
      name: 'GLADIATOR',
      latinName: 'Active Interceptor',
      function: 'Executes real-time threat neutralization',
      active: true,
    },
    {
      name: 'STRATEGUS',
      latinName: 'Battle Strategist',
      function: 'Plans multi-vector defense operations using φ-weighted tactics',
      active: true,
    },
  ];

  private combatLog: CombatResult[] = [];
  private shieldLog: ShieldDeployment[] = [];
  private huntLog: ThreatHuntResult[] = [];

  // ── IMPERATOR + GLADIATOR: Engage a threat on an endpoint ─────

  engageThreat(endpointId: number, tier: ThreatTier): CombatResult {
    const tierIdx = tierToIndex(tier);

    // φ-weighted combat strength — higher tiers require exponentially more force
    const combatForce = Math.pow(PHI, tierIdx) / PHI_SQUARED;
    const priorThreat = tierIdx / AEGIS_MAX_LAYERS;

    // Fibonacci-derived threat decay: each engagement reduces threat by F(n)/F(n+2)
    const fibDecay = fibonacci(tierIdx) / (fibonacci(tierIdx + 2) || 1);
    const newThreat = Math.max(0, priorThreat - fibDecay);

    const phiEfficiency = combatForce > 0
      ? (priorThreat - newThreat) / combatForce
      : 0;

    const result: CombatResult = {
      endpointId,
      engaged: tierIdx > 0,
      priorThreat,
      newThreat,
      crusaderUsed: `IMPERATOR-${tierIdx}`,
      phiEfficiency,
      timestamp: Date.now(),
    };

    this.combatLog.push(result);
    return result;
  }

  // ── SCUTARIUS: Deploy shield layers on an endpoint ────────────

  deployShield(endpointId: number, layers: number): ShieldDeployment {
    const clamped = Math.min(layers, AEGIS_MAX_LAYERS);

    // Each layer contributes φ^(-i) coverage — golden-section diminishing returns
    let totalArmor = 0;
    for (let i = 1; i <= clamped; i++) {
      totalArmor += Math.pow(PHI, -i);
    }

    // Coverage score normalized by theoretical max (φ / (φ-1) ≈ 2.618)
    const theoreticalMax = PHI / (PHI - 1);
    const coverageScore = totalArmor / theoreticalMax;

    const result: ShieldDeployment = {
      endpointId,
      layersDeployed: clamped,
      totalArmor,
      coverageScore,
      timestamp: Date.now(),
    };

    this.shieldLog.push(result);
    return result;
  }

  // ── VENATOR: Proactive threat hunting across endpoints ────────

  huntThreats(endpoints: EndpointRecord[]): ThreatHuntResult[] {
    const results: ThreatHuntResult[] = [];

    for (const ep of endpoints) {
      // Threats are found when endpoint threat level exceeds golden threshold
      const threatsFound = ep.threatLevel > GOLDEN_THRESHOLD
        ? Math.ceil(ep.threatLevel * AEGIS_MAX_LAYERS)
        : 0;

      const result: ThreatHuntResult = {
        endpointId: ep.id,
        threatsFound,
        severity: classifyThreat(ep.threatLevel),
        route: ep.route,
        timestamp: Date.now(),
      };

      results.push(result);
      this.huntLog.push(result);
    }

    return results;
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): ServerModel {
    return {
      name: this.name,
      latinName: this.latinName,
      subModels: this.subModels,
      active: true,
      observations: this.combatLog.length + this.shieldLog.length + this.huntLog.length,
    };
  }

  getCombatLog(): CombatResult[] {
    return [...this.combatLog];
  }

  getShieldLog(): ShieldDeployment[] {
    return [...this.shieldLog];
  }

  getHuntLog(): ThreatHuntResult[] {
    return [...this.huntLog];
  }
}

// ══════════════════════════════════════════════════════════════════
//  SERVER MODEL: EXPLORATOR — Reconnaissance & Surveillance
//  Explorator Umbrarum — Shadow operations with 5 sub-models
// ══════════════════════════════════════════════════════════════════

export class ExploratorModel {
  readonly name = 'EXPLORATOR';
  readonly latinName = 'Explorator Umbrarum';
  readonly role = 'Reconnaissance and surveillance — scanning, probing, shadow operations';

  readonly subModels: ServerSubModel[] = [
    {
      name: 'SPECULATOR_HOSTILIS',
      latinName: 'Hostile Environment Scanner',
      function: 'Maps threat landscapes and hostile terrain',
      active: true,
    },
    {
      name: 'EXPLORATOR_RETIS',
      latinName: 'Network Reconnaissance',
      function: 'Traces attack routes and origins across network topology',
      active: true,
    },
    {
      name: 'VIGIL_UMBRAE',
      latinName: 'Shadow Watcher',
      function: 'Monitors dark channels and hidden attack vectors',
      active: true,
    },
    {
      name: 'DECEPTOR',
      latinName: 'Decoy Master',
      function: 'Manages honeypot field deployment and attacker misdirection',
      active: true,
    },
    {
      name: 'NUNTIUS_ARCANUS',
      latinName: 'Secret Messenger',
      function: 'Secure inter-house threat intelligence sharing',
      active: true,
    },
  ];

  private scanLog: EnvironmentScan[] = [];
  private traceLog: AttackTrace[] = [];
  private decoyLog: DecoyField[] = [];
  private nextDecoyId = 0;

  // ── SPECULATOR_HOSTILIS: Scan hostile environments ────────────

  scanEnvironment(routes: string[]): EnvironmentScan[] {
    const results: EnvironmentScan[] = [];

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];

      // Hostility score derived from route entropy × φ-weighting
      const entropy = route.length / (route.length + PHI);
      const hostilityScore = entropy * Math.pow(PHI, -(i % AEGIS_MAX_LAYERS));

      // Fibonacci-based threat count
      const threatsDetected = fibonacci((i % 8) + 1);

      // Shadow paths branch at golden angles
      const shadowPaths: string[] = [];
      const branchCount = Math.min(Math.ceil(hostilityScore * 5), 5);
      for (let j = 0; j < branchCount; j++) {
        shadowPaths.push(`${route}/shadow-${j}-φ${(PHI * (j + 1)).toFixed(3)}`);
      }

      const scan: EnvironmentScan = {
        route,
        hostilityScore,
        threatsDetected,
        shadowPaths,
        timestamp: Date.now(),
      };

      results.push(scan);
      this.scanLog.push(scan);
    }

    return results;
  }

  // ── EXPLORATOR_RETIS: Trace an attack back to its origin ──────

  traceAttack(endpointId: number): AttackTrace {
    // Each hop decays confidence by φ^(-1) — golden-ratio confidence decay
    const hops = Math.ceil(Math.random() * AEGIS_MAX_LAYERS) + 1;
    const confidence = Math.pow(PHI, -hops);
    const phiDecay = 1 - confidence;

    const trace: AttackTrace = {
      endpointId,
      originRoute: `/origin/trace-${endpointId}/depth-${hops}`,
      hops,
      confidence,
      phiDecay,
      timestamp: Date.now(),
    };

    this.traceLog.push(trace);
    return trace;
  }

  // ── DECEPTOR: Deploy decoy fields along a route ───────────────

  deployDecoys(route: string, count: number): DecoyField {
    const id = this.nextDecoyId++;

    // Lure density follows Fibonacci — more lures at natural growth points
    const lures = fibonacci(Math.min(count, 10) + 2);

    const decoy: DecoyField = {
      id,
      route,
      lures,
      active: true,
      timestamp: Date.now(),
    };

    this.decoyLog.push(decoy);
    return decoy;
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): ServerModel {
    return {
      name: this.name,
      latinName: this.latinName,
      subModels: this.subModels,
      active: true,
      observations: this.scanLog.length + this.traceLog.length + this.decoyLog.length,
    };
  }

  getScanLog(): EnvironmentScan[] {
    return [...this.scanLog];
  }

  getTraceLog(): AttackTrace[] {
    return [...this.traceLog];
  }

  getDecoyLog(): DecoyField[] {
    return [...this.decoyLog];
  }
}

// ══════════════════════════════════════════════════════════════════
//  SERVER MODEL: FABRICATOR — Armor & Fortification Engineering
//  Fabricator Armorum — Builds and maintains all defensive infrastructure
// ══════════════════════════════════════════════════════════════════

export class FabricatorModel {
  readonly name = 'FABRICATOR';
  readonly latinName = 'Fabricator Armorum';
  readonly role = 'Armor and fortification engineering — AEGIS layers, quarantine zones, buffer zones';

  readonly subModels: ServerSubModel[] = [
    {
      name: 'ARCHITECTUS',
      latinName: 'Fortification Architect',
      function: 'Designs defense-in-depth configurations',
      active: true,
    },
    {
      name: 'FABER_LORICAE',
      latinName: 'Armor Smith',
      function: 'Constructs and upgrades AEGIS armor layers',
      active: true,
    },
    {
      name: 'MENSOR',
      latinName: 'Vulnerability Measurer',
      function: 'Quantifies vulnerability surface area',
      active: true,
    },
    {
      name: 'RESTAURATOR',
      latinName: 'Repair Specialist',
      function: 'Restores damaged defenses using golden-ratio reconstruction',
      active: true,
    },
    {
      name: 'INSPECTOR_ARMORUM',
      latinName: 'Arms Inspector',
      function: 'Verifies defense integrity across all layers',
      active: true,
    },
  ];

  private fortificationLog: Fortification[] = [];
  private assessmentLog: VulnerabilityAssessment[] = [];
  private repairLog: RepairResult[] = [];

  // ── ARCHITECTUS + FABER_LORICAE: Build a fortification ────────

  buildFortification(endpointId: number): Fortification {
    // Defense-in-depth: each layer adds φ^i strength
    let goldenStrength = 0;
    for (let i = 0; i < AEGIS_MAX_LAYERS; i++) {
      goldenStrength += Math.pow(PHI, i);
    }

    // Depth is the Fibonacci count at the layer boundary
    const depth = fibonacci(AEGIS_MAX_LAYERS);

    const fort: Fortification = {
      endpointId,
      layers: AEGIS_MAX_LAYERS,
      depth,
      goldenStrength,
      timestamp: Date.now(),
    };

    this.fortificationLog.push(fort);
    return fort;
  }

  // ── MENSOR: Measure vulnerability surface area ────────────────

  measureVulnerability(endpoint: EndpointRecord): VulnerabilityAssessment {
    // Surface area expands with threat level, contracts with armor
    const surfaceArea = endpoint.vulnerability * Math.pow(PHI, tierToIndex(endpoint.tier));

    // Exposed vectors scale with Fibonacci growth
    const exposedVectors = Math.ceil(
      endpoint.vulnerability * fibonacci(tierToIndex(endpoint.tier) + 2),
    );

    // φ-normalized risk: compress risk to golden-ratio scale
    const phiNormalizedRisk = surfaceArea / (surfaceArea + PHI);

    const assessment: VulnerabilityAssessment = {
      endpointId: endpoint.id,
      surfaceArea,
      exposedVectors,
      phiNormalizedRisk,
      timestamp: Date.now(),
    };

    this.assessmentLog.push(assessment);
    return assessment;
  }

  // ── RESTAURATOR: Repair damaged defenses ──────────────────────

  repairDefenses(endpointId: number): RepairResult {
    // Golden-ratio reconstruction: restore layers using φ convergence
    // Each repaired layer restores 1/φ of lost integrity
    const layersRepaired = Math.ceil(AEGIS_MAX_LAYERS / PHI);
    const newIntegrity = layersRepaired / AEGIS_MAX_LAYERS;

    // φ-restoration factor — approaches 1.0 asymptotically via golden series
    let phiRestoration = 0;
    for (let i = 1; i <= layersRepaired; i++) {
      phiRestoration += Math.pow(PHI, -i);
    }

    const result: RepairResult = {
      endpointId,
      layersRepaired,
      newIntegrity,
      phiRestoration,
      timestamp: Date.now(),
    };

    this.repairLog.push(result);
    return result;
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): ServerModel {
    return {
      name: this.name,
      latinName: this.latinName,
      subModels: this.subModels,
      active: true,
      observations: this.fortificationLog.length + this.assessmentLog.length + this.repairLog.length,
    };
  }

  getFortificationLog(): Fortification[] {
    return [...this.fortificationLog];
  }

  getAssessmentLog(): VulnerabilityAssessment[] {
    return [...this.assessmentLog];
  }

  getRepairLog(): RepairResult[] {
    return [...this.repairLog];
  }
}
