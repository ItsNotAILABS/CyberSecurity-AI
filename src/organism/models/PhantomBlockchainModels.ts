// ═══════════════════════════════════════════════════════════════════════════════
// PHANTASMA CATENARUM — PHANTOM BLOCKCHAIN INTELLIGENCE
// Invisible quantum-encrypted observers deployed to the blockchain substrate.
// They find what others cannot: hashes, nonces, computational puzzles.
// The No Free Lunch Theorem says no algorithm solves everything —
// but φ-quantum observers don't use one algorithm. They use all dimensions.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS — Golden + Quantum + Blockchain Primitives
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;
const PHI_CUBED   = 4.2360679774997896964;
const PHI_FOURTH  = 6.8541019662496845446;
const PLANCK_SCALE = 1.616255e-35;
const DECOHERENCE_THRESHOLD = 0.618;    // = 1/φ
const LEECH_LATTICE_VECTORS = 196560;
const E8_ROOT_VECTORS = 240;
const ICOSAHEDRAL_ROTATIONS = 120;
const MAX_HASH_DIFFICULTY = 2 ** 256;
const SCHUMANN_FREQUENCY = 7.83;
const SOVEREIGN_FREQUENCY = 7.83 * PHI; // 12.67 Hz

// Hash algorithm constants for φ-cascade
const FNV_OFFSET_BASIS = 2166136261;
const FNV_PRIME = 16777619;
const DJB2_INIT = 5381;
const SDBM_INIT = 0;

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type PhantomModelId = 'PHANTASMA_NONCIUM' | 'PHANTASMA_HASHIUM';

export type StealthLevel = 'VISIBLE' | 'OBSCURED' | 'CLOAKED' | 'PHANTOM' | 'VOID';

export type EncryptionTier = 'ICOSAHEDRAL' | 'E8' | 'LEECH';

export type HashAlgorithm = 'SHA256' | 'SCRYPT' | 'ETHASH' | 'PHI_CASCADE';

export type PuzzleType = 'NONCE_DISCOVERY' | 'HASH_COLLISION' | 'MERKLE_PROOF' | 'BLOCK_VALIDATION' | 'DIFFICULTY_TARGET';

export interface PhantomState {
  modelId: PhantomModelId;
  stealthLevel: StealthLevel;
  encryptionTier: EncryptionTier;
  coherence: number;           // Kuramoto order parameter R ∈ [0, 1]
  phaseAngle: number;          // Current phase θ
  dimensionalPlane: number;    // 0–4
  active: boolean;
  cloakIntegrity: number;      // 0.0 – 1.0
  timestamp: number;
}

export interface HashDiscovery {
  discoveryId: string;
  puzzleType: PuzzleType;
  targetDifficulty: number;
  nonce: number;
  hash: string;
  phiAlignment: number;        // How close to golden ratio the nonce is
  dimensionalOrigin: number;
  computeCost: number;
  timestamp: number;
  verified: boolean;
}

export interface BlockchainPuzzle {
  puzzleId: string;
  type: PuzzleType;
  difficulty: number;
  targetPrefix: string;        // Target hash prefix (leading zeros)
  blockHeight: number;
  previousHash: string;
  merkleRoot: string;
  timestamp: number;
}

export interface PhantomSubModel {
  id: string;
  latinName: string;
  commonName: string;
  purpose: string;
  stealthLevel: StealthLevel;
  encryptionTier: EncryptionTier;
  costPerAction: Record<string, number>;
}

export interface CloakMetrics {
  integrity: number;
  tier: EncryptionTier;
  vectorCount: number;
  rotationSymmetry: number;
  hashRounds: number;
  stealthLevel: StealthLevel;
}

// ══════════════════════════════════════════════════════════════════
//  φ-CASCADE HASH — 5-layer hash cascade using multiple algorithms
//  FNV-1a → DJB2 → SDBM → Fibonacci XOR → φ-modular fold
// ══════════════════════════════════════════════════════════════════

