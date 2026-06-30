///
/// CHRONEX — The Time Anchor
///
/// "Time is the substrate of action.  The epoch is the breath of the machine.
///  Without a time anchor, there is no sequencing.  Without sequencing, there is no plan."
///
/// CHRONEX is the sovereign time anchor of NOVA v10.  It manages epochs —
/// the discrete breathing cycles of the protocol economy.  Every major protocol
/// action happens inside an epoch.  CHRONEX tracks them, schedules them,
/// and freezes state snapshots so nothing is ever lost between breaths.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — SILVER TIER (ARGENTVOX)
/// ═══════════════════════════════════════════════════════════════════════
///
///   Tier: ARGENTVOX (Silver)
///   Role: Time Anchor — epoch scheduling, state snapshots, task queue
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ)
///   EPO — Epoch record (one complete breath of the protocol)
///   SNP — Snapshot record (frozen state at a point in time)
///   TSK — Scheduled task record
///   TIC — Tick counter (nanoseconds since genesis)
///   PHZ — Phase of current epoch (OPEN → ACTIVE → CLOSE → SEALED)
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

persistent actor CHRONEX {

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

  /// Default epoch duration: ~24 hours in nanoseconds
  transient let DEFAULT_EPOCH_NS : Int = 86_400_000_000_000;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type EpochPhase = {
    #Open;      // Epoch accepting tasks
    #Active;    // Epoch executing
    #Closing;   // Epoch winding down
    #Sealed;    // Epoch complete and frozen
  };

  /// An epoch — one complete protocol breath.
  public type EPO = {
    id         : Nat;
    startTime  : Int;
    endTime    : ?Int;
    phase      : EpochPhase;
    taskCount  : Nat;
    snapshots  : Nat;
    goldenSeed : Float;  // φ^id — unique epoch fingerprint
    notes      : Text;
  };

  /// A frozen state snapshot.
  public type SNP = {
    id        : Nat;
    epochId   : Nat;
    name      : Text;
    data      : Text;       // Serialized state blob
    hash      : Text;       // Simple hash for integrity
    timestamp : Int;
  };

  /// A scheduled task.
  public type TSK = {
    id          : Nat;
    epochId     : Nat;
    task        : Text;     // Task description
    scheduledAt : Int;      // When it was scheduled
    runAfter    : Int;      // Earliest execution time (ns)
    executed    : Bool;
    result      : ?Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var nextEpochId   : Nat = 0;
  stable var nextSnapshotId : Nat = 0;
  stable var nextTaskId    : Nat = 0;
  stable var currentEpoch  : ?Nat = null;
  stable var genesisTime   : Int = 0;
  stable var initialized   : Bool = false;

  transient let epochs    = Buffer.Buffer<EPO>(256);
  transient let snapshots = Buffer.Buffer<SNP>(512);
  transient let tasks     = Buffer.Buffer<TSK>(256);
  transient let tickLog   = Buffer.Buffer<Text>(512);

  transient let MAX_EPOCHS    : Nat = 10000;
  transient let MAX_SNAPSHOTS : Nat = 50000;

  // ══════════════════════════════════════════════════════════════════
  //  INIT
  // ══════════════════════════════════════════════════════════════════

  public func claimChronex() : async Text {
    if (initialized) { return "CHRONEX already claimed." };
    initialized := true;
    genesisTime := Time.now();
    // Open epoch zero — the genesis epoch
    ignore await startEpoch("Genesis epoch — NOVA v10 time anchor online.");
    "CHRONEX online. Time anchored at genesis. Epoch 0 is open."
  };

  // ══════════════════════════════════════════════════════════════════
  //  EPOCH MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// Open a new epoch.  Only one epoch can be active at a time.
  public func startEpoch(notes : Text) : async EPO {
    // Seal any currently open epoch first
    switch (currentEpoch) {
      case (?id) { ignore await endEpoch(id) };
      case null  {};
    };

    let id = nextEpochId;
    nextEpochId += 1;
    currentEpoch := ?id;

    let epoch : EPO = {
      id;
      startTime  = Time.now();
      endTime    = null;
      phase      = #Open;
      taskCount  = 0;
      snapshots  = 0;
      goldenSeed = Float.pow(PHI, Float.fromInt(id));
      notes;
    };

    epochs.add(epoch);
    tickLog.add("EPO#" # Nat.toText(id) # " OPENED at " # Int.toText(epoch.startTime));
    epoch
  };

  /// Close and seal an epoch.
  public func endEpoch(epochId : Nat) : async ?EPO {
    for (i in Iter.range(0, epochs.size() - 1)) {
      let e = epochs.get(i);
      if (e.id == epochId) {
        let sealed : EPO = {
          id         = e.id;
          startTime  = e.startTime;
          endTime    = ?Time.now();
          phase      = #Sealed;
          taskCount  = e.taskCount;
          snapshots  = e.snapshots;
          goldenSeed = e.goldenSeed;
          notes      = e.notes;
        };
        epochs.put(i, sealed);
        if (currentEpoch == ?epochId) { currentEpoch := null };
        tickLog.add("EPO#" # Nat.toText(epochId) # " SEALED");
        return ?sealed;
      };
    };
    null
  };

  /// Get the current open epoch.
  public query func currentEpochInfo() : async ?EPO {
    switch (currentEpoch) {
      case null    { null };
      case (?id)  {
        for (e in epochs.vals()) {
          if (e.id == id) { return ?e };
        };
        null
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  SNAPSHOT MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// Freeze a state snapshot.  Data can be any serialized text.
  public func snapshot(name : Text, data : Text, epochId : Nat) : async SNP {
    let id = nextSnapshotId;
    nextSnapshotId += 1;

    let hash = _simpleHash(data);

    let snp : SNP = {
      id;
      epochId;
      name;
      data;
      hash;
      timestamp = Time.now();
    };

    snapshots.add(snp);

    // Update epoch snapshot count
    for (i in Iter.range(0, epochs.size() - 1)) {
      let e = epochs.get(i);
      if (e.id == epochId) {
        epochs.put(i, {
          id         = e.id;
          startTime  = e.startTime;
          endTime    = e.endTime;
          phase      = e.phase;
          taskCount  = e.taskCount;
          snapshots  = e.snapshots + 1;
          goldenSeed = e.goldenSeed;
          notes      = e.notes;
        });
      };
    };

    tickLog.add("SNP#" # Nat.toText(id) # " '" # name # "' frozen in EPO#" # Nat.toText(epochId));

    if (snapshots.size() > MAX_SNAPSHOTS) { ignore snapshots.remove(0) };
    snp
  };

  public query func getSnapshot(id : Nat) : async ?SNP {
    for (snp in snapshots.vals()) {
      if (snp.id == id) { return ?snp };
    };
    null
  };

  public query func listSnapshots(epochId : Nat) : async [SNP] {
    let buf = Buffer.Buffer<SNP>(32);
    for (snp in snapshots.vals()) {
      if (snp.epochId == epochId) { buf.add(snp) };
    };
    Buffer.toArray(buf)
  };

  // ══════════════════════════════════════════════════════════════════
  //  TASK SCHEDULING
  // ══════════════════════════════════════════════════════════════════

  /// Schedule a task to run after a delay (seconds from now).
  public func schedule(
    task        : Text,
    epochId     : Nat,
    afterSeconds : Nat
  ) : async TSK {
    let id = nextTaskId;
    nextTaskId += 1;
    let now = Time.now();

    let tsk : TSK = {
      id;
      epochId;
      task;
      scheduledAt = now;
      runAfter    = now + Int.abs(afterSeconds) * 1_000_000_000;
      executed    = false;
      result      = null;
    };

    tasks.add(tsk);

    // Update epoch task count
    for (i in Iter.range(0, epochs.size() - 1)) {
      let e = epochs.get(i);
      if (e.id == epochId) {
        epochs.put(i, {
          id         = e.id;
          startTime  = e.startTime;
          endTime    = e.endTime;
          phase      = e.phase;
          taskCount  = e.taskCount + 1;
          snapshots  = e.snapshots;
          goldenSeed = e.goldenSeed;
          notes      = e.notes;
        });
      };
    };

    tickLog.add("TSK#" # Nat.toText(id) # " scheduled: '" # task #
                "' runAfter=" # Int.toText(tsk.runAfter));
    tsk
  };

  /// Get all tasks ready to execute (runAfter <= now).
  public query func readyTasks() : async [TSK] {
    let now = Time.now();
    let buf = Buffer.Buffer<TSK>(16);
    for (tsk in tasks.vals()) {
      if (not tsk.executed and tsk.runAfter <= now) {
        buf.add(tsk);
      };
    };
    Buffer.toArray(buf)
  };

  /// Mark a task as executed.
  public func markExecuted(taskId : Nat, result : Text) : async Bool {
    for (i in Iter.range(0, tasks.size() - 1)) {
      let tsk = tasks.get(i);
      if (tsk.id == taskId) {
        tasks.put(i, {
          id          = tsk.id;
          epochId     = tsk.epochId;
          task        = tsk.task;
          scheduledAt = tsk.scheduledAt;
          runAfter    = tsk.runAfter;
          executed    = true;
          result      = ?result;
        });
        return true;
      };
    };
    false
  };

  // ══════════════════════════════════════════════════════════════════
  //  TIME UTILITIES
  // ══════════════════════════════════════════════════════════════════

  public query func now() : async Int { Time.now() };

  public query func genesisAge() : async Int {
    Time.now() - genesisTime
  };

  public query func epochCount() : async Nat { epochs.size() };

  public query func listEpochs() : async [EPO] {
    Buffer.toArray(epochs)
  };

  public query func getEpoch(id : Nat) : async ?EPO {
    for (e in epochs.vals()) {
      if (e.id == id) { return ?e };
    };
    null
  };

  public query func getTickLog() : async [Text] {
    Buffer.toArray(tickLog)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION STANDARD (v10)
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async {
    status      : Text;
    health      : Float;
    epochs      : Nat;
    snapshots   : Nat;
    tasks       : Nat;
    currentEpoch : ?Nat;
    lov         : Float;
    timestamp   : Int;
  } {
    var pendingTasks : Nat = 0;
    for (t in tasks.vals()) {
      if (not t.executed) { pendingTasks += 1 };
    };
    let health = if (epochs.size() == 0) 0.5
                 else if (pendingTasks < 10) 1.0
                 else 1.0 / Float.fromInt(pendingTasks);
    {
      status       = if (initialized) "ANCHORED" else "UNINITIALIZED";
      health;
      epochs       = epochs.size();
      snapshots    = snapshots.size();
      tasks        = tasks.size();
      currentEpoch;
      lov          = LOV;
      timestamp    = Time.now();
    }
  };

  public func heal() : async Text {
    // Mark overdue tasks as failed
    let now = Time.now();
    var healed : Nat = 0;
    let overdue : Int = 7 * DEFAULT_EPOCH_NS;  // 7 days
    for (i in Iter.range(0, tasks.size() - 1)) {
      let tsk = tasks.get(i);
      if (not tsk.executed and (now - tsk.runAfter) > overdue) {
        tasks.put(i, {
          id          = tsk.id;
          epochId     = tsk.epochId;
          task        = tsk.task;
          scheduledAt = tsk.scheduledAt;
          runAfter    = tsk.runAfter;
          executed    = true;
          result      = ?"EXPIRED — auto-healed by CHRONEX";
        });
        healed += 1;
      };
    };
    "CHRONEX heal: " # Nat.toText(healed) # " expired task(s) cleared."
  };

  public func register() : async Text {
    "CHRONEX registered. Capabilities: [time, epoch, schedule, snapshot]."
  };

  public query func report_status() : async Text {
    "CHRONEX | epochs=" # Nat.toText(epochs.size()) #
    " snapshots=" # Nat.toText(snapshots.size()) #
    " tasks=" # Nat.toText(tasks.size()) #
    " currentEpoch=" # (switch (currentEpoch) { case null "none"; case (?id) Nat.toText(id) }) #
    " LOV=" # Float.toText(LOV)
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func _simpleHash(data : Text) : Text {
    // FNV-1a inspired — deterministic, fast
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

  public query func name() : async Text { "CHRONEX" };

  public query func designation() : async Text {
    "ARGENTVOX — The Time Anchor — The epoch is the breath of the machine"
  };

  public query func lov() : async Float { LOV };
};

