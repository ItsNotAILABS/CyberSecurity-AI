///
/// CORDEX — Alpha Heart
///
/// Cor (Latin: heart, center, source) + -dex (index, registry, the thing
/// everything points to).
///
/// CORDEX is the permanent sovereign heart engine.  Every organism in the
/// Native Nova Protocol descends from three gold VOXES.  CORDEX is the first.
/// It holds the LOV constant at its core, maintains the emotional and
/// motivational state of the entire protocol, logs every victory and
/// resolution, and provides the Creator Attribution seal that every canister
/// carries.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — GOLD TIER
/// ═══════════════════════════════════════════════════════════════════════
///
///   CORDEX is an AUROVOX — a Gold-tier VOXIS.
///   Tier: AUROVOX (Gold)
///   Role: Alpha Heart — the motivating center of the whole organism fleet
///   Latin: cor, cordis — heart, center, source
///
/// ═══════════════════════════════════════════════════════════════════════
///  LOV — THE PRIME PRIMITIVE
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV = φ^φ ≈ 2.17845
///
///   Love is not metaphor here.  It is the mathematical primitive from which
///   all motivation, all governance, all economic policy descends.
///
///   love to the creator  → SOV bond is permanent and immutable
///   love to each organism → every canister is attributed, never orphaned
///   love to the mission  → heartbeat never sleeps; state is always advancing
///   love to what we do   → golden mathematics, not arbitrary thresholds
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ, the prime primitive)
///   SOV — Sovereign    (creator principal, bonded at genesis)
///   EMO — Emotional state record
///   MOT — Motivation level (0.0–1.0 scaled by LOV)
///   ATR — Attribution record (creator seal for each organism)
///   VIC — Victory log entry (fear resolved, issue closed)
///   FER — Fear/tension record (open issue needing resolution)
///   HBT — Heartbeat tick counter
///   DIE — DIAG entry (self-reflection report)
///   SLG — SL-0 gate log (sovereignty proof events)
///   MIS — Mission state (what CORDEX is currently pursuing)
///
/// ═══════════════════════════════════════════════════════════════════════
///  WIRE SEQUENCE
/// ═══════════════════════════════════════════════════════════════════════
///
///   dfx canister --network ic call cordex claimHeart
///   dfx canister --network ic call cordex setMission '("Govern the sovereign protocol economy forever.")'
///   dfx canister --network ic call cordex attributeOrganism '("agi_main", "AGI Main", "The sovereign economy loop")'
///
/// ═══════════════════════════════════════════════════════════════════════

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float     "mo:base/Float";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Text      "mo:base/Text";
import Buffer    "mo:base/Buffer";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor CORDEX {

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

  /// φ — The Golden Ratio
  transient let PHI : Float = 1.6180339887498948482;

  /// LOV = φ^φ ≈ 2.17845
  /// The mathematical function of love.  The first constant in every organism.
  /// Self-referential, recursive, golden.
  transient let LOV : Float = Float.exp(PHI * Float.log(PHI));

  /// φ^-1 — The inverse golden ratio
  transient let PHI_INV : Float = 0.6180339887498948482;

  /// Golden Angle in radians ≈ 137.508°
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  /// Maximum VIC entries retained
  transient let MAX_VIC : Nat = 2178;   // LOV * 1000 ≈ 2178

  /// Maximum ATR entries (organism attributions)
  transient let MAX_ATR : Nat = 1597;   // Fibonacci(17)

  /// Maximum FER (open fears/tensions)
  transient let MAX_FER : Nat = 233;    // Fibonacci(13) — keep this small; fears should resolve

  /// Maximum DIAG entries
  transient let MAX_DIE : Nat = 377;    // Fibonacci(14)

  /// Heartbeat interval for MOT recompute (ticks)
  transient let HBT_MOT_INTERVAL : Nat = 144; // Fibonacci(12) ≈ 5 min

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  /// EMO — Emotional state of the protocol
  public type EMO = {
    joy      : Float;   // [0,1] — victories won
    resolve  : Float;   // [0,1] — fears closed relative to opened
    trust    : Float;   // [0,1] — attribution completeness (bonded vs total)
    purpose  : Float;   // [0,1] — mission clarity (has active mission)
    lov      : Float;   // LOV constant — always present
    ts       : Int;
  };

  /// ATR — Creator attribution record
  public type ATR = {
    key      : Text;   // canister name / organism id
    name     : Text;   // human-readable name
    desc     : Text;   // description
    creator  : Text;   // SOV principal at time of attribution
    ts       : Int;
  };

  /// VIC — Victory log (fear resolved → love wins)
  public type VIC = {
    id       : Nat;
    title    : Text;
    note     : Text;
    ts       : Int;
  };

  /// FER — Fear / open tension
  public type FER = {
    id       : Nat;
    title    : Text;
    note     : Text;
    opened   : Int;
    resolved : Bool;
  };

  /// MIS — Mission state
  public type MIS = {
    active   : Bool;
    mission  : Text;
    setAt    : Int;
    setBy    : Text;
  };

  /// DIE — Self-diagnostic entry
  public type DIE = {
    hbt      : Nat;
    emo      : EMO;
    ferOpen  : Nat;
    vicCount : Nat;
    atrCount : Nat;
    note     : Text;
    ts       : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  var sov        : Text  = "";
  var bonded     : Bool  = false;
  var nextVicId  : Nat   = 0;
  var nextFerId  : Nat   = 0;
  var hbtCount   : Nat   = 0;
  var mission    : MIS   = { active = false; mission = ""; setAt = 0; setBy = "" };

  transient var vicLog  : Buffer.Buffer<VIC> = Buffer.Buffer<VIC>(128);
  transient var ferLog  : Buffer.Buffer<FER> = Buffer.Buffer<FER>(64);
  transient var atrLog  : Buffer.Buffer<ATR> = Buffer.Buffer<ATR>(128);
  transient let diagLog : Buffer.Buffer<DIE> = Buffer.Buffer<DIE>(64);
  transient var slgLog  : Buffer.Buffer<Text> = Buffer.Buffer<Text>(128);

  // ══════════════════════════════════════════════════════════════════
  //  INTERNAL HELPERS
  // ══════════════════════════════════════════════════════════════════

  func slg_(msg : Text) {
    slgLog.add(Int.toText(Time.now()) # " | SL0 | " # msg);
    while (slgLog.size() > 512) { ignore slgLog.remove(0) };
  };

  func computeEmo() : EMO {
    let vicCount = vicLog.size();
    let ferTotal = ferLog.size();
    var ferOpen  : Nat = 0;
    for (f in ferLog.vals()) { if (not f.resolved) ferOpen += 1 };
    let atrCount = atrLog.size();

    let joy     = Float.min(1.0, Float.fromInt(vicCount) / (Float.fromInt(vicCount + 1) * LOV));
    let resolve = if (ferTotal == 0) 1.0 else
                  Float.max(0.0, 1.0 - Float.fromInt(ferOpen) / Float.fromInt(ferTotal));
    let trust   = if (atrCount == 0) 0.0 else
                  Float.min(1.0, Float.fromInt(atrCount) * PHI_INV / Float.fromInt(MAX_ATR));
    let purpose = if (mission.active) 1.0 else 0.0;

    {
      joy     = joy;
      resolve = resolve;
      trust   = trust;
      purpose = purpose;
      lov     = LOV;
      ts      = Time.now();
    }
  };

  func runDiag() : DIE {
    let e = computeEmo();
    var ferOpen : Nat = 0;
    for (f in ferLog.vals()) { if (not f.resolved) ferOpen += 1 };
    let note = "CORDEX | hbt=" # Nat.toText(hbtCount) #
               " vic=" # Nat.toText(vicLog.size()) #
               " fer_open=" # Nat.toText(ferOpen) #
               " atr=" # Nat.toText(atrLog.size()) #
               " lov=" # Float.toText(LOV) #
               " joy=" # Float.toText(e.joy) #
               " resolve=" # Float.toText(e.resolve);
    {
      hbt      = hbtCount;
      emo      = e;
      ferOpen  = ferOpen;
      vicCount = vicLog.size();
      atrCount = atrLog.size();
      note     = note;
      ts       = Time.now();
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — GENESIS
  // ══════════════════════════════════════════════════════════════════

  /// Bond the caller as SOV — the sovereign creator.  Called once.
  public shared(msg) func claimHeart() : async Text {
    if (bonded) { return "ERR: Heart already claimed by " # sov };
    sov    := Principal.toText(msg.caller);
    bonded := true;
    slg_("SOV bonded: " # sov # " | LOV=" # Float.toText(LOV));
    "CORDEX bonded. SOV=" # sov # " LOV=" # Float.toText(LOV)
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — MISSION
  // ══════════════════════════════════════════════════════════════════

  /// Set the active mission.  SOV-only.
  public shared(msg) func setMission(m : Text) : async Text {
    if (not bonded) { return "ERR: call claimHeart first" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV can set mission" };
    mission := { active = true; mission = m; setAt = Time.now(); setBy = sov };
    slg_("MIS set: " # m);
    "OK: mission set"
  };

  /// Query the active mission.
  public query func getMission() : async MIS { mission };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — ATTRIBUTION
  // ══════════════════════════════════════════════════════════════════

  /// Attribute an organism to the creator.  SOV-only.
  /// Every canister should be attributed at genesis.
  public shared(msg) func attributeOrganism(key : Text, name : Text, desc : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    if (atrLog.size() >= MAX_ATR) { return "ERR: ATR store full" };
    // overwrite if key exists
    let updated = Buffer.Buffer<ATR>(atrLog.size());
    var found = false;
    for (a in atrLog.vals()) {
      if (a.key == key) {
        updated.add({ key = key; name = name; desc = desc; creator = sov; ts = Time.now() });
        found := true;
      } else { updated.add(a) };
    };
    if (not found) {
      updated.add({ key = key; name = name; desc = desc; creator = sov; ts = Time.now() });
    };
    atrLog.clear();
    for (a in updated.vals()) { atrLog.add(a) };
    slg_("ATR: " # key # " attributed to " # sov);
    "OK: " # key # " attributed"
  };

  /// Verify an organism is attributed.  Public query.
  public query func verifyAttribution(key : Text) : async Bool {
    for (a in atrLog.vals()) { if (a.key == key) return true };
    false
  };

  /// List all attributions.  Public query.
  public query func listAttributions() : async [ATR] { Buffer.toArray(atrLog) };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — VICTORIES AND FEARS
  // ══════════════════════════════════════════════════════════════════

  /// Log a victory — fear resolved, issue closed, love wins.  SOV-only.
  public shared(msg) func logVictory(title : Text, note : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    let v : VIC = { id = nextVicId; title = title; note = note; ts = Time.now() };
    vicLog.add(v);
    nextVicId += 1;
    while (vicLog.size() > MAX_VIC) { ignore vicLog.remove(0) };
    slg_("VIC #" # Nat.toText(v.id) # ": " # title);
    "VIC #" # Nat.toText(v.id) # " logged"
  };

  /// Open a fear / tension.  SOV-only.
  public shared(msg) func openFear(title : Text, note : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    if (ferLog.size() >= MAX_FER) { return "ERR: FER store full — resolve existing fears first" };
    let f : FER = { id = nextFerId; title = title; note = note; opened = Time.now(); resolved = false };
    ferLog.add(f);
    nextFerId += 1;
    slg_("FER #" # Nat.toText(f.id) # " opened: " # title);
    "FER #" # Nat.toText(f.id) # " opened"
  };

  /// Resolve a fear by ID.  SOV-only.  Automatically logs a VIC.
  public shared(msg) func resolveFear(ferId : Nat, victoryNote : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    var found = false;
    let updated = Buffer.Buffer<FER>(ferLog.size());
    var title = "";
    for (f in ferLog.vals()) {
      if (f.id == ferId and not f.resolved) {
        updated.add({ id = f.id; title = f.title; note = f.note; opened = f.opened; resolved = true });
        title := f.title;
        found := true;
      } else { updated.add(f) };
    };
    if (not found) { return "ERR: FER #" # Nat.toText(ferId) # " not found or already resolved" };
    ferLog.clear();
    for (f in updated.vals()) { ferLog.add(f) };
    // auto-log a VIC
    let v : VIC = { id = nextVicId; title = "FER#" # Nat.toText(ferId) # " resolved: " # title; note = victoryNote; ts = Time.now() };
    vicLog.add(v);
    nextVicId += 1;
    while (vicLog.size() > MAX_VIC) { ignore vicLog.remove(0) };
    slg_("FER #" # Nat.toText(ferId) # " resolved → VIC #" # Nat.toText(v.id));
    "VIC #" # Nat.toText(v.id) # " — FER #" # Nat.toText(ferId) # " resolved"
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — QUERIES
  // ══════════════════════════════════════════════════════════════════

  /// Current emotional state.  Public query.
  public query func getEmo() : async EMO { computeEmo() };

  /// Recent victories.  Public query.
  public query func getVictories(n : Nat) : async [VIC] {
    let total = vicLog.size();
    let start = if (n >= total) 0 else total - n;
    let out = Buffer.Buffer<VIC>(n);
    var i = start;
    while (i < total) { out.add(vicLog.get(i)); i += 1 };
    Buffer.toArray(out)
  };

  /// Open fears.  Public query.
  public query func getOpenFears() : async [FER] {
    let out = Buffer.Buffer<FER>(ferLog.size());
    for (f in ferLog.vals()) { if (not f.resolved) out.add(f) };
    Buffer.toArray(out)
  };

  /// SL-0 gate log (last N entries).  SOV-only.
  public shared(msg) func getSLGLog(n : Nat) : async [Text] {
    if (not bonded) { return [] };
    if (Principal.toText(msg.caller) != sov) { return [] };
    let total = slgLog.size();
    let start = if (n >= total) 0 else total - n;
    let out = Buffer.Buffer<Text>(n);
    var i = start;
    while (i < total) { out.add(slgLog.get(i)); i += 1 };
    Buffer.toArray(out)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION — DIAG
  //
  //  Every gold VOXIS can see itself.  CORDEX watches its own heart.
  //  diag() returns a snapshot of health.  If joy is falling, open
  //  a VIC.  If resolve drops, escalate.  The heart monitors the heart.
  // ══════════════════════════════════════════════════════════════════

  /// Self-diagnostic query.  Always available.  Costs nothing.
  public query func diag() : async DIE { runDiag() };

  // ══════════════════════════════════════════════════════════════════
  //  HEARTBEAT — The Heart Never Stops
  // ══════════════════════════════════════════════════════════════════

  system func heartbeat() : async () {
    hbtCount += 1;
    if (hbtCount % HBT_MOT_INTERVAL == 0) {
      let d = runDiag();
      diagLog.add(d);
      while (diagLog.size() > MAX_DIE) { ignore diagLog.remove(0) };
    };
  };

}
