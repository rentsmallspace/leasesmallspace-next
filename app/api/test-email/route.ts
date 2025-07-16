import { type NextRequest, NextResponse } from "next/server"
import { sendTestEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { email, name, emailType } = await request.json()

    if (!email || !name || !emailType) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    await sendTestEmail(email, name, emailType)

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${email}`,
    })
  } catch (error) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send test email",
      },
      { status: 500 },
    )
  }
}
