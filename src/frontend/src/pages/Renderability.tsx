/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { Link } from 'react-router-dom'

export default function Renderability() {
  return (
    <>
      <Link to="/" className="back-link">← Back</Link>
      <div className="page-hero">
        <h1>Renderability Architecture — <span>The Design Language of the Organism</span></h1>
      </div>
      <div className="prose">
        <p>Renderability is the law that governs how Medina becomes visible.</p>
        <p>It defines:</p>
        <ul>
          <li>Primitives — the atomic behaviors of the system</li>
          <li>Layers — the strata that stack into coherent structures</li>
          <li>Organisms — the emergent entities formed from layered logic</li>
          <li>Coherence — the rules that keep the organism stable as it grows</li>
        </ul>
        <p>
          Renderability ensures that every idea, every build, every agent can be expressed as a
          navigable structure.
        </p>
        <p>It is the architectural grammar of the organism.</p>
      </div>
    </>
  )
}
