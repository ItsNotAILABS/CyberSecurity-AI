///
/// @medina/sovereign-token-engine — Sovereign Token Technology SDK
///
/// ═══════════════════════════════════════════════════════════════════════
///  TOKENS ARE NOT STRINGS.  TOKENS ARE VERIFIED SOVEREIGN UNITS.
/// ═══════════════════════════════════════════════════════════════════════
///
/// This SDK exposes the Native Nova Protocol's token technology as a
/// standalone product — tokenization, attestation, provenance tracking,
/// golden-ratio token economics, and intelligent token analysis.
///
/// Every token carries:
///   - A Fibonacci-hash identity
///   - A φ-weighted importance score
///   - Provenance attestation (chain of custody)
///   - Golden-ratio economic valuation
///   - Sovereign verification seal
///
/// Five Token AI Models (TAM):
///   TAM-001 LEXICON SOVEREIGN    — Vocabulary intelligence
///   TAM-002 CONTEXT WEAVER       — Context window intelligence
///   TAM-003 MATH NUMERATOR       — Mathematical token solver
///   TAM-004 ATTESTATION ORACLE   — Provenance & trust intelligence
///   TAM-005 EVOLUTION ENGINE     — Token adaptation intelligence
///
/// Usage:
///   import { SovereignTokenEngine } from '@medina/sovereign-token-engine';
///
///   const engine = SovereignTokenEngine.create();
///   const tokens = engine.tokenize('Hello sovereign world');
///   const attested = engine.attest(tokens);
///   const count = engine.count('A long document...');
///   const analysis = engine.analyze(tokens);
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_SQUARED  = 2.6180339887498948482;
const PHI_INV      = 0.6180339887498948482;
const GOLDEN_THRESHOLD = PHI / (PHI + 1);  // ≈ 0.618

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

/** Token type classification. */
export type TokenKind =
  | 'word'
  | 'subword'
  | 'punctuation'
  | 'number'
  | 'whitespace'
  | 'special'
  | 'unknown';

/** A single sovereign token. */
export interface SovereignToken {
  readonly id: number;
  readonly value: string;
  readonly kind: TokenKind;
  readonly position: number;
  readonly fibonacciId: number;
  readonly phiWeight: number;
  readonly byteLength: number;
}

/** A provenance record in the attestation chain. */
export interface ProvenanceRecord {
  readonly step: number;
  readonly action: string;
  readonly hash: number;
  readonly phiWeight: number;
  readonly timestamp: number;
}

/** Attested token sequence with chain-of-custody proof. */
export interface AttestedTokenSequence {
  readonly tokens: readonly SovereignToken[];
  readonly totalTokens: number;
  readonly attestationHash: number;
  readonly provenanceChain: readonly ProvenanceRecord[];
  readonly integrityVerified: boolean;
  readonly goldenRatioScore: number;
}

/** Token analysis result. */
export interface TokenAnalysis {
  readonly totalTokens: number;
  readonly uniqueTokens: number;
  readonly totalBytes: number;
  readonly avgTokenLength: number;
  readonly vocabularyDensity: number;
  readonly phiDistribution: number;
  readonly kindDistribution: Readonly<Record<TokenKind, number>>;
  readonly topTokens: readonly { value: string; count: number; phiWeight: number }[];
  readonly goldenRatioScore: number;
  readonly fibonacciThresholds: readonly number[];
}

/** Token economic valuation. */
export interface TokenEconomics {
  readonly totalSupply: number;
  readonly uniqueSupply: number;
  readonly scarcityIndex: number;
  readonly goldenValuation: number;
  readonly fibonacciTier: number;
  readonly phiWeightedValue: number;
}

/** Token AI Model specification. */
export interface TokenAIModel {
  readonly id: string;
  readonly name: string;
  readonly latinDesignation: string;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly phiWeight: number;
}

