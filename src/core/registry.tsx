import type { ToolMeta, ToolModule } from './types'
import { bamFlagsMeta } from '../tools/bam-flags/bamFlagsMeta'
import { BamFlagsTool } from '../tools/bam-flags/BamFlagsTool'
import { jsonYamlMeta } from '../tools/json-yaml/jsonYamlMeta'
import { JsonYamlTool } from '../tools/json-yaml/JsonYamlTool'
import { placeholderMeta } from '../tools/placeholder/placeholderMeta'
import { PlaceholderTool } from '../tools/placeholder/PlaceholderTool'

const modules: ToolModule[] = [
  { meta: bamFlagsMeta, Component: BamFlagsTool },
  { meta: jsonYamlMeta, Component: JsonYamlTool },
  {
    meta: placeholderMeta('random-sequence', '随机序列', '生成指定长度与字符集的随机序列（即将推出）', [
      'sequence',
      'utility',
    ]),
    Component: () => <PlaceholderTool title="随机序列" />,
  },
  {
    meta: placeholderMeta('argo-workflow', 'Argo Workflow', 'Argo 工作流校验与 DAG 可视化（即将推出）', [
      'workflow',
      'argo',
    ]),
    Component: () => <PlaceholderTool title="Argo Workflow" />,
  },
  {
    meta: placeholderMeta('wdl', 'WDL', 'WDL 预览与校验（即将推出）', ['workflow', 'wdl']),
    Component: () => <PlaceholderTool title="WDL" />,
  },
]

export function listTools(): ToolMeta[] {
  return modules.map((m) => m.meta)
}

export function getToolByPath(path: string): ToolModule | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return modules.find((m) => m.meta.path === normalized)
}
