"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Send } from "lucide-react"

interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  replyTo?: any
}

export function ComposeModal({ isOpen, onClose, replyTo }: ComposeModalProps) {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (isOpen && replyTo) {
      const fromHeader = replyTo.headers?.find((h: any) => h.name === "From")?.value || ""
      const subjectHeader = replyTo.headers?.find((h: any) => h.name === "Subject")?.value || ""

      const emailMatch = fromHeader.match(/<(.+)>/)
      setTo(emailMatch ? emailMatch[1] : fromHeader)
      setSubject(subjectHeader.startsWith("Re: ") ? subjectHeader : `Re: ${subjectHeader}`)
    } else if (isOpen && !replyTo) {
      setTo("")
      setSubject("")
      setBody("")
    }
  }, [isOpen, replyTo])

  const handleSend = async () => {
    if (!to || !subject) return

    setIsSending(true)
    try {
      const response = await fetch("/api/gmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, body }),
      })

      if (response.ok) {
        onClose()
        setTo("")
        setSubject("")
        setBody("")
      }
    } catch (error) {
      console.error("[v0] Error sending email:", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-zinc-900 text-white border-zinc-800">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{replyTo ? "Reply" : "New email"}</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-zinc-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div>
            <Input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-zinc-950 border-zinc-800 text-white"
            />
          </div>

          <div>
            <Textarea
              placeholder="Write your message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="bg-zinc-950 border-zinc-800 text-white resize-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || !to || !subject}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
