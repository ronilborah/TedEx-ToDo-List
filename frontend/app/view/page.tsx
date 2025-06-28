"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTasks } from "@/hooks/useTasksAPI"
import TaskCard, { type Task } from "@/components/TaskCard"
import BackgroundRenderer from "@/components/BackgroundRenderer"
import { useTheme } from "@/contexts/ThemeContext"
import { VscSortPrecedence, VscFilter, VscColorMode, VscSearch } from "react-icons/vsc"
import { MdArrowBack } from "react-icons/md"

const sortOptions = [
    { value: "createdAt", label: "Date Created" },
    { value: "dueDate", label: "Due Date" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
]

const priorityOrder = { High: 1, Medium: 2, Low: 3 }
const statusOrder = { "To Do": 1, "In Progress": 2, Done: 3 }

export default function ViewPage() {
    const { tasks, loading, error } = useTasks()
    const { theme, toggleTheme } = useTheme()
    const [sortBy, setSortBy] = useState("createdAt")
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
    const [filterPriority, setFilterPriority] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [search, setSearch] = useState("")
    const [showFilter, setShowFilter] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const router = useRouter()

    // Sorting logic
    const sortedTasks = useMemo(() => {
        let filtered = tasks
        if (filterPriority) filtered = filtered.filter(t => t.priority === filterPriority)
        if (filterStatus) filtered = filtered.filter(t => t.status === filterStatus)
        if (search) {
            const s = search.toLowerCase()
            filtered = filtered.filter(t =>
                t.title.toLowerCase().includes(s) ||
                t.description.toLowerCase().includes(s) ||
                t.tags.some(tag => tag.name.toLowerCase().includes(s))
            )
        }
        return [...filtered].sort((a, b) => {
            if (sortBy === "createdAt") {
                return sortDir === "asc"
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            if (sortBy === "dueDate") {
                if (!a.dueDate && !b.dueDate) return 0
                if (!a.dueDate) return 1
                if (!b.dueDate) return -1
                return sortDir === "asc"
                    ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                    : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
            }
            if (sortBy === "priority") {
                return sortDir === "asc"
                    ? priorityOrder[a.priority] - priorityOrder[b.priority]
                    : priorityOrder[b.priority] - priorityOrder[a.priority]
            }
            if (sortBy === "status") {
                return sortDir === "asc"
                    ? statusOrder[a.status] - statusOrder[b.status]
                    : statusOrder[b.status] - statusOrder[a.status]
            }
            return 0
        })
    }, [tasks, sortBy, sortDir, filterPriority, filterStatus, search])

    return (
        <div className="min-h-screen">
            <BackgroundRenderer />
            <div className="fixed top-4 left-4 z-50">
                <button
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/80 dark:bg-black/80 border border-black/30 dark:border-white/30 shadow hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white"
                    onClick={() => router.push("/tasks")}
                    title="Back to Tasks"
                >
                    <MdArrowBack size={20} />
                    <span className="hidden sm:inline">Back</span>
                </button>
            </div>
            <div className="min-h-screen relative" style={{ filter: "brightness(1.43)" }}>
                {/* Consistent dock positioning - responsive layout */}
                <div className="fixed top-4 right-4 z-50">
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 items-center rounded-2xl border border-black/30 dark:border-white/30 py-2 px-2 sm:px-3 bg-white/80 dark:bg-black/80">
                        {/* Sort button - responsive text */}
                        <button
                            className="flex items-center gap-1 px-1 sm:px-2 py-1 text-xs sm:text-sm rounded hover:bg-black/10 dark:hover:bg-white/10"
                            onClick={() => setSortDir(d => (d === "asc" ? "desc" : "asc"))}
                            title={`Sort: ${sortBy} (${sortDir})`}
                        >
                            <VscSortPrecedence size={16} className="sm:w-[18px] sm:h-[18px]" />
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="bg-transparent outline-none text-xs sm:text-sm min-w-0"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <span className="text-xs sm:text-sm">{sortDir === "asc" ? "↑" : "↓"}</span>
                        </button>
                        {/* Filter button */}
                        <button
                            className="flex items-center gap-1 px-1 sm:px-2 py-1 text-xs sm:text-sm rounded hover:bg-black/10 dark:hover:bg-white/10"
                            onClick={() => setShowFilter(f => !f)}
                            title="Filter"
                        >
                            <VscFilter size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        {/* Search button */}
                        <button
                            className="flex items-center gap-1 px-1 sm:px-2 py-1 text-xs sm:text-sm rounded hover:bg-black/10 dark:hover:bg-white/10"
                            onClick={() => setShowSearch(s => !s)}
                            title="Search"
                        >
                            <VscSearch size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                        {/* Dark/Light mode toggle */}
                        <button
                            className="flex items-center gap-1 px-1 sm:px-2 py-1 text-xs sm:text-sm rounded hover:bg-black/10 dark:hover:bg-white/10"
                            onClick={toggleTheme}
                            title="Toggle Theme"
                        >
                            <VscColorMode size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </button>
                    </div>
                </div>

                {/* Filter panel - responsive positioning and sizing */}
                {showFilter && (
                    <div className="fixed top-20 right-4 z-50 bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col gap-2 min-w-[180px] sm:min-w-[200px] max-w-[calc(100vw-2rem)]">
                        <label className="text-xs font-semibold">Priority</label>
                        <select
                            value={filterPriority}
                            onChange={e => setFilterPriority(e.target.value)}
                            className="bg-transparent border rounded px-2 py-1 text-sm"
                        >
                            <option value="">All</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                        <label className="text-xs font-semibold mt-2">Status</label>
                        <select
                            value={filterStatus}
                            onChange={e => setFilterStatus(e.target.value)}
                            className="bg-transparent border rounded px-2 py-1 text-sm"
                        >
                            <option value="">All</option>
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                        </select>
                    </div>
                )}

                {/* Search panel - responsive positioning and sizing */}
                {showSearch && (
                    <div className="fixed top-20 right-4 z-50 bg-white dark:bg-black border border-black/20 dark:border-white/20 rounded-xl p-3 sm:p-4 shadow-lg flex flex-col gap-2 min-w-[180px] sm:min-w-[200px] max-w-[calc(100vw-2rem)]">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="bg-transparent border rounded px-2 py-1 text-sm"
                            autoFocus
                        />
                    </div>
                )}

                {/* Main content: grid of cards - responsive layout */}
                <div className="px-4 sm:pl-8 sm:pr-4 py-8 pt-4 sm:pt-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-4 sm:mb-8 p-3 sm:p-4 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-high-contrast break-words">View Tasks</h1>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                            {sortedTasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggleComplete={() => { }}
                                    onEdit={() => { }}
                                    onDelete={() => { }}
                                />
                            ))}
                            {sortedTasks.length === 0 && (
                                <div className="col-span-full text-center py-8 sm:py-12 p-4 sm:p-6 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl border border-black/20 dark:border-white/20">
                                    <p className="text-medium-contrast text-base sm:text-lg break-words">No tasks found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 