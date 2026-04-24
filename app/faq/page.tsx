import type { Metadata } from "next"
import FAQView from "@/components/faq/faq-view"
import { faqData } from "@/lib/faq-data"
import { faqStructuredData } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | LeaseSmallSpace.com",
  description:
    "Answers to common questions about renting small commercial space in Colorado. Warehouse, retail, flex, and shop spaces — pricing, NNN leases, availability, tours, move-in timing.",
  alternates: {
    canonical: "/faq",
  },
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData(faqData)) }}
      />
      <FAQView />
    </>
  )
}
