"use client"
import {
  Inbox,
  Send,
  FileText,
  Archive,
  Trash2,
  Clock,
  AlertOctagon,
  Plus,
  Settings,
  MessageSquare,
  Tag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { EmailFolder } from "@/app/inbox/page"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface InboxSidebarProps {
  onCompose: () => void
  currentFolder: EmailFolder
  onFolderChange: (folder: EmailFolder) => void
  messageCounts: {
    inbox: number
    drafts: number
    sent: number
    archive: number
    snoozed: number
    spam: number
    bin: number
  }
}

export function InboxSidebar({ onCompose, currentFolder, onFolderChange, messageCounts }: InboxSidebarProps) {
  const [showLabels, setShowLabels] = useState(false)
  const router = useRouter()

  const coreItems = [
    { icon: Inbox, label: "Inbox", count: messageCounts.inbox, folder: "inbox" as EmailFolder },
    { icon: FileText, label: "Drafts", count: messageCounts.drafts, folder: "drafts" as EmailFolder },
    { icon: Send, label: "Sent", count: messageCounts.sent, folder: "sent" as EmailFolder },
  ]

  const managementItems = [
    { icon: Archive, label: "Archive", count: messageCounts.archive, folder: "archive" as EmailFolder },
    { icon: Clock, label: "Snoozed", count: messageCounts.snoozed, folder: "snoozed" as EmailFolder },
    { icon: AlertOctagon, label: "Spam", count: messageCounts.spam, folder: "spam" as EmailFolder },
    { icon: Trash2, label: "Bin", count: messageCounts.bin, folder: "bin" as EmailFolder },
  ]

  return (
    <div className="flex w-64 flex-col border-r border-white/10 bg-[#0a0a0a]">
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-lg">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Stem Magazine</p>
            <p className="text-xs text-gray-400 truncate">stemmagazine12@gmail.com</p>
          </div>
          <button className="text-gray-400 hover:text-white">
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
          <span>GET VERIFIED</span>
        </button>
      </div>

      <div className="p-4">
        <Button onClick={onCompose} className="w-full justify-start gap-2 bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          New email
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <div className="px-2 pb-2">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Core</p>
          <div className="space-y-1">
            {coreItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onFolderChange(item.folder)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  currentFolder === item.folder
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className="text-xs text-gray-500 font-medium">{item.count.toLocaleString()}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="px-2 pb-2">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Management</p>
          <div className="space-y-1">
            {managementItems.map((item) => (
              <button
                key={item.label}
                onClick={() => onFolderChange(item.folder)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                  currentFolder === item.folder
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && <span className="text-xs text-gray-500 font-medium">{item.count}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="px-2 pb-2">
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase hover:text-gray-400"
          >
            <span>Labels</span>
            <Plus className="h-4 w-4" />
          </button>
          {showLabels && (
            <div className="space-y-1 mt-1">
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                <Tag className="h-4 w-4" />
                <span>Add label</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-white/10">
        <button
          onClick={() => router.push("/feedback")}
          className="flex w-full items-center gap-3 px-5 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Feedback</span>
        </button>
        <button
          onClick={() => router.push("/settings")}
          className="flex w-full items-center gap-3 px-5 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}
