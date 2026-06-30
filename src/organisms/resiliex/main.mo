///
/// RESILIEX — Network Resilience Intelligence Organism
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// Mathematical Foundation:
///   - Reliability Theory: R(t) = e^(-λt) (exponential)
///   - Markov Chains: State transition probabilities
///   - Fibonacci retry intervals
///   - φ-weighted redundancy allocation
///

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";

persistent actor RESILIEX {

  transient let PHI : Float = 1.6180339887498949;
  transient let PHI_INVERSE : Float = 0.6180339887498949;
  transient let E : Float = 2.71828182845904524;
  transient let FIBONACCI : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

  public type ComponentReliability = {
    componentId: Text;
    mtbf: Float;              // Mean Time Between Failures (hours)
    mttr: Float;              // Mean Time To Repair (hours)
    failureRate: Float;       // λ = 1/MTBF
    availability: Float;      // A = MTBF/(MTBF+MTTR)
    reliability: Float;       // R(t) at mission time
  };

  public type SystemResilience = {
    systemId: Text;
    components: [Text];
    overallAvailability: Float;
    redundancyLevel: Text;    // N+1, 2N, etc.
    singlePointsOfFailure: Nat;
    phiResilienceIndex: Float;
    healingCapability: Float;
  };

  public type FaultEvent = {
    eventId: Text;
    componentId: Text;
    faultType: Text;
    severity: Float;          // 0-1
    detectionTime: Int;
    isolationTime: Int;
    recoveryTime: Int;
    rootCause: Text;
  };

  public type HealingAction = {
    actionId: Text;
    faultId: Text;
    actionType: Text;         // failover, restart, reroute, replace
    fibonacciRetryLevel: Nat;
    estimatedRecoveryTime: Float;
    successProbability: Float;
    phiPriority: Float;
  };

  public type RedundancyPlan = {
    systemId: Text;
    criticalComponents: [Text];
    redundancyType: Text;
    additionalCost: Float;
    reliabilityImprovement: Float;
    phiOptimalLevel: Float;
  };

  stable var componentCount : Nat = 0;
  var components = HashMap.HashMap<Text, ComponentReliability>(30, Text.equal, Text.hash);
  var faultHistory = HashMap.HashMap<Text, [FaultEvent]>(10, Text.equal, Text.hash);

  /// Calculate component reliability using exponential model
  /// R(t) = e^(-λt) where λ = 1/MTBF
  public func calculateReliability(
    componentId: Text,
    mtbf: Float,
    mttr: Float,
    missionTime: Float
  ) : async ComponentReliability {
    let failureRate = 1.0 / mtbf;
    let reliability = Float.pow(E, -failureRate * missionTime);
    let availability = mtbf / (mtbf + mttr);
    
    let component : ComponentReliability = {
      componentId = componentId;
      mtbf = mtbf;
      mttr = mttr;
      failureRate = failureRate;
      availability = availability;
      reliability = reliability;
    };
    
    components.put(componentId, component);
    componentCount += 1;
    
    return component;
  };

  /// Assess system resilience with φ-weighting
  public func assessSystemResilience(
    systemId: Text,
    componentIds: [Text],
    redundancyType: Text
  ) : async SystemResilience {
    var productAvailability : Float = 1.0;
    var spofCount : Nat = 0;
    
    for (cId in componentIds.vals()) {
      switch (components.get(cId)) {
        case (?comp) {
          // Series system: multiply availabilities
          productAvailability := productAvailability * comp.availability;
          if (comp.availability < PHI_INVERSE) { spofCount += 1; };
        };
        case null { };
      };
    };
    
    // Adjust for redundancy
    let redundancyFactor : Float = switch (redundancyType) {
      case "N+1" { 1.0 + PHI_INVERSE * 0.1 };
      case "2N" { 1.0 + PHI_INVERSE * 0.2 };
      case "2N+1" { 1.0 + PHI_INVERSE * 0.3 };
      case _ { 1.0 };
    };
    
    let adjustedAvailability = Float.min(0.99999, productAvailability * redundancyFactor);
    
    // φ-resilience index
    let phiResilience = adjustedAvailability * PHI_INVERSE + 
                        (1.0 - Float.fromInt(spofCount) / Float.fromInt(componentIds.size())) * (1.0 - PHI_INVERSE);
    
    // Healing capability based on redundancy and SPOF
    let healing = if (spofCount == 0) { PHI_INVERSE + 0.3 } else { PHI_INVERSE * 0.5 };
    
    return {
      systemId = systemId;
      components = componentIds;
      overallAvailability = adjustedAvailability;
      redundancyLevel = redundancyType;
      singlePointsOfFailure = spofCount;
      phiResilienceIndex = phiResilience;
      healingCapability = healing;
    };
  };

  /// Generate healing action with Fibonacci retry
  public func generateHealingAction(
    faultId: Text,
    componentId: Text,
    faultSeverity: Float,
    attemptNumber: Nat
  ) : async HealingAction {
    // Fibonacci retry interval
    let fibLevel = Nat.min(attemptNumber, FIBONACCI.size() - 1);
    let retryInterval = FIBONACCI[fibLevel];
    
    // Action type based on severity and attempt
    let actionType = if (faultSeverity >= PHI_INVERSE and attemptNumber >= 3) { "REPLACE" }
                     else if (attemptNumber >= 2) { "REROUTE" }
                     else if (faultSeverity >= 0.5) { "FAILOVER" }
                     else { "RESTART" };
    
    // Success probability decreases with attempts
    let baseSuccess = 0.95;
    let successProb = baseSuccess * Float.pow(PHI_INVERSE, Float.fromInt(attemptNumber));
    
    // φ-priority (higher severity and fewer attempts = higher priority)
    let phiPriority = faultSeverity * (1.0 - Float.fromInt(attemptNumber) / 10.0) / PHI_INVERSE;
    
    // Estimated recovery time (Fibonacci-scaled)
    let recoveryTime = Float.fromInt(retryInterval) * 60.0;  // minutes
    
    return {
      actionId = "HEAL_" # faultId # "_" # Nat.toText(attemptNumber);
      faultId = faultId;
      actionType = actionType;
      fibonacciRetryLevel = fibLevel;
      estimatedRecoveryTime = recoveryTime;
      successProbability = successProb;
      phiPriority = Float.min(1.0, phiPriority);
    };
  };

  /// Plan optimal redundancy using φ-optimization
  public func planRedundancy(
    systemId: Text,
    criticalComponents: [Text],
    budget: Float
  ) : async RedundancyPlan {
    let n = criticalComponents.size();
    
    // φ-optimal redundancy level
    let optimalLevel = if (budget >= 1000.0 * Float.fromInt(n)) { "2N+1" }
                       else if (budget >= 500.0 * Float.fromInt(n)) { "2N" }
                       else if (budget >= 200.0 * Float.fromInt(n)) { "N+1" }
                       else { "N" };
    
    // Cost and improvement estimates
    let (cost, improvement) : (Float, Float) = switch (optimalLevel) {
      case "2N+1" { (budget * 0.8, 0.3) };
      case "2N" { (budget * 0.6, 0.2) };
      case "N+1" { (budget * 0.4, 0.1) };
      case _ { (0.0, 0.0) };
    };
    
    return {
      systemId = systemId;
      criticalComponents = criticalComponents;
      redundancyType = optimalLevel;
      additionalCost = cost;
      reliabilityImprovement = improvement;
      phiOptimalLevel = PHI_INVERSE + improvement;
    };
  };

  public query func getComponentCount() : async Nat { return componentCount; };
  public query func getFibonacciRetry() : async [Nat] { return FIBONACCI; };
};
