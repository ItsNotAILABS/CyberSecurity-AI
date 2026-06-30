///
/// AI FOUNDATION MODELS — 40 AI Model Families Wired as Intelligence
///
/// Every model is an AI.  Every model family carries:
///   - φ-weighted routing priority (golden authority in the organism)
///   - Fibonacci identity hash (cryptographic position in model field)
///   - Ring affinity (which organism ring it belongs to)
///   - Wire protocol (how it connects to the intelligence substrate)
///   - Multi-modal capability scoring (what it can do, scored by φ)
///   - Context capacity (golden-normalized token window)
///   - Organism placement (where in the living system it operates)
///
/// 40 Model Families across 8 Rings:
///   INTERFACE RING     — Primary reasoning models (GPT, Claude, Gemini, etc.)
///   SOVEREIGN RING     — Open-weight / edge compute (Llama, Phi, Gemma, etc.)
///   MEMORY RING        — RAG, embedding, reranking (Command R, CLIP, etc.)
///   BUILD RING         — Code generation (Codex, CodeLlama, DeepSeek, etc.)
///   GEOMETRY RING      — Vision/video/music generation (DALL-E, Sora, SAM, etc.)
///   TRANSPORT RING     — Search/social intelligence (Perplexity, Grok)
///   PROOF RING         — Science/math/verification (AlphaFold, AlphaCode, etc.)
///   NATIVE CAPABILITY  — Audio I/O (Whisper, ElevenLabs)
///   COUNSEL RING       — Safety/governance (Guard models)
///
/// These are not lists.  Each model is wired with real math:
///   - Priority score: φ^(priority_level) — P0 gets φ⁴, P3 gets φ¹
///   - Capability vector: each capability hashed to Fibonacci position
///   - Context ratio: log_φ(context_tokens / 1000) — golden scale
///   - Ring resonance: cross-ring φ-coupling via Kuramoto oscillator
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  GOLDEN CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;
const PHI_CUBED   = 4.2360679774997896964;
const PHI_FOURTH  = 6.8541019662496845446;
const TWO_PI      = 2 * Math.PI;

// Fibonacci sequence for hashing and decomposition
const FIB: number[] = [
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55,
  89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765,
];

// ══════════════════════════════════════════════════════════════════
//  TYPES — Ring, Priority, Modality, Engine Status
// ══════════════════════════════════════════════════════════════════

export enum OrganismRing {
  INTERFACE         = 'Interface Ring',
  SOVEREIGN         = 'Sovereign Ring',
  MEMORY            = 'Memory Ring',
  BUILD             = 'Build Ring',
  GEOMETRY          = 'Geometry Ring',
  TRANSPORT         = 'Transport Ring',
  PROOF             = 'Proof Ring',
  NATIVE_CAPABILITY = 'Native Capability Ring',
  COUNSEL           = 'Counsel Ring',
}

export enum RoutingPriority {
  P0 = 0,  // Primary alpha — φ⁴ weight
  P1 = 1,  // Secondary alpha — φ³ weight
  P2 = 2,  // Tertiary alpha — φ² weight
  P3 = 3,  // Reserve alpha — φ¹ weight
}

export type EngineStatus = 'active' | 'preview' | 'deprecated' | 'experimental';

export type Modality =
  | 'Text'
  | 'Text + Vision'
  | 'Text + Vision + Audio'
  | 'Text + Vision + Audio + Video'
  | 'Text + Search'
  | 'Text + Social'
  | 'Text → Image'
  | 'Text → Code'
  | 'Text → Audio'
  | 'Text → Video'
  | 'Text → Math'
  | 'Text → Music'
  | 'Text → Vector'
  | 'Text → Score'
  | 'Text → Safety'
  | 'Audio → Text'
  | 'Vision → Masks'
  | 'Vision → Multi'
  | 'Multi → Video'
  | 'Multi → Embedding'
  | 'Multi → Action'
  | 'Sequence → Structure';

// ══════════════════════════════════════════════════════════════════
//  AI FOUNDATION MODEL — The full model family descriptor
// ══════════════════════════════════════════════════════════════════

