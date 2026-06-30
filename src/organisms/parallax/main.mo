///
/// PARALLAX — Sovereign Encrypted Wallet
///
/// "Every account is a lens.  Every lens refracts value differently."
///
/// Parallax is the encrypted financial organism of the Native Nova Protocol.
/// It is the single point through which all value flows in and out of the
/// architecture — ICP, NOVA tokens, Native Nova Cycles (NNC), and neuron
/// maturity.  Every account is cryptographically fingerprinted with φ-math
/// so that no two accounts share an identity surface.
///
/// What Parallax holds:
///   — ICP (e8s)              — raw Internet Computer Protocol tokens
///   — NOVA (e8s)             — Native Nova governance/utility token
///   — NNC                    — Native Nova Cycles (compute access)
///   — Neuron links           — pointers to NNS neurons managed by nns_proxy
///   — Maturity credits       — accrued governance rewards (before spawn)
///
/// Encryption model:
///   Each account carries a φ-fingerprint:
///     fingerprint = Σᵢ (charCode(principal[i]) × PHI^i) mod LARGE_PRIME
///   This is NOT cryptographic encryption (IC vetKeys required for that) —
///   it is a sovereign identity attestation that makes every account's
///   state uniquely traceable without a private key.  Full cryptographic
///   encryption is the next layer (vetKeys integration, flagged TODO).
///
/// Economic routing (the full flow):
///   ICP in  → depositICP()     → held in Parallax
///   ICP     → stakeNeuron()    → intent logged, routed to nns_proxy
///   ICP     → buyNNC()         → converts at NNC_PER_ICP_E8S rate, logs to cycles_market
///   NOVA    → lock()           → locks for governance role
///   NNC     → deployCanister() → funds a cycles_market slot
///   Maturity → receiveMaturity() → credited as ICP e8s, re-stakeable
///   ICP out → withdrawICP()    → two-step: request + confirm
///
/// Architecture note:
///   Parallax calls nns_proxy and cycles_market logically (no actual
///   inter-canister calls here — those require known canister IDs set
///   at deploy time via registerPeer()).  This canister tracks its own
///   state and emits instructions; the frontend or CLI executes them.
///
/// Initialization:
///   Call initialize() once after deploy.  Idempotent.
///
/// Lifecycle:
///   Call tick() periodically to refresh account indices and log heartbeat.
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Nat32  "mo:base/Nat32";
import Char   "mo:base/Char";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Quipu  "./quipu";

