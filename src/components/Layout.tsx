import { NavLink, Outlet } from 'react-router-dom'
import { listTools } from '../core/registry'

export function Layout() {
  const tools = listTools()

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="brand" end>
            BioTools
          </NavLink>
          <p className="tagline">生信常用小工具 · 纯前端 · 数据不出浏览器</p>
        </div>
      </header>

      <div className="body">
        <aside className="sidebar" aria-label="工具列表">
          <nav className="nav">
            <NavLink to="/" className="nav-link" end>
              首页
            </NavLink>
            {tools.map((t) => (
              <NavLink key={t.id} to={t.path} className="nav-link">
                {t.title}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
