/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

// Simple in-memory store — in production this calls the canister
// Pass 1: localStorage-backed for demo purposes
import type {
  ProposalRecord,
  EffectTraceRecord,
  AgentFinding,
  GovernanceMemoryLink,
  ETStats,
} from './et-types';

let proposals: ProposalRecord[] = [];
let traces: EffectTraceRecord[] = [];
let findings: AgentFinding[] = [];
let memoryLinks: GovernanceMemoryLink[] = [];
let idCounter = 0;

function save() {
  localStorage.setItem('et_proposals', JSON.stringify(proposals));
  localStorage.setItem('et_traces', JSON.stringify(traces));
  localStorage.setItem('et_findings', JSON.stringify(findings));
  localStorage.setItem('et_memory', JSON.stringify(memoryLinks));
  localStorage.setItem('et_counter', String(idCounter));
}

function load() {
  proposals = JSON.parse(localStorage.getItem('et_proposals') ?? '[]');
  traces = JSON.parse(localStorage.getItem('et_traces') ?? '[]');
  findings = JSON.parse(localStorage.getItem('et_findings') ?? '[]');
  memoryLinks = JSON.parse(localStorage.getItem('et_memory') ?? '[]');
  idCounter = Number(localStorage.getItem('et_counter') ?? '0');
}

load();

function nextId(): string {
  return String(++idCounter);
}

export const etStore = {
  // Proposals
  createProposal(p: Omit<ProposalRecord, 'updatedAt' | 'sourceLinks'>): string {
    const record: ProposalRecord = { ...p, sourceLinks: [], updatedAt: Date.now() };
    proposals.push(record);
    save();
    return p.proposalId;
  },
  getProposal(id: string): ProposalRecord | undefined {
    return proposals.find((p) => p.proposalId === id);
  },
  listProposals(): ProposalRecord[] {
    return proposals;
  },

  // Traces
  createTrace(
    t: Omit<EffectTraceRecord, 'traceId' | 'createdAt' | 'updatedAt' | 'agentFindingIds' | 'memoryLinks'>
  ): string {
    const id = 'trace:' + t.proposalId + ':' + Date.now() + ':' + nextId();
    const record: EffectTraceRecord = {
      ...t,
      traceId: id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      agentFindingIds: [],
      memoryLinks: [],
    };
    traces.push(record);
    save();
    return id;
  },
  getTrace(id: string): EffectTraceRecord | undefined {
    return traces.find((t) => t.traceId === id);
  },
  listTraces(): EffectTraceRecord[] {
    return traces;
  },
  getTracesByProposal(proposalId: string): EffectTraceRecord[] {
    return traces.filter((t) => t.proposalId === proposalId);
  },

  // Findings (unused in Pass 1 UI but kept for store completeness)
  listFindings(): AgentFinding[] {
    return findings;
  },

  // Memory links
  listMemoryLinks(): GovernanceMemoryLink[] {
    return memoryLinks;
  },

  // Stats
  getStats(): ETStats {
    return {
      totalProposals: proposals.length,
      totalTraces: traces.length,
      tracesNeedingReview: traces.filter((t) => t.status === 'needs_review').length,
      executedNotVerified: traces.filter(
        (t) => t.runtimeTruth.truthStatus === 'ExecutedNotVerified'
      ).length,
      disputed: traces.filter((t) => t.status === 'disputed').length,
      highCriticalRisk: traces.filter(
        (t) => t.riskProfile.riskLevel === 'High' || t.riskProfile.riskLevel === 'Critical'
      ).length,
    };
  },

  // Export markdown
  exportMarkdown(traceId: string): string | null {
    const t = traces.find((tr) => tr.traceId === traceId);
    if (!t) return null;
    const p = proposals.find((pr) => pr.proposalId === t.proposalId);
    const lines = [
      '# Proposal Effect Trace',
      '',
      '## Proposal',
      `- Proposal ID: ${t.proposalId}`,
      `- DAO/System: ${p?.daoType ?? 'Unknown'}`,
      `- Proposal Type: ${p?.proposalType ?? 'Unknown'}`,
      `- Status: ${t.status}`,
      `- Risk Class: ${t.riskProfile.riskClass}`,
      `- Runtime Truth Status: ${t.runtimeTruth.truthStatus}`,
      '',
      '## Short Summary',
      t.plainSummary,
      '',
      '## 1. Claim',
      t.effectPath.claim,
      '',
      '## 2. Effect Path',
      `- Affected system: ${t.effectPath.affectedSystem}`,
      `- Target canister: ${t.effectPath.targetCanisterId ?? 'Unknown'}`,
      `- Target method: ${t.effectPath.targetMethod ?? 'Unknown'}`,
      `- Affected state: ${t.effectPath.affectedState}`,
      `- Expected after-state: ${t.effectPath.expectedAfterState}`,
      '',
      '## 3. Risk Profile',
      `- Risk class: ${t.riskProfile.riskClass}`,
      `- Risk level: ${t.riskProfile.riskLevel}`,
      `- Explanation: ${t.riskProfile.explanation}`,
      '',
      '## 4. Verification Plan',
      t.verificationPlan.summary,
      ...t.verificationPlan.steps.map(
        (s) => `- [${s.completed ? 'x' : ' '}] ${s.stepLabel}: ${s.description}`
      ),
      '',
      '## 5. Evidence / Sources',
      ...t.sourceLinks.map((s) => `- [${s.linkLabel}](${s.url ?? '#'}): ${s.note ?? ''}`),
      '',
      '## 6. Open Questions',
      ...t.effectPath.unknowns.map((u) => `- ${u}`),
      ...t.runtimeTruth.unresolvedQuestions.map((q) => `- ${q}`),
      ...t.riskProfile.openRiskQuestions.map((q) => `- ${q}`),
      '',
      '## 7. Governance Memory',
      ...t.memoryLinks.map((m) => `- ${m.relationType}: ${m.description}`),
      '',
      '## 8. Status Note',
      'This trace does not recommend adopt/reject. It is a structured effect record. Human verification required.',
    ];
    return lines.join('\n');
  },
};
