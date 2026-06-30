///
/// PULSE RUNTIME — Native ORO Concurrency and Invariant Execution Layer
///
/// "We do not use Go as the organism's nervous system.
///  We build our own native PULSE Runtime as the organism's
///  internal concurrency layer. Go is only a membrane tool
///  when outside-world calls require it."
///
/// PULSE Runtime is the internal execution system that lets organism
/// modules call, signal, wait, fire, compete, route, and complete work
/// without needing external servers.
///
/// Primitive mapping:
///   Go goroutine     → Pulse Thread  (PulseTask)
///   Go channel       → Signal Channel
///   Go select        → Arbitration Gate
///   Go context       → Doctrine / Invariant Context
///   Go scheduler     → Heartbeat / Salience Scheduler
///   Go worker pool   → Synapse Field
///   Go error handling→ Runtime Truth / Proof Trace
///   External HTTP    → Membrane Adapter (optional only)
///
/// Architecture:
///   Layer 1 — PULSE Scheduler        (heartbeat + salience priority)
///   Layer 2 — Signal Channels        (inter-organ structured events)
///   Layer 3 — Invariant Kernel       (executable doctrine law)
///   Layer 4 — Synaptic Threads       (PulseTask lightweight jobs)
///   Layer 5 — Proof Trace            (evidence of every execution)
///   Layer 6 — Memory Writeback       (governance consequence memory)
///   Layer 7 — Optional Membrane      (outside-world adapter — NOT Go gateway)
///
/// Pre-wired EffectTrace invariants:
///   INV-001  VerifiedRequiresEvidence
///   INV-002  ClaimIsNotTruth
///   INV-003  PublishedIsNotVerified
///   INV-004  RiskScoreBounds
///   INV-005  FindingsMustBeDisputable
///   INV-006  EveryMutationCreatesRevision
///   INV-007  NeutralPublicLanguage
///
/// Pre-wired pulse types:
///   PULSE-GOV-001  ProposalIngestPulse
///   PULSE-GOV-002  EffectPathPulse
///   PULSE-GOV-003  RiskClassPulse
///   PULSE-GOV-004  VerificationPulse
///   PULSE-GOV-005  MemoryLinkPulse
///   PULSE-GOV-006  AlertPulse
///   PULSE-GOV-007  ExportPulse
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Array     "mo:base/Array";
import Buffer    "mo:base/Buffer";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Option    "mo:base/Option";
import Principal "mo:base/Principal";
import Result    "mo:base/Result";
import Text      "mo:base/Text";
import Time      "mo:base/Time";

