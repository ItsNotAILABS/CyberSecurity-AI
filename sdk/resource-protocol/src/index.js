///
/// @medina/resource-protocol — Distributed Resource Allocation
/// RSPC-2026: Resource Protocol Charter
/// CPU, memory, storage, energy, and bandwidth management
///

import { PHI } from '@medina/medina-heart';

export class Resource {
  constructor({ type, total, available, unit = 'units' } = {}) {
    this.type = type; // CPU, memory, storage, energy, bandwidth
    this.total = total;
    this.available = available;
    this.allocated = total - available;
    this.unit = unit;
    this.lastUpdated = Date.now();
  }

  allocate(amount) {
    if (amount > this.available) {
      return { success: false, reason: 'insufficient_resources' };
    }

    this.available -= amount;
    this.allocated += amount;
    this.lastUpdated = Date.now();

    return { success: true, allocated: amount, remaining: this.available };
  }

  release(amount) {
    this.allocated -= amount;
    this.available += amount;
    if (this.available > this.total) this.available = this.total;
    this.lastUpdated = Date.now();
  }

  getUtilization() {
    return this.allocated / this.total;
  }
}

export class ResourceAdvertisement {
  constructor({ organismId, resources = {} } = {}) {
    this.organismId = organismId;
    this.resources = resources;
    this.timestamp = Date.now();
    this.ttl = 30000; // 30 seconds
  }

  isExpired() {
    return Date.now() - this.timestamp > this.ttl;
  }

  hasResource(type, amount) {
    const resource = this.resources[type];
    return resource && resource.available >= amount;
  }
}

