import type { Metadata } from "next"
import WhyRentSmallSpacesView from "@/components/why-rent-small-spaces/why-rent-small-spaces-view"
import { articleStructuredData } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Why Lease Small Space? | Warehouse, Flex & Industrial in Denver, CO",
  description:
    "Why small warehouse, flex, and industrial space is the right fit for startups, contractors, and small businesses in the Denver metro. Affordable rents, fast move-in, flexible terms.",
  alternates: {
    canonical: "/why-rent-small-space",
  },
}

const jsonLd = articleStructuredData({
  headline: "Why Lease Small Space in Denver: Warehouse, Flex, and Industrial",
  description:
    "Overview of why small-bay warehouse, flex, and industrial space is ideal for startups, contractors, and small Denver-metro businesses.",
  canonicalPath: "/why-rent-small-space",
  datePublished: "2026-01-01",
  image: "/og-image.png",
})

export default function WhyRentSmallSpacePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WhyRentSmallSpacesView />
    </main>
  )
}
