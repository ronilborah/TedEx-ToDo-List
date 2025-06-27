"use client"

import { useRouter } from "next/navigation"
import { useBackground } from "@/contexts/BackgroundContext"
import TodoForm from "@/components/TodoForm"
import type { Task } from "@/components/TaskCard"
import { useState, useEffect } from "react"

interface EditTaskPageProps {
  params: {
    id: string
  }
}

// Hook to manage tasks with localStorage persistence
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tasks from localStorage
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem("taskManagerTasks")
      if (savedTasks) {
        const parsed = JSON.parse(savedTasks)
        const tasksWithDates = parsed.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }))
        setTasks(tasksWithDates)
      }
    } catch (error) {
      console.warn("Failed to load tasks from localStorage:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  const updateTask = (id: string, taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            ...taskData,
          }
        : task,
    )
    setTasks(updatedTasks)

    // Save to localStorage
    try {
      localStorage.setItem("taskManagerTasks", JSON.stringify(updatedTasks))
    } catch (error) {
      console.warn("Failed to save tasks to localStorage:", error)
    }
  }

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  return { updateTask, getTask, isLoaded }
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const { updateTask, getTask, isLoaded } = useTasks()

  const task = getTask(params.id)

  const handleSubmit = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    try {
      updateTask(params.id, taskData)
      console.log("Updated task:", params.id, taskData)
      // Navigate back to tasks page
      router.push("/tasks")
    } catch (error) {
      console.error("Failed to update task:", error)
      // You could show an error message to the user here
    }
  }

  const handleCancel = () => {
    router.push("/tasks")
  }

  // Show loading while tasks are being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-medium-contrast">Loading...</div>
      </div>
    )
  }

  // Show error if task not found
  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-high-contrast mb-4">Task Not Found</h1>
          <p className="text-medium-contrast mb-4">The task you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/tasks")}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{
        backgroundImage: `url(/images/backgrounds/${currentBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(0.7)",
      }}
    >
      <div className="min-h-screen" style={{ filter: "brightness(1.43)" }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-high-contrast">Edit Task</h1>
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl p-6">
              <TodoForm task={task} onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
