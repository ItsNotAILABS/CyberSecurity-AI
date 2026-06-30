///
/// NOVA ENGINE SDK — Unified Entry Point for All 23 Sovereign Engines
///
/// Usage:
///   import { NovaSDK } from './sdk/index.js';
///
///   const nova = new NovaSDK({ apiKey: 'your-key' });
///
///   // Chat with any engine
///   const answer = await nova.cognos.chat([{ role: 'user', content: 'Hello' }]);
///
///   // Generate an image
///   const image = await nova.pictor.generate('A golden spiral fractal');
///
///   // Generate code
///   const code = await nova.codex.generate('fibonacci in Rust');
///
///   // Search the web
///   const results = await nova.scrutator.search('Nova Protocol');
///
///   // Embed text
///   const vectors = await nova.vector.embed('sovereign intelligence');
///
///   // Check content safety
///   const safety = await nova.custodis.check('some user input');
///
///   // Stream responses
///   for await (const chunk of nova.cognos.stream([{ role: 'user', content: 'Tell me a story' }])) {
///     process.stdout.write(chunk.delta);
///   }
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { NovaAPIClient, type NovaAPIConfig } from './NovaAPIClient.js';
import { NovaEngineRegistry, NOVA_ENGINES } from './NovaEngineModels.js';

// ══════════════════════════════════════════════════════════════════
//  NOVA SDK — The one-line entry to all 23 engines
// ══════════════════════════════════════════════════════════════════

export class NovaSDK extends NovaAPIClient {
  constructor(config: NovaAPIConfig) {
    super(config);
  }

  /** List all 23 available engines with their capabilities */
  listEngines() {
    return NOVA_ENGINES.map(e => ({
      id: e.id,
      name: e.name,
      slug: e.slug,
      description: e.description,
      modalities: e.modalities,
      contextWindow: e.contextWindow,
      supportsStreaming: e.supportsStreaming,
      supportsVision: e.supportsVision,
      supportsFunctionCalling: e.supportsFunctionCalling,
    }));
  }

  /** Get a specific engine definition by ID or slug */
  getEngine(idOrSlug: string) {
    return this.registry.byId(idOrSlug as any) ?? this.registry.bySlug(idOrSlug as any);
  }
}

// ══════════════════════════════════════════════════════════════════
//  CONVENIENCE FACTORY
// ══════════════════════════════════════════════════════════════════

/** Create a Nova SDK instance with minimal config */
export function createNovaSDK(apiKey: string, options?: Partial<NovaAPIConfig>): NovaSDK {
  return new NovaSDK({ apiKey, ...options });
}
