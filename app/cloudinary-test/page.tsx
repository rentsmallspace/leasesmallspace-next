'use client';

import { CloudinaryImage } from '@/components/ui/cloudinary-image';

export default function CloudinaryTestPage() {
  const testImages = [
    {
      name: 'Cloudinary Public ID (Working)',
      src: 'retail-centennial_ltacwi',
      description: 'Direct Cloudinary public ID - should work'
    },
    {
      name: 'Cloudinary Public ID (Working)',
      src: 'lakewood-warehouse_prqnva',
      description: 'Lakewood warehouse - should work'
    },
    {
      name: 'Full Cloudinary URL',
      src: 'https://res.cloudinary.com/dznnkfslu/image/upload/v1753635017/retail-centennial_ltacwi.jpg',
      description: 'Full Cloudinary URL with version - should work'
    },
    {
      name: 'Fallback Image',
      src: '/placeholder.svg',
      description: 'Should fall back to regular img tag'
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Cloudinary Integration Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testImages.map((image, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{image.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{image.description}</p>
            
            <div className="aspect-video relative overflow-hidden rounded-lg mb-4">
              <CloudinaryImage
                src={image.src}
                alt={image.name}
                width={400}
                height={300}
                className="w-full h-full object-cover"
                quality={85}
                format="webp"
              />
            </div>
            
            <div className="text-xs text-gray-500">
              <p><strong>Source:</strong> {image.src}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Environment Check</h2>
        <p><strong>Cloud Name:</strong> {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'Not set'}</p>
        <p className="text-sm text-gray-600">Note: API Key and Secret are only needed for server-side uploads, not for displaying images.</p>
      </div>
    </div>
  );
} 