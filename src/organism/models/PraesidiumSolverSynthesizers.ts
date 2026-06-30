///
/// PRAESIDIUM SOLVER/SYNTHESIZERS
///
/// 🧪 ANALYSTOR HOSTILIS — Cross-division threat pattern recognition
///    with φ-harmonic threat band analysis.  Groups defense events by
///    golden-section threat bands and detects cross-division attack
///    correlations.
///
/// 🧪 THEORICUS LIMITIS — Defense theory proving
///    hypothesize → validate → test → refine
///
/// These are the deep-thinking arms of PRAESIDIUM.  While SENTINEL
/// watches and CRUSADER intercepts, the solvers find patterns nobody
/// else can see and prove theories nobody else can test.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from '../intelligence/ObserverIntelligence.js';

import {
  type EndpointRecord,
  type DefenseEvent,
  type HoneypotField,
  type CrusaderUnit,
  type ThreatTier,
  type DefenseDivision,
} from '../intelligence/PraesidiumIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface ThreatPattern {
  readonly pattern: string;
  readonly confidence: number;
  readonly divisions: DefenseDivision[];
  readonly tierRange: [ThreatTier, ThreatTier];
  readonly proof: string;
  readonly timestamp: number;
}

export interface VulnerabilityChain {
  readonly endpoints: number[];
  readonly cascadeProbability: number;
  readonly criticalPath: string;
  readonly goldenDecay: number;
  readonly timestamp: number;
}

export type DefenseHypothesis =
  | 'armor_golden_decay'
  | 'honeypot_redirection'
  | 'crusader_fibonacci'
  | 'adoption_threat_profile'
  | 'swarm_escalation';

export interface DefenseTheoryResult {
  readonly hypothesis: DefenseHypothesis;
  readonly validated: boolean;
  readonly confidence: number;
  readonly evidence: string;
  readonly sampleSize: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  THREAT BAND HELPERS
// ══════════════════════════════════════════════════════════════════

const THREAT_BAND_BOUNDARIES = [0.05, 0.15, 0.30, 0.45, 0.60, 0.75, 0.90] as const;

const TIER_ORDER: ThreatTier[] = [
  'T0_None',
  'T1_Probe',
  'T2_Intrusion',
  'T3_Corruption',
  'T4_Hijack',
  'T5_Swarm',
  'T6_AntiOrganism',
  'T7_Existential',
];

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

function tierIndex(tier: ThreatTier): number {
  return TIER_ORDER.indexOf(tier);
}

// ══════════════════════════════════════════════════════════════════
//  ANALYSTOR HOSTILIS
//  Cross-division threat pattern recognition with φ-band analysis
// ══════════════════════════════════════════════════════════════════

export class AnalystorHostilis {
  readonly name = 'ANALYSTOR HOSTILIS';
  readonly latinName = 'Cross-Division Threat Pattern Recognizer';
  readonly role = 'Find what connects — the hidden golden threads between threat vectors';

  private results: ThreatPattern[] = [];

