///
/// @medina/thesis-alpha — MEMORIA Engine
///
/// MEMORIA preserves research consequence.
/// Canonical memory is APPEND-ONLY.
///
/// MEMORIA records:
///   paper lineage, protocol lineage, theorem lineage, IP claim lineage,
///   hash manifest lineage, notary receipt lineage, public release decisions,
///   private vault restrictions, revision history, deployment translation history
///
/// MEMORIA blocks:
///   • canonical overwrite
///   • unlinked proof memory
///   • private core released as public
///   • Foundation Floor direct canonical writes
///   • external model output promoted as Medina-native proof without validation
///
/// Mathematical foundations:
///
///   Merkle Tree Lineage:
///     Each lineage entry hashes to a leaf node.
///     Parent hash = SHA-like combination of (left_hash ∥ right_hash).
///     MEMORIA's canonical root hash changes on every APPEND.
///
///   Mayan Calendar Cycle (for lineage epoch tracking):
///     Epoch = Math.floor(timestamp_ms / MAYAN_CYCLE_MS)
///     MAYAN_CYCLE_MS = 1440 × 1000 (from AutonomousClock: 1440ms → 1440s for lineage)
///
///   φ-weighted revision importance:
///     importance(revision) = base_importance × φ^(depth_from_root)
///     Revisions deeper in the lineage tree carry φ-exponential weight.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI_INV, FIBONACCI, AUTHORITY_STATE,
  CLAIM_CLASS, EVIDENCE_CLASS, SUBSTRATE_TYPE, RUNTIME_LAYER,
} from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

// Mayan epoch interval in ms (1440 × 1000 ms = scaled Mayan cycle)
const MAYAN_EPOCH_MS = 1440 * 1000;

// Blocked write sources
const BLOCKED_SOURCES = new Set([
  'FOUNDATION_FLOOR_DIRECT',
  'EXTERNAL_MODEL_UNVALIDATED',
  'OVERWRITE_ATTEMPT',
]);

// ═══════════════════════════════════════════════════════════════════════════
//  MEMORIA ENGINE
// ═══════════════════════════════════════════════════════════════════════════

export class MemoriaEngine {
  constructor({ agentId = 'THESIS-ALPHA' } = {}) {
    this.agentId      = agentId;
    this.birthTime    = Date.now();
    this.appendCount  = 0;

    // Append-only canonical ledger — NEVER delete, NEVER overwrite
    this._canonicalLedger  = [];
    this._lineageIndex     = new Map();  // packetId → ledger indices
    this._claimLedger      = [];
    this._hashLedger       = [];
    this._notaryLedger     = [];
    this._revisionHistory  = [];

    // Simple Merkle accumulator
    this._merkleLeaves     = [];
    this._merkleRoot       = null;

    console.log(`📚 MEMORIA born | agentId=${agentId} | canonical ledger open`);
  }

  // ─── Primary append ────────────────────────────────────────────────────

  /**
   * Append a packet and its consequences to canonical memory.
   * This is the primary MEMORIA write operation.
   *
   * @param {object} packet     — CORPUS-assembled packet
   * @param {object} [meta]     — additional metadata
   * @param {string} [source]   — who is writing (must not be FOUNDATION_FLOOR_DIRECT)
   * @returns {MemoriaEntry}
   */
  append(packet, meta = {}, source = 'THESIS-ALPHA') {
    // ── Block disallowed write sources
    if (BLOCKED_SOURCES.has(source)) {
      console.warn(`🚫 MEMORIA blocked write from source=${source}`);
      return {
        blocked: true,
        reason: `Source '${source}' is not permitted to write canonical memory.`,
        source,
      };
    }

    this.appendCount++;

    const epoch    = this._mayanEpoch();
    const leafHash = this._leafHash(packet.packetId, epoch);
    const fibIndex = FIBONACCI[this.appendCount % 20];

    // φ-weighted importance: deeper entries carry higher weight
    const depth = this._lineageIndex.has(packet.packetId)
      ? this._lineageIndex.get(packet.packetId).length + 1
      : 1;
    const importance = (meta.importance || 1.0) * Math.pow(PHI, depth * PHI_INV);

    const entry = {
      entryId:       `MEM-${this.appendCount}-${Date.now()}`,
      appendSeq:     this.appendCount,
      fibIndex,
      epoch,
      timestamp:     Date.now(),
      packetId:      packet.packetId,
      version:       packet.version,
      title:         packet.title,
      authorityState: packet.authorityState,
      substrateSummary: packet.sensusResult?.substrateType || 'unknown',
      privateCore:   packet.sensusResult?.privateCore || false,
      claimCount:    packet.claimsMatrix?.totalClaims || 0,
      evidenceCount: packet.evidenceMatrix?.totalItems || 0,
      proofComplete: packet.proofLedger?.completionRatio || 0,
      leafHash,
      importance:    +importance.toFixed(6),
      source,
      depth,
      meta,
    };

    // Append-only writes
    this._canonicalLedger.push(entry);
    this._merkleLeaves.push(leafHash);
    this._merkleRoot = this._buildMerkleRoot(this._merkleLeaves);

    // Index by packetId
    if (!this._lineageIndex.has(packet.packetId)) {
      this._lineageIndex.set(packet.packetId, []);
    }
    this._lineageIndex.get(packet.packetId).push(this.appendCount - 1);

    console.log(`   MEMORIA appended | seq=${this.appendCount} | packetId=${packet.packetId} | merkleRoot=${this._merkleRoot}`);
    return { ...entry, merkleRoot: this._merkleRoot };
  }

  // ─── Revision record ───────────────────────────────────────────────────

