///
/// VORTEX — Spiral Dynamics and Toroidal Flow Organism
///
/// "Energy flows in spirals, not lines. The vortex is nature's
///  most efficient transport mechanism."
///
/// VORTEX manages spiral dynamics and toroidal flow patterns,
/// implementing the mathematics of vortical motion that underlies
/// all natural systems from galaxies to DNA helices.
///
/// Sub-models hosted:
///   SPIRALIS — Spiral generation and Fibonacci growth patterns
///   TORUS    — Toroidal field dynamics and circulation
///
/// Mathematical Foundation:
///   - Golden spiral: r = φ^(θ/90°) (logarithmic spiral)
///   - Toroidal flux: Φ = ∮ B·dA (magnetic flux through torus)
///   - Vorticity: ω = ∇ × v (curl of velocity field)
///   - Helical path: x = r·cos(θ), y = r·sin(θ), z = cθ
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

persistent actor Vortex {

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
  transient let TAU : Float = 6.28318530717958647692;  // 2π
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;  // π(3 - √5) radians

  // ── Types ──────────────────────────────────────────────────────────

  public type RotationSense = {
    #Clockwise;
    #CounterClockwise;
  };

  public type SpiralType = {
    #Golden;        // φ-based logarithmic spiral
    #Fibonacci;     // Discrete Fibonacci spiral
    #Archimedean;   // Linear r = a + bθ
    #Logarithmic;   // r = ae^(bθ)
    #Fermat;        // r² = a²θ (parabolic)
  };

  /// A spiral structure in the vortex field
  public type Spiral = {
    id            : Nat;
    spiralType    : SpiralType;
    origin        : [Float];      // Center point [x, y, z]
    scaleFactor   : Float;        // a in the spiral equation
    growthRate    : Float;        // b in the spiral equation
    rotation      : RotationSense;
    currentAngle  : Float;        // Current θ in radians
    generation    : Nat;          // Fibonacci generation for discrete spirals
    timestamp     : Int;
    active        : Bool;
  };

  /// A toroidal field structure
  public type Torus = {
    id            : Nat;
    center        : [Float];      // Center of torus [x, y, z]
    majorRadius   : Float;        // R (distance from center to tube center)
    minorRadius   : Float;        // r (radius of the tube)
    flux          : Float;        // Total magnetic-like flux through torus
    circulation   : Float;        // Flow rate around the torus
    poloidal      : Float;        // Poloidal angle (around tube)
    toroidal      : Float;        // Toroidal angle (around center)
    timestamp     : Int;
    active        : Bool;
  };

  /// A vortex in the flow field
  public type VortexCore = {
    id            : Nat;
    position      : [Float];      // Core position [x, y, z]
    axis          : [Float];      // Rotation axis unit vector
    circulation   : Float;        // Γ (line integral of velocity)
    coreRadius    : Float;        // Radius of vortex core
    strength      : Float;        // Vorticity magnitude
    rotation      : RotationSense;
    stability     : Float;        // 0.0 to 1.0
    timestamp     : Int;
    active        : Bool;
  };

  /// Flow state of the vortex system
  public type FlowState = {
    #Laminar;       // Smooth, orderly flow
    #Transitional;  // Between laminar and turbulent
    #Turbulent;     // Chaotic, mixing flow
    #Vortical;      // Dominated by coherent vortices
    #Helical;       // Spiral/helical flow patterns
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextSpiralId  : Nat = 0;
  stable var nextTorusId   : Nat = 0;
  stable var nextVortexId  : Nat = 0;
  stable var systemTime    : Float = 0.0;  // Internal simulation time

  transient let spirals    = Buffer.Buffer<Spiral>(32);
  transient let tori       = Buffer.Buffer<Torus>(16);
  transient let vortices   = Buffer.Buffer<VortexCore>(64);
  transient let flowLog    = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: SPIRALIS ────────────────────────────────────────────

  /// Create a new golden spiral
  public func create_golden_spiral(
    origin      : [Float],
    scaleFactor : Float,
    rotation    : RotationSense
  ) : async Spiral {
    let id = nextSpiralId;
    nextSpiralId += 1;

    let spiral : Spiral = {
      id;
      spiralType = #Golden;
      origin;
      scaleFactor;
      growthRate = Float.log(PHI) / (PI / 2.0);  // Golden spiral growth rate
      rotation;
      currentAngle = 0.0;
      generation = 0;
      timestamp = Time.now();
      active = true;
    };

    spirals.add(spiral);
    flowLog.add("SPIRALIS: Created golden spiral #" # Nat.toText(id) #
                " scale=" # Float.toText(scaleFactor));

    spiral
  };

  /// Create a Fibonacci spiral with discrete growth
  public func create_fibonacci_spiral(
    origin   : [Float],
    rotation : RotationSense
  ) : async Spiral {
    let id = nextSpiralId;
    nextSpiralId += 1;

    let spiral : Spiral = {
      id;
      spiralType = #Fibonacci;
      origin;
      scaleFactor = 1.0;
      growthRate = PHI;  // Each quarter turn grows by φ
      rotation;
      currentAngle = 0.0;
      generation = 1;
      timestamp = Time.now();
      active = true;
    };

    spirals.add(spiral);
    flowLog.add("SPIRALIS: Created Fibonacci spiral #" # Nat.toText(id));

    spiral
  };

  /// Advance a spiral by one step
  public func advance_spiral(spiralId : Nat) : async ?{
    position : [Float];
    radius   : Float;
    angle    : Float;
  } {
    for (i in Iter.range(0, spirals.size() - 1)) {
      let s = spirals.get(i);
      if (s.id == spiralId and s.active) {
        // Calculate step size based on golden angle
        let angleStep = switch (s.rotation) {
          case (#Clockwise) { -GOLDEN_ANGLE };
          case (#CounterClockwise) { GOLDEN_ANGLE };
        };

        let newAngle = s.currentAngle + angleStep;

        // Calculate radius based on spiral type
        let radius = switch (s.spiralType) {
          case (#Golden) {
            s.scaleFactor * Float.pow(PHI, newAngle / (PI / 2.0))
          };
          case (#Fibonacci) {
            s.scaleFactor * Float.pow(PHI, Float.fromInt(s.generation))
          };
          case (#Archimedean) {
            s.scaleFactor + s.growthRate * newAngle
          };
          case (#Logarithmic) {
            s.scaleFactor * Float.exp(s.growthRate * newAngle)
          };
          case (#Fermat) {
            s.scaleFactor * Float.sqrt(newAngle)
          };
        };

        // Calculate position
        let x = s.origin[0] + radius * Float.cos(newAngle);
        let y = s.origin[1] + radius * Float.sin(newAngle);
        let z = if (s.origin.size() > 2) { s.origin[2] } else { 0.0 };

        // Update spiral state
        let newGen = if (s.spiralType == #Fibonacci and 
                         Float.abs(newAngle - s.currentAngle) >= PI / 2.0) {
          s.generation + 1
        } else { s.generation };

        spirals.put(i, {
          id = s.id;
          spiralType = s.spiralType;
          origin = s.origin;
          scaleFactor = s.scaleFactor;
          growthRate = s.growthRate;
          rotation = s.rotation;
          currentAngle = newAngle;
          generation = newGen;
          timestamp = Time.now();
          active = true;
        });

        return ?{
          position = [x, y, z];
          radius;
          angle = newAngle;
        };
      };
    };
    null
  };

  /// Get the Fibonacci number for a given index
  func fibonacci(n : Nat) : Nat {
    if (n == 0) { return 0 };
    if (n == 1) { return 1 };
    var a : Nat = 0;
    var b : Nat = 1;
    var i : Nat = 2;
    while (i <= n) {
      let temp = a + b;
      a := b;
      b := temp;
      i += 1;
    };
    b
  };

  // ── SUB-MODEL: TORUS ───────────────────────────────────────────────

  /// Create a toroidal field structure
  public func create_torus(
    center      : [Float],
    majorRadius : Float,
    minorRadius : Float
  ) : async Torus {
    let id = nextTorusId;
    nextTorusId += 1;

    // Initialize with φ-based proportions
    let torus : Torus = {
      id;
      center;
      majorRadius;
      minorRadius;
      flux = PI * minorRadius * minorRadius * majorRadius * PHI;  // Initial flux
      circulation = TAU * majorRadius * PHI_INVERSE;              // Initial circulation
      poloidal = 0.0;
      toroidal = 0.0;
      timestamp = Time.now();
      active = true;
    };

    tori.add(torus);
    flowLog.add("TORUS: Created torus #" # Nat.toText(id) #
                " R=" # Float.toText(majorRadius) #
                " r=" # Float.toText(minorRadius));

    torus
  };

  /// Advance toroidal flow by one time step
  public func advance_torus_flow(torusId : Nat, deltaT : Float) : async ?{
    poloidal : Float;
    toroidal : Float;
    flux     : Float;
  } {
    for (i in Iter.range(0, tori.size() - 1)) {
      let t = tori.get(i);
      if (t.id == torusId and t.active) {
        // Angular velocities based on circulation
        let omegaToroidal = t.circulation / (TAU * t.majorRadius);
        let omegaPoloidal = t.circulation / (TAU * t.minorRadius) * PHI_INVERSE;

        let newToroidal = normalizeAngle(t.toroidal + omegaToroidal * deltaT);
        let newPoloidal = normalizeAngle(t.poloidal + omegaPoloidal * deltaT);

        // Flux slowly decays and oscillates
        let fluxDecay = Float.exp(-deltaT * 0.001);
        let fluxOscillation = 1.0 + 0.1 * Float.sin(newToroidal * PHI);
        let newFlux = t.flux * fluxDecay * fluxOscillation;

        tori.put(i, {
          id = t.id;
          center = t.center;
          majorRadius = t.majorRadius;
          minorRadius = t.minorRadius;
          flux = newFlux;
          circulation = t.circulation;
          poloidal = newPoloidal;
          toroidal = newToroidal;
          timestamp = Time.now();
          active = true;
        });

        return ?{
          poloidal = newPoloidal;
          toroidal = newToroidal;
          flux = newFlux;
        };
      };
    };
    null
  };

  /// Calculate position on torus surface
  public query func torus_position(torusId : Nat, poloidal : Float, toroidal : Float) : async ?[Float] {
    for (t in tori.vals()) {
      if (t.id == torusId and t.active) {
        // Parametric torus equations:
        // x = (R + r·cos(φ))·cos(θ)
        // y = (R + r·cos(φ))·sin(θ)
        // z = r·sin(φ)
        let R = t.majorRadius;
        let r = t.minorRadius;

        let x = t.center[0] + (R + r * Float.cos(poloidal)) * Float.cos(toroidal);
        let y = t.center[1] + (R + r * Float.cos(poloidal)) * Float.sin(toroidal);
        let z = if (t.center.size() > 2) { t.center[2] } else { 0.0 };
        let zOffset = r * Float.sin(poloidal);

        return ?[x, y, z + zOffset];
      };
    };
    null
  };

  // ── Vortex Core Management ─────────────────────────────────────────

  /// Create a vortex core
  public func create_vortex(
    position    : [Float],
    axis        : [Float],
    circulation : Float,
    coreRadius  : Float,
    rotation    : RotationSense
  ) : async VortexCore {
    let id = nextVortexId;
    nextVortexId += 1;

    // Normalize axis vector
    var mag : Float = 0.0;
    for (a in axis.vals()) { mag += a * a };
    mag := Float.sqrt(mag);
    let normAxis = Buffer.Buffer<Float>(3);
    for (a in axis.vals()) {
      normAxis.add(if (mag > 0.0) { a / mag } else { 0.0 });
    };

    // Vorticity magnitude from circulation: Γ = ∮ v·dl
    let strength = circulation / (TAU * coreRadius);

    let vortex : VortexCore = {
      id;
      position;
      axis = Buffer.toArray(normAxis);
      circulation;
      coreRadius;
      strength;
      rotation;
      stability = PHI_INVERSE;  // Initial stability
      timestamp = Time.now();
      active = true;
    };

    vortices.add(vortex);
    flowLog.add("VORTEX: Created vortex #" # Nat.toText(id) #
                " Γ=" # Float.toText(circulation) #
                " ω=" # Float.toText(strength));

    vortex
  };

  /// Calculate induced velocity at a point from all vortices (Biot-Savart)
  public func induced_velocity(point : [Float]) : async [Float] {
    var vx : Float = 0.0;
    var vy : Float = 0.0;
    var vz : Float = 0.0;

    for (v in vortices.vals()) {
      if (v.active) {
        // Simplified Biot-Savart law for point vortex
        // v = (Γ / 2πr) × (r̂ × ω̂)
        let dx = point[0] - v.position[0];
        let dy = point[1] - v.position[1];
        let dz = if (point.size() > 2 and v.position.size() > 2) {
          point[2] - v.position[2]
        } else { 0.0 };

        let r = Float.sqrt(dx * dx + dy * dy + dz * dz);
        if (r > v.coreRadius) {
          let factor = v.circulation / (TAU * r * r);

          // Cross product with axis
          let ax = if (v.axis.size() > 0) { v.axis[0] } else { 0.0 };
          let ay = if (v.axis.size() > 1) { v.axis[1] } else { 0.0 };
          let az = if (v.axis.size() > 2) { v.axis[2] } else { 1.0 };

          vx += factor * (ay * dz - az * dy);
          vy += factor * (az * dx - ax * dz);
          vz += factor * (ax * dy - ay * dx);
        };
      };
    };

    [vx, vy, vz]
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_spirals() : async [Spiral] {
    let active = Buffer.Buffer<Spiral>(spirals.size());
    for (s in spirals.vals()) {
      if (s.active) { active.add(s) };
    };
    Buffer.toArray(active)
  };

  public query func list_tori() : async [Torus] {
    let active = Buffer.Buffer<Torus>(tori.size());
    for (t in tori.vals()) {
      if (t.active) { active.add(t) };
    };
    Buffer.toArray(active)
  };

  public query func list_vortices() : async [VortexCore] {
    let active = Buffer.Buffer<VortexCore>(vortices.size());
    for (v in vortices.vals()) {
      if (v.active) { active.add(v) };
    };
    Buffer.toArray(active)
  };

  public query func flow_state() : async {
    state         : FlowState;
    spirals       : Nat;
    tori          : Nat;
    vortices      : Nat;
    totalCirc     : Float;
    avgStability  : Float;
  } {
    var activeSpirals : Nat = 0;
    var activeTori : Nat = 0;
    var activeVortices : Nat = 0;
    var totalCirculation : Float = 0.0;
    var stabilitySum : Float = 0.0;

    for (s in spirals.vals()) { if (s.active) { activeSpirals += 1 } };
    for (t in tori.vals()) {
      if (t.active) {
        activeTori += 1;
        totalCirculation += t.circulation;
      };
    };
    for (v in vortices.vals()) {
      if (v.active) {
        activeVortices += 1;
        totalCirculation += v.circulation;
        stabilitySum += v.stability;
      };
    };

    let avgStability = if (activeVortices > 0) {
      stabilitySum / Float.fromInt(activeVortices)
    } else { 1.0 };

    let state = if (activeVortices == 0 and activeTori == 0) {
      #Laminar
    } else if (avgStability > PHI_INVERSE) {
      if (activeSpirals > 0) { #Helical } else { #Vortical }
    } else if (avgStability > PHI_INVERSE / 2.0) {
      #Transitional
    } else {
      #Turbulent
    };

    {
      state;
      spirals = activeSpirals;
      tori = activeTori;
      vortices = activeVortices;
      totalCirc = totalCirculation;
      avgStability;
    }
  };

  public query func get_flow_log() : async [Text] {
    Buffer.toArray(flowLog)
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func normalizeAngle(a : Float) : Float {
    var angle = a;
    while (angle >= TAU) { angle -= TAU };
    while (angle < 0.0) { angle += TAU };
    angle
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "VORTEX" };

  public query func designation() : async Text {
    "Spiral Dynamics and Toroidal Flow — Energy flows in spirals"
  };

  public func register() : async Text {
    "VORTEX registered. Capabilities: [spirals, torus, vorticity, flow-dynamics]."
  };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    spirals   : Nat;
    tori      : Nat;
    vortices  : Nat;
    timestamp : Int;
  } {
    var activeVortices : Nat = 0;
    var stabilitySum : Float = 0.0;
    for (v in vortices.vals()) {
      if (v.active) {
        activeVortices += 1;
        stabilitySum += v.stability;
      };
    };

    let health = if (activeVortices == 0) { 0.5 }
                 else { stabilitySum / Float.fromInt(activeVortices) };

    {
      status = if (health > PHI_INVERSE) "FLOW_STABLE" else "FLOW_TURBULENT";
      health;
      spirals = spirals.size();
      tori = tori.size();
      vortices = activeVortices;
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    var stabilized : Nat = 0;
    for (i in Iter.range(0, vortices.size() - 1)) {
      let v = vortices.get(i);
      if (v.active and v.stability < PHI_INVERSE) {
        vortices.put(i, {
          id = v.id;
          position = v.position;
          axis = v.axis;
          circulation = v.circulation;
          coreRadius = v.coreRadius;
          strength = v.strength;
          rotation = v.rotation;
          stability = PHI_INVERSE;  // Restore to golden stability
          timestamp = Time.now();
          active = true;
        });
        stabilized += 1;
      };
    };
    "VORTEX heal: " # Nat.toText(stabilized) # " vortex(es) stabilized."
  };

  public query func report_status() : async Text {
    var as : Nat = 0; var at : Nat = 0; var av : Nat = 0;
    for (s in spirals.vals()) { if (s.active) { as += 1 } };
    for (t in tori.vals()) { if (t.active) { at += 1 } };
    for (v in vortices.vals()) { if (v.active) { av += 1 } };

    "VORTEX | spirals=" # Nat.toText(as) #
    " tori=" # Nat.toText(at) #
    " vortices=" # Nat.toText(av)
  };
};
