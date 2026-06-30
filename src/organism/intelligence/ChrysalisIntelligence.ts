///
/// CHRYSALIS INTELLIGENCE — Χρυσαλίς — Golden Mathematics Core
///
/// TypeScript organism intelligence for CHRYSALIS.
/// Mirrors the Motoko canister (src/organisms/chrysalis/main.mo).
/// The DNA of every organism.  Nothing grows without consulting
/// Chrysalis first.
///
/// Sub-models: FIBONACCI, SPIRAL
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI, PSI, SQRT5, GOLDEN_ANGLE, PI } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  CHRYSALIS INTELLIGENCE
// ══════════════════════════════════════════════════════════════════

export class ChrysalisIntelligence {
  readonly name = 'CHRYSALIS';
  readonly designation = 'Χρυσαλίς — Golden Mathematics Core — The DNA of all organisms';

  // ── SUB-MODEL: FIBONACCI ─────────────────────────────────────

  /** Binet's formula: F(n) = (φⁿ − ψⁿ) / √5 */
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return Math.round((Math.pow(PHI, n) - Math.pow(PSI, n)) / SQRT5);
  }

  /** Iterative Fibonacci sequence — n terms from F(0). */
  fibonacciSequence(terms: number): number[] {
    const seq: number[] = [];
    let a = 0, b = 1;
    for (let i = 0; i < terms; i++) {
      seq.push(a);
      [a, b] = [b, a + b];
    }
    return seq;
  }

  /** Convergent golden ratio: F(n+1)/F(n) → φ */
  goldenRatioConvergence(iterations: number): number {
    if (iterations === 0) return 1;
    let a = 1, b = 1;
    for (let i = 0; i < iterations; i++) {
      [a, b] = [b, a + b];
    }
    return b / a;
  }

  /** Zeckendorf representation — non-consecutive Fibonacci sum. */
  zeckendorf(n: number): number[] {
    if (n === 0) return [];
    const fibs: number[] = [];
    let a = 1, b = 2;
    while (a <= n) {
      fibs.push(a);
      [a, b] = [b, a + b];
    }

    const result: number[] = [];
    let remaining = n;
    for (let j = fibs.length - 1; j >= 0 && remaining > 0; j--) {
      if (fibs[j] <= remaining) {
        result.push(fibs[j]);
        remaining -= fibs[j];
      }
    }
    return result;
  }

  // ── SUB-MODEL: SPIRAL ────────────────────────────────────────

  /** Golden spiral point at parameter t. */
  goldenSpiralPoint(t: number): [number, number] {
    const r = Math.pow(PHI, 2 * t / PI);
    return [r * Math.cos(t), r * Math.sin(t)];
  }

  /** Generate n points along the golden spiral. */
  goldenSpiral(numPoints: number, step: number): Array<[number, number]> {
    const points: Array<[number, number]> = [];
    for (let i = 0; i < numPoints; i++) {
      const t = i * step;
      const r = Math.pow(PHI, 2 * t / PI);
      points.push([r * Math.cos(t), r * Math.sin(t)]);
    }
    return points;
  }

  /** Phyllotaxis — sunflower seed arrangement. */
  phyllotaxis(numSeeds: number, scale: number): Array<[number, number]> {
    const points: Array<[number, number]> = [];
    for (let i = 0; i < numSeeds; i++) {
      const angle = i * GOLDEN_ANGLE;
      const radius = scale * Math.sqrt(i);
      points.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
    }
    return points;
  }

  /** Fibonacci sphere — optimal distribution on a sphere. */
  fibonacciSphere(numPoints: number): Array<[number, number, number]> {
    const points: Array<[number, number, number]> = [];
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / numPoints);
      const phiAngle = 2 * PI * i / PHI;
      points.push([
        Math.sin(theta) * Math.cos(phiAngle),
        Math.sin(theta) * Math.sin(phiAngle),
        Math.cos(theta),
      ]);
    }
    return points;
  }

  // ── Growth Functions ─────────────────────────────────────────

  /** Golden growth: base × φⁿ */
  goldenGrowth(base: number, generation: number): number {
    return base * Math.pow(PHI, generation);
  }

  /** Golden partition: (major, minor) where major/minor ≈ φ */
  goldenPartition(magnitude: number): [number, number] {
    const major = magnitude / PHI;
    const minor = magnitude - major;
    return [major, minor];
  }

  // ── Status ───────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      phi: PHI,
      golden_angle: GOLDEN_ANGLE,
      sub_models: ['FIBONACCI', 'SPIRAL'],
    };
  }
}