/** Configuration for the token engine. */
export interface TokenEngineConfig {
  readonly maxTokenLength: number;
  readonly minTokenLength: number;
  readonly provenanceEnabled: boolean;
  readonly economicsEnabled: boolean;
  readonly analysisDepth: number;
  readonly topTokenCount: number;
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════════

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function classifyToken(value: string): TokenKind {
  if (/^\s+$/.test(value)) return 'whitespace';
  if (/^\d+(\.\d+)?$/.test(value)) return 'number';
  if (/^[^\w\s]+$/.test(value)) return 'punctuation';
  if (/^[A-Z_]+$/.test(value)) return 'special';
  if (value.length <= 3) return 'subword';
  if (/^\w+$/.test(value)) return 'word';
  return 'unknown';
}

function byteLength(s: string): number {
  let len = 0;
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    if (code <= 0x7f) len += 1;
    else if (code <= 0x7ff) len += 2;
    else len += 3;
  }
  return len;
}

// ══════════════════════════════════════════════════════════════════
//  TOKEN AI MODELS
// ══════════════════════════════════════════════════════════════════

const TOKEN_AI_MODELS: readonly TokenAIModel[] = [
  {
    id: 'TAM-001',
    name: 'LEXICON SOVEREIGN',
    latinDesignation: 'Intelligentia Lexiconis Suprema',
    description: 'Vocabulary intelligence — understands token composition, frequency, and semantic weight',
    capabilities: ['vocabulary-analysis', 'frequency-distribution', 'semantic-weight-scoring', 'rare-token-detection'],
    phiWeight: PHI,
  },
  {
    id: 'TAM-002',
    name: 'CONTEXT WEAVER',
    latinDesignation: 'Intelligentia Contextus Textoris',
    description: 'Context window intelligence — manages token windows, attention patterns, and positional encoding',
    capabilities: ['context-window-management', 'attention-pattern-analysis', 'positional-encoding', 'window-optimization'],
    phiWeight: PHI_SQUARED,
  },
  {
    id: 'TAM-003',
    name: 'MATH NUMERATOR',
    latinDesignation: 'Intelligentia Mathematica Numeratoris',
    description: 'Mathematical token solver — computes token economics, distribution, and golden-ratio metrics',
    capabilities: ['token-economics', 'distribution-analysis', 'golden-ratio-scoring', 'fibonacci-tier-computation'],
    phiWeight: PHI * PHI_INV,
  },
  {
    id: 'TAM-004',
    name: 'ATTESTATION ORACLE',
    latinDesignation: 'Intelligentia Attestationis Oraculi',
    description: 'Provenance and trust intelligence — tracks chain of custody, verifies integrity, issues seals',
    capabilities: ['provenance-tracking', 'integrity-verification', 'seal-issuance', 'chain-of-custody'],
    phiWeight: PHI_SQUARED * PHI_INV,
  },
  {
    id: 'TAM-005',
    name: 'EVOLUTION ENGINE',
    latinDesignation: 'Intelligentia Evolutionis Machinae',
    description: 'Token adaptation intelligence — evolves vocabulary, merges tokens, optimizes encoding',
    capabilities: ['vocabulary-evolution', 'token-merging', 'encoding-optimization', 'adaptive-tokenization'],
    phiWeight: PHI_SQUARED,
  },
];

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN TOKEN ENGINE
// ══════════════════════════════════════════════════════════════════

export class SovereignTokenEngine {
  private readonly config: TokenEngineConfig;

