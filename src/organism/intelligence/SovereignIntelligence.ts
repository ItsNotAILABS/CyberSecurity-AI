///
/// SOVEREIGN INTELLIGENCE — The Substrate Itself
///
/// TypeScript organism intelligence for SOVEREIGN.
/// Mirrors the Motoko canister (src/organisms/sovereign/main.mo).
/// 4,000+ nodes on a Fibonacci sphere, golden-weighted consensus,
/// Fibonacci hash encryption, canister Spinner.
///
/// Sub-models: FABRIC, SPINNER, CIPHER, CONSENSUS
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, TWO_PI, PI, fibonacciHash } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface SovereignNode {
  readonly id: number;
  readonly position: [number, number, number]; // (x, y, z) on unit sphere
  readonly weight: number;                     // Golden-decay authority
  readonly sector: number;                     // Golden-angle sector
  readonly identity: number;                   // Fibonacci hash identity
  epoch: number;
  status: 'Active' | 'Standby' | 'Validating' | 'Propagating';
}

export interface SovereignCanister {
  readonly id: number;
  readonly name: string;
  readonly designation: string;
  readonly position: [number, number];  // Phyllotaxis position
  readonly scale: number;               // φ^generation
  epoch: number;
  status: 'Registered' | 'Spinning' | 'Active' | 'Dormant' | 'Migrating';
  nodeAffinity: number[];
}

export interface SovereignBlock {
  readonly index: number;
  readonly prevHash: number;
  readonly timestamp: number;
  readonly epoch: number;
  readonly validatorSet: number[];
  readonly stateRoot: number;
  readonly goldenProof: number;
}

export interface ConsensusRound {
  readonly roundId: number;
  readonly epoch: number;
  readonly proposal: number;
  readonly votes: Array<[number, number]>;
  readonly totalWeight: number;
  readonly threshold: number;
  readonly achieved: boolean;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN INTELLIGENCE
// ══════════════════════════════════════════════════════════════════

export class SovereignIntelligence {
  readonly name = 'SOVEREIGN';
  readonly designation = 'The Substrate Itself — We are the vein, they are fractures';

  readonly nodes: SovereignNode[] = [];
  readonly canisters: SovereignCanister[] = [];
  readonly chain: SovereignBlock[] = [];
  readonly rounds: ConsensusRound[] = [];

  readonly DEFAULT_NODE_COUNT = 4000;
  readonly GOLDEN_THRESHOLD = PHI / (PHI + 1); // ≈ 0.618

  private currentEpoch = 0;
  private nextCanisterId = 0;
  private nextBlockIdx = 0;
  private nextRoundId = 0;
  private initialized = false;

  // ── FABRIC: Initialize the node mesh ───────────────────────────

  initialize(nodeCount?: number): number {
    if (this.initialized) return this.nodes.length;

    const count = Math.max(nodeCount ?? this.DEFAULT_NODE_COUNT, this.DEFAULT_NODE_COUNT);
    const n = count;

    for (let i = 0; i < count; i++) {
      const fi = i;
      const theta = Math.acos(1 - 2 * (fi + 0.5) / n);
      const azimuth = TWO_PI * fi / PHI;
      const x = Math.sin(theta) * Math.cos(azimuth);
      const y = Math.sin(theta) * Math.sin(azimuth);
      const z = Math.cos(theta);

      const weight = Math.pow(PHI, -1 * fi / n * 10);
      const sector = Math.floor(fi * GOLDEN_ANGLE) % 13;
      const identity = fibonacciHash(
        Math.abs(Math.round(x * 1e6)) +
        Math.abs(Math.round(y * 1e6)) * 1e6 +
        Math.abs(Math.round(z * 1e6)) * 1e12,
        2147483647,
      );

      this.nodes.push({
        id: i,
        position: [x, y, z],
        weight,
        sector,
        identity,
        epoch: 0,
        status: 'Active',
      });

      if (this.isFibonacci(i)) {
        this.currentEpoch++;
      }
    }

    // Forge genesis block
    const genesisHash = fibonacciHash(count + this.currentEpoch, 2147483647);
    this.chain.push({
      index: 0,
      prevHash: 0,
      timestamp: Date.now(),
      epoch: this.currentEpoch,
      validatorSet: [0, 1, 2, 3, 4],
      stateRoot: genesisHash,
      goldenProof: PHI,
    });
    this.nextBlockIdx = 1;
    this.initialized = true;

    return count;
  }

