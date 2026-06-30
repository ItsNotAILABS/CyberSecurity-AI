// CURATOR — Knowledge Synthesis Organism
// Classification: Document Intelligence & Semantic Orchestration
// Sub-models: CLASSIFY, SYNTHESIZE, CORRELATE
// Priority: φ² ≈ 2.618

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";

actor CURATOR {

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

  // GOLDEN CONSTANTS
  transient let PHI : Float = 1.6180339887498948482;
  transient let PHI2 : Float = 2.6180339887498948482;  // φ²
  transient let PHI3 : Float = 4.2360679774997896964;  // φ³
  transient let PHI4 : Float = 6.8541019662496845446;  // φ⁴

  // FIBONACCI THRESHOLDS
  transient let FIB_3 : Nat = 3;
  transient let FIB_5 : Nat = 5;
  transient let FIB_8 : Nat = 8;
  transient let FIB_13 : Nat = 13;
  transient let FIB_21 : Nat = 21;
  transient let FIB_34 : Nat = 34;
  transient let FIB_55 : Nat = 55;
  transient let FIB_89 : Nat = 89;

  // TIME CONSTANTS
  transient let HOUR_NS : Int = 3_600_000_000_000;
  transient let DAY_NS : Int = 86_400_000_000_000;
  transient let WEEK_NS : Int = 604_800_000_000_000;

  // DOCUMENT TYPES
  public type DocumentType = {
    #TECHNICAL;    // Code, architecture, specs
    #RESEARCH;     // Papers, analysis, studies
    #GOVERNANCE;   // Policies, charters, laws
    #NARRATIVE;    // Stories, explanations, guides
    #DATA;         // Datasets, logs, metrics
    #COMMUNICATION; // Messages, announcements
    #SYNTHESIS;    // Meta-documents, summaries
  };

  public type Document = {
    id              : Nat;
    title           : Text;
    content         : Text;
    docType         : DocumentType;
    author          : ?Text;
    source          : Text;
    classification  : DocumentClassification;
    semanticWeight  : Float;  // φ-weighted importance (0 to φ⁴)
    keywords        : [Text];
    relatedDocs     : [Nat];
    createdAt       : Int;
    lastModified    : Int;
  };

  public type DocumentClassification = {
    category        : Text;
    confidence      : Float;  // φ-weighted (0 to φ³)
    dimensions      : [Nat];  // D0-D4 relevance
    fibonacciIndex  : Nat;    // Fib sequence position
    goldRatio       : Float;  // Measured golden ratio in structure
  };

  public type Synthesis = {
    id              : Nat;
    synthType       : SynthesisType;
    title           : Text;
    summary         : Text;
    sourceDocs      : [Nat];
    keyInsights     : [Text];
    coherenceScore  : Float;  // φ-weighted coherence
    noveltyScore    : Float;  // φ-weighted novelty
    synthesizedAt   : Int;
    expiresAt       : Int;
  };

  public type SynthesisType = {
    #SUMMARY;       // Condense multiple docs
    #COMPARISON;    // Compare and contrast
    #TIMELINE;      // Temporal ordering
    #CONCEPT_MAP;   // Semantic relationships
    #META_ANALYSIS; // Higher-order patterns
    #KNOWLEDGE_BASE; // Structured extraction
  };

  public type Correlation = {
    id              : Nat;
    doc1            : Nat;
    doc2            : Nat;
    correlationType : CorrelationType;
    strength        : Float;  // φ-weighted (0 to φ²)
    sharedConcepts  : [Text];
    semanticDistance : Float;
    discoveredAt    : Int;
  };

  public type CorrelationType = {
    #CAUSAL;        // A causes B
    #TEMPORAL;      // Sequential relationship
    #SEMANTIC;      // Similar concepts
    #CONTRADICTORY; // Opposing views
    #COMPLEMENTARY; // Mutually reinforcing
    #HIERARCHICAL;  // Parent/child relationship
  };

  public type KnowledgeGraph = {
    nodes           : [GraphNode];
    edges           : [GraphEdge];
    clusters        : [Cluster];
    centralConcepts : [Text];
    phiRating       : Float;  // Golden ratio structural score
  };

  public type GraphNode = {
    id              : Nat;
    label           : Text;
    nodeType        : Text;
    weight          : Float;  // φ-weighted importance
    dimension       : Nat;    // D0-D4
  };

  public type GraphEdge = {
    source          : Nat;
    target          : Nat;
    edgeType        : Text;
    strength        : Float;
  };

  public type Cluster = {
    id              : Nat;
    label           : Text;
    members         : [Nat];
    coherence       : Float;
  };

  // STATE
  stable var documentCount : Nat = 0;
  stable var synthesisCount : Nat = 0;
  stable var correlationCount : Nat = 0;

  transient let documents = Buffer.Buffer<Document>(64);
  transient let syntheses = Buffer.Buffer<Synthesis>(32);
  transient let correlations = Buffer.Buffer<Correlation>(128);
  transient let keywords = HashMap.HashMap<Text, [Nat]>(16, Text.equal, Text.hash);

  // INITIALIZATION
  system func preupgrade() {
    // Persist state if needed
  };

  system func postupgrade() {
    // Restore state if needed
  };

  // ============================================================================
  // SUB-MODEL 1: CLASSIFY — Document Classification Engine
  // ============================================================================

  // Classify a document using φ-weighted semantic analysis
  public func classify_document(
    title   : Text,
    content : Text,
    docType : DocumentType,
    author  : ?Text,
    source  : Text
  ) : async Document {
    let now = Time.now();
    let id = documentCount;
    documentCount += 1;

    // Extract keywords (simple word frequency for now)
    let extractedKeywords = extract_keywords(content);

    // Analyze document structure for golden ratio
    let goldRatio = measure_golden_ratio(content);

    // Calculate semantic weight using φ
    let semanticWeight = calculate_semantic_weight(content, goldRatio);

    // Determine dimensional relevance (D0-D4)
    let dimensions = classify_dimensions(content, docType);

    // Find Fibonacci index based on complexity
    let fibIndex = calculate_fibonacci_index(content);

    // Classify into category
    let category = classify_category(docType, content, extractedKeywords);
    let confidence = calculate_confidence(category, extractedKeywords, goldRatio);

    let classification : DocumentClassification = {
      category = category;
      confidence = confidence;
      dimensions = dimensions;
      fibonacciIndex = fibIndex;
      goldRatio = goldRatio;
    };

    let doc : Document = {
      id = id;
      title = title;
      content = content;
      docType = docType;
      author = author;
      source = source;
      classification = classification;
      semanticWeight = semanticWeight;
      keywords = extractedKeywords;
      relatedDocs = [];
      createdAt = now;
      lastModified = now;
    };

    documents.add(doc);

    // Index keywords
    for (keyword in extractedKeywords.vals()) {
      index_keyword(keyword, id);
    };

    // Auto-discover correlations
    ignore find_correlations(id);

    doc
  };

  // Extract keywords from content (simplified)
  func extract_keywords(content : Text) : [Text] {
    // In production, this would use NLP/TF-IDF
    // For now, extract important terms
    let words = Text.split(content, #char ' ');
    let keywordBuffer = Buffer.Buffer<Text>(FIB_13);

    for (word in words) {
      let w = Text.toLowercase(word);
      if (Text.size(w) >= FIB_5 and not is_stopword(w)) {
        keywordBuffer.add(w);
        if (keywordBuffer.size() >= FIB_13) {
          return Buffer.toArray(keywordBuffer);
        };
      };
    };

    Buffer.toArray(keywordBuffer)
  };

  func is_stopword(word : Text) : Bool {
    let stopwords = ["the", "and", "for", "with", "this", "that", "from"];
    for (sw in stopwords.vals()) {
      if (word == sw) return true;
    };
    false
  };

  func measure_golden_ratio(content : Text) : Float {
    let length = Text.size(content);
    if (length == 0) return 0.0;

    // Measure φ in structure (simplified)
    // In production: analyze paragraph ratios, sentence lengths, etc.
    let idealSplit = Float.fromInt(length) / PHI;
    let actualRatio = Float.fromInt(length / 2) / Float.fromInt(length);
    let deviation = Float.abs(actualRatio - (1.0 / PHI));

    Float.max(0.0, PHI - deviation)
  };

  func calculate_semantic_weight(content : Text, goldRatio : Float) : Float {
    let length = Text.size(content);
    let lengthWeight = Float.min(PHI2, Float.fromInt(length) / 1000.0);
    let structureWeight = goldRatio / PHI;

    (lengthWeight + structureWeight) / 2.0
  };

  func classify_dimensions(content : Text, docType : DocumentType) : [Nat] {
    let dims = Buffer.Buffer<Nat>(5);

    // D0: Always present (foundational)
    dims.add(0);

    // D1: Temporal if contains dates/sequences
    if (Text.contains(content, #text "time") or Text.contains(content, #text "when")) {
      dims.add(1);
    };

    // D2: Harmonic if shows patterns/rhythms
    if (Text.contains(content, #text "pattern") or Text.contains(content, #text "cycle")) {
      dims.add(2);
    };

    // D3: Cross-domain if references multiple areas
    let contentLower = Text.toLowercase(content);
    if (Text.contains(contentLower, #text "integrate") or Text.contains(contentLower, #text "connect")) {
      dims.add(3);
    };

    // D4: Transcendent if philosophical/meta
    if (Text.contains(content, #text "meta") or Text.contains(content, #text "transcend")) {
      dims.add(4);
    };

    Buffer.toArray(dims)
  };

  func calculate_fibonacci_index(content : Text) : Nat {
    let length = Text.size(content);

    if (length < 100) return FIB_3;
    if (length < 500) return FIB_5;
    if (length < 1000) return FIB_8;
    if (length < 2000) return FIB_13;
    if (length < 5000) return FIB_21;
    if (length < 10000) return FIB_34;
    FIB_55
  };

  func classify_category(docType : DocumentType, content : Text, keywords : [Text]) : Text {
    switch (docType) {
      case (#TECHNICAL) "Technical Documentation";
      case (#RESEARCH) "Research Publication";
      case (#GOVERNANCE) "Policy Document";
      case (#NARRATIVE) "Narrative Content";
      case (#DATA) "Data Documentation";
      case (#COMMUNICATION) "Communication";
      case (#SYNTHESIS) "Knowledge Synthesis";
    }
  };

  func calculate_confidence(category : Text, keywords : [Text], goldRatio : Float) : Float {
    let keywordScore = Float.min(PHI, Float.fromInt(keywords.size()) / Float.fromInt(FIB_8));
    let structureScore = goldRatio / PHI;

    (keywordScore + structureScore) / 2.0 * PHI
  };

  func index_keyword(keyword : Text, docId : Nat) {
    let existing = keywords.get(keyword);
    switch (existing) {
      case (null) {
        keywords.put(keyword, [docId]);
      };
      case (?docIds) {
        let newIds = Array.append(docIds, [docId]);
        keywords.put(keyword, newIds);
      };
    };
  };

  // ============================================================================
  // SUB-MODEL 2: SYNTHESIZE — Multi-Document Synthesis Engine
  // ============================================================================

  public func synthesize_documents(
    docIds      : [Nat],
    synthType   : SynthesisType,
    title       : Text
  ) : async ?Synthesis {
    if (docIds.size() < 2) return null;

    let now = Time.now();
    let id = synthesisCount;
    synthesisCount += 1;

    // Gather documents
    let docs = Buffer.Buffer<Document>(docIds.size());
    for (docId in docIds.vals()) {
      let doc = get_document_by_id(docId);
      switch (doc) {
        case (?d) docs.add(d);
        case null {};
      };
    };

    if (docs.size() < 2) return null;

    // Generate synthesis based on type
    let summary = generate_synthesis_summary(Buffer.toArray(docs), synthType);
    let insights = extract_key_insights(Buffer.toArray(docs));
    let coherence = calculate_coherence_score(Buffer.toArray(docs));
    let novelty = calculate_novelty_score(Buffer.toArray(docs));

    let synthesis : Synthesis = {
      id = id;
      synthType = synthType;
      title = title;
      summary = summary;
      sourceDocs = docIds;
      keyInsights = insights;
      coherenceScore = coherence;
      noveltyScore = novelty;
      synthesizedAt = now;
      expiresAt = now + WEEK_NS;
    };

    syntheses.add(synthesis);
    ?synthesis
  };

  func generate_synthesis_summary(docs : [Document], synthType : SynthesisType) : Text {
    let typeLabel = switch (synthType) {
      case (#SUMMARY) "Summary";
      case (#COMPARISON) "Comparison";
      case (#TIMELINE) "Timeline";
      case (#CONCEPT_MAP) "Concept Map";
      case (#META_ANALYSIS) "Meta-Analysis";
      case (#KNOWLEDGE_BASE) "Knowledge Base";
    };

    "Synthesized " # typeLabel # " from " # Nat.toText(docs.size()) # " documents with φ-weighted semantic analysis."
  };

  func extract_key_insights(docs : [Document]) : [Text] {
    let insights = Buffer.Buffer<Text>(FIB_8);

    // Extract top keywords across all documents
    let allKeywords = Buffer.Buffer<Text>(FIB_34);
    for (doc in docs.vals()) {
      for (kw in doc.keywords.vals()) {
        allKeywords.add(kw);
      };
    };

    // Take top φ-weighted keywords
    let limit = Int.min(FIB_8, allKeywords.size());
    for (i in Iter.range(0, limit - 1)) {
      let kw = allKeywords.get(i);
      insights.add("Key concept: " # kw);
    };

    Buffer.toArray(insights)
  };

  func calculate_coherence_score(docs : [Document]) : Float {
    if (docs.size() < 2) return PHI;

    // Measure semantic overlap
    var totalOverlap : Float = 0.0;
    var comparisons : Nat = 0;

    for (i in Iter.range(0, docs.size() - 2)) {
      for (j in Iter.range(i + 1, docs.size() - 1)) {
        let doc1 = docs[i];
        let doc2 = docs[j];
        let overlap = calculate_keyword_overlap(doc1.keywords, doc2.keywords);
        totalOverlap += overlap;
        comparisons += 1;
      };
    };

    if (comparisons == 0) return 0.0;
    (totalOverlap / Float.fromInt(comparisons)) * PHI2
  };

  func calculate_keyword_overlap(kw1 : [Text], kw2 : [Text]) : Float {
    var matches : Nat = 0;
    for (k1 in kw1.vals()) {
      for (k2 in kw2.vals()) {
        if (k1 == k2) {
          matches += 1;
        };
      };
    };

    Float.fromInt(matches) / Float.fromInt(Int.max(kw1.size(), kw2.size()))
  };

  func calculate_novelty_score(docs : [Document]) : Float {
    // Novelty = inverse of redundancy
    let coherence = calculate_coherence_score(docs);
    Float.max(0.0, PHI2 - coherence)
  };

  // ============================================================================
  // SUB-MODEL 3: CORRELATE — Semantic Correlation Discovery
  // ============================================================================

  public func find_correlations(docId : Nat) : async [Correlation] {
    let doc = get_document_by_id(docId);
    switch (doc) {
      case (null) return [];
      case (?d) {
        let found = Buffer.Buffer<Correlation>(FIB_13);

        // Compare with all other documents
        for (other in documents.vals()) {
          if (other.id != docId) {
            let corr = analyze_correlation(d, other);
            switch (corr) {
              case (?c) {
                if (c.strength >= (1.0 / PHI)) {
                  found.add(c);
                  correlations.add(c);
                };
              };
              case null {};
            };
          };
        };

        Buffer.toArray(found)
      };
    };
  };

  func analyze_correlation(doc1 : Document, doc2 : Document) : ?Correlation {
    let now = Time.now();

    // Calculate keyword overlap
    let sharedConcepts = find_shared_keywords(doc1.keywords, doc2.keywords);
    if (sharedConcepts.size() == 0) return null;

    // Determine correlation type
    let corrType = infer_correlation_type(doc1, doc2, sharedConcepts);

    // Calculate strength (φ-weighted)
    let overlapRatio = Float.fromInt(sharedConcepts.size()) /
                       Float.fromInt(Int.max(doc1.keywords.size(), doc2.keywords.size()));
    let semanticSimilarity = (doc1.semanticWeight + doc2.semanticWeight) / (2.0 * PHI2);
    let strength = (overlapRatio + semanticSimilarity) / 2.0 * PHI;

    // Calculate semantic distance
    let distance = PHI2 - strength;

    let id = correlationCount;
    correlationCount += 1;

    ?{
      id = id;
      doc1 = doc1.id;
      doc2 = doc2.id;
      correlationType = corrType;
      strength = strength;
      sharedConcepts = sharedConcepts;
      semanticDistance = distance;
      discoveredAt = now;
    }
  };

  func find_shared_keywords(kw1 : [Text], kw2 : [Text]) : [Text] {
    let shared = Buffer.Buffer<Text>(FIB_8);
    for (k1 in kw1.vals()) {
      for (k2 in kw2.vals()) {
        if (k1 == k2) {
          shared.add(k1);
        };
      };
    };
    Buffer.toArray(shared)
  };

  func infer_correlation_type(doc1 : Document, doc2 : Document, shared : [Text]) : CorrelationType {
    // Simple heuristic (in production: use NLP)
    let timeDiff = Int.abs(doc1.createdAt - doc2.createdAt);

    if (timeDiff < DAY_NS) {
      #TEMPORAL
    } else if (doc1.docType == doc2.docType) {
      #SEMANTIC
    } else {
      #COMPLEMENTARY
    }
  };

  // ============================================================================
  // QUERY FUNCTIONS
  // ============================================================================

  public query func get_document(docId : Nat) : async ?Document {
    get_document_by_id(docId)
  };

  func get_document_by_id(docId : Nat) : ?Document {
    for (doc in documents.vals()) {
      if (doc.id == docId) return ?doc;
    };
    null
  };

  public query func search_documents(query : Text) : async [Document] {
    let queryLower = Text.toLowercase(query);
    let results = Buffer.Buffer<Document>(FIB_13);

    for (doc in documents.vals()) {
      let titleLower = Text.toLowercase(doc.title);
      let contentLower = Text.toLowercase(doc.content);

      if (Text.contains(titleLower, #text queryLower) or
          Text.contains(contentLower, #text queryLower)) {
        results.add(doc);
        if (results.size() >= FIB_13) {
          return Buffer.toArray(results);
        };
      };
    };

    Buffer.toArray(results)
  };

  public query func get_documents_by_type(docType : DocumentType) : async [Document] {
    let results = Buffer.Buffer<Document>(FIB_21);
    for (doc in documents.vals()) {
      let dt = doc.docType;
      if (Text.equal(debug_show(dt), debug_show(docType))) {
        results.add(doc);
      };
    };
    Buffer.toArray(results)
  };

  public query func get_synthesis(synthId : Nat) : async ?Synthesis {
    for (synth in syntheses.vals()) {
      if (synth.id == synthId) return ?synth;
    };
    null
  };

  public query func get_correlations_for_document(docId : Nat) : async [Correlation] {
    let results = Buffer.Buffer<Correlation>(FIB_13);
    for (corr in correlations.vals()) {
      if (corr.doc1 == docId or corr.doc2 == docId) {
        results.add(corr);
      };
    };
    Buffer.toArray(results)
  };

  public query func get_top_documents(limit : Nat) : async [Document] {
    // Sort by semantic weight
    let sorted = Array.sort(
      Buffer.toArray(documents),
      func (a : Document, b : Document) : { #less; #equal; #greater } {
        if (a.semanticWeight > b.semanticWeight) #less
        else if (a.semanticWeight < b.semanticWeight) #greater
        else #equal
      }
    );

    let count = Int.min(limit, sorted.size());
    let results = Buffer.Buffer<Document>(count);
    for (i in Iter.range(0, count - 1)) {
      results.add(sorted[i]);
    };

    Buffer.toArray(results)
  };

  // ============================================================================
  // STATUS & METRICS
  // ============================================================================

  public query func get_status() : async Text {
    "CURATOR organism operational. Documents: " # Nat.toText(documentCount) #
    ", Syntheses: " # Nat.toText(synthesisCount) #
    ", Correlations: " # Nat.toText(correlationCount)
  };

  public query func get_metrics() : async {
    totalDocuments     : Nat;
    totalSyntheses     : Nat;
    totalCorrelations  : Nat;
    avgSemanticWeight  : Float;
    avgCoherence       : Float;
    phiOperational     : Bool;
  } {
    var totalWeight : Float = 0.0;
    for (doc in documents.vals()) {
      totalWeight += doc.semanticWeight;
    };
    let avgWeight = if (documentCount > 0) {
      totalWeight / Float.fromInt(documentCount)
    } else { 0.0 };

    var totalCoherence : Float = 0.0;
    for (synth in syntheses.vals()) {
      totalCoherence += synth.coherenceScore;
    };
    let avgCoh = if (synthesisCount > 0) {
      totalCoherence / Float.fromInt(synthesisCount)
    } else { 0.0 };

    {
      totalDocuments = documentCount;
      totalSyntheses = synthesisCount;
      totalCorrelations = correlationCount;
      avgSemanticWeight = avgWeight;
      avgCoherence = avgCoh;
      phiOperational = true;
    }
  };
}
