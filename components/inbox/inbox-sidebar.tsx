"use client"

import { Button } from "@/components/ui/button"
import { Plus, Inbox, FileText, Send, Archive, Clock, AlertCircle, Trash2, Settings } from "lucide-react"

interface InboxSidebarProps {
  onFolderChange: (folder: string) => void
  currentFolder: string
  onCompose: () => void
}

export function InboxSidebar({ onFolderChange, currentFolder, onCompose }: InboxSidebarProps) {
  const folders = [
    { id: "INBOX", name: "Inbox", icon: Inbox, count: 0 },
    { id: "DRAFT", name: "Drafts", icon: FileText, count: 0 },
    { id: "SENT", name: "Sent", icon: Send, count: 0 },
  ]

  const managementFolders = [
    { id: "ARCHIVE", name: "Archive", icon: Archive, count: 0 },
    { id: "SNOOZED", name: "Snoozed", icon: Clock, count: 0 },
    { id: "SPAM", name: "Spam", icon: AlertCircle, count: 0 },
    { id: "TRASH", name: "Bin", icon: Trash2, count: 0 },
  ]

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      {/* User Profile */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            U
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">User</p>
            <p className="text-xs text-zinc-400">Loading...</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">GET VERIFIED</p>
      </div>

      {/* New Email Button */}
      <div className="p-4">
        <Button onClick={onCompose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          New email
        </Button>
      </div>

      {/* Core Folders */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <p className="text-xs font-semibold text-zinc-500 mb-2">CORE</p>
          {folders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentFolder === folder.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <folder.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{folder.name}</span>
              {folder.count > 0 && <span className="text-xs text-zinc-500">{folder.count}</span>}
            </button>
          ))}
        </div>

        {/* Management Folders */}
        <div className="px-4 py-2 border-t border-zinc-800 mt-2">
          <p className="text-xs font-semibold text-zinc-500 mb-2">MANAGEMENT</p>
          {managementFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onFolderChange(folder.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                currentFolder === folder.id
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <folder.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{folder.name}</span>
              {folder.count > 0 && <span className="text-xs text-zinc-500">{folder.count}</span>}
            </button>
          ))}
        </div>

        {/* Labels */}
        <div className="px-4 py-2 border-t border-zinc-800 mt-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-zinc-500">LABELS</p>
            <Plus className="h-3 w-3 text-zinc-500 cursor-pointer hover:text-zinc-400" />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-zinc-800">
        <button
          onClick={() => (window.location.href = "/settings")}
          className="w-full flex items-center gap-3 px-6 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </div>
  )
}
