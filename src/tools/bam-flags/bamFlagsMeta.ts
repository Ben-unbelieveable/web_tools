import type { ToolMeta } from '../../core/types'

export const bamFlagsMeta: ToolMeta = {
  id: 'bam-flags',
  path: '/tools/bam-flags',
  title: 'BAM / SAM Flag',
  description: '解析或组合 SAM 规范中的 FLAG 位标志。',
  category: 'format',
  tags: ['bam', 'sam', 'format'],
  capabilities: ['paste-text'],
}
