///
/// @medina/thesis-alpha — Surface Router and Lifecycle State Machine
///
/// SurfaceRouter: routes work through the four THESIS surfaces.
///   Source Surface → Forge Surface → Deploy Surface → Nexus Registry
///
/// LifecycleStateMachine: tracks the 16+4 lifecycle states of a THESIS run.
///
/// Mathematical foundation:
///
///   φ-weighted routing priority:
///     For each surface S with depth d in the routing sequence:
///       priority(S) = 1 / φ^d
///     Source = d=0 (highest priority), Nexus = d=3 (lowest per-entry priority,
///     but highest institutional weight for stable manifests)
///
///   Lifecycle progression uses Fibonacci gating:
///     A lifecycle state at index k requires F(k) evidence of completeness
///     before advancing to state k+1.
///
/// Casa de Medina — Architectos de Architectura Inteligente
///

import {
  PHI, PHI_INV, FIBONACCI,
  SURFACE, LIFECYCLE, LIFECYCLE_TERMINALS,
  SUBSTRATE_TYPE, AUTHORITY_STATE,
} from './constants.js';

// ═══════════════════════════════════════════════════════════════════════════
//  SURFACE ROUTER
// ═══════════════════════════════════════════════════════════════════════════

export class SurfaceRouter {
  constructor({ agentId = 'THESIS-ALPHA' } = {}) {
    this.agentId      = agentId;
    this.birthTime    = Date.now();
    this.routingLog   = [];
    this.currentSurface = SURFACE.SOURCE;

    // Surface sequence with φ-derived priorities
    this.surfaces = [
      { id: SURFACE.SOURCE, depth: 0, priority: 1.0 },
      { id: SURFACE.FORGE,  depth: 1, priority: PHI_INV },
      { id: SURFACE.DEPLOY, depth: 2, priority: PHI_INV * PHI_INV },
      { id: SURFACE.NEXUS,  depth: 3, priority: PHI_INV * PHI_INV * PHI_INV },
    ];

    console.log(`🗺️  SurfaceRouter born | agentId=${agentId} | starting at ${SURFACE.SOURCE}`);
  }

  // ─── Route a work packet through surfaces ─────────────────────────────

  /**
   * Determine which surfaces a given task needs to traverse.
   * Returns an ordered routing plan with priority and purpose.
   *
   * @param {object} task
   * @param {string}   task.substrateType
   * @param {boolean}  task.privateCore
   * @param {boolean}  task.needsDeployment
   * @param {boolean}  task.needsNotary
   * @param {boolean}  task.hasStableManifest
   * @returns {SurfaceRoute}
   */
  planRoute(task = {}) {
    const {
      substrateType     = SUBSTRATE_TYPE.PAPER_DRAFT,
      privateCore       = false,
      needsDeployment   = false,
      needsNotary       = false,
      hasStableManifest = false,
    } = task;

    const route = [];

    // Source Surface: always first — interpret doctrine, classify substrate
    route.push({
      surface:  SURFACE.SOURCE,
      priority: 1.0,
      purpose:  'Interpret doctrine, extract source truth, classify substrate',
      required: true,
    });

    // Forge Surface: always second — generate canonical packet sources
    route.push({
      surface:  SURFACE.FORGE,
      priority: PHI_INV,
      purpose:  'Create canonical packet sources, ledgers, schemas, validators',
      required: true,
    });

    // Deploy Surface: conditional on deployment or notary need
    if (needsDeployment || needsNotary ||
        substrateType === SUBSTRATE_TYPE.DEPLOYMENT_BLUEPRINT ||
        substrateType === SUBSTRATE_TYPE.RUNTIME_PAPER) {
      route.push({
        surface:  SURFACE.DEPLOY,
        priority: PHI_INV * PHI_INV,
        purpose:  'Test release boundaries, deployment implications, proof requirements, rollback',
        required: true,
      });
    }

    // Nexus Registry: conditional on stable manifests or IP claims
    if (hasStableManifest || privateCore ||
        substrateType === SUBSTRATE_TYPE.IP_CLAIM ||
        substrateType === SUBSTRATE_TYPE.BLOCKCHAIN_NOTARY) {
      route.push({
        surface:  SURFACE.NEXUS,
        priority: PHI_INV * PHI_INV * PHI_INV,
        purpose:  'Register stable manifests, lineage objects, reusable contracts',
        required: false,
        trigger:  'when output is mature enough',
      });
    }

    const plan = {
      task:         { substrateType, privateCore, needsDeployment, needsNotary, hasStableManifest },
      route,
      surfaceCount: route.length,
      estimated:    route.reduce((s, r) => s + (r.priority * 100), 0),
    };

    this.routingLog.push({ timestamp: Date.now(), plan });
    console.log(`   SurfaceRouter planned | surfaces=[${route.map(r => r.surface).join('→')}]`);
    return plan;
  }

  // ─── Track surface transitions ─────────────────────────────────────────

  enterSurface(surface) {
    this.currentSurface = surface;
    this.routingLog.push({ timestamp: Date.now(), event: 'enter', surface });
    console.log(`   SurfaceRouter entered | ${surface}`);
  }

  exitSurface(surface, result = {}) {
    this.routingLog.push({ timestamp: Date.now(), event: 'exit', surface, result });
    console.log(`   SurfaceRouter exited  | ${surface}`);
  }

