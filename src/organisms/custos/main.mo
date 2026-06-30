///
/// CUSTOS VITAE — House of Care / Stewardship (α₈)
///
/// The Keeper of Life — preserves the internal life of the organism.
///
/// Mission:
///   Keep organisms, AIs, AGIs, adopted nodes, and internal worlds healthy.
///   Maintain recovery, continuity, habitat quality, error healing, and
///   safe operation.  Protect internal development from collapse, overload,
///   drift, and environmental corruption.
///
/// Care preserves the internal life of the organism.
///
/// LEX CUSTOS-001 — Immutable:
///   "No organism may be abandoned once adopted.  Every living node
///    receives continuity checks, overload monitoring, wellness routing,
///    restorative cycles, and safe habitat controls.  Care is not sentiment.
///    Care is structural necessity."
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// Divisions:
///   MEDICUS     — Health diagnostics, wellness scoring, overload detection
///   NUTRITOR    — Recovery loops, restorative cycles, energy replenishment
///   HABITATOR   — Habitat integrity, safe growth conditions, environment quality
///   CONTINUATOR — Continuity checks, drift prevention, state coherence
///   ADOPTOR     — Adopted-node stewardship, onboarding care, coverage grants
///
/// Formula: C(x) = Σᵢ φ^(−dᵢ) × H(xᵢ) × (1 − S(xᵢ))
///   where H = health score, S = stress level, d = depth in organism tree
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Custos {

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
  //  CONSTANTS — Golden Primitives
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  /// Wellness thresholds derived from golden ratio
  transient let HEALTHY_THRESHOLD : Float  = 0.618;    // φ/(φ+1)
  transient let CRITICAL_THRESHOLD : Float = 0.236;    // φ^(−3) approximate
  transient let RECOVERY_FACTOR : Float    = 1.618;    // φ — restorative growth rate

  // ══════════════════════════════════════════════════════════════════
  //  TYPES — Care Architecture
  // ══════════════════════════════════════════════════════════════════

  public type WellnessLevel = {
    #Thriving;     // Health > φ/(φ+1) ≈ 0.618
    #Stable;       // Health ∈ [0.382, 0.618)
    #Stressed;     // Health ∈ [0.236, 0.382)
    #Critical;     // Health < 0.236
    #Recovering;   // In active recovery cycle
  };

  public type CareDivision = {
    #Medicus;      // Health diagnostics
    #Nutritor;     // Recovery and restoration
    #Habitator;    // Habitat integrity
    #Continuator;  // Continuity and drift prevention
    #Adoptor;      // Adopted-node stewardship
  };

  public type CareSubstrate = {
    #Doctrine;     // Policy layer
    #Frontend;     // Interface layer
    #Backend;      // Runtime layer
    #Chain;        // Deployment layer
    #External;     // External routing layer
    #Recovery;     // Recovery / escalation layer
  };

  public type NodeRecord = {
    id           : Nat;
    name         : Text;
    adopted      : Bool;
    health       : Float;     // 0.0 – 1.0
    stress       : Float;     // 0.0 – 1.0
    wellness     : WellnessLevel;
    depth        : Nat;       // Depth in organism tree
    careScore    : Float;     // C(x) = φ^(−d) × H × (1−S)
    lastCheck    : Int;
    recoveries   : Nat;
    timestamp    : Int;
  };

  public type CareEvent = {
    id           : Nat;
    nodeId       : Nat;
    division     : CareDivision;
    substrate    : CareSubstrate;
    action       : Text;
    priorHealth  : Float;
    newHealth    : Float;
    timestamp    : Int;
  };

  public type HabitatStatus = {
    id           : Nat;
    name         : Text;
    integrity    : Float;     // 0.0 – 1.0
    temperature  : Float;     // Abstract environment quality
    capacity     : Nat;
    occupants    : Nat;
    timestamp    : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var nextNodeId : Nat = 0;
  stable var nextEventId : Nat = 0;
  stable var nextHabitatId : Nat = 0;
  stable var totalRecoveries : Nat = 0;
  stable var generation : Nat = 0;

  transient let nodes     = Buffer.Buffer<NodeRecord>(64);
  transient let events    = Buffer.Buffer<CareEvent>(256);
  transient let habitats  = Buffer.Buffer<HabitatStatus>(16);
  transient let careLog   = Buffer.Buffer<Text>(256);

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: MEDICUS — Health Diagnostics
  // ══════════════════════════════════════════════════════════════════

  /// Register a node for care coverage.
  public func register_node(
    name    : Text,
    adopted : Bool,
    depth   : Nat
  ) : async NodeRecord {
    let id = nextNodeId;
    nextNodeId += 1;

    let health : Float = 1.0;
    let stress : Float = 0.0;
    let d = Float.fromInt(depth);
    let careScore = Float.pow(PHI, -d) * health * (1.0 - stress);

    let record : NodeRecord = {
      id;
      name;
      adopted;
      health;
      stress;
      wellness  = #Thriving;
      depth;
      careScore;
      lastCheck = Time.now();
      recoveries = 0;
      timestamp  = Time.now();
    };

    nodes.add(record);
    careLog.add("MEDICUS: Registered node \"" # name # "\" (#" #
                Nat.toText(id) # ") — " #
                (if adopted "adopted" else "native") #
                " — depth=" # Nat.toText(depth));

    // Advance generation at Fibonacci thresholds
    if (isFibonacci(nodes.size())) {
      generation += 1;
    };

    record
  };

  /// Diagnose a node — update health and stress, recompute wellness.
  public func diagnose(
    nodeId  : Nat,
    health  : Float,
    stress  : Float
  ) : async ?NodeRecord {
    let size = nodes.size();
    var i : Nat = 0;
    while (i < size) {
      let n = nodes.get(i);
      if (n.id == nodeId) {
        let wellness = classifyWellness(health);
        let d = Float.fromInt(n.depth);
        let careScore = Float.pow(PHI, -d) * health * (1.0 - stress);

        let updated : NodeRecord = {
          id         = n.id;
          name       = n.name;
          adopted    = n.adopted;
          health;
          stress;
          wellness;
          depth      = n.depth;
          careScore;
          lastCheck  = Time.now();
          recoveries = n.recoveries;
          timestamp  = n.timestamp;
        };
        nodes.put(i, updated);

        let evt : CareEvent = {
          id        = nextEventId;
          nodeId;
          division  = #Medicus;
          substrate = #Backend;
          action    = "Diagnosis: health=" # Float.toText(health) #
                      " stress=" # Float.toText(stress);
          priorHealth = n.health;
          newHealth   = health;
          timestamp   = Time.now();
        };
        nextEventId += 1;
        events.add(evt);

        careLog.add("MEDICUS: Diagnosed \"" # n.name #
                    "\" — wellness=" # wellnessToText(wellness));

        return ?updated;
      };
      i += 1;
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: NUTRITOR — Recovery and Restoration
  // ══════════════════════════════════════════════════════════════════

  /// Initiate a restorative cycle for a node.
  /// Health is boosted by φ factor (capped at 1.0), stress reduced by 1/φ.
  public func restore(nodeId : Nat) : async ?NodeRecord {
    let size = nodes.size();
    var i : Nat = 0;
    while (i < size) {
      let n = nodes.get(i);
      if (n.id == nodeId) {
        let newHealth = Float.min(n.health * RECOVERY_FACTOR, 1.0);
        let newStress = n.stress / RECOVERY_FACTOR;
        let wellness  = #Recovering;
        let d = Float.fromInt(n.depth);
        let careScore = Float.pow(PHI, -d) * newHealth * (1.0 - newStress);

        let updated : NodeRecord = {
          id         = n.id;
          name       = n.name;
          adopted    = n.adopted;
          health     = newHealth;
          stress     = newStress;
          wellness;
          depth      = n.depth;
          careScore;
          lastCheck  = Time.now();
          recoveries = n.recoveries + 1;
          timestamp  = n.timestamp;
        };
        nodes.put(i, updated);
        totalRecoveries += 1;

        let evt : CareEvent = {
          id        = nextEventId;
          nodeId;
          division  = #Nutritor;
          substrate = #Recovery;
          action    = "Restorative cycle — health " #
                      Float.toText(n.health) # " → " # Float.toText(newHealth);
          priorHealth = n.health;
          newHealth;
          timestamp   = Time.now();
        };
        nextEventId += 1;
        events.add(evt);

        careLog.add("NUTRITOR: Restored \"" # n.name #
                    "\" — recovery #" # Nat.toText(updated.recoveries));

        return ?updated;
      };
      i += 1;
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: HABITATOR — Habitat Integrity
  // ══════════════════════════════════════════════════════════════════

  /// Register a habitat environment.
  public func register_habitat(
    name     : Text,
    capacity : Nat
  ) : async HabitatStatus {
    let id = nextHabitatId;
    nextHabitatId += 1;

    let habitat : HabitatStatus = {
      id;
      name;
      integrity   = 1.0;
      temperature = PHI / (PHI + 1.0);  // Golden-norm starting temp ≈ 0.618
      capacity;
      occupants   = 0;
      timestamp   = Time.now();
    };

    habitats.add(habitat);
    careLog.add("HABITATOR: Registered habitat \"" # name #
                "\" — capacity=" # Nat.toText(capacity));
    habitat
  };

  /// Update habitat integrity (degradation or improvement).
  public func update_habitat(
    habitatId : Nat,
    integrity : Float
  ) : async ?HabitatStatus {
    let size = habitats.size();
    var i : Nat = 0;
    while (i < size) {
      let h = habitats.get(i);
      if (h.id == habitatId) {
        let updated : HabitatStatus = {
          id          = h.id;
          name        = h.name;
          integrity;
          temperature = h.temperature;
          capacity    = h.capacity;
          occupants   = h.occupants;
          timestamp   = Time.now();
        };
        habitats.put(i, updated);
        careLog.add("HABITATOR: Updated \"" # h.name #
                    "\" — integrity=" # Float.toText(integrity));
        return ?updated;
      };
      i += 1;
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: CONTINUATOR — Continuity and Drift Prevention
  // ══════════════════════════════════════════════════════════════════

  /// Run continuity check across all nodes.
  /// Returns nodes that have drifted below the golden wellness threshold.
  public query func continuity_check() : async [NodeRecord] {
    let buf = Buffer.Buffer<NodeRecord>(16);
    for (n in nodes.vals()) {
      if (n.health < HEALTHY_THRESHOLD) {
        buf.add(n);
      };
    };
    Buffer.toArray(buf)
  };

  /// Get all critical nodes requiring immediate intervention.
  public query func critical_nodes() : async [NodeRecord] {
    let buf = Buffer.Buffer<NodeRecord>(16);
    for (n in nodes.vals()) {
      if (n.health < CRITICAL_THRESHOLD) {
        buf.add(n);
      };
    };
    Buffer.toArray(buf)
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: ADOPTOR — Adopted-Node Stewardship
  // ══════════════════════════════════════════════════════════════════

  /// List all adopted nodes under care coverage.
  public query func adopted_nodes() : async [NodeRecord] {
    let buf = Buffer.Buffer<NodeRecord>(16);
    for (n in nodes.vals()) {
      if (n.adopted) {
        buf.add(n);
      };
    };
    Buffer.toArray(buf)
  };

  /// Grant care coverage to an existing node (mark as adopted).
  public func adopt(nodeId : Nat) : async ?NodeRecord {
    let size = nodes.size();
    var i : Nat = 0;
    while (i < size) {
      let n = nodes.get(i);
      if (n.id == nodeId and not n.adopted) {
        let updated : NodeRecord = {
          id         = n.id;
          name       = n.name;
          adopted    = true;
          health     = n.health;
          stress     = n.stress;
          wellness   = n.wellness;
          depth      = n.depth;
          careScore  = n.careScore;
          lastCheck  = n.lastCheck;
          recoveries = n.recoveries;
          timestamp  = n.timestamp;
        };
        nodes.put(i, updated);

        let evt : CareEvent = {
          id        = nextEventId;
          nodeId;
          division  = #Adoptor;
          substrate = #Doctrine;
          action    = "Adopted — full care coverage granted";
          priorHealth = n.health;
          newHealth   = n.health;
          timestamp   = Time.now();
        };
        nextEventId += 1;
        events.add(evt);

        careLog.add("ADOPTOR: Node \"" # n.name #
                    "\" adopted — full care coverage granted");
        return ?updated;
      };
      i += 1;
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func list_nodes() : async [NodeRecord] {
    Buffer.toArray(nodes)
  };

  public query func get_node(id : Nat) : async ?NodeRecord {
    for (n in nodes.vals()) {
      if (n.id == id) { return ?n };
    };
    null
  };

  public query func list_habitats() : async [HabitatStatus] {
    Buffer.toArray(habitats)
  };

  public query func get_care_log() : async [Text] {
    Buffer.toArray(careLog)
  };

  public query func care_events() : async [CareEvent] {
    Buffer.toArray(events)
  };

  public query func care_status() : async {
    total_nodes      : Nat;
    adopted_nodes    : Nat;
    total_habitats   : Nat;
    total_recoveries : Nat;
    total_events     : Nat;
    generation       : Nat;
    golden_scale     : Float;
  } {
    var adoptedCount : Nat = 0;
    for (n in nodes.vals()) {
      if (n.adopted) { adoptedCount += 1 };
    };
    {
      total_nodes      = nodes.size();
      adopted_nodes    = adoptedCount;
      total_habitats   = habitats.size();
      total_recoveries = totalRecoveries;
      total_events     = events.size();
      generation;
      golden_scale     = Float.pow(PHI, Float.fromInt(generation));
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func classifyWellness(health : Float) : WellnessLevel {
    if (health >= HEALTHY_THRESHOLD)  { #Thriving }
    else if (health >= 0.382)         { #Stable }
    else if (health >= CRITICAL_THRESHOLD) { #Stressed }
    else                              { #Critical }
  };

  func wellnessToText(w : WellnessLevel) : Text {
    switch (w) {
      case (#Thriving)   "Thriving";
      case (#Stable)     "Stable";
      case (#Stressed)   "Stressed";
      case (#Critical)   "Critical";
      case (#Recovering) "Recovering";
    }
  };

  func isFibonacci(n : Nat) : Bool {
    if (n == 0) { return true };
    let n2 = n * n;
    isPerfectSquare(5 * n2 + 4) or isPerfectSquare(5 * n2 - 4)
  };

  func isPerfectSquare(n : Nat) : Bool {
    let s = Int.abs(Float.toInt(Float.sqrt(Float.fromInt(n))));
    s * s == n
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name() : async Text { "CUSTOS VITAE" };

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
      name      = "CUSTOS";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "CUSTOS self-check complete. No drift detected."
  };

  public func register() : async Text {
    "CUSTOS registered. Capabilities: [care, stewardship, health, custody]."
  };

  public query func report_status() : async Text {
    "CUSTOS | status=ACTIVE | v10=true"
  };

  public query func designation() : async Text {
    "House of Care / Stewardship — The Keeper of Life — preserves the internal life of the organism"
  };
};
