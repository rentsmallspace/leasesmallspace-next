"use server"

import { createClient } from "@/utils/supabase/server"
import { supabaseAdmin } from "@/utils/supabase/admin"
import type { User } from "@supabase/supabase-js"
import crypto from "crypto"

export interface AdminUser {
  id: string
  email: string
  full_name: string
  role: string
  created_at: string
}

export interface AddUserResult {
  success?: boolean
  password?: string
  error?: string
}

export async function getUsers() {
  const supabase = await createClient()
  if (!supabaseAdmin) return { error: "Admin client not configured" }
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "admin")
      .order("created_at", { ascending: false })
    if (profilesError) return { error: profilesError.message }
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) return { error: authError.message }
    const users = (profiles || []).map((profile: { id: string; full_name: string; role: string; created_at: string }) => {
      const authUser = authUsers.users.find((u: User) => u.id === profile.id)
      return { ...profile, email: authUser?.email ?? "N/A" }
    })
    return { data: users }
  } catch (error) {
    return { error: "Failed to fetch users" }
  }
}

export async function getAdminUserCount() {
  const supabase = await createClient()
  try {
    const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin")
    if (error) return { error: error.message }
    return { count }
  } catch (error) {
    return { error: "Failed to fetch admin user count" }
  }
}

export async function addUser(formData: FormData): Promise<AddUserResult> {
  if (!supabaseAdmin) return { error: "Admin client not configured" }
  try {
    const email = formData.get("email") as string
    const fullName = formData.get("fullName") as string
    if (!email || !fullName) return { error: "All fields are required" }
    const password = generateSecurePassword()
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (authError) return { error: authError.message }
    const supabase = await createClient()
    const { error: profileError } = await supabase.from("profiles").insert({
      id: authData.user.id,
      full_name: fullName,
      role: "admin",
    })
    if (profileError) return { error: profileError.message }
    return { success: true, password }
  } catch (error) {
    return { error: "Failed to create user" }
  }
}

function generateSecurePassword() {
  const length = 16
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length)
    password += charset[randomIndex]
  }
  return password
}
