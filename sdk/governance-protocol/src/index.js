///
/// @medina/governance-protocol — Democratic AI Decision-Making
/// GPC-2026: Governance Protocol Charter
/// Proposals, voting, quorum, and policy enactment
///

import { PHI } from '@medina/medina-heart';

export class Proposal {
  constructor({ title, description, proposer, impact = 'medium', cost = 0 } = {}) {
    this.id = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.title = title;
    this.description = description;
    this.proposer = proposer;
    this.impact = impact; // low, medium, high, critical
    this.cost = cost;
    this.createdAt = Date.now();
    this.votingPeriod = 86400000; // 24 hours
    this.endsAt = this.createdAt + this.votingPeriod;
    this.status = 'voting'; // voting, passed, rejected, enacted
    this.votes = { for: 0, against: 0, abstain: 0 };
    this.voters = new Set();
  }

  isActive() {
    return this.status === 'voting' && Date.now() < this.endsAt;
  }

  castVote(voterId, vote) {
    if (!this.isActive()) {
      throw new Error('Proposal voting period ended');
    }

    if (this.voters.has(voterId)) {
      throw new Error('Voter already voted');
    }

    this.voters.add(voterId);

    if (vote === 'for') this.votes.for++;
    else if (vote === 'against') this.votes.against++;
    else if (vote === 'abstain') this.votes.abstain++;

    return this.checkOutcome();
  }

  checkOutcome() {
    if (!this.isActive()) {
      const totalVotes = this.votes.for + this.votes.against + this.votes.abstain;
      if (totalVotes === 0) {
        this.status = 'rejected';
        return { outcome: 'rejected', reason: 'no_votes' };
      }

      const approval = this.votes.for / (this.votes.for + this.votes.against);

      if (approval >= 0.66) {
        this.status = 'passed';
        return { outcome: 'passed', approval };
      } else {
        this.status = 'rejected';
        return { outcome: 'rejected', approval };
      }
    }

    return { outcome: 'pending' };
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      proposer: this.proposer,
      impact: this.impact,
      cost: this.cost,
      status: this.status,
      votes: this.votes,
      totalVoters: this.voters.size,
      createdAt: this.createdAt,
      endsAt: this.endsAt,
    };
  }
}

export class PolicyRegistry {
  constructor() {
    this.policies = new Map();
    this.activeCount = 0;
  }

  enact(proposal) {
    const policy = {
      id: `policy_${this.policies.size + 1}`,
      proposalId: proposal.id,
      title: proposal.title,
      description: proposal.description,
      enactedAt: Date.now(),
      enactedBy: proposal.proposer,
      active: true,
      impact: proposal.impact,
    };

    this.policies.set(policy.id, policy);
    this.activeCount++;

    return policy;
  }

  revoke(policyId) {
    const policy = this.policies.get(policyId);
    if (policy && policy.active) {
      policy.active = false;
      policy.revokedAt = Date.now();
      this.activeCount--;
      return true;
    }
    return false;
  }

  getActive() {
    return Array.from(this.policies.values()).filter(p => p.active);
  }

  get(policyId) {
    return this.policies.get(policyId);
  }
}

export class GovernanceEngine {
  constructor({ organismId, participants = [] } = {}) {
    this.organismId = organismId;
    this.participants = new Set([organismId, ...participants]);
    this.proposals = new Map();
    this.policyRegistry = new PolicyRegistry();
    this.votingHistory = [];
    this.quorumRequirement = 0.3; // 30% participation
    this.approvalThreshold = 0.66; // 66% supermajority
  }

  // Proposal submission
  submitProposal({ title, description, impact, cost }) {
    if (!title || !description) {
      throw new Error('Title and description required');
    }

    const proposal = new Proposal({
      title,
      description,
      proposer: this.organismId,
      impact,
      cost,
    });

    this.proposals.set(proposal.id, proposal);

    return proposal;
  }

  getProposal(proposalId) {
    return this.proposals.get(proposalId);
  }

  getActiveProposals() {
    return Array.from(this.proposals.values()).filter(p => p.isActive());
  }

  // Voting
  vote(proposalId, vote) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    const result = proposal.castVote(this.organismId, vote);

    this.votingHistory.push({
      proposalId,
      voterId: this.organismId,
      vote,
      timestamp: Date.now(),
    });

    // Check quorum and enact if passed
    if (result.outcome === 'passed') {
      const quorum = proposal.voters.size / this.participants.size;
      if (quorum >= this.quorumRequirement) {
        this.enactProposal(proposalId);
      }
    }

    return result;
  }

  // Quorum checking
  checkQuorum(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return { met: false, reason: 'not_found' };

    const participation = proposal.voters.size / this.participants.size;
    const met = participation >= this.quorumRequirement;

    return {
      met,
      participation,
      required: this.quorumRequirement,
      voters: proposal.voters.size,
      totalParticipants: this.participants.size,
    };
  }

  // Vote counting and validation
  countVotes(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) return null;

    const total = proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
    const validVotes = proposal.votes.for + proposal.votes.against;
    const approval = validVotes > 0 ? proposal.votes.for / validVotes : 0;

    return {
      proposalId,
      votes: proposal.votes,
      total,
      approval,
      passed: approval >= this.approvalThreshold,
      quorumMet: this.checkQuorum(proposalId).met,
    };
  }

  // Policy enactment
  enactProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    if (proposal.status !== 'passed') {
      throw new Error('Proposal has not passed');
    }

    const policy = this.policyRegistry.enact(proposal);
    proposal.status = 'enacted';

    // Immediate enactment
    return {
      enacted: true,
      policy,
      timestamp: Date.now(),
    };
  }

  revokePolicy(policyId) {
    return this.policyRegistry.revoke(policyId);
  }

  // Participant management
  addParticipant(organismId) {
    this.participants.add(organismId);
  }

  removeParticipant(organismId) {
    this.participants.delete(organismId);
  }

  // Governance statistics
  getGovernanceStats() {
    const proposals = Array.from(this.proposals.values());
    const passed = proposals.filter(p => p.status === 'passed' || p.status === 'enacted').length;
    const rejected = proposals.filter(p => p.status === 'rejected').length;

    return {
      organismId: this.organismId,
      participants: this.participants.size,
      totalProposals: proposals.length,
      activeProposals: this.getActiveProposals().length,
      passedProposals: passed,
      rejectedProposals: rejected,
      passRate: proposals.length > 0 ? passed / proposals.length : 0,
      activePolicies: this.policyRegistry.activeCount,
      votingHistory: this.votingHistory.length,
    };
  }

  getStatus() {
    return {
      organismId: this.organismId,
      participants: this.participants.size,
      proposals: this.proposals.size,
      activeProposals: this.getActiveProposals().length,
      activePolicies: this.policyRegistry.activeCount,
      quorumRequirement: this.quorumRequirement,
      approvalThreshold: this.approvalThreshold,
    };
  }
}

export default { Proposal, PolicyRegistry, GovernanceEngine };
