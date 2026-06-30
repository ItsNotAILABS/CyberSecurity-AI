/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { Link } from 'react-router-dom'

export default function Executive() {
  return (
    <>
      <Link to="/" className="back-link">← Back</Link>
      <div className="page-hero">
        <h1>Executive View — <span>The Strategic Overview</span></h1>
      </div>
      <div className="prose">
        <p>Medina is a platform for building and operating computational organisms.</p>
        <p>Its core components:</p>
        <ul>
          <li>The Architectonic Engine — autonomous architecture</li>
          <li>Activated Agents — structured thought systems</li>
          <li>Renderability Architecture — the design language</li>
          <li>Token Economy — value and rights framework</li>
          <li>Reality → Release — productization pipeline</li>
        </ul>
        <p>Medina represents a new category:</p>
        <p>
          computational organisms — systems that think, evolve, and express themselves through
          architecture.
        </p>
      </div>
    </>
  )
}
