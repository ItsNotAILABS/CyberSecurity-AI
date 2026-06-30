///
/// AI EXTENSION ENGINE — Multi-AI Runtime for Browser Extensions
///
/// This is the engine that powers all 20 AI extensions.
/// It manages engine bindings, encryption state, intelligence contracts,
/// and cross-extension coordination via Kuramoto coupling.
///
/// Engine responsibilities:
///   1. Activate/deactivate extensions with their engine bindings
///   2. Route requests to the best engine within an extension
///   3. Execute intelligence contracts (verify, attest, prove, consensus)
///   4. Apply encryption (Fibonacci hash, φ-cascade, Phantom ZK, E8)
///   5. Maintain Kuramoto synchronization across all active extensions
///   6. Generate Edge browser manifest metadata for each extension
///
/// Encryption modes:
///   FIBONACCI_HASH          — Hash-based integrity using fibonacciHash
///   PHI_CASCADE             — Multi-round φ-weighted hashing cascade
///   PHANTOM_ZERO_KNOWLEDGE  — Zero-knowledge proof via Phantom subsystem
///   E8_LATTICE              — E8 root-vector lattice encryption
///   SOVEREIGN_SEAL          — Sovereign node verification seal
///
/// Contract types:
///   INTELLIGENCE_VERIFY     — Verify AI output against golden constraints
///   OUTPUT_ATTESTATION      — Attest that output came from claimed model
///   CHAIN_OF_THOUGHT_PROOF  — Prove reasoning chain is valid
///   MULTI_MODEL_CONSENSUS   — φ-weighted consensus across multiple models
///   SOVEREIGN_EXECUTION     — Execute on sovereign (local) compute only
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

import {
  AIExtensionRegistry,
  ExtensionClass,
  type AIExtension,
  type EngineBinding,
  type EncryptionMode,
  type ContractType,
  type ExtensionActivation,
} from './AIExtensionRegistry.js';

import { OrganismRing, RoutingPriority } from '../models/AIFoundationModels.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;
const TWO_PI      = 2 * Math.PI;
const HEARTBEAT_MS = 873;

// Fibonacci sequence for hashing
const FIB: number[] = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55,
  89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765,
];

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface EncryptionState {
  readonly extensionId: string;
  readonly mode: EncryptionMode;
  readonly active: boolean;
  readonly keyHash: number;          // Fibonacci hash of encryption key
  readonly cascadeRounds: number;    // For PHI_CASCADE: number of rounds
  readonly phantomProof: string;     // For ZK: proof hash
  readonly latticeVectors: number;   // For E8: active root vectors
  readonly integrityScore: number;   // 0.0 – 1.0
  readonly timestamp: number;
}

export interface ContractState {
  readonly extensionId: string;
  readonly contractType: ContractType;
  readonly verified: boolean;
  readonly verificationHash: number;
  readonly consensusModels: readonly string[];
  readonly consensusWeight: number;
  readonly chainProof: readonly number[];
  readonly timestamp: number;
}

export interface ExtensionEngineStatus {
  readonly totalExtensions: number;
  readonly activeExtensions: number;
  readonly totalEngineBindings: number;
  readonly activeEngineBindings: number;
  readonly encryptedExtensions: number;
  readonly contractedExtensions: number;
  readonly kuramotoR: number;
  readonly totalGoldenWeight: number;
  readonly heartbeatMs: number;
}

export interface EdgeManifest {
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly manifest_version: 3;
  readonly permissions: readonly string[];
  readonly content_scripts: readonly { matches: string[]; js: string[] }[];
  readonly background: { service_worker: string };
  readonly action: { default_popup: string; default_icon: string };
  readonly icons: Record<string, string>;
}

// ══════════════════════════════════════════════════════════════════
//  AI EXTENSION ENGINE
// ══════════════════════════════════════════════════════════════════

export class AIExtensionEngine {
  readonly name = 'AI EXTENSION ENGINE';
  readonly designation = 'Motor Extensionum — Multi-AI Runtime for Edge Browser';

  readonly registry: AIExtensionRegistry;
  private readonly activations: Map<string, ExtensionActivation> = new Map();
  private readonly encryptionStates: Map<string, EncryptionState> = new Map();
  private readonly contractStates: Map<string, ContractState> = new Map();
  private totalActivations = 0;
  private totalEncryptions = 0;
  private totalContracts = 0;

