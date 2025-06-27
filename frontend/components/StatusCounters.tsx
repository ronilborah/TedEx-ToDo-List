"use client"

interface StatusCountersProps {
  completed: number
  pending: number
  overdue: number
}

export default function StatusCounters({ completed, pending, overdue }: StatusCountersProps) {
  return (
    <div className="flex gap-8 mb-8">
      <div className="text-center">
        <div className="text-2xl font-bold text-high-contrast">{completed}</div>
        <div className="text-sm text-medium-contrast">Completed</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-high-contrast">{pending}</div>
        <div className="text-sm text-medium-contrast">Pending</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-high-contrast">{overdue}</div>
        <div className="text-sm text-medium-contrast">Overdue</div>
      </div>
    </div>
  )
}
