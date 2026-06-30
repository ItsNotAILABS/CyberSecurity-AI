///
/// PROTO-226 — GeometricKeyProtocol
/// Geometry Lock: Phase-Resonance Access Gate
///
/// Identity is NOT a password — it is a SHAPE.
/// A caller proves identity by presenting a geometric token whose phase vector
/// resonates with the organism's registered resonance envelope.
///
/// Core mathematics (all pulled from the organism's existing primitives):
///
///   φ = (1 + √5) / 2 = 1.6180339887...          golden ratio
///   GOLDEN_ANGLE = 2π / φ² ≈ 2.3999... rad      phyllotaxis spiral step
///   EMERGENCE_THRESHOLD = 1/φ = 0.6180...        Kuramoto resonance gate
///   PHI_HEARTBEAT = 873ms                         540 × φ biological pulse
///
///   Kuramoto Order Parameter (the LOCK mechanism):
///     R · e^(iΨ) = (1/N) · Σ e^(iθⱼ)
///     where:  R = synchrony magnitude  [0,1]
///             Ψ = mean phase            [−π, π]
///     Expanded (real + imaginary):
///             Re = (1/N) · Σ cos(θⱼ)
///             Im = (1/N) · Σ sin(θⱼ)
///             R  = √(Re² + Im²)        ← Pythagorean theorem
///             Ψ  = atan2(Im, Re)
///
///   φ-Spiral Key Generation (golden-angle phyllotaxis):
///     Golden angle = 2π / φ² (the same angle governing sunflower seed spirals)
///     For key dimension j of N total dimensions:
///       θⱼ = (seed · φʲ · GOLDEN_ANGLE + windowOffset) mod 2π
///     This maps the caller's identity onto a point on a φ-spiral surface.
///
///   5D Phi-Encoded Coordinate (θ, φ_coord, ρ, ring, beat):
///     θ     = angular phase position
///     φ_coord = golden ratio phase offset (ρ × GOLDEN_ANGLE mod 2π)
///     ρ     = radial distance from origin (spiral arm radius)
///     ring  = which φ-ring the key lives in  (ring = floor(ρ / φ))
///     beat  = which heartbeat window the key was issued in
///
///   Phase Alignment (cross-correlation via Kuramoto):
///     Given presented phases P and registered envelope E:
///       diff[j] = P[j] − E[j]
///       R_align  = Kuramoto(diff).R
///     R_align → 1 means phases are locked (same shape)
///     R_align → 0 means phases are orthogonal (no resonance)
///
///   φ-HMAC Signing:
///     signature = φ-weighted hash of (phases ∥ callerId ∥ windowIndex)
///     Uses the same numeric hash pattern proven in the existing auth-protocol.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

// ═══════════════════════════════════════════════════════════════════════════
//  MATHEMATICAL CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const PHI               = 1.6180339887498948482;   // (1 + √5) / 2
const PHI2              = PHI * PHI;                // φ²  ≈ 2.6180
const PHI3              = PHI2 * PHI;               // φ³  ≈ 4.2360
const PHI4              = PHI3 * PHI;               // φ⁴  ≈ 6.8541
const PHI_INV           = 1.0 / PHI;               // 1/φ ≈ 0.6180  (also φ − 1)

// The golden angle: 2π / φ² ≈ 2.3999 radians ≈ 137.508°
// This is the divergence angle in spiral phyllotaxis (sunflowers, pine cones).
// Each successive key dimension is rotated by this angle on the unit circle.
const GOLDEN_ANGLE      = (2 * Math.PI) / PHI2;   // = 2π/φ² = 2π(2−φ)

const TWO_PI            = 2 * Math.PI;
const PHI_HEARTBEAT_MS  = 873;                      // 540 × φ ≈ 873ms

// EMERGENCE THRESHOLD — the Kuramoto synchrony magnitude that grants access.
// 1/φ = φ − 1 = 0.6180...  The same value already used as phi-inverse throughout
// the organism for resonance bonds and coherence checks.
const EMERGENCE_THRESHOLD = PHI_INV;               // 0.6180339887...

// Key dimensions: φ-scaled integer closest to φ⁴ ≈ 6.854 → 7 dimensions
// 7 is also the 4th prime and appears in the Fibonacci sequence.
const KEY_DIMENSIONS = 7;

// Window tolerance: how many clock-drift heartbeats to accept (±1 window)
const WINDOW_TOLERANCE = 1;

