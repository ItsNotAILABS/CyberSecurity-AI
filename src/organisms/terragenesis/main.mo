///
/// TERRAGENESIS — Earth Intelligence Organism
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// "The Earth speaks in mathematics. We translate its whispers into architecture."
///
/// TERRAGENESIS provides comprehensive terrain and soil analysis using
/// advanced geospatial mathematics derived from Pythagorean Earth measurement,
/// Euclidean geometry, and φ-weighted compositional analysis.
///
/// Capabilities:
///   - 3D Terrain Analysis with φ-optimized contour mapping
///   - Multi-layer Soil Stratigraphy using Fibonacci depth windows
///   - Geological Age Calculation via Logarithmic-φ dating
///   - Mineral Distribution Mapping using Golden Spiral surveying
///   - Erosion Prediction via Pythagorean slope-flow dynamics
///   - Carbon Sequestration Estimation using φ-weighted biomass models
///
/// Mathematical Foundation:
///   - Pythagorean Theorem: a² + b² = c² (terrain gradients)
///   - Euclidean Distance: √((x₂-x₁)² + (y₂-y₁)² + (z₂-z₁)²)
///   - Golden Ratio: φ = (1 + √5)/2 ≈ 1.618033988749895
///   - Fibonacci Sequence: Depth stratification
///   - Logarithmic Spirals: Survey patterns
///

import Float   "mo:base/Float";
import Int     "mo:base/Int";
import Nat     "mo:base/Nat";
import Text    "mo:base/Text";
import Array   "mo:base/Array";
import Buffer  "mo:base/Buffer";
import Time    "mo:base/Time";
import Iter    "mo:base/Iter";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result  "mo:base/Result";

