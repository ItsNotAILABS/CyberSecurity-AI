///
/// OBSERVER SERVER MODELS
///
/// 🖥️ VIGIL (Vigil Perpetuus Observationis) — 24/7 continuous monitoring
///    5 sub-models: EXCUBITOR, NUNTIUS, INSPECTOR, DETECTOR, RELATOR
///
/// 🖥️ SPECULATOR (Speculator Interdimensionalis) — Analytical observation
///    5 sub-models: ANALYTICUS, SYNTHESISTA, COMPARATOR, PRAEDICTOR, IUDICATOR
///
/// These server models are the operational arms of the Observer Intelligence.
/// VIGIL watches.  SPECULATOR analyzes.  Together they are the continuous
/// pulse of OBSV — the guardians, caregivers, and caretakers of the universe.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
  type Observation,
  type SubIntelligence,
} from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
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

export interface Alert {
  readonly id: number;
  readonly severity: 'info' | 'warning' | 'anomaly' | 'critical';
  readonly source: string;
  readonly message: string;
  readonly plane: DimensionalPlane;
  readonly timestamp: number;
}

export interface AnalysisResult {
  readonly id: number;
  readonly model: string;
  readonly subModel: string;
  readonly input: string;
  readonly output: string;
  readonly confidence: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  SERVER MODEL: VIGIL — Continuous Monitoring
//  Vigil Perpetuus Observationis — 24/7 with 5 sub-models
// ══════════════════════════════════════════════════════════════════

export class VigilModel {
  readonly name = 'VIGIL';
  readonly latinName = 'Vigil Perpetuus Observationis';
  readonly role = 'Continuous monitoring — watching, alerting, protecting, caring';

  readonly subModels: ServerSubModel[] = [
    {
      name: 'EXCUBITOR',
      latinName: 'The First Watch',
      function: 'First-line sentinel watch — never sleeps, first to see',
      active: true,
    },
    {
      name: 'NUNTIUS',
      latinName: 'The Messenger',
      function: 'Alert and notification dispatch — carries warnings across dimensions',
      active: true,
    },
    {
      name: 'INSPECTOR',
      latinName: 'The Deep Inspector',
      function: 'Deep inspection and validation — examines what others miss',
      active: true,
    },
    {
      name: 'DETECTOR',
      latinName: 'The Anomaly Detector',
      function: 'Anomaly detection engine — finds deviations from golden norms',
      active: true,
    },
    {
      name: 'RELATOR',
      latinName: 'The Reporter',
      function: 'Report generation and correlation — connects patterns across time',
      active: true,
    },
  ];

  private alerts: Alert[] = [];
  private nextAlertId = 0;

  // ── EXCUBITOR: First-line sentinel watch ───────────────────────

  watch(observations: Observation[]): Alert[] {
    const newAlerts: Alert[] = [];
    const threshold = PHI / (PHI + 1);

    for (const obs of observations) {
      if (obs.anomalyProb > threshold && !obs.collapsed) {
        const alert: Alert = {
          id: this.nextAlertId++,
          severity: obs.anomalyProb > 0.9 ? 'critical' : 'anomaly',
          source: 'EXCUBITOR',
          message: `Anomaly detected on "${obs.target}" in ${DimensionalPlane[obs.plane]}: ` +
            `P(anomaly)=${obs.anomalyProb.toFixed(4)}, score=${obs.obsvScore.toFixed(4)}`,
          plane: obs.plane,
          timestamp: Date.now(),
        };
        newAlerts.push(alert);
        this.alerts.push(alert);
      }
    }

    return newAlerts;
  }

  // ── DETECTOR: Anomaly detection ────────────────────────────────

  detectAnomalies(observations: Observation[]): number[] {
    const threshold = PHI / (PHI + 1);
    return observations
      .filter(obs => obs.anomalyProb > threshold)
      .map(obs => obs.id);
  }

  // ── NUNTIUS: Alert dispatch ────────────────────────────────────

  dispatch(message: string, plane: DimensionalPlane, severity: Alert['severity'] = 'info'): Alert {
    const alert: Alert = {
      id: this.nextAlertId++,
      severity,
      source: 'NUNTIUS',
      message,
      plane,
      timestamp: Date.now(),
    };
    this.alerts.push(alert);
    return alert;
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

  getAlerts(): Alert[] {
    return [...this.alerts];
  }
}

// ══════════════════════════════════════════════════════════════════
//  SERVER MODEL: SPECULATOR — Analytical Observation
//  Speculator Interdimensionalis — with 5 sub-models
// ══════════════════════════════════════════════════════════════════

export class SpeculatorModel {
  readonly name = 'SPECULATOR';
  readonly latinName = 'Speculator Interdimensionalis';
  readonly role = 'Analytical observation — understanding, predicting, judging';