  /**
   * Record a revision event for a packet.
   * Does NOT overwrite — appends a revision entry to revision history.
   */
  recordRevision(packetId, revisionNote, newVersion, authorityState) {
    const revision = {
      revisionId:    `REV-${this._revisionHistory.length + 1}-${Date.now()}`,
      packetId,
      revisionNote,
      newVersion,
      authorityState,
      timestamp:     Date.now(),
      phi_weight:    PHI * (this._revisionHistory.length + 1),
    };
    this._revisionHistory.push(revision);
    console.log(`   MEMORIA revision recorded | packetId=${packetId} | newVersion=${newVersion}`);
    return revision;
  }

  // ─── Claim ledger ──────────────────────────────────────────────────────

  appendClaim(claim, packetId) {
    const record = {
      claimLedgerId: `CLM-LED-${this._claimLedger.length + 1}`,
      packetId,
      claimId:       claim.id,
      claimClass:    claim.claimClass,
      claimText:     claim.text?.slice(0, 200),
      supported:     claim.supported,
      timestamp:     Date.now(),
    };
    this._claimLedger.push(record);
    return record;
  }

  // ─── Hash ledger ───────────────────────────────────────────────────────

  appendHash(hashRecord) {
    const record = {
      hashLedgerId: `HSH-LED-${this._hashLedger.length + 1}`,
      ...hashRecord,
      timestamp: Date.now(),
    };
    this._hashLedger.push(record);
    return record;
  }

  // ─── Notary ledger ─────────────────────────────────────────────────────

  appendNotaryRecord(notaryRecord) {
    // Block unvalidated external notary claims
    if (notaryRecord.source === 'EXTERNAL_MODEL_UNVALIDATED') {
      return {
        blocked: true,
        reason: 'External model output cannot be promoted as Medina-native notary proof without validation',
      };
    }
    const record = {
      notaryLedgerId: `NTR-LED-${this._notaryLedger.length + 1}`,
      ...notaryRecord,
      timestamp: Date.now(),
    };
    this._notaryLedger.push(record);
    return record;
  }

  // ─── Release decision record ───────────────────────────────────────────

  recordReleaseDecision(packetId, decision, authorityState, reason) {
    const record = {
      releaseDecisionId: `REL-${Date.now()}`,
      packetId,
      decision,        // 'PUBLIC_SAFE' | 'PRIVATE_VAULT' | 'COUNSEL_READY' | etc.
      authorityState,
      reason,
      timestamp: Date.now(),
    };
    this._canonicalLedger.push(record);
    return record;
  }

  // ─── Lineage query ─────────────────────────────────────────────────────

  getLineage(packetId) {
    const indices = this._lineageIndex.get(packetId) || [];
    return indices.map(i => this._canonicalLedger[i]);
  }

  getFullLedger() {
    return [...this._canonicalLedger];  // return a copy — never expose the mutable internal
  }

  getMerkleRoot() {
    return this._merkleRoot;
  }

  getRevisionHistory(packetId) {
    if (!packetId) return [...this._revisionHistory];
    return this._revisionHistory.filter(r => r.packetId === packetId);
  }

  // ─── Merkle tree (simplified) ──────────────────────────────────────────

  /**
   * Build a Merkle root from a list of leaf hashes.
   * hash(parent) = simpleCombine(left, right) iteratively.
   *
   * For a proper implementation, replace _simpleCombine with a
   * cryptographic hash function (e.g. crypto.subtle.digest('SHA-256', ...)).
   */
  _buildMerkleRoot(leaves) {
    if (leaves.length === 0) return null;
    if (leaves.length === 1) return leaves[0];

    let layer = [...leaves];
    while (layer.length > 1) {
      const next = [];
      for (let i = 0; i < layer.length; i += 2) {
        const left  = layer[i];
        const right = layer[i + 1] || left;  // duplicate last leaf if odd count
        next.push(this._simpleCombine(left, right));
      }
      layer = next;
    }
    return layer[0];
  }

  /**
   * φ-weighted hash combine for Merkle nodes.
   * In production, replace with SHA-256(left ∥ right).
   */
  _simpleCombine(left, right) {
    let h = 0;
    for (let i = 0; i < Math.max(left.length, right.length); i++) {
      const lc = left.charCodeAt(i % left.length) || 0;
      const rc = right.charCodeAt(i % right.length) || 0;
      h = (h * 31 + lc * PHI + rc * PHI_INV) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  /**
   * Leaf hash for a packet entry.
   * leafHash = f(packetId ∥ epoch)
   */
  _leafHash(packetId, epoch) {
    let h = 0;
    const s = `${packetId}:${epoch}`;
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i) * PHI) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  // ─── Mayan epoch ───────────────────────────────────────────────────────

  /**
   * Mayan calendar epoch index.
   * Epoch = Math.floor(Date.now() / MAYAN_EPOCH_MS)
   * Groups memory entries into Mayan-cycle-sized temporal windows.
   */
  _mayanEpoch() {
    return Math.floor(Date.now() / MAYAN_EPOCH_MS);
  }

  // ─── Diagnostics ───────────────────────────────────────────────────────

  getStatus() {
    return {
      agentId:       this.agentId,
      uptime:        Date.now() - this.birthTime,
      appendCount:   this.appendCount,
      ledgerSize:    this._canonicalLedger.length,
      claimLedger:   this._claimLedger.length,
      hashLedger:    this._hashLedger.length,
      notaryLedger:  this._notaryLedger.length,
      revisions:     this._revisionHistory.length,
      packetCount:   this._lineageIndex.size,
      merkleRoot:    this._merkleRoot,
      currentEpoch:  this._mayanEpoch(),
    };
  }
}

export default MemoriaEngine;
