/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { Link } from 'react-router-dom'

export default function RealityRelease() {
  return (
    <>
      <Link to="/" className="back-link">← Back</Link>
      <div className="page-hero">
        <h1>Reality → Release — <span>From Concept to Public Expression</span></h1>
      </div>
      <div className="prose">
        <p>Reality → Release is Medina's metamorphosis cycle.</p>
        <p>It defines how:</p>
        <ul>
          <li>raw concepts are captured</li>
          <li>structures are rendered</li>
          <li>builds mature into stable species</li>
          <li>species become public‑facing products and experiences</li>
        </ul>
        <p>
          This pipeline ensures that Medina's internal architecture becomes external reality
          without losing coherence.
        </p>
      </div>
    </>
  )
}
