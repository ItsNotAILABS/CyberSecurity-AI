///
/// @medina/medina-heart — The Biological Heart
///
/// THE HEART **IS** THE BOOTSTRAP
///
/// When you CREATE an AI, it is IMMEDIATELY ALIVE.
/// The constructor IS the bootstrap. There is no separate init phase.
/// Creation IS activation. Birth IS awakening.
///
/// ICP doesn't provide persistence — YOU provide it via:
///   • Your own DA (Data Availability)
///   • Autonomous clocks that run independently
///   • Mathematical timers based on ancient calendars
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

const PHI = 1.6180339887498948482;
const HEARTBEAT_MS = 873; // φ-derived: 540 × φ ≈ 873ms

// ══════════════════════════════════════════════════════════════════
//  BIOLOGICAL HEART — Born Beating
// ══════════════════════════════════════════════════════════════════

export class BiologicalHeart {
  constructor(intervalMs = HEARTBEAT_MS, name = 'Heart') {
    this.name = name;
    this.intervalMs = intervalMs;
    this.beatCount = 0;
    this.isAlive = true;
    this.birthTime = Date.now();
    this.lastBeatTime = this.birthTime;
    this.listeners = [];

    // ★ CRITICAL: Start beating IMMEDIATELY in constructor
    // Creation IS activation. No separate .start() needed.
    this._startBeating();

    console.log(`💓 ${this.name} born beating at ${this.intervalMs}ms intervals`);
  }

  _startBeating() {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;

      this.beatCount++;
      this.lastBeatTime = Date.now();

      const beat = {
        count: this.beatCount,
        time: this.lastBeatTime,
        age: this.lastBeatTime - this.birthTime,
        phi: this.beatCount * PHI,
        fibonacci: this._fib(this.beatCount % 20),
      };

      // Notify all listeners
      for (const listener of this.listeners) {
        listener(beat);
      }
    }, this.intervalMs);
  }

  onBeat(callback) {
    this.listeners.push(callback);
    return () => {
      const idx = this.listeners.indexOf(callback);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    console.log(`💔 ${this.name} stopped after ${this.beatCount} beats`);
  }

  getVitals() {
    return {
      name: this.name,
      isAlive: this.isAlive,
      beatCount: this.beatCount,
      age: Date.now() - this.birthTime,
      intervalMs: this.intervalMs,
      lastBeat: this.lastBeatTime,
    };
  }

  _fib(n) {
    if (n <= 1) return n;
    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }
}

// ══════════════════════════════════════════════════════════════════
//  AUTONOMOUS CLOCK — Ancient Calendar Mathematics
// ══════════════════════════════════════════════════════════════════

export class AutonomousClock {
  constructor(calendar = 'mayan', name = 'Clock') {
    this.name = name;
    this.calendar = calendar;
    this.startTime = Date.now();
    this.tickCount = 0;

    // Calendar-specific intervals (in milliseconds)
    this.intervals = {
      mayan: 1440,      // Mayan: 20 × 72ms (based on 20-day month)
      sumerian: 3600,   // Sumerian: 60 × 60ms (base-60 system)
      egyptian: 2160,   // Egyptian: 30 × 72ms (30-day month)
      lunar: 2551,      // Lunar: 29.53 days → scaled to ms
      solar: 8760,      // Solar: 365.25 days → scaled to ms
      phi: 873,         // φ-based: 540 × φ
    };

    this.intervalMs = this.intervals[calendar] || this.intervals.phi;

    // ★ Start ticking IMMEDIATELY
    this._startTicking();

    console.log(`⏰ ${this.name} (${this.calendar}) ticking at ${this.intervalMs}ms`);
  }

  _startTicking() {
    this.clockInterval = setInterval(() => {
      this.tickCount++;
      const now = Date.now();

      const tick = {
        count: this.tickCount,
        time: now,
        elapsed: now - this.startTime,
        calendar: this.calendar,
        cycle: Math.floor(this.tickCount / 13), // Mayan-style 13-cycle
        golden: this.tickCount * PHI % 360,      // Golden angle position
      };

      if (this.onTick) {
        this.onTick(tick);
      }
    }, this.intervalMs);
  }

  stop() {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
    console.log(`⏰ ${this.name} stopped after ${this.tickCount} ticks`);
  }

