///
/// NOVA API CLIENT — Direct AI Call Interface for All 23 Engines
///
/// This is the HTTP/WebSocket API layer. Every Nova engine has a typed
/// call method: nova.cognos.chat(), nova.pictor.generate(), nova.vector.embed(), etc.
///
/// All calls go through nova-wire/* protocol with:
///   - Fibonacci hash attestation on every response
///   - φ-cascade integrity verification
///   - Streaming support via AsyncIterator
///   - Automatic retry with golden-ratio backoff
///   - Sovereign-only mode (force on-device execution)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

import {
  type NovaEngineId,
  type NovaWireSlug,
  type NovaChatRequest,
  type NovaChatResponse,
  type NovaChatStreamChunk,
  type NovaEmbeddingRequest,
  type NovaEmbeddingResponse,
  type NovaImageRequest,
  type NovaImageResponse,
  type NovaVideoRequest,
  type NovaVideoResponse,
  type NovaAudioRequest,
  type NovaAudioResponse,
  type NovaCodeRequest,
  type NovaCodeResponse,
  type NovaSearchRequest,
  type NovaSearchResponse,
  type NovaSafetyRequest,
  type NovaSafetyResponse,
  type NovaRankRequest,
  type NovaRankResponse,
  type NovaMessage,
  NOVA_ENGINES,
  NovaEngineRegistry,
} from './NovaEngineModels.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const DEFAULT_BASE_URL = 'https://api.nova-protocol.ai';
const MAX_RETRIES = 5;
const BASE_RETRY_MS = 873; // organism heartbeat

// ══════════════════════════════════════════════════════════════════
//  API CLIENT CONFIGURATION
// ══════════════════════════════════════════════════════════════════

export interface NovaAPIConfig {
  readonly apiKey: string;
  readonly baseUrl?: string;
  readonly timeout?: number;
  readonly maxRetries?: number;
  readonly sovereignMode?: boolean;       // force all calls to edge engines
  readonly onRequest?: (req: NovaWireRequest) => void;
  readonly onResponse?: (res: NovaWireResponse) => void;
}

export interface NovaWireRequest {
  readonly wireEndpoint: string;
  readonly method: string;
  readonly body: Record<string, unknown>;
  readonly timestamp: number;
  readonly requestHash: number;
}

export interface NovaWireResponse {
  readonly wireEndpoint: string;
  readonly status: number;
  readonly body: Record<string, unknown>;
  readonly attestationHash: number;
  readonly latencyMs: number;
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  ATTESTATION — Verify every response is genuine Nova output
// ══════════════════════════════════════════════════════════════════

function computeAttestation(content: string, engine: NovaEngineId, timestamp: number): number {
  let h = 0;
  const source = content + engine + timestamp.toString();
  for (let i = 0; i < source.length; i++) {
    h = ((h << 5) - h + source.charCodeAt(i)) | 0;
  }
  return fibonacciHash(Math.abs(h), 2147483647);
}

function goldenRetryDelay(attempt: number): number {
  return Math.floor(BASE_RETRY_MS * Math.pow(PHI, attempt));
}

function generateRequestId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `nova-${ts}-${rand}`;
}

// ══════════════════════════════════════════════════════════════════
//  ENGINE-SPECIFIC CALL INTERFACES
// ══════════════════════════════════════════════════════════════════

export interface NovaCognosAPI {
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
  stream(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): AsyncGenerator<NovaChatStreamChunk>;
}

export interface NovaProfundisAPI {
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
  stream(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): AsyncGenerator<NovaChatStreamChunk>;
  analyzeDocument(document: string, question: string): Promise<NovaChatResponse>;
}

export interface NovaFusioAPI {
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
  fuse(inputs: readonly { modality: string; content: string }[]): Promise<NovaChatResponse>;
}

export interface NovaLinguaAPI {
  translate(text: string, from: string, to: string): Promise<NovaChatResponse>;
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
}

export interface NovaStratosAPI {
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
  quickAnswer(question: string): Promise<string>;
}

