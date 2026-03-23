import { useId, useState } from 'react'
import { expandDegenerate, reverseComplement, type NucleicType } from '../../lib/bio/dna'

export function RevcompTool() {
  const idMode = useId()
  const [seq, setSeq] = useState('ATCG')
  const [mode, setMode] = useState<NucleicType>('dna')
  const [out, setOut] = useState('')
  const [err, setErr] = useState<string | null>(null)

  const run = () => {
    setErr(null)
    const type = mode
    const expanded = expandDegenerate(seq, 500, type)
    if (expanded.length === 0) {
      setOut('')
      setErr('无法解析（含兼并表外字符）或序列为空。')
      return
    }
    const lines: string[] = []
    lines.push(`展开条数（上限 500）：${expanded.length}`)
    expanded.forEach((s, i) => {
      const rc = reverseComplement(s, type)
      lines.push(`--- ${i + 1}`)
      lines.push(`5'→3'  ${s}`)
      lines.push(`RC     ${rc}`)
    })
    setOut(lines.join('\n'))
  }

  return (
    <div className="tool-panel stack">
      <fieldset className="fieldset">
        <legend className="legend">核酸类型</legend>
        <div className="row gap wrap" role="radiogroup" aria-labelledby={idMode}>
          <span id={idMode} className="sr-only">
            类型
          </span>
          <label className="field inline">
            <input
              type="radio"
              name="rc-mode"
              checked={mode === 'dna'}
              onChange={() => setMode('dna')}
            />
            DNA（T）
          </label>
          <label className="field inline">
            <input
              type="radio"
              name="rc-mode"
              checked={mode === 'rna'}
              onChange={() => setMode('rna')}
            />
            RNA（U）
          </label>
        </div>
      </fieldset>

      <label className="field">
        <span className="field-label">序列（含 IUPAC 兼并碱基时可多条展开）</span>
        <textarea
          className="textarea code"
          value={seq}
          onChange={(e) => setSeq(e.target.value)}
          spellCheck={false}
          rows={6}
        />
      </label>

      <button type="button" className="button" onClick={run}>
        展开并反向互补
      </button>

      {err && (
        <p className="error" role="alert">
          {err}
        </p>
      )}

      {out && (
        <pre className="stats-pre" role="status">
          {out}
        </pre>
      )}
    </div>
  )
}
