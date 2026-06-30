///
/// NOVA CONTENT SCRIPT — Injects Nova AI Into Any Web Page
///
/// This content script runs on every page and provides:
///   1. Nova AI sidebar overlay (toggleable)
///   2. Text selection → AI action menu
///   3. Page context extraction for AI analysis
///   4. Message bridge to background worker
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  type NovaExtensionMessage,
  type NovaMessageType,
  createMessage,
  sendMessage,
  onMessage,
} from './NovaExtensionRuntime.js';

// ══════════════════════════════════════════════════════════════════
//  SIDEBAR INJECTION
// ══════════════════════════════════════════════════════════════════

export interface NovaSidebarConfig {
  readonly position: 'left' | 'right';
  readonly width: number;
  readonly extensionId: string;
  readonly extensionName: string;
  readonly theme: 'light' | 'dark' | 'auto';
}

const SIDEBAR_ID = 'nova-ai-sidebar';
const ACTION_MENU_ID = 'nova-action-menu';

export class NovaContentScript {
  private sidebarVisible = false;
  private config: NovaSidebarConfig;
  private sidebarEl: HTMLElement | null = null;
  private actionMenuEl: HTMLElement | null = null;

  constructor(config: NovaSidebarConfig) {
    this.config = config;
  }

  /** Initialize the content script — call once when injected */
  init(): void {
    this.injectStyles();
    this.createSidebar();
    this.setupSelectionListener();
    this.setupMessageListener();
    this.setupKeyboardShortcuts();
  }

  // ── Sidebar ────────────────────────────────────────────────────

