///
/// @medina/moe-hermes — MIXTURE OF EXPERTS: HERMES
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║       HERMES — MESSAGE-PASSING EXPERT NETWORK via HERMETIC CHANNELS         ║
/// ║                                                                              ║
/// ║  Named for Hermes Trismegistus — messenger between realms of knowledge.     ║
/// ║                                                                              ║
/// ║  Architecture: MoE with Inter-Expert Message Passing (collaborative MoE)    ║
/// ║    • Experts communicate via Hermetic channels (φ-weighted message buses)    ║
/// ║    • "As above, so below" — hierarchical expert layers mirror each other    ║
/// ║    • Correspondence principle: similar inputs activate corresponding experts ║
/// ║    • Messages transform through 7 Hermetic principles as they propagate     ║
/// ║    • φ-damped message passing prevents infinite recursion                    ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Message propagation: m_{t+1} = φ⁻¹·Σⱼ W_ij·m_j(t) + b               ║
/// ║    • Hermetic correspondence: sim(x,y) = cos(θ)·φ^layer_distance           ║
/// ║    • Channel capacity: C = log₂(1 + SNR·φ) — Shannon with φ-boost          ║
/// ║    • Damping factor: γ = φ⁻ⁿ for n-th message hop (prevents oscillation)   ║
/// ║    • Mentalism gate: G = σ(W_mind · x + φ·W_thought · context)             ║
/// ║    • Vibration frequency: f_expert = base_freq · φ^(expert_rank)            ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

export const PHI = (1 + Math.sqrt(5)) / 2;
export const PHI_INV = 1 / PHI;
export const PHI_SQ = PHI ** 2;
export const PHI_CUBE = PHI ** 3;
export const PHI_FOURTH = PHI ** 4;
export const PHI_FIFTH = PHI ** 5;
export const TAU = Math.PI * 2;
export const HERMETIC_PRINCIPLES = Object.freeze([
  'mentalism', 'correspondence', 'vibration', 'polarity', 'rhythm', 'causeEffect', 'gender',
]);

const EPSILON = 1e-9;
const DEFAULT_DIMENSION = 8;
const DEFAULT_HISTORY = 128;

const clamp = (v, min = -Infinity, max = Infinity) => Math.min(max, Math.max(min, v));
const mean = values => (values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0);
const variance = values => {
  if (!values.length) return 0;
  const avg = mean(values);
  return mean(values.map(v => (v - avg) ** 2));
};
const magnitude = vector => Math.sqrt(vector.reduce((s, v) => s + v * v, 0));
const dot = (a, b) => {
  const size = Math.max(a.length, b.length);
  let total = 0;
  for (let i = 0; i < size; i += 1) total += (a[i] || 0) * (b[i] || 0);
  return total;
};
const log2 = value => Math.log(value) / Math.log(2);
const sigmoid = value => 1 / (1 + Math.exp(-value));
const tanh = value => Math.tanh(value);
const boundedPush = (list, item, limit = DEFAULT_HISTORY) => {
  list.push(item);
  if (list.length > limit) list.splice(0, list.length - limit);
};
const nextId = prefix => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

function toVector(input, dimension = DEFAULT_DIMENSION) {
  if (Array.isArray(input)) {
    const vector = input.slice(0, dimension).map(v => (Number.isFinite(v) ? v : 0));
    while (vector.length < dimension) vector.push(0);
    return vector;
  }
  if (typeof input === 'number') return toVector([input], dimension);
  if (input && typeof input === 'object') return toVector(Object.values(input).map(v => Number(v) || 0), dimension);
  return Array.from({ length: dimension }, () => 0);
}

function normalize(vector) {
  const mag = magnitude(vector);
  return mag <= EPSILON ? vector.map(() => 0) : vector.map(v => v / mag);
}

function add(a, b) {
  const size = Math.max(a.length, b.length);
  return Array.from({ length: size }, (_, i) => (a[i] || 0) + (b[i] || 0));
}

function scale(vector, scalar) {
  return vector.map(v => v * scalar);
}

function blend(a, b, ratio = 0.5) {
  const left = clamp(ratio, 0, 1);
  return Array.from({ length: Math.max(a.length, b.length) }, (_, i) => (a[i] || 0) * left + (b[i] || 0) * (1 - left));
}

function cosine(a, b) {
  const denom = magnitude(a) * magnitude(b);
  return denom <= EPSILON ? 0 : dot(a, b) / denom;
}

