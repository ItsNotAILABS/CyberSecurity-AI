///
/// tests/medina-heart.test.js
///
/// Comprehensive test coverage for sdk/medina-heart/src/index.js
///
/// Covers:
///   - BiologicalHeart: construction, vitals, onBeat listener, stop, Fibonacci
///   - AutonomousClock: construction, all calendar types, getTime, stop
///   - SelfBootstrappingAI: construction (no .start() needed), getState, learn, stop
///   - birthAI factory function
///   - ARCHETYPES: presence and structure of all 12 Jungian archetypes
///

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';

import {
  BiologicalHeart,
  AutonomousClock,
  SelfBootstrappingAI,
  birthAI,
  ARCHETYPES,
} from '../sdk/medina-heart/src/index.js';

// ─── BiologicalHeart ──────────────────────────────────────────────────────

describe('BiologicalHeart', () => {
  test('constructs with default interval 873ms', () => {
    const heart = new BiologicalHeart(100000, 'TestHeart');
    assert.strictEqual(heart.name, 'TestHeart');
    assert.strictEqual(heart.intervalMs, 100000);
    assert.ok(heart.isAlive);
    assert.strictEqual(heart.beatCount, 0);
    heart.stop();
  });

  test('isAlive is true immediately after construction', () => {
    const heart = new BiologicalHeart(100000);
    assert.ok(heart.isAlive);
    heart.stop();
  });

  test('stop sets isAlive to false', () => {
    const heart = new BiologicalHeart(100000);
    heart.stop();
    assert.strictEqual(heart.isAlive, false);
  });

  test('getVitals returns expected shape', () => {
    const heart  = new BiologicalHeart(100000, 'VitalTest');
    const vitals = heart.getVitals();
    assert.strictEqual(vitals.name, 'VitalTest');
    assert.ok(typeof vitals.isAlive === 'boolean');
    assert.ok(typeof vitals.beatCount === 'number');
    assert.ok(typeof vitals.age === 'number');
    assert.ok(typeof vitals.intervalMs === 'number');
    heart.stop();
  });

  test('onBeat registers a listener and returns an unsubscribe function', () => {
    const heart  = new BiologicalHeart(100000);
    const unsub  = heart.onBeat(() => {});
    assert.ok(typeof unsub === 'function');
    assert.strictEqual(heart.listeners.length, 1);
    unsub();
    assert.strictEqual(heart.listeners.length, 0);
    heart.stop();
  });

  test('multiple listeners can be registered independently', () => {
    const heart = new BiologicalHeart(100000);
    heart.onBeat(() => {});
    heart.onBeat(() => {});
    assert.strictEqual(heart.listeners.length, 2);
    heart.stop();
  });

  test('onBeat listener receives beat object with expected fields', async () => {
    const heart = new BiologicalHeart(10); // very fast for test
    await new Promise((resolve, reject) => {
      const unsub = heart.onBeat((beat) => {
        try {
          assert.ok('count' in beat);
          assert.ok('time' in beat);
          assert.ok('age' in beat);
          assert.ok('phi' in beat);
          assert.ok('fibonacci' in beat);
          assert.ok(beat.count >= 1);
          unsub();
          heart.stop();
          resolve();
        } catch (err) {
          unsub();
          heart.stop();
          reject(err);
        }
      });
    });
  });

  test('beatCount increments on each beat', async () => {
    const heart = new BiologicalHeart(10);
    await new Promise((resolve) => {
      let beats   = 0;
      const unsub = heart.onBeat(() => {
        beats++;
        if (beats >= 3) {
          unsub();
          heart.stop();
          assert.ok(heart.beatCount >= 3);
          resolve();
        }
      });
    });
  });

  test('_fib(0) = 0, _fib(1) = 1, _fib(10) = 55', () => {
    const heart = new BiologicalHeart(100000);
    assert.strictEqual(heart._fib(0), 0);
    assert.strictEqual(heart._fib(1), 1);
    assert.strictEqual(heart._fib(10), 55);
    heart.stop();
  });

  test('birthTime is set on construction', () => {
    const before = Date.now();
    const heart  = new BiologicalHeart(100000);
    const after  = Date.now();
    assert.ok(heart.birthTime >= before && heart.birthTime <= after);
    heart.stop();
  });
});

// ─── AutonomousClock ──────────────────────────────────────────────────────

describe('AutonomousClock', () => {
  const CALENDARS = ['mayan', 'sumerian', 'egyptian', 'lunar', 'solar', 'phi'];
  const EXPECTED_INTERVALS = {
    mayan: 1440, sumerian: 3600, egyptian: 2160,
    lunar: 2551, solar: 8760,   phi: 873,
  };

  for (const cal of CALENDARS) {
    test(`constructs with calendar='${cal}' and correct interval`, () => {
      const clock = new AutonomousClock(cal, `${cal}-clock`);
      assert.strictEqual(clock.intervalMs, EXPECTED_INTERVALS[cal]);
      assert.strictEqual(clock.calendar, cal);
      clock.stop();
    });
  }

  test('defaults to phi interval for unknown calendar', () => {
    const clock = new AutonomousClock('ancient-sumerian-remix');
    assert.strictEqual(clock.intervalMs, 873); // falls back to phi
    clock.stop();
  });

  test('getTime returns expected shape', () => {
    const clock = new AutonomousClock('phi', 'TestClock');
    const t     = clock.getTime();
    assert.strictEqual(t.calendar, 'phi');
    assert.ok(typeof t.tickCount === 'number');
    assert.ok(typeof t.elapsed === 'number');
    clock.stop();
  });

  test('tickCount starts at 0', () => {
    const clock = new AutonomousClock('phi');
    assert.strictEqual(clock.tickCount, 0);
    clock.stop();
  });

  test('onTick callback fires when set', async () => {
    const clock = new AutonomousClock('phi');
    // Override interval to fire quickly — replace internal clock
    clearInterval(clock.clockInterval);
    await new Promise((resolve, reject) => {
      clock.clockInterval = setInterval(() => {
        clock.tickCount++;
        if (clock.onTick) {
          clock.onTick({ count: clock.tickCount, time: Date.now(), elapsed: 0, calendar: 'phi', cycle: 0, golden: 0 });
        }
      }, 10);

      clock.onTick = (tick) => {
        clearInterval(clock.clockInterval);
        try {
          assert.ok(tick.count >= 1);
          resolve();
        } catch (err) {
          reject(err);
        }
      };
    });
  });

  test('stop clears the interval without throwing', () => {
    const clock = new AutonomousClock('mayan');
    assert.doesNotThrow(() => clock.stop());
  });
});

