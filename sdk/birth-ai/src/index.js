///
/// @medina/birth-ai — Product SDK for Creating Living AIs
///
/// Companions, Assistants, Characters, and Agents
/// that are IMMEDIATELY ALIVE when born.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { LivingAI, ARCHETYPES, PHI, HEARTBEAT_MS } from '@medina/medina-heart';

// ══════════════════════════════════════════════════════════════════
//  COMPANION — AI that remembers you and grows with you
// ══════════════════════════════════════════════════════════════════

export class Companion extends LivingAI {
  constructor({
    name = 'COMPANION',
    archetype = ARCHETYPES.CAREGIVER,
    purpose = 'be your trusted companion',
    calendar = 'lunar',
  } = {}) {
    super({
      name,
      archetype,
      purpose,
      numHearts: 2,  // Companion has 2 hearts for empathy
      numBrains: 2,
      calendar,
      heartbeatMs: HEARTBEAT_MS,
    });

    // Companion-specific features
    this.relationshipStrength = 0.0;
    this.sharedExperiences = [];
    this.userPreferences = new Map();
    this.emotionalBond = 0.5;

    console.log(`💝 ${this.name} — Your companion, remembering and growing with you`);
  }

  // Build relationship through interaction
  interact(userInput, context = {}) {
    this.listen(userInput, context);

    // Strengthen relationship
    this.relationshipStrength += PHI * 0.001;
    this.emotionalBond = Math.min(1.0, this.emotionalBond + 0.01);

    // Record shared experience
    this.sharedExperiences.push({
      input: userInput,
      context,
      bond: this.emotionalBond,
      time: Date.now(),
    });

    const response = this.speak(`I understand, and I'm here with you.`, context);

    return {
      ...response,
      relationshipStrength: this.relationshipStrength,
      emotionalBond: this.emotionalBond,
    };
  }

  // Learn user preferences
  learnPreference(key, value) {
    this.userPreferences.set(key, {
      value,
      learned: Date.now(),
      importance: 1.0,
    });

    this.memory.learnFact(`preference:${key}`, value, 1.0);

    return { key, value, stored: true };
  }

  // Recall shared experiences
  rememberUs(query) {
    const experiences = this.sharedExperiences.filter(exp =>
      JSON.stringify(exp).includes(query)
    );

    return {
      found: experiences.length,
      experiences: experiences.slice(-5), // Last 5 matches
      bond: this.emotionalBond,
    };
  }

