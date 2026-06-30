/**
 * Casa de Medina — Architectos de Architectura Inteligente
 */

import { Link } from 'react-router-dom'

export default function TokenEconomy() {
  return (
    <>
      <Link to="/" className="back-link">← Back</Link>
      <div className="page-hero">
        <h1>Token Economy — <span>The Circulatory System of Value</span></h1>
      </div>
      <div className="prose">
        <p>
          The Token Economy is how Medina distributes value, rights, and incentives across its
          organism.
        </p>
        <p>It defines:</p>
        <ul>
          <li>how contribution is recognized</li>
          <li>how rights and access are encoded</li>
          <li>how incentives align with long‑term growth</li>
          <li>how value circulates between agents, builders, and participants</li>
        </ul>
        <p>This is not speculation.</p>
        <p>
          It is structural alignment — a way to ensure that the organism rewards the people and
          systems that help it evolve.
        </p>
      </div>
    </>
  )
}
