///
/// tests/birth-ai.test.js
///
/// Comprehensive test coverage for sdk/birth-ai/src/index.js
///
/// Covers:
///   - Companion: construction, interact, learnPreference, rememberUs, getRelationshipStatus
///   - Assistant: construction, createTask, completeTask, getPendingTasks, getPerformance
///   - Character: construction, express, developRelationship, interactWith, getCharacterSheet
///   - Agent: construction, hasPermission, grantPermission, revokePermission, registerTool, execute, getAgentStatus
///   - AIRegistry: constructor, register, get, listAll, getStats, stopAll
///   - Factory functions: birthCompanion, birthAssistant, birthCharacter, birthAgent
///

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  Companion,
  Assistant,
  Character,
  Agent,
  AIRegistry,
  birthCompanion,
  birthAssistant,
  birthCharacter,
  birthAgent,
} from '../sdk/birth-ai/src/index.js';

// ─── Companion ────────────────────────────────────────────────────────────────

describe('Companion', () => {
  test('constructs with default values', () => {
    const companion = new Companion({ name: 'TestCompanion' });
    assert.strictEqual(companion.name, 'TestCompanion');
    assert.ok(companion.isAlive);
    assert.strictEqual(companion.relationshipStrength, 0.0);
    assert.deepStrictEqual(companion.sharedExperiences, []);
    assert.strictEqual(companion.userPreferences.size, 0);
    assert.strictEqual(companion.emotionalBond, 0.5);
    companion.stop();
  });

  test('constructs with custom values', () => {
    const companion = new Companion({
      name: 'CustomCompanion',
      purpose: 'custom purpose',
      calendar: 'solar',
    });
    assert.strictEqual(companion.name, 'CustomCompanion');
    companion.stop();
  });

  test('interact strengthens relationship', () => {
    const companion = new Companion({ name: 'TestCompanion' });
    const initialStrength = companion.relationshipStrength;
    
    companion.interact('Hello!', { mood: 'happy' });
    
    assert.ok(companion.relationshipStrength > initialStrength);
    assert.ok(companion.emotionalBond > 0.5);
    assert.strictEqual(companion.sharedExperiences.length, 1);
    companion.stop();
  });

  test('interact returns expected structure', () => {
    const companion = new Companion({ name: 'TestCompanion' });
    const result = companion.interact('How are you?', {});
    
    assert.ok('relationshipStrength' in result);
    assert.ok('emotionalBond' in result);
    assert.ok('message' in result);
    companion.stop();
  });

  test('learnPreference stores user preference', () => {
    const companion = new Companion({ name: 'TestCompanion' });
    const result = companion.learnPreference('color', 'blue');
    
    assert.strictEqual(result.key, 'color');
    assert.strictEqual(result.value, 'blue');
    assert.strictEqual(result.stored, true);
    assert.ok(companion.userPreferences.has('color'));
    companion.stop();
  });

  test('rememberUs returns matching experiences', () => {
    const companion = new Companion({ name: 'TestCompanion' });
    companion.interact('We went to the beach', {});
    companion.interact('We had pizza', {});
    companion.interact('We went to the movies', {});
    
    const result = companion.rememberUs('beach');
    
    assert.ok(result.found >= 1);
    assert.ok(Array.isArray(result.experiences));
    companion.stop();
  });

  test('getRelationshipStatus returns expected structure', () => {
    const companion = new Companion({ name: 'TestCompanion' });
    const status = companion.getRelationshipStatus();
    
    assert.ok('strength' in status);
    assert.ok('emotionalBond' in status);
    assert.ok('sharedExperiences' in status);
    assert.ok('preferences' in status);
    assert.ok('timeAsCompanions' in status);
    companion.stop();
  });
});

// ─── Assistant ────────────────────────────────────────────────────────────────

