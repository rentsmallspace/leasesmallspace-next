import { supabase } from "./supabase"
import { createOrUpdateUser } from "./leads"
import { sendQuestionnaireConfirmationClient, sendLeadNotificationClient } from "./email-client"

export interface QuestionnaireResponse {
  id: string
  user_id?: string
  inquiry_id?: string
  responses: Record<string, any>
  completed_at?: string
  created_at: string
}

export interface CreateQuestionnaireData {
  responses: Record<string, any>
  userInfo: {
    name: string
    email: string
    phone: string
    smsConsent?: boolean
  }
}

export interface Inquiry {
  id: string
  user_id?: string
  property_id?: string
  inquiry_type: string
  full_name: string
  email: string
  phone: string
  message?: string
  status: string
  created_at: string
  updated_at: string
}

/**
 * Save questionnaire response and create associated user/inquiry records
 */
export async function saveQuestionnaireResponse(data: CreateQuestionnaireData): Promise<{
  questionnaireResponse: QuestionnaireResponse
  user: any
  inquiry: Inquiry
}> {
  try {
    console.log("Saving questionnaire response with data:", data)

    // 1. Create or update user record
    const user = await createOrUpdateUser({
      email: data.userInfo.email,
      full_name: data.userInfo.name,
      phone: data.userInfo.phone,
      lead_source: "questionnaire",
    })

    // 2. Create inquiry record
    const { data: inquiryData, error: inquiryError } = await supabase
      .from("lss_inquiries")
      .insert([
        {
          user_id: user.id,
          inquiry_type: "questionnaire",
          full_name: data.userInfo.name,
          email: data.userInfo.email,
          phone: data.userInfo.phone,
          message: `Questionnaire completed: ${data.responses.spaceType || "Unknown space type"} in ${data.responses.location || "Unknown location"}`,
          status: "new",
        },
      ])
      .select()
      .single()

    if (inquiryError) {
      console.error("Error creating inquiry:", inquiryError)
      throw inquiryError
    }

    // 3. Save questionnaire response
    const { data: responseData, error: responseError } = await supabase
      .from("lss_questionnaire_responses")
      .insert([
        {
          user_id: user.id,
          inquiry_id: inquiryData.id,
          responses: data.responses,
          completed_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (responseError) {
      console.error("Error saving questionnaire response:", responseError)
      throw responseError
    }

    console.log("Questionnaire response saved successfully:", {
      questionnaireResponse: responseData,
      user,
      inquiry: inquiryData,
    })

    // 4. Track analytics event (commented out for now)
    /*
    try {
      await supabase.from("lss_analytics_events").insert({
        event_name: "questionnaire_completed",
        event_properties: {
          lease_or_buy: data.responses.leaseOrBuy,
          space_type: data.responses.spaceType,
          size: data.responses.size,
          location: data.responses.location,
          budget: data.responses.budget,
          timeline: data.responses.timeline,
          sms_consent: data.userInfo.smsConsent,
        },
        user_id: user.id,
        page_url: "/questionnaire",
        user_agent: "questionnaire_submission",
      })
      console.log("Analytics event tracked successfully")
    } catch (analyticsError) {
      console.error("Analytics tracking failed (non-critical):", analyticsError)
    }
    */

    // 5. Send email notifications
    try {
      // Send confirmation email to user
      await sendQuestionnaireConfirmationClient(
        { email: data.userInfo.email, name: data.userInfo.name },
        data.responses
      )
      console.log("Questionnaire confirmation email sent to:", data.userInfo.email)

      // Send notification email to admin
      await sendLeadNotificationClient({
        name: data.userInfo.name,
        email: data.userInfo.email,
        phone: data.userInfo.phone,
      })
      console.log("Admin questionnaire notification sent")
    } catch (emailError) {
      console.error("Failed to send email notifications (non-critical):", emailError)
    }

    return {
      questionnaireResponse: responseData,
      user,
      inquiry: inquiryData,
    }
  } catch (error) {
    console.error("Failed to save questionnaire response:", error)
    throw new Error("Database connection failed. Please check your Supabase configuration.")
  }
}

/**
 * Get questionnaire responses with optional filters
 */
export async function getQuestionnaireResponses(filters?: {
  user_id?: string
  inquiry_id?: string
  limit?: number
}): Promise<QuestionnaireResponse[]> {
  try {
    let query = supabase
      .from("lss_questionnaire_responses")
      .select("*")
      .order("created_at", { ascending: false })

    if (filters?.user_id) {
      query = query.eq("user_id", filters.user_id)
    }
    if (filters?.inquiry_id) {
      query = query.eq("inquiry_id", filters.inquiry_id)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching questionnaire responses:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch questionnaire responses:", error)
    return []
  }
}

/**
 * Get questionnaire responses by space type
 */
export async function getQuestionnaireResponsesBySpaceType(spaceType: string): Promise<QuestionnaireResponse[]> {
  try {
    const { data, error } = await supabase
      .from("lss_questionnaire_responses")
      .select("*")
      .eq("responses->>spaceType", spaceType)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching questionnaire responses by space type:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch questionnaire responses by space type:", error)
    return []
  }
}

/**
 * Get questionnaire responses by location
 */
export async function getQuestionnaireResponsesByLocation(location: string): Promise<QuestionnaireResponse[]> {
  try {
    const { data, error } = await supabase
      .from("lss_questionnaire_responses")
      .select("*")
      .eq("responses->>location", location)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching questionnaire responses by location:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch questionnaire responses by location:", error)
    return []
  }
}

/**
 * Search questionnaire responses by JSONB content
 */
export async function searchQuestionnaireResponses(searchTerm: string): Promise<QuestionnaireResponse[]> {
  try {
    const { data, error } = await supabase
      .from("lss_questionnaire_responses")
      .select("*")
      .or(`responses->>'spaceType'.ilike.%${searchTerm}%,responses->>'location'.ilike.%${searchTerm}%,responses->>'budget'.ilike.%${searchTerm}%`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error searching questionnaire responses:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to search questionnaire responses:", error)
    return []
  }
}

/**
 * Get questionnaire statistics
 */
export async function getQuestionnaireStats(): Promise<{
  totalResponses: number
  completedToday: number
  topSpaceTypes: Array<{ spaceType: string; count: number }>
  topLocations: Array<{ location: string; count: number }>
}> {
  try {
    // Get total responses
    const { count: totalResponses } = await supabase
      .from("lss_questionnaire_responses")
      .select("*", { count: "exact", head: true })

    // Get responses completed today
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { count: completedToday } = await supabase
      .from("lss_questionnaire_responses")
      .select("*", { count: "exact", head: true })
      .gte("completed_at", today.toISOString())

    // Get top space types (this would need a more complex query in production)
    const { data: spaceTypeData } = await supabase
      .from("lss_questionnaire_responses")
      .select("responses->>spaceType")
      .not("responses->>spaceType", "is", null)

    const spaceTypeCounts = spaceTypeData?.reduce((acc: any, item: any) => {
      const spaceType = item.spaceType
      acc[spaceType] = (acc[spaceType] || 0) + 1
      return acc
    }, {})

    const topSpaceTypes = Object.entries(spaceTypeCounts || {})
      .map(([spaceType, count]) => ({ spaceType, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    // Get top locations
    const { data: locationData } = await supabase
      .from("lss_questionnaire_responses")
      .select("responses->>location")
      .not("responses->>location", "is", null)

    const locationCounts = locationData?.reduce((acc: any, item: any) => {
      const location = item.location
      acc[location] = (acc[location] || 0) + 1
      return acc
    }, {})

    const topLocations = Object.entries(locationCounts || {})
      .map(([location, count]) => ({ location, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalResponses: totalResponses || 0,
      completedToday: completedToday || 0,
      topSpaceTypes,
      topLocations,
    }
  } catch (error) {
    console.error("Failed to fetch questionnaire stats:", error)
    return {
      totalResponses: 0,
      completedToday: 0,
      topSpaceTypes: [],
      topLocations: [],
    }
  }
}

/**
 * Get all inquiries
 */
export async function getInquiries(filters?: {
  user_id?: string
  property_id?: string
  inquiry_type?: string
  status?: string
  limit?: number
}): Promise<Inquiry[]> {
  try {
    let query = supabase
      .from("lss_inquiries")
      .select("*")
      .order("created_at", { ascending: false })

    if (filters?.user_id) {
      query = query.eq("user_id", filters.user_id)
    }
    if (filters?.property_id) {
      query = query.eq("property_id", filters.property_id)
    }
    if (filters?.inquiry_type) {
      query = query.eq("inquiry_type", filters.inquiry_type)
    }
    if (filters?.status) {
      query = query.eq("status", filters.status)
    }
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching inquiries:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch inquiries:", error)
    return []
  }
} 