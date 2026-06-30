///
/// TERMINAL HUB — Central AGI Terminal Command Router
///
/// "One hub. Many terminals. Infinite control."
///
/// TerminalHub is the central command routing organism that coordinates
/// all AGI Terminal interfaces across the Native Nova Protocol. It receives
/// commands from multiple terminal sources and routes them to the appropriate
/// organisms with full CPL Runtime enforcement and proof generation.
///
/// Terminal Sources:
///   - Desktop Terminal    (NovaChatTerminal.ts)
///   - Web Terminal        (browser-based interface)
///   - Mobile Terminal     (iOS/Android apps)
///   - Voice Terminal      (speech-to-command)
///   - Vision Terminal     (gesture/visual commands)
///   - CLI Terminal        (command line interface)
///   - Admin Terminal      (Terminal organism direct)
///
/// Command Flow:
///   Terminal Interface → TerminalHub → CPL Enforcement → Target Organism
///                                   ↓
///                              Proof Trace → Memory Record
///
/// Architecture:
///   ROUTER     — Routes commands to correct organism
///   ENFORCER   — Applies CPL invariants before execution
///   TRACER     — Generates proof traces for all commands
///   MONITOR    — Tracks terminal sessions and command history
///   SECURITY   — Authenticates terminals and validates permissions
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";

