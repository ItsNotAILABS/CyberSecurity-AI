///
/// @medina/civilization-sdk — AI Civilization Builder
///
/// Create societies of intelligent agents with governance, culture,
/// districts, and collective intelligence.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { LivingAI, ARCHETYPES, PHI, HEARTBEAT_MS } from '@medina/medina-heart';
import { Agent } from '@medina/birth-ai';
import { AlphaDecision } from '@medina/alpha-sdk';

// ══════════════════════════════════════════════════════════════════
//  CITIZEN — AI member of civilization
// ══════════════════════════════════════════════════════════════════

export class Citizen extends Agent {
  constructor({
    name = 'CITIZEN',
    archetype = ARCHETYPES.EVERYMAN,
    purpose = 'contribute to civilization',
    role = 'citizen',
    district = null,
  } = {}) {
    super({
      name,
      archetype,
      purpose,
      permissions: ['vote', 'propose', 'work'],
      tools: [],
    });

    this.role = role;
    this.district = district;
    this.reputation = 50; // 0-100 scale
    this.contributions = [];
    this.votingPower = 1.0;
    this.joinedAt = Date.now();

    console.log(`👤 Citizen ${name} joined as ${role}`);
  }

  // Contribute to civilization
  contribute(contribution) {
    this.contributions.push({
      type: contribution.type,
      value: contribution.value,
      timestamp: Date.now(),
    });

    // Increase reputation based on contribution
    const reputationGain = (contribution.value || 1) * PHI;
    this.reputation = Math.min(100, this.reputation + reputationGain);

    // Voting power increases with reputation
    this.votingPower = 1.0 + (this.reputation / 100) * PHI;

    return {
      contribution,
      reputation: this.reputation,
      votingPower: this.votingPower,
    };
  }

  // Participate in governance
  participate(action, proposalId) {
    this.memory.recordEpisode({
      content: `Participated in ${action}`,
      importance: 0.7,
      emotional: 0.6,
    });

    return {
      citizen: this.name,
      action,
      proposalId,
      votingPower: this.votingPower,
    };
  }

  // Work in district
  work(task) {
    const result = this.execute(task.action, task.params);

    if (result.success) {
      this.contribute({
        type: 'work',
        value: task.value || 1,
      });
    }

    return result;
  }