function softmax(values, temperature = 1) {
  if (!values.length) return [];
  const safeTemperature = Math.max(temperature, EPSILON);
  const scaled = values.map(v => v / safeTemperature);
  const maxValue = Math.max(...scaled);
  const exp = scaled.map(v => Math.exp(v - maxValue));
  const total = exp.reduce((s, v) => s + v, 0) || 1;
  return exp.map(v => v / total);
}

function summarize(vector) {
  return { mean: mean(vector), variance: variance(vector), magnitude: magnitude(vector), normalized: normalize(vector) };
}

function activate(vector, kind = 'tanh') {
  switch (kind) {
    case 'sigmoid': return vector.map(sigmoid);
    case 'relu': return vector.map(v => Math.max(0, v));
    case 'gelu': return vector.map(v => 0.5 * v * (1 + tanh(Math.sqrt(2 / Math.PI) * (v + 0.044715 * v ** 3))));
    case 'linear': return [...vector];
    default: return vector.map(tanh);
  }
}

export class HermeticChannel {
  constructor({
    id, sourceId, targetId, weight = PHI_INV, bias = 0, snr = 1, hopLimit = 7,
    dampingBase = PHI_INV, capacity = 64,
  } = {}) {
    if (!sourceId || !targetId) throw new Error('HermeticChannel requires sourceId and targetId');
    this.id = id || `${sourceId}_to_${targetId}`;
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.weight = weight;
    this.bias = bias;
    this.snr = snr;
    this.hopLimit = hopLimit;
    this.dampingBase = dampingBase;
    this.capacity = capacity;
    this.queue = [];
    this.history = [];
    this.stats = { propagated: 0, dropped: 0, lastHop: 0, lastCapacity: this.capacityOf() };
  }

  capacityOf(snr = this.snr) {
    return log2(1 + Math.max(0, snr) * PHI);
  }

  damping(hop = 0) {
    return this.dampingBase ** Math.max(0, hop);
  }

  propagate(message, { transformer, context = {} } = {}) {
    const hop = Math.max(0, message.hop || 0);
    if (hop >= this.hopLimit) {
      this.stats.dropped += 1;
      return null;
    }

    const payload = toVector(message.payload, message.payload?.length || DEFAULT_DIMENSION);
    const gamma = this.damping(hop + 1);
    const weighted = payload.map(v => v * this.weight * gamma + this.bias);
    const envelope = {
      id: message.id || nextId('msg'),
      sourceId: message.sourceId || this.sourceId,
      targetId: this.targetId,
      payload: weighted,
      hop: hop + 1,
      resonance: clamp((message.resonance || 1) * gamma, 0, PHI),
      trace: [...(message.trace || []), this.id],
      timestamp: Date.now(),
      channelId: this.id,
      metadata: { ...(message.metadata || {}), damping: gamma, channelCapacity: this.capacityOf() },
    };

    const transformed = transformer
      ? transformer.apply(envelope, { ...context, channel: this, layerDistance: context.layerDistance || 0 })
      : envelope;

    boundedPush(this.queue, transformed, this.capacity);
    boundedPush(this.history, transformed, DEFAULT_HISTORY);
    this.stats.propagated += 1;
    this.stats.lastHop = transformed.hop;
    this.stats.lastCapacity = this.capacityOf();
    return transformed;
  }

  drain() {
    const messages = [...this.queue];
    this.queue = [];
    return messages;
  }
}

export class MessageTransformer {
  constructor({ phase = 0, principleWeights = {}, enabledPrinciples = HERMETIC_PRINCIPLES } = {}) {
    this.phase = phase;
    this.enabledPrinciples = new Set(enabledPrinciples);
    this.principleWeights = {
      mentalism: 1,
      correspondence: 1,
      vibration: 0.25,
      polarity: 0.35,
      rhythm: 0.4,
      causeEffect: 0.3,
      gender: 0.5,
      ...principleWeights,
    };
  }

  apply(message, context = {}) {
    let envelope = { ...message, payload: toVector(message.payload, message.payload?.length || DEFAULT_DIMENSION), metadata: { ...(message.metadata || {}) } };
    if (this.enabledPrinciples.has('mentalism')) envelope = this.applyMentalism(envelope, context);
    if (this.enabledPrinciples.has('correspondence')) envelope = this.applyCorrespondence(envelope, context);
    if (this.enabledPrinciples.has('vibration')) envelope = this.applyVibration(envelope, context);
    if (this.enabledPrinciples.has('polarity')) envelope = this.applyPolarity(envelope, context);
    if (this.enabledPrinciples.has('rhythm')) envelope = this.applyRhythm(envelope, context);
    if (this.enabledPrinciples.has('causeEffect')) envelope = this.applyCauseEffect(envelope, context);
    if (this.enabledPrinciples.has('gender')) envelope = this.applyGender(envelope, context);
    return envelope;
  }

