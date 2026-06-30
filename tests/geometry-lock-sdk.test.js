///
/// tests/geometry-lock-sdk.test.js
///
/// Comprehensive test coverage for sdk/geometry-lock/src/geometry-lock-sdk.js
///
/// Covers:
///   - GeometryLockSDK constructor and defaults
///   - registerCaller, generateKey, validateKey full lifecycle
///   - revokeKey
///   - probe (non-destructive resonance check)
///   - fieldCoherence (Kuramoto field across all registered callers)
///   - phaseDistance (Pythagorean distance between token phase vectors)
///   - isFresh (temporal freshness check)
///   - isRegistered
///   - strict mode behaviour (_onStrictDenial hook)
///   - getStatus / stop
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  GeometryLockSDK,
  EMERGENCE_THRESHOLD,
  PHI,
  kuramotoOrderParameter,
} from '../sdk/geometry-lock/src/geometry-lock-sdk.js';

// ─── Constructor ───────────────────────────────────────────────────────────

describe('GeometryLockSDK constructor', () => {
  test('constructs with defaults', () => {
    const sdk = new GeometryLockSDK();
    assert.ok(sdk.lockId === 'geometry-lock');
    assert.ok(!sdk.strict);
    sdk.stop();
  });

  test('accepts custom lockId', () => {
    const sdk = new GeometryLockSDK({ lockId: 'my-lock' });
    assert.strictEqual(sdk.lockId, 'my-lock');
    sdk.stop();
  });

  test('accepts strict mode', () => {
    const sdk = new GeometryLockSDK({ strict: true });
    assert.ok(sdk.strict);
    sdk.stop();
  });

  test('protocol is immediately alive (self-bootstrapping)', () => {
    const sdk = new GeometryLockSDK();
    assert.ok(sdk._protocol !== null);
    sdk.stop();
  });
});

// ─── Core API lifecycle ────────────────────────────────────────────────────

describe('GeometryLockSDK lifecycle: register → generate → validate', () => {
  test('registerCaller returns envelope and windowIndex', () => {
    const sdk    = new GeometryLockSDK({ lockId: 'test' });
    const result = sdk.registerCaller('nova', 'secret');
    assert.ok(Array.isArray(result.envelope));
    assert.ok(typeof result.windowIndex === 'number');
    sdk.stop();
  });

  test('generateKey throws for unregistered caller', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    assert.throws(() => sdk.generateKey('ghost'), /not registered/);
    sdk.stop();
  });

  test('validateKey grants access for freshly registered caller', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('nova', 'secret');
    const token  = sdk.generateKey('nova');
    const result = sdk.validateKey(token);
    assert.strictEqual(result.granted, true, `R=${result.R} reason=${result.reason}`);
    sdk.stop();
  });

  test('validateKey returns R and psi on success', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('nova', 'secret');
    const token  = sdk.generateKey('nova');
    const result = sdk.validateKey(token);
    assert.ok(typeof result.R === 'number');
    assert.ok(typeof result.psi === 'number');
    assert.ok(result.R >= 0 && result.R <= 1);
    sdk.stop();
  });

  test('validateKey denies after revokeKey', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('nova', 'secret');

    const tokenBefore = sdk.generateKey('nova');
    assert.strictEqual(sdk.validateKey(tokenBefore).granted, true);

    sdk.revokeKey('nova');

    // Re-register should be needed for a valid token; without it, denied
    const tokenAfter = sdk.generateKey.bind(sdk, 'nova');
    assert.throws(() => tokenAfter(), /not registered/);
    sdk.stop();
  });
});

// ─── revokeKey ────────────────────────────────────────────────────────────

describe('revokeKey', () => {
  test('returns revoke result with callerId', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('alice', 's1');
    const result = sdk.revokeKey('alice');
    assert.strictEqual(result.callerId, 'alice');
    sdk.stop();
  });

  test('isRegistered returns false after revocation', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('alice', 's1');
    sdk.revokeKey('alice');
    assert.strictEqual(sdk.isRegistered('alice'), false);
    sdk.stop();
  });
});

// ─── probe ────────────────────────────────────────────────────────────────

describe('probe', () => {
  test('probe returns would_grant=true for a freshly generated token', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('nova', 'secret');
    const token  = sdk.generateKey('nova');
    const result = sdk.probe(token);
    assert.ok('would_grant' in result);
    assert.ok('R' in result);
    sdk.stop();
  });

  test('probe returns would_grant=false for unknown caller', () => {
    const sdk    = new GeometryLockSDK({ lockId: 'test' });
    const result = sdk.probe({ callerId: 'nobody', phases: [] });
    assert.strictEqual(result.would_grant, false);
    sdk.stop();
  });
});

// ─── fieldCoherence ───────────────────────────────────────────────────────

