interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-surface-100 border border-surface-300 rounded-lg p-4 ${onClick ? 'cursor-pointer hover:border-accent transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  )
}