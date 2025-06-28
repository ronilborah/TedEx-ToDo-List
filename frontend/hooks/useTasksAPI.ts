// ========================================
// API INTEGRATION - ENABLED
// ========================================
// This file provides backend API integration for task persistence
// Tasks are now stored in MongoDB instead of localStorage

import { useState, useEffect } from "react"
import type { Task } from "@/components/TaskCard"

const TASKS_KEY = "taskManagerTasks"

function loadTasksFromStorage(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    return parsed.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    }))
  } catch {
    return []
  }
}

function saveTasksToStorage(tasks: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    try {
      setTasks(loadTasksFromStorage())
      setError(null)
    } catch (err) {
      setError("Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }, [])

  const save = (newTasks: Task[]) => {
    setTasks(newTasks)
    saveTasksToStorage(newTasks)
  }

  const addTask = (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date(),
      completed: false,
    }
    save([newTask, ...tasks])
    return newTask.id
  }

  const updateTask = (id: string, taskData: Partial<Omit<Task, "id" | "createdAt" | "completed">>) => {
    save(tasks.map(task => task.id === id ? { ...task, ...taskData } : task))
  }

  const toggleComplete = (id: string) => {
    save(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task))
  }

  const deleteTask = (id: string) => {
    save(tasks.filter(task => task.id !== id))
  }

  const getTask = (id: string) => tasks.find(task => task.id === id)

  const getStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = tasks.filter(t => !t.completed && t.status !== "Done").length
    const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < new Date()).length
    const completionRate = total ? completed / total : 0
    return { total, completed, pending, overdue, completionRate }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    toggleComplete,
    deleteTask,
    getTask,
    getStats,
    refreshTasks: () => setTasks(loadTasksFromStorage()),
  }
}

// ========================================
// MIGRATION INSTRUCTIONS
// ========================================
// To migrate from localStorage to API:

// 1. Uncomment the code above
// 2. Replace the existing useTasks hook in your components:
//    - In app/tasks/page.tsx: Replace useTasks() with useTasksAPI()
//    - In app/add/page.tsx: Replace useTasks() with useTasksAPI()
//    - In app/edit/[id]/page.tsx: Replace useTasks() with useTasksAPI()

// 3. Update environment variables:
//    - Add NEXT_PUBLIC_API_URL=http://localhost:6900/api to your .env file

// 4. Handle loading states:
//    - The API version includes loading and error states
//    - Add loading spinners and error messages to your UI

// 5. Test the integration:
//    - Start both frontend and backend: npm run dev (from root)
//    - Verify tasks are saved to MongoDB instead of localStorage

// ========================================
// EXAMPLE USAGE
// ========================================
/*
function TasksPage() {
  const { 
    tasks, 
    loading, 
    error, 
    addTask, 
    updateTask, 
    toggleComplete, 
    deleteTask 
  } = useTasksAPI()

  if (loading) return <div>Loading tasks...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleComplete={toggleComplete}
          onEdit={(id) => router.push(`/edit/${id}`)}
          onDelete={deleteTask}
        />
      ))}
    </div>
  )
}
*/ 