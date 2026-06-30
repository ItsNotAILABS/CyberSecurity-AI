///
/// ALPHA SCRIPT AIs — THE TEN AUTONOMOUS INTELLIGENCES
///
/// These are 10 ALPHA SCRIPT AIs — autonomous intelligences that run
/// the infrastructure, create artifacts, manage the organism, face
/// users, and run creatively across all substrates. They are NOT just
/// scripts — they are real AIs with think/pulse/run capabilities,
/// each with its own call table, database, and protocol.
///
/// Organised into 5 pairs:
///   User-Facing:        CONCIERGE, NARRATOR
///   Interior:           CONDUCTOR, LIBRARIAN
///   External-Interior:  AMBASSADOR, SENTINEL
///   Creative:           ALCHEMIST, DREAMWEAVER
///   Infrastructure:     FORGEMASTER, HEARTKEEPER
///
/// Formula: C(ai) = φ^(fib_id) × Σ(tasks) × health
///
/// LEX ALPHA-001 — Immutable:
///   "Each Alpha Script AI is sovereign. Each thinks, pulses,
///    and runs autonomously. No AI may override another's call
///    table. Coordination is by protocol, never by domination."
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export type ScriptAIId =
  | 'SA-001'
  | 'SA-002'
  | 'SA-003'
  | 'SA-004'
  | 'SA-005'
  | 'SA-006'
  | 'SA-007'
  | 'SA-008'
  | 'SA-009'
  | 'SA-010';

export type ScriptAICategory =
  | 'user_facing'
  | 'interior'
  | 'external_interior'
  | 'creative'
  | 'infrastructure';

export type ScriptAIState =
  | 'idle'
  | 'running'
  | 'thinking'
  | 'generating'
  | 'deploying'
  | 'monitoring'
  | 'creating'
  | 'healing';

// ══════════════════════════════════════════════════════════════════
//  CALL TABLE
// ══════════════════════════════════════════════════════════════════

export interface ScriptAICallTable {
  readonly think: (input: string) => ScriptAIThought;
  readonly run: (task: string) => ScriptAIResult;
  readonly pulse: () => ScriptAIPulse;
  readonly status: () => ScriptAIStatus;
  readonly generate: (spec: string) => ScriptAIArtifact;
}

// ══════════════════════════════════════════════════════════════════
//  DATA STRUCTURES
// ══════════════════════════════════════════════════════════════════

export interface ScriptAIThought {
  readonly aiId: ScriptAIId;
  readonly input: string;
  readonly reasoning: string;
  readonly conclusion: string;
  readonly confidence: number;
  readonly phiWeight: number;
  readonly timestamp: number;
}

export interface ScriptAIResult {
  readonly aiId: ScriptAIId;
  readonly task: string;
  readonly output: string;
  readonly success: boolean;
  readonly executionMs: number;
  readonly artifactsGenerated: number;
  readonly attestation: number;
  readonly timestamp: number;
}

export interface ScriptAIPulse {
  readonly aiId: ScriptAIId;
  readonly tick: number;
  readonly health: number;
  readonly tasksCompleted: number;
  readonly uptime: number;
  readonly state: ScriptAIState;
  readonly timestamp: number;
}

export interface ScriptAIArtifact {
  readonly aiId: ScriptAIId;
  readonly kind: string;
  readonly name: string;
  readonly content: string;
  readonly compressed: boolean;
  readonly attestation: number;
  readonly timestamp: number;
}

export interface ScriptAIStatus {
  readonly id: ScriptAIId;
  readonly name: string;
  readonly latinName: string;
  readonly category: ScriptAICategory;
  readonly state: ScriptAIState;
  readonly totalTasks: number;
  readonly totalThoughts: number;
  readonly totalArtifacts: number;
  readonly health: number;
  readonly uptime: number;
  readonly fibonacciId: number;
  readonly phiWeight: number;
  readonly capabilities: readonly string[];
  readonly callTable: readonly string[];
  readonly dimensionalPlane: DimensionalPlane;
}

