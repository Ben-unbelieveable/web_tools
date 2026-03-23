import type { ToolMeta } from '../../core/types'

export const jsonYamlMeta: ToolMeta = {
  id: 'json-yaml',
  path: '/json-yaml',
  title: 'JSON / YAML',
  description: '在 JSON 与 YAML 之间转换，并做语法检查。',
  tags: ['json', 'yaml', 'format'],
  capabilities: ['paste-text'],
}
