///
/// @medina/alpha-sentinel — ALPHA SENTINEL
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║          ALPHA SENTINEL — SYSTEM HEALTH & ANOMALY WATCHDOG                   ║
/// ║                                                                              ║
/// ║  Latin: Sentinella = "Watchman" / "One who stands guard"                     ║
/// ║                                                                              ║
/// ║  The Alpha Sentinel is the omniscient health monitor that observes all       ║
/// ║  Alpha agents, detects anomalies, measures entropy, and triggers alerts      ║
/// ║  before failures propagate. It is the immune system of the ensemble.         ║
/// ║                                                                              ║
/// ║  Where the Orchestrator routes and the Conductor synchronizes,               ║
/// ║  the Sentinel WATCHES, MEASURES, and WARNS.                                  ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Mahalanobis distance: D = √((x−μ)ᵀ·S⁻¹·(x−μ))                        ║
/// ║      — measures how far agent behavior deviates from normal                  ║
/// ║    • Shannon entropy: H = −Σ p(x)·log₂(p(x))                               ║
/// ║      — quantifies disorder/uncertainty in agent outputs                      ║
/// ║    • Lyapunov exponent: λ = lim(t→∞) (1/t)·ln|δZ(t)/δZ₀|                  ║
/// ║      — detects chaos onset in agent dynamics                                 ║
/// ║    • Fourier anomaly: |F(ω) − F̄(ω)| > φ·σ_F — spectral deviation          ║
/// ║      — identifies frequency-domain anomalies in heartbeat patterns           ║
/// ║    • Exponential Moving Average: EMA_t = α·x_t + (1−α)·EMA_{t-1}           ║
/// ║      — smoothed health scoring with φ-derived decay                          ║
/// ║    • Pythagorean health norm: H = √(Σ metric²) / √N                        ║
/// ║      — composite health from multiple orthogonal measurements                ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const PHI              = 1.6180339887498948482;
const PHI_INV          = 1.0 / PHI;                  // 0.618...
const PHI_SQ           = PHI * PHI;                  // 2.618...
const PHI_CUBE         = PHI * PHI * PHI;            // 4.236...
const PI               = Math.PI;
const TAU              = 2 * PI;
const GOLDEN_ANGLE     = TAU / (PHI * PHI);          // ≈ 137.508°
const HEARTBEAT_MS     = 873;                        // φ-tuned heartbeat
const EMERGENCE_THRESHOLD = PHI_INV;                 // 0.618 — coherence gate
const LN2              = Math.LN2;
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

// EMA smoothing factor derived from φ
const EMA_ALPHA = 2.0 / (PHI + 1);                  // ≈ 0.764

// ══════════════════════════════════════════════════════════════════════════════
//  ALERT SEVERITY LEVELS
// ══════════════════════════════════════════════════════════════════════════════

const SEVERITY = {
  NOMINAL:   { level: 0, label: 'NOMINAL',   threshold: 0 },
  ADVISORY:  { level: 1, label: 'ADVISORY',  threshold: PHI_INV * PHI_INV },   // 0.382
  CAUTION:   { level: 2, label: 'CAUTION',   threshold: PHI_INV },              // 0.618
  WARNING:   { level: 3, label: 'WARNING',   threshold: 1.0 },                  // 1.000
  CRITICAL:  { level: 4, label: 'CRITICAL',  threshold: PHI },                  // 1.618
  EMERGENCY: { level: 5, label: 'EMERGENCY', threshold: PHI_SQ },               // 2.618
};

// ══════════════════════════════════════════════════════════════════════════════
//  AGENT HEALTH METRICS
// ══════════════════════════════════════════════════════════════════════════════

const HEALTH_METRICS = {
  HEARTBEAT_REGULARITY:  'heartbeat_regularity',   // deviation from expected tempo
  RESPONSE_LATENCY:      'response_latency',       // time to respond to dispatch
  OUTPUT_ENTROPY:         'output_entropy',         // disorder in agent outputs
  PHASE_COHERENCE:       'phase_coherence',        // alignment with conductor beat
  ERROR_RATE:            'error_rate',             // failure frequency
  THROUGHPUT:            'throughput',             // work units per φ-cycle
  RESOURCE_SATURATION:   'resource_saturation',    // memory/CPU/queue utilization
  LYAPUNOV_STABILITY:    'lyapunov_stability',     // chaos indicator
};