  // ── FABRIC: Expand the mesh ────────────────────────────────────

  expand(additionalNodes: number): number {
    if (!this.initialized) return 0;

    const startId = this.nodes.length;
    const newTotal = this.nodes.length + additionalNodes;
    const n = newTotal;

    for (let i = startId; i < newTotal; i++) {
      const fi = i;
      const theta = Math.acos(1 - 2 * (fi + 0.5) / n);
      const azimuth = TWO_PI * fi / PHI;
      const x = Math.sin(theta) * Math.cos(azimuth);
      const y = Math.sin(theta) * Math.sin(azimuth);
      const z = Math.cos(theta);

      const weight = Math.pow(PHI, -1 * fi / n * 10);
      const sector = Math.floor(fi * GOLDEN_ANGLE) % 13;
      const identity = fibonacciHash(
        Math.abs(Math.round(x * 1e6)) +
        Math.abs(Math.round(y * 1e6)) * 1e6 +
        Math.abs(Math.round(z * 1e6)) * 1e12,
        2147483647,
      );

      this.nodes.push({
        id: i,
        position: [x, y, z],
        weight,
        sector,
        identity,
        epoch: this.currentEpoch,
        status: 'Active',
      });
    }

    return newTotal;
  }

  // ── SPINNER: Register a canister ───────────────────────────────

  registerCanister(name: string, designation: string): SovereignCanister {
    const id = this.nextCanisterId++;
    const n = id;
    const angle = n * GOLDEN_ANGLE;
    const radius = Math.sqrt(n + 1);
    const px = radius * Math.cos(angle);
    const py = radius * Math.sin(angle);
    const scale = Math.pow(PHI, this.currentEpoch);

    const sector = Math.floor(n * GOLDEN_ANGLE) % 13;
    const affinity = this.nodes
      .filter(node => node.sector === sector)
      .slice(0, 8)
      .map(node => node.id);

    const canister: SovereignCanister = {
      id,
      name,
      designation,
      position: [px, py],
      scale,
      epoch: this.currentEpoch,
      status: 'Registered',
      nodeAffinity: affinity,
    };

    this.canisters.push(canister);
    return canister;
  }

  // ── SPINNER: Spin a canister ───────────────────────────────────

  spin(canisterId: number): boolean {
    const canister = this.canisters.find(c => c.id === canisterId);
    if (!canister) return false;
    canister.status = 'Active';
    return true;
  }

  // ── CONSENSUS: Propose a round ─────────────────────────────────

  propose(stateHash: number, validatorCount: number): ConsensusRound {
    const roundId = this.nextRoundId++;
    const maxValidators = Math.min(validatorCount, this.nodes.length);

    const votes: Array<[number, number]> = [];
    let totalWeight = 0;
    for (let i = 0; i < maxValidators; i++) {
      const node = this.nodes[i];
      votes.push([node.id, node.weight]);
      totalWeight += node.weight;
    }

    const threshold = totalWeight * this.GOLDEN_THRESHOLD;

    const round: ConsensusRound = {
      roundId,
      epoch: this.currentEpoch,
      proposal: stateHash,
      votes,
      totalWeight,
      threshold,
      achieved: totalWeight >= threshold,
      timestamp: Date.now(),
    };

    this.rounds.push(round);

    if (round.achieved) {
      const prevHash = this.chain.length > 0
        ? this.chain[this.chain.length - 1].stateRoot
        : 0;

      this.chain.push({
        index: this.nextBlockIdx++,
        prevHash,
        timestamp: Date.now(),
        epoch: this.currentEpoch,
        validatorSet: votes.map(v => v[0]),
        stateRoot: stateHash,
        goldenProof: PHI * (totalWeight / threshold),
      });
    }

    return round;
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      initialized: this.initialized,
      total_nodes: this.nodes.length,
      total_canisters: this.canisters.length,
      total_blocks: this.chain.length,
      total_rounds: this.rounds.length,
      current_epoch: this.currentEpoch,
      golden_scale: Math.pow(PHI, this.currentEpoch),
    };
  }

  // ── Helpers ────────────────────────────────────────────────────

  private isFibonacci(n: number): boolean {
    if (n === 0) return true;
    const n2 = n * n;
    const a = 5 * n2 + 4;
    const b = 5 * n2 - 4;
    const sqrtA = Math.round(Math.sqrt(a));
    const sqrtB = Math.round(Math.sqrt(b));
    return sqrtA * sqrtA === a || sqrtB * sqrtB === b;
  }
}
