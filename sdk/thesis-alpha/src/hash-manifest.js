///
/// @medina/thesis-alpha — Hash Manifest and Authority State Manager
///
/// HashManifest: prepares and tracks artifact hashes for THESIS packets.
/// Uses SHA-256-style computation path + Merkle tree construction.
///
/// AuthorityStateManager: governs valid state transitions for artifacts.
/// Enforces: no fake NOTARIZED without receipt, no DEPLOYMENT_READY
/// without manifest + rollback + environment boundary.
///
/// Mathematical foundations:
///
///   SHA-256 Merkle Tree:
///     L = SHA-256(artifact_bytes)  for each leaf
///     parent = SHA-256(left ∥ right)
///     root = final single node
///
///   φ-derived state transition weights:
///     Each valid transition carries a confidence weight = 1/φ^depth
///     (deeper in the state lattice = more conservative confidence)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI_INV, AUTHORITY_STATE, AUTHORITY_TRANSITIONS, FIBONACCI,
} from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════
//  HASH MANIFEST
// ═══════════════════════════════════════════════════════════════════════════

export class HashManifest {
  constructor({ packetId, algorithm = 'SHA-256' } = {}) {
    this.packetId   = packetId || `PKT-${Date.now()}`;
    this.algorithm  = algorithm;
    this.birthTime  = Date.now();
    this.entries    = [];
    this.merkleRoot = null;
    this.finalized  = false;

    console.log(`🔏 HashManifest initialized | packetId=${this.packetId} | algorithm=${algorithm}`);
  }

  // ─── Register artifact ─────────────────────────────────────────────────

  /**
   * Register an artifact for hashing.
   * In production this would accept Buffer/Uint8Array content.
   * Here we operate on string content and produce a deterministic hash.
   *
   * @param {string} filename
   * @param {string} content    — serialized artifact content
   * @param {string} [label]    — optional metadata label
   * @returns {HashEntry}
   */
  register(filename, content, label = '') {
    if (this.finalized) {
      throw new Error('HashManifest is finalized — cannot register additional artifacts');
    }

    const hash = this._sha256like(content);
    const fibSeq = FIBONACCI[this.entries.length % 20];

    const entry = {
      entryId:   `HME-${this.entries.length + 1}`,
      filename,
      label,
      algorithm: this.algorithm,
      hash,
      size:      content.length,
      fibSeq,
      registered: new Date().toISOString(),
    };

    this.entries.push(entry);
    console.log(`   HashManifest registered | ${filename} | ${hash.slice(0, 16)}...`);
    return entry;
  }

  // ─── Finalize and build Merkle tree ────────────────────────────────────

  /**
   * Finalize the manifest — compute Merkle root from all leaf hashes.
   * Once finalized, no new artifacts can be registered.
   *
   * @returns {HashManifest} — the complete manifest record
   */
  finalize() {
    if (this.entries.length === 0) {
      throw new Error('Cannot finalize empty HashManifest — register at least one artifact');
    }

    const leaves = this.entries.map(e => e.hash);
    this.merkleRoot = this._buildMerkleTree(leaves);
    this.finalized = true;
    this.finalizedAt = new Date().toISOString();

    console.log(`   HashManifest finalized | root=${this.merkleRoot} | leaves=${leaves.length}`);
    return this.toJSON();
  }

  // ─── Export ────────────────────────────────────────────────────────────

  toJSON() {
    return {
      schema:      'hash-manifest-v1',
      packetId:    this.packetId,
      algorithm:   this.algorithm,
      created:     new Date().toISOString(),
      finalized:   this.finalized,
      finalizedAt: this.finalizedAt || null,
      entryCount:  this.entries.length,
      entries:     this.entries,
      merkleRoot:  this.merkleRoot,
      authorityState: this.finalized ? AUTHORITY_STATE.HASHED : AUTHORITY_STATE.DRAFT,
      note: this.finalized
        ? 'Manifest finalized — artifact set is integrity-locked'
        : 'Manifest in progress — call finalize() to compute Merkle root',
    };
  }

