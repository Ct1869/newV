import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] API: Fetching messages")
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("gmail_access_token")?.value
    console.log("[v0] API: Access token present:", !!accessToken)

    if (!accessToken) {
      console.error("[v0] API: No access token found in cookies")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get("folder") || "INBOX"
    const maxResults = searchParams.get("maxResults") || "50"
    const pageToken = searchParams.get("pageToken")

    console.log("[v0] API: Requesting folder:", folder, "maxResults:", maxResults)

    const gmailUrl = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages")
    gmailUrl.searchParams.set("maxResults", maxResults)
    gmailUrl.searchParams.set("labelIds", folder)
    if (pageToken) {
      gmailUrl.searchParams.set("pageToken", pageToken)
    }

    const messagesResponse = await fetch(gmailUrl.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    console.log("[v0] API: Gmail API response status:", messagesResponse.status)

    if (!messagesResponse.ok) {
      const errorText = await messagesResponse.text()
      console.error("[v0] API: Gmail API error:", errorText)
      throw new Error("Failed to fetch messages from Gmail")
    }

    const messagesData = await messagesResponse.json()
    console.log("[v0] API: Found messages:", messagesData.messages?.length || 0)

    if (!messagesData.messages || messagesData.messages.length === 0) {
      return NextResponse.json({
        messages: [],
        nextPageToken: null,
      })
    }

    const messagePromises = messagesData.messages.map(async (msg: any) => {
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      return detailResponse.json()
    })

    const messages = await Promise.all(messagePromises)
    console.log("[v0] API: Fetched full message details for", messages.length, "messages")

    return NextResponse.json({
      messages,
      nextPageToken: messagesData.nextPageToken,
    })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch emails" },
      { status: 500 },
    )
  }
}