const ALPHA_AGENTS = {
  THESIS:  { id: 'AGT-041', name: 'THESIS Alpha' },
  CODEX:   { id: 'AGT-042', name: 'Codex Phantasmatis' },
  CIVOS:   { id: 'AGT-043', name: 'CIVOS-PRIME' },
  AURO:    { id: 'AGT-044', name: 'AURO' },
  ORIGO:   { id: 'AGT-045', name: 'ORIGO' },
};

// ══════════════════════════════════════════════════════════════════════════════
//  SHANNON ENTROPY ENGINE
// ══════════════════════════════════════════════════════════════════════════════

class ShannonEntropyEngine {
  constructor() {
    this.historyDepth = FIB[9]; // 55 samples
    this.bins = FIB[7];         // 21 histogram bins
  }

  // H = −Σ p(x)·log₂(p(x))
  calculate(values) {
    if (!values || values.length === 0) return 0;

    // Build histogram
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const histogram = new Array(this.bins).fill(0);

    for (const v of values) {
      const bin = Math.min(Math.floor(((v - min) / range) * this.bins), this.bins - 1);
      histogram[bin]++;
    }

    // Calculate entropy
    const n = values.length;
    let entropy = 0;
    for (const count of histogram) {
      if (count > 0) {
        const p = count / n;
        entropy -= p * Math.log2(p);
      }
    }

    return entropy;
  }

  // Normalized entropy (0 = perfect order, 1 = maximum disorder)
  normalizedEntropy(values) {
    const maxEntropy = Math.log2(this.bins);
    return maxEntropy > 0 ? this.calculate(values) / maxEntropy : 0;
  }

