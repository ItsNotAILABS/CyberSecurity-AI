///
/// NOVA-OS RUNNER — CLI & Programmatic Entry Point
///
/// This is the file that makes NOVA-OS a real, usable system.
/// Run it from your terminal, or import it from your code.
///
/// CLI Usage (after building):
///   npx nova-os              → boots NOVA-OS, opens chat terminal
///   npx nova-os --status     → show system status
///   npx nova-os --engines    → list all 23 engines
///   npx nova-os --compare    → GPT-4/Claude/Gemini comparison
///   npx nova-os --tokenize "Hello world"  → tokenize text
///   npx nova-os --open chrome → launch an app
///   npx nova-os --chat "What is φ?"  → one-shot chat
///
/// Programmatic Usage:
///   import { boot, chat, open, engines, tokenize } from 'nova-os-sdk';
///
///   const os = boot();
///   console.log(chat('Hello!'));
///   console.log(open('vscode'));
///   console.log(engines());
///   console.log(tokenize('Golden ratio'));
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { NovaOS, createNovaOS, NOVA_OS_IDENTITY } from '../desktop/NovaOS.js';
import { NovaDesktopAGI, createDesktopAGI } from '../desktop/NovaDesktopAGI.js';
import { NovaTokenizer, createTokenizer } from './NovaTokenizer.js';
import { NOVA_ENGINES, NovaEngineRegistry } from './NovaEngineModels.js';
import { NovaEngineComparison } from '../desktop/NovaEngineComparison.js';

import type { AGIResponse } from '../desktop/NovaDesktopAGI.js';
import type { NovaOSState } from '../desktop/NovaOS.js';
import type { NovaTokenizerResult } from './NovaTokenizer.js';

// ══════════════════════════════════════════════════════════════════
//  NOVA-OS SDK SINGLETON
// ══════════════════════════════════════════════════════════════════
//
//  The SDK exposes a single global instance of NOVA-OS.
//  You boot it once, then use it everywhere.
//
//  This is the "AI SDK" — literally a package you import.
//  Everything is native. No OpenAI dependency. No Google dependency.
//  No rented cloud. YOUR code, YOUR machine, YOUR intelligence.
//

export interface NovaOSSDKOptions {
  /** Default engine to route chat to (default: NOV-001 Cognos) */
  readonly defaultEngine?: string;
  /** Enable sovereign-only mode (force on-device execution) */
  readonly sovereignMode?: boolean;
  /** Enable verbose boot logging */
  readonly verbose?: boolean;
}

// Internal state
let _agi: NovaDesktopAGI | null = null;
let _tokenizer: NovaTokenizer | null = null;
let _bootLog: string = '';
let _booted = false;

// ══════════════════════════════════════════════════════════════════
//  PUBLIC API — The SDK Methods You Call
// ══════════════════════════════════════════════════════════════════

/**
 * Boot NOVA-OS.
 * Call this first. Everything else requires a booted system.
 *
 * @returns The boot log (ASCII art + engine status)
 */
export function boot(options?: NovaOSSDKOptions): string {
  if (_booted && _agi) return _bootLog;

  _agi = createDesktopAGI({
    defaultEngine: (options?.defaultEngine as any) ?? 'NOV-001',
  });
  _tokenizer = createTokenizer();
  _bootLog = _agi.os.boot();
  _booted = true;

  return _bootLog;
}

/**
 * Chat with NOVA-OS.
 * Automatically classifies your intent and routes to the best engine.
 *
 * @example
 *   chat('What is the golden ratio?')  → routes to NOV-001 Cognos
 *   chat('Write fibonacci in Rust')    → routes to NOV-008 Codex
 *   chat('Search for Nova Protocol')   → routes to NOV-013 Scrutator
 */
export function chat(message: string): string {
  ensureBooted();
  return _agi!.chat(message);
}

/**
 * Think — like chat() but returns full AGI response with intent, engine, attestation.
 */
export function think(message: string): AGIResponse {
  ensureBooted();
  return _agi!.think(message);
}

/**
 * Open an application on your desktop.
 *
 * @example
 *   open('chrome')     → opens Google Chrome
 *   open('vscode')     → opens VS Code
 *   open('spotify')    → opens Spotify
 *   open('terminal')   → opens system terminal
 */
export function open(appName: string): string {
  ensureBooted();
  return _agi!.open(appName);
}

/**
 * Generate code.
 *
 * @example
 *   code('fibonacci in TypeScript')
 *   code('HTTP server in Rust')
 */
export function code(prompt: string): string {
  ensureBooted();
  return _agi!.code(prompt);
}

/**
 * Search the web.
 */
