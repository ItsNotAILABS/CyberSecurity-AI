/**
 * @nova-protocol/phi-math
 *
 * Golden-ratio mathematics library.
 * PHI, Fibonacci sequence, Fibonacci hashing, golden angle,
 * phyllotaxis coordinates, Kuramoto oscillators.
 *
 * Casa de Medina — Architectos de Architectura Inteligente
 */

// ─── Constants ───────────────────────────────────────────────────────────────

/** The golden ratio: φ = (1 + √5) / 2 */
export const PHI = 1.6180339887498948482;

/** φ² */
export const PHI2 = PHI * PHI;

/** φ³ */
export const PHI3 = PHI2 * PHI;

/** 1/φ = φ − 1 */
export const PHI_INV = 1 / PHI;

/** Golden angle in degrees: 360° × (2 − φ) ≈ 137.50776° */
export const GOLDEN_ANGLE_DEG = 360 * (2 - PHI);

/** Golden angle in radians */
export const GOLDEN_ANGLE_RAD = GOLDEN_ANGLE_DEG * (Math.PI / 180);

/** 2^32 / φ — Fibonacci mixing constant (used in hashing) */
export const PHI_FRAC_U32 = 0x9e3779b9;

// ─── Fibonacci Sequence ──────────────────────────────────────────────────────

/**
 * Returns the n-th Fibonacci number (0-indexed: fib(0)=0, fib(1)=1).
 * Uses the fast doubling algorithm — O(log n).
 */
export function fib(n: number): number {
  if (n < 0) throw new RangeError(`fib(${n}): n must be >= 0`);
  if (n === 0) return 0;
  if (n === 1) return 1;
  let a = 0, b = 1;
  const bits: number[] = [];
  let tmp = n;
  while (tmp > 0) { bits.push(tmp & 1); tmp >>= 1; }
  for (let i = bits.length - 2; i >= 0; i--) {
    const c = a * (2 * b - a);
    const d = a * a + b * b;
    a = c; b = d;
    if (bits[i] === 1) { a = d; b = d + c; }
  }
  return a;
}

/**
 * Returns the first `count` Fibonacci numbers starting at fib(start).
 */
export function fibSequence(count: number, start = 0): number[] {
  return Array.from({ length: count }, (_, i) => fib(start + i));
}

/**
 * Returns the nearest Fibonacci number >= n.
 */
export function nearestFib(n: number): number {
  if (n <= 0) return 0;
  let a = 0, b = 1;
  while (b < n) { const t = a + b; a = b; b = t; }
  return b;
}

// ─── Fibonacci Hashing ───────────────────────────────────────────────────────

/**
 * Fibonacci hash: content-addressed token identity.
 *
 * Produces a deterministic integer in [0, vocabSize) from any string.
 * Identical across all platforms — depends only on Unicode code points and φ.
 *
 * @param text      Input string
 * @param vocabSize Vocabulary size (default 131 072 = 2^17)
 */
export function fibonacciHash(text: string, vocabSize = 131_072): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  }
  // φ-mixing via the Knuth multiplicative hash constant (2^32 / φ)
  h = Math.imul(Math.abs(h), PHI_FRAC_U32);
  return (h >>> 0) % vocabSize;
}

// ─── Golden Angle / Phyllotaxis ──────────────────────────────────────────────

/**
 * Returns the polar (r, θ_rad) phyllotaxis coordinate for the n-th element
 * in a golden-angle spiral.
 *
 *   r = √n          (radial distance)
 *   θ = n × φ_angle (angular position)
 */
export function phyllotaxisCoord(n: number): { r: number; thetaRad: number; thetaDeg: number } {
  return {
    r: Math.sqrt(n),
    thetaRad: n * GOLDEN_ANGLE_RAD,
    thetaDeg: n * GOLDEN_ANGLE_DEG,
  };
}

/**
 * Returns the Cartesian (x, y) position on a phyllotaxis spiral for element n,
 * scaled by `scale` (default 1).
 */
