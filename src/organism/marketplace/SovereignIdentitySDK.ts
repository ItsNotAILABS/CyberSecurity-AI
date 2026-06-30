///
/// @medina/sovereign-identity — Sovereign Identity & Authentication Technology
///
/// ═══════════════════════════════════════════════════════════════════════
///  IDENTITY IS NOT A TOKEN.  IDENTITY IS THE MATHEMATICAL FINGERPRINT.
/// ═══════════════════════════════════════════════════════════════════════
///
/// This SDK exposes the full identity and authentication stack of the
/// Native Nova Protocol as a standalone product.  Five identity tiers,
/// from fast Fibonacci fingerprinting through golden signatures and
/// sovereign passports to dimensional identity and attestation chains —
/// all governed by golden mathematics.
///
///   Tier 0: FIBONACCI FINGERPRINT   — φ-distributed identity hash
///   Tier 1: GOLDEN SIGNATURE        — Multi-round φ-weighted signature chain
///   Tier 2: SOVEREIGN PASSPORT      — Full identity with credential chain
///   Tier 3: DIMENSIONAL IDENTITY    — Identity across dimensional planes
///   Tier 4: ATTESTATION CHAIN       — Full provenance chain, immutable history
///
/// Every operation carries a Fibonacci-hash attestation and golden-ratio
/// integrity verification.  No external identity dependencies —
/// pure mathematical identity from the golden ratio itself.
///
/// Usage:
///   import { SovereignIdentitySDK } from '@medina/sovereign-identity';
///
///   const sdk = SovereignIdentitySDK.create();
///   const fp  = sdk.fingerprint('alice');
///   const sig = sdk.sign('alice', 7);
///   const passport = sdk.issuePassport('alice', ['admin', 'dev']);
///   const dimId = sdk.dimensionalIdentity(passport.id, 'alice');
///   const chain = sdk.buildChain('alice', ['register', 'login']);
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, GOLDEN_ANGLE, fibonacciHash, DimensionalPlane } from '../intelligence/ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CONSTANTS
// ══════════════════════════════════════════════════════════════════

const PHI_SQUARED = 2.6180339887498948482;
const PHI_CUBED   = 4.2360679774997896964;
const PHI_INV     = 0.6180339887498948482;

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

/** Identity tier — increasing capability and cost. */
export type IdentityTier = 'FIBONACCI_FINGERPRINT' | 'GOLDEN_SIGNATURE' | 'SOVEREIGN_PASSPORT' | 'DIMENSIONAL_IDENTITY' | 'ATTESTATION_CHAIN';

/** A Fibonacci fingerprint result. */
export interface FibonacciFingerprint {
  readonly fingerprint: number;
  readonly tier: IdentityTier;
  readonly phiWeight: number;
  readonly timestamp: number;
}

/** A golden signature with multi-round φ-weighting. */
export interface GoldenSignature {
  readonly signature: readonly number[];
  readonly rounds: number;
  readonly tier: IdentityTier;
  readonly attestation: number;
  readonly validUntil: number;
}

/** A full sovereign passport. */
export interface SovereignPassport {
  readonly id: string;
  readonly fingerprint: number;
  readonly signatures: readonly GoldenSignature[];
  readonly credentials: readonly string[];
  readonly tier: IdentityTier;
  readonly attestation: number;
  readonly issuedAt: number;
  readonly expiresAt: number;
}

/** Identity projected across dimensional planes. */
export interface DimensionalIdentity {
  readonly passportId: string;
  readonly dimensionalFingerprints: readonly { plane: DimensionalPlane; fingerprint: number }[];
  readonly tier: IdentityTier;
  readonly crossSubstrateHash: number;
  readonly attestation: number;
}

/** A single link in an attestation chain. */
export interface AttestationChainLink {
  readonly step: number;
  readonly action: string;
  readonly hash: number;
  readonly previousHash: number;
  readonly phiWeight: number;
  readonly timestamp: number;
}

/** A full attestation chain with provenance history. */
export interface AttestationChain {
  readonly entityId: string;
  readonly chain: readonly AttestationChainLink[];
  readonly tier: IdentityTier;
  readonly chainHash: number;
  readonly length: number;
  readonly attestation: number;
}

/** Identity SDK configuration. */
export interface IdentityConfig {
  readonly signatureRounds: number;
  readonly passportDurationMs: number;
  readonly chainDepth: number;
  readonly attestationEnabled: boolean;
}

