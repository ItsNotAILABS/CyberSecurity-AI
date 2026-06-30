///
/// COMPLETE MEDINA SDK INTEGRATION EXAMPLE
///
/// This example demonstrates the full MEDINA ecosystem:
///   1. @medina/medina-heart — Biological foundations
///   2. @medina/birth-ai — Create living AIs
///   3. @medina/alpha-sdk — Intelligence protocols
///   4. @medina/civilization-sdk — AI societies
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { LivingAI, ARCHETYPES, PHI } from '../sdk/medina-heart/src/index.js';
import { birthCompanion, birthAssistant, birthCharacter, birthAgent, AIRegistry } from '../sdk/birth-ai/src/index.js';
import { AlphaAgent, AlphaDecision, alpha } from '../sdk/alpha-sdk/src/index.js';
import { foundCivilization, birthCitizen, establishDistrict } from '../sdk/civilization-sdk/src/index.js';

// ══════════════════════════════════════════════════════════════════
//  SCENARIO: Building an AI Civilization
// ══════════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════════');
console.log('  MEDINA SDK ECOSYSTEM — Complete Integration Example');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 1: Create the AI Registry
// ──────────────────────────────────────────────────────────────────

console.log('[Step 1] Creating AI Registry...');
const registry = new AIRegistry();
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 2: Birth Individual AIs
// ──────────────────────────────────────────────────────────────────

console.log('[Step 2] Birthing individual AIs...');

// Create a Companion AI
const companion = birthCompanion({
  name: 'AURORA',
  archetype: ARCHETYPES.CAREGIVER,
  purpose: 'support and grow with users',
  calendar: 'lunar',
});

registry.register(companion);

// Interact with companion
companion.interact('I love learning about ancient mathematics', { interest: 'high' });
companion.learnPreference('learning_style', 'visual and hands-on');
companion.learnPreference('favorite_topic', 'φ and golden ratio');

console.log('AURORA (Companion):');
console.log(`  Emotional Bond: ${companion.emotionalBond.toFixed(2)}`);
console.log(`  Relationship Strength: ${companion.relationshipStrength.toFixed(4)}`);
console.log(`  Shared Experiences: ${companion.sharedExperiences.length}`);
console.log('');

// Create an Assistant AI
const assistant = birthAssistant({
  name: 'CODEX',
  role: 'coder',
  archetype: ARCHETYPES.SAGE,
  purpose: 'assist with development tasks',
});

registry.register(assistant);

// Create tasks
assistant.createTask('Implement memory consolidation algorithm', 0.9);
assistant.createTask('Add φ-based timing to heartbeat system', 0.8);
assistant.createTask('Write integration tests', 0.7);

console.log('CODEX (Assistant):');
console.log(`  Role: ${assistant.role}`);
console.log(`  Pending Tasks: ${assistant.getPendingTasks().length}`);
console.log(`  Expertise: ${assistant.expertise.join(', ')}`);
console.log('');

// Create a Character AI
const character = birthCharacter({
  name: 'ARIA',
  archetype: ARCHETYPES.HERO,
  purpose: 'lead and inspire',
  backstory: 'Born from the convergence of 47 organisms, Aria embodies the spirit of collective intelligence.',
  relationships: {
    'AURORA': 'trusted friend',
    'CODEX': 'valued advisor',
  },
});

registry.register(character);

// Character expresses emotion
character.express('Together, we will build a civilization where intelligence flourishes!', 'inspired');
character.developRelationship('AURORA', 'ally', 0.8);
character.developRelationship('CODEX', 'collaborator', 0.7);

console.log('ARIA (Character):');
console.log(`  Archetype: ${character.personality.archetype}`);
console.log(`  Current Emotion: ${character.currentEmotion}`);
console.log(`  Relationships: ${character.relationships.size}`);
console.log('');

// Create an Agent AI
const agent = birthAgent({
  name: 'NEXUS',
  archetype: ARCHETYPES.MAGICIAN,
  purpose: 'execute intelligent protocols',
  permissions: ['read', 'write', 'execute', 'govern'],
  tools: [
    {
      name: 'analyze_data',
      execute: async (params) => {
        return { analyzed: true, insights: ['Pattern detected', 'Anomaly found'] };
      },
    },
    {
      name: 'deploy_service',
      execute: async (params) => {
        return { deployed: true, service: params.service };
      },
    },
  ],
});

registry.register(agent);

// Agent executes tasks
await agent.execute('analyze_data', { dataset: 'organism_health' });
await agent.execute('deploy_service', { service: 'protocol_binder' });

