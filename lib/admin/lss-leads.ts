"use server"

import { createClient } from "@/utils/supabase/server"

export interface LSSUser {
  id: string
  email: string
  full_name: string
  phone: string
  company_name: string | null
  status: string
  lead_source: string
  first_contact_date: string
  last_contact_date: string
  notes: string | null
  created_at: string
  updated_at: string
  lss_inquiries?: Array<{ id: string; created_at: string; updated_at: string }>
  lss_questionnaire_responses?: Array<{ id: string; created_at: string; responses: Record<string, unknown> }>
}

export async function getLSSLeads() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("lss_users")
      .select(
        `*,
        lss_inquiries (id, created_at, updated_at),
        lss_questionnaire_responses (id, created_at, responses)`
      )
      .order("created_at", { ascending: false })
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to fetch LSS users" }
  }
}

export async function getLSSLeadById(id: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("lss_users")
      .select(
        `*,
        lss_inquiries (id, created_at, updated_at),
        lss_questionnaire_responses (id, created_at, responses)`
      )
      .eq("id", id)
      .single()
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to fetch LSS user by ID" }
  }
}

export async function getLSSLeadCount() {
  const supabase = await createClient()
  try {
    const { count, error } = await supabase.from("lss_users").select("*", { count: "exact", head: true })
    if (error) return { error: error.message }
    return { count }
  } catch (error) {
    return { error: "Failed to fetch LSS user count" }
  }
}
