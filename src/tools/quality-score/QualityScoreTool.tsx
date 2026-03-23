import { useMemo, useState } from 'react'
import { asciiToQ, errorProbToQ, qToAscii, qToErrorProb } from '../../lib/bio/phred'

export function QualityScoreTool() {
  const [qInput, setQInput] = useState('30')
  const [pInput, setPInput] = useState('0.001')
  const [asciiCh, setAsciiCh] = useState('?')
  const [offset, setOffset] = useState<33 | 64>(33)

  const blockQ = useMemo(() => {
    const q = Number.parseFloat(qInput)
    if (!Number.isFinite(q)) return null
    const p = qToErrorProb(q)
    return {
      q,
      p,
      ascii: qToAscii(q, offset),
    }
  }, [qInput, offset])

  const blockP = useMemo(() => {
    const p = Number.parseFloat(pInput)
    if (!Number.isFinite(p) || p <= 0 || p >= 1) return null
    return { p, q: errorProbToQ(p) }
  }, [pInput])

  const blockAscii = useMemo(() => {
    if (asciiCh.length !== 1) return null
    const q = asciiToQ(asciiCh, offset)
    if (q === null) return null
    return { q, p: qToErrorProb(q) }
  }, [asciiCh, offset])

  return (
    <div className="tool-panel stack">
      <label className="field inline">
        <span className="field-label">Phred 偏移</span>
        <select
          className="input select"
          value={offset}
          onChange={(e) => setOffset(Number(e.target.value) as 33 | 64)}
        >
          <option value={33}>+33（Illumina 常见）</option>
          <option value={64}>+64（旧 Solexa）</option>
        </select>
      </label>

      <section className="stack tight">
        <h3 className="h3">Q → 错误率与 ASCII</h3>
        <div className="row gap">
          <label className="field inline">
            Q
            <input
              className="input narrow"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              inputMode="decimal"
            />
          </label>
        </div>
        {blockQ && (
          <pre className="stats-pre tight-pre">
            p = 10^(-Q/10) = {blockQ.p.toExponential(6)}
            {'\n'}
            ASCII(+{offset}) = {blockQ.ascii} (code {blockQ.ascii.charCodeAt(0)})
          </pre>
        )}
      </section>

      <section className="stack tight">
        <h3 className="h3">错误率 p → Q</h3>
        <label className="field inline">
          p（0–1）
          <input
            className="input"
            value={pInput}
            onChange={(e) => setPInput(e.target.value)}
            inputMode="decimal"
          />
        </label>
        {blockP && (
          <pre className="stats-pre tight-pre">
            Q = -10*log10(p) = {blockP.q.toFixed(4)}
          </pre>
        )}
      </section>

      <section className="stack tight">
        <h3 className="h3">质量字符 → Q</h3>
        <label className="field inline">
          单字符
          <input
            className="input narrow"
            value={asciiCh}
            maxLength={1}
            onChange={(e) => setAsciiCh(e.target.value.slice(-1) || '?')}
            spellCheck={false}
          />
        </label>
        {blockAscii && (
          <pre className="stats-pre tight-pre">
            Q = {blockAscii.q}
            {'\n'}
            p = {blockAscii.p.toExponential(6)}
          </pre>
        )}
      </section>
    </div>
  )
}
