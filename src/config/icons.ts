import { ALL_EXTERNAL_RESOURCES } from '../data/nav'
import type { ResourceLink } from '../core/navTypes'
import type { ToolMeta } from '../core/types'
import { faviconSourcesForUrl, letterIconDataUrl } from '../lib/faviconSources'

const base = import.meta.env.BASE_URL
const BASE = base.endsWith('/') ? base : `${base}/`

/** 全局默认图标与 favicon 参数。 */
export const ICON_DEFAULTS = {
  localTool: `${BASE}tool-default.svg`,
  siteFallback: `${BASE}site-default.svg`,
  faviconSize: 32,
} as const

export const RESOURCE_ICON_OVERRIDES: Partial<Record<string, string>> = {
  weiciyun: 'https://wcy-1255936925.file.myqcloud.com/pb/nlogo.svg',
}

export const TOOL_ICON_OVERRIDES: Partial<Record<string, string>> = {}

function buildResourceIconMap(): Readonly<Record<string, string>> {
  const map: Record<string, string> = {}
  for (const r of ALL_EXTERNAL_RESOURCES) {
    map[r.id] = resolveResourceIconSources(r)[0] ?? ICON_DEFAULTS.siteFallback
  }
  return map
}

export const RESOURCE_ICONS: Readonly<Record<string, string>> = buildResourceIconMap()

/** 外链资源 icon 候选链（显式 icon → 多源 favicon → 字母占位）。 */
export function resolveResourceIconSources(
  resource: Pick<ResourceLink, 'id' | 'url' | 'icon' | 'name'>,
): string[] {
  const explicit = resource.icon ?? RESOURCE_ICON_OVERRIDES[resource.id]
  if (explicit) {
    return [explicit, letterIconDataUrl(resource.name, resource.id)]
  }
  return [
    ...faviconSourcesForUrl(resource.url, ICON_DEFAULTS.faviconSize),
    letterIconDataUrl(resource.name, resource.id),
  ]
}

/** 本站工具 icon 候选链。 */
export function resolveToolIconSources(meta: Pick<ToolMeta, 'id' | 'icon' | 'title'>): string[] {
  const list: string[] = []
  const explicit = meta.icon ?? TOOL_ICON_OVERRIDES[meta.id]
  if (explicit) list.push(explicit)
  list.push(ICON_DEFAULTS.localTool)
  list.push(letterIconDataUrl(meta.title, meta.id))
  return [...new Set(list)]
}

/** 解析外链资源卡片主 icon（兼容旧调用）。 */
export function resolveResourceIcon(
  resource: Pick<ResourceLink, 'id' | 'url' | 'icon' | 'name'>,
): string {
  return resolveResourceIconSources(resource)[0] ?? ICON_DEFAULTS.siteFallback
}

export function resolveToolIcon(meta: Pick<ToolMeta, 'id' | 'icon' | 'title'>): string {
  return resolveToolIconSources(meta)[0] ?? ICON_DEFAULTS.localTool
}

/** 资源卡片统一入口（本站 / 外链）。 */
export function resolveIconSourcesForCard(
  resource: Pick<ResourceLink, 'id' | 'url' | 'icon' | 'name' | 'internal'>,
): string[] {
  if (resource.internal) {
    const toolId = resource.id.startsWith('tool-') ? resource.id.slice(5) : resource.id
    return resolveToolIconSources({
      id: toolId,
      title: resource.name,
      icon: resource.icon,
    })
  }
  return resolveResourceIconSources(resource)
}
