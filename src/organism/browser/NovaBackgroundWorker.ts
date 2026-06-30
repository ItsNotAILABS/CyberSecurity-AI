///
/// NOVA BACKGROUND WORKER — Service Worker for Extension Lifecycle
///
/// This is the MV3 background service worker. It:
///   1. Routes messages between content script and popup
///   2. Dispatches AI calls to Nova engines via the SDK
///   3. Manages extension activation/deactivation
///   4. Handles streaming responses
///   5. Manages engine state and configuration
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  type NovaExtensionMessage,
  type NovaStorageConfig,
  createMessage,
  onMessage,
  sendToTab,
  loadConfig,
  saveConfig,
  setBadge,
} from './NovaExtensionRuntime.js';

import { NovaAPIClient, type NovaAPIConfig } from '../sdk/NovaAPIClient.js';
import { NOVA_ENGINES } from '../sdk/NovaEngineModels.js';
import {
  AIExtensionEngine,
  type ExtensionEngineStatus,
} from '../extensions/AIExtensionEngine.js';

// ══════════════════════════════════════════════════════════════════
//  BACKGROUND WORKER STATE
// ══════════════════════════════════════════════════════════════════

export class NovaBackgroundWorker {
  private client: NovaAPIClient | null = null;
  private extensionEngine: AIExtensionEngine;
  private config: NovaStorageConfig = {};
  private activeTabId: number | null = null;

  constructor() {
    this.extensionEngine = new AIExtensionEngine();
  }

  /** Initialize the background worker — call once on service worker start */
  async init(): Promise<void> {
    this.config = await loadConfig();

    if (this.config.apiKey) {
      this.initClient(this.config.apiKey);
    }

    // Activate any previously-active extensions
    if (this.config.activeExtensions) {
      for (const extId of this.config.activeExtensions) {
        try {
          this.extensionEngine.activate(extId);
        } catch {
          // extension may not exist
        }
      }
    }

    this.setupMessageHandler();
    this.updateBadge();
  }

  private initClient(apiKey: string): void {
    const clientConfig: NovaAPIConfig = {
      apiKey,
      baseUrl: this.config.baseUrl,
      sovereignMode: this.config.sovereignMode,
    };
    this.client = new NovaAPIClient(clientConfig);
  }

  // ══════════════════════════════════════════════════════════════════
  //  MESSAGE HANDLER — Routes all messages from content/popup
  // ══════════════════════════════════════════════════════════════════

  private setupMessageHandler(): void {
    onMessage((msg, sendResponse) => {
      // Handle async responses
      this.handleMessage(msg).then(
        (response) => sendResponse(response),
        (error) => sendResponse({
          error: error instanceof Error ? error.message : String(error),
        }),
      );
      return true; // indicates async response
    });
  }

  private async handleMessage(msg: NovaExtensionMessage): Promise<unknown> {
    switch (msg.type) {
      case 'NOVA_CHAT_REQUEST':
        return this.handleChatRequest(msg);

      case 'NOVA_GENERATE_IMAGE':
        return this.handleImageRequest(msg);

      case 'NOVA_GENERATE_CODE':
        return this.handleCodeRequest(msg);

      case 'NOVA_SEARCH':
        return this.handleSearchRequest(msg);

      case 'NOVA_SAFETY_CHECK':
        return this.handleSafetyRequest(msg);

      case 'NOVA_EMBED':
        return this.handleEmbedRequest(msg);

      case 'NOVA_ACTIVATE_EXTENSION':
        return this.handleActivateExtension(msg);

      case 'NOVA_DEACTIVATE_EXTENSION':
        return this.handleDeactivateExtension(msg);

      case 'NOVA_GET_ENGINES':
        return this.handleGetEngines();

      case 'NOVA_GET_CONFIG':
        return this.config;

      case 'NOVA_SET_CONFIG':
        return this.handleSetConfig(msg);

      case 'NOVA_ENGINE_STATUS':
        return this.extensionEngine.status();

      default:
        return { error: `Unknown message type: ${msg.type}` };
    }
  }

  // ── Chat ───────────────────────────────────────────────────────

