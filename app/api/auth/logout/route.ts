import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()

  // Clear authentication cookies
  cookieStore.delete("access_token")
  cookieStore.delete("refresh_token")

  return NextResponse.json({ success: true })
}