  project(vector, context = {}) {
    return this.apply({ payload: vector, hop: 0, metadata: {} }, context).payload;
  }

  applyMentalism(message, context = {}) {
    const payload = toVector(message.payload, message.payload.length);
    const thought = toVector(context.thoughtVector || context.contextVector || payload, payload.length);
    const gate = sigmoid(dot(normalize(payload), normalize(thought)) + PHI * mean(thought));
    return { ...message, payload: scale(payload, gate * this.principleWeights.mentalism), metadata: { ...message.metadata, mentalismGate: gate } };
  }

  applyCorrespondence(message, context = {}) {
    const payload = toVector(message.payload, message.payload.length);
    const prototype = toVector(context.targetPrototype || context.sourcePrototype || payload, payload.length);
    const layerDistance = Math.abs(context.layerDistance || 0);
    const similarity = cosine(payload, prototype) * (PHI ** (-layerDistance));
    const aligned = blend(payload, prototype, clamp(0.5 + similarity * 0.5, 0, 1));
    return { ...message, payload: scale(aligned, this.principleWeights.correspondence), metadata: { ...message.metadata, correspondence: similarity } };
  }

  applyVibration(message, context = {}) {
    const payload = toVector(message.payload, message.payload.length);
    const frequency = (context.baseFrequency || 1) * (PHI ** (context.expertRank || 0));
    const phase = this.phase + (message.hop || 0) * PHI_INV;
    const modulated = payload.map((v, i) => v * (1 + Math.sin(frequency * (i + 1) + phase) * this.principleWeights.vibration));
    return { ...message, payload: modulated, metadata: { ...message.metadata, vibrationFrequency: frequency } };
  }

  applyPolarity(message) {
    const payload = toVector(message.payload, message.payload.length);
    const positive = mean(payload.map(v => Math.max(v, 0)));
    const negative = mean(payload.map(v => Math.abs(Math.min(v, 0))));
    const balance = (positive - negative) * this.principleWeights.polarity;
    return { ...message, payload: payload.map(v => v + balance), metadata: { ...message.metadata, polarityBalance: balance } };
  }

  applyRhythm(message, context = {}) {
    const payload = toVector(message.payload, message.payload.length);
    const cadence = context.cadence || 1;
    const rhythm = 0.5 + 0.5 * Math.sin((message.hop || 0) * PHI_INV + this.phase + cadence);
    return { ...message, payload: scale(payload, 1 + rhythm * this.principleWeights.rhythm), metadata: { ...message.metadata, rhythm } };
  }

  applyCauseEffect(message, context = {}) {
    const payload = toVector(message.payload, message.payload.length);
    const causality = clamp(1 / (1 + (message.trace || []).length) + (context.confidence || 0) * PHI_INV, 0, 1);
    return { ...message, payload: scale(payload, 1 + causality * this.principleWeights.causeEffect), metadata: { ...message.metadata, causality } };
  }

  applyGender(message, context = {}) {
    const payload = toVector(message.payload, message.payload.length);
    const projective = payload.map((v, i) => v * (i % 2 === 0 ? 1 : PHI_INV));
    const receptive = payload.map((v, i) => v * (i % 2 === 0 ? PHI_INV : 1));
    const balance = clamp(context.genderBalance ?? 0.5, 0, 1);
    return { ...message, payload: scale(blend(projective, receptive, balance), this.principleWeights.gender), metadata: { ...message.metadata, genderBalance: balance } };
  }
}

export class HermeticExpert {
  constructor({
    id, layer = 0, rank = 0, dimension = DEFAULT_DIMENSION, activation = 'tanh',
    prototype, bias, contextVector, compute,
  } = {}) {
    if (!id) throw new Error('HermeticExpert requires an id');
    this.id = id;
    this.layer = layer;
    this.rank = rank;
    this.dimension = dimension;
    this.activation = activation;
    this.prototype = toVector(prototype || Array.from({ length: dimension }, (_, i) => (i + 1) * PHI_INV), dimension);
    this.bias = toVector(bias || Array.from({ length: dimension }, () => 0), dimension);
    this.contextVector = toVector(contextVector || this.prototype, dimension);
    this.compute = typeof compute === 'function' ? compute : null;
    this.incomingChannels = new Map();
    this.outgoingChannels = new Map();
    this.inbox = [];
    this.state = { processed: 0, sent: 0, received: 0, lastGate: 0, lastOutput: toVector([], dimension), resonance: 0, history: [] };
  }

