import { useState } from 'react'
import { buildSequenceStatsReport } from '../../lib/bio/sequenceStatsReport'

export function SequenceStatsTool() {
  const [text, setText] = useState('')
  const [qualOffset, setQualOffset] = useState(33)
  const [out, setOut] = useState('')

  const run = () => {
    setOut(buildSequenceStatsReport(text, qualOffset))
  }

  return (
    <div className="tool-panel stack">
      <label className="field">
        <span className="field-label">FASTA / FASTQ / 裸序列</span>
        <textarea
          className="textarea code"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          rows={14}
        />
      </label>
      <div className="row gap wrap">
        <label className="field inline">
          <span className="field-label">FASTQ 质量 Phred 偏移</span>
          <input
            className="input narrow"
            type="number"
            value={qualOffset}
            onChange={(e) => setQualOffset(Number(e.target.value) || 33)}
            min={33}
            max={64}
          />
        </label>
        <button type="button" className="button" onClick={run}>
          统计
        </button>
      </div>
      {out && (
        <pre className="stats-pre" role="status">
          {out}
        </pre>
      )}
    </div>
  )
}
