"use client"

import { useState } from "react"
import Link from "next/link"
import { ArithmeticCoder } from "@/lib/arithmetic-coder"
import { Copy, Download } from "lucide-react"

export default function ArithmeticPage() {
  const [encodeInput, setEncodeInput] = useState("")
  const [encoded, setEncoded] = useState<{
    bits: string
    symbols: string[]
    efficiency: number
    originalLength: number
  } | null>(null)
  const [decodeBits, setDecodeBits] = useState("")
  const [decoded, setDecoded] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEncode = async () => {
    setLoading(true)
    try {
      const sequence = encodeInput
        .trim()
        .split(/\s+/)
        .filter((s) => s.length > 0)

      if (sequence.length === 0) {
        throw new Error("Input cannot be empty")
      }

      const { bits, symbols } = ArithmeticCoder.encode(sequence)
      const originalLength = sequence.length
      const efficiency = ArithmeticCoder.calculateEfficiency(originalLength, bits, symbols)

      setEncoded({
        bits,
        symbols,
        efficiency,
        originalLength,
      })
      setDecodeBits("")
      setDecoded(null)
    } catch (error) {
      alert("ENCODING ERROR: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDecode = async () => {
    setLoading(true)
    try {
      if (!encoded) {
        throw new Error("Please encode first to get symbols")
      }

      const decodedSequence = ArithmeticCoder.decode(decodeBits, encoded.originalLength, encoded.symbols)
      setDecoded(decodedSequence.join(" "))
    } catch (error) {
      alert("DECODING ERROR: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
  }

  return (
    <main className="min-h-screen bg-background scan-effect">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-widest">
            ⚡ ADAPTIVE ARITHMETIC CODING ⚡
          </h1>
          <Link href="/lz78">
            <button className="px-6 py-3 bg-accent hover:bg-accent/80 text-background font-black rounded-lg uppercase tracking-wider transform hover:scale-105 transition-all glow-accent">
              SWITCH TO LZ78
            </button>
          </Link>
        </div>

        {/* Navigation Back */}
        <div className="mb-6">
          <Link href="/">
            <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold rounded uppercase text-sm border border-primary/40">
              ← Back to Menu
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Encode */}
          <div className="neon-border bg-card/40 backdrop-blur-xl border-2 p-6 rounded-lg">
            <h2 className="text-2xl font-black text-primary uppercase tracking-wider mb-4">① ENCODE INPUT</h2>

            <div className="mb-4">
              <label className="block text-primary text-sm font-bold mb-2">SEQUENCE (space-separated):</label>
              <textarea
                value={encodeInput}
                onChange={(e) => setEncodeInput(e.target.value)}
                placeholder="e.g., A B C ..."
                className="w-full h-32 p-4 bg-background/60 neon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none font-mono text-sm"
              />
            </div>

            <div className="p-3 glow-primary rounded-lg bg-primary/10 border border-primary/30 mb-4">
              <p className="text-xs text-primary/70 uppercase font-bold mb-1">Tokens:</p>
              <p className="text-2xl font-black text-primary">
                {
                  encodeInput
                    .trim()
                    .split(/\s+/)
                    .filter((s) => s.length > 0).length
                }
              </p>
            </div>

            <button
              onClick={handleEncode}
              disabled={loading || !encodeInput.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary/60 hover:from-primary/80 hover:to-primary/40 text-foreground font-black h-12 text-lg uppercase tracking-wider glow-primary hover:glow-primary transform hover:scale-105 transition-all disabled:opacity-50 rounded-lg"
            >
              {loading ? "⟳ ENCODING..." : "⚡ ENCODE"}
            </button>

            {encoded && (
              <div className="mt-6 space-y-4">
                <div className="p-4 glow-primary bg-primary/10 rounded-lg border-2 border-primary/50">
                  <p className="text-xs text-primary/70 uppercase font-bold mb-2">Efficiency</p>
                  <p className="text-3xl font-black text-primary">{(encoded.efficiency * 100).toFixed(2)}%</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-primary/10 rounded border border-primary/30">
                    <p className="text-xs text-primary/70 uppercase font-bold">Original</p>
                    <p className="text-lg font-black text-primary">{encoded.originalLength}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded border border-primary/30">
                    <p className="text-xs text-primary/70 uppercase font-bold">Compressed</p>
                    <p className="text-lg font-black text-accent">{encoded.bits.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {encoded && (
            <div className="neon-border bg-card/40 backdrop-blur-xl border-2 p-6 rounded-lg">
              <h2 className="text-2xl font-black text-primary uppercase tracking-wider mb-4">📊 BINARY OUTPUT</h2>
              <div className="bg-background/80 neon-border rounded-lg p-4 max-h-48 overflow-y-auto border mb-4">
                <p className="font-mono text-xs text-primary break-all whitespace-pre-wrap leading-relaxed">
                  {encoded.bits}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(encoded.bits)}
                  className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold rounded uppercase text-sm border border-primary/40 flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() =>
                    downloadFile(
                      `ADAPTIVE ARITHMETIC CODING\n================\nINPUT: ${encodeInput}\nTOKENS: ${encoded.originalLength}\nBIT LENGTH: ${encoded.bits.length}\nEFFICIENCY: ${(encoded.efficiency * 100).toFixed(2)}%\n\nBINARY OUTPUT:\n${encoded.bits}`,
                      `arithmetic-encoded-${Date.now()}.txt`,
                    )
                  }
                  className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold rounded uppercase text-sm border border-primary/40 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

        {encoded && (
          <div className="mt-8 space-y-4">
            <div className="h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
            <h3 className="text-2xl font-black text-primary uppercase tracking-wider">② DECODE BINARY</h3>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="neon-border bg-card/40 backdrop-blur-xl border-2 p-6 rounded-lg">
                <label className="block text-primary text-sm font-bold mb-2">PASTE BINARY:</label>
                <textarea
                  value={decodeBits}
                  onChange={(e) => setDecodeBits(e.target.value.replace(/[^01]/g, ""))}
                  placeholder="Paste encoded bits here"
                  className="w-full h-32 p-4 bg-background/60 neon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none font-mono text-sm mb-4"
                />
                <button
                  onClick={handleDecode}
                  disabled={loading || !decodeBits.trim()}
                  className="w-full bg-gradient-to-r from-primary to-primary/60 hover:from-primary/80 hover:to-primary/40 text-foreground font-black h-12 text-lg uppercase tracking-wider glow-primary transform hover:scale-105 transition-all disabled:opacity-50 rounded-lg"
                >
                  {loading ? "⟳ DECODING..." : "⚡ DECODE"}
                </button>
              </div>

              {decoded && (
                <div className="neon-border bg-card/40 backdrop-blur-xl border-2 p-6 rounded-lg glow-primary">
                  <h3 className="text-primary font-black uppercase tracking-wider mb-4">DECODED OUTPUT</h3>
                  <div className="bg-background/80 neon-border rounded-lg p-4 border mb-4 max-h-32 overflow-y-auto">
                    <p className="font-mono font-bold text-primary text-sm break-all whitespace-pre-wrap">{decoded}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(decoded)}
                      className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold rounded uppercase text-sm border border-primary/40 flex items-center justify-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button
                      onClick={() =>
                        downloadFile(
                          `ARITHMETIC DECODED OUTPUT\n=======================\nDECODED: ${decoded}`,
                          `arithmetic-decoded-${Date.now()}.txt`,
                        )
                      }
                      className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary font-bold rounded uppercase text-sm border border-primary/40 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
