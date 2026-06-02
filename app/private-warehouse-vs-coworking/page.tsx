import type { Metadata } from "next"
import PrivateWarehouseVsCoworkingView, {
  comparisonFaqs,
} from "@/components/comparison/private-warehouse-vs-coworking-view"
import { articleStructuredData, faqStructuredData, breadcrumbStructuredData } from "@/lib/seo"

const CANONICAL = "/private-warehouse-vs-coworking"

export const metadata: Metadata = {
  title: "Private Warehouse vs Co-Warehousing in Denver | Lower Cost Per Sq Ft",
  description:
    "Compare leasing your own private Denver warehouse to co-warehousing and shared space like WareSpace, Saltbox, and ReadySpaces. Your own loading, address, meter, 3-phase power, and a real lease. We beat any co-warehousing price per square foot.",
  keywords: [
    "private warehouse for rent Denver",
    "co-warehousing alternative Denver",
    "WareSpace alternative",
    "Saltbox alternative",
    "ReadySpaces alternative",
    "private warehouse vs co-warehousing",
    "shared warehouse vs private warehouse",
    "co-warehousing vs leasing",
    "small private warehouse Denver",
    "warehouse with my own loading dock",
    "month to month warehouse vs lease",
    "warehouse with 3-phase power Denver",
  ],
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "Private Warehouse vs Co-Warehousing in Denver | Lower Cost Per Sq Ft",
    description:
      "Your own standalone bay with your own loading, address, meter, and a real lease, for less than co-warehousing. We beat any co-warehousing price per square foot.",
    url: CANONICAL,
    type: "article",
  },
}

const articleJsonLd = articleStructuredData({
  headline: "Private Warehouse vs Co-Warehousing in Denver: Which Is Cheaper?",
  description:
    "A side-by-side comparison of leasing your own private standalone warehouse bay versus co-warehousing and shared space (WareSpace, Saltbox, ReadySpaces) in the Denver metro.",
  canonicalPath: CANONICAL,
  datePublished: "2026-06-01",
  image: "/og-image.png",
})

const faqJsonLd = faqStructuredData(comparisonFaqs)

const breadcrumbJsonLd = breadcrumbStructuredData([
  { name: "Home", path: "/" },
  { name: "Private Warehouse vs Co-Warehousing", path: CANONICAL },
])

export default function PrivateWarehouseVsCoworkingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PrivateWarehouseVsCoworkingView />
    </>
  )
}
