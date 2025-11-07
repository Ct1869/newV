import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getAccessToken() {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = await getAccessToken()
  const { id } = await params

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
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
    console.error("[v0] Error marking as spam:", error)
    return NextResponse.json({ error: "Failed to mark as spam" }, { status: 500 })
  }
}
