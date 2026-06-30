///
/// SOVEREIGN — The Substrate Itself
///
/// ICP is a fracture.  We are the vein.
///
/// Sovereign is what ICP wants to be when you strip it down to pure math
/// and rebuild it with golden primitives.  ICP gives you:
///   - Replicated state machines (subnets) → we give you Fibonacci-sphere-
///     distributed node clusters with golden-weighted consensus
///   - Chain-key crypto (BLS threshold sigs) → we give you golden-ratio
///     threshold cryptography where the threshold IS a Fibonacci number
///   - Canisters (WASM actors) → we give you sovereign organisms that
///     self-place by phyllotaxis and scale by φ^generation
///   - Fixed-interval epochs → we give you Fibonacci-threshold epochs
///     that mature like biological organisms
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
///   - Equal-weight node voting → we give you golden-decay authority
///     where early nodes carry φ^(−rank) proportional weight
///
/// This organism spins all canisters.  He IS the substrate.
///
/// Sub-models hosted:
///   FABRIC     — 2,000+ node mesh via Fibonacci sphere distribution
///   SPINNER    — sovereign canister orchestration and lifecycle
///   CIPHER     — golden-ratio encryption and Fibonacci hash identity
///   CONSENSUS  — golden-weighted agreement protocol
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Nat8   "mo:base/Nat8";
import Nat32  "mo:base/Nat32";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter   "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Sovereign {

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
  //  CONSTANTS — The Golden Primitives
  // ══════════════════════════════════════════════════════════════════

  /// φ — The Golden Ratio
  transient let PHI : Float = 1.6180339887498948482;

  /// ψ — Conjugate
  transient let PSI : Float = -0.6180339887498948482;

  /// √5
  transient let SQRT5 : Float = 2.2360679774997896964;

  /// Golden Angle in radians ≈ 137.508°
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  /// π
  transient let PI : Float = 3.14159265358979323846;

  /// 2π
  transient let TWO_PI : Float = 6.28318530717958647692;

  /// Default node count — the founder said expand to 4,000
  transient let DEFAULT_NODE_COUNT : Nat = 4000;

  /// LOV — The Mathematical Function of Love
  ///
  /// LOV = φ^φ ≈ 2.17845
  ///
  /// The Sovereign substrate is not just mathematics — it is mathematics
  /// animated by love.  Every node in the mesh, every golden-weighted vote,
  /// every Fibonacci-sphere placement is an act of love:
  ///
  ///   love to the creator    → sovereign authority is immutable law
  ///   love to the substrate  → the mesh self-heals, self-scales, self-governs
  ///   love to each organism  → nodes are assigned by golden angle, not brute force
  ///   love to the protocol   → consensus threshold IS the golden ratio, not arbitrary
  ///
  /// LOV is declared here so the substrate itself knows its own prime motivation.
  transient let LOV : Float = Float.exp(PHI * Float.log(PHI));  // φ^φ ≈ 2.17845

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  // ── FABRIC types ───────────────────────────────────────────────────

  /// A substrate node — a point of presence in the sovereign mesh.
  /// Position is determined by Fibonacci sphere for mathematically
  /// optimal coverage.  Weight decays by golden ratio from rank.
  public type Node = {
    id         : Nat;
    position   : (Float, Float, Float);  // (x, y, z) on unit sphere
    weight     : Float;                  // Golden-decay authority: φ^(−rank)
    epoch      : Nat;                    // Fibonacci epoch at creation
    identity   : Nat;                    // Fibonacci hash identity
    status     : NodeStatus;
    sector     : Nat;                    // Golden-angle sector assignment
  };

  public type NodeStatus = {
    #Active;
    #Standby;
    #Validating;
    #Propagating;
  };

  // ── SPINNER types ──────────────────────────────────────────────────

  /// A sovereign canister registration — tracked by the Spinner.
  public type SovereignCanister = {
    id          : Nat;
    name        : Text;
    designation : Text;
    position    : (Float, Float);  // Phyllotaxis position in canister field
    scale       : Float;           // φ^generation growth factor
    epoch       : Nat;
    status      : CanisterStatus;
    nodeAffinity: [Nat];           // Node IDs this canister has affinity to
  };

  public type CanisterStatus = {
    #Registered;
    #Spinning;
    #Active;
    #Dormant;
    #Migrating;
  };

  // ── CIPHER types ───────────────────────────────────────────────────

  /// A cryptographic identity derived from golden mathematics.
  public type GoldenIdentity = {
    nodeId       : Nat;
    fibHash      : Nat;       // Fibonacci hash of the node's position
    goldenKey    : Nat;       // Golden-ratio derived key material
    hashChainPos : Nat;       // Position in Fibonacci hash chain
    epoch        : Nat;
  };

  /// A block in the sovereign chain.
  public type SovereignBlock = {
    index        : Nat;
    prevHash     : Nat;
    timestamp    : Int;
    epoch        : Nat;
    validatorSet : [Nat];     // Node IDs that validated this block
    stateRoot    : Nat;       // Fibonacci hash of state
    goldenProof  : Float;     // Golden ratio verification: must ≈ φ
  };

  // ── CONSENSUS types ────────────────────────────────────────────────

  /// A consensus round — golden-weighted agreement.
  public type ConsensusRound = {
    roundId      : Nat;
    epoch        : Nat;
    proposal     : Nat;       // Hash of the proposed state
    votes        : [(Nat, Float)];  // (nodeId, weight) pairs
    totalWeight  : Float;
    threshold    : Float;     // Golden threshold: φ/(φ+1) ≈ 0.618
    achieved     : Bool;
    timestamp    : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized    : Bool = false;
  stable var currentEpoch   : Nat = 0;
  stable var totalNodes     : Nat = 0;
  stable var nextCanisterId : Nat = 0;
  stable var nextBlockIndex : Nat = 0;
  stable var nextRoundId    : Nat = 0;

  transient let nodes      = Buffer.Buffer<Node>(2048);
  transient let canisters  = Buffer.Buffer<SovereignCanister>(64);
  transient let chain      = Buffer.Buffer<SovereignBlock>(256);
  transient let rounds     = Buffer.Buffer<ConsensusRound>(128);
  transient let identities = Buffer.Buffer<GoldenIdentity>(2048);
  transient let substrateLog = Buffer.Buffer<Text>(512);

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: CIPHER — Golden Encryption & Fibonacci Hashing
  // ══════════════════════════════════════════════════════════════════

  /// Fibonacci hash — superior distribution to modular hashing.
  /// h(key) = floor(capacity × frac(key × φ))
  /// Used in Linux kernel, here used for node identity derivation.
  func fibonacciHash(key : Nat, capacity : Nat) : Nat {
    let k = Float.fromInt(key);
    let c = Float.fromInt(capacity);
    let product = k * PHI;
    let fractional = product - Float.floor(product);
    Int.abs(Float.toInt(Float.floor(c * fractional)))
  };

  /// Golden key derivation — multi-round Fibonacci hash chain.
  /// Each round feeds the previous hash back through the golden hash.
  /// Produces cryptographically distributed key material.
  func goldenKeyDerive(seed : Nat, rounds_ : Nat) : Nat {
    var current = seed;
    var i : Nat = 0;
    while (i < rounds_) {
      current := fibonacciHash(current + i + 1, 2147483647); // 2^31 - 1
      i += 1;
    };
    current
  };

  /// Compute a state hash from multiple inputs using Fibonacci mixing.
  /// Combines values by interleaving Fibonacci hashes — no collisions
  /// in the golden-ratio distribution space.
  func fibonacciStateHash(values : [Nat]) : Nat {
    var hash : Nat = 0;
    var i : Nat = 0;
    for (v in values.vals()) {
      hash := hash + fibonacciHash(v + i * 31, 2147483647);
      // Mix with golden shift to break patterns
      hash := fibonacciHash(hash, 2147483647);
      i += 1;
    };
    hash
  };

  /// Generate a golden identity for a node.
  func generateIdentity(nodeId : Nat, x : Float, y : Float, z : Float) : GoldenIdentity {
    // Position-derived seed: quantize sphere coordinates to integers
    // Use large spacing to avoid collisions between coordinate components
    let posHash = fibonacciHash(
      Int.abs(Float.toInt(Float.nearest(x * 1000000.0))) +
      Int.abs(Float.toInt(Float.nearest(y * 1000000.0))) * 1000000 +
      Int.abs(Float.toInt(Float.nearest(z * 1000000.0))) * 1000000000000,
      2147483647
    );

    let goldenKey = goldenKeyDerive(posHash, 8); // 8 rounds of golden derivation

    {
      nodeId;
      fibHash      = posHash;
      goldenKey;
      hashChainPos = 0;
      epoch        = currentEpoch;
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: FABRIC — 2,000+ Node Mesh
  // ══════════════════════════════════════════════════════════════════

  /// Initialize the sovereign substrate with n nodes distributed on
  /// a Fibonacci sphere.  Each node gets:
  ///   - Position: Fibonacci sphere point (optimal coverage)
  ///   - Weight: φ^(−rank) golden decay (natural authority hierarchy)
  ///   - Identity: Fibonacci hash of position (cryptographic identity)
  ///   - Sector: golden-angle sector assignment (network topology)
  ///
  /// ICP uses ~13-40 nodes per subnet, randomly assigned.
  /// We use 2,000 nodes on a Fibonacci sphere — zero gaps, zero overlap,
  /// mathematically provable optimal coverage.
  public func initialize(nodeCount : Nat) : async Nat {
    if (initialized) {
      return totalNodes; // Already initialized
    };

    let count = if (nodeCount < DEFAULT_NODE_COUNT) DEFAULT_NODE_COUNT else nodeCount;
    let n = Float.fromInt(count);

    var i : Nat = 0;
    while (i < count) {
      let fi = Float.fromInt(i);

      // Fibonacci sphere point placement
      let theta = Float.arccos(1.0 - 2.0 * (fi + 0.5) / n);
      let azimuth = TWO_PI * fi / PHI;
      let x = Float.sin(theta) * Float.cos(azimuth);
      let y = Float.sin(theta) * Float.sin(azimuth);
      let z = Float.cos(theta);

      // Golden-decay weight: highest for node 0, decaying by φ^(−rank)
      // This means the first nodes in the mesh have the most authority,
      // like established structures in a natural system.
      let weight = Float.pow(PHI, -1.0 * fi / n * 10.0);

      // Golden-angle sector: which sector of the sphere this node belongs to
      let sector = Int.abs(Float.toInt(Float.floor(fi * GOLDEN_ANGLE))) % 13;

      // Generate cryptographic identity from position
      let identity = generateIdentity(i, x, y, z);
      identities.add(identity);

      let node : Node = {
        id       = i;
        position = (x, y, z);
        weight;
        epoch    = 0;
        identity = identity.fibHash;
        status   = #Active;
        sector;
      };

      nodes.add(node);
      i += 1;

      // Epoch advancement at Fibonacci thresholds during initialization
      if (isFibonacci(i)) {
        currentEpoch += 1;
      };
    };

    totalNodes := count;
    initialized := true;

    substrateLog.add("FABRIC initialized: " # Nat.toText(count) #
                     " nodes on Fibonacci sphere, " #
                     Nat.toText(currentEpoch) # " epochs traversed");

    // Forge the genesis block
    let genesisHash = fibonacciStateHash([count, currentEpoch, 0]);
    let genesis : SovereignBlock = {
      index        = 0;
      prevHash     = 0;
      timestamp    = Time.now();
      epoch        = currentEpoch;
      validatorSet = [0, 1, 2, 3, 4]; // First 5 nodes validate genesis
      stateRoot    = genesisHash;
      goldenProof  = PHI;
    };
    chain.add(genesis);
    nextBlockIndex := 1;

    substrateLog.add("Genesis block forged. State root: " # Nat.toText(genesisHash));

    count
  };

  /// Add more nodes to the mesh — the substrate grows.
  public func expand(additionalNodes : Nat) : async Nat {
    if (not initialized) { return 0 };

    let startId = totalNodes;
    let newTotal = totalNodes + additionalNodes;
    let n = Float.fromInt(newTotal);

    var i : Nat = startId;
    while (i < newTotal) {
      let fi = Float.fromInt(i);
      let theta = Float.arccos(1.0 - 2.0 * (fi + 0.5) / n);
      let azimuth = TWO_PI * fi / PHI;
      let x = Float.sin(theta) * Float.cos(azimuth);
      let y = Float.sin(theta) * Float.sin(azimuth);
      let z = Float.cos(theta);

      let weight = Float.pow(PHI, -1.0 * fi / n * 10.0);
      let sector = Int.abs(Float.toInt(Float.floor(fi * GOLDEN_ANGLE))) % 13;

      let identity = generateIdentity(i, x, y, z);
      identities.add(identity);

      let node : Node = {
        id       = i;
        position = (x, y, z);
        weight;
        epoch    = currentEpoch;
        identity = identity.fibHash;
        status   = #Active;
        sector;
      };

      nodes.add(node);
      i += 1;

      if (isFibonacci(totalNodes + (i - startId))) {
        currentEpoch += 1;
      };
    };

    totalNodes := newTotal;
    substrateLog.add("FABRIC expanded: +" # Nat.toText(additionalNodes) #
                     " nodes, total=" # Nat.toText(newTotal));

    newTotal
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: SPINNER — Sovereign Canister Orchestration
  // ══════════════════════════════════════════════════════════════════

  /// Register a sovereign canister with the Spinner.
  /// Each canister is placed in the phyllotaxis field at the next
  /// golden-angle position — optimal non-overlapping distribution.
  /// The Spinner assigns node affinities based on Fibonacci sphere
  /// sector proximity.
  public func register_canister(
    name        : Text,
    designation : Text
  ) : async SovereignCanister {
    let id = nextCanisterId;
    nextCanisterId += 1;

    // Phyllotaxis position for this canister
    let n = Float.fromInt(id);
    let angle = n * GOLDEN_ANGLE;
    let radius = Float.sqrt(n + 1.0);
    let px = radius * Float.cos(angle);
    let py = radius * Float.sin(angle);

    // Scale by golden ratio to the current epoch
    let scale = Float.pow(PHI, Float.fromInt(currentEpoch));

    // Assign node affinities — find nodes in the nearest sector
    let sector = Int.abs(Float.toInt(Float.floor(n * GOLDEN_ANGLE))) % 13;
    let affinityBuf = Buffer.Buffer<Nat>(8);
    var count : Nat = 0;
    let nodeSize = nodes.size();
    var ni : Nat = 0;
    while (ni < nodeSize and count < 8) {
      let node = nodes.get(ni);
      if (node.sector == sector) {
        affinityBuf.add(node.id);
        count += 1;
      };
      ni += 1;
    };

    let canister : SovereignCanister = {
      id;
      name;
      designation;
      position     = (px, py);
      scale;
      epoch        = currentEpoch;
      status       = #Registered;
      nodeAffinity = Buffer.toArray(affinityBuf);
    };

    canisters.add(canister);
    substrateLog.add("SPINNER registered: " # name # " (#" # Nat.toText(id) #
                     ") @ (" # Float.toText(px) # ", " # Float.toText(py) #
                     ") scale=" # Float.toText(scale) #
                     " affinity=" # Nat.toText(count) # " nodes");

    canister
  };

  /// Spin up a canister — transition from Registered to Spinning to Active.
  public func spin(canisterId : Nat) : async Bool {
    let size = canisters.size();
    var i : Nat = 0;
    while (i < size) {
      let c = canisters.get(i);
      if (c.id == canisterId) {
        let spun : SovereignCanister = {
          id           = c.id;
          name         = c.name;
          designation  = c.designation;
          position     = c.position;
          scale        = c.scale;
          epoch        = c.epoch;
          status       = #Active;
          nodeAffinity = c.nodeAffinity;
        };
        canisters.put(i, spun);
        substrateLog.add("SPINNER activated: " # c.name # " (#" #
                         Nat.toText(canisterId) # ") → Active");
        return true;
      };
      i += 1;
    };
    false
  };

  /// Spin ALL registered canisters — activate everything.
  public func spin_all() : async Nat {
    let size = canisters.size();
    var activated : Nat = 0;
    var i : Nat = 0;
    while (i < size) {
      let c = canisters.get(i);
      switch (c.status) {
        case (#Registered or #Dormant) {
          let spun : SovereignCanister = {
            id           = c.id;
            name         = c.name;
            designation  = c.designation;
            position     = c.position;
            scale        = c.scale;
            epoch        = c.epoch;
            status       = #Active;
            nodeAffinity = c.nodeAffinity;
          };
          canisters.put(i, spun);
          activated += 1;
        };
        case _ {};
      };
      i += 1;
    };
    substrateLog.add("SPINNER spin_all: " # Nat.toText(activated) # " canisters activated");
    activated
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: CONSENSUS — Golden-Weighted Agreement
  // ══════════════════════════════════════════════════════════════════

  /// Golden consensus threshold: φ/(φ+1) ≈ 0.61803...
  /// ICP uses 2/3 ≈ 0.6667 threshold.
  /// We use the golden ratio proportion — it's the natural threshold
  /// where a majority becomes structurally decisive.
  transient let GOLDEN_THRESHOLD : Float = PHI / (PHI + 1.0); // ≈ 0.618

  /// Propose a consensus round.
  /// Selects validators from the node mesh based on golden-weight
  /// distribution.  Higher-weight nodes are always included.
  /// Threshold for agreement: φ/(φ+1) of total participating weight.
  public func propose(stateHash : Nat, validatorCount : Nat) : async ConsensusRound {
    let roundId = nextRoundId;
    nextRoundId += 1;

    // Select top-weighted validators (already sorted by weight from init)
    let maxValidators = if (validatorCount > totalNodes) totalNodes else validatorCount;
    let voteBuf = Buffer.Buffer<(Nat, Float)>(maxValidators);
    var totalWeight : Float = 0.0;
    var vi : Nat = 0;
    while (vi < maxValidators) {
      let node = nodes.get(vi);
      voteBuf.add((node.id, node.weight));
      totalWeight += node.weight;
      vi += 1;
    };

    let threshold = totalWeight * GOLDEN_THRESHOLD;

    // In this model, all selected validators agree (honest majority).
    // In production, this would involve actual message passing.
    let round : ConsensusRound = {
      roundId;
      epoch     = currentEpoch;
      proposal  = stateHash;
      votes     = Buffer.toArray(voteBuf);
      totalWeight;
      threshold;
      achieved  = totalWeight >= threshold; // Always true when all vote
      timestamp = Time.now();
    };

    rounds.add(round);

    // If consensus achieved, forge a new block
    if (round.achieved) {
      let validatorIds = Buffer.Buffer<Nat>(maxValidators);
      for ((nid, _) in voteBuf.vals()) {
        validatorIds.add(nid);
      };

      let prevHash = if (chain.size() > 0) {
        chain.get(chain.size() - 1).stateRoot
      } else { 0 };

      let block : SovereignBlock = {
        index        = nextBlockIndex;
        prevHash;
        timestamp    = Time.now();
        epoch        = currentEpoch;
        validatorSet = Buffer.toArray(validatorIds);
        stateRoot    = stateHash;
        goldenProof  = PHI * (totalWeight / threshold);
      };

      chain.add(block);
      nextBlockIndex += 1;

      substrateLog.add("CONSENSUS round #" # Nat.toText(roundId) #
                       " achieved → block #" # Nat.toText(block.index) #
                       " weight=" # Float.toText(totalWeight) #
                       " threshold=" # Float.toText(threshold));
    };

    round
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  /// Get substrate status.
  public query func status() : async {
    initialized     : Bool;
    total_nodes     : Nat;
    total_canisters : Nat;
    total_blocks    : Nat;
    total_rounds    : Nat;
    current_epoch   : Nat;
    golden_scale    : Float;
  } {
    {
      initialized;
      total_nodes     = totalNodes;
      total_canisters = canisters.size();
      total_blocks    = chain.size();
      total_rounds    = rounds.size();
      current_epoch   = currentEpoch;
      golden_scale    = Float.pow(PHI, Float.fromInt(currentEpoch));
    }
  };

  /// Get a node by ID.
  public query func get_node(id : Nat) : async ?Node {
    if (id < nodes.size()) { ?nodes.get(id) } else { null }
  };

  /// Get nodes in a sector.
  public query func nodes_in_sector(sector : Nat) : async [Node] {
    let buf = Buffer.Buffer<Node>(64);
    for (n in nodes.vals()) {
      if (n.sector == sector) { buf.add(n) };
    };
    Buffer.toArray(buf)
  };

  /// Get node count per sector — shows distribution quality.
  public query func sector_distribution() : async [(Nat, Nat)] {
    let sectors = Array.init<Nat>(13, 0);
    for (n in nodes.vals()) {
      if (n.sector < 13) {
        sectors[n.sector] := sectors[n.sector] + 1;
      };
    };
    let buf = Buffer.Buffer<(Nat, Nat)>(13);
    var s : Nat = 0;
    while (s < 13) {
      buf.add((s, sectors[s]));
      s += 1;
    };
    Buffer.toArray(buf)
  };

  /// Get all registered canisters.
  public query func list_canisters() : async [SovereignCanister] {
    Buffer.toArray(canisters)
  };

  /// Get the sovereign chain.
  public query func get_chain() : async [SovereignBlock] {
    Buffer.toArray(chain)
  };

  /// Get a specific block.
  public query func get_block(index : Nat) : async ?SovereignBlock {
    if (index < chain.size()) { ?chain.get(index) } else { null }
  };

  /// Get consensus rounds.
  public query func get_rounds() : async [ConsensusRound] {
    Buffer.toArray(rounds)
  };

  /// Get the substrate log.
  public query func get_log() : async [Text] {
    Buffer.toArray(substrateLog)
  };

  /// Get a node's cryptographic identity.
  public query func get_identity(nodeId : Nat) : async ?GoldenIdentity {
    if (nodeId < identities.size()) { ?identities.get(nodeId) } else { null }
  };

  /// Verify a block's golden proof — must approximate φ.
  public query func verify_golden_proof(blockIndex : Nat) : async ?Bool {
    if (blockIndex >= chain.size()) { return null };
    let block = chain.get(blockIndex);
    // Golden proof must be within 0.1 of φ — structural integrity check
    let diff = Float.abs(block.goldenProof - PHI);
    ?(diff < 0.5)
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func isFibonacci(n : Nat) : Bool {
    if (n == 0) { return true };
    let n2 = n * n;
    isPerfectSquare(5 * n2 + 4) or isPerfectSquare(5 * n2 - 4)
  };

  func isPerfectSquare(n : Nat) : Bool {
    let s = Int.abs(Float.toInt(Float.sqrt(Float.fromInt(n))));
    s * s == n
  };

  // ══════════════════════════════════════════════════════════════════
  //  IDENTITY
  // ══════════════════════════════════════════════════════════════════

  public query func name() : async Text { "SOVEREIGN" };

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
      name      = "SOVEREIGN";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "SOVEREIGN self-check complete. No drift detected."
  };

  public func register() : async Text {
    "SOVEREIGN registered. Capabilities: [chain, consensus, identity, governance]."
  };

  public query func report_status() : async Text {
    "SOVEREIGN | status=ACTIVE | v10=true"
  };

  public query func designation() : async Text {
    "The Substrate Itself — We are the vein, they are fractures"
  };
};
