/**
 * @nova-protocol/fracture-100
 *
 * Sovereign classification of 100 technology domains.
 *
 * Every fracture in the modern stack gets a Latin designation, a φ-weight,
 * a golden-angle position on the phyllotaxis spiral, a Fibonacci identity,
 * and a NOVA sovereign alternative.
 *
 * Reference: NOVA-RP-005 — Casa de Medina
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type FractureCategory =
  | 'Rendering'
  | 'State'
  | 'Build'
  | 'Style'
  | 'Language'
  | 'Data'
  | 'Network'
  | 'Security'
  | 'Testing'
  | 'DevOps';

export interface Fracture {
  /** Sequential index 001–100 */
  index: number;
  /** Common technology name */
  technology: string;
  /** Latin designation e.g. "REN-Renderius" */
  latinDesignation: string;
  /** Technology category */
  category: FractureCategory;
  /** φ-weight = (index × φ) mod 10.0 */
  phiWeight: number;
  /** Golden-angle position in degrees = index × 137.50776° */
  goldenAngleDeg: number;
  /** Content-addressed Fibonacci ID */
  fibId: number;
  /** NOVA sovereign alternative description */
  novaAlternative: string;
}

// ─── Category Metadata ───────────────────────────────────────────────────────

export const CATEGORIES: Record<FractureCategory, { prefix: string; range: [number, number]; novaAlternative: string }> = {
  Rendering:  { prefix: 'REN', range: [1, 10],   novaAlternative: 'Layer 4 UI — native rendering engine built on the φ-Segmentation substrate. No virtual DOM, no diffing algorithm, no component lifecycle hooks.' },
  State:      { prefix: 'STA', range: [11, 20],  novaAlternative: 'Gold canister (Au-79) immutable state + Silver canister (Ag-47) reactive conductivity. State is an elemental property of the intelligence substrate.' },
  Build:      { prefix: 'BLD', range: [21, 30],  novaAlternative: 'scripts/nova build — the sovereign build CLI that compiles Motoko to WASM using moc directly. No bundler configuration, no plugin chains.' },
  Style:      { prefix: 'STY', range: [31, 40],  novaAlternative: 'Crimson canister aesthetic layer — style derived from wavelength properties (620–750nm) of the intelligence itself.' },
  Language:   { prefix: 'LNG', range: [41, 50],  novaAlternative: 'Motoko (LNG-050) — compiles to WASM, runs on the Internet Computer, native actor-model concurrency. The sovereign choice.' },
  Data:       { prefix: 'DAT', range: [51, 60],  novaAlternative: 'nova-wire protocol — all data flows through Fibonacci-attested wire messages. Data IS the wire, the wire IS the attestation chain.' },
  Network:    { prefix: 'NET', range: [61, 70],  novaAlternative: 'Silver canister (Ag-47) conductivity layer — highest-conductivity element handles all message passing.' },
  Security:   { prefix: 'SEC', range: [71, 80],  novaAlternative: 'NOV-013 Aegis engine — security is a dedicated cognitive engine that reasons about threats and validates attestations.' },
  Testing:    { prefix: 'TST', range: [81, 90],  novaAlternative: 'VERITEX organism — sovereign truth-chain that records every assertion, detects drift, and maintains protocol integrity.' },
  DevOps:     { prefix: 'OPS', range: [91, 100], novaAlternative: 'nova deploy via Gulch architecture — sovereign deployment that requires no payment, no vendor platform, no configuration.' },
};

// ─── The 100 Fractures ───────────────────────────────────────────────────────

