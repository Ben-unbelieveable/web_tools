import type { ToolMeta } from '../../core/types'

export const sequenceTranslateMeta: ToolMeta = {
  id: 'seq-translate',
  path: '/seq-translate',
  title: '序列翻译（核酸 ↔ 氨基酸）',
  description: '核苷酸按读框翻译成氨基酸；氨基酸反向翻译为 DNA/RNA（人源偏好或兼并密码子）。',
  category: 'sequence',
  tags: ['dna', 'rna', 'protein', 'codon'],
  capabilities: ['paste-text'],
}
