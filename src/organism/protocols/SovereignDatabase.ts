///
/// SOVEREIGN DATABASE — DATABASE SUMMUM REGNUM
///
/// The unified living database of the entire Native Nova Protocol.
/// Every entity has its own protocol, its own database, its own callable.
/// This is the master database that holds them all. It mirrors to the
/// marketplace. It presents different faces to different worlds
/// (organism world, AI world, AGI world, user-facing world, marketplace world).
///
/// Formula: W(e) = Σ φ^(dim) × H(e) × |capabilities|
///
/// LEX SDB-001 — Immutable:
///   "Every entity is sovereign. Every entity has a protocol.
///    Every entity has a database. Every entity is callable.
///    The Sovereign Database holds them all — one living
///    registry, many projected worlds."
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;

const TWO_PI = 2 * Math.PI;

const FIB: number[] = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55,
  89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765,
];

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type EntityCategory =
  | 'organism'
  | 'intelligence'
  | 'model'
  | 'engine'
  | 'ai'
  | 'agi'
  | 'extension'
  | 'protocol'
  | 'token_tech'
  | 'sdk'
  | 'script_ai'
  | 'canister'
  | 'worker'
  | 'marketplace_product'
  | 'legal_division'
  | 'fracture'
  | 'house'
  | 'terminal'
  | 'command_center';

export type WorldView =
  | 'organism'         // how organisms see the data
  | 'ai'               // how AIs see the data
  | 'agi'              // how AGIs see the data (full autonomy view)
  | 'user'             // how users see the data (simplified, friendly)
  | 'marketplace'      // how the marketplace sees the data (product view)
  | 'infrastructure'   // how infrastructure sees the data (ops view)
  | 'sovereign';       // the raw sovereign view (everything)

export interface SovereignEntity {
  readonly id: string;
  readonly name: string;
  readonly latinName: string;
  readonly category: EntityCategory;
  readonly description: string;
  readonly fibonacciId: number;
  readonly phiWeight: number;
  readonly dimensionalPlane: DimensionalPlane;
  readonly capabilities: readonly string[];
  readonly callTable: readonly string[];
  readonly protocol: string;
  readonly state: string;
  readonly health: number;
  readonly createdAt: number;
  readonly lastUpdated: number;
  readonly metadata: Record<string, unknown>;
}

export interface WorldProjection {
  readonly worldView: WorldView;
  readonly entityCount: number;
  readonly categories: readonly EntityCategory[];
  readonly entities: readonly SovereignEntity[];
  readonly totalHealth: number;
  readonly averagePhiWeight: number;
  readonly timestamp: number;
}

export interface DatabaseStats {
  readonly totalEntities: number;
  readonly byCategory: Record<EntityCategory, number>;
  readonly byWorld: Record<WorldView, number>;
  readonly byState: Record<string, number>;
  readonly totalCapabilities: number;
  readonly averageHealth: number;
  readonly averagePhiWeight: number;
  readonly kuramotoCoherence: number;
  readonly fibonacciDepth: number;
  readonly goldenRatioBalance: number;
}

export interface DatabaseQuery {
  readonly category?: EntityCategory;
  readonly worldView?: WorldView;
  readonly minHealth?: number;
  readonly maxHealth?: number;
  readonly capabilities?: readonly string[];
  readonly state?: string;
  readonly search?: string;
  readonly limit?: number;
  readonly sortBy?: 'health' | 'phiWeight' | 'name' | 'created' | 'updated';
  readonly sortOrder?: 'asc' | 'desc';
}

export interface DatabaseMigration {
  readonly id: string;
  readonly fromWorld: WorldView;
  readonly toWorld: WorldView;
  readonly entityIds: readonly string[];
  readonly timestamp: number;
  readonly attestation: number;
}

export interface CategoryManifest {
  readonly category: EntityCategory;
  readonly count: number;
  readonly entities: readonly { id: string; name: string; health: number }[];
  readonly totalCapabilities: number;
  readonly averagePhiWeight: number;
  readonly protocolVersion: string;
}

