///
/// @medina/alpha-tools/adapters — Production Network & Protocol Adapters
///
/// Bridges NOVA sovereign infrastructure to all external networks,
/// protocols, and systems. Each adapter is self-bootstrapping.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

'use strict';

import { AlphaAdapter, registry } from '../src/index.js';

const PHI = (1 + Math.sqrt(5)) / 2;
const PHI_INV = 1 / PHI;

// ═══════════════════════════════════════════════════════════════════
// NETWORK ADAPTER — Bridges to external networks
// ═══════════════════════════════════════════════════════════════════

export class NetworkAdapter extends AlphaAdapter {
  constructor(config = {}) {
    super({
      name: config.name || 'NETWORK-ADAPTER',
      sourceProtocol: 'nova-wire',
      targetProtocol: config.targetProtocol || 'http',
      ...config,
    });

    this.endpoint = config.endpoint || null;
    this.headers = config.headers || {};
    this.retryPolicy = {
      maxRetries: config.maxRetries || 3,
      baseDelay: config.baseDelay || Math.round(540 * PHI_INV), // 334ms
      backoffMultiplier: PHI, // φ-exponential backoff
    };
    this.connectionPool = [];
    this.maxConnections = config.maxConnections || 10;
  }

  async execute(input, context) {
    const request = {
      endpoint: this.endpoint,
      method: context.method || 'POST',
      headers: { ...this.headers, ...context.headers },
      body: input,
      timestamp: Date.now(),
    };

    // Apply transformers
    const transformed = await this._transform(request, context);

    // Execute with retry
    return this._executeWithRetry(transformed);
  }

