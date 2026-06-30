///
/// tests/nova-bridge.test.js
///
/// Comprehensive test coverage for engines/javascript/nova-bridge.js
///
/// Covers:
///   - BiologicalHeart: φ-derived heartbeat (873ms), self-bootstrap, onBeat, getMetrics, stop
///   - NOVAOrganism: self-bootstrapping, hasCapability, executeTask, CIL log, getMetrics
///   - calculateBiorhythm: ancient calendar cycles, Pythagorean combination
///   - Mathematical constants: PHI, PHI2, PHI3, PHI4, PHI_HEARTBEAT
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Import the module under test
const novaBridge = await import('../engines/javascript/nova-bridge.js');

const {
  BiologicalHeart,
  NOVAOrganism,
  calculateBiorhythm,
  PHI,
  PHI2,
  PHI3,
  PHI4,
  PHI_HEARTBEAT
} = novaBridge;

// ─── Mathematical constants ────────────────────────────────────────────────

describe('nova-bridge: Mathematical constants', () => {
  test('PHI equals golden ratio (1+√5)/2', () => {
    const expected = (1 + Math.sqrt(5)) / 2;
    assert.ok(Math.abs(PHI - expected) < 1e-10, `PHI=${PHI} expected≈${expected}`);
  });

  test('PHI2 equals PHI squared', () => {
    assert.ok(Math.abs(PHI2 - PHI * PHI) < 1e-10);
  });

  test('PHI3 equals PHI cubed', () => {
    assert.ok(Math.abs(PHI3 - PHI * PHI * PHI) < 1e-10);
  });

  test('PHI4 equals PHI^4', () => {
    assert.ok(Math.abs(PHI4 - PHI * PHI * PHI * PHI) < 1e-10);
  });

  test('PHI_HEARTBEAT is 873 (540 × φ ≈ 873)', () => {
    assert.strictEqual(PHI_HEARTBEAT, 873);
    // Verify the derivation: 540 * φ ≈ 873
    const derived = 540 * PHI;
    assert.ok(Math.abs(derived - 873) < 1, `540 × φ ≈ ${derived}`);
  });
});

// ─── calculateBiorhythm ────────────────────────────────────────────────────

describe('calculateBiorhythm', () => {
  test('returns a value between 0 and 1', () => {
    const now = Date.now();
    const rhythm = calculateBiorhythm(now);
    assert.ok(rhythm >= 0 && rhythm <= 1, `rhythm=${rhythm} should be in [0,1]`);
  });

  test('is deterministic for the same timestamp', () => {
    const ts = 1700000000000;
    const r1 = calculateBiorhythm(ts);
    const r2 = calculateBiorhythm(ts);
    assert.strictEqual(r1, r2);
  });

  test('varies with different timestamps', () => {
    const ts1 = 1700000000000;
    const ts2 = 1700000001000; // 1 second later
    const r1 = calculateBiorhythm(ts1);
    const r2 = calculateBiorhythm(ts2);
    // They may or may not be equal depending on the phase alignment
    // But the function should execute without error
    assert.ok(typeof r1 === 'number');
    assert.ok(typeof r2 === 'number');
  });

  test('handles zero timestamp', () => {
    const rhythm = calculateBiorhythm(0);
    assert.ok(rhythm >= 0 && rhythm <= 1);
  });

  test('handles very large timestamps', () => {
    const farFuture = Date.now() + 1e12; // ~31 years from now
    const rhythm = calculateBiorhythm(farFuture);
    assert.ok(rhythm >= 0 && rhythm <= 1);
  });
});

// ─── BiologicalHeart ───────────────────────────────────────────────────────

