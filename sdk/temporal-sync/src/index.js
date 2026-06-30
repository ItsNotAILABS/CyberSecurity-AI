///
/// @medina/temporal-sync — Time-Synchronized Multi-AI Operations
/// Φ-based temporal coordination across organisms
///

import { PHI, HEARTBEAT_MS } from '@medina/medina-heart';

export class TemporalClock {
  constructor({ organismId, offset = 0 } = {}) {
    this.organismId = organismId;
    this.offset = offset; // Offset from universal time
    this.started = Date.now();
    this.ticks = 0;
  }

  now() {
    return Date.now() + this.offset;
  }

  tick() {
    this.ticks++;
    return this.ticks;
  }

  sync(referenceTime) {
    this.offset = referenceTime - Date.now();
    return this.offset;
  }
}

export class SynchronizationPoint {
  constructor({ targetTime, participants = [] } = {}) {
    this.targetTime = targetTime;
    this.participants = new Set(participants);
    this.arrived = new Set();
    this.executed = false;
  }

  arrive(organismId) {
    this.arrived.add(organismId);
    return this.arrived.size === this.participants.size;
  }

  isReady() {
    return this.arrived.size === this.participants.size && Date.now() >= this.targetTime;
  }
}

export class TemporalCoordinator {
  constructor() {
    this.clocks = new Map();
    this.syncPoints = [];
    this.masterTime = Date.now();
  }

  registerClock(organismId) {
    const clock = new TemporalClock({ organismId });
    this.clocks.set(organismId, clock);
    return clock;
  }

  createSyncPoint(delay, participants) {
    const targetTime = Date.now() + delay;
    const syncPoint = new SynchronizationPoint({ targetTime, participants });
    this.syncPoints.push(syncPoint);
    return syncPoint;
  }

  syncAll() {
    const reference = Date.now();
    for (const clock of this.clocks.values()) {
      clock.sync(reference);
    }
    this.masterTime = reference;
    return { synced: this.clocks.size, time: reference };
  }

  getPhiInterval() {
    return HEARTBEAT_MS; // 873ms φ-derived
  }

  schedulePhiEvent(callback, multiplier = 1) {
    const interval = this.getPhiInterval() * multiplier;
    return setInterval(callback, interval);
  }
}

export default { TemporalClock, SynchronizationPoint, TemporalCoordinator };
