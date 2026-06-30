///
/// TOKEN EXTENSIONS & TOKEN SDKs — Token Extension AIs
///
/// These are plug-in extensions for the token system.
/// Each extension is ALSO an AI — it doesn't just process tokens,
/// it thinks about tokens and makes intelligent decisions.
///
/// 5 Token Extensions:
///   TEX-001  Token Lens      — Visual token inspection AI
///   TEX-002  Token Bridge    — Cross-system token translation AI
///   TEX-003  Token Metrics   — Performance measurement AI
///   TEX-004  Token Forge     — Custom vocabulary creation AI
///   TEX-005  Token Shield    — Security & sanitization AI
///
/// 3 Token SDKs:
///   TSDK-001  Nova Token SDK      — Full tokenizer in a package
///   TSDK-002  Token Math SDK      — Math-specific tokenization
///   TSDK-003  Token Stream SDK    — Streaming token processing
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash } from '../../../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type TokenExtensionId = 'TEX-001' | 'TEX-002' | 'TEX-003' | 'TEX-004' | 'TEX-005';
export type TokenSDKId = 'TSDK-001' | 'TSDK-002' | 'TSDK-003';

export interface TokenExtension {
  readonly id: TokenExtensionId;
  readonly name: string;
  readonly latinName: string;
  readonly description: string;
  readonly phiWeight: number;
  readonly fibonacciIdentity: number;
  readonly aiPurpose: string;
  readonly methods: readonly string[];
}

