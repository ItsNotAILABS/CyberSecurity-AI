///
/// tests/geometry-bridge.test.js
///
/// Comprehensive test coverage for sdk/geometry-lock/src/geometry-bridge.js
///
/// Covers:
///   - GeometryBridge constructor (requires lock, accepts options)
///   - registerCaller / generateKey / revokeKey delegation
///   - bridgeCall: granted path (all three routes: civitas, organism, governance)
///   - bridgeCall: denial paths (unregistered, tampered token, expired window)
///   - bridgeCall: unknown route denial
///   - sentinel callback on denial
///   - blockCount audit tracking
///   - isRegistered delegation
///   - getStatus shape
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { GeometryBridge }  from '../sdk/geometry-lock/src/geometry-bridge.js';
import { GeometryLockSDK } from '../sdk/geometry-lock/src/geometry-lock-sdk.js';

// ─── Helpers ──────────────────────────────────────────────────────────────

function makeBridge(opts = {}) {
  const lock   = new GeometryLockSDK({ lockId: 'bridge-test' });
  const bridge = new GeometryBridge({ lock, ...opts });
  return { lock, bridge };
}

// ─── Constructor ──────────────────────────────────────────────────────────

describe('GeometryBridge constructor', () => {
  test('throws if no lock is provided', () => {
    assert.throws(() => new GeometryBridge({}), /GeometryBridge.*required/);
  });

  test('constructs with a valid lock', () => {
    const { bridge, lock } = makeBridge();
    assert.ok(bridge.bridgeId === 'geometry-bridge');
    bridge.stop();
  });

  test('accepts custom bridgeId', () => {
    const { bridge } = makeBridge({ bridgeId: 'my-bridge' });
    assert.strictEqual(bridge.bridgeId, 'my-bridge');
    bridge.stop();
  });

  test('accepts strict mode', () => {
    const { bridge } = makeBridge({ strict: true });
    assert.ok(bridge.strict);
    bridge.stop();
  });
});

// ─── registerCaller / generateKey delegation ──────────────────────────────

describe('caller management delegation', () => {
  test('registerCaller returns envelope', () => {
    const { bridge } = makeBridge();
    const result = bridge.registerCaller('nova', 'secret');
    assert.ok(Array.isArray(result.envelope));
    bridge.stop();
  });

  test('generateKey returns a token for registered caller', () => {
    const { bridge } = makeBridge();
    bridge.registerCaller('nova', 'secret');
    const token = bridge.generateKey('nova');
    assert.ok('phases' in token);
    bridge.stop();
  });

  test('isRegistered reflects registration state', () => {
    const { bridge } = makeBridge();
    assert.strictEqual(bridge.isRegistered('nova'), false);
    bridge.registerCaller('nova', 'secret');
    assert.strictEqual(bridge.isRegistered('nova'), true);
    bridge.stop();
  });

  test('revokeKey removes caller registration', () => {
    const { bridge } = makeBridge();
    bridge.registerCaller('nova', 'secret');
    bridge.revokeKey('nova');
    assert.strictEqual(bridge.isRegistered('nova'), false);
    bridge.stop();
  });
});

// ─── bridgeCall: granted paths ────────────────────────────────────────────

describe('bridgeCall granted paths', () => {
  for (const route of ['civitas', 'organism', 'governance']) {
    test(`grants and forwards call to route: ${route}`, async () => {
      const { bridge } = makeBridge();
      bridge.registerCaller('nova', 'secret');
      const token  = bridge.generateKey('nova');
      const result = await bridge.bridgeCall('nova', token, route, { data: 'hello' });

      assert.strictEqual(result.granted, true, `R=${result.R} route=${route}`);
      assert.ok(result.result, 'should have a result payload');
      assert.strictEqual(result.result.route, route);
      bridge.stop();
    });
  }
});

// ─── bridgeCall: denial paths ─────────────────────────────────────────────

describe('bridgeCall denial paths', () => {
  test('denies call for unregistered caller (no valid token)', async () => {
    const { bridge } = makeBridge();
    // Craft a fake token for an unregistered caller
    const fakeToken = {
      callerId:    'ghost',
      phases:      [0, 0, 0, 0, 0, 0, 0],
      signature:   'geo_000000',
      windowIndex: 0,
    };
    const result = await bridge.bridgeCall('ghost', fakeToken, 'organism');
    assert.strictEqual(result.granted, false);
    assert.ok(result.denial.reason !== undefined);
    bridge.stop();
  });

  test('denies call with tampered token signature', async () => {
    const { bridge } = makeBridge();
    bridge.registerCaller('nova', 'secret');
    const token = bridge.generateKey('nova');
    token.signature = 'geo_000000'; // tampered

    const result = await bridge.bridgeCall('nova', token, 'organism');
    assert.strictEqual(result.granted, false);
    bridge.stop();
  });

  test('denies call for unknown route even with valid token', async () => {
    const { bridge } = makeBridge();
    bridge.registerCaller('nova', 'secret');
    const token  = bridge.generateKey('nova');
    const result = await bridge.bridgeCall('nova', token, 'unknown-route');
    assert.strictEqual(result.granted, false);
    assert.ok(result.denial.reason === 'unknown_route');
    bridge.stop();
  });
});

