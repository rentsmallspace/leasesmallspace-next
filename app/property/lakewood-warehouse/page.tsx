import type { Metadata } from "next"
import PropertyDetails from "@/components/property/property-details"
import { getPropertyBySlug } from "@/lib/properties"

export const metadata: Metadata = {
  title: "1,850 sq ft Industrial Warehouse - Lakewood, CO | LeaseSmallSpace.com",
  description:
    "Premium 1,850 sq ft warehouse space in Lakewood, Colorado. Features driving door, 200 amp 3-phase power, outdoor storage. Available now for $3,000/month.",
  keywords:
    "warehouse space lakewood colorado, industrial space rental, 1850 sqft warehouse, colorado commercial real estate",
}

export default async function LakewoodWarehousePage() {
  // Get the Lakewood warehouse property by searching for Lakewood city
  const property = await getPropertyBySlug("lakewood")
  
  if (!property) {
    throw new Error("Lakewood warehouse property not found")
  }

  return <PropertyDetails propertyId={property.id} />
}
