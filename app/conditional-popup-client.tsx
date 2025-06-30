"use client"

/**
 * Client-only wrapper that dynamically loads the real ConditionalPopup
 * without Server-Side Rendering (avoids SSR errors in the server layout).
 */

import dynamic from "next/dynamic"

// Dynamically import the named export to keep bundle size small
const DynamicConditionalPopup = dynamic(
  () => import("@/components/layout/conditional-popup").then((mod) => mod.ConditionalPopup),
  { ssr: false },
)

interface ConditionalPopupClientProps {
  enabledPaths: string[]
}

export default function ConditionalPopupClient({ enabledPaths }: ConditionalPopupClientProps) {
  return <DynamicConditionalPopup enabledPaths={enabledPaths} />
}
