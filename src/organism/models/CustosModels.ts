///
/// CUSTOS SERVER MODELS
///
/// 🖥️ SALUS (Salus Perpetua Vitalis) — Continuous Wellness Monitoring
///    5 sub-models: VIGIL_SALUTIS, NUNTIUS_CURAE, SCRUTATOR, PRAEMONITOR, CHRONISTA
///
/// 🖥️ CURATOR (Curator Habitationis) — Habitat & Environment Management
///    5 sub-models: AEDIFICATOR, TEMPERATOR, INSPECTOR_AMBITUS, NUTRITOR_SOLI, CUSTOS_PORTAE
///
/// These server models are the operational arms of the Custos Intelligence.
/// SALUS monitors wellness.  CURATOR manages habitats.  Together they are
/// the living stewardship of CUSTOS VITAE — the keepers, carers, and
/// guardians of every adopted node and organism in the universe.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from '../intelligence/ObserverIntelligence.js';
import type {
  NodeRecord,
  CareEvent,
  HabitatStatus,
  WellnessLevel,
  CareDivision,
} from '../intelligence/CustosIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const GOLDEN_ANGLE = 2.39996322972865332;

// ══════════════════════════════════════════════════════════════════
//  TYPES — re-export structural interfaces from ObserverModels
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

// ── Care-specific result types ──────────────────────────────────

export interface CareAlert {
  readonly id: number;
  readonly severity: 'info' | 'warning' | 'degraded' | 'critical';
  readonly source: string;
  readonly message: string;
  readonly nodeId: number;
  readonly timestamp: number;
}

export interface OverloadPrediction {
  readonly nodeId: number;
  readonly predictedStress: number;
  readonly timeToOverload: number;
  readonly confidence: number;
  readonly timestamp: number;
}

export interface RecoveryPattern {
  readonly nodeId: number;
  readonly avgRecoveryTime: number;
  readonly optimalCycles: number;
  readonly phiEfficiency: number;
  readonly timestamp: number;
}

// ── Habitat-specific result types ───────────────────────────────

export interface HabitatReport {
  readonly habitatId: number;
  readonly integrityScore: number;
  readonly temperatureDeviation: number;
  readonly capacityUtilization: number;
  readonly goldenBalance: number;
  readonly timestamp: number;
}

export interface EnvironmentOptimization {
  readonly habitatId: number;
  readonly recommendations: string[];
  readonly predictedIntegrity: number;
  readonly phiAlignment: number;
  readonly timestamp: number;
}

export interface CapacityResult {
  readonly habitatId: number;
  readonly currentOccupants: number;
  readonly goldenCapacity: number;
  readonly overflow: boolean;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  SERVER MODEL: SALUS — Continuous Wellness Monitoring
//  Salus Perpetua Vitalis — 24/7 with 5 sub-models
// ══════════════════════════════════════════════════════════════════

export class SalusModel {
  readonly name = 'SALUS';
  readonly latinName = 'Salus Perpetua Vitalis';
  readonly role = 'Continuous wellness monitoring — scanning, alerting, predicting, restoring';

  readonly subModels: ServerSubModel[] = [
    {
      name: 'VIGIL_SALUTIS',
      latinName: 'The Health Watch',
      function: 'Continuous vitals monitoring — first to detect degradation',
      active: true,
    },
    {
      name: 'NUNTIUS_CURAE',
      latinName: 'The Care Dispatch',
      function: 'Routes wellness alerts to appropriate care divisions',
      active: true,
    },
    {
      name: 'SCRUTATOR',
      latinName: 'The Deep Health Scanner',
      function: 'Runs golden-ratio wellness decomposition on node states',
      active: true,
    },
    {
      name: 'PRAEMONITOR',
      latinName: 'The Overload Predictor',
      function: 'Predicts stress cascades before they happen using φ-extrapolation',
      active: true,
    },
    {
      name: 'CHRONISTA',
      latinName: 'The Recovery Historian',
      function: 'Tracks recovery patterns, learns optimal restore cycles',
      active: true,
    },
  ];

