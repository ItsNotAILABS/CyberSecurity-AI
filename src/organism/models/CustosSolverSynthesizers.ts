///
/// CUSTOS SOLVER/SYNTHESIZERS
///
/// 🧪 DIAGNOSTICA HARMONICA — Cross-division care pattern recognition
///    with φ-harmonic wellness analysis.  Groups node wellness data by
///    golden-section bands and detects cross-division correlations.
///
/// 🧪 THEORICUS VITAE — Care theory proving
///    hypothesize → validate → test → refine
///
/// These are the deep-thinking arms of CUSTOS.  While the care divisions
/// watch and heal, the solvers find hidden wellness patterns nobody else
/// can see and prove theories nobody else can test.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from '../intelligence/ObserverIntelligence.js';

import {
  type NodeRecord,
  type CareEvent,
  type HabitatStatus,
  type WellnessLevel,
  type CareDivision,
} from '../intelligence/CustosIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface WellnessPattern {
  readonly pattern: string;
  readonly confidence: number;
  readonly divisions: CareDivision[];
  readonly proof: string;
  readonly timestamp: number;
}

export interface CareGap {
  readonly nodeId: number;
  readonly gapType: 'orphaned' | 'stale' | 'unchecked' | 'overloaded';
  readonly severity: number;
  readonly recommendation: string;
  readonly timestamp: number;
}

export type CareHypothesis =
  | 'recovery_frequency'
  | 'habitat_correlation'
  | 'adoption_advantage'
  | 'depth_impact'
  | 'stress_cascade';

export interface CareTheoryResult {
  readonly hypothesis: CareHypothesis;
  readonly validated: boolean;
  readonly confidence: number;
  readonly evidence: string;
  readonly sampleSize: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  DIAGNOSTICA HARMONICA
//  Cross-division care pattern recognition with φ-harmonic analysis
// ══════════════════════════════════════════════════════════════════

export class DiagnosticaHarmonica {
  readonly name = 'DIAGNOSTICA HARMONICA';
  readonly latinName = 'Cross-Division Care Pattern Recognizer';
  readonly role = 'Find what connects — the hidden golden threads between care divisions';

  private results: WellnessPattern[] = [];

  /**
   * Detect cross-division care patterns using golden-ratio wellness bands.
   * Groups nodes by φ-band wellness thresholds:
   *   Band 0: φ^−3 ≈ 0.236
   *   Band 1: φ^−2 ≈ 0.382
   *   Band 2: φ^−1 ≈ 0.618
   *   Band 3: 1.0
   *   Band 4: φ   ≈ 1.618
   */
  synthesize(nodes: NodeRecord[], events: CareEvent[]): WellnessPattern[] {
    const bandBoundaries = [
      1 / (PHI * PHI * PHI), // φ^−3 ≈ 0.236
      1 / (PHI * PHI),       // φ^−2 ≈ 0.382
      1 / PHI,               // φ^−1 ≈ 0.618
      1.0,                   // 1.0
      PHI,                   // φ   ≈ 1.618
    ];

    const newResults: WellnessPattern[] = [];

    for (let bandIdx = 0; bandIdx < bandBoundaries.length; bandIdx++) {
      const bound = bandBoundaries[bandIdx];
      const divisionsHit = new Set<CareDivision>();
      let matchCount = 0;
      let totalHealth = 0;

      for (const node of nodes) {
        if (Math.abs(node.health - bound) < 1 / PHI) {
          matchCount++;
          totalHealth += node.health;

          // Find which divisions contributed events for this node
          for (const ev of events) {
            if (ev.nodeId === node.id) {
              divisionsHit.add(ev.division);
            }
          }
        }
      }

      if (matchCount > 1 && divisionsHit.size > 1) {
        const confidence = matchCount > 0
          ? totalHealth / matchCount / PHI
          : 0;

        const result: WellnessPattern = {
          pattern: `Cross-division wellness band φ^${bandIdx - 3}`,
          confidence,
          divisions: Array.from(divisionsHit),
          proof: `Wellness correlation at band ${bound.toFixed(4)} ` +
            `across ${divisionsHit.size} divisions, ${matchCount} nodes`,
          timestamp: Date.now(),
        };
        newResults.push(result);
        this.results.push(result);
      }
    }

    return newResults;
  }