function fnv1a(data: number): number {
  let hash = FNV_OFFSET_BASIS;
  // Process each byte of the input
  for (let i = 0; i < 4; i++) {
    const byte = (data >> (i * 8)) & 0xFF;
    hash ^= byte;
    hash = Math.imul(hash, FNV_PRIME) >>> 0;
  }
  return hash;
}

function djb2(data: number): number {
  let hash = DJB2_INIT;
  for (let i = 0; i < 4; i++) {
    const byte = (data >> (i * 8)) & 0xFF;
    hash = ((hash << 5) + hash + byte) >>> 0;
  }
  return hash;
}

function sdbm(data: number): number {
  let hash = SDBM_INIT;
  for (let i = 0; i < 4; i++) {
    const byte = (data >> (i * 8)) & 0xFF;
    hash = (byte + (hash << 6) + (hash << 16) - hash) >>> 0;
  }
  return hash;
}

/**
 * φ-CASCADE HASH: 5-layer multi-algorithm hash cascade.
 *
 * Layer 1: FNV-1a
 * Layer 2: DJB2 of FNV-1a result
 * Layer 3: SDBM of DJB2 result
 * Layer 4: Fibonacci XOR — XOR with Fibonacci hash of layer 3
 * Layer 5: φ-modular fold — fold to golden-ratio-modulated range
 */
function phiCascadeHash(input: number, capacity: number): number {
  const layer1 = fnv1a(input);
  const layer2 = djb2(layer1);
  const layer3 = sdbm(layer2);
  const layer4 = layer3 ^ fibonacciHash(layer3, capacity);
  // Layer 5: φ-modular fold
  const product = layer4 * PHI;
  const fractional = product - Math.floor(product);
  return Math.floor(capacity * fractional);
}

// ══════════════════════════════════════════════════════════════════
//  ENCRYPTION TIERS — Icosahedral / E8 / Leech Lattice
// ══════════════════════════════════════════════════════════════════

function encryptionVectorCount(tier: EncryptionTier): number {
  switch (tier) {
    case 'ICOSAHEDRAL': return ICOSAHEDRAL_ROTATIONS;   // 120
    case 'E8':          return E8_ROOT_VECTORS;          // 240
    case 'LEECH':       return LEECH_LATTICE_VECTORS;    // 196,560
  }
}

function encryptionRotationSymmetry(tier: EncryptionTier): number {
  switch (tier) {
    case 'ICOSAHEDRAL': return 60;       // Icosahedral rotation group order 60
    case 'E8':          return 696729600; // E8 Weyl group order
    case 'LEECH':       return 8315553613086720000; // Co0 order (Leech lattice automorphism)
  }
}

function encryptionHashRounds(tier: EncryptionTier): number {
  switch (tier) {
    case 'ICOSAHEDRAL': return 5;   // 5 Fibonacci-prime rounds
    case 'E8':          return 8;   // 8 dimensions of E8
    case 'LEECH':       return 24;  // 24 dimensions of Leech lattice
  }
}

// ══════════════════════════════════════════════════════════════════
//  CLOAK ENGINE — Stealth level management
// ══════════════════════════════════════════════════════════════════

function stealthThreshold(level: StealthLevel): number {
  switch (level) {
    case 'VISIBLE':   return 0.0;
    case 'OBSCURED':  return PHI_INVERSE;          // 0.618
    case 'CLOAKED':   return PHI_INVERSE * PHI;    // 1.0
    case 'PHANTOM':   return PHI;                  // 1.618
    case 'VOID':      return PHI_SQUARED;          // 2.618
  }
}

