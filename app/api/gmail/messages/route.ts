import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getAccessToken() {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value
}

export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const maxResults = searchParams.get("maxResults") || "100"
  const pageToken = searchParams.get("pageToken")

  try {
    const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages")
    url.searchParams.set("maxResults", maxResults)
    if (pageToken) {
      url.searchParams.set("pageToken", pageToken)
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch messages")
    }

    const data = await response.json()

    const messagesWithDetails = await Promise.all(
      (data.messages || []).map(async (message: { id: string }) => {
        const detailResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        )
        return detailResponse.json()
      }),
    )

    return NextResponse.json({
      messages: messagesWithDetails,
      nextPageToken: data.nextPageToken,
      resultSizeEstimate: data.resultSizeEstimate,
    })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
