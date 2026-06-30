///
/// MARKETPLACE CATEGORIES — Sovereign Product Organization System
///
/// ═══════════════════════════════════════════════════════════════════════
///  EVERY PRODUCT BELONGS TO A CATEGORY.  CATEGORIES ARE THE SUBSTRATE.
/// ═══════════════════════════════════════════════════════════════════════
///
/// 10 sovereign marketplace categories organizing every product, SDK,
/// AI, engine, and protocol in the Native Nova Protocol ecosystem.
/// φ-weighted, Fibonacci-indexed, database-ready.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INV = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;

// ══════════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════════

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type MarketplaceCategoryId =
  | 'CAT-ENCRYPTION'
  | 'CAT-IDENTITY'
  | 'CAT-DATA'
  | 'CAT-NETWORK'
  | 'CAT-TOKENS'
  | 'CAT-LEGAL'
  | 'CAT-AI-WORKFORCE'
  | 'CAT-GENERATIVE-UI'
  | 'CAT-INFRASTRUCTURE'
  | 'CAT-ORGANISMS';

export interface MarketplaceCategory {
  readonly id: MarketplaceCategoryId;
  readonly name: string;
  readonly latinName: string;
  readonly description: string;
  readonly productCount: number;
  readonly products: readonly MarketplaceProduct[];
  readonly phiWeight: number;
  readonly fibonacciId: number;
  readonly icon: string;
}

export interface MarketplaceProduct {
  readonly id: string;
  readonly name: string;
  readonly packageName: string;
  readonly categoryId: MarketplaceCategoryId;
  readonly description: string;
  readonly tier: string;
  readonly version: string;
  readonly engineCount: number;
  readonly capabilities: readonly string[];
  readonly phiWeight: number;
  readonly fibonacciId: number;
  readonly deployable: boolean;
  readonly sovereign: boolean;
}

export interface MarketplaceStats {
  readonly totalCategories: number;
  readonly totalProducts: number;
  readonly totalEngines: number;
  readonly totalCapabilities: number;
  readonly categoryCounts: Record<MarketplaceCategoryId, number>;
  readonly averagePhiWeight: number;
}

// ══════════════════════════════════════════════════════════════════
//  PRODUCT BUILDER
// ══════════════════════════════════════════════════════════════════

function makeProduct(
  id: string,
  name: string,
  packageName: string,
  categoryId: MarketplaceCategoryId,
  description: string,
  tier: string,
  version: string,
  engineCount: number,
  capabilities: readonly string[],
  deployable: boolean,
  sovereign: boolean,
): MarketplaceProduct {
  const h = hashStr(id);
  return {
    id,
    name,
    packageName,
    categoryId,
    description,
    tier,
    version,
    engineCount,
    capabilities,
    phiWeight: ((h * PHI_INV) % 1) * PHI,
    fibonacciId: fibonacciHash(h, 65536),
    deployable,
    sovereign,
  };
}

function makeCategory(
  id: MarketplaceCategoryId,
  name: string,
  latinName: string,
  description: string,
  icon: string,
  products: readonly MarketplaceProduct[],
): MarketplaceCategory {
  const h = hashStr(id);
  return {
    id,
    name,
    latinName,
    description,
    productCount: products.length,
    products,
    phiWeight: ((h * PHI_INV) % 1) * PHI_SQUARED,
    fibonacciId: fibonacciHash(h, 65536),
    icon,
  };
}

// ══════════════════════════════════════════════════════════════════
//  PRODUCT DEFINITIONS
// ══════════════════════════════════════════════════════════════════

const encryptionProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-ENC-001', 'SovereignEncryptionSDK', '@medina/sovereign-encryption', 'CAT-ENCRYPTION',
    'Five-tier golden-ratio encryption from Fibonacci hashing to Phantom ZK proofs', 'SOVEREIGN', '1.0.0', 6,
    ['fibonacci-hash', 'phi-cascade', 'golden-key-derivation', 'e8-lattice', 'leech-lattice', 'phantom-zk'], true, true),
];

const identityProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-ID-001', 'SovereignIdentitySDK', '@medina/sovereign-identity', 'CAT-IDENTITY',
    'Five-tier identity from Fibonacci fingerprints to sovereign attestation chains', 'SOVEREIGN', '1.0.0', 5,
    ['fibonacci-fingerprint', 'golden-signature', 'sovereign-passport', 'dimensional-identity', 'attestation-chain'], true, true),
];

const dataProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-DATA-001', 'SovereignDataMeshSDK', '@medina/sovereign-data-mesh', 'CAT-DATA',
    'Five-tier data infrastructure from golden stores to cross-substrate self-healing data mesh', 'SOVEREIGN', '1.0.0', 5,
    ['golden-store', 'fibonacci-tree', 'phi-graph', 'dimensional-vault', 'data-mesh'], true, true),
];

const networkProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-NET-001', 'SovereignNetworkSDK', '@medina/sovereign-network', 'CAT-NETWORK',
    'Five-tier networking from golden wires to phantom relays', 'SOVEREIGN', '1.0.0', 5,
    ['golden-wire', 'fibonacci-channel', 'mesh-route', 'dimensional-bridge', 'phantom-relay'], true, true),
];

const tokenProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-TOK-001', 'SovereignTokenEngine', '@medina/sovereign-token-engine', 'CAT-TOKENS',
    'Tokenization, attestation, provenance, golden-ratio token economics', 'SOVEREIGN', '1.0.0', 5,
    ['tokenization', 'attestation', 'provenance', 'economics', 'token-ai'], true, true),
  makeProduct('PROD-TOK-002', 'PhantomTokenTech', '@medina/phantom-token-tech', 'CAT-TOKENS',
    'Stealth-mode tokens with obfuscation layers', 'PHANTOM', '1.0.0', 3,
    ['stealth-tokens', 'obfuscation', 'phantom-hash'], true, true),
  makeProduct('PROD-TOK-003', 'SovereignTokenTech', '@medina/sovereign-token-tech', 'CAT-TOKENS',
    'Self-governing tokens with lifecycle and evolution', 'SOVEREIGN', '1.0.0', 3,
    ['self-governing', 'lifecycle', 'token-evolution'], true, true),
  ...(Array.from({ length: 10 }, (_, i) =>
    makeProduct(`PROD-TOK-1${String(i).padStart(2, '0')}`, `TokenTech-${i + 1}`, `@medina/token-tech-${i + 1}`, 'CAT-TOKENS',
      `Token technology #${i + 1}`, 'CORE', '1.0.0', 2,
      ['token-processing', 'phi-weighted'], true, true),
  ) as MarketplaceProduct[]),
];

const legalProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-LEG-001', 'LegalParalegalAI', '@medina/legal-paralegal-ai', 'CAT-LEGAL',
    'AI-powered legal technology — 10 divisions, 30 engines', 'SOVEREIGN', '1.0.0', 30,
    ['case-law', 'contract-review', 'document-drafting', 'legal-research', 'argument-construction', 'compliance', 'risk-assessment'], true, true),
];

const aiWorkforceProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-AI-001', 'AIWorkforceOrchestrator', '@medina/ai-workforce', 'CAT-AI-WORKFORCE',
    'AGI orchestrator managing the full AI build pipeline', 'AGI', '1.0.0', 3,
    ['orchestration', 'pipeline', 'agi-coordination'], true, true),
  ...(Array.from({ length: 100 }, (_, i) =>
    makeProduct(`PROD-AI-N${String(i + 1).padStart(3, '0')}`, `NativeNovaAI-${i + 1}`, `@medina/nova-ai-${i + 1}`, 'CAT-AI-WORKFORCE',
      `Native Nova AI #${i + 1} — sovereign intelligence model`, 'SOVEREIGN', '1.0.0', 3,
      ['perceive', 'synthesize', 'manifest'], true, true),
  ) as MarketplaceProduct[]),
  ...(Array.from({ length: 50 }, (_, i) =>
    makeProduct(`PROD-AI-L${String(i + 1).padStart(3, '0')}`, `LanguageAI-${i + 1}`, `@medina/lang-ai-${i + 1}`, 'CAT-AI-WORKFORCE',
      `Language AI #${i + 1} — every language IS an AI`, 'CORE', '1.0.0', 3,
      ['parse', 'generate', 'render'], true, true),
  ) as MarketplaceProduct[]),
];

const generativeUIProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-UI-001', 'GenerativeUIEngine', '@medina/generative-ui-engine', 'CAT-GENERATIVE-UI',
    'AI generates entire UI components in real-time from natural language', 'SOVEREIGN', '1.0.0', 5,
    ['webgpu', 'css-houdini', 'web-components', 'canvas-2d', 'webgl', 'crdt'], true, true),
  makeProduct('PROD-UI-002', 'SpatialCanvasSDK', '@medina/spatial-canvas', 'CAT-GENERATIVE-UI',
    'Infinite spatial canvas — the rendering substrate', 'SOVEREIGN', '1.0.0', 3,
    ['spatial-canvas', 'infinite-scroll', 'agent-generation'], true, true),
];

