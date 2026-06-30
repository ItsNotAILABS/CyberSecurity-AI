///
/// FRACTURE MODELS — Active Intelligence for the 100 Fractures
///
/// These are not passive lists.  These are computational models
/// that analyze, compare, classify, and synthesize fracture
/// intelligence.  Golden mathematics running on every operation.
///
/// Models:
///   FRACTURE ANALYZER  — Deconstruct any technology to its golden primitives
///   FRACTURE COMPARATOR — Compare fracture vs. sovereign capability
///   FRACTURE SYNTHESIZER — Generate sovereign alternatives from fracture patterns
///   FRACTURE OBSERVER   — OBSV integration: observe fractures across dimensions
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

import {
  FractureCategory,
  FractureRegistry,
  type FractureIntelligence,
} from '../intelligence/FractureRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface FractureAnalysis {
  readonly fractureId: number;
  readonly name: string;
  readonly category: string;
  readonly goldenPrimitives: string[];    // What golden math primitives this maps to
  readonly complexityScore: number;       // φ-normalized complexity
  readonly sovereignAdvantage: number;    // How much better sovereign version is (φ-scaled)
  readonly fibonacciDecomposition: number[]; // Zeckendorf decomposition of identity
  readonly timestamp: number;
}

export interface FractureComparison {
  readonly fractureA: string;
  readonly fractureB: string;
  readonly resonanceDelta: number;     // Difference in golden weight
  readonly categoryOverlap: boolean;
  readonly goldenRatio: number;        // Weight ratio — ideally ≈ φ
  readonly verdict: string;
  readonly timestamp: number;
}

export interface SovereignAlternative {
  readonly fractureName: string;
  readonly sovereignName: string;
  readonly latinDesignation: string;
  readonly goldenPrimitive: string;
  readonly implementation: string;
  readonly phiAdvantage: number;
  readonly timestamp: number;
}

export interface FractureObservation {
  readonly fractureId: number;
  readonly name: string;
  readonly plane: DimensionalPlane;
  readonly obsvScore: number;       // O(x) = φ^d × R(x) × P(anomaly|x)
  readonly anomalyProb: number;
  readonly resonance: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  FRACTURE ANALYZER
//  Deconstruct any technology to its golden primitives
// ══════════════════════════════════════════════════════════════════

export class FractureAnalyzer {
  readonly name = 'FRACTURE ANALYZER';
  readonly latinName = 'Analysator Fracturarum';

  private analyses: FractureAnalysis[] = [];

  /** Analyze a fracture — decompose to golden primitives */
  analyze(fracture: FractureIntelligence): FractureAnalysis {
    // Map fracture to golden primitives based on category
    const primitiveMap: Record<number, string[]> = {
      0: ['φ-spiral placement', 'Fibonacci reconciliation', 'golden-angle sectors'],
      1: ['φ-weighted state tree', 'Fibonacci-threshold transitions', 'golden graph'],
      2: ['Fibonacci weave', 'golden-ratio boundaries', 'epoch caching'],
      3: ['φ-proportioned spacing', 'Fibonacci grid', 'golden-decay cascade'],
      4: ['golden-weighted types', 'Fibonacci-interval execution', 'φ-inference'],
      5: ['φ-weighted cache', 'Fibonacci revalidation', 'golden hash distribution'],
      6: ['golden multiplex', 'Fibonacci heartbeat', 'φ-weighted priority'],
      7: ['Fibonacci hash chain', 'golden key derivation', 'φ-threshold auth'],
      8: ['φ-weighted test priority', 'Fibonacci test intervals', 'golden audit'],
      9: ['phyllotaxis placement', 'Fibonacci-milestone pipeline', 'golden orchestration'],
    };

    const goldenPrimitives = primitiveMap[fracture.category] ?? ['φ-generic'];

    // Complexity: proportional to fracture description length × golden weight
    const complexityScore = (fracture.fracture.length / 100) * fracture.phiWeight;

    // Sovereign advantage: how much simpler the golden version is
    const sovereignAdvantage = PHI * (1 + 1 / (complexityScore + 1));

    // Zeckendorf decomposition of the Fibonacci identity
    const fibDecomp = this.zeckendorf(fracture.fibonacciIdentity % 1000);

    const analysis: FractureAnalysis = {
      fractureId: fracture.id,
      name: fracture.name,
      category: fracture.categoryName,
      goldenPrimitives,
      complexityScore,
      sovereignAdvantage,
      fibonacciDecomposition: fibDecomp,
      timestamp: Date.now(),
    };

    this.analyses.push(analysis);
    return analysis;
  }

