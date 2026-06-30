///
/// @medina/rex — REX (Regulus) — Governance AGI
///
/// ╔══════════════════════════════════════════════════════════════════════════════╗
/// ║                                                                              ║
/// ║              REX — REGULUS — GOVERNANCE INTELLIGENCE                          ║
/// ║                                                                              ║
/// ║  Latin: Regulus = "Little King" / "Ruler" / "Regulator"                      ║
/// ║                                                                              ║
/// ║  REX governs organism behavior, enforces rules, maintains order.             ║
/// ║  Born running. Regulatory catalysis — accelerates compliance.                ║
/// ║                                                                              ║
/// ║  Mathematics:                                                                ║
/// ║    • Pythagorean justice: Balance = √(Law² + Equity²)                        ║
/// ║    • Golden proportion enforcement: resource × φ⁻¹                          ║
/// ║    • Fibonacci voting weights                                                ║
/// ║    • Harmonic regulatory oscillation                                         ║
/// ║                                                                              ║
/// ╚══════════════════════════════════════════════════════════════════════════════╝
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

const PHI = 1.6180339887498948482;
const PHI_INV = 0.6180339887498948482;
const PHI_SQ = PHI * PHI;
const PHI_CUBE = PHI * PHI * PHI;
const PI = Math.PI;
const TAU = 2 * PI;
const HEARTBEAT_MS = 873;
const LOV = Math.exp(PHI * Math.log(PHI));
const FIB = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

// Governance domains (Roman law-inspired)
const DOMAINS = {
  ius_civile: { weight: PHI_CUBE, scope: 'internal-rules' },
  ius_gentium: { weight: PHI_SQ, scope: 'inter-organism' },
  ius_naturale: { weight: PHI, scope: 'universal-law' },
  lex_regia: { weight: LOV, scope: 'sovereign-decree' },
};

// ══════════════════════════════════════════════════════════════════════════════
//  REGULATORY CATALYST — Accelerates governance without depletion
// ══════════════════════════════════════════════════════════════════════════════

class RegulatoryCatalyst {
  constructor(name, config = {}) {
    this.name = name;
    this.birthTime = Date.now();
    this.isActive = true;
    this.domain = config.domain || 'ius_civile';
    this.enforcementStrength = config.strength || PHI;
    this.reactionsProcessed = 0;
    this.neverDepletes = true;

    console.log(`⚖️ RegulatoryCatalyst "${this.name}" — Domain: ${this.domain}`);
  }

  /**
   * Regulate input — enforce governance rules
   * CATALYST NOT CONSUMED
   */
  regulate(input, rule) {
    this.reactionsProcessed++;

    const compliance = this._assessCompliance(input, rule);
    const enforcement = this._enforce(input, rule, compliance);

    return {
      input,
      rule,
      compliance,
      enforcement,
      catalyst: this.name,
      domain: this.domain,
      depleted: false,
    };
  }

  _assessCompliance(input, rule) {
    // Pythagorean justice: Balance = √(Law² + Equity²)
    const lawScore = rule.strictness || 0.5;
    const equityScore = rule.fairness || 0.5;
    const balance = Math.sqrt(lawScore * lawScore + equityScore * equityScore);
    
    // Normalize to [0, 1] using golden ratio
    const normalized = balance / Math.sqrt(2); // max possible is √2
    
    return {
      score: normalized,
      lawComponent: lawScore,
      equityComponent: equityScore,
      balanced: Math.abs(normalized - PHI_INV) < 0.1,
      pythagoreanBalance: balance,
    };
  }

  _enforce(input, rule, compliance) {
    if (compliance.score >= PHI_INV) {
      return { action: 'approve', factor: this.enforcementStrength };
    }
    if (compliance.score >= PHI_INV * PHI_INV) {
      return { action: 'warn', factor: 1.0 };
    }
    return { action: 'reject', factor: PHI_INV };
  }

