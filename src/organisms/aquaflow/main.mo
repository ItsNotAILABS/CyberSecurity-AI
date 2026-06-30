///
/// AQUAFLOW — Hydrological Intelligence Organism
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// "Water follows the path of least resistance. We calculate that path
///  using mathematics as old as the rivers themselves."
///
/// AQUAFLOW provides comprehensive water systems management using
/// fluid dynamics equations, Pythagorean flow calculations, and
/// φ-optimized irrigation scheduling.
///
/// Capabilities:
///   - Watershed Analysis using Fibonacci catchment boundaries
///   - Irrigation Optimization with Golden Ratio water distribution
///   - Groundwater Modeling via Darcy's Law with φ-weighting
///   - Flood Prediction using Pythagorean channel dynamics
///   - Water Quality Assessment with φ-threshold indicators
///   - Drought Monitoring via Fibonacci temporal windows
///
/// Mathematical Foundation:
///   - Darcy's Law: Q = -KA(dh/dl) (groundwater flow)
///   - Manning's Equation: V = (1/n)R^(2/3)S^(1/2) (open channel flow)
///   - Continuity: A₁V₁ = A₂V₂ (mass conservation)
///   - Golden Ratio: φ = 1.618... (optimal distribution)
///   - Fibonacci: Temporal water scheduling
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