  /** Analyze all fractures in a category */
  analyzeCategory(registry: FractureRegistry, category: FractureCategory): FractureAnalysis[] {
    return registry.byCategory(category).map(f => this.analyze(f));
  }

  /** Analyze all 100 fractures */
  analyzeAll(registry: FractureRegistry): FractureAnalysis[] {
    return registry.fractures.map(f => this.analyze(f));
  }

  getAnalyses(): FractureAnalysis[] {
    return [...this.analyses];
  }

  private zeckendorf(n: number): number[] {
    if (n <= 0) return [];
    const fibs: number[] = [];
    let a = 1, b = 2;
    while (a <= n) {
      fibs.push(a);
      [a, b] = [b, a + b];
    }
    const result: number[] = [];
    let remaining = n;
    for (let j = fibs.length - 1; j >= 0 && remaining > 0; j--) {
      if (fibs[j] <= remaining) {
        result.push(fibs[j]);
        remaining -= fibs[j];
      }
    }
    return result;
  }
}

// ══════════════════════════════════════════════════════════════════
//  FRACTURE COMPARATOR
//  Compare fracture vs. sovereign capability
// ══════════════════════════════════════════════════════════════════

export class FractureComparator {
  readonly name = 'FRACTURE COMPARATOR';
  readonly latinName = 'Comparator Fracturarum';

  private comparisons: FractureComparison[] = [];

  /** Compare two fractures by their golden weight and category */
  compare(a: FractureIntelligence, b: FractureIntelligence): FractureComparison {
    const resonanceDelta = Math.abs(a.phiWeight - b.phiWeight);
    const categoryOverlap = a.category === b.category;

    // The ratio of their weights — if close to φ, they're golden-correlated
    const larger = Math.max(a.phiWeight, b.phiWeight);
    const smaller = Math.min(a.phiWeight, b.phiWeight);
    const goldenRatio = smaller > 0 ? larger / smaller : 0;
    const goldenDeviation = Math.abs(goldenRatio - PHI);

    let verdict: string;
    if (goldenDeviation < 0.1) {
      verdict = `Golden correlation: ${a.name} and ${b.name} are φ-related — they solve complementary problems`;
    } else if (categoryOverlap) {
      verdict = `Same fracture category: ${a.name} and ${b.name} are competing fractures — sovereign unifies them`;
    } else {
      verdict = `Cross-category: ${a.name} (${a.categoryName}) and ${b.name} (${b.categoryName}) — sovereign bridges the gap`;
    }

    const comparison: FractureComparison = {
      fractureA: a.name,
      fractureB: b.name,
      resonanceDelta,
      categoryOverlap,
      goldenRatio,
      verdict,
      timestamp: Date.now(),
    };

    this.comparisons.push(comparison);
    return comparison;
  }

  /** Find all golden-correlated fracture pairs (weight ratio ≈ φ) */
  findGoldenPairs(registry: FractureRegistry): FractureComparison[] {
    const pairs: FractureComparison[] = [];

    for (let i = 0; i < registry.fractures.length; i++) {
      for (let j = i + 1; j < registry.fractures.length; j++) {
        const comp = this.compare(registry.fractures[i], registry.fractures[j]);
        const deviation = Math.abs(comp.goldenRatio - PHI);
        if (deviation < 0.1) {
          pairs.push(comp);
        }
      }
    }

    return pairs;
  }