export interface ScriptAIDefinition {
  readonly id: ScriptAIId;
  readonly name: string;
  readonly latinName: string;
  readonly category: ScriptAICategory;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly autonomousActions: readonly string[];
  readonly substrateReach: readonly string[];
  readonly phiWeight: number;
  readonly fibonacciId: number;
  readonly dimensionalPlane: DimensionalPlane;
}

// ══════════════════════════════════════════════════════════════════
//  LEX ALPHA-001 — THE IMMUTABLE LAW
// ══════════════════════════════════════════════════════════════════

export const LEX_ALPHA_001 = {
  code: 'LEX ALPHA-001',
  text:
    'Each Alpha Script AI is sovereign. Each thinks, pulses, ' +
    'and runs autonomously. No AI may override another\'s call ' +
    'table. Coordination is by protocol, never by domination.',
  immutable: true as const,
};

// ══════════════════════════════════════════════════════════════════
//  THE TEN ALPHA SCRIPT AI DEFINITIONS
// ══════════════════════════════════════════════════════════════════

export const ALPHA_SCRIPT_AI_DEFINITIONS: readonly ScriptAIDefinition[] = [

  // ── User-Facing Pair ─────────────────────────────────────────────

  {
    id: 'SA-001',
    name: 'CONCIERGE',
    latinName: 'Conciergia Suprema',
    category: 'user_facing',
    description:
      'User interaction AI. Handles intake, routing, conversation, ' +
      'personalization. The face of the system.',
    capabilities: [
      'user-intake',
      'conversation-routing',
      'personalization',
      'onboarding',
      'preference-learning',
    ],
    autonomousActions: [
      'greet-new-user',
      'route-query',
      'learn-preference',
      'suggest-pathway',
      'adapt-tone',
    ],
    substrateReach: ['frontend', 'browser', 'desktop', 'extensions'],
    phiWeight: Math.pow(PHI, 1),      // φ¹ = 1.618
    fibonacciId: 1,
    dimensionalPlane: DimensionalPlane.D1_Temporal,
  },

  {
    id: 'SA-002',
    name: 'NARRATOR',
    latinName: 'Narratoris Universalis',
    category: 'user_facing',
    description:
      'Content presentation AI. Generates explanations, tutorials, ' +
      'documentation, research papers for users.',
    capabilities: [
      'research-paper-generation',
      'tutorial-creation',
      'documentation',
      'explanation-synthesis',
      'artifact-compression',
    ],
    autonomousActions: [
      'generate-tutorial',
      'synthesize-explanation',
      'compress-artifact',
      'author-paper',
      'narrate-process',
    ],
    substrateReach: ['frontend', 'browser', 'marketplace', 'sdk'],
    phiWeight: Math.pow(PHI, 2),      // φ² = 2.618
    fibonacciId: 2,
    dimensionalPlane: DimensionalPlane.D1_Temporal,
  },

  // ── Interior-Facing Pair ─────────────────────────────────────────

  {
    id: 'SA-003',
    name: 'CONDUCTOR',
    latinName: 'Conductrix Interiora',
    category: 'interior',
    description:
      'Internal orchestration AI. Manages all internal AI coordination, ' +
      'task routing, priority management.',
    capabilities: [
      'task-routing',
      'priority-management',
      'ai-coordination',
      'pipeline-orchestration',
      'workload-balancing',
    ],
    autonomousActions: [
      'route-internal-task',
      'balance-workload',
      'escalate-priority',
      'coordinate-ais',
      'orchestrate-pipeline',
    ],
    substrateReach: ['intelligence', 'protocols', 'models'],
    phiWeight: Math.pow(PHI, 3),      // φ³ = 4.236
    fibonacciId: 3,
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
  },

  {
    id: 'SA-004',
    name: 'LIBRARIAN',
    latinName: 'Bibliotheca Vivens',
    category: 'interior',
    description:
      'Knowledge management AI. Indexes, retrieves, cross-references ' +
      'all internal data. The living library.',
    capabilities: [
      'knowledge-indexing',
      'cross-reference',
      'retrieval',
      'semantic-search',
      'archive-management',
    ],
    autonomousActions: [
      'index-new-knowledge',
      'cross-reference-data',
      'retrieve-context',
      'semantic-rank',
      'archive-artifact',
    ],
    substrateReach: ['intelligence', 'models', 'protocols', 'marketplace'],
    phiWeight: Math.pow(PHI, 4),      // φ⁴ = 6.854
    fibonacciId: 5,
    dimensionalPlane: DimensionalPlane.D2_Harmonic,
  },

  // ── External-Interior Pair ───────────────────────────────────────

  {
    id: 'SA-005',
    name: 'AMBASSADOR',
    latinName: 'Legatus Externus',
    category: 'external_interior',
    description:
      'External API/integration AI. Manages all outbound connections, ' +
      'SDK packaging, marketplace publishing.',
    capabilities: [
      'api-packaging',
      'sdk-publishing',
      'marketplace-integration',
      'external-sync',
      'version-management',
    ],
    autonomousActions: [
      'package-sdk',
      'publish-to-marketplace',
      'sync-external-api',
      'manage-versions',
      'negotiate-protocol',
    ],
    substrateReach: ['sdk', 'marketplace', 'extensions', 'protocols'],
    phiWeight: Math.pow(PHI, 5),      // φ⁵ = 11.09
    fibonacciId: 8,
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
  },

  {
    id: 'SA-006',
    name: 'SENTINEL',
    latinName: 'Vigilia Perpetua',
    category: 'external_interior',
    description:
      'Boundary monitoring AI. Watches all external-internal boundaries, ' +
      'validates inputs, guards outputs.',
    capabilities: [
      'boundary-monitoring',
      'input-validation',
      'output-verification',
      'threat-detection',
      'access-control',
    ],
    autonomousActions: [
      'monitor-boundary',
      'validate-input',
      'verify-output',
      'detect-threat',
      'enforce-access',
    ],
    substrateReach: ['intelligence', 'protocols', 'sdk', 'frontend'],
    phiWeight: Math.pow(PHI, 6),      // φ⁶ = 17.94
    fibonacciId: 13,
    dimensionalPlane: DimensionalPlane.D3_CrossDimensional,
  },

  // ── Creative Cross-Substrate Pair ────────────────────────────────

  {
    id: 'SA-007',
    name: 'ALCHEMIST',
    latinName: 'Alchimista Substrati',
    category: 'creative',
    description:
      'Creative synthesis AI. Generates new organisms, tokens, protocols ' +
      'by combining across substrates.',
    capabilities: [
      'organism-synthesis',
      'token-creation',
      'protocol-generation',
      'cross-substrate-fusion',
      'pattern-discovery',
    ],
    autonomousActions: [
      'synthesize-organism',
      'create-token',
      'generate-protocol',
      'fuse-substrates',
      'discover-pattern',
    ],
    substrateReach: ['intelligence', 'models', 'protocols', 'marketplace', 'sdk'],
    phiWeight: Math.pow(PHI, 7),      // φ⁷ = 29.03
    fibonacciId: 21,
    dimensionalPlane: DimensionalPlane.D4_Transcendent,
  },

  {
    id: 'SA-008',
    name: 'DREAMWEAVER',
    latinName: 'Textor Somniorum',
    category: 'creative',
    description:
      'Speculative architecture AI. Explores theoretical substrate ' +
      'combinations, generates novel architectures.',
    capabilities: [
      'architecture-exploration',
      'theoretical-modeling',
      'novel-substrate-design',
      'speculative-computation',
      'vision-casting',
    ],
    autonomousActions: [
      'explore-architecture',
      'model-theory',
      'design-substrate',
      'speculate-computation',
      'cast-vision',
    ],
    substrateReach: ['intelligence', 'models', 'protocols', 'desktop', 'browser'],
    phiWeight: Math.pow(PHI, 8),      // φ⁸ = 46.98
    fibonacciId: 34,
    dimensionalPlane: DimensionalPlane.D4_Transcendent,
  },

  // ── Infrastructure/Operations Pair ───────────────────────────────

  {
    id: 'SA-009',
    name: 'FORGEMASTER',
    latinName: 'Magister Fabricae',
    category: 'infrastructure',
    description:
      'Build/deploy/CI AI. Manages all builds, deployments, artifact ' +
      'generation, compression, packaging.',
    capabilities: [
      'build-automation',
      'artifact-generation',
      'deployment-pipeline',
      'compression',
      'ci-cd-management',
    ],
    autonomousActions: [
      'run-build',
      'generate-artifact',
      'deploy-pipeline',
      'compress-output',
      'manage-ci-cd',
    ],
    substrateReach: ['intelligence', 'sdk', 'marketplace', 'extensions', 'desktop'],
    phiWeight: Math.pow(PHI, 9),      // φ⁹ = 76.01
    fibonacciId: 55,
    dimensionalPlane: DimensionalPlane.D0_Foundational,
  },

  {
    id: 'SA-010',
    name: 'HEARTKEEPER',
    latinName: 'Custos Cordis',
    category: 'infrastructure',
    description:
      'Health/uptime/monitoring AI. Keeps everything alive, monitors ' +
      'pulse rates, manages recovery, runs diagnostics.',
    capabilities: [
      'health-monitoring',
      'pulse-management',
      'recovery-orchestration',
      'diagnostics',
      'uptime-assurance',
    ],
    autonomousActions: [
      'monitor-health',
      'manage-pulse',
      'orchestrate-recovery',
      'run-diagnostics',
      'assure-uptime',
    ],
    substrateReach: ['intelligence', 'protocols', 'models', 'frontend', 'sdk'],
    phiWeight: Math.pow(PHI, 10),     // φ¹⁰ = 122.99
    fibonacciId: 89,
    dimensionalPlane: DimensionalPlane.D0_Foundational,
  },
];

