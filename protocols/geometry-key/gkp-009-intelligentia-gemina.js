///
/// GKP-009 — Protocollum Intelligentiae Geminae
/// Latin: "The Protocol of Twin Intelligence"
///
/// AI-TO-AI GEOMETRIC AUTHENTICATION.
///
/// Two large self-models power the Geometry Key system:
///   GEOMETER  — Shape Intelligence (transformer, 7-head, 618-dim, 13-layer)
///   RESONATOR — Phase-Field Intelligence (diffusion on S¹ᴺ)
///
/// This module bridges GKP-001..008 to both models, providing:
///   - Model-to-model authentication (AI proves identity to AI geometrically)
///   - Adversarial detection (RESONATOR flags near-threshold crafted keys)
///   - Phase forecasting (predict next-window phase vector)
///   - Key synthesis (generate valid envelopes from text descriptions)
///
/// Why AI-to-AI authentication matters:
///   In the new world, AI models call each other millions of times per second.
///   There is currently no way to verify WHICH model actually generated an output.
///   Geometry Keys give every AI a mathematical identity — its shape in phase space.
///   When Model A calls Model B, it presents its geometric key.
///   Model B's Kuramoto lock verifies the shape. No shape → no call.
///
/// GEOMETER architecture summary:
///   - Attention heads: 7 (= KEY_DIMENSIONS)
///   - Embedding dim: 618 (≈ φ × 382 = φ × 2^φ²)
///   - Layer count: 13 (= Fibonacci 7th, prime)
///   - FFN expansion: φ × 618 ≈ 1000
///   - Positional encoding: φ-spiral (not sinusoidal)
///   - Training: contrastive on (key, envelope, R) triples
///
/// RESONATOR architecture summary:
///   - Backbone: score-matching diffusion on S¹ᴺ (N-dim torus)
///   - Score function: 7-layer MLP with φ-activation
///   - φ-activation: φ_act(x) = x·tanh(x·φ) / φ
///   - Noise schedule: σₜ = σ_min × (σ_max/σ_min)^(t^φ)
///   - Training: denoising score matching on valid key distributions
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI2, PHI_INV, GOLDEN_ANGLE, KEY_DIMENSIONS, EMERGENCE_THRESHOLD } from './gkp-001-clavis-geometrica.js';
import { kuramotoOrderParameter, phaseAlignment } from './gkp-002-resonantia-kuramoti.js';
import { generatePhaseVector } from './gkp-003-phyllotaxis-aurea.js';

// ═══════════════════════════════════════════════════════════════════════════
//  GEOMETER — Shape Intelligence
//  φ-spiral positional encoding, 7 attention heads, 13 layers
// ═══════════════════════════════════════════════════════════════════════════

export class GEOMETERModel {
  constructor({ modelId = 'GEOMETER-v1', dimensions = KEY_DIMENSIONS } = {}) {
    this.modelId    = modelId;
    this.dimensions = dimensions;
    this.birthTime  = Date.now();

    // Model hyperparameters (φ-derived)
    this.config = {
      attentionHeads:    KEY_DIMENSIONS,          // 7
      embeddingDim:      618,                     // ≈ φ × 382
      layerCount:        13,                      // Fibonacci 7th
      ffnExpansion:      Math.round(PHI * 618),   // ≈ 1000
      posEncoding:       'phi-spiral',
      trainingObjective: 'contrastive-resonance',
      activationFn:      'phi-activation',
    };

    // Internal phase embedding weights (simulate at runtime)
    this._weights = this._initWeights();

    console.log(`🔷 GEOMETER born | ${this.modelId} | ${this.config.attentionHeads} heads × ${this.config.embeddingDim}d × ${this.config.layerCount} layers`);
  }

  _initWeights() {
    // φ-spiral positional encoding weights
    // PE(pos, dim) = sin(pos·φ^dim·GOLDEN_ANGLE) if dim even
    //             = cos(pos·φ^dim·GOLDEN_ANGLE) if dim odd
    const weights = [];
    for (let d = 0; d < this.dimensions; d++) {
      const w = d % 2 === 0
        ? (pos) => Math.sin(pos * Math.pow(PHI, d) * GOLDEN_ANGLE)
        : (pos) => Math.cos(pos * Math.pow(PHI, d) * GOLDEN_ANGLE);
      weights.push(w);
    }
    return weights;
  }

