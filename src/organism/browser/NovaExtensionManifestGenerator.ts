///
/// NOVA EXTENSION MANIFEST GENERATOR — Real manifest.json for Any Browser
///
/// Generates valid Manifest V3 extension manifests for all 20 Nova
/// extensions, targeting Edge, Chrome, Firefox, and Safari.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  AIExtensionRegistry,
  ExtensionClass,
  type AIExtension,
} from '../extensions/AIExtensionRegistry.js';

import { type BrowserType } from './NovaExtensionRuntime.js';

// ══════════════════════════════════════════════════════════════════
//  MANIFEST V3 TYPES
// ══════════════════════════════════════════════════════════════════

export interface ManifestV3 {
  readonly manifest_version: 3;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly icons: Record<string, string>;
  readonly action: {
    readonly default_popup: string;
    readonly default_icon: Record<string, string>;
    readonly default_title: string;
  };
  readonly background: {
    readonly service_worker: string;
    readonly type?: 'module';
  };
  readonly content_scripts: readonly {
    readonly matches: readonly string[];
    readonly js: readonly string[];
    readonly css?: readonly string[];
    readonly run_at?: 'document_start' | 'document_end' | 'document_idle';
  }[];
  readonly permissions: readonly string[];
  readonly optional_permissions?: readonly string[];
  readonly host_permissions?: readonly string[];
  readonly side_panel?: {
    readonly default_path: string;
  };
  readonly commands?: Record<string, {
    readonly suggested_key: { readonly default: string };
    readonly description: string;
  }>;
  readonly web_accessible_resources?: readonly {
    readonly resources: readonly string[];
    readonly matches: readonly string[];
  }[];
  readonly content_security_policy?: {
    readonly extension_pages: string;
  };

  // Firefox-specific
  readonly browser_specific_settings?: {
    readonly gecko?: {
      readonly id: string;
      readonly strict_min_version?: string;
    };
  };
}

// ══════════════════════════════════════════════════════════════════
//  PERMISSION MAPPING
// ══════════════════════════════════════════════════════════════════

function getPermissions(ext: AIExtension, browser: BrowserType): string[] {
  const perms: string[] = ['activeTab', 'storage'];

  if (ext.encryptionMode !== 'NONE') perms.push('privacy');

  switch (ext.extensionClass) {
    case ExtensionClass.REASONING:
      perms.push('tabs', 'scripting');
      break;
    case ExtensionClass.CREATIVE:
      perms.push('tabs', 'downloads');
      break;
    case ExtensionClass.ANALYSIS:
      perms.push('tabs', 'webNavigation', 'scripting');
      break;
    case ExtensionClass.SECURITY:
      perms.push('webRequest', 'cookies', 'privacy', 'scripting');
      break;
    case ExtensionClass.WORKFLOW:
      perms.push('tabs', 'alarms', 'notifications', 'scripting');
      break;
  }

  if (ext.modalities.some(m => m.includes('Audio'))) {
    perms.push('tabCapture');
  }

  // Edge/Chrome-specific: sidePanel
  if (browser === 'edge' || browser === 'chrome') {
    perms.push('sidePanel');
  }

  return [...new Set(perms)];
}

// ══════════════════════════════════════════════════════════════════
//  MANIFEST GENERATOR
// ══════════════════════════════════════════════════════════════════

export class NovaManifestGenerator {
  private readonly registry: AIExtensionRegistry;

  constructor() {
    this.registry = new AIExtensionRegistry();
  }

  /** Generate a Manifest V3 JSON for a specific extension and browser */
  generate(extensionId: string, browser: BrowserType = 'edge'): ManifestV3 {
    const ext = this.registry.byId(extensionId);
    if (!ext) throw new Error(`Extension ${extensionId} not found`);

    const slug = ext.name.toLowerCase().replace(/\s+/g, '-');
    const permissions = getPermissions(ext, browser);

    const manifest: ManifestV3 = {
      manifest_version: 3,
      name: ext.name,
      version: ext.manifestVersion,
      description: ext.description,

      icons: {
        '16': `icons/${slug}-16.png`,
        '48': `icons/${slug}-48.png`,
        '128': `icons/${slug}-128.png`,
      },

      action: {
        default_popup: `popup/${slug}.html`,
        default_icon: {
          '16': `icons/${slug}-16.png`,
          '48': `icons/${slug}-48.png`,
          '128': `icons/${slug}-128.png`,
        },
        default_title: `${ext.name} — ${ext.primaryCapability}`,
      },

      background: {
        service_worker: `background/${slug}-worker.js`,
        type: 'module',
      },

      content_scripts: [{
        matches: ['<all_urls>'],
        js: [`content-scripts/${slug}.js`],
        css: [`content-scripts/${slug}.css`],
        run_at: 'document_idle',
      }],

      permissions,

      host_permissions: ['<all_urls>'],

      web_accessible_resources: [{
        resources: [
          `popup/${slug}.html`,
          `sidebar/${slug}.html`,
          `icons/*`,
          `assets/*`,
        ],
        matches: ['<all_urls>'],
      }],

      commands: {
        'toggle-sidebar': {
          suggested_key: { default: 'Alt+N' },
          description: `Toggle ${ext.name} sidebar`,
        },
        'quick-action': {
          suggested_key: { default: 'Alt+Shift+N' },
          description: `${ext.name} quick action on selection`,
        },
      },

      content_security_policy: {
        extension_pages: "script-src 'self'; object-src 'self'",
      },
    };

    // Add side panel for Edge/Chrome
    if (browser === 'edge' || browser === 'chrome') {
      return {
        ...manifest,
        side_panel: {
          default_path: `sidebar/${slug}.html`,
        },
      };
    }

    // Add Firefox-specific settings
    if (browser === 'firefox') {
      return {
        ...manifest,
        browser_specific_settings: {
          gecko: {
            id: `${slug}@nova-protocol.ai`,
            strict_min_version: '109.0',
          },
        },
      };
    }

    return manifest;
  }

  /** Generate manifests for ALL 20 extensions */
  generateAll(browser: BrowserType = 'edge'): Map<string, ManifestV3> {
    const manifests = new Map<string, ManifestV3>();
    for (const ext of this.registry.extensions) {
      manifests.set(ext.extensionId, this.generate(ext.extensionId, browser));
    }
    return manifests;
  }

  /** Export a manifest as a JSON string */
  toJSON(extensionId: string, browser: BrowserType = 'edge'): string {
    return JSON.stringify(this.generate(extensionId, browser), null, 2);
  }
}