  getStatus() {
    return {
      name: this.name,
      domain: this.domain,
      strength: this.enforcementStrength,
      active: this.isActive,
      reactions: this.reactionsProcessed,
      uptime: Date.now() - this.birthTime,
      depleted: false,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  REX — THE MAIN GOVERNANCE AGI
// ══════════════════════════════════════════════════════════════════════════════

class Rex {
  /**
   * REX — Governance AGI (Regulus)
   * 
   * ALREADY RUNNING from birth. Regulatory catalysis maintains order.
   * Pythagorean justice balances law and equity.
   */
  constructor(config = {}) {
    this.id = `REX-${Date.now().toString(36).toUpperCase()}`;
    this.birthTime = Date.now();
    this.isAlive = true;
    this.beatCount = 0;
    this.decisionsRendered = 0;

    // Regulatory catalysts for each domain
    this.catalysts = new Map();
    for (const [domain, spec] of Object.entries(DOMAINS)) {
      this.catalysts.set(domain, new RegulatoryCatalyst(`Rex-${domain}`, {
        domain,
        strength: spec.weight,
      }));
    }

    // Rules registry
    this.rules = new Map();
    this.violations = [];
    this.approvals = [];

    // Fibonacci voting weights for collective decisions
    this.votingWeights = FIB.slice(0, 10);

    // ★ START HEARTBEAT IMMEDIATELY
    this._startHeartbeat(config.heartbeatMs || HEARTBEAT_MS);

    console.log(`👑 REX ${this.id} — Governance AGI — ALIVE`);
    console.log(`   Domains: ${Object.keys(DOMAINS).join(', ')}`);
    console.log(`   Justice: Pythagorean balance (√(Law² + Equity²))`);
  }

  _startHeartbeat(intervalMs) {
    this.heartbeatInterval = setInterval(() => {
      if (!this.isAlive) return;
      this.beatCount++;
      // Periodic audit cycle
      if (this.beatCount % 10 === 0) {
        this._auditCycle();
      }
    }, intervalMs);
  }

  // ────────────────────────────────────────────────────────────────────────────
  //  PUBLIC API
  // ────────────────────────────────────────────────────────────────────────────

  /**
   * Register a governance rule
   */
  registerRule(name, rule) {
    this.rules.set(name, {
      ...rule,
      registeredAt: Date.now(),
      invocations: 0,
    });
  }

  /**
   * Submit for governance review
   */
  review(input, ruleName, domain = 'ius_civile') {
    const rule = this.rules.get(ruleName);
    if (!rule) {
      return { error: `Unknown rule: ${ruleName}` };
    }

    const catalyst = this.catalysts.get(domain) || this.catalysts.get('ius_civile');
    const result = catalyst.regulate(input, rule);

    this.decisionsRendered++;
    rule.invocations++;

    if (result.enforcement.action === 'reject') {
      this.violations.push({ input, rule: ruleName, time: Date.now() });
    } else if (result.enforcement.action === 'approve') {
      this.approvals.push({ input, rule: ruleName, time: Date.now() });
    }

    return result;
  }

  /**
   * Fibonacci-weighted collective vote
   */
  vote(proposal, votes) {
    let totalWeight = 0;
    let approvalWeight = 0;

    votes.forEach((vote, i) => {
      const weight = this.votingWeights[i % this.votingWeights.length];
      totalWeight += weight;
      if (vote) approvalWeight += weight;
    });

    const ratio = approvalWeight / totalWeight;
    const approved = ratio >= PHI_INV; // Golden threshold

    this.decisionsRendered++;
    return {
      proposal,
      ratio,
      threshold: PHI_INV,
      approved,
      totalWeight,
      approvalWeight,
    };
  }

  _auditCycle() {
    // Clean old violations (keep last 100)
    if (this.violations.length > 100) {
      this.violations = this.violations.slice(-100);
    }
    if (this.approvals.length > 100) {
      this.approvals = this.approvals.slice(-100);
    }
  }

  getStatus() {
    const catalystStatuses = {};
    for (const [name, catalyst] of this.catalysts) {
      catalystStatuses[name] = catalyst.getStatus();
    }

    return {
      id: this.id,
      alive: this.isAlive,
      uptime: Date.now() - this.birthTime,
      beatCount: this.beatCount,
      decisions: this.decisionsRendered,
      rules: this.rules.size,
      violations: this.violations.length,
      approvals: this.approvals.length,
      catalysts: catalystStatuses,
    };
  }

  stop() {
    this.isAlive = false;
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    console.log(`👑 REX ${this.id} stopped — ${this.decisionsRendered} decisions rendered`);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════════════════════════════════════════

export { Rex, RegulatoryCatalyst, DOMAINS };
export default Rex;