export function search(query: string): string {
  ensureBooted();
  return _agi!.search(query);
}

/**
 * Generate an image description (routes to NOV-009 Pictor).
 */
export function imagine(prompt: string): string {
  ensureBooted();
  return _agi!.imagine(prompt);
}

/**
 * Translate text.
 */
export function translate(text: string, targetLang: string): string {
  ensureBooted();
  return _agi!.translate(text, targetLang);
}

/**
 * Solve a math problem.
 */
export function solve(problem: string): string {
  ensureBooted();
  return _agi!.solve(problem);
}

/**
 * Execute a terminal command.
 *
 * @example
 *   execute('/engines')           → list all 23 engines
 *   execute('/compare NOV-001')   → compare Cognos vs GPT-4
 *   execute('/status')            → system status
 *   execute('/help')              → all commands
 *   execute('/cognos What is φ?') → direct engine call
 */
export function execute(command: string): string {
  ensureBooted();
  return _agi!.os.execute(command);
}

/**
 * Tokenize text using Nova's sovereign tokenizer.
 * Returns your OWN token IDs — not OpenAI's, not Google's.
 *
 * @example
 *   const result = tokenize('Hello, golden world!');
 *   console.log(result.totalTokens);  // 5
 *   console.log(result.tokens[0].id); // 48291 (Fibonacci hash)
 */
export function tokenize(text: string): NovaTokenizerResult {
  ensureTokenizer();
  return _tokenizer!.tokenize(text);
}

/**
 * Count tokens in text (fast path, no full tokenization).
 */
export function countTokens(text: string): number {
  ensureTokenizer();
  return _tokenizer!.countTokens(text);
}

/**
 * Encode text to sovereign token IDs.
 */
export function encode(text: string): readonly number[] {
  ensureTokenizer();
  return _tokenizer!.encode(text);
}

/**
 * Visualize tokenization of a text (human-readable table).
 */
export function visualizeTokens(text: string): string {
  ensureTokenizer();
  return _tokenizer!.visualize(text);
}

/**
 * Explain what tokens are.
 */
export function explainTokens(): string {
  ensureTokenizer();
  return _tokenizer!.explain();
}

/**
 * List all 23 Nova engines with capabilities.
 */
export function engines(): readonly {
  id: string;
  name: string;
  slug: string;
  description: string;
  contextWindow: number;
  maxOutputTokens: number;
  modalities: readonly string[];
  supportsStreaming: boolean;
  supportsVision: boolean;
  supportsAudio: boolean;
  supportsFunctionCalling: boolean;
}[] {
  return NOVA_ENGINES.map(e => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    description: e.description,
    contextWindow: e.contextWindow,
    maxOutputTokens: e.maxOutputTokens,
    modalities: e.modalities,
    supportsStreaming: e.supportsStreaming,
    supportsVision: e.supportsVision,
    supportsAudio: e.supportsAudio,
    supportsFunctionCalling: e.supportsFunctionCalling,
  }));
}

/**
 * Get the full engine comparison report (Nova vs GPT-4, Claude, Gemini, etc).
 */
export function compareEngines(): string {
  const comparison = new NovaEngineComparison();
  const report = comparison.fullReport();
  const lines: string[] = [
    '═══════════════════════════════════════════════════════════════',
    `  NOVA ENGINE COMPARISON REPORT`,
    `  ${report.totalNovaEngines} Nova Engines vs ${report.totalCompetitors} External Models`,
    `  Generated: ${new Date(report.timestamp).toISOString()}`,
    '═══════════════════════════════════════════════════════════════',
    '',
    `  Nova Wins: ${report.summary.novaWins}`,
    `  Competitor Wins: ${report.summary.competitorWins}`,
    `  Ties: ${report.summary.ties}`,
    `  Average φ-Score: ${report.summary.averagePhiScore}`,
    '',
    `  Nova Max Context: ${report.summary.novaMaxContext.toLocaleString()} tokens`,
    `  Competitor Max Context: ${report.summary.competitorMaxContext.toLocaleString()} tokens`,
    '',
    `  Nova Unique Capabilities: ${report.summary.novaUniqueCaps.join(', ') || 'none'}`,
    `  Competitor Unique Capabilities: ${report.summary.competitorUniqueCaps.join(', ') || 'none'}`,
    '',
  ];
  return lines.join('\n');
}

/**
 * Get system status.
 */
export function status(): NovaOSState {
  ensureBooted();
  return _agi!.os.getState();
}

/**
 * Get the OS identity.
 */
export function identity() {
  return NOVA_OS_IDENTITY;
}

/**
 * Get the AGI instance for advanced usage.
 */
