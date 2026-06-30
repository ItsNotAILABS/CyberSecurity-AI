import { describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { CANONICAL_PROTOCOL_MAP_241_275 } from '../protocols/modular-nova/protocol-map-241-275.js';

describe('PROTO-241..275 canonical map', () => {
  test('contains 35 contiguous protocol IDs', () => {
    assert.strictEqual(CANONICAL_PROTOCOL_MAP_241_275.length, 35);

    const numeric = CANONICAL_PROTOCOL_MAP_241_275
      .map((entry) => Number(entry.id.split('-')[1]))
      .sort((a, b) => a - b);

    assert.deepStrictEqual(numeric, Array.from({ length: 35 }, (_, i) => 241 + i));
  });

  test('contains required four domains with expected distribution', () => {
    const counts = new Map();
    for (const entry of CANONICAL_PROTOCOL_MAP_241_275) {
      counts.set(entry.domain, (counts.get(entry.domain) || 0) + 1);
      assert.ok(entry.ownership.includes('Casa de Medina'));
      assert.ok(entry.callId.startsWith('CALL-'));
      assert.ok(entry.latinDesignation.length > 0);
    }

    assert.strictEqual(counts.get('consciousness-sentience'), 8);
    assert.strictEqual(counts.get('quantum-intelligence'), 8);
    assert.strictEqual(counts.get('cosmic-universal'), 8);
    assert.strictEqual(counts.get('bio-neural'), 11);
  });
});
