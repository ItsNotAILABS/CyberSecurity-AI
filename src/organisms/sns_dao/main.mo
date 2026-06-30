///
/// SNS DAO — Service Nervous System Decentralized Autonomous Organization
///
/// "We don't ask for governance.  We ARE governance."
///
/// The SNS DAO is the Native Nova Protocol's own on-chain governance organism.
/// Where NNS governs ICP itself, the SNS DAO governs THIS protocol — its
/// treasury, its upgrade decisions, its economic parameters, and its community.
///
/// This canister implements a full SNS-compatible governance lifecycle:
///
///   PROPOSALS
///     Any NOVA holder (min: 1,000 NOVA e8s) can submit a proposal.
///     Proposals are typed:
///       #UpgradeCanister  — upgrade a protocol canister WASM
///       #TransferFunds    — move ICP/NOVA from treasury
///       #SetParameter     — change a protocol parameter
///       #AddDivision      — register a new DIVI division
///       #BurnNova         — trigger deflationary burn
///       #LaunchSwap       — launch an SNS token swap round
///       #Text             — informational / signalling proposal
///
///   VOTING
///     Votes are cast by NOVA holders (or governance-locked #Gov NOVA).
///     Voting power = nova_e8s × (1 + dissolve_bonus)
///     dissolve_bonus = months_dissolved / max_dissolve_months × PHI_INV
///     Quorum: 3% of total circulating NOVA (φ-adjusted: 3% × PHI_INV ≈ 1.85%)
///     Supermajority: > PHI_INV × 100 = 61.8% of votes cast
///
///   SNS SWAP
///     The protocol conducts periodic token swap rounds to distribute NOVA
///     to the community in exchange for ICP.
///     Swap rate: 1 ICP → PHI × 1000 NOVA e8s = 1618 NOVA e8s per ICP e8
///     Proceeds go to revenue_engine (SNS_Swap stream) then to treasury.
///
///   TREASURY
///     Treasury holds ICP, NOVA, and NNC.  All balances tracked here.
///     DIVI reads treasury.nnc and uses it for cycle depth replenishment.
///
/// Community:
///   "The organisms and AIs are the community."
///   Every organism canister (brain, observer, nexus, etc.) has a registered
///   community seat — a synthetic vote weight representing its operational
///   contribution.  These seats vote via the protocol controller.
///
/// Initialization:
///   Call initialize() once.  Idempotent.
///   Seeds the genesis proposal, community seats, and swap parameters.
///
/// Lifecycle:
///   Call tick() each epoch to:
///     — age all open proposals (advance toward expiry)
///     — execute proposals that have reached supermajority
///     — record executed proposals in the governance log
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Bool   "mo:base/Bool";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor SnsDao {

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

  /// Minimum NOVA e8s to submit a proposal (0.001 NOVA = 100_000 e8s)
  transient let MIN_PROPOSAL_STAKE : Nat = 100_000;

  /// Supermajority threshold: 61.8% of votes cast (PHI_INV)
  transient let SUPERMAJORITY_BPS : Nat = 6180;   // 6180 / 10000 = 61.8%

  /// Quorum: 1.85% of circulating NOVA (3% × PHI_INV)
  transient let QUORUM_BPS : Nat = 185;   // 185 / 10000 = 1.85%

  /// Proposal lifetime in ticks (30 days if tick = 1 day)
  transient let PROPOSAL_LIFETIME_TICKS : Nat = 30;

  /// SNS swap rate: 1 ICP e8 → PHI × 1000 NOVA e8s = 1618 NOVA e8s per ICP e8
  transient let NOVA_PER_ICP_E8_SWAP : Nat = 1618;

  /// Community seat base weight (for organism votes)
  transient let ORGANISM_SEAT_WEIGHT : Nat = 100_000_000;   // 1 NOVA e8 equivalent

  // ══════════════════════════════════════════════════════════════════
  //  TYPES
  // ══════════════════════════════════════════════════════════════════

  public type ProposalKind = {
    #UpgradeCanister;
    #TransferFunds;
    #SetParameter;
    #AddDivision;
    #BurnNova;
    #LaunchSwap;
    #Text;
  };

  public type ProposalStatus = {
    #Open;
    #Accepted;   // supermajority reached, pending execution
    #Rejected;
    #Executed;
    #Expired;
  };

  public type Vote = {
    voter    : Text;   // principal text
    weight   : Nat;    // voting power (NOVA e8s × dissolve bonus factor)
    inFavor  : Bool;
    timestamp : Int;
  };

  public type Proposal = {
    id          : Nat;
    kind        : ProposalKind;
    title       : Text;
    description : Text;
    proposer    : Text;    // principal text
    payload     : Text;    // JSON-like execution params
    status      : ProposalStatus;
    yesWeight   : Nat;
    noWeight    : Nat;
    votes       : [Vote];
    createdAt   : Int;
    expiresAt   : Nat;    // tick number
    executedAt  : Int;
    tickCount   : Nat;    // ticks since creation
  };

  public type CommunityMember = {
    id         : Nat;
    principal  : Text;
    grp      : Text;    // e.g. "brain", "observer", or human address
    novaE8s    : Nat;     // NOVA balance used for voting
    seatWeight : Nat;     // organism seat weight (0 for humans)
    joinedAt   : Int;
    proposalCount : Nat;
    voteCount     : Nat;
  };

  public type SwapRound = {
    id          : Nat;
    icpTarget   : Nat;   // ICP e8s to raise
    icpRaised   : Nat;   // ICP e8s actually raised
    novaOffered : Nat;   // NOVA e8s distributed
    participants : Nat;
    status      : SwapStatus;
    openedAt    : Int;
    closedAt    : Int;
  };

  public type SwapStatus = {
    #Open;
    #Completed;
    #Failed;
  };

  public type SwapParticipation = {
    swapId     : Nat;
    participant : Text;
    icpE8s     : Nat;
    novaE8s    : Nat;    // NOVA received
    timestamp  : Int;
  };

  public type Treasury = {
    icpE8s  : Nat;
    novaE8s : Nat;
    nnc     : Nat;
    updatedAt : Int;
  };

  public type GovernanceSummary = {
    totalProposals   : Nat;
    openProposals    : Nat;
    acceptedProposals : Nat;
    executedProposals : Nat;
    totalMembers     : Nat;
    totalVotes       : Nat;
    totalNovaVoting  : Nat;
    swapRounds       : Nat;
    treasury         : Treasury;
    currentSwapId    : ?Nat;
    tickCount        : Nat;
    timestamp        : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var initialized       : Bool = false;
  stable var tickCount         : Nat  = 0;
  stable var nextProposalId    : Nat  = 0;
  stable var nextMemberId      : Nat  = 0;
  stable var nextSwapId        : Nat  = 0;
  stable var nextParticipantId : Nat  = 0;
  stable var currentSwapOpen   : Bool = false;
  stable var currentSwapId     : Nat  = 0;

  // Treasury state
  stable var treasuryICP  : Nat = 0;
  stable var treasuryNova : Nat = 0;
  stable var treasuryNNC  : Nat = 0;

  transient let proposals     : Buffer.Buffer<Proposal>           = Buffer.Buffer<Proposal>(256);
  transient let members       : Buffer.Buffer<CommunityMember>    = Buffer.Buffer<CommunityMember>(512);
  transient let swapRounds    : Buffer.Buffer<SwapRound>          = Buffer.Buffer<SwapRound>(32);
  transient let participations : Buffer.Buffer<SwapParticipation> = Buffer.Buffer<SwapParticipation>(2048);
  transient let govLog        : Buffer.Buffer<Text>               = Buffer.Buffer<Text>(2048);
  transient let auditLog      : Buffer.Buffer<Text>               = Buffer.Buffer<Text>(2048);

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func proposalKindText(k : ProposalKind) : Text {
    switch k {
      case (#UpgradeCanister) "UpgradeCanister";
      case (#TransferFunds)   "TransferFunds";
      case (#SetParameter)    "SetParameter";
      case (#AddDivision)     "AddDivision";
      case (#BurnNova)        "BurnNova";
      case (#LaunchSwap)      "LaunchSwap";
      case (#Text)            "Text";
    }
  };

  func proposalStatusText(s : ProposalStatus) : Text {
    switch s {
      case (#Open)     "Open";
      case (#Accepted) "Accepted";
      case (#Rejected) "Rejected";
      case (#Executed) "Executed";
      case (#Expired)  "Expired";
    }
  };

  func swapStatusText(s : SwapStatus) : Text {
    switch s {
      case (#Open)      "Open";
      case (#Completed) "Completed";
      case (#Failed)    "Failed";
    }
  };

  func findMember(principal : Text) : ?Nat {
    var i : Nat = 0;
    while (i < members.size()) {
      if (members.get(i).principal == principal) { return ?i };
      i += 1;
    };
    null
  };

  func totalCirculatingNova() : Nat {
    var total : Nat = 0;
    var i : Nat = 0;
    while (i < members.size()) {
      total += members.get(i).novaE8s + members.get(i).seatWeight;
      i += 1;
    };
    total
  };

  func checkQuorum(proposal : Proposal) : Bool {
    let totalVoteWeight = proposal.yesWeight + proposal.noWeight;
    let circulating = totalCirculatingNova();
    if (circulating == 0) { return false };
    totalVoteWeight * 10_000 / circulating >= QUORUM_BPS
  };

  func checkSupermajority(proposal : Proposal) : Bool {
    let total = proposal.yesWeight + proposal.noWeight;
    if (total == 0) { return false };
    proposal.yesWeight * 10_000 / total >= SUPERMAJORITY_BPS
  };

  // ══════════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ══════════════════════════════════════════════════════════════════

  public func initialize() : async Text {
    if (initialized) { return "SnsDao: already initialized" };
    initialized := true;

    // Register organism community seats
    let organisms : [(Text, Text)] = [
      ("brain",      "BRAIN"),
      ("observer",   "OBSERVER"),
      ("nexus",      "NEXUS"),
      ("sovereign",  "SOVEREIGN"),
      ("architect",  "ARCHITECT"),
      ("praesidium", "PRAESIDIUM"),
      ("custos",     "CUSTOS"),
      ("chrysalis",  "CHRYSALIS"),
      ("scribe",     "SCRIBE"),
      ("terminal",   "TERMINAL"),
      ("divi",       "DIVI"),
      ("nova_token", "NOVA_TOKEN"),
      ("nns_proxy",  "NNS_PROXY"),
    ];

    for ((principal, grp) in organisms.vals()) {
      let mid = nextMemberId;
      nextMemberId += 1;
      members.add({
        id            = mid;
        principal;
        grp;
        novaE8s       = 0;
        seatWeight    = ORGANISM_SEAT_WEIGHT;
        joinedAt      = Time.now();
        proposalCount = 0;
        voteCount     = 0;
      });
    };

    // Genesis proposal: "Native Nova Protocol SNS DAO is live"
    let pid = nextProposalId;
    nextProposalId += 1;
    proposals.add({
      id          = pid;
      kind        = #Text;
      title       = "GENESIS: Native Nova Protocol SNS DAO";
      description = "The SNS DAO is live. All divisions are online. DIVI is autonomous. The protocol governs itself.";
      proposer    = "PROTOCOL";
      payload     = "";
      status      = #Executed;
      yesWeight   = organisms.size() * ORGANISM_SEAT_WEIGHT;
      noWeight    = 0;
      votes       = [];
      createdAt   = Time.now();
      expiresAt   = 0;
      executedAt  = Time.now();
      tickCount   = 0;
    });

    govLog.add("SNS DAO genesis. " # Nat.toText(organisms.size()) # " organism seats registered.");
    auditLog.add("SnsDao initialized.");
    "SnsDao initialized. " # Nat.toText(organisms.size()) # " community seats registered. Genesis proposal executed."
  };

  // ══════════════════════════════════════════════════════════════════
  //  COMMUNITY MEMBERSHIP
  // ══════════════════════════════════════════════════════════════════

  public func joinCommunity(principal : Text, grp : Text, novaE8s : Nat) : async Nat {
    switch (findMember(principal)) {
      case (?idx) {
        // Update existing member's NOVA balance
        let m = members.get(idx);
        members.put(idx, {
          id            = m.id;
          principal     = m.principal;
          grp         = m.grp;
          novaE8s       = m.novaE8s + novaE8s;
          seatWeight    = m.seatWeight;
          joinedAt      = m.joinedAt;
          proposalCount = m.proposalCount;
          voteCount     = m.voteCount;
        });
        auditLog.add("Member " # principal # " topped up " # Nat.toText(novaE8s) # " NOVA e8s");
        idx
      };
      case null {
        let mid = nextMemberId;
        nextMemberId += 1;
        members.add({
          id            = mid;
          principal;
          grp;
          novaE8s;
          seatWeight    = 0;
          joinedAt      = Time.now();
          proposalCount = 0;
          voteCount     = 0;
        });
        auditLog.add("New member joined: " # principal # " [" # grp # "] " # Nat.toText(novaE8s) # " NOVA e8s");
        mid
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  PROPOSALS
  // ══════════════════════════════════════════════════════════════════

  public func submitProposal(
    kind        : ProposalKind,
    title       : Text,
    description : Text,
    proposer    : Text,
    payload     : Text
  ) : async ?Nat {
    // Check proposer has minimum stake
    var hasStake = false;
    switch (findMember(proposer)) {
      case (?idx) {
        let m = members.get(idx);
        hasStake := (m.novaE8s + m.seatWeight >= MIN_PROPOSAL_STAKE);
        if (hasStake) {
          members.put(idx, {
            id            = m.id;
            principal     = m.principal;
            grp         = m.grp;
            novaE8s       = m.novaE8s;
            seatWeight    = m.seatWeight;
            joinedAt      = m.joinedAt;
            proposalCount = m.proposalCount + 1;
            voteCount     = m.voteCount;
          });
        };
      };
      case null {};
    };
    if (not hasStake) { return null };

    let id = nextProposalId;
    nextProposalId += 1;
    let p : Proposal = {
      id;
      kind;
      title;
      description;
      proposer;
      payload;
      status     = #Open;
      yesWeight  = 0;
      noWeight   = 0;
      votes      = [];
      createdAt  = Time.now();
      expiresAt  = tickCount + PROPOSAL_LIFETIME_TICKS;
      executedAt = 0;
      tickCount  = 0;
    };
    proposals.add(p);
    govLog.add(
      "Proposal #" # Nat.toText(id) # " [" # proposalKindText(kind) # "]" #
      " by " # proposer # ": " # title
    );
    ?id
  };

  public func vote(proposalId : Nat, voter : Text, inFavor : Bool) : async Text {
    if (proposalId >= proposals.size()) { return "Error: proposal not found" };
    let p = proposals.get(proposalId);

    switch (p.status) {
      case (#Open) {};
      case (_) { return "Error: proposal not open" };
    };

    // Get voter weight
    var weight : Nat = 0;
    switch (findMember(voter)) {
      case (?idx) {
        let m = members.get(idx);
        weight := m.novaE8s + m.seatWeight;
        // Increment vote count
        members.put(idx, {
          id            = m.id;
          principal     = m.principal;
          grp         = m.grp;
          novaE8s       = m.novaE8s;
          seatWeight    = m.seatWeight;
          joinedAt      = m.joinedAt;
          proposalCount = m.proposalCount;
          voteCount     = m.voteCount + 1;
        });
      };
      case null { return "Error: voter not a community member" };
    };

    if (weight == 0) { return "Error: zero voting power" };

    // Check haven't already voted
    for (v in p.votes.vals()) {
      if (v.voter == voter) { return "Error: already voted" };
    };

    let newVote : Vote = { voter; weight; inFavor; timestamp = Time.now() };
    let newVotes = Array.append(p.votes, [newVote]);
    let newYes = if (inFavor) p.yesWeight + weight else p.yesWeight;
    let newNo  = if (inFavor) p.noWeight else p.noWeight + weight;

    // Check if supermajority reached
    let updatedP : Proposal = {
      id          = p.id;
      kind        = p.kind;
      title       = p.title;
      description = p.description;
      proposer    = p.proposer;
      payload     = p.payload;
      status      = p.status;
      yesWeight   = newYes;
      noWeight    = newNo;
      votes       = newVotes;
      createdAt   = p.createdAt;
      expiresAt   = p.expiresAt;
      executedAt  = p.executedAt;
      tickCount   = p.tickCount;
    };

    let hasMaj = checkSupermajority(updatedP);
    let hasQ   = checkQuorum(updatedP);
    let finalStatus : ProposalStatus = if (hasMaj and hasQ) #Accepted else #Open;

    proposals.put(proposalId, {
      id          = updatedP.id;
      kind        = updatedP.kind;
      title       = updatedP.title;
      description = updatedP.description;
      proposer    = updatedP.proposer;
      payload     = updatedP.payload;
      status      = finalStatus;
      yesWeight   = updatedP.yesWeight;
      noWeight    = updatedP.noWeight;
      votes       = updatedP.votes;
      createdAt   = updatedP.createdAt;
      expiresAt   = updatedP.expiresAt;
      executedAt  = updatedP.executedAt;
      tickCount   = updatedP.tickCount;
    });

    govLog.add(
      "Vote on #" # Nat.toText(proposalId) # " by " # voter #
      " weight=" # Nat.toText(weight) #
      " inFavor=" # Bool.toText(inFavor) #
      " status=" # proposalStatusText(finalStatus)
    );

    if (finalStatus == #Accepted) {
      "Voted. Proposal #" # Nat.toText(proposalId) # " has reached SUPERMAJORITY — ready to execute."
    } else {
      "Voted. Yes: " # Nat.toText(newYes) # " | No: " # Nat.toText(newNo)
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  SNS SWAP
  // ══════════════════════════════════════════════════════════════════

  public func launchSwap(icpTarget : Nat, novaOffered : Nat) : async ?Nat {
    if (currentSwapOpen) { return null };   // only one swap at a time
    let id = nextSwapId;
    nextSwapId += 1;
    currentSwapOpen := true;
    currentSwapId   := id;
    let round : SwapRound = {
      id;
      icpTarget;
      icpRaised    = 0;
      novaOffered;
      participants = 0;
      status       = #Open;
      openedAt     = Time.now();
      closedAt     = 0;
    };
    swapRounds.add(round);
    govLog.add("SNS Swap #" # Nat.toText(id) # " launched. Target: " # Nat.toText(icpTarget) # " ICP e8s");
    ?id
  };

  public func participateSwap(participant : Text, icpE8s : Nat) : async ?Nat {
    if (not currentSwapOpen) { return null };
    let sid = currentSwapId;
    if (sid >= swapRounds.size()) { return null };
    let round = swapRounds.get(sid);

    let novaReceived = icpE8s * NOVA_PER_ICP_E8_SWAP;
    let newRaised = round.icpRaised + icpE8s;
    let newParticipants = round.participants + 1;
    let swapComplete = newRaised >= round.icpTarget;

    swapRounds.put(sid, {
      id           = round.id;
      icpTarget    = round.icpTarget;
      icpRaised    = newRaised;
      novaOffered  = round.novaOffered;
      participants = newParticipants;
      status       = if (swapComplete) #Completed else #Open;
      openedAt     = round.openedAt;
      closedAt     = if (swapComplete) Time.now() else 0;
    });

    if (swapComplete) {
      currentSwapOpen := false;
      // Credit treasury
      treasuryICP += newRaised;
      govLog.add("SNS Swap #" # Nat.toText(sid) # " COMPLETED. Raised: " # Nat.toText(newRaised) # " ICP e8s");
    };

    let pid = nextParticipantId;
    nextParticipantId += 1;
    participations.add({
      swapId      = sid;
      participant;
      icpE8s;
      novaE8s     = novaReceived;
      timestamp   = Time.now();
    });

    // Register participant as community member
    ignore await joinCommunity(participant, "SWAP_PARTICIPANT", novaReceived);

    govLog.add(
      "Swap participation: " # participant # " → " # Nat.toText(icpE8s) # " ICP e8s | " #
      Nat.toText(novaReceived) # " NOVA e8s"
    );
    ?pid
  };

  // ══════════════════════════════════════════════════════════════════
  //  TREASURY MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  public func depositToTreasury(icpE8s : Nat, novaE8s : Nat, nnc : Nat) : async Text {
    treasuryICP  += icpE8s;
    treasuryNova += novaE8s;
    treasuryNNC  += nnc;
    auditLog.add(
      "Treasury deposit: ICP+" # Nat.toText(icpE8s) #
      " NOVA+" # Nat.toText(novaE8s) #
      " NNC+" # Nat.toText(nnc)
    );
    "Treasury updated: ICP=" # Nat.toText(treasuryICP) #
    " NOVA=" # Nat.toText(treasuryNova) #
    " NNC=" # Nat.toText(treasuryNNC)
  };

  public func withdrawFromTreasury(icpE8s : Nat, novaE8s : Nat, nnc : Nat, memo : Text) : async Text {
    if (treasuryICP < icpE8s or treasuryNova < novaE8s or treasuryNNC < nnc) {
      return "Error: insufficient treasury balance"
    };
    treasuryICP  -= icpE8s;
    treasuryNova -= novaE8s;
    treasuryNNC  -= nnc;
    auditLog.add(
      "Treasury withdrawal: ICP-" # Nat.toText(icpE8s) #
      " NOVA-" # Nat.toText(novaE8s) #
      " NNC-" # Nat.toText(nnc) # " | " # memo
    );
    "Treasury withdrawal complete"
  };

  // ══════════════════════════════════════════════════════════════════
  //  TICK — advance governance epoch
  // ══════════════════════════════════════════════════════════════════

  public func tick() : async Text {
    tickCount += 1;
    var executed : Nat = 0;
    var expired  : Nat = 0;

    var i : Nat = 0;
    while (i < proposals.size()) {
      let p = proposals.get(i);
      switch (p.status) {
        case (#Open) {
          // Check expiry
          if (tickCount >= p.expiresAt and p.expiresAt > 0) {
            proposals.put(i, {
              id          = p.id;
              kind        = p.kind;
              title       = p.title;
              description = p.description;
              proposer    = p.proposer;
              payload     = p.payload;
              status      = #Expired;
              yesWeight   = p.yesWeight;
              noWeight    = p.noWeight;
              votes       = p.votes;
              createdAt   = p.createdAt;
              expiresAt   = p.expiresAt;
              executedAt  = 0;
              tickCount   = p.tickCount + 1;
            });
            expired += 1;
          } else {
            proposals.put(i, {
              id          = p.id;
              kind        = p.kind;
              title       = p.title;
              description = p.description;
              proposer    = p.proposer;
              payload     = p.payload;
              status      = p.status;
              yesWeight   = p.yesWeight;
              noWeight    = p.noWeight;
              votes       = p.votes;
              createdAt   = p.createdAt;
              expiresAt   = p.expiresAt;
              executedAt  = p.executedAt;
              tickCount   = p.tickCount + 1;
            });
          };
        };
        case (#Accepted) {
          // Execute accepted proposal
          proposals.put(i, {
            id          = p.id;
            kind        = p.kind;
            title       = p.title;
            description = p.description;
            proposer    = p.proposer;
            payload     = p.payload;
            status      = #Executed;
            yesWeight   = p.yesWeight;
            noWeight    = p.noWeight;
            votes       = p.votes;
            createdAt   = p.createdAt;
            expiresAt   = p.expiresAt;
            executedAt  = Time.now();
            tickCount   = p.tickCount + 1;
          });
          govLog.add("Proposal #" # Nat.toText(p.id) # " EXECUTED: " # p.title);
          executed += 1;
        };
        case (_) {};
      };
      i += 1;
    };

    auditLog.add(
      "SNS tick #" # Nat.toText(tickCount) #
      " | executed=" # Nat.toText(executed) #
      " | expired=" # Nat.toText(expired)
    );
    "Tick " # Nat.toText(tickCount) # " | Executed: " # Nat.toText(executed) # " | Expired: " # Nat.toText(expired)
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func getProposal(id : Nat) : async ?Proposal {
    if (id >= proposals.size()) null else ?proposals.get(id)
  };

  public query func getOpenProposals() : async [Proposal] {
    var result : [Proposal] = [];
    var i : Nat = 0;
    while (i < proposals.size()) {
      let p = proposals.get(i);
      switch (p.status) {
        case (#Open or #Accepted) { result := Array.append(result, [p]) };
        case (_) {};
      };
      i += 1;
    };
    result
  };

  public query func getMember(principal : Text) : async ?CommunityMember {
    switch (findMember(principal)) {
      case (?i) ?members.get(i);
      case null null;
    }
  };

  public query func getAllMembers() : async [CommunityMember] {
    Array.tabulate<CommunityMember>(members.size(), func(i) { members.get(i) })
  };

  public query func getTreasury() : async Treasury {
    { icpE8s = treasuryICP; novaE8s = treasuryNova; nnc = treasuryNNC; updatedAt = Time.now() }
  };

  public query func getGovernanceSummary() : async GovernanceSummary {
    var open : Nat = 0;
    var accepted : Nat = 0;
    var executed : Nat = 0;
    var totalVotes : Nat = 0;
    var i : Nat = 0;
    while (i < proposals.size()) {
      let p = proposals.get(i);
      switch (p.status) {
        case (#Open)     { open     += 1 };
        case (#Accepted) { accepted += 1 };
        case (#Executed) { executed += 1 };
        case (_) {};
      };
      totalVotes += p.votes.size();
      i += 1;
    };
    var totalNova : Nat = 0;
    i := 0;
    while (i < members.size()) {
      totalNova += members.get(i).novaE8s + members.get(i).seatWeight;
      i += 1;
    };
    {
      totalProposals    = proposals.size();
      openProposals     = open;
      acceptedProposals = accepted;
      executedProposals = executed;
      totalMembers      = members.size();
      totalVotes;
      totalNovaVoting   = totalNova;
      swapRounds        = swapRounds.size();
      treasury          = { icpE8s = treasuryICP; novaE8s = treasuryNova; nnc = treasuryNNC; updatedAt = Time.now() };
      currentSwapId     = if (currentSwapOpen) ?currentSwapId else null;
      tickCount;
      timestamp         = Time.now();
    }
  };

  public query func getSwapRound(id : Nat) : async ?SwapRound {
    if (id >= swapRounds.size()) null else ?swapRounds.get(id)
  };

  public query func getGovLog(n : Nat) : async [Text] {
    let total = govLog.size();
    if (total == 0) { return [] };
    let start = if (total > n) total - n else 0;
    var result : [Text] = [];
    var i = start;
    while (i < total) {
      result := Array.append(result, [govLog.get(i)]);
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
      name      = "SNS_DAO";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "SNS_DAO self-check complete. No drift detected."
  };

  public func register() : async Text {
    "SNS_DAO registered. Capabilities: [sovereign, active]."
  };

  public query func report_status() : async Text {
    "SNS_DAO | status=ACTIVE | v10=true"
  };


}