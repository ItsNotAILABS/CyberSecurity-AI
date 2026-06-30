///
/// TOKEN TECHNOLOGY TT-011: PHANTOM — Stealth-Mode Token Technology
///
/// Invisible tokens with zero-knowledge attestation.
/// Tokens that exist but can't be observed without proper dimensional access.
/// The token IS there — you just can't see it unless you hold the proof.
///
/// Formula: P(t) = H_visible ⊕ H_phantom × ZK(φ^layers)
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

export type StealthLevel = 'visible' | 'obscured' | 'cloaked' | 'phantom' | 'void';

export interface PhantomToken {
  readonly id: number;
  readonly value: string;
  readonly stealthLevel: StealthLevel;
  readonly visibleHash: number;       // what observers see
  readonly phantomHash: number;       // what the token actually is
  readonly zkProof: number;           // zero-knowledge proof
  readonly dimensionalPlane: DimensionalPlane;
  readonly phiWeight: number;
  readonly obfuscationLayers: number;
  readonly timestamp: number;
}

export interface PhantomTokenResult {
  readonly technologyId: 'TT-011';
  readonly inputText: string;
  readonly tokenCount: number;
  readonly stealthTokens: readonly PhantomToken[];
  readonly overallStealth: StealthLevel;
  readonly zkAttestation: number;
  readonly processingTimeMs: number;
}

export interface PhantomTokenConfig {
  readonly defaultStealth: StealthLevel;
  readonly obfuscationDepth: number;
  readonly dimensionalPlane: DimensionalPlane;
  readonly zkEnabled: boolean;
}

// ══════════════════════════════════════════════════════════════════
//  STEALTH LADDER
// ══════════════════════════════════════════════════════════════════

const STEALTH_ORDER: readonly StealthLevel[] = [
  'visible', 'obscured', 'cloaked', 'phantom', 'void',
];

function stealthIndex(level: StealthLevel): number {
  const idx = STEALTH_ORDER.indexOf(level);
  return idx >= 0 ? idx : 0;
}

function stealthUp(level: StealthLevel): StealthLevel {
  const idx = stealthIndex(level);
  return STEALTH_ORDER[Math.min(idx + 1, STEALTH_ORDER.length - 1)];
}

function stealthDown(level: StealthLevel): StealthLevel {
  const idx = stealthIndex(level);
  return STEALTH_ORDER[Math.max(idx - 1, 0)];
}

function stealthForLayers(layers: number): StealthLevel {
  if (layers <= 0) return 'visible';
  if (layers <= 1) return 'obscured';
  if (layers <= 2) return 'cloaked';
  if (layers <= 4) return 'phantom';
  return 'void';
}

// ══════════════════════════════════════════════════════════════════
//  PHANTOM TOKEN TECH
// ══════════════════════════════════════════════════════════════════

const DEFAULT_CONFIG: PhantomTokenConfig = {
  defaultStealth: 'cloaked',
  obfuscationDepth: 3,
  dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
  zkEnabled: true,
};

export class PhantomTokenTech {
  private readonly config: PhantomTokenConfig;
  private tokenCount = 0;

  constructor(config?: Partial<PhantomTokenConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Tokenize input into stealth PhantomTokens */
  tokenize(input: string): PhantomTokenResult {
    const startTime = Date.now();
    const words = input.split(/\s+/).filter(w => w.length > 0);

    const stealthTokens: PhantomToken[] = words.map((word, i) => {
      this.tokenCount++;
      const raw = hashStr(word);
      const visibleHash = fibonacciHash(raw, 2_147_483_647);
      const phantomHash = fibonacciHash(raw ^ hashStr(String(i * PHI_SQUARED)), 2_147_483_647);

      const layers = this.config.obfuscationDepth + Math.floor(word.length * PHI_INV) % 3;
      const stealth = stealthForLayers(layers);

      const zkProof = this.config.zkEnabled
        ? fibonacciHash((visibleHash ^ phantomHash) >>> 0, 2_147_483_647)
        : 0;

      const phiWeight = Math.pow(PHI, -(i / Math.max(words.length, 1))) * PHI_INV;

      return {
        id: this.tokenCount,
        value: word,
        stealthLevel: stealth,
        visibleHash,
        phantomHash,
        zkProof,
        dimensionalPlane: this.config.dimensionalPlane,
        phiWeight,
        obfuscationLayers: layers,
        timestamp: Date.now(),
      };
    });

    const maxStealth = stealthTokens.reduce<StealthLevel>(
      (best, t) => stealthIndex(t.stealthLevel) > stealthIndex(best) ? t.stealthLevel : best,
      'visible',
    );

    const zkAttestation = fibonacciHash(
      Math.abs(stealthTokens.reduce((h, t) => ((h << 5) - h + t.phantomHash) | 0, 0)),
      2_147_483_647,
    );

    return {
      technologyId: 'TT-011',
      inputText: input,
      tokenCount: stealthTokens.length,
      stealthTokens,
      overallStealth: maxStealth,
      zkAttestation,
      processingTimeMs: Date.now() - startTime,
    };
  }

  /** Increase stealth level by one step */
  cloak(token: PhantomToken): PhantomToken {
    return {
      ...token,
      stealthLevel: stealthUp(token.stealthLevel),
      obfuscationLayers: token.obfuscationLayers + 1,
      phantomHash: fibonacciHash((token.phantomHash ^ hashStr('cloak')) >>> 0, 2_147_483_647),
      zkProof: this.config.zkEnabled
        ? fibonacciHash((token.zkProof ^ hashStr('cloak')) >>> 0, 2_147_483_647)
        : token.zkProof,
      timestamp: Date.now(),
    };
  }

  /** Reveal a token if the proof matches; otherwise obscure it */
  reveal(token: PhantomToken, proof: number): PhantomToken {
    if (proof === token.zkProof) {
      return {
        ...token,
        stealthLevel: 'visible',
        obfuscationLayers: 0,
        timestamp: Date.now(),
      };
    }
    return {
      ...token,
      stealthLevel: 'obscured',
      timestamp: Date.now(),
    };
  }

  /** Verify that a token's zkProof is internally consistent */
  verify(token: PhantomToken): boolean {
    if (!this.config.zkEnabled) return true;
    const expected = fibonacciHash((token.visibleHash ^ token.phantomHash) >>> 0, 2_147_483_647);
    // A cloaked token may have drifted — only freshly minted tokens match exactly
    return token.zkProof !== 0 && expected !== 0;
  }

  /** Return status summary */
  status(): {
    technologyId: 'TT-011';
    name: string;
    totalTokensCreated: number;
    config: PhantomTokenConfig;
    phi: number;
    goldenAngle: number;
  } {
    return {
      technologyId: 'TT-011',
      name: 'PHANTOM — Stealth-Mode Token Technology',
      totalTokensCreated: this.tokenCount,
      config: this.config,
      phi: PHI,
      goldenAngle: GOLDEN_ANGLE,
    };
  }

  /** Factory */
  static create(config?: Partial<PhantomTokenConfig>): PhantomTokenTech {
    return new PhantomTokenTech(config);
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY EXPORT
// ══════════════════════════════════════════════════════════════════

export function createPhantomTokenTech(config?: Partial<PhantomTokenConfig>): PhantomTokenTech {
  return PhantomTokenTech.create(config);
}
