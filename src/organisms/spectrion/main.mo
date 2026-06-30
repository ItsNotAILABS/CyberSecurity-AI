///
/// SPECTRION — Spectrum Intelligence Organism
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// Mathematical Foundation:
///   - Fourier Analysis: Frequency domain transformations
///   - Shannon Capacity: C = B·log₂(1 + SNR)
///   - Golden Ratio spectrum partitioning
///

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";

persistent actor SPECTRION {

  transient let PHI : Float = 1.6180339887498949;
  transient let PHI_INVERSE : Float = 0.6180339887498949;
  transient let LOG2_E : Float = 1.44269504088896341;

  public type FrequencyBand = {
    bandId: Text;
    centerFrequency: Float;   // MHz
    bandwidth: Float;         // MHz
    currentUtilization: Float;
    noiseFloor: Float;        // dBm
    maxPower: Float;          // dBm
  };

  public type SpectrumAllocation = {
    bandId: Text;
    allocatedBandwidth: Float;
    channelCapacity: Float;   // Mbps (Shannon)
    interferenceLevel: Float;
    phiEfficiency: Float;
  };

  public type InterferenceAnalysis = {
    sourceBand: Text;
    affectedBands: [Text];
    interferenceMatrix: [[Float]];
    mitigationScore: Float;
  };

  stable var bandCount : Nat = 0;
  var bands = HashMap.HashMap<Text, FrequencyBand>(20, Text.equal, Text.hash);

  /// Register frequency band
  public func registerBand(band: FrequencyBand) : async Text {
    bands.put(band.bandId, band);
    bandCount += 1;
    return "Band registered: " # band.bandId;
  };

  /// Calculate Shannon channel capacity
  /// C = B × log₂(1 + SNR)
  public func calculateChannelCapacity(
    bandwidth: Float,  // MHz
    signalPower: Float, // dBm
    noisePower: Float   // dBm
  ) : async Float {
    // Convert dBm to linear for SNR calculation
    let signalLinear = Float.pow(10.0, signalPower / 10.0);
    let noiseLinear = Float.pow(10.0, noisePower / 10.0);
    let snr = signalLinear / noiseLinear;
    
    // Shannon capacity: C = B × log₂(1 + SNR)
    let log2_1_plus_snr = Float.log(1.0 + snr) * LOG2_E;
    let capacity = bandwidth * log2_1_plus_snr;
    
    return capacity;  // Mbps
  };

  /// Allocate spectrum using Golden Ratio partitioning
  public func allocateSpectrum(
    totalBandwidth: Float,
    priorityUsers: Nat
  ) : async [SpectrumAllocation] {
    let allocBuffer = Buffer.Buffer<SpectrumAllocation>(priorityUsers);
    
    var remaining = totalBandwidth;
    for (i in Array.vals(Array.tabulate<Nat>(priorityUsers, func(x) { x }))) {
      // φ-weighted allocation: higher priority gets larger share
      let phiWeight = Float.pow(PHI, -Float.fromInt(i));
      let allocation = remaining * PHI_INVERSE;
      remaining := remaining - allocation;
      
      // Estimate capacity (assuming 20 dB SNR)
      let capacity = allocation * Float.log(1.0 + 100.0) * LOG2_E;
      
      allocBuffer.add({
        bandId = "ALLOC_" # Nat.toText(i);
        allocatedBandwidth = allocation;
        channelCapacity = capacity;
        interferenceLevel = 0.1 * Float.fromInt(i);
        phiEfficiency = phiWeight;
      });
    };
    
    return Buffer.toArray(allocBuffer);
  };

  /// Analyze inter-band interference
  public func analyzeInterference(bandIds: [Text]) : async InterferenceAnalysis {
    let n = bandIds.size();
    let matrix = Array.tabulate<[Float]>(n, func(i) {
      Array.tabulate<Float>(n, func(j) {
        if (i == j) { 0.0 }
        else { PHI_INVERSE * Float.abs(Float.fromInt(i) - Float.fromInt(j)) / Float.fromInt(n) }
      })
    });
    
    // Mitigation score based on φ-threshold
    var totalInterference : Float = 0.0;
    for (row in matrix.vals()) {
      for (val in row.vals()) {
        totalInterference += val;
      };
    };
    let avgInterference = totalInterference / Float.fromInt(n * n);
    let mitigationScore = 1.0 - Float.min(1.0, avgInterference / PHI_INVERSE);
    
    return {
      sourceBand = if (bandIds.size() > 0) { bandIds[0] } else { "" };
      affectedBands = bandIds;
      interferenceMatrix = matrix;
      mitigationScore = mitigationScore;
    };
  };

  public query func getBandCount() : async Nat { return bandCount; };
};
