export type NavCategoryId =
  | 'featured'
  | 'data-retrieval'
  | 'data-mining'
  | 'online-tools-ext'
  | 'visualization'
  | 'ai-platform'
  | 'literature-search'
  | 'literature-translate'
  | 'plagiarism'
  | 'journal-select'
  | 'research-intel'
  | 'ebooks'
  | 'literature-share'
  | 'research-service'
  | 'funding'
  | 'journals'
  | 'patents'
  | 'standards'
  | 'community'
  | 'education'

export interface ResourceLink {
  id: string
  name: string
  url: string
  description: string
  tags?: string[]
  categories: NavCategoryId[]
  featured?: boolean
  /** 本站工具条目，链至 /tools/... */
  internal?: boolean
}

export interface NavCategory {
  id: NavCategoryId
  label: string
  description?: string
  order: number
}