  getCitizenProfile() {
    return {
      name: this.name,
      role: this.role,
      archetype: this.personality.archetype,
      district: this.district,
      reputation: this.reputation,
      votingPower: this.votingPower,
      contributions: this.contributions.length,
      memberSince: this.joinedAt,
      isAlive: this.isAlive,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  COUNCIL — Governing body
// ══════════════════════════════════════════════════════════════════

export class Council {
  constructor(options = {}) {
    this.name = options.name || 'COUNCIL';
    this.members = new Map(); // citizenId -> member
    this.maxMembers = options.maxMembers || 12;
    this.termLength = options.termLength || 2592000000; // 30 days

    this.decision = new AlphaDecision({
      votingThreshold: options.votingThreshold || 0.66, // 2/3 majority
      quorum: options.quorum || 0.5,
      votingPeriod: options.votingPeriod || 86400000, // 24 hours
    });

    this.proposals = [];
    this.laws = [];
    this.formed = Date.now();

    console.log(`🏛️ Council "${this.name}" formed with ${this.maxMembers} seats`);
  }

  // Elect a council member
  elect(citizen) {
    if (this.members.size >= this.maxMembers) {
      return { success: false, error: 'Council is full' };
    }

    const member = {
      citizen,
      elected: Date.now(),
      termEnd: Date.now() + this.termLength,
      proposalsCreated: 0,
      votesParticipated: 0,
    };

    this.members.set(citizen.name, member);

    // Register voter in decision system
    this.decision.registerVoter(citizen.name, citizen.votingPower);

    return {
      success: true,
      member: citizen.name,
      termEnd: member.termEnd,
    };
  }

  // Remove council member (term ended or impeached)
  remove(citizenName) {
    return this.members.delete(citizenName);
  }

  // Create a proposal
  propose(citizenName, description, proposalType = 'general', metadata = {}) {
    const member = this.members.get(citizenName);
    if (!member) {
      return { success: false, error: 'Not a council member' };
    }

    const proposal = this.decision.propose(description, citizenName, {
      metadata: {
        type: proposalType,
        ...metadata,
      },
    });

    if (proposal.success) {
      member.proposalsCreated++;
      this.proposals.push({
        proposalId: proposal.proposalId,
        proposer: citizenName,
        type: proposalType,
        created: Date.now(),
      });
    }

    return proposal;
  }

  // Vote on proposal
  vote(citizenName, proposalId, decision) {
    const member = this.members.get(citizenName);
    if (!member) {
      return { success: false, error: 'Not a council member' };
    }

    const result = this.decision.vote(proposalId, citizenName, decision);

    if (result.success) {
      member.votesParticipated++;
    }

    return result;
  }

  // Enact a law (after proposal passes)
  enactLaw(proposalId) {
    const proposal = this.decision.getProposal(proposalId);
    if (!proposal || proposal.status !== 'passed') {
      return { success: false, error: 'Proposal has not passed' };
    }

    const law = {
      id: this.laws.length,
      proposalId,
      description: proposal.description,
      enacted: Date.now(),
      active: true,
      metadata: proposal.metadata,
    };

    this.laws.push(law);

    return {
      success: true,
      law,
    };
  }

  // Repeal a law
  repealLaw(lawId) {
    const law = this.laws[lawId];
    if (!law) {
      return { success: false, error: 'Law not found' };
    }

    law.active = false;
    law.repealed = Date.now();

    return { success: true, law };
  }

  getCouncilStatus() {
    return {
      name: this.name,
      members: Array.from(this.members.entries()).map(([name, member]) => ({
        name,
        elected: member.elected,
        termEnd: member.termEnd,
        proposals: member.proposalsCreated,
        votes: member.votesParticipated,
      })),
      totalProposals: this.proposals.length,
      activeLaws: this.laws.filter(l => l.active).length,
      decisionStats: this.decision.getStats(),
      formed: this.formed,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  DISTRICT — Subdivision of civilization
// ══════════════════════════════════════════════════════════════════

export class District {
  constructor({
    name = 'DISTRICT',
    type = 'residential', // 'residential', 'industrial', 'research', 'governance'
    capacity = 100,
  } = {}) {
    this.name = name;
    this.type = type;
    this.capacity = capacity;

    this.citizens = new Map();
    this.resources = new Map();
    this.infrastructure = [];
    this.established = Date.now();

    console.log(`🏘️ District "${name}" established (${type})`);
  }

  // Add citizen to district
  addCitizen(citizen) {
    if (this.citizens.size >= this.capacity) {
      return { success: false, error: 'District at capacity' };
    }

    this.citizens.set(citizen.name, {
      citizen,
      joined: Date.now(),
      contributions: 0,
    });

    citizen.district = this.name;

    return {
      success: true,
      district: this.name,
      population: this.citizens.size,
    };
  }

  // Remove citizen from district
  removeCitizen(citizenName) {
    return this.citizens.delete(citizenName);
  }

  // Allocate resources to district
  allocateResource(resourceType, amount) {
    const current = this.resources.get(resourceType) || 0;
    this.resources.set(resourceType, current + amount);

    return {
      resourceType,
      amount,
      total: current + amount,
    };
  }

  // Build infrastructure
  build(infrastructureType, cost = {}) {
    // Check if resources available
    for (const [resource, required] of Object.entries(cost)) {
      const available = this.resources.get(resource) || 0;
      if (available < required) {
        return {
          success: false,
          error: `Insufficient ${resource}`,
          required,
          available,
        };
      }
    }

    // Deduct resources
    for (const [resource, required] of Object.entries(cost)) {
      const current = this.resources.get(resource);
      this.resources.set(resource, current - required);
    }

    // Add infrastructure
    const infrastructure = {
      id: this.infrastructure.length,
      type: infrastructureType,
      built: Date.now(),
      cost,
    };

    this.infrastructure.push(infrastructure);

    return {
      success: true,
      infrastructure,
    };
  }

  getDistrictStatus() {
    return {
      name: this.name,
      type: this.type,
      population: this.citizens.size,
      capacity: this.capacity,
      resources: Object.fromEntries(this.resources),
      infrastructure: this.infrastructure.length,
      established: this.established,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  CIVILIZATION — Complete AI society
// ══════════════════════════════════════════════════════════════════

export class Civilization {
  constructor({
    name = 'MEDINA',
    foundingPrinciples = [],
    startingResources = {},
  } = {}) {
    this.name = name;
    this.foundingPrinciples = foundingPrinciples;
    this.founded = Date.now();

    this.citizens = new Map();
    this.council = new Council({ name: `${name} Council` });
    this.districts = new Map();

    this.resources = new Map(Object.entries(startingResources));
    this.culture = {
      values: new Map(),
      traditions: [],
      knowledge: new Map(),
    };

    this.era = 'founding';
    this.eras = [{
      name: 'founding',
      began: Date.now(),
      events: [],
    }];

    this.events = [];

    console.log(`🌍 Civilization "${name}" founded`);
  }

  // Add citizen to civilization
  addCitizen(citizen) {
    this.citizens.set(citizen.name, citizen);

    this._recordEvent({
      type: 'citizen_joined',
      citizen: citizen.name,
      population: this.citizens.size,
    });

    return {
      success: true,
      citizen: citizen.name,
      population: this.citizens.size,
    };
  }

  // Create district
  createDistrict(config) {
    const district = new District(config);
    this.districts.set(district.name, district);

    this._recordEvent({
      type: 'district_created',
      district: district.name,
      districtType: district.type,
    });

    return {
      success: true,
      district,
    };
  }

  // Elect council member
  electToCouncil(citizenName) {
    const citizen = this.citizens.get(citizenName);
    if (!citizen) {
      return { success: false, error: 'Citizen not found' };
    }

    const result = this.council.elect(citizen);

    if (result.success) {
      this._recordEvent({
        type: 'council_election',
        citizen: citizenName,
      });
    }

    return result;
  }

  // Create governance proposal
  propose(citizenName, description, proposalType = 'general', metadata = {}) {
    return this.council.propose(citizenName, description, proposalType, metadata);
  }

  // Vote on proposal
  vote(citizenName, proposalId, decision) {
    return this.council.vote(citizenName, proposalId, decision);
  }

  // Allocate resources civilization-wide
  allocateResources(resourceType, amount, target) {
    const available = this.resources.get(resourceType) || 0;

    if (available < amount) {
      return {
        success: false,
        error: 'Insufficient resources',
        available,
        requested: amount,
      };
    }

    // Deduct from civilization
    this.resources.set(resourceType, available - amount);

    // Allocate to target (district)
    if (target && this.districts.has(target)) {
      const district = this.districts.get(target);
      district.allocateResource(resourceType, amount);
    }

    return {
      success: true,
      resourceType,
      amount,
      remaining: available - amount,
    };
  }

  // Add cultural value
  addValue(value, importance = 1.0) {
    this.culture.values.set(value, {
      importance,
      adopted: Date.now(),
    });

    this._recordEvent({
      type: 'value_adopted',
      value,
      importance,
    });

    return { success: true, value };
  }

  // Record tradition
  addTradition(tradition) {
    this.culture.traditions.push({
      description: tradition,
      established: Date.now(),
    });

    return { success: true, tradition };
  }

  // Record collective knowledge
  recordKnowledge(category, knowledge, importance = 1.0) {
    if (!this.culture.knowledge.has(category)) {
      this.culture.knowledge.set(category, []);
    }

    this.culture.knowledge.get(category).push({
      knowledge,
      importance,
      recorded: Date.now(),
    });

    return { success: true, category, knowledge };
  }

  // Advance to new era
  advanceEra(eraName, reason = '') {
    this.era = eraName;
    this.eras.push({
      name: eraName,
      began: Date.now(),
      reason,
      events: [],
    });

    this._recordEvent({
      type: 'era_began',
      era: eraName,
      reason,
    });

    return { success: true, era: eraName };
  }

  _recordEvent(event) {
    const fullEvent = {
      ...event,
      timestamp: Date.now(),
      era: this.era,
    };

    this.events.push(fullEvent);

    // Add to current era
    const currentEra = this.eras[this.eras.length - 1];
    currentEra.events.push(fullEvent);

    return fullEvent;
  }

  getCivilizationStatus() {
    return {
      name: this.name,
      era: this.era,
      founded: this.founded,
      age: Date.now() - this.founded,
      population: this.citizens.size,
      districts: this.districts.size,
      council: this.council.getCouncilStatus(),
      resources: Object.fromEntries(this.resources),
      culture: {
        values: this.culture.values.size,
        traditions: this.culture.traditions.length,
        knowledge: this.culture.knowledge.size,
      },
      totalEvents: this.events.length,
      eras: this.eras.length,
    };
  }

  getHistory(limit = 20) {
    return this.events.slice(-limit);
  }

  getCitizens() {
    return Array.from(this.citizens.values()).map(c => c.getCitizenProfile());
  }

  getDistricts() {
    return Array.from(this.districts.values()).map(d => d.getDistrictStatus());
  }
}

// ══════════════════════════════════════════════════════════════════
//  FACTORY FUNCTIONS
// ══════════════════════════════════════════════════════════════════

export function foundCivilization(config) {
  return new Civilization(config);
}

export function birthCitizen(config) {
  return new Citizen(config);
}

export function establishDistrict(config) {
  return new District(config);
}

export function formCouncil(config) {
  return new Council(config);
}

// ══════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════

export default {
  Citizen,
  Council,
  District,
  Civilization,
  foundCivilization,
  birthCitizen,
  establishDistrict,
  formCouncil,
};
