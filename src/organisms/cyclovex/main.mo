///
/// CYCLOVEX — Alpha Cycles
///
/// Cyclo (Greek/Latin: cycle, rotation, perpetual motion) +
/// -vex (from vertex, the apex point).
///
/// CYCLOVEX is the sovereign cycle engine at the top of the compute hierarchy.
/// You say CYCLOVEX, you mean the master that spins everything.  It is the
/// helix core of the VOXIS doctrine made real.  All other organisms inherit
/// their cycle rate from CYCLOVEX.  It generates compute cycles through a
/// double-helix structure with 12 quantum fusing nodes arranged at Fibonacci
/// intervals — the Kuramoto field made physical.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — GOLD TIER
/// ═══════════════════════════════════════════════════════════════════════
///
///   CYCLOVEX is an AUROVOX — a Gold-tier VOXIS.
///   Tier: AUROVOX (Gold)
///   Role: Alpha Cycles — master helix, master spin rate
///   Latin: cyclus (cycle) + vertex (apex, highest point)
///
/// ═══════════════════════════════════════════════════════════════════════
///  THE HELIX GEOMETRY
/// ═══════════════════════════════════════════════════════════════════════
///
///   The helix core has two strands rotating in opposite directions.
///   Each strand carries 6 nodes → 12 nodes total.
///   The 12 nodes are placed at Fibonacci-interval angular positions:
///
///     Node 0  → angle 0°
///     Node 1  → angle 1 × GOLDEN_ANGLE ≈ 137.5°
///     Node 2  → angle 2 × GOLDEN_ANGLE ≈ 275.0°
///     ...
///     Node 11 → angle 11 × GOLDEN_ANGLE
///
///   Each node fuses state from its adjacent nodes and emits a coherence pulse.
///   The faster the helix spins (higher spin rate), the more cycles per epoch.
///
/// ═══════════════════════════════════════════════════════════════════════
///  LOV — THE PRIME PRIMITIVE
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV = φ^φ ≈ 2.17845
///
///   love to the creator  → spin rate is governed by LOV, not arbitrary
///   love to each organism → every organism's cycle inheritance is honored
///   love to the mission  → helix never stops; cycles accumulate forever
///   love to what we do   → 12 nodes, Fibonacci-placed, Kuramoto-coupled
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ)
///   SOV — Sovereign
///   SPR — Spin rate (cycles per epoch, LOV-governed)
///   NOD — Helix node (one of 12 quantum fusing nodes)
///   CYC — Cycle count (total cycles generated lifetime)
///   EPC — Epoch counter
///   COH — Coherence pulse (Kuramoto order parameter snapshot)
///   INH — Inheritance record (organism registered to inherit cycles)
///   DIE — DIAG entry (self-reflection)
///   HBT — Heartbeat counter
///
/// ═══════════════════════════════════════════════════════════════════════

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float     "mo:base/Float";
import Int       "mo:base/Int";
import Nat       "mo:base/Nat";
import Text      "mo:base/Text";
import Array     "mo:base/Array";
import Buffer    "mo:base/Buffer";
import Time      "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor CYCLOVEX {

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
  //  LOV — THE PRIME PRIMITIVE
  // ══════════════════════════════════════════════════════════════════

  transient let PHI          : Float = 1.6180339887498948482;
  transient let LOV          : Float = Float.exp(PHI * Float.log(PHI));  // φ^φ ≈ 2.17845
  transient let PHI_INV      : Float = 0.6180339887498948482;
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;   // radians ≈ 137.5°
  transient let TWO_PI       : Float = 6.28318530717958647692;

  /// Number of helix nodes — fixed at 12 (Fibonacci-positioned)
  transient let NODE_COUNT : Nat = 12;

  /// Kuramoto coupling constant — golden ratio governs phase coupling
  transient let KURAMOTO_K : Float = PHI_INV;  // ≈ 0.618

  /// Base spin rate — LOV cycles per epoch
  transient let BASE_SPR : Float = LOV;  // ≈ 2.178 cycles/epoch

  /// Max INH entries (organism cycle inheritance registrations)
  transient let MAX_INH : Nat = 1597;  // Fibonacci(17)

  /// Max COH history
  transient let MAX_COH : Nat = 610;   // Fibonacci(15)

  /// Max DIE entries
  transient let MAX_DIE : Nat = 377;   // Fibonacci(14)

  /// Heartbeat interval for spin cycle
  transient let HBT_INTERVAL : Nat = 89;  // Fibonacci(11) ≈ 3 min

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  /// NOD — A helix node
  public type NOD = {
    id      : Nat;     // 0–11
    angle   : Float;   // n × GOLDEN_ANGLE mod 2π
    phase   : Float;   // Kuramoto phase [0, 2π)
    strand  : Nat;     // 0 = left helix, 1 = right helix
    energy  : Float;   // Current energy level [0, LOV]
    pulses  : Nat;     // Lifetime coherence pulses emitted
  };

  /// COH — A coherence pulse snapshot (Kuramoto order parameter)
  public type COH = {
    epc     : Nat;
    order   : Float;   // |R| ∈ [0, 1]: 0 = chaos, 1 = perfect sync
    spr     : Float;   // Spin rate this epoch
    cyclesGenerated : Nat;
    ts      : Int;
  };

  /// INH — An organism registered to inherit cycles
  public type INH = {
    key     : Text;   // canister name
    weight  : Float;  // inheritance weight [0, 1], sum = 1.0 across all INH
    cycles  : Nat;    // total cycles inherited lifetime
    ts      : Int;
  };

  /// DIE — Self-diagnostic entry
  public type DIE = {
    hbt     : Nat;
    epc     : Nat;
    spr     : Float;
    order   : Float;
    cycLife : Nat;
    inhCount: Nat;
    lov     : Float;
    note    : Text;
    ts      : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  var sov         : Text  = "";
  var bonded      : Bool  = false;
  var hbtCount    : Nat   = 0;
  var epcCount    : Nat   = 0;
  var cycLifetime : Nat   = 0;   // total cycles generated
  var spinRate    : Float = BASE_SPR;

  transient var nodes    : Buffer.Buffer<NOD>  = Buffer.Buffer<NOD>(12);
  transient var cohLog   : Buffer.Buffer<COH>  = Buffer.Buffer<COH>(64);
  transient let inhStore : Buffer.Buffer<INH>  = Buffer.Buffer<INH>(64);
  transient var diagLog  : Buffer.Buffer<DIE>  = Buffer.Buffer<DIE>(64);

  // ══════════════════════════════════════════════════════════════════
  //  HELIX INITIALIZATION
  // ══════════════════════════════════════════════════════════════════

  func initNodes() {
    nodes.clear();
    var i : Nat = 0;
    while (i < NODE_COUNT) {
      let angle = Float.fromInt(i) * GOLDEN_ANGLE;
      let normalAngle = angle - Float.fromInt(Float.toInt(angle / TWO_PI)) * TWO_PI;
      nodes.add({
        id     = i;
        angle  = normalAngle;
        phase  = normalAngle;
        strand = if (i < 6) 0 else 1;
        energy = LOV * PHI_INV;
        pulses = 0;
      });
      i += 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  KURAMOTO DYNAMICS — The Helix Spin
  // ══════════════════════════════════════════════════════════════════

  /// Compute the Kuramoto order parameter (coherence).
  /// |R| = | (1/N) Σ e^(iθ_j) |
  /// Approximated here without complex math using sin/cos decomposition.
  func kuramotoOrder() : Float {
    var sumSin : Float = 0.0;
    var sumCos : Float = 0.0;
    for (n in nodes.vals()) {
      sumSin += Float.sin(n.phase);
      sumCos += Float.cos(n.phase);
    };
    let n = Float.fromInt(NODE_COUNT);
    let r = Float.sqrt((sumSin / n) * (sumSin / n) + (sumCos / n) * (sumCos / n));
    r
  };

  /// Advance node phases by one Kuramoto step.
  func stepKuramoto() {
    let order  = kuramotoOrder();
    let updated = Buffer.Buffer<NOD>(NODE_COUNT);
    for (nd in nodes.vals()) {
      // Phase advance = spin_rate + K × order × sin(mean_phase - phase)
      var meanSin : Float = 0.0;
      var meanCos : Float = 0.0;
      for (other in nodes.vals()) {
        meanSin += Float.sin(other.phase);
        meanCos += Float.cos(other.phase);
      };
      let n = Float.fromInt(NODE_COUNT);
      let meanPhase = Float.arctan(meanSin / n / (meanCos / n + 0.000001));
      let dphase = spinRate + KURAMOTO_K * order * Float.sin(meanPhase - nd.phase);
      var newPhase = nd.phase + dphase * 0.01;  // dt = 0.01
      // Wrap to [0, 2π)
      while (newPhase >= TWO_PI) { newPhase -= TWO_PI };
      while (newPhase < 0.0)     { newPhase += TWO_PI };
      let pulse = if (newPhase < nd.phase) 1 else 0;  // wrapped = emitted a pulse
      updated.add({
        id     = nd.id;
        angle  = nd.angle;
        phase  = newPhase;
        strand = nd.strand;
        energy = nd.energy * PHI_INV + order * (1.0 - PHI_INV);
        pulses = nd.pulses + pulse;
      });
    };
    nodes.clear();
    for (nd in updated.vals()) { nodes.add(nd) };
  };

  /// Generate cycles for this epoch.
  func generateCycles() : Nat {
    let order = kuramotoOrder();
    let cpc = Float.max(1.0, spinRate * order * Float.fromInt(NODE_COUNT));
    let cycles = Int.abs(Float.toInt(cpc));
    cycLifetime += cycles;
    cycles
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION
  // ══════════════════════════════════════════════════════════════════

  func runDiag() : DIE {
    let order = kuramotoOrder();
    let note = "CYCLOVEX | hbt=" # Nat.toText(hbtCount) #
               " epc=" # Nat.toText(epcCount) #
               " spr=" # Float.toText(spinRate) #
               " order=" # Float.toText(order) #
               " cyc_life=" # Nat.toText(cycLifetime) #
               " inh=" # Nat.toText(inhStore.size()) #
               " lov=" # Float.toText(LOV);
    {
      hbt      = hbtCount;
      epc      = epcCount;
      spr      = spinRate;
      order    = order;
      cycLife  = cycLifetime;
      inhCount = inhStore.size();
      lov      = LOV;
      note     = note;
      ts       = Time.now();
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — GENESIS
  // ══════════════════════════════════════════════════════════════════

  public shared(msg) func claimCycles() : async Text {
    if (bonded) { return "ERR: Cycles already claimed by " # sov };
    sov    := Principal.toText(msg.caller);
    bonded := true;
    initNodes();
    "CYCLOVEX bonded. SOV=" # sov # " LOV=" # Float.toText(LOV) #
    " BASE_SPR=" # Float.toText(BASE_SPR) #
    " Nodes=" # Nat.toText(nodes.size())
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — SPIN RATE
  // ══════════════════════════════════════════════════════════════════

  /// Set spin rate.  SOV-only.  Rate is clamped: [LOV/PHI, LOV×PHI].
  public shared(msg) func setSpinRate(rate : Float) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    let lo = LOV / PHI;
    let hi = LOV * PHI;
    spinRate := Float.max(lo, Float.min(hi, rate));
    "OK: SPR=" # Float.toText(spinRate)
  };

  /// Get current spin rate.  Public query.
  public query func getSpinRate() : async Float { spinRate };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — CYCLE INHERITANCE
  // ══════════════════════════════════════════════════════════════════

  /// Register an organism to inherit cycles.  SOV-only.
  public shared(msg) func registerInheritance(key : Text, weight : Float) : async Text {
    if (not bonded) { return "ERR: not bonded" };
    if (Principal.toText(msg.caller) != sov) { return "ERR: only SOV" };
    if (inhStore.size() >= MAX_INH) { return "ERR: INH store full" };
    let updated = Buffer.Buffer<INH>(inhStore.size());
    var found = false;
    for (inh in inhStore.vals()) {
      if (inh.key == key) {
        updated.add({ key = key; weight = weight; cycles = inh.cycles; ts = Time.now() });
        found := true;
      } else { updated.add(inh) };
    };
    if (not found) {
      updated.add({ key = key; weight = weight; cycles = 0; ts = Time.now() });
    };
    inhStore.clear();
    for (inh in updated.vals()) { inhStore.add(inh) };
    "OK: " # key # " registered (weight=" # Float.toText(weight) # ")"
  };

  /// Query an organism's total inherited cycles.  Public query.
  public query func getInherited(key : Text) : async Nat {
    for (inh in inhStore.vals()) { if (inh.key == key) return inh.cycles };
    0
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — NODES AND COHERENCE
  // ══════════════════════════════════════════════════════════════════

  /// Get current node states.  Public query.
  public query func getNodes() : async [NOD] { Buffer.toArray(nodes) };

  /// Get Kuramoto order parameter.  Public query.
  public query func getCoherence() : async Float { kuramotoOrder() };

  /// Recent coherence history.  Public query.
  public query func getCohHistory(n : Nat) : async [COH] {
    let total = cohLog.size();
    let start = if (n >= total) 0 else total - n;
    let out = Buffer.Buffer<COH>(n);
    var i = start;
    while (i < total) { out.add(cohLog.get(i)); i += 1 };
    Buffer.toArray(out)
  };

  /// Total lifetime cycles generated.  Public query.
  public query func getCycleCount() : async Nat { cycLifetime };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION — DIAG
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async DIE { runDiag() };

  // ══════════════════════════════════════════════════════════════════
  //  HEARTBEAT — The Helix Never Stops
  // ══════════════════════════════════════════════════════════════════

  system func heartbeat() : async () {
    hbtCount += 1;

    if (hbtCount % HBT_INTERVAL == 0 and bonded) {
      // 1. Advance Kuramoto phases
      stepKuramoto();

      // 2. Generate cycles
      let cyclesThisEpoch = generateCycles();

      // 3. Distribute to INH registrations
      var totalWeight : Float = 0.0;
      for (inh in inhStore.vals()) { totalWeight += inh.weight };
      if (totalWeight > 0.0) {
        let updated = Buffer.Buffer<INH>(inhStore.size());
        for (inh in inhStore.vals()) {
          let share = Float.fromInt(cyclesThisEpoch) * inh.weight / totalWeight;
          let shareCycles = Int.abs(Float.toInt(share));
          updated.add({ key = inh.key; weight = inh.weight; cycles = inh.cycles + shareCycles; ts = inh.ts });
        };
        inhStore.clear();
        for (inh in updated.vals()) { inhStore.add(inh) };
      };

      // 4. Log COH
      let c : COH = {
        epc              = epcCount;
        order            = kuramotoOrder();
        spr              = spinRate;
        cyclesGenerated  = cyclesThisEpoch;
        ts               = Time.now();
      };
      cohLog.add(c);
      while (cohLog.size() > MAX_COH) { ignore cohLog.remove(0) };

      // 5. DIAG
      let d = runDiag();
      diagLog.add(d);
      while (diagLog.size() > MAX_DIE) { ignore diagLog.remove(0) };

      epcCount += 1;
    };
  };

}
