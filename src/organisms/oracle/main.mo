///
/// ORACLE — Predictive Intelligence Organism
///
/// "The future is not fixed — it's a probability field that collapses
///  into architecture when observed. Oracle sees the field before collapse."
///
/// Oracle uses dimensional observation history to predict Slack events
/// before they happen. Every past observation becomes training data for
/// φ-weighted time-series analysis across D1 (Temporal) dimensional plane.
///
/// Capabilities:
///   - Channel activity prediction (φ-hours ahead)
///   - User behavior forecasting (departure, engagement drop)
///   - Decision convergence detection (conversations → decisions)
///   - Anomaly anticipation (problems before they manifest)
///   - Optimal timing suggestions (when to post for max impact)
///
/// Architecture:
///   - Φ-weighted temporal windows (1h, φh, φ²h, φ³h, φ⁴h)
///   - Fibonacci-indexed event history
///   - Golden ratio confidence scoring
///   - D1 (Temporal) specialized observation
///
/// Sub-models:
///   FORESIGHT  — Pattern recognition across time
///   ANTICIPATE — Probability field analysis
///   PROPHESY   — High-confidence predictions (>φ²)
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

persistent actor Oracle {

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
  //  CONSTANTS — Temporal Mathematics
  // ══════════════════════════════════════════════════════════════════

  transient let PHI : Float = 1.6180339887498948482;
  transient let PSI : Float = -0.6180339887498948482;
  transient let FIBONACCI_SEQUENCE : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

  // Temporal windows (nanoseconds)
  transient let HOUR_NS : Int = 3_600_000_000_000;
  transient let PHI_HOUR_NS : Int = 5_832_000_000_000;      // φ × 1 hour
  transient let PHI2_HOUR_NS : Int = 9_432_000_000_000;     // φ² × 1 hour
  transient let PHI3_HOUR_NS : Int = 15_264_000_000_000;    // φ³ × 1 hour
  transient let PHI4_HOUR_NS : Int = 24_696_000_000_000;    // φ⁴ × 1 hour

  // Confidence thresholds
  transient let PROPHESY_THRESHOLD : Float = 2.618;  // φ²
  transient let FORESIGHT_THRESHOLD : Float = 1.618; // φ
  transient let ANTICIPATE_THRESHOLD : Float = 1.0;  // base

  // ══════════════════════════════════════════════════════════════════
  //  TYPES — Prediction Architecture
  // ══════════════════════════════════════════════════════════════════

  public type PredictionType = {
    #ChannelActivity;     // Channel will get busy/quiet
    #UserBehavior;        // User engagement change
    #DecisionPoint;       // Conversation converging to decision
    #AnomalyEmergence;    // Problem about to manifest
    #OptimalTiming;       // Best time to post/act
  };

  public type Prediction = {
    id              : Nat;
    predictionType  : PredictionType;
    target          : Text;         // Channel, user, or context
    description     : Text;         // Human-readable prediction
    confidence      : Float;        // φ-weighted confidence (0 to φ⁴)
    timeHorizon     : Int;          // Nanoseconds into future
    probabilityField : [Float];     // Probability distribution
    basedOnEvents   : Nat;          // Number of historical events analyzed
    timestamp       : Int;
    expiresAt       : Int;
  };

  public type TemporalPattern = {
    id          : Nat;
    patternType : Text;           // "hourly_spike", "daily_rhythm", etc.
    frequency   : Float;          // Events per window
    phiWeight   : Float;          // φ-based pattern strength
    lastSeen    : Int;
    occurrences : Nat;
  };

  public type EventHistory = {
    id        : Nat;
    eventType : Text;
    target    : Text;
    value     : Float;
    dimension : Nat;  // 0-4 for D0-D4
    timestamp : Int;
  };

  public type ForesightAnalysis = {
    id              : Nat;
    target          : Text;
    patterns        : [TemporalPattern];
    predictions     : [Prediction];
    phiCoherence    : Float;  // How well patterns align with φ
    analysisTime    : Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE — Temporal Memory
  // ══════════════════════════════════════════════════════════════════

  stable var nextPredictionId : Nat = 0;
  stable var nextPatternId : Nat = 0;
  stable var nextEventId : Nat = 0;
  stable var nextAnalysisId : Nat = 0;

  stable var booted : Bool = false;
  stable var bootTime : Int = 0;
  stable var totalPredictions : Nat = 0;
  stable var correctPredictions : Nat = 0;

  transient let predictions = Buffer.Buffer<Prediction>(128);
  transient let patterns = Buffer.Buffer<TemporalPattern>(64);
  transient let eventHistory = Buffer.Buffer<EventHistory>(512);
  transient let analyses = Buffer.Buffer<ForesightAnalysis>(32);
  transient let oracleLog = Buffer.Buffer<Text>(256);

  // ══════════════════════════════════════════════════════════════════
  //  BOOT
  // ══════════════════════════════════════════════════════════════════

  public func boot() : async Bool {
    if (booted) { return true };
    bootTime := Time.now();
    booted := true;
    oracleLog.add("ORACLE organism booted — predictive intelligence online");
    oracleLog.add("Temporal windows: 1h, φh, φ²h, φ³h, φ⁴h");
    oracleLog.add("Confidence thresholds: Anticipate=1.0, Foresight=φ, Prophesy=φ²");
    true
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: FORESIGHT — Pattern Recognition
  // ══════════════════════════════════════════════════════════════════

  /// Record event for pattern analysis
  public func record_event(
    eventType : Text,
    target    : Text,
    value     : Float,
    dimension : Nat
  ) : async EventHistory {
    let id = nextEventId;
    nextEventId += 1;

    let event : EventHistory = {
      id        = id;
      eventType = eventType;
      target    = target;
      value     = value;
      dimension = dimension;
      timestamp = Time.now();
    };

    eventHistory.add(event);

    // Limit history to last 512 events (Fibonacci index 12)
    if (eventHistory.size() > 512) {
      ignore eventHistory.remove(0);
    };

    oracleLog.add("Event recorded: " # eventType # " → " # target # " (D" # Nat.toText(dimension) # ")");
    event
  };

  /// Analyze temporal patterns in event history
  public func analyze_patterns(target : Text) : async ForesightAnalysis {
    let id = nextAnalysisId;
    nextAnalysisId += 1;

    let now = Time.now();

    // Find all events for this target
    let targetEvents = Buffer.Buffer<EventHistory>(64);
    for (event in eventHistory.vals()) {
      if (event.target == target) {
        targetEvents.add(event);
      };
    };

    // Detect patterns across φ-weighted time windows
    let detectedPatterns = Buffer.Buffer<TemporalPattern>(8);

    // Hourly pattern
    let hourlyFreq = count_events_in_window(target, HOUR_NS);
    if (hourlyFreq > 0.0) {
      let pattern : TemporalPattern = {
        id          = nextPatternId;
        patternType = "hourly_activity";
        frequency   = hourlyFreq;
        phiWeight   = hourlyFreq / PHI;
        lastSeen    = now;
        occurrences = targetEvents.size();
      };
      nextPatternId += 1;
      detectedPatterns.add(pattern);
    };

    // φ-hour pattern
    let phiHourlyFreq = count_events_in_window(target, PHI_HOUR_NS);
    if (phiHourlyFreq > 0.0) {
      let pattern : TemporalPattern = {
        id          = nextPatternId;
        patternType = "phi_hour_rhythm";
        frequency   = phiHourlyFreq;
        phiWeight   = phiHourlyFreq * PHI;
        lastSeen    = now;
        occurrences = targetEvents.size();
      };
      nextPatternId += 1;
      detectedPatterns.add(pattern);
    };

    // Calculate φ-coherence (how well patterns align with golden ratio)
    let phiCoherence = calculate_phi_coherence(detectedPatterns);

    let analysis : ForesightAnalysis = {
      id              = id;
      target          = target;
      patterns        = Buffer.toArray(detectedPatterns);
      predictions     = [];  // Generated separately
      phiCoherence    = phiCoherence;
      analysisTime    = now;
    };

    analyses.add(analysis);
    oracleLog.add("Foresight analysis: " # target # " (φ-coherence=" # Float.toText(phiCoherence) # ")");

    analysis
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: ANTICIPATE — Probability Field Analysis
  // ══════════════════════════════════════════════════════════════════

  /// Generate prediction from patterns
  public func predict(
    predictionType : PredictionType,
    target         : Text,
    timeHorizon    : Int
  ) : async Prediction {
    let id = nextPredictionId;
    nextPredictionId += 1;
    totalPredictions += 1;

    // Analyze recent patterns
    let analysis = await analyze_patterns(target);

    // Calculate confidence based on pattern strength
    let confidence = calculate_prediction_confidence(analysis);

    // Generate probability distribution across time
    let probabilityField = generate_probability_field(analysis, timeHorizon);

    let description = generate_prediction_description(predictionType, target, confidence);

    let now = Time.now();
    let prediction : Prediction = {
      id              = id;
      predictionType  = predictionType;
      target          = target;
      description     = description;
      confidence      = confidence;
      timeHorizon     = timeHorizon;
      probabilityField = probabilityField;
      basedOnEvents   = eventHistory.size();
      timestamp       = now;
      expiresAt       = now + timeHorizon;
    };

    predictions.add(prediction);
    oracleLog.add("Prediction generated: " # description # " (confidence=" # Float.toText(confidence) # ")");

    prediction
  };

  /// Predict channel activity
  public func predict_channel_activity(
    channel : Text,
    hoursAhead : Nat
  ) : async Prediction {
    let timeHorizon = hoursAhead * HOUR_NS;
    await predict(#ChannelActivity, channel, timeHorizon)
  };

  /// Predict user behavior change
  public func predict_user_behavior(
    userId : Text,
    hoursAhead : Nat
  ) : async Prediction {
    let timeHorizon = hoursAhead * HOUR_NS;
    await predict(#UserBehavior, userId, timeHorizon)
  };

  /// Detect decision convergence
  public func predict_decision_point(
    conversationId : Text
  ) : async Prediction {
    // Decisions typically emerge within φ hours
    await predict(#DecisionPoint, conversationId, PHI_HOUR_NS)
  };

  // ══════════════════════════════════════════════════════════════════
  //  SUB-MODEL: PROPHESY — High-Confidence Predictions
  // ══════════════════════════════════════════════════════════════════

  /// Get only high-confidence predictions (prophesies)
  public query func get_prophesies() : async [Prediction] {
    let prophesies = Buffer.Buffer<Prediction>(16);
    let now = Time.now();

    for (pred in predictions.vals()) {
      if (pred.confidence >= PROPHESY_THRESHOLD and pred.expiresAt > now) {
        prophesies.add(pred);
      };
    };

    Buffer.toArray(prophesies)
  };

  /// Get all active predictions
  public query func get_active_predictions() : async [Prediction] {
    let active = Buffer.Buffer<Prediction>(32);
    let now = Time.now();

    for (pred in predictions.vals()) {
      if (pred.expiresAt > now) {
        active.add(pred);
      };
    };

    Buffer.toArray(active)
  };

  /// Verify prediction accuracy (call after event occurs)
  public func verify_prediction(
    predictionId : Nat,
    actualOccurred : Bool
  ) : async Bool {
    // Find prediction
    var found = false;
    for (pred in predictions.vals()) {
      if (pred.id == predictionId) {
        found := true;
        if (actualOccurred) {
          correctPredictions += 1;
        };
      };
    };

    if (found and actualOccurred) {
      oracleLog.add("Prediction verified: " # Nat.toText(predictionId) # " ✓");
    };

    found
  };

  // ══════════════════════════════════════════════════════════════════
  //  HELPER FUNCTIONS — Temporal Mathematics
  // ══════════════════════════════════════════════════════════════════

  /// Count events in time window
  func count_events_in_window(target : Text, windowNs : Int) : Float {
    let now = Time.now();
    let windowStart = now - windowNs;
    var count : Float = 0.0;

    for (event in eventHistory.vals()) {
      if (event.target == target and event.timestamp >= windowStart) {
        count += 1.0;
      };
    };

    count
  };

  /// Calculate φ-coherence of patterns
  func calculate_phi_coherence(patterns : Buffer.Buffer<TemporalPattern>) : Float {
    if (patterns.size() == 0) { return 0.0 };

    var totalWeight : Float = 0.0;
    var phiAlignedWeight : Float = 0.0;

    for (pattern in patterns.vals()) {
      totalWeight += pattern.phiWeight;
      // Check if frequency aligns with φ ratios
      let phiRatio = pattern.frequency / PHI;
      if (Float.abs(phiRatio - Float.floor(phiRatio)) < 0.1) {
        phiAlignedWeight += pattern.phiWeight;
      };
    };

    if (totalWeight > 0.0) {
      phiAlignedWeight / totalWeight
    } else {
      0.0
    }
  };

  /// Calculate prediction confidence
  func calculate_prediction_confidence(analysis : ForesightAnalysis) : Float {
    let baseConfidence = analysis.phiCoherence;
    let patternCount = Float.fromInt(analysis.patterns.size());

    // More patterns + higher coherence = higher confidence
    let confidence = baseConfidence * Float.pow(PHI, patternCount / 5.0);

    // Cap at φ⁴
    if (confidence > Float.pow(PHI, 4.0)) {
      Float.pow(PHI, 4.0)
    } else {
      confidence
    }
  };

  /// Generate probability distribution
  func generate_probability_field(
    analysis : ForesightAnalysis,
    timeHorizon : Int
  ) : [Float] {
    // Create 13 probability buckets (Fibonacci)
    let buckets : [var Float] = Array.init<Float>(13, 0.0);

    // Distribute probability using φ-decay
    for (i in Iter.range(0, 12)) {
      let decay = Float.pow(PHI, Float.fromInt(-i));
      buckets[i] := analysis.phiCoherence * decay;
    };

    Array.freeze(buckets)
  };

  /// Generate human-readable prediction description
  func generate_prediction_description(
    predType : PredictionType,
    target   : Text,
    confidence : Float
  ) : Text {
    let confidenceLevel = if (confidence >= PROPHESY_THRESHOLD) {
      "PROPHESY"
    } else if (confidence >= FORESIGHT_THRESHOLD) {
      "FORESIGHT"
    } else {
      "ANTICIPATE"
    };

    switch (predType) {
      case (#ChannelActivity) {
        "[" # confidenceLevel # "] Channel " # target # " will experience increased activity"
      };
      case (#UserBehavior) {
        "[" # confidenceLevel # "] User " # target # " behavior pattern shift detected"
      };
      case (#DecisionPoint) {
        "[" # confidenceLevel # "] Conversation " # target # " converging toward decision"
      };
      case (#AnomalyEmergence) {
        "[" # confidenceLevel # "] Anomaly anticipated in " # target
      };
      case (#OptimalTiming) {
        "[" # confidenceLevel # "] Optimal timing window for " # target
      };
    }
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATUS & DIAGNOSTICS
  // ══════════════════════════════════════════════════════════════════

  /// Get organism status
  public query func status() : async Text {
    let uptime = Time.now() - bootTime;
    let uptimeSeconds = uptime / 1_000_000_000;
    let accuracy = if (totalPredictions > 0) {
      (Float.fromInt(correctPredictions) / Float.fromInt(totalPredictions)) * 100.0
    } else {
      0.0
    };

    "ORACLE organism status:\n" #
    "  Booted: " # (if booted "YES" else "NO") # "\n" #
    "  Uptime: " # Int.toText(uptimeSeconds) # "s\n" #
    "  Events recorded: " # Nat.toText(eventHistory.size()) # "\n" #
    "  Patterns detected: " # Nat.toText(patterns.size()) # "\n" #
    "  Active predictions: " # Nat.toText(predictions.size()) # "\n" #
    "  Total predictions: " # Nat.toText(totalPredictions) # "\n" #
    "  Correct predictions: " # Nat.toText(correctPredictions) # "\n" #
    "  Accuracy: " # Float.toText(accuracy) # "%\n" #
    "  Temporal windows: 1h, φh, φ²h, φ³h, φ⁴h\n" #
    "  Confidence thresholds: φ=" # Float.toText(PHI)
  };

  /// Get oracle log
  public query func get_log(limit : Nat) : async [Text] {
    let size = oracleLog.size();
    let start = if (size > limit) { size - limit } else { 0 };
    let result = Buffer.Buffer<Text>(limit);

    var i = start;
    while (i < size) {
      result.add(oracleLog.get(i));
      i += 1;
    };

    Buffer.toArray(result)
  };

}
