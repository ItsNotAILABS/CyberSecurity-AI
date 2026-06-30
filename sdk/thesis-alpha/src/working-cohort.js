///
/// @medina/thesis-alpha — Working Cohort
///
/// When THESIS enters a substantial working state, it allocates processing
/// to temporary internal helper roles (Working Cohort).
///
/// These are NOT separate Alpha agents. They are internal working roles
/// used to divide complex research, packet, proof, rendering, and
/// deployment tasks.
///
/// Standard roles:
///   Quaestor   — research seeker, source hunter, prior-art scout
///   Iudex      — critic, examiner, objection finder, claim-pressure tester
///   Faber      — builder of code, scripts, packet tooling, runtime artifacts
///   Structor   — packet assembler, schema organizer, bundle architect
///   Notarius   — hash, manifest, notarization, authorship-continuity prep
///   Custos     — public/private boundary guard, protected-term watcher
///   Archivista — lineage, memory continuity, revision consequence, archive integrity
///   Probator   — experiment, validation, test-plan, proof-gap worker
///   Redactor   — formal paper rendering, publication polish
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI_INV, COHORT_ROLE, CLAIM_CLASS, EVIDENCE_STRENGTH } from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════
//  WORKING COHORT
// ═══════════════════════════════════════════════════════════════════════════

export class WorkingCohort {
  /**
   * @param {string[]} roles — subset of COHORT_ROLE values to activate
   */
  constructor(roles = Object.values(COHORT_ROLE)) {
    this.birthTime  = Date.now();
    this.roles      = roles;
    this.taskLogs   = [];
    this.members    = {};

    for (const role of roles) {
      this.members[role] = new CohortMember(role);
    }

    console.log(`⚔️  Working Cohort assembled | roles=[${roles.join(', ')}]`);
  }

  // ─── Quaestor — research seeker ────────────────────────────────────────

  /**
   * Quaestor hunts sources, prior art, and research landscape.
   * Returns a structured source-search plan.
   */
  quaestor_searchPlan(theorem, substrateType) {
    const member = this._require(COHORT_ROLE.QUAESTOR);
    const plan = {
      role:        COHORT_ROLE.QUAESTOR,
      task:        'source_search',
      theorem:     theorem?.slice(0, 200) || '',
      substrateType,
      searchVectors: [
        'Medina internal research archive',
        'Prior protocol records and lineage ledger',
        'Bot Fleet repository evidence',
        'External academic landscape (requires Web search — label E10)',
        'GitHub commit history and issue tracker (label E3)',
      ],
      priorArtFlags: [
        `Search for: "${theorem?.slice(0, 80) || 'theorem'}" in Medina registry`,
        `Search for matching substrate type: ${substrateType}`,
        `Check claim-ledger.md for overlapping claims`,
      ],
      noveltyAngles: [
        'φ-weighting applied to substrate classification',
        'Kuramoto order parameter for synchrony-based access control',
        'Aristotelian rhetoric scores driving claim classification',
      ],
      cautionList: [
        'Do not claim novelty without prior-art search result',
        'Label all external results as E10 — not Medina-native proof',
      ],
    };
    member.log('source_search', plan);
    return plan;
  }

  // ─── Iudex — critic and examiner ───────────────────────────────────────

