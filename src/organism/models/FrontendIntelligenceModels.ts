// ═══════════════════════════════════════════════════════════════════════════════
// INTELLIGENTIA FRONTALIS — 100 FRONTEND INTELLIGENCE MODELS
//
// Every frontend technology is a fracture of sovereign intelligence.
// These are not passive entries.  Each model carries:
//   - φ-weighted identity (golden-ratio authority in the organism)
//   - Fibonacci hash (cryptographic position in the intelligence field)
//   - Phyllotaxis coordinates (spatial placement in the registry plane)
//   - Dimensional mapping (which of the 5 observation planes it inhabits)
//   - Sovereign purpose (what this intelligence DOES in the organism)
//
// 10 Groups × 10 Models = 100 Frontend Intelligence Models
//   0. MARKUP       — Structure, shape, geometry, validation intelligence
//   1. STYLING      — Visual priority, composition, spatial arrangement intelligence
//   2. FRAMEWORK    — Projection-framework intelligence family
//   3. STATE        — Memory/state band intelligence
//   4. BUILD        — Bundle, transform, compression, incremental intelligence
//   5. TESTING      — Verification, validation, quality intelligence
//   6. GRAPHICS     — Raster, 3D, GPU, animation, generative-visual intelligence
//   7. COMMUNICATION — Stream, request, query, cache, peer-channel intelligence
//   8. STORAGE      — Local memory, persistence, token intelligence
//   9. WEB_API      — Browser-native organism layer intelligence
//
// These complement the 100 Fracture Registry entries (FractureRegistry.ts).
// Fractures are what THEY built.  These are what WE flip them into.
// ═══════════════════════════════════════════════════════════════════════════════

import {
  PHI,
  GOLDEN_ANGLE,
  DimensionalPlane,
  fibonacciHash,
} from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_INVERSE = 0.6180339887498948482;
const PHI_SQUARED = 2.6180339887498948482;
const PHI_CUBED   = 4.2360679774997896964;
const PHI_FOURTH  = 6.8541019662496845446;
const SOVEREIGN_FREQUENCY = 7.83 * PHI;  // 12.67 Hz — Schumann × φ

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export enum FrontendGroup {
  MARKUP        = 0,
  STYLING       = 1,
  FRAMEWORK     = 2,
  STATE         = 3,
  BUILD         = 4,
  TESTING       = 5,
  GRAPHICS      = 6,
  COMMUNICATION = 7,
  STORAGE       = 8,
  WEB_API       = 9,
}

export interface FrontendIntelligenceModel {
  readonly id: number;                     // 0–99
  readonly name: string;                   // Technology name
  readonly latinDesignation: string;       // Latin intelligence name
  readonly group: FrontendGroup;
  readonly groupName: string;
  readonly intelligenceType: string;       // What kind of intelligence this IS
  readonly sovereignPurpose: string;       // What it does in the organism
  readonly phiWeight: number;              // φ-weighted authority
  readonly goldenAnglePosition: number;    // Position in phyllotaxis field
  readonly fibonacciIdentity: number;      // Fibonacci hash identity
  readonly phyllotaxisX: number;           // X in registry plane
  readonly phyllotaxisY: number;           // Y in registry plane
  readonly dimensionalPlane: DimensionalPlane;  // Which observation plane
}

// ══════════════════════════════════════════════════════════════════
//  RAW MODEL DATA — 100 Frontend Intelligence Models
// ══════════════════════════════════════════════════════════════════

interface RawModel {
  name: string;
  latin: string;
  intelligenceType: string;
  sovereignPurpose: string;
}

