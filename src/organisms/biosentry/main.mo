///
/// BIOSENTRY — Agricultural Defense Intelligence Organism
///
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// "The ancient guardians watched the fields with mathematical precision.
///  BIOSENTRY continues their vigil with algorithms as old as agriculture itself."
///
/// Mathematical Foundation:
///   - Lotka-Volterra: dN/dt = rN(1 - N/K) (population dynamics)
///   - SIR Model: dS/dt = -βSI (epidemic spread)
///   - φ-thresholds for IPM decisions
///

import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";

persistent actor BIOSENTRY {

  transient let PHI : Float = 1.6180339887498949;
  transient let PHI_INVERSE : Float = 0.6180339887498949;
  transient let FIBONACCI_SCOUT : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];

  public type PestPopulation = {
    speciesId: Text;
    density: Float;
    growthRate: Float;
    phiRiskLevel: Float;
  };

  public type DiseaseState = {
    pathogenId: Text;
    susceptible: Float;
    infected: Float;
    recovered: Float;
    r0: Float;
  };

  stable var alertCount : Nat = 0;

  /// Model pest population using Lotka-Volterra
  public func modelPestGrowth(
    speciesId: Text,
    currentDensity: Float,
    growthRate: Float,
    carryingCapacity: Float,
    days: Nat
  ) : async PestPopulation {
    var N = currentDensity;
    for (_ in Array.vals(Array.tabulate<Nat>(days, func(i) { i }))) {
      let dN = growthRate * N * (1.0 - N / carryingCapacity);
      N := Float.max(0.0, N + dN);
    };
    let risk = Float.min(1.0, N / carryingCapacity / PHI_INVERSE);
    return { speciesId = speciesId; density = N; growthRate = growthRate; phiRiskLevel = risk };
  };

  /// Model disease spread using SIR
  public func modelDiseaseSpread(
    pathogenId: Text,
    S: Float, I: Float, R: Float,
    beta: Float, gamma: Float,
    days: Nat
  ) : async DiseaseState {
    var s = S; var i = I; var r = R;
    for (_ in Array.vals(Array.tabulate<Nat>(days, func(x) { x }))) {
      let dS = -beta * s * i;
      let dI = beta * s * i - gamma * i;
      let dR = gamma * i;
      s := Float.max(0.0, s + dS);
      i := Float.max(0.0, i + dI);
      r := Float.min(1.0, r + dR);
    };
    return { pathogenId = pathogenId; susceptible = s; infected = i; recovered = r; r0 = beta / gamma };
  };

  public query func getScoutingIntervals() : async [Nat] { return FIBONACCI_SCOUT; };
};