  private async handleChatRequest(msg: NovaExtensionMessage): Promise<unknown> {
    if (!this.client) return { error: 'API key not configured. Set your Nova API key in extension settings.' };

    const messages = msg.payload['messages'] as Array<{ role: 'user' | 'system' | 'assistant'; content: string }>;
    const engineId = msg.engineId ?? 'NOV-001'; // default to Nova Cognos

    // Select best engine based on the extension
    let selectedEngine = engineId;
    if (msg.extensionId) {
      const binding = this.extensionEngine.selectEngine(
        msg.extensionId,
        messages.map(m => m.content.split(' ')).flat().slice(0, 10),
      );
      if (binding) {
        selectedEngine = binding.modelFamilyId;
      }
    }

    try {
      const response = await this.client.chat({
        engine: selectedEngine as any,
        messages,
      });
      return {
        content: response.content,
        engine: response.engine,
        engineName: response.engineName,
        attestation: response.attestation,
        usage: response.usage,
      };
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  // ── Image ──────────────────────────────────────────────────────

  private async handleImageRequest(msg: NovaExtensionMessage): Promise<unknown> {
    if (!this.client) return { error: 'API key not configured' };

    try {
      const response = await this.client.pictor.generate(
        msg.payload['prompt'] as string,
        msg.payload as any,
      );
      return response;
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  // ── Code ───────────────────────────────────────────────────────

  private async handleCodeRequest(msg: NovaExtensionMessage): Promise<unknown> {
    if (!this.client) return { error: 'API key not configured' };

    try {
      const response = await this.client.codex.generate(
        msg.payload['prompt'] as string,
        msg.payload['language'] as string,
      );
      return response;
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  // ── Search ─────────────────────────────────────────────────────

  private async handleSearchRequest(msg: NovaExtensionMessage): Promise<unknown> {
    if (!this.client) return { error: 'API key not configured' };

    try {
      return await this.client.scrutator.search(
        msg.payload['query'] as string,
        msg.payload['maxResults'] as number,
      );
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  // ── Safety ─────────────────────────────────────────────────────

  private async handleSafetyRequest(msg: NovaExtensionMessage): Promise<unknown> {
    if (!this.client) return { error: 'API key not configured' };

    try {
      return await this.client.custodis.check(
        msg.payload['content'] as string,
        msg.payload['categories'] as string[],
      );
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  // ── Embed ──────────────────────────────────────────────────────

  private async handleEmbedRequest(msg: NovaExtensionMessage): Promise<unknown> {
    if (!this.client) return { error: 'API key not configured' };

    try {
      return await this.client.vector.embed(
        msg.payload['input'] as string | string[],
        msg.payload['dimensions'] as number,
      );
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  // ── Extension Activation ───────────────────────────────────────

  private handleActivateExtension(msg: NovaExtensionMessage): unknown {
    const extId = msg.payload['extensionId'] as string;
    if (!extId) return { error: 'No extensionId provided' };

    try {
      const activation = this.extensionEngine.activate(extId);
      this.updateBadge();
      return activation;
    } catch (err) {
      return { error: err instanceof Error ? err.message : String(err) };
    }
  }

  private handleDeactivateExtension(msg: NovaExtensionMessage): unknown {
    const extId = msg.payload['extensionId'] as string;
    if (!extId) return { error: 'No extensionId provided' };

    this.extensionEngine.deactivate(extId);
    this.updateBadge();
    return { deactivated: extId };
  }

  // ── Engine List ────────────────────────────────────────────────

  private handleGetEngines(): unknown {
    return {
      engines: NOVA_ENGINES.map(e => ({
        id: e.id,
        name: e.name,
        slug: e.slug,
        description: e.description,
        modalities: e.modalities,
        supportsStreaming: e.supportsStreaming,
        supportsVision: e.supportsVision,
      })),
      total: NOVA_ENGINES.length,
    };
  }

  // ── Config ─────────────────────────────────────────────────────

  private async handleSetConfig(msg: NovaExtensionMessage): Promise<unknown> {
    const newConfig = msg.payload as Partial<NovaStorageConfig>;
    this.config = { ...this.config, ...newConfig };
    await saveConfig(this.config);

    if (newConfig.apiKey) {
      this.initClient(newConfig.apiKey);
    }

    return { saved: true, config: this.config };
  }

  // ── Badge ──────────────────────────────────────────────────────

  private updateBadge(): void {
    const status = this.extensionEngine.status();
    if (status.activeExtensions > 0) {
      setBadge(`${status.activeExtensions}`, '#c9a84c');
    } else {
      setBadge('', '#c9a84c');
    }
  }
}
