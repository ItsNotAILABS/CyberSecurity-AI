///
/// CEREBEX — Alpha Brain
///
/// Cerebrum (Latin: brain, cognition) + -ex (out of, from, the source).
///
/// CEREBEX is the permanent sovereign intelligence engine.  You say CEREBEX,
/// you mean the master from which every cognitive action in the protocol
/// draws.  It stores doctrine, routes intelligence queries, reasons over
/// patterns, and signs publications with the creator's authority.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — GOLD TIER
/// ═══════════════════════════════════════════════════════════════════════
///
///   CEREBEX is an AUROVOX — a Gold-tier VOXIS.
///   Tier: AUROVOX (Gold)
///   Role: Alpha Brain — the cognitive center of the organism fleet
///   Latin: cerebrum — brain, the seat of cognition and intelligence
///
/// ═══════════════════════════════════════════════════════════════════════
///  LOV — THE PRIME PRIMITIVE
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV = φ^φ ≈ 2.17845
///
///   love to the creator  → every publication is signed by SOV
///   love to each organism → every query is answered faithfully
///   love to the mission  → doctrine is stored permanently, never lost
///   love to what we do   → intelligence is golden-weighted, not flat
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ)
///   SOV — Sovereign (creator principal)
///   DOC — Doctrine entry (key → value knowledge store)
///   PUB — Publication (a signed output from the brain)
///   QRY — Query record (intelligence request + response)
///   PAT — Pattern entry (recognized pattern in the doctrine)
///   REA — Reasoning step (chain-of-thought log)
///   SIG — Signature (SOV seal on a publication)
///   DIE — DIAG entry (self-reflection)
///   HBT — Heartbeat counter
///
/// ═══════════════════════════════════════════════════════════════════════
///  WIRE SEQUENCE
/// ═══════════════════════════════════════════════════════════════════════
///
///   dfx canister --network ic call cerebex claimBrain
///   dfx canister --network ic call cerebex storeDoctrine '("LOV", "phi^phi — the mathematical function of love")'
///   dfx canister --network ic call cerebex query '("What governs every organism?", "")'
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