describe('Assistant', () => {
  test('constructs with default values', () => {
    const assistant = new Assistant({ name: 'TestAssistant' });
    assert.strictEqual(assistant.name, 'TestAssistant');
    assert.strictEqual(assistant.role, 'general');
    assert.ok(Array.isArray(assistant.tasks));
    assert.ok(Array.isArray(assistant.completedTasks));
    assistant.stop();
  });

  test('constructs with specific role', () => {
    const assistant = new Assistant({ name: 'Coder', role: 'coder' });
    assert.strictEqual(assistant.role, 'coder');
    assert.ok(assistant.expertise.includes('programming'));
    assistant.stop();
  });

  test('determines expertise based on role', () => {
    const writer = new Assistant({ name: 'Writer', role: 'writer' });
    assert.ok(writer.expertise.includes('creative-writing'));
    writer.stop();
    
    const analyst = new Assistant({ name: 'Analyst', role: 'analyst' });
    assert.ok(analyst.expertise.includes('data-analysis'));
    analyst.stop();
  });

  test('createTask creates a task with expected structure', () => {
    const assistant = new Assistant({ name: 'TestAssistant' });
    const task = assistant.createTask('Write report', 0.8);
    
    assert.strictEqual(task.description, 'Write report');
    assert.strictEqual(task.priority, 0.8);
    assert.strictEqual(task.status, 'pending');
    assert.strictEqual(task.result, null);
    assert.strictEqual(assistant.tasks.length, 1);
    assistant.stop();
  });

  test('completeTask updates task status', () => {
    const assistant = new Assistant({ name: 'TestAssistant' });
    const task = assistant.createTask('Write report', 0.8);
    
    assistant.completeTask(task.id, { output: 'Report completed' });
    
    assert.strictEqual(task.status, 'completed');
    assert.deepStrictEqual(task.result, { output: 'Report completed' });
    assert.strictEqual(assistant.completedTasks.length, 1);
    assistant.stop();
  });

  test('getPendingTasks returns only pending tasks sorted by priority', () => {
    const assistant = new Assistant({ name: 'TestAssistant' });
    assistant.createTask('Low priority', 0.2);
    assistant.createTask('High priority', 0.9);
    assistant.createTask('Medium priority', 0.5);
    
    const pending = assistant.getPendingTasks();
    
    assert.strictEqual(pending.length, 3);
    assert.strictEqual(pending[0].priority, 0.9);
    assert.strictEqual(pending[2].priority, 0.2);
    assistant.stop();
  });

  test('getPerformance returns expected structure', () => {
    const assistant = new Assistant({ name: 'TestAssistant' });
    assistant.createTask('Task 1', 0.5);
    assistant.createTask('Task 2', 0.5);
    assistant.completeTask(0, { done: true });
    
    const perf = assistant.getPerformance();
    
    assert.strictEqual(perf.role, 'general');
    assert.ok(Array.isArray(perf.expertise));
    assert.strictEqual(perf.totalTasks, 2);
    assert.strictEqual(perf.completed, 1);
    assert.strictEqual(perf.pending, 1);
    assistant.stop();
  });
});

// ─── Character ────────────────────────────────────────────────────────────────

describe('Character', () => {
  test('constructs with default values', () => {
    const character = new Character({ name: 'TestCharacter' });
    assert.strictEqual(character.name, 'TestCharacter');
    assert.strictEqual(character.backstory, '');
    assert.strictEqual(character.currentEmotion, 'neutral');
    assert.ok(character.relationships instanceof Map);
    character.stop();
  });

  test('constructs with backstory and relationships', () => {
    const character = new Character({
      name: 'Hero',
      backstory: 'A brave warrior',
      relationships: { Villain: { type: 'enemy', strength: 0.8 } },
    });
    assert.strictEqual(character.backstory, 'A brave warrior');
    assert.ok(character.relationships.has('Villain'));
    character.stop();
  });

  test('express changes emotion and records history', () => {
    const character = new Character({ name: 'TestCharacter' });
    const result = character.express('I feel joy!', 'happy');
    
    assert.strictEqual(character.currentEmotion, 'happy');
    assert.strictEqual(character.emotionalHistory.length, 1);
    assert.strictEqual(result.emotion, 'happy');
    character.stop();
  });

  test('developRelationship creates new relationship', () => {
    const character = new Character({ name: 'TestCharacter' });
    const rel = character.developRelationship('Friend', 'ally', 0.7);
    
    assert.strictEqual(rel.type, 'ally');
    assert.strictEqual(rel.strength, 0.7);
    assert.ok(character.relationships.has('Friend'));
    character.stop();
  });

  test('interactWith strengthens relationship', () => {
    const character = new Character({ name: 'TestCharacter' });
    character.developRelationship('Friend', 'ally', 0.5);
    
    const result = character.interactWith('Friend', 'had lunch together');
    
    const rel = character.relationships.get('Friend');
    assert.ok(rel.strength > 0.5);
    assert.strictEqual(rel.interactions, 1);
    character.stop();
  });

  test('getCharacterSheet returns expected structure', () => {
    const character = new Character({
      name: 'TestCharacter',
      backstory: 'A test character',
    });
    const sheet = character.getCharacterSheet();
    
    assert.strictEqual(sheet.name, 'TestCharacter');
    assert.strictEqual(sheet.backstory, 'A test character');
    assert.strictEqual(sheet.currentEmotion, 'neutral');
    assert.ok(Array.isArray(sheet.relationships));
    assert.ok(Array.isArray(sheet.emotionalHistory));
    character.stop();
  });
});

