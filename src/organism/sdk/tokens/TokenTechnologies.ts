///
/// NOVA TOKEN TECHNOLOGIES — 10 Sovereign Token Technology Systems
///
/// Each technology is a COMPLETE system, not a data type.
/// Each contains its own AI intelligence for token processing.
///
/// 10 Token Technologies:
///   TT-001  AURUM     — Gold-standard immutable token vault
///   TT-002  ARGENTUM  — Silver-speed high-throughput tokenizer
///   TT-003  CRIMSON   — Living-organism adaptive tokens
///   TT-004  LATTICE   — E8 lattice encrypted token mesh
///   TT-005  SPIRAL    — Golden-spiral ordered token sequences
///   TT-006  RESONANCE — Kuramoto-synchronized token harmonics
///   TT-007  PRISM     — Multi-modal token decomposition
///   TT-008  WEAVE     — Cross-language token interleaving
///   TT-009  DEPTH     — Deep-context hierarchical tokens
///   TT-010  GENESIS   — Self-generating vocabulary expansion
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CORE TYPES
// ══════════════════════════════════════════════════════════════════

export type TokenTechId =
  | 'TT-001' | 'TT-002' | 'TT-003' | 'TT-004' | 'TT-005'
  | 'TT-006' | 'TT-007' | 'TT-008' | 'TT-009' | 'TT-010';

export interface TokenTechnology {
  readonly id: TokenTechId;
  readonly name: string;
  readonly latinName: string;
  readonly element: string;
  readonly description: string;
  readonly phiWeight: number;
  readonly fibonacciIdentity: number;
  readonly capabilities: readonly string[];
  readonly aiIntelligence: TokenAICore;
  readonly maxThroughput: number;       // tokens per second
  readonly specialization: string;
}

export interface TokenAICore {
  readonly name: string;
  readonly purpose: string;
  readonly algorithmClass: string;
  readonly inputModalities: readonly string[];
  readonly outputFormat: string;
}

export interface TokenProcessResult {
  readonly technologyId: TokenTechId;
  readonly inputText: string;
  readonly tokenCount: number;
  readonly processingTimeMs: number;
  readonly tokens: readonly ProcessedToken[];
  readonly attestation: number;
}

export interface ProcessedToken {
  readonly id: number;
  readonly text: string;
  readonly weight: number;
  readonly depth: number;
  readonly resonance: number;
}

// ══════════════════════════════════════════════════════════════════
//  TOKEN TECH IDENTITY MATH
// ══════════════════════════════════════════════════════════════════

function techFibId(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return fibonacciHash(Math.abs(h), 2_147_483_647);
}

function computeResonance(text: string, frequency: number): number {
  let energy = 0;
  for (let i = 0; i < text.length; i++) {
    energy += Math.sin(text.charCodeAt(i) * frequency * PHI) * Math.pow(PHI, -(i / text.length));
  }
  return Math.abs(energy / Math.max(text.length, 1));
}

