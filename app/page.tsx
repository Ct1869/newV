import { Hero } from "@/components/hero"
import { EmailPreview } from "@/components/email-preview"
import { SpeedSection } from "@/components/speed-section"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main>
        <Hero />
        <EmailPreview />
        <SpeedSection />
      </main>
    </div>
  )
}
