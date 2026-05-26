import { lazy } from 'react'

/** 与 `react-refresh` 约定：本文件仅导出懒加载工具组件。 */
export const BamFlagsTool = lazy(() =>
  import('../tools/bam-flags/BamFlagsTool').then((m) => ({ default: m.BamFlagsTool })),
)

export const JsonYamlTool = lazy(() =>
  import('../tools/json-yaml/JsonYamlTool').then((m) => ({ default: m.JsonYamlTool })),
)

export const RandomSequenceTool = lazy(() =>
  import('../tools/random-sequence/RandomSequenceTool').then((m) => ({
    default: m.RandomSequenceTool,
  })),
)

export const SequenceStatsTool = lazy(() =>
  import('../tools/sequence-stats/SequenceStatsTool').then((m) => ({
    default: m.SequenceStatsTool,
  })),
)

export const RevcompTool = lazy(() =>
  import('../tools/revcomp/RevcompTool').then((m) => ({ default: m.RevcompTool })),
)

export const QualityScoreTool = lazy(() =>
  import('../tools/quality-score/QualityScoreTool').then((m) => ({
    default: m.QualityScoreTool,
  })),
)

export const PrimerEstimateTool = lazy(() =>
  import('../tools/primer-estimate/PrimerEstimateTool').then((m) => ({
    default: m.PrimerEstimateTool,
  })),
)

export const ArgoWorkflowTool = lazy(() =>
  import('../tools/argo-workflow/ArgoWorkflowTool').then((m) => ({
    default: m.ArgoWorkflowTool,
  })),
)

export const SequenceTranslateTool = lazy(() =>
  import('../tools/seq-translate/SequenceTranslateTool').then((m) => ({
    default: m.SequenceTranslateTool,
  })),
)
