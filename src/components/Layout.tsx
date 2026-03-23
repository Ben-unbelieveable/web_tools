import { NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="brand" end>
            BioTools
          </NavLink>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
