import type { ToolMeta } from '../../core/types'

export const argoWorkflowMeta: ToolMeta = {
  id: 'argo-workflow',
  path: '/argo-workflow',
  title: 'Argo Workflow',
  description: '解析 YAML、基础字段校验，以及含 dag 的模板有向图可视化。',
  category: 'workflow',
  tags: ['workflow', 'argo', 'kubernetes'],
  capabilities: ['paste-text'],
}
