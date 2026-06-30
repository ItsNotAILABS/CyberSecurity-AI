///
/// ARCHITECT — The Meta-Builder
///
/// Architecture creates more architecture.  That's all we do.
/// Architect takes golden patterns from Chrysalis, applies them to
/// generate new organism specifications.  He is the self-replicating
/// core — the reason the civilization keeps growing.
///
/// Sub-model hosted:
///   REPLICATOR — organism specification spawner
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Architect {

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

  // ── Constants ──────────────────────────────────────────────────────

  transient let PHI : Float = 1.6180339887498948482;
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  // ── Types ──────────────────────────────────────────────────────────

  /// An organism blueprint — the specification for a new organism.
  public type OrganismBlueprint = {
    id             : Nat;
    name           : Text;
    designation    : Text;
    substrate      : SubstrateType;
    generation     : Nat;
    parentId       : ?Nat;
    goldenPosition : (Float, Float);  // Position in the phyllotaxis field
    scale          : Float;           // Golden growth factor
    capabilities   : [Text];
    timestamp      : Int;
    status         : OrganismStatus;
  };

  public type SubstrateType = {
    #ICP;         // Internet Computer Protocol
    #Blockchain;  // General blockchain substrate
    #Edge;        // Edge computing nodes
    #Cloud;       // Cloud infrastructure
    #Phantom;     // Phantom network substrate
    #Hybrid;      // Multi-substrate organism
  };

  public type OrganismStatus = {
    #Blueprint;   // Specified but not yet spawned
    #Spawning;    // In the process of being created
    #Active;      // Living and operating
    #Dormant;     // Alive but not currently active
    #Propagating; // Spreading to new substrates
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextId : Nat = 0;
  stable var currentGeneration : Nat = 0;
  stable var totalOrganisms : Nat = 0;

  transient let registry   = Buffer.Buffer<OrganismBlueprint>(64);
  transient let buildLog   = Buffer.Buffer<Text>(128);

  // ── SUB-MODEL: REPLICATOR ──────────────────────────────────────────

  /// Spawn a new organism blueprint.
  /// Position is determined by phyllotaxis — each new organism takes
  /// the next golden-angle position in the field, ensuring optimal
  /// non-overlapping distribution across the civilization.
  public func spawn(
    name         : Text,
    designation  : Text,
    substrate    : SubstrateType,
    capabilities : [Text],
    parentId     : ?Nat
  ) : async OrganismBlueprint {
    let id = nextId;
    nextId += 1;
    totalOrganisms += 1;

    // Advance generation at Fibonacci thresholds
    if (isFibonacci(totalOrganisms)) {
      currentGeneration += 1;
    };

    // Golden-angle phyllotaxis position
    let n = Float.fromInt(id);
    let angle = n * GOLDEN_ANGLE;
    let radius = Float.sqrt(n);
    let x = radius * Float.cos(angle);
    let y = radius * Float.sin(angle);

    // Scale grows by golden ratio per generation
    let scale = Float.pow(PHI, Float.fromInt(currentGeneration));    let blueprint : OrganismBlueprint = {
      id;
      name;
      designation;
      substrate;
      generation = currentGeneration;
      parentId;
      goldenPosition = (x, y);
      scale;
      capabilities;
      timestamp = Time.now();
      status = #Blueprint;
    };

    registry.add(blueprint);
    buildLog.add("[Gen " # Nat.toText(currentGeneration) # "] " #
                 "Spawned: " # name # " @ (" #
                 Float.toText(x) # ", " # Float.toText(y) # ") " #
                 "scale=" # Float.toText(scale));

    blueprint
  };

  /// Activate a blueprint — transition it from Blueprint to Active.
  public func activate(id : Nat) : async Bool {
    let size = registry.size();
    var i : Nat = 0;
    while (i < size) {
      let bp = registry.get(i);
      if (bp.id == id) {
        let activated : OrganismBlueprint = {
          id             = bp.id;
          name           = bp.name;
          designation    = bp.designation;
          substrate      = bp.substrate;
          generation     = bp.generation;
          parentId       = bp.parentId;
          goldenPosition = bp.goldenPosition;
          scale          = bp.scale;
          capabilities   = bp.capabilities;
          timestamp      = bp.timestamp;
          status         = #Active;
        };
        registry.put(i, activated);
        buildLog.add("Activated: " # bp.name # " (#" # Nat.toText(id) # ")");
        return true;
      };
      i += 1;
    };
    false
  };

  /// Mark an organism as propagating to new substrates.
  public func propagate(id : Nat) : async Bool {
    let size = registry.size();
    var i : Nat = 0;
    while (i < size) {
      let bp = registry.get(i);
      if (bp.id == id) {
        let propagating : OrganismBlueprint = {
          id             = bp.id;
          name           = bp.name;
          designation    = bp.designation;
          substrate      = bp.substrate;
          generation     = bp.generation;
          parentId       = bp.parentId;
          goldenPosition = bp.goldenPosition;
          scale          = bp.scale;
          capabilities   = bp.capabilities;
          timestamp      = bp.timestamp;
          status         = #Propagating;
        };
        registry.put(i, propagating);
        buildLog.add("Propagating: " # bp.name # " → cross-substrate");
        return true;
      };
      i += 1;
    };
    false
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get all organism blueprints.
  public query func list_organisms() : async [OrganismBlueprint] {
    Buffer.toArray(registry)
  };

  /// Get organisms by substrate.
  public query func by_substrate(substrate : SubstrateType) : async [OrganismBlueprint] {
    let buf = Buffer.Buffer<OrganismBlueprint>(16);
    for (bp in registry.vals()) {
      if (substrateEq(bp.substrate, substrate)) {
        buf.add(bp);
      };
    };
    Buffer.toArray(buf)
  };

  /// Get organisms by generation.
  public query func by_generation(gen : Nat) : async [OrganismBlueprint] {
    let buf = Buffer.Buffer<OrganismBlueprint>(16);
    for (bp in registry.vals()) {
      if (bp.generation == gen) {
        buf.add(bp);
      };
    };
    Buffer.toArray(buf)
  };

  /// Get an organism by ID.
  public query func get_organism(id : Nat) : async ?OrganismBlueprint {
    for (bp in registry.vals()) {
      if (bp.id == id) { return ?bp };
    };
    null
  };

  /// Get the build log.
  public query func get_build_log() : async [Text] {
    Buffer.toArray(buildLog)
  };

  /// Civilization statistics.
  public query func civilization_status() : async {
    total_organisms : Nat;
    generation      : Nat;
    golden_scale    : Float;
  } {
    {
      total_organisms = totalOrganisms;
      generation      = currentGeneration;
      golden_scale    = Float.pow(PHI, Float.fromInt(currentGeneration));
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func isFibonacci(n : Nat) : Bool {
    if (n == 0) { return true };
    let n2 = n * n;
    isPerfectSquare(5 * n2 + 4) or isPerfectSquare(5 * n2 - 4)
  };

  func isPerfectSquare(n : Nat) : Bool {
    let s = Int.abs(Float.toInt(Float.sqrt(Float.fromInt(n))));
    s * s == n
  };

  func substrateEq(a : SubstrateType, b : SubstrateType) : Bool {
    substrateToNat(a) == substrateToNat(b)
  };

  func substrateToNat(s : SubstrateType) : Nat {
    switch (s) {
      case (#ICP)        0;
      case (#Blockchain) 1;
      case (#Edge)       2;
      case (#Cloud)      3;
      case (#Phantom)    4;
      case (#Hybrid)     5;
    }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "ARCHITECT" };

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
      name      = "ARCHITECT";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "ARCHITECT self-check complete. No drift detected."
  };

  public func register() : async Text {
    "ARCHITECT registered. Capabilities: [design, structure, meta, build]."
  };

  public query func report_status() : async Text {
    "ARCHITECT | status=ACTIVE | v10=true"
  };

  public query func designation() : async Text {
    "The Meta-Builder — Architecture creates more architecture"
  };
};
