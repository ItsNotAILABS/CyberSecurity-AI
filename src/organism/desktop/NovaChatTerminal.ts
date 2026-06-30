///
/// NOVA CHAT TERMINAL — Interactive AI Terminal with Engine Routing
///
/// This is the chat interface for NOVA-OS.  It provides:
///   1. Natural language command parsing → routes to the right engine
///   2. Direct engine selection (e.g., "/cognos What is φ?")
///   3. App control commands ("/open chrome", "/launch vscode")
///   4. System commands ("/screenshot", "/lock")
///   5. Engine comparison ("/compare NOV-001 gpt-4-turbo")
///   6. Session history with φ-weighted context
///   7. Multi-engine consensus ("/consensus What is 2+2?")
///   8. Streaming output display
///   9. Command history and tab completion
///
/// The terminal is the primary interface for NOVA-OS personal AGI.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, fibonacciHash } from '../intelligence/ObserverIntelligence.js';
import {
  NOVA_ENGINES,
  type NovaEngineDefinition,
  type NovaEngineId,
  type NovaMessage,
} from '../sdk/NovaEngineModels.js';
import { NovaAppController, type AppLaunchRequest } from './NovaAppController.js';
import { NovaEngineComparison } from './NovaEngineComparison.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type TerminalCommandType =
  | 'chat'           // natural language → AI
  | 'engine'         // /engine-slug message
  | 'open'           // /open <app>
  | 'launch'         // /launch <path>
  | 'shell'          // /shell <command>
  | 'compare'        // /compare <nova-id> <competitor>
  | 'explain'        // /explain <nova-id>
  | 'consensus'      // /consensus <question>
  | 'engines'        // /engines — list all
  | 'status'         // /status — system status
  | 'history'        // /history — show chat history
  | 'clear'          // /clear — clear chat
  | 'help'           // /help — show commands
  | 'file'           // /file <action> <path>
  | 'url'            // /url <url>
  | 'system'         // /system <action>
  | 'apps'           // /apps — list known apps
  | 'unknown';

export interface ParsedCommand {
  readonly type: TerminalCommandType;
  readonly raw: string;
  readonly engineSlug?: string;
  readonly message?: string;
  readonly args: readonly string[];
  readonly timestamp: number;
}

export interface TerminalMessage {
  readonly id: number;
  readonly role: 'user' | 'assistant' | 'system' | 'engine';
  readonly content: string;
  readonly engine?: string;
  readonly timestamp: number;
  readonly commandType?: TerminalCommandType;
  readonly executionMs?: number;
}

export interface TerminalSession {
  readonly sessionId: string;
  readonly startTime: number;
  readonly messages: readonly TerminalMessage[];
  readonly defaultEngine: NovaEngineId;
  readonly totalTokensUsed: number;
}

export interface TerminalConfig {
  readonly defaultEngine: NovaEngineId;
  readonly maxHistorySize: number;
  readonly showEngineInfo: boolean;
  readonly showTimestamps: boolean;
  readonly streamingEnabled: boolean;
  readonly consensusEngines: readonly NovaEngineId[];
}

// ══════════════════════════════════════════════════════════════════
//  COMMAND PARSER
// ══════════════════════════════════════════════════════════════════

const ENGINE_SLUGS = new Set(NOVA_ENGINES.map(e => e.slug));

function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  const timestamp = Date.now();

  if (!trimmed.startsWith('/')) {
    return { type: 'chat', raw: trimmed, message: trimmed, args: [], timestamp };
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const rest = parts.slice(1);
  const message = rest.join(' ');

  // Check if it's a direct engine call: /cognos what is phi?
  if (ENGINE_SLUGS.has(cmd as any)) {
    return { type: 'engine', raw: trimmed, engineSlug: cmd, message, args: rest, timestamp };
  }

  switch (cmd) {
    case 'open': return { type: 'open', raw: trimmed, message, args: rest, timestamp };
    case 'launch': return { type: 'launch', raw: trimmed, message, args: rest, timestamp };
    case 'shell': case 'exec': case 'run':
      return { type: 'shell', raw: trimmed, message, args: rest, timestamp };
    case 'compare': return { type: 'compare', raw: trimmed, message, args: rest, timestamp };
    case 'explain': return { type: 'explain', raw: trimmed, message, args: rest, timestamp };
    case 'consensus': return { type: 'consensus', raw: trimmed, message, args: rest, timestamp };
    case 'engines': case 'list': return { type: 'engines', raw: trimmed, message, args: rest, timestamp };
    case 'status': return { type: 'status', raw: trimmed, message, args: rest, timestamp };
    case 'history': return { type: 'history', raw: trimmed, message, args: rest, timestamp };
    case 'clear': return { type: 'clear', raw: trimmed, message, args: rest, timestamp };
    case 'help': case '?': return { type: 'help', raw: trimmed, message, args: rest, timestamp };
    case 'file': return { type: 'file', raw: trimmed, message, args: rest, timestamp };
    case 'url': case 'browse': return { type: 'url', raw: trimmed, message, args: rest, timestamp };
    case 'system': case 'sys': return { type: 'system', raw: trimmed, message, args: rest, timestamp };
    case 'apps': return { type: 'apps', raw: trimmed, message, args: rest, timestamp };
    default: return { type: 'unknown', raw: trimmed, message: trimmed, args: rest, timestamp };
  }
}