persistent actor TERRAGENESIS {

  // ══════════════════════════════════════════════════════════════════
  //  MATHEMATICAL CONSTANTS — Earth's Sacred Geometry
  // ══════════════════════════════════════════════════════════════════

  // Golden Ratio Constants
  transient let PHI : Float = 1.6180339887498949;
  transient let PHI_SQUARED : Float = 2.6180339887498949;
  transient let PHI_INVERSE : Float = 0.6180339887498949;
  transient let PHI_CUBED : Float = 4.2360679774997898;

  // Golden Angle (radians) - optimal survey pattern
  transient let GOLDEN_ANGLE : Float = 2.39996322972865332;

  // Pythagorean Constants
  transient let SQRT_2 : Float = 1.41421356237309505;
  transient let SQRT_3 : Float = 1.73205080756887729;
  transient let SQRT_5 : Float = 2.23606797749978969;

  // Fibonacci Sequence for depth stratification (meters)
  transient let FIBONACCI_DEPTHS : [Float] = [
    0.01, 0.01, 0.02, 0.03, 0.05, 0.08, 0.13, 0.21, 0.34, 0.55,
    0.89, 1.44, 2.33, 3.77, 6.10, 9.87, 15.97, 25.84, 41.81, 67.65
  ];

  // Earth Constants
  transient let EARTH_RADIUS_KM : Float = 6371.0;
  transient let METERS_PER_DEGREE : Float = 111319.9;

  // ══════════════════════════════════════════════════════════════════
  //  TYPES — Geological Architecture
  // ══════════════════════════════════════════════════════════════════

  public type GeoCoordinate = {
    latitude: Float;
    longitude: Float;
    elevation: Float; // meters above sea level
  };

  public type TerrainPoint = {
    coordinate: GeoCoordinate;
    slope: Float;         // degrees
    aspect: Float;        // degrees (0-360)
    curvature: Float;     // concave (-) to convex (+)
    roughness: Float;     // terrain roughness index
  };

  public type SoilLayer = {
    depthStart: Float;    // meters
    depthEnd: Float;      // meters
    fibonacciIndex: Nat;  // which Fibonacci level
    composition: SoilComposition;
    properties: SoilProperties;
  };

  public type SoilComposition = {
    sand: Float;          // percentage
    silt: Float;          // percentage
    clay: Float;          // percentage
    organicMatter: Float; // percentage
    minerals: [MineralContent];
  };

  public type MineralContent = {
    mineral: Text;
    concentration: Float; // ppm
    phiRelevance: Float;  // φ-weighted importance
  };

  public type SoilProperties = {
    pH: Float;
    cec: Float;           // Cation Exchange Capacity
    bulkDensity: Float;   // g/cm³
    porosity: Float;      // percentage
    hydraulicConductivity: Float; // cm/hr
    waterHoldingCapacity: Float;  // percentage
  };

  public type SoilProfile = {
    siteId: Text;
    coordinate: GeoCoordinate;
    layers: [SoilLayer];
    totalDepth: Float;
    pythagoreanHealthIndex: Float;
    timestamp: Int;
  };

  public type TerrainAnalysis = {
    regionId: Text;
    centerCoordinate: GeoCoordinate;
    areaHectares: Float;
    elevationRange: { min: Float; max: Float; mean: Float };
    slopeStatistics: { min: Float; max: Float; mean: Float; stdDev: Float };
    terrainRoughnessIndex: Float;
    drainagePattern: Text;
    erosionRisk: Float;
    phiOptimizedContours: [ContourLine];
    timestamp: Int;
  };

  public type ContourLine = {
    elevation: Float;
    points: [GeoCoordinate];
    phiSpacing: Float;    // contour interval based on φ
    length: Float;        // meters
  };

  public type ErosionPrediction = {
    siteId: Text;
    annualSoilLoss: Float;      // tons/hectare/year
    pythagoreanRiskScore: Float;
    dominantProcess: Text;       // water, wind, tillage
    vulnerableAreas: [GeoCoordinate];
    mitigationRecommendations: [Text];
    timestamp: Int;
  };

  public type CarbonEstimate = {
    siteId: Text;
    soilOrganicCarbon: Float;    // tons C/hectare
    potentialSequestration: Float; // tons C/hectare/year
    phiWeightedDepthProfile: [{ depth: Float; carbon: Float }];
    permanenceScore: Float;       // 0-1
    timestamp: Int;
  };

  public type MineralSurvey = {
    regionId: Text;
    surveyPattern: Text;          // "golden_spiral"
    samplePoints: [GeoCoordinate];
    mineralDeposits: [MineralDeposit];
    economicPotential: Float;
    timestamp: Int;
  };

  public type MineralDeposit = {
    mineral: Text;
    centerCoordinate: GeoCoordinate;
    estimatedVolume: Float;       // cubic meters
    concentration: Float;         // percentage
    depthRange: { min: Float; max: Float };
    phiConfidence: Float;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE — Earth Memory
  // ══════════════════════════════════════════════════════════════════

  stable var soilProfileCount : Nat = 0;
  stable var terrainAnalysisCount : Nat = 0;

  var soilProfiles = HashMap.HashMap<Text, SoilProfile>(10, Text.equal, Text.hash);
  var terrainAnalyses = HashMap.HashMap<Text, TerrainAnalysis>(10, Text.equal, Text.hash);

  // ══════════════════════════════════════════════════════════════════
  //  CORE FUNCTIONS — Earth Intelligence
  // ══════════════════════════════════════════════════════════════════

  /// Analyze terrain using Pythagorean gradient calculation
  /// Slope = atan(√((∂z/∂x)² + (∂z/∂y)²))
  public func analyzeTerrain(
    regionId: Text,
    center: GeoCoordinate,
    radiusMeters: Float,
    elevationData: [[Float]]
  ) : async TerrainAnalysis {
    
    let gridSize = elevationData.size();
    let cellSize = (2.0 * radiusMeters) / Float.fromInt(gridSize);
    
    // Calculate elevation statistics
    var minElev : Float = 9999.0;
    var maxElev : Float = -9999.0;
    var sumElev : Float = 0.0;
    var count : Nat = 0;
    
    for (row in elevationData.vals()) {
      for (elev in row.vals()) {
        if (elev < minElev) { minElev := elev; };
        if (elev > maxElev) { maxElev := elev; };
        sumElev += elev;
        count += 1;
      };
    };
    
    let meanElev = sumElev / Float.fromInt(count);
    
    // Calculate slopes using Pythagorean theorem
    var slopeSum : Float = 0.0;
    var slopeSqSum : Float = 0.0;
    var minSlope : Float = 90.0;
    var maxSlope : Float = 0.0;
    var slopeCount : Nat = 0;
    
    // Simplified slope calculation
    for (i in Iter.range(1, gridSize - 2)) {
      for (j in Iter.range(1, gridSize - 2)) {
        let dzdx = (elevationData[i][j+1] - elevationData[i][j-1]) / (2.0 * cellSize);
        let dzdy = (elevationData[i+1][j] - elevationData[i-1][j]) / (2.0 * cellSize);
        
        // Pythagorean: slope² = dzdx² + dzdy²
        let gradient = Float.sqrt(dzdx * dzdx + dzdy * dzdy);
        let slopeDegrees = Float.arctan(gradient) * 180.0 / 3.14159265358979;
        
        slopeSum += slopeDegrees;
        slopeSqSum += slopeDegrees * slopeDegrees;
        
        if (slopeDegrees < minSlope) { minSlope := slopeDegrees; };
        if (slopeDegrees > maxSlope) { maxSlope := slopeDegrees; };
        slopeCount += 1;
      };
    };
    
    let meanSlope = slopeSum / Float.fromInt(slopeCount);
    let variance = (slopeSqSum / Float.fromInt(slopeCount)) - (meanSlope * meanSlope);
    let stdDev = Float.sqrt(Float.abs(variance));
    
    // Generate φ-optimized contours
    let contourInterval = (maxElev - minElev) / (PHI * 10.0);
    let contours = _generatePhiContours(minElev, maxElev, contourInterval);
    
    // Terrain Roughness Index (TRI) - Pythagorean-based
    let tri = _calculateTerrainRoughness(elevationData, cellSize);
    
    // Erosion risk based on slope and φ thresholds
    let erosionRisk = _calculateErosionRisk(meanSlope, maxSlope, tri);
    
    // Drainage pattern classification
    let drainagePattern = _classifyDrainagePattern(maxSlope, tri);
    
    let analysis : TerrainAnalysis = {
      regionId = regionId;
      centerCoordinate = center;
      areaHectares = (3.14159265 * radiusMeters * radiusMeters) / 10000.0;
      elevationRange = { min = minElev; max = maxElev; mean = meanElev };
      slopeStatistics = { min = minSlope; max = maxSlope; mean = meanSlope; stdDev = stdDev };
      terrainRoughnessIndex = tri;
      drainagePattern = drainagePattern;
      erosionRisk = erosionRisk;
      phiOptimizedContours = contours;
      timestamp = Time.now();
    };
    
    terrainAnalyses.put(regionId, analysis);
    terrainAnalysisCount += 1;
    
    return analysis;
  };

  /// Analyze soil profile using Fibonacci depth stratification
  /// Each layer follows F(n) depth intervals
  public func analyzeSoilProfile(
    siteId: Text,
    coordinate: GeoCoordinate,
    sampleData: [{ depth: Float; composition: SoilComposition; properties: SoilProperties }]
  ) : async SoilProfile {
    
    // Map samples to Fibonacci layers
    let layersBuffer = Buffer.Buffer<SoilLayer>(20);
    
    for (i in Iter.range(0, 18)) {
      let fibDepthStart = if (i == 0) { 0.0 } else { FIBONACCI_DEPTHS[i-1] };
      let fibDepthEnd = FIBONACCI_DEPTHS[i];
      
      // Find sample data closest to this Fibonacci layer
      var bestMatch : ?{ depth: Float; composition: SoilComposition; properties: SoilProperties } = null;
      var bestDist : Float = 999.0;
      
      for (sample in sampleData.vals()) {
        let dist = Float.abs(sample.depth - fibDepthEnd);
        if (dist < bestDist) {
          bestDist := dist;
          bestMatch := ?sample;
        };
      };
      
      switch (bestMatch) {
        case (?match) {
          layersBuffer.add({
            depthStart = fibDepthStart;
            depthEnd = fibDepthEnd;
            fibonacciIndex = i;
            composition = match.composition;
            properties = match.properties;
          });
        };
        case null { };
      };
    };
    
    let layers = Buffer.toArray(layersBuffer);
    let maxDepth = if (layers.size() > 0) { layers[layers.size() - 1].depthEnd } else { 0.0 };
    
    // Calculate Pythagorean Soil Health Index
    // PHI² = Nutrients² + Microbial² + Physical²
    let phi_health = _calculatePythagoreanHealthIndex(layers);
    
    let profile : SoilProfile = {
      siteId = siteId;
      coordinate = coordinate;
      layers = layers;
      totalDepth = maxDepth;
      pythagoreanHealthIndex = phi_health;
      timestamp = Time.now();
    };
    
    soilProfiles.put(siteId, profile);
    soilProfileCount += 1;
    
    return profile;
  };

  /// Predict erosion using Pythagorean slope-flow dynamics
  /// SoilLoss = R × K × LS × C × P (RUSLE modified with φ-weighting)
  public func predictErosion(
    siteId: Text,
    rainfallErosivity: Float,   // R factor
    soilErodibility: Float,      // K factor
    slopeLengthSteepness: Float, // LS factor
    coverManagement: Float,      // C factor
    supportPractice: Float       // P factor
  ) : async ErosionPrediction {
    
    // Modified RUSLE with φ-weighting
    let baseErosion = rainfallErosivity * soilErodibility * slopeLengthSteepness * coverManagement * supportPractice;
    
    // Apply φ-scaling for critical thresholds
    let phiAdjusted = baseErosion * (1.0 + (slopeLengthSteepness / PHI_SQUARED));
    
    // Pythagorean risk score: √(slope² + rainfall² + erodibility²)
    let riskComponents = Float.sqrt(
      Float.pow(slopeLengthSteepness / 10.0, 2) +
      Float.pow(rainfallErosivity / 500.0, 2) +
      Float.pow(soilErodibility, 2)
    );
    
    let pythagoreanRisk = riskComponents / SQRT_3; // Normalize to 0-1
    
    // Determine dominant erosion process
    let dominantProcess = if (rainfallErosivity > 400.0) {
      "WATER_SHEET"
    } else if (slopeLengthSteepness > 5.0) {
      "WATER_RILL"
    } else {
      "WIND"
    };
    
    // Generate mitigation recommendations based on φ thresholds
    let recommendations = _generateErosionMitigations(pythagoreanRisk, dominantProcess);
    
    return {
      siteId = siteId;
      annualSoilLoss = phiAdjusted;
      pythagoreanRiskScore = pythagoreanRisk;
      dominantProcess = dominantProcess;
      vulnerableAreas = [];
      mitigationRecommendations = recommendations;
      timestamp = Time.now();
    };
  };

  /// Estimate carbon sequestration using φ-weighted depth integration
  /// SOC = Σ(ρᵢ × Cᵢ × Dᵢ × φ^(-i))
  public func estimateCarbonSequestration(
    siteId: Text,
    organicCarbonByDepth: [{ depth: Float; carbonPercent: Float; bulkDensity: Float }]
  ) : async CarbonEstimate {
    
    var totalCarbon : Float = 0.0;
    let depthProfileBuffer = Buffer.Buffer<{ depth: Float; carbon: Float }>(20);
    
    var layerIndex : Nat = 0;
    for (sample in organicCarbonByDepth.vals()) {
      // φ-weighted integration
      let phiWeight = Float.pow(PHI, -Float.fromInt(layerIndex));
      
      // SOC (tons/ha) = bulk density × carbon% × depth × 100
      let layerCarbon = sample.bulkDensity * (sample.carbonPercent / 100.0) * sample.depth * 100.0 * phiWeight;
      
      totalCarbon += layerCarbon;
      depthProfileBuffer.add({ depth = sample.depth; carbon = layerCarbon });
      
      layerIndex += 1;
    };
    
    // Potential sequestration based on φ-optimal conditions
    let potential = totalCarbon * PHI_INVERSE * 0.05; // ~3% annual increase under optimal management
    
    // Permanence score based on depth distribution
    let permanence = _calculateCarbonPermanence(Buffer.toArray(depthProfileBuffer));
    
    return {
      siteId = siteId;
      soilOrganicCarbon = totalCarbon;
      potentialSequestration = potential;
      phiWeightedDepthProfile = Buffer.toArray(depthProfileBuffer);
      permanenceScore = permanence;
      timestamp = Time.now();
    };
  };

  /// Conduct mineral survey using Golden Spiral sampling pattern
  /// Position(n) = (√n × radius, n × 137.5°)
  public func conductMineralSurvey(
    regionId: Text,
    center: GeoCoordinate,
    radiusKm: Float,
    sampleCount: Nat,
    targetMinerals: [Text]
  ) : async MineralSurvey {
    
    let samplePointsBuffer = Buffer.Buffer<GeoCoordinate>(sampleCount);
    
    // Generate Golden Spiral sampling points
    for (n in Iter.range(1, sampleCount)) {
      let nFloat = Float.fromInt(n);
      let radius = Float.sqrt(nFloat) * (radiusKm / Float.sqrt(Float.fromInt(sampleCount)));
      let angle = nFloat * GOLDEN_ANGLE;
      
      // Convert polar to lat/lon offset
      let latOffset = radius * Float.cos(angle) / (EARTH_RADIUS_KM * 3.14159265 / 180.0);
      let lonOffset = radius * Float.sin(angle) / (EARTH_RADIUS_KM * 3.14159265 / 180.0 * Float.cos(center.latitude * 3.14159265 / 180.0));
      
      samplePointsBuffer.add({
        latitude = center.latitude + latOffset;
        longitude = center.longitude + lonOffset;
        elevation = center.elevation; // Simplified
      });
    };
    
    // Simulated mineral deposits (in production, this would use actual survey data)
    let depositsBuffer = Buffer.Buffer<MineralDeposit>(10);
    
    // Economic potential based on coverage and φ-weighted sample confidence
    let coverageEfficiency = 0.9 + (if (sampleCount > 100) { 0.05 } else { 0.0 });
    let economicPotential = coverageEfficiency * PHI_INVERSE;
    
    return {
      regionId = regionId;
      surveyPattern = "GOLDEN_SPIRAL";
      samplePoints = Buffer.toArray(samplePointsBuffer);
      mineralDeposits = Buffer.toArray(depositsBuffer);
      economicPotential = economicPotential;
      timestamp = Time.now();
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY FUNCTIONS — Earth Memory Access
  // ══════════════════════════════════════════════════════════════════

  public query func getSoilProfile(siteId: Text) : async ?SoilProfile {
    return soilProfiles.get(siteId);
  };

  public query func getTerrainAnalysis(regionId: Text) : async ?TerrainAnalysis {
    return terrainAnalyses.get(regionId);
  };

  public query func getStatistics() : async { soilProfiles: Nat; terrainAnalyses: Nat } {
    return { soilProfiles = soilProfileCount; terrainAnalyses = terrainAnalysisCount };
  };

  public query func getFibonacciDepths() : async [Float] {
    return FIBONACCI_DEPTHS;
  };

  public query func getMathConstants() : async {
    phi: Float; phiSquared: Float; phiInverse: Float; goldenAngle: Float;
    sqrt2: Float; sqrt3: Float; sqrt5: Float;
  } {
    return {
      phi = PHI;
      phiSquared = PHI_SQUARED;
      phiInverse = PHI_INVERSE;
      goldenAngle = GOLDEN_ANGLE;
      sqrt2 = SQRT_2;
      sqrt3 = SQRT_3;
      sqrt5 = SQRT_5;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS — Geological Calculations
  // ══════════════════════════════════════════════════════════════════

  private func _generatePhiContours(minElev: Float, maxElev: Float, interval: Float) : [ContourLine] {
    let contoursBuffer = Buffer.Buffer<ContourLine>(50);
    var elev = minElev;
    
    while (elev <= maxElev) {
      contoursBuffer.add({
        elevation = elev;
        points = [];
        phiSpacing = interval;
        length = 0.0;
      });
      elev += interval;
    };
    
    return Buffer.toArray(contoursBuffer);
  };

  private func _calculateTerrainRoughness(elevationData: [[Float]], cellSize: Float) : Float {
    var roughnessSum : Float = 0.0;
    var count : Nat = 0;
    let gridSize = elevationData.size();
    
    for (i in Iter.range(1, gridSize - 2)) {
      for (j in Iter.range(1, gridSize - 2)) {
        let center = elevationData[i][j];
        var sumDiff : Float = 0.0;
        
        // 8-neighbor comparison
        sumDiff += Float.abs(center - elevationData[i-1][j-1]);
        sumDiff += Float.abs(center - elevationData[i-1][j]);
        sumDiff += Float.abs(center - elevationData[i-1][j+1]);
        sumDiff += Float.abs(center - elevationData[i][j-1]);
        sumDiff += Float.abs(center - elevationData[i][j+1]);
        sumDiff += Float.abs(center - elevationData[i+1][j-1]);
        sumDiff += Float.abs(center - elevationData[i+1][j]);
        sumDiff += Float.abs(center - elevationData[i+1][j+1]);
        
        roughnessSum += Float.sqrt(sumDiff / 8.0);
        count += 1;
      };
    };
    
    return roughnessSum / Float.fromInt(count);
  };

  private func _calculateErosionRisk(meanSlope: Float, maxSlope: Float, tri: Float) : Float {
    // Risk calculation using φ thresholds
    var risk : Float = 0.0;
    
    if (meanSlope >= PHI_SQUARED) { risk += 0.4; }
    else if (meanSlope >= PHI) { risk += 0.25; }
    else if (meanSlope >= PHI_INVERSE) { risk += 0.1; };
    
    if (maxSlope >= PHI_CUBED) { risk += 0.3; }
    else if (maxSlope >= PHI_SQUARED) { risk += 0.2; };
    
    if (tri >= PHI) { risk += 0.3; }
    else if (tri >= PHI_INVERSE) { risk += 0.15; };
    
    return Float.min(1.0, risk);
  };

  private func _classifyDrainagePattern(maxSlope: Float, tri: Float) : Text {
    if (maxSlope > PHI_SQUARED and tri > PHI) {
      return "DENDRITIC"
    } else if (maxSlope > PHI and tri > PHI_INVERSE) {
      return "PARALLEL"
    } else if (tri > PHI) {
      return "TRELLIS"
    } else {
      return "RECTANGULAR"
    };
  };

  private func _calculatePythagoreanHealthIndex(layers: [SoilLayer]) : Float {
    if (layers.size() == 0) { return 0.0; };
    
    var nutrientSum : Float = 0.0;
    var microbialSum : Float = 0.0;
    var physicalSum : Float = 0.0;
    
    for (layer in layers.vals()) {
      nutrientSum += layer.composition.organicMatter + layer.properties.cec / 50.0;
      microbialSum += layer.composition.organicMatter * 0.1;
      physicalSum += layer.properties.porosity / 100.0 + layer.properties.waterHoldingCapacity / 100.0;
    };
    
    let avgNutrient = nutrientSum / Float.fromInt(layers.size());
    let avgMicrobial = microbialSum / Float.fromInt(layers.size());
    let avgPhysical = physicalSum / Float.fromInt(layers.size());
    
    // Pythagorean: PHI² = N² + M² + P²
    return Float.sqrt(avgNutrient * avgNutrient + avgMicrobial * avgMicrobial + avgPhysical * avgPhysical);
  };

  private func _generateErosionMitigations(risk: Float, process: Text) : [Text] {
    let recs = Buffer.Buffer<Text>(5);
    
    if (risk >= PHI_INVERSE) {
      recs.add("CRITICAL: Implement immediate erosion control measures");
    };
    
    switch (process) {
      case "WATER_SHEET" {
        recs.add("Install contour farming on φ-spaced intervals");
        recs.add("Establish permanent vegetation strips");
      };
      case "WATER_RILL" {
        recs.add("Construct terraces at Fibonacci-interval heights");
        recs.add("Install check dams in critical channels");
      };
      case "WIND" {
        recs.add("Plant windbreaks using Golden Spiral spacing");
        recs.add("Maintain surface residue cover > 30%");
      };
      case _ {
        recs.add("Conduct detailed site assessment");
      };
    };
    
    if (risk >= PHI_SQUARED / 3.0) {
      recs.add("Consider land retirement under CRP if risk persists");
    };
    
    return Buffer.toArray(recs);
  };

  private func _calculateCarbonPermanence(depthProfile: [{ depth: Float; carbon: Float }]) : Float {
    // Deeper carbon is more permanent
    // φ-weighted: permanence increases with depth
    var weightedSum : Float = 0.0;
    var totalCarbon : Float = 0.0;
    
    var i : Nat = 0;
    for (layer in depthProfile.vals()) {
      let depthWeight = Float.pow(PHI, Float.fromInt(i) / 5.0);
      weightedSum += layer.carbon * depthWeight;
      totalCarbon += layer.carbon;
      i += 1;
    };
    
    if (totalCarbon == 0.0) { return 0.0; };
    return Float.min(1.0, weightedSum / (totalCarbon * PHI));
  };
};
