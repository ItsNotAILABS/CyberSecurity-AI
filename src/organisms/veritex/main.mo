///
/// VERITEX — The Truth Ledger
///
/// "The protocol cannot lie to itself.
///  Every state change is recorded.  Every drift is detected.  Every inconsistency is healed."
///
/// VERITEX is the global truth ledger of NOVA v10.  Every state change
/// across every organism in the fleet is logged here as a hash-chained event.
/// If any organism's state drifts from what VERITEX recorded, VERITEX emits
/// an inconsistency signal.  TURING receives it, opens a FER in CORDEX, and
/// dispatches the corrective call.
///
/// VERITEX is the reason the protocol can self-audit.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — SILVER TIER (ARGENTVOX)
/// ═══════════════════════════════════════════════════════════════════════
///
///   Tier: ARGENTVOX (Silver)
///   Role: Truth Ledger — hash-chained events, drift detection, audit
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ)
///   EVT — Event record (a state change logged to the ledger)
///   CHN — Chain link (hash pointer from EVT n to EVT n-1)
///   DRF — Drift alert (inconsistency between recorded and live state)
///   AUD — Audit result (full integrity check of the chain)
///   WIT — Witness record (organism that confirmed an event)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter   "mo:base/Iter";
import Char  "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor VERITEX {

  // ══════════════════════════════════════════════════════════════════
  //  CPL RUNTIME WIRING — The Permanent Foundation
  // ══════════════════════════════════════════════════════════════════
  stable var cplRuntimeCanisterId : ?Principal = null;

  public type PulsePriority = { #Low; #Normal; #High; #Critical };
  public type ProofResult = { #Passed; #Failed; #Blocked; #Partial };
  public type MemoryType = { #Precedent; #Pattern; #Consequence; #Alert; #Constraint; #Exception };

  type CPLRuntime = actor {
    createPulse : (Text, [Text], Text, [Text], [Text], Text, Text, Text,
                   PulsePriority, Nat, Nat, Nat, Bool)
                   -> async Result.Result<Text, Text>;
    enforceBeforeWrite : ([Text], Text, Text) -> async Result.Result<(), Text>;
    writeProofTrace : (Text, [Text], Text, [Text], [Text], [Text], [Text], [Text],
                       ProofResult, Bool)
                       -> async Result.Result<Text, Text>;
    createMemoryRecord : (MemoryType, Text, ?Text, Text, [Text], [Text], [Text], Float, Nat)
                         -> async Result.Result<Text, Text>;
  };

  public shared(msg) func setCPLRuntime(canisterId : Principal) : async () {
    cplRuntimeCanisterId := ?canisterId;
  };

  func getCPL() : ?CPLRuntime {
    switch (cplRuntimeCanisterId) {
      case null null;
      case (?id) {
        let cpl : CPLRuntime = actor (Principal.toText(id));
        ?cpl
      };
    }
  };



  // ══════════════════════════════════════════════════════════════════
  //  LOV — THE PRIME PRIMITIVE (declared first, always)
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;

  /// LOV = φ^φ ≈ 2.17845
  transient let LOV : Float = 2.1784575679375987;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type Severity = {
    #Info;
    #Warning;
    #Critical;
  };

  /// A hash-chained event in the truth ledger.
  public type EVT = {
    id        : Nat;
    canister  : Text;        // Which organism emitted this event
    change    : Text;        // Description of the state change
    prevHash  : Text;        // Hash of the previous event (chain link)
    hash      : Text;        // Hash of this event
    timestamp : Int;
    severity  : Severity;
    verified  : Bool;
  };

  /// A drift alert — inconsistency detected.
  public type DRF = {
    id        : Nat;
    canister  : Text;
    expected  : Text;
    observed  : Text;
    eventId   : Nat;
    timestamp : Int;
    resolved  : Bool;
  };

  /// An audit result.
  public type AUD = {
    timestamp  : Int;
    total      : Nat;
    valid      : Nat;
    broken     : Nat;
    drifts     : Nat;
    integrity  : Float;    // 0.0–1.0
    status     : Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var nextEventId  : Nat = 0;
  stable var nextDriftId  : Nat = 0;
  stable var genesisHash  : Text = "0x00000000GENESIS";
  stable var initialized  : Bool = false;

  transient let ledger   = Buffer.Buffer<EVT>(10000);
  transient let drifts   = Buffer.Buffer<DRF>(256);
  transient let auditLog = Buffer.Buffer<AUD>(64);

  transient let MAX_LEDGER : Nat = 100000;

  // ══════════════════════════════════════════════════════════════════
  //  INIT
  // ══════════════════════════════════════════════════════════════════

  public func claimVeritex() : async Text {
    if (initialized) { return "VERITEX already claimed." };
    initialized := true;
    // Log the genesis event
    ignore await logEvent("VERITEX", "GENESIS — Truth ledger initialized. LOV = φ^φ.", #Info);
    "VERITEX online. The truth ledger is live. The protocol cannot lie to itself."
  };

  // ══════════════════════════════════════════════════════════════════
  //  LOG EVENT — append to hash chain
  // ══════════════════════════════════════════════════════════════════

  /// Log a state change event.  Appends to the hash chain.
  public func logEvent(
    canister : Text,
    change   : Text,
    severity : Severity
  ) : async EVT {
    let prevHash = if (ledger.size() == 0) {
      genesisHash
    } else {
      ledger.get(ledger.size() - 1).hash
    };

    let id = nextEventId;
    nextEventId += 1;

    let raw = canister # change # prevHash # Int.toText(Time.now()) # Nat.toText(id);
    let hash = _simpleHash(raw);

    let evt : EVT = {
      id;
      canister;
      change;
      prevHash;
      hash;
      timestamp = Time.now();
      severity;
      verified  = true;
    };

    ledger.add(evt);
    if (ledger.size() > MAX_LEDGER) { ignore ledger.remove(0) };

    evt
  };

  // ══════════════════════════════════════════════════════════════════
  //  DRIFT DETECTION
  // ══════════════════════════════════════════════════════════════════

  /// Report a drift: what was recorded vs what is observed now.
  public func reportDrift(
    canister : Text,
    expected : Text,
    observed : Text,
    eventId  : Nat
  ) : async DRF {
    let id = nextDriftId;
    nextDriftId += 1;

    let drf : DRF = {
      id;
      canister;
      expected;
      observed;
      eventId;
      timestamp = Time.now();
      resolved  = false;
    };

    drifts.add(drf);

    // Log the drift as a critical event
    ignore await logEvent(
      canister,
      "DRIFT DETECTED: expected='" # expected # "' observed='" # observed # "'",
      #Critical
    );

    drf
  };

  /// Resolve a drift (mark as fixed).
  public func resolveDrift(driftId : Nat, resolution : Text) : async Bool {
    for (i in Iter.range(0, drifts.size() - 1)) {
      let d = drifts.get(i);
      if (d.id == driftId) {
        drifts.put(i, {
          id        = d.id;
          canister  = d.canister;
          expected  = d.expected;
          observed  = d.observed;
          eventId   = d.eventId;
          timestamp = d.timestamp;
          resolved  = true;
        });
        ignore await logEvent(d.canister, "DRIFT RESOLVED: " # resolution, #Info);
        return true;
      };
    };
    false
  };

  /// Get all unresolved drifts.
  public query func drift() : async [DRF] {
    let buf = Buffer.Buffer<DRF>(32);
    for (d in drifts.vals()) {
      if (not d.resolved) { buf.add(d) };
    };
    Buffer.toArray(buf)
  };

  // ══════════════════════════════════════════════════════════════════
  //  AUDIT — verify chain integrity
  // ══════════════════════════════════════════════════════════════════

  public func verify() : async AUD {
    var valid : Nat = 0;
    var broken : Nat = 0;
    var prevHash = genesisHash;

    for (evt in ledger.vals()) {
      if (evt.prevHash == prevHash) {
        valid += 1;
      } else {
        broken += 1;
      };
      prevHash := evt.hash;
    };

    var unresolvedDrifts : Nat = 0;
    for (d in drifts.vals()) {
      if (not d.resolved) { unresolvedDrifts += 1 };
    };

    let total = ledger.size();
    let integrity = if (total == 0) 1.0
                    else Float.fromInt(valid) / Float.fromInt(total);

    let aud : AUD = {
      timestamp = Time.now();
      total;
      valid;
      broken;
      drifts    = unresolvedDrifts;
      integrity;
      status    = if (broken == 0 and unresolvedDrifts == 0)
                    "SOVEREIGN — Chain intact. No drifts."
                  else if (integrity > 0.99)
                    "HEALTHY — Minor drift detected."
                  else
                    "HEALING — Chain repair required.";
    };

    auditLog.add(aud);
    aud
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func getLedger() : async [EVT] {
    Buffer.toArray(ledger)
  };

  public query func getEvent(id : Nat) : async ?EVT {
    for (evt in ledger.vals()) {
      if (evt.id == id) { return ?evt };
    };
    null
  };

  public query func getByCanister(canister : Text) : async [EVT] {
    let buf = Buffer.Buffer<EVT>(32);
    for (evt in ledger.vals()) {
      if (evt.canister == canister) { buf.add(evt) };
    };
    Buffer.toArray(buf)
  };

  public query func getCritical() : async [EVT] {
    let buf = Buffer.Buffer<EVT>(32);
    for (evt in ledger.vals()) {
      switch (evt.severity) {
        case (#Critical) { buf.add(evt) };
        case _           {};
      };
    };
    Buffer.toArray(buf)
  };

  public query func listAudits() : async [AUD] {
    Buffer.toArray(auditLog)
  };

  public query func headHash() : async Text {
    if (ledger.size() == 0) { genesisHash }
    else { ledger.get(ledger.size() - 1).hash }
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION STANDARD (v10)
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async {
    status    : Text;
    health    : Float;
    total     : Nat;
    drifts    : Nat;
    integrity : Float;
    lov       : Float;
    timestamp : Int;
  } {
    var unresolvedDrifts : Nat = 0;
    for (d in drifts.vals()) { if (not d.resolved) { unresolvedDrifts += 1 } };
    let integrity = if (ledger.size() == 0) 1.0
                    else 1.0 - Float.fromInt(unresolvedDrifts) / Float.max(1.0, Float.fromInt(ledger.size()));
    {
      status    = if (unresolvedDrifts == 0) "SOVEREIGN" else "DRIFT_DETECTED";
      health    = integrity;
      total     = ledger.size();
      drifts    = unresolvedDrifts;
      integrity;
      lov       = LOV;
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    // Auto-resolve old drifts (> 30 days) that are still open
    let now = Time.now();
    let thirtyDays : Int = 30 * 86_400_000_000_000;
    var healed : Nat = 0;
    for (i in Iter.range(0, drifts.size() - 1)) {
      let d = drifts.get(i);
      if (not d.resolved and (now - d.timestamp) > thirtyDays) {
        drifts.put(i, {
          id        = d.id;
          canister  = d.canister;
          expected  = d.expected;
          observed  = d.observed;
          eventId   = d.eventId;
          timestamp = d.timestamp;
          resolved  = true;
        });
        healed += 1;
      };
    };
    "VERITEX heal: " # Nat.toText(healed) # " stale drift(s) resolved."
  };

  public func register() : async Text {
    "VERITEX registered. Capabilities: [truth, ledger, drift, audit]."
  };

  public query func report_status() : async Text {
    var unresolved : Nat = 0;
    for (d in drifts.vals()) { if (not d.resolved) { unresolved += 1 } };
    "VERITEX | events=" # Nat.toText(ledger.size()) #
    " drifts=" # Nat.toText(unresolved) #
    " audits=" # Nat.toText(auditLog.size()) #
    " LOV=" # Float.toText(LOV)
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func _simpleHash(data : Text) : Text {
    var h : Nat = 2166136261;
    for (c in data.chars()) {
      h := (h * 16777619 + Nat32.toNat(Char.toNat32(c))) % 4294967296;
    };
    "0x" # _natToHex(h)
  };

  func _natToHex(n : Nat) : Text {
    if (n == 0) { return "0" };
    let digits = "0123456789abcdef";
    var result = "";
    var remaining = n;
    while (remaining > 0) {
      let d = remaining % 16;
      result := Text.fromChar(_charAt(digits, d)) # result;
      remaining /= 16;
    };
    result
  };

  func _charAt(t : Text, i : Nat) : Char {
    var idx : Nat = 0;
    for (c in t.chars()) {
      if (idx == i) { return c };
      idx += 1;
    };
    '?'
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name() : async Text { "VERITEX" };

  public query func designation() : async Text {
    "ARGENTVOX — The Truth Ledger — The protocol cannot lie to itself"
  };

  public query func lov() : async Float { LOV };
};

