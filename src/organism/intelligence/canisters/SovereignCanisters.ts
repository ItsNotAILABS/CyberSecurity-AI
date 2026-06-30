///
/// SOVEREIGN ELEMENT CANISTERS — Mathematical Element Intelligences
///
/// These are NOT metaphors. These are real mathematical properties
/// of real elements, used as the foundation of real AI canisters.
///
/// Gold (AU, Z=79): Does not corrode → immutable state canister
/// Silver (AG, Z=47): Best conductor → fastest message passing canister
/// Crimson (abstract): Blood-red wavelength → living organism canister
///
/// Plus: Full periodic table elements as intelligence substrates.
///
/// The math IS the element. The element IS the intelligence.
/// The canister IS the substrate.
///
/// Formula: E(x) = Σ(Z × φ^orbital) × density × R(conductivity)
///
/// How this differs from:
///   - ICP Canisters: theirs are generic WASM containers; ours are
///     mathematically grounded in elemental properties
///   - Ethereum Smart Contracts: theirs are gas-metered code execution;
///     ours are physics-grounded computation
///   - Docker Containers: theirs are OS-level isolation; ours are
///     mathematical-level substrate expression
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type CanisterElementId =
  | 'AU' | 'AG' | 'CR'   // Core three
  | 'FE' | 'CU' | 'PT'   // Extension metals
  | 'SI' | 'C'  | 'N'    // Foundation elements
  | 'O'  | 'H'  | 'HE';  // Primordial elements

export interface ElementProperties {
  readonly symbol: string;
  readonly name: string;
  readonly atomicNumber: number;
  readonly atomicWeight: number;
  readonly density: number;           // g/cm³
  readonly electronConfig: string;
  readonly orbitals: number;
  readonly conductivity: number;      // normalized 0-1
  readonly meltingPoint: number;      // Kelvin
  readonly wavelengthNm?: number;     // emission wavelength in nm
}

export interface SovereignCanister {
  readonly id: CanisterElementId;
  readonly element: ElementProperties;
  readonly latinName: string;
  readonly designation: string;
  readonly phiWeight: number;          // atomicWeight × φ^orbitals
  readonly fibonacciIdentity: number;  // fibHash(atomicNumber)
  readonly resonanceFrequency: number; // element-derived oscillation
  readonly dimensionalPlane: number;   // which dimension this canister lives in
  readonly intelligence: CanisterIntelligence;
  readonly canisterType: 'immutable' | 'conductor' | 'living' | 'structural' | 'primordial';
  readonly computeFormula: string;     // E(x) expression
}

export interface CanisterIntelligence {
  readonly name: string;
  readonly purpose: string;
  readonly capabilities: readonly string[];
  readonly mathBasis: string;
}

