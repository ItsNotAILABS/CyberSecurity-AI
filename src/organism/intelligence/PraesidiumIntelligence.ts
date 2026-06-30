///
/// PRAESIDIUM INTELLIGENCE — House of Defense / Protection (α₉)
///
/// PRAESIDIUM LIMITIS — The Shield of the Boundary
///
/// TypeScript organism intelligence layer for the Defense House.
/// The Motoko canister (src/organisms/praesidium/main.mo) is the substrate
/// expression.  This file is the intelligence expression.  Together they
/// form one organism — PRAESIDIUM.
///
/// Defense preserves the boundary integrity of the organism.
///
/// LEX PRAESIDIUM-001 — Immutable:
///   "The organism walks a hostile substrate.  Every route is contested,
///    every endpoint is a surface, every channel carries risk.  Defense
///    is not paranoia.  Defense is the organism's immune system — always
///    active, never optional."
///
/// Divisions:
///   CRUSADER  — Active defenders, adversarial traffic screening
///   HONEYPOT  — Deception fields, decoy deployment, attacker misdirection
///   SENTINEL  — Endpoint verification, route integrity, corruption scanning
///   AEGIS     — Armor layers, threat tiers, boundary hardening
///   UMBRA     — Shadow routing, clone protection, covert defense channels
///
/// Formula: D(x) = Σᵢ φ^(tᵢ) × T(xᵢ) × (1 − V(xᵢ))
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS — Defense Thresholds
// ══════════════════════════════════════════════════════════════════

const ARMOR_LAYERS = 7;  // Per AEGIS Defense Platform spec

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type ThreatTier =
  | 'T0_None'         // No detected threat
  | 'T1_Probe'        // Scanning / reconnaissance
  | 'T2_Intrusion'    // Active intrusion attempt
  | 'T3_Corruption'   // Data corruption / poisoning
  | 'T4_Hijack'       // Node or route hijack
  | 'T5_Swarm'        // Coordinated swarm attack
  | 'T6_AntiOrganism' // Anti-organism weaponized attack
  | 'T7_Existential'; // Existential threat to organism survival

export type DefenseDivision =
  | 'crusader'  // Active defenders
  | 'honeypot'  // Deception fields
  | 'sentinel'  // Endpoint verification
  | 'aegis'     // Armor and hardening
  | 'umbra';    // Shadow routing

export type DefenseSubstrate =
  | 'doctrine'  // Policy layer
  | 'frontend'  // Interface layer
  | 'backend'   // Runtime layer
  | 'chain'     // Deployment layer
  | 'external'  // External routing layer
  | 'recovery'; // Recovery / escalation layer

export interface EndpointRecord {
  readonly id: number;
  readonly name: string;
  readonly route: string;
  readonly adopted: boolean;
  threatLevel: number;     // 0.0 – 1.0
  vulnerability: number;   // 0.0 – 1.0
  tier: ThreatTier;
  armorLevel: number;      // 0 – 7 (AEGIS layers active)
  defenseScore: number;    // D(x) = φ^t × T × (1−V)
  lastPatrol: number;
  interceptions: number;
  readonly timestamp: number;
}

export interface DefenseEvent {
  readonly id: number;
  readonly endpointId: number;
  readonly division: DefenseDivision;
  readonly substrate: DefenseSubstrate;
  readonly action: string;
  readonly threatBefore: number;
  readonly threatAfter: number;
  readonly timestamp: number;
}

export interface HoneypotField {
  readonly id: number;
  readonly name: string;
  readonly route: string;
  active: boolean;
  readonly lures: number;
  captures: number;
  readonly timestamp: number;
}

export interface CrusaderUnit {
  readonly id: number;
  readonly name: string;
  readonly division: DefenseDivision;
  readonly strength: number; // φ-weighted combat strength
  deployments: number;
  interceptions: number;
  active: boolean;
  readonly timestamp: number;
}

export interface PraesidiumLex {
  readonly code: string;
  readonly text: string;
  readonly immutable: true;
}

// ══════════════════════════════════════════════════════════════════
//  LEX PRAESIDIUM-001 — THE IMMUTABLE LAW
// ══════════════════════════════════════════════════════════════════

