# EffectTrace Pass 1 Substrate Build Packet

**Internal name:** ORO-GOV-P1: Proposal Consequence Substrate Initialization  
**Public name:** EffectTrace  
**Pass objective:** Create the canister-backed substrate for storing proposals, traces, risk profiles, runtime truth status, evidence links, revisions, and structured findings.

---

## Pass 1 Status: BUILT

### Backend

Canister: `effecttrace`  
Location: `src/organisms/effecttrace/main.mo`  
Type: `persistent actor EffectTrace` (Motoko 1.6.0)

Modules implemented:
- **proposal_index** — create/update/get/list proposals, add source links
- **effect_trace** — create/update/get/list traces, publish, export Markdown
- **agent_findings** — submit/update/query findings by proposal and trace
- **governance_memory** — memory links with follow-up tracking
- **revision_log** — full audit trail across all entities
- **stats** — `getStats()` for frontend dashboard pulse

### Frontend

Routes under `/et/`:
- `/et` — Home
- `/et/pulse` — Governance Pulse (real counts only)
- `/et/proposals` — Proposal Search
- `/et/proposals/:proposalId` — Proposal Detail
- `/et/create-proposal` — Create Proposal form
- `/et/create-trace` — Create Trace form
- `/et/traces/:traceId` — Trace Detail
- `/et/risk-radar` — Risk Radar (grouped by risk class)
- `/et/operator` — Operator Dashboard shell
- `/et/export/:traceId` — Markdown Export

---

## Data Model

See `src/organisms/effecttrace/main.mo` for canonical type definitions.

Core types: ProposalRecord, EffectTraceRecord, EffectPath, RuntimeTruthBlock, RiskProfile, RiskScores, VerificationPlan, VerificationStep, GovernanceMemoryLink, AgentFinding, SourceLink, RevisionRecord.

---

## Runtime Truth Rules

1. A proposal summary is only a claim until payload/evidence/reviewer/after-state support exists.
2. Unknown is a valid status — do not fabricate certainty.
3. Published does not mean verified.
4. VerifiedAfterState requires a completed verification step with evidence.
5. Every update creates a revision record.
6. Every finding can be disputed.
7. Public language must stay neutral — no adopt/reject recommendation.

---

## Pass 2 Preview

Pass 2 — Proposal Adapter and Effect Path Automation — adds NNS/SNS proposal URL parsing, metadata ingestion, draft effect path generation, and draft risk profile generation. Pass 2 must not begin until Pass 1 substrate is stable.