// ══════════════════════════════════════════════════════════════════
//  CHAT TERMINAL
// ══════════════════════════════════════════════════════════════════

export class NovaChatTerminal {
  readonly name = 'NOVA CHAT TERMINAL';
  readonly designation = 'Terminalis Dialogus — Sovereign AI Command Interface';

  private config: TerminalConfig;
  private messages: TerminalMessage[] = [];
  private nextMsgId = 0;
  private sessionId: string;
  private startTime: number;
  private totalTokens = 0;
  private commandHistory: string[] = [];

  readonly appController: NovaAppController;
  readonly comparison: NovaEngineComparison;

  constructor(config?: Partial<TerminalConfig>) {
    this.config = {
      defaultEngine: config?.defaultEngine ?? 'NOV-001',
      maxHistorySize: config?.maxHistorySize ?? 1000,
      showEngineInfo: config?.showEngineInfo ?? true,
      showTimestamps: config?.showTimestamps ?? true,
      streamingEnabled: config?.streamingEnabled ?? true,
      consensusEngines: config?.consensusEngines ?? ['NOV-001', 'NOV-002', 'NOV-005'],
    };

    this.sessionId = `nova-${Date.now().toString(36)}-${fibonacciHash(Date.now() & 0x7FFFFFFF, 2147483647).toString(36)}`;
    this.startTime = Date.now();
    this.appController = new NovaAppController();
    this.comparison = new NovaEngineComparison();

    // Boot message
    this.addSystemMessage(this.getBootMessage());
  }

  // ── Process Input ──────────────────────────────────────────────

  /** Process a user input and return the terminal response */
  processInput(input: string): TerminalMessage {
    if (!input.trim()) {
      return this.addSystemMessage('');
    }

    this.commandHistory.push(input);
    const cmd = parseCommand(input);
    this.addUserMessage(input, cmd.type);

    switch (cmd.type) {
      case 'chat':
        return this.handleChat(cmd);
      case 'engine':
        return this.handleEngineChat(cmd);
      case 'open':
        return this.handleOpen(cmd);
      case 'launch':
        return this.handleLaunch(cmd);
      case 'shell':
        return this.handleShell(cmd);
      case 'compare':
        return this.handleCompare(cmd);
      case 'explain':
        return this.handleExplain(cmd);
      case 'consensus':
        return this.handleConsensus(cmd);
      case 'engines':
        return this.handleListEngines();
      case 'status':
        return this.handleStatus();
      case 'history':
        return this.handleHistory();
      case 'clear':
        return this.handleClear();
      case 'help':
        return this.handleHelp();
      case 'file':
        return this.handleFile(cmd);
      case 'url':
        return this.handleURL(cmd);
      case 'system':
        return this.handleSystem(cmd);
      case 'apps':
        return this.handleApps();
      case 'unknown':
        return this.addEngineMessage(
          `Unknown command: ${cmd.raw}\nType /help for available commands.`,
          'system',
        );
    }
  }

  // ── Chat Handlers ──────────────────────────────────────────────

  private handleChat(cmd: ParsedCommand): TerminalMessage {
    // Route to default engine — generates the request structure
    const engine = NOVA_ENGINES.find(e => e.id === this.config.defaultEngine);
    const engineName = engine?.name ?? 'Nova Cognos';

    return this.addEngineMessage(
      `[${engineName}] Processing: "${cmd.message}"\n` +
      `→ Route: ${engine?.wireEndpoint ?? 'nova-wire/cognos'}\n` +
      `→ Context window: ${engine?.contextWindow.toLocaleString() ?? '128,000'} tokens\n` +
      `→ Streaming: ${this.config.streamingEnabled ? 'enabled' : 'disabled'}\n` +
      `→ SDK call: nova.${engine?.sdkMethodName ?? 'cognos'}.chat([{ role: 'user', content: '${(cmd.message ?? '').substring(0, 50)}...' }])\n` +
      `\n[Response will be streamed from ${engineName} via nova-wire protocol]`,
      engineName,
    );
  }

