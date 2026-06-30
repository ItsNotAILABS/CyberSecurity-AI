///
/// SIGNALFORGE — Signal Processing Intelligence Organism
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// Mathematical Foundation:
///   - Fourier Transform: F(ω) = ∫f(t)e^(-iωt)dt
///   - Nyquist Theorem: fs ≥ 2·fmax
///   - Pythagorean Signal Quality: SQ² = S² + N² + B²
///

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";

persistent actor SIGNALFORGE {

  transient let PHI : Float = 1.6180339887498949;
  transient let PHI_SQUARED : Float = 2.6180339887498949;
  transient let PHI_INVERSE : Float = 0.6180339887498949;
  transient let PI : Float = 3.14159265358979323;
  transient let SQRT_2 : Float = 1.41421356237309505;

  public type SignalProfile = {
    signalId: Text;
    sampleRate: Float;      // Hz
    bandwidth: Float;       // Hz
    peakAmplitude: Float;   // normalized
    rmsAmplitude: Float;    // normalized
    snr: Float;             // dB
    crestFactor: Float;
  };

  public type SignalQuality = {
    signalId: Text;
    signalStrength: Float;
    noiseLevel: Float;
    distortion: Float;
    pythagoreanQuality: Float;
    phiOptimalScore: Float;
    timestamp: Int;
  };

  public type FilterDesign = {
    filterType: Text;       // lowpass, highpass, bandpass
    cutoffFrequency: Float;
    order: Nat;
    phiCoefficients: [Float];
    passband: Float;
    stopband: Float;
  };

  public type ModulationAnalysis = {
    modulationType: Text;
    symbolRate: Float;
    bitsPerSymbol: Nat;
    spectralEfficiency: Float;
    berEstimate: Float;
    phiPerformance: Float;
  };

  stable var signalCount : Nat = 0;
  var signals = HashMap.HashMap<Text, SignalProfile>(20, Text.equal, Text.hash);

  /// Analyze signal and create profile
  public func analyzeSignal(
    signalId: Text,
    samples: [Float],
    sampleRate: Float
  ) : async SignalProfile {
    let n = samples.size();
    if (n == 0) {
      return {
        signalId = signalId;
        sampleRate = sampleRate;
        bandwidth = 0.0;
        peakAmplitude = 0.0;
        rmsAmplitude = 0.0;
        snr = 0.0;
        crestFactor = 1.0;
      };
    };
    
    // Calculate peak amplitude
    var peak : Float = 0.0;
    var sumSquares : Float = 0.0;
    
    for (sample in samples.vals()) {
      let absSample = Float.abs(sample);
      if (absSample > peak) { peak := absSample; };
      sumSquares += sample * sample;
    };
    
    // RMS amplitude
    let rms = Float.sqrt(sumSquares / Float.fromInt(n));
    
    // Crest factor (peak/RMS)
    let crest = if (rms > 0.0) { peak / rms } else { 1.0 };
    
    // Bandwidth estimate (Nyquist)
    let bandwidth = sampleRate / 2.0;
    
    // SNR estimate (simplified)
    let snr = 20.0 * Float.log(peak / 0.001) / Float.log(10.0);
    
    let profile : SignalProfile = {
      signalId = signalId;
      sampleRate = sampleRate;
      bandwidth = bandwidth;
      peakAmplitude = peak;
      rmsAmplitude = rms;
      snr = snr;
      crestFactor = crest;
    };
    
    signals.put(signalId, profile);
    signalCount += 1;
    
    return profile;
  };

  /// Calculate Pythagorean Signal Quality
  /// SQ² = (Signal)² + (1-Noise)² + (Bandwidth_efficiency)²
  public func calculateSignalQuality(
    signalStrength: Float,  // 0-1
    noiseLevel: Float,      // 0-1
    bandwidthEfficiency: Float  // 0-1
  ) : async SignalQuality {
    // Pythagorean calculation
    let qualitySquared = 
      Float.pow(signalStrength, 2) +
      Float.pow(1.0 - noiseLevel, 2) +
      Float.pow(bandwidthEfficiency, 2);
    
    let pythagoreanQuality = Float.sqrt(qualitySquared) / 1.732;  // Normalize by √3
    
    // φ-optimal score (optimal at φ threshold)
    let phiScore = if (pythagoreanQuality >= PHI_INVERSE) {
      PHI_INVERSE + (1.0 - PHI_INVERSE) * (pythagoreanQuality - PHI_INVERSE) / (1.0 - PHI_INVERSE)
    } else {
      pythagoreanQuality / PHI_INVERSE * PHI_INVERSE
    };
    
    return {
      signalId = "QUALITY_CALC";
      signalStrength = signalStrength;
      noiseLevel = noiseLevel;
      distortion = 1.0 - bandwidthEfficiency;
      pythagoreanQuality = pythagoreanQuality;
      phiOptimalScore = phiScore;
      timestamp = Time.now();
    };
  };

  /// Design φ-coefficient filter
  public func designPhiFilter(
    filterType: Text,
    cutoffFrequency: Float,
    order: Nat
  ) : async FilterDesign {
    // Generate φ-based filter coefficients
    let coeffBuffer = Buffer.Buffer<Float>(order + 1);
    
    for (i in Array.vals(Array.tabulate<Nat>(order + 1, func(x) { x }))) {
      let phiCoeff = Float.pow(PHI_INVERSE, Float.fromInt(i));
      coeffBuffer.add(phiCoeff);
    };
    
    // Normalize coefficients
    var sum : Float = 0.0;
    for (c in coeffBuffer.vals()) { sum += c; };
    
    let normalizedBuffer = Buffer.Buffer<Float>(order + 1);
    for (c in coeffBuffer.vals()) {
      normalizedBuffer.add(c / sum);
    };
    
    return {
      filterType = filterType;
      cutoffFrequency = cutoffFrequency;
      order = order;
      phiCoefficients = Buffer.toArray(normalizedBuffer);
      passband = PHI_INVERSE;
      stopband = 1.0 - PHI_INVERSE;
    };
  };

  /// Analyze modulation scheme
  public func analyzeModulation(
    modulationType: Text,
    symbolRate: Float,
    snr: Float
  ) : async ModulationAnalysis {
    // Determine bits per symbol based on modulation
    let bitsPerSymbol : Nat = switch (modulationType) {
      case "BPSK" { 1 };
      case "QPSK" { 2 };
      case "8PSK" { 3 };
      case "16QAM" { 4 };
      case "64QAM" { 6 };
      case "256QAM" { 8 };
      case _ { 2 };
    };
    
    // Spectral efficiency (bits/s/Hz)
    let spectralEfficiency = Float.fromInt(bitsPerSymbol);
    
    // BER estimate (simplified AWGN)
    let snrLinear = Float.pow(10.0, snr / 10.0);
    let berEstimate = 0.5 * Float.exp(-snrLinear / Float.fromInt(bitsPerSymbol));
    
    // φ-performance based on efficiency vs reliability tradeoff
    let phiPerformance = spectralEfficiency * PHI_INVERSE / 8.0 + 
                         (1.0 - berEstimate) * (1.0 - PHI_INVERSE);
    
    return {
      modulationType = modulationType;
      symbolRate = symbolRate;
      bitsPerSymbol = bitsPerSymbol;
      spectralEfficiency = spectralEfficiency;
      berEstimate = berEstimate;
      phiPerformance = phiPerformance;
    };
  };

  public query func getSignalCount() : async Nat { return signalCount; };
};
