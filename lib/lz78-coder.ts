function normalizeSequence(seq: string[]): string[] {
  return seq.map((s) => {
    if (typeof s === "string" && /^[a-zA-Z]$/.test(s)) {
      return s.toLowerCase()
    }
    return s
  })
}

function intToBitsFixed(x: number, width: number): string {
  if (width <= 0) return ""
  let result = ""
  for (let i = width - 1; i >= 0; i--) {
    result += (x >> i) & 1 ? "1" : "0"
  }
  return result
}

function bitsToInt(bits: string): number {
  let v = 0
  for (const b of bits) {
    v = (v << 1) | (b === "1" ? 1 : 0)
  }
  return v
}

function lz78BuildPairs(seq: string[]): { pairs: Array<[number, number]>; alphabet: string[] } {
  const sseq = normalizeSequence(seq)
  const alphabet = Array.from(new Set(sseq))
  const sym2idx: Record<string, number> = Object.fromEntries(alphabet.map((s, i) => [s, i]))

  const dictMap: Record<string, number> = {}
  let nextIndex = 1
  const pairs: Array<[number, number]> = []
  let w: string[] = []

  for (const sym of sseq) {
    const wc = [...w, sym]
    const wcKey = JSON.stringify(wc)

    if (wcKey in dictMap) {
      w = wc
    } else {
      const wKey = JSON.stringify(w)
      const idx = wKey in dictMap ? dictMap[wKey] : 0
      pairs.push([idx, sym2idx[sym]])
      dictMap[wcKey] = nextIndex
      nextIndex++
      w = []
    }
  }

  if (w.length > 0) {
    const wKey = JSON.stringify(w)
    const idx = wKey in dictMap ? dictMap[wKey] : 0
    pairs.push([idx, 0])
  }

  return { pairs, alphabet }
}

export class LZ78Coder {
  static encode(seq: string[]): { bits: string; alphabet: string[] } {
    if (seq.length === 0) {
      throw new Error("Cannot encode empty sequence")
    }

    const { pairs, alphabet } = lz78BuildPairs(seq)

    if (alphabet.length === 0) {
      throw new Error("No valid symbols found in sequence")
    }

    let maxIndex = 0
    for (const [idx] of pairs) {
      maxIndex = Math.max(maxIndex, idx)
    }
    maxIndex = Math.max(maxIndex, pairs.length)

    const idxWidth = Math.max(1, Math.ceil(Math.log2(maxIndex + 1)))
    const symWidth = Math.max(1, Math.ceil(Math.log2(Math.max(1, alphabet.length))))

    let bits = ""
    for (const [idx, symIdx] of pairs) {
      bits += intToBitsFixed(idx, idxWidth)
      bits += intToBitsFixed(symIdx, symWidth)
    }

    return { bits, alphabet }
  }

  static decode(bitstr: string, seqLen: number, alphabet: string[]): string[] {
    if (alphabet.length === 0) {
      throw new Error("Cannot decode with empty alphabet")
    }

    const symWidth = Math.max(1, Math.ceil(Math.log2(alphabet.length)))
    const maxPairs = seqLen
    const idxWidth = Math.max(1, Math.ceil(Math.log2(maxPairs + 1)))

    let pos = 0
    const decoded: string[] = []
    let nextIndex = 1
    const dictMap: Record<number, string[]> = {}

    while (decoded.length < seqLen && pos + idxWidth + symWidth <= bitstr.length) {
      const idxBits = bitstr.substring(pos, pos + idxWidth)
      pos += idxWidth
      const idx = bitsToInt(idxBits)

      const symBits = bitstr.substring(pos, pos + symWidth)
      pos += symWidth
      const symIdx = bitsToInt(symBits)

      let entry: string[] = idx === 0 ? [] : (dictMap[idx] ?? [])

      if (symIdx < alphabet.length) {
        entry = [...entry, alphabet[symIdx]]
      }

      decoded.push(...entry)
      dictMap[nextIndex] = entry
      nextIndex++
    }

    return decoded.slice(0, seqLen)
  }

  static calculateEfficiency(sequenceLength: number, compressedBits: string, alphabetLength: number): number {
    if (sequenceLength === 0 || alphabetLength === 0) return 0
    const bitsPerSymbol = Math.ceil(Math.log2(alphabetLength))
    const fixedBits = sequenceLength * bitsPerSymbol
    return compressedBits.length / fixedBits
  }
}