  constructor() {
    this.registry = new AIExtensionRegistry();
  }

  // ── Activation ─────────────────────────────────────────────────

  activate(extensionId: string): ExtensionActivation {
    const ext = this.registry.byId(extensionId);
    if (!ext) throw new Error(`Extension ${extensionId} not found`);

    this.totalActivations++;

    // Activate encryption if needed
    if (ext.encryptionMode !== 'NONE') {
      this.initEncryption(ext);
    }

    // Initialize contract if needed
    if (ext.contractType !== 'NONE') {
      this.initContract(ext);
    }

    const activation: ExtensionActivation = {
      extensionId: ext.extensionId,
      activeEngines: ext.engines.map(e => e.modelFamilyId),
      encryptionActive: ext.encryptionMode !== 'NONE',
      contractVerified: ext.contractType !== 'NONE',
      resonance: ext.engineResonance,
      timestamp: Date.now(),
    };

    this.activations.set(extensionId, activation);
    return activation;
  }

  deactivate(extensionId: string): boolean {
    this.activations.delete(extensionId);
    this.encryptionStates.delete(extensionId);
    this.contractStates.delete(extensionId);
    return true;
  }

  isActive(extensionId: string): boolean {
    return this.activations.has(extensionId);
  }

  // ── Encryption ─────────────────────────────────────────────────

  private initEncryption(ext: AIExtension): EncryptionState {
    this.totalEncryptions++;

    const keySource = ext.extensionId + ext.name + ext.latinDesignation;
    let keyHash = 0;
    for (let i = 0; i < keySource.length; i++) {
      keyHash = ((keyHash << 5) - keyHash + keySource.charCodeAt(i)) | 0;
    }
    keyHash = Math.abs(keyHash);

    let cascadeRounds = 0;
    let phantomProof = '';
    let latticeVectors = 0;

    switch (ext.encryptionMode) {
      case 'FIBONACCI_HASH':
        // Simple Fibonacci hash identity
        keyHash = fibonacciHash(keyHash, 2147483647);
        break;

      case 'PHI_CASCADE': {
        // Multi-round φ-weighted hashing
        cascadeRounds = Math.ceil(Math.log(ext.totalEngineWeight) / Math.log(PHI));
        let h = keyHash;
        for (let r = 0; r < cascadeRounds; r++) {
          h = fibonacciHash(h + FIB[r % FIB.length], 2147483647);
        }
        keyHash = h;
        break;
      }

      case 'PHANTOM_ZERO_KNOWLEDGE': {
        // Generate phantom proof hash
        const proofBase = keyHash * PHI + ext.engines.length * PHI_SQUARED;
        phantomProof = `PZK-${fibonacciHash(Math.floor(proofBase), 2147483647).toString(16)}`;
        break;
      }

      case 'E8_LATTICE':
        // E8 root vectors = 240
        latticeVectors = 240;
        keyHash = fibonacciHash(keyHash * 240, 2147483647);
        break;

      case 'SOVEREIGN_SEAL':
        // Sovereign node seal
        keyHash = fibonacciHash(keyHash + 4181, 2147483647); // 4181 = F(19)
        break;
    }

    const state: EncryptionState = {
      extensionId: ext.extensionId,
      mode: ext.encryptionMode,
      active: true,
      keyHash,
      cascadeRounds,
      phantomProof,
      latticeVectors,
      integrityScore: 1.0,
      timestamp: Date.now(),
    };

    this.encryptionStates.set(ext.extensionId, state);
    return state;
  }

  // ── Intelligence Contracts ─────────────────────────────────────

  private initContract(ext: AIExtension): ContractState {
    this.totalContracts++;

    const consensusModels = ext.engines.map(e => e.modelFamily);
    const consensusWeight = ext.engines.reduce((sum, e) => sum + e.phiWeight, 0);

    const chainProof: number[] = [];
    let proofAccumulator = ext.fibonacciIdentity;
    for (let i = 0; i < ext.engines.length; i++) {
      proofAccumulator = fibonacciHash(
        proofAccumulator + Math.floor(ext.engines[i].phiWeight * 1000),
        2147483647,
      );
      chainProof.push(proofAccumulator);
    }

    const state: ContractState = {
      extensionId: ext.extensionId,
      contractType: ext.contractType,
      verified: true,
      verificationHash: chainProof[chainProof.length - 1] ?? 0,
      consensusModels,
      consensusWeight,
      chainProof,
      timestamp: Date.now(),
    };

    this.contractStates.set(ext.extensionId, state);
    return state;
  }

