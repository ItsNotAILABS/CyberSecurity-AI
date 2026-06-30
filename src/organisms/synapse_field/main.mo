///
/// SYNAPSE FIELD — Layer 4 of the PULSE Runtime
///
/// "The Synapse Field is the organism's worker pool.
///  Every pulse that runs passes through a synapse."
///
/// Synapse Field is the official worker pool for the PULSE Runtime.
/// It is the native equivalent of Go's goroutine pool — but organism-aware.
///
/// Native equivalent: Go worker pool, but doctrine-aware.
///
/// Unlike a raw goroutine pool, Synapse Field:
///   - Assigns workers by capability and current load
///   - Tracks per-worker pulse execution history and proof records
///   - Enforces concurrency caps per organ and per worker
///   - Detects backpressure when queue overflows
///   - Rebalances automatically when workers go idle
///   - Reports liveness (heartbeat-based worker health)
///
/// Architecture:
///   Worker (Synaptic Thread) — a registered execution slot
///   FieldSlot               — one active assignment
///   WorkerLoad              — current utilization per worker
///   FieldStats              — aggregate pool observability
///
/// Integration:
///   → Pulse Scheduler (pulse_scheduler) sends DispatchPlan
///   → Synapse Field assigns each slot to the best available worker
///   → Workers execute pulse tasks (in the real runtime, inter-canister)
///   → Workers call completePulseAssignment() when done
///   → Synapse Field updates load counters and frees the slot
///
/// The Synapse Field does not execute pulse logic itself.
/// It manages which worker slot handles each assigned pulse.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Array     "mo:base/Array";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Option    "mo:base/Option";
import Principal "mo:base/Principal";
import Result    "mo:base/Result";
import Text      "mo:base/Text";
import Time      "mo:base/Time";

