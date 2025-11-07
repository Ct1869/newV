"use client"

import { Button } from "@/components/ui/button"
import { Mail, Reply, Forward, Archive, Trash2, MoreVertical, Flag } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface EmailDetailProps {
  email: any
  onReply: (email: any) => void
  onArchive: (id: string) => void
  onDelete: (id: string) => void
  onSpam: (id: string) => void
}

export function EmailDetail({ email, onReply, onArchive, onDelete, onSpam }: EmailDetailProps) {
  if (!email) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/50 border-l border-zinc-800">
        <Mail className="h-16 w-16 text-zinc-700 mb-4" />
        <h3 className="text-xl font-semibold text-zinc-400 mb-2">It's empty here</h3>
        <p className="text-zinc-500 text-sm">Choose an email to view details</p>
      </div>
    )
  }

  const getHeader = (name: string) => {
    return email.headers?.find((h: any) => h.name === name)?.value || ""
  }

  const from = getHeader("From")
  const subject = getHeader("Subject")
  const date = getHeader("Date")

  const getInitials = (name: string) => {
    const match = name.match(/([A-Z])[a-z]*\s([A-Z])[a-z]*/)
    if (match) return match[1] + match[2]
    return name.substring(0, 2).toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = ["bg-violet-600", "bg-blue-600", "bg-green-600", "bg-red-600", "bg-pink-600", "bg-yellow-600"]
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-900/50 border-l border-zinc-800">
      {/* Email Header Actions */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <h2 className="text-lg font-semibold truncate">{subject}</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onArchive(email.id)}
            className="text-zinc-400 hover:text-white"
          >
            <Archive className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(email.id)}
            className="text-zinc-400 hover:text-white"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
              <DropdownMenuItem onClick={() => onSpam(email.id)} className="text-zinc-300">
                <Flag className="h-4 w-4 mr-2" />
                Mark as Spam
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Email Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-start gap-4 mb-6">
          <div
            className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(from)}`}
          >
            {getInitials(from)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-white">{from.split("<")[0].trim()}</h3>
              <span className="text-sm text-zinc-400">{new Date(date).toLocaleString()}</span>
            </div>
            <p className="text-sm text-zinc-400">{from.match(/<(.+)>/)?.[1] || from}</p>
          </div>
        </div>

        {/* Email Body */}
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: email.body || '<p class="text-zinc-400">No content</p>' }}
        />
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-zinc-800 flex gap-2">
        <Button onClick={() => onReply(email)} className="bg-blue-600 hover:bg-blue-700">
          <Reply className="h-4 w-4 mr-2" />
          Reply
        </Button>
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent">
          <Forward className="h-4 w-4 mr-2" />
          Forward
        </Button>
      </div>
    </div>
  )
}