export function phyllotaxisXY(n: number, scale = 1): { x: number; y: number } {
  const { r, thetaRad } = phyllotaxisCoord(n);
  return { x: r * Math.cos(thetaRad) * scale, y: r * Math.sin(thetaRad) * scale };
}

// ─── φ-Weight ─────────────────────────────────────────────────────────────────

/**
 * φ-weight for the n-th item in a ranked list (n >= 1).
 * Produces values in [0, 10) cycling through the golden ratio.
 */
export function phiWeight(n: number): number {
  return (n * PHI) % 10;
}

/**
 * φ-weight based on depth in a hierarchy.
 * Each depth level attenuates by φ^(-depth).
 */
export function phiWeightDepth(length: number, depth: number): number {
  return length * Math.pow(PHI, -depth);
}

// ─── Kuramoto Oscillators ─────────────────────────────────────────────────────

export interface KuramotoOscillator {
  /** Natural frequency (rad/s) */
  omega: number;
  /** Current phase (rad) */
  phase: number;
  /** Fibonacci identity */
  fibId: number;
}

/**
 * Creates a fleet of Kuramoto oscillators whose natural frequencies are
 * spaced by the golden angle, ensuring no two oscillators share a frequency
 * ratio that would cause interference.
 *
 * @param count   Number of oscillators
 * @param baseHz  Base frequency in Hz (default φ)
 */
export function createOscillators(count: number, baseHz = PHI): KuramotoOscillator[] {
  return Array.from({ length: count }, (_, i) => ({
    omega: baseHz * Math.pow(PHI, i % 5),      // φ-scaled frequency
    phase: i * GOLDEN_ANGLE_RAD,               // golden-angle initial phase
    fibId: fib(i + 1),
  }));
}

/**
 * Advances all oscillators by dt seconds using the Kuramoto coupling model.
 *
 * dθᵢ/dt = ωᵢ + (K/N) × Σⱼ sin(θⱼ − θᵢ)
 *
 * @param oscillators  Array of KuramotoOscillator (mutated in-place)
 * @param dt           Time step in seconds
 * @param K            Coupling strength (default 1/φ)
 */
export function stepOscillators(
  oscillators: KuramotoOscillator[],
  dt: number,
  K = PHI_INV,
): void {
  const N = oscillators.length;
  const deltas = oscillators.map((osc, i) => {
    const coupling = oscillators.reduce((sum, other, j) => {
      if (i === j) return sum;
      return sum + Math.sin(other.phase - osc.phase);
    }, 0);
    return osc.omega + (K / N) * coupling;
  });
  for (let i = 0; i < N; i++) {
    oscillators[i].phase = (oscillators[i].phase + deltas[i] * dt) % (2 * Math.PI);
  }
}

/**
 * Returns the order parameter r ∈ [0, 1] measuring synchronisation.
 * r = 1 means perfectly synchronised; r ≈ 0 means incoherent.
 */
export function orderParameter(oscillators: KuramotoOscillator[]): number {
  const N = oscillators.length;
  let sumCos = 0, sumSin = 0;
  for (const o of oscillators) {
    sumCos += Math.cos(o.phase);
    sumSin += Math.sin(o.phase);
  }
  return Math.sqrt(sumCos * sumCos + sumSin * sumSin) / N;
}

// ─── Char Entropy ────────────────────────────────────────────────────────────

/**
 * Approximate bigram character entropy — used by the φ-Segmentation algorithm
 * to decide whether a boundary exists between two adjacent characters.
 *
 * High entropy → characters are dissimilar → likely boundary.
 */
export function charEntropy(a: string, b: string): number {
  const ca = a.charCodeAt(0);
  const cb = b.charCodeAt(0);
  const diff = Math.abs(ca - cb);
  // Normalise to [0, 1] using a sigmoid-like function
  return diff / (diff + 64);
}

/**
 * Returns true if `c` is a natural break character (whitespace, punctuation).
 */
export function isNaturalBreak(c: string): boolean {
  return /[\s\.,;:!?(){}\[\]<>\/\\\-\+\*=@#$%^&|`~"'_]/.test(c);
}
