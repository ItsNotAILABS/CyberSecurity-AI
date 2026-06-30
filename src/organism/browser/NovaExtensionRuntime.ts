///
/// NOVA EXTENSION RUNTIME — Cross-Browser Extension Runtime (MV3)
///
/// This is the bridge between Nova's 23 sovereign engines and the
/// browser extension environment. It works in:
///   - Microsoft Edge (primary target)
///   - Google Chrome
///   - Mozilla Firefox
///   - Safari (WebExtension API)
///
/// The runtime handles:
///   1. Browser API abstraction (chrome.* / browser.*)
///   2. Message passing between content script ↔ background worker ↔ popup
///   3. Engine dispatch via nova-wire protocol
///   4. Extension state management
///   5. Permission handling
///   6. Cross-browser storage
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// ══════════════════════════════════════════════════════════════════
//  CROSS-BROWSER API ABSTRACTION
// ══════════════════════════════════════════════════════════════════

type BrowserAPI = typeof globalThis & {
  chrome?: {
    runtime?: {
      sendMessage: (msg: unknown, cb?: (response: unknown) => void) => void;
      onMessage: {
        addListener: (cb: (msg: unknown, sender: unknown, sendResponse: (response: unknown) => void) => boolean | void) => void;
      };
      getURL: (path: string) => string;
      id?: string;
    };
    storage?: {
      local: {
        get: (keys: string | string[], cb: (result: Record<string, unknown>) => void) => void;
        set: (items: Record<string, unknown>, cb?: () => void) => void;
        remove: (keys: string | string[], cb?: () => void) => void;
      };
      sync: {
        get: (keys: string | string[], cb: (result: Record<string, unknown>) => void) => void;
        set: (items: Record<string, unknown>, cb?: () => void) => void;
      };
    };
    tabs?: {
      query: (queryInfo: Record<string, unknown>, cb: (tabs: unknown[]) => void) => void;
      sendMessage: (tabId: number, msg: unknown, cb?: (response: unknown) => void) => void;
    };
    action?: {
      setIcon: (details: Record<string, unknown>) => void;
      setBadgeText: (details: Record<string, unknown>) => void;
      setBadgeBackgroundColor: (details: Record<string, unknown>) => void;
    };
    sidePanel?: {
      open: (options?: Record<string, unknown>) => Promise<void>;
      setOptions: (options: Record<string, unknown>) => Promise<void>;
    };
  };
  browser?: Record<string, unknown>;
};

export type BrowserType = 'edge' | 'chrome' | 'firefox' | 'safari' | 'unknown';

export function detectBrowser(): BrowserType {
  const g = globalThis as BrowserAPI;

  if (typeof g.chrome !== 'undefined' && g.chrome.runtime?.id) {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (ua.includes('Edg/')) return 'edge';
    if (ua.includes('Chrome/')) return 'chrome';
    return 'chrome';
  }
  if (typeof g.browser !== 'undefined') {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    if (ua.includes('Firefox/')) return 'firefox';
    if (ua.includes('Safari/')) return 'safari';
    return 'firefox';
  }
  return 'unknown';
}

function getBrowserAPI(): BrowserAPI['chrome'] | undefined {
  const g = globalThis as BrowserAPI;
  return g.chrome;
}

// ══════════════════════════════════════════════════════════════════
//  MESSAGE PROTOCOL — Content ↔ Background ↔ Popup
// ══════════════════════════════════════════════════════════════════

export type NovaMessageType =
  | 'NOVA_CHAT_REQUEST'
  | 'NOVA_CHAT_RESPONSE'
  | 'NOVA_STREAM_CHUNK'
  | 'NOVA_STREAM_END'
  | 'NOVA_ENGINE_STATUS'
  | 'NOVA_ACTIVATE_EXTENSION'
  | 'NOVA_DEACTIVATE_EXTENSION'
  | 'NOVA_GET_ENGINES'
  | 'NOVA_GET_CONFIG'
  | 'NOVA_SET_CONFIG'
  | 'NOVA_GENERATE_IMAGE'
  | 'NOVA_GENERATE_CODE'
  | 'NOVA_SEARCH'
  | 'NOVA_SAFETY_CHECK'
  | 'NOVA_EMBED'
  | 'NOVA_ERROR';

export interface NovaExtensionMessage {
  readonly type: NovaMessageType;
  readonly extensionId?: string;
  readonly engineId?: string;
  readonly payload: Record<string, unknown>;
  readonly requestId: string;
  readonly timestamp: number;
}

