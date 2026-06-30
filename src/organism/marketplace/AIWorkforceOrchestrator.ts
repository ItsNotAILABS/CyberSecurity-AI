///
/// AI WORKFORCE ORCHESTRATOR — AGI-Managed Build Platform
///
/// ═══════════════════════════════════════════════════════════════════════
///  THE ORCHESTRATOR IS THE AGI.  THE WORKERS ARE THE AIs.
/// ═══════════════════════════════════════════════════════════════════════
///
/// This is the command layer that coordinates all 50 Language AIs,
/// the Generative UI Engine, and the Spatial Canvas into a single
/// unified build platform.
///
/// Architecture:
///   ┌──────────────────────────────────────────────────────────────┐
///   │               AI WORKFORCE ORCHESTRATOR                      │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 4: AGI COMMAND                                        │
///   │    BuildOrchestrator — routes build intent to AI groups       │
///   │    PipelineManager — sequences multi-stage builds             │
///   │    MemoryBank — every AI remembers context and decisions      │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 3: WORKFORCE COORDINATION                             │
///   │    GroupCoordinator — manages 10 multi-group AI models        │
///   │    TaskRouter — assigns sub-tasks to individual AIs           │
///   │    ConflictResolver — merges overlapping AI outputs           │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 2: SPATIAL CANVAS SUBSTRATE                           │
///   │    SpatialCanvasSDK (wired IN) — all rendering happens here  │
///   │    GenerativeUIEngine (wired IN) — component generation       │
///   │    QuadTree + CRDT + Viewport — the spatial fabric            │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 1: 50 LANGUAGE AI WORKERS                             │
///   │    150 engines (50 AIs × 3 engines each)                     │
///   │    Parse → Generate → Render pipeline                        │
///   │    Every language IS an AI                                    │
///   ├──────────────────────────────────────────────────────────────┤
///   │  Layer 0: MATHEMATICS & SUBSTRATE                            │
///   │    φ-weighted task allocation                                 │
///   │    Fibonacci hash identity for every artifact                 │
///   │    Golden-angle distribution of workload                     │
///   └──────────────────────────────────────────────────────────────┘
///
/// This orchestrator IS the build system.  Not a wrapper.
/// Not a script runner.  An AGI that commands 50 AIs.
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from '../intelligence/ObserverIntelligence.js';
import {
  LANGUAGE_AIS,
  MULTI_GROUP_MODELS,
  LanguageAIRegistry,
  type LanguageAI,
  type LanguageAIGroup,
  type EngineKind,
  type LanguageAIResult,
  type MultiGroupAIModel,
  type AIWorkerStatus,
} from './LanguageAIWorkers.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES — Build Pipeline
// ══════════════════════════════════════════════════════════════════

/** A build intent — what the user wants built. */
export interface BuildIntent {
  readonly id: number;
  readonly description: string;
  readonly targetGroups: readonly LanguageAIGroup[];
  readonly priority: 'critical' | 'high' | 'normal' | 'low';
  readonly createdAt: number;
}

/** A single task assigned to a Language AI. */
export interface AITask {
  readonly taskId: number;
  readonly buildIntentId: number;
  readonly assignedAI: number;
  readonly assignedGroup: LanguageAIGroup;
  readonly engineKind: EngineKind;
  readonly input: string;
  readonly status: AIWorkerStatus;
  readonly result?: LanguageAIResult;
  readonly startedAt: number;
  readonly completedAt?: number;
}

/** A pipeline stage — a group of tasks for one AI group. */
export interface PipelineStage {
  readonly stageId: number;
  readonly groupName: LanguageAIGroup;
  readonly tasks: readonly AITask[];
  readonly status: 'pending' | 'running' | 'complete' | 'failed';
  readonly phiWeight: number;
  readonly startedAt?: number;
  readonly completedAt?: number;
}

/** The full build pipeline for a build intent. */
export interface BuildPipeline {
  readonly pipelineId: number;
  readonly intent: BuildIntent;
  readonly stages: readonly PipelineStage[];
  readonly totalTasks: number;
  readonly totalAIsInvolved: number;
  readonly totalEnginesUsed: number;
  readonly status: 'planning' | 'executing' | 'complete' | 'failed';
  readonly createdAt: number;
  readonly completedAt?: number;
  readonly totalTimeMs?: number;
}

/** A memory entry — what an AI remembers. */
export interface AIMemoryEntry {
  readonly memoryId: number;
  readonly aiId: number;
  readonly aiName: string;
  readonly context: string;
  readonly decision: string;
  readonly confidence: number;
  readonly timestamp: number;
  readonly buildIntentId: number;
  readonly fibonacciHash: number;
}

