import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(new URL("/?error=access_denied", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", request.url))
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
      throw new Error("Google OAuth credentials not configured")
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for tokens")
    }

    const tokens = await tokenResponse.json()

    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userInfoResponse.ok) {
      throw new Error("Failed to get user info")
    }

    const userInfo = await userInfoResponse.json()

    const cookieStore = await cookies()

    // Get existing accounts
    const existingAccountsStr = cookieStore.get("gmail_accounts")?.value
    const existingAccounts = existingAccountsStr ? JSON.parse(existingAccountsStr) : []

    // Create new account entry
    const newAccount = {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    }

    // Check if account already exists
    const existingIndex = existingAccounts.findIndex((acc: any) => acc.email === userInfo.email)
    if (existingIndex >= 0) {
      // Update existing account
      existingAccounts[existingIndex] = newAccount
    } else {
      // Add new account
      existingAccounts.push(newAccount)
    }

    // Store all accounts
    cookieStore.set("gmail_accounts", JSON.stringify(existingAccounts), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    })

    // Set active account to the newly added one
    cookieStore.set("active_account", userInfo.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    })

    // Redirect to inbox
    return NextResponse.redirect(new URL("/inbox", request.url))
  } catch (error) {
    console.error("[v0] OAuth callback error:", error)
    return NextResponse.redirect(new URL("/?error=auth_failed", request.url))
  }
}
