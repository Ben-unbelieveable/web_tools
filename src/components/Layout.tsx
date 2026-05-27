import { NavLink, Outlet, useLocation } from 'react-router-dom'

export function Layout() {
  const { pathname } = useLocation()
  const isNavHome = pathname === '/'
  const toolsActive = pathname === '/tools' || pathname.startsWith('/tools/')
  const brandLabel = isNavHome ? '资源导航' : '在线工具'
  const brandTo = isNavHome ? '/' : '/tools'

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner row between wrap gap">
          <NavLink to={brandTo} className="brand" end={isNavHome || pathname === '/tools'}>
            {brandLabel}
          </NavLink>
          <nav className="header-nav row gap" aria-label="站点导航">
            <NavLink
              to="/"
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
              end
            >
              资源导航
            </NavLink>
            <NavLink
              to="/tools"
              className={() => `header-nav-link ${toolsActive ? 'active' : ''}`}
            >
              在线工具
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-inner row wrap gap">
          <span className="muted small">资源导航与在线工具集</span>
          <a
            className="footer-link small"
            href="https://github.com/Ben-unbelieveable/web_tools"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <span className="muted small">提交站点（即将开放）</span>
        </div>
      </footer>
    </div>
  )
}