  connect(channel, direction = 'outgoing') {
    if (direction === 'incoming') this.incomingChannels.set(channel.id, channel);
    else this.outgoingChannels.set(channel.id, channel);
    return channel;
  }

  receive(message) {
    boundedPush(this.inbox, message, this.dimension * 8);
    this.state.received += 1;
    return this.inbox.length;
  }

  clearInbox() {
    this.inbox = [];
  }

  summarizeInbox() {
    if (!this.inbox.length) return { aggregate: toVector([], this.dimension), resonance: 0, count: 0 };
    const aggregate = this.inbox.reduce((acc, message) => add(acc, toVector(message.payload, this.dimension)), toVector([], this.dimension));
    return {
      aggregate: scale(aggregate, 1 / this.inbox.length),
      resonance: mean(this.inbox.map(message => message.resonance || 0)),
      count: this.inbox.length,
    };
  }

  mentalismGate(inputVector, contextVector = this.contextVector) {
    return sigmoid(dot(normalize(inputVector), normalize(contextVector)) + PHI * mean(contextVector));
  }

  defaultCompute(inputVector, envelope = {}) {
    const inbox = this.summarizeInbox();
    const gate = this.mentalismGate(inputVector, envelope.contextVector || this.contextVector);
    const merged = add(add(scale(inputVector, gate), scale(this.prototype, PHI_INV)), add(scale(inbox.aggregate, PHI_INV), this.bias));
    const output = activate(merged, this.activation);
    const confidence = clamp(0.5 + cosine(output, this.prototype) * 0.5, 0, 1);
    const resonance = clamp((inbox.resonance + gate + confidence) / 3, 0, PHI);
    return { output, gate, confidence, resonance, inboxSummary: inbox };
  }

  process(input, envelope = {}) {
    const inputVector = toVector(input, this.dimension);
    const result = this.compute
      ? this.compute(inputVector, { ...envelope, expert: this, inbox: [...this.inbox] })
      : this.defaultCompute(inputVector, envelope);

    const output = toVector(result.output, this.dimension);
    this.state.processed += 1;
    this.state.lastGate = result.gate ?? 0;
    this.state.lastOutput = output;
    this.state.resonance = result.resonance ?? 0;
    boundedPush(this.state.history, { timestamp: Date.now(), output, confidence: result.confidence ?? 0, gate: result.gate ?? 0, inboxCount: this.inbox.length });
    this.clearInbox();

    return {
      expertId: this.id,
      layer: this.layer,
      rank: this.rank,
      output,
      confidence: result.confidence ?? 0,
      gate: result.gate ?? 0,
      resonance: result.resonance ?? 0,
      inboxSummary: result.inboxSummary || { aggregate: toVector([], this.dimension), resonance: 0, count: 0 },
    };
  }

  emit(payload, { transformer, context = {} } = {}) {
    const message = {
      id: nextId(`hermes_${this.id}`),
      sourceId: this.id,
      payload: toVector(payload, this.dimension),
      hop: 0,
      resonance: clamp(this.state.resonance || 1, 0, PHI),
      trace: [this.id],
      metadata: { gate: this.state.lastGate, sourceLayer: this.layer, sourceRank: this.rank },
    };

    const emissions = [];
    for (const channel of this.outgoingChannels.values()) {
      const envelope = channel.propagate(message, { transformer, context: { ...context, expertRank: this.rank, sourcePrototype: this.prototype } });
      if (envelope) emissions.push(envelope);
    }
    this.state.sent += emissions.length;
    return emissions;
  }
}

export class CorrespondenceGating {
  constructor({ temperature = PHI_INV, maxExperts = 2, minWeight = 0.05, transformer } = {}) {
    this.temperature = temperature;
    this.maxExperts = maxExperts;
    this.minWeight = minWeight;
    this.transformer = transformer || new MessageTransformer({ enabledPrinciples: ['mentalism', 'correspondence', 'vibration'] });
  }