const infrastructureProducts: readonly MarketplaceProduct[] = [
  ...(Array.from({ length: 10 }, (_, i) =>
    makeProduct(`PROD-INF-A${String(i + 1).padStart(2, '0')}`, `AlphaScriptAI-${i + 1}`, `@medina/alpha-script-ai-${i + 1}`, 'CAT-INFRASTRUCTURE',
      `Alpha Script AI #${i + 1} — autonomous script intelligence`, 'SOVEREIGN', '1.0.0', 3,
      ['think', 'run', 'pulse', 'generate'], true, true),
  ) as MarketplaceProduct[]),
  makeProduct('PROD-INF-001', 'AnimaMicro', '@medina/anima-micro', 'CAT-INFRASTRUCTURE',
    'Protocol + Database + Callable mini brain/heart', 'SOVEREIGN', '1.0.0', 4,
    ['pulse', 'think', 'reflect', 'status'], true, true),
  makeProduct('PROD-INF-002', 'SovereignDatabase', '@medina/sovereign-database', 'CAT-INFRASTRUCTURE',
    'Unified living database across all worlds', 'SOVEREIGN', '1.0.0', 5,
    ['entity-store', 'world-projection', 'migration', 'query', 'category-manifest'], true, true),
];

const organismProducts: readonly MarketplaceProduct[] = [
  makeProduct('PROD-ORG-001', 'ObserverIntelligence', '@medina/observer', 'CAT-ORGANISMS',
    'The Observer — crown intelligence, orchestrator of orchestrators', 'ALPHA', '1.0.0', 5,
    ['observe', 'coordinate', 'phi-weight', 'fibonacci-hash'], true, true),
  makeProduct('PROD-ORG-002', 'SovereignIntelligence', '@medina/sovereign', 'CAT-ORGANISMS',
    'The Sovereign — governance and identity intelligence', 'ALPHA', '1.0.0', 5,
    ['govern', 'attest', 'sovereign-verify'], true, true),
  makeProduct('PROD-ORG-003', 'ChrysalisIntelligence', '@medina/chrysalis', 'CAT-ORGANISMS',
    'The Chrysalis — transformation and evolution intelligence', 'ALPHA', '1.0.0', 5,
    ['transform', 'evolve', 'metamorphose'], true, true),
  makeProduct('PROD-ORG-004', 'TerminalIntelligence', '@medina/terminal', 'CAT-ORGANISMS',
    'The Terminal — execution and runtime intelligence', 'ALPHA', '1.0.0', 5,
    ['execute', 'runtime', 'terminal-render'], true, true),
  makeProduct('PROD-ORG-005', 'ScribeIntelligence', '@medina/scribe', 'CAT-ORGANISMS',
    'The Scribe — documentation and knowledge intelligence', 'ALPHA', '1.0.0', 5,
    ['document', 'record', 'knowledge-graph'], true, true),
  makeProduct('PROD-ORG-006', 'ArchitectIntelligence', '@medina/architect', 'CAT-ORGANISMS',
    'The Architect — structure and design intelligence', 'ALPHA', '1.0.0', 5,
    ['design', 'structure', 'blueprint'], true, true),
  makeProduct('PROD-ORG-007', 'NexusIntelligence', '@medina/nexus', 'CAT-ORGANISMS',
    'The Nexus — connection and integration intelligence', 'ALPHA', '1.0.0', 5,
    ['connect', 'integrate', 'bridge'], true, true),
  makeProduct('PROD-ORG-008', 'CustosIntelligence', '@medina/custos', 'CAT-ORGANISMS',
    'The Custos — care and stewardship intelligence', 'ALPHA', '1.0.0', 5,
    ['care', 'steward', 'diagnose'], true, true),
  makeProduct('PROD-ORG-009', 'PraesidiumIntelligence', '@medina/praesidium', 'CAT-ORGANISMS',
    'The Praesidium — defense and protection intelligence', 'ALPHA', '1.0.0', 5,
    ['defend', 'protect', 'fortify'], true, true),
];

// ══════════════════════════════════════════════════════════════════
//  CATEGORY DEFINITIONS
// ══════════════════════════════════════════════════════════════════