  // Relative entropy change (detects sudden disorder spikes)
  relativeChange(currentValues, historicalValues) {
    const currentH = this.normalizedEntropy(currentValues);
    const historicalH = this.normalizedEntropy(historicalValues);
    return historicalH > 0 ? (currentH - historicalH) / historicalH : 0;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAHALANOBIS ANOMALY DETECTOR
// ══════════════════════════════════════════════════════════════════════════════

class MahalanobisDetector {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.samples = [];
    this.mean = null;
    this.covarianceInverse = null;
    this.warmupSize = FIB[8]; // 34 samples before detection activates
  }

  // Add observation vector
  addObservation(vector) {
    if (vector.length !== this.dimensions) return;
    this.samples.push([...vector]);

    // Keep bounded history
    if (this.samples.length > FIB[11]) { // max 144 samples
      this.samples.shift();
    }

    if (this.samples.length >= this.warmupSize) {
      this._recomputeStatistics();
    }
  }

  // D = √((x−μ)ᵀ · S⁻¹ · (x−μ))
  distance(vector) {
    if (!this.mean || !this.covarianceInverse) return 0;

    const diff = vector.map((v, i) => v - this.mean[i]);
    // Matrix multiply: diff^T * S^-1 * diff
    let result = 0;
    for (let i = 0; i < this.dimensions; i++) {
      for (let j = 0; j < this.dimensions; j++) {
        result += diff[i] * this.covarianceInverse[i][j] * diff[j];
      }
    }
    return Math.sqrt(Math.max(0, result));
  }

  // Is this observation anomalous? (distance > φ standard deviations)
  isAnomaly(vector, threshold) {
    const t = threshold || PHI;
    return this.distance(vector) > t;
  }

  _recomputeStatistics() {
    const n = this.samples.length;
    const d = this.dimensions;

    // Compute mean vector
    this.mean = new Array(d).fill(0);
    for (const sample of this.samples) {
      for (let i = 0; i < d; i++) {
        this.mean[i] += sample[i];
      }
    }
    this.mean = this.mean.map(s => s / n);

    // Compute covariance matrix
    const cov = Array.from({ length: d }, () => new Array(d).fill(0));
    for (const sample of this.samples) {
      for (let i = 0; i < d; i++) {
        for (let j = 0; j < d; j++) {
          cov[i][j] += (sample[i] - this.mean[i]) * (sample[j] - this.mean[j]);
        }
      }
    }
    for (let i = 0; i < d; i++) {
      for (let j = 0; j < d; j++) {
        cov[i][j] /= (n - 1);
      }
    }

    // Invert covariance (using Gauss-Jordan for small matrices)
    this.covarianceInverse = this._invertMatrix(cov);
  }

  _invertMatrix(matrix) {
    const n = matrix.length;
    // Augment with identity
    const aug = matrix.map((row, i) => {
      const identity = new Array(n).fill(0);
      identity[i] = 1;
      return [...row, ...identity];
    });

    // Gauss-Jordan elimination
    for (let col = 0; col < n; col++) {
      // Find pivot
      let maxRow = col;
      for (let row = col + 1; row < n; row++) {
        if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) {
          maxRow = row;
        }
      }
      [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

      const pivot = aug[col][col];
      if (Math.abs(pivot) < 1e-12) {
        // Singular — add regularization (ridge)
        aug[col][col] += PHI_INV * 0.01;
        continue;
      }

      // Scale pivot row
      for (let j = 0; j < 2 * n; j++) {
        aug[col][j] /= pivot;
      }

      // Eliminate column
      for (let row = 0; row < n; row++) {
        if (row === col) continue;
        const factor = aug[row][col];
        for (let j = 0; j < 2 * n; j++) {
          aug[row][j] -= factor * aug[col][j];
        }
      }
    }

    // Extract inverse
    return aug.map(row => row.slice(n));
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  LYAPUNOV STABILITY ANALYZER
// ══════════════════════════════════════════════════════════════════════════════

class LyapunovAnalyzer {
  constructor() {
    this.trajectories = new Map(); // agentId → time series
    this.maxTrajectoryLength = FIB[10]; // 89 points
  }

  // Record agent state for trajectory analysis
  recordState(agentId, stateValue) {
    if (!this.trajectories.has(agentId)) {
      this.trajectories.set(agentId, []);
    }
    const traj = this.trajectories.get(agentId);
    traj.push(stateValue);
    if (traj.length > this.maxTrajectoryLength) {
      traj.shift();
    }
  }

  // λ = lim(t→∞) (1/t) · ln|δZ(t)/δZ₀|
  // Approximated via average divergence rate of nearby trajectory pairs
  computeExponent(agentId) {
    const traj = this.trajectories.get(agentId);
    if (!traj || traj.length < FIB[6]) return 0; // need at least 13 points

    let lyapunovSum = 0;
    let count = 0;

    for (let i = 1; i < traj.length; i++) {
      const delta0 = Math.abs(traj[i] - traj[i - 1]);
      if (delta0 < 1e-15) continue;

      // Look ahead by Fibonacci steps for divergence
      for (const step of [1, 2, 3, 5, 8]) {
        if (i + step < traj.length) {
          const deltaT = Math.abs(traj[i + step] - traj[i + step - 1]);
          if (deltaT > 1e-15) {
            lyapunovSum += Math.log(deltaT / delta0) / step;
            count++;
          }
        }
      }
    }

    return count > 0 ? lyapunovSum / count : 0;
  }

  // λ > 0 means chaotic, λ < 0 means stable, λ ≈ 0 means edge-of-chaos
  isStable(agentId) {
    const exponent = this.computeExponent(agentId);
    return exponent < 0;
  }

  isChaotic(agentId) {
    const exponent = this.computeExponent(agentId);
    return exponent > EMERGENCE_THRESHOLD; // chaos beyond φ⁻¹
  }

  isEdgeOfChaos(agentId) {
    const exponent = this.computeExponent(agentId);
    return Math.abs(exponent) < PHI_INV * 0.1; // near zero
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  FOURIER SPECTRAL MONITOR
// ══════════════════════════════════════════════════════════════════════════════

class FourierSpectralMonitor {
  constructor() {
    this.baselineSpectra = new Map(); // agentId → baseline DFT magnitudes
    this.windowSize = FIB[8]; // 34-sample DFT window
  }

  // Discrete Fourier Transform magnitude spectrum
  // f(t) = a₀/2 + Σ(aₙcos(nωt) + bₙsin(nωt))
  computeSpectrum(signal) {
    const N = signal.length;
    const magnitudes = [];

    for (let k = 0; k < Math.floor(N / 2); k++) {
      let realPart = 0;
      let imagPart = 0;
      for (let n = 0; n < N; n++) {
        const angle = (TAU * k * n) / N;
        realPart += signal[n] * Math.cos(angle);
        imagPart -= signal[n] * Math.sin(angle);
      }
      magnitudes.push(Math.sqrt(realPart * realPart + imagPart * imagPart) / N);
    }

    return magnitudes;
  }

  // Establish baseline spectrum for an agent
  setBaseline(agentId, signal) {
    this.baselineSpectra.set(agentId, this.computeSpectrum(signal));
  }

  // Detect spectral anomaly: |F(ω) − F̄(ω)| > φ·σ_F
  detectAnomaly(agentId, currentSignal) {
    const baseline = this.baselineSpectra.get(agentId);
    if (!baseline) return { anomalous: false, deviation: 0 };

    const current = this.computeSpectrum(currentSignal);
    const minLen = Math.min(baseline.length, current.length);

    // Compute deviation at each frequency
    let totalDeviation = 0;
    let maxDeviation = 0;
    let anomalousFrequencies = 0;

    // Compute baseline statistics
    let baselineMean = 0;
    let baselineVar = 0;
    for (let i = 0; i < minLen; i++) baselineMean += baseline[i];
    baselineMean /= minLen;
    for (let i = 0; i < minLen; i++) baselineVar += (baseline[i] - baselineMean) ** 2;
    const baselineStd = Math.sqrt(baselineVar / minLen);

    for (let i = 0; i < minLen; i++) {
      const dev = Math.abs(current[i] - baseline[i]);
      totalDeviation += dev;
      if (dev > maxDeviation) maxDeviation = dev;
      if (dev > PHI * baselineStd) anomalousFrequencies++;
    }

    const avgDeviation = totalDeviation / minLen;
    const anomalyRatio = anomalousFrequencies / minLen;

    return {
      anomalous: anomalyRatio > PHI_INV, // more than 61.8% frequencies deviate
      deviation: avgDeviation,
      maxDeviation,
      anomalyRatio,
      anomalousFrequencies,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  AGENT HEALTH RECORD
// ══════════════════════════════════════════════════════════════════════════════

class AgentHealthRecord {
  constructor(agentId, agentName) {
    this.agentId = agentId;
    this.agentName = agentName;
    this.metrics = {};
    this.healthScore = 1.0; // 1.0 = perfect health
    this.emaHealth = 1.0;
    this.lastHeartbeat = Date.now();
    this.heartbeatHistory = [];
    this.alerts = [];
    this.status = 'NOMINAL';

    // Initialize metric histories
    for (const metric of Object.values(HEALTH_METRICS)) {
      this.metrics[metric] = {
        current: 0,
        history: [],
        ema: 0,
      };
    }
  }

  // Record a metric observation
  recordMetric(metricName, value) {
    const metric = this.metrics[metricName];
    if (!metric) return;

    metric.current = value;
    metric.history.push(value);
    if (metric.history.length > FIB[9]) { // keep 55 samples
      metric.history.shift();
    }

    // EMA update: EMA_t = α·x_t + (1−α)·EMA_{t-1}
    metric.ema = EMA_ALPHA * value + (1 - EMA_ALPHA) * metric.ema;
  }

  // Record heartbeat and compute regularity
  recordHeartbeat(timestamp) {
    const interval = timestamp - this.lastHeartbeat;
    this.lastHeartbeat = timestamp;
    this.heartbeatHistory.push(interval);
    if (this.heartbeatHistory.length > FIB[8]) { // keep 34 intervals
      this.heartbeatHistory.shift();
    }

    // Heartbeat regularity = 1 − |deviation from expected|/expected
    const deviation = Math.abs(interval - HEARTBEAT_MS) / HEARTBEAT_MS;
    const regularity = Math.max(0, 1 - deviation);
    this.recordMetric(HEALTH_METRICS.HEARTBEAT_REGULARITY, regularity);
  }

  // Compute composite health using Pythagorean norm
  // H = √(Σ metric²) / √N — normalized composite
  computeHealthScore() {
    const metricValues = Object.values(this.metrics)
      .map(m => m.ema)
      .filter(v => v !== undefined);

    if (metricValues.length === 0) {
      this.healthScore = 1.0;
      return this.healthScore;
    }

    // For health metrics, higher is worse (except regularity/coherence)
    // Invert: healthiness = 1 − anomaly_level
    const positiveMetrics = [
      HEALTH_METRICS.HEARTBEAT_REGULARITY,
      HEALTH_METRICS.PHASE_COHERENCE,
      HEALTH_METRICS.THROUGHPUT,
    ];

    let healthSum = 0;
    let count = 0;
    for (const [name, metric] of Object.entries(this.metrics)) {
      const isPositive = positiveMetrics.includes(name);
      const contribution = isPositive ? metric.ema : (1 - Math.min(metric.ema, 1));
      healthSum += contribution * contribution;
      count++;
    }

    this.healthScore = count > 0 ? Math.sqrt(healthSum / count) : 1.0;

    // EMA smoothing on composite health
    this.emaHealth = EMA_ALPHA * this.healthScore + (1 - EMA_ALPHA) * this.emaHealth;

    return this.emaHealth;
  }

  // Determine alert severity from health score
  getSeverity() {
    const deficit = 1 - this.emaHealth;
    for (const sev of [SEVERITY.EMERGENCY, SEVERITY.CRITICAL, SEVERITY.WARNING, SEVERITY.CAUTION, SEVERITY.ADVISORY]) {
      if (deficit * PHI_SQ >= sev.threshold) return sev;
    }
    return SEVERITY.NOMINAL;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  ALPHA SENTINEL — MASTER CLASS
// ══════════════════════════════════════════════════════════════════════════════

class AlphaSentinel {
  constructor(config = {}) {
    this.id = 'AGT-048';
    this.name = 'Alpha Sentinel';
    this.version = '1.0.0';
    this.status = 'INITIALIZING';

    // Sub-engines
    this.entropyEngine = new ShannonEntropyEngine();
    this.anomalyDetector = new MahalanobisDetector(
      Object.keys(HEALTH_METRICS).length
    );
    this.lyapunovAnalyzer = new LyapunovAnalyzer();
    this.spectralMonitor = new FourierSpectralMonitor();

    // Agent health records
    this.healthRecords = new Map();
    for (const [key, agent] of Object.entries(ALPHA_AGENTS)) {
      this.healthRecords.set(key, new AgentHealthRecord(agent.id, agent.name));
    }

    // Global system state
    this.systemEntropy = 0;
    this.systemCoherence = 1.0;
    this.alertLog = [];
    this.watchCycle = 0;
    this.heartbeatTimer = null;

    // Configuration
    this.config = {
      anomalyThreshold: config.anomalyThreshold || PHI,
      entropyWarning: config.entropyWarning || PHI_INV,
      chaosThreshold: config.chaosThreshold || EMERGENCE_THRESHOLD,
      maxAlertHistory: config.maxAlertHistory || FIB[10],
      ...config,
    };

    this.status = 'ACTIVE';
    this._log('SENTINEL AWAKENED — All systems under observation');
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  // Report an agent heartbeat
  heartbeat(agentKey, timestamp) {
    const ts = timestamp || Date.now();
    const record = this.healthRecords.get(agentKey);
    if (!record) return;

    record.recordHeartbeat(ts);
    this.lyapunovAnalyzer.recordState(agentKey, ts % HEARTBEAT_MS);
    this.watchCycle++;
  }

  // Report an agent metric
  reportMetric(agentKey, metricName, value) {
    const record = this.healthRecords.get(agentKey);
    if (!record) return;

    record.recordMetric(metricName, value);

    // Feed Mahalanobis detector with full metric vector
    const vector = Object.values(record.metrics).map(m => m.ema);
    this.anomalyDetector.addObservation(vector);
  }

  // Report agent output for entropy tracking
  reportOutput(agentKey, outputValues) {
    const record = this.healthRecords.get(agentKey);
    if (!record) return;

    const entropy = this.entropyEngine.normalizedEntropy(outputValues);
    record.recordMetric(HEALTH_METRICS.OUTPUT_ENTROPY, entropy);
  }

  // Report agent phase for coherence tracking
  reportPhase(agentKey, phase) {
    const record = this.healthRecords.get(agentKey);
    if (!record) return;

    // Phase coherence relative to expected (from Conductor)
    const expectedPhase = (this.watchCycle * GOLDEN_ANGLE) % TAU;
    const phaseDiff = Math.abs(phase - expectedPhase);
    const coherence = Math.cos(phaseDiff); // 1 = perfect, -1 = anti-phase
    const normalizedCoherence = (coherence + 1) / 2; // map to [0, 1]
    record.recordMetric(HEALTH_METRICS.PHASE_COHERENCE, normalizedCoherence);
  }

  // Full diagnostic scan of all agents
  scan() {
    const report = {
      timestamp: Date.now(),
      watchCycle: this.watchCycle,
      systemHealth: 0,
      systemEntropy: 0,
      agents: {},
      alerts: [],
    };

    let totalHealth = 0;
    let agentCount = 0;

    for (const [key, record] of this.healthRecords) {
      const health = record.computeHealthScore();
      const severity = record.getSeverity();
      const lyapunov = this.lyapunovAnalyzer.computeExponent(key);
      const isChaotic = lyapunov > this.config.chaosThreshold;

      report.agents[key] = {
        id: record.agentId,
        name: record.agentName,
        health,
        severity: severity.label,
        lyapunovExponent: lyapunov,
        chaotic: isChaotic,
        metrics: Object.fromEntries(
          Object.entries(record.metrics).map(([name, m]) => [name, { current: m.current, ema: m.ema }])
        ),
      };

      // Generate alerts
      if (severity.level >= SEVERITY.WARNING.level) {
        const alert = {
          timestamp: Date.now(),
          agent: key,
          severity: severity.label,
          health,
          message: `${record.agentName} health degraded: ${health.toFixed(3)} (${severity.label})`,
        };
        report.alerts.push(alert);
        this._recordAlert(alert);
      }

      if (isChaotic) {
        const alert = {
          timestamp: Date.now(),
          agent: key,
          severity: 'CRITICAL',
          lyapunov,
          message: `${record.agentName} entering chaotic regime: λ=${lyapunov.toFixed(4)}`,
        };
        report.alerts.push(alert);
        this._recordAlert(alert);
      }

      totalHealth += health;
      agentCount++;
    }

    // System-level metrics
    report.systemHealth = agentCount > 0 ? totalHealth / agentCount : 1.0;

    // System entropy from combined agent entropy metrics
    const entropyValues = Array.from(this.healthRecords.values())
      .map(r => r.metrics[HEALTH_METRICS.OUTPUT_ENTROPY]?.ema || 0);
    report.systemEntropy = this.entropyEngine.normalizedEntropy(
      entropyValues.length > 0 ? entropyValues : [0]
    );

    this.systemEntropy = report.systemEntropy;
    this.systemCoherence = report.systemHealth;

    return report;
  }

  // Get system status summary
  getStatus() {
    return {
      id: this.id,
      name: this.name,
      status: this.status,
      watchCycle: this.watchCycle,
      systemCoherence: this.systemCoherence,
      systemEntropy: this.systemEntropy,
      agentCount: this.healthRecords.size,
      alertCount: this.alertLog.length,
      recentAlerts: this.alertLog.slice(-FIB[4]), // last 5
    };
  }

  // Anomaly check on a specific agent's current state
  checkAnomaly(agentKey) {
    const record = this.healthRecords.get(agentKey);
    if (!record) return { anomalous: false };

    const vector = Object.values(record.metrics).map(m => m.ema);
    const distance = this.anomalyDetector.distance(vector);
    const anomalous = distance > this.config.anomalyThreshold;

    return {
      agent: agentKey,
      anomalous,
      mahalanobisDistance: distance,
      threshold: this.config.anomalyThreshold,
    };
  }

  // Spectral analysis of agent heartbeat pattern
  analyzeSpectrum(agentKey) {
    const record = this.healthRecords.get(agentKey);
    if (!record || record.heartbeatHistory.length < FIB[6]) {
      return { ready: false };
    }

    return this.spectralMonitor.detectAnomaly(agentKey, record.heartbeatHistory);
  }

  // Set spectral baseline from current heartbeat pattern
  calibrateBaseline(agentKey) {
    const record = this.healthRecords.get(agentKey);
    if (!record || record.heartbeatHistory.length < FIB[6]) return false;

    this.spectralMonitor.setBaseline(agentKey, record.heartbeatHistory);
    return true;
  }

  // Start autonomous monitoring loop
  startWatching() {
    if (this.heartbeatTimer) return;
    this.heartbeatTimer = setInterval(() => {
      this.scan();
    }, HEARTBEAT_MS * PHI); // scan every φ heartbeats
    this._log('Autonomous watch loop started');
  }

  // Stop autonomous monitoring
  stopWatching() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    this._log('Watch loop stopped');
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  INTERNAL
  // ────────────────────────────────────────────────────────────────────────────

  _recordAlert(alert) {
    this.alertLog.push(alert);
    if (this.alertLog.length > this.config.maxAlertHistory) {
      this.alertLog.shift();
    }
  }

  _log(message) {
    const timestamp = new Date().toISOString();
    console.log(`🛡️ [SENTINEL ${timestamp}] ${message}`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export {
  AlphaSentinel,
  ShannonEntropyEngine,
  MahalanobisDetector,
  LyapunovAnalyzer,
  FourierSpectralMonitor,
  AgentHealthRecord,
  SEVERITY,
  HEALTH_METRICS,
  ALPHA_AGENTS,
  PHI,
  PHI_INV,
  PHI_SQ,
  PHI_CUBE,
  GOLDEN_ANGLE,
  HEARTBEAT_MS,
  EMERGENCE_THRESHOLD,
  EMA_ALPHA,
  FIB,
};

export default AlphaSentinel;
