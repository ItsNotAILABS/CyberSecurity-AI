/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useNavigate } from 'react-router-dom';

const GUARDRAIL =
  'EffectTrace does not recommend adopt/reject. It is a structured effect record. Human verification required.';

export default function ETHome() {
  const navigate = useNavigate();
  const btn: React.CSSProperties = {
    padding: '12px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    border: '1px solid #555',
    borderRadius: 6,
    background: '#1a1a2e',
    color: '#e0e0ff',
    minWidth: 200,
  };
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: 8 }}>EffectTrace</h1>
      <p style={{ fontSize: '1.25rem', color: '#aaa', marginBottom: 24 }}>
        Trace what governance proposals actually change.
      </p>
      <p style={{ marginBottom: 32, lineHeight: 1.7 }}>
        EffectTrace is a governance intelligence layer for the Internet Computer Protocol. For every
        proposal, it maps the claim, the effect path, the runtime truth, and the risk profile — so
        that reviewers and operators can verify what actually changed, not just what was promised.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 48 }}>
        <button style={btn} onClick={() => navigate('/et/create-proposal')}>
          + Create Proposal Record
        </button>
        <button style={btn} onClick={() => navigate('/et/create-trace')}>
          + Create Effect Trace
        </button>
        <button style={btn} onClick={() => navigate('/et/proposals')}>
          Browse Proposals
        </button>
        <button style={btn} onClick={() => navigate('/et/pulse')}>
          Governance Pulse
        </button>
      </div>
      <div
        style={{
          borderLeft: '3px solid #f0a500',
          padding: '10px 16px',
          background: '#1e1a10',
          borderRadius: 4,
          color: '#ccc',
          fontSize: '0.9rem',
        }}
      >
        ⚠️ {GUARDRAIL}
      </div>
    </div>
  );
}