export const LEX_PRAESIDIUM_001: PraesidiumLex = {
  code: 'LEX PRAESIDIUM-001',
  text:
    'The organism walks a hostile substrate. Every route is contested, ' +
    'every endpoint is a surface, every channel carries risk. Defense ' +
    'is not paranoia. Defense is the organism\'s immune system — always ' +
    'active, never optional.',
  immutable: true,
};

// ══════════════════════════════════════════════════════════════════
//  PRAESIDIUM INTELLIGENCE — The Living Organism
// ══════════════════════════════════════════════════════════════════

export class PraesidiumIntelligence {
  readonly name = 'PRAESIDIUM LIMITIS';
  readonly designation =
    'House of Defense / Protection — The Shield of the Boundary — preserves the boundary integrity of the organism';

  readonly endpoints: EndpointRecord[] = [];
  readonly defenseEvents: DefenseEvent[] = [];
  readonly honeypots: HoneypotField[] = [];
  readonly crusaders: CrusaderUnit[] = [];
  readonly lex: PraesidiumLex = LEX_PRAESIDIUM_001;

  private nextEndpointId = 0;
  private nextEventId = 0;
  private nextHoneypotId = 0;
  private nextCrusaderId = 0;
  private totalInterceptions = 0;
  private generation = 0;

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: SENTINEL — Endpoint Verification & Route Integrity
  // ══════════════════════════════════════════════════════════════════

  /** Register an endpoint for defense coverage. */
  registerEndpoint(name: string, route: string, adopted: boolean): EndpointRecord {
    const id = this.nextEndpointId++;

    const record: EndpointRecord = {
      id,
      name,
      route,
      adopted,
      threatLevel: 0.0,
      vulnerability: 0.0,
      tier: 'T0_None',
      armorLevel: 1, // Base armor
      defenseScore: 0.0,
      lastPatrol: Date.now(),
      interceptions: 0,
      timestamp: Date.now(),
    };

    this.endpoints.push(record);

    if (this.isFibonacci(this.endpoints.length)) {
      this.generation++;
    }

    return record;
  }

  /** Patrol an endpoint — update threat level and vulnerability. */
  patrol(endpointId: number, threatLevel: number, vulnerability: number): EndpointRecord | null {
    const ep = this.endpoints.find(e => e.id === endpointId);
    if (!ep) return null;

    const threatBefore = ep.threatLevel;
    ep.threatLevel = threatLevel;
    ep.vulnerability = vulnerability;
    ep.tier = this.classifyThreat(threatLevel);
    ep.defenseScore = Math.pow(PHI, this.tierToIndex(ep.tier)) * threatLevel * (1 - vulnerability);
    ep.lastPatrol = Date.now();

    this.defenseEvents.push({
      id: this.nextEventId++,
      endpointId,
      division: 'sentinel',
      substrate: 'external',
      action: `Patrol: threat=${threatLevel.toFixed(4)} vuln=${vulnerability.toFixed(4)} tier=${ep.tier}`,
      threatBefore,
      threatAfter: threatLevel,
      timestamp: Date.now(),
    });

    return ep;
  }

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: AEGIS — Armor Layers & Boundary Hardening
  // ══════════════════════════════════════════════════════════════════

  /** Harden an endpoint — increase armor layer (up to 7). */
  harden(endpointId: number): EndpointRecord | null {
    const ep = this.endpoints.find(e => e.id === endpointId);
    if (!ep) return null;

    if (ep.armorLevel < ARMOR_LAYERS) {
      ep.armorLevel++;
    }

    // Each armor layer reduces effective vulnerability by golden ratio
    ep.vulnerability = ep.vulnerability / Math.pow(PHI, ep.armorLevel);
    ep.defenseScore = Math.pow(PHI, this.tierToIndex(ep.tier)) *
                      ep.threatLevel * (1 - ep.vulnerability);

    this.defenseEvents.push({
      id: this.nextEventId++,
      endpointId,
      division: 'aegis',
      substrate: 'backend',
      action: `Hardened — armor=${ep.armorLevel}/${ARMOR_LAYERS}`,
      threatBefore: ep.threatLevel,
      threatAfter: ep.threatLevel,
      timestamp: Date.now(),
    });

    return ep;
  }

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: CRUSADER — Active Defenders
  // ══════════════════════════════════════════════════════════════════

