"use client"

import { useBackground } from "@/contexts/BackgroundContext"
import { useTheme } from "@/contexts/ThemeContext"
import Threads from "./Threads"

export default function BackgroundRenderer() {
  const { currentBackground, isLoaded } = useBackground()
  const { theme } = useTheme()

  // Don't render until background is loaded to prevent flash
  if (!isLoaded) {
    return null
  }

  if (currentBackground.type === "animated") {
    switch (currentBackground.component) {
      case "Threads":
        return (
          <div className="fixed inset-0 -z-10">
            <Threads
              amplitude={1}
              distance={0}
              enableMouseInteraction={true}
              color={theme === "dark" ? [1, 1, 1] : [0, 0, 0]}
            />
          </div>
        )
      default:
        return null
    }
  }

  // Static image background
  return (
    <div
      className="fixed inset-0 -z-10 transition-all duration-300"
      style={{
        backgroundImage: `url(${currentBackground.path})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: theme === "dark" ? "brightness(0.7)" : "brightness(1)",
      }}
    />
  )
}
