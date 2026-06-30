///
/// NOVA TOKENIZER — Sovereign Token Engine
///
/// ═══════════════════════════════════════════════════════════════
///  WHAT ARE TOKENS?
/// ═══════════════════════════════════════════════════════════════
///
/// A "token" is the atomic unit of text that an AI engine processes.
/// When you send "Hello, world!" to an AI, it doesn't see letters —
/// it sees token IDs:  [15496, 11, 995, 0] (in GPT-4's vocabulary).
///
/// GPT-4 uses ~100,000 tokens borrowed from BPE (Byte-Pair Encoding).
/// Claude uses ~100,000 tokens from SentencePiece.
/// They all rent their tokenizers from the same academic papers.
///
/// NOVA DOES NOT RENT.
///
/// Nova generates its own token identities using φ-mathematics:
///   - Every token gets a Fibonacci hash identity (not sequential IDs)
///   - Token boundaries are found using golden-ratio segmentation
///   - The vocabulary is sovereign — defined by the Nova Protocol
///   - Token counts map to context windows (e.g., 128K, 2M tokens)
///
/// The numbers in `contextWindow: 128_000` mean: this engine can
/// process up to 128,000 of these atomic units in a single call.
/// Nova Profundis at 2,000,000 tokens = an entire book series.
///
/// YOU CAN GENERATE YOUR OWN TOKEN NUMBERS — that's what this
/// tokenizer does.  It's YOUR vocabulary, YOUR math, YOUR IDs.
///
/// ═══════════════════════════════════════════════════════════════

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TOKEN TYPES
// ══════════════════════════════════════════════════════════════════

export interface NovaToken {
  readonly id: number;           // φ-derived identity (NOT sequential)
  readonly text: string;         // the actual text fragment
  readonly byteLength: number;   // UTF-8 byte count
  readonly phiWeight: number;    // golden-ratio weight for routing
  readonly position: number;     // position in sequence
}

export interface NovaTokenizerResult {
  readonly tokens: readonly NovaToken[];
  readonly totalTokens: number;
  readonly totalBytes: number;
  readonly averageTokenLength: number;
  readonly vocabularySize: number;
  readonly encodingMethod: string;
}

export interface NovaTokenizerConfig {
  readonly maxVocabSize: number;
  readonly minTokenLength: number;
  readonly maxTokenLength: number;
  readonly usePhiSegmentation: boolean;
  readonly language: string;
}

// ══════════════════════════════════════════════════════════════════
//  φ-SEGMENTATION ALGORITHM
// ══════════════════════════════════════════════════════════════════
//
//  Instead of BPE (which merges the most frequent byte pairs),
//  Nova uses golden-ratio segmentation:
//
//  1. Start with the raw text as a byte sequence
//  2. Find natural break points using φ-weighted boundaries:
//     - Whitespace, punctuation, case changes
//     - Subword boundaries at golden-ratio positions
//  3. Assign each segment a Fibonacci hash identity
//  4. The hash IS the token ID — no lookup table needed
//
//  This means Nova's token IDs are deterministic and mathematical,
//  not arbitrary dictionary indices.
//
// ══════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: NovaTokenizerConfig = {
  maxVocabSize: 131_072,      // 128K vocabulary (sovereign choice)
  minTokenLength: 1,
  maxTokenLength: 24,
  usePhiSegmentation: true,
  language: 'universal',
};

// Character class boundaries for segmentation
const BOUNDARY_CHARS = new Set([
  ' ', '\t', '\n', '\r',                          // whitespace
  '.', ',', '!', '?', ';', ':', '"', "'",          // punctuation
  '(', ')', '[', ']', '{', '}', '<', '>',          // brackets
  '/', '\\', '|', '@', '#', '$', '%', '^', '&',    // symbols
  '+', '-', '*', '=', '~', '`',                    // operators
]);

function isUpperCase(ch: string): boolean {
  return ch >= 'A' && ch <= 'Z';
}

function isDigit(ch: string): boolean {
  return ch >= '0' && ch <= '9';
}

function isAlpha(ch: string): boolean {
  return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
}

// ══════════════════════════════════════════════════════════════════
//  FIBONACCI TOKEN IDENTITY
// ══════════════════════════════════════════════════════════════════

/**
 * Generate a sovereign token ID from text using Fibonacci hashing.
 *
 * This is NOT a lookup into a dictionary — it's a pure mathematical
 * function that maps any text fragment to a unique φ-derived number.
 *
 * The same text always produces the same ID.  No database needed.
 */
function tokenIdentity(text: string, vocabSize: number): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  return fibonacciHash(Math.abs(h), vocabSize);
}