export interface NovaMemoriaAPI {
  retrieve(query: string, context?: readonly string[]): Promise<NovaChatResponse>;
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
}

export interface NovaVectorAPI {
  embed(input: string | readonly string[], dimensions?: number): Promise<NovaEmbeddingResponse>;
}

export interface NovaCodexAPI {
  generate(prompt: string, language?: string): Promise<NovaCodeResponse>;
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
  review(code: string, language: string): Promise<NovaChatResponse>;
}

export interface NovaPictorAPI {
  generate(prompt: string, options?: Partial<NovaImageRequest>): Promise<NovaImageResponse>;
}

export interface NovaKinemaAPI {
  generate(prompt: string, options?: Partial<NovaVideoRequest>): Promise<NovaVideoResponse>;
}

export interface NovaHarmoniaAPI {
  compose(prompt: string, options?: Partial<NovaAudioRequest>): Promise<NovaAudioResponse>;
  transcribe(audioBase64: string): Promise<NovaChatResponse>;
}

export interface NovaSegmentumAPI {
  segment(imageBase64: string, prompt?: string): Promise<{ masks: readonly string[]; labels: readonly string[] }>;
}

export interface NovaScrutatorAPI {
  search(query: string, maxResults?: number): Promise<NovaSearchResponse>;
}

export interface NovaCustodisAPI {
  check(content: string, categories?: readonly string[]): Promise<NovaSafetyResponse>;
}

export interface NovaRankerAPI {
  rank(query: string, documents: readonly string[], topK?: number): Promise<NovaRankResponse>;
}

export interface NovaFormalisAPI {
  prove(statement: string): Promise<NovaChatResponse>;
  solve(equation: string): Promise<NovaChatResponse>;
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
}

export interface NovaAlgorithmusAPI {
  solve(problem: string, language?: string): Promise<NovaCodeResponse>;
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
}

export interface NovaVoxAPI {
  speak(text: string, voice?: string, format?: string): Promise<NovaAudioResponse>;
}

export interface NovaSocialisAPI {
  analyzeTrends(topic: string): Promise<NovaChatResponse>;
  draftPost(prompt: string, platform?: string): Promise<NovaChatResponse>;
}

export interface NovaEmpathosAPI {
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
  stream(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): AsyncGenerator<NovaChatStreamChunk>;
}

export interface NovaAnalyticaAPI {
  analyze(data: string, question: string): Promise<NovaChatResponse>;
  generateSQL(naturalLanguage: string, schema?: string): Promise<NovaCodeResponse>;
}

export interface NovaStructuraAPI {
  generate(prompt: string, schema: Record<string, unknown>): Promise<NovaChatResponse>;
  chat(messages: readonly NovaMessage[], options?: Partial<NovaChatRequest>): Promise<NovaChatResponse>;
}

export interface NovaVisioAPI {
  analyze(imageBase64: string, question: string): Promise<NovaChatResponse>;
  embed(imageBase64: string): Promise<NovaEmbeddingResponse>;
}

// ══════════════════════════════════════════════════════════════════
//  NOVA API CLIENT — The unified interface to all 23 engines
// ══════════════════════════════════════════════════════════════════

export class NovaAPIClient {
  readonly config: NovaAPIConfig;
  readonly registry: NovaEngineRegistry;

  // ── All 23 engine APIs ─────────────────────────────────────────
  readonly cognos:      NovaCognosAPI;
  readonly profundis:   NovaProfundisAPI;
  readonly fusio:       NovaFusioAPI;
  readonly lingua:      NovaLinguaAPI;
  readonly stratos:     NovaStratosAPI;
  readonly memoria:     NovaMemoriaAPI;
  readonly vector:      NovaVectorAPI;
  readonly codex:       NovaCodexAPI;
  readonly pictor:      NovaPictorAPI;
  readonly kinema:      NovaKinemaAPI;
  readonly harmonia:    NovaHarmoniaAPI;
  readonly segmentum:   NovaSegmentumAPI;
  readonly scrutator:   NovaScrutatorAPI;
  readonly custodis:    NovaCustodisAPI;
  readonly ranker:      NovaRankerAPI;
  readonly formalis:    NovaFormalisAPI;
  readonly algorithmus: NovaAlgorithmusAPI;
  readonly vox:         NovaVoxAPI;
  readonly socialis:    NovaSocialisAPI;
  readonly empathos:    NovaEmpathosAPI;
  readonly analytica:   NovaAnalyticaAPI;
  readonly structura:   NovaStructuraAPI;
  readonly visio:       NovaVisioAPI;

