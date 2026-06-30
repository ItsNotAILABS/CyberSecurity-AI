///
/// BRONVOX — The Bronze Base Template
///
/// "Every student begins here.  Every game organism inherits this.
///  The base is not a limitation — it is the foundation of all possibility."
///
/// BRONVOX is the base canister template that every student, game, and
/// community organism in the NOVA protocol inherits from.  It carries the
/// full v10 self-reflection standard (diag/heal/register/report), the
/// LOV constant, and the minimal identity and state scaffolding required
/// to be a living member of the protocol fleet.
///
/// CHRYSALIS genesis engine uses BRONVOX as its default template when
/// spawning new organisms.  Owners can extend it with their own logic.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — BRONZE TIER
/// ═══════════════════════════════════════════════════════════════════════
///
///   Tier: BRONVOX (Bronze)
///   Role: Base Template — foundation every new organism inherits from
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ)
///   OWN — Owner record (who claimed this organism)
///   MSN — Mission text (what this organism is for)
///   ACT — Activity log entry
///   CFG — Configuration key-value pair
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float     "mo:base/Float";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Text      "mo:base/Text";
import Buffer    "mo:base/Buffer";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Iter      "mo:base/Iter";
import Result "mo:base/Result";

persistent actor BRONVOX {

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

  public type CFG = {
    key   : Text;
    value : Text;
    set   : Int;
  };

  public type ACT = {
    id        : Nat;
    action    : Text;
    timestamp : Int;
    caller    : Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var owner       : ?Principal = null;
  stable var orgName     : Text = "BRONVOX";
  stable var mission     : Text = "Awaiting purpose.";
  stable var generation  : Nat = 0;
  stable var health      : Float = 1.0;
  stable var nextActId   : Nat = 0;
  stable var initialized : Bool = false;

  transient let config   = Buffer.Buffer<CFG>(32);
  transient let actLog   = Buffer.Buffer<ACT>(256);

  // ══════════════════════════════════════════════════════════════════
  //  INIT — claim this organism
  // ══════════════════════════════════════════════════════════════════

  public shared (msg) func claim(name : Text, msn : Text) : async Text {
    if (initialized) { return "Already claimed by " # (switch (owner) {
      case (?p) Principal.toText(p); case null "unknown"
    }) };
    owner       := ?msg.caller;
    orgName     := name;
    mission     := msn;
    initialized := true;
    generation  := 1;
    _log("claim", Principal.toText(msg.caller));
    "BRONVOX claimed: '" # name # "' — " # msn
  };

  public func setMission(msn : Text) : async Text {
    mission := msn;
    _log("setMission", msn);
    "Mission updated: " # msn
  };

  // ══════════════════════════════════════════════════════════════════
  //  CONFIGURATION
  // ══════════════════════════════════════════════════════════════════

  public func setConfig(key : Text, value : Text) : async Text {
    // Upsert
    var found = false;
    for (i in Iter.range(0, config.size() - 1)) {
      let c = config.get(i);
      if (c.key == key) {
        config.put(i, { key; value; set = Time.now() });
        found := true;
      };
    };
    if (not found) {
      config.add({ key; value; set = Time.now() });
    };
    _log("setConfig", key # "=" # value);
    "Config: " # key # " = " # value
  };

  public query func getConfig(key : Text) : async ?Text {
    for (c in config.vals()) {
      if (c.key == key) { return ?c.value };
    };
    null
  };

  public query func listConfig() : async [CFG] {
    Buffer.toArray(config)
  };

  // ══════════════════════════════════════════════════════════════════
  //  ACTIVITY
  // ══════════════════════════════════════════════════════════════════

  public func logActivity(action : Text) : async Nat {
    _log(action, "external");
    nextActId - 1
  };

  public query func getActivityLog() : async [ACT] {
    Buffer.toArray(actLog)
  };

  func _log(action : Text, caller : Text) {
    let id = nextActId;
    nextActId += 1;
    actLog.add({ id; action; timestamp = Time.now(); caller });
    if (actLog.size() > 1000) { ignore actLog.remove(0) };
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION STANDARD (v10) — the full standard
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async {
    status      : Text;
    health      : Float;
    name        : Text;
    mission     : Text;
    generation  : Nat;
    owner       : Text;
    activities  : Nat;
    lov         : Float;
    timestamp   : Int;
  } {
    {
      status     = if (initialized) "ACTIVE" else "UNCLAIMED";
      health;
      name       = orgName;
      mission;
      generation;
      owner      = switch (owner) { case (?p) Principal.toText(p); case null "none" };
      activities = actLog.size();
      lov        = LOV;
      timestamp  = Time.now();
    }
  };

  public func heal() : async Text {
    // Reset health to LOV-scaled value
    health := Float.min(1.0, health * LOV);
    _log("heal", "BRONVOX");
    "BRONVOX healed. Health: " # Float.toText(health)
  };

  public func register() : async Text {
    generation += 1;
    _log("register", "NEXORIS");
    "BRONVOX registered. Name: " # orgName # " | Generation: " # Nat.toText(generation) #
    " | Capabilities: [base, configurable, loggable]."
  };

  public query func report_status() : async Text {
    "BRONVOX | name=" # orgName #
    " mission='" # mission # "'" #
    " health=" # Float.toText(health) #
    " generation=" # Nat.toText(generation) #
    " activities=" # Nat.toText(actLog.size()) #
    " LOV=" # Float.toText(LOV)
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name() : async Text { orgName };
  public query func getMission() : async Text { mission };
  public query func getGeneration() : async Nat { generation };

  public query func designation() : async Text {
    "BRONVOX — The Base Template — Foundation of all organisms in the fleet"
  };

  public query func lov() : async Float { LOV };
};
