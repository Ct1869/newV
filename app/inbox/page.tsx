"use client"

import { useEffect, useState } from "react"
import { InboxSidebar } from "@/components/inbox/inbox-sidebar"
import { EmailList } from "@/components/inbox/email-list"
import { EmailDetail } from "@/components/inbox/email-detail"
import { ComposeModal } from "@/components/inbox/compose-modal"
import type { GmailMessage } from "@/lib/gmail-utils"
import { useRouter } from "next/navigation"

export type EmailFolder = "inbox" | "drafts" | "sent" | "archive" | "snoozed" | "spam" | "bin"

export default function InboxPage() {
  const [messages, setMessages] = useState<GmailMessage[]>([])
  const [allMessages, setAllMessages] = useState<GmailMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [currentFolder, setCurrentFolder] = useState<EmailFolder>("inbox")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyTo, setReplyTo] = useState<
    | {
        to: string
        subject: string
        messageId: string
        threadId: string
      }
    | undefined
  >(undefined)
  const router = useRouter()

  useEffect(() => {
    async function fetchMessages() {
      try {
        console.log("[v0] Fetching messages...")
        const response = await fetch("/api/gmail/messages")

        if (response.status === 401) {
          console.log("[v0] Not authenticated, redirecting to home")
          router.push("/")
          return
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Failed to fetch messages" }))
          throw new Error(errorData.error || "Failed to fetch messages")
        }

        const data = await response.json()
        console.log("[v0] Messages fetched:", data.messages?.length || 0)
        setAllMessages(data.messages || [])
        setMessages(data.messages || [])

        // Select first message by default
        if (data.messages && data.messages.length > 0) {
          setSelectedMessage(data.messages[0])
        }
      } catch (err) {
        console.error("[v0] Error fetching messages:", err)
        setError(err instanceof Error ? err.message : "Failed to load messages")
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [router])

  useEffect(() => {
    let filtered = allMessages

    switch (currentFolder) {
      case "inbox":
        filtered = allMessages.filter((m) => m.labelIds?.includes("INBOX"))
        break
      case "drafts":
        filtered = allMessages.filter((m) => m.labelIds?.includes("DRAFT"))
        break
      case "sent":
        filtered = allMessages.filter((m) => m.labelIds?.includes("SENT"))
        break
      case "archive":
        filtered = allMessages.filter((m) => !m.labelIds?.includes("INBOX") && !m.labelIds?.includes("TRASH"))
        break
      case "spam":
        filtered = allMessages.filter((m) => m.labelIds?.includes("SPAM"))
        break
      case "bin":
        filtered = allMessages.filter((m) => m.labelIds?.includes("TRASH"))
        break
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((m) => {
        const subject = m.payload?.headers?.find((h) => h.name.toLowerCase() === "subject")?.value || ""
        const from = m.payload?.headers?.find((h) => h.name.toLowerCase() === "from")?.value || ""
        return (
          subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          from.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (m.snippet || "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      })
    }

    setMessages(filtered)
  }, [currentFolder, allMessages, searchQuery])

  const handleCompose = () => {
    setReplyTo(undefined)
    setIsComposeOpen(true)
  }

  const handleReply = () => {
    if (!selectedMessage) return

    const from = selectedMessage.payload?.headers?.find((h) => h.name.toLowerCase() === "from")?.value || ""
    const subject = selectedMessage.payload?.headers?.find((h) => h.name.toLowerCase() === "subject")?.value || ""
    const messageId = selectedMessage.payload?.headers?.find((h) => h.name.toLowerCase() === "message-id")?.value || ""

    // Extract email from "Name <email>" format
    const emailMatch = from.match(/<(.+)>/)
    const email = emailMatch ? emailMatch[1] : from

    setReplyTo({
      to: email,
      subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
      messageId: messageId,
      threadId: selectedMessage.threadId || "",
    })
    setIsComposeOpen(true)
  }

  const handleArchive = async () => {
    if (!selectedMessage) return
    try {
      await fetch(`/api/gmail/message/${selectedMessage.id}/archive`, { method: "POST" })
      // Refresh messages
      const response = await fetch("/api/gmail/messages")
      const data = await response.json()
      setAllMessages(data.messages || [])
    } catch (err) {
      console.error("[v0] Error archiving message:", err)
    }
  }

  const handleDelete = async () => {
    if (!selectedMessage) return
    try {
      await fetch(`/api/gmail/message/${selectedMessage.id}/trash`, { method: "POST" })
      // Refresh messages
      const response = await fetch("/api/gmail/messages")
      const data = await response.json()
      setAllMessages(data.messages || [])
      setSelectedMessage(null)
    } catch (err) {
      console.error("[v0] Error deleting message:", err)
    }
  }

  const handleMarkAsSpam = async () => {
    if (!selectedMessage) return
    try {
      await fetch(`/api/gmail/message/${selectedMessage.id}/spam`, { method: "POST" })
      // Refresh messages
      const response = await fetch("/api/gmail/messages")
      const data = await response.json()
      setAllMessages(data.messages || [])
    } catch (err) {
      console.error("[v0] Error marking as spam:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white mx-auto" />
          <p className="text-gray-400">Loading your inbox...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center max-w-md">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-screen bg-[#0a0a0a] text-white">
        <InboxSidebar
          onCompose={handleCompose}
          currentFolder={currentFolder}
          onFolderChange={setCurrentFolder}
          messageCounts={{
            inbox: allMessages.filter((m) => m.labelIds?.includes("INBOX")).length,
            drafts: allMessages.filter((m) => m.labelIds?.includes("DRAFT")).length,
            sent: allMessages.filter((m) => m.labelIds?.includes("SENT")).length,
            archive: allMessages.filter((m) => !m.labelIds?.includes("INBOX") && !m.labelIds?.includes("TRASH")).length,
            snoozed: 0,
            spam: allMessages.filter((m) => m.labelIds?.includes("SPAM")).length,
            bin: allMessages.filter((m) => m.labelIds?.includes("TRASH")).length,
          }}
        />
        <EmailList
          messages={messages}
          selectedMessage={selectedMessage}
          onSelectMessage={setSelectedMessage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentFolder={currentFolder}
        />
        <EmailDetail
          message={selectedMessage}
          onReply={handleReply}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onMarkAsSpam={handleMarkAsSpam}
        />
      </div>
      <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} replyTo={replyTo} />
    </>
  )
}