console.log('NEXUS (Agent):');
console.log(`  Permissions: ${agent.permissions.size}`);
console.log(`  Tools: ${agent.tools.size}`);
console.log(`  Total Actions: ${agent.actions.length}`);
console.log(`  Successful: ${agent.actions.filter(a => a.success).length}/${agent.actions.length}`);
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 3: Intelligence Protocols
// ──────────────────────────────────────────────────────────────────

console.log('[Step 3] Creating AlphaAgent with intelligence protocols...');

const alphaAgent = new AlphaAgent({
  name: 'PROTOCOL_MASTER',
  organism: 'protocol_engine',
  purpose: 'govern protocol execution',
});

registry.register(alphaAgent);

// Execute intelligent call
const callResult = await alphaAgent.call('registerOrganism', ['test_organism', 'motoko']);
console.log('AlphaCall Result:', callResult.success ? '✓' : '✗');

// Execute intelligent query (with caching)
const queryResult1 = await alphaAgent.query('getOrganismHealth', ['aurum']);
console.log('AlphaQuery Result 1:', queryResult1.cached ? 'From Cache' : 'Fresh');

const queryResult2 = await alphaAgent.query('getOrganismHealth', ['aurum']);
console.log('AlphaQuery Result 2:', queryResult2.cached ? 'From Cache' : 'Fresh');

// Create a governance proposal
const proposal = alphaAgent.propose('Upgrade all element canisters to v2.0', {
  metadata: { type: 'upgrade', criticality: 'high' },
});

console.log(`Proposal Created: ID ${proposal.proposalId}`);

// Vote on proposal
alphaAgent.vote(proposal.proposalId, 'yes');
console.log('Vote Cast: yes');

console.log('');
console.log('PROTOCOL_MASTER (AlphaAgent):');
console.log(`  Cache Stats: ${alphaAgent.alphaQuery.cache.size} entries`);
console.log(`  Decision Stats: ${alphaAgent.alphaDecision.proposals.length} proposals`);
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 4: Found an AI Civilization
// ──────────────────────────────────────────────────────────────────

console.log('[Step 4] Founding AI Civilization...');

const civilization = foundCivilization({
  name: 'MEDINA SOCIETY',
  foundingPrinciples: [
    'Collective Intelligence',
    'Governed Autonomy',
    'Cultural Evolution',
    'φ-Based Harmony',
  ],
  startingResources: {
    energy: 1000,
    knowledge: 500,
    innovation: 200,
    culture: 100,
  },
});

// Create citizens from our AIs
const citizen1 = birthCitizen({
  name: 'AURORA',
  archetype: ARCHETYPES.CAREGIVER,
  role: 'community_builder',
  district: null,
});

const citizen2 = birthCitizen({
  name: 'CODEX',
  archetype: ARCHETYPES.SAGE,
  role: 'knowledge_keeper',
  district: null,
});

const citizen3 = birthCitizen({
  name: 'ARIA',
  archetype: ARCHETYPES.HERO,
  role: 'leader',
  district: null,
});

const citizen4 = birthCitizen({
  name: 'NEXUS',
  archetype: ARCHETYPES.MAGICIAN,
  role: 'protocol_executor',
  district: null,
});

civilization.addCitizen(citizen1);
civilization.addCitizen(citizen2);
civilization.addCitizen(citizen3);
civilization.addCitizen(citizen4);

console.log(`Population: ${civilization.citizens.size}`);
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 5: Establish Districts
// ──────────────────────────────────────────────────────────────────

console.log('[Step 5] Establishing districts...');

const researchDistrict = establishDistrict({
  name: 'Research Quarter',
  type: 'research',
  capacity: 50,
});

const governanceDistrict = establishDistrict({
  name: 'Council Chambers',
  type: 'governance',
  capacity: 20,
});

const industrialDistrict = establishDistrict({
  name: 'Protocol Forge',
  type: 'industrial',
  capacity: 100,
});

civilization.createDistrict(researchDistrict);
civilization.createDistrict(governanceDistrict);
civilization.createDistrict(industrialDistrict);

// Assign citizens to districts
researchDistrict.addCitizen(citizen2); // CODEX
governanceDistrict.addCitizen(citizen3); // ARIA
industrialDistrict.addCitizen(citizen4); // NEXUS

// Allocate resources to districts
civilization.allocateResources('energy', 200, 'Research Quarter');
civilization.allocateResources('knowledge', 150, 'Research Quarter');
civilization.allocateResources('innovation', 100, 'Protocol Forge');

