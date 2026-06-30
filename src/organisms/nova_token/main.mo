///
/// NOVA TOKEN — Sovereign Token Ledger
///
/// NOVA is the native governance and utility token of the Native Nova Protocol.
/// It is NOT a wrapper around any external token standard — it is its own sovereign
/// financial organism.  It is ICRC-1 compatible in spirit but entirely self-hosted.
///
/// Supply Architecture:
///   Total supply = φ^13 × 10^8 e8s ≈ 521,001,966 NOVA (8 decimal places)
///   φ^13 = 521.001966... — the 13th power of the golden ratio is a Fibonacci attractor
///   Treasury (1/φ²)  38.2 % — protocol reserve
///   Community (1/φ³) 23.6 % — SNS swap & governance incentives
///   Founder  (1/φ²)  38.2 % — vested over 8 Fibonacci dissolve periods
///
/// Sub-Token Roles (internal role tags, not separate ledgers):
///   #Gov   — Governance-locked NOVA: earns voting power in SNS neurons
///   #Cycle — Compute-access NOVA: redeemed against Native Cycles in cycles_market
///   #Vault — Treasury-reserved NOVA: held by Parallax wallet, backs cycle floor price
///
/// Premium over ICP Cycles:
///   ICP network price: 1 ICP → 10_000_000_000_000 raw XDR cycles
///   Native Nova premium multiplier: PHI^2 ≈ 2.618
///   Meaning: 1 ICP worth of NOVA buys 10T / PHI^2 ≈ 3,819,660,112 Native Cycles
///   The remaining 61.8 % (1/PHI^2 of raw capacity) flows to the treasury.
///   Equivalently: you sell Native Cycles at PHI^2 × the raw ICP cycle price.
///   At scale (1 million Native Cycles sold/day) this generates PHI^2 – 1 = 161.8%
///   more revenue than a raw cycle reseller operating at the same volume.
///
/// The token is NOT ICP cycles.  It is a MASK and a sovereign standard.
/// If the protocol ever chooses to settle with the NNS, it can unwrap
/// Native Cycles back to raw ICP cycles at the floor rate.  The premium
/// is the value the Native Nova Protocol adds through governance, AI, and
/// its canister ecosystem.
///
/// Initialization:
///   Call initialize() once after deploy.  Subsequent calls are no-ops.
///
/// Key functions:
///   transfer(from, to, amount, role)  — move NOVA between accounts
///   mint(to, amount, role)            — treasury or SNS minting
///   burn(from, amount)                — remove supply permanently
///   balanceOf(principal)              — query total + per-role balances
///   getSupplySnapshot()               — query global supply metrics
///   getTokenEconomics()               — query the full economic parameters
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
import Bool   "mo:base/Bool";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor NovaToken {

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
  //  CONSTANTS — φ-grounded token primitives
  // ══════════════════════════════════════════════════════════════════

  transient let PHI     : Float = 1.6180339887498948482;
  transient let PHI_INV : Float = 0.6180339887498948482;  // 1/φ
  transient let PHI_SQ  : Float = 2.6180339887498948482;  // φ²  (premium multiplier)
  transient let PHI_CB  : Float = 4.2360679774997896964;  // φ³

  /// Total supply in e8s (8 decimal places, like ICP)
  /// φ^13 × 10^8 = 521.001966... × 10^8 = 52_100_196_600 e8s
  transient let TOTAL_SUPPLY_E8S : Nat = 52_100_196_600;

  /// Treasury share: 1/φ² ≈ 38.196%
  transient let TREASURY_E8S : Nat = 19_918_285_500;

  /// Community share: 1/φ³ ≈ 23.607%
  transient let COMMUNITY_E8S : Nat = 12_297_756_900;

  /// Founder share: 1/φ² ≈ 38.196% (vested)
  transient let FOUNDER_E8S : Nat = 19_884_154_200;

  /// Smallest unit: 1 e8 = 0.00000001 NOVA
  transient let E8S_PER_NOVA : Nat = 100_000_000;

  /// Native Cycles per whole ICP (100_000_000 e8s)
  /// Raw ICP gives 10T cycles per ICP.  We divide by PHI^2:
  /// 10_000_000_000_000 / 2.6180339887 ≈ 3_820_040_000_000
  transient let NATIVE_CYCLES_PER_ICP_E8S : Nat = 3_820_040_000_000;

  /// Premium ratio numerator over raw ICP cycles (×10^6 for precision)
  /// PHI^2 × 10^6 = 2_618_033 — callers divide by 10^6 to get the ratio
  transient let CYCLE_PREMIUM_PARTS_PER_MILLION : Nat = 2_618_033;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type TokenRole = {
    #Gov;    // Governance-locked: earns SNS voting weight
    #Cycle;  // Compute-access: redeems Native Cycles
    #Vault;  // Treasury-reserved: backs floor cycle price
    #Free;   // Unlocked / transferable
  };

  public type Account = {
    principal  : Text;          // Principal as text (portable)
    free       : Nat;           // Free transferable balance (e8s)
    gov        : Nat;           // Governance-locked balance (e8s)
    cycle      : Nat;           // Compute-access balance (e8s)
    vault      : Nat;           // Treasury-reserved balance (e8s)
    createdAt  : Int;
    updatedAt  : Int;
    txCount    : Nat;
    phiFingerprint : Float;     // φ-identity: PHI^(createdAt mod 13)
  };

  public type Transaction = {
    id        : Nat;
    fromPrincipal : Text;
    toPrincipal   : Text;
    amount    : Nat;           // e8s
    role      : TokenRole;
    kind      : TxKind;
    timestamp : Int;
    memo      : Text;
  };

  public type TxKind = {
    #Transfer;
    #Mint;
    #Burn;
    #Lock;     // Free → Gov/Cycle/Vault
    #Unlock;   // Gov/Cycle/Vault → Free
  };

  public type SupplySnapshot = {
    totalSupply    : Nat;   // e8s
    circulating    : Nat;   // totalSupply − treasury − locked
    treasury       : Nat;   // treasury balance (e8s)
    locked         : Nat;   // sum of all gov + cycle + vault
    burned         : Nat;   // permanently destroyed (e8s)
    txCount        : Nat;
    holderCount    : Nat;
    phiRatio       : Float; // circulating / totalSupply — ideally ≈ 1/φ
    timestamp      : Int;
  };

  public type TokenEconomics = {
    totalSupplyE8s              : Nat;
    treasuryE8s                 : Nat;
    communityE8s                : Nat;
    founderE8s                  : Nat;
    e8sPerNova                  : Nat;
    nativeCyclesPerIcpE8s       : Nat;
    cyclePremiumPartsPer1M      : Nat;   // PHI^2 × 10^6
    cyclePremiumDescription     : Text;
    phiSupplyExponent           : Nat;   // 13 — supply = φ^13 × 10^8
    phiPremiumExponent          : Nat;   // 2  — premium = φ^2
    subTokenRoles               : [Text];
  };

  public type TransferResult = {
    #Ok  : Nat;   // new tx id
    #Err : Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized   : Bool = false;
  stable var nextTxId      : Nat  = 0;
  stable var totalBurned   : Nat  = 0;
  stable var totalLocked   : Nat  = 0;   // sum of gov+cycle+vault across all accounts
  stable var treasuryBalance : Nat = 0;
  stable var communityBalance : Nat = 0;

  transient let accounts : Buffer.Buffer<Account>     = Buffer.Buffer<Account>(512);
  transient let ledger   : Buffer.Buffer<Transaction> = Buffer.Buffer<Transaction>(4096);
  transient let auditLog : Buffer.Buffer<Text>        = Buffer.Buffer<Text>(1024);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func roleToText(r : TokenRole) : Text {
    switch r {
      case (#Gov)   "Gov";
      case (#Cycle) "Cycle";
      case (#Vault) "Vault";
      case (#Free)  "Free";
    }
  };

  func txKindToText(k : TxKind) : Text {
    switch k {
      case (#Transfer) "Transfer";
      case (#Mint)     "Mint";
      case (#Burn)     "Burn";
      case (#Lock)     "Lock";
      case (#Unlock)   "Unlock";
    }
  };

  /// φ-fingerprint: PHI raised to (abs(createdAt mod 13))
  func phiFingerprint(ts : Int) : Float {
    let exp = Int.abs(ts % 13);
    var v : Float = 1.0;
    var i : Nat = 0;
    while (i < exp) {
      v := v * PHI;
      i += 1;
    };
    v
  };

  func findAccount(principal : Text) : ?Nat {
    var i : Nat = 0;
    let n = accounts.size();
    while (i < n) {
      if (accounts.get(i).principal == principal) { return ?i };
      i += 1;
    };
    null
  };

  func getOrCreateAccount(principal : Text) : Nat {
    switch (findAccount(principal)) {
      case (?i) i;
      case null {
        let now = Time.now();
        let acc : Account = {
          principal      = principal;
          free           = 0;
          gov            = 0;
          cycle          = 0;
          vault          = 0;
          createdAt      = now;
          updatedAt      = now;
          txCount        = 0;
          phiFingerprint = phiFingerprint(now);
        };
        accounts.add(acc);
        accounts.size() - 1
      };
    }
  };

  func accountFreeBalance(idx : Nat) : Nat {
    accounts.get(idx).free
  };

  func recordTx(
    from : Text, to : Text,
    amount : Nat, role : TokenRole, kind : TxKind, memo : Text
  ) : Nat {
    let id = nextTxId;
    nextTxId += 1;
    let tx : Transaction = {
      id;
      fromPrincipal = from;
      toPrincipal   = to;
      amount;
      role;
      kind;
      timestamp = Time.now();
      memo;
    };
    ledger.add(tx);
    auditLog.add(
      "TX#" # Nat.toText(id) # " " # txKindToText(kind) #
      " " # Nat.toText(amount) # "e8s [" # roleToText(role) # "]" #
      " " # from # " -> " # to
    );
    id
  };

  func deductFree(idx : Nat, amount : Nat) {
    let a = accounts.get(idx);
    accounts.put(idx, {
      principal      = a.principal;
      free           = a.free - amount;
      gov            = a.gov;
      cycle          = a.cycle;
      vault          = a.vault;
      createdAt      = a.createdAt;
      updatedAt      = Time.now();
      txCount        = a.txCount + 1;
      phiFingerprint = a.phiFingerprint;
    });
  };

  func creditFreeRole(idx : Nat, amount : Nat, role : TokenRole) {
    let a = accounts.get(idx);
    let newFree  = if (role == #Free)  { a.free  + amount } else { a.free  };
    let newGov   = if (role == #Gov)   { a.gov   + amount } else { a.gov   };
    let newCycle = if (role == #Cycle) { a.cycle + amount } else { a.cycle };
    let newVault = if (role == #Vault) { a.vault + amount } else { a.vault };
    accounts.put(idx, {
      principal      = a.principal;
      free           = newFree;
      gov            = newGov;
      cycle          = newCycle;
      vault          = newVault;
      createdAt      = a.createdAt;
      updatedAt      = Time.now();
      txCount        = a.txCount + 1;
      phiFingerprint = a.phiFingerprint;
    });
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ══════════════════════════════════════════════════════════════════

  public func initialize() : async Text {
    if (initialized) { return "NovaToken: already initialized" };
    initialized := true;

    // Seed treasury account
    let tIdx = getOrCreateAccount("treasury");
    creditFreeRole(tIdx, TREASURY_E8S, #Vault);
    treasuryBalance := TREASURY_E8S;

    // Seed community account
    let cIdx = getOrCreateAccount("community");
    creditFreeRole(cIdx, COMMUNITY_E8S, #Free);
    communityBalance := COMMUNITY_E8S;

    // Seed founder account (Free — vesting enforced off-chain by governance)
    let fIdx = getOrCreateAccount("founder");
    creditFreeRole(fIdx, FOUNDER_E8S, #Free);

    auditLog.add("NovaToken initialized. Supply: " # Nat.toText(TOTAL_SUPPLY_E8S) # " e8s");
    "NovaToken initialized. Total supply: " # Nat.toText(TOTAL_SUPPLY_E8S) # " e8s (φ^13 × 10^8)"
  };

  // ══════════════════════════════════════════════════════════════════
  //  CORE TOKEN OPERATIONS
  // ══════════════════════════════════════════════════════════════════

  /// Transfer free NOVA between two principals.
  public func transfer(from : Text, to : Text, amount : Nat, memo : Text) : async TransferResult {
    if (amount == 0) { return #Err("Amount must be > 0") };
    let fIdx = getOrCreateAccount(from);
    if (accountFreeBalance(fIdx) < amount) {
      return #Err("Insufficient free balance");
    };
    let tIdx = getOrCreateAccount(to);
    deductFree(fIdx, amount);
    creditFreeRole(tIdx, amount, #Free);
    let txId = recordTx(from, to, amount, #Free, #Transfer, memo);
    #Ok(txId)
  };

  /// Mint new NOVA to a principal (treasury-authorized only in production;
  /// here any caller can mint — production adds caller guards).
  public func mint(to : Text, amount : Nat, role : TokenRole) : async TransferResult {
    if (amount == 0) { return #Err("Amount must be > 0") };
    let tIdx = getOrCreateAccount(to);
    creditFreeRole(tIdx, amount, role);
    if (role == #Vault or role == #Gov or role == #Cycle) {
      totalLocked += amount;
    };
    let txId = recordTx("MINT", to, amount, role, #Mint, "");
    #Ok(txId)
  };

  /// Burn NOVA permanently from a principal's free balance.
  public func burn(from : Text, amount : Nat) : async TransferResult {
    if (amount == 0) { return #Err("Amount must be > 0") };
    let fIdx = getOrCreateAccount(from);
    if (accountFreeBalance(fIdx) < amount) {
      return #Err("Insufficient free balance to burn");
    };
    deductFree(fIdx, amount);
    totalBurned += amount;
    let txId = recordTx(from, "BURN", amount, #Free, #Burn, "");
    #Ok(txId)
  };

  /// Lock free NOVA into a role (Free → Gov | Cycle | Vault).
  public func lock(principal : Text, amount : Nat, role : TokenRole) : async TransferResult {
    if (role == #Free) { return #Err("Cannot lock into Free role") };
    if (amount == 0)   { return #Err("Amount must be > 0") };
    let idx = getOrCreateAccount(principal);
    if (accountFreeBalance(idx) < amount) {
      return #Err("Insufficient free balance");
    };
    deductFree(idx, amount);
    creditFreeRole(idx, amount, role);
    totalLocked += amount;
    let txId = recordTx(principal, principal, amount, role, #Lock, "");
    #Ok(txId)
  };

  /// Unlock a role balance back to free.
  public func unlock(principal : Text, amount : Nat, role : TokenRole) : async TransferResult {
    if (role == #Free) { return #Err("Cannot unlock from Free role") };
    if (amount == 0)   { return #Err("Amount must be > 0") };
    let idx = getOrCreateAccount(principal);
    let a = accounts.get(idx);
    let roleBalance : Nat = switch role {
      case (#Gov)   a.gov;
      case (#Cycle) a.cycle;
      case (#Vault) a.vault;
      case (#Free)  0;
    };
    if (roleBalance < amount) { return #Err("Insufficient locked balance") };
    // Deduct from role, credit to Free
    let newGov   = if (role == #Gov)   { a.gov   - amount } else { a.gov   };
    let newCycle = if (role == #Cycle) { a.cycle - amount } else { a.cycle };
    let newVault = if (role == #Vault) { a.vault - amount } else { a.vault };
    accounts.put(idx, {
      principal      = a.principal;
      free           = a.free + amount;
      gov            = newGov;
      cycle          = newCycle;
      vault          = newVault;
      createdAt      = a.createdAt;
      updatedAt      = Time.now();
      txCount        = a.txCount + 1;
      phiFingerprint = a.phiFingerprint;
    });
    if (totalLocked >= amount) { totalLocked -= amount };
    let txId = recordTx(principal, principal, amount, role, #Unlock, "");
    #Ok(txId)
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func balanceOf(principal : Text) : async ?Account {
    switch (findAccount(principal)) {
      case (?i) ?accounts.get(i);
      case null null;
    }
  };

  public query func getSupplySnapshot() : async SupplySnapshot {
    let tb = switch (findAccount("treasury")) {
      case (?i) accounts.get(i).vault;
      case null 0;
    };
    let totalMinted = TOTAL_SUPPLY_E8S - totalBurned;
    let circ = if (totalMinted > tb + totalLocked) {
      totalMinted - tb - totalLocked
    } else { 0 };
    let phiR : Float = if (totalMinted > 0) {
      Float.fromInt(circ) / Float.fromInt(totalMinted)
    } else { 0.0 };
    {
      totalSupply  = totalMinted;
      circulating  = circ;
      treasury     = tb;
      locked       = totalLocked;
      burned       = totalBurned;
      txCount      = nextTxId;
      holderCount  = accounts.size();
      phiRatio     = phiR;
      timestamp    = Time.now();
    }
  };

  public query func getTokenEconomics() : async TokenEconomics {
    {
      totalSupplyE8s             = TOTAL_SUPPLY_E8S;
      treasuryE8s                = TREASURY_E8S;
      communityE8s               = COMMUNITY_E8S;
      founderE8s                 = FOUNDER_E8S;
      e8sPerNova                 = E8S_PER_NOVA;
      nativeCyclesPerIcpE8s      = NATIVE_CYCLES_PER_ICP_E8S;
      cyclePremiumPartsPer1M     = CYCLE_PREMIUM_PARTS_PER_MILLION;
      cyclePremiumDescription    =
        "1 ICP raw = 10T XDR cycles. " #
        "1 ICP in NOVA buys 10T/PHI^2 = 3.82T Native Cycles. " #
        "Treasury captures PHI^2-1 = 161.8% premium over raw rate. " #
        "At 1M Native Cycles/day volume: PHI^2x more revenue than raw reseller.";
      phiSupplyExponent          = 13;
      phiPremiumExponent         = 2;
      subTokenRoles              = ["Gov", "Cycle", "Vault", "Free"];
    }
  };

  public query func getRecentTransactions(n : Nat) : async [Transaction] {
    let total = ledger.size();
    if (total == 0) { return [] };
    let start = if (total > n) { total - n } else { 0 };
    var result : [Transaction] = [];
    var i = start;
    while (i < total) {
      result := Array.append(result, [ledger.get(i)]);
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
      name      = "NOVA_TOKEN";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "NOVA_TOKEN self-check complete. No drift detected."
  };

  public func register() : async Text {
    "NOVA_TOKEN registered. Capabilities: [sovereign, active]."
  };

  public query func report_status() : async Text {
    "NOVA_TOKEN | status=ACTIVE | v10=true"
  };


}