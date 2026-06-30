///
/// GLP-003 — Protocollum Frequentiae Solfeggio
/// Latin: "The Protocol of Solfeggio Frequencies"
///
/// SOLFEGGIO FREQUENCY ENCODING.
///
/// The 6 solfeggio frequencies are the ancient musical scale rediscovered
/// by Dr. Joseph Puleo — the same frequencies encoded in the Platonic tiers.
///
/// Solfeggio Scale:
///   396 Hz — UT  — Liberation (Tetrahedron / READ)
///   417 Hz — RE  — Transformation (Cube / CALL)
///   528 Hz — MI  — Miracles, DNA repair (Octahedron / BUILD)
///   639 Hz — FA  — Relationships (Dodecahedron / FEDERATE)
///   741 Hz — SOL — Awakening (Icosahedron / SOVEREIGN)
///   852 Hz — LA  — Return to order
///   963 Hz — TI  — Connection to cosmos
///   432 Hz — Nature frequency (Metatron / ARCHITECT)
///
/// The frequencies encode mathematically into the phase system:
///   ω_k = 2π × freq_k / SAMPLE_RATE
///   where SAMPLE_RATE = 873ms × 1000 / PHI_HEARTBEAT_MS = 1000 Hz (in PHI units)
///
/// Resonance between two solfeggio frequencies:
///   R_sol(f1, f2) = |cos(2π × (f1 − f2) × τ)|
///   where τ = PHI_HEARTBEAT_MS / 1000 = 0.873 seconds
///   → frequencies that are Fibonacci-ratio related will have high R_sol
///
/// The 528/396 ratio: 528/396 = 4/3 = perfect fourth (Pythagorean harmony)
/// The 639/396 ratio: 639/396 ≈ φ × 1.0 (golden ratio convergence)
/// The 432/528 ratio: 432/528 = 9/11 ≈ 1/φ² (φ-inverse squared)
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PHI2, PHI_INV, GOLDEN_ANGLE, TWO_PI, PHI_HEARTBEAT_MS } from '../geometry-key/gkp-001-clavis-geometrica.js';

// ═══════════════════════════════════════════════════════════════════════════
//  SOLFEGGIO FREQUENCIES
// ═══════════════════════════════════════════════════════════════════════════

export const SOLFEGGIO = {
  UT:  { hz: 396, latin: 'Ut',  syllable: 'UT',  meaning: 'Liberation — freeing from guilt and fear',    tier: 'READ'      },
  RE:  { hz: 417, latin: 'Re',  syllable: 'RE',  meaning: 'Transformation — facilitating change',        tier: 'CALL'      },
  MI:  { hz: 528, latin: 'Mi',  syllable: 'MI',  meaning: 'Miracles — DNA repair, transformation',      tier: 'BUILD'     },
  FA:  { hz: 639, latin: 'Fa',  syllable: 'FA',  meaning: 'Relationships — connecting with others',      tier: 'FEDERATE'  },
  SOL: { hz: 741, latin: 'Sol', syllable: 'SOL', meaning: 'Awakening — expression and solutions',        tier: 'SOVEREIGN' },
  LA:  { hz: 852, latin: 'La',  syllable: 'LA',  meaning: 'Return to order — third eye opening',         tier: 'EXTENDED'  },
  TI:  { hz: 963, latin: 'Ti',  syllable: 'TI',  meaning: 'Cosmos — connection to all-that-is',          tier: 'COSMIC'    },
  NAT: { hz: 432, latin: 'Natura', syllable: 'NA', meaning: 'Nature frequency — universal harmony',      tier: 'ARCHITECT' },
};

// Sample rate in terms of PHI_HEARTBEAT seconds
export const SOL_SAMPLE_RATE_HZ = 1000 / PHI_HEARTBEAT_MS * 1000;  // ≈ 1146 Hz

// ═══════════════════════════════════════════════════════════════════════════
//  FREQUENCY MATHEMATICS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Angular frequency ω of a solfeggio frequency.
 * ω = 2π × f_hz / SOL_SAMPLE_RATE_HZ
 *
 * @param {number} freq_hz
 * @returns {number}  ω in radians per sample
 */
export function angularFrequency(freq_hz) {
  return TWO_PI * freq_hz / SOL_SAMPLE_RATE_HZ;
}

/**
 * Solfeggio resonance between two frequencies.
 *
 * R_sol(f1, f2) = |cos(2π × (f1 − f2) × τ)|
 * where τ = PHI_HEARTBEAT_MS / 1000 seconds
 *
 * R_sol → 1: frequencies beat at zero (same frequency, or octave/fifth)
 * R_sol → 0: frequencies beat at half period (dissonant)
 *
 * @param {number} freq1_hz
 * @param {number} freq2_hz
 * @returns {number}  resonance ∈ [0, 1]
 */