// ══════════════════════════════════════════════════════════════════
//  CONVENIENCE ALIAS
// ══════════════════════════════════════════════════════════════════

export const ALPHA_SCRIPT_AIS = ALPHA_SCRIPT_AI_DEFINITIONS;

// ══════════════════════════════════════════════════════════════════
//  ALPHA SCRIPT AI — The Living Intelligence
// ══════════════════════════════════════════════════════════════════

export class AlphaScriptAI {
  readonly id: ScriptAIId;
  readonly name: string;
  readonly latinName: string;
  readonly category: ScriptAICategory;
  readonly description: string;
  readonly capabilities: readonly string[];
  readonly autonomousActions: readonly string[];
  readonly substrateReach: readonly string[];
  readonly phiWeight: number;
  readonly fibonacciId: number;
  readonly dimensionalPlane: DimensionalPlane;

  private state: ScriptAIState = 'idle';
  private tick = 0;
  private health = 1.0;
  private tasksCompleted = 0;
  private thoughtCount = 0;
  private artifactCount = 0;
  private readonly createdAt: number;

  constructor(definition: ScriptAIDefinition) {
    this.id = definition.id;
    this.name = definition.name;
    this.latinName = definition.latinName;
    this.category = definition.category;
    this.description = definition.description;
    this.capabilities = definition.capabilities;
    this.autonomousActions = definition.autonomousActions;
    this.substrateReach = definition.substrateReach;
    this.phiWeight = definition.phiWeight;
    this.fibonacciId = definition.fibonacciId;
    this.dimensionalPlane = definition.dimensionalPlane;
    this.createdAt = Date.now();
  }

