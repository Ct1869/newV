import { Star, Archive, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Paperclip, ChevronDown } from "lucide-react"

export function EmailPreview() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-32">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-2xl">
        {/* Email Client Interface */}
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-white/10 bg-[#0d0d0d] p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold">
                  B
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">A</span>
                  <span className="text-xs text-gray-500">+</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="mb-4">
              <span className="text-xs text-gray-500">work@baked.design</span>
            </div>

            <button className="mb-6 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              ✏️ New email
            </button>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 mb-2">Core</div>
              <button className="flex w-full items-center justify-between rounded-md bg-blue-600/20 px-3 py-2 text-sm text-white">
                <span>📥 Inbox</span>
                <span className="text-xs">281</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                <span>⭐ Favorites</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                <span>📝 Drafts</span>
                <span className="text-xs">13</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                <span>➡️ Sent</span>
              </button>

              <div className="pt-4">
                <div className="text-xs font-semibold text-gray-500 mb-2">Management</div>
                <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                  <span>📦 Archive</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                  <span>🚫 Spam</span>
                  <span className="text-xs">24</span>
                </button>
                <button className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                  <span>🗑️ Bin</span>
                </button>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-64 space-y-1">
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                <span>⚙️</span>
                <span>Settings</span>
              </button>
              <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white">
                <span>💬</span>
                <span>Support</span>
              </button>
            </div>
          </div>

          {/* Email List */}
          <div className="w-80 border-r border-white/10 bg-[#0a0a0a]">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-600" />
                  <h2 className="text-sm font-semibold">📥 Inbox</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search"
                className="w-full rounded-md bg-white/5 px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
              <button className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white">🔵 Primary</button>
              <button className="rounded px-3 py-1 text-xs text-gray-400 hover:bg-white/5">👤</button>
              <button className="rounded px-3 py-1 text-xs text-gray-400 hover:bg-white/5">📎</button>
              <button className="rounded px-3 py-1 text-xs text-gray-400 hover:bg-white/5">🔔</button>
            </div>

            <div className="overflow-y-auto">
              <div className="space-y-px">
                <EmailListItem
                  sender="Baked Design"
                  subject="New design review"
                  preview="Design review of new email client features..."
                  date="Mar 29"
                  unread
                  hasAttachment
                  priority="high"
                />
                <EmailListItem
                  sender="Alex, Ali, Sarah"
                  subject="Re: Design review feedback"
                  preview="Re: Design review feedback"
                  date="Mar 28"
                  hasAttachment
                  priority="medium"
                />
                <EmailListItem
                  sender="GitHub"
                  subject="Security alert: Critical vulnerability"
                  preview="Security alert: Critical vulnerability"
                  date="Mar 28"
                  priority="high"
                />
                <EmailListItem
                  sender="Stripe"
                  subject="Payment confirmation #1234"
                  preview="Payment confirmation #1234"
                  date="Mar 29"
                  priority="medium"
                />
                <EmailListItem
                  sender="Netflix"
                  subject="New shows added to your list"
                  preview="New shows added to your list"
                  date="Mar 29"
                  priority="low"
                />
                <EmailListItem sender="Nick" subject="Coffee next week?" preview="Coffee next week?" date="Mar 28" />
                <EmailListItem
                  sender="Asana"
                  subject="Weekly task summary"
                  preview="Weekly task summary"
                  date="Mar 25"
                  priority="low"
                />
              </div>
            </div>

            <div className="border-t border-white/10 p-2 text-center text-xs text-gray-500">Primary [278]</div>
          </div>

          {/* Email Content */}
          <div className="flex-1 bg-[#0a0a0a]">
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-600" />
                  <button className="text-gray-400 hover:text-white">
                    <Archive className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-white">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button className="text-gray-400 hover:text-white">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-sm font-semibold">
                      A
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-xs">
                        S
                      </div>
                    </div>
                  </div>
                  <button className="text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                </div>

                <h1 className="mb-2 text-xl font-semibold">Re: Design review feedback [6]</h1>
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-400">
                  <span>March 25 - March 29</span>
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs">A</div>
                    <span className="text-sm">All</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs">A</div>
                    <span className="text-sm">Alex</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs">S</div>
                    <span className="text-sm">Sarah</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-lg bg-[#111111] p-4">
                <div className="mb-2 flex items-center gap-2 text-sm">
                  <span className="font-semibold">AI Summary</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <p className="text-sm text-gray-300">
                  Design review of new email client features. Team discussed command center improvements and category
                  system. General positive feedback, with suggestions for quick actions placement.
                </p>
              </div>

              <div className="mb-4 rounded-lg border border-white/10 bg-[#111111] p-4">
                <div className="mb-2 text-xs text-gray-500">Attachments [4]</div>
                <div className="flex flex-wrap gap-2">
                  <AttachmentBadge name="cmd.center.fig" size="21 MB" />
                  <AttachmentBadge name="comments.docx" size="3.7 MB" />
                  <AttachmentBadge name="img.png" size="2.3 MB" />
                  <AttachmentBadge name="requirements.pdf" size="1.5 MB" />
                </div>
              </div>

              <div className="space-y-6">
                <EmailMessage
                  sender="Al Medgasanov"
                  recipients="Alex, Sarah"
                  time="March 25, 10:15 AM"
                  content="yo team, i've updated the email client design with some new interactions. taking a different approach with the command center - much cleaner now. check out the new flow and let me know what you think!"
                  hasAttachment
                />

                <EmailMessage
                  sender="Sarah"
                  recipients="All"
                  time="March 25, 2:30 PM"
                  content="i've spent some time playing with the new version and have quite a few thoughts. the command center is definitely moving in the right direction - the new layout makes much more sense for power users. Really like how you've integrated the search with the UI."
                />

                <EmailMessage
                  sender="Alex"
                  recipients="All, Sarah"
                  time="March 25, 3:45 PM"
                  content="Let me know what you think about these points. Happy to jump on a call to discuss in detail."
                />
              </div>

              <div className="mt-6 flex gap-2">
                <button className="rounded-md bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                  ↩️ Reply
                </button>
                <button className="rounded-md bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                  ➡️ Forward
                </button>
                <button className="ml-auto rounded-md bg-white/5 p-2 text-white hover:bg-white/10">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function EmailListItem({
  sender,
  subject,
  preview,
  date,
  unread = false,
  hasAttachment = false,
  priority,
}: {
  sender: string
  subject: string
  preview: string
  date: string
  unread?: boolean
  hasAttachment?: boolean
  priority?: "high" | "medium" | "low"
}) {
  return (
    <div className={`border-b border-white/5 p-4 hover:bg-white/5 ${unread ? "bg-white/5" : ""}`}>
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold">
            {sender[0]}
          </div>
          <span className={`text-sm ${unread ? "font-semibold" : "text-gray-400"}`}>{sender}</span>
        </div>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <div className="ml-8">
        <div className="mb-1 flex items-center gap-2">
          <span className={`text-sm ${unread ? "font-medium" : "text-gray-400"}`}>{subject}</span>
          {hasAttachment && <Paperclip className="h-3 w-3 text-gray-500" />}
        </div>
        <p className="text-xs text-gray-500">{preview}</p>
        {priority && (
          <div className="mt-1 flex gap-1">
            {priority === "high" && (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              </>
            )}
            {priority === "medium" && (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
              </>
            )}
            {priority === "low" && <div className="h-1.5 w-1.5 rounded-full bg-green-500" />}
          </div>
        )}
      </div>
    </div>
  )
}

function AttachmentBadge({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white/5 px-3 py-2">
      <Paperclip className="h-4 w-4 text-gray-400" />
      <span className="text-sm">{name}</span>
      <span className="text-xs text-gray-500">{size}</span>
    </div>
  )
}

function EmailMessage({
  sender,
  recipients,
  time,
  content,
  hasAttachment = false,
}: {
  sender: string
  recipients: string
  time: string
  content: string
  hasAttachment?: boolean
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#111111] p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-sm font-semibold">
            {sender[0]}
          </div>
          <div>
            <div className="font-semibold">{sender}</div>
            <div className="text-xs text-gray-500">To: {recipients}</div>
          </div>
        </div>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className="text-sm text-gray-300">{content}</p>
      {hasAttachment && (
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <Paperclip className="h-3 w-3" />
          <span>cmd.center.fig 21 MB</span>
        </div>
      )}
    </div>
  )
}
