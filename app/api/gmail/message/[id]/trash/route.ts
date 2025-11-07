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
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to delete message")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting message:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
