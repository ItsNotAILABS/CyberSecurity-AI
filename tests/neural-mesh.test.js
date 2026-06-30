///
/// tests/neural-mesh.test.js
///
/// Comprehensive test coverage for sdk/neural-mesh/src/index.js
///
/// Covers:
///   - NeuronNode: construction, activation functions, receive, process, fire, connect
///   - NeuralLayer: construction, getNeuron, broadcast, getActivations
///   - SynapticConnection: construction, transmit, strengthen, weaken
///   - NeuralMesh: construction, registerOrganism, createLayer, createSynapse, propagateSignal
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  NeuronNode,
  NeuralLayer,
  SynapticConnection,
  NeuralMesh,
} from '../sdk/neural-mesh/src/index.js';

// ─── NeuronNode ───────────────────────────────────────────────────────────

describe('NeuronNode', () => {
  test('constructs with id and organismId', () => {
    const neuron = new NeuronNode({ id: 'n1', organismId: 'org1', layer: 0 });
    assert.strictEqual(neuron.id, 'n1');
    assert.strictEqual(neuron.organismId, 'org1');
    assert.strictEqual(neuron.layer, 0);
    assert.strictEqual(neuron.activationFunction, 'sigmoid');
  });

  test('generates id if not provided', () => {
    const neuron = new NeuronNode({ organismId: 'org1' });
    assert.ok(neuron.id.startsWith('neuron_'));
  });

  test('sigmoid activation produces value in (0, 1)', () => {
    const neuron = new NeuronNode({ id: 'n1', activationFunction: 'sigmoid' });
    const result = neuron._activate(0);
    assert.strictEqual(result, 0.5); // sigmoid(0) = 0.5
    
    const result2 = neuron._activate(10);
    assert.ok(result2 > 0.99 && result2 <= 1);
    
    const result3 = neuron._activate(-10);
    assert.ok(result3 >= 0 && result3 < 0.01);
  });

  test('tanh activation produces value in (-1, 1)', () => {
    const neuron = new NeuronNode({ id: 'n1', activationFunction: 'tanh' });
    const result = neuron._activate(0);
    assert.ok(Math.abs(result) < 0.001); // tanh(0) = 0
  });

  test('relu activation returns max(0, value)', () => {
    const neuron = new NeuronNode({ id: 'n1', activationFunction: 'relu' });
    assert.strictEqual(neuron._activate(5), 5);
    assert.strictEqual(neuron._activate(-5), 0);
    assert.strictEqual(neuron._activate(0), 0);
  });

  test('leaky_relu activation returns value or 0.01*value', () => {
    const neuron = new NeuronNode({ id: 'n1', activationFunction: 'leaky_relu' });
    assert.strictEqual(neuron._activate(5), 5);
    assert.strictEqual(neuron._activate(-5), -0.05);
  });

  test('phi activation multiplies by φ', () => {
    const neuron = new NeuronNode({ id: 'n1', activationFunction: 'phi' });
    const PHI = 1.6180339887498948482;
    assert.ok(Math.abs(neuron._activate(2) - 2 * PHI) < 1e-10);
  });

  test('receive adds signal to input buffer', () => {
    const neuron = new NeuronNode({ id: 'n1' });
    neuron.receive({ value: 0.5, source: 'n0' });
    assert.strictEqual(neuron.state.inputBuffer.length, 1);
    assert.strictEqual(neuron.state.inputBuffer[0].value, 0.5);
  });

  test('receive triggers process when buffer is full', () => {
    const neuron = new NeuronNode({ id: 'n1' });
    neuron.receive({ value: 0.3, source: 'n0' });
    neuron.receive({ value: 0.4, source: 'n0' });
    assert.strictEqual(neuron.state.inputBuffer.length, 2);
    neuron.receive({ value: 0.5, source: 'n0' }); // Triggers process (buffer >= 3)
    assert.strictEqual(neuron.state.inputBuffer.length, 0); // Buffer cleared after process
    assert.ok(neuron.state.fireCount >= 1);
  });

  test('process computes activation from input buffer', () => {
    const neuron = new NeuronNode({ id: 'n1', activationFunction: 'relu' });
    neuron.state.inputBuffer = [
      { value: 1, source: 'a' },
      { value: 2, source: 'b' },
      { value: 3, source: 'c' },
    ];
    neuron.process();
    // Sum = 6, relu(6) = 6
    assert.strictEqual(neuron.state.activation, 6);
    assert.strictEqual(neuron.state.fireCount, 1);
    assert.strictEqual(neuron.state.inputBuffer.length, 0);
  });

  test('fire returns signals to connected neurons', () => {
    const neuron = new NeuronNode({ id: 'n1', activationFunction: 'relu' });
    neuron.connect('n2', 0.5);
    neuron.connect('n3', 0.8);
    neuron.state.activation = 2.0;
    
    const signals = neuron.fire();
    assert.strictEqual(signals.length, 2);
    
    const sigToN2 = signals.find(s => s.target === 'n2');
    assert.ok(sigToN2);
    assert.strictEqual(sigToN2.value, 1.0); // 2.0 * 0.5
    
    const sigToN3 = signals.find(s => s.target === 'n3');
    assert.ok(sigToN3);
    assert.strictEqual(sigToN3.value, 1.6); // 2.0 * 0.8
  });

  test('connect adds connection with weight', () => {
    const neuron = new NeuronNode({ id: 'n1' });
    const result = neuron.connect('n2', 0.75);
    assert.strictEqual(result.connected, 'n2');
    assert.strictEqual(result.weight, 0.75);
    assert.strictEqual(neuron.connections.get('n2'), 0.75);
  });

  test('updateWeight adjusts connection weight', () => {
    const neuron = new NeuronNode({ id: 'n1' });
    neuron.connect('n2', 0.5);
    const newWeight = neuron.updateWeight('n2', 0.1);
    assert.strictEqual(newWeight, 0.6);
  });

  test('updateWeight creates connection if not exists', () => {
    const neuron = new NeuronNode({ id: 'n1' });
    const newWeight = neuron.updateWeight('n3', 0.3);
    assert.strictEqual(newWeight, 0.3);
  });
});