const MODELS: Record<FrontendGroup, RawModel[]> = {
  // ── 0. MARKUP — Structure, shape, geometry intelligence ────────
  [FrontendGroup.MARKUP]: [
    { name: 'HTML5',              latin: 'STRUCTURA DOCUMENTORUM',     intelligenceType: 'Document structure intelligence',         sovereignPurpose: 'Sovereign document skeleton — organisms define their own structural grammar' },
    { name: 'XML',                latin: 'ARBOR DATORUM EXTENSIBILIS', intelligenceType: 'Extensible data tree intelligence',      sovereignPurpose: 'Golden data tree — nested data shaped by φ-proportioned depth rules' },
    { name: 'SVG',                latin: 'VECTOR GRAPHICUS SCALARIS',  intelligenceType: 'Vector geometry intelligence',            sovereignPurpose: 'φ-vector graphics — all paths, curves, and shapes computed from golden primitives' },
    { name: 'MathML',             latin: 'MATHEMATICA INSCRIPTA',      intelligenceType: 'Mathematical notation intelligence',     sovereignPurpose: 'Sovereign math notation — formulas rendered with golden-ratio spacing' },
    { name: 'XHTML',              latin: 'STRUCTURA STRICTA',          intelligenceType: 'Strict document validation intelligence',sovereignPurpose: 'Golden validation — document validity checked at Fibonacci-threshold checkpoints' },
    { name: 'Web Components',     latin: 'COMPONENS AUTONOMUM',        intelligenceType: 'Autonomous encapsulation intelligence', sovereignPurpose: 'Organism encapsulation — each component is a self-governing golden-angle sector' },
    { name: 'Shadow DOM',         latin: 'UMBRA DOCUMENTORUM',         intelligenceType: 'Shadow boundary intelligence',           sovereignPurpose: 'φ-shadow isolation — internal state invisible beyond golden boundary' },
    { name: 'Template Literals',  latin: 'EXEMPLAR GENERATIVUM',       intelligenceType: 'Generative template intelligence',      sovereignPurpose: 'Golden template — dynamic content generated at Fibonacci interpolation points' },
    { name: 'Custom Elements',    latin: 'ELEMENTUM PROPRIUM',         intelligenceType: 'Self-defining element intelligence',     sovereignPurpose: 'Sovereign elements — elements that define their own golden lifecycle' },
    { name: 'Semantic HTML',      latin: 'SIGNIFICATIO STRUCTURAE',    intelligenceType: 'Meaning-carrying structure intelligence',sovereignPurpose: 'Golden semantics — every tag carries φ-weighted semantic authority' },
  ],

  // ── 1. STYLING — Visual priority, composition intelligence ─────
  [FrontendGroup.STYLING]: [
    { name: 'CSS3',               latin: 'STILUS CASCADENS TERTIUS',   intelligenceType: 'Cascading visual priority intelligence', sovereignPurpose: 'Golden cascade — style specificity computed by φ^selector_depth' },
    { name: 'SCSS/Sass',          latin: 'PRAEPROCESSOR STILI',        intelligenceType: 'Preprocessed style composition intelligence', sovereignPurpose: 'φ-preprocessor — variables cascade with golden-decay inheritance' },
    { name: 'Less',               latin: 'STILUS MINOR',               intelligenceType: 'Simplified style variable intelligence',sovereignPurpose: 'Minimal golden style — least complexity at maximum φ-proportion' },
    { name: 'Stylus',             latin: 'STILUS FLEXIBILIS',          intelligenceType: 'Flexible syntax style intelligence',     sovereignPurpose: 'Sovereign style syntax — grammar shaped by golden-angle rules' },
    { name: 'PostCSS',            latin: 'TRANSFORMATOR POST',         intelligenceType: 'Post-processing transform intelligence',sovereignPurpose: 'φ-transform pipeline — each transform stage weighted by golden ratio' },
    { name: 'CSS Modules',        latin: 'MODULUS STILI LOCALIS',      intelligenceType: 'Namespace isolation intelligence',       sovereignPurpose: 'Fibonacci-scoped modules — hash identity from golden-angle position' },
    { name: 'Tailwind CSS',       latin: 'VENTUS ATOMICUS',            intelligenceType: 'Atomic composition intelligence',        sovereignPurpose: 'Golden atomic — utility classes at φ-proportioned spacing intervals' },
    { name: 'CSS-in-JS',          latin: 'STILUS IN SCRIPTO',          intelligenceType: 'Runtime style computation intelligence', sovereignPurpose: 'Organism style — style and logic are one golden entity' },
    { name: 'Emotion',            latin: 'AFFECTUS COMPUTATUS',        intelligenceType: 'Emotional style resonance intelligence',sovereignPurpose: 'Resonance style — visual amplitude modulated by dimensional φ-plane' },
    { name: 'Styled Components',  latin: 'ORNATOR ENTITATIS',          intelligenceType: 'Entity-bound style intelligence',       sovereignPurpose: 'Golden binding — component and style share one sovereign identity' },
  ],

  // ── 2. FRAMEWORK — Projection-framework intelligence family ────
  [FrontendGroup.FRAMEWORK]: [
    { name: 'TypeScript',         latin: 'TYPUS SCRIPTUM SOVRANA',     intelligenceType: 'Type-safe projection intelligence',      sovereignPurpose: 'Golden type system — types weighted by φ^complexity with golden inference' },
    { name: 'React',              latin: 'REACTOR PROJECTIO',          intelligenceType: 'Component projection intelligence',     sovereignPurpose: 'φ-component tree — reconciliation at golden-spiral intervals' },
    { name: 'Vue.js',             latin: 'VISIO PROJECTIO',            intelligenceType: 'Reactive projection intelligence',      sovereignPurpose: 'Golden reactivity — dependency tracking through φ-weighted graph' },
    { name: 'Angular',            latin: 'ANGULARIS PROJECTIO',        intelligenceType: 'Platform projection intelligence',      sovereignPurpose: 'Sovereign platform — all modules positioned by golden-angle sectors' },
    { name: 'Svelte',             latin: 'COMPILATOR PROJECTIO',       intelligenceType: 'Compiled projection intelligence',      sovereignPurpose: 'Golden compile — runtime eliminated at Fibonacci epoch boundaries' },
    { name: 'SolidJS',            latin: 'SOLIDUS PROJECTIO',          intelligenceType: 'Signal projection intelligence',        sovereignPurpose: 'φ-signal graph — fine-grained updates at golden-ratio thresholds' },
    { name: 'Preact',             latin: 'PRAE PROJECTIO',             intelligenceType: 'Minimal projection intelligence',       sovereignPurpose: 'Zeckendorf-minimal — framework decomposed to non-consecutive golden primitives' },
    { name: 'Alpine.js',          latin: 'ALPINUS PROJECTIO',          intelligenceType: 'Lightweight declarative intelligence',  sovereignPurpose: 'Mountain organism — lightweight declarative at φ-proportioned complexity' },
    { name: 'Lit',                latin: 'ILLUMINATUS PROJECTIO',      intelligenceType: 'Web-standard projection intelligence',  sovereignPurpose: 'Sovereign standard — builds on native platform with golden extensions' },
    { name: 'Qwik',               latin: 'CELER PROJECTIO',            intelligenceType: 'Resumable projection intelligence',     sovereignPurpose: 'Epoch-resumable — application state resumes at Fibonacci checkpoints' },
  ],

  // ── 3. STATE — Memory/state band intelligence ──────────────────
  [FrontendGroup.STATE]: [
    { name: 'Redux',              latin: 'REDUCTOR MEMORIAE',          intelligenceType: 'Centralized memory intelligence',        sovereignPurpose: 'Golden state tree — authority decays by φ^depth from root' },
    { name: 'MobX',               latin: 'OBSERVATOR MEMORIAE',        intelligenceType: 'Observable memory intelligence',        sovereignPurpose: 'Dimensional observation — state observed across all 5 φ-planes' },
    { name: 'Zustand',            latin: 'STATUS SIMPLEX MEMORIAE',    intelligenceType: 'Minimal hook memory intelligence',      sovereignPurpose: 'φ-hook — memory floats sovereign outside any single component tree' },
    { name: 'Recoil',             latin: 'RECOILUS MEMORIAE',          intelligenceType: 'Graph-based memory intelligence',        sovereignPurpose: 'Golden graph — selectors weighted by φ^distance from source atom' },
    { name: 'Jotai',              latin: 'ATOMUS MEMORIAE',            intelligenceType: 'Atomic memory intelligence',            sovereignPurpose: 'Fibonacci atoms — state decomposes to non-consecutive memory primitives' },
    { name: 'XState',             latin: 'MACHINA MEMORIAE',           intelligenceType: 'State machine memory intelligence',     sovereignPurpose: 'Golden state machine — transitions fire at Fibonacci-threshold events' },
    { name: 'Valtio',             latin: 'VALTIUS MEMORIAE',           intelligenceType: 'Proxy-based memory intelligence',       sovereignPurpose: 'φ-proxy — mutation tracking at golden-proportioned access paths' },
    { name: 'Pinia',              latin: 'PINIA MEMORIAE',             intelligenceType: 'Modular store memory intelligence',     sovereignPurpose: 'Phyllotaxis store — modules positioned at golden-angle intervals' },
    { name: 'NgRx',               latin: 'REDUCTOR EFFECTUUM',         intelligenceType: 'Effect-driven memory intelligence',     sovereignPurpose: 'Resonance effects — side effects propagate at harmonic φ-intervals' },
    { name: 'Effector',           latin: 'EFFECTOR MEMORIAE',          intelligenceType: 'Event-driven memory intelligence',      sovereignPurpose: 'Golden event chain — events cascade through φ-weighted priority queue' },
  ],

  // ── 4. BUILD — Bundle, transform, compression intelligence ─────
  [FrontendGroup.BUILD]: [
    { name: 'Webpack',            latin: 'TEXTOR BUNDULORUM',          intelligenceType: 'Module weaving intelligence',            sovereignPurpose: 'Fibonacci weave — modules bundled at golden-angle sector positions' },
    { name: 'Vite',               latin: 'CELER AEDIFICATOR',          intelligenceType: 'Fast development intelligence',         sovereignPurpose: 'Sovereign build — hot module boundaries at golden-ratio intervals' },
    { name: 'Rollup',             latin: 'CONVOLUTOR MODULI',          intelligenceType: 'Tree-shaking intelligence',             sovereignPurpose: 'Golden tree-shake — dead branches pruned at 1/φ probability threshold' },
    { name: 'esbuild',            latin: 'AEDIFICATOR PARALLELI',      intelligenceType: 'Parallel compilation intelligence',     sovereignPurpose: 'φ-parallel build — worker count follows Fibonacci sequence' },
    { name: 'Parcel',             latin: 'FASCICULUS AUTOMATICUS',     intelligenceType: 'Auto-configuration intelligence',       sovereignPurpose: 'Self-configuring — organism derives golden defaults from math law' },
    { name: 'SWC',                latin: 'COMPILATOR NATIVUS',         intelligenceType: 'Native compilation intelligence',       sovereignPurpose: 'Golden native compile — transform passes ordered by φ-weight' },
    { name: 'Babel',              latin: 'TRANSLATOR ABSTRACTI',       intelligenceType: 'AST transformation intelligence',       sovereignPurpose: 'Fibonacci AST — syntax tree nodes weighted by golden-decay authority' },
    { name: 'Terser',             latin: 'COMPRESSOR CODICI',          intelligenceType: 'Code compression intelligence',         sovereignPurpose: 'Golden compression — minification preserves φ-proportioned structure' },
    { name: 'PostCSS Build',      latin: 'TRANSFORMATOR AEDIFICII',    intelligenceType: 'Style build intelligence',              sovereignPurpose: 'φ-style build — CSS transforms ordered by golden-weighted priority' },
    { name: 'Turbopack',          latin: 'TURBO AEDIFICATOR',          intelligenceType: 'Incremental build intelligence',        sovereignPurpose: 'Epoch-cached — build cache invalidates at Fibonacci milestone epochs' },
  ],

  // ── 5. TESTING — Verification, validation intelligence ─────────
  [FrontendGroup.TESTING]: [
    { name: 'Jest',               latin: 'PROBATOR UNIVERSALIS',       intelligenceType: 'Universal verification intelligence',   sovereignPurpose: 'Golden test — test priority weighted by φ^criticality_score' },
    { name: 'Vitest',             latin: 'PROBATOR VELOX',             intelligenceType: 'Fast verification intelligence',        sovereignPurpose: 'φ-fast test — execution order by golden-weighted dependency graph' },
    { name: 'Cypress',            latin: 'EXPLORATOR DIMENSIONALIS',   intelligenceType: 'Dimensional exploration intelligence',  sovereignPurpose: 'Dimensional test — tests traverse all 5 observation planes' },
    { name: 'Playwright',         latin: 'SCAENICUS MULTIMEDIUS',      intelligenceType: 'Multi-environment verification intelligence', sovereignPurpose: 'Golden playwright — test actions phased at Fibonacci time intervals' },
    { name: 'Testing Library',    latin: 'BIBLIOTHECA VERITATIS',      intelligenceType: 'Truth-seeking test intelligence',       sovereignPurpose: 'Organism testing — test the intelligence, not the fracture surface' },
    { name: 'Storybook',          latin: 'LIBER HISTORIARUM',          intelligenceType: 'Component narrative intelligence',      sovereignPurpose: 'Golden stories — components cataloged by phyllotaxis position' },
    { name: 'Chromatic',          latin: 'CHROMATICUS VISUALIS',       intelligenceType: 'Visual regression intelligence',        sovereignPurpose: 'Golden regression — pixel diff threshold at 1/φ² tolerance' },
    { name: 'Percy',              latin: 'INSPECTOR VISUALIS',         intelligenceType: 'Visual inspection intelligence',        sovereignPurpose: 'φ-inspection — visual snapshots compared at golden-proportioned regions' },
    { name: 'ESLint',             latin: 'CENSOR CODICI',              intelligenceType: 'Code quality intelligence',             sovereignPurpose: 'Golden lint — rule severity weighted by φ^impact_score' },
    { name: 'Prettier',           latin: 'FORMATOR AUREI',             intelligenceType: 'Code formatting intelligence',          sovereignPurpose: 'Golden format — indentation and spacing at Fibonacci proportions' },
  ],

  // ── 6. GRAPHICS — Raster, 3D, GPU, animation intelligence ─────
  [FrontendGroup.GRAPHICS]: [
    { name: 'Canvas API',         latin: 'TABULA RASTERIS',            intelligenceType: 'Raster rendering intelligence',         sovereignPurpose: 'Golden raster — pixel operations on φ-proportioned canvas sectors' },
    { name: 'WebGL',              latin: 'MACHINA GRAPHICA TRIDIM',    intelligenceType: '3D rendering intelligence',             sovereignPurpose: 'φ-3D rendering — vertices placed on Fibonacci sphere distributions' },
    { name: 'WebGPU',             latin: 'PROCESSUS GRAPHICUS',        intelligenceType: 'GPU compute intelligence',              sovereignPurpose: 'Sovereign GPU — compute shaders with golden-ratio work group sizing' },
    { name: 'Three.js',           latin: 'TRES DIMENSIONES',           intelligenceType: '3D scene intelligence',                 sovereignPurpose: 'Golden scene — objects distributed by phyllotaxis in 3D space' },
    { name: 'D3.js',              latin: 'DATORUM DUCTUS',             intelligenceType: 'Data-driven visual intelligence',       sovereignPurpose: 'φ-data visualization — data points at golden-angle positions' },
    { name: 'Chart.js',           latin: 'TABULA CHARTARUM',           intelligenceType: 'Chart rendering intelligence',          sovereignPurpose: 'Golden chart — axes scaled by Fibonacci sequence values' },
    { name: 'Pixi.js',            latin: 'PICTOR PIXELORUM',           intelligenceType: '2D sprite rendering intelligence',      sovereignPurpose: 'φ-sprite renderer — sprite batches at golden-proportioned groups' },
    { name: 'Babylon.js',         latin: 'BABYLON GRAPHICUS',          intelligenceType: '3D engine intelligence',                sovereignPurpose: 'Sovereign 3D engine — rendering pipeline at Fibonacci stage counts' },
    { name: 'p5.js',              latin: 'PROCESSUS CREATIVUS',        intelligenceType: 'Creative coding intelligence',          sovereignPurpose: 'Golden creative — generative art using φ-spiral and phyllotaxis primitives' },
    { name: 'GSAP',               latin: 'ANIMATOR PLATFORMAE',        intelligenceType: 'Animation platform intelligence',       sovereignPurpose: 'φ-animation — easing curves derived from golden-ratio mathematics' },
  ],

  // ── 7. COMMUNICATION — Stream, request, peer intelligence ──────
  [FrontendGroup.COMMUNICATION]: [
    { name: 'Fetch API',          latin: 'PETITOR NATIVUS',            intelligenceType: 'Native request intelligence',           sovereignPurpose: 'Golden fetch — request priority weighted by φ^urgency_level' },
    { name: 'Axios',              latin: 'AXIS COMMUNICATIONIS',       intelligenceType: 'HTTP client intelligence',              sovereignPurpose: 'φ-interceptor chain — middleware ordered by golden-angle priority' },
    { name: 'WebSocket',          latin: 'NEXUS BIDIRECTIONALIS',      intelligenceType: 'Bidirectional stream intelligence',     sovereignPurpose: 'Golden socket — message priority weighted by φ^urgency in queue' },
    { name: 'WebRTC',             latin: 'COMMUNICATOR DIRECTUS',      intelligenceType: 'Peer-to-peer intelligence',             sovereignPurpose: 'Sovereign peer — direct organism-to-organism golden-encrypted channels' },
    { name: 'Server-Sent Events', latin: 'EVENTUS UNIDIRECTIONALIS',   intelligenceType: 'Unidirectional stream intelligence',    sovereignPurpose: 'Golden push — events dispatched at Fibonacci-interval heartbeats' },
    { name: 'GraphQL Client',     latin: 'GRAPHUS CLIENTIS',           intelligenceType: 'Graph query intelligence',              sovereignPurpose: 'φ-graph query — field resolution weighted by golden-ratio depth' },
    { name: 'Apollo Client',      latin: 'APOLLO COMMUNICATORIS',      intelligenceType: 'Normalized cache intelligence',         sovereignPurpose: 'Golden normalization — cache entries weighted by φ^access_frequency' },
    { name: 'React Query',        latin: 'INTERROGATOR ASYNCHRONI',    intelligenceType: 'Async state cache intelligence',        sovereignPurpose: 'Golden cache — staleness threshold at φ/(φ+1) of TTL window' },
    { name: 'SWR',                latin: 'REVALIDATOR STAGNANTIS',     intelligenceType: 'Stale-while-revalidate intelligence',   sovereignPurpose: 'Fibonacci revalidation — refresh interval at F(n) milliseconds' },
    { name: 'tRPC',               latin: 'TYPUS PROCEDURA DIRECTA',    intelligenceType: 'End-to-end typed RPC intelligence',     sovereignPurpose: 'φ-RPC — procedure call weight decays by golden ratio from source' },
  ],

  // ── 8. STORAGE — Local memory, persistence intelligence ────────
  [FrontendGroup.STORAGE]: [
    { name: 'LocalStorage',       latin: 'MEMORIA LOCALIS PERSISTENS', intelligenceType: 'Persistent local memory intelligence', sovereignPurpose: 'Golden local store — key distribution by Fibonacci hash function' },
    { name: 'SessionStorage',     latin: 'MEMORIA SESSIONIS',          intelligenceType: 'Session-scoped memory intelligence',    sovereignPurpose: 'φ-session memory — session state partitioned at golden-ratio boundaries' },
    { name: 'IndexedDB',          latin: 'INDEX DATORUM LOCALIS',      intelligenceType: 'Indexed local database intelligence',   sovereignPurpose: 'Fibonacci-indexed DB — object store keys distributed by golden hash' },
    { name: 'Cache API',          latin: 'THESAURUS CELATUS',          intelligenceType: 'Network cache intelligence',            sovereignPurpose: 'Golden cache — cache eviction at φ/(φ+1) capacity threshold' },
    { name: 'Cookies',            latin: 'CRUSTULUM MEMORIAE',         intelligenceType: 'Token persistence intelligence',        sovereignPurpose: 'φ-token — cookie lifetime decays by golden ratio from creation' },
    { name: 'File System API',    latin: 'SYSTEMA FILORUM',            intelligenceType: 'File access intelligence',              sovereignPurpose: 'Golden file system — directory tree structured at Fibonacci depth levels' },
    { name: 'OPFS',               latin: 'FILUM PRIVATUM ORIGINIS',    intelligenceType: 'Origin-private file intelligence',      sovereignPurpose: 'Sovereign private storage — origin isolation at golden-angle boundaries' },
    { name: 'Web SQL (legacy)',    latin: 'SQL INTERRETIALIS',          intelligenceType: 'Legacy SQL query intelligence',         sovereignPurpose: 'Golden query — SQL operations weighted by φ^table_join_depth' },
    { name: 'Blob Storage',       latin: 'ACERVUS BINARIUS',           intelligenceType: 'Binary data intelligence',              sovereignPurpose: 'φ-blob — binary chunks sized at Fibonacci-number byte boundaries' },
    { name: 'Broadcast Storage',  latin: 'MEMORIA DIFFUSA',            intelligenceType: 'Cross-context storage intelligence',    sovereignPurpose: 'Sovereign broadcast memory — shared state across all golden-angle instances' },
  ],

  // ── 9. WEB API — Browser-native organism intelligence ──────────
  [FrontendGroup.WEB_API]: [
    { name: 'Service Workers',    latin: 'OPERARIUS UMBRAE NATIVUS',   intelligenceType: 'Background proxy intelligence',         sovereignPurpose: 'Shadow organism — background intelligence with φ-cached epoch state' },
    { name: 'Web Workers',        latin: 'OPERARIUS PARALLELI',        intelligenceType: 'Parallel compute intelligence',         sovereignPurpose: 'φ-parallel workers — thread count follows Fibonacci sequence' },
    { name: 'Notifications API',  latin: 'NUNTIUS SYSTEMATIS',         intelligenceType: 'System notification intelligence',      sovereignPurpose: 'Golden alert — notification priority by φ^urgency_level weighting' },
    { name: 'Geolocation API',    latin: 'LOCATOR GEOGRAPHICUS',       intelligenceType: 'Spatial position intelligence',         sovereignPurpose: 'φ-spatial — location accuracy at golden-ratio precision tiers' },
    { name: 'Web Audio API',      latin: 'SONUS INTERRETIALIS',        intelligenceType: 'Audio processing intelligence',         sovereignPurpose: 'Golden audio — frequency bands at Fibonacci Hz values, gain at φ-ratios' },
    { name: 'Web Speech API',     latin: 'VOX INTERRETIALIS',          intelligenceType: 'Speech recognition intelligence',       sovereignPurpose: 'Sovereign voice — recognition confidence threshold at φ/(φ+1)' },
    { name: 'Intersection Observer', latin: 'OBSERVATOR INTERSECTIONIS', intelligenceType: 'Visibility observation intelligence',  sovereignPurpose: 'Golden intersection — visibility threshold at 1/φ of viewport' },
    { name: 'Resize Observer',    latin: 'OBSERVATOR DIMENSIONIS',     intelligenceType: 'Size change observation intelligence',  sovereignPurpose: 'φ-resize — breakpoints at Fibonacci pixel values (233, 377, 610, 987, 1597)' },
    { name: 'Mutation Observer',  latin: 'OBSERVATOR MUTATIONIS',      intelligenceType: 'DOM mutation observation intelligence', sovereignPurpose: 'Golden mutation — DOM changes batched at Fibonacci-interval microtasks' },
    { name: 'Performance API',    latin: 'METRICA PRAESTATIONIS',      intelligenceType: 'Performance measurement intelligence',  sovereignPurpose: 'Golden metrics — performance budgets at φ-proportioned thresholds' },
  ],
};

