"use client"

import { useState, useEffect } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  replyTo?: {
    to: string
    subject: string
    messageId: string
    threadId: string
  }
}

export function ComposeModal({ isOpen, onClose, replyTo }: ComposeModalProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTo(replyTo?.to || "")
      setSubject(replyTo?.subject || "")
      setBody("")
    }
  }, [isOpen, replyTo])

  if (!isOpen) return null

  const handleSend = async () => {
    if (!to || !subject || !body) {
      alert("Please fill in all fields")
      return
    }

    setSending(true)
    try {
      const response = await fetch("/api/gmail/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          body,
          replyTo: replyTo?.messageId,
          threadId: replyTo?.threadId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      alert("Email sent successfully!")
      onClose()
      setTo("")
      setSubject("")
      setBody("")
    } catch (error) {
      console.error("[v0] Error sending email:", error)
      alert("Failed to send email. Please try again.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#0a0a0a] shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h2 className="text-lg font-semibold">{replyTo ? "Reply" : "New Message"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">To</label>
            <Input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="bg-white/5 border-white/10 text-white"
              disabled={!!replyTo}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">Subject</label>
            <Input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="bg-white/5 border-white/10 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-400">Message</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={12}
              className="bg-white/5 border-white/10 text-white resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-white/10 p-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/10 text-white hover:bg-white/5 bg-transparent"
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending} className="gap-2 bg-white text-black hover:bg-gray-200">
            <Send className="h-4 w-4" />
            {sending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  )
}
