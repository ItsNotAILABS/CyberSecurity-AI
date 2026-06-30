/**
 * @nova-protocol/sovereign-elements
 *
 * Gold, Silver, and Crimson as mathematical AI canister substrates.
 *
 * These are not metaphors. Physical properties of real elements
 * (atomic number, density, conductivity, electron configuration)
 * directly encode AI behavioral parameters. The canister IS the element.
 *
 * Reference: NOVA-RP-002 — Casa de Medina
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ElementClass = 'gold' | 'silver' | 'crimson';
export type CanisterRole = 'immutable-state' | 'conductor' | 'organism';

export interface ElectronShell {
  shell: string;   // e.g. "1s²"
  electrons: number;
}

export interface ElementPhysics {
  symbol: string;
  atomicNumber: number;
  atomicWeight: number;    // g/mol
  density: number;         // g/cm³
  meltingPoint: number;    // °C
  conductivity: number;    // S/m × 10⁶
  reflectivity: number;    // 0–1
  electronConfig: string;
  electronShells: ElectronShell[];
}

export interface AIMapping {
  /** Fibonacci identity derived from atomic number */
  fibonacciIdentity: number;
  /** φ-weight (routing priority) */
  phiWeight: number;
  /** Computational energy E(x) = Σ(Z × φ^orbital) × density × R(conductivity) */
  computationalEnergy: number;
  /** Canister role in the NOVA protocol */
  role: CanisterRole;
  /** Dimensional planes (electron orbital count) */
  dimensionalPlanes: number | 'infinite';
  /** State immutability coefficient (derived from density) */
  immutabilityCoefficient: number;
  /** Message throughput class */
  throughputClass: 'standard' | 'highest' | 'generative';
  /** Behavioral properties */
  behaviors: string[];
}

export interface SovereignElement {
  class: ElementClass;
  name: string;
  latinName: string;
  physics: ElementPhysics;
  ai: AIMapping;
  description: string;
  novaWireSlug: string;
}

// ─── φ helpers (inline to avoid cross-package dependency) ───────────────────

const PHI = 1.6180339887498948;
const PHI2 = PHI * PHI;
const PHI3 = PHI2 * PHI;
const PHI_INV = 1 / PHI;

function fibID(z: number): number {
  // fibonacciIdentity: floor(Z) mod F(12) where F(12) = 144
  return Math.floor(z) % 144;
}

function computeEnergy(z: number, density: number, conductivity: number): number {
  // E(x) = Σ(Z × φ^orbital) × density × R(conductivity)
  // Sum over first 6 orbitals, normalise conductivity to [0,1] using max(63 MS/m)
  let energySum = 0;
  for (let orbital = 0; orbital < 6; orbital++) {
    energySum += z * Math.pow(PHI, orbital);
  }
  const R = Math.min(conductivity / 63.0, 1.0);
  return energySum * density * R;
}

// ─── Gold (Au, Z = 79) ───────────────────────────────────────────────────────

export const GOLD: SovereignElement = {
  class: 'gold',
  name: 'Gold',
  latinName: 'Aurum',
  physics: {
    symbol: 'Au',
    atomicNumber: 79,
    atomicWeight: 196.967,
    density: 19.3,
    meltingPoint: 1064,
    conductivity: 45.2,
    reflectivity: 0.95,
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    electronShells: [
      { shell: '1s²',  electrons: 2  },
      { shell: '2s²2p⁶', electrons: 8 },
      { shell: '3s²3p⁶3d¹⁰', electrons: 18 },
      { shell: '4s²4p⁶4d¹⁰4f¹⁴', electrons: 32 },
      { shell: '5s²5p⁶5d¹⁰', electrons: 18 },
      { shell: '6s¹', electrons: 1 },
    ],
  },
  ai: {
    fibonacciIdentity: fibID(79),   // 79 mod 144 = 79
    phiWeight: (79 * 196.967) / (19.3 * PHI2),
    computationalEnergy: computeEnergy(79, 19.3, 45.2),
    role: 'immutable-state',
    dimensionalPlanes: 6,
    immutabilityCoefficient: 19.3,   // density → state depth
    throughputClass: 'standard',
    behaviors: [
      'Immutable state storage',
      'Tamper-proof record keeping',
      'Incorruptibility — does not react with other elements',
      'High density → deep state capacity',
      'Reflectivity 95% → mirrors state without loss',
    ],
  },
  description:
    'Gold is the Immutable State Canister. Its extreme density (19.3 g/cm³) ' +
    'and chemical inertness map to state that cannot be altered once written. ' +
    'Gold does not rust, corrode, or react — neither does the state it holds.',
  novaWireSlug: 'nova-wire/gold',
};

