///
/// FIBONACCI VERSIONING SYSTEM
/// Casa de Medina — Architectos de Architectura Inteligente
///
/// Version format: MAJOR.MINOR.PHI
/// Where PHI = 618 (from φ ≈ 1.618033988749)
///
/// Fibonacci sequence influences version progression:
/// 0.1.618 → 1.0.0 → 1.1.618 → 2.1.618 → 3.2.618 → 5.3.618 → 8.5.618 → 13.8.618
///

export const PHI = 1.618033988749;
export const PHI_DIGITS = 618;

// Fibonacci sequence for versioning
export const FIBONACCI = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

/**
 * Generate Fibonacci-based version number
 * @param {number} stage - Version stage (0-16)
 * @returns {string} - Version string like "3.2.618"
 */
export function generateFibVersion(stage = 1) {
  if (stage === 0) return '0.1.618';
  if (stage === 1) return '1.0.0';

  const major = FIBONACCI[stage];
  const minor = FIBONACCI[stage - 1];
  return `${major}.${minor}.${PHI_DIGITS}`;
}

/**
 * Current version mappings for all MEDINA SDKs
 */
export const SDK_VERSIONS = {
  // Foundation Layer
  '@medina/medina-heart': '1.1.618',        // Fib(2)
  '@medina/medina-registry': '1.0.0',       // Fib(1)

  // Product Layer
  '@medina/birth-ai': '1.1.618',            // Fib(2)

  // Protocol Layer
  '@medina/alpha-sdk': '1.1.618',           // Fib(2)

  // Society Layer
  '@medina/civilization-sdk': '1.1.618',    // Fib(2)

  // New Alpha Multi-AI SDKs
  '@medina/neural-mesh': '0.1.618',         // Fib(0) - New
  '@medina/quantum-protocol': '0.1.618',    // Fib(0) - New
  '@medina/swarm-intelligence': '0.1.618',  // Fib(0) - New
  '@medina/memory-ocean': '0.1.618',        // Fib(0) - New
  '@medina/evolution-engine': '0.1.618',    // Fib(0) - New
  '@medina/consciousness-stream': '0.1.618', // Fib(0) - New
  '@medina/parallel-minds': '0.1.618',      // Fib(0) - New
  '@medina/adaptive-learning': '0.1.618',   // Fib(0) - New
  '@medina/emergence-patterns': '0.1.618',  // Fib(0) - New
  '@medina/meta-cognition': '0.1.618',      // Fib(0) - New
  '@medina/collective-wisdom': '0.1.618',   // Fib(0) - New
  '@medina/temporal-sync': '0.1.618',       // Fib(0) - New
};

/**
 * Get next Fibonacci version
 */
export function getNextVersion(currentVersion) {
  const [major, minor] = currentVersion.split('.').map(Number);
  const currentStage = FIBONACCI.indexOf(major);

  if (currentStage === -1 || currentStage === FIBONACCI.length - 1) {
    throw new Error('Cannot determine next Fibonacci version');
  }

  return generateFibVersion(currentStage + 1);
}

export default {
  PHI,
  PHI_DIGITS,
  FIBONACCI,
  SDK_VERSIONS,
  generateFibVersion,
  getNextVersion,
};
