"use client"

interface StatusCountersProps {
  completed: number
  pending: number
  overdue: number
}

export default function StatusCounters({ completed, pending, overdue }: StatusCountersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-4 sm:mb-8 p-4 sm:p-6 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl">
      <div className="text-center">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-high-contrast">{completed}</div>
        <div className="text-sm sm:text-base text-medium-contrast break-words">Completed</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-high-contrast">{pending}</div>
        <div className="text-sm sm:text-base text-medium-contrast break-words">Pending</div>
      </div>
      <div className="text-center">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-high-contrast">{overdue}</div>
        <div className="text-sm sm:text-base text-medium-contrast break-words">Overdue</div>
      </div>
    </div>
  )
}
