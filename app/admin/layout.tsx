"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is authenticated
    const isLoggedIn = localStorage.getItem("admin_logged_in") === "true"

    if (!isLoggedIn && pathname !== "/admin/login") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(isLoggedIn)
    }

    setLoading(false)
  }, [pathname, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login page without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Show admin dashboard with sidebar
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="lg:pl-64">
          <main className="p-6">{children}</main>
        </div>
      </div>
    )
  }

  return null
}
