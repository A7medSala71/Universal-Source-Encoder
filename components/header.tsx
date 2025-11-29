export function Header() {
  return (
    <header className="border-b-2 border-primary/30 backdrop-blur-xl bg-gradient-to-b from-background via-background to-card/50 scan-effect">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center glow-primary animate-glow-pulse">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
            CODEC TERMINAL
          </h1>
        </div>
        <p className="text-accent text-sm md:text-base font-semibold tracking-wider">
          ➤ COMPRESSION ALGORITHM PROCESSOR ➤ ENCODING/DECODING ENGINE
        </p>
      </div>
    </header>
  )
}