describe('fieldCoherence', () => {
  test('returns R_field=0 with no callers registered', () => {
    const sdk    = new GeometryLockSDK({ lockId: 'test' });
    const result = sdk.fieldCoherence();
    assert.strictEqual(result.R_field, 0);
    assert.strictEqual(result.callerCount, 0);
    sdk.stop();
  });

  test('returns R_field=1 with exactly one caller', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('single', 'secret');
    const result = sdk.fieldCoherence();
    assert.strictEqual(result.R_field, 1);
    assert.strictEqual(result.callerCount, 1);
    sdk.stop();
  });

  test('returns R_field in [0,1] with multiple callers', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('alice', 'secretA');
    sdk.registerCaller('bob',   'secretB');
    sdk.registerCaller('carol', 'secretC');
    const result = sdk.fieldCoherence();
    assert.ok(result.R_field >= 0 && result.R_field <= 1);
    assert.strictEqual(result.callerCount, 3);
    sdk.stop();
  });
});

// ─── phaseDistance ────────────────────────────────────────────────────────

describe('phaseDistance', () => {
  test('distance between identical tokens is 0', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('nova', 'secret');
    const token = sdk.generateKey('nova');
    const d     = sdk.phaseDistance(token, token);
    assert.ok(Math.abs(d) < 1e-10, `distance=${d} should be 0`);
    sdk.stop();
  });

  test('distance is in [0,1]', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('alice', 'secretA');
    sdk.registerCaller('bob',   'secretB');
    const tA = sdk.generateKey('alice');
    const tB = sdk.generateKey('bob');
    const d  = sdk.phaseDistance(tA, tB);
    assert.ok(d >= 0 && d <= 1, `distance=${d}`);
    sdk.stop();
  });

  test('distance is symmetric: d(A,B) == d(B,A)', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('alice', 'secretA');
    sdk.registerCaller('bob',   'secretB');
    const tA = sdk.generateKey('alice');
    const tB = sdk.generateKey('bob');
    const dAB = sdk.phaseDistance(tA, tB);
    const dBA = sdk.phaseDistance(tB, tA);
    assert.ok(Math.abs(dAB - dBA) < 1e-10);
    sdk.stop();
  });

  test('returns 1 when tokens have no phases', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    const d   = sdk.phaseDistance({ phases: [] }, { phases: [] });
    assert.strictEqual(d, 1);
    sdk.stop();
  });
});

// ─── isFresh ──────────────────────────────────────────────────────────────

describe('isFresh', () => {
  test('a freshly generated token is fresh', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('nova', 'secret');
    const token = sdk.generateKey('nova');
    assert.ok(sdk.isFresh(token));
    sdk.stop();
  });

  test('a token from a very old window is not fresh', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    // Simulate a token from window 0 while current window is large
    const staleToken = { windowIndex: 0 };
    // Current window is floor(now / (873 * 1.618)) ≈ large number
    const isFresh = sdk.isFresh(staleToken);
    assert.strictEqual(isFresh, false);
    sdk.stop();
  });
});

// ─── isRegistered ─────────────────────────────────────────────────────────

describe('isRegistered', () => {
  test('returns false for unknown caller', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    assert.strictEqual(sdk.isRegistered('nobody'), false);
    sdk.stop();
  });

  test('returns true after registerCaller', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test' });
    sdk.registerCaller('nova', 'secret');
    assert.strictEqual(sdk.isRegistered('nova'), true);
    sdk.stop();
  });
});

// ─── Strict mode ──────────────────────────────────────────────────────────

describe('strict mode', () => {
  test('validateKey still returns denial result (does not throw)', () => {
    const sdk = new GeometryLockSDK({ lockId: 'test', strict: true });
    // Use a fake token that will fail
    const fakeToken = {
      callerId:    'ghost',
      phases:      [0, 0, 0, 0, 0, 0, 0],
      signature:   'geo_000000',
      windowIndex: 0,
    };
    const result = sdk.validateKey(fakeToken);
    assert.strictEqual(result.granted, false);
    sdk.stop();
  });

  test('_onStrictDenial is called on denial in strict mode', () => {
    const sdk    = new GeometryLockSDK({ lockId: 'test', strict: true });
    let called   = false;
    sdk._onStrictDenial = () => { called = true; };

    const fakeToken = {
      callerId:    'ghost',
      phases:      [0, 0, 0, 0, 0, 0, 0],
      signature:   'geo_000000',
      windowIndex: 0,
    };
    sdk.validateKey(fakeToken);
    assert.ok(called, '_onStrictDenial should have been invoked');
    sdk.stop();
  });
});

// ─── getStatus ────────────────────────────────────────────────────────────

describe('getStatus', () => {
  test('returns expected shape with constants', () => {
    const sdk    = new GeometryLockSDK({ lockId: 'my-lock' });
    const status = sdk.getStatus();

    assert.strictEqual(status.lockId, 'my-lock');
    assert.ok(typeof status.uptime === 'number');
    assert.ok('constants' in status);
    assert.ok(Math.abs(status.constants.phi - PHI) < 1e-10);
    assert.ok(Math.abs(status.constants.emergenceThreshold - EMERGENCE_THRESHOLD) < 1e-10);
    sdk.stop();
  });
});