export interface TokenSDKDefinition {
  readonly id: TokenSDKId;
  readonly name: string;
  readonly packageName: string;
  readonly description: string;
  readonly phiWeight: number;
  readonly fibonacciIdentity: number;
  readonly exports: readonly string[];
  readonly usageExample: string;
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════════

function extFibId(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return fibonacciHash(Math.abs(h), 2_147_483_647);
}

// ══════════════════════════════════════════════════════════════════
//  5 TOKEN EXTENSIONS (Each is an AI)
// ══════════════════════════════════════════════════════════════════

export const TOKEN_EXTENSIONS: readonly TokenExtension[] = [
  {
    id: 'TEX-001',
    name: 'Token Lens',
    latinName: 'LENS TOKENORUM',
    description: 'Visual token inspection AI. Renders token sequences as visual maps. Shows token boundaries, weights, resonances, and relationships in real-time.',
    phiWeight: PHI * PHI * PHI,
    fibonacciIdentity: extFibId('TOKEN LENS'),
    aiPurpose: 'Visualizes token internals — lets you SEE how your text becomes tokens',
    methods: ['inspect', 'visualize', 'highlight', 'compare'],
  },
  {
    id: 'TEX-002',
    name: 'Token Bridge',
    latinName: 'PONS TOKENORUM',
    description: 'Cross-system token translation AI. Translates between Nova tokens, BPE tokens (GPT-4), SentencePiece tokens (Claude), and any other tokenizer format.',
    phiWeight: PHI * PHI * PHI * PHI,
    fibonacciIdentity: extFibId('TOKEN BRIDGE'),
    aiPurpose: 'Bridges between tokenizer systems — import/export to any AI',
    methods: ['translateToNova', 'translateToBPE', 'translateToSentencePiece', 'universalBridge'],
  },
  {
    id: 'TEX-003',
    name: 'Token Metrics',
    latinName: 'METRICUS TOKENORUM',
    description: 'Performance measurement AI. Measures tokenization speed, compression ratio, vocabulary coverage, and context window efficiency across all token technologies.',
    phiWeight: PHI * PHI * PHI,
    fibonacciIdentity: extFibId('TOKEN METRICS'),
    aiPurpose: 'Benchmarks and measures token system performance',
    methods: ['benchmark', 'measureCompression', 'measureCoverage', 'comparePerformance'],
  },
  {
    id: 'TEX-004',
    name: 'Token Forge',
    latinName: 'FABRICA TOKENORUM',
    description: 'Custom vocabulary creation AI. Creates domain-specific token vocabularies — medical tokens, legal tokens, code tokens, math tokens. Each forged vocabulary is sovereign.',
    phiWeight: PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: extFibId('TOKEN FORGE'),
    aiPurpose: 'Forges custom token vocabularies for specific domains',
    methods: ['forgeMedical', 'forgeLegal', 'forgeCode', 'forgeCustomDomain'],
  },
  {
    id: 'TEX-005',
    name: 'Token Shield',
    latinName: 'SCUTUM TOKENORUM',
    description: 'Security and sanitization AI. Detects prompt injection at the token level. Sanitizes inputs. Prevents adversarial token attacks. The firewall for your tokenizer.',
    phiWeight: PHI * PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: extFibId('TOKEN SHIELD'),
    aiPurpose: 'Security — prevents token-level attacks and injection',
    methods: ['detectInjection', 'sanitize', 'blockAdversarial', 'auditTokenSecurity'],
  },
];

// ══════════════════════════════════════════════════════════════════
//  3 TOKEN SDKs (Each is a full package)
// ══════════════════════════════════════════════════════════════════

export const TOKEN_SDKS: readonly TokenSDKDefinition[] = [
  {
    id: 'TSDK-001',
    name: 'Nova Token SDK',
    packageName: 'nova-token-sdk',
    description: 'The full sovereign tokenizer as an npm package. Install it, import it, tokenize anything. Generate your own token IDs with φ-mathematics.',
    phiWeight: PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: extFibId('NOVA TOKEN SDK'),
    exports: [
      'tokenize', 'encode', 'decode', 'countTokens',
      'createTokenizer', 'NovaTokenizer',
      'NovaToken', 'NovaTokenizerResult',
      'fibonacciHash', 'phiSegment',
    ],
    usageExample: [
      "import { tokenize, encode } from 'nova-token-sdk';",
      '',
      "const result = tokenize('Hello, golden world!');",
      '// result.tokens[0].id = 48291 (YOUR Fibonacci hash)',
      '',
      "console.log(encode('Hello world'));",
      '// [48291, 107233] — YOUR numbers, YOUR math',
    ].join('\n'),
  },
  {
    id: 'TSDK-002',
    name: 'Token Math SDK',
    packageName: 'nova-token-math',
    description: 'Math-specific tokenization SDK. Understands LaTeX, algebra, calculus. Tokenizes equations semantically, not just character-by-character.',
    phiWeight: PHI * PHI * PHI * PHI * PHI * PHI,
    fibonacciIdentity: extFibId('TOKEN MATH SDK'),
    exports: [
      'tokenizeMath', 'solveEquation', 'parseLatex',
      'tokenCost', 'mathComparison',
      'MathTokenizer', 'EquationSolver',
    ],
    usageExample: [
      "import { tokenizeMath, tokenCost } from 'nova-token-math';",
      '',
      "const tokens = tokenizeMath('x² + 2x + 1 = 0');",
      '// Semantic math tokens: [VAR:x, POW:2, OP:+, COEFF:2, VAR:x, OP:+, NUM:1, EQ, NUM:0]',
      '',
      "const cost = tokenCost('∫₀¹ x² dx');",
      '// { novaTokens: 7, gpt4Tokens: 12, savings: "42%" }',
    ].join('\n'),
  },
  {
    id: 'TSDK-003',
    name: 'Token Stream SDK',
    packageName: 'nova-token-stream',
    description: 'Streaming token processing SDK. Process tokens as they arrive — no waiting for complete input. Real-time tokenization for chat, voice, and live feeds.',
    phiWeight: PHI * PHI * PHI * PHI,
    fibonacciIdentity: extFibId('TOKEN STREAM SDK'),
    exports: [
      'createTokenStream', 'TokenStream',
      'streamTokenize', 'pipeTokens',
      'TokenStreamReader', 'TokenStreamWriter',
    ],
    usageExample: [
      "import { createTokenStream } from 'nova-token-stream';",
      '',
      'const stream = createTokenStream();',
      '',
      "stream.write('Hello ');    // emits token immediately",
      "stream.write('golden ');   // emits next token",
      "stream.write('world!');    // emits final token",
      '',
      'for await (const token of stream) {',
      '  console.log(token.id, token.text);',
      '}',
    ].join('\n'),
  },
];

// ══════════════════════════════════════════════════════════════════
//  REGISTRIES
// ══════════════════════════════════════════════════════════════════

export class TokenExtensionRegistry {
  readonly extensions: readonly TokenExtension[] = TOKEN_EXTENSIONS;
  readonly sdks: readonly TokenSDKDefinition[] = TOKEN_SDKS;
  readonly totalExtensions: number = TOKEN_EXTENSIONS.length;
  readonly totalSDKs: number = TOKEN_SDKS.length;

  extensionById(id: TokenExtensionId): TokenExtension | undefined {
    return this.extensions.find(e => e.id === id);
  }

  sdkById(id: TokenSDKId): TokenSDKDefinition | undefined {
    return this.sdks.find(s => s.id === id);
  }

  /** Summary of the entire token extension ecosystem */
  summary(): string {
    const lines: string[] = [
      '═══════════════════════════════════════════════════════════════',
      '  NOVA TOKEN EXTENSION ECOSYSTEM',
      '═══════════════════════════════════════════════════════════════',
      '',
      '  TOKEN EXTENSIONS (plug-in AIs):',
    ];

    for (const ext of this.extensions) {
      lines.push(`    ${ext.id}  ${ext.name.padEnd(18)} — ${ext.aiPurpose}`);
    }

    lines.push('');
    lines.push('  TOKEN SDKs (publishable packages):');

    for (const sdk of this.sdks) {
      lines.push(`    ${sdk.id}  ${sdk.packageName.padEnd(20)} — ${sdk.description.substring(0, 60)}...`);
    }

    lines.push('');
    return lines.join('\n');
  }
}
