/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { etStore } from '../../lib/et-store';

const GUARDRAIL =
  'EffectTrace does not recommend adopt/reject. It is a structured effect record. Human verification required.';

export default function ETPulse() {
  const stats = etStore.getStats();
  const allZero = Object.values(stats).every((v) => v === 0);

  const cards: { label: string; value: number; accent?: string }[] = [
    { label: 'Total Proposals', value: stats.totalProposals },
    { label: 'Total Traces', value: stats.totalTraces },
    { label: 'Needs Review', value: stats.tracesNeedingReview, accent: '#f0a500' },
    { label: 'Executed Not Verified', value: stats.executedNotVerified, accent: '#e05a00' },
    { label: 'Disputed', value: stats.disputed, accent: '#cc3333' },
    { label: 'High / Critical Risk', value: stats.highCriticalRisk, accent: '#cc3333' },
  ];

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ marginBottom: 24 }}>Governance Pulse</h1>
      {allZero ? (
        <p style={{ color: '#aaa' }}>
          No records yet. Create a proposal to get started.
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          {cards.map((c) => (
            <div
              key={c.label}
              style={{
                flex: '1 1 200px',
                background: '#12121e',
                border: `1px solid ${c.accent ?? '#333'}`,
                borderRadius: 8,
                padding: '20px 24px',
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 700, color: c.accent ?? '#e0e0ff' }}>
                {c.value}
              </div>
              <div style={{ color: '#aaa', marginTop: 4, fontSize: '0.9rem' }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}
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
