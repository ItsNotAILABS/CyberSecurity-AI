///
/// @medina/catalytic-converter — Alchemical Transformation Engine
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║                   CATALYTIC CONVERTER — ALCHEMICAL ENGINE                    ║
/// ║                                                                              ║
/// ║  Like chemical catalysts, this engine ACCELERATES transformations            ║
/// ║  WITHOUT being consumed in the process.                                      ║
/// ║                                                                              ║
/// ║  Ancient Alchemy → Modern Intelligence                                       ║
/// ║    Platinum (Sol)    → Gold    → Perfection                                  ║
/// ║    Palladium (Luna)  → Silver  → Reflection                                  ║
/// ║    Rhodium (Mercury) → Quicksilver → Transformation                          ║
/// ║    Copper (Venus)    → Connection → Harmony                                  ║
/// ║    Iron (Mars)       → Strength → Foundation                                 ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════════════════
//  SACRED MATHEMATICAL CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482;
const PHI_INV = 0.6180339887498948482;
const PHI_SQ = PHI * PHI;
const PHI_CUBE = PHI * PHI * PHI;
const PHI_QUART = PHI * PHI * PHI * PHI;
const PHI_QUINT = PHI * PHI * PHI * PHI * PHI;
const SQRT_5 = Math.sqrt(5);
const SQRT_2 = Math.sqrt(2);
const SQRT_3 = Math.sqrt(3);
const PI = Math.PI;
const EULER = Math.E;
const TAU = 2 * PI;

// Golden Angle (radians) — The angle of divine proportion
const GOLDEN_ANGLE = TAU / (PHI * PHI);  // ≈ 137.5°

// Pythagorean Musical Intervals
const MUSICAL_RATIOS = {
  unison: 1 / 1,        // Perfect unison
  octave: 2 / 1,        // Perfect octave
  fifth: 3 / 2,         // Perfect fifth (diapente)
  fourth: 4 / 3,        // Perfect fourth (diatessaron)
  majorThird: 5 / 4,    // Major third
  minorThird: 6 / 5,    // Minor third
  majorSecond: 9 / 8,   // Major second (whole tone)
  minorSecond: 16 / 15, // Minor second (semitone)
  phi: PHI,             // Golden ratio
};

// Alchemical Elements
const ALCHEMICAL_ELEMENTS = {
  // Classical Four Elements
  fire: { quality: 'hot-dry', planet: 'Mars', metal: 'iron', ratio: PHI },
  water: { quality: 'cold-wet', planet: 'Moon', metal: 'silver', ratio: PHI_INV },
  air: { quality: 'hot-wet', planet: 'Jupiter', metal: 'tin', ratio: PHI_SQ },
  earth: { quality: 'cold-dry', planet: 'Saturn', metal: 'lead', ratio: 1 },
  // Quintessence (Fifth Element)
  aether: { quality: 'perfect', planet: 'Sun', metal: 'gold', ratio: PHI_CUBE },
};

// ══════════════════════════════════════════════════════════════════════════════
//  CATALYST CLASS — Individual Catalyst Definition
// ══════════════════════════════════════════════════════════════════════════════

class Catalyst {
  /**
   * Individual catalyst with specific properties
   * 
   * @param {string} name - Catalyst name
   * @param {Object} config - Catalyst configuration
   */
  constructor(name, config = {}) {
    this.name = name;
    this.element = config.element || 'copper';
    this.planetaryAffinity = config.planet || 'Venus';
    this.efficiency = config.efficiency || 1.0;
    this.harmonicRatio = config.harmonic || MUSICAL_RATIOS.unison;
    
    // State
    this.reactionsProcessed = 0;
    this.totalEnergyTransferred = 0;
    this.birthTime = Date.now();
    this.isActive = true;
    this.neverDepletes = true; // CATALYSTS NEVER DEPLETE
    
    // Specificity — what reaction types this catalyst handles
    this.specificity = config.specificity || [
      'transform', 'synthesize', 'decompose', 'transmute'
    ];
  }
  
