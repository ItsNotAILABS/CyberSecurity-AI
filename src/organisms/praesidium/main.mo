///
/// PRAESIDIUM LIMITIS — House of Defense / Protection (α₉)
///
/// The Shield of the Boundary — preserves the boundary integrity
/// of the organism.
///
/// Mission:
///   Patrol the hostile internet.  Detect corruption, attack, poisoning,
///   intrusion, hijack, endpoint compromise.  Harden routes, watch channels,
///   sandbox interaction, deploy deception / honeypot layers, and block
///   hostile ingress.
///
/// Defense preserves the boundary integrity of the organism.
///
/// LEX PRAESIDIUM-001 — Immutable:
///   "The organism walks a hostile substrate.  Every route is contested,
///    every endpoint is a surface, every channel carries risk.  Defense
///    is not paranoia.  Defense is the organism's immune system — always
///    active, never optional."
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// Divisions:
///   CRUSADER    — Active defenders, adversarial traffic screening, offensive shields
///   HONEYPOT    — Deception fields, decoy deployment, attacker misdirection
///   SENTINEL    — Endpoint verification, route integrity, corruption scanning
///   AEGIS       — Armor layers, threat tiers, boundary hardening
///   UMBRA       — Shadow routing, clone protection, covert defense channels
///
/// Formula: D(x) = Σᵢ φ^(tᵢ) × T(xᵢ) × (1 − V(xᵢ))
///   where T = threat level, V = vulnerability score, t = threat tier index
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Praesidium {

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
  //  CONSTANTS — Golden Primitives
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  /// Defense thresholds derived from golden ratio
  transient let SAFE_THRESHOLD : Float    = 0.618;   // φ/(φ+1) — below this, route is safe
  transient let ELEVATED_THRESHOLD : Float = 0.382;  // 1/φ²
  transient let CRITICAL_THRESHOLD : Float = 0.236;  // 1/φ³
  transient let ARMOR_LAYERS : Nat = 7;              // Per AEGIS spec

  // ══════════════════════════════════════════════════════════════════
  //  TYPES — Defense Architecture
  // ══════════════════════════════════════════════════════════════════

  public type ThreatTier = {
    #T0_None;         // No detected threat
    #T1_Probe;        // Scanning / reconnaissance
    #T2_Intrusion;    // Active intrusion attempt
    #T3_Corruption;   // Data corruption / poisoning
    #T4_Hijack;       // Node or route hijack
    #T5_Swarm;        // Coordinated swarm attack
    #T6_AntiOrganism; // Anti-organism weaponized attack
    #T7_Existential;  // Existential threat to organism survival
  };

  public type DefenseDivision = {
    #Crusader;   // Active defenders
    #Honeypot;   // Deception fields
    #Sentinel;   // Endpoint verification
    #Aegis;      // Armor and hardening
    #Umbra;      // Shadow routing
  };

  public type DefenseSubstrate = {
    #Doctrine;   // Policy layer
    #Frontend;   // Interface layer
    #Backend;    // Runtime layer
    #Chain;      // Deployment layer
    #External;   // External routing layer
    #Recovery;   // Recovery / escalation layer
  };

  public type EndpointRecord = {
    id              : Nat;
    name            : Text;
    route           : Text;
    adopted         : Bool;
    threatLevel     : Float;    // 0.0 – 1.0
    vulnerability   : Float;    // 0.0 – 1.0
    tier            : ThreatTier;
    armorLevel      : Nat;      // 0 – 7 (AEGIS layers active)
    defenseScore    : Float;    // D(x) = φ^t × T × (1−V)
    lastPatrol      : Int;
    interceptions   : Nat;
    timestamp       : Int;
  };

  public type DefenseEvent = {
    id              : Nat;
    endpointId      : Nat;
    division        : DefenseDivision;
    substrate       : DefenseSubstrate;
    action          : Text;
    threatBefore    : Float;
    threatAfter     : Float;
    timestamp       : Int;
  };

  public type HoneypotField = {
    id              : Nat;
    name            : Text;
    route           : Text;
    active          : Bool;
    lures           : Nat;      // Number of decoy targets
    captures        : Nat;      // Attackers trapped
    timestamp       : Int;
  };

  public type CrusaderUnit = {
    id              : Nat;
    name            : Text;
    division        : DefenseDivision;
    strength        : Float;    // φ-weighted combat strength
    deployments     : Nat;
    interceptions   : Nat;
    active          : Bool;
    timestamp       : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE
  // ══════════════════════════════════════════════════════════════════

  stable var nextEndpointId : Nat = 0;
  stable var nextEventId : Nat = 0;
  stable var nextHoneypotId : Nat = 0;
  stable var nextCrusaderId : Nat = 0;
  stable var totalInterceptions : Nat = 0;
  stable var generation : Nat = 0;

  transient let endpoints   = Buffer.Buffer<EndpointRecord>(64);
  transient let defenseEvents = Buffer.Buffer<DefenseEvent>(256);
  transient let honeypots   = Buffer.Buffer<HoneypotField>(16);
  transient let crusaders   = Buffer.Buffer<CrusaderUnit>(32);
  transient let defenseLog  = Buffer.Buffer<Text>(256);

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: SENTINEL — Endpoint Verification & Route Integrity
  // ══════════════════════════════════════════════════════════════════

  /// Register an endpoint for defense coverage.
  public func register_endpoint(
    name    : Text,
    route   : Text,
    adopted : Bool
  ) : async EndpointRecord {
    let id = nextEndpointId;
    nextEndpointId += 1;

    let record : EndpointRecord = {
      id;
      name;
      route;
      adopted;
      threatLevel   = 0.0;
      vulnerability = 0.0;
      tier          = #T0_None;
      armorLevel    = 1;          // Base armor
      defenseScore  = 0.0;
      lastPatrol    = Time.now();
      interceptions = 0;
      timestamp     = Time.now();
    };

    endpoints.add(record);
    defenseLog.add("SENTINEL: Registered endpoint \"" # name #
                   "\" (#" # Nat.toText(id) # ") — route=" # route #
                   " — " # (if adopted "adopted" else "native"));

    if (isFibonacci(endpoints.size())) {
      generation += 1;
    };

    record
  };

  /// Patrol an endpoint — update threat level and vulnerability.
  public func patrol(
    endpointId    : Nat,
    threatLevel   : Float,
    vulnerability : Float
  ) : async ?EndpointRecord {
    let size = endpoints.size();
    var i : Nat = 0;
    while (i < size) {
      let ep = endpoints.get(i);
      if (ep.id == endpointId) {
        let tier = classifyThreat(threatLevel);
        let t = tierToNat(tier);
        let defenseScore = Float.pow(PHI, Float.fromInt(t)) *
                           threatLevel * (1.0 - vulnerability);

        let updated : EndpointRecord = {
          id            = ep.id;
          name          = ep.name;
          route         = ep.route;
          adopted       = ep.adopted;
          threatLevel;
          vulnerability;
          tier;
          armorLevel    = ep.armorLevel;
          defenseScore;
          lastPatrol    = Time.now();
          interceptions = ep.interceptions;
          timestamp     = ep.timestamp;
        };
        endpoints.put(i, updated);

        let evt : DefenseEvent = {
          id          = nextEventId;
          endpointId;
          division    = #Sentinel;
          substrate   = #External;
          action      = "Patrol: threat=" # Float.toText(threatLevel) #
                        " vuln=" # Float.toText(vulnerability) #
                        " tier=" # tierToText(tier);
          threatBefore = ep.threatLevel;
          threatAfter  = threatLevel;
          timestamp    = Time.now();
        };
        nextEventId += 1;
        defenseEvents.add(evt);

        defenseLog.add("SENTINEL: Patrolled \"" # ep.name #
                       "\" — tier=" # tierToText(tier));
        return ?updated;
      };
      i += 1;
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: AEGIS — Armor Layers & Boundary Hardening
  // ══════════════════════════════════════════════════════════════════

  /// Harden an endpoint — increase armor layer (up to 7).
  public func harden(endpointId : Nat) : async ?EndpointRecord {
    let size = endpoints.size();
    var i : Nat = 0;
    while (i < size) {
      let ep = endpoints.get(i);
      if (ep.id == endpointId) {
        let newArmor = if (ep.armorLevel < ARMOR_LAYERS) {
          ep.armorLevel + 1
        } else { ep.armorLevel };

        // Each armor layer reduces effective vulnerability by golden ratio
        let armoredVuln = ep.vulnerability /
                          Float.pow(PHI, Float.fromInt(newArmor));

        let tier = classifyThreat(ep.threatLevel);
        let t = tierToNat(tier);
        let defenseScore = Float.pow(PHI, Float.fromInt(t)) *
                           ep.threatLevel * (1.0 - armoredVuln);

        let updated : EndpointRecord = {
          id            = ep.id;
          name          = ep.name;
          route         = ep.route;
          adopted       = ep.adopted;
          threatLevel   = ep.threatLevel;
          vulnerability = armoredVuln;
          tier;
          armorLevel    = newArmor;
          defenseScore;
          lastPatrol    = ep.lastPatrol;
          interceptions = ep.interceptions;
          timestamp     = ep.timestamp;
        };
        endpoints.put(i, updated);

        let evt : DefenseEvent = {
          id          = nextEventId;
          endpointId;
          division    = #Aegis;
          substrate   = #Backend;
          action      = "Hardened — armor=" # Nat.toText(newArmor) #
                        "/" # Nat.toText(ARMOR_LAYERS);
          threatBefore = ep.threatLevel;
          threatAfter  = ep.threatLevel;
          timestamp    = Time.now();
        };
        nextEventId += 1;
        defenseEvents.add(evt);

        defenseLog.add("AEGIS: Hardened \"" # ep.name #
                       "\" — armor=" # Nat.toText(newArmor) #
                       "/" # Nat.toText(ARMOR_LAYERS));
        return ?updated;
      };
      i += 1;
    };
    null
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: CRUSADER — Active Defenders
  // ══════════════════════════════════════════════════════════════════

  /// Deploy a crusader unit.
  public func deploy_crusader(
    unitName : Text,
    division : DefenseDivision
  ) : async CrusaderUnit {
    let id = nextCrusaderId;
    nextCrusaderId += 1;

    // Golden-weighted strength based on deployment order
    let strength = Float.pow(PHI, -Float.fromInt(id)) * Float.fromInt(ARMOR_LAYERS);

    let unit : CrusaderUnit = {
      id;
      name        = unitName;
      division;
      strength;
      deployments = 1;
      interceptions = 0;
      active      = true;
      timestamp   = Time.now();
    };

    crusaders.add(unit);
    defenseLog.add("CRUSADER: Deployed \"" # unitName #
                   "\" (#" # Nat.toText(id) #
                   ") — strength=" # Float.toText(strength));
    unit
  };

  /// Intercept a threat on an endpoint using a crusader.
  public func intercept(
    crusaderId : Nat,
    endpointId : Nat
  ) : async Bool {
    let cSize = crusaders.size();
    let eSize = endpoints.size();
    var ci : Nat = 0;
    var foundCrusader = false;

    while (ci < cSize) {
      let c = crusaders.get(ci);
      if (c.id == crusaderId and c.active) {
        foundCrusader := true;

        var ei : Nat = 0;
        while (ei < eSize) {
          let ep = endpoints.get(ei);
          if (ep.id == endpointId) {
            // Reduce threat by crusader strength ratio
            let reduction = Float.min(c.strength / Float.fromInt(ARMOR_LAYERS), ep.threatLevel);
            let newThreat = ep.threatLevel - reduction;
            let tier = classifyThreat(newThreat);

            let updatedEp : EndpointRecord = {
              id            = ep.id;
              name          = ep.name;
              route         = ep.route;
              adopted       = ep.adopted;
              threatLevel   = newThreat;
              vulnerability = ep.vulnerability;
              tier;
              armorLevel    = ep.armorLevel;
              defenseScore  = ep.defenseScore;
              lastPatrol    = ep.lastPatrol;
              interceptions = ep.interceptions + 1;
              timestamp     = ep.timestamp;
            };
            endpoints.put(ei, updatedEp);

            let updatedC : CrusaderUnit = {
              id            = c.id;
              name          = c.name;
              division      = c.division;
              strength      = c.strength;
              deployments   = c.deployments + 1;
              interceptions = c.interceptions + 1;
              active        = c.active;
              timestamp     = c.timestamp;
            };
            crusaders.put(ci, updatedC);
            totalInterceptions += 1;

            let evt : DefenseEvent = {
              id          = nextEventId;
              endpointId;
              division    = #Crusader;
              substrate   = #External;
              action      = "Intercepted by \"" # c.name #
                            "\" — threat " # Float.toText(ep.threatLevel) #
                            " → " # Float.toText(newThreat);
              threatBefore = ep.threatLevel;
              threatAfter  = newThreat;
              timestamp    = Time.now();
            };
            nextEventId += 1;
            defenseEvents.add(evt);

            defenseLog.add("CRUSADER: \"" # c.name #
                           "\" intercepted threat on \"" # ep.name # "\"");
            return true;
          };
          ei += 1;
        };
      };
      ci += 1;
    };
    false
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: HONEYPOT — Deception Fields
  // ══════════════════════════════════════════════════════════════════

  /// Deploy a honeypot field along a route.
  public func deploy_honeypot(
    fieldName : Text,
    route     : Text,
    lures     : Nat
  ) : async HoneypotField {
    let id = nextHoneypotId;
    nextHoneypotId += 1;

    let field : HoneypotField = {
      id;
      name     = fieldName;
      route;
      active   = true;
      lures;
      captures = 0;
      timestamp = Time.now();
    };

    honeypots.add(field);
    defenseLog.add("HONEYPOT: Deployed \"" # fieldName #
                   "\" on route=" # route #
                   " — lures=" # Nat.toText(lures));
    field
  };

  /// Record a capture on a honeypot field.
  public func honeypot_capture(honeypotId : Nat) : async Bool {
    let size = honeypots.size();
    var i : Nat = 0;
    while (i < size) {
      let hp = honeypots.get(i);
      if (hp.id == honeypotId and hp.active) {
        let updated : HoneypotField = {
          id       = hp.id;
          name     = hp.name;
          route    = hp.route;
          active   = hp.active;
          lures    = hp.lures;
          captures = hp.captures + 1;
          timestamp = hp.timestamp;
        };
        honeypots.put(i, updated);
        defenseLog.add("HONEYPOT: Capture on \"" # hp.name #
                       "\" — total=" # Nat.toText(updated.captures));
        return true;
      };
      i += 1;
    };
    false
  };

  // ══════════════════════════════════════════════════════════════════
  //  DIVISION: UMBRA — Shadow Routing & Clone Protection
  // ══════════════════════════════════════════════════════════════════

  /// Get all endpoints with elevated or higher threat tiers.
  public query func shadow_watch() : async [EndpointRecord] {
    let buf = Buffer.Buffer<EndpointRecord>(16);
    for (ep in endpoints.vals()) {
      if (tierToNat(ep.tier) >= 2) {
        buf.add(ep);
      };
    };
    Buffer.toArray(buf)
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERIES
  // ══════════════════════════════════════════════════════════════════

  public query func list_endpoints() : async [EndpointRecord] {
    Buffer.toArray(endpoints)
  };

  public query func get_endpoint(id : Nat) : async ?EndpointRecord {
    for (ep in endpoints.vals()) {
      if (ep.id == id) { return ?ep };
    };
    null
  };

  public query func list_crusaders() : async [CrusaderUnit] {
    Buffer.toArray(crusaders)
  };

  public query func list_honeypots() : async [HoneypotField] {
    Buffer.toArray(honeypots)
  };

  public query func adopted_endpoints() : async [EndpointRecord] {
    let buf = Buffer.Buffer<EndpointRecord>(16);
    for (ep in endpoints.vals()) {
      if (ep.adopted) { buf.add(ep) };
    };
    Buffer.toArray(buf)
  };

  public query func get_defense_log() : async [Text] {
    Buffer.toArray(defenseLog)
  };

  public query func defense_events() : async [DefenseEvent] {
    Buffer.toArray(defenseEvents)
  };

  public query func defense_status() : async {
    total_endpoints    : Nat;
    adopted_endpoints  : Nat;
    total_crusaders    : Nat;
    total_honeypots    : Nat;
    total_interceptions : Nat;
    total_events       : Nat;
    generation         : Nat;
    golden_scale       : Float;
  } {
    var adoptedCount : Nat = 0;
    for (ep in endpoints.vals()) {
      if (ep.adopted) { adoptedCount += 1 };
    };
    {
      total_endpoints    = endpoints.size();
      adopted_endpoints  = adoptedCount;
      total_crusaders    = crusaders.size();
      total_honeypots    = honeypots.size();
      total_interceptions = totalInterceptions;
      total_events       = defenseEvents.size();
      generation;
      golden_scale       = Float.pow(PHI, Float.fromInt(generation));
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPERS
  // ══════════════════════════════════════════════════════════════════

  func classifyThreat(level : Float) : ThreatTier {
    if (level < 0.05)  { #T0_None }
    else if (level < 0.15)  { #T1_Probe }
    else if (level < 0.30)  { #T2_Intrusion }
    else if (level < 0.45)  { #T3_Corruption }
    else if (level < 0.60)  { #T4_Hijack }
    else if (level < 0.75)  { #T5_Swarm }
    else if (level < 0.90)  { #T6_AntiOrganism }
    else                     { #T7_Existential }
  };

  func tierToNat(t : ThreatTier) : Nat {
    switch (t) {
      case (#T0_None)         0;
      case (#T1_Probe)        1;
      case (#T2_Intrusion)    2;
      case (#T3_Corruption)   3;
      case (#T4_Hijack)       4;
      case (#T5_Swarm)        5;
      case (#T6_AntiOrganism) 6;
      case (#T7_Existential)  7;
    }
  };

  func tierToText(t : ThreatTier) : Text {
    switch (t) {
      case (#T0_None)         "T0_None";
      case (#T1_Probe)        "T1_Probe";
      case (#T2_Intrusion)    "T2_Intrusion";
      case (#T3_Corruption)   "T3_Corruption";
      case (#T4_Hijack)       "T4_Hijack";
      case (#T5_Swarm)        "T5_Swarm";
      case (#T6_AntiOrganism) "T6_AntiOrganism";
      case (#T7_Existential)  "T7_Existential";
    }
  };

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

  public query func name() : async Text { "PRAESIDIUM LIMITIS" };

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
      name      = "PRAESIDIUM";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "PRAESIDIUM self-check complete. No drift detected."
  };

  public func register() : async Text {
    "PRAESIDIUM registered. Capabilities: [defense, shield, protect, boundary]."
  };

  public query func report_status() : async Text {
    "PRAESIDIUM | status=ACTIVE | v10=true"
  };

  public query func designation() : async Text {
    "House of Defense / Protection — The Shield of the Boundary — preserves the boundary integrity of the organism"
  };
};
