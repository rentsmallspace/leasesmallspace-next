import { supabase } from "./supabase"

export interface Property {
  id: string
  title: string
  description: string
  address: string
  city: string
  state: string
  zip_code: string
  property_type: string
  size_sqft: number
  price_monthly: number
  price_sqft: number
  features: string[]
  images: string[]
  primary_image?: string
  additional_images?: string[]
  is_active: boolean
  created_at: string
  updated_at: string
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