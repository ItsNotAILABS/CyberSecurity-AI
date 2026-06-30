///
/// tests/medina-registry.test.js
///
/// Comprehensive test coverage for sdk/medina-registry/src/index.js
///
/// Covers:
///   - SovereignRegistry: constructor pre-registers core SDKs
///   - publish: success, duplicate rejection, missing fields
///   - install: by name+version, by name only (latest), recursive dependencies
///   - install: throws for unknown package
///   - list: returns all registered packages
///   - search: regex matching
///   - info: returns package details with dependents
///   - stats: accuracy
///   - DistributedRegistrySync: constructor, sync, addPeer, removePeer
///   - createRegistry: factory function, distributed option
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  SovereignRegistry,
  DistributedRegistrySync,
  createRegistry,
} from '../sdk/medina-registry/src/index.js';

// ─── SovereignRegistry: constructor ───────────────────────────────────────

describe('SovereignRegistry constructor', () => {
  test('constructs with default name', () => {
    const reg = new SovereignRegistry();
    assert.strictEqual(reg.name, 'MEDINA_REGISTRY');
  });

  test('accepts custom name', () => {
    const reg = new SovereignRegistry('MY_REGISTRY');
    assert.strictEqual(reg.name, 'MY_REGISTRY');
  });

  test('pre-registers core MEDINA SDKs on construction', () => {
    const reg  = new SovereignRegistry();
    const list = reg.list();
    const coreNames = [
      '@medina/medina-heart',
      '@medina/medina-registry',
      '@medina/geometry-lock',
    ];
    for (const name of coreNames) {
      const found = list.find(p => p.name === name);
      assert.ok(found, `core SDK not pre-registered: ${name}`);
    }
  });

  test('pre-registered count is at least 9', () => {
    const reg = new SovereignRegistry();
    assert.ok(reg.packages.size >= 9, `expected ≥9 pre-registered, got ${reg.packages.size}`);
  });
});

// ─── publish ──────────────────────────────────────────────────────────────

describe('SovereignRegistry.publish', () => {
  test('successfully publishes a new package', () => {
    const reg    = new SovereignRegistry();
    const result = reg.publish({ name: '@test/pkg', version: '1.0.0', type: 'test' });
    assert.strictEqual(result.success, true);
    assert.ok(result.key.includes('@test/pkg'));
  });

  test('returns already-exists for duplicate publish', () => {
    const reg = new SovereignRegistry();
    reg.publish({ name: '@test/pkg', version: '1.0.0' });
    const result = reg.publish({ name: '@test/pkg', version: '1.0.0' });
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.reason, 'already-exists');
  });

  test('throws for missing name', () => {
    const reg = new SovereignRegistry();
    assert.throws(() => reg.publish({ version: '1.0.0' }), /name and version required/);
  });

  test('throws for missing version', () => {
    const reg = new SovereignRegistry();
    assert.throws(() => reg.publish({ name: '@test/pkg' }), /name and version required/);
  });

  test('published package is retrievable via list()', () => {
    const reg = new SovereignRegistry();
    reg.publish({ name: '@nova/engine', version: '2.0.0', type: 'engine' });
    const found = reg.list().find(p => p.name === '@nova/engine');
    assert.ok(found);
    assert.strictEqual(found.version, '2.0.0');
  });

  test('publishCount increments on each successful publish', () => {
    const reg = new SovereignRegistry();
    const before = reg.publishCount;
    reg.publish({ name: '@a/b', version: '1.0.0' });
    reg.publish({ name: '@a/c', version: '1.0.0' });
    assert.strictEqual(reg.publishCount, before + 2);
  });
});

// ─── install ──────────────────────────────────────────────────────────────

describe('SovereignRegistry.install', () => {
  test('installs a pre-registered core SDK by name+version', () => {
    const reg    = new SovereignRegistry();
    const result = reg.install('@medina/medina-heart', '1.0.0');
    assert.strictEqual(result.name, '@medina/medina-heart');
    assert.strictEqual(result.version, '1.0.0');
  });

  test('installs a pre-registered SDK using "latest" lookup', () => {
    const reg    = new SovereignRegistry();
    const result = reg.install('@medina/medina-heart');
    assert.strictEqual(result.name, '@medina/medina-heart');
  });

  test('installCount increments on each install', () => {
    const reg    = new SovereignRegistry();
    const before = reg.installCount;
    reg.install('@medina/medina-heart', '1.0.0');
    assert.strictEqual(reg.installCount, before + 1);
  });

  test('throws for unknown package', () => {
    const reg = new SovereignRegistry();
    assert.throws(() => reg.install('@ghost/pkg', '1.0.0'), /not found/);
  });

  test('installs recursive dependencies', () => {
    const reg = new SovereignRegistry();
    reg.publish({ name: '@a/lib', version: '1.0.0' });
    reg.publish({
      name: '@a/app',
      version: '1.0.0',
      dependencies: [{ name: '@a/lib', version: '1.0.0' }],
    });

    const result = reg.install('@a/app', '1.0.0');
    assert.ok(Array.isArray(result.dependencies));
    assert.ok(result.dependencies.length >= 1);
    assert.strictEqual(result.dependencies[0].name, '@a/lib');
  });
});

// ─── list ─────────────────────────────────────────────────────────────────

