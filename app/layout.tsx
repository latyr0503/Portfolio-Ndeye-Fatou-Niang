import { Geist_Mono, Inter, Playfair_Display } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable, playfairDisplayHeading.variable)}
    >
      <body>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
