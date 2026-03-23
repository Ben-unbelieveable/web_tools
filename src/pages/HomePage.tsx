import { Link } from 'react-router-dom'
import { listTools } from '../core/registry'

export function HomePage() {
  const tools = listTools()

  return (
    <div className="page stack">
      <header className="page-header">
        <h1 className="h1">工具列表</h1>
        <p className="lead muted">
          基于 React + Vite 构建；后续可接入后端而不改页面结构。请在左侧选择工具。
        </p>
      </header>

      <ul className="card-list">
        {tools.map((t) => (
          <li key={t.id}>
            <Link to={t.path} className="card">
              <h2 className="h2">{t.title}</h2>
              <p className="muted">{t.description}</p>
              <div className="tags">
                {t.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
