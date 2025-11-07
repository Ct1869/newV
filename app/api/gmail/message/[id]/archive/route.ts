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
        removeLabelIds: ["INBOX"],
        addLabelIds: ["ARCHIVED"],
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to archive message")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Archive error:", error)
    return NextResponse.json({ error: "Failed to archive" }, { status: 500 })
  }
}
