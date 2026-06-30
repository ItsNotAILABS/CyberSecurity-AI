///
/// @medina/alpha-sdk — Intelligence Protocol SDK
///
/// Governed AI operations with intelligent caching, decision making,
/// and autonomous agents that follow protocol rules.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import { LivingAI, ARCHETYPES, PHI, HEARTBEAT_MS } from '@medina/medina-heart';

// ══════════════════════════════════════════════════════════════════
//  ALPHACALL — Intelligent write operations
// ══════════════════════════════════════════════════════════════════

export class AlphaCall {
  constructor(organism, options = {}) {
    this.organism = organism;
    this.validateInputs = options.validateInputs !== false;
    this.requireApproval = options.requireApproval || false;
    this.logOperations = options.logOperations !== false;

    this.callHistory = [];
    this.pendingApprovals = [];

    console.log(`🔧 AlphaCall initialized for ${organism}`);
  }

  // Execute a write operation
  async call(method, args = [], context = {}) {
    const operation = {
      id: this.callHistory.length,
      method,
      args,
      context,
      timestamp: Date.now(),
      status: 'pending',
      result: null,
      error: null,
    };

    // Validation
    if (this.validateInputs) {
      const validation = this._validate(method, args);
      if (!validation.valid) {
        operation.status = 'rejected';
        operation.error = validation.error;
        this.callHistory.push(operation);
        return { success: false, error: validation.error };
      }
    }

    // Approval check
    if (this.requireApproval) {
      this.pendingApprovals.push(operation);
      return {
        success: false,
        pending: true,
        approvalId: operation.id,
        message: 'Operation requires approval',
      };
    }

    // Execute
    try {
      const result = await this._execute(method, args, context);
      operation.status = 'completed';
      operation.result = result;

      if (this.logOperations) {
        this.callHistory.push(operation);
      }

      return {
        success: true,
        result,
        operationId: operation.id,
      };
    } catch (error) {
      operation.status = 'failed';
      operation.error = error.message;
      this.callHistory.push(operation);

      return {
        success: false,
        error: error.message,
        operationId: operation.id,
      };
    }
  }

  // Approve pending operation
  approve(approvalId) {
    const operation = this.pendingApprovals.find(op => op.id === approvalId);
    if (!operation) {
      return { success: false, error: 'Approval not found' };
    }

    // Remove from pending and execute
    this.pendingApprovals = this.pendingApprovals.filter(op => op.id !== approvalId);
    return this._execute(operation.method, operation.args, operation.context);
  }

  // Reject pending operation
  reject(approvalId, reason) {
    const operation = this.pendingApprovals.find(op => op.id === approvalId);
    if (!operation) {
      return { success: false, error: 'Approval not found' };
    }

    operation.status = 'rejected';
    operation.error = reason;
    this.pendingApprovals = this.pendingApprovals.filter(op => op.id !== approvalId);
    this.callHistory.push(operation);

    return { success: true, rejected: true };
  }

  _validate(method, args) {
    // Basic validation - can be overridden
    if (typeof method !== 'string' || method.length === 0) {
      return { valid: false, error: 'Invalid method name' };
    }
    if (!Array.isArray(args)) {
      return { valid: false, error: 'Arguments must be an array' };
    }
    return { valid: true };
  }

  async _execute(method, args, context) {
    // Placeholder for actual execution
    // In real implementation, this would call the organism's method
    return {
      method,
      args,
      context,
      executed: true,
      timestamp: Date.now(),
    };
  }

  getHistory(limit = 10) {
    return this.callHistory.slice(-limit);
  }

  getPendingApprovals() {
    return this.pendingApprovals;
  }
}

// ══════════════════════════════════════════════════════════════════
//  ALPHAQUERY — Intelligent read operations with caching
// ══════════════════════════════════════════════════════════════════

