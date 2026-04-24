import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PropertyDetails from "@/components/property/property-details"
import { getPropertyById, getPropertyBySlug } from "@/lib/properties"
import { SITE_URL, propertyStructuredData, breadcrumbStructuredData } from "@/lib/seo"

interface PropertyPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params

  let property = await getPropertyById(id)
  if (!property) {
    property = await getPropertyBySlug(id)
  }

  if (!property) {
    return {
      title: "Property Not Found | LeaseSmallSpace.com",
      description: "The requested property could not be found.",
    }
  }

  const canonicalPath = `/property/${property.id}`

  return {
    title: `${property.size_sqft.toLocaleString()} sq ft ${property.property_type} - ${property.city}, ${property.state} | LeaseSmallSpace.com`,
    description: `${property.description}. Available now for $${property.price_monthly.toLocaleString()}/mo${property.lease_type?.toUpperCase().includes("NNN") ? " NNN" : property.lease_type ? ` ${property.lease_type}` : " NNN"}.`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${property.size_sqft.toLocaleString()} sq ft ${property.property_type} - ${property.city}, ${property.state}`,
      description: property.description ?? undefined,
      url: `${SITE_URL}${canonicalPath}`,
      type: "website",
    },
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params

  let property = await getPropertyById(id)
  if (!property) {
    property = await getPropertyBySlug(id)
  }

  if (!property) {
    notFound()
  }

  const canonicalUrl = `${SITE_URL}/property/${property.id}`
  const jsonLd = propertyStructuredData(property, canonicalUrl)
  const breadcrumb = breadcrumbStructuredData([
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    {
      name: property.city ? `${property.city}, ${property.state ?? "CO"}` : property.title,
      path: `/property/${property.id}`,
    },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <PropertyDetails propertyId={property.id} />
    </>
  )
}
