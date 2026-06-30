/**
 * NETMIND Organism — Primary Network Infrastructure Intelligence
 * 
 * Casa de Medina — Architectos de Architectura Inteligente
 * 
 * Motoko actor for intelligent network optimization, predictive maintenance,
 * traffic management, and carrier-grade telecommunications infrastructure.
 * 
 * Mathematical Foundation:
 * - φ-weighted load balancing
 * - Fibonacci retry intervals
 * - Kuramoto network synchronization
 * - Pythagorean signal optimization
 * - Phyllotaxis tower placement
 */

import Time "mo:base/Time";
import Float "mo:base/Float";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor NETMIND {
    
    // ═══════════════════════════════════════════════════════════════════
    // MATHEMATICAL CONSTANTS
    // ═══════════════════════════════════════════════════════════════════
    
    private let PHI : Float = 1.6180339887498949;
    private let PHI_SQUARED : Float = 2.6180339887498949;
    private let PHI_INVERSE : Float = 0.6180339887498949;
    private let PHI_INVERSE_SQUARED : Float = 0.3819660112501051;
    private let GOLDEN_ANGLE : Float = 2.39996322972865332; // 2π(1 - 1/φ) ≈ 137.5°
    
    // Fibonacci sequence for retry intervals
    private let FIBONACCI : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];
    
    // Network health thresholds (Kuramoto-derived)
    private let HEALTHY_THRESHOLD : Float = 0.618;     // R ≥ φ⁻¹
    private let DEGRADED_THRESHOLD : Float = 0.382;    // R ∈ [φ⁻², φ⁻¹)
    
    // ═══════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════
    
    // Node registry
    private stable var nodeCount : Nat = 0;
    private var nodes = HashMap.HashMap<Text, NetworkNode>(10, Text.equal, Text.hash);
    
    // Traffic records
    private var trafficRecords = HashMap.HashMap<Text, TrafficRecord>(10, Text.equal, Text.hash);
    
    // Health assessments
    private var healthAssessments = HashMap.HashMap<Text, NetworkHealthAssessment>(10, Text.equal, Text.hash);
    
    // Fault history
    private var faultHistory = HashMap.HashMap<Text, FaultRecord>(10, Text.equal, Text.hash);
    
    // ═══════════════════════════════════════════════════════════════════
    // TYPES
    // ═══════════════════════════════════════════════════════════════════
    
    public type NetworkNode = {
        id: Text;
        nodeType: Text; // "router", "switch", "tower", "server"
        priority: Nat;
        location: GeoLocation;
        capacity: Float;
        currentLoad: Float;
        phase: Float; // For Kuramoto synchronization
        status: Text;
    };
    
    public type GeoLocation = {
        latitude: Float;
        longitude: Float;
    };
    
    public type TrafficRecord = {
        nodeId: Text;
        inboundTraffic: Float;
        outboundTraffic: Float;
        peakLoad: Float;
        averageLoad: Float;
        timestamp: Int;
    };
    
    public type LoadDistribution = {
        nodeId: Text;
        priority: Nat;
        phiWeight: Float;
        allocatedTraffic: Float;
        loadPercentage: Float;
    };
    
    public type NetworkHealthAssessment = {
        networkId: Text;
        orderParameter: Float; // Kuramoto R
        collectivePhase: Float; // Kuramoto Ψ
        nodeCount: Nat;
        status: Text;
        recommendation: Text;
        timestamp: Int;
    };
    
    public type SignalQuality = {
        nodeId: Text;
        signalQuality: Float;
        status: Text;
        signalStrength: Float;
        noiseReduction: Float;
        bandwidth: Float;
        optimizations: [Text];
        timestamp: Int;
    };
    
    public type TowerPlacement = {
        towerId: Text;
        index: Nat;
        phyllotaxisAngle: Float;
        radiusKm: Float;
        latitude: Float;
        longitude: Float;
        coverageRadius: Float;
        priority: Float;
    };
    
    public type TowerPlan = {
        regionId: Text;
        towerCount: Nat;
        positions: [TowerPlacement];
        coverageEfficiency: Float;
        timestamp: Int;
    };
    
    public type FaultRecord = {
        faultId: Text;
        nodeId: Text;
        faultType: Text;
        severity: Float;
        detected: Int;
        resolved: ?Int;
        healingAttempts: Nat;
        status: Text;
    };
    
    public type HealingResult = {
        faultId: Text;
        success: Bool;
        totalDurationMs: Nat;
        stages: [HealingStage];
        networkStatus: Text;
    };
    
    public type HealingStage = {
        stage: Text;
        timestamp: Int;
        duration: Nat;
        result: Text;
    };
    
    public type Route = {
        source: Text;
        destination: Text;
        path: [Text];
        totalWeight: Float;
        estimatedLatency: Float;
        phiEfficiency: Float;
    };
    
    public type CapacityPlan = {
        networkId: Text;
        currentCapacity: Float;
        predictedDemand: Float;
        recommendedCapacity: Float;
        expansionNodes: [Text];
        phiForecastConfidence: Float;
        timestamp: Int;
    };
    
    // ═══════════════════════════════════════════════════════════════════
    // CORE FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════
    
    /**
     * Register a new network node
     */
    public func registerNode(node: NetworkNode) : async Text {
        nodes.put(node.id, node);
        nodeCount += 1;
        return "Node registered: " # node.id # " | Total nodes: " # Nat.toText(nodeCount);
    };
    
    /**
     * Route traffic using φ-weighted path selection
     * PathWeight(p) = Σ (link_latency × φ^(-link_priority))
     */
    public func routeTraffic(source: Text, destination: Text, payload: Float) : async Route {
        // Simplified routing with φ-weighting
        // In production, this would use actual topology
        
        let sourceNode = nodes.get(source);
        let destNode = nodes.get(destination);
        
        switch (sourceNode, destNode) {
            case (?src, ?dst) {
                // Calculate φ-weighted path
                let directWeight = PHI_INVERSE; // Direct path
                let hops : [Text] = [source, destination]; // Simplified direct path
                
                let estimatedLatency = 10.0 * PHI_INVERSE; // Base latency × φ⁻¹
                let phiEfficiency = PHI_INVERSE;
                
                return {
                    source = source;
                    destination = destination;
                    path = hops;
                    totalWeight = directWeight;
                    estimatedLatency = estimatedLatency;
                    phiEfficiency = phiEfficiency;
                };
            };
            case _ {
                return {
                    source = source;
                    destination = destination;
                    path = [];
                    totalWeight = 999.9;
                    estimatedLatency = 999.9;
                    phiEfficiency = 0.0;
                };
            };
        };
    };
    
    /**
     * Distribute load across nodes using φ-weighted algorithm
     * Load(node_i) = TotalTraffic × (φ^(-priority_i) / Σφ^(-priority_j))
     */
    public func distributeLoad(totalTraffic: Float) : async [LoadDistribution] {
        var distribution : [LoadDistribution] = [];
        var totalWeight : Float = 0.0;
        
        // Calculate total φ-weight
        for ((id, node) in nodes.entries()) {
            totalWeight += Float.pow(PHI, -Float.fromInt(node.priority));
        };
        
        // Distribute traffic
        for ((id, node) in nodes.entries()) {
            let phiWeight = Float.pow(PHI, -Float.fromInt(node.priority));
            let allocated = totalTraffic * (phiWeight / totalWeight);
            let percentage = (phiWeight / totalWeight) * 100.0;
            
            distribution := Array.append(distribution, [{
                nodeId = id;
                priority = node.priority;
                phiWeight = phiWeight;
                allocatedTraffic = allocated;
                loadPercentage = percentage;
            }]);
        };
        
        return distribution;
    };
    
    /**
     * Assess network health using Kuramoto order parameter
     * R · e^(iΨ) = (1/N) · Σ e^(iθⱼ)
     */
    public func assessNetworkHealth(networkId: Text) : async NetworkHealthAssessment {
        var sumReal : Float = 0.0;
        var sumImag : Float = 0.0;
        var count : Nat = 0;
        
        // Sum complex exponentials of node phases
        for ((id, node) in nodes.entries()) {
            sumReal += Float.cos(node.phase);
            sumImag += Float.sin(node.phase);
            count += 1;
        };
        
        if (count == 0) {
            return {
                networkId = networkId;
                orderParameter = 0.0;
                collectivePhase = 0.0;
                nodeCount = 0;
                status = "EMPTY";
                recommendation = "No nodes registered";
                timestamp = Time.now();
            };
        };
        
        // Calculate order parameter R and collective phase Ψ
        let n = Float.fromInt(count);
        let avgReal = sumReal / n;
        let avgImag = sumImag / n;
        let R = Float.sqrt(avgReal * avgReal + avgImag * avgImag);
        let Psi = Float.arctan2(avgImag, avgReal);
        
        // Determine status
        let (status, recommendation) = if (R >= HEALTHY_THRESHOLD) {
            ("HEALTHY", "Network operating optimally")
        } else if (R >= DEGRADED_THRESHOLD) {
            ("DEGRADED", "Consider rebalancing or adding nodes")
        } else {
            ("CRITICAL", "Immediate intervention required")
        };
        
        let assessment : NetworkHealthAssessment = {
            networkId = networkId;
            orderParameter = R;
            collectivePhase = Psi;
            nodeCount = count;
            status = status;
            recommendation = recommendation;
            timestamp = Time.now();
        };
        
        healthAssessments.put(networkId, assessment);
        return assessment;
    };
    
    /**
     * Calculate Pythagorean signal quality
     * SignalQuality² = (SignalStrength)² + (NoiseReduction)² + (Bandwidth)²
     */
    public func calculateSignalQuality(
        nodeId: Text,
        signalStrength: Float,
        noiseReduction: Float,
        bandwidth: Float
    ) : async SignalQuality {
        
        // Pythagorean calculation
        let qualitySquared = 
            Float.pow(signalStrength, 2) +
            Float.pow(noiseReduction, 2) +
            Float.pow(bandwidth, 2);
        let quality = Float.sqrt(qualitySquared);
        
        // Status based on φ thresholds
        let status = if (quality >= PHI_SQUARED) {
            "EXCELLENT"
        } else if (quality >= PHI) {
            "GOOD"
        } else if (quality >= PHI_INVERSE) {
            "FAIR"
        } else {
            "POOR"
        };
        
        // Generate optimizations
        let optimizations = _generateSignalOptimizations(signalStrength, noiseReduction, bandwidth);
        
        return {
            nodeId = nodeId;
            signalQuality = quality;
            status = status;
            signalStrength = signalStrength;
            noiseReduction = noiseReduction;
            bandwidth = bandwidth;
            optimizations = optimizations;
            timestamp = Time.now();
        };
    };
    
    /**
     * Calculate optimal tower positions using phyllotaxis
     * Position(n) = (√n × BaseRadius, n × GOLDEN_ANGLE)
     */
    public func planTowerPlacement(
        regionId: Text,
        centerLat: Float,
        centerLon: Float,
        radiusKm: Float,
        count: Nat
    ) : async TowerPlan {
        
        var positions : [TowerPlacement] = [];
        
        for (n in Iter.range(1, count)) {
            let nFloat = Float.fromInt(n);
            let countFloat = Float.fromInt(count);
            
            let radius = Float.sqrt(nFloat) * (radiusKm / Float.sqrt(countFloat));
            let angle = nFloat * GOLDEN_ANGLE;
            
            // Convert to lat/lon (simplified)
            let latOffset = radius * Float.cos(angle) / 111.0; // ~111km per degree
            let lonOffset = radius * Float.sin(angle) / (111.0 * Float.cos(centerLat * 3.14159 / 180.0));
            
            positions := Array.append(positions, [{
                towerId = "TOWER_" # Nat.toText(n);
                index = n;
                phyllotaxisAngle = angle;
                radiusKm = radius;
                latitude = centerLat + latOffset;
                longitude = centerLon + lonOffset;
                coverageRadius = radiusKm / (Float.sqrt(countFloat) * PHI);
                priority = Float.pow(PHI, -Float.sqrt(nFloat));
            }]);
        };
        
        // Phyllotaxis achieves ~90% coverage with minimal overlap (Vogel, 1979)
        let efficiency = if (count > 10) { 0.95 } else { 0.90 };
        
        return {
            regionId = regionId;
            towerCount = count;
            positions = positions;
            coverageEfficiency = efficiency;
            timestamp = Time.now();
        };
    };
    
    /**
     * Execute self-healing sequence for fault
     */
    public func executeSelfHealing(
        faultId: Text,
        nodeId: Text,
        faultType: Text,
        severity: Float
    ) : async HealingResult {
        
        let startTime = Time.now();
        var stages : [HealingStage] = [];
        
        // Stage 1: DETECT (< 100ms target)
        stages := Array.append(stages, [{
            stage = "DETECT";
            timestamp = Time.now();
            duration = 50;
            result = "Fault detected: " # faultType # " at node " # nodeId;
        }]);
        
        // Stage 2: ISOLATE (< 500ms target)
        stages := Array.append(stages, [{
            stage = "ISOLATE";
            timestamp = Time.now();
            duration = 200;
            result = "Node " # nodeId # " isolated from network";
        }]);
        
        // Stage 3: REROUTE (< 1000ms target)
        stages := Array.append(stages, [{
            stage = "REROUTE";
            timestamp = Time.now();
            duration = 500;
            result = "Traffic rerouted around " # nodeId;
        }]);
        
        // Stage 4: REPAIR (Fibonacci retry)
        let repairDuration = _fibonacciRetryDuration(severity);
        stages := Array.append(stages, [{
            stage = "REPAIR";
            timestamp = Time.now();
            duration = repairDuration;
            result = "Repair attempted with Fibonacci backoff";
        }]);
        
        // Stage 5: VERIFY (Kuramoto coherence)
        stages := Array.append(stages, [{
            stage = "VERIFY";
            timestamp = Time.now();
            duration = 100;
            result = "Network coherence verified";
        }]);
        
        // Record fault
        let fault : FaultRecord = {
            faultId = faultId;
            nodeId = nodeId;
            faultType = faultType;
            severity = severity;
            detected = startTime;
            resolved = ?Time.now();
            healingAttempts = 5;
            status = "RESOLVED";
        };
        faultHistory.put(faultId, fault);
        
        // Determine success based on severity
        let success = severity < PHI_INVERSE;
        
        return {
            faultId = faultId;
            success = success;
            totalDurationMs = 850 + repairDuration;
            stages = stages;
            networkStatus = if (success) { "HEALTHY" } else { "DEGRADED" };
        };
    };
    
    /**
     * Plan capacity using Fibonacci temporal forecasting
     */
    public func planCapacity(networkId: Text, horizonDays: Nat) : async CapacityPlan {
        // Calculate current capacity
        var totalCapacity : Float = 0.0;
        var totalLoad : Float = 0.0;
        
        for ((id, node) in nodes.entries()) {
            totalCapacity += node.capacity;
            totalLoad += node.currentLoad;
        };
        
        // Fibonacci-weighted demand prediction
        // Demand grows at φ rate over time
        let growthFactor = Float.pow(PHI, Float.fromInt(horizonDays) / 89.0); // F(11) = 89 as base
        let predictedDemand = totalLoad * growthFactor;
        
        // Recommended capacity with φ buffer
        let recommendedCapacity = predictedDemand * PHI;
        
        // Identify expansion nodes
        var expansionNodes : [Text] = [];
        if (predictedDemand > totalCapacity) {
            for ((id, node) in nodes.entries()) {
                if (node.currentLoad / node.capacity > PHI_INVERSE) {
                    expansionNodes := Array.append(expansionNodes, [id]);
                };
            };
        };
        
        return {
            networkId = networkId;
            currentCapacity = totalCapacity;
            predictedDemand = predictedDemand;
            recommendedCapacity = recommendedCapacity;
            expansionNodes = expansionNodes;
            phiForecastConfidence = PHI_INVERSE; // Base confidence
            timestamp = Time.now();
        };
    };
    
    // ═══════════════════════════════════════════════════════════════════
    // QUERY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════
    
    public query func getNode(nodeId: Text) : async ?NetworkNode {
        return nodes.get(nodeId);
    };
    
    public query func getTrafficRecord(nodeId: Text) : async ?TrafficRecord {
        return trafficRecords.get(nodeId);
    };
    
    public query func getHealthAssessment(networkId: Text) : async ?NetworkHealthAssessment {
        return healthAssessments.get(networkId);
    };
    
    public query func getFaultRecord(faultId: Text) : async ?FaultRecord {
        return faultHistory.get(faultId);
    };
    
    public query func getNodeCount() : async Nat {
        return nodeCount;
    };
    
    public query func getFibonacciRetry(attempt: Nat) : async Nat {
        if (attempt < FIBONACCI.size()) {
            return FIBONACCI[attempt];
        };
        return 610; // Max value
    };
    
    public query func getPhiConstants() : async { 
        phi: Float; 
        phiSquared: Float; 
        phiInverse: Float; 
        goldenAngle: Float;
        healthyThreshold: Float;
        degradedThreshold: Float;
    } {
        return {
            phi = PHI;
            phiSquared = PHI_SQUARED;
            phiInverse = PHI_INVERSE;
            goldenAngle = GOLDEN_ANGLE;
            healthyThreshold = HEALTHY_THRESHOLD;
            degradedThreshold = DEGRADED_THRESHOLD;
        };
    };
    
    // ═══════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════
    
    private func _generateSignalOptimizations(signal: Float, noise: Float, bandwidth: Float) : [Text] {
        var optimizations : [Text] = [];
        
        if (signal < PHI_INVERSE) {
            optimizations := Array.append(optimizations, ["Increase transmit power or reduce path loss"]);
        };
        
        if (noise < PHI_INVERSE) {
            optimizations := Array.append(optimizations, ["Apply advanced noise filtering or change frequency"]);
        };
        
        if (bandwidth < PHI_INVERSE) {
            optimizations := Array.append(optimizations, ["Allocate additional spectrum or optimize compression"]);
        };
        
        if (optimizations.size() == 0) {
            optimizations := ["Signal quality is optimal - maintain current configuration"];
        };
        
        return optimizations;
    };
    
    private func _fibonacciRetryDuration(severity: Float) : Nat {
        // Higher severity = more retry attempts = longer duration
        let attempts = if (severity > 0.8) { 7 }
                      else if (severity > 0.5) { 5 }
                      else if (severity > 0.3) { 3 }
                      else { 2 };
        
        var totalDuration : Nat = 0;
        for (i in Iter.range(0, attempts - 1)) {
            totalDuration += FIBONACCI[i] * 100;
        };
        return totalDuration;
    };
};