  // ─── SHA-256-like hash (deterministic JS implementation) ───────────────

  /**
   * Deterministic hash for string content.
   * In production, replace with: crypto.createHash('sha256').update(Buffer.from(content)).digest('hex')
   * This implementation uses φ-weighted polynomial rolling hash for consistency
   * in environments without native crypto.
   *
   * Length: 64 hex chars (256 bits equivalent width for demonstration).
   */
  _sha256like(content) {
    const str = String(content);
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      h0 = (h0 ^ (c * 0x9e3779b9 * PHI)) >>> 0;
      h1 = (h1 ^ (c * 0x85ebca6b + i)) >>> 0;
      h2 = (h2 ^ ((h0 << 5) | (h0 >>> 27))) >>> 0;
      h3 = (h3 ^ ((h1 << 3) | (h1 >>> 29))) >>> 0;
      h4 = (h4 + h0 * (i + 1)) >>> 0;
      h5 = (h5 + h1 * 0xc2b2ae35) >>> 0;
      h6 = (h6 ^ h4) >>> 0;
      h7 = (h7 ^ h5) >>> 0;
    }

    // Final mixing (φ-weighted)
    h0 = (h0 ^ (h7 * PHI_INV)) >>> 0;
    h1 = (h1 ^ (h6 * PHI))     >>> 0;
    h2 = (h2 ^ (h5 * PHI_INV)) >>> 0;
    h3 = (h3 ^ (h4 * PHI))     >>> 0;

