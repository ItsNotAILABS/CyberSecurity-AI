///
/// @medina/medina-registry — Sovereign Private Registry
///
/// Your own npm/git for MEDINA SDKs. Not npmjs.com. Not GitHub.
/// YOUR infrastructure. YOUR control. YOUR sovereignty.
///
/// SDKs should be self-organizing — callable by the system itself,
/// living inside sovereign infrastructure.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

const PHI = 1.6180339887498948482;

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN REGISTRY
// ══════════════════════════════════════════════════════════════════

export class SovereignRegistry {
  constructor(name = 'MEDINA_REGISTRY') {
    this.name = name;
    this.packages = new Map();
    this.dependencies = new Map();
    this.publishCount = 0;
    this.installCount = 0;
    this.createdAt = Date.now();

    console.log(`📦 ${this.name} sovereign registry initialized`);

    // Pre-register core MEDINA SDKs
    this._registerCoreMedinaSDKs();
  }

  _registerCoreMedinaSDKs() {
    const coreSDKs = [
      { name: '@medina/medina-heart', version: '1.0.0', type: 'biological' },
      { name: '@medina/medina-registry', version: '1.0.0', type: 'infrastructure' },
      { name: '@medina/medina-timers', version: '1.0.0', type: 'temporal' },
      { name: '@medina/medina-calls', version: '1.0.0', type: 'operation' },
      { name: '@medina/medina-queries', version: '1.0.0', type: 'operation' },
      { name: '@medina/organism-bootstrap', version: '1.0.0', type: 'deployment' },
      { name: '@medina/medina-math', version: '1.0.0', type: 'mathematical' },
      { name: '@medina/medina-protocols', version: '1.0.0', type: 'coordination' },
      { name: '@medina/geometry-lock', version: '0.2.618', type: 'access-gate' },
      // ── Internal AI/AGI & Catalytic Converters ────────────────────────────
      { 
        name: '@medina/internal-ai', 
        version: '1.618.0', 
        type: 'internal-intelligence',
        purpose: 'Internal AI for organism support — already running, autonomous',
        components: ['InternalHeart', 'CatalyticConverter', 'InternalAI', 'OrganismHelper'],
        selfBootstrapping: true,
      },
      { 
        name: '@medina/internal-agi', 
        version: '1.618.0', 
        type: 'internal-general-intelligence',
        purpose: 'Internal AGI — General Intelligence for organism support',
        components: ['InternalAGI', 'OrganismAGIHelper', 'CatalyticArray', 'ReasoningEngine'],
        mathematics: 'Logos·Ethos·Pathos·Egos·Pythagorean·φ·Fibonacci',
        selfBootstrapping: true,
      },
      { 
        name: '@medina/catalytic-converter', 
        version: '1.618.0', 
        type: 'transformation-engine',
        purpose: 'Alchemical transformation — accelerates without being consumed',
        components: ['CatalyticConverter', 'AutomotiveCatalyticConverter', 'Catalyst'],
        alchemicalMetals: ['aurum', 'platinum', 'palladium', 'rhodium', 'argentum', 'copper', 'iron', 'lead'],
        neverDepletes: true,
      },
      // ── Latin-Named Internal AI/AGI Systems (3-4 letter names) ─────────────
      {
        name: '@medina/vex',
        version: '1.618.0',
        type: 'internal-ai-signal-routing',
        latin: 'Vexillum',
        meaning: 'Signal flag / Standard / Banner',
        purpose: 'Signal routing through golden-angle topology with catalytic amplification',
        components: ['Vex', 'Signal', 'SignalCatalyst', 'GoldenRouter', 'FibonacciQueue'],
        mathematics: 'GoldenAngle·FibonacciPriority·PythagoreanDistance·HarmonicAmplification',
        selfBootstrapping: true,
        neverDepletes: true,
      },
      {
        name: '@medina/nux',
        version: '1.618.0',
        type: 'internal-agi-core-processing',
        latin: 'Nucleus',
        meaning: 'Kernel / Core / Inner Seed',
        purpose: 'Multi-core AGI with nuclear fission/fusion catalysis (Tetractys: 1+2+3+4=10 cores)',
        components: ['Nux', 'NucleusCore', 'NuclearCatalyst'],
        mathematics: 'NuclearBinding·PythagoreanField·Tetractys·GoldenSpiral',
        selfBootstrapping: true,
        neverDepletes: true,
      },
      {
        name: '@medina/lux',
        version: '1.618.0',
        type: 'internal-ai-illumination',
        latin: 'Luminare',
        meaning: 'To Give Light / Illuminate',
        purpose: 'Pattern revelation through photonic catalysis across golden spectrum',
        components: ['Lux', 'Photon', 'PhotonicCatalyst'],
        mathematics: 'Electromagnetic·GoldenSpectrum·Interference·Polarization',
        selfBootstrapping: true,
        neverDepletes: true,
      },
      {
        name: '@medina/rex',
        version: '1.618.0',
        type: 'internal-agi-governance',
        latin: 'Regulus',
        meaning: 'Little King / Ruler / Regulator',
        purpose: 'Governance with Pythagorean justice (√(Law²+Equity²)) and Fibonacci voting',
        components: ['Rex', 'RegulatoryCatalyst'],
        mathematics: 'PythagoreanJustice·FibonacciVoting·RomanLaw·GoldenThreshold',
        selfBootstrapping: true,
        neverDepletes: true,
      },
      {
        name: '@medina/vox',
        version: '1.618.0',
        type: 'internal-ai-communication',
        latin: 'Vocalium',
        meaning: 'Voice / Word / Expression',
        purpose: 'Communication with harmonic catalytic resonance and Aristotelian rhetoric',
        components: ['Vox', 'HarmonicCatalyst'],
        mathematics: 'PythagoreanHarmonics·GoldenModulation·ZeckendorfFibonacci·LogosEthosPathos',
        selfBootstrapping: true,
        neverDepletes: true,
      },
      {
        name: '@medina/dux',
        version: '1.618.0',
        type: 'internal-agi-leadership',
        latin: 'Ductorium',
        meaning: 'Leader / Guide / Commander',
        purpose: 'Leadership via gradient descent with golden ratio resource allocation',
        components: ['Dux', 'DirectionalCatalyst'],
        mathematics: 'GradientDescent·GoldenAllocation·PythagoreanPath·FibonacciScheduling',
        selfBootstrapping: true,
        neverDepletes: true,
      },
      {
        name: '@medina/fax',
        version: '1.618.0',
        type: 'internal-ai-manufacturing',
        latin: 'Factorum',
        meaning: 'Of Making / Factory / Production',
        purpose: 'Manufacturing with industrial catalysis and Pythagorean quality control',
        components: ['Fax', 'IndustrialCatalyst'],
        mathematics: 'AssemblyPipeline·PythagoreanQuality·GoldenBatchSizing·FibonacciScheduling',
        selfBootstrapping: true,
        neverDepletes: true,
      },
      {
        name: '@medina/pax',
        version: '1.618.0',
        type: 'internal-agi-harmony',
        latin: 'Pacificorum',
        meaning: 'Peace / Harmony / Balance',
        purpose: 'Homeostatic equilibrium with golden mean convergence and Fibonacci damping',
        components: ['Pax', 'EquilibriumCatalyst'],
        mathematics: 'Homeostasis·PythagoreanBalance·GoldenMeanConvergence·FibonacciDamping',
        selfBootstrapping: true,
        neverDepletes: true,
      },
    ];

    // ── Five Major Nova Architecture Agents ────────────────────────────────
    const majorAgents = [
      {
        name:    '@medina/thesis-alpha',
        version: '1.0.618',
        type:    'research-division-agent',
        division: 'Research, IP, Proof, Publication, Notarization, Deployment Translation',
        engines: ['SENSUS', 'ANIMUS', 'CORPUS', 'MEMORIA'],
        cohort:  ['Quaestor','Iudex','Faber','Structor','Notarius','Custos','Archivista','Probator','Redactor'],
        mathematics: 'Pythagorean·φ·Aristotelian·Shannon·Fibonacci·Merkle·Mayan·Vitruvian',
      },
      {
        name:    '@medina/codex-phantasmatis',
        version: '1.0.618',
        type:    'implementation-execution-agent',
        division: 'Coding and Implementation-Heavy Execution Surface',
        mathematics: 'CyclomaticComplexity·Kolmogorov·Pythagorean·Fibonacci',
      },
      {
        name:    '@medina/civos-prime',
        version: '1.0.618',
        type:    'governing-orchestration-agent',
        division: 'High-Order Governing and Orchestration Surface',
        mathematics: 'Condorcet·BordaCount·φQuorum·RomanLawmaking·PythagoreanAuthority',
      },
      {
        name:    '@medina/auro',
        version: '1.0.618',
        type:    'native-speaking-intelligence',
        division: 'Native Speaking Intelligence — Sovereign Medina Voice',
        mathematics: 'Aristotelian·GoldenRatioPacing·PythagoreanHarmony·Kuramoto',
        bridgeLaw: 'External model output is never Medina-native without bridge review + validation',
      },
      {
        name:    '@medina/origo',
        version: '1.0.618',
        type:    'builder-operating-architect',
        division: 'Builder and Operating Architect — The Origin Point',
        mathematics: 'φSpiralPhyllotaxis·PythagoreanCoupling·EulerFormula·LawOfCosines',
      },
    ];

    for (const sdk of coreSDKs) {
      this._internalRegister(sdk);
    }

    for (const agent of majorAgents) {
      this._internalRegister(agent);
    }

    console.log(`   Pre-registered ${coreSDKs.length} core MEDINA SDKs + ${majorAgents.length} major Nova agents`);
  }

