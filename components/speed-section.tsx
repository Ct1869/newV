export function SpeedSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-32">
      <div className="text-center">
        <p className="mb-4 text-sm text-gray-500">Designed for power users who value time</p>
        <h2 className="mb-4 text-5xl font-bold md:text-6xl">Speed Is Everything</h2>
        <p className="text-4xl font-bold text-gray-600 md:text-5xl">Reply in seconds</p>
      </div>

      <div className="mt-16 rounded-xl border border-white/10 bg-[#111111] p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold">
              A
            </div>
            <span className="text-sm font-medium">Adam</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold">
              R
            </div>
            <span className="text-sm font-medium">Ryan</span>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-xs">↩️</span>
          <span>Re: Code review feedback</span>
        </div>

        <div className="space-y-4 text-sm text-gray-300">
          <p>Hey team,</p>
          <p>
            I took a look at the code review feedback. Really like the keyboard navigation - it makes everything much
            easier to use. The search implementation is clean, though I'd love to see the link to test it out myself!
          </p>
          <p>I'll provide more detailed feedback once I can preview it, and I'll provide more detailed feedback.</p>
        </div>
      </div>
    </section>
  )
}
