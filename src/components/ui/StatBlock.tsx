interface StatBlockProps {
  label: string
  value: string | number
  unit?: string
  sublabel?: string
  className?: string
}

export function StatBlock({ label, value, unit, sublabel, className = '' }: StatBlockProps) {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <span className="text-xs font-rajdhani text-gray-500 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono text-gray-100">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-rajdhani text-gray-400">
            {unit}
          </span>
        )}
      </div>
      {sublabel && (
        <span className="text-xs text-gray-500">
          {sublabel}
        </span>
      )}
    </div>
  )
}