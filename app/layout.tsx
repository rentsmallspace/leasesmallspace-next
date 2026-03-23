import type React from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import "./globals.css"
import { Navigation } from "@/components/navigation/navigation"
import { Footer } from "@/components/footer/footer"
import { ConditionalPopup } from "@/components/layout/conditional-popup"
import { Toaster } from "@/components/ui/toaster"

// This metadata remains unchanged and is correctly exported from a Server Component
export const metadata: Metadata = {
  title: "LeaseSmallSpace.com | Colorado's Premier Small Commercial Properties",
  description:
    "Find your perfect small commercial space in Colorado. Warehouses, shops, and flex spaces available now. Quick approval, flexible terms.",
  generator: "LeaseSmallSpace.com",
  keywords: "commercial real estate, warehouse rental, office space, flex space, Colorado commercial property, warehouse specialist",
  authors: [{ name: "LeaseSmallSpace Team" }],
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.png",
  },
  metadataBase: new URL("https://leasesmallspace.com"),
  openGraph: {
    title: "Warehouse Specialist | View Warehouse Inventory",
    description: "Find your perfect small commercial space in Colorado. Warehouses, shops, and flex spaces available now.",
    url: "https://leasesmallspace.com",
    siteName: "LeaseSmallSpace",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeaseSmallSpace - Colorado Warehouse Inventory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Warehouse Specialist | View Warehouse Inventory",
    description: "Find your perfect small commercial space in Colorado",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Define the paths where the inactivity popup should be active
const popupEnabledPaths = ["/questionnaire", "/nnn-lease-guide", "/why-rent-small-space", "/faq"]

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") ?? ""
  const isAdminRoute = pathname.startsWith("/admin")

  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2447953542245211');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2447953542245211&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* This is the original structure that includes Navigation and Footer */}
        <div className="relative flex min-h-screen flex-col">
          {!isAdminRoute && <Navigation />}
          <main className="flex-1">{children}</main>
          {!isAdminRoute && <Footer />}
        </div>
        {/* Use the new client component here, passing the enabled paths */}
        <ConditionalPopup enabledPaths={popupEnabledPaths} />
        <Toaster />
      </body>
    </html>
  )
}
