import { countBases } from './dna'
import { detectFastx, parseFasta, parseFastq } from './fastx'

function gcOfSeq(seq: string): number {
  const u = seq.toUpperCase()
  let gc = 0
  let acgt = 0
  for (let i = 0; i < u.length; i++) {
    const c = u[i]!
    if (c === 'G' || c === 'C') {
      gc++
      acgt++
    } else if (c === 'A' || c === 'T' || c === 'U') {
      acgt++
    }
  }
  return acgt > 0 ? (100 * gc) / acgt : 0
}

function qualStats(qual: string, offset: number): { mean: number; min: number; max: number } {
  if (qual.length === 0) return { mean: 0, min: 0, max: 0 }
  let s = 0
  let min = 99
  let max = 0
  for (let i = 0; i < qual.length; i++) {
    const q = qual.charCodeAt(i) - offset
    s += q
    if (q < min) min = q
    if (q > max) max = q
  }
  return { mean: s / qual.length, min, max }
}

export function buildSequenceStatsReport(text: string, qualOffset: number): string {
  const t = text.trim()
  if (!t) return '请输入内容。'

  const kind = detectFastx(t)

  if (kind === 'fasta') {
    const recs = parseFasta(t)
    if (recs.length === 0) return '未解析到 FASTA 记录（需以 > 开头）。'
    const lines: string[] = [`格式：FASTA，共 ${recs.length} 条`]
    let totalLen = 0
    let totalGc = 0
    recs.forEach((r, idx) => {
      const L = r.seq.length
      totalLen += L
      const gc = gcOfSeq(r.seq)
      totalGc += (gc / 100) * L
      const bc = countBases(r.seq.toUpperCase())
      lines.push(`--- 条 ${idx + 1}：${r.id.slice(0, 80)}${r.id.length > 80 ? '…' : ''}`)
      lines.push(`  长度：${L}`)
      lines.push(`  GC%（ATGCU 内）：${gc.toFixed(2)}`)
      lines.push(
        `  碱基计数：A=${bc['A'] ?? 0} T=${(bc['T'] ?? 0) + (bc['U'] ?? 0)} G=${bc['G'] ?? 0} C=${bc['C'] ?? 0}`,
      )
    })
    lines.push('--- 合计')
    lines.push(`  总碱基数：${totalLen}`)
    if (totalLen > 0) lines.push(`  加权平均 GC%：${((100 * totalGc) / totalLen).toFixed(2)}`)
    return lines.join('\n')
  }

  if (kind === 'fastq') {
    const recs = parseFastq(t)
    if (recs.length === 0) return '未解析到 FASTQ 记录（需以 @ 开头且四行一条）。'
    const lines: string[] = [`格式：FASTQ，共 ${recs.length} 条`]
    let totalLen = 0
    let sumMeanQ = 0
    const lens: number[] = []
    recs.forEach((r, idx) => {
      const L = r.seq.length
      lens.push(L)
      totalLen += L
      const gc = gcOfSeq(r.seq)
      const qs =
        r.qual.length === L
          ? qualStats(r.qual, qualOffset)
          : qualStats(r.qual.slice(0, L), qualOffset)
      sumMeanQ += qs.mean
      lines.push(`--- 条 ${idx + 1}：${r.id.slice(0, 80)}${r.id.length > 80 ? '…' : ''}`)
      lines.push(`  读长：${L}，GC%（近似）：${gc.toFixed(2)}`)
      lines.push(
        `  质量（Phred+${qualOffset}）：均值 ${qs.mean.toFixed(2)}，最小 ${qs.min}，最大 ${qs.max}`,
      )
    })
    lines.push('--- 汇总')
    lines.push(`  总读段数：${recs.length}`)
    lines.push(`  总碱基数：${totalLen}`)
    lines.push(`  读长 min / max：${Math.min(...lens)} / ${Math.max(...lens)}`)
    lines.push(`  平均 Q（逐条均值再平均）：${(sumMeanQ / recs.length).toFixed(2)}`)
    return lines.join('\n')
  }

  /* 裸序列 */
  const seq = t.replace(/\s/g, '').toUpperCase()
  if (!seq) return '无有效序列。'
  const bc = countBases(seq)
  const gc = gcOfSeq(seq)
  let other = 0
  for (let i = 0; i < seq.length; i++) {
    if (!'ATGCU'.includes(seq[i]!)) other++
  }
  const lines: string[] = ['格式：裸序列（非 FASTA/FASTQ 头）']
  lines.push(`长度：${seq.length}`)
  lines.push(`GC%（ATGCU 内）：${gc.toFixed(2)}`)
  lines.push(
    `碱基计数：A=${bc['A'] ?? 0} T=${(bc['T'] ?? 0) + (bc['U'] ?? 0)} G=${bc['G'] ?? 0} C=${bc['C'] ?? 0} 非 ATGCU：${other}`,
  )
  return lines.join('\n')
}

