///
/// PULSE SCHEDULER — Layer 1 of the PULSE Runtime
///
/// "The scheduler is the heartbeat of the organism."
///
/// PULSE Scheduler is the official cadence and priority engine for
/// the PULSE Runtime. It does NOT run pulse tasks directly — it decides
/// WHICH tasks run, in WHAT ORDER, and at WHAT MOMENT.
///
/// Native equivalent: Go runtime scheduler, but organism-aware.
///
/// The scheduler selects the next pulse to dispatch using:
///   1. Priority class     (#Critical > #High > #Normal > #Low)
///   2. Salience           (organism attention weight, 0–100)
///   3. Urgency            (time-pressure weight, 0–100)
///   4. Risk score         (consequence weight, 0–100)
///   5. Operator watchlist (manually elevated organs / pulse types)
///   6. Truth gap pressure (unresolved RuntimeTruth escalates score)
///   7. Epoch load         (avoid starving low-priority pulses forever)
///
/// Architecture:
///   Epoch     — one scheduling cycle (one heartbeat tick)
///   Slot      — a single dispatch decision within an epoch
///   Watchlist — operator-defined priority boost rules
///   Dispatch  — the ranked list of pulse IDs to run this epoch
///
/// Integration:
///   → Pulse Runtime (pulse canister) submits tasks to the task queue
///   → Pulse Scheduler reads the queue and returns a DispatchPlan
///   → Synapse Field (synapse_field canister) executes the plan
///   → Scheduler records results and updates epoch history
///
/// PULSE Scheduler does not execute. It only decides.
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

