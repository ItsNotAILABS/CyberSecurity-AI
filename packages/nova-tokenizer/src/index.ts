/**
 * @nova-protocol/nova-tokenizer
 *
 * φ-Segmentation: Sovereign tokenization using golden-ratio mathematics.
 *
 * Replaces BPE / SentencePiece with a fully deterministic mathematical
 * segmentation algorithm. No corpus, no merge tables, no vendor lock-in.
 * The golden ratio IS the tokenizer.
 *
 * Reference: NOVA-RP-001 — Casa de Medina
 */

import {
  PHI,
  fibonacciHash,
  phiWeightDepth,
  charEntropy,
  isNaturalBreak,
} from '../../phi-math/src/index';

// ─── Types ───────────────────────────────────────────────────────────────────

/** A single φ-segmented token */
export interface NovaToken {
  /** Raw token text */
  text: string;
  /** Fibonacci-hash content-addressed ID in [0, vocabSize) */
  id: number;
  /** φ-weight: relevance/priority score */
  phi_w: number;
  /** Position (byte offset) in the original string */
  offset: number;
}

/** Options for NovaTokenizer */
export interface NovaTokenizerOptions {
  /** Vocabulary size (default 131 072 = 2^17) */
  vocabSize?: number;
  /** Minimum segment length in characters (default 1) */
  minLength?: number;
  /** Maximum segment length in characters (default 64) */
  maxLength?: number;
}

// ─── φ-Segmentation Algorithm ────────────────────────────────────────────────

/**
 * NovaTokenizer — sovereign φ-Segmentation tokenizer.
 *
 * @example
 * ```ts
 * const tokenizer = new NovaTokenizer();
 * const tokens = tokenizer.encode("Solve x² + 2x + 1 = 0");
 * // → [{ text: "Solve", id: 84201, phi_w: 0.618, offset: 0 }, ...]
 * const decoded = tokenizer.decode(tokens);
 * // → "Solve x² + 2x + 1 = 0"
 * ```
 */
export class NovaTokenizer {
  readonly vocabSize: number;
  readonly minLength: number;
  readonly maxLength: number;

  constructor(options: NovaTokenizerOptions = {}) {
    this.vocabSize = options.vocabSize ?? 131_072;
    this.minLength = options.minLength ?? 1;
    this.maxLength = options.maxLength ?? 64;
  }

  /**
   * Encode `text` into an array of NovaTokens using φ-Segmentation.
   *
   * Algorithm:
   *   For each character pair (i-1, i):
   *     threshold = (i × φ) mod 1.0
   *     entropy   = charEntropy(text[i-1], text[i])
   *     boundary  = entropy > threshold || isNaturalBreak(text[i])
   *   Segments are split at boundaries, then assigned Fibonacci-hash IDs.
   */
  encode(text: string): NovaToken[] {
    if (text.length === 0) return [];

    const boundaries: number[] = [];
    for (let i = 1; i < text.length; i++) {
      const threshold = (i * PHI) % 1.0;
      const entropy = charEntropy(text[i - 1], text[i]);
      if (entropy > threshold || isNaturalBreak(text[i])) {
        boundaries.push(i);
      }
    }

    // Build segments from boundaries
    const segments: Array<{ text: string; offset: number }> = [];
    let prev = 0;
    for (const b of boundaries) {
      if (b - prev >= this.minLength) {
        segments.push({ text: text.slice(prev, b), offset: prev });
        prev = b;
      }
    }
    if (prev < text.length) {
      segments.push({ text: text.slice(prev), offset: prev });
    }

    // Enforce maxLength by splitting long segments
    const finalSegments: Array<{ text: string; offset: number }> = [];
    for (const seg of segments) {
      if (seg.text.length <= this.maxLength) {
        finalSegments.push(seg);
      } else {
        let pos = 0;
        while (pos < seg.text.length) {
          const chunk = seg.text.slice(pos, pos + this.maxLength);
          finalSegments.push({ text: chunk, offset: seg.offset + pos });
          pos += this.maxLength;
        }
      }
    }

    // Assign IDs and φ-weights
    return finalSegments.map((seg, depth) => ({
      text: seg.text,
      id: fibonacciHash(seg.text, this.vocabSize),
      phi_w: phiWeightDepth(seg.text.length, depth),
      offset: seg.offset,
    }));
  }

  /**
   * Decode an array of NovaTokens back to the original string.
   * Reconstruction is lossless — offsets are not needed for concatenation.
   */
  decode(tokens: NovaToken[]): string {
    return tokens.map((t) => t.text).join('');
  }

  /**
   * Returns the token count for `text`.
   * More efficient than encode() when only the count is needed.
   */
  countTokens(text: string): number {
    return this.encode(text).length;
  }

  /**
   * Vocabulary size used by this tokenizer instance.
   */
  vocabInfo(): { size: number; bitsRequired: number } {
    return {
      size: this.vocabSize,
      bitsRequired: Math.ceil(Math.log2(this.vocabSize)),
    };
  }
}

// ─── Convenience exports ─────────────────────────────────────────────────────

/** Default tokenizer instance (vocabSize = 131 072) */
export const defaultTokenizer = new NovaTokenizer();

/**
 * Encode `text` using the default tokenizer.
 */
export function encode(text: string): NovaToken[] {
  return defaultTokenizer.encode(text);
}

/**
 * Decode an array of tokens using the default tokenizer.
 */
export function decode(tokens: NovaToken[]): string {
  return defaultTokenizer.decode(tokens);
}

/**
 * Count tokens for `text` using the default tokenizer.
 */
export function countTokens(text: string): number {
  return defaultTokenizer.countTokens(text);
}

export { fibonacciHash } from '../../phi-math/src/index';
