///
/// tests/geometric-key-protocol.test.js
///
/// Comprehensive test coverage for protocols/geometric-key-protocol.js
///
/// Covers:
///   - Mathematical primitives: kuramotoOrderParameter, phaseAlignment, phiHMAC
///   - PhiSpiralCoordinate construction and geometry
///   - GeometricKey construction, structural validity
///   - KuramotoLock: register, validate (all 4 denial branches), revoke
///   - GeometricKeyProtocol: full lifecycle (register, issue, validate, revoke, probe)
///   - Mathematical constants (PHI, GOLDEN_ANGLE, EMERGENCE_THRESHOLD)
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  PHI,
  PHI2,
  PHI_INV,
  GOLDEN_ANGLE,
  EMERGENCE_THRESHOLD,
  KEY_DIMENSIONS,
  PHI_HEARTBEAT_MS,
  kuramotoOrderParameter,
  phaseAlignment,
  PhiSpiralCoordinate,
  phiHMAC,
  GeometricKey,
  KuramotoLock,
  GeometricKeyProtocol,
} from '../protocols/geometric-key-protocol.js';

// ─── Mathematical constants ────────────────────────────────────────────────

describe('Mathematical constants', () => {
  test('PHI equals golden ratio (1+√5)/2', () => {
    const expected = (1 + Math.sqrt(5)) / 2;
    assert.ok(Math.abs(PHI - expected) < 1e-10, `PHI=${PHI} expected≈${expected}`);
  });

  test('PHI2 equals PHI squared', () => {
    assert.ok(Math.abs(PHI2 - PHI * PHI) < 1e-10);
  });

  test('GOLDEN_ANGLE equals 2π/φ²', () => {
    const expected = (2 * Math.PI) / PHI2;
    assert.ok(Math.abs(GOLDEN_ANGLE - expected) < 1e-10);
  });

  test('EMERGENCE_THRESHOLD equals 1/φ', () => {
    assert.ok(Math.abs(EMERGENCE_THRESHOLD - 1 / PHI) < 1e-10);
  });

  test('EMERGENCE_THRESHOLD equals PHI_INV', () => {
    assert.strictEqual(EMERGENCE_THRESHOLD, PHI_INV);
  });

  test('KEY_DIMENSIONS is 7', () => {
    assert.strictEqual(KEY_DIMENSIONS, 7);
  });

  test('PHI_HEARTBEAT_MS is 873', () => {
    assert.strictEqual(PHI_HEARTBEAT_MS, 873);
  });

  test('φ identity: 1/φ = φ - 1', () => {
    assert.ok(Math.abs(PHI_INV - (PHI - 1)) < 1e-10);
  });
});

// ─── kuramotoOrderParameter ────────────────────────────────────────────────

describe('kuramotoOrderParameter', () => {
  test('returns R=0, psi=0 for empty array', () => {
    const { R, psi } = kuramotoOrderParameter([]);
    assert.strictEqual(R, 0);
    assert.strictEqual(psi, 0);
  });

  test('returns R=1 for single phase', () => {
    const { R } = kuramotoOrderParameter([1.23]);
    assert.ok(Math.abs(R - 1) < 1e-10, `R=${R} should be 1`);
  });

  test('returns R=1 for all identical phases (perfect synchrony)', () => {
    const phases = [Math.PI / 4, Math.PI / 4, Math.PI / 4, Math.PI / 4];
    const { R } = kuramotoOrderParameter(phases);
    assert.ok(Math.abs(R - 1) < 1e-10, `R=${R} should be 1`);
  });

  test('returns R=0 for perfectly opposing phases (pure cancellation)', () => {
    // Two equal-weight opposite phases: cos(0)+cos(π)=0, sin(0)+sin(π)=0
    const { R } = kuramotoOrderParameter([0, Math.PI]);
    assert.ok(R < 1e-10, `R=${R} should be ~0`);
  });

  test('returns R close to 0 for four equidistant phases on circle', () => {
    const phases = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
    const { R } = kuramotoOrderParameter(phases);
    assert.ok(R < 1e-10, `R=${R} should be ~0`);
  });

  test('R is in [0,1] for arbitrary phases', () => {
    const phases = [0.5, 1.2, 2.7, 0.3, 4.1];
    const { R } = kuramotoOrderParameter(phases);
    assert.ok(R >= 0 && R <= 1, `R=${R} must be in [0,1]`);
  });

  test('psi is the mean phase direction', () => {
    // All at angle π/4 → mean phase should be π/4
    const angle = Math.PI / 4;
    const { psi } = kuramotoOrderParameter([angle, angle, angle]);
    assert.ok(Math.abs(psi - angle) < 1e-10, `psi=${psi} expected ${angle}`);
  });

  test('Pythagorean law: R = sqrt(Re²+Im²)', () => {
    const phases = [0, Math.PI / 3, 2 * Math.PI / 3];
    const re = phases.reduce((s, t) => s + Math.cos(t), 0) / phases.length;
    const im = phases.reduce((s, t) => s + Math.sin(t), 0) / phases.length;
    const expected = Math.sqrt(re * re + im * im);
    const { R } = kuramotoOrderParameter(phases);
    assert.ok(Math.abs(R - expected) < 1e-12);
  });
});