export class AlphaQuery {
  constructor(organism, options = {}) {
    this.organism = organism;
    this.cacheEnabled = options.cacheEnabled !== false;
    this.cacheTTL = options.cacheTTL || 60000; // 1 minute default
    this.cacheStrategy = options.cacheStrategy || 'lru'; // 'lru' or 'ttl'
    this.maxCacheSize = options.maxCacheSize || 100;

    this.cache = new Map();
    this.cacheAccessTimes = new Map();
    this.queryHistory = [];

    console.log(`🔍 AlphaQuery initialized for ${organism} with caching`);
  }

  // Execute a read operation
  async query(method, args = [], context = {}) {
    const cacheKey = this._getCacheKey(method, args);
    const timestamp = Date.now();

    // Check cache
    if (this.cacheEnabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      const age = timestamp - cached.timestamp;

      if (age < this.cacheTTL) {
        // Update access time for LRU
        this.cacheAccessTimes.set(cacheKey, timestamp);

        this.queryHistory.push({
          method,
          args,
          cached: true,
          timestamp,
        });

        return {
          success: true,
          result: cached.result,
          cached: true,
          age,
        };
      } else {
        // Expired - remove from cache
        this.cache.delete(cacheKey);
        this.cacheAccessTimes.delete(cacheKey);
      }
    }

    // Execute query
    try {
      const result = await this._executeQuery(method, args, context);

      // Store in cache
      if (this.cacheEnabled) {
        this._addToCache(cacheKey, result, timestamp);
      }

      this.queryHistory.push({
        method,
        args,
        cached: false,
        timestamp,
      });

      return {
        success: true,
        result,
        cached: false,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  _getCacheKey(method, args) {
    return `${method}:${JSON.stringify(args)}`;
  }

  _addToCache(key, result, timestamp) {
    // Evict if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this._evict();
    }

    this.cache.set(key, { result, timestamp });
    this.cacheAccessTimes.set(key, timestamp);
  }

  _evict() {
    if (this.cacheStrategy === 'lru') {
      // Remove least recently used
      let oldest = Date.now();
      let oldestKey = null;

      for (const [key, time] of this.cacheAccessTimes.entries()) {
        if (time < oldest) {
          oldest = time;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.cacheAccessTimes.delete(oldestKey);
      }
    } else {
      // TTL - remove oldest entry by timestamp
      let oldest = Date.now();
      let oldestKey = null;

      for (const [key, entry] of this.cache.entries()) {
        if (entry.timestamp < oldest) {
          oldest = entry.timestamp;
          oldestKey = key;
        }
      }

      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.cacheAccessTimes.delete(oldestKey);
      }
    }
  }

  async _executeQuery(method, args, context) {
    // Placeholder for actual query execution
    return {
      method,
      args,
      context,
      queried: true,
      timestamp: Date.now(),
    };
  }

  clearCache() {
    this.cache.clear();
    this.cacheAccessTimes.clear();
    return { cleared: true };
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      ttl: this.cacheTTL,
      strategy: this.cacheStrategy,
    };
  }

  getQueryHistory(limit = 10) {
    return this.queryHistory.slice(-limit);
  }
}

// ══════════════════════════════════════════════════════════════════
//  ALPHADECISION — Governed decision making with voting
// ══════════════════════════════════════════════════════════════════

export class AlphaDecision {
  constructor(options = {}) {
    this.votingThreshold = options.votingThreshold || 0.5; // 50% default
    this.quorum = options.quorum || 0.3; // 30% participation required
    this.votingPeriod = options.votingPeriod || 300000; // 5 minutes

    this.proposals = [];
    this.voters = new Map(); // voterId -> voting power
    this.decisions = [];

    console.log(`⚖️ AlphaDecision initialized with ${this.votingThreshold * 100}% threshold`);
  }

  // Register a voter with voting power
  registerVoter(voterId, votingPower = 1.0) {
    this.voters.set(voterId, votingPower);
    return { registered: voterId, power: votingPower };
  }

