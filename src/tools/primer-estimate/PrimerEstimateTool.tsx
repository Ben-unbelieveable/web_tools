import { useMemo, useState } from 'react'
import { analyzePrimer } from '../../lib/bio/primer'

export function PrimerEstimateTool() {
  const [seq, setSeq] = useState('ATCGATCGATCG')
  const [naMm, setNaMm] = useState('50')

  const r = useMemo(() => {
    const m = Number.parseFloat(naMm)
    const naMolar = Number.isFinite(m) && m > 0 ? m / 1000 : 0.05
    return analyzePrimer(seq, naMolar)
  }, [seq, naMm])

  return (
    <div className="tool-panel stack">
      <label className="field">
        <span className="field-label">引物序列（单链，A/T/G/C/U）</span>
        <textarea
          className="textarea code"
          value={seq}
          onChange={(e) => setSeq(e.target.value)}
          spellCheck={false}
          rows={4}
        />
      </label>
      <label className="field inline">
        <span className="field-label">Na⁺ 浓度（mM）</span>
        <input
          className="input narrow"
          value={naMm}
          onChange={(e) => setNaMm(e.target.value)}
          inputMode="decimal"
        />
      </label>

      <dl className="primer-dl">
        <dt>长度</dt>
        <dd>{r.length}</dd>
        <dt>A / T+U / G / C</dt>
        <dd>
          {r.nA} / {r.nT} / {r.nG} / {r.nC}
          {r.nAmbiguous > 0 && `（非明确碱基 ${r.nAmbiguous}）`}
        </dd>
        <dt>GC%</dt>
        <dd>{r.gcPercent.toFixed(2)}</dd>
        <dt>Tm Wallace（℃）</dt>
        <dd>{r.tmWallace.toFixed(2)}</dd>
        <dt>Tm + 盐校正（相对 50 mM，℃）</dt>
        <dd>{r.tmSaltApprox.toFixed(2)}</dd>
      </dl>
    </div>
  )
}
