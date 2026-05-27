import type { NavCategoryId, ResourceLink } from '../../core/navTypes'
import { aiPlatformLinks } from './ai-platform'
import { communityLinks } from './community'
import { dataMiningLinks } from './data-mining'
import { dataRetrievalLinks } from './data-retrieval'
import { ebooksLinks } from './ebooks'
import { educationLinks } from './education'
import { featuredLinks } from './featured'
import { fundingLinks } from './funding'
import { journalSelectLinks } from './journal-select'
import { journalsLinks } from './journals'
import { literatureSearchLinks } from './literature-search'
import { literatureShareLinks } from './literature-share'
import { literatureTranslateLinks } from './literature-translate'
import { onlineToolsExtLinks } from './online-tools-ext'
import { patentsLinks } from './patents'
import { plagiarismLinks } from './plagiarism'
import { researchIntelLinks } from './research-intel'
import { researchServiceLinks } from './research-service'
import { standardsLinks } from './standards'
import { visualizationLinks } from './visualization'

const EXTERNAL_LINKS: ResourceLink[] = [
  ...featuredLinks,
  ...dataRetrievalLinks,
  ...dataMiningLinks,
  ...onlineToolsExtLinks,
  ...visualizationLinks,
  ...aiPlatformLinks,
  ...literatureSearchLinks,
  ...literatureTranslateLinks,
  ...plagiarismLinks,
  ...journalSelectLinks,
  ...researchIntelLinks,
  ...ebooksLinks,
  ...literatureShareLinks,
  ...researchServiceLinks,
  ...fundingLinks,
  ...journalsLinks,
  ...patentsLinks,
  ...standardsLinks,
  ...communityLinks,
  ...educationLinks,
]

/** 按 id 去重合并（跨分类条目只保留一条）。 */
export function mergeResourceLinks(links: ResourceLink[]): ResourceLink[] {
  const map = new Map<string, ResourceLink>()
  for (const item of links) {
    const existing = map.get(item.id)
    if (!existing) {
      map.set(item.id, { ...item, categories: [...item.categories] })
      continue
    }
    const cats = new Set([...existing.categories, ...item.categories])
    map.set(item.id, {
      ...existing,
      ...item,
      categories: [...cats],
      featured: existing.featured || item.featured,
    })
  }
  return [...map.values()]
}

export const ALL_EXTERNAL_RESOURCES = mergeResourceLinks(EXTERNAL_LINKS)

export function getResourcesByCategory(categoryId: NavCategoryId): ResourceLink[] {
  return ALL_EXTERNAL_RESOURCES.filter((r) => r.categories.includes(categoryId))
}

export { NAV_CATEGORIES } from './categories'