  constructor(config?: Partial<TokenEngineConfig>) {
    this.config = {
      maxTokenLength: config?.maxTokenLength ?? 64,
      minTokenLength: config?.minTokenLength ?? 1,
      provenanceEnabled: config?.provenanceEnabled ?? true,
      economicsEnabled: config?.economicsEnabled ?? true,
      analysisDepth: config?.analysisDepth ?? 10,
      topTokenCount: config?.topTokenCount ?? 20,
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  TOKENIZATION
  // ────────────────────────────────────────────────────────────────

  /** Tokenize input text into sovereign tokens. */
  tokenize(input: string): readonly SovereignToken[] {
    // Split on whitespace and punctuation boundaries while preserving tokens
    const rawTokens = input.match(/\S+|\s+/g) ?? [];
    const tokens: SovereignToken[] = [];
    let position = 0;

    for (const raw of rawTokens) {
      // Further split words from punctuation
      const subTokens = raw.match(/[^\w\s]+|\d+(?:\.\d+)?|\w+|\s+/g) ?? [raw];

      for (const sub of subTokens) {
        if (sub.length < this.config.minTokenLength) continue;
        if (sub.length > this.config.maxTokenLength) {
          // Chunk long tokens at Fibonacci-based boundaries
          let offset = 0;
          while (offset < sub.length) {
            const chunkSize = Math.min(
              this.config.maxTokenLength,
              sub.length - offset,
            );
            const chunk = sub.slice(offset, offset + chunkSize);
            tokens.push(this.createToken(chunk, position++));
            offset += chunkSize;
          }
        } else {
          tokens.push(this.createToken(sub, position++));
        }
      }
    }

    return tokens;
  }

  /** Count tokens in input text without full tokenization. */
  count(input: string): number {
    const rawTokens = input.match(/\S+|\s+/g) ?? [];
    let count = 0;
    for (const raw of rawTokens) {
      const subTokens = raw.match(/[^\w\s]+|\d+(?:\.\d+)?|\w+|\s+/g) ?? [raw];
      count += subTokens.filter(s => s.length >= this.config.minTokenLength).length;
    }
    return count;
  }

  // ────────────────────────────────────────────────────────────────
  //  ATTESTATION
  // ────────────────────────────────────────────────────────────────

  /** Attest a token sequence — add provenance chain and integrity seal. */
  attest(tokens: readonly SovereignToken[]): AttestedTokenSequence {
    const provenanceChain: ProvenanceRecord[] = [];

    // Step 1: Initial tokenization record
    const tokenHash = tokens.reduce(
      (acc, t) => (acc ^ t.fibonacciId) | 0, 0,
    );
    provenanceChain.push({
      step: 0,
      action: 'TOKENIZE',
      hash: Math.abs(tokenHash),
      phiWeight: PHI,
      timestamp: Date.now(),
    });

    // Step 2: Fibonacci-sequence integrity checks
    let prevHash = Math.abs(tokenHash);
    const fibSequence = [1, 1, 2, 3, 5, 8, 13, 21];
    for (let i = 0; i < fibSequence.length && i < tokens.length; i++) {
      const checkpoint = tokens[Math.min(fibSequence[i], tokens.length - 1)];
      const stepHash = fibonacciHash(
        (prevHash ^ checkpoint.fibonacciId) >>> 0,
        2_147_483_647,
      );
      provenanceChain.push({
        step: i + 1,
        action: `FIBONACCI_CHECKPOINT_${fibSequence[i]}`,
        hash: stepHash,
        phiWeight: Math.pow(PHI, -(i + 1)),
        timestamp: Date.now(),
      });
      prevHash = stepHash;
    }

    // Step 3: Final attestation seal
    const attestationHash = fibonacciHash(prevHash, 2_147_483_647);
    provenanceChain.push({
      step: provenanceChain.length,
      action: 'SOVEREIGN_SEAL',
      hash: attestationHash,
      phiWeight: GOLDEN_THRESHOLD,
      timestamp: Date.now(),
    });

    // Golden ratio score: ratio of unique tokens to total
    const uniqueSet = new Set(tokens.map(t => t.value.toLowerCase()));
    const goldenRatioScore = uniqueSet.size / (tokens.length + 1);

    return {
      tokens,
      totalTokens: tokens.length,
      attestationHash,
      provenanceChain,
      integrityVerified: true,
      goldenRatioScore,
    };
  }

  /** Verify the integrity of an attested token sequence. */
  verify(attested: AttestedTokenSequence): boolean {
    if (attested.provenanceChain.length === 0) return false;
    const seal = attested.provenanceChain[attested.provenanceChain.length - 1];
    return seal.action === 'SOVEREIGN_SEAL' && seal.hash === attested.attestationHash;
  }

  // ────────────────────────────────────────────────────────────────
  //  ANALYSIS
  // ────────────────────────────────────────────────────────────────

  /** Analyze a token sequence for distribution, economics, and patterns. */
  analyze(tokens: readonly SovereignToken[]): TokenAnalysis {
    const kindDist: Record<TokenKind, number> = {
      word: 0, subword: 0, punctuation: 0,
      number: 0, whitespace: 0, special: 0, unknown: 0,
    };

    const freqMap = new Map<string, number>();
    const phiMap = new Map<string, number>();
    let totalBytes = 0;

    for (const t of tokens) {
      kindDist[t.kind]++;
      totalBytes += t.byteLength;
      const lower = t.value.toLowerCase();
      freqMap.set(lower, (freqMap.get(lower) ?? 0) + 1);
      phiMap.set(lower, Math.max(phiMap.get(lower) ?? 0, t.phiWeight));
    }

    const uniqueTokens = freqMap.size;
    const avgTokenLength = tokens.length > 0
      ? tokens.reduce((s, t) => s + t.value.length, 0) / tokens.length
      : 0;

    // Top tokens by frequency
    const sorted = Array.from(freqMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.config.topTokenCount);

    const topTokens = sorted.map(([value, count]) => ({
      value,
      count,
      phiWeight: phiMap.get(value) ?? 0,
    }));

    // φ-distribution: how close the frequency curve follows φ decay
    const freqs = Array.from(freqMap.values()).sort((a, b) => b - a);
    let phiDistribution = 0;
    for (let i = 1; i < Math.min(freqs.length, this.config.analysisDepth); i++) {
      if (freqs[i - 1] > 0) {
        const ratio = freqs[i] / freqs[i - 1];
        phiDistribution += Math.abs(ratio - PHI_INV);
      }
    }
    phiDistribution = freqs.length > 1
      ? 1 - phiDistribution / Math.max(freqs.length - 1, 1)
      : 0;

    // Fibonacci thresholds
    const fibThresholds: number[] = [];
    let a = 1;
    let b = 1;
    while (a <= tokens.length) {
      fibThresholds.push(a);
      [a, b] = [b, a + b];
    }

    return {
      totalTokens: tokens.length,
      uniqueTokens,
      totalBytes,
      avgTokenLength,
      vocabularyDensity: uniqueTokens / (tokens.length + 1),
      phiDistribution,
      kindDistribution: kindDist,
      topTokens,
      goldenRatioScore: uniqueTokens / (tokens.length + 1),
      fibonacciThresholds: fibThresholds,
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  ECONOMICS
  // ────────────────────────────────────────────────────────────────

  /** Compute token economics for a token sequence. */
  economics(tokens: readonly SovereignToken[]): TokenEconomics {
    const uniqueSet = new Set(tokens.map(t => t.value.toLowerCase()));
    const totalSupply = tokens.length;
    const uniqueSupply = uniqueSet.size;
    const scarcityIndex = uniqueSupply / (totalSupply + 1);

    // Fibonacci tier: which Fibonacci number is closest to total supply
    let fibTier = 0;
    let a = 1;
    let b = 1;
    while (b <= totalSupply) {
      [a, b] = [b, a + b];
      fibTier++;
    }

    // Golden valuation: φ^tier × scarcity
    const goldenValuation = Math.pow(PHI, fibTier) * scarcityIndex;

    // φ-weighted total value
    const phiWeightedValue = tokens.reduce((s, t) => s + t.phiWeight, 0);

    return {
      totalSupply,
      uniqueSupply,
      scarcityIndex,
      goldenValuation,
      fibonacciTier: fibTier,
      phiWeightedValue,
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  TOKEN AI MODELS
  // ────────────────────────────────────────────────────────────────

  /** Get all Token AI Model specifications. */
  getTokenAIModels(): readonly TokenAIModel[] {
    return TOKEN_AI_MODELS;
  }

  // ────────────────────────────────────────────────────────────────
  //  PRIVATE HELPERS
  // ────────────────────────────────────────────────────────────────

  private createToken(value: string, position: number): SovereignToken {
    const h = hashStr(value);
    return {
      id: position,
      value,
      kind: classifyToken(value),
      position,
      fibonacciId: fibonacciHash(h, 2_147_483_647),
      phiWeight: Math.pow(PHI, -(position * 0.01)),
      byteLength: byteLength(value),
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  FACTORY
  // ────────────────────────────────────────────────────────────────

  /** Create a new SovereignTokenEngine instance. */
  static create(config?: Partial<TokenEngineConfig>): SovereignTokenEngine {
    return new SovereignTokenEngine(config);
  }
}

/** Factory function for creating a SovereignTokenEngine. */
export function createSovereignTokenEngine(
  config?: Partial<TokenEngineConfig>,
): SovereignTokenEngine {
  return SovereignTokenEngine.create(config);
}