persistent actor SynapseField {

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
  //  STABLE STORAGE
  // ══════════════════════════════════════════════════════════════════

  var workers        : [Worker]          = [];
  var activeSlots    : [FieldSlot]       = [];
  var slotHistory    : [FieldSlot]       = [];
  var fieldConfig    : FieldConfig       = {
    defaultTimeoutNs    = 3_600_000_000_000;
    maxTotalSlots       = 200;
    organCaps           = [];
    rebalanceIntervalNs = 300_000_000_000;
    livenessTtlNs       = 1_800_000_000_000;
    fieldVersion        = 1;
  };
  var idCounter      : Nat              = 0;
  var schemaVersion  : Nat              = 1;

  // ══════════════════════════════════════════════════════════════════
  //  ENUM TYPES
  // ══════════════════════════════════════════════════════════════════

  public type WorkerStatus = {
    #Idle;
    #Active;
    #Overloaded;
    #Draining;    // finishing current work, no new assignments
    #Offline;
  };

  public type SlotStatus = {
    #Assigned;
    #Running;
    #Completed;
    #Failed;
    #TimedOut;
    #Cancelled;
  };

  public type OrganCapType = {
    #PerWorker;   // each worker can run this many concurrent pulses to this organ
    #FieldTotal;  // across all workers, max total concurrent pulses to this organ
  };

  // ══════════════════════════════════════════════════════════════════
  //  CORE DATA TYPES
  // ══════════════════════════════════════════════════════════════════

  /// Worker — a Synaptic Thread registration
  ///
  /// A worker is a named execution slot that can accept pulse assignments.
  /// In a real multi-canister deployment, each worker maps to a canister.
  /// In single-canister mode, workers are logical concurrency lanes.
  public type Worker = {
    id              : Text;
    workerLabel     : Text;
    capabilities    : [Text];           // organ names this worker can serve
    maxConcurrent   : Nat;             // max simultaneous pulse slots
    status          : WorkerStatus;
    activeSlots     : Nat;             // current active assignments
    totalCompleted  : Nat;
    totalFailed     : Nat;
    lastHeartbeatAt : Int;
    registeredAt    : Int;
    registeredBy    : ?Principal;
    drainAt         : ?Int;            // if draining, when it started
  };

  /// FieldSlot — one active or historical pulse assignment
  public type FieldSlot = {
    id              : Text;
    workerId        : Text;
    pulseTaskId     : Text;
    pulseType       : Text;
    targetOrgan     : Text;
    epochId         : Nat;
    schedulerSlotId : Text;            // from DispatchPlan
    status          : SlotStatus;
    priority        : Text;            // inherited from pulse task
    assignedAt      : Int;
    startedAt       : ?Int;
    completedAt     : ?Int;
    proofId         : ?Text;
    failReason      : ?Text;
    timeoutAt       : ?Int;
  };

  /// OrganCap — concurrency ceiling for a specific organ
  public type OrganCap = {
    organ        : Text;
    maxConcurrent: Nat;
    capType      : OrganCapType;
  };

  /// FieldConfig — pool-wide tunable parameters
  public type FieldConfig = {
    defaultTimeoutNs    : Nat;          // nanoseconds before a slot is timed out
    maxTotalSlots       : Nat;          // hard cap on concurrent active slots across all workers
    organCaps           : [OrganCap];   // per-organ concurrency limits
    rebalanceIntervalNs : Nat;          // how often to check for idle/overloaded workers
    livenessTtlNs       : Nat;          // nanoseconds of silence before worker marked offline
    fieldVersion        : Nat;
  };

  /// AssignmentRequest — caller asks field to assign a pulse to a worker
  public type AssignmentRequest = {
    pulseTaskId     : Text;
    pulseType       : Text;
    targetOrgan     : Text;
    epochId         : Nat;
    schedulerSlotId : Text;
    priority        : Text;
    timeoutNs       : ?Nat;
  };

  /// AssignmentResult — returned after assignment
  public type AssignmentResult = {
    slotId    : Text;
    workerId  : Text;
    assignedAt: Int;
  };

  /// WorkerLoad — snapshot of a worker's current utilisation
  public type WorkerLoad = {
    workerId      : Text;
    workerLabel   : Text;
    status        : WorkerStatus;
    activeSlots   : Nat;
    maxConcurrent : Nat;
    utilization   : Nat;              // 0–100 percent
    capabilities  : [Text];
  };

  /// FieldStats — aggregate pool observability
  public type FieldStats = {
    totalWorkers      : Nat;
    idleWorkers       : Nat;
    activeWorkers     : Nat;
    overloadedWorkers : Nat;
    offlineWorkers    : Nat;
    drainingWorkers   : Nat;
    totalActiveSlots  : Nat;
    totalHistorySlots : Nat;
    completedSlots    : Nat;
    failedSlots       : Nat;
    timedOutSlots     : Nat;
    fieldUtilization  : Nat;          // 0–100 percent of maxTotalSlots
    backpressure      : Bool;         // true if at or above maxTotalSlots
    fieldVersion      : Nat;
    schemaVersion     : Nat;
  };

  /// WorkerInput for registration
  public type WorkerInput = {
    workerLabel   : Text;
    capabilities  : [Text];
    maxConcurrent : Nat;
  };

  // ══════════════════════════════════════════════════════════════════
  //  DEFAULTS
  // ══════════════════════════════════════════════════════════════════

  func nextId(prefix : Text) : Text {
    idCounter += 1;
    prefix # "-" # Int.toText(Time.now()) # "-" # Nat.toText(idCounter)
  };

  func findWorker(id : Text) : ?Worker {
    Array.find<Worker>(workers, func(w) { w.id == id })
  };

  func findSlot(id : Text) : ?FieldSlot {
    Array.find<FieldSlot>(activeSlots, func(s) { s.id == id })
  };

  /// Count active slots for a specific organ across the whole field
  func activeCountForOrgan(organ : Text) : Nat {
    Array.filter<FieldSlot>(activeSlots, func(s) {
      s.targetOrgan == organ and (s.status == #Assigned or s.status == #Running)
    }).size()
  };

  /// Count active slots for a specific worker
  func activeCountForWorker(workerId : Text) : Nat {
    Array.filter<FieldSlot>(activeSlots, func(s) {
      s.workerId == workerId and (s.status == #Assigned or s.status == #Running)
    }).size()
  };

  /// Check organ-level concurrency cap
  func organCapOk(organ : Text) : Bool {
    let current = activeCountForOrgan(organ);
    let cap = Array.find<OrganCap>(fieldConfig.organCaps, func(c) {
      c.organ == organ and c.capType == #FieldTotal
    });
    switch (cap) {
      case null true;                                  // no cap = unlimited
      case (?c) current < c.maxConcurrent;
    }
  };

  /// Select best available worker for a given organ (least-loaded capable worker)
  func selectWorker(organ : Text) : ?Worker {
    let capable = Array.filter<Worker>(workers, func(w) {
      w.status != #Offline and w.status != #Draining
      and w.activeSlots < w.maxConcurrent
      and (
        // worker has this organ in capabilities, OR empty capabilities = general purpose
        w.capabilities.size() == 0
        or Option.isSome(Array.find<Text>(w.capabilities, func(c) { c == organ }))
      )
    });
    if (capable.size() == 0) return null;

    // Pick worker with lowest utilization (activeSlots / maxConcurrent ratio)
    var best : ?Worker = null;
    var bestUtil : Nat = 101;
    for (w in capable.vals()) {
      let util = if (w.maxConcurrent == 0) 100
                 else (w.activeSlots * 100) / w.maxConcurrent;
      if (util < bestUtil) {
        bestUtil := util;
        best := ?w;
      };
    };
    best
  };

  // ══════════════════════════════════════════════════════════════════
  //  WORKER MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// registerWorker — add a Synaptic Thread to the field
  public shared(msg) func registerWorker(input : WorkerInput) : async Result.Result<Text, Text> {
    if (Text.size(input.workerLabel) == 0) return #err("workerLabel required");
    if (input.maxConcurrent == 0)          return #err("maxConcurrent must be >= 1");

    let id = nextId("worker");
    let w : Worker = {
      id              = id;
      workerLabel     = input.workerLabel;
      capabilities    = input.capabilities;
      maxConcurrent   = input.maxConcurrent;
      status          = #Idle;
      activeSlots     = 0;
      totalCompleted  = 0;
      totalFailed     = 0;
      lastHeartbeatAt = Time.now();
      registeredAt    = Time.now();
      registeredBy    = ?msg.caller;
      drainAt         = null;
    };
    workers := Array.append(workers, [w]);
    #ok(id)
  };

  /// workerHeartbeat — worker signals it is alive
  public shared func workerHeartbeat(workerId : Text) : async Result.Result<(), Text> {
    var found = false;
    workers := Array.map<Worker, Worker>(workers, func(w) {
      if (w.id == workerId) {
        found := true;
        {
          id = w.id; workerLabel = w.workerLabel; capabilities = w.capabilities;
          maxConcurrent = w.maxConcurrent;
          status = if (w.status == #Offline) #Idle else w.status;
          activeSlots = w.activeSlots; totalCompleted = w.totalCompleted;
          totalFailed = w.totalFailed; lastHeartbeatAt = Time.now();
          registeredAt = w.registeredAt; registeredBy = w.registeredBy;
          drainAt = w.drainAt;
        }
      } else { w }
    });
    if (not found) return #err("workerId not found");
    #ok(())
  };

  /// drainWorker — stop sending new work, finish existing slots
  public shared func drainWorker(workerId : Text) : async Result.Result<(), Text> {
    var found = false;
    workers := Array.map<Worker, Worker>(workers, func(w) {
      if (w.id == workerId and w.status != #Offline) {
        found := true;
        { id = w.id; workerLabel = w.workerLabel; capabilities = w.capabilities;
          maxConcurrent = w.maxConcurrent; status = #Draining;
          activeSlots = w.activeSlots; totalCompleted = w.totalCompleted;
          totalFailed = w.totalFailed; lastHeartbeatAt = w.lastHeartbeatAt;
          registeredAt = w.registeredAt; registeredBy = w.registeredBy;
          drainAt = ?Time.now() }
      } else { w }
    });
    if (not found) return #err("workerId not found or offline");
    #ok(())
  };

  /// deregisterWorker — mark offline permanently
  public shared func deregisterWorker(workerId : Text) : async Result.Result<(), Text> {
    var found = false;
    workers := Array.map<Worker, Worker>(workers, func(w) {
      if (w.id == workerId) {
        found := true;
        { id = w.id; workerLabel = w.workerLabel; capabilities = w.capabilities;
          maxConcurrent = w.maxConcurrent; status = #Offline;
          activeSlots = 0; totalCompleted = w.totalCompleted;
          totalFailed = w.totalFailed; lastHeartbeatAt = w.lastHeartbeatAt;
          registeredAt = w.registeredAt; registeredBy = w.registeredBy;
          drainAt = w.drainAt }
      } else { w }
    });
    if (not found) return #err("workerId not found");
    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  SLOT ASSIGNMENT — Core Worker Pool Logic
  // ══════════════════════════════════════════════════════════════════

  /// assignPulse — assign a pulse task to the best available worker
  ///
  /// This is the core worker pool operation.
  /// Native equivalent of: pick a goroutine from the pool, send it work.
  public shared func assignPulse(req : AssignmentRequest) : async Result.Result<AssignmentResult, Text> {
    // Backpressure check
    if (activeSlots.size() >= fieldConfig.maxTotalSlots) {
      return #err("BACKPRESSURE: field at capacity (" # Nat.toText(fieldConfig.maxTotalSlots) # " active slots)");
    };

    // Organ-level cap check
    if (not organCapOk(req.targetOrgan)) {
      return #err("ORGAN_CAP: organ " # req.targetOrgan # " at concurrency limit");
    };

    // Select worker
    let selectedWorker = selectWorker(req.targetOrgan);
    switch (selectedWorker) {
      case null {
        return #err("NO_WORKER: no available worker for organ " # req.targetOrgan);
      };
      case (?w) {
        let slotId = nextId("slot");
        let timeoutNs = Option.get(req.timeoutNs, fieldConfig.defaultTimeoutNs);
        let now = Time.now();

        let slot : FieldSlot = {
          id              = slotId;
          workerId        = w.id;
          pulseTaskId     = req.pulseTaskId;
          pulseType       = req.pulseType;
          targetOrgan     = req.targetOrgan;
          epochId         = req.epochId;
          schedulerSlotId = req.schedulerSlotId;
          status          = #Assigned;
          priority        = req.priority;
          assignedAt      = now;
          startedAt       = null;
          completedAt     = null;
          proofId         = null;
          failReason      = null;
          timeoutAt       = ?(now + timeoutNs);
        };
        activeSlots := Array.append(activeSlots, [slot]);

        // Update worker activeSlots count and status
        workers := Array.map<Worker, Worker>(workers, func(wk) {
          if (wk.id == w.id) {
            let newActive = wk.activeSlots + 1;
            let newStatus : WorkerStatus = if (newActive >= wk.maxConcurrent) #Overloaded else #Active;
            { id = wk.id; workerLabel = wk.workerLabel; capabilities = wk.capabilities;
              maxConcurrent = wk.maxConcurrent; status = newStatus;
              activeSlots = newActive; totalCompleted = wk.totalCompleted;
              totalFailed = wk.totalFailed; lastHeartbeatAt = wk.lastHeartbeatAt;
              registeredAt = wk.registeredAt; registeredBy = wk.registeredBy;
              drainAt = wk.drainAt }
          } else { wk }
        });

        #ok({
          slotId     = slotId;
          workerId   = w.id;
          assignedAt = now;
        })
      };
    }
  };

  /// startPulseSlot — worker signals it has begun executing the pulse
  public shared func startPulseSlot(slotId : Text) : async Result.Result<(), Text> {
    var found = false;
    activeSlots := Array.map<FieldSlot, FieldSlot>(activeSlots, func(s) {
      if (s.id == slotId and s.status == #Assigned) {
        found := true;
        { id = s.id; workerId = s.workerId; pulseTaskId = s.pulseTaskId;
          pulseType = s.pulseType; targetOrgan = s.targetOrgan;
          epochId = s.epochId; schedulerSlotId = s.schedulerSlotId;
          status = #Running; priority = s.priority;
          assignedAt = s.assignedAt; startedAt = ?Time.now();
          completedAt = null; proofId = null; failReason = null;
          timeoutAt = s.timeoutAt }
      } else { s }
    });
    if (not found) return #err("slotId not found or not in Assigned state");
    #ok(())
  };

  /// completePulseAssignment — worker reports success
  public shared func completePulseAssignment(
    slotId  : Text,
    proofId : ?Text,
  ) : async Result.Result<(), Text> {
    await _finishSlot(slotId, #Completed, proofId, null)
  };

  /// failPulseAssignment — worker reports failure
  public shared func failPulseAssignment(
    slotId    : Text,
    failReason: Text,
  ) : async Result.Result<(), Text> {
    await _finishSlot(slotId, #Failed, null, ?failReason)
  };

  /// cancelPulseAssignment — cancel before worker started
  public shared func cancelPulseAssignment(slotId : Text) : async Result.Result<(), Text> {
    await _finishSlot(slotId, #Cancelled, null, ?"Cancelled by operator")
  };

  /// Internal: move slot to terminal state, update worker counts
  func _finishSlot(
    slotId    : Text,
    terminal  : SlotStatus,
    proofId   : ?Text,
    failReason: ?Text,
  ) : async Result.Result<(), Text> {
    var found = false;
    var workerIdToUpdate : ?Text = null;
    var wasSuccess = terminal == #Completed;

    activeSlots := Array.map<FieldSlot, FieldSlot>(activeSlots, func(s) {
      if (s.id == slotId and (s.status == #Assigned or s.status == #Running)) {
        found := true;
        workerIdToUpdate := ?s.workerId;
        { id = s.id; workerId = s.workerId; pulseTaskId = s.pulseTaskId;
          pulseType = s.pulseType; targetOrgan = s.targetOrgan;
          epochId = s.epochId; schedulerSlotId = s.schedulerSlotId;
          status = terminal; priority = s.priority;
          assignedAt = s.assignedAt; startedAt = s.startedAt;
          completedAt = ?Time.now(); proofId = proofId;
          failReason = failReason; timeoutAt = s.timeoutAt }
      } else { s }
    });

    if (not found) return #err("slotId not found or already in terminal state");

    // Move to history
    let finished = Array.filter<FieldSlot>(activeSlots, func(s) { s.id == slotId });
    slotHistory  := Array.append(slotHistory, finished);
    activeSlots  := Array.filter<FieldSlot>(activeSlots, func(s) { s.id != slotId });

    // Update worker
    switch (workerIdToUpdate) {
      case null {};
      case (?wid) {
        workers := Array.map<Worker, Worker>(workers, func(wk) {
          if (wk.id == wid) {
            let newActive = if (wk.activeSlots > 0) wk.activeSlots - 1 else 0;
            let newStatus : WorkerStatus = if (wk.status == #Draining) #Draining
              else if (newActive == 0) #Idle
              else if (newActive >= wk.maxConcurrent) #Overloaded
              else #Active;
            let newCompleted = if (wasSuccess) wk.totalCompleted + 1 else wk.totalCompleted;
            let newFailed    = if (not wasSuccess and terminal != #Cancelled) wk.totalFailed + 1
                               else wk.totalFailed;
            { id = wk.id; workerLabel = wk.workerLabel; capabilities = wk.capabilities;
              maxConcurrent = wk.maxConcurrent; status = newStatus;
              activeSlots = newActive; totalCompleted = newCompleted;
              totalFailed = newFailed; lastHeartbeatAt = wk.lastHeartbeatAt;
              registeredAt = wk.registeredAt; registeredBy = wk.registeredBy;
              drainAt = wk.drainAt }
          } else { wk }
        });
      };
    };

    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  TIMEOUT SWEEP — detect and expire stale slots
  // ══════════════════════════════════════════════════════════════════

  /// sweepTimeouts — expire any slot past its timeoutAt timestamp
  /// Call this from a heartbeat or periodic tick.
  public shared func sweepTimeouts() : async Nat {
    let now = Time.now();
    var expired : Nat = 0;
    let toExpire = Array.filter<FieldSlot>(activeSlots, func(s) {
      switch (s.timeoutAt) {
        case null false;
        case (?t) now > t and (s.status == #Assigned or s.status == #Running);
      }
    });
    for (slot in toExpire.vals()) {
      ignore await _finishSlot(slot.id, #TimedOut, null, ?"Timed out by sweepTimeouts");
      expired += 1;
    };
    expired
  };

  // ══════════════════════════════════════════════════════════════════
  //  LIVENESS CHECK — mark unresponsive workers offline
  // ══════════════════════════════════════════════════════════════════

  /// checkLiveness — mark workers that haven't heartbeated as offline
  public shared func checkLiveness() : async Nat {
    let now = Time.now();
    var marked : Nat = 0;
    workers := Array.map<Worker, Worker>(workers, func(w) {
      if (w.status != #Offline and
          now - w.lastHeartbeatAt > fieldConfig.livenessTtlNs) {
        marked += 1;
        { id = w.id; workerLabel = w.workerLabel; capabilities = w.capabilities;
          maxConcurrent = w.maxConcurrent; status = #Offline;
          activeSlots = w.activeSlots; totalCompleted = w.totalCompleted;
          totalFailed = w.totalFailed; lastHeartbeatAt = w.lastHeartbeatAt;
          registeredAt = w.registeredAt; registeredBy = w.registeredBy;
          drainAt = w.drainAt }
      } else { w }
    });
    marked
  };

  // ══════════════════════════════════════════════════════════════════
  //  CONFIG
  // ══════════════════════════════════════════════════════════════════

  public type FieldConfigPatch = {
    defaultTimeoutNs    : ?Nat;
    maxTotalSlots       : ?Nat;
    organCaps           : ?[OrganCap];
    rebalanceIntervalNs : ?Nat;
    livenessTtlNs       : ?Nat;
  };

  public shared func updateFieldConfig(patch : FieldConfigPatch) : async () {
    fieldConfig := {
      defaultTimeoutNs    = Option.get(patch.defaultTimeoutNs,    fieldConfig.defaultTimeoutNs);
      maxTotalSlots       = Option.get(patch.maxTotalSlots,       fieldConfig.maxTotalSlots);
      organCaps           = Option.get(patch.organCaps,           fieldConfig.organCaps);
      rebalanceIntervalNs = Option.get(patch.rebalanceIntervalNs, fieldConfig.rebalanceIntervalNs);
      livenessTtlNs       = Option.get(patch.livenessTtlNs,       fieldConfig.livenessTtlNs);
      fieldVersion        = fieldConfig.fieldVersion + 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY METHODS
  // ══════════════════════════════════════════════════════════════════

  public query func getWorker(id : Text) : async ?Worker {
    findWorker(id)
  };

  public query func listWorkers(statusFilter : ?WorkerStatus) : async [Worker] {
    switch (statusFilter) {
      case null workers;
      case (?s) Array.filter<Worker>(workers, func(w) { w.status == s });
    }
  };

  public query func getWorkerLoad() : async [WorkerLoad] {
    Array.map<Worker, WorkerLoad>(workers, func(w) {
      let util = if (w.maxConcurrent == 0) 0
                 else (w.activeSlots * 100) / w.maxConcurrent;
      {
        workerId      = w.id;
        workerLabel   = w.workerLabel;
        status        = w.status;
        activeSlots   = w.activeSlots;
        maxConcurrent = w.maxConcurrent;
        utilization   = util;
        capabilities  = w.capabilities;
      }
    })
  };

  public query func getActiveSlots(workerFilter : ?Text) : async [FieldSlot] {
    switch (workerFilter) {
      case null activeSlots;
      case (?wid) Array.filter<FieldSlot>(activeSlots, func(s) { s.workerId == wid });
    }
  };

  public query func getSlotHistory(workerFilter : ?Text, limit : Nat) : async [FieldSlot] {
    let filtered = switch (workerFilter) {
      case null slotHistory;
      case (?wid) Array.filter<FieldSlot>(slotHistory, func(s) { s.workerId == wid });
    };
    let n = filtered.size();
    if (n == 0 or limit == 0) return [];
    let start = if (limit >= n) 0 else n - limit;
    Array.tabulate<FieldSlot>(n - start, func(i) { filtered[start + i] })
  };

  public query func getFieldConfig() : async FieldConfig { fieldConfig };

  public query func getFieldStats() : async FieldStats {
    let idle      = Array.filter<Worker>(workers, func(w) { w.status == #Idle       }).size();
    let active    = Array.filter<Worker>(workers, func(w) { w.status == #Active     }).size();
    let overload  = Array.filter<Worker>(workers, func(w) { w.status == #Overloaded }).size();
    let offline   = Array.filter<Worker>(workers, func(w) { w.status == #Offline    }).size();
    let draining  = Array.filter<Worker>(workers, func(w) { w.status == #Draining   }).size();

    let completed = Array.filter<FieldSlot>(slotHistory, func(s) { s.status == #Completed }).size();
    let failed    = Array.filter<FieldSlot>(slotHistory, func(s) { s.status == #Failed    }).size();
    let timedOut  = Array.filter<FieldSlot>(slotHistory, func(s) { s.status == #TimedOut  }).size();

    let totalActive = activeSlots.size();
    let fieldUtil = if (fieldConfig.maxTotalSlots == 0) 0
                   else (totalActive * 100) / fieldConfig.maxTotalSlots;

    {
      totalWorkers      = workers.size();
      idleWorkers       = idle;
      activeWorkers     = active;
      overloadedWorkers = overload;
      offlineWorkers    = offline;
      drainingWorkers   = draining;
      totalActiveSlots  = totalActive;
      totalHistorySlots = slotHistory.size();
      completedSlots    = completed;
      failedSlots       = failed;
      timedOutSlots     = timedOut;
      fieldUtilization  = fieldUtil;
      backpressure      = totalActive >= fieldConfig.maxTotalSlots;
      fieldVersion      = fieldConfig.fieldVersion;
      schemaVersion     = schemaVersion;
    }
  };

}