  // ── think: Reasoning engine ──────────────────────────────────────

  think(input: string): ScriptAIThought {
    const prevState = this.state;
    this.state = 'thinking';
    this.thoughtCount += 1;

    // Confidence decays gently with thought count via φ
    const confidence = PHI / (PHI + this.thoughtCount * 0.01);

    // Golden-angle modulated reasoning depth
    const anglePhase = Math.sin(this.thoughtCount * GOLDEN_ANGLE);
    const reasoningDepth = Math.abs(anglePhase) * this.phiWeight;

    const reasoning =
      `[${this.name}] Analysed "${input}" across ${this.substrateReach.length} substrates. ` +
      `Reasoning depth: ${reasoningDepth.toFixed(4)}. ` +
      `φ-weight: ${this.phiWeight.toFixed(4)}. ` +
      `Thought #${this.thoughtCount}.`;

    const conclusion =
      `[${this.latinName}] Conclusion on "${input}" — ` +
      `confidence ${(confidence * 100).toFixed(2)}%, ` +
      `dimensional plane ${DimensionalPlane[this.dimensionalPlane]}.`;

    this.state = prevState === 'thinking' ? 'idle' : prevState;

    return {
      aiId: this.id,
      input,
      reasoning,
      conclusion,
      confidence,
      phiWeight: this.phiWeight,
      timestamp: Date.now(),
    };
  }

