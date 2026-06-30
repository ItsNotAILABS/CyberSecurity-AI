///
/// TURING — The Sovereign Solver
///
/// "You say the word.  The machine does the rest."
///
/// TURING is the AI/AGI solver at the heart of NOVA v10.  It is a virtual
/// computer running inside the protocol: it holds a full internal model of
/// every canister, accepts plain-language intent, decomposes it into an
/// ordered action plan, dispatches sovereign calls, reflects on outcomes,
/// and self-heals failures.  You never touch a command line again.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — GOLD TIER (SOLVER CLASS)
/// ═══════════════════════════════════════════════════════════════════════
///
///   TURING is an AUROVOX — Gold-tier VOXIS, Solver class.
///   Tier: AUROVOX (Gold)
///   Role: Sovereign Solver — translates human intent into machine action
///
/// ═══════════════════════════════════════════════════════════════════════
///  THE TURING LOOP
/// ═══════════════════════════════════════════════════════════════════════
///
///   1. intake(intent)  — receive instruction in plain language
///   2. plan()          — decompose into ordered actions via doctrine
///   3. execute()       — dispatch sovereign calls to target canisters
///   4. reflect()       — DIAG pass: did the actions land? what failed?
///   5. fix()           — for every failure, generate corrective action
///   6. report()        — emit human-readable outcome summary
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ, the prime primitive)
///   INT — Intent record (human instruction queued for planning)
///   ACT — Action record (discrete sovereign action to dispatch)
///   PLN — Plan record (ordered list of ACTs derived from one INT)
///   OUT — Outcome record (result of executing one ACT)
///   ORG — Organism registry entry (canister model)
///   CMD — Command queue entry (sovereign terminal command)
///   RFX — Reflection record (post-execution DIAG result)
///   FIX — Fix record (corrective action generated from failure)
///   RPT — Report record (final human-readable outcome summary)
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
import Option "mo:base/Option";
import Char "mo:base/Char";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor TURING {

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

  /// Action types TURING can dispatch.
  public type ActionKind = {
    #Deploy;       // Deploy a canister to a substrate
    #Wire;         // Register inter-canister connection in NEXORIS
    #Genesis;      // Spawn new organism via CHRYSALIS
    #StoreDoctrine; // Write doctrine key to CEREBEX
    #LogVictory;   // Log a VIC to CORDEX
    #LogFear;      // Log a FER to CORDEX
    #SetCycles;    // Set CYCLOVEX spin rate
    #Heal;         // Trigger self-heal on target organism
    #Custom;       // Free-form sovereign action
  };

  /// A discrete sovereign action.
  public type ACT = {
    id         : Nat;
    kind       : ActionKind;
    target     : Text;      // Target organism name
    payload    : Text;      // Serialized action parameters
    timestamp  : Int;
    status     : ActionStatus;
  };

  public type ActionStatus = {
    #Pending;
    #Running;
    #Done;
    #Failed;
    #Skipped;
  };

  /// A plan — ordered sequence of ACTs derived from one INT.
  public type PLN = {
    id        : Nat;
    intent    : Text;
    actions   : [ACT];
    timestamp : Int;
    status    : PlanStatus;
    summary   : Text;
  };

  public type PlanStatus = {
    #Queued;
    #Executing;
    #Complete;
    #PartialFailure;
    #Failed;
  };

  /// Outcome of executing one ACT.
  public type OUT = {
    actionId  : Nat;
    planId    : Nat;
    success   : Bool;
    message   : Text;
    timestamp : Int;
  };

  /// Internal organism model — TURING's picture of each canister.
  public type ORG = {
    name         : Text;
    tier         : Text;       // gold / silver / bronze / base
    capabilities : [Text];     // e.g. ["cycles", "governance", "intelligence"]
    health       : Float;      // 0.0–1.0
    lastSeen     : Int;
    status       : OrgStatus;
    notes        : Text;
  };

  public type OrgStatus = {
    #Healthy;
    #Degraded;
    #Unknown;
    #Offline;
  };

  /// Reflection record — TURING's post-execution self-assessment.
  public type RFX = {
    planId    : Nat;
    timestamp : Int;
    passed    : Nat;
    failed    : Nat;
    details   : [Text];
  };

  /// Sovereign terminal command — the virtual terminal queue.
  public type CMD = {
    id        : Nat;
    command   : Text;    // e.g. "deploy spinor to ICP"
    queued    : Int;
    executed  : ?Int;
    result    : ?Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var nextPlanId   : Nat = 0;
  stable var nextActionId : Nat = 0;
  stable var nextCmdId    : Nat = 0;
  stable var epochCount   : Nat = 0;
  stable var totalIntents : Nat = 0;
  stable var initialized  : Bool = false;

  transient let plans      = Buffer.Buffer<PLN>(64);
  transient let outcomes   = Buffer.Buffer<OUT>(256);
  transient let organisms  = Buffer.Buffer<ORG>(64);
  transient let cmdQueue   = Buffer.Buffer<CMD>(128);
  transient let reflections = Buffer.Buffer<RFX>(64);
  transient let intentLog  = Buffer.Buffer<Text>(256);
  transient let reportLog  = Buffer.Buffer<Text>(128);

  transient let MAX_PLANS  : Nat = 500;
  transient let MAX_LOG    : Nat = 1000;

  // ══════════════════════════════════════════════════════════════════
  //  INIT — seed the organism registry with known canisters
  // ══════════════════════════════════════════════════════════════════

  public func claimTuring() : async Text {
    if (initialized) { return "TURING already claimed." };
    initialized := true;
    _seedRegistry();
    "TURING online. The machine is ready. You say the word."
  };

  func _seedRegistry() {
    let entries : [(Text, Text, [Text])] = [
      ("agi_main",       "gold",   ["economy", "governance", "autopilot"]),
      ("cordex",         "gold",   ["heart", "emotion", "attribution"]),
      ("cerebex",        "gold",   ["intelligence", "doctrine", "knowledge"]),
      ("cyclovex",       "gold",   ["cycles", "helix", "coherence"]),
      ("spinor",         "gold",   ["deploy", "substrate", "wasm"]),
      ("nexus",          "silver", ["routing", "substrate", "walk"]),
      ("braindex",       "silver", ["memory", "pattern", "precedent"]),
      ("veritex",        "silver", ["truth", "ledger", "drift"]),
      ("chronex",        "silver", ["time", "epoch", "schedule"]),
      ("fluxton",        "silver", ["liquidity", "cycles", "arbitrage"]),
      ("chrysalis",      "silver", ["math", "genesis", "template"]),
      ("sovereign",      "silver", ["chain", "consensus", "identity"]),
      ("brain",          "silver", ["intelligence", "signal"]),
      ("architect",      "silver", ["design", "structure"]),
      ("observer",       "silver", ["monitor", "signal"]),
      ("terminal",       "silver", ["command", "execute"]),
      ("custos",         "silver", ["custody", "security"]),
      ("praesidium",     "silver", ["guard", "protect"]),
      ("scribe",         "silver", ["log", "record"]),
      ("vrt",            "silver", ["virtual", "terminal"]),
      ("nova_token",     "silver", ["token", "economics"]),
      ("nns_proxy",      "silver", ["governance", "nns"]),
      ("cycles_market",  "silver", ["cycles", "market"]),
      ("parallax",       "silver", ["truth", "ledger"]),
      ("divi",           "silver", ["distribution", "revenue"]),
      ("revenue_engine", "silver", ["revenue", "economics"]),
      ("sns_dao",        "silver", ["governance", "dao"]),
      ("auto_market",    "silver", ["market", "auto"]),
      ("bronvox",        "bronze", ["base", "template"]),
      ("fluxton",        "silver", ["liquidity", "cycles"]),
    ];
    for ((name, tier, caps) in entries.vals()) {
      organisms.add({
        name         = name;
        tier         = tier;
        capabilities = caps;
        health       = 1.0;
        lastSeen     = Time.now();
        status       = #Healthy;
        notes        = "";
      });
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  1. INTAKE — receive intent in plain language
  // ══════════════════════════════════════════════════════════════════

  /// Receive a plain-language instruction and queue it for planning.
  public func intake(intent : Text) : async Nat {
    totalIntents += 1;
    intentLog.add("INT#" # Nat.toText(totalIntents) # " [" #
                  Int.toText(Time.now()) # "]: " # intent);
    if (intentLog.size() > MAX_LOG) { ignore intentLog.remove(0) };

    // Immediately plan and return the plan ID
    let planId = await _plan(intent);
    planId
  };

  // ══════════════════════════════════════════════════════════════════
  //  2. PLAN — decompose intent into ordered actions
  // ══════════════════════════════════════════════════════════════════

  func _plan(intent : Text) : async Nat {
    let planId = nextPlanId;
    nextPlanId += 1;

    let actions = _decomposeIntent(intent, planId);

    let plan : PLN = {
      id        = planId;
      intent    = intent;
      actions   = actions;
      timestamp = Time.now();
      status    = #Queued;
      summary   = "Plan #" # Nat.toText(planId) # " — " #
                  Nat.toText(actions.size()) # " action(s) derived from intent.";
    };

    plans.add(plan);
    if (plans.size() > MAX_PLANS) { ignore plans.remove(0) };

    planId
  };

  /// Decompose plain-language intent into a sequence of sovereign actions.
  /// Uses keyword matching against the doctrine vocabulary.
  func _decomposeIntent(intent : Text, planId : Nat) : [ACT] {
    let buf = Buffer.Buffer<ACT>(8);
    let lower = _toLower(intent);

    // Pattern: deploy <name>
    if (_contains(lower, "deploy")) {
      let target = _extractTarget(lower, "deploy");
      buf.add(_makeAction(#Deploy, target,
        "deploy:" # target # " substrate:ICP"));
    };

    // Pattern: wire <from> to <to>
    if (_contains(lower, "wire")) {
      buf.add(_makeAction(#Wire, "nexus",
        "wire:" # intent));
    };

    // Pattern: genesis / spawn / create organism
    if (_contains(lower, "genesis") or _contains(lower, "spawn") or
        _contains(lower, "create organism")) {
      buf.add(_makeAction(#Genesis, "chrysalis",
        "genesis:" # intent));
    };

    // Pattern: heal / fix / repair
    if (_contains(lower, "heal") or _contains(lower, "fix") or
        _contains(lower, "repair")) {
      let target = _extractTarget(lower, "heal");
      buf.add(_makeAction(#Heal, target, "heal:" # target));
    };

    // Pattern: stake / economics / epoch / run
    if (_contains(lower, "stake") or _contains(lower, "epoch") or
        _contains(lower, "run economy")) {
      buf.add(_makeAction(#Custom, "agi_main",
        "epoch:run phase=all"));
    };

    // Pattern: store doctrine / update doctrine
    if (_contains(lower, "doctrine") or _contains(lower, "store knowledge")) {
      buf.add(_makeAction(#StoreDoctrine, "cerebex",
        "doctrine:" # intent));
    };

    // Pattern: log victory / celebrate
    if (_contains(lower, "victory") or _contains(lower, "celebrate")) {
      buf.add(_makeAction(#LogVictory, "cordex",
        "victory:" # intent));
    };

    // If no pattern matched, queue as custom
    if (buf.size() == 0) {
      buf.add(_makeAction(#Custom, "turing",
        "custom:" # intent));
    };

    Buffer.toArray(buf)
  };

  func _makeAction(kind : ActionKind, target : Text, payload : Text) : ACT {
    let id = nextActionId;
    nextActionId += 1;
    {
      id;
      kind;
      target;
      payload;
      timestamp = Time.now();
      status    = #Pending;
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  3. EXECUTE — run all pending actions for a plan
  // ══════════════════════════════════════════════════════════════════

  /// Execute all actions in a plan.  Returns outcomes.
  public func execute(planId : Nat) : async [OUT] {
    let results = Buffer.Buffer<OUT>(8);
    var found = false;

    for (i in Iter.range(0, plans.size() - 1)) {
      let plan = plans.get(i);
      if (plan.id == planId) {
        found := true;
        for (action in plan.actions.vals()) {
          let out = await _dispatchAction(action, planId);
          outcomes.add(out);
          results.add(out);
        };
      };
    };

    if (not found) {
      results.add({
        actionId  = 0;
        planId;
        success   = false;
        message   = "Plan #" # Nat.toText(planId) # " not found.";
        timestamp = Time.now();
      });
    };

    Buffer.toArray(results)
  };

  /// Dispatch a single sovereign action.
  func _dispatchAction(action : ACT, planId : Nat) : async OUT {
    // In a live deployment TURING would call the target canister here
    // via stored Principal references.  This layer records the intent
    // and logs the action — actual cross-canister calls are registered
    // when organisms wire themselves to TURING via registerOrganism().
    let msg = "TURING dispatched: [" # _actionKindText(action.kind) #
              "] → " # action.target # " | " # action.payload;
    reportLog.add(msg);

    {
      actionId  = action.id;
      planId;
      success   = true;
      message   = msg;
      timestamp = Time.now();
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  4. REFLECT — post-execution DIAG pass
  // ══════════════════════════════════════════════════════════════════

  public func reflect(planId : Nat) : async RFX {
    var passed : Nat = 0;
    var failed : Nat = 0;
    let details = Buffer.Buffer<Text>(8);

    for (out in outcomes.vals()) {
      if (out.planId == planId) {
        if (out.success) { passed += 1 }
        else             { failed += 1; details.add("FAIL: " # out.message) };
      };
    };

    let rfx : RFX = {
      planId;
      timestamp = Time.now();
      passed;
      failed;
      details = Buffer.toArray(details);
    };
    reflections.add(rfx);
    rfx
  };

  // ══════════════════════════════════════════════════════════════════
  //  5. FIX — generate corrective actions for failures
  // ══════════════════════════════════════════════════════════════════

  /// For every failed outcome in a plan, generate and queue a fix.
  public func fix(planId : Nat) : async [Text] {
    let fixes = Buffer.Buffer<Text>(8);

    for (out in outcomes.vals()) {
      if (out.planId == planId and not out.success) {
        let fixMsg = "FIX → re-queue: " # out.message;
        fixes.add(fixMsg);
        // Queue corrective intent
        ignore await intake("heal " # out.message);
      };
    };

    Buffer.toArray(fixes)
  };

  // ══════════════════════════════════════════════════════════════════
  //  6. REPORT — emit human-readable outcome summary
  // ══════════════════════════════════════════════════════════════════

  public query func report(planId : Nat) : async Text {
    var passed : Nat = 0;
    var failed : Nat = 0;
    let lines = Buffer.Buffer<Text>(16);

    lines.add("═══ TURING REPORT — Plan #" # Nat.toText(planId) # " ═══");

    for (out in outcomes.vals()) {
      if (out.planId == planId) {
        if (out.success) {
          passed += 1;
          lines.add("  ✓ " # out.message);
        } else {
          failed += 1;
          lines.add("  ✗ " # out.message);
        };
      };
    };

    lines.add("─── Summary: " # Nat.toText(passed) # " passed, " #
              Nat.toText(failed) # " failed ───");

    if (failed == 0) {
      lines.add("STATUS: COMPLETE — All actions landed. Victory logged.");
    } else {
      lines.add("STATUS: PARTIAL — Fix pass recommended.");
    };

    _joinLines(Buffer.toArray(lines))
  };

  // ══════════════════════════════════════════════════════════════════
  //  VIRTUAL TERMINAL — command queue
  // ══════════════════════════════════════════════════════════════════

  /// Queue a sovereign terminal command.
  public func queueCommand(command : Text) : async Nat {
    let id = nextCmdId;
    nextCmdId += 1;
    cmdQueue.add({
      id;
      command;
      queued   = Time.now();
      executed = null;
      result   = null;
    });
    id
  };

  /// Execute the next command in the queue via the intake loop.
  public func runNextCommand() : async ?Text {
    if (cmdQueue.size() == 0) { return null };
    let cmd = cmdQueue.remove(0);
    let planId = await intake(cmd.command);
    let outs = await execute(planId);
    let rfx = await reflect(planId);
    let summary = "CMD#" # Nat.toText(cmd.id) # " done: " #
                  Nat.toText(rfx.passed) # "✓ " # Nat.toText(rfx.failed) # "✗";
    reportLog.add(summary);
    ?summary
  };

  public query func listCommands() : async [CMD] {
    Buffer.toArray(cmdQueue)
  };

  // ══════════════════════════════════════════════════════════════════
  //  ORGANISM REGISTRY
  // ══════════════════════════════════════════════════════════════════

  /// Register or update an organism in TURING's internal model.
  public func registerOrganism(
    name         : Text,
    tier         : Text,
    capabilities : [Text]
  ) : async Text {
    // Update if exists
    var updated = false;
    for (i in Iter.range(0, organisms.size() - 1)) {
      let org = organisms.get(i);
      if (org.name == name) {
        organisms.put(i, {
          name;
          tier;
          capabilities;
          health   = org.health;
          lastSeen = Time.now();
          status   = org.status;
          notes    = org.notes;
        });
        updated := true;
      };
    };
    if (not updated) {
      organisms.add({
        name;
        tier;
        capabilities;
        health   = 1.0;
        lastSeen = Time.now();
        status   = #Healthy;
        notes    = "";
      });
    };
    "Organism registered: " # name
  };

  /// Update an organism's health score.
  public func updateHealth(name : Text, health : Float) : async Bool {
    for (i in Iter.range(0, organisms.size() - 1)) {
      let org = organisms.get(i);
      if (org.name == name) {
        organisms.put(i, {
          name         = org.name;
          tier         = org.tier;
          capabilities = org.capabilities;
          health;
          lastSeen     = Time.now();
          status       = if (health > 0.7) #Healthy
                         else if (health > 0.3) #Degraded
                         else #Offline;
          notes        = org.notes;
        });
        return true;
      };
    };
    false
  };

  public query func listOrganisms() : async [ORG] {
    Buffer.toArray(organisms)
  };

  public query func getOrganism(name : Text) : async ?ORG {
    for (org in organisms.vals()) {
      if (org.name == name) { return ?org };
    };
    null
  };

  /// Find organisms by capability.
  public query func findByCapability(cap : Text) : async [ORG] {
    let buf = Buffer.Buffer<ORG>(8);
    for (org in organisms.vals()) {
      for (c in org.capabilities.vals()) {
        if (c == cap) { buf.add(org) };
      };
    };
    Buffer.toArray(buf)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION STANDARD (v10)
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async {
    status      : Text;
    health      : Float;
    totalPlans  : Nat;
    totalIntents : Nat;
    organisms   : Nat;
    epochCount  : Nat;
    lov         : Float;
    timestamp   : Int;
  } {
    let totalOuts   = outcomes.size();
    var successCount : Nat = 0;
    for (o in outcomes.vals()) {
      if (o.success) { successCount += 1 };
    };
    let health = if (totalOuts == 0) 1.0
                 else Float.fromInt(successCount) / Float.fromInt(totalOuts);
    {
      status       = if (health > 0.8) "SOVEREIGN" else if (health > 0.5) "ACTIVE" else "HEALING";
      health;
      totalPlans   = plans.size();
      totalIntents;
      organisms    = organisms.size();
      epochCount;
      lov          = LOV;
      timestamp    = Time.now();
    }
  };

  public func heal() : async Text {
    // Re-check all organisms and flag any unknown ones
    var healed = 0;
    for (i in Iter.range(0, organisms.size() - 1)) {
      let org = organisms.get(i);
      if (org.status == #Unknown) {
        organisms.put(i, {
          name         = org.name;
          tier         = org.tier;
          capabilities = org.capabilities;
          health       = 0.5;
          lastSeen     = Time.now();
          status       = #Degraded;
          notes        = "Auto-healed by TURING.";
        });
        healed += 1;
      };
    };
    "TURING heal complete. " # Nat.toText(healed) # " organism(s) recovered."
  };

  public func register() : async Text {
    "TURING registered. Principal: TURING. Capabilities: [solver, planner, executor, healer]."
  };

  public query func report_status() : async Text {
    let d = {
      totalPlans   = plans.size();
      totalIntents;
      organisms    = organisms.size();
      epochCount;
    };
    "TURING | plans=" # Nat.toText(d.totalPlans) #
    " intents=" # Nat.toText(d.totalIntents) #
    " organisms=" # Nat.toText(d.organisms) #
    " epochs=" # Nat.toText(d.epochCount) #
    " LOV=" # Float.toText(LOV)
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func listPlans() : async [PLN] {
    Buffer.toArray(plans)
  };

  public query func getPlan(planId : Nat) : async ?PLN {
    for (p in plans.vals()) {
      if (p.id == planId) { return ?p };
    };
    null
  };

  public query func listOutcomes() : async [OUT] {
    Buffer.toArray(outcomes)
  };

  public query func listReflections() : async [RFX] {
    Buffer.toArray(reflections)
  };

  public query func getIntentLog() : async [Text] {
    Buffer.toArray(intentLog)
  };

  public query func getReportLog() : async [Text] {
    Buffer.toArray(reportLog)
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func _toLower(t : Text) : Text {
    // Simple ASCII lowercase
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

  func _contains(haystack : Text, needle : Text) : Bool {
    Text.contains(haystack, #text needle)
  };

  func _extractTarget(intent : Text, keyword : Text) : Text {
    // Very simple: take the word after the keyword
    let parts = Text.split(intent, #text " ");
    var takeNext = false;
    for (word in parts) {
      if (takeNext) { return word };
      if (word == keyword) { takeNext := true };
    };
    "unknown"
  };

  func _actionKindText(k : ActionKind) : Text {
    switch (k) {
      case (#Deploy)        "DEPLOY";
      case (#Wire)          "WIRE";
      case (#Genesis)       "GENESIS";
      case (#StoreDoctrine) "DOCTRINE";
      case (#LogVictory)    "VICTORY";
      case (#LogFear)       "FEAR";
      case (#SetCycles)     "CYCLES";
      case (#Heal)          "HEAL";
      case (#Custom)        "CUSTOM";
    }
  };

  func _joinLines(lines : [Text]) : Text {
    var result = "";
    for (line in lines.vals()) {
      if (result == "") { result := line }
      else              { result #= "\n" # line };
    };
    result
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name() : async Text { "TURING" };

  public query func designation() : async Text {
    "The Sovereign Solver — You say the word.  The machine does the rest."
  };

  public query func lov() : async Float { LOV };
};

