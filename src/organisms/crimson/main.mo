///
/// CRIMSON (CR*-161) — Living Organism Substrate
///
/// Crimson is not a real element. Crimson is an ABSTRACT element
/// representing blood-red wavelength (650-680nm) — the color of
/// living organisms. This canister IS life — it pulses, adapts,
/// grows, and maintains living state.
///
/// Abstract Element Properties:
///   Atomic Number: 161 (abstract)
///   Wavelength: 665 nm (blood-red emission)
///   Pulse Frequency: φ Hz (golden-ratio oscillation)
///   Life Constant: 1.618 (φ itself)
///
/// Canister Type: LIVING
/// φ-Weight: 161 × φ = 260.50
/// Fibonacci Identity: fib(161 mod 20) = 89
///
/// Mathematical Formula:
///   L(x) = λ × φ × pulse_rate × adaptation_factor
///   L(x) = 665 × 1.618 × φ × adaptation
///
/// Purpose: Maintain living organism state — pulse, growth, adaptation.
///          The heartbeat of the civilization.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Crimson {

  // ── Abstract Element Constants ─────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 161;  // Abstract
  transient let WAVELENGTH_NM : Float = 665.0;  // Blood-red
  transient let PULSE_FREQUENCY : Float = 1.6180339887498948482; // φ Hz

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 260.50;  // 161 × φ
  transient let FIB_IDENTITY : Nat = 89;      // fib(161 mod 20)
  transient let LIFE_CONSTANT : Float = 1.618; // φ

  // ── Types ──────────────────────────────────────────────────────────

  public type LivingState = {
    stateId       : Nat;
    organismName  : Text;
    pulseRate     : Float;  // Current heartbeat rate
    growthFactor  : Float;  // φ-based growth multiplier
    adaptationScore: Float; // How well organism is adapting
    health        : Float;  // 0.0 to 1.0
    generation    : Nat;
    timestamp     : Int;
    lastPulse     : Int;
  };

  public type LifeCycle = {
    #Nascent;     // Just born
    #Growing;     // Actively growing
    #Mature;      // Fully developed
    #Adapting;    // Responding to environment
    #Dormant;     // Resting phase
  };

  public type PulseEvent = {
    pulseId    : Nat;
    organism   : Text;
    intensity  : Float;  // Pulse strength
    wavelength : Float;  // nm
    timestamp  : Int;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextStateId : Nat = 0;
  stable var nextPulseId : Nat = 0;
  stable var totalPulses : Nat = 0;
  stable var globalPulseRate : Float = PHI; // Start at golden ratio

  transient let livingOrganisms = Buffer.Buffer<LivingState>(64);
  transient let pulseHistory    = Buffer.Buffer<PulseEvent>(256);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Register a living organism
  public func register_organism(
    name       : Text,
    generation : Nat
  ) : async LivingState {
    let stateId = nextStateId;
    nextStateId += 1;

    let state : LivingState = {
      stateId;
      organismName = name;
      pulseRate    = PULSE_FREQUENCY;
      growthFactor = Float.pow(PHI, Float.fromInt(generation));
      adaptationScore = 1.0;
      health       = 1.0;
      generation;
      timestamp    = Time.now();
      lastPulse    = Time.now();
    };

    livingOrganisms.add(state);
    state
  };

  /// Send a pulse (living heartbeat)
  public func pulse(organism : Text, intensity : Float) : async PulseEvent {
    let pulseId = nextPulseId;
    nextPulseId += 1;
    totalPulses += 1;

    let event : PulseEvent = {
      pulseId;
      organism;
      intensity;
      wavelength = WAVELENGTH_NM;  // Blood-red
      timestamp  = Time.now();
    };

    pulseHistory.add(event);

    // Update organism's last pulse
    updateOrganismPulse(organism);

    event
  };

  /// Adapt organism (φ-weighted adaptation)
  public func adapt_organism(
    name             : Text,
    environmentFactor: Float  // How challenging the environment is
  ) : async Bool {
    let size = livingOrganisms.size();
    var i : Nat = 0;
    while (i < size) {
      let state = livingOrganisms.get(i);
      if (state.organismName == name) {
        // Adaptation score increases with φ-weighted learning
        let adaptationDelta = PHI * (1.0 - environmentFactor) * 0.1;
        let newAdaptation = Float.min(1.0, state.adaptationScore + adaptationDelta);

        let adapted : LivingState = {
          stateId      = state.stateId;
          organismName = state.organismName;
          pulseRate    = state.pulseRate * (1.0 + adaptationDelta);  // Pulse quickens
          growthFactor = state.growthFactor;
          adaptationScore = newAdaptation;
          health       = state.health;
          generation   = state.generation;
          timestamp    = state.timestamp;
          lastPulse    = Time.now();
        };

        livingOrganisms.put(i, adapted);
        return true;
      };
      i += 1;
    };
    false
  };

  /// Calculate life energy
  public func compute_life_energy(organism : Text) : async Float {
    for (state in livingOrganisms.vals()) {
      if (state.organismName == organism) {
        // L(x) = λ × φ × pulse_rate × adaptation × health
        let energy = WAVELENGTH_NM * PHI * state.pulseRate *
                     state.adaptationScore * state.health;
        return energy;
      };
    };
    0.0
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get living state by organism name
  public query func get_state(name : Text) : async ?LivingState {
    for (state in livingOrganisms.vals()) {
      if (state.organismName == name) { return ?state };
    };
    null
  };

  /// List all living organisms
  public query func list_organisms() : async [LivingState] {
    Buffer.toArray(livingOrganisms)
  };

  /// Get recent pulses
  public query func recent_pulses(limit : Nat) : async [PulseEvent] {
    let size = pulseHistory.size();
    let start = if (size > limit) { size - limit } else { 0 };
    let buf = Buffer.Buffer<PulseEvent>(limit);
    var i = start;
    while (i < size) {
      buf.add(pulseHistory.get(i));
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Life metrics
  public query func life_metrics() : async {
    total_organisms : Nat;
    total_pulses    : Nat;
    global_pulse_rate: Float;
    crimson_wavelength: Float;
  } {
    {
      total_organisms   = livingOrganisms.size();
      total_pulses      = totalPulses;
      global_pulse_rate = globalPulseRate;
      crimson_wavelength= WAVELENGTH_NM;
    }
  };

  /// Element properties
  public query func element_properties() : async {
    atomicNumber      : Nat;
    wavelengthNm      : Float;
    pulseFrequency    : Float;
    phiWeight         : Float;
    fibIdentity       : Nat;
    lifeConstant      : Float;
  } {
    {
      atomicNumber   = ATOMIC_NUMBER;
      wavelengthNm   = WAVELENGTH_NM;
      pulseFrequency = PULSE_FREQUENCY;
      phiWeight      = PHI_WEIGHT;
      fibIdentity    = FIB_IDENTITY;
      lifeConstant   = LIFE_CONSTANT;
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func updateOrganismPulse(name : Text) {
    let size = livingOrganisms.size();
    var i : Nat = 0;
    while (i < size) {
      let state = livingOrganisms.get(i);
      if (state.organismName == name) {
        let updated : LivingState = {
          stateId      = state.stateId;
          organismName = state.organismName;
          pulseRate    = state.pulseRate;
          growthFactor = state.growthFactor;
          adaptationScore = state.adaptationScore;
          health       = state.health;
          generation   = state.generation;
          timestamp    = state.timestamp;
          lastPulse    = Time.now();
        };
        livingOrganisms.put(i, updated);
        return;
      };
      i += 1;
    };
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "CRIMSON" };
  public query func symbol() : async Text { "CR*" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "LIVING";
      health    = 1.0;
      name      = "CRIMSON (CR*-161)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Crimson Canister — Living Organism Substrate — Blood-Red Wavelength"
  };
};
