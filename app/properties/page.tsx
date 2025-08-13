import type { Metadata } from "next"
import { Suspense } from "react"
import PropertiesList from "@/components/properties/properties-list"

export const metadata: Metadata = {
  title: "All Available Properties | LeaseSmallSpace.com",
  description: "Browse all available commercial properties across Colorado. Find warehouse space, retail space, flex space, and more.",
  keywords: "commercial properties colorado, warehouse space, retail space, flex space, industrial space, colorado real estate",
}

export default function PropertiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Available Properties</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our complete inventory of commercial properties across Colorado. 
              Find the perfect space for your business needs.
            </p>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<PropertiesLoadingSkeleton />}>
          <PropertiesList />
        </Suspense>
      </div>
    </div>
  )
}

function PropertiesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 9 }).map((_, index) => (
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
      ))}
    </div>
  )
}
