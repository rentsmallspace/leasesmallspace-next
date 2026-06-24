"use client"

import { useEffect } from "react"

// Fires GA4 events when a visitor clicks a phone (tel:) or email (mailto:) link.
// Uses a single delegated listener on the document so it survives React
// re-renders and client-side route changes — a plain querySelectorAll pass
// would miss links rendered after mount or on later pages.
export function ContactLinkTracking() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const anchor = target?.closest?.("a[href^='tel:'], a[href^='mailto:']") as
        | HTMLAnchorElement
        | null
      if (!anchor) return

      const gtag = (window as any).gtag
      if (typeof gtag !== "function") return

      const isPhone = anchor.href.startsWith("tel:")
      gtag("event", isPhone ? "phone_click" : "email_click", {
        event_category: "contact",
        event_label: anchor.href,
      })
    }

    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])

  return null
}
