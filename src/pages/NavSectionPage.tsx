import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ResourceCard } from '../components/nav/ResourceCard'
import { SectionTagFilter } from '../components/nav/SectionTagFilter'
import { getNavSectionByPath } from '../core/navSections'
import { getSectionResources } from '../core/navRegistry'
import {
  collectUniqueTags,
  filterResourcesByTags,
  toggleTagSelection,
} from '../lib/sectionTags'

export function NavSectionPage() {
  const { pathname } = useLocation()
  const section = getNavSectionByPath(pathname)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const resources = useMemo(
    () => (section ? getSectionResources(section.id) : []),
    [section],
  )

  const tags = useMemo(() => collectUniqueTags(resources), [resources])

  const visible = useMemo(
    () => filterResourcesByTags(resources, selectedTags),
    [resources, selectedTags],
  )

  useEffect(() => {
    setSelectedTags([])
  }, [pathname])

  useEffect(() => {
    setSelectedTags((prev) => prev.filter((t) => tags.includes(t)))
  }, [tags])

  if (!section) {
    return <Navigate to="/online-tools" replace />
  }

  return (
    <div className="page page--nav stack">
      <SectionTagFilter
        tags={tags}
        selectedTags={selectedTags}
        onToggleTag={(tag) => setSelectedTags((prev) => toggleTagSelection(prev, tag))}
        onClear={() => setSelectedTags([])}
      />

      {resources.length === 0 ? (
        <p className="muted">暂无收录资源。</p>
      ) : visible.length === 0 ? (
        <p className="muted">当前所选标签下暂无资源。</p>
      ) : (
        <ul className="card-grid">
          {visible.map((r) => (
            <li key={r.id}>
              <ResourceCard resource={r} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
