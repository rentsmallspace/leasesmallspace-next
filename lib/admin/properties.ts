"use server"

import { createClient } from "@/utils/supabase/server"

export interface Property {
  id: string
  title: string
  description?: string
  address: string
  city: string
  state?: string
  zip_code?: string
  latitude?: number
  longitude?: number
  property_type: string
  size_sqft: number
  price_monthly: number
  lease_type?: string
  nnn_monthly?: number
  available_date?: string
  features?: string[]
  images?: string[]
  deal_score?: string
  is_active?: boolean
  created_at: string
  updated_at: string
  primary_image?: string
  additional_images?: string[]
  clear_height?: number
  loading_doors?: number
  power_service?: string
  flooring_type?: string
  lighting_type?: string
  hvac_type?: string
  parking_spaces?: number
  outdoor_storage?: boolean
  neighborhood?: string
  nearby_highways?: string[]
  distance_to_downtown?: number
  public_transit?: boolean
  lease_term?: string
  deposit_requirements?: string
  utilities_responsibility?: string
  maintenance_responsibility?: string
  insurance_requirements?: string
  is_featured?: boolean
}

export interface CreatePropertyData {
  title: string
  description?: string
  address: string
  city: string
  state?: string
  zip_code?: string
  latitude?: number
  longitude?: number
  property_type: string
  size_sqft: number
  price_monthly: number
  lease_type?: string
  nnn_monthly?: number
  available_date?: string
  features?: string[]
  images?: string[]
  primary_image?: string
  additional_images?: string[]
  deal_score?: string
  is_active?: boolean
  clear_height?: number
  loading_doors?: number
  power_service?: string
  flooring_type?: string
  lighting_type?: string
  hvac_type?: string
  parking_spaces?: number
  outdoor_storage?: boolean
  neighborhood?: string
  nearby_highways?: string[]
  distance_to_downtown?: number
  public_transit?: boolean
  lease_term?: string
  deposit_requirements?: string
  utilities_responsibility?: string
  maintenance_responsibility?: string
  insurance_requirements?: string
  is_featured?: boolean
}

export interface UpdatePropertyData extends Partial<CreatePropertyData> {
  id: string
}

export async function getProperties() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("lss_properties")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to fetch properties" }
  }
}

export async function getPropertyById(id: string) {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase.from("lss_properties").select("*").eq("id", id).single()
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to fetch property by ID" }
  }
}

export async function createProperty(propertyData: CreatePropertyData) {
  const supabase = await createClient()
  try {
    if (propertyData.size_sqft && (propertyData.size_sqft > 999999 || propertyData.size_sqft < 1))
      return { error: "Size must be between 1 and 999,999 square feet" }
    if (propertyData.price_monthly && (propertyData.price_monthly > 999999.99 || propertyData.price_monthly < 0))
      return { error: "Monthly price must be between $0 and $999,999.99" }
    if (propertyData.latitude && (propertyData.latitude < -90 || propertyData.latitude > 90))
      return { error: "Latitude must be between -90 and 90 degrees" }
    if (propertyData.longitude && (propertyData.longitude < -180 || propertyData.longitude > 180))
      return { error: "Longitude must be between -180 and 180 degrees" }
    const { data, error } = await supabase.from("lss_properties").insert([propertyData]).select().single()
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to create property" }
  }
}

export async function updateProperty(propertyData: UpdatePropertyData) {
  const supabase = await createClient()
  try {
    const { id, ...rest } = propertyData
    if (rest.size_sqft && (rest.size_sqft > 999999 || rest.size_sqft < 1))
      return { error: "Size must be between 1 and 999,999 square feet" }
    if (rest.price_monthly && (rest.price_monthly > 999999.99 || rest.price_monthly < 0))
      return { error: "Monthly price must be between $0 and $999,999.99" }
    if (rest.latitude && (rest.latitude < -90 || rest.latitude > 90))
      return { error: "Latitude must be between -90 and 90 degrees" }
    if (rest.longitude && (rest.longitude < -180 || rest.longitude > 180))
      return { error: "Longitude must be between -180 and 180 degrees" }
    const updateData: Record<string, unknown> = { ...rest }
    if (propertyData.images !== undefined) updateData.images = propertyData.images
    if (propertyData.primary_image !== undefined) updateData.primary_image = propertyData.primary_image ?? ""
    if (propertyData.additional_images !== undefined) updateData.additional_images = propertyData.additional_images ?? []
    const { data, error } = await supabase.from("lss_properties").update(updateData).eq("id", id).select().single()
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to update property" }
  }
}

export async function deleteProperty(id: string) {
  const supabase = await createClient()
  try {
    const { error } = await supabase.from("lss_properties").delete().eq("id", id)
    if (error) return { error: error.message }
    return { success: true }
  } catch (error) {
    return { error: "Failed to delete property" }
  }
}

export async function getPropertyCount() {
  const supabase = await createClient()
  try {
    const { count, error } = await supabase.from("lss_properties").select("*", { count: "exact", head: true })
    if (error) return { error: error.message }
    return { count }
  } catch (error) {
    return { error: "Failed to fetch property count" }
  }
}

export async function getActiveProperties() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase
      .from("lss_properties")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    if (error) return { error: error.message }
    return { data }
  } catch (error) {
    return { error: "Failed to fetch active properties" }
  }
}
