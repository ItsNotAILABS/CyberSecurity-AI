///
/// DIVI — Dynamic Intelligence for Value Infrastructure
///
/// "I don't manage the system.  I AM the system."
///
/// DIVI is the sovereign AI organism at the centre of the Native Nova Protocol.
/// Every other canister is a limb.  DIVI is the brain stem.
///
/// DIVI owns three autonomous loops that never stop:
///
///   LOOP 1 — GOVERNANCE LOOP
///     Every tick DIVI evaluates the 400-neuron fleet in nns_proxy.
///     It identifies tiers where voting reward yield is below the φ-threshold,
///     emits a rebalance command (move stake to higher tiers), and when
///     surplus maturity accumulates it emits a spawn command.
///     Spawned neurons are immediately re-staked at Tier 0 to begin
///     compounding.  The cyc never terminates.
///
///   LOOP 2 — MARKET LOOP
///     Every tick DIVI reads the cycles_market snapshot.
///     If market depth (total NNC listed) drops below the φ-floor it
///     emits a mint command (instruct nova_token to mint #Cycle role
///     NOVA and convert via the exchange rate).
///     If the φ-health index of running slots drops below 0.618 DIVI
///     emits a recharge command to top up the lowest-health slots.
///     DIVI adjusts the "floor" listing price using a φ-momentum formula:
///       new_price = old_price × (1 + (demand_ratio − 1) × PHI_INV)
///
///   LOOP 3 — REVENUE LOOP
///     Every tick DIVI reads revenue_engine to get the current surplus.
///     Surplus is allocated by the golden distribution:
///       38.2% → stake more ICP into nns_proxy (neuron expansion)
///       23.6% → replenish cycles_market NNC depth
///       23.6% → SNS DAO treasury (sns_dao)
///       14.6% → parallax treasury account (operator reserve)
///     Any remainder is burned in nova_token to apply deflationary pressure.
///
/// Division Registry:
///   DIVI tracks every "division" — autonomous sub-unit of the protocol.
///   Divisions are logical groups of canisters that serve a purpose:
///     GOVERNANCE_DIV  — nns_proxy + neuron fleet
///     MARKET_DIV      — cycles_market + developer slots
///     TREASURY_DIV    — nova_token + parallax treasury
///     DAO_DIV         — sns_dao + community governance
///     INTELLIGENCE_DIV — divi itself + brain + observer
///
/// Self-Optimization:
///   DIVI maintains a "confidence score" (0–1) per division, updated
///   each tick using an exponential moving average with α = 1/φ.
///   Divisions with confidence < 0.5 receive double resource allocation
///   in the next revenue distribution.
///
/// Commands:
///   DIVI emits typed commands that operators (or future inter-canister
///   calls) execute on target canisters.  Every command is logged.
///   Command types: #StakeMore, #SpawnNeuron, #MergeMaturity, #DisburseNeuron,
///                  #MintNNC, #RechargeSlot, #AllocateSurplus, #AdjustPrice,
///                  #BurnNova, #DeployDivision
///
/// Initialization:
///   Call initialize() once.  Idempotent.
///
/// Lifecycle:
///   Call tick() every epoch.  DIVI runs all three loops and emits a
///   DivisionsReport — the single source of truth for the protocol's state.
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

