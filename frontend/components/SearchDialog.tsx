"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { Task } from "./TaskCard"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

// Hook to get tasks from localStorage for search
function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

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

  return { tasks, isLoaded }
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const { tasks, isLoaded } = useTasks()
  const [query, setQuery] = useState("")
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const router = useRouter()

  // Filter tasks based on search query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredTasks([])
      return
    }

    const searchTerm = query.toLowerCase().trim()
    const filtered = tasks.filter((task) => {
      // Search in title
      const titleMatch = task.title.toLowerCase().includes(searchTerm)

      // Search in description
      const descriptionMatch = task.description.toLowerCase().includes(searchTerm)

      // Search in tags
      const tagMatch = task.tags.some((tag) => tag.name.toLowerCase().includes(searchTerm))

      // Search in status
      const statusMatch = task.status.toLowerCase().includes(searchTerm)

      // Search in priority
      const priorityMatch = task.priority.toLowerCase().includes(searchTerm)

      return titleMatch || descriptionMatch || tagMatch || statusMatch || priorityMatch
    })

    // Sort results: incomplete tasks first, then by relevance
    const sortedFiltered = filtered.sort((a, b) => {
      // Incomplete tasks first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      // Then by title match (exact matches first)
      const aTitle = a.title.toLowerCase()
      const bTitle = b.title.toLowerCase()
      const aTitleExact = aTitle === searchTerm
      const bTitleExact = bTitle === searchTerm

      if (aTitleExact !== bTitleExact) {
        return aTitleExact ? -1 : 1
      }

      // Then by title starts with
      const aTitleStarts = aTitle.startsWith(searchTerm)
      const bTitleStarts = bTitle.startsWith(searchTerm)

      if (aTitleStarts !== bTitleStarts) {
        return aTitleStarts ? -1 : 1
      }

      return 0
    })

    setFilteredTasks(sortedFiltered)
  }, [query, tasks])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // Reset search when dialog opens
  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setFilteredTasks([])
    }
  }, [isOpen])

  const handleTaskClick = (taskId: string) => {
    onClose()
    router.push(`/edit/${taskId}`)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-black/10 dark:border-white/10">
          <input
            type="text"
            placeholder="Search tasks by title, description, tags, status, priority..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 border border-black/20 dark:border-white/20 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white placeholder-black/60 dark:placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:border-transparent"
            autoFocus
          />

          {/* Search Stats */}
          {query.trim() && (
            <div className="mt-2 text-xs text-medium-contrast">
              {filteredTasks.length} result{filteredTasks.length !== 1 ? "s" : ""} found
              {filteredTasks.length > 0 && ` for "${query}"`}
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {!isLoaded ? (
            <div className="p-8 text-center text-medium-contrast">Loading tasks...</div>
          ) : query.trim() === "" ? (
            <div className="p-8 text-center text-medium-contrast">
              <div className="mb-2">🔍 Start typing to search tasks</div>
              <div className="text-xs">Search by title, description, tags, status, or priority</div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-medium-contrast">
              <div className="mb-2">No tasks found matching "{query}"</div>
              <div className="text-xs">Try different keywords or check spelling</div>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors ${
                    task.completed ? "opacity-60" : ""
                  }`}
                  onClick={() => handleTaskClick(task.id)}
                >
                  {/* Task Title */}
                  <h4 className={`font-semibold text-high-contrast mb-2 ${task.completed ? "line-through" : ""}`}>
                    {highlightMatch(task.title, query)}
                  </h4>

                  {/* Task Description */}
                  <p
                    className={`text-sm text-medium-contrast mb-3 line-clamp-2 ${task.completed ? "line-through" : ""}`}
                  >
                    {highlightMatch(task.description, query)}
                  </p>

                  {/* Task Metadata */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {/* Status */}
                    <span className="px-2 py-1 rounded-full bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white">
                      {highlightMatch(task.status, query)}
                    </span>

                    {/* Priority */}
                    <span className="px-2 py-1 rounded-full bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white">
                      {highlightMatch(task.priority, query)} Priority
                    </span>

                    {/* Due Date */}
                    {task.dueDate && (
                      <span className="px-2 py-1 rounded-full bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white">
                        Due: {task.dueDate.toLocaleDateString()}
                      </span>
                    )}

                    {/* Tags */}
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-white text-xs"
                        style={{ backgroundColor: tag.color }}
                      >
                        {highlightMatch(tag.name, query)}
                      </span>
                    ))}
                  </div>

                  {/* Click hint */}
                  <div className="mt-2 text-xs text-low-contrast">Click to edit task</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5">
          <div className="flex justify-between items-center text-xs text-medium-contrast">
            <span>Press ESC to close</span>
            <span>{tasks.length} total tasks</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to highlight matching text
function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text

  const searchTerm = query.toLowerCase().trim()
  const lowerText = text.toLowerCase()
  const index = lowerText.indexOf(searchTerm)

  if (index === -1) return text

  const before = text.slice(0, index)
  const match = text.slice(index, index + searchTerm.length)
  const after = text.slice(index + searchTerm.length)

  return (
    <>
      {before}
      <mark className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">{match}</mark>
      {highlightMatch(after, query)}
    </>
  )
}
