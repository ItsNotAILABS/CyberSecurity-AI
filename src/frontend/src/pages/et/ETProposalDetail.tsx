/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useParams, useNavigate } from 'react-router-dom';
import { etStore } from '../../lib/et-store';

export default function ETProposalDetail() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const proposal = proposalId ? etStore.getProposal(proposalId) : undefined;
  const traces = proposalId ? etStore.getTracesByProposal(proposalId) : [];

  if (!proposal) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: '#e05050' }}>Proposal not found: {proposalId}</p>
        <button onClick={() => navigate('/et/proposals')} style={{ marginTop: 12, cursor: 'pointer' }}>
          ← Back to proposals
        </button>
      </div>
    );
  }

  const field = (label: string, value: string | undefined) =>
    value ? (
      <div style={{ marginBottom: 8 }}>
        <span style={{ color: '#888', fontSize: '0.85rem' }}>{label}: </span>
        <span>{value}</span>
      </div>
    ) : null;

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <button
        onClick={() => navigate('/et/proposals')}
        style={{ marginBottom: 20, cursor: 'pointer', background: 'none', border: 'none', color: '#8af', fontSize: '0.9rem' }}
      >
        ← All Proposals
      </button>
      <h1 style={{ marginBottom: 4 }}>{proposal.title}</h1>
      <div style={{ color: '#888', marginBottom: 24, fontFamily: 'monospace', fontSize: '0.85rem' }}>
        {proposal.proposalId}
      </div>

      <div style={{ background: '#12121e', border: '1px solid #333', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        {field('DAO', proposal.daoType)}
        {field('Status', proposal.status)}
        {field('Type', proposal.proposalType)}
        {field('Topic', proposal.topic)}
        {field('URL', proposal.url)}
        <div style={{ marginBottom: 8 }}>
          <div style={{ color: '#888', fontSize: '0.85rem', marginBottom: 4 }}>Summary:</div>
          <div style={{ lineHeight: 1.6 }}>{proposal.summary}</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Effect Traces ({traces.length})</h2>
        <button
          style={{ padding: '8px 16px', cursor: 'pointer', background: '#1a1a2e', color: '#e0e0ff', border: '1px solid #555', borderRadius: 6 }}
          onClick={() => navigate(`/et/create-trace?proposalId=${encodeURIComponent(proposal.proposalId)}`)}
        >
          + Add Trace
        </button>
      </div>

      {traces.length === 0 ? (
        <p style={{ color: '#aaa' }}>No traces for this proposal yet.</p>
      ) : (
        <div style={{ border: '1px solid #333', borderRadius: 8, overflow: 'hidden' }}>
          {traces.map((t) => (
            <div
              key={t.traceId}
              style={{ padding: '12px 16px', borderBottom: '1px solid #222', cursor: 'pointer', background: '#12121e' }}
              onClick={() => navigate(`/et/traces/${encodeURIComponent(t.traceId)}`)}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#1a1a2e')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#12121e')}
            >
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.publicTitle}</div>
              <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: '#888' }}>
                <span>Risk: <span style={{ color: riskColor(t.riskProfile.riskLevel) }}>{t.riskProfile.riskLevel}</span></span>
                <span>Truth: {t.runtimeTruth.truthStatus}</span>
                <span>Status: {t.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function riskColor(level: string): string {
  if (level === 'Critical') return '#cc3333';
  if (level === 'High') return '#e05a00';
  if (level === 'Medium') return '#f0a500';
  if (level === 'Low') return '#4caf50';
  return '#aaa';
}
