"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[v0] Application error:", error)
  }, [error])

  return (
    <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
      <div className="text-center max-w-md space-y-4">
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-gray-400">{error.message || "An unexpected error occurred"}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()} className="bg-white text-black hover:bg-gray-200">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5 bg-transparent"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  )
}
