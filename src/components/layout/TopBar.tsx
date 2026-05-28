import { useNavigate } from 'react-router-dom'
import { Bell, Settings, Zap } from 'lucide-react'
import { ProgressBar } from '@/components/ui'
import { ConnectionStatusIndicator } from '@/components/ui'
import { useAppStore } from '@/store'
import { usePowerData } from '@/hooks/useSatisfactoryAPI'

export function TopBar() {
  const navigate = useNavigate()
  const connectionStatus = useAppStore((s) => s.connectionStatus)
  const alerts = useAppStore((s) => s.alerts)
  const activeAlerts = alerts.filter((a) => a.isActive)

  const { data: powerData } = usePowerData()

  const totalConsumption = powerData?.circuits.reduce((acc, c) => acc + c.consumption, 0) ?? 0
  const totalCapacity = powerData?.circuits.reduce((acc, c) => acc + c.capacity, 0) ?? 0
  const percentage = totalCapacity > 0 ? (totalConsumption / totalCapacity) * 100 : 0

  return (
    <header className="h-14 bg-surface-100 border-b border-surface-300 flex items-center px-4 gap-6 shrink-0">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer shrink-0"
        onClick={() => navigate('/')}
      >
        <Zap size={18} className="text-accent" />
        <span className="font-rajdhani font-bold text-accent text-lg tracking-wider">
          FICSIT
        </span>
        <span className="font-rajdhani text-gray-500 text-lg">
          COMPANION
        </span>
      </div>

      <div className="w-px h-6 bg-surface-300" />

      {/* Balance eléctrico */}
      {powerData ? (
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-gray-500" />
            <span className="font-mono text-sm text-gray-100">
              {totalConsumption.toFixed(0)}
            </span>
            <span className="text-xs text-gray-500">/</span>
            <span className="font-mono text-sm text-gray-400">
              {totalCapacity.toFixed(0)}
            </span>
            <span className="text-xs font-rajdhani text-gray-500">MW</span>
          </div>

          <div className="w-32">
            <ProgressBar value={percentage} max={100} showLabel />
          </div>

          {/* Circuitos */}
          <div className="flex items-center gap-1">
            {powerData.circuits.map((circuit) => {
              const pct = circuit.capacity > 0
                ? (circuit.consumption / circuit.capacity) * 100
                : 0
              const color =
                circuit.fuseTriggered
                  ? 'bg-status-error'
                  : pct >= 90
                  ? 'bg-status-error'
                  : pct >= 75
                  ? 'bg-status-warn'
                  : 'bg-status-ok'
              return (
                <div
                  key={circuit.id}
                  title={`Circuito ${circuit.id}: ${pct.toFixed(0)}%`}
                  className={`w-2 h-2 rounded-full ${color}`}
                />
              )
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center">
          <span className="text-xs text-gray-600 font-rajdhani">
            Sin datos eléctricos
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 shrink-0">
        <ConnectionStatusIndicator status={connectionStatus} />

        {/* Badge de alertas */}
        <button
          onClick={() => navigate('/alertas')}
          className="relative p-1.5 hover:bg-surface-200 rounded transition-colors"
        >
          <Bell size={16} className="text-gray-400" />
          {activeAlerts.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-status-error text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {activeAlerts.length > 9 ? '9+' : activeAlerts.length}
            </span>
          )}
        </button>

        {/* Configuración */}
        <button
          onClick={() => navigate('/configuracion')}
          className="p-1.5 hover:bg-surface-200 rounded transition-colors"
        >
          <Settings size={16} className="text-gray-400" />
        </button>
      </div>
    </header>
  )
}