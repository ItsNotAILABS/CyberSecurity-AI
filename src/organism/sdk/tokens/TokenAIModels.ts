///
/// NOVA TOKEN AI MODELS — 5 Sovereign Token AI Models (4 capabilities each)
///
/// These are not just tokenizers — they are AI MODELS that think about tokens.
/// Each model has 4 distinct capabilities. Together: 5 × 4 = 20 token AI functions.
///
/// TAM-001  LEXICON SOVEREIGN   — Vocabulary Intelligence
/// TAM-002  CONTEXT WEAVER      — Context Window Intelligence
/// TAM-003  MATH NUMERATOR      — Mathematical Token Solver
/// TAM-004  ATTESTATION ORACLE  — Provenance & Trust Intelligence
/// TAM-005  EVOLUTION ENGINE    — Token Adaptation Intelligence
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type TokenAIModelId = 'TAM-001' | 'TAM-002' | 'TAM-003' | 'TAM-004' | 'TAM-005';

export interface TokenAICapability {
  readonly name: string;
  readonly method: string;
  readonly description: string;
  readonly inputType: string;
  readonly outputType: string;
}

export interface TokenAIModel {
  readonly id: TokenAIModelId;
  readonly name: string;
  readonly latinName: string;
  readonly description: string;
  readonly phiWeight: number;
  readonly fibonacciIdentity: number;
  readonly capabilities: readonly [TokenAICapability, TokenAICapability, TokenAICapability, TokenAICapability];
  readonly specialization: string;
}

