"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "./TaskCard"

interface TodoFormProps {
  task?: Partial<Task>
  onSubmit: (taskData: Omit<Task, "id" | "createdAt" | "completed">) => void
  onCancel: () => void
}

export default function TodoForm({ task, onSubmit, onCancel }: TodoFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate?.toISOString().split("T")[0] || "",
    priority: task?.priority || ("Medium" as const),
    status: task?.status || ("To Do" as const),
    tags: task?.tags || [],
    recurring: "None",
  })

  const [newTag, setNewTag] = useState({ name: "", color: "#3b82f6" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      priority: formData.priority,
      status: formData.status,
      tags: formData.tags,
    })
  }

  const addTag = () => {
    if (newTag.name.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, { name: newTag.name.trim(), color: newTag.color }],
      }))
      setNewTag({ name: "", color: "#3b82f6" })
    }
  }

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2 text-high-contrast">
          Title *
        </label>
        <input
          type="text"
          id="title"
          required
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2 text-high-contrast">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-2 text-high-contrast">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
            className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />
        </div>

        <div>
          <label htmlFor="recurring" className="block text-sm font-medium mb-2 text-high-contrast">
            Recurring
          </label>
          <select
            id="recurring"
            value={formData.recurring}
            onChange={(e) => setFormData((prev) => ({ ...prev, recurring: e.target.value }))}
            className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          >
            <option value="None">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-2 text-high-contrast">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value as any }))}
            className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {/* Priority preview badge - NO BORDERS */}
          <div className="mt-3">
            <div className="inline-block rounded-full bg-transparent">
              <span className="block px-3 py-1 rounded-full text-xs font-medium text-black dark:text-white">
                {formData.priority} Priority
              </span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-2 text-high-contrast">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
            className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          {/* Status preview badge - NO BORDERS */}
          <div className="mt-3">
            <div className="inline-block rounded-full bg-transparent">
              <span className="block px-3 py-1 rounded-full text-xs font-medium text-black dark:text-white">
                {formData.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Due date preview badge - NO BORDERS */}
      {formData.dueDate && (
        <div className="mb-4">
          <span className="text-sm font-medium text-high-contrast">Due Date Preview:</span>
          <div className="mt-2">
            <div className="inline-block rounded-full bg-transparent">
              <span className="block px-3 py-1 rounded-full text-xs font-medium text-black dark:text-white">
                Due: {new Date(formData.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recurring preview badge - NO BORDERS */}
      <div className="mb-4">
        <span className="text-sm font-medium text-high-contrast">Recurring Preview:</span>
        <div className="mt-2">
          <div className="inline-block rounded-full bg-transparent">
            <span className="block px-3 py-1 rounded-full text-xs font-medium text-black dark:text-white">
              {formData.recurring === "None" ? "No Recurrence" : `${formData.recurring} Recurring`}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-high-contrast">Tags</label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tag name"
              value={newTag.name}
              onChange={(e) => setNewTag((prev) => ({ ...prev, name: e.target.value }))}
              className="flex-1 px-3 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
            />
            <input
              type="color"
              value={newTag.color}
              onChange={(e) => setNewTag((prev) => ({ ...prev, color: e.target.value }))}
              className="w-12 h-10 border border-black/20 dark:border-white/20 rounded-lg"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: tag.color, color: "#fff" }}
              >
                {tag.name}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="hover:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-black/20 dark:border-white/20 rounded-lg bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors"
        >
          {task ? "Update" : "Create"} Task
        </button>
      </div>
    </form>
  )
}
