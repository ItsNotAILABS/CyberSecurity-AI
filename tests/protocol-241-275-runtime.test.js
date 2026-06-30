import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { createProtocol241to275Registry, executeProtocol241to275 } from '../protocols/modular-nova/runtime-bridge.js';

function makeCtx(protocolId, overrides = {}) {
  return {
    protocolId,
    input: { signal: 'alpha' },
    parameters: { window: 3, ...overrides.parameters },
    substrate: 'typescript',
    organism: {
      id: 'org-test',
      phase: 0.5,
      protocols: new Map(),
      miniHeart: {},
      miniBrain: {},
    },
  };
}

describe('PROTO-241..275 runtime bridge', () => {
  test('creates full executable registry', () => {
    const registry = createProtocol241to275Registry();
    assert.strictEqual(registry.length, 35);
    assert.ok(registry.every((entry) => entry.id.startsWith('PROTO-')));
  });

  test('execution is deterministic for same context', () => {
    const ctx = makeCtx('PROTO-249', { parameters: { window: 2, alpha: 0.7, freq: 5 } });
    const a = executeProtocol241to275(ctx);
    const b = executeProtocol241to275(ctx);

    assert.deepStrictEqual(a, b);
    assert.ok(typeof a.attestation === 'string' && a.attestation.startsWith('phi_'));
    assert.ok(typeof a.granted === 'boolean');
    assert.ok(a.R >= 0 && a.R <= 1);
  });

  test('all domains produce enforceable threshold decision', () => {
    const ids = ['PROTO-241', 'PROTO-250', 'PROTO-260', 'PROTO-275'];
    for (const id of ids) {
      const result = executeProtocol241to275(makeCtx(id));
      assert.ok('threshold' in result);
      assert.ok('granted' in result);
      assert.ok(result.phases.length > 0);
    }
  });

  test('registry protocol execute delegates to shared engine', async () => {
    const registry = createProtocol241to275Registry();
    const proto = registry.find((entry) => entry.id === 'PROTO-268');
    assert.ok(proto);

    const result = await proto.execute(makeCtx('PROTO-268', { parameters: { membraneV: -55 } }));
    assert.strictEqual(result.protocolId, 'PROTO-268');
    assert.ok(result.metrics.membraneV >= -100 && result.metrics.membraneV <= 100);
  });
});
