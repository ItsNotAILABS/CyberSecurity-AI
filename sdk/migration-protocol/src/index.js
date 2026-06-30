///
/// @medina/migration-protocol — Organism Migration Between Environments
/// MPC-2026: Migration Protocol Charter
/// Seamless state transfer across platforms with <100ms downtime
///

import { PHI } from '@medina/medina-heart';

export class MigrationPackage {
  constructor({ organismId, state, connections = [], metadata = {} } = {}) {
    this.id = `migration_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.organismId = organismId;
    this.state = this._serializeState(state);
    this.connections = connections;
    this.metadata = {
      sourceEnvironment: 'unknown',
      targetEnvironment: 'unknown',
      timestamp: Date.now(),
      ...metadata,
    };
    this.checksum = this._computeChecksum();
    this.attachments = [];
  }

  _serializeState(state) {
    // Convert state to JSON + handle binary attachments
    const serialized = { json: {}, binary: [] };

    for (const [key, value] of Object.entries(state)) {
      if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
        serialized.binary.push({ key, data: value });
      } else {
        serialized.json[key] = value;
      }
    }

    return serialized;
  }

  _computeChecksum() {
    const data = JSON.stringify(this.state.json);
    return Math.floor(data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) * PHI);
  }

  verify() {
    return this.checksum === this._computeChecksum();
  }

  addAttachment(name, data) {
    this.attachments.push({ name, data, size: data.length });
  }

  toJSON() {
    return {
      id: this.id,
      organismId: this.organismId,
      state: this.state.json,
      connections: this.connections,
      metadata: this.metadata,
      checksum: this.checksum,
      attachmentCount: this.attachments.length,
    };
  }
}

export class MigrationHandshake {
  constructor({ sourceId, targetId } = {}) {
    this.id = `handshake_${Date.now()}`;
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.phase = 'prepare'; // prepare, transfer, confirm
    this.startTime = Date.now();
    this.phaseTimings = {};
  }

  advance(phase) {
    this.phaseTimings[this.phase] = Date.now() - this.startTime;
    this.phase = phase;
    this.startTime = Date.now();
  }

  complete() {
    this.phaseTimings[this.phase] = Date.now() - this.startTime;
    this.phase = 'complete';

    const totalTime = Object.values(this.phaseTimings).reduce((a, b) => a + b, 0);
    return {
      handshakeId: this.id,
      totalTime,
      phaseTimings: this.phaseTimings,
      downtime: totalTime,
    };
  }
}

export class ConnectionPreserver {
  constructor() {
    this.connections = new Map();
    this.preserved = new Map();
  }

  preserve(organismId, connections) {
    this.preserved.set(organismId, {
      connections: connections.map(conn => ({
        peerId: conn.peerId,
        type: conn.type,
        state: conn.state,
        timestamp: Date.now(),
      })),
      timestamp: Date.now(),
    });
  }

  restore(organismId) {
    return this.preserved.get(organismId);
  }

  hasPreserved(organismId) {
    return this.preserved.has(organismId);
  }
}

export class MigrationEngine {
  constructor({ organismId, environment = 'unknown' } = {}) {
    this.organismId = organismId;
    this.environment = environment;
    this.connectionPreserver = new ConnectionPreserver();
    this.activeMigrations = new Map();
    this.history = [];
  }

  // Prepare migration
  prepareMigration(targetEnvironment, state, connections = []) {
    const migrationPackage = new MigrationPackage({
      organismId: this.organismId,
      state,
      connections,
      metadata: {
        sourceEnvironment: this.environment,
        targetEnvironment,
      },
    });

    const handshake = new MigrationHandshake({
      sourceId: this.organismId,
      targetId: `${this.organismId}_migrated`,
    });

    this.activeMigrations.set(migrationPackage.id, {
      package: migrationPackage,
      handshake,
    });

    return { migrationId: migrationPackage.id, package: migrationPackage, handshake };
  }

  // Transfer phase
  transfer(migrationId) {
    const migration = this.activeMigrations.get(migrationId);
    if (!migration) {
      throw new Error('Migration not found');
    }

    migration.handshake.advance('transfer');

    // Preserve connections
    this.connectionPreserver.preserve(
      this.organismId,
      migration.package.connections
    );

    // Simulate transfer with φ-weighted timing
    const transferTime = Math.floor(50 * PHI); // ~81ms

    return {
      migrationId,
      phase: 'transfer',
      transferTime,
      packag eSize: JSON.stringify(migration.package.toJSON()).length,
    };
  }

  // Confirm phase
  confirm(migrationId) {
    const migration = this.activeMigrations.get(migrationId);
    if (!migration) {
      throw new Error('Migration not found');
    }

    migration.handshake.advance('confirm');

    // Verify package integrity
    if (!migration.package.verify()) {
      return this.rollback(migrationId, 'checksum_mismatch');
    }

    // Complete handshake
    const result = migration.handshake.complete();

    // Record history
    this.history.push({
      migrationId,
      from: migration.package.metadata.sourceEnvironment,
      to: migration.package.metadata.targetEnvironment,
      timestamp: Date.now(),
      downtime: result.totalTime,
      success: true,
    });

    this.activeMigrations.delete(migrationId);

    return {
      migrationId,
      success: true,
      downtime: result.totalTime,
      result,
    };
  }

  // Rollback on failure
  rollback(migrationId, reason) {
    const migration = this.activeMigrations.get(migrationId);
    if (!migration) {
      return { success: false, reason: 'not_found' };
    }

    // Restore preserved connections
    const preserved = this.connectionPreserver.restore(this.organismId);

    // Record failure in history
    this.history.push({
      migrationId,
      from: migration.package.metadata.sourceEnvironment,
      to: migration.package.metadata.targetEnvironment,
      timestamp: Date.now(),
      success: false,
      reason,
    });

    this.activeMigrations.delete(migrationId);

    return {
      migrationId,
      rolledBack: true,
      reason,
      connectionsRestored: preserved ? preserved.connections.length : 0,
    };
  }

  // Full migration workflow
  async migrate(targetEnvironment, state, connections = []) {
    const { migrationId, package: pkg } = this.prepareMigration(
      targetEnvironment,
      state,
      connections
    );

    // Transfer
    this.transfer(migrationId);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 50));

    // Confirm
    return this.confirm(migrationId);
  }

  getMigrationHistory() {
    return {
      organismId: this.organismId,
      currentEnvironment: this.environment,
      migrations: this.history.length,
      successRate: this.history.filter(m => m.success).length / this.history.length,
      averageDowntime: this.history.reduce((sum, m) => sum + (m.downtime || 0), 0) / this.history.length,
      history: this.history,
    };
  }

  getStatus() {
    return {
      organismId: this.organismId,
      environment: this.environment,
      activeMigrations: this.activeMigrations.size,
      preservedConnections: this.connectionPreserver.preserved.size,
      totalMigrations: this.history.length,
    };
  }
}

export default { MigrationPackage, MigrationHandshake, ConnectionPreserver, MigrationEngine };
