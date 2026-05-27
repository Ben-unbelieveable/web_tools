import type { NavCategory, NavCategoryId, ResourceLink } from './navTypes'
import { NAV_CATEGORIES, ALL_EXTERNAL_RESOURCES, getResourcesByCategory } from '../data/nav'

export { NAV_CATEGORIES, getResourcesByCategory }

export function listNavCategories(): NavCategory[] {
  return [...NAV_CATEGORIES].sort((a, b) => a.order - b.order)
}

export function listAllExternalResources(): ResourceLink[] {
  return ALL_EXTERNAL_RESOURCES
}

export function getCategorySectionResources(categoryId: NavCategoryId): ResourceLink[] {
  if (categoryId === 'featured') {
    const featured = ALL_EXTERNAL_RESOURCES.filter((r) => r.featured)
    return featured.length > 0 ? featured : getResourcesByCategory('featured')
  }
  return getResourcesByCategory(categoryId)
}

export function categoryAnchorId(categoryId: NavCategoryId): string {
  return `nav-${categoryId}`
}

/** 旧版工具路径（无 /tools 前缀）→ 新路径 */
export const LEGACY_TOOL_PATHS = [
  'bam-flags',
  'json-yaml',
  'random-sequence',
  'sequence-stats',
  'revcomp',
  'seq-translate',
  'quality-score',
  'primer-estimate',
  'argo-workflow',
] as const
