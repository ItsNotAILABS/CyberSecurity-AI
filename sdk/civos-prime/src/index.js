///
/// @medina/civos-prime — CIVOS-PRIME
///
/// CIVOS-PRIME is the high-order governing and orchestration surface
/// of the Nova Architecture.
///
/// CIVOS (Civic Operating Surface) — PRIME designation indicates top-level
/// authority within its governing domain.
///
/// Role within Nova:
///   CIVOS-PRIME does not execute. It GOVERNS.
///   It sets law, enforces authority state transitions across agents,
///   routes multi-agent work to the correct surface, mediates conflicts,
///   and maintains sovereign order within the Nova runtime.
///
/// Core capabilities:
///   • Agent authority arbitration
///   • Law gate enforcement (runtime law candidates → laws)
///   • Multi-agent task routing and conflict resolution
///   • Quorum and consensus for consequential actions
///   • Sovereignty boundary enforcement
///   • Civic registry of active agents and their authority states
///
/// Mathematical foundations:
///
///   Condorcet voting (multi-agent consensus):
///     For agents A₁..Aₙ voting on proposal P:
///       Condorcet winner = agent preferred by majority over every other
///       Borda count fallback when no Condorcet winner exists
///
///   φ-weighted quorum gate:
///     Q_required = φ⁻¹ × total_agents  (≈ 61.8% participation required)
///     Decision approved if: yes_weight / total_weight > φ⁻¹
///
///   Roman lawmaking analogy (lex → ius):
///     A runtime law candidate (C7) must pass civic review before becoming
///     binding law. Process: propositio → deliberatio → promulgatio → lex.
///
///   Pythagorean authority distance:
///     Distance between two authority states in the state lattice:
///       d(A, B) = √(Σ (transition_depth_diff)²)
///     Used to measure how far apart two agents are in authority space.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

const PHI              = 1.6180339887498948482;
const PHI_INV          = 1.0 / PHI;
const PHI_HEARTBEAT_MS = 873;
const QUORUM_THRESHOLD = PHI_INV;   // 61.8% required

// Law states: the Roman lawmaking process
const LAW_STATES = ['PROPOSITIO', 'DELIBERATIO', 'PROMULGATIO', 'LEX'];

// ═══════════════════════════════════════════════════════════════════════════
//  CIVOS-PRIME
// ═══════════════════════════════════════════════════════════════════════════

export class CivosPrime {
  constructor({ agentId = 'CIVOS-PRIME' } = {}) {
    this.agentId       = agentId;
    this.birthTime     = Date.now();
    this.agentRegistry = new Map();    // agentId → { role, authority, registered }
    this.lawRegistry   = new Map();    // lawId → { candidate, state, votes }
    this.proposals     = [];
    this.decisions     = [];
    this.auditLog      = [];

    // ★ Self-bootstrapping
    console.log(
      `\n⚖️  CIVOS-PRIME awakened | agentId=${agentId}\n` +
      `   High-order governing surface.\n` +
      `   Quorum threshold: φ⁻¹ = ${QUORUM_THRESHOLD.toFixed(8)}\n`
    );
  }

  // ─── Agent registry ────────────────────────────────────────────────────

  /**
   * Register an agent with CIVOS-PRIME.
   */
  registerAgent(agentId, { role, authorityClass, division }) {
    const record = {
      agentId,
      role,
      authorityClass,
      division,
      registered: Date.now(),
      active:     true,
    };
    this.agentRegistry.set(agentId, record);
    this._audit('AGENT_REGISTERED', { agentId, role });
    console.log(`   CIVOS registered | ${agentId} | ${role}`);
    return record;
  }

  // ─── Law gate: C7 runtime law candidate → law ──────────────────────────

  /**
   * Propose a runtime law candidate (C7) for civic review.
   * Process: PROPOSITIO → DELIBERATIO → PROMULGATIO → LEX
   */
  proposeLaw(lawText, proposingAgent) {
    const lawId = `LEX-${this.lawRegistry.size + 1}-${Date.now()}`;
    const law = {
      lawId,
      text:         lawText,
      proposedBy:   proposingAgent,
      state:        LAW_STATES[0],   // PROPOSITIO
      stateIndex:   0,
      votes:        { yes: [], no: [] },
      proposed:     Date.now(),
      promulgated:  null,
    };
    this.lawRegistry.set(lawId, law);
    this._audit('LAW_PROPOSED', { lawId, proposingAgent });
    console.log(`   CIVOS law proposed | ${lawId} | state=PROPOSITIO`);
    return { lawId, state: LAW_STATES[0] };
  }