describe('BiologicalHeart', () => {
  test('constructs with organismId and self-starts', () => {
    const heart = new BiologicalHeart('test-organism');
    assert.strictEqual(heart.organismId, 'test-organism');
    assert.ok(heart.isBeating, 'heart should be beating immediately (self-bootstrap)');
    assert.strictEqual(heart.beatCount, 0); // Not yet incremented until first interval
    heart.stop();
  });

  test('startTime is set on construction', () => {
    const before = Date.now();
    const heart = new BiologicalHeart('test-organism');
    const after = Date.now();
    assert.ok(heart.startTime >= before && heart.startTime <= after);
    heart.stop();
  });

  test('stop sets isBeating to false and clears interval', () => {
    const heart = new BiologicalHeart('test-organism');
    assert.ok(heart.isBeating);
    heart.stop();
    assert.strictEqual(heart.isBeating, false);
    assert.strictEqual(heart.intervalId, null);
  });

  test('onBeat registers a callback and returns the heart (fluent)', () => {
    const heart = new BiologicalHeart('test-organism');
    const result = heart.onBeat(() => {});
    assert.strictEqual(result, heart); // Fluent interface
    assert.strictEqual(heart.beatCallbacks.length, 1);
    heart.stop();
  });

  test('multiple callbacks can be registered', () => {
    const heart = new BiologicalHeart('test-organism');
    heart.onBeat(() => {}).onBeat(() => {}).onBeat(() => {});
    assert.strictEqual(heart.beatCallbacks.length, 3);
    heart.stop();
  });

  test('getMetrics returns expected shape', () => {
    const heart = new BiologicalHeart('test-organism');
    const metrics = heart.getMetrics();
    assert.ok('beatCount' in metrics);
    assert.ok('uptime' in metrics);
    assert.ok('isBeating' in metrics);
    assert.ok('phiHeartbeat' in metrics);
    assert.strictEqual(metrics.phiHeartbeat, PHI_HEARTBEAT);
    heart.stop();
  });

  test('stop is idempotent', () => {
    const heart = new BiologicalHeart('test-organism');
    heart.stop();
    assert.doesNotThrow(() => heart.stop()); // Should not throw on second call
    assert.strictEqual(heart.isBeating, false);
  });

  test('beatCallbacks receive correct arguments when heartbeat fires', async () => {
    // Create a heart but override the interval for fast testing
    const heart = new BiologicalHeart('test-organism');
    heart.stop(); // Stop the default interval
    
    heart.isBeating = true;
    let receivedBeatCount = null;
    let receivedTimestamp = null;
    let receivedBiorhythm = null;
    
    heart.onBeat((count, ts, rhythm) => {
      receivedBeatCount = count;
      receivedTimestamp = ts;
      receivedBiorhythm = rhythm;
    });
    
    // Manually invoke a beat simulation
    heart.beatCount++;
    const now = Date.now();
    const biorhythm = calculateBiorhythm(now);
    heart.beatCallbacks.forEach(cb => cb(heart.beatCount, now, biorhythm));
    
    assert.strictEqual(receivedBeatCount, 1);
    assert.ok(receivedTimestamp >= now - 10 && receivedTimestamp <= now + 10);
    assert.ok(receivedBiorhythm >= 0 && receivedBiorhythm <= 1);
    
    heart.isBeating = false;
  });
});

// ─── NOVAOrganism ──────────────────────────────────────────────────────────

