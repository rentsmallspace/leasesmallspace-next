"use server"

import { createClient } from "@/utils/supabase/server"

export interface Lead {
  id: string
  full_name: string
  email: string
  phone: string
  business_name: string
  additional_comments: string
  submission_data: Record<string, unknown>
  created_at: string
}

export async function getLeads() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false })
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to fetch leads" }
  }
}

export async function getLeadById(id: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase.from("leads").select("*").eq("id", id).single()
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to fetch lead by ID" }
  }
}

export async function getRecentLeads(hours: number = 24) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .gte("created_at", new Date(Date.now() - hours * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to fetch recent leads" }
  }
}

export async function getLeadCount() {
  const supabase = await createClient()
  try {
    const { count, error } = await supabase.from("leads").select("*", { count: "exact", head: true })
    if (error) return { error: error.message }
    return { count }
  } catch (error) {
    return { error: "Failed to fetch lead count" }
  }
}
