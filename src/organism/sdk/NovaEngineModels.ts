///
/// NOVA ENGINE MODELS — Complete Definitions for All 23 Sovereign Engines
///
/// Every Nova engine is defined here with its full capability profile,
/// context window, modalities, wire endpoint, and SDK method signature.
/// This is the single source of truth for what each engine can do.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  ENGINE CAPABILITY & REQUEST TYPES
// ══════════════════════════════════════════════════════════════════

export type NovaModality =
  | 'text'
  | 'vision'
  | 'audio'
  | 'video'
  | 'image-gen'
  | 'video-gen'
  | 'audio-gen'
  | 'music-gen'
  | 'voice-gen'
  | 'code'
  | 'embedding'
  | 'search'
  | 'safety'
  | 'math'
  | 'structured';

export type NovaEngineId =
  | 'NOV-001' | 'NOV-002' | 'NOV-003' | 'NOV-004' | 'NOV-005'
  | 'NOV-006' | 'NOV-007' | 'NOV-008' | 'NOV-009' | 'NOV-010'
  | 'NOV-011' | 'NOV-012' | 'NOV-013' | 'NOV-014' | 'NOV-015'
  | 'NOV-016' | 'NOV-017' | 'NOV-018' | 'NOV-019' | 'NOV-020'
  | 'NOV-021' | 'NOV-022' | 'NOV-023';

export type NovaWireSlug =
  | 'cognos' | 'profundis' | 'fusio' | 'lingua' | 'stratos'
  | 'memoria' | 'vector' | 'codex' | 'pictor' | 'kinema'
  | 'harmonia' | 'segmentum' | 'scrutator' | 'custodis' | 'ranker'
  | 'formalis' | 'algorithmus' | 'vox' | 'socialis' | 'empathos'
  | 'analytica' | 'structura' | 'visio';

export interface NovaEngineDefinition {
  readonly id: NovaEngineId;
  readonly name: string;
  readonly slug: NovaWireSlug;
  readonly wireEndpoint: string;           // nova-wire/<slug>
  readonly apiPath: string;                // /v1/engines/<slug>
  readonly description: string;
  readonly modalities: readonly NovaModality[];
  readonly contextWindow: number;          // max tokens
  readonly maxOutputTokens: number;
  readonly supportsStreaming: boolean;
  readonly supportsVision: boolean;
  readonly supportsAudio: boolean;
  readonly supportsFunctionCalling: boolean;
  readonly phiWeight: number;
  readonly fibonacciIdentity: number;
  readonly sdkMethodName: string;          // e.g. "cognos", "pictor"
}

// ══════════════════════════════════════════════════════════════════
//  REQUEST / RESPONSE TYPES — Shared across all engines
// ══════════════════════════════════════════════════════════════════

export interface NovaMessage {
  readonly role: 'system' | 'user' | 'assistant' | 'function';
  readonly content: string;
  readonly name?: string;
  readonly images?: readonly string[];     // base64 or URLs
  readonly audio?: string;                 // base64 audio
}

export interface NovaFunctionDef {
  readonly name: string;
  readonly description: string;
  readonly parameters: Record<string, unknown>;
}

export interface NovaChatRequest {
  readonly engine: NovaEngineId;
  readonly messages: readonly NovaMessage[];
  readonly temperature?: number;
  readonly maxTokens?: number;
  readonly topP?: number;
  readonly stream?: boolean;
  readonly functions?: readonly NovaFunctionDef[];
  readonly responseFormat?: 'text' | 'json' | 'markdown';
  readonly sovereignOnly?: boolean;        // force edge-only execution
}

export interface NovaChatResponse {
  readonly id: string;
  readonly engine: NovaEngineId;
  readonly engineName: string;
  readonly content: string;
  readonly finishReason: 'stop' | 'length' | 'function_call' | 'error';
  readonly usage: {
    readonly promptTokens: number;
    readonly completionTokens: number;
    readonly totalTokens: number;
  };
  readonly functionCall?: {
    readonly name: string;
    readonly arguments: string;
  };
  readonly attestation: {
    readonly hash: number;
    readonly wireProtocol: string;
    readonly timestamp: number;
  };
}