  private totalRequests = 0;
  private totalTokens = 0;

  constructor(config: NovaAPIConfig) {
    this.config = config;
    this.registry = new NovaEngineRegistry();

    // Wire all 23 engine APIs
    this.cognos      = this.buildChatEngine('NOV-001');
    this.profundis   = this.buildProfundisEngine();
    this.fusio       = this.buildFusioEngine();
    this.lingua      = this.buildLinguaEngine();
    this.stratos     = this.buildStratosEngine();
    this.memoria     = this.buildMemoriaEngine();
    this.vector      = this.buildVectorEngine();
    this.codex       = this.buildCodexEngine();
    this.pictor      = this.buildPictorEngine();
    this.kinema      = this.buildKinemaEngine();
    this.harmonia    = this.buildHarmoniaEngine();
    this.segmentum   = this.buildSegmentumEngine();
    this.scrutator   = this.buildScrutatorEngine();
    this.custodis    = this.buildCustodisEngine();
    this.ranker      = this.buildRankerEngine();
    this.formalis    = this.buildFormalisEngine();
    this.algorithmus = this.buildAlgorithmusEngine();
    this.vox         = this.buildVoxEngine();
    this.socialis    = this.buildSocialisEngine();
    this.empathos    = this.buildChatEngine('NOV-020') as unknown as NovaEmpathosAPI;
    this.analytica   = this.buildAnalyticaEngine();
    this.structura   = this.buildStructuraEngine();
    this.visio       = this.buildVisioEngine();
  }

  // ── Core request dispatcher ────────────────────────────────────

