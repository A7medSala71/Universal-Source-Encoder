"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArithmeticCoder } from "@/lib/arithmetic-coder"
import { LZ78Coder } from "@/lib/lz78-coder"
import { Copy, Zap } from "lucide-react"

export function CompressionDecoder() {
  const [bitstring, setBitstring] = useState("11001010110011")
  const [symbols, setSymbols] = useState("A,B,C")
  const [seqLen, setSeqLen] = useState("5")
  const [method, setMethod] = useState<"arithmetic" | "lz78">("arithmetic")
  const [output, setOutput] = useState<string[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleDecode = async () => {
    setLoading(true)
    try {
      const symList = symbols
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      const sequenceLength = Number.parseInt(seqLen) || 0

      if (symList.length === 0) {
        alert("ERROR: Enter at least one symbol")
        setLoading(false)
        return
      }

      let decoded: string[]

      if (method === "arithmetic") {
        decoded = ArithmeticCoder.decode(bitstring, sequenceLength, symList)
      } else {
        decoded = LZ78Coder.decode(bitstring, sequenceLength, symList)
      }

      setOutput(decoded)
    } catch (error) {
      console.error("Decoding error:", error)
      alert("ERROR: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Binary Input */}
        <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-primary">
              <span className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
                ①
              </span>
              <span className="font-black text-lg tracking-wider">BINARY INPUT</span>
            </CardTitle>
            <CardDescription className="text-accent/80">Enter binary string to decode</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <textarea
              value={bitstring}
              onChange={(e) => setBitstring(e.target.value.replace(/[^01]/g, ""))}
              placeholder="e.g., 11001010110011"
              className="w-full h-24 p-4 bg-background/60 neon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder-muted-foreground resize-none font-mono text-sm"
            />
            <div className="p-4 glow-accent rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-xs text-accent/70 uppercase font-bold mb-2">▸ Bit Length</p>
              <p className="text-2xl font-black text-accent">{bitstring.length} BITS</p>
            </div>
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-primary">
              <span className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
                ②
              </span>
              <span className="font-black text-lg tracking-wider">CONFIGURATION</span>
            </CardTitle>
            <CardDescription className="text-accent/80">Set method and parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-primary uppercase">Method</label>
              <Tabs value={method} onValueChange={(v) => setMethod(v as "arithmetic" | "lz78")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-background/60 border border-primary/30 gap-1 p-1">
                  <TabsTrigger
                    value="arithmetic"
                    className="data-[state=active]:bg-primary data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/50 font-bold uppercase text-xs"
                  >
                    Arithmetic
                  </TabsTrigger>
                  <TabsTrigger
                    value="lz78"
                    className="data-[state=active]:bg-accent data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-accent/50 font-bold uppercase text-xs"
                  >
                    LZ78
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-primary uppercase">Symbols (comma-separated)</label>
              <input
                type="text"
                value={symbols}
                onChange={(e) => setSymbols(e.target.value)}
                placeholder="e.g., A,B,C"
                className="w-full px-4 py-2 bg-background/60 neon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder-muted-foreground font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-primary uppercase">Sequence Length</label>
              <input
                type="number"
                value={seqLen}
                onChange={(e) => setSeqLen(e.target.value)}
                placeholder="e.g., 5"
                className="w-full px-4 py-2 bg-background/60 neon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder-muted-foreground font-mono"
              />
            </div>

            <Button
              onClick={handleDecode}
              disabled={loading || !bitstring.trim()}
              className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/80 hover:to-primary/80 text-foreground font-black h-12 text-lg uppercase tracking-wider glow-accent hover:glow-accent transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? "⟳ DECODING..." : "⚡ DECODE"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Output */}
      {output && (
        <Card className="glow-primary bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl animate-fade-in border-2 border-primary/50">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center justify-between text-primary">
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span className="font-black uppercase tracking-wider">Decoded Output</span>
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(output.join(" "))}
                className="h-8 uppercase text-xs font-bold"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-background/80 neon-border rounded-lg p-4 border">
              <p className="font-mono text-lg text-accent font-bold">{output.join(" ")}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {output.map((sym, idx) => (
                <div key={idx} className="p-3 glow-accent bg-accent/20 rounded-lg text-center border border-accent/40">
                  <p className="text-xs text-accent/60 uppercase font-bold mb-1">Idx {idx}</p>
                  <p className="font-black text-accent text-lg">{sym}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
