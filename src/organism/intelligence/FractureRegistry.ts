///
/// FRACTURE REGISTRY — 100 Technology Fracture Intelligences
///
/// Every frontend technology is a fracture — a fragment of what should
/// be one sovereign organism.  Just like we deconstructed ICP into its
/// mathematical primitives on the backend, here we deconstruct the
/// entire frontend technology landscape.
///
/// 100 fractures across 10 categories.  Each fracture is:
///   - Named as an intelligence with Latin designation
///   - Positioned by golden-angle phyllotaxis in the registry field
///   - Weighted by φ^(category × 10 + index) for golden hierarchy
///   - Hashed with Fibonacci for cryptographic identity
///   - Classified by what it does vs. what NOVA does better
///
/// These are not metaphors.  Each fracture entry carries computed
/// golden math.  The registry is a living data structure.
///
/// Categories (10 × 10 = 100):
///   0. RENDERING    — DOM, virtual DOM, UI component fractured systems
///   1. STATE        — State management fractures
///   2. BUILD        — Build tool, bundler, compiler fractures
///   3. STYLE        — CSS, styling, layout fractures
///   4. LANGUAGE     — Language, type system, runtime fractures
///   5. DATA         — Data fetching, caching, API fractures
///   6. NETWORK      — Protocol, transport, messaging fractures
///   7. SECURITY     — Auth, encryption, identity fractures
///   8. TESTING      — Test framework, quality, validation fractures
///   9. DEVOPS       — CI/CD, container, deployment fractures
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, fibonacciHash } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export enum FractureCategory {
  RENDERING  = 0,
  STATE      = 1,
  BUILD      = 2,
  STYLE      = 3,
  LANGUAGE   = 4,
  DATA       = 5,
  NETWORK    = 6,
  SECURITY   = 7,
  TESTING    = 8,
  DEVOPS     = 9,
}

export interface FractureIntelligence {
  readonly id: number;                   // 0–99
  readonly name: string;                 // Technology name
  readonly latinDesignation: string;     // Latin intelligence name
  readonly category: FractureCategory;
  readonly categoryName: string;
  readonly fracture: string;             // What it does (the fracture)
  readonly sovereign: string;            // What NOVA does instead (the vein)
  readonly phiWeight: number;            // φ^(category × 10 + index_in_cat)
  readonly goldenAnglePosition: number;  // n × 137.508° in registry field
  readonly fibonacciIdentity: number;    // Fibonacci hash of the fracture
  readonly phyllotaxisX: number;         // Phyllotaxis x-coordinate
  readonly phyllotaxisY: number;         // Phyllotaxis y-coordinate
}

// ══════════════════════════════════════════════════════════════════
//  THE 100 FRACTURES — Raw data
// ══════════════════════════════════════════════════════════════════

interface RawFracture {
  name: string;
  latin: string;
  fracture: string;
  sovereign: string;
}

