"use client"

import { useRouter } from "next/navigation"
import { useBackground } from "@/contexts/BackgroundContext"
import TodoForm from "@/components/TodoForm"
import type { Task } from "@/components/TaskCard"
import { useTasks } from "@/hooks/useTasksAPI"

export default function AddTaskPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const { addTask, loading, error } = useTasks()

  const handleSubmit = async (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    try {
      const taskId = await addTask(taskData)
      console.log("Created task:", taskId, taskData)
      // Navigate back to tasks page
      router.push("/tasks")
    } catch (error) {
      console.error("Failed to create task:", error)
      // You could show an error message to the user here
    }
  }

  const handleCancel = () => {
    router.push("/tasks")
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
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center text-high-contrast break-words">Add New Task</h1>

            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold text-sm sm:text-base">Error:</p>
                <p className="text-sm sm:text-base break-words">{error}</p>
              </div>
            )}

            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl p-4 sm:p-6">
              <TodoForm
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