  /**
   * φ-spiral positional encoding for a phase vector.
   * Replaces sinusoidal PE with golden-angle PE.
   *
   * PE(pos, dim) = sin(pos·φ^dim·α) if dim is even
   *             = cos(pos·φ^dim·α) if dim is odd
   *
   * @param {number[]} phases
   * @returns {number[]}  encoded phases
   */
  positionalEncode(phases) {
    return phases.map((phase, d) => {
      const pe = this._weights[d] ? this._weights[d](phase) : 0;
      return phase + pe * PHI_INV;  // add φ⁻¹-weighted PE to phase
    });
  }

  /**
   * Predict the Kuramoto resonance R for a (key, envelope) pair.
   * This is the model's forward pass — estimating R before computing it exactly.
   *
   * In production: run inference through the 13-layer transformer.
   * Here: compute exact R via the Kuramoto formula (the model learns to approximate this).
   *
   * @param {number[]} keyPhases
   * @param {number[]} envelopePhases
   * @returns {{ predictedR: number, confidence: number }}
   */
  predictResonance(keyPhases, envelopePhases) {
    const encoded1 = this.positionalEncode(keyPhases);
    const encoded2 = this.positionalEncode(envelopePhases);
    const R        = phaseAlignment(encoded1, encoded2);

    // Confidence: how far R is from the threshold
    // confidence = |R − EMERGENCE_THRESHOLD| / (1 − EMERGENCE_THRESHOLD)
    const confidence = Math.abs(R - EMERGENCE_THRESHOLD) / (1 - EMERGENCE_THRESHOLD);

    return { predictedR: R, confidence };
  }

  /**
   * Check if a key is adversarially crafted.
   * An adversarial key has R suspiciously close to the threshold.
   *
   * Adversarial if: |R − EMERGENCE_THRESHOLD| < φ⁻¹ × EMERGENCE_THRESHOLD × 0.1
   *
   * @param {number[]} keyPhases
   * @param {number[]} envelopePhases
   * @returns {{ isAdversarial: boolean, margin: number }}
   */
  detectAdversarial(keyPhases, envelopePhases) {
    const { predictedR } = this.predictResonance(keyPhases, envelopePhases);
    const margin         = Math.abs(predictedR - EMERGENCE_THRESHOLD);
    const dangerZone     = EMERGENCE_THRESHOLD * 0.1 * PHI_INV;
    return { isAdversarial: margin < dangerZone, margin, dangerZone };
  }

  /**
   * Synthesize a resonance envelope from a text description.
   * Derives seed from the text hash, generates a phase vector.
   * (In production: full transformer forward pass.)
   *
   * @param {string} description
   * @param {number} [windowIndex]
   * @returns {{ phases: number[], coordinates: object[] }}
   */
  synthesizeEnvelope(description, windowIndex) {
    // Hash the description to get a pseudo-callerId
    let hash = 0;
    for (let i = 0; i < description.length; i++) {
      hash += description.charCodeAt(i) * Math.pow(PHI, i % 13);
      hash  = hash % 0xFFFFFFFF;
    }
    const pseudoId = `geometer_synth_${hash.toString(16)}`;
    return generatePhaseVector(pseudoId, 'geometer_synthesis', windowIndex, this.dimensions);
  }

