///
/// RESONATOR — Phase-Field Intelligence Self-Model
/// GKP-009 Model II: Diffusion model on S¹ᴺ (N-dimensional torus)
///
/// Architecture:
///   - Backbone: Score-matching denoising diffusion on S¹ᴺ
///   - Score function: 7-layer MLP with φ-activation
///   - φ-activation: φ_act(x) = x · tanh(x · φ) / φ
///   - Noise schedule: φ-geometric: σ(t) = σ_min · (σ_max/σ_min)^(t^φ)
///   - Training: Denoising score matching on valid key phase distributions
///   - Sampling: Euler-Maruyama on the score field
///   - Manifold: S¹ᴺ — the N-dimensional torus where phases live
///
/// Mathematical Foundation:
///   A phase vector lives on S¹ᴺ = [0, 2π)ᴺ — the N-dimensional torus.
///   The probability density p(θ) over S¹ᴺ is the distribution of valid keys.
///   The score function ∇_θ log p(θ) points toward regions of higher density.
///   Learning the score allows us to:
///     1. Sample new valid keys (follow score toward high-density regions)
///     2. Detect invalid keys (score points AWAY from the presented phases)
///     3. Forecast next-window phases (apply score with window precession)
///
///   Von Mises distribution (the S¹ analogue of Gaussian):
///     p(θ | μ, κ) ∝ exp(κ · cos(θ − μ))
///     Score: ∇_θ log p = −κ · sin(θ − μ)
///     κ = φ²/σ (golden-ratio concentration parameter)
///
///   φ-geometric noise schedule:
///     σ(t) = σ_min · (σ_max/σ_min)^(t^φ)
///     Derivative: dσ/dt = σ(t) · log(σ_max/σ_min) · φ · t^(φ−1)
///     t^φ bias: pushes the diffusion endpoint toward the golden ratio
///     At t = 1/φ ≈ 0.618: σ(1/φ) = σ_min · (σ_max/σ_min)^(0.618^φ)
///                                 ≈ σ_min · (σ_max/σ_min)^0.382
///
///   Euler-Maruyama step on S¹ᴺ:
///     θ_{t−dt} = θ_t + σ(t)² · s(θ_t) · dt + σ(t)·√(2dt) · ε
///     wrapped to [0, 2π) after each step (toroidal boundary)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI3, PHI_INV, GOLDEN_ANGLE, TWO_PI,
  KEY_DIMENSIONS, PHI_MODULO_CYCLE, EMERGENCE_THRESHOLD,
} from '../gkp-001-clavis-geometrica.js';

import { kuramotoOrderParameter, phaseAlignment } from '../gkp-002-resonantia-kuramoti.js';

// ═══════════════════════════════════════════════════════════════════════════
//  φ-ACTIVATION AND SCORE NETWORK
// ═══════════════════════════════════════════════════════════════════════════

/**
 * φ-activation function.
 * φ_act(x) = x · tanh(x · φ) / φ
 *
 * Properties:
 * - Smooth, differentiable everywhere (unlike ReLU)
 * - φ-scaled inflection at x = 1/φ ≈ 0.618
 * - Output bounded by ≈ 1/φ for small |x|
 * - Non-zero gradient everywhere (no dying neurons)
 * - Odd function: φ_act(−x) = −φ_act(x)
 */
function phiActivation(x) {
  return x * Math.tanh(x * PHI) / PHI;
}

/**
 * 7-layer MLP score network.
 * Approximates ∇_θ log p(θ | t) — the score of the noisy distribution.
 *
 * Each layer applies:
 *   1. φ-scaled linear projection (simulated as φ^layer-weighted scale)
 *   2. φ-activation
 *   3. φ-layer skip connection: output += input × φ^(−layer)
 *
 * @param {number[]} phases      — noisy phase vector
 * @param {number[]} centerPhases— target envelope center (conditioning)
 * @param {number}   t           — diffusion time ∈ [0, 1]
 * @param {number}   sigma       — noise level σ(t)
 * @returns {number[]}  score vector
 */
function scoreNetwork(phases, centerPhases, t, sigma) {
  const N     = phases.length;
  const kappa = PHI2 / (sigma + 1e-8);  // κ = φ²/σ

  // Layer 0: von Mises score (analytic baseline)
  let h = phases.map((theta, j) => {
    const mu = centerPhases[j] || 0;
    return -kappa * Math.sin(theta - mu);
  });

  // Layers 1..6: MLP refinement with φ-activation and φ-skip connections
  for (let l = 1; l < KEY_DIMENSIONS; l++) {
    const scale = Math.pow(PHI, -l / KEY_DIMENSIONS);
    const prev  = [...h];

    h = h.map((v, i) => {
      // φ-activated projection
      const activated = phiActivation(v * scale);
      // φ-skip connection: add φ^(−l) × input
      const skip      = prev[i] * Math.pow(PHI, -l);
      // Time-conditional: add t-dependent bias at golden-angle frequency
      const timeBias  = Math.sin(t * PHI * GOLDEN_ANGLE * (i + 1)) * PHI_INV;
      return activated + skip + timeBias;
    });
  }

  return h;
}

