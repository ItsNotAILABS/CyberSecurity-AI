///
/// Test shim for @medina/birth-ai
/// Provides Agent export that swarm-intelligence and other SDKs expect.
///

export class Agent {
  constructor({ name, archetype } = {}) {
    this.name = name;
    this.archetype = archetype;
    this.isAlive = true;
    this.birthTime = Date.now();
  }
  
  stop() {
    this.isAlive = false;
  }
  
  getAgentStatus() {
    return {
      name: this.name,
      archetype: this.archetype,
      isAlive: this.isAlive,
      uptime: Date.now() - this.birthTime,
    };
  }
}
