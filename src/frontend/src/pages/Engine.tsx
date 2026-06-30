/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { Link } from 'react-router-dom'

export default function Engine() {
  return (
    <>
      <Link to="/" className="back-link">← Back</Link>
      <div className="page-hero">
        <h1>The Architectonic Engine — <span>Medina's Autonomous Architecture Layer</span></h1>
      </div>
      <div className="prose">
        <p>
          The Architectonic Engine is the living core of Medina — a self‑evolving substrate where
          structure is not written but grown.
        </p>
        <p>
          Inside this Engine, everything becomes architecture: primitives, agents, organisms, and
          continuously evolving builds. The system reshapes itself in response to new information,
          constraints, and goals.
        </p>
        <p>This is the native habitat of Activated Agents.</p>
        <p>Here, they behave like a coordinated micro‑civilization:</p>
        <ul>
          <li>branching into parallel lines of reasoning</li>
          <li>stress‑testing assumptions</li>
          <li>eliminating red herrings</li>
          <li>cross‑checking logic</li>
          <li>converging on structural decisions</li>
        </ul>
        <p>The output is not a reply.</p>
        <p>
          It is a design decision — a piece of architecture that fits the organism's shape and
          trajectory.
        </p>
        <p>The Architectonic Engine is where Medina thinks.</p>
      </div>
    </>
  )
}
