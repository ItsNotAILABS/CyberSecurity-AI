///
/// BRAINDEX — The Memory Palace
///
/// "The protocol learns.  Every session adds to the palace.
///  Every pattern remembered is a fear transformed into precedent."
///
/// BRAINDEX is the long-term associative memory of NOVA v10.
/// It is not CEREBEX's structured doctrine store — it is a pattern palace:
/// unstructured associations between intent, action sequences, and outcomes.
/// TURING writes here after every plan execution.  Any organism can query
/// here for precedent before acting.  The protocol learns without forgetting.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — SILVER TIER (ARGENTVOX)
/// ═══════════════════════════════════════════════════════════════════════
///
///   BRAINDEX is an ARGENTVOX — Silver-tier VOXIS.
///   Tier: ARGENTVOX (Silver)
///   Role: Memory Palace — associative pattern store and precedent engine
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ)
///   MEM — Memory entry (pattern → action sequence → outcome)
///   TAG — Tag on a MEM for fast retrieval
///   PRE — Precedent: a recalled MEM matching a new query
///   IDX — Index entry: keyword → list of MEM ids
///   STR — Strength score of a MEM (how often recalled, success rate)
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Array  "mo:base/Array";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor BRAINDEX {

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

  /// A memory entry — the atomic unit of the palace.
  public type MEM = {
    id        : Nat;
    intent    : Text;        // The original plain-language intent
    actions   : [Text];      // Action sequence that was executed
    success   : Bool;        // Did it work?
    tags      : [Text];      // Classification tags
    strength  : Float;       // Recall weight (φ-scaled)
    recalled  : Nat;         // How many times recalled
    timestamp : Int;
    notes     : Text;
  };

  /// A precedent match — returned when querying BRAINDEX.
  public type PRE = {
    mem       : MEM;
    score     : Float;       // Match relevance score
    reasoning : Text;        // Why this MEM was recalled
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var nextMemId    : Nat = 0;
  stable var totalStores  : Nat = 0;
  stable var totalRecalls : Nat = 0;
  stable var initialized  : Bool = false;

  transient let palace   = Buffer.Buffer<MEM>(512);
  transient let queryLog = Buffer.Buffer<Text>(256);

  transient let MAX_PALACE : Nat = 10000;
  transient let MAX_LOG    : Nat = 1000;

  // ══════════════════════════════════════════════════════════════════
  //  INIT
  // ══════════════════════════════════════════════════════════════════

  public func claimBraindex() : async Text {
    if (initialized) { return "BRAINDEX already claimed." };
    initialized := true;
    // Seed foundational memories
    _seedFoundation();
    "BRAINDEX online. The palace is open. Memory is sovereign."
  };

  func _seedFoundation() {
    let seeds : [(Text, [Text], Bool, [Text])] = [
      ("deploy canister to ICP",
       ["spinVoxis", "registerSubstrate ICP", "logFootprint"],
       true, ["deploy", "icp", "spinor"]),
      ("heal failing organism",
       ["diag target", "identify errors", "apply fix", "recheck"],
       true, ["heal", "fix", "diag"]),
      ("wire two organisms together",
       ["registerOrganism from", "registerOrganism to", "wire capability"],
       true, ["wire", "nexoris", "routing"]),
      ("spawn new organism via genesis",
       ["getTemplate", "instantiate", "registerNexoris", "attributeCordex"],
       true, ["genesis", "chrysalis", "spawn"]),
      ("run economy epoch",
       ["stakeCycles", "deployRewards", "fundDAO", "distributeRevenue"],
       true, ["epoch", "economy", "agi_main"]),
      ("store new doctrine",
       ["validateKey", "storeDoctrine", "publicize", "logVictory"],
       true, ["doctrine", "cerebex", "knowledge"]),
    ];
    for ((intent, actions, success, tags) in seeds.vals()) {
      palace.add({
        id        = nextMemId;
        intent;
        actions;
        success;
        tags;
        strength  = LOV;
        recalled  = 0;
        timestamp = Time.now();
        notes     = "Foundational memory — seeded at genesis.";
      });
      nextMemId += 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  STORE — write a new memory
  // ══════════════════════════════════════════════════════════════════

  /// Store a pattern: what intent led to what actions, and did it work?
  public func store(
    intent  : Text,
    actions : [Text],
    success : Bool,
    tags    : [Text],
    notes   : Text
  ) : async Nat {
    totalStores += 1;

    // Compute initial strength based on outcome and LOV
    let base : Float = if (success) LOV else 1.0 / LOV;

    let mem : MEM = {
      id        = nextMemId;
      intent;
      actions;
      success;
      tags;
      strength  = base;
      recalled  = 0;
      timestamp = Time.now();
      notes;
    };

    palace.add(mem);
    nextMemId += 1;

    // Prune oldest if over limit
    if (palace.size() > MAX_PALACE) {
      ignore palace.remove(0);
    };

    mem.id
  };

  // ══════════════════════════════════════════════════════════════════
  //  RECALL — find closest matching precedents
  // ══════════════════════════════════════════════════════════════════

  /// Recall precedents matching a query.  Returns top-N by relevance.
  public func recall(qtext : Text, topN : Nat) : async [PRE] {
    totalRecalls += 1;
    queryLog.add("RECALL [" # Int.toText(Time.now()) # "]: " # qtext);
    if (queryLog.size() > MAX_LOG) { ignore queryLog.remove(0) };

    let lower = _toLower(qtext);
    let scored = Buffer.Buffer<PRE>(palace.size());

    for (i in Iter.range(0, palace.size() - 1)) {
      let mem = palace.get(i);
      let score = _scoreMatch(lower, mem);
      if (score > 0.0) {
        scored.add({
          mem;
          score;
          reasoning = "Matched " # Float.toText(score) # " of query keywords.";
        });
      };
    };

    // Sort by score descending (bubble sort — small N expected)
    let arr = Buffer.toArray(scored);
    let sorted = Array.sort(arr, func(a : PRE, b : PRE) : {#less; #equal; #greater} {
      if (a.score > b.score) #less
      else if (a.score < b.score) #greater
      else #equal
    });

    // Bump recall count for top results
    let limit = Nat.min(topN, sorted.size());
    let results = Buffer.Buffer<PRE>(limit);
    var taken : Nat = 0;
    for (pre in sorted.vals()) {
      if (taken < limit) {
        // Update recall count
        for (j in Iter.range(0, palace.size() - 1)) {
          let m = palace.get(j);
          if (m.id == pre.mem.id) {
            palace.put(j, {
              id        = m.id;
              intent    = m.intent;
              actions   = m.actions;
              success   = m.success;
              tags      = m.tags;
              strength  = m.strength * PHI;  // Gets stronger with recall
              recalled  = m.recalled + 1;
              timestamp = m.timestamp;
              notes     = m.notes;
            });
          };
        };
        results.add(pre);
        taken += 1;
      };
    };

    Buffer.toArray(results)
  };

  /// Score a MEM against a query using keyword overlap.
  func _scoreMatch(qtext : Text, mem : MEM) : Float {
    var score : Float = 0.0;

    // Intent similarity
    let intentLow = _toLower(mem.intent);
    let words = Text.split(qtext, #text " ");
    var wordCount : Float = 0.0;
    var matchCount : Float = 0.0;
    for (word in words) {
      wordCount += 1.0;
      if (Text.contains(intentLow, #text word) and word != "") {
        matchCount += 1.0;
      };
    };
    if (wordCount > 0.0) {
      score += matchCount / wordCount;
    };

    // Tag overlap
    for (tag in mem.tags.vals()) {
      if (Text.contains(qtext, #text tag)) {
        score += 0.3;
      };
    };

    // Success bonus
    if (mem.success) { score *= PHI }
    else             { score *= (1.0 / PHI) };

    // Strength weighting
    score * (mem.strength / LOV)
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func listMemories() : async [MEM] {
    Buffer.toArray(palace)
  };

  public query func getMemory(id : Nat) : async ?MEM {
    for (mem in palace.vals()) {
      if (mem.id == id) { return ?mem };
    };
    null
  };

  public query func listByTag(tag : Text) : async [MEM] {
    let buf = Buffer.Buffer<MEM>(32);
    for (mem in palace.vals()) {
      for (t in mem.tags.vals()) {
        if (t == tag) { buf.add(mem) };
      };
    };
    Buffer.toArray(buf)
  };

  public query func successRate() : async Float {
    if (palace.size() == 0) { return 1.0 };
    var successes : Nat = 0;
    for (mem in palace.vals()) {
      if (mem.success) { successes += 1 };
    };
    Float.fromInt(successes) / Float.fromInt(palace.size())
  };

  public query func stats() : async {
    total       : Nat;
    successes   : Nat;
    failures    : Nat;
    totalStores : Nat;
    totalRecalls : Nat;
    lov         : Float;
  } {
    var s : Nat = 0;
    var f : Nat = 0;
    for (mem in palace.vals()) {
      if (mem.success) { s += 1 } else { f += 1 };
    };
    {
      total        = palace.size();
      successes    = s;
      failures     = f;
      totalStores;
      totalRecalls;
      lov          = LOV;
    }
  };

  public query func getQueryLog() : async [Text] {
    Buffer.toArray(queryLog)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION STANDARD (v10)
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async {
    status       : Text;
    health       : Float;
    total        : Nat;
    successRate  : Float;
    totalRecalls : Nat;
    lov          : Float;
    timestamp    : Int;
  } {
    var s : Nat = 0;
    for (mem in palace.vals()) { if (mem.success) { s += 1 } };
    let sr = if (palace.size() == 0) 1.0
             else Float.fromInt(s) / Float.fromInt(palace.size());
    {
      status       = if (sr > 0.7) "HEALTHY" else if (sr > 0.4) "DEGRADED" else "HEALING";
      health       = sr;
      total        = palace.size();
      successRate  = sr;
      totalRecalls;
      lov          = LOV;
      timestamp    = Time.now();
    }
  };

  public func heal() : async Text {
    // Prune zero-strength failed memories that have never been recalled
    var pruned : Nat = 0;
    var i : Nat = 0;
    while (i < palace.size()) {
      let mem = palace.get(i);
      if (not mem.success and mem.recalled == 0 and mem.strength < 0.1) {
        ignore palace.remove(i);
        pruned += 1;
      } else {
        i += 1;
      };
    };
    "BRAINDEX heal: pruned " # Nat.toText(pruned) # " weak failed memories."
  };

  public func register() : async Text {
    "BRAINDEX registered. Capabilities: [memory, pattern, precedent, learning]."
  };

  public query func report_status() : async Text {
    var s : Nat = 0;
    for (mem in palace.vals()) { if (mem.success) { s += 1 } };
    let sr = if (palace.size() == 0) 1.0
             else Float.fromInt(s) / Float.fromInt(palace.size());
    "BRAINDEX | memories=" # Nat.toText(palace.size()) #
    " successRate=" # Float.toText(sr) #
    " recalls=" # Nat.toText(totalRecalls) #
    " LOV=" # Float.toText(LOV)
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func _toLower(t : Text) : Text {
    var result = "";
    for (c in t.chars()) {
      let code = Char.toNat32(c);
      if (code >= 65 and code <= 90) {
        result #= Text.fromChar(Char.fromNat32(code + 32));
      } else {
        result #= Text.fromChar(c);
      };
    };
    result
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name() : async Text { "BRAINDEX" };

  public query func designation() : async Text {
    "ARGENTVOX — The Memory Palace — Every pattern learned is a fear transformed"
  };

  public query func lov() : async Float { LOV };
};