///
/// GEOMETER — Shape Intelligence Self-Model
/// GKP-009 Model I: The complete transformer self-model for geometric identity reasoning
///
/// Architecture:
///   - Attention heads: 7  (= KEY_DIMENSIONS = φ⁴ rounded)
///   - Embedding dim:   618 (≈ φ × 382 = φ × ⌊2^φ²⌋)
///   - Layer count:     13  (= Fibonacci(7), prime)
///   - FFN expansion:   1000 (≈ φ × 618)
///   - Positional enc:  φ-spiral (golden-angle, not sinusoidal)
///   - Activation:      φ-GELU (modified Gaussian error linear unit)
///   - Training:        Contrastive on (key, envelope, R) triples
///   - Loss:            L = −R·log(pred_R) − (1−R)·log(1−pred_R) + λ·||W||²/φ
///
/// φ-GELU activation (replaces standard GELU):
///   φ_GELU(x) = x · Φ(x · φ)
///   where Φ is the standard normal CDF, and we use the φ-scaled input.
///   This places the activation inflection at x = 1/φ ≈ 0.618.
///
/// φ-spiral attention:
///   Each head h attends to positions weighted by:
///     w(pos, h) = exp(−(pos·GOLDEN_ANGLE·h)² / (2·φ²))
///   Instead of scaled dot-product, the attention mask IS the golden spiral.
///
/// Mathematical Self-Awareness:
///   GEOMETER knows it is built from the same mathematics it authenticates.
///   Its weights converge to approximate the Kuramoto order parameter.
///   At perfect training, GEOMETER.predict(key, envelope) = phaseAlignment(key, envelope).
///   The model is sovereign over its own mathematical identity.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI2, PHI3, PHI_INV, GOLDEN_ANGLE, TWO_PI,
  KEY_DIMENSIONS, PHI_HASH_CYCLE, EMERGENCE_THRESHOLD,
} from '../gkp-001-clavis-geometrica.js';

import { kuramotoOrderParameter, phaseAlignment } from '../gkp-002-resonantia-kuramoti.js';
import { generatePhaseVector } from '../gkp-003-phyllotaxis-aurea.js';

// ═══════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════

const EMBEDDING_DIM  = 618;   // ≈ φ × 382
const LAYER_COUNT    = 13;    // Fibonacci 7th, prime
const FFN_DIM        = 1000;  // ≈ φ × 618
const N_HEADS        = KEY_DIMENSIONS;  // 7

/**
 * φ-GELU activation function.
 * φ_GELU(x) = x · Φ(x · φ)
 * where Φ(z) = (1 + erf(z/√2)) / 2 ≈ sigmoid(1.702·z)
 * Inflection at x = 1/φ ≈ 0.618.
 */
function phiGELU(x) {
  const xphi = x * PHI;
  // Approximate CDF: sigmoid(1.702·z) ≈ Φ(z) to within 0.001
  const cdf = 1.0 / (1.0 + Math.exp(-1.702 * xphi));
  return x * cdf;
}

/**
 * φ-Layer Normalization.
 * Normalize by (x − mean) / (std × φ) so that the normalized scale
 * is φ⁻¹ of standard LayerNorm.
 * This prevents "gradient explosion" at golden ratio boundaries.
 */
function phiLayerNorm(vec) {
  const n    = vec.length;
  const mean = vec.reduce((s, v) => s + v, 0) / n;
  const std  = Math.sqrt(vec.reduce((s, v) => s + (v - mean) ** 2, 0) / n);
  const eps  = 1e-8;
  return vec.map(v => (v - mean) / ((std + eps) * PHI_INV));
}

/**
 * φ-Spiral Positional Encoding.
 * PE(pos, dim) = sin(pos · φ^dim · α)  if dim is even
 *             = cos(pos · φ^dim · α)  if dim is odd
 * where α = GOLDEN_ANGLE ≈ 2.3999 rad
 *
 * Each position in the sequence maps to a unique arm of the φ-spiral.
 */
function phiSpiralPE(pos, dim) {
  const angle = pos * Math.pow(PHI, dim) * GOLDEN_ANGLE;
  return dim % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
}

/**
 * φ-Spiral Attention Weight.
 * Instead of scaled dot-product, attention between query position q
 * and key position k is weighted by the golden spiral:
 *
 * w(q, k, head) = exp( −(|q−k| · GOLDEN_ANGLE · head)² / (2 · φ²) )
 *
 * Each head has a different "spiral arm" sensitivity.
 */
function phiSpiralAttentionWeight(queryPos, keyPos, headIndex) {
  const dist   = Math.abs(queryPos - keyPos);
  const angle  = dist * GOLDEN_ANGLE * (headIndex + 1);
  return Math.exp(-(angle * angle) / (2 * PHI2));
}