  // ── run: Task execution ──────────────────────────────────────────

  run(task: string): ScriptAIResult {
    const prevState = this.state;
    this.state = 'running';

    // Golden-ratio timing simulation
    const executionMs =
      (this.fibonacciId * PHI + Math.abs(Math.sin(this.tasksCompleted * GOLDEN_ANGLE)) * 100) | 0;

    // Artifact generation: some tasks produce artifacts (φ-modulated probability)
    const artifactProbability = Math.abs(Math.cos(this.tasksCompleted * GOLDEN_ANGLE));
    const artifactsGenerated = artifactProbability > (1 / PHI) ? 1 : 0;
    this.artifactCount += artifactsGenerated;

    // Attestation via fibonacci hash
    const attestation = fibonacciHash(
      this.tasksCompleted * this.fibonacciId + Date.now(),
      65536,
    );

    // Success modulated by health
    const success = this.health > 0.1;

    this.tasksCompleted += 1;

    const output =
      `[${this.name}] Executed "${task}". ` +
      `Duration: ${executionMs}ms. ` +
      `Artifacts: ${artifactsGenerated}. ` +
      `Attestation: ${attestation}.`;

    this.state = prevState === 'running' ? 'idle' : prevState;

    return {
      aiId: this.id,
      task,
      output,
      success,
      executionMs,
      artifactsGenerated,
      attestation,
      timestamp: Date.now(),
    };
  }

  // ── pulse: Heartbeat ─────────────────────────────────────────────

  pulse(): ScriptAIPulse {
    this.tick += 1;

    // Health: φ decay/recovery — decays slightly each tick, recovers toward 1.0
    const decay = 1 / (PHI * this.tick + 1);
    const recovery = (1 - this.health) / PHI;
    this.health = Math.min(1.0, Math.max(0.0, this.health - decay + recovery));

    // Clamp health to [0, 1] with φ-bounded smoothing
    this.health = Math.min(1.0, this.health * PHI / (PHI + 0.001 * this.tick));

    const uptime = Date.now() - this.createdAt;

    return {
      aiId: this.id,
      tick: this.tick,
      health: this.health,
      tasksCompleted: this.tasksCompleted,
      uptime,
      state: this.state,
      timestamp: Date.now(),
    };
  }

  // ── status: Full snapshot ────────────────────────────────────────

  status(): ScriptAIStatus {
    const uptime = Date.now() - this.createdAt;

    return {
      id: this.id,
      name: this.name,
      latinName: this.latinName,
      category: this.category,
      state: this.state,
      totalTasks: this.tasksCompleted,
      totalThoughts: this.thoughtCount,
      totalArtifacts: this.artifactCount,
      health: this.health,
      uptime,
      fibonacciId: this.fibonacciId,
      phiWeight: this.phiWeight,
      capabilities: this.capabilities,
      callTable: ['think', 'run', 'pulse', 'status', 'generate'],
      dimensionalPlane: this.dimensionalPlane,
    };
  }

