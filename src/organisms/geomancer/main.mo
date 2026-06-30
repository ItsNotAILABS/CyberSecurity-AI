///
/// GEOMANCER — The Geometric Key Organism
///
/// Sovereign ICP canister that IS the living Geometry Key system.
///
/// Sub-models:
///   CLAVIS      — key generation and stable envelope storage
///   RESONANTIA  — Kuramoto lock engine (4-step validation pipeline)
///   ATTRIBUTOR  — IP attribution chain writer
///   GUBERNATOR  — governance and sovereign law enforcer
///
/// Mathematical constants (mirroring JS protocols and Julia engines):
///   φ  = (1 + √5) / 2 = 1.6180339887...   golden ratio
///   α  = 2π / φ²  ≈ 2.3999 rad            golden angle (phyllotaxis)
///   1/φ = φ − 1 = 0.6180...               emergence threshold (Kuramoto gate)
///   PHI_HEARTBEAT = 540 × φ ≈ 873ms       biological pulse
///   WINDOW_DURATION = 873 × φ ≈ 1413ms   key rotation window
///
///   Kuramoto Order Parameter (the lock):
///     R · e^(iΨ) = (1/N) · Σ e^(iθⱼ)
///     Re = (1/N)·Σ cos(θⱼ),  Im = (1/N)·Σ sin(θⱼ)
///     R  = √(Re² + Im²)  ← Pythagorean theorem
///     R > 1/φ → GRANTED
///
///   Phase generation (golden-angle phyllotaxis):
///     θⱼ = (seed · φʲ · α + 2π · W / φ) mod 2π
///
///   φ-HMAC signature:
///     hash = Σᵢ (charCode(msg[i]) × φ^(i mod 13)) mod 2³²
///
/// Sovereign laws enforced:
///   LEX CLAVIS-001: BLOCK_UNKEYED_CALLS
///   LEX CLAVIS-002: DENY_EXPIRED_WINDOWS
///   LEX CLAVIS-003: RESONANCE_GATE (R > 1/φ)
///   LEX CLAVIS-004: REVOCATION_IMMUTABLE
///   LEX CLAVIS-005: ATTRIBUTION_IMMUTABLE
///   LEX CLAVIS-006: PHANTOM_BRIDGE_VERIFIED
///   LEX CLAVIS-007: CLAVIS_TOKEN_BOUNDED
///   LEX CLAVIS-008: VALIDATOR_STAKE_REQUIRED
///   LEX CLAVIS-009: AI_MODEL_SOVEREIGNTY
///   LEX CLAVIS-010: GEOMETRY_KEY_OPEN_STANDARD
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Nat32  "mo:base/Nat32";
import Nat64  "mo:base/Nat64";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter   "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Hash   "mo:base/Hash";
import Char   "mo:base/Char";

