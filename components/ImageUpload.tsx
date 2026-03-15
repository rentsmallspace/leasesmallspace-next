'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { StorageUploadResult } from '@/lib/storage';
import { createClient } from '@/utils/supabase/client';
import { storageConfig } from '@/lib/storage';

interface ImageUploadProps {
  onImagesChange: (images: StorageUploadResult[]) => void;
  initialImages?: StorageUploadResult[];
  maxImages?: number;
  className?: string;
}

export default function ImageUpload({
  onImagesChange,
  initialImages = [],
  maxImages = 10,
  className = '',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`);
        }
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} is too large (max 10MB)`);
        }

        // Get a signed upload URL (small request) so we upload directly to Supabase and avoid 413 on Vercel (4.5MB limit)
        const urlRes = await fetch('/api/property-image-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type }),
        });
        if (!urlRes.ok) {
          const errData = await urlRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to get upload URL');
        }
        const { path, token, publicUrl } = await urlRes.json();

        const supabase = createClient();
        const { error } = await supabase.storage
          .from(storageConfig.bucket)
          .uploadToSignedUrl(path, token, file, { contentType: file.type });

        if (error) {
          throw new Error(error.message || `Failed to upload ${file.name}`);
        }

        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const newImage: StorageUploadResult = {
          path,
          publicUrl,
          width: undefined,
          height: undefined,
          format: ext,
        };

        const updatedImages = [...initialImages, newImage];
        onImagesChange(updatedImages);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = async (imageToRemove: StorageUploadResult) => {
    setDeleting(imageToRemove.path);

    try {
      const response = await fetch('/api/delete-property-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: imageToRemove.path }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(`Failed to delete image: ${errorData.error || 'Unknown error'}`);
      } else {
        setError(null);
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }

    const updatedImages = initialImages.filter((img) => img.path !== imageToRemove.path);
    onImagesChange(updatedImages);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const fakeEvent = { target: { files } } as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="h-16 w-16 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Upload Property Images'}
            </h3>
            <div className="text-sm text-gray-600">
              {uploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Processing upload...</span>
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={initialImages.length >= maxImages}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={initialImages.length >= maxImages}
                    className="font-medium text-indigo-600 hover:text-indigo-500 underline disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    Click to upload
                  </button>
                  {' '}or drag and drop images here
                </>
              )}
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, WebP up to 10MB each • {initialImages.length} of {maxImages} images uploaded
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Upload Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
            <div className="ml-auto pl-3">
              <button
                type="button"
                onClick={() => setError(null)}
                className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:text-red-100"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {initialImages.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Property Images</h3>
            <span className="text-sm text-gray-500">{initialImages.length} image(s)</span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {initialImages.map((image, index) => (
              <div key={image.path} className="relative group">
                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 relative">
                  <Image
                    src={image.publicUrl}
                    alt={`Property image ${index + 1}`}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image)}
                  disabled={deleting === image.path}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove image"
                >
                  {deleting === image.path ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            <p>💡 <strong>Tip:</strong> The first image will be used as the primary image for the property listing.</p>
          </div>
        </div>
      )}
    </div>
  );
}
