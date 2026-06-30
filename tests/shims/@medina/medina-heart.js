///
/// Test shim for @medina/medina-heart
/// Provides the PHI export that authentication-protocol and other SDKs expect.
/// The real sdk/medina-heart/src/index.js keeps PHI as a private constant;
/// this shim bridges that gap in the test environment without touching production code.
///

export const PHI = 1.6180339887498948482; // (1 + √5) / 2
export const HEARTBEAT_MS = 873;

// Mock ARCHETYPES for SDK compatibility
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

// Mock Memory class for LivingAI
class MockMemory {
  constructor() {
    this.facts = new Map();
    this.episodes = [];
  }
  
  learnFact(key, value, importance) {
    this.facts.set(key, { value, importance, learned: Date.now() });
    return { key, value, importance };
  }
  
  recordEpisode(episode) {
    this.episodes.push({ ...episode, recorded: Date.now() });
    return episode;
  }
  
  remember(item) {
    return item;
  }
}

// Mock Personality class for LivingAI
class MockPersonality {
  constructor(archetype) {
    this.archetype = archetype;
    this.openness = 0.7;
    this.conscientiousness = 0.8;
    this.strategy = 'balanced';
  }
  
  getTraits() {
    return {
      archetype: this.archetype,
      openness: this.openness,
      conscientiousness: this.conscientiousness,
      strategy: this.strategy,
    };
  }
}

// Mock Purpose class for LivingAI
class MockPurpose {
  constructor(goal) {
    this.primaryGoal = goal;
    this.goals = [];
  }
}

// Mock LivingAI class for SDK compatibility
export class LivingAI {
  constructor({ name, archetype = ARCHETYPES.SAGE, purpose = 'exist', numHearts = 1, numBrains = 1, calendar = 'phi', heartbeatMs = HEARTBEAT_MS } = {}) {
    this.name = name;
    this.isAlive = true;
    this.birthTime = Date.now();
    
    // Create personality
    this.personality = new MockPersonality(archetype);
    
    // Create purpose
    this.purpose = new MockPurpose(purpose);
    
    // Create memory
    this.memory = new MockMemory();
  }
  
  listen(input, context = {}) {
    this.memory.recordEpisode({ content: input, importance: 0.5, emotional: 0.5 });
    return { input, context, listened: true };
  }
  
  speak(message, context = {}) {
    return { message, context, spoken: true, timestamp: Date.now() };
  }
  
  setGoal(description, priority = 0.5) {
    this.purpose.goals.push({ description, priority, set: Date.now() });
    return { description, priority };
  }
  
  stop() {
    this.isAlive = false;
  }
}