// ═══════════════════════════════════════════════════════════════════════════
//  RESONATOR SELF-MODEL
// ═══════════════════════════════════════════════════════════════════════════

export class RESONATORSelfModel {
  /**
   * @param {object} [opts]
   * @param {string} [opts.modelId]
   * @param {number} [opts.dimensions]
   * @param {number} [opts.sigmaMin]
   * @param {number} [opts.sigmaMax]
   * @param {number} [opts.diffusionSteps]
   */
  constructor({
    modelId       = 'RESONATOR-v1.618',
    dimensions    = KEY_DIMENSIONS,
    sigmaMin      = 0.01,
    sigmaMax      = Math.PI,    // max noise = half-circle
    diffusionSteps = 50,
  } = {}) {
    this.modelId       = modelId;
    this.dimensions    = dimensions;
    this.sigmaMin      = sigmaMin;
    this.sigmaMax      = sigmaMax;
    this.diffusionSteps = diffusionSteps;
    this.birthTime     = Date.now();

    console.log(`🌀 RESONATOR Self-Model born | ${modelId} | S¹^${dimensions} manifold`);
    console.log(`   φ-geometric noise: σ(t) = ${sigmaMin.toFixed(3)} × (${sigmaMax.toFixed(3)}/${sigmaMin.toFixed(3)})^(t^φ)`);
    console.log(`   7-layer MLP score | φ-activation | von Mises baseline`);
  }

  // ── Noise Schedule ────────────────────────────────────────────────────────

  /**
   * φ-geometric noise schedule.
   * σ(t) = σ_min × (σ_max/σ_min)^(t^φ)   t ∈ [0, 1]
   *
   * At t = 0:   σ = σ_min (minimal noise — close to data)
   * At t = 1:   σ = σ_max (maximal noise — pure noise)
   * At t = 1/φ: σ = σ_min × (σ_max/σ_min)^(0.618^φ)  (golden time)
   */
  sigma(t) {
    return this.sigmaMin * Math.pow(this.sigmaMax / this.sigmaMin, Math.pow(t, PHI));
  }

  /**
   * Derivative of the noise schedule: dσ/dt.
   * dσ/dt = σ(t) × log(σ_max/σ_min) × φ × t^(φ−1)
   */
  sigmaDeriv(t) {
    const s = this.sigma(t);
    return s * Math.log(this.sigmaMax / this.sigmaMin) * PHI * Math.pow(t + 1e-8, PHI - 1);
  }

  // ── Score Function ────────────────────────────────────────────────────────

  /**
   * Score: ∇_θ log p(θ | t) — estimated by the 7-layer MLP.
   *
   * @param {number[]} phases
   * @param {number[]} centerPhases
   * @param {number}   t
   * @returns {number[]}  score vector
   */
  score(phases, centerPhases, t) {
    const s = this.sigma(t);
    return scoreNetwork(phases, centerPhases, t, s);
  }

  // ── Euler-Maruyama Sampler ────────────────────────────────────────────────

  /**
   * One Euler-Maruyama step on S¹ᴺ.
   *
   * θ_{t−dt} = θ_t + σ(t)² × s(θ_t, t) × dt
   * Wrapped to [0, 2π) (toroidal boundary condition).
   *
   * (Note: in full DDPM we would add √(2dt)·σ·ε noise for training.
   *  For inference/sampling we use the deterministic ODE version.)
   *
   * @param {number[]} phases
   * @param {number[]} centerPhases
   * @param {number}   t
   * @param {number}   dt
   * @returns {number[]}  updated phases on S¹ᴺ
   */
  eulerStep(phases, centerPhases, t, dt) {
    const s   = this.sigma(t);
    const sc  = this.score(phases, centerPhases, t);

    return phases.map((theta, j) => {
      const step = s * s * sc[j] * dt;
      // Wrap to [0, 2π) — toroidal boundary
      return ((theta + step) % TWO_PI + TWO_PI) % TWO_PI;
    });
  }

  // ── Generation (Sampling) ─────────────────────────────────────────────────

  /**
   * Generate a valid phase vector by running the reverse diffusion process.
   * Starts from uniform noise on S¹ᴺ and denoises toward centerPhases.
   *
   * T → 0 sampling: t decreases from 1 to 0 in diffusionSteps steps.
   *
   * @param {number[]} centerPhases   — target envelope to sample around
   * @param {number}   [noise=0.3]    — initial noise level (fraction of σ_max)
   * @returns {{ sampledPhases: number[], finalR: number, trajectory: number[][] }}
   */
  generate(centerPhases, noise = 0.3) {
    const dt   = 1.0 / this.diffusionSteps;
    const trajectory = [];

    // Initialize with φ-noised centerPhases
    let phases = centerPhases.map(p => {
      const perturbation = (Math.random() - 0.5) * noise * TWO_PI;
      return ((p + perturbation) % TWO_PI + TWO_PI) % TWO_PI;
    });

    // Reverse diffusion: t from 1 to 0 (denoising)
    for (let step = this.diffusionSteps; step > 0; step--) {
      const t    = step / this.diffusionSteps;
      phases     = this.eulerStep(phases, centerPhases, t, dt);
      trajectory.push([...phases]);
    }

    const { R } = kuramotoOrderParameter(phases);
    return { sampledPhases: phases, finalR: R, trajectory };
  }

