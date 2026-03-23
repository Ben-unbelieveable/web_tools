import { useId, useMemo, useState } from 'react'

type Mode = 'sequence' | 'password'
type PresetId = 'dna' | 'rna' | 'protein' | 'custom'

/** 切换模式时写入的默认「每条长度 / 密码长度」（条数不变，避免误覆盖批量需求）。 */
const MODE_DEFAULT_LENGTH: Record<Mode, string> = {
  sequence: '80',
  password: '16',
}

const PRESETS: Record<Exclude<PresetId, 'custom'>, { label: string; alphabet: string }> = {
  dna: { label: 'DNA', alphabet: 'ACGT' },
  rna: { label: 'RNA', alphabet: 'ACGU' },
  protein: {
    label: '蛋白（单字母）',
    alphabet: 'ACDEFGHIKLMNPQRSTVWY',
  },
}

const PW_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const PW_LOWER = 'abcdefghijklmnopqrstuvwxyz'
const PW_DIGITS = '0123456789'
const PW_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

const PW_UPPER_CLEAR = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
const PW_LOWER_CLEAR = 'abcdefghijkmnopqrstuvwxyz'
const PW_DIGITS_CLEAR = '23456789'

/** Uniform index in [0, n) using rejection sampling on bytes (no modulo bias). */
function randomChar(alphabet: string): string {
  const n = alphabet.length
  if (n === 0) return ''
  const max = 256 - (256 % n)
  const buf = new Uint8Array(1)
  for (;;) {
    crypto.getRandomValues(buf)
    const v = buf[0]!
    if (v < max) return alphabet[v % n]!
  }
}

/** Uniform integer in [0, maxExclusive). */
function randomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0
  const max = 256 - (256 % maxExclusive)
  const buf = new Uint8Array(1)
  for (;;) {
    crypto.getRandomValues(buf)
    const v = buf[0]!
    if (v < max) return v % maxExclusive
  }
}

function shuffleStringChars(s: string): string {
  const arr = [...s]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1)
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr.join('')
}

function generateSequences(alphabet: string, length: number, count: number): string {
  const chars = [...new Set(alphabet.split(''))].join('')
  if (chars.length === 0) return ''
  const lines: string[] = []
  for (let c = 0; c < count; c++) {
    let s = ''
    for (let i = 0; i < length; i++) s += randomChar(chars)
    lines.push(s)
  }
  return lines.join('\n')
}

interface PwOptions {
  useUpper: boolean
  useLower: boolean
  useDigits: boolean
  useSymbols: boolean
  excludeAmbiguous: boolean
}

function buildPasswordAlphabet(o: PwOptions): { pools: string[]; union: string } {
  const u = o.excludeAmbiguous ? PW_UPPER_CLEAR : PW_UPPER
  const l = o.excludeAmbiguous ? PW_LOWER_CLEAR : PW_LOWER
  const d = o.excludeAmbiguous ? PW_DIGITS_CLEAR : PW_DIGITS
  const pools: string[] = []
  if (o.useUpper) pools.push(u)
  if (o.useLower) pools.push(l)
  if (o.useDigits) pools.push(d)
  if (o.useSymbols) pools.push(PW_SYMBOLS)
  const union = [...new Set(pools.join('').split(''))].join('')
  return { pools, union }
}

/** 每类至少 1 个字符，其余从并集中随机，再打乱顺序。 */
function generatePassword(length: number, o: PwOptions): string {
  const { pools, union } = buildPasswordAlphabet(o)
  if (pools.length === 0 || union.length === 0) return ''
  if (length < pools.length) return ''
  const picks: string[] = []
  for (const p of pools) {
    picks.push(randomChar(p))
  }
  while (picks.length < length) {
    picks.push(randomChar(union))
  }
  return shuffleStringChars(picks.join(''))
}

function generatePasswords(length: number, count: number, o: PwOptions): string {
  const lines: string[] = []
  for (let i = 0; i < count; i++) {
    const line = generatePassword(length, o)
    if (line === '') return ''
    lines.push(line)
  }
  return lines.join('\n')
}

