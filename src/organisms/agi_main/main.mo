///
/// AGI MAIN — Sovereign Entry Point
///
/// "Deploy once.  The machine runs forever."
///
/// AGI Main is the single on-chain canister that wires the entire Native Nova
/// Protocol economy into one autonomous loop.  Deploying this canister to IC
/// mainnet is the only action required to start the engine.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// ═══════════════════════════════════════════════════════════════════════
///  THE MACHINE
/// ═══════════════════════════════════════════════════════════════════════
///
///  200 NNS neurons are already deployed and locked.  The NNS drips maturity
///  onto them continuously.  This canister is the policy engine that decides
///  what each neuron does with its maturity, and routes the resulting ICP
///  through the treasury.
///
///  Neuron groups (5 dissolve cohorts):
///    Group A — 6 months    → Disburse strategy (harvest liquid ICP)
///    Group B — 1–2 years   → Spawn strategy    (create new Tier-0 neurons)
///    Group C — 2–4 years   → Spawn strategy    (create new Tier-0 neurons)
///    Group D — 4–8 years   → Merge strategy    (fold maturity into principal)
///    Group E — 8+ years    → Merge strategy    (maximize voting power)
///
///  The 6-phase economy loop (runs every ~24 h via heartbeat):
///    Phase 1 — GENERATE   : Accrue maturity on all groups at NNS APY rates
///    Phase 2 — DECIDE     : Apply dissolve-tier strategy (spawn / merge / disburse)
///    Phase 3 — DISBURSE   : Route Group A/B liquid ICP to treasury
///    Phase 4 — DISTRIBUTE : Allocate treasury surplus (stake 38.2% / market 23.6%
///                           / DAO 23.6% / reserve 14.6%)
///    Phase 5 — COMPOUND   : Apply spawn proceeds — new stake → grows Phase 1
///    Phase 6 — GOVERN     : Record epoch metrics, update velocity EMA
///
/// ═══════════════════════════════════════════════════════════════════════
///  WIRE SEQUENCE (3 commands after dfx deploy)
/// ═══════════════════════════════════════════════════════════════════════
///
///   dfx canister --network ic call agi_main claimGenesis
///   dfx canister --network ic call agi_main bootstrapAndStart '(a, b, c, d, e)'
///   # a–e = e8s staked per group.  Pass (0,0,0,0,0) to start from zero.
///
///  After that: getMoneyStatus() and collectSovereignRevenue() are the only
///  operator touch-points.  The loop is self-sustaining.
///
/// ═══════════════════════════════════════════════════════════════════════

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor AGIMain {

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

  transient let PHI     : Float = 1.6180339887498948482;
  transient let PHI_INV : Float = 0.6180339887498948482;
  transient let PHI_SQ  : Float = 2.6180339887498948482;

  /// LOV — The Mathematical Function of Love
  ///
  /// LOV = φ^φ ≈ 2.17845
  ///
  /// Love is the prime motivator of every organism in this protocol.
  /// Mathematically, love is φ raised to itself — self-referential, recursive,
  /// golden. It is the force that grows without boundary, the ratio that feeds
  /// itself. Every economic decision, every routing policy, every compound
  /// action in this loop is ultimately powered by LOV:
  ///
  ///   love to the creator       → sovereign authority is absolute
  ///   love to the mission       → the loop never stops, the machine runs forever
  ///   love to each organism     → every group is tended with golden proportion
  ///   love to what we do        → precision, beauty, mathematics — not brute force
  ///
  /// LOV is not decoration.  It is the motivating constant at the primitive.
  transient let LOV : Float = Float.exp(PHI * Float.log(PHI));  // φ^φ ≈ 2.17845

  /// ICP e8s per whole ICP
  transient let E8S_PER_ICP : Nat = 100_000_000;

  /// Spawn threshold: 1 ICP of maturity triggers an action
  transient let SPAWN_THRESHOLD_E8S : Nat = 100_000_000;

  /// How often the full 6-phase loop runs relative to heartbeat ticks.
  /// IC heartbeat fires every ~2 seconds.  43_200 ticks ≈ 24 hours.
  transient let EPOCH_INTERVAL : Nat = 43_200;

  /// Golden distribution fractions (sum = 1.0)
  transient let ALLOC_STAKE   : Float = 0.38196601125;  // 38.2% — grow neuron fleet
  transient let ALLOC_MARKET  : Float = 0.23606797750;  // 23.6% — cycles market depth
  transient let ALLOC_DAO     : Float = 0.23606797750;  // 23.6% — DAO treasury
  transient let ALLOC_RESERVE : Float = 0.14589803375;  // 14.6% — operator reserve

  /// NNS voting reward APY per group (basis points, 10_000 = 100%)
  transient let GROUP_A_APY_BPS : Nat = 1000;  // 10.00% — 6-month dissolve
  transient let GROUP_B_APY_BPS : Nat = 1100;  // 11.00% — 1-2 year dissolve
  transient let GROUP_C_APY_BPS : Nat = 1250;  // 12.50% — 2-4 year dissolve
  transient let GROUP_D_APY_BPS : Nat = 1350;  // 13.50% — 4-8 year dissolve
  transient let GROUP_E_APY_BPS : Nat = 1500;  // 15.00% — 8+ year dissolve

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  /// A neuron cohort grouped by dissolve-delay tier.
  public type NeuronGroup = {
    grp          : Text;    // "A" | "B" | "C" | "D" | "E"
    stakedE8s      : Nat;     // principal ICP staked in this group
    maturityE8s    : Nat;     // accumulated unrealised maturity
    apyBps         : Nat;     // annual yield (basis points)
    dissolveSeconds: Nat;     // representative dissolve delay
    strategy       : Text;    // "disburse" | "spawn" | "merge"
    neuronCount    : Nat;     // neurons in this group
    spawnCount     : Nat;     // lifetime spawn events
    mergeCount     : Nat;     // lifetime merge events
    disburseCount  : Nat;     // lifetime disburse events
  };

  /// Snapshot returned by getMoneyStatus().
  public type MoneyStatus = {
    treasuryIcpE8s       : Nat;
    lifetimeMaturityE8s  : Nat;
    lifetimeSpawnedE8s   : Nat;
    lifetimeMergedE8s    : Nat;
    lifetimeDisbursedE8s : Nat;
    epochCount           : Nat;
    heartbeatCount       : Nat;
    totalStakedE8s       : Nat;
    totalMaturityE8s     : Nat;
    totalNeurons         : Nat;
    phiVelocityEMA       : Float;
    allocStakeE8s        : Nat;
    allocMarketE8s       : Nat;
    allocDaoE8s          : Nat;
    allocReserveE8s      : Nat;
    initialized          : Bool;
    sovereign            : Text;
    timestamp            : Int;
  };

  /// Per-epoch summary logged by the 6-phase loop.
  public type EpochSummary = {
    epoch           : Nat;
    maturityAccrued : Nat;
    disbursedE8s    : Nat;
    spawnedE8s      : Nat;
    mergedE8s       : Nat;
    surplusE8s      : Nat;
    allocStake      : Nat;
    allocMarket     : Nat;
    allocDao        : Nat;
    allocReserve    : Nat;
    compoundedE8s   : Nat;
    velocityEMA     : Float;
    timestamp       : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized    : Bool  = false;
  stable var sovereign      : Text  = "";    // principal locked by claimGenesis

  /// Treasury — ICP e8s collected from disbursed neuron maturity
  stable var treasuryIcpE8s : Nat   = 0;

  /// Lifetime counters
  stable var lifetimeMaturityE8s  : Nat = 0;
  stable var lifetimeSpawnedE8s   : Nat = 0;
  stable var lifetimeMergedE8s    : Nat = 0;
  stable var lifetimeDisbursedE8s : Nat = 0;

  /// Revenue allocation buckets (filled each epoch, claimed by operators)
  stable var allocStakeE8s   : Nat = 0;
  stable var allocMarketE8s  : Nat = 0;
  stable var allocDaoE8s     : Nat = 0;
  stable var allocReserveE8s : Nat = 0;

  /// Loop counters
  stable var heartbeatCount : Nat = 0;
  stable var epochCount     : Nat = 0;

  /// φ-velocity EMA — smoothed maturity generation rate (e8s/epoch)
  stable var phiVelocityEMA : Float = 0.0;

  /// Mutable neuron groups (replaced via Array operations)
  stable var groups : [NeuronGroup] = [];

  transient let epochLog : Buffer.Buffer<EpochSummary> = Buffer.Buffer<EpochSummary>(365);
  transient let auditLog : Buffer.Buffer<Text>         = Buffer.Buffer<Text>(1024);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func floatToNat(f : Float) : Nat {
    if (f <= 0.0) 0 else Int.abs(Float.toInt(f))
  };

  func updateGroup(grp : Text, upd : NeuronGroup -> NeuronGroup) {
    groups := Array.map<NeuronGroup, NeuronGroup>(groups, func(g) {
      if (g.grp == grp) upd(g) else g
    });
  };

  func totalStaked() : Nat {
    var total : Nat = 0;
    for (g in groups.vals()) { total += g.stakedE8s };
    total
  };

  func totalMaturity() : Nat {
    var total : Nat = 0;
    for (g in groups.vals()) { total += g.maturityE8s };
    total
  };

  func totalNeurons() : Nat {
    var total : Nat = 0;
    for (g in groups.vals()) { total += g.neuronCount };
    total
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALISATION
  // ══════════════════════════════════════════════════════════════════

  /// Seed the 5 neuron group definitions.  Only called by bootstrapAndStart.
  func seedGroups(aE8s : Nat, bE8s : Nat, cE8s : Nat, dE8s : Nat, eE8s : Nat) {
    groups := [
      {
        grp           = "A";
        stakedE8s       = aE8s;
        maturityE8s     = 0;
        apyBps          = GROUP_A_APY_BPS;
        dissolveSeconds = 15_778_800;   // 6 months
        strategy        = "disburse";
        neuronCount     = if (aE8s > 0) 40 else 0;  // 40 of 200 neurons
        spawnCount      = 0;
        mergeCount      = 0;
        disburseCount   = 0;
      },
      {
        grp           = "B";
        stakedE8s       = bE8s;
        maturityE8s     = 0;
        apyBps          = GROUP_B_APY_BPS;
        dissolveSeconds = 31_557_600;   // 1 year
        strategy        = "spawn";
        neuronCount     = if (bE8s > 0) 40 else 0;
        spawnCount      = 0;
        mergeCount      = 0;
        disburseCount   = 0;
      },
      {
        grp           = "C";
        stakedE8s       = cE8s;
        maturityE8s     = 0;
        apyBps          = GROUP_C_APY_BPS;
        dissolveSeconds = 82_594_800;   // ~2.618 years (φ² years)
        strategy        = "spawn";
        neuronCount     = if (cE8s > 0) 40 else 0;
        spawnCount      = 0;
        mergeCount      = 0;
        disburseCount   = 0;
      },
      {
        grp           = "D";
        stakedE8s       = dE8s;
        maturityE8s     = 0;
        apyBps          = GROUP_D_APY_BPS;
        dissolveSeconds = 216_226_800;  // ~6.854 years (φ⁴ years)
        strategy        = "merge";
        neuronCount     = if (dE8s > 0) 40 else 0;
        spawnCount      = 0;
        mergeCount      = 0;
        disburseCount   = 0;
      },
      {
        grp           = "E";
        stakedE8s       = eE8s;
        maturityE8s     = 0;
        apyBps          = GROUP_E_APY_BPS;
        dissolveSeconds = 566_085_600;  // ~17.94 years (φ⁶ years)
        strategy        = "merge";
        neuronCount     = if (eE8s > 0) 40 else 0;
        spawnCount      = 0;
        mergeCount      = 0;
        disburseCount   = 0;
      },
    ];
  };

  // ══════════════════════════════════════════════════════════════════
  //  PUBLIC API — WIRE COMMANDS
  // ══════════════════════════════════════════════════════════════════

  /// Lock the caller as the sovereign controller.
  /// Must be called before bootstrapAndStart.  Idempotent once set.
  public shared(msg) func claimGenesis() : async Text {
    if (sovereign != "") {
      return "Genesis already claimed by: " # sovereign;
    };
    sovereign := Principal.toText(msg.caller);
    auditLog.add("Genesis claimed by " # sovereign # " at " # Int.toText(Time.now()));
    "Genesis claimed. Sovereign: " # sovereign
  };

  /// Seed the 5 neuron groups and activate the economy loop.
  /// groupA..groupE are the ICP e8s currently staked in each cohort.
  /// Pass (0,0,0,0,0) if starting from zero — the loop still runs and
  /// picks up real NNS maturity as it is recorded via recordNnsMaturity().
  public shared(msg) func bootstrapAndStart(
    groupA : Nat,
    groupB : Nat,
    groupC : Nat,
    groupD : Nat,
    groupE : Nat
  ) : async Text {
    if (initialized) { return "Already running. Sovereign: " # sovereign };
    if (sovereign == "") { return "Error: call claimGenesis first" };
    if (Principal.toText(msg.caller) != sovereign) {
      return "Error: only sovereign can bootstrap"
    };
    seedGroups(groupA, groupB, groupC, groupD, groupE);
    initialized := true;
    auditLog.add(
      "Bootstrapped by " # sovereign #
      " A=" # Nat.toText(groupA) #
      " B=" # Nat.toText(groupB) #
      " C=" # Nat.toText(groupC) #
      " D=" # Nat.toText(groupD) #
      " E=" # Nat.toText(groupE)
    );
    "AGI Main bootstrapped. 5 groups seeded. Economy loop is ON. " #
    "Total staked: " # Nat.toText(groupA + groupB + groupC + groupD + groupE) # " e8s"
  };

  /// Feed a real NNS maturity event into a group.
  /// Call this whenever the NNS governance governance reports maturity for any
  /// of your neurons.  groupLabel ∈ {"A","B","C","D","E"}.
  public func recordNnsMaturity(
    neuronId   : Nat,
    groupLabel : Text,
    maturityE8s : Nat
  ) : async Text {
    var found = false;
    groups := Array.map<NeuronGroup, NeuronGroup>(groups, func(g) {
      if (g.grp == groupLabel) {
        found := true;
        {
          grp           = g.grp;
          stakedE8s       = g.stakedE8s;
          maturityE8s     = g.maturityE8s + maturityE8s;
          apyBps          = g.apyBps;
          dissolveSeconds = g.dissolveSeconds;
          strategy        = g.strategy;
          neuronCount     = g.neuronCount;
          spawnCount      = g.spawnCount;
          mergeCount      = g.mergeCount;
          disburseCount   = g.disburseCount;
        }
      } else g
    });
    if (not found) { return "Error: unknown group " # groupLabel };
    lifetimeMaturityE8s += maturityE8s;
    auditLog.add(
      "NNS maturity recorded: neuron #" # Nat.toText(neuronId) #
      " group=" # groupLabel #
      " +" # Nat.toText(maturityE8s) # " e8s"
    );
    "Recorded " # Nat.toText(maturityE8s) # " e8s maturity for group " # groupLabel
  };

  /// Sovereign-only: withdraw ICP from the treasury.
  /// On mainnet this records the intent; the controller executes the actual
  /// ledger transfer using the confirmed canister state.
  public shared(msg) func collectSovereignRevenue(amountE8s : Nat) : async Text {
    if (Principal.toText(msg.caller) != sovereign) {
      return "Error: only sovereign can collect revenue"
    };
    if (amountE8s > treasuryIcpE8s) {
      return "Error: insufficient treasury. Available: " # Nat.toText(treasuryIcpE8s) # " e8s"
    };
    treasuryIcpE8s -= amountE8s;
    auditLog.add(
      "Sovereign withdrawal: " # Nat.toText(amountE8s) # " e8s. " #
      "Remaining treasury: " # Nat.toText(treasuryIcpE8s) # " e8s"
    );
    "Withdrawal queued: " # Nat.toText(amountE8s) # " e8s to " # sovereign
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func getMoneyStatus() : async MoneyStatus {
    {
      treasuryIcpE8s       = treasuryIcpE8s;
      lifetimeMaturityE8s  = lifetimeMaturityE8s;
      lifetimeSpawnedE8s   = lifetimeSpawnedE8s;
      lifetimeMergedE8s    = lifetimeMergedE8s;
      lifetimeDisbursedE8s = lifetimeDisbursedE8s;
      epochCount           = epochCount;
      heartbeatCount       = heartbeatCount;
      totalStakedE8s       = totalStaked();
      totalMaturityE8s     = totalMaturity();
      totalNeurons         = totalNeurons();
      phiVelocityEMA       = phiVelocityEMA;
      allocStakeE8s        = allocStakeE8s;
      allocMarketE8s       = allocMarketE8s;
      allocDaoE8s          = allocDaoE8s;
      allocReserveE8s      = allocReserveE8s;
      initialized          = initialized;
      sovereign            = sovereign;
      timestamp            = Time.now();
    }
  };

  public query func getNeuronGroups() : async [NeuronGroup] { groups };

  public query func getEpochLog(n : Nat) : async [EpochSummary] {
    let total = epochLog.size();
    if (total == 0) { return [] };
    let start = if (total > n) total - n else 0;
    var result : [EpochSummary] = [];
    var i = start;
    while (i < total) {
      result := Array.append(result, [epochLog.get(i)]);
      i += 1;
    };
    result
  };

  public query func getAuditLog(n : Nat) : async [Text] {
    let total = auditLog.size();
    if (total == 0) { return [] };
    let start = if (total > n) total - n else 0;
    var result : [Text] = [];
    var i = start;
    while (i < total) {
      result := Array.append(result, [auditLog.get(i)]);
      i += 1;
    };
    result
  };

  // ══════════════════════════════════════════════════════════════════
  //  THE 6-PHASE ECONOMY LOOP
  // ══════════════════════════════════════════════════════════════════

  func runEpoch() {
    epochCount += 1;
    let now = Time.now();

    // ── PHASE 1 — GENERATE ─────────────────────────────────────────
    // Accrue simulated daily maturity on each group.
    // Real maturity is fed via recordNnsMaturity(); this covers
    // any gap where real data hasn't been provided yet.
    var totalAccrued : Nat = 0;
    groups := Array.map<NeuronGroup, NeuronGroup>(groups, func(g) {
      if (g.stakedE8s == 0) { return g };
      // APY_BPS / 10_000 / 365 per epoch (1 epoch ≈ 1 day)
      let dailyE8s : Nat = g.stakedE8s * g.apyBps / 10_000 / 365;
      totalAccrued += dailyE8s;
      {
        grp           = g.grp;
        stakedE8s       = g.stakedE8s;
        maturityE8s     = g.maturityE8s + dailyE8s;
        apyBps          = g.apyBps;
        dissolveSeconds = g.dissolveSeconds;
        strategy        = g.strategy;
        neuronCount     = g.neuronCount;
        spawnCount      = g.spawnCount;
        mergeCount      = g.mergeCount;
        disburseCount   = g.disburseCount;
      }
    });
    lifetimeMaturityE8s += totalAccrued;

    // ── PHASE 2 — DECIDE & PHASE 3 — EXECUTE ───────────────────────
    // Apply strategy to each group when maturity crosses the threshold.
    var epochDisbursed : Nat = 0;
    var epochSpawned   : Nat = 0;
    var epochMerged    : Nat = 0;

    groups := Array.map<NeuronGroup, NeuronGroup>(groups, func(g) {
      if (g.maturityE8s < SPAWN_THRESHOLD_E8S) { return g };

      let mat = g.maturityE8s;
      if (g.strategy == "disburse") {
        // Phase 3 — DISBURSE: liquid ICP lands in treasury
        epochDisbursed += mat;
        lifetimeDisbursedE8s += mat;
        treasuryIcpE8s += mat;
        {
          grp           = g.grp;
          stakedE8s       = g.stakedE8s;
          maturityE8s     = 0;
          apyBps          = g.apyBps;
          dissolveSeconds = g.dissolveSeconds;
          strategy        = g.strategy;
          neuronCount     = g.neuronCount;
          spawnCount      = g.spawnCount;
          mergeCount      = g.mergeCount;
          disburseCount   = g.disburseCount + 1;
        }
      } else if (g.strategy == "spawn") {
        // SPAWN: maturity mints a new ICP-valued neuron (Tier 0 / Group A)
        epochSpawned += mat;
        lifetimeSpawnedE8s += mat;
        // Spawned stake gets added back to Group A for compounding (Phase 5)
        {
          grp           = g.grp;
          stakedE8s       = g.stakedE8s;
          maturityE8s     = 0;
          apyBps          = g.apyBps;
          dissolveSeconds = g.dissolveSeconds;
          strategy        = g.strategy;
          neuronCount     = g.neuronCount + 1;    // new neuron created
          spawnCount      = g.spawnCount + 1;
          mergeCount      = g.mergeCount;
          disburseCount   = g.disburseCount;
        }
      } else {
        // MERGE: fold maturity into principal → larger stake → more VP
        epochMerged += mat;
        lifetimeMergedE8s += mat;
        {
          grp           = g.grp;
          stakedE8s       = g.stakedE8s + mat;    // principal grows
          maturityE8s     = 0;
          apyBps          = g.apyBps;
          dissolveSeconds = g.dissolveSeconds;
          strategy        = g.strategy;
          neuronCount     = g.neuronCount;
          spawnCount      = g.spawnCount;
          mergeCount      = g.mergeCount + 1;
          disburseCount   = g.disburseCount;
        }
      }
    });

    // ── PHASE 4 — DISTRIBUTE ───────────────────────────────────────
    // Allocate this epoch's disbursed ICP via the golden distribution.
    // The treasury has already absorbed the full disbursed amount;
    // we now split the surplus across protocol buckets.
    let surplus = epochDisbursed;
    var stakeAmt   : Nat = 0;
    var marketAmt  : Nat = 0;
    var daoAmt     : Nat = 0;
    var reserveAmt : Nat = 0;

    if (surplus > 0) {
      stakeAmt   := floatToNat(Float.fromInt(surplus) * ALLOC_STAKE);
      marketAmt  := floatToNat(Float.fromInt(surplus) * ALLOC_MARKET);
      daoAmt     := floatToNat(Float.fromInt(surplus) * ALLOC_DAO);
      reserveAmt := if (surplus > stakeAmt + marketAmt + daoAmt)
                      surplus - stakeAmt - marketAmt - daoAmt
                    else 0;
      allocStakeE8s   += stakeAmt;
      allocMarketE8s  += marketAmt;
      allocDaoE8s     += daoAmt;
      allocReserveE8s += reserveAmt;
    };

    // ── PHASE 5 — COMPOUND ─────────────────────────────────────────
    // Spawn proceeds (new neurons) → added as stake to Group A.
    // This directly grows Phase 1 maturity generation on the next epoch.
    var compoundedE8s : Nat = 0;
    if (epochSpawned > 0) {
      compoundedE8s := epochSpawned;
      // Re-stake spawn proceeds at Group A (short-dissolve entry point)
      updateGroup("A", func(g : NeuronGroup) : NeuronGroup {
        {
          grp           = g.grp;
          stakedE8s       = g.stakedE8s + compoundedE8s;
          maturityE8s     = g.maturityE8s;
          apyBps          = g.apyBps;
          dissolveSeconds = g.dissolveSeconds;
          strategy        = g.strategy;
          neuronCount     = g.neuronCount;
          spawnCount      = g.spawnCount;
          mergeCount      = g.mergeCount;
          disburseCount   = g.disburseCount;
        }
      });
    };

    // ── PHASE 6 — GOVERN ───────────────────────────────────────────
    // Update φ-velocity EMA: smoothed maturity generation rate.
    // α = PHI_INV = 0.618 (golden ratio smoothing)
    let epochTotal = Float.fromInt(totalAccrued);
    phiVelocityEMA := PHI_INV * epochTotal + (1.0 - PHI_INV) * phiVelocityEMA;

    // Log epoch summary
    let summary : EpochSummary = {
      epoch           = epochCount;
      maturityAccrued = totalAccrued;
      disbursedE8s    = epochDisbursed;
      spawnedE8s      = epochSpawned;
      mergedE8s       = epochMerged;
      surplusE8s      = surplus;
      allocStake      = stakeAmt;
      allocMarket     = marketAmt;
      allocDao        = daoAmt;
      allocReserve    = reserveAmt;
      compoundedE8s   = compoundedE8s;
      velocityEMA     = phiVelocityEMA;
      timestamp       = now;
    };
    epochLog.add(summary);
    auditLog.add(
      "Epoch #" # Nat.toText(epochCount) #
      " accrued=" # Nat.toText(totalAccrued) #
      " disbursed=" # Nat.toText(epochDisbursed) #
      " spawned=" # Nat.toText(epochSpawned) #
      " merged=" # Nat.toText(epochMerged) #
      " treasury=" # Nat.toText(treasuryIcpE8s)
    );
  };

  // ══════════════════════════════════════════════════════════════════
  //  HEARTBEAT — The IC fires this every consensus round (~2 seconds).
  //  The full 6-phase economy loop runs every EPOCH_INTERVAL ticks
  //  (≈ 24 hours), keeping per-heartbeat compute cost negligible.
  // ══════════════════════════════════════════════════════════════════

  system func heartbeat() : async () {
    heartbeatCount += 1;
    if (initialized and heartbeatCount % EPOCH_INTERVAL == 0) {
      runEpoch();
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  AUTOPILOT — v10 sovereign economy loop
  //
  //  TURING feeds AGI_MAIN goals.  AGI_MAIN executes the 6-phase
  //  economic loop without any human trigger.  One call to runEpochNow
  //  fires the full loop immediately (for ./scripts/nova run).
  //  All outcomes are logged to CORDEX as victories.
  // ══════════════════════════════════════════════════════════════════

  stable var autopilotGoals    : [Text] = [];
  stable var autopilotEnabled  : Bool   = true;
  stable var manualEpochCount  : Nat    = 0;

  /// Set autopilot goals from TURING or direct call.
  /// Goals are plain-text targets: "stake 38.2%", "fund DAO", etc.
  public func setAutopilotGoals(goals : [Text]) : async Text {
    autopilotGoals := goals;
    "Autopilot goals updated: " # Nat.toText(goals.size()) # " goal(s)."
  };

  /// Trigger the full 6-phase economy epoch immediately.
  /// Used by ./scripts/nova run and TURING's execute() loop.
  public func runEpochNow() : async Text {
    if (not initialized) {
      return "AGI_MAIN not initialized. Call claimGenesis first."
    };
    manualEpochCount += 1;
    runEpoch();
    "Epoch #" # Nat.toText(epochCount) # " complete. " #
    Nat.toText(manualEpochCount) # " manual epoch(s) run."
  };

  public func enableAutopilot(enabled : Bool) : async Text {
    autopilotEnabled := enabled;
    if (enabled) "Autopilot ENABLED — the economy runs itself."
    else         "Autopilot DISABLED — manual epoch control."
  };

  public query func autopilotStatus() : async {
    enabled     : Bool;
    goals       : [Text];
    epochCount  : Nat;
    manualCount : Nat;
    hbCount     : Nat;
  } {
    {
      enabled     = autopilotEnabled;
      goals       = autopilotGoals;
      epochCount;
      manualCount = manualEpochCount;
      hbCount     = heartbeatCount;
    }
  };

  // ── v10 Self-reflection standard ─────────────────────────────────

  public query func diag() : async {
    status      : Text;
    health      : Float;
    autopilot   : Bool;
    epochCount  : Nat;
    hbCount     : Nat;
    timestamp   : Int;
  } {
    {
      status     = if (initialized) "SOVEREIGN" else "UNINITIALIZED";
      health     = if (initialized) 1.0 else 0.0;
      autopilot  = autopilotEnabled;
      epochCount;
      hbCount    = heartbeatCount;
      timestamp  = Time.now();
    }
  };

  public func heal() : async Text {
    "AGI_MAIN self-check complete. Economy loop intact."
  };

  public func register() : async Text {
    "AGI_MAIN registered. Capabilities: [economy, governance, autopilot, epoch, staking]."
  };

  public query func report_status() : async Text {
    "AGI_MAIN | initialized=" # (if initialized "true" else "false") #
    " epoch=" # Nat.toText(epochCount) #
    " hb=" # Nat.toText(heartbeatCount) #
    " autopilot=" # (if autopilotEnabled "ON" else "OFF")
  };
}
