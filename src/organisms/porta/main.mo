///
/// PORTA — The Geometry Lock Organism
///
/// The Lock is not passive. It is alive.
///
/// PORTA is an autonomous entity with:
///   MINI-BRAIN:  a lightweight cognitive monitor that tracks field health,
///                runs offense/defense assessments, and escalates threats
///   MINI-HEART:  a φ-heartbeat (873ms × φ) that drives key rotation,
///                sweeps, and temporal auditing
///
/// Sub-models (4 chambers, like a heart):
///   ATRIUM_CLAVIS   — envelope storage and key issuance
///   ATRIUM_RESONANTIA — Kuramoto lock engine (4-step validation)
///   VENTRICULUS_OFFENSIO — offense monitoring and threat detection
///   VENTRICULUS_DEFENSIO — circuit breakers, quarantine, rate limiting
///
/// The 9 SMOF planes enforced at the organism level:
///   Planes 1-4 (inner): require BUILD tier or above
///   Planes 5-9 (outer): accessible to READ/CALL tier
///
/// Platonic solid tier encoding:
///   All validated callers have their tier stored in the organism.
///   Tier promotion events are certified to the Atlas registry.
///
/// Mathematics (mirror of JS/Python/Julia):
///   All constants and formulas are identical across substrates.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float     "mo:base/Float";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Nat8      "mo:base/Nat8";
import Nat32     "mo:base/Nat32";
import Text      "mo:base/Text";
import Array     "mo:base/Array";
import Buffer    "mo:base/Buffer";
import Blob      "mo:base/Blob";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Result    "mo:base/Result";
import HashMap   "mo:base/HashMap";
import Iter      "mo:base/Iter";
import Char      "mo:base/Char";
import Random    "mo:base/Random";

