"use client"

import type React from "react"

import { Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useRef } from "react"

interface EmailListProps {
  emails: any[]
  selectedEmail: any
  onSelectEmail: (email: any) => void
  onRefresh: () => void
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function EmailList({
  emails,
  selectedEmail,
  onSelectEmail,
  onRefresh,
  isLoading,
  hasMore,
  onLoadMore,
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      if (hasMore && !isLoading) {
        onLoadMore()
      }
    }
  }

  const filteredEmails = emails.filter((email) => {
    if (!searchQuery) return true
    const searchLower = searchQuery.toLowerCase()
    const from = email.headers?.find((h: any) => h.name === "From")?.value || ""
    const subject = email.headers?.find((h: any) => h.name === "Subject")?.value || ""
    return from.toLowerCase().includes(searchLower) || subject.toLowerCase().includes(searchLower)
  })

  const getHeader = (email: any, name: string) => {
    return email.headers?.find((h: any) => h.name === name)?.value || ""
  }

  const getInitials = (name: string) => {
    const match = name.match(/([A-Z])[a-z]*/)
    return match ? match[1] : name.substring(0, 1).toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-red-600", "bg-pink-600", "bg-yellow-600"]
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="w-96 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-1.5 font-mono text-[10px] font-medium text-zinc-400">
              ⌘K
            </kbd>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-zinc-400 hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <h2 className="text-lg font-semibold text-white">Inbox</h2>
        <p className="text-sm text-zinc-400">
          {filteredEmails.length} messages {hasMore && "(loading more...)"}
        </p>
      </div>

      {/* Email List */}
      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
        {filteredEmails.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500">
            <p>No emails found</p>
          </div>
        ) : (
          filteredEmails.map((email) => {
            const from = getHeader(email, "From")
            const subject = getHeader(email, "Subject")
            const date = getHeader(email, "Date")
            const snippet = email.snippet || ""

            return (
              <button
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`w-full flex items-start gap-3 p-4 border-b border-zinc-800 hover:bg-zinc-900 transition-colors ${
                  selectedEmail?.id === email.id ? "bg-zinc-900" : ""
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${getAvatarColor(from)}`}
                >
                  {getInitials(from)}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-white text-sm truncate">{from.split("<")[0].trim()}</p>
                    <span className="text-xs text-zinc-500 flex-shrink-0 ml-2">{formatDate(date)}</span>
                  </div>
                  <p className="text-sm text-white font-medium truncate mb-1">{subject}</p>
                  <p className="text-xs text-zinc-400 line-clamp-2">{snippet}</p>
                </div>
              </button>
            )
          })
        )}
        {isLoading && (
          <div className="flex items-center justify-center py-4">
            <RefreshCw className="h-5 w-5 animate-spin text-zinc-500" />
          </div>
        )}
      </div>
    </div>
  )
}
