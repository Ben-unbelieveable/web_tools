import type { ToolMeta } from './types'
import type { NavSectionId, ResourceLink } from './navTypes'
import { ALL_EXTERNAL_RESOURCES, getResourcesBySection } from '../data/nav'
import { listTools } from './registry'

export { getResourcesBySection }

export function listAllExternalResources(): ResourceLink[] {
  return ALL_EXTERNAL_RESOURCES
}

export function toolToResourceLink(meta: ToolMeta): ResourceLink {
  return {
    id: `tool-${meta.id}`,
    name: meta.title,
    url: meta.path,
    description: meta.description || meta.tags.join(' · '),
    tags: [...meta.tags, '本站'],
    section: 'online-tools',
    internal: true,
    icon: meta.icon,
  }
}

export function listLocalToolResources(): ResourceLink[] {
  return listTools().map(toolToResourceLink)
}

export function getSectionResources(sectionId: NavSectionId): ResourceLink[] {
  if (sectionId === 'online-tools') {
    return [...listLocalToolResources(), ...getResourcesBySection('online-tools')]
  }
  return getResourcesBySection(sectionId)
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

/** 旧分区路径重定向 */
export const LEGACY_NAV_REDIRECTS: Record<string, NavSectionId> = {
  tools: 'online-tools',
}