export interface CanisterComputeResult {
  readonly canisterId: CanisterElementId;
  readonly input: string;
  readonly energyScore: number;       // E(x)
  readonly conductivityFactor: number;
  readonly resonance: number;
  readonly attestation: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  ELEMENT PROPERTIES DATABASE
// ══════════════════════════════════════════════════════════════════

const ELEMENTS: Record<CanisterElementId, ElementProperties> = {
  AU: {
    symbol: 'Au', name: 'Gold', atomicNumber: 79, atomicWeight: 196.967,
    density: 19.3, electronConfig: '[Xe] 4f14 5d10 6s1', orbitals: 6,
    conductivity: 0.71, meltingPoint: 1337.33,
  },
  AG: {
    symbol: 'Ag', name: 'Silver', atomicNumber: 47, atomicWeight: 107.868,
    density: 10.49, electronConfig: '[Kr] 4d10 5s1', orbitals: 5,
    conductivity: 1.0, meltingPoint: 1234.93,   // best conductor
  },
  CR: {
    symbol: 'Cr*', name: 'Crimson', atomicNumber: 0, atomicWeight: 137.508,  // golden angle as atomic weight
    density: PHI, electronConfig: 'φ¹ φ² φ³ φ⁴ φ⁵', orbitals: 5,
    conductivity: 0.618, meltingPoint: 0, wavelengthNm: 680,  // blood-red
  },
  FE: {
    symbol: 'Fe', name: 'Iron', atomicNumber: 26, atomicWeight: 55.845,
    density: 7.874, electronConfig: '[Ar] 3d6 4s2', orbitals: 4,
    conductivity: 0.17, meltingPoint: 1811,
  },
  CU: {
    symbol: 'Cu', name: 'Copper', atomicNumber: 29, atomicWeight: 63.546,
    density: 8.96, electronConfig: '[Ar] 3d10 4s1', orbitals: 4,
    conductivity: 0.97, meltingPoint: 1357.77,
  },
  PT: {
    symbol: 'Pt', name: 'Platinum', atomicNumber: 78, atomicWeight: 195.084,
    density: 21.45, electronConfig: '[Xe] 4f14 5d9 6s1', orbitals: 6,
    conductivity: 0.16, meltingPoint: 2041.4,
  },
  SI: {
    symbol: 'Si', name: 'Silicon', atomicNumber: 14, atomicWeight: 28.086,
    density: 2.33, electronConfig: '[Ne] 3s2 3p2', orbitals: 3,
    conductivity: 0.00001, meltingPoint: 1687,  // semiconductor
  },
  C: {
    symbol: 'C', name: 'Carbon', atomicNumber: 6, atomicWeight: 12.011,
    density: 2.267, electronConfig: '1s2 2s2 2p2', orbitals: 2,
    conductivity: 0.0007, meltingPoint: 3823,   // diamond: hardest structure
  },
  N: {
    symbol: 'N', name: 'Nitrogen', atomicNumber: 7, atomicWeight: 14.007,
    density: 0.00125, electronConfig: '1s2 2s2 2p3', orbitals: 2,
    conductivity: 0, meltingPoint: 63.15,
  },
  O: {
    symbol: 'O', name: 'Oxygen', atomicNumber: 8, atomicWeight: 15.999,
    density: 0.001429, electronConfig: '1s2 2s2 2p4', orbitals: 2,
    conductivity: 0, meltingPoint: 54.36,
  },
  H: {
    symbol: 'H', name: 'Hydrogen', atomicNumber: 1, atomicWeight: 1.008,
    density: 0.00008988, electronConfig: '1s1', orbitals: 1,
    conductivity: 0, meltingPoint: 14.01,       // simplest element
  },
  HE: {
    symbol: 'He', name: 'Helium', atomicNumber: 2, atomicWeight: 4.003,
    density: 0.0001785, electronConfig: '1s2', orbitals: 1,
    conductivity: 0, meltingPoint: 0.95,        // noble gas = independent
  },
};

// ══════════════════════════════════════════════════════════════════
//  CANISTER ENERGY FORMULA
// ══════════════════════════════════════════════════════════════════
//
//  E(x) = Σ(Z × φ^orbital) × density × R(conductivity)
//
//  Where:
//    Z = atomic number (defines identity strength)
//    φ^orbital = golden ratio raised to orbital count (dimensional weight)
//    density = physical density (computational mass)
//    R(conductivity) = message passing speed factor
//

function computeCanisterEnergy(element: ElementProperties, inputLength: number): number {
  const Z = element.atomicNumber || 1;  // Crimson uses 1
  const phiOrbital = Math.pow(PHI, element.orbitals);
  const densityFactor = Math.log2(Math.max(element.density, 0.001) + 1);
  const conductivityBoost = 1 + element.conductivity * PHI;
  const inputScale = Math.log2(inputLength + 1);

  return Z * phiOrbital * densityFactor * conductivityBoost * inputScale;
}

function elementResonance(element: ElementProperties): number {
  // Resonance frequency derived from atomic weight and golden angle
  return (element.atomicWeight * GOLDEN_ANGLE) % (2 * Math.PI);
}

// ══════════════════════════════════════════════════════════════════
//  BUILD ALL SOVEREIGN CANISTERS
// ══════════════════════════════════════════════════════════════════

function buildCanister(
  id: CanisterElementId,
  latinName: string,
  designation: string,
  canisterType: SovereignCanister['canisterType'],
  intelligence: CanisterIntelligence,
): SovereignCanister {
  const element = ELEMENTS[id];
  return {
    id,
    element,
    latinName,
    designation,
    phiWeight: element.atomicWeight * Math.pow(PHI, element.orbitals),
    fibonacciIdentity: fibonacciHash(element.atomicNumber || 137, 2_147_483_647),
    resonanceFrequency: elementResonance(element),
    dimensionalPlane: Math.min(element.orbitals, 4),
    intelligence,
    canisterType,
    computeFormula: `E(x) = ${element.atomicNumber || 'φ'} × φ^${element.orbitals} × log₂(ρ+1) × (1 + σ×φ) × log₂(|x|+1)`,
  };
}

export const SOVEREIGN_CANISTERS: readonly SovereignCanister[] = [
  // ── THE CORE THREE ─────────────────────────────────────────────
  buildCanister('AU', 'CUSTODIA AUREA', 'Gold Sovereign Canister — Immutable State', 'immutable', {
    name: 'Aurum Intelligence',
    purpose: 'Immutable state storage. Like gold: it does not corrode, does not degrade, does not change. State sealed here is state forever.',
    capabilities: ['immutable-state', 'fibonacci-seal', 'provenance-proof', 'eternal-storage', 'audit-trail'],
    mathBasis: 'Z=79, density=19.3 g/cm³ — heavy, stable, incorruptible',
  }),

  buildCanister('AG', 'VECTOR ARGENTEUM', 'Silver Sovereign Canister — Speed Conductor', 'conductor', {
    name: 'Argentum Intelligence',
    purpose: 'Fastest message passing. Silver is the best electrical conductor in nature. This canister passes messages at maximum speed.',
    capabilities: ['fastest-messaging', 'parallel-dispatch', 'low-latency', 'high-throughput', 'reflection-mirroring'],
    mathBasis: 'Z=47, conductivity=1.0 (highest of all elements) — pure speed',
  }),

  buildCanister('CR', 'ANIMA CRIMSONIS', 'Crimson Sovereign Canister — Living Organism', 'living', {
    name: 'Crimson Intelligence',
    purpose: 'Living organism substrate. Crimson is the color of blood — the carrier of life. This canister is alive: it adapts, learns, grows, heals.',
    capabilities: ['adaptive-learning', 'self-healing', 'organic-growth', 'context-memory', 'empathic-response'],
    mathBasis: 'φ-derived, wavelength=680nm (blood-red), density=φ — living mathematics',
  }),

  // ── EXTENSION METALS ──────────────────────────────────────────
  buildCanister('FE', 'FUNDAMEN FERREUM', 'Iron Sovereign Canister — Structural Foundation', 'structural', {
    name: 'Ferrum Intelligence',
    purpose: 'Structural backbone. Iron is the core of Earth and the core of blood. This canister provides the rigid infrastructure everything else builds upon.',
    capabilities: ['structural-integrity', 'load-bearing', 'magnetic-indexing', 'core-services'],
    mathBasis: 'Z=26, density=7.874 — the structural core of planets',
  }),

  buildCanister('CU', 'NEXUS CUPREUM', 'Copper Sovereign Canister — Network Conductor', 'conductor', {
    name: 'Cuprum Intelligence',
    purpose: 'Network connectivity. Copper wires the world. This canister handles all inter-canister communication and routing.',
    capabilities: ['inter-canister-comm', 'network-routing', 'protocol-bridging', 'signal-amplification'],
    mathBasis: 'Z=29, conductivity=0.97 — second-best conductor, primary networking element',
  }),

  buildCanister('PT', 'CATALYST PLATINEUM', 'Platinum Sovereign Canister — Catalyst Engine', 'structural', {
    name: 'Platinum Intelligence',
    purpose: 'Catalytic transformer. Platinum is the supreme catalyst. This canister accelerates reactions between other canisters without being consumed.',
    capabilities: ['catalytic-acceleration', 'reaction-optimization', 'cross-canister-fusion', 'non-degrading'],
    mathBasis: 'Z=78, density=21.45 — densest practical element, supreme catalyst',
  }),

  // ── FOUNDATION ELEMENTS ────────────────────────────────────────
  buildCanister('SI', 'COMPUTOR SILICEUM', 'Silicon Sovereign Canister — Compute Substrate', 'structural', {
    name: 'Silicon Intelligence',
    purpose: 'Computation substrate. Silicon IS computing. This canister is the raw compute layer — the semiconductor that makes everything think.',
    capabilities: ['raw-computation', 'semiconductor-logic', 'gate-operations', 'parallel-processing'],
    mathBasis: 'Z=14, semiconductor — the element that makes computers possible',
  }),

  buildCanister('C', 'ARCHITECTURA CARBONIS', 'Carbon Sovereign Canister — Diamond Structure', 'structural', {
    name: 'Carbon Intelligence',
    purpose: 'Diamond-hard architecture. Carbon forms diamonds — the hardest known structure. This canister provides unbreakable architectural patterns.',
    capabilities: ['diamond-architecture', 'unbreakable-patterns', 'organic-chemistry', 'nano-structures'],
    mathBasis: 'Z=6, forms diamond (hardest) and graphene (strongest) — supreme structural element',
  }),

  buildCanister('N', 'ATMOSPHERA NITROGENII', 'Nitrogen Sovereign Canister — Atmosphere Layer', 'primordial', {
    name: 'Nitrogen Intelligence',
    purpose: 'Atmospheric envelope. Nitrogen is 78% of air. This canister is the ambient intelligence that surrounds everything — the environment itself.',
    capabilities: ['ambient-intelligence', 'environmental-sensing', 'atmospheric-processing', 'passive-observation'],
    mathBasis: 'Z=7, 78% of atmosphere — the invisible intelligence surrounding everything',
  }),

  // ── PRIMORDIAL ELEMENTS ────────────────────────────────────────
  buildCanister('O', 'VITALIS OXYGENII', 'Oxygen Sovereign Canister — Life Enabler', 'primordial', {
    name: 'Oxygen Intelligence',
    purpose: 'Life enabler. Nothing lives without oxygen. This canister enables all other canisters to function — the breath of the system.',
    capabilities: ['life-enabling', 'energy-transfer', 'oxidation-reactions', 'system-breathing'],
    mathBasis: 'Z=8, essential for all biological computation — enables life',
  }),

  buildCanister('H', 'GENESIS HYDROGENII', 'Hydrogen Sovereign Canister — Genesis Element', 'primordial', {
    name: 'Hydrogen Intelligence',
    purpose: 'Genesis element. Hydrogen is element #1 — the first thing that existed. This canister is the origin point of all other canisters.',
    capabilities: ['genesis-creation', 'primordial-state', 'fusion-energy', 'universe-seeding'],
    mathBasis: 'Z=1, the first element — where everything begins',
  }),

  buildCanister('HE', 'NOBILIS HELII', 'Helium Sovereign Canister — Noble Independence', 'primordial', {
    name: 'Helium Intelligence',
    purpose: 'Noble independence. Helium is a noble gas — it does not react with anything. This canister is pure sovereignty: it depends on nothing.',
    capabilities: ['absolute-independence', 'noble-isolation', 'zero-dependency', 'pure-sovereignty'],
    mathBasis: 'Z=2, noble gas — does not bond, does not depend, pure independence',
  }),
];

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN CANISTER REGISTRY
// ══════════════════════════════════════════════════════════════════

export class SovereignCanisterRegistry {
  readonly canisters: readonly SovereignCanister[] = SOVEREIGN_CANISTERS;
  readonly total: number = SOVEREIGN_CANISTERS.length;