  _internalRegister(packageInfo) {
    const key = `${packageInfo.name}@${packageInfo.version}`;
    this.packages.set(key, {
      ...packageInfo,
      registeredAt: Date.now(),
      sovereign: true,
    });
  }

  // ── Publishing ─────────────────────────────────────────────────

  /**
   * Publish a package to the sovereign registry
   */
  publish(packageInfo) {
    const { name, version, type = 'unknown', dependencies = [] } = packageInfo;

    if (!name || !version) {
      throw new Error('Package name and version required');
    }

    const key = `${name}@${version}`;

    if (this.packages.has(key)) {
      console.warn(`⚠️  ${key} already published — skipping`);
      return { success: false, reason: 'already-exists', key };
    }

    const pkg = {
      name,
      version,
      type,
      dependencies,
      publishedAt: Date.now(),
      sovereign: true,
      phiHash: this._phiHash(key),
    };

    this.packages.set(key, pkg);
    this.publishCount++;

    // Track dependencies
    if (dependencies.length > 0) {
      this.dependencies.set(key, dependencies);
    }

    console.log(`📦 Published ${key} to sovereign registry`);

    return { success: true, key, pkg };
  }

  /**
   * Install a package from the sovereign registry
   */
  install(name, version = 'latest') {
    const key = version === 'latest'
      ? this._findLatestVersion(name)
      : `${name}@${version}`;

    if (!this.packages.has(key)) {
      throw new Error(`Package ${key} not found in sovereign registry`);
    }

    const pkg = this.packages.get(key);
    this.installCount++;

    console.log(`📦 Installed ${key} from sovereign registry`);

    // Recursively install dependencies
    const installedDeps = [];
    if (this.dependencies.has(key)) {
      for (const dep of this.dependencies.get(key)) {
        const depResult = this.install(dep.name, dep.version || 'latest');
        installedDeps.push(depResult);
      }
    }

    return {
      ...pkg,
      installedAt: Date.now(),
      dependencies: installedDeps,
    };
  }