  getConfig() {
    return { ...this.config, modelId: this.modelId, dimensions: this.dimensions };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  RESONATOR — Phase-Field Intelligence
//  Score-matching diffusion on S¹ᴺ, φ-activation, φ-geometric noise schedule
// ═══════════════════════════════════════════════════════════════════════════

export class RESONATORModel {
  constructor({ modelId = 'RESONATOR-v1', dimensions = KEY_DIMENSIONS, sigmaMin = 0.01, sigmaMax = 1.0 } = {}) {
    this.modelId    = modelId;
    this.dimensions = dimensions;
    this.sigmaMin   = sigmaMin;
    this.sigmaMax   = sigmaMax;
    this.birthTime  = Date.now();

    this.config = {
      backbone:        'score-matching-diffusion',
      manifold:        `S¹^${dimensions}`,         // N-dimensional torus
      scoreLayers:     KEY_DIMENSIONS,              // 7 MLP layers
      activation:      'phi-activation',
      noiseSchedule:   'phi-geometric',
      trainingObjective: 'denoising-score-matching',
    };

    console.log(`🌀 RESONATOR born | ${this.modelId} | diffusion on S¹^${dimensions}`);
  }

  /**
   * φ-activation function.
   * φ_act(x) = x · tanh(x · φ) / φ
   *
   * Properties:
   * - Smooth and differentiable (unlike ReLU)
   * - φ-scaled: output bounded by 1/φ ≈ 0.618 for small x
   * - Non-zero gradient everywhere (no dying neurons)
   */
  static phiActivation(x) {
    return x * Math.tanh(x * PHI) / PHI;
  }

  /**
   * φ-geometric noise schedule.
   * σ(t) = σ_min × (σ_max/σ_min)^(t^φ)   where t ∈ [0, 1]
   *
   * Uses t^φ instead of t to bias the diffusion schedule toward
   * the golden-ratio-weighted end of the noise spectrum.
   *
   * @param {number} t  — diffusion time ∈ [0, 1]
   * @returns {number}  noise level σ(t)
   */
  noiseLevel(t) {
    return this.sigmaMin * Math.pow(this.sigmaMax / this.sigmaMin, Math.pow(t, PHI));
  }

  /**
   * Score function estimate: ∂log p(θ)/∂θ
   * In production: neural network output.
   * Here: analytic gradient of the von Mises distribution
   *   centered at the envelope phases.
   *
   * von Mises: p(θ|μ, κ) ∝ exp(κ·cos(θ−μ))
   * Score: ∂log p/∂θ = −κ·sin(θ−μ)
   * We set κ = φ² (golden concentration parameter).
   *
   * @param {number[]} phases       — current noisy phases
   * @param {number[]} centerPhases — target envelope center
   * @param {number}   t            — diffusion time
   * @returns {number[]}  score vector
   */
  score(phases, centerPhases, t) {
    const sigma = this.noiseLevel(t);
    const kappa = PHI2 / (sigma + 1e-8);   // κ = φ²/σ

    return phases.map((theta, j) => {
      const mu = centerPhases[j] || 0;
      return -kappa * Math.sin(theta - mu);
    });
  }

  /**
   * Denoise a noisy phase vector by one diffusion step.
   * Uses the Euler-Maruyama method on the score.
   *
   * θ_{t-dt} = θ_t + σ_t² × score(θ_t) × dt
   *
   * @param {number[]} noisyPhases
   * @param {number[]} centerPhases
   * @param {number}   t           — current diffusion time
   * @param {number}   [dt=0.01]   — step size
   * @returns {number[]}  denoised phases
   */
  denoiseStep(noisyPhases, centerPhases, t, dt = 0.01) {
    const sigma  = this.noiseLevel(t);
    const scores = this.score(noisyPhases, centerPhases, t);

    return noisyPhases.map((theta, j) => {
      const step = sigma * sigma * scores[j] * dt;
      // Keep on the torus S¹: wrap to [0, 2π)
      return ((theta + step) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    });
  }

  /**
   * Forecast the next window's phase vector from the current one.
   *
   * Uses the score function to estimate how the phase distribution
   * will evolve under the φ-geometric noise schedule.
   *
   * @param {number[]} currentPhases
   * @param {number}   [steps=10]    — diffusion steps to apply
   * @returns {{ forecastPhases: number[], forecastR: number }}
   */
  forecastNextWindow(currentPhases, steps = 10) {
    let phases = [...currentPhases];
    // Apply small perturbation to simulate window drift
    const windowPrecession = (2 * Math.PI) / PHI;

    // φ-geometric diffusion for 'steps' steps starting from t=0.1 (small noise)
    for (let i = 0; i < steps; i++) {
      const t    = 0.1 * (1 - i / steps);
      phases     = this.denoiseStep(phases, currentPhases, t, 0.05);
      // Apply golden-angle precession per dimension
      phases     = phases.map((p, j) => (p + windowPrecession * Math.pow(PHI_INV, j)) % (2 * Math.PI));
    }

    const { R } = kuramotoOrderParameter(phases);
    return { forecastPhases: phases, forecastR: R };
  }

  /**
   * Detect anomalous phase drift — a caller whose phases drift unusually fast.
   *
   * Drift rate = Pythagorean distance between consecutive windows' phases
   * / (WINDOW_DURATION_MS) × 1000 (radians per second)
   *
   * Normal drift ≈ golden angle precession ≈ 2π/φ per window
   * Anomalous if drift > 3 × normal_drift
   *
   * @param {number[]} window1Phases
   * @param {number[]} window2Phases
   * @returns {{ anomalous: boolean, driftRate: number, normalRate: number }}
   */
  detectDrift(window1Phases, window2Phases) {
    const N      = Math.min(window1Phases.length, window2Phases.length);
    let sumSq    = 0;
    for (let j = 0; j < N; j++) {
      const d = window1Phases[j] - window2Phases[j];
      sumSq  += d * d;
    }
    const driftRate   = Math.sqrt(sumSq / N);
    const normalRate  = (2 * Math.PI) / PHI;   // expected precession per window
    const anomalous   = driftRate > 3 * normalRate;

    return { anomalous, driftRate, normalRate, phiNormalRate: normalRate };
  }

  getConfig() {
    return { ...this.config, modelId: this.modelId, dimensions: this.dimensions };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  AI-TO-AI AUTHENTICATION BRIDGE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Register an AI model with the geometry lock.
 * Returns a geometric key that the model presents to other models.
 *
 * @param {string} modelId         — unique model identifier
 * @param {string} sharedSecret    — shared secret between models
 * @param {object} gkpLockSDK      — GeometryLockSDK instance
 * @returns {{ registered: boolean, envelope, modelKey: object }}
 */
export function registerAIModel(modelId, sharedSecret, gkpLockSDK) {
  const registration = gkpLockSDK.registerCaller(modelId, sharedSecret);
  const modelKey     = gkpLockSDK.generateKey(modelId);

  console.log(`🤖 AI model registered | modelId=${modelId} | window=${modelKey.windowIndex} | R_self=${modelKey.selfCoherence?.toFixed(4)}`);

  return {
    registered:  true,
    envelope:    registration.envelope,
    modelKey,
    modelId,
    sharedSecret: '[sovereign — not exposed]',
  };
}

/**
 * Authenticate one AI model calling another.
 *
 * @param {object} callerToken   — caller model's GeometricKeyToken
 * @param {object} gkpLockSDK    — lock SDK on the receiving model's side
 * @param {object} geometer      — GEOMETER model for adversarial detection
 * @returns {{ granted, R, isAdversarial, adversarialMargin }}
 */
export function authenticateAICall(callerToken, gkpLockSDK, geometer) {
  const validation = gkpLockSDK.validateKey(callerToken);

  let isAdversarial    = false;
  let adversarialMargin = 1.0;

  if (validation.granted && geometer) {
    const envPhases = gkpLockSDK._protocol.getEnvelopePhases(callerToken.callerId);
    if (envPhases) {
      const check     = geometer.detectAdversarial(callerToken.phases, envPhases);
      isAdversarial   = check.isAdversarial;
      adversarialMargin = check.margin;
    }
  }

  return {
    granted:          validation.granted,
    R:                validation.R,
    psi:              validation.psi,
    reason:           validation.reason,
    isAdversarial,
    adversarialMargin,
    callerId:         callerToken.callerId,
  };
}

export default {
  GEOMETERModel,
  RESONATORModel,
  registerAIModel,
  authenticateAICall,
};