persistent actor Parallax {

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

  /// ICP e8s per whole ICP
  transient let E8S_PER_ICP : Nat = 100_000_000;

  /// NNC per ICP e8s (mirrors cycles_market constant)
  transient let NNC_PER_ICP_E8S : Nat = 3_820_040_000_000;

  /// Withdrawal confirmation window: 8 ticks.
  /// 8 is a Fibonacci number.  If tick = 1 day this equals 8 days.
  transient let WITHDRAW_CONFIRM_TICKS : Nat = 8;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type AccountRole = {
    #Standard;     // Regular user account
    #Organism;     // An AI organism account (managed by DIVI or protocol)
    #Treasury;     // Protocol treasury
    #Governance;   // Governance-only account (NNS proxy link)
  };

  public type Account = {
    principal       : Text;
    role            : AccountRole;
    icpE8s          : Nat;       // ICP balance
    novaE8s         : Nat;       // NOVA token balance
    nnc             : Nat;       // Native Nova Cycles balance
    maturityE8s     : Nat;       // Accrued neuron maturity (ICP e8s)
    linkedNeurons   : [Nat];     // Neuron IDs in nns_proxy
    phiFingerprint  : Float;     // φ-identity attestation
    createdAt       : Int;
    updatedAt       : Int;
    txCount         : Nat;
    withdrawPending : Bool;
  };

  public type TxKind = {
    #Deposit;
    #Withdraw;
    #BuyNNC;
    #SellNNC;
    #StakeNeuron;
    #ReceiveMaturity;
    #LockNova;
    #UnlockNova;
    #DeployCanister;
    #Transfer;
    #Fee;
  };

  public type Transaction = {
    id        : Nat;
    principal : Text;
    kind      : TxKind;
    icpDelta  : Int;    // positive = credit, negative = debit
    novaDelta : Int;
    nncDelta  : Int;
    memo      : Text;
    timestamp : Int;
  };

  public type WithdrawRequest = {
    id           : Nat;
    principal    : Text;
    amountE8s    : Nat;
    destination  : Text;
    requestedAt  : Int;
    confirmsAt   : Nat;  // tick number when confirmable
    confirmed    : Bool;
    executed     : Bool;
  };

  public type StakeIntent = {
    id              : Nat;
    principal       : Text;
    icpE8s          : Nat;
    targetTier      : Nat;   // 0–7 Fibonacci tier
    followSelf      : Bool;
    status          : StakeStatus;
    timestamp       : Int;
  };

  public type StakeStatus = {
    #Pending;
    #Submitted;
    #Confirmed;
    #Failed;
  };

  public type EconomyStatement = {
    principal       : Text;
    icpE8s          : Nat;
    novaE8s         : Nat;
    nnc             : Nat;
    maturityE8s     : Nat;
    linkedNeurons   : [Nat];
    phiFingerprint  : Float;
    recentTxCount   : Nat;
    withdrawPending : Bool;
    accountAge      : Int;    // nanoseconds since creation
    timestamp       : Int;
  };

  public type WalletSnapshot = {
    totalAccounts      : Nat;
    totalIcpE8s        : Nat;
    totalNovaE8s       : Nat;
    totalNNC           : Nat;
    totalMaturityE8s   : Nat;
    totalStakeIntents  : Nat;
    pendingWithdrawals : Nat;
    txCount            : Nat;
    tickCount          : Nat;
    phiHealthIndex     : Float;
    timestamp          : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  PEER REGISTRY (cross-canister coordination addresses)
  // ══════════════════════════════════════════════════════════════════

  public type PeerCanister = {
    name      : Text;
    principal : Text;
    role      : Text;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized    : Bool = false;
  stable var nextTxId       : Nat  = 0;
  stable var nextWithdrawId : Nat  = 0;
  stable var nextStakeId    : Nat  = 0;
  stable var tickCount      : Nat  = 0;

  transient let accounts         : Buffer.Buffer<Account>         = Buffer.Buffer<Account>(256);
  transient let ledger           : Buffer.Buffer<Transaction>     = Buffer.Buffer<Transaction>(4096);
  transient let withdrawRequests : Buffer.Buffer<WithdrawRequest> = Buffer.Buffer<WithdrawRequest>(64);
  transient let stakeIntents     : Buffer.Buffer<StakeIntent>     = Buffer.Buffer<StakeIntent>(128);
  transient let peers            : Buffer.Buffer<PeerCanister>    = Buffer.Buffer<PeerCanister>(8);
  transient let auditLog         : Buffer.Buffer<Text>            = Buffer.Buffer<Text>(1024);

  // ══════════════════════════════════════════════════════════════════
  //  DIGITAL QUIPU — Journal Substrate State
  // ══════════════════════════════════════════════════════════════════
  //
  //  "Parallax is the Ukhu Pacha layer — the void, the inner world,
  //   the seed layer where raw thought, raw pattern, raw emergence
  //   gets captured before it becomes structure."
  //
  //  The Digital Quipu is the journal substrate where:
  //    — Agents write their observations and reasoning
  //    — Engines record transformations and state
  //    — Builds are observed and logged
  //    — Void layer signals emerge
  //    — The Architectonic Engine writes its inner monologue
  //

  stable var nextQuipuId : Nat = 0;
  transient let quipuJournal : Buffer.Buffer<Quipu.QuipuEntry> = Buffer.Buffer<Quipu.QuipuEntry>(2048);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func txKindText(k : TxKind) : Text {
    switch k {
      case (#Deposit)         "Deposit";
      case (#Withdraw)        "Withdraw";
      case (#BuyNNC)          "BuyNNC";
      case (#SellNNC)         "SellNNC";
      case (#StakeNeuron)     "StakeNeuron";
      case (#ReceiveMaturity) "ReceiveMaturity";
      case (#LockNova)        "LockNova";
      case (#UnlockNova)      "UnlockNova";
      case (#DeployCanister)  "DeployCanister";
      case (#Transfer)        "Transfer";
      case (#Fee)             "Fee";
    }
  };

  func roleText(r : AccountRole) : Text {
    switch r {
      case (#Standard)   "Standard";
      case (#Organism)   "Organism";
      case (#Treasury)   "Treasury";
      case (#Governance) "Governance";
    }
  };

  func stakeStatusText(s : StakeStatus) : Text {
    switch s {
      case (#Pending)   "Pending";
      case (#Submitted) "Submitted";
      case (#Confirmed) "Confirmed";
      case (#Failed)    "Failed";
    }
  };

  /// φ-fingerprint for a principal string.
  /// fingerprint = Σᵢ (charCode(principal[i]) × PHI^i)
  func computeFingerprint(principal : Text) : Float {
    var fp   : Float = 0.0;
    var pw   : Float = 1.0;  // PHI^0
    for (ch in principal.chars()) {
      fp += Float.fromInt(Nat32.toNat(Char.toNat32(ch))) * pw;
      pw := pw * PHI;
    };
    fp
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

  func getOrCreateAccount(principal : Text, role : AccountRole) : Nat {
    switch (findAccount(principal)) {
      case (?i) i;
      case null {
        let now = Time.now();
        let acc : Account = {
          principal       = principal;
          role            = role;
          icpE8s          = 0;
          novaE8s         = 0;
          nnc             = 0;
          maturityE8s     = 0;
          linkedNeurons   = [];
          phiFingerprint  = computeFingerprint(principal);
          createdAt       = now;
          updatedAt       = now;
          txCount         = 0;
          withdrawPending = false;
        };
        accounts.add(acc);
        accounts.size() - 1
      };
    }
  };

  func recordTx(
    principal : Text,
    kind      : TxKind,
    icpDelta  : Int,
    novaDelta : Int,
    nncDelta  : Int,
    memo      : Text
  ) : Nat {
    let id = nextTxId;
    nextTxId += 1;
    let tx : Transaction = {
      id;
      principal;
      kind;
      icpDelta;
      novaDelta;
      nncDelta;
      memo;
      timestamp = Time.now();
    };
    ledger.add(tx);
    auditLog.add(
      "TX#" # Nat.toText(id) # " [" # txKindText(kind) # "] " # principal #
      " ICP:" # Int.toText(icpDelta) #
      " NOVA:" # Int.toText(novaDelta) #
      " NNC:" # Int.toText(nncDelta)
    );
    id
  };

  func creditAccount(
    idx       : Nat,
    icpDelta  : Nat,
    novaDelta : Nat,
    nncDelta  : Nat
  ) {
    let a = accounts.get(idx);
    accounts.put(idx, {
      principal       = a.principal;
      role            = a.role;
      icpE8s          = a.icpE8s  + icpDelta;
      novaE8s         = a.novaE8s + novaDelta;
      nnc             = a.nnc     + nncDelta;
      maturityE8s     = a.maturityE8s;
      linkedNeurons   = a.linkedNeurons;
      phiFingerprint  = a.phiFingerprint;
      createdAt       = a.createdAt;
      updatedAt       = Time.now();
      txCount         = a.txCount + 1;
      withdrawPending = a.withdrawPending;
    });
  };

  func debitAccount(
    idx       : Nat,
    icpDelta  : Nat,
    novaDelta : Nat,
    nncDelta  : Nat
  ) : Bool {
    let a = accounts.get(idx);
    if (a.icpE8s < icpDelta or a.novaE8s < novaDelta or a.nnc < nncDelta) {
      return false;
    };
    accounts.put(idx, {
      principal       = a.principal;
      role            = a.role;
      icpE8s          = a.icpE8s  - icpDelta;
      novaE8s         = a.novaE8s - novaDelta;
      nnc             = a.nnc     - nncDelta;
      maturityE8s     = a.maturityE8s;
      linkedNeurons   = a.linkedNeurons;
      phiFingerprint  = a.phiFingerprint;
      createdAt       = a.createdAt;
      updatedAt       = Time.now();
      txCount         = a.txCount + 1;
      withdrawPending = a.withdrawPending;
    });
    true
  };

  func linkNeuron(idx : Nat, neuronId : Nat) {
    let a = accounts.get(idx);
    let existing = a.linkedNeurons;
    // Check not already linked
    var found = false;
    var i : Nat = 0;
    while (i < existing.size()) {
      if (existing[i] == neuronId) { found := true };
      i += 1;
    };
    if (not found) {
      accounts.put(idx, {
        principal       = a.principal;
        role            = a.role;
        icpE8s          = a.icpE8s;
        novaE8s         = a.novaE8s;
        nnc             = a.nnc;
        maturityE8s     = a.maturityE8s;
        linkedNeurons   = Array.append(existing, [neuronId]);
        phiFingerprint  = a.phiFingerprint;
        createdAt       = a.createdAt;
        updatedAt       = Time.now();
        txCount         = a.txCount;
        withdrawPending = a.withdrawPending;
      });
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ══════════════════════════════════════════════════════════════════

  public func initialize() : async Text {
    if (initialized) { return "Parallax: already initialized" };
    initialized := true;

    // Seed protocol accounts
    ignore getOrCreateAccount("treasury",   #Treasury);
    ignore getOrCreateAccount("governance", #Governance);
    ignore getOrCreateAccount("divi",       #Organism);

    // Register known peers (IDs filled post-deploy)
    peers.add({ name = "nova_token";    principal = ""; role = "token_ledger"    });
    peers.add({ name = "nns_proxy";     principal = ""; role = "neuron_manager"  });
    peers.add({ name = "cycles_market"; principal = ""; role = "cycle_exchange"  });

    auditLog.add("Parallax initialized. Accounts seeded. DIVI linked.");
    "Parallax initialized. Treasury, Governance, DIVI accounts ready."
  };

  // ══════════════════════════════════════════════════════════════════
  //  PEER MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  public func registerPeer(name : Text, principal : Text, role : Text) : async Text {
    // Update existing or add new
    var found = false;
    var i : Nat = 0;
    while (i < peers.size()) {
      let p = peers.get(i);
      if (p.name == name) {
        peers.put(i, { name; principal; role });
        found := true;
      };
      i += 1;
    };
    if (not found) { peers.add({ name; principal; role }) };
    "Peer registered: " # name # " @ " # principal
  };

  // ══════════════════════════════════════════════════════════════════
  //  DEPOSIT / WITHDRAW
  // ══════════════════════════════════════════════════════════════════

  /// Credit ICP to an account (call after on-chain transfer confirmed).
  public func depositICP(principal : Text, amountE8s : Nat) : async Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    creditAccount(idx, amountE8s, 0, 0);
    recordTx(principal, #Deposit, Int.abs(amountE8s), 0, 0,
             "ICP deposit: " # Nat.toText(amountE8s) # " e8s")
  };

  /// Credit NOVA to an account.
  public func depositNova(principal : Text, novaE8s : Nat) : async Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    creditAccount(idx, 0, novaE8s, 0);
    recordTx(principal, #Deposit, 0, Int.abs(novaE8s), 0,
             "NOVA deposit: " # Nat.toText(novaE8s) # " e8s")
  };

  /// Credit NNC to an account (from cycles_market purchase).
  public func depositNNC(principal : Text, nncAmount : Nat) : async Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    creditAccount(idx, 0, 0, nncAmount);
    recordTx(principal, #Deposit, 0, 0, Int.abs(nncAmount),
             "NNC deposit: " # Nat.toText(nncAmount))
  };

  /// Request a withdrawal.  Must be confirmed after WITHDRAW_CONFIRM_TICKS.
  public func requestWithdrawICP(
    principal   : Text,
    amountE8s   : Nat,
    destination : Text
  ) : async ?Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    let a = accounts.get(idx);
    if (a.icpE8s < amountE8s) { return null };
    if (a.withdrawPending)    { return null };

    // Lock the ICP (debit now, execute on confirm)
    ignore debitAccount(idx, amountE8s, 0, 0);
    accounts.put(idx, {
      principal       = a.principal;
      role            = a.role;
      icpE8s          = accounts.get(idx).icpE8s;
      novaE8s         = a.novaE8s;
      nnc             = a.nnc;
      maturityE8s     = a.maturityE8s;
      linkedNeurons   = a.linkedNeurons;
      phiFingerprint  = a.phiFingerprint;
      createdAt       = a.createdAt;
      updatedAt       = Time.now();
      txCount         = a.txCount + 1;
      withdrawPending = true;
    });

    let wId = nextWithdrawId;
    nextWithdrawId += 1;
    let req : WithdrawRequest = {
      id          = wId;
      principal;
      amountE8s;
      destination;
      requestedAt = Time.now();
      confirmsAt  = tickCount + WITHDRAW_CONFIRM_TICKS;
      confirmed   = false;
      executed    = false;
    };
    withdrawRequests.add(req);
    ignore recordTx(principal, #Withdraw, -Int.abs(amountE8s), 0, 0,
             "Withdraw requested: " # Nat.toText(amountE8s) # " e8s → " # destination);
    auditLog.add("Withdraw #" # Nat.toText(wId) # " requested by " # principal);
    ?wId
  };

  /// Confirm and execute a withdrawal (after confirmation window).
  public func confirmWithdraw(withdrawId : Nat) : async Text {
    if (withdrawId >= withdrawRequests.size()) { return "Error: request not found" };
    let req = withdrawRequests.get(withdrawId);
    if (req.executed)  { return "Error: already executed" };
    if (tickCount < req.confirmsAt) {
      return "Error: confirmation window not yet elapsed (" #
             Nat.toText(req.confirmsAt - tickCount) # " ticks remaining)"
    };
    withdrawRequests.put(withdrawId, {
      id          = req.id;
      principal   = req.principal;
      amountE8s   = req.amountE8s;
      destination = req.destination;
      requestedAt = req.requestedAt;
      confirmsAt  = req.confirmsAt;
      confirmed   = true;
      executed    = true;
    });
    // Clear withdrawPending flag on account
    switch (findAccount(req.principal)) {
      case (?idx) {
        let a = accounts.get(idx);
        accounts.put(idx, {
          principal       = a.principal;
          role            = a.role;
          icpE8s          = a.icpE8s;
          novaE8s         = a.novaE8s;
          nnc             = a.nnc;
          maturityE8s     = a.maturityE8s;
          linkedNeurons   = a.linkedNeurons;
          phiFingerprint  = a.phiFingerprint;
          createdAt       = a.createdAt;
          updatedAt       = Time.now();
          txCount         = a.txCount;
          withdrawPending = false;
        });
      };
      case null {};
    };
    auditLog.add("Withdraw #" # Nat.toText(withdrawId) # " confirmed → " # req.destination);
    "Withdraw #" # Nat.toText(withdrawId) # " executed: " # Nat.toText(req.amountE8s) # " e8s → " # req.destination
  };

  // ══════════════════════════════════════════════════════════════════
  //  BUY / SELL NNC
  // ══════════════════════════════════════════════════════════════════

  /// Convert ICP → NNC at the sovereign rate.
  /// Rate: NNC_PER_ICP_E8S = 3_820_040_000_000 NNC per 1 ICP (100M e8s)
  public func buyNNC(principal : Text, icpE8s : Nat) : async ?Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    if (not debitAccount(idx, icpE8s, 0, 0)) { return null };
    // NNC = icpE8s × NNC_PER_ICP_E8S / E8S_PER_ICP
    let nncAmount = icpE8s * NNC_PER_ICP_E8S / 100_000_000;
    creditAccount(idx, 0, 0, nncAmount);
    let txId = recordTx(
      principal, #BuyNNC,
      -Int.abs(icpE8s), 0, Int.abs(nncAmount),
      "Buy NNC: " # Nat.toText(icpE8s) # " ICP e8s → " # Nat.toText(nncAmount) # " NNC"
    );
    ?txId
  };

  /// Convert NNC → ICP at the unwrap floor rate (PHI^-2 of buy rate).
  /// Floor rate: 1 NNC → 1/PHI^2 raw ICP cycles
  /// ICP e8s = nncAmount × E8S_PER_ICP / NNC_PER_ICP_E8S
  public func sellNNC(principal : Text, nncAmount : Nat) : async ?Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    if (not debitAccount(idx, 0, 0, nncAmount)) { return null };
    // ICP e8s at floor rate (no premium — selling back surrenders the premium)
    let icpE8s = nncAmount * 100_000_000 / NNC_PER_ICP_E8S;
    creditAccount(idx, icpE8s, 0, 0);
    let txId = recordTx(
      principal, #SellNNC,
      Int.abs(icpE8s), 0, -Int.abs(nncAmount),
      "Sell NNC: " # Nat.toText(nncAmount) # " NNC → " # Nat.toText(icpE8s) # " ICP e8s (floor)"
    );
    ?txId
  };

  // ══════════════════════════════════════════════════════════════════
  //  NEURON STAKING
  // ══════════════════════════════════════════════════════════════════

  /// Intent to stake ICP into a new NNS neuron via nns_proxy.
  /// Deducts ICP from account and logs intent.  Execution happens externally.
  public func stakeNeuron(
    principal  : Text,
    icpE8s     : Nat,
    tier       : Nat,   // 0–7 dissolve tier
    followSelf : Bool
  ) : async ?Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    if (not debitAccount(idx, icpE8s, 0, 0)) { return null };

    let sId = nextStakeId;
    nextStakeId += 1;
    let intent : StakeIntent = {
      id         = sId;
      principal;
      icpE8s;
      targetTier = if (tier < 8) tier else 7;
      followSelf;
      status     = #Pending;
      timestamp  = Time.now();
    };
    stakeIntents.add(intent);
    ignore recordTx(
      principal, #StakeNeuron,
      -Int.abs(icpE8s), 0, 0,
      "Stake intent #" # Nat.toText(sId) # ": " # Nat.toText(icpE8s) # " e8s at tier " # Nat.toText(tier)
    );
    auditLog.add("Stake intent #" # Nat.toText(sId) # " by " # principal);
    ?sId
  };

  /// Confirm a stake intent (neuron created on mainnet, link back).
  public func confirmStake(stakeId : Nat, neuronId : Nat) : async Text {
    if (stakeId >= stakeIntents.size()) { return "Error: stake intent not found" };
    let si = stakeIntents.get(stakeId);
    stakeIntents.put(stakeId, {
      id         = si.id;
      principal  = si.principal;
      icpE8s     = si.icpE8s;
      targetTier = si.targetTier;
      followSelf = si.followSelf;
      status     = #Confirmed;
      timestamp  = si.timestamp;
    });
    // Link neuron to account
    switch (findAccount(si.principal)) {
      case (?idx) { linkNeuron(idx, neuronId) };
      case null   {};
    };
    auditLog.add("Stake #" # Nat.toText(stakeId) # " confirmed → neuron #" # Nat.toText(neuronId));
    "Stake confirmed. Neuron #" # Nat.toText(neuronId) # " linked to " # si.principal
  };

  // ══════════════════════════════════════════════════════════════════
  //  MATURITY
  // ══════════════════════════════════════════════════════════════════

  /// Receive maturity from a neuron (credited as ICP e8s, stakeable again).
  public func receiveMaturity(
    principal   : Text,
    neuronId    : Nat,
    maturityE8s : Nat
  ) : async Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    let a = accounts.get(idx);
    accounts.put(idx, {
      principal       = a.principal;
      role            = a.role;
      icpE8s          = a.icpE8s + maturityE8s;
      novaE8s         = a.novaE8s;
      nnc             = a.nnc;
      maturityE8s     = a.maturityE8s + maturityE8s;
      linkedNeurons   = a.linkedNeurons;
      phiFingerprint  = a.phiFingerprint;
      createdAt       = a.createdAt;
      updatedAt       = Time.now();
      txCount         = a.txCount + 1;
      withdrawPending = a.withdrawPending;
    });
    recordTx(
      principal, #ReceiveMaturity,
      Int.abs(maturityE8s), 0, 0,
      "Maturity from neuron #" # Nat.toText(neuronId) # ": " # Nat.toText(maturityE8s) # " e8s"
    )
  };

  // ══════════════════════════════════════════════════════════════════
  //  CANISTER DEPLOYMENT (via NNC)
  // ══════════════════════════════════════════════════════════════════

  /// Spend NNC to deploy a canister slot (routes to cycles_market logically).
  public func deployCanister(
    principal : Text,
    nncAmount : Nat,
    grp     : Text
  ) : async ?Nat {
    let idx = getOrCreateAccount(principal, #Standard);
    if (not debitAccount(idx, 0, 0, nncAmount)) { return null };
    let txId = recordTx(
      principal, #DeployCanister,
      0, 0, -Int.abs(nncAmount),
      "Deploy canister [" # grp # "]: " # Nat.toText(nncAmount) # " NNC"
    );
    auditLog.add("Canister deployed by " # principal # ": " # grp);
    ?txId
  };

  // ══════════════════════════════════════════════════════════════════
  //  TRANSFER BETWEEN ACCOUNTS
  // ══════════════════════════════════════════════════════════════════

  public func transferICP(from : Text, to : Text, amountE8s : Nat) : async ?Nat {
    let fIdx = getOrCreateAccount(from, #Standard);
    if (not debitAccount(fIdx, amountE8s, 0, 0)) { return null };
    let tIdx = getOrCreateAccount(to, #Standard);
    creditAccount(tIdx, amountE8s, 0, 0);
    let txId = recordTx(from, #Transfer, -Int.abs(amountE8s), 0, 0,
                        "ICP transfer → " # to);
    ?txId
  };

  public func transferNova(from : Text, to : Text, amountE8s : Nat) : async ?Nat {
    let fIdx = getOrCreateAccount(from, #Standard);
    if (not debitAccount(fIdx, 0, amountE8s, 0)) { return null };
    let tIdx = getOrCreateAccount(to, #Standard);
    creditAccount(tIdx, 0, amountE8s, 0);
    let txId = recordTx(from, #Transfer, 0, -Int.abs(amountE8s), 0,
                        "NOVA transfer → " # to);
    ?txId
  };

  // ══════════════════════════════════════════════════════════════════
  //  LIFECYCLE — tick
  // ══════════════════════════════════════════════════════════════════

  public func tick() : async Text {
    tickCount += 1;

    // Process any withdrawal requests that have passed their window
    var processed : Nat = 0;
    var i : Nat = 0;
    while (i < withdrawRequests.size()) {
      let req = withdrawRequests.get(i);
      if (not req.executed and tickCount >= req.confirmsAt) {
        // Auto-confirm after window (production would require explicit confirm)
        processed += 1;
      };
      i += 1;
    };

    auditLog.add("Parallax tick #" # Nat.toText(tickCount) # " | accounts: " # Nat.toText(accounts.size()));
    "Tick " # Nat.toText(tickCount) # " complete. Accounts: " # Nat.toText(accounts.size())
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func getAccount(principal : Text) : async ?Account {
    switch (findAccount(principal)) {
      case (?i) ?accounts.get(i);
      case null null;
    }
  };

  public query func getStatement(principal : Text) : async ?EconomyStatement {
    switch (findAccount(principal)) {
      case null null;
      case (?i) {
        let a = accounts.get(i);
        var txCount : Nat = 0;
        var j : Nat = 0;
        while (j < ledger.size()) {
          if (ledger.get(j).principal == principal) { txCount += 1 };
          j += 1;
        };
        ?{
          principal       = a.principal;
          icpE8s          = a.icpE8s;
          novaE8s         = a.novaE8s;
          nnc             = a.nnc;
          maturityE8s     = a.maturityE8s;
          linkedNeurons   = a.linkedNeurons;
          phiFingerprint  = a.phiFingerprint;
          recentTxCount   = txCount;
          withdrawPending = a.withdrawPending;
          accountAge      = Time.now() - a.createdAt;
          timestamp       = Time.now();
        }
      };
    }
  };

  public query func getWalletSnapshot() : async WalletSnapshot {
    var totalICP  : Nat = 0;
    var totalNova : Nat = 0;
    var totalNNC  : Nat = 0;
    var totalMat  : Nat = 0;
    var i : Nat = 0;
    while (i < accounts.size()) {
      let a = accounts.get(i);
      totalICP  += a.icpE8s;
      totalNova += a.novaE8s;
      totalNNC  += a.nnc;
      totalMat  += a.maturityE8s;
      i += 1;
    };

    // φ-health index: ratio of NNC in circulation vs all balances
    let totalValue : Float = Float.fromInt(totalICP + totalNova + totalNNC);
    let phiHealth : Float = if (totalValue > 0.0) {
      Float.fromInt(totalNNC) / totalValue
    } else { 0.0 };

    var pendingWithdrawals : Nat = 0;
    i := 0;
    while (i < withdrawRequests.size()) {
      if (not withdrawRequests.get(i).executed) { pendingWithdrawals += 1 };
      i += 1;
    };

    {
      totalAccounts      = accounts.size();
      totalIcpE8s        = totalICP;
      totalNovaE8s       = totalNova;
      totalNNC           = totalNNC;
      totalMaturityE8s   = totalMat;
      totalStakeIntents  = stakeIntents.size();
      pendingWithdrawals;
      txCount            = nextTxId;
      tickCount          = tickCount;
      phiHealthIndex     = phiHealth;
      timestamp          = Time.now();
    }
  };

  public query func getRecentTransactions(principal : Text, n : Nat) : async [Transaction] {
    var result : [Transaction] = [];
    var count : Nat = 0;
    var i : Nat = ledger.size();
    while (i > 0 and count < n) {
      i -= 1;
      let tx = ledger.get(i);
      if (tx.principal == principal) {
        result := Array.append([tx], result);
        count += 1;
      };
    };
    result
  };

  public query func getPendingStakeIntents() : async [StakeIntent] {
    var result : [StakeIntent] = [];
    var i : Nat = 0;
    while (i < stakeIntents.size()) {
      let si = stakeIntents.get(i);
      switch (si.status) {
        case (#Pending or #Submitted) {
          result := Array.append(result, [si]);
        };
        case (_) {};
      };
      i += 1;
    };
    result
  };

  public query func getPeers() : async [PeerCanister] {
    var result : [PeerCanister] = [];
    var i : Nat = 0;
    while (i < peers.size()) {
      result := Array.append(result, [peers.get(i)]);
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
  //  DIGITAL QUIPU — Journal Substrate Operations
  // ══════════════════════════════════════════════════════════════════
  //
  //  "The digital quipu is memory, structure, narrative, protocol,
  //   synchronization, reflection, and computation all in one."
  //
  //  These operations implement:
  //    — writeQuipu()     : Write new journal entry
  //    — readQuipu()      : Read entry by ID
  //    — queryQuipu()     : Query entries by filter
  //    — mergeQuipu()     : Merge multiple entries
  //    — executeQuipu()   : Execute an entry (if executable)
  //    — getQuipuStats()  : Statistics about the journal
  //

  /// Calculate biorhythm (6-way ancient calendar harmonic)
  /// This mirrors the biorhythm calculation in the Julia/Python/JS engines
  func calculateBiorhythm(timestampNanos : Int) : Float {
    // Convert nanoseconds to milliseconds
    let timestampMs : Float = Float.fromInt(timestampNanos) / 1_000_000.0;

    // Ancient calendar cycles (milliseconds)
    let MAYAN_CYCLE    : Float = 1440.0;
    let SUMERIAN_HOUR  : Float = 3600.0;
    let EGYPTIAN_HOUR  : Float = 2160.0;
    let LUNAR_CYCLE    : Float = 2551.0;
    let SOLAR_CYCLE    : Float = 8760.0;
    let PHI_HEARTBEAT  : Float = 873.0;  // 540 * φ

    // Helper for modulo on floats
    let fmod = func (a : Float, b : Float) : Float {
      a - (Float.floor(a / b) * b)
    };

    // Calculate phases
    let mayanPhase    = fmod(timestampMs, MAYAN_CYCLE) / MAYAN_CYCLE;
    let sumerianPhase = fmod(timestampMs, SUMERIAN_HOUR) / SUMERIAN_HOUR;
    let egyptianPhase = fmod(timestampMs, EGYPTIAN_HOUR) / EGYPTIAN_HOUR;
    let lunarPhase    = fmod(timestampMs, LUNAR_CYCLE) / LUNAR_CYCLE;
    let solarPhase    = fmod(timestampMs, SOLAR_CYCLE) / SOLAR_CYCLE;
    let phiPhase      = fmod(timestampMs, PHI_HEARTBEAT) / PHI_HEARTBEAT;

    // Convert to sine waves (0 to 2π)
    let PI : Float = 3.14159265358979323846;
    let mayanWave    = Float.sin(2.0 * PI * mayanPhase);
    let sumerianWave = Float.sin(2.0 * PI * sumerianPhase);
    let egyptianWave = Float.sin(2.0 * PI * egyptianPhase);
    let lunarWave    = Float.sin(2.0 * PI * lunarPhase);
    let solarWave    = Float.sin(2.0 * PI * solarPhase);
    let phiWave      = Float.sin(2.0 * PI * phiPhase);

    // Pythagorean combination
    let sumSquares =
      mayanWave * mayanWave +
      sumerianWave * sumerianWave +
      egyptianWave * egyptianWave +
      lunarWave * lunarWave +
      solarWave * solarWave +
      phiWave * phiWave;

    let pythagoreanSum = Float.sqrt(sumSquares) / Float.sqrt(6.0);

    // φ-weight the result
    let phiWeighted = pythagoreanSum * PHI / (PHI + 1.0);

    // Normalize to 0-1
    (phiWeighted + 1.0) / 2.0
  };

  /// Generate unique quipu entry ID
  func generateQuipuId() : Text {
    let id = nextQuipuId;
    nextQuipuId += 1;
    "quipu-" # Nat.toText(id) # "-" # Int.toText(Time.now())
  };

  /// Write a new quipu entry to the journal
  public shared(msg) func writeQuipu(
    agent_cluster  : Text,
    engine_state   : Text,
    context        : Text,
    pendants       : [Quipu.PendantNode],
    phi_weight     : Float
  ) : async Result.Result<Text, Text> {
    let now = Time.now();
    let biorhythm = calculateBiorhythm(now);
    let entry_id = generateQuipuId();

    let root : Quipu.RootNode = {
      entry_id;
      agent_cluster;
      engine_state;
      timestamp = now;
      context;
      version = 2;  // Digital Quipu v2
    };

    let audit : Quipu.AuditRecord = {
      timestamp = now;
      operation = #Created;
      principal = Principal.toText(msg.caller);
      agent_cluster;
      description = "Quipu entry created: " # context;
    };

    let entry : Quipu.QuipuEntry = {
      root;
      pendants;
      phi_weight;
      biorhythm;
      merged_from = [];
      audit_trail = [audit];
    };

    quipuJournal.add(entry);

    // Log to audit trail
    auditLog.add(
      "QUIPU#" # entry_id # " [" # agent_cluster # "] " # context #
      " (φ=" # Float.toText(phi_weight) # ", bio=" # Float.toText(biorhythm) # ")"
    );

    // Optionally write to CPL Runtime as memory record
    switch (getCPL()) {
      case null {};
      case (?cpl) {
        ignore cpl.createMemoryRecord(
          #Pattern,
          entry_id,
          ?agent_cluster,
          context,
          [], // tags
          [], // refs
          [], // entities
          phi_weight,
          Nat32.toNat(Nat32.fromIntWrap(now / 1_000_000_000))  // timestamp in seconds
        );
      };
    };

    #ok(entry_id)
  };

  /// Read a quipu entry by ID
  public query func readQuipu(entry_id : Text) : async ?Quipu.QuipuEntry {
    var i : Nat = 0;
    while (i < quipuJournal.size()) {
      let entry = quipuJournal.get(i);
      if (entry.root.entry_id == entry_id) {
        return ?entry;
      };
      i += 1;
    };
    null
  };

  /// Query quipu entries by filter
  public query func queryQuipu(filter : Quipu.QuipuFilter, limit : Nat) : async [Quipu.QuipuEntry] {
    var result : [Quipu.QuipuEntry] = [];
    var count : Nat = 0;
    var i : Nat = 0;

    while (i < quipuJournal.size() and count < limit) {
      let entry = quipuJournal.get(i);
      var matches = true;

      // Apply filters
      switch (filter.agent_cluster) {
        case null {};
        case (?cluster) {
          if (entry.root.agent_cluster != cluster) { matches := false };
        };
      };

      switch (filter.engine_state) {
        case null {};
        case (?engine) {
          if (entry.root.engine_state != engine) { matches := false };
        };
      };

      switch (filter.context) {
        case null {};
        case (?ctx) {
          if (entry.root.context != ctx) { matches := false };
        };
      };

      switch (filter.time_start) {
        case null {};
        case (?start) {
          if (entry.root.timestamp < start) { matches := false };
        };
      };

      switch (filter.time_end) {
        case null {};
        case (?end) {
          if (entry.root.timestamp > end) { matches := false };
        };
      };

      switch (filter.phi_min) {
        case null {};
        case (?min) {
          if (entry.phi_weight < min) { matches := false };
        };
      };

      switch (filter.phi_max) {
        case null {};
        case (?max) {
          if (entry.phi_weight > max) { matches := false };
        };
      };

      if (matches) {
        result := Array.append(result, [entry]);
        count += 1;
      };

      i += 1;
    };

    result
  };

  /// Merge multiple quipu entries into one
  public shared(msg) func mergeQuipu(
    entry_ids : [Text],
    strategy  : Quipu.MergeStrategy,
    new_context : Text
  ) : async Result.Result<Text, Text> {
    if (entry_ids.size() < 2) {
      return #err("Need at least 2 entries to merge");
    };

    // Find all entries
    var entries : [Quipu.QuipuEntry] = [];
    for (id in entry_ids.vals()) {
      switch (await readQuipu(id)) {
        case null {
          return #err("Entry not found: " # id);
        };
        case (?entry) {
          entries := Array.append(entries, [entry]);
        };
      };
    };

    // Merge based on strategy
    let now = Time.now();
    let biorhythm = calculateBiorhythm(now);
    let merged_id = generateQuipuId();

    // Extract first entry's metadata as base
    let first = entries[0];

    // Combine all pendants (simplified merge - just append for now)
    var all_pendants : [Quipu.PendantNode] = [];
    for (entry in entries.vals()) {
      all_pendants := Array.append(all_pendants, entry.pendants);
    };

    // Calculate merged φ-weight (average weighted by original weights)
    var total_weight : Float = 0.0;
    var weight_sum : Float = 0.0;
    for (entry in entries.vals()) {
      total_weight += entry.phi_weight;
      weight_sum += 1.0;
    };
    let avg_weight = if (weight_sum > 0.0) { total_weight / weight_sum } else { 0.5 };

    let root : Quipu.RootNode = {
      entry_id = merged_id;
      agent_cluster = first.root.agent_cluster;
      engine_state = "merge";
      timestamp = now;
      context = new_context;
      version = 2;
    };

    let audit : Quipu.AuditRecord = {
      timestamp = now;
      operation = #Merged;
      principal = Principal.toText(msg.caller);
      agent_cluster = first.root.agent_cluster;
      description = "Merged " # Nat.toText(entry_ids.size()) # " entries";
    };

    let merged_entry : Quipu.QuipuEntry = {
      root;
      pendants = all_pendants;
      phi_weight = avg_weight;
      biorhythm;
      merged_from = entry_ids;
      audit_trail = [audit];
    };

    quipuJournal.add(merged_entry);

    auditLog.add(
      "QUIPU_MERGE#" # merged_id # " merged " # Nat.toText(entry_ids.size()) # " entries"
    );

    #ok(merged_id)
  };

  /// Execute a quipu entry (for executable entries like "decision" entries)
  public shared(msg) func executeQuipu(
    entry_id : Text,
    exec_context : Quipu.ExecutionContext
  ) : async Result.Result<Quipu.ExecutionResult, Text> {
    switch (await readQuipu(entry_id)) {
      case null {
        #err("Entry not found: " # entry_id)
      };
      case (?entry) {
        let now = Time.now();

        // Check if entry has "decision" or "resolution" pendants (executable types)
        var is_executable = false;
        for (pendant in entry.pendants.vals()) {
          if (pendant.field == "decision" or pendant.field == "resolution" or pendant.field == "synthesis") {
            is_executable := true;
          };
        };

        if (not is_executable) {
          return #err("Entry is not executable (no decision/resolution/synthesis pendant)");
        };

        // For now, execution is a placeholder - actual execution would depend on
        // the specific pendant contents and would likely call other organisms
        let mode_text = if (exec_context.dry_run) { "dry-run" } else { "live" };
        let result : Quipu.ExecutionResult = {
          success = true;
          output = "Executed entry " # entry_id # " in " # mode_text # " mode";
          modifications = [];
          errors = [];
          timestamp = now;
        };

        // Add execution to audit trail (modify existing entry)
        // Note: In production, we'd need to find and update the entry in the buffer
        auditLog.add("QUIPU_EXEC#" # entry_id # " executed by " # exec_context.executor);

        #ok(result)
      };
    }
  };

  /// Get quipu journal statistics
  public query func getQuipuStats() : async {
    total_entries    : Nat;
    by_agent_cluster : [(Text, Nat)];
    by_engine        : [(Text, Nat)];
    by_context       : [(Text, Nat)];
    avg_phi_weight   : Float;
    avg_biorhythm    : Float;
    oldest_timestamp : ?Int;
    newest_timestamp : ?Int;
  } {
    let total = quipuJournal.size();

    if (total == 0) {
      return {
        total_entries = 0;
        by_agent_cluster = [];
        by_engine = [];
        by_context = [];
        avg_phi_weight = 0.0;
        avg_biorhythm = 0.0;
        oldest_timestamp = null;
        newest_timestamp = null;
      };
    };

    // Count by categories
    var agent_counts : [(Text, Nat)] = [];
    var engine_counts : [(Text, Nat)] = [];
    var context_counts : [(Text, Nat)] = [];
    var total_phi : Float = 0.0;
    var total_bio : Float = 0.0;
    var oldest : Int = quipuJournal.get(0).root.timestamp;
    var newest : Int = quipuJournal.get(0).root.timestamp;

    var i : Nat = 0;
    while (i < total) {
      let entry = quipuJournal.get(i);

      // Update φ and biorhythm totals
      total_phi += entry.phi_weight;
      total_bio += entry.biorhythm;

      // Update timestamps
      if (entry.root.timestamp < oldest) { oldest := entry.root.timestamp };
      if (entry.root.timestamp > newest) { newest := entry.root.timestamp };

      // Count by agent_cluster (simplified - full implementation would use HashMap)
      // For now, just track the first few unique values

      i += 1;
    };

    {
      total_entries = total;
      by_agent_cluster = agent_counts;
      by_engine = engine_counts;
      by_context = context_counts;
      avg_phi_weight = total_phi / Float.fromInt(total);
      avg_biorhythm = total_bio / Float.fromInt(total);
      oldest_timestamp = ?oldest;
      newest_timestamp = ?newest;
    }
  };

  /// Get recent quipu entries (last N)
  public query func getRecentQuipu(n : Nat) : async [Quipu.QuipuEntry] {
    let total = quipuJournal.size();
    if (total == 0) { return [] };

    let start = if (total > n) { total - n } else { 0 };
    var result : [Quipu.QuipuEntry] = [];
    var i = start;

    while (i < total) {
      result := Array.append(result, [quipuJournal.get(i)]);
      i += 1;
    };

    result
  };

}
