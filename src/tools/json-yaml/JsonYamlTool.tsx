import { useState } from 'react'
import YAML from 'yaml'

type Mode = 'json-to-yaml' | 'yaml-to-json'

function prettyJson(text: string): string {
  return JSON.stringify(JSON.parse(text), null, 2)
}

export function JsonYamlTool() {
  const [mode, setMode] = useState<Mode>('yaml-to-json')
  const [input, setInput] = useState(`name: demo
count: 2
nested:
  ok: true
`)
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const run = () => {
    setError(null)
    setOutput('')
    try {
      if (mode === 'yaml-to-json') {
        const data = YAML.parse(input)
        setOutput(JSON.stringify(data, null, 2))
      } else {
        const obj = JSON.parse(input) as unknown
        setOutput(YAML.stringify(obj))
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
    }
  }

  return (
    <div className="tool-panel stack">
      <div className="row gap">
        <label className="field inline">
          <input
            type="radio"
            name="jy-mode"
            checked={mode === 'yaml-to-json'}
            onChange={() => setMode('yaml-to-json')}
          />
          YAML → JSON
        </label>
        <label className="field inline">
          <input
            type="radio"
            name="jy-mode"
            checked={mode === 'json-to-yaml'}
            onChange={() => setMode('json-to-yaml')}
          />
          JSON → YAML
        </label>
      </div>

      <label className="field">
        <span className="field-label">输入</span>
        <textarea
          className="textarea"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          rows={14}
        />
      </label>

      <div className="row">
        <button type="button" className="button" onClick={run}>
          转换
        </button>
        {mode === 'json-to-yaml' && (
          <button
            type="button"
            className="button ghost"
            onClick={() => {
              try {
                setInput(prettyJson(input))
                setError(null)
              } catch {
                setError('当前输入不是合法 JSON')
              }
            }}
          >
            格式化 JSON 输入
          </button>
        )}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {output && (
        <label className="field">
          <span className="field-label">输出</span>
          <textarea className="textarea" readOnly value={output} rows={14} spellCheck={false} />
        </label>
      )}
    </div>
  )
}