export function getAGI(): NovaDesktopAGI {
  ensureBooted();
  return _agi!;
}

/**
 * Get the raw OS instance.
 */
export function getOS(): NovaOS {
  ensureBooted();
  return _agi!.os;
}

/**
 * Reset NOVA-OS (reboot).
 */
export function reboot(options?: NovaOSSDKOptions): string {
  _agi = null;
  _tokenizer = null;
  _booted = false;
  _bootLog = '';
  return boot(options);
}

// ── Helpers ──────────────────────────────────────────────────────

function ensureBooted(): void {
  if (!_booted || !_agi) {
    boot();
  }
}

function ensureTokenizer(): void {
  if (!_tokenizer) {
    _tokenizer = createTokenizer();
  }
}

// ══════════════════════════════════════════════════════════════════
//  CLI ENTRY POINT
// ══════════════════════════════════════════════════════════════════
//
//  When run from the command line:
//    node nova-os-runner.js
//    node nova-os-runner.js --chat "Hello"
//    node nova-os-runner.js --engines
//    node nova-os-runner.js --tokenize "Hello world"
//

/**
 * Parse CLI arguments and run the appropriate command.
 * Returns the output string.
 */
export function runCLI(args: readonly string[]): string {
  const flag = args[0]?.toLowerCase() ?? '';
  const rest = args.slice(1).join(' ');

  switch (flag) {
    case '--help':
    case '-h':
      return [
        '',
        '  ╔═══════════════════════════════════════════════╗',
        '  ║            NOVA-OS SDK — CLI Help              ║',
        '  ╚═══════════════════════════════════════════════╝',
        '',
        '  USAGE:',
        '    nova-os                      Boot & enter chat terminal',
        '    nova-os --chat "message"     One-shot chat',
        '    nova-os --think "message"    Chat with full response',
        '    nova-os --open <app>         Open an application',
        '    nova-os --code "prompt"      Generate code',
        '    nova-os --search "query"     Search the web',
        '    nova-os --engines            List all 23 engines',
        '    nova-os --compare            Compare vs GPT-4/Claude/Gemini',
        '    nova-os --tokenize "text"    Tokenize text (see your token IDs)',
        '    nova-os --count "text"       Count tokens in text',
        '    nova-os --explain-tokens     Explain what tokens are',
        '    nova-os --status             System status',
        '    nova-os --identity           NOVA-OS identity',
        '    nova-os --help               This help message',
        '',
        '  EXAMPLES:',
        '    nova-os --chat "What is the golden ratio?"',
        '    nova-os --open chrome',
        '    nova-os --code "fibonacci in TypeScript"',
        '    nova-os --tokenize "Hello, sovereign world!"',
        '',
      ].join('\n');

    case '--chat':
    case '-c':
      return chat(rest || 'Hello, I am NOVA-OS.');

    case '--think':
    case '-t': {
      const response = think(rest || 'Hello');
      return [
        `Intent: ${response.intent.intent} (${(response.intent.confidence * 100).toFixed(1)}%)`,
        `Engine: ${response.engine}`,
        `Attestation: ${response.attestation}`,
        `Time: ${response.executionMs}ms`,
        '',
        response.response,
      ].join('\n');
    }

    case '--open':
    case '-o':
      return open(rest || 'calculator');

    case '--code':
      return code(rest || 'hello world in TypeScript');

    case '--search':
    case '-s':
      return search(rest || 'Nova Protocol');

    case '--engines':
    case '-e':
      return engines().map(e =>
        `  ${e.id}  ${e.name.padEnd(20)}  ${e.contextWindow.toLocaleString().padStart(11)} ctx  ${e.modalities.join(', ')}`,
      ).join('\n');

    case '--compare':
      return compareEngines();

    case '--tokenize':
      return visualizeTokens(rest || 'Hello, golden world!');

    case '--count':
      return `Token count: ${countTokens(rest || '')}`;

    case '--explain-tokens':
      return explainTokens();

    case '--status': {
      const s = status();
      return [
        `Booted: ${s.booted}`,
        `Uptime: ${s.uptime}ms`,
        `Active Engines: ${s.activeEngines.length}`,
        `Active Services: ${s.activeServices.length}`,
        `Platform: ${s.platform}`,
        `Commands: ${s.totalCommands}`,
        `Health: ${(s.healthScore * 100).toFixed(1)}%`,
      ].join('\n');
    }

    case '--identity': {
      const id = identity();
      return Object.entries(id).map(([k, v]) => `  ${k}: ${v}`).join('\n');
    }

    default:
      // No flag or unknown flag — boot and show the terminal
      return boot();
  }
}
