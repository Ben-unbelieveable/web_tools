import type { NucleicType } from './dna'

/** NCBI 遗传密码表 1（标准），DNA 字母表（T）。 */
const CODON_TO_AA: Readonly<Record<string, string>> = {
  TTT: 'F',
  TTC: 'F',
  TTA: 'L',
  TTG: 'L',
  TCT: 'S',
  TCC: 'S',
  TCA: 'S',
  TCG: 'S',
  TAT: 'Y',
  TAC: 'Y',
  TAA: '*',
  TAG: '*',
  TGT: 'C',
  TGC: 'C',
  TGA: '*',
  TGG: 'W',
  CTT: 'L',
  CTC: 'L',
  CTA: 'L',
  CTG: 'L',
  CCT: 'P',
  CCC: 'P',
  CCA: 'P',
  CCG: 'P',
  CAT: 'H',
  CAC: 'H',
  CAA: 'Q',
  CAG: 'Q',
  CGT: 'R',
  CGC: 'R',
  CGA: 'R',
  CGG: 'R',
  ATT: 'I',
  ATC: 'I',
  ATA: 'I',
  ATG: 'M',
  ACT: 'T',
  ACC: 'T',
  ACA: 'T',
  ACG: 'T',
  AAT: 'N',
  AAC: 'N',
  AAA: 'K',
  AAG: 'K',
  AGT: 'S',
  AGC: 'S',
  AGA: 'R',
  AGG: 'R',
  GTT: 'V',
  GTC: 'V',
  GTA: 'V',
  GTG: 'V',
  GCT: 'A',
  GCC: 'A',
  GCA: 'A',
  GCG: 'A',
  GAT: 'D',
  GAC: 'D',
  GAA: 'E',
  GAG: 'E',
  GGT: 'G',
  GGC: 'G',
  GGA: 'G',
  GGG: 'G',
}

const AA_TO_CODONS: Readonly<Record<string, readonly string[]>> = (() => {
  const map = new Map<string, string[]>()
  for (const [codon, aa] of Object.entries(CODON_TO_AA)) {
    const list = map.get(aa) ?? []
    list.push(codon)
    map.set(aa, list)
  }
  for (const list of map.values()) list.sort()
  return Object.fromEntries(map) as Record<string, readonly string[]>
})()

/** 人源基因中较常用的同义密码子（用于反向翻译）。 */
const HUMAN_PREFERRED_CODON: Readonly<Record<string, string>> = {
  A: 'GCC',
  R: 'CGG',
  N: 'AAC',
  D: 'GAC',
  C: 'TGC',
  Q: 'CAG',
  E: 'GAG',
  G: 'GGC',
  H: 'CAC',
  I: 'ATC',
  L: 'CTG',
  K: 'AAG',
  M: 'ATG',
  F: 'TTC',
  P: 'CCC',
  S: 'AGC',
  T: 'ACC',
  W: 'TGG',
  Y: 'TAC',
  V: 'GTG',
  '*': 'TGA',
}

const BASE_TO_IUPAC: Readonly<Record<string, string>> = {
  A: 'A',
  C: 'C',
  G: 'G',
  T: 'T',
  AC: 'M',
  AG: 'R',
  AT: 'W',
  CG: 'S',
  CT: 'Y',
  GT: 'K',
  ACG: 'V',
  ACT: 'H',
  AGT: 'D',
  CGT: 'B',
  ACGT: 'N',
}

const VALID_AA = new Set('ACDEFGHIKLMNPQRSTVWY*XBZJUO')
const NT_LETTERS = /^[ACGTU]+$/i

export type TranslateDirection = 'nt-to-aa' | 'aa-to-nt'
export type BackTranslateStrategy = 'human' | 'degenerate'

export interface TranslateOptions {
  direction: TranslateDirection
  nucleicType: NucleicType
  /** 翻译读框，0–2（仅 nt→aa） */
  frame: 0 | 1 | 2
  backStrategy: BackTranslateStrategy
}

export interface TranslateSuccess {
  ok: true
  output: string
  /** 附加说明（如忽略碱基数、兼并提示） */
  notes: string[]
}

export interface TranslateFailure {
  ok: false
  message: string
}

export type TranslateResult = TranslateSuccess | TranslateFailure

/** 去除 FASTA 头、空白与常见分隔符，保留序列主体。 */
export function normalizeSequenceInput(raw: string): string {
  const lines = raw.split(/\r?\n/)
  const parts: string[] = []
  for (const line of lines) {
    const t = line.trim()
    if (!t || t.startsWith('>') || t.startsWith(';')) continue
    parts.push(t.replace(/[\s\d\-./\\,;]+/g, ''))
  }
  return parts.join('')
}