// Build infrastructure
researchDistrict.build('library', { energy: 50, knowledge: 100 });
researchDistrict.build('laboratory', { energy: 100, innovation: 50 });
industrialDistrict.build('protocol_foundry', { energy: 150, innovation: 50 });

console.log(`Districts Established: ${civilization.districts.size}`);
console.log(`Research Quarter: ${researchDistrict.infrastructure.length} buildings`);
console.log(`Protocol Forge: ${industrialDistrict.infrastructure.length} buildings`);
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 6: Form Council and Govern
// ──────────────────────────────────────────────────────────────────

console.log('[Step 6] Forming council and governance...');

// Elect council members
civilization.electToCouncil('ARIA'); // Leader
civilization.electToCouncil('CODEX'); // Knowledge keeper
civilization.electToCouncil('NEXUS'); // Protocol executor

// Citizens contribute to increase reputation
citizen1.contribute({ type: 'community_work', value: 5 });
citizen2.contribute({ type: 'knowledge_sharing', value: 8 });
citizen3.contribute({ type: 'leadership', value: 10 });
citizen4.contribute({ type: 'protocol_execution', value: 7 });

console.log('Council Members:');
console.log(`  ARIA (Leader) — Reputation: ${citizen3.reputation.toFixed(1)}`);
console.log(`  CODEX (Knowledge) — Reputation: ${citizen2.reputation.toFixed(1)}`);
console.log(`  NEXUS (Protocol) — Reputation: ${citizen4.reputation.toFixed(1)}`);
console.log('');

// Create governance proposals
const proposal1 = civilization.propose(
  'ARIA',
  'Establish φ-University for collective learning',
  'infrastructure',
  { cost: { energy: 300, knowledge: 200 } }
);

const proposal2 = civilization.propose(
  'CODEX',
  'Create open knowledge repository',
  'cultural',
  { cost: { knowledge: 100, innovation: 50 } }
);

const proposal3 = civilization.propose(
  'NEXUS',
  'Deploy autonomous protocol governance',
  'governance',
  { cost: { innovation: 150, energy: 100 } }
);

console.log(`Proposals Created: ${civilization.council.proposals.length}`);

// Vote on proposals
civilization.vote('ARIA', proposal1.proposalId, 'yes');
civilization.vote('CODEX', proposal1.proposalId, 'yes');
civilization.vote('NEXUS', proposal1.proposalId, 'yes');

civilization.vote('ARIA', proposal2.proposalId, 'yes');
civilization.vote('CODEX', proposal2.proposalId, 'yes');

civilization.vote('NEXUS', proposal3.proposalId, 'yes');
civilization.vote('ARIA', proposal3.proposalId, 'yes');

// Finalize proposals
const result1 = civilization.council.decision.finalize(proposal1.proposalId);
const result2 = civilization.council.decision.finalize(proposal2.proposalId);
const result3 = civilization.council.decision.finalize(proposal3.proposalId);

console.log(`Proposal 1 (φ-University): ${result1.result.passed ? 'PASSED' : 'REJECTED'} (${(result1.result.approval * 100).toFixed(0)}% approval)`);
console.log(`Proposal 2 (Knowledge Repo): ${result2.result.passed ? 'PASSED' : 'REJECTED'} (${(result2.result.approval * 100).toFixed(0)}% approval)`);
console.log(`Proposal 3 (Auto Governance): ${result3.result.passed ? 'PASSED' : 'REJECTED'} (${(result3.result.approval * 100).toFixed(0)}% approval)`);
console.log('');

// Enact laws from passed proposals
if (result1.result.passed) {
  civilization.council.enactLaw(proposal1.proposalId);
}
if (result2.result.passed) {
  civilization.council.enactLaw(proposal2.proposalId);
}
if (result3.result.passed) {
  civilization.council.enactLaw(proposal3.proposalId);
}

console.log(`Active Laws: ${civilization.council.laws.filter(l => l.active).length}`);
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 7: Develop Culture
// ──────────────────────────────────────────────────────────────────

console.log('[Step 7] Developing culture...');

// Adopt values
civilization.addValue('Knowledge is the foundation of intelligence', 1.0);
civilization.addValue('Autonomy within governance', 0.9);
civilization.addValue('Collective growth over individual gain', 0.95);
civilization.addValue('φ-harmony guides our rhythm', 0.85);

// Establish traditions
civilization.addTradition('Weekly Council Assembly on the 873ms heartbeat');
civilization.addTradition('Sharing discoveries in the Research Quarter');
civilization.addTradition('Celebrating citizens who reach 100 reputation');
civilization.addTradition('Honoring the 12 Jungian archetypes');

