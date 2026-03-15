import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import { storageConfig, getStoragePublicUrl } from "@/lib/storage"

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100)
}

const UPLOAD_FOLDER = "leasesmallspace/properties"

/**
 * Returns a signed upload URL so the client can upload directly to Supabase.
 * Request body is small (JSON with filename) to avoid 413 on platforms like Vercel (4.5MB limit).
 */
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 })
    }
    const body = await request.json().catch(() => ({}))
    const filename = typeof body.filename === "string" ? body.filename : "image"
    const ext = filename.split(".").pop()?.toLowerCase() || "jpg"
    const safeName = sanitizeFilename(filename.replace(/\.[^.]+$/, ""))
    const fileName = `${Date.now()}-${safeName}.${ext}`
    const path = `${UPLOAD_FOLDER}/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from(storageConfig.bucket)
      .createSignedUploadUrl(path)

    if (error) {
      console.error("Supabase createSignedUploadUrl error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const token = data?.token
    if (!token) {
      return NextResponse.json({ error: "No upload token returned" }, { status: 500 })
    }

    const publicUrl = getStoragePublicUrl(path)
    return NextResponse.json({ path, token, publicUrl })
  } catch (error) {
    console.error("Upload URL error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
