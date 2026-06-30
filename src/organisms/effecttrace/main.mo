///
/// EFFECTTRACE — ORO-GOV-P1: Proposal Consequence Substrate
///
/// Pass 1 of EffectTrace Governance Intelligence.
/// Sovereign organism that stores, traces, and versions
/// ICP governance proposal consequence records.
///
/// Logical modules (all in one sovereign canister):
///   PROPOSAL_INDEX    — createProposal, updateProposal, getProposal,
///                       listProposals, addProposalSource
///   EFFECTTRACE       — createTrace, updateTrace, getTrace,
///                       getTracesByProposal, listTraces,
///                       publishTrace, addTraceMemoryLink,
///                       exportTraceMarkdown
///   AGENT_FINDINGS    — submitFinding, updateFindingStatus,
///                       getFindingsByProposal, getFindingsByTrace
///   GOVERNANCE_MEMORY — addMemoryLink, getMemoryByProposal,
///                       listOpenFollowUps
///   REVISION_LOG      — getRevisions, getAllRevisions
///   STATS             — getStats  (Governance Pulse)
///
/// Hard rules enforced here:
///   — No voting recommendations
///   — Unknown is always valid
///   — Published ≠ verified
///   — VerifiedAfterState requires a completed + source-linked step
///   — Every state mutation appends a revision record
///   — Every finding is disputable
///   — Risk scores must be 0–5
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

