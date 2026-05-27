import { useState } from 'react'
import { NavSidebar } from '../components/nav/NavSidebar'
import { ResourceSection } from '../components/nav/ResourceSection'
import type { NavCategoryId } from '../core/navTypes'
import { listNavCategories } from '../core/navRegistry'

export function NavHomePage() {
  const [activeCategory, setActiveCategory] = useState<NavCategoryId | undefined>()
  const categories = listNavCategories()

  return (
    <div className="page page--nav">
      <div className="nav-layout">
        <NavSidebar activeId={activeCategory} onNavigate={setActiveCategory} />
        <div className="nav-main stack">
          {categories.map((c) => (
            <ResourceSection key={c.id} categoryId={c.id} />
          ))}
        </div>
      </div>
    </div>
  )
}