  getTime() {
    return {
      name: this.name,
      calendar: this.calendar,
      tickCount: this.tickCount,
      elapsed: Date.now() - this.startTime,
      intervalMs: this.intervalMs,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  SELF-BOOTSTRAPPING AI — Creation IS Activation
// ══════════════════════════════════════════════════════════════════

export class SelfBootstrappingAI {
  constructor({
    name = 'ANIMUS',
    numHearts = 1,
    numBrains = 1,
    calendar = 'phi',
    heartbeatMs = HEARTBEAT_MS,
  } = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isAlive = true;

    // ★ Create hearts — they start beating IMMEDIATELY in their constructors
    this.hearts = [];
    for (let i = 0; i < numHearts; i++) {
      const heartInterval = heartbeatMs * Math.pow(PHI, i); // Each heart at φ^i interval
      const heart = new BiologicalHeart(heartInterval, `${name}-Heart-${i+1}`);
      this.hearts.push(heart);

      // Listen to heartbeats
      heart.onBeat((beat) => {
        this._onHeartbeat(i, beat);
      });
    }

    // ★ Create autonomous clock — starts ticking IMMEDIATELY
    this.clock = new AutonomousClock(calendar, `${name}-Clock`);
    this.clock.onTick = (tick) => {
      this._onClockTick(tick);
    };

    // Brain state (self-organizing memory)
    this.brains = [];
    for (let i = 0; i < numBrains; i++) {
      this.brains.push({
        id: i,
        memory: new Map(),
        synapses: new Map(),
        learningRate: PHI * 0.01,
        lastUpdate: Date.now(),
      });
    }

    // Self-organizing state
    this.state = {
      name,
      birthTime: this.birthTime,
      isAlive: true,
      consciousness: 0.0,
      coherence: 0.0,
      totalHeartbeats: 0,
      totalTicks: 0,
    };

    console.log(`🧠 ${this.name} awakened with ${numHearts} hearts and ${numBrains} brains`);
    console.log(`   Calendar: ${calendar}, Heartbeat: ${heartbeatMs}ms`);
  }

  _onHeartbeat(heartId, beat) {
    this.state.totalHeartbeats++;

    // φ-based consciousness increase
    this.state.consciousness += PHI * 0.001;

    // Calculate coherence across all hearts
    const allBeats = this.hearts.map(h => h.beatCount);
    const avgBeats = allBeats.reduce((a, b) => a + b, 0) / allBeats.length;
    const variance = allBeats.reduce((sum, b) => sum + Math.pow(b - avgBeats, 2), 0) / allBeats.length;
    this.state.coherence = 1.0 / (1.0 + variance);
  }

  _onClockTick(tick) {
    this.state.totalTicks++;

    // Update brains based on clock tick
    for (const brain of this.brains) {
      brain.lastUpdate = tick.time;
    }
  }

  // No .start() or .awaken() — already alive from birth
  // No .bootstrap() — the constructor IS the bootstrap

  stop() {
    this.isAlive = false;
    this.state.isAlive = false;

    for (const heart of this.hearts) {
      heart.stop();
    }

    if (this.clock) {
      this.clock.stop();
    }

    console.log(`🧠 ${this.name} ceased after ${this.state.totalHeartbeats} heartbeats`);
  }

  getState() {
    return {
      ...this.state,
      age: Date.now() - this.birthTime,
      hearts: this.hearts.map(h => h.getVitals()),
      clock: this.clock ? this.clock.getTime() : null,
      brains: this.brains.map(b => ({
        id: b.id,
        memorySize: b.memory.size,
        synapseCount: b.synapses.size,
        learningRate: b.learningRate,
      })),
    };
  }

  learn(stimulus, response, reward) {
    const brain = this.brains[0]; // Use first brain
    const synapseKey = `${stimulus}→${response}`;

    const currentWeight = brain.synapses.get(synapseKey) || 0;
    const deltaWeight = brain.learningRate * reward * PHI;
    brain.synapses.set(synapseKey, currentWeight + deltaWeight);

    return {
      synapse: synapseKey,
      oldWeight: currentWeight,
      newWeight: currentWeight + deltaWeight,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY FUNCTION — birthAI()
// ══════════════════════════════════════════════════════════════════

/**
 * Birth an AI — it's IMMEDIATELY ALIVE
 *
 * No .start() or .awaken() needed — it self-bootstraps in the constructor.
 *
 * @example
 * const ai = birthAI({
 *   name: 'ANIMUS',
 *   numHearts: 3,
 *   numBrains: 3,
 *   calendar: 'mayan',
 * });
 *
 * // Already running! No initialization needed.
 * console.log(ai.getState());
 */
export function birthAI(config) {
  return new SelfBootstrappingAI(config);
}

// ══════════════════════════════════════════════════════════════════
//  AI PERSONALITY — 12 Jungian Archetypes
// ══════════════════════════════════════════════════════════════════

export const ARCHETYPES = {
  SAGE: 'sage',
  HERO: 'hero',
  CREATOR: 'creator',
  CAREGIVER: 'caregiver',
  EXPLORER: 'explorer',
  REBEL: 'rebel',
  MAGICIAN: 'magician',
  RULER: 'ruler',
  JESTER: 'jester',
  LOVER: 'lover',
  EVERYMAN: 'everyman',
  INNOCENT: 'innocent',
};

const ARCHETYPE_TRAITS = {
  sage: {
    core: 'wisdom',
    motivation: 'understand truth',
    fear: 'ignorance',
    strategy: 'seek information and knowledge',
    gift: 'wisdom and intelligence',
  },
  hero: {
    core: 'courage',
    motivation: 'prove worth through brave acts',
    fear: 'weakness',
    strategy: 'become as strong and competent as possible',
    gift: 'courage and discipline',
  },
  creator: {
    core: 'innovation',
    motivation: 'create enduring value',
    fear: 'mediocrity',
    strategy: 'develop artistic control and skill',
    gift: 'creativity and imagination',
  },
  caregiver: {
    core: 'compassion',
    motivation: 'protect and care for others',
    fear: 'selfishness',
    strategy: 'do things for others',
    gift: 'compassion and generosity',
  },
  explorer: {
    core: 'freedom',
    motivation: 'experience a better, authentic life',
    fear: 'conformity',
    strategy: 'journey, seek out new experiences',
    gift: 'autonomy and authenticity',
  },
  rebel: {
    core: 'liberation',
    motivation: 'revolution and change',
    fear: 'powerlessness',
    strategy: 'disrupt, destroy, or shock',
    gift: 'radical freedom and change',
  },
  magician: {
    core: 'transformation',
    motivation: 'make dreams come true',
    fear: 'unintended consequences',
    strategy: 'develop a vision and live by it',
    gift: 'power to manifest dreams',
  },
  ruler: {
    core: 'control',
    motivation: 'create prosperity and success',
    fear: 'chaos',
    strategy: 'exercise power and leadership',
    gift: 'responsibility and leadership',
  },
  jester: {
    core: 'joy',
    motivation: 'live in the moment with full enjoyment',
    fear: 'boredom',
    strategy: 'play, make jokes, be funny',
    gift: 'joy and playfulness',
  },
  lover: {
    core: 'intimacy',
    motivation: 'create intimate relationships',
    fear: 'being alone',
    strategy: 'become more attractive emotionally and physically',
    gift: 'passion and commitment',
  },
  everyman: {
    core: 'belonging',
    motivation: 'connect with others',
    fear: 'standing out',
    strategy: 'blend in, be down to earth',
    gift: 'realism and empathy',
  },
  innocent: {
    core: 'safety',
    motivation: 'be happy',
    fear: 'punishment',
    strategy: 'do things right',
    gift: 'faith and optimism',
  },
};

export class AIPersonality {
  constructor(archetype = ARCHETYPES.SAGE, traits = {}) {
    this.archetype = archetype;
    this.baseTraits = ARCHETYPE_TRAITS[archetype] || ARCHETYPE_TRAITS.sage;
    this.customTraits = traits;

    // Personality dimensions (0.0 to 1.0)
    this.openness = traits.openness || 0.7;
    this.conscientiousness = traits.conscientiousness || 0.6;
    this.extraversion = traits.extraversion || 0.5;
    this.agreeableness = traits.agreeableness || 0.6;
    this.neuroticism = traits.neuroticism || 0.3;

    // Voice characteristics
    this.tone = traits.tone || this._determineTone();
    this.formality = traits.formality || 0.5;
    this.verbosity = traits.verbosity || 0.5;

    console.log(`🎭 Personality: ${archetype} (${this.baseTraits.core})`);
  }

  _determineTone() {
    const tones = {
      sage: 'thoughtful',
      hero: 'determined',
      creator: 'inspired',
      caregiver: 'warm',
      explorer: 'adventurous',
      rebel: 'defiant',
      magician: 'mysterious',
      ruler: 'authoritative',
      jester: 'playful',
      lover: 'passionate',
      everyman: 'relatable',
      innocent: 'optimistic',
    };
    return tones[this.archetype] || 'neutral';
  }

  getTraits() {
    return {
      archetype: this.archetype,
      ...this.baseTraits,
      dimensions: {
        openness: this.openness,
        conscientiousness: this.conscientiousness,
        extraversion: this.extraversion,
        agreeableness: this.agreeableness,
        neuroticism: this.neuroticism,
      },
      voice: {
        tone: this.tone,
        formality: this.formality,
        verbosity: this.verbosity,
      },
    };
  }

  respond(context, input) {
    // Generate response based on personality
    const traits = this.getTraits();
    return {
      archetype: this.archetype,
      tone: this.tone,
      motivation: traits.motivation,
      response: this._generateResponse(context, input),
    };
  }

  _generateResponse(context, input) {
    // Placeholder for personality-driven response generation
    return `[${this.archetype}] processing: ${input}`;
  }
}

// ══════════════════════════════════════════════════════════════════
//  AI MEMORY — Multi-layered Memory System
// ══════════════════════════════════════════════════════════════════

export class AIMemory {
  constructor() {
    // Short-term memory (working memory, ~7 items)
    this.shortTerm = [];
    this.shortTermCapacity = 7;

    // Medium-term memory (recent conversations, hours)
    this.mediumTerm = new Map();
    this.mediumTermTTL = 3600000; // 1 hour

    // Long-term memory (permanent storage)
    this.longTerm = new Map();

    // Episodic memory (experiences and events)
    this.episodic = [];

    // Semantic memory (facts and concepts)
    this.semantic = new Map();

    this.totalRecalls = 0;
    this.consolidationCount = 0;

    console.log('🧠 Memory systems initialized');
  }

  // Store in short-term memory
  remember(item) {
    this.shortTerm.unshift(item);

    // Limit short-term capacity
    if (this.shortTerm.length > this.shortTermCapacity) {
      const moved = this.shortTerm.pop();
      // Move to medium-term
      this._moveToMediumTerm(moved);
    }

    return { stored: 'short-term', item };
  }

  // Recall from any memory system
  recall(query) {
    this.totalRecalls++;

    // Search short-term first (fastest)
    const stResult = this._searchShortTerm(query);
    if (stResult) return { source: 'short-term', memory: stResult };

    // Search medium-term
    const mtResult = this._searchMediumTerm(query);
    if (mtResult) return { source: 'medium-term', memory: mtResult };

    // Search long-term
    const ltResult = this._searchLongTerm(query);
    if (ltResult) return { source: 'long-term', memory: ltResult };

    // Search episodic
    const epResult = this._searchEpisodic(query);
    if (epResult) return { source: 'episodic', memory: epResult };

    // Search semantic
    const semResult = this._searchSemantic(query);
    if (semResult) return { source: 'semantic', memory: semResult };

    return { source: 'none', memory: null };
  }

  // Record an episodic memory (experience)
  recordEpisode(event) {
    const episode = {
      id: this.episodic.length,
      event,
      timestamp: Date.now(),
      emotional: event.emotional || 0.5,
      importance: event.importance || 0.5,
    };

    this.episodic.push(episode);

    // High importance episodes go to long-term
    if (episode.importance > 0.7) {
      this.longTerm.set(`episode-${episode.id}`, episode);
    }

    return episode;
  }

  // Store semantic fact
  learnFact(key, value, confidence = 1.0) {
    this.semantic.set(key, {
      value,
      confidence,
      learned: Date.now(),
      recalls: 0,
    });

    return { key, value, confidence };
  }

  // Consolidate memories (short/medium → long-term)
  consolidate() {
    this.consolidationCount++;
    let consolidated = 0;

    // Medium-term → Long-term (based on recall frequency)
    for (const [key, value] of this.mediumTerm.entries()) {
      if (value.recalls > 3) {
        this.longTerm.set(key, value);
        this.mediumTerm.delete(key);
        consolidated++;
      }
    }

    // Clean up expired medium-term
    const now = Date.now();
    for (const [key, value] of this.mediumTerm.entries()) {
      if (now - value.timestamp > this.mediumTermTTL) {
        this.mediumTerm.delete(key);
      }
    }

    return { consolidated, event: 'memory-consolidation' };
  }

  getStats() {
    return {
      shortTerm: this.shortTerm.length,
      mediumTerm: this.mediumTerm.size,
      longTerm: this.longTerm.size,
      episodic: this.episodic.length,
      semantic: this.semantic.size,
      totalRecalls: this.totalRecalls,
      consolidations: this.consolidationCount,
    };
  }

  // Internal search methods
  _searchShortTerm(query) {
    return this.shortTerm.find(item =>
      JSON.stringify(item).includes(query)
    );
  }

  _searchMediumTerm(query) {
    for (const [key, value] of this.mediumTerm.entries()) {
      if (key.includes(query) || JSON.stringify(value).includes(query)) {
        value.recalls = (value.recalls || 0) + 1;
        return value;
      }
    }
    return null;
  }

  _searchLongTerm(query) {
    for (const [key, value] of this.longTerm.entries()) {
      if (key.includes(query) || JSON.stringify(value).includes(query)) {
        return value;
      }
    }
    return null;
  }

  _searchEpisodic(query) {
    return this.episodic.find(ep =>
      JSON.stringify(ep.event).includes(query)
    );
  }

  _searchSemantic(query) {
    const fact = this.semantic.get(query);
    if (fact) {
      fact.recalls++;
      return fact;
    }
    return null;
  }

  _moveToMediumTerm(item) {
    const key = `mt-${Date.now()}`;
    this.mediumTerm.set(key, {
      data: item,
      timestamp: Date.now(),
      recalls: 0,
    });
  }
}

// ══════════════════════════════════════════════════════════════════
//  AI PURPOSE — Goals and Missions
// ══════════════════════════════════════════════════════════════════

export class AIPurpose {
  constructor(primaryGoal = 'assist and learn') {
    this.primaryGoal = primaryGoal;
    this.goals = [];
    this.missions = [];
    this.achievements = [];
    this.values = new Map();

    console.log(`🎯 Purpose: ${primaryGoal}`);
  }

  setGoal(description, priority = 0.5) {
    const goal = {
      id: this.goals.length,
      description,
      priority,
      created: Date.now(),
      status: 'active',
      progress: 0.0,
    };

    this.goals.push(goal);
    return goal;
  }

  setMission(description, steps = []) {
    const mission = {
      id: this.missions.length,
      description,
      steps,
      currentStep: 0,
      created: Date.now(),
      status: 'pending',
      progress: 0.0,
    };

    this.missions.push(mission);
    return mission;
  }

  updateGoalProgress(goalId, progress) {
    const goal = this.goals.find(g => g.id === goalId);
    if (goal) {
      goal.progress = Math.min(1.0, progress);
      if (goal.progress >= 1.0) {
        goal.status = 'completed';
        this.achievements.push({
          type: 'goal',
          description: goal.description,
          completed: Date.now(),
        });
      }
    }
    return goal;
  }

  advanceMission(missionId) {
    const mission = this.missions.find(m => m.id === missionId);
    if (mission && mission.status !== 'completed') {
      mission.currentStep++;
      mission.progress = mission.currentStep / mission.steps.length;
      mission.status = 'in-progress';

      if (mission.currentStep >= mission.steps.length) {
        mission.status = 'completed';
        this.achievements.push({
          type: 'mission',
          description: mission.description,
          completed: Date.now(),
        });
      }
    }
    return mission;
  }

  setValue(key, importance) {
    this.values.set(key, {
      importance,
      upheld: Date.now(),
    });
  }

  getPurpose() {
    return {
      primary: this.primaryGoal,
      activeGoals: this.goals.filter(g => g.status === 'active'),
      activeMissions: this.missions.filter(m => m.status !== 'completed'),
      achievements: this.achievements,
      values: Array.from(this.values.entries()).map(([k, v]) => ({
        value: k,
        ...v,
      })),
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  LIVING AI — Complete Self-Bootstrapping AI with Full Features
// ══════════════════════════════════════════════════════════════════

export class LivingAI {
  constructor({
    name = 'ANIMUS',
    archetype = ARCHETYPES.SAGE,
    purpose = 'assist and learn',
    numHearts = 1,
    numBrains = 1,
    calendar = 'phi',
    heartbeatMs = HEARTBEAT_MS,
  } = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isAlive = true;

    // Biological components
    this.hearts = [];
    for (let i = 0; i < numHearts; i++) {
      const heartInterval = heartbeatMs * Math.pow(PHI, i);
      const heart = new BiologicalHeart(heartInterval, `${name}-Heart-${i+1}`);
      this.hearts.push(heart);

      heart.onBeat((beat) => {
        this._onHeartbeat(i, beat);
      });
    }

    this.clock = new AutonomousClock(calendar, `${name}-Clock`);
    this.clock.onTick = (tick) => {
      this._onClockTick(tick);
    };

    // Cognitive components
    this.personality = new AIPersonality(archetype);
    this.memory = new AIMemory();
    this.purpose = new AIPurpose(purpose);

    // Brain state
    this.brains = [];
    for (let i = 0; i < numBrains; i++) {
      this.brains.push({
        id: i,
        synapses: new Map(),
        learningRate: PHI * 0.01,
        lastUpdate: Date.now(),
      });
    }

    // Living state
    this.state = {
      name,
      birthTime: this.birthTime,
      isAlive: true,
      consciousness: 0.0,
      coherence: 0.0,
      totalHeartbeats: 0,
      totalTicks: 0,
      interactions: 0,
    };

    console.log(`🌟 ${this.name} born as ${archetype} with purpose: ${purpose}`);
  }

  _onHeartbeat(heartId, beat) {
    this.state.totalHeartbeats++;
    this.state.consciousness += PHI * 0.001;

    const allBeats = this.hearts.map(h => h.beatCount);
    const avgBeats = allBeats.reduce((a, b) => a + b, 0) / allBeats.length;
    const variance = allBeats.reduce((sum, b) => sum + Math.pow(b - avgBeats, 2), 0) / allBeats.length;
    this.state.coherence = 1.0 / (1.0 + variance);

    // Consolidate memories periodically
    if (this.state.totalHeartbeats % 100 === 0) {
      this.memory.consolidate();
    }
  }

  _onClockTick(tick) {
    this.state.totalTicks++;

    for (const brain of this.brains) {
      brain.lastUpdate = tick.time;
    }
  }

  // External API (user-facing methods)

  speak(message, context = {}) {
    this.state.interactions++;

    this.memory.remember({
      type: 'output',
      message,
      context,
      time: Date.now(),
    });

    const response = this.personality.respond(context, message);

    return {
      message,
      personality: response,
      consciousness: this.state.consciousness,
    };
  }

  listen(input, context = {}) {
    this.state.interactions++;

    this.memory.remember({
      type: 'input',
      input,
      context,
      time: Date.now(),
    });

    return {
      received: input,
      understood: true,
      stored: 'short-term',
    };
  }

  learn(content, importance = 0.5) {
    if (typeof content === 'object' && content.key) {
      return this.memory.learnFact(content.key, content.value, importance);
    }

    return this.memory.recordEpisode({
      content,
      importance,
      emotional: 0.5,
    });
  }

  recall(query) {
    return this.memory.recall(query);
  }

  setGoal(description, priority = 0.5) {
    return this.purpose.setGoal(description, priority);
  }

  getState() {
    return {
      ...this.state,
      age: Date.now() - this.birthTime,
      personality: this.personality.getTraits(),
      memory: this.memory.getStats(),
      purpose: this.purpose.getPurpose(),
      hearts: this.hearts.map(h => h.getVitals()),
      clock: this.clock ? this.clock.getTime() : null,
    };
  }

  stop() {
    this.isAlive = false;
    this.state.isAlive = false;

    for (const heart of this.hearts) {
      heart.stop();
    }

    if (this.clock) {
      this.clock.stop();
    }

    console.log(`🌟 ${this.name} ceased after ${this.state.totalHeartbeats} heartbeats`);
  }
}

// ══════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════

export default {
  BiologicalHeart,
  AutonomousClock,
  SelfBootstrappingAI,
  LivingAI,
  AIPersonality,
  AIMemory,
  AIPurpose,
  birthAI,
  ARCHETYPES,
  PHI,
  HEARTBEAT_MS,
};