/** 本地时间，用于默认文件名：random-sequence-20250323-143052.txt */
function defaultDownloadBasename(mode: Mode): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  return mode === 'password' ? `password-${stamp}.txt` : `random-sequence-${stamp}.txt`
}

function downloadTextFile(text: string, filename: string) {
  const safe = filename.trim() || defaultDownloadBasename('sequence')
  const name = safe.endsWith('.txt') ? safe : `${safe}.txt`
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function RandomSequenceTool() {
  const idPreset = useId()
  const idMode = useId()
  const [mode, setMode] = useState<Mode>('sequence')
  const [preset, setPreset] = useState<PresetId>('dna')
  const [custom, setCustom] = useState('ACGT')
  const [lengthStr, setLengthStr] = useState('80')
  const [countStr, setCountStr] = useState('1')
  const [uppercase, setUppercase] = useState(false)
  const [pwUpper, setPwUpper] = useState(true)
  const [pwLower, setPwLower] = useState(true)
  const [pwDigits, setPwDigits] = useState(true)
  const [pwSymbols, setPwSymbols] = useState(true)
  const [pwNoAmbiguous, setPwNoAmbiguous] = useState(false)
  const [output, setOutput] = useState('')
  const [suggestedFileName, setSuggestedFileName] = useState(() => defaultDownloadBasename('sequence'))
  const [fileNameOverride, setFileNameOverride] = useState('')

  const alphabet = useMemo(() => {
    let a = preset === 'custom' ? custom.trim() : PRESETS[preset].alphabet
    if (uppercase) a = a.toUpperCase()
    return a
  }, [preset, custom, uppercase])

  const pwOptions = useMemo(
    (): PwOptions => ({
      useUpper: pwUpper,
      useLower: pwLower,
      useDigits: pwDigits,
      useSymbols: pwSymbols,
      excludeAmbiguous: pwNoAmbiguous,
    }),
    [pwUpper, pwLower, pwDigits, pwSymbols, pwNoAmbiguous],
  )

  const switchMode = (next: Mode) => {
    if (next === mode) return
    setMode(next)
    setLengthStr(MODE_DEFAULT_LENGTH[next])
    setOutput('')
    setFileNameOverride('')
    setSuggestedFileName(defaultDownloadBasename(next))
  }

  const generate = () => {
    const length = Number.parseInt(lengthStr, 10)
    const count = Number.parseInt(countStr, 10)
    if (!Number.isFinite(length) || length < 1 || length > 500_000) {
      setOutput('长度须为 1–500000 的整数。')
      return
    }
    if (!Number.isFinite(count) || count < 1 || count > 10_000) {
      setOutput('条数须为 1–10000 的整数。')
      return
    }

    if (mode === 'sequence') {
      if (alphabet.length === 0) {
        setOutput('字符集为空，请选择预设或输入自定义字符。')
        return
      }
      try {
        const text = generateSequences(alphabet, length, count)
        setOutput(text)
        setSuggestedFileName(defaultDownloadBasename('sequence'))
      } catch {
        setOutput('生成失败，请重试。')
      }
      return
    }

    const { pools } = buildPasswordAlphabet(pwOptions)
    if (pools.length === 0) {
      setOutput('请至少选择一类字符（大写/小写/数字/符号）。')
      return
    }
    if (length < pools.length) {
      setOutput(`密码长度须 ≥ 已选字符类数量（当前至少 ${pools.length}）。`)
      return
    }
    const text = generatePasswords(length, count, pwOptions)
    if (text === '') {
      setOutput('生成失败，请检查选项。')
      return
    }
    setOutput(text)
    setSuggestedFileName(defaultDownloadBasename('password'))
  }

  const copy = async () => {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
    } catch {
      setOutput((o) => o + '\n\n(复制失败：浏览器权限)')
    }
  }

  const saveFile = () => {
    if (!output) return
    const name = fileNameOverride.trim() || suggestedFileName
    downloadTextFile(output, name)
  }

  return (
    <div className="tool-panel stack">
      <fieldset className="fieldset">
        <legend className="legend">模式</legend>
        <div className="row gap wrap" role="radiogroup" aria-labelledby={idMode}>
          <span id={idMode} className="sr-only">
            生成模式
          </span>
          <label className="field inline">
            <input
              type="radio"
              name="rs-mode"
              checked={mode === 'sequence'}
              onChange={() => switchMode('sequence')}
            />
            生物序列
          </label>
          <label className="field inline">
            <input
              type="radio"
              name="rs-mode"
              checked={mode === 'password'}
              onChange={() => switchMode('password')}
            />
            密码
          </label>
        </div>
      </fieldset>

      {mode === 'sequence' ? (
        <fieldset className="fieldset">
          <legend className="legend">字符集</legend>
          <div className="row gap wrap" role="radiogroup" aria-labelledby={idPreset}>
            <span id={idPreset} className="sr-only">
              选择预设
            </span>
            {(Object.keys(PRESETS) as Exclude<PresetId, 'custom'>[]).map((k) => (
              <label key={k} className="field inline">
                <input
                  type="radio"
                  name="rs-preset"
                  checked={preset === k}
                  onChange={() => setPreset(k)}
                />
                {PRESETS[k].label}
              </label>
            ))}
            <label className="field inline">
              <input
                type="radio"
                name="rs-preset"
                checked={preset === 'custom'}
                onChange={() => setPreset('custom')}
              />
              自定义
            </label>
          </div>
          {preset === 'custom' ? (
            <label className="field tight-top">
              <span className="field-label">自定义字符（会去重）</span>
              <input
                className="input"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                spellCheck={false}
                placeholder="例如 ACGT 或 0-9a-f"
              />
            </label>
          ) : null}
          <label className="field inline tight-top">
            <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
            强制大写
          </label>
        </fieldset>
      ) : (
        <fieldset className="fieldset">
          <legend className="legend">密码字符类</legend>
          <div className="row gap wrap">
            <label className="field inline">
              <input type="checkbox" checked={pwUpper} onChange={(e) => setPwUpper(e.target.checked)} />
              大写字母 A–Z
            </label>
            <label className="field inline">
              <input type="checkbox" checked={pwLower} onChange={(e) => setPwLower(e.target.checked)} />
              小写字母 a–z
            </label>
            <label className="field inline">
              <input type="checkbox" checked={pwDigits} onChange={(e) => setPwDigits(e.target.checked)} />
              数字 0–9
            </label>
            <label className="field inline">
              <input type="checkbox" checked={pwSymbols} onChange={(e) => setPwSymbols(e.target.checked)} />
              符号
            </label>
          </div>
          <label className="field inline tight-top">
            <input
              type="checkbox"
              checked={pwNoAmbiguous}
              onChange={(e) => setPwNoAmbiguous(e.target.checked)}
            />
            排除易混淆字符
          </label>
        </fieldset>
      )}

      <div className="row gap">
        <label className="field">
          <span className="field-label">{mode === 'password' ? '密码长度' : '每条长度'}</span>
          <input
            className="input narrow"
            value={lengthStr}
            onChange={(e) => setLengthStr(e.target.value)}
            inputMode="numeric"
          />
        </label>
        <label className="field">
          <span className="field-label">{mode === 'password' ? '生成条数' : '生成条数'}</span>
          <input
            className="input narrow"
            value={countStr}
            onChange={(e) => setCountStr(e.target.value)}
            inputMode="numeric"
          />
        </label>
      </div>

      <div className="row wrap">
        <button type="button" className="button" onClick={generate}>
          生成
        </button>
        <button type="button" className="button ghost" onClick={copy} disabled={!output}>
          复制结果
        </button>
        <button type="button" className="button ghost" onClick={saveFile} disabled={!output}>
          保存为文件
        </button>
      </div>

        <label className="field">
          <span className="field-label">保存文件名（可选）</span>
          <input
            className="input"
            value={fileNameOverride}
            onChange={(e) => setFileNameOverride(e.target.value)}
            placeholder={suggestedFileName}
            spellCheck={false}
            autoComplete="off"
          />
      </label>

      {output && (
        <label className="field">
          <span className="field-label">结果</span>
          <textarea className="textarea" readOnly value={output} rows={10} spellCheck={false} />
        </label>
      )}
    </div>
  )
}