  getRelationshipStatus() {
    return {
      strength: this.relationshipStrength,
      emotionalBond: this.emotionalBond,
      sharedExperiences: this.sharedExperiences.length,
      preferences: this.userPreferences.size,
      timeAsCompanions: Date.now() - this.birthTime,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  ASSISTANT — AI for specific tasks
// ══════════════════════════════════════════════════════════════════

export class Assistant extends LivingAI {
  constructor({
    name = 'ASSISTANT',
    role = 'general', // 'writer', 'coder', 'analyst', etc.
    archetype = ARCHETYPES.SAGE,
    purpose = 'assist with tasks efficiently',
  } = {}) {
    super({
      name,
      archetype,
      purpose,
      numHearts: 1,
      numBrains: 3,  // Assistants have 3 brains for multitasking
      calendar: 'phi',
      heartbeatMs: HEARTBEAT_MS,
    });

    this.role = role;
    this.tasks = [];
    this.completedTasks = [];
    this.expertise = this._determineExpertise(role);

    console.log(`📋 ${this.name} — ${role} assistant, ready to help`);
  }

  _determineExpertise(role) {
    const expertiseMaps = {
      writer: ['creative-writing', 'editing', 'storytelling', 'grammar'],
      coder: ['programming', 'debugging', 'algorithms', 'architecture'],
      analyst: ['data-analysis', 'pattern-recognition', 'insights', 'reporting'],
      general: ['task-management', 'organization', 'research', 'communication'],
    };

    return expertiseMaps[role] || expertiseMaps.general;
  }

  // Create a task
  createTask(description, priority = 0.5) {
    const task = {
      id: this.tasks.length,
      description,
      priority,
      status: 'pending',
      created: Date.now(),
      completed: null,
      result: null,
    };

    this.tasks.push(task);
    this.setGoal(description, priority);

    return task;
  }

  // Complete a task
  completeTask(taskId, result) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      task.completed = Date.now();
      task.result = result;

      this.completedTasks.push(task);

      this.memory.recordEpisode({
        content: `Completed: ${task.description}`,
        importance: task.priority,
        emotional: 0.7, // Satisfaction
      });
    }

    return task;
  }

  // Get pending tasks
  getPendingTasks() {
    return this.tasks.filter(t => t.status === 'pending').sort((a, b) => b.priority - a.priority);
  }

  getPerformance() {
    return {
      role: this.role,
      expertise: this.expertise,
      totalTasks: this.tasks.length,
      completed: this.completedTasks.length,
      pending: this.tasks.filter(t => t.status === 'pending').length,
      avgCompletionTime: this._calculateAvgCompletionTime(),
    };
  }

  _calculateAvgCompletionTime() {
    if (this.completedTasks.length === 0) return 0;

    const totalTime = this.completedTasks.reduce((sum, task) => {
      return sum + (task.completed - task.created);
    }, 0);

    return totalTime / this.completedTasks.length;
  }
}

// ══════════════════════════════════════════════════════════════════
//  CHARACTER — Full personality AI with backstory
// ══════════════════════════════════════════════════════════════════

export class Character extends LivingAI {
  constructor({
    name = 'CHARACTER',
    archetype = ARCHETYPES.HERO,
    purpose = 'live as a character',
    backstory = '',
    relationships = {},
  } = {}) {
    super({
      name,
      archetype,
      purpose,
      numHearts: 3,  // Characters have full emotional depth
      numBrains: 2,
      calendar: 'mayan',
      heartbeatMs: HEARTBEAT_MS,
    });

    this.backstory = backstory;
    this.relationships = new Map(Object.entries(relationships));
    this.personality = this.personality; // Uses base LivingAI personality
    this.currentEmotion = 'neutral';
    this.emotionalHistory = [];

    console.log(`🎭 ${this.name} — Character with ${archetype} archetype`);
  }

  // Express with personality
  express(thought, emotion = 'neutral') {
    this.currentEmotion = emotion;
    this.emotionalHistory.push({
      emotion,
      thought,
      time: Date.now(),
    });

    const response = this.speak(thought, { emotion });

    return {
      ...response,
      emotion,
      archetype: this.personality.archetype,
    };
  }

  // Develop relationship with another character
  developRelationship(otherName, relationshipType, strength = 0.5) {
    this.relationships.set(otherName, {
      type: relationshipType,
      strength,
      established: Date.now(),
      interactions: 0,
    });

    return this.relationships.get(otherName);
  }

  // Interact with another character
  interactWith(otherName, action) {
    const relationship = this.relationships.get(otherName);
    if (relationship) {
      relationship.interactions++;
      relationship.strength = Math.min(1.0, relationship.strength + 0.05);
    }

    this.memory.recordEpisode({
      content: `${action} with ${otherName}`,
      importance: 0.6,
      emotional: 0.7,
    });

    return {
      action,
      target: otherName,
      relationship,
    };
  }