  /**
   * Process a reaction — CATALYST IS NOT CONSUMED
   */
  processReaction(input, reactionType) {
    if (!this.isActive) {
      return { error: 'Catalyst inactive', input };
    }
    
    if (!this.specificity.includes(reactionType)) {
      return { error: `Catalyst not specific for ${reactionType}`, input };
    }
    
    const startTime = performance.now();
    
    // Calculate activation energy reduction (Arrhenius-like)
    const activationReduction = this.efficiency * this.harmonicRatio;
    
    // Apply transformation
    const output = this._catalyze(input, activationReduction);
    
    const duration = performance.now() - startTime;
    const energyTransferred = Math.abs(activationReduction * duration);
    
    // Record reaction — CATALYST NOT DEPLETED
    this.reactionsProcessed++;
    this.totalEnergyTransferred += energyTransferred;
    
    return {
      input,
      output,
      catalyst: this.name,
      element: this.element,
      efficiency: this.efficiency,
      activationReduction,
      duration,
      energyTransferred,
      reactionNumber: this.reactionsProcessed,
      depleted: false, // NEVER
    };
  }
  
  _catalyze(input, factor) {
    if (typeof input === 'number') {
      // Golden spiral transformation
      const theta = input * GOLDEN_ANGLE;
      const r = Math.pow(PHI, input / (2 * PI));
      return {
        value: input * factor,
        spiral: { r, theta },
        harmonic: input * this.harmonicRatio,
      };
    }
    
    if (typeof input === 'string') {
      // Vibrational frequency encoding
      return this._encodeFrequencies(input, factor);
    }
    
    if (Array.isArray(input)) {
      return input.map((item, i) => {
        const phaseShift = Math.pow(PHI_INV, i);
        return this._catalyze(item, factor * phaseShift);
      });
    }
    
    if (typeof input === 'object' && input !== null) {
      const result = {};
      for (const [key, value] of Object.entries(input)) {
        result[key] = this._catalyze(value, factor);
      }
      return result;
    }
    
    return input;
  }
  
  _encodeFrequencies(str, factor) {
    const frequencies = [];
    const harmonics = [];
    
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      
      // Base frequency (Pythagorean)
      const baseFreq = charCode * factor;
      frequencies.push(baseFreq);
      
      // Harmonic series
      const harmonic = baseFreq * this.harmonicRatio * Math.pow(PHI, i % 5);
      harmonics.push(harmonic);
    }
    
