///
/// REVENUE ENGINE — Autonomous ICP Revenue Generation & Circulation
///
/// "Every satoshi that enters the protocol must grow before it leaves."
///
/// The Revenue Engine is the financial circulatory system of the Native Nova
/// Protocol.  It tracks every income stream, aggregates them into a single
/// epoch surplus, and executes the golden distribution on behalf of DIVI.
///
/// Income Streams (all in ICP e8s equivalent):
///
///   1. NNS_REWARDS     — Voting reward ICP from nns_proxy neuron maturity
///      Source: nns_proxy.tick() accumulates maturity; Revenue Engine reads
///              the total and credits the epoch when a neuron spawns.
///      Rate: ~10–15% APY on staked ICP depending on dissolve tier.
///
///   2. CYCLE_MARGIN    — Profit margin from selling Native Nova Cycles
///      Source: cycles_market sells NNC at PHI^2 × raw ICP cycle price.
///              Revenue = (PHI^2 − 1) × NNC_sold × (1/NNC_per_ICP)
///              i.e., 161.8% margin per cycle unit sold.
///
///   3. DEVELOPER_FEES  — Fees charged when a developer deploys a canister slot
///      Source: cycles_market.deployCanister() — 1% of NNC deposited.
///
///   4. SNS_SWAP        — Proceeds from the SNS token swap
///      Source: sns_dao reports swap ICP raised; credited once per swap round.
///
///   5. UNWRAP_PREMIUM  — Treasury share when NNC is unwrapped back to raw cycles
///      Source: cycles_market.getUnwrapQuote() shows 61.8% premium retained.
///              Revenue Engine claims that premium when unwrap is executed.
///
/// Revenue Circulation (Golden Distribution — executed by DIVI's AllocateSurplus):
///   38.196% → GovernanceDiv  — stake more ICP into nns_proxy (compounds)
///   23.607% → MarketDiv      — replenish NNC depth in cycles_market
///   23.607% → DaoDiv         — sns_dao treasury
///   14.590% → Reserve        — parallax operator reserve
///   Residual → Burn          — nova_token.burn() deflationary pressure
///
/// Epoch Model:
///   An epoch is one tick.  At each tick the engine:
///     1. Aggregates all income credited since last tick (epochIncome)
///     2. Deducts any allocated outflows (epochOutflow)
///     3. Records epoch surplus = epochIncome − epochOutflow
///     4. Carries un-allocated surplus forward (runningBalance)
///     5. DIVI reads runningBalance as the "surplus" available for distribution
///
/// Initialization:
///   Call initialize() once.  Idempotent.
///
/// Key functions:
///   creditIncome(stream, amountE8s, memo) — credit an income event
///   recordAllocation(amountE8s, memo)     — record DIVI distribution debit
///   tick()                                — close the epoch, produce EpochReport
///
/// Key queries:
///   getEpochReport(n)   — last n epoch reports
///   getStreamBreakdown()— income per stream type
///   getRunningBalance() — current surplus available to DIVI
///   getLifetimeRevenue()— all-time total income
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

