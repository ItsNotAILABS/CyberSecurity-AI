/**
 * CLOUD ENGINE INTELLIGENCE
 *
 * Frontend TypeScript intelligence for the cloud_engine organism.
 * Provides interfaces, types, and helper functions for interacting
 * with on-demand private UTOPIA distribution.
 *
 * Key Features:
 *   - UTOPIA instance management (request, activate, retire)
 *   - 20/80 burn split monitoring (ICP visible vs node provider)
 *   - Kuramoto oscillator coherence tracking
 *   - Fleet health and φ-weighted composite metrics
 *   - Burn event auditing and transparency
 *
 * Casa de Medina — Architectos de Architectura Inteligente
 */

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

export const PHI = 1.6180339887498948482;
export const PHI_INV = 0.6180339887498948482;
export const LOV = Math.pow(PHI, PHI);  // φ^φ ≈ 2.17845
export const GOLDEN_ANGLE = 2.39996322972865332;  // ≈ 137.5° in radians

export const BURN_TO_ICP_FRACTION = 0.20;   // 20% → ICP visible burn
export const BURN_TO_NODE_FRACTION = 0.80;  // 80% → node provider

export const MIN_UTOPIA_CYCLES = 10_000_000_000;  // 10 billion cycles
export const MAX_UTOPIA_COUNT = 1597;  // Fibonacci F(17)
export const UTOPIA_NODE_COUNT = 8;    // Fibonacci F(6)

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type ComputeProfile = 'Light' | 'Standard' | 'Heavy' | 'Enterprise';

export type UtopiaStatus = 'Provisioning' | 'Active' | 'Scaling' | 'Degraded' | 'Retired';

export interface UtopiaConfig {
  name: string;
  requestorPrincipal: string;
  cycleAllocation: bigint;
  nodeProvider: string;
  computeProfile: ComputeProfile;
  metadata: Record<string, string>;
}

export interface KuramotoNode {
  id: number;
  angle: number;    // Fixed golden-angle position
  phase: number;    // Current oscillator phase [0, 2π)
  energy: number;   // Energy level [0, LOV]
}

export interface UtopiaInstance {
  id: bigint;
  name: string;
  requestor: string;
  nodeProvider: string;
  status: UtopiaStatus;
  cycleBalance: bigint;      // Current cycle balance
  cycleAllocated: bigint;    // Total cycles allocated (lifetime)
  cycleBurnedIcp: bigint;    // 20% burned to ICP (VISIBLE)
  cycleBurnedNode: bigint;   // 80% routed to node provider
  computeProfile: ComputeProfile;
  coherence: number;         // Kuramoto order parameter R ∈ [0, 1]
  nodes: KuramotoNode[];     // 8 oscillators
  generation: bigint;        // Fibonacci generation (scaling tier)
  goldenPosition: [number, number];  // (x, y) in phyllotaxis field
  createdAt: bigint;
  lastTickAt: bigint;
  epoch: bigint;
}

export interface BurnEvent {
  id: bigint;
  utopiaId: bigint;
  epoch: bigint;
  cyclesBurned: bigint;   // Total cycles consumed
  toIcp: bigint;          // 20% → ICP public burn
  toNode: bigint;         // 80% → node provider
  coherence: number;      // Coherence at time of burn
  timestamp: bigint;
}

