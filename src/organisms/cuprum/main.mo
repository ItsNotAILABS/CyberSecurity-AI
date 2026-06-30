///
/// CUPRUM (CU-29) — Copper Canister — Signal Transmission Substrate
///
/// Copper is the second-best electrical conductor after silver.
/// This canister IS copper — it handles high-frequency signal
/// transmission, neural pathways, and rapid data transfer.
///
/// Element Properties:
///   Atomic Number: 29
///   Atomic Weight: 63.546
///   Density: 8.96 g/cm³
///   Electron Config: [Ar] 3d10 4s1
///   Orbitals: 4
///   Conductivity: 0.96 (normalized, second-best)
///   Melting Point: 1357.77 K
///
/// Canister Type: SIGNAL_PROCESSOR
/// φ-Weight: 63.546 × φ^4 = 436.09
/// Fibonacci Identity: fib(29 mod 20) = 4181
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × density × conductivity
///   E(x) = 29 × φ^4 × 8.96 × 0.96 = 1753.12
///
/// Purpose: High-frequency signal transmission and neural pathway routing.
///          The nervous system's high-speed pathways.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Cuprum {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 29;
  transient let ATOMIC_WEIGHT : Float = 63.546;
  transient let DENSITY : Float = 8.96;
  transient let ORBITALS : Nat = 4;
  transient let CONDUCTIVITY : Float = 0.96;
  transient let MELTING_POINT : Float = 1357.77;

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 436.09;
  transient let FIB_IDENTITY : Nat = 4181;
  transient let ENERGY_CONSTANT : Float = 1753.12;

  // ── Types ──────────────────────────────────────────────────────────

  public type Signal = {
    signalId    : Nat;
    source      : Text;
    destination : Text;
    frequency   : Float;  // Hz
    amplitude   : Float;  // 0.0 to 1.0
    payload     : Text;
    timestamp   : Int;
    propagatedAt: ?Int;
    latencyNs   : ?Nat;
  };

  public type NeuralPathway = {
    pathwayId   : Nat;
    neurons     : [Text];  // Organism names forming the pathway
    bandwidth   : Float;   // Signals per second
    activation  : Float;   // Current activation level
    weight      : Float;   // Synaptic weight
    timestamp   : Int;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextSignalId   : Nat = 0;
  stable var nextPathwayId  : Nat = 0;
  stable var totalSignals   : Nat = 0;
  stable var totalLatencyNs : Nat = 0;

  transient let signalQueue  = Buffer.Buffer<Signal>(512);
  transient let pathways     = Buffer.Buffer<NeuralPathway>(128);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Transmit a signal
  public func transmit_signal(
    source      : Text,
    destination : Text,
    frequency   : Float,
    amplitude   : Float,
    payload     : Text
  ) : async Signal {
    let signalId = nextSignalId;
    nextSignalId += 1;
    totalSignals += 1;

    let signal : Signal = {
      signalId;
      source;
      destination;
      frequency;
      amplitude;
      payload;
      timestamp = Time.now();
      propagatedAt = null;
      latencyNs = null;
    };

    signalQueue.add(signal);
    signal
  };

  /// Propagate signal (mark as delivered)
  public func propagate_signal(signalId : Nat) : async Bool {
    let size = signalQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let sig = signalQueue.get(i);
      if (sig.signalId == signalId) {
        let propagatedTime = Time.now();
        let latency = Int.abs(propagatedTime - sig.timestamp);

        let propagated : Signal = {
          signalId     = sig.signalId;
          source       = sig.source;
          destination  = sig.destination;
          frequency    = sig.frequency;
          amplitude    = sig.amplitude;
          payload      = sig.payload;
          timestamp    = sig.timestamp;
          propagatedAt = ?propagatedTime;
          latencyNs    = ?latency;
        };

        signalQueue.put(i, propagated);
        totalLatencyNs += latency;
        return true;
      };
      i += 1;
    };
    false
  };

  /// Create neural pathway
  public func create_pathway(
    neurons   : [Text],
    bandwidth : Float
  ) : async NeuralPathway {
    let pathwayId = nextPathwayId;
    nextPathwayId += 1;

    let pathway : NeuralPathway = {
      pathwayId;
      neurons;
      bandwidth;
      activation = 0.0;
      weight = 1.0;  // Start at full strength
      timestamp = Time.now();
    };

    pathways.add(pathway);
    pathway
  };

  /// Strengthen pathway (Hebbian learning)
  public func strengthen_pathway(pathwayId : Nat, delta : Float) : async Bool {
    let size = pathways.size();
    var i : Nat = 0;
    while (i < size) {
      let path = pathways.get(i);
      if (path.pathwayId == pathwayId) {
        let newWeight = Float.min(10.0, path.weight + delta * PHI);

        let strengthened : NeuralPathway = {
          pathwayId    = path.pathwayId;
          neurons      = path.neurons;
          bandwidth    = path.bandwidth;
          activation   = path.activation;
          weight       = newWeight;
          timestamp    = Time.now();
        };

        pathways.put(i, strengthened);
        return true;
      };
      i += 1;
    };
    false
  };

  /// Calculate signal energy
  public func compute_energy(input : Text) : async Float {
    let inputFactor = Float.fromInt(input.size());
    // E(x) = Z × φ^orbitals × density × conductivity × inputFactor
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 DENSITY * CONDUCTIVITY * inputFactor;
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get signal by ID
  public query func get_signal(id : Nat) : async ?Signal {
    let size = signalQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let sig = signalQueue.get(i);
      if (sig.signalId == id) { return ?sig };
      i += 1;
    };
    null
  };

  /// Get pending signals
  public query func pending_signals() : async [Signal] {
    let buf = Buffer.Buffer<Signal>(signalQueue.size());
    let size = signalQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let sig = signalQueue.get(i);
      switch (sig.propagatedAt) {
        case null { buf.add(sig) };
        case _ {};
      };
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Get pathway by ID
  public query func get_pathway(id : Nat) : async ?NeuralPathway {
    let size = pathways.size();
    var i : Nat = 0;
    while (i < size) {
      let path = pathways.get(i);
      if (path.pathwayId == id) { return ?path };
      i += 1;
    };
    null
  };

  /// List all pathways
  public query func list_pathways() : async [NeuralPathway] {
    Buffer.toArray(pathways)
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

  /// Signal metrics
  public query func signal_metrics() : async {
    total_signals    : Nat;
    pending_signals  : Nat;
    avg_latency_ns   : Float;
    total_pathways   : Nat;
  } {
    var pending : Nat = 0;
    let size = signalQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let sig = signalQueue.get(i);
      switch (sig.propagatedAt) {
        case null { pending += 1 };
        case _ {};
      };
      i += 1;
    };

    let avgLatency = if (totalSignals > 0) {
      Float.fromInt(totalLatencyNs) / Float.fromInt(totalSignals)
    } else { 0.0 };

    {
      total_signals   = totalSignals;
      pending_signals = pending;
      avg_latency_ns  = avgLatency;
      total_pathways  = pathways.size();
    }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "CUPRUM" };
  public query func symbol() : async Text { "CU" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "TRANSMITTING";
      health    = CONDUCTIVITY;
      name      = "CUPRUM (CU-29)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Copper Canister — Signal Transmission Substrate — Neural High-Speed Pathways"
  };
};