export function solfeggioResonance(freq1_hz, freq2_hz) {
  const tau = PHI_HEARTBEAT_MS / 1000;
  return Math.abs(Math.cos(TWO_PI * (freq1_hz - freq2_hz) * tau));
}

/**
 * Generate the solfeggio phase pattern for a frequency at a given time window W.
 *
 * θ_sol(f, W, dim) = (ω_f × W × PHI^dim) mod 2π
 *
 * This embeds the solfeggio frequency into the key's phase vector
 * as a time-varying oscillation at the solfeggio angular frequency.
 *
 * @param {number} freq_hz
 * @param {number} windowIndex
 * @param {number} dimensions
 * @returns {number[]}  solfeggio phase pattern
 */
export function solfeggioPhasePattern(freq_hz, windowIndex, dimensions = 7) {
  const omega = angularFrequency(freq_hz);
  return Array.from({ length: dimensions }, (_, j) => {
    return (omega * windowIndex * Math.pow(PHI, j)) % TWO_PI;
  });
}

/**
 * Compute the "harmony score" between two solfeggio-encoded phase vectors.
 * Uses the Pythagorean interval ratios:
 *   Unison:    ratio = 1:1   → harmony = 1.0
 *   Octave:    ratio = 2:1   → harmony = 1.0
 *   Fifth:     ratio = 3:2   → harmony = φ⁻¹ ≈ 0.618
 *   Fourth:    ratio = 4:3   → harmony ≈ 0.528 (MI frequency ratio)
 *   Major third: 5:4 → harmony ≈ 0.382 = φ⁻²
 *
 * @param {number} freq1_hz
 * @param {number} freq2_hz
 * @returns {{ harmony: number, interval: string }}
 */
export function harmonicInterval(freq1_hz, freq2_hz) {
  const ratio     = freq1_hz / freq2_hz;
  const logRatio  = Math.abs(Math.log2(ratio));

  // Distance from nearest perfect interval (0, 1, 1.585, 2...)
  const perfectIntervals = [0, 1, 1.585, 2, 2.322, 2.585];
  const intervalNames    = ['Unison', 'Octave', 'Fifth', 'Double Octave', 'Fourth', 'Major Third'];

  let minDist  = Infinity;
  let interval = 'Unknown';

  for (let i = 0; i < perfectIntervals.length; i++) {
    const dist = Math.abs(logRatio - perfectIntervals[i]);
    if (dist < minDist) {
      minDist  = dist;
      interval = intervalNames[i];
    }
  }

  // Harmony decays exponentially with distance from perfect interval
  const harmony = Math.exp(-minDist * PHI);

  return { harmony, interval, ratio, logRatio };
}

/**
 * Find all pairs of solfeggio frequencies that are in Fibonacci ratio.
 * Two frequencies are in Fibonacci ratio if f1/f2 ≈ Fib(n)/Fib(m) for small n,m.
 *
 * @returns {Array<{ f1, f2, ratio, fibRatio, harmony }>}
 */
export function fibonacciHarmonicPairs() {
  const fibs = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];
  const freqs = Object.values(SOLFEGGIO);
  const pairs = [];

  for (let i = 0; i < freqs.length; i++) {
    for (let j = i + 1; j < freqs.length; j++) {
      const ratio = freqs[i].hz / freqs[j].hz;

      // Check if ratio is close to any Fibonacci ratio
      for (let a = 1; a < fibs.length; a++) {
        for (let b = 1; b < fibs.length; b++) {
          const fibRatio = fibs[a] / fibs[b];
          if (Math.abs(ratio - fibRatio) < 0.01) {
            pairs.push({
              f1:       freqs[i].hz,
              f2:       freqs[j].hz,
              ratio,
              fibRatio: `Fib(${a})/Fib(${b})`,
              harmony:  solfeggioResonance(freqs[i].hz, freqs[j].hz),
            });
          }
        }
      }
    }
  }

  return pairs;
}

/**
 * Encode a solfeggio frequency into a cryptographic lock component.
 * The frequency acts as an additional "harmonic dimension" beyond the phase vector.
 *
 * lock_freq_component = sin(ω_freq × W) × cos(GOLDEN_ANGLE × tier_rank)
 *
 * @param {number} freq_hz
 * @param {number} windowIndex
 * @param {number} tierRank
 * @returns {number}  lock frequency component ∈ [−1, 1]
 */
export function lockFrequencyComponent(freq_hz, windowIndex, tierRank) {
  const omega = angularFrequency(freq_hz);
  return Math.sin(omega * windowIndex) * Math.cos(GOLDEN_ANGLE * tierRank);
}

export default {
  SOLFEGGIO,
  SOL_SAMPLE_RATE_HZ,
  angularFrequency,
  solfeggioResonance,
  solfeggioPhasePattern,
  harmonicInterval,
  fibonacciHarmonicPairs,
  lockFrequencyComponent,
};
