"use client"

interface StatusCountersProps {
  completed: number
  pending: number
  overdue: number
}

export default function StatusCounters({ completed, pending, overdue }: StatusCountersProps) {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8 mt-4">
      {/* Completed */}
      <div className="flex flex-col items-center">
        <span className="text-2xl lg:text-4xl font-semibold text-high-contrast">{completed}</span>
        <span className="text-sm lg:text-base uppercase tracking-wide text-medium-contrast">Completed</span>
      </div>

      {/* Pending */}
      <div className="flex flex-col items-center">
        <span className="text-2xl lg:text-4xl font-semibold text-high-contrast">{pending}</span>
        <span className="text-sm lg:text-base uppercase tracking-wide text-medium-contrast">Pending</span>
      </div>

      {/* Overdue */}
      <div className="flex flex-col items-center">
        <span className="text-2xl lg:text-4xl font-semibold text-high-contrast">{overdue}</span>
        <span className="text-sm lg:text-base uppercase tracking-wide text-medium-contrast">Overdue</span>
      </div>
    </div>
  )
}
