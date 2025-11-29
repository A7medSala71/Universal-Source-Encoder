"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { ArrowRight, Zap } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background scan-effect flex flex-col">
      <Header />

      <div className="flex-1 container mx-auto px-4 py-12 md:py-20 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-primary uppercase tracking-widest mb-4">
              Compression Studio
            </h1>
            <p className="text-lg md:text-xl text-accent/80 uppercase tracking-wider">
              Select Your Compression Algorithm
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Adaptive Arithmetic Card */}
            <Link href="/arithmetic">
              <div className="neon-border bg-card/40 backdrop-blur-xl border-2 p-8 rounded-xl cursor-pointer transform hover:scale-105 transition-all hover:glow-primary group h-full">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center glow-primary font-black text-3xl mb-6 group-hover:scale-110 transition-transform">
                      A
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-primary uppercase tracking-wider mb-4">
                      Adaptive Arithmetic
                    </h2>
                    <p className="text-primary/70 text-sm md:text-base leading-relaxed mb-6">
                      Dynamic frequency-based entropy encoding with adaptive probability models for optimal compression.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-black uppercase text-sm group-hover:translate-x-2 transition-transform">
                    <span>Enter</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>

            {/* LZ78 Card */}
            <Link href="/lz78">
              <div className="neon-accent-border bg-card/40 backdrop-blur-xl border-2 p-8 rounded-xl cursor-pointer transform hover:scale-105 transition-all hover:glow-accent group h-full">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center glow-accent font-black text-3xl mb-6 group-hover:scale-110 transition-transform">
                      L
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-accent uppercase tracking-wider mb-4">
                      Lempel-Ziv 78
                    </h2>
                    <p className="text-accent/70 text-sm md:text-base leading-relaxed mb-6">
                      Dictionary-based variable-length compression that adapts to repeated patterns in your data.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-accent font-black uppercase text-sm group-hover:translate-x-2 transition-transform">
                    <span>Enter</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-12 md:mt-16 text-center">
            <div className="inline-block p-4 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-xs md:text-sm text-primary/70 uppercase font-bold tracking-wider">
                <Zap className="inline w-4 h-4 mr-2" />
                Both algorithms work entirely client-side for instant results
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
