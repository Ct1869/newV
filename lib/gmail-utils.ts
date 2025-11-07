export interface GmailMessage {
  id: string
  threadId: string
  labelIds?: string[]
  snippet?: string
  payload?: {
    headers?: Array<{ name: string; value: string }>
    body?: {
      data?: string
      size?: number
    }
    parts?: Array<{
      mimeType: string
      body?: {
        data?: string
        size?: number
      }
      parts?: any[]
    }>
  }
  internalDate?: string
}

export function getHeader(message: GmailMessage, headerName: string): string {
  const header = message.payload?.headers?.find((h) => h.name.toLowerCase() === headerName.toLowerCase())
  return header?.value || ""
}

export function getMessageBody(message: GmailMessage): string {
  let body = ""

  try {
    // Check if body data exists directly
    if (message.payload?.body?.data) {
      body = message.payload.body.data
    } else if (message.payload?.parts) {
      // Look for text/plain or text/html parts
      const textPart = message.payload.parts.find(
        (part) => part.mimeType === "text/plain" || part.mimeType === "text/html",
      )
      if (textPart?.body?.data) {
        body = textPart.body.data
      }
    }

    // Decode base64url
    if (body) {
      try {
        return atob(body.replace(/-/g, "+").replace(/_/g, "/"))
      } catch (e) {
        console.error("[v0] Error decoding message body:", e)
        return message.snippet || ""
      }
    }

    return message.snippet || ""
  } catch (error) {
    console.error("[v0] Error getting message body:", error)
    return message.snippet || ""
  }
}

export function formatDate(timestamp?: string): string {
  if (!timestamp) return "Unknown"

  try {
    const date = new Date(Number.parseInt(timestamp))
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" })
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  } catch (error) {
    console.error("[v0] Error formatting date:", error)
    return "Unknown"
  }
}
