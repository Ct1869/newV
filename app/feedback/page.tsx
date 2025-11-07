"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"

export default function FeedbackPage() {
  const router = useRouter()
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Send feedback to backend
    setSubmitted(true)
    setTimeout(() => {
      router.push("/inbox")
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <Button
            onClick={() => router.push("/inbox")}
            variant="ghost"
            className="mb-8 gap-2 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inbox
          </Button>

          <h1 className="text-3xl font-bold mb-2">Send us your feedback</h1>
          <p className="text-gray-400 mb-8">
            We'd love to hear your thoughts on how we can improve your email experience
          </p>

          {submitted ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-8 text-center">
              <p className="text-green-400 text-lg font-medium">Thank you for your feedback!</p>
              <p className="text-gray-400 mt-2">Redirecting you back to inbox...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you think..."
                  rows={8}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <Button type="submit" className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
                <Send className="h-4 w-4" />
                Send Feedback
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
