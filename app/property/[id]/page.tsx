import type { Metadata } from "next"
import { notFound } from "next/navigation"
import PropertyDetails from "@/components/property/property-details"
import { getPropertyById, getPropertyBySlug } from "@/lib/properties"

interface PropertyPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { id } = await params
  
  // Try to get property by ID first (UUID), then by slug
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

  return {
    title: `${property.size_sqft.toLocaleString()} sq ft ${property.property_type} - ${property.city}, ${property.state} | LeaseSmallSpace.com`,
    description: `${property.description}. Available now for $${property.price_monthly.toLocaleString()}/month.`,
    keywords: `${property.property_type.toLowerCase()} space ${property.city.toLowerCase()} ${property.state.toLowerCase()}, commercial real estate, ${property.size_sqft} sqft property`,
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  
  // Try to get property by ID first (UUID), then by slug
  let property = await getPropertyById(id)
  if (!property) {
    property = await getPropertyBySlug(id)
  }
  
  if (!property) {
    notFound()
  }

  return <PropertyDetails propertyId={property.id} />
}
