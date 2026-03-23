import type { ToolMeta } from '../../core/types'

export const bamFlagsMeta: ToolMeta = {
  id: 'bam-flags',
  path: '/bam-flags',
  title: 'BAM / SAM Flag',
  description: '解析或组合 SAM 规范中的 FLAG 位标志。',
  tags: ['bam', 'sam', 'format'],
  capabilities: ['paste-text'],
}