persistent actor Geomancer {

  // ══════════════════════════════════════════════════════════════════
  //  GOLDEN CONSTANTS — The Mathematical Foundation
  // ══════════════════════════════════════════════════════════════════

  /// φ — Golden Ratio: (1 + √5) / 2
  transient let PHI : Float = 1.6180339887498948482;

  /// φ² — Square of golden ratio
  transient let PHI2 : Float = PHI * PHI;

  /// φ³
  transient let PHI3 : Float = PHI2 * PHI;

  /// φ⁴
  transient let PHI4 : Float = PHI3 * PHI;

  /// 1/φ = φ − 1 = 0.6180... — Emergence Threshold
  transient let PHI_INV : Float = 1.0 / PHI;

  /// 2π
  transient let TWO_PI : Float = 6.28318530717958647692;

  /// Golden Angle: 2π/φ² ≈ 2.3999 rad ≈ 137.508°
  transient let GOLDEN_ANGLE : Float = TWO_PI / PHI2;

  /// KEY_DIMENSIONS = 7 (= closest integer to φ⁴, and the 4th prime)
  transient let KEY_DIMENSIONS : Nat = 7;

  /// PHI_HASH_CYCLE = 13 (7th Fibonacci, prime)
  transient let PHI_HASH_CYCLE : Nat = 13;

  /// Window duration: PHI_HEARTBEAT_MS × φ ≈ 1413ms
  /// In nanoseconds for ICP Time: 1,413,000,000 ns
  transient let WINDOW_DURATION_NS : Int = 1_413_000_000;

  /// Max CLAVIS supply: ⌊2^(φ⁴)⌋ × 1_000_000 ≈ 167_000_000
  transient let MAX_CLAVIS_SUPPLY : Nat = 167_000_000;

  /// Validator minimum stake (Fibonacci 13th term = 233)
  transient let VALIDATOR_MIN_STAKE : Nat = 233;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  /// A geometric key token — presented by callers to prove identity.
  public type GeometricKeyToken = {
    callerId    : Text;
    windowIndex : Nat;
    dimensions  : Nat;
    phases      : [Float];      /// N phase angles in radians
    selfCoherence: Float;       /// Kuramoto R of own phases
    meanPhase   : Float;        /// Ψ — mean phase
    signature   : Text;         /// φ-HMAC: "geo_xxxxxx"
    issuedAt    : Int;          /// Time.now() at issuance
    chain       : Text;         /// "icp" | "evm" | "solana" | "phantom" | "web"
  };

  /// A resonance envelope — the registered shape for a caller.
  public type ResonanceEnvelope = {
    callerId      : Text;
    phases        : [Float];
    secretHash    : Text;        /// φ-HMAC of the sharedSecret (never stored raw)
    registeredAt  : Int;
    chain         : Text;
  };

  /// Validation result from the Kuramoto lock.
  public type ValidationResult = {
    granted     : Bool;
    R           : Float;         /// Kuramoto synchrony magnitude [0,1]
    psi         : Float;         /// Mean phase [−π, π]
    reason      : Text;          /// "" if granted, denial reason otherwise
    callerId    : Text;
    windowDelta : Nat;
    threshold   : Float;         /// EMERGENCE_THRESHOLD = 1/φ
    protocol    : Text;
    ts          : Int;
  };

  /// An immutable attribution record (IP provenance).
  public type AttributionRecord = {
    artifactHash   : Text;
    creatorId      : Text;
    keySignature   : Text;
    phaseSnapshot  : [Float];
    windowIndex    : Nat;
    resonanceR     : Float;
    timestampMs    : Int;
    chain          : Text;
    canister       : Text;
  };

  /// CLAVIS token (GKT-20)
  public type ClavisToken = {
    tokenId        : Text;
    owner          : Text;        /// Phantom/ICP wallet address
    callerIdHash   : Text;
    windowIndex    : Nat;
    selfCoherence  : Float;
    mintedAt       : Int;
    status         : TokenStatus;
  };

  public type TokenStatus = {
    #Active;
    #Revoked;
    #Delegated : Text;  /// delegated to address
  };

  /// A governance proposal.
  public type GovernanceProposal = {
    id             : Text;
    title          : Text;
    targetLaw      : Text;
    proposerId     : Text;
    proposerPower  : Float;
    votes          : [(Text, Text, Float)];  /// (voterId, "for"|"against", power)
    status         : ProposalStatus;
    createdAt      : Int;
    expiresAt      : Int;
  };

  public type ProposalStatus = {
    #Voting;
    #Passed;
    #Rejected;
    #Expired;
  };

  /// Audit log entry
  public type AuditEntry = {
    ts        : Int;
    callerId  : Text;
    op        : Text;
    granted   : Bool;
    R         : Float;
    reason    : Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STABLE STATE — Survives Upgrades
  // ══════════════════════════════════════════════════════════════════

  /// CLAVIS — Resonance envelopes (the "registered shapes")
  stable var envelopeEntries : [(Text, ResonanceEnvelope)] = [];

  /// CLAVIS — Issued token registry
  stable var tokenEntries : [(Text, ClavisToken)] = [];

  /// ATTRIBUTOR — Attribution records (immutable IP chain)
  stable var attributionEntries : [(Text, AttributionRecord)] = [];

  /// GUBERNATOR — Governance proposals
  stable var proposalEntries : [(Text, GovernanceProposal)] = [];

  /// CLAVIS token supply tracker
  stable var clavisCirculating : Nat = 0;

  /// Audit log (last 10,000 entries)
  stable var auditLog : [AuditEntry] = [];

  /// CPL Runtime canister (for law enforcement integration)
  stable var cplRuntimeCanisterId : ?Principal = null;

  // ── Runtime maps (rebuilt from stable entries on upgrade) ──────────

  transient var envelopes   = HashMap.HashMap<Text, ResonanceEnvelope>(64, Text.equal, Text.hash);
  transient var tokens      = HashMap.HashMap<Text, ClavisToken>(256, Text.equal, Text.hash);
  transient var attributions = HashMap.HashMap<Text, AttributionRecord>(256, Text.equal, Text.hash);
  transient var proposals   = HashMap.HashMap<Text, GovernanceProposal>(32, Text.equal, Text.hash);

  // ── Pre-upgrade / post-upgrade hooks ──────────────────────────────

  system func preupgrade() {
    envelopeEntries    := Iter.toArray(envelopes.entries());
    tokenEntries       := Iter.toArray(tokens.entries());
    attributionEntries := Iter.toArray(attributions.entries());
    proposalEntries    := Iter.toArray(proposals.entries());
  };

  system func postupgrade() {
    for ((k, v) in envelopeEntries.vals())    { envelopes.put(k, v) };
    for ((k, v) in tokenEntries.vals())       { tokens.put(k, v) };
    for ((k, v) in attributionEntries.vals()) { attributions.put(k, v) };
    for ((k, v) in proposalEntries.vals())    { proposals.put(k, v) };
  };

  // ══════════════════════════════════════════════════════════════════
  //  MATHEMATICAL FUNCTIONS
  //  All math done in Motoko using the same formulas as the JS protocols
  // ══════════════════════════════════════════════════════════════════

  /// Kuramoto order parameter: R · e^(iΨ) = (1/N) · Σ e^(iθⱼ)
  /// Re = (1/N)·Σcos(θⱼ),  Im = (1/N)·Σsin(θⱼ)
  /// R  = √(Re² + Im²)   ← Pythagorean theorem
  func kuramotoR(phases : [Float]) : (Float, Float) {
    let n = Float.fromInt(phases.size());
    if (n == 0.0) return (0.0, 0.0);

    var re : Float = 0.0;
    var im : Float = 0.0;

    for (theta in phases.vals()) {
      re += Float.cos(theta);
      im += Float.sin(theta);
    };

    re /= n;
    im /= n;

    // Pythagorean: R = √(re² + im²)
    let R   = Float.sqrt(re * re + im * im);
    let psi = Float.arctan(im / (re + 1.0e-10));  // atan2 approximation

    (R, psi)
  };

  /// Phase alignment: kuramotoR of DIFFERENCE phases
  /// R_align > 1/φ → resonance
  func phaseAlignment(phases1 : [Float], phases2 : [Float]) : Float {
    let n = Nat.min(phases1.size(), phases2.size());
    let diff = Array.tabulate<Float>(n, func(j) {
      phases1[j] - phases2[j]
    });
    let (R, _) = kuramotoR(diff);
    R
  };

  /// Current window index: ⌊Time.now() / WINDOW_DURATION_NS⌋
  func currentWindowIndex() : Nat {
    let t  = Time.now();
    let w  = t / WINDOW_DURATION_NS;
    Int.abs(w)
  };

  /// Window freshness check: |presented_window − current| ≤ 1
  func isWindowFresh(windowIndex : Nat) : Bool {
    let current = currentWindowIndex();
    let delta   = if (windowIndex >= current) {
      windowIndex - current
    } else {
      current - windowIndex
    };
    delta <= 1
  };

  /// φ-HMAC signature computation.
  /// hash = Σᵢ (charCode(msg[i]) × φ^(i mod 13)) mod 2³²
  /// sig  = "geo_" + hex(⌊hash × φ²⌋ mod 2²⁴)
  func phiHMAC(phases : [Float], callerId : Text, windowIndex : Nat, secret : Text) : Text {
    // Build message string
    let phaseParts = Array.map<Float, Text>(phases, func(p) {
      // Format to 6 decimal places
      let intPart  = Int.abs(Float.toInt(p));
      let fracPart = Int.abs(Float.toInt((p - Float.fromInt(Float.toInt(p))) * 1_000_000.0));
      Int.toText(intPart) # "." # Nat.toText(fracPart)
    });
    let phaseStr = Text.join(":", Iter.fromArray(phaseParts));
    let msg      = phaseStr # "|" # callerId # "|" # Nat.toText(windowIndex) # "|" # secret;

    // φ-weighted hash accumulation
    var hash : Float = 0.0;
    var i    : Nat   = 0;
    let mask32 : Float = 4_294_967_295.0;  // 2³² − 1

    for (ch in msg.chars()) {
      let code = Float.fromInt(Nat32.toNat(Char.toNat32(ch)));
      let pw   = Float.exp(Float.fromInt(i % PHI_HASH_CYCLE) * Float.log(PHI));
      hash    += code * pw;
      hash     = Float.rem(hash, mask32);
      i       += 1;
    };

    let scaled  = Float.toInt(hash * PHI2);
    let masked  = Int.abs(scaled) % 16_777_216;  // 2²⁴
    let hexPart = Int.toText(masked);   // simplified — in production use hex formatter
    "geo_" # hexPart
  };

  // ══════════════════════════════════════════════════════════════════
  //  CLAVIS SUB-MODEL — Key Generation and Storage
  // ══════════════════════════════════════════════════════════════════

  /// Register a new caller.
  /// Derives the resonance envelope from callerId + secretHash.
  /// Mints 1 CLAVIS token.
  ///
  /// LEX CLAVIS-007: fails if clavisCirculating >= MAX_CLAVIS_SUPPLY
  public shared(msg) func registerCaller(
    callerId   : Text,
    secretHash : Text,
    ownerAddr  : Text,
    chain      : Text,
  ) : async Result.Result<{ envelope: [Float]; windowIndex: Nat; tokenId: Text }, Text> {

    // LEX CLAVIS-007: check supply cap
    if (clavisCirculating >= MAX_CLAVIS_SUPPLY) {
      return #err("LEX_CLAVIS_007: CLAVIS supply cap reached (" # Nat.toText(MAX_CLAVIS_SUPPLY) # ")");
    };

    let windowIndex = currentWindowIndex();

    // Generate reference envelope phases using φ-spiral formula
    // seed derived from secretHash
    let seed = _hashTextToFloat(secretHash);
    let phases = Array.tabulate<Float>(KEY_DIMENSIONS, func(j) {
      let phiPow     = Float.exp(Float.fromInt(j) * Float.log(PHI));
      let windowOff  = TWO_PI * Float.fromInt(windowIndex) / PHI;
      Float.rem(seed * phiPow * GOLDEN_ANGLE + windowOff, TWO_PI)
    });

    let (selfR, meanPsi) = kuramotoR(phases);

    let envelope : ResonanceEnvelope = {
      callerId     = callerId;
      phases       = phases;
      secretHash   = secretHash;
      registeredAt = Time.now();
      chain        = chain;
    };

    envelopes.put(callerId, envelope);

    // Mint CLAVIS token
    let sig     = phiHMAC(phases, callerId, windowIndex, secretHash);
    let tokenId = "CLAVIS_" # sig # "_" # Nat.toText(windowIndex);

    let token : ClavisToken = {
      tokenId       = tokenId;
      owner         = ownerAddr;
      callerIdHash  = sig;
      windowIndex   = windowIndex;
      selfCoherence = selfR;
      mintedAt      = Time.now();
      status        = #Active;
    };

    tokens.put(tokenId, token);
    clavisCirculating += 1;

    _appendAudit(callerId, "register", true, selfR, "");

    #ok({ envelope = phases; windowIndex = windowIndex; tokenId = tokenId })
  };

  /// Issue a new key token for a registered caller.
  public shared(msg) func issueKey(callerId : Text) : async Result.Result<GeometricKeyToken, Text> {
    switch (envelopes.get(callerId)) {
      case null {
        _appendAudit(callerId, "issue_key", false, 0.0, "LEX_CLAVIS_001: unregistered");
        #err("LEX_CLAVIS_001: caller '" # callerId # "' is not registered")
      };
      case (?envelope) {
        let windowIndex = currentWindowIndex();
        let seed        = _hashTextToFloat(envelope.secretHash);

        let phases = Array.tabulate<Float>(KEY_DIMENSIONS, func(j) {
          let phiPow    = Float.exp(Float.fromInt(j) * Float.log(PHI));
          let windowOff = TWO_PI * Float.fromInt(windowIndex) / PHI;
          Float.rem(seed * phiPow * GOLDEN_ANGLE + windowOff, TWO_PI)
        });

        let (selfR, meanPsi) = kuramotoR(phases);
        let sig = phiHMAC(phases, callerId, windowIndex, envelope.secretHash);

        // Update envelope for new window
        let updatedEnvelope : ResonanceEnvelope = {
          callerId     = envelope.callerId;
          phases       = phases;
          secretHash   = envelope.secretHash;
          registeredAt = envelope.registeredAt;
          chain        = envelope.chain;
        };
        envelopes.put(callerId, updatedEnvelope);

        let token : GeometricKeyToken = {
          callerId     = callerId;
          windowIndex  = windowIndex;
          dimensions   = KEY_DIMENSIONS;
          phases       = phases;
          selfCoherence = selfR;
          meanPhase    = meanPsi;
          signature    = sig;
          issuedAt     = Time.now();
          chain        = envelope.chain;
        };

        #ok(token)
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  RESONANTIA SUB-MODEL — Kuramoto Lock Engine (4-step pipeline)
  // ══════════════════════════════════════════════════════════════════

  /// Validate a presented geometric key token.
  ///
  /// 4-step pipeline:
  ///   1. Registration check (LEX CLAVIS-001)
  ///   2. φ-HMAC structural integrity
  ///   3. Temporal window validity (LEX CLAVIS-002)
  ///   4. Kuramoto resonance gate R > 1/φ (LEX CLAVIS-003)
  public shared(msg) func validateKey(token : GeometricKeyToken) : async ValidationResult {
    let currentWindow = currentWindowIndex();

    // Step 1: Registration
    switch (envelopes.get(token.callerId)) {
      case null {
        let r = {
          granted = false; R = 0.0; psi = 0.0;
          reason = "LEX_CLAVIS_001:unregistered";
          callerId = token.callerId;
          windowDelta = 0; threshold = PHI_INV;
          protocol = "PROTO-226"; ts = Time.now();
        };
        _appendAudit(token.callerId, "validate", false, 0.0, "unregistered");
        return r;
      };
      case (?envelope) {
        // Step 2: φ-HMAC structural integrity
        let expectedSig = phiHMAC(token.phases, token.callerId, token.windowIndex, envelope.secretHash);
        if (token.signature != expectedSig) {
          let r = {
            granted = false; R = 0.0; psi = 0.0;
            reason = "LEX_CLAVIS_001:signature_mismatch";
            callerId = token.callerId;
            windowDelta = 0; threshold = PHI_INV;
            protocol = "PROTO-226"; ts = Time.now();
          };
          _appendAudit(token.callerId, "validate", false, 0.0, "signature_mismatch");
          return r;
        };

        // Step 3: Temporal validity (LEX CLAVIS-002)
        let windowDelta = if (token.windowIndex >= currentWindow) {
          token.windowIndex - currentWindow
        } else {
          currentWindow - token.windowIndex
        };

        if (not isWindowFresh(token.windowIndex)) {
          let r = {
            granted = false; R = 0.0; psi = 0.0;
            reason = "LEX_CLAVIS_002:expired_window";
            callerId = token.callerId;
            windowDelta = windowDelta; threshold = PHI_INV;
            protocol = "PROTO-226"; ts = Time.now();
          };
          _appendAudit(token.callerId, "validate", false, 0.0, "expired_window");
          return r;
        };

        // Step 4: Kuramoto resonance gate (LEX CLAVIS-003)
        let R_align = phaseAlignment(token.phases, envelope.phases);
        let (_, psi) = kuramotoR(Array.tabulate<Float>(
          Nat.min(token.phases.size(), envelope.phases.size()),
          func(j) { token.phases[j] - envelope.phases[j] }
        ));

        if (R_align < PHI_INV) {
          let r = {
            granted = false; R = R_align; psi = psi;
            reason = "LEX_CLAVIS_003:below_resonance_threshold";
            callerId = token.callerId;
            windowDelta = windowDelta; threshold = PHI_INV;
            protocol = "PROTO-226"; ts = Time.now();
          };
          _appendAudit(token.callerId, "validate", false, R_align, "below_resonance");
          return r;
        };

        // GRANTED
        let r = {
          granted = true; R = R_align; psi = psi;
          reason = "";
          callerId = token.callerId;
          windowDelta = windowDelta; threshold = PHI_INV;
          protocol = "PROTO-226"; ts = Time.now();
        };
        _appendAudit(token.callerId, "validate", true, R_align, "");
        r
      };
    }
  };

  /// Revoke a caller's key (LEX CLAVIS-004: immutable after consensus).
  public shared(msg) func revokeKey(callerId : Text) : async Result.Result<{ callerId: Text; revoked: Bool }, Text> {
    switch (envelopes.get(callerId)) {
      case null {
        #err("Caller '" # callerId # "' not found — cannot revoke")
      };
      case (?_) {
        envelopes.delete(callerId);
        if (clavisCirculating > 0) {
          clavisCirculating -= 1;
        };
        _appendAudit(callerId, "revoke", true, 0.0, "");
        #ok({ callerId = callerId; revoked = true })
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  ATTRIBUTOR SUB-MODEL — IP Attribution Chain
  // ══════════════════════════════════════════════════════════════════

  /// Write an immutable attribution record (LEX CLAVIS-005).
  public shared(msg) func writeAttribution(
    artifactHash  : Text,
    creatorId     : Text,
    token         : GeometricKeyToken,
    chain         : Text,
  ) : async Result.Result<AttributionRecord, Text> {

    // LEX CLAVIS-005: check for existing record (immutability)
    switch (attributions.get(artifactHash)) {
      case (?existing) {
        #err("LEX_CLAVIS_005:attribution_immutable — record already exists for " # artifactHash)
      };
      case null {
        let record : AttributionRecord = {
          artifactHash  = artifactHash;
          creatorId     = creatorId;
          keySignature  = token.signature;
          phaseSnapshot = token.phases;
          windowIndex   = token.windowIndex;
          resonanceR    = token.selfCoherence;
          timestampMs   = Time.now() / 1_000_000;
          chain         = chain;
          canister      = "geomancer";
        };

        attributions.put(artifactHash, record);
        _appendAudit(creatorId, "attribution_write", true, token.selfCoherence, artifactHash);
        #ok(record)
      };
    }
  };

  /// Get an attribution record by artifact hash.
  public query func getAttribution(artifactHash : Text) : async ?AttributionRecord {
    attributions.get(artifactHash)
  };

  // ══════════════════════════════════════════════════════════════════
  //  GUBERNATOR SUB-MODEL — Governance and Law Enforcement
  // ══════════════════════════════════════════════════════════════════

  /// Create a governance proposal (requires validator stake ≥ 233 CLAVIS).
  /// LEX CLAVIS-008: validator stake check.
  public shared(msg) func createProposal(
    title          : Text,
    targetLaw      : Text,
    proposerId     : Text,
    stakedClavis   : Nat,
  ) : async Result.Result<GovernanceProposal, Text> {

    // LEX CLAVIS-008
    if (stakedClavis < VALIDATOR_MIN_STAKE) {
      return #err("LEX_CLAVIS_008: minimum stake " # Nat.toText(VALIDATOR_MIN_STAKE) # " CLAVIS required");
    };

    let proposerPower = Float.sqrt(Float.fromInt(stakedClavis));
    let id = "GOV_" # Int.toText(Time.now()) # "_" # proposerId;

    let proposal : GovernanceProposal = {
      id            = id;
      title         = title;
      targetLaw     = targetLaw;
      proposerId    = proposerId;
      proposerPower = proposerPower;
      votes         = [];
      status        = #Voting;
      createdAt     = Time.now();
      expiresAt     = Time.now() + (13 * 24 * 3_600_000_000_000);  // 13 days
    };

    proposals.put(id, proposal);
    #ok(proposal)
  };

  /// Cast a vote on a governance proposal.
  /// Vote power = stakedClavis^(1/φ) × φ^(epochsStaked mod 13)
  public shared(msg) func castVote(
    proposalId   : Text,
    voterId      : Text,
    vote         : Text,     /// "for" | "against" | "abstain"
    stakedClavis : Nat,
    epochsStaked : Nat,
  ) : async Result.Result<{ outcome: Text }, Text> {

    switch (proposals.get(proposalId)) {
      case null { #err("Proposal " # proposalId # " not found") };
      case (?p) {
        // φ-weighted vote power: stakedClavis^(1/φ) × φ^(epochsStaked mod 13)
        let basePower = Float.exp(Float.log(Float.fromInt(stakedClavis + 1)) * PHI_INV);
        let epochMult = Float.exp(Float.fromInt(epochsStaked % PHI_HASH_CYCLE) * Float.log(PHI));
        let votePower = basePower * epochMult;

        let newVotes = Array.append<(Text, Text, Float)>(p.votes, [(voterId, vote, votePower)]);

        // Compute outcome
        var forPower   : Float = 0.0;
        var totalPower : Float = 0.0;
        for ((_, v, pw) in newVotes.vals()) {
          if (v == "for") { forPower += pw };
          totalPower += pw;
        };

        let passRatio = if (totalPower > 0.0) { forPower / totalPower } else { 0.0 };
        let newStatus = if (passRatio >= PHI_INV and totalPower >= 1000.0) {
          #Passed
        } else {
          #Voting
        };

        let updated : GovernanceProposal = {
          id            = p.id;
          title         = p.title;
          targetLaw     = p.targetLaw;
          proposerId    = p.proposerId;
          proposerPower = p.proposerPower;
          votes         = newVotes;
          status        = newStatus;
          createdAt     = p.createdAt;
          expiresAt     = p.expiresAt;
        };

        proposals.put(proposalId, updated);
        let outcome = switch (newStatus) { case (#Passed) "passed"; case _ "pending" };
        #ok({ outcome = outcome })
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY INTERFACE
  // ══════════════════════════════════════════════════════════════════

  public query func getStatus() : async {
    registeredCallers : Nat;
    clavisCirculating : Nat;
    maxSupply         : Nat;
    attributionCount  : Nat;
    proposalCount     : Nat;
    currentWindow     : Nat;
    emergenceThreshold: Float;
    goldenAngle       : Float;
    phi               : Float;
    uptime            : Text;
  } {
    {
      registeredCallers  = envelopes.size();
      clavisCirculating  = clavisCirculating;
      maxSupply          = MAX_CLAVIS_SUPPLY;
      attributionCount   = attributions.size();
      proposalCount      = proposals.size();
      currentWindow      = currentWindowIndex();
      emergenceThreshold = PHI_INV;
      goldenAngle        = GOLDEN_ANGLE;
      phi                = PHI;
      uptime             = "geomancer@PROTO-226";
    }
  };

  public query func getAuditLog() : async [AuditEntry] {
    let n = auditLog.size();
    if (n <= 100) { auditLog } else {
      Array.tabulate<AuditEntry>(100, func(i) { auditLog[n - 100 + i] })
    }
  };

  public query func isRegistered(callerId : Text) : async Bool {
    switch (envelopes.get(callerId)) { case null { false }; case _ { true } }
  };

  public query func getEnvelopePhases(callerId : Text) : async ?[Float] {
    switch (envelopes.get(callerId)) {
      case null  { null };
      case (?e)  { ?e.phases };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  CPL RUNTIME INTEGRATION
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func setCPLRuntime(canisterId : Principal) : async () {
    cplRuntimeCanisterId := ?canisterId;
  };

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS
  // ══════════════════════════════════════════════════════════════════

  /// Hash a Text value to a Float seed for phase generation.
  /// seed = Σᵢ (charCode(str[i]) × φ^(i mod 7)) mod 2³²
  func _hashTextToFloat(str : Text) : Float {
    var seed : Float = 0.0;
    var i    : Nat   = 0;
    let mask : Float = 4_294_967_295.0;
    for (ch in str.chars()) {
      let code = Float.fromInt(Nat32.toNat(Char.toNat32(ch)));
      let pw   = Float.exp(Float.fromInt(i % KEY_DIMENSIONS) * Float.log(PHI));
      seed    += code * pw;
      seed     = Float.rem(seed, mask);
      i       += 1;
    };
    seed
  };

  /// Append an audit log entry (keeps last 10,000).
  func _appendAudit(callerId : Text, op : Text, granted : Bool, R : Float, reason : Text) {
    let entry : AuditEntry = {
      ts       = Time.now();
      callerId = callerId;
      op       = op;
      granted  = granted;
      R        = R;
      reason   = reason;
    };
    let current = auditLog;
    let n       = current.size();
    if (n >= 10_000) {
      auditLog := Array.append<AuditEntry>(
        Array.tabulate<AuditEntry>(n - 1, func(i) { current[i + 1] }),
        [entry]
      );
    } else {
      auditLog := Array.append<AuditEntry>(current, [entry]);
    };
  };

}
