export interface PrimerAnalysis {
  length: number
  nA: number
  nT: number
  nG: number
  nC: number
  nAmbiguous: number
  gcPercent: number
  /** Wallace：2×(A+T)+4×(G+C)，仅统计明确 A/T/G/C/U */
  tmWallace: number
  /** 相对 50 mM Na⁺：Tm_wallace + 16.6×(log10[Na⁺] − log10 0.05)，[Na⁺] 为 mol/L */
  tmSaltApprox: number
}

export function analyzePrimer(seq: string, naMolar: number): PrimerAnalysis {
  const u = seq.toUpperCase().replace(/\s/g, '')
  let nA = 0
  let nT = 0
  let nG = 0
  let nC = 0
  let nAmbiguous = 0
  for (let i = 0; i < u.length; i++) {
    const c = u[i]!
    if (c === 'A') nA++
    else if (c === 'T' || c === 'U') nT++
    else if (c === 'G') nG++
    else if (c === 'C') nC++
    else nAmbiguous++
  }
  const strictLen = nA + nT + nG + nC
  const at = nA + nT
  const gc = nG + nC
  const tmWallace = 2 * at + 4 * gc
  const gcPercent = strictLen > 0 ? (100 * gc) / strictLen : 0
  const ref = 0.05
  const m = Math.max(naMolar, 1e-9)
  const tmSaltApprox = tmWallace + 16.6 * (Math.log10(m) - Math.log10(ref))

  return {
    length: u.length,
    nA,
    nT,
    nG,
    nC,
    nAmbiguous,
    gcPercent,
    tmWallace,
    tmSaltApprox,
  }
}
