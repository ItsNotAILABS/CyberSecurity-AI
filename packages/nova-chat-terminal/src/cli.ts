#!/usr/bin/env node
/**
 * nova-chat CLI entry point
 *
 * Usage:
 *   nova-chat                 interactive REPL
 *   nova-chat "your prompt"   single-shot routing
 *   nova-chat --engines       list all 23 engines
 *   nova-chat --help          help
 */

import * as readline from 'readline';
import {
  ChatSession,
  formatEngineList,
  formatResponse,
  parseCommand,
  HELP_TEXT,
  ENGINES,
  ENGINES_BY_ID,
} from './index';

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const CYAN   = '\x1b[36m';
const GREEN  = '\x1b[32m';
const YELLOW = '\x1b[33m';
const DIM    = '\x1b[2m';

function banner(): void {
  console.log(`
${BOLD}${YELLOW}▓▓▓ NOVA SOVEREIGN TERMINAL ▓▓▓${RESET}
${DIM}23-Engine Fleet  |  φ-Routing  |  Fibonacci Attestation${RESET}
${DIM}Casa de Medina — Architectos de Architectura Inteligente${RESET}
Type ${CYAN}/help${RESET} for commands, ${CYAN}/engines${RESET} to list the fleet, ${CYAN}/quit${RESET} to exit.
`);
}

async function repl(): Promise<void> {
  banner();

  const session = new ChatSession({ sessionId: `nova-${Date.now()}` });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `${CYAN}nova>${RESET} `,
  });

  rl.prompt();

  rl.on('line', (line) => {
    const cmd = parseCommand(line);

    switch (cmd.type) {
      case 'quit':
        console.log(`\n${DIM}Session closed. Chain integrity: ${session.verify() ? '✓' : '✗'}${RESET}`);
        rl.close();
        process.exit(0);
        break;

      case 'engines':
        console.log('\n' + formatEngineList() + '\n');
        break;

      case 'engine': {
        const e = ENGINES_BY_ID[cmd.engineId];
        if (!e) {
          console.log(`${YELLOW}Unknown engine: ${cmd.engineId}${RESET}`);
          console.log(`${DIM}Available IDs: ${ENGINES.map((e) => e.id).join(', ')}${RESET}`);
        } else {
          console.log(`\n${BOLD}${CYAN}${e.id} — ${e.name}${RESET}`);
          console.log(`  Domain:   ${e.domain}`);
          console.log(`  Context:  ${e.contextWindow.toLocaleString()} tokens`);
          console.log(`  Modality: ${e.modality}`);
          console.log(`  Endpoint: ${e.wireEndpoint}`);
          console.log(`  Tier:     ${e.tier}`);
          console.log(`  φ-weight: ${e.phiWeight}`);
          console.log(`  Keywords: ${e.intentKeywords.join(', ')}`);
        }
        console.log();
        break;
      }

      case 'stats': {
        const s = session.stats();
        console.log(`\n${BOLD}Session Stats${RESET}`);
        console.log(`  ID:           ${s.sessionId}`);
        console.log(`  Messages:     ${s.messages}`);
        console.log(`  Total tokens: ${s.totalTokens}`);
        console.log(`  Chain valid:  ${s.chainIntegrity ? `${GREEN}✓${RESET}` : `${YELLOW}✗${RESET}`}`);
        if (Object.keys(s.engineUsage).length > 0) {
          console.log('  Engines used:');
          for (const [id, count] of Object.entries(s.engineUsage)) {
            const e = ENGINES_BY_ID[id];
            console.log(`    ${CYAN}${id}${RESET} ${e?.name ?? '?'}: ${count}×`);
          }
        }
        console.log();
        break;
      }

      case 'verify': {
        const ok = session.verify();
        console.log(`\n${BOLD}Chain Verification${RESET}`);
        console.log(`  Messages in chain: ${session.messageCount}`);
        console.log(`  Integrity: ${ok ? `${GREEN}✓ VALID${RESET}` : `${YELLOW}✗ INVALID${RESET}`}`);
        console.log();
        break;
      }

      case 'clear':
        session.history.length = 0;
        console.log(`${DIM}History cleared.${RESET}`);
        break;

      case 'help':
        console.log('\n' + HELP_TEXT + '\n');
        break;

      case 'chat': {
        if (!cmd.input) break;
        try {
          const res = session.send(cmd.input);
          console.log('\n' + formatResponse(res) + '\n');
        } catch (err) {
          console.error(`${YELLOW}Error: ${err}${RESET}`);
        }
        break;
      }
    }

    rl.prompt();
  });

  rl.on('close', () => {
    process.exit(0);
  });
}

function singleShot(input: string): void {
  const session = new ChatSession();
  const res = session.send(input);
  console.log(formatResponse(res));
  console.log();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log('\n' + HELP_TEXT + '\n');
  process.exit(0);
}

if (args.includes('--engines')) {
  console.log('\n' + formatEngineList() + '\n');
  process.exit(0);
}

if (args.length > 0 && !args[0].startsWith('-')) {
  singleShot(args.join(' '));
  process.exit(0);
}

// Interactive REPL
repl().catch((err) => {
  console.error(err);
  process.exit(1);
});
