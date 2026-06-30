/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useParams, useNavigate } from 'react-router-dom';
import { etStore } from '../../lib/et-store';

function safeUrl(url: string | undefined): string {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:') return parsed.href;
  } catch {
    // not a valid URL
  }
  return '#';
}

function riskColor(level: string): string {
  if (level === 'Critical') return '#cc3333';
  if (level === 'High') return '#e05a00';
  if (level === 'Medium') return '#f0a500';
  if (level === 'Low') return '#4caf50';
  return '#aaa';
}

function truthColor(status: string): string {
  if (status === 'VerifiedAfterState') return '#4caf50';
  if (status === 'Disputed') return '#cc3333';
  if (status === 'ExecutedNotVerified') return '#e05a00';
  if (status === 'ExecutionPending') return '#f0a500';
  return '#8af';
}

const badge = (label: string, color: string) => (
  <span style={{
    display: 'inline-block', padding: '2px 10px', background: color + '22',
    color, border: `1px solid ${color}`, borderRadius: 12, fontSize: '0.8rem', marginLeft: 8,
  }}>
    {label}
  </span>
);

const section = (title: string, children: React.ReactNode) => (
  <div style={{ background: '#12121e', border: '1px solid #333', borderRadius: 8, padding: 20, marginBottom: 16 }}>
    <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: '1rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h2>
    {children}
  </div>
);

const row = (label: string, value: string | number | undefined) =>
  value !== undefined && value !== '' ? (
    <div style={{ marginBottom: 8 }}>
      <span style={{ color: '#666', fontSize: '0.82rem' }}>{label}: </span>
      <span style={{ color: '#e0e0ff' }}>{value}</span>
    </div>
  ) : null;

export default function ETTraceDetail() {
  const { traceId } = useParams<{ traceId: string }>();
  const navigate = useNavigate();
  const t = traceId ? etStore.getTrace(traceId) : undefined;

  if (!t) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: '#e05050' }}>Trace not found: {traceId}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: 12, cursor: 'pointer' }}>← Back</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <button
        onClick={() => navigate(`/et/proposals/${encodeURIComponent(t.proposalId)}`)}
        style={{ marginBottom: 16, cursor: 'pointer', background: 'none', border: 'none', color: '#8af', fontSize: '0.9rem' }}
      >
        ← Proposal {t.proposalId}
      </button>
      <h1 style={{ marginBottom: 4 }}>
        {t.publicTitle}
        {badge(t.riskProfile.riskLevel, riskColor(t.riskProfile.riskLevel))}
        {badge(t.runtimeTruth.truthStatus, truthColor(t.runtimeTruth.truthStatus))}
      </h1>
      <div style={{ color: '#555', fontSize: '0.8rem', marginBottom: 24, fontFamily: 'monospace' }}>{t.traceId}</div>

      {section('Summary', <p style={{ margin: 0, lineHeight: 1.7 }}>{t.plainSummary}</p>)}

      {section('Effect Path', <>
        {row('Claim', t.effectPath.claim)}
        {row('Affected System', t.effectPath.affectedSystem)}
        {row('Target Canister', t.effectPath.targetCanisterId)}
        {row('Target Method', t.effectPath.targetMethod)}
        {row('Affected State', t.effectPath.affectedState)}
        {row('Expected After-State', t.effectPath.expectedAfterState)}
        {row('Execution Trigger', t.effectPath.executionTrigger)}
        {t.effectPath.unknowns.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <span style={{ color: '#666', fontSize: '0.82rem' }}>Unknowns:</span>
            <ul style={{ margin: '4px 0 0 16px', color: '#ccc' }}>
              {t.effectPath.unknowns.map((u, i) => <li key={i}>{u}</li>)}
            </ul>
          </div>
        )}
      </>)}

      {section('Runtime Truth', <>
        {row('Status', t.runtimeTruth.truthStatus)}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
          {[
            ['Claim Observed', t.runtimeTruth.claimObserved],
            ['Payload Observed', t.runtimeTruth.payloadObserved],
            ['Target Identified', t.runtimeTruth.targetIdentified],
            ['Reviewer Confirmed', t.runtimeTruth.reviewerConfirmed],
            ['Execution Observed', t.runtimeTruth.executionObserved],
            ['After-State Verified', t.runtimeTruth.afterStateVerified],
          ].map(([label, val]) => (
            <span key={String(label)} style={{ fontSize: '0.85rem', color: val ? '#4caf50' : '#555' }}>
              {val ? '✓' : '○'} {label}
            </span>
          ))}
        </div>
        {t.runtimeTruth.unresolvedQuestions.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <span style={{ color: '#666', fontSize: '0.82rem' }}>Unresolved Questions:</span>
            <ul style={{ margin: '4px 0 0 16px', color: '#ccc' }}>
              {t.runtimeTruth.unresolvedQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        )}
      </>)}

      {section('Risk Profile', <>
        {row('Risk Class', t.riskProfile.riskClass)}
        {row('Risk Level', t.riskProfile.riskLevel)}
        {row('Explanation', t.riskProfile.explanation)}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 12 }}>
          {Object.entries(t.riskProfile.scores).map(([k, v]) => (
            <div key={k} style={{ background: '#0e0e1a', padding: 10, borderRadius: 4, textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>{v}</div>
              <div style={{ fontSize: '0.75rem', color: '#666' }}>{k}</div>
            </div>
          ))}
        </div>
        {t.riskProfile.openRiskQuestions.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <span style={{ color: '#666', fontSize: '0.82rem' }}>Open Risk Questions:</span>
            <ul style={{ margin: '4px 0 0 16px', color: '#ccc' }}>
              {t.riskProfile.openRiskQuestions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
        )}
      </>)}

      {section('Verification Plan', <>
        {row('Status', t.verificationPlan.status)}
        <p style={{ color: '#ccc', margin: '8px 0' }}>{t.verificationPlan.summary}</p>
        {t.verificationPlan.steps.length > 0 && (
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {t.verificationPlan.steps.map((s) => (
              <li key={s.id} style={{ color: s.completed ? '#4caf50' : '#ccc', marginBottom: 4 }}>
                [{s.completed ? 'x' : ' '}] {s.stepLabel}: {s.description}
              </li>
            ))}
          </ul>
        )}
      </>)}

      {t.sourceLinks.length > 0 && section('Source Links', (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {t.sourceLinks.map((s) => (
            <li key={s.id} style={{ marginBottom: 4 }}>
              <a href={safeUrl(s.url)} style={{ color: '#8af' }}>{s.linkLabel}</a>
              {s.note && <span style={{ color: '#888' }}> — {s.note}</span>}
            </li>
          ))}
        </ul>
      ))}

      {t.memoryLinks.length > 0 && section('Governance Memory', (
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {t.memoryLinks.map((m) => (
            <li key={m.id} style={{ marginBottom: 4, color: '#ccc' }}>
              <strong style={{ color: '#aaa' }}>{m.relationType}:</strong> {m.description}
            </li>
          ))}
        </ul>
      ))}

      <div style={{ marginTop: 20 }}>
        <button
          style={{ padding: '8px 20px', background: '#1a1a2e', color: '#e0e0ff', border: '1px solid #555', borderRadius: 6, cursor: 'pointer' }}
          onClick={() => navigate(`/et/export/${encodeURIComponent(t.traceId)}`)}
        >
          Export Markdown
        </button>
      </div>
    </div>
  );
}