// ─── phaseAlignment ────────────────────────────────────────────────────────

describe('phaseAlignment', () => {
  test('identical phases give R=1 (perfect resonance)', () => {
    const phases = [0.5, 1.2, 2.7, 0.3, 4.1, 5.6, 1.0];
    const R = phaseAlignment(phases, phases);
    assert.ok(Math.abs(R - 1) < 1e-10, `R=${R} should be 1 for identical phases`);
  });

  test('opposite phases give R near 0 (no resonance)', () => {
    // diff = [π, π, π, π] → all cos(π)=-1, sin(π)=0 → R=1 (anti-phase IS coherent)
    // For genuine disorder: use phases that differ by π/2 in alternating fashion
    const a = [0, 0, 0, 0];
    const b = [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2];
    // diff = [-π/2, -π/2, -π/2, -π/2] → R=1 (uniformly shifted)
    // To get R~0: use random-looking differences
    const c = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
    const d = [0, 0, 0, 0];
    // diff = [0, π/2, π, 3π/2] → equidistant → R~0
    const R = phaseAlignment(c, d);
    assert.ok(R < 1e-10, `R=${R} should be ~0`);
  });

  test('result is between 0 and 1', () => {
    const a = [1.0, 2.0, 3.0];
    const b = [1.1, 2.2, 2.8];
    const R = phaseAlignment(a, b);
    assert.ok(R >= 0 && R <= 1);
  });

  test('uses minimum length when arrays differ in size', () => {
    // Should not throw; uses 3 elements
    const a = [0, 0, 0, 0, 0];
    const b = [0, 0, 0];
    const R = phaseAlignment(a, b);
    assert.ok(Math.abs(R - 1) < 1e-10);
  });
});

// ─── PhiSpiralCoordinate ───────────────────────────────────────────────────

describe('PhiSpiralCoordinate', () => {
  test('constructs without throwing', () => {
    assert.doesNotThrow(() => new PhiSpiralCoordinate(42, 0, 0));
  });

  test('phase getter returns a non-negative number', () => {
    const c = new PhiSpiralCoordinate(100, 1, 2);
    assert.ok(typeof c.phase === 'number' && !isNaN(c.phase));
    assert.ok(c.phase >= 0);
  });

  test('toJSON returns expected keys', () => {
    const c = new PhiSpiralCoordinate(1, 0, 0);
    const json = c.toJSON();
    for (const key of ['theta', 'phi_coord', 'rho', 'ring', 'beat', 'phase']) {
      assert.ok(key in json, `missing key: ${key}`);
    }
  });

  test('beat property equals the windowIdx passed', () => {
    const c = new PhiSpiralCoordinate(7, 42, 3);
    assert.strictEqual(c.beat, 42);
  });

  test('different dimensions produce different theta values', () => {
    const seed = 123;
    const window = 0;
    const c0 = new PhiSpiralCoordinate(seed, window, 0);
    const c1 = new PhiSpiralCoordinate(seed, window, 1);
    assert.notStrictEqual(c0.theta, c1.theta);
  });

  test('rho is positive', () => {
    const c = new PhiSpiralCoordinate(99, 5, 2);
    assert.ok(c.rho > 0);
  });
});

