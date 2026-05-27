/** 顶栏一级分区。 */
export type NavSectionId =
  | 'online-tools'
  | 'databases'
  | 'software'
  | 'literature'
  | 'patents'
  | 'standards'
  | 'bio-llm'
  | 'ai'
  | 'ebooks'
  | 'funding'
  | 'community'
  | 'learning'

export interface ResourceLink {
  id: string
  name: string
  url: string
  description: string
  tags?: string[]
  section: NavSectionId
  featured?: boolean
  /** 本站工具条目，链至 /tools/... */
  internal?: boolean
  /** 显式 icon URL；未设置时由 config/icons 按站点 favicon 生成。 */
  icon?: string
}

export interface NavSection {
  id: NavSectionId
  label: string
  description?: string
  order: number
  /** 路由路径（不含 basename） */
  path: string
}
