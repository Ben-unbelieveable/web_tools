import type { ToolMeta } from '../../core/types'

export const qualityScoreMeta: ToolMeta = {
  id: 'quality-score',
  path: '/quality-score',
  title: '碱基质量换算',
  description: '',
  category: 'sequence',
  tags: ['fastq', 'phred'],
  capabilities: ['paste-text'],
}
