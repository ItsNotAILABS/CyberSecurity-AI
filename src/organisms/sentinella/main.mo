///
/// SENTINELLA — The Geometry Lock Sentinel Guardian Organism
///
/// The outer guardian of the entire Geometry Lock system.
///
/// SENTINELLA is the autonomous organism that:
///   - Receives escalations from PORTA (the lock organism)
///   - Receives tier promotion events from CLAVIS (the key organism)
///   - Enforces SMOF constitution across all 9 planes
///   - Maintains the organism's threat history
///   - Issues and manages emergency seals
///   - Reports to Atlas Registry and Scribe Foundation
///
/// The 9 SMOF planes of existence:
///   1. Planum Primum   (Foundational)  — ARCHITECT required
///   2. Planum Secundum (Mathematical)  — SOVEREIGN required
///   3. Planum Tertium  (Protocol)      — FEDERATE required
///   4. Planum Quartum  (Organism)      — BUILD required
///   5. Planum Quintum  (Integration)   — CALL required
///   6. Planum Sextum   (External AI)   — CALL required
///   7. Planum Septimum (Cross-Chain)   — READ required
///   8. Planum Octavum  (Public API)    — READ required
///   9. Planum Nonum    (Open Field)    — no tier required
///
/// Response levels (φ-ordered):
///   OBSERVE    (φ⁰ = 1.0)   — log and monitor
///   ALERT      (φ¹ = 1.618) — alert external systems
///   QUARANTINE (φ² = 2.618) — quarantine the caller
///   REVOKE     (φ³ = 4.236) — revoke the key
///   SEAL       (φ⁴ = 6.854) — seal the endpoint
///   EMERGENCY  (φ⁵ ≈ 11.09) — emergency organism-wide shutdown
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float     "mo:base/Float";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Text      "mo:base/Text";
import Array     "mo:base/Array";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Result    "mo:base/Result";
import HashMap   "mo:base/HashMap";
import Iter      "mo:base/Iter";