  /** Deploy a crusader unit. */
  deployCrusader(unitName: string, division: DefenseDivision): CrusaderUnit {
    const id = this.nextCrusaderId++;
    const strength = Math.pow(PHI, -id) * ARMOR_LAYERS;

    const unit: CrusaderUnit = {
      id,
      name: unitName,
      division,
      strength,
      deployments: 1,
      interceptions: 0,
      active: true,
      timestamp: Date.now(),
    };

    this.crusaders.push(unit);
    return unit;
  }

  /** Intercept a threat on an endpoint using a crusader. */
  intercept(crusaderId: number, endpointId: number): boolean {
    const crusader = this.crusaders.find(c => c.id === crusaderId && c.active);
    const ep = this.endpoints.find(e => e.id === endpointId);
    if (!crusader || !ep) return false;

    const threatBefore = ep.threatLevel;
    const reduction = Math.min(crusader.strength / ARMOR_LAYERS, ep.threatLevel);
    ep.threatLevel -= reduction;
    ep.tier = this.classifyThreat(ep.threatLevel);
    ep.interceptions++;

    crusader.deployments++;
    crusader.interceptions++;
    this.totalInterceptions++;

    this.defenseEvents.push({
      id: this.nextEventId++,
      endpointId,
      division: 'crusader',
      substrate: 'external',
      action: `Intercepted by "${crusader.name}" — threat ${threatBefore.toFixed(4)} → ${ep.threatLevel.toFixed(4)}`,
      threatBefore,
      threatAfter: ep.threatLevel,
      timestamp: Date.now(),
    });

    return true;
  }

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: HONEYPOT — Deception Fields
  // ══════════════════════════════════════════════════════════════════

  /** Deploy a honeypot field along a route. */
  deployHoneypot(fieldName: string, route: string, lures: number): HoneypotField {
    const field: HoneypotField = {
      id: this.nextHoneypotId++,
      name: fieldName,
      route,
      active: true,
      lures,
      captures: 0,
      timestamp: Date.now(),
    };

    this.honeypots.push(field);
    return field;
  }

  /** Record a capture on a honeypot field. */
  honeypotCapture(honeypotId: number): boolean {
    const hp = this.honeypots.find(h => h.id === honeypotId && h.active);
    if (!hp) return false;
    hp.captures++;
    return true;
  }

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: UMBRA — Shadow Routing & Clone Protection
  // ══════════════════════════════════════════════════════════════════

  /** Get all endpoints with elevated or higher threat tiers. */
  shadowWatch(): EndpointRecord[] {
    return this.endpoints.filter(ep => this.tierToIndex(ep.tier) >= 2);
  }

  /** Get all adopted endpoints under defense coverage. */
  adoptedEndpoints(): EndpointRecord[] {
    return this.endpoints.filter(ep => ep.adopted);
  }

  // ══════════════════════════════════════════════════════════════════
  //  STATUS
  // ══════════════════════════════════════════════════════════════════

  status() {
    return {
      name: this.name,
      designation: this.designation,
      initialized: true,
      total_endpoints: this.endpoints.length,
      adopted_endpoints: this.endpoints.filter(ep => ep.adopted).length,
      total_crusaders: this.crusaders.length,
      total_honeypots: this.honeypots.length,
      total_interceptions: this.totalInterceptions,
      total_defense_events: this.defenseEvents.length,
      generation: this.generation,
      divisions: ['CRUSADER', 'HONEYPOT', 'SENTINEL', 'AEGIS', 'UMBRA'],
      substrates: ['doctrine', 'frontend', 'backend', 'chain', 'external', 'recovery'],
    };
  }

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  private classifyThreat(level: number): ThreatTier {
    if (level < 0.05) return 'T0_None';
    if (level < 0.15) return 'T1_Probe';
    if (level < 0.30) return 'T2_Intrusion';
    if (level < 0.45) return 'T3_Corruption';
    if (level < 0.60) return 'T4_Hijack';
    if (level < 0.75) return 'T5_Swarm';
    if (level < 0.90) return 'T6_AntiOrganism';
    return 'T7_Existential';
  }

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