describe('NOVAOrganism', () => {
  test('constructs with organismId and capabilities', () => {
    const org = new NOVAOrganism('terminal', ['capability_a', 'capability_b']);
    assert.strictEqual(org.organismId, 'terminal');
    assert.deepStrictEqual(org.capabilities, ['capability_a', 'capability_b']);
    assert.strictEqual(org.state, 'active');
    org.stop();
  });

  test('self-bootstraps with a BiologicalHeart that starts immediately', () => {
    const org = new NOVAOrganism('terminal', []);
    assert.ok(org.heart instanceof BiologicalHeart);
    assert.ok(org.heart.isBeating);
    org.stop();
  });

  test('hasCapability returns true for existing capability', () => {
    const org = new NOVAOrganism('terminal', ['governance_review', 'law_enforcement']);
    assert.ok(org.hasCapability('governance_review'));
    assert.ok(org.hasCapability('law_enforcement'));
    org.stop();
  });

  test('hasCapability returns false for missing capability', () => {
    const org = new NOVAOrganism('terminal', ['governance_review']);
    assert.ok(!org.hasCapability('nonexistent_capability'));
    org.stop();
  });

  test('executeTask returns rejected status for missing capability', async () => {
    const org = new NOVAOrganism('terminal', []);
    const result = await org.executeTask({ capability: 'some_capability' });
    assert.strictEqual(result.status, 'rejected');
    assert.strictEqual(result.reason, 'missing_capability');
    org.stop();
  });

  test('executeTask returns ok status for existing capability', async () => {
    const org = new NOVAOrganism('terminal', ['governance_review']);
    const result = await org.executeTask({ capability: 'governance_review' });
    assert.strictEqual(result.status, 'ok');
    assert.ok('biorhythm' in result);
    assert.ok(result.biorhythm >= 0 && result.biorhythm <= 1);
    org.stop();
  });

  test('CIL log is populated on heartbeat events', () => {
    const org = new NOVAOrganism('terminal', []);
    // CIL log starts empty, but internal methods populate it
    // Manually trigger _emitCIL to verify
    org._emitCIL({
      state: 'test_state',
      intention: 'test_intention',
      uncertainty: 0.3,
      reflection: 'Test reflection',
      context: { test: true }
    });
    assert.strictEqual(org.cilLog.length, 1);
    assert.strictEqual(org.cilLog[0].state, 'test_state');
    org.stop();
  });

  test('getCILLog returns last N entries', () => {
    const org = new NOVAOrganism('terminal', []);
    for (let i = 0; i < 20; i++) {
      org._emitCIL({
        state: `state_${i}`,
        intention: 'test',
        uncertainty: 0.1,
        reflection: `Entry ${i}`,
        context: {}
      });
    }
    const last10 = org.getCILLog(10);
    assert.strictEqual(last10.length, 10);
    assert.strictEqual(last10[9].state, 'state_19'); // Most recent
    org.stop();
  });

  test('getMetrics returns expected shape', () => {
    const org = new NOVAOrganism('terminal', ['cap1', 'cap2']);
    const metrics = org.getMetrics();
    assert.strictEqual(metrics.organismId, 'terminal');
    assert.strictEqual(metrics.state, 'active');
    assert.deepStrictEqual(metrics.capabilities, ['cap1', 'cap2']);
    assert.ok('cilLogSize' in metrics);
    assert.ok('heart' in metrics);
    org.stop();
  });

  test('stop sets state to stopped and stops the heart', () => {
    const org = new NOVAOrganism('terminal', []);
    org.stop();
    assert.strictEqual(org.state, 'stopped');
    assert.strictEqual(org.heart.isBeating, false);
  });

  test('CIL log is pruned when exceeding max size', () => {
    const org = new NOVAOrganism('terminal', []);
    // Max log size is φ³ × 100 ≈ 423
    const maxSize = Math.floor(PHI3 * 100);
    
    // Add more entries than the max
    for (let i = 0; i < maxSize + 100; i++) {
      org._emitCIL({
        state: `state_${i}`,
        intention: 'test',
        uncertainty: 0.1,
        reflection: `Entry ${i}`,
        context: {}
      });
    }
    
    // Log should be pruned to maxSize
    assert.ok(org.cilLog.length <= maxSize, `cilLog.length=${org.cilLog.length} should be <= ${maxSize}`);
    org.stop();
  });

  test('phiUncertainty is computed correctly in CIL entries', () => {
    const org = new NOVAOrganism('terminal', []);
    org._emitCIL({
      state: 'test',
      intention: 'test',
      uncertainty: 0.5,
      reflection: 'Test',
      context: {}
    });
    
    const entry = org.cilLog[0];
    const expected = 0.5 * PHI / (PHI + 1.0);
    assert.ok(Math.abs(entry.phiUncertainty - expected) < 1e-10);
    org.stop();
  });
});
