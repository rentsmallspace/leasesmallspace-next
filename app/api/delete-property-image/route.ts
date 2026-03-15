import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import { storageConfig } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 })
    }
    const { path } = await request.json()
    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "path is required" }, { status: 400 })
    }
    const { error } = await supabaseAdmin.storage.from(storageConfig.bucket).remove([path])
    if (error) {
      console.error("Supabase storage delete error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