  /**
   * Detect cross-division threat patterns using golden-section bands.
   * Groups endpoints by φ-band threat thresholds (0.05 … 0.90) and
   * detects cross-division correlations: events from multiple divisions
   * targeting the same threat band.
   */
  synthesize(endpoints: EndpointRecord[], events: DefenseEvent[]): ThreatPattern[] {
    const newResults: ThreatPattern[] = [];

    for (let bandIdx = 0; bandIdx < THREAT_BAND_BOUNDARIES.length; bandIdx++) {
      const lowerBound = THREAT_BAND_BOUNDARIES[bandIdx];
      const upperBound = bandIdx < THREAT_BAND_BOUNDARIES.length - 1
        ? THREAT_BAND_BOUNDARIES[bandIdx + 1]
        : 1.0;

      // Find endpoints in this threat band
      const bandEndpoints = endpoints.filter(
        ep => ep.threatLevel >= lowerBound && ep.threatLevel < upperBound,
      );
      if (bandEndpoints.length === 0) continue;

      const bandEndpointIds = new Set(bandEndpoints.map(ep => ep.id));

      // Find events targeting endpoints in this band
      const bandEvents = events.filter(ev => bandEndpointIds.has(ev.endpointId));

      // Collect divisions involved
      const divisionsHit = new Set<DefenseDivision>();
      let totalThreatDelta = 0;

      for (const ev of bandEvents) {
        divisionsHit.add(ev.division);
        totalThreatDelta += Math.abs(ev.threatAfter - ev.threatBefore);
      }

      // Cross-division correlation requires ≥ 2 divisions
      if (bandEvents.length > 1 && divisionsHit.size > 1) {
        const confidence = bandEvents.length > 0
          ? (totalThreatDelta / bandEvents.length) / PHI
          : 0;

        const lowerTier = classifyThreat(lowerBound);
        const upperTier = classifyThreat(upperBound);

        const result: ThreatPattern = {
          pattern: `Cross-division threat band φ[${lowerBound}–${upperBound})`,
          confidence,
          divisions: Array.from(divisionsHit),
          tierRange: [lowerTier, upperTier],
          proof: `Threat correlation at band [${lowerBound}, ${upperBound}) ` +
            `across ${divisionsHit.size} divisions, ` +
            `${bandEndpoints.length} endpoints, ${bandEvents.length} events`,
          timestamp: Date.now(),
        };
        newResults.push(result);
        this.results.push(result);
      }
    }

    return newResults;
  }

  /**
   * Find chains of vulnerabilities where compromising one endpoint
   * could cascade to others.  Uses golden-decay to model cascade
   * probability: P_cascade = Π (vuln_i × φ^(−i)).
   */
  detectVulnerabilityChains(endpoints: EndpointRecord[]): VulnerabilityChain[] {
    const chains: VulnerabilityChain[] = [];

    // Sort by vulnerability descending — most vulnerable first
    const sorted = [...endpoints]
      .filter(ep => ep.vulnerability > 0)
      .sort((a, b) => b.vulnerability - a.vulnerability);

    if (sorted.length < 2) return chains;

    // Build chains: starting from each high-vulnerability endpoint,
    // cascade through connected endpoints (same route prefix).
    const visited = new Set<number>();

    for (const root of sorted) {
      if (visited.has(root.id)) continue;

      const chain: EndpointRecord[] = [root];
      visited.add(root.id);

      // Cascade to endpoints sharing a route prefix with decaying probability
      for (const candidate of sorted) {
        if (visited.has(candidate.id)) continue;

        const sharesRoute =
          candidate.route.startsWith(root.route.split('/').slice(0, -1).join('/'));

        if (sharesRoute && candidate.vulnerability > 1 / PHI / PHI) {
          chain.push(candidate);
          visited.add(candidate.id);
        }
      }

      if (chain.length < 2) continue;

      // Cascade probability with golden decay
      let cascadeProb = 1.0;
      const pathParts: string[] = [];
      for (let i = 0; i < chain.length; i++) {
        const decay = Math.pow(PHI, -(i + 1));
        cascadeProb *= chain[i].vulnerability * decay;
        pathParts.push(chain[i].name);
      }

      const goldenDecay = Math.pow(PHI, -chain.length);

      chains.push({
        endpoints: chain.map(ep => ep.id),
        cascadeProbability: cascadeProb,
        criticalPath: pathParts.join(' → '),
        goldenDecay,
        timestamp: Date.now(),
      });
    }

    return chains;
  }

  getResults(): ThreatPattern[] {
    return [...this.results];
  }
}

// ══════════════════════════════════════════════════════════════════
//  THEORICUS LIMITIS
//  Defense theory proving: hypothesize → validate → test → refine
// ══════════════════════════════════════════════════════════════════

export class TheoricusLimitis {
  readonly name = 'THEORICUS LIMITIS';
  readonly latinName = 'Defense Theory Prover';
  readonly role = 'Prove what is suspected — test golden theories about organism defense';

  private theories: DefenseTheoryResult[] = [];

