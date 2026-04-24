"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import {
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_PHONE,
  BUSINESS_PHONE_DISPLAY,
  SERVICE_AREA_CITIES,
} from "@/lib/seo"

export function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/logo-green-pin-warehouse.png"
                alt="LeaseSmallSpace Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-blue-600">LeaseSmallSpace</span>
            </div>
            <p className="text-gray-600 max-w-md leading-relaxed">
              Simplifying the search for small warehouse and industrial space in Colorado. Find your perfect space with
              real-time availability and transparent pricing.
            </p>
          </div>

          {/* Contact / NAP */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contact</h3>
            <address className="not-italic space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>
                  {BUSINESS_ADDRESS.street}
                  <br />
                  {BUSINESS_ADDRESS.locality}, {BUSINESS_ADDRESS.region} {BUSINESS_ADDRESS.postalCode}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-blue-600" />
                <a
                  href={`tel:${BUSINESS_PHONE}`}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {BUSINESS_PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-blue-600" />
                <a
                  href={`mailto:${BUSINESS_EMAIL}`}
                  className="hover:text-blue-600 transition-colors duration-200"
                >
                  {BUSINESS_EMAIL}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>Mon-Fri 8am-6pm MT</span>
              </div>
            </address>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/questionnaire" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Find a Space
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/nnn-lease-guide" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  NNN Lease Guide
                </Link>
              </li>
              <li>
                <Link href="/why-rent-small-space" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Why Small Space
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Service area strip */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            Serving the Denver Metro
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            {SERVICE_AREA_CITIES.join(" · ")}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} LeaseSmallSpace.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
