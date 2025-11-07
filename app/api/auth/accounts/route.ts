import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const accountsStr = cookieStore.get("gmail_accounts")?.value
    const activeAccount = cookieStore.get("active_account")?.value

    if (!accountsStr) {
      return NextResponse.json({ accounts: [], activeAccount: null })
    }

    const accounts = JSON.parse(accountsStr)

    // Don't send tokens to client, only account info
    const safeAccounts = accounts.map((acc: any) => ({
      email: acc.email,
      name: acc.name,
      picture: acc.picture,
    }))

    return NextResponse.json({
      accounts: safeAccounts,
      activeAccount: activeAccount || safeAccounts[0]?.email || null,
    })
  } catch (error) {
    console.error("[v0] Error fetching accounts:", error)
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const cookieStore = await cookies()

    // Set new active account
    cookieStore.set("active_account", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error switching account:", error)
    return NextResponse.json({ error: "Failed to switch account" }, { status: 500 })
  }
}
