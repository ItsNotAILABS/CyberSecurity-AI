///
/// @medina/interoperability-protocol — Cross-Platform Compatibility
/// IPC-2026: Interoperability Protocol Charter
/// Platform abstraction, protocol translation, and bridge implementations
///

import { PHI } from '@medina/medina-heart';

export class PlatformAdapter {
  constructor({ platform, version = '1.0.0' } = {}) {
    this.platform = platform; // Web, Node, Deno, IC, Ethereum, Solana
    this.version = version;
    this.capabilities = this._initializeCapabilities();
  }

  _initializeCapabilities() {
    const platformCapabilities = {
      Web: ['fetch', 'websocket', 'indexeddb', 'workers'],
      Node: ['fs', 'http', 'crypto', 'child_process'],
      Deno: ['fetch', 'websocket', 'kv', 'subprocess'],
      IC: ['canister', 'stable_memory', 'inter_canister_call'],
      Ethereum: ['web3', 'contract', 'transaction'],
      Solana: ['transaction', 'program', 'account'],
    };

    return platformCapabilities[this.platform] || [];
  }

  hasCapability(capability) {
    return this.capabilities.includes(capability);
  }

  async execute(operation, params = {}) {
    // Platform-specific execution
    switch (this.platform) {
      case 'Web':
        return this._executeWeb(operation, params);
      case 'Node':
        return this._executeNode(operation, params);
      default:
        return { success: false, reason: 'unsupported_platform' };
    }
  }

  async _executeWeb(operation, params) {
    return { platform: 'Web', operation, params, executed: true };
  }

  async _executeNode(operation, params) {
    return { platform: 'Node', operation, params, executed: true };
  }
}

export class ProtocolTranslator {
  constructor() {
    this.translations = new Map();
  }

  registerTranslation(sourceProtocol, targetProtocol, translator) {
    const key = `${sourceProtocol}:${targetProtocol}`;
    this.translations.set(key, translator);
  }

  async translate(data, sourceProtocol, targetProtocol) {
    const key = `${sourceProtocol}:${targetProtocol}`;
    const translator = this.translations.get(key);

    if (!translator) {
      return { success: false, reason: 'no_translator_found' };
    }

    try {
      const translated = await translator(data);
      return { success: true, data: translated, latency: Math.floor(10 * PHI) };
    } catch (error) {
      return { success: false, reason: error.message };
    }
  }

  hasTranslation(sourceProtocol, targetProtocol) {
    const key = `${sourceProtocol}:${targetProtocol}`;
    return this.translations.has(key);
  }
}

export class DataFormatConverter {
  constructor() {
    this.formats = ['JSON', 'CBOR', 'ProtocolBuffers', 'MessagePack'];
  }

  convert(data, sourceFormat, targetFormat) {
    if (sourceFormat === targetFormat) {
      return { success: true, data };
    }

    // Simulate format conversion
    try {
      let intermediate = data;

      // Convert to intermediate (JSON)
      if (sourceFormat !== 'JSON') {
        intermediate = this._toJSON(data, sourceFormat);
      }

      // Convert from intermediate to target
      if (targetFormat !== 'JSON') {
        return { success: true, data: this._fromJSON(intermediate, targetFormat) };
      }

      return { success: true, data: intermediate };
    } catch (error) {
      return { success: false, reason: error.message };
    }
  }

  _toJSON(data, format) {
    // Simplified conversion - in real implementation would use actual libraries
    return typeof data === 'string' ? JSON.parse(data) : data;
  }

  _fromJSON(data, format) {
    // Simplified conversion
    if (format === 'CBOR' || format === 'ProtocolBuffers' || format === 'MessagePack') {
      return JSON.stringify(data);
    }
    return data;
  }

  supports(format) {
    return this.formats.includes(format);
  }
}

export class APICompatibilityMatrix {
  constructor() {
    this.compatibilities = new Map();
    this._initializeDefaults();
  }

  _initializeDefaults() {
    // REST compatible with most
    this.setCompatible('REST', 'GraphQL', true);
    this.setCompatible('REST', 'gRPC', true);
    this.setCompatible('REST', 'WebSocket', true);

    // GraphQL compatible with WebSocket
    this.setCompatible('GraphQL', 'WebSocket', true);

    // gRPC has lower compatibility
    this.setCompatible('gRPC', 'REST', true);
  }

  setCompatible(api1, api2, compatible) {
    const key = `${api1}:${api2}`;
    this.compatibilities.set(key, compatible);
  }

