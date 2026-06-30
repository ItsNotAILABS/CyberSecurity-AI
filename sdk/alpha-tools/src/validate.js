///
/// @medina/alpha-tools validation script
/// Validates all components are alive and functional
///

'use strict';

import { AlphaTool, AlphaAdapter, AlphaPlugin, AlphaToolRegistry, registry } from './index.js';
import '../adapters/index.js';
import '../plugins/index.js';
import '../pages/index.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✅ ${message}`);
  } else {
    failed++;
    console.log(`  ❌ ${message}`);
  }
}

console.log('╔════════════════════════════════════════════════╗');
console.log('║     ALPHA TOOLS — Validation Suite            ║');
console.log('╚════════════════════════════════════════════════╝');
console.log('');

// Core class tests
console.log('▶ Core Classes');
const tool = new AlphaTool({ name: 'TEST-TOOL' });
assert(tool.status === 'alive', 'AlphaTool self-bootstraps to alive');
assert(tool.heartbeat !== null, 'AlphaTool heartbeat started');
tool.shutdown();
assert(tool.status === 'shutdown', 'AlphaTool shutdown works');

const adapter = new AlphaAdapter({ name: 'TEST-ADAPTER' });
assert(adapter.type === 'adapter', 'AlphaAdapter type is adapter');
adapter.shutdown();

const plugin = new AlphaPlugin({ name: 'TEST-PLUGIN' });
assert(plugin.type === 'plugin', 'AlphaPlugin type is plugin');
assert(plugin.enabled === true, 'AlphaPlugin starts enabled');
plugin.disable();
assert(plugin.enabled === false, 'AlphaPlugin disable works');
plugin.shutdown();

console.log('');

// Registry tests
console.log('▶ Registry');
const status = registry.getRegistryStatus();
assert(status.totalTools > 0, `Registry has ${status.totalTools} tools`);
assert(status.adapters > 0, `Registry has ${status.adapters} adapters`);
assert(status.plugins > 0, `Registry has ${status.plugins} plugins`);

console.log('');

// Adapter tests
console.log('▶ Adapters');
const tools = registry.listTools();
const adapters = tools.filter(t => t.type === 'adapter');
assert(adapters.length >= 7, `${adapters.length} adapters registered`);
assert(adapters.every(a => a.status === 'alive'), 'All adapters alive');

console.log('');

// Plugin tests
console.log('▶ Plugins');
const plugins = tools.filter(t => t.type === 'plugin');
assert(plugins.length >= 5, `${plugins.length} plugins registered`);
assert(plugins.every(p => p.status === 'alive'), 'All plugins alive');

console.log('');

// Page tests
console.log('▶ Pages');
const pages = tools.filter(t => t.type === 'page-renderer');
assert(pages.length >= 2, `${pages.length} page renderers registered`);

console.log('');
console.log('════════════════════════════════════════════════');
console.log(`  Results: ${passed} passed, ${failed} failed`);
console.log('════════════════════════════════════════════════');

// Cleanup
registry.shutdownAll();

if (failed > 0) {
  process.exit(1);
}