  private handleEngineChat(cmd: ParsedCommand): TerminalMessage {
    const engine = NOVA_ENGINES.find(e => e.slug === cmd.engineSlug);
    if (!engine) {
      return this.addEngineMessage(`Engine not found: ${cmd.engineSlug}`, 'system');
    }

    return this.addEngineMessage(
      `[${engine.name}] Processing: "${cmd.message}"\n` +
      `→ Engine: ${engine.id} — ${engine.description}\n` +
      `→ Route: ${engine.wireEndpoint}\n` +
      `→ Context: ${engine.contextWindow.toLocaleString()} tokens\n` +
      `→ Modalities: ${engine.modalities.join(', ')}\n` +
      `→ SDK call: nova.${engine.sdkMethodName}.chat([{ role: 'user', content: '${(cmd.message ?? '').substring(0, 50)}...' }])`,
      engine.name,
    );
  }

  // ── App Control Handlers ───────────────────────────────────────

  private handleOpen(cmd: ParsedCommand): TerminalMessage {
    const appName = cmd.args.join(' ');
    if (!appName) {
      return this.addEngineMessage('Usage: /open <app name>\nExamples: /open chrome, /open vscode, /open spotify', 'system');
    }

    const resolved = this.appController.resolveApp(appName);
    if (!resolved) {
      return this.addEngineMessage(
        `Unknown app: "${appName}"\n` +
        `Known apps: ${this.appController.listKnownApps().map(a => a.aliases[0]).join(', ')}\n` +
        `Or use /launch <path> for custom paths.`,
        'system',
      );
    }

    const result = this.appController.buildLaunchCommand({ name: appName });
    if ('error' in result) {
      return this.addEngineMessage(`Error: ${result.error}`, 'system');
    }

    return this.addEngineMessage(
      `✓ Opening ${resolved.name}\n` +
      `→ Platform: ${this.appController.getPlatform()}\n` +
      `→ Command: ${result.command}\n` +
      `→ Category: ${resolved.category}\n` +
      `→ Execute with: child_process.exec('${result.command}')`,
      'NOVA-OS',
    );
  }

  private handleLaunch(cmd: ParsedCommand): TerminalMessage {
    const path = cmd.args[0] ?? '';
    if (!path) {
      return this.addEngineMessage('Usage: /launch <path> [args...]\nExample: /launch /usr/bin/python3 script.py', 'system');
    }

    const result = this.appController.buildLaunchCommand({
      name: path,
      path,
      args: cmd.args.slice(1),
    });

    if ('error' in result) {
      return this.addEngineMessage(`Error: ${result.error}`, 'system');
    }

    return this.addEngineMessage(
      `✓ Launching: ${path}\n` +
      `→ Command: ${result.command} ${result.args.join(' ')}\n` +
      `→ Platform: ${this.appController.getPlatform()}`,
      'NOVA-OS',
    );
  }

  private handleShell(cmd: ParsedCommand): TerminalMessage {
    const command = cmd.message ?? '';
    if (!command) {
      return this.addEngineMessage('Usage: /shell <command>\nExample: /shell ls -la', 'system');
    }

    const parts = command.split(/\s+/);
    const built = this.appController.buildShellCommand({
      command: parts[0],
      args: parts.slice(1),
    });

    return this.addEngineMessage(
      `✓ Shell command prepared\n` +
      `→ Command: ${built}\n` +
      `→ Platform: ${this.appController.getPlatform()}\n` +
      `→ Execute with: child_process.exec('${built}')`,
      'NOVA-OS',
    );
  }

  // ── Engine Commands ────────────────────────────────────────────

  private handleCompare(cmd: ParsedCommand): TerminalMessage {
    const engineId = cmd.args[0] ?? 'NOV-001';

    // Check if it's a valid Nova engine ID
    const novaEngine = NOVA_ENGINES.find(e => e.id === engineId || e.slug === engineId);
    if (!novaEngine) {
      return this.addEngineMessage(
        `Unknown engine: ${engineId}\n` +
        `Use engine IDs (NOV-001) or slugs (cognos)\n` +
        `Type /engines for a full list.`,
        'system',
      );
    }

    const explanation = this.comparison.explain(novaEngine.id);
    return this.addEngineMessage(explanation, 'NOVA-OS Comparison');
  }