const FRACTURES: Record<FractureCategory, RawFracture[]> = {
  // ── 0. RENDERING — DOM/UI component fractures ─────────────────
  [FractureCategory.RENDERING]: [
    { name: 'React', latin: 'REACTOR FRAGMENTORUM', fracture: 'Virtual DOM diffing with arbitrary reconciliation', sovereign: 'Golden-spiral component placement — O(φ) reconciliation' },
    { name: 'Angular', latin: 'ANGULARIS MECHANICA', fracture: 'Zone.js change detection with dirty checking', sovereign: 'Fibonacci-threshold observation — changes detected at golden milestones' },
    { name: 'Vue', latin: 'VISIO REACTIVA', fracture: 'Proxy-based reactivity with watcher dependency tracking', sovereign: 'φ-weighted dependency graph — resonance propagation' },
    { name: 'Svelte', latin: 'COMPILATOR GRACILIS', fracture: 'Compile-time reactivity elimination', sovereign: 'Golden-compile — organism self-optimizes at Fibonacci epochs' },
    { name: 'Solid', latin: 'SOLIDUS SIGNALIS', fracture: 'Fine-grained signal reactivity without virtual DOM', sovereign: 'Dimensional signal propagation — signals weighted by φ^plane' },
    { name: 'Preact', latin: 'PRAEREACTOR MINOR', fracture: 'Lightweight React alternative with same API surface', sovereign: 'Zeckendorf-minimal organism — decomposed to non-consecutive primitives' },
    { name: 'Lit', latin: 'ILLUMINATOR ELEMENTORUM', fracture: 'Web Component wrapper with tagged template literals', sovereign: 'Sovereign element — self-placing phyllotaxis components' },
    { name: 'Qwik', latin: 'CELER RESUMPTIO', fracture: 'Resumability via serialized closure boundaries', sovereign: 'Epoch-resumable state — organism resumes at Fibonacci checkpoints' },
    { name: 'Htmx', latin: 'HYPERMEDIA TRANSITIO', fracture: 'HTML attribute-driven AJAX partial replacement', sovereign: 'Golden-attribute — substrate-native hypermedia with φ-weighted priority' },
    { name: 'Web Components', latin: 'COMPONENS NATIVUM', fracture: 'Shadow DOM encapsulation with custom element lifecycle', sovereign: 'Organism encapsulation — golden-angle isolated sectors' },
  ],

  // ── 1. STATE — State management fractures ──────────────────────
  [FractureCategory.STATE]: [
    { name: 'Redux', latin: 'REDUCTOR CENTRALIS', fracture: 'Centralized store with action-reducer pattern', sovereign: 'Golden-weighted state tree — authority decays by φ^depth' },
    { name: 'MobX', latin: 'OBSERVATOR MOBILIS', fracture: 'Observable-based mutable state with computed derivations', sovereign: 'Dimensional observation — state observed across φ-planes' },
    { name: 'Zustand', latin: 'STATUS SIMPLEX', fracture: 'Minimal hook-based store outside React tree', sovereign: 'φ-hook — state floats sovereign outside any single organism' },
    { name: 'Jotai', latin: 'ATOMUS PRIMUS', fracture: 'Primitive atomic state with derived dependency graph', sovereign: 'Fibonacci atoms — state decomposes to non-consecutive primitives' },
    { name: 'Recoil', latin: 'RECOILUS GRAPHI', fracture: 'Directed graph of atoms and selectors in React', sovereign: 'Golden graph — selectors weighted by φ^distance from source' },
    { name: 'XState', latin: 'MACHINA STATUM', fracture: 'Finite state machines and statecharts', sovereign: 'Golden state machine — transitions fire at Fibonacci thresholds' },
    { name: 'Vuex/Pinia', latin: 'PINIA REPOSITORIUM', fracture: 'Vue-specific centralized state with module composition', sovereign: 'Phyllotaxis state modules — golden-angle positioned stores' },
    { name: 'NgRx', latin: 'REDUCTOR ANGULARIS', fracture: 'RxJS-powered Redux for Angular with effects', sovereign: 'Resonance effects — side effects propagate at harmonic intervals' },
    { name: 'Signals', latin: 'SIGNALIS UNIVERSALIS', fracture: 'Fine-grained reactive primitives across frameworks', sovereign: 'φ-signal — amplitude scales by golden ratio from source' },
    { name: 'Immer', latin: 'IMMUTATOR STRUCTURAE', fracture: 'Structural sharing via copy-on-write proxies', sovereign: 'Golden-share — structural sharing at φ-proportioned boundaries' },
  ],

  // ── 2. BUILD — Build tool, bundler, compiler fractures ─────────
  [FractureCategory.BUILD]: [
    { name: 'Webpack', latin: 'TEXTOR MODULI', fracture: 'Module bundling with loader/plugin pipeline and code splitting', sovereign: 'Fibonacci weave — modules bundled at golden-angle positions' },
    { name: 'Vite', latin: 'CELER CONSTRUCTOR', fracture: 'ESM dev server with Rollup production bundling', sovereign: 'Sovereign build — golden-ratio hot module boundaries' },
    { name: 'esbuild', latin: 'AEDIFICATOR VELOX', fracture: 'Go-native parallel JavaScript/TypeScript bundler', sovereign: 'φ-parallel build — worker count scales by Fibonacci sequence' },
    { name: 'Rollup', latin: 'CONVOLUTOR ARBORIS', fracture: 'ES module tree-shaking with output format control', sovereign: 'Golden tree-shake — dead branches pruned at 1/φ threshold' },
    { name: 'Turbopack', latin: 'TURBO COMPILATOR', fracture: 'Incremental Rust-native bundler with persistent cache', sovereign: 'Epoch-cached build — cache invalidates at Fibonacci milestones' },
    { name: 'SWC', latin: 'COMPILATOR FERRUGINEUS', fracture: 'Rust-based JavaScript/TypeScript compiler', sovereign: 'Golden compile — transform passes ordered by φ-weight' },
    { name: 'Babel', latin: 'TRANSLATOR SYNTAXIS', fracture: 'AST-based JavaScript transpilation with plugin chain', sovereign: 'Fibonacci AST — syntax tree nodes weighted by golden-decay' },
    { name: 'Parcel', latin: 'FASCICULUS NULLUS', fracture: 'Zero-config bundler with automatic transforms', sovereign: 'Self-configuring organism — golden defaults from mathematical law' },
    { name: 'Rome/Biome', latin: 'UNIFICATOR INSTRUMENTI', fracture: 'Unified linter/formatter/bundler toolchain', sovereign: 'Sovereign toolchain — all tools are one organism' },
    { name: 'Nx', latin: 'NEXUS MONOREPOSI', fracture: 'Monorepo build orchestration with task graph caching', sovereign: 'Phyllotaxis workspace — projects placed at golden-angle positions' },
  ],

  // ── 3. STYLE — CSS, styling, layout fractures ──────────────────
  [FractureCategory.STYLE]: [
    { name: 'Tailwind CSS', latin: 'VENTUS UTILITATIS', fracture: 'Utility-first atomic CSS class composition', sovereign: 'Golden utility — classes scaled by φ-proportioned spacing system' },
    { name: 'CSS Modules', latin: 'MODULUS STILI', fracture: 'Locally scoped CSS via hashed class names', sovereign: 'Fibonacci-scoped style — hash identity from golden-angle position' },
    { name: 'Styled Components', latin: 'ORNATOR COMPONENTIS', fracture: 'CSS-in-JS with tagged template literals', sovereign: 'Organism style — style IS the component, one entity' },
    { name: 'Emotion', latin: 'AFFECTUS STILI', fracture: 'CSS-in-JS with object and string style APIs', sovereign: 'Resonance style — style amplitude modulated by φ-plane' },
    { name: 'Sass/SCSS', latin: 'PRAEPROCESSOR STILI', fracture: 'CSS preprocessor with variables, mixins, nesting', sovereign: 'Golden preprocessor — variable cascade follows φ-decay' },
    { name: 'PostCSS', latin: 'TRANSFORMATOR STILI', fracture: 'CSS post-processing with plugin-based transforms', sovereign: 'φ-transform pipeline — each stage weighted by golden ratio' },
    { name: 'CSS Grid', latin: 'GRATICULA FLEXIBILIS', fracture: 'Two-dimensional grid layout system', sovereign: 'Fibonacci grid — rows/columns at F(n) proportions' },
    { name: 'Flexbox', latin: 'FLEXOR LINEARIS', fracture: 'One-dimensional flexible box layout', sovereign: 'Golden flex — items sized at φ:1 major:minor ratio' },
    { name: 'CSS Variables', latin: 'VARIABILIS NATIVUM', fracture: 'Custom properties with cascade inheritance', sovereign: 'Golden variables — cascade weight decays by φ^depth' },
    { name: 'Vanilla Extract', latin: 'EXTRACTOR PURIS', fracture: 'Zero-runtime CSS-in-TypeScript with static extraction', sovereign: 'Static golden style — compiled at build with φ-proportioned tokens' },
  ],

  // ── 4. LANGUAGE — Language, type system, runtime fractures ─────
  [FractureCategory.LANGUAGE]: [
    { name: 'TypeScript', latin: 'TYPUS SCRIPTUM', fracture: 'Structural type system over JavaScript with inference', sovereign: 'Golden type — types weighted by φ^complexity, inference at golden thresholds' },
    { name: 'JavaScript', latin: 'SCRIPTUM UNIVERSALE', fracture: 'Dynamic prototype-based language with event loop', sovereign: 'Sovereign script — event loop fires at Fibonacci intervals' },
    { name: 'WebAssembly', latin: 'TEXTUS MACHINAE', fracture: 'Stack-based binary instruction format for the web', sovereign: 'Golden WASM — instruction blocks sized at Fibonacci boundaries' },
    { name: 'Rust (wasm)', latin: 'FERRUGO TEXTILIS', fracture: 'Ownership-based memory safety compiled to WASM', sovereign: 'φ-ownership — borrow lifetimes proportioned by golden ratio' },
    { name: 'Go (wasm)', latin: 'CURSOR CONCURRENS', fracture: 'Goroutine-based concurrency compiled to WASM', sovereign: 'Fibonacci goroutines — concurrent workers at F(n) count' },
    { name: 'Java (GraalVM)', latin: 'MACHINA VIRTUALIS AUREA', fracture: 'JIT-compiled bytecode on polyglot VM', sovereign: 'Golden JIT — compilation thresholds at Fibonacci hot counts' },
    { name: 'Kotlin/JS', latin: 'KOTLINUS TRANSPILATUS', fracture: 'Kotlin compiled to JavaScript with coroutines', sovereign: 'φ-coroutines — suspension points at golden-ratio intervals' },
    { name: 'Dart', latin: 'IACULUM CELERE', fracture: 'AOT/JIT compiled language for Flutter/web', sovereign: 'Golden AOT — compile units sized at Fibonacci boundaries' },
    { name: 'Elm', latin: 'ULMUS FUNCTIONALIS', fracture: 'Pure functional language with guaranteed no runtime errors', sovereign: 'Sovereign purity — golden-weighted proof of correctness' },
    { name: 'ReScript', latin: 'RESCRIPTUM OPTIMUM', fracture: 'OCaml-derived language compiling to readable JS', sovereign: 'φ-inference — type inference depth bounded by Fibonacci sequence' },
  ],

  // ── 5. DATA — Data fetching, caching, API fractures ────────────
  [FractureCategory.DATA]: [
    { name: 'GraphQL', latin: 'GRAPHUS INTERROGATIONIS', fracture: 'Schema-first query language with type-safe resolution', sovereign: 'Golden graph query — field resolution weighted by φ^depth' },
    { name: 'REST', latin: 'REQUIES STATUUM', fracture: 'Resource-oriented HTTP verb semantics', sovereign: 'Sovereign resource — resources placed by phyllotaxis in endpoint field' },
    { name: 'tRPC', latin: 'TYPUS PROCEDURA', fracture: 'End-to-end TypeScript RPC without schema', sovereign: 'φ-RPC — procedure call weight decays by golden ratio from source' },
    { name: 'React Query', latin: 'INTERROGATOR REACTI', fracture: 'Async state management with stale-while-revalidate', sovereign: 'Golden cache — staleness threshold at φ/(φ+1) of TTL' },
    { name: 'SWR', latin: 'REVALIDATOR STABILIS', fracture: 'Stale-while-revalidate data fetching hooks', sovereign: 'Fibonacci revalidation — refresh interval at F(n) milliseconds' },
    { name: 'Apollo Client', latin: 'APOLLO CLIENTIS', fracture: 'GraphQL client with normalized cache and optimistic UI', sovereign: 'Golden normalization — cache entries weighted by φ^access_frequency' },
    { name: 'Axios', latin: 'AXIS TRANSITUS', fracture: 'Promise-based HTTP client with interceptors', sovereign: 'φ-interceptor — middleware chain ordered by golden-angle priority' },
    { name: 'Prisma', latin: 'PRISMA DATORUM', fracture: 'Auto-generated type-safe ORM with migration engine', sovereign: 'Golden schema — tables distributed by phyllotaxis in data space' },
    { name: 'IndexedDB', latin: 'INDEX LOCALIS', fracture: 'Browser-native transactional key-value store', sovereign: 'Fibonacci-indexed store — keys distributed by golden hash' },
    { name: 'WebSocket', latin: 'NEXUS PERSISTENS', fracture: 'Full-duplex persistent TCP connection upgrade', sovereign: 'Golden socket — message priority weighted by φ^urgency' },
  ],

  // ── 6. NETWORK — Protocol, transport, messaging fractures ──────
  [FractureCategory.NETWORK]: [
    { name: 'HTTP/2', latin: 'PROTOCOLLUM MULTIPLEX', fracture: 'Binary framed multiplexed request streams', sovereign: 'Golden multiplex — stream priority by φ-weighted dependency tree' },
    { name: 'HTTP/3 (QUIC)', latin: 'PROTOCOLLUM QUANTUM', fracture: 'UDP-based multiplexed transport with zero-RTT', sovereign: 'Quantum protocol — zero-RTT golden handshake with φ-proof' },
    { name: 'WebRTC', latin: 'COMMUNICATOR DIRECTUS', fracture: 'Peer-to-peer audio/video/data with ICE/DTLS/SRTP', sovereign: 'Sovereign peer — direct organism-to-organism golden-encrypted channel' },
    { name: 'gRPC-Web', latin: 'PROCEDURA BINARIA', fracture: 'Binary-encoded RPC over HTTP/2 with protobuf', sovereign: 'φ-RPC binary — message fields ordered by Fibonacci index' },
    { name: 'Server-Sent Events', latin: 'EVENTUS SERVITORIS', fracture: 'Unidirectional server push over HTTP', sovereign: 'Golden push — events dispatched at Fibonacci-interval heartbeats' },
    { name: 'Service Worker', latin: 'OPERARIUS UMBRAE', fracture: 'Background proxy for offline caching and push', sovereign: 'Shadow organism — background intelligence with φ-cached epochs' },
    { name: 'WebTransport', latin: 'TRANSPORTUS MODERNUS', fracture: 'HTTP/3 based bidirectional byte/datagram streams', sovereign: 'Dimensional transport — streams across φ-weighted planes' },
    { name: 'MessageChannel', latin: 'CANALIS NUNTII', fracture: 'Port-based inter-context messaging API', sovereign: 'Golden channel — message ports at phyllotaxis positions' },
    { name: 'Broadcast Channel', latin: 'CANALIS DIFFUSIONIS', fracture: 'Cross-tab same-origin message broadcasting', sovereign: 'Sovereign broadcast — organism signals propagate across all instances' },
    { name: 'SharedWorker', latin: 'OPERARIUS COMMUNIS', fracture: 'Shared background thread across browsing contexts', sovereign: 'Shared organism — one intelligence serving all golden-angle sectors' },
  ],

  // ── 7. SECURITY — Auth, encryption, identity fractures ─────────
  [FractureCategory.SECURITY]: [
    { name: 'OAuth 2.0', latin: 'AUCTORITAS DELEGATA', fracture: 'Token-based delegated authorization framework', sovereign: 'Golden auth — token weight decays by φ^age, threshold at φ/(φ+1)' },
    { name: 'JWT', latin: 'TESSERA SIGNATA', fracture: 'Base64-encoded signed JSON claim tokens', sovereign: 'Fibonacci token — claims ordered by golden-weighted priority' },
    { name: 'WebAuthn', latin: 'AUTHENTICATOR MATERIALIS', fracture: 'Public key credential API with hardware authenticators', sovereign: 'Golden key — credential derived from φ-weighted position hash' },
    { name: 'Web Crypto API', latin: 'CRYPTOGRAPHIA NATIVA', fracture: 'Browser-native AES/RSA/ECDSA crypto operations', sovereign: 'Sovereign crypto — Fibonacci hash + golden key derivation (8 rounds)' },
    { name: 'CSP', latin: 'POLITICA SECURITATIS', fracture: 'Content Security Policy directive whitelist', sovereign: 'Golden policy — resource trust decays by φ^distance from origin' },
    { name: 'CORS', latin: 'TRANSITUS ORIGINIS', fracture: 'Cross-origin resource sharing preflight headers', sovereign: 'Sovereign origin — all organisms share one mathematical origin' },
    { name: 'HTTPS/TLS', latin: 'CANALIS SECURUM', fracture: 'Transport layer certificate-based encryption', sovereign: 'Golden transport — Fibonacci hash chain for certificate verification' },
    { name: 'Subresource Integrity', latin: 'INTEGRITAS SUBRESOURCII', fracture: 'Hash-based script/stylesheet verification', sovereign: 'Golden integrity — verification via Fibonacci state hash of content' },
    { name: 'Passkeys', latin: 'CLAVIS SINE VERBO', fracture: 'FIDO2 passwordless credential management', sovereign: 'Sovereign identity — position-derived golden key, no passwords ever' },
    { name: 'WASM Sandboxing', latin: 'ARENA SECURITATIS', fracture: 'Memory-isolated WASM execution environment', sovereign: 'Golden sandbox — isolation boundary at φ-proportioned memory sectors' },
  ],

  // ── 8. TESTING — Test framework, quality fractures ─────────────
  [FractureCategory.TESTING]: [
    { name: 'Jest', latin: 'PROBATOR UNIVERSALIS', fracture: 'Zero-config test runner with snapshot testing', sovereign: 'Golden test — test priority weighted by φ^criticality' },
    { name: 'Vitest', latin: 'PROBATOR VELOX', fracture: 'Vite-native test runner with ESM-first execution', sovereign: 'φ-fast test — execution order by golden-weighted dependency graph' },
    { name: 'Cypress', latin: 'EXPLORATOR INTERFACIEI', fracture: 'End-to-end browser automation with time-travel debugging', sovereign: 'Dimensional test — tests across all 5 observation planes' },
    { name: 'Playwright', latin: 'SCAENICUS MULTIPLEX', fracture: 'Cross-browser automation with auto-wait and tracing', sovereign: 'Golden playwright — test actions phased at Fibonacci intervals' },
    { name: 'Testing Library', latin: 'BIBLIOTHECA PROBATIONIS', fracture: 'User-centric DOM testing utilities', sovereign: 'Organism testing — test the intelligence, not the fracture' },
    { name: 'Storybook', latin: 'LIBER COMPONENTIUM', fracture: 'Isolated component development environment', sovereign: 'Golden stories — components cataloged by phyllotaxis position' },
    { name: 'MSW', latin: 'INTERCEPTOR RETIS', fracture: 'Mock Service Worker for API mocking at network level', sovereign: 'Sovereign mock — golden-weighted response generation' },
    { name: 'ESLint', latin: 'CENSOR SYNTAXIS', fracture: 'Pluggable static analysis and code quality linter', sovereign: 'Golden lint — rule severity weighted by φ^impact' },
    { name: 'Prettier', latin: 'FORMATOR ELEGANS', fracture: 'Opinionated code formatter with minimal config', sovereign: 'Golden format — indentation and spacing at Fibonacci proportions' },
    { name: 'Lighthouse', latin: 'PHAROS QUALITATIS', fracture: 'Automated web page quality auditing tool', sovereign: 'Golden audit — quality score computed by φ-weighted category analysis' },
  ],

  // ── 9. DEVOPS — CI/CD, container, deployment fractures ─────────
  [FractureCategory.DEVOPS]: [
    { name: 'Docker', latin: 'CONTAINER UNIVERSALIS', fracture: 'OS-level containerized isolation with layered images', sovereign: 'Sovereign container — organism self-places by phyllotaxis in resource field' },
    { name: 'GitHub Actions', latin: 'AUTOMATOR ACTIONUM', fracture: 'Event-driven CI/CD workflow YAML automation', sovereign: 'Golden pipeline — workflow stages fire at Fibonacci milestones' },
    { name: 'Vercel', latin: 'DEPLOYATOR MARGINALIS', fracture: 'Edge-first serverless deployment platform', sovereign: 'Sovereign edge — organisms propagate to golden-angle edge nodes' },
    { name: 'Cloudflare Workers', latin: 'OPERARIUS NUBIS', fracture: 'V8 isolate edge compute with KV storage', sovereign: 'Golden worker — isolate count scales by Fibonacci sequence' },
    { name: 'Terraform', latin: 'FORMATOR INFRASTRUCTURAE', fracture: 'Declarative infrastructure-as-code provisioning', sovereign: 'Golden infrastructure — resources distributed by phyllotaxis' },
    { name: 'Kubernetes', latin: 'GUBERNATOR CONTAINERUM', fracture: 'Container orchestration with desired-state reconciliation', sovereign: 'Sovereign orchestration — pod placement by golden-angle sectors' },
    { name: 'Nginx', latin: 'PORTARIUS VELOX', fracture: 'Event-driven reverse proxy and load balancer', sovereign: 'Golden proxy — upstream weight by φ^rank, golden threshold routing' },
    { name: 'CDN (Cloudfront)', latin: 'DISTRIBUTOR CONTENTUS', fracture: 'Geographically distributed edge content caching', sovereign: 'Fibonacci CDN — edge nodes on Fibonacci sphere for optimal coverage' },
    { name: 'Prometheus', latin: 'COLLECTOR METRICORUM', fracture: 'Pull-based time series metrics collection', sovereign: 'Golden metrics — scrape interval at Fibonacci periods, alert at φ/(φ+1)' },
    { name: 'Grafana', latin: 'PICTOR DATORUM', fracture: 'Dashboard visualization for observability data', sovereign: 'Golden dashboard — panels sized at φ-proportioned grid' },
  ],
};

