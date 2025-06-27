"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Dock, { type DockSettings } from "@/components/Dock"
import StatusCounters from "@/components/StatusCounters"
import TaskCard, { type Task } from "@/components/TaskCard"
import { SettingsDialog } from "@/components/SettingsDialog"
import BackgroundRenderer from "@/components/BackgroundRenderer"

// Default dock settings
const DEFAULT_DOCK_SETTINGS: DockSettings = {
  magnification: 64,
  baseItemSize: 40,
  distance: 150,
  panelHeight: 56,
}

// Default tasks for first-time users
const DEFAULT_TASKS: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description:
      "Create a modern, responsive landing page with hero section and call-to-action buttons. Should include testimonials and feature highlights.",
    createdAt: new Date("2024-01-15"),
    dueDate: new Date("2024-02-01"),
    priority: "High",
    status: "In Progress",
    tags: [
      { name: "Design", color: "#3b82f6" },
      { name: "Frontend", color: "#10b981" },
    ],
    completed: false,
  },
  {
    id: "2",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment pipeline using GitHub Actions.",
    createdAt: new Date("2024-01-10"),
    dueDate: new Date("2024-01-25"),
    priority: "Medium",
    status: "To Do",
    tags: [
      { name: "DevOps", color: "#f59e0b" },
      { name: "Backend", color: "#ef4444" },
    ],
    completed: false,
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples and response schemas.",
    createdAt: new Date("2024-01-05"),
    priority: "Low",
    status: "Done",
    tags: [{ name: "Documentation", color: "#8b5cf6" }],
    completed: true,
  },
]

// Persistent tasks hook with localStorage
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("taskManagerTasks")
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks)
        // Convert date strings back to Date objects
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }))
        setTasks(tasksWithDates)
      } else {
        // First time user - set default tasks
        setTasks(DEFAULT_TASKS)
      }
    } catch (error) {
      console.warn("Failed to load tasks from localStorage:", error)
      setTasks(DEFAULT_TASKS)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded && tasks.length >= 0) {
      try {
        localStorage.setItem("taskManagerTasks", JSON.stringify(tasks))
      } catch (error) {
        console.warn("Failed to save tasks to localStorage:", error)
      }
    }
  }, [tasks, isLoaded])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      completed: false,
    }
    setTasks((prev) => [newTask, ...prev])
    return newTask.id
  }

  const updateTask = (id: string, taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...taskData,
            }
          : task,
      ),
    )
  }

  const toggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed, status: !task.completed ? "Done" : "To Do" } : task,
      ),
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  return { tasks, addTask, updateTask, toggleComplete, deleteTask, getTask, isLoaded }
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
  const { tasks, toggleComplete, deleteTask, isLoaded: tasksLoaded } = useTasks()
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
  if (!tasksLoaded || !dockLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BackgroundRenderer />
        <div className="text-medium-contrast">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <BackgroundRenderer />

      <div className="min-h-screen relative" style={{ filter: "brightness(1.43)" }}>
        <Dock onSettingsOpen={() => setShowSettingsDialog(true)} onAddTask={handleAddTask} settings={dockSettings} />

        {/* Main content container - left aligned */}
        <div className="pl-8 pr-4 py-8 pt-20">
          <div className="max-w-4xl">
            {/* Status counters below dock, aligned with tasks */}
            <StatusCounters completed={completedCount} pending={pendingCount} overdue={overdueCount} />

            {/* Header with title only (add button moved to dock) */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-high-contrast">Tasks</h1>
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
                <div className="text-center py-12">
                  <p className="text-medium-contrast text-lg">No tasks yet. Create your first task to get started!</p>
                </div>
              )}
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
