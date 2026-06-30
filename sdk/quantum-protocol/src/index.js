///
/// @medina/quantum-protocol — Quantum-Inspired Decision Protocol
///
/// Implements quantum computing concepts for AI decision making:
/// - Superposition: Decisions exist in multiple states simultaneously
/// - Entanglement: Organisms' states are correlated across space
/// - Quantum tunneling: Solutions can "tunnel" through barriers
/// - Wave function collapse: Observation determines final state
///
/// Casa de Medina — Architect

os de Architectura Inteligente
///

import { LivingAI, ARCHETYPES, PHI } from '@medina/medina-heart';
import { AlphaAgent, AlphaDecision } from '@medina/alpha-sdk';

// ══════════════════════════════════════════════════════════════════
//  QUANTUM STATE — Superposition of multiple states
// ══════════════════════════════════════════════════════════════════

export class QuantumState {
  constructor(states = []) {
    this.states = states.map(s => ({
      value: s.value,
      amplitude: s.amplitude || 1.0 / Math.sqrt(states.length),
      phase: s.phase || 0,
    }));

    this.collapsed = false;
    this.observedState = null;

    console.log(`⚛️ QuantumState created with ${states.length} superposed states`);
  }

  // Add state to superposition
  addState(value, amplitude = 0.5, phase = 0) {
    if (this.collapsed) {
      throw new Error('Cannot add state to collapsed quantum state');
    }

    this.states.push({ value, amplitude, phase });
    this._normalize();
  }

  // Normalize amplitudes (Born rule: |amplitude|² = probability)
  _normalize() {
    const sumSquares = this.states.reduce((sum, s) => sum + s.amplitude ** 2, 0);
    const norm = Math.sqrt(sumSquares);

    this.states.forEach(s => {
      s.amplitude /= norm;
    });
  }

  // Get probability of each state
  getProbabilities() {
    return this.states.map(s => ({
      value: s.value,
      probability: s.amplitude ** 2,
    }));
  }

  // Collapse wave function (measurement)
  collapse() {
    if (this.collapsed) {
      return this.observedState;
    }

    const probabilities = this.getProbabilities();
    const random = Math.random();
    let cumulative = 0;

    for (const { value, probability } of probabilities) {
      cumulative += probability;
      if (random <= cumulative) {
        this.observedState = value;
        this.collapsed = true;
        console.log(`📊 Wave function collapsed to: ${value}`);
        return value;
      }
    }

    // Fallback to last state
    this.observedState = probabilities[probabilities.length - 1].value;
    this.collapsed = true;
    return this.observedState;
  }

  // Quantum interference
  interfere(otherState) {
    if (this.collapsed || otherState.collapsed) {
      throw new Error('Cannot interfere collapsed states');
    }

    const combined = [];

    for (const s1 of this.states) {
      for (const s2 of otherState.states) {
        combined.push({
          value: `${s1.value}|${s2.value}`,
          amplitude: s1.amplitude * s2.amplitude,
          phase: s1.phase + s2.phase,
        });
      }
    }

    return new QuantumState(combined);
  }
}

// ══════════════════════════════════════════════════════════════════
//  QUANTUM ENTANGLEMENT — Correlated states across organisms
// ══════════════════════════════════════════════════════════════════

export class QuantumEntanglement {
  constructor(organism1Id, organism2Id) {
    this.id = `entangle_${organism1Id}_${organism2Id}`;
    this.organism1 = organism1Id;
    this.organism2 = organism2Id;
    this.entangled = true;
    this.correlationStrength = 1.0;
    this.measurements = [];

    console.log(`🔗 Quantum entanglement: ${organism1Id} ⇄ ${organism2Id}`);
  }

