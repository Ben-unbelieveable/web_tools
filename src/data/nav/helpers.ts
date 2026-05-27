import type { NavCategoryId, ResourceLink } from '../../core/navTypes'

type LinkInput = Omit<ResourceLink, 'categories'> & { categories: NavCategoryId[] }

export function link(input: LinkInput): ResourceLink {
  return input
}
