"use client"

import { type GmailMessage, getHeader, getMessageBody } from "@/lib/gmail-utils"
import { Reply, Forward, Trash2, Archive, MoreVertical, AlertOctagon, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EmailDetailProps {
  message: GmailMessage | null
  onReply: () => void
  onArchive: () => void
  onDelete: () => void
  onMarkAsSpam: () => void
}

export function EmailDetail({ message, onReply, onArchive, onDelete, onMarkAsSpam }: EmailDetailProps) {
  if (!message) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0a0a0a] text-gray-500">
        <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <Mail className="h-16 w-16 text-gray-600" />
        </div>
        <p className="text-lg font-medium mb-2">It's empty here</p>
        <p className="text-sm text-gray-600">Choose an email to view details</p>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5 bg-transparent">
            Send email
          </Button>
        </div>
      </div>
    )
  }

  const from = getHeader(message, "from")
  const subject = getHeader(message, "subject")
  const date = new Date(Number.parseInt(message.internalDate))
  const body = getMessageBody(message)

  // Extract sender name and email
  const senderMatch = from.match(/^(.*?)\s*<(.+)>$/)
  const senderName = senderMatch ? senderMatch[1].replace(/"/g, "") : from
  const senderEmail = senderMatch ? senderMatch[2] : from

  // Get first letter for avatar
  const avatarLetter = (senderName || senderEmail).charAt(0).toUpperCase()

  // Generate color based on sender
  const colors = [
    "from-red-500 to-red-600",
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-yellow-500 to-yellow-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
  ]
  const colorIndex = (senderEmail.charCodeAt(0) + senderEmail.charCodeAt(1)) % colors.length
  const avatarColor = colors[colorIndex]

  const sanitizeEmailBody = (html: string) => {
    // Remove dangerous tags but preserve images
    let sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")

    // Ensure images can load from external sources
    sanitized = sanitized.replace(/(<img[^>]+)src=/gi, '$1loading="lazy" src=')

    return sanitized
  }

  return (
    <div className="flex flex-1 flex-col bg-[#0a0a0a]">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-balance">{subject || "(no subject)"}</h1>
          <div className="flex items-center gap-2">
            <Button
              onClick={onArchive}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Archive className="h-5 w-5" />
            </Button>
            <Button
              onClick={onDelete}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
                <DropdownMenuItem onClick={onMarkAsSpam} className="text-white hover:bg-white/10 cursor-pointer">
                  <AlertOctagon className="h-4 w-4 mr-2" />
                  Mark as spam
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                  <Mail className="h-4 w-4 mr-2" />
                  Mark as unread
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-sm font-semibold text-white`}
            >
              {avatarLetter}
            </div>
            <div>
              <p className="font-semibold">{senderName}</p>
              <p className="text-sm text-gray-400">{senderEmail}</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="prose prose-invert max-w-none text-gray-300 leading-relaxed 
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4
            [&_a]:text-blue-400 [&_a]:underline [&_a:hover]:text-blue-300
            [&_table]:border-collapse [&_td]:border [&_td]:border-white/10 [&_td]:p-2
            [&_blockquote]:border-l-4 [&_blockquote]:border-white/20 [&_blockquote]:pl-4 [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: sanitizeEmailBody(body) }}
        />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <Button onClick={onReply} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Reply className="h-4 w-4" />
            Reply
          </Button>
          <Button variant="outline" className="gap-2 border-white/10 text-white hover:bg-white/5 bg-transparent">
            <Forward className="h-4 w-4" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  )
}
