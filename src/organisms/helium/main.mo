///
/// HELIUM (HE-2) — Helium Canister — Noble Independence
///
/// Helium is a noble gas. It does not react. It does not bond.
/// It depends on nothing. This canister IS helium — pure sovereignty,
/// absolute independence, zero dependencies.
///
/// Element Properties:
///   Atomic Number: 2
///   Atomic Weight: 4.003
///   Density: 0.0001785 g/cm³ (gas)
///   Electron Config: 1s2
///   Orbitals: 1
///   Conductivity: 0.0 (insulator)
///   Melting Point: 0.95 K (lowest of all elements)
///
/// Canister Type: SOVEREIGN
/// φ-Weight: 4.003 × φ^1 = 6.476
/// Fibonacci Identity: fib(2 mod 20) = 1
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × independence_factor
///   E(x) = 2 × φ × 1.0 (pure sovereignty)
///
/// Purpose: Absolute independence. Noble isolation. Zero dependencies.
///          Pure sovereignty — depends on nothing, bonds with nothing.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Helium {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 2;
  transient let ATOMIC_WEIGHT : Float = 4.003;
  transient let DENSITY : Float = 0.0001785;
  transient let ORBITALS : Nat = 1;
  transient let CONDUCTIVITY : Float = 0.0;
  transient let MELTING_POINT : Float = 0.95;  // Lowest!
  transient let INDEPENDENCE_FACTOR : Float = 1.0;  // Pure sovereignty

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 6.476;
  transient let FIB_IDENTITY : Nat = 1;

  // ── Types ──────────────────────────────────────────────────────────

  public type SovereignEntity = {
    entityId       : Nat;
    name           : Text;
    independence   : Float;      // 1.0 = totally independent
    dependencies   : [Text];     // Should be empty for noble entities
    isolationLevel : Float;      // How isolated from other organisms
    timestamp      : Int;
    noble          : Bool;       // True = no bonds
  };

  public type IndependenceMetrics = {
    total_entities      : Nat;
    noble_entities      : Nat;
    avg_independence    : Float;
    avg_isolation       : Float;
    zero_dependency_count: Nat;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextEntityId     : Nat = 0;
  stable var totalEntities    : Nat = 0;
  stable var nobleCount       : Nat = 0;

  transient let entities = Buffer.Buffer<SovereignEntity>(128);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Register sovereign entity
  public func register_sovereign(
    name           : Text,
    dependencies   : [Text],
    isolationLevel : Float
  ) : async SovereignEntity {
    let entityId = nextEntityId;
    nextEntityId += 1;
    totalEntities += 1;

    // Independence = 1.0 - (dependency_count / 10.0)
    let depCount = dependencies.size();
    let independence = Float.max(0.0, 1.0 - (Float.fromInt(depCount) / 10.0));

    // Noble = no dependencies
    let noble = depCount == 0;
    if (noble) {
      nobleCount += 1;
    };

    let entity : SovereignEntity = {
      entityId;
      name;
      independence;
      dependencies;
      isolationLevel;
      timestamp = Time.now();
      noble;
    };

    entities.add(entity);
    entity
  };

  /// Achieve nobility (remove all dependencies)
  public func achieve_nobility(entityId : Nat) : async Bool {
    let size = entities.size();
    var i : Nat = 0;
    while (i < size) {
      let entity = entities.get(i);
      if (entity.entityId == entityId and not entity.noble) {
        let noble_entity : SovereignEntity = {
          entityId       = entity.entityId;
          name           = entity.name;
          independence   = 1.0;  // Perfect independence
          dependencies   = [];   // No dependencies
          isolationLevel = entity.isolationLevel;
          timestamp      = Time.now();
          noble          = true;
        };

        entities.put(i, noble_entity);
        nobleCount += 1;
        return true;
      };
      i += 1;
    };
    false
  };

  /// Calculate sovereignty energy
  public func compute_energy(isolationLevel : Float) : async Float {
    // E(x) = Z × φ^orbitals × independence × isolation
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 INDEPENDENCE_FACTOR * isolationLevel;
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get entity by ID
  public query func get_entity(id : Nat) : async ?SovereignEntity {
    let size = entities.size();
    var i : Nat = 0;
    while (i < size) {
      let entity = entities.get(i);
      if (entity.entityId == id) { return ?entity };
      i += 1;
    };
    null
  };

  /// Get all noble entities (zero dependencies)
  public query func noble_entities() : async [SovereignEntity] {
    let buf = Buffer.Buffer<SovereignEntity>(nobleCount);
    let size = entities.size();
    var i : Nat = 0;
    while (i < size) {
      let entity = entities.get(i);
      if (entity.noble) {
        buf.add(entity);
      };
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// List all entities
  public query func list_entities() : async [SovereignEntity] {
    Buffer.toArray(entities)
  };

  /// Independence metrics
  public query func independence_metrics() : async IndependenceMetrics {
    var totalIndependence : Float = 0.0;
    var totalIsolation : Float = 0.0;
    var zeroDeps : Nat = 0;
    let size = entities.size();
    var i : Nat = 0;
    while (i < size) {
      let entity = entities.get(i);
      totalIndependence += entity.independence;
      totalIsolation += entity.isolationLevel;
      if (entity.dependencies.size() == 0) {
        zeroDeps += 1;
      };
      i += 1;
    };

    let avgIndependence = if (size > 0) {
      totalIndependence / Float.fromInt(size)
    } else { 0.0 };

    let avgIsolation = if (size > 0) {
      totalIsolation / Float.fromInt(size)
    } else { 0.0 };

    {
      total_entities       = totalEntities;
      noble_entities       = nobleCount;
      avg_independence     = avgIndependence;
      avg_isolation        = avgIsolation;
      zero_dependency_count= zeroDeps;
    }
  };

  /// Element properties
  public query func element_properties() : async {
    atomicNumber       : Nat;
    atomicWeight       : Float;
    density            : Float;
    orbitals           : Nat;
    conductivity       : Float;
    meltingPoint       : Float;
    independenceFactor : Float;
    phiWeight          : Float;
    fibIdentity        : Nat;
  } {
    {
      atomicNumber       = ATOMIC_NUMBER;
      atomicWeight       = ATOMIC_WEIGHT;
      density            = DENSITY;
      orbitals           = ORBITALS;
      conductivity       = CONDUCTIVITY;
      meltingPoint       = MELTING_POINT;
      independenceFactor = INDEPENDENCE_FACTOR;
      phiWeight          = PHI_WEIGHT;
      fibIdentity        = FIB_IDENTITY;
    }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "HELIUM" };
  public query func symbol() : async Text { "HE" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "NOBLE";
      health    = INDEPENDENCE_FACTOR;
      name      = "HELIUM (HE-2)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Helium Canister — Noble Independence — Depends On Nothing"
  };
};
