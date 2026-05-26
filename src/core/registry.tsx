import type { ToolMeta, ToolModule } from './types'
import {
  ArgoWorkflowTool,
  BamFlagsTool,
  JsonYamlTool,
  PrimerEstimateTool,
  QualityScoreTool,
  RandomSequenceTool,
  RevcompTool,
  SequenceStatsTool,
  SequenceTranslateTool,
} from './lazyToolComponents'
import { argoWorkflowMeta } from '../tools/argo-workflow/argoWorkflowMeta'
import { bamFlagsMeta } from '../tools/bam-flags/bamFlagsMeta'
import { jsonYamlMeta } from '../tools/json-yaml/jsonYamlMeta'
import { primerEstimateMeta } from '../tools/primer-estimate/primerEstimateMeta'
import { qualityScoreMeta } from '../tools/quality-score/qualityScoreMeta'
import { randomSequenceMeta } from '../tools/random-sequence/randomSequenceMeta'
import { revcompMeta } from '../tools/revcomp/revcompMeta'
import { sequenceStatsMeta } from '../tools/sequence-stats/sequenceStatsMeta'
import { sequenceTranslateMeta } from '../tools/seq-translate/sequenceTranslateMeta'

const modules: ToolModule[] = [
  { meta: bamFlagsMeta, Component: BamFlagsTool },
  { meta: jsonYamlMeta, Component: JsonYamlTool },
  { meta: randomSequenceMeta, Component: RandomSequenceTool },
  { meta: sequenceStatsMeta, Component: SequenceStatsTool },
  { meta: revcompMeta, Component: RevcompTool },
  { meta: sequenceTranslateMeta, Component: SequenceTranslateTool },
  { meta: qualityScoreMeta, Component: QualityScoreTool },
  { meta: primerEstimateMeta, Component: PrimerEstimateTool },
  { meta: argoWorkflowMeta, Component: ArgoWorkflowTool },
]

export function listTools(): ToolMeta[] {
  return modules.map((m) => m.meta)
}

export function getToolByPath(path: string): ToolModule | undefined {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return modules.find((m) => m.meta.path === normalized)
}
