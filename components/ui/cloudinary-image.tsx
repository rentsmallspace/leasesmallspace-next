'use client';

import { CldImage } from 'next-cloudinary';
import { cn } from '@/lib/utils';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'scale' | 'fit' | 'thumb';
  gravity?: 'auto' | 'center' | 'north' | 'south' | 'east' | 'west';
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fallbackSrc?: string;
  onClick?: () => void;
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  quality = 85,
  format = 'auto',
  crop = 'fill',
  gravity = 'auto',
  placeholder = 'empty',
  blurDataURL,
  sizes = '100vw',
  fallbackSrc,
  onClick,
}: CloudinaryImageProps) {
  // If it's a full Cloudinary URL, extract the public ID
  let publicId = src;
  if (src.includes('cloudinary.com')) {
    const urlParts = src.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
      // Skip version number and get the public ID
      publicId = urlParts.slice(uploadIndex + 2).join('/').split('.')[0];
    }
  }

  // If it's not a Cloudinary public ID, fall back to regular img tag
  if (!publicId || publicId.includes('/images/') || publicId.includes('placeholder')) {
          if (fill) {
        return (
          <img
            src={src}
            alt={alt}
            className={cn('object-cover', className)}
            loading={priority ? 'eager' : 'lazy'}
            onClick={onClick}
            style={{ width: '100%', height: '100%' }}
          />
        );
      }
      return (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={cn('object-cover', className)}
          loading={priority ? 'eager' : 'lazy'}
          onClick={onClick}
        />
      );
  }

  return (
    <CldImage
      src={publicId}
      alt={alt}
      width={width}
      height={height}
      className={cn('object-cover', className)}
      priority={priority}
      quality={quality}
      format={format}
      crop={crop}
      gravity={gravity}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      sizes={sizes}
      onClick={onClick}
    />
  );
} 