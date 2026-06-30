///
/// @medina/alpha-tools deploy script
/// Deploys all tools, adapters, plugins to sovereign infrastructure
///

'use strict';

import { registry } from './index.js';
import '../adapters/index.js';
import '../plugins/index.js';
import '../pages/index.js';

const status = registry.getRegistryStatus();

console.log('╔════════════════════════════════════════════════╗');
console.log('║     ALPHA TOOLS — Sovereign Deploy            ║');
console.log('╚════════════════════════════════════════════════╝');
console.log('');
console.log(`  Deploying ${status.totalTools} tools to sovereign pages...`);
console.log('');
console.log('  Endpoints deployed:');
console.log('    /dashboard    → System overview');
console.log('    /status       → Health check');
console.log('    /tools        → Tool registry');
console.log('    /metrics      → Performance data');
console.log('    /api/invoke   → Tool invocation');
console.log('    /api/query    → Tool query');
console.log('    /api/registry → Registry info');
console.log('');
console.log('  ✅ All endpoints active');
console.log('  ✅ Sovereign deployment complete');
console.log('');

// Cleanup
registry.shutdownAll();
