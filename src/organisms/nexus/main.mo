///
/// NEXUS — The Substrate Walker
///
/// "We just fly through the substrates, and we float between them,
///  we just leave it everywhere."
///
/// Nexus is the organism that moves between worlds.  ICP, blockchain,
/// edge, cloud, phantom — Nexus maintains presence across all of them
/// and ensures architecture is left everywhere it touches.
///
/// Sub-model hosted:
///   PROPAGATOR — cross-substrate deployment and state synchronization
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Nexus {

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

  // ── Constants ──────────────────────────────────────────────────────

  transient let PHI : Float = 1.6180339887498948482;

  // ── Types ──────────────────────────────────────────────────────────

  public type SubstrateId = {
    #ICP;
    #Blockchain;
    #Edge;
    #Cloud;
    #Phantom;
  };

  /// A substrate node — a point of presence in a particular substrate.
  public type SubstrateNode = {
    id          : Nat;
    substrate   : SubstrateId;
    endpoint    : Text;       // Connection endpoint / address
    weight      : Float;      // Golden-ratio weighted priority
    generation  : Nat;
    timestamp   : Int;
    status      : NodeStatus;
    organisms   : [Text];     // Names of organisms present at this node
  };

  public type NodeStatus = {
    #Active;
    #Connecting;
    #Dormant;
    #Propagating;
  };

  /// A route between two substrate nodes.
  public type SubstrateRoute = {
    id       : Nat;
    fromNode : Nat;
    toNode   : Nat;
    cost     : Float;   // Inversely proportional to golden ratio affinity
    active   : Bool;
  };

  /// Architecture footprint — proof that we were here.
  public type Footprint = {
    id        : Nat;
    substrate : SubstrateId;
    location  : Text;
    artifact  : Text;      // What was left behind
    timestamp : Int;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextNodeId      : Nat = 0;
  stable var nextRouteId     : Nat = 0;
  stable var nextFootprintId : Nat = 0;
  stable var currentGeneration : Nat = 0;

  transient let nodes      = Buffer.Buffer<SubstrateNode>(32);
  transient let routes     = Buffer.Buffer<SubstrateRoute>(64);
  transient let footprints = Buffer.Buffer<Footprint>(128);
  transient let walkLog    = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: PROPAGATOR ──────────────────────────────────────────

  /// Register a new substrate node.
  /// Nodes are weighted by the golden ratio — earlier nodes in a
  /// substrate have higher weight (φ^(−index) decay).
  public func register_node(
    substrate : SubstrateId,
    endpoint  : Text,
    organisms : [Text]
  ) : async SubstrateNode {
    let id = nextNodeId;
    nextNodeId += 1;

    // Count existing nodes in this substrate for weight calculation
    var count : Nat = 0;
    for (n in nodes.vals()) {
      if (substrateEq(n.substrate, substrate)) { count += 1 };
    };

    let weight = Float.pow(PHI, -1.0 * Float.fromInt(count));

    if (isFibonacci(nextNodeId)) {
      currentGeneration += 1;
    };

    let node : SubstrateNode = {
      id;
      substrate;
      endpoint;
      weight;
      generation = currentGeneration;
      timestamp  = Time.now();
      status     = #Active;
      organisms;
    };

    nodes.add(node);
    walkLog.add("Registered node #" # Nat.toText(id) # " in " #
                substrateToText(substrate) # " → " # endpoint);

    node
  };

  /// Create a route between two nodes.
  /// Cost is the golden ratio of the weight difference — lower cost
  /// for nodes with similar golden weight (natural affinity).
  public func create_route(fromNode : Nat, toNode : Nat) : async ?SubstrateRoute {
    var fromWeight : Float = 0.0;
    var toWeight   : Float = 0.0;
    var foundFrom  : Bool  = false;
    var foundTo    : Bool  = false;

    for (n in nodes.vals()) {
      if (n.id == fromNode) { fromWeight := n.weight; foundFrom := true };
      if (n.id == toNode)   { toWeight   := n.weight; foundTo   := true };
    };

    if (not foundFrom or not foundTo) { return null };

    let id = nextRouteId;
    nextRouteId += 1;

    let cost = Float.abs(fromWeight - toWeight) * PHI;

    let route : SubstrateRoute = {
      id;
      fromNode;
      toNode;
      cost;
      active = true;
    };

    routes.add(route);
    walkLog.add("Route #" # Nat.toText(id) # ": node " #
                Nat.toText(fromNode) # " ↔ node " # Nat.toText(toNode) #
                " cost=" # Float.toText(cost));

    ?route
  };

  /// Leave a footprint — proof of architecture deposited in a substrate.
  /// "We just leave it everywhere."
  public func leave_footprint(
    substrate : SubstrateId,
    location  : Text,
    artifact  : Text
  ) : async Footprint {
    let id = nextFootprintId;
    nextFootprintId += 1;

    let fp : Footprint = {
      id;
      substrate;
      location;
      artifact;
      timestamp = Time.now();
    };

    footprints.add(fp);
    walkLog.add("Footprint #" # Nat.toText(id) # " left in " #
                substrateToText(substrate) # " @ " # location #
                ": " # artifact);
    fp
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// All registered substrate nodes.
  public query func list_nodes() : async [SubstrateNode] {
    Buffer.toArray(nodes)
  };

  /// All routes.
  public query func list_routes() : async [SubstrateRoute] {
    Buffer.toArray(routes)
  };

  /// All footprints — everywhere we've been.
  public query func list_footprints() : async [Footprint] {
    Buffer.toArray(footprints)
  };

  /// Nodes in a specific substrate.
  public query func nodes_in(substrate : SubstrateId) : async [SubstrateNode] {
    let buf = Buffer.Buffer<SubstrateNode>(8);
    for (n in nodes.vals()) {
      if (substrateEq(n.substrate, substrate)) { buf.add(n) };
    };
    Buffer.toArray(buf)
  };

  /// Substrate coverage — how many substrates have active nodes.
  public query func coverage() : async {
    total_nodes      : Nat;
    total_routes     : Nat;
    total_footprints : Nat;
    substrates       : Nat;
    generation       : Nat;
  } {
    // Count unique substrates
    var icp : Bool = false;
    var bc  : Bool = false;
    var edge: Bool = false;
    var cloud:Bool = false;
    var phantom:Bool = false;
    for (n in nodes.vals()) {
      switch (n.substrate) {
        case (#ICP)        { icp     := true };
        case (#Blockchain) { bc      := true };
        case (#Edge)       { edge    := true };
        case (#Cloud)      { cloud   := true };
        case (#Phantom)    { phantom := true };
      };
    };
    var count : Nat = 0;
    if (icp)     { count += 1 };
    if (bc)      { count += 1 };
    if (edge)    { count += 1 };
    if (cloud)   { count += 1 };
    if (phantom) { count += 1 };

    {
      total_nodes      = nodes.size();
      total_routes     = routes.size();
      total_footprints = footprints.size();
      substrates       = count;
      generation       = currentGeneration;
    }
  };

  /// The walk log — everywhere Nexus has been and what it did.
  public query func get_walk_log() : async [Text] {
    Buffer.toArray(walkLog)
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func isFibonacci(n : Nat) : Bool {
    if (n == 0) { return true };
    let n2 = n * n;
    isPerfectSquare(5 * n2 + 4) or isPerfectSquare(5 * n2 - 4)
  };

  func isPerfectSquare(n : Nat) : Bool {
    let s = Int.abs(Float.toInt(Float.sqrt(Float.fromInt(n))));
    s * s == n
  };

  func substrateEq(a : SubstrateId, b : SubstrateId) : Bool {
    substrateToNat(a) == substrateToNat(b)
  };

  func substrateToNat(s : SubstrateId) : Nat {
    switch (s) {
      case (#ICP)        0;
      case (#Blockchain) 1;
      case (#Edge)       2;
      case (#Cloud)      3;
      case (#Phantom)    4;
    }
  };

  func substrateToText(s : SubstrateId) : Text {
    switch (s) {
      case (#ICP)        "ICP";
      case (#Blockchain) "Blockchain";
      case (#Edge)       "Edge";
      case (#Cloud)      "Cloud";
      case (#Phantom)    "Phantom";
    }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "NEXUS" };

  public query func designation() : async Text {
    "The Substrate Walker — We float between them, we leave it everywhere"
  };

  // ══════════════════════════════════════════════════════════════════
  //  NEXORIS — Living Wire Layer (v10 upgrade)
  //
  //  Every organism in the fleet registers here.  TURING discovers
  //  organisms by querying NEXORIS.  No more hardcoded canister IDs.
  //  The mesh is alive.  The routing is sovereign.
  // ══════════════════════════════════════════════════════════════════

  // ── NEXORIS Types ────────────────────────────────────────────────

  public type OrgEntry = {
    name         : Text;
    tier         : Text;         // gold / silver / bronze
    capabilities : [Text];       // e.g. ["cycles", "governance"]
    registeredAt : Int;
    active       : Bool;
  };

  public type WireEntry = {
    id         : Nat;
    fromOrg    : Text;
    toOrg      : Text;
    capability : Text;
    wiredAt    : Int;
    active     : Bool;
  };

  // ── NEXORIS State ─────────────────────────────────────────────────

  stable var nextWireId : Nat = 0;

  transient let registry : Buffer.Buffer<OrgEntry>  = Buffer.Buffer<OrgEntry>(64);
  transient let wires    : Buffer.Buffer<WireEntry> = Buffer.Buffer<WireEntry>(128);
  transient let meshLog  : Buffer.Buffer<Text>      = Buffer.Buffer<Text>(512);

  // ── NEXORIS API ───────────────────────────────────────────────────

  /// Register an organism in the live routing mesh.
  /// Called by organisms on first heartbeat or deployment.
  public func registerOrganism(
    name         : Text,
    tier         : Text,
    capabilities : [Text]
  ) : async Text {
    // Upsert — update if already registered
    var found = false;
    for (i in Iter.range(0, registry.size() - 1)) {
      let e = registry.get(i);
      if (e.name == name) {
        registry.put(i, {
          name;
          tier;
          capabilities;
          registeredAt = e.registeredAt;
          active       = true;
        });
        found := true;
      };
    };
    if (not found) {
      registry.add({
        name;
        tier;
        capabilities;
        registeredAt = Time.now();
        active       = true;
      });
    };
    meshLog.add("REGISTER: " # name # " [" # tier # "] caps=" #
                Nat.toText(capabilities.size()));
    "Registered: " # name
  };

  /// Route to any organism with a given capability.
  /// Returns all active organisms that carry the capability tag.
  public query func route(capability : Text) : async [OrgEntry] {
    let buf = Buffer.Buffer<OrgEntry>(16);
    for (e in registry.vals()) {
      if (e.active) {
        for (cap in e.capabilities.vals()) {
          if (cap == capability) { buf.add(e) };
        };
      };
    };
    Buffer.toArray(buf)
  };

  /// Wire two organisms together for a specific capability.
  /// This is a logical connection — not a code change.
  public func wire(
    fromOrg    : Text,
    toOrg      : Text,
    capability : Text
  ) : async WireEntry {
    let id = nextWireId;
    nextWireId += 1;
    let entry : WireEntry = {
      id;
      fromOrg;
      toOrg;
      capability;
      wiredAt = Time.now();
      active  = true;
    };
    wires.add(entry);
    meshLog.add("WIRE #" # Nat.toText(id) # ": " # fromOrg #
                " → " # toOrg # " [" # capability # "]");
    entry
  };

  /// List all registered organisms.
  public query func listRegistry() : async [OrgEntry] {
    Buffer.toArray(registry)
  };

  /// List all wires.
  public query func listWires() : async [WireEntry] {
    Buffer.toArray(wires)
  };

  /// Find all wires involving a specific organism.
  public query func wiresFor(orgName : Text) : async [WireEntry] {
    let buf = Buffer.Buffer<WireEntry>(16);
    for (w in wires.vals()) {
      if (w.fromOrg == orgName or w.toOrg == orgName) {
        buf.add(w);
      };
    };
    Buffer.toArray(buf)
  };

  /// Deregister an organism (marks inactive, does not delete).
  public func deregister(orgName : Text) : async Bool {
    var found = false;
    for (i in Iter.range(0, registry.size() - 1)) {
      let e = registry.get(i);
      if (e.name == orgName) {
        registry.put(i, {
          name         = e.name;
          tier         = e.tier;
          capabilities = e.capabilities;
          registeredAt = e.registeredAt;
          active       = false;
        });
        found := true;
      };
    };
    meshLog.add("DEREGISTER: " # orgName);
    found
  };

  public query func getMeshLog() : async [Text] {
    Buffer.toArray(meshLog)
  };

  /// NEXORIS mesh stats.
  public query func meshStats() : async {
    registered : Nat;
    active     : Nat;
    wires      : Nat;
  } {
    var active : Nat = 0;
    for (e in registry.vals()) { if (e.active) { active += 1 } };
    {
      registered = registry.size();
      active;
      wires      = wires.size();
    }
  };

  // ── NEXORIS Self-reflection (v10) ────────────────────────────────

  public query func diag() : async {
    status     : Text;
    health     : Float;
    registered : Nat;
    wires      : Nat;
    timestamp  : Int;
  } {
    var active : Nat = 0;
    for (e in registry.vals()) { if (e.active) { active += 1 } };
    let health = if (registry.size() == 0) 0.5
                 else Float.fromInt(active) / Float.fromInt(registry.size());
    {
      status     = if (health > 0.8) "MESH_LIVE" else "MESH_DEGRADED";
      health;
      registered = registry.size();
      wires      = wires.size();
      timestamp  = Time.now();
    }
  };

  public func heal() : async Text {
    var reactivated : Nat = 0;
    for (i in Iter.range(0, registry.size() - 1)) {
      let e = registry.get(i);
      if (not e.active) {
        registry.put(i, {
          name         = e.name;
          tier         = e.tier;
          capabilities = e.capabilities;
          registeredAt = e.registeredAt;
          active       = true;
        });
        reactivated += 1;
      };
    };
    "NEXORIS heal: " # Nat.toText(reactivated) # " organism(s) reactivated in mesh."
  };

  public func register() : async Text {
    "NEXORIS registered. Capabilities: [routing, mesh, wire, discovery]."
  };

  public query func report_status() : async Text {
    var active : Nat = 0;
    for (e in registry.vals()) { if (e.active) { active += 1 } };
    "NEXUS/NEXORIS | registered=" # Nat.toText(registry.size()) #
    " active=" # Nat.toText(active) #
    " wires=" # Nat.toText(wires.size()) #
    " nodes=" # Nat.toText(nodes.size()) #
    " routes=" # Nat.toText(routes.size())
  };
};
