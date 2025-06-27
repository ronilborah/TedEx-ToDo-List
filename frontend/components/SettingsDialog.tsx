"use client"

import type { DockSettings } from "./Dock"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  dockSettings: DockSettings
  onDockSettingsChange: (settings: DockSettings) => void
}

const DEFAULT_DOCK_SETTINGS: DockSettings = {
  magnification: 64, // Still stored but not used
  baseItemSize: 40,
  distance: 150, // Still stored but not used
  panelHeight: 56,
}

export function SettingsDialog({ isOpen, onClose, dockSettings, onDockSettingsChange }: SettingsDialogProps) {
  const handleDockSettingChange = (key: keyof DockSettings, value: number) => {
    onDockSettingsChange({
      ...dockSettings,
      [key]: value,
    })
  }

  const resetDockSettings = () => {
    onDockSettingsChange(DEFAULT_DOCK_SETTINGS)
  }

  const clearAllSettings = () => {
    // Reset dock settings
    onDockSettingsChange(DEFAULT_DOCK_SETTINGS)

    // Clear localStorage
    try {
      localStorage.removeItem("taskManagerDockSettings")
    } catch (error) {
      console.warn("Failed to clear dock settings from localStorage:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-6 text-high-contrast">Settings</h3>

          {/* Dock Settings - Only show active controls */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 text-high-contrast">Dock Controls</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-medium-contrast mb-1">
                  Icon Size: {dockSettings.baseItemSize}px
                </label>
                <input
                  type="range"
                  min="30"
                  max="50"
                  value={dockSettings.baseItemSize}
                  onChange={(e) => handleDockSettingChange("baseItemSize", Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-xs text-medium-contrast mb-1">
                  Panel Height: {dockSettings.panelHeight}px
                </label>
                <input
                  type="range"
                  min="48"
                  max="72"
                  value={dockSettings.panelHeight}
                  onChange={(e) => handleDockSettingChange("panelHeight", Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Settings Info */}
          <div className="mb-6 p-3 bg-black/5 dark:bg-white/5 rounded-lg">
            <p className="text-xs text-medium-contrast">
              💾 Settings are automatically saved and will persist after page refresh
            </p>
            <p className="text-xs text-medium-contrast mt-1">🎨 Background is set to Animated Threads only</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={clearAllSettings}
              className="px-4 py-2 border border-red-500/20 text-red-500 rounded-lg bg-transparent hover:bg-red-500/5 transition-colors text-sm"
              title="Reset to defaults and clear saved settings"
            >
              Clear All
            </button>
            <button
              onClick={resetDockSettings}
              className="px-4 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors text-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