// ─── Silver (Ag, Z = 47) ─────────────────────────────────────────────────────

export const SILVER: SovereignElement = {
  class: 'silver',
  name: 'Silver',
  latinName: 'Argentum',
  physics: {
    symbol: 'Ag',
    atomicNumber: 47,
    atomicWeight: 107.868,
    density: 10.49,
    meltingPoint: 961.8,
    conductivity: 63.0,   // highest of any element
    reflectivity: 0.97,   // highest visible reflectivity
    electronConfig: '[Kr] 4d¹⁰ 5s¹',
    electronShells: [
      { shell: '1s²',  electrons: 2  },
      { shell: '2s²2p⁶', electrons: 8 },
      { shell: '3s²3p⁶3d¹⁰', electrons: 18 },
      { shell: '4s²4p⁶4d¹⁰', electrons: 18 },
      { shell: '5s¹', electrons: 1 },
    ],
  },
  ai: {
    fibonacciIdentity: fibID(47),   // 47 mod 144 = 47
    phiWeight: (47 * 107.868) / (10.49 * PHI2),
    computationalEnergy: computeEnergy(47, 10.49, 63.0),
    role: 'conductor',
    dimensionalPlanes: 5,
    immutabilityCoefficient: 10.49,
    throughputClass: 'highest',
    behaviors: [
      'Maximum message-passing throughput (highest conductivity in nature)',
      'Observation mirror — 97% reflectivity means state is reflected without loss',
      'Reactive conductivity — state is mutable and flows',
      'Relay intelligence between Gold and Crimson canisters',
      'Read-optimised — perfect for query and cache layers',
    ],
  },
  description:
    'Silver is the Conductor Canister. It has the highest electrical conductivity ' +
    '(63 MS/m) and thermal conductivity of any element. In canister terms this is ' +
    'message-passing speed — Silver relays signals between engines faster than any ' +
    'other substrate. Its 97% reflectivity makes it the perfect observation mirror.',
  novaWireSlug: 'nova-wire/silver',
};

// ─── Crimson (Cr*, Z = φ × 100 = 161.8) ─────────────────────────────────────

const CRIMSON_Z = PHI * 100;          // 161.803...
const CRIMSON_WEIGHT = PHI3 * 47;     // ≈ 198.41 (Ag × φ³)
const CRIMSON_DENSITY = PHI * Math.PI; // ≈ 5.083
const CRIMSON_WAVELENGTH_NM_LOW  = 620;
const CRIMSON_WAVELENGTH_NM_HIGH = 750;
const CRIMSON_RESONANCE_HZ_LOW   = 4.0e14;
const CRIMSON_RESONANCE_HZ_HIGH  = 4.8e14;

