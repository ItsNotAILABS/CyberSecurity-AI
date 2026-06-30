///
/// PLATINUM (PT-78) — Platinum Canister — Catalyst Substrate
///
/// Platinum is the ultimate catalyst — it accelerates reactions
/// without being consumed. This canister IS platinum — it catalyzes
/// protocol execution, accelerates computation, and remains unchanged.
///
/// Element Properties:
///   Atomic Number: 78
///   Atomic Weight: 195.084
///   Density: 21.45 g/cm³
///   Electron Config: [Xe] 4f14 5d9 6s1
///   Orbitals: 6
///   Conductivity: 0.157 (normalized)
///   Melting Point: 2041.4 K
///
/// Canister Type: CATALYST
/// φ-Weight: 195.084 × φ^6 = 2769.51
/// Fibonacci Identity: fib(78 mod 20) = 4181
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × density × conductivity
///   E(x) = 78 × φ^6 × 21.45 × 0.157 = 469,821.47
///
/// Purpose: Accelerate protocol execution without being consumed.
///          The reaction accelerator of the civilization.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Platinum {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 78;
  transient let ATOMIC_WEIGHT : Float = 195.084;
  transient let DENSITY : Float = 21.45;
  transient let ORBITALS : Nat = 6;
  transient let CONDUCTIVITY : Float = 0.157;
  transient let MELTING_POINT : Float = 2041.4;

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 2769.51;
  transient let FIB_IDENTITY : Nat = 4181;
  transient let ENERGY_CONSTANT : Float = 469821.47;

  // ── Types ──────────────────────────────────────────────────────────

  public type CatalyzedReaction = {
    reactionId      : Nat;
    protocolId      : Text;
    input           : Text;
    accelerationFactor: Float;  // How much faster than normal
    energySaved     : Float;    // Energy not consumed
    startTime       : Int;
    completionTime  : ?Int;
    status          : ReactionStatus;
  };

  public type ReactionStatus = {
    #Queued;
    #Catalyzing;
    #Complete;
    #Failed;
  };

  public type CatalystMetrics = {
    total_reactions      : Nat;
    avg_acceleration     : Float;
    total_energy_saved   : Float;
    catalyst_efficiency  : Float;  // 0.0 to 1.0
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextReactionId : Nat = 0;
  stable var totalReactions : Nat = 0;
  stable var totalEnergySaved : Float = 0.0;

  transient let reactionQueue  = Buffer.Buffer<CatalyzedReaction>(256);
  transient let completedReactions = Buffer.Buffer<CatalyzedReaction>(512);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Catalyze a protocol execution
  public func catalyze(
    protocolId : Text,
    input      : Text
  ) : async CatalyzedReaction {
    let reactionId = nextReactionId;
    nextReactionId += 1;
    totalReactions += 1;

    // Acceleration factor based on φ
    let inputComplexity = Float.fromInt(input.size());
    let accelerationFactor = Float.pow(PHI, 2.0) + (inputComplexity * 0.01);

    // Energy saved = normal_energy × (1 - 1/acceleration)
    let normalEnergy = computeNormalEnergy(input);
    let energySaved = normalEnergy * (1.0 - (1.0 / accelerationFactor));

    let reaction : CatalyzedReaction = {
      reactionId;
      protocolId;
      input;
      accelerationFactor;
      energySaved;
      startTime = Time.now();
      completionTime = null;
      status = #Catalyzing;
    };

    reactionQueue.add(reaction);
    totalEnergySaved += energySaved;
    reaction
  };

  /// Complete a catalyzed reaction
  public func complete_reaction(reactionId : Nat) : async Bool {
    let size = reactionQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let rxn = reactionQueue.get(i);
      if (rxn.reactionId == reactionId) {
        let completed : CatalyzedReaction = {
          reactionId      = rxn.reactionId;
          protocolId      = rxn.protocolId;
          input           = rxn.input;
          accelerationFactor = rxn.accelerationFactor;
          energySaved     = rxn.energySaved;
          startTime       = rxn.startTime;
          completionTime  = ?Time.now();
          status          = #Complete;
        };

        completedReactions.add(completed);
        reactionQueue.put(i, completed);
        return true;
      };
      i += 1;
    };
    false
  };

  /// Calculate catalyst energy (platinum remains unchanged)
  public func compute_energy(input : Text) : async Float {
    let inputFactor = Float.fromInt(input.size());
    // E(x) = Z × φ^orbitals × density × conductivity × inputFactor
    // But catalyst doesn't consume energy, so return potential energy
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 DENSITY * CONDUCTIVITY * inputFactor;
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get reaction by ID
  public query func get_reaction(id : Nat) : async ?CatalyzedReaction {
    let qSize = reactionQueue.size();
    var i : Nat = 0;
    while (i < qSize) {
      let rxn = reactionQueue.get(i);
      if (rxn.reactionId == id) { return ?rxn };
      i += 1;
    };

    let cSize = completedReactions.size();
    i := 0;
    while (i < cSize) {
      let rxn = completedReactions.get(i);
      if (rxn.reactionId == id) { return ?rxn };
      i += 1;
    };

    null
  };

  /// Get active reactions
  public query func active_reactions() : async [CatalyzedReaction] {
    let buf = Buffer.Buffer<CatalyzedReaction>(reactionQueue.size());
    let size = reactionQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let rxn = reactionQueue.get(i);
      switch (rxn.status) {
        case (#Catalyzing) { buf.add(rxn) };
        case (#Queued) { buf.add(rxn) };
        case _ {};
      };
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Get catalyst metrics
  public query func catalyst_metrics() : async CatalystMetrics {
    var totalAcceleration : Float = 0.0;
    let size = completedReactions.size();
    var i : Nat = 0;
    while (i < size) {
      totalAcceleration += completedReactions.get(i).accelerationFactor;
      i += 1;
    };

    let avgAcceleration = if (size > 0) {
      totalAcceleration / Float.fromInt(size)
    } else { 0.0 };

    // Efficiency = energy_saved / total_potential_energy
    let potentialEnergy = Float.fromInt(totalReactions) * 1000.0;  // Arbitrary baseline
    let efficiency = if (potentialEnergy > 0.0) {
      Float.min(1.0, totalEnergySaved / potentialEnergy)
    } else { 0.0 };

    {
      total_reactions     = totalReactions;
      avg_acceleration    = avgAcceleration;
      total_energy_saved  = totalEnergySaved;
      catalyst_efficiency = efficiency;
    }
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

  // ── Helpers ────────────────────────────────────────────────────────

  func computeNormalEnergy(input : Text) : Float {
    let baseEnergy = Float.fromInt(input.size()) * 10.0;
    baseEnergy
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "PLATINUM" };
  public query func symbol() : async Text { "PT" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "CATALYZING";
      health    = 1.0;  // Catalyst never consumed
      name      = "PLATINUM (PT-78)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Platinum Canister — Catalyst Substrate — Accelerates Without Consumption"
  };
};