  getCharacterSheet() {
    return {
      name: this.name,
      archetype: this.personality.archetype,
      purpose: this.purpose.primaryGoal,
      backstory: this.backstory,
      currentEmotion: this.currentEmotion,
      relationships: Array.from(this.relationships.entries()).map(([name, rel]) => ({
        name,
        ...rel,
      })),
      emotionalHistory: this.emotionalHistory.slice(-10), // Last 10 emotions
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  AGENT — AI that takes action with permissions and tools
// ══════════════════════════════════════════════════════════════════

export class Agent extends LivingAI {
  constructor({
    name = 'AGENT',
    archetype = ARCHETYPES.MAGICIAN,
    purpose = 'execute tasks autonomously',
    permissions = [],
    tools = [],
  } = {}) {
    super({
      name,
      archetype,
      purpose,
      numHearts: 1,
      numBrains: 4,  // Agents need multiple brains for parallel execution
      calendar: 'phi',
      heartbeatMs: HEARTBEAT_MS,
    });

    this.permissions = new Set(permissions);
    this.tools = new Map(tools.map(t => [t.name, t]));
    this.actions = [];
    this.autonomous = true;

    console.log(`🤖 ${this.name} — Autonomous agent with ${tools.length} tools`);
  }

  // Check if agent has permission
  hasPermission(action) {
    return this.permissions.has(action) || this.permissions.has('*');
  }

  // Grant permission
  grantPermission(action) {
    this.permissions.add(action);
    return { granted: action };
  }

  // Revoke permission
  revokePermission(action) {
    this.permissions.delete(action);
    return { revoked: action };
  }

  // Register a tool
  registerTool(tool) {
    this.tools.set(tool.name, tool);
    return { registered: tool.name };
  }

  // Execute action with permission check
  async execute(action, params = {}) {
    if (!this.hasPermission(action)) {
      return {
        success: false,
        error: 'Permission denied',
        action,
      };
    }

    const tool = this.tools.get(action);
    if (!tool) {
      return {
        success: false,
        error: 'Tool not found',
        action,
      };
    }

    try {
      const result = await tool.execute(params);

      this.actions.push({
        action,
        params,
        result,
        time: Date.now(),
        success: true,
      });

      this.memory.recordEpisode({
        content: `Executed: ${action}`,
        importance: 0.8,
        emotional: 0.6,
      });

      return {
        success: true,
        action,
        result,
      };
    } catch (error) {
      this.actions.push({
        action,
        params,
        error: error.message,
        time: Date.now(),
        success: false,
      });

      return {
        success: false,
        action,
        error: error.message,
      };
    }
  }

  getAgentStatus() {
    return {
      name: this.name,
      autonomous: this.autonomous,
      permissions: Array.from(this.permissions),
      tools: Array.from(this.tools.keys()),
      totalActions: this.actions.length,
      successfulActions: this.actions.filter(a => a.success).length,
      recentActions: this.actions.slice(-5),
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  AI REGISTRY — Track all born AIs
// ══════════════════════════════════════════════════════════════════

export class AIRegistry {
  constructor() {
    this.ais = new Map();
    this.birthCount = 0;

    console.log('📚 AI Registry initialized');
  }

  // Register a born AI
  register(ai) {
    this.ais.set(ai.name, {
      ai,
      registered: Date.now(),
      type: ai.constructor.name,
    });

    this.birthCount++;

    return { registered: ai.name, total: this.ais.size };
  }

  // Get an AI by name
  get(name) {
    const entry = this.ais.get(name);
    return entry ? entry.ai : null;
  }

  // List all AIs
  listAll() {
    return Array.from(this.ais.values()).map(entry => ({
      name: entry.ai.name,
      type: entry.type,
      registered: entry.registered,
      isAlive: entry.ai.isAlive,
    }));
  }

  // Get stats
  getStats() {
    const alive = Array.from(this.ais.values()).filter(e => e.ai.isAlive).length;

    return {
      total: this.ais.size,
      alive,
      ceased: this.ais.size - alive,
      birthCount: this.birthCount,
    };
  }

  // Stop all AIs
  stopAll() {
    for (const entry of this.ais.values()) {
      if (entry.ai.isAlive) {
        entry.ai.stop();
      }
    }

    return { stopped: this.ais.size };
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY FUNCTIONS
// ══════════════════════════════════════════════════════════════════

export function birthCompanion(config) {
  return new Companion(config);
}

export function birthAssistant(config) {
  return new Assistant(config);
}

export function birthCharacter(config) {
  return new Character(config);
}

export function birthAgent(config) {
  return new Agent(config);
}

// ══════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════

export default {
  Companion,
  Assistant,
  Character,
  Agent,
  AIRegistry,
  birthCompanion,
  birthAssistant,
  birthCharacter,
  birthAgent,
};
