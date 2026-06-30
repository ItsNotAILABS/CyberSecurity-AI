///
/// BROWSER INDEX — Nova Browser Extension Barrel Exports
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

// Extension Runtime (cross-browser abstraction)
export {
  detectBrowser,
  createMessage,
  sendMessage,
  onMessage,
  sendToTab,
  loadConfig,
  saveConfig,
  setBadge,
  setExtensionIcon,
  openSidePanel,
  setSidePanelOptions,
} from './NovaExtensionRuntime.js';

// Manifest Generator
export { NovaManifestGenerator } from './NovaExtensionManifestGenerator.js';

// Content Script
export { NovaContentScript } from './NovaContentScript.js';

// Background Worker
export { NovaBackgroundWorker } from './NovaBackgroundWorker.js';

// Popup Controller
export { NovaPopupController } from './NovaPopupController.js';

// Types
export type {
  BrowserType,
  NovaMessageType,
  NovaExtensionMessage,
  NovaStorageConfig,
} from './NovaExtensionRuntime.js';

export type { ManifestV3 } from './NovaExtensionManifestGenerator.js';
export type { NovaSidebarConfig } from './NovaContentScript.js';
export type { PopupTab, PopupState } from './NovaPopupController.js';