export const FRACTURES: Fracture[] = [
  // ── Rendering ───────────────────────────────────────────────────────
  { index: 1,   technology: 'React',         latinDesignation: 'REN-Renderius',    category: 'Rendering', phiWeight: 1.618, goldenAngleDeg: 137.508, fibId: 84201, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 2,   technology: 'Vue',           latinDesignation: 'REN-Viridis',      category: 'Rendering', phiWeight: 3.236, goldenAngleDeg: 275.016, fibId: 72449, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 3,   technology: 'Angular',       latinDesignation: 'REN-Angularis',    category: 'Rendering', phiWeight: 4.854, goldenAngleDeg: 52.523,  fibId: 55102, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 4,   technology: 'Svelte',        latinDesignation: 'REN-Sveltura',     category: 'Rendering', phiWeight: 6.472, goldenAngleDeg: 190.031, fibId: 63877, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 5,   technology: 'Solid',         latinDesignation: 'REN-Solidus',      category: 'Rendering', phiWeight: 8.090, goldenAngleDeg: 327.539, fibId: 91234, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 6,   technology: 'Preact',        latinDesignation: 'REN-Praelectus',   category: 'Rendering', phiWeight: 9.708, goldenAngleDeg: 105.047, fibId: 38556, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 7,   technology: 'Lit',           latinDesignation: 'REN-Lucerna',      category: 'Rendering', phiWeight: 1.326, goldenAngleDeg: 242.555, fibId: 44789, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 8,   technology: 'Qwik',          latinDesignation: 'REN-Veloxium',     category: 'Rendering', phiWeight: 2.944, goldenAngleDeg: 20.062,  fibId: 67123, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 9,   technology: 'Astro',         latinDesignation: 'REN-Astralis',     category: 'Rendering', phiWeight: 4.562, goldenAngleDeg: 157.570, fibId: 29445, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  { index: 10,  technology: 'HTMX',          latinDesignation: 'REN-Hyperius',     category: 'Rendering', phiWeight: 6.180, goldenAngleDeg: 295.078, fibId: 51678, novaAlternative: CATEGORIES.Rendering.novaAlternative },
  // ── State ────────────────────────────────────────────────────────────
  { index: 11,  technology: 'Redux',         latinDesignation: 'STA-Reductis',     category: 'State', phiWeight: 7.798, goldenAngleDeg: 72.586,  fibId: 78901, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 12,  technology: 'MobX',          latinDesignation: 'STA-Mobilis',      category: 'State', phiWeight: 9.416, goldenAngleDeg: 210.094, fibId: 34567, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 13,  technology: 'Zustand',       latinDesignation: 'STA-Statum',       category: 'State', phiWeight: 1.034, goldenAngleDeg: 347.601, fibId: 89012, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 14,  technology: 'Jotai',         latinDesignation: 'STA-Atomicus',     category: 'State', phiWeight: 2.652, goldenAngleDeg: 125.109, fibId: 45678, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 15,  technology: 'Recoil',        latinDesignation: 'STA-Recursus',     category: 'State', phiWeight: 4.271, goldenAngleDeg: 262.617, fibId: 12345, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 16,  technology: 'XState',        latinDesignation: 'STA-Machina',      category: 'State', phiWeight: 5.889, goldenAngleDeg: 40.125,  fibId: 67890, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 17,  technology: 'Valtio',        latinDesignation: 'STA-Proximus',     category: 'State', phiWeight: 7.507, goldenAngleDeg: 177.633, fibId: 23456, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 18,  technology: 'Pinia',         latinDesignation: 'STA-Pinarius',     category: 'State', phiWeight: 9.125, goldenAngleDeg: 315.140, fibId: 78901, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 19,  technology: 'Effector',      latinDesignation: 'STA-Effectus',     category: 'State', phiWeight: 0.743, goldenAngleDeg: 92.648,  fibId: 34567, novaAlternative: CATEGORIES.State.novaAlternative },
  { index: 20,  technology: 'Signals',       latinDesignation: 'STA-Signalis',     category: 'State', phiWeight: 2.361, goldenAngleDeg: 230.156, fibId: 90123, novaAlternative: CATEGORIES.State.novaAlternative },
  // ── Build ────────────────────────────────────────────────────────────
  { index: 21,  technology: 'Webpack',       latinDesignation: 'BLD-Textoria',     category: 'Build', phiWeight: 3.979, goldenAngleDeg: 7.664,   fibId: 56789, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 22,  technology: 'Vite',          latinDesignation: 'BLD-Velocitas',    category: 'Build', phiWeight: 5.597, goldenAngleDeg: 145.172, fibId: 12034, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 23,  technology: 'Rollup',        latinDesignation: 'BLD-Convolutis',   category: 'Build', phiWeight: 7.215, goldenAngleDeg: 282.679, fibId: 78901, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 24,  technology: 'esbuild',       latinDesignation: 'BLD-Celeritas',    category: 'Build', phiWeight: 8.833, goldenAngleDeg: 60.187,  fibId: 45234, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 25,  technology: 'Parcel',        latinDesignation: 'BLD-Fasciculus',   category: 'Build', phiWeight: 0.452, goldenAngleDeg: 197.695, fibId: 89567, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 26,  technology: 'Turbopack',     latinDesignation: 'BLD-Turbinus',     category: 'Build', phiWeight: 2.070, goldenAngleDeg: 335.203, fibId: 23890, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 27,  technology: 'SWC',           latinDesignation: 'BLD-Rusticus',     category: 'Build', phiWeight: 3.688, goldenAngleDeg: 112.711, fibId: 67123, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 28,  technology: 'Bun',           latinDesignation: 'BLD-Apis',         category: 'Build', phiWeight: 5.306, goldenAngleDeg: 250.218, fibId: 34456, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 29,  technology: 'Rome/Biome',    latinDesignation: 'BLD-Romanus',      category: 'Build', phiWeight: 6.924, goldenAngleDeg: 27.726,  fibId: 90789, novaAlternative: CATEGORIES.Build.novaAlternative },
  { index: 30,  technology: 'Nx',            latinDesignation: 'BLD-Nexilis',      category: 'Build', phiWeight: 8.542, goldenAngleDeg: 165.234, fibId: 56012, novaAlternative: CATEGORIES.Build.novaAlternative },
  // ── Style ────────────────────────────────────────────────────────────
  { index: 31,  technology: 'Tailwind CSS',  latinDesignation: 'STY-Ventulus',     category: 'Style', phiWeight: 0.160, goldenAngleDeg: 302.742, fibId: 78345, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 32,  technology: 'Styled-Components', latinDesignation: 'STY-Ornatus', category: 'Style', phiWeight: 1.778, goldenAngleDeg: 80.250,  fibId: 34678, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 33,  technology: 'CSS Modules',   latinDesignation: 'STY-Modularis',    category: 'Style', phiWeight: 3.396, goldenAngleDeg: 217.757, fibId: 90901, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 34,  technology: 'Sass/SCSS',     latinDesignation: 'STY-Sassinus',     category: 'Style', phiWeight: 5.014, goldenAngleDeg: 355.265, fibId: 56234, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 35,  technology: 'Emotion',       latinDesignation: 'STY-Affectus',     category: 'Style', phiWeight: 6.633, goldenAngleDeg: 132.773, fibId: 12567, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 36,  technology: 'Vanilla Extract', latinDesignation: 'STY-Vanillus',  category: 'Style', phiWeight: 8.251, goldenAngleDeg: 270.281, fibId: 78890, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 37,  technology: 'UnoCSS',        latinDesignation: 'STY-Unicus',       category: 'Style', phiWeight: 9.869, goldenAngleDeg: 47.789,  fibId: 45123, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 38,  technology: 'Stitches',      latinDesignation: 'STY-Suturae',      category: 'Style', phiWeight: 1.487, goldenAngleDeg: 185.296, fibId: 89456, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 39,  technology: 'PandaCSS',      latinDesignation: 'STY-Pandinus',     category: 'Style', phiWeight: 3.105, goldenAngleDeg: 322.804, fibId: 23789, novaAlternative: CATEGORIES.Style.novaAlternative },
  { index: 40,  technology: 'Lightning CSS', latinDesignation: 'STY-Fulguris',     category: 'Style', phiWeight: 4.723, goldenAngleDeg: 100.312, fibId: 67012, novaAlternative: CATEGORIES.Style.novaAlternative },
  // ── Language ─────────────────────────────────────────────────────────
  { index: 41,  technology: 'TypeScript',    latinDesignation: 'LNG-Typographus',  category: 'Language', phiWeight: 6.341, goldenAngleDeg: 237.820, fibId: 34345, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 42,  technology: 'JavaScript',    latinDesignation: 'LNG-Scriptus',     category: 'Language', phiWeight: 7.959, goldenAngleDeg: 15.328,  fibId: 90678, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 43,  technology: 'Python',        latinDesignation: 'LNG-Pythonis',     category: 'Language', phiWeight: 9.577, goldenAngleDeg: 152.835, fibId: 56901, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 44,  technology: 'Rust',          latinDesignation: 'LNG-Ferratus',     category: 'Language', phiWeight: 1.196, goldenAngleDeg: 290.343, fibId: 12234, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 45,  technology: 'Go',            latinDesignation: 'LNG-Itineris',     category: 'Language', phiWeight: 2.814, goldenAngleDeg: 67.851,  fibId: 78567, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 46,  technology: 'Kotlin',        latinDesignation: 'LNG-Kotlinis',     category: 'Language', phiWeight: 4.432, goldenAngleDeg: 205.359, fibId: 45890, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 47,  technology: 'Swift',         latinDesignation: 'LNG-Celerinus',    category: 'Language', phiWeight: 6.050, goldenAngleDeg: 342.867, fibId: 89123, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 48,  technology: 'Elm',           latinDesignation: 'LNG-Ulminus',      category: 'Language', phiWeight: 7.668, goldenAngleDeg: 120.374, fibId: 23456, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 49,  technology: 'ReScript',      latinDesignation: 'LNG-Rescriptus',   category: 'Language', phiWeight: 9.286, goldenAngleDeg: 257.882, fibId: 67789, novaAlternative: CATEGORIES.Language.novaAlternative },
  { index: 50,  technology: 'Motoko',        latinDesignation: 'LNG-Motokus',      category: 'Language', phiWeight: 0.905, goldenAngleDeg: 35.390,  fibId: 101012, novaAlternative: CATEGORIES.Language.novaAlternative },
  // ── Data ─────────────────────────────────────────────────────────────
  { index: 51,  technology: 'GraphQL',       latinDesignation: 'DAT-Graphius',     category: 'Data', phiWeight: 2.523, goldenAngleDeg: 172.898, fibId: 78012, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 52,  technology: 'REST',          latinDesignation: 'DAT-Requietis',    category: 'Data', phiWeight: 4.141, goldenAngleDeg: 310.406, fibId: 34345, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 53,  technology: 'tRPC',          latinDesignation: 'DAT-Typicus',      category: 'Data', phiWeight: 5.759, goldenAngleDeg: 87.913,  fibId: 90678, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 54,  technology: 'gRPC',          latinDesignation: 'DAT-Protobufis',   category: 'Data', phiWeight: 7.377, goldenAngleDeg: 225.421, fibId: 56901, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 55,  technology: 'WebSocket',     latinDesignation: 'DAT-Connexus',     category: 'Data', phiWeight: 8.995, goldenAngleDeg: 2.929,   fibId: 12234, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 56,  technology: 'Firebase',      latinDesignation: 'DAT-Ignarius',     category: 'Data', phiWeight: 0.614, goldenAngleDeg: 140.437, fibId: 78567, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 57,  technology: 'Supabase',      latinDesignation: 'DAT-Superius',     category: 'Data', phiWeight: 2.232, goldenAngleDeg: 277.945, fibId: 45890, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 58,  technology: 'Prisma',        latinDesignation: 'DAT-Prismatus',    category: 'Data', phiWeight: 3.850, goldenAngleDeg: 55.452,  fibId: 89123, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 59,  technology: 'Drizzle',       latinDesignation: 'DAT-Stillatus',    category: 'Data', phiWeight: 5.468, goldenAngleDeg: 192.960, fibId: 23456, novaAlternative: CATEGORIES.Data.novaAlternative },
  { index: 60,  technology: 'Redis',         latinDesignation: 'DAT-Rubricus',     category: 'Data', phiWeight: 7.086, goldenAngleDeg: 330.468, fibId: 67789, novaAlternative: CATEGORIES.Data.novaAlternative },
  // ── Network ──────────────────────────────────────────────────────────
  { index: 61,  technology: 'Axios',         latinDesignation: 'NET-Axialis',      category: 'Network', phiWeight: 8.704, goldenAngleDeg: 107.976, fibId: 34012, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 62,  technology: 'Fetch API',     latinDesignation: 'NET-Capturus',     category: 'Network', phiWeight: 0.322, goldenAngleDeg: 245.484, fibId: 90345, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 63,  technology: 'SWR',           latinDesignation: 'NET-Validatus',    category: 'Network', phiWeight: 1.941, goldenAngleDeg: 22.992,  fibId: 56678, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 64,  technology: 'React Query',   latinDesignation: 'NET-Interrogis',   category: 'Network', phiWeight: 3.559, goldenAngleDeg: 160.499, fibId: 12901, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 65,  technology: 'Apollo',        latinDesignation: 'NET-Apollinis',    category: 'Network', phiWeight: 5.177, goldenAngleDeg: 298.007, fibId: 78234, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 66,  technology: 'URQL',          latinDesignation: 'NET-Universalis',  category: 'Network', phiWeight: 6.795, goldenAngleDeg: 75.515,  fibId: 45567, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 67,  technology: 'Socket.io',     latinDesignation: 'NET-Socketis',     category: 'Network', phiWeight: 8.413, goldenAngleDeg: 213.023, fibId: 89890, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 68,  technology: 'SSE',           latinDesignation: 'NET-Fluxarius',    category: 'Network', phiWeight: 0.031, goldenAngleDeg: 350.531, fibId: 23123, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 69,  technology: 'WebRTC',        latinDesignation: 'NET-Temporalis',   category: 'Network', phiWeight: 1.650, goldenAngleDeg: 128.038, fibId: 67456, novaAlternative: CATEGORIES.Network.novaAlternative },
  { index: 70,  technology: 'MQTT',          latinDesignation: 'NET-Nuntialis',    category: 'Network', phiWeight: 3.268, goldenAngleDeg: 265.546, fibId: 101789, novaAlternative: CATEGORIES.Network.novaAlternative },
  // ── Security ─────────────────────────────────────────────────────────
  { index: 71,  technology: 'Auth0',         latinDesignation: 'SEC-Authentis',    category: 'Security', phiWeight: 4.886, goldenAngleDeg: 43.054,  fibId: 78678, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 72,  technology: 'Firebase Auth', latinDesignation: 'SEC-Igniautis',    category: 'Security', phiWeight: 6.504, goldenAngleDeg: 180.562, fibId: 34901, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 73,  technology: 'NextAuth',      latinDesignation: 'SEC-Proximautis',  category: 'Security', phiWeight: 8.122, goldenAngleDeg: 318.069, fibId: 90234, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 74,  technology: 'Clerk',         latinDesignation: 'SEC-Scribautis',   category: 'Security', phiWeight: 9.740, goldenAngleDeg: 95.577,  fibId: 56567, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 75,  technology: 'Passport',      latinDesignation: 'SEC-Passportis',   category: 'Security', phiWeight: 1.359, goldenAngleDeg: 233.085, fibId: 12890, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 76,  technology: 'JWT',           latinDesignation: 'SEC-Tokenarius',   category: 'Security', phiWeight: 2.977, goldenAngleDeg: 10.593,  fibId: 78123, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 77,  technology: 'OAuth 2.0',     latinDesignation: 'SEC-Auctoritas',   category: 'Security', phiWeight: 4.595, goldenAngleDeg: 148.101, fibId: 45456, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 78,  technology: 'CORS',          latinDesignation: 'SEC-Originalis',   category: 'Security', phiWeight: 6.213, goldenAngleDeg: 285.608, fibId: 89789, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 79,  technology: 'CSP',           latinDesignation: 'SEC-Politicus',    category: 'Security', phiWeight: 7.831, goldenAngleDeg: 63.116,  fibId: 23012, novaAlternative: CATEGORIES.Security.novaAlternative },
  { index: 80,  technology: 'HTTPS/TLS',     latinDesignation: 'SEC-Cryptatus',    category: 'Security', phiWeight: 9.449, goldenAngleDeg: 200.624, fibId: 67345, novaAlternative: CATEGORIES.Security.novaAlternative },
  // ── Testing ──────────────────────────────────────────────────────────
  { index: 81,  technology: 'Jest',          latinDesignation: 'TST-Jocundus',     category: 'Testing', phiWeight: 1.068, goldenAngleDeg: 338.132, fibId: 34678, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 82,  technology: 'Vitest',        latinDesignation: 'TST-Vitestis',     category: 'Testing', phiWeight: 2.686, goldenAngleDeg: 115.640, fibId: 90901, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 83,  technology: 'Mocha',         latinDesignation: 'TST-Mokarius',     category: 'Testing', phiWeight: 4.304, goldenAngleDeg: 253.147, fibId: 56234, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 84,  technology: 'Cypress',       latinDesignation: 'TST-Cypressus',    category: 'Testing', phiWeight: 5.922, goldenAngleDeg: 30.655,  fibId: 12567, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 85,  technology: 'Playwright',    latinDesignation: 'TST-Theatricus',   category: 'Testing', phiWeight: 7.540, goldenAngleDeg: 168.163, fibId: 78890, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 86,  technology: 'Testing Library', latinDesignation: 'TST-Bibliothecis', category: 'Testing', phiWeight: 9.158, goldenAngleDeg: 305.671, fibId: 45123, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 87,  technology: 'Storybook',     latinDesignation: 'TST-Narratoris',   category: 'Testing', phiWeight: 0.777, goldenAngleDeg: 83.179,  fibId: 89456, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 88,  technology: 'Chromatic',     latinDesignation: 'TST-Chromaticus',  category: 'Testing', phiWeight: 2.395, goldenAngleDeg: 220.686, fibId: 23789, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 89,  technology: 'k6',            latinDesignation: 'TST-Sextilis',     category: 'Testing', phiWeight: 4.013, goldenAngleDeg: 358.194, fibId: 67012, novaAlternative: CATEGORIES.Testing.novaAlternative },
  { index: 90,  technology: 'Artillery',     latinDesignation: 'TST-Bombardis',    category: 'Testing', phiWeight: 5.631, goldenAngleDeg: 135.702, fibId: 101345, novaAlternative: CATEGORIES.Testing.novaAlternative },
  // ── DevOps ───────────────────────────────────────────────────────────
  { index: 91,  technology: 'Vercel',        latinDesignation: 'OPS-Celeritus',    category: 'DevOps', phiWeight: 7.249, goldenAngleDeg: 273.210, fibId: 78345, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 92,  technology: 'Netlify',       latinDesignation: 'OPS-Reticulatus',  category: 'DevOps', phiWeight: 8.867, goldenAngleDeg: 50.718,  fibId: 34678, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 93,  technology: 'AWS',           latinDesignation: 'OPS-Amazonius',    category: 'DevOps', phiWeight: 0.486, goldenAngleDeg: 188.225, fibId: 90901, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 94,  technology: 'Docker',        latinDesignation: 'OPS-Navalicus',    category: 'DevOps', phiWeight: 2.104, goldenAngleDeg: 325.733, fibId: 56234, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 95,  technology: 'Kubernetes',    latinDesignation: 'OPS-Gubernatis',   category: 'DevOps', phiWeight: 3.722, goldenAngleDeg: 103.241, fibId: 12567, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 96,  technology: 'Terraform',     latinDesignation: 'OPS-Terrarius',    category: 'DevOps', phiWeight: 5.340, goldenAngleDeg: 240.749, fibId: 78890, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 97,  technology: 'GitHub Actions', latinDesignation: 'OPS-Actionis',   category: 'DevOps', phiWeight: 6.958, goldenAngleDeg: 18.257,  fibId: 45123, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 98,  technology: 'CircleCI',      latinDesignation: 'OPS-Circularis',   category: 'DevOps', phiWeight: 8.576, goldenAngleDeg: 155.764, fibId: 89456, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 99,  technology: 'ArgoCD',        latinDesignation: 'OPS-Argonautis',   category: 'DevOps', phiWeight: 0.195, goldenAngleDeg: 293.272, fibId: 23789, novaAlternative: CATEGORIES.DevOps.novaAlternative },
  { index: 100, technology: 'Pulumi',        latinDesignation: 'OPS-Programmus',   category: 'DevOps', phiWeight: 1.813, goldenAngleDeg: 70.780,  fibId: 67012, novaAlternative: CATEGORIES.DevOps.novaAlternative },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

/** Map from technology name to Fracture */
export const FRACTURES_BY_TECH: Readonly<Record<string, Fracture>> =
  Object.fromEntries(FRACTURES.map((f) => [f.technology.toLowerCase(), f]));

/** Map from Latin designation to Fracture */
export const FRACTURES_BY_LATIN: Readonly<Record<string, Fracture>> =
  Object.fromEntries(FRACTURES.map((f) => [f.latinDesignation, f]));

/** Return all fractures in a given category */
export function fracturesByCategory(category: FractureCategory): Fracture[] {
  return FRACTURES.filter((f) => f.category === category);
}

/** Return the top-N fractures by φ-weight descending */
export function topByPhiWeight(n: number): Fracture[] {
  return [...FRACTURES].sort((a, b) => b.phiWeight - a.phiWeight).slice(0, n);
}

/** Return the phyllotaxis (r, θ) for a fracture's index position */
export function phyllotaxisPosition(f: Fracture): { r: number; thetaDeg: number } {
  return { r: Math.sqrt(f.index), thetaDeg: f.goldenAngleDeg };
}