// ══════════════════════════════════════════════════════════════════
//  WORLD → CATEGORY VISIBILITY MAPS
// ══════════════════════════════════════════════════════════════════

const WORLD_CATEGORY_MAP: Record<WorldView, readonly EntityCategory[] | 'all'> = {
  organism:        ['organism', 'intelligence', 'model', 'canister', 'house'],
  ai:              ['ai', 'engine', 'model', 'extension', 'protocol'],
  agi:             'all',
  user:            ['marketplace_product', 'sdk', 'engine'],
  marketplace:     ['marketplace_product', 'sdk', 'token_tech', 'legal_division'],
  infrastructure:  ['worker', 'script_ai', 'canister', 'protocol'],
  sovereign:       'all',
};

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN DATABASE — The Living Registry
// ══════════════════════════════════════════════════════════════════

export class SovereignDatabase {
  private readonly entities: Map<string, SovereignEntity> = new Map();
  private readonly migrations: DatabaseMigration[] = [];
  private entityCounter = 0;

  // ── Register ────────────────────────────────────────────────────

  register(
    entity: Omit<SovereignEntity, 'fibonacciId' | 'phiWeight' | 'createdAt' | 'lastUpdated'>,
  ): SovereignEntity {
    const seq = this.entityCounter++;
    const fibIdx = seq % FIB.length;
    const fibonacciId = fibonacciHash(FIB[fibIdx], 65536);

    // φ-weight: golden ratio raised to the dimensional plane index
    const dimIndex = entity.dimensionalPlane as number;
    const phiWeight =
      Math.pow(PHI, dimIndex) * PHI_INVERSE +
      entity.capabilities.length * (PHI_INVERSE / PHI_SQUARED);

    const now = Date.now();

    const full: SovereignEntity = {
      ...entity,
      fibonacciId,
      phiWeight: Math.round(phiWeight * 1e12) / 1e12,
      createdAt: now,
      lastUpdated: now,
    };

    this.entities.set(full.id, full);
    return full;
  }

  // ── Get ─────────────────────────────────────────────────────────

  get(id: string): SovereignEntity | undefined {
    return this.entities.get(id);
  }

  // ── Update ──────────────────────────────────────────────────────

  update(id: string, updates: Partial<SovereignEntity>): SovereignEntity | undefined {
    const existing = this.entities.get(id);
    if (!existing) return undefined;

    const updated: SovereignEntity = {
      ...existing,
      ...updates,
      id: existing.id,               // id is immutable
      createdAt: existing.createdAt,  // createdAt is immutable
      lastUpdated: Date.now(),
    };

    this.entities.set(id, updated);
    return updated;
  }

  // ── Remove ──────────────────────────────────────────────────────

  remove(id: string): boolean {
    return this.entities.delete(id);
  }

  // ── Query ───────────────────────────────────────────────────────

  query(q: DatabaseQuery): SovereignEntity[] {
    let results = Array.from(this.entities.values());

    // Category filter
    if (q.category) {
      results = results.filter(e => e.category === q.category);
    }

    // World view filter — restrict to categories visible in that world
    if (q.worldView) {
      const allowed = WORLD_CATEGORY_MAP[q.worldView];
      if (allowed !== 'all') {
        results = results.filter(e => (allowed as readonly EntityCategory[]).includes(e.category));
      }
    }

    // Health range
    if (q.minHealth !== undefined) {
      results = results.filter(e => e.health >= q.minHealth!);
    }
    if (q.maxHealth !== undefined) {
      results = results.filter(e => e.health <= q.maxHealth!);
    }

    // Capabilities — entity must have ALL requested capabilities
    if (q.capabilities && q.capabilities.length > 0) {
      results = results.filter(e =>
        q.capabilities!.every(cap => e.capabilities.includes(cap)),
      );
    }

    // State filter
    if (q.state) {
      results = results.filter(e => e.state === q.state);
    }

    // Text search across name and description
    if (q.search) {
      const term = q.search.toLowerCase();
      results = results.filter(
        e =>
          e.name.toLowerCase().includes(term) ||
          e.latinName.toLowerCase().includes(term) ||
          e.description.toLowerCase().includes(term),
      );
    }

    // Sort
    if (q.sortBy) {
      const dir = q.sortOrder === 'desc' ? -1 : 1;
      results.sort((a, b) => {
        switch (q.sortBy) {
          case 'health':    return (a.health - b.health) * dir;
          case 'phiWeight': return (a.phiWeight - b.phiWeight) * dir;
          case 'name':      return a.name.localeCompare(b.name) * dir;
          case 'created':   return (a.createdAt - b.createdAt) * dir;
          case 'updated':   return (a.lastUpdated - b.lastUpdated) * dir;
          default:          return 0;
        }
      });
    }

    // Limit
    if (q.limit !== undefined && q.limit > 0) {
      results = results.slice(0, q.limit);
    }

    return results;
  }