  /**
   * List all packages in registry
   */
  list() {
    return Array.from(this.packages.entries()).map(([key, pkg]) => ({
      key,
      ...pkg,
    }));
  }

  /**
   * Search packages by name pattern
   */
  search(pattern) {
    const regex = new RegExp(pattern, 'i');
    return this.list().filter(pkg => regex.test(pkg.name));
  }

  /**
   * Get package info
   */
  info(name, version = 'latest') {
    const key = version === 'latest'
      ? this._findLatestVersion(name)
      : `${name}@${version}`;

    const pkg = this.packages.get(key);
    if (!pkg) return null;

    return {
      ...pkg,
      key,
      dependents: this._findDependents(key),
      dependencies: this.dependencies.get(key) || [],
    };
  }

  /**
   * Get registry statistics
   */
  stats() {
    return {
      name: this.name,
      totalPackages: this.packages.size,
      publishCount: this.publishCount,
      installCount: this.installCount,
      uptime: Date.now() - this.createdAt,
      sovereign: true,
      phiEncoded: true,
    };
  }

  // ── Helpers ────────────────────────────────────────────────────

  _findLatestVersion(name) {
    // Find all versions of this package
    const versions = [];
    for (const [key, pkg] of this.packages.entries()) {
      if (pkg.name === name) {
        versions.push({ key, version: pkg.version });
      }
    }

    if (versions.length === 0) {
      throw new Error(`Package ${name} not found in registry`);
    }

    // Sort by version (simple string sort for now)
    versions.sort((a, b) => b.version.localeCompare(a.version));

    return versions[0].key;
  }

