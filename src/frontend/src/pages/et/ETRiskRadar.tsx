/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useNavigate } from 'react-router-dom';
import { etStore } from '../../lib/et-store';
import type { RiskClass } from '../../lib/et-types';

const riskClasses: RiskClass[] = [
  'Motion', 'Informational', 'ParameterChange', 'CodeUpgrade', 'TreasuryAction',
  'GovernanceRuleChange', 'CanisterControlChange', 'FrontendAssetChange',
  'RegistryOrNetworkChange', 'CustomGenericFunction', 'SystemicOrEmergency', 'Unknown',
];

function riskColor(level: string): string {
  if (level === 'Critical') return '#cc3333';
  if (level === 'High') return '#e05a00';
  if (level === 'Medium') return '#f0a500';
  if (level === 'Low') return '#4caf50';
  return '#aaa';
}

export default function ETRiskRadar() {
  const navigate = useNavigate();
  const traces = etStore.listTraces();

  const grouped = riskClasses.reduce<Record<RiskClass, typeof traces[number][]>>((acc, rc) => {
    acc[rc] = traces.filter((t) => t.riskProfile.riskClass === rc);
    return acc;
  }, {} as Record<RiskClass, typeof traces[number][]>);

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ marginBottom: 24 }}>Risk Radar</h1>
      {traces.length === 0 ? (
        <p style={{ color: '#aaa' }}>No traces yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {riskClasses
            .filter((rc) => grouped[rc].length > 0)
            .map((rc) => (
              <div
                key={rc}
                style={{ background: '#12121e', border: '1px solid #333', borderRadius: 8, overflow: 'hidden' }}
              >
                <div style={{ padding: '10px 16px', background: '#0e0e1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{rc}</span>
                  <span style={{ background: '#1a1a3e', padding: '2px 10px', borderRadius: 12, fontSize: '0.85rem', color: '#8af' }}>
                    {grouped[rc].length}
                  </span>
                </div>
                {grouped[rc].map((t) => (
                  <div
                    key={t.traceId}
                    style={{ padding: '8px 16px', borderTop: '1px solid #222', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                    onClick={() => navigate(`/et/traces/${encodeURIComponent(t.traceId)}`)}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = '#1a1a2e')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = '')}
                  >
                    <span style={{ color: '#ccc' }}>{t.publicTitle}</span>
                    <span style={{ color: riskColor(t.riskProfile.riskLevel), fontSize: '0.85rem' }}>
                      {t.riskProfile.riskLevel}
                    </span>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