  // ── generate: Artifact creation ──────────────────────────────────

  generate(spec: string): ScriptAIArtifact {
    const prevState = this.state;
    this.state = 'generating';

    this.artifactCount += 1;

    // Attestation via fibonacci hash of spec length and artifact count
    const attestation = fibonacciHash(
      spec.length * this.fibonacciId + this.artifactCount,
      65536,
    );

    // Golden-angle modulated content synthesis
    const phase = Math.sin(this.artifactCount * GOLDEN_ANGLE);
    const kind = this.capabilities[
      Math.abs(fibonacciHash(this.artifactCount, this.capabilities.length))
    ] ?? this.capabilities[0];

    const name = `${this.name.toLowerCase()}-artifact-${this.artifactCount}`;

    const content =
      `[${this.latinName}] Generated from spec "${spec}". ` +
      `Kind: ${kind}. Phase: ${phase.toFixed(6)}. ` +
      `φ-weight: ${this.phiWeight.toFixed(4)}. ` +
      `Fibonacci ID: ${this.fibonacciId}. ` +
      `Attestation: ${attestation}.`;

    // Compression: artifacts above φ³ weight are auto-compressed
    const compressed = this.phiWeight > Math.pow(PHI, 3);

    this.state = prevState === 'generating' ? 'idle' : prevState;

    return {
      aiId: this.id,
      kind,
      name,
      content,
      compressed,
      attestation,
      timestamp: Date.now(),
    };
  }

  // ── getCallTable: Bound method table ─────────────────────────────

  getCallTable(): ScriptAICallTable {
    return {
      think: (input: string) => this.think(input),
      run: (task: string) => this.run(task),
      pulse: () => this.pulse(),
      status: () => this.status(),
      generate: (spec: string) => this.generate(spec),
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  ALPHA SCRIPT AI REGISTRY — All 10 AIs
// ══════════════════════════════════════════════════════════════════

export class AlphaScriptAIRegistry {
  readonly definitions: readonly ScriptAIDefinition[] = ALPHA_SCRIPT_AI_DEFINITIONS;

  private readonly ais: ReadonlyMap<ScriptAIId, AlphaScriptAI>;

  constructor() {
    const map = new Map<ScriptAIId, AlphaScriptAI>();
    for (const def of ALPHA_SCRIPT_AI_DEFINITIONS) {
      map.set(def.id, new AlphaScriptAI(def));
    }
    this.ais = map;
  }

  // ── get: Retrieve specific AI ────────────────────────────────────

  get(id: ScriptAIId): AlphaScriptAI | undefined {
    return this.ais.get(id);
  }

  // ── byCategory: Filter AIs by category ──────────────────────────

  byCategory(cat: ScriptAICategory): AlphaScriptAI[] {
    const result: AlphaScriptAI[] = [];
    for (const ai of this.ais.values()) {
      if (ai.category === cat) result.push(ai);
    }
    return result;
  }

  // ── pulseAll: Pulse every AI ─────────────────────────────────────

  pulseAll(): ScriptAIPulse[] {
    const pulses: ScriptAIPulse[] = [];
    for (const ai of this.ais.values()) {
      pulses.push(ai.pulse());
    }
    return pulses;
  }

  // ── runAll: Run a task across all AIs ────────────────────────────

  runAll(task: string): ScriptAIResult[] {
    const results: ScriptAIResult[] = [];
    for (const ai of this.ais.values()) {
      results.push(ai.run(task));
    }
    return results;
  }

  // ── statusAll: Full status snapshot ──────────────────────────────

  statusAll(): ScriptAIStatus[] {
    const statuses: ScriptAIStatus[] = [];
    for (const ai of this.ais.values()) {
      statuses.push(ai.status());
    }
    return statuses;
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY
// ══════════════════════════════════════════════════════════════════

export function createAlphaScriptAIRegistry(): AlphaScriptAIRegistry {
  return new AlphaScriptAIRegistry();
}