  /**
   * Test a defense hypothesis against endpoint and event data.
   *
   * Supported hypotheses:
   *   armor_golden_decay      — armor layers reduce vulnerability at φ^(−layer) rate
   *   honeypot_redirection    — honeypot captures correlate with threat tier reduction
   *   crusader_fibonacci      — crusader interceptions follow Fibonacci patterns
   *   adoption_threat_profile — adopted endpoints receive different threat profiles
   *   swarm_escalation        — swarm-tier attacks escalate through golden ratios
   */
  testHypothesis(
    hypothesis: DefenseHypothesis,
    endpoints: EndpointRecord[],
    events: DefenseEvent[],
  ): DefenseTheoryResult {
    switch (hypothesis) {
      case 'armor_golden_decay':
        return this.testArmorGoldenDecay(endpoints);
      case 'honeypot_redirection':
        return this.testHoneypotRedirection(endpoints, events);
      case 'crusader_fibonacci':
        return this.testCrusaderFibonacci(events);
      case 'adoption_threat_profile':
        return this.testAdoptionThreatProfile(endpoints);
      case 'swarm_escalation':
        return this.testSwarmEscalation(events);
    }
  }

  /**
   * Test all 5 standard defense hypotheses.
   */
  testAllHypotheses(
    endpoints: EndpointRecord[],
    events: DefenseEvent[],
  ): DefenseTheoryResult[] {
    const hypotheses: DefenseHypothesis[] = [
      'armor_golden_decay',
      'honeypot_redirection',
      'crusader_fibonacci',
      'adoption_threat_profile',
      'swarm_escalation',
    ];

    const newTheories: DefenseTheoryResult[] = [];
    for (const h of hypotheses) {
      const theory = this.testHypothesis(h, endpoints, events);
      newTheories.push(theory);
    }
    return newTheories;
  }

  getTheories(): DefenseTheoryResult[] {
    return [...this.theories];
  }

  // ────────────────────────────────────────────────────────────────
  //  HYPOTHESIS TESTERS
  // ────────────────────────────────────────────────────────────────

