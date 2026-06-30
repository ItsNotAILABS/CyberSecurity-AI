///
/// tests/authentication-protocol.test.js
///
/// Comprehensive test coverage for sdk/authentication-protocol/src/index.js
///
/// Covers:
///   - Identity: hash generation, publicKey, verify, toJSON
///   - Challenge: creation, isExpired, generateResponse, verifyResponse (valid/mismatch/expired)
///   - AccessToken: creation, isValid (fresh/revoked/expired), hasPermission, revoke, toJSON
///   - PermissionLevel: hasLevel hierarchy, grantAll
///   - AuthenticationEngine: full lifecycle — createChallenge, respondToChallenge,
///     verifyChallenge, issueToken, verifyToken, revokeToken, checkPermission, cleanup
///
/// NOTE: The @medina/medina-heart bare specifier is resolved by tests/setup.mjs
/// (via tests/hooks.mjs) to the test shim at tests/shims/@medina/medina-heart.js.
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  Identity,
  Challenge,
  AccessToken,
  PermissionLevel,
  AuthenticationEngine,
} from '../sdk/authentication-protocol/src/index.js';

// ─── Identity ─────────────────────────────────────────────────────────────

describe('Identity', () => {
  test('constructs with organismId and generates hash + publicKey', () => {
    const id = new Identity({ organismId: 'nova' });
    assert.ok(id.hash.startsWith('φ_'), `hash=${id.hash}`);
    assert.ok(id.publicKey.startsWith('pk_'), `publicKey=${id.publicKey}`);
    assert.strictEqual(id.organismId, 'nova');
  });

  test('same inputs produce the same hash (deterministic)', () => {
    const ts = 1000000;
    const id1 = new Identity({ organismId: 'nova', data: { role: 'guardian' }, timestamp: ts });
    const id2 = new Identity({ organismId: 'nova', data: { role: 'guardian' }, timestamp: ts });
    assert.strictEqual(id1.hash, id2.hash);
  });

  test('different data produces different hashes', () => {
    const ts = 1000000;
    const id1 = new Identity({ organismId: 'nova', data: { role: 'guardian' }, timestamp: ts });
    const id2 = new Identity({ organismId: 'nova', data: { role: 'observer' }, timestamp: ts });
    assert.notStrictEqual(id1.hash, id2.hash);
  });

  test('verify returns true for own hash', () => {
    const id = new Identity({ organismId: 'nova' });
    assert.ok(id.verify(id.hash));
  });

  test('verify returns false for wrong hash', () => {
    const id = new Identity({ organismId: 'nova' });
    assert.ok(!id.verify('wrong_hash'));
  });

  test('toJSON includes all expected fields', () => {
    const id   = new Identity({ organismId: 'nova' });
    const json = id.toJSON();
    for (const field of ['organismId', 'data', 'timestamp', 'hash', 'publicKey']) {
      assert.ok(field in json, `missing field: ${field}`);
    }
  });
});

// ─── Challenge ────────────────────────────────────────────────────────────

describe('Challenge', () => {
  test('constructs with unique IDs', () => {
    const c1 = new Challenge({ challengerId: 'A', targetId: 'B' });
    const c2 = new Challenge({ challengerId: 'A', targetId: 'B' });
    assert.notStrictEqual(c1.id, c2.id);
  });

  test('isExpired returns false for a fresh challenge', () => {
    const c = new Challenge({ challengerId: 'A', targetId: 'B' });
    assert.strictEqual(c.isExpired(), false);
  });

  test('isExpired returns true when expiry is in the past', () => {
    const c  = new Challenge({ challengerId: 'A', targetId: 'B' });
    c.expiry = Date.now() - 1;
    assert.strictEqual(c.isExpired(), true);
  });

  test('generateResponse returns a string starting with "resp_"', () => {
    const id = new Identity({ organismId: 'nova' });
    const c  = new Challenge({ challengerId: 'guard', targetId: 'nova' });
    const r  = c.generateResponse(id);
    assert.ok(r.startsWith('resp_'), `response=${r}`);
  });

  test('generateResponse is deterministic for same inputs', () => {
    const id = new Identity({ organismId: 'nova' });
    const c  = new Challenge({ challengerId: 'guard', targetId: 'nova' });
    assert.strictEqual(c.generateResponse(id), c.generateResponse(id));
  });

  test('generateResponse throws if challenge is expired', () => {
    const id  = new Identity({ organismId: 'nova' });
    const c   = new Challenge({ challengerId: 'guard', targetId: 'nova' });
    c.expiry  = Date.now() - 1;
    assert.throws(() => c.generateResponse(id), /expired/i);
  });

  test('verifyResponse returns valid=true for correct response', () => {
    const id       = new Identity({ organismId: 'nova' });
    const c        = new Challenge({ challengerId: 'guard', targetId: 'nova' });
    const response = c.generateResponse(id);
    const result   = c.verifyResponse(response, id);
    assert.strictEqual(result.valid, true);
  });

  test('verifyResponse returns valid=false for wrong response', () => {
    const id     = new Identity({ organismId: 'nova' });
    const c      = new Challenge({ challengerId: 'guard', targetId: 'nova' });
    const result = c.verifyResponse('resp_wrong', id);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.reason, 'mismatch');
  });

  test('verifyResponse returns expired if challenge has expired', () => {
    const id  = new Identity({ organismId: 'nova' });
    const c   = new Challenge({ challengerId: 'guard', targetId: 'nova' });
    c.expiry  = Date.now() - 1;
    const result = c.verifyResponse('any', id);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.reason, 'expired');
  });

  test('status changes to "responded" after successful verify', () => {
    const id       = new Identity({ organismId: 'nova' });
    const c        = new Challenge({ challengerId: 'guard', targetId: 'nova' });
    const response = c.generateResponse(id);
    c.verifyResponse(response, id);
    assert.strictEqual(c.status, 'responded');
  });
});