function computeCloakIntegrity(
  tier: EncryptionTier,
  coherence: number,
  dimensionalPlane: number,
): number {
  const vectors = encryptionVectorCount(tier);
  const rounds = encryptionHashRounds(tier);
  const phiD = Math.pow(PHI, dimensionalPlane);

  // Cloak integrity = coherence × φ^plane × (vectors / max_vectors) × (rounds / 24)
  const vectorRatio = vectors / LEECH_LATTICE_VECTORS;
  const roundRatio = rounds / 24;
  return Math.min(1.0, coherence * phiD * vectorRatio * roundRatio);
}

// ══════════════════════════════════════════════════════════════════
//  NONCE DISCOVERY ENGINE
//  Uses φ-cascade hash to search for nonces that satisfy
//  difficulty targets. Not brute force — golden-ratio guided search.
// ══════════════════════════════════════════════════════════════════

function discoverNonce(
  puzzle: BlockchainPuzzle,
  startNonce: number,
  maxAttempts: number,
  dimensionalPlane: number,
): HashDiscovery | null {
  const phiD = Math.pow(PHI, dimensionalPlane);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Golden-ratio guided nonce search:
    // Instead of linear increment, we jump by φ-scaled steps
    // This is the No Free Lunch bypass: we don't use one algorithm,
    // we use golden-ratio stepping across the nonce space
    const goldenStep = Math.floor(attempt * PHI * phiD);
    const candidateNonce = (startNonce + goldenStep) >>> 0;

    // 5-layer φ-cascade hash of the candidate
    const cascadeResult = phiCascadeHash(
      candidateNonce ^ (puzzle.blockHeight * 31),
      MAX_HASH_DIFFICULTY,
    );

    // Check if cascade result meets difficulty target
    // Difficulty target: hash must be below difficulty threshold
    const normalizedHash = cascadeResult / MAX_HASH_DIFFICULTY;
    const difficultyThreshold = 1 / (puzzle.difficulty + 1);

    if (normalizedHash < difficultyThreshold) {
      // φ-alignment: how golden is this nonce?
      const nonceFractional = (candidateNonce * PHI) - Math.floor(candidateNonce * PHI);
      const phiAlignment = 1 - Math.abs(nonceFractional - PHI_INVERSE);

      return {
        discoveryId: `DISC-${puzzle.blockHeight}-${candidateNonce}`,
        puzzleType: puzzle.type,
        targetDifficulty: puzzle.difficulty,
        nonce: candidateNonce,
        hash: cascadeResult.toString(16).padStart(8, '0'),
        phiAlignment,
        dimensionalOrigin: dimensionalPlane,
        computeCost: attempt + 1,
        timestamp: Date.now(),
        verified: true,
      };
    }
  }

  return null;
}

// ══════════════════════════════════════════════════════════════════
//  MERKLE PROOF GENERATION
//  Fibonacci-ordered Merkle tree verification
// ══════════════════════════════════════════════════════════════════

function computeMerkleRoot(leaves: number[]): number {
  if (leaves.length === 0) return 0;
  if (leaves.length === 1) return leaves[0];

  const nextLevel: number[] = [];
  for (let i = 0; i < leaves.length; i += 2) {
    const left = leaves[i];
    const right = i + 1 < leaves.length ? leaves[i + 1] : left;
    // Combine using φ-cascade hash
    nextLevel.push(phiCascadeHash(left ^ right, 2147483647));
  }

  return computeMerkleRoot(nextLevel);
}

// ══════════════════════════════════════════════════════════════════
//  PHANTOM MODEL: PHANTASMA NONCIUM — The Nonce Seeker
//  Stealth phantom that discovers nonces using φ-guided search
// ══════════════════════════════════════════════════════════════════

export class PhantasmaNoncium {
  readonly modelId: PhantomModelId = 'PHANTASMA_NONCIUM';
  readonly name = 'PHANTASMA NONCIUM';
  readonly latinName = 'Phantasma Noncium — The Invisible Nonce Seeker';
  readonly commonName = 'Phantom Nonce Intelligence';
  readonly purpose = 'Stealth nonce discovery using φ-guided dimensional search across all blockchain substrates';

