// ========================================
// API INTEGRATION EXAMPLE
// ========================================
// This file shows how to migrate from localStorage to the backend API
// Uncomment and modify the code below to use the backend instead of localStorage

/*
import { useState, useEffect } from "react"
import type { Task } from "@/components/TaskCard"

// API base URL - update this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6900/api'

// API response types
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

interface ApiError {
  success: false
  error: {
    message: string
    statusCode: number
  }
}

// Hook to manage tasks with API persistence
export function useTasksAPI() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tasks from API
  const loadTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${API_BASE_URL}/tasks`)
      const result: ApiResponse<Task[]> = await response.json()

      if (result.success) {
        // Convert date strings back to Date objects
        const tasksWithDates = result.data.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }))
        setTasks(tasksWithDates)
      } else {
        throw new Error(result.message || 'Failed to load tasks')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
      console.error('Failed to load tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load tasks on mount
  useEffect(() => {
    loadTasks()
  }, [])

  // Add new task
  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "completed">) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      const result: ApiResponse<Task> = await response.json()

      if (result.success) {
        const newTask = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
        }
        setTasks(prev => [newTask, ...prev])
        return newTask.id
      } else {
        throw new Error(result.message || 'Failed to create task')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      console.error('Failed to create task:', err)
      throw err
    }
  }

  // Update task
  const updateTask = async (id: string, taskData: Partial<Omit<Task, "id" | "createdAt" | "completed">>) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      const result: ApiResponse<Task> = await response.json()

      if (result.success) {
        const updatedTask = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
        }
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
        return updatedTask
      } else {
        throw new Error(result.message || 'Failed to update task')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      console.error('Failed to update task:', err)
      throw err
    }
  }

  // Toggle task completion
  const toggleComplete = async (id: string) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
        method: 'PATCH',
      })

      const result: ApiResponse<Task> = await response.json()

      if (result.success) {
        const updatedTask = {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
          dueDate: result.data.dueDate ? new Date(result.data.dueDate) : undefined,
        }
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task))
      } else {
        throw new Error(result.message || 'Failed to toggle task')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle task')
      console.error('Failed to toggle task:', err)
    }
  }

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      setError(null)

      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      })

      const result: ApiResponse<null> = await response.json()

      if (result.success) {
        setTasks(prev => prev.filter(task => task.id !== id))
      } else {
        throw new Error(result.message || 'Failed to delete task')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      console.error('Failed to delete task:', err)
    }
  }

  // Get task by ID
  const getTask = (id: string) => {
    return tasks.find(task => task.id === id)
  }

  // Get task statistics
  const getStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/stats`)
      const result: ApiResponse<{
        total: number
        completed: number
        pending: number
        overdue: number
        completionRate: number
      }> = await response.json()

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.message || 'Failed to get stats')
      }
    } catch (err) {
      console.error('Failed to get stats:', err)
      return null
    }
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
    refreshTasks: loadTasks,
  }
}
*/

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