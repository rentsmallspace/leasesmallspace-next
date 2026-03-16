"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProperty, CreatePropertyData } from '@/lib/admin/properties';
import ImageUpload from '@/components/ImageUpload';
import { StorageUploadResult } from '@/lib/storage';

const inputClass =
  "mt-1 block w-full rounded-lg border border-gray-300 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none";
const textareaClass = inputClass + " min-h-[100px] resize-y";

export default function CreatePropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreatePropertyData>({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    latitude: undefined,
    longitude: undefined,
    property_type: '',
    size_sqft: 0,
    price_monthly: 0,
    lease_type: '',
    nnn_monthly: undefined,
    available_date: '',
    features: [],
    images: [],
    primary_image: '',
    additional_images: [],
    deal_score: '',
    is_active: true,
    clear_height: undefined,
    loading_doors: undefined,
    power_service: '',
    flooring_type: '',
    lighting_type: '',
    hvac_type: '',
    parking_spaces: undefined,
    outdoor_storage: false,
    neighborhood: '',
    nearby_highways: [],
    distance_to_downtown: undefined,
    public_transit: false,
    lease_term: '',
    deposit_requirements: '',
    utilities_responsibility: '',
    maintenance_responsibility: '',
    insurance_requirements: '',
    is_featured: false,
  });

  const [newFeature, setNewFeature] = useState('');
  const [uploadedImages, setUploadedImages] = useState<StorageUploadResult[]>([]);
  const [newHighway, setNewHighway] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? undefined : Number(value)
      }));
    } else if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddFeature();
    }
  };

  const handleAddHighway = () => {
    if (newHighway.trim()) {
      setFormData(prev => ({
        ...prev,
        nearby_highways: [...(prev.nearby_highways || []), newHighway.trim()]
      }));
      setNewHighway('');
    }
  };

  const handleRemoveHighway = (index: number) => {
    setFormData(prev => ({
      ...prev,
      nearby_highways: prev.nearby_highways?.filter((_, i) => i !== index) || []
    }));
  };

  const handleHighwayKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHighway();
    }
  };

  const handleImagesChange = (images: StorageUploadResult[]) => {
    setUploadedImages(images);
    const imagePaths = images.map(img => img.path);
    const primaryImage = images.length > 0 ? images[0].path : '';
    const additionalImages = images.slice(1).map(img => img.path);
    
    setFormData(prev => ({
      ...prev,
      images: imagePaths,
      primary_image: primaryImage,
      additional_images: additionalImages
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title || !formData.address || !formData.city || !formData.property_type || formData.size_sqft <= 0 || formData.price_monthly <= 0) {
        throw new Error('Please fill in all required fields');
      }

      const result = await createProperty(formData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      // Redirect to properties list
      router.push('/admin/dashboard/lss-properties');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Property</h1>
            <p className="mt-1 text-sm text-gray-600">
              Add a new property to the LSS database.
            </p>
          </div>
          <Link
            href="/admin/dashboard/lss-properties"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Back to Properties
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-100 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Basic Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={textareaClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                value={formData.address}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City *
              </label>
              <input
                type="text"
                name="city"
                id="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                name="state"
                id="state"
                value={formData.state}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                name="zip_code"
                id="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                name="latitude"
                id="latitude"
                value={formData.latitude || ''}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                name="longitude"
                id="longitude"
                value={formData.longitude || ''}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Property Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
                Property Type *
              </label>
              <select
                name="property_type"
                id="property_type"
                required
                value={formData.property_type || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Select a type</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail</option>
                <option value="Industrial">Industrial</option>
                <option value="Industrial Warehouse">Industrial Warehouse</option>
                <option value="Flex Space">Flex Space</option>
                <option value="Storage">Storage</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="size_sqft" className="block text-sm font-medium text-gray-700">
                Size (sq ft) *
              </label>
              <input
                type="number"
                name="size_sqft"
                id="size_sqft"
                required
                min="1"
                max="999999"
                value={formData.size_sqft}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="price_monthly" className="block text-sm font-medium text-gray-700">
                Monthly Price ($) *
              </label>
              <input
                type="number"
                name="price_monthly"
                id="price_monthly"
                required
                min="0"
                max="999999.99"
                step="0.01"
                value={formData.price_monthly}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="nnn_monthly" className="block text-sm font-medium text-gray-700">
                Monthly NNN ($)
              </label>
              <input
                type="number"
                name="nnn_monthly"
                id="nnn_monthly"
                min="0"
                max="999999.99"
                step="0.01"
                placeholder="Triple Net expenses"
                value={formData.nnn_monthly ?? ''}
                onChange={handleInputChange}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500">Shown as a separate line item on the property page (base rent is listed above).</p>
            </div>

            <div>
              <label htmlFor="clear_height" className="block text-sm font-medium text-gray-700">
                Clear Height (ft)
              </label>
              <input
                type="number"
                name="clear_height"
                id="clear_height"
                min="1"
                max="100"
                step="0.1"
                value={formData.clear_height || ''}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="loading_doors" className="block text-sm font-medium text-gray-700">
                Loading Doors
              </label>
              <input
                type="number"
                name="loading_doors"
                id="loading_doors"
                min="0"
                max="50"
                value={formData.loading_doors || ''}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="parking_spaces" className="block text-sm font-medium text-gray-700">
                Parking Spaces
              </label>
              <input
                type="number"
                name="parking_spaces"
                id="parking_spaces"
                min="0"
                max="1000"
                value={formData.parking_spaces || ''}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="lease_type" className="block text-sm font-medium text-gray-700">
                Lease Type
              </label>
              <select
                name="lease_type"
                id="lease_type"
                value={formData.lease_type || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Select lease type</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Annual">Annual</option>
                <option value="NNN">NNN</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label htmlFor="lease_term" className="block text-sm font-medium text-gray-700">
                Lease Term
              </label>
              <input
                type="text"
                name="lease_term"
                id="lease_term"
                value={formData.lease_term}
                onChange={handleInputChange}
                placeholder="e.g., 12 months, 6 months"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="available_date" className="block text-sm font-medium text-gray-700">
                Available Date
              </label>
              <input
                type="date"
                name="available_date"
                id="available_date"
                value={formData.available_date}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="deal_score" className="block text-sm font-medium text-gray-700">
                Deal Score
              </label>
              <select
                name="deal_score"
                id="deal_score"
                value={formData.deal_score || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Select score</option>
                <option value="excellent">Excellent</option>
                <option value="great">Great</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Building Specifications */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Building Specifications</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="power_service" className="block text-sm font-medium text-gray-700">
                Power Service
              </label>
              <input
                type="text"
                name="power_service"
                id="power_service"
                value={formData.power_service}
                onChange={handleInputChange}
                placeholder="e.g., 200A, 400A, 600A"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="flooring_type" className="block text-sm font-medium text-gray-700">
                Flooring Type
              </label>
              <select
                name="flooring_type"
                id="flooring_type"
                value={formData.flooring_type || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Select flooring type</option>
                <option value="Concrete">Concrete</option>
                <option value="Epoxy">Epoxy</option>
                <option value="Vinyl">Vinyl</option>
                <option value="Carpet">Carpet</option>
                <option value="Wood">Wood</option>
                <option value="Tile">Tile</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="lighting_type" className="block text-sm font-medium text-gray-700">
                Lighting Type
              </label>
              <select
                name="lighting_type"
                id="lighting_type"
                value={formData.lighting_type || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Select lighting type</option>
                <option value="LED">LED</option>
                <option value="Fluorescent">Fluorescent</option>
                <option value="Incandescent">Incandescent</option>
                <option value="High Bay">High Bay</option>
                <option value="Natural">Natural</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="hvac_type" className="block text-sm font-medium text-gray-700">
                HVAC Type
              </label>
              <select
                name="hvac_type"
                id="hvac_type"
                value={formData.hvac_type || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Select HVAC type</option>
                <option value="Central Air">Central Air</option>
                <option value="Heat Pump">Heat Pump</option>
                <option value="Window Units">Window Units</option>
                <option value="Mini Split">Mini Split</option>
                <option value="None">None</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="outdoor_storage"
                  id="outdoor_storage"
                  checked={formData.outdoor_storage}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="outdoor_storage" className="ml-2 block text-sm text-gray-900">
                  Outdoor storage available
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Location Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                Neighborhood
              </label>
              <input
                type="text"
                name="neighborhood"
                id="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                placeholder="e.g., Downtown, Industrial District"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="distance_to_downtown" className="block text-sm font-medium text-gray-700">
                Distance to Downtown (miles)
              </label>
              <input
                type="number"
                name="distance_to_downtown"
                id="distance_to_downtown"
                min="0"
                max="100"
                step="0.1"
                value={formData.distance_to_downtown || ''}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="public_transit"
                  id="public_transit"
                  checked={formData.public_transit}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="public_transit" className="ml-2 block text-sm text-gray-900">
                  Public transit accessible
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Lease Terms */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Lease Terms</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="deposit_requirements" className="block text-sm font-medium text-gray-700">
                Deposit Requirements
              </label>
              <input
                type="text"
                name="deposit_requirements"
                id="deposit_requirements"
                value={formData.deposit_requirements}
                onChange={handleInputChange}
                placeholder="e.g., 1 month rent, $1000"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="utilities_responsibility" className="block text-sm font-medium text-gray-700">
                Utilities Responsibility
              </label>
              <select
                name="utilities_responsibility"
                id="utilities_responsibility"
                value={formData.utilities_responsibility || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Select responsibility</option>
                <option value="Tenant">Tenant</option>
                <option value="Landlord">Landlord</option>
                <option value="Shared">Shared</option>
                <option value="Included">Included in Rent</option>
              </select>
            </div>

            <div>
              <label htmlFor="maintenance_responsibility" className="block text-sm font-medium text-gray-700">
                Maintenance Responsibility
              </label>
              <select
                name="maintenance_responsibility"
                id="maintenance_responsibility"
                value={formData.maintenance_responsibility || ''}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Select responsibility</option>
                <option value="Tenant">Tenant</option>
                <option value="Landlord">Landlord</option>
                <option value="Shared">Shared</option>
              </select>
            </div>

            <div>
              <label htmlFor="insurance_requirements" className="block text-sm font-medium text-gray-700">
                Insurance Requirements
              </label>
              <input
                type="text"
                name="insurance_requirements"
                id="insurance_requirements"
                value={formData.insurance_requirements}
                onChange={handleInputChange}
                placeholder="e.g., General liability, Property insurance"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Features</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a feature (e.g., 'Ample parking', 'Heavy power')"
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
            
            {formData.features && formData.features.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Current Features:</label>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>


        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Nearby Highways</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newHighway}
                onChange={(e) => setNewHighway(e.target.value)}
                onKeyPress={handleHighwayKeyPress}
                placeholder="Enter a nearby highway (e.g., 'I-10', 'US-60')"
                className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={handleAddHighway}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
            
            {formData.nearby_highways && formData.nearby_highways.length > 0 && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Current Nearby Highways:</label>
                <div className="flex flex-wrap gap-2">
                  {formData.nearby_highways.map((hw, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {hw}
                      <button
                        type="button"
                        onClick={() => handleRemoveHighway(index)}
                        className="ml-1 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Images</h2>
          <p className="text-sm text-gray-600 mb-4">
            Upload property images. The first image will be used as the primary image.
          </p>
          <ImageUpload
            onImagesChange={handleImagesChange}
            initialImages={uploadedImages}
            maxImages={10}
          />
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5 pb-3 border-b border-gray-100">Status</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                id="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Property is active and available
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_featured"
                id="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                Feature this property prominently
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3 pt-2">
          <Link
            href="/admin/dashboard/lss-properties"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Property'}
          </button>
        </div>
      </form>
    </div>
  );
} 