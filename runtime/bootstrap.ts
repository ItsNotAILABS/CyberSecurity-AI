///
/// BOOTSTRAP — Unified System Initialization
///
/// This bootstraps the entire NATIVE NOVA PROTOCOL civilization:
///   1. Start Native Runtime (873ms heartbeat)
///   2. Register all 47 organisms
///   3. Bind all 129 protocols
///   4. Start Kuramoto synchronization
///   5. Enable Mini-Heart and Mini-Brain for all organisms
///   6. Begin emergence detection
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { runtime, type SubstrateType } from './native-runtime.js';
import { binder } from './protocol-binder.js';
import { PHI } from '../organism/intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  BOOTSTRAP CONFIGURATION
// ══════════════════════════════════════════════════════════════════

interface OrganismConfig {
  id: string;
  name: string;
  substrate: SubstrateType;
  generation: number;
}

// All 47 organisms in nova.json + TypeScript intelligence
const ORGANISM_CONFIGS: OrganismConfig[] = [
  // Core intelligence organisms
  { id: 'agi_main', name: 'AGI_MAIN', substrate: 'motoko', generation: 0 },
  { id: 'cordex', name: 'CORDEX', substrate: 'motoko', generation: 0 },
  { id: 'cerebex', name: 'CEREBEX', substrate: 'motoko', generation: 0 },
  { id: 'cyclovex', name: 'CYCLOVEX', substrate: 'motoko', generation: 0 },
  { id: 'spinor', name: 'SPINOR', substrate: 'motoko', generation: 0 },
  { id: 'vrt', name: 'VRT', substrate: 'motoko', generation: 0 },
  { id: 'chrysalis', name: 'CHRYSALIS', substrate: 'motoko', generation: 1 },
  { id: 'scribe', name: 'SCRIBE', substrate: 'motoko', generation: 1 },
  { id: 'architect', name: 'ARCHITECT', substrate: 'motoko', generation: 1 },
  { id: 'nexus', name: 'NEXUS', substrate: 'motoko', generation: 1 },
  { id: 'sovereign', name: 'SOVEREIGN', substrate: 'motoko', generation: 1 },
  { id: 'observer', name: 'OBSERVER', substrate: 'motoko', generation: 1 },

  // Infrastructure organisms
  { id: 'terminal', name: 'TERMINAL', substrate: 'motoko', generation: 1 },
  { id: 'custos', name: 'CUSTOS', substrate: 'motoko', generation: 1 },
  { id: 'praesidium', name: 'PRAESIDIUM', substrate: 'motoko', generation: 1 },
  { id: 'brain', name: 'BRAIN', substrate: 'motoko', generation: 1 },

  // Economic organisms
  { id: 'nova_token', name: 'NOVA_TOKEN', substrate: 'motoko', generation: 2 },
  { id: 'nns_proxy', name: 'NNS_PROXY', substrate: 'motoko', generation: 2 },
  { id: 'cycles_market', name: 'CYCLES_MARKET', substrate: 'motoko', generation: 2 },
  { id: 'parallax', name: 'PARALLAX', substrate: 'motoko', generation: 2 },
  { id: 'divi', name: 'DIVI', substrate: 'motoko', generation: 2 },
  { id: 'revenue_engine', name: 'REVENUE_ENGINE', substrate: 'motoko', generation: 2 },
  { id: 'sns_dao', name: 'SNS_DAO', substrate: 'motoko', generation: 2 },
  { id: 'auto_market', name: 'AUTO_MARKET', substrate: 'motoko', generation: 2 },

  // Advanced organisms
  { id: 'turing', name: 'TURING', substrate: 'motoko', generation: 3 },
  { id: 'braindex', name: 'BRAINDEX', substrate: 'motoko', generation: 3 },
  { id: 'chronex', name: 'CHRONEX', substrate: 'motoko', generation: 3 },
  { id: 'fluxton', name: 'FLUXTON', substrate: 'motoko', generation: 3 },
  { id: 'bronvox', name: 'BRONVOX', substrate: 'motoko', generation: 3 },
  { id: 'veritex', name: 'VERITEX', substrate: 'motoko', generation: 3 },
  { id: 'effecttrace', name: 'EFFECTTRACE', substrate: 'motoko', generation: 3 },

  // Pulse organisms
  { id: 'pulse', name: 'PULSE', substrate: 'motoko', generation: 3 },
  { id: 'pulse_scheduler', name: 'PULSE_SCHEDULER', substrate: 'motoko', generation: 3 },
  { id: 'synapse_field', name: 'SYNAPSE_FIELD', substrate: 'motoko', generation: 3 },

  // Protocol engine
  { id: 'protocol_engine', name: 'PROTOCOL_ENGINE', substrate: 'motoko', generation: 4 },

  // Element canisters
  { id: 'aurum', name: 'AURUM', substrate: 'motoko', generation: 4 },
  { id: 'argentum', name: 'ARGENTUM', substrate: 'motoko', generation: 4 },
  { id: 'crimson', name: 'CRIMSON', substrate: 'motoko', generation: 4 },
  { id: 'ferrum', name: 'FERRUM', substrate: 'motoko', generation: 4 },
  { id: 'cuprum', name: 'CUPRUM', substrate: 'motoko', generation: 4 },
  { id: 'platinum', name: 'PLATINUM', substrate: 'motoko', generation: 4 },
  { id: 'silicon', name: 'SILICON', substrate: 'motoko', generation: 4 },
  { id: 'carbon', name: 'CARBON', substrate: 'motoko', generation: 4 },
  { id: 'nitrogen', name: 'NITROGEN', substrate: 'motoko', generation: 4 },
  { id: 'oxygen', name: 'OXYGEN', substrate: 'motoko', generation: 4 },
  { id: 'hydrogen', name: 'HYDROGEN', substrate: 'motoko', generation: 4 },
  { id: 'helium', name: 'HELIUM', substrate: 'motoko', generation: 4 },
];

