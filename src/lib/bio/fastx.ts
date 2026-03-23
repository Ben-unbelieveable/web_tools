export type FastxKind = 'fasta' | 'fastq' | 'unknown'

export interface FastaRecord {
  id: string
  seq: string
}

export interface FastqRecord {
  id: string
  seq: string
  qual: string
}

export function parseFasta(text: string): FastaRecord[] {
  const records: FastaRecord[] = []
  let id = ''
  let buf: string[] = []
  const flush = () => {
    if (id) records.push({ id, seq: buf.join('') })
    id = ''
    buf = []
  }
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trimEnd()
    if (!line) continue
    if (line.startsWith('>')) {
      flush()
      id = line.slice(1).trim()
    } else {
      buf.push(line.trim())
    }
  }
  flush()
  return records
}

export function parseFastq(text: string): FastqRecord[] {
  const lines = text.split(/\r?\n/)
  const out: FastqRecord[] = []
  for (let i = 0; i + 3 < lines.length; i += 4) {
    const l0 = lines[i]!.trimEnd()
    const l1 = lines[i + 1] ?? ''
    const l2 = lines[i + 2] ?? ''
    const l3 = lines[i + 3] ?? ''
    if (!l0.startsWith('@')) continue
    if (l2.startsWith('+')) {
      out.push({
        id: l0.slice(1).trim(),
        seq: l1.replace(/\s/g, ''),
        qual: l3.trimEnd(),
      })
    } else {
      /* 无第三行 + 的变体 */
      out.push({
        id: l0.slice(1).trim(),
        seq: l1.replace(/\s/g, ''),
        qual: l3.trimEnd(),
      })
    }
  }
  return out
}

export function detectFastx(text: string): FastxKind {
  const t = text.trimStart()
  if (t.startsWith('>')) return 'fasta'
  if (t.startsWith('@')) return 'fastq'
  return 'unknown'
}
