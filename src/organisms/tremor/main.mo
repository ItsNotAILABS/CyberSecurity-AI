///
/// TREMOR — Seismic Wave Propagation Organism
///
/// "The earth speaks in waves. TREMOR listens to the deep vibrations
///  that carry information across vast distances."
///
/// TREMOR implements seismic wave propagation mathematics, modeling
/// how signals and disturbances travel through layered media. It uses
/// φ-weighted attenuation and Pythagorean harmonic analysis.
///
/// Sub-models hosted:
///   SEISMOS   — Wave propagation and reflection modeling
///   GROUNDSWELL — Deep signal detection and triangulation
///
/// Mathematical Foundation:
///   - Wave equation: ∂²u/∂t² = c²∇²u
///   - Snell's law: sin(θ₁)/v₁ = sin(θ₂)/v₂
///   - Attenuation: A = A₀·e^(-αx) (exponential decay)
///   - Resonance: f = (n/2L)√(T/μ) (standing waves)
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

persistent actor Tremor {

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
  transient let E : Float = 2.71828182845904523536;

  // Seismic constants
  transient let DEFAULT_P_VELOCITY : Float = 6.0;   // km/s in upper crust
  transient let DEFAULT_S_VELOCITY : Float = 3.5;   // km/s in upper crust
  transient let RICHTER_BASE : Float = 10.0;

  // ── Types ──────────────────────────────────────────────────────────

  public type WaveType = {
    #PWave;       // Primary (compression) wave
    #SWave;       // Secondary (shear) wave
    #LoveWave;    // Surface wave (horizontal shear)
    #RayleighWave;// Surface wave (rolling motion)
    #Custom;      // User-defined wave
  };

  public type Medium = {
    id           : Nat;
    name         : Text;
    density      : Float;      // kg/m³
    pVelocity    : Float;      // P-wave velocity (km/s)
    sVelocity    : Float;      // S-wave velocity (km/s)
    attenuation  : Float;      // Attenuation coefficient
    depth        : Float;      // Top of layer depth (km)
    thickness    : Float;      // Layer thickness (km)
  };

  /// A seismic wave
  public type SeismicWave = {
    id          : Nat;
    waveType    : WaveType;
    origin      : [Float];     // [x, y, z] epicenter
    amplitude   : Float;       // Initial amplitude
    frequency   : Float;       // Hz
    phase       : Float;       // Phase angle (radians)
    velocity    : Float;       // Current velocity (km/s)
    direction   : [Float];     // Unit vector direction
    energy      : Float;       // Joules (log scale)
    timestamp   : Int;
    active      : Bool;
  };

  /// A detection station
  public type Station = {
    id          : Nat;
    name        : Text;
    position    : [Float];     // [x, y, z] position
    sensitivity : Float;       // Detection threshold
    recordings  : [Recording]; // Recent recordings
    active      : Bool;
  };

  /// A wave recording at a station
  public type Recording = {
    waveId      : Nat;
    arrivalTime : Int;
    amplitude   : Float;
    frequency   : Float;
  };

  /// A detected event (earthquake, signal, etc.)
  public type SeismicEvent = {
    id          : Nat;
    epicenter   : [Float];
    depth       : Float;       // km
    magnitude   : Float;       // Richter scale
    energy      : Float;       // Joules
    waveIds     : [Nat];
    detections  : Nat;         // Number of station detections
    timestamp   : Int;
  };

  /// Wave propagation state
  public type PropagationState = {
    #Quiescent;    // No active waves
    #Active;       // Waves propagating
    #Resonant;     // Standing wave patterns
    #Chaotic;      // Multiple interfering waves
    #Damped;       // Waves attenuating
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextMediumId  : Nat = 0;
  stable var nextWaveId    : Nat = 0;
  stable var nextStationId : Nat = 0;
  stable var nextEventId   : Nat = 0;
  stable var systemTime    : Float = 0.0;

  transient let media      = Buffer.Buffer<Medium>(8);
  transient let waves      = Buffer.Buffer<SeismicWave>(32);
  transient let stations   = Buffer.Buffer<Station>(16);
  transient let events     = Buffer.Buffer<SeismicEvent>(64);
  transient let seismoLog  = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: SEISMOS ─────────────────────────────────────────────

  /// Define a medium layer
  public func add_medium(
    name        : Text,
    density     : Float,
    pVelocity   : Float,
    sVelocity   : Float,
    attenuation : Float,
    depth       : Float,
    thickness   : Float
  ) : async Medium {
    let id = nextMediumId;
    nextMediumId += 1;

    let medium : Medium = {
      id;
      name;
      density;
      pVelocity;
      sVelocity;
      attenuation;
      depth;
      thickness;
    };

    media.add(medium);
    seismoLog.add("SEISMOS: Added medium '" # name # "' Vp=" #
                  Float.toText(pVelocity) # " km/s");

    medium
  };

  /// Generate a seismic wave
  public func generate_wave(
    waveType  : WaveType,
    origin    : [Float],
    amplitude : Float,
    frequency : Float,
    direction : [Float]
  ) : async SeismicWave {
    let id = nextWaveId;
    nextWaveId += 1;

    // Determine velocity based on wave type and medium at origin
    let velocity = switch (waveType) {
      case (#PWave) { getVelocityAtDepth(origin, true) };
      case (#SWave) { getVelocityAtDepth(origin, false) };
      case (#LoveWave) { getVelocityAtDepth(origin, false) * 0.9 };
      case (#RayleighWave) { getVelocityAtDepth(origin, false) * 0.92 };
      case (#Custom) { DEFAULT_P_VELOCITY };
    };

    // Calculate energy from amplitude (logarithmic relationship)
    let energy = amplitude * amplitude * PHI;

    // Normalize direction
    var mag : Float = 0.0;
    for (d in direction.vals()) { mag += d * d };
    mag := Float.sqrt(mag);
    let normDir = if (mag > 0.0) {
      let buf = Buffer.Buffer<Float>(3);
      for (d in direction.vals()) { buf.add(d / mag) };
      Buffer.toArray(buf)
    } else { [1.0, 0.0, 0.0] };

    let wave : SeismicWave = {
      id;
      waveType;
      origin;
      amplitude;
      frequency;
      phase = 0.0;
      velocity;
      direction = normDir;
      energy;
      timestamp = Time.now();
      active = true;
    };

    waves.add(wave);
    seismoLog.add("SEISMOS: Generated " # waveTypeToText(waveType) #
                  " #" # Nat.toText(id) # " A=" # Float.toText(amplitude));

    wave
  };

  /// Propagate a wave by time step (returns new position and amplitude)
  public func propagate_wave(waveId : Nat, deltaT : Float) : async ?{
    position  : [Float];
    amplitude : Float;
    phase     : Float;
  } {
    for (i in Iter.range(0, waves.size() - 1)) {
      let w = waves.get(i);
      if (w.id == waveId and w.active) {
        // Calculate new position
        let distance = w.velocity * deltaT;  // km traveled
        let newPos = Buffer.Buffer<Float>(3);
        for (j in Iter.range(0, w.origin.size() - 1)) {
          let dir = if (j < w.direction.size()) { w.direction[j] } else { 0.0 };
          newPos.add(w.origin[j] + dir * distance);
        };

        // Calculate attenuation (φ-weighted exponential decay)
        let attenCoef = getAttenuationAtDepth(Buffer.toArray(newPos));
        let newAmplitude = w.amplitude * Float.exp(-attenCoef * distance * PHI_INVERSE);

        // Update phase
        let newPhase = normalizePhase(w.phase + 2.0 * PI * w.frequency * deltaT);

        // Check if wave has damped below threshold
        let stillActive = newAmplitude > 0.001;

        waves.put(i, {
          id = w.id;
          waveType = w.waveType;
          origin = Buffer.toArray(newPos);
          amplitude = newAmplitude;
          frequency = w.frequency;
          phase = newPhase;
          velocity = w.velocity;
          direction = w.direction;
          energy = newAmplitude * newAmplitude * PHI;
          timestamp = Time.now();
          active = stillActive;
        });

        return ?{
          position = Buffer.toArray(newPos);
          amplitude = newAmplitude;
          phase = newPhase;
        };
      };
    };
    null
  };

  /// Calculate wave at a specific point (superposition)
  public func wave_at_point(point : [Float]) : async {
    totalAmplitude : Float;
    dominantFreq   : Float;
    waveCount      : Nat;
  } {
    var totalAmp : Float = 0.0;
    var freqSum : Float = 0.0;
    var count : Nat = 0;

    for (w in waves.vals()) {
      if (w.active) {
        // Calculate distance from wave origin to point
        var dist : Float = 0.0;
        let minLen = Nat.min(w.origin.size(), point.size());
        for (i in Iter.range(0, minLen - 1)) {
          let d = point[i] - w.origin[i];
          dist += d * d;
        };
        dist := Float.sqrt(dist);

        // Calculate attenuated amplitude at this point
        let attenCoef = getAttenuationAtDepth(point);
        let amp = w.amplitude * Float.exp(-attenCoef * dist * PHI_INVERSE);

        // Add phase-adjusted contribution
        let phase = w.phase + 2.0 * PI * dist / (w.velocity / w.frequency);
        totalAmp += amp * Float.cos(phase);
        freqSum += w.frequency * amp;
        count += 1;
      };
    };

    let dominantFreq = if (count > 0 and totalAmp != 0.0) {
      freqSum / Float.abs(totalAmp)
    } else { 0.0 };

    {
      totalAmplitude = Float.abs(totalAmp);
      dominantFreq;
      waveCount = count;
    }
  };

  // ── SUB-MODEL: GROUNDSWELL ─────────────────────────────────────────

  /// Add a detection station
  public func add_station(
    name        : Text,
    position    : [Float],
    sensitivity : Float
  ) : async Station {
    let id = nextStationId;
    nextStationId += 1;

    let station : Station = {
      id;
      name;
      position;
      sensitivity;
      recordings = [];
      active = true;
    };

    stations.add(station);
    seismoLog.add("GROUNDSWELL: Added station '" # name # "'");

    station
  };

  /// Check all stations for wave detections
  public func detect_waves() : async [Recording] {
    let newRecordings = Buffer.Buffer<Recording>(32);

    for (si in Iter.range(0, stations.size() - 1)) {
      let station = stations.get(si);
      if (station.active) {
        let waveAtStation = await wave_at_point(station.position);

        if (waveAtStation.totalAmplitude > station.sensitivity) {
          // Record detection from each active wave
          let existingRecs = Buffer.fromArray<Recording>(station.recordings);

          for (w in waves.vals()) {
            if (w.active) {
              let rec : Recording = {
                waveId = w.id;
                arrivalTime = Time.now();
                amplitude = waveAtStation.totalAmplitude;
                frequency = waveAtStation.dominantFreq;
              };
              existingRecs.add(rec);
              newRecordings.add(rec);
            };
          };

          stations.put(si, {
            id = station.id;
            name = station.name;
            position = station.position;
            sensitivity = station.sensitivity;
            recordings = Buffer.toArray(existingRecs);
            active = true;
          });
        };
      };
    };

    Buffer.toArray(newRecordings)
  };

  /// Triangulate event location from station detections
  public func triangulate_event() : async ?SeismicEvent {
    // Need at least 3 stations with recent detections
    let detectingStations = Buffer.Buffer<Station>(stations.size());
    for (s in stations.vals()) {
      if (s.active and s.recordings.size() > 0) {
        detectingStations.add(s);
      };
    };

    if (detectingStations.size() < 3) { return null };

    // Simplified triangulation: average positions weighted by amplitude
    var sumX : Float = 0.0;
    var sumY : Float = 0.0;
    var sumZ : Float = 0.0;
    var totalWeight : Float = 0.0;
    var maxAmp : Float = 0.0;

    for (s in detectingStations.vals()) {
      let lastRec = s.recordings[s.recordings.size() - 1];
      let weight = lastRec.amplitude;

      if (s.position.size() > 0) { sumX += s.position[0] * weight };
      if (s.position.size() > 1) { sumY += s.position[1] * weight };
      if (s.position.size() > 2) { sumZ += s.position[2] * weight };
      totalWeight += weight;

      if (lastRec.amplitude > maxAmp) { maxAmp := lastRec.amplitude };
    };

    let epicenter = [
      sumX / totalWeight,
      sumY / totalWeight,
      sumZ / totalWeight
    ];

    // Estimate magnitude from maximum amplitude
    let magnitude = Float.log(maxAmp * 1000.0) / Float.log(RICHTER_BASE);

    // Energy from magnitude: E = 10^(1.5M + 4.8)
    let energy = Float.pow(10.0, 1.5 * magnitude + 4.8);

    let id = nextEventId;
    nextEventId += 1;

    let waveIds = Buffer.Buffer<Nat>(waves.size());
    for (w in waves.vals()) { if (w.active) { waveIds.add(w.id) } };

    let event : SeismicEvent = {
      id;
      epicenter;
      depth = Float.abs(epicenter[2]);
      magnitude;
      energy;
      waveIds = Buffer.toArray(waveIds);
      detections = detectingStations.size();
      timestamp = Time.now();
    };

    events.add(event);
    seismoLog.add("GROUNDSWELL: Event #" # Nat.toText(id) #
                  " M=" # Float.toText(magnitude) #
                  " depth=" # Float.toText(event.depth) # " km");

    ?event
  };

  // ── Helper Functions ───────────────────────────────────────────────

  func getVelocityAtDepth(pos : [Float], isPWave : Bool) : Float {
    let depth = if (pos.size() > 2) { Float.abs(pos[2]) } else { 0.0 };

    for (m in media.vals()) {
      if (depth >= m.depth and depth < m.depth + m.thickness) {
        return if (isPWave) { m.pVelocity } else { m.sVelocity };
      };
    };

    if (isPWave) { DEFAULT_P_VELOCITY } else { DEFAULT_S_VELOCITY }
  };

  func getAttenuationAtDepth(pos : [Float]) : Float {
    let depth = if (pos.size() > 2) { Float.abs(pos[2]) } else { 0.0 };

    for (m in media.vals()) {
      if (depth >= m.depth and depth < m.depth + m.thickness) {
        return m.attenuation;
      };
    };

    0.01  // Default attenuation
  };

  func normalizePhase(p : Float) : Float {
    var phase = p;
    while (phase >= 2.0 * PI) { phase -= 2.0 * PI };
    while (phase < 0.0) { phase += 2.0 * PI };
    phase
  };

  func waveTypeToText(wt : WaveType) : Text {
    switch (wt) {
      case (#PWave) { "P-Wave" };
      case (#SWave) { "S-Wave" };
      case (#LoveWave) { "Love Wave" };
      case (#RayleighWave) { "Rayleigh Wave" };
      case (#Custom) { "Custom Wave" };
    }
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_media() : async [Medium] {
    Buffer.toArray(media)
  };

  public query func list_waves() : async [SeismicWave] {
    let active = Buffer.Buffer<SeismicWave>(waves.size());
    for (w in waves.vals()) { if (w.active) { active.add(w) } };
    Buffer.toArray(active)
  };

  public query func list_stations() : async [Station] {
    let active = Buffer.Buffer<Station>(stations.size());
    for (s in stations.vals()) { if (s.active) { active.add(s) } };
    Buffer.toArray(active)
  };

  public query func list_events() : async [SeismicEvent] {
    Buffer.toArray(events)
  };

  public query func propagation_state() : async {
    state      : PropagationState;
    waves      : Nat;
    stations   : Nat;
    events     : Nat;
    totalEnergy: Float;
  } {
    var activeWaves : Nat = 0;
    var activeStations : Nat = 0;
    var totalEnergy : Float = 0.0;

    for (w in waves.vals()) {
      if (w.active) {
        activeWaves += 1;
        totalEnergy += w.energy;
      };
    };
    for (s in stations.vals()) { if (s.active) { activeStations += 1 } };

    let state = if (activeWaves == 0) { #Quiescent }
                else if (activeWaves == 1) { #Active }
                else if (totalEnergy > 1000.0) { #Chaotic }
                else if (activeWaves >= 3) { #Resonant }
                else { #Damped };

    {
      state;
      waves = activeWaves;
      stations = activeStations;
      events = events.size();
      totalEnergy;
    }
  };

  public query func get_seismo_log() : async [Text] {
    Buffer.toArray(seismoLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "TREMOR" };

  public query func designation() : async Text {
    "Seismic Wave Propagation — The earth speaks in waves"
  };

  public func register() : async Text {
    "TREMOR registered. Capabilities: [wave-propagation, detection, triangulation, attenuation]."
  };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    waves     : Nat;
    stations  : Nat;
    timestamp : Int;
  } {
    var activeWaves : Nat = 0;
    var activeStations : Nat = 0;
    for (w in waves.vals()) { if (w.active) { activeWaves += 1 } };
    for (s in stations.vals()) { if (s.active) { activeStations += 1 } };

    let health = if (activeStations >= 3) { PHI_INVERSE + 0.3 }
                 else if (activeStations >= 1) { 0.5 }
                 else { 0.3 };

    {
      status = if (activeStations >= 3) "DETECTION_READY" else "DETECTION_LIMITED";
      health;
      waves = activeWaves;
      stations = activeStations;
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    // Reactivate damped waves with minimum amplitude
    var reactivated : Nat = 0;
    for (i in Iter.range(0, waves.size() - 1)) {
      let w = waves.get(i);
      if (not w.active and w.amplitude > 0.0001) {
        waves.put(i, {
          id = w.id;
          waveType = w.waveType;
          origin = w.origin;
          amplitude = 0.01;  // Minimum revival amplitude
          frequency = w.frequency;
          phase = w.phase;
          velocity = w.velocity;
          direction = w.direction;
          energy = 0.01 * 0.01 * PHI;
          timestamp = Time.now();
          active = true;
        });
        reactivated += 1;
      };
    };
    "TREMOR heal: " # Nat.toText(reactivated) # " wave(s) reactivated."
  };

  public query func report_status() : async Text {
    var aw : Nat = 0; var as_ : Nat = 0;
    for (w in waves.vals()) { if (w.active) { aw += 1 } };
    for (s in stations.vals()) { if (s.active) { as_ += 1 } };
    "TREMOR | waves=" # Nat.toText(aw) #
    " stations=" # Nat.toText(as_) #
    " events=" # Nat.toText(events.size())
  };
};