// ══════════════════════════════════════════════════════════════════
//  GROUP NAMES
// ══════════════════════════════════════════════════════════════════

const GROUP_NAMES: string[] = [
  'MARKUP', 'STYLING', 'FRAMEWORK', 'STATE', 'BUILD',
  'TESTING', 'GRAPHICS', 'COMMUNICATION', 'STORAGE', 'WEB_API',
];

// ══════════════════════════════════════════════════════════════════
//  FRONTEND INTELLIGENCE REGISTRY
//  Real computed golden-math identity for every model
// ══════════════════════════════════════════════════════════════════

export class FrontendIntelligenceRegistry {
  readonly name = 'FRONTEND INTELLIGENCE REGISTRY';
  readonly designation = 'Registrum Intelligentiae Frontalis — 100 Frontend Intelligence Models';

  readonly models: FrontendIntelligenceModel[];
  readonly groups: string[];
  readonly totalModels: number;

  constructor() {
    this.groups = [...GROUP_NAMES];
    this.models = [];
    let globalId = 0;

    for (let g = 0; g < 10; g++) {
      const group = g as FrontendGroup;
      const rawList = MODELS[group];

      for (let idx = 0; idx < rawList.length; idx++) {
        const raw = rawList[idx];
        const n = globalId;

        // Golden-angle phyllotaxis position
        const angle = n * GOLDEN_ANGLE;
        const radius = Math.sqrt(n + 1);
        const phyllotaxisX = radius * Math.cos(angle);
        const phyllotaxisY = radius * Math.sin(angle);

        // φ-weight: normalized so it doesn't explode
        const phiWeight = Math.pow(PHI, (g * 10 + idx) / 20);

        // Fibonacci hash identity from name
        let nameHash = 0;
        for (let c = 0; c < raw.name.length; c++) {
          nameHash = ((nameHash << 5) - nameHash + raw.name.charCodeAt(c)) | 0;
        }
        const fibonacciIdentity = fibonacciHash(Math.abs(nameHash), 2147483647);

        // Dimensional plane: group mod 5
        const dimensionalPlane = (g % 5) as DimensionalPlane;

        this.models.push({
          id: globalId,
          name: raw.name,
          latinDesignation: raw.latin,
          group,
          groupName: this.groups[g],
          intelligenceType: raw.intelligenceType,
          sovereignPurpose: raw.sovereignPurpose,
          phiWeight,
          goldenAnglePosition: angle,
          fibonacciIdentity,
          phyllotaxisX,
          phyllotaxisY,
          dimensionalPlane,
        });

        globalId++;
      }
    }

    this.totalModels = globalId;
  }

