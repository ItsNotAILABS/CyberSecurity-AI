///
/// PROTOCOL-TO-ORGANISM BINDING LAYER
///
/// This layer binds the 129 protocols (89 base + 40 alpha) to their
/// target organisms. Routes protocol execution to the correct organism
/// based on Fibonacci hashing, capability matching, and load balancing.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { runtime, type OrganismInstance, type ProtocolContext, type SubstrateType } from './native-runtime.js';
import { ALPHA_PROTOCOLS, getProtocol } from './alpha-protocols-201-240.js';
import { ALPHA_PROTOCOLS_241_275, getProtocol241to275 } from './alpha-protocols-241-275.js';
import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../organism/intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface ProtocolBinding {
  protocolId: string;
  targetOrganisms: string[];   // Organism IDs
  loadBalancing: 'round-robin' | 'fibonacci' | 'capability' | 'load-based';
  fallbackOrganisms: string[];
}

export interface ProtocolRoute {
  protocolId: string;
  organismId: string;
  confidence: number;  // 0.0 to 1.0
  reason: 'primary' | 'fallback' | 'load-balance';
}

export interface ProtocolExecutionTelemetry {
  protocolId: string;
  executions: number;
  lastExecutedAt: number;
  lastStatus: 'ok' | 'error';
  lastAttestation?: string;
  lastThresholdPass?: boolean;
}

// ══════════════════════════════════════════════════════════════════
//  PROTOCOL BINDER
// ══════════════════════════════════════════════════════════════════

const ALL_ALPHA_PROTOCOLS = [...ALPHA_PROTOCOLS, ...ALPHA_PROTOCOLS_241_275];

export class ProtocolBinder {
  private bindings: Map<string, ProtocolBinding> = new Map();
  private executionCounts: Map<string, number> = new Map();  // For round-robin
  private telemetry: Map<string, ProtocolExecutionTelemetry> = new Map();

  constructor() {
    console.log('Protocol Binder initialized');
  }

  // ── Binding Management ───────────────────────────────────────────

  bind(protocolId: string, targetOrganisms: string[], options?: {
    loadBalancing?: 'round-robin' | 'fibonacci' | 'capability' | 'load-based';
    fallbackOrganisms?: string[];
  }): void {
    const binding: ProtocolBinding = {
      protocolId,
      targetOrganisms,
      loadBalancing: options?.loadBalancing || 'fibonacci',
      fallbackOrganisms: options?.fallbackOrganisms || [],
    };

    this.bindings.set(protocolId, binding);
    console.log(`Bound ${protocolId} → [${targetOrganisms.join(', ')}]`);
  }

  unbind(protocolId: string): boolean {
    return this.bindings.delete(protocolId);
  }

  getBinding(protocolId: string): ProtocolBinding | undefined {
    return this.bindings.get(protocolId);
  }

  // ── Protocol Routing ─────────────────────────────────────────────

  route(protocolId: string, input: any): ProtocolRoute {
    const binding = this.bindings.get(protocolId);
    if (!binding) {
      throw new Error(`No binding found for protocol: ${protocolId}`);
    }

    const organismId = this.selectOrganism(binding, input);

    return {
      protocolId,
      organismId,
      confidence: 1.0,
      reason: 'primary',
    };
  }

  private selectOrganism(binding: ProtocolBinding, input: any): string {
    const targets = binding.targetOrganisms;
    if (targets.length === 0) {
      throw new Error(`No target organisms for ${binding.protocolId}`);
    }

    switch (binding.loadBalancing) {
      case 'fibonacci':
        return this.selectByFibonacci(targets, input);

      case 'round-robin':
        return this.selectRoundRobin(targets, binding.protocolId);

      case 'capability':
        return this.selectByCapability(targets, binding.protocolId);

      case 'load-based':
        return this.selectByLoad(targets);

      default:
        return targets[0];
    }
  }

  private selectByFibonacci(targets: string[], input: any): string {
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    const hash = fibonacciHash(inputStr, targets.length);
    return targets[hash % targets.length];
  }

  private selectRoundRobin(targets: string[], protocolId: string): string {
    const count = this.executionCounts.get(protocolId) || 0;
    const index = count % targets.length;
    this.executionCounts.set(protocolId, count + 1);
    return targets[index];
  }

