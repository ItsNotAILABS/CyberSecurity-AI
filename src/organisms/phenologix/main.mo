///
/// PHENOLOGIX — Growth Cycle Intelligence Organism
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// "Every season speaks in Fibonacci. Every growth stage echoes φ.
///  We listen to nature's rhythm and translate it into harvest."
///
/// PHENOLOGIX provides comprehensive phenological modeling and seasonal
/// timing optimization using astronomical cycles, thermal accumulation,
/// and φ-weighted growth stage transitions.
///
/// Capabilities:
///   - Growth Stage Prediction using Growing Degree Days (GDD)
///   - Fibonacci Phenological Windows for all crop stages
///   - Photoperiod Modeling with astronomical precision
///   - Frost Risk Assessment using φ-threshold temperature analysis
///   - Harvest Window Optimization via φ-weighted maturity indices
///   - Climate Adaptation Modeling with Pythagorean stress calculations
///
/// Mathematical Foundation:
///   - Growing Degree Days: GDD = Σ(Tavg - Tbase)
///   - Photoperiod: P = 2/15 × arccos(-tan(lat) × tan(dec))
///   - φ-Stage Transitions: Stage(n+1) = Stage(n) × φ^(GDD/GDD_req)
///   - Fibonacci: Growth phase durations
///   - Pythagorean: Stress index calculations
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

