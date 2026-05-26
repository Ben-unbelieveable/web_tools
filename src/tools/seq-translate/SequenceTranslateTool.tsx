import { useId, useState } from 'react'
import type { NucleicType } from '../../lib/bio/dna'
import {
  translateSequence,
  type BackTranslateStrategy,
  type TranslateDirection,
} from '../../lib/bio/translate'

export function SequenceTranslateTool() {
  const idDirection = useId()
  const idNucleic = useId()
  const idFrame = useId()
  const idStrategy = useId()

  const [direction, setDirection] = useState<TranslateDirection>('nt-to-aa')
  const [nucleicType, setNucleicType] = useState<NucleicType>('dna')
  const [frame, setFrame] = useState<0 | 1 | 2>(0)
  const [backStrategy, setBackStrategy] = useState<BackTranslateStrategy>('human')
  const [input, setInput] = useState('ATGGCCATTGTA')
  const [output, setOutput] = useState('')
  const [notes, setNotes] = useState<string[]>([])
  const [err, setErr] = useState<string | null>(null)

  const run = () => {
    setErr(null)
    setNotes([])
    const result = translateSequence(input, {
      direction,
      nucleicType,
      frame,
      backStrategy,
    })
    if (!result.ok) {
      setOutput('')
      setErr(result.message)
      return
    }
    setOutput(result.output)
    setNotes(result.notes)
  }

  const copy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
    } catch {
      setErr('复制失败：请检查浏览器剪贴板权限。')
    }
  }

  const isNtToAa = direction === 'nt-to-aa'

  return (
    <div className="tool-panel stack">
      <fieldset className="fieldset">
        <legend className="legend">转换方向</legend>
        <div className="row gap wrap" role="radiogroup" aria-labelledby={idDirection}>
          <span id={idDirection} className="sr-only">
            方向
          </span>
          <label className="field inline">
            <input
              type="radio"
              name="st-direction"
              checked={isNtToAa}
              onChange={() => setDirection('nt-to-aa')}
            />
            核苷酸 → 氨基酸
          </label>
          <label className="field inline">
            <input
              type="radio"
              name="st-direction"
              checked={!isNtToAa}
              onChange={() => setDirection('aa-to-nt')}
            />
            氨基酸 → 核苷酸
          </label>
        </div>
      </fieldset>

      <fieldset className="fieldset">
        <legend className="legend">核酸类型</legend>
        <div className="row gap wrap" role="radiogroup" aria-labelledby={idNucleic}>
          <span id={idNucleic} className="sr-only">
            核酸类型
          </span>
          <label className="field inline">
            <input
              type="radio"
              name="st-nucleic"
              checked={nucleicType === 'dna'}
              onChange={() => setNucleicType('dna')}
            />
            DNA（T）
          </label>
          <label className="field inline">
            <input
              type="radio"
              name="st-nucleic"
              checked={nucleicType === 'rna'}
              onChange={() => setNucleicType('rna')}
            />
            RNA（U）
          </label>
        </div>
      </fieldset>

      {isNtToAa ? (
        <fieldset className="fieldset">
          <legend className="legend">读框</legend>
          <div className="row gap wrap" role="radiogroup" aria-labelledby={idFrame}>
            <span id={idFrame} className="sr-only">
              读框
            </span>
            {([0, 1, 2] as const).map((f) => (
              <label key={f} className="field inline">
                <input
                  type="radio"
                  name="st-frame"
                  checked={frame === f}
                  onChange={() => setFrame(f)}
                />
                读框 {f + 1}（偏移 {f}）
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <fieldset className="fieldset">
          <legend className="legend">密码子选择</legend>
          <div className="row gap wrap" role="radiogroup" aria-labelledby={idStrategy}>
            <span id={idStrategy} className="sr-only">
              反向翻译策略
            </span>
            <label className="field inline">
              <input
                type="radio"
                name="st-strategy"
                checked={backStrategy === 'human'}
                onChange={() => setBackStrategy('human')}
              />
              人源偏好密码子
            </label>
            <label className="field inline">
              <input
                type="radio"
                name="st-strategy"
                checked={backStrategy === 'degenerate'}
                onChange={() => setBackStrategy('degenerate')}
              />
              兼并密码子（最少兼并）
            </label>
          </div>
        </fieldset>
      )}

      <label className="field">
        <span className="field-label">
          {isNtToAa ? '核苷酸序列' : '氨基酸序列（单字母，* 表示终止）'}
        </span>
        <textarea
          className="textarea code"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          rows={6}
          placeholder={isNtToAa ? 'ATGGCC… 或 FASTA' : 'MAIVMGRLKGAR'}
        />
      </label>

      <div className="row wrap">
        <button type="button" className="button" onClick={run}>
          转换
        </button>
        <button type="button" className="button ghost" onClick={copy} disabled={!output}>
          复制结果
        </button>
      </div>

      {err && (
        <p className="error" role="alert">
          {err}
        </p>
      )}

      {notes.length > 0 && (
        <ul className="muted small">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}

      {output && (
        <label className="field">
          <span className="field-label">{isNtToAa ? '氨基酸序列' : '核苷酸序列'}</span>
          <textarea className="textarea code" readOnly value={output} rows={6} spellCheck={false} />
        </label>
      )}

      <p className="muted small">
        使用标准遗传密码表（NCBI table 1）。核苷酸→氨基酸时仅接受明确碱基 A/C/G/T(U)；氨基酸→核苷酸为理论反向翻译，不代表真实表达序列。
      </p>
    </div>
  )
}