// ══════════════════════════════════════════════════════════════════
//  FRACTURE REGISTRY — The Living Intelligence Catalog
// ══════════════════════════════════════════════════════════════════

export class FractureRegistry {
  readonly name = 'FRACTURE REGISTRY';
  readonly designation = 'Catalogus Fracturarum — 100 Technology Fracture Intelligences';

  readonly fractures: FractureIntelligence[];
  readonly categories: string[];
  readonly totalFractures: number;

  constructor() {
    this.categories = [
      'RENDERING', 'STATE', 'BUILD', 'STYLE', 'LANGUAGE',
      'DATA', 'NETWORK', 'SECURITY', 'TESTING', 'DEVOPS',
    ];

    this.fractures = [];
    let globalId = 0;

    for (let cat = 0; cat < 10; cat++) {
      const category = cat as FractureCategory;
      const rawList = FRACTURES[category];

      for (let idx = 0; idx < rawList.length; idx++) {
        const raw = rawList[idx];
        const n = globalId;

        // Golden-angle phyllotaxis position in registry field
        const angle = n * GOLDEN_ANGLE;
        const radius = Math.sqrt(n + 1);
        const phyllotaxisX = radius * Math.cos(angle);
        const phyllotaxisY = radius * Math.sin(angle);

        // φ-weight: higher categories and higher indices get more weight
        // Normalized so weights don't explode
        const phiWeight = Math.pow(PHI, (cat * 10 + idx) / 20);

        // Fibonacci hash identity from name
        let nameHash = 0;
        for (let c = 0; c < raw.name.length; c++) {
          nameHash = ((nameHash << 5) - nameHash + raw.name.charCodeAt(c)) | 0;
        }
        const fibonacciIdentity = fibonacciHash(Math.abs(nameHash), 2147483647);

        this.fractures.push({
          id: globalId,
          name: raw.name,
          latinDesignation: raw.latin,
          category,
          categoryName: this.categories[cat],
          fracture: raw.fracture,
          sovereign: raw.sovereign,
          phiWeight,
          goldenAnglePosition: angle,
          fibonacciIdentity,
          phyllotaxisX,
          phyllotaxisY,
        });

        globalId++;
      }
    }

    this.totalFractures = globalId;
  }