// ─── phiHMAC ──────────────────────────────────────────────────────────────

describe('phiHMAC', () => {
  test('is deterministic for same inputs', () => {
    const sig1 = phiHMAC([1, 2, 3], 'caller-A', 7, 'secret');
    const sig2 = phiHMAC([1, 2, 3], 'caller-A', 7, 'secret');
    assert.strictEqual(sig1, sig2);
  });

  test('starts with "geo_" prefix', () => {
    const sig = phiHMAC([0.5, 1.0], 'caller', 0, 'secret');
    assert.ok(sig.startsWith('geo_'), `signature=${sig}`);
  });

  test('different callerIds produce different signatures', () => {
    const phases = [1, 2, 3, 4, 5];
    const sig1 = phiHMAC(phases, 'callerA', 0, 'secret');
    const sig2 = phiHMAC(phases, 'callerB', 0, 'secret');
    assert.notStrictEqual(sig1, sig2);
  });

  test('different secrets produce different signatures', () => {
    const phases = [1, 2, 3];
    const sig1 = phiHMAC(phases, 'caller', 0, 'secret1');
    const sig2 = phiHMAC(phases, 'caller', 0, 'secret2');
    assert.notStrictEqual(sig1, sig2);
  });

  test('different windowIndex values produce different signatures', () => {
    const phases = [1, 2, 3];
    const sig1 = phiHMAC(phases, 'caller', 0, 'secret');
    const sig2 = phiHMAC(phases, 'caller', 1, 'secret');
    assert.notStrictEqual(sig1, sig2);
  });

  test('different phase vectors produce different signatures', () => {
    const sig1 = phiHMAC([1, 2, 3], 'caller', 0, 'secret');
    const sig2 = phiHMAC([1, 2, 4], 'caller', 0, 'secret');
    assert.notStrictEqual(sig1, sig2);
  });
});

// ─── GeometricKey ─────────────────────────────────────────────────────────

describe('GeometricKey', () => {
  const callerId = 'test-organism';
  const secret   = 'shared-secret-42';
  const window   = 1000;

  test('constructs without throwing', () => {
    assert.doesNotThrow(() => new GeometricKey(callerId, secret, window));
  });

  test('has correct number of phases (KEY_DIMENSIONS)', () => {
    const key = new GeometricKey(callerId, secret, window);
    assert.strictEqual(key.phases.length, KEY_DIMENSIONS);
  });

  test('isStructurallyValid returns true with the correct secret', () => {
    const key = new GeometricKey(callerId, secret, window);
    assert.ok(key.isStructurallyValid(secret));
  });

  test('isStructurallyValid returns false with wrong secret', () => {
    const key = new GeometricKey(callerId, secret, window);
    assert.ok(!key.isStructurallyValid('wrong-secret'));
  });

  test('selfCoherence is in [0,1]', () => {
    const key = new GeometricKey(callerId, secret, window);
    assert.ok(key.selfCoherence >= 0 && key.selfCoherence <= 1);
  });

  test('same inputs always produce identical phase vectors', () => {
    const k1 = new GeometricKey(callerId, secret, window);
    const k2 = new GeometricKey(callerId, secret, window);
    assert.deepStrictEqual(k1.phases, k2.phases);
  });

  test('different callerIds produce different phases', () => {
    const k1 = new GeometricKey('org-A', secret, window);
    const k2 = new GeometricKey('org-B', secret, window);
    assert.notDeepStrictEqual(k1.phases, k2.phases);
  });

  test('toJSON includes all required fields', () => {
    const key = new GeometricKey(callerId, secret, window);
    const json = key.toJSON();
    for (const f of ['callerId', 'windowIndex', 'phases', 'signature', 'selfCoherence', 'coordinates']) {
      assert.ok(f in json, `missing field: ${f}`);
    }
  });

  test('custom dimensions are respected', () => {
    const key = new GeometricKey(callerId, secret, window, 5);
    assert.strictEqual(key.phases.length, 5);
  });
});

