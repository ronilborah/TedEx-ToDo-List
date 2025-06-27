import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { BackgroundProvider } from "@/contexts/BackgroundContext"

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A responsive task management application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-mono">
        <ThemeProvider>
          <BackgroundProvider>{children}</BackgroundProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
