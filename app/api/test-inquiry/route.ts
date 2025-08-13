import { type NextRequest, NextResponse } from "next/server"
import { createInquiry } from "@/lib/leads"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, property } = body

    console.log("Test inquiry received:", { name, email, phone, property })

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await createInquiry({
      name,
      email,
      phone,
      inquiry_type: "test_inquiry",
      source: "test_api",
      page_captured: "/test",
      message: `Test inquiry for: ${property || "Test Property"}`,
    })

    console.log("Test inquiry result:", result)

    return NextResponse.json({ 
      success: true, 
      message: "Test inquiry created successfully",
      result 
    })
  } catch (error) {
    console.error("Test inquiry error:", error)
    return NextResponse.json(
      { error: "Test inquiry failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
