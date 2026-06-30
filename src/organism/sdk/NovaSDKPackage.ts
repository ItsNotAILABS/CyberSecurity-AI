///
/// NOVA SDK PACKAGE — The Publishable AI SDK Definition
///
/// This is the package manifest for nova-os-sdk.
/// It describes what the SDK IS, what it EXPORTS, and how to USE it.
///
/// This is NOT a config file — it's a code module that documents
/// the entire SDK surface as a typed data structure.
///
/// ═══════════════════════════════════════════════════════════════
///  WHAT IS THIS SDK?
/// ═══════════════════════════════════════════════════════════════
///
///  nova-os-sdk is a sovereign AI operating system in a package.
///
///  It is NOT a wrapper around OpenAI. NOT a wrapper around Google.
///  It is 100% native Nova technology:
///    - 23 sovereign AI engines with typed APIs
///    - Native φ-mathematics tokenizer (YOUR token IDs)
///    - Desktop AGI with app control
///    - Chat terminal with engine routing
///    - Fibonacci hash attestation on all outputs
///    - Zero external AI dependencies
///
///  Install it:   npm install nova-os-sdk
///  Import it:    import { boot, chat, open } from 'nova-os-sdk'
///  Use it:       const os = boot(); chat('Hello!');
///
/// ═══════════════════════════════════════════════════════════════
///  PUBLIC REPO IDEAS (from your tech)
/// ═══════════════════════════════════════════════════════════════
///
///  1. nova-os-sdk — This SDK as a standalone npm package.
///     The full AI operating system.  People install it and get
///     23 engines, a chat terminal, app control, and a tokenizer.
///
///  2. nova-tokenizer — Just the sovereign tokenizer standalone.
///     "Generate your own token IDs with φ-mathematics."
///     Small, focused, impressive demo of native tech.
///
///  3. nova-wire — The wire protocol library.
///     Fibonacci-attested request/response protocol.
///     Any AI can plug into this — it's an open standard.
///
///  4. phi-math — The golden-ratio mathematics library.
///     PHI, Fibonacci hashing, Kuramoto oscillators, E8 lattice.
///     Pure math, zero AI dependency.  Useful for everyone.
///
///  5. nova-engine-registry — The 23-engine registry as data.
///     JSON + TypeScript definitions for all engines.
///     People can build their own SDKs on top.
///
///  6. fracture-100 — The 100 technology fracture intelligences.
///     A curated knowledge base of 100 tech domains.
///     Open-source tech analysis framework.
///
///  7. nova-chat-terminal — The chat terminal as a standalone.
///     Interactive AI terminal with command routing.
///     Works with any AI backend (not just Nova).
///
/// ═══════════════════════════════════════════════════════════════

import { NOVA_ENGINES } from './NovaEngineModels.js';

// ══════════════════════════════════════════════════════════════════
//  SDK PACKAGE MANIFEST
// ══════════════════════════════════════════════════════════════════

export interface NovaSDKManifest {
  readonly name: string;
  readonly displayName: string;
  readonly version: string;
  readonly description: string;
  readonly author: string;
  readonly license: string;
  readonly homepage: string;
  readonly repository: string;
  readonly keywords: readonly string[];
  readonly engines: {
    readonly count: number;
    readonly list: readonly string[];
  };
  readonly capabilities: readonly string[];
  readonly exports: readonly SDKExport[];
  readonly publicRepoIdeas: readonly PublicRepoIdea[];
}

export interface SDKExport {
  readonly name: string;
  readonly type: 'function' | 'class' | 'constant' | 'type';
  readonly description: string;
  readonly example: string;
}

export interface PublicRepoIdea {
  readonly name: string;
  readonly repo: string;
  readonly description: string;
  readonly audience: string;
  readonly uniqueValue: string;
  readonly estimatedFiles: number;
}

// ══════════════════════════════════════════════════════════════════
//  THE MANIFEST
// ══════════════════════════════════════════════════════════════════

