/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { Link } from 'react-router-dom'

export default function Agents() {
  return (
    <>
      <Link to="/" className="back-link">← Back</Link>
      <div className="page-hero">
        <h1>Activated Agents — <span>Structured Thought Systems</span></h1>
      </div>
      <div className="prose">
        <p>
          Activated Agents are Medina's cognitive species — modular, role‑based thought systems
          that expand your reasoning.
        </p>
        <p>When activated, they:</p>
        <ul>
          <li>divide a problem into roles</li>
          <li>explore multiple paths in parallel</li>
          <li>challenge each other's assumptions</li>
          <li>detect red herrings</li>
          <li>synthesize a coherent, pressure‑tested answer</li>
        </ul>
        <p>They don't generate text.</p>
        <p>
          They generate architecture — decisions, structures, and pathways that integrate
          seamlessly into the organism.
        </p>
        <p>
          Activated Agents are one of Medina's first market‑facing technologies: a way to rent
          structured thinking, not just output.
        </p>
      </div>
    </>
  )
}