  // Create a proposal for decision
  propose(description, proposer, options = {}) {
    const proposal = {
      id: this.proposals.length,
      description,
      proposer,
      created: Date.now(),
      deadline: Date.now() + this.votingPeriod,
      status: 'active',
      votes: {
        yes: [],
        no: [],
        abstain: [],
      },
      result: null,
      metadata: options.metadata || {},
    };

    this.proposals.push(proposal);

    return {
      success: true,
      proposalId: proposal.id,
      deadline: proposal.deadline,
    };
  }

  // Cast a vote
  vote(proposalId, voterId, decision) {
    const proposal = this.proposals[proposalId];
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    if (proposal.status !== 'active') {
      return { success: false, error: 'Proposal is not active' };
    }

    if (Date.now() > proposal.deadline) {
      return { success: false, error: 'Voting period has ended' };
    }

    if (!this.voters.has(voterId)) {
      return { success: false, error: 'Voter not registered' };
    }

    // Remove any previous vote
    proposal.votes.yes = proposal.votes.yes.filter(v => v.voterId !== voterId);
    proposal.votes.no = proposal.votes.no.filter(v => v.voterId !== voterId);
    proposal.votes.abstain = proposal.votes.abstain.filter(v => v.voterId !== voterId);

    // Add new vote
    const vote = {
      voterId,
      power: this.voters.get(voterId),
      timestamp: Date.now(),
    };

    if (decision === 'yes') {
      proposal.votes.yes.push(vote);
    } else if (decision === 'no') {
      proposal.votes.no.push(vote);
    } else {
      proposal.votes.abstain.push(vote);
    }

    return { success: true, voted: decision };
  }

  // Finalize a proposal
  finalize(proposalId) {
    const proposal = this.proposals[proposalId];
    if (!proposal) {
      return { success: false, error: 'Proposal not found' };
    }

    if (proposal.status !== 'active') {
      return { success: false, error: 'Proposal already finalized' };
    }

    // Calculate results
    const totalPower = Array.from(this.voters.values()).reduce((sum, p) => sum + p, 0);
    const yesVotes = proposal.votes.yes.reduce((sum, v) => sum + v.power, 0);
    const noVotes = proposal.votes.no.reduce((sum, v) => sum + v.power, 0);
    const totalVotes = yesVotes + noVotes;
    const participation = totalVotes / totalPower;

    // Check quorum
    if (participation < this.quorum) {
      proposal.status = 'failed';
      proposal.result = {
        passed: false,
        reason: 'quorum_not_met',
        participation,
        required: this.quorum,
      };
    } else {
      // Check threshold
      const approval = yesVotes / totalVotes;
      const passed = approval >= this.votingThreshold;

      proposal.status = passed ? 'passed' : 'rejected';
      proposal.result = {
        passed,
        approval,
        yesVotes,
        noVotes,
        participation,
        threshold: this.votingThreshold,
      };
    }

    this.decisions.push({
      proposalId,
      result: proposal.result,
      finalized: Date.now(),
    });

    return {
      success: true,
      result: proposal.result,
    };
  }

  // Auto-finalize expired proposals
  autoFinalize() {
    const now = Date.now();
    let finalized = 0;

    for (const proposal of this.proposals) {
      if (proposal.status === 'active' && now > proposal.deadline) {
        this.finalize(proposal.id);
        finalized++;
      }
    }

    return { finalized };
  }

  getProposal(proposalId) {
    return this.proposals[proposalId];
  }

  getActiveProposals() {
    return this.proposals.filter(p => p.status === 'active');
  }

  getDecisionHistory(limit = 10) {
    return this.decisions.slice(-limit);
  }

