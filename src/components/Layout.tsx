import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { listNavSections } from '../core/navSections'
import type { NavSection } from '../core/navTypes'

function isSectionActive(pathname: string, section: NavSection): boolean {
  if (section.id === 'online-tools') {
    return pathname === section.path || pathname.startsWith('/tools/')
  }
  return pathname === section.path
}

function resolveBrand(pathname: string, sections: NavSection[]) {
  if (pathname === '/submit') {
    return { label: '提交站点', to: '/submit' }
  }
  if (pathname === '/about') {
    return { label: '关于', to: '/about' }
  }
  const activeSection = sections.find((s) => isSectionActive(pathname, s))
  return {
    label: activeSection?.label ?? '资源导航',
    to: activeSection?.path ?? '/online-tools',
  }
}

export function Layout() {
  const { pathname } = useLocation()
  const sections = listNavSections()
  const { label: brandLabel, to: brandTo } = resolveBrand(pathname, sections)
  const aboutActive = pathname === '/about'

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner header-inner--stack">
          <NavLink to={brandTo} className="brand">
            {brandLabel}
          </NavLink>
          <nav className="header-nav header-nav--sections" aria-label="资源分类">
            {sections.map((s) => (
              <NavLink
                key={s.id}
                to={s.path}
                className={() =>
                  `header-nav-link ${isSectionActive(pathname, s) ? 'active' : ''}`
                }
              >
                {s.label}
              </NavLink>
            ))}
            <NavLink
              to="/about"
              className={() => `header-nav-link ${aboutActive ? 'active' : ''}`}
            >
              关于
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
          <NavLink to="/submit" className="footer-link small">
            提交站点
          </NavLink>
          <NavLink to="/about" className="footer-link small">
            关于
          </NavLink>
        </div>
      </footer>
    </div>
  )
}
