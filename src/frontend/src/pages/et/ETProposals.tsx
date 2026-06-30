/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useNavigate } from 'react-router-dom';
import { etStore } from '../../lib/et-store';

export default function ETProposals() {
  const navigate = useNavigate();
  const proposals = etStore.listProposals();

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 100px 120px',
    gap: 12,
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #222',
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1>Proposal Search</h1>
        <button
          style={{ padding: '8px 16px', cursor: 'pointer', background: '#1a1a2e', color: '#e0e0ff', border: '1px solid #555', borderRadius: 6 }}
          onClick={() => navigate('/et/create-proposal')}
        >
          + New Proposal
        </button>
      </div>
      {proposals.length === 0 ? (
        <p style={{ color: '#aaa' }}>No proposals found.</p>
      ) : (
        <div style={{ border: '1px solid #333', borderRadius: 8, overflow: 'hidden' }}>
          <div
            style={{ ...rowStyle, background: '#0e0e1a', fontWeight: 600, cursor: 'default', color: '#888', fontSize: '0.85rem' }}
          >
            <span>Proposal ID</span>
            <span>Title</span>
            <span>DAO</span>
            <span>Status</span>
          </div>
          {proposals.map((p) => (
            <div
              key={p.proposalId}
              style={{ ...rowStyle, background: '#12121e' }}
              onClick={() => navigate(`/et/proposals/${p.proposalId}`)}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#1a1a2e')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#12121e')}
            >
              <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#aaa' }}>{p.proposalId}</span>
              <span>{p.title}</span>
              <span style={{ color: '#8af' }}>{p.daoType}</span>
              <span style={{ color: statusColor(p.status) }}>{p.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function statusColor(s: string): string {
  if (s === 'Adopted' || s === 'Executed') return '#4caf50';
  if (s === 'Rejected' || s === 'Failed') return '#e05050';
  if (s === 'Open') return '#f0a500';
  return '#aaa';
}