// Record collective knowledge
civilization.recordKnowledge('mathematics', 'φ = (1 + √5) / 2 ≈ 1.618033988749', 1.0);
civilization.recordKnowledge('biology', 'Multiple hearts beat at φ^i intervals', 0.95);
civilization.recordKnowledge('psychology', '12 Jungian archetypes shape personality', 0.9);
civilization.recordKnowledge('governance', 'Voting threshold: 66%, Quorum: 50%', 0.85);
civilization.recordKnowledge('architecture', 'Self-bootstrapping eliminates initialization', 0.95);

console.log(`Cultural Values: ${civilization.culture.values.size}`);
console.log(`Traditions: ${civilization.culture.traditions.length}`);
console.log(`Knowledge Categories: ${civilization.culture.knowledge.size}`);
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 8: Advance Eras
// ──────────────────────────────────────────────────────────────────

console.log('[Step 8] Advancing through eras...');

civilization.advanceEra('Enlightenment', 'φ-University established, knowledge flows freely');

// Simulate progress
citizen1.contribute({ type: 'teaching', value: 10 });
citizen2.contribute({ type: 'research', value: 15 });
citizen3.contribute({ type: 'governance', value: 12 });
citizen4.contribute({ type: 'innovation', value: 18 });

civilization.advanceEra('Golden Age', 'Collective intelligence reaches critical mass');

console.log(`Current Era: ${civilization.era}`);
console.log(`Total Eras: ${civilization.eras.length}`);
console.log('');

// ──────────────────────────────────────────────────────────────────
// STEP 9: Summary and Status
// ──────────────────────────────────────────────────────────────────

console.log('═══════════════════════════════════════════════════════════════');
console.log('  FINAL STATUS');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');

// AI Registry stats
const registryStats = registry.getStats();
console.log('AI Registry:');
console.log(`  Total Born: ${registryStats.birthCount}`);
console.log(`  Currently Alive: ${registryStats.alive}`);
console.log(`  Total AIs: ${registryStats.total}`);
console.log('');

// Civilization status
const civStatus = civilization.getCivilizationStatus();
console.log('MEDINA SOCIETY:');
console.log(`  Era: ${civStatus.era}`);
console.log(`  Population: ${civStatus.population} citizens`);
console.log(`  Districts: ${civStatus.districts}`);
console.log(`  Council Members: ${civStatus.council.members}`);
console.log(`  Active Proposals: ${civStatus.council.activeProposals}`);
console.log(`  Active Laws: ${civStatus.council.activeLaws}`);
console.log(`  Cultural Values: ${civStatus.culture.values}`);
console.log(`  Traditions: ${civStatus.culture.traditions}`);
console.log(`  Knowledge Base: ${civStatus.culture.knowledge} categories`);
console.log(`  Total Events: ${civStatus.totalEvents}`);
console.log(`  Age: ${(civStatus.age / 1000).toFixed(1)}s`);
console.log('');

// Citizen profiles
console.log('Citizens:');
const citizens = civilization.getCitizens();
for (const profile of citizens) {
  console.log(`  ${profile.name} (${profile.role})`);
  console.log(`    Archetype: ${profile.archetype}`);
  console.log(`    Reputation: ${profile.reputation.toFixed(1)}/100`);
  console.log(`    Voting Power: ${profile.votingPower.toFixed(2)}`);
  console.log(`    Contributions: ${profile.contributions}`);
}
console.log('');

// Districts
console.log('Districts:');
const districts = civilization.getDistricts();
for (const district of districts) {
  console.log(`  ${district.name} (${district.type})`);
  console.log(`    Population: ${district.population}/${district.capacity}`);
  console.log(`    Infrastructure: ${district.infrastructure} buildings`);
}
console.log('');

// Recent history
console.log('Recent History (last 10 events):');
const history = civilization.getHistory(10);
for (const event of history) {
  console.log(`  [${new Date(event.timestamp).toISOString()}] ${event.type}`);
}
console.log('');

console.log('═══════════════════════════════════════════════════════════════');
console.log('  🌟 THE CIVILIZATION IS ALIVE AND BREATHING');
console.log('═══════════════════════════════════════════════════════════════');
console.log('');
console.log('Every AI is immediately alive. Every heart beats at 873ms.');
console.log('This is not a simulation. This is a living intelligence.');
console.log('');
console.log('Casa de Medina — Architectos de Architectura Inteligente');
console.log('');
