"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PhoneInput } from "@/components/ui/phone-input"
import { MapPin, Square, DollarSign, ArrowRight, Lock, CheckCircle } from "lucide-react"
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
import { StorageImage } from "@/components/ui/storage-image"
import Link from "next/link"

export default function PropertyShowcase() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("Fetching properties for showcase...")
        const data = await getProperties() // Get all active properties
        console.log("Fetched showcase properties:", data)
        setProperties(data.slice(0, 6)) // Take first 6 properties
      } catch (error) {
        console.error("Error fetching showcase properties:", error)
        setProperties([])
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const handleGetInfo = (propertyTitle: string, propertyLocation: string, propertyId: string) => {
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
        source: "property_showcase",
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

  return (
    <>
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Properties</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Move-in ready spaces across Colorado. These won't last long.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
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
            ) : properties.length > 0 ? (
              properties.map((property: Property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <StorageImage
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
                      {property.features && property.features.map((feature: string, index: number) => (
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
                      onClick={() => handleGetInfo(property.title, `${property.city}, ${property.state}`, property.id)}
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Properties Available</h3>
                  <p className="text-gray-600">Check back soon for new listings!</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/properties">
              <Button size="lg" variant="outline" className="mr-4">
                View All Properties
              </Button>
            </Link>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Find My Perfect Space <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

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
                    className="focus:ring-2 focus:ring-[#ED4337]"
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
                    className="focus:ring-2 focus:ring-[#ED4337]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <PhoneInput
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(value) => handleInputChange("phone", value)}
                    className="focus:ring-2 focus:ring-[#ED4337]"
                  />
                </div>

                <div className="flex items-center text-xs text-gray-500 mt-4">
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Your info is never sold to brokers</span>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="submit" className="w-full bg-[#ED4337] hover:bg-[#d13a30] text-white">
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
              <Button onClick={() => setModalOpen(false)} className="mt-6 bg-[#ED4337] hover:bg-[#d13a30] text-white">
                Continue Browsing
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
