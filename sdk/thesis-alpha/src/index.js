///
/// @medina/thesis-alpha — THESIS Alpha
///
/// THESIS is the Medina Research, IP, Proof, Publication, Notarization,
/// and Deployment Translation Division Agent.
///
/// It is NOT a paper writer. NOT a documentation bot. NOT a marketing assistant.
///
/// THESIS converts Medina intelligence into:
///   • defensible research
///   • protected intellectual property
///   • print-ready artifacts
///   • proof-backed claims
///   • notarization packets
///   • deployment blueprints
///   • code-backed packet bundles
///   • archive-grade publication artifacts
///
/// Core line:
///   Auro speaks. Origo builds.
///   THESIS proves, protects, hashes, prints, notarizes,
///   and prepares Medina research for deployment.
///
/// Internal engines:
///   SENSUS Engine  — perception and substrate classification
///   ANIMUS Engine  — curiosity, intent, and edge pressure
///   CORPUS Engine  — execution and artifact body generation
///   MEMORIA Engine — memory, lineage, and consequence
///
/// Major agents in the broader Nova family (not this agent):
///   Codex Phantasmatis — coding and implementation-heavy execution surface
///   CIVOS-PRIME        — high-order governing or orchestration surface
///   AURO               — native speaking intelligence
///   ORIGO              — builder / operating architect
///
/// Mathematical foundations (all formulas implemented in engine modules):
///   • φ = (1+√5)/2 — golden ratio (all weighting and timing)
///   • Pythagorean theorem: a² + b² = c² (coherence, phase distance, completeness)
///   • Kuramoto order parameter: R·e^(iΨ) = (1/N)·Σe^(iθⱼ) (synchrony gate)
///   • Aristotelian rhetoric: Logos·φ + Ethos·1 + Pathos·φ⁻¹ (claim scoring)
///   • Shannon entropy: H = −Σ p(x)·log₂(p(x)) (information gain, curiosity)
///   • Fibonacci: F(n) = F(n-1)+F(n-2) (versioning, dwell gates)
///   • Merkle tree: hash(left ∥ right) (artifact integrity chains)
///   • Mayan calendar cycle: epoch = ⌊t/MAYAN_MS⌋ (lineage temporal tracking)
///   • Vitruvian proportions: √(F² + U² + V²)/√3 (packet completeness)
///
/// Runtime laws:
///   • Nova Root governs runtime authority
///   • Memory Runtime owns canonical memory (append-only)
///   • Active State Runtime performs live action
///   • Foundation Floor handles heavy compute (may NOT write canonical memory)
///   • SENSUS classifies before any artifact generation begins
///   • ANIMUS pressure-tests before closure
///   • CORPUS assembles through structured artifacts
///   • MEMORIA owns lineage continuity
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { SensusEngine }                    from './sensus-engine.js';
import { AnimusEngine }                    from './animus-engine.js';
import { CorpusEngine }                    from './corpus-engine.js';
import { MemoriaEngine }                   from './memoria-engine.js';
import { WorkingCohort }                   from './working-cohort.js';
import { HashManifest, AuthorityStateManager } from './hash-manifest.js';
import { SurfaceRouter, LifecycleStateMachine } from './surface-router.js';
import {
  PHI, PHI_INV, PHI_HEARTBEAT_MS, FIBONACCI,
  CLAIM_CLASS, EVIDENCE_CLASS, AUTHORITY_STATE,
  LIFECYCLE, LIFECYCLE_TERMINALS, SUBSTRATE_TYPE,
  SURFACE, COHORT_ROLE, RUNTIME_LAYER,
} from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════
//  THESIS ALPHA — Main Agent
// ═══════════════════════════════════════════════════════════════════════════

