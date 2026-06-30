///
/// HYDROGEN (H-1) — Hydrogen Canister — Genesis Element
///
/// Hydrogen is element #1. The first element. The beginning.
/// This canister IS hydrogen — it is the origin point, the genesis,
/// the primordial state from which all other organisms emerge.
///
/// Element Properties:
///   Atomic Number: 1
///   Atomic Weight: 1.008
///   Density: 0.00008988 g/cm³ (gas)
///   Electron Config: 1s1
///   Orbitals: 1
///   Conductivity: 0.0 (insulator)
///   Melting Point: 14.01 K
///
/// Canister Type: GENESIS
/// φ-Weight: 1.008 × φ^1 = 1.631
/// Fibonacci Identity: fib(1 mod 20) = 1
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × fusion_energy
///   E(x) = 1 × φ × fusion
///
/// Purpose: Genesis creation. The origin point. Where everything begins.
///          Fusion energy source. Universe seeding.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Hydrogen {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 1;
  transient let ATOMIC_WEIGHT : Float = 1.008;
  transient let DENSITY : Float = 0.00008988;
  transient let ORBITALS : Nat = 1;
  transient let CONDUCTIVITY : Float = 0.0;
  transient let MELTING_POINT : Float = 14.01;
  transient let FUSION_ENERGY : Float = 141.8;  // MeV per fusion

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 1.631;
  transient let FIB_IDENTITY : Nat = 1;

  // ── Types ──────────────────────────────────────────────────────────

  public type GenesisEvent = {
    eventId      : Nat;
    organismName : Text;
    genesisType  : GenesisType;
    seedData     : Text;
    fusionEnergy : Float;
    generation   : Nat;
    timestamp    : Int;
    primordial   : Bool;  // Is this a primordial genesis?
  };

  public type GenesisType = {
    #Origin;      // First creation
    #Fusion;      // Fusion of two organisms
    #Fission;     // Split into multiple organisms
    #Emergence;   // Emergent creation from complexity
    #Seeding;     // Universe seeding event
  };

  public type FusionReaction = {
    reactionId  : Nat;
    sourceA     : Text;
    sourceB     : Text;
    product     : Text;
    energyReleased: Float;
    timestamp   : Int;
    successful  : Bool;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextEventId    : Nat = 0;
  stable var nextReactionId : Nat = 0;
  stable var totalGenesis   : Nat = 0;
  stable var totalFusions   : Nat = 0;

  transient let genesisLog      = Buffer.Buffer<GenesisEvent>(256);
  transient let fusionReactions = Buffer.Buffer<FusionReaction>(128);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Create genesis event (birth of new organism)
  public func genesis(
    organismName : Text,
    genesisType  : GenesisType,
    seedData     : Text,
    generation   : Nat,
    primordial   : Bool
  ) : async GenesisEvent {
    let eventId = nextEventId;
    nextEventId += 1;
    totalGenesis += 1;

    let fusionEnergy = calculateFusionEnergy(seedData);

    let event : GenesisEvent = {
      eventId;
      organismName;
      genesisType;
      seedData;
      fusionEnergy;
      generation;
      timestamp = Time.now();
      primordial;
    };

    genesisLog.add(event);
    event
  };

  /// Fuse two organisms
  public func fuse(
    sourceA : Text,
    sourceB : Text,
    product : Text
  ) : async FusionReaction {
    let reactionId = nextReactionId;
    nextReactionId += 1;
    totalFusions += 1;

    // E = mc² → simplified as φ-based fusion
    let energyReleased = FUSION_ENERGY * PHI;

    let reaction : FusionReaction = {
      reactionId;
      sourceA;
      sourceB;
      product;
      energyReleased;
      timestamp = Time.now();
      successful = true;
    };

    fusionReactions.add(reaction);
    reaction
  };

  /// Calculate genesis energy
  public func compute_energy(seedComplexity : Nat) : async Float {
    // E(x) = Z × φ^orbitals × fusion_energy × complexity
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 FUSION_ENERGY * Float.fromInt(seedComplexity);
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get genesis event by ID
  public query func get_genesis_event(id : Nat) : async ?GenesisEvent {
    let size = genesisLog.size();
    var i : Nat = 0;
    while (i < size) {
      let event = genesisLog.get(i);
      if (event.eventId == id) { return ?event };
      i += 1;
    };
    null
  };

  /// Get all primordial genesis events
  public query func primordial_events() : async [GenesisEvent] {
    let buf = Buffer.Buffer<GenesisEvent>(genesisLog.size());
    let size = genesisLog.size();
    var i : Nat = 0;
    while (i < size) {
      let event = genesisLog.get(i);
      if (event.primordial) {
        buf.add(event);
      };
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Get fusion reaction by ID
  public query func get_fusion(id : Nat) : async ?FusionReaction {
    let size = fusionReactions.size();
    var i : Nat = 0;
    while (i < size) {
      let fusion = fusionReactions.get(i);
      if (fusion.reactionId == id) { return ?fusion };
      i += 1;
    };
    null
  };

  /// List all fusions
  public query func list_fusions() : async [FusionReaction] {
    Buffer.toArray(fusionReactions)
  };

  /// Genesis metrics
  public query func genesis_metrics() : async {
    total_genesis     : Nat;
    primordial_count  : Nat;
    total_fusions     : Nat;
    total_energy      : Float;
  } {
    var primordialCount : Nat = 0;
    var totalEnergy : Float = 0.0;
    let gSize = genesisLog.size();
    var i : Nat = 0;
    while (i < gSize) {
      let event = genesisLog.get(i);
      if (event.primordial) {
        primordialCount += 1;
      };
      totalEnergy += event.fusionEnergy;
      i += 1;
    };

    let fSize = fusionReactions.size();
    i := 0;
    while (i < fSize) {
      totalEnergy += fusionReactions.get(i).energyReleased;
      i += 1;
    };

    {
      total_genesis    = totalGenesis;
      primordial_count = primordialCount;
      total_fusions    = totalFusions;
      total_energy     = totalEnergy;
    }
  };

  /// Element properties
  public query func element_properties() : async {
    atomicNumber : Nat;
    atomicWeight : Float;
    density      : Float;
    orbitals     : Nat;
    conductivity : Float;
    fusionEnergy : Float;
    phiWeight    : Float;
    fibIdentity  : Nat;
  } {
    {
      atomicNumber = ATOMIC_NUMBER;
      atomicWeight = ATOMIC_WEIGHT;
      density      = DENSITY;
      orbitals     = ORBITALS;
      conductivity = CONDUCTIVITY;
      fusionEnergy = FUSION_ENERGY;
      phiWeight    = PHI_WEIGHT;
      fibIdentity  = FIB_IDENTITY;
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func calculateFusionEnergy(seedData : Text) : Float {
    let complexity = Float.fromInt(seedData.size());
    FUSION_ENERGY * PHI * Float.log(complexity + 1.0)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "HYDROGEN" };
  public query func symbol() : async Text { "H" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "GENESIS";
      health    = 1.0;
      name      = "HYDROGEN (H-1)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Hydrogen Canister — Genesis Element — Where Everything Begins"
  };
};
