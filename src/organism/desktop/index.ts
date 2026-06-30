///
/// DESKTOP INDEX — NOVA-OS Desktop AGI Barrel Exports
///
/// The sovereign desktop operating system, all in one import.
///
/// Quick start:
///   import { createDesktopAGI } from './desktop/index.js';
///   const agi = createDesktopAGI();
///   console.log(agi.chat('Hello, who are you?'));
///   console.log(agi.open('chrome'));
///   console.log(agi.code('fibonacci in TypeScript'));
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// The OS kernel
export { NovaOS, NOVA_OS_IDENTITY, createNovaOS } from './NovaOS.js';

// The AGI orchestrator
export { NovaDesktopAGI, createDesktopAGI } from './NovaDesktopAGI.js';

// Chat terminal
export { NovaChatTerminal } from './NovaChatTerminal.js';

// App controller
export { NovaAppController } from './NovaAppController.js';

// Engine comparison
export { NovaEngineComparison, EXTERNAL_MODELS } from './NovaEngineComparison.js';

// Types
export type {
  NovaOSState,
  NovaOSService,
} from './NovaOS.js';

export type {
  AGIIntent,
  AGIIntentResult,
  AGIResponse,
} from './NovaDesktopAGI.js';

export type {
  TerminalCommandType,
  ParsedCommand,
  TerminalMessage,
  TerminalSession,
  TerminalConfig,
} from './NovaChatTerminal.js';

export type {
  AppPlatform,
  AppLaunchRequest,
  AppLaunchResult,
  RunningProcess,
  ShellCommand,
  ShellResult,
  FileAction,
  FileActionResult,
  SystemAction,
  SystemActionResult,
  AppAuditEntry,
} from './NovaAppController.js';

export type {
  ExternalModelProfile,
  EngineComparison,
  EngineComparisonMatrix,
  FullComparisonReport,
  ComparisonSummary,
} from './NovaEngineComparison.js';

// Mini-AIs — Embedded chat intelligence helpers
export { MiniAIEngine, createMiniAIEngine, MINI_AIS } from './NovaChatMiniAIs.js';

export type {
  MiniAIId,
  MiniAIDefinition,
  MiniAICommand,
  MiniAIResponse,
} from './NovaChatMiniAIs.js';
