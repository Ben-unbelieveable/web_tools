/** DNA IUPAC 互补（单链 → 配对链方向）。 */
export const DNA_COMPLEMENT: Readonly<Record<string, string>> = {
  A: 'T',
  T: 'A',
  G: 'C',
  C: 'G',
  R: 'Y',
  Y: 'R',
  S: 'S',
  W: 'W',
  K: 'M',
  M: 'K',
  B: 'V',
  V: 'B',
  D: 'H',
  H: 'D',
  N: 'N',
}

/** RNA 碱基互补（与 DNA 配对时常用）。 */
export const RNA_COMPLEMENT: Readonly<Record<string, string>> = {
  A: 'U',
  U: 'A',
  G: 'C',
  C: 'G',
  R: 'Y',
  Y: 'R',
  S: 'S',
  W: 'W',
  K: 'M',
  M: 'K',
  B: 'V',
  V: 'B',
  D: 'H',
  H: 'D',
  N: 'N',
}

export type NucleicType = 'dna' | 'rna'

export function reverseComplement(seq: string, type: NucleicType): string {
  const map = type === 'dna' ? DNA_COMPLEMENT : RNA_COMPLEMENT
  const upper = seq.toUpperCase().replace(/\s/g, '')
  const chars: string[] = []
  for (let i = 0; i < upper.length; i++) {
    const c = upper[i]!
    const co = map[c]
    if (co === undefined) chars.push(c)
    else chars.push(co)
  }
  return chars.reverse().join('')
}

/** IUPAC 字母展开为明确碱基集合（DNA，含 T） */
export const IUPAC_SETS: Readonly<Record<string, string>> = {
  A: 'A',
  C: 'C',
  G: 'G',
  T: 'T',
  U: 'U',
  R: 'AG',
  Y: 'CT',
  S: 'GC',
  W: 'AT',
  K: 'GT',
  M: 'AC',
  B: 'CGT',
  D: 'AGT',
  H: 'ACT',
  V: 'ACG',
  N: 'ACGT',
}

/** RNA（含 U，Y=CU 等） */
export const IUPAC_SETS_RNA: Readonly<Record<string, string>> = {
  A: 'A',
  C: 'C',
  G: 'G',
  U: 'U',
  R: 'AG',
  Y: 'CU',
  S: 'GC',
  W: 'AU',
  K: 'GU',
  M: 'AC',
  B: 'CGU',
  D: 'AGU',
  H: 'ACU',
  V: 'ACG',
  N: 'ACGU',
}

export function expandDegenerate(
  seq: string,
  maxOut: number,
  mode: NucleicType = 'dna',
): string[] {
  let upper = seq.toUpperCase().replace(/\s/g, '')
  if (mode === 'rna') upper = upper.replace(/T/g, 'U')
  else upper = upper.replace(/U/g, 'T')
  const table = mode === 'rna' ? IUPAC_SETS_RNA : IUPAC_SETS
  const pools: string[][] = []
  for (let i = 0; i < upper.length; i++) {
    const c = upper[i]!
    const set = table[c]
    if (!set) {
      return []
    }
    pools.push([...set])
  }
  if (pools.length === 0) return []

  const out: string[] = []
  function dfs(i: number, cur: string) {
    if (out.length >= maxOut) return
    if (i === pools.length) {
      out.push(cur)
      return
    }
    for (const b of pools[i]!) {
      dfs(i + 1, cur + b)
      if (out.length >= maxOut) return
    }
  }
  dfs(0, '')
  return out
}

export function countBases(seq: string): Record<string, number> {
  const m: Record<string, number> = {}
  const u = seq.toUpperCase()
  for (let i = 0; i < u.length; i++) {
    const c = u[i]!
    m[c] = (m[c] ?? 0) + 1
  }
  return m
}

export function gcPercent(seq: string): number {
  const u = seq.toUpperCase()
  let gc = 0
  let atu = 0
  for (let i = 0; i < u.length; i++) {
    const c = u[i]!
    if (c === 'G' || c === 'C' || c === 'S') gc++
    else if (c === 'A' || c === 'T' || c === 'U' || c === 'W') atu++
    else if ('RYSWKMBDHVN'.includes(c)) {
      /* degenerate: approximate mid */
      gc += 0.5
      atu += 0.5
    }
  }
  const tot = gc + atu
  if (tot === 0) return 0
  return (100 * gc) / tot
}
