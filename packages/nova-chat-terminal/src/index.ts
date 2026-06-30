/**
 * @nova-protocol/nova-chat-terminal
 *
 * Core session and routing logic for the NOVA chat terminal.
 *
 * This module provides:
 * - ChatSession: manages conversation history and the attestation chain
 * - route(): φ-routes a message and returns a structured ChatResponse
 * - formatEngineList(): pretty-prints the 23-engine fleet
 *
 * The CLI entry point (cli.ts) builds on top of this.
 *
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import {
  NovaWireMessage,
  AttestationChain,
  newChain,
  createMessage,
  verifyChain,
} from '../../nova-wire/src/index';
import {
  routeIntent,
  primaryEngine,
  ENGINES,
  ENGINES_BY_ID,
  NovaEngine,
} from '../../nova-engine-registry/src/index';
import { countTokens } from '../../nova-tokenizer/src/index';
import { PHI } from '../../phi-math/src/index';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  engineId?: string;
  tokenCount?: number;
  timestamp: number;
}

export interface ChatResponse {
  /** The raw wire message (for inspection / forwarding) */
  wireMessage: NovaWireMessage;
  /** The engine that was selected */
  engine: NovaEngine;
  /** Token count of the user input */
  inputTokens: number;
  /** All candidate engines in routing order */
  routingCandidates: NovaEngine[];
  /** Fibonacci attestation hash */
  attestation: string;
  /** Routing weight applied */
  routingWeight: number;
}

// ─── Chat Session ─────────────────────────────────────────────────────────────

/**
 * A stateful chat session with a Fibonacci attestation chain.
 *
 * @example
 * ```ts
 * const session = new ChatSession({ sessionId: 'my-session' });
 * const response = session.send("Prove that √2 is irrational");
 * console.log(response.engine.name);  // "Logos"
 * console.log(response.attestation);  // "a4f7e2b1..."
 * ```
 */
export class ChatSession {
  readonly sessionId: string;
  readonly history: ChatMessage[] = [];
  private chain: AttestationChain;

  constructor(options: { sessionId?: string } = {}) {
    this.sessionId = options.sessionId ?? `session-${Date.now()}`;
    this.chain = newChain();
  }

  /**
   * Send a message and get a structured ChatResponse.
   * The chain is automatically extended.
   */
  send(userInput: string, metadata: Record<string, unknown> = {}): ChatResponse {
    const trimmed = userInput.trim();
    if (!trimmed) throw new Error('ChatSession.send: empty input');

    const tokenCount = countTokens(trimmed);
    const userMsg: ChatMessage = {
      role: 'user',
      content: trimmed,
      tokenCount,
      timestamp: Date.now(),
    };
    this.history.push(userMsg);

    const wireMessage = createMessage(trimmed, this.chain, 'NOV-001', metadata);
    const engine = primaryEngine(trimmed);
    const candidates = routeIntent(trimmed);

    const response: ChatResponse = {
      wireMessage,
      engine,
      inputTokens: tokenCount,
      routingCandidates: candidates,
      attestation: wireMessage.fibonacciAttestation,
      routingWeight: wireMessage.routingWeight,
    };

    const assistantMsg: ChatMessage = {
      role: 'assistant',
      content: `[Routed to ${engine.id} ${engine.name} via ${engine.wireEndpoint}]`,
      engineId: engine.id,
      timestamp: Date.now(),
    };
    this.history.push(assistantMsg);

    return response;
  }

  /**
   * Verify the integrity of the entire session chain.
   */
  verify(): boolean {
    return verifyChain(this.chain);
  }

  /**
   * Return the full message count in the chain.
   */
  get messageCount(): number {
    return this.chain.messages.length;
  }

  /**
   * Dump chain statistics.
   */
  stats(): {
    sessionId: string;
    messages: number;
    chainIntegrity: boolean;
    totalTokens: number;
    engineUsage: Record<string, number>;
  } {
    const totalTokens = this.history
      .filter((m) => m.role === 'user')
      .reduce((s, m) => s + (m.tokenCount ?? 0), 0);

    const engineUsage: Record<string, number> = {};
    for (const msg of this.history) {
      if (msg.engineId) engineUsage[msg.engineId] = (engineUsage[msg.engineId] ?? 0) + 1;
    }

    return {
      sessionId: this.sessionId,
      messages: this.chain.messages.length,
      chainIntegrity: this.verify(),
      totalTokens,
      engineUsage,
    };
  }
}

