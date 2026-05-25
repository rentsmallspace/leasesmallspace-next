// Browser helper that submits an inquiry to /api/leads/inquiry and then
// fires the Meta Pixel `Lead` event with the same event_id the API returned,
// so the server-side CAPI event and the client-side Pixel event dedup in
// Meta's Events Manager.

export interface InquirySubmitPayload {
  name: string
  email: string
  phone: string
  inquiry_type: string
  message?: string
  company?: string
  property_id?: string
  source?: string
  page_captured?: string
  city?: string
  state?: string
  zip?: string
  country?: string
}

export interface InquirySubmitResult {
  success: true
  event_id: string
  user: { id: string; email: string }
  inquiry: { id: string }
  capi: { ok: boolean; status: number | null }
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

export async function submitInquiry(
  payload: InquirySubmitPayload,
): Promise<InquirySubmitResult> {
  const body: InquirySubmitPayload = {
    ...payload,
    page_captured:
      payload.page_captured ??
      (typeof window !== "undefined" ? window.location.pathname : undefined),
  }

  const resp = await fetch("/api/leads/inquiry", {
    method: "POST",
    headers: { "content-type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  })

  let parsed: Record<string, unknown> = {}
  try {
    parsed = (await resp.json()) as Record<string, unknown>
  } catch {
    // body was not JSON; fall through to error path
  }

  if (!resp.ok || !parsed.success) {
    const err = (parsed.error as string | undefined) ?? `submit_failed_${resp.status}`
    throw new Error(err)
  }

  const result = parsed as unknown as InquirySubmitResult

  if (typeof window !== "undefined" && window.fbq && result.event_id) {
    try {
      window.fbq("track", "Lead", {}, { eventID: result.event_id })
    } catch (err) {
      console.warn("[inquiry-client] fbq Lead fire failed:", err)
    }
  }

  return result
}
