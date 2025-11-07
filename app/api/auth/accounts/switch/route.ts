import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const accountsStr = cookieStore.get("gmail_accounts")?.value

    if (!accountsStr) {
      return NextResponse.json({ error: "No accounts found" }, { status: 404 })
    }

    const accounts = JSON.parse(accountsStr)
    const account = accounts.find((acc: any) => acc.email === email)

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    cookieStore.set("active_account", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    })

    console.log("[v0] Switched active account to:", email)

    return NextResponse.json({ success: true, account })
  } catch (error) {
    console.error("[v0] Error switching account:", error)
    return NextResponse.json({ error: "Failed to switch account" }, { status: 500 })
  }
}