persistent actor PHENOLOGIX {

  // ══════════════════════════════════════════════════════════════════
  //  MATHEMATICAL CONSTANTS — Seasonal Mathematics
  // ══════════════════════════════════════════════════════════════════

  // Golden Ratio Constants
  transient let PHI : Float = 1.6180339887498949;
  transient let PHI_SQUARED : Float = 2.6180339887498949;
  transient let PHI_INVERSE : Float = 0.6180339887498949;
  transient let PHI_CUBED : Float = 4.2360679774997898;

  // Trigonometric constants
  transient let PI : Float = 3.14159265358979323;
  transient let DEG_TO_RAD : Float = 0.0174532925199433;
  transient let RAD_TO_DEG : Float = 57.2957795130823;

  // Fibonacci Sequence for growth phases (days)
  transient let FIBONACCI_DAYS : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];

  // Astronomical constants
  transient let EARTH_AXIAL_TILT : Float = 23.44;  // degrees
  transient let DAYS_PER_YEAR : Float = 365.25;

  // Base temperatures for common crops (°C)
  transient let BASE_TEMPS : [(Text, Float)] = [
    ("corn", 10.0),
    ("wheat", 0.0),
    ("soybean", 10.0),
    ("cotton", 15.6),
    ("rice", 10.0),
    ("sorghum", 10.0)
  ];

  // ══════════════════════════════════════════════════════════════════
  //  TYPES — Phenological Architecture
  // ══════════════════════════════════════════════════════════════════

  public type GeoLocation = {
    latitude: Float;
    longitude: Float;
    elevation: Float;
  };

  public type GrowthStage = {
    stageId: Text;
    stageName: Text;
    fibonacciIndex: Nat;
    gddRequired: Float;
    gddAccumulated: Float;
    progress: Float;          // 0-1
    startDate: ?Int;
    endDate: ?Int;
    actions: [Text];
  };

  public type PhenologicalModel = {
    cropId: Text;
    cropType: Text;
    variety: Text;
    location: GeoLocation;
    plantingDate: Int;
    baseTemperature: Float;
    stages: [GrowthStage];
    currentStageIndex: Nat;
    totalGDD: Float;
    predictedHarvestDate: Int;
    phiGrowthIndex: Float;
  };

  public type DailyWeather = {
    date: Int;
    tempMin: Float;          // °C
    tempMax: Float;          // °C
    precipitation: Float;    // mm
    solarRadiation: Float;   // MJ/m²/day
    windSpeed: Float;        // m/s
    humidity: Float;         // %
  };

  public type GDDCalculation = {
    date: Int;
    tempMin: Float;
    tempMax: Float;
    tempMean: Float;
    baseTemp: Float;
    gddDaily: Float;
    gddCumulative: Float;
    phiModifier: Float;
  };

  public type PhotoperiodData = {
    location: GeoLocation;
    date: Int;
    dayOfYear: Nat;
    solarDeclination: Float;    // degrees
    daylength: Float;           // hours
    civilTwilight: Float;       // hours
    sunriseTime: Float;         // decimal hours
    sunsetTime: Float;          // decimal hours
    phiOptimalRatio: Float;
  };

  public type FrostRisk = {
    location: GeoLocation;
    date: Int;
    minTemperature: Float;
    frostProbability: Float;
    riskCategory: Text;
    pythagoreanRiskIndex: Float;
    protectionRequired: Bool;
    recommendations: [Text];
  };

  public type HarvestWindow = {
    cropId: Text;
    optimalStart: Int;
    optimalEnd: Int;
    fibonacciWindowDays: Nat;
    maturityIndex: Float;        // 0-1
    moistureContent: Float;      // %
    qualityPrediction: Float;    // 0-1
    yieldPotential: Float;       // % of max
    phiTimingScore: Float;
  };

  public type StressIndex = {
    cropId: Text;
    date: Int;
    heatStress: Float;
    coldStress: Float;
    droughtStress: Float;
    waterlogStress: Float;
    pythagoreanTotalStress: Float;
    yieldImpact: Float;          // % reduction
    recoveryPotential: Float;
  };

  public type SeasonalOutlook = {
    location: GeoLocation;
    season: Text;
    gddProjected: Float;
    frostFreeDays: Nat;
    growingSeasonLength: Nat;
    criticalDates: [{ event: Text; date: Int }];
    phiSeasonScore: Float;
  };

  public type ClimateAdaptation = {
    cropType: Text;
    currentLocation: GeoLocation;
    temperatureShift: Float;     // °C change
    adaptationScore: Float;
    recommendedVarieties: [Text];
    plantingDateShift: Nat;      // days
    phiResilienceIndex: Float;
  };

  // ══════════════════════════════════════════════════════════════════
  //  STATE — Phenological Memory
  // ══════════════════════════════════════════════════════════════════

  stable var modelCount : Nat = 0;

  var phenoModels = HashMap.HashMap<Text, PhenologicalModel>(10, Text.equal, Text.hash);
  var gddHistory = HashMap.HashMap<Text, [GDDCalculation]>(10, Text.equal, Text.hash);

  // ══════════════════════════════════════════════════════════════════
  //  CORE FUNCTIONS — Phenological Intelligence
  // ══════════════════════════════════════════════════════════════════

  /// Create phenological model with Fibonacci growth stages
  public func createPhenologicalModel(
    cropId: Text,
    cropType: Text,
    variety: Text,
    location: GeoLocation,
    plantingDate: Int
  ) : async PhenologicalModel {
    
    // Get base temperature for crop
    var baseTemp : Float = 10.0;
    for ((crop, temp) in BASE_TEMPS.vals()) {
      if (crop == cropType) { baseTemp := temp; };
    };
    
    // Generate Fibonacci-based growth stages
    let stagesBuffer = Buffer.Buffer<GrowthStage>(12);
    
    let stageDefinitions = [
      ("GERMINATION", 50.0, ["Monitor emergence", "Check soil moisture"]),
      ("EMERGENCE", 100.0, ["Scout for pests", "Verify stand count"]),
      ("SEEDLING", 200.0, ["Apply starter fertilizer", "Weed control"]),
      ("VEGETATIVE_EARLY", 400.0, ["Side-dress nitrogen", "Scout diseases"]),
      ("VEGETATIVE_LATE", 700.0, ["Monitor canopy closure", "Irrigation"]),
      ("REPRODUCTIVE", 1000.0, ["Protect pollinators", "Monitor stress"]),
      ("GRAIN_FILL", 1400.0, ["Maintain water", "Scout for lodging"]),
      ("MATURATION", 1800.0, ["Test moisture", "Prepare harvest"]),
      ("HARVEST_READY", 2000.0, ["Harvest", "Quality testing"])
    ];
    
    for (i in Iter.range(0, 8)) {
      let (name, gdd, actions) = stageDefinitions[i];
      let fibIndex = Nat.min(i, FIBONACCI_DAYS.size() - 1);
      
      stagesBuffer.add({
        stageId = cropId # "_STAGE_" # Nat.toText(i);
        stageName = name;
        fibonacciIndex = fibIndex;
        gddRequired = gdd;
        gddAccumulated = 0.0;
        progress = 0.0;
        startDate = null;
        endDate = null;
        actions = actions;
      });
    };
    
    // Estimate harvest date using GDD requirements and average temps
    let avgDailyGDD = 15.0;  // Simplified assumption
    let totalGDDRequired = 2000.0;
    let daysToHarvest = Int.abs(Float.toInt(totalGDDRequired / avgDailyGDD));
    let harvestDate = plantingDate + (daysToHarvest * 24 * 60 * 60 * 1_000_000_000);
    
    // φ-growth index based on location suitability
    let latitudeOptimal = 40.0;  // Optimal for many crops
    let latitudeDeviation = Float.abs(location.latitude - latitudeOptimal) / 45.0;
    let phiGrowthIndex = PHI_INVERSE + (1.0 - PHI_INVERSE) * (1.0 - latitudeDeviation);
    
    let model : PhenologicalModel = {
      cropId = cropId;
      cropType = cropType;
      variety = variety;
      location = location;
      plantingDate = plantingDate;
      baseTemperature = baseTemp;
      stages = Buffer.toArray(stagesBuffer);
      currentStageIndex = 0;
      totalGDD = 0.0;
      predictedHarvestDate = harvestDate;
      phiGrowthIndex = phiGrowthIndex;
    };
    
    phenoModels.put(cropId, model);
    modelCount += 1;
    
    return model;
  };

  /// Calculate Growing Degree Days with φ-modifiers
  /// GDD = max(0, (Tmax + Tmin)/2 - Tbase) × φ_modifier
  public func calculateGDD(
    cropId: Text,
    weatherData: [DailyWeather]
  ) : async [GDDCalculation] {
    
    let model = phenoModels.get(cropId);
    
    switch (model) {
      case null { return []; };
      case (?m) {
        let gddBuffer = Buffer.Buffer<GDDCalculation>(weatherData.size());
        var cumulative : Float = m.totalGDD;
        
        for (day in weatherData.vals()) {
          // Calculate mean temperature
          let tMean = (day.tempMax + day.tempMin) / 2.0;
          
          // Basic GDD calculation
          let gddBase = Float.max(0.0, tMean - m.baseTemperature);
          
          // φ-modifier based on temperature optimality
          // Optimal growth at 25-30°C for most crops
          let optimalTemp = 27.5;
          let tempDeviation = Float.abs(tMean - optimalTemp) / 15.0;
          let phiModifier = PHI_INVERSE + (1.0 - PHI_INVERSE) * (1.0 - Float.min(1.0, tempDeviation));
          
          let gddDaily = gddBase * phiModifier;
          cumulative += gddDaily;
          
          gddBuffer.add({
            date = day.date;
            tempMin = day.tempMin;
            tempMax = day.tempMax;
            tempMean = tMean;
            baseTemp = m.baseTemperature;
            gddDaily = gddDaily;
            gddCumulative = cumulative;
            phiModifier = phiModifier;
          });
        };
        
        let calculations = Buffer.toArray(gddBuffer);
        gddHistory.put(cropId, calculations);
        
        return calculations;
      };
    };
  };

  /// Calculate photoperiod (daylength) using astronomical equations
  /// Daylength = (24/π) × arccos(-tan(lat) × tan(dec))
  public func calculatePhotoperiod(
    location: GeoLocation,
    dayOfYear: Nat
  ) : async PhotoperiodData {
    
    // Solar declination angle
    // δ = 23.44° × sin(360/365 × (284 + day))
    let dayAngle = 2.0 * PI * (Float.fromInt(dayOfYear) + 284.0) / DAYS_PER_YEAR;
    let declination = EARTH_AXIAL_TILT * Float.sin(dayAngle);
    
    // Convert latitude to radians
    let latRad = location.latitude * DEG_TO_RAD;
    let decRad = declination * DEG_TO_RAD;
    
    // Hour angle at sunrise/sunset
    let cosHA = -Float.tan(latRad) * Float.tan(decRad);
    
    // Handle polar day/night
    let hourAngle = if (cosHA > 1.0) { 0.0 }      // Polar night
                    else if (cosHA < -1.0) { PI }  // Polar day
                    else { Float.arccos(cosHA) };
    
    // Daylength in hours
    let daylength = 24.0 * hourAngle / PI;
    
    // Sunrise and sunset times (solar noon = 12:00)
    let sunrise = 12.0 - (daylength / 2.0);
    let sunset = 12.0 + (daylength / 2.0);
    
    // Civil twilight (sun 6° below horizon)
    let civilTwilight = daylength + 0.83;  // Approximately 50 min added
    
    // φ-optimal ratio: many plants optimal at 14-16 hours
    let optimalDaylength = 15.0;
    let phiRatio = PHI_INVERSE + (1.0 - PHI_INVERSE) * 
                   (1.0 - Float.abs(daylength - optimalDaylength) / 12.0);
    
    return {
      location = location;
      date = Time.now();
      dayOfYear = dayOfYear;
      solarDeclination = declination;
      daylength = daylength;
      civilTwilight = civilTwilight;
      sunriseTime = sunrise;
      sunsetTime = sunset;
      phiOptimalRatio = phiRatio;
    };
  };

  /// Assess frost risk using Pythagorean temperature analysis
  public func assessFrostRisk(
    location: GeoLocation,
    forecastTemps: [{ date: Int; tempMin: Float }],
    cropCriticalTemp: Float
  ) : async [FrostRisk] {
    
    let risksBuffer = Buffer.Buffer<FrostRisk>(forecastTemps.size());
    
    for (forecast in forecastTemps.vals()) {
      // Temperature margin
      let margin = forecast.tempMin - cropCriticalTemp;
      
      // Frost probability based on margin (simplified model)
      let probability = if (margin <= 0.0) { 1.0 }
                        else if (margin >= 5.0) { 0.0 }
                        else { 1.0 - (margin / 5.0) };
      
      // Pythagorean risk index combining multiple factors
      // R² = temp_margin² + elevation_factor² + latitude_factor²
      let elevFactor = location.elevation / 1000.0;  // Higher = colder
      let latFactor = Float.abs(location.latitude) / 90.0;
      
      let riskSquared = Float.pow(Float.max(0.0, -margin) / 5.0, 2) +
                        Float.pow(elevFactor * 0.3, 2) +
                        Float.pow(latFactor * 0.2, 2);
      let pythagoreanRisk = Float.sqrt(riskSquared);
      
      // Risk category using φ thresholds
      let category = if (pythagoreanRisk >= PHI_INVERSE) { "HIGH" }
                     else if (pythagoreanRisk >= PHI_INVERSE * PHI_INVERSE) { "MODERATE" }
                     else { "LOW" };
      
      // Generate recommendations
      let recs = _generateFrostRecommendations(probability, margin);
      
      risksBuffer.add({
        location = location;
        date = forecast.date;
        minTemperature = forecast.tempMin;
        frostProbability = probability;
        riskCategory = category;
        pythagoreanRiskIndex = pythagoreanRisk;
        protectionRequired = probability > 0.5;
        recommendations = recs;
      });
    };
    
    return Buffer.toArray(risksBuffer);
  };

  /// Determine optimal harvest window using φ-weighted maturity indices
  public func determineHarvestWindow(
    cropId: Text,
    currentGDD: Float,
    moistureContent: Float,
    maturityIndicators: [{ indicator: Text; value: Float; optimal: Float }]
  ) : async HarvestWindow {
    
    // Calculate maturity index (weighted average of indicators)
    var maturitySum : Float = 0.0;
    var weightSum : Float = 0.0;
    var i : Nat = 0;
    
    for (ind in maturityIndicators.vals()) {
      let deviation = Float.abs(ind.value - ind.optimal) / ind.optimal;
      let score = 1.0 - Float.min(1.0, deviation);
      let phiWeight = Float.pow(PHI, -Float.fromInt(i));
      
      maturitySum += score * phiWeight;
      weightSum += phiWeight;
      i += 1;
    };
    
    let maturityIndex = maturitySum / weightSum;
    
    // Fibonacci window based on maturity
    let fibIndex = if (maturityIndex >= 0.9) { 2 }      // 2 days
                   else if (maturityIndex >= 0.8) { 3 } // 3 days
                   else if (maturityIndex >= 0.7) { 4 } // 5 days
                   else if (maturityIndex >= 0.6) { 5 } // 8 days
                   else { 6 };                          // 13 days
    
    let windowDays = FIBONACCI_DAYS[fibIndex];
    
    // Quality prediction based on timing
    let qualityPred = if (moistureContent >= 13.0 and moistureContent <= 15.0) {
      maturityIndex * PHI_INVERSE + (1.0 - PHI_INVERSE)
    } else {
      maturityIndex * PHI_INVERSE
    };
    
    // Yield potential
    let yieldPotential = maturityIndex * (1.0 - Float.abs(moistureContent - 14.0) / 20.0);
    
    // φ-timing score
    let phiTiming = maturityIndex * PHI_INVERSE + qualityPred * (1.0 - PHI_INVERSE);
    
    // Calculate optimal window dates
    let now = Time.now();
    let windowStart = now;
    let windowEnd = now + (windowDays * 24 * 60 * 60 * 1_000_000_000);
    
    return {
      cropId = cropId;
      optimalStart = windowStart;
      optimalEnd = windowEnd;
      fibonacciWindowDays = windowDays;
      maturityIndex = maturityIndex;
      moistureContent = moistureContent;
      qualityPrediction = qualityPred;
      yieldPotential = yieldPotential * 100.0;
      phiTimingScore = phiTiming;
    };
  };

  /// Calculate comprehensive stress index using Pythagorean method
  /// S² = heat² + cold² + drought² + waterlog²
  public func calculateStressIndex(
    cropId: Text,
    tempMax: Float,
    tempMin: Float,
    soilMoisture: Float,  // 0-1 (wilting point to field capacity)
    cropTempOptimal: Float
  ) : async StressIndex {
    
    // Heat stress
    let heatThreshold = cropTempOptimal + 10.0;
    let heatStress = if (tempMax > heatThreshold) {
      Float.min(1.0, (tempMax - heatThreshold) / 15.0)
    } else { 0.0 };
    
    // Cold stress
    let coldThreshold = cropTempOptimal - 15.0;
    let coldStress = if (tempMin < coldThreshold) {
      Float.min(1.0, (coldThreshold - tempMin) / 10.0)
    } else { 0.0 };
    
    // Drought stress (soil moisture < 0.3 is stressed)
    let droughtStress = if (soilMoisture < 0.3) {
      (0.3 - soilMoisture) / 0.3
    } else { 0.0 };
    
    // Waterlog stress (soil moisture > 0.9 is waterlogged)
    let waterlogStress = if (soilMoisture > 0.9) {
      (soilMoisture - 0.9) / 0.1
    } else { 0.0 };
    
    // Pythagorean total stress
    let totalStressSquared = Float.pow(heatStress, 2) + Float.pow(coldStress, 2) +
                             Float.pow(droughtStress, 2) + Float.pow(waterlogStress, 2);
    let totalStress = Float.sqrt(totalStressSquared);
    
    // Yield impact estimation
    let yieldImpact = totalStress * 100.0 * PHI_INVERSE;
    
    // Recovery potential (lower stress = higher recovery)
    let recovery = 1.0 - (totalStress * PHI_INVERSE);
    
    return {
      cropId = cropId;
      date = Time.now();
      heatStress = heatStress;
      coldStress = coldStress;
      droughtStress = droughtStress;
      waterlogStress = waterlogStress;
      pythagoreanTotalStress = totalStress;
      yieldImpact = yieldImpact;
      recoveryPotential = recovery;
    };
  };

  /// Generate seasonal outlook with critical dates
  public func generateSeasonalOutlook(
    location: GeoLocation,
    season: Text,
    historicalData: { avgGDD: Float; frostFreeDays: Nat; lastFrost: Nat; firstFrost: Nat }
  ) : async SeasonalOutlook {
    
    let criticalDatesBuffer = Buffer.Buffer<{ event: Text; date: Int }>(10);
    let now = Time.now();
    
    // Calculate critical dates (simplified - days from start of year)
    let dayInNs = 24 * 60 * 60 * 1_000_000_000;
    
    criticalDatesBuffer.add({ 
      event = "LAST_SPRING_FROST"; 
      date = now + (historicalData.lastFrost * dayInNs);
    });
    
    criticalDatesBuffer.add({
      event = "OPTIMAL_PLANTING_START";
      date = now + ((historicalData.lastFrost + 14) * dayInNs);
    });
    
    criticalDatesBuffer.add({
      event = "OPTIMAL_PLANTING_END";
      date = now + ((historicalData.lastFrost + 45) * dayInNs);
    });
    
    criticalDatesBuffer.add({
      event = "FIRST_FALL_FROST";
      date = now + (historicalData.firstFrost * dayInNs);
    });
    
    // Growing season length
    let seasonLength = if (historicalData.firstFrost > historicalData.lastFrost) {
      historicalData.firstFrost - historicalData.lastFrost
    } else { 180 };
    
    // φ-season score based on GDD and frost-free days
    let gddScore = Float.min(1.0, historicalData.avgGDD / 3000.0);
    let ffdScore = Float.min(1.0, Float.fromInt(historicalData.frostFreeDays) / 200.0);
    let phiScore = gddScore * PHI_INVERSE + ffdScore * (1.0 - PHI_INVERSE);
    
    return {
      location = location;
      season = season;
      gddProjected = historicalData.avgGDD;
      frostFreeDays = historicalData.frostFreeDays;
      growingSeasonLength = seasonLength;
      criticalDates = Buffer.toArray(criticalDatesBuffer);
      phiSeasonScore = phiScore;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  QUERY FUNCTIONS — Phenological Memory Access
  // ══════════════════════════════════════════════════════════════════

  public query func getPhenologicalModel(cropId: Text) : async ?PhenologicalModel {
    return phenoModels.get(cropId);
  };

  public query func getGDDHistory(cropId: Text) : async ?[GDDCalculation] {
    return gddHistory.get(cropId);
  };

  public query func getStatistics() : async { models: Nat } {
    return { models = modelCount };
  };

  public query func getFibonacciDays() : async [Nat] {
    return FIBONACCI_DAYS;
  };

  public query func getPhenologicalConstants() : async {
    phi: Float; earthTilt: Float; daysPerYear: Float;
  } {
    return {
      phi = PHI;
      earthTilt = EARTH_AXIAL_TILT;
      daysPerYear = DAYS_PER_YEAR;
    };
  };

  // ══════════════════════════════════════════════════════════════════
  //  PRIVATE HELPERS — Phenological Calculations
  // ══════════════════════════════════════════════════════════════════

  private func _generateFrostRecommendations(probability: Float, margin: Float) : [Text] {
    let recs = Buffer.Buffer<Text>(5);
    
    if (probability >= 0.8) {
      recs.add("CRITICAL: Deploy frost protection immediately");
      recs.add("Use irrigation for thermal protection if available");
      recs.add("Cover sensitive crops with row covers or blankets");
    } else if (probability >= 0.5) {
      recs.add("HIGH ALERT: Prepare frost protection measures");
      recs.add("Monitor temperatures closely overnight");
      recs.add("Have emergency covering materials ready");
    } else if (probability >= 0.2) {
      recs.add("WATCH: Frost possible, be prepared");
      recs.add("Check weather forecasts frequently");
    } else {
      recs.add("Low frost risk - continue normal operations");
    };
    
    if (margin < 2.0 and margin > 0.0) {
      recs.add("Marginal conditions - consider delaying planting");
    };
    
    return Buffer.toArray(recs);
  };
};