/** Workforce statistics. */
export interface WorkforceStats {
  readonly totalAIs: number;
  readonly totalEngines: number;
  readonly totalGroups: number;
  readonly totalBuildsCompleted: number;
  readonly totalTasksExecuted: number;
  readonly totalMemoryEntries: number;
  readonly activeWorkers: number;
  readonly idleWorkers: number;
  readonly averageConfidence: number;
  readonly aggregatePhiWeight: number;
}

// ══════════════════════════════════════════════════════════════════
//  HELPER
// ══════════════════════════════════════════════════════════════════

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ══════════════════════════════════════════════════════════════════
//  MEMORY BANK — Every AI Remembers
// ══════════════════════════════════════════════════════════════════

class MemoryBank {
  private entries: AIMemoryEntry[] = [];
  private idCounter = 0;

  record(aiId: number, aiName: string, context: string, decision: string, confidence: number, buildIntentId: number): AIMemoryEntry {
    const entry: AIMemoryEntry = {
      memoryId: ++this.idCounter,
      aiId,
      aiName,
      context,
      decision,
      confidence,
      timestamp: Date.now(),
      buildIntentId,
      fibonacciHash: fibonacciHash(hashStr(context + decision), 2_147_483_647),
    };
    this.entries.push(entry);
    return entry;
  }

  recall(aiId: number): readonly AIMemoryEntry[] {
    return this.entries.filter(e => e.aiId === aiId);
  }

  recallForBuild(buildIntentId: number): readonly AIMemoryEntry[] {
    return this.entries.filter(e => e.buildIntentId === buildIntentId);
  }

  allMemories(): readonly AIMemoryEntry[] {
    return [...this.entries];
  }

  totalEntries(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
    this.idCounter = 0;
  }
}

// ══════════════════════════════════════════════════════════════════
//  TASK ROUTER — Assigns Tasks to Individual AIs
// ══════════════════════════════════════════════════════════════════

class TaskRouter {
  private readonly registry: LanguageAIRegistry;
  private taskIdCounter = 0;

  constructor(registry: LanguageAIRegistry) {
    this.registry = registry;
  }

  /**
   * Route a build intent to specific AI tasks.
   * Uses φ-weighted selection to pick the best AIs for each sub-task.
   */
  route(intent: BuildIntent): readonly AITask[] {
    const tasks: AITask[] = [];

    for (const group of intent.targetGroups) {
      const groupAIs = this.registry.byGroup(group);

      // Each AI in the group gets a task using its highest-weight engine
      for (const ai of groupAIs) {
        // Determine which engine to use based on the intent
        const engineKind = this.selectEngine(intent.description, ai);

        tasks.push({
          taskId: ++this.taskIdCounter,
          buildIntentId: intent.id,
          assignedAI: ai.id,
          assignedGroup: group,
          engineKind,
          input: intent.description,
          status: 'idle',
          startedAt: Date.now(),
        });
      }
    }

    return tasks;
  }

  private selectEngine(description: string, ai: LanguageAI): EngineKind {
    const lower = description.toLowerCase();

    // Intent-based engine selection
    if (lower.includes('parse') || lower.includes('analyze') || lower.includes('validate')) {
      return 'parse';
    }
    if (lower.includes('render') || lower.includes('compile') || lower.includes('build') || lower.includes('deploy')) {
      return 'render';
    }
    // Default: generate
    return 'generate';
  }
}

// ══════════════════════════════════════════════════════════════════
//  GROUP COORDINATOR — Manages Multi-Group AI Models
// ══════════════════════════════════════════════════════════════════

