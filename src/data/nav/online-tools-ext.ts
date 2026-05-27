import { link } from './helpers'

export const onlineToolsExtLinks = [
  link({
    id: 'david',
    name: 'DAVID',
    url: 'https://david.ncifcrf.gov/',
    description: '基因功能注释和通路富集分析的综合性在线工具。',
    section: 'online-tools',
    tags: ['enrichment'],
  }),
  link({
    id: 'gsea',
    name: 'GSEA',
    url: 'https://www.gsea-msigdb.org/gsea/index.jsp',
    description: '基因集富集分析的经典工具，支持多种物种和数据类型。',
    section: 'online-tools',
    tags: ['enrichment'],
  }),
  link({
    id: 'kobas',
    name: 'KOBAS',
    url: 'http://kobas.cbi.pku.edu.cn/',
    description: '基因组注释和通路富集分析的在线系统，支持多物种。',
    section: 'online-tools',
    tags: ['enrichment'],
  }),
  link({
    id: 'metascape',
    name: 'Metascape',
    url: 'https://metascape.org/',
    description: '基因列表的功能富集和网络分析的一站式分析平台。',
    section: 'online-tools',
    tags: ['enrichment'],
  }),
  link({
    id: 'webgestalt',
    name: 'WebGestalt',
    url: 'https://www.webgestalt.org/',
    description: '基因集的功能富集分析工具，支持多种分析方法和数据库。',
    section: 'online-tools',
    tags: ['enrichment'],
  }),
]
