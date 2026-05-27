import type { ResourceLink } from '../../core/navTypes'

type LinkInput = Omit<ResourceLink, never>

export function link(input: LinkInput): ResourceLink {
  return input
}
