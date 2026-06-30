///
/// FERRUM (FE-26) — Iron Canister — Structural Stability Substrate
///
/// Iron forms the core of stars and the structural backbone of
/// civilization. This canister IS iron — it provides structural
/// stability, load-bearing capacity, and magnetic coordination.
///
/// Element Properties:
///   Atomic Number: 26
///   Atomic Weight: 55.845
///   Density: 7.874 g/cm³
///   Electron Config: [Ar] 3d6 4s2
///   Orbitals: 4
///   Conductivity: 0.177 (normalized)
///   Melting Point: 1811 K
///
/// Canister Type: STRUCTURAL
/// φ-Weight: 55.845 × φ^4 = 383.26
/// Fibonacci Identity: fib(26 mod 20) = 610
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × density × conductivity
///   E(x) = 26 × φ^4 × 7.874 × 0.177 = 252.79
///
/// Purpose: Maintain structural integrity and load distribution
///          across the organism network. The skeleton.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Ferrum {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 26;
  transient let ATOMIC_WEIGHT : Float = 55.845;
  transient let DENSITY : Float = 7.874;
  transient let ORBITALS : Nat = 4;
  transient let CONDUCTIVITY : Float = 0.177;
  transient let MELTING_POINT : Float = 1811.0;

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 383.26;
  transient let FIB_IDENTITY : Nat = 610;
  transient let ENERGY_CONSTANT : Float = 252.79;

  // ── Types ──────────────────────────────────────────────────────────

  public type StructuralNode = {
    nodeId       : Nat;
    organism     : Text;
    loadCapacity : Float;  // Maximum load this node can bear
    currentLoad  : Float;  // Current load on this node
    connections  : [Nat];  // Connected node IDs
    stability    : Float;  // 0.0 to 1.0
    timestamp    : Int;
  };

  public type LoadDistribution = {
    distId       : Nat;
    sourceNode   : Nat;
    targetNodes  : [Nat];
    loadAmount   : Float;
    phiBalanced  : Bool;  // Is load φ-distributed?
    timestamp    : Int;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextNodeId : Nat = 0;
  stable var nextDistId : Nat = 0;
  stable var totalLoad  : Float = 0.0;

  transient let structuralNodes = Buffer.Buffer<StructuralNode>(128);
  transient let loadHistory     = Buffer.Buffer<LoadDistribution>(256);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Register a structural node
  public func register_node(
    organism     : Text,
    loadCapacity : Float,
    connections  : [Nat]
  ) : async StructuralNode {
    let nodeId = nextNodeId;
    nextNodeId += 1;

    let node : StructuralNode = {
      nodeId;
      organism;
      loadCapacity;
      currentLoad = 0.0;
      connections;
      stability = 1.0;
      timestamp = Time.now();
    };

    structuralNodes.add(node);
    node
  };

  /// Apply load to a node
  public func apply_load(nodeId : Nat, load : Float) : async Bool {
    let size = structuralNodes.size();
    var i : Nat = 0;
    while (i < size) {
      let node = structuralNodes.get(i);
      if (node.nodeId == nodeId) {
        let newLoad = node.currentLoad + load;
        let stability = calculateStability(newLoad, node.loadCapacity);

        let updated : StructuralNode = {
          nodeId       = node.nodeId;
          organism     = node.organism;
          loadCapacity = node.loadCapacity;
          currentLoad  = newLoad;
          connections  = node.connections;
          stability;
          timestamp    = Time.now();
        };

        structuralNodes.put(i, updated);
        totalLoad += load;
        return true;
      };
      i += 1;
    };
    false
  };

  /// Distribute load across connected nodes (φ-weighted)
  public func distribute_load(sourceId : Nat) : async ?LoadDistribution {
    let size = structuralNodes.size();
    var i : Nat = 0;
    var sourceNode : ?StructuralNode = null;

    while (i < size) {
      let node = structuralNodes.get(i);
      if (node.nodeId == sourceId) {
        sourceNode := ?node;
      };
      i += 1;
    };

    switch (sourceNode) {
      case (?node) {
        if (node.connections.size() == 0) { return null };

        // φ-distributed load across connections
        let loadPerConnection = node.currentLoad * PHI_INV / Float.fromInt(node.connections.size());

        let distId = nextDistId;
        nextDistId += 1;

        let dist : LoadDistribution = {
          distId;
          sourceNode = sourceId;
          targetNodes = node.connections;
          loadAmount = loadPerConnection;
          phiBalanced = true;
          timestamp = Time.now();
        };

        loadHistory.add(dist);

        // Apply distributed load to connected nodes
        var j : Nat = 0;
        while (j < node.connections.size()) {
          let targetId = node.connections[j];
          ignore apply_load(targetId, loadPerConnection);
          j += 1;
        };

        ?dist
      };
      case null { null };
    }
  };

  /// Calculate structural energy
  public func compute_energy(input : Text) : async Float {
    let inputFactor = Float.fromInt(input.size());
    // E(x) = Z × φ^orbitals × density × conductivity × inputFactor
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 DENSITY * CONDUCTIVITY * inputFactor;
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get node by ID
  public query func get_node(id : Nat) : async ?StructuralNode {
    let size = structuralNodes.size();
    var i : Nat = 0;
    while (i < size) {
      let node = structuralNodes.get(i);
      if (node.nodeId == id) { return ?node };
      i += 1;
    };
    null
  };

  /// List all nodes
  public query func list_nodes() : async [StructuralNode] {
    Buffer.toArray(structuralNodes)
  };

  /// Get load distribution history
  public query func load_history_recent(limit : Nat) : async [LoadDistribution] {
    let size = loadHistory.size();
    let start = if (size > limit) { size - limit } else { 0 };
    let buf = Buffer.Buffer<LoadDistribution>(limit);
    var i = start;
    while (i < size) {
      buf.add(loadHistory.get(i));
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Element properties
  public query func element_properties() : async {
    atomicNumber : Nat;
    atomicWeight : Float;
    density      : Float;
    orbitals     : Nat;
    conductivity : Float;
    phiWeight    : Float;
    fibIdentity  : Nat;
    energy       : Float;
  } {
    {
      atomicNumber = ATOMIC_NUMBER;
      atomicWeight = ATOMIC_WEIGHT;
      density      = DENSITY;
      orbitals     = ORBITALS;
      conductivity = CONDUCTIVITY;
      phiWeight    = PHI_WEIGHT;
      fibIdentity  = FIB_IDENTITY;
      energy       = ENERGY_CONSTANT;
    }
  };

  /// Structural metrics
  public query func structural_metrics() : async {
    total_nodes  : Nat;
    total_load   : Float;
    avg_stability: Float;
  } {
    var totalStability : Float = 0.0;
    let size = structuralNodes.size();
    var i : Nat = 0;
    while (i < size) {
      totalStability += structuralNodes.get(i).stability;
      i += 1;
    };

    let avgStability = if (size > 0) {
      totalStability / Float.fromInt(size)
    } else { 0.0 };

    {
      total_nodes   = size;
      total_load    = totalLoad;
      avg_stability = avgStability;
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────

  let PHI_INV : Float = 0.6180339887498948482;

  func calculateStability(currentLoad : Float, capacity : Float) : Float {
    if (capacity == 0.0) { return 0.0 };
    let ratio = currentLoad / capacity;
    if (ratio > 1.0) { 0.0 } else { 1.0 - ratio }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "FERRUM" };
  public query func symbol() : async Text { "FE" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    let size = structuralNodes.size();
    var totalStability : Float = 0.0;
    var i : Nat = 0;
    while (i < size) {
      totalStability += structuralNodes.get(i).stability;
      i += 1;
    };

    let avgStability = if (size > 0) {
      totalStability / Float.fromInt(size)
    } else { 1.0 };

    {
      status    = "STRUCTURAL";
      health    = avgStability;
      name      = "FERRUM (FE-26)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Iron Canister — Structural Stability Substrate — The Skeleton"
  };
};
