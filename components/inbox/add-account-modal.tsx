"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface AddAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddAccountModal({ isOpen, onClose }: AddAccountModalProps) {
  const handleAddGmail = () => {
    window.location.href = "/api/auth/google"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1a1a] text-white border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add Account</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-400">Connect another email account to manage all your emails in one place.</p>
          <Button
            onClick={handleAddGmail}
            className="w-full justify-start gap-3 bg-white/5 text-white hover:bg-white/10 border border-white/10"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <Mail className="h-5 w-5 text-black" />
            </div>
            <div className="text-left">
              <p className="font-semibold">Gmail</p>
              <p className="text-xs text-gray-400">Connect your Gmail account</p>
            </div>
          </Button>
          <div className="pt-4 border-t border-white/10">
            <p className="text-xs text-gray-500">More providers coming soon...</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
