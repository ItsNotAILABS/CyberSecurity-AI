///
/// NOVA POPUP CONTROLLER — Extension Popup UI Controller
///
/// Controls the popup that appears when clicking the extension icon.
/// Provides:
///   1. Engine selection and status display
///   2. Quick actions (chat, search, code, image)
///   3. Extension activation/deactivation toggles
///   4. Settings (API key, sovereign mode, theme)
///   5. Engine status dashboard
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  type NovaExtensionMessage,
  createMessage,
  sendMessage,
  loadConfig,
  saveConfig,
  type NovaStorageConfig,
} from './NovaExtensionRuntime.js';

import { NOVA_ENGINES, type NovaEngineDefinition } from '../sdk/NovaEngineModels.js';
import { AIExtensionRegistry, type AIExtension } from '../extensions/AIExtensionRegistry.js';

// ══════════════════════════════════════════════════════════════════
//  POPUP STATE
// ══════════════════════════════════════════════════════════════════

export type PopupTab = 'chat' | 'engines' | 'extensions' | 'settings';

export interface PopupState {
  currentTab: PopupTab;
  selectedEngine: string;
  config: NovaStorageConfig;
  extensionStatuses: Map<string, boolean>;
}

// ══════════════════════════════════════════════════════════════════
//  POPUP CONTROLLER
// ══════════════════════════════════════════════════════════════════

export class NovaPopupController {
  private state: PopupState;
  private readonly registry: AIExtensionRegistry;

  constructor() {
    this.registry = new AIExtensionRegistry();
    this.state = {
      currentTab: 'chat',
      selectedEngine: 'NOV-001',
      config: {},
      extensionStatuses: new Map(),
    };
  }

  /** Initialize the popup — call on popup open */
  async init(): Promise<void> {
    this.state.config = await loadConfig();
  }

  // ── Tab Navigation ─────────────────────────────────────────────

  switchTab(tab: PopupTab): void {
    this.state.currentTab = tab;
  }

  getCurrentTab(): PopupTab {
    return this.state.currentTab;
  }

  // ── Engine Selection ───────────────────────────────────────────

  selectEngine(engineId: string): void {
    this.state.selectedEngine = engineId;
  }

  getSelectedEngine(): NovaEngineDefinition | undefined {
    return NOVA_ENGINES.find(e => e.id === this.state.selectedEngine);
  }

  getEngineList(): readonly NovaEngineDefinition[] {
    return NOVA_ENGINES;
  }

  getEnginesByCategory(): Record<string, NovaEngineDefinition[]> {
    const categories: Record<string, NovaEngineDefinition[]> = {
      'Reasoning': [],
      'Creative': [],
      'Analysis': [],
      'Code': [],
      'Safety': [],
      'Utility': [],
    };

    for (const engine of NOVA_ENGINES) {
      if (['cognos', 'profundis', 'fusio', 'lingua', 'stratos', 'empathos'].includes(engine.slug)) {
        categories['Reasoning'].push(engine);
      } else if (['pictor', 'kinema', 'harmonia', 'vox'].includes(engine.slug)) {
        categories['Creative'].push(engine);
      } else if (['scrutator', 'socialis', 'analytica', 'visio', 'segmentum'].includes(engine.slug)) {
        categories['Analysis'].push(engine);
      } else if (['codex', 'algorithmus', 'formalis'].includes(engine.slug)) {
        categories['Code'].push(engine);
      } else if (['custodis'].includes(engine.slug)) {
        categories['Safety'].push(engine);
      } else {
        categories['Utility'].push(engine);
      }
    }

    return categories;
  }

  // ── Extension Management ───────────────────────────────────────

  getExtensions(): readonly AIExtension[] {
    return this.registry.extensions;
  }

  async activateExtension(extensionId: string): Promise<unknown> {
    const response = await sendMessage(createMessage('NOVA_ACTIVATE_EXTENSION', {
      extensionId,
    }));
    this.state.extensionStatuses.set(extensionId, true);
    return response;
  }

  async deactivateExtension(extensionId: string): Promise<unknown> {
    const response = await sendMessage(createMessage('NOVA_DEACTIVATE_EXTENSION', {
      extensionId,
    }));
    this.state.extensionStatuses.set(extensionId, false);
    return response;
  }

  isExtensionActive(extensionId: string): boolean {
    return this.state.extensionStatuses.get(extensionId) ?? false;
  }

  // ── Quick Actions ──────────────────────────────────────────────

  async quickChat(message: string): Promise<unknown> {
    return sendMessage(createMessage('NOVA_CHAT_REQUEST', {
      messages: [{ role: 'user', content: message }],
    }, {
      engineId: this.state.selectedEngine,
    }));
  }

  async quickSearch(query: string): Promise<unknown> {
    return sendMessage(createMessage('NOVA_SEARCH', { query }));
  }

  async quickCode(prompt: string, language?: string): Promise<unknown> {
    return sendMessage(createMessage('NOVA_GENERATE_CODE', { prompt, language }));
  }

  async quickImage(prompt: string): Promise<unknown> {
    return sendMessage(createMessage('NOVA_GENERATE_IMAGE', { prompt }));
  }

  async quickSafetyCheck(content: string): Promise<unknown> {
    return sendMessage(createMessage('NOVA_SAFETY_CHECK', { content }));
  }

  // ── Settings ───────────────────────────────────────────────────

  async setApiKey(apiKey: string): Promise<void> {
    this.state.config = { ...this.state.config, apiKey };
    await saveConfig(this.state.config);
    await sendMessage(createMessage('NOVA_SET_CONFIG', { apiKey }));
  }

  async setBaseUrl(baseUrl: string): Promise<void> {
    this.state.config = { ...this.state.config, baseUrl };
    await saveConfig(this.state.config);
    await sendMessage(createMessage('NOVA_SET_CONFIG', { baseUrl }));
  }

  async setSovereignMode(enabled: boolean): Promise<void> {
    this.state.config = { ...this.state.config, sovereignMode: enabled };
    await saveConfig(this.state.config);
    await sendMessage(createMessage('NOVA_SET_CONFIG', { sovereignMode: enabled }));
  }

  async setTheme(theme: 'light' | 'dark' | 'auto'): Promise<void> {
    this.state.config = { ...this.state.config, theme };
    await saveConfig(this.state.config);
  }

  getConfig(): NovaStorageConfig {
    return this.state.config;
  }

  // ── Status Dashboard ───────────────────────────────────────────

  async getEngineStatus(): Promise<unknown> {
    return sendMessage(createMessage('NOVA_ENGINE_STATUS', {}));
  }

  /** Generate a status summary for the popup dashboard */
  getDashboard() {
    return {
      totalEngines: NOVA_ENGINES.length,
      totalExtensions: this.registry.totalExtensions,
      selectedEngine: this.getSelectedEngine(),
      activeExtensions: Array.from(this.state.extensionStatuses.entries())
        .filter(([, active]) => active)
        .map(([id]) => id),
      sovereignMode: this.state.config.sovereignMode ?? false,
      hasApiKey: !!this.state.config.apiKey,
    };
  }
}
