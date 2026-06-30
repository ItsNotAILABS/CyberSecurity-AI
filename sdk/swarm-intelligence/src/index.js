///
/// @medina/swarm-intelligence — Collective Swarm Behaviors
///
/// Emergent intelligence through coordinated swarms of AI agents.
/// Implements boids, ant colony optimization, particle swarm optimization.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { LivingAI, ARCHETYPES, PHI } from '@medina/medina-heart';
import { Agent } from '@medina/birth-ai';

// Swarm Agent (Boid)
export class SwarmAgent extends Agent {
  constructor({ name, position = [0, 0, 0], velocity = [0, 0, 0] } = {}) {
    super({ name, archetype: ARCHETYPES.EXPLORER });

    this.position = position;
    this.velocity = velocity;
    this.acceleration = [0, 0, 0];
    this.maxSpeed = PHI * 2;
    this.maxForce = 0.1;
    this.neighbors = [];

    console.log(`🐝 SwarmAgent ${name} initialized`);
  }

  // Boid rules: separation, alignment, cohesion
  flock(swarm) {
    const sep = this.separate(swarm);
    const ali = this.align(swarm);
    const coh = this.cohesion(swarm);

    // Weight the forces
    sep.forEach((v, i) => this.acceleration[i] += v * 1.5);
    ali.forEach((v, i) => this.acceleration[i] += v * 1.0);
    coh.forEach((v, i) => this.acceleration[i] += v * 1.0);
  }

  separate(swarm) {
    const desiredSeparation = 25;
    const steer = [0, 0, 0];
    let count = 0;

    for (const other of swarm.agents) {
      const d = this.distance(other.position);
      if (d > 0 && d < desiredSeparation) {
        const diff = this.subtract(this.position, other.position);
        const normalized = this.normalize(diff);
        normalized.forEach((v, i) => steer[i] += v / d);
        count++;
      }
    }

    if (count > 0) {
      steer.forEach((v, i) => steer[i] /= count);
    }

    return steer;
  }

  align(swarm) {
    const neighborDist = 50;
    const sum = [0, 0, 0];
    let count = 0;

    for (const other of swarm.agents) {
      const d = this.distance(other.position);
      if (d > 0 && d < neighborDist) {
        other.velocity.forEach((v, i) => sum[i] += v);
        count++;
      }
    }

    if (count > 0) {
      sum.forEach((v, i) => sum[i] /= count);
      return this.normalize(sum);
    }

    return [0, 0, 0];
  }

  cohesion(swarm) {
    const neighborDist = 50;
    const sum = [0, 0, 0];
    let count = 0;

    for (const other of swarm.agents) {
      const d = this.distance(other.position);
      if (d > 0 && d < neighborDist) {
        other.position.forEach((v, i) => sum[i] += v);
        count++;
      }
    }

    if (count > 0) {
      sum.forEach((v, i) => sum[i] /= count);
      return this.seek(sum);
    }

    return [0, 0, 0];
  }

  seek(target) {
    const desired = this.subtract(target, this.position);
    return this.normalize(desired);
  }

  update() {
    this.velocity.forEach((v, i) => this.velocity[i] += this.acceleration[i]);
    this.position.forEach((p, i) => this.position[i] += this.velocity[i]);
    this.acceleration = [0, 0, 0];
  }

  distance(pos) {
    return Math.sqrt(
      Math.pow(this.position[0] - pos[0], 2) +
      Math.pow(this.position[1] - pos[1], 2) +
      Math.pow(this.position[2] - pos[2], 2)
    );
  }

  subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  }

  normalize(v) {
    const mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
    return mag > 0 ? [v[0] / mag, v[1] / mag, v[2] / mag] : [0, 0, 0];
  }
}

// Swarm Coordinator
export class Swarm {
  constructor({ name = 'SWARM', size = 50 } = {}) {
    this.name = name;
    this.agents = [];

    // Initialize swarm
    for (let i = 0; i < size; i++) {
      this.agents.push(new SwarmAgent({
        name: `${name}_agent_${i}`,
        position: [Math.random() * 1000, Math.random() * 1000, Math.random() * 100],
        velocity: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
      }));
    }

    console.log(`🐝🐝🐝 Swarm "${name}" created with ${size} agents`);
  }

  // Update all agents
  update() {
    for (const agent of this.agents) {
      agent.flock(this);
      agent.update();
    }
  }

  // Get swarm centroid
  getCentroid() {
    const sum = [0, 0, 0];
    for (const agent of this.agents) {
      agent.position.forEach((v, i) => sum[i] += v);
    }
    return sum.map(v => v / this.agents.length);
  }

  getStatus() {
    return {
      name: this.name,
      size: this.agents.length,
      centroid: this.getCentroid(),
    };
  }
}

export default { SwarmAgent, Swarm };
