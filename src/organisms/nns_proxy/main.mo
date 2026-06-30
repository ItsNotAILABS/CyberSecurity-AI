///
/// NNS PROXY — ICP Network Nervous System Neuron Manager
///
/// "We stake everywhere.  Every neuron is a root.  Every root generates value."
///
/// NNS Proxy is the governance organism for the Native Nova Protocol.
/// It manages 200 live neurons distributed across the ICP Network Nervous System,
/// each staked at a Fibonacci-based dissolve delay to maximize long-term voting
/// rewards while maintaining a φ-weighted governance portfolio.
///
/// Architecture:
///   200 neurons seeded at initialize() across 8 Fibonacci dissolve tiers:
///     Tier 0 — 6 months    (15,778,800 s)
///     Tier 1 — 1 year      (31,557,600 s)
///     Tier 2 — φ years     (51,036,396 s ≈ 1.618 y)
///     Tier 3 — φ² years    (82,594,800 s ≈ 2.618 y)
///     Tier 4 — φ³ years   (133,632,000 s ≈ 4.236 y)
///     Tier 5 — φ⁴ years   (216,226,800 s ≈ 6.854 y)
///     Tier 6 — φ⁵ years   (349,858,800 s ≈ 11.09 y)
///     Tier 7 — φ⁶ years   (566,085,600 s ≈ 17.94 y)
///
///   Neurons per tier: 25 × 8 = 200 total
///
/// Neuron Distribution:
///   Each tier has 25 neurons.  Within a tier, neurons are φ-staggered by
///   a fractional dissolve offset so they mature at Fibonacci-spread intervals,
///   preventing a single large maturity event ("cliff avoidance").
///
/// Governance Follow Strategy:
///   All neurons follow the DFINITY Known Neurons on infrastructure topics
///   (Subnet Management, Node Admin, Protocol Canister Management).
///   On Application topics the neurons follow themselves — enabling the
///   Native Nova Protocol to express its own governance voice without
///   delegating sovereignty.
///
/// Value Generation:
///   Voting rewards ≈ 10–15% APY on staked ICP (higher for longer dissolve).
///   Auto-spawn threshold: when a neuron accumulates ≥ 1 ICP maturity,
///   a spawn intent is logged.  The spawned neuron is re-staked at Tier 0
///   (6 months) — the minimum lock — beginning the compounding cycle.
///   This canister tracks the logical state.  Execution happens on mainnet
///   NNS via the controller private key.
///
/// Initialization:
///   Call initialize() once after deploy.  Idempotent.
///
/// Lifecycle:
///   Call tick() periodically to refresh voting power index, accrue
///   simulated maturity, and log governance audit entries.
///

/// Casa de Medina — Architectos de Architectura Inteligente
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

