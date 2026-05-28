import { Wifi, WifiOff, Loader2, AlertTriangle } from 'lucide-react'
import type { ConnectionStatus } from '@/types'

interface ConnectionStatusProps {
  status: ConnectionStatus
  className?: string
}

const config = {
  connected: {
    icon: Wifi,
    label: 'Conectado',
    className: 'text-status-ok',
  },
  connecting: {
    icon: Loader2,
    label: 'Conectando...',
    className: 'text-status-warn animate-spin',
  },
  disconnected: {
    icon: WifiOff,
    label: 'Desconectado',
    className: 'text-gray-500',
  },
  error: {
    icon: AlertTriangle,
    label: 'Error de conexión',
    className: 'text-status-error',
  },
}

export function ConnectionStatusIndicator({ status, className = '' }: ConnectionStatusProps) {
  const { icon: Icon, label, className: colorClass } = config[status]

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Icon size={14} className={colorClass} />
      <span className={`text-xs font-rajdhani ${colorClass}`}>
        {label}
      </span>
    </div>
  )
}