// ─── Agent ────────────────────────────────────────────────────────────────────

describe('Agent', () => {
  test('constructs with default values', () => {
    const agent = new Agent({ name: 'TestAgent' });
    assert.strictEqual(agent.name, 'TestAgent');
    assert.ok(agent.permissions instanceof Set);
    assert.ok(agent.tools instanceof Map);
    assert.strictEqual(agent.autonomous, true);
    agent.stop();
  });

  test('constructs with permissions and tools', () => {
    const mockTool = { name: 'search', execute: async () => ({ result: 'found' }) };
    const agent = new Agent({
      name: 'TestAgent',
      permissions: ['read', 'write'],
      tools: [mockTool],
    });
    
    assert.ok(agent.permissions.has('read'));
    assert.ok(agent.permissions.has('write'));
    assert.ok(agent.tools.has('search'));
    agent.stop();
  });

  test('hasPermission returns true for granted permission', () => {
    const agent = new Agent({ name: 'TestAgent', permissions: ['read'] });
    assert.ok(agent.hasPermission('read'));
    assert.ok(!agent.hasPermission('write'));
    agent.stop();
  });

  test('hasPermission returns true for wildcard permission', () => {
    const agent = new Agent({ name: 'TestAgent', permissions: ['*'] });
    assert.ok(agent.hasPermission('anything'));
    agent.stop();
  });

  test('grantPermission adds permission', () => {
    const agent = new Agent({ name: 'TestAgent' });
    agent.grantPermission('write');
    assert.ok(agent.hasPermission('write'));
    agent.stop();
  });

  test('revokePermission removes permission', () => {
    const agent = new Agent({ name: 'TestAgent', permissions: ['read'] });
    agent.revokePermission('read');
    assert.ok(!agent.hasPermission('read'));
    agent.stop();
  });

  test('registerTool adds tool', () => {
    const agent = new Agent({ name: 'TestAgent' });
    const tool = { name: 'newTool', execute: async () => {} };
    agent.registerTool(tool);
    assert.ok(agent.tools.has('newTool'));
    agent.stop();
  });

  test('execute returns permission denied without permission', async () => {
    const agent = new Agent({ name: 'TestAgent' });
    const result = await agent.execute('forbidden');
    
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Permission denied');
    agent.stop();
  });

  test('execute returns tool not found for missing tool', async () => {
    const agent = new Agent({ name: 'TestAgent', permissions: ['*'] });
    const result = await agent.execute('nonexistent');
    
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Tool not found');
    agent.stop();
  });

  test('execute runs tool successfully', async () => {
    const mockTool = {
      name: 'search',
      execute: async (params) => ({ found: params.query }),
    };
    const agent = new Agent({
      name: 'TestAgent',
      permissions: ['search'],
      tools: [mockTool],
    });
    
    const result = await agent.execute('search', { query: 'test' });
    
    assert.strictEqual(result.success, true);
    assert.deepStrictEqual(result.result, { found: 'test' });
    assert.strictEqual(agent.actions.length, 1);
    agent.stop();
  });

  test('execute records failed action on error', async () => {
    const mockTool = {
      name: 'failing',
      execute: async () => { throw new Error('Tool failed'); },
    };
    const agent = new Agent({
      name: 'TestAgent',
      permissions: ['failing'],
      tools: [mockTool],
    });
    
    const result = await agent.execute('failing');
    
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Tool failed');
    assert.strictEqual(agent.actions.length, 1);
    assert.strictEqual(agent.actions[0].success, false);
    agent.stop();
  });

  test('getAgentStatus returns expected structure', () => {
    const agent = new Agent({
      name: 'TestAgent',
      permissions: ['read'],
      tools: [{ name: 'tool1', execute: async () => {} }],
    });
    const status = agent.getAgentStatus();
    
    assert.strictEqual(status.name, 'TestAgent');
    assert.strictEqual(status.autonomous, true);
    assert.deepStrictEqual(status.permissions, ['read']);
    assert.deepStrictEqual(status.tools, ['tool1']);
    assert.strictEqual(status.totalActions, 0);
    agent.stop();
  });
});

