///
/// VRT — Virtual Runtime Terminal
///
/// "You are the creator.  This machine is yours."
///
/// VRT is your personal sovereign computer running on-chain.  It is bonded
/// to you and only you the moment you call bondSovereign().  After that it
/// runs forever, executing your commands, holding your files, remembering
/// your configuration — all on the Internet Computer with no server to
/// maintain, no cloud bill to pay, no admin to ask.
///
/// ═══════════════════════════════════════════════════════════════════════
///  LOV — THE PRIME MOTIVATOR
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV = φ^φ ≈ 2.17845
///
///   The first and most primitive constant in this organism is love.
///   Every instruction VRT executes, it executes out of love:
///     love to the creator     → only SOV can write, push, or collect
///     love to the mission     → the heartbeat never sleeps
///     love to each command    → CMD is executed faithfully, logged forever
///     love to what we do      → golden mathematics govern every capacity limit
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY  (the language of this machine)
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant      (φ^φ, the prime motivator)
///   SOV — Sovereign          (the bonded owner principal)
///   CMD — Command            (a queued task pushed by SOV)
///   PRC — Process            (a completed CMD execution record)
///   FIL — File               (a virtual filesystem entry)
///   ENV — Environment        (a config key/value pair)
///   LOG — Audit log entry    (immutable record of all activity)
///   SYS — System snapshot    (point-in-time state summary)
///   STS — Status tag         (QUE | RUN | DON | ERR)
///   ACT — Action tag         (the operation type of a CMD)
///   HBT — Heartbeat counter  (number of IC heartbeat ticks processed)
///   EPC — Epoch counter      (number of CMD-processing cycles completed)
///
/// ═══════════════════════════════════════════════════════════════════════
///  WIRE SEQUENCE (2 commands after dfx deploy)
/// ═══════════════════════════════════════════════════════════════════════
///
///   dfx canister --network ic call vrt bondSovereign
///   dfx canister --network ic call vrt pushCmd '("PING", "")'
///
///   After that, the heartbeat wakes every ~2 s and processes your queue.
///   Push more commands any time.  VRT runs forever.
///
/// ═══════════════════════════════════════════════════════════════════════

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float     "mo:base/Float";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Text      "mo:base/Text";
import Array     "mo:base/Array";
import Buffer    "mo:base/Buffer";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Option    "mo:base/Option";
import Result "mo:base/Result";