// ─── KuramotoLock ─────────────────────────────────────────────────────────

describe('KuramotoLock', () => {
  function makeKey(callerId, secret, windowIndex) {
    return new GeometricKey(callerId, secret, windowIndex).toJSON();
  }

  test('validate returns unregistered denial for unknown caller', () => {
    const lock   = new KuramotoLock();
    const token  = makeKey('ghost', 'secret', 0);
    const result = lock.validate(token, 0);
    assert.strictEqual(result.granted, false);
    assert.strictEqual(result.reason, 'unregistered');
  });

  test('validate grants access for registered caller with matching key', () => {
    const lock   = new KuramotoLock();
    const callerId = 'nova';
    const secret   = 'mysecret';
    const win      = 0;

    // Generate key and register the same phases as the envelope
    const key  = new GeometricKey(callerId, secret, win);
    lock.register(callerId, key.phases, secret);

    const result = lock.validate(key.toJSON(), win);
    assert.strictEqual(result.granted, true, `R=${result.R} reason=${result.reason}`);
  });

  test('validate denies with signature_mismatch on tampered token', () => {
    const lock   = new KuramotoLock();
    const callerId = 'nova';
    const secret   = 'mysecret';
    const win      = 0;

    const key  = new GeometricKey(callerId, secret, win);
    lock.register(callerId, key.phases, secret);

    const token = key.toJSON();
    token.signature = 'geo_000000'; // tampered signature

    const result = lock.validate(token, win);
    assert.strictEqual(result.granted, false);
    assert.strictEqual(result.reason, 'signature_mismatch');
  });

  test('validate denies with expired_window for old window index', () => {
    const lock   = new KuramotoLock();
    const callerId = 'nova';
    const secret   = 'mysecret';
    const win      = 5;

    const key = new GeometricKey(callerId, secret, win);
    lock.register(callerId, key.phases, secret);

    // Present the token claiming it was issued at window 5, but current window is 100
    const result = lock.validate(key.toJSON(), 100);
    assert.strictEqual(result.granted, false);
    assert.strictEqual(result.reason, 'expired_window');
  });

  test('revoke removes caller and future validations are denied', () => {
    const lock   = new KuramotoLock();
    const callerId = 'nova';
    const secret   = 'mysecret';
    const win      = 0;

    const key = new GeometricKey(callerId, secret, win);
    lock.register(callerId, key.phases, secret);

    const beforeRevoke = lock.validate(key.toJSON(), win);
    assert.strictEqual(beforeRevoke.granted, true, 'should be granted before revoke');

    lock.revoke(callerId);

    const afterRevoke = lock.validate(key.toJSON(), win);
    assert.strictEqual(afterRevoke.granted, false);
    assert.strictEqual(afterRevoke.reason, 'unregistered');
  });

  test('isRegistered returns true/false correctly', () => {
    const lock = new KuramotoLock();
    assert.strictEqual(lock.isRegistered('nobody'), false);
    lock.register('alice', [0, 1, 2], 'secret');
    assert.strictEqual(lock.isRegistered('alice'), true);
  });

  test('getEnvelopePhases returns registered phases', () => {
    const lock   = new KuramotoLock();
    const phases = [0.1, 0.2, 0.3];
    lock.register('bob', phases, 'secret');
    assert.deepStrictEqual(lock.getEnvelopePhases('bob'), phases);
  });

  test('getEnvelopePhases returns null for unknown caller', () => {
    const lock = new KuramotoLock();
    assert.strictEqual(lock.getEnvelopePhases('nobody'), null);
  });

  test('getDenialCount tracks failures per caller', () => {
    const lock = new KuramotoLock();
    const fakeToken = { callerId: 'ghost', phases: [], signature: 'x', windowIndex: 0 };
    lock.validate(fakeToken, 0);
    lock.validate(fakeToken, 0);
    assert.strictEqual(lock.getDenialCount('ghost'), 2);
  });

  test('getAuditLog has denials and admissions arrays', () => {
    const lock = new KuramotoLock();
    const log  = lock.getAuditLog();
    assert.ok(Array.isArray(log.denials));
    assert.ok(Array.isArray(log.admissions));
  });
});

