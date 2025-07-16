import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface EmailData {
  to: string | string[]
  subject: string
  template?: keyof typeof emailTemplates
  html?: string
  data?: Record<string, any>
  from?: string
}

/* -------------------------------------------------------------------------- */
/*  Templates                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * A catalogue of all HTML email templates.
 * Each template is a function that accepts dynamic `data` and returns an HTML string.
 */
export const emailTemplates = {
  "welcome-lead": (data: any = {}) => `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: Arial, sans-serif">
        <h1 style="color:#2563eb">Welcome to LeaseSmallSpace, ${data.name ?? "there"}!</h1>
        <p>Thank you for your interest in our industrial properties.</p>
        <p>We'll be in touch shortly to match you with the perfect space.</p>
      </body>
    </html>
  `,

  "questionnaire-completion": (data: any = {}) => `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: Arial, sans-serif">
        <h1 style="color:#15803d">Questionnaire Received</h1>
        <p>Hi ${data.name ?? "there"}, thank you for submitting your requirements.</p>
        <p>Our team is reviewing them and will reach out within 24 hours.</p>
      </body>
    </html>
  `,

  "new-lead-notification": (data: any = {}) => `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: Arial, sans-serif">
        <h2>🚨 New Lead Alert</h2>
        <ul>
          <li><strong>Name:</strong> ${data.name}</li>
          <li><strong>Email:</strong> ${data.email}</li>
          <li><strong>Phone:</strong> ${data.phone ?? "N/A"}</li>
        </ul>
      </body>
    </html>
  `,
} satisfies Record<string, (data?: any) => string>

/* -------------------------------------------------------------------------- */
/*  Generic Send                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Low-level email sender that all helper functions delegate to.
 */
export async function sendEmail({
  to,
  subject,
  template,
  html,
  data = {},
  from = "LeaseSmallSpace <noreply@leasesmallspace.com>",
}: EmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY missing – cannot send email")
    return { success: false, message: "Email service not configured" }
  }

  // Resolve HTML
  const resolvedHtml = html ?? (template ? emailTemplates[template]?.(data) : "<p>No content supplied.</p>")

  try {
    const result = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: resolvedHtml,
    })
    console.log("Email sent:", result)
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}

/* -------------------------------------------------------------------------- */
/*  Helper Wrappers                                                           */
/* -------------------------------------------------------------------------- */

export function sendWelcomeEmail(user: { email: string; name: string }) {
  return sendEmail({
    to: user.email,
    subject: "Welcome to LeaseSmallSpace – Let’s find your perfect space!",
    template: "welcome-lead",
    data: user,
  })
}

export function sendQuestionnaireConfirmation(user: { email: string; name: string }, responses: Record<string, any>) {
  return sendEmail({
    to: user.email,
    subject: "We’ve received your questionnaire – Next steps inside",
    template: "questionnaire-completion",
    data: { ...user, ...responses },
  })
}

export function sendLeadNotification(lead: {
  name: string
  email: string
  phone?: string
}) {
  return sendEmail({
    to: "admin@leasesmallspace.com",
    subject: `New Lead – ${lead.name}`,
    template: "new-lead-notification",
    data: lead,
  })
}

/* -------------------------------------------------------------------------- */
/*  Manual test helper                                                        */
/* -------------------------------------------------------------------------- */

export async function sendTestEmail(
  email: string,
  name = "Friend",
  type: "welcome" | "questionnaire" | "plain" = "plain",
) {
  switch (type) {
    case "welcome":
      return sendWelcomeEmail({ email, name })
    case "questionnaire":
      return sendQuestionnaireConfirmation({ email, name }, {})
    default:
      return sendEmail({
        to: email,
        subject: "Test Email from LeaseSmallSpace",
        html: `<p>Hello ${name}! This is a plain test email.</p>`,
      })
  }
}
