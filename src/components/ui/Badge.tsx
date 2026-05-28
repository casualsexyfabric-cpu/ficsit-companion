type BadgeVariant = 'default' | 'ok' | 'warn' | 'error' | 'info' | 'accent'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-300 text-gray-300',
  ok: 'bg-status-ok/20 text-status-ok border border-status-ok/30',
  warn: 'bg-status-warn/20 text-status-warn border border-status-warn/30',
  error: 'bg-status-error/20 text-status-error border border-status-error/30',
  info: 'bg-status-info/20 text-status-info border border-status-info/30',
  accent: 'bg-accent/20 text-accent border border-accent/30',
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-rajdhani font-semibold ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  )
}