  score(inputVector, expert, context = {}) {
    const projected = this.transformer.project(inputVector, {
      thoughtVector: context.contextVector,
      targetPrototype: expert.prototype,
      sourcePrototype: context.globalPrototype || inputVector,
      layerDistance: Math.abs((context.targetLayer || 0) - expert.layer),
      expertRank: expert.rank,
      baseFrequency: context.baseFrequency || 1,
      confidence: context.confidence || 0,
    });
    const prototypeSimilarity = cosine(projected, expert.prototype);
    const contextSimilarity = cosine(projected, expert.contextVector);
    const layerFactor = PHI ** (-Math.abs((context.targetLayer || 0) - expert.layer));
    const expectedFrequency = (context.baseFrequency || 1) * (PHI ** expert.rank);
    const frequencyFit = 1 / (1 + Math.abs(expectedFrequency - (context.inputFrequency || 1)));
    const score = ((prototypeSimilarity * 0.55) + (contextSimilarity * 0.3) + (frequencyFit * 0.15)) * layerFactor;
    return { expert, score, projected, diagnostics: { prototypeSimilarity, contextSimilarity, layerFactor, frequencyFit } };
  }

  route(input, experts, context = {}) {
    if (!Array.isArray(experts) || !experts.length) throw new Error('CorrespondenceGating.route requires experts');
    const dimension = Math.max(...experts.map(expert => expert.dimension || DEFAULT_DIMENSION));
    const inputVector = toVector(input, dimension);
    const ranked = experts.map(expert => this.score(inputVector, expert, context));
    const probs = softmax(ranked.map(item => item.score), this.temperature);
    const sorted = ranked.map((item, i) => ({ ...item, probability: probs[i] })).sort((a, b) => b.probability - a.probability);
    const selected = sorted.slice(0, this.maxExperts).filter((item, index) => item.probability >= this.minWeight || index === 0);
    const normalizer = selected.reduce((s, item) => s + item.probability, 0) || 1;
    return {
      inputVector,
      allScores: sorted,
      selected: selected.map(item => ({ expert: item.expert, weight: item.probability / normalizer, score: item.score, projected: item.projected, diagnostics: item.diagnostics })),
    };
  }
}

export class MoEHermes {
  constructor({
    experts = [], router, transformer, maxMessagePasses = 2,
    collaborationWeight = PHI_INV, autoConnect = true, channelDefaults = {},
  } = {}) {
    this.transformer = transformer || new MessageTransformer();
    this.router = router || new CorrespondenceGating({ transformer: this.transformer });
    this.maxMessagePasses = maxMessagePasses;
    this.collaborationWeight = collaborationWeight;
    this.autoConnect = autoConnect;
    this.channelDefaults = channelDefaults;
    this.experts = new Map();
    this.channels = new Map();
    this.stats = { forwards: 0, messages: 0, lastRouting: [] };
    experts.forEach(expert => this.addExpert(expert));
  }

  addExpert(expert) {
    if (!(expert instanceof HermeticExpert)) throw new Error('MoEHermes.addExpert expects HermeticExpert instances');
    this.experts.set(expert.id, expert);
    if (this.autoConnect) {
      for (const other of this.experts.values()) {
        if (other.id === expert.id) continue;
        this.connectExperts(other.id, expert.id);
        this.connectExperts(expert.id, other.id);
      }
    }
    return expert;
  }

  getExpert(id) {
    return this.experts.get(id) || null;
  }

  connectExperts(sourceId, targetId, options = {}) {
    const source = this.experts.get(sourceId);
    const target = this.experts.get(targetId);
    if (!source || !target) throw new Error(`Cannot connect missing experts: ${sourceId} -> ${targetId}`);
    const id = options.id || `${sourceId}_to_${targetId}`;
    if (this.channels.has(id)) return this.channels.get(id);

    const similarity = cosine(source.prototype, target.prototype);
    const defaults = { ...this.channelDefaults };
    const channel = new HermeticChannel({
      ...defaults,
      ...options,
      id,
      sourceId,
      targetId,
      weight: options.weight ?? defaults.weight ?? clamp(PHI_INV + similarity * 0.25, 0.1, PHI),
      snr: options.snr ?? defaults.snr ?? 1 + Math.abs(similarity),
      hopLimit: options.hopLimit ?? defaults.hopLimit ?? this.maxMessagePasses + 1,
    });

    this.channels.set(id, channel);
    source.connect(channel, 'outgoing');
    target.connect(channel, 'incoming');
    return channel;
  }