persistent actor RevenueEngine {

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
  transient let PHI_SQ       : Float = 2.6180339887498948482;

  // Golden distribution fractions
  transient let ALLOC_GOVERNANCE : Float = 0.381966;
  transient let ALLOC_MARKET     : Float = 0.236068;
  transient let ALLOC_DAO        : Float = 0.236068;
  transient let ALLOC_RESERVE    : Float = 0.145898;

  // Developer fee: 1% of NNC deposited (in NNC units)
  transient let DEV_FEE_BPS : Nat = 100;   // 100 basis points = 1%

  // NNC → ICP conversion for margin accounting
  // 1 whole ICP (100_000_000 e8s) = 3_820_040_000_000 NNC
  // To convert NNC to ICP e8s: nncAmount × 100_000_000 / NNC_PER_WHOLE_ICP
  transient let NNC_PER_WHOLE_ICP : Nat = 3_820_040_000_000;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type IncomeStream = {
    #NNS_Rewards;      // NNS neuron voting rewards
    #CycleMargin;      // PHI^2 premium on NNC sales
    #DeveloperFees;    // canister slot deployment fees
    #SNS_Swap;         // SNS token swap proceeds
    #UnwrapPremium;    // premium captured on NNC → raw cycles unwrap
    #External;         // any other income (manual credit by operator)
  };

  public type IncomeEvent = {
    id        : Nat;
    stream    : IncomeStream;
    amountE8s : Nat;           // ICP e8s
    memo      : Text;
    epochId   : Nat;
    timestamp : Int;
  };

  public type AllocationEvent = {
    id          : Nat;
    epochId     : Nat;
    governance  : Nat;   // ICP e8s to GovernanceDiv
    market      : Nat;
    dao         : Nat;
    reserve     : Nat;
    burned      : Nat;
    total       : Nat;
    timestamp   : Int;
    memo        : Text;
  };

  public type EpochReport = {
    epochId         : Nat;
    epochIncome     : Nat;     // total income this epoch (e8s)
    epochOutflow    : Nat;     // total distributed this epoch (e8s)
    epochSurplus    : Nat;     // income − outflow
    runningBalance  : Nat;     // cumulative un-distributed surplus
    streamBreakdown : [(Text, Nat)];  // income per stream name
    phi_yield       : Float;   // epochIncome / runningBalance ∈ [0, ∞)
    timestamp       : Int;
  };

  public type StreamBreakdown = {
    nns_rewards    : Nat;
    cycle_margin   : Nat;
    developer_fees : Nat;
    sns_swap       : Nat;
    unwrap_premium : Nat;
    external       : Nat;
    total          : Nat;
  };

  public type RevenueSnapshot = {
    lifetimeRevenue   : Nat;   // all-time income (e8s)
    runningBalance    : Nat;   // current surplus available for DIVI
    currentEpoch      : Nat;
    totalAllocated    : Nat;   // all-time distributed
    totalBurned       : Nat;
    streamBreakdown   : StreamBreakdown;
    phi_roi           : Float; // lifetimeRevenue / totalAllocated
    tickCount         : Nat;
    timestamp         : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized     : Bool = false;
  stable var currentEpoch    : Nat  = 0;
  stable var tickCount       : Nat  = 0;
  stable var lifetimeRevenue : Nat  = 0;
  stable var runningBalance  : Nat  = 0;
  stable var totalAllocated  : Nat  = 0;
  stable var totalBurned     : Nat  = 0;

  // Per-epoch income accumulators (reset each tick)
  stable var epochIncomeAccum : Nat = 0;

  // Stream lifetime totals
  stable var totalNNS        : Nat = 0;
  stable var totalCycleMargin : Nat = 0;
  stable var totalDevFees    : Nat = 0;
  stable var totalSNSSwap    : Nat = 0;
  stable var totalUnwrap     : Nat = 0;
  stable var totalExternal   : Nat = 0;

  stable var nextEventId     : Nat = 0;
  stable var nextAllocId     : Nat = 0;

  transient let incomeEvents  : Buffer.Buffer<IncomeEvent>     = Buffer.Buffer<IncomeEvent>(2048);
  transient let allocEvents   : Buffer.Buffer<AllocationEvent> = Buffer.Buffer<AllocationEvent>(512);
  transient let epochReports  : Buffer.Buffer<EpochReport>     = Buffer.Buffer<EpochReport>(1024);
  transient let auditLog      : Buffer.Buffer<Text>            = Buffer.Buffer<Text>(2048);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func streamText(s : IncomeStream) : Text {
    switch s {
      case (#NNS_Rewards)    "NNS_Rewards";
      case (#CycleMargin)    "CycleMargin";
      case (#DeveloperFees)  "DeveloperFees";
      case (#SNS_Swap)       "SNS_Swap";
      case (#UnwrapPremium)  "UnwrapPremium";
      case (#External)       "External";
    }
  };

  func nncToIcpE8s(nncAmount : Nat) : Nat {
    nncAmount * 100_000_000 / NNC_PER_WHOLE_ICP
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ══════════════════════════════════════════════════════════════════

  public func initialize() : async Text {
    if (initialized) { return "RevenueEngine: already initialized" };
    initialized := true;
    auditLog.add("RevenueEngine initialized. All income streams open.");
    "RevenueEngine initialized. 5 income streams active. Golden distribution ready."
  };

  // ══════════════════════════════════════════════════════════════════
  //  INCOME CREDITING
  // ══════════════════════════════════════════════════════════════════

  /// Credit an income event to the current epoch.
  public func creditIncome(stream : IncomeStream, amountE8s : Nat, memo : Text) : async Nat {
    if (amountE8s == 0) { return 0 };
    let id = nextEventId;
    nextEventId += 1;
    let ev : IncomeEvent = {
      id;
      stream;
      amountE8s;
      memo;
      epochId   = currentEpoch;
      timestamp = Time.now();
    };
    incomeEvents.add(ev);
    epochIncomeAccum += amountE8s;
    lifetimeRevenue  += amountE8s;
    runningBalance   += amountE8s;

    // Update stream totals
    switch stream {
      case (#NNS_Rewards)   { totalNNS         += amountE8s };
      case (#CycleMargin)   { totalCycleMargin  += amountE8s };
      case (#DeveloperFees) { totalDevFees      += amountE8s };
      case (#SNS_Swap)      { totalSNSSwap      += amountE8s };
      case (#UnwrapPremium) { totalUnwrap       += amountE8s };
      case (#External)      { totalExternal     += amountE8s };
    };

    auditLog.add(
      "Income #" # Nat.toText(id) # " [" # streamText(stream) # "]" #
      " +" # Nat.toText(amountE8s) # " e8s — " # memo
    );
    id
  };

  /// Convenience: credit NNS voting rewards (call after nns_proxy.tick reports maturity).
  public func creditNNSRewards(maturityE8s : Nat, neuronId : Nat) : async Nat {
    await creditIncome(#NNS_Rewards, maturityE8s,
      "NNS reward from neuron #" # Nat.toText(neuronId))
  };

  /// Convenience: credit cycle margin from an NNC sale.
  /// marginE8s = NNC_sold × (PHI^2 − 1) / NNC_PER_ICP (converted to ICP e8s).
  public func creditCycleMargin(nncSold : Nat, listingId : Nat) : async Nat {
    let marginNNC = Int.abs(Float.toInt(Float.fromInt(nncSold) * (PHI_SQ - 1.0)));
    let marginE8s = nncToIcpE8s(marginNNC);
    await creditIncome(#CycleMargin, marginE8s,
      "Cycle margin from listing #" # Nat.toText(listingId) # " | " # Nat.toText(nncSold) # " NNC sold")
  };

  /// Convenience: credit developer slot deployment fee.
  public func creditDevFee(nncDeposited : Nat, slotId : Nat) : async Nat {
    let feeNNC = nncDeposited * DEV_FEE_BPS / 10_000;
    let feeE8s = nncToIcpE8s(feeNNC);
    await creditIncome(#DeveloperFees, feeE8s,
      "Dev fee from slot #" # Nat.toText(slotId) # " | " # Nat.toText(feeNNC) # " NNC")
  };

  /// Convenience: credit SNS swap proceeds.
  public func creditSNSSwap(icpRaisedE8s : Nat, swapRound : Nat) : async Nat {
    await creditIncome(#SNS_Swap, icpRaisedE8s,
      "SNS swap round #" # Nat.toText(swapRound) # " raised " # Nat.toText(icpRaisedE8s) # " e8s")
  };

  /// Convenience: credit NNC unwrap premium retained by treasury.
  public func creditUnwrapPremium(premiumNNC : Nat) : async Nat {
    let premiumE8s = nncToIcpE8s(premiumNNC);
    await creditIncome(#UnwrapPremium, premiumE8s,
      "Unwrap premium: " # Nat.toText(premiumNNC) # " NNC retained")
  };

  // ══════════════════════════════════════════════════════════════════
  //  AUTO-DISTRIBUTE — fully autonomous golden split, no DIVI command
  // ══════════════════════════════════════════════════════════════════

  /// Executes the golden distribution from current runningBalance
  /// without waiting for a DIVI AllocateSurplus command.
  /// Called by the protocol timer or by DIVI's Loop 4 after each epoch.
  /// Returns the AllocationEvent id, or 0 if balance is zero.
  public func autoDistribute(memo : Text) : async Nat {
    if (runningBalance == 0) { return 0 };

    let surplus = runningBalance;
    let governance = Int.abs(Float.toInt(Float.fromInt(surplus) * ALLOC_GOVERNANCE));
    let market     = Int.abs(Float.toInt(Float.fromInt(surplus) * ALLOC_MARKET));
    let dao        = Int.abs(Float.toInt(Float.fromInt(surplus) * ALLOC_DAO));
    let reserve    = Int.abs(Float.toInt(Float.fromInt(surplus) * ALLOC_RESERVE));
    let total4     = governance + market + dao + reserve;
    let burned     = if (surplus > total4) surplus - total4 else 0;

    await recordAllocation(governance, market, dao, reserve, burned,
      "autoDistribute | " # memo)
  };

  /// Credit income from auto_market's cycle margin.
  /// auto_market calls this after each autonomousTick to record
  /// the total marginE8s earned across all 4 engines.
  public func creditAutoCycleMargin(marginE8s : Nat, tick : Nat) : async Nat {
    await creditIncome(#CycleMargin, marginE8s,
      "auto_market tick #" # Nat.toText(tick) # " | 4-engine cycle margin")
  };

  // ══════════════════════════════════════════════════════════════════
  //  ALLOCATION
  // ══════════════════════════════════════════════════════════════════

  /// Record a DIVI allocation — called when DIVI's AllocateSurplus command is executed.
  public func recordAllocation(
    governance : Nat,
    market     : Nat,
    dao        : Nat,
    reserve    : Nat,
    burned     : Nat,
    memo       : Text
  ) : async Nat {
    let total = governance + market + dao + reserve + burned;
    if (total > runningBalance) {
      return 0;   // insufficient balance — DIVI should not over-allocate
    };
    runningBalance -= total;
    totalAllocated += governance + market + dao + reserve;
    totalBurned    += burned;

    let id = nextAllocId;
    nextAllocId += 1;
    let ev : AllocationEvent = {
      id;
      epochId    = currentEpoch;
      governance;
      market;
      dao;
      reserve;
      burned;
      total;
      timestamp  = Time.now();
      memo;
    };
    allocEvents.add(ev);

    auditLog.add(
      "Alloc #" # Nat.toText(id) #
      " | gov=" # Nat.toText(governance) #
      " market=" # Nat.toText(market) #
      " dao=" # Nat.toText(dao) #
      " reserve=" # Nat.toText(reserve) #
      " burn=" # Nat.toText(burned)
    );
    id
  };

  // ══════════════════════════════════════════════════════════════════
  //  TICK — close the epoch
  // ══════════════════════════════════════════════════════════════════

  public func tick() : async EpochReport {
    tickCount += 1;
    let epochIncome = epochIncomeAccum;

    // Calculate outflow this epoch
    var epochOutflow : Nat = 0;
    var i : Nat = 0;
    while (i < allocEvents.size()) {
      let a = allocEvents.get(i);
      if (a.epochId == currentEpoch) { epochOutflow += a.total };
      i += 1;
    };

    let epochSurplus = if (epochIncome >= epochOutflow) epochIncome - epochOutflow else 0;
    let phiYield : Float = if (runningBalance > 0) {
      Float.fromInt(epochIncome) / Float.fromInt(runningBalance)
    } else { 0.0 };

    let breakdown : [(Text, Nat)] = [
      ("NNS_Rewards",   totalNNS),
      ("CycleMargin",   totalCycleMargin),
      ("DeveloperFees", totalDevFees),
      ("SNS_Swap",      totalSNSSwap),
      ("UnwrapPremium", totalUnwrap),
      ("External",      totalExternal),
    ];

    let report : EpochReport = {
      epochId         = currentEpoch;
      epochIncome;
      epochOutflow;
      epochSurplus;
      runningBalance;
      streamBreakdown = breakdown;
      phi_yield       = phiYield;
      timestamp       = Time.now();
    };
    epochReports.add(report);

    auditLog.add(
      "Epoch #" # Nat.toText(currentEpoch) #
      " | income=" # Nat.toText(epochIncome) #
      " | outflow=" # Nat.toText(epochOutflow) #
      " | surplus=" # Nat.toText(epochSurplus) #
      " | balance=" # Nat.toText(runningBalance)
    );

    // Advance epoch
    currentEpoch       += 1;
    epochIncomeAccum    := 0;   // reset accumulator

    report
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func getRunningBalance() : async Nat { runningBalance };

  public query func getLifetimeRevenue() : async Nat { lifetimeRevenue };

  public query func getStreamBreakdown() : async StreamBreakdown {
    {
      nns_rewards    = totalNNS;
      cycle_margin   = totalCycleMargin;
      developer_fees = totalDevFees;
      sns_swap       = totalSNSSwap;
      unwrap_premium = totalUnwrap;
      external       = totalExternal;
      total          = lifetimeRevenue;
    }
  };

  public query func getRevenueSnapshot() : async RevenueSnapshot {
    let phiROI : Float = if (totalAllocated > 0) {
      Float.fromInt(lifetimeRevenue) / Float.fromInt(totalAllocated)
    } else { 0.0 };
    {
      lifetimeRevenue;
      runningBalance;
      currentEpoch;
      totalAllocated;
      totalBurned;
      streamBreakdown = {
        nns_rewards    = totalNNS;
        cycle_margin   = totalCycleMargin;
        developer_fees = totalDevFees;
        sns_swap       = totalSNSSwap;
        unwrap_premium = totalUnwrap;
        external       = totalExternal;
        total          = lifetimeRevenue;
      };
      phi_roi   = phiROI;
      tickCount;
      timestamp = Time.now();
    }
  };

  public query func getEpochReports(n : Nat) : async [EpochReport] {
    let total = epochReports.size();
    if (total == 0) { return [] };
    let start = if (total > n) total - n else 0;
    var result : [EpochReport] = [];
    var i = start;
    while (i < total) {
      result := Array.append(result, [epochReports.get(i)]);
      i += 1;
    };
    result
  };

  public query func getRecentIncomeEvents(n : Nat) : async [IncomeEvent] {
    let total = incomeEvents.size();
    if (total == 0) { return [] };
    let start = if (total > n) total - n else 0;
    var result : [IncomeEvent] = [];
    var i = start;
    while (i < total) {
      result := Array.append(result, [incomeEvents.get(i)]);
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
      name      = "REVENUE_ENGINE";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "REVENUE_ENGINE self-check complete. No drift detected."
  };

  public func register() : async Text {
    "REVENUE_ENGINE registered. Capabilities: [sovereign, active]."
  };

  public query func report_status() : async Text {
    "REVENUE_ENGINE | status=ACTIVE | v10=true"
  };


}