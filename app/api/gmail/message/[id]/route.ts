import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getAccessToken() {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const accessToken = await getAccessToken()
  const { id } = await params

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch message")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error fetching message:", error)
    return NextResponse.json({ error: "Failed to fetch message" }, { status: 500 })
  }
}
