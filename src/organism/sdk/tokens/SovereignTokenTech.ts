///
/// TOKEN TECHNOLOGY TT-012: SOVEREIGN — Self-Governing Token Technology
///
/// Tokens that manage their own lifecycle — they can merge, split,
/// evolve, and attest themselves. Each token is a sovereign entity
/// with its own generation lineage and health.
///
/// Formula: S(t) = G(gen) × H(health) × A(attestation_chain) × φ^(-age)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, fibonacciHash, DimensionalPlane } from '../../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INV = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;

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

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type TokenLifecycleState = 'minted' | 'active' | 'merging' | 'splitting' | 'evolving' | 'attesting' | 'archived' | 'transcendent';

export interface SelfGoverningToken {
  readonly id: number;
  readonly value: string;
  readonly state: TokenLifecycleState;
  readonly generation: number;
  readonly parentIds: readonly number[];
  readonly childIds: readonly number[];
  readonly fibonacciId: number;
  readonly phiWeight: number;
  readonly attestationChain: readonly number[];
  readonly evolutionCount: number;
  readonly health: number;
  readonly timestamp: number;
}

export interface TokenMergeResult {
  readonly mergedToken: SelfGoverningToken;
  readonly sourceTokens: readonly SelfGoverningToken[];
  readonly mergeAttestation: number;
}

export interface TokenSplitResult {
  readonly sourceToken: SelfGoverningToken;
  readonly childTokens: readonly SelfGoverningToken[];
  readonly splitAttestation: number;
}

export interface TokenEvolutionResult {
  readonly token: SelfGoverningToken;
  readonly previousGeneration: number;
  readonly newGeneration: number;
  readonly evolutionAttestation: number;
}

export interface SovereignTokenResult {
  readonly technologyId: 'TT-012';
  readonly inputText: string;
  readonly tokenCount: number;
  readonly tokens: readonly SelfGoverningToken[];
  readonly averageHealth: number;
  readonly totalGenerations: number;
  readonly attestation: number;
}

export interface SovereignTokenTechConfig {
  readonly initialHealth: number;
  readonly evolutionThreshold: number;
  readonly maxGeneration: number;
  readonly attestationEnabled: boolean;
}

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN TOKEN TECH
// ══════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: SovereignTokenTechConfig = {
  initialHealth: PHI_INV,
  evolutionThreshold: 3,
  maxGeneration: 21,        // Fibonacci 21
  attestationEnabled: true,
};

export class SovereignTokenTech {
  private readonly config: SovereignTokenTechConfig;
  private nextId = 0;

