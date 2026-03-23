import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, getCategoryLabel, type CategoryId } from '../core/categories'
import { listTools } from '../core/registry'

type Filter = 'all' | CategoryId

export function HomePage() {
  const tools = listTools()
  const [filter, setFilter] = useState<Filter>('all')

  const visible = useMemo(() => {
    const list = filter === 'all' ? tools : tools.filter((t) => t.category === filter)
    const catOrder = (id: CategoryId) => CATEGORIES.findIndex((c) => c.id === id)
    return [...list].sort((a, b) => {
      if (filter === 'all') {
        const d = catOrder(a.category) - catOrder(b.category)
        if (d !== 0) return d
      }
      return a.title.localeCompare(b.title, 'zh-CN')
    })
  }, [tools, filter])

  return (
    <div className="page page--home">
      <nav className="category-nav" aria-label="工具分类">
        <button
          type="button"
          className={`category-nav-item ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          全部
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`category-nav-item ${filter === c.id ? 'active' : ''}`}
            onClick={() => setFilter(c.id)}
            aria-pressed={filter === c.id}
          >
            {c.label}
          </button>
        ))}
      </nav>

      <ul className="card-grid">
        {visible.map((t) => (
          <li key={t.id}>
            <Link to={t.path} className="card card-tile">
              {filter === 'all' && (
                <span className="card-tile-cat">{getCategoryLabel(t.category)}</span>
              )}
              <h2 className="card-tile-title">{t.title}</h2>
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
