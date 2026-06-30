///
/// protocols/modular-nova/core-math.js
///
/// Shared mathematical core for PROTO-241..275.
///

export const PHI = 1.6180339887498948;
export const PHI2 = PHI * PHI;
export const PHI_INV = 1 / PHI;
export const TWO_PI = 2 * Math.PI;
export const GOLDEN_ANGLE = (2 * Math.PI) / PHI2;

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizePhase(theta) {
  const phase = theta % TWO_PI;
  return phase < 0 ? phase + TWO_PI : phase;
}

export function kuramotoOrderParameter(phases) {
  const N = phases.length;
  if (N === 0) return { R: 0, psi: 0 };

  let re = 0;
  let im = 0;

  for (const phase of phases) {
    re += Math.cos(phase);
    im += Math.sin(phase);
  }

  re /= N;
  im /= N;

  return {
    R: Math.sqrt(re * re + im * im),
    psi: Math.atan2(im, re),
  };
}

export function phiWeightedHash(message) {
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const code = message.charCodeAt(i);
    hash += code * Math.pow(PHI, i % 13);
    hash %= 0xFFFFFFFF;
  }
  return Math.floor(hash * PHI2) % 0xFFFFFF;
}

export function phiAttestation(payload) {
  const normalized = JSON.stringify(payload, Object.keys(payload).sort());
  const hash = phiWeightedHash(normalized);
  return `phi_${hash.toString(16).padStart(6, '0')}`;
}

export function protocolThreshold(domain) {
  switch (domain) {
    case 'consciousness-sentience':
      return PHI_INV;
    case 'quantum-intelligence':
      return 0.5;
    case 'cosmic-universal':
      return 0.55;
    case 'bio-neural':
      return 0.6;
    default:
      return PHI_INV;
  }
}
