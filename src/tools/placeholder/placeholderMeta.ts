import type { ToolMeta } from '../../core/types'

export function placeholderMeta(
  id: string,
  title: string,
  description: string,
  tags: string[],
): ToolMeta {
  return {
    id,
    path: `/${id}`,
    title,
    description,
    tags,
    capabilities: ['paste-text'],
  }
}
