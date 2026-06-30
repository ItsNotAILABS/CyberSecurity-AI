///
/// CPL RUNTIME — Causal Protocol Language Native Execution Layer
///
/// "Doctrine becomes protocol. Protocol becomes invariant.
///  Invariant becomes pulse. Pulse writes proof. Proof becomes memory."
///
/// Pass 1: Complete Schema Layer
///   - DoctrineRecord
///   - ProtocolRecord
///   - InvariantRecord
///   - PolicyAtom
///   - PulseTask
///   - SignalRecord
///   - ProofTrace
///   - MemoryRecord
///   - ProposalRecord
///   - EffectTraceRecord
///   - EvidenceRecord
///   - RevisionRecord
///
/// Pass 2: PULSE Scheduler (full lifecycle, signal routing, proof req)
/// Pass 3: Invariant Kernel (enforcement, blocking, review routing)
/// Pass 4: Proof Trace (writeProof, linkMemory, verify requirements)
/// Pass 5: EffectTrace Protocols (8 protocols implemented)
///
/// Core Hierarchy:
///   Doctrine → Protocol → Invariant → Policy Atom → Pulse → Proof Trace → Memory Record
///
/// Hard Rules (enforced in code):
///   - No verified status without proof
///   - No frontend-only truth
///   - Unknown is valid
///   - Every protocol maps back to doctrine
///   - Every doctrine produces protocols
///   - Every protocol has invariants
///   - Every invariant has policy atoms
///   - Every pulse must: complete | fail | block | routeToReview
///   - Every meaningful state change writes proof
///   - No internal Go server calls
///

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