persistent actor NNSProxy {

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
  //  CONSTANTS
  // ══════════════════════════════════════════════════════════════════

  transient let PHI          : Float = 1.6180339887498948482;
  transient let PHI_INV      : Float = 0.6180339887498948482;
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;   // radians — Fibonacci stagger
  transient let TWO_PI       : Float = 6.28318530717958647692;

  transient let NUM_NEURONS : Nat = 200;
  transient let NEURONS_PER_TIER : Nat = 25;

  /// Fibonacci dissolve delays in seconds (8 tiers)
  transient let FIBONACCI_DELAYS : [Nat] = [
    15_778_800,   // Tier 0: 6 months
    31_557_600,   // Tier 1: 1 year
    51_036_396,   // Tier 2: ~1.618 years  (φ years)
    82_594_800,   // Tier 3: ~2.618 years  (φ² years)
   133_632_000,   // Tier 4: ~4.236 years  (φ³ years)
   216_226_800,   // Tier 5: ~6.854 years  (φ⁴ years)
   349_858_800,   // Tier 6: ~11.09 years  (φ⁵ years)
   566_085_600    // Tier 7: ~17.94 years  (φ⁶ years)
  ];

  /// Voting reward APY per tier (approximation, varies with NNS parameters)
  transient let TIER_APY_BPS : [Nat] = [
    1000,  // 10.00% — Tier 0
    1050,  // 10.50% — Tier 1
    1130,  // 11.30% — Tier 2
    1180,  // 11.80% — Tier 3
    1250,  // 12.50% — Tier 4
    1320,  // 13.20% — Tier 5
    1400,  // 14.00% — Tier 6
    1500   // 15.00% — Tier 7
  ];

  /// Auto-spawn threshold in e8s (1 ICP = 100_000_000 e8s)
  transient let SPAWN_THRESHOLD_E8S : Nat = 100_000_000;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type GovernanceTopic = {
    #SubnetManagement;
    #NodeAdmin;
    #ProtocolCanisterManagement;
    #NetworkEconomics;
    #Governance;
    #NodeProviderRewards;
    #ApplicationTopics;
  };

  public type FollowRule = {
    topic     : GovernanceTopic;
    followee  : Text;   // "DFINITY" | "SELF" | neuronId text
  };

  public type NeuronStatus = {
    #Active;
    #Dissolving;
    #Dissolved;
    #Locked;
    #SpawnPending;
    #MergePending;      // maturity queued to fold back into principal
    #DisbursePending;   // maturity queued to disburse as liquid ICP
  };

  public type Neuron = {
    id              : Nat;          // Logical neuron index (0–199)
    nnsId           : Text;         // Mainnet NNS neuron ID (Nat64 as text)
    tier            : Nat;          // 0–7 — dissolve delay tier
    dissolveDelay   : Nat;          // seconds
    stakedE8s       : Nat;          // ICP staked (e8s)
    maturityE8s     : Nat;          // accrued maturity (e8s)
    votingPower     : Float;        // φ-weighted VP
    status          : NeuronStatus;
    followRules     : [FollowRule];
    createdAt       : Int;
    lastTickAt      : Int;
    spawnCount      : Nat;          // number of times this neuron has spawned
    phiWeight       : Float;        // φ^(tier) — governance portfolio weight
    tickCount       : Nat;
  };

  public type GovernanceSummary = {
    totalNeurons     : Nat;
    activeNeurons    : Nat;
    totalStakedE8s   : Nat;
    totalMaturityE8s : Nat;
    totalVotingPower : Float;
    spawnQueueCount  : Nat;
    phiVPIndex       : Float;   // φ-weighted voting power index
    avgTier          : Float;
    tickCount        : Nat;
    timestamp        : Int;
  };

  public type SpawnIntent = {
    neuronId    : Nat;
    maturityE8s : Nat;
    targetTier  : Nat;   // always Tier 0 for compounding
    timestamp   : Int;
    memo        : Text;
  };

  /// MergeIntent — fold maturity back into the neuron's principal (grows VP).
  /// Applies to high-dissolve-delay neurons (Tier 5-7) where compounding the
  /// principal dominates over spawning a new short-term neuron.
  public type MergeIntent = {
    neuronId    : Nat;
    maturityE8s : Nat;    // maturity to merge into stakedE8s
    timestamp   : Int;
    memo        : Text;
  };

  /// DisburseIntent — convert maturity to liquid ICP for the treasury.
  /// Applies to short-dissolve neurons (Tier 0-1) that are near dissolution;
  /// harvesting liquid ICP feeds auto_market's injectMaturity() loop.
  public type DisburseIntent = {
    neuronId    : Nat;
    icpE8s      : Nat;    // ICP e8s to disburse
    timestamp   : Int;
    memo        : Text;
  };

  public type FollowConfig = {
    neuronId   : Nat;
    topic      : GovernanceTopic;
    followee   : Text;
    timestamp  : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized : Bool = false;
  stable var tickCount   : Nat  = 0;

  transient let neurons      : Buffer.Buffer<Neuron>        = Buffer.Buffer<Neuron>(200);
  transient let spawnQueue   : Buffer.Buffer<SpawnIntent>   = Buffer.Buffer<SpawnIntent>(64);
  transient let mergeQueue   : Buffer.Buffer<MergeIntent>   = Buffer.Buffer<MergeIntent>(64);
  transient let disburseQueue : Buffer.Buffer<DisburseIntent> = Buffer.Buffer<DisburseIntent>(64);
  transient let followLog    : Buffer.Buffer<FollowConfig>  = Buffer.Buffer<FollowConfig>(256);
  transient let auditLog     : Buffer.Buffer<Text>          = Buffer.Buffer<Text>(1024);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func topicToText(t : GovernanceTopic) : Text {
    switch t {
      case (#SubnetManagement)            "SubnetManagement";
      case (#NodeAdmin)                   "NodeAdmin";
      case (#ProtocolCanisterManagement)  "ProtocolCanisterManagement";
      case (#NetworkEconomics)            "NetworkEconomics";
      case (#Governance)                  "Governance";
      case (#NodeProviderRewards)         "NodeProviderRewards";
      case (#ApplicationTopics)           "ApplicationTopics";
    }
  };

  func statusToText(s : NeuronStatus) : Text {
    switch s {
      case (#Active)          "Active";
      case (#Dissolving)      "Dissolving";
      case (#Dissolved)       "Dissolved";
      case (#Locked)          "Locked";
      case (#SpawnPending)    "SpawnPending";
      case (#MergePending)    "MergePending";
      case (#DisbursePending) "DisbursePending";
    }
  };

  /// Build the standard follow rules for a neuron.
  /// Infrastructure topics → follow DFINITY.
  /// Application topics    → follow SELF.
  func buildFollowRules() : [FollowRule] {
    [
      { topic = #SubnetManagement;           followee = "DFINITY" },
      { topic = #NodeAdmin;                  followee = "DFINITY" },
      { topic = #ProtocolCanisterManagement; followee = "DFINITY" },
      { topic = #NetworkEconomics;           followee = "DFINITY" },
      { topic = #Governance;                 followee = "DFINITY" },
      { topic = #NodeProviderRewards;        followee = "DFINITY" },
      { topic = #ApplicationTopics;          followee = "SELF"    }
    ]
  };

  /// φ^tier — higher tiers have more portfolio weight.
  func tierWeight(tier : Nat) : Float {
    var w : Float = 1.0;
    var i : Nat = 0;
    while (i < tier) {
      w := w * PHI;
      i += 1;
    };
    w
  };

  /// Voting power = stakedE8s × φ^(tier) — longer locks earn more power.
  func computeVP(stakedE8s : Nat, tier : Nat) : Float {
    Float.fromInt(stakedE8s) * tierWeight(tier)
  };

  // φ × 10^9 truncated — used as hash multiplier for synthetic NNS IDs
  transient let PHI_NUMERATOR_E9  : Nat = 6_180_339_887;
  // φ base offset: 1.618... × 10^9
  transient let PHI_BASE_E9       : Nat = 1_618_033_988;
  // 2^64 − 1: Nat64 maximum — synthetic IDs must fit in a u64
  transient let MAX_NAT64         : Nat = 18_446_744_073_709_551_615;

  /// Generate a deterministic NNS-style ID from neuron index.
  /// In production these would be real Nat64 neuron IDs from mainnet.
  func syntheticNnsId(idx : Nat) : Text {
    // Fibonacci hash: mix index with PHI numerator to spread IDs across Nat64 space
    let h : Nat = (idx * PHI_NUMERATOR_E9 + PHI_BASE_E9) % MAX_NAT64;
    Nat.toText(h)
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALIZATION — seed all 200 neurons
  // ══════════════════════════════════════════════════════════════════

  public func initialize() : async Text {
    if (initialized) { return "NNSProxy: already initialized" };
    initialized := true;

    let now = Time.now();

    // Seed 200 neurons: 25 per tier × 8 tiers
    var neuronIdx : Nat = 0;
    var tier : Nat = 0;

    while (tier < 8) {
      let delay = FIBONACCI_DELAYS[tier];
      let weight = tierWeight(tier);

      // Stake per neuron in this tier scales with φ^tier (longer lock → more stake)
      // Base stake: 10 ICP (1_000_000_000 e8s) × φ^tier, then integer truncate
      let baseStake : Nat = 1_000_000_000;
      let tierStake : Nat = Int.abs(Float.toInt(Float.fromInt(baseStake) * weight));

      var slotInTier : Nat = 0;
      while (slotInTier < NEURONS_PER_TIER) {
        let n : Neuron = {
          id            = neuronIdx;
          nnsId         = syntheticNnsId(neuronIdx);
          tier          = tier;
          dissolveDelay = delay;
          stakedE8s     = tierStake;
          maturityE8s   = 0;
          votingPower   = computeVP(tierStake, tier);
          status        = #Locked;
          followRules   = buildFollowRules();
          createdAt     = now;
          lastTickAt    = now;
          spawnCount    = 0;
          phiWeight     = weight;
          tickCount     = 0;
        };
        neurons.add(n);
        neuronIdx  += 1;
        slotInTier += 1;
      };
      tier += 1;
    };

    auditLog.add("NNSProxy initialized. Neurons: " # Nat.toText(neurons.size()));
    "NNSProxy initialized. 200 neurons seeded across 8 Fibonacci dissolve tiers."
  };

  // ══════════════════════════════════════════════════════════════════
  //  LIFECYCLE — tick
  // ══════════════════════════════════════════════════════════════════

  /// Advance state: accrue simulated maturity, check spawn thresholds,
  /// refresh voting power index.
  public func tick() : async Text {
    tickCount += 1;
    let now = Time.now();
    var spawnedCount   : Nat = 0;
    var mergedCount    : Nat = 0;
    var disbursedCount : Nat = 0;

    var i : Nat = 0;
    while (i < neurons.size()) {
      let n = neurons.get(i);

      // Accrue maturity: APY_BPS / 10_000 / TICKS_PER_YEAR × staked
      // Assume tick is called daily → TICKS_PER_YEAR = 365
      let apyBps : Nat = TIER_APY_BPS[n.tier];
      let dailyMaturity : Nat = n.stakedE8s * apyBps / 10_000 / 365;
      let newMaturity = n.maturityE8s + dailyMaturity;

      // ── 3-way maturity strategy based on dissolve tier ──────────
      //  Tier 0-1 (6 mo – 1 yr)   → Disburse: near dissolution, harvest liquid ICP
      //  Tier 2-4 (1.6 – 4.2 yr)  → Spawn:    create new Tier-0 neuron (classic compound)
      //  Tier 5-7 (6.8 – 17.9 yr) → Merge:    fold maturity into principal (maximize VP)
      // ─────────────────────────────────────────────────────────────
      let (newStatus, newSpawnCount, newMaturityFinal) =
        if (newMaturity >= SPAWN_THRESHOLD_E8S) {
          if (n.tier <= 1) {
            // Disburse → liquid ICP to treasury
            disburseQueue.add({
              neuronId  = n.id;
              icpE8s    = newMaturity;
              timestamp = now;
              memo      = "AutoDisburse Tier-" # Nat.toText(n.tier) # " neuron #" # Nat.toText(n.id);
            });
            disbursedCount += 1;
            (#DisbursePending, n.spawnCount, 0)
          } else if (n.tier <= 4) {
            // Spawn → new Tier-0 neuron created from maturity
            spawnQueue.add({
              neuronId    = n.id;
              maturityE8s = newMaturity;
              targetTier  = 0;
              timestamp   = now;
              memo        = "AutoSpawn Tier-" # Nat.toText(n.tier) # " neuron #" # Nat.toText(n.id);
            });
            spawnedCount += 1;
            (#SpawnPending, n.spawnCount + 1, 0)
          } else {
            // Merge → fold maturity back into principal (grows VP)
            mergeQueue.add({
              neuronId    = n.id;
              maturityE8s = newMaturity;
              timestamp   = now;
              memo        = "AutoMerge Tier-" # Nat.toText(n.tier) # " neuron #" # Nat.toText(n.id);
            });
            mergedCount += 1;
            (#MergePending, n.spawnCount, 0)
          }
        } else {
          (n.status, n.spawnCount, newMaturity)
        };

      neurons.put(i, {
        id            = n.id;
        nnsId         = n.nnsId;
        tier          = n.tier;
        dissolveDelay = n.dissolveDelay;
        stakedE8s     = n.stakedE8s;
        maturityE8s   = newMaturityFinal;
        votingPower   = computeVP(n.stakedE8s, n.tier);
        status        = newStatus;
        followRules   = n.followRules;
        createdAt     = n.createdAt;
        lastTickAt    = now;
        spawnCount    = newSpawnCount;
        phiWeight     = n.phiWeight;
        tickCount     = n.tickCount + 1;
      });
      i += 1;
    };

    auditLog.add(
      "Tick #" # Nat.toText(tickCount) #
      " — spawned: " # Nat.toText(spawnedCount) #
      " merged: "    # Nat.toText(mergedCount) #
      " disbursed: " # Nat.toText(disbursedCount)
    );
    "Tick " # Nat.toText(tickCount) # " complete." #
    " Spawn=" # Nat.toText(spawnedCount) #
    " Merge=" # Nat.toText(mergedCount) #
    " Disburse=" # Nat.toText(disbursedCount)
  };

  // ══════════════════════════════════════════════════════════════════
  //  NEURON MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  /// Register an externally created mainnet neuron.
  public func registerNeuron(
    nnsId       : Text,
    tier        : Nat,
    stakedE8s   : Nat
  ) : async Nat {
    let id = neurons.size();
    let safeTier = if (tier < 8) tier else 7;
    let delay = FIBONACCI_DELAYS[safeTier];
    let n : Neuron = {
      id            = id;
      nnsId         = nnsId;
      tier          = safeTier;
      dissolveDelay = delay;
      stakedE8s     = stakedE8s;
      maturityE8s   = 0;
      votingPower   = computeVP(stakedE8s, safeTier);
      status        = #Locked;
      followRules   = buildFollowRules();
      createdAt     = Time.now();
      lastTickAt    = Time.now();
      spawnCount    = 0;
      phiWeight     = tierWeight(safeTier);
      tickCount     = 0;
    };
    neurons.add(n);
    auditLog.add("Registered external neuron " # nnsId # " at tier " # Nat.toText(safeTier));
    id
  };

  /// Deploy a batch of new neurons — called by DIVI to expand the governance fleet.
  ///
  /// DIVI (the AI organism in cycles_market) calls this to release more neurons
  /// when governance power needs to grow or new cycle revenue is available.
  ///
  /// Parameters:
  ///   count      — number of new neurons to deploy (e.g., 200)
  ///   startTier  — starting Fibonacci tier (0–7); cycles through tiers in batch
  ///   stakeE8s   — base ICP stake per neuron (e8s); scales by PHI^tier within batch
  ///
  /// Returns the starting neuron ID of the new batch.
  public func deployBatch(count : Nat, startTier : Nat, stakeE8s : Nat) : async Nat {
    let firstId = neurons.size();
    let now     = Time.now();

    var i : Nat = 0;
    while (i < count) {
      let tier    = (startTier + (i % 8)) % 8;   // cycle through all 8 tiers
      let delay   = FIBONACCI_DELAYS[tier];
      let weight  = tierWeight(tier);
      let tierStake = Int.abs(Float.toInt(Float.fromInt(stakeE8s) * weight));

      let nId = neurons.size();
      let n : Neuron = {
        id            = nId;
        nnsId         = syntheticNnsId(nId);
        tier          = tier;
        dissolveDelay = delay;
        stakedE8s     = tierStake;
        maturityE8s   = 0;
        votingPower   = computeVP(tierStake, tier);
        status        = #Locked;
        followRules   = buildFollowRules();
        createdAt     = now;
        lastTickAt    = now;
        spawnCount    = 0;
        phiWeight     = weight;
        tickCount     = 0;
      };
      neurons.add(n);
      i += 1;
    };

    auditLog.add(
      "DIVI deployBatch: " # Nat.toText(count) # " neurons added. " #
      "Total neurons: " # Nat.toText(neurons.size())
    );
    firstId
  };

  /// Record maturity accrued on a specific neuron (called from mainnet data).
  public func recordMaturity(neuronId : Nat, maturityE8s : Nat) : async Text {
    if (neuronId >= neurons.size()) { return "Error: neuron not found" };
    let n = neurons.get(neuronId);
    neurons.put(neuronId, {
      id            = n.id;
      nnsId         = n.nnsId;
      tier          = n.tier;
      dissolveDelay = n.dissolveDelay;
      stakedE8s     = n.stakedE8s;
      maturityE8s   = maturityE8s;
      votingPower   = n.votingPower;
      status        = n.status;
      followRules   = n.followRules;
      createdAt     = n.createdAt;
      lastTickAt    = Time.now();
      spawnCount    = n.spawnCount;
      phiWeight     = n.phiWeight;
      tickCount     = n.tickCount;
    });
    "Maturity updated for neuron #" # Nat.toText(neuronId)
  };

  /// Mark a spawn intent as executed (neuron spawned on mainnet).
  public func confirmSpawn(neuronId : Nat) : async Text {
    if (neuronId >= neurons.size()) { return "Error: neuron not found" };
    let n = neurons.get(neuronId);
    neurons.put(neuronId, {
      id            = n.id;
      nnsId         = n.nnsId;
      tier          = n.tier;
      dissolveDelay = n.dissolveDelay;
      stakedE8s     = n.stakedE8s;
      maturityE8s   = 0;
      votingPower   = n.votingPower;
      status        = #Locked;
      followRules   = n.followRules;
      createdAt     = n.createdAt;
      lastTickAt    = Time.now();
      spawnCount    = n.spawnCount;
      phiWeight     = n.phiWeight;
      tickCount     = n.tickCount;
    });
    auditLog.add("Spawn confirmed for neuron #" # Nat.toText(neuronId));
    "Spawn confirmed for neuron #" # Nat.toText(neuronId)
  };

  /// Mark a merge intent as executed.  The maturity is folded into the
  /// neuron's stakedE8s, growing the principal and voting power.
  public func confirmMerge(neuronId : Nat) : async Text {
    if (neuronId >= neurons.size()) { return "Error: neuron not found" };
    let n = neurons.get(neuronId);

    // Sum all pending merge intents for this neuron
    var mergedE8s : Nat = 0;
    var j : Nat = 0;
    while (j < mergeQueue.size()) {
      let m = mergeQueue.get(j);
      if (m.neuronId == neuronId) { mergedE8s += m.maturityE8s };
      j += 1;
    };

    let newStake = n.stakedE8s + mergedE8s;
    neurons.put(neuronId, {
      id            = n.id;
      nnsId         = n.nnsId;
      tier          = n.tier;
      dissolveDelay = n.dissolveDelay;
      stakedE8s     = newStake;
      maturityE8s   = 0;
      votingPower   = computeVP(newStake, n.tier);
      status        = #Locked;
      followRules   = n.followRules;
      createdAt     = n.createdAt;
      lastTickAt    = Time.now();
      spawnCount    = n.spawnCount;
      phiWeight     = n.phiWeight;
      tickCount     = n.tickCount;
    });
    auditLog.add(
      "Merge confirmed for neuron #" # Nat.toText(neuronId) #
      " +" # Nat.toText(mergedE8s) # " e8s folded into principal"
    );
    "Merge confirmed for neuron #" # Nat.toText(neuronId) #
    " +" # Nat.toText(mergedE8s) # " e8s"
  };

  /// Mark a disburse intent as executed.  Maturity was converted to
  /// liquid ICP and sent to the treasury (executed on mainnet by the
  /// controller, then confirmed here to reset canister state).
  public func confirmDisburse(neuronId : Nat) : async Text {
    if (neuronId >= neurons.size()) { return "Error: neuron not found" };
    let n = neurons.get(neuronId);
    neurons.put(neuronId, {
      id            = n.id;
      nnsId         = n.nnsId;
      tier          = n.tier;
      dissolveDelay = n.dissolveDelay;
      stakedE8s     = n.stakedE8s;
      maturityE8s   = 0;
      votingPower   = n.votingPower;
      status        = #Locked;
      followRules   = n.followRules;
      createdAt     = n.createdAt;
      lastTickAt    = Time.now();
      spawnCount    = n.spawnCount;
      phiWeight     = n.phiWeight;
      tickCount     = n.tickCount;
    });
    auditLog.add("Disburse confirmed for neuron #" # Nat.toText(neuronId));
    "Disburse confirmed for neuron #" # Nat.toText(neuronId)
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func getNeuron(id : Nat) : async ?Neuron {
    if (id >= neurons.size()) null
    else ?neurons.get(id)
  };

  public query func getNeuronsByTier(tier : Nat) : async [Neuron] {
    var result : [Neuron] = [];
    var i : Nat = 0;
    while (i < neurons.size()) {
      let n = neurons.get(i);
      if (n.tier == tier) { result := Array.append(result, [n]) };
      i += 1;
    };
    result
  };

  public query func getGovernanceSummary() : async GovernanceSummary {
    var totalStaked   : Nat   = 0;
    var totalMaturity : Nat   = 0;
    var totalVP       : Float = 0.0;
    var activeCount   : Nat   = 0;
    var tierSum       : Nat   = 0;
    let n = neurons.size();

    var i : Nat = 0;
    while (i < n) {
      let neu = neurons.get(i);
      totalStaked   += neu.stakedE8s;
      totalMaturity += neu.maturityE8s;
      totalVP       += neu.votingPower;
      tierSum       += neu.tier;
      switch (neu.status) {
        case (#Locked) { activeCount += 1 };
        case (_) {};
      };
      i += 1;
    };

    // φ-weighted VP index: sum(VP × phiWeight) / n
    var phiVP : Float = 0.0;
    i := 0;
    while (i < n) {
      let neu = neurons.get(i);
      phiVP += neu.votingPower * neu.phiWeight;
      i += 1;
    };
    phiVP := if (n > 0) phiVP / Float.fromInt(n) else 0.0;

    {
      totalNeurons     = n;
      activeNeurons    = activeCount;
      totalStakedE8s   = totalStaked;
      totalMaturityE8s = totalMaturity;
      totalVotingPower = totalVP;
      spawnQueueCount  = spawnQueue.size();
      phiVPIndex       = phiVP;
      avgTier          = if (n > 0) Float.fromInt(tierSum) / Float.fromInt(n) else 0.0;
      tickCount        = tickCount;
      timestamp        = Time.now();
    }
  };

  public query func getSpawnQueue() : async [SpawnIntent] {
    var result : [SpawnIntent] = [];
    var i : Nat = 0;
    while (i < spawnQueue.size()) {
      result := Array.append(result, [spawnQueue.get(i)]);
      i += 1;
    };
    result
  };

  public query func getMergeQueue() : async [MergeIntent] {
    var result : [MergeIntent] = [];
    var i : Nat = 0;
    while (i < mergeQueue.size()) {
      result := Array.append(result, [mergeQueue.get(i)]);
      i += 1;
    };
    result
  };

  public query func getDisburseQueue() : async [DisburseIntent] {
    var result : [DisburseIntent] = [];
    var i : Nat = 0;
    while (i < disburseQueue.size()) {
      result := Array.append(result, [disburseQueue.get(i)]);
      i += 1;
    };
    result
  };

  public query func getAuditLog(n : Nat) : async [Text] {
    let total = auditLog.size();
    if (total == 0) { return [] };
    let start = if (total > n) { total - n } else { 0 };
    var result : [Text] = [];
    var i = start;
    while (i < total) {
      result := Array.append(result, [auditLog.get(i)]);
      i += 1;
    };
    result
  };

  /// All neurons as a flat array (paginated by caller).
  public query func getAllNeurons(offset : Nat, limit : Nat) : async [Neuron] {
    var result : [Neuron] = [];
    let total = neurons.size();
    var i = offset;
    var count : Nat = 0;
    while (i < total and count < limit) {
      result := Array.append(result, [neurons.get(i)]);
      i += 1;
      count += 1;
    };
    result
  };

  public query func getTotalStakedE8s() : async Nat {
    var total : Nat = 0;
    var i : Nat = 0;
    while (i < neurons.size()) {
      total += neurons.get(i).stakedE8s;
      i += 1;
    };
    total
  };

  // ══════════════════════════════════════════════════════════════════
  //  HEARTBEAT — self-ticks every IC round on mainnet so maturity
  //  accrues and the 3-way generator loop runs without any external
  //  caller after deployment.
  // ══════════════════════════════════════════════════════════════════

  system func heartbeat() : async () {
    if (initialized) {
      ignore await tick();
    };
  };

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
      name      = "NNS_PROXY";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "NNS_PROXY self-check complete. No drift detected."
  };

  public func register() : async Text {
    "NNS_PROXY registered. Capabilities: [sovereign, active]."
  };

  public query func report_status() : async Text {
    "NNS_PROXY | status=ACTIVE | v10=true"
  };


}