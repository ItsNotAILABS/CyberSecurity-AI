///
/// PRISM — Light Spectrum Analysis Organism
///
/// "Light is the messenger of the cosmos. Through the prism,
///  we decode its secrets — each wavelength a letter in
///  nature's alphabet."
///
/// PRISM implements spectral analysis using the mathematics of
/// light and color. It decomposes signals into their spectral
/// components and identifies harmonic relationships.
///
/// Sub-models hosted:
///   SPECTRUM  — Spectral decomposition and frequency analysis
///   CHROMATIC — Color space transformations and harmony
///
/// Mathematical Foundation:
///   - Fourier transform: F(ω) = ∫ f(t)e^(-iωt) dt
///   - Planck's law: B(λ,T) = (2hc²/λ⁵) / (e^(hc/λkT) - 1)
///   - Wien's displacement: λ_max = b/T (peak wavelength)
///   - Spectral power: P = ∫ I(λ) dλ
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

persistent actor Prism {

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
  transient let E : Float = 2.71828182845904523536;

  // Light constants (normalized)
  transient let SPEED_OF_LIGHT : Float = 299792458.0;  // m/s
  transient let PLANCK_CONSTANT : Float = 6.62607015e-34;  // J·s
  transient let WIEN_CONSTANT : Float = 2897771.955;  // nm·K

  // Visible spectrum (nm)
  transient let VIOLET_MIN : Float = 380.0;
  transient let BLUE : Float = 450.0;
  transient let CYAN : Float = 495.0;
  transient let GREEN : Float = 530.0;
  transient let YELLOW : Float = 575.0;
  transient let ORANGE : Float = 590.0;
  transient let RED_MAX : Float = 700.0;

  // ── Types ──────────────────────────────────────────────────────────

  public type SpectralBand = {
    #Infrared;
    #Red;
    #Orange;
    #Yellow;
    #Green;
    #Cyan;
    #Blue;
    #Violet;
    #Ultraviolet;
  };

  public type ColorSpace = {
    #RGB;
    #HSV;
    #HSL;
    #CMYK;
    #XYZ;
    #Lab;
  };

  /// A spectral line (emission or absorption)
  public type SpectralLine = {
    id          : Nat;
    wavelength  : Float;      // nm
    intensity   : Float;      // Relative intensity (0.0-1.0)
    width       : Float;      // Line width (nm)
    band        : SpectralBand;
    emission    : Bool;       // true = emission, false = absorption
    source      : Text;       // Element or source name
    timestamp   : Int;
  };

  /// A complete spectrum
  public type Spectrum = {
    id          : Nat;
    name        : Text;
    lines       : [SpectralLine];
    continuous  : Bool;       // Has continuous component
    temperature : ?Float;     // Blackbody temperature if applicable
    peakWL      : Float;      // Peak wavelength
    totalPower  : Float;      // Integrated spectral power
    timestamp   : Int;
    active      : Bool;
  };

  /// A color in multiple spaces
  public type Color = {
    id          : Nat;
    name        : Text;
    wavelength  : ?Float;     // Dominant wavelength if spectral
    rgb         : [Float];    // [r, g, b] normalized 0-1
    hsv         : [Float];    // [h, s, v]
    harmony     : Float;      // Color harmony score (φ-based)
    complement  : ?Nat;       // Complementary color ID
    timestamp   : Int;
  };

  /// A Fourier component
  public type FrequencyComponent = {
    frequency   : Float;      // Hz
    amplitude   : Float;      // Magnitude
    phase       : Float;      // Phase angle (radians)
    power       : Float;      // amplitude²
  };

  /// Spectral analysis result
  public type SpectralAnalysis = {
    id          : Nat;
    components  : [FrequencyComponent];
    fundamental : Float;      // Fundamental frequency
    harmonics   : [Float];    // Harmonic frequencies
    bandwidth   : Float;      // Total bandwidth
    entropy     : Float;      // Spectral entropy
    timestamp   : Int;
  };

  /// Color harmony type
  public type HarmonyType = {
    #Complementary;   // 180° apart
    #Analogous;       // Adjacent colors
    #Triadic;         // 120° apart
    #SplitComplementary;
    #Tetradic;        // 90° apart
    #Golden;          // φ ratio relationships
  };

  // ── State ──────────────────────────────────────────────────────────

  stable var nextLineId     : Nat = 0;
  stable var nextSpectrumId : Nat = 0;
  stable var nextColorId    : Nat = 0;
  stable var nextAnalysisId : Nat = 0;
  stable var spectralEpoch  : Nat = 0;

  transient let spectralLines = Buffer.Buffer<SpectralLine>(64);
  transient let spectra       = Buffer.Buffer<Spectrum>(16);
  transient let colors        = Buffer.Buffer<Color>(32);
  transient let analyses      = Buffer.Buffer<SpectralAnalysis>(32);
  transient let prismLog      = Buffer.Buffer<Text>(256);

  // ── SUB-MODEL: SPECTRUM ────────────────────────────────────────────

  /// Add a spectral line
  public func add_spectral_line(
    wavelength : Float,
    intensity  : Float,
    width      : Float,
    emission   : Bool,
    source     : Text
  ) : async SpectralLine {
    let id = nextLineId;
    nextLineId += 1;

    let band = wavelengthToBand(wavelength);

    let line : SpectralLine = {
      id;
      wavelength;
      intensity = Float.min(1.0, Float.max(0.0, intensity));
      width;
      band;
      emission;
      source;
      timestamp = Time.now();
    };

    spectralLines.add(line);
    prismLog.add("SPECTRUM: Added " # (if emission "emission" else "absorption") #
                 " line at " # Float.toText(wavelength) # " nm (" # source # ")");

    line
  };

  /// Create a spectrum from lines
  public func create_spectrum(
    name        : Text,
    lineIds     : [Nat],
    temperature : ?Float
  ) : async Spectrum {
    let id = nextSpectrumId;
    nextSpectrumId += 1;

    // Gather lines
    let lines = Buffer.Buffer<SpectralLine>(lineIds.size());
    for (lid in lineIds.vals()) {
      for (l in spectralLines.vals()) {
        if (l.id == lid) { lines.add(l) };
      };
    };

    // Calculate peak wavelength and total power
    var peakWL : Float = 550.0;  // Default green
    var peakIntensity : Float = 0.0;
    var totalPower : Float = 0.0;

    for (l in lines.vals()) {
      totalPower += l.intensity * l.width;
      if (l.intensity > peakIntensity) {
        peakIntensity := l.intensity;
        peakWL := l.wavelength;
      };
    };

    // If temperature given, use Wien's law for peak
    switch (temperature) {
      case (?t) {
        if (t > 0.0) { peakWL := WIEN_CONSTANT / t };
      };
      case null {};
    };

    let spectrum : Spectrum = {
      id;
      name;
      lines = Buffer.toArray(lines);
      continuous = temperature != null;
      temperature;
      peakWL;
      totalPower;
      timestamp = Time.now();
      active = true;
    };

    spectra.add(spectrum);
    prismLog.add("SPECTRUM: Created spectrum '" # name # "' with " #
                 Nat.toText(lines.size()) # " lines");

    spectrum
  };

  /// Perform discrete Fourier transform on a signal
  public func fourier_transform(signal : [Float]) : async SpectralAnalysis {
    let n = signal.size();
    if (n == 0) {
      let id = nextAnalysisId;
      nextAnalysisId += 1;
      return {
        id;
        components = [];
        fundamental = 0.0;
        harmonics = [];
        bandwidth = 0.0;
        entropy = 0.0;
        timestamp = Time.now();
      };
    };

    // DFT computation (simplified)
    let components = Buffer.Buffer<FrequencyComponent>(n / 2);
    var maxAmp : Float = 0.0;
    var fundamentalFreq : Float = 0.0;

    for (k in Iter.range(0, n / 2 - 1)) {
      var realSum : Float = 0.0;
      var imagSum : Float = 0.0;

      for (t in Iter.range(0, n - 1)) {
        let angle = -TAU * Float.fromInt(k) * Float.fromInt(t) / Float.fromInt(n);
        realSum += signal[t] * Float.cos(angle);
        imagSum += signal[t] * Float.sin(angle);
      };

      let amplitude = Float.sqrt(realSum * realSum + imagSum * imagSum) / Float.fromInt(n);
      let phase = Float.atan2(imagSum, realSum);
      let frequency = Float.fromInt(k);

      components.add({
        frequency;
        amplitude;
        phase;
        power = amplitude * amplitude;
      });

      if (amplitude > maxAmp and k > 0) {
        maxAmp := amplitude;
        fundamentalFreq := frequency;
      };
    };

    // Find harmonics (multiples of fundamental)
    let harmonics = Buffer.Buffer<Float>(8);
    var m : Nat = 2;
    while (m <= 8) {
      let harmFreq = fundamentalFreq * Float.fromInt(m);
      if (harmFreq < Float.fromInt(n / 2)) {
        harmonics.add(harmFreq);
      };
      m += 1;
    };

    // Calculate spectral entropy
    var totalPower : Float = 0.0;
    for (c in components.vals()) { totalPower += c.power };

    var entropy : Float = 0.0;
    if (totalPower > 0.0) {
      for (c in components.vals()) {
        let p = c.power / totalPower;
        if (p > 0.0) {
          entropy -= p * Float.log(p) / Float.log(2.0);
        };
      };
    };

    let id = nextAnalysisId;
    nextAnalysisId += 1;

    let analysis : SpectralAnalysis = {
      id;
      components = Buffer.toArray(components);
      fundamental = fundamentalFreq;
      harmonics = Buffer.toArray(harmonics);
      bandwidth = Float.fromInt(n / 2);
      entropy;
      timestamp = Time.now();
    };

    analyses.add(analysis);
    prismLog.add("SPECTRUM: Fourier analysis #" # Nat.toText(id) #
                 " f0=" # Float.toText(fundamentalFreq));

    analysis
  };

  // ── SUB-MODEL: CHROMATIC ───────────────────────────────────────────

  /// Create a color from RGB values
  public func create_color_rgb(
    name : Text,
    r    : Float,
    g    : Float,
    b    : Float
  ) : async Color {
    let id = nextColorId;
    nextColorId += 1;

    // Normalize RGB to 0-1
    let rgb = [
      Float.min(1.0, Float.max(0.0, r)),
      Float.min(1.0, Float.max(0.0, g)),
      Float.min(1.0, Float.max(0.0, b))
    ];

    // Convert to HSV
    let hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);

    // Estimate dominant wavelength
    let wavelength = hueToWavelength(hsv[0]);

    // Calculate color harmony score using golden ratio
    let harmony = Float.abs(Float.cos(hsv[0] * TAU * PHI)) * hsv[1] * hsv[2];

    let color : Color = {
      id;
      name;
      wavelength = ?wavelength;
      rgb;
      hsv;
      harmony;
      complement = null;
      timestamp = Time.now();
    };

    colors.add(color);
    prismLog.add("CHROMATIC: Created color '" # name # "' harmony=" #
                 Float.toText(harmony));

    color
  };

  /// Create a color from wavelength
  public func create_color_wavelength(
    name       : Text,
    wavelength : Float
  ) : async Color {
    let id = nextColorId;
    nextColorId += 1;

    // Convert wavelength to RGB (simplified)
    let rgb = wavelengthToRgb(wavelength);
    let hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    let harmony = Float.abs(Float.cos(hsv[0] * TAU * PHI)) * hsv[1] * hsv[2];

    let color : Color = {
      id;
      name;
      wavelength = ?wavelength;
      rgb;
      hsv;
      harmony;
      complement = null;
      timestamp = Time.now();
    };

    colors.add(color);
    prismLog.add("CHROMATIC: Created color '" # name # "' at " #
                 Float.toText(wavelength) # " nm");

    color
  };

  /// Find complementary color
  public func find_complement(colorId : Nat) : async ?Color {
    for (i in Iter.range(0, colors.size() - 1)) {
      let c = colors.get(i);
      if (c.id == colorId) {
        // Complementary: shift hue by 180°
        let compHue = if (c.hsv[0] > 0.5) { c.hsv[0] - 0.5 } else { c.hsv[0] + 0.5 };
        let compHsv = [compHue, c.hsv[1], c.hsv[2]];

        let compRgb = hsvToRgb(compHsv[0], compHsv[1], compHsv[2]);
        let compWavelength = hueToWavelength(compHue);

        let compId = nextColorId;
        nextColorId += 1;

        let complement : Color = {
          id = compId;
          name = c.name # " complement";
          wavelength = ?compWavelength;
          rgb = compRgb;
          hsv = compHsv;
          harmony = Float.abs(Float.cos(compHue * TAU * PHI)) * c.hsv[1] * c.hsv[2];
          complement = ?colorId;
          timestamp = Time.now();
        };

        colors.add(complement);

        // Update original with complement reference
        colors.put(i, {
          id = c.id;
          name = c.name;
          wavelength = c.wavelength;
          rgb = c.rgb;
          hsv = c.hsv;
          harmony = c.harmony;
          complement = ?compId;
          timestamp = c.timestamp;
        });

        return ?complement;
      };
    };
    null
  };

  /// Generate color harmony palette
  public func generate_harmony(colorId : Nat, harmonyType : HarmonyType) : async [Color] {
    let result = Buffer.Buffer<Color>(5);

    for (c in colors.vals()) {
      if (c.id == colorId) {
        result.add(c);

        let shifts : [Float] = switch (harmonyType) {
          case (#Complementary) { [0.5] };
          case (#Analogous) { [-1.0/12.0, 1.0/12.0] };
          case (#Triadic) { [1.0/3.0, 2.0/3.0] };
          case (#SplitComplementary) { [5.0/12.0, 7.0/12.0] };
          case (#Tetradic) { [0.25, 0.5, 0.75] };
          case (#Golden) { [PHI_INVERSE, PHI_INVERSE * 2.0] };  // Golden ratio shifts
        };

        for (shift in shifts.vals()) {
          var newHue = c.hsv[0] + shift;
          while (newHue >= 1.0) { newHue -= 1.0 };
          while (newHue < 0.0) { newHue += 1.0 };

          let newHsv = [newHue, c.hsv[1], c.hsv[2]];
          let newRgb = hsvToRgb(newHsv[0], newHsv[1], newHsv[2]);

          let newId = nextColorId;
          nextColorId += 1;

          let newColor : Color = {
            id = newId;
            name = c.name # " harmony";
            wavelength = ?hueToWavelength(newHue);
            rgb = newRgb;
            hsv = newHsv;
            harmony = Float.abs(Float.cos(newHue * TAU * PHI)) * c.hsv[1] * c.hsv[2];
            complement = null;
            timestamp = Time.now();
          };

          colors.add(newColor);
          result.add(newColor);
        };
      };
    };

    Buffer.toArray(result)
  };

  // ── Helper Functions ───────────────────────────────────────────────

  func wavelengthToBand(wl : Float) : SpectralBand {
    if (wl < VIOLET_MIN) { return #Ultraviolet };
    if (wl < BLUE) { return #Violet };
    if (wl < CYAN) { return #Blue };
    if (wl < GREEN) { return #Cyan };
    if (wl < YELLOW) { return #Green };
    if (wl < ORANGE) { return #Yellow };
    if (wl < RED_MAX) { return #Orange };
    if (wl <= RED_MAX) { return #Red };
    #Infrared
  };

  func wavelengthToRgb(wl : Float) : [Float] {
    // Simplified wavelength to RGB conversion
    var r : Float = 0.0;
    var g : Float = 0.0;
    var b : Float = 0.0;

    if (wl >= 380.0 and wl < 440.0) {
      r := -(wl - 440.0) / (440.0 - 380.0);
      g := 0.0;
      b := 1.0;
    } else if (wl >= 440.0 and wl < 490.0) {
      r := 0.0;
      g := (wl - 440.0) / (490.0 - 440.0);
      b := 1.0;
    } else if (wl >= 490.0 and wl < 510.0) {
      r := 0.0;
      g := 1.0;
      b := -(wl - 510.0) / (510.0 - 490.0);
    } else if (wl >= 510.0 and wl < 580.0) {
      r := (wl - 510.0) / (580.0 - 510.0);
      g := 1.0;
      b := 0.0;
    } else if (wl >= 580.0 and wl < 645.0) {
      r := 1.0;
      g := -(wl - 645.0) / (645.0 - 580.0);
      b := 0.0;
    } else if (wl >= 645.0 and wl <= 700.0) {
      r := 1.0;
      g := 0.0;
      b := 0.0;
    };

    [r, g, b]
  };

  func rgbToHsv(r : Float, g : Float, b : Float) : [Float] {
    let max = Float.max(r, Float.max(g, b));
    let min = Float.min(r, Float.min(g, b));
    let delta = max - min;

    var h : Float = 0.0;
    var s : Float = 0.0;
    let v : Float = max;

    if (delta > 0.0) {
      s := delta / max;

      if (max == r) {
        h := (g - b) / delta;
        if (g < b) { h += 6.0 };
      } else if (max == g) {
        h := 2.0 + (b - r) / delta;
      } else {
        h := 4.0 + (r - g) / delta;
      };
      h := h / 6.0;
    };

    [h, s, v]
  };

  func hsvToRgb(h : Float, s : Float, v : Float) : [Float] {
    if (s == 0.0) { return [v, v, v] };

    let i = Float.floor(h * 6.0);
    let f = h * 6.0 - i;
    let p = v * (1.0 - s);
    let q = v * (1.0 - f * s);
    let t = v * (1.0 - (1.0 - f) * s);

    let sector = Int.abs(Float.toInt(i)) % 6;

    switch (sector) {
      case 0 { [v, t, p] };
      case 1 { [q, v, p] };
      case 2 { [p, v, t] };
      case 3 { [p, q, v] };
      case 4 { [t, p, v] };
      case _ { [v, p, q] };
    }
  };

  func hueToWavelength(h : Float) : Float {
    // Map hue (0-1) to wavelength (380-700 nm)
    // Red (h=0) -> 700nm, Blue (h=0.67) -> 450nm
    let invertedHue = 1.0 - h;
    380.0 + invertedHue * 320.0
  };

  // ── Queries ────────────────────────────────────────────────────────

  public query func list_spectral_lines() : async [SpectralLine] {
    Buffer.toArray(spectralLines)
  };

  public query func list_spectra() : async [Spectrum] {
    let active = Buffer.Buffer<Spectrum>(spectra.size());
    for (s in spectra.vals()) { if (s.active) { active.add(s) } };
    Buffer.toArray(active)
  };

  public query func list_colors() : async [Color] {
    Buffer.toArray(colors)
  };

  public query func list_analyses() : async [SpectralAnalysis] {
    Buffer.toArray(analyses)
  };

  public query func spectral_state() : async {
    lines    : Nat;
    spectra  : Nat;
    colors   : Nat;
    analyses : Nat;
    epoch    : Nat;
  } {
    var activeSpectra : Nat = 0;
    for (s in spectra.vals()) { if (s.active) { activeSpectra += 1 } };

    {
      lines = spectralLines.size();
      spectra = activeSpectra;
      colors = colors.size();
      analyses = analyses.size();
      epoch = spectralEpoch;
    }
  };

  public query func get_prism_log() : async [Text] {
    Buffer.toArray(prismLog)
  };

  // ── Identity ───────────────────────────────────────────────────────

  public query func name() : async Text { "PRISM" };

  public query func designation() : async Text {
    "Light Spectrum Analysis — Each wavelength a letter in nature's alphabet"
  };

  public func register() : async Text {
    "PRISM registered. Capabilities: [spectral-analysis, fourier, color-harmony, wavelength-conversion]."
  };

  public query func diag() : async {
    status    : Text;
    health    : Float;
    spectra   : Nat;
    colors    : Nat;
    timestamp : Int;
  } {
    var activeSpectra : Nat = 0;
    for (s in spectra.vals()) { if (s.active) { activeSpectra += 1 } };

    let health = if (activeSpectra > 0 or colors.size() > 0) { PHI_INVERSE + 0.3 }
                 else { 0.5 };

    {
      status = if (activeSpectra > 0) "SPECTRUM_ACTIVE" else "SPECTRUM_IDLE";
      health;
      spectra = activeSpectra;
      colors = colors.size();
      timestamp = Time.now();
    }
  };

  public func heal() : async Text {
    spectralEpoch += 1;
    "PRISM heal: Spectral epoch advanced to " # Nat.toText(spectralEpoch) # "."
  };

  public query func report_status() : async Text {
    var as_ : Nat = 0;
    for (s in spectra.vals()) { if (s.active) { as_ += 1 } };
    "PRISM | lines=" # Nat.toText(spectralLines.size()) #
    " spectra=" # Nat.toText(as_) #
    " colors=" # Nat.toText(colors.size()) #
    " analyses=" # Nat.toText(analyses.size())
  };
};
