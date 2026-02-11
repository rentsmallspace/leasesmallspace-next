"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { getStorageImageUrl } from "@/lib/storage";

interface StorageImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onClick?: () => void;
  /** Kept for API compatibility; Supabase Storage does not support on-the-fly quality/format. */
  quality?: number;
  format?: "auto" | "webp" | "jpg" | "png";
  crop?: "fill" | "scale" | "fit" | "thumb";
  gravity?: "auto" | "center" | "north" | "south" | "east" | "west";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  fallbackSrc?: string;
}

export function StorageImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes = "100vw",
  onClick,
  fallbackSrc,
}: StorageImageProps) {
  const url = getStorageImageUrl(src || fallbackSrc || "");
  const isLocal = url.startsWith("/");

  if (!url) {
    return (
      <div
        className={cn("bg-muted flex items-center justify-center", className)}
        style={fill ? { width: "100%", height: "100%" } : undefined}
      >
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        sizes={sizes}
        priority={priority}
        unoptimized={!isLocal}
        onClick={onClick}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width ?? 400}
      height={height ?? 300}
      className={cn("object-cover", className)}
      sizes={sizes}
      priority={priority}
      unoptimized={!isLocal}
      onClick={onClick}
    />
  );
}