  _findDependents(targetKey) {
    const dependents = [];

    for (const [key, deps] of this.dependencies.entries()) {
      for (const dep of deps) {
        const depKey = `${dep.name}@${dep.version || 'latest'}`;
        if (depKey === targetKey || dep.name === this.packages.get(targetKey)?.name) {
          dependents.push(key);
          break;
        }
      }
    }

    return dependents;
  }

  _phiHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      hash = ((hash * 31) + code) % 131072;
    }
    return Math.floor(hash * PHI) % 1000000;
  }
}

// ══════════════════════════════════════════════════════════════════
//  DISTRIBUTED REGISTRY SYNC
// ══════════════════════════════════════════════════════════════════

export class DistributedRegistrySync {
  constructor(localRegistry, peers = []) {
    this.local = localRegistry;
    this.peers = peers;
    this.syncCount = 0;
    this.lastSync = null;

    console.log(`🔄 Distributed sync enabled with ${peers.length} peers`);
  }

  /**
   * Sync packages with peer registries
   */
  async sync() {
    this.syncCount++;
    this.lastSync = Date.now();

    const localPackages = this.local.list();
    const syncResults = [];

    for (const peer of this.peers) {
      try {
        // In a real implementation, this would make network calls
        // For now, we simulate peer sync
        console.log(`🔄 Syncing with peer: ${peer.name || peer}`);

        syncResults.push({
          peer: peer.name || peer,
          success: true,
          packagesShared: localPackages.length,
        });
      } catch (error) {
        syncResults.push({
          peer: peer.name || peer,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      syncCount: this.syncCount,
      timestamp: this.lastSync,
      results: syncResults,
    };
  }

  addPeer(peer) {
    this.peers.push(peer);
    console.log(`🔄 Added peer: ${peer.name || peer}`);
  }

  removePeer(peerName) {
    const idx = this.peers.findIndex(p => (p.name || p) === peerName);
    if (idx >= 0) {
      this.peers.splice(idx, 1);
      console.log(`🔄 Removed peer: ${peerName}`);
    }
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY FUNCTION
// ══════════════════════════════════════════════════════════════════

/**
 * Create a sovereign registry
 */
export function createRegistry(name = 'MEDINA_REGISTRY', options = {}) {
  const registry = new SovereignRegistry(name);

  if (options.distributed && options.peers) {
    const sync = new DistributedRegistrySync(registry, options.peers);
    return { registry, sync };
  }

  return { registry };
}

// ══════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════

export default {
  SovereignRegistry,
  DistributedRegistrySync,
  createRegistry,
};
