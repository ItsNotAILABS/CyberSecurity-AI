/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { etStore } from '../../lib/et-store';
import type {
  AffectedSystem, RuntimeTruthStatus, RiskClass, RiskLevel,
} from '../../lib/et-types';

const affectedSystems: AffectedSystem[] = [
  'NNS', 'SNS', 'SNSDappCanister', 'ProtocolCanister', 'Registry',
  'LedgerOrTreasury', 'FrontendAssetCanister', 'GovernanceRule', 'CustomGenericFunction', 'Unknown',
];
const truthStatuses: RuntimeTruthStatus[] = [
  'ClaimOnly', 'PayloadIdentified', 'ReviewSupported', 'ExecutionPending',
  'ExecutedNotVerified', 'VerifiedAfterState', 'Disputed', 'Unknown',
];
const riskClasses: RiskClass[] = [
  'Motion', 'Informational', 'ParameterChange', 'CodeUpgrade', 'TreasuryAction',
  'GovernanceRuleChange', 'CanisterControlChange', 'FrontendAssetChange',
  'RegistryOrNetworkChange', 'CustomGenericFunction', 'SystemicOrEmergency', 'Unknown',
];
const riskLevels: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];
const vpStatuses = ['pending', 'in_progress', 'complete', 'unknown'];
const confidences = ['low', 'medium', 'high'];

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', background: '#0e0e1a', color: '#e0e0ff',
  border: '1px solid #444', borderRadius: 4, fontSize: '0.95rem', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.85rem' };
const sectionStyle: React.CSSProperties = { background: '#12121e', border: '1px solid #333', borderRadius: 8, padding: 20, marginBottom: 20 };