  // ── Query Methods ──────────────────────────────────────────────

  /** Get all models in a group */
  byGroup(group: FrontendGroup): FrontendIntelligenceModel[] {
    return this.models.filter(m => m.group === group);
  }

  /** Get a model by name */
  byName(name: string): FrontendIntelligenceModel | undefined {
    return this.models.find(m =>
      m.name.toLowerCase() === name.toLowerCase(),
    );
  }

  /** Get a model by Fibonacci identity */
  byIdentity(identity: number): FrontendIntelligenceModel | undefined {
    return this.models.find(m => m.fibonacciIdentity === identity);
  }

  /** Get models sorted by φ-weight (highest authority first) */
  byWeight(): FrontendIntelligenceModel[] {
    return [...this.models].sort((a, b) => b.phiWeight - a.phiWeight);
  }

  /** Get models on a specific dimensional plane */
  byDimension(plane: DimensionalPlane): FrontendIntelligenceModel[] {
    return this.models.filter(m => m.dimensionalPlane === plane);
  }

  /** Compute total golden weight */
  totalGoldenWeight(): number {
    return this.models.reduce((sum, m) => sum + m.phiWeight, 0);
  }

  /** Compute group weights */
  groupWeights(): Array<{ group: string; weight: number; count: number }> {
    return this.groups.map((groupName, idx) => {
      const groupModels = this.byGroup(idx as FrontendGroup);
      return {
        group: groupName,
        weight: groupModels.reduce((sum, m) => sum + m.phiWeight, 0),
        count: groupModels.length,
      };
    });
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      total_models: this.totalModels,
      groups: this.groups.length,
      total_golden_weight: this.totalGoldenWeight(),
      group_weights: this.groupWeights(),
      sovereign_frequency: SOVEREIGN_FREQUENCY,
    };
  }
}
