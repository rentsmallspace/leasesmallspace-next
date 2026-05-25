// Server-side CAPI client. Posts an inquiry payload to the lss-ad-agency
// capi-handler Edge Function so Meta records a Lead event for the inquiry.
//
// Best-effort: callers must NOT block their response on this. The inquiry
// row in Supabase is the source of truth; the CAPI POST is observability for
// Meta attribution.

export interface CapiInquiryPayload {
  event_id: string
  email: string
  phone?: string
  first_name?: string
  last_name?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  source_url?: string
  client_ip_address?: string
  client_user_agent?: string
  fbp?: string
  fbc?: string
}

export interface PostCapiLeadResult {
  ok: boolean
  status: number | null
  error?: string
}

const FETCH_TIMEOUT_MS = 5_000

export async function postCapiLead(
  payload: CapiInquiryPayload,
  fetchImpl: typeof fetch = fetch,
): Promise<PostCapiLeadResult> {
  const url = process.env.LSS_CAPI_HANDLER_URL
  if (!url) {
    console.warn("[capi-client] LSS_CAPI_HANDLER_URL not set; CAPI Lead skipped")
    return { ok: false, status: null, error: "url_not_set" }
  }

  // The capi-handler lives on a different Supabase project (lss-ad-ops) for
  // isolation, so the site's NEXT_PUBLIC_SUPABASE_ANON_KEY won't authenticate.
  // LSS_CAPI_HANDLER_ANON_KEY is the lss-ad-ops project's anon key.
  // Anon keys are public by design (RLS gates everything), safe in env.
  const anonKey = process.env.LSS_CAPI_HANDLER_ANON_KEY
  if (!anonKey) {
    console.warn(
      "[capi-client] LSS_CAPI_HANDLER_ANON_KEY not set; CAPI Lead skipped (function requires JWT)",
    )
    return { ok: false, status: null, error: "anon_key_not_set" }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const resp = await fetchImpl(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    if (!resp.ok) {
      const body = await resp.text().catch(() => "")
      console.warn(
        `[capi-client] capi-handler returned ${resp.status}: ${body.slice(0, 300)}`,
      )
      return { ok: false, status: resp.status, error: `http_${resp.status}` }
    }
    return { ok: true, status: resp.status }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[capi-client] CAPI POST failed: ${message}`)
    return { ok: false, status: null, error: message }
  } finally {
    clearTimeout(timer)
  }
}
