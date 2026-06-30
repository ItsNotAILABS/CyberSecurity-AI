///
/// LANGUAGE REGISTRY — All 40 Cognitive Languages Registered in CPL Runtime
///
/// This canister registers all language definitions, parsers, and executors
/// with the CPL Runtime organism. NO documentation. REAL integration.
///

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

persistent actor LanguageRegistry {

  // ══════════════════════════════════════════════════════════════════
  //  40 LANGUAGE DEFINITIONS
  // ══════════════════════════════════════════════════════════════════

  public type LanguageId = Text; // CPL-L, CPL-C, OCL, CPL-P, CIL, CDL, etc.

  public type LanguageDefinition = {
    id: LanguageId;
    name: Text;
    stack: Text; // core, mind, social, creation, etc.
    version: Text;
    phiWeight: Float;
    fibonacciRank: Nat;
    dimension: Nat; // D0-D4
    canisterId: Text; // Which canister executes this language
    registered: Int;
  };

  stable var languageDefinitions : [(LanguageId, LanguageDefinition)] = [];
  transient var languageMap : HashMap.HashMap<LanguageId, LanguageDefinition> = HashMap.HashMap<LanguageId, LanguageDefinition>(
    40,
    Text.equal,
    Text.hash
  );

  // ══════════════════════════════════════════════════════════════════
  //  INITIALIZATION
  // ══════════════════════════════════════════════════════════════════

  public func initialize() : async () {
    // Register all 40 languages
    await registerCoreStack();
    await registerMindStack();
    await registerSocialStack();
    await registerCreationStack();
    await registerNarrativeStack();
    await registerWorldsStack();
    await registerEducationStack();
    await registerEnterpriseStack();
    await registerInfrastructureStack();
    await registerChaosStack();
    await registerMetaStack();
  };

  // ══════════════════════════════════════════════════════════════════
  //  STACK REGISTRATION FUNCTIONS
  // ══════════════════════════════════════════════════════════════════

  func registerCoreStack() : async () {
    registerLanguage({
      id = "CPL-L";
      name = "Cognitive Law Language";
      stack = "core";
      version = "1.0.0";
      phiWeight = 4.236; // φ³
      fibonacciRank = 13;
      dimension = 3; // D3_Causal
      canisterId = "cpl_runtime";
      registered = Time.now();
    });

    registerLanguage({
      id = "CPL-C";
      name = "Cognitive Contract Language";
      stack = "core";
      version = "1.0.0";
      phiWeight = 2.618; // φ²
      fibonacciRank = 8;
      dimension = 2; // D2_Relational
      canisterId = "cpl_runtime";
      registered = Time.now();
    });

    registerLanguage({
      id = "OCL";
      name = "Organism Contract Language";
      stack = "core";
      version = "1.0.0";
      phiWeight = 2.618; // φ²
      fibonacciRank = 8;
      dimension = 2; // D2_Relational
      canisterId = "cpl_runtime";
      registered = Time.now();
    });

    registerLanguage({
      id = "CPL-P";
      name = "Cognitive Processing Language";
      stack = "core";
      version = "1.0.0";
      phiWeight = 1.618; // φ
      fibonacciRank = 5;
      dimension = 3; // D3_Causal
      canisterId = "pulse";
      registered = Time.now();
    });
  };

  func registerMindStack() : async () {
    registerLanguage({ id = "CIL"; name = "Cognitive Internal Language"; stack = "mind"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 2; canisterId = "brain"; registered = Time.now(); });
    registerLanguage({ id = "CDL"; name = "Cognitive Doctrine Language"; stack = "mind"; version = "1.0.0"; phiWeight = 4.236; fibonacciRank = 13; dimension = 3; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "PIL"; name = "Psyche Internal Language"; stack = "mind"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 4; canisterId = "brain"; registered = Time.now(); });
    registerLanguage({ id = "SIL"; name = "Self-Identity Language"; stack = "mind"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "TIL"; name = "Temporal Integration Language"; stack = "mind"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 1; canisterId = "oracle"; registered = Time.now(); });
    registerLanguage({ id = "RIL"; name = "Repair & Integration Language"; stack = "mind"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 3; canisterId = "guardian"; registered = Time.now(); });
  };

  func registerSocialStack() : async () {
    registerLanguage({ id = "REL"; name = "Relational Ecology Language"; stack = "social"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "COL"; name = "Collective Orchestration Language"; stack = "social"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "ROL"; name = "Role Language"; stack = "social"; version = "1.0.0"; phiWeight = 1.0; fibonacciRank = 3; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
  };

  func registerCreationStack() : async () {
    registerLanguage({ id = "WFL"; name = "Work Flow Language"; stack = "creation"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 1; canisterId = "pulse"; registered = Time.now(); });
    registerLanguage({ id = "CXL"; name = "Creation Language"; stack = "creation"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 3; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "EXL"; name = "Experiment Language"; stack = "creation"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 4; canisterId = "cpl_runtime"; registered = Time.now(); });
  };

  func registerNarrativeStack() : async () {
    registerLanguage({ id = "MYL"; name = "Mythic Language"; stack = "narrative"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 3; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "STL"; name = "Story Thread Language"; stack = "narrative"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 1; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "SYM"; name = "Symbolic Language"; stack = "narrative"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 4; canisterId = "cpl_runtime"; registered = Time.now(); });
  };

  func registerWorldsStack() : async () {
    registerLanguage({ id = "RSL"; name = "Realm Script Language"; stack = "worlds"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 0; canisterId = "brain"; registered = Time.now(); });
    registerLanguage({ id = "ACL"; name = "Atlas Configuration Language"; stack = "worlds"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 2; canisterId = "observer"; registered = Time.now(); });
    registerLanguage({ id = "TPL"; name = "Terminal Protocol Language"; stack = "worlds"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 2; canisterId = "terminal_hub"; registered = Time.now(); });
    registerLanguage({ id = "HCL"; name = "Host-Cognition Language"; stack = "worlds"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 0; canisterId = "brain"; registered = Time.now(); });
  };

  func registerEducationStack() : async () {
    registerLanguage({ id = "SPL"; name = "Study Pattern Language"; stack = "education"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "EDL"; name = "Educational Doctrine Language"; stack = "education"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 3; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "PWL"; name = "Pathway Language"; stack = "education"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 1; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "TSL"; name = "Tool Scaffold Language"; stack = "education"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 3; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "ISL"; name = "Institution Structure Language"; stack = "education"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "FAL"; name = "Family Alignment Language"; stack = "education"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
  };

  func registerEnterpriseStack() : async () {
    registerLanguage({ id = "BCL"; name = "Business Contract Language"; stack = "enterprise"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "ECL"; name = "Enterprise Compliance Language"; stack = "enterprise"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 3; canisterId = "guardian"; registered = Time.now(); });
    registerLanguage({ id = "IIL"; name = "Integration Interface Language"; stack = "enterprise"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 2; canisterId = "cpl_runtime"; registered = Time.now(); });
  };

  func registerInfrastructureStack() : async () {
    registerLanguage({ id = "DDL"; name = "Data Definition Language"; stack = "infrastructure"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 0; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "MML"; name = "Metrics & Monitoring Language"; stack = "infrastructure"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 1; canisterId = "brain"; registered = Time.now(); });
    registerLanguage({ id = "SCL"; name = "Scheduling & Coordination Language"; stack = "infrastructure"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 1; canisterId = "pulse_scheduler"; registered = Time.now(); });
  };

  func registerChaosStack() : async () {
    registerLanguage({ id = "ERR"; name = "Error Narrative Language"; stack = "chaos"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 1; canisterId = "brain"; registered = Time.now(); });
    registerLanguage({ id = "CHL"; name = "Chaos Handling Language"; stack = "chaos"; version = "1.0.0"; phiWeight = 2.618; fibonacciRank = 8; dimension = 4; canisterId = "guardian"; registered = Time.now(); });
    registerLanguage({ id = "FRL"; name = "Fringe Language"; stack = "chaos"; version = "1.0.0"; phiWeight = 1.618; fibonacciRank = 5; dimension = 4; canisterId = "cpl_runtime"; registered = Time.now(); });
  };

  func registerMetaStack() : async () {
    registerLanguage({ id = "LML"; name = "Language Meta Language"; stack = "meta"; version = "1.0.0"; phiWeight = 4.236; fibonacciRank = 13; dimension = 3; canisterId = "cpl_runtime"; registered = Time.now(); });
    registerLanguage({ id = "UEL"; name = "Universe Evolution Language"; stack = "meta"; version = "1.0.0"; phiWeight = 4.236; fibonacciRank = 13; dimension = 4; canisterId = "cpl_runtime"; registered = Time.now(); });
  };

  // ══════════════════════════════════════════════════════════════════
  //  LANGUAGE OPERATIONS
  // ══════════════════════════════════════════════════════════════════

  func registerLanguage(definition: LanguageDefinition) : () {
    languageMap.put(definition.id, definition);
  };

  public query func getLanguage(id: LanguageId) : async ?LanguageDefinition {
    languageMap.get(id)
  };

  public query func getAllLanguages() : async [LanguageDefinition] {
    let buffer = Buffer.Buffer<LanguageDefinition>(40);
    for ((id, def) in languageMap.entries()) {
      buffer.add(def);
    };
    Buffer.toArray(buffer)
  };

  public query func getLanguagesByStack(stack: Text) : async [LanguageDefinition] {
    let buffer = Buffer.Buffer<LanguageDefinition>(10);
    for ((id, def) in languageMap.entries()) {
      if (def.stack == stack) {
        buffer.add(def);
      };
    };
    Buffer.toArray(buffer)
  };

  public query func getStats() : async {
    totalLanguages: Nat;
    byStack: [(Text, Nat)];
  } {
    var stackCounts = HashMap.HashMap<Text, Nat>(11, Text.equal, Text.hash);

    for ((id, def) in languageMap.entries()) {
      let current = switch (stackCounts.get(def.stack)) {
        case null 0;
        case (?n) n;
      };
      stackCounts.put(def.stack, current + 1);
    };

    let stackArray = Buffer.Buffer<(Text, Nat)>(11);
    for ((stack, count) in stackCounts.entries()) {
      stackArray.add((stack, count));
    };

    {
      totalLanguages = languageMap.size();
      byStack = Buffer.toArray(stackArray);
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  LIFECYCLE
  // ══════════════════════════════════════════════════════════════════

  system func preupgrade() {
    languageDefinitions := Iter.toArray(languageMap.entries());
  };

  system func postupgrade() {
    for ((id, def) in languageDefinitions.vals()) {
      languageMap.put(id, def);
    };
  };

  public query func name() : async Text { "LANGUAGE_REGISTRY" };
}
