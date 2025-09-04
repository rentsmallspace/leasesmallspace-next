import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Navigation } from "@/components/navigation/navigation"
import { Footer } from "@/components/footer/footer"
import { ConditionalPopup } from "@/components/layout/conditional-popup"
import { Toaster } from "@/components/ui/toaster"

// This metadata remains unchanged and is correctly exported from a Server Component
export const metadata: Metadata = {
  title: "RentSmallSpace.com | Colorado's Premier Small Commercial Properties",
  description:
    "Find your perfect small commercial space in Colorado. Warehouses, shops, and flex spaces available now. Quick approval, flexible terms.",
  generator: "RentSmallSpace.com",
  keywords: "commercial real estate, warehouse rental, office space, flex space, Colorado commercial property",
  authors: [{ name: "RentSmallSpace Team" }],
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
  openGraph: {
    title: "RentSmallSpace.com | Colorado Commercial Properties",
    description: "Find your perfect small commercial space in Colorado",
    url: "https://rentsmallspace.com",
    siteName: "RentSmallSpace",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RentSmallSpace.com | Colorado Commercial Properties",
    description: "Find your perfect small commercial space in Colorado",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        {/* Use the new client component here, passing the enabled paths */}
        <ConditionalPopup enabledPaths={popupEnabledPaths} />
        <Toaster />
      </body>
    </html>
  )
}