export function createMessage(
  type: NovaMessageType,
  payload: Record<string, unknown>,
  options?: { extensionId?: string; engineId?: string },
): NovaExtensionMessage {
  return {
    type,
    extensionId: options?.extensionId,
    engineId: options?.engineId,
    payload,
    requestId: `msg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`,
    timestamp: Date.now(),
  };
}

// ══════════════════════════════════════════════════════════════════
//  STORAGE — Cross-browser storage abstraction
// ══════════════════════════════════════════════════════════════════

export interface NovaStorageConfig {
  readonly apiKey?: string;
  readonly baseUrl?: string;
  readonly sovereignMode?: boolean;
  readonly activeExtensions?: readonly string[];
  readonly theme?: 'light' | 'dark' | 'auto';
  readonly sidebarPosition?: 'left' | 'right';
  readonly sidebarWidth?: number;
}

const STORAGE_KEY = 'nova-protocol-config';

export async function loadConfig(): Promise<NovaStorageConfig> {
  const api = getBrowserAPI();
  if (!api?.storage) {
    // Fallback to localStorage for non-extension contexts
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) as NovaStorageConfig : {};
    } catch {
      return {};
    }
  }

  return new Promise((resolve) => {
    const storage = api.storage!;
    storage.local.get([STORAGE_KEY], (result) => {
      resolve((result[STORAGE_KEY] as NovaStorageConfig) ?? {});
    });
  });
}

export async function saveConfig(config: Partial<NovaStorageConfig>): Promise<void> {
  const current = await loadConfig();
  const merged = { ...current, ...config };

  const api = getBrowserAPI();
  if (!api?.storage) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // silent fail in non-browser environments
    }
    return;
  }

  return new Promise((resolve) => {
    const storage = api.storage!;
    storage.local.set({ [STORAGE_KEY]: merged }, () => resolve());
  });
}

// ══════════════════════════════════════════════════════════════════
//  RUNTIME MESSAGE PASSING
// ══════════════════════════════════════════════════════════════════

export function sendMessage(message: NovaExtensionMessage): Promise<unknown> {
  const api = getBrowserAPI();
  if (!api?.runtime?.sendMessage) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const runtime = api.runtime!;
    runtime.sendMessage(message, (response) => resolve(response));
  });
}

export function onMessage(
  handler: (msg: NovaExtensionMessage, sendResponse: (response: unknown) => void) => boolean | void,
): void {
  const api = getBrowserAPI();
  if (!api?.runtime?.onMessage) return;

  api.runtime.onMessage.addListener((rawMsg, _sender, sendResponse) => {
    const msg = rawMsg as NovaExtensionMessage;
    if (msg.type && msg.requestId) {
      return handler(msg, sendResponse);
    }
  });
}

export function sendToTab(tabId: number, message: NovaExtensionMessage): Promise<unknown> {
  const api = getBrowserAPI();
  if (!api?.tabs?.sendMessage) return Promise.resolve(null);

  return new Promise((resolve) => {
    const tabs = api.tabs!;
    tabs.sendMessage(tabId, message, (response) => resolve(response));
  });
}

// ══════════════════════════════════════════════════════════════════
//  EXTENSION BADGE & ICON
// ══════════════════════════════════════════════════════════════════

export function setBadge(text: string, color?: string): void {
  const api = getBrowserAPI();
  if (!api?.action) return;

  api.action.setBadgeText({ text });
  if (color) {
    api.action.setBadgeBackgroundColor({ color });
  }
}

export function setExtensionIcon(path: string): void {
  const api = getBrowserAPI();
  if (!api?.action) return;

  api.action.setIcon({
    path: {
      '16': `${path}-16.png`,
      '48': `${path}-48.png`,
      '128': `${path}-128.png`,
    },
  });
}

// ══════════════════════════════════════════════════════════════════
//  SIDE PANEL SUPPORT (Edge/Chrome 114+)
// ══════════════════════════════════════════════════════════════════

export async function openSidePanel(): Promise<void> {
  const api = getBrowserAPI();
  if (api?.sidePanel?.open) {
    await api.sidePanel.open();
  }
}

export async function setSidePanelOptions(path: string): Promise<void> {
  const api = getBrowserAPI();
  if (api?.sidePanel?.setOptions) {
    await api.sidePanel.setOptions({ path, enabled: true });
  }
}
