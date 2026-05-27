import type { NavCategory } from '../../core/navTypes'

export const NAV_CATEGORIES: readonly NavCategory[] = [
  { id: 'featured', label: '常用推荐', order: 0 },
  { id: 'data-retrieval', label: '数据检索', description: '公共数据库与基因组浏览器', order: 1 },
  { id: 'data-mining', label: '数据挖掘', description: '组学数据在线分析与挖掘', order: 2 },
  { id: 'online-tools-ext', label: '在线工具', description: '功能富集、通路分析与网络工具', order: 3 },
  { id: 'visualization', label: '数据可视', description: '科研绘图与可视化平台', order: 4 },
  { id: 'ai-platform', label: 'AI 平台', description: '大模型与 AI 科研助手', order: 5 },
  { id: 'literature-search', label: '文献检索', description: '中英文文献与预印本检索', order: 6 },
  { id: 'literature-translate', label: '文献翻译', description: '翻译与写作辅助', order: 7 },
  { id: 'plagiarism', label: '论文查重', description: '学术不端与相似度检测', order: 8 },
  { id: 'journal-select', label: '投稿选刊', description: '期刊评价与选刊建议', order: 9 },
  { id: 'research-intel', label: '科研情报', description: '学者画像与会议信息', order: 10 },
  { id: 'ebooks', label: '电子图书', description: '电子书与期刊下载', order: 11 },
  { id: 'literature-share', label: '互助推送', description: '文献互助与 RSS 订阅', order: 12 },
  { id: 'research-service', label: '科研服务', description: '生信软件生态与计算平台', order: 13 },
  { id: 'funding', label: '基金项目', description: '中外科研基金查询', order: 14 },
  { id: 'journals', label: '期刊出版', description: '顶级期刊与预印本', order: 15 },
  { id: 'patents', label: '中外专利', description: '专利检索与全文', order: 16 },
  { id: 'standards', label: '标准全文', description: '国家标准与国际标准', order: 17 },
  { id: 'community', label: '科研社区', description: '学术交流与问答社区', order: 18 },
  { id: 'education', label: '教育学习', description: '慕课与在线课程', order: 19 },
] as const