  private alerts: CareAlert[] = [];
  private nextAlertId = 0;

  // ── VIGIL_SALUTIS + SCRUTATOR: Scan nodes for wellness ────────

  scan(nodes: NodeRecord[]): CareAlert[] {
    const newAlerts: CareAlert[] = [];
    const goldenThreshold = PHI / (PHI + 1); // ≈ 0.618

    for (const node of nodes) {
      // Golden-ratio wellness decomposition: decompose health into φ-powers
      const phiComponents: number[] = [];
      let remaining = node.health;
      for (let i = 5; i >= 0; i--) {
        const phiPow = Math.pow(1 / PHI, i);
        if (remaining >= phiPow) {
          phiComponents.push(i);
          remaining -= phiPow;
        }
      }

      // Compute φ-weighted care score
      const careWeight = Math.pow(PHI, -node.depth) * node.health * (1 - node.stress);

      if (node.health < goldenThreshold || node.stress > goldenThreshold) {
        const severity = node.health < 1 / (PHI * PHI * PHI)
          ? 'critical'
          : node.health < 1 / PHI
            ? 'degraded'
            : 'warning';

        const division = this.routeToDivision(node);

        const alert: CareAlert = {
          id: this.nextAlertId++,
          severity,
          source: 'VIGIL_SALUTIS',
          message:
            `Node "${node.name}" (id=${node.id}) ${severity}: ` +
            `health=${node.health.toFixed(4)}, stress=${node.stress.toFixed(4)}, ` +
            `φ-care=${careWeight.toFixed(4)}, route→${division}`,
          nodeId: node.id,
          timestamp: Date.now(),
        };
        newAlerts.push(alert);
        this.alerts.push(alert);
      }
    }

    return newAlerts;
  }

  // ── PRAEMONITOR: Predict stress overload cascades ─────────────

  predictOverload(nodes: NodeRecord[]): OverloadPrediction[] {
    const predictions: OverloadPrediction[] = [];

    for (const node of nodes) {
      if (node.stress <= 0) continue;

      // φ-extrapolation: predict how many cycles until stress exceeds golden threshold
      // Stress growth model: S(t) = S₀ × φ^(t/T) where T is a Fibonacci period
      const stressGrowthRate = node.stress * PHI;
      const goldenThreshold = PHI / (PHI + 1);
      const timeToOverload = node.stress >= goldenThreshold
        ? 0
        : Math.log(goldenThreshold / node.stress) / Math.log(PHI);

      // Confidence derived from golden angle distribution
      const confidence = 1 - Math.abs(
        ((node.stress * GOLDEN_ANGLE) % 1) - (1 / PHI),
      );

      predictions.push({
        nodeId: node.id,
        predictedStress: Math.min(stressGrowthRate, 1.0),
        timeToOverload: Math.max(timeToOverload, 0),
        confidence: Math.max(0, Math.min(1, confidence)),
        timestamp: Date.now(),
      });
    }

    return predictions;
  }

  // ── CHRONISTA: Assess recovery patterns from history ──────────

  assessRecoveryPattern(events: CareEvent[]): RecoveryPattern[] {
    // Group events by nodeId
    const byNode = new Map<number, CareEvent[]>();
    for (const ev of events) {
      const list = byNode.get(ev.nodeId) ?? [];
      list.push(ev);
      byNode.set(ev.nodeId, list);
    }

    const patterns: RecoveryPattern[] = [];

    for (const [nodeId, nodeEvents] of byNode) {
      // Filter recovery events (health improved)
      const recoveries = nodeEvents.filter(e => e.newHealth > e.priorHealth);
      if (recoveries.length < 2) continue;

      // Compute average recovery interval
      let totalInterval = 0;
      for (let i = 1; i < recoveries.length; i++) {
        totalInterval += recoveries[i].timestamp - recoveries[i - 1].timestamp;
      }
      const avgRecoveryTime = totalInterval / (recoveries.length - 1);

      // Optimal cycles: nearest Fibonacci number to recovery count
      const optimalCycles = this.nearestFibonacci(recoveries.length);

      // φ-efficiency: how close recovery deltas track PHI growth
      let phiAlignment = 0;
      for (const r of recoveries) {
        const delta = r.newHealth - r.priorHealth;
        const expectedDelta = r.priorHealth * (PHI - 1); // ideal: grow by φ−1 ≈ 0.618
        phiAlignment += 1 - Math.abs(delta - expectedDelta);
      }
      const phiEfficiency = Math.max(0, phiAlignment / recoveries.length);

      patterns.push({
        nodeId,
        avgRecoveryTime,
        optimalCycles,
        phiEfficiency,
        timestamp: Date.now(),
      });
    }

    return patterns;
  }