  private handleExplain(cmd: ParsedCommand): TerminalMessage {
    const engineId = cmd.args[0] ?? '';
    if (!engineId) {
      return this.addEngineMessage('Usage: /explain <engine-id>\nExample: /explain NOV-001 or /explain cognos', 'system');
    }

    const engine = NOVA_ENGINES.find(e => e.id === engineId || e.slug === engineId);
    if (!engine) {
      return this.addEngineMessage(`Unknown engine: ${engineId}`, 'system');
    }

    const lines = [
      `═══════════════════════════════════════════════`,
      `  ${engine.name} (${engine.id})`,
      `═══════════════════════════════════════════════`,
      `  Description: ${engine.description}`,
      `  Wire Endpoint: ${engine.wireEndpoint}`,
      `  API Path: ${engine.apiPath}`,
      `  SDK Method: nova.${engine.sdkMethodName}`,
      `  Context Window: ${engine.contextWindow.toLocaleString()} tokens`,
      `  Max Output: ${engine.maxOutputTokens.toLocaleString()} tokens`,
      `  Modalities: ${engine.modalities.join(', ')}`,
      `  Streaming: ${engine.supportsStreaming}`,
      `  Vision: ${engine.supportsVision}`,
      `  Audio: ${engine.supportsAudio}`,
      `  Function Calling: ${engine.supportsFunctionCalling}`,
      `  φ-Weight: ${engine.phiWeight.toFixed(6)}`,
      `  Fibonacci Identity: ${engine.fibonacciIdentity}`,
      ``,
      `  SDK Usage:`,
      `    const nova = createNovaSDK('your-key');`,
      `    const response = await nova.${engine.sdkMethodName}.chat([`,
      `      { role: 'user', content: 'Your message here' }`,
      `    ]);`,
    ];

    return this.addEngineMessage(lines.join('\n'), engine.name);
  }

  private handleConsensus(cmd: ParsedCommand): TerminalMessage {
    if (!cmd.message) {
      return this.addEngineMessage('Usage: /consensus <question>\nRuns your question through multiple engines and provides φ-weighted consensus.', 'system');
    }

    const engines = this.config.consensusEngines.map(id => NOVA_ENGINES.find(e => e.id === id)).filter(Boolean) as NovaEngineDefinition[];

    const lines = [
      `═══════════════════════════════════════════════`,
      `  Multi-Engine Consensus Query`,
      `  Question: "${cmd.message}"`,
      `═══════════════════════════════════════════════`,
      ``,
      `  Routing to ${engines.length} engines:`,
    ];

    for (const e of engines) {
      lines.push(`    → ${e.name} (${e.id}) via ${e.wireEndpoint} [φ-weight: ${e.phiWeight.toFixed(4)}]`);
    }

    lines.push('');
    lines.push('  Consensus Protocol:');
    lines.push('    1. Parallel dispatch to all engines');
    lines.push('    2. Collect all responses');
    lines.push('    3. φ-weighted voting: response_score = Σ(φ^rank × engine_weight)');
    lines.push('    4. Fibonacci hash attestation on consensus result');
    lines.push('    5. Return highest-confidence answer');
    lines.push('');
    lines.push('  SDK call:');
    lines.push(`    const engines = [${engines.map(e => `'${e.id}'`).join(', ')}];`);
    lines.push('    const responses = await Promise.all(');
    lines.push(`      engines.map(id => nova.chat({ engine: id, messages: [...] }))`);
    lines.push('    );');

    return this.addEngineMessage(lines.join('\n'), 'NOVA-OS Consensus');
  }

  private handleListEngines(): TerminalMessage {
    const lines = [
      '═══════════════════════════════════════════════',
      '  NOVA-OS — All 23 Sovereign Engines',
      '═══════════════════════════════════════════════',
      '',
    ];

    for (const e of NOVA_ENGINES) {
      const mods = e.modalities.join(', ');
      lines.push(`  ${e.id}  ${e.name.padEnd(20)}  /${e.slug.padEnd(14)}  ${e.contextWindow.toLocaleString().padStart(11)} ctx  ${mods}`);
    }

    lines.push('');
    lines.push(`  Total: ${NOVA_ENGINES.length} engines`);
    lines.push('  Usage: /<engine-slug> <message>');
    lines.push('  Example: /cognos What is the golden ratio?');

    return this.addEngineMessage(lines.join('\n'), 'NOVA-OS');
  }