  constructor(config?: Partial<SovereignTokenTechConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Tokenize input into self-governing tokens */
  tokenize(input: string): SovereignTokenResult {
    const words = input.split(/\s+/).filter(w => w.length > 0);

    const tokens: SelfGoverningToken[] = words.map((word, i) => {
      this.nextId++;
      const raw = hashStr(word);
      const fibId = fibonacciHash(raw, 2_147_483_647);
      const phiWeight = Math.pow(PHI, -(i / Math.max(words.length, 1))) * PHI_INV;

      const initialAttestation = this.config.attestationEnabled
        ? fibonacciHash((raw ^ hashStr(String(i))) >>> 0, 2_147_483_647)
        : 0;

      return {
        id: this.nextId,
        value: word,
        state: 'minted' as TokenLifecycleState,
        generation: 0,
        parentIds: [],
        childIds: [],
        fibonacciId: fibId,
        phiWeight,
        attestationChain: initialAttestation ? [initialAttestation] : [],
        evolutionCount: 0,
        health: this.config.initialHealth,
        timestamp: Date.now(),
      };
    });

    const averageHealth = tokens.length > 0
      ? tokens.reduce((sum, t) => sum + t.health, 0) / tokens.length
      : 0;

    const totalGenerations = tokens.reduce((sum, t) => sum + t.generation, 0);

    const attestation = fibonacciHash(
      Math.abs(tokens.reduce((h, t) => ((h << 5) - h + t.fibonacciId) | 0, 0)),
      2_147_483_647,
    );

    return {
      technologyId: 'TT-012',
      inputText: input,
      tokenCount: tokens.length,
      tokens,
      averageHealth,
      totalGenerations,
      attestation,
    };
  }

  /** Merge two tokens into one. New generation = max + 1. */
  merge(tokenA: SelfGoverningToken, tokenB: SelfGoverningToken): TokenMergeResult {
    this.nextId++;
    const mergedValue = `${tokenA.value}+${tokenB.value}`;
    const newGeneration = Math.max(tokenA.generation, tokenB.generation) + 1;
    const combinedChain = [...tokenA.attestationChain, ...tokenB.attestationChain];

    const mergeHash = fibonacciHash(
      (hashStr(mergedValue) ^ (tokenA.fibonacciId + tokenB.fibonacciId)) >>> 0,
      2_147_483_647,
    );

    const mergedToken: SelfGoverningToken = {
      id: this.nextId,
      value: mergedValue,
      state: 'active',
      generation: Math.min(newGeneration, this.config.maxGeneration),
      parentIds: [tokenA.id, tokenB.id],
      childIds: [],
      fibonacciId: mergeHash,
      phiWeight: (tokenA.phiWeight + tokenB.phiWeight) * PHI_INV,
      attestationChain: [...combinedChain, mergeHash],
      evolutionCount: Math.max(tokenA.evolutionCount, tokenB.evolutionCount),
      health: PHI_INV,
      timestamp: Date.now(),
    };

    return {
      mergedToken,
      sourceTokens: [
        { ...tokenA, state: 'merging', childIds: [...tokenA.childIds, this.nextId] },
        { ...tokenB, state: 'merging', childIds: [...tokenB.childIds, this.nextId] },
      ],
      mergeAttestation: mergeHash,
    };
  }

  /** Split a token into children (default 2) */
  split(token: SelfGoverningToken, count = 2): TokenSplitResult {
    const chars = token.value;
    const chunkSize = Math.max(1, Math.ceil(chars.length / count));
    const childIds: number[] = [];

    const childTokens: SelfGoverningToken[] = [];
    for (let c = 0; c < count; c++) {
      this.nextId++;
      childIds.push(this.nextId);
      const portion = chars.slice(c * chunkSize, (c + 1) * chunkSize) || `${token.value}_${c}`;

      const childHash = fibonacciHash(
        (hashStr(portion) ^ hashStr(String(c * PHI_SQUARED))) >>> 0,
        2_147_483_647,
      );

      childTokens.push({
        id: this.nextId,
        value: portion,
        state: 'active',
        generation: token.generation,
        parentIds: [token.id],
        childIds: [],
        fibonacciId: childHash,
        phiWeight: token.phiWeight * PHI_INV,
        attestationChain: [...token.attestationChain, childHash],
        evolutionCount: token.evolutionCount,
        health: token.health * PHI_INV,
        timestamp: Date.now(),
      });
    }

    const splitAttestation = fibonacciHash(
      Math.abs(childTokens.reduce((h, t) => ((h << 5) - h + t.fibonacciId) | 0, 0)),
      2_147_483_647,
    );

    return {
      sourceToken: { ...token, state: 'splitting', childIds },
      childTokens,
      splitAttestation,
    };
  }

  /** Evolve a token to the next generation if it has enough attestation history */
  evolve(token: SelfGoverningToken): TokenEvolutionResult {
    const canEvolve =
      token.attestationChain.length >= this.config.evolutionThreshold &&
      token.generation < this.config.maxGeneration;

    const previousGeneration = token.generation;
    const newGeneration = canEvolve ? token.generation + 1 : token.generation;

    const evolutionAttestation = fibonacciHash(
      (token.fibonacciId ^ hashStr(`evolve_${newGeneration}`)) >>> 0,
      2_147_483_647,
    );

    const evolved: SelfGoverningToken = {
      ...token,
      state: canEvolve ? 'active' : token.state,
      generation: newGeneration,
      evolutionCount: canEvolve ? token.evolutionCount + 1 : token.evolutionCount,
      health: canEvolve ? PHI_INV : token.health,
      attestationChain: [...token.attestationChain, evolutionAttestation],
      timestamp: Date.now(),
    };

    return {
      token: evolved,
      previousGeneration,
      newGeneration,
      evolutionAttestation,
    };
  }

  /** Add a new attestation link to the token's chain */
  attest(token: SelfGoverningToken): SelfGoverningToken {
    const link = fibonacciHash(
      (token.fibonacciId ^ hashStr(`attest_${token.attestationChain.length}`)) >>> 0,
      2_147_483_647,
    );

    return {
      ...token,
      state: 'active',
      attestationChain: [...token.attestationChain, link],
      health: Math.min(token.health + PHI_INV * 0.1, 1.0),
      timestamp: Date.now(),
    };
  }

  /** Return status summary */
  status(): {
    technologyId: 'TT-012';
    name: string;
    totalTokensCreated: number;
    config: SovereignTokenTechConfig;
    phi: number;
    goldenAngle: number;
  } {
    return {
      technologyId: 'TT-012',
      name: 'SOVEREIGN — Self-Governing Token Technology',
      totalTokensCreated: this.nextId,
      config: this.config,
      phi: PHI,
      goldenAngle: GOLDEN_ANGLE,
    };
  }

  /** Factory */
  static create(config?: Partial<SovereignTokenTechConfig>): SovereignTokenTech {
    return new SovereignTokenTech(config);
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY EXPORT
// ══════════════════════════════════════════════════════════════════

export function createSovereignTokenTech(config?: Partial<SovereignTokenTechConfig>): SovereignTokenTech {
  return SovereignTokenTech.create(config);
}
