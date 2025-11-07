export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-32 pb-16 text-center">
      <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
        AI Powered Email,
        <br />
        Built to Save You Time
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 text-balance">
        Zero is an AI-native email client that manages your inbox, so you don't have to.
      </p>
      <p className="mt-4 text-sm text-gray-500">No credit card required.</p>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
        <span>Backed by</span>
        <div className="flex items-center gap-1 rounded bg-orange-600 px-2 py-1 text-xs font-semibold text-white">
          <span className="font-bold">Y</span>
          <span>Combinator</span>
        </div>
      </div>
    </section>
  )
}