export class ThesisAlpha {
  /**
   * @param {object} [opts]
   * @param {string} [opts.agentId]       — agent identifier
   * @param {string[]} [opts.cohortRoles]  — override default cohort roles
   */
  constructor({ agentId = 'THESIS-ALPHA', cohortRoles } = {}) {
    this.agentId   = agentId;
    this.birthTime = Date.now();
    this.runCount  = 0;

    // ★ Self-bootstrapping — all engines come alive in constructor, no .start() needed

    // Internal engines
    this.sensus   = new SensusEngine({ agentId });
    this.animus   = new AnimusEngine({ agentId });
    this.corpus   = new CorpusEngine({ agentId });
    this.memoria  = new MemoriaEngine({ agentId });

    // Surface router
    this.router   = new SurfaceRouter({ agentId });

    // Working cohort (full by default)
    this.cohort   = new WorkingCohort(cohortRoles || Object.values(COHORT_ROLE));

    // Active packet registry
    this.packets  = new Map();   // packetId → { packet, lifecycle, authority, hashManifest }
    this.modeLog  = [];

    console.log(
      `\n🎓 THESIS ALPHA awakened | agentId=${agentId}\n` +
      `   Engines: SENSUS | ANIMUS | CORPUS | MEMORIA\n` +
      `   Cohort:  ${Object.keys(this.cohort.members).join(' | ')}\n` +
      `   φ=${PHI.toFixed(10)} | EMERGENCE_THRESHOLD=${PHI_INV.toFixed(10)}\n`
    );
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  PRIMARY OPERATOR COMMANDS
  // ═══════════════════════════════════════════════════════════════════════

  /**
   * THESIS expand this into a research packet.
   *
   * Full pipeline:
   *   1. SENSUS classifies substrate
   *   2. ANIMUS runs 12-step curiosity expansion
   *   3. Cohort: Iudex critiques, Custos guards boundary
   *   4. CORPUS assembles packet
   *   5. MEMORIA appends lineage
   *   6. Returns complete THESIS packet
   *
   * @param {object} input
   * @param {string} input.rawInput          — raw text or research draft
   * @param {string} [input.title]           — artifact title
   * @param {object[]} [input.claims]        — pre-identified claims [{text, claimClass, evidenceClass}]
   * @param {object[]} [input.evidence]      — pre-identified evidence [{description, evidenceClass, linkedClaims}]
   * @param {object}  [input.hints]          — SENSUS hints
   * @returns {ThesisRunResult}
   */
  async expand(input = {}) {
    this.runCount++;
    this._logMode('RESEARCH_EXPANSION', input.title || 'untitled');

    const {
      rawInput   = '',
      title      = `Research Packet #${this.runCount}`,
      claims     = [],
      evidence   = [],
      hints      = {},
    } = input;

    // ── Surface: SOURCE
    this.router.enterSurface(SURFACE.SOURCE);
    const sensusResult = this.sensus.classify(rawInput, hints);
    this.router.exitSurface(SURFACE.SOURCE, { sensusResult });

    // ── ANIMUS: 12-step curiosity expansion
    const animusExpansion = this.animus.expand({
      obviousThesis:     rawInput.slice(0, 300),
      existingClaims:    claims.map(c => `${c.claimClass || 'C3'}:${c.text?.slice(0, 50) || ''}`),
      existingEvidence:  evidence.map(e => e.evidenceClass || 'E0'),
      sensusResult,
    });

    // ── Cohort: Iudex critique (pre-assembly)
    const routePlan = this.router.planRoute({
      substrateType:   sensusResult.substrateType,
      privateCore:     sensusResult.privateCore,
      needsDeployment: animusExpansion.step11_deploymentPath.needed,
      needsNotary:     animusExpansion.step10_notaryCandidates.highPriority,
    });

    // ── Surface: FORGE
    this.router.enterSurface(SURFACE.FORGE);
    const packet = this.corpus.assemblePacket({
      title,
      rawInput,
      sensusResult,
      animusExpansion,
      claimsMatrix:  claims,
      evidenceMatrix: evidence,
    });
    this.router.exitSurface(SURFACE.FORGE, { packetId: packet.packetId });

    // ── Cohort: Custos boundary guard + Iudex critique (post-assembly)
    const custosResult = this.cohort.custos_guardBoundary(packet, sensusResult);
    const iudexResult  = this.cohort.iudex_critique(packet, animusExpansion);

    // ── Build authority state manager
    const authority = new AuthorityStateManager({
      packetId: packet.packetId,
      initialState: packet.authorityState,
    });

    // Auto-advance to INTERNAL_RESEARCH if gate clears
    if (!sensusResult.privateCore) {
      authority.promoteToInternalResearch();
    }

    // ── MEMORIA: append lineage
    const memoriaEntry = this.memoria.append(
      { ...packet, sensusResult },
      { title, cohort: true },
      'THESIS-ALPHA',
    );

    // ── Cohort: Archivista archive prep
    const archiveEntry = this.cohort.archivista_prepareArchive(packet, memoriaEntry);

    // ── Register packet
    this.packets.set(packet.packetId, {
      packet,
      lifecycle:    null,
      authority,
      hashManifest: null,
      memoriaEntry,
    });

    const result = {
      packetId:        packet.packetId,
      version:         packet.version,
      title,
      authorityState:  authority.getState(),
      sensusResult,
      animusExpansion,
      packet,
      custosResult,
      iudexResult,
      archiveEntry,
      memoriaEntry,
      routePlan,
      completeness:    packet.completeness,
    };

    console.log(`\n✅ THESIS expand complete | id=${packet.packetId} | state=${authority.getState()} | completeness=${packet.completeness.score.toFixed(4)}\n`);
    return result;
  }

  // ─── THESIS classify claims ────────────────────────────────────────────

  /**
   * THESIS classify claims in this paper.
   * Hardened: every claim gets a class, evidence floor check, and release gate.
   */
  classifyClaims(rawText, claims = []) {
    this._logMode('CLAIM_HARDENING', 'classify_claims');

    const sensusResult = this.sensus.classify(rawText);
    const evidenceClasses = claims.map(c => c.evidenceClass || 'E0');

    const classified = claims.map((claim, idx) => {
      const claimClass  = claim.claimClass || 'C3';
      const evClass     = claim.evidenceClass || 'E0';

      return {
        id:            `CLM-${String(idx + 1).padStart(3, '0')}`,
        text:          claim.text || '',
        claimClass,
        claimLabel:    CLAIM_CLASS[claimClass] || claimClass,
        releaseRule:   this._getReleaseRule(claimClass),
        evidenceClass: evClass,
        evidenceLabel: EVIDENCE_CLASS[evClass] || evClass,
        supported:     this._isSupported(claimClass, evClass),
        blocked:       !this._isSupported(claimClass, evClass),
        publicSafe:    this._isPublicSafe(claimClass, evClass, sensusResult.privateCore),
      };
    });

    return {
      substrate:       sensusResult.substrateType,
      totalClaims:     classified.length,
      supported:       classified.filter(c => c.supported).length,
      publicSafe:      classified.filter(c => c.publicSafe).length,
      blocked:         classified.filter(c => c.blocked).length,
      classified,
    };
  }

  // ─── THESIS create hash and notary packet ─────────────────────────────

  /**
   * THESIS create hash and notary packet.
   * Builds HashManifest and prepares Notarius packet.
   */
  async hashAndNotary(packetId, contentMap = {}) {
    this._logMode('HASH_NOTARY_PREPARATION', packetId);

    const registration = this.packets.get(packetId);
    if (!registration) {
      return { ok: false, reason: `Packet '${packetId}' not found` };
    }

    // Build hash manifest
    const manifest = new HashManifest({ packetId });
    for (const [filename, content] of Object.entries(contentMap)) {
      manifest.register(filename, typeof content === 'string' ? content : JSON.stringify(content));
    }

    // Register the packet's own source paper and matrices
    if (registration.packet.sourcePaper) {
      manifest.register('source-paper.md', registration.packet.sourcePaper);
    }
    if (registration.packet.claimsMatrix) {
      manifest.register('claims-matrix.json', JSON.stringify(registration.packet.claimsMatrix));
    }
    if (registration.packet.evidenceMatrix) {
      manifest.register('evidence-matrix.json', JSON.stringify(registration.packet.evidenceMatrix));
    }
    if (registration.packet.proofLedger) {
      manifest.register('proof-ledger.json', JSON.stringify(registration.packet.proofLedger));
    }

    const finalManifest = manifest.finalize();

    // Promote authority state to HASHED
    const { authority } = registration;
    if (authority.getState() !== AUTHORITY_STATE.HASHED &&
        authority.getState() !== AUTHORITY_STATE.PRIVATE_VAULT) {
      authority.promoteToClaimHardened();
      authority.promoteToEvidenceLinked({ reason: 'hash preparation' });
      authority.promoteToHashed(finalManifest.merkleRoot);
    }

    // Store manifest
    registration.hashManifest = finalManifest;

    // MEMORIA: append hash record
    this.memoria.appendHash({
      packetId,
      merkleRoot:    finalManifest.merkleRoot,
      entryCount:    finalManifest.entryCount,
      algorithm:     finalManifest.algorithm,
      authorityState: authority.getState(),
    });

    // Cohort: Notarius prepares notary packet
    const notaryPrep = this.cohort.notarius_prepareNotary(registration.packet, finalManifest);

    console.log(`🔏 THESIS hash+notary | packetId=${packetId} | root=${finalManifest.merkleRoot} | state=${authority.getState()}`);

    return {
      ok:            true,
      packetId,
      hashManifest:  finalManifest,
      notaryPrep,
      authorityState: authority.getState(),
    };
  }

  // ─── THESIS find the deeper theorem ───────────────────────────────────

  /**
   * THESIS find the deeper theorem.
   * Runs ANIMUS curiosity loop focused on edge expansion.
   */
  findDeeperTheorem(rawText, hints = {}) {
    this._logMode('EDGE_EXPANSION', 'find_deeper_theorem');

    const sensusResult = this.sensus.classify(rawText, hints);
    const animusResult = this.animus.expand({
      obviousThesis:    rawText.slice(0, 500),
      existingClaims:   [],
      existingEvidence: [],
      sensusResult,
    });

    return {
      obviousThesis:     rawText.slice(0, 200),
      deeperTheorem:     animusResult.edgeTheorem,
      ecsScore:          animusResult.ecsScore,
      strongestObjection: animusResult.strongestObjection,
      missingProof:      animusResult.missingProof,
      deploymentPath:    animusResult.deploymentPath,
      needsFoundationFloor: animusResult.needsFoundationFloor,
      depthWeights:      animusResult.depthWeights?.slice(0, 6),
    };
  }

  // ─── THESIS attack as critic ───────────────────────────────────────────

  /**
   * THESIS attack this paper as a critic.
   * Runs Iudex + Probator on the packet.
   */
  attackAsCritic(packet, animusExpansion) {
    this._logMode('CRITIC_EXAMINER', 'attack');

    const iudexResult   = this.cohort.iudex_critique(packet, animusExpansion || {});
    const probatorResult = this.cohort.probator_designExperiment(animusExpansion || {}, packet);
    const sourcePlan    = this.cohort.quaestor_searchPlan(
      animusExpansion?.edgeTheorem || packet.title,
      packet.sensusResult?.substrateType
    );

    return {
      mode:          'CRITIC_EXAMINER',
      iudexResult,
      probatorResult,
      sourcePlan,
      totalObjections:  iudexResult.objections.length + iudexResult.overclaims.length,
      critical:         iudexResult.criticalCount,
      high:             iudexResult.highCount,
      recommendation:   iudexResult.recommendation,
    };
  }

  // ─── THESIS make public-safe version ──────────────────────────────────

  /**
   * THESIS make public-safe version.
   * Strips private core, redacts sensitive claims, applies external framing.
   */
  makePublicSafe(packetId) {
    this._logMode('PUBLIC_SAFE_RENDER', packetId);

    const registration = this.packets.get(packetId);
    if (!registration) return { ok: false, reason: `Packet '${packetId}' not found` };

    const { packet } = registration;
    const privateCore = packet.sensusResult?.privateCore || false;

    if (privateCore) {
      return {
        ok: false,
        reason: 'Cannot make public-safe: private core detected. Route to PRIVATE_VAULT or counsel review first.',
        authorityState: AUTHORITY_STATE.PRIVATE_VAULT,
      };
    }

    const custosResult = this.cohort.custos_guardBoundary(packet, packet.sensusResult || {});
    if (!custosResult.gateClear) {
      return {
        ok: false,
        reason: `Custos gate not clear: ${custosResult.violations.join('; ')}`,
        violations: custosResult.violations,
      };
    }

    const rendered = this.cohort.redactor_renderPaper(packet, 'external');

    return {
      ok:            true,
      packetId,
      renderFamily:  'external',
      custosResult,
      rendered,
      authorityState: AUTHORITY_STATE.PUBLIC_SAFE,
    };
  }

  // ─── THESIS build deployment blueprint ────────────────────────────────

  /**
   * THESIS build deployment blueprint.
   * Translates theorem → protocol → schema → canister → manifest → rollback.
   */
  buildDeploymentBlueprint(packetId) {
    this._logMode('DEPLOYMENT_RESEARCH_BRIDGE', packetId);

    const registration = this.packets.get(packetId);
    if (!registration) return { ok: false, reason: `Packet '${packetId}' not found` };

    const { packet, animusExpansion, authority } = registration;
    const deployPath = animusExpansion?.deploymentPath || packet.deploymentAppendix;

    if (!deployPath?.needed && !packet.deploymentAppendix) {
      return {
        ok: false,
        reason: 'No deployment path detected. Run expand() first, or ensure substrate contains deployment signals.',
      };
    }

    const blueprint = {
      packetId,
      stage:  'DEPLOYMENT_BLUEPRINT',
      path:   deployPath?.path || packet.deploymentAppendix?.path,
      stages: deployPath?.stages || packet.deploymentAppendix?.stages,
      requirements: {
        deploymentManifest:  false,   // operator must provide
        rollbackPlan:        false,   // operator must provide
        environmentBoundary: false,   // operator must provide
      },
      note: 'DEPLOYMENT_READY authority state requires all three requirements from operator',
      authorityState: AUTHORITY_STATE.DEPLOYMENT_BLUEPRINT,
    };

    if (authority) {
      authority.promoteToDeploymentBlueprint?.() ||
      authority.transition(AUTHORITY_STATE.DEPLOYMENT_BLUEPRINT);
    }

    return { ok: true, blueprint };
  }

  // ─── THESIS audit research folder ─────────────────────────────────────

  /**
   * THESIS audit this research folder.
   * Identifies orphan papers, missing hashes, unclassified claims, leaks.
   */
  auditResearch() {
    this._logMode('RESEARCH_LEDGER_AUDIT', 'all_packets');

    const report = {
      totalPackets:        this.packets.size,
      orphanPackets:       [],   // packets without MEMORIA lineage
      missingHashes:       [],   // packets not yet HASHED
      unclassifiedClaims:  [],   // claims with no class
      publicPrivateLeaks:  [],   // private core in public release path
      authorityDistribution: {},
    };

    for (const [packetId, reg] of this.packets.entries()) {
      const { packet, hashManifest, memoriaEntry, authority } = reg;

      // Orphan check
      if (!memoriaEntry?.entryId) report.orphanPackets.push(packetId);

      // Hash check
      if (!hashManifest?.merkleRoot) report.missingHashes.push(packetId);

      // Unclassified claims
      const uncl = packet.claimsMatrix?.claims?.filter(c => !c.claimClass) || [];
      if (uncl.length) report.unclassifiedClaims.push({ packetId, count: uncl.length });

      // Private/public leak check
      if (packet.sensusResult?.privateCore && packet.releaseBoundary?.publicReleaseAllowed) {
        report.publicPrivateLeaks.push({ packetId, severity: 'CRITICAL' });
      }

      // Authority distribution
      const state = authority?.getState() || 'UNKNOWN';
      report.authorityDistribution[state] = (report.authorityDistribution[state] || 0) + 1;
    }

    report.criticalIssues = report.publicPrivateLeaks.length;
    report.warningIssues  = report.orphanPackets.length + report.missingHashes.length;

    console.log(`📋 THESIS audit | packets=${report.totalPackets} | critical=${report.criticalIssues} | warnings=${report.warningIssues}`);
    return report;
  }

  // ═══════════════════════════════════════════════════════════════════════
  //  UTILITY
  // ═══════════════════════════════════════════════════════════════════════

  _isSupported(claimClass, evidenceClass) {
    const minE = CLAIM_MIN_EVIDENCE_TABLE[claimClass] || 'E0';
    const evStr  = EVIDENCE_STRENGTH_TABLE[evidenceClass] ?? 0;
    const minStr = EVIDENCE_STRENGTH_TABLE[minE] ?? 0;
    return evStr >= minStr;
  }

  _isPublicSafe(claimClass, evidenceClass, privateCore) {
    if (privateCore || claimClass === 'C6') return false;
    return this._isSupported(claimClass, evidenceClass);
  }

  _getReleaseRule(claimClass) {
    return RELEASE_RULES_TABLE[claimClass] || 'unknown rule';
  }

  _logMode(mode, subject) {
    this.modeLog.push({ mode, subject, timestamp: Date.now() });
  }

  // ─── Status ────────────────────────────────────────────────────────────

  getStatus() {
    return {
      agentId:     this.agentId,
      role:        'THESIS Alpha — Research, IP, Proof, Publication, Notarization, Deployment',
      family:      'Nova Architecture',
      uptime:      Date.now() - this.birthTime,
      runCount:    this.runCount,
      packetCount: this.packets.size,
      engines: {
        sensus:  this.sensus.getStatus(),
        animus:  this.animus.getStatus(),
        corpus:  this.corpus.getStatus(),
        memoria: this.memoria.getStatus(),
      },
      cohort:    this.cohort.getStatus(),
      router:    this.router.getStatus(),
      modeLog:   this.modeLog.slice(-10),
      constants: {
        phi:                PHI,
        phi_inv:            PHI_INV,
        phiHeartbeatMs:     PHI_HEARTBEAT_MS,
        emergenceThreshold: PHI_INV,
      },
    };
  }
}

// ─── Internal lookup tables (avoid circular import from constants) ─────────

const EVIDENCE_STRENGTH_TABLE = {
  E0: 0, E1: 1, E2: 2, E3: 3, E4: 4,
  E5: 5, E6: 6, E7: 7, E8: 8, E9: 9, E10: 10,
};

const CLAIM_MIN_EVIDENCE_TABLE = {
  C1: 'E4', C2: 'E2', C3: 'E1', C4: 'E1', C5: 'E4',
  C6: 'E0', C7: 'E3', C8: 'E3', C9: 'E3', C10: 'E1',
  C11: 'E5', C12: 'E8',
};

const RELEASE_RULES_TABLE = {
  C1:  'public only if proof is attached',
  C2:  'public only with environment boundary',
  C3:  'public only as hypothesis',
  C4:  'public as thesis or framing',
  C5:  'public only after IP or counsel review',
  C6:  'never public',
  C7:  'not public as law unless promoted',
  C8:  'public only as protocol proposal unless accepted',
  C9:  'public only with theorem/proof boundary',
  C10: 'public safe',
  C11: 'public only if deployment evidence exists',
  C12: 'public only if hash/notary receipt exists',
};

// ═══════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  SensusEngine,
  AnimusEngine,
  CorpusEngine,
  MemoriaEngine,
  WorkingCohort,
  HashManifest,
  AuthorityStateManager,
  SurfaceRouter,
  LifecycleStateMachine,
};

export {
  PHI, PHI_INV, PHI_HEARTBEAT_MS, FIBONACCI,
  CLAIM_CLASS, EVIDENCE_CLASS,
  AUTHORITY_STATE, AUTHORITY_TRANSITIONS,
  LIFECYCLE, LIFECYCLE_TERMINALS,
  SUBSTRATE_TYPE, SURFACE, COHORT_ROLE, RUNTIME_LAYER,
} from './constants.js';

export default ThesisAlpha;
