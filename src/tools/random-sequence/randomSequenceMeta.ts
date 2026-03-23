import type { ToolMeta } from '../../core/types'

export const randomSequenceMeta: ToolMeta = {
  id: 'random-sequence',
  path: '/random-sequence',
  title: '随机序列 / 密码',
  description: '生物序列（DNA/RNA/蛋白/自定义）或密码生成；结果可复制或保存为文本文件（默认文件名含时间戳）。',
  category: 'sequence',
  tags: ['sequence', 'utility'],
  capabilities: ['paste-text'],
}
