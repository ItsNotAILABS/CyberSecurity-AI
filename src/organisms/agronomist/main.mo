/**
 * AGRONOMIST Organism — Primary Agricultural Intelligence
 * 
 * Casa de Medina — Architectos de Architectura Inteligente
 * 
 * Motoko actor for precision agriculture, crop yield prediction,
 * USDA compliance, and resource optimization.
 * 
 * Mathematical Foundation:
 * - φ-weighted growth models
 * - Fibonacci temporal windows
 * - Pythagorean soil health calculations
 * - Golden spiral resource distribution
 */

import Time "mo:base/Time";
import Float "mo:base/Float";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";

actor AGRONOMIST {
    
    // ═══════════════════════════════════════════════════════════════════
    // MATHEMATICAL CONSTANTS
    // ═══════════════════════════════════════════════════════════════════
    
    private let PHI : Float = 1.6180339887498949;
    private let PHI_SQUARED : Float = 2.6180339887498949;
    private let PHI_INVERSE : Float = 0.6180339887498949;
    private let GOLDEN_ANGLE : Float = 2.39996322972865332; // 2π(1 - 1/φ) ≈ 137.5°
    
    // Fibonacci sequence for temporal windows
    private let FIBONACCI : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];
    
    // ═══════════════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════════════
    
    // Field registry
    private stable var fieldCount : Nat = 0;
    private var fields = HashMap.HashMap<Text, Field>(10, Text.equal, Text.hash);
    
    // Yield predictions
    private var predictions = HashMap.HashMap<Text, YieldPrediction>(10, Text.equal, Text.hash);
    
    // Soil health records
    private var soilRecords = HashMap.HashMap<Text, SoilHealthRecord>(10, Text.equal, Text.hash);
    
    // ═══════════════════════════════════════════════════════════════════
    // TYPES
    // ═══════════════════════════════════════════════════════════════════
    
    public type Field = {
        id: Text;
        farmId: Text;
        acres: Float;
        cropType: Text;
        soilType: Text;
        irrigated: Bool;
        plantingDate: ?Int;
        location: GeoLocation;
    };
    
    public type GeoLocation = {
        latitude: Float;
        longitude: Float;
    };
    
    public type EnvironmentalConditions = {
        soilHealth: Float;
        waterAvailability: Float;
        sunlightHours: Float;
        temperature: Float;
        pestPressure: Float;
    };
    
    public type YieldPrediction = {
        fieldId: Text;
        cropType: Text;
        baseYield: Float;
        predictedYield: Float;
        confidence: Float;
        phiGrowthFactor: Float;
        environmentalFactor: Float;
        timestamp: Int;
    };
    
    public type SoilHealthRecord = {
        fieldId: Text;
        soilHealthIndex: Float;
        status: Text;
        nutrientScore: Float;
        microbialActivity: Float;
        waterRetention: Float;
        recommendations: [Text];
        timestamp: Int;
    };
    
    public type GrowingWindow = {
        name: Text;
        fibonacciIndex: Nat;
        durationDays: Nat;
        actions: [Text];
    };
    
    public type SeasonPlan = {
        fieldId: Text;
        cropType: Text;
        totalSeasonDays: Nat;
        windows: [GrowingWindow];
        plantingDate: Int;
        harvestDate: Int;
    };
    
    public type USDAReport = {
        reportType: Text;
        farmId: Text;
        fieldId: Text;
        cropType: Text;
        acres: Float;
        yieldPerAcre: Float;
        totalProduction: Float;
        practiceData: PracticeData;
        generatedAt: Int;
        phiSignature: Text;
    };
    
    public type PracticeData = {
        irrigated: Bool;
        organic: Bool;
        coverCrops: Bool;
        noTill: Bool;
    };
    
    public type ResourcePlan = {
        fieldId: Text;
        waterAllocation: Float;
        fertilizerAllocation: Float;
        irrigationSchedule: [IrrigationEvent];
        phiEfficiency: Float;
    };
    
    public type IrrigationEvent = {
        sessionNumber: Nat;
        startHour: Float;
        durationHours: Float;
        waterAmount: Float;
    };
    
    // ═══════════════════════════════════════════════════════════════════
    // CORE FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════
    
    /**
     * Register a new field
     */
    public func registerField(field: Field) : async Text {
        fields.put(field.id, field);
        fieldCount += 1;
        return "Field registered: " # field.id # " | Total fields: " # Nat.toText(fieldCount);
    };
    
    /**
     * Predict yield using φ-enhanced growth model
     * Y(t) = Y₀ × φ^(G(t)/G_max) × Π(Environmental_Factors)
     */
    public func predictYield(
        fieldId: Text, 
        baseYield: Float, 
        growthStage: Float, 
        conditions: EnvironmentalConditions
    ) : async YieldPrediction {
        
        // φ-enhanced growth factor
        let phiGrowthFactor = Float.pow(PHI, growthStage);
        
        // Pythagorean environmental factor
        let envFactorSquared = 
            Float.pow(conditions.soilHealth, 2) +
            Float.pow(conditions.waterAvailability, 2) +
            Float.pow(conditions.sunlightHours, 2) +
            Float.pow(conditions.temperature, 2);
        let environmentalFactor = Float.sqrt(envFactorSquared) / 2.0;
        
        // Pest reduction factor
        let pestFactor = 1.0 - (conditions.pestPressure * PHI_INVERSE);
        
        // Final prediction
        let predictedYield = baseYield * phiGrowthFactor * environmentalFactor * pestFactor;
        
        // Confidence calculation
        let confidence = _calculateConfidence(conditions);
        
        let prediction : YieldPrediction = {
            fieldId = fieldId;
            cropType = switch (fields.get(fieldId)) {
                case (?field) { field.cropType };
                case null { "unknown" };
            };
            baseYield = baseYield;
            predictedYield = predictedYield;
            confidence = confidence;
            phiGrowthFactor = phiGrowthFactor;
            environmentalFactor = environmentalFactor;
            timestamp = Time.now();
        };
        
        predictions.put(fieldId, prediction);
        return prediction;
    };
    
    /**
     * Calculate Pythagorean Soil Health Index
     * SHI² = (Nutrient_Score)² + (Microbial_Activity)² + (Water_Retention)²
     */
    public func calculateSoilHealth(
        fieldId: Text,
        nutrientScore: Float,
        microbialActivity: Float,
        waterRetention: Float
    ) : async SoilHealthRecord {
        
        // Pythagorean calculation
        let shiSquared = 
            Float.pow(nutrientScore, 2) +
            Float.pow(microbialActivity, 2) +
            Float.pow(waterRetention, 2);
        let shi = Float.sqrt(shiSquared);
        
        // Health classification based on φ thresholds
        let status = if (shi >= PHI) {
            "OPTIMAL"
        } else if (shi >= PHI_INVERSE) {
            "ADEQUATE"
        } else if (shi >= PHI_INVERSE * PHI_INVERSE) {
            "DEGRADED"
        } else {
            "CRITICAL"
        };
        
        // Generate recommendations
        let recommendations = _generateSoilRecommendations(nutrientScore, microbialActivity, waterRetention);
        
        let record : SoilHealthRecord = {
            fieldId = fieldId;
            soilHealthIndex = shi;
            status = status;
            nutrientScore = nutrientScore;
            microbialActivity = microbialActivity;
            waterRetention = waterRetention;
            recommendations = recommendations;
            timestamp = Time.now();
        };
        
        soilRecords.put(fieldId, record);
        return record;
    };
    
    /**
     * Generate Fibonacci-based growing season plan
     */
    public func planSeason(fieldId: Text, plantingDate: Int) : async SeasonPlan {
        let windows = _generateGrowingWindows();
        
        var totalDays : Nat = 0;
        for (window in windows.vals()) {
            totalDays += window.durationDays;
        };
        
        let cropType = switch (fields.get(fieldId)) {
            case (?field) { field.cropType };
            case null { "unknown" };
        };
        
        // Calculate harvest date (plantingDate + totalDays in nanoseconds)
        let harvestDate = plantingDate + (totalDays * 24 * 60 * 60 * 1_000_000_000);
        
        return {
            fieldId = fieldId;
            cropType = cropType;
            totalSeasonDays = totalDays;
            windows = windows;
            plantingDate = plantingDate;
            harvestDate = harvestDate;
        };
    };
    
    /**
     * Generate USDA-compliant crop production report
     */
    public func generateUSDAReport(fieldId: Text, farmId: Text) : async USDAReport {
        let field = switch (fields.get(fieldId)) {
            case (?f) { f };
            case null { 
                return {
                    reportType = "ERROR";
                    farmId = farmId;
                    fieldId = fieldId;
                    cropType = "unknown";
                    acres = 0.0;
                    yieldPerAcre = 0.0;
                    totalProduction = 0.0;
                    practiceData = { irrigated = false; organic = false; coverCrops = false; noTill = false };
                    generatedAt = Time.now();
                    phiSignature = "1.61803398";
                };
            };
        };
        
        let prediction = switch (predictions.get(fieldId)) {
            case (?p) { p };
            case null {
                { 
                    fieldId = fieldId; cropType = field.cropType; baseYield = 0.0;
                    predictedYield = 0.0; confidence = 0.0; phiGrowthFactor = 1.0;
                    environmentalFactor = 1.0; timestamp = Time.now();
                }
            };
        };
        
        return {
            reportType = "NASS_CROP_PRODUCTION";
            farmId = farmId;
            fieldId = fieldId;
            cropType = field.cropType;
            acres = field.acres;
            yieldPerAcre = prediction.predictedYield / field.acres;
            totalProduction = prediction.predictedYield;
            practiceData = {
                irrigated = field.irrigated;
                organic = false;
                coverCrops = false;
                noTill = false;
            };
            generatedAt = Time.now();
            phiSignature = "1.61803398";
        };
    };
    
    /**
     * Optimize resource allocation using Golden Spiral distribution
     */
    public func optimizeResources(fieldId: Text, totalWater: Float, irrigationHours: Float) : async ResourcePlan {
        // φ-weighted irrigation schedule
        let schedule = _generateIrrigationSchedule(totalWater, irrigationHours);
        
        // Calculate φ-efficiency
        let phiEfficiency = PHI_INVERSE; // Golden ratio efficiency baseline
        
        return {
            fieldId = fieldId;
            waterAllocation = totalWater;
            fertilizerAllocation = totalWater * PHI_INVERSE; // φ ratio for fertilizer
            irrigationSchedule = schedule;
            phiEfficiency = phiEfficiency;
        };
    };
    
    // ═══════════════════════════════════════════════════════════════════
    // QUERY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════
    
    public query func getField(fieldId: Text) : async ?Field {
        return fields.get(fieldId);
    };
    
    public query func getPrediction(fieldId: Text) : async ?YieldPrediction {
        return predictions.get(fieldId);
    };
    
    public query func getSoilHealth(fieldId: Text) : async ?SoilHealthRecord {
        return soilRecords.get(fieldId);
    };
    
    public query func getFieldCount() : async Nat {
        return fieldCount;
    };
    
    public query func getFibonacciWindow(index: Nat) : async Nat {
        if (index < FIBONACCI.size()) {
            return FIBONACCI[index];
        };
        return 0;
    };
    
    public query func getPhiConstants() : async { phi: Float; phiSquared: Float; phiInverse: Float; goldenAngle: Float } {
        return {
            phi = PHI;
            phiSquared = PHI_SQUARED;
            phiInverse = PHI_INVERSE;
            goldenAngle = GOLDEN_ANGLE;
        };
    };
    
    // ═══════════════════════════════════════════════════════════════════
    // PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════
    
    private func _calculateConfidence(conditions: EnvironmentalConditions) : Float {
        // More complete data = higher confidence (φ-weighted)
        var dataPoints : Float = 0.0;
        if (conditions.soilHealth > 0.0) { dataPoints += 1.0 };
        if (conditions.waterAvailability > 0.0) { dataPoints += 1.0 };
        if (conditions.sunlightHours > 0.0) { dataPoints += 1.0 };
        if (conditions.temperature > 0.0) { dataPoints += 1.0 };
        
        return Float.min(1.0, dataPoints * PHI_INVERSE / 5.0);
    };
    
    private func _generateSoilRecommendations(nutrient: Float, microbial: Float, water: Float) : [Text] {
        var recommendations : [Text] = [];
        
        if (nutrient < PHI_INVERSE) {
            recommendations := Array.append(recommendations, ["Apply organic fertilizer to improve nutrient levels"]);
        };
        
        if (microbial < PHI_INVERSE) {
            recommendations := Array.append(recommendations, ["Introduce cover crops or compost to boost microbial activity"]);
        };
        
        if (water < PHI_INVERSE) {
            recommendations := Array.append(recommendations, ["Add organic matter to improve water retention"]);
        };
        
        if (recommendations.size() == 0) {
            recommendations := ["Soil health is optimal - maintain current practices"];
        };
        
        return recommendations;
    };
    
    private func _generateGrowingWindows() : [GrowingWindow] {
        return [
            { name = "Germination"; fibonacciIndex = 0; durationDays = FIBONACCI[0]; actions = ["Monitor soil moisture", "Check temperature"] },
            { name = "Emergence"; fibonacciIndex = 1; durationDays = FIBONACCI[1]; actions = ["Scout for pests", "Check emergence uniformity"] },
            { name = "Early Vegetative"; fibonacciIndex = 2; durationDays = FIBONACCI[2]; actions = ["Apply starter fertilizer", "Weed control"] },
            { name = "Vegetative Growth"; fibonacciIndex = 3; durationDays = FIBONACCI[3]; actions = ["Side-dress nitrogen", "Irrigation management"] },
            { name = "Late Vegetative"; fibonacciIndex = 4; durationDays = FIBONACCI[4]; actions = ["Monitor for diseases", "Adjust irrigation"] },
            { name = "Reproductive"; fibonacciIndex = 5; durationDays = FIBONACCI[5]; actions = ["Protect pollinators", "Monitor stress"] },
            { name = "Grain Fill"; fibonacciIndex = 6; durationDays = FIBONACCI[6]; actions = ["Maintain irrigation", "Scout for lodging"] },
            { name = "Maturation"; fibonacciIndex = 7; durationDays = FIBONACCI[7]; actions = ["Test moisture content", "Prepare equipment"] },
            { name = "Harvest Ready"; fibonacciIndex = 8; durationDays = FIBONACCI[8]; actions = ["Harvest at optimal moisture", "Test quality"] }
        ];
    };
    
    private func _generateIrrigationSchedule(totalWater: Float, hours: Float) : [IrrigationEvent] {
        // φ-weighted intervals
        let intervals : [Float] = [1.0, PHI, PHI_SQUARED, PHI * PHI_SQUARED];
        let totalIntervals = 1.0 + PHI + PHI_SQUARED + (PHI * PHI_SQUARED);
        
        var schedule : [IrrigationEvent] = [];
        var currentHour : Float = 0.0;
        var sessionNum : Nat = 1;
        
        for (interval in intervals.vals()) {
            let duration = hours / totalIntervals * interval;
            let water = totalWater / 4.0;
            
            schedule := Array.append(schedule, [{
                sessionNumber = sessionNum;
                startHour = currentHour;
                durationHours = duration;
                waterAmount = water;
            }]);
            
            currentHour += duration;
            sessionNum += 1;
        };
        
        return schedule;
    };
};