export interface FleetSnapshot {
  totalUtopias: bigint;
  activeUtopias: bigint;
  totalCyclesAllocated: bigint;
  totalBurnedIcp: bigint;    // Aggregate 20% ICP burns (VISIBLE METRIC)
  totalBurnedNode: bigint;   // Aggregate 80% node provider payments
  avgCoherence: number;
  phiHealth: number;         // φ-weighted composite health
  generation: bigint;
  tickCount: bigint;
  timestamp: bigint;
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS — Kuramoto Dynamics
// ══════════════════════════════════════════════════════════════════

/**
 * Compute Kuramoto order parameter (coherence) for a set of nodes.
 * R = |⟨e^(iθ)⟩| = |(1/N) Σⱼ e^(iθⱼ)|
 */
export function kuramotoOrder(nodes: KuramotoNode[]): number {
  if (nodes.length === 0) return 0.0;

  let sumSin = 0.0;
  let sumCos = 0.0;

  for (const n of nodes) {
    sumSin += Math.sin(n.phase);
    sumCos += Math.cos(n.phase);
  }

  const count = nodes.length;
  const r = Math.sqrt((sumSin / count) ** 2 + (sumCos / count) ** 2);
  return r;
}

/**
 * Generate cycles for a UTOPIA based on coherence.
 * Cycles = ⌊LOV × R × NODE_COUNT⌋
 */
export function generateCycles(coherence: number, nodeCount: number): number {
  return Math.floor(LOV * coherence * nodeCount);
}

/**
 * Apply 20/80 burn split to cycle consumption.
 */
export function applyBurnSplit(cyclesConsumed: bigint): {
  toIcp: bigint;
  toNode: bigint;
} {
  const toIcp = BigInt(Math.floor(Number(cyclesConsumed) * BURN_TO_ICP_FRACTION));
  const toNode = BigInt(Math.floor(Number(cyclesConsumed) * BURN_TO_NODE_FRACTION));
  return { toIcp, toNode };
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS — φ-Weighted Metrics
// ══════════════════════════════════════════════════════════════════

/**
 * Compute φ-weighted composite health across multiple UTOPIAs.
 * Each UTOPIA contributes weighted by φ^(i × φ^(-1) / (N+1)).
 */
export function phiWeightedHealth(utopias: UtopiaInstance[]): number {
  if (utopias.length === 0) return 1.0;

  let phiHealthSum = 0.0;
  let phiDenom = 0.0;

  for (let i = 0; i < utopias.length; i++) {
    const weight = Math.pow(PHI, (i * PHI_INV) / (utopias.length + 1));
    phiHealthSum += utopias[i].coherence * weight;
    phiDenom += weight;
  }

  return phiDenom > 0 ? phiHealthSum / phiDenom : 1.0;
}

/**
 * Compute average coherence across all active UTOPIAs.
 */
export function averageCoherence(utopias: UtopiaInstance[]): number {
  const active = utopias.filter(u => u.status === 'Active');
  if (active.length === 0) return 0.0;

  const sum = active.reduce((acc, u) => acc + u.coherence, 0.0);
  return sum / active.length;
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS — Visualization & Formatting
// ══════════════════════════════════════════════════════════════════

/**
 * Format cycles with appropriate unit suffix (T, B, M, K).
 */
export function formatCycles(cycles: bigint): string {
  const n = Number(cycles);
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return `${n}`;
}

/**
 * Convert golden position (x, y) to SVG coordinates for visualization.
 * Maps phyllotaxis field onto a viewBox.
 */
export function goldenPositionToSVG(
  position: [number, number],
  viewBoxSize: number = 1000
): [number, number] {
  const [x, y] = position;
  const maxRadius = Math.sqrt(MAX_UTOPIA_COUNT);
  const scale = viewBoxSize / (2 * maxRadius);
  const centerX = viewBoxSize / 2;
  const centerY = viewBoxSize / 2;
  return [centerX + x * scale, centerY + y * scale];
}

/**
 * Compute color for UTOPIA based on coherence (0 = red, 1 = green).
 */
export function coherenceColor(coherence: number): string {
  const r = Math.floor((1 - coherence) * 255);
  const g = Math.floor(coherence * 255);
  return `rgb(${r}, ${g}, 0)`;
}

/**
 * Compute color for UTOPIA status.
 */
export function statusColor(status: UtopiaStatus): string {
  switch (status) {
    case 'Provisioning':
      return '#FFD700'; // Gold
    case 'Active':
      return '#00FF00'; // Green
    case 'Scaling':
      return '#00BFFF'; // Deep sky blue
    case 'Degraded':
      return '#FFA500'; // Orange
    case 'Retired':
      return '#808080'; // Gray
    default:
      return '#FFFFFF'; // White
  }
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS — Burn Transparency Metrics
// ══════════════════════════════════════════════════════════════════

/**
 * Compute burn rate (cycles/second) from recent burn events.
 */
export function computeBurnRate(burnEvents: BurnEvent[]): number {
  if (burnEvents.length < 2) return 0.0;

  const recent = burnEvents.slice(-10); // Last 10 events
  const totalCycles = recent.reduce((acc, e) => acc + Number(e.cyclesBurned), 0);
  const firstTime = Number(recent[0].timestamp);
  const lastTime = Number(recent[recent.length - 1].timestamp);
  const duration = (lastTime - firstTime) / 1e9; // Convert nanoseconds to seconds

  return duration > 0 ? totalCycles / duration : 0.0;
}

/**
 * Compute visibility index: ratio of ICP burns to total burns.
 * Should be ≈ 0.20 (20%) for properly functioning cloud engine.
 */
export function computeVisibilityIndex(
  totalBurnedIcp: bigint,
  totalBurnedNode: bigint
): number {
  const total = Number(totalBurnedIcp) + Number(totalBurnedNode);
  if (total === 0) return 0.0;
  return Number(totalBurnedIcp) / total;
}

/**
 * Analyze burn events and return transparency report.
 */
export interface BurnTransparencyReport {
  totalCyclesBurned: bigint;
  visibleIcpBurn: bigint;
  nodeProviderPaid: bigint;
  visibilityIndex: number;
  burnRate: number;
  avgCoherence: number;
  status: 'TRANSPARENT' | 'DEGRADED' | 'OPAQUE';
  note: string;
}

export function analyzeBurnTransparency(
  burnEvents: BurnEvent[],
  snapshot: FleetSnapshot
): BurnTransparencyReport {
  const totalCyclesBurned = snapshot.totalBurnedIcp + snapshot.totalBurnedNode;
  const visibilityIndex = computeVisibilityIndex(
    snapshot.totalBurnedIcp,
    snapshot.totalBurnedNode
  );
  const burnRate = computeBurnRate(burnEvents);
  const avgCoherence = snapshot.avgCoherence;

  let status: 'TRANSPARENT' | 'DEGRADED' | 'OPAQUE';
  let note: string;

  if (visibilityIndex >= 0.18 && visibilityIndex <= 0.22) {
    status = 'TRANSPARENT';
    note = 'Burn split operating within target range (20/80). All burns visible to ICP dashboard.';
  } else if (visibilityIndex >= 0.10 && visibilityIndex < 0.18) {
    status = 'DEGRADED';
    note = 'Visibility index below target. Check UTOPIA health and burn routing.';
  } else {
    status = 'OPAQUE';
    note = 'Burn transparency compromised. Investigate immediately.';
  }

  return {
    totalCyclesBurned,
    visibleIcpBurn: snapshot.totalBurnedIcp,
    nodeProviderPaid: snapshot.totalBurnedNode,
    visibilityIndex,
    burnRate,
    avgCoherence,
    status,
    note,
  };
}

// ══════════════════════════════════════════════════════════════════
//  CLOUD ENGINE INTELLIGENCE CLASS
// ══════════════════════════════════════════════════════════════════

export class CloudEngineIntelligence {
  private canisterId: string | null = null;

  constructor(canisterId?: string) {
    this.canisterId = canisterId || null;
  }

  setCanisterId(id: string): void {
    this.canisterId = id;
  }

  getCanisterId(): string | null {
    return this.canisterId;
  }

  /**
   * Validate UTOPIA config before requesting.
   */
  validateConfig(config: Partial<UtopiaConfig>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!config.name || config.name.trim().length === 0) {
      errors.push('UTOPIA name is required');
    }

    if (!config.requestorPrincipal || config.requestorPrincipal.trim().length === 0) {
      errors.push('Requestor principal is required');
    }

    if (!config.nodeProvider || config.nodeProvider.trim().length === 0) {
      errors.push('Node provider principal is required');
    }

    if (
      !config.cycleAllocation ||
      config.cycleAllocation < BigInt(MIN_UTOPIA_CYCLES)
    ) {
      errors.push(`Cycle allocation must be at least ${MIN_UTOPIA_CYCLES}`);
    }

    if (!config.computeProfile) {
      errors.push('Compute profile is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Estimate φ-scaled cycle allocation for a compute profile.
   */
  estimateCycleAllocation(profile: ComputeProfile): bigint {
    const base = BigInt(MIN_UTOPIA_CYCLES);
    switch (profile) {
      case 'Light':
        return base; // φ^0 × base
      case 'Standard':
        return BigInt(Math.floor(Number(base) * PHI)); // φ^1 × base
      case 'Heavy':
        return BigInt(Math.floor(Number(base) * PHI * PHI)); // φ^2 × base
      case 'Enterprise':
        return BigInt(Math.floor(Number(base) * Math.pow(PHI, 3))); // φ^3 × base
      default:
        return base;
    }
  }

  /**
   * Predict fleet capacity remaining.
   */
  predictCapacity(snapshot: FleetSnapshot): {
    remaining: bigint;
    percentUsed: number;
    canProvision: boolean;
  } {
    const maxCapacity = BigInt(MAX_UTOPIA_COUNT);
    const remaining = maxCapacity - snapshot.totalUtopias;
    const percentUsed =
      maxCapacity > 0n ? Number((snapshot.totalUtopias * 100n) / maxCapacity) : 0.0;
    const canProvision = remaining > 0n;

    return {
      remaining,
      percentUsed,
      canProvision,
    };
  }

  /**
   * Analyze UTOPIA health and recommend action.
   */
  analyzeHealth(utopia: UtopiaInstance): {
    status: string;
    recommendation: string;
    action: 'NONE' | 'RECHARGE' | 'SCALE' | 'RETIRE';
  } {
    if (utopia.status === 'Retired') {
      return {
        status: 'Retired',
        recommendation: 'UTOPIA has been decommissioned',
        action: 'NONE',
      };
    }

    if (utopia.cycleBalance === 0n) {
      return {
        status: 'Degraded — Out of Cycles',
        recommendation: 'Recharge UTOPIA with additional cycles immediately',
        action: 'RECHARGE',
      };
    }

    if (utopia.coherence < 0.5) {
      return {
        status: 'Degraded — Low Coherence',
        recommendation:
          'Coherence below φ-floor. Check Kuramoto oscillator health.',
        action: 'NONE',
      };
    }

    if (utopia.cycleBalance < BigInt(MIN_UTOPIA_CYCLES / 10)) {
      return {
        status: 'Warning — Low Balance',
        recommendation: 'Cycle balance below 10% threshold. Consider recharging.',
        action: 'RECHARGE',
      };
    }

    if (utopia.coherence > 0.8 && utopia.status === 'Active') {
      return {
        status: 'Healthy — High Performance',
        recommendation:
          'UTOPIA operating at high coherence. Consider scaling if demand increases.',
        action: 'SCALE',
      };
    }

    return {
      status: 'Healthy',
      recommendation: 'UTOPIA operating normally',
      action: 'NONE',
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════

export default CloudEngineIntelligence;