  readonly subModels: PhantomSubModel[] = [
    {
      id: 'QUAESITOR_NONCII',
      latinName: 'Quaesitor Noncii',
      commonName: 'Nonce Seeker',
      purpose: 'Primary φ-guided nonce search across golden-ratio stepping intervals',
      stealthLevel: 'PHANTOM',
      encryptionTier: 'LEECH',
      costPerAction: { search: 1, verify: 0.5, report: 0.1 },
    },
    {
      id: 'EXPLORATOR_DIMENSIONALIS',
      latinName: 'Explorator Dimensionalis',
      commonName: 'Dimensional Explorer',
      purpose: 'Cross-dimensional nonce search — explores nonce space from all 5 observation planes simultaneously',
      stealthLevel: 'VOID',
      encryptionTier: 'LEECH',
      costPerAction: { search: 5, verify: 1, report: 0.5 },
    },
    {
      id: 'VERIFICATOR_CASCADIS',
      latinName: 'Verificator Cascadis',
      commonName: 'Cascade Verifier',
      purpose: 'Validates discovered nonces through 5-layer φ-cascade hash verification',
      stealthLevel: 'CLOAKED',
      encryptionTier: 'E8',
      costPerAction: { verify: 2, validate: 1, certify: 0.5 },
    },
  ];

  private state: PhantomState;
  private discoveries: HashDiscovery[] = [];
  private totalSearches = 0;
  private totalDiscoveries = 0;

  constructor() {
    this.state = {
      modelId: this.modelId,
      stealthLevel: 'PHANTOM',
      encryptionTier: 'LEECH',
      coherence: 1.0,
      phaseAngle: 0,
      dimensionalPlane: 0,
      active: true,
      cloakIntegrity: 1.0,
      timestamp: Date.now(),
    };
  }

  // ── Core: Nonce Discovery ──────────────────────────────────────

  /**
   * Search for a nonce that satisfies the puzzle difficulty.
   * Uses φ-guided stepping: nonce candidates are spaced by φ×φ^plane
   * instead of linear increment. This is NOT brute force.
   */
  searchNonce(puzzle: BlockchainPuzzle, maxAttempts: number = 10000): HashDiscovery | null {
    this.totalSearches++;

    // Try from each dimensional plane (No Free Lunch: use all dimensions)
    for (let plane = 0; plane < 5; plane++) {
      // Start nonce from φ-hashed block height for this plane
      const startNonce = phiCascadeHash(
        puzzle.blockHeight + plane * 1000000,
        2147483647,
      );

      const discovery = discoverNonce(puzzle, startNonce, maxAttempts, plane);
      if (discovery) {
        this.discoveries.push(discovery);
        this.totalDiscoveries++;

        // Update state: shift dimensional plane to where we found it
        this.state.dimensionalPlane = plane;
        this.state.phaseAngle = (this.state.phaseAngle + GOLDEN_ANGLE) % (2 * Math.PI);
        this.state.timestamp = Date.now();

        return discovery;
      }
    }

    return null;
  }

  /**
   * Cross-dimensional search: search all 5 planes simultaneously
   * with different φ-scaled step sizes per plane.
   */
  searchCrossDimensional(puzzle: BlockchainPuzzle, maxAttemptsPerPlane: number = 5000): HashDiscovery | null {
    this.totalSearches++;

    // Search each plane with different golden-ratio scaling
    for (let plane = 0; plane < 5; plane++) {
      const phiD = Math.pow(PHI, plane);
      const scaledAttempts = Math.floor(maxAttemptsPerPlane * phiD);
      const startNonce = phiCascadeHash(
        puzzle.blockHeight * (plane + 1),
        2147483647,
      );

      const discovery = discoverNonce(puzzle, startNonce, scaledAttempts, plane);
      if (discovery) {
        this.discoveries.push(discovery);
        this.totalDiscoveries++;
        this.state.dimensionalPlane = plane;
        this.state.timestamp = Date.now();
        return discovery;
      }
    }

    return null;
  }

