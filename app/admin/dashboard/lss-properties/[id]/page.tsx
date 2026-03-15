"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import LoadingLogo from '@/components/admin/LoadingLogo';
import { getPropertyById, deleteProperty, Property } from '@/lib/admin/properties';
import Image from 'next/image';
import { getStoragePublicUrl } from '@/lib/storage';

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const result = await getPropertyById(propertyId);
        
        if (result.error) {
          throw new Error(result.error);
        }

        if (!result.data) {
          throw new Error('Property not found');
        }

        setProperty(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const result = await deleteProperty(propertyId);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Redirect to properties list
      router.push('/admin/dashboard/lss-properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] gap-4">
        <LoadingLogo />
        <div className="text-gray-500">Loading property...</div>
      </div>
    );
  }

  if (error && !property) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/dashboard/lss-properties"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Properties
          </Link>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/dashboard/lss-properties"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Properties
          </Link>
        </div>
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Property Not Found</h3>
              <div className="mt-2 text-sm text-yellow-700">The property you're looking for doesn't exist.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
            <p className="mt-1 text-sm text-gray-600">
              Property ID: {property.id}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/admin/dashboard/lss-properties/${propertyId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Property
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Property'}
            </button>
            <Link
              href="/admin/dashboard/lss-properties"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Properties
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            property.is_active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Title</dt>
              <dd className="mt-1 text-sm text-gray-900">{property.title}</dd>
            </div>
            
            {property.description && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.description}</dd>
              </div>
            )}

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {property.address}<br />
                {property.city}, {property.state} {property.zip_code}
              </dd>
            </div>

            {property.latitude && property.longitude && (
              <>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Latitude</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.latitude}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Longitude</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.longitude}</dd>
                </div>
              </>
            )}
          </dl>
        </div>

        {/* Property Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Property Details</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Property Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{property.property_type}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Size</dt>
              <dd className="mt-1 text-sm text-gray-900">{property.size_sqft.toLocaleString()} sq ft</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">Monthly Price</dt>
              <dd className="mt-1 text-sm text-gray-900">${property.price_monthly.toLocaleString()}</dd>
            </div>

            {property.clear_height && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Clear Height</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.clear_height}'</dd>
              </div>
            )}

            {property.loading_doors && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Loading Doors</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.loading_doors}</dd>
              </div>
            )}

            {property.parking_spaces && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Parking Spaces</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.parking_spaces}</dd>
              </div>
            )}

            {property.lease_type && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Lease Type</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{property.lease_type}</dd>
              </div>
            )}

            {property.lease_term && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Lease Term</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.lease_term}</dd>
              </div>
            )}

            {property.available_date && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Available Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{new Date(property.available_date).toLocaleDateString()}</dd>
              </div>
            )}

            {property.deal_score && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Deal Score</dt>
                <dd className="mt-1 text-sm text-gray-900">{property.deal_score}</dd>
              </div>
            )}

            {property.is_featured && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Featured</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Featured Property
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </div>

        {/* Building Specifications */}
        {(property.power_service || property.flooring_type || property.lighting_type || property.hvac_type || property.outdoor_storage !== undefined) && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Building Specifications</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {property.power_service && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Power Service</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.power_service}</dd>
                </div>
              )}

              {property.flooring_type && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Flooring Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.flooring_type}</dd>
                </div>
              )}

              {property.lighting_type && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lighting Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.lighting_type}</dd>
                </div>
              )}

              {property.hvac_type && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">HVAC Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.hvac_type}</dd>
                </div>
              )}

              {property.outdoor_storage !== undefined && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Outdoor Storage</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.outdoor_storage ? 'Available' : 'Not Available'}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Location Details */}
        {(property.neighborhood || property.nearby_highways?.length || property.distance_to_downtown || property.public_transit !== undefined) && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Location Details</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {property.neighborhood && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Neighborhood</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.neighborhood}</dd>
                </div>
              )}

              {property.distance_to_downtown && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Distance to Downtown</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.distance_to_downtown} miles</dd>
                </div>
              )}

              {property.public_transit !== undefined && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Public Transit</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.public_transit ? 'Accessible' : 'Not Accessible'}</dd>
                </div>
              )}

              {property.nearby_highways && property.nearby_highways.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Nearby Highways</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div className="flex flex-wrap gap-2">
                      {property.nearby_highways.map((highway, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {highway}
                        </span>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Lease Terms */}
        {(property.deposit_requirements || property.utilities_responsibility || property.maintenance_responsibility || property.insurance_requirements) && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Lease Terms</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {property.deposit_requirements && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Deposit Requirements</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.deposit_requirements}</dd>
                </div>
              )}

              {property.utilities_responsibility && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Utilities Responsibility</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.utilities_responsibility}</dd>
                </div>
              )}

              {property.maintenance_responsibility && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Maintenance Responsibility</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.maintenance_responsibility}</dd>
                </div>
              )}

              {property.insurance_requirements && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Insurance Requirements</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.insurance_requirements}</dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Features</h2>
            <div className="flex flex-wrap gap-2">
              {property.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {property.images && property.images.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {property.images.map((path, index) => (
                <div key={path} className="relative group">
                  <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100 relative">
                    <Image
                      src={getStoragePublicUrl(path)}
                      alt={`Property image ${index + 1}`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Metadata</h2>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(property.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(property.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 