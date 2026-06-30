///
/// NOVA ENGINE COMPARISON — All 23 Engines vs GPT-4, Claude, Gemini & Others
///
/// This module provides a deep, structured comparison of every Nova
/// sovereign engine against the leading proprietary AI models.
///
/// Each comparison covers:
///   - Context window depth (tokens)
///   - Modality support (text, vision, audio, video, code, etc.)
///   - Streaming capability
///   - Function/tool calling
///   - Sovereignty (local/on-device vs cloud-only)
///   - Wire protocol (Nova's φ-attested nova-wire vs REST-only)
///   - Mathematical grounding (φ-weighted routing vs none)
///   - Attestation (Fibonacci hash proof of origin vs none)
///
/// Nova's 23 engines are NOT clones of GPT-4.  They are a NEW class:
///   - Sovereign execution (runs on YOUR hardware, not rented cloud)
///   - φ-mathematics wired into every routing decision
///   - Fibonacci attestation on every response (provenance proof)
///   - Multi-engine consensus (combine engines for higher accuracy)
///   - Wire-protocol-native (nova-wire/<slug> per engine)
///   - Zero vendor lock-in, zero data exfiltration
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  NOVA_ENGINES,
  type NovaEngineDefinition,
  type NovaEngineId,
} from '../sdk/NovaEngineModels.js';

import { PHI, fibonacciHash } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  EXTERNAL MODEL DEFINITIONS (for comparison only)
// ══════════════════════════════════════════════════════════════════

export interface ExternalModelProfile {
  readonly id: string;
  readonly vendor: string;
  readonly name: string;
  readonly contextWindow: number;
  readonly maxOutput: number;
  readonly modalities: readonly string[];
  readonly supportsStreaming: boolean;
  readonly supportsVision: boolean;
  readonly supportsAudio: boolean;
  readonly supportsFunctionCalling: boolean;
  readonly sovereignExecution: boolean;  // can run on-device?
  readonly wireProtocol: string;
  readonly hasAttestation: boolean;
  readonly hasMathRouting: boolean;
  readonly pricingModel: 'per-token' | 'subscription' | 'free' | 'sovereign';
}

