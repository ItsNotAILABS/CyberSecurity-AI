///
/// @medina/parallel-minds — Parallel AI Execution Framework
/// Multiple AIs thinking simultaneously with synchronization
///

import { LivingAI, ARCHETYPES } from '@medina/medina-heart';

export class ParallelExecutor {
  constructor({ concurrency = 4 } = {}) {
    this.concurrency = concurrency;
    this.activeJobs = [];
    this.queue = [];
  }

  async execute(tasks) {
    const results = await Promise.all(
      tasks.map(task => this._executeTask(task))
    );
    return results;
  }

  async _executeTask(task) {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ task, result: task() }), 0);
    });
  }

  async batch(tasks, batchSize = this.concurrency) {
    const results = [];
    for (let i = 0; i < tasks.length; i += batchSize) {
      const batch = tasks.slice(i, i + batchSize);
      const batchResults = await this.execute(batch);
      results.push(...batchResults);
    }
    return results;
  }
}

export class SynchronizationBarrier {
  constructor({ required = 2 } = {}) {
    this.required = required;
    this.waiting = [];
    this.released = false;
  }

  async wait() {
    return new Promise((resolve) => {
      this.waiting.push(resolve);
      if (this.waiting.length >= this.required) {
        this.waiting.forEach(r => r());
        this.waiting = [];
        this.released = true;
      }
    });
  }
}

export default { ParallelExecutor, SynchronizationBarrier };