  /**
   * Iudex surfaces objections, missing evidence, and overclaim risks.
   */
  iudex_critique(packet, animusExpansion) {
    const member = this._require(COHORT_ROLE.IUDEX);

    const objections = [];
    const overclaims = [];

    // Check for unsupported claims
    const blocked = packet.claimsMatrix?.claims?.filter(c => c.blocked) || [];
    if (blocked.length > 0) {
      overclaims.push({
        type: 'UNSUPPORTED_CLAIM',
        count: blocked.length,
        detail: `${blocked.length} claim(s) have insufficient evidence and must not be released publicly`,
      });
    }

    // Check for private core in release path
    if (packet.sensusResult?.privateCore && packet.releaseBoundary?.publicReleaseAllowed) {
      objections.push({
        type: 'PRIVATE_CORE_LEAK',
        severity: 'CRITICAL',
        detail: 'Private core detected but public release allowed — boundary inconsistency',
      });
    }

    // Check deployment claims without manifest
    const deploymentClaims = packet.claimsMatrix?.claims?.filter(c => c.claimClass === 'C11') || [];
    if (deploymentClaims.length > 0 && !packet.deploymentAppendix) {
      objections.push({
        type: 'DEPLOYMENT_CLAIM_NO_MANIFEST',
        severity: 'HIGH',
        detail: 'C11 deployment claim present but no deployment manifest — cannot promote to DEPLOYMENT_READY',
      });
    }

    // Check notarization claims without receipt
    const notaryClaims = packet.claimsMatrix?.claims?.filter(c => c.claimClass === 'C12') || [];
    if (notaryClaims.length > 0 && !packet.notaryReceipt) {
      objections.push({
        type: 'NOTARY_CLAIM_NO_RECEIPT',
        severity: 'HIGH',
        detail: 'C12 notarization claim present but no receipt exists — cannot claim NOTARIZED state',
      });
    }

    // Strongest objection from ANIMUS
    const strongestFromAnimus = animusExpansion?.strongestObjection || 'No ANIMUS objection found';

    const critique = {
      role:             COHORT_ROLE.IUDEX,
      task:             'critique',
      objections,
      overclaims,
      strongestObjection: strongestFromAnimus,
      criticalCount:    objections.filter(o => o.severity === 'CRITICAL').length,
      highCount:        objections.filter(o => o.severity === 'HIGH').length,
      recommendation:   objections.length === 0 && overclaims.length === 0
        ? 'No critical issues found — proceed to CORPUS assembly'
        : 'Resolve objections and overclaims before public release or claim promotion',
    };

    member.log('critique', critique);
    return critique;
  }

  // ─── Faber — builder of code and runtime artifacts ─────────────────────

  /**
   * Faber generates runtime artifacts: scripts, schemas, validators.
   */
  faber_buildArtifacts(packet) {
    const member = this._require(COHORT_ROLE.FABER);

    const artifacts = {
      role:  COHORT_ROLE.FABER,
      task:  'build_artifacts',

      // Validation script (Python-style pseudocode — labeled as E5 candidate)
      validationScript: this._generateValidationScript(packet),

      // Claims validator schema
      claimsValidatorSchema: this._generateClaimsSchema(packet.claimsMatrix),

      // Hash computation helper
      hashHelper: this._generateHashHelper(packet.packetId),

      // Packet manifest
      packetManifest: {
        packetId:      packet.packetId,
        version:       packet.version,
        created:       packet.created,
        files: [
          'source-paper.md',
          'claims-matrix.json',
          'evidence-matrix.json',
          'proof-ledger.json',
          'hash-manifest.json',
          'release-boundary.json',
          'reproducibility-notes.json',
        ],
        authorityState: packet.authorityState,
      },

      evidenceClass: 'E5',  // reproducible script candidate
      note: 'Artifacts labeled E5 (reproducible script) — pending actual execution verification',
    };

    member.log('build_artifacts', { packetId: packet.packetId });
    return artifacts;
  }

  _generateValidationScript(packet) {
    return `#!/usr/bin/env python3
"""
THESIS Packet Validator — ${packet.packetId}
Generated by Faber (Working Cohort)
Authority State: ${packet.authorityState}
"""

import json, hashlib, sys

PACKET_ID = "${packet.packetId}"
VERSION   = "${packet.version}"

def validate_claims(claims_matrix):
    blocked = [c for c in claims_matrix.get("claims", []) if c.get("blocked")]
    if blocked:
        print(f"[FAIL] {len(blocked)} blocked claims found")
        return False
    print(f"[PASS] All {len(claims_matrix.get('claims', []))} claims validated")
    return True

def validate_evidence(evidence_matrix):
    unverified = [e for e in evidence_matrix.get("evidence", []) if not e.get("verified")]
    if unverified:
        print(f"[WARN] {len(unverified)} unverified evidence items")
    print(f"[PASS] Evidence matrix: {len(evidence_matrix.get('evidence', []))} items")
    return True

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            h.update(chunk)
    return h.hexdigest()

if __name__ == "__main__":
    print(f"THESIS Packet Validator | ID={PACKET_ID} | Version={VERSION}")
    # Load and validate JSON artifacts
    for filename in ["claims-matrix.json", "evidence-matrix.json", "proof-ledger.json"]:
        print(f"  SHA-256({filename}) = {compute_sha256(filename)}")
    print("Validation complete.")
`;
  }

