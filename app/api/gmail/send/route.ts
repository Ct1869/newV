import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

async function getAccessToken() {
  const cookieStore = await cookies()
  return cookieStore.get("access_token")?.value
}

function createMimeMessage(to: string, subject: string, body: string, replyTo?: string, threadId?: string) {
  const messageParts = [
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    body,
  ]

  if (replyTo) {
    messageParts.splice(1, 0, `In-Reply-To: ${replyTo}`)
    messageParts.splice(2, 0, `References: ${replyTo}`)
  }

  const message = messageParts.join("\r\n")
  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")

  return encodedMessage
}

export async function POST(request: NextRequest) {
  const accessToken = await getAccessToken()

  if (!accessToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const { to, subject, body, replyTo, threadId } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const encodedMessage = createMimeMessage(to, subject, body, replyTo, threadId)

    const requestBody: any = {
      raw: encodedMessage,
    }

    if (threadId) {
      requestBody.threadId = threadId
    }

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] Error sending message:", error)
      throw new Error("Failed to send message")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error sending message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
