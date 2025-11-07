"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Bell, Lock, Palette, Mail, LogOut } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("account")

  const handleLogout = async () => {
    // Clear cookies by calling logout endpoint
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
  }

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy & Security", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "email", label: "Email Settings", icon: Mail },
  ]

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <Button
            onClick={() => router.push("/inbox")}
            variant="ghost"
            className="w-full justify-start gap-2 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Inbox
          </Button>
        </div>

        <nav className="flex-1 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Settings</p>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  activeTab === tab.id ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-8">
          {activeTab === "account" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
              <p className="text-gray-400 mb-8">Manage your account information and preferences</p>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                      <input
                        type="text"
                        defaultValue="Stem Magazine"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="stemmagazine12@gmail.com"
                        disabled
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <div>
                        <p className="font-medium">stemmagazine12@gmail.com</p>
                        <p className="text-sm text-gray-400">Google Account</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 bg-transparent">
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Notification Settings</h1>
              <p className="text-gray-400 mb-8">Choose what notifications you want to receive</p>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-sm text-gray-400">Receive notifications for new emails</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Desktop notifications</p>
                    <p className="text-sm text-gray-400">Show desktop notifications for important emails</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Privacy & Security</h1>
              <p className="text-gray-400 mb-8">Manage your privacy and security settings</p>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-gray-400">Privacy settings coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Appearance</h1>
              <p className="text-gray-400 mb-8">Customize how your email client looks</p>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Theme</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="theme" defaultChecked className="w-4 h-4" />
                    <span>Dark (Current)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="theme" className="w-4 h-4" />
                    <span>Light</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="theme" className="w-4 h-4" />
                    <span>System</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Email Settings</h1>
              <p className="text-gray-400 mb-8">Configure your email preferences</p>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <p className="text-gray-400">Email settings coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
