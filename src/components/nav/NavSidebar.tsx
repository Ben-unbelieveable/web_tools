import type { NavCategoryId } from '../../core/navTypes'
import { categoryAnchorId, listNavCategories } from '../../core/navRegistry'

interface NavSidebarProps {
  activeId?: NavCategoryId
  onNavigate?: (categoryId: NavCategoryId) => void
}

export function NavSidebar({ activeId, onNavigate }: NavSidebarProps) {
  const categories = listNavCategories()

  const scrollTo = (id: NavCategoryId) => {
    onNavigate?.(id)
    const el = document.getElementById(categoryAnchorId(id))
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="nav-sidebar" aria-label="资源分类">
      <ul className="nav-sidebar-list">
        {categories.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              className={`nav-sidebar-item ${activeId === c.id ? 'active' : ''}`}
              onClick={() => scrollTo(c.id)}
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