  getComparisons(): FractureComparison[] {
    return [...this.comparisons];
  }
}

// ══════════════════════════════════════════════════════════════════
//  FRACTURE SYNTHESIZER
//  Generate sovereign alternatives from fracture patterns
// ══════════════════════════════════════════════════════════════════

export class FractureSynthesizer {
  readonly name = 'FRACTURE SYNTHESIZER';
  readonly latinName = 'Synthesista Fracturarum';

  private alternatives: SovereignAlternative[] = [];

  /** Generate a sovereign alternative for a fracture */
  synthesize(fracture: FractureIntelligence): SovereignAlternative {
    const alt: SovereignAlternative = {
      fractureName: fracture.name,
      sovereignName: `NOVA-${fracture.name.toUpperCase().replace(/[^A-Z0-9]/g, '')}`,
      latinDesignation: fracture.latinDesignation.replace(/FRAGMENTORUM|MECHANICA|REACTIVA/, 'SOVRANA'),
      goldenPrimitive: fracture.sovereign,
      implementation: `Sovereign organism replacing ${fracture.name}: ${fracture.sovereign}. ` +
        `φ-weight=${fracture.phiWeight.toFixed(4)}, ` +
        `Fibonacci identity=${fracture.fibonacciIdentity}, ` +
        `phyllotaxis position=(${fracture.phyllotaxisX.toFixed(4)}, ${fracture.phyllotaxisY.toFixed(4)})`,
      phiAdvantage: PHI * fracture.phiWeight,
      timestamp: Date.now(),
    };

    this.alternatives.push(alt);
    return alt;
  }

  /** Synthesize sovereign alternatives for all fractures */
  synthesizeAll(registry: FractureRegistry): SovereignAlternative[] {
    return registry.fractures.map(f => this.synthesize(f));
  }

  getAlternatives(): SovereignAlternative[] {
    return [...this.alternatives];
  }
}

// ══════════════════════════════════════════════════════════════════
//  FRACTURE OBSERVER
//  OBSV integration: observe fractures across dimensional planes
// ══════════════════════════════════════════════════════════════════

export class FractureObserver {
  readonly name = 'FRACTURE OBSERVER';
  readonly latinName = 'Observator Fracturarum';

  private observations: FractureObservation[] = [];

  /**
   * Observe a fracture across a dimensional plane.
   * Applies O(x) = φ^d × R(x) × P(anomaly|x) to the fracture.
   */
  observe(fracture: FractureIntelligence, plane: DimensionalPlane): FractureObservation {
    const d = plane as number;
    const phiD = Math.pow(PHI, d);

    // Resonance: derived from the fracture's golden-angle position
    const resonance = Math.abs(Math.sin(fracture.goldenAnglePosition)) * phiD;

    // Anomaly: how far the fracture deviates from golden norms
    // Higher weight = more established = less anomalous
    const anomalyProb = 1 / (fracture.phiWeight + 1);

    // O(x) = φ^d × R(x) × P(anomaly|x)
    const obsvScore = phiD * resonance * anomalyProb;

    const obs: FractureObservation = {
      fractureId: fracture.id,
      name: fracture.name,
      plane,
      obsvScore,
      anomalyProb,
      resonance,
      timestamp: Date.now(),
    };

    this.observations.push(obs);
    return obs;
  }

  /** Observe all fractures across all dimensional planes */
  observeAll(registry: FractureRegistry): FractureObservation[] {
    const results: FractureObservation[] = [];

    for (const fracture of registry.fractures) {
      // Each fracture is observed from its category-mapped dimensional plane
      const plane = (fracture.category % 5) as DimensionalPlane;
      results.push(this.observe(fracture, plane));
    }

    return results;
  }

  /** Get fractures with anomaly probability above φ/(φ+1) threshold */
  detectAnomalies(): FractureObservation[] {
    const threshold = PHI / (PHI + 1);
    return this.observations.filter(o => o.anomalyProb > threshold);
  }

  getObservations(): FractureObservation[] {
    return [...this.observations];
  }
}