persistent actor Pulse {

  // ══════════════════════════════════════════════════════════════════
  //  CPL RUNTIME WIRING — The Permanent Foundation (Self-Reference)
  // ══════════════════════════════════════════════════════════════════
  // NOTE: PULSE delegates to CPL Runtime for execution. CPL Runtime
  // is the real native PULSE system. This "pulse" canister is a
  // legacy shim that will delegate all operations to CPL Runtime.

  stable var cplRuntimeCanisterId : ?Principal = null;

  // CPL type alias (pulse already defines PulsePriority and ProofResult below)
  public type MemoryType = { #Precedent; #Pattern; #Consequence; #Alert; #Constraint; #Exception };

  // NOTE: CPLRuntime type uses PulsePriority and ProofResult defined later in this file
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

  var taskQueue         : [PulseTask]     = [];
  var signalLog         : [Signal]        = [];
  var invariantRegistry : [Invariant]     = [];
  var policyAtoms       : [PolicyAtom]    = [];
  var proofLog          : [ProofTrace]    = [];
  var schedulerState    : SchedulerState  = {
    lastHeartbeatAt     = 0;
    heartbeatIntervalNs = 86_400_000_000_000;
    totalPulsesRun      = 0;
    totalPulsesFailed   = 0;
    totalProofsWritten  = 0;
    totalSignalsRouted  = 0;
    activeInvariants    = 0;
    schedulerVersion    = 1;
  };
  var schemaVersion     : Nat             = 1;
  var idCounter         : Nat             = 0;

  // ══════════════════════════════════════════════════════════════════
  //  ENUM TYPES
  // ══════════════════════════════════════════════════════════════════

  /// Priority of a pulse task — drives scheduler ordering
  public type PulsePriority = {
    #Low;
    #Normal;
    #High;
    #Critical;
  };

  /// Lifecycle state of a pulse task
  public type PulseStatus = {
    #Queued;
    #Running;
    #Completed;
    #Failed;
    #Blocked;
    #Cancelled;
  };

  /// What to do when an invariant is violated
  public type FailureAction = {
    #Block;
    #Warn;
    #Escalate;
    #RouteToReview;
  };

  /// Invariant severity
  public type InvariantSeverity = {
    #Low;
    #Medium;
    #High;
    #Critical;
  };

  /// Proof result
  public type ProofResult = {
    #Passed;
    #Failed;
    #Blocked;
    #Partial;
  };

  /// Signal channel categories — keeps routing structured
  public type SignalChannel = {
    #Governance;       // proposal lifecycle events
    #EffectPath;       // trace construction events
    #Risk;             // risk classification events
    #Verification;     // verification and truth events
    #Memory;           // governance memory write events
    #Alert;            // operator escalation
    #Export;           // markdown / report generation
    #Scheduler;        // internal scheduler control
    #Membrane;         // external adapter signals
  };

  // ══════════════════════════════════════════════════════════════════
  //  CORE DATA MODELS
  // ══════════════════════════════════════════════════════════════════

  /// PulseTask — native version of a goroutine
  ///
  /// Unlike a bare goroutine, a PulseTask carries doctrine context,
  /// proof requirements, priority, and a named target organ.
  public type PulseTask = {
    id              : Text;
    pulseType       : Text;            // e.g. "ProposalIngestPulse"
    sourceEventId   : Text;            // originating event / signal ID
    priority        : PulsePriority;
    targetOrgan     : Text;            // e.g. "effecttrace"
    invariantRefs   : [Text];          // IDs of invariants this pulse must respect
    payloadRef      : Text;            // serialised payload reference
    status          : PulseStatus;
    proofRequired   : Bool;
    salience        : Nat;             // 0–100  (100 = maximum organism attention)
    riskScore       : Nat;             // 0–100
    urgency         : Nat;             // 0–100
    createdAt       : Int;
    startedAt       : ?Int;
    completedAt     : ?Int;
    failReason      : ?Text;
    proofTraceId    : ?Text;
    submittedBy     : ?Principal;
  };

  /// Signal — meaning-bearing inter-organ packet
  ///
  /// Signals are not just data. They are structured meaning
  /// with doctrine context and routing metadata.
  public type Signal = {
    id              : Text;
    channel         : SignalChannel;
    sourceOrgan     : Text;
    targetOrgan     : Text;
    signalType      : Text;            // e.g. "ProposalDetected"
    payloadRef      : Text;
    salience        : Nat;             // 0–100
    riskScore       : Nat;             // 0–100
    urgency         : Nat;             // 0–100
    invariantHints  : [Text];          // suggested invariants to check
    relatedPulseId  : ?Text;
    consumed        : Bool;
    consumedByPulse : ?Text;
    createdAt       : Int;
    consumedAt      : ?Int;
  };

  /// Invariant — executable doctrine law
  ///
  /// Doctrine stays the high-level law.
  /// Invariant is the runtime-enforced version.
  ///
  /// Example:
  ///   Doctrine: "Do not collapse claim into truth."
  ///   Invariant: A trace cannot be VerifiedAfterState without
  ///              a completed, source-linked verification step.
  public type Invariant = {
    id              : Text;             // e.g. "INV-001"
    invariantName   : Text;
    doctrineRef     : Text;             // human-readable doctrine clause
    condition       : Text;             // human-readable executable condition
    requiredProof   : Text;             // what proof must exist to satisfy
    failureAction   : FailureAction;
    severity        : InvariantSeverity;
    active          : Bool;
    createdAt       : Int;
  };

  /// PolicyAtom — smallest enforceable unit of behaviour
  ///
  /// PolicyAtoms compose to create Invariants.
  /// They are the atoms from which executable doctrine is built.
  public type PolicyAtom = {
    id              : Text;
    atomName        : Text;
    invariantRef    : Text;
    condition       : Text;             // atomic check condition
    failureMessage  : Text;
    severity        : InvariantSeverity;
    active          : Bool;
    createdAt       : Int;
  };

  /// ProofTrace — cryptographic evidence of pulse execution
  ///
  /// Every important pulse must produce proof.
  /// No proof = no verified claim.
  public type ProofTrace = {
    id              : Text;
    pulseTaskId     : Text;
    invariantRefs   : [Text];
    stateRead       : [Text];           // list of records/fields read
    stateWritten    : [Text];           // list of records/fields written
    result          : ProofResult;
    evidenceRefs    : [Text];           // linked evidence IDs
    memoryWritten   : Bool;
    failReason      : ?Text;
    createdAt       : Int;
  };

  /// SchedulerState — the heartbeat of the organism
  ///
  /// The scheduler uses salience, urgency, risk, and doctrine importance
  /// to decide which pulse runs next — not random selection like Go select.
  public type SchedulerState = {
    lastHeartbeatAt    : Int;
    heartbeatIntervalNs: Nat;           // nanoseconds between heartbeats
    totalPulsesRun     : Nat;
    totalPulsesFailed  : Nat;
    totalProofsWritten : Nat;
    totalSignalsRouted : Nat;
    activeInvariants   : Nat;
    schedulerVersion   : Nat;
  };

  /// PulseResult — returned from pulse execution
  public type PulseResult = {
    pulseId    : Text;
    status     : PulseStatus;
    proofId    : ?Text;
    memWritten : Bool;
    signals    : [Text];               // IDs of signals emitted
    error      : ?Text;
  };

  /// Input for submitting a new pulse
  public type PulseInput = {
    pulseType     : Text;
    sourceEventId : Text;
    priority      : PulsePriority;
    targetOrgan   : Text;
    invariantRefs : [Text];
    payloadRef    : Text;
    proofRequired : Bool;
    salience      : Nat;
    riskScore     : Nat;
    urgency       : Nat;
  };

  /// Input for emitting a signal
  public type SignalInput = {
    channel       : SignalChannel;
    sourceOrgan   : Text;
    targetOrgan   : Text;
    signalType    : Text;
    payloadRef    : Text;
    salience      : Nat;
    riskScore     : Nat;
    urgency       : Nat;
    invariantHints: [Text];
    relatedPulseId: ?Text;
  };

  /// Input for registering an invariant
  public type InvariantInput = {
    id            : Text;
    invariantName : Text;
    doctrineRef   : Text;
    condition     : Text;
    requiredProof : Text;
    failureAction : FailureAction;
    severity      : InvariantSeverity;
  };

  /// Input for registering a policy atom
  public type PolicyAtomInput = {
    id           : Text;
    atomName     : Text;
    invariantRef : Text;
    condition    : Text;
    failureMessage: Text;
    severity     : InvariantSeverity;
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func nextId(prefix : Text) : Text {
    idCounter += 1;
    prefix # "-" # Int.toText(Time.now()) # "-" # Nat.toText(idCounter)
  };

  func clampSalience(n : Nat) : Nat {
    if (n > 100) 100 else n
  };

  func findTask(id : Text) : ?PulseTask {
    Array.find<PulseTask>(taskQueue, func(t) { t.id == id })
  };

  func findSignal(id : Text) : ?Signal {
    Array.find<Signal>(signalLog, func(s) { s.id == id })
  };

  func findInvariant(id : Text) : ?Invariant {
    Array.find<Invariant>(invariantRegistry, func(i) { i.id == id })
  };

  func findProof(id : Text) : ?ProofTrace {
    Array.find<ProofTrace>(proofLog, func(p) { p.id == id })
  };

  /// Compute effective scheduling score for a task.
  /// Higher = runs sooner.
  func scheduleScore(t : PulseTask) : Nat {
    let priorityBoost = switch (t.priority) {
      case (#Critical) 1000;
      case (#High)     500;
      case (#Normal)   100;
      case (#Low)      0;
    };
    priorityBoost + t.salience + t.urgency + t.riskScore
  };

  // ══════════════════════════════════════════════════════════════════
  //  PULSE TASK MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// submitPulse — native version of `go doWork()`
  ///
  /// Instead of:  go doWork()
  /// PULSE has:   pulse EffectTrace.IngestProposal(event)
  ///
  /// A pulse is not a dumb thread. It carries source event,
  /// doctrine/invariant context, priority, target organ,
  /// expected output, proof requirement, and failure path.
  public shared(msg) func submitPulse(input : PulseInput) : async Result.Result<Text, Text> {
    if (Text.size(input.pulseType) == 0) {
      return #err("pulseType required");
    };
    if (Text.size(input.targetOrgan) == 0) {
      return #err("targetOrgan required");
    };
    if (clampSalience(input.salience) != input.salience) {
      return #err("salience must be 0–100");
    };

    let id = nextId("pulse");
    let task : PulseTask = {
      id              = id;
      pulseType       = input.pulseType;
      sourceEventId   = input.sourceEventId;
      priority        = input.priority;
      targetOrgan     = input.targetOrgan;
      invariantRefs   = input.invariantRefs;
      payloadRef      = input.payloadRef;
      status          = #Queued;
      proofRequired   = input.proofRequired;
      salience        = clampSalience(input.salience);
      riskScore       = clampSalience(input.riskScore);
      urgency         = clampSalience(input.urgency);
      createdAt       = Time.now();
      startedAt       = null;
      completedAt     = null;
      failReason      = null;
      proofTraceId    = null;
      submittedBy     = ?msg.caller;
    };
    taskQueue := Array.append(taskQueue, [task]);
    #ok(id)
  };

  /// claimPulse — transition Queued → Running
  /// The scheduler calls this when it selects a task to execute.
  public shared func claimPulse(pulseId : Text) : async Result.Result<PulseTask, Text> {
    let tasks = Buffer.fromArray<PulseTask>(taskQueue);
    var found = false;
    var result : ?PulseTask = null;

    let updated = Array.map<PulseTask, PulseTask>(taskQueue, func(t) {
      if (t.id == pulseId) {
        if (t.status != #Queued) {
          return t;
        };
        found := true;
        let claimed : PulseTask = {
          id              = t.id;
          pulseType       = t.pulseType;
          sourceEventId   = t.sourceEventId;
          priority        = t.priority;
          targetOrgan     = t.targetOrgan;
          invariantRefs   = t.invariantRefs;
          payloadRef      = t.payloadRef;
          status          = #Running;
          proofRequired   = t.proofRequired;
          salience        = t.salience;
          riskScore       = t.riskScore;
          urgency         = t.urgency;
          createdAt       = t.createdAt;
          startedAt       = ?Time.now();
          completedAt     = null;
          failReason      = null;
          proofTraceId    = null;
          submittedBy     = t.submittedBy;
        };
        result := ?claimed;
        claimed
      } else {
        t
      }
    });

    if (not found) {
      return #err("pulseId not found or not in Queued state");
    };
    taskQueue := updated;
    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun + 1;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      schedulerVersion    = schedulerState.schedulerVersion;
    };
    switch (result) {
      case (?t) #ok(t);
      case null #err("unexpected state");
    }
  };

  /// completePulse — transition Running → Completed
  public shared func completePulse(
    pulseId    : Text,
    proofId    : ?Text,
    memWritten : Bool,
    signalIds  : [Text],
  ) : async Result.Result<(), Text> {
    var found = false;
    taskQueue := Array.map<PulseTask, PulseTask>(taskQueue, func(t) {
      if (t.id == pulseId and t.status == #Running) {
        found := true;
        {
          id              = t.id;
          pulseType       = t.pulseType;
          sourceEventId   = t.sourceEventId;
          priority        = t.priority;
          targetOrgan     = t.targetOrgan;
          invariantRefs   = t.invariantRefs;
          payloadRef      = t.payloadRef;
          status          = #Completed;
          proofRequired   = t.proofRequired;
          salience        = t.salience;
          riskScore       = t.riskScore;
          urgency         = t.urgency;
          createdAt       = t.createdAt;
          startedAt       = t.startedAt;
          completedAt     = ?Time.now();
          failReason      = null;
          proofTraceId    = proofId;
          submittedBy     = t.submittedBy;
        }
      } else {
        t
      }
    });
    if (not found) return #err("pulseId not found or not in Running state");
    #ok(())
  };

  /// failPulse — transition Running → Failed
  public shared func failPulse(pulseId : Text, reason : Text) : async Result.Result<(), Text> {
    var found = false;
    taskQueue := Array.map<PulseTask, PulseTask>(taskQueue, func(t) {
      if (t.id == pulseId and t.status == #Running) {
        found := true;
        {
          id              = t.id;
          pulseType       = t.pulseType;
          sourceEventId   = t.sourceEventId;
          priority        = t.priority;
          targetOrgan     = t.targetOrgan;
          invariantRefs   = t.invariantRefs;
          payloadRef      = t.payloadRef;
          status          = #Failed;
          proofRequired   = t.proofRequired;
          salience        = t.salience;
          riskScore       = t.riskScore;
          urgency         = t.urgency;
          createdAt       = t.createdAt;
          startedAt       = t.startedAt;
          completedAt     = ?Time.now();
          failReason      = ?reason;
          proofTraceId    = null;
          submittedBy     = t.submittedBy;
        }
      } else {
        t
      }
    });
    if (not found) return #err("pulseId not found or not in Running state");
    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed + 1;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      schedulerVersion    = schedulerState.schedulerVersion;
    };
    #ok(())
  };

  /// blockPulse — transition Queued/Running → Blocked (invariant violation)
  public shared func blockPulse(pulseId : Text, reason : Text) : async Result.Result<(), Text> {
    var found = false;
    taskQueue := Array.map<PulseTask, PulseTask>(taskQueue, func(t) {
      if (t.id == pulseId) {
        found := true;
        {
          id              = t.id;
          pulseType       = t.pulseType;
          sourceEventId   = t.sourceEventId;
          priority        = t.priority;
          targetOrgan     = t.targetOrgan;
          invariantRefs   = t.invariantRefs;
          payloadRef      = t.payloadRef;
          status          = #Blocked;
          proofRequired   = t.proofRequired;
          salience        = t.salience;
          riskScore       = t.riskScore;
          urgency         = t.urgency;
          createdAt       = t.createdAt;
          startedAt       = t.startedAt;
          completedAt     = ?Time.now();
          failReason      = ?("BLOCKED: " # reason);
          proofTraceId    = null;
          submittedBy     = t.submittedBy;
        }
      } else {
        t
      }
    });
    if (not found) return #err("pulseId not found");
    #ok(())
  };

  /// cancelPulse — cancel a queued pulse before it runs
  public shared func cancelPulse(pulseId : Text, reason : Text) : async Result.Result<(), Text> {
    var found = false;
    taskQueue := Array.map<PulseTask, PulseTask>(taskQueue, func(t) {
      if (t.id == pulseId and t.status == #Queued) {
        found := true;
        {
          id              = t.id;
          pulseType       = t.pulseType;
          sourceEventId   = t.sourceEventId;
          priority        = t.priority;
          targetOrgan     = t.targetOrgan;
          invariantRefs   = t.invariantRefs;
          payloadRef      = t.payloadRef;
          status          = #Cancelled;
          proofRequired   = t.proofRequired;
          salience        = t.salience;
          riskScore       = t.riskScore;
          urgency         = t.urgency;
          createdAt       = t.createdAt;
          startedAt       = null;
          completedAt     = ?Time.now();
          failReason      = ?reason;
          proofTraceId    = null;
          submittedBy     = t.submittedBy;
        }
      } else {
        t
      }
    });
    if (not found) return #err("pulseId not found or not in Queued state");
    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  SCHEDULER — Heartbeat / Salience Priority Selection
  // ══════════════════════════════════════════════════════════════════

  /// getNextPulse — Arbitration Gate
  ///
  /// Native version of Go select, but doctrine-aware.
  /// The gate does not pick randomly — it uses:
  ///   priority class, salience, urgency, risk, and doctrine importance.
  ///
  /// Returns the highest-scoring queued pulse, or null if none.
  public query func getNextPulse() : async ?PulseTask {
    let queued = Array.filter<PulseTask>(taskQueue, func(t) { t.status == #Queued });
    if (queued.size() == 0) return null;

    var best : ?PulseTask = null;
    var bestScore : Nat   = 0;
    for (t in queued.vals()) {
      let score = scheduleScore(t);
      if (score > bestScore) {
        bestScore := score;
        best      := ?t;
      };
    };
    best
  };

  /// tickHeartbeat — advance the scheduler clock
  /// Call this from a timer or manual operator trigger.
  public shared func tickHeartbeat() : async () {
    schedulerState := {
      lastHeartbeatAt     = Time.now();
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = Array.filter<Invariant>(invariantRegistry, func(i) { i.active }).size();
      schedulerVersion    = schedulerState.schedulerVersion;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  SIGNAL CHANNELS — Inter-Organ Communication
  // ══════════════════════════════════════════════════════════════════

  /// emitSignal — send a meaning-bearing signal to a target organ
  ///
  /// Native version of channel send.
  /// A signal is not just data — it is a structured meaning packet
  /// with doctrine context and routing metadata.
  public shared(msg) func emitSignal(input : SignalInput) : async Result.Result<Text, Text> {
    if (Text.size(input.sourceOrgan) == 0) {
      return #err("sourceOrgan required");
    };
    if (Text.size(input.targetOrgan) == 0) {
      return #err("targetOrgan required");
    };
    if (Text.size(input.signalType) == 0) {
      return #err("signalType required");
    };

    let id = nextId("signal");
    let signal : Signal = {
      id              = id;
      channel         = input.channel;
      sourceOrgan     = input.sourceOrgan;
      targetOrgan     = input.targetOrgan;
      signalType      = input.signalType;
      payloadRef      = input.payloadRef;
      salience        = clampSalience(input.salience);
      riskScore       = clampSalience(input.riskScore);
      urgency         = clampSalience(input.urgency);
      invariantHints  = input.invariantHints;
      relatedPulseId  = input.relatedPulseId;
      consumed        = false;
      consumedByPulse = null;
      createdAt       = Time.now();
      consumedAt      = null;
    };
    signalLog := Array.append(signalLog, [signal]);
    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted + 1;
      activeInvariants    = schedulerState.activeInvariants;
      schedulerVersion    = schedulerState.schedulerVersion;
    };
    #ok(id)
  };

  /// consumeSignal — mark a signal as consumed by a pulse
  public shared func consumeSignal(signalId : Text, pulseId : Text) : async Result.Result<(), Text> {
    var found = false;
    signalLog := Array.map<Signal, Signal>(signalLog, func(s) {
      if (s.id == signalId and not s.consumed) {
        found := true;
        {
          id              = s.id;
          channel         = s.channel;
          sourceOrgan     = s.sourceOrgan;
          targetOrgan     = s.targetOrgan;
          signalType      = s.signalType;
          payloadRef      = s.payloadRef;
          salience        = s.salience;
          riskScore       = s.riskScore;
          urgency         = s.urgency;
          invariantHints  = s.invariantHints;
          relatedPulseId  = s.relatedPulseId;
          consumed        = true;
          consumedByPulse = ?pulseId;
          createdAt       = s.createdAt;
          consumedAt      = ?Time.now();
        }
      } else {
        s
      }
    });
    if (not found) return #err("signalId not found or already consumed");
    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  INVARIANT KERNEL — Executable Doctrine Law
  // ══════════════════════════════════════════════════════════════════

  /// registerInvariant — install an executable doctrine law
  ///
  /// Invariants are what transform doctrine documents into
  /// runtime-enforced constraints on every pulse.
  public shared func registerInvariant(input : InvariantInput) : async Result.Result<(), Text> {
    if (Text.size(input.id) == 0) return #err("id required");
    if (Text.size(input.invariantName) == 0) return #err("invariantName required");

    // Reject duplicate IDs
    let existing = Array.find<Invariant>(invariantRegistry, func(i) { i.id == input.id });
    if (Option.isSome(existing)) {
      return #err("invariant with this id already exists");
    };

    let inv : Invariant = {
      id            = input.id;
      invariantName = input.invariantName;
      doctrineRef   = input.doctrineRef;
      condition     = input.condition;
      requiredProof = input.requiredProof;
      failureAction = input.failureAction;
      severity      = input.severity;
      active        = true;
      createdAt     = Time.now();
    };
    invariantRegistry := Array.append(invariantRegistry, [inv]);
    #ok(())
  };

  /// deactivateInvariant — pause an invariant without deleting it
  public shared func deactivateInvariant(invariantId : Text) : async Result.Result<(), Text> {
    var found = false;
    invariantRegistry := Array.map<Invariant, Invariant>(invariantRegistry, func(i) {
      if (i.id == invariantId) {
        found := true;
        { id = i.id; invariantName = i.invariantName; doctrineRef = i.doctrineRef;
          condition = i.condition; requiredProof = i.requiredProof;
          failureAction = i.failureAction; severity = i.severity;
          active = false; createdAt = i.createdAt }
      } else { i }
    });
    if (not found) return #err("invariantId not found");
    #ok(())
  };

  /// registerPolicyAtom — install the smallest enforceable behaviour unit
  public shared func registerPolicyAtom(input : PolicyAtomInput) : async Result.Result<(), Text> {
    if (Text.size(input.id) == 0) return #err("id required");
    let existing = Array.find<PolicyAtom>(policyAtoms, func(p) { p.id == input.id });
    if (Option.isSome(existing)) return #err("policy atom with this id already exists");

    let atom : PolicyAtom = {
      id             = input.id;
      atomName       = input.atomName;
      invariantRef   = input.invariantRef;
      condition      = input.condition;
      failureMessage = input.failureMessage;
      severity       = input.severity;
      active         = true;
      createdAt      = Time.now();
    };
    policyAtoms := Array.append(policyAtoms, [atom]);
    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  PROOF TRACE — Evidence of Execution
  // ══════════════════════════════════════════════════════════════════

  /// writeProof — record proof of a pulse's execution
  ///
  /// Every important pulse must produce proof.
  /// No proof = no verified claim.
  ///
  /// Proof becomes the runtime truth layer.
  public shared func writeProof(
    pulseTaskId  : Text,
    invariantRefs: [Text],
    stateRead    : [Text],
    stateWritten : [Text],
    result       : ProofResult,
    evidenceRefs : [Text],
    memoryWritten: Bool,
    failReason   : ?Text,
  ) : async Result.Result<Text, Text> {
    if (Text.size(pulseTaskId) == 0) return #err("pulseTaskId required");

    let id = nextId("proof");
    let proof : ProofTrace = {
      id           = id;
      pulseTaskId  = pulseTaskId;
      invariantRefs= invariantRefs;
      stateRead    = stateRead;
      stateWritten = stateWritten;
      result       = result;
      evidenceRefs = evidenceRefs;
      memoryWritten= memoryWritten;
      failReason   = failReason;
      createdAt    = Time.now();
    };
    proofLog := Array.append(proofLog, [proof]);
    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalProofsWritten  = schedulerState.totalProofsWritten + 1;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      schedulerVersion    = schedulerState.schedulerVersion;
    };
    #ok(id)
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY METHODS
  // ══════════════════════════════════════════════════════════════════

  public query func getPulseTask(id : Text) : async ?PulseTask {
    findTask(id)
  };

  public query func listPulseTasks(statusFilter : ?PulseStatus) : async [PulseTask] {
    switch (statusFilter) {
      case null taskQueue;
      case (?s) Array.filter<PulseTask>(taskQueue, func(t) { t.status == s });
    }
  };

  public query func getPendingPulses() : async [PulseTask] {
    Array.filter<PulseTask>(taskQueue, func(t) {
      t.status == #Queued or t.status == #Running
    })
  };

  public query func getSignal(id : Text) : async ?Signal {
    findSignal(id)
  };

  public query func getSignalsByChannel(channel : SignalChannel) : async [Signal] {
    Array.filter<Signal>(signalLog, func(s) { s.channel == channel })
  };

  public query func getSignalsByTarget(targetOrgan : Text) : async [Signal] {
    Array.filter<Signal>(signalLog, func(s) { s.targetOrgan == targetOrgan })
  };

  public query func getPendingSignals(targetOrgan : Text) : async [Signal] {
    Array.filter<Signal>(signalLog, func(s) {
      s.targetOrgan == targetOrgan and not s.consumed
    })
  };

  public query func getInvariant(id : Text) : async ?Invariant {
    findInvariant(id)
  };

  public query func listInvariants(activeOnly : Bool) : async [Invariant] {
    if (activeOnly) {
      Array.filter<Invariant>(invariantRegistry, func(i) { i.active })
    } else {
      invariantRegistry
    }
  };

  public query func listPolicyAtoms(invariantRef : ?Text) : async [PolicyAtom] {
    switch (invariantRef) {
      case null policyAtoms;
      case (?ref) Array.filter<PolicyAtom>(policyAtoms, func(p) { p.invariantRef == ref });
    }
  };

  public query func getProof(id : Text) : async ?ProofTrace {
    findProof(id)
  };

  public query func getProofsByPulse(pulseTaskId : Text) : async [ProofTrace] {
    Array.filter<ProofTrace>(proofLog, func(p) { p.pulseTaskId == pulseTaskId })
  };

  public query func getProofsByInvariant(invariantId : Text) : async [ProofTrace] {
    Array.filter<ProofTrace>(proofLog, func(p) {
      Option.isSome(Array.find<Text>(p.invariantRefs, func(r) { r == invariantId }))
    })
  };

  public query func getFailedProofs() : async [ProofTrace] {
    Array.filter<ProofTrace>(proofLog, func(p) {
      p.result == #Failed or p.result == #Blocked
    })
  };

  public query func getSchedulerState() : async SchedulerState {
    schedulerState
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATS — Runtime Observability
  // ══════════════════════════════════════════════════════════════════

  public type PulseStats = {
    totalTasks       : Nat;
    queued           : Nat;
    running          : Nat;
    completed        : Nat;
    failed           : Nat;
    blocked          : Nat;
    cancelled        : Nat;
    totalSignals     : Nat;
    unconsumedSignals: Nat;
    totalInvariants  : Nat;
    activeInvariants : Nat;
    totalProofs      : Nat;
    failedProofs     : Nat;
    schemaVersion    : Nat;
  };

  public query func getStats() : async PulseStats {
    let queued    = Array.filter<PulseTask>(taskQueue, func(t) { t.status == #Queued    }).size();
    let running   = Array.filter<PulseTask>(taskQueue, func(t) { t.status == #Running   }).size();
    let completed = Array.filter<PulseTask>(taskQueue, func(t) { t.status == #Completed }).size();
    let failed    = Array.filter<PulseTask>(taskQueue, func(t) { t.status == #Failed    }).size();
    let blocked   = Array.filter<PulseTask>(taskQueue, func(t) { t.status == #Blocked   }).size();
    let cancelled = Array.filter<PulseTask>(taskQueue, func(t) { t.status == #Cancelled }).size();
    let unconsumed = Array.filter<Signal>(signalLog, func(s) { not s.consumed }).size();
    let activeInv = Array.filter<Invariant>(invariantRegistry, func(i) { i.active }).size();
    let failedProofs = Array.filter<ProofTrace>(proofLog, func(p) {
      p.result == #Failed or p.result == #Blocked
    }).size();

    {
      totalTasks        = taskQueue.size();
      queued            = queued;
      running           = running;
      completed         = completed;
      failed            = failed;
      blocked           = blocked;
      cancelled         = cancelled;
      totalSignals      = signalLog.size();
      unconsumedSignals = unconsumed;
      totalInvariants   = invariantRegistry.size();
      activeInvariants  = activeInv;
      totalProofs       = proofLog.size();
      failedProofs      = failedProofs;
      schemaVersion     = schemaVersion;
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  GENESIS — Pre-load EffectTrace Governance Invariants
  // ══════════════════════════════════════════════════════════════════
  ///
  /// These invariants encode the Pass 1 hard rules as executable
  /// runtime law, not just documentation.
  ///
  /// Call bootstrapInvariants() once after deploying to install them.

  public shared func bootstrapInvariants() : async Result.Result<Nat, Text> {
    let now = Time.now();
    var loaded : Nat = 0;

    let govInvariants : [(Text, Text, Text, Text, Text, FailureAction, InvariantSeverity)] = [
      (
        "INV-001",
        "VerifiedRequiresEvidence",
        "Rule 4: Verification requires evidence. Do not collapse claim into truth.",
        "trace.runtimeTruth.truthStatus == VerifiedAfterState REQUIRES trace.verificationPlan.steps.any(completed == true AND evidence.exists)",
        "At least one completed verification step with a result note or source link must exist.",
        #Block,
        #Critical
      ),
      (
        "INV-002",
        "ClaimIsNotTruth",
        "Rule 1: Do not collapse claim into truth. A proposal summary is only a claim until evidence exists.",
        "trace.runtimeTruth.truthStatus != VerifiedAfterState UNLESS verification evidence present",
        "Evidence must exist before ClaimOnly can be upgraded to VerifiedAfterState.",
        #Block,
        #High
      ),
      (
        "INV-003",
        "PublishedIsNotVerified",
        "Rule 3: Published does not mean verified. A published trace can still be claim-only.",
        "trace.status IN [needs_review, community_reviewed, execution_pending] does NOT imply truth == VerifiedAfterState",
        "Publication status must not be conflated with runtime truth verification.",
        #Warn,
        #High
      ),
      (
        "INV-004",
        "RiskScoreBounds",
        "Risk scores must be 0 through 5 in all six dimensions.",
        "ALL OF: technical, treasury, governance, irreversibility, verificationDifficulty, precedentWeight IN [0..5]",
        "Each risk score must be a Nat in range 0 to 5 inclusive.",
        #Block,
        #Medium
      ),
      (
        "INV-005",
        "FindingsMustBeDisputable",
        "Rule 6: Every agent/human finding can be draft, reviewed, disputed, or retracted.",
        "finding.status IN ['draft', 'reviewed', 'disputed', 'retracted']",
        "Findings must remain open to dispute. No permanent un-disputable state exists.",
        #Warn,
        #Medium
      ),
      (
        "INV-006",
        "EveryMutationCreatesRevision",
        "Rule 5: Every change creates a revision. No silent overwrites.",
        "EVERY createProposal, updateProposal, createTrace, updateTrace, publishTrace, updateFindingStatus MUST append to revisions[]",
        "A RevisionRecord must be appended to the revision log for every mutation.",
        #Block,
        #Critical
      ),
      (
        "INV-007",
        "NeutralPublicLanguage",
        "Rule 7: Public language must stay neutral. No adopt/reject recommendation.",
        "NO text in publicTitle, plainSummary, exportedMarkdown contains adopt/reject recommendation language",
        "All exported content must carry the status note: this trace does not recommend adopt/reject.",
        #Warn,
        #High
      ),
    ];

    for ((id, name, doctrine, condition, requiredProof, action, severity) in govInvariants.vals()) {
      let existing = Array.find<Invariant>(invariantRegistry, func(i) { i.id == id });
      if (Option.isNull(existing)) {
        let inv : Invariant = {
          id            = id;
          invariantName = name;
          doctrineRef   = doctrine;
          condition     = condition;
          requiredProof = requiredProof;
          failureAction = action;
          severity      = severity;
          active        = true;
          createdAt     = now;
        };
        invariantRegistry := Array.append(invariantRegistry, [inv]);
        loaded += 1;
      };
    };

    // Policy atoms for INV-001
    let atoms : [(Text, Text, Text, Text, Text, InvariantSeverity)] = [
      (
        "PA-001-A",
        "VerifiedRequiresCompletedStep",
        "INV-001",
        "verification_step.completed == true",
        "Cannot set VerifiedAfterState: no completed verification step exists.",
        #Critical
      ),
      (
        "PA-001-B",
        "VerifiedRequiresResultNote",
        "INV-001",
        "verification_step.resultNote != null OR verification_step.url != null",
        "Cannot set VerifiedAfterState: completed step has no result note or source URL.",
        #Critical
      ),
      (
        "PA-004-A",
        "TechnicalScoreInRange",
        "INV-004",
        "riskProfile.scores.technical IN [0..5]",
        "Technical risk score must be 0-5.",
        #Medium
      ),
      (
        "PA-004-B",
        "TreasuryScoreInRange",
        "INV-004",
        "riskProfile.scores.treasury IN [0..5]",
        "Treasury risk score must be 0-5.",
        #Medium
      ),
      (
        "PA-004-C",
        "GovernanceScoreInRange",
        "INV-004",
        "riskProfile.scores.governance IN [0..5]",
        "Governance risk score must be 0-5.",
        #Medium
      ),
    ];

    for ((id, name, invRef, condition, failMsg, severity) in atoms.vals()) {
      let existing = Array.find<PolicyAtom>(policyAtoms, func(p) { p.id == id });
      if (Option.isNull(existing)) {
        let atom : PolicyAtom = {
          id             = id;
          atomName       = name;
          invariantRef   = invRef;
          condition      = condition;
          failureMessage = failMsg;
          severity       = severity;
          active         = true;
          createdAt      = now;
        };
        policyAtoms := Array.append(policyAtoms, [atom]);
      };
    };

    // Update scheduler active invariant count
    let activeCount = Array.filter<Invariant>(invariantRegistry, func(i) { i.active }).size();
    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = activeCount;
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    #ok(loaded)
  };

  // ══════════════════════════════════════════════════════════════════
  //  GOVERNANCE PULSE TEMPLATES
  // ══════════════════════════════════════════════════════════════════
  ///
  /// Pre-wired pulse submissions for EffectTrace governance workload.
  /// These are convenience methods that submit the correct pulse type
  /// with pre-configured invariant references.
  ///
  /// Internal calls use these instead of raw submitPulse.

  /// pulse ProposalIngest — fire when a new proposal is to be ingested
  public shared(msg) func pulseProposalIngest(
    proposalRef : Text,
    salience    : Nat,
    riskScore   : Nat,
  ) : async Result.Result<Text, Text> {
    await submitPulse({
      pulseType     = "ProposalIngestPulse";
      sourceEventId = proposalRef;
      priority      = #High;
      targetOrgan   = "effecttrace";
      invariantRefs = ["INV-002", "INV-006", "INV-007"];
      payloadRef    = proposalRef;
      proofRequired = true;
      salience      = clampSalience(salience);
      riskScore     = clampSalience(riskScore);
      urgency       = 70;
    })
  };

  /// pulse EffectPath — fire when effect path analysis is needed
  public shared(msg) func pulseEffectPath(
    proposalRef : Text,
    salience    : Nat,
    riskScore   : Nat,
  ) : async Result.Result<Text, Text> {
    await submitPulse({
      pulseType     = "EffectPathPulse";
      sourceEventId = proposalRef;
      priority      = #High;
      targetOrgan   = "effecttrace";
      invariantRefs = ["INV-001", "INV-002", "INV-003", "INV-006"];
      payloadRef    = proposalRef;
      proofRequired = true;
      salience      = clampSalience(salience);
      riskScore     = clampSalience(riskScore);
      urgency       = 80;
    })
  };

  /// pulse RiskClass — fire when risk classification is needed
  public shared(msg) func pulseRiskClass(
    traceRef  : Text,
    salience  : Nat,
    riskScore : Nat,
  ) : async Result.Result<Text, Text> {
    await submitPulse({
      pulseType     = "RiskClassPulse";
      sourceEventId = traceRef;
      priority      = #Normal;
      targetOrgan   = "effecttrace";
      invariantRefs = ["INV-004"];
      payloadRef    = traceRef;
      proofRequired = true;
      salience      = clampSalience(salience);
      riskScore     = clampSalience(riskScore);
      urgency       = 60;
    })
  };

  /// pulse Verification — fire when truth status verification is needed
  public shared(msg) func pulseVerification(
    traceRef  : Text,
    salience  : Nat,
    riskScore : Nat,
  ) : async Result.Result<Text, Text> {
    await submitPulse({
      pulseType     = "VerificationPulse";
      sourceEventId = traceRef;
      priority      = #Critical;
      targetOrgan   = "effecttrace";
      invariantRefs = ["INV-001", "INV-002", "INV-003", "INV-006"];
      payloadRef    = traceRef;
      proofRequired = true;
      salience      = clampSalience(salience);
      riskScore     = clampSalience(riskScore);
      urgency       = 90;
    })
  };

  /// pulse MemoryLink — fire when governance memory needs to be written
  public shared(msg) func pulseMemoryLink(
    entityRef : Text,
    salience  : Nat,
  ) : async Result.Result<Text, Text> {
    await submitPulse({
      pulseType     = "MemoryLinkPulse";
      sourceEventId = entityRef;
      priority      = #Low;
      targetOrgan   = "effecttrace";
      invariantRefs = ["INV-006"];
      payloadRef    = entityRef;
      proofRequired = false;
      salience      = clampSalience(salience);
      riskScore     = 10;
      urgency       = 20;
    })
  };

  /// pulse Alert — fire when operator escalation is required
  public shared(msg) func pulseAlert(
    entityRef   : Text,
    urgency     : Nat,
    invariantId : Text,
  ) : async Result.Result<Text, Text> {
    await submitPulse({
      pulseType     = "AlertPulse";
      sourceEventId = entityRef;
      priority      = #Critical;
      targetOrgan   = "operator";
      invariantRefs = [invariantId];
      payloadRef    = entityRef;
      proofRequired = true;
      salience      = 100;
      riskScore     = 100;
      urgency       = clampSalience(urgency);
    })
  };

  /// pulse Export — fire when markdown export is requested
  public shared(msg) func pulseExport(
    traceRef : Text,
  ) : async Result.Result<Text, Text> {
    await submitPulse({
      pulseType     = "ExportPulse";
      sourceEventId = traceRef;
      priority      = #Low;
      targetOrgan   = "effecttrace";
      invariantRefs = ["INV-007"];
      payloadRef    = traceRef;
      proofRequired = false;
      salience      = 30;
      riskScore     = 0;
      urgency       = 10;
    })
  };

}
