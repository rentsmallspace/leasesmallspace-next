import type { Metadata } from "next"
import NNNLeaseGuideView from "@/components/nnn-lease-guide/nnn-lease-guide-view"
import { articleStructuredData } from "@/lib/seo"

export const metadata: Metadata = {
  title: "NNN Lease Guide | How Triple Net Leases Work in Denver, CO",
  description:
    "Plain-English guide to NNN (triple net) leases for small warehouse and commercial space in Denver. What NNN covers, how it's calculated, quarterly reconciliations, and what to expect.",
  alternates: {
    canonical: "/nnn-lease-guide",
  },
}

const jsonLd = articleStructuredData({
  headline: "NNN Lease Guide: How Triple Net Leases Work in Denver",
  description:
    "Plain-English explanation of triple net (NNN) commercial leases, how base rent and NNN expenses are calculated, and what small-business tenants should expect.",
  canonicalPath: "/nnn-lease-guide",
  datePublished: "2026-01-01",
  image: "/og-image.png",
})

export default function NNNLeaseGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NNNLeaseGuideView />
    </>
  )
}