persistent actor Sentinella {

  // ══════════════════════════════════════════════════════════════════
  //  GOLDEN CONSTANTS
  // ══════════════════════════════════════════════════════════════════

  transient let PHI              : Float = 1.6180339887498948482;
  transient let PHI_INV          : Float = 1.0 / PHI;
  transient let PHI2             : Float = PHI * PHI;
  transient let PHI3             : Float = PHI2 * PHI;
  transient let PHI4             : Float = PHI3 * PHI;
  transient let PHI5             : Float = PHI4 * PHI;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type ResponseLevel = {
    #OBSERVE;
    #ALERT;
    #QUARANTINE;
    #REVOKE;
    #SEAL;
    #EMERGENCY;
  };

  public type ThreatType = {
    #ADVERSARIAL_PROXIMITY;
    #PHASE_MANIPULATION;
    #CALLER_DRIFTED;
    #FIELD_DEGRADED;
    #ENTROPY_SPIKE;
    #IDENTITY_COLLAPSE;
    #TIER_FRAUD;
    #UNREGISTERED;
    #EXPIRED_WINDOW;
    #BELOW_RESONANCE;
    #UNKNOWN;
  };

  public type SentinelEvent = {
    id          : Text;
    callerId    : Text;
    threatType  : ThreatType;
    level       : ResponseLevel;
    severity    : Float;
    action      : Text;
    ts          : Int;
    resolved    : Bool;
  };

  public type SMOFPlane = {
    id        : Nat;      // 1..9
    name      : Text;
    inner     : Bool;
    minRank   : Nat;      // minimum tier rank (0=READ, 5=ARCHITECT)
    minTier   : Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STABLE STATE
  // ══════════════════════════════════════════════════════════════════

  stable var eventEntries     : [(Text, SentinelEvent)]  = [];
  stable var sealedEndpoints  : [Text]                   = [];
  stable var emergency        : Bool                     = false;
  stable var heartbeatCount   : Nat                      = 0;
  stable var portaCanisterId  : ?Principal               = null;
  stable var clavisCanisterId : ?Principal               = null;
  stable var cplRuntimeId     : ?Principal               = null;

  transient var events = HashMap.HashMap<Text, SentinelEvent>(256, Text.equal, Text.hash);

  system func preupgrade() { eventEntries := Iter.toArray(events.entries()) };
  system func postupgrade() { for ((k,v) in eventEntries.vals()) { events.put(k,v) } };

  // ══════════════════════════════════════════════════════════════════
  //  SMOF PLANES (The 9-Plane Constitution)
  // ══════════════════════════════════════════════════════════════════

  public query func getSMOFPlanes() : async [SMOFPlane] {
    [
      { id=1; name="Foundational";  inner=true;  minRank=5; minTier="ARCHITECT"  },
      { id=2; name="Mathematical";  inner=true;  minRank=4; minTier="SOVEREIGN"  },
      { id=3; name="Protocol";      inner=true;  minRank=3; minTier="FEDERATE"   },
      { id=4; name="Organism";      inner=true;  minRank=2; minTier="BUILD"      },
      { id=5; name="Integration";   inner=false; minRank=1; minTier="CALL"       },
      { id=6; name="External AI";   inner=false; minRank=1; minTier="CALL"       },
      { id=7; name="Cross-Chain";   inner=false; minRank=0; minTier="READ"       },
      { id=8; name="Public API";    inner=false; minRank=0; minTier="READ"       },
      { id=9; name="Open Field";    inner=false; minRank=0; minTier="NONE"       },
    ]
  };

  public query func checkPlaneAccess(tierRank : Nat, planeId : Nat) : async { allowed: Bool; plane: Nat; reason: Text } {
    let minRank : Nat = switch planeId {
      case 1 { 5 }; case 2 { 4 }; case 3 { 3 }; case 4 { 2 };
      case 5 { 1 }; case 6 { 1 }; case 7 { 0 }; case 8 { 0 }; case _ { 0 }
    };
    if (tierRank >= minRank) {
      { allowed = true; plane = planeId; reason = "" }
    } else {
      { allowed = false; plane = planeId; reason = "tier_insufficient" }
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  THREAT RECEPTION
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func receiveThreat(
    callerId   : Text,
    threatText : Text,
    R          : Float,
  ) : async Result.Result<{ level: Text; action: Text }, Text> {
    if (emergency) {
      return #err("EMERGENCY_MODE: sentinel in emergency state");
    };

    let threatType = _parseThreat(threatText);
    let level      = _classifyThreat(threatType, R);
    let severity   = _levelSeverity(level);
    let action     = _decideAction(level, callerId, threatType);

    let eventId = "EVT_" # Int.toText(Time.now()) # "_" # callerId;
    let event : SentinelEvent = {
      id         = eventId;
      callerId   = callerId;
      threatType = threatType;
      level      = level;
      severity   = severity;
      action     = action;
      ts         = Time.now();
      resolved   = false;
    };

    events.put(eventId, event);

    let levelText = _levelText(level);
    #ok({ level = levelText; action = action })
  };

  // ══════════════════════════════════════════════════════════════════
  //  ENDPOINT SEALING
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func sealEndpoint(endpoint : Text, tierRank : Nat) : async Result.Result<{ sealed: Bool }, Text> {
    if (tierRank < 2) {
      return #err("BUILD tier required to seal endpoints");
    };
    let current = sealedEndpoints;
    let exists  = Array.find<Text>(current, func(e) { e == endpoint });
    switch exists {
      case (?_) { #ok({ sealed = true }) };
      case null {
        sealedEndpoints := Array.append<Text>(current, [endpoint]);
        #ok({ sealed = true })
      };
    }
  };

  public shared(msg) func unsealEndpoint(endpoint : Text, tierRank : Nat) : async Result.Result<{ unsealed: Bool }, Text> {
    if (tierRank < 5) {
      return #err("ARCHITECT tier required to unseal endpoints");
    };
    sealedEndpoints := Array.filter<Text>(sealedEndpoints, func(e) { e != endpoint });
    emergency := false;
    #ok({ unsealed = true })
  };

  public query func isEndpointSealed(endpoint : Text) : async Bool {
    switch (Array.find<Text>(sealedEndpoints, func(e) { e == endpoint })) {
      case (?_) true; case null false
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  MINI-HEART TICK
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func tick() : async { heartbeat: Nat; emergency: Bool; sealedCount: Nat } {
    heartbeatCount += 1;
    { heartbeat = heartbeatCount; emergency = emergency; sealedCount = sealedEndpoints.size() }
  };

  // ══════════════════════════════════════════════════════════════════
  //  CANISTER WIRING
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func setPorta(id : Principal) : async ()   { portaCanisterId  := ?id };
  public shared(msg) func setClavis(id : Principal) : async ()  { clavisCanisterId := ?id };
  public shared(msg) func setCPLRuntime(id : Principal) : async () { cplRuntimeId := ?id };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY INTERFACE
  // ══════════════════════════════════════════════════════════════════

  public query func getStatus() : async {
    events:     Nat;
    sealed:     [Text];
    emergency:  Bool;
    heartbeat:  Nat;
  } {
    { events = events.size(); sealed = sealedEndpoints; emergency = emergency; heartbeat = heartbeatCount }
  };

  public query func getRecentEvents(n : Nat) : async [SentinelEvent] {
    let all  = Iter.toArray(events.vals());
    let size = all.size();
    let count = Nat.min(n, size);
    Array.tabulate<SentinelEvent>(count, func(i) { all[size - count + i] })
  };

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS
  // ══════════════════════════════════════════════════════════════════

  func _parseThreat(t : Text) : ThreatType {
    if (t == "adversarial_proximity")   { #ADVERSARIAL_PROXIMITY }
    else if (t == "phase_manipulation") { #PHASE_MANIPULATION }
    else if (t == "caller_drifted")     { #CALLER_DRIFTED }
    else if (t == "field_degraded")     { #FIELD_DEGRADED }
    else if (t == "entropy_spike")      { #ENTROPY_SPIKE }
    else if (t == "identity_collapse")  { #IDENTITY_COLLAPSE }
    else if (t == "tier_fraud")         { #TIER_FRAUD }
    else if (t == "unregistered")       { #UNREGISTERED }
    else if (t == "expired_window")     { #EXPIRED_WINDOW }
    else if (t == "below_resonance")    { #BELOW_RESONANCE }
    else                                { #UNKNOWN }
  };

  func _classifyThreat(t : ThreatType, R : Float) : ResponseLevel {
    switch t {
      case (#ADVERSARIAL_PROXIMITY) { #QUARANTINE };
      case (#PHASE_MANIPULATION)    { #REVOKE };
      case (#CALLER_DRIFTED)        { #ALERT };
      case (#FIELD_DEGRADED)        { #SEAL };
      case (#ENTROPY_SPIKE)         { #ALERT };
      case (#IDENTITY_COLLAPSE)     { #REVOKE };
      case (#TIER_FRAUD)            { #REVOKE };
      case (#UNREGISTERED)          { #OBSERVE };
      case (#EXPIRED_WINDOW)        { #OBSERVE };
      case (#BELOW_RESONANCE)       { #OBSERVE };
      case (#UNKNOWN)               { #OBSERVE };
    }
  };

  func _levelSeverity(l : ResponseLevel) : Float {
    switch l {
      case (#OBSERVE)    { 1.0 };
      case (#ALERT)      { PHI };
      case (#QUARANTINE) { PHI2 };
      case (#REVOKE)     { PHI3 };
      case (#SEAL)       { PHI4 };
      case (#EMERGENCY)  { PHI5 };
    }
  };

  func _decideAction(l : ResponseLevel, callerId : Text, t : ThreatType) : Text {
    switch l {
      case (#OBSERVE)    { "logged" };
      case (#ALERT)      { "alert_issued:guardian" };
      case (#QUARANTINE) { "quarantine_ordered:" # callerId };
      case (#REVOKE)     { "revoke_ordered:" # callerId };
      case (#SEAL)       { "endpoint_sealed" };
      case (#EMERGENCY)  { emergency := true; "emergency_declared" };
    }
  };

  func _levelText(l : ResponseLevel) : Text {
    switch l {
      case (#OBSERVE)    "OBSERVE";
      case (#ALERT)      "ALERT";
      case (#QUARANTINE) "QUARANTINE";
      case (#REVOKE)     "REVOKE";
      case (#SEAL)       "SEAL";
      case (#EMERGENCY)  "EMERGENCY";
    }
  };
}