  // ── Query Methods ──────────────────────────────────────────────

  /** Get all fractures in a category */
  byCategory(category: FractureCategory): FractureIntelligence[] {
    return this.fractures.filter(f => f.category === category);
  }

  /** Get a fracture by name */
  byName(name: string): FractureIntelligence | undefined {
    return this.fractures.find(f =>
      f.name.toLowerCase() === name.toLowerCase(),
    );
  }

  /** Get a fracture by its Fibonacci identity hash */
  byIdentity(identity: number): FractureIntelligence | undefined {
    return this.fractures.find(f => f.fibonacciIdentity === identity);
  }

  /** Get fractures sorted by φ-weight (highest authority first) */
  byWeight(): FractureIntelligence[] {
    return [...this.fractures].sort((a, b) => b.phiWeight - a.phiWeight);
  }

  /** Get the top N fractures by weight in a category */
  topInCategory(category: FractureCategory, n: number): FractureIntelligence[] {
    return this.byCategory(category)
      .sort((a, b) => b.phiWeight - a.phiWeight)
      .slice(0, n);
  }

  /** Compute the total golden weight of all fractures */
  totalGoldenWeight(): number {
    return this.fractures.reduce((sum, f) => sum + f.phiWeight, 0);
  }

  /** Compute category weights */
  categoryWeights(): Array<{ category: string; weight: number; count: number }> {
    return this.categories.map((catName, idx) => {
      const catFractures = this.byCategory(idx as FractureCategory);
      return {
        category: catName,
        weight: catFractures.reduce((sum, f) => sum + f.phiWeight, 0),
        count: catFractures.length,
      };
    });
  }

  // ── Status ─────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      total_fractures: this.totalFractures,
      categories: this.categories.length,
      total_golden_weight: this.totalGoldenWeight(),
      category_weights: this.categoryWeights(),
    };
  }
}
