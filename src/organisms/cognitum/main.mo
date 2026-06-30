///
/// COGNITUM — Cognitive Pattern Recognition Organism
///
/// "Patterns are the language of the universe. COGNITUM deciphers
///  the grammar of reality."
///
/// COGNITUM implements cognitive pattern recognition using
/// Pythagorean proportions and sacred geometry. It identifies
/// emergent patterns in data streams and maps them to
/// archetypal forms.
///
/// Sub-models hosted:
///   PATTERNEX — Pattern extraction and classification
///   ARCHETYPE — Archetypal pattern matching and synthesis
///
/// Mathematical Foundation:
///   - Pythagorean ratios: 1:1 (unison), 2:1 (octave), 3:2 (fifth), 4:3 (fourth)
///   - Pattern correlation: ρ = Σ(x-μx)(y-μy) / (σx·σy·n)
///   - Information entropy: H = -Σ p(x)·log₂(p(x))
///   - Gestalt completion: Φ = perceived_pattern / total_signal
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
import Array  "mo:base/Array";

persistent actor Cognitum {

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
  transient let PI : Float = 3.14159265358979323846;
  transient let E : Float = 2.71828182845904523536;
  transient let LN2 : Float = 0.693147180559945309417;

  // Pythagorean harmonic ratios
  transient let UNISON : Float = 1.0;        // 1:1
  transient let OCTAVE : Float = 2.0;        // 2:1
  transient let FIFTH : Float = 1.5;         // 3:2
  transient let FOURTH : Float = 1.333333;   // 4:3
  transient let MAJOR_THIRD : Float = 1.25;  // 5:4
  transient let MINOR_THIRD : Float = 1.2;   // 6:5

  // ── Types ──────────────────────────────────────────────────────────

  public type PatternClass = {
    #Periodic;      // Repeating patterns
    #Harmonic;      // Pythagorean-ratio patterns
    #Fractal;       // Self-similar at multiple scales
    #Emergent;      // Novel, unpredicted patterns
    #Archetypal;    // Matches known archetype
    #Noise;         // No discernible pattern
  };

  public type Archetype = {
    #Unity;         // Oneness, wholeness
    #Duality;       // Opposition, polarity
    #Trinity;       // Mediation, synthesis
    #Quaternity;    // Stability, foundation
    #Quintessence;  // Transcendence, spirit
    #Hexad;         // Harmony, balance
    #Heptad;        // Completion, cycles
    #Octad;         // Regeneration, infinity
  };

  /// A detected pattern in the data stream
  public type Pattern = {
    id            : Nat;
    patternClass  : PatternClass;
    signature     : [Float];      // Feature vector
    frequency     : Float;        // Repetition frequency
    strength      : Float;        // Pattern confidence (0.0 to 1.0)
    entropy       : Float;        // Information entropy
    archetype     : ?Archetype;   // Matched archetype if any
    sourceIds     : [Nat];        // IDs of source data points
    timestamp     : Int;
    active        : Bool;
  };

  /// A cognitive memory trace
  public type MemoryTrace = {
    id           : Nat;
    patternId    : Nat;
    activation   : Float;         // Current activation level
    associations : [Nat];         // Associated memory IDs
    decayRate    : Float;         // Forgetting rate
    lastAccess   : Int;
    strength     : Float;         // Long-term potentiation
  };

  /// Input data point for pattern recognition
  public type DataPoint = {
    id        : Nat;
    values    : [Float];
    timestamp : Int;
    tags      : [Text];
  };

  /// Cognitive state
  public type CognitiveState = {
    #Receptive;     // Open to new patterns
    #Processing;    // Analyzing patterns
    #Integrating;   // Synthesizing patterns
    #Reflecting;    // Comparing to memory
    #Dormant;       // Low activity
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextPatternId  : Nat = 0;
  stable var nextMemoryId   : Nat = 0;
  stable var nextDataId     : Nat = 0;
  stable var cognitiveEpoch : Nat = 0;

  transient let patterns    = Buffer.Buffer<Pattern>(64);
  transient let memories    = Buffer.Buffer<MemoryTrace>(128);
  transient let dataStream  = Buffer.Buffer<DataPoint>(256);
  transient let cogLog      = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: PATTERNEX ───────────────────────────────────────────

  /// Ingest a data point into the cognitive stream
  public func ingest_data(values : [Float], tags : [Text]) : async DataPoint {
    let id = nextDataId;
    nextDataId += 1;

    let dataPoint : DataPoint = {
      id;
      values;
      timestamp = Time.now();
      tags;
    };

    dataStream.add(dataPoint);

    // Keep stream bounded
    if (dataStream.size() > 512) {
      ignore dataStream.remove(0);
    };

    dataPoint
  };

  /// Detect patterns in the recent data stream
  public func detect_patterns(windowSize : Nat) : async [Pattern] {
    let streamSize = dataStream.size();
    if (streamSize < 2) { return [] };

    let window = Nat.min(windowSize, streamSize);
    let startIdx = streamSize - window;
    let detected = Buffer.Buffer<Pattern>(8);

    // Extract values from window
    let windowData = Buffer.Buffer<[Float]>(window);
    for (i in Iter.range(startIdx, streamSize - 1)) {
      windowData.add(dataStream.get(i).values);
    };

    // Detect periodic patterns using autocorrelation
    let periodicPattern = detectPeriodicity(windowData);
    switch (periodicPattern) {
      case (?p) {
        let id = nextPatternId;
        nextPatternId += 1;
        let pattern : Pattern = {
          id;
          patternClass = #Periodic;
          signature = [p.period, p.amplitude];
          frequency = 1.0 / p.period;
          strength = p.correlation;
          entropy = calculateEntropy(windowData);
          archetype = mapToArchetype(p.correlation, #Periodic);
          sourceIds = [];  // Could track specific data IDs
          timestamp = Time.now();
          active = true;
        };
        patterns.add(pattern);
        detected.add(pattern);
        cogLog.add("PATTERNEX: Detected periodic pattern #" # Nat.toText(id) #
                   " period=" # Float.toText(p.period));
      };
      case null {};
    };

    // Detect harmonic patterns using Pythagorean ratios
    let harmonicPattern = detectHarmonic(windowData);
    switch (harmonicPattern) {
      case (?h) {
        let id = nextPatternId;
        nextPatternId += 1;
        let pattern : Pattern = {
          id;
          patternClass = #Harmonic;
          signature = [h.ratio, h.baseFreq];
          frequency = h.baseFreq;
          strength = h.confidence;
          entropy = calculateEntropy(windowData);
          archetype = ratioToArchetype(h.ratio);
          sourceIds = [];
          timestamp = Time.now();
          active = true;
        };
        patterns.add(pattern);
        detected.add(pattern);
        cogLog.add("PATTERNEX: Detected harmonic pattern #" # Nat.toText(id) #
                   " ratio=" # Float.toText(h.ratio));
      };
      case null {};
    };

    Buffer.toArray(detected)
  };

  /// Calculate correlation between two patterns
  public func correlate_patterns(patternId1 : Nat, patternId2 : Nat) : async ?Float {
    var p1 : ?Pattern = null;
    var p2 : ?Pattern = null;

    for (p in patterns.vals()) {
      if (p.id == patternId1) { p1 := ?p };
      if (p.id == patternId2) { p2 := ?p };
    };

    switch (p1, p2) {
      case (?pattern1, ?pattern2) {
        // Pearson correlation between signatures
        let sig1 = pattern1.signature;
        let sig2 = pattern2.signature;

        if (sig1.size() == 0 or sig2.size() == 0) { return ?0.0 };

        let minLen = Nat.min(sig1.size(), sig2.size());
        var sum1 : Float = 0.0;
        var sum2 : Float = 0.0;

        for (i in Iter.range(0, minLen - 1)) {
          sum1 += sig1[i];
          sum2 += sig2[i];
        };

        let mean1 = sum1 / Float.fromInt(minLen);
        let mean2 = sum2 / Float.fromInt(minLen);

        var cov : Float = 0.0;
        var var1 : Float = 0.0;
        var var2 : Float = 0.0;

        for (i in Iter.range(0, minLen - 1)) {
          let d1 = sig1[i] - mean1;
          let d2 = sig2[i] - mean2;
          cov += d1 * d2;
          var1 += d1 * d1;
          var2 += d2 * d2;
        };

        let denom = Float.sqrt(var1 * var2);
        if (denom == 0.0) { return ?0.0 };

        ?(cov / denom)
      };
      case _ { null };
    }
  };

  // ── SUB-MODEL: ARCHETYPE ───────────────────────────────────────────

  /// Match a pattern to known archetypes
  public func match_archetype(patternId : Nat) : async ?Archetype {
    for (i in Iter.range(0, patterns.size() - 1)) {
      let p = patterns.get(i);
      if (p.id == patternId and p.active) {
        let arch = classifyArchetype(p);
        if (arch != p.archetype) {
          patterns.put(i, {
            id = p.id;
            patternClass = p.patternClass;
            signature = p.signature;
            frequency = p.frequency;
            strength = p.strength;
            entropy = p.entropy;
            archetype = arch;
            sourceIds = p.sourceIds;
            timestamp = Time.now();
            active = true;
          });
        };
        return arch;
      };
    };
    null
  };

  /// Synthesize patterns into higher-order pattern
  public func synthesize_patterns(patternIds : [Nat]) : async ?Pattern {
    if (patternIds.size() < 2) { return null };

    let found = Buffer.Buffer<Pattern>(patternIds.size());
    for (pid in patternIds.vals()) {
      for (p in patterns.vals()) {
        if (p.id == pid and p.active) { found.add(p) };
      };
    };

    if (found.size() < 2) { return null };

    // Merge signatures with φ-weighting
    var totalWeight : Float = 0.0;
    var weightedSum = Buffer.Buffer<Float>(16);
    var i : Nat = 0;
    for (p in found.vals()) {
      let weight = Float.pow(PHI, -Float.fromInt(i));
      totalWeight += weight;
      for (j in Iter.range(0, p.signature.size() - 1)) {
        if (j >= weightedSum.size()) {
          weightedSum.add(p.signature[j] * weight);
        } else {
          let current = weightedSum.get(j);
          weightedSum.put(j, current + p.signature[j] * weight);
        };
      };
      i += 1;
    };

    // Normalize
    for (k in Iter.range(0, weightedSum.size() - 1)) {
      let v = weightedSum.get(k);
      weightedSum.put(k, v / totalWeight);
    };

    // Calculate synthesized properties
    var strengthSum : Float = 0.0;
    var entropySum : Float = 0.0;
    for (p in found.vals()) {
      strengthSum += p.strength;
      entropySum += p.entropy;
    };

    let id = nextPatternId;
    nextPatternId += 1;

    let synthesized : Pattern = {
      id;
      patternClass = #Emergent;
      signature = Buffer.toArray(weightedSum);
      frequency = PHI_INVERSE;  // Emergent frequency
      strength = strengthSum / Float.fromInt(found.size()) * PHI_INVERSE;
      entropy = entropySum / Float.fromInt(found.size());
      archetype = ?#Quintessence;  // Synthesis produces quintessence
      sourceIds = patternIds;
      timestamp = Time.now();
      active = true;
    };

    patterns.add(synthesized);
    cogLog.add("ARCHETYPE: Synthesized pattern #" # Nat.toText(id) #
               " from " # Nat.toText(patternIds.size()) # " sources");

    ?synthesized
  };

  // ── Memory Management ──────────────────────────────────────────────

  /// Create a memory trace for a pattern
  public func memorize_pattern(patternId : Nat) : async ?MemoryTrace {
    for (p in patterns.vals()) {
      if (p.id == patternId and p.active) {
        let id = nextMemoryId;
        nextMemoryId += 1;

        let memory : MemoryTrace = {
          id;
          patternId;
          activation = 1.0;
          associations = [];
          decayRate = PHI_INVERSE / 1000.0;  // Slow decay
          lastAccess = Time.now();
          strength = p.strength;
        };

        memories.add(memory);
        cogLog.add("COGNITUM: Memorized pattern #" # Nat.toText(patternId) #
                   " as memory #" # Nat.toText(id));
        return ?memory;
      };
    };
    null
  };

  /// Recall patterns from memory
  public func recall(query : [Float]) : async [MemoryTrace] {
    let recalled = Buffer.Buffer<MemoryTrace>(8);

    for (m in memories.vals()) {
      // Find the associated pattern
      for (p in patterns.vals()) {
        if (p.id == m.patternId) {
          // Calculate similarity
          let similarity = cosineSimilarity(query, p.signature);
          if (similarity > PHI_INVERSE) {
            recalled.add(m);
          };
        };
      };
    };

    // Sort by activation (simplified: just return as-is)
    Buffer.toArray(recalled)
  };

  // ── Helper Functions ───────────────────────────────────────────────

  type PeriodicResult = {
    period      : Float;
    amplitude   : Float;
    correlation : Float;
  };

  func detectPeriodicity(data : Buffer.Buffer<[Float]>) : ?PeriodicResult {
    if (data.size() < 4) { return null };

    // Simplified autocorrelation on first dimension
    let values = Buffer.Buffer<Float>(data.size());
    for (d in data.vals()) {
      if (d.size() > 0) { values.add(d[0]) };
    };

    if (values.size() < 4) { return null };

    var bestLag : Nat = 1;
    var bestCorr : Float = 0.0;

    for (lag in Iter.range(1, values.size() / 2)) {
      var corr : Float = 0.0;
      var count : Nat = 0;
      for (i in Iter.range(0, values.size() - lag - 1)) {
        corr += values.get(i) * values.get(i + lag);
        count += 1;
      };
      if (count > 0) {
        corr := corr / Float.fromInt(count);
        if (corr > bestCorr) {
          bestCorr := corr;
          bestLag := lag;
        };
      };
    };

    if (bestCorr < PHI_INVERSE) { return null };

    // Calculate amplitude
    var sumSquares : Float = 0.0;
    for (v in values.vals()) { sumSquares += v * v };
    let amplitude = Float.sqrt(sumSquares / Float.fromInt(values.size()));

    ?{
      period = Float.fromInt(bestLag);
      amplitude;
      correlation = bestCorr;
    }
  };

  type HarmonicResult = {
    ratio      : Float;
    baseFreq   : Float;
    confidence : Float;
  };

  func detectHarmonic(data : Buffer.Buffer<[Float]>) : ?HarmonicResult {
    if (data.size() < 4) { return null };

    // Look for Pythagorean ratios in the data
    let values = Buffer.Buffer<Float>(data.size());
    for (d in data.vals()) {
      if (d.size() > 0) { values.add(Float.abs(d[0])) };
    };

    if (values.size() < 2) { return null };

    var foundRatio : Float = 0.0;
    var confidence : Float = 0.0;

    // Check for common ratios between consecutive values
    let ratios = [OCTAVE, FIFTH, FOURTH, MAJOR_THIRD, PHI];
    for (ratio in ratios.vals()) {
      var matchCount : Nat = 0;
      for (i in Iter.range(0, values.size() - 2)) {
        let v1 = values.get(i);
        let v2 = values.get(i + 1);
        if (v1 > 0.001 and v2 > 0.001) {
          let actualRatio = Float.max(v1, v2) / Float.min(v1, v2);
          if (Float.abs(actualRatio - ratio) < 0.1) {
            matchCount += 1;
          };
        };
      };

      let matchRate = Float.fromInt(matchCount) / Float.fromInt(values.size());
      if (matchRate > confidence) {
        confidence := matchRate;
        foundRatio := ratio;
      };
    };

    if (confidence < PHI_INVERSE / 2.0) { return null };

    ?{
      ratio = foundRatio;
      baseFreq = 1.0;  // Normalized
      confidence;
    }
  };

  func calculateEntropy(data : Buffer.Buffer<[Float]>) : Float {
    if (data.size() == 0) { return 0.0 };

    // Simplified: entropy of first dimension
    let values = Buffer.Buffer<Float>(data.size());
    for (d in data.vals()) {
      if (d.size() > 0) { values.add(d[0]) };
    };

    if (values.size() == 0) { return 0.0 };

    // Bin the values and calculate histogram entropy
    let numBins : Nat = 10;
    let bins = Array.init<Nat>(numBins, 0);

    var minVal : Float = values.get(0);
    var maxVal : Float = values.get(0);
    for (v in values.vals()) {
      if (v < minVal) { minVal := v };
      if (v > maxVal) { maxVal := v };
    };

    let range = maxVal - minVal;
    if (range == 0.0) { return 0.0 };

    for (v in values.vals()) {
      var binIdx = Int.abs(Float.toInt((v - minVal) / range * Float.fromInt(numBins - 1)));
      if (binIdx >= numBins) { binIdx := numBins - 1 };
      bins[binIdx] := bins[binIdx] + 1;
    };

    // Calculate entropy
    var entropy : Float = 0.0;
    let total = Float.fromInt(values.size());
    for (count in bins.vals()) {
      if (count > 0) {
        let p = Float.fromInt(count) / total;
        entropy -= p * Float.log(p) / LN2;
      };
    };

    entropy
  };

  func mapToArchetype(strength : Float, class_ : PatternClass) : ?Archetype {
    switch (class_) {
      case (#Periodic) { if (strength > PHI_INVERSE) { ?#Heptad } else { ?#Duality } };
      case (#Harmonic) { ?#Hexad };
      case (#Fractal) { ?#Octad };
      case (#Emergent) { ?#Quintessence };
      case (#Archetypal) { ?#Unity };
      case (#Noise) { null };
    }
  };

  func ratioToArchetype(ratio : Float) : ?Archetype {
    if (Float.abs(ratio - UNISON) < 0.1) { return ?#Unity };
    if (Float.abs(ratio - OCTAVE) < 0.1) { return ?#Octad };
    if (Float.abs(ratio - FIFTH) < 0.1) { return ?#Trinity };
    if (Float.abs(ratio - FOURTH) < 0.1) { return ?#Quaternity };
    if (Float.abs(ratio - PHI) < 0.1) { return ?#Quintessence };
    ?#Hexad
  };

  func classifyArchetype(p : Pattern) : ?Archetype {
    // Based on pattern properties
    if (p.entropy < 1.0 and p.strength > PHI_INVERSE) {
      return ?#Unity;
    };
    if (p.frequency > 0.5 and p.frequency < 2.0) {
      return ?#Duality;
    };
    p.archetype  // Keep existing if no better match
  };

  func cosineSimilarity(a : [Float], b : [Float]) : Float {
    let len = Nat.min(a.size(), b.size());
    if (len == 0) { return 0.0 };

    var dot : Float = 0.0;
    var normA : Float = 0.0;
    var normB : Float = 0.0;

    for (i in Iter.range(0, len - 1)) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    };

    let denom = Float.sqrt(normA) * Float.sqrt(normB);
    if (denom == 0.0) { return 0.0 };

    dot / denom
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_patterns() : async [Pattern] {
    let active = Buffer.Buffer<Pattern>(patterns.size());
    for (p in patterns.vals()) {
      if (p.active) { active.add(p) };
    };
    Buffer.toArray(active)
  };

  public query func list_memories() : async [MemoryTrace] {
    Buffer.toArray(memories)
  };

  public query func cognitive_state() : async {
    state       : CognitiveState;
    patterns    : Nat;
    memories    : Nat;
    dataPoints  : Nat;
    epoch       : Nat;
  } {
    var activePatterns : Nat = 0;
    for (p in patterns.vals()) { if (p.active) { activePatterns += 1 } };

    let state = if (dataStream.size() > 100) { #Processing }
                else if (activePatterns > memories.size()) { #Integrating }
                else if (memories.size() > 0) { #Reflecting }
                else { #Receptive };

    {
      state;
      patterns = activePatterns;
      memories = memories.size();
      dataPoints = dataStream.size();
      epoch = cognitiveEpoch;
    }
  };

  public query func get_cognitive_log() : async [Text] {
    Buffer.toArray(cogLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "COGNITUM" };

  public query func designation() : async Text {
    "Cognitive Pattern Recognition — Patterns are the language of the universe"
  };

  public func register() : async Text {
    "COGNITUM registered. Capabilities: [pattern-detection, archetype-matching, memory, synthesis]."
  };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    patterns  : Nat;
    memories  : Nat;
    timestamp : Int;
  } {
    var activePatterns : Nat = 0;
    var strengthSum : Float = 0.0;
    for (p in patterns.vals()) {
      if (p.active) {
        activePatterns += 1;
        strengthSum += p.strength;
      };
    };

    let health = if (activePatterns == 0) { 0.5 }
                 else { strengthSum / Float.fromInt(activePatterns) };

    {
      status = if (health > PHI_INVERSE) "COGNITION_CLEAR" else "COGNITION_FUZZY";
      health;
      patterns = activePatterns;
      memories = memories.size();
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    cognitiveEpoch += 1;
    // Strengthen weak patterns
    var strengthened : Nat = 0;
    for (i in Iter.range(0, patterns.size() - 1)) {
      let p = patterns.get(i);
      if (p.active and p.strength < PHI_INVERSE) {
        patterns.put(i, {
          id = p.id;
          patternClass = p.patternClass;
          signature = p.signature;
          frequency = p.frequency;
          strength = PHI_INVERSE;
          entropy = p.entropy;
          archetype = p.archetype;
          sourceIds = p.sourceIds;
          timestamp = Time.now();
          active = true;
        });
        strengthened += 1;
      };
    };
    "COGNITUM heal: " # Nat.toText(strengthened) # " pattern(s) strengthened."
  };

  public query func report_status() : async Text {
    var ap : Nat = 0;
    for (p in patterns.vals()) { if (p.active) { ap += 1 } };
    "COGNITUM | patterns=" # Nat.toText(ap) #
    " memories=" # Nat.toText(memories.size()) #
    " data=" # Nat.toText(dataStream.size()) #
    " epoch=" # Nat.toText(cognitiveEpoch)
  };
};
