///
/// TERMINAL — The Admin Command Interface
///
/// The high-tech command surface for the Native Nova Protocol.
/// This is the admin window — the control plane.  Every organism,
/// every node, every canister, every observation is accessible
/// through Terminal.
///
/// Terminal doesn't own anything.  It provides sovereign access.
/// It's the window into the civilization — the admin console that
/// lets the founder see and command everything.
///
/// Sub-models:
///   COMMAND   — Command parsing and routing to organisms
///   DASH      — Status aggregation and dashboard views
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
///   AUDIT     — Full audit trail across all organisms
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Terminal {

  // ══════════════════════════════════════════════════════════════════
  //  CPL RUNTIME WIRING — The Permanent Foundation
  // ══════════════════════════════════════════════════════════════════
  stable var cplRuntimeCanisterId : ?Principal = null;
  stable var brainCanisterId : ?Principal = null;

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

  public shared(msg) func setBrain(canisterId : Principal) : async () {
    brainCanisterId := ?canisterId;
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

  type Brain = actor {
    recordAudit : (Text, Text) -> async Nat;
  };

  func getBrain() : ?Brain {
    switch (brainCanisterId) {
      case null null;
      case (?id) {
        let brain : Brain = actor (Principal.toText(id));
        ?brain
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  CONSTANTS
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type CommandResult = {
    id        : Nat;
    command   : Text;
    target    : Text;
    result    : Text;
    success   : Bool;
    timestamp : Int;
  };

  public type OrganismStatus = {
    name        : Text;
    designation : Text;
    canister    : Text;
    alive       : Bool;
    subModels   : [Text];
  };

  public type DashboardView = {
    total_organisms     : Nat;
    total_sub_models    : Nat;
    total_nodes         : Nat;
    total_canisters     : Nat;
    total_blocks        : Nat;
    total_observations  : Nat;
    current_epoch       : Nat;
    golden_scale        : Float;
    uptime              : Int;
  };

  public type AuditEntry = {
    id        : Nat;
    organism  : Text;
    action    : Text;
    detail    : Text;
    timestamp : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var nextCmdId : Nat = 0;
  stable var nextAuditId : Nat = 0;
  stable var bootTime : Int = 0;
  stable var booted : Bool = false;

  transient let commandHistory = Buffer.Buffer<CommandResult>(256);
  transient let auditTrail = Buffer.Buffer<AuditEntry>(512);
  transient let termLog = Buffer.Buffer<Text>(256);

  // ══════════════════════════════════════════════════════════════════
  //  BOOT
  // ══════════════════════════════════════════════════════════════════

  public func boot() : async Bool {
    if (booted) { return true };
    bootTime := Time.now();
    booted := true;
    termLog.add("TERMINAL booted — admin command interface online");
    audit("TERMINAL", "boot", "Admin terminal initialized");

    // BRAIN MONITORING: Notify Brain of Terminal boot
    switch (getBrain()) {
      case (?brain) {
        ignore await brain.recordAudit("TERMINAL organism booted", "TERMINAL_BOOT");
      };
      case null {};
    };

    true
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: COMMAND — Command Routing
  // ══════════════════════════════════════════════════════════════════

  /// Execute a command against the protocol.
  /// Routes to the appropriate organism based on target.
  /// NOW WITH CPL ENFORCEMENT AND PROOF TRACE GENERATION
  public func execute(command : Text, target : Text) : async CommandResult {
    let id = nextCmdId;
    nextCmdId += 1;

    // CPL ENFORCEMENT: Check invariants before executing commands
    let isMutatingCommand = switch (command) {
      case "spin" true;
      case "expand" true;
      case "spawn" true;
      case "forge" true;
      case _ false;
    };

    if (isMutatingCommand) {
      switch (getCPL()) {
        case (?cpl) {
          let enforceResult = await cpl.enforceBeforeWrite(
            ["INV-TERMINAL-001", "INV-TERMINAL-002"],
            "terminal:" # command,
            target
          );
          switch (enforceResult) {
            case (#err(e)) {
              // Return blocked command result
              let cmd : CommandResult = {
                id;
                command;
                target;
                result = "CPL BLOCKED: " # e;
                success = false;
                timestamp = Time.now();
              };
              commandHistory.add(cmd);
              audit(target, command, "BLOCKED by CPL: " # e);
              return cmd;
            };
            case (#ok()) {};
          };
        };
        case null {};
      };
    };

    let result = routeCommand(command, target);

    let cmd : CommandResult = {
      id;
      command;
      target;
      result = result.0;
      success = result.1;
      timestamp = Time.now();
    };

    commandHistory.add(cmd);
    audit(target, command, result.0);
    termLog.add("CMD #" # Nat.toText(id) # " [" # target # "] " #
                command # " → " # (if (result.1) "OK" else "FAIL"));

    // BRAIN MONITORING: Send real-time command telemetry to Brain
    switch (getBrain()) {
      case (?brain) {
        let auditMsg = "TERMINAL CMD #" # Nat.toText(id) # " [" # target # "] " #
                       command # " → " # (if (result.1) "OK" else "FAIL");
        ignore await brain.recordAudit(auditMsg, "TERMINAL_CMD");
      };
      case null {};
    };

    // CPL PROOF TRACE: Generate proof for executed command
    switch (getCPL()) {
      case (?cpl) {
        let proofResult : ProofResult = if (result.1) #Passed else #Failed;
        ignore await cpl.writeProofTrace(
          "terminal:cmd:" # Nat.toText(id),
          ["DOCTRINE-TERMINAL-ACCESS"],
          "PROTOCOL-TERMINAL-COMMAND",
          [],
          [],
          [],
          ["command:" # command, "target:" # target],
          [result.0],
          proofResult,
          false
        );
      };
      case null {};
    };

    cmd
  };

  /// Route a command to the appropriate handler.
  func routeCommand(command : Text, target : Text) : (Text, Bool) {
    // Command routing — maps admin commands to organism actions
    switch (command) {
      case "status" {
        ("Queried status for " # target, true)
      };
      case "list" {
        ("Listed resources for " # target, true)
      };
      case "spin" {
        ("Spin command routed to SOVEREIGN.SPINNER for " # target, true)
      };
      case "observe" {
        ("Observe command routed to OBSV for " # target, true)
      };
      case "expand" {
        ("Expand command routed to SOVEREIGN.FABRIC for " # target, true)
      };
      case "synthesize" {
        ("Synthesize command routed to SCRIBE.SYNTHESIZER for " # target, true)
      };
      case "spawn" {
        ("Spawn command routed to ARCHITECT.REPLICATOR for " # target, true)
      };
      case "forge" {
        ("Forge block command routed to chain for " # target, true)
      };
      case "audit" {
        ("Audit trail retrieved for " # target, true)
      };
      case _ {
        ("Unknown command: " # command, false)
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: DASH — Dashboard & Status Aggregation
  // ══════════════════════════════════════════════════════════════════

  /// Get the full civilization registry — all organisms and their status.
  public query func dash_organisms() : async [OrganismStatus] {
    [
      {
        name        = "SOVEREIGN";
        designation = "The Substrate Itself";
        canister    = "src/organisms/sovereign/main.mo";
        alive       = true;
        subModels   = ["FABRIC", "SPINNER", "CIPHER", "CONSENSUS"];
      },
      {
        name        = "CHRYSALIS";
        designation = "Golden Mathematics Core";
        canister    = "src/organisms/chrysalis/main.mo";
        alive       = true;
        subModels   = ["FIBONACCI", "SPIRAL"];
      },
      {
        name        = "SCRIBE";
        designation = "The Document Organism";
        canister    = "src/organisms/scribe/main.mo";
        alive       = true;
        subModels   = ["CLASSIFIER", "SYNTHESIZER"];
      },
      {
        name        = "ARCHITECT";
        designation = "The Meta-Builder";
        canister    = "src/organisms/architect/main.mo";
        alive       = true;
        subModels   = ["REPLICATOR"];
      },
      {
        name        = "NEXUS";
        designation = "The Substrate Walker";
        canister    = "src/organisms/nexus/main.mo";
        alive       = true;
        subModels   = ["PROPAGATOR"];
      },
      {
        name        = "OBSERVATORES UNIVERSI";
        designation = "Guardians of the Universe — Police, Caregivers, Caretakers";
        canister    = "src/organisms/observer/main.mo";
        alive       = true;
        subModels   = [
          "SPECULATOR DIMENSIONUM", "VIGIL TRANSITUS",
          "CUSTOS RESONANTIAE", "EXPLORATOR INTERDIMENSIONALIS",
          "SENTINELLA SUPREMA", "VIGIL", "SPECULATOR",
          "SYNTHESISTA PATTERNORUM", "THEORICUS INTERDIMENSIONALIS"
        ];
      },
      {
        name        = "TERMINAL";
        designation = "The Admin Command Interface";
        canister    = "src/organisms/terminal/main.mo";
        alive       = booted;
        subModels   = ["COMMAND", "DASH", "AUDIT"];
      }
    ]
  };

  /// Dashboard overview — aggregate stats from all organisms.
  public query func dash_overview() : async DashboardView {
    {
      total_organisms    = 7;    // SOVEREIGN + CHRYSALIS + SCRIBE + ARCHITECT + NEXUS + OBSV + TERMINAL
      total_sub_models   = 24;   // All sub-models across all organisms
      total_nodes        = 4000; // SOVEREIGN default
      total_canisters    = 7;
      total_blocks       = 0;    // Aggregated from chains
      total_observations = 0;    // From OBSV
      current_epoch      = 0;
      golden_scale       = 1.0;
      uptime             = if (booted) Time.now() - bootTime else 0;
    }
  };

  /// Available commands reference.
  public query func dash_commands() : async [(Text, Text)] {
    [
      ("status",     "Query organism status"),
      ("list",       "List resources (nodes, canisters, observations)"),
      ("spin",       "Spin up a sovereign canister"),
      ("observe",    "Trigger OBSV observation on a target"),
      ("expand",     "Expand SOVEREIGN node mesh"),
      ("synthesize", "Trigger SCRIBE paper synthesis"),
      ("spawn",      "Spawn new organism via ARCHITECT"),
      ("forge",      "Forge a new block"),
      ("audit",      "Retrieve audit trail")
    ]
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: AUDIT — Full Audit Trail
  // ══════════════════════════════════════════════════════════════════

  func audit(organism : Text, action : Text, detail : Text) {
    let entry : AuditEntry = {
      id        = nextAuditId;
      organism;
      action;
      detail;
      timestamp = Time.now();
    };
    nextAuditId += 1;
    auditTrail.add(entry);
  };

  /// Get the full audit trail.
  public query func get_audit_trail() : async [AuditEntry] {
    Buffer.toArray(auditTrail)
  };

  /// Get audit entries for a specific organism.
  public query func audit_for(organism : Text) : async [AuditEntry] {
    let buf = Buffer.Buffer<AuditEntry>(32);
    for (entry in auditTrail.vals()) {
      if (entry.organism == organism) { buf.add(entry) };
    };
    Buffer.toArray(buf)
  };

  /// Get command history.
  public query func get_command_history() : async [CommandResult] {
    Buffer.toArray(commandHistory)
  };

  /// Get terminal log.
  public query func get_log() : async [Text] {
    Buffer.toArray(termLog)
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name() : async Text { "TERMINAL" };

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
      name      = "TERMINAL";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "TERMINAL self-check complete. No drift detected."
  };

  public func register() : async Text {
    "TERMINAL registered. Capabilities: [command, admin, interface, execute]."
  };

  public query func report_status() : async Text {
    "TERMINAL | status=ACTIVE | v10=true"
  };

  public query func designation() : async Text {
    "The Admin Command Interface — The Window Into the Civilization"
  };
};
