/**
 * @nova-protocol/nova-engine-registry
 *
 * The complete 23-engine NOVA fleet.
 *
 * Each engine is a sovereign AI unit — fully dedicated to its cognitive
 * domain with its own context window, modality, φ-weight, and wire endpoint.
 * No vendor lock-in. Zero rented intelligence.
 *
 * Reference: NOVA-RP-003 — Casa de Medina
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type EngineModality = 'text' | 'text+math' | 'text+db' | 'multi' | 'text+audio'
  | 'text+image' | 'code' | 'data' | 'audio' | 'image' | 'spatial' | 'video';

export type EngineTier = 1 | 2 | 3;

export interface NovaEngine {
  /** Engine identifier e.g. "NOV-001" */
  id: string;
  /** Common name e.g. "Cognos" */
  name: string;
  /** Cognitive domain */
  domain: string;
  /** Context window in tokens */
  contextWindow: number;
  /** Input/output modality */
  modality: EngineModality;
  /** Wire endpoint slug */
  wireEndpoint: string;
  /** Activation tier: 1 = always active, 2 = on-demand, 3 = specialist */
  tier: EngineTier;
  /** φ-routing weight (0–1) */
  phiWeight: number;
  /** Intent keywords that route to this engine */
  intentKeywords: string[];
  /** Latency p50 in milliseconds */
  latencyP50Ms: number;
  /** Throughput in φ-segmented tokens/sec */
  tokensPerSec: number;
}

// ─── Registry ────────────────────────────────────────────────────────────────

