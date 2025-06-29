"use client"

import { getContrastColor } from "@/lib/getContrastColor"
import { useState } from "react"
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog"

export interface Task {
  id: string
  title: string
  description: string
  createdAt: Date
  dueDate?: Date
  priority: "Low" | "Medium" | "High"
  status: "To Do" | "In Progress" | "Done"
  tags: Array<{ name: string; color: string }>
  completed: boolean
}

interface TaskCardProps {
  task: Task
  onToggleComplete: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  return (
    <>
      <div
        className={`
        bg-white/10 dark:bg-black/10 border border-black/20 dark:border-white/20 rounded-xl backdrop-blur-md p-3 sm:p-4
        hover:shadow-lg hover:scale-[1.02] hover:bg-white/15 dark:hover:bg-black/15 transition-all duration-200
        ${task.completed ? "opacity-60" : ""}
      `}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-2">
            <h3 className={`font-semibold text-base sm:text-lg text-high-contrast break-words ${task.completed ? "line-through" : ""}`}>
              {task.title}
            </h3>
            <p className={`text-sm text-medium-contrast line-clamp-2 break-words ${task.completed ? "line-through" : ""}`}>
              {task.description}
            </p>
            <p className="text-xs text-low-contrast break-words">Created: {task.createdAt.toLocaleDateString()}</p>
          </div>

          {/* Right column - Badges and actions */}
          <div className="space-y-2 sm:space-y-3">
            {/* Priority and Status badges - responsive text */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              <div className="rounded-full bg-transparent">
                <span className="block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-black dark:text-white break-words">
                  {task.priority}
                </span>
              </div>
              <div className="rounded-full bg-transparent">
                <span className="block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-black dark:text-white break-words">
                  {task.status}
                </span>
              </div>
            </div>

            {/* Due date - responsive text */}
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {task.dueDate && (
                <div className="rounded-full bg-transparent">
                  <span className="block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-black dark:text-white break-words">
                    Due: {task.dueDate.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Tags - responsive text and spacing */}
            {task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-xs sm:text-sm font-medium break-words"
                    style={{
                      backgroundColor: tag.color,
                      color: getContrastColor(tag.color),
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons - responsive sizing */}
            <div className="flex gap-1 sm:gap-2 justify-end">
              <button
                onClick={() => onToggleComplete(task.id)}
                className="w-6 h-6 sm:w-6 sm:h-6 border border-black/20 dark:border-white/20 rounded bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-colors text-xs flex items-center justify-center"
                title={task.completed ? "Mark incomplete" : "Mark complete"}
              >
                ✓
              </button>
              <button
                onClick={() => onEdit(task.id)}
                className="w-6 h-6 sm:w-6 sm:h-6 border border-black/20 dark:border-white/20 rounded bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-colors text-xs flex items-center justify-center"
                title="Edit task"
              >
                E
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-6 h-6 sm:w-6 sm:h-6 border border-black/20 dark:border-white/20 rounded bg-transparent hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 transition-colors text-xs flex items-center justify-center"
                title="Delete task"
              >
                D
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={() => {
          onDelete(task.id)
          setShowDeleteDialog(false)
        }}
        taskTitle={task.title}
      />
    </>
  )
}