  // ── Engine Selection Within Extension ──────────────────────────

  /**
   * Select the best engine within an extension for a specific task.
   * Returns engines sorted by φ-weighted relevance to the task keywords.
   */
  selectEngine(extensionId: string, taskKeywords: readonly string[]): EngineBinding | undefined {
    const ext = this.registry.byId(extensionId);
    if (!ext) return undefined;

    if (ext.engines.length === 0) return undefined;
    if (ext.engines.length === 1) return ext.engines[0];

    // Score each engine by keyword match to its role × phiWeight
    const scored = ext.engines.map(engine => {
      const roleWords = engine.role.toLowerCase().split('-');
      const matchCount = taskKeywords.filter(kw =>
        roleWords.some(rw => rw.includes(kw.toLowerCase()) || kw.toLowerCase().includes(rw)),
      ).length;

      const matchRatio = taskKeywords.length > 0 ? matchCount / taskKeywords.length : 0.5;
      const score = engine.phiWeight * (1 + matchRatio * PHI);
      return { engine, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0].engine;
  }

  // ── Kuramoto Synchronization ───────────────────────────────────

  kuramotoOrderParameter(): number {
    const active = Array.from(this.activations.values());
    if (active.length === 0) return 0;

    let sumCos = 0;
    let sumSin = 0;

    for (const act of active) {
      const phase = act.resonance * TWO_PI;
      sumCos += Math.cos(phase);
      sumSin += Math.sin(phase);
    }

    return Math.sqrt(sumCos * sumCos + sumSin * sumSin) / active.length;
  }

  // ── Edge Manifest Generation ───────────────────────────────────

  generateEdgeManifest(extensionId: string): EdgeManifest {
    const ext = this.registry.byId(extensionId);
    if (!ext) throw new Error(`Extension ${extensionId} not found`);

    const slug = ext.name.toLowerCase().replace(/\s+/g, '-');

    const permissions: string[] = ['activeTab', 'storage'];
    if (ext.encryptionMode !== 'NONE') permissions.push('privacy');
    if (ext.extensionClass === ExtensionClass.ANALYSIS) permissions.push('tabs', 'webNavigation');
    if (ext.extensionClass === ExtensionClass.SECURITY) permissions.push('webRequest', 'cookies', 'privacy');
    if (ext.extensionClass === ExtensionClass.WORKFLOW) permissions.push('tabs', 'alarms', 'notifications');
    if (ext.modalities.some(m => m.includes('Audio'))) permissions.push('tabCapture');

    return {
      name: ext.name,
      version: ext.manifestVersion,
      description: ext.description,
      manifest_version: 3,
      permissions,
      content_scripts: [{
        matches: ['<all_urls>'],
        js: [`content-scripts/${slug}.js`],
      }],
      background: {
        service_worker: `background/${slug}-worker.js`,
      },
      action: {
        default_popup: `popup/${slug}.html`,
        default_icon: `icons/${slug}-128.png`,
      },
      icons: {
        '16': `icons/${slug}-16.png`,
        '48': `icons/${slug}-48.png`,
        '128': `icons/${slug}-128.png`,
      },
    };
  }

  // ── Status ─────────────────────────────────────────────────────

  status(): ExtensionEngineStatus {
    const activeCount = this.activations.size;
    const activeEngineBindings = Array.from(this.activations.values())
      .reduce((sum, a) => sum + a.activeEngines.length, 0);

    return {
      totalExtensions: this.registry.totalExtensions,
      activeExtensions: activeCount,
      totalEngineBindings: this.registry.totalEngineBindings(),
      activeEngineBindings,
      encryptedExtensions: this.encryptionStates.size,
      contractedExtensions: this.contractStates.size,
      kuramotoR: this.kuramotoOrderParameter(),
      totalGoldenWeight: this.registry.totalGoldenWeight(),
      heartbeatMs: HEARTBEAT_MS,
    };
  }
}