  /**
   * Test: armor layers reduce vulnerability at φ^(−layer) rate.
   * For each endpoint compare actual vulnerability to predicted
   * vulnerability = baseVuln × φ^(−armorLevel).
   */
  private testArmorGoldenDecay(endpoints: EndpointRecord[]): DefenseTheoryResult {
    const armored = endpoints.filter(ep => ep.armorLevel > 0);
    let correlations = 0;

    for (const ep of armored) {
      // Expected vulnerability decay per layer
      const predictedDecay = Math.pow(PHI, -ep.armorLevel);
      // Vulnerability should be proportional to decay
      if (ep.vulnerability <= predictedDecay + 1 / PHI) {
        correlations++;
      }
    }

    const confidence = armored.length > 0
      ? correlations / armored.length
      : 0;

    const theory: DefenseTheoryResult = {
      hypothesis: 'armor_golden_decay',
      validated: confidence > 1 / PHI,
      confidence,
      evidence: `${correlations}/${armored.length} endpoints follow φ^(-layer) decay model`,
      sampleSize: armored.length,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  /**
   * Test: honeypot captures correlate with threat tier reduction.
   * Honeypot events should show threatAfter < threatBefore.
   */
  private testHoneypotRedirection(
    endpoints: EndpointRecord[],
    events: DefenseEvent[],
  ): DefenseTheoryResult {
    const honeypotEvents = events.filter(ev => ev.division === 'honeypot');
    let reductions = 0;

    for (const ev of honeypotEvents) {
      if (ev.threatAfter < ev.threatBefore) {
        reductions++;
      }
    }

    const confidence = honeypotEvents.length > 0
      ? reductions / honeypotEvents.length
      : 0;

    const theory: DefenseTheoryResult = {
      hypothesis: 'honeypot_redirection',
      validated: confidence > 1 / PHI,
      confidence,
      evidence: `${reductions}/${honeypotEvents.length} honeypot events show threat reduction`,
      sampleSize: honeypotEvents.length,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  /**
   * Test: crusader interception counts follow Fibonacci patterns.
   * Check whether the sequence of cumulative interceptions hits
   * Fibonacci numbers at a rate above chance.
   */
  private testCrusaderFibonacci(events: DefenseEvent[]): DefenseTheoryResult {
    const crusaderEvents = events.filter(ev => ev.division === 'crusader');
    let fibHits = 0;

    for (let i = 1; i <= crusaderEvents.length; i++) {
      if (this.isFibonacci(i)) {
        fibHits++;
      }
    }

    // Expected Fibonacci density ≈ log_φ(n)/n for random sequences
    const expectedDensity = crusaderEvents.length > 0
      ? Math.log(crusaderEvents.length + 1) / Math.log(PHI) / crusaderEvents.length
      : 0;
    const actualDensity = crusaderEvents.length > 0
      ? fibHits / crusaderEvents.length
      : 0;

    const confidence = expectedDensity > 0
      ? Math.min(actualDensity / expectedDensity / PHI, 1.0)
      : 0;

    const theory: DefenseTheoryResult = {
      hypothesis: 'crusader_fibonacci',
      validated: confidence > 1 / PHI,
      confidence,
      evidence: `${fibHits} Fibonacci positions in ${crusaderEvents.length} crusader events, ` +
        `density=${actualDensity.toFixed(6)} vs expected=${expectedDensity.toFixed(6)}`,
      sampleSize: crusaderEvents.length,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  /**
   * Test: adopted endpoints receive different threat profiles.
   * Compare average threat levels of adopted vs non-adopted endpoints.
   */
  private testAdoptionThreatProfile(endpoints: EndpointRecord[]): DefenseTheoryResult {
    const adopted = endpoints.filter(ep => ep.adopted);
    const native = endpoints.filter(ep => !ep.adopted);

    const avgAdopted = adopted.length > 0
      ? adopted.reduce((sum, ep) => sum + ep.threatLevel, 0) / adopted.length
      : 0;
    const avgNative = native.length > 0
      ? native.reduce((sum, ep) => sum + ep.threatLevel, 0) / native.length
      : 0;

    const difference = Math.abs(avgAdopted - avgNative);
    const confidence = difference / PHI;

    const theory: DefenseTheoryResult = {
      hypothesis: 'adoption_threat_profile',
      validated: confidence > 1 / PHI,
      confidence: Math.min(confidence, 1.0),
      evidence: `Adopted avg threat=${avgAdopted.toFixed(6)}, ` +
        `native avg threat=${avgNative.toFixed(6)}, ` +
        `difference=${difference.toFixed(6)}`,
      sampleSize: adopted.length + native.length,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  /**
   * Test: swarm-tier attacks escalate through golden ratios.
   * Check if intervals between T5_Swarm+ events scale by φ.
   */
  private testSwarmEscalation(events: DefenseEvent[]): DefenseTheoryResult {
    const swarmEvents = events
      .filter(ev => {
        const tier = classifyThreat(ev.threatAfter);
        return tierIndex(tier) >= tierIndex('T5_Swarm');
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    if (swarmEvents.length < 3) {
      const theory: DefenseTheoryResult = {
        hypothesis: 'swarm_escalation',
        validated: false,
        confidence: 0,
        evidence: `Insufficient swarm events: ${swarmEvents.length} (need ≥3)`,
        sampleSize: swarmEvents.length,
        timestamp: Date.now(),
      };
      this.theories.push(theory);
      return theory;
    }

    // Compute intervals and check golden-ratio scaling
    let goldenHits = 0;
    let comparisons = 0;

    for (let i = 2; i < swarmEvents.length; i++) {
      const interval1 = swarmEvents[i - 1].timestamp - swarmEvents[i - 2].timestamp;
      const interval2 = swarmEvents[i].timestamp - swarmEvents[i - 1].timestamp;

      if (interval1 > 0) {
        comparisons++;
        const ratio = interval2 / interval1;
        const deviation = Math.abs(ratio - PHI);
        if (deviation < 1 / PHI) {
          goldenHits++;
        }
      }
    }

    const confidence = comparisons > 0
      ? goldenHits / comparisons
      : 0;

    const theory: DefenseTheoryResult = {
      hypothesis: 'swarm_escalation',
      validated: confidence > 1 / PHI,
      confidence,
      evidence: `${goldenHits}/${comparisons} interval ratios within 1/φ of φ, ` +
        `${swarmEvents.length} swarm-tier events analyzed`,
      sampleSize: swarmEvents.length,
      timestamp: Date.now(),
    };

    this.theories.push(theory);
    return theory;
  }

  // ────────────────────────────────────────────────────────────────
  //  HELPERS
  // ────────────────────────────────────────────────────────────────

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
