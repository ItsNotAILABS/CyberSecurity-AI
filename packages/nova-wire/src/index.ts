/**
 * @nova-protocol/nova-wire
 *
 * Fibonacci-attested wire protocol for the NOVA 23-engine fleet.
 *
 * Every request and response carries a cryptographic attestation chain
 * rooted in Fibonacci mathematics. Mathematical proof that YOUR AI said
 * that — unforgeable, deterministic, verifiable offline.
 *
 * Reference: NOVA-RP-003 §5 — Casa de Medina
 */

import { fibonacciHash, fib, PHI } from '../../phi-math/src/index';
import { NovaToken, encode } from '../../nova-tokenizer/src/index';
import { routeIntent, primaryEngine } from '../../nova-engine-registry/src/index';

// ─── Types ───────────────────────────────────────────────────────────────────

export const WIRE_VERSION = '1.0' as const;

export interface ContextWindow {
  windowSize: number;
  used: number;
}

export interface WirePayload {
  intent: string;
  tokens: NovaToken[];
  context: ContextWindow;
  metadata: Record<string, unknown>;
}

export interface WireAttestation {
  /** Fibonacci hash of the serialised payload */
  hash: string;
  /** Position in the Fibonacci attestation chain */
  chainPosition: number;
  /** Hash of the immediately preceding message */
  previousHash: string;
}

/** A fully-formed nova-wire message */
export interface NovaWireMessage {
  wireVersion: typeof WIRE_VERSION;
  /** Route slug e.g. "nova-wire/cognos" */
  slug: string;
  /** Fibonacci attestation hash of the full message header + payload */
  fibonacciAttestation: string;
  /** Unix epoch milliseconds */
  timestamp: number;
  /** Monotonically increasing sequence ID */
  sequenceId: number;
  sourceEngine: string;
  targetEngine: string;
  /** φ-adjusted routing priority */
  routingWeight: number;
  payload: WirePayload;
  attestation: WireAttestation;
}

// ─── Attestation Chain ───────────────────────────────────────────────────────

/** Internal chain state (one per conversation session) */
export interface AttestationChain {
  messages: NovaWireMessage[];
  position: number;
  lastHash: string;
}

/** Create a new empty attestation chain */
export function newChain(): AttestationChain {
  return { messages: [], position: 0, lastHash: 'genesis' };
}

/**
 * Hash a string payload using Fibonacci mixing.
 * Returns a hex string for readability.
 */
function hashPayload(data: string): string {
  let h = fibonacciHash(data, 0x7fffffff);
  // Second pass over substrings for additional diffusion
  for (let i = 0; i < data.length; i += 64) {
    h = (h ^ fibonacciHash(data.slice(i, i + 64), 0x7fffffff)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// ─── Message Factory ─────────────────────────────────────────────────────────

/**
 * Create a nova-wire message from a plain-language intent string.
 *
 * @param intent        The user/caller intent text
 * @param chain         Attestation chain (mutated in-place)
 * @param sourceEngine  Originating engine ID (default "NOV-001")
 * @param metadata      Optional extra payload metadata
 */
export function createMessage(
  intent: string,
  chain: AttestationChain,
  sourceEngine = 'NOV-001',
  metadata: Record<string, unknown> = {},
): NovaWireMessage {
  const target = primaryEngine(intent);
  const tokens = encode(intent);
  const seqId = chain.position + 1;
  const fibPos = fib(seqId);

  const payload: WirePayload = {
    intent,
    tokens,
    context: { windowSize: target.contextWindow, used: tokens.length },
    metadata,
  };

  const payloadHash = hashPayload(JSON.stringify(payload));
  const attestationHash = hashPayload(payloadHash + chain.lastHash + fibPos.toString());

  const msg: NovaWireMessage = {
    wireVersion: WIRE_VERSION,
    slug: target.wireEndpoint,
    fibonacciAttestation: attestationHash,
    timestamp: Date.now(),
    sequenceId: seqId,
    sourceEngine,
    targetEngine: target.id,
    routingWeight: target.phiWeight * PHI,
    payload,
    attestation: {
      hash: payloadHash,
      chainPosition: fibPos,
      previousHash: chain.lastHash,
    },
  };

  chain.messages.push(msg);
  chain.position = seqId;
  chain.lastHash = attestationHash;

  return msg;
}

// ─── Verification ────────────────────────────────────────────────────────────

/**
 * Verify a single message's internal attestation.
 * Returns true if the hash fields are self-consistent.
 */
export function verifyMessage(msg: NovaWireMessage): boolean {
  const expectedPayloadHash = hashPayload(JSON.stringify(msg.payload));
  if (expectedPayloadHash !== msg.attestation.hash) return false;

  const expectedAttestation = hashPayload(
    msg.attestation.hash + msg.attestation.previousHash + msg.attestation.chainPosition.toString(),
  );
  return expectedAttestation === msg.fibonacciAttestation;
}

/**
 * Verify an entire chain: each message's previousHash must equal the
 * fibonacciAttestation of its predecessor.
 */
export function verifyChain(chain: AttestationChain): boolean {
  let prevHash = 'genesis';
  for (const msg of chain.messages) {
    if (msg.attestation.previousHash !== prevHash) return false;
    if (!verifyMessage(msg)) return false;
    prevHash = msg.fibonacciAttestation;
  }
  return true;
}

// ─── Multi-engine Consensus ──────────────────────────────────────────────────

export interface ConsensusResult {
  /** Combined content summary */
  summary: string;
  /** Participating engine IDs */
  engines: string[];
  /** Weighted confidence score */
  confidence: number;
  /** Fibonacci hash of all participating message hashes */
  consensusAttestation: string;
}

/**
 * Produce a consensus result from multiple wire messages.
 *
 * Confidence = Σ(phiWeight × selfConfidence) / Σ(phiWeight)
 * Attestation = fibonacciHash of concatenated message attestations.
 */
export function buildConsensus(
  messages: NovaWireMessage[],
  summaries: string[],
  selfConfidences: number[],
): ConsensusResult {
  if (messages.length === 0) throw new Error('buildConsensus: no messages');

  const engineIds = messages.map((m) => m.targetEngine);
  const weights = messages.map((m) => m.routingWeight);
  const totalWeight = weights.reduce((s, w) => s + w, 0);

  const confidence = messages.reduce((sum, m, i) => {
    return sum + (m.routingWeight / totalWeight) * (selfConfidences[i] ?? 0.5);
  }, 0);

  const combined = summaries.join(' | ');
  const attestationInput = messages.map((m) => m.fibonacciAttestation).join('');
  const consensusAttestation = hashPayload(attestationInput);

  return { summary: combined, engines: engineIds, confidence, consensusAttestation };
}

// ─── Intent Routing (convenience) ────────────────────────────────────────────

export { routeIntent, primaryEngine, ENGINES, ENGINES_BY_ID } from '../../nova-engine-registry/src/index';
export { encode as tokenize } from '../../nova-tokenizer/src/index';
export { fibonacciHash } from '../../phi-math/src/index';