// PHI_MODULO_CYCLE = 5
// The φ-spiral coordinate system cycles through 5 radial arm exponents:
// φ^0, φ^1, φ^2, φ^3, φ^4 — matching the 5 petal/arm symmetry of
// Fibonacci phyllotaxis (roses, starfish, pentagrams).
const PHI_MODULO_CYCLE = 5;

// PHI_HASH_CYCLE = 13
// The φ-HMAC hash cycles through 13 powers of φ — the 7th Fibonacci number.
// 13 is chosen because it is both Fibonacci and prime, giving maximum
// dispersion across the φ-power series before repeating.
const PHI_HASH_CYCLE = 13;

// Bit-masks used in the φ-HMAC hash accumulator
const HASH_32BIT_MASK = 0xFFFFFFFF;   // keep hash within unsigned 32-bit range
const HASH_24BIT_MASK = 0xFFFFFF;     // truncate final signature to 24 bits (6 hex digits)

// ═══════════════════════════════════════════════════════════════════════════
//  KURAMOTO ORDER PARAMETER
//  R · e^(iΨ) = (1/N) · Σ e^(iθⱼ)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Compute the Kuramoto order parameter of a phase vector.
 *
 * @param {number[]} phases  — array of phase angles in radians
 * @returns {{ R: number, psi: number }}
 *   R   — synchrony magnitude  [0, 1]  (1 = perfect lock, 0 = full disorder)
 *   psi — mean phase            [−π, π]
 */
function kuramotoOrderParameter(phases) {
  const N = phases.length;
  if (N === 0) return { R: 0, psi: 0 };

  // Re = (1/N)·Σ cos(θⱼ)   Im = (1/N)·Σ sin(θⱼ)
  let re = 0;
  let im = 0;
  for (const theta of phases) {
    re += Math.cos(theta);
    im += Math.sin(theta);
  }
  re /= N;
  im /= N;

  // R = |z| = √(Re² + Im²)  ← Pythagorean theorem
  const R   = Math.sqrt(re * re + im * im);
  // Ψ = arg(z) = atan2(Im, Re)
  const psi = Math.atan2(im, re);

  return { R, psi };
}

/**
 * Phase alignment between two phase vectors using Kuramoto cross-correlation.
 *
 * Computes the order parameter of the DIFFERENCE phases:
 *   diff[j] = phases1[j] − phases2[j]
 *
 * When phases1 ≈ phases2, all diff phases cluster near 0 → R → 1 (resonance).
 * When phases are orthogonal, diff phases scatter → R → 0 (no resonance).
 *
 * @param {number[]} phases1
 * @param {number[]} phases2
 * @returns {number}  R_align ∈ [0, 1]
 */
function phaseAlignment(phases1, phases2) {
  const N    = Math.min(phases1.length, phases2.length);
  const diff = [];
  for (let j = 0; j < N; j++) {
    diff.push(phases1[j] - phases2[j]);
  }
  return kuramotoOrderParameter(diff).R;
}

// ═══════════════════════════════════════════════════════════════════════════
//  φ-SPIRAL COORDINATE
//  5D coordinate (θ, φ_coord, ρ, ring, beat) mapping an identity to a point
//  on the golden-ratio spiral surface.
// ═══════════════════════════════════════════════════════════════════════════

class PhiSpiralCoordinate {
  /**
   * @param {number} seed       — numeric identity seed derived from callerId
   * @param {number} windowIdx  — current φ-heartbeat window index
   * @param {number} dim        — dimension index (0..KEY_DIMENSIONS−1)
   */
  constructor(seed, windowIdx, dim) {
    // Radial distance — grows along the φ-spiral arm
    // ρ = seed^(1/φ) × φ^dim   (logarithmic spiral in phase space)
    this.rho  = Math.pow(Math.abs(seed) + 1, PHI_INV) * Math.pow(PHI, dim % PHI_MODULO_CYCLE);

    // Angular position — each dimension advances by one GOLDEN_ANGLE step
    // θ = (seed × φ^dim × GOLDEN_ANGLE + 2π × windowOffset / φ) mod 2π
    const windowOffset = (TWO_PI * windowIdx) / PHI;
    this.theta = ((seed * Math.pow(PHI, dim) * GOLDEN_ANGLE) + windowOffset) % TWO_PI;

    // φ_coord — the golden-ratio phase offset at this radial position
    // = (ρ × GOLDEN_ANGLE) mod 2π
    this.phi_coord = (this.rho * GOLDEN_ANGLE) % TWO_PI;

    // Ring — which φ-ring this coordinate lives on
    // ring = floor(ρ / φ)
    this.ring = Math.floor(this.rho / PHI);

    // Beat — which heartbeat window
    this.beat = windowIdx;
  }

