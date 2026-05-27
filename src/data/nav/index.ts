import type { NavSectionId, ResourceLink } from '../../core/navTypes'
import { aiPlatformLinks } from './ai-platform'
import { bioLlmLinks } from './bio-llm'
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
  ...bioLlmLinks,
  ...aiPlatformLinks,
  ...communityLinks,
  ...educationLinks,
]

/** 按 id 去重（同 id 保留先出现的条目）。 */
export function mergeResourceLinks(links: ResourceLink[]): ResourceLink[] {
  const map = new Map<string, ResourceLink>()
  for (const item of links) {
    if (!map.has(item.id)) {
      map.set(item.id, item)
    }
  }
  return [...map.values()]
}

export const ALL_EXTERNAL_RESOURCES = mergeResourceLinks(EXTERNAL_LINKS)

export function getResourcesBySection(sectionId: NavSectionId): ResourceLink[] {
  return ALL_EXTERNAL_RESOURCES.filter((r) => r.section === sectionId)
}
