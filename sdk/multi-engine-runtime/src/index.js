///
/// @medina/multi-engine-runtime — Backend Multi-Engine System
///
/// WebWorkers, ServiceWorkers, Protocol Adapters for autonomous operations
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from '@medina/medina-heart';

// WebWorker Engine (browser-based parallel execution)
export class WebWorkerEngine {
  constructor({ workerScript, poolSize = 4 } = {}) {
    this.workers = [];
    this.taskQueue = [];
    this.activeJobs = new Map();

    // Initialize worker pool
    for (let i = 0; i < poolSize; i++) {
      if (typeof Worker !== 'undefined' && workerScript) {
        const worker = new Worker(workerScript);
        worker.onmessage = (e) => this._handleWorkerMessage(i, e);
        this.workers.push({ id: i, worker, busy: false });
      }
    }

    console.log(`⚙️ WebWorkerEngine initialized with ${this.workers.length} workers`);
  }

  execute(task) {
    return new Promise((resolve, reject) => {
      const job = { id: Date.now(), task, resolve, reject };
      this.taskQueue.push(job);
      this._processQueue();
    });
  }

  _processQueue() {
    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker || this.taskQueue.length === 0) return;

    const job = this.taskQueue.shift();
    availableWorker.busy = true;
    this.activeJobs.set(availableWorker.id, job);

    availableWorker.worker.postMessage(job.task);
  }

  _handleWorkerMessage(workerId, event) {
    const job = this.activeJobs.get(workerId);
    if (job) {
      job.resolve(event.data);
      this.activeJobs.delete(workerId);

      const worker = this.workers.find(w => w.id === workerId);
      if (worker) worker.busy = false;

      this._processQueue();
    }
  }
}

// ServiceWorker Manager (offline-first AI)
export class ServiceWorkerManager {
  constructor({ swPath = '/sw.js' } = {}) {
    this.swPath = swPath;
    this.registration = null;
    this.ready = false;

    console.log(`📡 ServiceWorkerManager initialized`);
  }

  async register() {
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) {
      console.warn('ServiceWorker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register(this.swPath);
      this.ready = true;
      console.log('✅ ServiceWorker registered');
      return true;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      return false;
    }
  }

  async sendMessage(message) {
    if (!this.registration || !this.registration.active) {
      throw new Error('ServiceWorker not ready');
    }

    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => resolve(event.data);
      this.registration.active.postMessage(message, [channel.port2]);
    });
  }

  async cacheOrganism(organismId, data) {
    return this.sendMessage({
      type: 'CACHE_ORGANISM',
      organismId,
      data,
    });
  }

  async getOfflineOrganisms() {
    return this.sendMessage({ type: 'GET_OFFLINE_ORGANISMS' });
  }
}

// SharedWorker Coordinator (cross-tab coordination)
export class SharedWorkerCoordinator {
  constructor({ workerPath } = {}) {
    this.worker = null;
    this.port = null;
    this.callbacks = new Map();

    if (typeof SharedWorker !== 'undefined' && workerPath) {
      this.worker = new SharedWorker(workerPath);
      this.port = this.worker.port;
      this.port.start();
      this.port.onmessage = (e) => this._handleMessage(e);
    }

    console.log(`🔗 SharedWorkerCoordinator initialized`);
  }

  send(message, callback) {
    const id = Date.now();
    this.callbacks.set(id, callback);
    this.port.postMessage({ id, ...message });
  }

  _handleMessage(event) {
    const { id, ...data } = event.data;
    const callback = this.callbacks.get(id);
    if (callback) {
      callback(data);
      this.callbacks.delete(id);
    }
  }

  broadcastToTabs(message) {
    this.send({ type: 'BROADCAST', message });
  }
}

// Protocol Adapters
export class ProtocolAdapter {
  constructor({ protocol = 'REST' } = {}) {
    this.protocol = protocol;
    this.handlers = new Map();

    console.log(`🔌 ProtocolAdapter (${protocol}) initialized`);
  }

  registerHandler(method, handler) {
    this.handlers.set(method, handler);
  }

  async handle(request) {
    const handler = this.handlers.get(request.method);
    if (!handler) {
      throw new Error(`No handler for method: ${request.method}`);
    }

    return handler(request);
  }
}