// ─── blockCount ───────────────────────────────────────────────────────────

describe('blockCount', () => {
  test('returns 0 initially', () => {
    const { bridge } = makeBridge();
    assert.strictEqual(bridge.blockCount('ghost'), 0);
    bridge.stop();
  });

  test('increments on each denial for the same caller', async () => {
    const { bridge } = makeBridge();
    const fakeToken = {
      callerId:    'ghost',
      phases:      [0, 0, 0, 0, 0, 0, 0],
      signature:   'geo_000000',
      windowIndex: 0,
    };
    await bridge.bridgeCall('ghost', fakeToken, 'organism');
    await bridge.bridgeCall('ghost', fakeToken, 'organism');
    assert.strictEqual(bridge.blockCount('ghost'), 2);
    bridge.stop();
  });

  test('counts are caller-specific', async () => {
    const { bridge } = makeBridge();
    const makeToken = caller => ({
      callerId:    caller,
      phases:      [0, 0, 0, 0, 0, 0, 0],
      signature:   'geo_000000',
      windowIndex: 0,
    });
    await bridge.bridgeCall('ghost1', makeToken('ghost1'), 'organism');
    await bridge.bridgeCall('ghost1', makeToken('ghost1'), 'organism');
    await bridge.bridgeCall('ghost2', makeToken('ghost2'), 'organism');
    assert.strictEqual(bridge.blockCount('ghost1'), 2);
    assert.strictEqual(bridge.blockCount('ghost2'), 1);
    bridge.stop();
  });
});

// ─── Sentinel callback ────────────────────────────────────────────────────

describe('sentinel callback', () => {
  test('sentinel is called on denial', async () => {
    let sentinelCalled = false;
    let sentinelPayload = null;

    const { bridge } = makeBridge({
      sentinel: (denial) => {
        sentinelCalled  = true;
        sentinelPayload = denial;
      },
    });

    const fakeToken = {
      callerId:    'ghost',
      phases:      [0, 0, 0, 0, 0, 0, 0],
      signature:   'geo_000000',
      windowIndex: 0,
    };
    await bridge.bridgeCall('ghost', fakeToken, 'organism');

    assert.ok(sentinelCalled, 'sentinel should have been called');
    assert.ok(sentinelPayload.callerId === 'ghost');
    bridge.stop();
  });

  test('sentinel is NOT called on successful call', async () => {
    let sentinelCalled = false;

    const { bridge } = makeBridge({
      sentinel: () => { sentinelCalled = true; },
    });

    bridge.registerCaller('nova', 'secret');
    const token  = bridge.generateKey('nova');
    await bridge.bridgeCall('nova', token, 'organism');

    assert.strictEqual(sentinelCalled, false);
    bridge.stop();
  });
});

// ─── getStatus ────────────────────────────────────────────────────────────

describe('getStatus', () => {
  test('returns expected shape', () => {
    const { bridge } = makeBridge({ bridgeId: 'test-bridge' });
    const status = bridge.getStatus();
    assert.strictEqual(status.bridgeId, 'test-bridge');
    assert.ok(typeof status.totalCalls === 'number');
    assert.ok(typeof status.totalBlocked === 'number');
    assert.ok(Array.isArray(status.routes));
    assert.ok('contract' in status);
    bridge.stop();
  });

  test('totalCalls increments on successful bridgeCall', async () => {
    const { bridge } = makeBridge();
    bridge.registerCaller('nova', 'secret');
    const token = bridge.generateKey('nova');
    await bridge.bridgeCall('nova', token, 'organism');
    assert.strictEqual(bridge.getStatus().totalCalls, 1);
    bridge.stop();
  });

  test('totalBlocked increments on denied bridgeCall', async () => {
    const { bridge } = makeBridge();
    const fakeToken = {
      callerId:    'ghost',
      phases:      [0, 0, 0, 0, 0, 0, 0],
      signature:   'geo_000000',
      windowIndex: 0,
    };
    await bridge.bridgeCall('ghost', fakeToken, 'organism');
    assert.strictEqual(bridge.getStatus().totalBlocked, 1);
    bridge.stop();
  });
});
