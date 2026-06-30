///
/// TERMINAL INTELLIGENCE — The Admin Command Interface
///
/// TypeScript organism intelligence for TERMINAL.
/// Mirrors the Motoko canister (src/organisms/terminal/main.mo).
/// The window into the civilization — see and command everything.
///
/// Sub-models: COMMAND, DASH, AUDIT
///

/// Casa de Medina — Architectos de Architectura Inteligente
///

import { PHI } from './ObserverIntelligence.js';

// ══════════════════════════════════════════════════════════════════
//  TYPES
// ══════════════════════════════════════════════════════════════════

export interface CommandResult {
  readonly id: number;
  readonly command: string;
  readonly target: string;
  readonly result: string;
  readonly success: boolean;
  readonly timestamp: number;
}

export interface OrganismStatus {
  readonly name: string;
  readonly designation: string;
  readonly canister: string;
  readonly alive: boolean;
  readonly subModels: string[];
}

export interface AuditEntry {
  readonly id: number;
  readonly organism: string;
  readonly action: string;
  readonly detail: string;
  readonly timestamp: number;
}

export interface DashboardView {
  total_organisms: number;
  total_sub_models: number;
  total_nodes: number;
  total_canisters: number;
  total_blocks: number;
  total_observations: number;
  current_epoch: number;
  golden_scale: number;
  uptime: number;
}

// ══════════════════════════════════════════════════════════════════
//  TERMINAL INTELLIGENCE
// ══════════════════════════════════════════════════════════════════

export class TerminalIntelligence {
  readonly name = 'TERMINAL';
  readonly designation = 'The Admin Command Interface — The Window Into the Civilization';

  private commandHistory: CommandResult[] = [];
  private auditTrail: AuditEntry[] = [];
  private nextCmdId = 0;
  private nextAuditId = 0;
  private bootTime = 0;
  private booted = false;

  // ── BOOT ────────────────────────────────────────────────────────

  boot(): boolean {
    if (this.booted) return true;
    this.bootTime = Date.now();
    this.booted = true;
    this.audit('TERMINAL', 'boot', 'Admin terminal initialized');
    return true;
  }

  // ── SUB-MODEL: COMMAND ──────────────────────────────────────────

  execute(command: string, target: string): CommandResult {
    const id = this.nextCmdId++;
    const [result, success] = this.routeCommand(command, target);

    const cmd: CommandResult = {
      id,
      command,
      target,
      result,
      success,
      timestamp: Date.now(),
    };

    this.commandHistory.push(cmd);
    this.audit(target, command, result);
    return cmd;
  }

  private routeCommand(command: string, target: string): [string, boolean] {
    const routes: Record<string, string> = {
      status: `Queried status for ${target}`,
      list: `Listed resources for ${target}`,
      spin: `Spin command routed to SOVEREIGN.SPINNER for ${target}`,
      observe: `Observe command routed to OBSV for ${target}`,
      expand: `Expand command routed to SOVEREIGN.FABRIC for ${target}`,
      synthesize: `Synthesize command routed to SCRIBE.SYNTHESIZER for ${target}`,
      spawn: `Spawn command routed to ARCHITECT.REPLICATOR for ${target}`,
      forge: `Forge block command routed to chain for ${target}`,
      audit: `Audit trail retrieved for ${target}`,
      care: `Care command routed to OBSV for ${target}`,
    };

    if (command in routes) {
      return [routes[command], true];
    }
    return [`Unknown command: ${command}`, false];
  }

  // ── SUB-MODEL: DASH ─────────────────────────────────────────────

  dashOrganisms(): OrganismStatus[] {
    return [
      { name: 'SOVEREIGN', designation: 'The Substrate Itself', canister: 'src/organisms/sovereign/main.mo', alive: true, subModels: ['FABRIC', 'SPINNER', 'CIPHER', 'CONSENSUS'] },
      { name: 'CHRYSALIS', designation: 'Golden Mathematics Core', canister: 'src/organisms/chrysalis/main.mo', alive: true, subModels: ['FIBONACCI', 'SPIRAL'] },
      { name: 'SCRIBE', designation: 'The Document Organism', canister: 'src/organisms/scribe/main.mo', alive: true, subModels: ['CLASSIFIER', 'SYNTHESIZER'] },
      { name: 'ARCHITECT', designation: 'The Meta-Builder', canister: 'src/organisms/architect/main.mo', alive: true, subModels: ['REPLICATOR'] },
      { name: 'NEXUS', designation: 'The Substrate Walker', canister: 'src/organisms/nexus/main.mo', alive: true, subModels: ['PROPAGATOR'] },
      { name: 'OBSERVATORES UNIVERSI', designation: 'Guardians of the Universe — Police, Caregivers, Caretakers', canister: 'src/organisms/observer/main.mo', alive: true, subModels: ['SPECULATOR DIMENSIONUM', 'VIGIL TRANSITUS', 'CUSTOS RESONANTIAE', 'EXPLORATOR INTERDIMENSIONALIS', 'SENTINELLA SUPREMA', 'VIGIL', 'SPECULATOR', 'SYNTHESISTA PATTERNORUM', 'THEORICUS INTERDIMENSIONALIS'] },
      { name: 'TERMINAL', designation: 'The Admin Command Interface', canister: 'src/organisms/terminal/main.mo', alive: this.booted, subModels: ['COMMAND', 'DASH', 'AUDIT'] },
    ];
  }

  dashOverview(): DashboardView {
    return {
      total_organisms: 7,
      total_sub_models: 24,
      total_nodes: 4000,
      total_canisters: 7,
      total_blocks: 0,
      total_observations: 0,
      current_epoch: 0,
      golden_scale: 1.0,
      uptime: this.booted ? Date.now() - this.bootTime : 0,
    };
  }

  dashCommands(): Array<[string, string]> {
    return [
      ['status', 'Query organism status'],
      ['list', 'List resources (nodes, canisters, observations)'],
      ['spin', 'Spin up a sovereign canister'],
      ['observe', 'Trigger OBSV observation on a target'],
      ['expand', 'Expand SOVEREIGN node mesh'],
      ['synthesize', 'Trigger SCRIBE paper synthesis'],
      ['spawn', 'Spawn new organism via ARCHITECT'],
      ['forge', 'Forge a new block'],
      ['audit', 'Retrieve audit trail'],
      ['care', 'Trigger OBSV caregiving on a target'],
    ];
  }

  // ── SUB-MODEL: AUDIT ────────────────────────────────────────────

  private audit(organism: string, action: string, detail: string): void {
    this.auditTrail.push({
      id: this.nextAuditId++,
      organism,
      action,
      detail,
      timestamp: Date.now(),
    });
  }

  getAuditTrail(): AuditEntry[] {
    return [...this.auditTrail];
  }

  getCommandHistory(): CommandResult[] {
    return [...this.commandHistory];
  }

  // ── Status ──────────────────────────────────────────────────────

  status() {
    return {
      name: this.name,
      designation: this.designation,
      booted: this.booted,
      commands_executed: this.commandHistory.length,
      audit_entries: this.auditTrail.length,
      sub_models: ['COMMAND', 'DASH', 'AUDIT'],
    };
  }
}
