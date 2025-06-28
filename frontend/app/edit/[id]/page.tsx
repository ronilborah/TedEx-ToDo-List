"use client"

import { useRouter } from "next/navigation"
import { useBackground } from "@/contexts/BackgroundContext"
import TodoForm from "@/components/TodoForm"
import type { Task } from "@/components/TaskCard"
import { useTasks } from "@/hooks/useTasksAPI"
import { useEffect, useState } from "react"

interface EditTaskPageProps {
  params: {
    id: string
  }
}

export default function EditTaskPage({ params }: EditTaskPageProps) {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const { updateTask, getTask, loading, error } = useTasks()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const foundTask = getTask(params.id)
    if (foundTask) {
      setTask(foundTask)
    }
    setIsLoading(false)
  }, [params.id, getTask])

  const handleSubmit = async (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    try {
      await updateTask(params.id, taskData)
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-medium-contrast">Loading...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Task not found</p>
          <button
            onClick={() => router.push("/tasks")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-high-contrast break-words">Edit Task</h1>

            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold text-sm sm:text-base">Error:</p>
                <p className="text-sm sm:text-base break-words">{error}</p>
              </div>
            )}

            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <TodoForm
                task={task}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
