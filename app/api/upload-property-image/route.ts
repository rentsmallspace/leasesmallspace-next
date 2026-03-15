import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import { storageConfig, getStoragePublicUrl } from "@/lib/storage"

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_").slice(0, 100)
}

const UPLOAD_FOLDER = "leasesmallspace/properties"

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 })
    }
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const safeName = sanitizeFilename(file.name.replace(/\.[^.]+$/, ""))
    const fileName = `${Date.now()}-${safeName}.${ext}`
    const path = `${UPLOAD_FOLDER}/${fileName}`
    const arrayBuffer = await file.arrayBuffer()
    const { error } = await supabaseAdmin.storage
      .from(storageConfig.bucket)
      .upload(path, arrayBuffer, { contentType: file.type, upsert: false })
    if (error) {
      console.error("Supabase storage upload error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const publicUrl = getStoragePublicUrl(path)
    return NextResponse.json({ path, publicUrl, width: undefined, height: undefined, format: ext })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
