"use client"

import { type GmailMessage, getHeader, formatDate } from "@/lib/gmail-utils"
import { Star, Search, RefreshCw, Loader2 } from "lucide-react"
import type { EmailFolder } from "@/app/inbox/page"
import { useState, useEffect, useRef } from "react"

interface EmailListProps {
  messages: GmailMessage[]
  selectedMessage: GmailMessage | null
  onSelectMessage: (message: GmailMessage) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  currentFolder: EmailFolder
  onLoadMore?: () => void
  hasMore?: boolean
  loadingMore?: boolean
  onRefresh: () => void
}

export function EmailList({
  messages,
  selectedMessage,
  onSelectMessage,
  searchQuery,
  onSearchChange,
  currentFolder,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  onRefresh,
}: EmailListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const getFolderName = () => {
    return currentFolder.charAt(0).toUpperCase() + currentFolder.slice(1)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement || !onLoadMore || !hasMore || loadingMore) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement
      // Load more when scrolled to 80% of the list
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        onLoadMore()
      }
    }

    scrollElement.addEventListener("scroll", handleScroll)
    return () => scrollElement.removeEventListener("scroll", handleScroll)
  }, [onLoadMore, hasMore, loadingMore])

  return (
    <div className="flex w-[420px] flex-col border-r border-white/10 bg-[#0a0a0a]">
      <div className="border-b border-white/10 p-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-gray-500 bg-white/5 rounded border border-white/10">
              ⌘K
            </kbd>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="border-b border-white/10 px-4 py-3">
        <h2 className="text-lg font-semibold">{getFolderName()}</h2>
        <p className="text-sm text-gray-400">
          {messages.length.toLocaleString()} message{messages.length !== 1 ? "s" : ""}
          {hasMore && " (loading more...)"}
        </p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm">No messages found</p>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              try {
                const from = getHeader(message, "from")
                const subject = getHeader(message, "subject")
                const date = formatDate(message.internalDate)
                const isSelected = selectedMessage?.id === message.id
                const isUnread = message.labelIds?.includes("UNREAD")

                // Extract sender name and email
                const senderMatch = from.match(/^(.*?)\s*<(.+)>$/)
                const senderName = senderMatch ? senderMatch[1].replace(/"/g, "") : from
                const senderEmail = senderMatch ? senderMatch[2] : from

                // Get first letter for avatar
                const avatarLetter = (senderName || senderEmail || "?").charAt(0).toUpperCase()

                // Generate color based on sender
                const colors = [
                  "bg-red-500",
                  "bg-blue-500",
                  "bg-green-500",
                  "bg-yellow-500",
                  "bg-purple-500",
                  "bg-pink-500",
                  "bg-indigo-500",
                ]
                const colorIndex = (senderEmail.charCodeAt(0) + (senderEmail.charCodeAt(1) || 0)) % colors.length
                const avatarColor = colors[colorIndex] || colors[0]

                return (
                  <button
                    key={message.id}
                    onClick={() => onSelectMessage(message)}
                    className={`w-full border-b border-white/5 p-4 text-left transition-colors ${
                      isSelected ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-semibold text-sm`}
                      >
                        {avatarLetter}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p
                            className={`truncate text-sm ${isUnread ? "font-semibold text-white" : "font-normal text-gray-300"}`}
                          >
                            {senderName || senderEmail || "Unknown"}
                          </p>
                          <span className="text-xs text-gray-500 flex-shrink-0">{date}</span>
                        </div>
                        <p className={`truncate text-sm mb-1 ${isUnread ? "font-medium text-white" : "text-gray-400"}`}>
                          {subject || "(no subject)"}
                        </p>
                        <p className="truncate text-xs text-gray-500">{message.snippet || ""}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // TODO: Implement star functionality
                        }}
                        className="flex-shrink-0 text-gray-500 hover:text-yellow-400 transition-colors"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    </div>
                  </button>
                )
              } catch (error) {
                console.error("[v0] Error rendering message:", message.id, error)
                return null
              }
            })}
            {loadingMore && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