export interface NovaChatStreamChunk {
  readonly id: string;
  readonly engine: NovaEngineId;
  readonly delta: string;
  readonly finishReason: 'stop' | 'length' | 'function_call' | null;
  readonly index: number;
}

export interface NovaEmbeddingRequest {
  readonly engine: 'NOV-007';
  readonly input: string | readonly string[];
  readonly dimensions?: number;
}

export interface NovaEmbeddingResponse {
  readonly engine: 'NOV-007';
  readonly embeddings: readonly number[][];
  readonly dimensions: number;
  readonly usage: { readonly totalTokens: number };
}

export interface NovaImageRequest {
  readonly engine: 'NOV-009';
  readonly prompt: string;
  readonly negativePrompt?: string;
  readonly width?: number;
  readonly height?: number;
  readonly steps?: number;
  readonly count?: number;
  readonly style?: string;
}

export interface NovaImageResponse {
  readonly engine: 'NOV-009';
  readonly images: readonly string[];      // base64 encoded
  readonly revisedPrompt: string;
  readonly attestation: { readonly hash: number; readonly timestamp: number };
}

export interface NovaVideoRequest {
  readonly engine: 'NOV-010';
  readonly prompt: string;
  readonly durationSeconds?: number;
  readonly width?: number;
  readonly height?: number;
  readonly fps?: number;
}

export interface NovaVideoResponse {
  readonly engine: 'NOV-010';
  readonly videoUrl: string;
  readonly durationSeconds: number;
  readonly attestation: { readonly hash: number; readonly timestamp: number };
}

export interface NovaAudioRequest {
  readonly engine: 'NOV-011' | 'NOV-018';
  readonly prompt?: string;
  readonly text?: string;                  // for TTS
  readonly voice?: string;
  readonly format?: 'mp3' | 'wav' | 'ogg';
}

export interface NovaAudioResponse {
  readonly engine: 'NOV-011' | 'NOV-018';
  readonly audioBase64: string;
  readonly format: string;
  readonly durationMs: number;
  readonly attestation: { readonly hash: number; readonly timestamp: number };
}

export interface NovaCodeRequest {
  readonly engine: 'NOV-008';
  readonly prompt: string;
  readonly language?: string;
  readonly context?: string;
  readonly maxTokens?: number;
  readonly temperature?: number;
}

export interface NovaCodeResponse {
  readonly engine: NovaEngineId;
  readonly code: string;
  readonly language: string;
  readonly explanation?: string;
  readonly attestation: { readonly hash: number; readonly timestamp: number };
}

export interface NovaSearchRequest {
  readonly engine: 'NOV-013';
  readonly query: string;
  readonly maxResults?: number;
  readonly domain?: string;
}

export interface NovaSearchResponse {
  readonly engine: 'NOV-013';
  readonly results: readonly {
    readonly title: string;
    readonly url: string;
    readonly snippet: string;
    readonly relevanceScore: number;
  }[];
  readonly answer?: string;
}

export interface NovaSafetyRequest {
  readonly engine: 'NOV-014';
  readonly content: string;
  readonly categories?: readonly string[];
}

export interface NovaSafetyResponse {
  readonly engine: 'NOV-014';
  readonly safe: boolean;
  readonly scores: Record<string, number>;
  readonly flaggedCategories: readonly string[];
}

export interface NovaRankRequest {
  readonly engine: 'NOV-015';
  readonly query: string;
  readonly documents: readonly string[];
  readonly topK?: number;
}

export interface NovaRankResponse {
  readonly engine: 'NOV-015';
  readonly rankings: readonly {
    readonly index: number;
    readonly score: number;
    readonly document: string;
  }[];
}

// ══════════════════════════════════════════════════════════════════
//  ALL 23 ENGINE DEFINITIONS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;

function engineFibId(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return fibonacciHash(Math.abs(h), 2147483647);
}