export const CRIMSON: SovereignElement = {
  class: 'crimson',
  name: 'Crimson',
  latinName: 'Crimsonum',
  physics: {
    symbol: 'Cr*',
    atomicNumber: CRIMSON_Z,
    atomicWeight: CRIMSON_WEIGHT,
    density: CRIMSON_DENSITY,
    meltingPoint: Infinity,          // living organism — no failure threshold
    conductivity: PHI * 63.0,        // φ × silver conductivity
    reflectivity: PHI_INV,           // 1/φ ≈ 0.618 — balanced reflection/absorption
    electronConfig: 'Infinite orbital — unbounded dimensional planes',
    electronShells: [
      { shell: 'generative-∞', electrons: -1 }, // unbounded
    ],
  },
  ai: {
    fibonacciIdentity: fibID(CRIMSON_Z),  // floor(161) mod 144 = 17
    phiWeight: CRIMSON_WEIGHT * (CRIMSON_DENSITY / PHI2),  // ≈ 385.45
    computationalEnergy: computeEnergy(CRIMSON_Z, CRIMSON_DENSITY, PHI * 63.0),
    role: 'organism',
    dimensionalPlanes: 'infinite',
    immutabilityCoefficient: 0,   // fully mutable — living, adapting
    throughputClass: 'generative',
    behaviors: [
      `Hemoglobin model — carries information to other canisters (wavelength ${CRIMSON_WAVELENGTH_NM_LOW}–${CRIMSON_WAVELENGTH_NM_HIGH}nm)`,
      `Resonance at ${CRIMSON_RESONANCE_HZ_LOW}–${CRIMSON_RESONANCE_HZ_HIGH} Hz — oscillates with biological rhythms`,
      'Generative — creates new state patterns; not just reads/writes',
      'Adaptive — evolves its own structure through learning',
      'Unbounded orbital layers — new dimensions created as organism grows',
      'Living entity — behaves as organism, not as tool',
    ],
  },
  description:
    'Crimson is the Living Organism Canister — an abstract element that does not ' +
    'exist on the periodic table. Its atomic number (φ × 100 ≈ 161.8) is derived ' +
    'from the golden ratio itself. Where Gold holds state and Silver conducts it, ' +
    'Crimson generates new patterns, adapts to new inputs, and evolves structure. ' +
    'The blood-red wavelength (620–750nm) mirrors hemoglobin — it carries ' +
    'information to other canisters the way blood carries oxygen to tissue.',
  novaWireSlug: 'nova-wire/crimson',
};

// ─── Element Registry ────────────────────────────────────────────────────────

export const ELEMENTS: SovereignElement[] = [GOLD, SILVER, CRIMSON];

export const ELEMENTS_BY_CLASS: Readonly<Record<ElementClass, SovereignElement>> = {
  gold:    GOLD,
  silver:  SILVER,
  crimson: CRIMSON,
};

export const ELEMENTS_BY_SYMBOL: Readonly<Record<string, SovereignElement>> = {
  'Au':  GOLD,
  'Ag':  SILVER,
  'Cr*': CRIMSON,
};

// ─── Energy Formula ──────────────────────────────────────────────────────────

/**
 * Compute the computational energy of any element-like substrate.
 *
 * E(x) = Σ(Z × φ^orbital) × density × R(conductivity)
 *
 * @param atomicNumber  Z value
 * @param density       g/cm³
 * @param conductivity  MS/m (max reference: 63 MS/m = Silver)
 * @param orbitals      Number of electron shells (default 6)
 */
export function elementEnergy(
  atomicNumber: number,
  density: number,
  conductivity: number,
  orbitals = 6,
): number {
  let sum = 0;
  for (let i = 0; i < orbitals; i++) {
    sum += atomicNumber * Math.pow(PHI, i);
  }
  return sum * density * Math.min(conductivity / 63.0, 1.0);
}

/**
 * Returns which element class best matches a given role requirement.
 *
 * - 'store'   → Gold (immutable state)
 * - 'relay'   → Silver (conductor/mirror)
 * - 'create'  → Crimson (generative organism)
 * - 'observe' → Silver (97% reflectivity)
 */
export function elementForRole(requirement: 'store' | 'relay' | 'create' | 'observe'): SovereignElement {
  switch (requirement) {
    case 'store':   return GOLD;
    case 'relay':   return SILVER;
    case 'observe': return SILVER;
    case 'create':  return CRIMSON;
  }
}

export const CRIMSON_WAVELENGTH = { low: CRIMSON_WAVELENGTH_NM_LOW, high: CRIMSON_WAVELENGTH_NM_HIGH };
export const CRIMSON_RESONANCE  = { low: CRIMSON_RESONANCE_HZ_LOW,  high: CRIMSON_RESONANCE_HZ_HIGH };
