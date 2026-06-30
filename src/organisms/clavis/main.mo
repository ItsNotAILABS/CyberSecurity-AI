///
/// CLAVIS — The Geometry Key Organism
///
/// The Key is not a credential. It is an identity.
///
/// CLAVIS is a sovereign key-management organism:
///   - Issues geometric key tokens on demand (per φ-heartbeat window)
///   - Manages Platonic solid tier assignments
///   - Handles coherence injection from external AIs
///   - Maintains the φ-encoded memory palace (Clifford torus)
///   - Bridges keys to other chains via the PONS protocol (GKP-006)
///
/// CLAVIS and PORTA are complementary organisms:
///   CLAVIS produces the key (shape in phase space)
///   PORTA validates the key (resonance check)
///   Together they form the complete Geometry Lock system.
///
/// Platonic solid lifecycle:
///   1. Caller registers → assigned TETRAHEDRON (READ) by default
///   2. After doctrine injection: tier upgrades by coherence score
///   3. After sustained resonance: tier upgrades by Kuramoto R
///   4. After governance vote: tier upgrades by consensus
///
/// Memory palace:
///   All attunement events and key issuances are encoded as Clifford
///   torus memory points — memory has POSITION, not just content.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float     "mo:base/Float";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Nat32     "mo:base/Nat32";
import Text      "mo:base/Text";
import Array     "mo:base/Array";
import Buffer    "mo:base/Buffer";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Result    "mo:base/Result";
import HashMap   "mo:base/HashMap";
import Iter      "mo:base/Iter";
import Char      "mo:base/Char";

