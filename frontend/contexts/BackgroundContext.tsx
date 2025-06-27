"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type BackgroundType = "image" | "animated"

export interface BackgroundOption {
  id: string
  name: string
  type: BackgroundType
  path?: string // for image backgrounds
  component?: string // for animated backgrounds
}

interface BackgroundContextType {
  currentBackground: BackgroundOption
  setBackground: (background: BackgroundOption) => void
  backgrounds: BackgroundOption[]
  isLoaded: boolean
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined)

const AVAILABLE_BACKGROUNDS: BackgroundOption[] = [
  {
    id: "threads",
    name: "Animated Threads",
    type: "animated",
    component: "Threads",
  },
]

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [currentBackground, setCurrentBackground] = useState<BackgroundOption>(AVAILABLE_BACKGROUNDS[0]) // Defaults to threads
  const [isLoaded, setIsLoaded] = useState(false)

  // Load background preference from localStorage on mount
  useEffect(() => {
    try {
      const savedBackgroundId = localStorage.getItem("taskManagerBackground")
      if (savedBackgroundId) {
        const savedBackground = AVAILABLE_BACKGROUNDS.find((bg) => bg.id === savedBackgroundId)
        if (savedBackground) {
          setCurrentBackground(savedBackground)
        }
      }
      // If no saved background, it will use the default (threads) from useState above
    } catch (error) {
      console.warn("Failed to load background preference from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const setBackground = (background: BackgroundOption) => {
    setCurrentBackground(background)
    // Save to localStorage
    try {
      localStorage.setItem("taskManagerBackground", background.id)
    } catch (error) {
      console.warn("Failed to save background preference to localStorage:", error)
    }
  }

  return (
    <BackgroundContext.Provider
      value={{
        currentBackground,
        setBackground,
        backgrounds: AVAILABLE_BACKGROUNDS,
        isLoaded,
      }}
    >
      {children}
    </BackgroundContext.Provider>
  )
}

export function useBackground() {
  const context = useContext(BackgroundContext)
  if (context === undefined) {
    throw new Error("useBackground must be used within a BackgroundProvider")
  }
  return context
}
