import type { NavSection, NavSectionId } from './navTypes'

export const NAV_SECTIONS: readonly NavSection[] = [
  {
    id: 'online-tools',
    label: '在线工具',
    description: '本站小工具与在线分析、富集等 Web 工具',
    order: 0,
    path: '/online-tools',
  },
  {
    id: 'databases',
    label: '数据库',
    description: '公共数据库、组学数据与知识库',
    order: 1,
    path: '/databases',
  },
  {
    id: 'software',
    label: '软件',
    description: '科研绘图、可视化与生信软件生态',
    order: 2,
    path: '/software',
  },
  {
    id: 'literature',
    label: '文献',
    description: '检索、翻译、互助、期刊、选刊与查重',
    order: 3,
    path: '/literature',
  },
  { id: 'patents', label: '专利', order: 4, path: '/patents' },
  { id: 'standards', label: '标准', order: 5, path: '/standards' },
  {
    id: 'bio-llm',
    label: '生物大模型',
    description: '生物与医学领域基础模型，链至原始论文',
    order: 6,
    path: '/bio-llm',
  },
  { id: 'ai', label: 'AI 工具', description: '大模型与 AI 科研助手', order: 7, path: '/ai' },
  { id: 'ebooks', label: '电子书', order: 8, path: '/ebooks' },
  { id: 'funding', label: '基金', order: 9, path: '/funding' },
  { id: 'community', label: '社区', order: 10, path: '/community' },
  { id: 'learning', label: '学习', description: '慕课与在线课程', order: 11, path: '/learning' },
] as const

export const NAV_SECTION_IDS: readonly NavSectionId[] = NAV_SECTIONS.map((s) => s.id)

export function getNavSection(id: NavSectionId): NavSection | undefined {
  return NAV_SECTIONS.find((s) => s.id === id)
}

export function getNavSectionByPath(path: string): NavSection | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return NAV_SECTIONS.find((s) => s.path === normalized)
}

export function listNavSections(): NavSection[] {
  return [...NAV_SECTIONS].sort((a, b) => a.order - b.order)
}
