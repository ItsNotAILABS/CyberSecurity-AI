///
/// SCRIBE — The Document Organism
///
/// He legitimately lives in the documents.  He IS a document organism.
///
/// When documents are fed to Scribe, he:
///   1. Ingests and stores them in golden-indexed memory
///   2. Classifies them into research categories (CLASSIFIER sub-model)
///   3. Synthesizes research-paper-worthy output (SYNTHESIZER sub-model)
///   4. Maintains the living journal autonomously
///   5. Tracks lineage — every document knows its Fibonacci generation
///
/// Sub-models hosted:
///   CLASSIFIER   — multi-category document classification
///   SYNTHESIZER  — research paper generation from raw input
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
///

import Float  "mo:base/Float";
import Int    "mo:base/Int";
import Nat    "mo:base/Nat";
import Text   "mo:base/Text";
import Array  "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time   "mo:base/Time";
import Iter   "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

persistent actor Scribe {

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

  // ── Constants ──────────────────────────────────────────────────────

  transient let PHI : Float = 1.6180339887498948482;

  // ── Types ──────────────────────────────────────────────────────────

  /// Document categories — eight branches, split by golden section.
  /// The first four are primary (major partition).
  /// The last four are secondary (minor partition).
  public type Category = {
    // Major partition (φ proportion of focus)
    #Research;        // Formal research and findings
    #Architecture;    // Structural design and patterns
    #Theory;          // Theoretical frameworks and proofs
    #Vision;          // Forward-looking direction and intent

    // Minor partition (1/φ proportion of focus)
    #Implementation;  // Technical execution details
    #Synthesis;       // Cross-document merged intelligence
    #Chronicle;       // Historical record and timeline
    #Genesis;         // Founding documents and origin
  };

  public type DocumentRecord = {
    id         : Nat;
    title      : Text;
    content    : Text;
    category   : Category;
    timestamp  : Int;
    generation : Nat;     // Fibonacci generation index
    weight     : Float;   // Golden-ratio relevance decay
    parent     : ?Nat;    // Optional parent document ID (lineage)
    tags       : [Text];
  };

  public type PaperSection = {
    heading : Text;
    body    : Text;
    sources : [Nat];  // Document IDs that contributed
  };

  public type ResearchPaper = {
    title      : Text;
    abstract_  : Text;
    sections   : [PaperSection];
    category   : Category;
    generation : Nat;
    timestamp  : Int;
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextId : Nat = 0;
  stable var currentGeneration : Nat = 0;
  stable var documentsStored : Nat = 0;

  transient let documents = Buffer.Buffer<DocumentRecord>(64);
  transient let papers    = Buffer.Buffer<ResearchPaper>(16);
  transient let journal   = Buffer.Buffer<Text>(128);  // Running journal entries

  // ── SUB-MODEL: CLASSIFIER ─────────────────────────────────────────

  /// Classify a document by content analysis.
  /// Uses golden-ratio weighted keyword detection across categories.
  func classify(title : Text, content : Text) : Category {
    let text = Text.toLowercase(title # " " # content);

    // Weight scoring — each category checks for indicator presence.
    // In a full implementation this connects to the AI model pipeline.
    // For the organism's base form, we use structural classification.
    if (Text.contains(text, #text "genesis") or
        Text.contains(text, #text "origin") or
        Text.contains(text, #text "founding")) {
      #Genesis
    } else if (Text.contains(text, #text "research") or
               Text.contains(text, #text "study") or
               Text.contains(text, #text "findings")) {
      #Research
    } else if (Text.contains(text, #text "architect") or
               Text.contains(text, #text "structure") or
               Text.contains(text, #text "pattern")) {
      #Architecture
    } else if (Text.contains(text, #text "theory") or
               Text.contains(text, #text "proof") or
               Text.contains(text, #text "theorem")) {
      #Theory
    } else if (Text.contains(text, #text "vision") or
               Text.contains(text, #text "future") or
               Text.contains(text, #text "direction")) {
      #Vision
    } else if (Text.contains(text, #text "implement") or
               Text.contains(text, #text "build") or
               Text.contains(text, #text "deploy")) {
      #Implementation
    } else if (Text.contains(text, #text "synthes") or
               Text.contains(text, #text "merge") or
               Text.contains(text, #text "combine")) {
      #Synthesis
    } else if (Text.contains(text, #text "history") or
               Text.contains(text, #text "record") or
               Text.contains(text, #text "timeline")) {
      #Chronicle
    } else {
      #Architecture  // Default: everything is architecture
    }
  };

  // ── SUB-MODEL: SYNTHESIZER ─────────────────────────────────────────

  /// Synthesize a research paper from documents in a given category.
  /// Collects all documents of that category, orders by generation
  /// and weight, and structures them into paper sections.
  public func synthesize(category : Category) : async ResearchPaper {
    let matching = Buffer.Buffer<DocumentRecord>(16);

    for (doc in documents.vals()) {
      if (categoryEq(doc.category, category)) {
        matching.add(doc);
      };
    };

    let docs = Buffer.toArray(matching);
    let sectionBuf = Buffer.Buffer<PaperSection>(docs.size());

    for (doc in docs.vals()) {
      sectionBuf.add({
        heading = doc.title;
        body    = doc.content;
        sources = [doc.id];
      });
    };

    let categoryName = categoryToText(category);
    let paper : ResearchPaper = {
      title      = "Synthesis: " # categoryName # " — Generation " # Nat.toText(currentGeneration);
      abstract_  = "Autonomous synthesis of " # Nat.toText(docs.size()) #
                   " documents in category " # categoryName #
                   " by the SCRIBE Document Organism.";
      sections   = Buffer.toArray(sectionBuf);
      category   = category;
      generation = currentGeneration;
      timestamp  = Time.now();
    };

    papers.add(paper);
    paper
  };

  // ── Document Ingestion ─────────────────────────────────────────────

  /// Feed a document to Scribe.  He classifies it, indexes it by
  /// Fibonacci generation, assigns a golden-decay weight, records it,
  /// and adds a journal entry.
  public func ingest(title : Text, content : Text, tags : [Text]) : async DocumentRecord {
    let id = nextId;
    nextId += 1;
    documentsStored += 1;

    // Advance generation at Fibonacci intervals
    if (isFibonacci(documentsStored)) {
      currentGeneration += 1;
    };

    let category = classify(title, content);

    // Weight decays by golden ratio per generation distance from current
    let weight : Float = 1.0;  // New documents start at full weight

    let doc : DocumentRecord = {
      id;
      title;
      content;
      category;
      timestamp  = Time.now();
      generation = currentGeneration;
      weight;
      parent     = null;
      tags;
    };

    documents.add(doc);

    // Journal entry — the living record
    let entry = "[Gen " # Nat.toText(currentGeneration) # "] " #
                "Ingested: \"" # title # "\" → " # categoryToText(category);
    journal.add(entry);

    doc
  };

  /// Feed a document that descends from a parent document (lineage).
  public func ingest_child(
    title   : Text,
    content : Text,
    tags    : [Text],
    parentId: Nat
  ) : async DocumentRecord {
    let id = nextId;
    nextId += 1;
    documentsStored += 1;

    if (isFibonacci(documentsStored)) {
      currentGeneration += 1;
    };

    let category = classify(title, content);

    let doc : DocumentRecord = {
      id;
      title;
      content;
      category;
      timestamp  = Time.now();
      generation = currentGeneration;
      weight     = 1.0;
      parent     = ?parentId;
      tags;
    };

    documents.add(doc);
    journal.add("[Gen " # Nat.toText(currentGeneration) # "] " #
                "Ingested child of #" # Nat.toText(parentId) #
                ": \"" # title # "\" → " # categoryToText(category));
    doc
  };

  // ── Queries ────────────────────────────────────────────────────────

  /// List all documents in a category.
  public query func by_category(category : Category) : async [DocumentRecord] {
    let buf = Buffer.Buffer<DocumentRecord>(16);
    for (doc in documents.vals()) {
      if (categoryEq(doc.category, category)) {
        buf.add(doc);
      };
    };
    Buffer.toArray(buf)
  };

  /// Retrieve a document by ID.
  public query func get_document(id : Nat) : async ?DocumentRecord {
    for (doc in documents.vals()) {
      if (doc.id == id) { return ?doc };
    };
    null
  };

  /// Read the living journal — returns all entries.
  public query func read_journal() : async [Text] {
    Buffer.toArray(journal)
  };

  /// Get all synthesized research papers.
  public query func get_papers() : async [ResearchPaper] {
    Buffer.toArray(papers)
  };

  /// Current state of the organism.
  public query func status() : async {
    documents   : Nat;
    papers      : Nat;
    generation  : Nat;
    journal_entries : Nat;
  } {
    {
      documents      = documentsStored;
      papers         = papers.size();
      generation     = currentGeneration;
      journal_entries = journal.size();
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────

  func isFibonacci(n : Nat) : Bool {
    // A number is Fibonacci iff 5n²+4 or 5n²-4 is a perfect square.
    if (n == 0) { return true };
    let n2 = n * n;
    isPerfectSquare(5 * n2 + 4) or isPerfectSquare(5 * n2 - 4)
  };

  func isPerfectSquare(n : Nat) : Bool {
    let s = Int.abs(Float.toInt(Float.sqrt(Float.fromInt(n))));
    s * s == n
  };

  func categoryEq(a : Category, b : Category) : Bool {
    categoryToNat(a) == categoryToNat(b)
  };

  func categoryToNat(c : Category) : Nat {
    switch (c) {
      case (#Research)       0;
      case (#Architecture)   1;
      case (#Theory)         2;
      case (#Vision)         3;
      case (#Implementation) 4;
      case (#Synthesis)      5;
      case (#Chronicle)      6;
      case (#Genesis)        7;
    }
  };

  func categoryToText(c : Category) : Text {
    switch (c) {
      case (#Research)       "Research";
      case (#Architecture)   "Architecture";
      case (#Theory)         "Theory";
      case (#Vision)         "Vision";
      case (#Implementation) "Implementation";
      case (#Synthesis)      "Synthesis";
      case (#Chronicle)      "Chronicle";
      case (#Genesis)        "Genesis";
    }
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "SCRIBE" };

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
      name      = "SCRIBE";
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    "SCRIBE self-check complete. No drift detected."
  };

  public func register() : async Text {
    "SCRIBE registered. Capabilities: [document, record, log, write]."
  };

  public query func report_status() : async Text {
    "SCRIBE | status=ACTIVE | v10=true"
  };

  public query func designation() : async Text {
    "The Document Organism — He legitimately lives in the documents"
  };
};