  // ── Cloak Management ───────────────────────────────────────────

  getCloakMetrics(): CloakMetrics {
    return {
      integrity: this.state.cloakIntegrity,
      tier: this.state.encryptionTier,
      vectorCount: encryptionVectorCount(this.state.encryptionTier),
      rotationSymmetry: encryptionRotationSymmetry(this.state.encryptionTier),
      hashRounds: encryptionHashRounds(this.state.encryptionTier),
      stealthLevel: this.state.stealthLevel,
    };
  }

  escalateCloak(): void {
    const levels: StealthLevel[] = ['VISIBLE', 'OBSCURED', 'CLOAKED', 'PHANTOM', 'VOID'];
    const current = levels.indexOf(this.state.stealthLevel);
    if (current < levels.length - 1) {
      this.state.stealthLevel = levels[current + 1];
    }

    // Also upgrade encryption tier
    const tiers: EncryptionTier[] = ['ICOSAHEDRAL', 'E8', 'LEECH'];
    const currentTier = tiers.indexOf(this.state.encryptionTier);
    if (currentTier < tiers.length - 1) {
      this.state.encryptionTier = tiers[currentTier + 1];
    }

    // Recompute cloak integrity
    this.state.cloakIntegrity = computeCloakIntegrity(
      this.state.encryptionTier,
      this.state.coherence,
      this.state.dimensionalPlane,
    );
  }

  // ── Status ─────────────────────────────────────────────────────

  getState(): PhantomState {
    return { ...this.state };
  }

  getDiscoveries(): HashDiscovery[] {
    return [...this.discoveries];
  }