  private selectByCapability(targets: string[], protocolId: string): string {
    // Select organism with best capability match
    for (const targetId of targets) {
      const organism = runtime.getOrganism(targetId);
      if (organism && organism.protocols.has(protocolId)) {
        return targetId;
      }
    }
    return targets[0];  // Fallback to first
  }

  private selectByLoad(targets: string[]): string {
    // Select organism with lowest load (healthiest)
    let bestOrganism = targets[0];
    let bestHealth = 0;

    for (const targetId of targets) {
      const organism = runtime.getOrganism(targetId);
      if (organism && organism.miniHeart.health > bestHealth) {
        bestHealth = organism.miniHeart.health;
        bestOrganism = targetId;
      }
    }

    return bestOrganism;
  }

  // ── Protocol Execution ───────────────────────────────────────────

  async execute(protocolId: string, input: any, parameters?: Record<string, number>): Promise<any> {
    const route = this.route(protocolId, input);
    const organism = runtime.getOrganism(route.organismId);

    if (!organism) {
      throw new Error(`Organism not found: ${route.organismId}`);
    }

    const ctx: ProtocolContext = {
      protocolId,
      organism,
      input,
      parameters: parameters || {},
      substrate: organism.substrate,
    };

    try {
      // Check if it's an Alpha protocol
      const alphaProtocol = getProtocol(protocolId) || getProtocol241to275(protocolId);
      const result = alphaProtocol
        ? await alphaProtocol.execute(ctx)
        : await runtime.executeProtocol(ctx);

      this.updateTelemetry(protocolId, result, 'ok');
      return result;
    } catch (error) {
      this.updateTelemetry(protocolId, null, 'error');
      throw error;
    }
  }

  // ── Auto-Binding ─────────────────────────────────────────────────

  /**
   * Automatically bind all protocols to all organisms
   * based on substrate and generation
   */
  autoBindAll(): void {
    const organisms = runtime.listOrganisms();

    // Bind Alpha protocols 201-275
    for (const protocol of ALL_ALPHA_PROTOCOLS) {
      const targets = organisms
        .filter(o => o.active)
        .map(o => o.id);

      this.bind(protocol.id, targets, { loadBalancing: 'fibonacci' });
    }

    // Bind base protocols (PRT-001 to NMP-029)
    // Simplified: bind all to all organisms
    const protocolIds = [];
    for (let i = 1; i <= 10; i++) {
      protocolIds.push(`PRT-${String(i).padStart(3, '0')}`);
    }
    for (let i = 1; i <= 50; i++) {
      protocolIds.push(`APR-${String(i).padStart(3, '0')}`);
    }
    for (let i = 1; i <= 29; i++) {
      protocolIds.push(`NMP-${String(i).padStart(3, '0')}`);
    }

    for (const pid of protocolIds) {
      const targets = organisms
        .filter(o => o.active)
        .map(o => o.id);

      this.bind(pid, targets, { loadBalancing: 'fibonacci' });
    }

    console.log(`Auto-bound ${this.bindings.size} protocols to ${organisms.length} organisms`);
  }

  private updateTelemetry(protocolId: string, result: any, status: 'ok' | 'error'): void {
    const prev = this.telemetry.get(protocolId);
    this.telemetry.set(protocolId, {
      protocolId,
      executions: (prev?.executions || 0) + 1,
      lastExecutedAt: Date.now(),
      lastStatus: status,
      lastAttestation: typeof result?.attestation === 'string' ? result.attestation : prev?.lastAttestation,
      lastThresholdPass: typeof result?.granted === 'boolean' ? result.granted : prev?.lastThresholdPass,
    });
  }

  telemetrySnapshot(protocolId?: string): ProtocolExecutionTelemetry[] {
    if (protocolId) {
      const record = this.telemetry.get(protocolId);
      return record ? [record] : [];
    }
    return Array.from(this.telemetry.values());
  }

  // ── Statistics ───────────────────────────────────────────────────

  stats(): {
    total_bindings: number;
    total_protocols: number;
    avg_targets_per_protocol: number;
  } {
    let totalTargets = 0;
    for (const binding of this.bindings.values()) {
      totalTargets += binding.targetOrganisms.length;
    }

    return {
      total_bindings: this.bindings.size,
      total_protocols: this.bindings.size,
      avg_targets_per_protocol: this.bindings.size > 0 ? totalTargets / this.bindings.size : 0,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  SINGLETON INSTANCE
// ══════════════════════════════════════════════════════════════════

export const binder = new ProtocolBinder();