  getStats() {
    return {
      totalProposals: this.proposals.length,
      activeProposals: this.proposals.filter(p => p.status === 'active').length,
      passedProposals: this.proposals.filter(p => p.status === 'passed').length,
      registeredVoters: this.voters.size,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  ALPHAAGENT — Autonomous intelligence agent
// ══════════════════════════════════════════════════════════════════

export class AlphaAgent extends LivingAI {
  constructor({
    name = 'ALPHA-AGENT',
    archetype = ARCHETYPES.MAGICIAN,
    purpose = 'execute intelligent protocols',
    organism = null,
  } = {}) {
    super({
      name,
      archetype,
      purpose,
      numHearts: 2,
      numBrains: 3,
      calendar: 'phi',
      heartbeatMs: HEARTBEAT_MS,
    });

    this.organism = organism;
    this.alphaCall = new AlphaCall(organism || name);
    this.alphaQuery = new AlphaQuery(organism || name);
    this.alphaDecision = new AlphaDecision();

    this.tasks = [];
    this.completedTasks = [];
    this.autonomous = true;

    console.log(`🤖 AlphaAgent ${name} initialized with intelligence protocols`);
  }

  // Execute intelligent call
  async call(method, args = [], context = {}) {
    const result = await this.alphaCall.call(method, args, context);

    this.memory.recordEpisode({
      content: `Called ${method}`,
      importance: 0.7,
      emotional: 0.5,
    });

    return result;
  }

  // Execute intelligent query
  async query(method, args = [], context = {}) {
    const result = await this.alphaQuery.query(method, args, context);

    if (!result.cached) {
      this.memory.remember({
        type: 'query',
        method,
        args,
        timestamp: Date.now(),
      });
    }

    return result;
  }

  // Create a decision proposal
  propose(description, options = {}) {
    return this.alphaDecision.propose(description, this.name, options);
  }

  // Vote on a proposal
  vote(proposalId, decision) {
    // Register self as voter if not already
    if (!this.alphaDecision.voters.has(this.name)) {
      this.alphaDecision.registerVoter(this.name, 1.0);
    }

    return this.alphaDecision.vote(proposalId, this.name, decision);
  }

  // Autonomous task execution
  async executeTask(task) {
    this.tasks.push(task);
    this.setGoal(task.description, task.priority || 0.5);

    try {
      // Decide how to approach the task
      const approach = await this._planApproach(task);

      // Execute the task using intelligent protocols
      const result = await this._executeWithProtocols(task, approach);

      this.completedTasks.push({
        task,
        result,
        completed: Date.now(),
      });

      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async _planApproach(task) {
    // Use personality and purpose to plan approach
    const traits = this.personality.getTraits();

    return {
      strategy: traits.strategy,
      confidence: this.personality.conscientiousness,
      creativity: this.personality.openness,
    };
  }

  async _executeWithProtocols(task, approach) {
    // Placeholder for protocol-based execution
    // In real implementation, this would use the organism's protocols
    return {
      task: task.description,
      approach,
      executed: true,
      timestamp: Date.now(),
    };
  }

  getAgentStatus() {
    return {
      name: this.name,
      organism: this.organism,
      autonomous: this.autonomous,
      archetype: this.personality.archetype,
      totalTasks: this.tasks.length,
      completedTasks: this.completedTasks.length,
      cacheStats: this.alphaQuery.getCacheStats(),
      decisionStats: this.alphaDecision.getStats(),
      isAlive: this.isAlive,
    };
  }
}

// ══════════════════════════════════════════════════════════════════
//  ALPHA — Convenience namespace
// ══════════════════════════════════════════════════════════════════

export const alpha = {
  // Create an AlphaAgent and execute call
  async call(organism, method, args = [], context = {}) {
    const agent = new AlphaAgent({ organism });
    return agent.call(method, args, context);
  },

  // Create an AlphaAgent and execute query
  async query(organism, method, args = [], context = {}) {
    const agent = new AlphaAgent({ organism });
    return agent.query(method, args, context);
  },

  // Create a decision proposal
  decide(description, options = {}) {
    const decision = new AlphaDecision(options);
    return decision.propose(description, 'system', options);
  },

  // Spawn a new AlphaAgent
  spawn(config) {
    return new AlphaAgent(config);
  },
};

// ══════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════

export default {
  AlphaCall,
  AlphaQuery,
  AlphaDecision,
  AlphaAgent,
  alpha,
};
