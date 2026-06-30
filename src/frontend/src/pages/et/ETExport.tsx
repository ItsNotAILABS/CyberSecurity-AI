/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { etStore } from '../../lib/et-store';

const GUARDRAIL =
  'This trace does not recommend adopt/reject. It is a structured effect record. Human verification required.';

export default function ETExport() {
  const { traceId } = useParams<{ traceId: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const markdown = traceId ? etStore.exportMarkdown(traceId) : null;

  if (!markdown) {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: '#e05050' }}>Trace not found: {traceId}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: 12, cursor: 'pointer' }}>← Back</button>
      </div>
    );
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(markdown!).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 16px' }}>
      <button
        onClick={() => navigate(`/et/traces/${encodeURIComponent(traceId ?? '')}`)}
        style={{ marginBottom: 16, cursor: 'pointer', background: 'none', border: 'none', color: '#8af', fontSize: '0.9rem' }}
      >
        ← Back to Trace
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Export Markdown</h1>
        <button
          onClick={copyToClipboard}
          style={{ padding: '8px 20px', background: copied ? '#1a3a1a' : '#1a1a2e', color: copied ? '#4caf50' : '#e0e0ff', border: `1px solid ${copied ? '#4caf50' : '#555'}`, borderRadius: 6, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          {copied ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      <pre
        style={{
          background: '#0a0a14',
          border: '1px solid #333',
          borderRadius: 8,
          padding: 20,
          overflowX: 'auto',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: '#ccc',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        {markdown}
      </pre>
      <div
        style={{
          marginTop: 20,
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