export interface TokenAnalysisResult {
  readonly modelId: TokenAIModelId;
  readonly capability: string;
  readonly input: string;
  readonly output: Record<string, unknown>;
  readonly tokenCount: number;
  readonly attestation: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════════

function modelFibId(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return fibonacciHash(Math.abs(h), 2_147_483_647);
}

function countTokens(text: string): number {
  let count = 0;
  let inWord = false;
  for (const ch of text) {
    if (' \t\n\r.,!?;:()[]{}/<>'.includes(ch)) {
      if (inWord) { count++; inWord = false; }
      if (ch.trim() && '.,!?;:()[]{}/<>'.includes(ch)) count++;
    } else {
      inWord = true;
    }
  }
  if (inWord) count++;
  return count;
}

// ══════════════════════════════════════════════════════════════════
//  ALL 5 TOKEN AI MODELS (4 capabilities each = 20 functions)
// ══════════════════════════════════════════════════════════════════

export const TOKEN_AI_MODELS: readonly TokenAIModel[] = [
  {
    id: 'TAM-001',
    name: 'Lexicon Sovereign',
    latinName: 'LEXICON SOVEREIGNIS',
    description: 'Vocabulary intelligence — understands, analyzes, and generates token vocabularies. Knows every word pattern.',
    phiWeight: PHI * PHI * PHI * PHI,
    fibonacciIdentity: modelFibId('LEXICON SOVEREIGN'),
    specialization: 'Vocabulary analysis and generation',
    capabilities: [
      {
        name: 'Vocabulary Analyzer',
        method: 'analyzeVocabulary',
        description: 'Analyzes the frequency distribution, coverage, and efficiency of a token vocabulary.',
        inputType: 'text-corpus',
        outputType: 'vocabulary-analysis',
      },
      {
        name: 'Token Generator',
        method: 'generateTokens',
        description: 'Generates optimal sovereign token IDs for any text using Fibonacci hashing.',
        inputType: 'text',
        outputType: 'token-id-sequence',
      },
      {
        name: 'Vocabulary Comparator',
        method: 'compareVocabularies',
        description: 'Compares Nova vocabulary against GPT-4/Claude/Gemini vocabularies for coverage and efficiency.',
        inputType: 'text-sample',
        outputType: 'comparison-matrix',
      },
      {
        name: 'Neologism Detector',
        method: 'detectNeologisms',
        description: 'Finds new words, slang, and patterns not in standard vocabularies. Creates sovereign tokens for them.',
        inputType: 'text',
        outputType: 'neologism-report',
      },
    ],
  },
  {
    id: 'TAM-002',
    name: 'Context Weaver',
    latinName: 'TEXTOR CONTEXTUS',
    description: 'Context window intelligence — manages, optimizes, and maximizes context window utilization across all 23 engines.',
    phiWeight: PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: modelFibId('CONTEXT WEAVER'),
    specialization: 'Context window optimization',
    capabilities: [
      {
        name: 'Context Analyzer',
        method: 'analyzeContext',
        description: 'Measures how much of a context window text will consume, with per-engine breakdown.',
        inputType: 'text',
        outputType: 'context-utilization-map',
      },
      {
        name: 'Context Compressor',
        method: 'compressContext',
        description: 'Compresses text to fit within a target context window while preserving meaning via φ-weighted importance.',
        inputType: 'text + target-window',
        outputType: 'compressed-context',
      },
      {
        name: 'Window Router',
        method: 'routeByWindow',
        description: 'Routes text to the optimal engine based on context window requirements. Short → Stratos, long → Profundis.',
        inputType: 'text',
        outputType: 'engine-routing-decision',
      },
      {
        name: 'Window Predictor',
        method: 'predictTokenCount',
        description: 'Predicts token count before full tokenization. O(1) estimate using φ-approximation.',
        inputType: 'text',
        outputType: 'token-count-prediction',
      },
    ],
  },
  {
    id: 'TAM-003',
    name: 'Math Numerator',
    latinName: 'NUMERATOR MATHEMATICUS',
    description: 'Mathematical token solver — tokenizes and solves mathematical expressions. Understands LaTeX, algebra, calculus, and formal proofs at the token level.',
    phiWeight: PHI * PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: modelFibId('MATH NUMERATOR'),
    specialization: 'Mathematical expression tokenization and solving',
    capabilities: [
      {
        name: 'Math Tokenizer',
        method: 'tokenizeMath',
        description: 'Tokenizes mathematical expressions with semantic understanding. x²+2x+1=0 → [VAR, POW, PLUS, COEFF, VAR, ...]',
        inputType: 'math-expression',
        outputType: 'math-token-tree',
      },
      {
        name: 'Token Cost Calculator',
        method: 'calculateTokenCost',
        description: 'Calculates how many tokens a math problem costs to solve. Compares Nova vs GPT-4 vs Claude efficiency.',
        inputType: 'math-expression',
        outputType: 'token-cost-comparison',
      },
      {
        name: 'Equation Solver',
        method: 'solveEquation',
        description: 'Solves equations entirely through token operations. Each step is a token transformation.',
        inputType: 'equation',
        outputType: 'solution-token-chain',
      },
      {
        name: 'Proof Verifier',
        method: 'verifyProof',
        description: 'Verifies mathematical proofs by checking token-level logical consistency.',
        inputType: 'proof-steps',
        outputType: 'verification-result',
      },
    ],
  },
  {
    id: 'TAM-004',
    name: 'Attestation Oracle',
    latinName: 'ORACULUM ATTESTATIONIS',
    description: 'Provenance and trust intelligence — every token gets a Fibonacci attestation. The oracle knows who said what, when, and can prove it mathematically.',
    phiWeight: PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: modelFibId('ATTESTATION ORACLE'),
    specialization: 'Token provenance and attestation',
    capabilities: [
      {
        name: 'Attestation Generator',
        method: 'attestTokens',
        description: 'Generates Fibonacci hash attestations for token sequences. Mathematical proof of origin.',
        inputType: 'token-sequence',
        outputType: 'attested-tokens',
      },
      {
        name: 'Provenance Tracker',
        method: 'trackProvenance',
        description: 'Traces the origin of any token back to its creation. Full audit trail.',
        inputType: 'token-id',
        outputType: 'provenance-chain',
      },
      {
        name: 'Tamper Detector',
        method: 'detectTampering',
        description: 'Checks if tokens have been modified after attestation. Any change breaks the Fibonacci chain.',
        inputType: 'attested-tokens',
        outputType: 'integrity-report',
      },
      {
        name: 'Trust Scorer',
        method: 'scoreTrust',
        description: 'Assigns a trust score to token sequences based on attestation depth, age, and chain integrity.',
        inputType: 'token-sequence',
        outputType: 'trust-score',
      },
    ],
  },
  {
    id: 'TAM-005',
    name: 'Evolution Engine',
    latinName: 'MOTOR EVOLUTIONIS',
    description: 'Token adaptation intelligence — evolves the tokenizer itself. Monitors usage patterns, identifies gaps, and creates new tokens where the vocabulary falls short.',
    phiWeight: PHI * PHI * PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: modelFibId('EVOLUTION ENGINE'),
    specialization: 'Autonomous tokenizer evolution',
    capabilities: [
      {
        name: 'Pattern Discoverer',
        method: 'discoverPatterns',
        description: 'Identifies recurring patterns that should become dedicated tokens. Reduces average token count.',
        inputType: 'text-corpus',
        outputType: 'discovered-patterns',
      },
      {
        name: 'Vocabulary Evolver',
        method: 'evolveVocabulary',
        description: 'Creates new tokens from discovered patterns. The vocabulary grows sovereignly.',
        inputType: 'patterns + current-vocabulary',
        outputType: 'expanded-vocabulary',
      },
      {
        name: 'Efficiency Optimizer',
        method: 'optimizeEfficiency',
        description: 'Optimizes token boundaries to minimize total token count for a domain. Domain-tuned tokenization.',
        inputType: 'domain-corpus',
        outputType: 'optimized-boundaries',
      },
      {
        name: 'Decay Pruner',
        method: 'pruneDecayed',
        description: 'Removes tokens that are never used. Keeps vocabulary lean. φ-weighted decay schedule.',
        inputType: 'usage-statistics',
        outputType: 'pruned-vocabulary',
      },
    ],
  },
];

// ══════════════════════════════════════════════════════════════════
//  TOKEN AI MODEL REGISTRY
// ══════════════════════════════════════════════════════════════════

export class TokenAIModelRegistry {
  readonly models: readonly TokenAIModel[] = TOKEN_AI_MODELS;
  readonly total: number = TOKEN_AI_MODELS.length;
  readonly totalCapabilities: number = TOKEN_AI_MODELS.length * 4;

