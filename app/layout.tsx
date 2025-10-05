import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Providers } from "@/components/providers"
import { Suspense } from "react"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ticket System",
  description: "Customer Support Ticket System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
            <div className="h-20 md:h-0" />
            <MobileBottomNav />
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}