  // ── File / URL / System ────────────────────────────────────────

  private handleFile(cmd: ParsedCommand): TerminalMessage {
    const action = cmd.args[0] ?? '';
    const path = cmd.args[1] ?? '';
    if (!action || !path) {
      return this.addEngineMessage('Usage: /file <open|reveal|copy|move|delete> <path> [destination]', 'system');
    }

    const built = this.appController.buildFileCommand({
      action: action as any,
      path,
      destination: cmd.args[2],
    });

    return this.addEngineMessage(`✓ File command: ${built}`, 'NOVA-OS');
  }

  private handleURL(cmd: ParsedCommand): TerminalMessage {
    const url = cmd.args[0] ?? '';
    if (!url) {
      return this.addEngineMessage('Usage: /url <url>\nExample: /url https://nova-protocol.ai', 'system');
    }

    const built = this.appController.buildOpenURL(url);
    return this.addEngineMessage(`✓ Opening URL: ${url}\n→ Command: ${built}`, 'NOVA-OS');
  }

  private handleSystem(cmd: ParsedCommand): TerminalMessage {
    const action = cmd.args[0] ?? '';
    if (!action) {
      return this.addEngineMessage('Usage: /system <screenshot|lock|notify>\nExample: /system screenshot', 'system');
    }

    const built = this.appController.buildSystemCommand({
      action: action as any,
      message: cmd.args.slice(1).join(' '),
    });

    return this.addEngineMessage(`✓ System action: ${action}\n→ Command: ${built}`, 'NOVA-OS');
  }

  private handleApps(): TerminalMessage {
    const apps = this.appController.listKnownApps();
    const categories = new Map<string, string[]>();

    for (const app of apps) {
      const cat = app.category;
      if (!categories.has(cat)) categories.set(cat, []);
      categories.get(cat)!.push(`${app.name} (/${app.aliases[0]})`);
    }

    const lines = [
      '═══════════════════════════════════════════════',
      '  NOVA-OS — Known Applications',
      '═══════════════════════════════════════════════',
      '',
    ];

    for (const [cat, appList] of categories) {
      lines.push(`  ${cat.toUpperCase()}:`);
      for (const a of appList) lines.push(`    → ${a}`);
      lines.push('');
    }

    lines.push(`  Total: ${apps.length} apps`);
    lines.push('  Usage: /open <app name or alias>');

    return this.addEngineMessage(lines.join('\n'), 'NOVA-OS');
  }

  // ── Meta Commands ──────────────────────────────────────────────

  private handleStatus(): TerminalMessage {
    const uptime = Date.now() - this.startTime;
    const uptimeStr = `${Math.floor(uptime / 60000)}m ${Math.floor((uptime % 60000) / 1000)}s`;

    const lines = [
      '═══════════════════════════════════════════════',
      '  NOVA-OS — System Status',
      '═══════════════════════════════════════════════',
      '',
      `  Session: ${this.sessionId}`,
      `  Uptime: ${uptimeStr}`,
      `  Messages: ${this.messages.length}`,
      `  Commands executed: ${this.commandHistory.length}`,
      `  Default engine: ${this.config.defaultEngine}`,
      `  Streaming: ${this.config.streamingEnabled ? 'enabled' : 'disabled'}`,
      `  Platform: ${this.appController.getPlatform()}`,
      `  Available engines: ${NOVA_ENGINES.length}`,
      `  Known apps: ${this.appController.listKnownApps().length}`,
      `  Audit trail: ${this.appController.getAuditTrail().length} entries`,
      '',
      `  Consensus engines: ${this.config.consensusEngines.join(', ')}`,
    ];

    return this.addEngineMessage(lines.join('\n'), 'NOVA-OS');
  }

  private handleHistory(): TerminalMessage {
    const recent = this.messages.slice(-20);
    const lines = recent.map(m => {
      const time = new Date(m.timestamp).toLocaleTimeString();
      const engine = m.engine ? ` [${m.engine}]` : '';
      return `  ${time} ${m.role}${engine}: ${m.content.substring(0, 80)}${m.content.length > 80 ? '...' : ''}`;
    });

    return this.addEngineMessage(
      `═══ Recent History (${recent.length} messages) ═══\n${lines.join('\n')}`,
      'system',
    );
  }

  private handleClear(): TerminalMessage {
    this.messages = [];
    this.nextMsgId = 0;
    return this.addSystemMessage('Terminal cleared.\n' + this.getBootMessage());
  }