  // Measure one organism (affects the other)
  measure(organismId, state) {
    if (!this.entangled) {
      return { entangled: false };
    }

    const otherOrganism = organismId === this.organism1 ? this.organism2 : this.organism1;

    // Record measurement
    this.measurements.push({
      organism: organismId,
      state,
      timestamp: Date.now(),
    });

    // Correlation determines other organism's state
    const correlatedState = this._correlateSate(state);

    return {
      measured: organismId,
      state,
      correlatedOrganism: otherOrganism,
      correlatedState,
      correlation: this.correlationStrength,
    };
  }

  _correlatedState(state) {
    // Perfect correlation for now (can add noise)
    return state;
  }

  // Break entanglement
  break() {
    this.entangled = false;
    console.log(`🔓 Entanglement broken: ${this.organism1} ⇄ ${this.organism2}`);
  }
}

// ══════════════════════════════════════════════════════════════════
//  QUANTUM GATE — Operations on quantum states
// ══════════════════════════════════════════════════════════════════

export class QuantumGate {
  constructor(type = 'hadamard') {
    this.type = type;
  }

  // Apply gate to quantum state
  apply(quantumState) {
    switch (this.type) {
      case 'hadamard':
        return this._hadamard(quantumState);
      case 'pauli_x':
        return this._pauliX(quantumState);
      case 'pauli_z':
        return this._pauliZ(quantumState);
      case 'phase':
        return this._phase(quantumState);
      default:
        return quantumState;
    }
  }

  // Hadamard gate (superposition)
  _hadamard(state) {
    const newStates = [];

    for (const s of state.states) {
      newStates.push({
        value: `${s.value}_0`,
        amplitude: s.amplitude / Math.sqrt(2),
        phase: s.phase,
      });
      newStates.push({
        value: `${s.value}_1`,
        amplitude: s.amplitude / Math.sqrt(2),
        phase: s.phase + Math.PI,
      });
    }

    return new QuantumState(newStates);
  }

  // Pauli-X gate (bit flip)
  _pauliX(state) {
    const newStates = state.states.map(s => ({
      ...s,
      value: s.value === '0' ? '1' : '0',
    }));

    return new QuantumState(newStates);
  }

  // Pauli-Z gate (phase flip)
  _pauliZ(state) {
    const newStates = state.states.map(s => ({
      ...s,
      phase: s.value === '1' ? s.phase + Math.PI : s.phase,
    }));

    return new QuantumState(newStates);
  }

  // Phase gate
  _phase(state, phaseShift = Math.PI / 4) {
    const newStates = state.states.map(s => ({
      ...s,
      phase: s.phase + phaseShift,
    }));

    return new QuantumState(newStates);
  }
}

// ══════════════════════════════════════════════════════════════════
//  QUANTUM PROTOCOL — Main protocol implementation
// ══════════════════════════════════════════════════════════════════

export class QuantumProtocol {
  constructor({ name = 'QUANTUM_PROTOCOL' } = {}) {
    this.name = name;

    this.quantumStates = new Map(); // organismId -> QuantumState
    this.entanglements = new Map(); // entanglementId -> QuantumEntanglement
    this.gates = new Map(); // gateId -> QuantumGate

    this.stats = {
      totalStates: 0,
      totalEntanglements: 0,
      totalMeasurements: 0,
      totalCollapses: 0,
    };

    console.log(`🌌 QuantumProtocol "${name}" initialized`);
  }

  // Create quantum state for organism
  createState(organismId, states) {
    const quantumState = new QuantumState(states);
    this.quantumStates.set(organismId, quantumState);
    this.stats.totalStates++;

    return {
      organismId,
      states: states.length,
      probabilities: quantumState.getProbabilities(),
    };
  }

  // Entangle two organisms
  entangle(organism1Id, organism2Id) {
    const entanglement = new QuantumEntanglement(organism1Id, organism2Id);
    this.entanglements.set(entanglement.id, entanglement);
    this.stats.totalEntanglements++;

    return {
      success: true,
      entanglementId: entanglement.id,
      organisms: [organism1Id, organism2Id],
    };
  }

