import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/engine', label: 'Engine' },
  { to: '/agents', label: 'Agents' },
  { to: '/renderability', label: 'Renderability' },
  { to: '/token-economy', label: 'Token Economy' },
  { to: '/reality-release', label: 'Reality → Release' },
  { to: '/executive', label: 'Executive' },
  { to: '/et', label: 'EffectTrace' },
]

export default function Layout() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar__inner">
          <span className="navbar__brand">MEDINA / NOVA</span>
          <div className="navbar__links">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  'navbar__link' + (isActive ? ' active' : '')
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>

      <footer className="footer">
        Casa de Medina — Architectos de Architectura Inteligente
      </footer>
    </>
  )
}