  private createSidebar(): void {
    if (document.getElementById(SIDEBAR_ID)) return;

    const sidebar = document.createElement('div');
    sidebar.id = SIDEBAR_ID;
    sidebar.setAttribute('data-nova-extension', this.config.extensionId);
    sidebar.innerHTML = `
      <div class="nova-sidebar-header">
        <span class="nova-sidebar-title">${this.escapeHtml(this.config.extensionName)}</span>
        <button class="nova-sidebar-close" aria-label="Close sidebar">&times;</button>
      </div>
      <div class="nova-sidebar-content">
        <div class="nova-chat-container" id="nova-chat-messages"></div>
        <div class="nova-input-container">
          <textarea id="nova-chat-input" placeholder="Ask ${this.escapeHtml(this.config.extensionName)}..." rows="3"></textarea>
          <button id="nova-chat-send" aria-label="Send message">&#9654;</button>
        </div>
      </div>
    `;

    sidebar.style.display = 'none';
    document.body.appendChild(sidebar);
    this.sidebarEl = sidebar;

    // Wire events
    const closeBtn = sidebar.querySelector('.nova-sidebar-close');
    closeBtn?.addEventListener('click', () => this.toggleSidebar());

    const sendBtn = sidebar.querySelector('#nova-chat-send');
    const input = sidebar.querySelector('#nova-chat-input') as HTMLTextAreaElement | null;

    sendBtn?.addEventListener('click', () => this.sendChatMessage(input));
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendChatMessage(input);
      }
    });
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
    if (this.sidebarEl) {
      this.sidebarEl.style.display = this.sidebarVisible ? 'flex' : 'none';
    }
  }

  private async sendChatMessage(input: HTMLTextAreaElement | null): Promise<void> {
    if (!input || !input.value.trim()) return;

    const text = input.value.trim();
    input.value = '';

    // Add user message to chat
    this.appendChatMessage('user', text);

    // Send to background worker
    const response = await sendMessage(createMessage('NOVA_CHAT_REQUEST', {
      messages: [{ role: 'user', content: text }],
      pageContext: this.extractPageContext(),
    }, {
      extensionId: this.config.extensionId,
    }));

    // Show response
    if (response && typeof response === 'object') {
      const res = response as Record<string, unknown>;
      this.appendChatMessage('assistant', (res['content'] as string) ?? 'No response');
    }
  }

  private appendChatMessage(role: 'user' | 'assistant', content: string): void {
    const container = document.getElementById('nova-chat-messages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = `nova-chat-msg nova-chat-${role}`;
    msg.textContent = content;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  // ── Selection Action Menu ──────────────────────────────────────

  private setupSelectionListener(): void {
    document.addEventListener('mouseup', () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        this.showActionMenu(text);
      } else {
        this.hideActionMenu();
      }
    });
  }

  private showActionMenu(selectedText: string): void {
    this.hideActionMenu();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const menu = document.createElement('div');
    menu.id = ACTION_MENU_ID;
    menu.setAttribute('data-nova-extension', this.config.extensionId);
    menu.innerHTML = `
      <button class="nova-action-btn" data-action="explain">&#128161; Explain</button>
      <button class="nova-action-btn" data-action="summarize">&#128196; Summarize</button>
      <button class="nova-action-btn" data-action="translate">&#127760; Translate</button>
      <button class="nova-action-btn" data-action="code">&#128187; Code</button>
      <button class="nova-action-btn" data-action="factcheck">&#9989; Fact Check</button>
    `;

    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 8}px`;
    menu.style.left = `${rect.left}px`;
    menu.style.zIndex = '2147483647';

    document.body.appendChild(menu);
    this.actionMenuEl = menu;

    // Wire action buttons
    menu.querySelectorAll('.nova-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = (e.target as HTMLElement).getAttribute('data-action') ?? 'explain';
        this.executeAction(action, selectedText);
        this.hideActionMenu();
      });
    });
  }

  private hideActionMenu(): void {
    if (this.actionMenuEl) {
      this.actionMenuEl.remove();
      this.actionMenuEl = null;
    }
  }

  private async executeAction(action: string, text: string): Promise<void> {
    const prompts: Record<string, string> = {
      explain: `Explain this clearly:\n\n${text}`,
      summarize: `Summarize this concisely:\n\n${text}`,
      translate: `Translate this to English (or detect language and translate):\n\n${text}`,
      code: `Analyze this code, explain what it does, and suggest improvements:\n\n${text}`,
      factcheck: `Fact-check this claim. Is it true or false? Provide sources:\n\n${text}`,
    };

    const prompt = prompts[action] ?? `${action}:\n\n${text}`;

    // Show sidebar and send
    if (!this.sidebarVisible) this.toggleSidebar();
    this.appendChatMessage('user', prompt);

    const response = await sendMessage(createMessage('NOVA_CHAT_REQUEST', {
      messages: [{ role: 'user', content: prompt }],
      action,
      selectedText: text,
      pageContext: this.extractPageContext(),
    }, {
      extensionId: this.config.extensionId,
    }));

    if (response && typeof response === 'object') {
      const res = response as Record<string, unknown>;
      this.appendChatMessage('assistant', (res['content'] as string) ?? 'No response');
    }
  }

  // ── Page Context Extraction ────────────────────────────────────

  extractPageContext(): Record<string, unknown> {
    return {
      url: window.location.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
      textLength: document.body?.innerText?.length ?? 0,
      language: document.documentElement?.lang ?? 'en',
    };
  }

  // ── Keyboard Shortcuts ─────────────────────────────────────────

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Alt+N = toggle sidebar
      if (e.altKey && e.key === 'n') {
        e.preventDefault();
        this.toggleSidebar();
      }
    });
  }

  // ── Message Listener ───────────────────────────────────────────

  private setupMessageListener(): void {
    onMessage((msg, sendResponse) => {
      switch (msg.type) {
        case 'NOVA_CHAT_RESPONSE':
          this.appendChatMessage('assistant', (msg.payload['content'] as string) ?? '');
          sendResponse({ received: true });
          return true;

        case 'NOVA_ENGINE_STATUS':
          sendResponse({ extensionId: this.config.extensionId, sidebarOpen: this.sidebarVisible });
          return true;

        default:
          return false;
      }
    });
  }

  // ── Styles ─────────────────────────────────────────────────────

  private injectStyles(): void {
    if (document.getElementById('nova-sidebar-styles')) return;

    const style = document.createElement('style');
    style.id = 'nova-sidebar-styles';
    style.textContent = `
      #${SIDEBAR_ID} {
        position: fixed;
        top: 0;
        ${this.config.position}: 0;
        width: ${this.config.width}px;
        height: 100vh;
        background: ${this.config.theme === 'dark' ? '#1a1a2e' : '#ffffff'};
        color: ${this.config.theme === 'dark' ? '#e0e0e0' : '#1a1a2e'};
        border-${this.config.position === 'right' ? 'left' : 'right'}: 2px solid #c9a84c;
        display: flex;
        flex-direction: column;
        z-index: 2147483646;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        font-size: 14px;
        box-shadow: ${this.config.position === 'right' ? '-4px' : '4px'} 0 20px rgba(0,0,0,0.15);
        transition: transform 0.2s ease;
      }
      .nova-sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, #c9a84c 0%, #8b6914 100%);
        color: white;
        font-weight: 600;
      }
      .nova-sidebar-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0 4px;
      }
      .nova-sidebar-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .nova-chat-container {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
      }
      .nova-chat-msg {
        margin-bottom: 12px;
        padding: 10px 14px;
        border-radius: 12px;
        line-height: 1.5;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .nova-chat-user {
        background: ${this.config.theme === 'dark' ? '#2d2d44' : '#f0f0f5'};
        margin-left: 24px;
        border-bottom-right-radius: 4px;
      }
      .nova-chat-assistant {
        background: ${this.config.theme === 'dark' ? '#1e3a2f' : '#e8f5e9'};
        margin-right: 24px;
        border-bottom-left-radius: 4px;
        border-left: 3px solid #c9a84c;
      }
      .nova-input-container {
        display: flex;
        gap: 8px;
        padding: 12px;
        border-top: 1px solid ${this.config.theme === 'dark' ? '#333' : '#e0e0e0'};
      }
      #nova-chat-input {
        flex: 1;
        resize: none;
        border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ccc'};
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 14px;
        font-family: inherit;
        background: ${this.config.theme === 'dark' ? '#2d2d44' : '#fff'};
        color: inherit;
      }
      #nova-chat-send {
        background: linear-gradient(135deg, #c9a84c 0%, #8b6914 100%);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 16px;
      }
      #${ACTION_MENU_ID} {
        display: flex;
        gap: 4px;
        background: ${this.config.theme === 'dark' ? '#1a1a2e' : '#fff'};
        border: 1px solid #c9a84c;
        border-radius: 8px;
        padding: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .nova-action-btn {
        background: none;
        border: 1px solid ${this.config.theme === 'dark' ? '#444' : '#ddd'};
        border-radius: 6px;
        padding: 6px 10px;
        cursor: pointer;
        font-size: 12px;
        color: inherit;
        white-space: nowrap;
      }
      .nova-action-btn:hover {
        background: ${this.config.theme === 'dark' ? '#2d2d44' : '#f5f5f5'};
        border-color: #c9a84c;
      }
    `;

    document.head.appendChild(style);
  }

  // ── HTML escaping ──────────────────────────────────────────────

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
