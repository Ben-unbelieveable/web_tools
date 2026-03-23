import { useState } from 'react'

const FLAG_BITS: { bit: number; name: string; desc: string }[] = [
  { bit: 1, name: 'PAIRED', desc: '模板有多个片段' },
  { bit: 2, name: 'PROPER_PAIR', desc: '各片段按规范比对' },
  { bit: 4, name: 'UNMAP', desc: '该 read 未比对' },
  { bit: 8, name: 'MUNMAP', desc: '配对 read 未比对' },
  { bit: 16, name: 'REVERSE', desc: '序列反向互补于参考' },
  { bit: 32, name: 'MREVERSE', desc: '配对 read 在参考上反向' },
  { bit: 64, name: 'READ1', desc: '第一条片段' },
  { bit: 128, name: 'READ2', desc: '第二条片段' },
  { bit: 256, name: 'SECONDARY', desc: '次要比对' },
  { bit: 512, name: 'QCFAIL', desc: '质控未通过' },
  { bit: 1024, name: 'DUP', desc: 'PCR 或光学重复' },
  { bit: 2048, name: 'SUPPLEMENTARY', desc: '补充比对' },
]

function parseFlagInput(raw: string): number | null {
  const t = raw.trim()
  if (t === '') return null
  if (/^\d+$/.test(t)) {
    const n = Number(t)
    if (!Number.isSafeInteger(n) || n < 0) return null
    return n
  }
  if (/^0[xX][0-9a-fA-F]+$/.test(t)) {
    const n = Number.parseInt(t, 16)
    if (!Number.isSafeInteger(n) || n < 0) return null
    return n
  }
  return null
}

export function BamFlagsTool() {
  const [input, setInput] = useState('99')

  const flagFromInput = parseFlagInput(input)

  const bitsFromFlag = (flag: number) =>
    FLAG_BITS.filter((f) => (flag & f.bit) !== 0)

  const displayFlag = flagFromInput ?? 0
  const activeBits = bitsFromFlag(displayFlag)

  return (
    <div className="tool-panel stack">
      <label className="field">
        <span className="field-label">FLAG 数值（十进制或 0x 十六进制）</span>
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          inputMode="numeric"
          aria-describedby="flag-hint"
        />
      </label>
      <p id="flag-hint" className="muted small">
        当前解析：{flagFromInput === null ? '无法解析' : `十进制 ${flagFromInput}，十六进制 0x${flagFromInput.toString(16)}`}
      </p>

      <div className="flag-grid">
        {FLAG_BITS.map((f) => {
          const on = (displayFlag & f.bit) !== 0
          return (
            <label key={f.bit} className={`flag-chip ${on ? 'on' : ''}`}>
              <input
                type="checkbox"
                checked={on}
                onChange={() => {
                  const cur = parseFlagInput(input) ?? 0
                  setInput(String(cur ^ f.bit))
                }}
              />
              <span className="flag-name">{f.name}</span>
              <span className="flag-bit">({f.bit})</span>
              <span className="flag-desc">{f.desc}</span>
            </label>
          )
        })}
      </div>

      <section className="stack tight">
        <h3 className="h3">已置位的标志</h3>
        {activeBits.length === 0 ? (
          <p className="muted">无（FLAG 为 0）</p>
        ) : (
          <ul className="list">
            {activeBits.map((f) => (
              <li key={f.bit}>
                <strong>{f.name}</strong> — {f.desc}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
