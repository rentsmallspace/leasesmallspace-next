import { supabase } from "./supabase"

export interface Property {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  latitude?: number
  longitude?: number
  property_type: string
  size_sqft: number
  price_monthly: number
  price_sqft: number
  lease_type?: string
  available_date?: string
  features: string[]
  images: string[]
  primary_image?: string
  additional_images?: string[]
  deal_score?: string
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  
  // New property detail fields
  clear_height?: string
  loading_doors?: string
  power_service?: string
  flooring_type?: string
  lighting_type?: string
  hvac_type?: string
  parking_spaces?: number
  outdoor_storage?: string
  neighborhood?: string
  nearby_highways?: string[]
  distance_to_downtown?: string
  public_transit?: string
  lease_term?: string
  deposit_requirements?: string
  utilities_responsibility?: string
  maintenance_responsibility?: string
  insurance_requirements?: string
  amenities?: Array<{
    icon: string
    label: string
    description: string
  }>
}

export interface PropertyFilters {
  city?: string
  property_type?: string
  min_price?: number
  max_price?: number
  min_size?: number
  max_size?: number
  is_active?: boolean
}

/**
 * Get all properties with optional filters
 */
export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  try {
    let query = supabase
      .from("lss_properties")
      .select("*")
      .order("created_at", { ascending: false })

    // Apply filters
    if (filters?.is_active !== undefined) {
      query = query.eq("is_active", filters.is_active)
    } else {
      // Default to active properties only
      query = query.eq("is_active", true)
    }

    if (filters?.city) {
      query = query.ilike("city", `%${filters.city}%`)
    }

    if (filters?.property_type) {
      query = query.eq("property_type", filters.property_type)
    }

    if (filters?.min_price) {
      query = query.gte("price_monthly", filters.min_price)
    }

    if (filters?.max_price) {
      query = query.lte("price_monthly", filters.max_price)
    }

    if (filters?.min_size) {
      query = query.gte("size_sqft", filters.min_size)
    }

    if (filters?.max_size) {
      query = query.lte("size_sqft", filters.max_size)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching properties:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch properties:", error)
    return []
  }
}

/**
 * Get a single property by ID
 */
export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const { data, error } = await supabase
      .from("lss_properties")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single()

    if (error) {
      console.error("Error fetching property:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch property:", error)
    return null
  }
}

/**
 * Get featured properties (for homepage showcase)
 */
export async function getFeaturedProperties(limit: number = 6): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("lss_properties")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching featured properties:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch featured properties:", error)
    return []
  }
}

/**
 * Get available properties (non-featured, for property showcase)
 */
export async function getAvailableProperties(limit: number = 6): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("lss_properties")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", false)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching available properties:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch available properties:", error)
    return []
  }
}

/**
 * Search properties by text (title, description, address)
 */
export async function searchProperties(searchTerm: string, filters?: PropertyFilters): Promise<Property[]> {
  try {
    let query = supabase
      .from("lss_properties")
      .select("*")
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    // Apply additional filters
    if (filters?.city) {
      query = query.ilike("city", `%${filters.city}%`)
    }

    if (filters?.property_type) {
      query = query.eq("property_type", filters.property_type)
    }

    if (filters?.min_price) {
      query = query.gte("price_monthly", filters.min_price)
    }

    if (filters?.max_price) {
      query = query.lte("price_monthly", filters.max_price)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error searching properties:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to search properties:", error)
    return []
  }
}

/**
 * Get properties by city
 */
export async function getPropertiesByCity(city: string): Promise<Property[]> {
  try {
    const { data, error } = await supabase
      .from("lss_properties")
      .select("*")
      .ilike("city", `%${city}%`)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching properties by city:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Failed to fetch properties by city:", error)
    return []
  }
}

/**
 * Get a single property by slug (title converted to URL-friendly format)
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    // Convert slug back to title format (e.g., "lakewood-warehouse" -> "Lakewood Warehouse")
    const title = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    // Try to find by title first
    let { data, error } = await supabase
      .from("lss_properties")
      .select("*")
      .ilike("title", `%${title}%`)
      .eq("is_active", true)
      .single()

    // If not found by title, try by city
    if (error || !data) {
      const city = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      const result = await supabase
        .from("lss_properties")
        .select("*")
        .ilike("city", `%${city}%`)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      data = result.data
      error = result.error
    }

    if (error) {
      console.error("Error fetching property by slug:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Failed to fetch property by slug:", error)
    return null
  }
}

/**
 * Generate a URL-friendly slug from a property title or city
 */
export function generatePropertySlug(title: string, city: string): string {
  // Create a slug from the city name (more reliable than title)
  return city.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Get unique cities that have properties
 */
export async function getPropertyCities(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("lss_properties")
      .select("city")
      .eq("is_active", true)
      .not("city", "is", null)

    if (error) {
      console.error("Error fetching property cities:", error)
      return []
    }

    // Extract unique cities
    const cities = [...new Set(data?.map(p => p.city).filter(Boolean) || [])]
    return cities.sort()
  } catch (error) {
    console.error("Failed to fetch property cities:", error)
    return []
  }
} 