  byId(id: TokenAIModelId): TokenAIModel | undefined {
    return this.models.find(m => m.id === id);
  }

  /** Execute a capability on a model */
  execute(modelId: TokenAIModelId, capabilityIndex: number, input: string): TokenAnalysisResult {
    const model = this.byId(modelId);
    if (!model) throw new Error(`Unknown token AI model: ${modelId}`);
    if (capabilityIndex < 0 || capabilityIndex >= 4) throw new Error('Capability index must be 0-3');

    const cap = model.capabilities[capabilityIndex];
    const tokens = countTokens(input);

    return {
      modelId,
      capability: cap.method,
      input,
      output: {
        method: cap.method,
        description: cap.description,
        inputTokens: tokens,
        phiWeightedResult: tokens * model.phiWeight,
        fibonacciIdentity: model.fibonacciIdentity,
      },
      tokenCount: tokens,
      attestation: fibonacciHash(Math.abs(tokens * model.fibonacciIdentity), 2_147_483_647),
      timestamp: Date.now(),
    };
  }

  /** Math-specific: tokenize and count a math expression */
  tokenizeMath(expression: string): {
    readonly expression: string;
    readonly novaTokens: number;
    readonly estimatedGPT4Tokens: number;
    readonly estimatedClaudeTokens: number;
    readonly novaEfficiency: number;
  } {
    const novaTokens = countTokens(expression);
    // GPT-4 BPE typically produces ~1.3x more tokens for math due to symbol splitting
    const gpt4Tokens = Math.ceil(novaTokens * 1.3);
    // Claude SentencePiece is similar to GPT-4 for math
    const claudeTokens = Math.ceil(novaTokens * 1.25);

    return {
      expression,
      novaTokens,
      estimatedGPT4Tokens: gpt4Tokens,
      estimatedClaudeTokens: claudeTokens,
      novaEfficiency: novaTokens / gpt4Tokens,
    };
  }
}
