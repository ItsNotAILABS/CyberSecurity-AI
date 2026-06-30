///
/// @medina/native-git — φ-Based Version Control System
/// Organism-aware branching, living history, φ-based commit hashing
/// The future of distributed version control for AI systems
///

import { PHI, HEARTBEAT_MS } from '@medina/medina-heart';

export class Commit {
  constructor({ author, message, files = [], parent = null, timestamp = Date.now() } = {}) {
    this.author = author;
    this.message = message;
    this.files = files;
    this.parent = parent;
    this.timestamp = timestamp;
    this.hash = this._generateHash();
  }

  _generateHash() {
    const data = `${this.author}:${this.message}:${this.timestamp}:${this.parent || 'root'}`;
    const numeric = data.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `φ${Math.floor(numeric * PHI).toString(36)}`;
  }

  toJSON() {
    return {
      hash: this.hash,
      author: this.author,
      message: this.message,
      files: this.files.length,
      parent: this.parent,
      timestamp: this.timestamp,
    };
  }
}

export class Branch {
  constructor({ name, organismId = null, head = null } = {}) {
    this.name = name;
    this.organismId = organismId; // organism that owns this branch
    this.head = head; // latest commit hash
    this.created = Date.now();
    this.commits = [];
  }

  addCommit(commit) {
    this.commits.push(commit);
    this.head = commit.hash;
  }

  getHistory() {
    return this.commits.map(c => c.toJSON());
  }

  getCommit(hash) {
    return this.commits.find(c => c.hash === hash);
  }
}

export class OrganismBranch extends Branch {
  constructor({ name, organismId, parentBranch = null } = {}) {
    super({ name, organismId });
    this.parentBranch = parentBranch; // branch this organism branched from
    this.lineage = [organismId];
    this.mergedInto = null;
  }

  trackLineage(parentOrganismId) {
    if (!this.lineage.includes(parentOrganismId)) {
      this.lineage.unshift(parentOrganismId);
    }
  }

  merge(targetBranch) {
    this.mergedInto = targetBranch.name;
    return {
      from: this.name,
      into: targetBranch.name,
      commits: this.commits.length,
      timestamp: Date.now(),
    };
  }
}

export class Repository {
  constructor({ name, owner = 'medina' } = {}) {
    this.name = name;
    this.owner = owner;
    this.branches = new Map();
    this.tags = new Map();
    this.created = Date.now();

    // Create main branch
    const main = new Branch({ name: 'main' });
    this.branches.set('main', main);
    this.currentBranch = 'main';
  }

  createBranch(name, organismId = null) {
    if (this.branches.has(name)) {
      return { success: false, reason: 'branch_exists' };
    }

    const branch = organismId
      ? new OrganismBranch({ name, organismId, parentBranch: this.currentBranch })
      : new Branch({ name });

    // Copy commits from current branch
    const current = this.branches.get(this.currentBranch);
    branch.commits = [...current.commits];
    branch.head = current.head;

    this.branches.set(name, branch);

    return { success: true, branch: name };
  }

  switchBranch(name) {
    if (!this.branches.has(name)) {
      return { success: false, reason: 'branch_not_found' };
    }

    this.currentBranch = name;
    return { success: true, branch: name };
  }

  commit(author, message, files = []) {
    const branch = this.branches.get(this.currentBranch);
    const parent = branch.head;

    const commit = new Commit({ author, message, files, parent });
    branch.addCommit(commit);

    return commit;
  }

  tag(name, commitHash = null) {
    const branch = this.branches.get(this.currentBranch);
    const hash = commitHash || branch.head;

    this.tags.set(name, { hash, timestamp: Date.now() });

    return { tag: name, commit: hash };
  }

  log(branchName = null) {
    const branch = this.branches.get(branchName || this.currentBranch);
    return branch ? branch.getHistory() : [];
  }

  getStatus() {
    const branch = this.branches.get(this.currentBranch);

    return {
      repository: this.name,
      owner: this.owner,
      currentBranch: this.currentBranch,
      branches: this.branches.size,
      commits: branch.commits.length,
      tags: this.tags.size,
      head: branch.head,
    };
  }
}

export class DistributedHistory {
  constructor() {
    this.nodes = new Map(); // organismId -> Repository
    this.syncEvents = [];
  }

  registerNode(organismId, repository) {
    this.nodes.set(organismId, repository);
  }

  syncBranch(fromOrganism, toOrganism, branchName) {
    const fromRepo = this.nodes.get(fromOrganism);
    const toRepo = this.nodes.get(toOrganism);

    if (!fromRepo || !toRepo) {
      return { success: false, reason: 'node_not_found' };
    }

    const fromBranch = fromRepo.branches.get(branchName);
    if (!fromBranch) {
      return { success: false, reason: 'branch_not_found' };
    }

    // Clone branch to target repository
    const newBranch = new Branch({
      name: `${branchName}_from_${fromOrganism}`,
      organismId: fromOrganism,
    });
    newBranch.commits = [...fromBranch.commits];
    newBranch.head = fromBranch.head;

    toRepo.branches.set(newBranch.name, newBranch);

    const syncEvent = {
      from: fromOrganism,
      to: toOrganism,
      branch: branchName,
      commits: newBranch.commits.length,
      timestamp: Date.now(),
    };

    this.syncEvents.push(syncEvent);

    return { success: true, event: syncEvent };
  }