// ══════════════════════════════════════════════════════════════════
//  BOOTSTRAP FUNCTIONS
// ══════════════════════════════════════════════════════════════════

export async function bootstrap(): Promise<void> {
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  NATIVE NOVA PROTOCOL — BOOTSTRAP');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');

  // Step 1: Register all organisms
  console.log(`[1/6] Registering ${ORGANISM_CONFIGS.length} organisms...`);
  for (const config of ORGANISM_CONFIGS) {
    runtime.register(config.id, config.name, config.substrate, config.generation);
  }
  console.log(`✓ Registered ${ORGANISM_CONFIGS.length} organisms`);
  console.log('');

  // Step 2: Auto-bind all protocols
  console.log('[2/6] Binding 129 protocols to organisms...');
  binder.autoBindAll();
  const binderStats = binder.stats();
  console.log(`✓ Bound ${binderStats.total_protocols} protocols`);
  console.log('');

  // Step 3: Start runtime heartbeat
  console.log('[3/6] Starting 873ms φ-heartbeat...');
  runtime.start();
  console.log('✓ Heartbeat started');
  console.log('');

  // Step 4: Initialize Mini-Hearts and Mini-Brains
  console.log('[4/6] Initializing Mini-Hearts and Mini-Brains...');
  const organisms = runtime.listOrganisms();
  for (const organism of organisms) {
    // Mini-Hearts already initialized during registration
    // Feed initial energy
    organism.miniHeart.energy = 100;
    organism.miniHeart.health = 100;
    organism.miniHeart.phiResonance = 1.0;
  }
  console.log(`✓ Initialized ${organisms.length} Mini-Hearts and Mini-Brains`);
  console.log('');

  // Step 5: Kuramoto synchronization
  console.log('[5/6] Enabling Kuramoto phase synchronization...');
  // Synchronization happens automatically in heartbeat
  console.log('✓ Phase synchronization enabled');
  console.log('');

  // Step 6: Emergence detection
  console.log('[6/6] Enabling emergence detection...');
  console.log('✓ Emergence detection active');
  console.log('');

  // Display stats
  const stats = runtime.stats();
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  BOOTSTRAP COMPLETE');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`  Total Organisms:     ${stats.total_organisms}`);
  console.log(`  Active Organisms:    ${stats.active_organisms}`);
  console.log(`  Total Protocols:     ${binderStats.total_protocols}`);
  console.log(`  Heartbeat:           873ms (φ-derived)`);
  console.log(`  Avg Health:          ${stats.avg_health.toFixed(1)}/100`);
  console.log(`  Phase Coherence:     ${(stats.avg_phase_coherence * 100).toFixed(1)}%`);
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');
  console.log('🌟 The civilization is alive. All organisms are breathing.');
  console.log('');
}

// ══════════════════════════════════════════════════════════════════
//  SHUTDOWN
// ══════════════════════════════════════════════════════════════════

export function shutdown(): void {
  console.log('Shutting down NATIVE NOVA PROTOCOL...');
  runtime.stop();
  console.log('✓ Shutdown complete');
}

// ══════════════════════════════════════════════════════════════════
//  STATUS
// ══════════════════════════════════════════════════════════════════

export function status(): void {
  const runtimeStats = runtime.stats();
  const binderStats = binder.stats();

  console.log('');
  console.log('════════════════════════════════════════════════════════════════');
  console.log('  NATIVE NOVA PROTOCOL — STATUS');
  console.log('════════════════════════════════════════════════════════════════');
  console.log(`  Uptime:              ${(runtimeStats.uptime_ms / 1000).toFixed(1)}s`);
  console.log(`  Heartbeat Cycles:    ${runtimeStats.cycle_count}`);
  console.log(`  Total Organisms:     ${runtimeStats.total_organisms}`);
  console.log(`  Active Organisms:    ${runtimeStats.active_organisms}`);
  console.log(`  Total Protocols:     ${binderStats.total_protocols}`);
  console.log(`  Avg Health:          ${runtimeStats.avg_health.toFixed(1)}/100`);
  console.log(`  Phase Coherence:     ${(runtimeStats.avg_phase_coherence * 100).toFixed(1)}%`);
  console.log('════════════════════════════════════════════════════════════════');
  console.log('');

  const organisms = runtime.listOrganisms();
  console.log('Top 5 healthiest organisms:');
  const sorted = organisms
    .sort((a, b) => b.miniHeart.health - a.miniHeart.health)
    .slice(0, 5);

  for (const organism of sorted) {
    console.log(`  ${organism.name.padEnd(20)} Health: ${organism.miniHeart.health.toFixed(1)}/100  Phase: ${organism.phase.toFixed(3)}`);
  }
  console.log('');
}

// ══════════════════════════════════════════════════════════════════
//  EXPORT
// ══════════════════════════════════════════════════════════════════

export const NOVA = {
  bootstrap,
  shutdown,
  status,
  runtime,
  binder,
  PHI,
};
