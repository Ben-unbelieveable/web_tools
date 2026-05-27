interface SectionTagFilterProps {
  tags: string[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void
  onClear: () => void
}

export function SectionTagFilter({
  tags,
  selectedTags,
  onToggleTag,
  onClear,
}: SectionTagFilterProps) {
  if (tags.length === 0) return null

  const noneSelected = selectedTags.length === 0

  return (
    <nav className="section-tag-filter" aria-label="标签筛选">
      <button
        type="button"
        className={`category-nav-item ${noneSelected ? 'active' : ''}`}
        onClick={onClear}
        aria-pressed={noneSelected}
      >
        全部
      </button>
      {tags.map((tag) => {
        const active = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            className={`category-nav-item ${active ? 'active' : ''}`}
            onClick={() => onToggleTag(tag)}
            aria-pressed={active}
          >
            {tag}
          </button>
        )
      })}
    </nav>
  )
}