persistent actor Clavis {

  // ══════════════════════════════════════════════════════════════════
  //  GOLDEN CONSTANTS
  // ══════════════════════════════════════════════════════════════════

  transient let PHI             : Float = 1.6180339887498948482;
  transient let PHI2            : Float = PHI * PHI;
  transient let PHI3            : Float = PHI2 * PHI;
  transient let PHI4            : Float = PHI3 * PHI;
  transient let PHI_INV         : Float = 1.0 / PHI;
  transient let GOLDEN_ANGLE    : Float = 2.39996322972865332;
  transient let TWO_PI          : Float = 6.28318530717958647692;
  transient let EMERGENCE_THRESHOLD : Float = 0.6180339887498948;
  transient let KEY_DIMENSIONS  : Nat = 8;
  transient let PHI_HASH_CYCLE  : Nat = 13;
  transient let WINDOW_DURATION_NS : Int = 1_413_000_000;

  // Clifford torus constant
  transient let INV_SQRT2       : Float = 0.7071067811865475;  // 1/√2

  // Coherence injection learning rate = φ⁻¹
  transient let LEARNING_RATE   : Float = PHI_INV;

  // Memory palace size: Fibonacci(13) = 233
  transient let MEMORY_MAX      : Nat = 233;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type PlatformTier = {
    #READ; #CALL; #BUILD; #FEDERATE; #SOVEREIGN; #ARCHITECT;
  };

  public type EarningPath = {
    #RESONANCE; #DOCTRINE; #GOVERNANCE; #DEFAULT;
  };

  public type SolidRecord = {
    callerId   : Text;
    tier       : PlatformTier;
    tierRank   : Nat;
    tierFreqHz : Nat;
    earnedBy   : EarningPath;
    earnedAt   : Int;
  };

  public type KeyToken = {
    callerId     : Text;
    windowIndex  : Nat;
    dimensions   : Nat;
    phases       : [Float];
    selfCoherence: Float;
    meanPhase    : Float;
    signature    : Text;
    tierFreqHz   : Nat;
    chain        : Text;
  };

  // Clifford torus memory point
  public type CliffordMemory = {
    id           : Text;
    contentHash  : Text;
    theta1       : Float;    // S¹ angle 1
    theta2       : Float;    // S¹ angle 2
    x1 : Float; y1 : Float; // cos/sin of theta1 / √2
    x2 : Float; y2 : Float; // cos/sin of theta2 / √2
    strength     : Float;
    windowIndex  : Nat;
    createdAt    : Int;
  };

  // Coherence injection state per caller
  public type CoherenceState = {
    callerId      : Text;
    coherenceR    : Float;
    exposureCount : Nat;
    earnedTier    : PlatformTier;
    lastInjected  : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STABLE STATE
  // ══════════════════════════════════════════════════════════════════

  stable var solidEntries      : [(Text, SolidRecord)]     = [];
  stable var secretEntries     : [(Text, Text)]            = [];  // callerId → secretHash
  stable var memoryEntries     : [(Text, CliffordMemory)]  = [];
  stable var coherenceEntries  : [(Text, CoherenceState)]  = [];
  stable var heartbeatCount    : Nat = 0;
  stable var cplRuntimeId      : ?Principal = null;

  transient var solids      = HashMap.HashMap<Text, SolidRecord>(64, Text.equal, Text.hash);
  transient var secrets     = HashMap.HashMap<Text, Text>(64, Text.equal, Text.hash);
  transient var memories    = HashMap.HashMap<Text, CliffordMemory>(256, Text.equal, Text.hash);
  transient var coherence   = HashMap.HashMap<Text, CoherenceState>(64, Text.equal, Text.hash);

  system func preupgrade() {
    solidEntries     := Iter.toArray(solids.entries());
    secretEntries    := Iter.toArray(secrets.entries());
    memoryEntries    := Iter.toArray(memories.entries());
    coherenceEntries := Iter.toArray(coherence.entries());
  };

  system func postupgrade() {
    for ((k, v) in solidEntries.vals())     { solids.put(k, v) };
    for ((k, v) in secretEntries.vals())    { secrets.put(k, v) };
    for ((k, v) in memoryEntries.vals())    { memories.put(k, v) };
    for ((k, v) in coherenceEntries.vals()) { coherence.put(k, v) };
  };

  // ══════════════════════════════════════════════════════════════════
  //  MATHEMATICS
  // ══════════════════════════════════════════════════════════════════

  func _currentWindow() : Nat {
    Int.abs(Time.now() / WINDOW_DURATION_NS)
  };

  func _hashText(s : Text) : Float {
    var h : Float = 0.0;
    var i = 0;
    let mask : Float = 4_294_967_295.0;
    for (ch in s.chars()) {
      let c  = Float.fromInt(Nat32.toNat(Char.toNat32(ch)));
      let pw = Float.exp(Float.fromInt(i % PHI_HASH_CYCLE) * Float.log(PHI));
      h     += c * pw;
      h      = Float.rem(h, mask);
      i     += 1;
    };
    h
  };

  func _kuramotoR(phases : [Float]) : (Float, Float) {
    let n = Float.fromInt(phases.size());
    if (n == 0.0) return (0.0, 0.0);
    var re : Float = 0.0;
    var im : Float = 0.0;
    for (p in phases.vals()) { re += Float.cos(p); im += Float.sin(p); };
    re /= n; im /= n;
    (Float.sqrt(re * re + im * im), Float.arctan(im / (re + 1.0e-10)))
  };

  func _tierToRank(t : PlatformTier) : Nat {
    switch t { case (#READ) 0; case (#CALL) 1; case (#BUILD) 2; case (#FEDERATE) 3; case (#SOVEREIGN) 4; case (#ARCHITECT) 5 }
  };

  func _tierFreqHz(t : PlatformTier) : Nat {
    switch t { case (#READ) 396; case (#CALL) 417; case (#BUILD) 528; case (#FEDERATE) 639; case (#SOVEREIGN) 741; case (#ARCHITECT) 432 }
  };

  func _rankToTier(r : Nat) : PlatformTier {
    switch r { case 0 #READ; case 1 #CALL; case 2 #BUILD; case 3 #FEDERATE; case 4 #SOVEREIGN; case _ #ARCHITECT }
  };

  func _tierThreshold(rank : Nat) : Float {
    Float.min(1.0, EMERGENCE_THRESHOLD * Float.exp(Float.fromInt(rank) / PHI * Float.log(PHI)))
  };

  func _phiHMACFNV8(phases : [Float], callerId : Text, w : Nat, secret : Text, freq : Nat) : Text {
    let pm = Array.map<Float, Text>(phases, func(p) {
      let i = Int.abs(Float.toInt(p));
      let f = Int.abs(Float.toInt((p - Float.fromInt(Float.toInt(p))) * 1_000_000.0));
      Int.toText(i) # "." # Nat.toText(f)
    });
    let msg  = Text.join(":", Iter.fromArray(pm)) # "|" # callerId # "|" # Nat.toText(w) # "|" # secret # "|" # Nat.toText(freq);
    var hash : Float = 0.0;
    var i = 0;
    let mask : Float = 4_294_967_295.0;
    for (ch in msg.chars()) {
      let code = Float.fromInt(Nat32.toNat(Char.toNat32(ch)));
      let pw   = Float.exp(Float.fromInt(i % PHI_HASH_CYCLE) * Float.log(PHI));
      hash    += code * pw;
      hash     = Float.rem(hash, mask);
      i       += 1;
    };
    let scaled = Int.abs(Float.toInt(hash * PHI2)) % 16_777_216;
    "fnv8_" # Int.toText(scaled)
  };

  // ══════════════════════════════════════════════════════════════════
  //  REGISTRATION + KEY ISSUANCE
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func register(callerId : Text, secretHash : Text) : async Result.Result<{ tier: Text; tierFreqHz: Nat }, Text> {
    let solid : SolidRecord = {
      callerId   = callerId;
      tier       = #READ;
      tierRank   = 0;
      tierFreqHz = 396;
      earnedBy   = #DEFAULT;
      earnedAt   = Time.now();
    };
    solids.put(callerId, solid);
    secrets.put(callerId, secretHash);
    #ok({ tier = "READ"; tierFreqHz = 396 })
  };

  public shared(msg) func issueKey(callerId : Text) : async Result.Result<KeyToken, Text> {
    switch (solids.get(callerId)) {
      case null { #err("Caller not registered: " # callerId) };
      case (?solid) {
        let secret = switch (secrets.get(callerId)) { case null ""; case (?s) s };
        let w      = _currentWindow();
        let seed   = _hashText(secret);
        let freq   = solid.tierFreqHz;

        let phases8 = Array.tabulate<Float>(KEY_DIMENSIONS, func(j) {
          if (j < 7) {
            Float.rem(seed * Float.exp(Float.fromInt(j) * Float.log(PHI)) * GOLDEN_ANGLE + TWO_PI * Float.fromInt(w) / PHI, TWO_PI)
          } else {
            Float.rem((Float.fromInt(freq) / 1000.0) * TWO_PI * PHI * Float.fromInt(w) / PHI, TWO_PI)
          }
        });

        let (selfR, psi) = _kuramotoR(phases8);
        let sig = _phiHMACFNV8(phases8, callerId, w, secret, freq);

        #ok({
          callerId     = callerId;
          windowIndex  = w;
          dimensions   = 8;
          phases       = phases8;
          selfCoherence = selfR;
          meanPhase    = psi;
          signature    = sig;
          tierFreqHz   = freq;
          chain        = "icp";
        })
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  COHERENCE INJECTION — Attune an External AI
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func attune(callerId : Text, doctrineHash : Text, coherenceR : Float) : async Result.Result<{ tier: Text; promoted: Bool }, Text> {
    // Ensure registered
    switch (solids.get(callerId)) {
      case null { #err("Register first: " # callerId) };
      case (?solid) {
        // Find highest tier the coherenceR supports
        var earnedRank = 0;
        var rank       = 5;
        label loop loop {
          if (rank == 0) { break loop };
          let thresh = _tierThreshold(rank);
          if (coherenceR >= thresh) { earnedRank := rank; break loop };
          rank -= 1;
        };

        let earnedTier = _rankToTier(earnedRank);
        let promoted   = earnedRank > solid.tierRank;

        if (promoted) {
          let newSolid : SolidRecord = {
            callerId   = callerId;
            tier       = earnedTier;
            tierRank   = earnedRank;
            tierFreqHz = _tierFreqHz(earnedTier);
            earnedBy   = #DOCTRINE;
            earnedAt   = Time.now();
          };
          solids.put(callerId, newSolid);

          // Write a Clifford memory for this attunement
          _writeMemory(callerId # "_attune_" # Int.toText(Time.now()), doctrineHash, coherenceR);
        };

        let tierText = switch earnedTier {
          case (#READ)      "READ";
          case (#CALL)      "CALL";
          case (#BUILD)     "BUILD";
          case (#FEDERATE)  "FEDERATE";
          case (#SOVEREIGN) "SOVEREIGN";
          case (#ARCHITECT) "ARCHITECT";
        };

        #ok({ tier = tierText; promoted = promoted })
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  CLIFFORD TORUS MEMORY PALACE
  // ══════════════════════════════════════════════════════════════════

  func _writeMemory(id : Text, contentHash : Text, strength : Float) {
    // Derive theta1, theta2 from contentHash
    let seed1  = _hashText(contentHash);
    let seed2  = _hashText(contentHash # "_2");
    let mask   : Float = 4_294_967_295.0;
    let theta1 = (seed1 % mask) / mask * TWO_PI;
    let theta2 = (seed2 % mask) / mask * TWO_PI;

    // Clifford embedding: (cos θ₁, sin θ₁, cos θ₂, sin θ₂) / √2
    let mem : CliffordMemory = {
      id          = id;
      contentHash = contentHash;
      theta1      = theta1;
      theta2      = theta2;
      x1 = INV_SQRT2 * Float.cos(theta1);
      y1 = INV_SQRT2 * Float.sin(theta1);
      x2 = INV_SQRT2 * Float.cos(theta2);
      y2 = INV_SQRT2 * Float.sin(theta2);
      strength    = strength;
      windowIndex = _currentWindow();
      createdAt   = Time.now();
    };

    // Evict if at capacity
    if (memories.size() >= MEMORY_MAX) {
      var weakId : Text = "";
      var weakStr : Float = 1.1;
      for ((mid, m) in memories.entries()) {
        if (m.strength < weakStr) { weakStr := m.strength; weakId := mid };
      };
      if (weakId != "") { memories.delete(weakId) };
    };

    memories.put(id, mem);
  };

  public query func queryMemories(queryHash : Text, k : Nat) : async [CliffordMemory] {
    let seed  = _hashText(queryHash);
    let mask  : Float = 4_294_967_295.0;
    let qTheta1 = (seed % mask) / mask * TWO_PI;
    let qTheta2 = (_hashText(queryHash # "_2") % mask) / mask * TWO_PI;

    // Clifford geodesic distance: √((θ₁_a−θ₁_b)² + (θ₂_a−θ₂_b)²)
    let scored : [(CliffordMemory, Float)] = Array.map<(Text, CliffordMemory), (CliffordMemory, Float)>(
      Iter.toArray(memories.entries()),
      func((_, m)) {
        let d1   = m.theta1 - qTheta1;
        let d2   = m.theta2 - qTheta2;
        let dist = Float.sqrt(d1 * d1 + d2 * d2);  // Pythagorean on Clifford torus
        (m, dist / (m.strength + 0.001))
      }
    );

    // Sort by score (lower = better)
    let sorted = Array.sort<(CliffordMemory, Float)>(scored, func(a, b) {
      if (a.1 < b.1) { #less } else if (a.1 > b.1) { #greater } else { #equal }
    });

    let count = Nat.min(k, sorted.size());
    Array.tabulate<CliffordMemory>(count, func(i) { sorted[i].0 })
  };

  // ══════════════════════════════════════════════════════════════════
  //  MINI-HEART TICK
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func tick() : async { heartbeat: Nat; callers: Nat } {
    heartbeatCount += 1;
    { heartbeat = heartbeatCount; callers = solids.size() }
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY INTERFACE
  // ══════════════════════════════════════════════════════════════════

  public query func getCallerTier(callerId : Text) : async ?{ tier: Text; rank: Nat; freq: Nat } {
    switch (solids.get(callerId)) {
      case null null;
      case (?s) {
        let tierText = switch s.tier {
          case (#READ)      "READ";      case (#CALL)      "CALL";
          case (#BUILD)     "BUILD";     case (#FEDERATE)  "FEDERATE";
          case (#SOVEREIGN) "SOVEREIGN"; case (#ARCHITECT) "ARCHITECT";
        };
        ?{ tier = tierText; rank = s.tierRank; freq = s.tierFreqHz }
      };
    }
  };

  public query func getStatus() : async { callers: Nat; memories: Nat; heartbeat: Nat } {
    { callers = solids.size(); memories = memories.size(); heartbeat = heartbeatCount }
  };

  public shared(msg) func setCPLRuntime(id : Principal) : async () {
    cplRuntimeId := ?id;
  };
}