// ─── NeuralLayer ──────────────────────────────────────────────────────────

describe('NeuralLayer', () => {
  test('constructs with id and size', () => {
    const layer = new NeuralLayer({ id: 'layer1', size: 5 });
    assert.strictEqual(layer.id, 'layer1');
    assert.strictEqual(layer.size, 5);
    assert.strictEqual(layer.neurons.length, 5);
  });

  test('generates id if not provided', () => {
    const layer = new NeuralLayer({ size: 3 });
    assert.ok(layer.id.startsWith('layer_'));
  });

  test('all neurons have correct layer reference', () => {
    const layer = new NeuralLayer({ id: 'layer1', size: 3 });
    for (const neuron of layer.neurons) {
      assert.strictEqual(neuron.layer, 'layer1');
    }
  });

  test('getNeuron returns neuron by index', () => {
    const layer = new NeuralLayer({ id: 'layer1', size: 3 });
    const neuron = layer.getNeuron(1);
    assert.ok(neuron instanceof NeuronNode);
  });

  test('broadcast sends signal to all neurons', () => {
    const layer = new NeuralLayer({ id: 'layer1', size: 3 });
    const signal = { value: 0.5, source: 'external' };
    layer.broadcast(signal);
    
    // Each neuron should have received the signal
    for (const neuron of layer.neurons) {
      assert.strictEqual(neuron.state.inputBuffer.length, 1);
    }
  });

  test('getActivations returns array of neuron activations', () => {
    const layer = new NeuralLayer({ id: 'layer1', size: 3 });
    layer.neurons[0].state.activation = 0.1;
    layer.neurons[1].state.activation = 0.5;
    layer.neurons[2].state.activation = 0.9;
    
    const activations = layer.getActivations();
    assert.deepStrictEqual(activations, [0.1, 0.5, 0.9]);
  });
});