  /**
   * Detect care gaps — nodes that should be receiving care but aren't.
   * Finds orphaned nodes, stale checks, unchecked high-stress nodes,
   * and overloaded habitats.
   */
  detectCareGaps(nodes: NodeRecord[], habitats: HabitatStatus[]): CareGap[] {
    const gaps: CareGap[] = [];
    const now = Date.now();
    const STALE_THRESHOLD_MS = 60_000; // 1 minute considered stale

    for (const node of nodes) {
      // Orphaned: adopted node with zero care score
      if (node.adopted && node.careScore === 0) {
        gaps.push({
          nodeId: node.id,
          gapType: 'orphaned',
          severity: 1 / PHI, // ≈ 0.618
          recommendation: `Adopted node "${node.name}" has zero care score — assign a care division`,
          timestamp: now,
        });
      }

      // Stale: last check too long ago
      if (node.lastCheck > 0 && (now - node.lastCheck) > STALE_THRESHOLD_MS) {
        const staleness = (now - node.lastCheck) / STALE_THRESHOLD_MS;
        gaps.push({
          nodeId: node.id,
          gapType: 'stale',
          severity: Math.min(staleness / PHI, 1.0),
          recommendation: `Node "${node.name}" last checked ${Math.round(staleness)}× past threshold — schedule immediate check`,
          timestamp: now,
        });
      }

      // Unchecked: high stress but no recent check
      if (node.stress > 1 / PHI && node.lastCheck === 0) {
        gaps.push({
          nodeId: node.id,
          gapType: 'unchecked',
          severity: node.stress,
          recommendation: `Node "${node.name}" has stress=${node.stress.toFixed(3)} but has never been checked`,
          timestamp: now,
        });
      }

      // Overloaded: very high stress with low health
      if (node.stress > 1 / PHI && node.health < 1 / (PHI * PHI)) {
        gaps.push({
          nodeId: node.id,
          gapType: 'overloaded',
          severity: node.stress * (1 - node.health),
          recommendation: `Node "${node.name}" is overloaded (stress=${node.stress.toFixed(3)}, health=${node.health.toFixed(3)}) — initiate emergency recovery`,
          timestamp: now,
        });
      }
    }

    return gaps;
  }

  getResults(): WellnessPattern[] {
    return [...this.results];
  }
}

// ══════════════════════════════════════════════════════════════════
//  THEORICUS VITAE
//  Care theory proving: hypothesize → validate → test → refine
// ══════════════════════════════════════════════════════════════════

export class TheoricusVitae {
  readonly name = 'THEORICUS VITAE';
  readonly latinName = 'Care Theory Prover';
  readonly role = 'Prove what is suspected — test golden theories about organism life';

  private theories: CareTheoryResult[] = [];

  /**
   * Test a hypothesis about organism wellness.
   *
   * Supported hypotheses:
   *   recovery_frequency  — recovery cycles at Fibonacci intervals → better outcomes
   *   habitat_correlation — habitat integrity correlates with node wellness
   *   adoption_advantage  — adopted nodes recover faster/slower than native nodes
   *   depth_impact        — deeper nodes have lower care scores
   *   stress_cascade      — stressed nodes cluster near other stressed nodes
   *
   * Process: hypothesize → validate → test → refine
   */
  testHypothesis(
    hypothesis: CareHypothesis,
    nodes: NodeRecord[],
    events: CareEvent[],
  ): CareTheoryResult {
    switch (hypothesis) {
      case 'recovery_frequency':
        return this.testRecoveryFrequency(nodes, events);
      case 'habitat_correlation':
        return this.testHabitatCorrelation(nodes, events);
      case 'adoption_advantage':
        return this.testAdoptionAdvantage(nodes, events);
      case 'depth_impact':
        return this.testDepthImpact(nodes);
      case 'stress_cascade':
        return this.testStressCascade(nodes);
    }
  }

  /**
   * Test all 5 standard hypotheses automatically.
   */
  testAllHypotheses(
    nodes: NodeRecord[],
    events: CareEvent[],
  ): CareTheoryResult[] {
    const hypotheses: CareHypothesis[] = [
      'recovery_frequency',
      'habitat_correlation',
      'adoption_advantage',
      'depth_impact',
      'stress_cascade',
    ];

    const newTheories: CareTheoryResult[] = [];
    for (const h of hypotheses) {
      const theory = this.testHypothesis(h, nodes, events);
      newTheories.push(theory);
    }
    return newTheories;
  }

  getTheories(): CareTheoryResult[] {
    return [...this.theories];
  }

  // ── Private hypothesis testers ──────────────────────────────────

  /**
   * Do recovery cycles at higher frequency correlate with higher wellness?
   * Expected: nodes with more recoveries should have higher health.
   */
  private testRecoveryFrequency(
    nodes: NodeRecord[],
    _events: CareEvent[],
  ): CareTheoryResult {
    let correlations = 0;
    let comparisons = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        comparisons++;
        const moreRecoveries = nodes[i].recoveries > nodes[j].recoveries;
        const betterHealth = nodes[i].health > nodes[j].health;
        if (moreRecoveries === betterHealth) {
          correlations++;
        }
      }
    }

    const confidence = comparisons > 0 ? correlations / comparisons : 0;

