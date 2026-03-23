/** Phred：Q = -10 * log10(p)，p 为错误率 */
export function qToErrorProb(q: number): number {
  return 10 ** (-q / 10)
}

export function errorProbToQ(p: number): number {
  if (p <= 0) return 99
  if (p >= 1) return 0
  return -10 * Math.log10(p)
}

export function asciiToQ(ch: string, offset: 33 | 64): number | null {
  if (ch.length !== 1) return null
  const code = ch.charCodeAt(0)
  const q = code - offset
  if (q < 0 || q > 93) return null
  return q
}

export function qToAscii(q: number, offset: 33 | 64): string {
  const c = Math.round(q) + offset
  if (c < 33 || c > 126) return '?'
  return String.fromCharCode(c)
}
