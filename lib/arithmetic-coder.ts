import Decimal from "decimal.js"

Decimal.set({ precision: 500 })

function binToDecimal(bits: string): Decimal {
  let x = new Decimal(0)
  let factor = new Decimal("0.5")
  for (const b of bits) {
    if (b === "1") {
      x = x.plus(factor)
    }
    factor = factor.div(2)
  }
  return x
}

function decimalToBinaryFraction(value: Decimal, low: Decimal, high: Decimal, maxBits = 2000): string {
  let bits = ""
  let tmp = new Decimal(value)
  for (let i = 0; i < maxBits; i++) {
    tmp = tmp.times(2)
    if (tmp.gte(1)) {
      bits += "1"
      tmp = tmp.minus(1)
    } else {
      bits += "0"
    }
    const cand = binToDecimal(bits)
    if (cand.gte(low) && cand.lt(high)) {
      return bits
    }
  }
  return bits
}

function normalizeSequence(seq: string[]): string[] {
  return seq.map((s) => {
    if (typeof s === "string" && /^[a-zA-Z]$/.test(s)) {
      return s.toLowerCase()
    }
    return s
  })
}

export class ArithmeticCoder {
  static encode(seq: string[]): { bits: string; symbols: string[] } {
    if (seq.length === 0) {
      throw new Error("Cannot encode empty sequence")
    }

    const sseq = normalizeSequence(seq)
    const symbols = Array.from(new Set(sseq))

    if (symbols.length === 0) {
      throw new Error("No valid symbols found in sequence")
    }

    const freq: Record<string, Decimal> = {}
    symbols.forEach((s) => {
      freq[s] = new Decimal(1)
    })

    let low = new Decimal(0)
    let high = new Decimal(1)

    for (const sym of sseq) {
      const total = Object.values(freq).reduce((a, b) => a.plus(b), new Decimal(0))
      let cumulative = new Decimal(0)
      const cdfLow: Record<string, Decimal> = {}
      const cdfHigh: Record<string, Decimal> = {}

      for (const s of symbols) {
        const p = freq[s].div(total)
        cdfLow[s] = cumulative
        cumulative = cumulative.plus(p)
        cdfHigh[s] = cumulative
      }

      const rng = high.minus(low)
      high = low.plus(rng.times(cdfHigh[sym]))
      low = low.plus(rng.times(cdfLow[sym]))

      freq[sym] = freq[sym].plus(1)
    }

    const mid = low.plus(high).div(2)
    const bits = decimalToBinaryFraction(mid, low, high, 2000)

    return { bits, symbols }
  }

  static decode(bitstr: string, seqLen: number, symbols: string[]): string[] {
    if (symbols.length === 0) {
      throw new Error("Cannot decode with empty symbol set")
    }

    const value = binToDecimal(bitstr)
    let low = new Decimal(0)
    let high = new Decimal(1)
    const freq: Record<string, Decimal> = {}

    symbols.forEach((s) => {
      freq[s] = new Decimal(1)
    })

    const decoded: string[] = []

    for (let i = 0; i < seqLen; i++) {
      const total = Object.values(freq).reduce((a, b) => a.plus(b), new Decimal(0))
      let cumulative = new Decimal(0)
      const cdfLow: Record<string, Decimal> = {}
      const cdfHigh: Record<string, Decimal> = {}

      for (const s of symbols) {
        const p = freq[s].div(total)
        cdfLow[s] = cumulative
        cumulative = cumulative.plus(p)
        cdfHigh[s] = cumulative
      }

      const rng = high.minus(low)
      if (rng.eq(0)) break

      const scaled = value.minus(low).div(rng)
      let picked: string | null = null

      for (const s of symbols) {
        if (scaled.gte(cdfLow[s]) && scaled.lt(cdfHigh[s])) {
          picked = s
          decoded.push(s)
          high = low.plus(rng.times(cdfHigh[s]))
          low = low.plus(rng.times(cdfLow[s]))
          freq[s] = freq[s].plus(1)
          break
        }
      }

      if (!picked) break
    }

    return decoded
  }

  static calculateEfficiency(sequenceLength: number, compressedBits: string, symbols: string[]): number {
    if (sequenceLength === 0 || symbols.length === 0) return 0
    const bitsPerSymbol = Math.ceil(Math.log2(symbols.length))
    const fixedBits = sequenceLength * bitsPerSymbol
    return compressedBits.length / fixedBits
  }
}
