import { randomUUID } from "node:crypto"
import { type NextRequest, NextResponse } from "next/server"
import { createInquiry } from "@/lib/leads"
import { postCapiLead, type CapiInquiryPayload } from "@/lib/capi-client"

export const runtime = "nodejs"

interface InquiryRequestBody {
  name: string
  email: string
  phone: string
  company?: string
  message?: string
  inquiry_type: string
  property_id?: string
  source?: string
  page_captured?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

function splitName(full: string): { first?: string; last?: string } {
  const trimmed = full.trim()
  if (!trimmed) return {}
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) return { first: parts[0] }
  return { first: parts[0], last: parts.slice(1).join(" ") }
}

function extractIp(req: NextRequest): string | undefined {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]?.trim() || undefined
  const real = req.headers.get("x-real-ip")
  return real?.trim() || undefined
}

export async function POST(req: NextRequest) {
  let body: InquiryRequestBody
  try {
    body = (await req.json()) as InquiryRequestBody
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const { name, email, phone } = body
  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "missing_required_fields", required: ["name", "email", "phone"] },
      { status: 400 },
    )
  }

  const event_id = randomUUID()

  let inquiryResult: Awaited<ReturnType<typeof createInquiry>>
  try {
    inquiryResult = await createInquiry({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      message: body.message,
      inquiry_type: body.inquiry_type,
      property_id: body.property_id,
      source: body.source,
      page_captured: body.page_captured,
    })
  } catch (err) {
    console.error("[api/leads/inquiry] createInquiry failed:", err)
    return NextResponse.json(
      {
        error: "inquiry_create_failed",
        details: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 },
    )
  }

  const { first, last } = splitName(body.name)
  const fbp = req.cookies.get("_fbp")?.value
  const fbc = req.cookies.get("_fbc")?.value
  const sourceUrl = req.headers.get("referer") || undefined

  const capiPayload: CapiInquiryPayload = {
    event_id,
    email: body.email,
    phone: body.phone,
    first_name: first,
    last_name: last,
    city: body.city,
    state: body.state,
    zip: body.zip,
    country: body.country,
    source_url: sourceUrl,
    client_ip_address: extractIp(req),
    client_user_agent: req.headers.get("user-agent") || undefined,
    fbp,
    fbc,
  }

  const capi = await postCapiLead(capiPayload)
  if (!capi.ok) {
    console.warn(
      `[api/leads/inquiry] CAPI POST non-ok (event_id=${event_id}): ${capi.error ?? "unknown"}`,
    )
  }

  return NextResponse.json({
    success: true,
    event_id,
    user: inquiryResult.user,
    inquiry: inquiryResult.inquiry,
    capi: {
      ok: capi.ok,
      status: capi.status,
      error: capi.error,
      body: capi.body,
      debug: capi.debug,
    },
  })
}
