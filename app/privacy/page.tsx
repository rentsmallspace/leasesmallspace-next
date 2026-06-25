import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | LeaseSmallSpace.com",
  description: "Privacy Policy for LeaseSmallSpace.com, operated by Dock and Bay LLC.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Effective date: June 25, 2026</p>

          <p>
            LeaseSmallSpace.com ("LeaseSmallSpace," "we," "us," or "our") is operated by{" "}
            <strong>Dock and Bay LLC</strong>, a licensed Colorado real estate brokerage. This Privacy Policy explains
            what information we collect, how we use it, how we share it, and the choices you have.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Information you provide.</strong> When you complete our questionnaire, submit a contact or
              property-inquiry form, or call or text us, we collect your name, email address, phone number, and details
              about the space you are seeking (such as size, location, budget, and timeline).
            </li>
            <li>
              <strong>Information collected automatically.</strong> When you use our site we collect device and usage
              data such as IP address, browser type, pages viewed, referring URLs, and on-site interactions, using
              cookies and similar technologies.
            </li>
          </ul>

          <h2>2. Cookies and Tracking Technologies</h2>
          <p>We use cookies, pixels, and tags, including:</p>
          <ul>
            <li>
              the <strong>Meta (Facebook) Pixel</strong> and the <strong>Meta Conversions API</strong>, which share
              certain website-event and contact data with Meta to measure and target advertising;
            </li>
            <li>
              <strong>Google Ads</strong> conversion tracking and <strong>Google Analytics (GA4)</strong>, which share
              usage and conversion data with Google.
            </li>
          </ul>
          <p>
            These tools may set cookies and collect identifiers to measure ad performance and to show you relevant ads
            on other sites and platforms.
          </p>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Respond to your inquiries and match you with available spaces;</li>
            <li>Contact you by phone, email, and (with your consent) SMS about your request and available spaces;</li>
            <li>Measure, operate, secure, and improve our site and advertising;</li>
            <li>Comply with law and protect our rights.</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <ul>
            <li>
              <strong>Advertising and analytics partners.</strong> We share certain data with <strong>Meta</strong> and{" "}
              <strong>Google</strong> as described in Section 2 to measure and deliver advertising. Under California law,
              sharing for cross-context behavioral advertising may be considered a "sale" or "sharing" of personal
              information.
            </li>
            <li>
              <strong>Service providers.</strong> We use vendors that host our website and database and help us
              communicate with you. They may process your information only to provide services to us.
            </li>
            <li>
              <strong>We do not sell your personal information</strong> to real estate brokers or lead resellers.
            </li>
            <li>
              <strong>Legal.</strong> We may disclose information to comply with law or to protect rights and safety.
            </li>
          </ul>

          <h2>5. SMS / Text Messaging</h2>
          <p>
            If you opt in, you may receive transactional and, separately, promotional text messages from
            LeaseSmallSpace.com and SAMG LLC. Message frequency varies. Message and data rates may apply. Reply{" "}
            <strong>STOP</strong> to opt out and <strong>HELP</strong> for help. Consent to marketing texts is not a
            condition of any purchase or service. Your mobile opt-in and consent are never shared with third parties for
            their own marketing.
          </p>

          <h2>6. Your Choices and Privacy Rights</h2>
          <ul>
            <li>
              <strong>Cookies and ads.</strong> You can manage cookies in your browser, opt out of Google personalized
              ads at adssettings.google.com, and adjust your Meta ad preferences in your Meta settings.
            </li>
            <li>
              <strong>Do Not Sell or Share.</strong> California residents may opt out of the "sale"/"sharing" described
              in Section 4 by emailing us at info@leasesmallspace.com with the subject "Do Not Sell or Share."
            </li>
            <li>
              <strong>California (CCPA/CPRA).</strong> You have the right to know, access, correct, and delete your
              personal information, to opt out of sale or sharing, and not to be discriminated against for exercising
              these rights. Email info@leasesmallspace.com to make a request; we verify requests as required by law.
            </li>
            <li>
              <strong>SMS.</strong> Reply STOP to any message to opt out.
            </li>
          </ul>

          <h2>7. Data Retention</h2>
          <p>
            We keep personal information as long as needed to respond to your inquiry, provide services, and meet
            legitimate business and legal needs, then delete or de-identify it.
          </p>

          <h2>8. Data Security</h2>
          <p>
            We use reasonable administrative and technical safeguards to protect your information. No method of
            transmission or storage is 100% secure.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our site is not directed to children under 16, and we do not knowingly collect their personal information.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this policy and will revise the "Effective date" above. Material changes will be posted on this
            page.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            Dock and Bay LLC (LeaseSmallSpace.com)
            <br />
            Email:{" "}
            <a href="mailto:info@leasesmallspace.com" className="text-blue-600 hover:text-blue-800">
              info@leasesmallspace.com
            </a>
            <br />
            Phone:{" "}
            <a href="tel:+17209898838" className="text-blue-600 hover:text-blue-800">
              (720) 989-8838
            </a>
          </p>

          <p className="text-sm text-gray-500 mt-8">
            See also our{" "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-800">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