describe('SovereignRegistry.list', () => {
  test('returns an array', () => {
    const reg = new SovereignRegistry();
    assert.ok(Array.isArray(reg.list()));
  });

  test('includes all pre-registered + published packages', () => {
    const reg    = new SovereignRegistry();
    const before = reg.list().length;
    reg.publish({ name: '@test/extra', version: '1.0.0' });
    assert.strictEqual(reg.list().length, before + 1);
  });

  test('each entry has a key property', () => {
    const reg  = new SovereignRegistry();
    const list = reg.list();
    assert.ok(list.every(p => typeof p.key === 'string'));
  });
});

// ─── search ───────────────────────────────────────────────────────────────

describe('SovereignRegistry.search', () => {
  test('finds packages matching pattern', () => {
    const reg     = new SovereignRegistry();
    const results = reg.search('medina-heart');
    assert.ok(results.length >= 1);
    assert.ok(results.every(p => p.name.includes('medina-heart')));
  });

  test('returns empty array for no match', () => {
    const reg     = new SovereignRegistry();
    const results = reg.search('this-package-does-not-exist-xyz');
    assert.strictEqual(results.length, 0);
  });

  test('search is case-insensitive', () => {
    const reg     = new SovereignRegistry();
    const lower   = reg.search('MEDINA-HEART');
    assert.ok(lower.length >= 1);
  });
});

// ─── info ─────────────────────────────────────────────────────────────────

describe('SovereignRegistry.info', () => {
  test('returns package info for registered package', () => {
    const reg  = new SovereignRegistry();
    const info = reg.info('@medina/medina-heart', '1.0.0');
    assert.ok(info !== null);
    assert.strictEqual(info.name, '@medina/medina-heart');
    assert.ok(Array.isArray(info.dependencies));
    assert.ok(Array.isArray(info.dependents));
  });

  test('returns null for unknown package', () => {
    const reg  = new SovereignRegistry();
    const info = reg.info('@ghost/pkg', '1.0.0');
    assert.strictEqual(info, null);
  });
});

// ─── stats ────────────────────────────────────────────────────────────────

describe('SovereignRegistry.stats', () => {
  test('returns expected shape', () => {
    const reg   = new SovereignRegistry();
    const stats = reg.stats();
    assert.ok(typeof stats.totalPackages === 'number');
    assert.ok(typeof stats.publishCount === 'number');
    assert.ok(typeof stats.installCount === 'number');
    assert.ok(typeof stats.uptime === 'number');
    assert.ok(stats.sovereign === true);
  });

  test('totalPackages matches packages.size', () => {
    const reg   = new SovereignRegistry();
    const stats = reg.stats();
    assert.strictEqual(stats.totalPackages, reg.packages.size);
  });
});

// ─── DistributedRegistrySync ──────────────────────────────────────────────

describe('DistributedRegistrySync', () => {
  test('constructs with local registry and peers', () => {
    const reg  = new SovereignRegistry();
    const sync = new DistributedRegistrySync(reg, ['peer-1', 'peer-2']);
    assert.strictEqual(sync.peers.length, 2);
    assert.strictEqual(sync.syncCount, 0);
  });

  test('sync returns results for all peers', async () => {
    const reg    = new SovereignRegistry();
    const sync   = new DistributedRegistrySync(reg, ['peer-A', 'peer-B']);
    const result = await sync.sync();

    assert.strictEqual(result.results.length, 2);
    assert.ok(result.results.every(r => 'peer' in r && 'success' in r));
    assert.strictEqual(sync.syncCount, 1);
  });

  test('sync increments syncCount on each call', async () => {
    const reg  = new SovereignRegistry();
    const sync = new DistributedRegistrySync(reg, ['peer']);
    await sync.sync();
    await sync.sync();
    assert.strictEqual(sync.syncCount, 2);
  });

  test('addPeer increases peer count', () => {
    const reg  = new SovereignRegistry();
    const sync = new DistributedRegistrySync(reg, []);
    sync.addPeer('new-peer');
    assert.strictEqual(sync.peers.length, 1);
  });

  test('removePeer decreases peer count', () => {
    const reg  = new SovereignRegistry();
    const sync = new DistributedRegistrySync(reg, ['peer-A', 'peer-B']);
    sync.removePeer('peer-A');
    assert.strictEqual(sync.peers.length, 1);
    assert.strictEqual(sync.peers[0], 'peer-B');
  });

  test('removePeer is a no-op for unknown peer', () => {
    const reg  = new SovereignRegistry();
    const sync = new DistributedRegistrySync(reg, ['peer-A']);
    sync.removePeer('ghost');
    assert.strictEqual(sync.peers.length, 1);
  });

  test('sync with zero peers returns empty results', async () => {
    const reg    = new SovereignRegistry();
    const sync   = new DistributedRegistrySync(reg, []);
    const result = await sync.sync();
    assert.strictEqual(result.results.length, 0);
  });
});

// ─── createRegistry factory ───────────────────────────────────────────────

describe('createRegistry', () => {
  test('returns { registry } by default', () => {
    const { registry } = createRegistry('TEST');
    assert.ok(registry instanceof SovereignRegistry);
    assert.strictEqual(registry.name, 'TEST');
  });

  test('returns { registry, sync } when distributed=true and peers provided', () => {
    const { registry, sync } = createRegistry('TEST', {
      distributed: true,
      peers: ['peer-1'],
    });
    assert.ok(registry instanceof SovereignRegistry);
    assert.ok(sync instanceof DistributedRegistrySync);
  });
});