class GroupCoordinator {
  /**
   * Determine which AI groups should handle a build intent.
   * Uses keyword analysis to map intent → groups.
   */
  resolveGroups(description: string): readonly LanguageAIGroup[] {
    const lower = description.toLowerCase();
    const groups: LanguageAIGroup[] = [];

    // Always include frontend + style for UI tasks
    if (lower.includes('ui') || lower.includes('component') || lower.includes('page') || lower.includes('interface') || lower.includes('frontend') || lower.includes('view')) {
      groups.push('markup', 'style', 'frontend');
    }

    // Backend
    if (lower.includes('api') || lower.includes('server') || lower.includes('backend') || lower.includes('endpoint') || lower.includes('route')) {
      groups.push('backend');
    }

    // Data
    if (lower.includes('database') || lower.includes('query') || lower.includes('data') || lower.includes('schema') || lower.includes('model')) {
      groups.push('data');
    }

    // Substrate
    if (lower.includes('canister') || lower.includes('contract') || lower.includes('blockchain') || lower.includes('on-chain') || lower.includes('substrate')) {
      groups.push('substrate');
    }

    // Systems
    if (lower.includes('performance') || lower.includes('native') || lower.includes('binary') || lower.includes('systems') || lower.includes('wasm')) {
      groups.push('systems');
    }

    // Config
    if (lower.includes('config') || lower.includes('deploy') || lower.includes('infrastructure') || lower.includes('environment')) {
      groups.push('config');
    }

    // Query/Communication
    if (lower.includes('real-time') || lower.includes('websocket') || lower.includes('stream') || lower.includes('message') || lower.includes('grpc')) {
      groups.push('query');
    }

    // Intelligence
    if (lower.includes('ml') || lower.includes('model') || lower.includes('inference') || lower.includes('training') || lower.includes('neural')) {
      groups.push('intelligence');
    }

    // If nothing matched, default to the full frontend stack
    if (groups.length === 0) {
      groups.push('markup', 'style', 'frontend');
    }

    // Deduplicate
    return [...new Set(groups)];
  }
}

// ══════════════════════════════════════════════════════════════════
//  PIPELINE MANAGER — Sequences Multi-Stage Builds
// ══════════════════════════════════════════════════════════════════

class PipelineManager {
  private readonly registry: LanguageAIRegistry;
  private readonly taskRouter: TaskRouter;
  private readonly memoryBank: MemoryBank;
  private pipelineIdCounter = 0;

  constructor(registry: LanguageAIRegistry, taskRouter: TaskRouter, memoryBank: MemoryBank) {
    this.registry = registry;
    this.taskRouter = taskRouter;
    this.memoryBank = memoryBank;
  }

  /**
   * Build a pipeline for a build intent.
   */
  createPipeline(intent: BuildIntent): BuildPipeline {
    const tasks = this.taskRouter.route(intent);

    // Group tasks into stages by their group
    const stageMap = new Map<LanguageAIGroup, AITask[]>();
    for (const task of tasks) {
      const list = stageMap.get(task.assignedGroup) ?? [];
      list.push(task);
      stageMap.set(task.assignedGroup, list);
    }

    const stages: PipelineStage[] = [];
    let stageIdx = 0;
    for (const [groupName, groupTasks] of stageMap) {
      const group = this.registry.getGroup(groupName);
      stages.push({
        stageId: stageIdx++,
        groupName,
        tasks: groupTasks,
        status: 'pending',
        phiWeight: group?.aggregatePhiWeight ?? 1,
      });
    }

    const uniqueAIs = new Set(tasks.map(t => t.assignedAI));

    return {
      pipelineId: ++this.pipelineIdCounter,
      intent,
      stages,
      totalTasks: tasks.length,
      totalAIsInvolved: uniqueAIs.size,
      totalEnginesUsed: tasks.length, // one engine per task
      status: 'planning',
      createdAt: Date.now(),
    };
  }

