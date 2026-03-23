import '@xyflow/react/dist/style.css'

import { useEffect, useMemo, useState } from 'react'
import YAML from 'yaml'
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react'
import {
  analyzeArgoYaml,
  tasksToFlowElements,
  type DagTemplateInfo,
} from './argoAnalyze'

const SAMPLE = `apiVersion: argoproj.io/v1alpha1
kind: Workflow
metadata:
  generateName: dag-demo-
spec:
  entrypoint: main
  templates:
    - name: main
      dag:
        tasks:
          - name: A
            template: whalesay
          - name: B
            dependencies: [A]
            template: whalesay
          - name: C
            dependencies: [A]
            template: whalesay
          - name: D
            dependencies: [B, C]
            template: whalesay
    - name: whalesay
      container:
        image: docker/whalesay:latest
`

function pickDefaultDag(dags: DagTemplateInfo[], entrypoint?: string): number {
  if (dags.length === 0) return 0
  if (entrypoint) {
    const i = dags.findIndex((d) => d.templateName === entrypoint)
    if (i >= 0) return i
  }
  return 0
}

function DagGraph({ nodes: initialNodes, edges: initialEdges }: { nodes: Node[]; edges: Edge[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [initialNodes, initialEdges, setNodes, setEdges])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      nodesConnectable={false}
    >
      <MiniMap />
      <Controls />
      <Background />
    </ReactFlow>
  )
}

export function ArgoWorkflowTool() {
  const [yamlText, setYamlText] = useState(SAMPLE)
  const [userPick, setUserPick] = useState<number | null>(null)

  const parseResult = useMemo(() => {
    try {
      return { ok: true as const, data: YAML.parse(yamlText) as unknown }
    } catch (e) {
      return {
        ok: false as const,
        message: e instanceof Error ? e.message : String(e),
      }
    }
  }, [yamlText])

  const parsed = parseResult.ok ? parseResult.data : null
  const parseError = parseResult.ok ? null : parseResult.message

  const analysis = useMemo(() => {
    if (parsed === null) {
      return {
        errors: [] as string[],
        warnings: [] as string[],
        apiVersion: undefined as string | undefined,
        kind: undefined as string | undefined,
        entrypoint: undefined as string | undefined,
        dagTemplates: [] as DagTemplateInfo[],
      }
    }
    return analyzeArgoYaml(parsed)
  }, [parsed])

  const defaultIdx = useMemo(
    () => pickDefaultDag(analysis.dagTemplates, analysis.entrypoint),
    [analysis.dagTemplates, analysis.entrypoint],
  )

  const safeIndex = useMemo(() => {
    const n = analysis.dagTemplates.length
    if (n === 0) return 0
    const max = n - 1
    const auto = Math.min(defaultIdx, max)
    if (userPick === null) return auto
    return Math.min(Math.max(0, userPick), max)
  }, [analysis.dagTemplates, defaultIdx, userPick])

  const selectedDag = analysis.dagTemplates[safeIndex]

  const flow = useMemo(() => {
    if (!selectedDag) return { nodes: [] as Node[], edges: [] as Edge[] }
    return tasksToFlowElements(selectedDag.tasks)
  }, [selectedDag])

  const syncEntrypoint = () => setUserPick(null)

  return (
    <div className="tool-panel stack">
      <label className="field">
        <span className="field-label">Workflow YAML</span>
        <textarea
          className="textarea code"
          value={yamlText}
          onChange={(e) => setYamlText(e.target.value)}
          spellCheck={false}
          rows={14}
        />
      </label>

      <div className="row">
        <button type="button" className="button ghost" onClick={syncEntrypoint}>
          按 entrypoint 选择模板
        </button>
      </div>

      {parseError && (
        <p className="error" role="alert">
          YAML 错误：{parseError}
        </p>
      )}

      {analysis.errors.map((e) => (
        <p key={e} className="error" role="alert">
          {e}
        </p>
      ))}

      {analysis.warnings.map((w) => (
        <p key={w} className="warning" role="status">
          {w}
        </p>
      ))}

      {analysis.dagTemplates.length > 0 && (
        <label className="field">
          <span className="field-label">含 DAG 的模板</span>
          <select
            className="input select"
            value={safeIndex}
            onChange={(e) => setUserPick(Number(e.target.value))}
          >
            {analysis.dagTemplates.map((d, i) => (
              <option key={d.templateName + i} value={i}>
                {d.templateName}（{d.tasks.length} 个 task）
              </option>
            ))}
          </select>
        </label>
      )}

      {selectedDag && flow.nodes.length > 0 && (
        <section className="stack tight">
          <h3 className="h3">DAG：{selectedDag.templateName}</h3>
          <div className="react-flow-wrap" aria-label="DAG 图">
            <ReactFlowProvider>
              <DagGraph nodes={flow.nodes} edges={flow.edges} />
            </ReactFlowProvider>
          </div>
        </section>
      )}
    </div>
  )
}