// ─── Formatting utilities ────────────────────────────────────────────────────

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const CYAN   = '\x1b[36m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM    = '\x1b[2m';
const GOLD   = '\x1b[33m';

/**
 * Pretty-print the full 23-engine registry to a string.
 */
export function formatEngineList(): string {
  const lines: string[] = [
    `${BOLD}${GOLD}NOVA 23-Engine Fleet${RESET}`,
    `${DIM}${'─'.repeat(72)}${RESET}`,
    `${BOLD}${'ID'.padEnd(10)}${'Name'.padEnd(14)}${'Domain'.padEnd(36)}${'Ctx'.padEnd(8)}Tier${RESET}`,
    `${DIM}${'─'.repeat(72)}${RESET}`,
  ];
  for (const e of ENGINES) {
    const ctx = e.contextWindow >= 1_000_000
      ? `${e.contextWindow / 1_000_000}M`
      : e.contextWindow >= 1_000
        ? `${e.contextWindow / 1_000}K`
        : String(e.contextWindow);
    const tierColor = e.tier === 1 ? GREEN : e.tier === 2 ? CYAN : DIM;
    lines.push(
      `${CYAN}${e.id.padEnd(10)}${RESET}` +
      `${BOLD}${e.name.padEnd(14)}${RESET}` +
      `${e.domain.padEnd(36)}` +
      `${ctx.padEnd(8)}` +
      `${tierColor}T${e.tier}${RESET}`,
    );
  }
  lines.push(`${DIM}${'─'.repeat(72)}${RESET}`);
  lines.push(`${DIM}φ = ${PHI}  |  Vocabulary: 131 072 tokens  |  Protocol: nova-wire v1.0${RESET}`);
  return lines.join('\n');
}

/**
 * Format a ChatResponse for terminal display.
 */
export function formatResponse(res: ChatResponse): string {
  const { engine, inputTokens, attestation, routingCandidates, routingWeight } = res;
  const altEngines = routingCandidates
    .slice(1, 4)
    .map((e) => `${e.id} ${e.name}`)
    .join(', ');

  return [
    `${BOLD}${GREEN}▸ ${engine.id} ${engine.name}${RESET}  ${DIM}${engine.domain}${RESET}`,
    `${DIM}  endpoint: ${engine.wireEndpoint}${RESET}`,
    `${DIM}  tokens:   ${inputTokens}  |  routing weight: ${routingWeight.toFixed(4)}${RESET}`,
    altEngines ? `${DIM}  also:     ${altEngines}${RESET}` : '',
    `${DIM}  attest:   ${attestation}${RESET}`,
  ].filter(Boolean).join('\n');
}

/**
 * Parse a terminal command string:
 * - `/engine <id>` → pin to a specific engine
 * - `/engines`     → list all
 * - `/stats`       → session stats
 * - `/verify`      → chain verification
 * - `/clear`       → signal to clear history
 * - anything else  → treat as chat input
 */
export type ParsedCommand =
  | { type: 'chat';    input: string }
  | { type: 'engines' }
  | { type: 'stats' }
  | { type: 'verify' }
  | { type: 'clear' }
  | { type: 'engine';  engineId: string }
  | { type: 'help' }
  | { type: 'quit' };

export function parseCommand(raw: string): ParsedCommand {
  const trimmed = raw.trim();
  if (trimmed.startsWith('/engine ')) {
    return { type: 'engine', engineId: trimmed.slice(8).trim().toUpperCase() };
  }
  switch (trimmed) {
    case '/engines': return { type: 'engines' };
    case '/stats':   return { type: 'stats' };
    case '/verify':  return { type: 'verify' };
    case '/clear':   return { type: 'clear' };
    case '/help':    return { type: 'help' };
    case '/quit':
    case '/exit':
    case 'quit':
    case 'exit':     return { type: 'quit' };
    default:         return { type: 'chat', input: trimmed };
  }
}

export const HELP_TEXT = `
${BOLD}nova-chat — NOVA Sovereign AI Terminal${RESET}

${BOLD}Commands:${RESET}
  ${CYAN}/engines${RESET}          List all 23 NOVA engines
  ${CYAN}/engine <id>${RESET}      Show info for a specific engine (e.g. /engine NOV-009)
  ${CYAN}/stats${RESET}            Session statistics and chain integrity
  ${CYAN}/verify${RESET}           Verify Fibonacci attestation chain
  ${CYAN}/clear${RESET}            Clear session history
  ${CYAN}/help${RESET}             Show this help
  ${CYAN}/quit${RESET}             Exit

${BOLD}Routing:${RESET}
  Every message is φ-routed to the optimal engine automatically.
  Routing is deterministic — same intent → same engine, always.

${BOLD}Attestation:${RESET}
  Every message produces a Fibonacci attestation hash.
  The chain is verifiable offline with no external dependencies.
`.trim();

export { ENGINES, ENGINES_BY_ID, routeIntent, primaryEngine };
export type { NovaEngine, NovaWireMessage, AttestationChain };