  isCompatible(api1, api2) {
    const key = `${api1}:${api2}`;
    return this.compatibilities.get(key) || false;
  }

  getBestAPI(apis) {
    // Prefer WebSocket > GraphQL > REST > gRPC
    const priority = { WebSocket: 4, GraphQL: 3, REST: 2, gRPC: 1 };
    return apis.sort((a, b) => (priority[b] || 0) - (priority[a] || 0))[0];
  }
}

export class Bridge {
  constructor({ source, target } = {}) {
    this.source = source;
    this.target = target;
    this.adapter = new PlatformAdapter({ platform: target });
    this.translator = new ProtocolTranslator();
    this.converter = new DataFormatConverter();
    this.latencyOverhead = 0;
  }

  async connect() {
    this.latencyOverhead = Math.floor(50 * PHI); // ~81ms
    return {
      connected: true,
      source: this.source,
      target: this.target,
      latency: this.latencyOverhead,
    };
  }

  async transfer(data, protocol = 'REST') {
    const startTime = Date.now();

    // Convert data format if needed
    const converted = this.converter.convert(data, 'JSON', 'JSON');
    if (!converted.success) return converted;

    // Execute on target platform
    const result = await this.adapter.execute('transfer', {
      data: converted.data,
      protocol,
    });

    const latency = Date.now() - startTime;

    return {
      ...result,
      latency,
      overhead: this.latencyOverhead,
    };
  }
}

export class InteroperabilityEngine {
  constructor({ organismId, platform = 'Web' } = {}) {
    this.organismId = organismId;
    this.platform = platform;
    this.adapter = new PlatformAdapter({ platform });
    this.translator = new ProtocolTranslator();
    this.converter = new DataFormatConverter();
    this.apiMatrix = new APICompatibilityMatrix();
    this.bridges = new Map();
    this.supportedPlatforms = ['Web', 'Node', 'Deno', 'IC', 'Ethereum', 'Solana'];
  }

  // Platform abstraction
  getPlatformCapabilities() {
    return this.adapter.capabilities;
  }

  async executePlatformOperation(operation, params) {
    return this.adapter.execute(operation, params);
  }

  // Protocol translation
  registerProtocolTranslation(source, target, translator) {
    this.translator.registerTranslation(source, target, translator);
  }

  async translateProtocol(data, source, target) {
    return this.translator.translate(data, source, target);
  }

  // Data format conversion
  convertDataFormat(data, sourceFormat, targetFormat) {
    return this.converter.convert(data, sourceFormat, targetFormat);
  }

  // API compatibility
  checkAPICompatibility(api1, api2) {
    return this.apiMatrix.isCompatible(api1, api2);
  }

  selectBestAPI(availableAPIs) {
    return this.apiMatrix.getBestAPI(availableAPIs);
  }

  // Bridge implementation
  async createBridge(targetPlatform) {
    if (!this.supportedPlatforms.includes(targetPlatform)) {
      return { success: false, reason: 'unsupported_platform' };
    }

    const bridge = new Bridge({
      source: this.platform,
      target: targetPlatform,
    });

    await bridge.connect();

    this.bridges.set(targetPlatform, bridge);

    return {
      success: true,
      bridge,
      latency: bridge.latencyOverhead,
    };
  }

  async transferViaBridge(targetPlatform, data, protocol = 'REST') {
    let bridge = this.bridges.get(targetPlatform);

    if (!bridge) {
      const result = await this.createBridge(targetPlatform);
      if (!result.success) return result;
      bridge = result.bridge;
    }

    return bridge.transfer(data, protocol);
  }

  // Cross-platform operations
  async broadcastToPlatforms(data, platforms) {
    const results = await Promise.all(
      platforms.map(platform => this.transferViaBridge(platform, data))
    );

    return {
      platforms: platforms.length,
      successful: results.filter(r => r.success !== false).length,
      results,
    };
  }

  getInteroperabilityStatus() {
    return {
      organismId: this.organismId,
      platform: this.platform,
      capabilities: this.adapter.capabilities.length,
      supportedPlatforms: this.supportedPlatforms.length,
      activeBridges: this.bridges.size,
      protocolTranslations: this.translator.translations.size,
      dataFormats: this.converter.formats.length,
    };
  }
}

export default { PlatformAdapter, ProtocolTranslator, DataFormatConverter, APICompatibilityMatrix, Bridge, InteroperabilityEngine };