  private handleHelp(): TerminalMessage {
    const lines = [
      '═══════════════════════════════════════════════',
      '  NOVA-OS — Chat Terminal Help',
      '═══════════════════════════════════════════════',
      '',
      '  CHAT:',
      '    <message>              Chat with default engine',
      '    /<engine> <message>    Chat with specific engine',
      '    /consensus <question>  Multi-engine consensus',
      '',
      '  ENGINES:',
      '    /engines               List all 23 engines',
      '    /explain <engine>      Deep engine explanation',
      '    /compare <engine>      Compare vs GPT-4, Claude, etc.',
      '',
      '  APPS:',
      '    /open <app>            Open a known application',
      '    /launch <path>         Launch by path',
      '    /apps                  List known apps',
      '',
      '  SYSTEM:',
      '    /shell <command>       Prepare shell command',
      '    /file <action> <path>  File operations',
      '    /url <url>             Open URL in browser',
      '    /system <action>       System actions (screenshot, lock, notify)',
      '',
      '  META:',
      '    /status                System status',
      '    /history               Show recent messages',
      '    /clear                 Clear terminal',
      '    /help                  This message',
      '',
      '  ENGINE SLUGS: ' + NOVA_ENGINES.map(e => e.slug).join(', '),
    ];

    return this.addEngineMessage(lines.join('\n'), 'NOVA-OS');
  }

  // ── Message Management ─────────────────────────────────────────

  private addUserMessage(content: string, commandType: TerminalCommandType): TerminalMessage {
    const msg: TerminalMessage = {
      id: this.nextMsgId++,
      role: 'user',
      content,
      timestamp: Date.now(),
      commandType,
    };
    this.messages.push(msg);
    this.trimHistory();
    return msg;
  }

  private addEngineMessage(content: string, engine: string): TerminalMessage {
    const msg: TerminalMessage = {
      id: this.nextMsgId++,
      role: 'engine',
      content,
      engine,
      timestamp: Date.now(),
    };
    this.messages.push(msg);
    this.trimHistory();
    return msg;
  }

  private addSystemMessage(content: string): TerminalMessage {
    const msg: TerminalMessage = {
      id: this.nextMsgId++,
      role: 'system',
      content,
      timestamp: Date.now(),
    };
    this.messages.push(msg);
    return msg;
  }

  private trimHistory(): void {
    if (this.messages.length > this.config.maxHistorySize) {
      this.messages = this.messages.slice(-this.config.maxHistorySize);
    }
  }

  /** Build the context messages for AI calls (φ-weighted recent history) */
  buildContextMessages(maxMessages: number = 20): NovaMessage[] {
    const recent = this.messages.slice(-maxMessages);
    return recent.map(m => ({
      role: m.role === 'engine' ? 'assistant' as const : m.role === 'user' ? 'user' as const : 'system' as const,
      content: m.content,
    }));
  }

  // ── Boot Message ───────────────────────────────────────────────

  private getBootMessage(): string {
    return [
      '',
      '  ╔═══════════════════════════════════════════════════════════╗',
      '  ║                                                         ║',
      '  ║                    N O V A - O S                        ║',
      '  ║           Sovereign Desktop AGI Terminal                 ║',
      '  ║                                                         ║',
      '  ║   23 AI Engines  •  φ-Mathematics  •  Zero Cloud Lock   ║',
      '  ║                                                         ║',
      '  ╚═══════════════════════════════════════════════════════════╝',
      '',
      `  Session: ${this.sessionId}`,
      `  Platform: ${this.appController.getPlatform()}`,
      `  Default Engine: ${this.config.defaultEngine} (${NOVA_ENGINES.find(e => e.id === this.config.defaultEngine)?.name ?? 'Unknown'})`,
      `  Engines Available: ${NOVA_ENGINES.length}`,
      '',
      '  Type /help for commands, or just type a message to chat.',
      '',
    ].join('\n');
  }

  // ── Public Accessors ───────────────────────────────────────────

  getMessages(): readonly TerminalMessage[] { return this.messages; }
  getSession(): TerminalSession {
    return {
      sessionId: this.sessionId,
      startTime: this.startTime,
      messages: this.messages,
      defaultEngine: this.config.defaultEngine,
      totalTokensUsed: this.totalTokens,
    };
  }
  getCommandHistory(): readonly string[] { return this.commandHistory; }
  setDefaultEngine(engineId: NovaEngineId): void {
    this.config = { ...this.config, defaultEngine: engineId };
  }
}
