"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArithmeticCoder } from "@/lib/arithmetic-coder"
import { LZ78Coder } from "@/lib/lz78-coder"
import { Copy, Download, Zap } from "lucide-react"

export function CompressionEncoder() {
  const [input, setInput] = useState("ABBCA")
  const [method, setMethod] = useState<"arithmetic" | "lz78">("arithmetic")
  const [output, setOutput] = useState<{
    bits: string
    symbols: string[]
    efficiency: number
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEncode = async () => {
    setLoading(true)
    try {
      const sequence = input.includes(" ") ? input.split(/\s+/).filter((s) => s.length > 0) : input.split("")

      if (sequence.length === 0) {
        throw new Error("Input cannot be empty")
      }

      let bits: string
      let symbols: string[]

      if (method === "arithmetic") {
        const { bits: encodedBits, symbols: syms } = ArithmeticCoder.encode(sequence)
        bits = encodedBits
        symbols = syms
      } else {
        const { bits: encodedBits, alphabet: alph } = LZ78Coder.encode(sequence)
        bits = encodedBits
        symbols = alph
      }

      const originalBits = sequence.length * 8
      const compressedBits = bits.length
      const efficiency = ((1 - compressedBits / originalBits) * 100).toFixed(2)

      setOutput({
        bits,
        symbols,
        efficiency: Number.parseFloat(efficiency),
      })
    } catch (error) {
      console.error("Encoding error:", error)
      alert("ERROR: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleDownload = () => {
    if (!output) return
    const content = `INPUT: ${input}\nMETHOD: ${method.toUpperCase()}\nBITS: ${output.bits}\nEFFICIENCY: ${output.efficiency}%`
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `compression-${Date.now()}.txt`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-primary">
              <span className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold">
                ①
              </span>
              <span className="font-black text-lg tracking-wider">INPUT SEQUENCE</span>
            </CardTitle>
            <CardDescription className="text-accent/80">Enter symbols to compress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., ABBCA or A B C A B"
              className="w-full h-32 p-4 bg-background/60 neon-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground placeholder-muted-foreground resize-none font-mono text-sm"
            />

            <div className="p-4 glow-accent rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-xs text-accent/70 uppercase font-bold mb-2">▸ Input Size</p>
              <p className="text-2xl font-black text-accent">{input.length} CHARS</p>
            </div>
          </CardContent>
        </Card>

        {/* Method Selection */}
        <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
          <CardHeader className="border-b border-primary/20">
            <CardTitle className="flex items-center gap-3 text-primary">
              <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold">
                ②
              </span>
              <span className="font-black text-lg tracking-wider">ALGORITHM</span>
            </CardTitle>
            <CardDescription className="text-accent/80">Select compression method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
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

            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-xs text-primary/70 uppercase font-bold mb-2">▸ Description</p>
              <p className="text-sm text-foreground font-semibold">
                {method === "arithmetic"
                  ? "Adaptive Arithmetic Coding with dynamic frequency adjustment"
                  : "LZ78 Dictionary-based compression with variable-length encoding"}
              </p>
            </div>

            <Button
              onClick={handleEncode}
              disabled={loading || !input.trim()}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-foreground font-black h-12 text-lg uppercase tracking-wider glow-primary hover:glow-primary transform hover:scale-105 transition-all disabled:opacity-50"
            >
              {loading ? "⟳ ENCODING..." : "⚡ ENCODE"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Output Section */}
      {output && (
        <div className="space-y-4 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Original Size</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-primary">{input.length * 8}</p>
                <p className="text-xs text-accent mt-1">BITS</p>
              </CardContent>
            </Card>
            <Card className="neon-accent-border bg-card/40 backdrop-blur-xl border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Compressed Size</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-accent">{output.bits.length}</p>
                <p className="text-xs text-primary mt-1">BITS</p>
              </CardContent>
            </Card>
            <Card className="glow-primary bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border-2 border-primary/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs uppercase text-muted-foreground font-bold">Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-black text-accent">{output.efficiency}%</p>
                <p className="text-xs text-primary mt-1">REDUCTION</p>
              </CardContent>
            </Card>
          </div>

          {/* Binary Output */}
          <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="flex items-center justify-between text-primary">
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-black uppercase tracking-wider">Binary Output</span>
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(output.bits)}
                    className="h-8 uppercase text-xs font-bold"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownload}
                    className="h-8 uppercase text-xs font-bold bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    DL
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-background/80 neon-border rounded-lg p-4 max-h-48 overflow-y-auto border">
                <p className="font-mono text-sm text-accent break-all whitespace-pre-wrap leading-relaxed">
                  {output.bits}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Symbol Dictionary */}
          <Card className="neon-border bg-card/40 backdrop-blur-xl border-2">
            <CardHeader className="border-b border-primary/20">
              <CardTitle className="text-primary font-black uppercase tracking-wider">Symbol Dictionary</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-3">
                {output.symbols.map((sym, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 glow-accent bg-accent/20 rounded-lg text-accent-foreground font-bold uppercase border border-accent/40"
                  >
                    {sym || "(space)"}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