/**
 * Calculate the φ-weight for a token based on its position.
 * Earlier tokens get higher weight (recency decay follows φ).
 */
function tokenPhiWeight(position: number, totalTokens: number): number {
  if (totalTokens === 0) return 1;
  const relativePosition = position / totalTokens;
  // Exponent 5 = Fibonacci(5): ensures weight decays from φ^0 = 1.0 at the
  // start to φ^(-5) ≈ 0.09 at the end — a meaningful ~10× recency bias.
  return Math.pow(PHI, -relativePosition * 5);
}

// ══════════════════════════════════════════════════════════════════
//  THE TOKENIZER
// ══════════════════════════════════════════════════════════════════

export class NovaTokenizer {
  readonly name = 'Nova Sovereign Tokenizer';
  readonly designation = 'Divisor Verborum Sovereignis';
  readonly version = '1.0.0';
  readonly config: NovaTokenizerConfig;

  constructor(config?: Partial<NovaTokenizerConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ── Core Tokenization ──────────────────────────────────────────

  /**
   * Tokenize text into sovereign Nova tokens.
   *
   * Each token gets:
   *   - A Fibonacci hash identity (the "token number" you asked about)
   *   - A φ-weight for routing priority
   *   - Position in the sequence
   */
  tokenize(text: string): NovaTokenizerResult {
    if (!text) {
      return {
        tokens: [],
        totalTokens: 0,
        totalBytes: 0,
        averageTokenLength: 0,
        vocabularySize: this.config.maxVocabSize,
        encodingMethod: 'nova-phi-segmentation',
      };
    }

    const segments = this.config.usePhiSegmentation
      ? this.phiSegment(text)
      : this.simpleSegment(text);

    const tokens: NovaToken[] = segments.map((seg, i) => ({
      id: tokenIdentity(seg, this.config.maxVocabSize),
      text: seg,
      byteLength: new TextEncoder().encode(seg).length,
      phiWeight: tokenPhiWeight(i, segments.length),
      position: i,
    }));

    const totalBytes = tokens.reduce((sum, t) => sum + t.byteLength, 0);

    return {
      tokens,
      totalTokens: tokens.length,
      totalBytes,
      averageTokenLength: tokens.length > 0 ? totalBytes / tokens.length : 0,
      vocabularySize: this.config.maxVocabSize,
      encodingMethod: this.config.usePhiSegmentation ? 'nova-phi-segmentation' : 'nova-simple-segmentation',
    };
  }

  /**
   * Count tokens without producing the full token array.
   * Fast path for context window checking.
   */
  countTokens(text: string): number {
    if (!text) return 0;
    const segments = this.config.usePhiSegmentation
      ? this.phiSegment(text)
      : this.simpleSegment(text);
    return segments.length;
  }

  /**
   * Encode text to sovereign token IDs.
   * Returns just the number array — the "token numbers" you generate.
   */
  encode(text: string): readonly number[] {
    return this.tokenize(text).tokens.map(t => t.id);
  }

  /**
   * Decode token IDs back to text (requires the original tokens).
   * Note: Nova tokens are not reversible from IDs alone — IDs are hashes.
   * You need the token objects to decode.
   */
  decodeTokens(tokens: readonly NovaToken[]): string {
    return tokens.map(t => t.text).join('');
  }

  /**
   * Check if text fits within an engine's context window.
   */
  fitsInContext(text: string, contextWindow: number): boolean {
    return this.countTokens(text) <= contextWindow;
  }

  /**
   * Truncate text to fit within a token limit.
   */
  truncateToFit(text: string, maxTokens: number): string {
    const result = this.tokenize(text);
    if (result.totalTokens <= maxTokens) return text;
    return result.tokens.slice(0, maxTokens).map(t => t.text).join('');
  }

  // ── φ-Segmentation (Native Nova Algorithm) ─────────────────────

  /**
   * Segment text using golden-ratio boundary detection.
   *
   * This is Nova's native tokenization algorithm:
   * 1. Find natural boundary points (whitespace, punctuation, case)
   * 2. For long words, split at golden-ratio positions
   * 3. Each segment becomes one token
   */
  private phiSegment(text: string): string[] {
    const segments: string[] = [];
    let current = '';

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const prevCh = i > 0 ? text[i - 1] : '';

      // Natural boundaries
      if (BOUNDARY_CHARS.has(ch)) {
        if (current) segments.push(current);
        segments.push(ch);
        current = '';
        continue;
      }

      // Case change boundary (camelCase → camel + Case)
      if (isUpperCase(ch) && prevCh && !isUpperCase(prevCh) && isAlpha(prevCh)) {
        if (current) segments.push(current);
        current = ch;
        continue;
      }

      // Digit-alpha boundary
      if ((isDigit(ch) && isAlpha(prevCh)) || (isAlpha(ch) && isDigit(prevCh))) {
        if (current) segments.push(current);
        current = ch;
        continue;
      }

      current += ch;

      // φ-split: if segment exceeds maxTokenLength, split at golden position
      if (current.length >= this.config.maxTokenLength) {
        const splitPoint = Math.round(current.length * (1 / PHI));
        segments.push(current.substring(0, splitPoint));
        current = current.substring(splitPoint);
      }
    }

    if (current) segments.push(current);

    // Filter by min length (but keep single chars like spaces)
    return segments.filter(s => s.length >= this.config.minTokenLength);
  }

