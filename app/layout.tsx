import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import DebugPanel from "@/components/debug-panel"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Blind Assist AI",
  description: "AI-powered assistant for visually impaired individuals",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          {children}
          <DebugPanel />
        </ThemeProvider>
      </body>
    </html>
  )
}