// ─── AIRegistry ───────────────────────────────────────────────────────────────

describe('AIRegistry', () => {
  test('constructs with empty registry', () => {
    const registry = new AIRegistry();
    assert.strictEqual(registry.ais.size, 0);
    assert.strictEqual(registry.birthCount, 0);
  });

  test('register adds AI to registry', () => {
    const registry = new AIRegistry();
    const companion = new Companion({ name: 'TestCompanion' });
    
    const result = registry.register(companion);
    
    assert.strictEqual(result.registered, 'TestCompanion');
    assert.strictEqual(result.total, 1);
    assert.strictEqual(registry.birthCount, 1);
    companion.stop();
  });

  test('get retrieves registered AI', () => {
    const registry = new AIRegistry();
    const companion = new Companion({ name: 'TestCompanion' });
    registry.register(companion);
    
    const retrieved = registry.get('TestCompanion');
    
    assert.strictEqual(retrieved, companion);
    companion.stop();
  });

  test('get returns null for unknown AI', () => {
    const registry = new AIRegistry();
    const retrieved = registry.get('Unknown');
    assert.strictEqual(retrieved, null);
  });

  test('listAll returns all registered AIs', () => {
    const registry = new AIRegistry();
    const companion = new Companion({ name: 'Comp' });
    const assistant = new Assistant({ name: 'Assist' });
    registry.register(companion);
    registry.register(assistant);
    
    const list = registry.listAll();
    
    assert.strictEqual(list.length, 2);
    assert.ok(list.some(ai => ai.name === 'Comp'));
    assert.ok(list.some(ai => ai.name === 'Assist'));
    companion.stop();
    assistant.stop();
  });

  test('getStats returns expected structure', () => {
    const registry = new AIRegistry();
    const companion = new Companion({ name: 'Comp' });
    registry.register(companion);
    
    const stats = registry.getStats();
    
    assert.strictEqual(stats.total, 1);
    assert.strictEqual(stats.alive, 1);
    assert.strictEqual(stats.ceased, 0);
    assert.strictEqual(stats.birthCount, 1);
    companion.stop();
  });

  test('stopAll stops all AIs', () => {
    const registry = new AIRegistry();
    const companion = new Companion({ name: 'Comp' });
    const assistant = new Assistant({ name: 'Assist' });
    registry.register(companion);
    registry.register(assistant);
    
    registry.stopAll();
    
    assert.strictEqual(companion.isAlive, false);
    assert.strictEqual(assistant.isAlive, false);
    const stats = registry.getStats();
    assert.strictEqual(stats.alive, 0);
    assert.strictEqual(stats.ceased, 2);
  });
});

// ─── Factory Functions ────────────────────────────────────────────────────────

describe('Factory Functions', () => {
  test('birthCompanion creates Companion instance', () => {
    const companion = birthCompanion({ name: 'FactoryCompanion' });
    assert.ok(companion instanceof Companion);
    assert.strictEqual(companion.name, 'FactoryCompanion');
    companion.stop();
  });

  test('birthAssistant creates Assistant instance', () => {
    const assistant = birthAssistant({ name: 'FactoryAssistant' });
    assert.ok(assistant instanceof Assistant);
    assert.strictEqual(assistant.name, 'FactoryAssistant');
    assistant.stop();
  });

  test('birthCharacter creates Character instance', () => {
    const character = birthCharacter({ name: 'FactoryCharacter' });
    assert.ok(character instanceof Character);
    assert.strictEqual(character.name, 'FactoryCharacter');
    character.stop();
  });

  test('birthAgent creates Agent instance', () => {
    const agent = birthAgent({ name: 'FactoryAgent' });
    assert.ok(agent instanceof Agent);
    assert.strictEqual(agent.name, 'FactoryAgent');
    agent.stop();
  });
});