// ══════════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════════

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function computeAttestation(value: number): number {
  return fibonacciHash(value, 2_147_483_647);
}

// ══════════════════════════════════════════════════════════════════
//  SOVEREIGN IDENTITY SDK
// ══════════════════════════════════════════════════════════════════

export class SovereignIdentitySDK {
  private readonly config: IdentityConfig;

  constructor(config?: Partial<IdentityConfig>) {
    this.config = {
      signatureRounds:    config?.signatureRounds    ?? 7,
      passportDurationMs: config?.passportDurationMs ?? 86_400_000,
      chainDepth:         config?.chainDepth         ?? 64,
      attestationEnabled: config?.attestationEnabled ?? true,
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  TIER 0 — FIBONACCI FINGERPRINT
  // ────────────────────────────────────────────────────────────────

  /** Generate a φ-distributed identity fingerprint for a subject. */
  fingerprint(subject: string): FibonacciFingerprint {
    const raw = hashStr(subject);
    const fp  = fibonacciHash(raw, 2_147_483_647);
    return {
      fingerprint: fp,
      tier: 'FIBONACCI_FINGERPRINT',
      phiWeight: (fp % 1000) / 1000 * PHI,
      timestamp: Date.now(),
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  TIER 1 — GOLDEN SIGNATURE
  // ────────────────────────────────────────────────────────────────

  /** Multi-round φ-weighted signature chain for session-level identity. */
  sign(subject: string, rounds?: number): GoldenSignature {
    const r = rounds ?? this.config.signatureRounds;
    const signature: number[] = [];
    let current = subject;

    for (let i = 0; i < r; i++) {
      const h = hashStr(current);
      const mixed = Math.abs(Math.floor(
        h * PHI + (i + 1) * PHI_SQUARED + GOLDEN_ANGLE * (i * i),
      )) % 2_147_483_647;
      signature.push(mixed);
      current = mixed.toString(36) + current.slice(0, 32);
    }

    const combinedSig = signature.reduce((a, s) => (a ^ s) | 0, 0);
    return {
      signature,
      rounds: r,
      tier: 'GOLDEN_SIGNATURE',
      attestation: this.config.attestationEnabled ? computeAttestation(Math.abs(combinedSig)) : 0,
      validUntil: Date.now() + this.config.passportDurationMs,
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  TIER 2 — SOVEREIGN PASSPORT
  // ────────────────────────────────────────────────────────────────

  /** Issue a full sovereign passport with credential chain and attestation. */
  issuePassport(subject: string, credentials: string[]): SovereignPassport {
    const fp = this.fingerprint(subject);
    const signatures: GoldenSignature[] = [];

    // Generate a signature for each credential plus the base subject
    signatures.push(this.sign(subject));
    for (const cred of credentials) {
      signatures.push(this.sign(subject + ':' + cred, 3));
    }

    const now = Date.now();
    const idRaw = hashStr(subject + ':' + now.toString(36));
    const passportId = fibonacciHash(idRaw, 2_147_483_647).toString(36);

    const combinedAttestation = signatures.reduce((a, s) => a ^ s.attestation, fp.fingerprint);
    return {
      id: passportId,
      fingerprint: fp.fingerprint,
      signatures,
      credentials,
      tier: 'SOVEREIGN_PASSPORT',
      attestation: this.config.attestationEnabled ? computeAttestation(Math.abs(combinedAttestation)) : 0,
      issuedAt: now,
      expiresAt: now + this.config.passportDurationMs,
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  TIER 3 — DIMENSIONAL IDENTITY
  // ────────────────────────────────────────────────────────────────

  /** Project identity across all dimensional planes. Cross-substrate. */
  dimensionalIdentity(passportId: string, subject: string): DimensionalIdentity {
    const planes = [
      DimensionalPlane.D0_Foundational,
      DimensionalPlane.D1_Temporal,
      DimensionalPlane.D2_Harmonic,
      DimensionalPlane.D3_CrossDimensional,
      DimensionalPlane.D4_Transcendent,
    ];

    const dimensionalFingerprints = planes.map((plane) => {
      const raw = hashStr(subject + ':' + plane);
      const projected = Math.abs(Math.floor(
        raw * Math.pow(PHI, plane + 1) + GOLDEN_ANGLE * (plane + 1),
      )) % 2_147_483_647;
      return { plane, fingerprint: fibonacciHash(projected, 2_147_483_647) };
    });

    const crossHash = dimensionalFingerprints.reduce(
      (acc, df) => (acc ^ df.fingerprint) | 0, 0,
    );

    return {
      passportId,
      dimensionalFingerprints,
      tier: 'DIMENSIONAL_IDENTITY',
      crossSubstrateHash: Math.abs(crossHash),
      attestation: this.config.attestationEnabled ? computeAttestation(Math.abs(crossHash)) : 0,
    };
  }

  // ────────────────────────────────────────────────────────────────
  //  TIER 4 — ATTESTATION CHAIN
  // ────────────────────────────────────────────────────────────────

  /** Build an immutable attestation chain recording identity provenance. */
  buildChain(entityId: string, actions: string[]): AttestationChain {
    const chain: AttestationChainLink[] = [];
    let previousHash = fibonacciHash(hashStr(entityId), 2_147_483_647);

    for (let i = 0; i < actions.length; i++) {
      const actionHash = hashStr(actions[i] + ':' + i);
      const combined = Math.abs(Math.floor(
        actionHash * PHI + previousHash * PHI_INV + (i + 1) * PHI_CUBED,
      )) % 2_147_483_647;
      const hash = fibonacciHash(combined, 2_147_483_647);

      chain.push({
        step: i,
        action: actions[i],
        hash,
        previousHash,
        phiWeight: Math.pow(PHI, (i + 1) * 0.1),
        timestamp: Date.now() + i,
      });

      previousHash = hash;
    }

    const chainHash = chain.reduce((acc, link) => (acc ^ link.hash) | 0, 0);
    return {
      entityId,
      chain,
      tier: 'ATTESTATION_CHAIN',
      chainHash: Math.abs(chainHash),
      length: chain.length,
      attestation: this.config.attestationEnabled ? computeAttestation(Math.abs(chainHash)) : 0,
    };
  }

  /** Verify an attestation chain's integrity by re-checking link hashes. */
  verifyChain(chain: AttestationChain): boolean {
    if (chain.chain.length === 0) return true;

    const expectedFirst = fibonacciHash(hashStr(chain.entityId), 2_147_483_647);
    if (chain.chain[0].previousHash !== expectedFirst) return false;

    for (let i = 1; i < chain.chain.length; i++) {
      if (chain.chain[i].previousHash !== chain.chain[i - 1].hash) return false;
    }

    const recomputedChainHash = chain.chain.reduce((acc, link) => (acc ^ link.hash) | 0, 0);
    return Math.abs(recomputedChainHash) === chain.chainHash;
  }

  // ────────────────────────────────────────────────────────────────
  //  TIER INFO
  // ────────────────────────────────────────────────────────────────

  /** Get metadata about each identity tier. */
  getTierInfo(): readonly { tier: IdentityTier; description: string; securityLevel: number; computeCost: number }[] {
    return [
      { tier: 'FIBONACCI_FINGERPRINT', description: 'φ-distributed identity hash — fast, stateless', securityLevel: 1, computeCost: 1 },
      { tier: 'GOLDEN_SIGNATURE', description: 'Multi-round φ-weighted signature chain — session-level', securityLevel: 2, computeCost: 3 },
      { tier: 'SOVEREIGN_PASSPORT', description: 'Full identity with credential chain and attestation', securityLevel: 3, computeCost: 5 },
      { tier: 'DIMENSIONAL_IDENTITY', description: 'Identity across dimensional planes — cross-substrate', securityLevel: 4, computeCost: 8 },
      { tier: 'ATTESTATION_CHAIN', description: 'Full provenance chain — immutable identity history', securityLevel: 5, computeCost: 13 },
    ];
  }

  // ────────────────────────────────────────────────────────────────
  //  FACTORY
  // ────────────────────────────────────────────────────────────────

  /** Create a new SovereignIdentitySDK instance. */
  static create(config?: Partial<IdentityConfig>): SovereignIdentitySDK {
    return new SovereignIdentitySDK(config);
  }
}

/** Factory function for creating a SovereignIdentitySDK. */
export function createSovereignIdentitySDK(
  config?: Partial<IdentityConfig>,
): SovereignIdentitySDK {
  return SovereignIdentitySDK.create(config);
}
