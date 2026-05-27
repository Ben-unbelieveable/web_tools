import type { NavCategoryId } from '../../core/navTypes'
import { categoryAnchorId, getCategorySectionResources } from '../../core/navRegistry'
import { NAV_CATEGORIES } from '../../data/nav/categories'
import { ResourceCard } from './ResourceCard'

interface ResourceSectionProps {
  categoryId: NavCategoryId
}

export function ResourceSection({ categoryId }: ResourceSectionProps) {
  const meta = NAV_CATEGORIES.find((c) => c.id === categoryId)
  if (!meta) return null

  const resources = getCategorySectionResources(categoryId)
  if (resources.length === 0) return null

  return (
    <section
      id={categoryAnchorId(categoryId)}
      className="resource-section"
      aria-labelledby={`${categoryAnchorId(categoryId)}-title`}
    >
      <header className="resource-section-header">
        <h2 id={`${categoryAnchorId(categoryId)}-title`} className="h2">
          {meta.label}
        </h2>
        {meta.description && <p className="muted">{meta.description}</p>}
      </header>
      <ul className="card-grid">
        {resources.map((r) => (
          <li key={r.id}>
            <ResourceCard resource={r} />
          </li>
        ))}
      </ul>
    </section>
  )
}