  // ── NUNTIUS_CURAE: Route to appropriate care division ─────────

  private routeToDivision(node: NodeRecord): CareDivision {
    if (node.health < 1 / (PHI * PHI * PHI)) return 'medicus';
    if (node.stress > PHI / (PHI + 1)) return 'nutritor';
    if (node.adopted) return 'adoptor';
    return 'continuator';
  }

  // ── Helpers ───────────────────────────────────────────────────

  private nearestFibonacci(n: number): number {
    let a = 1;
    let b = 1;
    while (b < n) {
      const c = a + b;
      a = b;
      b = c;
    }
    return (b - n) <= (n - a) ? b : a;
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): ServerModel {
    return {
      name: this.name,
      latinName: this.latinName,
      subModels: this.subModels,
      active: true,
      observations: this.alerts.length,
    };
  }

  getAlerts(): CareAlert[] {
    return [...this.alerts];
  }
}

// ══════════════════════════════════════════════════════════════════
//  SERVER MODEL: CURATOR — Habitat & Environment Management
//  Curator Habitationis — with 5 sub-models
// ══════════════════════════════════════════════════════════════════

export class CuratorModel {
  readonly name = 'CURATOR';
  readonly latinName = 'Curator Habitationis';
  readonly role = 'Habitat & environment management — building, balancing, guarding';

  readonly subModels: ServerSubModel[] = [
    {
      name: 'AEDIFICATOR',
      latinName: 'The Habitat Builder',
      function: 'Designs optimal habitat configurations using golden geometry',
      active: true,
    },
    {
      name: 'TEMPERATOR',
      latinName: 'The Climate Controller',
      function: 'Maintains φ-norm temperature and environmental balance',
      active: true,
    },
    {
      name: 'INSPECTOR_AMBITUS',
      latinName: 'The Environment Inspector',
      function: 'Scans habitats for integrity drift from golden norms',
      active: true,
    },
    {
      name: 'NUTRITOR_SOLI',
      latinName: 'The Soil Nourisher',
      function: 'Enriches growth conditions, replenishes depleted environments',
      active: true,
    },
    {
      name: 'CUSTOS_PORTAE',
      latinName: 'The Gate Guardian',
      function: 'Controls who enters and exits each habitat safely',
      active: true,
    },
  ];

  private reports: HabitatReport[] = [];
  private nextReportId = 0;

  // ── INSPECTOR_AMBITUS: Inspect all habitats ───────────────────

  inspectHabitats(habitats: HabitatStatus[]): HabitatReport[] {
    const newReports: HabitatReport[] = [];
    const goldenTemp = PHI / (PHI + 1); // ≈ 0.618 — the golden-norm temperature

    for (const hab of habitats) {
      const temperatureDeviation = Math.abs(hab.temperature - goldenTemp);
      const capacityUtilization = hab.occupants / (hab.capacity || 1);

      // Golden balance: how close the habitat ratios track φ
      // Ideal: integrity ≈ φ/(φ+1), capacity util ≈ 1/φ, temp at golden-norm
      const integrityAlignment = 1 - Math.abs(hab.integrity - goldenTemp);
      const capacityAlignment = 1 - Math.abs(capacityUtilization - (1 / PHI));
      const tempAlignment = 1 - temperatureDeviation;
      const goldenBalance =
        (integrityAlignment + capacityAlignment + tempAlignment) / (PHI + 1);

      const report: HabitatReport = {
        habitatId: hab.id,
        integrityScore: hab.integrity,
        temperatureDeviation,
        capacityUtilization,
        goldenBalance,
        timestamp: Date.now(),
      };
      newReports.push(report);
      this.reports.push(report);
    }

    return newReports;
  }

