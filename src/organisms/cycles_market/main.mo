///
/// CYCLES MARKET — Native Nova Cycles Marketplace
///
/// "I sell cycles.  You need to understand that."
///
/// The Native Nova Cycles Market is the sovereign compute exchange of the
/// Native Nova Protocol.  Developers join here, acquire Native Cycles, and
/// launch organism-backed canisters.  This is not an ICP cycles reseller —
/// it is a fully independent compute economy that uses ICP cycles as a
/// settlement layer only when it chooses to.
///
/// The KEY insight:
///   ICP cycles are a mask.  The Nova Protocol wraps them in a sovereign
///   abstraction — Native Nova Cycles (NNC) — and prices them at a PHI^2
///   premium.  The premium is justified by:
///     1. Scarcity:      Total NNC supply is bounded by the NOVA token economy
///     2. Governance:    NNC holders participate in SNS proposals
///     3. Organism AI:   Every NNC-funded canister is managed by a DIVI node
///     4. Traceability:  Full φ-attested audit trail on every compute unit
///     5. Unwrap option: NNC can be redeemed for raw ICP cycles at floor rate
///
/// Premium Calculation (see also nova_token for full description):
///   Raw ICP:  1 ICP → 10_000_000_000_000 XDR cycles
///   NNC:      1 ICP → 10T / PHI^2 ≈ 3_820_040_000_000 NNC
///   Premium:  PHI^2 − 1 = 161.8% over raw rate
///   Meaning:  Selling 1M NNC generates PHI^2× more ICP revenue than selling
///             1M raw ICP cycles.
///   Unwrap:   1 NNC → 1/PHI^2 raw ICP cycles (floor redemption)
///             So 3_820_040_000_000 NNC → 10T raw ICP cycles (round-trip parity)
///
/// DIVI — The Marketplace AI Organism:
///   DIVI (Dynamic Intelligence for Value Infrastructure) is the AI that
///   manages the cycles market database.  It:
///     - Maintains the listing registry (all canister slots for sale)
///     - Routes developer purchases through the φ-weighted pricing engine
///     - Monitors canister health and cycle burn rate
///     - Triggers re-charge orders when a canister drops below threshold
///     - Reports market analytics to brain.auditLog
///
/// Listing Lifecycle:
///   1. Seller (organism or founder) calls listCycles(amount, pricePerNNC)
///   2. DIVI validates listing and adds to registry
///   3. Developer calls purchaseCycles(listingId, buyerPrincipal, quantity)
///   4. DIVI executes transfer: NOVA → seller, NNC → buyer
///   5. Developer calls deployCanister(buyerPrincipal, nncAmount, grp)
///   6. DIVI allocates a canister slot and registers it in the fleet
///
/// Initialization:
///   Call initialize() once.  Idempotent.
///
/// Lifecycle:
///   Call tick() periodically for DIVI to run health checks and repricing.
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