// ─── SynapticConnection ───────────────────────────────────────────────────

describe('SynapticConnection', () => {
  test('constructs with from/to organisms and strength', () => {
    const synapse = new SynapticConnection('org1', 'org2', 0.7);
    assert.strictEqual(synapse.from, 'org1');
    assert.strictEqual(synapse.to, 'org2');
    assert.strictEqual(synapse.strength, 0.7);
    assert.strictEqual(synapse.signalCount, 0);
  });

  test('id is generated from from/to', () => {
    const synapse = new SynapticConnection('org1', 'org2');
    assert.strictEqual(synapse.id, 'synapse_org1_to_org2');
  });

  test('transmit returns amplified signal', () => {
    const synapse = new SynapticConnection('org1', 'org2', 0.5);
    const signal = { value: 2.0, source: 'org1' };
    const result = synapse.transmit(signal);
    
    assert.strictEqual(result.connection, synapse.id);
    assert.strictEqual(result.strength, 0.5);
    assert.strictEqual(result.amplified, 1.0); // 2.0 * 0.5
    assert.strictEqual(synapse.signalCount, 1);
  });

  test('transmit increments signalCount', () => {
    const synapse = new SynapticConnection('org1', 'org2', 0.5);
    synapse.transmit({ value: 1 });
    synapse.transmit({ value: 1 });
    synapse.transmit({ value: 1 });
    assert.strictEqual(synapse.signalCount, 3);
  });

  test('strengthen increases connection strength', () => {
    const synapse = new SynapticConnection('org1', 'org2', 0.5);
    synapse.strengthen(0.1);
    assert.strictEqual(synapse.strength, 0.6);
  });

  test('strengthen caps at 1.0', () => {
    const synapse = new SynapticConnection('org1', 'org2', 0.95);
    synapse.strengthen(0.1);
    assert.strictEqual(synapse.strength, 1.0);
  });

  test('weaken decreases connection strength', () => {
    const synapse = new SynapticConnection('org1', 'org2', 0.5);
    synapse.weaken(0.1);
    assert.strictEqual(synapse.strength, 0.4);
  });

  test('weaken floors at 0.0', () => {
    const synapse = new SynapticConnection('org1', 'org2', 0.05);
    synapse.weaken(0.1);
    assert.strictEqual(synapse.strength, 0.0);
  });
});

// ─── NeuralMesh ───────────────────────────────────────────────────────────