// REST Adapter
export class RESTAdapter extends ProtocolAdapter {
  constructor() {
    super({ protocol: 'REST' });
  }

  async fetch(url, options = {}) {
    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      console.error('REST fetch error:', error);
      throw error;
    }
  }
}

// GraphQL Adapter
export class GraphQLAdapter extends ProtocolAdapter {
  constructor({ endpoint }) {
    super({ protocol: 'GraphQL' });
    this.endpoint = endpoint;
  }

  async query(query, variables = {}) {
    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();
    if (result.errors) {
      throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }
}

// WebSocket Adapter (real-time)
export class WebSocketAdapter extends ProtocolAdapter {
  constructor({ url }) {
    super({ protocol: 'WebSocket' });
    this.url = url;
    this.ws = null;
    this.messageHandlers = [];
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        resolve();
      };
      this.ws.onerror = (error) => reject(error);
      this.ws.onmessage = (event) => this._handleMessage(event);
    });
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  _handleMessage(event) {
    const data = JSON.parse(event.data);
    for (const handler of this.messageHandlers) {
      handler(data);
    }
  }
}

// Event Stream Processor
export class EventStreamProcessor {
  constructor() {
    this.streams = new Map();
    this.subscribers = new Map();

    console.log(`📊 EventStreamProcessor initialized`);
  }

  createStream(streamId) {
    this.streams.set(streamId, []);
    this.subscribers.set(streamId, []);
    return streamId;
  }

  publish(streamId, event) {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    stream.push({ ...event, timestamp: Date.now() });

    // Notify subscribers
    const subscribers = this.subscribers.get(streamId) || [];
    for (const callback of subscribers) {
      callback(event);
    }
  }

  subscribe(streamId, callback) {
    if (!this.subscribers.has(streamId)) {
      this.subscribers.set(streamId, []);
    }

    this.subscribers.get(streamId).push(callback);

    return () => {
      const subs = this.subscribers.get(streamId);
      const index = subs.indexOf(callback);
      if (index > -1) subs.splice(index, 1);
    };
  }

  getEvents(streamId, limit = 100) {
    const stream = this.streams.get(streamId) || [];
    return stream.slice(-limit);
  }
}

// Multi-Engine Runtime (coordinates all engines)
export class MultiEngineRuntime {
  constructor() {
    this.webWorkerEngine = null;
    this.serviceWorkerManager = new ServiceWorkerManager();
    this.sharedWorkerCoordinator = null;
    this.adapters = new Map();
    this.eventProcessor = new EventStreamProcessor();

    console.log(`🚀 MultiEngineRuntime initialized`);
  }

  async initialize({ webWorkerScript, sharedWorkerPath } = {}) {
    // Initialize WebWorker pool
    if (webWorkerScript) {
      this.webWorkerEngine = new WebWorkerEngine({ workerScript: webWorkerScript });
    }

    // Register ServiceWorker
    await this.serviceWorkerManager.register();

    // Initialize SharedWorker
    if (sharedWorkerPath) {
      this.sharedWorkerCoordinator = new SharedWorkerCoordinator({ workerPath: sharedWorkerPath });
    }

    // Register default adapters
    this.registerAdapter('REST', new RESTAdapter());

    console.log('✅ MultiEngineRuntime fully initialized');
  }

  registerAdapter(name, adapter) {
    this.adapters.set(name, adapter);
  }

  getAdapter(name) {
    return this.adapters.get(name);
  }

  async executeInWorker(task) {
    if (!this.webWorkerEngine) {
      throw new Error('WebWorkerEngine not initialized');
    }

    return this.webWorkerEngine.execute(task);
  }

  getStatus() {
    return {
      webWorkers: this.webWorkerEngine ? this.webWorkerEngine.workers.length : 0,
      serviceWorkerReady: this.serviceWorkerManager.ready,
      sharedWorkerReady: !!this.sharedWorkerCoordinator,
      adapters: Array.from(this.adapters.keys()),
      eventStreams: this.eventProcessor.streams.size,
    };
  }
}

export default {
  WebWorkerEngine,
  ServiceWorkerManager,
  SharedWorkerCoordinator,
  ProtocolAdapter,
  RESTAdapter,
  GraphQLAdapter,
  WebSocketAdapter,
  EventStreamProcessor,
  MultiEngineRuntime,
};
