/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { etStore } from '../../lib/et-store';
import type { DaoType, ProposalStatus } from '../../lib/et-types';

const daoTypes: DaoType[] = ['NNS', 'SNS', 'Unknown'];
const statuses: ProposalStatus[] = ['Open', 'Adopted', 'Rejected', 'Executed', 'Failed', 'Unknown'];

export default function ETCreateProposal() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    proposalId: '',
    title: '',
    summary: '',
    daoType: 'Unknown' as DaoType,
    status: 'Open' as ProposalStatus,
    url: '',
    proposalType: '',
    topic: '',
  });
  const [error, setError] = useState('');

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.proposalId.trim()) { setError('Proposal ID is required.'); return; }
    if (!form.title.trim()) { setError('Title is required.'); return; }
    etStore.createProposal({
      proposalId: form.proposalId.trim(),
      title: form.title.trim(),
      summary: form.summary.trim(),
      daoType: form.daoType,
      status: form.status,
      url: form.url.trim() || undefined,
      proposalType: form.proposalType.trim() || undefined,
      topic: form.topic.trim() || undefined,
    });
    navigate(`/et/proposals/${encodeURIComponent(form.proposalId.trim())}`);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', background: '#0e0e1a', color: '#e0e0ff',
    border: '1px solid #444', borderRadius: 4, fontSize: '1rem', boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: 4, color: '#aaa', fontSize: '0.9rem' };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ marginBottom: 24 }}>Create Proposal Record</h1>
      {error && <div style={{ color: '#e05050', marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Proposal ID *</label>
          <input style={inputStyle} value={form.proposalId} onChange={(e) => set('proposalId', e.target.value)} placeholder="e.g. 130000" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Title *</label>
          <input style={inputStyle} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Short descriptive title" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Summary</label>
          <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Brief summary of the proposal" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>DAO Type</label>
            <select style={inputStyle} value={form.daoType} onChange={(e) => set('daoType', e.target.value as DaoType)}>
              {daoTypes.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} onChange={(e) => set('status', e.target.value as ProposalStatus)}>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>URL (optional)</label>
          <input style={inputStyle} value={form.url} onChange={(e) => set('url', e.target.value)} placeholder="https://..." />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <label style={labelStyle}>Proposal Type (optional)</label>
            <input style={inputStyle} value={form.proposalType} onChange={(e) => set('proposalType', e.target.value)} placeholder="e.g. Motion" />
          </div>
          <div>
            <label style={labelStyle}>Topic (optional)</label>
            <input style={inputStyle} value={form.topic} onChange={(e) => set('topic', e.target.value)} placeholder="e.g. Governance" />
          </div>
        </div>
        <button type="submit" style={{ padding: '10px 24px', background: '#1a1a6e', color: '#fff', border: 'none', borderRadius: 6, fontSize: '1rem', cursor: 'pointer' }}>
          Create Proposal
        </button>
      </form>
    </div>
  );
}