describe('NeuralMesh', () => {
  test('constructs with name and topology', () => {
    const mesh = new NeuralMesh({ name: 'test-mesh', topology: 'star' });
    assert.strictEqual(mesh.name, 'test-mesh');
    assert.strictEqual(mesh.topology, 'star');
    assert.strictEqual(mesh.stats.totalOrganisms, 0);
    assert.strictEqual(mesh.stats.totalSynapses, 0);
  });

  test('defaults to fully_connected topology', () => {
    const mesh = new NeuralMesh({});
    assert.strictEqual(mesh.topology, 'fully_connected');
  });

  test('registerOrganism adds organism to mesh', () => {
    const mesh = new NeuralMesh({ topology: 'star' }); // Avoid auto-synapses
    const result = mesh.registerOrganism('org1', { type: 'guardian' });
    
    assert.strictEqual(result.registered, 'org1');
    assert.strictEqual(mesh.stats.totalOrganisms, 1);
    assert.ok(mesh.organisms.has('org1'));
  });

  test('registerOrganism auto-creates synapses in fully_connected topology', () => {
    const mesh = new NeuralMesh({ topology: 'fully_connected' });
    mesh.registerOrganism('org1');
    mesh.registerOrganism('org2');
    mesh.registerOrganism('org3');
    
    // For 3 organisms in fully_connected: should have bidirectional connections
    // org2 joins: 2 synapses (org1->org2, org2->org1)
    // org3 joins: 4 more synapses (org3->org1, org1->org3, org3->org2, org2->org3)
    // Total: 6 synapses
    assert.strictEqual(mesh.stats.totalSynapses, 6);
  });

  test('createLayer adds layer to mesh', () => {
    const mesh = new NeuralMesh({});
    const layer = mesh.createLayer('input', 10, 'relu');
    
    assert.ok(layer instanceof NeuralLayer);
    assert.strictEqual(mesh.layers.size, 1);
    assert.ok(mesh.layers.has('input'));
  });

  test('createSynapse creates connection between organisms', () => {
    const mesh = new NeuralMesh({ topology: 'star' });
    mesh.registerOrganism('org1');
    mesh.registerOrganism('org2');
    
    const synapse = mesh.createSynapse('org1', 'org2', 0.8);
    
    assert.ok(synapse instanceof SynapticConnection);
    assert.strictEqual(synapse.strength, 0.8);
    assert.strictEqual(mesh.stats.totalSynapses, 1);
  });

  test('propagateSignal routes signal through synapses', () => {
    const mesh = new NeuralMesh({ topology: 'star' });
    mesh.registerOrganism('org1');
    mesh.registerOrganism('org2');
    mesh.createSynapse('org1', 'org2', 0.5);
    
    const signal = { source: 'org1', value: 2.0 };
    const processed = mesh.propagateSignal(signal);
    
    assert.strictEqual(processed.length, 1);
    assert.strictEqual(processed[0].amplified, 1.0); // 2.0 * 0.5
    assert.strictEqual(mesh.stats.totalSignals, 1);
  });

  test('propagateSignal strengthens used synapses (Hebbian learning)', () => {
    const mesh = new NeuralMesh({ topology: 'star' });
    mesh.registerOrganism('org1');
    mesh.registerOrganism('org2');
    const synapse = mesh.createSynapse('org1', 'org2', 0.5);
    
    const initialStrength = synapse.strength;
    mesh.propagateSignal({ source: 'org1', value: 1.0 });
    
    assert.ok(synapse.strength > initialStrength);
  });

  test('getMeshStatus returns expected shape', () => {
    const mesh = new NeuralMesh({ name: 'test-mesh' });
    mesh.registerOrganism('org1');
    
    const status = mesh.getMeshStatus();
    assert.strictEqual(status.name, 'test-mesh');
    assert.strictEqual(status.organisms, 1);
    assert.ok('synapses' in status);
    assert.ok('layers' in status);
    assert.ok('density' in status);
    assert.ok('totalSignals' in status);
    assert.ok('queuedSignals' in status);
  });

  test('visualize returns mesh structure', () => {
    const mesh = new NeuralMesh({ topology: 'star' });
    mesh.registerOrganism('org1');
    mesh.registerOrganism('org2');
    mesh.createSynapse('org1', 'org2', 0.5);
    
    const viz = mesh.visualize();
    assert.ok(Array.isArray(viz.organisms));
    assert.ok(Array.isArray(viz.connections));
    assert.ok(Array.isArray(viz.layers));
    assert.ok(viz.organisms.includes('org1'));
    assert.ok(viz.organisms.includes('org2'));
  });

  test('mesh density calculation is correct', () => {
    const mesh = new NeuralMesh({ topology: 'star' });
    mesh.registerOrganism('org1');
    mesh.registerOrganism('org2');
    mesh.registerOrganism('org3');
    // 3 organisms, max synapses = 3 * 2 = 6
    mesh.createSynapse('org1', 'org2', 0.5);
    mesh.createSynapse('org2', 'org3', 0.5);
    // 2 synapses out of 6 possible = 0.333 density
    
    const status = mesh.getMeshStatus();
    assert.ok(Math.abs(parseFloat(status.density) - (2/6)) < 0.01);
  });
});