persistent actor TerminalHub {

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

  public type TerminalType = {
    #Desktop;
    #Web;
    #Mobile;
    #Voice;
    #Vision;
    #CLI;
    #Admin;
  };

  public type CommandCategory = {
    #Query;        // Read-only queries
    #Mutation;     // State-changing operations
    #System;       // System-level commands
    #Deploy;       // Deployment operations
    #Governance;   // Governance actions
    #Emergency;    // Emergency controls
  };

  public type TerminalSession = {
    sessionId : Text;
    terminalType : TerminalType;
    principal : Principal;
    startTime : Int;
    lastActivity : Int;
    commandCount : Nat;
    authenticated : Bool;
  };

  public type Command = {
    commandId : Text;
    sessionId : Text;
    terminalType : TerminalType;
    category : CommandCategory;
    target : Text;          // Target organism
    action : Text;          // Action to perform
    args : [Text];          // Command arguments
    timestamp : Int;
    principal : Principal;
  };

  public type CommandResult = {
    commandId : Text;
    success : Bool;
    result : Text;
    proofTraceId : ?Text;
    executionTimeMs : Nat;
    timestamp : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STABLE STORAGE
  // ══════════════════════════════════════════════════════════════════

  stable var sessions : [TerminalSession] = [];
  stable var commandHistory : [Command] = [];
  stable var resultHistory : [CommandResult] = [];
  stable var sessionCounter : Nat = 0;
  stable var commandCounter : Nat = 0;

  // Registered organisms
  stable var organisms : [(Text, Principal)] = [];

  // ══════════════════════════════════════════════════════════════════
  //  SESSION MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// Create a new terminal session
  public shared(msg) func createSession(terminalType : TerminalType) : async Result.Result<Text, Text> {
    let sessionId = "TERM-" # Nat.toText(sessionCounter);
    sessionCounter += 1;

    let session : TerminalSession = {
      sessionId = sessionId;
      terminalType = terminalType;
      principal = msg.caller;
      startTime = Time.now();
      lastActivity = Time.now();
      commandCount = 0;
      authenticated = true;  // TODO: Add proper authentication
    };

    sessions := Array.append(sessions, [session]);

    // BRAIN MONITORING: Notify Brain of session creation
    switch (getBrain()) {
      case (?brain) {
        let terminalTypeName = switch (terminalType) {
          case (#Desktop) "Desktop";
          case (#Web) "Web";
          case (#Mobile) "Mobile";
          case (#Voice) "Voice";
          case (#Vision) "Vision";
          case (#CLI) "CLI";
          case (#Admin) "Admin";
        };
        let auditMsg = "TERMINAL_HUB session created: " # sessionId # " [" # terminalTypeName # "]";
        ignore await brain.recordAudit(auditMsg, "TERMINAL_SESSION");
      };
      case null {};
    };

    // Write proof trace for session creation
    switch (getCPL()) {
      case (?cpl) {
        ignore await cpl.writeProofTrace(
          "terminal_hub:session_created:" # sessionId,
          ["DOCTRINE-TERMINAL-ACCESS"],
          "PROTOCOL-TERMINAL-SESSION",
          [],
          [],
          [],
          ["session:" # sessionId],
          [],
          #Passed,
          false
        );
      };
      case null {};
    };

    #ok(sessionId)
  };

  /// Get session info
  public query func getSession(sessionId : Text) : async ?TerminalSession {
    Array.find<TerminalSession>(sessions, func(s) { s.sessionId == sessionId })
  };

  /// Close a session
  public shared(msg) func closeSession(sessionId : Text) : async Result.Result<(), Text> {
    sessions := Array.filter<TerminalSession>(sessions, func(s) { s.sessionId != sessionId });
    #ok()
  };

  // ══════════════════════════════════════════════════════════════════
  //  COMMAND ROUTING
  // ══════════════════════════════════════════════════════════════════

  /// Execute a command through the hub with CPL enforcement
  public shared(msg) func executeCommand(
    sessionId : Text,
    target : Text,
    action : Text,
    args : [Text],
    category : CommandCategory
  ) : async Result.Result<CommandResult, Text> {

    // Verify session exists
    let sessionOpt = Array.find<TerminalSession>(sessions, func(s) { s.sessionId == sessionId });
    let session = switch (sessionOpt) {
      case null { return #err("Session not found: " # sessionId) };
      case (?s) { s };
    };

    // Generate command ID
    let commandId = "CMD-" # Nat.toText(commandCounter);
    commandCounter += 1;

    let command : Command = {
      commandId = commandId;
      sessionId = sessionId;
      terminalType = session.terminalType;
      category = category;
      target = target;
      action = action;
      args = args;
      timestamp = Time.now();
      principal = msg.caller;
    };

    commandHistory := Array.append(commandHistory, [command]);

    let startTime = Time.now();

    // CPL ENFORCEMENT: Check invariants before mutation commands
    let shouldEnforce = switch (category) {
      case (#Mutation) true;
      case (#Deploy) true;
      case (#Governance) true;
      case (#Emergency) true;
      case (#System) true;
      case (#Query) false;
    };

    if (shouldEnforce) {
      switch (getCPL()) {
        case (?cpl) {
          let enforceResult = await cpl.enforceBeforeWrite(
            ["INV-TERMINAL-001", "INV-TERMINAL-002"],
            "terminalCommand:" # action,
            commandId
          );
          switch (enforceResult) {
            case (#err(e)) {
              return #err("CPL enforcement blocked command: " # e)
            };
            case (#ok()) {};
          };
        };
        case null {};
      };
    };

    // TODO: Route to actual organism and execute
    // For now, return success placeholder
    let result = "Command routed to " # target # "." # action;

    let endTime = Time.now();
    let executionTimeMs = Int.abs(endTime - startTime) / 1_000_000;

    // Generate proof trace
    var proofTraceId : ?Text = null;
    switch (getCPL()) {
      case (?cpl) {
        let traceResult = await cpl.writeProofTrace(
          "terminal_hub:command:" # commandId,
          ["DOCTRINE-TERMINAL-ACCESS"],
          "PROTOCOL-TERMINAL-COMMAND",
          [],
          [],
          [],
          ["command:" # commandId, "session:" # sessionId],
          [result],
          #Passed,
          false
        );
        switch (traceResult) {
          case (#ok(id)) { proofTraceId := ?id };
          case (#err(_)) {};
        };
      };
      case null {};
    };

    let cmdResult : CommandResult = {
      commandId = commandId;
      success = true;
      result = result;
      proofTraceId = proofTraceId;
      executionTimeMs = executionTimeMs;
      timestamp = Time.now();
    };

    resultHistory := Array.append(resultHistory, [cmdResult]);

    // BRAIN MONITORING: Send command execution telemetry to Brain
    switch (getBrain()) {
      case (?brain) {
        let categoryName = switch (category) {
          case (#Query) "Query";
          case (#Mutation) "Mutation";
          case (#System) "System";
          case (#Deploy) "Deploy";
          case (#Governance) "Governance";
          case (#Emergency) "Emergency";
        };
        let auditMsg = "TERMINAL_HUB CMD " # commandId # " [" # categoryName # "] " #
                       target # "." # action # " → " # (if (cmdResult.success) "OK" else "FAIL");
        ignore await brain.recordAudit(auditMsg, "TERMINAL_HUB_CMD");
      };
      case null {};
    };

    #ok(cmdResult)
  };

  // ══════════════════════════════════════════════════════════════════
  //  ORGANISM REGISTRY
  // ══════════════════════════════════════════════════════════════════

  /// Register an organism for command routing
  public shared(msg) func registerOrganism(name : Text, canisterId : Principal) : async Result.Result<(), Text> {
    organisms := Array.append(organisms, [(name, canisterId)]);
    #ok()
  };

  /// Get registered organisms
  public query func getOrganisms() : async [(Text, Principal)] {
    organisms
  };

  // ══════════════════════════════════════════════════════════════════
  //  MONITORING
  // ══════════════════════════════════════════════════════════════════

  /// Get hub statistics
  public query func getStats() : async {
    totalSessions : Nat;
    activeSessions : Nat;
    totalCommands : Nat;
    successfulCommands : Nat;
    registeredOrganisms : Nat;
  } {
    {
      totalSessions = sessionCounter;
      activeSessions = sessions.size();
      totalCommands = commandCounter;
      successfulCommands = Array.filter<CommandResult>(resultHistory, func(r) { r.success }).size();
      registeredOrganisms = organisms.size();
    }
  };

  /// Get recent commands
  public query func getRecentCommands(limit : Nat) : async [Command] {
    let histSize = commandHistory.size();
    if (histSize <= limit) {
      commandHistory
    } else {
      Array.tabulate<Command>(limit, func(i) {
        commandHistory[histSize - limit + i]
      })
    }
  };

  /// Get command result
  public query func getCommandResult(commandId : Text) : async ?CommandResult {
    Array.find<CommandResult>(resultHistory, func(r) { r.commandId == commandId })
  };
}