persistent actor AQUAFLOW {

  // ══════════════════════════════════════════════════════════════════
  //  MATHEMATICAL CONSTANTS — Water's Sacred Numbers
  // ══════════════════════════════════════════════════════════════════

  // Golden Ratio Constants
  transient let PHI : Float = 1.6180339887498949;
  transient let PHI_SQUARED : Float = 2.6180339887498949;
  transient let PHI_INVERSE : Float = 0.6180339887498949;
  transient let PHI_CUBED : Float = 4.2360679774997898;

  // Pythagorean Constants
  transient let SQRT_2 : Float = 1.41421356237309505;
  transient let PI : Float = 3.14159265358979323;

  // Fibonacci Sequence for temporal windows (hours)
  transient let FIBONACCI_HOURS : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

  // Water-specific Constants
  transient let WATER_DENSITY : Float = 1000.0;  // kg/m³
  transient let GRAVITY : Float = 9.81;           // m/s²
  transient let KINEMATIC_VISCOSITY : Float = 0.000001;  // m²/s at 20°C

  // ══════════════════════════════════════════════════════════════════
  //  TYPES — Hydrological Architecture
  // ══════════════════════════════════════════════════════════════════

  public type GeoCoordinate = {
    latitude: Float;
    longitude: Float;
    elevation: Float;
  };

  public type WatershedArea = {
    watershedId: Text;
    outlet: GeoCoordinate;
    areaKm2: Float;
    perimeterKm: Float;
    mainChannelLength: Float;
    averageSlope: Float;
    concentrationTime: Float;  // hours
    fibonacciCatchmentOrder: Nat;
  };

  public type StreamSegment = {
    segmentId: Text;
    startPoint: GeoCoordinate;
    endPoint: GeoCoordinate;
    lengthMeters: Float;
    slope: Float;
    manningN: Float;           // roughness coefficient
    crossSectionArea: Float;   // m²
    hydraulicRadius: Float;    // m
    streamOrder: Nat;          // Strahler order
  };

  public type FlowCalculation = {
    segmentId: Text;
    discharge: Float;          // m³/s
    velocity: Float;           // m/s
    depth: Float;              // m
    froudeNumber: Float;       // dimensionless
    reynoldsNumber: Float;     // dimensionless
    flowRegime: Text;          // subcritical/critical/supercritical
    phiEfficiency: Float;      // φ-weighted efficiency
    timestamp: Int;
  };

  public type IrrigationZone = {
    zoneId: Text;
    fieldId: Text;
    areaHectares: Float;
    cropType: Text;
    soilType: Text;
    currentMoisture: Float;    // percentage
    fieldCapacity: Float;      // percentage
    wiltingPoint: Float;       // percentage
    rootZoneDepth: Float;      // meters
  };

  public type IrrigationSchedule = {
    zoneId: Text;
    scheduleType: Text;        // "fibonacci_optimal"
    events: [IrrigationEvent];
    totalWaterM3: Float;
    phiEfficiency: Float;
    seasonStartDate: Int;
    seasonEndDate: Int;
  };

  public type IrrigationEvent = {
    eventNumber: Nat;
    fibonacciDay: Nat;         // day since season start
    waterAmountM3: Float;
    duration: Float;           // hours
    startTime: Float;          // hour of day (0-24)
    applicationRate: Float;    // mm/hr
    phiWeight: Float;
  };

  public type GroundwaterModel = {
    aquiferId: Text;
    aquiferType: Text;         // confined/unconfined
    hydraulicConductivity: Float; // m/day
    storativity: Float;        // dimensionless
    thickness: Float;          // m
    rechargeRate: Float;       // mm/year
    waterLevel: Float;         // m below surface
    safeYield: Float;          // m³/day
    phiSustainabilityIndex: Float;
  };

  public type PumpingWell = {
    wellId: Text;
    coordinate: GeoCoordinate;
    depth: Float;              // m
    pumpRate: Float;           // m³/day
    drawdown: Float;           // m
    radiusOfInfluence: Float;  // m
    efficiency: Float;         // percentage
  };

  public type WaterQuality = {
    sampleId: Text;
    coordinate: GeoCoordinate;
    timestamp: Int;
    pH: Float;
    dissolvedOxygen: Float;    // mg/L
    turbidity: Float;          // NTU
    conductivity: Float;       // µS/cm
    nitrate: Float;            // mg/L
    phosphate: Float;          // mg/L
    temperature: Float;        // °C
    qualityIndex: Float;       // 0-100
    phiThresholdStatus: Text;
  };

  public type FloodPrediction = {
    watershedId: Text;
    rainfallMm: Float;
    durationHours: Float;
    peakDischarge: Float;      // m³/s
    timeToP Float;      // hours
    floodVolume: Float;        // m³
    recurrenceInterval: Float; // years
    pythagoreanRiskScore: Float;
    evacuationTime: Float;     // hours
    timestamp: Int;
  };

  public type DroughtIndex = {
    regionId: Text;
    indexType: Text;           // SPI, PDSI, etc.
    value: Float;
    category: Text;            // Normal, Moderate, Severe, Extreme
    fibonacciWindow: Nat;      // temporal window in days
    precipitationDeficit: Float; // mm
    soilMoistureAnomaly: Float;
    phiSeverityIndex: Float;
    timestamp: Int;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE — Water Memory
  // ══════════════════════════════════════════════════════════════════

  stable var watershedCount : Nat = 0;
  stable var irrigationScheduleCount : Nat = 0;

  var watersheds = HashMap.HashMap<Text, WatershedArea>(10, Text.equal, Text.hash);
  var irrigationSchedules = HashMap.HashMap<Text, IrrigationSchedule>(10, Text.equal, Text.hash);
  var waterQualityRecords = HashMap.HashMap<Text, WaterQuality>(10, Text.equal, Text.hash);

  // ══════════════════════════════════════════════════════════════════
  //  CORE FUNCTIONS — Water Intelligence
  // ══════════════════════════════════════════════════════════════════

  /// Analyze watershed using Fibonacci-ordered catchment delineation
  public func analyzeWatershed(
    watershedId: Text,
    outlet: GeoCoordinate,
    boundaryPoints: [GeoCoordinate],
    mainChannelData: { length: Float; slope: Float }
  ) : async WatershedArea {
    
    // Calculate area using Shoelace formula (Pythagorean-based)
    let area = _calculatePolygonArea(boundaryPoints);
    let perimeter = _calculatePerimeter(boundaryPoints);
    
    // Time of concentration using Kirpich formula (φ-modified)
    // Tc = 0.0195 × L^0.77 × S^(-0.385) × φ^(-0.1)
    let tc = 0.0195 * Float.pow(mainChannelData.length, 0.77) * 
             Float.pow(mainChannelData.slope, -0.385) * Float.pow(PHI, -0.1);
    
    // Fibonacci catchment order based on area
    let fibOrder = _determineFibonacciOrder(area);
    
    let watershed : WatershedArea = {
      watershedId = watershedId;
      outlet = outlet;
      areaKm2 = area;
      perimeterKm = perimeter;
      mainChannelLength = mainChannelData.length;
      averageSlope = mainChannelData.slope;
      concentrationTime = tc;
      fibonacciCatchmentOrder = fibOrder;
    };
    
    watersheds.put(watershedId, watershed);
    watershedCount += 1;
    
    return watershed;
  };

  /// Calculate stream flow using Manning's equation with φ-efficiency
  /// V = (1/n) × R^(2/3) × S^(1/2)
  public func calculateStreamFlow(
    segment: StreamSegment
  ) : async FlowCalculation {
    
    // Manning's equation
    let velocity = (1.0 / segment.manningN) * 
                   Float.pow(segment.hydraulicRadius, 2.0/3.0) * 
                   Float.pow(segment.slope, 0.5);
    
    // Discharge Q = A × V
    let discharge = segment.crossSectionArea * velocity;
    
    // Flow depth (assuming rectangular channel)
    let width = segment.crossSectionArea / segment.hydraulicRadius;
    let depth = segment.crossSectionArea / width;
    
    // Froude number: Fr = V / √(g × D)
    let froude = velocity / Float.sqrt(GRAVITY * depth);
    
    // Reynolds number: Re = V × D / ν
    let reynolds = velocity * depth / KINEMATIC_VISCOSITY;
    
    // Flow regime classification
    let regime = if (froude < 1.0) { "SUBCRITICAL" }
                 else if (froude > 1.0) { "SUPERCRITICAL" }
                 else { "CRITICAL" };
    
    // φ-efficiency: optimal flow is at φ-threshold
    let phiEfficiency = 1.0 - Float.abs(froude - PHI_INVERSE) / PHI;
    
    return {
      segmentId = segment.segmentId;
      discharge = discharge;
      velocity = velocity;
      depth = depth;
      froudeNumber = froude;
      reynoldsNumber = reynolds;
      flowRegime = regime;
      phiEfficiency = phiEfficiency;
      timestamp = Time.now();
    };
  };

  /// Generate optimal irrigation schedule using Fibonacci timing
  /// Water events follow F(n) day intervals with φ-weighted amounts
  public func generateIrrigationSchedule(
    zone: IrrigationZone,
    seasonDays: Nat,
    totalWaterBudget: Float,  // m³
    cropCoefficient: Float    // Kc
  ) : async IrrigationSchedule {
    
    let eventsBuffer = Buffer.Buffer<IrrigationEvent>(30);
    
    // Calculate water need based on φ-weighted evapotranspiration
    let dailyETc = 5.0 * cropCoefficient * PHI_INVERSE;  // mm/day baseline
    
    // Generate Fibonacci-spaced irrigation events
    var currentDay : Nat = 1;
    var eventNum : Nat = 1;
    var totalWater : Float = 0.0;
    var fibIndex : Nat = 2;
    
    while (currentDay <= seasonDays and fibIndex < FIBONACCI_HOURS.size()) {
      let fibInterval = FIBONACCI_HOURS[fibIndex];
      
      // Water amount: φ-weighted based on crop growth stage
      let growthFactor = Float.sin(Float.fromInt(currentDay) * PI / Float.fromInt(seasonDays)) + 1.0;
      let phiWeight = Float.pow(PHI, -Float.fromInt(fibIndex) / 5.0);
      let waterAmount = dailyETc * Float.fromInt(fibInterval) * zone.areaHectares * 10.0 * growthFactor * phiWeight;
      
      // Application rate based on soil infiltration
      let applicationRate = 15.0 * PHI_INVERSE;  // mm/hr (adjusted for soil)
      let duration = waterAmount / (zone.areaHectares * 10000.0) / applicationRate;
      
      // Optimal start time: early morning (φ-based)
      let startTime = 5.0 + (PHI_INVERSE * 2.0);
      
      eventsBuffer.add({
        eventNumber = eventNum;
        fibonacciDay = currentDay;
        waterAmountM3 = waterAmount;
        duration = duration;
        startTime = startTime;
        applicationRate = applicationRate;
        phiWeight = phiWeight;
      });
      
      totalWater += waterAmount;
      currentDay += fibInterval;
      eventNum += 1;
      fibIndex += 1;
    };
    
    // Calculate overall efficiency
    let scheduleEfficiency = Float.min(1.0, totalWaterBudget / totalWater) * PHI_INVERSE + 
                             (1.0 - PHI_INVERSE);
    
    let schedule : IrrigationSchedule = {
      zoneId = zone.zoneId;
      scheduleType = "FIBONACCI_OPTIMAL";
      events = Buffer.toArray(eventsBuffer);
      totalWaterM3 = totalWater;
      phiEfficiency = scheduleEfficiency;
      seasonStartDate = Time.now();
      seasonEndDate = Time.now() + (seasonDays * 24 * 60 * 60 * 1_000_000_000);
    };
    
    irrigationSchedules.put(zone.zoneId, schedule);
    irrigationScheduleCount += 1;
    
    return schedule;
  };

  /// Model groundwater using Darcy's Law with φ-sustainability assessment
  /// Q = -K × A × (dh/dl)
  public func modelGroundwater(
    aquiferId: Text,
    hydraulicConductivity: Float,
    aquiferThickness: Float,
    gradient: Float,
    rechargeRate: Float
  ) : async GroundwaterModel {
    
    // Darcy's Law for flow
    let flowPerMeter = hydraulicConductivity * aquiferThickness * gradient;
    
    // Safe yield calculation (φ-conservative)
    let safeYield = rechargeRate * PHI_INVERSE * 365.0 / 1000.0;  // m³/day per km²
    
    // Sustainability index based on recharge/extraction ratio
    let sustainabilityIndex = if (flowPerMeter > 0.0) {
      Float.min(1.0, (rechargeRate / 365.0 / 1000.0) / flowPerMeter * PHI)
    } else { 1.0 };
    
    return {
      aquiferId = aquiferId;
      aquiferType = if (aquiferThickness > 50.0) { "CONFINED" } else { "UNCONFINED" };
      hydraulicConductivity = hydraulicConductivity;
      storativity = 0.0002;  // typical confined
      thickness = aquiferThickness;
      rechargeRate = rechargeRate;
      waterLevel = 10.0;     // default
      safeYield = safeYield;
      phiSustainabilityIndex = sustainabilityIndex;
    };
  };

  /// Predict flood using rational method with Pythagorean risk scoring
  /// Q = C × i × A (Rational Method, φ-enhanced)
  public func predictFlood(
    watershedId: Text,
    rainfallIntensity: Float,  // mm/hr
    durationHours: Float,
    runoffCoefficient: Float
  ) : async FloodPrediction {
    
    switch (watersheds.get(watershedId)) {
      case null {
        return {
          watershedId = watershedId;
          rainfallMm = 0.0;
          durationHours = 0.0;
          peakDischarge = 0.0;
          timeToPeak = 0.0;
          floodVolume = 0.0;
          recurrenceInterval = 0.0;
          pythagoreanRiskScore = 0.0;
          evacuationTime = 0.0;
          timestamp = Time.now();
        };
      };
      case (?watershed) {
        let totalRainfall = rainfallIntensity * durationHours;
        
        // Rational method: Q = C × i × A × 0.278
        let peakQ = runoffCoefficient * rainfallIntensity * watershed.areaKm2 * 0.278;
        
        // Time to peak (modified Kirpich)
        let timeToPeak = watershed.concentrationTime * PHI_INVERSE;
        
        // Flood volume
        let volume = peakQ * durationHours * 3600.0 * PHI_INVERSE;
        
        // Recurrence interval (simplified Gumbel)
        let recurrence = Float.pow(2.0, totalRainfall / 50.0);
        
        // Pythagorean risk score: √(intensity² + duration² + coefficient²)
        let riskComponents = Float.sqrt(
          Float.pow(rainfallIntensity / 100.0, 2) +
          Float.pow(durationHours / 24.0, 2) +
          Float.pow(runoffCoefficient, 2)
        );
        let pythagoreanRisk = riskComponents / SQRT_2;
        
        // Evacuation time (φ-safety factor)
        let evacuationTime = timeToPeak * PHI_INVERSE;
        
        return {
          watershedId = watershedId;
          rainfallMm = totalRainfall;
          durationHours = durationHours;
          peakDischarge = peakQ;
          timeToPeak = timeToPeak;
          floodVolume = volume;
          recurrenceInterval = recurrence;
          pythagoreanRiskScore = pythagoreanRisk;
          evacuationTime = evacuationTime;
          timestamp = Time.now();
        };
      };
    };
  };

  /// Assess water quality using φ-threshold indicators
  public func assessWaterQuality(
    sampleId: Text,
    coordinate: GeoCoordinate,
    measurements: {
      pH: Float;
      dissolvedOxygen: Float;
      turbidity: Float;
      conductivity: Float;
      nitrate: Float;
      phosphate: Float;
      temperature: Float;
    }
  ) : async WaterQuality {
    
    // Calculate Water Quality Index using φ-weighted parameters
    var wqi : Float = 0.0;
    var weightSum : Float = 0.0;
    
    // pH sub-index (optimal range 6.5-8.5)
    let phScore = if (measurements.pH >= 6.5 and measurements.pH <= 8.5) {
      100.0 - Float.abs(measurements.pH - 7.5) * 20.0
    } else { 50.0 };
    wqi += phScore * Float.pow(PHI, 0);
    weightSum += Float.pow(PHI, 0);
    
    // DO sub-index (higher is better, up to saturation)
    let doScore = Float.min(100.0, measurements.dissolvedOxygen * 10.0);
    wqi += doScore * Float.pow(PHI, -1);
    weightSum += Float.pow(PHI, -1);
    
    // Turbidity sub-index (lower is better)
    let turbScore = Float.max(0.0, 100.0 - measurements.turbidity * 2.0);
    wqi += turbScore * Float.pow(PHI, -2);
    weightSum += Float.pow(PHI, -2);
    
    // Nitrate sub-index (lower is better, <10 mg/L is good)
    let nitrateScore = Float.max(0.0, 100.0 - measurements.nitrate * 10.0);
    wqi += nitrateScore * Float.pow(PHI, -3);
    weightSum += Float.pow(PHI, -3);
    
    // Final WQI
    let qualityIndex = wqi / weightSum;
    
    // φ-threshold status
    let status = if (qualityIndex >= PHI_SQUARED * 30.0) { "EXCELLENT" }
                 else if (qualityIndex >= PHI * 50.0) { "GOOD" }
                 else if (qualityIndex >= PHI_INVERSE * 80.0) { "FAIR" }
                 else { "POOR" };
    
    let record : WaterQuality = {
      sampleId = sampleId;
      coordinate = coordinate;
      timestamp = Time.now();
      pH = measurements.pH;
      dissolvedOxygen = measurements.dissolvedOxygen;
      turbidity = measurements.turbidity;
      conductivity = measurements.conductivity;
      nitrate = measurements.nitrate;
      phosphate = measurements.phosphate;
      temperature = measurements.temperature;
      qualityIndex = qualityIndex;
      phiThresholdStatus = status;
    };
    
    waterQualityRecords.put(sampleId, record);
    
    return record;
  };

  /// Calculate drought index using Fibonacci temporal windows
  public func calculateDroughtIndex(
    regionId: Text,
    precipitationData: [{ day: Nat; mm: Float }],
    normalPrecipitation: Float,
    fibonacciWindowIndex: Nat
  ) : async DroughtIndex {
    
    // Get Fibonacci window in days
    let windowDays = if (fibonacciWindowIndex < FIBONACCI_HOURS.size()) {
      FIBONACCI_HOURS[fibonacciWindowIndex]
    } else { 89 };
    
    // Sum precipitation over window
    var actualPrecip : Float = 0.0;
    for (data in precipitationData.vals()) {
      if (data.day <= windowDays) {
        actualPrecip += data.mm;
      };
    };
    
    // Expected precipitation for window
    let expectedPrecip = normalPrecipitation * Float.fromInt(windowDays) / 365.0;
    
    // Standardized Precipitation Index (simplified)
    let deficit = expectedPrecip - actualPrecip;
    let spi = -deficit / (expectedPrecip * 0.3);  // normalized
    
    // Category classification using φ thresholds
    let category = if (spi >= PHI_INVERSE) { "NORMAL" }
                   else if (spi >= -PHI_INVERSE) { "MILD_DROUGHT" }
                   else if (spi >= -PHI) { "MODERATE_DROUGHT" }
                   else if (spi >= -PHI_SQUARED) { "SEVERE_DROUGHT" }
                   else { "EXTREME_DROUGHT" };
    
    // φ-severity index
    let phiSeverity = if (spi >= 0.0) { 0.0 }
                      else { Float.min(1.0, Float.abs(spi) / PHI_SQUARED) };
    
    return {
      regionId = regionId;
      indexType = "FIBONACCI_SPI";
      value = spi;
      category = category;
      fibonacciWindow = windowDays;
      precipitationDeficit = deficit;
      soilMoistureAnomaly = deficit / expectedPrecip;
      phiSeverityIndex = phiSeverity;
      timestamp = Time.now();
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY FUNCTIONS — Water Memory Access
  // ══════════════════════════════════════════════════════════════════

  public query func getWatershed(watershedId: Text) : async ?WatershedArea {
    return watersheds.get(watershedId);
  };

  public query func getIrrigationSchedule(zoneId: Text) : async ?IrrigationSchedule {
    return irrigationSchedules.get(zoneId);
  };

  public query func getWaterQuality(sampleId: Text) : async ?WaterQuality {
    return waterQualityRecords.get(sampleId);
  };

  public query func getStatistics() : async { watersheds: Nat; schedules: Nat } {
    return { watersheds = watershedCount; schedules = irrigationScheduleCount };
  };

  public query func getFibonacciHours() : async [Nat] {
    return FIBONACCI_HOURS;
  };

  public query func getHydrologicalConstants() : async {
    phi: Float; waterDensity: Float; gravity: Float;
  } {
    return {
      phi = PHI;
      waterDensity = WATER_DENSITY;
      gravity = GRAVITY;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS — Hydrological Calculations
  // ══════════════════════════════════════════════════════════════════

  private func _calculatePolygonArea(points: [GeoCoordinate]) : Float {
    // Shoelace formula (derived from Pythagorean geometry)
    if (points.size() < 3) { return 0.0; };
    
    var area : Float = 0.0;
    let n = points.size();
    
    for (i in Iter.range(0, n - 1)) {
      let j = (i + 1) % n;
      // Convert to km
      let xi = points[i].longitude * 111.32 * Float.cos(points[i].latitude * PI / 180.0);
      let yi = points[i].latitude * 110.57;
      let xj = points[j].longitude * 111.32 * Float.cos(points[j].latitude * PI / 180.0);
      let yj = points[j].latitude * 110.57;
      
      area += xi * yj - xj * yi;
    };
    
    return Float.abs(area) / 2.0;
  };

  private func _calculatePerimeter(points: [GeoCoordinate]) : Float {
    if (points.size() < 2) { return 0.0; };
    
    var perimeter : Float = 0.0;
    let n = points.size();
    
    for (i in Iter.range(0, n - 1)) {
      let j = (i + 1) % n;
      // Pythagorean distance
      let dx = (points[j].longitude - points[i].longitude) * 111.32 * 
               Float.cos(points[i].latitude * PI / 180.0);
      let dy = (points[j].latitude - points[i].latitude) * 110.57;
      
      perimeter += Float.sqrt(dx * dx + dy * dy);
    };
    
    return perimeter;
  };

  private func _determineFibonacciOrder(areaKm2: Float) : Nat {
    // Catchment order based on area matching Fibonacci thresholds
    let fibAreas : [Float] = [1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0, 34.0, 55.0, 89.0, 144.0];
    
    for (i in Iter.range(0, fibAreas.size() - 1)) {
      if (areaKm2 <= fibAreas[i]) {
        return i;
      };
    };
    
    return fibAreas.size() - 1;
  };
};
