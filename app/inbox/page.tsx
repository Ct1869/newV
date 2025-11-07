"use client"

import { useEffect, useState, useCallback } from "react"
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
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [loadingMore, setLoadingMore] = useState(false)
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
  const currentAccountEmail = "" // Declare currentAccountEmail variable

  const fetchMessages = useCallback(
    async (pageToken?: string) => {
      try {
        console.log(
          "[v0] Fetching unified messages from all accounts...",
          pageToken ? `(page token: ${pageToken})` : "(initial load)",
        )
        const url = pageToken ? `/api/gmail/messages?pageToken=${pageToken}` : "/api/gmail/messages"
        const response = await fetch(url)

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
        console.log("[v0] Unified messages fetched:", data.messages?.length || 0)

        if (pageToken) {
          setAllMessages((prev) => [...prev, ...(data.messages || [])])
        } else {
          setAllMessages(data.messages || [])
          if (data.messages && data.messages.length > 0) {
            setSelectedMessage(data.messages[0])
          }
        }

        setNextPageToken(data.nextPageToken || null)
      } catch (err) {
        console.error("[v0] Error fetching messages:", err)
        setError(err instanceof Error ? err.message : "Failed to load messages")
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  useEffect(() => {
    async function initialFetch() {
      try {
        console.log("[v0] Starting initial unified fetch")
        setLoading(true)
        await fetchMessages()
      } catch (err) {
        console.error("[v0] Error in initial fetch:", err)
        setError(err instanceof Error ? err.message : "Failed to initialize inbox")
      } finally {
        setLoading(false)
      }
    }
    initialFetch()
  }, [fetchMessages])

  const loadMoreMessages = async () => {
    if (!nextPageToken || loadingMore) return
    try {
      setLoadingMore(true)
      await fetchMessages(nextPageToken)
    } catch (err) {
      console.error("[v0] Error loading more messages:", err)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleRefresh = async () => {
    try {
      console.log("[v0] Manual refresh triggered for unified inbox")
      setLoading(true)
      setAllMessages([])
      setMessages([])
      setSelectedMessage(null)
      setNextPageToken(null)
      await fetchMessages()
    } catch (err) {
      console.error("[v0] Error refreshing:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAccountSwitch = useCallback((newAccountEmail: string) => {
    console.log("[v0] Account switched to:", newAccountEmail)
    // No longer needed for unified messages
  }, [])

  useEffect(() => {
    // No longer needed for unified messages
  }, [currentAccountEmail, fetchMessages])

  useEffect(() => {
    try {
      console.log("[v0] Filtering messages for folder:", currentFolder)
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
          try {
            const subject = m.payload?.headers?.find((h) => h.name.toLowerCase() === "subject")?.value || ""
            const from = m.payload?.headers?.find((h) => h.name.toLowerCase() === "from")?.value || ""
            return (
              subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
              from.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (m.snippet || "").toLowerCase().includes(searchQuery.toLowerCase())
            )
          } catch (err) {
            console.error("[v0] Error filtering message:", err)
            return false
          }
        })
      }

      setMessages(filtered)
    } catch (err) {
      console.error("[v0] Error in filter effect:", err)
      setError("Error filtering messages")
    }
  }, [currentFolder, allMessages, searchQuery])

  const handleCompose = () => {
    try {
      console.log("[v0] Opening compose modal")
      setReplyTo(undefined)
      setIsComposeOpen(true)
    } catch (err) {
      console.error("[v0] Error opening compose:", err)
    }
  }

  const handleReply = () => {
    try {
      if (!selectedMessage) {
        console.log("[v0] No message selected for reply")
        return
      }

      console.log("[v0] Preparing reply")
      const from = selectedMessage.payload?.headers?.find((h) => h.name.toLowerCase() === "from")?.value || ""
      const subject = selectedMessage.payload?.headers?.find((h) => h.name.toLowerCase() === "subject")?.value || ""
      const messageId =
        selectedMessage.payload?.headers?.find((h) => h.name.toLowerCase() === "message-id")?.value || ""

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
    } catch (err) {
      console.error("[v0] Error preparing reply:", err)
    }
  }

  const handleArchive = async () => {
    if (!selectedMessage) return
    try {
      console.log("[v0] Archiving message:", selectedMessage.id)

      // Optimistically update UI
      const messageId = selectedMessage.id
      setAllMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, labelIds: (m.labelIds || []).filter((l) => l !== "INBOX") } : m)),
      )
      setSelectedMessage(null)

      // Send API request in background
      await fetch(`/api/gmail/message/${selectedMessage.id}/archive`, { method: "POST" })
    } catch (err) {
      console.error("[v0] Error archiving message:", err)
      // Refresh on error
      handleRefresh()
    }
  }

  const handleDelete = async () => {
    if (!selectedMessage) return
    try {
      console.log("[v0] Deleting message:", selectedMessage.id)

      // Optimistically update UI
      const messageId = selectedMessage.id
      setAllMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, labelIds: [...(m.labelIds || []), "TRASH"] } : m)),
      )
      setSelectedMessage(null)

      // Send API request in background
      await fetch(`/api/gmail/message/${selectedMessage.id}/trash`, { method: "POST" })
    } catch (err) {
      console.error("[v0] Error deleting message:", err)
      handleRefresh()
    }
  }

  const handleMarkAsSpam = async () => {
    if (!selectedMessage) return
    try {
      console.log("[v0] Marking as spam:", selectedMessage.id)

      // Optimistically update UI
      const messageId = selectedMessage.id
      setAllMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, labelIds: [...(m.labelIds || []), "SPAM"] } : m)),
      )
      setSelectedMessage(null)

      // Send API request in background
      await fetch(`/api/gmail/message/${selectedMessage.id}/spam`, { method: "POST" })
    } catch (err) {
      console.error("[v0] Error marking as spam:", err)
      handleRefresh()
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
          onLoadMore={loadMoreMessages}
          hasMore={!!nextPageToken}
          loadingMore={loadingMore}
          onRefresh={handleRefresh}
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