export const ENGINES: NovaEngine[] = [
  {
    id: 'NOV-001', name: 'Cognos', domain: 'General reasoning',
    contextWindow: 128_000, modality: 'text', wireEndpoint: 'nova-wire/cognos',
    tier: 1, phiWeight: 1.000, latencyP50Ms: 45, tokensPerSec: 4_200,
    intentKeywords: ['reason', 'think', 'explain', 'why', 'how', 'what'],
  },
  {
    id: 'NOV-002', name: 'Logos', domain: 'Logic & mathematics',
    contextWindow: 256_000, modality: 'text+math', wireEndpoint: 'nova-wire/logos',
    tier: 1, phiWeight: 0.980, latencyP50Ms: 52, tokensPerSec: 3_800,
    intentKeywords: ['proof', 'math', 'equation', 'logic', 'calculate', 'solve', 'theorem'],
  },
  {
    id: 'NOV-003', name: 'Profundis', domain: 'Deep analysis & research',
    contextWindow: 2_000_000, modality: 'text', wireEndpoint: 'nova-wire/profundis',
    tier: 1, phiWeight: 0.960, latencyP50Ms: 180, tokensPerSec: 1_200,
    intentKeywords: ['research', 'analyse', 'deep', 'comprehensive', 'survey', 'review'],
  },
  {
    id: 'NOV-004', name: 'Stratos', domain: 'Strategic planning',
    contextWindow: 32_000, modality: 'text', wireEndpoint: 'nova-wire/stratos',
    tier: 2, phiWeight: 0.850, latencyP50Ms: 38, tokensPerSec: 5_100,
    intentKeywords: ['strategy', 'plan', 'roadmap', 'goal', 'objective', 'mission'],
  },
  {
    id: 'NOV-005', name: 'Nexus', domain: 'Multi-domain synthesis',
    contextWindow: 64_000, modality: 'multi', wireEndpoint: 'nova-wire/nexus',
    tier: 2, phiWeight: 0.830, latencyP50Ms: 60, tokensPerSec: 3_400,
    intentKeywords: ['combine', 'synthesise', 'integrate', 'cross-domain', 'connect'],
  },
  {
    id: 'NOV-006', name: 'Memoria', domain: 'Long-term memory retrieval',
    contextWindow: 512_000, modality: 'text+db', wireEndpoint: 'nova-wire/memoria',
    tier: 2, phiWeight: 0.760, latencyP50Ms: 95, tokensPerSec: 2_600,
    intentKeywords: ['remember', 'recall', 'history', 'previous', 'memory', 'store'],
  },
  {
    id: 'NOV-007', name: 'Ethica', domain: 'Ethical reasoning & alignment',
    contextWindow: 32_000, modality: 'text', wireEndpoint: 'nova-wire/ethica',
    tier: 2, phiWeight: 0.740, latencyP50Ms: 40, tokensPerSec: 4_800,
    intentKeywords: ['ethical', 'moral', 'right', 'wrong', 'bias', 'fair', 'aligned'],
  },
  {
    id: 'NOV-008', name: 'Creativis', domain: 'Creative writing & ideation',
    contextWindow: 128_000, modality: 'text', wireEndpoint: 'nova-wire/creativis',
    tier: 2, phiWeight: 0.720, latencyP50Ms: 55, tokensPerSec: 3_900,
    intentKeywords: ['write', 'create', 'story', 'poem', 'idea', 'imagine', 'creative'],
  },
  {
    id: 'NOV-009', name: 'Codex', domain: 'Code generation & analysis',
    contextWindow: 128_000, modality: 'code', wireEndpoint: 'nova-wire/codex',
    tier: 2, phiWeight: 0.900, latencyP50Ms: 48, tokensPerSec: 4_500,
    intentKeywords: ['code', 'function', 'debug', 'implement', 'class', 'algorithm', 'program'],
  },
  {
    id: 'NOV-010', name: 'Lexicon', domain: 'Language understanding (NLU)',
    contextWindow: 64_000, modality: 'text', wireEndpoint: 'nova-wire/lexicon',
    tier: 2, phiWeight: 0.680, latencyP50Ms: 35, tokensPerSec: 6_200,
    intentKeywords: ['language', 'grammar', 'meaning', 'parse', 'understand', 'intent'],
  },
  {
    id: 'NOV-011', name: 'Praxis', domain: 'Task execution & automation',
    contextWindow: 32_000, modality: 'multi', wireEndpoint: 'nova-wire/praxis',
    tier: 2, phiWeight: 0.860, latencyP50Ms: 42, tokensPerSec: 4_100,
    intentKeywords: ['do', 'execute', 'automate', 'run', 'task', 'action', 'perform'],
  },
  {
    id: 'NOV-012', name: 'Sensus', domain: 'Sentiment & emotion analysis',
    contextWindow: 32_000, modality: 'text+audio', wireEndpoint: 'nova-wire/sensus',
    tier: 3, phiWeight: 0.580, latencyP50Ms: 28, tokensPerSec: 7_800,
    intentKeywords: ['sentiment', 'emotion', 'feel', 'mood', 'tone', 'positive', 'negative'],
  },
  {
    id: 'NOV-013', name: 'Aegis', domain: 'Security & threat analysis',
    contextWindow: 64_000, modality: 'multi', wireEndpoint: 'nova-wire/aegis',
    tier: 2, phiWeight: 0.920, latencyP50Ms: 65, tokensPerSec: 3_100,
    intentKeywords: ['security', 'threat', 'vulnerability', 'attack', 'protect', 'defend'],
  },
  {
    id: 'NOV-014', name: 'Lingua', domain: 'Translation & localisation',
    contextWindow: 64_000, modality: 'text', wireEndpoint: 'nova-wire/lingua',
    tier: 3, phiWeight: 0.620, latencyP50Ms: 44, tokensPerSec: 4_700,
    intentKeywords: ['translate', 'language', 'localise', 'french', 'spanish', 'chinese'],
  },
  {
    id: 'NOV-015', name: 'Ratio', domain: 'Data analysis & statistics',
    contextWindow: 128_000, modality: 'data', wireEndpoint: 'nova-wire/ratio',
    tier: 3, phiWeight: 0.780, latencyP50Ms: 72, tokensPerSec: 3_300,
    intentKeywords: ['data', 'statistics', 'average', 'distribution', 'correlation', 'analyse'],
  },
  {
    id: 'NOV-016', name: 'Medica', domain: 'Medical knowledge reasoning',
    contextWindow: 128_000, modality: 'text+image', wireEndpoint: 'nova-wire/medica',
    tier: 3, phiWeight: 0.640, latencyP50Ms: 88, tokensPerSec: 2_800,
    intentKeywords: ['medical', 'diagnosis', 'symptom', 'treatment', 'disease', 'drug'],
  },
  {
    id: 'NOV-017', name: 'Juridica', domain: 'Legal reasoning & compliance',
    contextWindow: 256_000, modality: 'text', wireEndpoint: 'nova-wire/juridica',
    tier: 3, phiWeight: 0.660, latencyP50Ms: 96, tokensPerSec: 2_500,
    intentKeywords: ['legal', 'law', 'contract', 'compliance', 'regulation', 'clause'],
  },
  {
    id: 'NOV-018', name: 'Pecunia', domain: 'Financial analysis & modelling',
    contextWindow: 128_000, modality: 'data', wireEndpoint: 'nova-wire/pecunia',
    tier: 3, phiWeight: 0.700, latencyP50Ms: 78, tokensPerSec: 3_000,
    intentKeywords: ['finance', 'investment', 'portfolio', 'revenue', 'valuation', 'irr'],
  },
  {
    id: 'NOV-019', name: 'Architecta', domain: 'System design & architecture',
    contextWindow: 64_000, modality: 'multi', wireEndpoint: 'nova-wire/architecta',
    tier: 3, phiWeight: 0.940, latencyP50Ms: 58, tokensPerSec: 3_700,
    intentKeywords: ['architecture', 'design', 'system', 'pattern', 'structure', 'diagram'],
  },
  {
    id: 'NOV-020', name: 'Harmonia', domain: 'Music & audio processing',
    contextWindow: 32_000, modality: 'audio', wireEndpoint: 'nova-wire/harmonia',
    tier: 3, phiWeight: 0.540, latencyP50Ms: 120, tokensPerSec: 1_800,
    intentKeywords: ['music', 'audio', 'sound', 'melody', 'rhythm', 'compose'],
  },
  {
    id: 'NOV-021', name: 'Imago', domain: 'Image understanding & generation',
    contextWindow: 32_000, modality: 'image', wireEndpoint: 'nova-wire/imago',
    tier: 3, phiWeight: 0.560, latencyP50Ms: 140, tokensPerSec: 1_500,
    intentKeywords: ['image', 'picture', 'visual', 'photo', 'generate', 'describe'],
  },
  {
    id: 'NOV-022', name: 'Kinesis', domain: 'Robotics & motion planning',
    contextWindow: 32_000, modality: 'spatial', wireEndpoint: 'nova-wire/kinesis',
    tier: 3, phiWeight: 0.500, latencyP50Ms: 160, tokensPerSec: 1_200,
    intentKeywords: ['robot', 'motion', 'path', 'sensor', 'actuator', 'spatial'],
  },
  {
    id: 'NOV-023', name: 'Visio', domain: 'Vision & video analysis',
    contextWindow: 64_000, modality: 'video', wireEndpoint: 'nova-wire/visio',
    tier: 3, phiWeight: 0.520, latencyP50Ms: 200, tokensPerSec: 900,
    intentKeywords: ['video', 'vision', 'frame', 'detect', 'track', 'watch'],
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/** Map from engine ID to NovaEngine */
export const ENGINES_BY_ID: Readonly<Record<string, NovaEngine>> =
  Object.fromEntries(ENGINES.map((e) => [e.id, e]));

/** Map from wire endpoint slug to NovaEngine */
export const ENGINES_BY_ENDPOINT: Readonly<Record<string, NovaEngine>> =
  Object.fromEntries(ENGINES.map((e) => [e.wireEndpoint, e]));

/**
 * Return engines for a given tier.
 */
export function enginesByTier(tier: EngineTier): NovaEngine[] {
  return ENGINES.filter((e) => e.tier === tier);
}

/**
 * φ-routing: given a plain-language intent string, return the best-matching
 * engine sorted by affinity score (descending).
 *
 * Affinity = (keyword matches × phiWeight) normalised to [0, 1].
 */
export function routeIntent(intent: string): NovaEngine[] {
  const words = intent.toLowerCase().split(/\W+/).filter(Boolean);
  const scored = ENGINES.map((engine) => {
    const matches = engine.intentKeywords.filter((kw) =>
      words.some((w) => w.includes(kw) || kw.includes(w)),
    ).length;
    const score = matches > 0 ? matches * engine.phiWeight : 0;
    return { engine, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.engine);
}

/**
 * Returns the primary engine for an intent (highest affinity score).
 * Falls back to NOV-001 Cognos if no keyword matches.
 */
export function primaryEngine(intent: string): NovaEngine {
  const results = routeIntent(intent);
  return results[0] ?? ENGINES_BY_ID['NOV-001'];
}