persistent actor PulseScheduler {

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

  var epochHistory      : [EpochRecord]      = [];
  var watchlist         : [WatchlistEntry]   = [];
  var dispatchLog       : [DispatchRecord]   = [];
  var truthGaps         : [TruthGapEntry]    = [];
  var config            : SchedulerConfig    = {
    heartbeatIntervalNs      = 86_400_000_000_000;
    maxSlotsPerEpoch         = 50;
    starvationThresholdEpochs= 10;
    watchlistBoostCap        = 200;
    truthGapBoostCap         = 150;
    criticalPriorityScore    = 1000;
    highPriorityScore        = 500;
    normalPriorityScore      = 100;
    lowPriorityScore         = 0;
    schedulerVersion         = 1;
  };
  var currentEpoch      : Nat               = 0;
  var idCounter         : Nat               = 0;
  var schemaVersion     : Nat               = 1;

  // ══════════════════════════════════════════════════════════════════
  //  ENUM TYPES
  // ══════════════════════════════════════════════════════════════════

  public type SlotResult = {
    #Dispatched;
    #Skipped;
    #Blocked;
    #Starved;    // ran because it had been waiting too long
  };

  public type WatchlistPriority = {
    #Elevate;    // boost effective score by watchlist boost value
    #Pin;        // always schedule in epoch regardless of score
    #Suppress;   // skip this organ/pulse type until removed
  };

  public type TruthGapSeverity = {
    #Low;
    #Medium;
    #High;
    #Critical;
  };

  // ══════════════════════════════════════════════════════════════════
  //  DATA TYPES
  // ══════════════════════════════════════════════════════════════════

  /// EpochRecord — one full scheduling cycle
  public type EpochRecord = {
    epochId          : Nat;
    startedAt        : Int;
    completedAt      : ?Int;
    slotsDispatched  : Nat;
    slotsSkipped     : Nat;
    slotsStarved     : Nat;
    highestScore     : Nat;
    watchlistHits    : Nat;
    truthGapEscalations: Nat;
    operatorOverrides: Nat;
  };

  /// ScheduleSlot — one dispatch decision
  public type ScheduleSlot = {
    slotId       : Text;
    epochId      : Nat;
    pulseTaskId  : Text;
    pulseType    : Text;
    targetOrgan  : Text;
    effectiveScore: Nat;         // computed score at dispatch time
    priorityClass: Text;         // "Critical" | "High" | "Normal" | "Low"
    salience     : Nat;
    urgency      : Nat;
    riskScore    : Nat;
    watchlistBoosted: Bool;
    truthGapBoosted : Bool;
    starvationBoosted: Bool;
    result       : SlotResult;
    dispatchedAt : Int;
    completedAt  : ?Int;
    workerRef    : ?Text;        // assigned worker ID from synapse_field
  };

  /// WatchlistEntry — operator-defined scheduling override
  public type WatchlistEntry = {
    id           : Text;
    entryLabel   : Text;
    targetOrgan  : ?Text;        // null = matches any organ
    targetPulseType: ?Text;      // null = matches any pulse type
    priority     : WatchlistPriority;
    boostAmount  : Nat;          // 0–200, used for #Elevate
    reason       : Text;
    addedBy      : ?Principal;
    addedAt      : Int;
    expiresAt    : ?Int;         // null = permanent
    active       : Bool;
  };

  /// TruthGapEntry — an unresolved RuntimeTruth gap that raises urgency
  public type TruthGapEntry = {
    id           : Text;
    relatedTraceId: Text;
    description  : Text;
    severity     : TruthGapSeverity;
    targetOrgan  : Text;
    targetPulseType: Text;
    pressureBoost: Nat;          // added to urgency/salience for matching pulses
    openedAt     : Int;
    resolvedAt   : ?Int;
    resolved     : Bool;
  };

  /// DispatchRecord — logged result of a slot execution
  public type DispatchRecord = {
    recordId     : Text;
    epochId      : Nat;
    slotId       : Text;
    pulseTaskId  : Text;
    result       : SlotResult;
    workerRef    : ?Text;
    recordedAt   : Int;
  };

  /// SchedulerConfig — tunable cadence and scoring parameters
  public type SchedulerConfig = {
    heartbeatIntervalNs     : Nat;   // nanoseconds between epochs (~24h default)
    maxSlotsPerEpoch        : Nat;   // cap on dispatches per tick (default 50)
    starvationThresholdEpochs: Nat;  // epochs before a low-prio task is force-run
    watchlistBoostCap       : Nat;   // max effective boost from watchlist (default 200)
    truthGapBoostCap        : Nat;   // max effective boost from truth gaps (default 150)
    criticalPriorityScore   : Nat;   // base score for #Critical (default 1000)
    highPriorityScore       : Nat;   // base score for #High     (default 500)
    normalPriorityScore     : Nat;   // base score for #Normal   (default 100)
    lowPriorityScore        : Nat;   // base score for #Low      (default 0)
    schedulerVersion        : Nat;
  };

  /// DispatchPlan — the ranked list returned each epoch
  public type DispatchPlan = {
    epochId      : Nat;
    slots        : [DispatchSlotSpec];
    generatedAt  : Int;
    totalQueued  : Nat;
    totalCapped  : Bool;         // true if queue > maxSlotsPerEpoch
  };

  /// DispatchSlotSpec — one entry in the dispatch plan
  public type DispatchSlotSpec = {
    slotId       : Text;
    rank         : Nat;
    pulseTaskId  : Text;
    pulseType    : Text;
    targetOrgan  : Text;
    effectiveScore: Nat;
    watchlistBoosted : Bool;
    truthGapBoosted  : Bool;
    starvationBoosted: Bool;
    pinned       : Bool;
  };

  /// Simplified pulse task view needed by the scheduler
  /// (caller passes this in — scheduler doesn't query pulse canister directly)
  public type PulseTaskRef = {
    id           : Text;
    pulseType    : Text;
    targetOrgan  : Text;
    priority     : Text;         // "Low" | "Normal" | "High" | "Critical"
    salience     : Nat;
    urgency      : Nat;
    riskScore    : Nat;
    createdAt    : Int;
    epochsWaited : Nat;          // caller tracks how many epochs this has been queued
  };

  // ══════════════════════════════════════════════════════════════════
  //  DEFAULTS
  // ══════════════════════════════════════════════════════════════════

  func nextId(prefix : Text) : Text {
    idCounter += 1;
    prefix # "-" # Int.toText(Time.now()) # "-" # Nat.toText(idCounter)
  };

  func clamp100(n : Nat) : Nat { if (n > 100) 100 else n };

  func priorityBase(p : Text) : Nat {
    if      (p == "Critical") config.criticalPriorityScore
    else if (p == "High")     config.highPriorityScore
    else if (p == "Normal")   config.normalPriorityScore
    else                      config.lowPriorityScore
  };

  /// Compute watchlist boost for a given task ref
  func watchlistBoost(ref : PulseTaskRef) : (Nat, Bool, Bool) {
    var totalBoost : Nat = 0;
    var elevated   = false;
    var pinned     = false;
    let now = Time.now();

    for (entry in watchlist.vals()) {
      if (not entry.active) {
        // entry is inactive — skip all match checks below
      } else {
      // Check expiry
      let expired = switch (entry.expiresAt) {
        case null false;
        case (?exp) now > exp;
      };
      if (not expired) {
        let organMatch = switch (entry.targetOrgan) {
          case null true;
          case (?o) o == ref.targetOrgan;
        };
        let typeMatch = switch (entry.targetPulseType) {
          case null true;
          case (?t) t == ref.pulseType;
        };
        if (organMatch and typeMatch) {
          switch (entry.priority) {
            case (#Elevate) {
              let boost = Nat.min(entry.boostAmount, config.watchlistBoostCap);
              totalBoost += boost;
              elevated := true;
            };
            case (#Pin) {
              pinned := true;
              elevated := true;
            };
            case (#Suppress) {};
          };
        };
      };
      }; // end else (entry.active)
    };
    (totalBoost, elevated, pinned)
  };

  /// Compute truth gap pressure for a given task ref
  func truthGapBoost(ref : PulseTaskRef) : (Nat, Bool) {
    var totalBoost : Nat = 0;
    var boosted = false;
    for (gap in truthGaps.vals()) {
      if (not gap.resolved and gap.targetOrgan == ref.targetOrgan) {
        let boost = Nat.min(gap.pressureBoost, config.truthGapBoostCap);
        totalBoost += boost;
        boosted := true;
      };
    };
    (totalBoost, boosted)
  };

  /// Compute effective scheduling score for a pulse task ref
  func effectiveScore(ref : PulseTaskRef) : (Nat, Bool, Bool, Bool, Bool) {
    let base  = priorityBase(ref.priority);
    let (wBoost, wElevated, wPinned) = watchlistBoost(ref);
    let (tBoost, tBoosted) = truthGapBoost(ref);

    // Starvation: if waiting too long, force a large boost
    let starvationBoosted = ref.epochsWaited >= config.starvationThresholdEpochs;
    let starvationBoost   = if (starvationBoosted) config.criticalPriorityScore else 0;

    let score = base
      + clamp100(ref.salience)
      + clamp100(ref.urgency)
      + clamp100(ref.riskScore)
      + wBoost
      + tBoost
      + starvationBoost;

    (score, wElevated, tBoosted, starvationBoosted, wPinned)
  };

  // ══════════════════════════════════════════════════════════════════
  //  EPOCH MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// openEpoch — begin a new scheduling epoch (heartbeat tick)
  public shared func openEpoch() : async Nat {
    currentEpoch += 1;
    let epoch : EpochRecord = {
      epochId             = currentEpoch;
      startedAt           = Time.now();
      completedAt         = null;
      slotsDispatched     = 0;
      slotsSkipped        = 0;
      slotsStarved        = 0;
      highestScore        = 0;
      watchlistHits       = 0;
      truthGapEscalations = 0;
      operatorOverrides   = 0;
    };
    epochHistory := Array.append(epochHistory, [epoch]);
    currentEpoch
  };

  /// closeEpoch — seal the epoch with final counts
  public shared func closeEpoch(
    epochId         : Nat,
    dispatched      : Nat,
    skipped         : Nat,
    starved         : Nat,
    highestScore    : Nat,
    watchlistHits   : Nat,
    truthGapEscs    : Nat,
    opOverrides     : Nat,
  ) : async Result.Result<(), Text> {
    var found = false;
    epochHistory := Array.map<EpochRecord, EpochRecord>(epochHistory, func(e) {
      if (e.epochId == epochId and Option.isNull(e.completedAt)) {
        found := true;
        {
          epochId             = e.epochId;
          startedAt           = e.startedAt;
          completedAt         = ?Time.now();
          slotsDispatched     = dispatched;
          slotsSkipped        = skipped;
          slotsStarved        = starved;
          highestScore        = highestScore;
          watchlistHits       = watchlistHits;
          truthGapEscalations = truthGapEscs;
          operatorOverrides   = opOverrides;
        }
      } else { e }
    });
    if (not found) return #err("epochId not found or already closed");
    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  DISPATCH PLAN — Core Scheduling Logic
  // ══════════════════════════════════════════════════════════════════

  /// generateDispatchPlan — the main scheduler output
  ///
  /// Caller passes all currently-queued pulse tasks.
  /// Scheduler returns a ranked DispatchPlan for this epoch.
  ///
  /// This is the organism's "arbitration gate" — not random, doctrine-driven.
  public shared func generateDispatchPlan(refs : [PulseTaskRef]) : async DispatchPlan {
    let epochId = currentEpoch;

    // Score every ref
    type ScoredRef = {
      ref   : PulseTaskRef;
      score : Nat;
      wElevated : Bool;
      tBoosted  : Bool;
      starved   : Bool;
      pinned    : Bool;
    };

    let scored : [ScoredRef] = Array.map<PulseTaskRef, ScoredRef>(refs, func(r) {
      let (s, we, tb, st, pi) = effectiveScore(r);
      { ref = r; score = s; wElevated = we; tBoosted = tb; starved = st; pinned = pi }
    });

    // Filter out suppressed
    let live = Array.filter<ScoredRef>(scored, func(sr) {
      var suppressed = false;
      let now = Time.now();
      for (entry in watchlist.vals()) {
        if (entry.active) {
          let expired = switch (entry.expiresAt) {
            case null false;
            case (?exp) now > exp;
          };
          if (not expired) {
            let om = switch (entry.targetOrgan) {
              case null true; case (?o) o == sr.ref.targetOrgan;
            };
            let pm = switch (entry.targetPulseType) {
              case null true; case (?t) t == sr.ref.pulseType;
            };
            if (om and pm and entry.priority == #Suppress) {
              suppressed := true;
            };
          };
        };
      };
      not suppressed
    });

    // Separate pinned from scored
    let pinned  = Array.filter<ScoredRef>(live, func(sr) { sr.pinned });
    let regular = Array.filter<ScoredRef>(live, func(sr) { not sr.pinned });

    // Sort regular by descending score (insertion sort — stable, predictable)
    let sorted = Array.sort<ScoredRef>(regular, func(a, b) {
      if (a.score > b.score) #less
      else if (a.score < b.score) #greater
      else #equal
    });

    // Merge: pinned first, then sorted regular, capped at maxSlotsPerEpoch
    let combined = Array.append(pinned, sorted);
    let cap      = config.maxSlotsPerEpoch;
    let capped   = combined.size() > cap;
    let selected = if (capped) {
      Array.tabulate<ScoredRef>(cap, func(i) { combined[i] })
    } else { combined };

    // Build slot specs
    var rank : Nat = 0;
    let slots = Array.map<ScoredRef, DispatchSlotSpec>(selected, func(sr) {
      rank += 1;
      {
        slotId           = nextId("slot");
        rank             = rank;
        pulseTaskId      = sr.ref.id;
        pulseType        = sr.ref.pulseType;
        targetOrgan      = sr.ref.targetOrgan;
        effectiveScore   = sr.score;
        watchlistBoosted = sr.wElevated;
        truthGapBoosted  = sr.tBoosted;
        starvationBoosted= sr.starved;
        pinned           = sr.pinned;
      }
    });

    {
      epochId     = epochId;
      slots       = slots;
      generatedAt = Time.now();
      totalQueued = refs.size();
      totalCapped = capped;
    }
  };

  /// recordDispatch — log the result of executing a slot
  public shared func recordDispatch(
    epochId     : Nat,
    slotId      : Text,
    pulseTaskId : Text,
    result      : SlotResult,
    workerRef   : ?Text,
  ) : async Text {
    let id = nextId("disp");
    let rec : DispatchRecord = {
      recordId    = id;
      epochId     = epochId;
      slotId      = slotId;
      pulseTaskId = pulseTaskId;
      result      = result;
      workerRef   = workerRef;
      recordedAt  = Time.now();
    };
    dispatchLog := Array.append(dispatchLog, [rec]);
    id
  };

  // ══════════════════════════════════════════════════════════════════
  //  WATCHLIST MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  public type WatchlistInput = {
    entryLabel     : Text;
    targetOrgan    : ?Text;
    targetPulseType: ?Text;
    priority       : WatchlistPriority;
    boostAmount    : Nat;
    reason         : Text;
    expiresAt      : ?Int;
  };

  public shared(msg) func addWatchlistEntry(input : WatchlistInput) : async Result.Result<Text, Text> {
    if (Text.size(input.entryLabel) == 0) return #err("entryLabel required");
    if (Text.size(input.reason)     == 0) return #err("reason required");
    let id = nextId("watch");
    let entry : WatchlistEntry = {
      id             = id;
      entryLabel     = input.entryLabel;
      targetOrgan    = input.targetOrgan;
      targetPulseType= input.targetPulseType;
      priority       = input.priority;
      boostAmount    = Nat.min(input.boostAmount, config.watchlistBoostCap);
      reason         = input.reason;
      addedBy        = ?msg.caller;
      addedAt        = Time.now();
      expiresAt      = input.expiresAt;
      active         = true;
    };
    watchlist := Array.append(watchlist, [entry]);
    #ok(id)
  };

  public shared func removeWatchlistEntry(entryId : Text) : async Result.Result<(), Text> {
    var found = false;
    watchlist := Array.map<WatchlistEntry, WatchlistEntry>(watchlist, func(e) {
      if (e.id == entryId) {
        found := true;
        { id = e.id; entryLabel = e.entryLabel; targetOrgan = e.targetOrgan;
          targetPulseType = e.targetPulseType; priority = e.priority;
          boostAmount = e.boostAmount; reason = e.reason; addedBy = e.addedBy;
          addedAt = e.addedAt; expiresAt = e.expiresAt; active = false }
      } else { e }
    });
    if (not found) return #err("entryId not found");
    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  TRUTH GAP MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  public type TruthGapInput = {
    relatedTraceId : Text;
    description    : Text;
    severity       : TruthGapSeverity;
    targetOrgan    : Text;
    targetPulseType: Text;
    pressureBoost  : Nat;
  };

  public shared func openTruthGap(input : TruthGapInput) : async Result.Result<Text, Text> {
    if (Text.size(input.relatedTraceId) == 0) return #err("relatedTraceId required");
    if (Text.size(input.targetOrgan)    == 0) return #err("targetOrgan required");
    let id = nextId("gap");
    let gap : TruthGapEntry = {
      id              = id;
      relatedTraceId  = input.relatedTraceId;
      description     = input.description;
      severity        = input.severity;
      targetOrgan     = input.targetOrgan;
      targetPulseType = input.targetPulseType;
      pressureBoost   = Nat.min(input.pressureBoost, config.truthGapBoostCap);
      openedAt        = Time.now();
      resolvedAt      = null;
      resolved        = false;
    };
    truthGaps := Array.append(truthGaps, [gap]);
    #ok(id)
  };

  public shared func resolveTruthGap(gapId : Text) : async Result.Result<(), Text> {
    var found = false;
    truthGaps := Array.map<TruthGapEntry, TruthGapEntry>(truthGaps, func(g) {
      if (g.id == gapId and not g.resolved) {
        found := true;
        { id = g.id; relatedTraceId = g.relatedTraceId; description = g.description;
          severity = g.severity; targetOrgan = g.targetOrgan;
          targetPulseType = g.targetPulseType; pressureBoost = g.pressureBoost;
          openedAt = g.openedAt; resolvedAt = ?Time.now(); resolved = true }
      } else { g }
    });
    if (not found) return #err("gapId not found or already resolved");
    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  CONFIG
  // ══════════════════════════════════════════════════════════════════

  public type ConfigPatch = {
    heartbeatIntervalNs      : ?Nat;
    maxSlotsPerEpoch         : ?Nat;
    starvationThresholdEpochs: ?Nat;
    watchlistBoostCap        : ?Nat;
    truthGapBoostCap         : ?Nat;
    criticalPriorityScore    : ?Nat;
    highPriorityScore        : ?Nat;
    normalPriorityScore      : ?Nat;
    lowPriorityScore         : ?Nat;
  };

  public shared func updateConfig(patch : ConfigPatch) : async () {
    config := {
      heartbeatIntervalNs      = Option.get(patch.heartbeatIntervalNs,       config.heartbeatIntervalNs);
      maxSlotsPerEpoch         = Option.get(patch.maxSlotsPerEpoch,          config.maxSlotsPerEpoch);
      starvationThresholdEpochs= Option.get(patch.starvationThresholdEpochs, config.starvationThresholdEpochs);
      watchlistBoostCap        = Option.get(patch.watchlistBoostCap,         config.watchlistBoostCap);
      truthGapBoostCap         = Option.get(patch.truthGapBoostCap,          config.truthGapBoostCap);
      criticalPriorityScore    = Option.get(patch.criticalPriorityScore,     config.criticalPriorityScore);
      highPriorityScore        = Option.get(patch.highPriorityScore,         config.highPriorityScore);
      normalPriorityScore      = Option.get(patch.normalPriorityScore,       config.normalPriorityScore);
      lowPriorityScore         = Option.get(patch.lowPriorityScore,          config.lowPriorityScore);
      schedulerVersion         = config.schedulerVersion + 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY METHODS
  // ══════════════════════════════════════════════════════════════════

  public query func getCurrentEpoch() : async Nat { currentEpoch };

  public query func getConfig() : async SchedulerConfig { config };

  public query func getEpochRecord(epochId : Nat) : async ?EpochRecord {
    Array.find<EpochRecord>(epochHistory, func(e) { e.epochId == epochId })
  };

  public query func getRecentEpochs(count : Nat) : async [EpochRecord] {
    let n = epochHistory.size();
    if (n == 0 or count == 0) return [];
    let start = if (count >= n) 0 else n - count;
    Array.tabulate<EpochRecord>(n - start, func(i) { epochHistory[start + i] })
  };

  public query func getWatchlist(activeOnly : Bool) : async [WatchlistEntry] {
    if (activeOnly) Array.filter<WatchlistEntry>(watchlist, func(e) { e.active })
    else watchlist
  };

  public query func getOpenTruthGaps() : async [TruthGapEntry] {
    Array.filter<TruthGapEntry>(truthGaps, func(g) { not g.resolved })
  };

  public query func getDispatchLog(epochId : ?Nat) : async [DispatchRecord] {
    switch (epochId) {
      case null dispatchLog;
      case (?eid) Array.filter<DispatchRecord>(dispatchLog, func(d) { d.epochId == eid });
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  SCHEDULER HEALTH
  // ══════════════════════════════════════════════════════════════════

  public type SchedulerHealth = {
    currentEpoch        : Nat;
    openTruthGaps       : Nat;
    activeWatchlistRules: Nat;
    totalDispatchLog    : Nat;
    totalEpochs         : Nat;
    lastEpochAt         : ?Int;
    configVersion       : Nat;
    maxSlotsPerEpoch    : Nat;
    schemaVersion       : Nat;
  };

  public query func getSchedulerHealth() : async SchedulerHealth {
    let openGaps  = Array.filter<TruthGapEntry>(truthGaps,   func(g) { not g.resolved }).size();
    let activeW   = Array.filter<WatchlistEntry>(watchlist,  func(e) { e.active        }).size();
    let lastAt    = if (epochHistory.size() == 0) null
                   else ?(epochHistory[epochHistory.size() - 1].startedAt);
    {
      currentEpoch         = currentEpoch;
      openTruthGaps        = openGaps;
      activeWatchlistRules = activeW;
      totalDispatchLog     = dispatchLog.size();
      totalEpochs          = epochHistory.size();
      lastEpochAt          = lastAt;
      configVersion        = config.schedulerVersion;
      maxSlotsPerEpoch     = config.maxSlotsPerEpoch;
      schemaVersion        = schemaVersion;
    }
  };

}