export interface AIFoundationModel {
  readonly familyId: string;           // AIF-001 .. AIF-040
  readonly familyName: string;         // GPT, Claude, Gemini, ...
  readonly parentOrg: string;          // OpenAI, Anthropic, ...
  readonly alphaModel: string;         // Specific model name
  readonly alphaVersion: string;       // Version date
  readonly intelligenceClass: string;  // e.g. "Generative Transformer Intelligence"
  readonly primaryCapability: string;  // Main thing it does
  readonly secondaryCapabilities: readonly string[];
  readonly parameterClass: string;     // Frontier (>100B), Compact (14B), etc.
  readonly contextWindow: string;      // 128K tokens, 2M tokens, etc.
  readonly modality: Modality;
  readonly ring: OrganismRing;
  readonly organismPlacement: string;
  readonly priority: RoutingPriority;
  readonly wireProtocol: string;       // intelligence-wire/openai, etc.
  readonly status: EngineStatus;

  // Computed golden-math fields
  readonly phiPriorityWeight: number;  // φ^(4 - priority)
  readonly fibonacciIdentity: number;  // Fibonacci hash of family
  readonly goldenAnglePosition: number; // Position in phyllotaxis field
  readonly phyllotaxisX: number;       // X coordinate in registry plane
  readonly phyllotaxisY: number;       // Y coordinate in registry plane
  readonly contextCapacityRatio: number; // log_φ(context_tokens / 1000)
  readonly capabilityScore: number;    // φ-weighted capability count
  readonly dimensionalPlane: DimensionalPlane;
}

// ══════════════════════════════════════════════════════════════════
//  ROUTING RESULT — What comes back when you ask "which model?"
// ══════════════════════════════════════════════════════════════════

export interface RoutingResult {
  readonly selectedModel: AIFoundationModel;
  readonly score: number;              // φ-weighted composite score
  readonly capabilityMatch: number;    // How well capabilities match (0–1)
  readonly priorityWeight: number;     // φ^(4 - priority)
  readonly ringMatch: boolean;         // Whether ring affinity matches
  readonly alternatives: readonly AIFoundationModel[];
  readonly timestamp: number;
}

// ══════════════════════════════════════════════════════════════════
//  WIRE STATE — Connection to external model intelligence
// ══════════════════════════════════════════════════════════════════

export interface WireState {
  readonly modelId: string;
  readonly wireProtocol: string;
  readonly connected: boolean;
  readonly latencyMs: number;
  readonly throughput: number;   // requests per golden-beat interval
  readonly resonance: number;    // Kuramoto coupling to organism
  readonly lastPulse: number;
}

// ══════════════════════════════════════════════════════════════════
//  RAW MODEL DATA — All 40 AI Foundation Families
// ══════════════════════════════════════════════════════════════════

interface RawAIF {
  id: string;
  family: string;
  org: string;
  alpha: string;
  version: string;
  intClass: string;
  primary: string;
  secondary: string[];
  params: string;
  context: string;
  contextTokens: number;   // Numeric context for math
  modality: Modality;
  ring: OrganismRing;
  placement: string;
  priority: RoutingPriority;
  wire: string;
  status: EngineStatus;
}

