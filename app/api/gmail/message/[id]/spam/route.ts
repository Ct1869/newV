import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("gmail_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        addLabelIds: ["SPAM"],
        removeLabelIds: ["INBOX"],
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to mark as spam")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Spam error:", error)
    return NextResponse.json({ error: "Failed to mark as spam" }, { status: 500 })
  }
}
