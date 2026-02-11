/**
 * Supabase Storage helpers for property images.
 * Assumes a public bucket "property-images" with files keyed by path (e.g. lakewood-warehouse.jpg).
 */

const STORAGE_BUCKET = "property-images";

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_SUPABASE_URL is not set");
    return "";
  }
  return url.replace(/\/$/, "");
}

/**
 * Returns the public URL for a file in the property-images bucket.
 * Path should be relative to bucket root (e.g. "lakewood-warehouse.jpg").
 */
export function getStoragePublicUrl(path: string): string {
  const base = getSupabaseUrl();
  if (!base) return "";
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${encoded}`;
}

// Property image keys (same as previous Cloudinary public IDs) → storage path in bucket
export const propertyImagePaths: Record<string, string> = {
  "lakewood-warehouse": "lakewood-warehouse.jpg",
  "northglenn-warehouse": "northglenn-warehouse-units.jpg",
  "boulder-aerial-facility": "boulder-aerial-facility.jpg",
  "brighton-flex-space": "brighton-flex-space.jpg",
  "broomfield-flex-space": "broomfield-flex-space.jpg",
  "golden-flex-space": "golden-flex-space.jpg",
  "north-denver-warehouse": "north-denver-warehouse.jpg",
  "retail-centennial": "retail-centennial.jpg",
  "11450-n-cherokee-st-northglenn": "11450-n-cherokee-st-northglenn.jpg",
  // Allow DB to store Cloudinary-style suffix; we strip or map as needed
  "retail-centennial_ltacwi": "retail-centennial.jpg",
  "lakewood-warehouse_prqnva": "lakewood-warehouse.jpg",
};

export type PropertyImageKey = keyof typeof propertyImagePaths;

/**
 * Returns the public Supabase Storage URL for a property image by key.
 * Use for fallbacks and when you have a known key (e.g. from primary_image).
 */
export function getPropertyImage(key: PropertyImageKey | string): string {
  const path = propertyImagePaths[key as PropertyImageKey] ?? (key as string);
  // If it looks like a path (has extension or slash), use as path; else treat as filename
  const storagePath = path.includes("/") || path.includes(".") ? path : `${path}.jpg`;
  return getStoragePublicUrl(storagePath);
}

/**
 * Resolves an image source to a full URL.
 * - If it's already a full URL (http/https), return as-is.
 * - If it's a property image key, return Supabase URL.
 * - If it's a storage path (e.g. "folder/file.jpg"), return Supabase public URL.
 * - Otherwise return the string as-is (e.g. /placeholder.svg).
 */
export function getStorageImageUrl(src: string): string {
  if (!src) return "";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) return src; // local path
  // Supabase storage path style
  if (src.includes("supabase") && src.includes("/storage/")) return src;
  // Property image key (with or without suffix like _ltacwi)
  const url = getPropertyImage(src);
  if (url) return url;
  // Treat as path in bucket (e.g. "some-image.jpg")
  return getStoragePublicUrl(src.includes(".") ? src : `${src}.jpg`);
}

export const storageConfig = {
  bucket: STORAGE_BUCKET,
};
