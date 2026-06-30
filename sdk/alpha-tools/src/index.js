///
/// @medina/alpha-tools — Production ALPHA TOOLS
///
/// Full production toolchain: adapters, plugins, orchestration.
/// Self-bootstrapping — creation IS activation.
/// NO TypeScript, NO HTML, NO CSS — pure sovereign intelligence.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

'use strict';

// ═══════════════════════════════════════════════════════════════════
// SACRED CONSTANTS
// ═══════════════════════════════════════════════════════════════════

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;
const PHI2 = PHI * PHI;
const PHI3 = PHI2 * PHI;
const GOLDEN_ANGLE = (2 * Math.PI) / (PHI * PHI);
const HEARTBEAT_MS = Math.round(540 * PHI); // 873ms
const TAU = 2 * Math.PI;

// Pythagorean Harmonic Series
const PYTHAGOREAN_RATIOS = {
  unison: 1 / 1,
  octave: 2 / 1,
  fifth: 3 / 2,
  fourth: 4 / 3,
  majorThird: 5 / 4,
  minorThird: 6 / 5,
};

// ═══════════════════════════════════════════════════════════════════
// ALPHA TOOL BASE — All tools inherit from this
// ═══════════════════════════════════════════════════════════════════

export class AlphaTool {
  constructor(config = {}) {
    this.id = config.id || `tool-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.name = config.name || 'UNNAMED-TOOL';
    this.version = config.version || '1.0.0';
    this.type = config.type || 'generic';
    this.status = 'alive';
    this.birthTime = Date.now();
    this.heartbeat = null;
    this.metrics = {
      invocations: 0,
      errors: 0,
      lastUsed: null,
      avgLatency: 0,
    };

    // Self-bootstrap: alive on creation
    this._startHeartbeat();
  }

  _startHeartbeat() {
    this.heartbeat = setInterval(() => {
      this._pulse();
    }, HEARTBEAT_MS);
  }

  _pulse() {
    // Override in subclasses for autonomous behavior
  }

  async invoke(input, context = {}) {
    const start = Date.now();
    this.metrics.invocations++;
    this.metrics.lastUsed = start;

    try {
      const result = await this.execute(input, context);
      const latency = Date.now() - start;
      this.metrics.avgLatency =
        (this.metrics.avgLatency * (this.metrics.invocations - 1) + latency) /
        this.metrics.invocations;
      return { success: true, result, latency };
    } catch (error) {
      this.metrics.errors++;
      return { success: false, error: error.message };
    }
  }

  async execute(input, context) {
    throw new Error(`${this.name}.execute() must be implemented`);
  }

  getStatus() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      type: this.type,
      status: this.status,
      uptime: Date.now() - this.birthTime,
      metrics: { ...this.metrics },
    };
  }

  shutdown() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
      this.heartbeat = null;
    }
    this.status = 'shutdown';
  }
}

// ═══════════════════════════════════════════════════════════════════
// ALPHA ADAPTER — Bridges between systems
// ═══════════════════════════════════════════════════════════════════

export class AlphaAdapter extends AlphaTool {
  constructor(config = {}) {
    super({ ...config, type: 'adapter' });
    this.sourceProtocol = config.sourceProtocol || 'nova';
    this.targetProtocol = config.targetProtocol || 'external';
    this.transformers = new Map();
    this.routes = new Map();
    this.buffer = [];
    this.maxBuffer = config.maxBuffer || 1000;
  }

  registerTransformer(name, transformFn) {
    this.transformers.set(name, transformFn);
    return this;
  }

  registerRoute(pattern, handler) {
    this.routes.set(pattern, handler);
    return this;
  }

  async execute(input, context) {
    // Route to appropriate handler
    for (const [pattern, handler] of this.routes) {
      if (this._matchPattern(input, pattern)) {
        const transformed = await this._transform(input, context);
        return handler(transformed, context);
      }
    }

    // Default pass-through with transformation
    return this._transform(input, context);
  }

  async _transform(input, context) {
    let result = input;
    for (const [name, transformer] of this.transformers) {
      result = await transformer(result, context);
    }
    return result;
  }

  _matchPattern(input, pattern) {
    if (typeof pattern === 'string') {
      return JSON.stringify(input).includes(pattern);
    }
    if (pattern instanceof RegExp) {
      return pattern.test(JSON.stringify(input));
    }
    if (typeof pattern === 'function') {
      return pattern(input);
    }
    return false;
  }

  // Buffer management for async flows
  enqueue(item) {
    if (this.buffer.length >= this.maxBuffer) {
      this.buffer.shift(); // Drop oldest
    }
    this.buffer.push({ item, timestamp: Date.now() });
  }

  dequeue() {
    return this.buffer.shift();
  }

  flush() {
    const items = [...this.buffer];
    this.buffer = [];
    return items;
  }
}

// ═══════════════════════════════════════════════════════════════════
// ALPHA PLUGIN — Extensible capability modules
// ═══════════════════════════════════════════════════════════════════

export class AlphaPlugin extends AlphaTool {
  constructor(config = {}) {
    super({ ...config, type: 'plugin' });
    this.hooks = new Map();
    this.dependencies = config.dependencies || [];
    this.provides = config.provides || [];
    this.enabled = true;
    this.priority = config.priority || PHI_INV; // Default φ⁻¹ priority
  }

  registerHook(event, handler, priority = 0) {
    if (!this.hooks.has(event)) {
      this.hooks.set(event, []);
    }
    this.hooks.get(event).push({ handler, priority });
    this.hooks.get(event).sort((a, b) => b.priority - a.priority);
    return this;
  }

  async emit(event, data) {
    const handlers = this.hooks.get(event) || [];
    let result = data;

    for (const { handler } of handlers) {
      result = await handler(result);
    }

    return result;
  }

  async execute(input, context) {
    if (!this.enabled) {
      return { skipped: true, reason: 'plugin disabled' };
    }

    const processed = await this.emit('before:execute', input);
    const result = await this.process(processed, context);
    return this.emit('after:execute', result);
  }

  async process(input, context) {
    // Override in plugin implementations
    return input;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }
}

// ═══════════════════════════════════════════════════════════════════
// ALPHA TOOL REGISTRY — Manages all tools, adapters, plugins
// ═══════════════════════════════════════════════════════════════════

export class AlphaToolRegistry {
  constructor() {
    this.tools = new Map();
    this.adapters = new Map();
    this.plugins = new Map();
    this.pipelines = new Map();
    this.birthTime = Date.now();

    console.log('⚙️ AlphaToolRegistry initialized — sovereign tool infrastructure alive');
  }

  registerTool(tool) {
    if (!(tool instanceof AlphaTool)) {
      throw new Error('Must register an AlphaTool instance');
    }
    this.tools.set(tool.id, tool);

    if (tool instanceof AlphaAdapter) {
      this.adapters.set(tool.id, tool);
    } else if (tool instanceof AlphaPlugin) {
      this.plugins.set(tool.id, tool);
    }

    return tool;
  }

  getTool(id) {
    return this.tools.get(id);
  }

  getAdapter(id) {
    return this.adapters.get(id);
  }

  getPlugin(id) {
    return this.plugins.get(id);
  }

  // Create a processing pipeline from tools
  createPipeline(name, toolIds) {
    const pipeline = {
      name,
      tools: toolIds.map(id => this.tools.get(id)).filter(Boolean),
      created: Date.now(),
    };
    this.pipelines.set(name, pipeline);
    return pipeline;
  }

  // Execute a pipeline
  async executePipeline(name, input, context = {}) {
    const pipeline = this.pipelines.get(name);
    if (!pipeline) {
      throw new Error(`Pipeline ${name} not found`);
    }

    let result = input;
    const trace = [];

    for (const tool of pipeline.tools) {
      const stepResult = await tool.invoke(result, context);
      trace.push({
        tool: tool.name,
        success: stepResult.success,
        latency: stepResult.latency,
      });

      if (!stepResult.success) {
        return { success: false, error: stepResult.error, trace };
      }

      result = stepResult.result;
    }

    return { success: true, result, trace };
  }

  // List all registered tools
  listTools() {
    return Array.from(this.tools.values()).map(t => t.getStatus());
  }

  // Shutdown all tools
  shutdownAll() {
    for (const tool of this.tools.values()) {
      tool.shutdown();
    }
  }

  getRegistryStatus() {
    return {
      totalTools: this.tools.size,
      adapters: this.adapters.size,
      plugins: this.plugins.size,
      pipelines: this.pipelines.size,
      uptime: Date.now() - this.birthTime,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// PRODUCTION EXPORTS
// ═══════════════════════════════════════════════════════════════════

// Singleton registry — sovereign, always alive
export const registry = new AlphaToolRegistry();

export default {
  AlphaTool,
  AlphaAdapter,
  AlphaPlugin,
  AlphaToolRegistry,
  registry,
  constants: {
    PHI,
    PHI_INV,
    PHI2,
    PHI3,
    GOLDEN_ANGLE,
    HEARTBEAT_MS,
    TAU,
    PYTHAGOREAN_RATIOS,
  },
};