// ─── AccessToken ──────────────────────────────────────────────────────────

describe('AccessToken', () => {
  test('constructs with unique IDs', () => {
    const t1 = new AccessToken({ holder: 'nova', issuer: 'guard' });
    const t2 = new AccessToken({ holder: 'nova', issuer: 'guard' });
    assert.notStrictEqual(t1.id, t2.id);
  });

  test('isValid returns true for a fresh token', () => {
    const token = new AccessToken({
      holder:      'nova',
      issuer:      'guard',
      permissions: [PermissionLevel.READ],
    });
    assert.ok(token.isValid());
  });

  test('isValid returns false after revoke', () => {
    const token = new AccessToken({ holder: 'nova', issuer: 'guard' });
    token.revoke();
    assert.ok(!token.isValid());
  });

  test('isValid returns false for expired token', () => {
    const token    = new AccessToken({ holder: 'nova', issuer: 'guard', validity: 1 });
    token.expiresAt = Date.now() - 1; // force expiry
    assert.ok(!token.isValid());
  });

  test('hasPermission returns true for granted permission', () => {
    const token = new AccessToken({
      holder:      'nova',
      issuer:      'guard',
      permissions: [PermissionLevel.READ, PermissionLevel.WRITE],
    });
    assert.ok(token.hasPermission(PermissionLevel.READ));
    assert.ok(token.hasPermission(PermissionLevel.WRITE));
  });

  test('hasPermission returns false for missing permission', () => {
    const token = new AccessToken({
      holder:      'nova',
      issuer:      'guard',
      permissions: [PermissionLevel.READ],
    });
    assert.ok(!token.hasPermission(PermissionLevel.ADMIN));
  });

  test('hasPermission returns false after revoke', () => {
    const token = new AccessToken({
      holder:      'nova',
      issuer:      'guard',
      permissions: [PermissionLevel.ADMIN],
    });
    token.revoke();
    assert.ok(!token.hasPermission(PermissionLevel.ADMIN));
  });

  test('toJSON returns expected fields', () => {
    const token = new AccessToken({ holder: 'nova', issuer: 'guard' });
    const json  = token.toJSON();
    for (const f of ['id', 'holder', 'issuer', 'permissions', 'issuedAt', 'expiresAt', 'revoked', 'signature']) {
      assert.ok(f in json, `missing field: ${f}`);
    }
  });
});

// ─── PermissionLevel ──────────────────────────────────────────────────────

describe('PermissionLevel', () => {
  test('static constants are defined', () => {
    assert.strictEqual(PermissionLevel.READ,    'read');
    assert.strictEqual(PermissionLevel.WRITE,   'write');
    assert.strictEqual(PermissionLevel.EXECUTE, 'execute');
    assert.strictEqual(PermissionLevel.ADMIN,   'admin');
  });

  test('hasLevel: read >= read', () => {
    assert.ok(PermissionLevel.hasLevel('read', 'read'));
  });

  test('hasLevel: admin >= write', () => {
    assert.ok(PermissionLevel.hasLevel('admin', 'write'));
  });

  test('hasLevel: read < admin', () => {
    assert.ok(!PermissionLevel.hasLevel('read', 'admin'));
  });

  test('hasLevel: unknown level is 0 (below all)', () => {
    assert.ok(!PermissionLevel.hasLevel('unknown', 'read'));
  });

  test('grantAll returns all four permissions', () => {
    const all = PermissionLevel.grantAll();
    assert.ok(all.includes('read'));
    assert.ok(all.includes('write'));
    assert.ok(all.includes('execute'));
    assert.ok(all.includes('admin'));
    assert.strictEqual(all.length, 4);
  });
});

// ─── AuthenticationEngine ─────────────────────────────────────────────────

