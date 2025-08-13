"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Square,
  Zap,
  Truck,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
  Download,
  Share2,
  Heart,
  Maximize,
  Car,
  Shield,
  Wifi,
  Thermometer,
  Building,
  Clock,
  Users,
  Star,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { getPropertyImage } from "@/lib/cloudinary"
import { getPropertyById, type Property } from "@/lib/properties"

// Helper functions for default location values
function getDefaultHighways(city: string): string[] {
  const highwayMap: { [key: string]: string[] } = {
    'Denver': ['I-25', 'I-70', 'US-6'],
    'Lakewood': ['US-6', 'C-470', 'I-70'],
    'Boulder': ['US-36', 'I-25', 'CO-119'],
    'Broomfield': ['US-36', 'I-25', 'C-470'],
    'Westminster': ['US-36', 'I-25', 'C-470'],
    'Arvada': ['I-70', 'C-470', 'US-36'],
    'Centennial': ['I-25', 'C-470', 'US-85'],
    'Aurora': ['I-25', 'I-70', 'E-470'],
    'Brighton': ['I-76', 'I-25', 'US-85'],
    'Northglenn': ['I-25', 'US-36', 'E-470'],
  }
  return highwayMap[city] || ['I-25', 'I-70', 'US-6']
}

function getDefaultDistance(city: string): string {
  const distanceMap: { [key: string]: string } = {
    'Denver': 'Downtown Denver',
    'Lakewood': '8 miles to downtown Denver',
    'Boulder': '30 miles to downtown Denver',
    'Broomfield': '15 miles to downtown Denver',
    'Westminster': '12 miles to downtown Denver',
    'Arvada': '10 miles to downtown Denver',
    'Centennial': '18 miles to downtown Denver',
    'Aurora': '10 miles to downtown Denver',
    'Brighton': '25 miles to downtown Denver',
    'Northglenn': '12 miles to downtown Denver',
  }
  return distanceMap[city] || 'Contact for distance details'
}

interface PropertyDetailsProps {
  propertyId: string
}

