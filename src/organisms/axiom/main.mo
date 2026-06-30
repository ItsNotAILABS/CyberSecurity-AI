///
/// AXIOM — Foundational Truth Verification Organism
///
/// "From first principles, all truth flows. AXIOM guards the
///  logical foundations upon which all reasoning rests."
///
/// AXIOM implements formal logic and truth verification using
/// classical and intuitionistic logic systems. It validates
/// claims against foundational axioms and maintains logical
/// consistency across the organism mesh.
///
/// Sub-models hosted:
///   LOGOS    — Logical proposition and proof management
///   VERITAS  — Truth verification and consistency checking
///
/// Mathematical Foundation:
///   - Modus ponens: (P → Q) ∧ P ⊢ Q
///   - Law of non-contradiction: ¬(P ∧ ¬P)
///   - Law of excluded middle: P ∨ ¬P
///   - Gödel numbering for self-reference
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter   "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Hash   "mo:base/Hash";

persistent actor Axiom {

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

  // ── Sacred Constants ───────────────────────────────────────────────

  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI_INVERSE : Float = 0.6180339887498948482;

  // ── Types ──────────────────────────────────────────────────────────

  public type TruthValue = {
    #True;
    #False;
    #Unknown;
    #Undecidable;
  };

  public type PropositionType = {
    #Atomic;        // Basic proposition
    #Negation;      // ¬P
    #Conjunction;   // P ∧ Q
    #Disjunction;   // P ∨ Q
    #Implication;   // P → Q
    #Biconditional; // P ↔ Q
    #Universal;     // ∀x P(x)
    #Existential;   // ∃x P(x)
  };

  public type InferenceRule = {
    #ModusPonens;       // (P → Q) ∧ P ⊢ Q
    #ModusTollens;      // (P → Q) ∧ ¬Q ⊢ ¬P
    #HypotheticalSyllogism;  // (P → Q) ∧ (Q → R) ⊢ (P → R)
    #DisjunctiveSyllogism;   // (P ∨ Q) ∧ ¬P ⊢ Q
    #Conjunction;       // P, Q ⊢ P ∧ Q
    #Simplification;    // P ∧ Q ⊢ P
    #Addition;          // P ⊢ P ∨ Q
    #DoubleNegation;    // ¬¬P ⊢ P
    #DeMorgan;          // ¬(P ∧ Q) ⊢ ¬P ∨ ¬Q
    #Contraposition;    // P → Q ⊢ ¬Q → ¬P
  };

  /// A logical proposition
  public type Proposition = {
    id          : Nat;
    statement   : Text;
    propType    : PropositionType;
    truthValue  : TruthValue;
    operands    : [Nat];      // IDs of sub-propositions
    godelNum    : Nat;        // Gödel number for reference
    confidence  : Float;      // Confidence in truth value (0.0-1.0)
    timestamp   : Int;
    active      : Bool;
  };

  /// An axiom (self-evident truth)
  public type AxiomRecord = {
    id          : Nat;
    name        : Text;
    statement   : Text;
    category    : AxiomCategory;
    propId      : Nat;        // Corresponding proposition ID
    foundational: Bool;       // Cannot be derived from others
    timestamp   : Int;
  };

  public type AxiomCategory = {
    #Logical;       // Laws of logic
    #Mathematical;  // Mathematical axioms
    #Ontological;   // Existence axioms
    #Epistemic;     // Knowledge axioms
    #Ethical;       // Value axioms
    #System;        // System-specific axioms
  };

  /// A proof step
  public type ProofStep = {
    stepNum     : Nat;
    propId      : Nat;        // Proposition being established
    rule        : InferenceRule;
    premises    : [Nat];      // Step numbers of premises used
    justification: Text;
  };

  /// A complete proof
  public type Proof = {
    id          : Nat;
    theorem     : Nat;        // Proposition ID being proved
    steps       : [ProofStep];
    valid       : Bool;
    complete    : Bool;
    timestamp   : Int;
  };

  /// Consistency check result
  public type ConsistencyResult = {
    consistent  : Bool;
    conflicts   : [{ prop1: Nat; prop2: Nat; description: Text }];
    confidence  : Float;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextPropId   : Nat = 0;
  stable var nextAxiomId  : Nat = 0;
  stable var nextProofId  : Nat = 0;
  stable var godelCounter : Nat = 1;
  stable var logicEpoch   : Nat = 0;

  transient let propositions = Buffer.Buffer<Proposition>(64);
  transient let axioms       = Buffer.Buffer<AxiomRecord>(32);
  transient let proofs       = Buffer.Buffer<Proof>(32);
  transient let axiomLog     = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: LOGOS ───────────────────────────────────────────────

  /// Create an atomic proposition
  public func assert_proposition(
    statement : Text,
    truthValue: TruthValue,
    confidence: Float
  ) : async Proposition {
    let id = nextPropId;
    nextPropId += 1;

    let godelNum = generateGodelNumber(statement);

    let prop : Proposition = {
      id;
      statement;
      propType = #Atomic;
      truthValue;
      operands = [];
      godelNum;
      confidence = Float.min(1.0, Float.max(0.0, confidence));
      timestamp = Time.now();
      active = true;
    };

    propositions.add(prop);
    axiomLog.add("LOGOS: Asserted proposition #" # Nat.toText(id) #
                 ": " # statement # " [" # truthValueToText(truthValue) # "]");

    prop
  };

  /// Create a compound proposition
  public func compound_proposition(
    propType  : PropositionType,
    operandIds: [Nat],
    statement : Text
  ) : async ?Proposition {
    // Validate operands exist
    let validOps = Buffer.Buffer<Nat>(operandIds.size());
    for (opId in operandIds.vals()) {
      for (p in propositions.vals()) {
        if (p.id == opId and p.active) { validOps.add(opId) };
      };
    };

    if (validOps.size() != operandIds.size()) { return null };

    let id = nextPropId;
    nextPropId += 1;

    // Evaluate truth value based on operands
    let truthValue = evaluateCompound(propType, validOps);
    let confidence = calculateCompoundConfidence(validOps);

    let prop : Proposition = {
      id;
      statement;
      propType;
      truthValue;
      operands = Buffer.toArray(validOps);
      godelNum = generateGodelNumber(statement);
      confidence;
      timestamp = Time.now();
      active = true;
    };

    propositions.add(prop);
    axiomLog.add("LOGOS: Created compound #" # Nat.toText(id) #
                 " type=" # propTypeToText(propType));

    ?prop
  };

  /// Establish an axiom
  public func establish_axiom(
    name        : Text,
    statement   : Text,
    category    : AxiomCategory,
    foundational: Bool
  ) : async AxiomRecord {
    // Create corresponding proposition (axioms are true by definition)
    let prop = await assert_proposition(statement, #True, 1.0);

    let id = nextAxiomId;
    nextAxiomId += 1;

    let axiom : AxiomRecord = {
      id;
      name;
      statement;
      category;
      propId = prop.id;
      foundational;
      timestamp = Time.now();
    };

    axioms.add(axiom);
    axiomLog.add("LOGOS: Established axiom #" # Nat.toText(id) #
                 " '" # name # "'");

    axiom
  };

  // ── SUB-MODEL: VERITAS ─────────────────────────────────────────────

  /// Apply an inference rule
  public func apply_inference(
    rule      : InferenceRule,
    premiseIds: [Nat]
  ) : async ?Proposition {
    // Get premises
    let premises = Buffer.Buffer<Proposition>(premiseIds.size());
    for (pid in premiseIds.vals()) {
      for (p in propositions.vals()) {
        if (p.id == pid and p.active) { premises.add(p) };
      };
    };

    if (premises.size() != premiseIds.size()) { return null };

    // Apply inference rule
    let result = applyRule(rule, Buffer.toArray(premises));

    switch (result) {
      case (?res) {
        let id = nextPropId;
        nextPropId += 1;

        let prop : Proposition = {
          id;
          statement = res.statement;
          propType = res.propType;
          truthValue = res.truthValue;
          operands = premiseIds;
          godelNum = generateGodelNumber(res.statement);
          confidence = res.confidence;
          timestamp = Time.now();
          active = true;
        };

        propositions.add(prop);
        axiomLog.add("VERITAS: Inferred #" # Nat.toText(id) #
                     " via " # ruleToText(rule));

        ?prop
      };
      case null { null };
    }
  };

  /// Verify a proposition against axioms
  public func verify_against_axioms(propId : Nat) : async {
    verified    : Bool;
    supportingAxioms: [Nat];
    confidence  : Float;
  } {
    var found : ?Proposition = null;
    for (p in propositions.vals()) {
      if (p.id == propId and p.active) { found := ?p };
    };

    switch (found) {
      case (?prop) {
        let supporting = Buffer.Buffer<Nat>(axioms.size());
        var totalConfidence : Float = 0.0;

        for (a in axioms.vals()) {
          // Check if axiom supports this proposition
          if (axiomsSupport(a, prop)) {
            supporting.add(a.id);
            totalConfidence += 1.0;
          };
        };

        let verified = supporting.size() > 0 and prop.truthValue == #True;
        let confidence = if (supporting.size() > 0) {
          totalConfidence / Float.fromInt(supporting.size()) * prop.confidence
        } else { prop.confidence * PHI_INVERSE };

        {
          verified;
          supportingAxioms = Buffer.toArray(supporting);
          confidence;
        }
      };
      case null {
        {
          verified = false;
          supportingAxioms = [];
          confidence = 0.0;
        }
      };
    }
  };

  /// Check consistency of proposition set
  public func check_consistency(propIds : [Nat]) : async ConsistencyResult {
    let props = Buffer.Buffer<Proposition>(propIds.size());
    for (pid in propIds.vals()) {
      for (p in propositions.vals()) {
        if (p.id == pid and p.active) { props.add(p) };
      };
    };

    let conflicts = Buffer.Buffer<{ prop1: Nat; prop2: Nat; description: Text }>(8);

    // Check for direct contradictions
    for (i in Iter.range(0, props.size() - 1)) {
      for (j in Iter.range(i + 1, props.size() - 1)) {
        let p1 = props.get(i);
        let p2 = props.get(j);

        // Check if one is negation of other
        if (isNegation(p1, p2)) {
          if (p1.truthValue == #True and p2.truthValue == #True) {
            conflicts.add({
              prop1 = p1.id;
              prop2 = p2.id;
              description = "Contradictory truth values";
            });
          };
        };

        // Check for semantic contradiction
        if (p1.truthValue == #True and p2.truthValue == #True and
            semanticallyContradicts(p1, p2)) {
          conflicts.add({
            prop1 = p1.id;
            prop2 = p2.id;
            description = "Semantic contradiction detected";
          });
        };
      };
    };

    let consistent = conflicts.size() == 0;
    let confidence = if (consistent) { 1.0 } else {
      1.0 - Float.fromInt(conflicts.size()) / Float.fromInt(props.size() * props.size())
    };

    {
      consistent;
      conflicts = Buffer.toArray(conflicts);
      confidence;
    }
  };

  /// Create a proof
  public func construct_proof(theoremId : Nat, steps : [ProofStep]) : async ?Proof {
    var theorem : ?Proposition = null;
    for (p in propositions.vals()) {
      if (p.id == theoremId and p.active) { theorem := ?p };
    };

    switch (theorem) {
      case null { return null };
      case (?_) {};
    };

    // Validate each step
    var valid = true;
    for (step in steps.vals()) {
      if (not validateStep(step)) {
        valid := false;
      };
    };

    // Check if conclusion is reached
    let complete = steps.size() > 0 and
                   steps[steps.size() - 1].propId == theoremId;

    let id = nextProofId;
    nextProofId += 1;

    let proof : Proof = {
      id;
      theorem = theoremId;
      steps;
      valid;
      complete;
      timestamp = Time.now();
    };

    proofs.add(proof);
    axiomLog.add("VERITAS: Proof #" # Nat.toText(id) #
                 " valid=" # (if valid "YES" else "NO") #
                 " complete=" # (if complete "YES" else "NO"));

    ?proof
  };

  // ── Helper Functions ───────────────────────────────────────────────

  func generateGodelNumber(s : Text) : Nat {
    // Simplified Gödel numbering using hash
    let h = Text.hash(s);
    godelCounter += 1;
    godelCounter * 1000 + (h % 1000)
  };

  func evaluateCompound(propType : PropositionType, operands : Buffer.Buffer<Nat>) : TruthValue {
    if (operands.size() == 0) { return #Unknown };

    // Get truth values of operands
    let tvs = Buffer.Buffer<TruthValue>(operands.size());
    for (opId in operands.vals()) {
      for (p in propositions.vals()) {
        if (p.id == opId) { tvs.add(p.truthValue) };
      };
    };

    switch (propType) {
      case (#Negation) {
        switch (tvs.get(0)) {
          case (#True) { #False };
          case (#False) { #True };
          case _ { #Unknown };
        }
      };
      case (#Conjunction) {
        var allTrue = true;
        var anyFalse = false;
        for (tv in tvs.vals()) {
          if (tv != #True) { allTrue := false };
          if (tv == #False) { anyFalse := true };
        };
        if (anyFalse) { #False }
        else if (allTrue) { #True }
        else { #Unknown }
      };
      case (#Disjunction) {
        var anyTrue = false;
        var allFalse = true;
        for (tv in tvs.vals()) {
          if (tv == #True) { anyTrue := true };
          if (tv != #False) { allFalse := false };
        };
        if (anyTrue) { #True }
        else if (allFalse) { #False }
        else { #Unknown }
      };
      case (#Implication) {
        if (tvs.size() >= 2) {
          let antecedent = tvs.get(0);
          let consequent = tvs.get(1);
          switch (antecedent, consequent) {
            case (#False, _) { #True };
            case (#True, #True) { #True };
            case (#True, #False) { #False };
            case _ { #Unknown };
          }
        } else { #Unknown }
      };
      case _ { #Unknown };
    }
  };

  func calculateCompoundConfidence(operands : Buffer.Buffer<Nat>) : Float {
    if (operands.size() == 0) { return 0.0 };

    var product : Float = 1.0;
    for (opId in operands.vals()) {
      for (p in propositions.vals()) {
        if (p.id == opId) { product *= p.confidence };
      };
    };
    product
  };

  type InferenceResult = {
    statement  : Text;
    propType   : PropositionType;
    truthValue : TruthValue;
    confidence : Float;
  };

  func applyRule(rule : InferenceRule, premises : [Proposition]) : ?InferenceResult {
    switch (rule) {
      case (#ModusPonens) {
        if (premises.size() >= 2) {
          // (P → Q) ∧ P ⊢ Q
          let impl = premises[0];
          let antecedent = premises[1];
          if (impl.propType == #Implication and antecedent.truthValue == #True) {
            ?{
              statement = "Conclusion via Modus Ponens";
              propType = #Atomic;
              truthValue = #True;
              confidence = impl.confidence * antecedent.confidence;
            }
          } else { null }
        } else { null }
      };
      case (#ModusTollens) {
        if (premises.size() >= 2) {
          // (P → Q) ∧ ¬Q ⊢ ¬P
          let impl = premises[0];
          let negConsequent = premises[1];
          if (impl.propType == #Implication and negConsequent.truthValue == #True) {
            ?{
              statement = "Negation via Modus Tollens";
              propType = #Negation;
              truthValue = #True;
              confidence = impl.confidence * negConsequent.confidence;
            }
          } else { null }
        } else { null }
      };
      case (#Conjunction) {
        // P, Q ⊢ P ∧ Q
        var allTrue = true;
        var minConf : Float = 1.0;
        for (p in premises.vals()) {
          if (p.truthValue != #True) { allTrue := false };
          if (p.confidence < minConf) { minConf := p.confidence };
        };
        if (allTrue) {
          ?{
            statement = "Conjunction of premises";
            propType = #Conjunction;
            truthValue = #True;
            confidence = minConf;
          }
        } else { null }
      };
      case (#Simplification) {
        // P ∧ Q ⊢ P
        if (premises.size() >= 1 and premises[0].propType == #Conjunction) {
          ?{
            statement = "Simplified from conjunction";
            propType = #Atomic;
            truthValue = premises[0].truthValue;
            confidence = premises[0].confidence;
          }
        } else { null }
      };
      case _ { null };
    }
  };

  func axiomsSupport(a : AxiomRecord, p : Proposition) : Bool {
    // Simplified: check if axiom statement contains keywords from proposition
    Text.contains(p.statement, #text a.name) or
    a.propId == p.id or
    (a.foundational and p.truthValue == #True)
  };

  func isNegation(p1 : Proposition, p2 : Proposition) : Bool {
    (p1.propType == #Negation and p1.operands.size() > 0 and p1.operands[0] == p2.id) or
    (p2.propType == #Negation and p2.operands.size() > 0 and p2.operands[0] == p1.id)
  };

  func semanticallyContradicts(p1 : Proposition, p2 : Proposition) : Bool {
    // Simplified semantic check
    Text.contains(p1.statement, #text "not") != Text.contains(p2.statement, #text "not") and
    Text.size(p1.statement) > 0 and Text.size(p2.statement) > 0
  };

  func validateStep(step : ProofStep) : Bool {
    // Basic validation - check proposition exists
    for (p in propositions.vals()) {
      if (p.id == step.propId) { return true };
    };
    false
  };

  func truthValueToText(tv : TruthValue) : Text {
    switch (tv) {
      case (#True) { "TRUE" };
      case (#False) { "FALSE" };
      case (#Unknown) { "UNKNOWN" };
      case (#Undecidable) { "UNDECIDABLE" };
    }
  };

  func propTypeToText(pt : PropositionType) : Text {
    switch (pt) {
      case (#Atomic) { "Atomic" };
      case (#Negation) { "Negation" };
      case (#Conjunction) { "Conjunction" };
      case (#Disjunction) { "Disjunction" };
      case (#Implication) { "Implication" };
      case (#Biconditional) { "Biconditional" };
      case (#Universal) { "Universal" };
      case (#Existential) { "Existential" };
    }
  };

  func ruleToText(rule : InferenceRule) : Text {
    switch (rule) {
      case (#ModusPonens) { "Modus Ponens" };
      case (#ModusTollens) { "Modus Tollens" };
      case (#HypotheticalSyllogism) { "Hypothetical Syllogism" };
      case (#DisjunctiveSyllogism) { "Disjunctive Syllogism" };
      case (#Conjunction) { "Conjunction" };
      case (#Simplification) { "Simplification" };
      case (#Addition) { "Addition" };
      case (#DoubleNegation) { "Double Negation" };
      case (#DeMorgan) { "De Morgan" };
      case (#Contraposition) { "Contraposition" };
    }
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_propositions() : async [Proposition] {
    let active = Buffer.Buffer<Proposition>(propositions.size());
    for (p in propositions.vals()) { if (p.active) { active.add(p) } };
    Buffer.toArray(active)
  };

  public query func list_axioms() : async [AxiomRecord] {
    Buffer.toArray(axioms)
  };

  public query func list_proofs() : async [Proof] {
    Buffer.toArray(proofs)
  };

  public query func logic_state() : async {
    propositions  : Nat;
    axioms        : Nat;
    proofs        : Nat;
    validProofs   : Nat;
    epoch         : Nat;
  } {
    var activeProps : Nat = 0;
    var validProofCount : Nat = 0;

    for (p in propositions.vals()) { if (p.active) { activeProps += 1 } };
    for (pr in proofs.vals()) { if (pr.valid and pr.complete) { validProofCount += 1 } };

    {
      propositions = activeProps;
      axioms = axioms.size();
      proofs = proofs.size();
      validProofs = validProofCount;
      epoch = logicEpoch;
    }
  };

  public query func get_axiom_log() : async [Text] {
    Buffer.toArray(axiomLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "AXIOM" };

  public query func designation() : async Text {
    "Foundational Truth Verification — From first principles, all truth flows"
  };

  public func register() : async Text {
    "AXIOM registered. Capabilities: [logic, inference, consistency, proof-verification]."
  };

  public query func diag() : async {
    status       : Text;
    health       : Float;
    propositions : Nat;
    axioms       : Nat;
    timestamp    : Int;
  } {
    var activeProps : Nat = 0;
    for (p in propositions.vals()) { if (p.active) { activeProps += 1 } };

    let health = if (axioms.size() > 0) { PHI_INVERSE + 0.3 } else { 0.5 };

    {
      status = if (axioms.size() > 0) "LOGIC_GROUNDED" else "LOGIC_FLOATING";
      health;
      propositions = activeProps;
      axioms = axioms.size();
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    logicEpoch += 1;
    "AXIOM heal: Logic epoch advanced to " # Nat.toText(logicEpoch) # "."
  };

  public query func report_status() : async Text {
    var ap : Nat = 0;
    for (p in propositions.vals()) { if (p.active) { ap += 1 } };
    "AXIOM | propositions=" # Nat.toText(ap) #
    " axioms=" # Nat.toText(axioms.size()) #
    " proofs=" # Nat.toText(proofs.size())
  };
};
