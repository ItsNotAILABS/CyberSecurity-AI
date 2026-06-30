///
/// ARGENTUM (AG-47) — Silver Canister — Conductor Substrate
///
/// Silver is the best electrical conductor of all elements.
/// This canister IS silver — it conducts messages faster than
/// any other organism in the network. Maximum message throughput.
///
/// Element Properties:
///   Atomic Number: 47
///   Atomic Weight: 107.868
///   Density: 10.49 g/cm³
///   Electron Config: [Kr] 4d10 5s1
///   Orbitals: 5
///   Conductivity: 1.0 (BEST conductor)
///   Melting Point: 1234.93 K
///
/// Canister Type: CONDUCTOR
/// φ-Weight: 107.868 × φ^5 = 1216.42
/// Fibonacci Identity: fib(47 mod 20) = 4181
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × density × conductivity
///   E(x) = 47 × φ^5 × 10.49 × 1.0 = 55,682.91
///
/// Purpose: Route messages between organisms at maximum speed.
///          The nervous system of the civilization.
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

persistent actor Argentum {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 47;
  transient let ATOMIC_WEIGHT : Float = 107.868;
  transient let DENSITY : Float = 10.49;
  transient let ORBITALS : Nat = 5;
  transient let CONDUCTIVITY : Float = 1.0;  // BEST
  transient let MELTING_POINT : Float = 1234.93;

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 1216.42;
  transient let FIB_IDENTITY : Nat = 4181;
  transient let ENERGY_CONSTANT : Float = 55682.91;

  // ── Types ──────────────────────────────────────────────────────────

  public type Message = {
    msgId       : Nat;
    fromOrganism: Text;
    toOrganism  : Text;
    payload     : Text;
    priority    : MessagePriority;
    timestamp   : Int;
    deliveredAt : ?Int;
    latencyMs   : ?Nat;
  };

  public type MessagePriority = {
    #Critical;   // φ^4 weight
    #High;       // φ^3 weight
    #Normal;     // φ^2 weight
    #Low;        // φ^1 weight
    #Background; // φ^0 weight
  };

  public type ConductivityMetrics = {
    total_messages   : Nat;
    avg_latency_ms   : Float;
    messages_per_sec : Float;
    conductivity_score: Float;  // Based on element properties
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextMsgId : Nat = 0;
  stable var totalMessages : Nat = 0;
  stable var totalLatencyMs : Nat = 0;

  transient let messageQueue  = Buffer.Buffer<Message>(256);
  transient let messageHistory= Buffer.Buffer<Message>(1024);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Send a message (conductor operation)
  public func send_message(
    fromOrganism : Text,
    toOrganism   : Text,
    payload      : Text,
    priority     : MessagePriority
  ) : async Message {
    let msgId = nextMsgId;
    nextMsgId += 1;
    totalMessages += 1;

    let message : Message = {
      msgId;
      fromOrganism;
      toOrganism;
      payload;
      priority;
      timestamp = Time.now();
      deliveredAt = null;
      latencyMs = null;
    };

    messageQueue.add(message);
    message
  };

  /// Deliver a message (mark as delivered)
  public func deliver_message(msgId : Nat) : async Bool {
    let size = messageQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let msg = messageQueue.get(i);
      if (msg.msgId == msgId) {
        let deliveryTime = Time.now();
        let latency = Int.abs(deliveryTime - msg.timestamp) / 1_000_000; // ns to ms

        let delivered : Message = {
          msgId       = msg.msgId;
          fromOrganism= msg.fromOrganism;
          toOrganism  = msg.toOrganism;
          payload     = msg.payload;
          priority    = msg.priority;
          timestamp   = msg.timestamp;
          deliveredAt = ?deliveryTime;
          latencyMs   = ?latency;
        };

        messageHistory.add(delivered);
        messageQueue.put(i, delivered);
        totalLatencyMs += latency;
        return true;
      };
      i += 1;
    };
    false
  };

  /// Route message to organism via Fibonacci hash
  public func route_message(payload : Text, organisms : [Text]) : async Text {
    if (organisms.size() == 0) { return "unknown" };

    let hash = fibonacciHash(payload);
    let index = hash % organisms.size();
    organisms[index]
  };

  /// Calculate conductivity energy for input
  public func compute_energy(input : Text) : async Float {
    let inputFactor = Float.fromInt(input.size());
    // E(x) = Z × φ^orbitals × density × conductivity × inputFactor
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 DENSITY * CONDUCTIVITY * inputFactor;
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get message by ID
  public query func get_message(id : Nat) : async ?Message {
    let queueSize = messageQueue.size();
    var i : Nat = 0;
    while (i < queueSize) {
      let msg = messageQueue.get(i);
      if (msg.msgId == id) { return ?msg };
      i += 1;
    };
    let histSize = messageHistory.size();
    i := 0;
    while (i < histSize) {
      let msg = messageHistory.get(i);
      if (msg.msgId == id) { return ?msg };
      i += 1;
    };
    null
  };

  /// Get pending messages
  public query func pending_messages() : async [Message] {
    let buf = Buffer.Buffer<Message>(messageQueue.size());
    let size = messageQueue.size();
    var i : Nat = 0;
    while (i < size) {
      let msg = messageQueue.get(i);
      switch (msg.deliveredAt) {
        case null { buf.add(msg) };
        case _ {};
      };
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Get conductivity metrics
  public query func metrics() : async ConductivityMetrics {
    let avgLatency = if (totalMessages > 0) {
      Float.fromInt(totalLatencyMs) / Float.fromInt(totalMessages)
    } else { 0.0 };

    let conductivityScore = CONDUCTIVITY * DENSITY * Float.fromInt(ATOMIC_NUMBER);

    {
      total_messages    = totalMessages;
      avg_latency_ms    = avgLatency;
      messages_per_sec  = conductivityScore;  // Theoretical max based on element
      conductivity_score= conductivityScore;
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

  func fibonacciHash(text : Text) : Nat {
    var h : Nat = 0;
    let chars = Text.toArray(text);
    var i : Nat = 0;
    while (i < chars.size()) {
      let code = Nat32.toNat(Char.toNat32(chars[i]));
      h := ((h * 31) + code) % 131072;
      i += 1;
    };
    h
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "ARGENTUM" };
  public query func symbol() : async Text { "AG" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "CONDUCTING";
      health    = CONDUCTIVITY;
      name      = "ARGENTUM (AG-47)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Silver Canister — Conductor Substrate — Best Electrical Conductor"
  };
};