function normalizeNucleotide(seq: string, type: NucleicType): string {
  let s = seq.toUpperCase()
  if (type === 'rna') s = s.replace(/T/g, 'U')
  else s = s.replace(/U/g, 'T')
  return s
}

function outputNucleotide(dnaCodon: string, type: NucleicType): string {
  return type === 'rna' ? dnaCodon.replace(/T/g, 'U') : dnaCodon
}

function degenerateCodon(codons: readonly string[]): string {
  const cols: Set<string>[] = [new Set(), new Set(), new Set()]
  for (const c of codons) {
    if (c.length !== 3) continue
    for (let i = 0; i < 3; i++) cols[i]!.add(c[i]!)
  }
  let out = ''
  for (const set of cols) {
    const sorted = [...set].sort().join('')
    const letter = BASE_TO_IUPAC[sorted]
    if (!letter) return 'NNN'
    out += letter
  }
  return out
}

function translateNucleotideToAa(seq: string, frame: 0 | 1 | 2): TranslateSuccess | TranslateFailure {
  const trimmed = seq.slice(frame)
  const remainder = trimmed.length % 3
  const notes: string[] = []
  if (frame > 0) notes.push(`读框偏移 ${frame}，已跳过前 ${frame} 个碱基。`)
  if (remainder > 0) {
    notes.push(`末尾 ${remainder} 个碱基不足三联体，已忽略。`)
  }

  const codonCount = Math.floor(trimmed.length / 3)
  const aa: string[] = []
  for (let i = 0; i < codonCount; i++) {
    const codon = trimmed.slice(i * 3, i * 3 + 3)
    const letter = CODON_TO_AA[codon]
    if (letter === undefined) {
      return { ok: false, message: `无法识别密码子「${codon}」（位置约 ${frame + i * 3 + 1}–${frame + i * 3 + 3}）。` }
    }
    aa.push(letter)
  }

  if (aa.length === 0) {
    return { ok: false, message: '序列过短或读框内无完整密码子。' }
  }

  return {
    ok: true,
    output: aa.join(''),
    notes,
  }
}

function backTranslateAaToNt(
  protein: string,
  strategy: BackTranslateStrategy,
  type: NucleicType,
): TranslateSuccess | TranslateFailure {
  const codons: string[] = []
  const notes: string[] = []

  for (let i = 0; i < protein.length; i++) {
    const aa = protein[i]!
    if (aa === 'U') {
      notes.push('U（硒代半胱氨酸）按终止密码子 TGA 处理；真核硒蛋白需 SECIS 元件，此处仅作占位。')
      codons.push(outputNucleotide('TGA', type))
      continue
    }
    if (aa === 'O') {
      return { ok: false, message: 'O（吡咯赖氨酸）需特殊密码子 UAG（含 PylRS），本工具未编码。' }
    }
    if (aa === 'B' || aa === 'Z' || aa === 'J' || aa === 'X') {
      const degenerate: Record<string, string> = {
        B: 'RAY',
        Z: 'SAR',
        J: 'YTR',
        X: 'NNN',
      }
      codons.push(outputNucleotide(degenerate[aa]!, type))
      notes.push(`${aa} 为兼并氨基酸字母，已使用兼并密码子 ${degenerate[aa]}。`)
      continue
    }

    const options = AA_TO_CODONS[aa]
    if (!options) {
      return { ok: false, message: `非法氨基酸字母「${aa}」（位置 ${i + 1}）。` }
    }

    let codon: string
    if (strategy === 'human') {
      codon = HUMAN_PREFERRED_CODON[aa] ?? options[0]!
    } else {
      codon = degenerateCodon(options)
      if (codon.includes('N') && options.length > 1) {
        notes.push(`${aa} 使用兼并密码子 ${codon}。`)
      }
    }
    codons.push(outputNucleotide(codon, type))
  }

  return {
    ok: true,
    output: codons.join(''),
    notes: [...new Set(notes)],
  }
}

export function translateSequence(raw: string, options: TranslateOptions): TranslateResult {
  const body = normalizeSequenceInput(raw)
  if (!body) {
    return { ok: false, message: '请输入序列（可含 FASTA 头，将自动忽略）。' }
  }

  if (options.direction === 'nt-to-aa') {
    const nt = normalizeNucleotide(body, options.nucleicType)
    if (!NT_LETTERS.test(nt)) {
      return { ok: false, message: '核苷酸序列仅允许 A/C/G/T/U（不含兼并碱基）。' }
    }
    return translateNucleotideToAa(nt, options.frame)
  }

  const protein = body.toUpperCase()
  for (let i = 0; i < protein.length; i++) {
    const c = protein[i]!
    if (!VALID_AA.has(c)) {
      return { ok: false, message: `非法字符「${c}」（位置 ${i + 1}）。` }
    }
  }
  return backTranslateAaToNt(protein, options.backStrategy, options.nucleicType)
}
