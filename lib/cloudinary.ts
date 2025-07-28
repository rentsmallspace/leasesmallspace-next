import { CldImage } from 'next-cloudinary';

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
};

// Helper function to generate Cloudinary URLs
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'scale' | 'fit' | 'thumb';
    gravity?: 'auto' | 'center' | 'north' | 'south' | 'east' | 'west';
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.error('Cloudinary cloud name not configured');
    return '';
  }

  const transformations = [];
  
  if (options.width || options.height) {
    const crop = options.crop || 'fill';
    transformations.push(`${crop},w_${options.width || 'auto'},h_${options.height || 'auto'}`);
  }
  
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  }
  
  if (options.format) {
    transformations.push(`f_${options.format}`);
  }

  if (options.gravity) {
    transformations.push(`g_${options.gravity}`);
  }

  const transformationString = transformations.length > 0 ? transformations.join('/') + '/' : '';
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}${publicId}`;
}

// Helper function for responsive images
export function getResponsiveImageUrls(
  publicId: string,
  baseWidth: number = 800
): {
  sm: string;
  md: string;
  lg: string;
  xl: string;
} {
  return {
    sm: getCloudinaryUrl(publicId, { width: Math.round(baseWidth * 0.5), quality: 80 }),
    md: getCloudinaryUrl(publicId, { width: Math.round(baseWidth * 0.75), quality: 85 }),
    lg: getCloudinaryUrl(publicId, { width: baseWidth, quality: 90 }),
    xl: getCloudinaryUrl(publicId, { width: Math.round(baseWidth * 1.5), quality: 95 }),
  };
}

// Property image mappings - these will be the Cloudinary public IDs
export const propertyImages = {
  'lakewood-warehouse': 'lakewood-warehouse',
  'northglenn-warehouse': 'northglenn-warehouse',
  'boulder-aerial-facility': 'boulder-aerial-facility',
  'brighton-flex-space': 'brighton-flex-space',
  'broomfield-flex-space': 'broomfield-flex-space',
  'golden-flex-space': 'golden-flex-space',
  'north-denver-warehouse': 'north-denver-warehouse',
  'retail-centennial': 'retail-centennial_ltacwi',
  '11450-n-cherokee-st-northglenn': '11450-n-cherokee-st-northglenn',
} as const;

// Map static image paths to Cloudinary URLs
export const staticToCloudinaryMap: Record<string, string> = {
  '/images/lakewood-warehouse.jpg': getPropertyImage('lakewood-warehouse'),
  '/images/northglenn-warehouse-units.jpg': getPropertyImage('northglenn-warehouse'),
  '/images/boulder-aerial-facility.jpg': getPropertyImage('boulder-aerial-facility'),
  '/images/brighton-flex-space.jpg': getPropertyImage('brighton-flex-space'),
  '/images/broomfield-flex-space.jpg': getPropertyImage('broomfield-flex-space'),
  '/images/golden-flex-space.jpg': getPropertyImage('golden-flex-space'),
  '/images/north-denver-warehouse.jpg': getPropertyImage('north-denver-warehouse'),
  '/images/retail-centennial.jpg': getPropertyImage('retail-centennial'),
  '/images/11450-n-cherokee-st-northglenn.jpg': getPropertyImage('11450-n-cherokee-st-northglenn'),
};

// Helper to get property image by key
export function getPropertyImage(propertyKey: keyof typeof propertyImages): string {
  return propertyImages[propertyKey] || '';
}

// Helper to check if an image is a Cloudinary image
export function isCloudinaryImage(src: string): boolean {
  return src.includes('cloudinary.com') || src.includes('rentsmallspace/');
}

// Helper to extract public ID from full URL or use as-is
export function getPublicId(src: string): string {
  if (src.includes('cloudinary.com')) {
    // Extract public ID from full Cloudinary URL
    const urlParts = src.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      // Skip version number and get the public ID
      return urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
    }
  }
  // If it's already a public ID or local path, return as-is
  return src;
}

// Helper to convert static image paths to Cloudinary URLs
export function convertToCloudinaryUrl(src: string): string {
  // If it's already a Cloudinary URL, return as-is
  if (src.includes('cloudinary.com') || src.includes('rentsmallspace/')) {
    return src;
  }
  
  // If it's a static path, convert to Cloudinary URL
  if (staticToCloudinaryMap[src]) {
    return staticToCloudinaryMap[src];
  }
  
  // If no mapping found, return original
  return src;
} 