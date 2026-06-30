/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useNavigate } from 'react-router-dom';
import { etStore } from '../../lib/et-store';

function Queue({ title, traces, emptyMsg, navigate }: {
  title: string;
  traces: ReturnType<typeof etStore.listTraces>;
  emptyMsg: string;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div style={{ background: '#12121e', border: '1px solid #333', borderRadius: 8, marginBottom: 20, overflow: 'hidden' }}>
      <div style={{ padding: '10px 16px', background: '#0e0e1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ background: '#1a1a3e', padding: '2px 10px', borderRadius: 12, fontSize: '0.85rem', color: '#8af' }}>
          {traces.length}
        </span>
      </div>
      {traces.length === 0 ? (
        <div style={{ padding: '12px 16px', color: '#555', fontSize: '0.9rem' }}>{emptyMsg}</div>
      ) : (
        traces.map((t) => (
          <div
            key={t.traceId}
            style={{ padding: '10px 16px', borderTop: '1px solid #222', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            onClick={() => navigate(`/et/traces/${encodeURIComponent(t.traceId)}`)}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#1a1a2e')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = '')}
          >
            <div>
              <div style={{ color: '#ccc', marginBottom: 2 }}>{t.publicTitle}</div>
              <div style={{ fontSize: '0.8rem', color: '#555', fontFamily: 'monospace' }}>{t.traceId}</div>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>{t.status}</span>
          </div>
        ))
      )}
    </div>
  );
}

export default function ETOperator() {
  const navigate = useNavigate();
  const traces = etStore.listTraces();

  const highCritical = traces.filter((t) => t.riskProfile.riskLevel === 'High' || t.riskProfile.riskLevel === 'Critical');
  const needsReview = traces.filter((t) => t.status === 'needs_review');
  const executedNotVerified = traces.filter((t) => t.runtimeTruth.truthStatus === 'ExecutedNotVerified');
  const disputed = traces.filter((t) => t.status === 'disputed');

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ marginBottom: 8 }}>Operator Dashboard</h1>
      <p style={{ color: '#888', marginBottom: 28 }}>
        Pass 1 operator view — live queues derived from canister state.
      </p>
      <Queue title="🔴 Open Risk Queue (High / Critical)" traces={highCritical} emptyMsg="No high or critical risk traces." navigate={navigate} />
      <Queue title="🟡 Needs Review" traces={needsReview} emptyMsg="No traces awaiting review." navigate={navigate} />
      <Queue title="🟠 Executed Not Verified" traces={executedNotVerified} emptyMsg="No unverified executed traces." navigate={navigate} />
      <Queue title="⚡ Disputed Findings" traces={disputed} emptyMsg="No disputed traces." navigate={navigate} />
    </div>
  );
}