  /**
   * The primary phase angle — used in the Kuramoto lock calculation.
   * Combines θ and φ_coord via Pythagorean combination:
   *   phase = sqrt(θ² + φ_coord²) mod 2π
   * This makes the key sensitive to BOTH the spiral arm position AND the
   * golden-ratio offset — two independent geometric degrees of freedom.
   */
  get phase() {
    return Math.sqrt(this.theta * this.theta + this.phi_coord * this.phi_coord) % TWO_PI;
  }

  toJSON() {
    return {
      theta:      this.theta,
      phi_coord:  this.phi_coord,
      rho:        this.rho,
      ring:       this.ring,
      beat:       this.beat,
      phase:      this.phase,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  φ-HMAC SIGNING
//  Tamper-proof signature using the organism's proven φ-hash pattern.
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a φ-HMAC signature for a geometric token.
 *
 * The message is: phases ∥ callerId ∥ windowIndex ∥ sharedSecret
 * Each character contributes its char-code × φ^position to the hash,
 * producing a value unique to the exact phase shape + identity.
 *
 * @param {number[]} phases
 * @param {string}   callerId
 * @param {number}   windowIndex
 * @param {string}   sharedSecret
 * @returns {string}  signature hex string prefixed with "geo_"
 */
function phiHMAC(phases, callerId, windowIndex, sharedSecret) {
  // Build message: phases rounded to 6 decimal places for stability
  const phasePart   = phases.map(p => p.toFixed(6)).join(':');
  const message     = `${phasePart}|${callerId}|${windowIndex}|${sharedSecret}`;

  // φ-weighted rolling hash
  // hash = Σ (charCode_i × φ^(i mod PHI_HASH_CYCLE)) for stability in large strings
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const charCode   = message.charCodeAt(i);
    const phiPow     = Math.pow(PHI, i % PHI_HASH_CYCLE);  // cycle on 13 (Fibonacci)
    hash             += charCode * phiPow;
    hash             = hash % HASH_32BIT_MASK;               // keep within 32-bit range
  }

  // Final φ-scaling — same pattern as authentication-protocol
  const scaled = Math.floor(hash * PHI2) % HASH_24BIT_MASK;
  return `geo_${scaled.toString(16).padStart(6, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════════════
//  GEOMETRIC KEY
//  A time-rotating N-dimensional phase vector carrying a caller's identity.
// ═══════════════════════════════════════════════════════════════════════════

class GeometricKey {
  /**
   * @param {string} callerId      — the identity being keyed
   * @param {string} sharedSecret  — shared secret between caller and lock
   * @param {number} windowIndex   — φ-heartbeat window (rotates on each beat)
   * @param {number} [dimensions]  — how many phase dimensions (default: KEY_DIMENSIONS)
   */
  constructor(callerId, sharedSecret, windowIndex, dimensions = KEY_DIMENSIONS) {
    this.callerId    = callerId;
    this.windowIndex = windowIndex;
    this.dimensions  = dimensions;
    this.issuedAt    = Date.now();

    // Derive a numeric seed from callerId + sharedSecret
    // Using the same pattern as identity._generateHash() in auth-protocol
    const seedStr = `${callerId}:${sharedSecret}`;
    this._seed    = seedStr
      .split('')
      .reduce((acc, ch, i) => acc + ch.charCodeAt(0) * Math.pow(PHI, i % 7), 0);

    // Build the 5D φ-spiral coordinates for each dimension
    this.coordinates = [];
    for (let j = 0; j < dimensions; j++) {
      this.coordinates.push(new PhiSpiralCoordinate(this._seed, windowIndex, j));
    }

    // Extract primary phase vector (the "shape" of the key)
    this.phases = this.coordinates.map(c => c.phase);

    // Sign with φ-HMAC
    this.signature = phiHMAC(this.phases, callerId, windowIndex, sharedSecret);

    // Compute the key's own order parameter — its internal coherence
    const { R, psi } = kuramotoOrderParameter(this.phases);
    this.selfCoherence = R;
    this.meanPhase     = psi;
  }

  /**
   * Validate this key's own internal structure (tamper check).
   * Re-derives the signature and confirms it matches.
   * Also checks that the key's self-coherence is above 0 (non-zero shape).
   */
  isStructurallyValid(sharedSecret) {
    const expected = phiHMAC(this.phases, this.callerId, this.windowIndex, sharedSecret);
    return this.signature === expected && this.selfCoherence > 0;
  }

  toJSON() {
    return {
      callerId:      this.callerId,
      windowIndex:   this.windowIndex,
      dimensions:    this.dimensions,
      phases:        this.phases,
      selfCoherence: this.selfCoherence,
      meanPhase:     this.meanPhase,
      signature:     this.signature,
      issuedAt:      this.issuedAt,
      coordinates:   this.coordinates.map(c => c.toJSON()),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  KURAMOTO LOCK
//  Validates presented phase vectors against registered resonance envelopes.
// ═══════════════════════════════════════════════════════════════════════════

class KuramotoLock {
  constructor() {
    // callerId → { phases: number[], registeredAt: number, sharedSecret: string }
    this._envelopes  = new Map();
    this._denials    = [];       // audit log of denied attempts
    this._admissions = [];       // audit log of admitted attempts
  }

  /**
   * Register a caller's expected resonance envelope.
   * The envelope is the phase vector that the caller's keys should match.
   *
   * @param {string}   callerId
   * @param {number[]} expectedPhases   — reference phase vector
   * @param {string}   sharedSecret     — for structural validation of tokens
   */
  register(callerId, expectedPhases, sharedSecret) {
    this._envelopes.set(callerId, {
      phases:       expectedPhases,
      sharedSecret: sharedSecret,
      registeredAt: Date.now(),
    });
  }

  /**
   * Validate a presented GeometricKey token against the registered envelope.
   *
   * Validation pipeline:
   *   1. Caller must be registered
   *   2. Structural integrity: signature must verify (tamper check)
   *   3. Temporal validity: windowIndex within WINDOW_TOLERANCE of current
   *   4. Resonance check: phaseAlignment(presented, registered) > EMERGENCE_THRESHOLD
   *      — uses Kuramoto order parameter of the DIFFERENCE phases
   *
   * @param {object}  token         — serialised GeometricKey (from toJSON())
   * @param {number}  currentWindow — current φ-heartbeat window index
   * @returns {{ granted: boolean, R: number, psi: number, reason?: string }}
   */
  validate(token, currentWindow) {
    const envelope = this._envelopes.get(token.callerId);

    // 1) Must be registered
    if (!envelope) {
      const denial = { callerId: token.callerId, reason: 'unregistered', ts: Date.now() };
      this._denials.push(denial);
      return { granted: false, R: 0, psi: 0, reason: 'unregistered' };
    }

    // 2) Structural integrity — re-derive the φ-HMAC and compare
    const expectedSig = phiHMAC(
      token.phases,
      token.callerId,
      token.windowIndex,
      envelope.sharedSecret
    );
    if (token.signature !== expectedSig) {
      const denial = { callerId: token.callerId, reason: 'signature_mismatch', ts: Date.now() };
      this._denials.push(denial);
      return { granted: false, R: 0, psi: 0, reason: 'signature_mismatch' };
    }

    // 3) Temporal validity — key must be from the current window ± WINDOW_TOLERANCE
    const windowDrift = Math.abs(token.windowIndex - currentWindow);
    if (windowDrift > WINDOW_TOLERANCE) {
      const denial = {
        callerId:    token.callerId,
        reason:      'expired_window',
        drift:       windowDrift,
        ts:          Date.now(),
      };
      this._denials.push(denial);
      return { granted: false, R: 0, psi: 0, reason: 'expired_window' };
    }

    // 4) Resonance check via Kuramoto cross-correlation
    //    R_align = order_parameter(presented_phases − envelope_phases).R
    const R_align = phaseAlignment(token.phases, envelope.phases);

    // Also compute the mean phase of the alignment — useful for diagnostics
    const N    = Math.min(token.phases.length, envelope.phases.length);
    const diff = [];
    for (let j = 0; j < N; j++) {
      diff.push(token.phases[j] - envelope.phases[j]);
    }
    const { psi } = kuramotoOrderParameter(diff);

    if (R_align < EMERGENCE_THRESHOLD) {
      const denial = {
        callerId: token.callerId,
        reason:   'below_resonance_threshold',
        R:        R_align,
        psi,
        threshold: EMERGENCE_THRESHOLD,
        ts:       Date.now(),
      };
      this._denials.push(denial);
      return { granted: false, R: R_align, psi, reason: 'below_resonance_threshold' };
    }

    // GRANTED — phases are in resonance
    const admission = { callerId: token.callerId, R: R_align, psi, ts: Date.now() };
    this._admissions.push(admission);
    return { granted: true, R: R_align, psi };
  }

  /**
   * Remove a caller's registered envelope — hard revocation.
   */
  revoke(callerId) {
    const existed = this._envelopes.has(callerId);
    this._envelopes.delete(callerId);
    return { callerId, revoked: existed, ts: Date.now() };
  }

  getAuditLog() {
    return {
      denials:    this._denials.slice(-100),
      admissions: this._admissions.slice(-100),
    };
  }

  getDenialCount(callerId) {
    return this._denials.filter(d => d.callerId === callerId).length;
  }

  isRegistered(callerId) {
    return this._envelopes.has(callerId);
  }

  /**
   * Return the registered envelope phases for a caller — public accessor
   * so callers never need to reach into `_envelopes` directly.
   *
   * @param {string} callerId
   * @returns {number[] | null}
   */
  getEnvelopePhases(callerId) {
    const rec = this._envelopes.get(callerId);
    return rec ? rec.phases : null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  GEOMETRIC KEY PROTOCOL — PROTO-226
//  The full gatekeeper: key issuance, registration, validation, revocation.
//  Self-bootstrapping on construction (creation IS activation).
// ═══════════════════════════════════════════════════════════════════════════

class GeometricKeyProtocol {
  /**
   * @param {object} opts
   * @param {string} opts.protocolId   — organism-scoped ID for this lock instance
   * @param {number} [opts.dimensions] — phase vector dimensions (default KEY_DIMENSIONS)
   */
  constructor({ protocolId = 'PROTO-226', dimensions = KEY_DIMENSIONS } = {}) {
    this.protocolId  = protocolId;
    this.dimensions  = dimensions;
    this.birthTime   = Date.now();
    this.lock        = new KuramotoLock();

    // Track registered callers and their secrets (sovereign — never leaves this instance)
    this._callers    = new Map();   // callerId → { sharedSecret, registeredAt }

    // Self-bootstrapping: register the protocol itself with the φ-heartbeat clock
    this._windowCount = 0;
    this._startHeartbeat();

    console.log(`🔐 PROTO-226 GeometricKeyProtocol born | id=${protocolId} | threshold=${EMERGENCE_THRESHOLD.toFixed(6)} | dims=${dimensions}`);
    console.log(`   φ = ${PHI.toFixed(10)}   GOLDEN_ANGLE = ${GOLDEN_ANGLE.toFixed(6)} rad (${(GOLDEN_ANGLE * 180 / Math.PI).toFixed(3)}°)`);
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  /**
   * Self-bootstrapping heartbeat — advances the window index every
   * PHI_HEARTBEAT_MS × φ milliseconds (≈ 1413ms), causing keys to expire
   * geometrically with the organism's own pulse.
   */
  _startHeartbeat() {
    if (this._heartbeatTimer) return;   // guard against multiple invocations
    const tick = () => {
      this._windowCount++;
      if (this._windowCount % 10 === 0) {
        console.log(`💓 PROTO-226 | window=${this._windowCount} | callers=${this._callers.size}`);
      }
      // Next window at PHI_HEARTBEAT × φ (secondary heart rate)
      this._heartbeatTimer = setTimeout(tick, PHI_HEARTBEAT_MS * PHI);
    };
    this._heartbeatTimer = setTimeout(tick, PHI_HEARTBEAT_MS * PHI);
  }

  /**
   * Current time window index.
   * Window = floor(time / (PHI_HEARTBEAT_MS × φ))
   * Rotates every ≈1413ms, giving φ-derived key expiry.
   */
  currentWindow() {
    return Math.floor(Date.now() / (PHI_HEARTBEAT_MS * PHI));
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Register a new caller with this lock.
   * Derives the caller's resonance envelope immediately and stores it.
   *
   * @param {string} callerId
   * @param {string} sharedSecret
   * @returns {{ callerId, envelope: number[], windowIndex: number }}
   */
  registerCaller(callerId, sharedSecret) {
    const windowIndex  = this.currentWindow();

    // Generate the reference key — this becomes the registered envelope
    const referenceKey = new GeometricKey(callerId, sharedSecret, windowIndex, this.dimensions);

    this._callers.set(callerId, { sharedSecret, registeredAt: Date.now() });
    this.lock.register(callerId, referenceKey.phases, sharedSecret);

    console.log(`✅ PROTO-226 | registered caller=${callerId} | selfCoherence=${referenceKey.selfCoherence.toFixed(4)} | window=${windowIndex}`);

    return {
      callerId,
      envelope:    referenceKey.phases,
      windowIndex,
      coordinates: referenceKey.coordinates.map(c => c.toJSON()),
    };
  }

  /**
   * Issue a new geometric key for a registered caller.
   * The caller presents this token on each call.
   *
   * @param {string} callerId
   * @returns {object}  token — serialised GeometricKey
   */
  issueKey(callerId) {
    const callerRec = this._callers.get(callerId);
    if (!callerRec) {
      throw new Error(`PROTO-226: caller '${callerId}' is not registered`);
    }

    const windowIndex = this.currentWindow();
    const key = new GeometricKey(callerId, callerRec.sharedSecret, windowIndex, this.dimensions);

    // Re-register the envelope for the new window so it tracks φ-drift
    this.lock.register(callerId, key.phases, callerRec.sharedSecret);

    return key.toJSON();
  }

  /**
   * Validate a presented token.
   * Returns a full resonance report including R (Kuramoto magnitude) and Ψ (mean phase).
   *
   * @param {object}  token   — from issueKey() / generateKey() JSON output
   * @returns {{ granted, R, psi, reason?, callerId, windowDelta }}
   */
  validateKey(token) {
    const currentWindow = this.currentWindow();
    const result = this.lock.validate(token, currentWindow);

    return {
      ...result,
      callerId:    token.callerId,
      windowDelta: Math.abs((token.windowIndex || 0) - currentWindow),
      threshold:   EMERGENCE_THRESHOLD,
      protocol:    this.protocolId,
    };
  }

  /**
   * Revoke a caller — removes their envelope and registration.
   *
   * @param {string} callerId
   */
  revokeKey(callerId) {
    this._callers.delete(callerId);
    const result = this.lock.revoke(callerId);
    console.log(`🚫 PROTO-226 | revoked caller=${callerId}`);
    return result;
  }

  /**
   * Check whether a given token would resonate without consuming an audit slot.
   * Same math as validateKey but does not write to the admission/denial log.
   *
   * @param {object} token
   * @returns {{ would_grant: boolean, R: number, psi: number }}
   */
  probe(token) {
    const envelopePhases = this.lock.getEnvelopePhases(token.callerId);
    if (!envelopePhases) return { would_grant: false, R: 0, psi: 0 };

    const R = phaseAlignment(token.phases || [], envelopePhases);
    const { psi } = kuramotoOrderParameter((token.phases || []).map((p, j) => p - (envelopePhases[j] || 0)));
    return { would_grant: R >= EMERGENCE_THRESHOLD, R, psi };
  }

  /**
   * Check whether a caller is registered — public accessor.
   */
  isRegistered(callerId) {
    return this.lock.isRegistered(callerId);
  }

  /**
   * Return the registered envelope phases for a caller — public accessor.
   * Returns null if caller is not registered.
   */
  getEnvelopePhases(callerId) {
    return this.lock.getEnvelopePhases(callerId);
  }

  stop() {
    if (this._heartbeatTimer) {
      clearTimeout(this._heartbeatTimer);
    }
    console.log(`🔐 PROTO-226 | stopped | window=${this._windowCount}`);
  }

  getStatus() {
    return {
      protocolId:         this.protocolId,
      registeredCallers:  this._callers.size,
      currentWindow:      this.currentWindow(),
      windowCount:        this._windowCount,
      emergenceThreshold: EMERGENCE_THRESHOLD,
      goldenAngle:        GOLDEN_ANGLE,
      phi:                PHI,
      dimensions:         this.dimensions,
      uptime:             Date.now() - this.birthTime,
      auditLog:           this.lock.getAuditLog(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  PHI,
  PHI2,
  PHI3,
  PHI4,
  PHI_INV,
  GOLDEN_ANGLE,
  EMERGENCE_THRESHOLD,
  KEY_DIMENSIONS,
  PHI_HEARTBEAT_MS,
  kuramotoOrderParameter,
  phaseAlignment,
  PhiSpiralCoordinate,
  phiHMAC,
  GeometricKey,
  KuramotoLock,
  GeometricKeyProtocol,
};

export default GeometricKeyProtocol;