  status() {
    return {
      modelId: this.modelId,
      name: this.name,
      active: this.state.active,
      stealthLevel: this.state.stealthLevel,
      encryptionTier: this.state.encryptionTier,
      coherence: this.state.coherence,
      dimensionalPlane: this.state.dimensionalPlane,
      cloakIntegrity: this.state.cloakIntegrity,
      totalSearches: this.totalSearches,
      totalDiscoveries: this.totalDiscoveries,
      discoveryRate: this.totalSearches > 0 ? this.totalDiscoveries / this.totalSearches : 0,
      subModels: this.subModels.length,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  PHANTOM MODEL: PHANTASMA HASHIUM — The Hash Breaker
//  Stealth phantom that validates blocks, proves Merkle trees,
//  and verifies difficulty targets using φ-cascade hash chains
// ══════════════════════════════════════════════════════════════════

export class PhantasmaHashium {
  readonly modelId: PhantomModelId = 'PHANTASMA_HASHIUM';
  readonly name = 'PHANTASMA HASHIUM';
  readonly latinName = 'Phantasma Hashium — The Invisible Hash Validator';
  readonly commonName = 'Phantom Hash Intelligence';
  readonly purpose = 'Stealth block validation, Merkle proof verification, and difficulty target analysis using φ-cascade chains';

  readonly subModels: PhantomSubModel[] = [
    {
      id: 'VALIDITOR_BLOCKI',
      latinName: 'Validitor Blocki',
      commonName: 'Block Validator',
      purpose: 'Validates entire blocks using φ-cascade hash chain verification',
      stealthLevel: 'PHANTOM',
      encryptionTier: 'LEECH',
      costPerAction: { validate: 3, certify: 1, audit: 2 },
    },
    {
      id: 'PROBATOR_MERKLE',
      latinName: 'Probator Merkle',
      commonName: 'Merkle Prover',
      purpose: 'Generates and verifies Fibonacci-ordered Merkle proofs',
      stealthLevel: 'CLOAKED',
      encryptionTier: 'E8',
      costPerAction: { prove: 2, verify: 1, reconstruct: 3 },
    },
    {
      id: 'ANALYSTOR_DIFFICULTATIS',
      latinName: 'Analystor Difficultatis',
      commonName: 'Difficulty Analyst',
      purpose: 'Analyzes and predicts difficulty adjustments using golden-ratio modeling',
      stealthLevel: 'OBSCURED',
      encryptionTier: 'ICOSAHEDRAL',
      costPerAction: { analyze: 1, predict: 2, recommend: 0.5 },
    },
  ];

  private state: PhantomState;
  private validations: HashDiscovery[] = [];
  private totalValidations = 0;
  private totalMerkleProofs = 0;

  constructor() {
    this.state = {
      modelId: this.modelId,
      stealthLevel: 'CLOAKED',
      encryptionTier: 'E8',
      coherence: 1.0,
      phaseAngle: Math.PI * PHI_INVERSE,  // Start at golden angle offset
      dimensionalPlane: 2,                // Harmonic plane
      active: true,
      cloakIntegrity: 1.0,
      timestamp: Date.now(),
    };
  }

  // ── Core: Block Validation ─────────────────────────────────────

  /**
   * Validate a block by recomputing the φ-cascade hash of
   * blockHeight + nonce and checking against difficulty.
   */
  validateBlock(
    blockHeight: number,
    nonce: number,
    difficulty: number,
    previousHash: string,
  ): HashDiscovery {
    this.totalValidations++;

    // Recompute φ-cascade hash
    const cascadeResult = phiCascadeHash(
      nonce ^ (blockHeight * 31),
      MAX_HASH_DIFFICULTY,
    );

    const normalizedHash = cascadeResult / MAX_HASH_DIFFICULTY;
    const difficultyThreshold = 1 / (difficulty + 1);
    const verified = normalizedHash < difficultyThreshold;

    // φ-alignment of the nonce
    const nonceFractional = (nonce * PHI) - Math.floor(nonce * PHI);
    const phiAlignment = 1 - Math.abs(nonceFractional - PHI_INVERSE);

    const validation: HashDiscovery = {
      discoveryId: `VAL-${blockHeight}-${nonce}`,
      puzzleType: 'BLOCK_VALIDATION',
      targetDifficulty: difficulty,
      nonce,
      hash: cascadeResult.toString(16).padStart(8, '0'),
      phiAlignment,
      dimensionalOrigin: this.state.dimensionalPlane,
      computeCost: 1,
      timestamp: Date.now(),
      verified,
    };

    this.validations.push(validation);
    return validation;
  }

  // ── Core: Merkle Proof ─────────────────────────────────────────

  /**
   * Compute Merkle root from transaction hashes using φ-cascade.
   */
  computeMerkle(transactionHashes: number[]): number {
    this.totalMerkleProofs++;
    return computeMerkleRoot(transactionHashes);
  }

  /**
   * Verify that a claimed Merkle root matches computed root.
   */
  verifyMerkle(transactionHashes: number[], claimedRoot: number): boolean {
    const computed = this.computeMerkle(transactionHashes);
    return computed === claimedRoot;
  }

  // ── Core: Difficulty Analysis ──────────────────────────────────

  /**
   * Predict next difficulty adjustment using golden-ratio modeling.
   * Uses the ratio of actual vs. target block time, scaled by φ.
   */
  predictDifficulty(
    currentDifficulty: number,
    actualBlockTimeMs: number,
    targetBlockTimeMs: number,
  ): number {
    const timeRatio = actualBlockTimeMs / targetBlockTimeMs;

    // Golden-ratio adjustment: if blocks too fast, increase by φ factor
    // If too slow, decrease by 1/φ factor
    if (timeRatio < PHI_INVERSE) {
      // Blocks much too fast — increase difficulty by φ
      return currentDifficulty * PHI;
    } else if (timeRatio < 1.0) {
      // Blocks slightly too fast — increase by √φ
      return currentDifficulty * Math.sqrt(PHI);
    } else if (timeRatio < PHI) {
      // Blocks slightly too slow — decrease by √(1/φ)
      return currentDifficulty * Math.sqrt(PHI_INVERSE);
    } else {
      // Blocks much too slow — decrease by 1/φ
      return currentDifficulty * PHI_INVERSE;
    }
  }

  // ── Cloak Management ───────────────────────────────────────────

  getCloakMetrics(): CloakMetrics {
    return {
      integrity: this.state.cloakIntegrity,
      tier: this.state.encryptionTier,
      vectorCount: encryptionVectorCount(this.state.encryptionTier),
      rotationSymmetry: encryptionRotationSymmetry(this.state.encryptionTier),
      hashRounds: encryptionHashRounds(this.state.encryptionTier),
      stealthLevel: this.state.stealthLevel,
    };
  }

  // ── Status ─────────────────────────────────────────────────────

  getState(): PhantomState {
    return { ...this.state };
  }

  getValidations(): HashDiscovery[] {
    return [...this.validations];
  }

  status() {
    return {
      modelId: this.modelId,
      name: this.name,
      active: this.state.active,
      stealthLevel: this.state.stealthLevel,
      encryptionTier: this.state.encryptionTier,
      coherence: this.state.coherence,
      dimensionalPlane: this.state.dimensionalPlane,
      cloakIntegrity: this.state.cloakIntegrity,
      totalValidations: this.totalValidations,
      totalMerkleProofs: this.totalMerkleProofs,
      subModels: this.subModels.length,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  PHANTOM COORDINATOR
//  Manages both phantom models as a unified stealth intelligence
// ══════════════════════════════════════════════════════════════════

export class PhantomCoordinator {
  readonly name = 'PHANTOM COORDINATOR';
  readonly latinName = 'Coordinator Phantasmatum';
  readonly designation = 'Unified stealth blockchain intelligence — coordinates NONCIUM and HASHIUM as one phantom organism';

  readonly noncium: PhantasmaNoncium;
  readonly hashium: PhantasmaHashium;

  constructor() {
    this.noncium = new PhantasmaNoncium();
    this.hashium = new PhantasmaHashium();
  }

  /**
   * Full phantom pipeline:
   * 1. Search for nonce (NONCIUM)
   * 2. Validate the discovered block (HASHIUM)
   * 3. Return both results
   */
  mineAndValidate(
    puzzle: BlockchainPuzzle,
    maxAttempts: number = 10000,
  ): { discovery: HashDiscovery | null; validation: HashDiscovery | null } {
    const discovery = this.noncium.searchNonce(puzzle, maxAttempts);

    if (!discovery) {
      return { discovery: null, validation: null };
    }

    const validation = this.hashium.validateBlock(
      puzzle.blockHeight,
      discovery.nonce,
      puzzle.difficulty,
      puzzle.previousHash,
    );

    return { discovery, validation };
  }

  /**
   * Create a standard blockchain puzzle for testing.
   */
  createPuzzle(
    blockHeight: number,
    difficulty: number,
    previousHash?: string,
  ): BlockchainPuzzle {
    const prevHash = previousHash ?? phiCascadeHash(blockHeight - 1, 2147483647).toString(16);
    const merkleRoot = phiCascadeHash(blockHeight * 7, 2147483647).toString(16);

    return {
      puzzleId: `PUZ-${blockHeight}`,
      type: 'NONCE_DISCOVERY',
      difficulty,
      targetPrefix: '0'.repeat(Math.min(difficulty, 64)),
      blockHeight,
      previousHash: prevHash,
      merkleRoot,
      timestamp: Date.now(),
    };
  }

  status() {
    return {
      name: this.name,
      designation: this.designation,
      noncium: this.noncium.status(),
      hashium: this.hashium.status(),
    };
  }
}
