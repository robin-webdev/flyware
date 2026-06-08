import { NavLink } from 'react-router-dom'

function navLinkClasses({ isActive }) {
  const base =
    'relative py-1 text-sm font-medium tracking-wide transition-colors'
  if (isActive) {
    return `${base} text-slate-900 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-sky-600 after:content-[""]`
  }
  return `${base} text-slate-500 hover:text-slate-900`
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-baseline gap-1">
          <span className="text-lg font-bold tracking-wider text-slate-900">
            FLYWARE
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
        </NavLink>

        <nav className="flex items-center gap-8">
          <NavLink to="/" end className={navLinkClasses}>
            Departures
          </NavLink>
          <NavLink to="/admin" className={navLinkClasses}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
