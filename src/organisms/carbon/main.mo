///
/// CARBON (C-6) — Carbon Canister — Diamond Structure Substrate
///
/// Carbon forms diamonds — the hardest known natural material.
/// Carbon forms graphene — the strongest material ever tested.
/// This canister IS carbon — it provides unbreakable architectural
/// patterns and nano-scale structural intelligence.
///
/// Element Properties:
///   Atomic Number: 6
///   Atomic Weight: 12.011
///   Density: 2.267 g/cm³ (graphite), 3.515 g/cm³ (diamond)
///   Electron Config: 1s2 2s2 2p2
///   Orbitals: 2
///   Conductivity: 0.0007 (normalized)
///   Melting Point: 3823 K (highest of all elements)
///
/// Canister Type: STRUCTURAL_PATTERN
/// φ-Weight: 12.011 × φ^2 = 31.42
/// Fibonacci Identity: fib(6 mod 20) = 8
///
/// Mathematical Formula:
///   E(x) = Z × φ^orbitals × density × hardness_factor
///   E(x) = 6 × φ^2 × 2.267 × 10.0 = 355.68
///
/// Purpose: Unbreakable architectural patterns. Diamond-hard structure.
///          The strongest patterns in the civilization.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";

persistent actor Carbon {

  // ── Element Constants ──────────────────────────────────────────────

  transient let ATOMIC_NUMBER : Nat = 6;
  transient let ATOMIC_WEIGHT : Float = 12.011;
  transient let DENSITY : Float = 2.267;  // Graphite
  transient let DIAMOND_DENSITY : Float = 3.515;
  transient let ORBITALS : Nat = 2;
  transient let CONDUCTIVITY : Float = 0.0007;
  transient let MELTING_POINT : Float = 3823.0;  // Highest!
  transient let HARDNESS_FACTOR : Float = 10.0;  // Mohs hardness of diamond

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_WEIGHT : Float = 31.42;
  transient let FIB_IDENTITY : Nat = 8;

  // ── Types ──────────────────────────────────────────────────────────

  public type ArchitecturalPattern = {
    patternId   : Nat;
    name        : Text;
    structure   : PatternStructure;
    hardness    : Float;      // 0.0 to 10.0 (diamond hardness)
    bonds       : Nat;        // Number of structural bonds
    resilience  : Float;      // How resistant to change
    timestamp   : Int;
    sealed      : Bool;       // Diamond-sealed = unbreakable
  };

  public type PatternStructure = {
    #Diamond;    // Tetrahedral, hardest
    #Graphene;   // Hexagonal, strongest
    #Fullerene;  // Spherical, nano-scale
    #Nanotube;   // Cylindrical, conductive
    #Graphite;   // Layered, flexible
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextPatternId : Nat = 0;
  stable var totalPatterns : Nat = 0;
  stable var sealedPatterns : Nat = 0;

  transient let patternRegistry = Buffer.Buffer<ArchitecturalPattern>(128);

  // ── Core Functions ─────────────────────────────────────────────────

  /// Create architectural pattern
  public func create_pattern(
    name      : Text,
    structure : PatternStructure,
    bonds     : Nat
  ) : async ArchitecturalPattern {
    let patternId = nextPatternId;
    nextPatternId += 1;
    totalPatterns += 1;

    // Hardness based on structure
    let hardness = structureHardness(structure);
    let resilience = calculateResilience(bonds, hardness);

    let pattern : ArchitecturalPattern = {
      patternId;
      name;
      structure;
      hardness;
      bonds;
      resilience;
      timestamp = Time.now();
      sealed = false;
    };

    patternRegistry.add(pattern);
    pattern
  };

  /// Seal pattern (make it diamond-hard, unbreakable)
  public func seal_pattern(patternId : Nat) : async Bool {
    let size = patternRegistry.size();
    var i : Nat = 0;
    while (i < size) {
      let pat = patternRegistry.get(i);
      if (pat.patternId == patternId and not pat.sealed) {
        let sealed : ArchitecturalPattern = {
          patternId   = pat.patternId;
          name        = pat.name;
          structure   = pat.structure;
          hardness    = 10.0;  // Maximum diamond hardness
          bonds       = pat.bonds;
          resilience  = 1.0;   // Maximum resilience
          timestamp   = pat.timestamp;
          sealed      = true;
        };

        patternRegistry.put(i, sealed);
        sealedPatterns += 1;
        return true;
      };
      i += 1;
    };
    false
  };

  /// Calculate structural energy
  public func compute_energy(input : Text) : async Float {
    let inputFactor = Float.fromInt(input.size());
    // E(x) = Z × φ^orbitals × density × hardness × inputFactor
    let energy = Float.fromInt(ATOMIC_NUMBER) * Float.pow(PHI, Float.fromInt(ORBITALS)) *
                 DENSITY * HARDNESS_FACTOR * inputFactor;
    energy
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// Get pattern by ID
  public query func get_pattern(id : Nat) : async ?ArchitecturalPattern {
    let size = patternRegistry.size();
    var i : Nat = 0;
    while (i < size) {
      let pat = patternRegistry.get(i);
      if (pat.patternId == id) { return ?pat };
      i += 1;
    };
    null
  };

  /// List all patterns
  public query func list_patterns() : async [ArchitecturalPattern] {
    Buffer.toArray(patternRegistry)
  };

  /// Get sealed (diamond) patterns only
  public query func diamond_patterns() : async [ArchitecturalPattern] {
    let buf = Buffer.Buffer<ArchitecturalPattern>(sealedPatterns);
    let size = patternRegistry.size();
    var i : Nat = 0;
    while (i < size) {
      let pat = patternRegistry.get(i);
      if (pat.sealed) {
        buf.add(pat);
      };
      i += 1;
    };
    Buffer.toArray(buf)
  };

  /// Pattern metrics
  public query func pattern_metrics() : async {
    total_patterns  : Nat;
    sealed_patterns : Nat;
    avg_hardness    : Float;
    avg_resilience  : Float;
  } {
    var totalHardness : Float = 0.0;
    var totalResilience : Float = 0.0;
    let size = patternRegistry.size();
    var i : Nat = 0;
    while (i < size) {
      let pat = patternRegistry.get(i);
      totalHardness += pat.hardness;
      totalResilience += pat.resilience;
      i += 1;
    };

    let avgHardness = if (size > 0) {
      totalHardness / Float.fromInt(size)
    } else { 0.0 };

    let avgResilience = if (size > 0) {
      totalResilience / Float.fromInt(size)
    } else { 0.0 };

    {
      total_patterns  = totalPatterns;
      sealed_patterns = sealedPatterns;
      avg_hardness    = avgHardness;
      avg_resilience  = avgResilience;
    }
  };

  /// Element properties
  public query func element_properties() : async {
    atomicNumber    : Nat;
    atomicWeight    : Float;
    density         : Float;
    diamondDensity  : Float;
    orbitals        : Nat;
    conductivity    : Float;
    meltingPoint    : Float;
    hardnessFactor  : Float;
    phiWeight       : Float;
    fibIdentity     : Nat;
  } {
    {
      atomicNumber   = ATOMIC_NUMBER;
      atomicWeight   = ATOMIC_WEIGHT;
      density        = DENSITY;
      diamondDensity = DIAMOND_DENSITY;
      orbitals       = ORBITALS;
      conductivity   = CONDUCTIVITY;
      meltingPoint   = MELTING_POINT;
      hardnessFactor = HARDNESS_FACTOR;
      phiWeight      = PHI_WEIGHT;
      fibIdentity    = FIB_IDENTITY;
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func structureHardness(structure : PatternStructure) : Float {
    switch (structure) {
      case (#Diamond)   { 10.0 };
      case (#Graphene)  { 9.5 };
      case (#Fullerene) { 7.0 };
      case (#Nanotube)  { 8.0 };
      case (#Graphite)  { 2.0 };
    }
  };

  func calculateResilience(bonds : Nat, hardness : Float) : Float {
    let bondFactor = Float.fromInt(bonds) * 0.1;
    let resilience = (hardness / 10.0) * (1.0 + bondFactor);
    Float.min(1.0, resilience)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "CARBON" };
  public query func symbol() : async Text { "C" };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "DIAMOND";
      health    = 1.0;
      name      = "CARBON (C-6)";
      timestamp = Time.now();
    }
  };

  public query func designation() : async Text {
    "Carbon Canister — Diamond Structure Substrate — Unbreakable Patterns"
  };
};
