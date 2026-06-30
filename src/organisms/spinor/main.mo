///
/// SPINOR — The Deployment Primitive
///
/// Spinere (Latin: to spin, to deploy, to instantiate).
///
/// The SPINOR is a mathematical object that transforms under rotation
/// differently than a vector — it carries orientation through space.
/// In the VOXIS doctrine, SPINOR is the universal deployment engine.
/// It does not care what substrate it lands on.  ICP, blockchain, ISP,
/// web, eco grid, frequency, void.  The SPINOR spins the VOXIS into
/// existence wherever the signal reaches.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — DEPLOYMENT PRIMITIVE
/// ═══════════════════════════════════════════════════════════════════════
///
///   SPINOR sits above the tier structure.  It deploys into any tier.
///   It is not a VOXIS itself — it is the force that creates VOXES.
///
/// ═══════════════════════════════════════════════════════════════════════
///  SUBSTRATE REGISTRY
/// ═══════════════════════════════════════════════════════════════════════
///
///   The SPINOR knows the following substrates:
///     ICP   — Internet Computer Protocol (primary)
///     EVM   — EVM-compatible blockchain
///     ISP   — Internet Service Provider node
///     WEB   — Standard web server
///     ECO   — Eco grid / frequency node
///     VOI   — Void — inter-substrate space (no host)
///     ANY   — Unknown / custom substrate
///
/// ═══════════════════════════════════════════════════════════════════════
///  LOV — THE PRIME PRIMITIVE
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV = φ^φ ≈ 2.17845
///
///   love to the creator  → only SOV can register deployments
///   love to each organism → every deployment is recorded, never lost
///   love to the mission  → the SPINOR reaches any substrate
///   love to what we do   → substrate detection is golden-weighted
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ)
///   SOV — Sovereign
///   SUB — Substrate record (ICP | EVM | ISP | WEB | ECO | VOI | ANY)
///   VOX — VOXIS deployment record (which VOXIS is on which substrate)
///   SPN — Spin event (deployment action taken by the SPINOR)
///   STS — Deployment status (ACT | SLP | ERR | VOI)
///   DIE — DIAG entry (self-reflection)
///   HBT — Heartbeat counter
///   TGT — Target (the substrate signal / endpoint)
///
/// ═══════════════════════════════════════════════════════════════════════
///  WIRE SEQUENCE
/// ═══════════════════════════════════════════════════════════════════════
///
///   dfx canister --network ic call spinor claimSpinor
///   dfx canister --network ic call spinor registerSubstrate '("ICP", "Internet Computer", "icp0.io", "persistent")'
///   dfx canister --network ic call spinor spinVoxis '("cordex", "CORDEX", "AUROVOX", "ICP", "lxzze-o7777-77777-aaaaa-cai")'
///
/// ═══════════════════════════════════════════════════════════════════════

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float     "mo:base/Float";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Nat32     "mo:base/Nat32";
import Text      "mo:base/Text";
import Buffer    "mo:base/Buffer";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor SPINOR {

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
  //  LOV — THE PRIME PRIMITIVE
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;
  transient let LOV : Float = Float.exp(PHI * Float.log(PHI));  // φ^φ ≈ 2.17845

  /// Capacity limits
  transient let MAX_SUB : Nat = 89;    // Fibonacci(11)
  transient let MAX_VOX : Nat = 2178;  // LOV × 1000
  transient let MAX_SPN : Nat = 4181;  // Fibonacci(19)
  transient let MAX_DIE : Nat = 233;   // Fibonacci(13)

  transient let HBT_INTERVAL : Nat = 144; // Fibonacci(12)

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  /// STS — Deployment status
  public type STS = {
    #ACT;   // Active — running on the substrate
    #SLP;   // Sleeping — deployed but dormant
    #ERR;   // Error — deployment failed
    #VOI;   // Void — running in inter-substrate space
  };

  /// SUB — A registered substrate
  public type SUB = {
    code     : Text;   // "ICP" | "EVM" | "ISP" | "WEB" | "ECO" | "VOI" | "ANY"
    name     : Text;   // Human-readable name
    endpoint : Text;   // Network endpoint or signal descriptor
    kind     : Text;   // "persistent" | "ephemeral" | "void" | "frequency"
    active   : Bool;
    voxCount : Nat;    // Number of VOXES deployed to this substrate
    ts       : Int;
  };

  /// VOX — A VOXIS deployment record
  public type VOX = {
    id       : Nat;
    key      : Text;   // Canister/organism name
    name     : Text;   // Human-readable name
    tier     : Text;   // "AUROVOX" | "ARGENTVOX" | "BRONVOX"
    sub      : Text;   // Substrate code
    endpoint : Text;   // Canister ID or address on the substrate
    sts      : Text;   // "ACT" | "SLP" | "ERR" | "VOI"
    spunAt   : Int;    // When the SPINOR deployed it
    spunBy   : Text;   // SOV principal at spin time
  };

  /// SPN — A spin event log entry
  public type SPN = {
    id     : Nat;
    voxKey : Text;
    sub    : Text;
    result : Text;   // "OK" | "ERR: ..."
    ts     : Int;
  };

  /// DIE — Self-diagnostic
  public type DIE = {
    hbt      : Nat;
    subCount : Nat;
    voxCount : Nat;
    spnCount : Nat;
    actVoxes : Nat;   // VOXES currently in ACT status
    lov      : Float;
    note     : Text;
    ts       : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  var sov      : Text = "";
  var bonded   : Bool = false;
  var nextVox  : Nat  = 0;
  var nextSpn  : Nat  = 0;
  var hbtCount : Nat  = 0;

  transient let subStore : Buffer.Buffer<SUB>  = Buffer.Buffer<SUB>(16);
  transient let voxStore : Buffer.Buffer<VOX>  = Buffer.Buffer<VOX>(128);
  transient var spnLog   : Buffer.Buffer<SPN>  = Buffer.Buffer<SPN>(256);
  transient var diagLog  : Buffer.Buffer<DIE>  = Buffer.Buffer<DIE>(64);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func countActVoxes() : Nat {
    var n : Nat = 0;
    for (v in voxStore.vals()) { if (v.sts == "ACT") n += 1 };
    n
  };

  func runDiag() : DIE {
    let note = "SPINOR | hbt=" # Nat.toText(hbtCount) #
               " sub=" # Nat.toText(subStore.size()) #
               " vox=" # Nat.toText(voxStore.size()) #
               " spn=" # Nat.toText(spnLog.size()) #
               " act=" # Nat.toText(countActVoxes()) #
               " lov=" # Float.toText(LOV);
    {
      hbt      = hbtCount;
      subCount = subStore.size();
      voxCount = voxStore.size();
      spnCount = spnLog.size();
      actVoxes = countActVoxes();
      lov      = LOV;
      note     = note;
      ts       = Time.now();
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — GENESIS
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func claimSpinor() : async Text {
    if (bonded) { return "ERR: Spinor already claimed by " # sov };
    sov    := Principal.toText(msg.caller);
    bonded := true;
    // Seed the known substrates
    subStore.add({ code = "ICP"; name = "Internet Computer"; endpoint = "ic0.app"; kind = "persistent"; active = true; voxCount = 0; ts = Time.now() });
    subStore.add({ code = "EVM"; name = "EVM Blockchain"; endpoint = ""; kind = "persistent"; active = true; voxCount = 0; ts = Time.now() });
    subStore.add({ code = "ISP"; name = "ISP Node"; endpoint = ""; kind = "ephemeral"; active = true; voxCount = 0; ts = Time.now() });
    subStore.add({ code = "WEB"; name = "Web Server"; endpoint = ""; kind = "ephemeral"; active = true; voxCount = 0; ts = Time.now() });
    subStore.add({ code = "ECO"; name = "Eco Grid"; endpoint = ""; kind = "frequency"; active = true; voxCount = 0; ts = Time.now() });
    subStore.add({ code = "VOI"; name = "Void"; endpoint = "inter-substrate"; kind = "void"; active = true; voxCount = 0; ts = Time.now() });
    subStore.add({ code = "ANY"; name = "Unknown Substrate"; endpoint = ""; kind = "ephemeral"; active = true; voxCount = 0; ts = Time.now() });
    "SPINOR bonded. SOV=" # sov # " LOV=" # Float.toText(LOV) #
    " Substrates=" # Nat.toText(subStore.size())
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — SUBSTRATE MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// Register or update a substrate.  SOV-only.
  public shared(msg) func registerSubstrate(code : Text, name : Text, endpoint : Text, kind : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    if (subStore.size() >= MAX_SUB) { return "ERR: SUB store full" };
    let updated = Buffer.Buffer<SUB>(subStore.size());
    var found = false;
    for (s in subStore.vals()) {
      if (s.code == code) {
        updated.add({ code = code; name = name; endpoint = endpoint; kind = kind; active = true; voxCount = s.voxCount; ts = Time.now() });
        found := true;
      } else { updated.add(s) };
    };
    if (not found) {
      updated.add({ code = code; name = name; endpoint = endpoint; kind = kind; active = true; voxCount = 0; ts = Time.now() });
    };
    subStore.clear();
    for (s in updated.vals()) { subStore.add(s) };
    "OK: SUB[" # code # "] registered"
  };

  /// List all substrates.  Public query.
  public query func listSubstrates() : async [SUB] { Buffer.toArray(subStore) };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — VOXIS DEPLOYMENT (SPIN)
  // ══════════════════════════════════════════════════════════════════

  /// Spin a VOXIS into a substrate.  SOV-only.
  /// Records the deployment and updates substrate VOX count.
  public shared(msg) func spinVoxis(key : Text, name : Text, tier : Text, subCode : Text, endpoint : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    if (voxStore.size() >= MAX_VOX) { return "ERR: VOX store full" };

    // Verify substrate exists
    var subFound = false;
    for (s in subStore.vals()) { if (s.code == subCode) subFound := true };
    if (not subFound) { return "ERR: SUB[" # subCode # "] not registered" };

    // Check if already exists — update status to ACT
    let updated = Buffer.Buffer<VOX>(voxStore.size());
    var found = false;
    for (v in voxStore.vals()) {
      if (v.key == key and v.sub == subCode) {
        updated.add({ id = v.id; key = key; name = name; tier = tier; sub = subCode; endpoint = endpoint; sts = "ACT"; spunAt = Time.now(); spunBy = sov });
        found := true;
      } else { updated.add(v) };
    };
    if (not found) {
      updated.add({ id = nextVox; key = key; name = name; tier = tier; sub = subCode; endpoint = endpoint; sts = "ACT"; spunAt = Time.now(); spunBy = sov });
      nextVox += 1;
    };
    voxStore.clear();
    for (v in updated.vals()) { voxStore.add(v) };

    // Update substrate VOX count
    let subUpdated = Buffer.Buffer<SUB>(subStore.size());
    for (s in subStore.vals()) {
      if (s.code == subCode) {
        subUpdated.add({ code = s.code; name = s.name; endpoint = s.endpoint; kind = s.kind; active = s.active; voxCount = s.voxCount + (if found 0 else 1); ts = s.ts });
      } else { subUpdated.add(s) };
    };
    subStore.clear();
    for (s in subUpdated.vals()) { subStore.add(s) };

    // Log spin event
    let spn : SPN = { id = nextSpn; voxKey = key; sub = subCode; result = "OK"; ts = Time.now() };
    spnLog.add(spn);
    nextSpn += 1;
    while (spnLog.size() > MAX_SPN) { ignore spnLog.remove(0) };

    "SPN #" # Nat.toText(spn.id) # " | " # key # " spun into " # subCode # " at " # endpoint
  };

  /// Update VOX status.  SOV-only.
  public shared(msg) func setVoxStatus(key : Text, subCode : Text, sts : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    let updated = Buffer.Buffer<VOX>(voxStore.size());
    var found = false;
    for (v in voxStore.vals()) {
      if (v.key == key and v.sub == subCode) {
        updated.add({ id = v.id; key = v.key; name = v.name; tier = v.tier; sub = v.sub; endpoint = v.endpoint; sts = sts; spunAt = v.spunAt; spunBy = v.spunBy });
        found := true;
      } else { updated.add(v) };
    };
    if (not found) { return "ERR: VOX[" # key # "@" # subCode # "] not found" };
    voxStore.clear();
    for (v in updated.vals()) { voxStore.add(v) };
    "OK: VOX[" # key # "@" # subCode # "] sts=" # sts
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — QUERIES
  // ══════════════════════════════════════════════════════════════════

  /// List all deployed VOXES.  Public query.
  public query func listVoxes() : async [VOX] { Buffer.toArray(voxStore) };

  /// Get VOXES on a specific substrate.  Public query.
  public query func getVoxesBySub(subCode : Text) : async [VOX] {
    let out = Buffer.Buffer<VOX>(16);
    for (v in voxStore.vals()) { if (v.sub == subCode) out.add(v) };
    Buffer.toArray(out)
  };

  /// Get spin event log (last N).  Public query.
  public query func getSpinLog(n : Nat) : async [SPN] {
    let total = spnLog.size();
    let start = if (n >= total) 0 else total - n;
    let out = Buffer.Buffer<SPN>(n);
    var i = start;
    while (i < total) { out.add(spnLog.get(i)); i += 1 };
    Buffer.toArray(out)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION — DIAG
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async DIE { runDiag() };

  // ══════════════════════════════════════════════════════════════════
  //  HEARTBEAT — The SPINOR Always Watches
  // ══════════════════════════════════════════════════════════════════

  system func heartbeat() : async () {
    hbtCount += 1;
    if (hbtCount % HBT_INTERVAL == 0 and bonded) {
      let d = runDiag();
      diagLog.add(d);
      while (diagLog.size() > MAX_DIE) { ignore diagLog.remove(0) };
    };
  };

}