export default function ETCreateTrace() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preProposalId = searchParams.get('proposalId') ?? '';

  const [proposalId, setProposalId] = useState(preProposalId);
  const [publicTitle, setPublicTitle] = useState('');
  const [plainSummary, setPlainSummary] = useState('');

  // Effect Path
  const [claim, setClaim] = useState('');
  const [affectedSystem, setAffectedSystem] = useState<AffectedSystem>('Unknown');
  const [targetCanisterId, setTargetCanisterId] = useState('');
  const [targetMethod, setTargetMethod] = useState('');
  const [affectedState, setAffectedState] = useState('');
  const [expectedAfterState, setExpectedAfterState] = useState('');
  const [executionTrigger, setExecutionTrigger] = useState('');
  const [unknownsText, setUnknownsText] = useState('');

  // Runtime Truth
  const [truthStatus, setTruthStatus] = useState<RuntimeTruthStatus>('ClaimOnly');
  const [unresolvedQText, setUnresolvedQText] = useState('');
  const [claimObserved, setClaimObserved] = useState(false);
  const [payloadObserved, setPayloadObserved] = useState(false);
  const [targetIdentified, setTargetIdentified] = useState(false);
  const [reviewerConfirmed, setReviewerConfirmed] = useState(false);
  const [executionObserved, setExecutionObserved] = useState(false);
  const [afterStateVerified, setAfterStateVerified] = useState(false);

  // Risk Profile
  const [riskClass, setRiskClass] = useState<RiskClass>('Unknown');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Unknown');
  const [riskExplanation, setRiskExplanation] = useState('');
  const [openRiskQText, setOpenRiskQText] = useState('');

  // Risk Scores
  const [scoreTechnical, setScoreTechnical] = useState(0);
  const [scoreTreasury, setScoreTreasury] = useState(0);
  const [scoreGovernance, setScoreGovernance] = useState(0);
  const [scoreIrreversibility, setScoreIrreversibility] = useState(0);
  const [scoreVerification, setScoreVerification] = useState(0);
  const [scorePrecedent, setScorePrecedent] = useState(0);

  // Verification Plan
  const [vpSummary, setVpSummary] = useState('');
  const [vpStatus, setVpStatus] = useState('pending');

  const [confidence, setConfidence] = useState('medium');
  const [traceStatus, setTraceStatus] = useState('draft');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!proposalId.trim()) { setError('Proposal ID is required.'); return; }
    if (!publicTitle.trim()) { setError('Public Title is required.'); return; }

    const id = etStore.createTrace({
      proposalId: proposalId.trim(),
      publicTitle: publicTitle.trim(),
      plainSummary: plainSummary.trim(),
      effectPath: {
        claim: claim.trim(),
        affectedSystem,
        targetCanisterId: targetCanisterId.trim() || undefined,
        targetMethod: targetMethod.trim() || undefined,
        affectedState: affectedState.trim(),
        expectedAfterState: expectedAfterState.trim(),
        executionTrigger: executionTrigger.trim(),
        unknowns: unknownsText.split('\n').map((l) => l.trim()).filter(Boolean),
      },
      runtimeTruth: {
        claimObserved,
        payloadObserved,
        targetIdentified,
        reviewerConfirmed,
        executionObserved,
        afterStateVerified,
        truthStatus,
        unresolvedQuestions: unresolvedQText.split('\n').map((l) => l.trim()).filter(Boolean),
      },
      riskProfile: {
        riskClass,
        riskLevel,
        scores: {
          technical: scoreTechnical,
          treasury: scoreTreasury,
          governance: scoreGovernance,
          irreversibility: scoreIrreversibility,
          verificationDifficulty: scoreVerification,
          precedentWeight: scorePrecedent,
        },
        explanation: riskExplanation.trim(),
        openRiskQuestions: openRiskQText.split('\n').map((l) => l.trim()).filter(Boolean),
      },
      verificationPlan: {
        summary: vpSummary.trim(),
        steps: [],
        status: vpStatus,
      },
      sourceLinks: [],
      confidence,
      status: traceStatus,
    });
    navigate(`/et/traces/${encodeURIComponent(id)}`);
  }

  const scoreInput = (label: string, val: number, set: (n: number) => void) => (
    <div key={label}>
      <label style={labelStyle}>{label} (0–5)</label>
      <input
        type="number" min={0} max={5} style={inputStyle}
        value={val} onChange={(e) => set(Number(e.target.value))}
      />
    </div>
  );

  const checkbox = (label: string, val: boolean, set: (b: boolean) => void) => (
    <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
      <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} />
      <span style={{ color: '#ccc', fontSize: '0.9rem' }}>{label}</span>
    </label>
  );

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ marginBottom: 24 }}>Create Effect Trace</h1>
      {error && <div style={{ color: '#e05050', marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>

        {/* Basic info */}
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: '1.1rem' }}>Basic Info</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Proposal ID *</label>
            <input style={inputStyle} value={proposalId} onChange={(e) => setProposalId(e.target.value)} placeholder="Proposal ID" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Public Title *</label>
            <input style={inputStyle} value={publicTitle} onChange={(e) => setPublicTitle(e.target.value)} placeholder="Human-readable title for this trace" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Plain Summary</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={plainSummary} onChange={(e) => setPlainSummary(e.target.value)} placeholder="One-paragraph plain-language summary" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Confidence</label>
              <select style={inputStyle} value={confidence} onChange={(e) => setConfidence(e.target.value)}>
                {confidences.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Trace Status</label>
              <input style={inputStyle} value={traceStatus} onChange={(e) => setTraceStatus(e.target.value)} placeholder="e.g. draft, needs_review, disputed" />
            </div>
          </div>
        </div>

        {/* Effect Path */}
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: '1.1rem' }}>Effect Path</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Claim</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={claim} onChange={(e) => setClaim(e.target.value)} placeholder="What does this proposal claim to do?" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Affected System</label>
            <select style={inputStyle} value={affectedSystem} onChange={(e) => setAffectedSystem(e.target.value as AffectedSystem)}>
              {affectedSystems.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Target Canister ID (optional)</label>
              <input style={inputStyle} value={targetCanisterId} onChange={(e) => setTargetCanisterId(e.target.value)} placeholder="aaaaa-aa" />
            </div>
            <div>
              <label style={labelStyle}>Target Method (optional)</label>
              <input style={inputStyle} value={targetMethod} onChange={(e) => setTargetMethod(e.target.value)} placeholder="method_name" />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Affected State</label>
            <input style={inputStyle} value={affectedState} onChange={(e) => setAffectedState(e.target.value)} placeholder="What state does this change?" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Expected After-State</label>
            <input style={inputStyle} value={expectedAfterState} onChange={(e) => setExpectedAfterState(e.target.value)} placeholder="What is the expected state after execution?" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Execution Trigger</label>
            <input style={inputStyle} value={executionTrigger} onChange={(e) => setExecutionTrigger(e.target.value)} placeholder="What triggers execution?" />
          </div>
          <div>
            <label style={labelStyle}>Unknowns (one per line)</label>
            <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={unknownsText} onChange={(e) => setUnknownsText(e.target.value)} placeholder="Unknown 1&#10;Unknown 2" />
          </div>
        </div>

        {/* Runtime Truth */}
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: '1.1rem' }}>Runtime Truth</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Truth Status</label>
            <select style={inputStyle} value={truthStatus} onChange={(e) => setTruthStatus(e.target.value as RuntimeTruthStatus)}>
              {truthStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            {checkbox('Claim Observed', claimObserved, setClaimObserved)}
            {checkbox('Payload Observed', payloadObserved, setPayloadObserved)}
            {checkbox('Target Identified', targetIdentified, setTargetIdentified)}
            {checkbox('Reviewer Confirmed', reviewerConfirmed, setReviewerConfirmed)}
            {checkbox('Execution Observed', executionObserved, setExecutionObserved)}
            {checkbox('After-State Verified', afterStateVerified, setAfterStateVerified)}
          </div>
          <div>
            <label style={labelStyle}>Unresolved Questions (one per line)</label>
            <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={unresolvedQText} onChange={(e) => setUnresolvedQText(e.target.value)} />
          </div>
        </div>

        {/* Risk Profile */}
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: '1.1rem' }}>Risk Profile</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Risk Class</label>
              <select style={inputStyle} value={riskClass} onChange={(e) => setRiskClass(e.target.value as RiskClass)}>
                {riskClasses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Risk Level</label>
              <select style={inputStyle} value={riskLevel} onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}>
                {riskLevels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Explanation</label>
            <textarea style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} value={riskExplanation} onChange={(e) => setRiskExplanation(e.target.value)} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Open Risk Questions (one per line)</label>
            <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={openRiskQText} onChange={(e) => setOpenRiskQText(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {scoreInput('Technical', scoreTechnical, setScoreTechnical)}
            {scoreInput('Treasury', scoreTreasury, setScoreTreasury)}
            {scoreInput('Governance', scoreGovernance, setScoreGovernance)}
            {scoreInput('Irreversibility', scoreIrreversibility, setScoreIrreversibility)}
            {scoreInput('Verification Difficulty', scoreVerification, setScoreVerification)}
            {scoreInput('Precedent Weight', scorePrecedent, setScorePrecedent)}
          </div>
        </div>

        {/* Verification Plan */}
        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, marginBottom: 16, fontSize: '1.1rem' }}>Verification Plan</h2>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Summary</label>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={vpSummary} onChange={(e) => setVpSummary(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={vpStatus} onChange={(e) => setVpStatus(e.target.value)}>
              {vpStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" style={{ padding: '10px 28px', background: '#1a1a6e', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1rem', cursor: 'pointer' }}>
          Create Trace
        </button>
      </form>
    </div>
  );
}