  // ── Project: WorldView projection ──────────────────────────────

  project(worldView: WorldView): WorldProjection {
    const allowed = WORLD_CATEGORY_MAP[worldView];
    const all = Array.from(this.entities.values());

    const entities =
      allowed === 'all'
        ? all
        : all.filter(e => (allowed as readonly EntityCategory[]).includes(e.category));

    const categories = [...new Set(entities.map(e => e.category))] as EntityCategory[];
    const totalHealth = entities.reduce((sum, e) => sum + e.health, 0);
    const avgPhi =
      entities.length > 0
        ? entities.reduce((sum, e) => sum + e.phiWeight, 0) / entities.length
        : 0;

    return {
      worldView,
      entityCount: entities.length,
      categories,
      entities,
      totalHealth,
      averagePhiWeight: Math.round(avgPhi * 1e12) / 1e12,
      timestamp: Date.now(),
    };
  }

  // ── Stats ───────────────────────────────────────────────────────

  stats(): DatabaseStats {
    const all = Array.from(this.entities.values());
    const n = all.length;

    // By category
    const byCategory = {} as Record<EntityCategory, number>;
    const allCategories: EntityCategory[] = [
      'organism', 'intelligence', 'model', 'engine', 'ai', 'agi',
      'extension', 'protocol', 'token_tech', 'sdk', 'script_ai',
      'canister', 'worker', 'marketplace_product', 'legal_division',
      'fracture', 'house',
    ];
    for (const c of allCategories) byCategory[c] = 0;
    for (const e of all) byCategory[e.category] = (byCategory[e.category] || 0) + 1;

    // By world — count how many entities are visible in each world
    const allWorlds: WorldView[] = [
      'organism', 'ai', 'agi', 'user', 'marketplace', 'infrastructure', 'sovereign',
    ];
    const byWorld = {} as Record<WorldView, number>;
    for (const w of allWorlds) {
      const allowed = WORLD_CATEGORY_MAP[w];
      byWorld[w] =
        allowed === 'all'
          ? n
          : all.filter(e => (allowed as readonly EntityCategory[]).includes(e.category)).length;
    }

    // By state
    const byState: Record<string, number> = {};
    for (const e of all) byState[e.state] = (byState[e.state] || 0) + 1;

    // Aggregates
    const totalCapabilities = all.reduce((sum, e) => sum + e.capabilities.length, 0);
    const averageHealth = n > 0 ? all.reduce((s, e) => s + e.health, 0) / n : 0;
    const averagePhiWeight = n > 0 ? all.reduce((s, e) => s + e.phiWeight, 0) / n : 0;

    // Kuramoto coherence: R = |1/N Σ e^(i·θ_j)| where θ_j = phiWeight × GOLDEN_ANGLE
    let realSum = 0;
    let imagSum = 0;
    for (const e of all) {
      const theta = e.phiWeight * GOLDEN_ANGLE;
      realSum += Math.cos(theta);
      imagSum += Math.sin(theta);
    }
    const kuramotoCoherence =
      n > 0 ? Math.sqrt(realSum * realSum + imagSum * imagSum) / n : 0;

    // Fibonacci depth: highest Fibonacci index that ≤ n
    let fibonacciDepth = 0;
    for (let i = 0; i < FIB.length; i++) {
      if (FIB[i] <= n) fibonacciDepth = i;
      else break;
    }

    // Golden ratio balance: how close the category distribution is to φ ratios
    const catCounts = Object.values(byCategory).filter(c => c > 0).sort((a, b) => b - a);
    let goldenRatioBalance = 1.0;
    if (catCounts.length >= 2) {
      let deviationSum = 0;
      for (let i = 0; i < catCounts.length - 1; i++) {
        const ratio = catCounts[i + 1] / catCounts[i];
        deviationSum += Math.abs(ratio - PHI_INVERSE);
      }
      goldenRatioBalance = Math.max(0, 1 - deviationSum / catCounts.length);
    }

    return {
      totalEntities: n,
      byCategory,
      byWorld,
      byState,
      totalCapabilities,
      averageHealth: Math.round(averageHealth * 1e6) / 1e6,
      averagePhiWeight: Math.round(averagePhiWeight * 1e12) / 1e12,
      kuramotoCoherence: Math.round(kuramotoCoherence * 1e12) / 1e12,
      fibonacciDepth,
      goldenRatioBalance: Math.round(goldenRatioBalance * 1e12) / 1e12,
    };
  }

