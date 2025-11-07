import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Github, Star } from "lucide-react"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
              <span className="text-lg font-bold text-black">0</span>
            </div>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
              Company
              <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-300 hover:text-white">
              Resources
              <ChevronDown className="h-4 w-4" />
            </button>
            <Link href="/pricing" className="text-sm text-gray-300 hover:text-white">
              Pricing
            </Link>
            <Link href="/privacy" className="text-sm text-gray-300 hover:text-white">
              Privacy
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/Mail-0/Zero"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white"
          >
            <Github className="h-5 w-5" />
            <Star className="h-4 w-4 fill-current" />
            <span>9,896</span>
          </Link>
          <Button asChild className="bg-white text-black hover:bg-gray-200">
            <Link href="/api/auth/google">Get Started</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
