import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Mail } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-6 h-6" />
            <span className="text-xl font-bold">Zero Mail</span>
          </div>

          <div className="flex items-center gap-8">
            <Link href="#features" className="text-sm text-zinc-400 hover:text-white transition">
              Features
            </Link>
            <Link href="#about" className="text-sm text-zinc-400 hover:text-white transition">
              About
            </Link>
            <a
              href="https://github.com/Mail-0/Zero"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
            >
              <Github className="w-4 h-4" />
              <span>9,896</span>
            </a>
            <a href="/api/auth/google">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Email Client Built for Speed
          </h1>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Zero is an open-source email client that manages your inbox efficiently. No AI features, just fast and
            reliable email management.
          </p>

          <div className="flex items-center justify-center gap-4">
            <a href="/api/auth/google">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                Get Started
              </Button>
            </a>
            <a href="https://github.com/Mail-0/Zero" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                View on GitHub
              </Button>
            </a>
          </div>
        </div>

        {/* Email Preview */}
        <div className="mt-20 max-w-6xl mx-auto">
          <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden shadow-2xl">
            <div className="bg-zinc-800 px-6 py-3 flex items-center gap-2 border-b border-zinc-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="ml-4 text-sm text-zinc-400">inbox@zero.email</span>
            </div>

            <div className="grid grid-cols-12 h-[500px]">
              {/* Sidebar */}
              <div className="col-span-3 border-r border-zinc-800 p-4 bg-zinc-900/50">
                <Button className="w-full mb-4 bg-blue-600 hover:bg-blue-700">+ New email</Button>

                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3 py-2 rounded bg-zinc-800 text-sm">
                    <span>Inbox</span>
                    <span className="text-zinc-400">83</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded hover:bg-zinc-800 text-sm text-zinc-400 cursor-pointer">
                    <span>Drafts</span>
                    <span>1</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded hover:bg-zinc-800 text-sm text-zinc-400 cursor-pointer">
                    <span>Sent</span>
                    <span>2</span>
                  </div>
                </div>
              </div>

              {/* Email List */}
              <div className="col-span-4 border-r border-zinc-800 overflow-y-auto">
                {[
                  { from: "Vercel", subject: "Nice! Someone signed up", time: "1:08 AM" },
                  { from: "GitHub", subject: "New star on your repository", time: "12:45 AM" },
                  { from: "Netflix", subject: "New shows this week", time: "Yesterday" },
                ].map((email, i) => (
                  <div
                    key={i}
                    className={`p-4 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800/50 ${i === 0 ? "bg-zinc-800/30" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">{email.from}</span>
                      <span className="text-xs text-zinc-400">{email.time}</span>
                    </div>
                    <div className="text-sm text-zinc-300">{email.subject}</div>
                  </div>
                ))}
              </div>

              {/* Email Content */}
              <div className="col-span-5 p-6 bg-zinc-900/30">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Nice! Someone signed up</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span>Vercel</span>
                    <span>•</span>
                    <span>1:08 AM</span>
                  </div>
                </div>

                <div className="text-sm text-zinc-300 space-y-4">
                  <p>Good news — someone just signed up using your referral link.</p>
                  <p>That's $5 in credits added to your account.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Built for Performance</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
              <div className="w-12 h-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast & Responsive</h3>
              <p className="text-zinc-400">Handle hundreds of emails with smooth performance and quick navigation.</p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
              <div className="w-12 h-12 bg-green-600/10 rounded-lg flex items-center justify-center mb-4">
                <Github className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Open Source</h3>
              <p className="text-zinc-400">Fully transparent and community-driven development on GitHub.</p>
            </div>

            <div className="bg-zinc-900 p-8 rounded-lg border border-zinc-800">
              <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Gmail Integration</h3>
              <p className="text-zinc-400">Seamlessly connect with your Gmail account and manage emails efficiently.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-32 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-zinc-400">
          <span>© 2025 Zero Mail. Open Source Email Client.</span>
          <a
            href="https://github.com/Mail-0/Zero"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  )
}
