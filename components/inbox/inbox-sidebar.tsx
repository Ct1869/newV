"use client"
import { Inbox, Send, FileText, Archive, Trash2, Clock, AlertOctagon, Plus, Settings, Tag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { EmailFolder } from "@/app/inbox/page"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AddAccountModal } from "./add-account-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface GmailAccount {
  email: string
  name: string
  accessToken: string
}

interface InboxSidebarProps {
  onCompose: () => void
  currentFolder: EmailFolder
  onFolderChange: (folder: EmailFolder) => void
  onAccountSwitch: (email: string) => void
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

export function InboxSidebar({
  onCompose,
  currentFolder,
  onFolderChange,
  onAccountSwitch,
  messageCounts,
}: InboxSidebarProps) {
  const [showLabels, setShowLabels] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [accounts, setAccounts] = useState<GmailAccount[]>([])
  const [currentAccount, setCurrentAccount] = useState<GmailAccount | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadAccounts() {
      try {
        const response = await fetch("/api/auth/accounts")
        if (response.ok) {
          const data = await response.json()
          setAccounts(data.accounts || [])
          setCurrentAccount(data.current || null)
        }
      } catch (error) {
        console.error("[v0] Error loading accounts:", error)
      }
    }
    loadAccounts()
  }, [])

  const handleSwitchAccount = async (account: GmailAccount) => {
    try {
      console.log("[v0] Switching to account:", account.email)

      const response = await fetch("/api/auth/accounts/switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: account.email }),
      })

      if (response.ok) {
        setCurrentAccount(account)
        onAccountSwitch(account.email)
      }
    } catch (error) {
      console.error("[v0] Error switching account:", error)
    }
  }

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

  // Get first letter for avatar
  const avatarLetter = (currentAccount?.name || currentAccount?.email || "U").charAt(0).toUpperCase()

  // Generate color based on email
  const colors = [
    "from-green-400 to-green-600",
    "from-blue-400 to-blue-600",
    "from-purple-400 to-purple-600",
    "from-pink-400 to-pink-600",
  ]
  const colorIndex = (currentAccount?.email.charCodeAt(0) || 0) % colors.length
  const avatarColor = colors[colorIndex]

  return (
    <>
      <div className="flex w-64 flex-col border-r border-white/10 bg-[#0a0a0a]">
        <div className="border-b border-white/10 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-white/5 rounded-lg p-1 -m-1 transition-colors">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-white font-bold text-lg shrink-0`}
                >
                  {avatarLetter}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{currentAccount?.name || "User"}</p>
                  <p className="text-xs text-gray-400 truncate">{currentAccount?.email || "Loading..."}</p>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors shrink-0">
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 bg-[#1a1a1a] border-white/10">
              {accounts.map((account) => (
                <DropdownMenuItem
                  key={account.email}
                  onClick={() => handleSwitchAccount(account)}
                  className="text-white hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${colors[(account.email.charCodeAt(0)) % colors.length]} text-white font-bold text-sm`}
                    >
                      {account.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{account.name}</p>
                      <p className="text-xs text-gray-400 truncate">{account.email}</p>
                    </div>
                    {currentAccount?.email === account.email && <Check className="h-4 w-4 text-blue-400" />}
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem
                onClick={() => setShowAddAccount(true)}
                className="text-blue-400 hover:bg-white/10 cursor-pointer border-t border-white/10"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add another account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
            onClick={() => router.push("/settings")}
            className="flex w-full items-center gap-3 px-5 py-3 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      <AddAccountModal isOpen={showAddAccount} onClose={() => setShowAddAccount(false)} />
    </>
  )
}