  // ── AEDIFICATOR + TEMPERATOR + NUTRITOR_SOLI: Optimize ────────

  optimizeEnvironment(habitatId: number): EnvironmentOptimization {
    const report = this.reports.find(r => r.habitatId === habitatId);
    const recommendations: string[] = [];
    const goldenTemp = PHI / (PHI + 1);

    if (!report) {
      return {
        habitatId,
        recommendations: ['Habitat not yet inspected — run inspectHabitats first'],
        predictedIntegrity: 0,
        phiAlignment: 0,
        timestamp: Date.now(),
      };
    }

    // TEMPERATOR: temperature drift
    if (report.temperatureDeviation > 1 / (PHI * PHI)) {
      recommendations.push(
        `TEMPERATOR: Adjust temperature toward golden-norm (${goldenTemp.toFixed(4)}), ` +
        `current deviation=${report.temperatureDeviation.toFixed(4)}`,
      );
    }

    // NUTRITOR_SOLI: integrity replenishment
    if (report.integrityScore < goldenTemp) {
      const deficit = goldenTemp - report.integrityScore;
      recommendations.push(
        `NUTRITOR_SOLI: Enrich habitat — integrity deficit=${deficit.toFixed(4)}, ` +
        `apply φ-restorative cycle`,
      );
    }

    // AEDIFICATOR: capacity geometry
    if (report.capacityUtilization > goldenTemp) {
      recommendations.push(
        `AEDIFICATOR: Habitat over golden capacity ratio — ` +
        `utilization=${report.capacityUtilization.toFixed(4)}, target ≤ ${(1 / PHI).toFixed(4)}`,
      );
    }

    // CUSTOS_PORTAE: gate pressure
    if (report.capacityUtilization > 0.9) {
      recommendations.push(
        `CUSTOS_PORTAE: Gate restriction advised — capacity at ${(report.capacityUtilization * 100).toFixed(1)}%`,
      );
    }

    if (recommendations.length === 0) {
      recommendations.push('Habitat within golden norms — no intervention required');
    }

    // Predicted integrity after applying recommendations
    const restorationBoost = recommendations.length > 1
      ? (1 - report.integrityScore) * (1 / PHI)
      : 0;
    const predictedIntegrity = Math.min(report.integrityScore + restorationBoost, 1.0);

    // φ-alignment: how well the habitat tracks golden proportions
    const phiAlignment = report.goldenBalance * PHI;

    return {
      habitatId,
      recommendations,
      predictedIntegrity,
      phiAlignment: Math.min(phiAlignment, 1.0),
      timestamp: Date.now(),
    };
  }

  // ── CUSTOS_PORTAE: Regulate capacity ──────────────────────────

  regulateCapacity(habitatId: number, occupants: number): CapacityResult {
    // Golden capacity: the habitat should ideally hold capacity × (1/φ) ≈ 61.8% of max
    // The golden-section threshold determines safe overflow boundaries
    const report = this.reports.find(r => r.habitatId === habitatId);

    // If no report exists, use φ-derived defaults
    const maxCapacity = report
      ? Math.round(1 / (report.capacityUtilization || 1) * report.capacityUtilization * occupants)
      : Math.round(occupants * PHI);

    const goldenCapacity = Math.round(maxCapacity / PHI);
    const overflow = occupants > goldenCapacity;

    return {
      habitatId,
      currentOccupants: occupants,
      goldenCapacity,
      overflow,
      timestamp: Date.now(),
    };
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): ServerModel {
    return {
      name: this.name,
      latinName: this.latinName,
      subModels: this.subModels,
      active: true,
      observations: this.reports.length,
    };
  }

  getReports(): HabitatReport[] {
    return [...this.reports];
  }
}