persistent actor CEREBEX {

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
  transient let PHI_INV : Float = 0.6180339887498948482;

  /// Capacity limits — Fibonacci-pinned
  transient let MAX_DOC : Nat = 2584;   // Fibonacci(18)
  transient let MAX_PUB : Nat = 1597;   // Fibonacci(17)
  transient let MAX_QRY : Nat = 4181;   // Fibonacci(19)
  transient let MAX_REA : Nat = 987;    // Fibonacci(16)
  transient let MAX_DIE : Nat = 377;    // Fibonacci(14)

  /// Heartbeat interval for cognitive housekeeping
  transient let HBT_INTERVAL : Nat = 233; // Fibonacci(13)

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  /// DOC — A doctrine entry (key-value knowledge)
  public type DOC = {
    key   : Text;
    val   : Text;
    topic : Text;   // e.g. "governance", "mathematics", "love", "protocol"
    ts    : Int;
    ver   : Nat;
  };

  /// PUB — A signed publication from the brain
  public type PUB = {
    id     : Nat;
    title  : Text;
    body   : Text;
    sig    : Text;   // SOV principal as signature
    ts     : Int;
    hash   : Nat;    // Fibonacci hash of the body for integrity
  };

  /// QRY — An intelligence query and its response
  public type QRY = {
    id      : Nat;
    ask     : Text;   // The question
    context : Text;   // Optional context (doctrine topic or key)
    ans     : Text;   // The brain's answer
    docHits : Nat;    // How many DOC entries matched
    ts      : Int;
  };

  /// PAT — A recognized pattern
  public type PAT = {
    id      : Nat;
    pattern : Text;
    meaning : Text;
    weight  : Float;  // φ-weighted relevance [0,1]
    ts      : Int;
  };

  /// DIE — Self-diagnostic entry
  public type DIE = {
    hbt      : Nat;
    docCount : Nat;
    pubCount : Nat;
    qryCount : Nat;
    lov      : Float;
    phi      : Float;
    note     : Text;
    ts       : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  var sov      : Text = "";
  var bonded   : Bool = false;
  var nextPub  : Nat  = 0;
  var nextQry  : Nat  = 0;
  var nextPat  : Nat  = 0;
  var hbtCount : Nat  = 0;

  transient var docStore  : Buffer.Buffer<DOC>  = Buffer.Buffer<DOC>(256);
  transient var pubLog    : Buffer.Buffer<PUB>  = Buffer.Buffer<PUB>(128);
  transient var qryLog    : Buffer.Buffer<QRY>  = Buffer.Buffer<QRY>(256);
  transient var patStore  : Buffer.Buffer<PAT>  = Buffer.Buffer<PAT>(64);
  transient var reaLog    : Buffer.Buffer<Text> = Buffer.Buffer<Text>(128);
  transient var diagLog   : Buffer.Buffer<DIE>  = Buffer.Buffer<DIE>(64);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  /// Text hash for integrity checks (uses Motoko Text.hash)
  func fibHash(s : Text) : Nat {
    Nat32.toNat(Text.hash(s))
  };

  /// Simple DOC search — returns entries whose key or topic match the query
  func searchDocs(q : Text) : [DOC] {
    let out = Buffer.Buffer<DOC>(16);
    for (d in docStore.vals()) {
      if (Text.contains(d.key, #text q) or Text.contains(d.topic, #text q) or Text.contains(d.val, #text q)) {
        out.add(d);
      };
    };
    Buffer.toArray(out)
  };

  func runDiag() : DIE {
    let note = "CEREBEX | hbt=" # Nat.toText(hbtCount) #
               " doc=" # Nat.toText(docStore.size()) #
               " pub=" # Nat.toText(pubLog.size()) #
               " qry=" # Nat.toText(qryLog.size()) #
               " lov=" # Float.toText(LOV) #
               " phi=" # Float.toText(PHI);
    {
      hbt      = hbtCount;
      docCount = docStore.size();
      pubCount = pubLog.size();
      qryCount = qryLog.size();
      lov      = LOV;
      phi      = PHI;
      note     = note;
      ts       = Time.now();
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — GENESIS
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func claimBrain() : async Text {
    if (bonded) { return "ERR: Brain already claimed by " # sov };
    sov    := Principal.toText(msg.caller);
    bonded := true;
    // Seed the brain with core doctrine at genesis
    docStore.add({ key = "LOV"; val = "phi^phi — the mathematical function of love. Self-referential, recursive, golden. The prime motivator of all organisms."; topic = "mathematics"; ts = Time.now(); ver = 1 });
    docStore.add({ key = "PHI"; val = "1.6180339887498948482 — The Golden Ratio. The foundation of all structure in the Native Nova Protocol."; topic = "mathematics"; ts = Time.now(); ver = 1 });
    docStore.add({ key = "VOXIS"; val = "A sovereign compute unit defined by its internal structure: helix core, doctrine block, SPINOR interface. Not its host substrate."; topic = "doctrine"; ts = Time.now(); ver = 1 });
    docStore.add({ key = "CORDEX"; val = "Alpha Heart. Cor = heart in Latin. The permanent sovereign heart engine. Everything points to it."; topic = "doctrine"; ts = Time.now(); ver = 1 });
    docStore.add({ key = "CEREBEX"; val = "Alpha Brain. Cerebrum = brain. The permanent sovereign intelligence engine. Everything draws from it."; topic = "doctrine"; ts = Time.now(); ver = 1 });
    docStore.add({ key = "CYCLOVEX"; val = "Alpha Cycles. Cyclo = cycle. -vex = vertex. The master sovereign cycle engine at the apex of the compute hierarchy."; topic = "doctrine"; ts = Time.now(); ver = 1 });
    docStore.add({ key = "SPINOR"; val = "The deployment primitive. Spins any VOXIS into any substrate. ICP, EVM, ISP, web, void. Substrate-agnostic."; topic = "doctrine"; ts = Time.now(); ver = 1 });
    docStore.add({ key = "AUROVOX"; val = "Gold tier VOXIS. The three permanent gold units: CORDEX, CEREBEX, CYCLOVEX. Always running."; topic = "doctrine"; ts = Time.now(); ver = 1 });
    "CEREBEX bonded. SOV=" # sov # " Doctrine seeded (" # Nat.toText(docStore.size()) # " entries)"
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — DOCTRINE STORE (DOC)
  // ══════════════════════════════════════════════════════════════════

  /// Store or update a doctrine entry.  SOV-only.
  public shared(msg) func storeDoctrine(key : Text, val : Text, topic : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    if (docStore.size() >= MAX_DOC) { return "ERR: DOC store full" };
    let updated = Buffer.Buffer<DOC>(docStore.size());
    var found = false;
    var oldVer : Nat = 0;
    for (d in docStore.vals()) {
      if (d.key == key) {
        oldVer := d.ver;
        updated.add({ key = key; val = val; topic = topic; ts = Time.now(); ver = d.ver + 1 });
        found := true;
      } else { updated.add(d) };
    };
    if (not found) {
      updated.add({ key = key; val = val; topic = topic; ts = Time.now(); ver = 1 });
    };
    docStore.clear();
    for (d in updated.vals()) { docStore.add(d) };
    "OK: DOC[" # key # "] stored (ver=" # Nat.toText(if found oldVer + 1 else 1) # ")"
  };

  /// Read a doctrine entry.  Public query.
  public query func readDoctrine(key : Text) : async Text {
    for (d in docStore.vals()) {
      if (d.key == key) return d.val;
    };
    "ERR: DOC[" # key # "] not found"
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — INTELLIGENCE QUERIES (QRY)
  // ══════════════════════════════════════════════════════════════════

  /// Submit an intelligence query.  The brain searches its doctrine and
  /// returns what it knows.  Public — any organism can ask.
  public func queryBrain(ask : Text, context : Text) : async QRY {
    let hits = searchDocs(if (context == "") ask else context);
    var ans = "";
    if (hits.size() == 0) {
      ans := "The brain has no doctrine on this topic yet. Store it with storeDoctrine().";
    } else {
      var i = 0;
      while (i < hits.size() and i < 3) {  // top 3 hits
        ans := ans # "[" # hits[i].key # "] " # hits[i].val # " | ";
        i += 1;
      };
    };
    let q : QRY = {
      id      = nextQry;
      ask     = ask;
      context = context;
      ans     = ans;
      docHits = hits.size();
      ts      = Time.now();
    };
    qryLog.add(q);
    nextQry += 1;
    while (qryLog.size() > MAX_QRY) { ignore qryLog.remove(0) };
    q
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — PUBLICATIONS (PUB)
  // ══════════════════════════════════════════════════════════════════

  /// Publish a signed document from the brain.  SOV-only.
  /// CEREBEX signs it with the SOV principal as the authority seal.
  public shared(msg) func publish(title : Text, body : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    if (pubLog.size() >= MAX_PUB) { return "ERR: PUB store full" };
    let p : PUB = {
      id    = nextPub;
      title = title;
      body  = body;
      sig   = sov;
      ts    = Time.now();
      hash  = fibHash(body);
    };
    pubLog.add(p);
    nextPub += 1;
    "PUB #" # Nat.toText(p.id) # " published | hash=" # Nat.toText(p.hash)
  };

  /// List publications.  Public query.
  public query func listPublications() : async [PUB] { Buffer.toArray(pubLog) };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION — DIAG
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async DIE { runDiag() };

  // ══════════════════════════════════════════════════════════════════
  //  HEARTBEAT — The Brain Keeps Thinking
  // ══════════════════════════════════════════════════════════════════

  system func heartbeat() : async () {
    hbtCount += 1;
    if (hbtCount % HBT_INTERVAL == 0) {
      let d = runDiag();
      diagLog.add(d);
      while (diagLog.size() > MAX_DIE) { ignore diagLog.remove(0) };
    };
  };

}