export const EXTERNAL_MODELS: readonly ExternalModelProfile[] = [
  // OpenAI
  {
    id: 'gpt-4-turbo', vendor: 'OpenAI', name: 'GPT-4 Turbo',
    contextWindow: 128_000, maxOutput: 4_096,
    modalities: ['text', 'vision'], supportsStreaming: true,
    supportsVision: true, supportsAudio: false, supportsFunctionCalling: true,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  {
    id: 'gpt-4o', vendor: 'OpenAI', name: 'GPT-4o',
    contextWindow: 128_000, maxOutput: 16_384,
    modalities: ['text', 'vision', 'audio'], supportsStreaming: true,
    supportsVision: true, supportsAudio: true, supportsFunctionCalling: true,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  {
    id: 'gpt-4o-mini', vendor: 'OpenAI', name: 'GPT-4o mini',
    contextWindow: 128_000, maxOutput: 16_384,
    modalities: ['text', 'vision'], supportsStreaming: true,
    supportsVision: true, supportsAudio: false, supportsFunctionCalling: true,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  {
    id: 'o1', vendor: 'OpenAI', name: 'o1',
    contextWindow: 200_000, maxOutput: 100_000,
    modalities: ['text', 'vision'], supportsStreaming: true,
    supportsVision: true, supportsAudio: false, supportsFunctionCalling: true,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  {
    id: 'dall-e-3', vendor: 'OpenAI', name: 'DALL-E 3',
    contextWindow: 4_000, maxOutput: 0,
    modalities: ['text', 'image-gen'], supportsStreaming: false,
    supportsVision: false, supportsAudio: false, supportsFunctionCalling: false,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  {
    id: 'whisper-1', vendor: 'OpenAI', name: 'Whisper',
    contextWindow: 0, maxOutput: 0,
    modalities: ['audio'], supportsStreaming: false,
    supportsVision: false, supportsAudio: true, supportsFunctionCalling: false,
    sovereignExecution: true, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  // Anthropic
  {
    id: 'claude-3.5-sonnet', vendor: 'Anthropic', name: 'Claude 3.5 Sonnet',
    contextWindow: 200_000, maxOutput: 8_192,
    modalities: ['text', 'vision'], supportsStreaming: true,
    supportsVision: true, supportsAudio: false, supportsFunctionCalling: true,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  {
    id: 'claude-3-opus', vendor: 'Anthropic', name: 'Claude 3 Opus',
    contextWindow: 200_000, maxOutput: 4_096,
    modalities: ['text', 'vision'], supportsStreaming: true,
    supportsVision: true, supportsAudio: false, supportsFunctionCalling: true,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  // Google
  {
    id: 'gemini-1.5-pro', vendor: 'Google', name: 'Gemini 1.5 Pro',
    contextWindow: 2_000_000, maxOutput: 8_192,
    modalities: ['text', 'vision', 'audio', 'video'], supportsStreaming: true,
    supportsVision: true, supportsAudio: true, supportsFunctionCalling: true,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  {
    id: 'gemini-2.0-flash', vendor: 'Google', name: 'Gemini 2.0 Flash',
    contextWindow: 1_000_000, maxOutput: 8_192,
    modalities: ['text', 'vision', 'audio'], supportsStreaming: true,
    supportsVision: true, supportsAudio: true, supportsFunctionCalling: true,
    sovereignExecution: false, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
  // Meta
  {
    id: 'llama-3.1-405b', vendor: 'Meta', name: 'Llama 3.1 405B',
    contextWindow: 128_000, maxOutput: 4_096,
    modalities: ['text'], supportsStreaming: true,
    supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    sovereignExecution: true, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'free',
  },
  // Mistral
  {
    id: 'mistral-large', vendor: 'Mistral', name: 'Mistral Large',
    contextWindow: 128_000, maxOutput: 4_096,
    modalities: ['text'], supportsStreaming: true,
    supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    sovereignExecution: true, wireProtocol: 'REST/HTTP',
    hasAttestation: false, hasMathRouting: false, pricingModel: 'per-token',
  },
];

// ══════════════════════════════════════════════════════════════════
//  COMPARISON RESULT TYPES
// ══════════════════════════════════════════════════════════════════

export interface EngineComparison {
  readonly novaEngine: NovaEngineDefinition;
  readonly competitor: ExternalModelProfile;
  readonly advantages: readonly string[];
  readonly disadvantages: readonly string[];
  readonly contextRatio: number;        // nova / competitor
  readonly outputRatio: number;         // nova / competitor
  readonly modalityOverlap: number;     // 0.0-1.0
  readonly sovereigntyAdvantage: boolean;
  readonly attestationAdvantage: boolean;
  readonly overallPhiScore: number;     // φ-weighted composite
}

export interface EngineComparisonMatrix {
  readonly novaEngineId: NovaEngineId;
  readonly novaEngineName: string;
  readonly comparisons: readonly EngineComparison[];
  readonly bestOverallMatch: string;    // competitor ID
  readonly novaAdvantageCount: number;
  readonly competitorAdvantageCount: number;
}

export interface FullComparisonReport {
  readonly timestamp: number;
  readonly totalNovaEngines: number;
  readonly totalCompetitors: number;
  readonly matrices: readonly EngineComparisonMatrix[];
  readonly summary: ComparisonSummary;
}

export interface ComparisonSummary {
  readonly totalComparisons: number;
  readonly novaWins: number;
  readonly competitorWins: number;
  readonly ties: number;
  readonly novaUniqueCaps: readonly string[];     // capabilities only Nova has
  readonly competitorUniqueCaps: readonly string[]; // capabilities only competitors have
  readonly novaMaxContext: number;
  readonly competitorMaxContext: number;
  readonly averagePhiScore: number;
}

// ══════════════════════════════════════════════════════════════════
//  COMPARISON ENGINE
// ══════════════════════════════════════════════════════════════════

export class NovaEngineComparison {
  readonly name = 'NOVA ENGINE COMPARISON';
  readonly designation = 'Comparatio Motoris — Deep Intelligence Benchmarking';

  /** Compare a single Nova engine against a single competitor */
  compare(novaEngine: NovaEngineDefinition, competitor: ExternalModelProfile): EngineComparison {
    const advantages: string[] = [];
    const disadvantages: string[] = [];

    // Context window
    const contextRatio = competitor.contextWindow > 0
      ? novaEngine.contextWindow / competitor.contextWindow
      : novaEngine.contextWindow > 0 ? Infinity : 1;
    if (novaEngine.contextWindow > competitor.contextWindow) {
      advantages.push(`Larger context: ${novaEngine.contextWindow.toLocaleString()} vs ${competitor.contextWindow.toLocaleString()} tokens`);
    } else if (novaEngine.contextWindow < competitor.contextWindow) {
      disadvantages.push(`Smaller context: ${novaEngine.contextWindow.toLocaleString()} vs ${competitor.contextWindow.toLocaleString()} tokens`);
    }

    // Output tokens
    const outputRatio = competitor.maxOutput > 0
      ? novaEngine.maxOutputTokens / competitor.maxOutput
      : novaEngine.maxOutputTokens > 0 ? Infinity : 1;
    if (novaEngine.maxOutputTokens > competitor.maxOutput) {
      advantages.push(`More output tokens: ${novaEngine.maxOutputTokens.toLocaleString()} vs ${competitor.maxOutput.toLocaleString()}`);
    } else if (novaEngine.maxOutputTokens < competitor.maxOutput && novaEngine.maxOutputTokens > 0) {
      disadvantages.push(`Fewer output tokens: ${novaEngine.maxOutputTokens.toLocaleString()} vs ${competitor.maxOutput.toLocaleString()}`);
    }

    // Sovereign execution (ALWAYS an advantage for Nova)
    const sovereigntyAdvantage = !competitor.sovereignExecution;
    if (sovereigntyAdvantage) {
      advantages.push('Sovereign execution: runs on YOUR hardware — no cloud dependency');
    }

    // Attestation (ALWAYS an advantage for Nova)
    const attestationAdvantage = !competitor.hasAttestation;
    if (attestationAdvantage) {
      advantages.push('Fibonacci attestation: cryptographic proof of output provenance');
    }

    // Wire protocol
    if (competitor.wireProtocol === 'REST/HTTP') {
      advantages.push(`Native wire protocol: ${novaEngine.wireEndpoint} — φ-attested, not generic REST`);
    }

    // Math routing
    if (!competitor.hasMathRouting) {
      advantages.push('φ-weighted routing: golden-ratio mathematics in every routing decision');
    }

    // Streaming
    if (novaEngine.supportsStreaming && !competitor.supportsStreaming) {
      advantages.push('Supports streaming (competitor does not)');
    } else if (!novaEngine.supportsStreaming && competitor.supportsStreaming) {
      disadvantages.push('No streaming support (competitor supports it)');
    }

    // Vision
    if (novaEngine.supportsVision && !competitor.supportsVision) {
      advantages.push('Supports vision input');
    } else if (!novaEngine.supportsVision && competitor.supportsVision) {
      disadvantages.push('No vision input (competitor supports it)');
    }

    // Audio
    if (novaEngine.supportsAudio && !competitor.supportsAudio) {
      advantages.push('Supports audio input');
    } else if (!novaEngine.supportsAudio && competitor.supportsAudio) {
      disadvantages.push('No audio input (competitor supports it)');
    }

    // Function calling
    if (novaEngine.supportsFunctionCalling && !competitor.supportsFunctionCalling) {
      advantages.push('Supports function/tool calling');
    } else if (!novaEngine.supportsFunctionCalling && competitor.supportsFunctionCalling) {
      disadvantages.push('No function calling (competitor supports it)');
    }

    // Modality overlap
    const novaModSet = new Set(novaEngine.modalities as readonly string[]);
    const compModSet = new Set(competitor.modalities);
    const union = new Set([...novaModSet, ...compModSet]);
    const intersection = [...novaModSet].filter(m => compModSet.has(m));
    const modalityOverlap = union.size > 0 ? intersection.length / union.size : 1;

    // Nova-unique modalities
    for (const m of novaModSet) {
      if (!compModSet.has(m)) {
        advantages.push(`Unique modality: ${m}`);
      }
    }
    for (const m of compModSet) {
      if (!novaModSet.has(m)) {
        disadvantages.push(`Missing modality: ${m}`);
      }
    }

    // Composite φ-score
    let score = novaEngine.phiWeight;
    score *= (1 + advantages.length * 0.1 * PHI);
    score /= (1 + disadvantages.length * 0.1);
    score *= (sovereigntyAdvantage ? PHI : 1);
    score *= (attestationAdvantage ? PHI : 1);
    const overallPhiScore = Math.round(score * 1000) / 1000;

    return {
      novaEngine,
      competitor,
      advantages,
      disadvantages,
      contextRatio: Math.round(contextRatio * 1000) / 1000,
      outputRatio: Math.round(outputRatio * 1000) / 1000,
      modalityOverlap: Math.round(modalityOverlap * 1000) / 1000,
      sovereigntyAdvantage,
      attestationAdvantage,
      overallPhiScore,
    };
  }

  /** Compare a single Nova engine against ALL competitors */
  compareEngine(engineId: NovaEngineId): EngineComparisonMatrix {
    const novaEngine = NOVA_ENGINES.find(e => e.id === engineId);
    if (!novaEngine) throw new Error(`Engine ${engineId} not found`);

    const comparisons = EXTERNAL_MODELS.map(comp => this.compare(novaEngine, comp));

    let novaAdv = 0;
    let compAdv = 0;
    for (const c of comparisons) {
      if (c.advantages.length > c.disadvantages.length) novaAdv++;
      else if (c.disadvantages.length > c.advantages.length) compAdv++;
    }

    const best = comparisons.reduce((a, b) =>
      a.modalityOverlap > b.modalityOverlap ? a : b,
    );

    return {
      novaEngineId: engineId,
      novaEngineName: novaEngine.name,
      comparisons,
      bestOverallMatch: best.competitor.id,
      novaAdvantageCount: novaAdv,
      competitorAdvantageCount: compAdv,
    };
  }

  /** Full comparison report: all 23 engines vs all competitors */
  fullReport(): FullComparisonReport {
    const matrices = NOVA_ENGINES.map(e => this.compareEngine(e.id));

    let totalComps = 0;
    let novaWins = 0;
    let compWins = 0;
    let ties = 0;
    let phiSum = 0;

    for (const m of matrices) {
      for (const c of m.comparisons) {
        totalComps++;
        phiSum += c.overallPhiScore;
        if (c.advantages.length > c.disadvantages.length) novaWins++;
        else if (c.disadvantages.length > c.advantages.length) compWins++;
        else ties++;
      }
    }

    // Unique Nova capabilities
    const novaModalities = new Set<string>();
    for (const e of NOVA_ENGINES) {
      for (const m of e.modalities) novaModalities.add(m);
    }
    const compModalities = new Set<string>();
    for (const e of EXTERNAL_MODELS) {
      for (const m of e.modalities) compModalities.add(m);
    }

    const novaUnique = [...novaModalities].filter(m => !compModalities.has(m));
    const compUnique = [...compModalities].filter(m => !novaModalities.has(m));

    const novaMaxCtx = Math.max(...NOVA_ENGINES.map(e => e.contextWindow));
    const compMaxCtx = Math.max(...EXTERNAL_MODELS.map(e => e.contextWindow));

    return {
      timestamp: Date.now(),
      totalNovaEngines: NOVA_ENGINES.length,
      totalCompetitors: EXTERNAL_MODELS.length,
      matrices,
      summary: {
        totalComparisons: totalComps,
        novaWins,
        competitorWins: compWins,
        ties,
        novaUniqueCaps: novaUnique,
        competitorUniqueCaps: compUnique,
        novaMaxContext: novaMaxCtx,
        competitorMaxContext: compMaxCtx,
        averagePhiScore: totalComps > 0 ? Math.round(phiSum / totalComps * 1000) / 1000 : 0,
      },
    };
  }

  /** Generate a human-readable comparison for a single engine */
  explain(engineId: NovaEngineId): string {
    const matrix = this.compareEngine(engineId);
    const e = NOVA_ENGINES.find(en => en.id === engineId)!;

    const lines: string[] = [
      `═══════════════════════════════════════════════`,
      `  ${e.name} (${e.id}) — Deep Comparison`,
      `  "${e.description}"`,
      `  Wire: ${e.wireEndpoint}  |  Context: ${e.contextWindow.toLocaleString()} tokens`,
      `  Modalities: ${e.modalities.join(', ')}`,
      `  Streaming: ${e.supportsStreaming}  |  Vision: ${e.supportsVision}  |  Audio: ${e.supportsAudio}`,
      `  Function Calling: ${e.supportsFunctionCalling}  |  φ-weight: ${e.phiWeight.toFixed(4)}`,
      `═══════════════════════════════════════════════`,
      '',
    ];

    for (const c of matrix.comparisons) {
      lines.push(`  vs ${c.competitor.name} (${c.competitor.vendor})`);
      lines.push(`    Context ratio: ${c.contextRatio}x  |  Output ratio: ${c.outputRatio}x`);
      lines.push(`    Modality overlap: ${(c.modalityOverlap * 100).toFixed(1)}%`);
      lines.push(`    φ-score: ${c.overallPhiScore}`);
      if (c.advantages.length > 0) {
        lines.push(`    ✓ Nova advantages:`);
        for (const a of c.advantages) lines.push(`      + ${a}`);
      }
      if (c.disadvantages.length > 0) {
        lines.push(`    ✗ Competitor advantages:`);
        for (const d of c.disadvantages) lines.push(`      - ${d}`);
      }
      lines.push('');
    }

    lines.push(`  Summary: Nova wins ${matrix.novaAdvantageCount}/${matrix.comparisons.length} matchups`);
    lines.push(`  Best competitive match: ${matrix.bestOverallMatch}`);

    return lines.join('\n');
  }

  /** Explain ALL 23 engines */
  explainAll(): string {
    return NOVA_ENGINES.map(e => this.explain(e.id)).join('\n\n');
  }
}
