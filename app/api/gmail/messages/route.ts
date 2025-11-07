import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getAccessToken() {
  const cookieStore = await cookies()
  const activeAccountEmail = cookieStore.get("active_account")?.value
  const accountsStr = cookieStore.get("gmail_accounts")?.value

  if (!activeAccountEmail || !accountsStr) {
    return null
  }

  const accounts = JSON.parse(accountsStr)
  const activeAccount = accounts.find((acc: any) => acc.email === activeAccountEmail)

  if (!activeAccount) {
    return null
  }

  // Check if token is expired
  if (activeAccount.expires_at && activeAccount.expires_at < Date.now()) {
    // Token expired, need to refresh
    if (activeAccount.refresh_token) {
      try {
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            refresh_token: activeAccount.refresh_token,
            grant_type: "refresh_token",
          }),
        })

        if (tokenResponse.ok) {
          const tokens = await tokenResponse.json()
          activeAccount.access_token = tokens.access_token
          activeAccount.expires_at = Date.now() + tokens.expires_in * 1000

          // Update stored account
          const accountIndex = accounts.findIndex((acc: any) => acc.email === activeAccountEmail)
          if (accountIndex >= 0) {
            accounts[accountIndex] = activeAccount
            cookieStore.set("gmail_accounts", JSON.stringify(accounts), {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 365,
            })
          }
        }
      } catch (error) {
        console.error("[v0] Error refreshing token:", error)
      }
    }
  }

  return activeAccount.access_token
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