export const NOVA_SDK_MANIFEST: NovaSDKManifest = {
  name: 'nova-os-sdk',
  displayName: 'NOVA-OS SDK',
  version: '1.0.0',
  description: 'Sovereign AI operating system SDK — 23 native engines, φ-mathematics tokenizer, desktop AGI, chat terminal. Zero external AI dependencies. YOUR machine, YOUR intelligence.',
  author: 'Casa de Medina',
  license: 'SEE LICENSE IN LICENSE.md',
  homepage: 'https://github.com/ItsNotAILABS/NATIVE-NOVA-PROTOCOL',
  repository: 'https://github.com/ItsNotAILABS/NATIVE-NOVA-PROTOCOL',
  keywords: [
    'ai', 'sdk', 'agi', 'nova', 'sovereign', 'desktop',
    'tokenizer', 'golden-ratio', 'fibonacci', 'phi',
    'native', 'multi-modal', 'chat', 'terminal',
    'engine', 'protocol', 'wire', 'attestation',
  ],
  engines: {
    count: NOVA_ENGINES.length,
    list: NOVA_ENGINES.map(e => `${e.id} ${e.name} — ${e.description.substring(0, 60)}`),
  },
  capabilities: [
    '23 sovereign AI engines with typed APIs',
    'Native φ-mathematics tokenizer (generate your own token IDs)',
    'Desktop AGI with intent classification',
    'Cross-platform app launcher (Windows, macOS, Linux)',
    'Interactive chat terminal with command routing',
    'Multi-engine consensus (combine engines for accuracy)',
    'Fibonacci hash attestation on all outputs',
    'Golden-ratio weighted engine routing',
    'Deep engine comparison vs GPT-4, Claude, Gemini',
    'Streaming support via AsyncIterator',
    'Function/tool calling support',
    'Vision, audio, video, code, math modalities',
    'Sovereign-only mode (force on-device execution)',
    'Zero external AI dependencies — 100% native tech',
  ],
  exports: [
    // SDK Runner functions
    { name: 'boot', type: 'function', description: 'Boot NOVA-OS', example: "const log = boot();" },
    { name: 'chat', type: 'function', description: 'Chat with the AGI', example: "chat('What is φ?')" },
    { name: 'think', type: 'function', description: 'Chat with full AGI response', example: "const r = think('Hello')" },
    { name: 'open', type: 'function', description: 'Open a desktop app', example: "open('chrome')" },
    { name: 'code', type: 'function', description: 'Generate code', example: "code('fibonacci in Rust')" },
    { name: 'search', type: 'function', description: 'Search the web', example: "search('Nova Protocol')" },
    { name: 'imagine', type: 'function', description: 'Describe an image', example: "imagine('golden spiral')" },
    { name: 'translate', type: 'function', description: 'Translate text', example: "translate('Hello', 'Spanish')" },
    { name: 'solve', type: 'function', description: 'Solve a math problem', example: "solve('∫ x² dx')" },
    { name: 'execute', type: 'function', description: 'Execute a terminal command', example: "execute('/engines')" },
    { name: 'tokenize', type: 'function', description: 'Tokenize text', example: "tokenize('Hello world')" },
    { name: 'countTokens', type: 'function', description: 'Count tokens', example: "countTokens('Hello')" },
    { name: 'encode', type: 'function', description: 'Encode to token IDs', example: "encode('Hello world')" },
    { name: 'engines', type: 'function', description: 'List all 23 engines', example: "engines()" },
    { name: 'compareEngines', type: 'function', description: 'Compare vs GPT-4/Claude', example: "compareEngines()" },
    { name: 'status', type: 'function', description: 'Get system status', example: "status()" },
    { name: 'identity', type: 'function', description: 'Get OS identity', example: "identity()" },

    // Classes
    { name: 'NovaOS', type: 'class', description: 'The operating system kernel', example: "new NovaOS()" },
    { name: 'NovaDesktopAGI', type: 'class', description: 'The AGI orchestrator', example: "new NovaDesktopAGI()" },
    { name: 'NovaChatTerminal', type: 'class', description: 'Interactive chat terminal', example: "new NovaChatTerminal()" },
    { name: 'NovaAppController', type: 'class', description: 'Desktop app controller', example: "new NovaAppController()" },
    { name: 'NovaTokenizer', type: 'class', description: 'Sovereign tokenizer', example: "new NovaTokenizer()" },
    { name: 'NovaSDK', type: 'class', description: 'Full engine SDK', example: "new NovaSDK({ apiKey: '...' })" },
    { name: 'NovaAPIClient', type: 'class', description: 'Low-level API client', example: "new NovaAPIClient({ apiKey: '...' })" },
    { name: 'NovaEngineRegistry', type: 'class', description: 'Engine capability registry', example: "new NovaEngineRegistry()" },
    { name: 'NovaEngineComparison', type: 'class', description: 'Engine comparison engine', example: "new NovaEngineComparison()" },

    // Constants
    { name: 'NOVA_ENGINES', type: 'constant', description: 'All 23 engine definitions', example: "NOVA_ENGINES[0].name" },
    { name: 'NOVA_OS_IDENTITY', type: 'constant', description: 'OS identity object', example: "NOVA_OS_IDENTITY.name" },
    { name: 'EXTERNAL_MODELS', type: 'constant', description: 'GPT-4/Claude/Gemini profiles', example: "EXTERNAL_MODELS[0].name" },
  ],
  publicRepoIdeas: [
    {
      name: 'nova-os-sdk',
      repo: 'ItsNotAILABS/nova-os-sdk',
      description: 'The full NOVA-OS SDK — 23 sovereign AI engines, desktop AGI, chat terminal, φ-tokenizer.',
      audience: 'AI developers, indie hackers, sovereignty advocates',
      uniqueValue: 'Only SDK with native φ-mathematics and Fibonacci attestation. No OpenAI wrapper.',
      estimatedFiles: 15,
    },
    {
      name: 'nova-tokenizer',
      repo: 'ItsNotAILABS/nova-tokenizer',
      description: 'Sovereign φ-mathematics tokenizer. Generate your own token IDs. No BPE, no SentencePiece.',
      audience: 'NLP researchers, AI developers, crypto/math enthusiasts',
      uniqueValue: 'First tokenizer using golden-ratio segmentation and Fibonacci hashing.',
      estimatedFiles: 5,
    },
    {
      name: 'nova-wire',
      repo: 'ItsNotAILABS/nova-wire',
      description: 'Fibonacci-attested wire protocol for AI systems. Provenance proof on every response.',
      audience: 'AI infrastructure engineers, protocol designers',
      uniqueValue: 'Mathematical proof-of-origin for AI outputs. No other wire protocol has this.',
      estimatedFiles: 8,
    },
    {
      name: 'phi-math',
      repo: 'ItsNotAILABS/phi-math',
      description: 'Golden-ratio mathematics library. PHI, Fibonacci hashing, Kuramoto oscillators.',
      audience: 'Mathematicians, game devs, graphics programmers, data scientists',
      uniqueValue: 'Pure φ-mathematics in TypeScript. Beautiful, fast, useful everywhere.',
      estimatedFiles: 6,
    },
    {
      name: 'nova-engine-registry',
      repo: 'ItsNotAILABS/nova-engine-registry',
      description: 'Registry of 23 AI engine definitions with capabilities, modalities, endpoints.',
      audience: 'AI developers building multi-model systems',
      uniqueValue: 'Open-source engine registry with comparison data against all major models.',
      estimatedFiles: 4,
    },
    {
      name: 'fracture-100',
      repo: 'ItsNotAILABS/fracture-100',
      description: '100 technology domain intelligence classifications. The tech knowledge graph.',
      audience: 'Tech analysts, CTOs, AI researchers, developers',
      uniqueValue: 'Curated taxonomy of 100 tech domains with sovereign alternatives for each.',
      estimatedFiles: 8,
    },
    {
      name: 'nova-chat-terminal',
      repo: 'ItsNotAILABS/nova-chat-terminal',
      description: 'Interactive AI chat terminal with command routing. Works with any AI backend.',
      audience: 'CLI enthusiasts, AI developers, terminal power users',
      uniqueValue: 'First chat terminal with intent-based engine routing and multi-engine consensus.',
      estimatedFiles: 5,
    },
  ],
};