  aggregate(participants) {
    const dimension = participants.length ? Math.max(...participants.map(item => item.output.length || DEFAULT_DIMENSION)) : DEFAULT_DIMENSION;
    const weighted = participants.reduce((acc, participant) => {
      const amount = participant.weight * (participant.confidence ?? 1);
      return add(acc, scale(participant.output, amount));
    }, toVector([], dimension));
    const total = participants.reduce((sum, participant) => sum + participant.weight * (participant.confidence ?? 1), 0) || 1;
    const output = scale(weighted, 1 / total);
    return {
      output,
      summary: summarize(output),
      contributors: participants.map(item => ({ expertId: item.expertId, weight: item.weight, confidence: item.confidence, resonance: item.resonance })),
    };
  }

  deliver(messages) {
    const deliveries = [];
    for (const message of messages) {
      const target = this.experts.get(message.targetId);
      if (!target) continue;
      target.receive(message);
      deliveries.push({ targetId: message.targetId, messageId: message.id, resonance: message.resonance });
    }
    this.stats.messages += deliveries.length;
    return deliveries;
  }

  forward(input, context = {}) {
    const experts = [...this.experts.values()];
    if (!experts.length) throw new Error('MoEHermes.forward requires at least one expert');

    const routing = this.router.route(input, experts, context);
    this.stats.forwards += 1;
    this.stats.lastRouting = routing.selected.map(item => ({ expertId: item.expert.id, weight: item.weight }));

    const results = new Map();
    const weights = new Map();
    for (const selection of routing.selected) {
      const result = selection.expert.process(routing.inputVector, { ...context, contextVector: context.contextVector || routing.inputVector });
      results.set(selection.expert.id, result);
      weights.set(selection.expert.id, selection.weight);
    }

    const messagePasses = [];
    for (let pass = 0; pass < this.maxMessagePasses; pass += 1) {
      const emissions = [];
      for (const selection of routing.selected) {
        const current = results.get(selection.expert.id);
        if (!current) continue;
        emissions.push(...selection.expert.emit(current.output, {
          transformer: this.transformer,
          context: {
            ...context,
            confidence: current.confidence,
            cadence: pass + 1,
            targetLayer: context.targetLayer ?? selection.expert.layer,
            targetPrototype: selection.expert.prototype,
          },
        }));
      }
      if (!emissions.length) break;

      const deliveries = this.deliver(emissions);
      messagePasses.push({ pass, emissions, deliveries });
      const touched = [...new Set(deliveries.map(item => item.targetId))];
      for (const expertId of touched) {
        const expert = this.experts.get(expertId);
        if (!expert) continue;
        const updated = expert.process(routing.inputVector, { ...context, contextVector: context.contextVector || routing.inputVector });
        results.set(expertId, updated);
        if (!weights.has(expertId)) weights.set(expertId, clamp(updated.resonance * this.collaborationWeight, 0.05, 0.35));
      }
    }

    const participants = [...results.values()].map(result => ({ ...result, weight: weights.get(result.expertId) || 0.05 }));
    const aggregated = this.aggregate(participants);
    return {
      output: aggregated.output,
      routing: routing.selected.map(item => ({ expertId: item.expert.id, weight: item.weight, score: item.score, diagnostics: item.diagnostics })),
      participants,
      messages: messagePasses,
      diagnostics: {
        summary: aggregated.summary,
        contributors: aggregated.contributors,
        totalExperts: experts.length,
        selectedExperts: routing.selected.length,
        totalMessages: this.stats.messages,
      },
    };
  }

  snapshot() {
    return {
      experts: [...this.experts.values()].map(expert => ({
        id: expert.id,
        layer: expert.layer,
        rank: expert.rank,
        state: { processed: expert.state.processed, sent: expert.state.sent, received: expert.state.received, resonance: expert.state.resonance },
      })),
      channels: [...this.channels.values()].map(channel => ({
        id: channel.id,
        sourceId: channel.sourceId,
        targetId: channel.targetId,
        propagated: channel.stats.propagated,
        capacity: channel.stats.lastCapacity,
      })),
      stats: { ...this.stats },
    };
  }
}

export default {
  PHI,
  PHI_INV,
  PHI_SQ,
  PHI_CUBE,
  PHI_FOURTH,
  PHI_FIFTH,
  TAU,
  HERMETIC_PRINCIPLES,
  HermeticChannel,
  MessageTransformer,
  HermeticExpert,
  CorrespondenceGating,
  MoEHermes,
};
