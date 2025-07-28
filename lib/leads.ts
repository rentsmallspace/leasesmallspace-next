import { supabase } from "./supabase"
import { sendWelcomeEmailClient, sendLeadNotificationClient } from "./email-client"

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  company_name?: string
  status: string
  lead_source?: string
  first_contact_date: string
  last_contact_date: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Lead {
  id: string
  user_id?: string
  name: string
  email: string
  phone: string
  source?: string
  page_captured?: string
  status: string
  notes?: string
  form_data?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreateLeadData {
  name: string
  email: string
  phone: string
  source?: string
  page_captured?: string
  form_data?: Record<string, any>
}

export interface CreateUserData {
  email: string
  full_name: string
  phone?: string
  company_name?: string
  lead_source?: string
}

/**
 * Create or update a user (primary customer profile)
 */
export async function createOrUpdateUser(userData: CreateUserData): Promise<User> {
  try {
    console.log("Creating/updating user with data:", userData)

    const { data, error } = await supabase
      .from("lss_users")
      .upsert(
        {
          ...userData,
          last_contact_date: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select()
      .single()

    if (error) {
      console.error("Error creating/updating user:", error)
      throw error
    }

    console.log("User created/updated successfully:", data)
    return data
  } catch (error) {
    console.error("Failed to create/update user:", error)
    throw new Error("Database connection failed. Please check your Supabase configuration.")
  }
}

/**
 * Create a lead record (activity log for lead capture events)
 */
export async function createLead(leadData: CreateLeadData): Promise<Lead> {
  try {
    console.log("Creating lead with data:", leadData)

    // First, ensure we have a user record
    const user = await createOrUpdateUser({
      email: leadData.email,
      full_name: leadData.name,
      phone: leadData.phone,
      lead_source: leadData.source,
    })

    // Then create the lead record linked to the user
    const { data, error } = await supabase
      .from("lss_leads")
      .insert([
        {
          user_id: user.id,
          name: leadData.name,
          email: leadData.email,
          phone: leadData.phone,
          source: leadData.source,
          page_captured: leadData.page_captured,
          status: "new",
          form_data: leadData.form_data,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating lead:", error)
      throw error
    }

    console.log("Lead created successfully:", data)
    return data
  } catch (error) {
    console.error("Failed to create lead:", error)
    throw new Error("Database connection failed. Please check your Supabase configuration.")
  }
}

/**
 * Create a general inquiry (for contact forms, property inquiries, etc.)
 */
export async function createInquiry(inquiryData: {
  name: string
  email: string
  phone: string
  company?: string
  message?: string
  inquiry_type: string
  property_id?: string
  source?: string
  page_captured?: string
}): Promise<{
  user: User
  inquiry: any
}> {
  try {
    console.log("Creating inquiry with data:", inquiryData)

    // 1. Create or update user record
    const user = await createOrUpdateUser({
      email: inquiryData.email,
      full_name: inquiryData.name,
      phone: inquiryData.phone,
      company_name: inquiryData.company,
      lead_source: inquiryData.source || inquiryData.inquiry_type,
    })

    // 2. Create inquiry record
    const { data: inquiry, error: inquiryError } = await supabase
      .from("lss_inquiries")
      .insert([
        {
          user_id: user.id,
          property_id: inquiryData.property_id,
          inquiry_type: inquiryData.inquiry_type,
          full_name: inquiryData.name,
          email: inquiryData.email,
          phone: inquiryData.phone,
          company_name: inquiryData.company,
          message: inquiryData.message || `Inquiry from ${inquiryData.source || inquiryData.inquiry_type}`,
          status: "new",
        },
      ])
      .select()
      .single()

    if (inquiryError) {
      console.error("Error creating inquiry:", inquiryError)
      throw inquiryError
    }

    console.log("Inquiry created successfully:", { user, inquiry })

    // 3. Send email notifications (non-blocking)
    try {
      // Send welcome email to user
      await sendWelcomeEmailClient({
        email: inquiryData.email,
        name: inquiryData.name,
      })
      console.log("Welcome email sent to:", inquiryData.email)

      // Send notification email to admin
      await sendLeadNotificationClient({
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
      })
      console.log("Admin inquiry notification sent")
    } catch (emailError) {
      console.error("Failed to send email notifications (non-critical):", emailError)
    }

    return { user, inquiry }
  } catch (error) {
    console.error("Failed to create inquiry:", error)
    throw new Error("Database connection failed. Please check your Supabase configuration.")
  }
}

/**
 * Get all leads with optional filters
 */
export async function getLeads(filters?: {
  status?: string
  source?: string
  limit?: number
}): Promise<Lead[]> {
  try {
    let query = supabase
      .from("lss_leads")
      .select("*")
      .order("created_at", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.source) {
      query = query.eq("source", filters.source)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching leads:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch leads:", error)
    return []
  }
}

/**
 * Get all users with optional filters
 */
export async function getUsers(filters?: {
  status?: string
  lead_source?: string
  limit?: number
}): Promise<User[]> {
  try {
    let query = supabase
      .from("lss_users")
      .select("*")
      .order("created_at", { ascending: false })

    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.lead_source) {
      query = query.eq("lead_source", filters.lead_source)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return []
  }
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("lss_users")
      .select("*")
      .eq("email", email)
      .single()

    if (error) {
      console.error("Error fetching user:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch user:", error)
    return null
  }
}

/**
 * Update lead status
 */
export async function updateLeadStatus(leadId: string, status: string, notes?: string): Promise<Lead> {
  try {
    const { data, error } = await supabase
      .from("lss_leads")
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .select()
      .single()

    if (error) {
      console.error("Error updating lead:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to update lead:", error)
    throw new Error("Database connection failed. Please check your Supabase configuration.")
  }
}

/**
 * Update user status
 */
export async function updateUserStatus(userId: string, status: string, notes?: string): Promise<User> {
  try {
    const { data, error } = await supabase
      .from("lss_users")
      .update({
        status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating user:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("Failed to update user:", error)
    throw new Error("Database connection failed. Please check your Supabase configuration.")
  }
}

/**
 * Get recent leads (last 24 hours)
 */
export async function getRecentLeads(hours: number = 24): Promise<Lead[]> {
  try {
    const cutoffDate = new Date()
    cutoffDate.setHours(cutoffDate.getHours() - hours)

    const { data, error } = await supabase
      .from("lss_leads")
      .select("*")
      .gte("created_at", cutoffDate.toISOString())
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching recent leads:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch recent leads:", error)
    return []
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{
  totalLeads: number
  totalUsers: number
  recentLeads: number
  totalInquiries: number
}> {
  try {
    // Get total leads count
    const { count: totalLeads } = await supabase
      .from("lss_leads")
      .select("*", { count: "exact", head: true })

    // Get total users count
    const { count: totalUsers } = await supabase
      .from("lss_users")
      .select("*", { count: "exact", head: true })

    // Get recent leads count (last 24 hours)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const { count: recentLeads } = await supabase
      .from("lss_leads")
      .select("*", { count: "exact", head: true })
      .gte("created_at", yesterday.toISOString())

    // Get total inquiries count
    const { count: totalInquiries } = await supabase
      .from("lss_inquiries")
      .select("*", { count: "exact", head: true })

    return {
      totalLeads: totalLeads || 0,
      totalUsers: totalUsers || 0,
      recentLeads: recentLeads || 0,
      totalInquiries: totalInquiries || 0,
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return {
      totalLeads: 0,
      totalUsers: 0,
      recentLeads: 0,
      totalInquiries: 0,
    }
  }
} 