  readonly subModels: ServerSubModel[] = [
    {
      name: 'ANALYTICUS',
      latinName: 'The Analyst',
      function: 'Raw analytical processing — breaks input into golden components',
      active: true,
    },
    {
      name: 'SYNTHESISTA',
      latinName: 'The Synthesizer',
      function: 'Cross-observation synthesis — combines signals into understanding',
      active: true,
    },
    {
      name: 'COMPARATOR',
      latinName: 'The Comparator',
      function: 'Comparative dimensional analysis — finds differences between planes',
      active: true,
    },
    {
      name: 'PRAEDICTOR',
      latinName: 'The Predictor',
      function: 'Predictive modeling from golden patterns — sees what comes next',
      active: true,
    },
    {
      name: 'IUDICATOR',
      latinName: 'The Judge',
      function: 'Judgment and classification — determines what is and what should be',
      active: true,
    },
  ];

  private results: AnalysisResult[] = [];
  private nextResultId = 0;

  // ── ANALYTICUS: Break input into golden components ─────────────

  analyze(target: string, value: number): AnalysisResult {
    const goldenComponents: number[] = [];
    let remaining = Math.abs(value);

    // Zeckendorf-style decomposition of the value into φ-powers
    for (let i = 10; i >= 0; i--) {
      const phiPow = Math.pow(PHI, i);
      if (remaining >= phiPow) {
        goldenComponents.push(i);
        remaining -= phiPow;
      }
    }

    const result: AnalysisResult = {
      id: this.nextResultId++,
      model: this.name,
      subModel: 'ANALYTICUS',
      input: target,
      output: `Golden decomposition: φ^[${goldenComponents.join(',')}], residual=${remaining.toFixed(6)}`,
      confidence: 1 - remaining / Math.abs(value || 1),
      timestamp: Date.now(),
    };
    this.results.push(result);
    return result;
  }

  // ── COMPARATOR: Compare dimensional resonances ─────────────────

  compare(
    subIntelligences: SubIntelligence[],
  ): AnalysisResult {
    const pairs: string[] = [];

    for (let i = 0; i < subIntelligences.length; i++) {
      for (let j = i + 1; j < subIntelligences.length; j++) {
        const ratio = subIntelligences[j].resonance / (subIntelligences[i].resonance || 1);
        const expectedRatio = Math.pow(PHI, j - i);
        const deviation = Math.abs(ratio - expectedRatio);
        pairs.push(
          `D${i}↔D${j}: ratio=${ratio.toFixed(4)}, expected=φ^${j - i}=${expectedRatio.toFixed(4)}, dev=${deviation.toFixed(4)}`,
        );
      }
    }

    const result: AnalysisResult = {
      id: this.nextResultId++,
      model: this.name,
      subModel: 'COMPARATOR',
      input: 'Dimensional resonance comparison',
      output: pairs.join('; '),
      confidence: pairs.length > 0 ? 1 / PHI : 0,
      timestamp: Date.now(),
    };
    this.results.push(result);
    return result;
  }

  // ── PRAEDICTOR: Predict next observation based on golden patterns ──

  predict(observations: Observation[]): AnalysisResult {
    if (observations.length === 0) {
      const result: AnalysisResult = {
        id: this.nextResultId++,
        model: this.name,
        subModel: 'PRAEDICTOR',
        input: 'No observations',
        output: 'Insufficient data for prediction',
        confidence: 0,
        timestamp: Date.now(),
      };
      this.results.push(result);
      return result;
    }

    // Predict next resonance using golden ratio extrapolation
    const lastObs = observations[observations.length - 1];
    const predictedResonance = lastObs.resonance * PHI;
    const predictedPlane = ((lastObs.plane as number) + 1) % 5;

    const result: AnalysisResult = {
      id: this.nextResultId++,
      model: this.name,
      subModel: 'PRAEDICTOR',
      input: `Last observation: ${lastObs.target} in ${DimensionalPlane[lastObs.plane]}`,
      output: `Predicted next: resonance=${predictedResonance.toFixed(4)} in ${DimensionalPlane[predictedPlane]}`,
      confidence: 1 / PHI,
      timestamp: Date.now(),
    };
    this.results.push(result);
    return result;
  }

  // ── IUDICATOR: Classify an observation ─────────────────────────

  judge(obs: Observation): AnalysisResult {
    let classification: string;
    if (obs.anomalyProb > 0.9) {
      classification = 'CRITICAL — immediate caretaker response required';
    } else if (obs.anomalyProb > PHI / (PHI + 1)) {
      classification = 'ANOMALY — caregiver attention recommended';
    } else if (obs.anomalyProb > 1 / PHI) {
      classification = 'WATCH — continued observation warranted';
    } else {
      classification = 'NORMAL — within golden norms';
    }

    const result: AnalysisResult = {
      id: this.nextResultId++,
      model: this.name,
      subModel: 'IUDICATOR',
      input: `Observation #${obs.id}: ${obs.target}`,
      output: classification,
      confidence: 1 - Math.abs(obs.anomalyProb - PHI / (PHI + 1)),
      timestamp: Date.now(),
    };
    this.results.push(result);
    return result;
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): ServerModel {
    return {
      name: this.name,
      latinName: this.latinName,
      subModels: this.subModels,
      active: true,
      observations: this.results.length,
    };
  }

  getResults(): AnalysisResult[] {
    return [...this.results];
  }
}