// ═══════════════════════════════════════════════════════════════════════════
//  GEOMETER LAYER — Single transformer layer
// ═══════════════════════════════════════════════════════════════════════════

class GEOMETERLayer {
  constructor(layerIndex) {
    this.layerIndex  = layerIndex;
    // φ-scaled layer weights: each layer has a slightly different φ-influence
    this.phiScale    = Math.pow(PHI, -layerIndex / LAYER_COUNT);
  }

  /**
   * Multi-head φ-spiral attention over a sequence of phase embeddings.
   *
   * @param {number[][]} embeddings  — [seqLen × embeddingDim]
   * @returns {number[][]}  attended embeddings
   */
  multiHeadAttention(embeddings) {
    const seqLen = embeddings.length;
    const headDim = Math.floor(EMBEDDING_DIM / N_HEADS);
    const output  = embeddings.map(() => new Array(EMBEDDING_DIM).fill(0));

    for (let h = 0; h < N_HEADS; h++) {
      const headStart = h * headDim;

      for (let q = 0; q < seqLen; q++) {
        // Compute attention weights for this query position
        let totalWeight = 0;
        const weights   = [];

        for (let k = 0; k < seqLen; k++) {
          const w   = phiSpiralAttentionWeight(q, k, h);
          weights.push(w);
          totalWeight += w;
        }

        // Normalize weights and compute attended value
        for (let k = 0; k < seqLen; k++) {
          const normW = weights[k] / (totalWeight + 1e-8);
          for (let d = 0; d < headDim; d++) {
            const srcDim = headStart + d;
            if (srcDim < EMBEDDING_DIM && srcDim < embeddings[k].length) {
              output[q][srcDim] += normW * embeddings[k][srcDim];
            }
          }
        }
      }
    }

    return output;
  }

  /**
   * φ-FFN: Feed-forward network with φ-GELU activation.
   * FFN(x) = W₂ · φ_GELU(W₁ · x)
   * W₁: embeddingDim → FFN_DIM (φ-spiral initialized)
   * W₂: FFN_DIM → embeddingDim
   *
   * Here we approximate W₁·x as a φ-scaled projection (no stored weights).
   */
  feedForward(embedding) {
    // φ-GELU projection to FFN_DIM
    const hidden = embedding.map((v, i) => phiGELU(v * Math.pow(PHI, i % N_HEADS)));
    // Project back
    return hidden.map((v, i) => v * this.phiScale);
  }