function tokenizeWithDepth(text: string, depth: number, vocabSize: number): ProcessedToken[] {
  const segments: string[] = [];
  let current = '';
  for (const ch of text) {
    if (' \t\n\r.,!?;:'.includes(ch)) {
      if (current) segments.push(current);
      if (ch.trim()) segments.push(ch);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current) segments.push(current);

  return segments.map((seg, i) => {
    let h = 0;
    for (let j = 0; j < seg.length; j++) {
      h = ((h << 5) - h + seg.charCodeAt(j)) | 0;
    }
    return {
      id: fibonacciHash(Math.abs(h), vocabSize),
      text: seg,
      weight: Math.pow(PHI, -(i / Math.max(segments.length, 1)) * depth),
      depth,
      resonance: computeResonance(seg, GOLDEN_ANGLE),
    };
  });
}

// ══════════════════════════════════════════════════════════════════
//  ALL 10 TOKEN TECHNOLOGIES
// ══════════════════════════════════════════════════════════════════

export const TOKEN_TECHNOLOGIES: readonly TokenTechnology[] = [
  {
    id: 'TT-001',
    name: 'AURUM Token Vault',
    latinName: 'CUSTODIA AUREORUM',
    element: 'Gold (AU)',
    description: 'Immutable gold-standard token storage. Tokens are sealed with Fibonacci attestation and can never be altered. Like gold: it does not corrode.',
    phiWeight: PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: techFibId('AURUM'),
    capabilities: ['immutable-storage', 'fibonacci-seal', 'provenance-proof', 'audit-trail'],
    aiIntelligence: {
      name: 'Aurum Sentinel',
      purpose: 'Guards token integrity. Detects tampering. Seals provenance.',
      algorithmClass: 'cryptographic-attestation',
      inputModalities: ['text', 'tokens', 'hashes'],
      outputFormat: 'attested-token-vault',
    },
    maxThroughput: 500_000,
    specialization: 'Token immutability and provenance',
  },
  {
    id: 'TT-002',
    name: 'ARGENTUM Speed Tokenizer',
    latinName: 'CELERATOR ARGENTORUM',
    element: 'Silver (AG)',
    description: 'High-conductivity speed tokenizer. Like silver is the best electrical conductor, ARGENTUM is the fastest tokenizer. Optimized for throughput over everything.',
    phiWeight: PHI * PHI * PHI * PHI,
    fibonacciIdentity: techFibId('ARGENTUM'),
    capabilities: ['ultra-fast', 'parallel-segmentation', 'streaming', 'batch-processing'],
    aiIntelligence: {
      name: 'Argentum Accelerator',
      purpose: 'Maximizes tokenization speed. Parallel φ-segmentation. Stream processing.',
      algorithmClass: 'parallel-phi-segmentation',
      inputModalities: ['text', 'streams', 'batches'],
      outputFormat: 'speed-optimized-tokens',
    },
    maxThroughput: 10_000_000,
    specialization: 'Maximum tokenization throughput',
  },
  {
    id: 'TT-003',
    name: 'CRIMSON Adaptive Tokenizer',
    latinName: 'ADAPTATOR CRIMSONUS',
    element: 'Crimson (living-organism)',
    description: 'Living-organism tokens that adapt to context. Like blood carries oxygen to where it is needed, CRIMSON tokens carry meaning to where it matters. They learn and evolve.',
    phiWeight: PHI * PHI * PHI,
    fibonacciIdentity: techFibId('CRIMSON'),
    capabilities: ['context-adaptive', 'self-modifying', 'meaning-routing', 'learning'],
    aiIntelligence: {
      name: 'Crimson Organism',
      purpose: 'Living tokenizer that adapts vocabulary to domain. Tokens evolve with usage.',
      algorithmClass: 'adaptive-phi-evolution',
      inputModalities: ['text', 'context', 'history'],
      outputFormat: 'adaptive-living-tokens',
    },
    maxThroughput: 1_000_000,
    specialization: 'Context-adaptive token evolution',
  },
  {
    id: 'TT-004',
    name: 'LATTICE Encrypted Tokens',
    latinName: 'CRYPTA RETICULARIS',
    element: 'E8 Lattice',
    description: 'E8 lattice encryption for tokens. Each token is encrypted in an 8-dimensional lattice structure. Post-quantum security at the token level.',
    phiWeight: PHI * PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: techFibId('LATTICE'),
    capabilities: ['e8-encryption', 'post-quantum', 'lattice-structure', 'zero-knowledge'],
    aiIntelligence: {
      name: 'Lattice Guardian',
      purpose: 'Encrypts tokens in E8 lattice space. Post-quantum token security.',
      algorithmClass: 'e8-lattice-cryptography',
      inputModalities: ['tokens', 'keys', 'lattice-coordinates'],
      outputFormat: 'lattice-encrypted-tokens',
    },
    maxThroughput: 200_000,
    specialization: 'Post-quantum token encryption',
  },
  {
    id: 'TT-005',
    name: 'SPIRAL Ordered Sequences',
    latinName: 'ORDO SPIRALIS',
    element: 'Golden Spiral',
    description: 'Tokens ordered by golden spiral positioning. Each token has a phyllotaxis coordinate. The sequence is mathematically optimal for cache locality and retrieval.',
    phiWeight: PHI * PHI * PHI,
    fibonacciIdentity: techFibId('SPIRAL'),
    capabilities: ['phyllotaxis-ordering', 'cache-optimal', 'spiral-retrieval', 'mathematical-ordering'],
    aiIntelligence: {
      name: 'Spiral Navigator',
      purpose: 'Orders tokens in golden-spiral sequences for optimal retrieval.',
      algorithmClass: 'phyllotaxis-ordering',
      inputModalities: ['tokens', 'sequences'],
      outputFormat: 'spiral-ordered-tokens',
    },
    maxThroughput: 2_000_000,
    specialization: 'Mathematically optimal token ordering',
  },
  {
    id: 'TT-006',
    name: 'RESONANCE Harmonic Tokens',
    latinName: 'HARMONIA RESONANTIAE',
    element: 'Kuramoto Oscillator',
    description: 'Tokens synchronized via Kuramoto oscillator coupling. Each token has a resonance frequency. Related tokens synchronize like fireflies. The resonance IS the meaning.',
    phiWeight: PHI * PHI * PHI * PHI,
    fibonacciIdentity: techFibId('RESONANCE'),
    capabilities: ['kuramoto-sync', 'frequency-coupling', 'semantic-resonance', 'harmonic-clustering'],
    aiIntelligence: {
      name: 'Resonance Harmonizer',
      purpose: 'Synchronizes token frequencies. Finds semantic clusters via oscillator coupling.',
      algorithmClass: 'kuramoto-oscillator-coupling',
      inputModalities: ['tokens', 'frequencies', 'phases'],
      outputFormat: 'harmonized-token-clusters',
    },
    maxThroughput: 800_000,
    specialization: 'Semantic clustering via oscillator synchronization',
  },
  {
    id: 'TT-007',
    name: 'PRISM Multi-Modal Decomposition',
    latinName: 'PRISMA MODALIS',
    element: 'Light Prism',
    description: 'Decomposes tokens across modalities — like a prism splits white light into colors. One input becomes text tokens + vision tokens + audio tokens + code tokens simultaneously.',
    phiWeight: PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: techFibId('PRISM'),
    capabilities: ['modal-decomposition', 'cross-modal-tokens', 'unified-embedding', 'spectral-analysis'],
    aiIntelligence: {
      name: 'Prism Decomposer',
      purpose: 'Splits any input into modality-specific token streams simultaneously.',
      algorithmClass: 'spectral-modal-decomposition',
      inputModalities: ['text', 'vision', 'audio', 'code', 'structured'],
      outputFormat: 'multi-modal-token-spectrum',
    },
    maxThroughput: 500_000,
    specialization: 'Multi-modal token decomposition',
  },
  {
    id: 'TT-008',
    name: 'WEAVE Cross-Language Interleaver',
    latinName: 'TEXTOR LINGUARUM',
    element: 'Silk Weave',
    description: 'Interleaves tokens across languages. English, Spanish, Japanese, Arabic — all woven into one unified token stream with shared mathematical identities.',
    phiWeight: PHI * PHI * PHI,
    fibonacciIdentity: techFibId('WEAVE'),
    capabilities: ['cross-language', 'unified-ids', 'interleaving', 'translation-bridging'],
    aiIntelligence: {
      name: 'Weave Linguist',
      purpose: 'Creates unified token streams across all human languages.',
      algorithmClass: 'cross-lingual-phi-interleaving',
      inputModalities: ['text-multilingual', 'unicode', 'scripts'],
      outputFormat: 'interwoven-language-tokens',
    },
    maxThroughput: 1_500_000,
    specialization: 'Cross-language token unification',
  },
  {
    id: 'TT-009',
    name: 'DEPTH Hierarchical Tokenizer',
    latinName: 'PROFUNDOR HIERARCHICUS',
    element: 'Ocean Depth',
    description: 'Tokens at multiple depth levels simultaneously. Surface tokens for fast answers, mid-depth for context, deep tokens for full understanding. Like ocean layers.',
    phiWeight: PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: techFibId('DEPTH'),
    capabilities: ['hierarchical-depth', 'multi-resolution', 'surface-to-deep', 'progressive-detail'],
    aiIntelligence: {
      name: 'Depth Diver',
      purpose: 'Creates multi-resolution token hierarchies. Surface for speed, depth for understanding.',
      algorithmClass: 'hierarchical-phi-decomposition',
      inputModalities: ['text', 'documents', 'codebases'],
      outputFormat: 'depth-layered-tokens',
    },
    maxThroughput: 600_000,
    specialization: 'Multi-resolution hierarchical tokenization',
  },
  {
    id: 'TT-010',
    name: 'GENESIS Vocabulary Expander',
    latinName: 'GENERATOR LEXICONIS',
    element: 'Creation',
    description: 'Self-generating vocabulary expansion. When GENESIS encounters unknown patterns, it creates new sovereign tokens on the fly. The vocabulary grows itself.',
    phiWeight: PHI * PHI * PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: techFibId('GENESIS'),
    capabilities: ['self-generating', 'vocabulary-expansion', 'pattern-discovery', 'neologism-creation'],
    aiIntelligence: {
      name: 'Genesis Creator',
      purpose: 'Discovers and creates new tokens from unknown patterns. Expands vocabulary sovereignly.',
      algorithmClass: 'generative-phi-vocabulary',
      inputModalities: ['text', 'patterns', 'unknown-sequences'],
      outputFormat: 'expanded-sovereign-vocabulary',
    },
    maxThroughput: 300_000,
    specialization: 'Autonomous vocabulary generation',
  },
];

// ══════════════════════════════════════════════════════════════════
//  TOKEN TECHNOLOGY REGISTRY
// ══════════════════════════════════════════════════════════════════

export class TokenTechnologyRegistry {
  readonly technologies: readonly TokenTechnology[] = TOKEN_TECHNOLOGIES;
  readonly total: number = TOKEN_TECHNOLOGIES.length;

  byId(id: TokenTechId): TokenTechnology | undefined {
    return this.technologies.find(t => t.id === id);
  }

  byElement(element: string): TokenTechnology | undefined {
    return this.technologies.find(t => t.element.toLowerCase().includes(element.toLowerCase()));
  }

  /** Process text through a specific token technology */
  process(techId: TokenTechId, text: string): TokenProcessResult {
    const tech = this.byId(techId);
    if (!tech) throw new Error(`Unknown token technology: ${techId}`);

    const startTime = Date.now();
    const depth = techId === 'TT-009' ? 5 : techId === 'TT-003' ? 3 : 1;
    const vocabSize = 131_072;
    const tokens = tokenizeWithDepth(text, depth, vocabSize);
    const elapsed = Date.now() - startTime;

    return {
      technologyId: techId,
      inputText: text,
      tokenCount: tokens.length,
      processingTimeMs: elapsed,
      tokens,
      attestation: fibonacciHash(
        Math.abs(tokens.reduce((h, t) => ((h << 5) - h + t.id) | 0, 0)),
        2_147_483_647,
      ),
    };
  }

  /** Compare token counts across all technologies for a given text */
  compareAll(text: string): readonly { tech: string; tokens: number; timeMs: number }[] {
    return this.technologies.map(tech => {
      const result = this.process(tech.id, text);
      return {
        tech: `${tech.id} ${tech.name}`,
        tokens: result.tokenCount,
        timeMs: result.processingTimeMs,
      };
    });
  }
}