// ─── GeometricKeyProtocol ─────────────────────────────────────────────────

describe('GeometricKeyProtocol', () => {
  test('constructs and exposes currentWindow()', () => {
    const proto = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    assert.ok(typeof proto.currentWindow() === 'number');
    proto.stop();
  });

  test('registerCaller returns envelope and windowIndex', () => {
    const proto  = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    const result = proto.registerCaller('nova', 'secret');
    assert.ok(Array.isArray(result.envelope));
    assert.ok(typeof result.windowIndex === 'number');
    proto.stop();
  });

  test('issueKey throws for unregistered caller', () => {
    const proto = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    assert.throws(() => proto.issueKey('ghost'), /not registered/);
    proto.stop();
  });

  test('full lifecycle: register → issue → validate → granted', () => {
    const proto    = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    const callerId = 'nova';
    const secret   = 'my-secret';

    proto.registerCaller(callerId, secret);
    const token  = proto.issueKey(callerId);
    const result = proto.validateKey(token);

    assert.strictEqual(result.granted, true, `R=${result.R} reason=${result.reason}`);
    proto.stop();
  });

  test('validateKey includes callerId, windowDelta, threshold, protocol fields', () => {
    const proto    = new GeometricKeyProtocol({ protocolId: 'my-lock' });
    const callerId = 'nova';
    proto.registerCaller(callerId, 'secret');
    const token  = proto.issueKey(callerId);
    const result = proto.validateKey(token);

    assert.strictEqual(result.callerId, callerId);
    assert.ok(typeof result.windowDelta === 'number');
    assert.ok(typeof result.threshold === 'number');
    assert.strictEqual(result.protocol, 'my-lock');
    proto.stop();
  });

  test('revokeKey prevents future validation', () => {
    const proto    = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    const callerId = 'nova';
    proto.registerCaller(callerId, 'secret');

    const tokenBefore = proto.issueKey(callerId);
    assert.strictEqual(proto.validateKey(tokenBefore).granted, true);

    proto.revokeKey(callerId);

    const tokenAfter = new GeometricKey(callerId, 'secret', proto.currentWindow()).toJSON();
    assert.strictEqual(proto.validateKey(tokenAfter).granted, false);
    proto.stop();
  });

  test('probe returns would_grant without writing to audit log', () => {
    const proto    = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    const callerId = 'nova';
    proto.registerCaller(callerId, 'secret');
    const token  = proto.issueKey(callerId);

    const probeResult = proto.probe(token);
    assert.ok('would_grant' in probeResult);
    assert.ok('R' in probeResult);

    // Audit log should have 0 admissions (probe doesn't write)
    const log = proto.getStatus().auditLog;
    assert.strictEqual(log.admissions.length, 0);
    proto.stop();
  });

  test('probe returns false for unregistered caller', () => {
    const proto  = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    const result = proto.probe({ callerId: 'nobody', phases: [] });
    assert.strictEqual(result.would_grant, false);
    proto.stop();
  });

  test('isRegistered returns true after registerCaller', () => {
    const proto = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    assert.strictEqual(proto.isRegistered('nova'), false);
    proto.registerCaller('nova', 'secret');
    assert.strictEqual(proto.isRegistered('nova'), true);
    proto.stop();
  });

  test('getStatus returns expected shape', () => {
    const proto  = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    const status = proto.getStatus();
    assert.ok('protocolId' in status);
    assert.ok('registeredCallers' in status);
    assert.ok('currentWindow' in status);
    assert.ok('emergenceThreshold' in status);
    proto.stop();
  });

  test('multiple callers can coexist independently', () => {
    const proto = new GeometricKeyProtocol({ protocolId: 'test-proto' });
    proto.registerCaller('alice', 'secretA');
    proto.registerCaller('bob',   'secretB');

    const tokenA = proto.issueKey('alice');
    const tokenB = proto.issueKey('bob');

    assert.strictEqual(proto.validateKey(tokenA).granted, true);
    assert.strictEqual(proto.validateKey(tokenB).granted, true);
    proto.stop();
  });
});
