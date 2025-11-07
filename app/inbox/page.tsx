"use client"

import { useEffect, useState, useCallback } from "react"
import { InboxSidebar } from "@/components/inbox/inbox-sidebar"
import { EmailList } from "@/components/inbox/email-list"
import { EmailDetail } from "@/components/inbox/email-detail"
import { ComposeModal } from "@/components/inbox/compose-modal"

export default function InboxPage() {
  const [emails, setEmails] = useState<any[]>([])
  const [selectedEmail, setSelectedEmail] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [replyTo, setReplyTo] = useState<any>(null)
  const [currentFolder, setCurrentFolder] = useState("INBOX")
  const [hasMore, setHasMore] = useState(false)
  const [pageToken, setPageToken] = useState<string | undefined>(undefined)

  const fetchEmails = useCallback(
    async (folder = "INBOX", reset = false) => {
      try {
        setIsLoading(true)
        setError(null)

        const url = new URL("/api/gmail/messages", window.location.origin)
        url.searchParams.set("folder", folder)
        url.searchParams.set("maxResults", "50")
        if (!reset && pageToken) {
          url.searchParams.set("pageToken", pageToken)
        }

        console.log("[v0] Fetching emails from:", url.toString())
        const response = await fetch(url.toString())
        console.log("[v0] Response status:", response.status)

        if (response.status === 401) {
          console.error("[v0] Not authenticated, redirecting to login")
          window.location.href = "/"
          return
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
          console.error("[v0] API error response:", errorData)
          throw new Error(errorData.error || "Failed to fetch emails")
        }

        const data = await response.json()
        console.log("[v0] Fetched messages count:", data.messages?.length || 0)

        if (reset) {
          setEmails(data.messages || [])
        } else {
          setEmails((prev) => [...prev, ...(data.messages || [])])
        }

        setHasMore(!!data.nextPageToken)
        setPageToken(data.nextPageToken)
      } catch (err) {
        console.error("[v0] Error fetching emails:", err)
        setError(err instanceof Error ? err.message : "Failed to load emails")
      } finally {
        setIsLoading(false)
      }
    },
    [pageToken],
  )

  useEffect(() => {
    fetchEmails("INBOX", true)
  }, [])

  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder)
    setSelectedEmail(null)
    setPageToken(undefined)
    fetchEmails(folder, true)
  }

  const handleRefresh = () => {
    setPageToken(undefined)
    fetchEmails(currentFolder, true)
  }

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      fetchEmails(currentFolder, false)
    }
  }

  const handleCompose = () => {
    setReplyTo(null)
    setIsComposeOpen(true)
  }

  const handleReply = (email: any) => {
    setReplyTo(email)
    setIsComposeOpen(true)
  }

  const handleEmailAction = async (action: "archive" | "delete" | "spam", emailId: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== emailId))
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null)
    }

    try {
      await fetch(`/api/gmail/message/${emailId}/${action}`, { method: "POST" })
    } catch (err) {
      console.error(`[v0] Error ${action}ing email:`, err)
    }
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error loading inbox</h2>
          <p className="text-zinc-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <InboxSidebar onFolderChange={handleFolderChange} currentFolder={currentFolder} onCompose={handleCompose} />

      <EmailList
        emails={emails}
        selectedEmail={selectedEmail}
        onSelectEmail={setSelectedEmail}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
      />

      <EmailDetail
        email={selectedEmail}
        onReply={handleReply}
        onArchive={(id) => handleEmailAction("archive", id)}
        onDelete={(id) => handleEmailAction("delete", id)}
        onSpam={(id) => handleEmailAction("spam", id)}
      />

      <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} replyTo={replyTo} />
    </div>
  )
}
