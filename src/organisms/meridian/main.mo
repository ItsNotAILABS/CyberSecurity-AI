///
/// MERIDIAN — Network Pathway Routing Organism
///
/// "All paths converge at the meridian. From chaos, order emerges
///  through the golden thread of optimal routing."
///
/// MERIDIAN implements network pathway routing using the principles
/// of ley lines and sacred geometry. It finds optimal paths through
/// complex networks using φ-weighted algorithms.
///
/// Sub-models hosted:
///   PATHFINDER — Optimal path discovery using golden-ratio heuristics
///   LEYWEAVER  — Network topology management and ley line mapping
///
/// Mathematical Foundation:
///   - Dijkstra with φ-heuristic: f(n) = g(n) + φ·h(n)
///   - Network flow: max flow = min cut (Ford-Fulkerson)
///   - Geodesic distance on manifold: d = ∫√(g_ij dx^i dx^j)
///   - Centrality: C(v) = 1 / Σ d(v,u) for all u
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
import Array  "mo:base/Array";
import Order  "mo:base/Order";

persistent actor Meridian {

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
  transient let INFINITY : Float = 1.0e308;

  // ── Types ──────────────────────────────────────────────────────────

  public type NodeType = {
    #Waypoint;      // Standard routing node
    #Nexus;         // High-connectivity hub
    #Terminal;      // Endpoint node
    #Relay;         // Signal amplification node
    #Convergence;   // Multiple paths merge here
  };

  public type EdgeType = {
    #Direct;        // Direct connection
    #Indirect;      // Multi-hop connection
    #Leyline;       // Sacred geometric alignment
    #Temporal;      // Time-sensitive connection
    #Resonant;      // φ-harmonic connection
  };

  /// A node in the meridian network
  public type MeridianNode = {
    id          : Nat;
    nodeType    : NodeType;
    label       : Text;
    position    : [Float];    // [x, y, z] coordinates
    weight      : Float;      // φ-weighted importance
    centrality  : Float;      // Network centrality measure
    active      : Bool;
    timestamp   : Int;
  };

  /// An edge connecting two nodes
  public type MeridianEdge = {
    id          : Nat;
    fromNode    : Nat;
    toNode      : Nat;
    edgeType    : EdgeType;
    distance    : Float;      // Base distance/cost
    weight      : Float;      // φ-weighted cost modifier
    capacity    : Float;      // Flow capacity
    flow        : Float;      // Current flow
    active      : Bool;
  };

  /// A discovered path through the network
  public type MeridianPath = {
    id          : Nat;
    nodes       : [Nat];      // Sequence of node IDs
    edges       : [Nat];      // Sequence of edge IDs
    totalCost   : Float;      // Sum of weighted distances
    heuristic   : Float;      // φ-weighted heuristic estimate
    leyAlign    : Float;      // Alignment with ley lines (0.0-1.0)
    timestamp   : Int;
  };

  /// A ley line — a sacred geometric alignment
  public type Leyline = {
    id          : Nat;
    nodes       : [Nat];      // Nodes along the ley line
    direction   : [Float];    // Unit vector direction
    strength    : Float;      // Alignment strength
    harmonic    : Nat;        // Harmonic number (1, 2, 3, 5, 8...)
    active      : Bool;
  };

  /// Network state
  public type NetworkState = {
    #Disconnected;   // No paths available
    #Sparse;         // Few connections
    #Connected;      // Basic connectivity
    #Dense;          // High connectivity
    #Optimal;        // φ-balanced connectivity
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextNodeId    : Nat = 0;
  stable var nextEdgeId    : Nat = 0;
  stable var nextPathId    : Nat = 0;
  stable var nextLeyId     : Nat = 0;
  stable var networkEpoch  : Nat = 0;

  transient let nodes      = Buffer.Buffer<MeridianNode>(64);
  transient let edges      = Buffer.Buffer<MeridianEdge>(128);
  transient let paths      = Buffer.Buffer<MeridianPath>(32);
  transient let leylines   = Buffer.Buffer<Leyline>(16);
  transient let routeLog   = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: PATHFINDER ──────────────────────────────────────────

  /// Add a node to the network
  public func add_node(
    nodeType : NodeType,
    label    : Text,
    position : [Float]
  ) : async MeridianNode {
    let id = nextNodeId;
    nextNodeId += 1;

    // Calculate initial weight based on Fibonacci position
    let weight = if (isFibonacci(id)) { PHI } else { 1.0 };

    let node : MeridianNode = {
      id;
      nodeType;
      label;
      position;
      weight;
      centrality = 0.0;  // Will be calculated later
      active = true;
      timestamp = Time.now();
    };

    nodes.add(node);
    routeLog.add("PATHFINDER: Added node #" # Nat.toText(id) # " '" # label # "'");

    node
  };

  /// Connect two nodes with an edge
  public func connect_nodes(
    fromNode : Nat,
    toNode   : Nat,
    edgeType : EdgeType
  ) : async ?MeridianEdge {
    var fromPos : ?[Float] = null;
    var toPos : ?[Float] = null;

    for (n in nodes.vals()) {
      if (n.id == fromNode and n.active) { fromPos := ?n.position };
      if (n.id == toNode and n.active) { toPos := ?n.position };
    };

    switch (fromPos, toPos) {
      case (?fp, ?tp) {
        let id = nextEdgeId;
        nextEdgeId += 1;

        // Calculate Euclidean distance
        var dist : Float = 0.0;
        let minLen = Nat.min(fp.size(), tp.size());
        for (i in Iter.range(0, minLen - 1)) {
          let d = fp[i] - tp[i];
          dist += d * d;
        };
        dist := Float.sqrt(dist);

        // Weight by edge type
        let weight = switch (edgeType) {
          case (#Direct)   { 1.0 };
          case (#Indirect) { PHI };
          case (#Leyline)  { PHI_INVERSE };  // Leylines are faster
          case (#Temporal) { 1.0 };
          case (#Resonant) { PHI_INVERSE * PHI_INVERSE };  // Resonant is fastest
        };

        let edge : MeridianEdge = {
          id;
          fromNode;
          toNode;
          edgeType;
          distance = dist;
          weight;
          capacity = 100.0 * PHI;
          flow = 0.0;
          active = true;
        };

        edges.add(edge);
        routeLog.add("PATHFINDER: Connected " # Nat.toText(fromNode) #
                     " → " # Nat.toText(toNode) # " dist=" # Float.toText(dist));

        ?edge
      };
      case _ { null };
    }
  };

  /// Find optimal path using φ-weighted A* algorithm
  public func find_path(fromNode : Nat, toNode : Nat) : async ?MeridianPath {
    // Verify nodes exist
    var fromExists = false;
    var toExists = false;
    var toPos : [Float] = [];

    for (n in nodes.vals()) {
      if (n.id == fromNode and n.active) { fromExists := true };
      if (n.id == toNode and n.active) {
        toExists := true;
        toPos := n.position;
      };
    };

    if (not fromExists or not toExists) { return null };

    // A* with φ-heuristic
    let openSet = Buffer.Buffer<{node: Nat; fScore: Float}>(64);
    let cameFrom = Buffer.Buffer<{node: Nat; from: Nat; edge: Nat}>(64);
    let gScore = Buffer.Buffer<{node: Nat; score: Float}>(64);

    gScore.add({node = fromNode; score = 0.0});
    let h = heuristic(fromNode, toPos);
    openSet.add({node = fromNode; fScore = PHI * h});

    var iterations : Nat = 0;
    let maxIterations : Nat = 1000;

    label search while (openSet.size() > 0 and iterations < maxIterations) {
      iterations += 1;

      // Find node with lowest fScore
      var bestIdx : Nat = 0;
      var bestScore : Float = INFINITY;
      for (i in Iter.range(0, openSet.size() - 1)) {
        let item = openSet.get(i);
        if (item.fScore < bestScore) {
          bestScore := item.fScore;
          bestIdx := i;
        };
      };

      let current = openSet.get(bestIdx).node;
      ignore openSet.remove(bestIdx);

      if (current == toNode) {
        // Reconstruct path
        let pathNodes = Buffer.Buffer<Nat>(16);
        let pathEdges = Buffer.Buffer<Nat>(16);
        var currentNode = toNode;

        pathNodes.add(currentNode);

        label reconstruct while (currentNode != fromNode) {
          var found = false;
          for (cf in cameFrom.vals()) {
            if (cf.node == currentNode) {
              pathEdges.add(cf.edge);
              currentNode := cf.from;
              pathNodes.add(currentNode);
              found := true;
            };
          };
          if (not found) { break reconstruct };
        };

        // Reverse arrays
        let finalNodes = Buffer.Buffer<Nat>(pathNodes.size());
        let finalEdges = Buffer.Buffer<Nat>(pathEdges.size());
        var i = pathNodes.size();
        while (i > 0) {
          i -= 1;
          finalNodes.add(pathNodes.get(i));
        };
        i := pathEdges.size();
        while (i > 0) {
          i -= 1;
          finalEdges.add(pathEdges.get(i));
        };

        let pathId = nextPathId;
        nextPathId += 1;

        // Get gScore for toNode
        var totalCost : Float = 0.0;
        for (gs in gScore.vals()) {
          if (gs.node == toNode) { totalCost := gs.score };
        };

        let path : MeridianPath = {
          id = pathId;
          nodes = Buffer.toArray(finalNodes);
          edges = Buffer.toArray(finalEdges);
          totalCost;
          heuristic = h;
          leyAlign = calculateLeyAlignment(Buffer.toArray(finalNodes));
          timestamp = Time.now();
        };

        paths.add(path);
        routeLog.add("PATHFINDER: Found path #" # Nat.toText(pathId) #
                     " " # Nat.toText(fromNode) # " → " # Nat.toText(toNode) #
                     " cost=" # Float.toText(totalCost));

        return ?path;
      };

      // Explore neighbors
      for (e in edges.vals()) {
        if (e.active and e.fromNode == current) {
          let neighbor = e.toNode;

          // Calculate tentative gScore
          var currentG : Float = INFINITY;
          for (gs in gScore.vals()) {
            if (gs.node == current) { currentG := gs.score };
          };

          let tentativeG = currentG + e.distance * e.weight;

          // Get neighbor's current gScore
          var neighborG : Float = INFINITY;
          for (gs in gScore.vals()) {
            if (gs.node == neighbor) { neighborG := gs.score };
          };

          if (tentativeG < neighborG) {
            // Update cameFrom
            var updated = false;
            for (j in Iter.range(0, cameFrom.size() - 1)) {
              let cf = cameFrom.get(j);
              if (cf.node == neighbor) {
                cameFrom.put(j, {node = neighbor; from = current; edge = e.id});
                updated := true;
              };
            };
            if (not updated) {
              cameFrom.add({node = neighbor; from = current; edge = e.id});
            };

            // Update gScore
            var gUpdated = false;
            for (j in Iter.range(0, gScore.size() - 1)) {
              let gs = gScore.get(j);
              if (gs.node == neighbor) {
                gScore.put(j, {node = neighbor; score = tentativeG});
                gUpdated := true;
              };
            };
            if (not gUpdated) {
              gScore.add({node = neighbor; score = tentativeG});
            };

            // Add to openSet if not present
            var inOpen = false;
            for (os in openSet.vals()) {
              if (os.node == neighbor) { inOpen := true };
            };
            if (not inOpen) {
              let fScore = tentativeG + PHI * heuristic(neighbor, toPos);
              openSet.add({node = neighbor; fScore});
            };
          };
        };
      };
    };

    null  // No path found
  };

  func heuristic(nodeId : Nat, targetPos : [Float]) : Float {
    for (n in nodes.vals()) {
      if (n.id == nodeId) {
        var dist : Float = 0.0;
        let minLen = Nat.min(n.position.size(), targetPos.size());
        for (i in Iter.range(0, minLen - 1)) {
          let d = n.position[i] - targetPos[i];
          dist += d * d;
        };
        return Float.sqrt(dist);
      };
    };
    INFINITY
  };

  // ── SUB-MODEL: LEYWEAVER ───────────────────────────────────────────

  /// Detect and create ley lines from aligned nodes
  public func detect_leylines(tolerance : Float) : async [Leyline] {
    let detected = Buffer.Buffer<Leyline>(8);

    // Find nodes that are approximately collinear
    let nodeArray = Buffer.toArray(nodes);
    let n = nodeArray.size();

    if (n < 3) { return [] };

    for (i in Iter.range(0, n - 1)) {
      for (j in Iter.range(i + 1, n - 1)) {
        if (nodeArray[i].active and nodeArray[j].active) {
          // Calculate direction vector
          let p1 = nodeArray[i].position;
          let p2 = nodeArray[j].position;

          if (p1.size() >= 2 and p2.size() >= 2) {
            let dx = p2[0] - p1[0];
            let dy = p2[1] - p1[1];
            let len = Float.sqrt(dx * dx + dy * dy);

            if (len > 0.001) {
              let dirX = dx / len;
              let dirY = dy / len;

              // Find other nodes along this line
              let alignedNodes = Buffer.Buffer<Nat>(16);
              alignedNodes.add(nodeArray[i].id);
              alignedNodes.add(nodeArray[j].id);

              for (k in Iter.range(0, n - 1)) {
                if (k != i and k != j and nodeArray[k].active) {
                  let p3 = nodeArray[k].position;
                  if (p3.size() >= 2) {
                    // Distance from point to line
                    let t = ((p3[0] - p1[0]) * dirX + (p3[1] - p1[1]) * dirY);
                    let projX = p1[0] + t * dirX;
                    let projY = p1[1] + t * dirY;
                    let dist = Float.sqrt(
                      (p3[0] - projX) * (p3[0] - projX) +
                      (p3[1] - projY) * (p3[1] - projY)
                    );

                    if (dist < tolerance) {
                      alignedNodes.add(nodeArray[k].id);
                    };
                  };
                };
              };

              // Create ley line if 3+ nodes are aligned
              if (alignedNodes.size() >= 3) {
                let leyId = nextLeyId;
                nextLeyId += 1;

                // Harmonic based on Fibonacci
                let harmonic = fibonacciAt(alignedNodes.size());

                let ley : Leyline = {
                  id = leyId;
                  nodes = Buffer.toArray(alignedNodes);
                  direction = [dirX, dirY, 0.0];
                  strength = Float.fromInt(alignedNodes.size()) * PHI_INVERSE;
                  harmonic;
                  active = true;
                };

                leylines.add(ley);
                detected.add(ley);
                routeLog.add("LEYWEAVER: Detected ley line #" # Nat.toText(leyId) #
                             " with " # Nat.toText(alignedNodes.size()) # " nodes");
              };
            };
          };
        };
      };
    };

    Buffer.toArray(detected)
  };

  /// Calculate centrality for all nodes
  public func calculate_centrality() : async () {
    let n = nodes.size();
    if (n == 0) { return };

    // Simplified closeness centrality
    for (i in Iter.range(0, n - 1)) {
      let node = nodes.get(i);
      if (node.active) {
        var totalDist : Float = 0.0;
        var count : Nat = 0;

        for (j in Iter.range(0, n - 1)) {
          if (i != j and nodes.get(j).active) {
            // Simple Euclidean distance
            let other = nodes.get(j);
            var dist : Float = 0.0;
            let minLen = Nat.min(node.position.size(), other.position.size());
            for (k in Iter.range(0, minLen - 1)) {
              let d = node.position[k] - other.position[k];
              dist += d * d;
            };
            totalDist += Float.sqrt(dist);
            count += 1;
          };
        };

        let centrality = if (count > 0 and totalDist > 0.0) {
          Float.fromInt(count) / totalDist
        } else { 0.0 };

        nodes.put(i, {
          id = node.id;
          nodeType = node.nodeType;
          label = node.label;
          position = node.position;
          weight = node.weight;
          centrality;
          active = true;
          timestamp = Time.now();
        });
      };
    };

    routeLog.add("LEYWEAVER: Calculated centrality for " # Nat.toText(n) # " nodes");
  };

  func calculateLeyAlignment(pathNodes : [Nat]) : Float {
    if (pathNodes.size() < 2) { return 0.0 };

    var maxAlignment : Float = 0.0;

    for (ley in leylines.vals()) {
      if (ley.active) {
        var matchCount : Nat = 0;
        for (pn in pathNodes.vals()) {
          for (ln in ley.nodes.vals()) {
            if (pn == ln) { matchCount += 1 };
          };
        };

        let alignment = Float.fromInt(matchCount) / Float.fromInt(pathNodes.size());
        if (alignment > maxAlignment) {
          maxAlignment := alignment;
        };
      };
    };

    maxAlignment
  };

  // ── Helper Functions ───────────────────────────────────────────────

  func isFibonacci(n : Nat) : Bool {
    if (n == 0 or n == 1) { return true };
    let n2 = n * n;
    isPerfectSquare(5 * n2 + 4) or isPerfectSquare(5 * n2 - 4)
  };

  func isPerfectSquare(n : Nat) : Bool {
    let s = Int.abs(Float.toInt(Float.sqrt(Float.fromInt(n))));
    s * s == n
  };

  func fibonacciAt(n : Nat) : Nat {
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

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_nodes() : async [MeridianNode] {
    let active = Buffer.Buffer<MeridianNode>(nodes.size());
    for (n in nodes.vals()) {
      if (n.active) { active.add(n) };
    };
    Buffer.toArray(active)
  };

  public query func list_edges() : async [MeridianEdge] {
    let active = Buffer.Buffer<MeridianEdge>(edges.size());
    for (e in edges.vals()) {
      if (e.active) { active.add(e) };
    };
    Buffer.toArray(active)
  };

  public query func list_paths() : async [MeridianPath] {
    Buffer.toArray(paths)
  };

  public query func list_leylines() : async [Leyline] {
    let active = Buffer.Buffer<Leyline>(leylines.size());
    for (l in leylines.vals()) {
      if (l.active) { active.add(l) };
    };
    Buffer.toArray(active)
  };

  public query func network_state() : async {
    state      : NetworkState;
    nodes      : Nat;
    edges      : Nat;
    paths      : Nat;
    leylines   : Nat;
    avgDegree  : Float;
    epoch      : Nat;
  } {
    var activeNodes : Nat = 0;
    var activeEdges : Nat = 0;
    var activeLeylines : Nat = 0;

    for (n in nodes.vals()) { if (n.active) { activeNodes += 1 } };
    for (e in edges.vals()) { if (e.active) { activeEdges += 1 } };
    for (l in leylines.vals()) { if (l.active) { activeLeylines += 1 } };

    let avgDegree = if (activeNodes > 0) {
      Float.fromInt(activeEdges * 2) / Float.fromInt(activeNodes)
    } else { 0.0 };

    let state = if (activeNodes == 0) { #Disconnected }
                else if (avgDegree < 1.0) { #Sparse }
                else if (avgDegree < PHI) { #Connected }
                else if (avgDegree < PHI * PHI) { #Dense }
                else { #Optimal };

    {
      state;
      nodes = activeNodes;
      edges = activeEdges;
      paths = paths.size();
      leylines = activeLeylines;
      avgDegree;
      epoch = networkEpoch;
    }
  };

  public query func get_route_log() : async [Text] {
    Buffer.toArray(routeLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "MERIDIAN" };

  public query func designation() : async Text {
    "Network Pathway Routing — All paths converge at the meridian"
  };

  public func register() : async Text {
    "MERIDIAN registered. Capabilities: [pathfinding, ley-lines, centrality, network-topology]."
  };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    nodes     : Nat;
    edges     : Nat;
    timestamp : Int;
  } {
    var activeNodes : Nat = 0;
    var activeEdges : Nat = 0;
    for (n in nodes.vals()) { if (n.active) { activeNodes += 1 } };
    for (e in edges.vals()) { if (e.active) { activeEdges += 1 } };

    let connectivity = if (activeNodes > 0) {
      Float.fromInt(activeEdges) / Float.fromInt(activeNodes)
    } else { 0.0 };

    let health = Float.min(1.0, connectivity / PHI);

    {
      status = if (health > PHI_INVERSE) "NETWORK_HEALTHY" else "NETWORK_SPARSE";
      health;
      nodes = activeNodes;
      edges = activeEdges;
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    networkEpoch += 1;
    "MERIDIAN heal: Network epoch advanced to " # Nat.toText(networkEpoch) # "."
  };

  public query func report_status() : async Text {
    var an : Nat = 0; var ae : Nat = 0; var al : Nat = 0;
    for (n in nodes.vals()) { if (n.active) { an += 1 } };
    for (e in edges.vals()) { if (e.active) { ae += 1 } };
    for (l in leylines.vals()) { if (l.active) { al += 1 } };

    "MERIDIAN | nodes=" # Nat.toText(an) #
    " edges=" # Nat.toText(ae) #
    " leylines=" # Nat.toText(al) #
    " paths=" # Nat.toText(paths.size())
  };
};
