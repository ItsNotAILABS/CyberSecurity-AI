///
/// NITROGEN (N-7) — Nitrogen Canister — Atmospheric Intelligence
///
/// Nitrogen is 78% of Earth's atmosphere — the invisible envelope
/// that surrounds everything. This canister IS nitrogen — it provides
/// ambient intelligence, environmental sensing, and passive observation.
///
/// Element Properties:
///   Atomic Number: 7
///   Atomic Weight: 14.007
///   Density: 0.00125 g/cm³ (gas)
///   Electron Config: 1s2 2s2 2p3
///   Orbitals: 2
///   Conductivity: 0.0 (insulator)
///   Melting Point: 63.15 K
///
/// Canister Type: AMBIENT
/// φ-Weight: 14.007 × φ^2 = 36.63
/// Fibonacci Identity: fib(7 mod 20) = 13
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × log(volume) × ambient_factor
///   E(x) = 7 × φ^2 × log(volume) × 0.78
///
/// Purpose: Ambient intelligence. Environmental sensing. The atmosphere
///          that surrounds and enables all other organisms.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Nitrogen {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 7;
  transient let ATOMIC_WEIGHT : Float = 14.007;
  transient let DENSITY : Float = 0.00125;
  transient let ORBITALS : Nat = 2;
  transient let CONDUCTIVITY : Float = 0.0;
  transient let MELTING_POINT : Float = 63.15;
  transient let ATMOSPHERE_RATIO : Float = 0.78;  // 78% of air

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 36.63;
  transient let FIB_IDENTITY : Nat = 13;

  // ── Types ──────────────────────────────────────────────────────────

  public type AmbientObservation = {
    observationId : Nat;
    organism      : Text;
    environmentData: Text;
    pressure      : Float;  // Ambient pressure
    temperature   : Float;  // Kelvin
    timestamp     : Int;
  };

  public type AtmosphericLayer = {
    layerId      : Nat;
    organisms    : [Text];  // Organisms in this layer
    density      : Float;
    volume       : Float;
    permeability : Float;   // How easily signals pass through
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextObservationId : Nat = 0;
  stable var nextLayerId       : Nat = 0;
  stable var totalObservations : Nat = 0;

  transient let observations = Buffer.Buffer<AmbientObservation>(512);
  transient let layers       = Buffer.Buffer<AtmosphericLayer>(32);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Record ambient observation
  public func observe(
    organism        : Text,
    environmentData : Text,
    pressure        : Float,
    temperature     : Float
  ) : async AmbientObservation {
    let observationId = nextObservationId;
    nextObservationId += 1;
    totalObservations += 1;

    let observation : AmbientObservation = {
      observationId;
      organism;
      environmentData;
      pressure;
      temperature;
      timestamp = Time.now();
    };

    observations.add(observation);
    observation
  };

  /// Create atmospheric layer
  public func create_layer(
    organisms    : [Text],
    volume       : Float,
    permeability : Float
  ) : async AtmosphericLayer {
    let layerId = nextLayerId;
    nextLayerId += 1;

    // Density decreases with volume (inverse relationship)
    let density = DENSITY / Float.max(1.0, Float.log(volume + 1.0));

    let layer : AtmosphericLayer = {
      layerId;
      organisms;
      density;
      volume;
      permeability;
    };

    layers.add(layer);
    layer
  };

  /// Calculate atmospheric energy
  public func compute_energy(volume : Float) : async Float {
    // E(x) = Z × φ^orbitals × log(volume) × atmospheric_ratio
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 Float.log(volume + 1.0) * ATMOSPHERE_RATIO;
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get observation by ID
  public query func get_observation(id : Nat) : async ?AmbientObservation {
    let size = observations.size();
    var i : Nat = 0;
    while (i < size) {
      let obs = observations.get(i);
      if (obs.observationId == id) { return ?obs };
      i += 1;
    };
    null
  };

  /// Get recent observations
  public query func recent_observations(limit : Nat) : async [AmbientObservation] {
    let size = observations.size();
    let start = if (size > limit) { size - limit } else { 0 };
    let buf = Buffer.Buffer<AmbientObservation>(limit);
    var i = start;
    while (i < size) {
      buf.add(observations.get(i));
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Get layer by ID
  public query func get_layer(id : Nat) : async ?AtmosphericLayer {
    let size = layers.size();
    var i : Nat = 0;
    while (i < size) {
      let layer = layers.get(i);
      if (layer.layerId == id) { return ?layer };
      i += 1;
    };
    null
  };

  /// List all layers
  public query func list_layers() : async [AtmosphericLayer] {
    Buffer.toArray(layers)
  };

  /// Atmospheric metrics
  public query func atmospheric_metrics() : async {
    total_observations : Nat;
    total_layers       : Nat;
    avg_pressure       : Float;
    avg_temperature    : Float;
  } {
    var totalPressure : Float = 0.0;
    var totalTemp : Float = 0.0;
    let size = observations.size();
    var i : Nat = 0;
    while (i < size) {
      let obs = observations.get(i);
      totalPressure += obs.pressure;
      totalTemp += obs.temperature;
      i += 1;
    };

    let avgPressure = if (size > 0) {
      totalPressure / Float.fromInt(size)
    } else { 0.0 };

    let avgTemp = if (size > 0) {
      totalTemp / Float.fromInt(size)
    } else { 0.0 };

    {
      total_observations = totalObservations;
      total_layers       = layers.size();
      avg_pressure       = avgPressure;
      avg_temperature    = avgTemp;
    }
  };

  /// Element properties
  public query func element_properties() : async {
    atomicNumber     : Nat;
    atomicWeight     : Float;
    density          : Float;
    orbitals         : Nat;
    conductivity     : Float;
    atmosphereRatio  : Float;
    phiWeight        : Float;
    fibIdentity      : Nat;
  } {
    {
      atomicNumber    = ATOMIC_NUMBER;
      atomicWeight    = ATOMIC_WEIGHT;
      density         = DENSITY;
      orbitals        = ORBITALS;
      conductivity    = CONDUCTIVITY;
      atmosphereRatio = ATMOSPHERE_RATIO;
      phiWeight       = PHI_WEIGHT;
      fibIdentity     = FIB_IDENTITY;
    }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "NITROGEN" };
  public query func symbol() : async Text { "N" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "AMBIENT";
      health    = ATMOSPHERE_RATIO;
      name      = "NITROGEN (N-7)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Nitrogen Canister — Atmospheric Intelligence — The Invisible Envelope"
  };
};
