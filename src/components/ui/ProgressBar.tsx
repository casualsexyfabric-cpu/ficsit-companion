interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
}

function getColorClass(percentage: number) {
  if (percentage >= 90) return 'bg-status-error'
  if (percentage >= 75) return 'bg-status-warn'
  return 'bg-status-ok'
}

export function ProgressBar({ value, max = 100, className = '', showLabel = false }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const colorClass = getColorClass(percentage)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-surface-300 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-gray-400 w-10 text-right">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  )
}