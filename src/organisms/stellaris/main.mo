///
/// STELLARIS — Celestial Navigation and Timing Organism
///
/// "As above, so below. The stars are not mere lights — they are
///  the clocks of the universe, marking time in eternal rhythms."
///
/// STELLARIS implements celestial navigation and cosmic timing using
/// astronomical mathematics. It tracks celestial bodies, calculates
/// ephemerides, and provides timing aligned with cosmic cycles.
///
/// Sub-models hosted:
///   EPHEMERIS — Celestial body position calculation
///   CHRONOS   — Cosmic timing and calendar systems
///
/// Mathematical Foundation:
///   - Kepler's laws: T² ∝ a³ (orbital period)
///   - Precession: 25,920 years (Great Year)
///   - Metonic cycle: 19 years = 235 lunations
///   - Saros cycle: 18 years, 11 days, 8 hours (eclipse cycle)
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

persistent actor Stellaris {

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
  transient let TAU : Float = 6.28318530717958647692;
  transient let DEG_TO_RAD : Float = PI / 180.0;
  transient let RAD_TO_DEG : Float = 180.0 / PI;

  // Astronomical constants
  transient let JULIAN_DAY_J2000 : Float = 2451545.0;  // Jan 1, 2000, 12:00 TT
  transient let SIDEREAL_DAY_SEC : Float = 86164.0905;  // Sidereal day in seconds
  transient let TROPICAL_YEAR_DAYS : Float = 365.24219;
  transient let SYNODIC_MONTH_DAYS : Float = 29.530588853;
  transient let PRECESSION_YEARS : Float = 25920.0;  // Great Year
  transient let METONIC_YEARS : Float = 19.0;
  transient let SAROS_DAYS : Float = 6585.32;  // Eclipse cycle

  // ── Types ──────────────────────────────────────────────────────────

  public type CelestialBody = {
    #Sun;
    #Moon;
    #Mercury;
    #Venus;
    #Mars;
    #Jupiter;
    #Saturn;
    #Uranus;
    #Neptune;
    #NorthNode;   // Lunar nodes
    #SouthNode;
    #Star;        // Fixed star
  };

  public type ZodiacSign = {
    #Aries; #Taurus; #Gemini; #Cancer; #Leo; #Virgo;
    #Libra; #Scorpio; #Sagittarius; #Capricorn; #Aquarius; #Pisces;
  };

  /// Celestial coordinates (ecliptic or equatorial)
  public type CelestialCoord = {
    longitude  : Float;   // Degrees (0-360)
    latitude   : Float;   // Degrees (-90 to +90)
    distance   : Float;   // AU (astronomical units)
  };

  /// A tracked celestial object
  public type CelestialObject = {
    id         : Nat;
    body       : CelestialBody;
    name       : Text;
    coords     : CelestialCoord;
    velocity   : Float;   // Degrees per day
    retrograde : Bool;
    zodiacSign : ZodiacSign;
    timestamp  : Int;
    active     : Bool;
  };

  /// An astronomical event
  public type CelestialEvent = {
    id          : Nat;
    eventType   : EventType;
    bodies      : [CelestialBody];
    exactTime   : Int;    // Nanoseconds since epoch
    orb         : Float;  // Degrees of inexactness
    significance: Float;  // 0.0 to 1.0
    description : Text;
  };

  public type EventType = {
    #Conjunction;   // Same longitude
    #Opposition;    // 180° apart
    #Square;        // 90° apart
    #Trine;         // 120° apart
    #Sextile;       // 60° apart
    #Eclipse;       // Solar or lunar
    #Ingress;       // Entering new sign
    #Station;       // Retrograde/direct
  };

  /// A cosmic cycle
  public type CosmicCycle = {
    id          : Nat;
    name        : Text;
    periodDays  : Float;
    currentPhase: Float;  // 0.0 to 1.0
    startTime   : Int;
    bodies      : [CelestialBody];
    harmonic    : Nat;    // Fibonacci harmonic
  };

  /// Calendar system type
  public type CalendarType = {
    #Solar;      // Based on sun
    #Lunar;      // Based on moon
    #Solunar;    // Combined
    #Sidereal;   // Based on stars
    #Galactic;   // Based on galactic center
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextObjectId : Nat = 0;
  stable var nextEventId  : Nat = 0;
  stable var nextCycleId  : Nat = 0;
  stable var cosmicEpoch  : Nat = 0;

  transient let celestialObjects = Buffer.Buffer<CelestialObject>(32);
  transient let celestialEvents  = Buffer.Buffer<CelestialEvent>(64);
  transient let cosmicCycles     = Buffer.Buffer<CosmicCycle>(16);
  transient let stellarLog       = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: EPHEMERIS ───────────────────────────────────────────

  /// Register a celestial object
  public func track_body(
    body : CelestialBody,
    name : Text,
    longitude : Float,
    latitude : Float,
    distance : Float
  ) : async CelestialObject {
    let id = nextObjectId;
    nextObjectId += 1;

    let normalizedLon = normalizeDegrees(longitude);
    let zodiac = longitudeToZodiac(normalizedLon);

    let obj : CelestialObject = {
      id;
      body;
      name;
      coords = {
        longitude = normalizedLon;
        latitude;
        distance;
      };
      velocity = 0.0;
      retrograde = false;
      zodiacSign = zodiac;
      timestamp = Time.now();
      active = true;
    };

    celestialObjects.add(obj);
    stellarLog.add("EPHEMERIS: Tracking " # name # " at " #
                   Float.toText(normalizedLon) # "° " # zodiacToText(zodiac));

    obj
  };

  /// Update celestial body position
  public func update_position(
    objectId  : Nat,
    longitude : Float,
    latitude  : Float,
    distance  : Float
  ) : async ?CelestialObject {
    for (i in Iter.range(0, celestialObjects.size() - 1)) {
      let obj = celestialObjects.get(i);
      if (obj.id == objectId and obj.active) {
        let normalizedLon = normalizeDegrees(longitude);
        let zodiac = longitudeToZodiac(normalizedLon);

        // Calculate velocity (degrees per day)
        let timeDelta = Float.fromInt((Time.now() - obj.timestamp) / 1_000_000_000);
        let daysDelta = timeDelta / 86400.0;
        let lonDelta = normalizedLon - obj.coords.longitude;
        let velocity = if (daysDelta > 0.0) { lonDelta / daysDelta } else { 0.0 };

        // Check for retrograde (negative velocity)
        let retrograde = velocity < 0.0;

        let updated : CelestialObject = {
          id = obj.id;
          body = obj.body;
          name = obj.name;
          coords = {
            longitude = normalizedLon;
            latitude;
            distance;
          };
          velocity;
          retrograde;
          zodiacSign = zodiac;
          timestamp = Time.now();
          active = true;
        };

        celestialObjects.put(i, updated);

        // Check for sign ingress
        if (zodiac != obj.zodiacSign) {
          ignore await record_event(
            #Ingress,
            [obj.body],
            0.0,
            obj.name # " enters " # zodiacToText(zodiac)
          );
        };

        // Check for station (velocity changes direction)
        if (retrograde != obj.retrograde) {
          ignore await record_event(
            #Station,
            [obj.body],
            0.0,
            obj.name # " stations " # (if retrograde "retrograde" else "direct")
          );
        };

        return ?updated;
      };
    };
    null
  };

  /// Calculate aspect between two bodies
  public func calculate_aspect(objectId1 : Nat, objectId2 : Nat) : async ?{
    aspect : EventType;
    orb    : Float;
    exact  : Bool;
  } {
    var obj1 : ?CelestialObject = null;
    var obj2 : ?CelestialObject = null;

    for (o in celestialObjects.vals()) {
      if (o.id == objectId1 and o.active) { obj1 := ?o };
      if (o.id == objectId2 and o.active) { obj2 := ?o };
    };

    switch (obj1, obj2) {
      case (?o1, ?o2) {
        let diff = normalizeDegrees(o1.coords.longitude - o2.coords.longitude);

        // Check each aspect type
        let aspects : [(EventType, Float)] = [
          (#Conjunction, 0.0),
          (#Sextile, 60.0),
          (#Square, 90.0),
          (#Trine, 120.0),
          (#Opposition, 180.0),
        ];

        for ((aspect, angle) in aspects.vals()) {
          let orb = Float.min(
            Float.abs(diff - angle),
            Float.abs(360.0 - diff - angle)
          );

          // Allow 8° orb for major aspects
          if (orb < 8.0) {
            return ?{
              aspect;
              orb;
              exact = orb < 1.0;
            };
          };
        };

        null
      };
      case _ { null };
    }
  };

  /// Record a celestial event
  public func record_event(
    eventType   : EventType,
    bodies      : [CelestialBody],
    orb         : Float,
    description : Text
  ) : async CelestialEvent {
    let id = nextEventId;
    nextEventId += 1;

    // Calculate significance based on event type and bodies
    let baseSignificance = switch (eventType) {
      case (#Eclipse) { 1.0 };
      case (#Conjunction) { 0.9 };
      case (#Opposition) { 0.8 };
      case (#Trine) { 0.7 };
      case (#Square) { 0.6 };
      case (#Sextile) { 0.5 };
      case (#Ingress) { 0.4 };
      case (#Station) { 0.3 };
    };

    // Boost for luminaries (Sun, Moon)
    var luminaryBoost : Float = 0.0;
    for (b in bodies.vals()) {
      switch (b) {
        case (#Sun) { luminaryBoost += 0.1 };
        case (#Moon) { luminaryBoost += 0.05 };
        case _ {};
      };
    };

    let significance = Float.min(1.0, baseSignificance + luminaryBoost);

    let event : CelestialEvent = {
      id;
      eventType;
      bodies;
      exactTime = Time.now();
      orb;
      significance;
      description;
    };

    celestialEvents.add(event);
    stellarLog.add("EPHEMERIS: Event #" # Nat.toText(id) # " — " # description);

    event
  };

  // ── SUB-MODEL: CHRONOS ─────────────────────────────────────────────

  /// Register a cosmic cycle
  public func register_cycle(
    name       : Text,
    periodDays : Float,
    startTime  : Int,
    bodies     : [CelestialBody]
  ) : async CosmicCycle {
    let id = nextCycleId;
    nextCycleId += 1;

    // Calculate current phase
    let elapsed = Float.fromInt((Time.now() - startTime) / 1_000_000_000) / 86400.0;
    let currentPhase = (elapsed / periodDays) - Float.floor(elapsed / periodDays);

    // Find nearest Fibonacci harmonic
    let harmonic = nearestFibonacci(Float.toInt(periodDays));

    let cycle : CosmicCycle = {
      id;
      name;
      periodDays;
      currentPhase;
      startTime;
      bodies;
      harmonic;
    };

    cosmicCycles.add(cycle);
    stellarLog.add("CHRONOS: Registered cycle '" # name # "' period=" #
                   Float.toText(periodDays) # " days");

    cycle
  };

  /// Get current Julian Day Number
  public query func julian_day() : async Float {
    let unixTime = Float.fromInt(Time.now() / 1_000_000_000);
    let jd = unixTime / 86400.0 + 2440587.5;  // Unix epoch to JD
    jd
  };

  /// Get sidereal time for a given longitude
  public func sidereal_time(longitude : Float) : async Float {
    let jd = await julian_day();
    let t = (jd - JULIAN_DAY_J2000) / 36525.0;  // Julian centuries from J2000

    // Greenwich Mean Sidereal Time
    var gmst = 280.46061837 + 360.98564736629 * (jd - JULIAN_DAY_J2000) +
               t * t * (0.000387933 - t / 38710000.0);

    gmst := normalizeDegrees(gmst);

    // Local sidereal time
    let lst = normalizeDegrees(gmst + longitude);

    lst
  };

  /// Get lunar phase
  public func lunar_phase() : async {
    phase       : Float;      // 0.0 = new moon, 0.5 = full moon
    illumination: Float;      // 0.0 to 1.0
    phaseName   : Text;
    daysToFull  : Float;
  } {
    // Find Sun and Moon positions
    var sunLon : Float = 0.0;
    var moonLon : Float = 0.0;

    for (o in celestialObjects.vals()) {
      if (o.active) {
        switch (o.body) {
          case (#Sun) { sunLon := o.coords.longitude };
          case (#Moon) { moonLon := o.coords.longitude };
          case _ {};
        };
      };
    };

    // Calculate phase angle
    let elongation = normalizeDegrees(moonLon - sunLon);
    let phase = elongation / 360.0;

    // Calculate illumination (simplified)
    let illumination = (1.0 - Float.cos(elongation * DEG_TO_RAD)) / 2.0;

    // Phase name
    let phaseName = if (phase < 0.0625) { "New Moon" }
                    else if (phase < 0.1875) { "Waxing Crescent" }
                    else if (phase < 0.3125) { "First Quarter" }
                    else if (phase < 0.4375) { "Waxing Gibbous" }
                    else if (phase < 0.5625) { "Full Moon" }
                    else if (phase < 0.6875) { "Waning Gibbous" }
                    else if (phase < 0.8125) { "Last Quarter" }
                    else if (phase < 0.9375) { "Waning Crescent" }
                    else { "New Moon" };

    // Days to full moon
    let phaseToFull = if (phase < 0.5) { 0.5 - phase } else { 1.5 - phase };
    let daysToFull = phaseToFull * SYNODIC_MONTH_DAYS;

    {
      phase;
      illumination;
      phaseName;
      daysToFull;
    }
  };

  /// Get position in Great Year (precession cycle)
  public query func precessional_age() : async {
    age            : ZodiacSign;
    yearsIntoAge   : Float;
    yearsRemaining : Float;
    percentComplete: Float;
  } {
    // Age of Aquarius begins approximately 2150 CE
    // Each age is ~2160 years (25920/12)
    let ageLength = PRECESSION_YEARS / 12.0;

    // Simplified: assume we're transitioning into Aquarius now
    // Pisces began ~1 CE, Aquarius begins ~2150 CE
    let yearsIntoAge : Float = 0.0;  // Just starting Aquarius age
    let age = #Aquarius;

    {
      age;
      yearsIntoAge;
      yearsRemaining = ageLength - yearsIntoAge;
      percentComplete = yearsIntoAge / ageLength;
    }
  };

  // ── Helper Functions ───────────────────────────────────────────────

  func normalizeDegrees(d : Float) : Float {
    var deg = d;
    while (deg >= 360.0) { deg -= 360.0 };
    while (deg < 0.0) { deg += 360.0 };
    deg
  };

  func longitudeToZodiac(lon : Float) : ZodiacSign {
    let sign = Int.abs(Float.toInt(lon / 30.0)) % 12;
    switch (sign) {
      case 0 { #Aries };
      case 1 { #Taurus };
      case 2 { #Gemini };
      case 3 { #Cancer };
      case 4 { #Leo };
      case 5 { #Virgo };
      case 6 { #Libra };
      case 7 { #Scorpio };
      case 8 { #Sagittarius };
      case 9 { #Capricorn };
      case 10 { #Aquarius };
      case _ { #Pisces };
    }
  };

  func zodiacToText(z : ZodiacSign) : Text {
    switch (z) {
      case (#Aries) { "Aries" };
      case (#Taurus) { "Taurus" };
      case (#Gemini) { "Gemini" };
      case (#Cancer) { "Cancer" };
      case (#Leo) { "Leo" };
      case (#Virgo) { "Virgo" };
      case (#Libra) { "Libra" };
      case (#Scorpio) { "Scorpio" };
      case (#Sagittarius) { "Sagittarius" };
      case (#Capricorn) { "Capricorn" };
      case (#Aquarius) { "Aquarius" };
      case (#Pisces) { "Pisces" };
    }
  };

  func nearestFibonacci(n : Int) : Nat {
    let fibs = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377];
    var nearest : Nat = 1;
    var minDist : Int = Int.abs(n);

    for (f in fibs.vals()) {
      let dist = Int.abs(n - f);
      if (dist < minDist) {
        minDist := dist;
        nearest := f;
      };
    };
    nearest
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_celestial_objects() : async [CelestialObject] {
    let active = Buffer.Buffer<CelestialObject>(celestialObjects.size());
    for (o in celestialObjects.vals()) {
      if (o.active) { active.add(o) };
    };
    Buffer.toArray(active)
  };

  public query func list_events() : async [CelestialEvent] {
    Buffer.toArray(celestialEvents)
  };

  public query func list_cycles() : async [CosmicCycle] {
    Buffer.toArray(cosmicCycles)
  };

  public query func cosmic_state() : async {
    objects   : Nat;
    events    : Nat;
    cycles    : Nat;
    epoch     : Nat;
  } {
    var activeObjects : Nat = 0;
    for (o in celestialObjects.vals()) { if (o.active) { activeObjects += 1 } };

    {
      objects = activeObjects;
      events = celestialEvents.size();
      cycles = cosmicCycles.size();
      epoch = cosmicEpoch;
    }
  };

  public query func get_stellar_log() : async [Text] {
    Buffer.toArray(stellarLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "STELLARIS" };

  public query func designation() : async Text {
    "Celestial Navigation and Timing — As above, so below"
  };

  public func register() : async Text {
    "STELLARIS registered. Capabilities: [ephemeris, celestial-events, cosmic-timing, lunar-phases]."
  };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    objects   : Nat;
    events    : Nat;
    timestamp : Int;
  } {
    var activeObjects : Nat = 0;
    for (o in celestialObjects.vals()) { if (o.active) { activeObjects += 1 } };

    let health = if (activeObjects >= 2) { PHI_INVERSE + 0.3 } else { 0.5 };

    {
      status = if (activeObjects >= 2) "CELESTIAL_ALIGNED" else "CELESTIAL_SPARSE";
      health;
      objects = activeObjects;
      events = celestialEvents.size();
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    cosmicEpoch += 1;
    "STELLARIS heal: Cosmic epoch advanced to " # Nat.toText(cosmicEpoch) # "."
  };

  public query func report_status() : async Text {
    var ao : Nat = 0;
    for (o in celestialObjects.vals()) { if (o.active) { ao += 1 } };
    "STELLARIS | objects=" # Nat.toText(ao) #
    " events=" # Nat.toText(celestialEvents.size()) #
    " cycles=" # Nat.toText(cosmicCycles.size())
  };
};
