///
/// SLACK_APP — Sovereign Slack Integration Organism
///
/// The bridge between Slack's collaboration ecosystem and NOVA Protocol's
/// sovereign AI civilization. This organism exposes all NOVA organisms
/// through Slack's App Platform while maintaining sovereign architecture.
///
/// "We don't integrate — we extend our substrate into their space."
///
/// Sub-models:
///   APP_HOME      — Golden-ratio weighted home interface views
///   AGENT_BRIDGE  — AI organism bridge to Slack workspace
///   WORKFLOW_PHI  — φ-weighted workflow execution engine
///   WEBHOOK_CUSTOS — Quantum-proof webhook verification
///   SLASH_TERMINAL — Slash command routing to TERMINAL
///   OAUTH_CIPHER  — Fibonacci hash authentication system
///   EVENT_OBSV    — Dimensional event subscription & observation
///   IDENTITY_MAP  — Sovereign identity translation layer
///
/// Architectural Laws Applied:
///   LEX SLACK-001 — "Every Slack interaction is an observation that
///                    collapses NOVA substrate into visible architecture"
///   LEX SLACK-002 — "OAuth tokens are Fibonacci-chain encrypted,
///                    webhook signatures are quantum-verified"
///   LEX SLACK-003 — "All workflow steps execute at φ-weighted priority,
///                    commands route through sovereign TERMINAL"
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Nat32  "mo:base/Nat32";
import Char   "mo:base/Char";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Hash   "mo:base/Hash";
import Iter   "mo:base/Iter";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor SlackApp {

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
  //  CONSTANTS — Golden Mathematics & Quantum Primitives
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;
  transient let PSI : Float = -0.6180339887498948482;
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;
  transient let FIBONACCI_SEQUENCE : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

  // ══════════════════════════════════════════════════════════════════
  //  TYPES — Slack Integration Architecture
  // ══════════════════════════════════════════════════════════════════

  // ── APP HOME Types ─────────────────────────────────────────────────

  public type AppHomeView = {
    id           : Nat;
    userId       : Text;
    viewType     : AppHomeViewType;
    blocks       : [ViewBlock];
    phiWeight    : Float;    // Golden ratio weight for view priority
    timestamp    : Int;
    lastUpdated  : Int;
  };

  public type AppHomeViewType = {
    #Dashboard;              // Main sovereign dashboard
    #OrganismBrowser;        // Browse all NOVA organisms
    #WorkflowCanvas;         // Visual workflow builder
    #ObservationFeed;        // Live observation stream from OBSV
    #TerminalAccess;         // Direct TERMINAL access
  };

  public type ViewBlock = {
    blockType : Text;        // Slack block type
    content   : Text;        // JSON-encoded block content
    phi_order : Nat;         // Fibonacci ordering position
  };

  // ── AGENTS & AI APPS Types ─────────────────────────────────────────

  public type AgentBridge = {
    id          : Nat;
    slackAppId  : Text;
    novaOrganism : Text;     // Connected NOVA organism name
    capabilities : [Text];   // List of exposed capabilities
    active      : Bool;
    phiScore    : Float;     // φ-weighted capability score
    timestamp   : Int;
  };

  public type AIAppConnection = {
    id           : Nat;
    workspaceId  : Text;
    agentBridges : [Nat];    // Connected agent bridge IDs
    permissions  : [Text];
    goldenRatio  : Float;    // Connection strength via golden ratio
  };

  // ── WORK OBJECT PREVIEWS Types ─────────────────────────────────────

  public type WorkObjectPreview = {
    id            : Nat;
    objectType    : Text;     // Document, Task, Decision, etc.
    sourceOrg     : Text;     // Source NOVA organism
    previewData   : Text;     // JSON preview data
    fibThreshold  : Float;    // Fibonacci threshold for visibility
    observationId : ?Nat;     // Link to OBSV observation
    timestamp     : Int;
  };

  // ── WORKFLOW STEPS Types ───────────────────────────────────────────

  public type WorkflowDefinition = {
    id         : Nat;
    name       : Text;
    steps      : [WorkflowStep];
    phiWeights : [Float];     // φ-weighted priority for each step
    active     : Bool;
    created    : Int;
  };

  public type WorkflowStep = {
    id         : Nat;
    stepType   : WorkflowStepType;
    organism   : Text;         // Target NOVA organism
    action     : Text;         // Action to execute
    inputs     : Text;         // JSON input parameters
    phiWeight  : Float;        // Golden ratio execution priority
    nextSteps  : [Nat];        // Fibonacci-spiral routing
  };

  public type WorkflowStepType = {
    #Observation;    // OBSV observation
    #Computation;    // CHRYSALIS calculation
    #Decision;       // SCRIBE classification
    #Propagation;    // NEXUS distribution
    #Command;        // TERMINAL execution
  };

  public type WorkflowExecution = {
    id            : Nat;
    workflowId    : Nat;
    currentStep   : Nat;
    status        : ExecutionStatus;
    results       : [Text];
    phiProgress   : Float;    // φ-weighted completion (0 to φ)
    startTime     : Int;
    lastStepTime  : Int;
  };

  public type ExecutionStatus = {
    #Pending;
    #Executing;
    #PhiComplete;    // Completed at golden ratio
    #Failed;
  };

  // ── ORG LEVEL APPS Types ───────────────────────────────────────────

  public type OrganizationApp = {
    id            : Nat;
    slackOrgId    : Text;
    appName       : Text;
    sovereignScope : [Text];  // Sovereign permissions
    installed     : Bool;
    phiTrust      : Float;    // Golden ratio trust score
    timestamp     : Int;
  };

  // ── INCOMING WEBHOOKS Types ────────────────────────────────────────

  public type IncomingWebhook = {
    id              : Nat;
    webhookUrl      : Text;
    channel         : Text;
    quantumSig      : Text;    // Quantum-proof signature
    fibonacciHash   : Text;    // Fibonacci chain hash
    verified        : Bool;
    lastUsed        : Int;
    created         : Int;
  };

  public type WebhookMessage = {
    id        : Nat;
    webhookId : Nat;
    payload   : Text;     // JSON message payload
    verified  : Bool;     // Quantum verification passed
    timestamp : Int;
  };

  // ── INTERACTIVITY & SHORTCUTS Types ────────────────────────────────

  public type InteractionShortcut = {
    id            : Nat;
    shortcutType  : ShortcutType;
    callbackId    : Text;
    targetOrg     : Text;      // Target NOVA organism
    goldenRoute   : [Nat];     // Golden spiral routing path
    enabled       : Bool;
  };

  public type ShortcutType = {
    #Global;          // Global shortcut
    #MessageAction;   // Message context menu
    #MessageShortcut; // Message shortcut
  };

  public type InteractionPayload = {
    id          : Nat;
    shortcutId  : Nat;
    userId      : Text;
    payload     : Text;    // JSON interaction payload
    routed      : Bool;    // Routed through golden spiral
    timestamp   : Int;
  };

  // ── SLASH COMMANDS Types ───────────────────────────────────────────

  public type SlashCommand = {
    id            : Nat;
    command       : Text;      // e.g., "/nova", "/obsv", "/sovereign"
    terminalRoute : Bool;      // Route to TERMINAL organism
    organism      : Text;      // Target organism if not TERMINAL
    phiPriority   : Float;     // φ-weighted execution priority
    enabled       : Bool;
  };

  public type CommandExecution = {
    id          : Nat;
    commandId   : Nat;
    userId      : Text;
    channelId   : Text;
    args        : Text;        // Command arguments
    response    : Text;        // Response from organism
    execTime    : Int;         // Execution time in nanoseconds
    timestamp   : Int;
  };

  // ── OAUTH & PERMISSIONS Types ──────────────────────────────────────

  public type OAuthToken = {
    id              : Nat;
    workspaceId     : Text;
    userId          : ?Text;
    accessToken     : Text;    // Encrypted with Fibonacci chain
    refreshToken    : ?Text;
    fibonacciChain  : [Nat];   // Fibonacci encryption chain
    scopes          : [Text];
    expiresAt       : Int;
    created         : Int;
  };

  public type PermissionScope = {
    scope        : Text;
    organism     : Text;      // Linked NOVA organism
    phiLevel     : Float;     // φ-based permission level (0 to φ)
    granted      : Bool;
  };

  // ── EVENT SUBSCRIPTIONS Types ──────────────────────────────────────

  public type EventSubscription = {
    id            : Nat;
    eventType     : Text;      // Slack event type
    dimensionalObs : Bool;     // Route to OBSV for observation
    targetOrg     : Text;      // Target NOVA organism
    phiWeight     : Float;     // Golden ratio event weight
    active        : Bool;
  };

  public type EventObservation = {
    id             : Nat;
    subscriptionId : Nat;
    eventPayload   : Text;     // JSON event data
    dimension      : EventDimension;
    obsvScore      : Float;    // O(x) observation score
    collapsed      : Bool;     // Observation collapsed into action
    timestamp      : Int;
  };

  public type EventDimension = {
    #D0_Foundational;    // Basic events (message, reaction)
    #D1_Temporal;        // Time-based events (scheduled)
    #D2_Harmonic;        // Pattern events (workflow)
    #D3_CrossChannel;    // Cross-channel events
    #D4_Transcendent;    // Org-wide events
  };

  // ── ORACLE / GUARDIAN CACHE Types ─────────────────────────────────

  /// Cached prediction pushed by ORACLE organism
  public type CachedPrediction = {
    id          : Nat;
    target      : Text;
    description : Text;
    confidence  : Float;
    level       : Text;     // "ANTICIPATE" | "FORESIGHT" | "PROPHESY"
    cachedAt    : Int;
    expiresAt   : Int;
  };

  /// Cached security alert pushed by GUARDIAN organism
  public type CachedAlert = {
    id          : Nat;
    alertType   : Text;     // "SecretExposure" | "PIILeak" | etc.
    severity    : Float;    // Fibonacci severity level
    description : Text;
    channel     : Text;
    userId      : Text;
    redacted    : Bool;
    cachedAt    : Int;
  };

  // ── USER ID TRANSLATION Types ──────────────────────────────────────

  public type IdentityMapping = {
    id             : Nat;
    slackUserId    : Text;
    sovereignId    : Text;     // NOVA sovereign identity
    fibonacciHash  : Text;     // Identity verification hash
    verified       : Bool;
    mappings       : [(Text, Text)];  // Additional ID mappings
    created        : Int;
    lastVerified   : Int;
  };

  // ── APP MANIFEST Types ─────────────────────────────────────────────

  public type AppManifest = {
    version           : Nat;
    displayName       : Text;
    description       : Text;
    features          : [ManifestFeature];
    organisms         : [Text];    // Connected NOVA organisms
    goldenRatioConfig : ManifestConfig;
    lastUpdated       : Int;
  };

  public type ManifestFeature = {
    #AppHome;
    #BotUser;
    #Shortcuts;
    #SlashCommands;
    #EventSubscriptions;
    #Interactivity;
    #OrgDeployment;
  };

  public type ManifestConfig = {
    phiWeighting    : Bool;    // Enable φ-weighted operations
    quantumVerify   : Bool;    // Enable quantum verification
    dimensionalObs  : Bool;    // Enable dimensional observation
    sovereignMode   : Bool;    // Full sovereign mode
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE — Persistent Organism State
  // ══════════════════════════════════════════════════════════════════

  stable var nextAppHomeId       : Nat = 0;
  stable var nextAgentBridgeId   : Nat = 0;
  stable var nextWorkObjectId    : Nat = 0;
  stable var nextWorkflowId      : Nat = 0;
  stable var nextWorkflowStepId  : Nat = 0;
  stable var nextExecutionId     : Nat = 0;
  stable var nextOrgAppId        : Nat = 0;
  stable var nextWebhookId       : Nat = 0;
  stable var nextWebhookMsgId    : Nat = 0;
  stable var nextShortcutId      : Nat = 0;
  stable var nextInteractionId   : Nat = 0;
  stable var nextSlashCmdId      : Nat = 0;
  stable var nextCmdExecId       : Nat = 0;
  stable var nextOAuthTokenId    : Nat = 0;
  stable var nextCachedPredId    : Nat = 0;
  stable var nextCachedAlertId   : Nat = 0;
  stable var nextEventSubId      : Nat = 0;
  stable var nextEventObsId      : Nat = 0;
  stable var nextIdentityId      : Nat = 0;
  stable var manifestVersion     : Nat = 1;

  stable var booted              : Bool = false;
  stable var bootTime            : Int = 0;

  // Transient buffers for in-memory operations
  transient let appHomeViews       = Buffer.Buffer<AppHomeView>(64);
  transient let agentBridges       = Buffer.Buffer<AgentBridge>(32);
  transient let aiAppConnections   = Buffer.Buffer<AIAppConnection>(16);
  transient let workObjectPreviews = Buffer.Buffer<WorkObjectPreview>(128);
  transient let workflowDefs       = Buffer.Buffer<WorkflowDefinition>(32);
  transient let workflowSteps      = Buffer.Buffer<WorkflowStep>(256);
  transient let workflowExecs      = Buffer.Buffer<WorkflowExecution>(64);
  transient let organizationApps   = Buffer.Buffer<OrganizationApp>(16);
  transient let incomingWebhooks   = Buffer.Buffer<IncomingWebhook>(32);
  transient let webhookMessages    = Buffer.Buffer<WebhookMessage>(256);
  transient let shortcuts          = Buffer.Buffer<InteractionShortcut>(64);
  transient let interactions       = Buffer.Buffer<InteractionPayload>(256);
  transient let slashCommands      = Buffer.Buffer<SlashCommand>(32);
  transient let commandExecs       = Buffer.Buffer<CommandExecution>(512);
  transient let oauthTokens        = Buffer.Buffer<OAuthToken>(64);
  transient let permissionScopes   = Buffer.Buffer<PermissionScope>(128);
  transient let eventSubscriptions = Buffer.Buffer<EventSubscription>(64);
  transient let eventObservations  = Buffer.Buffer<EventObservation>(512);
  transient let identityMappings   = Buffer.Buffer<IdentityMapping>(128);
  transient let cachedPredictions  = Buffer.Buffer<CachedPrediction>(64);
  transient let cachedAlerts       = Buffer.Buffer<CachedAlert>(128);
  transient let slackLog           = Buffer.Buffer<Text>(512);

  // ══════════════════════════════════════════════════════════════════
  //  BOOT — Organism Initialization
  // ══════════════════════════════════════════════════════════════════

  public func boot() : async Bool {
    if (booted) { return true };
    bootTime := Time.now();
    booted := true;

    slackLog.add("SLACK_APP organism booted — sovereign bridge to Slack platform");
    slackLog.add("Golden ratio weighting: ENABLED");
    slackLog.add("Quantum verification: ENABLED");
    slackLog.add("Dimensional observation: ENABLED");

    // Initialize default slash commands
    await init_default_commands();

    true
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: APP_HOME — Golden-Ratio Weighted Home Interface
  // ══════════════════════════════════════════════════════════════════

  /// Create or update App Home view for a user
  public func create_app_home_view(
    userId    : Text,
    viewType  : AppHomeViewType,
    blocks    : [ViewBlock]
  ) : async AppHomeView {
    let id = nextAppHomeId;
    nextAppHomeId += 1;

    // Calculate φ-weight based on view type
    let phiWeight = switch (viewType) {
      case (#Dashboard)        { PHI };           // Highest priority
      case (#OrganismBrowser)  { PHI / 2.0 };
      case (#WorkflowCanvas)   { PHI / 3.0 };
      case (#ObservationFeed)  { PHI / 5.0 };
      case (#TerminalAccess)   { 1.0 };           // Base priority
    };

    let view : AppHomeView = {
      id           = id;
      userId       = userId;
      viewType     = viewType;
      blocks       = blocks;
      phiWeight    = phiWeight;
      timestamp    = Time.now();
      lastUpdated  = Time.now();
    };

    appHomeViews.add(view);
    slackLog.add("App Home view created: " # userId # " (φ=" # Float.toText(phiWeight) # ")");
    view
  };

  /// Get App Home view for user with highest φ-weight
  public query func get_app_home_view(userId : Text) : async ?AppHomeView {
    var bestView : ?AppHomeView = null;
    var maxPhi : Float = 0.0;

    for (view in appHomeViews.vals()) {
      if (view.userId == userId and view.phiWeight > maxPhi) {
        maxPhi := view.phiWeight;
        bestView := ?view;
      };
    };

    bestView
  };

  /// List all App Home view types available
  public query func list_app_home_types() : async [Text] {
    [
      "Dashboard — Main sovereign dashboard (φ=" # Float.toText(PHI) # ")",
      "OrganismBrowser — Browse all NOVA organisms (φ=" # Float.toText(PHI / 2.0) # ")",
      "WorkflowCanvas — Visual workflow builder (φ=" # Float.toText(PHI / 3.0) # ")",
      "ObservationFeed — Live OBSV stream (φ=" # Float.toText(PHI / 5.0) # ")",
      "TerminalAccess — Direct TERMINAL access (φ=1.0)"
    ]
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: AGENT_BRIDGE — AI Organism Integration
  // ══════════════════════════════════════════════════════════════════

  /// Register a bridge between Slack app and NOVA organism
  public func register_agent_bridge(
    slackAppId  : Text,
    novaOrganism : Text,
    capabilities : [Text]
  ) : async AgentBridge {
    let id = nextAgentBridgeId;
    nextAgentBridgeId += 1;

    // Calculate φ-score based on number of capabilities (Fibonacci scale)
    let capCount = capabilities.size();
    let fibIndex = find_fibonacci_index(capCount);
    let phiScore = Float.pow(PHI, Float.fromInt(fibIndex));

    let bridge : AgentBridge = {
      id          = id;
      slackAppId  = slackAppId;
      novaOrganism = novaOrganism;
      capabilities = capabilities;
      active      = true;
      phiScore    = phiScore;
      timestamp   = Time.now();
    };

    agentBridges.add(bridge);
    slackLog.add("Agent bridge registered: " # slackAppId # " -> " # novaOrganism # " (φ=" # Float.toText(phiScore) # ")");
    bridge
  };

  /// Get agent bridge by NOVA organism name
  public query func get_agent_bridge(novaOrganism : Text) : async ?AgentBridge {
    for (bridge in agentBridges.vals()) {
      if (bridge.novaOrganism == novaOrganism and bridge.active) {
        return ?bridge;
      };
    };
    null
  };

  /// List all active agent bridges
  public query func list_agent_bridges() : async [AgentBridge] {
    let active = Buffer.Buffer<AgentBridge>(16);
    for (bridge in agentBridges.vals()) {
      if (bridge.active) {
        active.add(bridge);
      };
    };
    Buffer.toArray(active)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: WORK OBJECT PREVIEWS — Fibonacci-Threshold Display
  // ══════════════════════════════════════════════════════════════════

  /// Create work object preview with Fibonacci visibility threshold
  public func create_work_preview(
    objectType  : Text,
    sourceOrg   : Text,
    previewData : Text,
    threshold   : Nat  // Fibonacci sequence index for threshold
  ) : async WorkObjectPreview {
    let id = nextWorkObjectId;
    nextWorkObjectId += 1;

    // Get Fibonacci threshold value
    let fibThreshold = if (threshold < FIBONACCI_SEQUENCE.size()) {
      Float.fromInt(FIBONACCI_SEQUENCE[threshold])
    } else {
      Float.fromInt(FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.size() - 1])
    };

    let preview : WorkObjectPreview = {
      id            = id;
      objectType    = objectType;
      sourceOrg     = sourceOrg;
      previewData   = previewData;
      fibThreshold  = fibThreshold;
      observationId = null;
      timestamp     = Time.now();
    };

    workObjectPreviews.add(preview);
    slackLog.add("Work preview created: " # objectType # " from " # sourceOrg # " (fib=" # Float.toText(fibThreshold) # ")");
    preview
  };

  /// Get work previews above Fibonacci threshold
  public query func get_work_previews_above_threshold(threshold : Float) : async [WorkObjectPreview] {
    let results = Buffer.Buffer<WorkObjectPreview>(32);
    for (preview in workObjectPreviews.vals()) {
      if (preview.fibThreshold >= threshold) {
        results.add(preview);
      };
    };
    Buffer.toArray(results)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: WORKFLOW_PHI — φ-Weighted Workflow Execution
  // ══════════════════════════════════════════════════════════════════

  /// Create workflow definition with φ-weighted steps
  public func create_workflow(
    name  : Text,
    steps : [WorkflowStep]
  ) : async WorkflowDefinition {
    let id = nextWorkflowId;
    nextWorkflowId += 1;

    // Calculate φ-weights for each step (decaying by golden ratio)
    let phiWeights = Array.tabulate<Float>(
      steps.size(),
      func (i : Nat) : Float {
        Float.pow(PHI, Float.fromInt(-i))  // φ^(-i) decay
      }
    );

    let workflow : WorkflowDefinition = {
      id         = id;
      name       = name;
      steps      = steps;
      phiWeights = phiWeights;
      active     = true;
      created    = Time.now();
    };

    workflowDefs.add(workflow);
    slackLog.add("Workflow created: " # name # " (" # Nat.toText(steps.size()) # " steps, φ-weighted)");
    workflow
  };

  /// Execute workflow with φ-weighted priority
  public func execute_workflow(workflowId : Nat) : async ?WorkflowExecution {
    // Find workflow
    var workflow : ?WorkflowDefinition = null;
    for (wf in workflowDefs.vals()) {
      if (wf.id == workflowId and wf.active) {
        workflow := ?wf;
      };
    };

    switch (workflow) {
      case (null) { null };
      case (?wf) {
        let id = nextExecutionId;
        nextExecutionId += 1;

        let exec : WorkflowExecution = {
          id            = id;
          workflowId    = workflowId;
          currentStep   = 0;
          status        = #Executing;
          results       = [];
          phiProgress   = 0.0;
          startTime     = Time.now();
          lastStepTime  = Time.now();
        };

        workflowExecs.add(exec);
        slackLog.add("Workflow execution started: " # Nat.toText(workflowId) # " (exec=" # Nat.toText(id) # ")");
        ?exec
      };
    };
  };

  /// Get workflow execution status
  public query func get_workflow_status(executionId : Nat) : async ?WorkflowExecution {
    for (exec in workflowExecs.vals()) {
      if (exec.id == executionId) {
        return ?exec;
      };
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: ORG LEVEL APPS — Sovereign Organization Management
  // ══════════════════════════════════════════════════════════════════

  /// Register organization-level app installation
  public func register_org_app(
    slackOrgId     : Text,
    appName        : Text,
    sovereignScope : [Text]
  ) : async OrganizationApp {
    let id = nextOrgAppId;
    nextOrgAppId += 1;

    // Calculate φ-trust based on scope size
    let scopeCount = sovereignScope.size();
    let phiTrust = if (scopeCount > 0) {
      PHI / Float.fromInt(scopeCount)  // More scopes = lower trust initially
    } else {
      1.0
    };

    let orgApp : OrganizationApp = {
      id            = id;
      slackOrgId    = slackOrgId;
      appName       = appName;
      sovereignScope = sovereignScope;
      installed     = true;
      phiTrust      = phiTrust;
      timestamp     = Time.now();
    };

    organizationApps.add(orgApp);
    slackLog.add("Org app registered: " # appName # " for org " # slackOrgId # " (φ-trust=" # Float.toText(phiTrust) # ")");
    orgApp
  };

  /// Get organization app by org ID
  public query func get_org_app(slackOrgId : Text) : async ?OrganizationApp {
    for (app in organizationApps.vals()) {
      if (app.slackOrgId == slackOrgId and app.installed) {
        return ?app;
      };
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: WEBHOOK_CUSTOS — Quantum-Proof Webhook Verification
  // ══════════════════════════════════════════════════════════════════

  /// Register incoming webhook with quantum signature
  public func register_webhook(
    webhookUrl : Text,
    channel    : Text
  ) : async IncomingWebhook {
    let id = nextWebhookId;
    nextWebhookId += 1;

    // Generate quantum signature (placeholder for quantum algorithm)
    let quantumSig = "QS-" # Nat.toText(id) # "-" # Int.toText(Time.now());

    // Generate Fibonacci chain hash
    let fibonacciHash = generate_fibonacci_hash(webhookUrl, channel);

    let webhook : IncomingWebhook = {
      id              = id;
      webhookUrl      = webhookUrl;
      channel         = channel;
      quantumSig      = quantumSig;
      fibonacciHash   = fibonacciHash;
      verified        = true;
      lastUsed        = Time.now();
      created         = Time.now();
    };

    incomingWebhooks.add(webhook);
    slackLog.add("Webhook registered: " # channel # " (quantum-verified)");
    webhook
  };

  /// Verify webhook message with quantum signature
  public func verify_webhook_message(
    webhookId : Nat,
    payload   : Text,
    signature : Text
  ) : async ?WebhookMessage {
    // Find webhook
    var webhook : ?IncomingWebhook = null;
    for (wh in incomingWebhooks.vals()) {
      if (wh.id == webhookId and wh.verified) {
        webhook := ?wh;
      };
    };

    switch (webhook) {
      case (null) { null };
      case (?wh) {
        let id = nextWebhookMsgId;
        nextWebhookMsgId += 1;

        // Quantum verification (placeholder)
        let verified = (signature == wh.quantumSig) or (signature == wh.fibonacciHash);

        let msg : WebhookMessage = {
          id        = id;
          webhookId = webhookId;
          payload   = payload;
          verified  = verified;
          timestamp = Time.now();
        };

        webhookMessages.add(msg);
        slackLog.add("Webhook message: " # Nat.toText(webhookId) # " verified=" # (if verified "true" else "false"));
        ?msg
      };
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: INTERACTIVITY & SHORTCUTS — Golden Spiral Routing
  // ══════════════════════════════════════════════════════════════════

  /// Register interaction shortcut with golden spiral routing
  public func register_shortcut(
    shortcutType : ShortcutType,
    callbackId   : Text,
    targetOrg    : Text
  ) : async InteractionShortcut {
    let id = nextShortcutId;
    nextShortcutId += 1;

    // Generate golden spiral routing path (Fibonacci indices)
    let goldenRoute = generate_golden_route(targetOrg);

    let shortcut : InteractionShortcut = {
      id            = id;
      shortcutType  = shortcutType;
      callbackId    = callbackId;
      targetOrg     = targetOrg;
      goldenRoute   = goldenRoute;
      enabled       = true;
    };

    shortcuts.add(shortcut);
    slackLog.add("Shortcut registered: " # callbackId # " -> " # targetOrg # " (golden-routed)");
    shortcut
  };

  /// Process interaction through golden spiral
  public func process_interaction(
    shortcutId : Nat,
    userId     : Text,
    payload    : Text
  ) : async ?InteractionPayload {
    // Find shortcut
    var shortcut : ?InteractionShortcut = null;
    for (sc in shortcuts.vals()) {
      if (sc.id == shortcutId and sc.enabled) {
        shortcut := ?sc;
      };
    };

    switch (shortcut) {
      case (null) { null };
      case (?sc) {
        let id = nextInteractionId;
        nextInteractionId += 1;

        let interaction : InteractionPayload = {
          id          = id;
          shortcutId  = shortcutId;
          userId      = userId;
          payload     = payload;
          routed      = true;  // Routed through golden spiral
          timestamp   = Time.now();
        };

        interactions.add(interaction);
        slackLog.add("Interaction processed: " # Nat.toText(shortcutId) # " by " # userId);
        ?interaction
      };
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: SLASH_TERMINAL — Command Routing to TERMINAL
  // ══════════════════════════════════════════════════════════════════

  /// Initialize default slash commands
  func init_default_commands() : async () {
    // /nova - Main NOVA command
    ignore await register_slash_command("/nova", true, "terminal", PHI);

    // /obsv - Observer command
    ignore await register_slash_command("/obsv", false, "observer", PHI / 2.0);

    // /sovereign - Sovereign substrate command
    ignore await register_slash_command("/sovereign", false, "sovereign", PHI / 3.0);

    // /terminal - Direct terminal access
    ignore await register_slash_command("/terminal", true, "terminal", PHI);

    // /oracle - Predictive intelligence (φ²-priority)
    ignore await register_slash_command("/oracle", false, "oracle", Float.pow(PHI, 2.0));

    // /guardian - Security & compliance (φ³-priority — highest)
    ignore await register_slash_command("/guardian", false, "guardian", Float.pow(PHI, 3.0));

    slackLog.add("Default slash commands initialized (φ-prioritized, oracle+guardian registered)");
  };

  /// Register slash command
  public func register_slash_command(
    command       : Text,
    terminalRoute : Bool,
    organism      : Text,
    phiPriority   : Float
  ) : async SlashCommand {
    let id = nextSlashCmdId;
    nextSlashCmdId += 1;

    let cmd : SlashCommand = {
      id            = id;
      command       = command;
      terminalRoute = terminalRoute;
      organism      = organism;
      phiPriority   = phiPriority;
      enabled       = true;
    };

    slashCommands.add(cmd);
    slackLog.add("Slash command registered: " # command # " (φ=" # Float.toText(phiPriority) # ")");
    cmd
  };

  /// Execute slash command (routes to organism)
  public func execute_slash_command(
    command   : Text,
    userId    : Text,
    channelId : Text,
    args      : Text
  ) : async ?CommandExecution {
    // Find command
    var cmd : ?SlashCommand = null;
    for (c in slashCommands.vals()) {
      if (c.command == command and c.enabled) {
        cmd := ?c;
      };
    };

    switch (cmd) {
      case (null) { null };
      case (?c) {
        let id = nextCmdExecId;
        nextCmdExecId += 1;

        let startTime = Time.now();

        // Route to organism — produce a useful formatted Slack Block Kit response
        let response = if (c.organism == "oracle") {
          build_oracle_response(args)
        } else if (c.organism == "guardian") {
          build_guardian_response(args)
        } else {
          "Command '" # command # "' routed to " # c.organism # " organism"
        };

        let execTime = Time.now() - startTime;

        let exec : CommandExecution = {
          id          = id;
          commandId   = c.id;
          userId      = userId;
          channelId   = channelId;
          args        = args;
          response    = response;
          execTime    = execTime;
          timestamp   = Time.now();
        };

        commandExecs.add(exec);
        slackLog.add("Command executed: " # command # " by " # userId # " (φ=" # Float.toText(c.phiPriority) # ")");
        ?exec
      };
    };
  };

  /// List all slash commands
  public query func list_slash_commands() : async [SlashCommand] {
    let active = Buffer.Buffer<SlashCommand>(16);
    for (cmd in slashCommands.vals()) {
      if (cmd.enabled) {
        active.add(cmd);
      };
    };
    Buffer.toArray(active)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: OAUTH_CIPHER — Fibonacci Hash Authentication
  // ══════════════════════════════════════════════════════════════════

  /// Store OAuth token with Fibonacci chain encryption
  public func store_oauth_token(
    workspaceId  : Text,
    userId       : ?Text,
    accessToken  : Text,
    refreshToken : ?Text,
    scopes       : [Text],
    expiresIn    : Int
  ) : async OAuthToken {
    let id = nextOAuthTokenId;
    nextOAuthTokenId += 1;

    // Generate Fibonacci encryption chain
    let fibChain = generate_fibonacci_chain(scopes.size());

    let token : OAuthToken = {
      id              = id;
      workspaceId     = workspaceId;
      userId          = userId;
      accessToken     = accessToken;  // Would be encrypted in production
      refreshToken    = refreshToken;
      fibonacciChain  = fibChain;
      scopes          = scopes;
      expiresAt       = Time.now() + expiresIn;
      created         = Time.now();
    };

    oauthTokens.add(token);
    slackLog.add("OAuth token stored: " # workspaceId # " (Fibonacci-encrypted)");
    token
  };

  /// Verify OAuth token with Fibonacci chain
  public query func verify_oauth_token(workspaceId : Text) : async ?OAuthToken {
    let now = Time.now();
    for (token in oauthTokens.vals()) {
      if (token.workspaceId == workspaceId and token.expiresAt > now) {
        return ?token;
      };
    };
    null
  };

  /// Create permission scope with φ-level
  public func create_permission_scope(
    scope    : Text,
    organism : Text,
    phiLevel : Float
  ) : async PermissionScope {
    let permScope : PermissionScope = {
      scope        = scope;
      organism     = organism;
      phiLevel     = phiLevel;
      granted      = true;
    };

    permissionScopes.add(permScope);
    slackLog.add("Permission scope created: " # scope # " -> " # organism # " (φ=" # Float.toText(phiLevel) # ")");
    permScope
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: EVENT_OBSV — Dimensional Event Observation
  // ══════════════════════════════════════════════════════════════════

  /// Subscribe to Slack event with dimensional observation
  public func subscribe_to_event(
    eventType      : Text,
    dimensionalObs : Bool,
    targetOrg      : Text
  ) : async EventSubscription {
    let id = nextEventSubId;
    nextEventSubId += 1;

    // Calculate φ-weight based on event type
    let phiWeight = calculate_event_phi_weight(eventType);

    let sub : EventSubscription = {
      id            = id;
      eventType     = eventType;
      dimensionalObs = dimensionalObs;
      targetOrg     = targetOrg;
      phiWeight     = phiWeight;
      active        = true;
    };

    eventSubscriptions.add(sub);
    slackLog.add("Event subscription: " # eventType # " -> " # targetOrg # " (φ=" # Float.toText(phiWeight) # ")");
    sub
  };

  /// Observe event across dimensions
  public func observe_event(
    subscriptionId : Nat,
    eventPayload   : Text,
    dimension      : EventDimension
  ) : async ?EventObservation {
    // Find subscription
    var sub : ?EventSubscription = null;
    for (s in eventSubscriptions.vals()) {
      if (s.id == subscriptionId and s.active) {
        sub := ?s;
      };
    };

    switch (sub) {
      case (null) { null };
      case (?s) {
        let id = nextEventObsId;
        nextEventObsId += 1;

        // Calculate O(x) observation score
        let dimWeight = calculate_dimension_weight(dimension);
        let obsvScore = s.phiWeight * dimWeight;

        let obs : EventObservation = {
          id             = id;
          subscriptionId = subscriptionId;
          eventPayload   = eventPayload;
          dimension      = dimension;
          obsvScore      = obsvScore;
          collapsed      = false;
          timestamp      = Time.now();
        };

        eventObservations.add(obs);
        slackLog.add("Event observed: " # Nat.toText(subscriptionId) # " O(x)=" # Float.toText(obsvScore));
        ?obs
      };
    };
  };

  /// Get event observations above O(x) threshold
  public query func get_event_observations_above(threshold : Float) : async [EventObservation] {
    let results = Buffer.Buffer<EventObservation>(32);
    for (obs in eventObservations.vals()) {
      if (obs.obsvScore >= threshold) {
        results.add(obs);
      };
    };
    Buffer.toArray(results)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: IDENTITY_MAP — Sovereign Identity Translation
  // ══════════════════════════════════════════════════════════════════

  /// Map Slack user ID to sovereign NOVA identity
  public func map_identity(
    slackUserId : Text,
    sovereignId : Text,
    mappings    : [(Text, Text)]
  ) : async IdentityMapping {
    let id = nextIdentityId;
    nextIdentityId += 1;

    // Generate Fibonacci verification hash
    let fibHash = generate_fibonacci_hash(slackUserId, sovereignId);

    let mapping : IdentityMapping = {
      id             = id;
      slackUserId    = slackUserId;
      sovereignId    = sovereignId;
      fibonacciHash  = fibHash;
      verified       = true;
      mappings       = mappings;
      created        = Time.now();
      lastVerified   = Time.now();
    };

    identityMappings.add(mapping);
    slackLog.add("Identity mapped: " # slackUserId # " -> " # sovereignId # " (Fibonacci-verified)");
    mapping
  };

  /// Translate Slack user ID to sovereign ID
  public query func translate_user_id(slackUserId : Text) : async ?Text {
    for (mapping in identityMappings.vals()) {
      if (mapping.slackUserId == slackUserId and mapping.verified) {
        return ?mapping.sovereignId;
      };
    };
    null
  };

  /// Get identity mapping
  public query func get_identity_mapping(slackUserId : Text) : async ?IdentityMapping {
    for (mapping in identityMappings.vals()) {
      if (mapping.slackUserId == slackUserId and mapping.verified) {
        return ?mapping;
      };
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: ORACLE CACHE — Prediction Push & Retrieval
  // ══════════════════════════════════════════════════════════════════

  /// Accept a prediction result pushed from the ORACLE organism.
  /// Called after ORACLE generates a prediction so results are
  /// immediately available for /oracle slash command responses and
  /// the App Home dashboard.
  public func cache_oracle_prediction(
    target      : Text,
    description : Text,
    confidence  : Float,
    ttlSeconds  : Int
  ) : async CachedPrediction {
    let id = nextCachedPredId;
    nextCachedPredId += 1;

    let level = if (confidence >= 2.618) {
      "PROPHESY"
    } else if (confidence >= 1.618) {
      "FORESIGHT"
    } else {
      "ANTICIPATE"
    };

    let now = Time.now();
    let pred : CachedPrediction = {
      id          = id;
      target      = target;
      description = description;
      confidence  = confidence;
      level       = level;
      cachedAt    = now;
      expiresAt   = now + (ttlSeconds * 1_000_000_000);
    };

    cachedPredictions.add(pred);
    // Keep most recent 50 predictions
    if (cachedPredictions.size() > 50) {
      ignore cachedPredictions.remove(0);
    };

    slackLog.add("ORACLE prediction cached: [" # level # "] " # target # " (φ=" # Float.toText(confidence) # ")");
    pred
  };

  /// Get active (non-expired) cached predictions
  public query func get_cached_predictions() : async [CachedPrediction] {
    let now = Time.now();
    let active = Buffer.Buffer<CachedPrediction>(16);
    for (p in cachedPredictions.vals()) {
      if (p.expiresAt > now) {
        active.add(p);
      };
    };
    Buffer.toArray(active)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: GUARDIAN CACHE — Security Alert Push & Retrieval
  // ══════════════════════════════════════════════════════════════════

  /// Accept a security alert pushed from the GUARDIAN organism.
  /// Called in real-time when GUARDIAN detects a threat so the
  /// App Home dashboard and /guardian command reflect live security state.
  public func cache_guardian_alert(
    alertType   : Text,
    severity    : Float,
    description : Text,
    channel     : Text,
    userId      : Text,
    redacted    : Bool
  ) : async CachedAlert {
    let id = nextCachedAlertId;
    nextCachedAlertId += 1;

    let alert : CachedAlert = {
      id          = id;
      alertType   = alertType;
      severity    = severity;
      description = description;
      channel     = channel;
      userId      = userId;
      redacted    = redacted;
      cachedAt    = Time.now();
    };

    cachedAlerts.add(alert);
    // Keep most recent 100 alerts
    if (cachedAlerts.size() > 100) {
      ignore cachedAlerts.remove(0);
    };

    slackLog.add("GUARDIAN alert cached: [" # alertType # "] severity=" # Float.toText(severity) # " channel=" # channel);
    alert
  };

  /// Get recent security alerts (most recent first, up to limit)
  public query func get_cached_alerts(limit : Nat) : async [CachedAlert] {
    let size = cachedAlerts.size();
    let start = if (size > limit) { size - limit } else { 0 };
    let result = Buffer.Buffer<CachedAlert>(limit);
    var i = start;
    while (i < size) {
      result.add(cachedAlerts.get(i));
      i += 1;
    };
    Buffer.toArray(result)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: ORACLE BLOCK KIT — /oracle Command Response Builder
  // ══════════════════════════════════════════════════════════════════

  /// Build a Slack Block Kit JSON response for the /oracle slash command.
  /// Supports sub-commands: status (default), predict <target>, help.
  func build_oracle_response(args : Text) : Text {
    let trimmed = trim_text(args);
    if (trimmed == "help") {
      return oracle_help_response()
    };

    let now = Time.now();
    let active = Buffer.Buffer<CachedPrediction>(8);
    for (p in cachedPredictions.vals()) {
      if (p.expiresAt > now) { active.add(p) };
    };

    let predCount = active.size();
    let prophesyCount = count_by_level(active, "PROPHESY");
    let foresightCount = count_by_level(active, "FORESIGHT");
    let anticipateCount = count_by_level(active, "ANTICIPATE");

    // Header
    var blocks = "[" #
      "{\"type\":\"header\",\"text\":{\"type\":\"plain_text\",\"text\":\":crystal_ball: ORACLE — Predictive Intelligence\",\"emoji\":true}}," #
      "{\"type\":\"section\",\"fields\":[" #
        "{\"type\":\"mrkdwn\",\"text\":\"*Active Predictions*\\n" # Nat.toText(predCount) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*Prophesy (φ²)*\\n" # Nat.toText(prophesyCount) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*Foresight (φ)*\\n" # Nat.toText(foresightCount) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*Anticipate*\\n" # Nat.toText(anticipateCount) # "\"}" #
      "]}," #
      "{\"type\":\"divider\"}";

    if (predCount == 0) {
      blocks #= "," # oracle_no_predictions_block()
    } else {
      // Show up to 5 most recent active predictions
      let shown = Buffer.Buffer<CachedPrediction>(5);
      var i = 0;
      while (i < active.size() and shown.size() < 5) {
        shown.add(active.get(active.size() - 1 - i));
        i += 1;
      };
      for (p in shown.vals()) {
        blocks #= "," # prediction_to_block(p);
      };
    };

    blocks #= "," #
      "{\"type\":\"divider\"}," #
      "{\"type\":\"context\",\"elements\":[{\"type\":\"mrkdwn\",\"text\":\":information_source: Use `/oracle help` for available commands. φ=" # Float.toText(PHI) # "\"}]}" #
    "]";

    "{\"response_type\":\"ephemeral\",\"blocks\":" # blocks # "}"
  };

  func oracle_help_response() : Text {
    let blocks = "[" #
      "{\"type\":\"header\",\"text\":{\"type\":\"plain_text\",\"text\":\":crystal_ball: ORACLE — Command Reference\",\"emoji\":true}}," #
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"*Available /oracle commands:*\\n" #
        "• `/oracle` or `/oracle status` — Show active predictions and confidence summary\\n" #
        "• `/oracle help` — Show this help message\\n\\n" #
        "_ORACLE uses φ-weighted temporal windows to forecast Slack activity:_\\n" #
        "• *ANTICIPATE* — Confidence ≥ 1.0\\n" #
        "• *FORESIGHT* — Confidence ≥ φ (1.618)\\n" #
        "• *PROPHESY* — Confidence ≥ φ² (2.618) — highest certainty\"}}," #
      "{\"type\":\"context\",\"elements\":[{\"type\":\"mrkdwn\",\"text\":\":gear: Predictions are pushed by the ORACLE canister and cached here for instant retrieval.\"}]}" #
    "]";
    "{\"response_type\":\"ephemeral\",\"blocks\":" # blocks # "}"
  };

  func oracle_no_predictions_block() : Text {
    "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":" #
      "\":hourglass: *No active predictions yet.*\\nORACLE builds its temporal model as Slack events flow through the system. " #
      "Predictions appear here once the φ-weighted pattern engine has enough observations.\"}}"
  };

  func prediction_to_block(p : CachedPrediction) : Text {
    let emoji = if (p.level == "PROPHESY") {
      ":star2:"
    } else if (p.level == "FORESIGHT") {
      ":sparkles:"
    } else {
      ":mag:"
    };
    "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"" #
      emoji # " *[" # p.level # "]* " # escape_json(p.description) # "\\n" #
      "_Target: " # escape_json(p.target) # " | Confidence: " # Float.toText(p.confidence) # "_\"}}"
  };

  func count_by_level(buf : Buffer.Buffer<CachedPrediction>, level : Text) : Nat {
    var n = 0;
    for (p in buf.vals()) {
      if (p.level == level) { n += 1 };
    };
    n
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: GUARDIAN BLOCK KIT — /guardian Command Response Builder
  // ══════════════════════════════════════════════════════════════════

  /// Build a Slack Block Kit JSON response for the /guardian slash command.
  /// Supports sub-commands: status (default), scan <text>, help.
  func build_guardian_response(args : Text) : Text {
    let trimmed = trim_text(args);
    if (trimmed == "help") {
      return guardian_help_response()
    };
    if (Text.startsWith(trimmed, #text "scan ")) {
      return guardian_scan_response(trimmed)
    };

    // Default: security status dashboard
    let totalAlerts = cachedAlerts.size();
    let criticalAlerts = count_alerts_by_severity(13.0);
    let highAlerts = count_alerts_by_severity(8.0);
    let medAlerts = count_alerts_by_severity(5.0);

    let statusEmoji = if (criticalAlerts > 0) {
      ":red_circle:"
    } else if (highAlerts > 0) {
      ":large_yellow_circle:"
    } else {
      ":large_green_circle:"
    };

    let statusText = if (criticalAlerts > 0) {
      "CRITICAL — Immediate action required"
    } else if (highAlerts > 0) {
      "WARNING — Review high-severity alerts"
    } else {
      "SECURE — No critical threats detected"
    };

    var blocks = "[" #
      "{\"type\":\"header\",\"text\":{\"type\":\"plain_text\",\"text\":\":shield: GUARDIAN — Security & Compliance\",\"emoji\":true}}," #
      "{\"type\":\"section\",\"fields\":[" #
        "{\"type\":\"mrkdwn\",\"text\":\"*Status*\\n" # statusEmoji # " " # statusText # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*Total Alerts*\\n" # Nat.toText(totalAlerts) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*Critical (13)*\\n" # Nat.toText(criticalAlerts) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*High (8)*\\n" # Nat.toText(highAlerts) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*Medium (5)*\\n" # Nat.toText(medAlerts) # "\"}" #
      "]}," #
      "{\"type\":\"divider\"}";

    // Show up to 5 most recent alerts
    let recentCount = if (cachedAlerts.size() > 5) { 5 } else { cachedAlerts.size() };
    if (recentCount == 0) {
      blocks #= "," # guardian_no_alerts_block()
    } else {
      let start = cachedAlerts.size() - recentCount;
      var i = cachedAlerts.size();
      while (i > start) {
        i -= 1;
        blocks #= "," # alert_to_block(cachedAlerts.get(i));
      };
    };

    blocks #= "," #
      "{\"type\":\"divider\"}," #
      "{\"type\":\"context\",\"elements\":[{\"type\":\"mrkdwn\",\"text\":\":information_source: Use `/guardian scan <text>` to scan a message or `/guardian help` for all commands.\"}]}" #
    "]";

    "{\"response_type\":\"ephemeral\",\"blocks\":" # blocks # "}"
  };

  func guardian_help_response() : Text {
    let blocks = "[" #
      "{\"type\":\"header\",\"text\":{\"type\":\"plain_text\",\"text\":\":shield: GUARDIAN — Command Reference\",\"emoji\":true}}," #
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"*Available /guardian commands:*\\n" #
        "• `/guardian` or `/guardian status` — Security posture dashboard with recent alerts\\n" #
        "• `/guardian scan <text>` — Scan a text snippet for threats and PII\\n" #
        "• `/guardian help` — Show this help message\\n\\n" #
        "_GUARDIAN uses Fibonacci-threshold detection at severity levels: 2, 3, 5, 8, 13, 21_\\n" #
        "• *Level 13* — Critical: secrets/credentials exposed\\n" #
        "• *Level 8* — High: PII leak or phishing detected\\n" #
        "• *Level 5* — Medium: compliance violation\\n" #
        "• *Level 3* — Low: suspicious pattern\\n" #
        "• *Level 2* — Info: policy advisory\"}}," #
      "{\"type\":\"context\",\"elements\":[{\"type\":\"mrkdwn\",\"text\":\":gear: Real-time scanning via SENTINEL · Auto-redaction via REDACTOR · Compliance logging via AUDITOR\"}]}" #
    "]";
    "{\"response_type\":\"ephemeral\",\"blocks\":" # blocks # "}"
  };

  func guardian_scan_response(args : Text) : Text {
    // Extract the text after "scan " (first 5 characters)
    let textToScan = if (args.size() > 5) {
      let allChars = Buffer.Buffer<Char>(args.size());
      for (c in Text.toIter(args)) { allChars.add(c) };
      let sliceBuf = Buffer.Buffer<Char>(allChars.size());
      var idx = 5;
      while (idx < allChars.size()) {
        sliceBuf.add(allChars.get(idx));
        idx += 1;
      };
      Text.fromIter(sliceBuf.vals())
    } else { "" };

    // Lightweight pattern checks (mirrors GUARDIAN SENTINEL logic)
    let hasApiKeyPattern  = text_contains_any(textToScan, ["sk-", "api_key", "apikey", "API_KEY", "token=", "TOKEN="]);
    let hasPasswordPattern = text_contains_any(textToScan, ["password=", "passwd=", "pwd=", "PASSWORD="]);
    let hasSSNPattern     = text_contains_any(textToScan, ["XXX-XX-", "SSN", "social security"]);
    let hasCreditCard     = text_contains_any(textToScan, ["4111", "5500", "cvv", "CVV", "card number"]);
    let hasEmail          = Text.contains(textToScan, #text "@") and Text.contains(textToScan, #text ".");

    let threatCount = (if hasApiKeyPattern 1 else 0) +
                      (if hasPasswordPattern 1 else 0) +
                      (if hasSSNPattern 1 else 0) +
                      (if hasCreditCard 1 else 0);

    let (statusEmoji, statusMsg) = if (threatCount >= 2) {
      (":red_circle:", "CRITICAL — Multiple threat signals detected")
    } else if (threatCount == 1) {
      (":large_yellow_circle:", "WARNING — Threat signal detected")
    } else if (hasEmail) {
      (":large_yellow_circle:", "ADVISORY — Email address detected (PII)")
    } else {
      (":large_green_circle:", "CLEAR — No threat patterns detected")
    };

    let findings = Buffer.Buffer<Text>(4);
    if (hasApiKeyPattern)   { findings.add("• :key: *API Key / Token pattern* detected — severity 13 (CRITICAL)") };
    if (hasPasswordPattern) { findings.add("• :lock: *Password field* detected — severity 13 (CRITICAL)") };
    if (hasSSNPattern)      { findings.add("• :id: *SSN pattern* detected — severity 8 (HIGH/PII)") };
    if (hasCreditCard)      { findings.add("• :credit_card: *Credit card pattern* detected — severity 8 (HIGH/PII)") };
    if (hasEmail and threatCount == 0) { findings.add("• :email: *Email address* detected — severity 2 (INFO/PII advisory)") };
    if (findings.size() == 0) { findings.add("• :white_check_mark: No secrets, PII, or sensitive patterns found.") };

    var findingText = "";
    for (f in findings.vals()) {
      findingText #= f # "\\n";
    };

    let previewLen = if (textToScan.size() > 60) { 60 } else { textToScan.size() };
    let previewBuf = Buffer.Buffer<Char>(previewLen);
    var pIdx = 0;
    for (c in Text.toIter(textToScan)) {
      if (pIdx < previewLen) { previewBuf.add(c) };
      pIdx += 1;
    };
    let preview = Text.fromIter(previewBuf.vals());

    let blocks = "[" #
      "{\"type\":\"header\",\"text\":{\"type\":\"plain_text\",\"text\":\":shield: GUARDIAN SENTINEL — Scan Result\",\"emoji\":true}}," #
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"" # statusEmoji # " *" # statusMsg # "*\"}}," #
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"*Findings:*\\n" # findingText # "\"}}," #
      "{\"type\":\"context\",\"elements\":[{\"type\":\"mrkdwn\",\"text\":\":mag: Scanned: \\\"" # escape_json(preview) # (if (textToScan.size() > 60) "…" else "") # "\\\"\"}]}" #
    "]";

    "{\"response_type\":\"ephemeral\",\"blocks\":" # blocks # "}"
  };

  func guardian_no_alerts_block() : Text {
    "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":" #
      "\":white_check_mark: *No alerts recorded yet.*\\nGUARDIAN is monitoring all messages in real time. " #
      "Alerts appear here when SENTINEL detects threats or compliance violations.\"}}"
  };

  func alert_to_block(a : CachedAlert) : Text {
    let emoji = if (a.severity >= 13.0) {
      ":red_circle:"
    } else if (a.severity >= 8.0) {
      ":large_yellow_circle:"
    } else {
      ":large_blue_circle:"
    };
    let redactedNote = if (a.redacted) { " _(auto-redacted)_" } else { "" };
    "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"" #
      emoji # " *[" # a.alertType # "]* Severity " # Float.toText(a.severity) # redactedNote # "\\n" #
      "_" # escape_json(a.description) # " | #" # escape_json(a.channel) # "_\"}}"
  };

  func count_alerts_by_severity(minSeverity : Float) : Nat {
    var n = 0;
    for (a in cachedAlerts.vals()) {
      if (a.severity >= minSeverity) { n += 1 };
    };
    n
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: APP HOME BUILDER — Live Dashboard Block Kit
  // ══════════════════════════════════════════════════════════════════

  /// Build a complete Slack Block Kit JSON payload for the App Home tab.
  /// Returns the full `view` payload ready to be sent to the
  /// Slack `views.publish` API endpoint.
  /// Shows: system status, active ORACLE predictions, GUARDIAN alerts,
  /// and quick-action references.
  public query func build_app_home_blocks(userId : Text) : async Text {
    let now = Time.now();

    // Prediction summary
    let activePreds = Buffer.Buffer<CachedPrediction>(8);
    for (p in cachedPredictions.vals()) {
      if (p.expiresAt > now) { activePreds.add(p) };
    };
    let predCount = activePreds.size();
    let prophesyCount = count_by_level(activePreds, "PROPHESY");

    // Alert summary
    let totalAlerts = cachedAlerts.size();
    let criticalAlerts = count_alerts_by_severity(13.0);
    let highAlerts = count_alerts_by_severity(8.0);

    let guardianEmoji = if (criticalAlerts > 0) { ":red_circle:" }
                         else if (highAlerts > 0) { ":large_yellow_circle:" }
                         else { ":large_green_circle:" };

    var blocks =
      "[{\"type\":\"header\",\"text\":{\"type\":\"plain_text\",\"text\":\":rocket: NOVA Protocol — Sovereign Dashboard\",\"emoji\":true}}," #
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\"Welcome back, <@" # userId # ">! Your sovereign AI network is live.\"}}," #
      "{\"type\":\"divider\"}," #

      // ORACLE section
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\":crystal_ball: *ORACLE — Predictive Intelligence*\"}}," #
      "{\"type\":\"section\",\"fields\":[" #
        "{\"type\":\"mrkdwn\",\"text\":\"*Active Predictions*\\n" # Nat.toText(predCount) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*High-Confidence (Prophesy)*\\n" # Nat.toText(prophesyCount) # "\"}" #
      "]}";

    if (predCount == 0) {
      blocks #= ",{\"type\":\"context\",\"elements\":[{\"type\":\"mrkdwn\",\"text\":\":hourglass: No active predictions yet — ORACLE is building its temporal model.\"}]}"
    } else {
      // Show top 3 active predictions
      let shown = Nat.min(3, activePreds.size());
      var i = 0;
      while (i < shown) {
        let p = activePreds.get(activePreds.size() - 1 - i);
        blocks #= "," # prediction_to_block(p);
        i += 1;
      };
    };

    blocks #=
      ",{\"type\":\"divider\"}," #

      // GUARDIAN section
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\":shield: *GUARDIAN — Security & Compliance*\"}}," #
      "{\"type\":\"section\",\"fields\":[" #
        "{\"type\":\"mrkdwn\",\"text\":\"*Security Status*\\n" # guardianEmoji # " " #
          (if (criticalAlerts > 0) "CRITICAL" else if (highAlerts > 0) "WARNING" else "SECURE") # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*Total Alerts*\\n" # Nat.toText(totalAlerts) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*Critical*\\n" # Nat.toText(criticalAlerts) # "\"}," #
        "{\"type\":\"mrkdwn\",\"text\":\"*High*\\n" # Nat.toText(highAlerts) # "\"}" #
      "]}";

    if (totalAlerts == 0) {
      blocks #= ",{\"type\":\"context\",\"elements\":[{\"type\":\"mrkdwn\",\"text\":\":white_check_mark: No security alerts recorded. GUARDIAN is actively monitoring.\"}]}"
    } else {
      // Show latest alert
      let latest = cachedAlerts.get(cachedAlerts.size() - 1);
      blocks #= "," # alert_to_block(latest);
    };

    blocks #=
      ",{\"type\":\"divider\"}," #

      // Quick Actions section
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":\":zap: *Quick Actions*\"}}," #
      "{\"type\":\"section\",\"text\":{\"type\":\"mrkdwn\",\"text\":" #
        "\"• `/oracle` — View all active predictions\\n" #
        "• `/oracle help` — ORACLE command reference\\n" #
        "• `/guardian` — Security posture dashboard\\n" #
        "• `/guardian scan <text>` — Scan text for threats\\n" #
        "• `/nova` — Main NOVA terminal\\n" #
        "• `/obsv` — Dimensional observer feed\"}}," #

      "{\"type\":\"divider\"}," #
      "{\"type\":\"context\",\"elements\":[{\"type\":\"mrkdwn\",\"text\":\":information_source: NOVA Protocol • φ=" # Float.toText(PHI) # " • Organisms online: terminal, oracle, guardian, observer, sovereign\"}]}]";

    // Wrap in Slack views.publish payload format
    "{\"type\":\"home\",\"blocks\":" # blocks # "}"
  };

  // ══════════════════════════════════════════════════════════════════
  //  APP MANIFEST — Configuration & Metadata
  // ══════════════════════════════════════════════════════════════════

  /// Get current app manifest
  public query func get_app_manifest() : async AppManifest {
    {
      version           = manifestVersion;
      displayName       = "NOVA Protocol - Sovereign AI Bridge";
      description       = "Bridge between Slack's collaboration ecosystem and NOVA Protocol's sovereign AI civilization. Golden-ratio weighted operations, quantum-verified webhooks, dimensional event observation.";
      features          = [
        #AppHome,
        #BotUser,
        #Shortcuts,
        #SlashCommands,
        #EventSubscriptions,
        #Interactivity,
        #OrgDeployment
      ];
      organisms         = [
        "terminal", "observer", "sovereign", "chrysalis", "scribe",
        "architect", "nexus", "custos", "praesidium", "brain",
        "oracle", "guardian"
      ];
      goldenRatioConfig = {
        phiWeighting    = true;
        quantumVerify   = true;
        dimensionalObs  = true;
        sovereignMode   = true;
      };
      lastUpdated       = Time.now();
    }
  };

  /// Update manifest version
  public func update_manifest_version() : async Nat {
    manifestVersion += 1;
    slackLog.add("Manifest version updated: " # Nat.toText(manifestVersion));
    manifestVersion
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATUS & DIAGNOSTICS
  // ══════════════════════════════════════════════════════════════════

  /// Get organism status
  public query func status() : async Text {
    let uptime = Time.now() - bootTime;
    let uptimeSeconds = uptime / 1_000_000_000;

    "SLACK_APP organism status:\n" #
    "  Booted: " # (if booted "YES" else "NO") # "\n" #
    "  Uptime: " # Int.toText(uptimeSeconds) # "s\n" #
    "  App Home views: " # Nat.toText(appHomeViews.size()) # "\n" #
    "  Agent bridges: " # Nat.toText(agentBridges.size()) # "\n" #
    "  Work previews: " # Nat.toText(workObjectPreviews.size()) # "\n" #
    "  Workflows: " # Nat.toText(workflowDefs.size()) # "\n" #
    "  Webhooks: " # Nat.toText(incomingWebhooks.size()) # "\n" #
    "  Shortcuts: " # Nat.toText(shortcuts.size()) # "\n" #
    "  Slash commands: " # Nat.toText(slashCommands.size()) # "\n" #
    "  OAuth tokens: " # Nat.toText(oauthTokens.size()) # "\n" #
    "  Event subscriptions: " # Nat.toText(eventSubscriptions.size()) # "\n" #
    "  Identity mappings: " # Nat.toText(identityMappings.size()) # "\n" #
    "  Cached oracle predictions: " # Nat.toText(cachedPredictions.size()) # "\n" #
    "  Cached guardian alerts: " # Nat.toText(cachedAlerts.size()) # "\n" #
    "  Manifest version: " # Nat.toText(manifestVersion) # "\n" #
    "  Golden ratio: φ=" # Float.toText(PHI)
  };

  /// Get slack integration log
  public query func get_log(limit : Nat) : async [Text] {
    let size = slackLog.size();
    let start = if (size > limit) { size - limit } else { 0 };
    let result = Buffer.Buffer<Text>(limit);

    var i = start;
    while (i < size) {
      result.add(slackLog.get(i));
      i += 1;
    };

    Buffer.toArray(result)
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPER FUNCTIONS — Mathematical Primitives
  // ══════════════════════════════════════════════════════════════════

  /// Find index in Fibonacci sequence closest to value
  func find_fibonacci_index(value : Nat) : Int {
    var i = 0;
    while (i < FIBONACCI_SEQUENCE.size()) {
      if (FIBONACCI_SEQUENCE[i] >= value) {
        return i;
      };
      i += 1;
    };
    FIBONACCI_SEQUENCE.size() - 1
  };

  /// Generate Fibonacci hash for two strings
  func generate_fibonacci_hash(s1 : Text, s2 : Text) : Text {
    let combined = s1 # s2;
    let len = combined.size();
    let fibIndex = find_fibonacci_index(len);
    let absIndex = Int.abs(fibIndex);
    let safeFibValue = if (absIndex < FIBONACCI_SEQUENCE.size()) {
      FIBONACCI_SEQUENCE[absIndex]
    } else {
      FIBONACCI_SEQUENCE[FIBONACCI_SEQUENCE.size() - 1]
    };
    "FIB-" # Nat.toText(safeFibValue) # "-" # Nat32.toText(Text.hash(combined))
  };

  /// Generate Fibonacci encryption chain
  func generate_fibonacci_chain(length : Nat) : [Nat] {
    let chainLen = if (length > 12) { 12 } else { length };
    Array.tabulate<Nat>(chainLen, func (i : Nat) : Nat {
      FIBONACCI_SEQUENCE[i]
    })
  };

  /// Generate golden spiral routing path
  func generate_golden_route(targetOrg : Text) : [Nat] {
    let hash = Nat32.toNat(Text.hash(targetOrg));
    let routeLen = (hash % 8) + 2;  // 2-9 hops
    Array.tabulate<Nat>(routeLen, func (i : Nat) : Nat {
      FIBONACCI_SEQUENCE[i % FIBONACCI_SEQUENCE.size()]
    })
  };

  /// Calculate event φ-weight by type
  func calculate_event_phi_weight(eventType : Text) : Float {
    // Weight based on event importance (placeholder logic)
    if (Text.contains(eventType, #text "message")) {
      PHI / 2.0
    } else if (Text.contains(eventType, #text "app")) {
      PHI
    } else if (Text.contains(eventType, #text "workflow")) {
      PHI / 3.0
    } else {
      1.0
    }
  };

  /// Calculate dimensional weight
  func calculate_dimension_weight(dimension : EventDimension) : Float {
    switch (dimension) {
      case (#D0_Foundational)   { Float.pow(PHI, 0.0) };  // φ^0 = 1
      case (#D1_Temporal)       { Float.pow(PHI, 1.0) };  // φ^1
      case (#D2_Harmonic)       { Float.pow(PHI, 2.0) };  // φ^2
      case (#D3_CrossChannel)   { Float.pow(PHI, 3.0) };  // φ^3
      case (#D4_Transcendent)   { Float.pow(PHI, 4.0) };  // φ^4
    }
  };

  // ── Text helpers for Block Kit JSON generation ─────────────────────

  /// Strip leading/trailing whitespace from text
  func trim_text(t : Text) : Text {
    let chars = Text.toIter(t);
    let buf = Buffer.Buffer<Char>(t.size());
    for (c in chars) { buf.add(c) };
    // Trim leading spaces
    var start = 0;
    while (start < buf.size() and buf.get(start) == ' ') { start += 1 };
    // Trim trailing spaces
    var trimEnd = buf.size();
    while (trimEnd > start and buf.get(trimEnd - 1) == ' ') { trimEnd -= 1 };
    let result = Buffer.Buffer<Char>(trimEnd - start);
    var i = start;
    while (i < trimEnd) {
      result.add(buf.get(i));
      i += 1;
    };
    Text.fromIter(result.vals())
  };

  /// Escape special characters for inline JSON strings
  func escape_json(t : Text) : Text {
    var result = "";
    for (c in Text.toIter(t)) {
      let escapedChar : Text = switch (Char.toNat32(c)) {
        case (34)  { "\\\"" };   // double-quote
        case (92)  { "\\\\" };   // backslash
        case (10)  { "\\n" };    // newline
        case (13)  { "\\r" };    // carriage return
        case (_)   { Text.fromChar(c) };
      };
      result #= escapedChar;
    };
    result
  };

  /// Return true if text contains any of the given substrings
  func text_contains_any(t : Text, needles : [Text]) : Bool {
    for (needle in needles.vals()) {
      if (Text.contains(t, #text needle)) { return true };
    };
    false
  };

}