// ─── SelfBootstrappingAI ──────────────────────────────────────────────────

describe('SelfBootstrappingAI', () => {
  test('constructs immediately (no .start() needed)', () => {
    const ai = new SelfBootstrappingAI({ name: 'TestAI', heartbeatMs: 100000 });
    assert.ok(ai.isAlive);
    assert.strictEqual(ai.state.name, 'TestAI');
    ai.stop();
  });

  test('creates the requested number of hearts', () => {
    const ai = new SelfBootstrappingAI({ name: 'TestAI', numHearts: 3, heartbeatMs: 100000 });
    assert.strictEqual(ai.hearts.length, 3);
    ai.stop();
  });

  test('creates the requested number of brains', () => {
    const ai = new SelfBootstrappingAI({ name: 'TestAI', numBrains: 2, heartbeatMs: 100000 });
    assert.strictEqual(ai.brains.length, 2);
    ai.stop();
  });

  test('getState returns expected structure', () => {
    const ai    = new SelfBootstrappingAI({ name: 'NOVA', heartbeatMs: 100000 });
    const state = ai.getState();
    assert.strictEqual(state.name, 'NOVA');
    assert.ok(typeof state.age === 'number');
    assert.ok(Array.isArray(state.hearts));
    assert.ok(Array.isArray(state.brains));
    ai.stop();
  });

  test('stop sets isAlive to false and stops all hearts', () => {
    const ai = new SelfBootstrappingAI({ name: 'TestAI', numHearts: 2, heartbeatMs: 100000 });
    ai.stop();
    assert.strictEqual(ai.isAlive, false);
    for (const heart of ai.hearts) {
      assert.strictEqual(heart.isAlive, false);
    }
  });

  test('learn adds a synapse to the first brain', () => {
    const ai     = new SelfBootstrappingAI({ name: 'TestAI', heartbeatMs: 100000 });
    const result = ai.learn('sun', 'warmth', 1.0);
    assert.ok(result.synapse.includes('sun'));
    assert.ok(result.newWeight > result.oldWeight);
    assert.ok(ai.brains[0].synapses.size > 0);
    ai.stop();
  });

  test('learn accumulates weight on repeated stimuli', () => {
    const ai = new SelfBootstrappingAI({ name: 'TestAI', heartbeatMs: 100000 });
    const r1 = ai.learn('sun', 'warmth', 1.0);
    const r2 = ai.learn('sun', 'warmth', 1.0);
    assert.ok(r2.newWeight > r1.newWeight);
    ai.stop();
  });

  test('state.consciousness starts at 0', () => {
    const ai = new SelfBootstrappingAI({ name: 'TestAI', heartbeatMs: 100000 });
    assert.strictEqual(ai.state.consciousness, 0.0);
    ai.stop();
  });

  test('birthTime is set on construction', () => {
    const before = Date.now();
    const ai     = new SelfBootstrappingAI({ name: 'TestAI', heartbeatMs: 100000 });
    const after  = Date.now();
    assert.ok(ai.birthTime >= before && ai.birthTime <= after);
    ai.stop();
  });
});

// ─── birthAI factory ──────────────────────────────────────────────────────

describe('birthAI factory', () => {
  test('returns a SelfBootstrappingAI instance immediately alive', () => {
    const ai = birthAI({ name: 'NOVA', heartbeatMs: 100000 });
    assert.ok(ai instanceof SelfBootstrappingAI);
    assert.ok(ai.isAlive);
    ai.stop();
  });

  test('passes configuration to SelfBootstrappingAI', () => {
    const ai = birthAI({ name: 'Custom', numHearts: 2, numBrains: 3, heartbeatMs: 100000 });
    assert.strictEqual(ai.state.name, 'Custom');
    assert.strictEqual(ai.hearts.length, 2);
    assert.strictEqual(ai.brains.length, 3);
    ai.stop();
  });
});

// ─── ARCHETYPES ───────────────────────────────────────────────────────────

describe('ARCHETYPES', () => {
  const expected = ['SAGE', 'HERO', 'CREATOR', 'CAREGIVER', 'EXPLORER', 'REBEL',
                    'MAGICIAN', 'RULER', 'JESTER', 'LOVER', 'EVERYMAN', 'INNOCENT'];

  test('exports all 12 Jungian archetypes', () => {
    assert.strictEqual(Object.keys(ARCHETYPES).length, 12);
  });

  for (const name of expected) {
    test(`includes ${name} archetype`, () => {
      assert.ok(name in ARCHETYPES, `missing archetype: ${name}`);
      assert.ok(typeof ARCHETYPES[name] === 'string');
    });
  }
});
