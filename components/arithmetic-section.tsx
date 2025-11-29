"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArithmeticCoder } from "@/lib/arithmetic-coder"
import { Copy, Download } from "lucide-react"

export function ArithmeticSection() {
  const [input, setInput] = useState("I ' m the master ' s")
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
      const sequence = input
        .trim()
        .split(/\s+/)
        .filter((s) => s.length > 0)

      if (sequence.length === 0) {
        throw new Error("Input cannot be empty")
      }

      const { bits, symbols } = ArithmeticCoder.encode(sequence)
      const originalLength = sequence.length
      const compressedBits = bits.length
      const efficiency = ArithmeticCoder.calculateEfficiency(originalLength, compressedBits)

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
    <div className="space-y-6">
      {/* Encode */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-primary">
              <span className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
                ①
              </span>
              <span className="font-black text-lg tracking-wider">ENCODE INPUT</span>
            </CardTitle>
            <CardDescription className="text-accent/80">Enter space-separated sequence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., A B C ..."
              className="w-full h-32 p-4 bg-background/60 neon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none font-mono text-sm"
            />
            <div className="p-4 glow-primary rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-xs text-primary/70 uppercase font-bold mb-2">▸ Input Tokens</p>
              <p className="text-2xl font-black text-primary">
                {
                  input
                    .trim()
                    .split(/\s+/)
                    .filter((s) => s.length > 0).length
                }
              </p>
            </div>
            <Button
              onClick={handleEncode}
              disabled={loading || !input.trim()}
              className="w-full bg-gradient-to-r from-primary to-primary/60 hover:from-primary/80 hover:to-primary/40 text-foreground font-black h-12 text-lg uppercase tracking-wider glow-primary hover:glow-primary transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? "⟳ ENCODING..." : "⚡ ENCODE"}
            </Button>
          </CardContent>
        </Card>

        {encoded && (
          <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="flex items-center gap-3 text-primary">
                <span className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
                  📊
                </span>
                <span className="font-black text-lg tracking-wider">COMPRESSION STATS</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 glow-primary bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-xs text-primary/70 uppercase font-bold mb-2">Original</p>
                  <p className="text-xl font-black text-primary">{encoded.originalLength}</p>
                  <p className="text-xs text-primary/60">tokens</p>
                </div>
                <div className="p-3 glow-primary bg-primary/10 rounded-lg border border-primary/30">
                  <p className="text-xs text-primary/70 uppercase font-bold mb-2">Compressed</p>
                  <p className="text-xl font-black text-accent">{encoded.bits.length}</p>
                  <p className="text-xs text-primary/60">bits</p>
                </div>
              </div>
              <div className="p-3 glow-primary bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border-2 border-primary/50">
                <p className="text-xs text-primary/70 uppercase font-bold mb-2">Efficiency</p>
                <p className="text-3xl font-black text-primary">{encoded.efficiency.toFixed(2)}%</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-primary/70 uppercase font-bold">Symbols</p>
                <div className="flex flex-wrap gap-2">
                  {encoded.symbols.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 glow-primary bg-primary/20 rounded text-primary font-bold text-sm border border-primary/40"
                    >
                      {sym}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {encoded && (
        <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center justify-between text-primary">
              <span className="font-black uppercase tracking-wider">Binary Output</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(encoded.bits)}
                  className="h-8 uppercase text-xs font-bold"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadFile(
                      `ADAPTIVE ARITHMETIC CODING\n================\nINPUT: ${input}\nTOKENS: ${encoded.originalLength}\nBIT LENGTH: ${encoded.bits.length}\nEFFICIENCY: ${encoded.efficiency.toFixed(2)}%\n\nBINARY OUTPUT:\n${encoded.bits}`,
                      `arithmetic-encoded-${Date.now()}.txt`,
                    )
                  }
                  className="h-8 uppercase text-xs font-bold"
                >
                  <Download className="w-4 h-4 mr-1" />
                  DL
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-background/80 neon-border rounded-lg p-4 max-h-48 overflow-y-auto border">
              <p className="font-mono text-xs text-primary break-all whitespace-pre-wrap leading-relaxed">
                {encoded.bits}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decode */}
      {encoded && (
        <div className="space-y-4">
          <div className="h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent rounded-full" />
          <h3 className="text-2xl font-black text-primary uppercase tracking-wider">Decode Binary</h3>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
              <CardHeader className="border-b border-primary/20">
                <CardTitle className="flex items-center gap-3 text-primary">
                  <span className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
                    ②
                  </span>
                  <span className="font-black text-lg tracking-wider">BINARY INPUT</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <textarea
                  value={decodeBits}
                  onChange={(e) => setDecodeBits(e.target.value.replace(/[^01]/g, ""))}
                  placeholder="Paste encoded bits here"
                  className="w-full h-32 p-4 bg-background/60 neon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground resize-none font-mono text-sm"
                />
                <Button
                  onClick={handleDecode}
                  disabled={loading || !decodeBits.trim()}
                  className="w-full bg-gradient-to-r from-primary to-primary/60 hover:from-primary/80 hover:to-primary/40 text-foreground font-black h-12 text-lg uppercase tracking-wider glow-primary transform hover:scale-105 transition-all disabled:opacity-50"
                >
                  {loading ? "⟳ DECODING..." : "⚡ DECODE"}
                </Button>
              </CardContent>
            </Card>

            {decoded && (
              <Card className="neon-border bg-card/40 backdrop-blur-xl border-2 glow-primary">
                <CardHeader className="border-b border-primary/20">
                  <CardTitle className="flex items-center justify-between text-primary">
                    <span>Decoded Output</span>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleCopy(decoded)} className="h-8 uppercase text-xs font-bold">
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() =>
                          downloadFile(
                            `ARITHMETIC DECODED OUTPUT\n=======================\nDECODED: ${decoded}`,
                            `arithmetic-decoded-${Date.now()}.txt`,
                          )
                        }
                        className="h-8 uppercase text-xs font-bold"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        DL
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-background/80 neon-border rounded-lg p-4 border">
                    <p className="font-mono font-bold text-primary text-lg break-all">{decoded}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
