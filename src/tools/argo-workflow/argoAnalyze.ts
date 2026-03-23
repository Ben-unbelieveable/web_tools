import type { Edge, Node } from '@xyflow/react'

const ARGO_KINDS = new Set([
  'Workflow',
  'WorkflowTemplate',
  'ClusterWorkflowTemplate',
  'CronWorkflow',
])

function isRecord(x: unknown): x is Record<string, unknown> {
  return x !== null && typeof x === 'object' && !Array.isArray(x)
}

export function getTemplatesFromDoc(doc: unknown): unknown[] | null {
  if (!isRecord(doc)) return null
  const spec = doc.spec
  if (!isRecord(spec)) return null
  if (Array.isArray(spec.templates)) return spec.templates
  const ws = spec.workflowSpec
  if (isRecord(ws) && Array.isArray(ws.templates)) return ws.templates
  return null
}

export interface DagTask {
  name: string
  dependencies: string[]
}

export interface DagTemplateInfo {
  templateName: string
  tasks: DagTask[]
}

function parseDagTask(raw: unknown): DagTask | null {
  if (!isRecord(raw)) return null
  const name = typeof raw.name === 'string' ? raw.name : null
  if (!name) return null
  const depsRaw = raw.dependencies
  const deps = Array.isArray(depsRaw)
    ? depsRaw.filter((d): d is string => typeof d === 'string')
    : []
  return { name, dependencies: deps }
}

export function extractDagFromTemplate(tpl: unknown): DagTask[] | null {
  if (!isRecord(tpl)) return null
  const dag = tpl.dag
  if (!isRecord(dag)) return null
  const tasksRaw = dag.tasks
  if (!Array.isArray(tasksRaw)) return null
  const tasks = tasksRaw.map(parseDagTask).filter((x): x is DagTask => x !== null)
  return tasks.length > 0 ? tasks : []
}

export function listDagTemplates(templates: unknown[]): DagTemplateInfo[] {
  const out: DagTemplateInfo[] = []
  for (const tpl of templates) {
    if (!isRecord(tpl)) continue
    const templateName = typeof tpl.name === 'string' ? tpl.name : ''
    const tasks = extractDagFromTemplate(tpl)
    if (tasks && tasks.length > 0) {
      out.push({ templateName: templateName || '(未命名)', tasks })
    }
  }
  return out
}

export interface ArgoAnalyzeResult {
  errors: string[]
  warnings: string[]
  apiVersion?: string
  kind?: string
  entrypoint?: string
  dagTemplates: DagTemplateInfo[]
}

export function analyzeArgoYaml(doc: unknown): ArgoAnalyzeResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!isRecord(doc)) {
    errors.push('根节点不是 YAML 对象')
    return { errors, warnings, dagTemplates: [] }
  }

  const apiVersion = typeof doc.apiVersion === 'string' ? doc.apiVersion : undefined
  const kind = typeof doc.kind === 'string' ? doc.kind : undefined

  if (!apiVersion) errors.push('缺少 apiVersion')
  else if (!apiVersion.includes('argoproj.io')) {
    warnings.push(`apiVersion 不是常见的 argoproj.io（当前：${apiVersion}）`)
  }

  if (!kind) errors.push('缺少 kind')
  else if (!ARGO_KINDS.has(kind)) {
    warnings.push(`kind 非典型 Argo Workflow 资源（当前：${kind}）`)
  }

  const templates = getTemplatesFromDoc(doc)
  if (!templates) {
    errors.push('未找到 spec.templates 或 spec.workflowSpec.templates')
    return { errors, warnings, apiVersion, kind, dagTemplates: [] }
  }

  let entrypoint: string | undefined
  if (isRecord(doc.spec) && typeof doc.spec.entrypoint === 'string') {
    entrypoint = doc.spec.entrypoint
  }

  const dagTemplates = listDagTemplates(templates)

  if (dagTemplates.length === 0) {
    warnings.push('未发现包含 dag.tasks 的模板，无法绘制 DAG（步骤类模板请改用集群侧工具查看）')
  }

  if (entrypoint && dagTemplates.length > 0) {
    const hit = dagTemplates.some((d) => d.templateName === entrypoint)
    if (!hit) {
      warnings.push(`entrypoint 为「${entrypoint}」，但未找到同名且含 dag 的模板；请在下方选择要可视化的模板`)
    }
  }

  return {
    errors,
    warnings,
    apiVersion,
    kind,
    entrypoint,
    dagTemplates,
  }
}

function collectNodeIds(tasks: DagTask[]): Set<string> {
  const ids = new Set<string>()
  for (const t of tasks) {
    ids.add(t.name)
    for (const d of t.dependencies) ids.add(d)
  }
  return ids
}

/** Longest-path layering; cycles get arbitrary layer via visited guard. */
function layerMap(ids: Set<string>, edges: [string, string][]): Map<string, number> {
  const preds = new Map<string, Set<string>>()
  for (const id of ids) preds.set(id, new Set())
  for (const [from, to] of edges) {
    if (!preds.has(to)) preds.set(to, new Set())
    preds.get(to)!.add(from)
  }
  const memo = new Map<string, number>()
  const visiting = new Set<string>()

  function depth(n: string): number {
    if (memo.has(n)) return memo.get(n)!
    if (visiting.has(n)) {
      memo.set(n, 0)
      return 0
    }
    visiting.add(n)
    const ps = preds.get(n) ?? new Set()
    let m = 0
    for (const p of ps) m = Math.max(m, depth(p) + 1)
    visiting.delete(n)
    memo.set(n, m)
    return m
  }

  for (const n of ids) depth(n)
  return memo
}

export function tasksToFlowElements(tasks: DagTask[]): { nodes: Node[]; edges: Edge[] } {
  const ids = collectNodeIds(tasks)
  const edgesArr: [string, string][] = []
  for (const t of tasks) {
    for (const d of t.dependencies) {
      edgesArr.push([d, t.name])
    }
  }

  const layers = layerMap(ids, edgesArr)
  const byLayer = new Map<number, string[]>()
  let maxL = 0
  for (const id of ids) {
    const L = layers.get(id) ?? 0
    maxL = Math.max(maxL, L)
    if (!byLayer.has(L)) byLayer.set(L, [])
    byLayer.get(L)!.push(id)
  }
  for (const arr of byLayer.values()) arr.sort((a, b) => a.localeCompare(b))

  const xGap = 240
  const yGap = 72
  const nodes: Node[] = []
  for (let L = 0; L <= maxL; L++) {
    const row = byLayer.get(L) ?? []
    row.forEach((id, yi) => {
      nodes.push({
        id,
        position: { x: L * xGap, y: yi * yGap },
        data: { label: id },
        type: 'default',
      })
    })
  }

  const edges: Edge[] = edgesArr.map(([from, to], i) => ({
    id: `e-${from}-${to}-${i}`,
    source: from,
    target: to,
    animated: true,
  }))

  return { nodes, edges }
}
