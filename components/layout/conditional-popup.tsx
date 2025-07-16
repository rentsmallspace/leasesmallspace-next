"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { InactivityPopup } from "@/components/lead-capture/inactivity-popup"

interface ConditionalPopupProps {
  enabledPaths: string[]
}

export function ConditionalPopup({ enabledPaths }: ConditionalPopupProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [pathname])

  if (!mounted) {
    return null
  }

  const shouldShowPopup = enabledPaths.includes(pathname)

  if (!shouldShowPopup) {
    return null
  }

  return <InactivityPopup />
}