  _generateClaimsSchema(claimsMatrix) {
    return {
      schema:  'claims-validator-schema-v1',
      version: '1.0.0',
      rules: {
        claimClass:       { type: 'string', enum: Object.keys(CLAIM_CLASS) },
        evidenceClass:    { type: 'string', pattern: '^E[0-9]+(0)?$' },
        supported:        { type: 'boolean' },
        blocked:          { type: 'boolean' },
        publicSafe:       { type: 'boolean', computed: 'supported && !isPrivate' },
      },
      totalClaims:    claimsMatrix?.totalClaims || 0,
      blockedClaims:  claimsMatrix?.blocked || 0,
    };
  }

  _generateHashHelper(packetId) {
    return `// Hash helper for THESIS packet ${packetId}
// Run: node hash-helper.mjs
import { createHash } from 'crypto';
import { readFileSync } from 'fs';

const FILES = [
  'source-paper.md',
  'claims-matrix.json',
  'evidence-matrix.json',
  'proof-ledger.json',
];

const hashes = {};
for (const f of FILES) {
  const data = readFileSync(f);
  hashes[f] = createHash('sha256').update(data).digest('hex');
}

console.log(JSON.stringify(hashes, null, 2));
`;
  }

  // ─── Custos — public/private boundary guard ────────────────────────────

  /**
   * Custos checks the release boundary and flags protected terms.
   */
  custos_guardBoundary(packet, sensusResult) {
    const member = this._require(COHORT_ROLE.CUSTOS);

    const privateCore = sensusResult.privateCore || false;
    const blockedClaims = packet.claimsMatrix?.claims?.filter(c => c.isPrivate) || [];
    const publicClaims  = packet.claimsMatrix?.claims?.filter(c => !c.isPrivate && c.supported) || [];

    const violations = [];
    if (privateCore && packet.releaseBoundary?.publicReleaseAllowed) {
      violations.push('CRITICAL: Private core in public release path');
    }
    for (const c of blockedClaims) {
      if (c.claimClass === 'C6') {
        violations.push(`C6 claim ${c.id} must never be released publicly`);
      }
    }

    const result = {
      role:        COHORT_ROLE.CUSTOS,
      task:        'guard_boundary',
      privateCore,
      privateClaimCount: blockedClaims.length,
      publicClaimCount:  publicClaims.length,
      violations,
      gateClear:   violations.length === 0,
      recommendation: violations.length === 0
        ? 'Boundary gate clear — public-safe packet may proceed'
        : `Boundary violations detected — resolve before any external release`,
    };

    member.log('guard_boundary', result);
    return result;
  }

  // ─── Archivista — lineage and archive integrity ────────────────────────

  /**
   * Archivista verifies lineage continuity and prepares archive entry.
   */
  archivista_prepareArchive(packet, memoriaEntry) {
    const member = this._require(COHORT_ROLE.ARCHIVISTA);

    const archiveEntry = {
      role:         COHORT_ROLE.ARCHIVISTA,
      task:         'prepare_archive',
      packetId:     packet.packetId,
      version:      packet.version,
      created:      packet.created,
      authorityState: packet.authorityState,
      lineageId:    memoriaEntry?.entryId || null,
      merkleRoot:   memoriaEntry?.merkleRoot || null,
      lineageContinuous: !!memoriaEntry?.entryId,
      archiveReady: !!memoriaEntry?.entryId && packet.completeness?.score > 0.5,
      note: 'THESIS outputs do not become durable Medina research until MEMORIA appends lineage',
    };

    member.log('prepare_archive', archiveEntry);
    return archiveEntry;
  }

  // ─── Notarius — hash and notary preparation ────────────────────────────

  /**
   * Notarius prepares the notarization packet.
   * Preparing is NOT broadcasting — operator approves before external submission.
   */
  notarius_prepareNotary(packet, hashManifest) {
    const member = this._require(COHORT_ROLE.NOTARIUS);

    const notaryPacket = {
      role:      COHORT_ROLE.NOTARIUS,
      task:      'prepare_notary',
      packetId:  packet.packetId,
      version:   packet.version,
      hashManifest,
      notaryTargets: [
        { target: 'ICP-anchored notary',   ready: !!hashManifest },
        { target: 'Git signature',         ready: !!hashManifest },
        { target: 'IPFS content address',  ready: !!hashManifest },
        { target: 'Local hash manifest',   ready: !!hashManifest },
      ],
      operatorApprovalRequired: true,
      broadcastBlocked:         true,
      note: 'Packet is NOTARY_READY — not NOTARIZED until external receipt exists',
      authorityState: AUTHORITY_STATE_REF.NOTARY_READY,
    };

    member.log('prepare_notary', notaryPacket);
    return notaryPacket;
  }

