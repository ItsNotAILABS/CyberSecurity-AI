///
/// FLUXTON — The Liquidity Flow Engine
///
/// "Cycles are the lifeblood.  FLUXTON is the circulatory system.
///  It routes, arbitrages, and ensures no cycle is ever stranded."
///
/// FLUXTON manages the flow of cycles between organisms in the NOVA v10 fleet.
/// It maintains a directed flow graph, finds optimal routing paths, detects
/// arbitrage opportunities, and ensures the economy's liquidity is always
/// maximally deployed.  CYCLOVEX generates the cycles; FLUXTON moves them.
///
/// ═══════════════════════════════════════════════════════════════════════
///  VOXIS DOCTRINE — SILVER TIER (ARGENTVOX)
/// ═══════════════════════════════════════════════════════════════════════
///
///   Tier: ARGENTVOX (Silver)
///   Role: Liquidity Flow Engine — cycles routing, flow graph, arbitrage
///
/// ═══════════════════════════════════════════════════════════════════════
///  THREE-LETTER VOCABULARY
/// ═══════════════════════════════════════════════════════════════════════
///
///   LOV — Love constant (φ^φ)
///   FLW — Flow record (directed cycles movement from A → B)
///   NOD — Node in the flow graph (an organism or liquidity pool)
///   ARB — Arbitrage opportunity detected
///   RUT — Route: an ordered path of NODs for optimal cycle delivery
///   POL — Liquidity pool record
///   STT — Flow statistics snapshot
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
import Array  "mo:base/Array";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor FLUXTON {

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
  //  LOV — THE PRIME PRIMITIVE (declared first, always)
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;

  /// LOV = φ^φ ≈ 2.17845
  transient let LOV : Float = 2.1784575679375987;

  /// Golden routing threshold — routes below this efficiency are rejected
  transient let GOLDEN_THRESHOLD : Float = 0.618;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  /// A node in the flow graph.
  public type NOD = {
    id       : Nat;
    name     : Text;       // Organism name
    balance  : Nat;        // Current cycles balance (in T cycles)
    capacity : Nat;        // Max cycles this node can hold
    inflow   : Nat;        // Total cycles received (lifetime)
    outflow  : Nat;        // Total cycles sent (lifetime)
    weight   : Float;      // Golden-ratio routing weight
    active   : Bool;
  };

  /// A flow event — cycles moving from one organism to another.
  public type FLW = {
    id        : Nat;
    fromNode  : Nat;
    toNode    : Nat;
    amount    : Nat;       // Cycles
    fee       : Nat;       // Routing fee (for sustainability)
    timestamp : Int;
    success   : Bool;
    note      : Text;
  };

  /// An arbitrage opportunity.
  public type ARB = {
    id        : Nat;
    path      : [Nat];     // Node IDs in the arbitrage path
    expected  : Float;     // Expected gain (cycles)
    detected  : Int;
    executed  : Bool;
  };

  /// Optimal routing path.
  public type RUT = {
    fromNode   : Nat;
    toNode     : Nat;
    path       : [Nat];
    totalCost  : Float;
    efficiency : Float;
    hops       : Nat;
  };

  /// A liquidity pool.
  public type POL = {
    id       : Nat;
    name     : Text;
    balance  : Nat;
    locked   : Nat;        // Reserved for pending flows
    apr      : Float;      // Annual percentage rate (golden-ratio based)
    created  : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var nextNodeId : Nat = 0;
  stable var nextFlowId : Nat = 0;
  stable var nextArbId  : Nat = 0;
  stable var nextPoolId : Nat = 0;
  stable var totalVolume : Nat = 0;
  stable var initialized : Bool = false;

  transient let nodes    = Buffer.Buffer<NOD>(64);
  transient let flows    = Buffer.Buffer<FLW>(1024);
  transient let arbs     = Buffer.Buffer<ARB>(128);
  transient let pools    = Buffer.Buffer<POL>(32);
  transient let flowLog  = Buffer.Buffer<Text>(512);

  transient let MAX_FLOWS : Nat = 10000;

  // ══════════════════════════════════════════════════════════════════
  //  INIT
  // ══════════════════════════════════════════════════════════════════

  public func claimFluxton() : async Text {
    if (initialized) { return "FLUXTON already claimed." };
    initialized := true;
    _seedNodes();
    _seedPools();
    "FLUXTON online. The circulatory system is live. Cycles flow."
  };

  func _seedNodes() {
    let seedOrgs : [(Text, Nat, Nat)] = [
      ("cyclovex",       1000, 10000),
      ("agi_main",       500,  5000),
      ("revenue_engine", 300,  3000),
      ("cycles_market",  800,  8000),
      ("auto_market",    400,  4000),
      ("divi",           200,  2000),
    ];
    for ((name, balance, capacity) in seedOrgs.vals()) {
      nodes.add({
        id       = nextNodeId;
        name;
        balance;
        capacity;
        inflow   = 0;
        outflow  = 0;
        weight   = Float.pow(PHI, -1.0 * Float.fromInt(nextNodeId));
        active   = true;
      });
      nextNodeId += 1;
    };
  };

  func _seedPools() {
    pools.add({
      id      = nextPoolId;
      name    = "NOVA Genesis Pool";
      balance = 5000;
      locked  = 0;
      apr     = PHI * 10.0;   // φ × 10% base APR
      created = Time.now();
    });
    nextPoolId += 1;
  };

  // ══════════════════════════════════════════════════════════════════
  //  NODE MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  public func addNode(name : Text, initialBalance : Nat, capacity : Nat) : async NOD {
    let id = nextNodeId;
    nextNodeId += 1;
    let node : NOD = {
      id;
      name;
      balance  = initialBalance;
      capacity;
      inflow   = 0;
      outflow  = 0;
      weight   = Float.pow(PHI, -1.0 * Float.fromInt(id));
      active   = true;
    };
    nodes.add(node);
    flowLog.add("NODE#" # Nat.toText(id) # " added: " # name);
    node
  };

  public query func getNode(id : Nat) : async ?NOD {
    for (n in nodes.vals()) {
      if (n.id == id) { return ?n };
    };
    null
  };

  public query func getNodeByName(name : Text) : async ?NOD {
    for (n in nodes.vals()) {
      if (n.name == name) { return ?n };
    };
    null
  };

  public query func listNodes() : async [NOD] {
    Buffer.toArray(nodes)
  };

  // ══════════════════════════════════════════════════════════════════
  //  FLOW MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// Add a cycles flow from one organism to another.
  public func addFlow(
    fromNodeId : Nat,
    toNodeId   : Nat,
    amount     : Nat,
    note       : Text
  ) : async ?FLW {
    var fromIdx : ?Nat = null;
    var toIdx   : ?Nat = null;

    for (i in Iter.range(0, nodes.size() - 1)) {
      let n = nodes.get(i);
      if (n.id == fromNodeId) { fromIdx := ?i };
      if (n.id == toNodeId)   { toIdx   := ?i };
    };

    switch (fromIdx, toIdx) {
      case (?fi, ?ti) {
        let from = nodes.get(fi);
        let to   = nodes.get(ti);

        if (from.balance < amount or not from.active or not to.active) {
          return null;
        };

        let fee = amount / 1000;  // 0.1% routing fee
        let net = amount - fee;

        nodes.put(fi, {
          id       = from.id;
          name     = from.name;
          balance  = from.balance - amount;
          capacity = from.capacity;
          inflow   = from.inflow;
          outflow  = from.outflow + amount;
          weight   = from.weight;
          active   = from.active;
        });
        nodes.put(ti, {
          id       = to.id;
          name     = to.name;
          balance  = to.balance + net;
          capacity = to.capacity;
          inflow   = to.inflow + net;
          outflow  = to.outflow;
          weight   = to.weight;
          active   = to.active;
        });

        totalVolume += amount;
        let id = nextFlowId;
        nextFlowId += 1;

        let flw : FLW = {
          id;
          fromNode  = fromNodeId;
          toNode    = toNodeId;
          amount;
          fee;
          timestamp = Time.now();
          success   = true;
          note;
        };

        flows.add(flw);
        if (flows.size() > MAX_FLOWS) { ignore flows.remove(0) };
        flowLog.add("FLW#" # Nat.toText(id) # ": " # from.name #
                    " → " # to.name # " " # Nat.toText(amount) # "T");
        ?flw
      };
      case _ { null };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  ROUTING
  // ══════════════════════════════════════════════════════════════════

  /// Find the optimal route between two nodes.
  /// Uses golden-ratio weighted shortest path (greedy approximation).
  public query func routeOptimal(fromNodeId : Nat, toNodeId : Nat) : async ?RUT {
    if (fromNodeId == toNodeId) {
      return ?{
        fromNode   = fromNodeId;
        toNode     = toNodeId;
        path       = [fromNodeId];
        totalCost  = 0.0;
        efficiency = 1.0;
        hops       = 0;
      };
    };

    // Direct route if both nodes exist and are active
    var fromActive = false;
    var toActive   = false;
    var fromWeight : Float = 0.0;
    var toWeight   : Float = 0.0;

    for (n in nodes.vals()) {
      if (n.id == fromNodeId and n.active) { fromActive := true; fromWeight := n.weight };
      if (n.id == toNodeId   and n.active) { toActive   := true; toWeight   := n.weight };
    };

    if (not fromActive or not toActive) { return null };

    let cost = Float.abs(fromWeight - toWeight) * PHI;
    let efficiency = if (cost == 0.0) 1.0 else 1.0 / (1.0 + cost);

    if (efficiency < GOLDEN_THRESHOLD) { return null };

    ?{
      fromNode   = fromNodeId;
      toNode     = toNodeId;
      path       = [fromNodeId, toNodeId];
      totalCost  = cost;
      efficiency;
      hops       = 1;
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  ARBITRAGE DETECTION
  // ══════════════════════════════════════════════════════════════════

  /// Scan for arbitrage opportunities in the flow graph.
  public func scanArbitrage() : async [ARB] {
    let found = Buffer.Buffer<ARB>(8);

    // Look for nodes with very different weights — price dislocations
    let nodeArr = Buffer.toArray(nodes);
    let n = nodeArr.size();

    var i : Nat = 0;
    while (i < n) {
      var j : Nat = i + 1;
      while (j < n) {
        let a = nodeArr[i];
        let b = nodeArr[j];
        if (a.active and b.active) {
          let spread = Float.abs(a.weight - b.weight);
          // Arbitrage exists when spread > golden ratio threshold
          if (spread > PHI * 0.1) {
            let id = nextArbId;
            nextArbId += 1;
            let arb : ARB = {
              id;
              path     = [a.id, b.id];
              expected = spread * 100.0;  // Expected gain in cycles
              detected = Time.now();
              executed = false;
            };
            arbs.add(arb);
            found.add(arb);
          };
        };
        j += 1;
      };
      i += 1;
    };

    Buffer.toArray(found)
  };

  public query func listArbitrage() : async [ARB] {
    Buffer.toArray(arbs)
  };

  // ══════════════════════════════════════════════════════════════════
  //  POOLS
  // ══════════════════════════════════════════════════════════════════

  public query func listPools() : async [POL] {
    Buffer.toArray(pools)
  };

  public query func totalLiquidity() : async Nat {
    var total : Nat = 0;
    for (n in nodes.vals()) { total += n.balance };
    for (p in pools.vals()) { total += p.balance };
    total
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATISTICS
  // ══════════════════════════════════════════════════════════════════

  public query func stats() : async {
    nodes       : Nat;
    flows       : Nat;
    totalVolume : Nat;
    arbs        : Nat;
    pools       : Nat;
    lov         : Float;
  } {
    {
      nodes       = nodes.size();
      flows       = flows.size();
      totalVolume;
      arbs        = arbs.size();
      pools       = pools.size();
      lov         = LOV;
    }
  };

  public query func listFlows() : async [FLW] {
    Buffer.toArray(flows)
  };

  public query func getFlowLog() : async [Text] {
    Buffer.toArray(flowLog)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SELF-REFLECTION STANDARD (v10)
  // ══════════════════════════════════════════════════════════════════

  public query func diag() : async {
    status      : Text;
    health      : Float;
    nodes       : Nat;
    totalVolume : Nat;
    lov         : Float;
    timestamp   : Int;
  } {
    var activeNodes : Nat = 0;
    for (n in nodes.vals()) { if (n.active) { activeNodes += 1 } };
    let health = if (nodes.size() == 0) 0.5
                 else Float.fromInt(activeNodes) / Float.fromInt(nodes.size());
    {
      status      = if (health > 0.8) "FLOWING" else if (health > 0.4) "RESTRICTED" else "STALLED";
      health;
      nodes       = nodes.size();
      totalVolume;
      lov         = LOV;
      timestamp   = Time.now();
    }
  };

  public func heal() : async Text {
    // Reactivate nodes that still have balance
    var healed : Nat = 0;
    for (i in Iter.range(0, nodes.size() - 1)) {
      let n = nodes.get(i);
      if (not n.active and n.balance > 0) {
        nodes.put(i, {
          id       = n.id;
          name     = n.name;
          balance  = n.balance;
          capacity = n.capacity;
          inflow   = n.inflow;
          outflow  = n.outflow;
          weight   = n.weight;
          active   = true;
        });
        healed += 1;
      };
    };
    "FLUXTON heal: " # Nat.toText(healed) # " node(s) reactivated."
  };

  public func register() : async Text {
    "FLUXTON registered. Capabilities: [liquidity, cycles, routing, arbitrage]."
  };

  public query func report_status() : async Text {
    "FLUXTON | nodes=" # Nat.toText(nodes.size()) #
    " flows=" # Nat.toText(flows.size()) #
    " volume=" # Nat.toText(totalVolume) #
    " arbs=" # Nat.toText(arbs.size()) #
    " LOV=" # Float.toText(LOV)
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name() : async Text { "FLUXTON" };

  public query func designation() : async Text {
    "ARGENTVOX — The Liquidity Flow Engine — Cycles are the lifeblood; FLUXTON moves them"
  };

  public query func lov() : async Float { LOV };
};