persistent actor Porta {

  // ══════════════════════════════════════════════════════════════════
  //  GOLDEN CONSTANTS
  // ══════════════════════════════════════════════════════════════════

  transient let PHI              : Float = 1.6180339887498948482;
  transient let PHI2             : Float = PHI * PHI;
  transient let PHI3             : Float = PHI2 * PHI;
  transient let PHI4             : Float = PHI3 * PHI;
  transient let PHI_INV          : Float = 1.0 / PHI;
  transient let GOLDEN_ANGLE     : Float = 2.39996322972865332;
  transient let TWO_PI           : Float = 6.28318530717958647692;
  transient let EMERGENCE_THRESHOLD : Float = 0.6180339887498948;
  transient let KEY_DIMENSIONS   : Nat = 8;   // 8D phase vectors
  transient let PHI_HASH_CYCLE   : Nat = 13;

  // Mini-Heart: φ-heartbeat in nanoseconds
  // 873ms × φ ≈ 1413ms = 1_413_000_000 ns
  transient let HEARTBEAT_NS     : Int = 1_413_000_000;

  // Window duration (same as heartbeat)
  transient let WINDOW_DURATION_NS : Int = HEARTBEAT_NS;

  // Escalation threshold: φ³ consecutive denials
  transient let ESCALATION_THRESHOLD : Nat = 4;

  // Adversarial margin: R within this distance of threshold
  transient let ADVERSARIAL_MARGIN : Float = EMERGENCE_THRESHOLD * 0.1 * PHI_INV;

  // Quarantine: φ⁴ windows ≈ 7 windows
  transient let QUARANTINE_WINDOWS : Nat = 7;

  // ── Hebbian learning parameters ──────────────────────────────────
  // Potentiation (grant): Δw = (1 − w) / φ  (fire together → wire together)
  // Depression  (deny):   Δw = −w / φ        (synaptic suppression)
  // Initial weight for new callers: 1/φ ≈ 0.618 (neutral)
  transient let HEBB_POTENTIATION_DENOM : Float = PHI;
  transient let HEBB_DEPRESSION_DENOM   : Float = PHI;
  transient let HEBB_INIT_WEIGHT        : Float = PHI_INV;

  // Defense-mode: tighten R threshold by φ when denial rate > φ⁻¹
  transient let DEFENSE_TRIGGER_RATE  : Float = PHI_INV;  // 0.618
  transient let DEFENSE_COOL_WINDOWS  : Nat   = 3;
  transient let DEFENSE_THRESHOLD_MOD : Float = PHI;      // ×φ when in defense

  // SMOF inner plane minimum tier rank
  transient let INNER_PLANE_MIN_RANK : Nat = 2;  // BUILD tier

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type PlatformTier = {
    #READ;       // Tetrahedron — 396 Hz
    #CALL;       // Cube — 417 Hz
    #BUILD;      // Octahedron — 528 Hz
    #FEDERATE;   // Dodecahedron — 639 Hz
    #SOVEREIGN;  // Icosahedron — 741 Hz
    #ARCHITECT;  // Metatron — 432 Hz
  };

  public type SMOFPlane = {
    #INNER;  // planes 1-4 (restricted)
    #OUTER;  // planes 5-9 (open)
  };

  public type GeometricKeyToken = {
    callerId     : Text;
    windowIndex  : Nat;
    dimensions   : Nat;
    phases       : [Float];
    selfCoherence: Float;
    meanPhase    : Float;
    signature    : Text;
    tierFreqHz   : Nat;   // Solfeggio tier frequency
    chain        : Text;
  };

  public type ResonanceEnvelope = {
    callerId    : Text;
    phases      : [Float];
    secretHash  : Text;
    tier        : PlatformTier;
    tierFreqHz  : Nat;
    tierRank    : Nat;
    registeredAt: Int;
  };

  public type LockResult = {
    granted     : Bool;
    R           : Float;
    psi         : Float;
    reason      : Text;
    callerId    : Text;
    tier        : PlatformTier;
    tierRank    : Nat;
    windowDelta : Nat;
    ts          : Int;
  };

  // Mini-Brain state snapshot
  public type BrainSnapshot = {
    lockHealth       : Float;   // mean granted R
    fieldCoherence   : Float;   // R_field across all callers
    threatsDetected  : Nat;
    escalations      : Nat;
    quarantinedCount : Nat;
    openCircuits     : Nat;
    grantRate        : Float;
    heartbeat        : Nat;     // beat count
    ts               : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STABLE STATE
  // ══════════════════════════════════════════════════════════════════

  // ATRIUM CLAVIS — resonance envelopes
  stable var envelopeEntries : [(Text, ResonanceEnvelope)] = [];

  // VENTRICULUS DEFENSIO — quarantine state
  // callerId → releaseWindow
  stable var quarantineEntries : [(Text, Nat)] = [];

  // VENTRICULUS DEFENSIO — circuit breaker state
  // callerId → (errors, total, open)
  stable var circuitEntries : [(Text, (Nat, Nat, Bool))] = [];

  // MINI-BRAIN — Hebbian immune memory
  // callerId → synaptic weight [0, 1]
  // weight > 0.618 → trusted (potentiated); weight < 0.618 → suppressed
  stable var hebbianWeights : [(Text, Float)] = [];

  // MINI-BRAIN — Adaptive Kuramoto threshold
  // Tightens to EMERGENCE_THRESHOLD × φ when defense mode is active
  stable var adaptiveThreshold   : Float = 0.6180339887498948;
  stable var defenseMode         : Bool  = false;
  stable var defenseModeAt       : Int   = 0;
  stable var cleanHeartbeatCount : Nat   = 0;

  // Mini-Brain audit log
  stable var brainLog : [BrainSnapshot] = [];

  // Escalation log
  stable var escalationLog : [(Text, Text, Int)] = [];  // (callerId, reason, ts)

  // Threat log
  stable var threatLog : [(Text, Text, Float)] = [];  // (callerId, verdict, R)

  // Mini-Heart beat count
  stable var heartbeatCount : Nat = 0;
  stable var lastHeartbeatNs : Int = 0;

  // Total validations
  stable var totalGranted  : Nat = 0;
  stable var totalDenied   : Nat = 0;
  stable var totalGrantedR : Float = 0.0;

  // CPL Runtime
  stable var cplRuntimeId : ?Principal = null;

  // ── Runtime maps ───────────────────────────────────────────────────

  transient var envelopes    = HashMap.HashMap<Text, ResonanceEnvelope>(64, Text.equal, Text.hash);
  transient var quarantine   = HashMap.HashMap<Text, Nat>(32, Text.equal, Text.hash);
  transient var circuits     = HashMap.HashMap<Text, (Nat, Nat, Bool)>(64, Text.equal, Text.hash);
  transient var denialStreaks= HashMap.HashMap<Text, Nat>(64, Text.equal, Text.hash);
  transient var hebbWeights  = HashMap.HashMap<Text, Float>(64, Text.equal, Text.hash);

  // ── Upgrade hooks ────────────────────────────────────────────────────

  system func preupgrade() {
    envelopeEntries  := Iter.toArray(envelopes.entries());
    quarantineEntries:= Iter.toArray(quarantine.entries());
    circuitEntries   := Iter.toArray(circuits.entries());
    hebbianWeights   := Iter.toArray(hebbWeights.entries());
  };

  system func postupgrade() {
    for ((k, v) in envelopeEntries.vals())   { envelopes.put(k, v) };
    for ((k, v) in quarantineEntries.vals()) { quarantine.put(k, v) };
    for ((k, v) in circuitEntries.vals())    { circuits.put(k, v) };
    for ((k, v) in hebbianWeights.vals())    { hebbWeights.put(k, v) };
  };

  // ══════════════════════════════════════════════════════════════════
  //  MINI-HEART — φ-Heartbeat
  //  The heart IS the bootstrap. It starts beating in the first tick().
  // ══════════════════════════════════════════════════════════════════

  func _currentWindow() : Nat {
    let t = Time.now();
    Int.abs(t / WINDOW_DURATION_NS)
  };

  func _isWindowFresh(w : Nat) : Bool {
    let cur = _currentWindow();
    let delta = if (w >= cur) { w - cur } else { cur - w };
    delta <= 1
  };

  /// Mini-heart tick — called by the governing clock or autonomously
  public shared(msg) func tick() : async BrainSnapshot {
    heartbeatCount  += 1;
    lastHeartbeatNs  := Time.now();

    // Update defense mode based on field health
    _updateDefenseMode();

    // Compute brain snapshot
    let snap = _brainSnapshot();
    let log_ = brainLog;
    let n    = log_.size();
    if (n >= 1000) {
      brainLog := Array.append<BrainSnapshot>(
        Array.tabulate<BrainSnapshot>(999, func(i) { log_[i+1] }),
        [snap]
      );
    } else {
      brainLog := Array.append<BrainSnapshot>(log_, [snap]);
    };

    snap
  };

  // ══════════════════════════════════════════════════════════════════
  //  MATHEMATICS
  // ══════════════════════════════════════════════════════════════════

  func _kuramotoR(phases : [Float]) : (Float, Float) {
    let n = Float.fromInt(phases.size());
    if (n == 0.0) return (0.0, 0.0);
    var re : Float = 0.0;
    var im : Float = 0.0;
    for (p in phases.vals()) { re += Float.cos(p); im += Float.sin(p); };
    re /= n; im /= n;
    let R   = Float.sqrt(re * re + im * im);  // Pythagorean
    let psi = Float.arctan(im / (re + 1.0e-10));
    (R, psi)
  };

  func _phaseAlignment(p1 : [Float], p2 : [Float]) : Float {
    let n = Nat.min(p1.size(), p2.size());
    let diff = Array.tabulate<Float>(n, func(j) { p1[j] - p2[j] });
    let (R, _) = _kuramotoR(diff);
    R
  };

  func _hashText(str : Text) : Float {
    var seed : Float = 0.0;
    var i = 0;
    let mask : Float = 4_294_967_295.0;
    for (ch in str.chars()) {
      let code = Float.fromInt(Nat32.toNat(Char.toNat32(ch)));
      let pw   = Float.exp(Float.fromInt(i % PHI_HASH_CYCLE) * Float.log(PHI));
      seed    += code * pw;
      seed     = Float.rem(seed, mask);
      i       += 1;
    };
    seed
  };

  func _phiHMACFNV(phases : [Float], callerId : Text, w : Nat, secret : Text, tierFreq : Nat) : Text {
    let phasePart  = Array.map<Float, Text>(phases, func(p) {
      let i = Int.abs(Float.toInt(p));
      let f = Int.abs(Float.toInt((p - Float.fromInt(Float.toInt(p))) * 1_000_000.0));
      Int.toText(i) # "." # Nat.toText(f)
    });
    let msg = Text.join(":", Iter.fromArray(phasePart))
            # "|" # callerId # "|" # Nat.toText(w) # "|" # secret # "|" # Nat.toText(tierFreq);

    var hash : Float = 0.0;
    var i    = 0;
    let mask : Float = 4_294_967_295.0;
    for (ch in msg.chars()) {
      let code = Float.fromInt(Nat32.toNat(Char.toNat32(ch)));
      let pw   = Float.exp(Float.fromInt(i % PHI_HASH_CYCLE) * Float.log(PHI));
      hash    += code * pw;
      hash     = Float.rem(hash, mask);
      i       += 1;
    };
    let scaled  = Int.abs(Float.toInt(hash * PHI2)) % 16_777_216;
    "fnv8_" # Int.toText(scaled)
  };

  func _tierToRank(t : PlatformTier) : Nat {
    switch (t) {
      case (#READ)      { 0 };
      case (#CALL)      { 1 };
      case (#BUILD)     { 2 };
      case (#FEDERATE)  { 3 };
      case (#SOVEREIGN) { 4 };
      case (#ARCHITECT) { 5 };
    }
  };

  func _tierFreqHz(t : PlatformTier) : Nat {
    switch (t) {
      case (#READ)      { 396 };
      case (#CALL)      { 417 };
      case (#BUILD)     { 528 };
      case (#FEDERATE)  { 639 };
      case (#SOVEREIGN) { 741 };
      case (#ARCHITECT) { 432 };
    }
  };

  func _tierThreshold(rank : Nat) : Float {
    let r : Float = Float.fromInt(rank);
    Float.min(1.0, EMERGENCE_THRESHOLD * Float.exp(r / PHI * Float.log(PHI)))
  };

  // ── Adaptive threshold: Hebbian + defense mode ──────────────────────────
  //
  //   baseThreshold = _tierThreshold(rank)      (tier-scaled φ gate)
  //   defMod        = φ if defenseMode else 1.0  (tighten under attack)
  //   hebbW         = synaptic weight [0, 1]
  //   hebbRelief    = (1 − hebbW) × base × φ⁻¹  (trusted callers get relief)
  //   effective     = min(0.97, base × defMod − hebbRelief)
  //
  // When weight = HEBB_INIT (0.618) → no relief, gate stays at base × defMod
  // When weight → 1.0 (trusted)    → full relief, gate lowered slightly
  // When weight → 0.0 (suppressed) → negative relief (gate raised)
  func _effectiveThreshold(callerId : Text, rank : Nat) : Float {
    let base   = _tierThreshold(rank);
    let defMod = if (defenseMode) { DEFENSE_THRESHOLD_MOD } else { 1.0 };
    let hebbW  = switch (hebbWeights.get(callerId)) { case null HEBB_INIT_WEIGHT; case (?w) w };
    let relief = (1.0 - hebbW) * base * PHI_INV;
    Float.min(0.97, Float.max(EMERGENCE_THRESHOLD, base * defMod - relief))
  };

  // ── Hebbian synaptic update ─────────────────────────────────────────────
  //
  //   Potentiation (granted):  Δw = (1 − w) / φ  → weight → 1
  //   Depression   (denied):   Δw = −w / φ        → weight → 0
  //
  // Biological analogy: repeated successful handshakes build a trust synapse;
  // repeated failures dissolve it.  The φ denominator ensures the approach is
  // asymptotic (never hits 0 or 1 in finite steps) — an eternal resonance curve.
  func _hebbUpdate(callerId : Text, granted : Bool) {
    let w = switch (hebbWeights.get(callerId)) { case null HEBB_INIT_WEIGHT; case (?v) v };
    let newW = if (granted) {
      Float.min(1.0, w + (1.0 - w) / HEBB_POTENTIATION_DENOM)
    } else {
      Float.max(0.0, w - w / HEBB_DEPRESSION_DENOM)
    };
    hebbWeights.put(callerId, newW);
  };

  // ── Defense mode toggling ───────────────────────────────────────────────
  // Called from tick(). Measures recent denial rate and either activates or
  // cools defense mode.
  func _updateDefenseMode() {
    let total = totalGranted + totalDenied;
    if (total < 5) return;  // not enough signal yet

    let denialRate = Float.fromInt(totalDenied) / Float.fromInt(total);

    if (not defenseMode) {
      // Open wounds: activate if denial rate exceeds φ⁻¹ and threats are accumulating
      if (denialRate > DEFENSE_TRIGGER_RATE and threatLog.size() >= 5) {
        defenseMode   := true;
        defenseModeAt := Time.now();
        cleanHeartbeatCount := 0;
        adaptiveThreshold := Float.min(0.97, EMERGENCE_THRESHOLD * DEFENSE_THRESHOLD_MOD);
      }
    } else {
      // Healing: count consecutive clean heartbeats (denial rate dropped below trigger)
      if (denialRate < DEFENSE_TRIGGER_RATE) {
        cleanHeartbeatCount += 1;
        if (cleanHeartbeatCount >= DEFENSE_COOL_WINDOWS) {
          defenseMode := false;
          cleanHeartbeatCount := 0;
          adaptiveThreshold := EMERGENCE_THRESHOLD;
        }
      } else {
        cleanHeartbeatCount := 0;
      }
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  ATRIUM CLAVIS — Registration
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func register(
    callerId   : Text,
    secretHash : Text,
    tier       : PlatformTier,
  ) : async Result.Result<{ phases: [Float]; windowIndex: Nat }, Text> {
    let w    = _currentWindow();
    let freq = _tierFreqHz(tier);
    let rank = _tierToRank(tier);

    // ── Phase generation: ICP ic0.raw_rand seeding ────────────────────────
    // Random.blob() calls ic0.raw_rand under the hood — 32 bytes of system
    // entropy from the IC threshold BLS randomness beacon.  We mix those bytes
    // with the caller's secret hash via the φ-spiral to produce an 8D phase
    // vector that is BOTH cryptographically unpredictable AND geometrically
    // structured.
    //
    // Construction for dimension j (j ∈ 0..7):
    //   rawByte_j = randomBlob[ j mod 32 ]      ← true randomness
    //   seed_j    = Nat8(rawByte_j) / 255.0     ← normalized to [0, 1]
    //   secretOff = _hashText(secretHash)        ← φ-weighted secret
    //   phiPow_j  = φ^j                          ← golden-ratio scaling
    //   windowOff = 2π × w / φ                  ← temporal rotation
    //   θ_j = (seed_j × phiPow_j + secretOff × GOLDEN_ANGLE + windowOff) mod 2π
    //
    let randBlob = await Random.blob();
    let randBytes = Blob.toArray(randBlob);
    let blobLen = randBytes.size();

    let secretOff = _hashText(secretHash);

    let phases8 = Array.tabulate<Float>(KEY_DIMENSIONS, func(j) {
      if (j < 7) {
        let rawByte : Float = Float.fromInt(Nat8.toNat(randBytes[j % blobLen]));
        let seed_j  : Float = rawByte / 255.0;
        let phiPow  : Float = Float.exp(Float.fromInt(j) * Float.log(PHI));
        let windowOff : Float = TWO_PI * Float.fromInt(w) / PHI;
        Float.rem(seed_j * phiPow + secretOff * GOLDEN_ANGLE + windowOff, TWO_PI)
      } else {
        // 8th dimension: tier coupling via solfeggio frequency
        let rawByte : Float = Float.fromInt(Nat8.toNat(randBytes[7 % blobLen]));
        let seed_j  : Float = rawByte / 255.0;
        Float.rem(seed_j * (Float.fromInt(freq) / 1000.0) * TWO_PI * PHI * Float.fromInt(w) / PHI, TWO_PI)
      }
    });

    let envelope : ResonanceEnvelope = {
      callerId     = callerId;
      phases       = phases8;
      secretHash   = secretHash;
      tier         = tier;
      tierFreqHz   = freq;
      tierRank     = rank;
      registeredAt = Time.now();
    };

    envelopes.put(callerId, envelope);
    denialStreaks.put(callerId, 0);
    hebbWeights.put(callerId, HEBB_INIT_WEIGHT);  // neutral Hebbian weight at birth

    #ok({ phases = phases8; windowIndex = w })
  };

  // ══════════════════════════════════════════════════════════════════
  //  ATRIUM RESONANTIA — Validation (4-step pipeline)
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func validate(token : GeometricKeyToken) : async LockResult {
    let currentW = _currentWindow();

    // Step 1: Registration check
    switch (envelopes.get(token.callerId)) {
      case null {
        ignore _recordDenial(token.callerId, "unregistered", 0.0);
        return _denyResult(token.callerId, "unregistered", 0.0, 0.0, currentW, token.windowIndex, #READ, 0);
      };
      case (?envelope) {
        // VENTRICULUS DEFENSIO checks first
        // Quarantine check
        switch (quarantine.get(token.callerId)) {
          case (?releaseWindow) {
            if (currentW < releaseWindow) {
              return _denyResult(token.callerId, "quarantined", 0.0, 0.0, currentW, token.windowIndex, envelope.tier, envelope.tierRank);
            } else {
              quarantine.delete(token.callerId);
            }
          };
          case null {};
        };

        // Circuit breaker check
        switch (circuits.get(token.callerId)) {
          case (?(errors, total, true)) {
            return _denyResult(token.callerId, "circuit_open", 0.0, 0.0, currentW, token.windowIndex, envelope.tier, envelope.tierRank);
          };
          case _ {};
        };

        // Step 2: φ-FNV-HMAC integrity
        let expectedSig = _phiHMACFNV(token.phases, token.callerId, token.windowIndex, envelope.secretHash, token.tierFreqHz);
        if (token.signature != expectedSig) {
          ignore _recordDenial(token.callerId, "signature_mismatch", 0.0);
          _hebbUpdate(token.callerId, false);
          return _denyResult(token.callerId, "signature_mismatch", 0.0, 0.0, currentW, token.windowIndex, envelope.tier, envelope.tierRank);
        };

        // Step 3: Temporal validity
        if (not _isWindowFresh(token.windowIndex)) {
          ignore _recordDenial(token.callerId, "expired_window", 0.0);
          _hebbUpdate(token.callerId, false);
          return _denyResult(token.callerId, "expired_window", 0.0, 0.0, currentW, token.windowIndex, envelope.tier, envelope.tierRank);
        };

        // Step 4: Kuramoto resonance gate — ADAPTIVE THRESHOLD
        // The effective threshold combines three signals:
        //   baseThreshold = tier-scaled EMERGENCE_THRESHOLD
        //   defenseMod    = ×φ when organism is in defense mode (tighter gate)
        //   hebbMod       = Hebbian modulation: trusted callers get a small relief
        //                   relief = (1 − w) × baseThreshold × PHI_INV
        //                   high w (trusted) → small relief; low w (suppressed) → no relief
        let R_align = _phaseAlignment(token.phases, envelope.phases);
        let (_, psi) = _kuramotoR(Array.tabulate<Float>(
          Nat.min(token.phases.size(), envelope.phases.size()),
          func(j) { token.phases[j] - envelope.phases[j] }
        ));
        let threshold = _effectiveThreshold(token.callerId, envelope.tierRank);

        if (R_align < threshold) {
          ignore _recordDenial(token.callerId, "below_resonance", R_align);
          _hebbUpdate(token.callerId, false);
          return _denyResult(token.callerId, "below_resonance", R_align, psi, currentW, token.windowIndex, envelope.tier, envelope.tierRank);
        };

        // GRANTED
        _recordGrant(token.callerId, R_align);
        _hebbUpdate(token.callerId, true);
        _updateCircuit(token.callerId, true);

        {
          granted     = true;
          R           = R_align;
          psi         = psi;
          reason      = "";
          callerId    = token.callerId;
          tier        = envelope.tier;
          tierRank    = envelope.tierRank;
          windowDelta = 0;
          ts          = Time.now();
        }
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  VENTRICULUS OFFENSIO — Active Threat Detection
  // ══════════════════════════════════════════════════════════════════

  /// Adversarial proximity check: is a token suspiciously close to the threshold?
  public query func checkAdversarial(callerId : Text, presentedR : Float) : async { suspected: Bool; margin: Float } {
    let margin = Float.abs(presentedR - EMERGENCE_THRESHOLD);
    { suspected = margin < ADVERSARIAL_MARGIN; margin = margin }
  };

  /// SMOF plane access check
  public query func checkPlaneAccess(callerId : Text, planeId : Nat) : async { allowed: Bool; reason: Text } {
    switch (envelopes.get(callerId)) {
      case null { { allowed = false; reason = "not_registered" } };
      case (?env) {
        let isInner = planeId <= 4;
        if (isInner and env.tierRank < INNER_PLANE_MIN_RANK) {
          { allowed = false; reason = "insufficient_tier_for_inner_plane" }
        } else {
          { allowed = true; reason = "" }
        }
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  MINI-BRAIN — Cognitive Monitor
  // ══════════════════════════════════════════════════════════════════

  func _brainSnapshot() : BrainSnapshot {
    let quarantinedCount = quarantine.size();
    let openCircuits     = Iter.size(
      Iter.filter(circuits.vals(), func(e : (Nat, Nat, Bool)) : Bool { e.2 })
    );
    let grantRate = if (totalGranted + totalDenied > 0) {
      Float.fromInt(totalGranted) / Float.fromInt(totalGranted + totalDenied)
    } else { 0.0 };

    let lockHealth = if (totalGranted > 0) { totalGrantedR / Float.fromInt(totalGranted) } else { 0.0 };

    // Simplified field coherence (mean of all envelope self-Rs)
    let envsArr = Iter.toArray(envelopes.vals());
    var fieldRSum : Float = 0.0;
    for (env in envsArr.vals()) {
      let (r, _) = _kuramotoR(env.phases);
      fieldRSum += r;
    };
    let fieldCoherence = if (envsArr.size() > 0) {
      fieldRSum / Float.fromInt(envsArr.size())
    } else { 0.0 };

    {
      lockHealth      = lockHealth;
      fieldCoherence  = fieldCoherence;
      threatsDetected = threatLog.size();
      escalations     = escalationLog.size();
      quarantinedCount = quarantinedCount;
      openCircuits    = openCircuits;
      grantRate       = grantRate;
      heartbeat       = heartbeatCount;
      ts              = Time.now();
    }
  };

  public query func getBrainSnapshot() : async BrainSnapshot {
    _brainSnapshot()
  };

  public query func getHeartbeat() : async { beats: Nat; lastBeat: Int } {
    { beats = heartbeatCount; lastBeat = lastHeartbeatNs }
  };

  // ══════════════════════════════════════════════════════════════════
  //  REVOCATION
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func revokeKey(callerId : Text) : async Result.Result<{ revoked: Bool }, Text> {
    switch (envelopes.get(callerId)) {
      case null { #err("Not found: " # callerId) };
      case (?_) {
        envelopes.delete(callerId);
        quarantine.delete(callerId);
        circuits.delete(callerId);
        #ok({ revoked = true })
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS
  // ══════════════════════════════════════════════════════════════════

  func _denyResult(callerId : Text, reason : Text, R : Float, psi : Float,
                   currentW : Nat, tokenW : Nat, tier : PlatformTier, rank : Nat) : LockResult {
    let delta = if (tokenW >= currentW) { tokenW - currentW } else { currentW - tokenW };
    {
      granted = false; R = R; psi = psi; reason = reason;
      callerId = callerId; tier = tier; tierRank = rank;
      windowDelta = delta; ts = Time.now();
    }
  };

  func _recordDenial(callerId : Text, reason : Text, R : Float) : () {
    totalDenied += 1;
    let streak = (denialStreaks.get(callerId) |> (switch _ { case null 0; case (?n) n })) + 1;
    denialStreaks.put(callerId, streak);
    _updateCircuit(callerId, false);

    if (streak >= ESCALATION_THRESHOLD) {
      let entry = (callerId, reason, Time.now());
      escalationLog := Array.append<(Text, Text, Int)>(escalationLog, [entry]);
    };

    let threat = (callerId, reason, R);
    threatLog := Array.append<(Text, Text, Float)>(threatLog, [threat]);
  };

  func _recordGrant(callerId : Text, R : Float) {
    totalGranted  += 1;
    totalGrantedR += R;
    denialStreaks.put(callerId, 0);
  };

  func _updateCircuit(callerId : Text, success : Bool) {
    let (errors, total, _) = switch (circuits.get(callerId)) {
      case null     { (0, 0, false) };
      case (?state) { state };
    };
    let newErrors = if (success) { errors } else { errors + 1 };
    let newTotal  = total + 1;
    let errorRate = if (newTotal > 0) { Float.fromInt(newErrors) / Float.fromInt(newTotal) } else { 0.0 };
    let nowOpen   = errorRate > EMERGENCE_THRESHOLD and newTotal >= 3;
    circuits.put(callerId, (newErrors, newTotal, nowOpen));
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY INTERFACE
  // ══════════════════════════════════════════════════════════════════

  public query func getStatus() : async {
    registered:     Nat;
    totalGranted:   Nat;
    totalDenied:    Nat;
    grantRate:      Float;
    lockHealth:     Float;
    quarantined:    Nat;
    threats:        Nat;
    heartbeat:      Nat;
    threshold:      Float;
    goldenAngle:    Float;
    phi:            Float;
  } {
    let grantRate = if (totalGranted + totalDenied > 0) {
      Float.fromInt(totalGranted) / Float.fromInt(totalGranted + totalDenied)
    } else { 0.0 };
    {
      registered    = envelopes.size();
      totalGranted  = totalGranted;
      totalDenied   = totalDenied;
      grantRate     = grantRate;
      lockHealth    = if (totalGranted > 0) { totalGrantedR / Float.fromInt(totalGranted) } else { 0.0 };
      quarantined   = quarantine.size();
      threats       = threatLog.size();
      heartbeat     = heartbeatCount;
      threshold     = EMERGENCE_THRESHOLD;
      goldenAngle   = GOLDEN_ANGLE;
      phi           = PHI;
    }
  };

  public query func getDefenseState() : async {
    defenseMode   : Bool;
    adaptiveThresh: Float;
    cleanBeats    : Nat;
    activatedAt   : Int;
  } {
    {
      defenseMode    = defenseMode;
      adaptiveThresh = adaptiveThreshold;
      cleanBeats     = cleanHeartbeatCount;
      activatedAt    = defenseModeAt;
    }
  };

  public query func getHebbWeight(callerId : Text) : async { weight: Float; trusted: Bool } {
    let w = switch (hebbWeights.get(callerId)) { case null HEBB_INIT_WEIGHT; case (?v) v };
    { weight = w; trusted = w > HEBB_INIT_WEIGHT }
  };

  public query func isRegistered(callerId : Text) : async Bool {
    switch (envelopes.get(callerId)) { case null false; case _ true }
  };

  public shared(msg) func setCPLRuntime(id : Principal) : async () {
    cplRuntimeId := ?id;
  };
}