export const NOVA_ENGINES: readonly NovaEngineDefinition[] = [
  {
    id: 'NOV-001', name: 'Nova Cognos', slug: 'cognos',
    wireEndpoint: 'nova-wire/cognos', apiPath: '/v1/engines/cognos',
    description: 'Sovereign multi-modal reasoning engine. Handles text, vision, and audio with φ-weighted consensus.',
    modalities: ['text', 'vision', 'audio'],
    contextWindow: 128_000, maxOutputTokens: 16_384,
    supportsStreaming: true, supportsVision: true, supportsAudio: true, supportsFunctionCalling: true,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Cognos'),
    sdkMethodName: 'cognos',
  },
  {
    id: 'NOV-002', name: 'Nova Profundis', slug: 'profundis',
    wireEndpoint: 'nova-wire/profundis', apiPath: '/v1/engines/profundis',
    description: 'Deep long-context analysis engine. 2M token context window for entire books and codebases.',
    modalities: ['text', 'vision'],
    contextWindow: 2_000_000, maxOutputTokens: 32_768,
    supportsStreaming: true, supportsVision: true, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Profundis'),
    sdkMethodName: 'profundis',
  },
  {
    id: 'NOV-003', name: 'Nova Fusio', slug: 'fusio',
    wireEndpoint: 'nova-wire/fusio', apiPath: '/v1/engines/fusio',
    description: 'Multi-modal fusion intelligence. Merges text, vision, audio, and video into unified understanding.',
    modalities: ['text', 'vision', 'audio', 'video'],
    contextWindow: 1_000_000, maxOutputTokens: 16_384,
    supportsStreaming: true, supportsVision: true, supportsAudio: true, supportsFunctionCalling: true,
    phiWeight: PHI * PHI, fibonacciIdentity: engineFibId('Nova Fusio'),
    sdkMethodName: 'fusio',
  },
  {
    id: 'NOV-004', name: 'Nova Lingua', slug: 'lingua',
    wireEndpoint: 'nova-wire/lingua', apiPath: '/v1/engines/lingua',
    description: 'Multilingual transformer. 100+ language reasoning, translation, and cross-lingual understanding.',
    modalities: ['text'],
    contextWindow: 128_000, maxOutputTokens: 16_384,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Lingua'),
    sdkMethodName: 'lingua',
  },
  {
    id: 'NOV-005', name: 'Nova Stratos', slug: 'stratos',
    wireEndpoint: 'nova-wire/stratos', apiPath: '/v1/engines/stratos',
    description: 'Efficient edge reasoning. Ultra-fast sovereign processing for on-device execution.',
    modalities: ['text', 'vision'],
    contextWindow: 32_000, maxOutputTokens: 8_192,
    supportsStreaming: true, supportsVision: true, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI, fibonacciIdentity: engineFibId('Nova Stratos'),
    sdkMethodName: 'stratos',
  },
  {
    id: 'NOV-006', name: 'Nova Memoria', slug: 'memoria',
    wireEndpoint: 'nova-wire/memoria', apiPath: '/v1/engines/memoria',
    description: 'Retrieval-augmented grounding engine. Sovereign RAG with φ-ranked context injection.',
    modalities: ['text'],
    contextWindow: 128_000, maxOutputTokens: 8_192,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI, fibonacciIdentity: engineFibId('Nova Memoria'),
    sdkMethodName: 'memoria',
  },
  {
    id: 'NOV-007', name: 'Nova Vector', slug: 'vector',
    wireEndpoint: 'nova-wire/vector', apiPath: '/v1/engines/vector',
    description: 'Sovereign embedding engine. Generates high-dimensional vectors for semantic search and memory.',
    modalities: ['text', 'embedding'],
    contextWindow: 8_192, maxOutputTokens: 0,
    supportsStreaming: false, supportsVision: false, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI, fibonacciIdentity: engineFibId('Nova Vector'),
    sdkMethodName: 'vector',
  },
  {
    id: 'NOV-008', name: 'Nova Codex', slug: 'codex',
    wireEndpoint: 'nova-wire/codex', apiPath: '/v1/engines/codex',
    description: 'Sovereign code generation forge. Multi-language code completion, refactoring, debugging, and review.',
    modalities: ['text', 'code'],
    contextWindow: 128_000, maxOutputTokens: 16_384,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Codex'),
    sdkMethodName: 'codex',
  },
  {
    id: 'NOV-009', name: 'Nova Pictor', slug: 'pictor',
    wireEndpoint: 'nova-wire/pictor', apiPath: '/v1/engines/pictor',
    description: 'Sovereign image generation. Text-to-image, inpainting, upscaling, style transfer.',
    modalities: ['text', 'image-gen', 'vision'],
    contextWindow: 4_096, maxOutputTokens: 0,
    supportsStreaming: false, supportsVision: true, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Pictor'),
    sdkMethodName: 'pictor',
  },
  {
    id: 'NOV-010', name: 'Nova Kinema', slug: 'kinema',
    wireEndpoint: 'nova-wire/kinema', apiPath: '/v1/engines/kinema',
    description: 'Sovereign video generation. Text-to-video, image-to-video, motion control, scene generation.',
    modalities: ['text', 'video-gen', 'vision'],
    contextWindow: 4_096, maxOutputTokens: 0,
    supportsStreaming: false, supportsVision: true, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Kinema'),
    sdkMethodName: 'kinema',
  },
  {
    id: 'NOV-011', name: 'Nova Harmonia', slug: 'harmonia',
    wireEndpoint: 'nova-wire/harmonia', apiPath: '/v1/engines/harmonia',
    description: 'Sovereign audio/music engine. Music composition, audio generation, speech transcription.',
    modalities: ['text', 'audio', 'music-gen', 'audio-gen'],
    contextWindow: 4_096, maxOutputTokens: 0,
    supportsStreaming: true, supportsVision: false, supportsAudio: true, supportsFunctionCalling: false,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Harmonia'),
    sdkMethodName: 'harmonia',
  },
  {
    id: 'NOV-012', name: 'Nova Segmentum', slug: 'segmentum',
    wireEndpoint: 'nova-wire/segmentum', apiPath: '/v1/engines/segmentum',
    description: 'Vision segmentation engine. Object detection, instance segmentation, semantic masks.',
    modalities: ['vision'],
    contextWindow: 0, maxOutputTokens: 0,
    supportsStreaming: false, supportsVision: true, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI, fibonacciIdentity: engineFibId('Nova Segmentum'),
    sdkMethodName: 'segmentum',
  },
  {
    id: 'NOV-013', name: 'Nova Scrutator', slug: 'scrutator',
    wireEndpoint: 'nova-wire/scrutator', apiPath: '/v1/engines/scrutator',
    description: 'Sovereign search intelligence. Real-time web search with AI-powered answer synthesis.',
    modalities: ['text', 'search'],
    contextWindow: 32_000, maxOutputTokens: 8_192,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Scrutator'),
    sdkMethodName: 'scrutator',
  },
  {
    id: 'NOV-014', name: 'Nova Custodis', slug: 'custodis',
    wireEndpoint: 'nova-wire/custodis', apiPath: '/v1/engines/custodis',
    description: 'Sovereign safety/guard engine. Content moderation, toxicity detection, prompt injection defense.',
    modalities: ['text', 'safety'],
    contextWindow: 32_000, maxOutputTokens: 4_096,
    supportsStreaming: false, supportsVision: false, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Custodis'),
    sdkMethodName: 'custodis',
  },
  {
    id: 'NOV-015', name: 'Nova Ranker', slug: 'ranker',
    wireEndpoint: 'nova-wire/ranker', apiPath: '/v1/engines/ranker',
    description: 'Sovereign relevance scoring. Re-ranks documents and passages by semantic relevance.',
    modalities: ['text'],
    contextWindow: 8_192, maxOutputTokens: 0,
    supportsStreaming: false, supportsVision: false, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI, fibonacciIdentity: engineFibId('Nova Ranker'),
    sdkMethodName: 'ranker',
  },
  {
    id: 'NOV-016', name: 'Nova Formalis', slug: 'formalis',
    wireEndpoint: 'nova-wire/formalis', apiPath: '/v1/engines/formalis',
    description: 'Sovereign math/proof engine. Theorem proving, equation solving, formal verification.',
    modalities: ['text', 'math'],
    contextWindow: 64_000, maxOutputTokens: 16_384,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Formalis'),
    sdkMethodName: 'formalis',
  },
  {
    id: 'NOV-017', name: 'Nova Algorithmus', slug: 'algorithmus',
    wireEndpoint: 'nova-wire/algorithmus', apiPath: '/v1/engines/algorithmus',
    description: 'Sovereign algorithm engine. Algorithm design, optimization, competitive programming.',
    modalities: ['text', 'code'],
    contextWindow: 64_000, maxOutputTokens: 16_384,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Algorithmus'),
    sdkMethodName: 'algorithmus',
  },
  {
    id: 'NOV-018', name: 'Nova Vox', slug: 'vox',
    wireEndpoint: 'nova-wire/vox', apiPath: '/v1/engines/vox',
    description: 'Sovereign voice synthesis. Text-to-speech, voice cloning, multi-speaker generation.',
    modalities: ['text', 'voice-gen'],
    contextWindow: 4_096, maxOutputTokens: 0,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Vox'),
    sdkMethodName: 'vox',
  },
  {
    id: 'NOV-019', name: 'Nova Socialis', slug: 'socialis',
    wireEndpoint: 'nova-wire/socialis', apiPath: '/v1/engines/socialis',
    description: 'Sovereign social intelligence. Trend analysis, sentiment, engagement optimization.',
    modalities: ['text', 'search'],
    contextWindow: 64_000, maxOutputTokens: 8_192,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Socialis'),
    sdkMethodName: 'socialis',
  },
  {
    id: 'NOV-020', name: 'Nova Empathos', slug: 'empathos',
    wireEndpoint: 'nova-wire/empathos', apiPath: '/v1/engines/empathos',
    description: 'Sovereign empathic engine. Emotionally intelligent conversation and wellness support.',
    modalities: ['text'],
    contextWindow: 128_000, maxOutputTokens: 8_192,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Empathos'),
    sdkMethodName: 'empathos',
  },
  {
    id: 'NOV-021', name: 'Nova Analytica', slug: 'analytica',
    wireEndpoint: 'nova-wire/analytica', apiPath: '/v1/engines/analytica',
    description: 'Sovereign data analysis. SQL, statistics, chart generation, pattern detection.',
    modalities: ['text', 'code', 'structured'],
    contextWindow: 128_000, maxOutputTokens: 16_384,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Analytica'),
    sdkMethodName: 'analytica',
  },
  {
    id: 'NOV-022', name: 'Nova Structura', slug: 'structura',
    wireEndpoint: 'nova-wire/structura', apiPath: '/v1/engines/structura',
    description: 'Sovereign structured output. JSON, XML, tables, schemas — guaranteed valid format.',
    modalities: ['text', 'structured'],
    contextWindow: 64_000, maxOutputTokens: 16_384,
    supportsStreaming: true, supportsVision: false, supportsAudio: false, supportsFunctionCalling: true,
    phiWeight: PHI * PHI, fibonacciIdentity: engineFibId('Nova Structura'),
    sdkMethodName: 'structura',
  },
  {
    id: 'NOV-023', name: 'Nova Visio', slug: 'visio',
    wireEndpoint: 'nova-wire/visio', apiPath: '/v1/engines/visio',
    description: 'Sovereign vision-language alignment. Cross-modal understanding between text and images.',
    modalities: ['text', 'vision', 'embedding'],
    contextWindow: 32_000, maxOutputTokens: 8_192,
    supportsStreaming: true, supportsVision: true, supportsAudio: false, supportsFunctionCalling: false,
    phiWeight: PHI * PHI * PHI, fibonacciIdentity: engineFibId('Nova Visio'),
    sdkMethodName: 'visio',
  },
] as const;

// ══════════════════════════════════════════════════════════════════
//  ENGINE REGISTRY
// ══════════════════════════════════════════════════════════════════

export class NovaEngineRegistry {
  readonly engines: readonly NovaEngineDefinition[] = NOVA_ENGINES;
  readonly total: number = NOVA_ENGINES.length;

  byId(id: NovaEngineId): NovaEngineDefinition | undefined {
    return this.engines.find(e => e.id === id);
  }

  bySlug(slug: NovaWireSlug): NovaEngineDefinition | undefined {
    return this.engines.find(e => e.slug === slug);
  }

  byModality(modality: NovaModality): readonly NovaEngineDefinition[] {
    return this.engines.filter(e => e.modalities.includes(modality));
  }

  withStreaming(): readonly NovaEngineDefinition[] {
    return this.engines.filter(e => e.supportsStreaming);
  }

  withVision(): readonly NovaEngineDefinition[] {
    return this.engines.filter(e => e.supportsVision);
  }

  withFunctionCalling(): readonly NovaEngineDefinition[] {
    return this.engines.filter(e => e.supportsFunctionCalling);
  }
}