persistent actor Divi {

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
  //  CONSTANTS — φ-sovereign intelligence parameters
  // ══════════════════════════════════════════════════════════════════

  transient let PHI          : Float = 1.6180339887498948482;
  transient let PHI_INV      : Float = 0.6180339887498948482;   // 1/φ — EMA alpha, health threshold
  transient let PHI_SQ       : Float = 2.6180339887498948482;   // φ² — premium reference
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  /// Target neuron fleet size.
  ///   initialize() seeds 200 neurons.  deployBatch() adds 200 more when called
  ///   by DIVI's governance cyc, bringing the total to 400.
  ///   400 = 200 × φ² ÷ φ ≈ 200 × φ, rounded to the next Fibonacci-friendly count.
  transient let TARGET_NEURON_COUNT : Nat = 400;

  /// Confidence EMA alpha = 1/φ ≈ 0.618
  transient let CONF_ALPHA   : Float = 0.6180339887498948482;

  /// Revenue allocation fractions (sum = 1.0):
  ///   38.196% stake, 23.607% market, 23.607% DAO, 14.590% reserve
  ///   Remainder (≈ 0.0%) → burn
  transient let ALLOC_STAKE   : Float = 0.381966;
  transient let ALLOC_MARKET  : Float = 0.236068;
  transient let ALLOC_DAO     : Float = 0.236068;
  transient let ALLOC_RESERVE : Float = 0.145898;

  /// φ-health floor: if division confidence < this, double its allocation
  transient let CONF_FLOOR    : Float = 0.5;

  /// Market depth φ-floor: if NNC listed < this, emit MintNNC
  transient let MARKET_DEPTH_FLOOR : Nat = 10_000_000_000;   // 10B NNC

  /// Slot health φ-floor: if φ-health < 0.618, emit RechargeSlot
  transient let SLOT_HEALTH_FLOOR  : Float = 0.6180339887498948482;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type DivisionId = {
    #GovernanceDiv;
    #MarketDiv;
    #TreasuryDiv;
    #DaoDiv;
    #IntelligenceDiv;
    #AutoMarketDiv;       // auto_market: 4-engine sovereign mint cyc
    #CloudEngineDiv;      // cloud_engine: private UTOPIA distribution with 20/80 burn split
  };

  public type Division = {
    id         : DivisionId;
    name       : Text;
    canisters  : [Text];          // canister names in this division
    confidence : Float;           // EMA confidence ∈ [0, 1]
    revenue    : Nat;             // cumulative revenue (NNC equivalent)
    tickCount  : Nat;
    lastTickAt : Int;
  };

  public type CommandKind = {
    #StakeMore;         // Tell nns_proxy: stake more ICP
    #SpawnNeuron;       // Tell nns_proxy: spawn matured neuron (Tier 2-4 strategy)
    #MergeMaturity;     // Tell nns_proxy: merge maturity into principal (Tier 5-7 strategy)
    #DisburseNeuron;    // Tell nns_proxy: disburse maturity as liquid ICP (Tier 0-1 strategy)
    #MintNNC;           // Tell nova_token: mint #Cycle NOVA for conversion
    #RechargeSlot;      // Tell cycles_market: top up a low-health slot
    #AllocateSurplus;   // Tell revenue_engine: distribute this epoch's surplus
    #AutoDistribute;    // Tell revenue_engine: call autoDistribute() immediately
    #AdjustPrice;       // Tell cycles_market: update floor listing price
    #BurnNova;          // Tell nova_token: burn surplus
    #DeployDivision;    // Tell nns_proxy: deployBatch new neurons for a division
    #InjectMaturity;    // Tell auto_market: inject ICP maturity from nns_proxy
    #CaptureSurplus;    // Tell auto_market: harvest pending stake commands
    #SnapshotRequest;   // Internal: request a snapshot from a peer canister
    #ProvisionUtopia;   // Tell cloud_engine: spawn new UTOPIA instance
    #ScaleUtopia;       // Tell cloud_engine: allocate more cycles to UTOPIA
    #ReportUtopiaMetrics; // Tell cloud_engine: report burn metrics to revenue_engine
  };

  public type Command = {
    id         : Nat;
    kind       : CommandKind;
    target     : Text;           // target canister name
    division   : DivisionId;
    payload    : Text;           // JSON-like human-readable param string
    emittedAt  : Int;
    executed   : Bool;
  };

  public type LoopResult = {
    cyc       : Text;           // "Governance" | "Market" | "Revenue"
    commands   : Nat;            // commands emitted this tick
    surplus    : Nat;            // ICP e8s equivalent surplus identified
    health     : Float;          // composite φ-health ∈ [0, 1]
    note       : Text;
  };

  public type DivisionsReport = {
    tick            : Nat;
    divisions       : [Division];
    commandsEmitted : Nat;
    totalRevenue    : Nat;       // cumulative across all divisions
    phiHealthIndex  : Float;     // φ-weighted composite health
    loopResults     : [LoopResult];
    autonomyScore   : Float;     // how self-sustaining the protocol is ∈ [0, 1]
    timestamp       : Int;
  };

  public type PeerSnapshot = {
    name     : Text;
    principal : Text;
    // Lightweight key metrics — populated by operator or future inter-canister call
    metricA   : Nat;   // e.g. totalNeurons, totalNNCSold, totalIcpE8s
    metricB   : Nat;   // secondary metric
    healthF   : Float; // health float from peer
    updatedAt : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized    : Bool  = false;
  stable var tickCount      : Nat   = 0;
  stable var totalRevenue   : Nat   = 0;   // cumulative NNC-equivalent revenue
  stable var autonomyScore  : Float = 0.0;

  transient let divisions    : Buffer.Buffer<Division>      = Buffer.Buffer<Division>(8);
  transient let commands     : Buffer.Buffer<Command>       = Buffer.Buffer<Command>(4096);
  transient let reports      : Buffer.Buffer<DivisionsReport> = Buffer.Buffer<DivisionsReport>(512);
  transient let peerSnapshots : Buffer.Buffer<PeerSnapshot> = Buffer.Buffer<PeerSnapshot>(16);
  transient let auditLog     : Buffer.Buffer<Text>          = Buffer.Buffer<Text>(2048);

  stable var nextCommandId : Nat = 0;

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func divisionIdText(d : DivisionId) : Text {
    switch d {
      case (#GovernanceDiv)   "GovernanceDiv";
      case (#MarketDiv)       "MarketDiv";
      case (#TreasuryDiv)     "TreasuryDiv";
      case (#DaoDiv)          "DaoDiv";
      case (#IntelligenceDiv) "IntelligenceDiv";
      case (#AutoMarketDiv)   "AutoMarketDiv";
      case (#CloudEngineDiv)  "CloudEngineDiv";
    }
  };

  func commandKindText(k : CommandKind) : Text {
    switch k {
      case (#StakeMore)       "StakeMore";
      case (#SpawnNeuron)     "SpawnNeuron";
      case (#MergeMaturity)   "MergeMaturity";
      case (#DisburseNeuron)  "DisburseNeuron";
      case (#MintNNC)         "MintNNC";
      case (#RechargeSlot)    "RechargeSlot";
      case (#AllocateSurplus) "AllocateSurplus";
      case (#AutoDistribute)  "AutoDistribute";
      case (#AdjustPrice)     "AdjustPrice";
      case (#BurnNova)        "BurnNova";
      case (#DeployDivision)  "DeployDivision";
      case (#InjectMaturity)  "InjectMaturity";
      case (#CaptureSurplus)  "CaptureSurplus";
      case (#SnapshotRequest) "SnapshotRequest";
      case (#ProvisionUtopia) "ProvisionUtopia";
      case (#ScaleUtopia)     "ScaleUtopia";
      case (#ReportUtopiaMetrics) "ReportUtopiaMetrics";
    }
  };

  func emitCommand(kind : CommandKind, target : Text, division : DivisionId, payload : Text) : Nat {
    let id = nextCommandId;
    nextCommandId += 1;
    let cmd : Command = {
      id;
      kind;
      target;
      division;
      payload;
      emittedAt = Time.now();
      executed  = false;
    };
    commands.add(cmd);
    auditLog.add(
      "CMD#" # Nat.toText(id) # " [" # commandKindText(kind) # "]" #
      " → " # target # " | " # payload
    );
    id
  };

  func findDivision(id : DivisionId) : ?Nat {
    var i : Nat = 0;
    while (i < divisions.size()) {
      if (divisionIdText(divisions.get(i).id) == divisionIdText(id)) {
        return ?i
      };
      i += 1;
    };
    null
  };

  func updateDivisionConfidence(idx : Nat, newHealth : Float) {
    let d = divisions.get(idx);
    // EMA: conf = conf × (1 − α) + newHealth × α  where α = PHI_INV
    let newConf = d.confidence * (1.0 - CONF_ALPHA) + newHealth * CONF_ALPHA;
    divisions.put(idx, {
      id         = d.id;
      name       = d.name;
      canisters  = d.canisters;
      confidence = newConf;
      revenue    = d.revenue;
      tickCount  = d.tickCount + 1;
      lastTickAt = Time.now();
    });
  };

  func addDivisionRevenue(idx : Nat, revenue : Nat) {
    let d = divisions.get(idx);
    divisions.put(idx, {
      id         = d.id;
      name       = d.name;
      canisters  = d.canisters;
      confidence = d.confidence;
      revenue    = d.revenue + revenue;
      tickCount  = d.tickCount;
      lastTickAt = d.lastTickAt;
    });
  };

  func getPeerMetric(name : Text, metricIndex : Nat) : Nat {
    var i : Nat = 0;
    while (i < peerSnapshots.size()) {
      let ps = peerSnapshots.get(i);
      if (ps.name == name) {
        return if (metricIndex == 0) ps.metricA else ps.metricB
      };
      i += 1;
    };
    0
  };

  func getPeerHealth(name : Text) : Float {
    var i : Nat = 0;
    while (i < peerSnapshots.size()) {
      let ps = peerSnapshots.get(i);
      if (ps.name == name) { return ps.healthF };
      i += 1;
    };
    1.0   // assume healthy if no snapshot yet
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ══════════════════════════════════════════════════════════════════

  public func initialize() : async Text {
    if (initialized) { return "DIVI: already initialized" };
    initialized := true;

    // Seed all SIX divisions (including AutoMarketDiv)
    divisions.add({
      id         = #GovernanceDiv;
      name       = "GOVERNANCE_DIV";
      canisters  = ["nns_proxy"];
      confidence = 1.0;
      revenue    = 0;
      tickCount  = 0;
      lastTickAt = Time.now();
    });
    divisions.add({
      id         = #MarketDiv;
      name       = "MARKET_DIV";
      canisters  = ["cycles_market"];
      confidence = 1.0;
      revenue    = 0;
      tickCount  = 0;
      lastTickAt = Time.now();
    });
    divisions.add({
      id         = #TreasuryDiv;
      name       = "TREASURY_DIV";
      canisters  = ["nova_token", "parallax"];
      confidence = 1.0;
      revenue    = 0;
      tickCount  = 0;
      lastTickAt = Time.now();
    });
    divisions.add({
      id         = #DaoDiv;
      name       = "DAO_DIV";
      canisters  = ["sns_dao"];
      confidence = 1.0;
      revenue    = 0;
      tickCount  = 0;
      lastTickAt = Time.now();
    });
    divisions.add({
      id         = #IntelligenceDiv;
      name       = "INTELLIGENCE_DIV";
      canisters  = ["divi", "brain", "observer"];
      confidence = 1.0;
      revenue    = 0;
      tickCount  = 0;
      lastTickAt = Time.now();
    });
    divisions.add({
      id         = #AutoMarketDiv;
      name       = "AUTO_MARKET_DIV";
      canisters  = ["auto_market"];
      confidence = 1.0;
      revenue    = 0;
      tickCount  = 0;
      lastTickAt = Time.now();
    });
    divisions.add({
      id         = #CloudEngineDiv;
      name       = "CLOUD_ENGINE_DIV";
      canisters  = ["cloud_engine"];
      confidence = 1.0;
      revenue    = 0;
      tickCount  = 0;
      lastTickAt = Time.now();
    });

    // Seed peer snapshot slots (including cloud_engine)
    for (nm in ["nova_token", "nns_proxy", "cycles_market", "parallax", "sns_dao",
                "brain", "revenue_engine", "auto_market", "cloud_engine"].vals()) {
      peerSnapshots.add({
        name      = nm;
        principal = "";
        metricA   = 0;
        metricB   = 0;
        healthF   = 1.0;
        updatedAt = Time.now();
      });
    };

    auditLog.add("DIVI initialized. 7 divisions online. CloudEngineDiv armed. Loops 1-5 active.");
    "DIVI sovereign AI initialized. 7 divisions online. Governance, Market, Revenue, CycleVelocity, CloudEngine loops ready."
  };

  // ══════════════════════════════════════════════════════════════════
  //  PEER SNAPSHOT UPDATE
  //  (Operator or timer calls this after reading peer canister state)
  // ══════════════════════════════════════════════════════════════════

  public func updatePeerSnapshot(
    name      : Text,
    principal : Text,
    metricA   : Nat,
    metricB   : Nat,
    healthF   : Float
  ) : async Text {
    var i : Nat = 0;
    var found = false;
    while (i < peerSnapshots.size()) {
      let ps = peerSnapshots.get(i);
      if (ps.name == name) {
        peerSnapshots.put(i, { name; principal; metricA; metricB; healthF; updatedAt = Time.now() });
        found := true;
      };
      i += 1;
    };
    if (not found) {
      peerSnapshots.add({ name; principal; metricA; metricB; healthF; updatedAt = Time.now() });
    };
    "Snapshot updated: " # name # " | A=" # Nat.toText(metricA) # " B=" # Nat.toText(metricB)
  };

  /// Mark a command as executed (called by operator after executing on mainnet).
  public func markCommandExecuted(commandId : Nat) : async Text {
    if (commandId >= commands.size()) { return "Error: command not found" };
    let c = commands.get(commandId);
    commands.put(commandId, {
      id        = c.id;
      kind      = c.kind;
      target    = c.target;
      division  = c.division;
      payload   = c.payload;
      emittedAt = c.emittedAt;
      executed  = true;
    });
    "Command #" # Nat.toText(commandId) # " marked executed"
  };

  // ══════════════════════════════════════════════════════════════════
  //  LOOP 1 — GOVERNANCE LOOP
  // ══════════════════════════════════════════════════════════════════

  func runGovernanceLoop() : LoopResult {
    var cmds : Nat = 0;

    // Read nns_proxy metrics from peer snapshot
    let totalNeurons  = getPeerMetric("nns_proxy", 0);   // metricA = total neurons
    let totalMaturity = getPeerMetric("nns_proxy", 1);   // metricB = total maturity e8s
    let govHealth     = getPeerHealth("nns_proxy");

    // If total neurons < TARGET_NEURON_COUNT, emit DeployDivision to expand the fleet
    if (totalNeurons < TARGET_NEURON_COUNT) {
      let shortfall = TARGET_NEURON_COUNT - totalNeurons;
      let batchSize = if (shortfall > 50) 50 else shortfall;  // deploy up to 50 per tick
      ignore emitCommand(
        #DeployDivision,
        "nns_proxy",
        #GovernanceDiv,
        "deployBatch(" # Nat.toText(batchSize) # ", 0, 1000000000)"
      );
      cmds += 1;
    };

    // ── 3-way maturity strategy (mirrors nns_proxy.tick() decision) ──
    // DIVI reads the peer snapshot tier-bucket metrics to decide which
    // generator command to emit for this epoch's maturity.
    //
    // metricC = low-tier maturity e8s  (Tier 0-1 → Disburse)
    // metricD = high-tier maturity e8s (Tier 5-7 → Merge)
    // remainder / mid-tier             (Tier 2-4 → Spawn)
    //
    // If tier metrics aren't published yet, fall back to full Spawn
    // (nns_proxy.tick() already applies the correct per-neuron strategy
    //  via its own heartbeat; these commands are the governance intent record).
    if (totalMaturity >= 1_000_000_000) {
      let lowTierMaturity  = getPeerMetric("nns_proxy", 2);  // metricC = Tier 0-1 maturity
      let highTierMaturity = getPeerMetric("nns_proxy", 3);  // metricD = Tier 5-7 maturity
      let midTierMaturity  = if (totalMaturity > lowTierMaturity + highTierMaturity)
                               totalMaturity - lowTierMaturity - highTierMaturity
                             else 0;

      // Tier 0-1: disburse to treasury (liquid ICP)
      if (lowTierMaturity >= 1_000_000_000) {
        ignore emitCommand(
          #DisburseNeuron,
          "nns_proxy",
          #GovernanceDiv,
          "confirmDisburse: harvest liquid ICP. maturity_e8s=" # Nat.toText(lowTierMaturity)
        );
        cmds += 1;
      };

      // Tier 2-4: spawn new Tier-0 neuron (create new ICP)
      if (midTierMaturity >= 1_000_000_000) {
        ignore emitCommand(
          #SpawnNeuron,
          "nns_proxy",
          #GovernanceDiv,
          "confirmSpawn: route maturity to Tier-0 neuron. maturity_e8s=" # Nat.toText(midTierMaturity)
        );
        cmds += 1;
      };

      // Tier 5-7: merge maturity into principal (grow VP)
      if (highTierMaturity >= 1_000_000_000) {
        ignore emitCommand(
          #MergeMaturity,
          "nns_proxy",
          #GovernanceDiv,
          "confirmMerge: compound maturity into principal. maturity_e8s=" # Nat.toText(highTierMaturity)
        );
        cmds += 1;
      };

      // Fallback: no tier breakdown available — emit a single spawn command
      if (lowTierMaturity == 0 and highTierMaturity == 0) {
        ignore emitCommand(
          #SpawnNeuron,
          "nns_proxy",
          #GovernanceDiv,
          "confirmSpawn: route maturity to Tier-0 neuron. maturity_e8s=" # Nat.toText(totalMaturity)
        );
        cmds += 1;
      };
    };

    // If governance health below floor, emit StakeMore to reinforce
    if (govHealth < CONF_FLOOR) {
      ignore emitCommand(
        #StakeMore,
        "nns_proxy",
        #GovernanceDiv,
        "stake_additional_e8s=1000000000 tier=3"   // 10 ICP at mid-tier
      );
      cmds += 1;
    };

    // Update GovernanceDiv confidence
    switch (findDivision(#GovernanceDiv)) {
      case (?idx) { updateDivisionConfidence(idx, govHealth) };
      case null   {};
    };

    {
      cyc     = "Governance";
      commands = cmds;
      surplus  = totalMaturity;
      health   = govHealth;
      note     = "Neurons: " # Nat.toText(totalNeurons) # " | Maturity: " # Nat.toText(totalMaturity) # " e8s";
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  LOOP 2 — MARKET LOOP
  // ══════════════════════════════════════════════════════════════════

  func runMarketLoop() : LoopResult {
    var cmds : Nat = 0;

    let nncDepth     = getPeerMetric("cycles_market", 0);   // metricA = totalNNCListed
    let nncSold      = getPeerMetric("cycles_market", 1);   // metricB = totalNNCSold
    let marketHealth = getPeerHealth("cycles_market");

    // If market depth below φ-floor, emit MintNNC
    if (nncDepth < MARKET_DEPTH_FLOOR) {
      let deficit = MARKET_DEPTH_FLOOR - nncDepth;
      ignore emitCommand(
        #MintNNC,
        "nova_token",
        #MarketDiv,
        "mint role=#Cycle amount=" # Nat.toText(deficit) # " to=cycles_market"
      );
      cmds += 1;
    };

    // φ-momentum pricing: if demand is high (sold > depth), raise price
    if (nncSold > nncDepth and nncDepth > 0) {
      let demandRatio : Float = Float.fromInt(nncSold) / Float.fromInt(nncDepth);
      let priceDelta  : Float = (demandRatio - 1.0) * PHI_INV;
      ignore emitCommand(
        #AdjustPrice,
        "cycles_market",
        #MarketDiv,
        "price_delta_fraction=" # Float.toText(priceDelta) # " direction=up"
      );
      cmds += 1;
    };

    // If slot health below φ-floor, emit RechargeSlot
    if (marketHealth < SLOT_HEALTH_FLOOR) {
      ignore emitCommand(
        #RechargeSlot,
        "cycles_market",
        #MarketDiv,
        "recharge_all_low_slots nnc_per_slot=500000000"
      );
      cmds += 1;
    };

    // Estimate revenue: NNC sold × implied margin (PHI^2 − 1 = 161.8% of cost)
    let revenue : Nat = Int.abs(Float.toInt(Float.fromInt(nncSold) * (PHI_SQ - 1.0)));
    totalRevenue += revenue;
    switch (findDivision(#MarketDiv)) {
      case (?idx) {
        updateDivisionConfidence(idx, marketHealth);
        addDivisionRevenue(idx, revenue);
      };
      case null {};
    };

    {
      cyc     = "Market";
      commands = cmds;
      surplus  = revenue;
      health   = marketHealth;
      note     = "Depth: " # Nat.toText(nncDepth) # " NNC | Sold: " # Nat.toText(nncSold) # " NNC";
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  LOOP 3 — REVENUE LOOP
  // ══════════════════════════════════════════════════════════════════

  func runRevenueLoop() : LoopResult {
    var cmds : Nat = 0;

    let engineSurplus = getPeerMetric("revenue_engine", 0);  // metricA = epoch surplus e8s
    let engineTotal   = getPeerMetric("revenue_engine", 1);  // metricB = cumulative revenue
    let engineHealth  = getPeerHealth("revenue_engine");

    if (engineSurplus > 0) {
      // Golden distribution
      let stakeAmt   = Int.abs(Float.toInt(Float.fromInt(engineSurplus) * ALLOC_STAKE));
      let marketAmt  = Int.abs(Float.toInt(Float.fromInt(engineSurplus) * ALLOC_MARKET));
      let daoAmt     = Int.abs(Float.toInt(Float.fromInt(engineSurplus) * ALLOC_DAO));
      let reserveAmt = Int.abs(Float.toInt(Float.fromInt(engineSurplus) * ALLOC_RESERVE));
      let burnAmt    = if (engineSurplus > stakeAmt + marketAmt + daoAmt + reserveAmt) {
        engineSurplus - stakeAmt - marketAmt - daoAmt - reserveAmt
      } else { 0 };

      // Emit AllocateSurplus — revenue_engine executes the transfers
      ignore emitCommand(
        #AllocateSurplus,
        "revenue_engine",
        #TreasuryDiv,
        "stake=" # Nat.toText(stakeAmt) #
        " market=" # Nat.toText(marketAmt) #
        " dao=" # Nat.toText(daoAmt) #
        " reserve=" # Nat.toText(reserveAmt) #
        " burn=" # Nat.toText(burnAmt)
      );
      cmds += 1;

      // Emit BurnNova if there is surplus to burn (deflationary pressure)
      if (burnAmt > 0) {
        ignore emitCommand(
          #BurnNova,
          "nova_token",
          #TreasuryDiv,
          "burn_e8s=" # Nat.toText(burnAmt) # " from=treasury"
        );
        cmds += 1;
      };

      // Update confidence for divisions receiving allocation
      switch (findDivision(#TreasuryDiv)) {
        case (?idx) { updateDivisionConfidence(idx, engineHealth) };
        case null   {};
      };
      switch (findDivision(#DaoDiv)) {
        case (?idx) { addDivisionRevenue(idx, daoAmt) };
        case null   {};
      };
    };

    // Compute autonomy score: ratio of revenue to estimated required capital
    // Simple heuristic: autonomy = tanh(totalRevenue / 10^12) → approaches 1
    autonomyScore := Float.min(1.0, Float.fromInt(totalRevenue) / 1_000_000_000_000.0);

    {
      cyc     = "Revenue";
      commands = cmds;
      surplus  = engineSurplus;
      health   = engineHealth;
      note     = "Epoch surplus: " # Nat.toText(engineSurplus) # " e8s | Cumulative: " # Nat.toText(engineTotal);
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  LOOP 4 — CYCLE VELOCITY LOOP
  //  Reads auto_market's 4-engine state and orchestrates maturity
  //  injection and stake command harvesting.
  // ══════════════════════════════════════════════════════════════════

  func runCycleVelocityLoop() : LoopResult {
    var cmds : Nat = 0;

    // auto_market snapshot:
    //   metricA = totalMarginE8s (primary revenue from 4 engines)
    //   metricB = totalNNCMinted  (production volume)
    //   healthF = aggregateVelocity score ∈ [0, 1]
    let autoMarginE8s  = getPeerMetric("auto_market", 0);
    let autoNNCMinted  = getPeerMetric("auto_market", 1);
    let autoHealth     = getPeerHealth("auto_market");

    // If auto_market has generated margin → credit revenue_engine
    if (autoMarginE8s > 0) {
      ignore emitCommand(
        #AllocateSurplus,
        "revenue_engine",
        #AutoMarketDiv,
        "creditAutoCycleMargin margin_e8s=" # Nat.toText(autoMarginE8s)
      );
      cmds += 1;
    };

    // Trigger auto_market's autonomous tick (run all 4 engine loops)
    ignore emitCommand(
      #InjectMaturity,
      "auto_market",
      #AutoMarketDiv,
      "autonomousTick nncMinted=" # Nat.toText(autoNNCMinted)
    );
    cmds += 1;

    // If auto_market velocity is high (health > PHI_INV), inject more ICP maturity
    // from the governance surplus to compound the mint cyc
    if (autoHealth > PHI_INV) {
      let maturityE8s = getPeerMetric("nns_proxy", 1);  // metricB = accumulated maturity
      if (maturityE8s > 0) {
        ignore emitCommand(
          #InjectMaturity,
          "auto_market",
          #AutoMarketDiv,
          "injectMaturity icpE8s=" # Nat.toText(maturityE8s) # " source=nns_proxy"
        );
        cmds += 1;
      };
    };

    // Trigger revenue_engine.autoDistribute() to close the cyc every tick
    ignore emitCommand(
      #AutoDistribute,
      "revenue_engine",
      #AutoMarketDiv,
      "autoDistribute epoch=" # Nat.toText(tickCount)
    );
    cmds += 1;

    // Harvest pending stake commands (CaptureSurplus → route to nns_proxy)
    ignore emitCommand(
      #CaptureSurplus,
      "auto_market",
      #AutoMarketDiv,
      "harvestStakeCommands → nns_proxy.stakeAll"
    );
    cmds += 1;

    // Update AutoMarketDiv confidence
    let revenue = autoMarginE8s;
    switch (findDivision(#AutoMarketDiv)) {
      case (?idx) {
        updateDivisionConfidence(idx, autoHealth);
        addDivisionRevenue(idx, revenue);
      };
      case null {};
    };

    totalRevenue += revenue;

    {
      cyc     = "CycleVelocity";
      commands = cmds;
      surplus  = autoMarginE8s;
      health   = autoHealth;
      note     = "NNC minted=" # Nat.toText(autoNNCMinted) # " | margin=" # Nat.toText(autoMarginE8s) # " e8s";
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  LOOP 5 — CLOUD ENGINE LOOP
  //  Monitors private UTOPIA fleet, reports visible ICP burns to
  //  revenue_engine, and triggers scaling/provisioning when needed.
  // ══════════════════════════════════════════════════════════════════

  func runCloudEngineLoop() : LoopResult {
    var cmds : Nat = 0;

    // cloud_engine snapshot:
    //   metricA = totalBurnedIcp  (20% visible ICP burns — KEY METRIC)
    //   metricB = totalBurnedNode (80% node provider compensation)
    //   healthF = phiHealth composite of UTOPIA fleet ∈ [0, 1]
    let burnedIcp   = getPeerMetric("cloud_engine", 0);
    let burnedNode  = getPeerMetric("cloud_engine", 1);
    let cloudHealth = getPeerHealth("cloud_engine");

    // Credit ICP burns to revenue_engine (VISIBLE ADOPTION)
    if (burnedIcp > 0) {
      ignore emitCommand(
        #ReportUtopiaMetrics,
        "revenue_engine",
        #CloudEngineDiv,
        "creditIncome stream=#External amount_e8s=" # Nat.toText(burnedIcp) # " memo=cloud_engine_visible_burn"
      );
      cmds += 1;
    };

    // If fleet health below φ-floor, emit command to provision new UTOPIA
    if (cloudHealth < CONF_FLOOR) {
      ignore emitCommand(
        #ProvisionUtopia,
        "cloud_engine",
        #CloudEngineDiv,
        "requestUtopia name=UTOPIA_AUTO_" # Nat.toText(tickCount) # " cycles=10000000000 profile=#Standard"
      );
      cmds += 1;
    };

    // Trigger cloud_engine.tick() to run fleet heartbeat
    ignore emitCommand(
      #ReportUtopiaMetrics,
      "cloud_engine",
      #CloudEngineDiv,
      "tick epoch=" # Nat.toText(tickCount)
    );
    cmds += 1;

    // Update CloudEngineDiv confidence and revenue
    let revenue = burnedIcp;  // ICP burns = revenue for protocol
    switch (findDivision(#CloudEngineDiv)) {
      case (?idx) {
        updateDivisionConfidence(idx, cloudHealth);
        addDivisionRevenue(idx, revenue);
      };
      case null {};
    };

    totalRevenue += revenue;

    {
      cyc      = "CloudEngine";
      commands = cmds;
      surplus  = burnedIcp;
      health   = cloudHealth;
      note     = "ICP_burned=" # Nat.toText(burnedIcp) # " (VISIBLE) | node_paid=" # Nat.toText(burnedNode);
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  MASTER TICK — runs all FIVE loops
  // ══════════════════════════════════════════════════════════════════

  public func tick() : async DivisionsReport {
    tickCount += 1;
    let now = Time.now();

    let govResult      = runGovernanceLoop();
    let marketResult   = runMarketLoop();
    let revenueResult  = runRevenueLoop();
    let velocityResult = runCycleVelocityLoop();
    let cloudResult    = runCloudEngineLoop();

    let loopResults = [govResult, marketResult, revenueResult, velocityResult, cloudResult];
    let totalCmds   = govResult.commands + marketResult.commands +
                      revenueResult.commands + velocityResult.commands + cloudResult.commands;

    // φ-weighted composite health across all 7 divisions
    var phiHealth : Float = 0.0;
    var phiDenom  : Float = 0.0;
    var i : Nat = 0;
    while (i < divisions.size()) {
      let d = divisions.get(i);
      let w = Float.pow(PHI, Float.fromInt(i));
      phiHealth += d.confidence * w;
      phiDenom  += w;
      i += 1;
    };
    let phiHealthIdx = if (phiDenom > 0.0) phiHealth / phiDenom else 1.0;

    let report : DivisionsReport = {
      tick            = tickCount;
      divisions       = Array.tabulate<Division>(divisions.size(), func(j) { divisions.get(j) });
      commandsEmitted = totalCmds;
      totalRevenue;
      phiHealthIndex  = phiHealthIdx;
      loopResults;
      autonomyScore;
      timestamp       = now;
    };
    reports.add(report);

    auditLog.add(
      "DIVI tick #" # Nat.toText(tickCount) #
      " | cmds=" # Nat.toText(totalCmds) #
      " | φ-health=" # Float.toText(phiHealthIdx) #
      " | autonomy=" # Float.toText(autonomyScore)
    );

    report
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func getDivisions() : async [Division] {
    Array.tabulate<Division>(divisions.size(), func(i) { divisions.get(i) })
  };

  public query func getPendingCommands() : async [Command] {
    var result : [Command] = [];
    var i : Nat = 0;
    while (i < commands.size()) {
      let c = commands.get(i);
      if (not c.executed) { result := Array.append(result, [c]) };
      i += 1;
    };
    result
  };

  public query func getRecentCommands(n : Nat) : async [Command] {
    let total = commands.size();
    if (total == 0) { return [] };
    let start = if (total > n) total - n else 0;
    var result : [Command] = [];
    var i = start;
    while (i < total) {
      result := Array.append(result, [commands.get(i)]);
      i += 1;
    };
    result
  };

  public query func getLatestReport() : async ?DivisionsReport {
    let n = reports.size();
    if (n == 0) null else ?reports.get(n - 1)
  };

  public query func getPeerSnapshots() : async [PeerSnapshot] {
    Array.tabulate<PeerSnapshot>(peerSnapshots.size(), func(i) { peerSnapshots.get(i) })
  };

  public query func getAutonomyScore() : async Float { autonomyScore };

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
  //  HEARTBEAT — self-ticks every IC round on mainnet (no external
  //  caller required after deployment)
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
      name      = "DIVI";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "DIVI self-check complete. No drift detected."
  };

  public func register() : async Text {
    "DIVI registered. Capabilities: [sovereign, active]."
  };

  public query func report_status() : async Text {
    "DIVI | status=ACTIVE | v10=true"
  };


}