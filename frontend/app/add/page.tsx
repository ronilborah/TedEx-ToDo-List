"use client"

import { useRouter } from "next/navigation"
import { useBackground } from "@/contexts/BackgroundContext"
import TodoForm from "@/components/TodoForm"
import type { Task } from "@/components/TaskCard"
import { useState, useEffect } from "react"

// Hook to manage tasks with localStorage persistence
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

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
    }
  }, [])

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      completed: false,
    }
    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)

    // Save to localStorage
    try {
      localStorage.setItem("taskManagerTasks", JSON.stringify(updatedTasks))
    } catch (error) {
      console.warn("Failed to save tasks to localStorage:", error)
    }

    return newTask.id
  }

  return { addTask }
}

export default function AddTaskPage() {
  const router = useRouter()
  const { currentBackground } = useBackground()
  const { addTask } = useTasks()

  const handleSubmit = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    try {
      const taskId = addTask(taskData)
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
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center text-high-contrast">Add New Task</h1>
            <div className="bg-white/10 dark:bg-black/10 backdrop-blur-sm rounded-xl p-6">
              <TodoForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