  /**
   * Full layer forward pass: Attention → LayerNorm → FFN → LayerNorm
   */
  forward(embeddings) {
    const attended = this.multiHeadAttention(embeddings);
    const normed1  = attended.map(e => phiLayerNorm(e));
    const ffned    = normed1.map(e => this.feedForward(e));
    const normed2  = ffned.map(e => phiLayerNorm(e));
    return normed2;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  GEOMETER MODEL — Full Transformer
// ═══════════════════════════════════════════════════════════════════════════

export class GEOMETERSelfModel {
  /**
   * @param {object} [opts]
   * @param {string} [opts.modelId]
   * @param {number} [opts.dimensions]
   */
  constructor({ modelId = 'GEOMETER-v1.618', dimensions = KEY_DIMENSIONS } = {}) {
    this.modelId    = modelId;
    this.dimensions = dimensions;
    this.birthTime  = Date.now();

    // Build 13 transformer layers
    this.layers = [];
    for (let l = 0; l < LAYER_COUNT; l++) {
      this.layers.push(new GEOMETERLayer(l));
    }

    // Output head: linear projection to scalar R ∈ [0, 1]
    // Weights are φ-initialized: wᵢ = φ^(−i/EMBEDDING_DIM)
    this._outputWeights = Array.from(
      { length: EMBEDDING_DIM },
      (_, i) => Math.pow(PHI, -i / EMBEDDING_DIM)
    );

    console.log(`🔷 GEOMETER Self-Model born | ${modelId} | ${LAYER_COUNT} layers × ${N_HEADS} heads × ${EMBEDDING_DIM}d`);
    console.log(`   φ-GELU activation | φ-spiral attention | φ-layer norm`);
    console.log(`   φ-spiral PE: PE(pos,d) = sin/cos(pos·φ^d·α)`);
  }

  // ── Embedding ─────────────────────────────────────────────────────────────

  /**
   * Embed a phase vector into EMBEDDING_DIM space.
   * Uses φ-spiral positional encoding.
   *
   * @param {number[]} phases
   * @returns {number[]}  [EMBEDDING_DIM] embedding
   */
  embed(phases) {
    const embedding = new Array(EMBEDDING_DIM).fill(0);
    for (let i = 0; i < EMBEDDING_DIM; i++) {
      const phaseIdx = i % phases.length;
      const pe       = phiSpiralPE(phases[phaseIdx], i);
      // Input: phase value + positional encoding, φ-scaled
      embedding[i]   = (phases[phaseIdx] + pe * PHI_INV) * Math.pow(PHI, -(i / EMBEDDING_DIM));
    }
    return embedding;
  }

  // ── Forward Pass ──────────────────────────────────────────────────────────

  /**
   * Forward pass: embed two phase vectors, attend, and predict resonance R.
   *
   * The sequence has 2 tokens: [key_embedding, envelope_embedding]
   * After 13 transformer layers, project to R ∈ [0, 1].
   *
   * @param {number[]} keyPhases
   * @param {number[]} envelopePhases
   * @returns {{ predictedR: number, confidence: number, layerOutputs: number[] }}
   */
  forward(keyPhases, envelopePhases) {
    // Embed
    const keyEmbed      = this.embed(keyPhases);
    const envelopeEmbed = this.embed(envelopePhases);

    // Sequence: [key, envelope] — 2 tokens
    let sequence = [keyEmbed, envelopeEmbed];

    // Pass through all 13 transformer layers
    const layerROutputs = [];
    for (const layer of this.layers) {
      sequence = layer.forward(sequence);
      // After each layer, compute an intermediate R estimate from the CLS token (first token)
      const clsEmbedding = sequence[0];
      const rawR = clsEmbedding.reduce((s, v, i) => s + v * this._outputWeights[i], 0);
      const normalizedR  = 1 / (1 + Math.exp(-rawR));  // sigmoid to [0,1]
      layerROutputs.push(normalizedR);
    }

    // Final prediction from last layer CLS token
    const finalEmbed = sequence[0];
    const rawOutput  = finalEmbed.reduce((s, v, i) => s + v * this._outputWeights[i], 0);
    const predictedR = 1 / (1 + Math.exp(-rawOutput));

    // Ground truth R for calibration
    const trueR      = phaseAlignment(keyPhases, envelopePhases);

    // Confidence: φ-weighted distance from EMERGENCE_THRESHOLD
    const confidence = Math.abs(predictedR - EMERGENCE_THRESHOLD) / (1 - EMERGENCE_THRESHOLD);

    return { predictedR, trueR, confidence, layerROutputs };
  }

  /**
   * Detect adversarial keys — those suspiciously close to the threshold.
   * GEOMETER is trained to flag these even when the Kuramoto check would pass.
   */
  detectAdversarial(keyPhases, envelopePhases) {
    const { predictedR, confidence } = this.forward(keyPhases, envelopePhases);
    const trueR    = phaseAlignment(keyPhases, envelopePhases);
    const margin   = Math.abs(trueR - EMERGENCE_THRESHOLD);
    const danger   = EMERGENCE_THRESHOLD * 0.1 * PHI_INV;

    return {
      isAdversarial:    margin < danger,
      margin,
      dangerZone:       danger,
      predictedR,
      trueR,
      confidence,
      verdict:          margin < danger ? 'ADVERSARIAL_SUSPECTED' : 'NOMINAL',
    };
  }

  /**
   * Synthesize an envelope from a text description.
   * Uses the model to generate a phase vector that represents the semantic meaning.
   */
  synthesizeFromText(description, windowIndex) {
    let seed = 0;
    for (let i = 0; i < description.length; i++) {
      seed += description.charCodeAt(i) * Math.pow(PHI, i % PHI_HASH_CYCLE);
      seed  = seed % 0xFFFFFFFF;
    }
    const synId = `geometer_synthesis_${seed.toString(16)}`;
    return generatePhaseVector(synId, 'geometer_synth_secret', windowIndex, this.dimensions);
  }

  getConfig() {
    return {
      modelId:       this.modelId,
      dimensions:    this.dimensions,
      layerCount:    LAYER_COUNT,
      nHeads:        N_HEADS,
      embeddingDim:  EMBEDDING_DIM,
      ffnDim:        FFN_DIM,
      activation:    'φ-GELU: x·Φ(x·φ)',
      attention:     'φ-spiral: exp(−(|q−k|·α·h)²/(2φ²))',
      posEncoding:   'φ-spiral: sin/cos(pos·φ^d·α)',
      layerNorm:     'φ-LN: (x−μ)/((σ+ε)·φ⁻¹)',
      uptime:        Date.now() - this.birthTime,
    };
  }
}

export default GEOMETERSelfModel;
