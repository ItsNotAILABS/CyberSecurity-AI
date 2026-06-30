///
/// AETHER — Dimensional Field Harmonics Organism
///
/// "Between dimensions lies the Aether — the substrate of all substrates.
///  It vibrates at the frequency of pure potentiality."
///
/// AETHER manages dimensional field harmonics, tracking the resonance
/// patterns that emerge between different computational substrates.
/// It uses φ-based frequency analysis to detect harmonic alignments
/// and phase coherence across the organism mesh.
///
/// Sub-models hosted:
///   HARMONIA — Multi-dimensional frequency analysis and synthesis
///   RESONEX  — Resonance pattern detection and amplification
///
/// Mathematical Foundation:
///   - Harmonic series: f_n = f_0 × φ^n (golden frequency scaling)
///   - Phase coherence: Ψ = (1/N) × Σ cos(θ_i - θ_mean)
///   - Field strength: E = E_0 × e^(-r/λ) × cos(kr - ωt)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter   "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Aether {

  // ══════════════════════════════════════════════════════════════════
  //  CPL RUNTIME WIRING — The Permanent Foundation
  // ══════════════════════════════════════════════════════════════════
  stable var cplRuntimeCanisterId : ?Principal = null;

  public type PulsePriority = { #Low; #Normal; #High; #Critical };
  public type ProofResult = { #Passed; #Failed; #Blocked; #Partial };
  public type MemoryType = { #Precedent; #Pattern; #Consequence; #Alert; #Constraint; #Exception };

  type CPLRuntime = actor {
    createPulse : (Text, [Text], Text, [Text], [Text], Text, Text, Text,
                   PulsePriority, Nat, Nat, Nat, Bool)
                   -> async Result.Result<Text, Text>;
    enforceBeforeWrite : ([Text], Text, Text) -> async Result.Result<(), Text>;
    writeProofTrace : (Text, [Text], Text, [Text], [Text], [Text], [Text], [Text],
                       ProofResult, Bool)
                       -> async Result.Result<Text, Text>;
    createMemoryRecord : (MemoryType, Text, ?Text, Text, [Text], [Text], [Text], Float, Nat)
                         -> async Result.Result<Text, Text>;
  };

  public shared(msg) func setCPLRuntime(canisterId : Principal) : async () {
    cplRuntimeCanisterId := ?canisterId;
  };

  func getCPL() : ?CPLRuntime {
    switch (cplRuntimeCanisterId) {
      case null null;
      case (?id) {
        let cpl : CPLRuntime = actor (Principal.toText(id));
        ?cpl
      };
    }
  };

  // ── Sacred Constants ───────────────────────────────────────────────

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_SQUARED : Float = 2.6180339887498948482;
  transient let PHI_INVERSE : Float = 0.6180339887498948482;
  transient let PI : Float = 3.14159265358979323846;
  transient let E : Float = 2.71828182845904523536;
  transient let PLANCK_SCALE : Float = 1.616255e-35;

  // ── Types ──────────────────────────────────────────────────────────

  public type DimensionId = {
    #Physical;
    #Computational;
    #Informational;
    #Temporal;
    #Quantum;
    #Emergent;
  };

  /// A harmonic frequency in the dimensional field
  public type Harmonic = {
    id          : Nat;
    dimension   : DimensionId;
    frequency   : Float;      // Base frequency in φ-scaled Hz
    amplitude   : Float;      // Strength of the harmonic
    phase       : Float;      // Phase angle in radians
    overtones   : [Float];    // Higher harmonics (φ^n scaling)
    timestamp   : Int;
    active      : Bool;
  };

  /// A resonance pattern between two or more harmonics
  public type ResonancePattern = {
    id            : Nat;
    harmonicIds   : [Nat];
    coherence     : Float;    // Phase coherence (0.0 to 1.0)
    beatFrequency : Float;    // Interference beat frequency
    strength      : Float;    // Combined field strength
    stable        : Bool;     // Has achieved stable resonance
    timestamp     : Int;
  };

  /// A dimensional field measurement
  public type FieldMeasurement = {
    id          : Nat;
    dimension   : DimensionId;
    position    : [Float];    // Coordinates in n-dimensional space
    fieldVector : [Float];    // Field components at this point
    potential   : Float;      // Scalar potential
    divergence  : Float;      // ∇·E (source density)
    curl        : Float;      // |∇×E| (rotation magnitude)
    timestamp   : Int;
  };

  /// Status of the dimensional field
  public type FieldStatus = {
    #Quiescent;    // Minimal activity
    #Oscillating;  // Regular oscillations
    #Resonant;     // Stable resonance achieved
    #Turbulent;    // Chaotic interference
    #Harmonic;     // Perfect harmonic alignment
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextHarmonicId   : Nat = 0;
  stable var nextPatternId    : Nat = 0;
  stable var nextMeasureId    : Nat = 0;
  stable var globalPhase      : Float = 0.0;
  stable var fieldGeneration  : Nat = 0;

  transient let harmonics     = Buffer.Buffer<Harmonic>(64);
  transient let resonances    = Buffer.Buffer<ResonancePattern>(32);
  transient let measurements  = Buffer.Buffer<FieldMeasurement>(128);
  transient let fieldLog      = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: HARMONIA ────────────────────────────────────────────

  /// Generate a new harmonic in a dimensional field.
  /// Frequency is scaled by φ^generation for natural harmonic series.
  public func generate_harmonic(
    dimension : DimensionId,
    baseFreq  : Float,
    amplitude : Float,
    phase     : Float
  ) : async Harmonic {
    let id = nextHarmonicId;
    nextHarmonicId += 1;

    // Generate φ-scaled overtone series
    let overtones = Buffer.Buffer<Float>(8);
    var n : Nat = 1;
    while (n <= 8) {
      overtones.add(baseFreq * Float.pow(PHI, Float.fromInt(n)));
      n += 1;
    };

    let harmonic : Harmonic = {
      id;
      dimension;
      frequency = baseFreq;
      amplitude;
      phase;
      overtones = Buffer.toArray(overtones);
      timestamp = Time.now();
      active = true;
    };

    harmonics.add(harmonic);
    fieldLog.add("HARMONIA: Generated harmonic #" # Nat.toText(id) #
                 " in " # dimensionToText(dimension) #
                 " f=" # Float.toText(baseFreq) # "Hz");

    harmonic
  };

  /// Modulate a harmonic's amplitude and phase
  public func modulate_harmonic(
    harmonicId  : Nat,
    ampFactor   : Float,
    phaseShift  : Float
  ) : async ?Harmonic {
    for (i in Iter.range(0, harmonics.size() - 1)) {
      let h = harmonics.get(i);
      if (h.id == harmonicId and h.active) {
        let newAmp = h.amplitude * ampFactor;
        let newPhase = normalizePhase(h.phase + phaseShift);

        let modulated : Harmonic = {
          id = h.id;
          dimension = h.dimension;
          frequency = h.frequency;
          amplitude = newAmp;
          phase = newPhase;
          overtones = h.overtones;
          timestamp = Time.now();
          active = true;
        };

        harmonics.put(i, modulated);
        fieldLog.add("HARMONIA: Modulated harmonic #" # Nat.toText(harmonicId) #
                     " amp×" # Float.toText(ampFactor) #
                     " phase+" # Float.toText(phaseShift));
        return ?modulated;
      };
    };
    null
  };

  // ── SUB-MODEL: RESONEX ─────────────────────────────────────────────

  /// Detect resonance between a set of harmonics.
  /// Returns a resonance pattern if phase coherence exceeds φ⁻¹ threshold.
  public func detect_resonance(harmonicIds : [Nat]) : async ?ResonancePattern {
    if (harmonicIds.size() < 2) { return null };

    let found = Buffer.Buffer<Harmonic>(harmonicIds.size());
    for (hid in harmonicIds.vals()) {
      for (h in harmonics.vals()) {
        if (h.id == hid and h.active) {
          found.add(h);
        };
      };
    };

    if (found.size() < 2) { return null };

    // Calculate phase coherence: Ψ = (1/N) × Σ cos(θ_i - θ_mean)
    var phaseSum : Float = 0.0;
    for (h in found.vals()) {
      phaseSum += h.phase;
    };
    let phaseMean = phaseSum / Float.fromInt(found.size());

    var coherenceSum : Float = 0.0;
    for (h in found.vals()) {
      coherenceSum += Float.cos(h.phase - phaseMean);
    };
    let coherence = coherenceSum / Float.fromInt(found.size());

    // Check if coherence exceeds golden threshold
    if (coherence < PHI_INVERSE) { return null };

    // Calculate beat frequency from frequency differences
    var freqSum : Float = 0.0;
    var ampSum : Float = 0.0;
    for (h in found.vals()) {
      freqSum += h.frequency;
      ampSum += h.amplitude;
    };
    let avgFreq = freqSum / Float.fromInt(found.size());

    var beatSum : Float = 0.0;
    for (h in found.vals()) {
      beatSum += Float.abs(h.frequency - avgFreq);
    };
    let beatFreq = beatSum / Float.fromInt(found.size());

    let id = nextPatternId;
    nextPatternId += 1;

    let pattern : ResonancePattern = {
      id;
      harmonicIds;
      coherence;
      beatFrequency = beatFreq;
      strength = ampSum * coherence;
      stable = coherence > PHI_INVERSE * PHI;  // Higher threshold for stability
      timestamp = Time.now();
    };

    resonances.add(pattern);
    fieldLog.add("RESONEX: Detected resonance #" # Nat.toText(id) #
                 " coherence=" # Float.toText(coherence) #
                 " stable=" # (if (pattern.stable) "YES" else "NO"));

    ?pattern
  };

  /// Amplify a resonance pattern by injecting energy
  public func amplify_resonance(patternId : Nat, energyFactor : Float) : async ?ResonancePattern {
    for (i in Iter.range(0, resonances.size() - 1)) {
      let p = resonances.get(i);
      if (p.id == patternId) {
        let amplified : ResonancePattern = {
          id = p.id;
          harmonicIds = p.harmonicIds;
          coherence = Float.min(1.0, p.coherence * (1.0 + energyFactor * PHI_INVERSE));
          beatFrequency = p.beatFrequency;
          strength = p.strength * (1.0 + energyFactor);
          stable = p.coherence * (1.0 + energyFactor * PHI_INVERSE) > PHI_INVERSE * PHI;
          timestamp = Time.now();
        };

        resonances.put(i, amplified);
        fieldLog.add("RESONEX: Amplified resonance #" # Nat.toText(patternId) #
                     " energy×" # Float.toText(energyFactor));
        return ?amplified;
      };
    };
    null
  };

  // ── Field Measurement ──────────────────────────────────────────────

  /// Take a measurement of the dimensional field at a position
  public func measure_field(
    dimension : DimensionId,
    position  : [Float]
  ) : async FieldMeasurement {
    let id = nextMeasureId;
    nextMeasureId += 1;

    // Calculate field contributions from all active harmonics in this dimension
    var fieldX : Float = 0.0;
    var fieldY : Float = 0.0;
    var fieldZ : Float = 0.0;
    var potential : Float = 0.0;

    for (h in harmonics.vals()) {
      if (h.active and dimensionEq(h.dimension, dimension)) {
        // Distance from origin (simplified)
        var r : Float = 0.0;
        for (p in position.vals()) {
          r += p * p;
        };
        r := Float.sqrt(r);
        if (r < 0.001) { r := 0.001 };  // Avoid division by zero

        // Field contribution: E = A × e^(-r/λ) × cos(kr - ωt + φ)
        let wavelength = PHI / h.frequency;
        let k = 2.0 * PI / wavelength;
        let omega = 2.0 * PI * h.frequency;
        let t = Float.fromInt(Time.now() / 1_000_000_000);

        let decay = Float.exp(-r / wavelength);
        let oscillation = Float.cos(k * r - omega * t + h.phase);
        let contribution = h.amplitude * decay * oscillation;

        fieldX += contribution * PHI;
        fieldY += contribution * PHI_INVERSE;
        fieldZ += contribution;
        potential += h.amplitude * decay;
      };
    };

    // Calculate divergence and curl approximations
    let fieldMag = Float.sqrt(fieldX * fieldX + fieldY * fieldY + fieldZ * fieldZ);
    let divergence = potential * PHI_INVERSE;  // Simplified
    let curl = fieldMag * PHI_INVERSE;          // Simplified

    let measurement : FieldMeasurement = {
      id;
      dimension;
      position;
      fieldVector = [fieldX, fieldY, fieldZ];
      potential;
      divergence;
      curl;
      timestamp = Time.now();
    };

    measurements.add(measurement);
    measurement
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// All active harmonics
  public query func list_harmonics() : async [Harmonic] {
    let active = Buffer.Buffer<Harmonic>(harmonics.size());
    for (h in harmonics.vals()) {
      if (h.active) { active.add(h) };
    };
    Buffer.toArray(active)
  };

  /// All resonance patterns
  public query func list_resonances() : async [ResonancePattern] {
    Buffer.toArray(resonances)
  };

  /// Stable resonances only
  public query func stable_resonances() : async [ResonancePattern] {
    let stable = Buffer.Buffer<ResonancePattern>(resonances.size());
    for (r in resonances.vals()) {
      if (r.stable) { stable.add(r) };
    };
    Buffer.toArray(stable)
  };

  /// Recent field measurements
  public query func recent_measurements(limit : Nat) : async [FieldMeasurement] {
    let size = measurements.size();
    if (size == 0) { return [] };

    let start = if (size > limit) { size - limit } else { 0 };
    let result = Buffer.Buffer<FieldMeasurement>(limit);
    for (i in Iter.range(start, size - 1)) {
      result.add(measurements.get(i));
    };
    Buffer.toArray(result)
  };

  /// Field status summary
  public query func field_status() : async {
    status        : FieldStatus;
    harmonics     : Nat;
    resonances    : Nat;
    measurements  : Nat;
    coherenceAvg  : Float;
    generation    : Nat;
  } {
    var activeHarmonics : Nat = 0;
    for (h in harmonics.vals()) {
      if (h.active) { activeHarmonics += 1 };
    };

    var stableCount : Nat = 0;
    var coherenceSum : Float = 0.0;
    for (r in resonances.vals()) {
      if (r.stable) { stableCount += 1 };
      coherenceSum += r.coherence;
    };

    let coherenceAvg = if (resonances.size() > 0) {
      coherenceSum / Float.fromInt(resonances.size())
    } else { 0.0 };

    let status = if (resonances.size() == 0) {
      #Quiescent
    } else if (stableCount > resonances.size() / 2) {
      if (coherenceAvg > PHI_INVERSE * PHI) { #Harmonic } else { #Resonant }
    } else if (coherenceAvg < PHI_INVERSE / 2.0) {
      #Turbulent
    } else {
      #Oscillating
    };

    {
      status;
      harmonics = activeHarmonics;
      resonances = resonances.size();
      measurements = measurements.size();
      coherenceAvg;
      generation = fieldGeneration;
    }
  };

  /// Get field log
  public query func get_field_log() : async [Text] {
    Buffer.toArray(fieldLog)
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func normalizePhase(p : Float) : Float {
    var phase = p;
    while (phase >= 2.0 * PI) { phase -= 2.0 * PI };
    while (phase < 0.0) { phase += 2.0 * PI };
    phase
  };

  func dimensionEq(a : DimensionId, b : DimensionId) : Bool {
    dimensionToNat(a) == dimensionToNat(b)
  };

  func dimensionToNat(d : DimensionId) : Nat {
    switch (d) {
      case (#Physical)      0;
      case (#Computational) 1;
      case (#Informational) 2;
      case (#Temporal)      3;
      case (#Quantum)       4;
      case (#Emergent)      5;
    }
  };

  func dimensionToText(d : DimensionId) : Text {
    switch (d) {
      case (#Physical)      "Physical";
      case (#Computational) "Computational";
      case (#Informational) "Informational";
      case (#Temporal)      "Temporal";
      case (#Quantum)       "Quantum";
      case (#Emergent)      "Emergent";
    }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "AETHER" };

  public query func designation() : async Text {
    "Dimensional Field Harmonics — The substrate of all substrates"
  };

  public func register() : async Text {
    "AETHER registered. Capabilities: [harmonics, resonance, field-analysis, dimensional-measurement]."
  };

  public query func diag() : async {
    status     : Text;
    health     : Float;
    harmonics  : Nat;
    resonances : Nat;
    timestamp  : Int;
  } {
    var activeHarmonics : Nat = 0;
    for (h in harmonics.vals()) {
      if (h.active) { activeHarmonics += 1 };
    };

    var stableCount : Nat = 0;
    for (r in resonances.vals()) {
      if (r.stable) { stableCount += 1 };
    };

    let health = if (resonances.size() == 0) { 0.5 }
                 else { Float.fromInt(stableCount) / Float.fromInt(resonances.size()) };

    {
      status = if (health > PHI_INVERSE) "FIELD_HARMONIC" else "FIELD_OSCILLATING";
      health;
      harmonics = activeHarmonics;
      resonances = resonances.size();
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    // Reactivate dormant harmonics
    var reactivated : Nat = 0;
    for (i in Iter.range(0, harmonics.size() - 1)) {
      let h = harmonics.get(i);
      if (not h.active) {
        harmonics.put(i, {
          id = h.id;
          dimension = h.dimension;
          frequency = h.frequency;
          amplitude = h.amplitude * PHI_INVERSE;  // Reduced amplitude on revival
          phase = h.phase;
          overtones = h.overtones;
          timestamp = Time.now();
          active = true;
        });
        reactivated += 1;
      };
    };
    fieldGeneration += 1;
    "AETHER heal: " # Nat.toText(reactivated) # " harmonic(s) reactivated."
  };

  public query func report_status() : async Text {
    var activeHarmonics : Nat = 0;
    for (h in harmonics.vals()) { if (h.active) { activeHarmonics += 1 } };
    var stableRes : Nat = 0;
    for (r in resonances.vals()) { if (r.stable) { stableRes += 1 } };

    "AETHER | harmonics=" # Nat.toText(activeHarmonics) #
    " resonances=" # Nat.toText(resonances.size()) #
    " stable=" # Nat.toText(stableRes) #
    " measurements=" # Nat.toText(measurements.size()) #
    " generation=" # Nat.toText(fieldGeneration)
  };
};