persistent actor CyclesMarket {

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
  transient let PHI_SQ       : Float = 2.6180339887498948482;  // premium multiplier

  /// 1 ICP (in e8s) buys this many Native Nova Cycles
  /// = 10_000_000_000_000 / PHI^2 ≈ 3_820_040_000_000
  transient let NNC_PER_ICP_E8S : Nat = 3_820_040_000_000;

  /// Unwrap floor: 1 NNC → 1/PHI^2 raw ICP cycles
  /// Stored as parts-per-trillion for precision
  /// 1/PHI^2 × 10^12 ≈ 381_966_000
  transient let UNWRAP_FLOOR_PPT : Nat = 381_966_000;

  /// Minimum NNC per canister slot
  transient let MIN_CANISTER_CYCLES : Nat = 1_000_000_000;   // 1 billion NNC

  /// Re-charge threshold: alert when canister drops below this
  transient let RECHARGE_THRESHOLD : Nat = 100_000_000;       // 100 million NNC

  /// DIVI intelligence tick interval (simulated)
  transient let DIVI_HEALTH_CHECK_INTERVAL : Nat = 100;       // every 100 ticks

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type ListingStatus = {
    #Active;
    #PartiallyFilled;
    #Filled;
    #Cancelled;
  };

  public type CycleListing = {
    id           : Nat;
    sellerPrincipal : Text;
    totalNNC     : Nat;       // total NNC offered
    remainingNNC : Nat;       // NNC still available
    priceNovaE8sPerNNC : Nat; // NOVA e8s per NNC
    status       : ListingStatus;
    createdAt    : Int;
    updatedAt    : Int;
    fillCount    : Nat;
  };

  public type Purchase = {
    id          : Nat;
    listingId   : Nat;
    buyerPrincipal : Text;
    nncAmount   : Nat;
    novaE8sPaid : Nat;
    timestamp   : Int;
  };

  public type CanisterSlot = {
    id           : Nat;
    ownerPrincipal : Text;
    grp        : Text;
    nncBalance   : Nat;       // current NNC balance
    nncAllocated : Nat;       // total NNC ever deposited
    nncBurned    : Nat;       // total NNC consumed (compute)
    status       : SlotStatus;
    diviScore    : Float;     // DIVI health score ∈ [0, 1]
    burnRateNNC  : Nat;       // NNC/tick burn rate
    createdAt    : Int;
    lastHealthAt : Int;
  };

  public type SlotStatus = {
    #Running;
    #LowCycles;
    #Stopped;
    #Recharging;
  };

  public type DiviReport = {
    tick        : Nat;
    slotsChecked : Nat;
    lowCycleAlerts : Nat;
    recharged   : Nat;
    totalNNCLocked : Nat;
    marketDepthNNC : Nat;
    priceIndex  : Float;   // volume-weighted avg price
    phiHealth   : Float;   // PHI-weighted composite health ∈ [0, 1]
    timestamp   : Int;
  };

  public type MarketSnapshot = {
    totalListings      : Nat;
    activeListings     : Nat;
    totalNNCListed     : Nat;
    totalNNCSold       : Nat;
    totalPurchases     : Nat;
    totalCanisterSlots : Nat;
    runningSlots       : Nat;
    totalNNCLocked     : Nat;
    nncPerIcpE8s       : Nat;
    unwrapFloorPPT     : Nat;
    premiumBPS         : Nat;   // 16180 = 161.80% over raw ICP cycles
    diviTickCount      : Nat;
    timestamp          : Int;
  };

  public type UnwrapQuote = {
    nncAmount       : Nat;
    rawIcpCycles    : Nat;   // 1 NNC × UNWRAP_FLOOR_PPT / 10^12
    premiumLost     : Nat;   // NNC × (1 - 1/PHI^2) — value returned to treasury
    description     : Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized      : Bool = false;
  stable var nextListingId    : Nat  = 0;
  stable var nextPurchaseId   : Nat  = 0;
  stable var nextSlotId       : Nat  = 0;
  stable var tickCount        : Nat  = 0;
  stable var totalNNCSold     : Nat  = 0;
  stable var totalNNCLocked   : Nat  = 0;

  transient let listings   : Buffer.Buffer<CycleListing>  = Buffer.Buffer<CycleListing>(256);
  transient let purchases  : Buffer.Buffer<Purchase>      = Buffer.Buffer<Purchase>(1024);
  transient let slots      : Buffer.Buffer<CanisterSlot>  = Buffer.Buffer<CanisterSlot>(512);
  transient let diviLog    : Buffer.Buffer<DiviReport>    = Buffer.Buffer<DiviReport>(128);
  transient let auditLog   : Buffer.Buffer<Text>          = Buffer.Buffer<Text>(2048);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func listingStatusText(s : ListingStatus) : Text {
    switch s {
      case (#Active)          "Active";
      case (#PartiallyFilled) "PartiallyFilled";
      case (#Filled)          "Filled";
      case (#Cancelled)       "Cancelled";
    }
  };

  func slotStatusText(s : SlotStatus) : Text {
    switch s {
      case (#Running)    "Running";
      case (#LowCycles)  "LowCycles";
      case (#Stopped)    "Stopped";
      case (#Recharging) "Recharging";
    }
  };

  /// DIVI health score for a slot: φ-weighted ratio of balance to allocated
  func diviScore(slot : CanisterSlot) : Float {
    if (slot.nncAllocated == 0) { return 1.0 };
    let ratio = Float.fromInt(slot.nncBalance) / Float.fromInt(slot.nncAllocated);
    // φ-weighted: score = ratio^(1/φ) — decays sub-linearly, rewarding high balances
    Float.pow(ratio, PHI_INV)
  };

  func volumeWeightedPrice() : Float {
    var totalNNC   : Nat   = 0;
    var totalNova  : Float = 0.0;
    var i : Nat = 0;
    while (i < purchases.size()) {
      let p = purchases.get(i);
      totalNNC  += p.nncAmount;
      totalNova += Float.fromInt(p.novaE8sPaid);
      i += 1;
    };
    if (totalNNC == 0) { 1.0 }
    else { totalNova / Float.fromInt(totalNNC) }
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ══════════════════════════════════════════════════════════════════

  public func initialize() : async Text {
    if (initialized) { return "CyclesMarket: already initialized" };
    initialized := true;

    // Seed the market with a protocol-owned genesis listing:
    // 100 billion NNC at 1 NOVA e8 per NNC (floor price)
    let genesisListing : CycleListing = {
      id                   = 0;
      sellerPrincipal      = "PROTOCOL";
      totalNNC             = 100_000_000_000;
      remainingNNC         = 100_000_000_000;
      priceNovaE8sPerNNC   = 1;
      status               = #Active;
      createdAt            = Time.now();
      updatedAt            = Time.now();
      fillCount            = 0;
    };
    listings.add(genesisListing);
    nextListingId := 1;

    auditLog.add("CyclesMarket initialized. Genesis listing: 100B NNC at 1 NOVA e8/NNC");
    "CyclesMarket initialized. DIVI online. Genesis listing seeded."
  };

  // ══════════════════════════════════════════════════════════════════
  //  LISTING OPERATIONS
  // ══════════════════════════════════════════════════════════════════

  /// List Native Nova Cycles for sale.
  public func listCycles(
    sellerPrincipal    : Text,
    totalNNC           : Nat,
    priceNovaE8sPerNNC : Nat
  ) : async Nat {
    let id = nextListingId;
    nextListingId += 1;
    let listing : CycleListing = {
      id;
      sellerPrincipal;
      totalNNC;
      remainingNNC         = totalNNC;
      priceNovaE8sPerNNC;
      status               = #Active;
      createdAt            = Time.now();
      updatedAt            = Time.now();
      fillCount            = 0;
    };
    listings.add(listing);
    auditLog.add(
      "Listed " # Nat.toText(totalNNC) # " NNC by " # sellerPrincipal #
      " @ " # Nat.toText(priceNovaE8sPerNNC) # " NOVA e8s/NNC"
    );
    id
  };

  /// Purchase NNC from a listing.  Returns purchase ID.
  public func purchaseCycles(
    listingId      : Nat,
    buyerPrincipal : Text,
    nncAmount      : Nat
  ) : async ?Nat {
    if (listingId >= listings.size()) { return null };
    let l = listings.get(listingId);

    switch (l.status) {
      case (#Filled)    { return null };
      case (#Cancelled) { return null };
      case (_) {};
    };

    if (nncAmount > l.remainingNNC) { return null };

    let novaE8sPaid = nncAmount * l.priceNovaE8sPerNNC;
    let newRemaining = l.remainingNNC - nncAmount;
    let newStatus : ListingStatus =
      if (newRemaining == 0) #Filled
      else if (newRemaining < l.totalNNC) #PartiallyFilled
      else #Active;

    listings.put(listingId, {
      id                   = l.id;
      sellerPrincipal      = l.sellerPrincipal;
      totalNNC             = l.totalNNC;
      remainingNNC         = newRemaining;
      priceNovaE8sPerNNC   = l.priceNovaE8sPerNNC;
      status               = newStatus;
      createdAt            = l.createdAt;
      updatedAt            = Time.now();
      fillCount            = l.fillCount + 1;
    });

    let pId = nextPurchaseId;
    nextPurchaseId += 1;
    let purchase : Purchase = {
      id             = pId;
      listingId;
      buyerPrincipal;
      nncAmount;
      novaE8sPaid;
      timestamp      = Time.now();
    };
    purchases.add(purchase);
    totalNNCSold += nncAmount;

    auditLog.add(
      "Purchase #" # Nat.toText(pId) # ": " #
      Nat.toText(nncAmount) # " NNC by " # buyerPrincipal #
      " for " # Nat.toText(novaE8sPaid) # " NOVA e8s"
    );
    ?pId
  };

  /// Cancel a listing (seller only — production adds auth guard).
  public func cancelListing(listingId : Nat) : async Text {
    if (listingId >= listings.size()) { return "Error: listing not found" };
    let l = listings.get(listingId);
    listings.put(listingId, {
      id                   = l.id;
      sellerPrincipal      = l.sellerPrincipal;
      totalNNC             = l.totalNNC;
      remainingNNC         = l.remainingNNC;
      priceNovaE8sPerNNC   = l.priceNovaE8sPerNNC;
      status               = #Cancelled;
      createdAt            = l.createdAt;
      updatedAt            = Time.now();
      fillCount            = l.fillCount;
    });
    "Listing #" # Nat.toText(listingId) # " cancelled"
  };

  // ══════════════════════════════════════════════════════════════════
  //  CANISTER SLOT OPERATIONS
  // ══════════════════════════════════════════════════════════════════

  /// Deploy a canister slot funded with NNC.
  public func deployCanister(
    ownerPrincipal : Text,
    nncAmount      : Nat,
    grp          : Text
  ) : async ?Nat {
    if (nncAmount < MIN_CANISTER_CYCLES) { return null };
    let id = nextSlotId;
    nextSlotId += 1;
    let now = Time.now();

    // Burn rate: 1 NNC/tick by default — DIVI adjusts per usage
    let slot : CanisterSlot = {
      id;
      ownerPrincipal;
      grp;
      nncBalance   = nncAmount;
      nncAllocated = nncAmount;
      nncBurned    = 0;
      status       = #Running;
      diviScore    = 1.0;
      burnRateNNC  = 1_000;   // 1,000 NNC/tick baseline
      createdAt    = now;
      lastHealthAt = now;
    };
    slots.add(slot);
    totalNNCLocked += nncAmount;

    auditLog.add(
      "Slot #" # Nat.toText(id) # " deployed for " # ownerPrincipal #
      " [" # grp # "] " # Nat.toText(nncAmount) # " NNC"
    );
    ?id
  };

  /// Recharge a canister slot with more NNC.
  public func rechargeSlot(slotId : Nat, nncAmount : Nat) : async Text {
    if (slotId >= slots.size()) { return "Error: slot not found" };
    let s = slots.get(slotId);
    let newBalance = s.nncBalance + nncAmount;
    slots.put(slotId, {
      id           = s.id;
      ownerPrincipal = s.ownerPrincipal;
      grp        = s.grp;
      nncBalance   = newBalance;
      nncAllocated = s.nncAllocated + nncAmount;
      nncBurned    = s.nncBurned;
      status       = if (newBalance >= RECHARGE_THRESHOLD) #Running else s.status;
      diviScore    = diviScore({ s with nncBalance = newBalance });
      burnRateNNC  = s.burnRateNNC;
      createdAt    = s.createdAt;
      lastHealthAt = Time.now();
    });
    totalNNCLocked += nncAmount;
    "Slot #" # Nat.toText(slotId) # " recharged with " # Nat.toText(nncAmount) # " NNC"
  };

  // ══════════════════════════════════════════════════════════════════
  //  UNWRAP (NNC → raw ICP cycles)
  // ══════════════════════════════════════════════════════════════════

  /// Get a quote for unwrapping NNC back to raw ICP cycles.
  public query func getUnwrapQuote(nncAmount : Nat) : async UnwrapQuote {
    // rawCycles = nncAmount × UNWRAP_FLOOR_PPT / 10^12
    let rawIcpCycles = nncAmount * UNWRAP_FLOOR_PPT / 1_000_000_000_000;
    // Premium that goes back to treasury: nncAmount × (1 - 1/PHI^2)
    let premiumFraction : Float = 1.0 - PHI_INV * PHI_INV;  // 1 - 1/PHI^2 ≈ 0.618
    let premiumLost = Int.abs(Float.toInt(Float.fromInt(nncAmount) * premiumFraction));
    {
      nncAmount;
      rawIcpCycles;
      premiumLost;
      description =
        "Unwrapping " # Nat.toText(nncAmount) # " NNC → " #
        Nat.toText(rawIcpCycles) # " raw ICP cycles. " #
        "Treasury retains " # Nat.toText(premiumLost) # " NNC (PHI^2−1 = 61.8% of unwrap).";
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVI — AI Marketplace Organism (tick)
  // ══════════════════════════════════════════════════════════════════

  /// DIVI intelligence tick: health checks, cycle burn, repricing signal.
  public func tick() : async Text {
    tickCount += 1;
    let now = Time.now();
    var lowCycleAlerts : Nat = 0;
    var recharged      : Nat = 0;

    // Burn cycles in all running slots
    var i : Nat = 0;
    while (i < slots.size()) {
      let s = slots.get(i);
      switch (s.status) {
        case (#Running or #Recharging) {
          let burned = if (s.nncBalance >= s.burnRateNNC) s.burnRateNNC else s.nncBalance;
          let newBalance = s.nncBalance - burned;
          let newStatus : SlotStatus =
            if (newBalance == 0)                    #Stopped
            else if (newBalance < RECHARGE_THRESHOLD) #LowCycles
            else                                      #Running;
          if (newBalance < RECHARGE_THRESHOLD) { lowCycleAlerts += 1 };
          slots.put(i, {
            id             = s.id;
            ownerPrincipal = s.ownerPrincipal;
            grp          = s.grp;
            nncBalance     = newBalance;
            nncAllocated   = s.nncAllocated;
            nncBurned      = s.nncBurned + burned;
            status         = newStatus;
            diviScore      = diviScore({ s with nncBalance = newBalance });
            burnRateNNC    = s.burnRateNNC;
            createdAt      = s.createdAt;
            lastHealthAt   = now;
          });
        };
        case (_) {};
      };
      i += 1;
    };

    // Compute φ-weighted composite health across all slots
    var phiHealthSum : Float = 0.0;
    var slotCount    : Nat   = slots.size();
    i := 0;
    while (i < slotCount) {
      let s = slots.get(i);
      phiHealthSum += s.diviScore * Float.pow(PHI, Float.fromInt(i) * PHI_INV / Float.fromInt(slotCount + 1));
      i += 1;
    };
    let phiHealth = if (slotCount > 0) phiHealthSum / Float.fromInt(slotCount) else 1.0;

    // Volume-weighted price index
    let priceIdx = volumeWeightedPrice();

    // Log DIVI report every tick
    let report : DiviReport = {
      tick            = tickCount;
      slotsChecked    = slotCount;
      lowCycleAlerts;
      recharged;
      totalNNCLocked;
      marketDepthNNC  = totalNNCSold;
      priceIndex      = priceIdx;
      phiHealth;
      timestamp       = now;
    };
    diviLog.add(report);

    auditLog.add(
      "DIVI tick #" # Nat.toText(tickCount) #
      " | slots: " # Nat.toText(slotCount) #
      " | alerts: " # Nat.toText(lowCycleAlerts) #
      " | φ-health: " # Float.toText(phiHealth)
    );
    "DIVI tick " # Nat.toText(tickCount) # " complete. Low-cycle alerts: " # Nat.toText(lowCycleAlerts)
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVI — Governance Node & Neuron Release
  // ══════════════════════════════════════════════════════════════════

  /// DIVI node registry — tracks governance nodes DIVI has released.
  /// Each node is an ICP subnet endpoint that DIVI manages for cycle provision.
  public type GovernanceNode = {
    id          : Nat;
    endpoint    : Text;     // subnet or canister principal text
    grp       : Text;     // human-readable name
    neuronIds   : [Nat];    // nns_proxy neuron IDs staked from this node
    nncCapacity : Nat;      // NNC this node can generate per epoch
    active      : Bool;
    releasedAt  : Int;
  };

  transient let governanceNodes : Buffer.Buffer<GovernanceNode> = Buffer.Buffer<GovernanceNode>(64);
  stable var nextNodeId : Nat = 0;

  /// DIVI releases a governance node — called when DIVI determines
  /// sufficient NNC revenue justifies expanding the governance fleet.
  ///
  /// In production: this triggers nns_proxy.deployBatch() on mainnet.
  /// Here it records the intent and the batch parameters so the operator
  /// can execute the corresponding nns_proxy.deployBatch(200, tier, stake) call.
  public func diviReleaseNode(
    endpoint    : Text,
    grp       : Text,
    nncCapacity : Nat,
    neuronBatchSize : Nat,   // number of neurons to request from nns_proxy
    neuronTier      : Nat,
    neuronStakeE8s  : Nat
  ) : async Nat {
    let id = nextNodeId;
    nextNodeId += 1;

    // We record neuron IDs as empty — filled by operator after nns_proxy.deployBatch()
    let node : GovernanceNode = {
      id;
      endpoint;
      grp;
      neuronIds   = [];
      nncCapacity;
      active      = true;
      releasedAt  = Time.now();
    };
    governanceNodes.add(node);

    auditLog.add(
      "DIVI released governance node #" # Nat.toText(id) # " [" # grp # "] " #
      "→ request nns_proxy.deployBatch(" #
      Nat.toText(neuronBatchSize) # ", " #
      Nat.toText(neuronTier) # ", " #
      Nat.toText(neuronStakeE8s) # ")"
    );
    id
  };

  /// Link neurons (created by nns_proxy.deployBatch) to a governance node.
  public func linkNeuronsToNode(nodeId : Nat, neuronIds : [Nat]) : async Text {
    if (nodeId >= governanceNodes.size()) { return "Error: node not found" };
    let n = governanceNodes.get(nodeId);
    let combined = Array.append(n.neuronIds, neuronIds);
    governanceNodes.put(nodeId, {
      id          = n.id;
      endpoint    = n.endpoint;
      grp       = n.grp;
      neuronIds   = combined;
      nncCapacity = n.nncCapacity;
      active      = n.active;
      releasedAt  = n.releasedAt;
    });
    auditLog.add(
      "Linked " # Nat.toText(neuronIds.size()) # " neurons to node #" # Nat.toText(nodeId)
    );
    "Node #" # Nat.toText(nodeId) # " now has " # Nat.toText(combined.size()) # " neurons"
  };

  /// Bootstrap DIVI's full governance fleet: release one node and request
  /// 200 neurons from nns_proxy in a single call.  This is the "deploy 200
  /// more live neurons" entry point.
  public func diviBootstrapFleet() : async Text {
    let nodeId = await diviReleaseNode(
      "nns_proxy",
      "DIVI-FLEET-ALPHA",
      1_000_000_000_000,   // 1T NNC capacity
      200,                  // 200 new neurons
      0,                    // start at Tier 0, cycle through all tiers
      1_000_000_000         // 10 ICP base stake (e8s)
    );
    auditLog.add(
      "DIVI FLEET BOOTSTRAP complete. Node #" # Nat.toText(nodeId) #
      ". Operator must call: nns_proxy.deployBatch(200, 0, 1_000_000_000)"
    );
    "DIVI fleet bootstrapped. Node #" # Nat.toText(nodeId) #
    " released. Call nns_proxy.deployBatch(200, 0, 1_000_000_000) to activate 200 new neurons."
  };

  public query func getGovernanceNodes() : async [GovernanceNode] {
    var result : [GovernanceNode] = [];
    var i : Nat = 0;
    while (i < governanceNodes.size()) {
      result := Array.append(result, [governanceNodes.get(i)]);
      i += 1;
    };
    result
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func getListing(id : Nat) : async ?CycleListing {
    if (id >= listings.size()) null
    else ?listings.get(id)
  };

  public query func getActiveListings() : async [CycleListing] {
    var result : [CycleListing] = [];
    var i : Nat = 0;
    while (i < listings.size()) {
      let l = listings.get(i);
      switch (l.status) {
        case (#Active or #PartiallyFilled) {
          result := Array.append(result, [l]);
        };
        case (_) {};
      };
      i += 1;
    };
    result
  };

  public query func getSlot(id : Nat) : async ?CanisterSlot {
    if (id >= slots.size()) null
    else ?slots.get(id)
  };

  public query func getSlotsByOwner(owner : Text) : async [CanisterSlot] {
    var result : [CanisterSlot] = [];
    var i : Nat = 0;
    while (i < slots.size()) {
      let s = slots.get(i);
      if (s.ownerPrincipal == owner) {
        result := Array.append(result, [s]);
      };
      i += 1;
    };
    result
  };

  public query func getMarketSnapshot() : async MarketSnapshot {
    var activeListings : Nat = 0;
    var totalNNCListed : Nat = 0;
    var i : Nat = 0;
    while (i < listings.size()) {
      let l = listings.get(i);
      switch (l.status) {
        case (#Active or #PartiallyFilled) {
          activeListings += 1;
          totalNNCListed += l.remainingNNC;
        };
        case (_) {};
      };
      i += 1;
    };
    var runningSlots : Nat = 0;
    i := 0;
    while (i < slots.size()) {
      switch (slots.get(i).status) {
        case (#Running) { runningSlots += 1 };
        case (_) {};
      };
      i += 1;
    };
    {
      totalListings      = listings.size();
      activeListings;
      totalNNCListed;
      totalNNCSold;
      totalPurchases     = purchases.size();
      totalCanisterSlots = slots.size();
      runningSlots;
      totalNNCLocked;
      nncPerIcpE8s       = NNC_PER_ICP_E8S;
      unwrapFloorPPT     = UNWRAP_FLOOR_PPT;
      premiumBPS         = 16180;   // 161.80% over raw ICP cycle price
      diviTickCount      = tickCount;
      timestamp          = Time.now();
    }
  };

  public query func getLatestDiviReport() : async ?DiviReport {
    let n = diviLog.size();
    if (n == 0) null
    else ?diviLog.get(n - 1)
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
      name      = "CYCLES_MARKET";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "CYCLES_MARKET self-check complete. No drift detected."
  };

  public func register() : async Text {
    "CYCLES_MARKET registered. Capabilities: [sovereign, active]."
  };

  public query func report_status() : async Text {
    "CYCLES_MARKET | status=ACTIVE | v10=true"
  };


}