    return {
      original: str,
      frequencies,
      harmonics,
      fundamentalFreq: frequencies.reduce((a, b) => a + b, 0) / frequencies.length,
      goldenMean: harmonics.reduce((a, b) => a + b, 0) / harmonics.length,
    };
  }
  
  getStatus() {
    return {
      name: this.name,
      element: this.element,
      planet: this.planetaryAffinity,
      efficiency: this.efficiency,
      active: this.isActive,
      reactions: this.reactionsProcessed,
      totalEnergy: this.totalEnergyTransferred,
      uptime: Date.now() - this.birthTime,
      depleted: false, // NEVER DEPLETES
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  CATALYTIC CONVERTER — The Main Engine
// ══════════════════════════════════════════════════════════════════════════════

/**
 * CATALYTIC CONVERTER
 * 
 * A collection of catalysts that work together to transform inputs.
 * Each catalyst has different properties and efficiencies.
 * 
 * NONE of them deplete — infinite reactions possible.
 */
class CatalyticConverter {
  constructor(config = {}) {
    this.id = `CAT-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isActive = true;
    
    // Initialize default catalysts based on alchemical metals
    this.catalysts = new Map();
    
    // ══════════════════════════════════════════════════════════════════════════
    //  ALCHEMICAL CATALYST HIERARCHY (Efficiency: φ^n)
    // ══════════════════════════════════════════════════════════════════════════
    
    // AURUM (Gold/Sun) — φ⁵ efficiency — Perfection
    this.catalysts.set('aurum', new Catalyst('Aurum', {
      element: 'gold',
      planet: 'Sol',
      efficiency: PHI_QUINT,
      harmonic: MUSICAL_RATIOS.octave,
      specificity: ['transmute', 'perfect', 'synthesize'],
    }));
    
    // PLATINUM (Sol) — φ⁴ efficiency — Near-Perfection
    this.catalysts.set('platinum', new Catalyst('Platinum', {
      element: 'platinum',
      planet: 'Sol',
      efficiency: PHI_QUART,
      harmonic: MUSICAL_RATIOS.fifth,
      specificity: ['transform', 'synthesize', 'transmute'],
    }));
    
    // PALLADIUM (Luna) — φ³ efficiency — Reflection
    this.catalysts.set('palladium', new Catalyst('Palladium', {
      element: 'silver',
      planet: 'Luna',
      efficiency: PHI_CUBE,
      harmonic: MUSICAL_RATIOS.fourth,
      specificity: ['transform', 'reflect', 'purify'],
    }));
    
    // RHODIUM (Mercury) — φ² efficiency — Transformation
    this.catalysts.set('rhodium', new Catalyst('Rhodium', {
      element: 'quicksilver',
      planet: 'Mercury',
      efficiency: PHI_SQ,
      harmonic: MUSICAL_RATIOS.majorThird,
      specificity: ['transform', 'adapt', 'flow'],
    }));
    
    // ARGENTUM (Silver) — φ efficiency — Purity
    this.catalysts.set('argentum', new Catalyst('Argentum', {
      element: 'silver',
      planet: 'Luna',
      efficiency: PHI,
      harmonic: MUSICAL_RATIOS.minorThird,
      specificity: ['purify', 'clarify', 'transform'],
    }));
    
    // COPPER (Venus) — 1.0 efficiency — Connection
    this.catalysts.set('copper', new Catalyst('Copper', {
      element: 'copper',
      planet: 'Venus',
      efficiency: 1.0,
      harmonic: MUSICAL_RATIOS.majorSecond,
      specificity: ['connect', 'transform', 'harmonize'],
    }));
    
    // IRON (Mars) — φ⁻¹ efficiency — Strength
    this.catalysts.set('iron', new Catalyst('Iron', {
      element: 'iron',
      planet: 'Mars',
      efficiency: PHI_INV,
      harmonic: MUSICAL_RATIOS.unison,
      specificity: ['strengthen', 'transform', 'forge'],
    }));
    
    // LEAD (Saturn) — φ⁻² efficiency — Foundation
    this.catalysts.set('lead', new Catalyst('Lead', {
      element: 'lead',
      planet: 'Saturn',
      efficiency: PHI_INV * PHI_INV,
      harmonic: MUSICAL_RATIOS.minorSecond,
      specificity: ['ground', 'stabilize', 'transform'],
    }));
    
    // Statistics
    this.totalReactions = 0;
    this.reactionLog = [];
    
    console.log(`⚗️ CatalyticConverter ${this.id} — 8 alchemical catalysts active`);
  }
  
  /**
   * Transform input using specified catalyst
   */
  transform(input, catalystName = 'copper', reactionType = 'transform') {
    const catalyst = this.catalysts.get(catalystName);
    if (!catalyst) {
      return { error: `Unknown catalyst: ${catalystName}`, input };
    }
    
    const result = catalyst.processReaction(input, reactionType);
    
    if (!result.error) {
      this.totalReactions++;
      this.reactionLog.push({
        catalyst: catalystName,
        type: reactionType,
        timestamp: Date.now(),
      });
    }
    
    return result;
  }
  
  /**
   * Transform through multiple catalysts in sequence (catalytic cascade)
   */
  cascade(input, catalystSequence = ['iron', 'copper', 'argentum']) {
    let current = input;
    const steps = [];
    
    for (const catalystName of catalystSequence) {
      const result = this.transform(current, catalystName);
      if (result.error) {
        return { error: result.error, stepsCompleted: steps };
      }
      steps.push({
        catalyst: catalystName,
        input: current,
        output: result.output,
      });
      current = result.output;
    }
    
    return {
      input,
      finalOutput: current,
      steps,
      cascadeLength: steps.length,
    };
  }
  
  /**
   * Transmute — The highest form of catalysis (requires aurum catalyst)
   */
  transmute(input) {
    return this.transform(input, 'aurum', 'transmute');
  }
  
  /**
   * Get all catalyst statuses
   */
  getStatus() {
    const catalystStatuses = {};
    for (const [name, catalyst] of this.catalysts) {
      catalystStatuses[name] = catalyst.getStatus();
    }
    
    return {
      id: this.id,
      active: this.isActive,
      uptime: Date.now() - this.birthTime,
      totalReactions: this.totalReactions,
      catalysts: catalystStatuses,
    };
  }
  
  /**
   * Add a custom catalyst
   */
  addCatalyst(name, config) {
    this.catalysts.set(name, new Catalyst(name, config));
    console.log(`⚗️ Added catalyst: ${name}`);
    return true;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  AUTOMOTIVE CATALYTIC CONVERTER — Specialized for Emissions/Toxins
// ══════════════════════════════════════════════════════════════════════════════

/**
 * AUTOMOTIVE CATALYTIC CONVERTER
 * 
 * Inspired by real automotive catalytic converters that:
 * - Convert harmful emissions (CO, HC, NOx) to harmless outputs (CO2, H2O, N2)
 * - Use platinum, palladium, and rhodium
 * - Never deplete (only physical damage destroys them)
 * 
 * In our context: Transforms "toxic" data into clean, usable intelligence
 */
class AutomotiveCatalyticConverter extends CatalyticConverter {
  constructor(config = {}) {
    super(config);
    
    // Specialized reactions for toxin conversion
    this.toxinConversions = {
      // Carbon Monoxide → Carbon Dioxide (oxidation)
      oxidize: (input) => this.transform(input, 'platinum', 'transform'),
      
      // Hydrocarbons → Water + CO2 (combustion)
      combust: (input) => this.cascade(input, ['platinum', 'palladium']),
      
      // NOx → Nitrogen + Oxygen (reduction)
      reduce: (input) => this.transform(input, 'rhodium', 'transform'),
    };
    
    // Three-way conversion capability
    this.threeWay = true;
    
    console.log(`🚗 AutomotiveCatalyticConverter — Three-way conversion active`);
  }
  
  /**
   * Convert "toxic" input to clean output (like real catalytic converters)
   */
  convertToxin(input, toxinType = 'general') {
    switch (toxinType) {
      case 'CO': // Carbon monoxide
        return this.toxinConversions.oxidize(input);
      case 'HC': // Hydrocarbons
        return this.toxinConversions.combust(input);
      case 'NOx': // Nitrogen oxides
        return this.toxinConversions.reduce(input);
      case 'general':
      default:
        // Three-way conversion (all three reactions)
        return this.threeWayConversion(input);
    }
  }
  
  /**
   * Full three-way catalytic conversion
   */
  threeWayConversion(input) {
    const oxidized = this.toxinConversions.oxidize(input);
    const combusted = this.toxinConversions.combust(oxidized.output || input);
    const reduced = this.toxinConversions.reduce(combusted.finalOutput || combusted.output || input);
    
    return {
      input,
      stages: {
        oxidation: oxidized,
        combustion: combusted,
        reduction: reduced,
      },
      cleanOutput: reduced.output,
      conversionComplete: true,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export {
  // Main classes
  CatalyticConverter,
  AutomotiveCatalyticConverter,
  Catalyst,
  
  // Constants
  PHI,
  PHI_INV,
  PHI_SQ,
  PHI_CUBE,
  PHI_QUART,
  PHI_QUINT,
  GOLDEN_ANGLE,
  MUSICAL_RATIOS,
  ALCHEMICAL_ELEMENTS,
};

export default CatalyticConverter;
