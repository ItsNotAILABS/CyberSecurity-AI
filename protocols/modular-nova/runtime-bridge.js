///
/// protocols/modular-nova/runtime-bridge.js
///
/// Executable protocol module set for PROTO-241..275.
///

import {
  PHI,
  PHI2,
  PHI_INV,
  GOLDEN_ANGLE,
  clamp,
  normalizePhase,
  kuramotoOrderParameter,
  phiAttestation,
  protocolThreshold,
} from './core-math.js';
import { CANONICAL_PROTOCOL_MAP_241_275, getCanonicalProtocol241to275 } from './protocol-map-241-275.js';

function parseId(protocolId) {
  return Number(protocolId.split('-')[1]);
}

function domainAdaptiveMode(domain) {
  switch (domain) {
    case 'consciousness-sentience':
      return 'KuramotoSync';
    case 'quantum-intelligence':
      return 'GoldenSpiral';
    case 'cosmic-universal':
      return 'FibonacciStep';
    case 'bio-neural':
      return 'PhiAdaptive';
    default:
      return 'PhiAdaptive';
  }
}

function baseWindow(parameters = {}) {
  return Math.floor(parameters.window ?? parameters.windowIndex ?? 0);
}

function consciousnessComputation(protocolNum, parameters = {}) {
  const k = protocolNum - 240;
  const tetractys = 10;
  const logos = clamp(parameters.logos ?? PHI_INV, 0, 2);
  const ethos = clamp(parameters.ethos ?? 0.5, 0, 2);
  const pathos = clamp(parameters.pathos ?? 0.5, 0, 2);
  const balance = (logos + ethos + pathos) / 3;

  const phases = [
    normalizePhase(k * GOLDEN_ANGLE),
    normalizePhase((k + tetractys) / PHI),
    normalizePhase(balance * Math.PI),
    normalizePhase((logos - ethos + pathos) * PHI),
  ];

  return {
    phases,
    metrics: {
      tetractys,
      correspondence: logos * ethos,
      recursiveIndex: Math.pow(PHI, k % 5),
      rhetoricBalance: balance,
    },
  };
}

function quantumComputation(protocolNum, parameters = {}) {
  const k = protocolNum - 248;
  const alpha = clamp(parameters.alpha ?? PHI_INV, 0, 1);
  const beta = Math.sqrt(Math.max(0, 1 - alpha * alpha));
  const bornProbability = alpha * alpha;
  const fourierFreq = clamp(parameters.freq ?? k, 1, 64);
  const phaseShift = (2 * Math.PI * fourierFreq) / 64;

  const phases = [
    normalizePhase(Math.acos(alpha)),
    normalizePhase(Math.asin(beta)),
    normalizePhase(phaseShift),
    normalizePhase((bornProbability + PHI_INV) * Math.PI),
  ];

  return {
    phases,
    metrics: {
      alpha,
      beta,
      bornProbability,
      latticeDistance: Math.abs(alpha - beta) * PHI2,
      hilbertNorm: alpha * alpha + beta * beta,
    },
  };
}

function cosmicComputation(protocolNum, parameters = {}) {
  const k = protocolNum - 256;
  const semiMajorAxis = clamp(parameters.a ?? (k + 1), 1, 1000);
  const orbitalPeriod = Math.sqrt(Math.pow(semiMajorAxis, 3));
  const pythagoreanRatio = (k + 2) / (k + 1);
  const solar = clamp(parameters.solar ?? 24, 1, 48);
  const lunar = clamp(parameters.lunar ?? 29.53, 1, 60);
  const resonance = (solar / lunar) * PHI_INV;

  const phases = [
    normalizePhase(orbitalPeriod % (2 * Math.PI)),
    normalizePhase(pythagoreanRatio * Math.PI),
    normalizePhase(resonance * Math.PI),
    normalizePhase((k * GOLDEN_ANGLE) / PHI),
  ];

  return {
    phases,
    metrics: {
      semiMajorAxis,
      orbitalPeriod,
      pythagoreanRatio,
      solarLunarResonance: resonance,
    },
  };
}

function bioNeuralComputation(protocolNum, parameters = {}) {
  const k = protocolNum - 264;
  const pre = clamp(parameters.pre ?? 0.7, 0, 1);
  const post = clamp(parameters.post ?? 0.7, 0, 1);
  const eta = clamp(parameters.eta ?? PHI_INV / 10, 0, 1);
  const hebbianDelta = eta * pre * post;
  const dnaTurns = clamp(parameters.bpPerTurn ?? 10.5, 8, 13);
  const membraneV = clamp(parameters.membraneV ?? -65, -100, 100);

  const phases = [
    normalizePhase((dnaTurns / 10.5) * Math.PI),
    normalizePhase(hebbianDelta * PHI2 * Math.PI),
    normalizePhase(((membraneV + 100) / 200) * 2 * Math.PI),
    normalizePhase((k + 1) * PHI_INV),
  ];

  return {
    phases,
    metrics: {
      dnaTurns,
      atpYield: clamp(parameters.atpYield ?? 30, 1, 64),
      hebbianDelta,
      membraneV,
      brainwaveBandHz: clamp(parameters.bandHz ?? 8, 0.5, 120),
    },
  };
}

function computeDomainSignal(domain, protocolNum, parameters) {
  switch (domain) {
    case 'consciousness-sentience':
      return consciousnessComputation(protocolNum, parameters);
    case 'quantum-intelligence':
      return quantumComputation(protocolNum, parameters);
    case 'cosmic-universal':
      return cosmicComputation(protocolNum, parameters);
    case 'bio-neural':
      return bioNeuralComputation(protocolNum, parameters);
    default:
      return consciousnessComputation(protocolNum, parameters);
  }
}

export function executeProtocol241to275({ protocolId, input = {}, parameters = {} }) {
  const descriptor = getCanonicalProtocol241to275(protocolId);
  if (!descriptor) throw new Error(`Unknown protocol: ${protocolId}`);

  const protocolNum = parseId(protocolId);
  const domainSignal = computeDomainSignal(descriptor.domain, protocolNum, parameters);
  const window = baseWindow(parameters);
  const phased = domainSignal.phases.map((phase, idx) => normalizePhase(phase + ((window + idx) * PHI_INV)));
  const { R, psi } = kuramotoOrderParameter(phased);
  const threshold = protocolThreshold(descriptor.domain);
  const granted = R >= threshold;

  const payload = {
    protocolId,
    callId: descriptor.callId,
    domain: descriptor.domain,
    window,
    R: Number(R.toFixed(6)),
    psi: Number(psi.toFixed(6)),
    threshold,
    granted,
    metrics: domainSignal.metrics,
    inputFingerprint: Object.keys(input).sort(),
  };

  return {
    ...payload,
    attestation: phiAttestation(payload),
    phases: phased.map((phase) => Number(phase.toFixed(6))),
  };
}

export function createProtocol241to275Registry() {
  return CANONICAL_PROTOCOL_MAP_241_275.map((meta) => {
    const numericId = parseId(meta.id);
    return {
      id: meta.id,
      name: meta.name,
      tier: 'Alpha',
      adaptiveMode: domainAdaptiveMode(meta.domain),
      phiWeight: numericId * PHI,
      async execute(ctx) {
        return executeProtocol241to275(ctx);
      },
    };
  });
}
