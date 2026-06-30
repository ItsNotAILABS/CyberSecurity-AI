///
/// @medina/alpha-tools/pages — Deployed Pages Interface
///
/// Production-ready page generators for sovereign deployment.
/// Outputs pure mathematical computation — NO HTML/CSS.
/// Renders through φ-photon layer when needed.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

'use strict';

import { AlphaTool, registry } from '../src/index.js';

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;

// ═══════════════════════════════════════════════════════════════════
// PAGE RENDERER — Mathematical computation output
// ═══════════════════════════════════════════════════════════════════

export class AlphaPageRenderer extends AlphaTool {
  constructor(config = {}) {
    super({
      name: config.name || 'ALPHA-PAGE-RENDERER',
      type: 'page-renderer',
      ...config,
    });

    this.pages = new Map();
    this.routes = new Map();
    this.middleware = [];
  }

  // Register a page
  registerPage(path, generator) {
    this.pages.set(path, {
      path,
      generator,
      created: Date.now(),
      hits: 0,
    });
    return this;
  }

  // Register route
  route(pattern, handler) {
    this.routes.set(pattern, handler);
    return this;
  }

  // Add middleware
  use(middleware) {
    this.middleware.push(middleware);
    return this;
  }

  // Render a page
  async execute(input, context) {
    const path = input.path || input;
    const page = this.pages.get(path);

    if (!page) {
      // Check routes
      for (const [pattern, handler] of this.routes) {
        if (this._matchRoute(path, pattern)) {
          return handler(input, context);
        }
      }
      return { error: 'page_not_found', path };
    }

    page.hits++;

    // Apply middleware chain
    let processedContext = { ...context, path };
    for (const mw of this.middleware) {
      processedContext = await mw(processedContext);
    }

    // Generate page content
    return page.generator(input, processedContext);
  }

  _matchRoute(path, pattern) {
    if (typeof pattern === 'string') {
      return path.startsWith(pattern);
    }
    if (pattern instanceof RegExp) {
      return pattern.test(path);
    }
    return false;
  }

  getPageStats() {
    const stats = {};
    for (const [path, page] of this.pages) {
      stats[path] = { hits: page.hits, created: page.created };
    }
    return stats;
  }
}

// ═══════════════════════════════════════════════════════════════════
// DASHBOARD PAGE — System status mathematical output
// ═══════════════════════════════════════════════════════════════════

export class DashboardPage extends AlphaPageRenderer {
  constructor() {
    super({ name: 'DASHBOARD-PAGE' });

    this.registerPage('/dashboard', (input, ctx) => this._renderDashboard(ctx));
    this.registerPage('/status', (input, ctx) => this._renderStatus(ctx));
    this.registerPage('/tools', (input, ctx) => this._renderTools(ctx));
    this.registerPage('/metrics', (input, ctx) => this._renderMetrics(ctx));
  }

  _renderDashboard(ctx) {
    const status = registry.getRegistryStatus();
    return {
      type: 'dashboard',
      phi: PHI,
      registry: status,
      timestamp: Date.now(),
      uptime: Date.now() - this.birthTime,
      health: this._calculateHealth(),
    };
  }

  _renderStatus(ctx) {
    return {
      type: 'status',
      alive: true,
      phi_heartbeat: Math.round(540 * PHI),
      tools: registry.listTools().map(t => ({
        name: t.name,
        type: t.type,
        status: t.status,
      })),
    };
  }

  _renderTools(ctx) {
    return {
      type: 'tools',
      tools: registry.listTools(),
    };
  }

  _renderMetrics(ctx) {
    const tools = registry.listTools();
    return {
      type: 'metrics',
      totalInvocations: tools.reduce((sum, t) => sum + t.metrics.invocations, 0),
      totalErrors: tools.reduce((sum, t) => sum + t.metrics.errors, 0),
      avgLatency: tools.reduce((sum, t) => sum + t.metrics.avgLatency, 0) / (tools.length || 1),
      toolCount: tools.length,
    };
  }

  _calculateHealth() {
    const tools = registry.listTools();
    const alive = tools.filter(t => t.status === 'alive').length;
    return {
      score: alive / (tools.length || 1),
      alive,
      total: tools.length,
      healthy: (alive / (tools.length || 1)) >= PHI_INV,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// API PAGE — Programmatic access surface
// ═══════════════════════════════════════════════════════════════════

export class ApiPage extends AlphaPageRenderer {
  constructor() {
    super({ name: 'API-PAGE' });

    this.registerPage('/api/invoke', (input, ctx) => this._invoke(input, ctx));
    this.registerPage('/api/query', (input, ctx) => this._query(input, ctx));
    this.registerPage('/api/registry', (input, ctx) => this._registryInfo(ctx));
  }

  async _invoke(input, ctx) {
    const { toolId, payload } = input;
    const tool = registry.getTool(toolId);

    if (!tool) {
      return { error: 'tool_not_found', toolId };
    }

    return tool.invoke(payload, ctx);
  }

  async _query(input, ctx) {
    const { toolId } = input;

    if (toolId) {
      const tool = registry.getTool(toolId);
      return tool ? tool.getStatus() : { error: 'tool_not_found' };
    }

    return registry.getRegistryStatus();
  }

  _registryInfo(ctx) {
    return {
      registry: registry.getRegistryStatus(),
      tools: registry.listTools().map(t => ({
        id: t.id,
        name: t.name,
        type: t.type,
      })),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// DEPLOYED PAGE INSTANCES
// ═══════════════════════════════════════════════════════════════════

export const dashboardPage = new DashboardPage();
export const apiPage = new ApiPage();

registry.registerTool(dashboardPage);
registry.registerTool(apiPage);

export default {
  AlphaPageRenderer,
  DashboardPage,
  ApiPage,
  dashboardPage,
  apiPage,
};
