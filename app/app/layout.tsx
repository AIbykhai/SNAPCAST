import type React from "react"
import "@/app/globals.css"
import { Inter, Playfair_Display } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import AuthStatus from "@/components/AuthStatus";
import { getCurrentUser } from "@/lib/server-auth";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })

export const metadata = {
  title: "AI Social - Your AI-powered Content Assistant",
  description: "Create content 5x faster, more on-brand and post everywhere in one click!",
    generator: 'v0.dev'
}

// Make RootLayout async to fetch session on the server
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <div className="container mx-auto px-4 py-2 text-right">
          {/* Pass user from server session to AuthStatus */}
          <AuthStatus user={user} />
        </div>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