describe('AuthenticationEngine', () => {
  test('constructs and has identity', () => {
    const engine = new AuthenticationEngine({ organismId: 'nova' });
    assert.ok(engine.identity instanceof Identity);
    assert.strictEqual(engine.identity.hash, engine.getStatus().identity);
  });

  test('createChallenge returns a Challenge and stores it', () => {
    const engine    = new AuthenticationEngine({ organismId: 'guard' });
    const challenge = engine.createChallenge('nova');
    assert.ok(typeof challenge.id === 'string');
    assert.strictEqual(engine.activeChallenges.size, 1);
  });

  test('respondToChallenge + verifyChallenge succeeds for matching identity', () => {
    const engine   = new AuthenticationEngine({ organismId: 'guard' });
    const identity = new Identity({ organismId: 'nova' });

    const challenge = engine.createChallenge('nova');
    const { challengeId, response } = engine.respondToChallenge(challenge.id, identity);
    const result = engine.verifyChallenge(challengeId, response, identity);

    assert.strictEqual(result.valid, true);
  });

  test('verifyChallenge removes challenge from activeChallenges on success', () => {
    const engine   = new AuthenticationEngine({ organismId: 'guard' });
    const identity = new Identity({ organismId: 'nova' });

    const challenge = engine.createChallenge('nova');
    const { challengeId, response } = engine.respondToChallenge(challenge.id, identity);
    engine.verifyChallenge(challengeId, response, identity);

    assert.strictEqual(engine.activeChallenges.size, 0);
  });

  test('verifyChallenge returns not_found for unknown challengeId', () => {
    const engine   = new AuthenticationEngine({ organismId: 'guard' });
    const identity = new Identity({ organismId: 'nova' });
    const result   = engine.verifyChallenge('fake-id', 'any', identity);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.reason, 'not_found');
  });

  test('respondToChallenge throws for unknown challengeId', () => {
    const engine   = new AuthenticationEngine({ organismId: 'guard' });
    const identity = new Identity({ organismId: 'nova' });
    assert.throws(() => engine.respondToChallenge('fake-id', identity), /Challenge not found/);
  });

  test('issueToken creates a valid token', () => {
    const engine = new AuthenticationEngine({ organismId: 'guard' });
    const token  = engine.issueToken('nova');
    assert.ok(token.isValid());
    assert.strictEqual(engine.issuedTokens.size, 1);
  });

  test('verifyToken returns valid=true for active token', () => {
    const engine  = new AuthenticationEngine({ organismId: 'guard' });
    const token   = engine.issueToken('nova');
    const result  = engine.verifyToken(token.id);
    assert.strictEqual(result.valid, true);
  });

  test('verifyToken returns not_found for unknown token', () => {
    const engine = new AuthenticationEngine({ organismId: 'guard' });
    const result = engine.verifyToken('fake-token-id');
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.reason, 'not_found');
  });

  test('revokeToken invalidates the token', () => {
    const engine = new AuthenticationEngine({ organismId: 'guard' });
    const token  = engine.issueToken('nova');
    engine.revokeToken(token.id);

    const result = engine.verifyToken(token.id);
    assert.strictEqual(result.valid, false);
    assert.strictEqual(result.reason, 'revoked');
  });

  test('checkPermission returns true for granted permission', () => {
    const engine = new AuthenticationEngine({ organismId: 'guard' });
    const token  = engine.issueToken('nova', [PermissionLevel.READ, PermissionLevel.WRITE]);
    assert.ok(engine.checkPermission(token.id, PermissionLevel.READ));
    assert.ok(engine.checkPermission(token.id, PermissionLevel.WRITE));
  });

  test('checkPermission returns false for missing permission', () => {
    const engine = new AuthenticationEngine({ organismId: 'guard' });
    const token  = engine.issueToken('nova', [PermissionLevel.READ]);
    assert.ok(!engine.checkPermission(token.id, PermissionLevel.ADMIN));
  });

  test('checkPermission returns false after token revocation', () => {
    const engine = new AuthenticationEngine({ organismId: 'guard' });
    const token  = engine.issueToken('nova', PermissionLevel.grantAll());
    engine.revokeToken(token.id);
    assert.ok(!engine.checkPermission(token.id, PermissionLevel.READ));
  });

  test('cleanup removes expired challenges', () => {
    const engine    = new AuthenticationEngine({ organismId: 'guard' });
    const challenge = engine.createChallenge('nova');
    challenge.expiry = Date.now() - 1; // force expiry
    const result = engine.cleanup();
    assert.ok(result.cleaned >= 1);
  });

  test('getStatus returns expected shape', () => {
    const engine = new AuthenticationEngine({ organismId: 'guard' });
    const status = engine.getStatus();
    assert.strictEqual(status.organismId, 'guard');
    assert.ok(typeof status.identity === 'string');
    assert.ok(typeof status.activeChallenges === 'number');
    assert.ok(typeof status.issuedTokens === 'number');
  });
});