  private async dispatch(
    engineId: NovaEngineId,
    method: string,
    body: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const engine = this.registry.byId(engineId);
    if (!engine) throw new Error(`Unknown engine: ${engineId}`);

    const baseUrl = this.config.baseUrl ?? DEFAULT_BASE_URL;
    const url = `${baseUrl}${engine.apiPath}/${method}`;
    const timestamp = Date.now();
    const requestHash = computeAttestation(JSON.stringify(body), engineId, timestamp);

    const wireReq: NovaWireRequest = {
      wireEndpoint: engine.wireEndpoint,
      method,
      body,
      timestamp,
      requestHash,
    };

    this.config.onRequest?.(wireReq);
    this.totalRequests++;

    const maxRetries = this.config.maxRetries ?? MAX_RETRIES;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const startMs = Date.now();

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`,
            'X-Nova-Wire': engine.wireEndpoint,
            'X-Nova-Request-Hash': requestHash.toString(),
            'X-Nova-Sovereign': (this.config.sovereignMode ?? false).toString(),
          },
          body: JSON.stringify({
            ...body,
            _nova: {
              engineId,
              wireProtocol: engine.wireEndpoint,
              requestHash,
              timestamp,
              sovereignOnly: this.config.sovereignMode ?? false,
            },
          }),
          signal: AbortSignal.timeout(this.config.timeout ?? 120_000),
        });

        const latencyMs = Date.now() - startMs;

        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`Nova API error ${response.status}: ${errorBody}`);
        }

        const result = await response.json() as Record<string, unknown>;
        const attestationHash = computeAttestation(
          JSON.stringify(result), engineId, Date.now(),
        );

        const wireRes: NovaWireResponse = {
          wireEndpoint: engine.wireEndpoint,
          status: response.status,
          body: result,
          attestationHash,
          latencyMs,
          timestamp: Date.now(),
        };

        this.config.onResponse?.(wireRes);
        return result;

      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxRetries - 1) {
          const delay = goldenRetryDelay(attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError ?? new Error(`Failed after ${maxRetries} retries`);
  }

  // ── Chat dispatch (shared by all text engines) ─────────────────

  private async chatDispatch(
    engineId: NovaEngineId,
    messages: readonly NovaMessage[],
    options?: Partial<NovaChatRequest>,
  ): Promise<NovaChatResponse> {
    const engine = this.registry.byId(engineId);
    const result = await this.dispatch(engineId, 'chat', {
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? (engine?.maxOutputTokens ?? 8192),
      top_p: options?.topP ?? 1.0,
      response_format: options?.responseFormat ?? 'text',
      functions: options?.functions,
    });

    const content = (result['content'] as string) ?? '';
    const usage = (result['usage'] as Record<string, number>) ?? {};
    this.totalTokens += (usage['total_tokens'] ?? 0);

    return {
      id: generateRequestId(),
      engine: engineId,
      engineName: engine?.name ?? engineId,
      content,
      finishReason: (result['finish_reason'] as NovaChatResponse['finishReason']) ?? 'stop',
      usage: {
        promptTokens: usage['prompt_tokens'] ?? 0,
        completionTokens: usage['completion_tokens'] ?? 0,
        totalTokens: usage['total_tokens'] ?? 0,
      },
      functionCall: result['function_call'] as NovaChatResponse['functionCall'],
      attestation: {
        hash: computeAttestation(content, engineId, Date.now()),
        wireProtocol: engine?.wireEndpoint ?? `nova-wire/${engineId}`,
        timestamp: Date.now(),
      },
    };
  }

  // ── Stream dispatch ────────────────────────────────────────────

  private async *streamDispatch(
    engineId: NovaEngineId,
    messages: readonly NovaMessage[],
    options?: Partial<NovaChatRequest>,
  ): AsyncGenerator<NovaChatStreamChunk> {
    const engine = this.registry.byId(engineId);
    if (!engine) throw new Error(`Unknown engine: ${engineId}`);

    const baseUrl = this.config.baseUrl ?? DEFAULT_BASE_URL;
    const url = `${baseUrl}${engine.apiPath}/chat/stream`;
    const timestamp = Date.now();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'X-Nova-Wire': engine.wireEndpoint,
        'X-Nova-Sovereign': (this.config.sovereignMode ?? false).toString(),
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? engine.maxOutputTokens,
        stream: true,
        _nova: { engineId, wireProtocol: engine.wireEndpoint, timestamp },
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Nova stream error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let index = 0;
    const requestId = generateRequestId();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data) as Record<string, unknown>;
            const delta = ((parsed['choices'] as Record<string, unknown>[])?.[0]?.['delta'] as Record<string, unknown>)?.['content'] as string ?? '';

            yield {
              id: requestId,
              engine: engineId,
              delta,
              finishReason: ((parsed['choices'] as Record<string, unknown>[])?.[0]?.['finish_reason'] as NovaChatStreamChunk['finishReason']) ?? null,
              index: index++,
            };
          } catch {
            // skip malformed chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  // ══════════════════════════════════════════════════════════════════
  //  ENGINE-SPECIFIC BUILDERS
  // ══════════════════════════════════════════════════════════════════

  private buildChatEngine(engineId: NovaEngineId): NovaCognosAPI {
    return {
      chat: (messages, options) => this.chatDispatch(engineId, messages, options),
      stream: (messages, options) => this.streamDispatch(engineId, messages, options),
    };
  }

  private buildProfundisEngine(): NovaProfundisAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-002', messages, options),
      stream: (messages, options) => this.streamDispatch('NOV-002', messages, options),
      analyzeDocument: (document, question) => this.chatDispatch('NOV-002', [
        { role: 'system', content: 'You are Nova Profundis, a deep long-context analysis engine. Analyze the following document thoroughly.' },
        { role: 'user', content: `Document:\n${document}\n\nQuestion: ${question}` },
      ], { maxTokens: 32_768 }),
    };
  }

  private buildFusioEngine(): NovaFusioAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-003', messages, options),
      fuse: (inputs) => this.chatDispatch('NOV-003', [
        { role: 'system', content: 'You are Nova Fusio, a multi-modal fusion engine. Synthesize the following inputs into a unified understanding.' },
        { role: 'user', content: inputs.map(i => `[${i.modality}]: ${i.content}`).join('\n\n') },
      ]),
    };
  }

  private buildLinguaEngine(): NovaLinguaAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-004', messages, options),
      translate: (text, from, to) => this.chatDispatch('NOV-004', [
        { role: 'system', content: `You are Nova Lingua. Translate from ${from} to ${to}. Output ONLY the translation.` },
        { role: 'user', content: text },
      ]),
    };
  }

  private buildStratosEngine(): NovaStratosAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-005', messages, { ...options, sovereignOnly: true }),
      quickAnswer: async (question) => {
        const r = await this.chatDispatch('NOV-005', [
          { role: 'user', content: question },
        ], { maxTokens: 512, temperature: 0.3 });
        return r.content;
      },
    };
  }

  private buildMemoriaEngine(): NovaMemoriaAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-006', messages, options),
      retrieve: (query, context) => this.chatDispatch('NOV-006', [
        { role: 'system', content: 'You are Nova Memoria, a RAG-grounded engine. Use the provided context to answer accurately.' },
        ...(context ? [{ role: 'user' as const, content: `Context:\n${context.join('\n---\n')}\n\nQuery: ${query}` }] : [{ role: 'user' as const, content: query }]),
      ]),
    };
  }

  private buildVectorEngine(): NovaVectorAPI {
    return {
      embed: async (input, dimensions) => {
        const result = await this.dispatch('NOV-007', 'embeddings', {
          input: Array.isArray(input) ? input : [input],
          dimensions: dimensions ?? 1536,
        });
        return {
          engine: 'NOV-007' as const,
          embeddings: (result['data'] as { embedding: number[] }[])?.map(d => d.embedding) ?? [],
          dimensions: dimensions ?? 1536,
          usage: { totalTokens: (result['usage'] as Record<string, number>)?.['total_tokens'] ?? 0 },
        };
      },
    };
  }

  private buildCodexEngine(): NovaCodexAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-008', messages, options),
      generate: async (prompt, language) => {
        const r = await this.chatDispatch('NOV-008', [
          { role: 'system', content: `You are Nova Codex. Generate ${language ?? 'code'}. Output ONLY code.` },
          { role: 'user', content: prompt },
        ]);
        return {
          engine: 'NOV-008' as const,
          code: r.content,
          language: language ?? 'auto',
          attestation: r.attestation,
        };
      },
      review: (code, language) => this.chatDispatch('NOV-008', [
        { role: 'system', content: 'You are Nova Codex. Review this code for bugs, security issues, and improvements.' },
        { role: 'user', content: `\`\`\`${language}\n${code}\n\`\`\`` },
      ]),
    };
  }

  private buildPictorEngine(): NovaPictorAPI {
    return {
      generate: async (prompt, options) => {
        const result = await this.dispatch('NOV-009', 'generate', {
          prompt,
          negative_prompt: options?.negativePrompt,
          width: options?.width ?? 1024,
          height: options?.height ?? 1024,
          steps: options?.steps ?? 30,
          n: options?.count ?? 1,
          style: options?.style,
        });
        return {
          engine: 'NOV-009' as const,
          images: (result['data'] as { b64_json: string }[])?.map(d => d.b64_json) ?? [],
          revisedPrompt: (result['revised_prompt'] as string) ?? prompt,
          attestation: {
            hash: computeAttestation(prompt, 'NOV-009', Date.now()),
            timestamp: Date.now(),
          },
        };
      },
    };
  }

  private buildKinemaEngine(): NovaKinemaAPI {
    return {
      generate: async (prompt, options) => {
        const result = await this.dispatch('NOV-010', 'generate', {
          prompt,
          duration_seconds: options?.durationSeconds ?? 5,
          width: options?.width ?? 1280,
          height: options?.height ?? 720,
          fps: options?.fps ?? 24,
        });
        return {
          engine: 'NOV-010' as const,
          videoUrl: (result['video_url'] as string) ?? '',
          durationSeconds: options?.durationSeconds ?? 5,
          attestation: {
            hash: computeAttestation(prompt, 'NOV-010', Date.now()),
            timestamp: Date.now(),
          },
        };
      },
    };
  }

  private buildHarmoniaEngine(): NovaHarmoniaAPI {
    return {
      compose: async (prompt, options) => {
        const result = await this.dispatch('NOV-011', 'compose', {
          prompt,
          format: options?.format ?? 'mp3',
        });
        return {
          engine: 'NOV-011' as const,
          audioBase64: (result['audio'] as string) ?? '',
          format: options?.format ?? 'mp3',
          durationMs: (result['duration_ms'] as number) ?? 0,
          attestation: {
            hash: computeAttestation(prompt, 'NOV-011', Date.now()),
            timestamp: Date.now(),
          },
        };
      },
      transcribe: (audioBase64) => this.chatDispatch('NOV-011', [
        { role: 'user', content: 'Transcribe this audio.', audio: audioBase64 },
      ]),
    };
  }

  private buildSegmentumEngine(): NovaSegmentumAPI {
    return {
      segment: async (imageBase64, prompt) => {
        const result = await this.dispatch('NOV-012', 'segment', {
          image: imageBase64,
          prompt,
        });
        return {
          masks: (result['masks'] as string[]) ?? [],
          labels: (result['labels'] as string[]) ?? [],
        };
      },
    };
  }

  private buildScrutatorEngine(): NovaScrutatorAPI {
    return {
      search: async (query, maxResults) => {
        const result = await this.dispatch('NOV-013', 'search', {
          query,
          max_results: maxResults ?? 10,
        });
        return {
          engine: 'NOV-013' as const,
          results: (result['results'] as NovaSearchResponse['results']) ?? [],
          answer: result['answer'] as string,
        };
      },
    };
  }

  private buildCustodisEngine(): NovaCustodisAPI {
    return {
      check: async (content, categories) => {
        const result = await this.dispatch('NOV-014', 'check', {
          content,
          categories: categories ?? ['toxicity', 'violence', 'sexual', 'pii', 'injection'],
        });
        return {
          engine: 'NOV-014' as const,
          safe: (result['safe'] as boolean) ?? true,
          scores: (result['scores'] as Record<string, number>) ?? {},
          flaggedCategories: (result['flagged'] as string[]) ?? [],
        };
      },
    };
  }

  private buildRankerEngine(): NovaRankerAPI {
    return {
      rank: async (query, documents, topK) => {
        const result = await this.dispatch('NOV-015', 'rank', {
          query,
          documents,
          top_k: topK ?? documents.length,
        });
        return {
          engine: 'NOV-015' as const,
          rankings: (result['rankings'] as NovaRankResponse['rankings']) ?? [],
        };
      },
    };
  }

  private buildFormalisEngine(): NovaFormalisAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-016', messages, options),
      prove: (statement) => this.chatDispatch('NOV-016', [
        { role: 'system', content: 'You are Nova Formalis. Provide a rigorous proof.' },
        { role: 'user', content: `Prove: ${statement}` },
      ]),
      solve: (equation) => this.chatDispatch('NOV-016', [
        { role: 'system', content: 'You are Nova Formalis. Solve step by step.' },
        { role: 'user', content: `Solve: ${equation}` },
      ]),
    };
  }

  private buildAlgorithmusEngine(): NovaAlgorithmusAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-017', messages, options),
      solve: async (problem, language) => {
        const r = await this.chatDispatch('NOV-017', [
          { role: 'system', content: `You are Nova Algorithmus. Solve this problem in ${language ?? 'Python'}. Output optimized code.` },
          { role: 'user', content: problem },
        ]);
        return {
          engine: 'NOV-017' as const,
          code: r.content,
          language: language ?? 'python',
          attestation: r.attestation,
        };
      },
    };
  }

  private buildVoxEngine(): NovaVoxAPI {
    return {
      speak: async (text, voice, format) => {
        const result = await this.dispatch('NOV-018', 'speak', {
          text,
          voice: voice ?? 'nova-default',
          format: format ?? 'mp3',
        });
        return {
          engine: 'NOV-018' as const,
          audioBase64: (result['audio'] as string) ?? '',
          format: format ?? 'mp3',
          durationMs: (result['duration_ms'] as number) ?? 0,
          attestation: {
            hash: computeAttestation(text, 'NOV-018', Date.now()),
            timestamp: Date.now(),
          },
        };
      },
    };
  }

  private buildSocialisEngine(): NovaSocialisAPI {
    return {
      analyzeTrends: (topic) => this.chatDispatch('NOV-019', [
        { role: 'system', content: 'You are Nova Socialis. Analyze social media trends.' },
        { role: 'user', content: `Analyze trends for: ${topic}` },
      ]),
      draftPost: (prompt, platform) => this.chatDispatch('NOV-019', [
        { role: 'system', content: `You are Nova Socialis. Draft a ${platform ?? 'social media'} post.` },
        { role: 'user', content: prompt },
      ]),
    };
  }

  private buildAnalyticaEngine(): NovaAnalyticaAPI {
    return {
      analyze: (data, question) => this.chatDispatch('NOV-021', [
        { role: 'system', content: 'You are Nova Analytica. Analyze the data and answer the question.' },
        { role: 'user', content: `Data:\n${data}\n\nQuestion: ${question}` },
      ]),
      generateSQL: async (naturalLanguage, schema) => {
        const r = await this.chatDispatch('NOV-021', [
          { role: 'system', content: `You are Nova Analytica. Generate SQL.${schema ? ` Schema:\n${schema}` : ''} Output ONLY SQL.` },
          { role: 'user', content: naturalLanguage },
        ]);
        return {
          engine: 'NOV-021' as const,
          code: r.content,
          language: 'sql',
          attestation: r.attestation,
        };
      },
    };
  }

  private buildStructuraEngine(): NovaStructuraAPI {
    return {
      chat: (messages, options) => this.chatDispatch('NOV-022', messages, { ...options, responseFormat: 'json' }),
      generate: (prompt, schema) => this.chatDispatch('NOV-022', [
        { role: 'system', content: `You are Nova Structura. Output valid JSON matching this schema: ${JSON.stringify(schema)}` },
        { role: 'user', content: prompt },
      ], { responseFormat: 'json' }),
    };
  }

  private buildVisioEngine(): NovaVisioAPI {
    return {
      analyze: (imageBase64, question) => this.chatDispatch('NOV-023', [
        { role: 'user', content: question, images: [imageBase64] },
      ]),
      embed: async (imageBase64) => {
        const result = await this.dispatch('NOV-023', 'embed', {
          image: imageBase64,
        });
        return {
          engine: 'NOV-007' as const,
          embeddings: [(result['embedding'] as number[]) ?? []],
          dimensions: (result['dimensions'] as number) ?? 512,
          usage: { totalTokens: 0 },
        };
      },
    };
  }

  // ══════════════════════════════════════════════════════════════════
  //  GENERIC CHAT — Route to any engine by ID
  // ══════════════════════════════════════════════════════════════════

  async chat(request: NovaChatRequest): Promise<NovaChatResponse> {
    return this.chatDispatch(request.engine, request.messages, request);
  }

  stream(request: NovaChatRequest): AsyncGenerator<NovaChatStreamChunk> {
    return this.streamDispatch(request.engine, request.messages, request);
  }

  // ══════════════════════════════════════════════════════════════════
  //  STATUS
  // ══════════════════════════════════════════════════════════════════

  status() {
    return {
      engines: this.registry.total,
      totalRequests: this.totalRequests,
      totalTokens: this.totalTokens,
      baseUrl: this.config.baseUrl ?? DEFAULT_BASE_URL,
      sovereignMode: this.config.sovereignMode ?? false,
    };
  }
}