export class AllocationRequest {
  constructor({ requesterId, resourceType, amount, priority = 'normal' } = {}) {
    this.id = `alloc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.requesterId = requesterId;
    this.resourceType = resourceType;
    this.amount = amount;
    this.priority = priority; // critical, high, normal, low
    this.timestamp = Date.now();
    this.status = 'pending'; // pending, granted, denied
    this.grantedBy = null;
  }

  grant(providerId) {
    this.status = 'granted';
    this.grantedBy = providerId;
    return { requestId: this.id, granted: true };
  }

  deny(reason) {
    this.status = 'denied';
    return { requestId: this.id, granted: false, reason };
  }
}

export class FairShareAllocator {
  constructor() {
    this.contributions = new Map();
    this.allocations = new Map();
  }

  recordContribution(organismId, amount) {
    const current = this.contributions.get(organismId) || 0;
    this.contributions.set(organismId, current + amount);
  }

  recordAllocation(organismId, amount) {
    const current = this.allocations.get(organismId) || 0;
    this.allocations.set(organismId, current + amount);
  }

  getFairShare(organismId) {
    const contribution = this.contributions.get(organismId) || 0;
    const totalContribution = Array.from(this.contributions.values()).reduce((a, b) => a + b, 0);

    if (totalContribution === 0) return 0;

    return contribution / totalContribution;
  }

  shouldAllocate(organismId, requestAmount, totalAvailable) {
    const fairShare = this.getFairShare(organismId);
    const currentAllocation = this.allocations.get(organismId) || 0;
    const fairAmount = totalAvailable * fairShare;

    // Allow allocation if below fair share, weighted by φ
    return (currentAllocation + requestAmount) <= fairAmount * PHI;
  }
}

export class ResourceEngine {
  constructor({ organismId } = {}) {
    this.organismId = organismId;
    this.resources = this._initializeResources();
    this.advertisements = new Map();
    this.requests = new Map();
    this.fairShareAllocator = new FairShareAllocator();
    this.usageHistory = [];
  }

  _initializeResources() {
    return {
      CPU: new Resource({ type: 'CPU', total: 100, available: 100, unit: 'percent' }),
      memory: new Resource({ type: 'memory', total: 8192, available: 8192, unit: 'MB' }),
      storage: new Resource({ type: 'storage', total: 10000, available: 10000, unit: 'MB' }),
      energy: new Resource({ type: 'energy', total: 100, available: 100, unit: 'units' }),
      bandwidth: new Resource({ type: 'bandwidth', total: 1000, available: 1000, unit: 'Mbps' }),
    };
  }

  // Resource discovery and advertisement
  advertise() {
    const advertisement = new ResourceAdvertisement({
      organismId: this.organismId,
      resources: this.resources,
    });

    // Record contribution for fair share
    for (const [type, resource] of Object.entries(this.resources)) {
      this.fairShareAllocator.recordContribution(this.organismId, resource.available);
    }

    return advertisement;
  }

  discoverResources(advertisements) {
    for (const ad of advertisements) {
      if (!ad.isExpired()) {
        this.advertisements.set(ad.organismId, ad);
      }
    }

    // Cleanup expired
    for (const [id, ad] of this.advertisements.entries()) {
      if (ad.isExpired()) {
        this.advertisements.delete(id);
      }
    }

    return Array.from(this.advertisements.values());
  }

  // Allocation request/response
  requestAllocation(resourceType, amount, priority = 'normal') {
    const request = new AllocationRequest({
      requesterId: this.organismId,
      resourceType,
      amount,
      priority,
    });

    this.requests.set(request.id, request);
    return request;
  }

  handleAllocationRequest(request) {
    const resource = this.resources[request.resourceType];
    if (!resource) {
      return request.deny('resource_type_not_found');
    }

    // Check fair share
    const shouldAllocate = this.fairShareAllocator.shouldAllocate(
      request.requesterId,
      request.amount,
      resource.total
    );

    if (!shouldAllocate) {
      return request.deny('exceeds_fair_share');
    }

    // Attempt allocation
    const result = resource.allocate(request.amount);

    if (result.success) {
      this.fairShareAllocator.recordAllocation(request.requesterId, request.amount);
      return request.grant(this.organismId);
    }

    return request.deny('insufficient_resources');
  }

  // Usage monitoring
  monitorUsage() {
    const usage = {};

    for (const [type, resource] of Object.entries(this.resources)) {
      usage[type] = {
        total: resource.total,
        allocated: resource.allocated,
        available: resource.available,
        utilization: resource.getUtilization(),
        unit: resource.unit,
      };
    }

    this.usageHistory.push({
      usage,
      timestamp: Date.now(),
    });

    // Keep last 100 records
    if (this.usageHistory.length > 100) {
      this.usageHistory.shift();
    }

    return usage;
  }

  // Priority levels
  getPriorityWeight(priority) {
    const weights = {
      critical: 4,
      high: 3,
      normal: 2,
      low: 1,
    };
    return weights[priority] || 2;
  }

  // Resource reclamation
  reclaimIdle(idleThreshold = 60000) {
    const now = Date.now();
    const reclaimed = {};

    for (const [type, resource] of Object.entries(this.resources)) {
      if (now - resource.lastUpdated > idleThreshold) {
        // Reclaim 10% of allocated resources
        const reclaimAmount = resource.allocated * 0.1;
        resource.release(reclaimAmount);
        reclaimed[type] = reclaimAmount;
      }
    }

    return {
      reclaimed,
      timestamp: now,
    };
  }

  // Fair share management
  calculateFairShare() {
    const fairShares = {};

    for (const [organismId] of this.advertisements.entries()) {
      fairShares[organismId] = this.fairShareAllocator.getFairShare(organismId);
    }

    return fairShares;
  }

  getResourceStatus() {
    const status = {};

    for (const [type, resource] of Object.entries(this.resources)) {
      status[type] = {
        total: resource.total,
        available: resource.available,
        allocated: resource.allocated,
        utilization: (resource.getUtilization() * 100).toFixed(2) + '%',
      };
    }

    return {
      organismId: this.organismId,
      resources: status,
      advertisements: this.advertisements.size,
      pendingRequests: Array.from(this.requests.values()).filter(r => r.status === 'pending').length,
      fairShare: this.fairShareAllocator.getFairShare(this.organismId),
    };
  }
}

export default { Resource, ResourceAdvertisement, AllocationRequest, FairShareAllocator, ResourceEngine };