// ══════════════════════════════════════════════════════════════════
//  PACKAGE SUMMARY
// ══════════════════════════════════════════════════════════════════

/**
 * Print a summary of the SDK package.
 */
export function printSDKSummary(): string {
  const m = NOVA_SDK_MANIFEST;
  const lines: string[] = [
    '',
    '  ╔═══════════════════════════════════════════════════════════════╗',
    `  ║   ${m.displayName} v${m.version}`,
    '  ║   Sovereign AI Operating System in a Package',
    '  ╚═══════════════════════════════════════════════════════════════╝',
    '',
    `  ${m.description}`,
    '',
    '  INSTALL:',
    '    npm install nova-os-sdk',
    '',
    '  QUICK START:',
    "    import { boot, chat, open, tokenize } from 'nova-os-sdk';",
    '',
    '    boot();',
    "    console.log(chat('What is the golden ratio?'));",
    "    console.log(open('chrome'));",
    "    console.log(tokenize('Hello, sovereign world!'));",
    '',
    `  ENGINES: ${m.engines.count} sovereign AI engines`,
    `  EXPORTS: ${m.exports.length} (${m.exports.filter(e => e.type === 'function').length} functions, ${m.exports.filter(e => e.type === 'class').length} classes, ${m.exports.filter(e => e.type === 'constant').length} constants)`,
    '',
    '  CAPABILITIES:',
  ];

  for (const cap of m.capabilities) {
    lines.push(`    ✓ ${cap}`);
  }

  lines.push('');
  lines.push('  PUBLIC REPO IDEAS:');
  for (const idea of m.publicRepoIdeas) {
    lines.push(`    → ${idea.name}: ${idea.description.substring(0, 70)}...`);
  }

  lines.push('');
  return lines.join('\n');
}