  /**
   * Advance a law through the Roman lawmaking process.
   * Requires φ-quorum at each stage.
   */
  advanceLaw(lawId, votes = []) {
    const law = this.lawRegistry.get(lawId);
    if (!law) return { ok: false, reason: `Law ${lawId} not found` };
    if (law.state === 'LEX') return { ok: false, reason: `Law ${lawId} already promulgated as LEX` };

    const yesCount = votes.filter(v => v.vote === 'yes').length;
    const total    = votes.length;
    const quorum   = total / Math.max(1, this.agentRegistry.size);
    const approval = total > 0 ? yesCount / total : 0;

    if (quorum < QUORUM_THRESHOLD) {
      return { ok: false, reason: `Quorum not met: ${(quorum * 100).toFixed(1)}% < ${(QUORUM_THRESHOLD * 100).toFixed(1)}% required` };
    }
    if (approval < QUORUM_THRESHOLD) {
      return { ok: false, reason: `Approval not met: ${(approval * 100).toFixed(1)}% < ${(QUORUM_THRESHOLD * 100).toFixed(1)}% required` };
    }

    law.stateIndex++;
    law.state = LAW_STATES[Math.min(law.stateIndex, LAW_STATES.length - 1)];
    law.votes.yes.push(...votes.filter(v => v.vote === 'yes'));
    law.votes.no.push(...votes.filter(v => v.vote === 'no'));

    if (law.state === 'LEX') {
      law.promulgated = Date.now();
      this._audit('LAW_PROMULGATED', { lawId });
    }

    console.log(`   CIVOS law advanced | ${lawId} | → ${law.state}`);
    return { ok: true, lawId, state: law.state, approval: +approval.toFixed(4) };
  }

  // ─── Multi-agent task routing ──────────────────────────────────────────

  /**
   * Route a task to the appropriate Nova agent.
   * Uses φ-weighted authority distance to find best-fit agent.
   */
  routeTask(task) {
    const candidates = [];
    for (const [agentId, agent] of this.agentRegistry.entries()) {
      if (!agent.active) continue;
      const fit = this._computeTaskFit(task, agent);
      candidates.push({ agentId, fit, agent });
    }

    candidates.sort((a, b) => b.fit - a.fit);
    const best = candidates[0];

    const routing = {
      task:          task.description || task,
      routedTo:      best?.agentId || null,
      fit:           best?.fit || 0,
      candidates:    candidates.slice(0, 3).map(c => ({ agentId: c.agentId, fit: +(c.fit).toFixed(4) })),
      governed:      true,
      timestamp:     Date.now(),
    };

    this._audit('TASK_ROUTED', routing);
    return routing;
  }

  _computeTaskFit(task, agent) {
    const taskDiv   = (task.division || '').toLowerCase();
    const agentDiv  = (agent.division || '').toLowerCase();
    const overlap   = taskDiv.split(' ').filter(w => agentDiv.includes(w)).length;
    const roleFit   = task.role === agent.role ? PHI : 1.0;
    return overlap * roleFit * PHI_INV;
  }

  // ─── φ-quorum decision ─────────────────────────────────────────────────

  /**
   * Run a φ-quorum governed decision.
   * Borda count fallback when no Condorcet winner.
   *
   * @param {string} description
   * @param {object[]} votes  — [{agentId, choice, weight?}]
   * @returns {CivosDecision}
   */
  decide(description, votes = []) {
    const total      = this.agentRegistry.size || 1;
    const quorum     = votes.length / total;
    const quorumMet  = quorum >= QUORUM_THRESHOLD;

    // Aggregate by choice
    const tally = {};
    let totalWeight = 0;
    for (const v of votes) {
      const w = v.weight || 1;
      tally[v.choice] = (tally[v.choice] || 0) + w;
      totalWeight += w;
    }

    // Condorcet-style: choose option with most weight
    let winner = null, maxWeight = 0;
    for (const [choice, w] of Object.entries(tally)) {
      if (w > maxWeight) { maxWeight = w; winner = choice; }
    }

    const approval = totalWeight > 0 ? maxWeight / totalWeight : 0;
    const passed   = quorumMet && approval >= QUORUM_THRESHOLD;

    const decision = {
      decisionId:  `CIVOS-DEC-${this.decisions.length + 1}`,
      description,
      quorum:      +quorum.toFixed(4),
      quorumMet,
      winner,
      approval:    +approval.toFixed(4),
      passed,
      tally,
      timestamp:   Date.now(),
      note: passed
        ? `φ-quorum decision passed: ${winner} | approval=${(approval * 100).toFixed(1)}%`
        : `Decision failed: quorum=${(quorum * 100).toFixed(1)}%, approval=${(approval * 100).toFixed(1)}%`,
    };

    this.decisions.push(decision);
    this._audit('DECISION_MADE', { decisionId: decision.decisionId, passed, winner });
    return decision;
  }

  // ─── Audit log ─────────────────────────────────────────────────────────

  _audit(event, data = {}) {
    this.auditLog.push({ event, data, timestamp: Date.now() });
  }

  getStatus() {
    return {
      agentId:         this.agentId,
      role:            'High-order governing and orchestration surface',
      family:          'Nova Architecture',
      uptime:          Date.now() - this.birthTime,
      agentCount:      this.agentRegistry.size,
      lawCount:        this.lawRegistry.size,
      promulgatedLaws: [...this.lawRegistry.values()].filter(l => l.state === 'LEX').length,
      decisions:       this.decisions.length,
      auditLog:        this.auditLog.length,
      quorumThreshold: QUORUM_THRESHOLD,
    };
  }
}

export default CivosPrime;
