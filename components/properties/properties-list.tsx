"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Square, DollarSign, ArrowRight, Lock, CheckCircle, Search, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { getProperties, type Property } from "@/lib/properties"
import { createInquiry } from "@/lib/leads"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import Link from "next/link"

export default function PropertiesList() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Fetch all properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("Fetching all properties...")
        const data = await getProperties()
        console.log("Fetched properties:", data)
        setProperties(data)
        setFilteredProperties(data)
      } catch (error) {
        console.error("Error fetching properties:", error)
        setProperties([])
        setFilteredProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Filter properties based on search and filters
  useEffect(() => {
    let filtered = properties

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCity) {
      filtered = filtered.filter(property => property.city === selectedCity)
    }

    if (selectedType) {
      filtered = filtered.filter(property => property.property_type === selectedType)
    }

    setFilteredProperties(filtered)
  }, [properties, searchTerm, selectedCity, selectedType])

  const handleGetInfo = (propertyTitle: string, propertyLocation: string) => {
    setSelectedProperty(`${propertyTitle} - ${propertyLocation}`)
    setModalOpen(true)
    setSubmitted(false)
    // Reset form data when opening modal
    setFormData({
      name: "",
      email: "",
      phone: "",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data before submission
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields.")
      return
    }
    
    try {
      console.log("Submitting inquiry with data:", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        property: selectedProperty
      })

      const result = await createInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        inquiry_type: "property_inquiry",
        source: "properties_page",
        page_captured: window.location.pathname,
        message: `Property inquiry for: ${selectedProperty}`,
      })
      
      console.log("Inquiry submitted successfully:", result)
      setSubmitted(true)
    } catch (error) {
      console.error("Error submitting property inquiry:", error)
      // Show error to user
      alert("Sorry, there was an error submitting your inquiry. Please try again or contact us directly.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCity("")
    setSelectedType("")
  }

  // Get unique cities and property types for filters
  const cities = [...new Set(properties.map(p => p.city))].sort()
  const propertyTypes = [...new Set(properties.map(p => p.property_type))].sort()

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Properties</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          {/* Property Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            {propertyTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Clear Filters */}
          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </Button>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProperties.length} of {properties.length} properties
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))
        ) : filteredProperties.length > 0 ? (
          filteredProperties.map((property: Property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <CloudinaryImage
                  src={property.primary_image || property.images?.[0] || "/placeholder.svg"}
                  alt={property.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                  quality={80}
                  format="webp"
                  priority={false}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    Available Now
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {property.property_type}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{property.title}</h3>

                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.city}, {property.state}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm">{property.size_sqft.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm font-bold">${property.price_monthly.toLocaleString()}/mo</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {property.features && property.features.slice(0, 3).map((feature: string, index: number) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Link href={`/property/${property.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Property <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleGetInfo(property.title, `${property.city}, ${property.state}`)}
                    variant="outline"
                    className="w-full"
                  >
                    Get More Info
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          // No properties available
          <div className="col-span-full text-center py-12">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Lead Capture Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          {!submitted ? (
            <>
              <DialogHeader>
                <DialogTitle>Get More Information</DialogTitle>
                <DialogDescription>
                  Interested in {selectedProperty}? Get detailed information, photos, and availability.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(303) 555-1234"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center text-xs text-gray-500 mt-4">
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Your info is never sold to brokers</span>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Send Me Information
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <div className="py-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <DialogTitle className="mb-2">Thank You!</DialogTitle>
              <DialogDescription>
                We've sent detailed information about {selectedProperty} to your email. A space specialist will reach
                out shortly.
              </DialogDescription>
              <Button onClick={() => setModalOpen(false)} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                Continue Browsing
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