const ALL_CATEGORIES: readonly MarketplaceCategory[] = [
  makeCategory('CAT-ENCRYPTION', 'Encryption', 'Cryptographia',
    'Sovereign encryption technologies — Fibonacci hashing through Phantom ZK proofs', '🔐', encryptionProducts),
  makeCategory('CAT-IDENTITY', 'Identity', 'Identitas',
    'Sovereign identity and authentication — fingerprints to attestation chains', '🪪', identityProducts),
  makeCategory('CAT-DATA', 'Data', 'Data Aurea',
    'Sovereign data infrastructure — golden stores to self-healing data mesh', '🗄️', dataProducts),
  makeCategory('CAT-NETWORK', 'Network', 'Rete Aurea',
    'Sovereign networking — golden wires to phantom relays', '🌐', networkProducts),
  makeCategory('CAT-TOKENS', 'Tokens', 'Tessera',
    'Token technologies — sovereign, phantom, and core token processing', '🪙', tokenProducts),
  makeCategory('CAT-LEGAL', 'Legal', 'Lex Civilis',
    'AI-powered legal technology — case law, contracts, compliance', '⚖️', legalProducts),
  makeCategory('CAT-AI-WORKFORCE', 'AI Workforce', 'Machina Laboris',
    '151 AIs — 100 Nova AIs, 50 Language AIs, 1 AGI orchestrator', '🤖', aiWorkforceProducts),
  makeCategory('CAT-GENERATIVE-UI', 'Generative UI', 'Ars Generativa',
    'AI-generated UI with spatial canvas rendering substrate', '🎨', generativeUIProducts),
  makeCategory('CAT-INFRASTRUCTURE', 'Infrastructure', 'Fundamentum',
    'Core infrastructure — script AIs, Anima, sovereign database', '🏗️', infrastructureProducts),
  makeCategory('CAT-ORGANISMS', 'Organisms', 'Corpus Vivum',
    '9 Alpha Organisms — the living intelligences of the protocol', '🧬', organismProducts),
];

// ══════════════════════════════════════════════════════════════════
//  EXPORTED CONSTANT
// ══════════════════════════════════════════════════════════════════

export const MARKETPLACE_CATEGORIES: readonly MarketplaceCategory[] = ALL_CATEGORIES;

// ══════════════════════════════════════════════════════════════════
//  REGISTRY CLASS
// ══════════════════════════════════════════════════════════════════

export class MarketplaceCategoryRegistry {
  readonly categories: readonly MarketplaceCategory[] = ALL_CATEGORIES;

  private readonly _categoryMap: ReadonlyMap<MarketplaceCategoryId, MarketplaceCategory>;
  private readonly _productMap: ReadonlyMap<string, MarketplaceProduct>;

  constructor() {
    const cm = new Map<MarketplaceCategoryId, MarketplaceCategory>();
    const pm = new Map<string, MarketplaceProduct>();
    for (const cat of ALL_CATEGORIES) {
      cm.set(cat.id, cat);
      for (const prod of cat.products) {
        pm.set(prod.id, prod);
      }
    }
    this._categoryMap = cm;
    this._productMap = pm;
  }

  getCategory(id: MarketplaceCategoryId): MarketplaceCategory | undefined {
    return this._categoryMap.get(id);
  }

  getProduct(id: string): MarketplaceProduct | undefined {
    return this._productMap.get(id);
  }

  search(query: string): readonly MarketplaceProduct[] {
    const q = query.toLowerCase();
    const results: MarketplaceProduct[] = [];
    for (const prod of this._productMap.values()) {
      if (
        prod.name.toLowerCase().includes(q) ||
        prod.packageName.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q) ||
        prod.capabilities.some(c => c.toLowerCase().includes(q))
      ) {
        results.push(prod);
      }
    }
    // Sort by φ-weight descending
    results.sort((a, b) => b.phiWeight - a.phiWeight);
    return results;
  }

  stats(): MarketplaceStats {
    const categoryCounts = {} as Record<MarketplaceCategoryId, number>;
    let totalProducts = 0;
    let totalEngines = 0;
    let totalCapabilities = 0;
    let phiSum = 0;

    for (const cat of ALL_CATEGORIES) {
      categoryCounts[cat.id] = cat.productCount;
      totalProducts += cat.productCount;
      for (const prod of cat.products) {
        totalEngines += prod.engineCount;
        totalCapabilities += prod.capabilities.length;
        phiSum += prod.phiWeight;
      }
    }

    return {
      totalCategories: ALL_CATEGORIES.length,
      totalProducts,
      totalEngines,
      totalCapabilities,
      categoryCounts,
      averagePhiWeight: totalProducts > 0 ? phiSum / totalProducts : 0,
    };
  }

  allProducts(): readonly MarketplaceProduct[] {
    return Array.from(this._productMap.values());
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY
// ══════════════════════════════════════════════════════════════════

export function createMarketplaceCategoryRegistry(): MarketplaceCategoryRegistry {
  return new MarketplaceCategoryRegistry();
}