  getSyncHistory() {
    return this.syncEvents;
  }

  getNetworkStatus() {
    const stats = {
      nodes: this.nodes.size,
      totalBranches: 0,
      totalCommits: 0,
      syncEvents: this.syncEvents.length,
    };

    for (const repo of this.nodes.values()) {
      stats.totalBranches += repo.branches.size;
      for (const branch of repo.branches.values()) {
        stats.totalCommits += branch.commits.length;
      }
    }

    return stats;
  }
}

export class MergeEngine {
  constructor() {
    this.conflicts = [];
  }

  merge(sourceBranch, targetBranch) {
    // Find common ancestor
    const commonAncestor = this._findCommonAncestor(sourceBranch, targetBranch);

    // Get commits since common ancestor
    const sourceCommits = this._getCommitsSince(sourceBranch, commonAncestor);
    const targetCommits = this._getCommitsSince(targetBranch, commonAncestor);

    // Check for conflicts
    const conflicts = this._detectConflicts(sourceCommits, targetCommits);

    if (conflicts.length > 0) {
      this.conflicts = conflicts;
      return {
        success: false,
        reason: 'conflicts',
        conflicts,
      };
    }

    // Merge commits
    for (const commit of sourceCommits) {
      targetBranch.addCommit(commit);
    }

    return {
      success: true,
      merged: sourceCommits.length,
      from: sourceBranch.name,
      into: targetBranch.name,
    };
  }

  _findCommonAncestor(branch1, branch2) {
    // Simplified: find first common commit
    const hashes1 = new Set(branch1.commits.map(c => c.hash));

    for (const commit of branch2.commits) {
      if (hashes1.has(commit.hash)) {
        return commit.hash;
      }
    }

    return null;
  }

  _getCommitsSince(branch, ancestorHash) {
    if (!ancestorHash) return branch.commits;

    const index = branch.commits.findIndex(c => c.hash === ancestorHash);
    return branch.commits.slice(index + 1);
  }

  _detectConflicts(commits1, commits2) {
    const conflicts = [];

    // Simple conflict detection: check if same files modified
    const files1 = new Set();
    commits1.forEach(c => c.files.forEach(f => files1.add(f)));

    commits2.forEach(c => {
      c.files.forEach(f => {
        if (files1.has(f)) {
          conflicts.push({
            file: f,
            branch1: commits1[0]?.author,
            branch2: c.author,
          });
        }
      });
    });

    return conflicts;
  }

  resolveConflicts(resolutions) {
    // Mark conflicts as resolved
    this.conflicts = this.conflicts.filter(
      c => !resolutions.some(r => r.file === c.file)
    );

    return {
      resolved: resolutions.length,
      remaining: this.conflicts.length,
    };
  }
}

export class NativeGit {
  constructor({ organismId } = {}) {
    this.organismId = organismId;
    this.repositories = new Map();
    this.distributedHistory = new DistributedHistory();
    this.mergeEngine = new MergeEngine();
  }

  init(repoName) {
    if (this.repositories.has(repoName)) {
      return { success: false, reason: 'repo_exists' };
    }

    const repo = new Repository({ name: repoName, owner: this.organismId });
    this.repositories.set(repoName, repo);
    this.distributedHistory.registerNode(this.organismId, repo);

    return { success: true, repository: repoName };
  }

  getRepo(repoName) {
    return this.repositories.get(repoName);
  }

  commit(repoName, message, files = []) {
    const repo = this.repositories.get(repoName);
    if (!repo) {
      return { success: false, reason: 'repo_not_found' };
    }

    const commit = repo.commit(this.organismId, message, files);

    return { success: true, commit: commit.toJSON() };
  }

  branch(repoName, branchName) {
    const repo = this.repositories.get(repoName);
    if (!repo) {
      return { success: false, reason: 'repo_not_found' };
    }

    return repo.createBranch(branchName, this.organismId);
  }

  checkout(repoName, branchName) {
    const repo = this.repositories.get(repoName);
    if (!repo) {
      return { success: false, reason: 'repo_not_found' };
    }

    return repo.switchBranch(branchName);
  }

  merge(repoName, sourceBranch, targetBranch = null) {
    const repo = this.repositories.get(repoName);
    if (!repo) {
      return { success: false, reason: 'repo_not_found' };
    }

    const source = repo.branches.get(sourceBranch);
    const target = repo.branches.get(targetBranch || repo.currentBranch);

    if (!source || !target) {
      return { success: false, reason: 'branch_not_found' };
    }

    return this.mergeEngine.merge(source, target);
  }

  log(repoName, branchName = null) {
    const repo = this.repositories.get(repoName);
    if (!repo) return [];

    return repo.log(branchName);
  }

  sync(repoName, targetOrganismId, branchName) {
    return this.distributedHistory.syncBranch(
      this.organismId,
      targetOrganismId,
      branchName
    );
  }

  getStatus() {
    return {
      organismId: this.organismId,
      repositories: this.repositories.size,
      distributedNodes: this.distributedHistory.nodes.size,
      syncEvents: this.distributedHistory.syncEvents.length,
    };
  }
}

export default { Commit, Branch, OrganismBranch, Repository, DistributedHistory, MergeEngine, NativeGit };
