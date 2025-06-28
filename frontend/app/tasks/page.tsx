"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Dock, { type DockSettings } from "@/components/Dock"
import StatusCounters from "@/components/StatusCounters"
import TaskCard, { type Task } from "@/components/TaskCard"
import { SettingsDialog } from "@/components/SettingsDialog"
import BackgroundRenderer from "@/components/BackgroundRenderer"
import { useTasks } from "@/hooks/useTasksAPI"

// Default dock settings
const DEFAULT_DOCK_SETTINGS: DockSettings = {
  magnification: 64,
  baseItemSize: 40,
  distance: 150,
  panelHeight: 56,
}

// Custom hook for persisted dock settings
function useDockSettings() {
  const [dockSettings, setDockSettings] = useState<DockSettings>(DEFAULT_DOCK_SETTINGS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("taskManagerDockSettings")
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        // Validate that all required properties exist
        if (
          typeof parsed.magnification === "number" &&
          typeof parsed.baseItemSize === "number" &&
          typeof parsed.distance === "number" &&
          typeof parsed.panelHeight === "number"
        ) {
          setDockSettings(parsed)
        }
      }
    } catch (error) {
      console.warn("Failed to load dock settings from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save settings to localStorage whenever they change
  const updateDockSettings = (newSettings: DockSettings) => {
    setDockSettings(newSettings)
    try {
      localStorage.setItem("taskManagerDockSettings", JSON.stringify(newSettings))
    } catch (error) {
      console.warn("Failed to save dock settings to localStorage:", error)
    }
  }

  return { dockSettings, updateDockSettings, isLoaded }
}

export default function TasksPage() {
  const router = useRouter()
  const { tasks, toggleComplete, deleteTask, loading: tasksLoading, error: tasksError } = useTasks()
  const { dockSettings, updateDockSettings, isLoaded: dockLoaded } = useDockSettings()
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) return 0
    return a.completed ? 1 : -1
  })

  const completedCount = tasks.filter((t) => t.completed).length
  const pendingCount = tasks.filter((t) => !t.completed && t.status !== "Done").length
  const overdueCount = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < new Date()).length

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`)
  }

  const handleAddTask = () => {
    router.push("/add")
  }

  // Don't render until both tasks and dock settings are loaded
  if (tasksLoading || !dockLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundRenderer />
        <div className="text-medium-contrast">Loading...</div>
      </div>
    )
  }

  // Show error if tasks failed to load
  if (tasksError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundRenderer />
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Failed to load tasks</p>
          <p className="text-sm">{tasksError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <BackgroundRenderer />

      <div className="min-h-screen relative" style={{ filter: "brightness(1.43)" }}>
        <Dock onSettingsOpen={() => setShowSettingsDialog(true)} onAddTask={handleAddTask} settings={dockSettings} />

        {/* Mobile layout: Status counters positioned below title and dock */}
        <div className="sm:hidden">
          {/* Main content container - mobile layout */}
          <div className="px-4 py-8 pt-4">
            <div className="max-w-4xl">
              {/* Header with title only */}
              <div className="mb-4 p-3 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl">
                <h1 className="text-3xl font-bold text-high-contrast break-words">Tasks</h1>
              </div>

              {/* Status counters - positioned below title on mobile */}
              <div className="mb-6">
                <StatusCounters completed={completedCount} pending={pendingCount} overdue={overdueCount} />
              </div>

              {/* Tasks list */}
              <div className="space-y-3">
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    onEdit={handleEdit}
                    onDelete={deleteTask}
                  />
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-8 p-4 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl border border-black/20 dark:border-white/20">
                    <p className="text-medium-contrast text-base break-words">No tasks yet. Create your first task to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop layout: Status counters positioned with dock */}
        <div className="hidden sm:block">
          {/* Status counters aligned with dock - desktop only */}
          <div className="fixed top-24 right-4 z-40">
            <StatusCounters completed={completedCount} pending={pendingCount} overdue={overdueCount} />
          </div>

          {/* Main content container - desktop layout */}
          <div className="pl-8 pr-4 py-8 pt-4">
            <div className="max-w-4xl">
              {/* Header with title only */}
              <div className="mb-8 p-4 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl">
                <h1 className="text-4xl lg:text-5xl font-bold text-high-contrast break-words">Tasks</h1>
              </div>

              {/* Tasks list */}
              <div className="space-y-4">
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleComplete}
                    onEdit={handleEdit}
                    onDelete={deleteTask}
                  />
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-12 p-6 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl border border-black/20 dark:border-white/20">
                    <p className="text-medium-contrast text-lg break-words">No tasks yet. Create your first task to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <SettingsDialog
          isOpen={showSettingsDialog}
          onClose={() => setShowSettingsDialog(false)}
          dockSettings={dockSettings}
          onDockSettingsChange={updateDockSettings}
        />
      </div>
    </div>
  )
}