  // Measure organism state (collapses wave function)
  measure(organismId) {
    const quantumState = this.quantumStates.get(organismId);

    if (!quantumState) {
      return { success: false, error: 'Organism has no quantum state' };
    }

    const result = quantumState.collapse();
    this.stats.totalMeasurements++;
    this.stats.totalCollapses++;

    // Check for entanglements
    const affectedEntanglements = [];
    for (const [id, ent] of this.entanglements) {
      if (ent.organism1 === organismId || ent.organism2 === organismId) {
        const correlated = ent.measure(organismId, result);
        affectedEntanglements.push(correlated);
      }
    }

    return {
      success: true,
      organismId,
      measuredState: result,
      affectedEntanglements,
    };
  }

  // Apply quantum gate
  applyGate(organismId, gateType) {
    const quantumState = this.quantumStates.get(organismId);

    if (!quantumState || quantumState.collapsed) {
      return { success: false, error: 'Cannot apply gate to collapsed/missing state' };
    }

    const gate = new QuantumGate(gateType);
    const newState = gate.apply(quantumState);
    this.quantumStates.set(organismId, newState);

    return {
      success: true,
      organismId,
      gate: gateType,
      newProbabilities: newState.getProbabilities(),
    };
  }

  // Quantum teleportation (transfer state)
  teleport(fromOrganismId, toOrganismId) {
    const state = this.quantumStates.get(fromOrganismId);

    if (!state) {
      return { success: false, error: 'Source organism has no quantum state' };
    }

    // Create entanglement
    this.entangle(fromOrganismId, toOrganismId);

    // Measure source (collapses)
    const measurement = this.measure(fromOrganismId);

    // Create new state on target
    const newState = new QuantumState([
      { value: measurement.measuredState, amplitude: 1.0 },
    ]);

    this.quantumStates.set(toOrganismId, newState);

    return {
      success: true,
      from: fromOrganismId,
      to: toOrganismId,
      teleportedState: measurement.measuredState,
    };
  }

  // Get protocol status
  getStatus() {
    return {
      name: this.name,
      stats: this.stats,
      activeStates: Array.from(this.quantumStates.keys()).length,
      activeEntanglements: Array.from(this.entanglements.values())
        .filter(e => e.entangled).length,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  QUANTUM AGENT — AI agent using quantum protocols
// ══════════════════════════════════════════════════════════════════

export class QuantumAgent extends AlphaAgent {
  constructor({ name = 'QUANTUM_AGENT' } = {}) {
    super({
      name,
      archetype: ARCHETYPES.MAGICIAN,
      purpose: 'explore quantum decision spaces',
      organism: 'quantum_protocol',
    });

    this.protocol = new QuantumProtocol();
    this.decisionHistory = [];

    console.log(`⚛️ QuantumAgent "${name}" initialized`);
  }

  // Make quantum decision (explore superposed options)
  async makeQuantumDecision(options) {
    // Create superposition of all options
    const states = options.map(opt => ({
      value: opt.value,
      amplitude: opt.probability || 1.0 / Math.sqrt(options.length),
    }));

    const stateResult = this.protocol.createState(this.name, states);

    // Let quantum state evolve (apply gates if needed)
    // ... quantum operations ...

    // Collapse and measure
    const measurement = this.protocol.measure(this.name);

    this.decisionHistory.push({
      options,
      decision: measurement.measuredState,
      timestamp: Date.now(),
    });

    return {
      decision: measurement.measuredState,
      probabilities: stateResult.probabilities,
      quantum: true,
    };
  }

  // Entangle with another agent
  async entangleWith(otherAgentId) {
    return this.protocol.entangle(this.name, otherAgentId);
  }

  getStatus() {
    return {
      ...this.getAgentStatus(),
      protocol: this.protocol.getStatus(),
      decisions: this.decisionHistory.length,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════

export default {
  QuantumState,
  QuantumEntanglement,
  QuantumGate,
  QuantumProtocol,
  QuantumAgent,
};