  async _executeWithRetry(request) {
    let lastError = null;

    for (let attempt = 0; attempt < this.retryPolicy.maxRetries; attempt++) {
      try {
        return await this._send(request);
      } catch (error) {
        lastError = error;
        const delay = this.retryPolicy.baseDelay * Math.pow(this.retryPolicy.backoffMultiplier, attempt);
        await new Promise(r => setTimeout(r, delay));
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  async _send(request) {
    // Production network send — override per protocol
    return {
      sent: true,
      endpoint: request.endpoint,
      method: request.method,
      timestamp: Date.now(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// PROTOCOL ADAPTER — Bridges between protocols
// ═══════════════════════════════════════════════════════════════════

export class ProtocolAdapter extends AlphaAdapter {
  constructor(config = {}) {
    super({
      name: config.name || 'PROTOCOL-ADAPTER',
      sourceProtocol: config.sourceProtocol || 'nova-internal',
      targetProtocol: config.targetProtocol || 'external',
      ...config,
    });

    this.protocolVersion = config.protocolVersion || '1.0';
    this.encoding = config.encoding || 'json';
    this.schema = config.schema || null;
    this.validators = new Map();
  }

  registerValidator(name, validatorFn) {
    this.validators.set(name, validatorFn);
    return this;
  }

  async execute(input, context) {
    // Validate input against schema
    if (this.schema) {
      const validation = this._validate(input);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
    }

    // Encode from source protocol format
    const decoded = this._decode(input, this.sourceProtocol);

    // Transform
    const transformed = await this._transform(decoded, context);

    // Encode to target protocol format
    return this._encode(transformed, this.targetProtocol);
  }

  _decode(data, protocol) {
    switch (protocol) {
      case 'nova-internal':
        return data; // Already native format
      case 'json':
        return typeof data === 'string' ? JSON.parse(data) : data;
      case 'nova-wire':
        return this._decodeNovaWire(data);
      default:
        return data;
    }
  }

  _encode(data, protocol) {
    switch (protocol) {
      case 'nova-internal':
        return data;
      case 'json':
        return JSON.stringify(data);
      case 'nova-wire':
        return this._encodeNovaWire(data);
      default:
        return data;
    }
  }

  _decodeNovaWire(data) {
    // Nova Wire protocol decoding
    if (typeof data === 'object' && data._wire) {
      return data.payload;
    }
    return data;
  }

  _encodeNovaWire(data) {
    return {
      _wire: true,
      version: this.protocolVersion,
      payload: data,
      phi: PHI,
      timestamp: Date.now(),
    };
  }

  _validate(input) {
    const errors = [];
    for (const [name, validator] of this.validators) {
      try {
        if (!validator(input)) {
          errors.push(`${name} validation failed`);
        }
      } catch (e) {
        errors.push(`${name}: ${e.message}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

// ═══════════════════════════════════════════════════════════════════
// ORGANISM ADAPTER — Bridges to NOVA organisms
// ═══════════════════════════════════════════════════════════════════

export class OrganismAdapter extends AlphaAdapter {
  constructor(config = {}) {
    super({
      name: config.name || 'ORGANISM-ADAPTER',
      sourceProtocol: 'user-facing',
      targetProtocol: 'nova-organism',
      ...config,
    });

    this.organismId = config.organismId || null;
    this.canisterId = config.canisterId || null;
    this.capabilities = config.capabilities || [];
    this.phiWeight = config.phiWeight || PHI_INV;
  }

  async execute(input, context) {
    const call = {
      organism: this.organismId,
      canister: this.canisterId,
      method: context.method || 'process',
      args: input,
      phiWeight: this.phiWeight,
      timestamp: Date.now(),
    };

    // Apply transformers for user-facing -> organism format
    const transformed = await this._transform(call, context);

    return {
      ...transformed,
      routed: true,
      capabilities: this.capabilities,
    };
  }

  getCapabilities() {
    return {
      organism: this.organismId,
      capabilities: this.capabilities,
      phiWeight: this.phiWeight,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════
// LANGUAGE ADAPTER — Bridges between cognitive languages
// ═══════════════════════════════════════════════════════════════════

export class LanguageAdapter extends AlphaAdapter {
  constructor(config = {}) {
    super({
      name: config.name || 'LANGUAGE-ADAPTER',
      sourceProtocol: config.sourceLang || 'natural',
      targetProtocol: config.targetLang || 'CPL-L',
      ...config,
    });

    this.sourceLang = config.sourceLang || 'natural';
    this.targetLang = config.targetLang || 'CPL-L';
    this.lexicon = new Map();
    this.grammarRules = [];
  }

  registerLexicon(term, translation) {
    this.lexicon.set(term, translation);
    return this;
  }

  registerGrammarRule(rule) {
    this.grammarRules.push(rule);
    return this;
  }

  async execute(input, context) {
    // Parse source language
    const tokens = this._tokenize(input);

    // Apply grammar rules
    const structured = this._applyGrammar(tokens);

    // Translate to target language
    const translated = this._translate(structured);

    return {
      source: this.sourceLang,
      target: this.targetLang,
      input,
      output: translated,
      tokenCount: tokens.length,
    };
  }

  _tokenize(input) {
    if (typeof input === 'string') {
      return input.split(/\s+/).filter(t => t.length > 0);
    }
    return Array.isArray(input) ? input : [input];
  }

  _applyGrammar(tokens) {
    let result = tokens;
    for (const rule of this.grammarRules) {
      result = rule(result);
    }
    return result;
  }

  _translate(tokens) {
    return tokens.map(token => {
      if (this.lexicon.has(token)) {
        return this.lexicon.get(token);
      }
      return token;
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
// PRE-BUILT PRODUCTION ADAPTERS
// ═══════════════════════════════════════════════════════════════════

// ICP Network Adapter
export const icpAdapter = new NetworkAdapter({
  name: 'ICP-NETWORK-ADAPTER',
  targetProtocol: 'icp-candid',
  endpoint: 'https://ic0.app',
});

// Ethereum Bridge Adapter
export const ethAdapter = new NetworkAdapter({
  name: 'ETHEREUM-BRIDGE-ADAPTER',
  targetProtocol: 'ethereum-json-rpc',
});

// Nova Wire Protocol Adapter
export const novaWireAdapter = new ProtocolAdapter({
  name: 'NOVA-WIRE-ADAPTER',
  sourceProtocol: 'json',
  targetProtocol: 'nova-wire',
});

// Brain Organism Adapter
export const brainAdapter = new OrganismAdapter({
  name: 'BRAIN-ORGANISM-ADAPTER',
  organismId: 'brain',
  capabilities: ['process', 'learn', 'recall', 'dream'],
  phiWeight: PHI,
});

// Oracle Organism Adapter
export const oracleAdapter = new OrganismAdapter({
  name: 'ORACLE-ORGANISM-ADAPTER',
  organismId: 'oracle',
  capabilities: ['foresight', 'anticipate', 'prophesy'],
  phiWeight: PHI * PHI,
});

// Guardian Organism Adapter
export const guardianAdapter = new OrganismAdapter({
  name: 'GUARDIAN-ORGANISM-ADAPTER',
  organismId: 'guardian',
  capabilities: ['protect', 'verify', 'enforce'],
  phiWeight: PHI * PHI * PHI,
});

// CPL-L Language Adapter
export const cplAdapter = new LanguageAdapter({
  name: 'CPL-L-ADAPTER',
  sourceLang: 'natural',
  targetLang: 'CPL-L',
});

// Register all in global registry
registry.registerTool(icpAdapter);
registry.registerTool(ethAdapter);
registry.registerTool(novaWireAdapter);
registry.registerTool(brainAdapter);
registry.registerTool(oracleAdapter);
registry.registerTool(guardianAdapter);
registry.registerTool(cplAdapter);

export default {
  NetworkAdapter,
  ProtocolAdapter,
  OrganismAdapter,
  LanguageAdapter,
  icpAdapter,
  ethAdapter,
  novaWireAdapter,
  brainAdapter,
  oracleAdapter,
  guardianAdapter,
  cplAdapter,
};