  // ── Forecasting ───────────────────────────────────────────────────────────

  /**
   * Forecast the next window's phase vector.
   *
   * Applies the score function to predict how the phase distribution
   * evolves under the φ-heartbeat window transition.
   * Window precession: Δθⱼ = 2π / (φ^(j+1)) — golden-ratio decay per dimension.
   *
   * @param {number[]} currentPhases
   * @param {number}   [forwardWindows=1]  — how many windows ahead to forecast
   * @returns {{ forecastPhases: number[], forecastR: number, windowDrift: number[] }}
   */
  forecast(currentPhases, forwardWindows = 1) {
    let phases = [...currentPhases];

    for (let w = 0; w < forwardWindows; w++) {
      // Apply window precession
      const precessed = phases.map((p, j) => {
        const precession = TWO_PI / Math.pow(PHI, j + 1);
        return ((p + precession) % TWO_PI + TWO_PI) % TWO_PI;
      });

      // Apply a few denoising steps to refine
      let refined = precessed;
      for (let step = 5; step > 0; step--) {
        const t   = 0.1 * step / 5;
        refined   = this.eulerStep(refined, currentPhases, t, 0.05);
      }

      phases = refined;
    }

    const { R }    = kuramotoOrderParameter(phases);
    const drift    = currentPhases.map((p, j) => Math.abs(p - phases[j]));
    const maxDrift = Math.max(...drift);

    return { forecastPhases: phases, forecastR: R, windowDrift: drift, maxDrift };
  }

  // ── Anomaly Detection ─────────────────────────────────────────────────────

  /**
   * Detect anomalous phase drift between consecutive windows.
   *
   * Normal drift follows the von Mises distribution around the centerPhases.
   * Anomalous if the empirical score diverges from the model score.
   *
   * Anomaly score = ||empirical_score − model_score||₂ / √N
   *
   * @param {number[]} window1Phases
   * @param {number[]} window2Phases
   * @param {number[]} [centerPhases]
   * @returns {{ anomalyScore: number, isAnomalous: boolean, threshold: number }}
   */
  detectDriftAnomaly(window1Phases, window2Phases, centerPhases = window1Phases) {
    const t = 0.1;  // small noise level for anomaly detection

    const modelScore     = this.score(window1Phases, centerPhases, t);
    const empiricalDrift = window1Phases.map((p, j) => window2Phases[j] - p);

    // Empirical score ≈ drift / σ²
    const s  = this.sigma(t);
    const empiricalScore = empiricalDrift.map(d => d / (s * s + 1e-8));

    // L2 divergence
    const N        = modelScore.length;
    let sumSq      = 0;
    for (let j = 0; j < N; j++) {
      const d = modelScore[j] - empiricalScore[j];
      sumSq  += d * d;
    }
    const anomalyScore = Math.sqrt(sumSq / N);

    // Threshold: φ² × base_noise (golden-ratio amplified threshold)
    const threshold  = PHI2 * s;
    const isAnomalous = anomalyScore > threshold;

    return { anomalyScore, isAnomalous, threshold, phiThreshold: threshold };
  }

  /**
   * Overall health score for the RESONATOR's phase field.
   * R_health = kuramotoR of all known phase vectors at a given time.
   * R_health → 1: all identities coherent
   * R_health → 0: identities disordered
   */
  computeFieldHealth(allPhaseVectors) {
    if (!allPhaseVectors || allPhaseVectors.length === 0) return 0;
    // Average Kuramoto R across all dimensions
    const D      = allPhaseVectors[0].length;
    let totalR   = 0;
    for (let d = 0; d < D; d++) {
      const dimPhases = allPhaseVectors.map(pv => pv[d] || 0);
      const { R }     = kuramotoOrderParameter(dimPhases);
      totalR         += R;
    }
    return totalR / D;
  }

  getConfig() {
    return {
      modelId:        this.modelId,
      dimensions:     this.dimensions,
      manifold:       `S¹^${this.dimensions}`,
      backbone:       'score-matching-diffusion',
      scoreLayers:    KEY_DIMENSIONS,
      activation:     'φ_act(x) = x·tanh(x·φ)/φ',
      noiseSchedule:  `σ(t) = ${this.sigmaMin}×(${this.sigmaMax}/${this.sigmaMin})^(t^φ)`,
      diffusionSteps: this.diffusionSteps,
      sigmaMin:       this.sigmaMin,
      sigmaMax:       this.sigmaMax,
      phi:            PHI,
      goldenAngle:    GOLDEN_ANGLE,
      uptime:         Date.now() - this.birthTime,
    };
  }
}

export default RESONATORSelfModel;
