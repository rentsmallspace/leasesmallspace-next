/**
 * Client-side email service that calls the server-side API
 */

export interface EmailData {
  to: string | string[]
  subject: string
  template?: string
  html?: string
  data?: Record<string, any>
  from?: string
}

/**
 * Send email via server-side API
 */
export async function sendEmailClient(emailData: EmailData): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, id: result.id }
    } else {
      return { success: false, error: result.error || "Failed to send email" }
    }
  } catch (error) {
    console.error("Email client error:", error)
    return { success: false, error: "Network error" }
  }
}

/**
 * Send welcome email to user
 */
export async function sendWelcomeEmailClient(user: { email: string; name: string }): Promise<{ success: boolean; id?: string; error?: string }> {
  return sendEmailClient({
    to: user.email,
    subject: "Welcome to RentSmallSpace – Let's find your perfect space!",
    template: "welcome-lead",
    data: user,
  })
}

/**
 * Send questionnaire confirmation email
 */
export async function sendQuestionnaireConfirmationClient(user: { email: string; name: string }, responses: Record<string, any>): Promise<{ success: boolean; id?: string; error?: string }> {
  return sendEmailClient({
    to: user.email,
    subject: "We've received your questionnaire – Next steps inside",
    template: "questionnaire-completion",
    data: { ...user, ...responses },
  })
}

/**
 * Send lead notification to admin
 */
export async function sendLeadNotificationClient(lead: {
  name: string
  email: string
  phone?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  return sendEmailClient({
    to: "admin@rentsmallspace.com",
    subject: `New Lead – ${lead.name}`,
    template: "new-lead-notification",
    data: lead,
  })
} 