"use client"

import { motion, type MotionValue, useMotionValue, useSpring, type SpringOptions, AnimatePresence } from "framer-motion"
import React from "react"
import { Children, cloneElement, useEffect, useRef, useState } from "react"
import { VscAdd, VscSearch, VscColorMode, VscSettingsGear, VscSymbolColor } from "react-icons/vsc"
import { useTheme } from "@/contexts/ThemeContext"
import SearchDialog from "./SearchDialog"
import { useRouter } from "next/navigation"
import type { Task } from "./TaskCard"
import { BackgroundDialog } from "./BackgroundDialog"

export type DockItemData = {
  icon: React.ReactNode
  label: React.ReactNode
  onClick: () => void
  className?: string
}

export type DockSettings = {
  magnification: number
  baseItemSize: number
  distance: number
  panelHeight: number
}

export type DockProps = {
  items: DockItemData[]
  className?: string
  spring?: SpringOptions
  settings: DockSettings
}

type DockItemProps = {
  className?: string
  children: React.ReactNode
  onClick?: () => void
  mouseX: MotionValue
  spring: SpringOptions
  distance: number
  baseItemSize: number
  magnification: number
}

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isHovered = useMotionValue(0)

  // Disable magnification - always use base size
  const size = useSpring(baseItemSize, spring)

  return (
    <motion.div
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-full border border-black/30 dark:border-white/30 hover:border-black/50 dark:hover:border-white/50 transition-colors ${className}`}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      {Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return cloneElement(child, {})
        }
        return child
      })}
    </motion.div>
  )
}

type DockLabelProps = {
  className?: string
  children: React.ReactNode
  isHovered?: MotionValue<number>
}

function DockLabel({ children, className = "", isHovered }: DockLabelProps) {
  const fallback = useMotionValue(0)
  const hoverMv = isHovered ?? fallback

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = hoverMv.on("change", (latest) => {
      setIsVisible(latest === 1)
    })
    return () => unsubscribe()
  }, [hoverMv])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -bottom-8 left-1/2 w-fit whitespace-pre rounded-md border border-black/20 dark:border-white/20 bg-white/90 dark:bg-black/90 backdrop-blur-sm px-2 py-1 text-xs text-black dark:text-white`}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type DockIconProps = {
  className?: string
  children: React.ReactNode
  isHovered?: MotionValue<any>
}

function DockIcon({ children, className = "" }: DockIconProps) {
  return <div className={`flex items-center justify-center text-black dark:text-white ${className}`}>{children}</div>
}

interface DockComponentProps {
  onSettingsOpen: () => void
  onAddTask: () => void
  settings: DockSettings
}

export default function Dock({ onSettingsOpen, onAddTask, settings }: DockComponentProps) {
  const { toggleTheme } = useTheme()
  const [showSearch, setShowSearch] = useState(false)
  const [showBackgrounds, setShowBackgrounds] = useState(false)
  const router = useRouter()

  const handleTaskSelect = (task: Task) => {
    router.push(`/edit/${task.id}`)
  }

  const items: DockItemData[] = [
    {
      icon: <VscAdd size={18} />,
      label: "Add Task",
      onClick: onAddTask,
    },
    {
      icon: <VscSearch size={18} />,
      label: "Search",
      onClick: () => setShowSearch(true),
    },
    {
      icon: <VscSymbolColor size={18} />,
      label: "Backgrounds",
      onClick: () => setShowBackgrounds(true),
    },
    {
      icon: <VscColorMode size={18} />,
      label: "Toggle Theme",
      onClick: toggleTheme,
    },
    {
      icon: <VscSettingsGear size={18} />,
      label: "Settings",
      onClick: onSettingsOpen,
    },
  ]

  const spring: SpringOptions = { mass: 0.1, stiffness: 150, damping: 12 }
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const isHovered = useMotionValue(0)

  const { magnification, baseItemSize, distance, panelHeight } = settings

  // Simplified height calculation - no magnification effect
  const height = useSpring(panelHeight, spring)

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <motion.div style={{ height, scrollbarWidth: "none" }} className="flex max-w-full items-center">
          <motion.div
            onMouseMove={({ pageX }) => {
              isHovered.set(1)
              mouseX.set(pageX)
            }}
            onMouseLeave={() => {
              isHovered.set(0)
              mouseX.set(Number.POSITIVE_INFINITY)
            }}
            className="flex items-center w-fit gap-2 rounded-2xl border border-black/30 dark:border-white/30 py-2 px-3"
            style={{ height: panelHeight }}
            role="toolbar"
            aria-label="Application dock"
          >
            {items.map((item, index) => (
              <DockItem
                key={index}
                onClick={item.onClick}
                className={item.className}
                mouseX={mouseX}
                spring={spring}
                distance={distance}
                magnification={magnification}
                baseItemSize={baseItemSize}
              >
                <DockIcon>{item.icon}</DockIcon>
                <DockLabel>{item.label}</DockLabel>
              </DockItem>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <SearchDialog
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onTaskSelect={handleTaskSelect}
      />
      <BackgroundDialog
        isOpen={showBackgrounds}
        onClose={() => setShowBackgrounds(false)}
      />
    </>
  )
}
