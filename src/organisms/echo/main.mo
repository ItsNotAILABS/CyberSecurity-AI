///
/// ECHO — Resonance and Signal Reflection Organism
///
/// "What is sent returns. ECHO captures the reflections that
///  reveal the structure of the unseen."
///
/// ECHO implements signal reflection and resonance detection,
/// analyzing how signals bounce back from boundaries to reveal
/// hidden structures and measure distances.
///
/// Sub-models hosted:
///   REFLECTOR — Signal transmission and reflection handling
///   SONAR     — Distance measurement and structure mapping
///
/// Mathematical Foundation:
///   - Reflection coefficient: R = (Z₂-Z₁)/(Z₂+Z₁)
///   - Standing wave ratio: SWR = (1+|R|)/(1-|R|)
///   - Time of flight: d = ct/2
///   - Doppler shift: f' = f(c±v_r)/(c∓v_s)
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

persistent actor Echo {

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
  transient let PHI_INVERSE : Float = 0.6180339887498948482;
  transient let PI : Float = 3.14159265358979323846;
  transient let C_LIGHT : Float = 299792458.0;  // Speed of light m/s
  transient let C_SOUND : Float = 343.0;         // Speed of sound m/s in air

  // ── Types ──────────────────────────────────────────────────────────

  public type SignalType = {
    #Acoustic;      // Sound waves
    #Electromagnetic;// Light, radio, etc.
    #Seismic;       // Ground waves
    #Data;          // Abstract data signals
  };

  public type MediumType = {
    #Air;
    #Water;
    #Solid;
    #Vacuum;
    #Abstract;
  };

  /// A transmitted signal (ping)
  public type Signal = {
    id          : Nat;
    signalType  : SignalType;
    frequency   : Float;        // Hz
    amplitude   : Float;        // Normalized amplitude
    phase       : Float;        // Phase angle (radians)
    origin      : [Float];      // Transmission point [x, y, z]
    direction   : [Float];      // Unit vector direction
    velocity    : Float;        // Propagation velocity
    timestamp   : Int;          // Transmission time
    active      : Bool;
  };

  /// An echo (reflected signal)
  public type EchoReturn = {
    id            : Nat;
    signalId      : Nat;        // Original signal ID
    amplitude     : Float;      // Attenuated amplitude
    phase         : Float;      // Phase shift from reflection
    delay         : Int;        // Time delay (ns)
    distance      : Float;      // Calculated distance
    reflectorPos  : [Float];    // Estimated reflector position
    doppler       : Float;      // Doppler shift factor
    coefficient   : Float;      // Reflection coefficient
    timestamp     : Int;
  };

  /// A reflector/boundary
  public type Reflector = {
    id          : Nat;
    position    : [Float];      // [x, y, z]
    normal      : [Float];      // Surface normal (unit vector)
    impedance   : Float;        // Acoustic/wave impedance
    absorption  : Float;        // Absorption coefficient (0-1)
    moving      : Bool;         // For Doppler calculations
    velocity    : ?[Float];     // If moving, velocity vector
    timestamp   : Int;
    active      : Bool;
  };

  /// A resonance (standing wave pattern)
  public type Resonance = {
    id            : Nat;
    signalId      : Nat;
    frequency     : Float;
    amplitude     : Float;
    standingWave  : Bool;
    swr           : Float;      // Standing Wave Ratio
    nodes         : [Float];    // Positions of nodes
    antinodes     : [Float];    // Positions of antinodes
    qFactor       : Float;      // Quality factor
    timestamp     : Int;
  };

  /// Echo profile (accumulated reflections)
  public type EchoProfile = {
    signalId      : Nat;
    echoes        : [Nat];      // Echo IDs
    maxRange      : Float;      // Maximum detected range
    targets       : Nat;        // Number of detected targets
    clarity       : Float;      // Signal clarity (0-1)
    timestamp     : Int;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextSignalId    : Nat = 0;
  stable var nextEchoId      : Nat = 0;
  stable var nextReflectorId : Nat = 0;
  stable var nextResonanceId : Nat = 0;
  stable var echoEpoch       : Nat = 0;

  transient let signals     = Buffer.Buffer<Signal>(32);
  transient let echoes      = Buffer.Buffer<EchoReturn>(64);
  transient let reflectors  = Buffer.Buffer<Reflector>(32);
  transient let resonances  = Buffer.Buffer<Resonance>(16);
  transient let profiles    = Buffer.Buffer<EchoProfile>(16);
  transient let echoLog     = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: REFLECTOR ───────────────────────────────────────────

  /// Transmit a signal (ping)
  public func transmit(
    signalType : SignalType,
    frequency  : Float,
    amplitude  : Float,
    origin     : [Float],
    direction  : [Float]
  ) : async Signal {
    let id = nextSignalId;
    nextSignalId += 1;

    // Normalize direction
    var mag : Float = 0.0;
    for (d in direction.vals()) { mag += d * d };
    mag := Float.sqrt(mag);
    let normDir = if (mag > 0.0) {
      let buf = Buffer.Buffer<Float>(3);
      for (d in direction.vals()) { buf.add(d / mag) };
      Buffer.toArray(buf)
    } else { [1.0, 0.0, 0.0] };

    // Determine velocity based on signal type
    let velocity = switch (signalType) {
      case (#Electromagnetic) { C_LIGHT };
      case (#Acoustic) { C_SOUND };
      case (#Seismic) { 6000.0 };  // Approximate P-wave velocity
      case (#Data) { C_LIGHT };    // Treat as light speed for data
    };

    let signal : Signal = {
      id;
      signalType;
      frequency;
      amplitude = Float.min(1.0, Float.max(0.0, amplitude));
      phase = 0.0;
      origin;
      direction = normDir;
      velocity;
      timestamp = Time.now();
      active = true;
    };

    signals.add(signal);
    echoLog.add("REFLECTOR: Transmitted signal #" # Nat.toText(id) #
                " f=" # Float.toText(frequency) # " Hz");

    signal
  };

  /// Add a reflector to the environment
  public func add_reflector(
    position   : [Float],
    normal     : [Float],
    impedance  : Float,
    absorption : Float
  ) : async Reflector {
    let id = nextReflectorId;
    nextReflectorId += 1;

    // Normalize normal vector
    var mag : Float = 0.0;
    for (n in normal.vals()) { mag += n * n };
    mag := Float.sqrt(mag);
    let normNormal = if (mag > 0.0) {
      let buf = Buffer.Buffer<Float>(3);
      for (n in normal.vals()) { buf.add(n / mag) };
      Buffer.toArray(buf)
    } else { [0.0, 0.0, 1.0] };

    let reflector : Reflector = {
      id;
      position;
      normal = normNormal;
      impedance;
      absorption = Float.min(1.0, Float.max(0.0, absorption));
      moving = false;
      velocity = null;
      timestamp = Time.now();
      active = true;
    };

    reflectors.add(reflector);
    echoLog.add("REFLECTOR: Added reflector #" # Nat.toText(id) #
                " absorption=" # Float.toText(absorption));

    reflector
  };

  /// Simulate echo from a signal hitting reflectors
  public func simulate_echoes(signalId : Nat) : async [EchoReturn] {
    var signal : ?Signal = null;
    for (s in signals.vals()) {
      if (s.id == signalId and s.active) { signal := ?s };
    };

    switch (signal) {
      case null { return [] };
      case (?sig) {
        let detected = Buffer.Buffer<EchoReturn>(reflectors.size());

        for (r in reflectors.vals()) {
          if (r.active) {
            // Calculate distance to reflector
            var dist : Float = 0.0;
            let minLen = Nat.min(sig.origin.size(), r.position.size());
            for (i in Iter.range(0, minLen - 1)) {
              let d = r.position[i] - sig.origin[i];
              dist += d * d;
            };
            dist := Float.sqrt(dist);

            // Check if signal direction would hit reflector (simplified)
            var dotProduct : Float = 0.0;
            for (i in Iter.range(0, minLen - 1)) {
              let toReflector = (r.position[i] - sig.origin[i]) / dist;
              let dir = if (i < sig.direction.size()) { sig.direction[i] } else { 0.0 };
              dotProduct += toReflector * dir;
            };

            // Only consider reflectors in front of signal
            if (dotProduct > 0.1) {
              let id = nextEchoId;
              nextEchoId += 1;

              // Calculate reflection coefficient: R = (Z2-Z1)/(Z2+Z1)
              // Assume source impedance is 1.0
              let Z1 : Float = 1.0;
              let Z2 = r.impedance;
              let coefficient = (Z2 - Z1) / (Z2 + Z1);

              // Attenuate amplitude by distance and absorption
              let distanceAttenuation = 1.0 / (1.0 + dist * 0.01);
              let returnAmp = sig.amplitude * distanceAttenuation *
                             Float.abs(coefficient) * (1.0 - r.absorption);

              // Time delay (round trip)
              let delay = Int.abs(Float.toInt(2.0 * dist / sig.velocity * 1_000_000_000.0));

              // Phase shift from reflection
              let phaseShift = if (coefficient < 0.0) { PI } else { 0.0 };

              // Doppler calculation (if moving)
              var doppler : Float = 1.0;
              switch (r.velocity) {
                case (?vel) {
                  var radialVel : Float = 0.0;
                  for (i in Iter.range(0, Nat.min(vel.size(), sig.direction.size()) - 1)) {
                    radialVel += vel[i] * sig.direction[i];
                  };
                  doppler := (sig.velocity + radialVel) / (sig.velocity - radialVel);
                };
                case null {};
              };

              let echo : EchoReturn = {
                id;
                signalId;
                amplitude = returnAmp;
                phase = sig.phase + phaseShift;
                delay;
                distance = dist;
                reflectorPos = r.position;
                doppler;
                coefficient;
                timestamp = Time.now();
              };

              echoes.add(echo);
              detected.add(echo);

              echoLog.add("REFLECTOR: Echo #" # Nat.toText(id) #
                          " from reflector #" # Nat.toText(r.id) #
                          " d=" # Float.toText(dist));
            };
          };
        };

        Buffer.toArray(detected)
      };
    }
  };

  // ── SUB-MODEL: SONAR ───────────────────────────────────────────────

  /// Calculate distance from echo delay
  public query func calculate_distance(echoId : Nat) : async ?Float {
    for (e in echoes.vals()) {
      if (e.id == echoId) {
        // d = ct/2 (round trip)
        return ?e.distance;
      };
    };
    null
  };

  /// Build echo profile for a signal
  public func build_profile(signalId : Nat) : async ?EchoProfile {
    let signalEchoes = Buffer.Buffer<Nat>(echoes.size());
    var maxRange : Float = 0.0;

    for (e in echoes.vals()) {
      if (e.signalId == signalId) {
        signalEchoes.add(e.id);
        if (e.distance > maxRange) { maxRange := e.distance };
      };
    };

    if (signalEchoes.size() == 0) { return null };

    // Calculate clarity (based on amplitude distribution)
    var ampSum : Float = 0.0;
    for (eid in signalEchoes.vals()) {
      for (e in echoes.vals()) {
        if (e.id == eid) { ampSum += e.amplitude };
      };
    };
    let clarity = if (signalEchoes.size() > 0) {
      Float.min(1.0, ampSum / Float.fromInt(signalEchoes.size()))
    } else { 0.0 };

    let profile : EchoProfile = {
      signalId;
      echoes = Buffer.toArray(signalEchoes);
      maxRange;
      targets = signalEchoes.size();
      clarity;
      timestamp = Time.now();
    };

    profiles.add(profile);
    echoLog.add("SONAR: Built profile for signal #" # Nat.toText(signalId) #
                " targets=" # Nat.toText(signalEchoes.size()));

    ?profile
  };

  /// Detect resonance from echo patterns
  public func detect_resonance(signalId : Nat) : async ?Resonance {
    // Find echoes for this signal
    let signalEchoes = Buffer.Buffer<EchoReturn>(echoes.size());
    for (e in echoes.vals()) {
      if (e.signalId == signalId) { signalEchoes.add(e) };
    };

    if (signalEchoes.size() < 2) { return null };

    // Find signal
    var sigFreq : Float = 1.0;
    for (s in signals.vals()) {
      if (s.id == signalId) { sigFreq := s.frequency };
    };

    // Check for standing wave pattern (regular spacing)
    let distances = Buffer.Buffer<Float>(signalEchoes.size());
    for (e in signalEchoes.vals()) {
      distances.add(e.distance);
    };

    // Sort distances and find spacing
    // (Simplified: just use the pattern as-is)
    var totalAmp : Float = 0.0;
    var maxAmp : Float = 0.0;
    var minAmp : Float = 1.0;

    for (e in signalEchoes.vals()) {
      totalAmp += e.amplitude;
      if (e.amplitude > maxAmp) { maxAmp := e.amplitude };
      if (e.amplitude < minAmp) { minAmp := e.amplitude };
    };

    // Standing Wave Ratio: SWR = (1+|R|)/(1-|R|)
    let avgCoeff = totalAmp / Float.fromInt(signalEchoes.size());
    let swr = if (avgCoeff < 1.0) {
      (1.0 + avgCoeff) / (1.0 - avgCoeff)
    } else { 100.0 };  // High SWR indicates standing wave

    // Detect standing wave if SWR is high
    let standingWave = swr > PHI;

    // Quality factor (narrowness of resonance)
    let qFactor = if (maxAmp - minAmp > 0.0) {
      sigFreq * totalAmp / (maxAmp - minAmp)
    } else { 1.0 };

    let id = nextResonanceId;
    nextResonanceId += 1;

    let resonance : Resonance = {
      id;
      signalId;
      frequency = sigFreq;
      amplitude = totalAmp / Float.fromInt(signalEchoes.size());
      standingWave;
      swr;
      nodes = [];      // Would calculate from interference pattern
      antinodes = [];
      qFactor;
      timestamp = Time.now();
    };

    resonances.add(resonance);
    echoLog.add("SONAR: Detected resonance #" # Nat.toText(id) #
                " SWR=" # Float.toText(swr) #
                " standing=" # (if standingWave "YES" else "NO"));

    ?resonance
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_signals() : async [Signal] {
    let active = Buffer.Buffer<Signal>(signals.size());
    for (s in signals.vals()) { if (s.active) { active.add(s) } };
    Buffer.toArray(active)
  };

  public query func list_echoes() : async [EchoReturn] {
    Buffer.toArray(echoes)
  };

  public query func list_reflectors() : async [Reflector] {
    let active = Buffer.Buffer<Reflector>(reflectors.size());
    for (r in reflectors.vals()) { if (r.active) { active.add(r) } };
    Buffer.toArray(active)
  };

  public query func list_resonances() : async [Resonance] {
    Buffer.toArray(resonances)
  };

  public query func echo_state() : async {
    signals    : Nat;
    echoes     : Nat;
    reflectors : Nat;
    resonances : Nat;
    epoch      : Nat;
  } {
    var activeSignals : Nat = 0;
    var activeReflectors : Nat = 0;

    for (s in signals.vals()) { if (s.active) { activeSignals += 1 } };
    for (r in reflectors.vals()) { if (r.active) { activeReflectors += 1 } };

    {
      signals = activeSignals;
      echoes = echoes.size();
      reflectors = activeReflectors;
      resonances = resonances.size();
      epoch = echoEpoch;
    }
  };

  public query func get_echo_log() : async [Text] {
    Buffer.toArray(echoLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "ECHO" };

  public query func designation() : async Text {
    "Resonance and Signal Reflection — What is sent returns"
  };

  public func register() : async Text {
    "ECHO registered. Capabilities: [signal-reflection, sonar, resonance-detection, doppler]."
  };

  public query func diag() : async {
    status     : Text;
    health     : Float;
    signals    : Nat;
    reflectors : Nat;
    timestamp  : Int;
  } {
    var activeSignals : Nat = 0;
    var activeReflectors : Nat = 0;
    for (s in signals.vals()) { if (s.active) { activeSignals += 1 } };
    for (r in reflectors.vals()) { if (r.active) { activeReflectors += 1 } };

    let health = if (activeReflectors > 0) { PHI_INVERSE + 0.3 } else { 0.5 };

    {
      status = if (activeReflectors > 0) "ECHO_READY" else "ECHO_SILENT";
      health;
      signals = activeSignals;
      reflectors = activeReflectors;
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    echoEpoch += 1;
    "ECHO heal: Echo epoch advanced to " # Nat.toText(echoEpoch) # "."
  };

  public query func report_status() : async Text {
    var as_ : Nat = 0; var ar : Nat = 0;
    for (s in signals.vals()) { if (s.active) { as_ += 1 } };
    for (r in reflectors.vals()) { if (r.active) { ar += 1 } };

    "ECHO | signals=" # Nat.toText(as_) #
    " echoes=" # Nat.toText(echoes.size()) #
    " reflectors=" # Nat.toText(ar) #
    " resonances=" # Nat.toText(resonances.size())
  };
};
