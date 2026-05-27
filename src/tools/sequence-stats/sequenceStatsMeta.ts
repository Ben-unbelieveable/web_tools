import type { ToolMeta } from '../../core/types'

export const sequenceStatsMeta: ToolMeta = {
  id: 'sequence-stats',
  path: '/tools/sequence-stats',
  title: '序列统计',
  description: '',
  category: 'sequence',
  tags: ['fasta', 'fastq'],
  capabilities: ['paste-text'],
}
