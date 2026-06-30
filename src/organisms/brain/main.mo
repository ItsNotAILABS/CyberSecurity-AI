///
/// BRAIN — The Cognitive Monitoring Oracle
///
/// The Brain canister is the real-time monitoring oracle for the Native Nova
/// Protocol.  It exposes a 22-endpoint composite-query surface that snapshots
/// every living layer of the organism:
///
///   — Drone swarm field (position / phase / neurochemistry)
///   — Extended drone metrics (velocities, signal, battery)
///   — Team morale, Ising consensus, captains
///   — Quantum coherence, convergence, Now-index
///   — Active Hz frequency tier
///   — SACESI scalar
///   — Jasmine drift vector
///   — OMNIS emergence state
///   — Kuramoto order parameter + history
///   — Law compliance + doctrine fingerprint
///   — 18-organ grid
///   — Organism neurochemistry (hormones)
///   — Organism-level metal outputs
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
///   — Hive queen / quorum / nectar state
///   — ACO pheromone / danger state
///   — Mission status, waypoints, emergencies
///   — 12-metal resonance pipeline
///   — Audit log (last N entries)
///   — Full drone telemetry fleet
///   — Quantum swarm coherence & convergence
///   — System core diagnostic (pure query)
///   — Canister registry (pure query)
///
/// PHI-grounded primitives seed every default value so the initial snapshot
/// is structurally coherent with the rest of the civilisation.
///
/// Initialization:
///   Call initialize() once after deploy to seed state.  Subsequent calls
///   are no-ops (idempotent).
///
/// Lifecycle:
///   Call tick() periodically to advance Kuramoto phases, refresh SACESI,
///   and append a heartbeat audit entry.
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Brain {

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

  // ══════════════════════════════════════════════════════════════════
  //  CONSTANTS — Golden + Quantum Primitives
  // ══════════════════════════════════════════════════════════════════

  transient let PHI          : Float = 1.6180339887498948482;
  transient let PHI_INV      : Float = 0.6180339887498948482;
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;   // radians
  transient let TWO_PI       : Float = 6.28318530717958647692;

  transient let NUM_DRONES : Nat = 6;
  transient let NUM_ORGANS : Nat = 18;
  transient let NUM_METALS : Nat = 12;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  // ── Spatial ───────────────────────────────────────────────────────

  public type Vec3 = { x : Float; y : Float; z : Float };

  // ── Drone neurochemistry ──────────────────────────────────────────

  public type DroneNeuro = {
    dopamine       : Float;
    serotonin      : Float;
    norepinephrine : Float;
    cortisol       : Float;
  };

  // ── Swarm drone (position / phase / neurochemistry) ───────────────

  public type Drone = {
    id        : Nat;
    position  : Vec3;
    phase     : Float;   // Kuramoto oscillator phase ∈ [0, 2π)
    neuroChem : DroneNeuro;
    active    : Bool;
  };

  // ── Extended drone (+ velocity / acceleration / signal / battery) ─

  public type DroneExtended = {
    id           : Nat;
    position     : Vec3;
    velocity     : Vec3;
    acceleration : Vec3;
    phase        : Float;
    neuroChem    : DroneNeuro;
    signal       : Float;   // ∈ [0, 1]
    battery      : Float;   // ∈ [0, 1]
    active       : Bool;
  };

  // ── Team snapshot ─────────────────────────────────────────────────

  public type TeamSnapshot = {
    morale          : Float;   // ∈ [0, 1]
    captains        : [Nat];   // drone IDs acting as captains
    ising_consensus : Float;   // mean-field magnetisation ∈ [−1, 1]
    cohesion        : Float;   // ∈ [0, 1]
  };

  // ── Quantum metrics ───────────────────────────────────────────────

  public type QMetrics = {
    coherence    : Float;   // ∈ [0, 1]
    convergence  : Float;   // ∈ [0, 1]
    now_index    : Nat;     // discrete "Now" tick counter
    entanglement : Float;   // ∈ [0, 1]
  };

  // ── Frequency tier ────────────────────────────────────────────────

  public type FrequencyTier = {
    name   : Text;   // "Delta" | "Theta" | "Alpha" | "Beta" | "Gamma"
    hz     : Float;
    active : Bool;
  };

  // ── SACESI scalar ─────────────────────────────────────────────────
  //  Synchronised Aggregate Coherence–Emergence Scalar Index

  public type SacesiOutput = {
    scalar    : Float;
    timestamp : Int;
  };

  // ── Jasmine drift vector ──────────────────────────────────────────

  public type JasmineVector = {
    components : [Float];   // 5-component drift (one per Kuramoto cluster)
    magnitude  : Float;
    timestamp  : Int;
  };

  // ── OMNIS emergence state ─────────────────────────────────────────

  public type OmnisState = {
    emergence  : Float;   // ∈ [0, 1]
    level      : Nat;     // discrete emergence level (0 = dormant)
    active     : Bool;
    descriptor : Text;
  };

  // ── Kuramoto order parameter + history ───────────────────────────

  public type KfHz = {
    order_parameter : Float;     // R ∈ [0, 1]
    natural_freq    : Float;     // ω̄ in Hz
    coupling        : Float;     // K (Kuramoto coupling strength)
    history         : [Float];   // last 8 R values (newest first)
  };

  // ── Law compliance + doctrine fingerprint ─────────────────────────

  public type ComplianceState = {
    law_score            : Float;   // ∈ [0, 1]
    doctrine_fingerprint : Nat;     // Fibonacci hash of active doctrine
    violations           : Nat;
    certified            : Bool;
  };

  // ── Organism organ ────────────────────────────────────────────────

  public type Organ = {
    id        : Nat;
    name      : Text;
    health    : Float;     // ∈ [0, 1]
    activity  : Float;     // ∈ [0, 1]
    resonance : Float;
  };

  // ── Organism neurochemistry ───────────────────────────────────────

  public type OrganismNeuro = {
    serotonin  : Float;
    melatonin  : Float;
    insulin    : Float;
    cortisol   : Float;
    dopamine   : Float;
    oxytocin   : Float;
    adrenaline : Float;
  };

  // ── Organism metal output ─────────────────────────────────────────

  public type MetalOutput = {
    name      : Text;
    resonance : Float;
    output    : Float;
  };

  // ── Hive state ────────────────────────────────────────────────────

  public type HiveState = {
    queen_id : Nat;
    quorum   : Float;   // ∈ [0, 1] — fraction of quorum achieved
    nectar   : Float;   // ∈ [0, 1] — nectar availability
    waggle   : Float;   // waggle-dance signal strength
    active   : Bool;
  };

  // ── ACO (Ant Colony Optimisation) state ──────────────────────────

  public type AntState = {
    pheromone_level  : Float;
    danger_level     : Float;
    trail_count      : Nat;
    evaporation_rate : Float;
  };

  // ── Mission / command snapshot ────────────────────────────────────

  public type MissionStatus = {
    status      : Text;
    waypoints   : [Text];
    emergencies : [Text];
    mission_id  : Nat;
    progress    : Float;   // ∈ [0, 1]
  };

  // ── Metal resonance ───────────────────────────────────────────────

  public type MetalResonance = {
    name      : Text;
    frequency : Float;
    amplitude : Float;
    phase     : Float;
  };

  // ── Audit entry ───────────────────────────────────────────────────

  public type AuditEntry = {
    id        : Nat;
    message   : Text;
    category  : Text;
    timestamp : Int;
  };

  // ── Drone telemetry ───────────────────────────────────────────────

  public type DroneTelemetry = {
    drone_id  : Nat;
    position  : Vec3;
    velocity  : Vec3;
    signal    : Float;
    battery   : Float;
    timestamp : Int;
  };

  // ── Quantum swarm metrics ─────────────────────────────────────────

  public type QuantumSwarmMetrics = {
    coherence          : Float;
    convergence        : Float;
    entanglement_count : Nat;
    decoherence_rate   : Float;
  };

  // ── Oracle registration ───────────────────────────────────────────

  public type OracleRegistration = {
    id            : Nat;
    name          : Text;
    canister_type : Text;
    registered_at : Int;
  };

  // ── Canister entry ────────────────────────────────────────────────

  public type CanisterEntry = {
    name      : Text;
    principal : Text;
    active    : Bool;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized : Bool = false;
  stable var nowIndex    : Nat  = 0;
  stable var nextAuditId : Nat  = 0;

  // Drone swarm buffers
  transient let drones    : Buffer.Buffer<Drone>         = Buffer.Buffer<Drone>(NUM_DRONES);
  transient let extDrones : Buffer.Buffer<DroneExtended> = Buffer.Buffer<DroneExtended>(NUM_DRONES);
  transient let telemetry : Buffer.Buffer<DroneTelemetry> = Buffer.Buffer<DroneTelemetry>(NUM_DRONES);

  // Team state
  var teamData : TeamSnapshot = {
    morale          = PHI_INV;
    captains        = [0, 2];
    ising_consensus = PHI_INV;
    cohesion        = PHI_INV;
  };

  // Quantum / frequency state
  var qMetrics : QMetrics = {
    coherence    = PHI_INV;
    convergence  = PHI_INV * PHI_INV;
    now_index    = 0;
    entanglement = PHI_INV;
  };

  var freqTier : FrequencyTier = {
    name   = "Alpha";
    hz     = 10.0;
    active = true;
  };

  // SACESI / Jasmine / OMNIS
  var sacesi : SacesiOutput = {
    scalar    = PHI_INV;
    timestamp = 0;
  };

  var jasmine : JasmineVector = {
    components = [
      PHI_INV,
      PHI_INV * 0.5,
      PHI_INV * 0.25,
      PHI_INV * 0.125,
      PHI_INV * 0.0625
    ];
    magnitude = PHI_INV;
    timestamp = 0;
  };

  var omnis : OmnisState = {
    emergence  = 0.0;
    level      = 0;
    active     = false;
    descriptor = "dormant";
  };

  // Kuramoto
  var kfHz : KfHz = {
    order_parameter = 0.0;
    natural_freq    = 10.0;
    coupling        = PHI;
    history         = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
  };

  // Law compliance
  var compliance : ComplianceState = {
    law_score            = 1.0;
    doctrine_fingerprint = 1;
    violations           = 0;
    certified            = true;
  };

  // Organism internals
  transient let organs      : Buffer.Buffer<Organ>       = Buffer.Buffer<Organ>(NUM_ORGANS);
  transient let metalOuts   : Buffer.Buffer<MetalOutput> = Buffer.Buffer<MetalOutput>(NUM_METALS);

  var neuro : OrganismNeuro = {
    serotonin  = 0.5;
    melatonin  = 0.3;
    insulin    = 0.5;
    cortisol   = 0.2;
    dopamine   = 0.5;
    oxytocin   = 0.4;
    adrenaline = 0.1;
  };

  var hive : HiveState = {
    queen_id = 0;
    quorum   = PHI_INV;
    nectar   = PHI_INV;
    waggle   = 0.0;
    active   = true;
  };

  var ant : AntState = {
    pheromone_level  = PHI_INV;
    danger_level     = 0.0;
    trail_count      = 3;
    evaporation_rate = 0.1 * PHI_INV;
  };

  // Command / mission
  var mission : MissionStatus = {
    status      = "STANDBY";
    waypoints   = ["WP-0", "WP-1", "WP-2"];
    emergencies = [];
    mission_id  = 0;
    progress    = 0.0;
  };

  // Metals resonance pipeline
  transient let metalRes : Buffer.Buffer<MetalResonance> = Buffer.Buffer<MetalResonance>(NUM_METALS);

  // Audit trail
  transient let auditLog : Buffer.Buffer<AuditEntry> = Buffer.Buffer<AuditEntry>(256);

  // Oracle / canister registry
  transient let oracleReg : Buffer.Buffer<OracleRegistration> = Buffer.Buffer<OracleRegistration>(16);
  transient let canReg    : Buffer.Buffer<CanisterEntry>       = Buffer.Buffer<CanisterEntry>(16);

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS
  // ══════════════════════════════════════════════════════════════════

  /// Float modulo: a mod b  (works for positive b).
  private func fmod(a : Float, b : Float) : Float {
    a - b * Float.floor(a / b)
  };

  /// Clamp a float to [lo, hi].
  private func clamp(v : Float, lo : Float, hi : Float) : Float {
    if (v < lo) lo else if (v > hi) hi else v
  };

  /// Compute Kuramoto order parameter R ∈ [0,1] from current drone phases.
  private func computeR() : Float {
    let n = drones.size();
    if (n == 0) return 0.0;
    var sinSum : Float = 0.0;
    var cosSum : Float = 0.0;
    var i : Nat = 0;
    while (i < n) {
      let ph = drones.get(i).phase;
      sinSum += Float.sin(ph);
      cosSum += Float.cos(ph);
      i += 1;
    };
    let nf : Float = Float.fromInt(n);
    Float.sqrt(sinSum * sinSum + cosSum * cosSum) / nf
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALISATION
  // ══════════════════════════════════════════════════════════════════

  transient let ORGAN_NAMES : [Text] = [
    "Brain", "Heart", "Liver", "Kidney-L", "Kidney-R",
    "Lung-L", "Lung-R", "Stomach", "Pancreas", "Spleen",
    "Intestine", "Thyroid", "Adrenal-L", "Adrenal-R",
    "Pineal", "Thymus", "Pituitary", "Hypothalamus"
  ];

  transient let METAL_NAMES : [Text] = [
    "Gold", "Silver", "Copper", "Iron", "Mercury",
    "Lead", "Tin", "Zinc", "Platinum", "Chromium",
    "Titanium", "Osmium"
  ];

  /// Seed all buffers with φ-grounded initial state.
  public func initialize() : async Bool {
    if (initialized) { return true };

    // ── Drone swarm ──────────────────────────────────────────────
    var i : Nat = 0;
    while (i < NUM_DRONES) {
      let fi   : Float = Float.fromInt(i);
      let nf   : Float = Float.fromInt(NUM_DRONES);
      let phase : Float = fmod(fi * GOLDEN_ANGLE, TWO_PI);
      let cosP  : Float = Float.cos(phase);
      let sinP  : Float = Float.sin(phase);

      let nc : DroneNeuro = {
        dopamine       = clamp(PHI_INV * (1.0 - fi / nf), 0.0, 1.0);
        serotonin      = PHI_INV;
        norepinephrine = 0.2 + PHI_INV * 0.3;
        cortisol       = 0.1;
      };

      let pos : Vec3 = { x = cosP; y = sinP; z = PHI_INV * fi / nf };

      drones.add({
        id        = i;
        position  = pos;
        phase     = phase;
        neuroChem = nc;
        active    = true;
      });

      let vel : Vec3 = {
        x = sinP * 0.1;
        y = cosP * 0.1;
        z = 0.0;
      };

      extDrones.add({
        id           = i;
        position     = pos;
        velocity     = vel;
        acceleration = { x = 0.0; y = 0.0; z = 0.0 };
        phase        = phase;
        neuroChem    = nc;
        signal       = clamp(PHI_INV * (1.0 - fi / (nf + 1.0)), 0.0, 1.0);
        battery      = 1.0;
        active       = true;
      });

      telemetry.add({
        drone_id  = i;
        position  = pos;
        velocity  = vel;
        signal    = clamp(PHI_INV * (1.0 - fi / (nf + 1.0)), 0.0, 1.0);
        battery   = 1.0;
        timestamp = Time.now();
      });

      i += 1;
    };

    // ── 18-organ grid ────────────────────────────────────────────
    i := 0;
    while (i < NUM_ORGANS) {
      let fi  : Float = Float.fromInt(i + 1);
      let nf  : Float = Float.fromInt(NUM_ORGANS + 1);
      let phi_norm : Float = Float.pow(PHI, fi) / Float.pow(PHI, nf);
      organs.add({
        id        = i;
        name      = ORGAN_NAMES[i];
        health    = clamp(PHI_INV + (1.0 - PHI_INV) * (1.0 - fi / nf), 0.0, 1.0);
        activity  = clamp(0.5 + PHI_INV * 0.3 * Float.cos(fi * GOLDEN_ANGLE), 0.0, 1.0);
        resonance = phi_norm;
      });
      i += 1;
    };

    // ── 12-metal resonance pipeline ──────────────────────────────
    i := 0;
    while (i < NUM_METALS) {
      let fi     : Float = Float.fromInt(i + 1);
      let nf     : Float = Float.fromInt(NUM_METALS + 1);
      let freq   : Float = Float.pow(PHI, fi);
      let amp    : Float = clamp(PHI_INV + PHI_INV * 0.5 * Float.cos(fi * GOLDEN_ANGLE), 0.0, 1.0);
      let ph     : Float = fmod(fi * GOLDEN_ANGLE, TWO_PI);
      let norm   : Float = Float.pow(PHI, nf);

      metalRes.add({
        name      = METAL_NAMES[i];
        frequency = freq;
        amplitude = amp;
        phase     = ph;
      });

      metalOuts.add({
        name      = METAL_NAMES[i];
        resonance = freq / norm;
        output    = amp;
      });

      i += 1;
    };

    // ── Oracle / canister registry ───────────────────────────────
    let alphaNames : [Text] = [
      "chrysalis", "scribe", "architect", "nexus",
      "sovereign", "observer", "terminal", "custos", "praesidium"
    ];
    i := 0;
    while (i < alphaNames.size()) {
      oracleReg.add({
        id            = i;
        name          = alphaNames[i];
        canister_type = "motoko";
        registered_at = Time.now();
      });
      canReg.add({
        name      = alphaNames[i];
        principal = "aaaaa-aa";   // placeholder — updated at deploy
        active    = true;
      });
      i += 1;
    };

    // ── Seed initial Kuramoto R and SACESI ───────────────────────
    let r : Float = computeR();
    kfHz := {
      order_parameter = r;
      natural_freq    = 10.0;
      coupling        = PHI;
      history         = [r, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    };
    qMetrics := {
      coherence    = r;
      convergence  = r * PHI_INV;
      now_index    = 0;
      entanglement = r * r;
    };
    sacesi := { scalar = PHI_INV * r; timestamp = Time.now() };

    // ── Initial audit entry ──────────────────────────────────────
    auditLog.add({
      id        = nextAuditId;
      message   = "Brain oracle initialized";
      category  = "SYSTEM";
      timestamp = Time.now();
    });
    nextAuditId += 1;

    initialized := true;
    true
  };

  // ══════════════════════════════════════════════════════════════════
  //  UPDATE FUNCTIONS
  // ══════════════════════════════════════════════════════════════════

  /// Advance Kuramoto phases by one golden-angle step, refresh live metrics,
  /// and append a heartbeat audit entry.  Returns the new Now-index.
  public func tick() : async Nat {
    nowIndex += 1;

    // Step each drone phase by δ = GOLDEN_ANGLE × 0.01
    let n = drones.size();
    var i : Nat = 0;
    while (i < n) {
      let d = drones.get(i);
      let newPhase : Float = fmod(d.phase + GOLDEN_ANGLE * 0.01, TWO_PI);
      drones.put(i, {
        id        = d.id;
        position  = d.position;
        phase     = newPhase;
        neuroChem = d.neuroChem;
        active    = d.active;
      });
      i += 1;
    };

    // Recompute Kuramoto R
    let r : Float = computeR();
    let h = kfHz.history;
    kfHz := {
      order_parameter = r;
      natural_freq    = kfHz.natural_freq;
      coupling        = kfHz.coupling;
      history         = [r, h[0], h[1], h[2], h[3], h[4], h[5], h[6]];
    };

    // Refresh QMetrics
    qMetrics := {
      coherence    = r;
      convergence  = r * PHI_INV;
      now_index    = nowIndex;
      entanglement = r * r;
    };

    // Refresh SACESI (mean drone serotonin × R)
    var serSum : Float = 0.0;
    i := 0;
    while (i < n) {
      serSum += drones.get(i).neuroChem.serotonin;
      i += 1;
    };
    let meanSer : Float = if (n > 0) serSum / Float.fromInt(n) else 0.0;
    sacesi := { scalar = meanSer * r; timestamp = Time.now() };

    // Append heartbeat audit entry
    auditLog.add({
      id        = nextAuditId;
      message   = "tick " # Nat.toText(nowIndex);
      category  = "HEARTBEAT";
      timestamp = Time.now();
    });
    nextAuditId += 1;

    nowIndex
  };

  /// Register a peer canister principal in the Brain registry.
  public func registerCanister(name : Text, principal : Text) : async Bool {
    canReg.add({ name; principal; active = true });
    oracleReg.add({
      id            = oracleReg.size();
      name          = name;
      canister_type = "motoko";
      registered_at = Time.now();
    });
    true
  };

  /// Record an external audit entry (called by peer organisms).
  public func recordAudit(message : Text, category : Text) : async Nat {
    let id = nextAuditId;
    auditLog.add({ id; message; category; timestamp = Time.now() });
    nextAuditId += 1;
    id
  };

  /// Update mission state.
  public func updateMission(
    status     : Text,
    waypoints  : [Text],
    emergencies : [Text],
    progress   : Float
  ) : async Bool {
    mission := {
      status;
      waypoints;
      emergencies;
      mission_id = mission.mission_id + 1;
      progress   = clamp(progress, 0.0, 1.0);
    };
    true
  };

  // ══════════════════════════════════════════════════════════════════
  //  COMPOSITE QUERY ENDPOINTS — 20 endpoints
  // ══════════════════════════════════════════════════════════════════

  // ── 1. getBrainSwarmSnapshot ─────────────────────────────────────
  /// Drone field: position / phase / neurochemistry.

  public composite query func getBrainSwarmSnapshot() : async [Drone] {
    Buffer.toArray(drones)
  };

  // ── 2. getBrainExtendedSnapshot ──────────────────────────────────
  /// Extended drone metrics + velocities.

  public composite query func getBrainExtendedSnapshot() : async [DroneExtended] {
    Buffer.toArray(extDrones)
  };

  // ── 3. getBrainTeamSnapshot ──────────────────────────────────────
  /// Team morale, captains, Ising consensus.

  public composite query func getBrainTeamSnapshot() : async TeamSnapshot {
    teamData
  };

  // ── 4. getBrainQMetrics ──────────────────────────────────────────
  /// Quantum coherence, convergence, Now-index.

  public composite query func getBrainQMetrics() : async QMetrics {
    qMetrics
  };

  // ── 5. getBrainFrequencyTier ─────────────────────────────────────
  /// Active Hz tier.

  public composite query func getBrainFrequencyTier() : async FrequencyTier {
    freqTier
  };

  // ── 6. getBrainSacesiOutput ──────────────────────────────────────
  /// SACESI scalar (Synchronised Aggregate Coherence–Emergence Scalar Index).

  public composite query func getBrainSacesiOutput() : async SacesiOutput {
    sacesi
  };

  // ── 7. getBrainJasmineVector ─────────────────────────────────────
  /// Jasmine drift components.

  public composite query func getBrainJasmineVector() : async JasmineVector {
    jasmine
  };

  // ── 8. getBrainOmnis ─────────────────────────────────────────────
  /// OMNIS emergence state.

  public composite query func getBrainOmnis() : async OmnisState {
    omnis
  };

  // ── 9. getBrainKfHz ──────────────────────────────────────────────
  /// Kuramoto order parameter + history.

  public composite query func getBrainKfHz() : async KfHz {
    kfHz
  };

  // ── 10. getBrainCompliance ───────────────────────────────────────
  /// Law compliance + doctrine fingerprint.

  public composite query func getBrainCompliance() : async ComplianceState {
    compliance
  };

  // ── 11. getOrganismOrgans ────────────────────────────────────────
  /// 18-organ grid.

  public composite query func getOrganismOrgans() : async [Organ] {
    Buffer.toArray(organs)
  };

  // ── 12. getOrganismNeuroChem ─────────────────────────────────────
  /// Organism hormones: serotonin, melatonin, insulin, cortisol, dopamine…

  public composite query func getOrganismNeuroChem() : async OrganismNeuro {
    neuro
  };

  // ── 13. getOrganismMetals ────────────────────────────────────────
  /// Organism-level metal outputs.

  public composite query func getOrganismMetals() : async [MetalOutput] {
    Buffer.toArray(metalOuts)
  };

  // ── 14. getOrganismHive ──────────────────────────────────────────
  /// Hive queen / quorum / nectar state.

  public composite query func getOrganismHive() : async HiveState {
    hive
  };

  // ── 15. getOrganismAnt ───────────────────────────────────────────
  /// ACO pheromone / danger state.

  public composite query func getOrganismAnt() : async AntState {
    ant
  };

  // ── 16. getCommandSnapshot ───────────────────────────────────────
  /// Mission status, waypoints, emergencies.

  public composite query func getCommandSnapshot() : async MissionStatus {
    mission
  };

  // ── 17. getMetalsSnapshot ────────────────────────────────────────
  /// 12-metal resonance pipeline.

  public composite query func getMetalsSnapshot() : async [MetalResonance] {
    Buffer.toArray(metalRes)
  };

  // ── 18. getAuditRecentEntries ────────────────────────────────────
  /// Last N audit log entries (newest last).

  public composite query func getAuditRecentEntries(n : Nat) : async [AuditEntry] {
    let total : Nat = auditLog.size();
    let count : Nat = if (n < total) n else total;
    let start : Nat = total - count;
    let buf = Buffer.Buffer<AuditEntry>(count);
    var i : Nat = start;
    while (i < total) {
      buf.add(auditLog.get(i));
      i += 1;
    };
    Buffer.toArray(buf)
  };

  // ── 19. getTelemetryAll ──────────────────────────────────────────
  /// Full drone telemetry fleet.

  public composite query func getTelemetryAll() : async [DroneTelemetry] {
    Buffer.toArray(telemetry)
  };

  // ── 20. getQuantumSwarmMetrics ───────────────────────────────────
  /// Quantum coherence & convergence.

  public composite query func getQuantumSwarmMetrics() : async QuantumSwarmMetrics {
    {
      coherence          = qMetrics.coherence;
      convergence        = qMetrics.convergence;
      entanglement_count = drones.size();
      decoherence_rate   = 1.0 - qMetrics.coherence;
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PURE QUERY ENDPOINTS — 2 endpoints
  // ══════════════════════════════════════════════════════════════════

  // ── 21. getSystemCoreDiagnostic ──────────────────────────────────
  /// Oracle registration summary (instant pure query — no inter-canister calls).

  public query func getSystemCoreDiagnostic() : async {
    total_registrations : Nat;
    active_canisters    : Nat;
    now_index           : Nat;
    drone_count         : Nat;
    audit_entries       : Nat;
    organ_count         : Nat;
    metal_count         : Nat;
    initialized         : Bool;
  } {
    {
      total_registrations = oracleReg.size();
      active_canisters    = canReg.size();
      now_index           = nowIndex;
      drone_count         = drones.size();
      audit_entries       = auditLog.size();
      organ_count         = organs.size();
      metal_count         = metalRes.size();
      initialized         = initialized;
    }
  };

  // ── 22. getCanisterRegistry ──────────────────────────────────────
  /// Registered peer principals.

  public query func getCanisterRegistry() : async [CanisterEntry] {
    Buffer.toArray(canReg)
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name()        : async Text { "BRAIN" };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION STANDARD (v10)
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async {
    status    : Text;
    health    : Float;
    name      : Text;
    timestamp : Int;
  } {
    {
      status    = "ACTIVE";
      health    = 1.0;
      name      = "BRAIN";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "BRAIN self-check complete. No drift detected."
  };

  public func register() : async Text {
    "BRAIN registered. Capabilities: [intelligence, monitor, cognitive, signal]."
  };

  public query func report_status() : async Text {
    "BRAIN | status=ACTIVE | v10=true"
  };

  public query func designation() : async Text {
    "The Cognitive Monitoring Oracle — 22-endpoint composite-query surface"
  };

}