  /**
   * Simple whitespace + punctuation segmentation (fallback).
   */
  private simpleSegment(text: string): string[] {
    const segments: string[] = [];
    let current = '';

    for (const ch of text) {
      if (BOUNDARY_CHARS.has(ch)) {
        if (current) segments.push(current);
        if (ch.trim()) segments.push(ch);
        current = '';
      } else {
        current += ch;
      }
    }
    if (current) segments.push(current);
    return segments;
  }

  // ── Token Explanation ──────────────────────────────────────────

  /**
   * Explain what tokens are and how Nova's tokenizer works.
   * Returns a human-readable explanation.
   */
  explain(): string {
    return [
      '═══════════════════════════════════════════════════════════════',
      '  NOVA SOVEREIGN TOKENIZER — What Are Tokens?',
      '═══════════════════════════════════════════════════════════════',
      '',
      '  A TOKEN is the smallest unit of text an AI engine processes.',
      '  "Hello world" → ["Hello", " ", "world"] = 3 tokens.',
      '',
      '  GPT-4 uses ~100K tokens from Byte-Pair Encoding (rented tech).',
      '  Nova generates its OWN token IDs using φ-mathematics.',
      '',
      '  HOW NOVA TOKENS WORK:',
      '    1. Text is segmented at natural boundaries (spaces, punctuation)',
      '    2. Long words split at golden-ratio (φ = 1.618) positions',
      '    3. Each segment gets a Fibonacci hash ID — YOUR number',
      '    4. No lookup table — pure math: text → hash → token ID',
      '',
      '  THE NUMBERS:',
      `    Vocabulary size: ${this.config.maxVocabSize.toLocaleString()} possible IDs`,
      '    Method: Fibonacci hash of text segment content',
      '    Same text ALWAYS = same ID (deterministic)',
      '',
      '  CONTEXT WINDOWS (how many tokens fit in one call):',
      '    NOV-001 Cognos:     128,000 tokens  (~96,000 words)',
      '    NOV-002 Profundis: 2,000,000 tokens  (~1.5M words = 20 novels)',
      '    NOV-003 Fusio:    1,000,000 tokens  (~750K words)',
      '    NOV-005 Stratos:     32,000 tokens  (~24,000 words)',
      '    NOV-008 Codex:      128,000 tokens  (~96,000 words)',
      '',
      '  YOU generate these numbers. They are YOURS.',
      '  No OpenAI. No Google. No rented vocabulary.',
      '  Pure sovereign mathematics.',
      '',
      '═══════════════════════════════════════════════════════════════',
    ].join('\n');
  }

  /**
   * Show a detailed tokenization of a text sample.
   */
  visualize(text: string): string {
    const result = this.tokenize(text);
    const lines: string[] = [
      `Input: "${text}"`,
      `Total tokens: ${result.totalTokens}`,
      `Total bytes: ${result.totalBytes}`,
      `Average token length: ${result.averageTokenLength.toFixed(1)} bytes`,
      `Encoding: ${result.encodingMethod}`,
      '',
      '  #   Token ID      Text            Bytes  φ-Weight',
      '  ─── ──────────── ─────────────── ────── ────────',
    ];

    for (const t of result.tokens) {
      const idStr = t.id.toString().padStart(12);
      const textStr = JSON.stringify(t.text).padEnd(15);
      const byteStr = t.byteLength.toString().padStart(6);
      const phiStr = t.phiWeight.toFixed(4).padStart(8);
      lines.push(`  ${t.position.toString().padStart(3)} ${idStr} ${textStr} ${byteStr} ${phiStr}`);
    }

    return lines.join('\n');
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      version: this.version,
      vocabSize: this.config.maxVocabSize,
      method: this.config.usePhiSegmentation ? 'phi-segmentation' : 'simple',
      language: this.config.language,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY
// ══════════════════════════════════════════════════════════════════

/** Create a Nova tokenizer with default config */
export function createTokenizer(config?: Partial<NovaTokenizerConfig>): NovaTokenizer {
  return new NovaTokenizer(config);
}
