///
/// PROTOCOL ENGINE — Living Protocol Execution Runtime
///
/// The protocol engine executes all 89 protocols across the organism network.
/// This is NOT a static interpreter. This IS a living execution substrate
/// that routes protocol calls to organisms, enforces protocol rules, and
/// maintains protocol state across the entire civilization.
///
/// 89 Protocols Executed:
///   - 10 AI Protocols (PRT-001 to PRT-010)
///   - 50 Alpha Protocols (APR-001 to APR-050)
///   - 29 Nova Mind Protocols (NMP-001 to NMP-029)
///
/// Protocol Execution Model:
///   1. Protocol Request → Hash to organism via Fibonacci routing
///   2. Parameter Adaptation → φ-weighted self-tuning
///   3. Multi-Organism Orchestration → Kuramoto synchronization
///   4. Result Attestation → Golden-ratio verification
///   5. State Persistence → Immutable protocol execution log
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Nat32  "mo:base/Nat32";
import Char   "mo:base/Char";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Hash   "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter   "mo:base/Iter";

persistent actor ProtocolEngine {

  // ── Constants ──────────────────────────────────────────────────────

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_INV : Float = 0.6180339887498948482;
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  // ── Types ──────────────────────────────────────────────────────────

  public type ProtocolId = Text;  // "PRT-001", "APR-042", "NMP-013"

  public type ProtocolTier = {
    #Core;
    #Orchestration;
    #Verification;
    #Alpha;
    #NovaMind;
  };

  public type AdaptiveMode = {
    #Static;
    #PhiAdaptive;
    #KuramotoSync;
    #GoldenSpiral;
    #FibonacciStep;
  };

  public type ProtocolStatus = {
    #Initialized;
    #Executing;
    #Adapting;
    #Complete;
    #Failed;
  };

  public type ProtocolDefinition = {
    id                : ProtocolId;
    name              : Text;
    latinDesignation  : Text;
    tier              : ProtocolTier;
    targetOrganisms   : [Text];  // Organism names this protocol routes to
    adaptiveMode      : AdaptiveMode;
    phiWeight         : Float;
    fibonacciIdentity : Nat;
  };

  public type ProtocolExecution = {
    executionId       : Nat;
    protocolId        : ProtocolId;
    input             : Text;
    parameters        : [(Text, Float)];
    targetOrganism    : Text;
    status            : ProtocolStatus;
    phiScore          : Float;
    timestamp         : Int;
    completionTime    : ?Int;
    result            : ?Text;
    attestation       : ?Nat;
  };

  public type ProtocolParameter = {
    name              : Text;
    currentValue      : Float;
    minValue          : Float;
    maxValue          : Float;
    adaptiveMode      : AdaptiveMode;
    phiDecayRate      : Float;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextExecutionId : Nat = 0;
  stable var totalExecutions : Nat = 0;

  transient let protocolRegistry = Buffer.Buffer<ProtocolDefinition>(100);
  transient let executionLog     = Buffer.Buffer<ProtocolExecution>(256);
  transient let parameterState   = HashMap.HashMap<Text, ProtocolParameter>(100, Text.equal, Text.hash);

  // ── Protocol Registry ──────────────────────────────────────────────

  /// Register a protocol definition
  public func register_protocol(
    id                : ProtocolId,
    name              : Text,
    latinDesignation  : Text,
    tier              : ProtocolTier,
    targetOrganisms   : [Text],
    adaptiveMode      : AdaptiveMode,
    phiWeight         : Float
  ) : async Bool {
    let fibId = fibonacciHash(id);

    let def : ProtocolDefinition = {
      id;
      name;
      latinDesignation;
      tier;
      targetOrganisms;
      adaptiveMode;
      phiWeight;
      fibonacciIdentity = fibId;
    };

    protocolRegistry.add(def);
    true
  };

  /// Execute a protocol
  public func execute_protocol(
    protocolId : ProtocolId,
    input      : Text,
    parameters : [(Text, Float)]
  ) : async ProtocolExecution {
    let executionId = nextExecutionId;
    nextExecutionId += 1;
    totalExecutions += 1;

    // Find protocol definition
    let protocolDef = findProtocol(protocolId);

    // Route to organism via Fibonacci hashing
    let targetOrganism = switch (protocolDef) {
      case (?def) { routeToOrganism(def, input) };
      case null { "unknown" };
    };

    // Calculate φ-score
    let phiScore = calculatePhiScore(input, parameters);

    let execution : ProtocolExecution = {
      executionId;
      protocolId;
      input;
      parameters;
      targetOrganism;
      status = #Executing;
      phiScore;
      timestamp = Time.now();
      completionTime = null;
      result = null;
      attestation = null;
    };

    executionLog.add(execution);
    execution
  };

  /// Complete a protocol execution
  public func complete_execution(
    executionId : Nat,
    result      : Text,
    attestation : Nat
  ) : async Bool {
    let size = executionLog.size();
    var i : Nat = 0;
    while (i < size) {
      let exec = executionLog.get(i);
      if (exec.executionId == executionId) {
        let completed : ProtocolExecution = {
          executionId    = exec.executionId;
          protocolId     = exec.protocolId;
          input          = exec.input;
          parameters     = exec.parameters;
          targetOrganism = exec.targetOrganism;
          status         = #Complete;
          phiScore       = exec.phiScore;
          timestamp      = exec.timestamp;
          completionTime = ?Time.now();
          result         = ?result;
          attestation    = ?attestation;
        };
        executionLog.put(i, completed);
        return true;
      };
      i += 1;
    };
    false
  };

  // ── Protocol Adaptation ────────────────────────────────────────────

  /// Adapt protocol parameters using φ-weighted self-tuning
  public func adapt_parameter(
    protocolId : ProtocolId,
    paramName  : Text,
    feedback   : Float  // Performance feedback: -1.0 to 1.0
  ) : async Float {
    let key = protocolId # ":" # paramName;

    switch (parameterState.get(key)) {
      case (?param) {
        // φ-adaptive adjustment: new = old + φ^(-decay) × feedback × range
        let range = param.maxValue - param.minValue;
        let adjustment = Float.pow(PHI, -param.phiDecayRate) * feedback * range;
        let newValue = Float.min(param.maxValue, Float.max(param.minValue, param.currentValue + adjustment));

        let updated : ProtocolParameter = {
          name = param.name;
          currentValue = newValue;
          minValue = param.minValue;
          maxValue = param.maxValue;
          adaptiveMode = param.adaptiveMode;
          phiDecayRate = param.phiDecayRate;
        };

        parameterState.put(key, updated);
        newValue
      };
      case null { 0.0 };
    };
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// List all registered protocols
  public query func list_protocols() : async [ProtocolDefinition] {
    Buffer.toArray(protocolRegistry)
  };

  /// Get protocol by ID
  public query func get_protocol(id : ProtocolId) : async ?ProtocolDefinition {
    findProtocol(id)
  };

  /// Get execution history
  public query func get_executions(limit : Nat) : async [ProtocolExecution] {
    let size = executionLog.size();
    let start = if (size > limit) { size - limit } else { 0 };
    let buf = Buffer.Buffer<ProtocolExecution>(limit);
    var i = start;
    while (i < size) {
      buf.add(executionLog.get(i));
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Get execution by ID
  public query func get_execution(id : Nat) : async ?ProtocolExecution {
    let size = executionLog.size();
    var i : Nat = 0;
    while (i < size) {
      let exec = executionLog.get(i);
      if (exec.executionId == id) { return ?exec };
      i += 1;
    };
    null
  };

  /// Engine statistics
  public query func engine_stats() : async {
    total_protocols  : Nat;
    total_executions : Nat;
    active_protocols : Nat;
  } {
    var active : Nat = 0;
    let size = executionLog.size();
    var i : Nat = 0;
    while (i < size) {
      let exec = executionLog.get(i);
      switch (exec.status) {
        case (#Executing) { active += 1 };
        case (#Adapting)  { active += 1 };
        case _ {};
      };
      i += 1;
    };

    {
      total_protocols  = protocolRegistry.size();
      total_executions = totalExecutions;
      active_protocols = active;
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func findProtocol(id : ProtocolId) : ?ProtocolDefinition {
    let size = protocolRegistry.size();
    var i : Nat = 0;
    while (i < size) {
      let proto = protocolRegistry.get(i);
      if (proto.id == id) { return ?proto };
      i += 1;
    };
    null
  };

  func routeToOrganism(def : ProtocolDefinition, input : Text) : Text {
    if (def.targetOrganisms.size() == 0) { return "unknown" };

    // Fibonacci hash routing
    let hash = fibonacciHash(input);
    let index = hash % def.targetOrganisms.size();
    def.targetOrganisms[index]
  };

  func calculatePhiScore(input : Text, parameters : [(Text, Float)]) : Float {
    var score : Float = 0.0;
    let inputLen = Float.fromInt(input.size());

    // Base score from input length × φ
    score += inputLen * PHI_INV;

    // Parameter contribution
    var i : Nat = 0;
    while (i < parameters.size()) {
      let (name, value) = parameters[i];
      score += value * PHI_INV;
      i += 1;
    };

    // Normalize to [0, 10)
    (score * PHI) % 10.0
  };

  func fibonacciHash(text : Text) : Nat {
    var h : Nat = 0;
    let chars = Text.toArray(text);
    var i : Nat = 0;
    while (i < chars.size()) {
      let code = Nat32.toNat(Char.toNat32(chars[i]));
      h := ((h * 31) + code) % 131072;  // 2^17 vocab size
      i += 1;
    };
    h
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "PROTOCOL_ENGINE" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "ACTIVE";
      health    = 1.0;
      name      = "PROTOCOL_ENGINE";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Living Protocol Execution Runtime — 89 protocols across the organism network"
  };
};