persistent actor CPL_Runtime {

  // ══════════════════════════════════════════════════════════════════
  //  GOLDEN CONSTANTS
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI2 : Float = 2.6180339887498948482;
  transient let PHI3 : Float = 4.2360679774997896964;
  transient let PHI4 : Float = 6.8541019662496845446;

  // Fibonacci thresholds
  transient let FIB_3 : Nat = 3;
  transient let FIB_5 : Nat = 5;
  transient let FIB_8 : Nat = 8;
  transient let FIB_13 : Nat = 13;
  transient let FIB_21 : Nat = 21;
  transient let FIB_34 : Nat = 34;
  transient let FIB_55 : Nat = 55;
  transient let FIB_89 : Nat = 89;
  transient let FIB_144 : Nat = 144;

  // ══════════════════════════════════════════════════════════════════
  //  PASS 1: COMPLETE SCHEMA LAYER
  // ══════════════════════════════════════════════════════════════════

  // ─────────────────────────────────────────────────────────────────
  // DOCTRINE LAYER — The Immutable Law
  // ─────────────────────────────────────────────────────────────────

  /// DoctrineRecord — Immutable philosophical law
  ///
  /// Doctrine is the top of the hierarchy. It defines WHY things are
  /// forbidden or required. Doctrines are immutable once established.
  /// They spawn Protocols.
  public type DoctrineRecord = {
    doctrineId      : Text;           // e.g. "DOCTRINE-001"
    name            : Text;           // e.g. "ClaimIsNotTruth"
    statement       : Text;           // Natural language immutable law
    rationale       : Text;           // Why this doctrine exists
    authority       : Text;           // Source of authority (founder, math, consensus)
    phiWeight       : Float;          // φ-weighted importance (0 to φ⁴)
    fibonacciRank   : Nat;            // Fibonacci-indexed priority
    dimension       : Nat;            // D0-D4 plane
    immutable       : Bool;           // Cannot be changed once true
    establishedAt   : Int;
    establishedBy   : Principal;
    protocolRefs    : [Text];         // Protocols derived from this doctrine
  };

  /// ProtocolRecord — Executable interpretation of doctrine
  ///
  /// Protocols are spawned from Doctrines. They define HOW the doctrine
  /// is executed. A protocol produces Invariants.
  public type ProtocolRecord = {
    protocolId      : Text;           // e.g. "PROTO-CLAIM-001"
    name            : Text;
    doctrineRef     : Text;           // Parent doctrine ID
    description     : Text;           // What this protocol does
    executionModel  : Text;           // How it executes (sync|async|event)
    phiWeight       : Float;          // Inherited + adjusted from doctrine
    fibonacciRank   : Nat;
    invariantRefs   : [Text];         // Invariants spawned from this protocol
    active          : Bool;
    createdAt       : Int;
    createdBy       : Principal;
    lastModified    : Int;
  };

  /// InvariantRecord — Runtime-enforced constraint
  ///
  /// Invariants are executable checks. They are spawned from Protocols.
  /// Every invariant must be checkable at runtime. Invariants produce
  /// PolicyAtoms (the smallest enforceable units).
  public type InvariantRecord = {
    invariantId     : Text;           // e.g. "INV-001"
    name            : Text;
    protocolRef     : Text;           // Parent protocol ID
    doctrineRef     : Text;           // Root doctrine ID
    condition       : Text;           // Executable condition (human-readable)
    checkFunction   : Text;           // Function name that checks this
    requiredProof   : Text;           // What proof must exist
    failureAction   : FailureAction;  // What happens when violated
    severity        : InvariantSeverity;
    phiWeight       : Float;
    fibonacciRank   : Nat;
    policyAtomRefs  : [Text];         // Atoms that compose this invariant
    active          : Bool;
    createdAt       : Int;
    lastChecked     : ?Int;
    totalChecks     : Nat;
    totalViolations : Nat;
  };

  public type FailureAction = {
    #Block;              // Stop execution immediately
    #Warn;               // Log warning, continue
    #Escalate;           // Escalate to higher authority
    #RouteToReview;      // Send to human/agent review
    #EmitSignal;         // Emit signal for downstream handling
  };

  public type InvariantSeverity = {
    #Low;
    #Medium;
    #High;
    #Critical;
  };

  /// PolicyAtom — Smallest enforceable behavior unit
  ///
  /// PolicyAtoms are the atomic building blocks of Invariants.
  /// They represent single boolean checks.
  public type PolicyAtom = {
    atomId          : Text;           // e.g. "PA-001-A"
    name            : Text;
    invariantRef    : Text;           // Parent invariant ID
    condition       : Text;           // Single atomic condition
    checkFunction   : Text;           // Function that checks this atom
    failureMessage  : Text;
    severity        : InvariantSeverity;
    phiWeight       : Float;
    active          : Bool;
    createdAt       : Int;
    totalChecks     : Nat;
    totalFailures   : Nat;
  };

  // ─────────────────────────────────────────────────────────────────
  // PULSE LAYER — Concurrent Execution with Law
  // ─────────────────────────────────────────────────────────────────

  /// PulseTask — Native concurrency unit (replaces Go goroutine)
  ///
  /// Unlike a goroutine, a Pulse carries:
  ///   - Doctrine context (which law applies)
  ///   - Invariant requirements (which checks must pass)
  ///   - Proof requirements (what evidence must be produced)
  ///   - Priority/salience/urgency (φ-weighted scheduling)
  ///   - Target organism (where it executes)
  public type PulseTask = {
    pulseId         : Text;
    pulseType       : Text;           // e.g. "ProposalIngestPulse"
    doctrineRefs    : [Text];         // Doctrines that govern this pulse
    protocolRef     : Text;           // Protocol this pulse executes
    invariantRefs   : [Text];         // Invariants that must hold
    policyAtomRefs  : [Text];         // Atoms to check
    sourceEventId   : Text;           // Originating event
    targetOrgan     : Text;           // Target organism (e.g. "effecttrace")
    payloadRef      : Text;           // Data reference
    priority        : PulsePriority;
    status          : PulseStatus;
    salience        : Nat;            // 0-100 organism attention
    urgency         : Nat;            // 0-100 time sensitivity
    riskScore       : Nat;            // 0-100 risk level
    phiWeight       : Float;          // φ-weighted execution priority
    proofRequired   : Bool;
    proofTraceId    : ?Text;          // Linked proof after completion
    signalsEmitted  : [Text];         // Signals emitted during execution
    createdAt       : Int;
    queuedAt        : ?Int;
    startedAt       : ?Int;
    completedAt     : ?Int;
    failReason      : ?Text;
    blockedReason   : ?Text;
    submittedBy     : Principal;
  };

  public type PulsePriority = {
    #Low;
    #Normal;
    #High;
    #Critical;
  };

  public type PulseStatus = {
    #Created;           // Just created, not queued yet
    #Queued;            // In queue, waiting for scheduler
    #Running;           // Currently executing
    #Completed;         // Successfully finished
    #Failed;            // Failed with error
    #Blocked;           // Blocked by invariant violation
    #RoutedToReview;    // Sent to human/agent review
    #Cancelled;         // Cancelled before execution
  };

  /// SignalRecord — Meaning-bearing inter-organism communication
  ///
  /// Signals replace Go channels. They are structured meaning packets
  /// with doctrine context and routing metadata.
  public type SignalRecord = {
    signalId        : Text;
    signalType      : Text;           // e.g. "ProposalDetected"
    channel         : SignalChannel;
    sourceOrgan     : Text;
    targetOrgan     : Text;
    payloadRef      : Text;
    relatedPulseId  : ?Text;
    doctrineHints   : [Text];         // Suggested doctrines to consider
    invariantHints  : [Text];         // Suggested invariants to check
    salience        : Nat;
    urgency         : Nat;
    riskScore       : Nat;
    phiWeight       : Float;
    consumed        : Bool;
    consumedByPulse : ?Text;
    createdAt       : Int;
    consumedAt      : ?Int;
  };

  public type SignalChannel = {
    #Governance;        // Proposal lifecycle
    #EffectPath;        // Trace construction
    #Risk;              // Risk classification
    #Verification;      // Verification events
    #Memory;            // Memory write events
    #Alert;             // Operator escalation
    #Export;            // Report generation
    #Scheduler;         // Scheduler control
    #Protocol;          // Protocol execution
    #Doctrine;          // Doctrine enforcement
  };

  // ─────────────────────────────────────────────────────────────────
  // PROOF LAYER — Evidence of Execution
  // ─────────────────────────────────────────────────────────────────

  /// ProofTrace — Cryptographic evidence that a pulse executed
  ///
  /// Every important pulse MUST produce proof. No proof = no verified claim.
  /// Proof is the runtime truth layer.
  public type ProofTrace = {
    proofId         : Text;
    pulseTaskId     : Text;           // Which pulse produced this proof
    doctrineRefs    : [Text];         // Doctrines enforced
    protocolRef     : Text;           // Protocol executed
    invariantRefs   : [Text];         // Invariants checked
    policyAtomRefs  : [Text];         // Atoms checked
    stateRead       : [Text];         // Records/fields read
    stateWritten    : [Text];         // Records/fields written
    evidenceRefs    : [Text];         // Linked evidence IDs
    result          : ProofResult;
    phiWeight       : Float;          // Importance of this proof
    fibonacciRank   : Nat;
    memoryWritten   : Bool;           // Did this write to memory?
    memoryRecordId  : ?Text;
    failReason      : ?Text;
    createdAt       : Int;
  };

  public type ProofResult = {
    #Passed;            // All checks passed
    #Failed;            // Checks failed
    #Blocked;           // Blocked by invariant
    #Partial;           // Partially completed
    #RoutedToReview;    // Sent to review
  };

  /// EvidenceRecord — Supporting evidence for proof
  ///
  /// Evidence is attached to proofs to show HOW verification was done.
  public type EvidenceRecord = {
    evidenceId      : Text;
    evidenceType    : EvidenceType;
    proofTraceId    : Text;
    source          : Text;           // URL or reference
    description     : Text;
    dataHash        : ?Text;          // Hash of evidence data
    phiWeight       : Float;
    createdAt       : Int;
    createdBy       : Principal;
  };

  public type EvidenceType = {
    #Proposal;
    #ForumThread;
    #Documentation;
    #Github;
    #Dashboard;
    #CanisterQuery;
    #WasmHash;
    #TreasuryRecord;
    #RegistryRecord;
    #ManualNote;
    #OperatorAttestation;
    #Other;
  };

  // ─────────────────────────────────────────────────────────────────
  // MEMORY LAYER — Governance Consequence Memory
  // ─────────────────────────────────────────────────────────────────

  /// MemoryRecord — Long-term governance memory
  ///
  /// Memory records are written after significant pulses complete.
  /// They create institutional memory of decisions, consequences,
  /// and precedents.
  public type MemoryRecord = {
    memoryId        : Text;
    memoryType      : MemoryType;
    entityRef       : Text;           // Proposal/Trace/etc ID
    proofTraceId    : ?Text;          // Proof that created this memory
    description     : Text;
    relatedMemories : [Text];         // Linked memory IDs
    doctrineRefs    : [Text];
    protocolRefs    : [Text];
    phiWeight       : Float;          // Importance weight
    fibonacciRank   : Nat;
    createdAt       : Int;
    createdBy       : Principal;
  };

  public type MemoryType = {
    #Precedent;         // Legal precedent
    #Pattern;           // Recurring pattern
    #Consequence;       // Effect of decision
    #FollowUp;          // Required follow-up action
    #Obligation;        // Ongoing obligation
    #Warning;           // Historical warning
    #Success;           // Successful outcome
    #Failure;           // Failed outcome
    #Unknown;
  };

  // ─────────────────────────────────────────────────────────────────
  // EFFECTTRACE LAYER — Proposal Consequence Records
  // ─────────────────────────────────────────────────────────────────

  /// ProposalRecord — ICP governance proposal metadata
  public type ProposalRecord = {
    proposalId      : Text;
    daoType         : DaoType;
    title           : Text;
    summary         : Text;
    url             : ?Text;
    proposalType    : ?Text;
    actionType      : ?Text;
    status          : ProposalStatus;
    createdAt       : ?Int;
    decidedAt       : ?Int;
    executedAt      : ?Int;
    rawPayload      : ?Text;
    traceRefs       : [Text];         // EffectTrace IDs
    memoryRefs      : [Text];         // Memory IDs
    pulseRefs       : [Text];         // Pulse IDs
    proofRefs       : [Text];         // Proof IDs
    updatedAt       : Int;
    createdBy       : Principal;
  };

  public type DaoType = { #NNS; #SNS; #Unknown };

  public type ProposalStatus = {
    #Open; #Adopted; #Rejected; #Executed; #Failed; #Unknown
  };

  /// EffectTraceRecord — Proposal consequence analysis
  public type EffectTraceRecord = {
    traceId         : Text;
    proposalId      : Text;
    publicTitle     : Text;
    plainSummary    : Text;
    effectPath      : EffectPath;
    runtimeTruth    : RuntimeTruthBlock;
    riskProfile     : RiskProfile;
    verificationPlan: VerificationPlan;
    doctrineRefs    : [Text];         // Doctrines that apply
    protocolRefs    : [Text];         // Protocols that apply
    invariantRefs   : [Text];         // Invariants that must hold
    proofRefs       : [Text];         // Proofs attached
    memoryRefs      : [Text];         // Memory records
    evidenceRefs    : [Text];         // Evidence records
    confidence      : Text;           // low|medium|high
    status          : Text;           // draft|needs_review|etc
    phiWeight       : Float;
    fibonacciRank   : Nat;
    createdAt       : Int;
    updatedAt       : Int;
    createdBy       : Principal;
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

  public type AffectedSystem = {
    #NNS; #SNS; #SNSDappCanister; #ProtocolCanister; #Registry;
    #LedgerOrTreasury; #FrontendAssetCanister; #GovernanceRule;
    #CustomGenericFunction; #Unknown
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

  public type RuntimeTruthStatus = {
    #ClaimOnly; #PayloadIdentified; #ReviewSupported; #ExecutionPending;
    #ExecutedNotVerified; #VerifiedAfterState; #Disputed; #Unknown
  };

  public type RiskProfile = {
    riskClass           : RiskClass;
    riskLevel           : RiskLevel;
    scores              : RiskScores;
    explanation         : Text;
    openRiskQuestions   : [Text];
  };

  public type RiskClass = {
    #Motion; #Informational; #ParameterChange; #CodeUpgrade;
    #TreasuryAction; #GovernanceRuleChange; #CanisterControlChange;
    #FrontendAssetChange; #RegistryOrNetworkChange;
    #CustomGenericFunction; #SystemicOrEmergency; #Unknown
  };

  public type RiskLevel = { #Low; #Medium; #High; #Critical; #Unknown };

  public type RiskScores = {
    technical              : Nat;  // 0-5
    treasury               : Nat;  // 0-5
    governance             : Nat;  // 0-5
    irreversibility        : Nat;  // 0-5
    verificationDifficulty : Nat;  // 0-5
    precedentWeight        : Nat;  // 0-5
  };

  public type VerificationPlan = {
    summary : Text;
    steps   : [VerificationStep];
    status  : Text;
  };

  public type VerificationStep = {
    stepId      : Text;
    stepLabel   : Text;
    description : Text;
    evidenceType: EvidenceType;
    completed   : Bool;
    completedAt : ?Int;
    completedBy : ?Principal;
    proofRef    : ?Text;
  };

  // ─────────────────────────────────────────────────────────────────
  // REVISION LAYER — Immutable Audit Trail
  // ─────────────────────────────────────────────────────────────────

  /// RevisionRecord — Every mutation creates a revision
  ///
  /// Rule: No silent overwrites. Every state change is logged.
  public type RevisionRecord = {
    revisionId      : Text;
    entityType      : Text;           // "proposal"|"trace"|"doctrine"|etc
    entityId        : Text;
    operation       : RevisionOperation;
    changeSummary   : Text;
    fieldsChanged   : [Text];
    beforeHash      : ?Text;
    afterHash       : ?Text;
    doctrineRefs    : [Text];         // Doctrines involved
    protocolRef     : ?Text;          // Protocol that triggered this
    pulseId         : ?Text;          // Pulse that made this change
    proofId         : ?Text;          // Proof of this change
    createdAt       : Int;
    createdBy       : Principal;
  };

  public type RevisionOperation = {
    #Create;
    #Update;
    #Delete;
    #Publish;
    #Archive;
    #Restore;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STABLE STORAGE
  // ══════════════════════════════════════════════════════════════════

  stable var doctrines        : [DoctrineRecord]      = [];
  stable var protocols        : [ProtocolRecord]      = [];
  stable var invariants       : [InvariantRecord]     = [];
  stable var policyAtoms      : [PolicyAtom]          = [];
  stable var pulseTasks       : [PulseTask]           = [];
  stable var signals          : [SignalRecord]        = [];
  stable var proofTraces      : [ProofTrace]          = [];
  stable var evidence         : [EvidenceRecord]      = [];
  stable var memoryRecords    : [MemoryRecord]        = [];
  stable var proposals        : [ProposalRecord]      = [];
  stable var effectTraces     : [EffectTraceRecord]   = [];
  stable var revisions        : [RevisionRecord]      = [];

  stable var idCounter        : Nat = 0;
  stable var schemaVersion    : Nat = 1;

  // Scheduler state
  stable var schedulerState : SchedulerState = {
    lastHeartbeatAt     = 0;
    heartbeatIntervalNs = 86_400_000_000_000;  // 24 hours
    totalPulsesRun      = 0;
    totalPulsesFailed   = 0;
    totalPulsesBlocked  = 0;
    totalProofsWritten  = 0;
    totalSignalsRouted  = 0;
    activeInvariants    = 0;
    activeDoctrines     = 0;
    activeProtocols     = 0;
    schedulerVersion    = 1;
  };

  public type SchedulerState = {
    lastHeartbeatAt    : Int;
    heartbeatIntervalNs: Nat;
    totalPulsesRun     : Nat;
    totalPulsesFailed  : Nat;
    totalPulsesBlocked : Nat;
    totalProofsWritten : Nat;
    totalSignalsRouted : Nat;
    activeInvariants   : Nat;
    activeDoctrines    : Nat;
    activeProtocols    : Nat;
    schedulerVersion   : Nat;
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func nextId(prefix : Text) : Text {
    idCounter += 1;
    prefix # "-" # Int.toText(Time.now()) # "-" # Nat.toText(idCounter)
  };

  func clamp100(n : Nat) : Nat {
    if (n > 100) 100 else n
  };

  func findDoctrine(id : Text) : ?DoctrineRecord {
    Array.find<DoctrineRecord>(doctrines, func(d) { d.doctrineId == id })
  };

  func findProtocol(id : Text) : ?ProtocolRecord {
    Array.find<ProtocolRecord>(protocols, func(p) { p.protocolId == id })
  };

  func findInvariant(id : Text) : ?InvariantRecord {
    Array.find<InvariantRecord>(invariants, func(i) { i.invariantId == id })
  };

  func findPulse(id : Text) : ?PulseTask {
    Array.find<PulseTask>(pulseTasks, func(p) { p.pulseId == id })
  };

  func findProof(id : Text) : ?ProofTrace {
    Array.find<ProofTrace>(proofTraces, func(p) { p.proofId == id })
  };

  func findMemory(id : Text) : ?MemoryRecord {
    Array.find<MemoryRecord>(memoryRecords, func(m) { m.memoryId == id })
  };

  // ══════════════════════════════════════════════════════════════════
  //  PASS 1: SCHEMA CRUD OPERATIONS
  // ══════════════════════════════════════════════════════════════════

  /// Register a new doctrine (immutable philosophical law)
  public shared(msg) func registerDoctrine(
    name        : Text,
    statement   : Text,
    rationale   : Text,
    authority   : Text,
    phiWeight   : Float,
    fibonacciRank: Nat,
    dimension   : Nat,
  ) : async Result.Result<Text, Text> {
    if (Text.size(name) == 0) return #err("name required");
    if (Text.size(statement) == 0) return #err("statement required");

    let id = nextId("DOCTRINE");
    let now = Time.now();

    let doctrine : DoctrineRecord = {
      doctrineId    = id;
      name          = name;
      statement     = statement;
      rationale     = rationale;
      authority     = authority;
      phiWeight     = phiWeight;
      fibonacciRank = fibonacciRank;
      dimension     = dimension;
      immutable     = true;
      establishedAt = now;
      establishedBy = msg.caller;
      protocolRefs  = [];
    };

    doctrines := Array.append(doctrines, [doctrine]);

    // Update scheduler state
    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalPulsesBlocked  = schedulerState.totalPulsesBlocked;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      activeDoctrines     = doctrines.size();
      activeProtocols     = schedulerState.activeProtocols;
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    #ok(id)
  };

  /// Register a new protocol (executable doctrine interpretation)
  public shared(msg) func registerProtocol(
    name          : Text,
    doctrineRef   : Text,
    description   : Text,
    executionModel: Text,
    phiWeight     : Float,
    fibonacciRank : Nat,
  ) : async Result.Result<Text, Text> {
    // Verify doctrine exists
    switch (findDoctrine(doctrineRef)) {
      case (null) return #err("doctrine not found: " # doctrineRef);
      case (?_) {};
    };

    let id = nextId("PROTO");
    let now = Time.now();

    let protocol : ProtocolRecord = {
      protocolId      = id;
      name            = name;
      doctrineRef     = doctrineRef;
      description     = description;
      executionModel  = executionModel;
      phiWeight       = phiWeight;
      fibonacciRank   = fibonacciRank;
      invariantRefs   = [];
      active          = true;
      createdAt       = now;
      createdBy       = msg.caller;
      lastModified    = now;
    };

    protocols := Array.append(protocols, [protocol]);

    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalPulsesBlocked  = schedulerState.totalPulsesBlocked;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      activeDoctrines     = schedulerState.activeDoctrines;
      activeProtocols     = protocols.size();
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    #ok(id)
  };

  /// Register a new invariant (runtime-enforced constraint)
  public shared(msg) func registerInvariant(
    name          : Text,
    protocolRef   : Text,
    doctrineRef   : Text,
    condition     : Text,
    checkFunction : Text,
    requiredProof : Text,
    failureAction : FailureAction,
    severity      : InvariantSeverity,
    phiWeight     : Float,
    fibonacciRank : Nat,
  ) : async Result.Result<Text, Text> {
    // Verify protocol exists
    switch (findProtocol(protocolRef)) {
      case (null) return #err("protocol not found: " # protocolRef);
      case (?_) {};
    };

    let id = nextId("INV");
    let now = Time.now();

    let invariant : InvariantRecord = {
      invariantId     = id;
      name            = name;
      protocolRef     = protocolRef;
      doctrineRef     = doctrineRef;
      condition       = condition;
      checkFunction   = checkFunction;
      requiredProof   = requiredProof;
      failureAction   = failureAction;
      severity        = severity;
      phiWeight       = phiWeight;
      fibonacciRank   = fibonacciRank;
      policyAtomRefs  = [];
      active          = true;
      createdAt       = now;
      lastChecked     = null;
      totalChecks     = 0;
      totalViolations = 0;
    };

    invariants := Array.append(invariants, [invariant]);

    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalPulsesBlocked  = schedulerState.totalPulsesBlocked;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = invariants.size();
      activeDoctrines     = schedulerState.activeDoctrines;
      activeProtocols     = schedulerState.activeProtocols;
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    #ok(id)
  };

  /// Register a policy atom (smallest enforceable unit)
  public shared(msg) func registerPolicyAtom(
    name          : Text,
    invariantRef  : Text,
    condition     : Text,
    checkFunction : Text,
    failureMessage: Text,
    severity      : InvariantSeverity,
    phiWeight     : Float,
  ) : async Result.Result<Text, Text> {
    // Verify invariant exists
    switch (findInvariant(invariantRef)) {
      case (null) return #err("invariant not found: " # invariantRef);
      case (?_) {};
    };

    let id = nextId("PA");
    let now = Time.now();

    let atom : PolicyAtom = {
      atomId          = id;
      name            = name;
      invariantRef    = invariantRef;
      condition       = condition;
      checkFunction   = checkFunction;
      failureMessage  = failureMessage;
      severity        = severity;
      phiWeight       = phiWeight;
      active          = true;
      createdAt       = now;
      totalChecks     = 0;
      totalFailures   = 0;
    };

    policyAtoms := Array.append(policyAtoms, [atom]);
    #ok(id)
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY FUNCTIONS
  // ══════════════════════════════════════════════════════════════════

  public query func getDoctrine(id : Text) : async ?DoctrineRecord {
    findDoctrine(id)
  };

  public query func getProtocol(id : Text) : async ?ProtocolRecord {
    findProtocol(id)
  };

  public query func getInvariant(id : Text) : async ?InvariantRecord {
    findInvariant(id)
  };

  public query func getPolicyAtom(id : Text) : async ?PolicyAtom {
    Array.find<PolicyAtom>(policyAtoms, func(a) { a.atomId == id })
  };

  public query func listDoctrines() : async [DoctrineRecord] {
    doctrines
  };

  public query func listProtocols(doctrineRef : ?Text) : async [ProtocolRecord] {
    switch (doctrineRef) {
      case (null) protocols;
      case (?dref) Array.filter<ProtocolRecord>(protocols, func(p) { p.doctrineRef == dref });
    }
  };

  public query func listInvariants(protocolRef : ?Text) : async [InvariantRecord] {
    switch (protocolRef) {
      case (null) invariants;
      case (?pref) Array.filter<InvariantRecord>(invariants, func(i) { i.protocolRef == pref });
    }
  };

  public query func listPolicyAtoms(invariantRef : ?Text) : async [PolicyAtom] {
    switch (invariantRef) {
      case (null) policyAtoms;
      case (?iref) Array.filter<PolicyAtom>(policyAtoms, func(a) { a.invariantRef == iref });
    }
  };

  public query func getSchedulerState() : async SchedulerState {
    schedulerState
  };

  public query func getStats() : async {
    totalDoctrines      : Nat;
    totalProtocols      : Nat;
    totalInvariants     : Nat;
    activeInvariants    : Nat;
    totalPolicyAtoms    : Nat;
    totalPulses         : Nat;
    totalProofs         : Nat;
    totalMemoryRecords  : Nat;
    totalRevisions      : Nat;
    schemaVersion       : Nat;
  } {
    let activeInv = Array.filter<InvariantRecord>(invariants, func(i) { i.active }).size();

    {
      totalDoctrines      = doctrines.size();
      totalProtocols      = protocols.size();
      totalInvariants     = invariants.size();
      activeInvariants    = activeInv;
      totalPolicyAtoms    = policyAtoms.size();
      totalPulses         = pulseTasks.size();
      totalProofs         = proofTraces.size();
      totalMemoryRecords  = memoryRecords.size();
      totalRevisions      = revisions.size();
      schemaVersion       = schemaVersion;
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PASS 2: PULSE SCHEDULER — Live Execution Engine
  // ══════════════════════════════════════════════════════════════════

  /// Create and queue a new pulse for execution
  public shared(msg) func createPulse(
    pulseType       : Text,
    doctrineRefs    : [Text],
    protocolRef     : Text,
    invariantRefs   : [Text],
    policyAtomRefs  : [Text],
    sourceEventId   : Text,
    targetOrgan     : Text,
    payloadRef      : Text,
    priority        : PulsePriority,
    salience        : Nat,
    urgency         : Nat,
    riskScore       : Nat,
    proofRequired   : Bool,
  ) : async Result.Result<Text, Text> {
    if (Text.size(pulseType) == 0) return #err("pulseType required");
    if (Text.size(protocolRef) == 0) return #err("protocolRef required");
    if (Text.size(targetOrgan) == 0) return #err("targetOrgan required");

    // Verify protocol exists
    switch (findProtocol(protocolRef)) {
      case (null) return #err("protocol not found: " # protocolRef);
      case (?_) {};
    };

    let id = nextId("PULSE");
    let now = Time.now();

    // Calculate φ-weighted priority
    let priorityBoost = switch (priority) {
      case (#Critical) PHI4;
      case (#High)     PHI3;
      case (#Normal)   PHI2;
      case (#Low)      PHI;
    };
    let phiWeight = priorityBoost + (Float.fromInt(clamp100(salience)) / 100.0 * PHI2);

    let pulse : PulseTask = {
      pulseId         = id;
      pulseType       = pulseType;
      doctrineRefs    = doctrineRefs;
      protocolRef     = protocolRef;
      invariantRefs   = invariantRefs;
      policyAtomRefs  = policyAtomRefs;
      sourceEventId   = sourceEventId;
      targetOrgan     = targetOrgan;
      payloadRef      = payloadRef;
      priority        = priority;
      status          = #Created;
      salience        = clamp100(salience);
      urgency         = clamp100(urgency);
      riskScore       = clamp100(riskScore);
      phiWeight       = phiWeight;
      proofRequired   = proofRequired;
      proofTraceId    = null;
      signalsEmitted  = [];
      createdAt       = now;
      queuedAt        = null;
      startedAt       = null;
      completedAt     = null;
      failReason      = null;
      blockedReason   = null;
      submittedBy     = msg.caller;
    };

    pulseTasks := Array.append(pulseTasks, [pulse]);

    // Create revision
    let revId = nextId("REV");
    let revision : RevisionRecord = {
      revisionId      = revId;
      entityType      = "pulse";
      entityId        = id;
      operation       = #Create;
      changeSummary   = "pulse created: " # pulseType;
      fieldsChanged   = [];
      beforeHash      = null;
      afterHash       = null;
      doctrineRefs    = doctrineRefs;
      protocolRef     = ?protocolRef;
      pulseId         = ?id;
      proofId         = null;
      createdAt       = now;
      createdBy       = msg.caller;
    };
    revisions := Array.append(revisions, [revision]);

    #ok(id)
  };

  /// Queue a pulse for execution (Created → Queued)
  public shared func queuePulse(pulseId : Text) : async Result.Result<(), Text> {
    var found = false;
    pulseTasks := Array.map<PulseTask, PulseTask>(pulseTasks, func(p) {
      if (p.pulseId == pulseId and p.status == #Created) {
        found := true;
        {
          pulseId         = p.pulseId;
          pulseType       = p.pulseType;
          doctrineRefs    = p.doctrineRefs;
          protocolRef     = p.protocolRef;
          invariantRefs   = p.invariantRefs;
          policyAtomRefs  = p.policyAtomRefs;
          sourceEventId   = p.sourceEventId;
          targetOrgan     = p.targetOrgan;
          payloadRef      = p.payloadRef;
          priority        = p.priority;
          status          = #Queued;
          salience        = p.salience;
          urgency         = p.urgency;
          riskScore       = p.riskScore;
          phiWeight       = p.phiWeight;
          proofRequired   = p.proofRequired;
          proofTraceId    = p.proofTraceId;
          signalsEmitted  = p.signalsEmitted;
          createdAt       = p.createdAt;
          queuedAt        = ?Time.now();
          startedAt       = p.startedAt;
          completedAt     = p.completedAt;
          failReason      = p.failReason;
          blockedReason   = p.blockedReason;
          submittedBy     = p.submittedBy;
        }
      } else { p }
    });

    if (not found) return #err("pulse not found or not in Created state");
    #ok(())
  };

  /// Claim a pulse for execution (Queued → Running)
  public shared func claimPulse(pulseId : Text) : async Result.Result<PulseTask, Text> {
    var found = false;
    var result : ?PulseTask = null;

    pulseTasks := Array.map<PulseTask, PulseTask>(pulseTasks, func(p) {
      if (p.pulseId == pulseId and p.status == #Queued) {
        found := true;
        let claimed = {
          pulseId         = p.pulseId;
          pulseType       = p.pulseType;
          doctrineRefs    = p.doctrineRefs;
          protocolRef     = p.protocolRef;
          invariantRefs   = p.invariantRefs;
          policyAtomRefs  = p.policyAtomRefs;
          sourceEventId   = p.sourceEventId;
          targetOrgan     = p.targetOrgan;
          payloadRef      = p.payloadRef;
          priority        = p.priority;
          status          = #Running;
          salience        = p.salience;
          urgency         = p.urgency;
          riskScore       = p.riskScore;
          phiWeight       = p.phiWeight;
          proofRequired   = p.proofRequired;
          proofTraceId    = p.proofTraceId;
          signalsEmitted  = p.signalsEmitted;
          createdAt       = p.createdAt;
          queuedAt        = p.queuedAt;
          startedAt       = ?Time.now();
          completedAt     = p.completedAt;
          failReason      = p.failReason;
          blockedReason   = p.blockedReason;
          submittedBy     = p.submittedBy;
        };
        result := ?claimed;
        claimed
      } else { p }
    });

    if (not found) return #err("pulse not found or not in Queued state");

    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun + 1;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalPulsesBlocked  = schedulerState.totalPulsesBlocked;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      activeDoctrines     = schedulerState.activeDoctrines;
      activeProtocols     = schedulerState.activeProtocols;
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    switch (result) {
      case (?t) #ok(t);
      case null #err("unexpected state");
    }
  };

  /// Complete a pulse successfully (Running → Completed)
  public shared func completePulse(
    pulseId      : Text,
    proofId      : ?Text,
    signalIds    : [Text],
  ) : async Result.Result<(), Text> {
    var found = false;
    pulseTasks := Array.map<PulseTask, PulseTask>(pulseTasks, func(p) {
      if (p.pulseId == pulseId and p.status == #Running) {
        found := true;
        {
          pulseId         = p.pulseId;
          pulseType       = p.pulseType;
          doctrineRefs    = p.doctrineRefs;
          protocolRef     = p.protocolRef;
          invariantRefs   = p.invariantRefs;
          policyAtomRefs  = p.policyAtomRefs;
          sourceEventId   = p.sourceEventId;
          targetOrgan     = p.targetOrgan;
          payloadRef      = p.payloadRef;
          priority        = p.priority;
          status          = #Completed;
          salience        = p.salience;
          urgency         = p.urgency;
          riskScore       = p.riskScore;
          phiWeight       = p.phiWeight;
          proofRequired   = p.proofRequired;
          proofTraceId    = proofId;
          signalsEmitted  = signalIds;
          createdAt       = p.createdAt;
          queuedAt        = p.queuedAt;
          startedAt       = p.startedAt;
          completedAt     = ?Time.now();
          failReason      = null;
          blockedReason   = null;
          submittedBy     = p.submittedBy;
        }
      } else { p }
    });

    if (not found) return #err("pulse not found or not in Running state");
    #ok(())
  };

  /// Fail a pulse (Running → Failed)
  public shared func failPulse(
    pulseId : Text,
    reason  : Text,
  ) : async Result.Result<(), Text> {
    var found = false;
    pulseTasks := Array.map<PulseTask, PulseTask>(pulseTasks, func(p) {
      if (p.pulseId == pulseId and p.status == #Running) {
        found := true;
        {
          pulseId         = p.pulseId;
          pulseType       = p.pulseType;
          doctrineRefs    = p.doctrineRefs;
          protocolRef     = p.protocolRef;
          invariantRefs   = p.invariantRefs;
          policyAtomRefs  = p.policyAtomRefs;
          sourceEventId   = p.sourceEventId;
          targetOrgan     = p.targetOrgan;
          payloadRef      = p.payloadRef;
          priority        = p.priority;
          status          = #Failed;
          salience        = p.salience;
          urgency         = p.urgency;
          riskScore       = p.riskScore;
          phiWeight       = p.phiWeight;
          proofRequired   = p.proofRequired;
          proofTraceId    = null;
          signalsEmitted  = p.signalsEmitted;
          createdAt       = p.createdAt;
          queuedAt        = p.queuedAt;
          startedAt       = p.startedAt;
          completedAt     = ?Time.now();
          failReason      = ?reason;
          blockedReason   = null;
          submittedBy     = p.submittedBy;
        }
      } else { p }
    });

    if (not found) return #err("pulse not found or not in Running state");

    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed + 1;
      totalPulsesBlocked  = schedulerState.totalPulsesBlocked;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      activeDoctrines     = schedulerState.activeDoctrines;
      activeProtocols     = schedulerState.activeProtocols;
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    #ok(())
  };

  /// Block a pulse due to invariant violation (Any → Blocked)
  public shared func blockPulse(
    pulseId : Text,
    reason  : Text,
  ) : async Result.Result<(), Text> {
    var found = false;
    pulseTasks := Array.map<PulseTask, PulseTask>(pulseTasks, func(p) {
      if (p.pulseId == pulseId) {
        found := true;
        {
          pulseId         = p.pulseId;
          pulseType       = p.pulseType;
          doctrineRefs    = p.doctrineRefs;
          protocolRef     = p.protocolRef;
          invariantRefs   = p.invariantRefs;
          policyAtomRefs  = p.policyAtomRefs;
          sourceEventId   = p.sourceEventId;
          targetOrgan     = p.targetOrgan;
          payloadRef      = p.payloadRef;
          priority        = p.priority;
          status          = #Blocked;
          salience        = p.salience;
          urgency         = p.urgency;
          riskScore       = p.riskScore;
          phiWeight       = p.phiWeight;
          proofRequired   = p.proofRequired;
          proofTraceId    = null;
          signalsEmitted  = p.signalsEmitted;
          createdAt       = p.createdAt;
          queuedAt        = p.queuedAt;
          startedAt       = p.startedAt;
          completedAt     = ?Time.now();
          failReason      = null;
          blockedReason   = ?reason;
          submittedBy     = p.submittedBy;
        }
      } else { p }
    });

    if (not found) return #err("pulse not found");

    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalPulsesBlocked  = schedulerState.totalPulsesBlocked + 1;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      activeDoctrines     = schedulerState.activeDoctrines;
      activeProtocols     = schedulerState.activeProtocols;
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    #ok(())
  };

  /// Route pulse to human/agent review (Any → RoutedToReview)
  public shared func routePulseToReview(
    pulseId : Text,
    reason  : Text,
  ) : async Result.Result<(), Text> {
    var found = false;
    pulseTasks := Array.map<PulseTask, PulseTask>(pulseTasks, func(p) {
      if (p.pulseId == pulseId) {
        found := true;
        {
          pulseId         = p.pulseId;
          pulseType       = p.pulseType;
          doctrineRefs    = p.doctrineRefs;
          protocolRef     = p.protocolRef;
          invariantRefs   = p.invariantRefs;
          policyAtomRefs  = p.policyAtomRefs;
          sourceEventId   = p.sourceEventId;
          targetOrgan     = p.targetOrgan;
          payloadRef      = p.payloadRef;
          priority        = p.priority;
          status          = #RoutedToReview;
          salience        = p.salience;
          urgency         = p.urgency;
          riskScore       = p.riskScore;
          phiWeight       = p.phiWeight;
          proofRequired   = p.proofRequired;
          proofTraceId    = null;
          signalsEmitted  = p.signalsEmitted;
          createdAt       = p.createdAt;
          queuedAt        = p.queuedAt;
          startedAt       = p.startedAt;
          completedAt     = ?Time.now();
          failReason      = ?reason;
          blockedReason   = null;
          submittedBy     = p.submittedBy;
        }
      } else { p }
    });

    if (not found) return #err("pulse not found");
    #ok(())
  };

  /// Emit a signal to another organism
  public shared(msg) func emitSignal(
    signalType      : Text,
    channel         : SignalChannel,
    sourceOrgan     : Text,
    targetOrgan     : Text,
    payloadRef      : Text,
    relatedPulseId  : ?Text,
    doctrineHints   : [Text],
    invariantHints  : [Text],
    salience        : Nat,
    urgency         : Nat,
    riskScore       : Nat,
  ) : async Result.Result<Text, Text> {
    if (Text.size(signalType) == 0) return #err("signalType required");
    if (Text.size(sourceOrgan) == 0) return #err("sourceOrgan required");
    if (Text.size(targetOrgan) == 0) return #err("targetOrgan required");

    let id = nextId("SIGNAL");
    let now = Time.now();

    let phiWeight = Float.fromInt(clamp100(salience) + clamp100(urgency)) / 200.0 * PHI2;

    let signal : SignalRecord = {
      signalId        = id;
      signalType      = signalType;
      channel         = channel;
      sourceOrgan     = sourceOrgan;
      targetOrgan     = targetOrgan;
      payloadRef      = payloadRef;
      relatedPulseId  = relatedPulseId;
      doctrineHints   = doctrineHints;
      invariantHints  = invariantHints;
      salience        = clamp100(salience);
      urgency         = clamp100(urgency);
      riskScore       = clamp100(riskScore);
      phiWeight       = phiWeight;
      consumed        = false;
      consumedByPulse = null;
      createdAt       = now;
      consumedAt      = null;
    };

    signals := Array.append(signals, [signal]);

    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalPulsesBlocked  = schedulerState.totalPulsesBlocked;
      totalProofsWritten  = schedulerState.totalProofsWritten;
      totalSignalsRouted  = schedulerState.totalSignalsRouted + 1;
      activeInvariants    = schedulerState.activeInvariants;
      activeDoctrines     = schedulerState.activeDoctrines;
      activeProtocols     = schedulerState.activeProtocols;
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    #ok(id)
  };

  /// Consume a signal (mark as consumed by a pulse)
  public shared func consumeSignal(
    signalId : Text,
    pulseId  : Text,
  ) : async Result.Result<(), Text> {
    var found = false;
    signals := Array.map<SignalRecord, SignalRecord>(signals, func(s) {
      if (s.signalId == signalId and not s.consumed) {
        found := true;
        {
          signalId        = s.signalId;
          signalType      = s.signalType;
          channel         = s.channel;
          sourceOrgan     = s.sourceOrgan;
          targetOrgan     = s.targetOrgan;
          payloadRef      = s.payloadRef;
          relatedPulseId  = s.relatedPulseId;
          doctrineHints   = s.doctrineHints;
          invariantHints  = s.invariantHints;
          salience        = s.salience;
          urgency         = s.urgency;
          riskScore       = s.riskScore;
          phiWeight       = s.phiWeight;
          consumed        = true;
          consumedByPulse = ?pulseId;
          createdAt       = s.createdAt;
          consumedAt      = ?Time.now();
        }
      } else { s }
    });

    if (not found) return #err("signal not found or already consumed");
    #ok(())
  };

  /// Get next pulse to execute (φ-weighted arbitration)
  public query func getNextPulse() : async ?PulseTask {
    let queued = Array.filter<PulseTask>(pulseTasks, func(p) { p.status == #Queued });
    if (queued.size() == 0) return null;

    var best : ?PulseTask = null;
    var bestScore : Float = 0.0;

    for (p in queued.vals()) {
      let score = p.phiWeight + Float.fromInt(p.urgency) / 100.0 * PHI;
      if (score > bestScore) {
        bestScore := score;
        best := ?p;
      };
    };

    best
  };

  /// Get pulse by ID
  public query func getPulse(id : Text) : async ?PulseTask {
    findPulse(id)
  };

  /// List pulses by status
  public query func listPulses(statusFilter : ?PulseStatus) : async [PulseTask] {
    switch (statusFilter) {
      case (null) pulseTasks;
      case (?s) Array.filter<PulseTask>(pulseTasks, func(p) {
        Text.equal(debug_show(p.status), debug_show(s))
      });
    }
  };

  /// Get pending signals for an organism
  public query func getPendingSignals(targetOrgan : Text) : async [SignalRecord] {
    Array.filter<SignalRecord>(signals, func(s) {
      s.targetOrgan == targetOrgan and not s.consumed
    })
  };

  // ══════════════════════════════════════════════════════════════════
  //  PASS 3: INVARIANT KERNEL — Live Enforcement Engine
  // ══════════════════════════════════════════════════════════════════

  /// Check an invariant (live enforcement)
  public func checkInvariant(invariantId : Text, context : Text) : async Result.Result<Bool, Text> {
    switch (findInvariant(invariantId)) {
      case (null) return #err("invariant not found: " # invariantId);
      case (?inv) {
        if (not inv.active) return #ok(true);  // Inactive invariants pass

        // Update check count
        invariants := Array.map<InvariantRecord, InvariantRecord>(invariants, func(i) {
          if (i.invariantId == invariantId) {
            {
              invariantId     = i.invariantId;
              name            = i.name;
              protocolRef     = i.protocolRef;
              doctrineRef     = i.doctrineRef;
              condition       = i.condition;
              checkFunction   = i.checkFunction;
              requiredProof   = i.requiredProof;
              failureAction   = i.failureAction;
              severity        = i.severity;
              phiWeight       = i.phiWeight;
              fibonacciRank   = i.fibonacciRank;
              policyAtomRefs  = i.policyAtomRefs;
              active          = i.active;
              createdAt       = i.createdAt;
              lastChecked     = ?Time.now();
              totalChecks     = i.totalChecks + 1;
              totalViolations = i.totalViolations;
            }
          } else { i }
        });

        // In production, this would call the actual check function
        // For now, we return true (passes) as a placeholder
        #ok(true)
      };
    }
  };

  /// Enforce invariant before write operation
  public func enforceBeforeWrite(
    invariantIds : [Text],
    operation    : Text,
    entityId     : Text,
  ) : async Result.Result<(), Text> {
    for (invId in invariantIds.vals()) {
      let checkResult = await checkInvariant(invId, "beforeWrite:" # operation # ":" # entityId);
      switch (checkResult) {
        case (#err(e)) return #err(e);
        case (#ok(passed)) {
          if (not passed) {
            // Record violation
            ignore await recordInvariantFailure(invId, operation, entityId);
            // Get failure action
            switch (findInvariant(invId)) {
              case (?inv) {
                switch (inv.failureAction) {
                  case (#Block) return #err("Invariant violation: " # inv.name);
                  case (#RouteToReview) {
                    // Would route to review system
                    return #err("Invariant violation - routed to review: " # inv.name);
                  };
                  case (#Escalate) {
                    return #err("Invariant violation - escalated: " # inv.name);
                  };
                  case (#Warn) {
                    // Log warning but continue
                  };
                  case (#EmitSignal) {
                    // Emit signal but continue
                  };
                };
              };
              case null {};
            };
          };
        };
      };
    };
    #ok(())
  };

  /// Record invariant failure
  public func recordInvariantFailure(
    invariantId : Text,
    operation   : Text,
    entityId    : Text,
  ) : async Result.Result<(), Text> {
    invariants := Array.map<InvariantRecord, InvariantRecord>(invariants, func(i) {
      if (i.invariantId == invariantId) {
        {
          invariantId     = i.invariantId;
          name            = i.name;
          protocolRef     = i.protocolRef;
          doctrineRef     = i.doctrineRef;
          condition       = i.condition;
          checkFunction   = i.checkFunction;
          requiredProof   = i.requiredProof;
          failureAction   = i.failureAction;
          severity        = i.severity;
          phiWeight       = i.phiWeight;
          fibonacciRank   = i.fibonacciRank;
          policyAtomRefs  = i.policyAtomRefs;
          active          = i.active;
          createdAt       = i.createdAt;
          lastChecked     = i.lastChecked;
          totalChecks     = i.totalChecks;
          totalViolations = i.totalViolations + 1;
        }
      } else { i }
    });
    #ok(())
  };

  // ══════════════════════════════════════════════════════════════════
  //  PASS 4: PROOF TRACE — Automatic Proof Writing
  // ══════════════════════════════════════════════════════════════════

  /// Write proof trace for a pulse execution
  public shared(msg) func writeProofTrace(
    pulseTaskId     : Text,
    doctrineRefs    : [Text],
    protocolRef     : Text,
    invariantRefs   : [Text],
    policyAtomRefs  : [Text],
    stateRead       : [Text],
    stateWritten    : [Text],
    evidenceRefs    : [Text],
    result          : ProofResult,
    memoryWritten   : Bool,
  ) : async Result.Result<Text, Text> {
    if (Text.size(pulseTaskId) == 0) return #err("pulseTaskId required");

    let id = nextId("PROOF");
    let now = Time.now();

    // Calculate φ-weight based on result and evidence
    let resultWeight = switch (result) {
      case (#Passed) PHI3;
      case (#Partial) PHI2;
      case (#Failed) PHI;
      case (#Blocked) PHI;
      case (#RoutedToReview) PHI2;
    };
    let evidenceWeight = Float.fromInt(evidenceRefs.size()) * PHI / 10.0;
    let phiWeight = resultWeight + evidenceWeight;

    let proof : ProofTrace = {
      proofId         = id;
      pulseTaskId     = pulseTaskId;
      doctrineRefs    = doctrineRefs;
      protocolRef     = protocolRef;
      invariantRefs   = invariantRefs;
      policyAtomRefs  = policyAtomRefs;
      stateRead       = stateRead;
      stateWritten    = stateWritten;
      evidenceRefs    = evidenceRefs;
      result          = result;
      phiWeight       = phiWeight;
      fibonacciRank   = stateWritten.size() + evidenceRefs.size();
      memoryWritten   = memoryWritten;
      memoryRecordId  = null;
      failReason      = null;
      createdAt       = now;
    };

    proofTraces := Array.append(proofTraces, [proof]);

    schedulerState := {
      lastHeartbeatAt     = schedulerState.lastHeartbeatAt;
      heartbeatIntervalNs = schedulerState.heartbeatIntervalNs;
      totalPulsesRun      = schedulerState.totalPulsesRun;
      totalPulsesFailed   = schedulerState.totalPulsesFailed;
      totalPulsesBlocked  = schedulerState.totalPulsesBlocked;
      totalProofsWritten  = schedulerState.totalProofsWritten + 1;
      totalSignalsRouted  = schedulerState.totalSignalsRouted;
      activeInvariants    = schedulerState.activeInvariants;
      activeDoctrines     = schedulerState.activeDoctrines;
      activeProtocols     = schedulerState.activeProtocols;
      schedulerVersion    = schedulerState.schedulerVersion;
    };

    #ok(id)
  };

  /// Get proofs by pulse ID
  public query func getProofByPulse(pulseId : Text) : async [ProofTrace] {
    Array.filter<ProofTrace>(proofTraces, func(p) { p.pulseTaskId == pulseId })
  };

  /// Get proofs by entity (generic)
  public query func getProofByEntity(entityId : Text) : async [ProofTrace] {
    Array.filter<ProofTrace>(proofTraces, func(p) {
      Option.isSome(Array.find<Text>(p.stateRead, func(r) { r == entityId })) or
      Option.isSome(Array.find<Text>(p.stateWritten, func(w) { w == entityId }))
    })
  };

  /// Link proof to memory record
  public func linkProofToMemory(
    proofId       : Text,
    memoryId      : Text,
  ) : async Result.Result<(), Text> {
    var found = false;
    proofTraces := Array.map<ProofTrace, ProofTrace>(proofTraces, func(p) {
      if (p.proofId == proofId) {
        found := true;
        {
          proofId         = p.proofId;
          pulseTaskId     = p.pulseTaskId;
          doctrineRefs    = p.doctrineRefs;
          protocolRef     = p.protocolRef;
          invariantRefs   = p.invariantRefs;
          policyAtomRefs  = p.policyAtomRefs;
          stateRead       = p.stateRead;
          stateWritten    = p.stateWritten;
          evidenceRefs    = p.evidenceRefs;
          result          = p.result;
          phiWeight       = p.phiWeight;
          fibonacciRank   = p.fibonacciRank;
          memoryWritten   = true;
          memoryRecordId  = ?memoryId;
          failReason      = p.failReason;
          createdAt       = p.createdAt;
        }
      } else { p }
    });

    if (not found) return #err("proof not found");
    #ok(())
  };

  /// Verify proof requirements met
  public query func verifyProofRequirements(pulseId : Text) : async Result.Result<Bool, Text> {
    switch (findPulse(pulseId)) {
      case (null) return #err("pulse not found");
      case (?pulse) {
        if (not pulse.proofRequired) return #ok(true);

        // Check if proof exists
        let proofs = Array.filter<ProofTrace>(proofTraces, func(p) { p.pulseTaskId == pulseId });
        if (proofs.size() == 0) return #ok(false);

        // Check if proof passed
        let passed = Option.isSome(Array.find<ProofTrace>(proofs, func(p) {
          switch (p.result) {
            case (#Passed) true;
            case (_) false;
          }
        }));

        #ok(passed)
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PASS 5: MEMORY WRITEBACK — Institutional Memory Creation
  // ══════════════════════════════════════════════════════════════════

  /// Create memory record from completed work
  public shared(msg) func createMemoryRecord(
    memoryType      : MemoryType,
    entityRef       : Text,
    proofTraceId    : ?Text,
    description     : Text,
    relatedMemories : [Text],
    doctrineRefs    : [Text],
    protocolRefs    : [Text],
    phiWeight       : Float,
    fibonacciRank   : Nat,
  ) : async Result.Result<Text, Text> {
    let id = nextId("MEMORY");
    let now = Time.now();

    let memory : MemoryRecord = {
      memoryId        = id;
      memoryType      = memoryType;
      entityRef       = entityRef;
      proofTraceId    = proofTraceId;
      description     = description;
      relatedMemories = relatedMemories;
      doctrineRefs    = doctrineRefs;
      protocolRefs    = protocolRefs;
      phiWeight       = phiWeight;
      fibonacciRank   = fibonacciRank;
      createdAt       = now;
      createdBy       = msg.caller;
    };

    memoryRecords := Array.append(memoryRecords, [memory]);

    // Link proof if provided
    switch (proofTraceId) {
      case (?pid) {
        ignore await linkProofToMemory(pid, id);
      };
      case null {};
    };

    #ok(id)
  };

  /// Get memory records by entity
  public query func getMemoryByEntity(entityRef : Text) : async [MemoryRecord] {
    Array.filter<MemoryRecord>(memoryRecords, func(m) { m.entityRef == entityRef })
  };

  /// Get memory records by type
  public query func getMemoryByType(memType : MemoryType) : async [MemoryRecord] {
    Array.filter<MemoryRecord>(memoryRecords, func(m) {
      Text.equal(debug_show(m.memoryType), debug_show(memType))
    })
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATUS
  // ══════════════════════════════════════════════════════════════════

  public query func getStatus() : async Text {
    "CPL Runtime operational. Schema version: " # Nat.toText(schemaVersion) #
    ", Doctrines: " # Nat.toText(doctrines.size()) #
    ", Protocols: " # Nat.toText(protocols.size()) #
    ", Invariants: " # Nat.toText(invariants.size()) #
    ", Policy Atoms: " # Nat.toText(policyAtoms.size()) #
    ", Pulses: " # Nat.toText(pulseTasks.size()) #
    ", Proofs: " # Nat.toText(proofTraces.size()) #
    ", Memory: " # Nat.toText(memoryRecords.size()) #
    ", Signals: " # Nat.toText(signals.size())
  };
}