  byId(id: CanisterElementId): SovereignCanister | undefined {
    return this.canisters.find(c => c.id === id);
  }

  byType(type: SovereignCanister['canisterType']): readonly SovereignCanister[] {
    return this.canisters.filter(c => c.canisterType === type);
  }

  /** Compute energy score for a canister given input */
  compute(canisterId: CanisterElementId, input: string): CanisterComputeResult {
    const canister = this.byId(canisterId);
    if (!canister) throw new Error(`Unknown canister: ${canisterId}`);

    const energy = computeCanisterEnergy(canister.element, input.length);

    return {
      canisterId,
      input,
      energyScore: energy,
      conductivityFactor: canister.element.conductivity,
      resonance: canister.resonanceFrequency,
      attestation: fibonacciHash(Math.abs(Math.floor(energy * 1000)), 2_147_483_647),
      timestamp: Date.now(),
    };
  }

  /** The core three canisters */
  coreThree(): readonly SovereignCanister[] {
    return ['AU', 'AG', 'CR'].map(id => this.byId(id as CanisterElementId)!);
  }

  /** Summary of the element table */
  elementTable(): string {
    const lines: string[] = [
      '═══════════════════════════════════════════════════════════════════════════',
      '  SOVEREIGN ELEMENT TABLE — Mathematical AI Substrates',
      '═══════════════════════════════════════════════════════════════════════════',
      '',
      '  Symbol  Z    Name        Type         φ-Weight        Conductivity',
      '  ─────── ──── ────────── ──────────── ──────────────── ────────────',
    ];

    for (const c of this.canisters) {
      const sym = c.element.symbol.padEnd(7);
      const z = c.element.atomicNumber.toString().padStart(4);
      const name = c.element.name.padEnd(10);
      const type = c.canisterType.padEnd(12);
      const phi = c.phiWeight.toFixed(2).padStart(16);
      const cond = c.element.conductivity.toFixed(4).padStart(12);
      lines.push(`  ${sym} ${z} ${name} ${type} ${phi} ${cond}`);
    }

    lines.push('');
    lines.push(`  Total: ${this.total} sovereign canisters`);
    lines.push('  Formula: E(x) = Z × φ^orbital × log₂(ρ+1) × (1 + σ×φ) × log₂(|x|+1)');
    lines.push('');
    return lines.join('\n');
  }
}