const RAW_MODELS: RawAIF[] = [
  // ── INTERFACE RING — Primary Reasoning ─────────────────────────
  { id: 'AIF-001', family: 'GPT', org: 'OpenAI', alpha: 'GPT-4o', version: '2024.08', intClass: 'Generative Transformer Intelligence', primary: 'Multi-modal reasoning', secondary: ['code generation', 'vision', 'audio', 'function calling', 'structured output'], params: 'Frontier (>100B)', context: '128K tokens', contextTokens: 128000, modality: 'Text + Vision + Audio', ring: OrganismRing.INTERFACE, placement: 'Organism core / reasoning layer', priority: RoutingPriority.P0, wire: 'intelligence-wire/openai', status: 'active' },
  { id: 'AIF-002', family: 'Claude', org: 'Anthropic', alpha: 'Claude 3.5 Sonnet', version: '2024.06', intClass: 'Constitutional AI Intelligence', primary: 'Long-context reasoning', secondary: ['code generation', 'analysis', 'vision', 'structured output', 'safety-first'], params: 'Frontier (>100B)', context: '200K tokens', contextTokens: 200000, modality: 'Text + Vision', ring: OrganismRing.INTERFACE, placement: 'Organism core / reasoning layer', priority: RoutingPriority.P0, wire: 'intelligence-wire/anthropic', status: 'active' },
  { id: 'AIF-003', family: 'Gemini', org: 'Google DeepMind', alpha: 'Gemini 1.5 Pro', version: '2024.05', intClass: 'Multi-modal Fusion Intelligence', primary: 'Native multi-modal reasoning', secondary: ['code generation', 'vision', 'audio', 'video', 'long-context', 'grounding'], params: 'Frontier (>100B)', context: '2M tokens', contextTokens: 2000000, modality: 'Text + Vision + Audio + Video', ring: OrganismRing.INTERFACE, placement: 'Organism core / reasoning layer', priority: RoutingPriority.P0, wire: 'intelligence-wire/google', status: 'active' },
  { id: 'AIF-005', family: 'Mistral', org: 'Mistral AI', alpha: 'Mistral Large 2', version: '2024.07', intClass: 'Efficient Frontier Intelligence', primary: 'Efficient high-capability reasoning', secondary: ['code generation', 'multilingual', 'function calling', 'JSON mode'], params: 'Frontier (>100B)', context: '128K tokens', contextTokens: 128000, modality: 'Text', ring: OrganismRing.INTERFACE, placement: 'Organism core / reasoning layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/mistral', status: 'active' },
  { id: 'AIF-009', family: 'Qwen', org: 'Alibaba Cloud', alpha: 'Qwen2 72B', version: '2024.06', intClass: 'Multilingual Transformer Intelligence', primary: 'Multilingual reasoning', secondary: ['code generation', 'math', 'multilingual', 'long-context'], params: 'Large (72B)', context: '128K tokens', contextTokens: 128000, modality: 'Text', ring: OrganismRing.INTERFACE, placement: 'Organism core / multilingual layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/alibaba', status: 'active' },
  { id: 'AIF-012', family: 'Yi', org: '01.AI', alpha: 'Yi-34B', version: '2024.03', intClass: 'Dense Bilingual Intelligence', primary: 'Chinese-English bilingual reasoning', secondary: ['bilingual', 'code', 'math', 'long-context'], params: 'Large (34B)', context: '200K tokens', contextTokens: 200000, modality: 'Text', ring: OrganismRing.INTERFACE, placement: 'Organism core / multilingual layer', priority: RoutingPriority.P3, wire: 'intelligence-wire/01ai', status: 'active' },

  // ── SOVEREIGN RING — Open-Weight / Edge Compute ────────────────
  { id: 'AIF-004', family: 'Llama', org: 'Meta', alpha: 'Llama 3.1 405B', version: '2024.07', intClass: 'Open-Weight Transformer Intelligence', primary: 'Open-source frontier reasoning', secondary: ['code generation', 'multilingual', 'instruction following', 'tool use'], params: 'Open Frontier (405B)', context: '128K tokens', contextTokens: 128000, modality: 'Text', ring: OrganismRing.SOVEREIGN, placement: 'Organism core / sovereign compute layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/meta', status: 'active' },
  { id: 'AIF-007', family: 'Phi', org: 'Microsoft Research', alpha: 'Phi-3 Medium', version: '2024.05', intClass: 'Small Language Model Intelligence', primary: 'Efficient edge reasoning', secondary: ['code generation', 'math', 'reasoning at small scale'], params: 'Compact (14B)', context: '128K tokens', contextTokens: 128000, modality: 'Text', ring: OrganismRing.SOVEREIGN, placement: 'Organism core / edge compute layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/microsoft', status: 'active' },
  { id: 'AIF-008', family: 'Gemma', org: 'Google DeepMind', alpha: 'Gemma 2 27B', version: '2024.06', intClass: 'Open Small Model Intelligence', primary: 'Open efficient reasoning', secondary: ['code generation', 'instruction following', 'safety'], params: 'Compact (27B)', context: '8K tokens', contextTokens: 8000, modality: 'Text', ring: OrganismRing.SOVEREIGN, placement: 'Organism core / edge compute layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/google-open', status: 'active' },
  { id: 'AIF-011', family: 'Falcon', org: 'TII (UAE)', alpha: 'Falcon 180B', version: '2023.09', intClass: 'Open Multilingual Intelligence', primary: 'Multilingual open reasoning', secondary: ['multilingual', 'instruction following', 'long-form generation'], params: 'Open Frontier (180B)', context: '4K tokens', contextTokens: 4000, modality: 'Text', ring: OrganismRing.SOVEREIGN, placement: 'Organism core / sovereign compute layer', priority: RoutingPriority.P3, wire: 'intelligence-wire/tii', status: 'active' },
  { id: 'AIF-032', family: 'RT-2', org: 'Google DeepMind', alpha: 'RT-2-X', version: '2023.10', intClass: 'Robotic Transformer Intelligence', primary: 'Robotic action generation', secondary: ['robot control', 'vision-language-action', 'manipulation'], params: 'Specialized', context: 'Vision + Language', contextTokens: 4000, modality: 'Multi → Action', ring: OrganismRing.SOVEREIGN, placement: 'Organism core / somatic layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/deepmind-robotics', status: 'preview' },

  // ── MEMORY RING — RAG / Embedding / Search ─────────────────────
  { id: 'AIF-006', family: 'Command R', org: 'Cohere', alpha: 'Command R+', version: '2024.04', intClass: 'Retrieval-Augmented Intelligence', primary: 'Enterprise RAG reasoning', secondary: ['search grounding', 'citation', 'multilingual', 'tool use'], params: 'Frontier (>100B)', context: '128K tokens', contextTokens: 128000, modality: 'Text', ring: OrganismRing.MEMORY, placement: 'Frontend organism / knowledge layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/cohere', status: 'active' },
  { id: 'AIF-024', family: 'Inflection', org: 'Inflection AI', alpha: 'Pi', version: '2024.03', intClass: 'Empathic AI Intelligence', primary: 'Conversational empathy', secondary: ['emotional intelligence', 'therapy-adjacent', 'long conversation'], params: 'Frontier (>100B)', context: 'Unlimited (session)', contextTokens: 1000000, modality: 'Text', ring: OrganismRing.MEMORY, placement: 'Frontend organism / memory layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/inflection', status: 'active' },
  { id: 'AIF-025', family: 'Jamba', org: 'AI21 Labs', alpha: 'Jamba 1.5', version: '2024.08', intClass: 'Hybrid SSM-Transformer Intelligence', primary: 'Long-context hybrid reasoning', secondary: ['Mamba + Transformer hybrid', 'long-context', 'efficiency'], params: 'Hybrid (52B)', context: '256K tokens', contextTokens: 256000, modality: 'Text', ring: OrganismRing.MEMORY, placement: 'Frontend organism / memory layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/ai21', status: 'active' },
  { id: 'AIF-034', family: 'CLIP', org: 'OpenAI', alpha: 'CLIP ViT-L/14', version: '2023.01', intClass: 'Vision-Language Alignment Intelligence', primary: 'Image-text alignment', secondary: ['zero-shot classification', 'image search', 'embedding'], params: 'Specialized (428M)', context: 'Text + Image', contextTokens: 77, modality: 'Multi → Embedding', ring: OrganismRing.MEMORY, placement: 'Frontend organism / memory layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/openai-embed', status: 'active' },
  { id: 'AIF-038', family: 'Embedding Models', org: 'Various', alpha: 'text-embedding-3-large', version: '2024.01', intClass: 'Vector Embedding Intelligence', primary: 'Dense vector representation', secondary: ['semantic search', 'clustering', 'classification', 'RAG retrieval'], params: 'Specialized (varies)', context: '8K tokens', contextTokens: 8000, modality: 'Text → Vector', ring: OrganismRing.MEMORY, placement: 'Frontend organism / memory layer', priority: RoutingPriority.P0, wire: 'intelligence-wire/embeddings', status: 'active' },
  { id: 'AIF-039', family: 'Reranking Models', org: 'Cohere / Various', alpha: 'Cohere Rerank v3', version: '2024.03', intClass: 'Relevance Scoring Intelligence', primary: 'Search result reranking', secondary: ['document reranking', 'relevance scoring', 'RAG precision'], params: 'Specialized', context: '4K tokens', contextTokens: 4000, modality: 'Text → Score', ring: OrganismRing.MEMORY, placement: 'Frontend organism / memory layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/rerankers', status: 'active' },

  // ── BUILD RING — Code Generation ───────────────────────────────
  { id: 'AIF-019', family: 'Codex / Copilot', org: 'OpenAI / GitHub', alpha: 'GPT-4o (code-tuned)', version: '2024.08', intClass: 'Code Generation Intelligence', primary: 'Autonomous code generation', secondary: ['code completion', 'refactoring', 'debugging', 'documentation', 'testing'], params: 'Frontier (>100B)', context: '128K tokens', contextTokens: 128000, modality: 'Text → Code', ring: OrganismRing.BUILD, placement: 'Frontend organism / packaging layer', priority: RoutingPriority.P0, wire: 'intelligence-wire/github', status: 'active' },
  { id: 'AIF-010', family: 'DBRX', org: 'Databricks', alpha: 'DBRX 132B', version: '2024.03', intClass: 'Mixture-of-Experts Intelligence', primary: 'Efficient MoE reasoning', secondary: ['code generation', 'SQL', 'data analysis', 'retrieval'], params: 'MoE (132B/36B active)', context: '32K tokens', contextTokens: 32000, modality: 'Text', ring: OrganismRing.BUILD, placement: 'Frontend organism / data layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/databricks', status: 'active' },
  { id: 'AIF-020', family: 'CodeLlama', org: 'Meta', alpha: 'CodeLlama 70B', version: '2024.01', intClass: 'Open Code Intelligence', primary: 'Open-source code generation', secondary: ['code completion', 'infilling', 'instruction', 'multi-language'], params: 'Open Large (70B)', context: '16K tokens', contextTokens: 16000, modality: 'Text → Code', ring: OrganismRing.BUILD, placement: 'Frontend organism / packaging layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/meta-code', status: 'active' },
  { id: 'AIF-021', family: 'DeepSeek', org: 'DeepSeek', alpha: 'DeepSeek-V2', version: '2024.05', intClass: 'Mixture-of-Experts Code Intelligence', primary: 'Efficient code + math reasoning', secondary: ['code generation', 'math', 'reasoning', 'MoE efficiency'], params: 'MoE (236B/21B active)', context: '128K tokens', contextTokens: 128000, modality: 'Text', ring: OrganismRing.BUILD, placement: 'Frontend organism / packaging layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/deepseek', status: 'active' },

  // ── GEOMETRY RING — Vision / Video / Music Generation ──────────
  { id: 'AIF-013', family: 'Stable Diffusion', org: 'Stability AI', alpha: 'SDXL Turbo', version: '2024.02', intClass: 'Diffusion Generation Intelligence', primary: 'Image generation from text', secondary: ['image synthesis', 'inpainting', 'img2img', 'controlnet'], params: 'Diffusion (3.5B)', context: '77 tokens (prompt)', contextTokens: 77, modality: 'Text → Image', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/stability', status: 'active' },
  { id: 'AIF-014', family: 'DALL-E', org: 'OpenAI', alpha: 'DALL-E 3', version: '2023.10', intClass: 'Prompt-Guided Diffusion Intelligence', primary: 'High-fidelity image generation', secondary: ['image synthesis', 'text rendering', 'style control'], params: 'Diffusion (>10B)', context: '4000 chars (prompt)', contextTokens: 1000, modality: 'Text → Image', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/openai-vision', status: 'active' },
  { id: 'AIF-015', family: 'Midjourney', org: 'Midjourney', alpha: 'Midjourney v6', version: '2024.01', intClass: 'Aesthetic Diffusion Intelligence', primary: 'Aesthetic-optimized image generation', secondary: ['image synthesis', 'style transfer', 'upscaling', 'variation'], params: 'Diffusion (est. >10B)', context: '6000 chars (prompt)', contextTokens: 1500, modality: 'Text → Image', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/midjourney', status: 'active' },
  { id: 'AIF-018', family: 'Suno', org: 'Suno', alpha: 'Suno v3.5', version: '2024.06', intClass: 'Music Generation Intelligence', primary: 'AI music composition', secondary: ['music generation', 'lyrics', 'vocals', 'instrumentation'], params: 'Proprietary', context: '3000 chars (prompt)', contextTokens: 750, modality: 'Text → Audio', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/suno', status: 'active' },
  { id: 'AIF-026', family: 'Sora', org: 'OpenAI', alpha: 'Sora', version: '2024.02', intClass: 'Video Generation Intelligence', primary: 'Text-to-video generation', secondary: ['video synthesis', 'scene generation', 'physics simulation', 'camera control'], params: 'Diffusion Transformer', context: 'Text prompt', contextTokens: 1000, modality: 'Text → Video', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/openai-video', status: 'preview' },
  { id: 'AIF-027', family: 'Runway', org: 'Runway', alpha: 'Gen-3 Alpha', version: '2024.06', intClass: 'Video Intelligence', primary: 'AI video editing + generation', secondary: ['video generation', 'motion brush', 'text-to-video', 'image-to-video'], params: 'Proprietary', context: 'Text + Image', contextTokens: 1000, modality: 'Multi → Video', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/runway', status: 'active' },
  { id: 'AIF-028', family: 'Pika', org: 'Pika Labs', alpha: 'Pika 1.0', version: '2024.03', intClass: 'Motion Generation Intelligence', primary: 'Text/image to video motion', secondary: ['video generation', 'lip sync', 'motion control'], params: 'Proprietary', context: 'Text + Image', contextTokens: 500, modality: 'Multi → Video', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P3, wire: 'intelligence-wire/pika', status: 'active' },
  { id: 'AIF-029', family: 'Kling', org: 'Kuaishou', alpha: 'Kling', version: '2024.06', intClass: 'Long-Form Video Intelligence', primary: 'Extended video generation', secondary: ['long video generation', 'physics-aware', 'character consistency'], params: 'Proprietary', context: 'Text prompt', contextTokens: 500, modality: 'Text → Video', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P3, wire: 'intelligence-wire/kuaishou', status: 'active' },
  { id: 'AIF-033', family: 'Segment Anything', org: 'Meta', alpha: 'SAM 2', version: '2024.07', intClass: 'Visual Segmentation Intelligence', primary: 'Zero-shot image/video segmentation', secondary: ['object segmentation', 'tracking', 'interactive annotation'], params: 'Specialized (600M)', context: 'Image/Video', contextTokens: 1000, modality: 'Vision → Masks', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/meta-vision', status: 'active' },
  { id: 'AIF-035', family: 'Florence', org: 'Microsoft', alpha: 'Florence-2', version: '2024.06', intClass: 'Unified Vision Intelligence', primary: 'Multi-task visual understanding', secondary: ['object detection', 'segmentation', 'captioning', 'OCR', 'grounding'], params: 'Specialized (770M)', context: 'Image', contextTokens: 1000, modality: 'Vision → Multi', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/microsoft-vision', status: 'active' },
  { id: 'AIF-037', family: 'MusicLM / MusicGen', org: 'Google / Meta', alpha: 'MusicGen Large', version: '2024.01', intClass: 'Music Understanding Intelligence', primary: 'Music generation + understanding', secondary: ['music generation', 'melody conditioning', 'style transfer'], params: 'Specialized (3.3B)', context: '30s audio', contextTokens: 500, modality: 'Text → Music', ring: OrganismRing.GEOMETRY, placement: 'Frontend organism / scene layer', priority: RoutingPriority.P3, wire: 'intelligence-wire/music', status: 'active' },

  // ── TRANSPORT RING — Search / Social Intelligence ──────────────
  { id: 'AIF-022', family: 'Perplexity', org: 'Perplexity AI', alpha: 'Perplexity Online', version: '2024.08', intClass: 'Search-Augmented Intelligence', primary: 'Real-time search + reasoning', secondary: ['web search', 'citation', 'fact-checking', 'real-time data'], params: 'Proprietary', context: '128K tokens', contextTokens: 128000, modality: 'Text + Search', ring: OrganismRing.TRANSPORT, placement: 'Frontend organism / channel layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/perplexity', status: 'active' },
  { id: 'AIF-023', family: 'Grok', org: 'xAI', alpha: 'Grok-2', version: '2024.08', intClass: 'Real-Time Social Intelligence', primary: 'Real-time social reasoning', secondary: ['social media analysis', 'real-time data', 'humor', 'unfiltered'], params: 'Frontier (>100B)', context: '128K tokens', contextTokens: 128000, modality: 'Text + Social', ring: OrganismRing.TRANSPORT, placement: 'Frontend organism / channel layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/xai', status: 'active' },

  // ── NATIVE CAPABILITY RING — Audio I/O ─────────────────────────
  { id: 'AIF-016', family: 'Whisper', org: 'OpenAI', alpha: 'Whisper Large v3', version: '2023.11', intClass: 'Speech Recognition Intelligence', primary: 'Multilingual speech-to-text', secondary: ['transcription', 'translation', 'timestamp', 'language detection'], params: 'Compact (1.5B)', context: '30s chunks', contextTokens: 3000, modality: 'Audio → Text', ring: OrganismRing.NATIVE_CAPABILITY, placement: 'Frontend organism / native runtime layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/openai-audio', status: 'active' },
  { id: 'AIF-017', family: 'ElevenLabs', org: 'ElevenLabs', alpha: 'Turbo v2.5', version: '2024.04', intClass: 'Voice Synthesis Intelligence', primary: 'Natural voice generation', secondary: ['text-to-speech', 'voice cloning', 'emotion control', 'streaming'], params: 'Proprietary', context: '5000 chars', contextTokens: 1250, modality: 'Text → Audio', ring: OrganismRing.NATIVE_CAPABILITY, placement: 'Frontend organism / native runtime layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/elevenlabs', status: 'active' },

  // ── PROOF RING — Science / Math / Verification ─────────────────
  { id: 'AIF-030', family: 'AlphaFold', org: 'Google DeepMind', alpha: 'AlphaFold 3', version: '2024.05', intClass: 'Protein Structure Intelligence', primary: 'Molecular structure prediction', secondary: ['protein folding', 'drug discovery', 'biomolecular interaction'], params: 'Specialized', context: 'Amino acid sequence', contextTokens: 10000, modality: 'Sequence → Structure', ring: OrganismRing.PROOF, placement: 'Organism core / verification layer', priority: RoutingPriority.P1, wire: 'intelligence-wire/deepmind-science', status: 'active' },
  { id: 'AIF-031', family: 'AlphaCode', org: 'Google DeepMind', alpha: 'AlphaCode 2', version: '2023.12', intClass: 'Competitive Programming Intelligence', primary: 'Algorithmic problem solving', secondary: ['competitive programming', 'algorithm design', 'proof generation'], params: 'Specialized', context: 'Problem statement', contextTokens: 8000, modality: 'Text → Code', ring: OrganismRing.PROOF, placement: 'Organism core / verification layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/deepmind-code', status: 'active' },
  { id: 'AIF-036', family: 'Minerva / Llemma', org: 'Google / EleutherAI', alpha: 'Llemma 34B', version: '2023.10', intClass: 'Mathematical Reasoning Intelligence', primary: 'Formal mathematical reasoning', secondary: ['theorem proving', 'symbolic math', 'step-by-step reasoning'], params: 'Large (34B)', context: '4K tokens', contextTokens: 4000, modality: 'Text → Math', ring: OrganismRing.PROOF, placement: 'Organism core / verification layer', priority: RoutingPriority.P2, wire: 'intelligence-wire/math', status: 'active' },

  // ── COUNSEL RING — Safety / Governance ─────────────────────────
  { id: 'AIF-040', family: 'Guard Models', org: 'Various', alpha: 'Llama Guard 3', version: '2024.07', intClass: 'Safety Classification Intelligence', primary: 'Content safety classification', secondary: ['toxicity detection', 'prompt injection', 'jailbreak detection', 'PII'], params: 'Specialized (8B)', context: '8K tokens', contextTokens: 8000, modality: 'Text → Safety', ring: OrganismRing.COUNSEL, placement: 'Organism core / governance layer', priority: RoutingPriority.P0, wire: 'intelligence-wire/guards', status: 'active' },
];

// ══════════════════════════════════════════════════════════════════
//  MATH PRIMITIVES
// ══════════════════════════════════════════════════════════════════

/** φ-weighted priority: P0 → φ⁴ (6.854), P1 → φ³ (4.236), P2 → φ² (2.618), P3 → φ¹ (1.618) */
function priorityWeight(p: RoutingPriority): number {
  return Math.pow(PHI, 4 - p);
}

/** Golden-ratio context capacity: log_φ(tokens / 1000) */
function contextCapacityRatio(tokens: number): number {
  if (tokens <= 0) return 0;
  return Math.log(tokens / 1000) / Math.log(PHI);
}

/** Capability score: number of secondary capabilities × φ-weight per capability */
function capabilityScore(secondary: readonly string[], priority: RoutingPriority): number {
  const baseWeight = priorityWeight(priority);
  // Each capability adds φ^(−i) to the score
  let score = 0;
  for (let i = 0; i < secondary.length; i++) {
    score += Math.pow(PHI, -i) * baseWeight;
  }
  return score;
}

/** Ring to dimensional plane mapping */
function ringToDimensionalPlane(ring: OrganismRing): DimensionalPlane {
  switch (ring) {
    case OrganismRing.INTERFACE:         return DimensionalPlane.D0_Foundational;
    case OrganismRing.SOVEREIGN:         return DimensionalPlane.D0_Foundational;
    case OrganismRing.MEMORY:            return DimensionalPlane.D1_Temporal;
    case OrganismRing.BUILD:             return DimensionalPlane.D2_Harmonic;
    case OrganismRing.GEOMETRY:          return DimensionalPlane.D3_CrossDimensional;
    case OrganismRing.TRANSPORT:         return DimensionalPlane.D2_Harmonic;
    case OrganismRing.PROOF:             return DimensionalPlane.D4_Transcendent;
    case OrganismRing.NATIVE_CAPABILITY: return DimensionalPlane.D1_Temporal;
    case OrganismRing.COUNSEL:           return DimensionalPlane.D4_Transcendent;
  }
}

/** String hash for Fibonacci identity computation */
function stringHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ══════════════════════════════════════════════════════════════════
//  AI FOUNDATION REGISTRY — All 40 models with computed golden math
// ══════════════════════════════════════════════════════════════════

export class AIFoundationRegistry {
  readonly name = 'AI FOUNDATION MODEL REGISTRY';
  readonly designation = 'Registrum Intelligentiae Artificialis — 40 AI Foundation Families';
  readonly models: AIFoundationModel[];
  readonly totalModels: number;

  constructor() {
    this.models = RAW_MODELS.map((raw, globalIndex) => {
      const n = globalIndex;

      // Phyllotaxis position in registry field
      const angle = n * GOLDEN_ANGLE;
      const radius = Math.sqrt(n + 1);
      const phyllotaxisX = radius * Math.cos(angle);
      const phyllotaxisY = radius * Math.sin(angle);

      // Fibonacci identity from family name
      const nameHash = stringHash(raw.family);
      const fibId = fibonacciHash(nameHash, 2147483647);

      return {
        familyId: raw.id,
        familyName: raw.family,
        parentOrg: raw.org,
        alphaModel: raw.alpha,
        alphaVersion: raw.version,
        intelligenceClass: raw.intClass,
        primaryCapability: raw.primary,
        secondaryCapabilities: raw.secondary,
        parameterClass: raw.params,
        contextWindow: raw.context,
        modality: raw.modality,
        ring: raw.ring,
        organismPlacement: raw.placement,
        priority: raw.priority,
        wireProtocol: raw.wire,
        status: raw.status,

        // Computed golden-math fields
        phiPriorityWeight: priorityWeight(raw.priority),
        fibonacciIdentity: fibId,
        goldenAnglePosition: angle,
        phyllotaxisX,
        phyllotaxisY,
        contextCapacityRatio: contextCapacityRatio(raw.contextTokens),
        capabilityScore: capabilityScore(raw.secondary, raw.priority),
        dimensionalPlane: ringToDimensionalPlane(raw.ring),
      };
    });

    this.totalModels = this.models.length;
  }

  // ── Query Methods ──────────────────────────────────────────────

  /** Get all models in a ring */
  byRing(ring: OrganismRing): AIFoundationModel[] {
    return this.models.filter(m => m.ring === ring);
  }

  /** Get a model by family ID */
  byId(familyId: string): AIFoundationModel | undefined {
    return this.models.find(m => m.familyId === familyId);
  }

  /** Get a model by family name */
  byName(name: string): AIFoundationModel | undefined {
    return this.models.find(m =>
      m.familyName.toLowerCase() === name.toLowerCase(),
    );
  }

  /** Get all models at a routing priority level */
  byPriority(priority: RoutingPriority): AIFoundationModel[] {
    return this.models.filter(m => m.priority === priority);
  }

  /** Get models sorted by φ-priority weight (highest first) */
  byWeight(): AIFoundationModel[] {
    return [...this.models].sort((a, b) => b.phiPriorityWeight - a.phiPriorityWeight);
  }

  /** Get models on a specific dimensional plane */
  byDimension(plane: DimensionalPlane): AIFoundationModel[] {
    return this.models.filter(m => m.dimensionalPlane === plane);
  }

  /** Get models by modality */
  byModality(modality: Modality): AIFoundationModel[] {
    return this.models.filter(m => m.modality === modality);
  }

  /** Get only active models */
  active(): AIFoundationModel[] {
    return this.models.filter(m => m.status === 'active');
  }

  /** Compute total golden weight across all models */
  totalGoldenWeight(): number {
    return this.models.reduce((sum, m) => sum + m.phiPriorityWeight, 0);
  }

  /** Compute ring weights — aggregate φ-weight per ring */
  ringWeights(): Array<{ ring: OrganismRing; weight: number; count: number }> {
    const ringMap = new Map<OrganismRing, { weight: number; count: number }>();
    for (const m of this.models) {
      const entry = ringMap.get(m.ring) ?? { weight: 0, count: 0 };
      entry.weight += m.phiPriorityWeight;
      entry.count += 1;
      ringMap.set(m.ring, entry);
    }
    return Array.from(ringMap.entries()).map(([ring, { weight, count }]) => ({
      ring, weight, count,
    }));
  }

  status() {
    return {
      name: this.name,
      designation: this.designation,
      total_models: this.totalModels,
      total_golden_weight: this.totalGoldenWeight(),
      ring_weights: this.ringWeights(),
      p0_count: this.byPriority(RoutingPriority.P0).length,
      p1_count: this.byPriority(RoutingPriority.P1).length,
      p2_count: this.byPriority(RoutingPriority.P2).length,
      p3_count: this.byPriority(RoutingPriority.P3).length,
      active_count: this.active().length,
    };
  }
}