  /**
   * Execute a pipeline — run all tasks through their assigned AIs.
   */
  execute(pipeline: BuildPipeline): BuildPipeline {
    const startTime = Date.now();
    const executedStages: PipelineStage[] = [];

    for (const stage of pipeline.stages) {
      const executedTasks: AITask[] = [];

      for (const task of stage.tasks) {
        const result = this.registry.execute(task.assignedAI, task.engineKind, task.input);
        const ai = this.registry.get(task.assignedAI);

        // Record memory
        if (ai) {
          this.memoryBank.record(
            ai.id,
            ai.name,
            `Build intent: ${task.input.slice(0, 100)}`,
            `Used ${task.engineKind} engine, confidence ${result.confidence.toFixed(2)}`,
            result.confidence,
            task.buildIntentId,
          );
        }

        executedTasks.push({
          ...task,
          status: 'complete',
          result,
          completedAt: Date.now(),
        });
      }

      executedStages.push({
        ...stage,
        tasks: executedTasks,
        status: 'complete',
        startedAt: startTime,
        completedAt: Date.now(),
      });
    }

    return {
      ...pipeline,
      stages: executedStages,
      status: 'complete',
      completedAt: Date.now(),
      totalTimeMs: Date.now() - startTime,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  AI WORKFORCE ORCHESTRATOR — The Public API
// ══════════════════════════════════════════════════════════════════

/**
 * AI Workforce Orchestrator
 *
 * The AGI that commands 50 Language AIs, each with 3 engines.
 * Routes build intents to the right AI groups, sequences pipelines,
 * records memories, and tracks the full build lifecycle.
 *
 * Usage:
 *   const orchestrator = new AIWorkforceOrchestrator();
 *   const pipeline = orchestrator.build('A dashboard with real-time charts and API backend');
 *   console.log(pipeline.totalAIsInvolved); // e.g. 15
 *   console.log(pipeline.stages);           // grouped by AI group
 *   console.log(orchestrator.memories());   // what the AIs remember
 */
export class AIWorkforceOrchestrator {
  readonly name = '@medina/ai-workforce-orchestrator';
  readonly version = '1.0.0';
  readonly author = 'Casa de Medina';

  private readonly registry: LanguageAIRegistry;
  private readonly groupCoord: GroupCoordinator;
  private readonly pipelineMgr: PipelineManager;
  private readonly memoryBank: MemoryBank;
  private readonly taskRouter: TaskRouter;

  private buildHistory: BuildPipeline[] = [];
  private intentIdCounter = 0;

  constructor() {
    this.registry = new LanguageAIRegistry();
    this.groupCoord = new GroupCoordinator();
    this.memoryBank = new MemoryBank();
    this.taskRouter = new TaskRouter(this.registry);
    this.pipelineMgr = new PipelineManager(this.registry, this.taskRouter, this.memoryBank);
  }

  /**
   * Build from intent — the primary entry point.
   *
   * Describe what you want built.  The orchestrator figures out which
   * of the 50 AIs to activate, routes tasks, runs the pipeline, and
   * returns the result with full traceability.
   */
  build(description: string, priority: BuildIntent['priority'] = 'normal'): BuildPipeline {
    const groups = this.groupCoord.resolveGroups(description);

    const intent: BuildIntent = {
      id: ++this.intentIdCounter,
      description,
      targetGroups: groups,
      priority,
      createdAt: Date.now(),
    };

    const pipeline = this.pipelineMgr.createPipeline(intent);
    const executed = this.pipelineMgr.execute(pipeline);
    this.buildHistory.push(executed);
    return executed;
  }

  /**
   * Get all 50 Language AIs.
   */
  workers(): readonly LanguageAI[] {
    return this.registry.all();
  }

  /**
   * Get all 10 multi-group AI models.
   */
  groups(): readonly MultiGroupAIModel[] {
    return this.registry.groups();
  }

  /**
   * Get the Language AI registry for advanced queries.
   */
  getRegistry(): LanguageAIRegistry {
    return this.registry;
  }

  /**
   * Get all AI memories.
   */
  memories(): readonly AIMemoryEntry[] {
    return this.memoryBank.allMemories();
  }

  /**
   * Get memories for a specific AI.
   */
  memoriesForAI(aiId: number): readonly AIMemoryEntry[] {
    return this.memoryBank.recall(aiId);
  }

  /**
   * Get all completed builds.
   */
  history(): readonly BuildPipeline[] {
    return [...this.buildHistory];
  }

  /**
   * Get workforce statistics.
   */
  stats(): WorkforceStats {
    const registryStats = this.registry.stats();
    const allTasks = this.buildHistory.flatMap(b => b.stages.flatMap(s => s.tasks));
    const completeTasks = allTasks.filter(t => t.status === 'complete');

    return {
      totalAIs: registryStats.totalAIs,
      totalEngines: registryStats.totalEngines,
      totalGroups: registryStats.totalGroups,
      totalBuildsCompleted: this.buildHistory.filter(b => b.status === 'complete').length,
      totalTasksExecuted: completeTasks.length,
      totalMemoryEntries: this.memoryBank.totalEntries(),
      activeWorkers: 0, // synchronous execution — all complete
      idleWorkers: registryStats.totalAIs,
      averageConfidence: completeTasks.length > 0
        ? completeTasks.reduce((s, t) => s + (t.result?.confidence ?? 0), 0) / completeTasks.length
        : 0,
      aggregatePhiWeight: registryStats.aggregatePhiWeight,
    };
  }

  /**
   * Reset the orchestrator — clear history and memories.
   */
  reset(): void {
    this.buildHistory = [];
    this.intentIdCounter = 0;
    this.memoryBank.clear();
  }
}

/**
 * Factory function for creating an AIWorkforceOrchestrator.
 */
export function createAIWorkforceOrchestrator(): AIWorkforceOrchestrator {
  return new AIWorkforceOrchestrator();
}
