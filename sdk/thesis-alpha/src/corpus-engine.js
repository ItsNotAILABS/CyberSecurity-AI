///
/// @medina/thesis-alpha — CORPUS Engine
///
/// CORPUS creates the artifact body — the actual packet outputs.
///
/// CORPUS may produce:
///   papers, PDFs, DOCX outputs, abstracts, theorem maps, claims matrices,
///   evidence matrices, references, public-safe summaries, private notes,
///   reproducibility packets, hash manifests, notary packets, IP disclosures,
///   novelty matrices, deployment blueprints, canister schemas, rollback plans,
///   print manifests, SDK modules, scripts, validators, runtime helpers,
///   and packet-generation code.
///
/// CORPUS rules:
///   • no fake file claims
///   • no artifact without manifest awareness
///   • no public packet without claim boundary
///   • no IP packet without private/public split
///   • no notarization claim without receipt
///   • no deployment claim without deployment manifest
///
/// Mathematical foundations:
///
///   Vitruvian Proportions (Firmitas · Utilitas · Venustas):
///     Firmitas  = structural integrity of the artifact (E-class floor)
///     Utilitas  = functional utility for the consumer (claim completeness)
///     Venustas  = formal quality and presentation (render polish)
///     Packet completeness = √(F² + U² + V²) / √3   (Pythagorean normalised)
///
///   Fibonacci packet versioning:
///     version = FIBONACCI[packetCount % 20]
///
///   Merkle tree construction for hash manifest:
///     hash(parent) = hash(hash(left) ∥ hash(right))
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI_INV, FIBONACCI, AUTHORITY_STATE,
  CLAIM_CLASS, CLAIM_RELEASE_RULES, CLAIM_PRIVATE_GATE,
  EVIDENCE_CLASS, EVIDENCE_STRENGTH, CLAIM_MIN_EVIDENCE,
  SUBSTRATE_TYPE, SURFACE,
} from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════
//  CORPUS ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class CorpusEngine {
  constructor({ agentId = 'THESIS-ALPHA' } = {}) {
    this.agentId      = agentId;
    this.birthTime    = Date.now();
    this.packetCount  = 0;
    this.artifacts    = [];

    console.log(`📦 CORPUS born | agentId=${agentId} | artifact forge ready`);
  }

  // ─── Master packet builder ─────────────────────────────────────────────

  /**
   * Assemble a full THESIS research packet from SENSUS + ANIMUS outputs.
   *
   * Packet completeness model (Vitruvian):
   *   Firmitas  = evidence class floor met
   *   Utilitas  = claims classified and bounded
   *   Venustas  = markdown + JSON ledgers generated
   *   Completeness = √(F² + U² + V²) / √3
   *
   * @param {object} options
   * @returns {ThesisPacket}
   */
  assemblePacket(options = {}) {
    this.packetCount++;

    const {
      title            = 'Untitled Research Packet',
      sensusResult     = {},
      animusExpansion  = {},
      rawInput         = '',
      claimsMatrix     = [],
      evidenceMatrix   = [],
      authorNote       = '',
      privateVault     = false,
    } = options;

    const packetId = this._generatePacketId();
    const version  = `0.${FIBONACCI[this.packetCount % 20]}.618`;
    const now      = new Date().toISOString();

    // ── Source paper (Markdown)
    const sourcePaper = this._buildSourcePaper({
      title, packetId, version, now, rawInput,
      sensusResult, animusExpansion, authorNote,
    });

    // ── Claims matrix
    const claimsMatrixJSON = this._buildClaimsMatrix(claimsMatrix, sensusResult);

    // ── Evidence matrix
    const evidenceMatrixJSON = this._buildEvidenceMatrix(evidenceMatrix);

    // ── Proof ledger
    const proofLedger = this._buildProofLedger(claimsMatrixJSON, evidenceMatrixJSON);

    // ── Hash manifest (path — actual hash computation in HashManifest module)
    const hashManifestPath = this._buildHashManifestPath(packetId, [
      'source-paper.md', 'claims-matrix.json', 'evidence-matrix.json', 'proof-ledger.json',
    ]);

    // ── Release boundary
    const releaseBoundary = this._buildReleaseBoundary(sensusResult, claimsMatrixJSON, privateVault);

    // ── Reproducibility notes
    const reproducibilityNotes = this._buildReproducibilityNotes(animusExpansion);

    // ── Deployment appendix (if applicable)
    const deploymentAppendix = animusExpansion.needsFoundationFloor
      ? this._buildDeploymentAppendix(animusExpansion.deploymentPath)
      : null;

    // ── Vitruvian completeness score
    const completeness = this._computeCompleteness({
      sensusResult, claimsMatrixJSON, evidenceMatrixJSON,
    });

    const packet = {
      packetId,
      version,
      created:   now,
      title,
      authorNote,
      authorityState: sensusResult.initialAuthorityState || AUTHORITY_STATE.DRAFT,

      // Canonical source artifacts
      sourcePaper,
      claimsMatrix:      claimsMatrixJSON,
      evidenceMatrix:    evidenceMatrixJSON,
      proofLedger,
      hashManifestPath,
      releaseBoundary,
      reproducibilityNotes,

      // Optional appendices
      deploymentAppendix,

      // Completeness metadata
      completeness,

      // Lineage seed (MEMORIA will append)
      lineage: {
        packetId,
        version,
        created:  now,
        parentId: null,
        revisions: [],
      },
    };

    this.artifacts.push({ packetId, version, created: now, title });
    console.log(`   CORPUS packet assembled | id=${packetId} | completeness=${completeness.score.toFixed(4)} | authority=${packet.authorityState}`);
    return packet;
  }

  // ─── Source paper builder ──────────────────────────────────────────────

  _buildSourcePaper({ title, packetId, version, now, rawInput, sensusResult, animusExpansion, authorNote }) {
    const substrate  = sensusResult.substrateType || 'unknown';
    const privateCore = sensusResult.privateCore || false;
    const rhetoric   = sensusResult.rhetoricScore || {};
    const ecs        = animusExpansion.ecsScore || {};

    return `# ${title}

**Packet ID:** \`${packetId}\`
**Version:** ${version}
**Created:** ${now}
**Authority State:** ${sensusResult.initialAuthorityState || AUTHORITY_STATE.DRAFT}
**Substrate Type:** ${substrate}
**Private Core:** ${privateCore}

${authorNote ? `**Author Note:** ${authorNote}\n` : ''}
---

## Abstract

${rawInput.slice(0, 500) || '[No raw input provided]'}

---

## Research Framing

**Substrate Classification:** ${substrate}
**Claim Risk Index:** ${sensusResult.claimRisk ?? 'not computed'}
**Privacy Pressure:** ${sensusResult.privacyPressure ?? 'not computed'}
**Public Release Allowed:** ${sensusResult.publicReleaseAllowed ?? false}

**Rhetoric Scores (Aristotelian):**
- Logos: ${rhetoric.logos ?? '—'}  (logical coherence, φ-weighted)
- Ethos: ${rhetoric.ethos ?? '—'}  (authority and credibility)
- Pathos: ${rhetoric.pathos ?? '—'}  (consequence and impact, φ⁻¹-weighted)
- Composite: ${rhetoric.composite ?? '—'}  (Pythagorean combination)

---

## Deeper Theorem

${animusExpansion.edgeTheorem || '[ANIMUS expansion not run]'}

**ECS Score (Edge–Claim–Source):**
- E (edge novelty): ${ecs.E ?? '—'}
- C (claim discipline): ${ecs.C ?? '—'}
- S (substrate strength): ${ecs.S ?? '—'}
- **Total:** ${ecs.total ?? '—'}

---

## Strongest Objection

${animusExpansion.strongestObjection || '[No objection found]'}

**Dialectic:** ${animusExpansion.step3_strongestObjection?.dialecticSynthesis || '—'}

---

## Proof Gap

${animusExpansion.missingProof || '[No proof gap identified]'}

---

## Claims and Evidence Summary

*See \`claims-matrix.json\` and \`evidence-matrix.json\` for full classification.*

---

## Deployment Implications

${animusExpansion.deploymentPath?.path || 'No deployment path detected.'}

---

## Appendix References

- \`claims-matrix.json\` — claims classified C1–C12
- \`evidence-matrix.json\` — evidence classified E0–E10
- \`proof-ledger.json\` — proof linkage table
- \`hash-manifest.json\` — artifact integrity manifest (to be completed)

---

## Release Boundary Notice

${privateCore
  ? '⚠️ PRIVATE CORE DETECTED — This artifact is PRIVATE_VAULT class. Do not release publicly.'
  : 'Release boundary: See `release-boundary.json` for per-claim release gates.'}
`;
  }

  // ─── Claims matrix builder ─────────────────────────────────────────────

  _buildClaimsMatrix(claims, sensusResult) {
    const rows = claims.map((claim, idx) => {
      const claimClass    = claim.claimClass    || 'C3';
      const releaseRule   = CLAIM_RELEASE_RULES[claimClass] || 'unknown';
      const isPrivate     = CLAIM_PRIVATE_GATE.has(claimClass);
      const minEvidence   = CLAIM_MIN_EVIDENCE[claimClass] || 'E0';
      const evidenceClass = claim.evidenceClass || 'E0';
      const evidenceOK    = EVIDENCE_STRENGTH[evidenceClass] >= EVIDENCE_STRENGTH[minEvidence];

      return {
        id:            `CLM-${String(idx + 1).padStart(3, '0')}`,
        text:          claim.text || '[no claim text]',
        claimClass,
        claimLabel:    CLAIM_CLASS[claimClass] || claimClass,
        releaseRule,
        isPrivate,
        evidenceClass,
        minEvidenceRequired: minEvidence,
        evidenceSufficient:  evidenceOK,
        supported:           evidenceOK && !isPrivate,
        blocked:             !evidenceOK || isPrivate,
      };
    });

    const unsupported = rows.filter(r => r.blocked).length;
    const supported   = rows.filter(r => r.supported).length;

    return {
      schema:       'claims-matrix-v1',
      packetRef:    null,  // CORPUS will fill in
      generated:    new Date().toISOString(),
      substrate:    sensusResult.substrateType || 'unknown',
      totalClaims:  rows.length,
      supported,
      unsupported,
      blocked:      unsupported,
      claims:       rows,
    };
  }

  // ─── Evidence matrix builder ───────────────────────────────────────────

  _buildEvidenceMatrix(evidenceItems) {
    const rows = evidenceItems.map((item, idx) => {
      const eClass  = item.evidenceClass || 'E0';
      const strength = EVIDENCE_STRENGTH[eClass] ?? 0;

      return {
        id:            `EVD-${String(idx + 1).padStart(3, '0')}`,
        description:   item.description || '[no description]',
        evidenceClass: eClass,
        evidenceLabel: EVIDENCE_CLASS[eClass] || eClass,
        strength,
        linkedClaims:  item.linkedClaims || [],
        source:        item.source || 'internal',
        verified:      strength >= 4,  // E4 (code implementation) or better
      };
    });

    return {
      schema:         'evidence-matrix-v1',
      generated:      new Date().toISOString(),
      totalItems:     rows.length,
      verifiedItems:  rows.filter(r => r.verified).length,
      evidence:       rows,
    };
  }

  // ─── Proof ledger builder ──────────────────────────────────────────────

  _buildProofLedger(claimsMatrix, evidenceMatrix) {
    const links = [];

    for (const claim of claimsMatrix.claims) {
      const linkedEvidence = evidenceMatrix.evidence.filter(ev =>
        ev.linkedClaims.includes(claim.id)
      );
      links.push({
        claimId:        claim.id,
        claimClass:     claim.claimClass,
        evidenceIds:    linkedEvidence.map(e => e.id),
        evidenceClasses: linkedEvidence.map(e => e.evidenceClass),
        proofComplete:  claim.evidenceSufficient,
        note:           claim.evidenceSufficient
          ? 'Evidence meets minimum requirement'
          : `Requires ${claim.minEvidenceRequired} or stronger — currently ${claim.evidenceClass}`,
      });
    }

    const complete  = links.filter(l => l.proofComplete).length;
    const incomplete = links.filter(l => !l.proofComplete).length;

    return {
      schema:      'proof-ledger-v1',
      generated:   new Date().toISOString(),
      totalLinks:  links.length,
      complete,
      incomplete,
      completionRatio: links.length > 0 ? +(complete / links.length).toFixed(4) : 0,
      links,
    };
  }

  // ─── Hash manifest path ────────────────────────────────────────────────

  _buildHashManifestPath(packetId, files) {
    return {
      schema:    'hash-manifest-path-v1',
      packetId,
      generated: new Date().toISOString(),
      note:      'Actual hashes computed by HashManifest module. This is the path declaration.',
      files:     files.map(f => ({
        filename: f,
        hash:     null,     // null until HashManifest.compute() is called
        algorithm: 'SHA-256',
      })),
      merkleRoot: null,     // null until hash tree is built
      authorityRequired: AUTHORITY_STATE.HASHED,
    };
  }

  // ─── Release boundary ──────────────────────────────────────────────────

  _buildReleaseBoundary(sensusResult, claimsMatrix, privateVault) {
    const privateCore = sensusResult.privateCore || false;

    return {
      schema:       'release-boundary-v1',
      generated:    new Date().toISOString(),
      privateCore,
      privateVault: privateVault || privateCore,
      publicReleaseAllowed: sensusResult.publicReleaseAllowed && !privateVault,
      blockedActions:       sensusResult.blockedActions || [],
      perClaimGates:        claimsMatrix.claims.map(c => ({
        claimId:   c.id,
        claimClass: c.claimClass,
        publicSafe: !c.isPrivate && c.evidenceSufficient,
        releaseRule: c.releaseRule,
      })),
      externalSafeFraming: privateCore
        ? 'Medina is developing sovereign intelligence infrastructure that coordinates native and ' +
          'external intelligence sources into proof-backed, memory-preserving artifacts and workflows. ' +
          'Current research artifacts describe internal architecture and experimental validation paths; ' +
          'broader claims require linked evidence, reproducible tests, and review before public release.'
        : null,
    };
  }

  // ─── Reproducibility notes ─────────────────────────────────────────────

  _buildReproducibilityNotes(animusExpansion) {
    const hashList   = animusExpansion.hashList   || [];
    const notaryList = animusExpansion.notaryList  || [];

    return {
      schema:     'reproducibility-notes-v1',
      generated:  new Date().toISOString(),
      hashCandidates:  hashList,
      notaryCandidates: notaryList,
      scriptRequired:   hashList.length > 0,
      note: 'Reproducibility scripts (E5) or BotProofRecord (E6) recommended for claim hardening',
    };
  }

  // ─── Deployment appendix ───────────────────────────────────────────────

  _buildDeploymentAppendix(deploymentPath) {
    if (!deploymentPath || !deploymentPath.needed) return null;

    return {
      schema:    'deployment-appendix-v1',
      generated: new Date().toISOString(),
      stages:    deploymentPath.stages || [],
      path:      deploymentPath.path,
      manifestRequired:    true,
      rollbackRequired:    true,
      environmentRequired: true,
      note: 'DEPLOYMENT_READY authority state requires: manifest + rollback plan + environment boundary',
    };
  }

  // ─── Vitruvian completeness score ─────────────────────────────────────

  /**
   * Firmitas = evidence floor met (structural integrity)
   * Utilitas = claims classified and bounded (functional utility)
   * Venustas = source paper + JSON ledgers present (formal quality)
   *
   * Completeness = √(F² + U² + V²) / √3   (Pythagorean normalised to [0,1])
   */
  _computeCompleteness({ sensusResult, claimsMatrixJSON, evidenceMatrixJSON }) {
    const F = sensusResult.claimRisk != null
      ? Math.max(0, 1 - sensusResult.claimRisk)
      : 0;

    const totalClaims    = claimsMatrixJSON.totalClaims || 0;
    const supportedClaims = claimsMatrixJSON.supported  || 0;
    const U = totalClaims > 0 ? supportedClaims / totalClaims : 0;

    const totalEvidence  = evidenceMatrixJSON.totalItems    || 0;
    const verifiedEvidence = evidenceMatrixJSON.verifiedItems || 0;
    const V = totalEvidence > 0 ? verifiedEvidence / totalEvidence : 0;

    const score = Math.sqrt(F * F + U * U + V * V) / Math.sqrt(3);

    return {
      firmitas:  +F.toFixed(4),
      utilitas:  +U.toFixed(4),
      venustas:  +V.toFixed(4),
      score:     +score.toFixed(4),
      label: score > 0.8 ? 'COMPLETE'
           : score > 0.5 ? 'NEAR_COMPLETE'
           : score > 0.2 ? 'PARTIAL'
           : 'SKELETON',
    };
  }

  // ─── Packet ID generator ───────────────────────────────────────────────

  _generatePacketId() {
    const fib  = FIBONACCI[this.packetCount % 20];
    const ts   = Date.now().toString(36).toUpperCase();
    return `THESIS-PKT-${fib}-${ts}`;
  }

  getStatus() {
    return {
      agentId:     this.agentId,
      uptime:      Date.now() - this.birthTime,
      packetCount: this.packetCount,
      artifacts:   this.artifacts,
    };
  }
}

export default CorpusEngine;