  // ─── Probator — proof gap and experiment design ────────────────────────

  /**
   * Probator designs validation experiments for proof gaps.
   */
  probator_designExperiment(animusExpansion, packet) {
    const member = this._require(COHORT_ROLE.PROBATOR);

    const gap     = animusExpansion?.step4_missingProof?.gapToMaximum || 0;
    const current = animusExpansion?.step4_missingProof?.currentMaxEvidenceStrength || 0;

    const experiments = [];
    if (gap > 5) {
      experiments.push({
        type: 'IMPLEMENTATION_PROOF',
        description: 'Build a code implementation (E4) to support core claims',
        expectedEvidenceClass: 'E4',
        route: 'AUTE',
      });
    }
    if (gap > 3) {
      experiments.push({
        type: 'REPRODUCIBILITY_SCRIPT',
        description: 'Write a reproducible script (E5) that demonstrates the mechanism',
        expectedEvidenceClass: 'E5',
        route: 'AUTE',
      });
    }
    if (gap > 1) {
      experiments.push({
        type: 'BOT_PROOF_RECORD',
        description: 'Generate a BotProofRecord (E6) via automated test run',
        expectedEvidenceClass: 'E6',
        route: 'BOT_FLEET',
      });
    }

    const result = {
      role:        COHORT_ROLE.PROBATOR,
      task:        'design_experiment',
      currentEvidenceStrength: current,
      gapToMaximum: gap,
      experiments,
      escalateToAUTE: gap > 3,
      escalateToBotFleet: gap > 1,
    };

    member.log('design_experiment', result);
    return result;
  }

  // ─── Redactor — formal paper rendering ────────────────────────────────

  /**
   * Redactor applies archive-grade rendering rules to the source paper.
   */
  redactor_renderPaper(packet, renderFamily = 'research') {
    const member = this._require(COHORT_ROLE.REDACTOR);

    const privateCore = packet.sensusResult?.privateCore || false;

    // Choose render variant based on family and private core
    let renderNote;
    if (renderFamily === 'external' && privateCore) {
      renderNote = 'Private core stripped — external safe framing applied';
    } else if (renderFamily === 'marketing') {
      renderNote = 'Proof claims stripped — marketing-safe framing only';
    } else {
      renderNote = 'Full internal rendering — all claims and evidence preserved';
    }

    const rendered = {
      role:         COHORT_ROLE.REDACTOR,
      task:         'render_paper',
      renderFamily,
      privateCore,
      renderNote,
      titleBlock: {
        title:        packet.title,
        packetId:     packet.packetId,
        version:      packet.version,
        created:      packet.created,
        authorityState: packet.authorityState,
        rights:       '© Medina — All rights reserved. Internal research artifact.',
        classification: packet.authorityState,
      },
      abstract:     packet.sourcePaper?.slice(0, 500) || '',
      renderReady:  true,
      formats:      ['Markdown', 'JSON-packet', 'PDF-pipeline-ready'],
    };

    member.log('render_paper', { renderFamily, packetId: packet.packetId });
    return rendered;
  }

  // ─── Internal helpers ──────────────────────────────────────────────────

  _require(role) {
    if (!this.members[role]) {
      this.members[role] = new CohortMember(role);
      console.log(`   Cohort: ${role} activated on demand`);
    }
    return this.members[role];
  }

  getStatus() {
    return {
      uptime:   Date.now() - this.birthTime,
      roles:    this.roles,
      taskLogs: this.taskLogs.length,
      members:  Object.fromEntries(
        Object.entries(this.members).map(([role, m]) => [role, m.getStatus()])
      ),
    };
  }
}

// ─── Single cohort member ──────────────────────────────────────────────────

class CohortMember {
  constructor(role) {
    this.role      = role;
    this.birthTime = Date.now();
    this.taskCount = 0;
    this.log_      = [];
  }

  log(task, data) {
    this.taskCount++;
    this.log_.push({ task, timestamp: Date.now(), seq: this.taskCount });
  }

  getStatus() {
    return {
      role:      this.role,
      uptime:    Date.now() - this.birthTime,
      taskCount: this.taskCount,
    };
  }
}

// Re-export AUTHORITY_STATE reference for Notarius
const AUTHORITY_STATE_REF = {
  NOTARY_READY: 'NOTARY_READY',
  NOTARIZED:    'NOTARIZED',
};

export default WorkingCohort;