export default function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showContactForm, setShowContactForm] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true)
        const propertyData = await getPropertyById(propertyId)
        if (propertyData) {
          setProperty(propertyData)
        } else {
          setError("Property not found")
        }
      } catch (err) {
        setError("Failed to load property")
        console.error("Error fetching property:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [propertyId])

  const handleScheduleTour = () => {
    setShowContactForm(true)
  }

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setIsImageModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
          <p className="text-gray-600 mb-4">{error || "The requested property could not be found."}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Transform database property to component format
  const propertyData = {
    id: property.id,
    title: property.title,
    address: `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`,
    price: property.price_monthly,
    size: property.size_sqft,
    type: property.property_type,
    availability: property.available_date ? "Available Now" : "Contact for Availability",
    dealScore: property.deal_score || "good" as const,

    images: property.images && property.images.length > 0 
      ? property.images.map((image, index) => ({
          url: image,
          alt: `${property.title} - Image ${index + 1}`,
          caption: `${property.title} - ${index === 0 ? 'Main view' : `View ${index + 1}`}`,
        }))
      : [{
          url: getPropertyImage('lakewood-warehouse'), // fallback image
          alt: property.title,
          caption: property.title,
        }],

    keyFeatures: property.features || [
      "Professional space",
      "Prime location",
      "Competitive pricing",
    ],

    specifications: {
      totalSize: `${property.size_sqft.toLocaleString()} sq ft`,
      warehouseSize: `${Math.floor(property.size_sqft * 0.9).toLocaleString()} sq ft`,
      officeSize: `${Math.floor(property.size_sqft * 0.1).toLocaleString()} sq ft`,
      clearHeight: property.clear_height || "Not specified",
      loadingDoors: property.loading_doors || "Not specified",
      power: property.power_service || "Not specified",
      flooring: property.flooring_type || "Not specified",
      lighting: property.lighting_type || "Not specified",
      hvac: property.hvac_type || "Not specified",
      parking: property.parking_spaces ? `${property.parking_spaces} dedicated spaces` : "Not specified",
      outdoorStorage: property.outdoor_storage || "Not specified",
    },

    location: {
      neighborhood: property.neighborhood || `${property.city} Area`,
      coordinates: property.latitude && property.longitude 
        ? { lat: property.latitude, lng: property.longitude }
        : { lat: 39.7047, lng: -105.1178 }, // Default to Denver area
      nearbyHighways: property.nearby_highways || getDefaultHighways(property.city),
      distanceToDowntown: property.distance_to_downtown || getDefaultDistance(property.city),
      publicTransit: property.public_transit || "RTD bus routes available",
    },

    lease: {
      rate: `$${(property.price_monthly / property.size_sqft).toFixed(2)}/sq ft/month`,
      term: property.lease_term || "Flexible terms available",
      type: property.lease_type || "NNN (Triple Net)",
      deposit: property.deposit_requirements || "First month + security deposit",
      utilities: property.utilities_responsibility || "Tenant responsible",
      maintenance: property.maintenance_responsibility || "Tenant responsible for interior",
      insurance: property.insurance_requirements || "General liability required",
    },

    amenities: property.amenities && property.amenities.length > 0
      ? property.amenities.map(amenity => {
          // Map icon strings to actual icon components
          const iconMap: { [key: string]: any } = {
            Truck, Zap, Car, Shield, Wifi, Thermometer, Building, Clock, Users, Star
          }
          const IconComponent = iconMap[amenity.icon] || Truck
          return {
            icon: IconComponent,
            label: amenity.label,
            description: amenity.description
          }
        })
      : [
          { icon: Truck, label: "Professional Space", description: "Quality commercial property" },
          { icon: Shield, label: "Secure Location", description: "Safe business environment" },
          { icon: Car, label: "Parking Available", description: "Contact for parking details" },
        ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Search
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Brochure
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available Now
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    Great Deal
                  </Badge>
                </div>
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">Premium Location</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{propertyData.title}</h1>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{propertyData.address}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Square className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                  <div className="font-bold text-lg">{propertyData.size.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">sq ft</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                  <div className="font-bold text-lg">${propertyData.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Building className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                  <div className="font-bold text-lg">16 ft</div>
                  <div className="text-sm text-gray-600">clear height</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                  <div className="font-bold text-lg">Grade</div>
                  <div className="text-sm text-gray-600">loading</div>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <CloudinaryImage
                      src={propertyData.images[currentImageIndex].url || "/placeholder.svg"}
                      alt={propertyData.images[currentImageIndex].alt}
                      className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300 w-full h-full"
                      onClick={() => handleImageClick(currentImageIndex)}
                      width={800}
                      height={600}
                      quality={85}
                      format="webp"
                    />
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleImageClick(currentImageIndex)}
                        className="bg-black/50 text-white hover:bg-black/70"
                      >
                        <Maximize className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-black/70 text-white p-3 rounded-lg">
                        <p className="text-sm">{propertyData.images[currentImageIndex].caption}</p>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Navigation */}
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-4 gap-2">
                      {propertyData.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-video relative overflow-hidden rounded-lg border-2 transition-all ${
                            currentImageIndex === index
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <CloudinaryImage 
                            src={image.url || "/placeholder.svg"} 
                            alt={image.alt} 
                            width={200}
                            height={150}
                            className="object-cover w-full h-full"
                            quality={70}
                            format="webp"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1">
                              <Badge className="text-xs bg-blue-600">Main</Badge>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Property Description</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    This premium 1,850 square foot industrial warehouse space offers the perfect combination of
                    functionality and location in Lakewood's thriving industrial district. The property features a
                    spacious warehouse area with 16-foot clear height ceilings, ideal for storage, light manufacturing,
                    or distribution operations.
                  </p>
                  <p className="mb-4">
                    The space includes a grade-level loading dock with a 12x14 overhead door, making it easy to load and
                    unload trucks efficiently. Heavy electrical service (200 amp, 3-phase) supports industrial equipment
                    and operations. The built-in office area provides a professional space for administrative functions
                    with dedicated HVAC for year-round comfort.
                  </p>
                  <p>
                    Located in West Lakewood's established industrial corridor, this property offers excellent access to
                    major highways including US-6, C-470, and I-70, providing convenient connections throughout the
                    Denver metro area. The fenced outdoor storage area and dedicated parking spaces add significant
                    value for businesses requiring secure exterior storage and employee parking.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {propertyData.keyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Specifications */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Detailed Specifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">Space Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Size:</span>
                        <span className="font-medium">{propertyData.specifications.totalSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Warehouse:</span>
                        <span className="font-medium">{propertyData.specifications.warehouseSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Office:</span>
                        <span className="font-medium">{propertyData.specifications.officeSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Clear Height:</span>
                        <span className="font-medium">{propertyData.specifications.clearHeight}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-gray-900">Infrastructure</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Power:</span>
                        <span className="font-medium">{propertyData.specifications.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Flooring:</span>
                        <span className="font-medium">{propertyData.specifications.flooring}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lighting:</span>
                        <span className="font-medium">{propertyData.specifications.lighting}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">HVAC:</span>
                        <span className="font-medium">{propertyData.specifications.hvac}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities Grid */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyData.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                      <amenity.icon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium text-gray-900">{amenity.label}</h3>
                        <p className="text-sm text-gray-600 mt-1">{amenity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location & Transportation */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Location & Transportation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Neighborhood</h3>
                    <p className="text-gray-700 mb-4">{propertyData.location.neighborhood}</p>
                    <p className="text-gray-700">{propertyData.location.distanceToDowntown}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Highway Access</h3>
                    <div className="flex flex-wrap gap-2">
                      {propertyData.location.nearbyHighways.map((highway, index) => (
                        <Badge key={index} variant="outline" className="border-blue-200 text-blue-700">
                          {highway}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-gray-700 mt-4">{propertyData.location.publicTransit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600 mb-1">${propertyData.price.toLocaleString()}/mo</div>
                  <div className="text-gray-600">{propertyData.lease.rate}</div>
                </div>

                <div className="space-y-4 mb-6">
                  <Button onClick={handleScheduleTour} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Tour
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="flex items-center justify-center bg-transparent">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex items-center justify-center bg-transparent">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lease Type:</span>
                    <span className="font-medium">{propertyData.lease.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Term:</span>
                    <span className="font-medium">{propertyData.lease.term}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-medium text-green-600">{propertyData.availability}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="font-medium text-blue-900">Quick Response</span>
                  </div>
                  <p className="text-sm text-blue-700">Typically responds within 2 hours during business hours</p>
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Property Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Views this week</span>
                    </div>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Times saved</span>
                    </div>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">Days on market</span>
                    </div>
                    <span className="font-medium">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Properties */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Similar Properties</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm">2,200 sq ft Warehouse</div>
                    <div className="text-xs text-gray-600">Westminster, CO</div>
                    <div className="text-sm font-bold text-blue-600 mt-1">$3,400/mo</div>
                  </div>
                  <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                    <div className="font-medium text-sm">1,650 sq ft Flex Space</div>
                    <div className="text-xs text-gray-600">Arvada, CO</div>
                    <div className="text-sm font-bold text-blue-600 mt-1">$2,750/mo</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Schedule a Tour</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowContactForm(false)}>
                  ×
                </Button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Tour Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                  <textarea
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Any specific questions or requirements?"
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Request Tour</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