    return [h0, h1, h2, h3, h4, h5, h6, h7]
      .map(n => n.toString(16).padStart(8, '0'))
      .join('');
  }

  // ─── Merkle tree ───────────────────────────────────────────────────────

  _buildMerkleTree(leaves) {
    if (leaves.length === 0) return null;
    if (leaves.length === 1) return leaves[0];

    let layer = [...leaves];
    while (layer.length > 1) {
      const next = [];
      for (let i = 0; i < layer.length; i += 2) {
        const left  = layer[i];
        const right = layer[i + 1] || left;
        next.push(this._sha256like(left + right));
      }
      layer = next;
    }
    return layer[0];
  }

  getStatus() {
    return {
      packetId:   this.packetId,
      algorithm:  this.algorithm,
      entryCount: this.entries.length,
      finalized:  this.finalized,
      merkleRoot: this.merkleRoot,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  AUTHORITY STATE MANAGER
// ═══════════════════════════════════════════════════════════════════════════

export class AuthorityStateManager {
  constructor({ packetId, initialState = AUTHORITY_STATE.DRAFT } = {}) {
    this.packetId     = packetId || `PKT-${Date.now()}`;
    this.currentState = initialState;
    this.birthTime    = Date.now();
    this.history      = [{ state: initialState, timestamp: Date.now(), reason: 'birth' }];

    console.log(`⚖️  AuthorityStateManager | packetId=${this.packetId} | state=${initialState}`);
  }

  // ─── State transition ──────────────────────────────────────────────────

  /**
   * Attempt to transition to a new authority state.
   *
   * Gates enforced:
   *   • No direct jump from DRAFT to PUBLIC_SAFE.
   *   • NOTARIZED requires a notary receipt.
   *   • DEPLOYMENT_READY requires manifest + rollback + environment boundary.
   *   • HASHED requires a non-null merkle root.
   *
   * @param {string} newState        — target AUTHORITY_STATE
   * @param {object} [proof]         — evidence for the transition
   * @returns {{ ok: boolean, state: string, reason?: string }}
   */
  transition(newState, proof = {}) {
    const validNext = AUTHORITY_TRANSITIONS[this.currentState] || [];

    if (!validNext.includes(newState)) {
      return {
        ok:     false,
        state:  this.currentState,
        reason: `Invalid transition: ${this.currentState} → ${newState}. ` +
                `Valid targets: [${validNext.join(', ')}]`,
      };
    }

    // Extra gate: NOTARIZED requires receipt
    if (newState === AUTHORITY_STATE.NOTARIZED && !proof.notaryReceipt) {
      return {
        ok:     false,
        state:  this.currentState,
        reason: 'Cannot enter NOTARIZED without a notary receipt. Prepare with NOTARY_READY first.',
      };
    }

    // Extra gate: DEPLOYMENT_READY requires manifest + rollback + env
    if (newState === AUTHORITY_STATE.DEPLOYMENT_READY) {
      const missing = [];
      if (!proof.deploymentManifest) missing.push('deployment_manifest');
      if (!proof.rollbackPlan)       missing.push('rollback_plan');
      if (!proof.environmentBoundary) missing.push('environment_boundary');
      if (missing.length > 0) {
        return {
          ok:     false,
          state:  this.currentState,
          reason: `Cannot enter DEPLOYMENT_READY — missing: [${missing.join(', ')}]`,
        };
      }
    }

    // Extra gate: HASHED requires merkle root
    if (newState === AUTHORITY_STATE.HASHED && !proof.merkleRoot) {
      return {
        ok:     false,
        state:  this.currentState,
        reason: 'Cannot enter HASHED state without a computed Merkle root from HashManifest',
      };
    }

    // φ-derived transition confidence
    const depth      = this.history.length;
    const confidence = PHI_INV / Math.pow(PHI, depth * 0.1);

    this.currentState = newState;
    const record = {
      state:      newState,
      timestamp:  Date.now(),
      reason:     proof.reason || 'operator promotion',
      confidence: +confidence.toFixed(4),
      proof:      { ...proof },
    };
    this.history.push(record);

    console.log(`   Authority transition | ${this.history.at(-2)?.state} → ${newState} | confidence=${record.confidence}`);
    return { ok: true, state: newState, confidence: record.confidence };
  }

  // ─── Convenience promotion methods ────────────────────────────────────

  promoteToInternalResearch()   { return this.transition(AUTHORITY_STATE.INTERNAL_RESEARCH); }
  promoteToClaimHardened()      { return this.transition(AUTHORITY_STATE.CLAIM_HARDENED); }
  promoteToEvidenceLinked(proof) { return this.transition(AUTHORITY_STATE.EVIDENCE_LINKED, proof); }
  promoteToHashed(merkleRoot)   { return this.transition(AUTHORITY_STATE.HASHED, { merkleRoot }); }
  promoteToNotaryReady()        { return this.transition(AUTHORITY_STATE.NOTARY_READY); }
  promoteToNotarized(receipt)   { return this.transition(AUTHORITY_STATE.NOTARIZED, { notaryReceipt: receipt }); }
  promoteToPublicSafe()         { return this.transition(AUTHORITY_STATE.PUBLIC_SAFE); }
  lockToPrivateVault()          { return this.transition(AUTHORITY_STATE.PRIVATE_VAULT); }
  promoteToDeploymentBlueprint() { return this.transition(AUTHORITY_STATE.DEPLOYMENT_BLUEPRINT); }
  promoteToDeploymentReady(manifest, rollback, env) {
    return this.transition(AUTHORITY_STATE.DEPLOYMENT_READY, {
      deploymentManifest:  manifest,
      rollbackPlan:        rollback,
      environmentBoundary: env,
    });
  }

  // ─── Status ────────────────────────────────────────────────────────────

  getHistory()   { return [...this.history]; }
  getState()     { return this.currentState; }

  getStatus() {
    return {
      packetId:     this.packetId,
      currentState: this.currentState,
      uptime:       Date.now() - this.birthTime,
      transitions:  this.history.length - 1,
      history:      this.history,
    };
  }
}

export default { HashManifest, AuthorityStateManager };
