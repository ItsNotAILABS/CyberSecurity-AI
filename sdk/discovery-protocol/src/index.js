///
/// @medina/discovery-protocol — Organism Discovery and Connection
/// DPC-2026: Discovery Protocol Charter
/// Broadcast, capability advertisement, and connection establishment
///

import { PHI, HEARTBEAT_MS } from '@medina/medina-heart';

export class OrganismAnnouncement {
  constructor({ organismId, capabilities = [], environment = 'unknown' } = {}) {
    this.organismId = organismId;
    this.capabilities = new Set(capabilities);
    this.environment = environment;
    this.timestamp = Date.now();
    this.ttl = 60000; // 60 second TTL
    this.signature = this._sign();
  }

  _sign() {
    const data = `${this.organismId}:${Array.from(this.capabilities).join(',')}:${this.timestamp}`;
    return Math.floor(data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * PHI);
  }

  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }

  hasCapability(capability) {
    return this.capabilities.has(capability);
  }

  toJSON() {
    return {
      organismId: this.organismId,
      capabilities: Array.from(this.capabilities),
      environment: this.environment,
      timestamp: this.timestamp,
      signature: this.signature,
    };
  }
}

export class ConnectionRequest {
  constructor({ requesterId, targetId, connectionType = 'direct' } = {}) {
    this.id = `conn_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.requesterId = requesterId;
    this.targetId = targetId;
    this.connectionType = connectionType; // direct, relay, mesh
    this.timestamp = Date.now();
    this.status = 'pending'; // pending, accepted, rejected, timeout
    this.challenge = this._generateChallenge();
  }

  _generateChallenge() {
    return Math.floor(Math.random() * PHI * 1000000);
  }

  generateResponse() {
    const data = `${this.requesterId}:${this.targetId}:${this.challenge}`;
    return Math.floor(data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * PHI);
  }

  verify(response) {
    return response === this.generateResponse();
  }
}

export class DiscoveryDirectory {
  constructor({ type = 'distributed' } = {}) {
    this.type = type; // centralized or distributed
    this.organisms = new Map();
    this.lastCleanup = Date.now();
  }

  register(announcement) {
    this.organisms.set(announcement.organismId, announcement);
    this.cleanup();
  }

  unregister(organismId) {
    this.organisms.delete(organismId);
  }

  find(criteria = {}) {
    const results = [];

    for (const organism of this.organisms.values()) {
      if (organism.isExpired()) continue;

      let matches = true;

      if (criteria.capability && !organism.hasCapability(criteria.capability)) {
        matches = false;
      }

      if (criteria.environment && organism.environment !== criteria.environment) {
        matches = false;
      }

      if (matches) {
        results.push(organism);
      }
    }

    return results;
  }

  cleanup() {
    const now = Date.now();
    if (now - this.lastCleanup < 30000) return;

    for (const [id, organism] of this.organisms.entries()) {
      if (organism.isExpired()) {
        this.organisms.delete(id);
      }
    }

    this.lastCleanup = now;
  }

  getAll() {
    this.cleanup();
    return Array.from(this.organisms.values());
  }
}

export class DiscoveryEngine {
  constructor({ organismId, capabilities = [], environment = 'unknown', range = 'global' } = {}) {
    this.organismId = organismId;
    this.capabilities = capabilities;
    this.environment = environment;
    this.range = range; // subnet or global
    this.directory = new DiscoveryDirectory({ type: 'distributed' });
    this.discovered = new Map();
    this.connections = new Map();
    this.broadcastInterval = null;
  }

  // Broadcasting announcements
  startBroadcasting(interval = 60000) {
    this.broadcastInterval = setInterval(() => {
      this.broadcast();
    }, interval);

    // Immediate first broadcast
    this.broadcast();
  }

  stopBroadcasting() {
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
      this.broadcastInterval = null;
    }
  }

  broadcast() {
    const announcement = new OrganismAnnouncement({
      organismId: this.organismId,
      capabilities: this.capabilities,
      environment: this.environment,
    });

    // Register self in directory
    this.directory.register(announcement);

    return announcement;
  }

  // Capability advertisement
  advertiseCapability(capability) {
    if (!this.capabilities.includes(capability)) {
      this.capabilities.push(capability);
    }
  }

  removeCapability(capability) {
    this.capabilities = this.capabilities.filter(c => c !== capability);
  }

  // Discovery
  discover(criteria = {}) {
    const found = this.directory.find(criteria);

    for (const organism of found) {
      if (organism.organismId !== this.organismId) {
        this.discovered.set(organism.organismId, organism);
      }
    }

    return found.filter(o => o.organismId !== this.organismId);
  }

  discoverByCapability(capability) {
    return this.discover({ capability });
  }

  discoverInEnvironment(environment) {
    return this.discover({ environment });
  }

  // Connection establishment
  requestConnection(targetId, connectionType = 'direct') {
    const request = new ConnectionRequest({
      requesterId: this.organismId,
      targetId,
      connectionType,
    });

    return request;
  }

  acceptConnection(request) {
    if (!request.verify(request.generateResponse())) {
      return { accepted: false, reason: 'verification_failed' };
    }

    request.status = 'accepted';

    const connection = {
      peerId: request.requesterId,
      type: request.connectionType,
      established: Date.now(),
      active: true,
    };

    this.connections.set(request.requesterId, connection);

    return {
      accepted: true,
      connection,
      response: request.generateResponse(),
    };
  }

  rejectConnection(request, reason = 'declined') {
    request.status = 'rejected';
    return { accepted: false, reason };
  }

  // Connection negotiation
  negotiate(request) {
    const target = this.discovered.get(request.targetId);

    if (!target) {
      return { success: false, reason: 'target_not_found' };
    }

    // Check compatibility
    const compatible = this._checkCompatibility(target);

    if (!compatible) {
      return { success: false, reason: 'incompatible' };
    }

    // Determine best connection type
    const connectionType = this._determineBestConnection(target);

    return {
      success: true,
      connectionType,
      target: target.organismId,
    };
  }

  _checkCompatibility(target) {
    // Check if organisms share any capabilities
    const targetCaps = target.capabilities;
    return this.capabilities.some(cap => targetCaps.has(cap));
  }

  _determineBestConnection(target) {
    // φ-based connection type selection
    if (target.environment === this.environment) {
      return 'direct';
    } else if (Math.random() < PHI / 2) {
      return 'mesh';
    } else {
      return 'relay';
    }
  }

  // Directory service integration
  registerWithDirectory(announcement) {
    this.directory.register(announcement);
  }

  queryDirectory(criteria) {
    return this.directory.find(criteria);
  }

  getStatus() {
    return {
      organismId: this.organismId,
      capabilities: this.capabilities.length,
      environment: this.environment,
      range: this.range,
      discovered: this.discovered.size,
      connections: this.connections.size,
      broadcasting: this.broadcastInterval !== null,
      directorySize: this.directory.organisms.size,
    };
  }
}

export default { OrganismAnnouncement, ConnectionRequest, DiscoveryDirectory, DiscoveryEngine };
