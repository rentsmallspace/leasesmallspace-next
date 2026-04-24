import type { MetadataRoute } from "next"
import { getProperties } from "@/lib/properties"
import { SITE_URL } from "@/lib/seo"

export const revalidate = 3600 // regenerate hourly

const staticPages: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/questionnaire", priority: 0.9, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/nnn-lease-guide", priority: 0.7, changeFrequency: "monthly" },
  { path: "/why-rent-small-space", priority: 0.7, changeFrequency: "monthly" },
  { path: "/results", priority: 0.5, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  let propertyEntries: MetadataRoute.Sitemap = []
  try {
    const properties = await getProperties({ is_active: true })
    propertyEntries = properties.map((property) => ({
      url: `${SITE_URL}/property/${property.id}`,
      lastModified: property.updated_at ? new Date(property.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    }))
  } catch (error) {
    console.error("Sitemap: failed to fetch properties", error)
  }

  return [...staticEntries, ...propertyEntries]
}
