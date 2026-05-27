import type { ResourceLink } from '../core/navTypes'

/** 当前分区资源中去重后的标签（按中文排序）。 */
export function collectUniqueTags(resources: readonly ResourceLink[]): string[] {
  const set = new Set<string>()
  for (const r of resources) {
    for (const tag of r.tags ?? []) {
      const t = tag.trim()
      if (t) set.add(t)
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'zh-CN'))
}

/** 多选标签过滤：未选任何标签时返回全部；否则返回同时包含所有已选标签的条目。 */
export function filterResourcesByTags(
  resources: readonly ResourceLink[],
  selectedTags: readonly string[],
): ResourceLink[] {
  if (selectedTags.length === 0) return [...resources]
  return resources.filter((r) => {
    const tags = r.tags ?? []
    return selectedTags.every((t) => tags.includes(t))
  })
}

export function toggleTagSelection(
  selected: readonly string[],
  tag: string,
): string[] {
  const set = new Set(selected)
  if (set.has(tag)) set.delete(tag)
  else set.add(tag)
  return [...set]
}