    const theory: CareTheoryResult = {
      hypothesis: 'recovery_frequency',
      validated: confidence > 1 / PHI,
      confidence,
      evidence: `${correlations}/${comparisons} node pairs show recovery↔health correlation`,
      sampleSize: nodes.length,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  /**
   * Does habitat temperature deviation correlate with node stress?
   * Expected: nodes in events from deviating habitats show higher stress.
   */
  private testHabitatCorrelation(
    nodes: NodeRecord[],
    events: CareEvent[],
  ): CareTheoryResult {
    // Use events from 'habitator' division as proxy for habitat influence
    const habitatorNodeIds = new Set<number>();
    for (const ev of events) {
      if (ev.division === 'habitator') {
        habitatorNodeIds.add(ev.nodeId);
      }
    }

    let affectedStress = 0;
    let affectedCount = 0;
    let unaffectedStress = 0;
    let unaffectedCount = 0;

    for (const node of nodes) {
      if (habitatorNodeIds.has(node.id)) {
        affectedStress += node.stress;
        affectedCount++;
      } else {
        unaffectedStress += node.stress;
        unaffectedCount++;
      }
    }

    const avgAffected = affectedCount > 0 ? affectedStress / affectedCount : 0;
    const avgUnaffected = unaffectedCount > 0 ? unaffectedStress / unaffectedCount : 0;

    const sampleSize = affectedCount + unaffectedCount;
    const difference = avgAffected - avgUnaffected;
    const confidence = sampleSize > 0
      ? Math.min(Math.abs(difference) * PHI, 1.0)
      : 0;

    const theory: CareTheoryResult = {
      hypothesis: 'habitat_correlation',
      validated: confidence > 1 / PHI && difference > 0,
      confidence,
      evidence: `Habitat-affected nodes avg stress=${avgAffected.toFixed(4)} ` +
        `vs unaffected=${avgUnaffected.toFixed(4)}, Δ=${difference.toFixed(4)}`,
      sampleSize,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  /**
   * Do adopted nodes recover faster or slower than native nodes?
   * Compares average health improvement across care events.
   */
  private testAdoptionAdvantage(
    nodes: NodeRecord[],
    events: CareEvent[],
  ): CareTheoryResult {
    const adoptedIds = new Set<number>();
    for (const node of nodes) {
      if (node.adopted) {
        adoptedIds.add(node.id);
      }
    }

    let adoptedImprovement = 0;
    let adoptedCount = 0;
    let nativeImprovement = 0;
    let nativeCount = 0;

    for (const ev of events) {
      const delta = ev.newHealth - ev.priorHealth;
      if (adoptedIds.has(ev.nodeId)) {
        adoptedImprovement += delta;
        adoptedCount++;
      } else {
        nativeImprovement += delta;
        nativeCount++;
      }
    }

    const avgAdopted = adoptedCount > 0 ? adoptedImprovement / adoptedCount : 0;
    const avgNative = nativeCount > 0 ? nativeImprovement / nativeCount : 0;

    const sampleSize = adoptedCount + nativeCount;
    const advantage = avgAdopted - avgNative;
    const confidence = sampleSize > 0
      ? Math.min(Math.abs(advantage) * PHI * PHI, 1.0)
      : 0;

    const theory: CareTheoryResult = {
      hypothesis: 'adoption_advantage',
      validated: confidence > 1 / PHI,
      confidence,
      evidence: `Adopted avg improvement=${avgAdopted.toFixed(4)} ` +
        `vs native=${avgNative.toFixed(4)}, advantage=${advantage.toFixed(4)}`,
      sampleSize,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  /**
   * Do deeper nodes in the organism tree have lower care scores?
   * Expected: careScore = φ^(−d) × H × (1−S), so deeper → lower.
   */
  private testDepthImpact(nodes: NodeRecord[]): CareTheoryResult {
    let correlations = 0;
    let comparisons = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        comparisons++;
        const deeperNode = nodes[i].depth > nodes[j].depth;
        const lowerScore = nodes[i].careScore < nodes[j].careScore;
        if (deeperNode === lowerScore) {
          correlations++;
        }
      }
    }

    const confidence = comparisons > 0 ? correlations / comparisons : 0;

    const theory: CareTheoryResult = {
      hypothesis: 'depth_impact',
      validated: confidence > 1 / PHI,
      confidence,
      evidence: `${correlations}/${comparisons} pairs confirm depth↔careScore inverse correlation`,
      sampleSize: nodes.length,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  /**
   * Do stressed nodes cluster near other stressed nodes (by depth proximity)?
   * Tests whether stress cascades through nearby organism layers.
   */
  private testStressCascade(nodes: NodeRecord[]): CareTheoryResult {
    const STRESS_THRESHOLD = 1 / PHI; // ≈ 0.618
    let cascadePairs = 0;
    let adjacentPairs = 0;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.abs(nodes[i].depth - nodes[j].depth) <= 1) {
          adjacentPairs++;
          if (nodes[i].stress > STRESS_THRESHOLD && nodes[j].stress > STRESS_THRESHOLD) {
            cascadePairs++;
          }
        }
      }
    }

    const confidence = adjacentPairs > 0 ? cascadePairs / adjacentPairs : 0;

    const theory: CareTheoryResult = {
      hypothesis: 'stress_cascade',
      validated: confidence > 1 / (PHI * PHI), // ≈ 0.382 — lower bar for cascade detection
      confidence,
      evidence: `${cascadePairs}/${adjacentPairs} adjacent pairs both stressed (threshold=${STRESS_THRESHOLD.toFixed(4)})`,
      sampleSize: nodes.length,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }
}
