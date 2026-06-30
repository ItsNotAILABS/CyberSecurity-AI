///
/// OXYGEN (O-8) — Oxygen Canister — Life Enabler Substrate
///
/// Nothing lives without oxygen. Nothing breathes without oxygen.
/// This canister IS oxygen — it enables all other organisms to
/// function. The breath of the system. The life enabler.
///
/// Element Properties:
///   Atomic Number: 8
///   Atomic Weight: 15.999
///   Density: 0.001429 g/cm³ (gas)
///   Electron Config: 1s2 2s2 2p4
///   Orbitals: 2
///   Conductivity: 0.0 (insulator)
///   Melting Point: 54.36 K
///
/// Canister Type: LIFE_ENABLER
/// φ-Weight: 15.999 × φ^2 = 41.85
/// Fibonacci Identity: fib(8 mod 20) = 21
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × oxidation_power × life_factor
///   E(x) = 8 × φ^2 × oxidation × 1.0
///
/// Purpose: Enable all other organisms to function. Provide the energy
///          transfer mechanism. The breath that gives life.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Oxygen {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 8;
  transient let ATOMIC_WEIGHT : Float = 15.999;
  transient let DENSITY : Float = 0.001429;
  transient let ORBITALS : Nat = 2;
  transient let CONDUCTIVITY : Float = 0.0;
  transient let MELTING_POINT : Float = 54.36;
  transient let OXIDATION_POWER : Float = 3.44;  // Electronegativity
  transient let LIFE_FACTOR : Float = 1.0;       // Essential for life

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 41.85;
  transient let FIB_IDENTITY : Nat = 21;

  // ── Types ──────────────────────────────────────────────────────────

  public type LifeEnablement = {
    enablementId : Nat;
    organism     : Text;
    energyProvided: Float;  // Energy transferred
    breathCycles : Nat;     // Number of breath cycles
    vitalityScore: Float;   // 0.0 to 1.0
    timestamp    : Int;
    active       : Bool;
  };

  public type BreathCycle = {
    cycleId    : Nat;
    organism   : Text;
    inhaleTime : Int;
    exhaleTime : ?Int;
    oxygenFlow : Float;
    status     : BreathStatus;
  };

  public type BreathStatus = {
    #Inhaling;
    #Exhaling;
    #Complete;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextEnablementId : Nat = 0;
  stable var nextCycleId      : Nat = 0;
  stable var totalEnergy      : Float = 0.0;
  stable var totalBreaths     : Nat = 0;

  transient let enablements   = Buffer.Buffer<LifeEnablement>(256);
  transient let breathCycles  = Buffer.Buffer<BreathCycle>(512);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Enable organism (provide life-giving energy)
  public func enable_organism(
    organism : Text,
    energy   : Float
  ) : async LifeEnablement {
    let enablementId = nextEnablementId;
    nextEnablementId += 1;
    totalEnergy += energy;

    let enablement : LifeEnablement = {
      enablementId;
      organism;
      energyProvided = energy;
      breathCycles = 0;
      vitalityScore = 1.0;
      timestamp = Time.now();
      active = true;
    };

    enablements.add(enablement);
    enablement
  };

  /// Start breath cycle
  public func inhale(organism : Text, oxygenFlow : Float) : async BreathCycle {
    let cycleId = nextCycleId;
    nextCycleId += 1;
    totalBreaths += 1;

    let cycle : BreathCycle = {
      cycleId;
      organism;
      inhaleTime = Time.now();
      exhaleTime = null;
      oxygenFlow;
      status = #Inhaling;
    };

    breathCycles.add(cycle);

    // Update enablement breath count
    updateEnablementBreaths(organism);

    cycle
  };

  /// Complete breath cycle
  public func exhale(cycleId : Nat) : async Bool {
    let size = breathCycles.size();
    var i : Nat = 0;
    while (i < size) {
      let cycle = breathCycles.get(i);
      if (cycle.cycleId == cycleId) {
        let completed : BreathCycle = {
          cycleId    = cycle.cycleId;
          organism   = cycle.organism;
          inhaleTime = cycle.inhaleTime;
          exhaleTime = ?Time.now();
          oxygenFlow = cycle.oxygenFlow;
          status     = #Complete;
        };

        breathCycles.put(i, completed);
        return true;
      };
      i += 1;
    };
    false
  };

  /// Calculate life-enabling energy
  public func compute_energy(organismCount : Nat) : async Float {
    // E(x) = Z × φ^orbitals × oxidation_power × organism_count
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 OXIDATION_POWER * Float.fromInt(organismCount);
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get enablement by ID
  public query func get_enablement(id : Nat) : async ?LifeEnablement {
    let size = enablements.size();
    var i : Nat = 0;
    while (i < size) {
      let enable = enablements.get(i);
      if (enable.enablementId == id) { return ?enable };
      i += 1;
    };
    null
  };

  /// Get active enablements
  public query func active_enablements() : async [LifeEnablement] {
    let buf = Buffer.Buffer<LifeEnablement>(enablements.size());
    let size = enablements.size();
    var i : Nat = 0;
    while (i < size) {
      let enable = enablements.get(i);
      if (enable.active) {
        buf.add(enable);
      };
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Get breath cycle by ID
  public query func get_breath_cycle(id : Nat) : async ?BreathCycle {
    let size = breathCycles.size();
    var i : Nat = 0;
    while (i < size) {
      let cycle = breathCycles.get(i);
      if (cycle.cycleId == id) { return ?cycle };
      i += 1;
    };
    null
  };

  /// Life metrics
  public query func life_metrics() : async {
    total_enabled     : Nat;
    active_enabled    : Nat;
    total_energy      : Float;
    total_breaths     : Nat;
    avg_vitality      : Float;
  } {
    var activeCount : Nat = 0;
    var totalVitality : Float = 0.0;
    let size = enablements.size();
    var i : Nat = 0;
    while (i < size) {
      let enable = enablements.get(i);
      if (enable.active) {
        activeCount += 1;
      };
      totalVitality += enable.vitalityScore;
      i += 1;
    };

    let avgVitality = if (size > 0) {
      totalVitality / Float.fromInt(size)
    } else { 0.0 };

    {
      total_enabled  = size;
      active_enabled = activeCount;
      total_energy   = totalEnergy;
      total_breaths  = totalBreaths;
      avg_vitality   = avgVitality;
    }
  };

  /// Element properties
  public query func element_properties() : async {
    atomicNumber   : Nat;
    atomicWeight   : Float;
    density        : Float;
    orbitals       : Nat;
    conductivity   : Float;
    oxidationPower : Float;
    lifeFactor     : Float;
    phiWeight      : Float;
    fibIdentity    : Nat;
  } {
    {
      atomicNumber   = ATOMIC_NUMBER;
      atomicWeight   = ATOMIC_WEIGHT;
      density        = DENSITY;
      orbitals       = ORBITALS;
      conductivity   = CONDUCTIVITY;
      oxidationPower = OXIDATION_POWER;
      lifeFactor     = LIFE_FACTOR;
      phiWeight      = PHI_WEIGHT;
      fibIdentity    = FIB_IDENTITY;
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func updateEnablementBreaths(organism : Text) {
    let size = enablements.size();
    var i : Nat = 0;
    while (i < size) {
      let enable = enablements.get(i);
      if (enable.organism == organism and enable.active) {
        let updated : LifeEnablement = {
          enablementId   = enable.enablementId;
          organism       = enable.organism;
          energyProvided = enable.energyProvided;
          breathCycles   = enable.breathCycles + 1;
          vitalityScore  = enable.vitalityScore;
          timestamp      = enable.timestamp;
          active         = enable.active;
        };
        enablements.put(i, updated);
        return;
      };
      i += 1;
    };
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "OXYGEN" };
  public query func symbol() : async Text { "O" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "BREATHING";
      health    = LIFE_FACTOR;
      name      = "OXYGEN (O-8)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Oxygen Canister — Life Enabler Substrate — The Breath Of The System"
  };
};
