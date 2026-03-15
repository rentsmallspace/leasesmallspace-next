import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

const ADMIN_EMAIL =
  process.env.LEAD_NOTIFICATION_EMAIL ||
  process.env.ADMIN_EMAIL ||
  "nate@secureassetmg.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    let { to, subject, template, html, data, from } = body

    if (!to || !subject) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Resolve admin placeholder so lead notifications go to the right inbox
    if (to === "admin" || template === "new-lead-notification") {
      to = ADMIN_EMAIL
    }

    const result = await sendEmail({
      to,
      subject,
      template,
      html,
      data,
      from,
    })

    if (result.success) {
      return NextResponse.json({ success: true, id: result.id })
    } else {
      return NextResponse.json({ error: result.message || "Failed to send email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
