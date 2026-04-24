export const SITE_URL = "https://leasesmallspace.com"
export const SITE_NAME = "LeaseSmallSpace"
export const BUSINESS_PHONE = "+1-720-989-8838"
export const BUSINESS_PHONE_DISPLAY = "(720) 989-8838"
export const BUSINESS_EMAIL = "info@leasesmallspace.com"

export const BUSINESS_ADDRESS = {
  street: "12360 W 49th Ave",
  locality: "Wheat Ridge",
  region: "CO",
  postalCode: "80033",
  country: "US",
} as const

// Parent organization is kept in structured data for corporate-ownership purposes only.
// The parent's public website is intentionally NOT linked from LeaseSmallSpace.com;
// the two brands operate as separate public-facing properties.
export const PARENT_ORG = {
  name: "SAMG LLC",
  alternateName: "Secure Asset Management Group",
} as const

export const SERVICE_AREA_CITIES = [
  "Denver",
  "Arvada",
  "Wheat Ridge",
  "Lakewood",
  "Aurora",
  "Federal Heights",
  "Centennial",
  "Westminster",
  "Englewood",
  "Thornton",
  "Commerce City",
]

export const BUSINESS_HOURS = "Mo-Fr 08:00-18:00"

const organizationNode = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "LeaseSmallSpace.com",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo-green-pin-warehouse.png`,
    width: 512,
    height: 512,
  },
  description:
    "Colorado's small-bay industrial and warehouse leasing specialist. Move-in-ready spaces from 200-10,000 sq ft across the Denver metro.",
  foundingDate: "2023",
  parentOrganization: {
    "@type": "Organization",
    name: PARENT_ORG.name,
    alternateName: PARENT_ORG.alternateName,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: BUSINESS_PHONE,
      contactType: "customer service",
      areaServed: "US-CO",
      availableLanguage: "en",
    },
  ],
}

const localBusinessNode = {
  "@type": ["LocalBusiness", "RealEstateAgent"],
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/images/logo-green-pin-warehouse.png`,
  logo: `${SITE_URL}/images/logo-green-pin-warehouse.png`,
  telephone: BUSINESS_PHONE,
  email: BUSINESS_EMAIL,
  priceRange: "$$",
  description:
    "Small-bay warehouse, flex, and industrial space for rent across the Denver metro. 200-10,000 sq ft, move-in ready, transparent pricing.",
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS_ADDRESS.street,
    addressLocality: BUSINESS_ADDRESS.locality,
    addressRegion: BUSINESS_ADDRESS.region,
    postalCode: BUSINESS_ADDRESS.postalCode,
    addressCountry: BUSINESS_ADDRESS.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 39.7796,
    longitude: -105.0822,
  },
  areaServed: SERVICE_AREA_CITIES.map((city) => ({
    "@type": "City",
    name: city,
    containedInPlace: { "@type": "State", name: "Colorado" },
  })),
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  parentOrganization: {
    "@type": "Organization",
    name: PARENT_ORG.name,
    alternateName: PARENT_ORG.alternateName,
  },
}

export function siteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode, localBusinessNode],
  }
}

export function faqStructuredData(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export function articleStructuredData(args: {
  headline: string
  description: string
  canonicalPath: string
  datePublished?: string
  dateModified?: string
  image?: string
}) {
  const url = `${SITE_URL}${args.canonicalPath}`
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    image: args.image ? (args.image.startsWith("http") ? args.image : `${SITE_URL}${args.image}`) : undefined,
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  }
}

export function breadcrumbStructuredData(trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  }
}

type PropertyForSchema = {
  id: string
  title: string
  description?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  zip_code?: string | null
  latitude?: number | null
  longitude?: number | null
  size_sqft: number
  price_monthly: number
  lease_type?: string | null
  property_type?: string | null
  primary_image?: string | null
  additional_images?: string[] | null
  available_date?: string | null
  is_active?: boolean
}

export function propertyStructuredData(property: PropertyForSchema, canonicalUrl: string) {
  const images = [property.primary_image, ...(property.additional_images ?? [])]
    .filter(Boolean)
    .map((src) => {
      if (!src) return null
      if (src.startsWith("http")) return src
      return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`
    })
    .filter((s): s is string => Boolean(s))

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "RealEstateListing",
        "@id": `${canonicalUrl}#listing`,
        url: canonicalUrl,
        name: property.title,
        description: property.description ?? undefined,
        datePosted: property.available_date ?? undefined,
        image: images.length > 0 ? images : undefined,
        provider: { "@id": `${SITE_URL}/#business` },
        address: property.address
          ? {
              "@type": "PostalAddress",
              streetAddress: property.address,
              addressLocality: property.city ?? undefined,
              addressRegion: property.state ?? undefined,
              postalCode: property.zip_code ?? undefined,
              addressCountry: "US",
            }
          : undefined,
        geo:
          property.latitude && property.longitude
            ? {
                "@type": "GeoCoordinates",
                latitude: property.latitude,
                longitude: property.longitude,
              }
            : undefined,
        floorSize: {
          "@type": "QuantitativeValue",
          value: property.size_sqft,
          unitCode: "FTK",
        },
        offers: {
          "@type": "Offer",
          price: property.price_monthly,
          priceCurrency: "USD",
          availability:
            property.is_active === false
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: property.price_monthly,
            priceCurrency: "USD",
            unitText: "MONTH",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: 1,
              unitCode: "MON",
            },
          },
        },
        additionalProperty: property.lease_type
          ? [
              {
                "@type": "PropertyValue",
                name: "Lease type",
                value: property.lease_type,
              },
            ]
          : undefined,
      },
    ],
  }
}