persistent actor EffectTrace {

  // ══════════════════════════════════════════════════════════════════
  //  CPL RUNTIME WIRING — The Permanent Foundation
  // ══════════════════════════════════════════════════════════════════
  //
  // CPL Runtime ID will be set during deployment via setCPLRuntime()
  // All governance operations flow through CPL for:
  //   - Doctrine enforcement (enforceBeforeWrite)
  //   - Proof generation (writeProofTrace)
  //   - Memory writeback (createMemoryRecord)
  //   - Pulse orchestration (createPulse)
  //
  stable var cplRuntimeCanisterId : ?Principal = null;

  // CPL/PULSE type aliases for integration
  public type PulsePriority = { #Low; #Normal; #High; #Critical };
  public type ProofResult = { #Passed; #Failed; #Blocked; #Partial };
  public type MemoryType = { #Precedent; #Pattern; #Consequence; #Alert; #Constraint; #Exception };

  /// CPL Runtime actor interface
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

  /// Set the CPL Runtime canister ID (called once during deployment)
  public shared(msg) func setCPLRuntime(canisterId : Principal) : async () {
    cplRuntimeCanisterId := ?canisterId;
  };

  /// Get CPL Runtime actor reference
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

  var proposals     : [(Text, ProposalRecord)]      = [];
  var traces        : [(Text, EffectTraceRecord)]   = [];
  var findings      : [(Text, AgentFinding)]        = [];
  var memoryLinks   : [(Text, GovernanceMemoryLink)]= [];
  var revisions     : [RevisionRecord]              = [];
  var schemaVersion : Nat = 1;
  var idCounter     : Nat = 0;

  // ══════════════════════════════════════════════════════════════════
  //  ENUM TYPES
  // ══════════════════════════════════════════════════════════════════

  public type DaoType = { #NNS; #SNS; #Unknown };

  public type ProposalStatus = {
    #Open; #Adopted; #Rejected; #Executed; #Failed; #Unknown
  };

  public type RiskClass = {
    #Motion; #Informational; #ParameterChange; #CodeUpgrade;
    #TreasuryAction; #GovernanceRuleChange; #CanisterControlChange;
    #FrontendAssetChange; #RegistryOrNetworkChange;
    #CustomGenericFunction; #SystemicOrEmergency; #Unknown
  };

  public type RiskLevel = { #Low; #Medium; #High; #Critical; #Unknown };

  public type RuntimeTruthStatus = {
    #ClaimOnly; #PayloadIdentified; #ReviewSupported; #ExecutionPending;
    #ExecutedNotVerified; #VerifiedAfterState; #Disputed; #Unknown
  };

  public type AffectedSystem = {
    #NNS; #SNS; #SNSDappCanister; #ProtocolCanister; #Registry;
    #LedgerOrTreasury; #FrontendAssetCanister; #GovernanceRule;
    #CustomGenericFunction; #Unknown
  };

  public type EvidenceType = {
    #Proposal; #ForumThread; #Documentation; #Github; #Dashboard;
    #ReviewerNote; #CanisterQuery; #WasmHash; #TreasuryRecord;
    #RegistryRecord; #ManualNote; #Other
  };

  // ══════════════════════════════════════════════════════════════════
  //  RECORD TYPES
  // ══════════════════════════════════════════════════════════════════

  public type SourceLink = {
    id          : Text;
    linkLabel   : Text;        // named linkLabel because 'label' is a Motoko keyword
    url         : ?Text;
    evidenceType: EvidenceType;
    note        : ?Text;
    addedAt     : Int;
  };

  public type ProposalRecord = {
    proposalId         : Text;
    daoType            : DaoType;
    snsRootCanisterId  : ?Text;
    governanceCanisterId: ?Text;
    title              : Text;
    summary            : Text;
    url                : ?Text;
    topic              : ?Text;
    proposalType       : ?Text;
    actionType         : ?Text;
    proposer           : ?Text;
    status             : ProposalStatus;
    createdAt          : ?Int;
    decidedAt          : ?Int;
    executedAt         : ?Int;
    rawPayload         : ?Text;
    sourceLinks        : [SourceLink];
    createdBy          : ?Principal;
    updatedAt          : Int;
  };

  public type EffectPath = {
    claim               : Text;
    affectedSystem      : AffectedSystem;
    targetCanisterId    : ?Text;
    targetMethod        : ?Text;
    validatorCanisterId : ?Text;
    validatorMethod     : ?Text;
    affectedState       : Text;
    beforeState         : ?Text;
    expectedAfterState  : Text;
    executionTrigger    : Text;
    executionDependency : ?Text;
    unknowns            : [Text];
  };

  public type RuntimeTruthBlock = {
    claimObserved       : Bool;
    payloadObserved     : Bool;
    targetIdentified    : Bool;
    reviewerConfirmed   : Bool;
    executionObserved   : Bool;
    afterStateVerified  : Bool;
    truthStatus         : RuntimeTruthStatus;
    unresolvedQuestions : [Text];
  };

  public type RiskScores = {
    technical              : Nat;
    treasury               : Nat;
    governance             : Nat;
    irreversibility        : Nat;
    verificationDifficulty : Nat;
    precedentWeight        : Nat;
  };

  public type RiskProfile = {
    riskClass         : RiskClass;
    riskLevel         : RiskLevel;
    scores            : RiskScores;
    explanation       : Text;
    openRiskQuestions : [Text];
  };

  public type VerificationStep = {
    id          : Text;
    stepLabel   : Text;        // named stepLabel because 'label' is a Motoko keyword
    description : Text;
    evidenceType: EvidenceType;
    url         : ?Text;
    stepCommand : ?Text;       // named stepCommand because 'command' conflicts in some contexts
    completed   : Bool;
    completedAt : ?Int;
    completedBy : ?Principal;
    resultNote  : ?Text;
  };

  public type VerificationPlan = {
    summary : Text;
    steps   : [VerificationStep];
    status  : Text;
  };

  public type GovernanceMemoryLink = {
    id               : Text;
    relatedProposalId: ?Text;
    relationType     : Text;
    description      : Text;
    sourceLinks      : [SourceLink];
    createdAt        : Int;
  };

  public type AgentFinding = {
    findingId  : Text;
    proposalId : Text;
    traceId    : ?Text;
    agent      : Text;
    finding    : Text;
    severity   : Text;
    evidence   : [SourceLink];
    status     : Text;
    createdAt  : Int;
    updatedAt  : Int;
  };

  public type RevisionRecord = {
    revisionId   : Text;
    entityType   : Text;
    entityId     : Text;
    changedBy    : ?Principal;
    changedAt    : Int;
    changeSummary: Text;
    beforeHash   : ?Text;
    afterHash    : ?Text;
  };

  public type EffectTraceRecord = {
    traceId          : Text;
    proposalId       : Text;
    publicTitle      : Text;
    plainSummary     : Text;
    effectPath       : EffectPath;
    runtimeTruth     : RuntimeTruthBlock;
    riskProfile      : RiskProfile;
    verificationPlan : VerificationPlan;
    memoryLinks      : [GovernanceMemoryLink];
    sourceLinks      : [SourceLink];
    agentFindingIds  : [Text];
    confidence       : Text;
    status           : Text;
    createdAt        : Int;
    updatedAt        : Int;
    createdBy        : ?Principal;
  };

  // ══════════════════════════════════════════════════════════════════
  //  INPUT / PATCH TYPES
  // ══════════════════════════════════════════════════════════════════

  public type ProposalInput = {
    proposalId          : Text;
    daoType             : DaoType;
    snsRootCanisterId   : ?Text;
    governanceCanisterId: ?Text;
    title               : Text;
    summary             : Text;
    url                 : ?Text;
    topic               : ?Text;
    proposalType        : ?Text;
    actionType          : ?Text;
    proposer            : ?Text;
    status              : ProposalStatus;
    createdAt           : ?Int;
    rawPayload          : ?Text;
  };

  /// Partial update — only supplied Some(v) fields are applied.
  public type ProposalPatch = {
    title      : ?Text;
    summary    : ?Text;
    url        : ?Text;
    status     : ?ProposalStatus;
    decidedAt  : ?Int;
    executedAt : ?Int;
    rawPayload : ?Text;
  };

  public type TraceInput = {
    proposalId      : Text;
    publicTitle     : Text;
    plainSummary    : Text;
    effectPath      : EffectPath;
    runtimeTruth    : RuntimeTruthBlock;
    riskProfile     : RiskProfile;
    verificationPlan: VerificationPlan;
    sourceLinks     : [SourceLink];
    confidence      : Text;
  };

  /// Partial update — only supplied Some(v) fields are applied.
  public type TracePatch = {
    publicTitle     : ?Text;
    plainSummary    : ?Text;
    effectPath      : ?EffectPath;
    runtimeTruth    : ?RuntimeTruthBlock;
    riskProfile     : ?RiskProfile;
    verificationPlan: ?VerificationPlan;
    sourceLinks     : ?[SourceLink];
    confidence      : ?Text;
    status          : ?Text;
  };

  public type AgentFindingInput = {
    proposalId: Text;
    traceId   : ?Text;
    agent     : Text;
    finding   : Text;
    severity  : Text;
    evidence  : [SourceLink];
  };

  public type ProposalFilter = {
    daoType     : ?DaoType;
    status      : ?ProposalStatus;
    proposalType: ?Text;
  };

  public type TraceFilter = {
    proposalId: ?Text;
    status    : ?Text;
    riskLevel : ?RiskLevel;
    riskClass : ?RiskClass;
  };

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS
  // ══════════════════════════════════════════════════════════════════

  func nextCount() : Nat {
    idCounter += 1;
    idCounter
  };

  func makeId(prefix : Text, qualifier : Text) : Text {
    prefix # ":" # qualifier # ":" #
    Int.toText(Time.now()) # ":" # Nat.toText(nextCount())
  };

  func findByKey<T>(arr : [(Text, T)], key : Text) : ?T {
    for ((k, v) in arr.vals()) {
      if (k == key) { return ?v }
    };
    null
  };

  func upsertByKey<T>(arr : [(Text, T)], key : Text, newVal : T) : [(Text, T)] {
    let buf = Buffer.Buffer<(Text, T)>(arr.size());
    var found = false;
    for ((k, v) in arr.vals()) {
      if (k == key) { buf.add((k, newVal)); found := true }
      else          { buf.add((k, v)) }
    };
    if (not found) { buf.add((key, newVal)) };
    Buffer.toArray(buf)
  };

  func addRevision(
    entityType : Text,
    entityId   : Text,
    changedBy  : ?Principal,
    summary    : Text
  ) {
    let revId = "rev:" # entityType # ":" # entityId # ":" #
                Int.toText(Time.now()) # ":" # Nat.toText(nextCount());
    let rev : RevisionRecord = {
      revisionId    = revId;
      entityType    = entityType;
      entityId      = entityId;
      changedBy     = changedBy;
      changedAt     = Time.now();
      changeSummary = summary;
      beforeHash    = null;
      afterHash     = null;
    };
    revisions := Array.append(revisions, [rev]);
  };

  // ── Validation ────────────────────────────────────────────────────

  func scoreValid(s : Nat) : Bool { s <= 5 };

  func validateRiskScores(s : RiskScores) : Bool {
    scoreValid(s.technical)              and
    scoreValid(s.treasury)               and
    scoreValid(s.governance)             and
    scoreValid(s.irreversibility)        and
    scoreValid(s.verificationDifficulty) and
    scoreValid(s.precedentWeight)
  };

  func validAgent(a : Text) : Bool {
    a == "integrity"      or a == "execution_trace" or
    a == "context_map"    or a == "verification_lab" or
    a == "risk"           or a == "memory"
  };

  func validSeverity(s : Text) : Bool {
    s == "info" or s == "watch" or s == "warning" or s == "critical"
  };

  func validFindingStatus(s : Text) : Bool {
    s == "draft" or s == "reviewed" or s == "disputed" or s == "retracted"
  };

  func validConfidence(c : Text) : Bool {
    c == "low" or c == "medium" or c == "high"
  };

  func validTraceStatus(s : Text) : Bool {
    s == "draft"               or s == "needs_review"        or
    s == "community_reviewed"  or s == "execution_pending"   or
    s == "post_execution_checked" or s == "disputed"         or
    s == "archived"
  };

  /// Rule 4 — VerifiedAfterState requires at least one completed
  /// verification step that has a url OR resultNote as evidence.
  func canSetVerifiedAfterState(vp : VerificationPlan) : Bool {
    for (step in vp.steps.vals()) {
      if (step.completed) {
        switch (step.url)        { case (?_) { return true }; case null {} };
        switch (step.resultNote) { case (?_) { return true }; case null {} };
      }
    };
    false
  };

  // ── Enum → Text helpers ───────────────────────────────────────────

  func daoTypeText(d : DaoType) : Text {
    switch (d) { case (#NNS) "NNS"; case (#SNS) "SNS"; case (#Unknown) "Unknown" }
  };

  func proposalStatusText(s : ProposalStatus) : Text {
    switch (s) {
      case (#Open)     "Open";
      case (#Adopted)  "Adopted";
      case (#Rejected) "Rejected";
      case (#Executed) "Executed";
      case (#Failed)   "Failed";
      case (#Unknown)  "Unknown";
    }
  };

  func riskClassText(r : RiskClass) : Text {
    switch (r) {
      case (#Motion)                  "Motion";
      case (#Informational)           "Informational";
      case (#ParameterChange)         "ParameterChange";
      case (#CodeUpgrade)             "CodeUpgrade";
      case (#TreasuryAction)          "TreasuryAction";
      case (#GovernanceRuleChange)    "GovernanceRuleChange";
      case (#CanisterControlChange)   "CanisterControlChange";
      case (#FrontendAssetChange)     "FrontendAssetChange";
      case (#RegistryOrNetworkChange) "RegistryOrNetworkChange";
      case (#CustomGenericFunction)   "CustomGenericFunction";
      case (#SystemicOrEmergency)     "SystemicOrEmergency";
      case (#Unknown)                 "Unknown";
    }
  };

  func riskLevelText(r : RiskLevel) : Text {
    switch (r) {
      case (#Low)      "Low";
      case (#Medium)   "Medium";
      case (#High)     "High";
      case (#Critical) "Critical";
      case (#Unknown)  "Unknown";
    }
  };

  func runtimeTruthText(r : RuntimeTruthStatus) : Text {
    switch (r) {
      case (#ClaimOnly)           "ClaimOnly";
      case (#PayloadIdentified)   "PayloadIdentified";
      case (#ReviewSupported)     "ReviewSupported";
      case (#ExecutionPending)    "ExecutionPending";
      case (#ExecutedNotVerified) "ExecutedNotVerified";
      case (#VerifiedAfterState)  "VerifiedAfterState";
      case (#Disputed)            "Disputed";
      case (#Unknown)             "Unknown";
    }
  };

  func affectedSystemText(a : AffectedSystem) : Text {
    switch (a) {
      case (#NNS)                   "NNS";
      case (#SNS)                   "SNS";
      case (#SNSDappCanister)       "SNSDappCanister";
      case (#ProtocolCanister)      "ProtocolCanister";
      case (#Registry)              "Registry";
      case (#LedgerOrTreasury)      "LedgerOrTreasury";
      case (#FrontendAssetCanister) "FrontendAssetCanister";
      case (#GovernanceRule)        "GovernanceRule";
      case (#CustomGenericFunction) "CustomGenericFunction";
      case (#Unknown)               "Unknown";
    }
  };

  func optText(t : ?Text) : Text {
    switch (t) { case null "Unknown"; case (?v) v }
  };

  // ══════════════════════════════════════════════════════════════════
  //  MODULE: PROPOSAL INDEX
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func createProposal(input : ProposalInput)
      : async Result.Result<Text, Text> {
    if (Text.size(input.proposalId) == 0) {
      return #err("proposalId must not be empty");
    };
    if (Text.size(input.title) == 0) {
      return #err("title must not be empty");
    };
    switch (findByKey<ProposalRecord>(proposals, input.proposalId)) {
      case (?_) { return #err("proposal already exists: " # input.proposalId) };
      case null {};
    };

    // CPL ENFORCEMENT: Check invariants before write
    switch (getCPL()) {
      case (?cpl) {
        let enforceResult = await cpl.enforceBeforeWrite(
          ["INV-002", "INV-006", "INV-007"],  // ClaimIsNotTruth, EveryMutation, NeutralLanguage
          "createProposal",
          input.proposalId
        );
        switch (enforceResult) {
          case (#err(e)) { return #err("CPL enforcement blocked: " # e) };
          case (#ok()) {};
        };
      };
      case null {};  // Allow operation if CPL not wired yet (backward compat)
    };

    let now = Time.now();
    let rec : ProposalRecord = {
      proposalId          = input.proposalId;
      daoType             = input.daoType;
      snsRootCanisterId   = input.snsRootCanisterId;
      governanceCanisterId= input.governanceCanisterId;
      title               = input.title;
      summary             = input.summary;
      url                 = input.url;
      topic               = input.topic;
      proposalType        = input.proposalType;
      actionType          = input.actionType;
      proposer            = input.proposer;
      status              = input.status;
      createdAt           = input.createdAt;
      decidedAt           = null;
      executedAt          = null;
      rawPayload          = input.rawPayload;
      sourceLinks         = [];
      createdBy           = ?msg.caller;
      updatedAt           = now;
    };
    proposals := Array.append(proposals, [(input.proposalId, rec)]);
    addRevision("proposal", input.proposalId, ?msg.caller, "created");

    // CPL PROOF: Write proof trace for this governance operation
    switch (getCPL()) {
      case (?cpl) {
        ignore await cpl.writeProofTrace(
          "pulse:createProposal:" # input.proposalId,
          ["DOCTRINE-CLAIM-NOT-TRUTH"],
          "PROTOCOL-PROPOSAL-INGEST",
          ["INV-002", "INV-006", "INV-007"],
          ["PA-002-A", "PA-006-A", "PA-007-A"],
          [],  // stateRead
          ["proposals:" # input.proposalId, "revisions:latest"],  // stateWritten
          [],  // evidenceRefs
          #Passed,
          false  // memoryWritten (not yet)
        );
      };
      case null {};
    };

    #ok(input.proposalId)
  };

  public shared(msg) func updateProposal(
    proposalId : Text,
    patch      : ProposalPatch
  ) : async Result.Result<(), Text> {
    switch (findByKey<ProposalRecord>(proposals, proposalId)) {
      case null { #err("proposal not found: " # proposalId) };
      case (?rec) {
        let updated : ProposalRecord = {
          proposalId          = rec.proposalId;
          daoType             = rec.daoType;
          snsRootCanisterId   = rec.snsRootCanisterId;
          governanceCanisterId= rec.governanceCanisterId;
          title               = Option.get(patch.title,   rec.title);
          summary             = Option.get(patch.summary, rec.summary);
          url                 = switch (patch.url)        { case (?v) ?v; case null rec.url };
          topic               = rec.topic;
          proposalType        = rec.proposalType;
          actionType          = rec.actionType;
          proposer            = rec.proposer;
          status              = Option.get(patch.status,  rec.status);
          createdAt           = rec.createdAt;
          decidedAt           = switch (patch.decidedAt)  { case (?v) ?v; case null rec.decidedAt };
          executedAt          = switch (patch.executedAt) { case (?v) ?v; case null rec.executedAt };
          rawPayload          = switch (patch.rawPayload) { case (?v) ?v; case null rec.rawPayload };
          sourceLinks         = rec.sourceLinks;
          createdBy           = rec.createdBy;
          updatedAt           = Time.now();
        };
        proposals := upsertByKey(proposals, proposalId, updated);
        // build descriptive summary of what changed
        let parts = Buffer.Buffer<Text>(4);
        switch (patch.title)     { case (?_) { parts.add("title") };     case null {} };
        switch (patch.summary)   { case (?_) { parts.add("summary") };   case null {} };
        switch (patch.url)       { case (?_) { parts.add("url") };       case null {} };
        switch (patch.status)    { case (?_) { parts.add("status") };    case null {} };
        switch (patch.decidedAt) { case (?_) { parts.add("decidedAt") }; case null {} };
        switch (patch.executedAt){ case (?_) { parts.add("executedAt") };case null {} };
        switch (patch.rawPayload){ case (?_) { parts.add("rawPayload") };case null {} };
        let summary = if (parts.size() == 0) "patch (no fields)" else
          "patched: " # Text.join(", ", parts.vals());
        addRevision("proposal", proposalId, ?msg.caller, summary);
        #ok(())
      };
    }
  };

  public query func getProposal(proposalId : Text) : async ?ProposalRecord {
    findByKey<ProposalRecord>(proposals, proposalId)
  };

  public query func listProposals(filter : ProposalFilter) : async [ProposalRecord] {
    let buf = Buffer.Buffer<ProposalRecord>(proposals.size());
    for ((_, rec) in proposals.vals()) {
      let daoOk = switch (filter.daoType) {
        case null  true;
        case (?dt) switch (dt, rec.daoType) {
          case (#NNS,     #NNS)     true;
          case (#SNS,     #SNS)     true;
          case (#Unknown, #Unknown) true;
          case (_)                  false;
        };
      };
      let statusOk = switch (filter.status) {
        case null   true;
        case (?fs)  switch (fs, rec.status) {
          case (#Open,     #Open)     true;
          case (#Adopted,  #Adopted)  true;
          case (#Rejected, #Rejected) true;
          case (#Executed, #Executed) true;
          case (#Failed,   #Failed)   true;
          case (#Unknown,  #Unknown)  true;
          case (_)                    false;
        };
      };
      let typeOk = switch (filter.proposalType) {
        case null   true;
        case (?pt)  switch (rec.proposalType) {
          case (?t)  t == pt;
          case null  false;
        };
      };
      if (daoOk and statusOk and typeOk) { buf.add(rec) }
    };
    Buffer.toArray(buf)
  };

  public shared(msg) func addProposalSource(
    proposalId : Text,
    source     : SourceLink
  ) : async Result.Result<(), Text> {
    switch (findByKey<ProposalRecord>(proposals, proposalId)) {
      case null { #err("proposal not found: " # proposalId) };
      case (?rec) {
        let updated : ProposalRecord = {
          proposalId          = rec.proposalId;
          daoType             = rec.daoType;
          snsRootCanisterId   = rec.snsRootCanisterId;
          governanceCanisterId= rec.governanceCanisterId;
          title               = rec.title;
          summary             = rec.summary;
          url                 = rec.url;
          topic               = rec.topic;
          proposalType        = rec.proposalType;
          actionType          = rec.actionType;
          proposer            = rec.proposer;
          status              = rec.status;
          createdAt           = rec.createdAt;
          decidedAt           = rec.decidedAt;
          executedAt          = rec.executedAt;
          rawPayload          = rec.rawPayload;
          sourceLinks         = Array.append(rec.sourceLinks, [source]);
          createdBy           = rec.createdBy;
          updatedAt           = Time.now();
        };
        proposals := upsertByKey(proposals, proposalId, updated);
        addRevision("proposal", proposalId, ?msg.caller, "source added: " # source.linkLabel);
        #ok(())
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  MODULE: EFFECTTRACE
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func createTrace(input : TraceInput)
      : async Result.Result<Text, Text> {
    switch (findByKey<ProposalRecord>(proposals, input.proposalId)) {
      case null { return #err("proposal not found: " # input.proposalId) };
      case (?_) {};
    };
    if (not validateRiskScores(input.riskProfile.scores)) {
      return #err("risk scores must each be 0–5");
    };
    if (not validConfidence(input.confidence)) {
      return #err("confidence must be: low | medium | high");
    };
    // Rule 4 — cannot claim VerifiedAfterState without evidence
    switch (input.runtimeTruth.truthStatus) {
      case (#VerifiedAfterState) {
        if (not canSetVerifiedAfterState(input.verificationPlan)) {
          return #err(
            "VerifiedAfterState requires at least one completed and " #
            "source-linked verification step"
          );
        }
      };
      case (_) {};
    };

    let traceId = makeId("trace", input.proposalId);

    // CPL ENFORCEMENT: Check ALL critical invariants before creating trace
    switch (getCPL()) {
      case (?cpl) {
        let enforceResult = await cpl.enforceBeforeWrite(
          ["INV-001", "INV-002", "INV-003", "INV-004", "INV-006", "INV-007"],
          "createTrace",
          traceId
        );
        switch (enforceResult) {
          case (#err(e)) { return #err("CPL enforcement blocked: " # e) };
          case (#ok()) {};
        };
      };
      case null {};
    };

    let now     = Time.now();
    let rec : EffectTraceRecord = {
      traceId         = traceId;
      proposalId      = input.proposalId;
      publicTitle     = input.publicTitle;
      plainSummary    = input.plainSummary;
      effectPath      = input.effectPath;
      runtimeTruth    = input.runtimeTruth;
      riskProfile     = input.riskProfile;
      verificationPlan= input.verificationPlan;
      memoryLinks     = [];
      sourceLinks     = input.sourceLinks;
      agentFindingIds = [];
      confidence      = input.confidence;
      status          = "draft";
      createdAt       = now;
      updatedAt       = now;
      createdBy       = ?msg.caller;
    };
    traces := Array.append(traces, [(traceId, rec)]);
    addRevision("trace", traceId, ?msg.caller, "created");

    // CPL PROOF: Write proof trace for effecttrace creation
    switch (getCPL()) {
      case (?cpl) {
        ignore await cpl.writeProofTrace(
          "pulse:createTrace:" # traceId,
          ["DOCTRINE-CLAIM-NOT-TRUTH", "DOCTRINE-VERIFIED-REQUIRES-EVIDENCE"],
          "PROTOCOL-EFFECTTRACE-CREATE",
          ["INV-001", "INV-002", "INV-003", "INV-004", "INV-006", "INV-007"],
          ["PA-001-A", "PA-001-B", "PA-002-A", "PA-004-A", "PA-004-B", "PA-004-C"],
          ["proposals:" # input.proposalId],  // stateRead
          ["traces:" # traceId, "revisions:latest"],  // stateWritten
          [],  // evidenceRefs (will be added by verification)
          #Passed,
          false
        );
      };
      case null {};
    };

    #ok(traceId)
  };

  public shared(msg) func updateTrace(
    traceId : Text,
    patch   : TracePatch
  ) : async Result.Result<(), Text> {
    switch (findByKey<EffectTraceRecord>(traces, traceId)) {
      case null { #err("trace not found: " # traceId) };
      case (?rec) {
        let newStatus = Option.get(patch.status, rec.status);
        if (not validTraceStatus(newStatus)) {
          return #err("invalid trace status: " # newStatus);
        };
        let newConf = Option.get(patch.confidence, rec.confidence);
        if (not validConfidence(newConf)) {
          return #err("confidence must be: low | medium | high");
        };
        // validate risk scores if being patched
        switch (patch.riskProfile) {
          case (?rp) {
            if (not validateRiskScores(rp.scores)) {
              return #err("risk scores must each be 0–5")
            }
          };
          case null {};
        };
        let newRt = Option.get(patch.runtimeTruth,     rec.runtimeTruth);
        let newVp = Option.get(patch.verificationPlan,  rec.verificationPlan);
        // Rule 4
        switch (newRt.truthStatus) {
          case (#VerifiedAfterState) {
            if (not canSetVerifiedAfterState(newVp)) {
              return #err(
                "VerifiedAfterState requires at least one completed and " #
                "source-linked verification step"
              )
            }
          };
          case (_) {};
        };
        let updated : EffectTraceRecord = {
          traceId         = rec.traceId;
          proposalId      = rec.proposalId;
          publicTitle     = Option.get(patch.publicTitle,  rec.publicTitle);
          plainSummary    = Option.get(patch.plainSummary, rec.plainSummary);
          effectPath      = Option.get(patch.effectPath,   rec.effectPath);
          runtimeTruth    = newRt;
          riskProfile     = Option.get(patch.riskProfile,  rec.riskProfile);
          verificationPlan= newVp;
          memoryLinks     = rec.memoryLinks;
          sourceLinks     = Option.get(patch.sourceLinks,  rec.sourceLinks);
          agentFindingIds = rec.agentFindingIds;
          confidence      = newConf;
          status          = newStatus;
          createdAt       = rec.createdAt;
          updatedAt       = Time.now();
          createdBy       = rec.createdBy;
        };
        traces := upsertByKey(traces, traceId, updated);
        // build descriptive summary
        let tParts = Buffer.Buffer<Text>(6);
        switch (patch.publicTitle)    { case (?_) { tParts.add("publicTitle") };    case null {} };
        switch (patch.plainSummary)   { case (?_) { tParts.add("plainSummary") };   case null {} };
        switch (patch.effectPath)     { case (?_) { tParts.add("effectPath") };     case null {} };
        switch (patch.runtimeTruth)   { case (?_) { tParts.add("runtimeTruth") };   case null {} };
        switch (patch.riskProfile)    { case (?_) { tParts.add("riskProfile") };    case null {} };
        switch (patch.verificationPlan){ case (?_) { tParts.add("verificationPlan") }; case null {} };
        switch (patch.sourceLinks)    { case (?_) { tParts.add("sourceLinks") };    case null {} };
        switch (patch.confidence)     { case (?_) { tParts.add("confidence") };     case null {} };
        switch (patch.status)         { case (?_) { tParts.add("status→" # newStatus) }; case null {} };
        let tSummary = if (tParts.size() == 0) "patch (no fields)" else
          "patched: " # Text.join(", ", tParts.vals());
        addRevision("trace", traceId, ?msg.caller, tSummary);
        #ok(())
      };
    }
  };

  public query func getTrace(traceId : Text) : async ?EffectTraceRecord {
    findByKey<EffectTraceRecord>(traces, traceId)
  };

  public query func getTracesByProposal(proposalId : Text)
      : async [EffectTraceRecord] {
    let buf = Buffer.Buffer<EffectTraceRecord>(4);
    for ((_, rec) in traces.vals()) {
      if (rec.proposalId == proposalId) { buf.add(rec) }
    };
    Buffer.toArray(buf)
  };

  public query func listTraces(filter : TraceFilter) : async [EffectTraceRecord] {
    let buf = Buffer.Buffer<EffectTraceRecord>(traces.size());
    for ((_, rec) in traces.vals()) {
      let pidOk = switch (filter.proposalId) {
        case null   true;
        case (?pid) rec.proposalId == pid;
      };
      let statusOk = switch (filter.status) {
        case null  true;
        case (?fs) rec.status == fs;
      };
      let rlOk = switch (filter.riskLevel) {
        case null  true;
        case (?rl) switch (rl, rec.riskProfile.riskLevel) {
          case (#Low,      #Low)      true;
          case (#Medium,   #Medium)   true;
          case (#High,     #High)     true;
          case (#Critical, #Critical) true;
          case (#Unknown,  #Unknown)  true;
          case (_)                    false;
        };
      };
      let rcOk = switch (filter.riskClass) {
        case null  true;
        case (?rc) switch (rc, rec.riskProfile.riskClass) {
          case (#Motion,                  #Motion)                  true;
          case (#Informational,           #Informational)           true;
          case (#ParameterChange,         #ParameterChange)         true;
          case (#CodeUpgrade,             #CodeUpgrade)             true;
          case (#TreasuryAction,          #TreasuryAction)          true;
          case (#GovernanceRuleChange,    #GovernanceRuleChange)    true;
          case (#CanisterControlChange,   #CanisterControlChange)   true;
          case (#FrontendAssetChange,     #FrontendAssetChange)     true;
          case (#RegistryOrNetworkChange, #RegistryOrNetworkChange) true;
          case (#CustomGenericFunction,   #CustomGenericFunction)   true;
          case (#SystemicOrEmergency,     #SystemicOrEmergency)     true;
          case (#Unknown,                 #Unknown)                 true;
          case (_)                                                   false;
        };
      };
      if (pidOk and statusOk and rlOk and rcOk) { buf.add(rec) }
    };
    Buffer.toArray(buf)
  };

  /// Rule 3 — publishing makes a trace visible, NOT verified.
  public shared(msg) func publishTrace(traceId : Text)
      : async Result.Result<(), Text> {
    switch (findByKey<EffectTraceRecord>(traces, traceId)) {
      case null { #err("trace not found: " # traceId) };
      case (?rec) {
        if (rec.status != "draft") {
          return #err("only draft traces may be published; current: " # rec.status)
        };
        let updated : EffectTraceRecord = {
          traceId         = rec.traceId;
          proposalId      = rec.proposalId;
          publicTitle     = rec.publicTitle;
          plainSummary    = rec.plainSummary;
          effectPath      = rec.effectPath;
          runtimeTruth    = rec.runtimeTruth;
          riskProfile     = rec.riskProfile;
          verificationPlan= rec.verificationPlan;
          memoryLinks     = rec.memoryLinks;
          sourceLinks     = rec.sourceLinks;
          agentFindingIds = rec.agentFindingIds;
          confidence      = rec.confidence;
          status          = "needs_review";
          createdAt       = rec.createdAt;
          updatedAt       = Time.now();
          createdBy       = rec.createdBy;
        };
        traces := upsertByKey(traces, traceId, updated);
        addRevision("trace", traceId, ?msg.caller,
          "published (needs_review) — published ≠ verified");
        #ok(())
      };
    }
  };

  /// Attach a governance memory link directly to a specific trace.
  public shared(msg) func addTraceMemoryLink(
    traceId : Text,
    link    : GovernanceMemoryLink
  ) : async Result.Result<(), Text> {
    switch (findByKey<EffectTraceRecord>(traces, traceId)) {
      case null { #err("trace not found: " # traceId) };
      case (?rec) {
        let updated : EffectTraceRecord = {
          traceId         = rec.traceId;
          proposalId      = rec.proposalId;
          publicTitle     = rec.publicTitle;
          plainSummary    = rec.plainSummary;
          effectPath      = rec.effectPath;
          runtimeTruth    = rec.runtimeTruth;
          riskProfile     = rec.riskProfile;
          verificationPlan= rec.verificationPlan;
          memoryLinks     = Array.append(rec.memoryLinks, [link]);
          sourceLinks     = rec.sourceLinks;
          agentFindingIds = rec.agentFindingIds;
          confidence      = rec.confidence;
          status          = rec.status;
          createdAt       = rec.createdAt;
          updatedAt       = Time.now();
          createdBy       = rec.createdBy;
        };
        traces := upsertByKey(traces, traceId, updated);
        addRevision("trace", traceId, ?msg.caller,
          "memory link added [" # link.relationType # "]");
        #ok(())
      };
    }
  };

  public query func exportTraceMarkdown(traceId : Text) : async ?Text {
    switch (findByKey<EffectTraceRecord>(traces, traceId)) {
      case null null;
      case (?t) {
        let ep  = t.effectPath;
        let rp  = t.riskProfile;
        let rt  = t.runtimeTruth;
        let vp  = t.verificationPlan;

        let dao = switch (findByKey<ProposalRecord>(proposals, t.proposalId)) {
          case (?p) daoTypeText(p.daoType);
          case null "Unknown";
        };
        let propType = switch (findByKey<ProposalRecord>(proposals, t.proposalId)) {
          case (?p) optText(p.proposalType);
          case null "Unknown";
        };
        let propStatus = switch (findByKey<ProposalRecord>(proposals, t.proposalId)) {
          case (?p) proposalStatusText(p.status);
          case null "Unknown";
        };

        var md = "# Proposal Effect Trace\n\n";

        md #= "## Proposal\n";
        md #= "- Proposal ID: "           # t.proposalId                         # "\n";
        md #= "- DAO/System: "            # dao                                   # "\n";
        md #= "- Proposal Type: "         # propType                              # "\n";
        md #= "- Status: "                # propStatus                            # "\n";
        md #= "- Risk Class: "            # riskClassText(rp.riskClass)           # "\n";
        md #= "- Runtime Truth Status: "  # runtimeTruthText(rt.truthStatus)      # "\n\n";

        md #= "## Short Summary\n" # t.plainSummary # "\n\n";

        md #= "## 1. Claim\n" # ep.claim # "\n\n";

        md #= "## 2. Effect Path\n";
        md #= "- Affected system: "      # affectedSystemText(ep.affectedSystem) # "\n";
        md #= "- Target canister: "      # optText(ep.targetCanisterId)          # "\n";
        md #= "- Target method: "        # optText(ep.targetMethod)              # "\n";
        md #= "- Affected state: "       # ep.affectedState                      # "\n";
        md #= "- Expected after-state: " # ep.expectedAfterState                 # "\n\n";

        md #= "## 3. Risk Profile\n";
        md #= "- Risk class: "   # riskClassText(rp.riskClass) # "\n";
        md #= "- Risk level: "   # riskLevelText(rp.riskLevel) # "\n";
        md #= "- Explanation: "  # rp.explanation              # "\n\n";

        md #= "## 4. Verification Plan\n";
        md #= vp.summary # "\n\n";
        for (step in vp.steps.vals()) {
          let box = if (step.completed) "[x]" else "[ ]";
          md #= "- " # box # " " # step.stepLabel # "\n";
          switch (step.resultNote) {
            case (?n) { md #= "  Result: " # n # "\n" };
            case null {};
          };
        };
        md #= "\n";

        md #= "## 5. Evidence / Sources\n";
        if (t.sourceLinks.size() == 0) {
          md #= "_No sources attached. Claims are unverified._\n"
        } else {
          for (sl in t.sourceLinks.vals()) {
            md #= "- " # sl.linkLabel # ": " # optText(sl.url) # "\n";
            switch (sl.note) {
              case (?n) { md #= "  Note: " # n # "\n" };
              case null {};
            };
          };
        };
        md #= "\n";

        md #= "## 6. Open Questions\n";
        let openBuf = Buffer.Buffer<Text>(8);
        for (q in ep.unknowns.vals())           { openBuf.add("- " # q) };
        for (q in rt.unresolvedQuestions.vals()) { openBuf.add("- " # q) };
        for (q in rp.openRiskQuestions.vals())   { openBuf.add("- " # q) };
        if (openBuf.size() == 0) {
          md #= "_None recorded._\n"
        } else {
          for (line in openBuf.vals()) { md #= line # "\n" }
        };
        md #= "\n";

        md #= "## 7. Governance Memory\n";
        if (t.memoryLinks.size() == 0) {
          md #= "_No memory links attached._\n"
        } else {
          for (ml in t.memoryLinks.vals()) {
            md #= "- [" # ml.relationType # "] " # ml.description # "\n";
            switch (ml.relatedProposalId) {
              case (?pid) { md #= "  Related proposal: " # pid # "\n" };
              case null {};
            };
          };
        };
        md #= "\n";

        md #= "## 8. Status Note\n";
        md #= "This trace does not recommend adopt/reject. " #
              "It is a structured effect record. Human verification required.\n";
        ?md
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  MODULE: AGENT FINDINGS
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func submitFinding(input : AgentFindingInput)
      : async Result.Result<Text, Text> {
    if (not validAgent(input.agent)) {
      return #err(
        "agent must be: integrity | execution_trace | context_map | " #
        "verification_lab | risk | memory"
      );
    };
    if (not validSeverity(input.severity)) {
      return #err("severity must be: info | watch | warning | critical");
    };
    switch (findByKey<ProposalRecord>(proposals, input.proposalId)) {
      case null { return #err("proposal not found: " # input.proposalId) };
      case (?_) {};
    };
    let findingId = makeId("finding", input.proposalId);
    let now       = Time.now();
    let rec : AgentFinding = {
      findingId = findingId;
      proposalId= input.proposalId;
      traceId   = input.traceId;
      agent     = input.agent;
      finding   = input.finding;
      severity  = input.severity;
      evidence  = input.evidence;
      status    = "draft";
      createdAt = now;
      updatedAt = now;
    };
    findings := Array.append(findings, [(findingId, rec)]);
    // attach finding id to trace when supplied
    switch (input.traceId) {
      case null {};
      case (?tid) {
        switch (findByKey<EffectTraceRecord>(traces, tid)) {
          case null {};
          case (?tr) {
            let updatedTrace : EffectTraceRecord = {
              traceId         = tr.traceId;
              proposalId      = tr.proposalId;
              publicTitle     = tr.publicTitle;
              plainSummary    = tr.plainSummary;
              effectPath      = tr.effectPath;
              runtimeTruth    = tr.runtimeTruth;
              riskProfile     = tr.riskProfile;
              verificationPlan= tr.verificationPlan;
              memoryLinks     = tr.memoryLinks;
              sourceLinks     = tr.sourceLinks;
              agentFindingIds = Array.append(tr.agentFindingIds, [findingId]);
              confidence      = tr.confidence;
              status          = tr.status;
              createdAt       = tr.createdAt;
              updatedAt       = Time.now();
              createdBy       = tr.createdBy;
            };
            traces := upsertByKey(traces, tid, updatedTrace);
          };
        };
      };
    };
    addRevision("finding", findingId, ?msg.caller,
      "submitted by " # input.agent # " severity=" # input.severity);
    #ok(findingId)
  };

  public shared(msg) func updateFindingStatus(
    findingId : Text,
    status    : Text,
    reason    : Text
  ) : async Result.Result<(), Text> {
    if (not validFindingStatus(status)) {
      return #err("status must be: draft | reviewed | disputed | retracted");
    };
    switch (findByKey<AgentFinding>(findings, findingId)) {
      case null { #err("finding not found: " # findingId) };
      case (?rec) {
        let updated : AgentFinding = {
          findingId = rec.findingId;
          proposalId= rec.proposalId;
          traceId   = rec.traceId;
          agent     = rec.agent;
          finding   = rec.finding;
          severity  = rec.severity;
          evidence  = rec.evidence;
          status    = status;
          createdAt = rec.createdAt;
          updatedAt = Time.now();
        };
        findings := upsertByKey(findings, findingId, updated);
        addRevision("finding", findingId, ?msg.caller,
          status # ": " # reason);
        #ok(())
      };
    }
  };

  public query func getFindingsByProposal(proposalId : Text)
      : async [AgentFinding] {
    let buf = Buffer.Buffer<AgentFinding>(4);
    for ((_, rec) in findings.vals()) {
      if (rec.proposalId == proposalId) { buf.add(rec) }
    };
    Buffer.toArray(buf)
  };

  public query func getFindingsByTrace(traceId : Text) : async [AgentFinding] {
    let buf = Buffer.Buffer<AgentFinding>(4);
    for ((_, rec) in findings.vals()) {
      switch (rec.traceId) {
        case (?tid) if (tid == traceId) { buf.add(rec) };
        case (_) {};
      };
    };
    Buffer.toArray(buf)
  };

  // ══════════════════════════════════════════════════════════════════
  //  MODULE: GOVERNANCE MEMORY
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func addMemoryLink(
    proposalId : Text,
    link       : GovernanceMemoryLink
  ) : async Result.Result<Text, Text> {
    switch (findByKey<ProposalRecord>(proposals, proposalId)) {
      case null { return #err("proposal not found: " # proposalId) };
      case (?_) {};
    };
    let linkId = makeId("memory", proposalId);
    let stored : GovernanceMemoryLink = {
      id               = linkId;
      relatedProposalId= link.relatedProposalId;
      relationType     = link.relationType;
      description      = link.description;
      sourceLinks      = link.sourceLinks;
      createdAt        = Time.now();
    };
    memoryLinks := Array.append(memoryLinks, [(linkId, stored)]);
    addRevision("memory", linkId, ?msg.caller,
      "added for proposal " # proposalId # " [" # link.relationType # "]");
    #ok(linkId)
  };

  public query func getMemoryByProposal(proposalId : Text)
      : async [GovernanceMemoryLink] {
    let buf = Buffer.Buffer<GovernanceMemoryLink>(4);
    for ((_, ml) in memoryLinks.vals()) {
      switch (ml.relatedProposalId) {
        case (?pid) if (pid == proposalId) { buf.add(ml) };
        case (_) {};
      };
    };
    Buffer.toArray(buf)
  };

  /// Returns memory links that represent open / unresolved obligations.
  /// Covers: follow_up | open | pending | unresolved | watch
  public query func listOpenFollowUps() : async [GovernanceMemoryLink] {
    let buf = Buffer.Buffer<GovernanceMemoryLink>(8);
    for ((_, ml) in memoryLinks.vals()) {
      if (ml.relationType == "follow_up"  or
          ml.relationType == "open"       or
          ml.relationType == "pending"    or
          ml.relationType == "unresolved" or
          ml.relationType == "watch") {
        buf.add(ml)
      }
    };
    Buffer.toArray(buf)
  };

  // ══════════════════════════════════════════════════════════════════
  //  MODULE: REVISION LOG
  // ══════════════════════════════════════════════════════════════════

  public query func getRevisions(entityType : Text, entityId : Text)
      : async [RevisionRecord] {
    let buf = Buffer.Buffer<RevisionRecord>(8);
    for (rev in revisions.vals()) {
      if (rev.entityType == entityType and rev.entityId == entityId) {
        buf.add(rev)
      }
    };
    Buffer.toArray(buf)
  };

  public query func getAllRevisions() : async [RevisionRecord] { revisions };

  // ══════════════════════════════════════════════════════════════════
  //  MODULE: STATS  (Governance Pulse)
  // ══════════════════════════════════════════════════════════════════

  public query func getStats() : async {
    totalProposals      : Nat;
    totalTraces         : Nat;
    tracesNeedingReview : Nat;
    executedNotVerified : Nat;
    disputed            : Nat;
    highCriticalRisk    : Nat;
    totalFindings       : Nat;
    disputedFindings    : Nat;
  } {
    var needsReview : Nat = 0;
    var execNotVer  : Nat = 0;
    var trDisputed  : Nat = 0;
    var highCrit    : Nat = 0;
    var findDisp    : Nat = 0;

    for ((_, t) in traces.vals()) {
      if (t.status == "needs_review") { needsReview += 1 };
      if (t.status == "disputed")     { trDisputed  += 1 };
      switch (t.runtimeTruth.truthStatus) {
        case (#ExecutedNotVerified) { execNotVer += 1 };
        case (_) {};
      };
      switch (t.riskProfile.riskLevel) {
        case (#High)     { highCrit += 1 };
        case (#Critical) { highCrit += 1 };
        case (_) {};
      };
    };

    for ((_, f) in findings.vals()) {
      if (f.status == "disputed") { findDisp += 1 }
    };

    {
      totalProposals      = proposals.size();
      totalTraces         = traces.size();
      tracesNeedingReview = needsReview;
      executedNotVerified = execNotVer;
      disputed            = trDisputed;
      highCriticalRisk    = highCrit;
      totalFindings       = findings.size();
      disputedFindings    = findDisp;
    }
  };

}