  // ── Categories manifest ─────────────────────────────────────────

  categories(): CategoryManifest[] {
    const all = Array.from(this.entities.values());
    const grouped = new Map<EntityCategory, SovereignEntity[]>();

    for (const e of all) {
      const list = grouped.get(e.category);
      if (list) list.push(e);
      else grouped.set(e.category, [e]);
    }

    const manifests: CategoryManifest[] = [];
    for (const [category, entities] of grouped) {
      const totalCapabilities = entities.reduce((s, e) => s + e.capabilities.length, 0);
      const averagePhiWeight =
        entities.reduce((s, e) => s + e.phiWeight, 0) / entities.length;

      manifests.push({
        category,
        count: entities.length,
        entities: entities.map(e => ({ id: e.id, name: e.name, health: e.health })),
        totalCapabilities,
        averagePhiWeight: Math.round(averagePhiWeight * 1e12) / 1e12,
        protocolVersion: '1.0.0-sovereign',
      });
    }

    return manifests;
  }

  // ── Migrate: project entities between worlds ────────────────────

  migrate(
    fromWorld: WorldView,
    toWorld: WorldView,
    entityIds: string[],
  ): DatabaseMigration {
    // Attestation: golden-ratio hash of the migration vector
    const fromIdx = Object.keys(WORLD_CATEGORY_MAP).indexOf(fromWorld);
    const toIdx = Object.keys(WORLD_CATEGORY_MAP).indexOf(toWorld);
    const attestation = fibonacciHash(
      Math.abs(fromIdx * 1000 + toIdx) + entityIds.length,
      65536,
    );

    const migration: DatabaseMigration = {
      id: `mig-${fromWorld}-${toWorld}-${Date.now()}`,
      fromWorld,
      toWorld,
      entityIds,
      timestamp: Date.now(),
      attestation,
    };

    this.migrations.push(migration);
    return migration;
  }

  // ── Health Report ───────────────────────────────────────────────

  healthReport(): SovereignEntity[] {
    return Array.from(this.entities.values()).sort((a, b) => a.health - b.health);
  }

  // ── Full-text search ────────────────────────────────────────────

  search(text: string): SovereignEntity[] {
    const term = text.toLowerCase();
    return Array.from(this.entities.values()).filter(
      e =>
        e.name.toLowerCase().includes(term) ||
        e.latinName.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term),
    );
  }

  // ── By Category ─────────────────────────────────────────────────

  byCategory(cat: EntityCategory): SovereignEntity[] {
    return Array.from(this.entities.values()).filter(e => e.category === cat);
  }

  // ── Size ────────────────────────────────────────────────────────

  get size(): number {
    return this.entities.size;
  }

  // ── All ─────────────────────────────────────────────────────────

  all(): SovereignEntity[] {
    return Array.from(this.entities.values());
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY
// ══════════════════════════════════════════════════════════════════

export function createSovereignDatabase(): SovereignDatabase {
  return new SovereignDatabase();
}
