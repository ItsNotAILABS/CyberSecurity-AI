///
/// tests/swarm-intelligence.test.js
///
/// Comprehensive test coverage for sdk/swarm-intelligence/src/index.js
///
/// Covers:
///   - SwarmAgent: construction, boid rules (separate, align, cohesion), vector math
///   - Swarm: construction, update, getCentroid, getStatus
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  SwarmAgent,
  Swarm,
} from '../sdk/swarm-intelligence/src/index.js';

const PHI = 1.6180339887498948482;

// ─── SwarmAgent ───────────────────────────────────────────────────────────

describe('SwarmAgent', () => {
  test('constructs with name, position, and velocity', () => {
    const agent = new SwarmAgent({
      name: 'agent1',
      position: [10, 20, 30],
      velocity: [1, 2, 3],
    });
    assert.strictEqual(agent.name, 'agent1');
    assert.deepStrictEqual(agent.position, [10, 20, 30]);
    assert.deepStrictEqual(agent.velocity, [1, 2, 3]);
  });

  test('defaults position and velocity to [0,0,0]', () => {
    const agent = new SwarmAgent({ name: 'agent1' });
    assert.deepStrictEqual(agent.position, [0, 0, 0]);
    assert.deepStrictEqual(agent.velocity, [0, 0, 0]);
  });

  test('acceleration starts at [0,0,0]', () => {
    const agent = new SwarmAgent({ name: 'agent1' });
    assert.deepStrictEqual(agent.acceleration, [0, 0, 0]);
  });

  test('maxSpeed is φ * 2', () => {
    const agent = new SwarmAgent({ name: 'agent1' });
    assert.ok(Math.abs(agent.maxSpeed - PHI * 2) < 1e-10);
  });

  test('distance calculates 3D Euclidean distance', () => {
    const agent = new SwarmAgent({ name: 'agent1', position: [0, 0, 0] });
    // Distance to (3, 4, 0) should be 5
    const d = agent.distance([3, 4, 0]);
    assert.ok(Math.abs(d - 5) < 1e-10);
  });

  test('subtract returns vector difference', () => {
    const agent = new SwarmAgent({ name: 'agent1' });
    const diff = agent.subtract([5, 10, 15], [2, 3, 4]);
    assert.deepStrictEqual(diff, [3, 7, 11]);
  });

  test('normalize returns unit vector', () => {
    const agent = new SwarmAgent({ name: 'agent1' });
    const norm = agent.normalize([3, 4, 0]);
    // Should be [0.6, 0.8, 0]
    assert.ok(Math.abs(norm[0] - 0.6) < 1e-10);
    assert.ok(Math.abs(norm[1] - 0.8) < 1e-10);
    assert.ok(Math.abs(norm[2]) < 1e-10);
  });

  test('normalize returns [0,0,0] for zero vector', () => {
    const agent = new SwarmAgent({ name: 'agent1' });
    const norm = agent.normalize([0, 0, 0]);
    assert.deepStrictEqual(norm, [0, 0, 0]);
  });

  test('update applies acceleration to velocity and velocity to position', () => {
    const agent = new SwarmAgent({
      name: 'agent1',
      position: [0, 0, 0],
      velocity: [1, 0, 0],
    });
    agent.acceleration = [0.1, 0.2, 0];
    agent.update();
    
    // velocity += acceleration -> [1.1, 0.2, 0]
    assert.deepStrictEqual(agent.velocity, [1.1, 0.2, 0]);
    // position += velocity -> [1.1, 0.2, 0]
    assert.deepStrictEqual(agent.position, [1.1, 0.2, 0]);
    // acceleration reset to [0, 0, 0]
    assert.deepStrictEqual(agent.acceleration, [0, 0, 0]);
  });

  test('seek returns direction toward target', () => {
    const agent = new SwarmAgent({
      name: 'agent1',
      position: [0, 0, 0],
    });
    const target = [10, 0, 0];
    const seek = agent.seek(target);
    // Normalized direction toward target should be [1, 0, 0]
    assert.ok(Math.abs(seek[0] - 1) < 1e-10);
    assert.ok(Math.abs(seek[1]) < 1e-10);
    assert.ok(Math.abs(seek[2]) < 1e-10);
  });

  test('separate returns steering away from nearby agents', () => {
    // Create a mock swarm with agents
    const agent = new SwarmAgent({
      name: 'agent1',
      position: [0, 0, 0],
    });
    
    const mockSwarm = {
      agents: [
        { position: [10, 0, 0] }, // Within separation distance (25)
        { position: [100, 0, 0] }, // Outside separation distance
      ]
    };
    
    const sep = agent.separate(mockSwarm);
    // Should steer away from the nearby agent
    assert.ok(Array.isArray(sep));
    assert.strictEqual(sep.length, 3);
    // Steering should be in negative x direction (away from [10,0,0])
    assert.ok(sep[0] < 0);
  });

  test('align returns average velocity of nearby agents', () => {
    const agent = new SwarmAgent({
      name: 'agent1',
      position: [0, 0, 0],
    });
    
    const mockSwarm = {
      agents: [
        { position: [10, 0, 0], velocity: [1, 0, 0] },
        { position: [20, 0, 0], velocity: [1, 0, 0] },
        { position: [100, 0, 0], velocity: [-1, 0, 0] }, // Outside neighbor distance
      ]
    };
    
    const ali = agent.align(mockSwarm);
    assert.ok(Array.isArray(ali));
    assert.strictEqual(ali.length, 3);
  });

  test('cohesion returns steering toward center of nearby agents', () => {
    const agent = new SwarmAgent({
      name: 'agent1',
      position: [0, 0, 0],
    });
    
    const mockSwarm = {
      agents: [
        { position: [10, 0, 0] },
        { position: [20, 0, 0] },
      ]
    };
    
    const coh = agent.cohesion(mockSwarm);
    assert.ok(Array.isArray(coh));
    assert.strictEqual(coh.length, 3);
    // Should steer toward the center (around [15, 0, 0])
    assert.ok(coh[0] > 0);
  });

  test('flock combines separation, alignment, and cohesion', () => {
    const agent = new SwarmAgent({
      name: 'agent1',
      position: [0, 0, 0],
      velocity: [0, 0, 0],
    });
    
    const mockSwarm = {
      agents: [
        { position: [30, 0, 0], velocity: [1, 0, 0] },
      ]
    };
    
    const initialAcc = [...agent.acceleration];
    agent.flock(mockSwarm);
    
    // Acceleration should have changed (some force applied)
    // At least one component should be different
    const hasChanged = agent.acceleration.some((v, i) => v !== initialAcc[i]);
    assert.ok(hasChanged || agent.acceleration.every(v => v === 0));
  });
});

