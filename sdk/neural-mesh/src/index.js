///
/// @medina/neural-mesh — Multi-Organism Neural Coordination
///
/// Distributed neural network that spans across multiple AI organisms.
/// Creates synaptic connections, propagates signals, and enables
/// collective neural processing across the entire MEDINA ecosystem.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { LivingAI, ARCHETYPES, PHI } from '@medina/medina-heart';
import { AlphaAgent, AlphaQuery, AlphaCall } from '@medina/alpha-sdk';

// ══════════════════════════════════════════════════════════════════
//  NEURON NODE — Individual processing unit in the mesh
// ══════════════════════════════════════════════════════════════════

export class NeuronNode {
  constructor({ id, organismId, layer = 0, activationFunction = 'sigmoid' } = {}) {
    this.id = id || `neuron_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.organismId = organismId;
    this.layer = layer;
    this.activationFunction = activationFunction;

    this.connections = new Map(); // targetId -> weight
    this.state = {
      activation: 0,
      lastFired: 0,
      fireCount: 0,
      inputBuffer: [],
    };

    console.log(`🧠 NeuronNode ${this.id} initialized in layer ${layer}`);
  }

  // Activation functions
  _activate(value) {
    switch (this.activationFunction) {
      case 'sigmoid':
        return 1 / (1 + Math.exp(-value));
      case 'tanh':
        return Math.tanh(value);
      case 'relu':
        return Math.max(0, value);
      case 'leaky_relu':
        return value > 0 ? value : 0.01 * value;
      case 'phi':
        return value * PHI;
      default:
        return value;
    }
  }

  // Receive input signal
  receive(signal) {
    this.state.inputBuffer.push({
      value: signal.value,
      source: signal.source,
      timestamp: Date.now(),
    });

    // Process if buffer is full enough
    if (this.state.inputBuffer.length >= 3) {
      this.process();
    }
  }

  // Process accumulated inputs
  process() {
    const sum = this.state.inputBuffer.reduce((acc, sig) => acc + sig.value, 0);
    this.state.activation = this._activate(sum);
    this.state.lastFired = Date.now();
    this.state.fireCount++;

    // Clear buffer
    this.state.inputBuffer = [];

    // Propagate to connected neurons
    return this.fire();
  }

  // Fire signal to connected neurons
  fire() {
    const signals = [];

    for (const [targetId, weight] of this.connections.entries()) {
      signals.push({
        source: this.id,
        target: targetId,
        value: this.state.activation * weight,
        timestamp: Date.now(),
      });
    }

    return signals;
  }

  // Add connection to another neuron
  connect(targetId, weight = Math.random()) {
    this.connections.set(targetId, weight);
    return { connected: targetId, weight };
  }

  // Update connection weight (learning)
  updateWeight(targetId, delta) {
    const currentWeight = this.connections.get(targetId) || 0;
    const newWeight = currentWeight + delta;
    this.connections.set(targetId, newWeight);
    return newWeight;
  }
}

// ══════════════════════════════════════════════════════════════════
//  NEURAL LAYER — Collection of neurons
// ══════════════════════════════════════════════════════════════════

export class NeuralLayer {
  constructor({ id, size, activationFunction = 'sigmoid' } = {}) {
    this.id = id || `layer_${Date.now()}`;
    this.size = size;
    this.neurons = [];

    // Create neurons
    for (let i = 0; i < size; i++) {
      this.neurons.push(new NeuronNode({
        id: `${this.id}_n${i}`,
        layer: this.id,
        activationFunction,
      }));
    }

    console.log(`🔷 NeuralLayer ${this.id} created with ${size} neurons`);
  }

  // Get neuron by index
  getNeuron(index) {
    return this.neurons[index];
  }

  // Broadcast signal to all neurons
  broadcast(signal) {
    return this.neurons.map(neuron => neuron.receive(signal));
  }

  // Get layer activation state
  getActivations() {
    return this.neurons.map(n => n.state.activation);
  }
}

// ══════════════════════════════════════════════════════════════════
//  SYNAPTIC CONNECTION — Connection between organisms
// ══════════════════════════════════════════════════════════════════

export class SynapticConnection {
  constructor(fromOrganismId, toOrganismId, strength = 0.5) {
    this.id = `synapse_${fromOrganismId}_to_${toOrganismId}`;
    this.from = fromOrganismId;
    this.to = toOrganismId;
    this.strength = strength;
    this.signalCount = 0;
    this.lastSignal = 0;

    console.log(`⚡ Synaptic connection: ${fromOrganismId} → ${toOrganismId} (${strength})`);
  }

  // Transmit signal
  transmit(signal) {
    this.signalCount++;
    this.lastSignal = Date.now();

    return {
      ...signal,
      connection: this.id,
      strength: this.strength,
      amplified: signal.value * this.strength,
    };
  }

  // Strengthen connection (Hebbian learning)
  strengthen(amount = 0.01) {
    this.strength = Math.min(1.0, this.strength + amount);
    return this.strength;
  }

  // Weaken connection
  weaken(amount = 0.01) {
    this.strength = Math.max(0.0, this.strength - amount);
    return this.strength;
  }
}

// ══════════════════════════════════════════════════════════════════
//  NEURAL MESH — Distributed neural network
// ══════════════════════════════════════════════════════════════════

export class NeuralMesh {
  constructor({ name = 'NEURAL_MESH', topology = 'fully_connected' } = {}) {
    this.name = name;
    this.topology = topology;

    this.organisms = new Map(); // organismId -> organism info
    this.layers = new Map(); // layerId -> NeuralLayer
    this.synapses = new Map(); // synapseId -> SynapticConnection
    this.signalQueue = [];

    this.stats = {
      totalSignals: 0,
      totalOrganisms: 0,
      totalSynapses: 0,
      meshDensity: 0,
    };

    console.log(`🕸️ NeuralMesh "${name}" initialized with ${topology} topology`);
  }

  // Register organism in the mesh
  registerOrganism(organismId, metadata = {}) {
    this.organisms.set(organismId, {
      id: organismId,
      joinedAt: Date.now(),
      layer: null,
      neurons: [],
      ...metadata,
    });

    this.stats.totalOrganisms++;
    this._recalculateDensity();

    console.log(`📍 Organism ${organismId} registered in neural mesh`);

    // Auto-connect if topology requires it
    if (this.topology === 'fully_connected') {
      this._createFullyConnectedSynapses(organismId);
    }

    return { registered: organismId, organisms: this.stats.totalOrganisms };
  }

  // Create layer for organisms
  createLayer(layerId, size, activationFunction = 'sigmoid') {
    const layer = new NeuralLayer({ id: layerId, size, activationFunction });
    this.layers.set(layerId, layer);
    return layer;
  }

  // Create synaptic connection between organisms
  createSynapse(fromOrganismId, toOrganismId, strength = 0.5) {
    const synapse = new SynapticConnection(fromOrganismId, toOrganismId, strength);
    this.synapses.set(synapse.id, synapse);
    this.stats.totalSynapses++;
    this._recalculateDensity();
    return synapse;
  }

  // Propagate signal through the mesh
  propagateSignal(signal) {
    this.signalQueue.push({
      ...signal,
      enqueuedAt: Date.now(),
    });

    this.stats.totalSignals++;

    // Process queue
    return this._processSignalQueue();
  }

  // Process queued signals
  _processSignalQueue() {
    const processed = [];

    while (this.signalQueue.length > 0) {
      const signal = this.signalQueue.shift();

      // Find relevant synapses
      const relevantSynapses = Array.from(this.synapses.values())
        .filter(syn => syn.from === signal.source);

      // Transmit through synapses
      for (const synapse of relevantSynapses) {
        const transmitted = synapse.transmit(signal);
        processed.push(transmitted);

        // Strengthen synapse (Hebbian: neurons that fire together wire together)
        synapse.strengthen(0.001);
      }
    }

    return processed;
  }

  // Fully connected topology
  _createFullyConnectedSynapses(newOrganismId) {
    for (const [existingId] of this.organisms) {
      if (existingId !== newOrganismId) {
        // Bidirectional connections
        this.createSynapse(newOrganismId, existingId, 0.3);
        this.createSynapse(existingId, newOrganismId, 0.3);
      }
    }
  }

  // Calculate mesh density (connectivity)
  _recalculateDensity() {
    const n = this.stats.totalOrganisms;
    const maxPossibleSynapses = n * (n - 1); // Directed graph
    this.stats.meshDensity = maxPossibleSynapses > 0
      ? this.stats.totalSynapses / maxPossibleSynapses
      : 0;
  }

  // Get mesh status
  getMeshStatus() {
    return {
      name: this.name,
      topology: this.topology,
      organisms: this.stats.totalOrganisms,
      synapses: this.stats.totalSynapses,
      layers: this.layers.size,
      density: this.stats.meshDensity.toFixed(3),
      totalSignals: this.stats.totalSignals,
      queuedSignals: this.signalQueue.length,
    };
  }

  // Visualize mesh structure
  visualize() {
    const connections = [];

    for (const [id, synapse] of this.synapses) {
      connections.push(`${synapse.from} →(${synapse.strength.toFixed(2)})→ ${synapse.to}`);
    }

    return {
      organisms: Array.from(this.organisms.keys()),
      connections,
      layers: Array.from(this.layers.keys()),
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  MESH COORDINATOR — Manages neural mesh operations
// ══════════════════════════════════════════════════════════════════

export class MeshCoordinator extends AlphaAgent {
  constructor({ name = 'MESH_COORDINATOR' } = {}) {
    super({
      name,
      archetype: ARCHETYPES.MAGICIAN,
      purpose: 'coordinate neural mesh operations',
      organism: 'neural_mesh',
    });

    this.meshes = new Map(); // meshId -> NeuralMesh
    this.activeMesh = null;

    console.log(`🎛️ MeshCoordinator initialized`);
  }

  // Create new neural mesh
  createMesh(meshId, topology = 'fully_connected') {
    const mesh = new NeuralMesh({ name: meshId, topology });
    this.meshes.set(meshId, mesh);
    this.activeMesh = mesh;

    return {
      success: true,
      meshId,
      topology,
    };
  }

  // Register organism in active mesh
  async registerInMesh(organismId, metadata = {}) {
    if (!this.activeMesh) {
      return { success: false, error: 'No active mesh' };
    }

    return this.activeMesh.registerOrganism(organismId, metadata);
  }

  // Broadcast signal to mesh
  async broadcastToMesh(signal) {
    if (!this.activeMesh) {
      return { success: false, error: 'No active mesh' };
    }

    const processed = this.activeMesh.propagateSignal(signal);

    return {
      success: true,
      signalsProcessed: processed.length,
      signals: processed,
    };
  }

  // Get coordinator status
  getStatus() {
    return {
      ...this.getAgentStatus(),
      meshes: this.meshes.size,
      activeMesh: this.activeMesh ? this.activeMesh.name : null,
      meshStatus: this.activeMesh ? this.activeMesh.getMeshStatus() : null,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════

export default {
  NeuronNode,
  NeuralLayer,
  SynapticConnection,
  NeuralMesh,
  MeshCoordinator,
};