  getStatus() {
    return {
      agentId:        this.agentId,
      uptime:         Date.now() - this.birthTime,
      currentSurface: this.currentSurface,
      routingLog:     this.routingLog.length,
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  LIFECYCLE STATE MACHINE
// ═══════════════════════════════════════════════════════════════════════════

export class LifecycleStateMachine {
  constructor({ packetId, agentId = 'THESIS-ALPHA' } = {}) {
    this.packetId       = packetId || `PKT-${Date.now()}`;
    this.agentId        = agentId;
    this.birthTime      = Date.now();
    this.currentIndex   = 0;   // index into LIFECYCLE array
    this.currentState   = LIFECYCLE[0];
    this.terminalState  = null;
    this.history        = [{ state: LIFECYCLE[0], timestamp: Date.now() }];
    this.completionMap  = {};  // state → completion proof

    console.log(`🔄 LifecycleStateMachine | packetId=${this.packetId} | state=${this.currentState}`);
  }

  // ─── Advance lifecycle ─────────────────────────────────────────────────

  /**
   * Advance to the next lifecycle state.
   * Uses Fibonacci gating: state at index k requires F(k % 20) milliseconds
   * of minimum dwell before advancing (prevents instant completion).
   *
   * @param {object} [completionProof]  — evidence that current state is complete
   * @returns {{ ok: boolean, state: string, next?: string }}
   */
  advance(completionProof = {}) {
    if (this.terminalState) {
      return {
        ok:    false,
        state: this.terminalState,
        reason: `Lifecycle reached terminal state: ${this.terminalState}`,
      };
    }

    // Fibonacci dwell gate: minimum time at current state
    const fibDwell = FIBONACCI[this.currentIndex % 20];  // ms
    const dwell    = Date.now() - (this.history.at(-1)?.timestamp || this.birthTime);
    if (dwell < fibDwell) {
      return {
        ok:    false,
        state: this.currentState,
        reason: `Fibonacci dwell gate: ${dwell}ms elapsed, ${fibDwell}ms required for state ${this.currentState}`,
      };
    }

    // Record completion proof for current state
    this.completionMap[this.currentState] = {
      proof:     completionProof,
      timestamp: Date.now(),
      dwell,
    };

    const prevState = this.currentState;
    this.currentIndex++;

    if (this.currentIndex >= LIFECYCLE.length) {
      return {
        ok:    false,
        state: this.currentState,
        reason: 'Lifecycle complete — choose a terminal state via setTerminal()',
      };
    }

    this.currentState = LIFECYCLE[this.currentIndex];
    this.history.push({ state: this.currentState, timestamp: Date.now() });

    console.log(`   Lifecycle advanced | ${prevState} → ${this.currentState}`);
    return { ok: true, prev: prevState, state: this.currentState, index: this.currentIndex };
  }

  // ─── Set terminal state ────────────────────────────────────────────────

  /**
   * Terminate the lifecycle at a final outcome state.
   * Terminal states: PUBLIC_SAFE | PRIVATE_VAULT | DEPLOYMENT_BLUEPRINT | COUNSEL_READY
   */
  setTerminal(terminalState, reason = '') {
    if (!LIFECYCLE_TERMINALS.includes(terminalState)) {
      return {
        ok:     false,
        reason: `'${terminalState}' is not a valid terminal state. Valid: [${LIFECYCLE_TERMINALS.join(', ')}]`,
      };
    }
    this.terminalState = terminalState;
    this.history.push({ state: terminalState, timestamp: Date.now(), terminal: true, reason });
    console.log(`   Lifecycle terminal | ${terminalState} | ${reason}`);
    return { ok: true, terminal: terminalState };
  }

  // ─── Skip to a specific state ──────────────────────────────────────────

  /**
   * Jump directly to a named lifecycle state.
   * Used when the operator can provide proof that intermediate states were completed.
   */
  skipTo(targetState, completionProof = {}) {
    const idx = LIFECYCLE.indexOf(targetState);
    if (idx < 0) {
      return { ok: false, reason: `Unknown lifecycle state: ${targetState}` };
    }
    if (idx <= this.currentIndex) {
      return { ok: false, reason: `Cannot skip backwards: already at ${this.currentState}` };
    }

    const skipped = LIFECYCLE.slice(this.currentIndex + 1, idx);
    for (const state of skipped) {
      this.completionMap[state] = { skipped: true, proof: completionProof, timestamp: Date.now() };
      this.history.push({ state, timestamp: Date.now(), skipped: true });
    }

    this.currentIndex = idx;
    this.currentState = targetState;
    this.history.push({ state: targetState, timestamp: Date.now() });

    console.log(`   Lifecycle skipped | → ${targetState} | skipped [${skipped.join(', ')}]`);
    return { ok: true, state: targetState, skipped };
  }

  // ─── Status ────────────────────────────────────────────────────────────

  getProgress() {
    const total = LIFECYCLE.length;
    const done  = this.currentIndex;
    return {
      currentState:  this.currentState,
      terminalState: this.terminalState,
      progress:      `${done}/${total}`,
      progressRatio: +(done / total).toFixed(4),
      phiProgress:   +(done / total * PHI).toFixed(4),  // φ-weighted progress signal
      remainingStates: LIFECYCLE.slice(this.currentIndex + 1),
      completedStates: LIFECYCLE.slice(0, this.currentIndex + 1),
    };
  }

  getStatus() {
    return {
      packetId:     this.packetId,
      uptime:       Date.now() - this.birthTime,
      currentState: this.currentState,
      currentIndex: this.currentIndex,
      terminalState: this.terminalState,
      historyLength: this.history.length,
      progress:     this.getProgress(),
    };
  }
}

export default { SurfaceRouter, LifecycleStateMachine };