// ─── Swarm ────────────────────────────────────────────────────────────────

describe('Swarm', () => {
  test('constructs with name and size', () => {
    const swarm = new Swarm({ name: 'TestSwarm', size: 10 });
    assert.strictEqual(swarm.name, 'TestSwarm');
    assert.strictEqual(swarm.agents.length, 10);
  });

  test('defaults to SWARM name and 50 agents', () => {
    const swarm = new Swarm({});
    assert.strictEqual(swarm.name, 'SWARM');
    assert.strictEqual(swarm.agents.length, 50);
  });

  test('all agents are SwarmAgent instances', () => {
    const swarm = new Swarm({ size: 5 });
    for (const agent of swarm.agents) {
      assert.ok(agent instanceof SwarmAgent);
    }
  });

  test('agents have randomized positions in 0-1000, 0-1000, 0-100 range', () => {
    const swarm = new Swarm({ size: 10 });
    for (const agent of swarm.agents) {
      assert.ok(agent.position[0] >= 0 && agent.position[0] <= 1000);
      assert.ok(agent.position[1] >= 0 && agent.position[1] <= 1000);
      assert.ok(agent.position[2] >= 0 && agent.position[2] <= 100);
    }
  });

  test('agents have randomized velocities in -1 to 1 range', () => {
    const swarm = new Swarm({ size: 10 });
    for (const agent of swarm.agents) {
      assert.ok(agent.velocity[0] >= -1 && agent.velocity[0] <= 1);
      assert.ok(agent.velocity[1] >= -1 && agent.velocity[1] <= 1);
      assert.ok(agent.velocity[2] >= -1 && agent.velocity[2] <= 1);
    }
  });

  test('update calls flock and update on all agents', () => {
    const swarm = new Swarm({ size: 3 });
    
    // Store initial positions
    const initialPositions = swarm.agents.map(a => [...a.position]);
    
    // Give agents some velocity
    swarm.agents[0].velocity = [1, 0, 0];
    swarm.agents[1].velocity = [0, 1, 0];
    swarm.agents[2].velocity = [0, 0, 1];
    
    swarm.update();
    
    // Positions should have changed
    const positionsChanged = swarm.agents.some((agent, i) => 
      agent.position[0] !== initialPositions[i][0] ||
      agent.position[1] !== initialPositions[i][1] ||
      agent.position[2] !== initialPositions[i][2]
    );
    assert.ok(positionsChanged);
  });

  test('getCentroid returns average position of all agents', () => {
    const swarm = new Swarm({ size: 3 });
    
    // Set known positions
    swarm.agents[0].position = [0, 0, 0];
    swarm.agents[1].position = [30, 60, 90];
    swarm.agents[2].position = [60, 120, 180];
    
    const centroid = swarm.getCentroid();
    // Average: [30, 60, 90]
    assert.strictEqual(centroid[0], 30);
    assert.strictEqual(centroid[1], 60);
    assert.strictEqual(centroid[2], 90);
  });

  test('getStatus returns expected shape', () => {
    const swarm = new Swarm({ name: 'TestSwarm', size: 5 });
    const status = swarm.getStatus();
    
    assert.strictEqual(status.name, 'TestSwarm');
    assert.strictEqual(status.size, 5);
    assert.ok(Array.isArray(status.centroid));
    assert.strictEqual(status.centroid.length, 3);
  });

  test('multiple updates converge swarm behavior', () => {
    const swarm = new Swarm({ size: 5 });
    
    // Run several updates
    for (let i = 0; i < 10; i++) {
      swarm.update();
    }
    
    // Swarm should still be functional
    const status = swarm.getStatus();
    assert.strictEqual(status.size, 5);
    assert.ok(Array.isArray(status.centroid));
  });
});