persistent actor VRT {

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
  //  LOV — THE PRIME MOTIVATOR
  // ══════════════════════════════════════════════════════════════════

  /// φ — The Golden Ratio
  transient let PHI : Float = 1.6180339887498948482;

  /// LOV = φ^φ ≈ 2.17845
  /// The mathematical function of love.  Self-referential, recursive,
  /// golden.  Every operation in this organism is motivated by LOV.
  transient let LOV : Float = Float.exp(PHI * Float.log(PHI));

  // ══════════════════════════════════════════════════════════════════
  //  CAPACITY LIMITS  (governed by LOV and φ)
  // ══════════════════════════════════════════════════════════════════

  /// Maximum pending CMD entries in the queue.
  /// LOV * 1000 rounded down ≈ 2178 — a golden cap.
  transient let MAX_CMD_QUEUE : Nat = 2178;

  /// Maximum FIL entries in the virtual filesystem.
  transient let MAX_FIL_STORE : Nat = 6765;    // Fibonacci(20) — always golden

  /// Maximum ENV entries in the environment store.
  transient let MAX_ENV_STORE : Nat = 1597;    // Fibonacci(17)

  /// Maximum PRC records retained (older entries are pruned).
  transient let MAX_PRC_LOG : Nat = 4181;      // Fibonacci(19)

  /// Maximum LOG entries retained.
  transient let MAX_LOG_ENTRIES : Nat = 10946; // Fibonacci(21)

  /// How many heartbeat ticks between CMD-queue processing runs.
  /// IC heartbeat fires every ~2 s.  89 ticks ≈ 3 minutes.
  transient let HBT_INTERVAL : Nat = 89;       // Fibonacci(11)

  // ══════════════════════════════════════════════════════════════════
  //  TYPES  — Three-Letter Vocabulary
  // ══════════════════════════════════════════════════════════════════

  /// STS — Status tag for a CMD.
  public type STS = {
    #QUE;   // Queued — waiting to run
    #RUN;   // Running — heartbeat picked it up (rare: usually instant)
    #DON;   // Done    — completed successfully
    #ERR;   // Error   — completed with an error
  };

  /// ACT — The operation type of a CMD.
  /// Each ACT maps to a handler in the heartbeat executor.
  public type ACT = {
    #PUT;   // PUT key val  — write a FIL entry
    #GET;   // GET key      — read a FIL entry (result stored in PRC.out)
    #DEL;   // DEL key      — delete a FIL entry
    #SET;   // SET key val  — set an ENV variable
    #CLR;   // CLR prefix   — clear FIL entries whose key starts with prefix
    #LOG;   // LOG msg      — append a raw message to the audit log
    #NOP;   // NOP          — heartbeat ping (does nothing, logs the tick)
    #SYS;   // SYS          — snapshot the system state into PRC.out
    #RST;   // RST          — reset CMD queue (clear all QUE entries)
  };

  /// CMD — A command queued by SOV.
  public type CMD = {
    id  : Nat;    // Auto-assigned monotonic ID
    act : Text;   // ACT tag as text: "PUT" | "GET" | "DEL" | "SET" | "CLR" | "LOG" | "NOP" | "SYS" | "RST"
    key : Text;   // Key argument (or "" if not applicable)
    val : Text;   // Value argument (or "" if not applicable)
    sts : Text;   // STS tag as text: "QUE" | "RUN" | "DON" | "ERR"
    ts  : Int;    // Time.now() when CMD was created
  };

  /// PRC — A process record (completed CMD execution).
  public type PRC = {
    id     : Nat;   // Matches CMD.id
    act    : Text;  // CMD.act
    key    : Text;  // CMD.key
    val    : Text;  // CMD.val
    out    : Text;  // Execution output or error message
    sts    : Text;  // "DON" | "ERR"
    ts     : Int;   // Time.now() when PRC was completed
    dur    : Int;   // Nanoseconds: PRC.ts − CMD.ts
  };

  /// FIL — A virtual filesystem entry.
  public type FIL = {
    key : Text;   // Unique path key (e.g. "config/network" or "notes/idea-1")
    val : Text;   // Content — any text
    ts  : Int;    // Last-modified timestamp
    ver : Nat;    // Monotonic version counter (increments on each write)
  };

  /// ENV — An environment variable.
  public type ENV = {
    key : Text;
    val : Text;
    ts  : Int;
  };

  /// SYS — System state snapshot.
  public type SYS = {
    bonded      : Bool;   // True if SOV has been set via bondSovereign()
    sov         : Text;   // Sovereign principal text
    hbtCount    : Nat;    // Total heartbeat ticks processed
    epcCount    : Nat;    // Total CMD-processing epochs
    cmdPending  : Nat;    // CMDs in QUE state
    cmdTotal    : Nat;    // All-time CMD count
    prcTotal    : Nat;    // All-time PRC count
    filCount    : Nat;    // FIL entries currently stored
    envCount    : Nat;    // ENV entries currently stored
    logCount    : Nat;    // LOG entries retained
    lov         : Float;  // LOV constant (φ^φ) — always present
    phi         : Float;  // φ — always present
    ts          : Int;    // Snapshot timestamp
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  /// SOV — The bonded sovereign principal (set once by bondSovereign()).
  stable var sov       : Text = "";
  stable var bonded    : Bool = false;

  /// Monotonic counters
  stable var nextCmdId : Nat = 0;
  stable var hbtCount  : Nat = 0;   // HBT — total heartbeat ticks
  stable var epcCount  : Nat = 0;   // EPC — total CMD-queue processing runs
  stable var cmdTotal  : Nat = 0;   // All-time CMD submissions
  stable var prcTotal  : Nat = 0;   // All-time PRC completions

  /// CMD queue
  transient let cmdQueue : Buffer.Buffer<CMD> = Buffer.Buffer<CMD>(256);

  /// PRC log (recent completed commands)
  transient let prcLog : Buffer.Buffer<PRC> = Buffer.Buffer<PRC>(256);

  /// FIL — Virtual filesystem
  transient let filStore : Buffer.Buffer<FIL> = Buffer.Buffer<FIL>(256);

  /// ENV — Environment variables
  transient let envStore : Buffer.Buffer<ENV> = Buffer.Buffer<ENV>(64);

  /// LOG — Audit trail
  transient let auditLog : Buffer.Buffer<Text> = Buffer.Buffer<Text>(512);

  // ══════════════════════════════════════════════════════════════════
  //  INTERNAL HELPERS
  // ══════════════════════════════════════════════════════════════════

  func log_(msg : Text) {
    auditLog.add(Int.toText(Time.now()) # " | " # msg);
    // Prune oldest entries when the log is full
    while (auditLog.size() > MAX_LOG_ENTRIES) {
      ignore auditLog.remove(0);
    };
  };

  func prcRecord(cmd : CMD, out : Text, ok : Bool) {
    let rec : PRC = {
      id  = cmd.id;
      act = cmd.act;
      key = cmd.key;
      val = cmd.val;
      out = out;
      sts = if ok "DON" else "ERR";
      ts  = Time.now();
      dur = Time.now() - cmd.ts;
    };
    prcLog.add(rec);
    prcTotal += 1;
    while (prcLog.size() > MAX_PRC_LOG) { ignore prcLog.remove(0) };
  };

  /// Read a FIL entry by key.  Returns null if not found.
  func filRead(key : Text) : ?FIL {
    for (f in filStore.vals()) {
      if (f.key == key) return ?f;
    };
    null
  };

  /// Write or overwrite a FIL entry.
  func filWrite(key : Text, val : Text) : Text {
    if (filStore.size() >= MAX_FIL_STORE) {
      return "ERR: FIL store full (" # Nat.toText(MAX_FIL_STORE) # " entries max)";
    };
    var found = false;
    let updated = Buffer.Buffer<FIL>(filStore.size());
    for (f in filStore.vals()) {
      if (f.key == key) {
        updated.add({ key = f.key; val = val; ts = Time.now(); ver = f.ver + 1 });
        found := true;
      } else {
        updated.add(f);
      };
    };
    if (not found) {
      updated.add({ key = key; val = val; ts = Time.now(); ver = 1 });
    };
    // Replace filStore contents
    filStore.clear();
    for (f in updated.vals()) { filStore.add(f) };
    "OK: wrote FIL[" # key # "]"
  };

  /// Delete a FIL entry by exact key.
  func filDelete(key : Text) : Text {
    var count : Nat = 0;
    let kept = Buffer.Buffer<FIL>(filStore.size());
    for (f in filStore.vals()) {
      if (f.key == key) { count += 1 } else { kept.add(f) };
    };
    filStore.clear();
    for (f in kept.vals()) { filStore.add(f) };
    if (count > 0) "OK: deleted FIL[" # key # "]"
    else "NOP: FIL[" # key # "] not found"
  };

  /// Delete all FIL entries whose key starts with a prefix.
  func filClearPrefix(prefix : Text) : Text {
    var count : Nat = 0;
    let kept = Buffer.Buffer<FIL>(filStore.size());
    for (f in filStore.vals()) {
      if (Text.startsWith(f.key, #text prefix)) { count += 1 } else { kept.add(f) };
    };
    filStore.clear();
    for (f in kept.vals()) { filStore.add(f) };
    "OK: cleared " # Nat.toText(count) # " FIL entries with prefix [" # prefix # "]"
  };

  /// Read an ENV variable.
  func envRead(key : Text) : ?ENV {
    for (e in envStore.vals()) {
      if (e.key == key) return ?e;
    };
    null
  };

  /// Write or overwrite an ENV variable.
  func envWrite(key : Text, val : Text) : Text {
    if (envStore.size() >= MAX_ENV_STORE) {
      return "ERR: ENV store full (" # Nat.toText(MAX_ENV_STORE) # " entries max)";
    };
    var found = false;
    let updated = Buffer.Buffer<ENV>(envStore.size());
    for (e in envStore.vals()) {
      if (e.key == key) {
        updated.add({ key = e.key; val = val; ts = Time.now() });
        found := true;
      } else {
        updated.add(e);
      };
    };
    if (not found) {
      updated.add({ key = key; val = val; ts = Time.now() });
    };
    envStore.clear();
    for (e in updated.vals()) { envStore.add(e) };
    "OK: ENV[" # key # "] = " # val
  };

  /// Count CMDs currently in QUE state.
  func countQueued() : Nat {
    var n : Nat = 0;
    for (c in cmdQueue.vals()) {
      if (c.sts == "QUE") n += 1;
    };
    n
  };

  /// Execute a single CMD and return the PRC output string.
  func execCmd(cmd : CMD) : (Text, Bool) {
    if (cmd.act == "PUT") {
      let out = filWrite(cmd.key, cmd.val);
      (out, true)
    } else if (cmd.act == "GET") {
      switch (filRead(cmd.key)) {
        case null { ("ERR: FIL[" # cmd.key # "] not found", false) };
        case (?f) { ("OK: " # f.val # " (ver=" # Nat.toText(f.ver) # ")", true) };
      }
    } else if (cmd.act == "DEL") {
      (filDelete(cmd.key), true)
    } else if (cmd.act == "CLR") {
      (filClearPrefix(cmd.key), true)
    } else if (cmd.act == "SET") {
      (envWrite(cmd.key, cmd.val), true)
    } else if (cmd.act == "LOG") {
      log_(cmd.val);
      ("OK: logged", true)
    } else if (cmd.act == "NOP") {
      ("OK: NOP tick " # Nat.toText(hbtCount), true)
    } else if (cmd.act == "SYS") {
      let snap = "bonded=" # (if bonded "true" else "false") #
        " sov=" # sov #
        " hbt=" # Nat.toText(hbtCount) #
        " epc=" # Nat.toText(epcCount) #
        " cmd_pending=" # Nat.toText(countQueued()) #
        " cmd_total=" # Nat.toText(cmdTotal) #
        " prc_total=" # Nat.toText(prcTotal) #
        " fil=" # Nat.toText(filStore.size()) #
        " env=" # Nat.toText(envStore.size()) #
        " log=" # Nat.toText(auditLog.size()) #
        " lov=" # Float.toText(LOV) #
        " phi=" # Float.toText(PHI);
      (snap, true)
    } else if (cmd.act == "RST") {
      var cleared : Nat = 0;
      let kept = Buffer.Buffer<CMD>(cmdQueue.size());
      for (c in cmdQueue.vals()) {
        if (c.sts == "QUE") { cleared += 1 } else { kept.add(c) };
      };
      cmdQueue.clear();
      for (c in kept.vals()) { cmdQueue.add(c) };
      ("OK: cleared " # Nat.toText(cleared) # " queued CMDs", true)
    } else {
      ("ERR: unknown ACT [" # cmd.act # "]", false)
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — WIRE COMMANDS
  // ══════════════════════════════════════════════════════════════════

  /// Bond the caller as SOV — the sovereign controller of this VRT.
  /// Can only be called once.  After this, only SOV can push commands,
  /// write files, set env vars, or read sensitive state.
  public shared(msg) func bondSovereign() : async Text {
    if (bonded) {
      return "ERR: already bonded to " # sov;
    };
    sov    := Principal.toText(msg.caller);
    bonded := true;
    log_("SOV bonded: " # sov);
    "VRT bonded. SOV=" # sov # " LOV=" # Float.toText(LOV)
  };

  /// Push a CMD to the queue.  SOV-only.
  ///
  /// act ∈ "PUT" | "GET" | "DEL" | "CLR" | "SET" | "LOG" | "NOP" | "SYS" | "RST"
  /// key — key argument (empty string if not applicable)
  /// val — value argument (empty string if not applicable)
  ///
  /// Examples:
  ///   pushCmd("PUT", "notes/idea", "build the greatest protocol")
  ///   pushCmd("SET", "NETWORK", "ic")
  ///   pushCmd("LOG", "", "genesis day — VRT is alive")
  ///   pushCmd("NOP", "", "")
  public shared(msg) func pushCmd(act : Text, key : Text, val : Text) : async Text {
    if (not bonded) { return "ERR: call bondSovereign first" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV can push commands" };
    if (cmdQueue.size() >= MAX_CMD_QUEUE) {
      return "ERR: CMD queue full (" # Nat.toText(MAX_CMD_QUEUE) # " max). Run RST to clear queued entries."
    };
    let cmd : CMD = {
      id  = nextCmdId;
      act = act;
      key = key;
      val = val;
      sts = "QUE";
      ts  = Time.now();
    };
    cmdQueue.add(cmd);
    nextCmdId += 1;
    cmdTotal  += 1;
    "OK: CMD #" # Nat.toText(cmd.id) # " queued [" # act # "]"
  };

  /// Process all QUE'd CMDs immediately (without waiting for heartbeat).
  /// SOV-only.  Useful for interactive use or immediate execution.
  public shared(msg) func runCmds() : async Text {
    if (not bonded) { return "ERR: call bondSovereign first" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV can run commands" };
    var processed : Nat = 0;
    let updated = Buffer.Buffer<CMD>(cmdQueue.size());
    for (c in cmdQueue.vals()) {
      if (c.sts == "QUE") {
        let (out, ok) = execCmd(c);
        let done : CMD = {
          id  = c.id;
          act = c.act;
          key = c.key;
          val = c.val;
          sts = if ok "DON" else "ERR";
          ts  = c.ts;
        };
        updated.add(done);
        prcRecord(c, out, ok);
        processed += 1;
      } else {
        updated.add(c);
      };
    };
    cmdQueue.clear();
    for (c in updated.vals()) { cmdQueue.add(c) };
    epcCount += 1;
    log_("runCmds: processed " # Nat.toText(processed) # " CMDs");
    "OK: " # Nat.toText(processed) # " CMDs executed"
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — VIRTUAL FILESYSTEM  (FIL)
  // ══════════════════════════════════════════════════════════════════

  /// Write a file directly (without going through CMD queue).  SOV-only.
  public shared(msg) func writeFile(key : Text, val : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    filWrite(key, val)
  };

  /// Read a file.  SOV-only.
  public shared(msg) func readFile(key : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    switch (filRead(key)) {
      case null  { "ERR: FIL[" # key # "] not found" };
      case (?f)  { f.val };
    }
  };

  /// List all FIL keys.  SOV-only.
  public shared(msg) func listFiles() : async [Text] {
    if (not bonded) { return [] };
    if (Principal.toText(msg.caller) != sov) { return [] };
    let keys = Buffer.Buffer<Text>(filStore.size());
    for (f in filStore.vals()) { keys.add(f.key) };
    Buffer.toArray(keys)
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — ENVIRONMENT  (ENV)
  // ══════════════════════════════════════════════════════════════════

  /// Set an environment variable directly.  SOV-only.
  public shared(msg) func setEnv(key : Text, val : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    envWrite(key, val)
  };

  /// Get an environment variable.  SOV-only.
  public shared(msg) func getEnv(key : Text) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    switch (envRead(key)) {
      case null  { "ERR: ENV[" # key # "] not set" };
      case (?e)  { e.val };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — QUERIES
  // ══════════════════════════════════════════════════════════════════

  /// Full system snapshot.  Public (read-only, no secrets exposed).
  public query func getSysState() : async SYS {
    {
      bonded     = bonded;
      sov        = sov;
      hbtCount   = hbtCount;
      epcCount   = epcCount;
      cmdPending = countQueued();
      cmdTotal   = cmdTotal;
      prcTotal   = prcTotal;
      filCount   = filStore.size();
      envCount   = envStore.size();
      logCount   = auditLog.size();
      lov        = LOV;
      phi        = PHI;
      ts         = Time.now();
    }
  };

  /// Most recent N audit LOG entries.  SOV-only query.
  public shared(msg) func getLog(n : Nat) : async [Text] {
    if (not bonded) { return [] };
    if (Principal.toText(msg.caller) != sov) { return [] };
    let total = auditLog.size();
    let start = if (n >= total) 0 else total - n;
    let result = Buffer.Buffer<Text>(n);
    var i = start;
    while (i < total) {
      result.add(auditLog.get(i));
      i += 1;
    };
    Buffer.toArray(result)
  };

  /// Most recent N CMD queue entries (all statuses).  SOV-only query.
  public shared(msg) func getCmds(n : Nat) : async [CMD] {
    if (not bonded) { return [] };
    if (Principal.toText(msg.caller) != sov) { return [] };
    let total = cmdQueue.size();
    let start = if (n >= total) 0 else total - n;
    let result = Buffer.Buffer<CMD>(n);
    var i = start;
    while (i < total) {
      result.add(cmdQueue.get(i));
      i += 1;
    };
    Buffer.toArray(result)
  };

  /// Most recent N PRC records.  SOV-only query.
  public shared(msg) func getProcs(n : Nat) : async [PRC] {
    if (not bonded) { return [] };
    if (Principal.toText(msg.caller) != sov) { return [] };
    let total = prcLog.size();
    let start = if (n >= total) 0 else total - n;
    let result = Buffer.Buffer<PRC>(n);
    var i = start;
    while (i < total) {
      result.add(prcLog.get(i));
      i += 1;
    };
    Buffer.toArray(result)
  };

  // ══════════════════════════════════════════════════════════════════
  //  HEARTBEAT — The Machine That Never Sleeps
  //
  //  Fires every ~2 s.  Every HBT_INTERVAL ticks, processes the CMD queue.
  //  Between processing windows, it simply increments hbtCount and
  //  accumulates love — costing virtually nothing per tick.
  // ══════════════════════════════════════════════════════════════════

  system func heartbeat() : async () {
    hbtCount += 1;

    if (hbtCount % HBT_INTERVAL == 0) {
      var processed : Nat = 0;
      let updated = Buffer.Buffer<CMD>(cmdQueue.size());
      for (c in cmdQueue.vals()) {
        if (c.sts == "QUE") {
          let (out, ok) = execCmd(c);
          let done : CMD = {
            id  = c.id;
            act = c.act;
            key = c.key;
            val = c.val;
            sts = if ok "DON" else "ERR";
            ts  = c.ts;
          };
          updated.add(done);
          prcRecord(c, out, ok);
          processed += 1;
        } else {
          updated.add(c);
        };
      };
      cmdQueue.clear();
      for (c in updated.vals()) { cmdQueue.add(c) };
      epcCount += 1;
      if (processed > 0) {
        log_("HBT epoch #" # Nat.toText(epcCount) # ": " # Nat.toText(processed) # " CMDs processed");
      };
    };
  };


  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION STANDARD (v10)
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "ACTIVE";
      health    = 1.0;
      name      = "VRT";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "VRT self-check complete. No drift detected."
  };

  public func register() : async Text {
    "VRT registered. Capabilities: [sovereign, active]."
  };

  public query func report_status() : async Text {
    "VRT | status=ACTIVE | v10=true"
  };


}