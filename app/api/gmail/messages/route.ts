import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getAllAccountsWithTokens() {
  const cookieStore = await cookies()
  const accountsStr = cookieStore.get("gmail_accounts")?.value

  if (!accountsStr) {
    return []
  }

  const accounts = JSON.parse(accountsStr)

  const refreshedAccounts = await Promise.all(
    accounts.map(async (account: any) => {
      if (account.expires_at && account.expires_at < Date.now() && account.refresh_token) {
        try {
          const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID!,
              client_secret: process.env.GOOGLE_CLIENT_SECRET!,
              refresh_token: account.refresh_token,
              grant_type: "refresh_token",
            }),
          })

          if (tokenResponse.ok) {
            const tokens = await tokenResponse.json()
            return {
              ...account,
              access_token: tokens.access_token,
              expires_at: Date.now() + tokens.expires_in * 1000,
            }
          }
        } catch (error) {
          console.error("[v0] Error refreshing token for", account.email, error)
        }
      }
      return account
    }),
  )

  // Update stored accounts with refreshed tokens
  cookieStore.set("gmail_accounts", JSON.stringify(refreshedAccounts), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  })

  return refreshedAccounts
}

export async function GET(request: NextRequest) {
  const accounts = await getAllAccountsWithTokens()

  if (!accounts || accounts.length === 0) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const maxResults = searchParams.get("maxResults") || "100"
  const pageToken = searchParams.get("pageToken")

  try {
    const allAccountMessages = await Promise.all(
      accounts.map(async (account: any) => {
        try {
          const url = new URL("https://gmail.googleapis.com/gmail/v1/users/me/messages")
          url.searchParams.set("maxResults", String(Math.floor(Number(maxResults) / accounts.length)))
          if (pageToken) {
            url.searchParams.set("pageToken", pageToken)
          }

          const response = await fetch(url.toString(), {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          })

          if (!response.ok) {
            console.error(`[v0] Failed to fetch messages for ${account.email}`)
            return { accountEmail: account.email, messages: [], nextPageToken: null }
          }

          const data = await response.json()

          const messagesWithDetails = await Promise.all(
            (data.messages || []).map(async (message: { id: string }) => {
              const detailResponse = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
                {
                  headers: {
                    Authorization: `Bearer ${account.access_token}`,
                  },
                },
              )
              const details = await detailResponse.json()
              return { ...details, accountEmail: account.email }
            }),
          )

          return {
            accountEmail: account.email,
            messages: messagesWithDetails,
            nextPageToken: data.nextPageToken,
          }
        } catch (error) {
          console.error(`[v0] Error fetching for ${account.email}:`, error)
          return { accountEmail: account.email, messages: [], nextPageToken: null }
        }
      }),
    )

    const allMessages = allAccountMessages.flatMap((acc) => acc.messages)
    const sortedMessages = allMessages.sort((a, b) => {
      const dateA = Number(a.internalDate || 0)
      const dateB = Number(b.internalDate || 0)
      return dateB - dateA // Most recent first
    })

    return NextResponse.json({
      messages: sortedMessages,
      nextPageToken: allAccountMessages[0]?.nextPageToken || null,
      resultSizeEstimate: sortedMessages.length,
    })
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
